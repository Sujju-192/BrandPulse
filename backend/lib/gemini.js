import { GoogleGenAI } from "@google/genai";

let aiInstance = null;

export function getGeminiClient() {
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiInstance;
}
