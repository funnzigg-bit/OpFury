import { GoogleGenAI } from "@google/genai";

const apiKey = "AIzaSyBY4TRQ5hRxOQxpuRHddefBp0CAUTlHHG0";
const ai = new GoogleGenAI({ apiKey });

async function test() {
  try {
    console.log("Testing API key...");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Test",
    });
    console.log("API Key is working! Quota check passed.");
  } catch (error: any) {
    if (error.status === 429 || error.message?.includes('429') || error.message?.includes('quota')) {
        console.log("QUOTA_EXCEEDED: The billing is not yet active or linked correctly.");
    } else {
        console.log("Error:", error.message);
    }
  }
}

test();
