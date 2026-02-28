import { useQuery } from '@tanstack/react-query';
import { MOCK_MARKETS, MOCK_WEATHER, MOCK_SUMMARY } from '@/lib/mock-data';
import { fetchRealNews, fetchRealTweets, NewsItem, Tweet } from '@/services/ai-service';

export type { NewsItem, Tweet };

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
      const news = await fetchRealNews();
      return news.length > 0 ? news : [];
    },
    refetchInterval: 300000, // 5m
  });
};

export const useTweets = () => {
  return useQuery({
    queryKey: ['tweets'],
    queryFn: async () => {
      const tweets = await fetchRealTweets();
      return tweets.length > 0 ? tweets : [];
    },
    refetchInterval: 300000, // 5m
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

export interface Flight {
  id: string;
  callsign: string;
  lat: number;
  lng: number;
  heading: number;
  type: 'military' | 'commercial' | 'drone';
  altitude: number;
  speed: number;
}

// Initial flight positions
const INITIAL_FLIGHTS: Flight[] = [
  { id: 'f1', callsign: 'FORTE10', lat: 25.2, lng: 55.3, heading: 315, type: 'drone', altitude: 52000, speed: 340 }, // Global Hawk near UAE
  { id: 'f2', callsign: 'HOMER31', lat: 29.5, lng: 48.0, heading: 90, type: 'military', altitude: 31000, speed: 450 }, // RC-135 near Kuwait
  { id: 'f3', callsign: 'USAF88', lat: 26.8, lng: 51.5, heading: 300, type: 'military', altitude: 28000, speed: 520 }, // Tanker/Fighter over Gulf
  { id: 'f4', callsign: 'QTR123', lat: 27.5, lng: 52.5, heading: 45, type: 'commercial', altitude: 38000, speed: 480 }, // Commercial
  { id: 'f5', callsign: 'UAE55', lat: 26.0, lng: 54.0, heading: 270, type: 'commercial', altitude: 36000, speed: 460 }, // Commercial
];

export const useFlights = () => {
  return useQuery({
    queryKey: ['flights'],
    queryFn: async () => {
      try {
        // Fetch real data from OpenSky Network for the Iran/Gulf region
        // Bounding box: Lat 24-40, Lon 44-64
        const response = await fetch('https://opensky-network.org/api/states/all?lamin=24&lomin=44&lamax=40&lomax=64');
        
        if (!response.ok) {
          throw new Error('OpenSky API failed');
        }

        const data = await response.json();
        
        if (!data.states) return [];

        return data.states.map((state: any) => {
          const callsign = (state[1] || '').trim();
          
          // Simple heuristic to guess type based on callsign
          let type: 'military' | 'commercial' | 'drone' = 'commercial';
          if (callsign.startsWith('FORTE') || callsign.startsWith('Q4') || callsign.startsWith('UAV')) {
            type = 'drone';
          } else if (
            callsign.startsWith('HOMER') || 
            callsign.startsWith('USAF') || 
            callsign.startsWith('NATO') ||
            callsign.startsWith('RCH')
          ) {
            type = 'military';
          }

          return {
            id: state[0],
            callsign: callsign || 'UNK',
            lat: state[6],
            lng: state[5],
            heading: state[10] || 0,
            type,
            altitude: Math.round((state[7] || 0) * 3.28084), // Convert meters to feet
            speed: Math.round((state[9] || 0) * 1.94384), // Convert m/s to knots
          };
        }).slice(0, 100); // Limit to 100 aircraft to prevent performance issues
      } catch (error) {
        console.error('Flight fetch failed, falling back to empty', error);
        return [];
      }
    },
    refetchInterval: 15000, // 15s update rate
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
