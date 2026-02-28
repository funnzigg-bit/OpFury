import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

export const fetchRealNews = async (): Promise<NewsItem[]> => {
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
      ...item
    }));
  } catch (error) {
    console.error("Failed to fetch real news:", error);
    return [];
  }
};

export const fetchRealTweets = async (): Promise<Tweet[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Find 5 recent viral tweets or social media posts about Operation Epic Fury, US strikes on Iran, or explosions in Tehran. Include author name, handle, content, estimated time, likes count, and retweets count. Also try to find if they have media (video/image). Return a valid JSON array (without markdown formatting) where each object has: author, handle, content, time, likes, retweets, mediaType (video, image, or none).",
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
      time: item.time,
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
