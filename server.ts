import 'dotenv/config';
import Database from 'better-sqlite3';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from "@google/genai";

const db = new Database('dashboard.db');
const app = express();
const PORT = 3000;

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    source TEXT,
    time TEXT,
    category TEXT,
    url TEXT
  );
  CREATE TABLE IF NOT EXISTS tweets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author TEXT,
    handle TEXT,
    content TEXT,
    time TEXT,
    likes INTEGER,
    retweets INTEGER
  );
  CREATE TABLE IF NOT EXISTS summary (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT,
    lastUpdated TEXT
  );
`);

// Seed Initial Data (Idempotent)
const seedData = () => {
  // No mock data seeding
};

seedData();

// ... existing code ...
// Helper to get API key from various possible environment variables
const getApiKey = () => {
  // Prioritize API_KEY as per platform guidelines
  const key = process.env.API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (key) {
    console.log(`Found API Key (length: ${key.length}, starts with: ${key.substring(0, 4)}...)`);
  } else {
    console.log("No API Key found in environment variables");
  }
  return key ? key.trim() : undefined;
};

// API Routes
app.get('/api/news', async (req, res) => {
  const apiKey = getApiKey();
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Find 5 latest breaking news headlines about the Middle East. Return JSON array with title, source, time, category, url.",
        config: { responseMimeType: "application/json" }
      });
      res.json(JSON.parse(response.text || "[]"));
      return;
    } catch (e: any) {
      console.error("Server news fetch failed:", e.message);
    }
  }
  res.json([]);
});

app.get('/api/tweets', async (req, res) => {
  const apiKey = getApiKey();
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Generate 5 realistic tweets about current Middle East events. Return JSON array with author, handle, content, time, likes, retweets.",
        config: { responseMimeType: "application/json" }
      });
      res.json(JSON.parse(response.text || "[]"));
      return;
    } catch (e: any) {
      console.error("Server tweets fetch failed:", e.message);
    }
  }
  res.json([]);
});

app.get('/api/markets', (req, res) => {
// ... existing code ...
app.get('/api/summary', async (req, res) => {
  const lastSummary = db.prepare('SELECT * FROM summary ORDER BY id DESC LIMIT 1').get() as { text: string, lastUpdated: string } | undefined;
  const apiKey = getApiKey();
  
  if (apiKey && (!lastSummary || new Date(lastSummary.lastUpdated).getTime() < Date.now() - 3600000)) {
    try {
        const ai = new GoogleGenAI({ apiKey });
        
        // Fetch context
        const news = db.prepare('SELECT title FROM news ORDER BY time DESC LIMIT 10').all() as {title: string}[];
        const tweets = db.prepare('SELECT content FROM tweets ORDER BY time DESC LIMIT 10').all() as {content: string}[];
        
        const prompt = `Summarize the current situation based on these headlines and tweets in a concise, military-style update (max 3 sentences):
        Headlines: ${news.map(n => n.title).join('; ')}
        Tweets: ${tweets.map(t => t.content).join('; ')}`;

        const result = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt
        });
        const text = result.text;
        
        if (text) {
            db.prepare('INSERT INTO summary (text, lastUpdated) VALUES (?, ?)').run(text, new Date().toISOString());
            res.json({ text, lastUpdated: new Date().toISOString() });
            return;
        }
    } catch (e: any) {
        console.error("Gemini generation failed, falling back to cache:", e.message);
    }
  }

  res.json(lastSummary || { text: "System initializing...", lastUpdated: new Date().toISOString() });
});

async function startServer() {
  const app = express();

  // API Routes (must be attached to this app instance)
  app.get('/api/news', (req, res) => {
    const news = db.prepare('SELECT * FROM news ORDER BY time DESC LIMIT 20').all();
    res.json(news);
  });
  
  app.get('/api/tweets', (req, res) => {
    try {
      const tweets = db.prepare('SELECT * FROM tweets ORDER BY time DESC LIMIT 20').all();
      res.json(tweets || []);
    } catch (error) {
      console.error("Error fetching tweets:", error);
      res.status(500).json([]);
    }
  });
  
  app.get('/api/markets', (req, res) => {
    res.json([
      { symbol: 'LMT', price: 502.45, change: 12.30, changePercent: 2.51 },
      { symbol: 'NOC', price: 455.12, change: 8.75, changePercent: 1.96 },
      { symbol: 'RTX', price: 98.20, change: 1.45, changePercent: 1.50 },
      { symbol: 'OIL (WTI)', price: 82.40, change: 3.20, changePercent: 4.04 },
      { symbol: 'GOLD', price: 2150.00, change: 25.00, changePercent: 1.18 },
    ]);
  });
  
  app.get('/api/weather', (req, res) => {
    res.json([
      { location: 'Tehran', temp: 63, condition: 'Clear', windSpeed: 12, windDir: 'WSW' },
      { location: 'Tel Aviv', temp: 72, condition: 'Partly Cloudy', windSpeed: 8, windDir: 'NW' },
      { location: 'Washington DC', temp: 45, condition: 'Rain', windSpeed: 15, windDir: 'NE' },
    ]);
  });
  
  app.get('/api/summary', async (req, res) => {
    const lastSummary = db.prepare('SELECT * FROM summary ORDER BY id DESC LIMIT 1').get() as { text: string, lastUpdated: string } | undefined;
    
    if (process.env.GEMINI_API_KEY && (!lastSummary || new Date(lastSummary.lastUpdated).getTime() < Date.now() - 3600000)) {
      try {
          const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
          const news = db.prepare('SELECT title FROM news ORDER BY time DESC LIMIT 10').all() as {title: string}[];
          const tweets = db.prepare('SELECT content FROM tweets ORDER BY time DESC LIMIT 10').all() as {content: string}[];
          
          const prompt = `Summarize the current situation based on these headlines and tweets in a concise, military-style update (max 3 sentences):
          Headlines: ${news.map(n => n.title).join('; ')}
          Tweets: ${tweets.map(t => t.content).join('; ')}`;
  
          const result = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: prompt
          });
          const text = result.text;
          
          if (text) {
              db.prepare('INSERT INTO summary (text, lastUpdated) VALUES (?, ?)').run(text, new Date().toISOString());
              res.json({ text, lastUpdated: new Date().toISOString() });
              return;
          }
      } catch (e) {
          console.error("Gemini generation failed, falling back to cache", e);
      }
    }
  
    res.json(lastSummary || { text: "System initializing...", lastUpdated: new Date().toISOString() });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
