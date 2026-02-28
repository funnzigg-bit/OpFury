import 'dotenv/config';
import { GoogleGenAI } from "@google/genai";

const checkKey = async () => {
  const key = process.env.API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  console.log("Environment Variables Check:");
  console.log("API_KEY present:", !!process.env.API_KEY);
  console.log("GEMINI_API_KEY present:", !!process.env.GEMINI_API_KEY);
  console.log("GOOGLE_API_KEY present:", !!process.env.GOOGLE_API_KEY);
  
  if (!key) {
    console.error("CRITICAL: No API Key found in environment!");
    return;
  }

  console.log(`Using Key: ${key.substring(0, 4)}...${key.substring(key.length - 4)}`);

  try {
    const ai = new GoogleGenAI({ apiKey: key });
    console.log("Attempting generation with gemini-2.5-flash...");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Hello, are you working?",
    });
    console.log("Success! Response:", response.text);
  } catch (e: any) {
    console.error("Generation failed:", e.message);
    if (e.response) {
        console.error("Error details:", JSON.stringify(e.response, null, 2));
    }
  }
};

checkKey();
