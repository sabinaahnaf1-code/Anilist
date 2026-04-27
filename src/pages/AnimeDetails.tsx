import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, Play, Calendar, Clock, Tv, Plus, Check, ChevronLeft, Volume2, Globe } from 'lucide-react';
import { animeService } from '../services/animeService.ts';
import { Anime } from '../types.ts';
import LoadingSpinner from '../components/LoadingSpinner.tsx';

export default function AnimeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [isWatchlisted, setIsWatchlisted] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (id) {
          const res = await animeService.getAnimeDetails(Number(id));
          setAnime(res.data);
          
          // Check watchlist
          const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
          setIsWatchlisted(watchlist.some((item: any) => item.mal_id === res.data.mal_id));
        }
      } catch (error) {
        console.error("Failed to fetch anime details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const toggleWatchlist = () => {
    if (!anime) return;
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    if (isWatchlisted) {
      const updated = watchlist.filter((item: any) => item.mal_id !== anime.mal_id);
      localStorage.setItem('watchlist', JSON.stringify(updated));
    } else {
      watchlist.push(anime);
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
    }
    setIsWatchlisted(!isWatchlisted);
  };

  if (loading) return <LoadingSpinner />;
  if (!anime) return <div className="text-center py-20 text-slate-400">Anime not found.</div>;

  return (
    <div className="min-h-screen pb-20">
      {/* Background Cover */}
      <div className="absolute top-0 left-0 w-full h-[60vh] overflow-hidden -z-10">
        <img
          src={anime.images.webp.large_image_url}
          alt={anime.title}
          className="w-full h-full object-cover blur-[80px] opacity-30"
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-bg-dark" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Left: Poster */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-none w-full md:w-[320px]"
          >
            <div className="relative group rounded-3xl overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/10 ring-1 ring-white/10">
              <img
                src={anime.images.webp.large_image_url}
                alt={anime.title}
                className="w-full h-auto aspect-[2/3] object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-bg-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <div className="mt-6 flex flex-col gap-3">
              {anime.trailer?.url ? (
                <a
                  href={anime.trailer.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gradient-button w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-white shadow-xl shadow-brand-primary/20"
                >
                  <Play size={20} fill="currentColor" />
                  Watch Trailer
                </a>
              ) : (
                <button 
                  disabled
                  className="bg-slate-800 text-slate-500 cursor-not-allowed w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold border border-white/5"
                >
                  <Play size={20} />
                  Trailer Unavailable
                </button>
              )}
              <button
                onClick={toggleWatchlist}
                className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold transition-all border ${
                  isWatchlisted ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                {isWatchlisted ? <Check size={20} /> : <Plus size={20} />}
                {isWatchlisted ? 'In Watchlist' : 'Add to Watchlist'}
              </button>
            </div>
          </motion.div>

          {/* Right: Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 flex flex-col gap-8"
          >
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl md:text-6xl font-display font-black leading-tight tracking-[calc(-0.02*1em)]">
                {anime.title_english || anime.title}
              </h1>
              {anime.title_english && anime.title !== anime.title_english && (
                <p className="text-slate-400 font-medium text-lg">{anime.title}</p>
              )}
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-400/10 border border-yellow-400/20 rounded-full text-yellow-400 font-bold">
                <Star size={16} fill="currentColor" />
                {anime.score || 'N/A'}
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-white/5 rounded-full text-slate-300 font-medium text-sm">
                <Calendar size={14} />
                {anime.year || 'TBA'}
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-white/5 rounded-full text-slate-300 font-medium text-sm">
                <Tv size={14} />
                {anime.type}
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-white/5 rounded-full text-slate-300 font-medium text-sm">
                <Clock size={14} />
                {anime.duration.split('per')[0]}
              </div>
              <div className="px-3 py-1.5 bg-brand-primary/10 border border-brand-primary/20 rounded-full text-brand-primary font-bold text-sm">
                {anime.rating.split(' ')[0]}
              </div>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {anime.genres.map((genre) => (
                <Link
                  key={genre.mal_id}
                  to={`/genres?id=${genre.mal_id}`}
                  className="px-4 py-2 bg-slate-800/50 hover:bg-brand-primary hover:text-white transition-all rounded-xl text-sm font-semibold border border-white/5"
                >
                  {genre.name}
                </Link>
              ))}
            </div>

            <div className="bg-white/5 p-6 md:p-8 rounded-[32px] border border-white/5">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                Synopsis
                <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
              </h3>
              <p className="text-slate-300 leading-relaxed text-base md:text-lg whitespace-pre-wrap">
                {anime.synopsis}
              </p>
            </div>

            {/* Additional Metadata */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
              <div>
                <div className="text-slate-500 text-xs uppercase font-bold tracking-widest mb-1">Episodes</div>
                <div className="text-white font-bold">{anime.episodes || 'Unknown'}</div>
              </div>
              <div>
                <div className="text-slate-500 text-xs uppercase font-bold tracking-widest mb-1">Rank</div>
                <div className="text-white font-bold">#{anime.rank}</div>
              </div>
              <div>
                <div className="text-slate-500 text-xs uppercase font-bold tracking-widest mb-1">Popularity</div>
                <div className="text-white font-bold">#{anime.popularity}</div>
              </div>
              <div>
                <div className="text-slate-500 text-xs uppercase font-bold tracking-widest mb-1">Status</div>
                <div className="text-white font-bold">{anime.status}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
