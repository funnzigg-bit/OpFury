import { NewsItem, Tweet, StockData, WeatherData, AISummary } from '@/hooks/use-queries';

export const MOCK_NEWS: NewsItem[] = [
  { id: '1', title: "Live updates: US and Israel attack Iran as Tehran retaliates across Middle East", source: "CNN", time: new Date(Date.now() - 8 * 60000).toISOString(), category: "strikes", url: "#" },
  { id: '2', title: "2026 Israeli–United States strikes on Iran", source: "Wikipedia", time: new Date(Date.now() - 19 * 60000).toISOString(), category: "strikes", url: "#" },
  { id: '3', title: "Live updates: U.S. and Israel launch attack on Iran as Trump calls for regime change", source: "Washington Post", time: new Date(Date.now() - 12 * 60000).toISOString(), category: "strikes", url: "#" },
  { id: '4', title: "Oil prices surge 5% amid Strait of Hormuz closure fears", source: "Bloomberg", time: new Date(Date.now() - 45 * 60000).toISOString(), category: "shipping", url: "#" },
  { id: '5', title: "Explosions reported near Isfahan nuclear facility", source: "Reuters", time: new Date(Date.now() - 25 * 60000).toISOString(), category: "strikes", url: "#" },
  { id: '6', title: "Iran vows 'crushing response' to 'Zionist aggression'", source: "Al Jazeera", time: new Date(Date.now() - 30 * 60000).toISOString(), category: "politics", url: "#" },
  { id: '7', title: "US Navy shoots down 3 drones in Red Sea", source: "USNI News", time: new Date(Date.now() - 60 * 60000).toISOString(), category: "shipping", url: "#" },
  { id: '8', title: "Global markets rattle as conflict escalates", source: "CNBC", time: new Date(Date.now() - 90 * 60000).toISOString(), category: "other", url: "#" },
];

export const MOCK_TWEETS: Tweet[] = [
  { id: '1', author: "War Monitor", handle: "@WarMonitor3", content: "US airforce just pummelled an Iranian ballistic missile production site in Kermanshah", time: new Date(Date.now() - 5 * 60000).toISOString(), likes: 1200, retweets: 450 },
  { id: '2', author: "OSINT Defender", handle: "@Osint613", content: "U.S. aircraft struck a missile production and launch facility in Kermanshah. Secondary explosions observed.", time: new Date(Date.now() - 10 * 60000).toISOString(), likes: 890, retweets: 320 },
  { id: '3', author: "Intel Source", handle: "@Intelligencer41", content: "Kiriakou cites CIA pal: Trump decided to strike Iran Mon/Tue after 10-day ultimatum.", time: new Date(Date.now() - 15 * 60000).toISOString(), likes: 560, retweets: 120 },
  { id: '4', author: "Aurora Intel", handle: "@AuroraIntel", content: "Reports of air defense activation over Tehran. Multiple interceptions.", time: new Date(Date.now() - 2 * 60000).toISOString(), likes: 2100, retweets: 800 },
  { id: '5', author: "ELINT News", handle: "@ELINTNews", content: "VIDEO: Large explosion seen in the direction of Parchin military complex.", time: new Date(Date.now() - 20 * 60000).toISOString(), likes: 3400, retweets: 1500 },
];

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

export const MOCK_SUMMARY: AISummary = {
  text: "US and Israel launched strikes on Iran under Operation Epic Fury, targeting nuclear and missile sites. Iran retaliated with missiles on US bases. Explosions in Tehran, Kermanshah. Trump calls for regime change.",
  lastUpdated: new Date().toISOString(),
};
