import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Info, Star, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { animeService } from '../services/animeService';
import { Anime } from '../types';
import AnimeRow from '../components/AnimeRow';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Home() {
  const [topAnime, setTopAnime] = useState<Anime[]>([]);
  const [trendingAnime, setTrendingAnime] = useState<Anime[]>([]);
  const [popularAnime, setPopularAnime] = useState<Anime[]>([]);
  const [heroAnime, setHeroAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [top, trending, popular] = await Promise.all([
          animeService.getTopAnime(12),
          animeService.getTrendingAnime(15),
          animeService.getPopularAnime(15),
        ]);
        
        setTopAnime(top.data);
        setTrendingAnime(trending.data);
        setPopularAnime(popular.data);
        // Set hero as a random top anime
        setHeroAnime(top.data[Math.floor(Math.random() * 5)]);
      } catch (error) {
        console.error("Failed to fetch home data:", error);
        setError("We're having trouble reaching the anime servers. Please try refreshing the page in a few seconds.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4 text-center">
        <div className="text-brand-primary text-6xl opacity-50">!</div>
        <h2 className="text-2xl font-bold text-slate-100">{error}</h2>
        <button 
          onClick={() => window.location.reload()}
          className="gradient-button px-8 py-3 rounded-full font-bold text-white"
        >
          Retry Now
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-20">
      {/* Hero Banner */}
      {heroAnime && (
        <section className="relative h-[85vh] w-full mt-[-80px] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroAnime.images.webp.large_image_url}
              alt={heroAnime.title}
              className="w-full h-full object-cover object-top scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-r from-bg-dark via-bg-dark/60 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-t from-bg-dark via-transparent to-transparent" />
          </div>

          <div className="relative h-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col justify-end pb-24 md:pb-32 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-4 max-w-2xl"
            >
              <div className="flex items-center gap-4">
                <div className="px-3 py-1 bg-brand-primary/20 border border-brand-primary/30 rounded-full text-brand-primary text-xs font-bold uppercase tracking-widest">
                  Featured Anime
                </div>
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star size={16} fill="currentColor" />
                  <span className="text-sm font-bold">{heroAnime.score}</span>
                </div>
              </div>

              <h1 className="text-5xl md:text-7xl font-display font-black leading-tight drop-shadow-2xl">
                {heroAnime.title_english || heroAnime.title}
              </h1>

              <p className="text-slate-300 text-base md:text-lg line-clamp-3 md:line-clamp-4 leading-relaxed font-medium">
                {heroAnime.synopsis}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-4">
                <Link
                  to={`/anime/${heroAnime.mal_id}`}
                  className="gradient-button px-8 py-3 rounded-full flex items-center gap-3 font-bold shadow-2xl shadow-brand-primary/40 text-white"
                >
                  <Play size={22} fill="currentColor" />
                  Watch Now
                </Link>
                <Link
                  to={`/anime/${heroAnime.mal_id}`}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-8 py-3 rounded-full flex items-center gap-3 font-bold transition-all border border-white/10"
                >
                  <Info size={22} />
                  Learn More
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Anime Rows */}
      <div className="flex flex-col gap-4 -mt-12 md:-mt-24 z-10">
        <AnimeRow title="🔥 Trending Now" animeList={trendingAnime} />
        <AnimeRow title="🏆 Top Rated" animeList={topAnime} />
        <AnimeRow title="🌟 Popular Worldwide" animeList={popularAnime} />
      </div>
    </div>
  );
}
