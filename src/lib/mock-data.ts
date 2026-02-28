import { StockData, WeatherData } from '@/hooks/use-queries';

export const MOCK_MARKETS: StockData[] = [
  { symbol: 'LMT', price: 502.45, change: 12.30, changePercent: 2.51 },
  { symbol: 'NOC', price: 455.12, change: 8.75, changePercent: 1.96 },
  { symbol: 'RTX', price: 98.20, change: 1.45, changePercent: 1.50 },
  { symbol: 'OIL (WTI)', price: 82.40, change: 3.20, changePercent: 4.04 },
  { symbol: 'GOLD', price: 2150.00, change: 25.00, changePercent: 1.18 },
];

export const MOCK_WEATHER: WeatherData[] = [
  { location: 'Tehran', temp: 63, condition: 'Clear', windSpeed: 12, windDir: 'WSW' },
  { location: 'Tel Aviv', temp: 72, condition: 'Partly Cloudy', windSpeed: 8, windDir: 'NW' },
  { location: 'Washington DC', temp: 45, condition: 'Rain', windSpeed: 15, windDir: 'NE' },
];
