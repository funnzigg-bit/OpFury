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
  const newsCount = db.prepare('SELECT count(*) as count FROM news').get() as { count: number };
  if (newsCount.count === 0) {
    const insertNews = db.prepare('INSERT INTO news (title, source, time, category, url) VALUES (?, ?, ?, ?, ?)');
    insertNews.run("Live updates: US and Israel attack Iran as Tehran retaliates across Middle East", "CNN", new Date(Date.now() - 8 * 60000).toISOString(), "strikes", "#");
    insertNews.run("2026 Israeli–United States strikes on Iran", "Wikipedia", new Date(Date.now() - 19 * 60000).toISOString(), "strikes", "#");
    insertNews.run("Live updates: U.S. and Israel launch attack on Iran as Trump calls for regime change", "Washington Post", new Date(Date.now() - 12 * 60000).toISOString(), "strikes", "#");
    insertNews.run("Oil prices surge 5% amid Strait of Hormuz closure fears", "Bloomberg", new Date(Date.now() - 45 * 60000).toISOString(), "shipping", "#");
    insertNews.run("Explosions reported near Isfahan nuclear facility", "Reuters", new Date(Date.now() - 25 * 60000).toISOString(), "strikes", "#");
    insertNews.run("Iran vows 'crushing response' to 'Zionist aggression'", "Al Jazeera", new Date(Date.now() - 30 * 60000).toISOString(), "politics", "#");
    insertNews.run("US Navy shoots down 3 drones in Red Sea", "USNI News", new Date(Date.now() - 60 * 60000).toISOString(), "shipping", "#");
    insertNews.run("Global markets rattle as conflict escalates", "CNBC", new Date(Date.now() - 90 * 60000).toISOString(), "other", "#");
  }

  const tweetCount = db.prepare('SELECT count(*) as count FROM tweets').get() as { count: number };
  if (tweetCount.count === 0) {
    const insertTweet = db.prepare('INSERT INTO tweets (author, handle, content, time, likes, retweets) VALUES (?, ?, ?, ?, ?, ?)');
    insertTweet.run("War Monitor", "@WarMonitor3", "US airforce just pummelled an Iranian ballistic missile production site in Kermanshah", new Date(Date.now() - 5 * 60000).toISOString(), 1200, 450);
    insertTweet.run("OSINT Defender", "@Osint613", "U.S. aircraft struck a missile production and launch facility in Kermanshah. Secondary explosions observed.", new Date(Date.now() - 10 * 60000).toISOString(), 890, 320);
    insertTweet.run("Intel Source", "@Intelligencer41", "Kiriakou cites CIA pal: Trump decided to strike Iran Mon/Tue after 10-day ultimatum.", new Date(Date.now() - 15 * 60000).toISOString(), 560, 120);
    insertTweet.run("Aurora Intel", "@AuroraIntel", "Reports of air defense activation over Tehran. Multiple interceptions.", new Date(Date.now() - 2 * 60000).toISOString(), 2100, 800);
    insertTweet.run("ELINT News", "@ELINTNews", "VIDEO: Large explosion seen in the direction of Parchin military complex.", new Date(Date.now() - 20 * 60000).toISOString(), 3400, 1500);
  }

  const summaryCount = db.prepare('SELECT count(*) as count FROM summary').get() as { count: number };
  if (summaryCount.count === 0) {
    const insertSummary = db.prepare('INSERT INTO summary (text, lastUpdated) VALUES (?, ?)');
    insertSummary.run(
      "US and Israel launched strikes on Iran under Operation Epic Fury, targeting nuclear and missile sites. Iran retaliated with missiles on US bases. Explosions in Tehran, Kermanshah. Trump calls for regime change.",
      new Date().toISOString()
    );
  }
};

seedData();

// API Routes
app.get('/api/news', (req, res) => {
  const news = db.prepare('SELECT * FROM news ORDER BY time DESC LIMIT 20').all();
  res.json(news);
});

app.get('/api/tweets', (req, res) => {
  const tweets = db.prepare('SELECT * FROM tweets ORDER BY time DESC LIMIT 20').all();
  res.json(tweets);
});

app.get('/api/markets', (req, res) => {
  // Mock live market data
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
  // Check if we have a recent summary (cached for 1 hour)
  const lastSummary = db.prepare('SELECT * FROM summary ORDER BY id DESC LIMIT 1').get() as { text: string, lastUpdated: string } | undefined;
  
  if (process.env.GEMINI_API_KEY && (!lastSummary || new Date(lastSummary.lastUpdated).getTime() < Date.now() - 3600000)) {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        // Fetch context
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
      if (tweets && tweets.length > 0) {
        res.json(tweets);
      } else {
        // Fallback if DB is empty for some reason
        res.json([
          { id: 1, author: "War Monitor", handle: "@WarMonitor3", content: "US airforce just pummelled an Iranian ballistic missile production site in Kermanshah", time: new Date().toISOString(), likes: 1200, retweets: 450 },
          { id: 2, author: "OSINT Defender", handle: "@Osint613", content: "U.S. aircraft struck a missile production and launch facility in Kermanshah. Secondary explosions observed.", time: new Date().toISOString(), likes: 890, retweets: 320 }
        ]);
      }
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
