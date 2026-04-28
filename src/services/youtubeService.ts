/// <reference types="vite/client" />

/**
 * Service to interact with the YouTube Data API v3
 */
export async function searchYouTubeTrailer(title: string): Promise<string | null> {
  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
  if (!API_KEY) {
    console.warn("VITE_YOUTUBE_API_KEY is not set. Falling back to Gemini search.");
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
