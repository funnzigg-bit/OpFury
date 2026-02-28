import { useQuery } from '@tanstack/react-query';
import { MOCK_NEWS, MOCK_TWEETS, MOCK_MARKETS, MOCK_WEATHER, MOCK_SUMMARY } from '@/lib/mock-data';

// Types
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
}

export interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface WeatherData {
  location: string;
  temp: number;
  condition: string;
  windSpeed: number;
  windDir: string;
}

export interface AISummary {
  text: string;
  lastUpdated: string;
}

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Hooks
export const useNews = () => {
  return useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      await delay(500);
      return MOCK_NEWS;
    },
    refetchInterval: 60000, // 1m
  });
};

export const useTweets = () => {
  return useQuery({
    queryKey: ['tweets'],
    queryFn: async () => {
      await delay(800);
      // Simulate live updates by randomly adding a new tweet occasionally
      const newTweet = Math.random() > 0.7 ? {
        id: `new-${Date.now()}`,
        author: "Live Alert",
        handle: "@LiveIntel",
        content: "NEW: Air raid sirens sounding in western Tehran.",
        time: new Date().toISOString(),
        likes: 0,
        retweets: 0
      } : null;
      
      return newTweet ? [newTweet, ...MOCK_TWEETS] : MOCK_TWEETS;
    },
    refetchInterval: 30000, // 30s
  });
};

export const useMarkets = () => {
  return useQuery({
    queryKey: ['markets'],
    queryFn: async () => {
      await delay(300);
      // Simulate price fluctuation
      return MOCK_MARKETS.map(stock => ({
        ...stock,
        price: stock.price + (Math.random() - 0.5) * 2,
        change: stock.change + (Math.random() - 0.5) * 0.5
      }));
    },
    refetchInterval: 5000, // 5s for markets
  });
};

export const useWeather = () => {
  return useQuery({
    queryKey: ['weather'],
    queryFn: async () => {
      await delay(400);
      return MOCK_WEATHER;
    },
    refetchInterval: 300000, // 5m
  });
};

export const useSummary = () => {
  return useQuery({
    queryKey: ['summary'],
    queryFn: async () => {
      await delay(600);
      return MOCK_SUMMARY;
    },
    refetchInterval: 300000, // 5m
  });
};
