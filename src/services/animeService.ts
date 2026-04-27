import { Anime, JikanResponse, Genre } from './types.ts';

const BASE_URL = 'https://api.jikan.moe/v4';

/**
 * Service to interact with the Jikan API (Unofficial MyAnimeList API)
 * Rate limiting: 3 requests per second, 60 requests per minute.
 */
class AnimeService {
  private async fetcher<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Too many requests. Please wait a moment.');
      }
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    return response.json();
  }

  async getTopAnime(limit = 10): Promise<JikanResponse<Anime[]>> {
    return this.fetcher<JikanResponse<Anime[]>>(`/top/anime?limit=${limit}`);
  }

  async getTrendingAnime(limit = 15): Promise<JikanResponse<Anime[]>> {
    // Jikan doesn't have a direct "trending" but "airing" is closest
    return this.fetcher<JikanResponse<Anime[]>>(`/top/anime?filter=airing&limit=${limit}`);
  }

  async getPopularAnime(limit = 15): Promise<JikanResponse<Anime[]>> {
    return this.fetcher<JikanResponse<Anime[]>>(`/top/anime?filter=bypopularity&limit=${limit}`);
  }

  async getRecentlyUpdatedAnime(limit = 15): Promise<JikanResponse<Anime[]>> {
    // Recent recommendation or just top upcoming
    return this.fetcher<JikanResponse<Anime[]>>(`/top/anime?filter=upcoming&limit=${limit}`);
  }

  async searchAnime(query: string, limit = 20): Promise<JikanResponse<Anime[]>> {
    return this.fetcher<JikanResponse<Anime[]>>(`/anime?q=${encodeURIComponent(query)}&limit=${limit}`);
  }

  async getAnimeDetails(id: number): Promise<JikanResponse<Anime>> {
    return this.fetcher<JikanResponse<Anime>>(`/anime/${id}/full`);
  }

  async getGenres(): Promise<JikanResponse<Genre[]>> {
    return this.fetcher<JikanResponse<Genre[]>>('/genres/anime');
  }

  async getAnimeByGenre(genreId: number, limit = 20): Promise<JikanResponse<Anime[]>> {
    return this.fetcher<JikanResponse<Anime[]>>(`/anime?genres=${genreId}&limit=${limit}&order_by=score&sort=desc`);
  }
}

export const animeService = new AnimeService();
