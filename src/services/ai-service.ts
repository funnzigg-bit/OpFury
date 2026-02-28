import { GoogleGenAI, Type } from "@google/genai";

// Safely initialize AI client
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  category: 'strikes' | 'shipping' | 'politics' | 'other';
  url: string;
}

export interface Tweet {
  id: string;
  author: string;
  handle: string;
  content: string;
  time: string;
  likes: number;
  retweets: number;
  media?: {
    type: 'video' | 'image';
    thumbnailUrl: string;
    videoUrl?: string;
  };
}

// Helper to validate time
const validateTime = (timeStr: any): string => {
  if (!timeStr) return new Date().toISOString();
  const date = new Date(timeStr);
  if (isNaN(date.getTime())) {
    return new Date().toISOString();
  }
  return date.toISOString();
};

// Cache keys and duration (30 minutes)
const CACHE_DURATION = 30 * 60 * 1000;
const NEWS_CACHE_KEY = 'ai_news_cache_v2';
const TWEETS_CACHE_KEY = 'ai_tweets_cache_v2';

interface CacheEntry<T> {
  timestamp: number;
  data: T;
}

const getFromCache = <T>(key: string): T | null => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const entry: CacheEntry<T> = JSON.parse(cached);
    const now = Date.now();
    
    if (now - entry.timestamp < CACHE_DURATION) {
      console.log(`[Cache Hit] Returning cached data for ${key}`);
      return entry.data;
    }
    return null;
  } catch (e) {
    return null;
  }
};

const saveToCache = <T>(key: string, data: T) => {
  try {
    const entry: CacheEntry<T> = {
      timestamp: Date.now(),
      data
    };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch (e) {
    console.error("Failed to save to cache", e);
  }
};

export const fetchRealNews = async (): Promise<NewsItem[]> => {
  // 1. Try Cache First
  const cachedNews = getFromCache<NewsItem[]>(NEWS_CACHE_KEY);
  if (cachedNews) return cachedNews;

  if (!ai) {
    console.warn("Gemini API Key missing - returning empty news");
    return [];
  }
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Find the latest 8 breaking news headlines about the US-Iran conflict, Operation Epic Fury, or Middle East tensions from the last 24 hours. Return a valid JSON array (without markdown formatting) where each object has: title, source, time (ISO string), category (strikes, shipping, politics, or other), and url.",
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    let text = response.text || "[]";
    // Clean markdown code blocks if present
    text = text.replace(/```json\n?|\n?```/g, "").trim();
    
    const data = JSON.parse(text);
    const newsItems = data.map((item: any, index: number) => ({
      id: `news-${Date.now()}-${index}`,
      ...item,
      time: validateTime(item.time)
    }));

    // 2. Save to Cache on Success
    if (newsItems.length > 0) {
      saveToCache(NEWS_CACHE_KEY, newsItems);
    }
    
    return newsItems;
  } catch (error: any) {
    // Check for rate limits (429) or quota exhaustion
    const isRateLimit = 
      error?.status === 429 || 
      error?.code === 429 ||
      error?.message?.includes('429') || 
      error?.message?.includes('quota') ||
      error?.status === "RESOURCE_EXHAUSTED";

    if (isRateLimit) {
       console.warn("Gemini Rate Limit Exceeded: Returning empty list (User requested no mock data).");
       return [];
    }
    
    console.error("Failed to fetch real news:", error);
    return [];
  }
};

export const fetchRealTweets = async (): Promise<Tweet[]> => {
  // 1. Try Cache First
  const cachedTweets = getFromCache<Tweet[]>(TWEETS_CACHE_KEY);
  if (cachedTweets) return cachedTweets;

  if (!ai) {
    console.warn("Gemini API Key missing - returning empty tweets");
    return [];
  }
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Retrieve 5 recent, high-engagement social media posts or news updates regarding the current US-Iran situation and Operation Epic Fury from the last 48 hours. Focus on factual reporting and major events. Return the data STRICTLY as a raw JSON array (no markdown, no conversational text). Each object must have: author, handle, content, time, likes (integer), retweets (integer), mediaType ('video', 'image', or 'none').",
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    let text = response.text || "[]";
    
    // Attempt to find JSON array in the text if it's wrapped in text
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      text = jsonMatch[0];
    } else if (text.trim().startsWith("I apologize") || text.trim().startsWith("I cannot")) {
      console.warn("AI refused to generate tweets due to safety filters.");
      return [];
    }

    const data = JSON.parse(text);
    const tweets = data.map((item: any, index: number) => ({
      id: `tweet-${Date.now()}-${index}`,
      author: item.author,
      handle: item.handle,
      content: item.content,
      time: validateTime(item.time),
      likes: item.likes,
      retweets: item.retweets,
      media: item.mediaType !== 'none' ? {
        type: item.mediaType as 'video' | 'image',
        thumbnailUrl: item.mediaType === 'video' 
          ? `https://picsum.photos/seed/video${index}/600/340` 
          : `https://picsum.photos/seed/image${index}/600/340`,
        videoUrl: item.mediaType === 'video' ? '#' : undefined
      } : undefined
    }));

    // 2. Save to Cache on Success
    if (tweets.length > 0) {
      saveToCache(TWEETS_CACHE_KEY, tweets);
    }

    return tweets;
  } catch (error: any) {
    // Check for rate limits (429) or quota exhaustion
    const isRateLimit = 
      error?.status === 429 || 
      error?.code === 429 ||
      error?.message?.includes('429') || 
      error?.message?.includes('quota') ||
      error?.status === "RESOURCE_EXHAUSTED";

    if (isRateLimit) {
       console.warn("Gemini Rate Limit Exceeded: Returning empty list (User requested no mock data).");
       return [];
    }

    console.error("Failed to fetch real tweets:", error);
    return [];
  }
};
