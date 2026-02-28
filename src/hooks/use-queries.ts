import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// API Client
const api = axios.create({
  baseURL: '/api',
});

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

// Hooks
export const useNews = () => {
  return useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const { data } = await api.get<NewsItem[]>('/news');
      return data;
    },
    refetchInterval: 60000, // 1m
  });
};

export const useTweets = () => {
  return useQuery({
    queryKey: ['tweets'],
    queryFn: async () => {
      const { data } = await api.get<Tweet[]>('/tweets');
      return data;
    },
    refetchInterval: 120000, // 2m
  });
};

export const useMarkets = () => {
  return useQuery({
    queryKey: ['markets'],
    queryFn: async () => {
      const { data } = await api.get<StockData[]>('/markets');
      return data;
    },
    refetchInterval: 30000, // 30s
  });
};

export const useWeather = () => {
  return useQuery({
    queryKey: ['weather'],
    queryFn: async () => {
      const { data } = await api.get<WeatherData[]>('/weather');
      return data;
    },
    refetchInterval: 300000, // 5m
  });
};

export const useSummary = () => {
  return useQuery({
    queryKey: ['summary'],
    queryFn: async () => {
      const { data } = await api.get<AISummary>('/summary');
      return data;
    },
    refetchInterval: 300000, // 5m
  });
};
