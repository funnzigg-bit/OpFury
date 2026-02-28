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
const NEWS_CACHE_KEY = 'ai_news_cache_v4';
const TWEETS_CACHE_KEY = 'ai_tweets_cache_v4';
const SUMMARY_CACHE_KEY = 'ai_summary_cache_v4';

export interface AISummary {
  text: string;
  lastUpdated: string;
}

export const fetchRealSummary = async (): Promise<AISummary> => {
  const cachedSummary = getFromCache<AISummary>(SUMMARY_CACHE_KEY);
  if (cachedSummary) return cachedSummary;

  if (!ai) {
    return { text: "AI service unavailable.", lastUpdated: new Date().toISOString() };
  }

  try {
    console.log("Fetching real summary from Gemini...");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Provide a concise 2-sentence summary of the current geopolitical situation in the Middle East, focusing on US-Iran tensions. Be factual and neutral.",
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const text = response.text || "No summary available.";
    const summary = {
      text: text,
      lastUpdated: new Date().toISOString()
    };

    saveToCache(SUMMARY_CACHE_KEY, summary);
    return summary;
  } catch (error) {
    console.error("Failed to fetch summary:", error);
    return { text: "Failed to load summary.", lastUpdated: new Date().toISOString() };
  }
};

interface CacheEntry<T> {
  timestamp: number;
  data: T;
}
// ... existing code ...
export const fetchRealNews = async (): Promise<NewsItem[]> => {
  // 1. Try Cache First
  const cachedNews = getFromCache<NewsItem[]>(NEWS_CACHE_KEY);
  if (cachedNews) return cachedNews;

  if (!ai) {
    console.warn("Gemini API Key missing - returning empty news");
    return [];
  }
  try {
    console.log("Fetching real news from Gemini...");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "You are a news aggregator. Use Google Search to find the absolute latest 8 breaking news headlines about the Middle East, US-Iran tensions, or major global conflicts from the last 24 hours. \n\nCRITICAL: You MUST use the googleSearch tool. Do not generate fictional news. If you cannot find recent news, return an empty array.\n\nReturn a valid JSON array (without markdown formatting) where each object has: title, source, time (ISO string), category (strikes, shipping, politics, or other), and url.",
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    let text = response.text || "[]";
    console.log("Gemini News Response:", text.substring(0, 100) + "...");
    
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
    // ... error handling ...
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
    console.log("Fetching real tweets from Gemini...");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "You are a social media monitor. Use Google Search to find 5 real, recent, high-engagement social media posts or news updates regarding the Middle East situation from the last 24 hours. \n\nCRITICAL: You MUST use the googleSearch tool. Do not invent tweets. \n\nReturn the data STRICTLY as a raw JSON array (no markdown). Each object must have: author, handle, content, time, likes (integer), retweets (integer), mediaType ('video', 'image', or 'none').",
      config: {
        tools: [{ googleSearch: {} }],
      }
    });
// ... existing code ...

    let text = response.text || "[]";
    console.log("Gemini Tweets Response:", text.substring(0, 100) + "...");
    
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
