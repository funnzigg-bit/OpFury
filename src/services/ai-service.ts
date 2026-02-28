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

export const fetchRealNews = async (): Promise<NewsItem[]> => {
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
    return data.map((item: any, index: number) => ({
      id: `news-${Date.now()}-${index}`,
      ...item,
      time: validateTime(item.time)
    }));
  } catch (error) {
    console.error("Failed to fetch real news:", error);
    return [];
  }
};

export const fetchRealTweets = async (): Promise<Tweet[]> => {
  if (!ai) {
    console.warn("Gemini API Key missing - returning empty tweets");
    return [];
  }
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Find 5 highly popular and viral tweets (with high engagement) specifically about the current US vs Iran situation, Operation Epic Fury, or recent strikes. Focus on major updates, breaking news, or viral combat footage. Include author name, handle, content, estimated time, likes count (should be high), and retweets count. Also try to find if they have media (video/image). Return a valid JSON array (without markdown formatting) where each object has: author, handle, content, time, likes, retweets, mediaType (video, image, or none).",
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    let text = response.text || "[]";
    // Clean markdown code blocks if present
    text = text.replace(/```json\n?|\n?```/g, "").trim();

    const data = JSON.parse(text);
    return data.map((item: any, index: number) => ({
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
  } catch (error) {
    console.error("Failed to fetch real tweets:", error);
    return [];
  }
};
