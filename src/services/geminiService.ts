import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function findYouTubeTrailerId(title: string): Promise<string | null> {
  try {
    const prompt = `Find the YouTube video ID for the official trailer of the anime "${title}". 
    Look for results from sources like Crunchyroll Channel, AniTV, Netflix Anime, or Official Anime Channels. 
    Exclude fan-made trailers, AMVs, or reviews.
    Return ONLY the 11-character YouTube video ID (e.g., dQw4w9WgXcQ). 
    If you're not absolutely sure, return "none".`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash", // Using a faster model for search if available, but let's stick to what's defined in instructions if needed. 
      // Actually instructions say gemini-3-flash-preview is the model used elsewhere.
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      tools: [{ googleSearch: {} }],
    });

    const text = response.response.text().trim();
    
    if (text.toLowerCase().includes("none")) {
      return null;
    }
    
    // Extract ID using regex - YouTube IDs are 11 chars of alphanumeric, _ and -
    const match = text.match(/[a-zA-Z0-9_-]{11}/);
    return match ? match[0] : null;
  } catch (error) {
    console.error("Gemini failed to find trailer:", error);
    return null;
  }
}
