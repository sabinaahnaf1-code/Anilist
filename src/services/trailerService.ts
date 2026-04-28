import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function searchYouTubeTrailer(title: string): Promise<string | null> {
  const API_KEY = process.env.VITE_YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY;
  if (!API_KEY) {
    console.warn("YouTube API Key not found in server environment.");
    return null;
  }

  const query = `${title} official trailer anime hd`;
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${API_KEY}&maxResults=1&type=video`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.items && data.items.length > 0) {
      return data.items[0].id.videoId;
    }
    return null;
  } catch (error) {
    console.error("YouTube API failed:", error);
    return null;
  }
}

export async function findGeminiTrailerId(title: string): Promise<string | null> {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY not found in server environment.");
    return null;
  }

  try {
    const prompt = `Find the YouTube video ID for the official trailer of the anime "${title}". 
    Look for results from sources like Crunchyroll Channel, AniTV, Netflix Anime, or Official Anime Channels. 
    Exclude fan-made trailers, AMVs, or reviews.
    Return ONLY the 11-character YouTube video ID (e.g., dQw4w9WgXcQ). 
    If you're not absolutely sure, return "none".`;

    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }] as any
      }
    });

    const text = response.text?.trim() || "";
    
    if (text.toLowerCase().includes("none")) {
      return null;
    }
    
    const match = text.match(/[a-zA-Z0-9_-]{11}/);
    return match ? match[0] : null;
  } catch (error) {
    console.error("Gemini failed to find trailer:", error);
    return null;
  }
}
