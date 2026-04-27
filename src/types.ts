export interface Anime {
  mal_id: number;
  title: string;
  title_english: string | null;
  images: {
    webp: {
      image_url: string;
      large_image_url: string;
    };
  };
  synopsis: string;
  type: string;
  episodes: number | null;
  status: string;
  score: number | null;
  year: number | null;
  genres: Array<{
    mal_id: number;
    name: string;
  }>;
  rating: string;
  duration: string;
  rank: number;
  popularity: number;
  trailer: {
    youtube_id: string | null;
    url: string | null;
    embed_url: string | null;
  } | null;
}

export interface JikanResponse<T> {
  data: T;
  pagination?: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
  };
}

export interface Genre {
  mal_id: number;
  name: string;
  count: number;
}
