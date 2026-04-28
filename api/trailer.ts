import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

async function searchYouTubeTrailer(title: string): Promise<string | null> {
  const API_KEY = process.env.VITE_YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY;
  if (!API_KEY) {
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
    return null;
  }
}

async function findGeminiTrailerId(title: string): Promise<string | null> {
  if (!process.env.GEMINI_API_KEY) return null;

  try {
    const prompt = `Find the YouTube video ID for the official trailer of the anime "${title}". Return ONLY the 11-character ID. If unsure return "none".`;
    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] as any }
    });
    const text = response.text?.trim() || "";
    if (text.toLowerCase().includes("none")) return null;
    const match = text.match(/[a-zA-Z0-9_-]{11}/);
    return match ? match[0] : null;
  } catch (error) {
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const title = req.query.title as string;
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  let videoId = await searchYouTubeTrailer(title);
  if (!videoId) {
    videoId = await findGeminiTrailerId(title);
  }

  res.status(200).json({ videoId });
}
