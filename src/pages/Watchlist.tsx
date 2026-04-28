import { useState, useEffect } from 'react';
import { Anime } from '../types';
import AnimeCard from '../components/AnimeCard';
import { HeartOff } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState<Anime[]>([]);

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem('watchlist') || '[]');
    setWatchlist(list);
  }, []);

  if (watchlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 min-h-screen flex flex-col items-center justify-center gap-6">
        <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center text-slate-500">
          <HeartOff size={48} />
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-display font-bold mb-2">Your Watchlist is empty</h2>
          <p className="text-slate-400 max-w-sm">
            Save your favorite anime here to keep track of what you want to watch next.
          </p>
        </div>
        <Link to="/" className="gradient-button px-8 py-3 rounded-xl font-bold">
          Explore Anime
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 min-h-screen pb-20">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-display font-black">
          My <span className="gradient-text">Watchlist</span>
        </h1>
        <p className="text-slate-400 mt-2">Check back your favorite series any time.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {watchlist.map((anime, idx) => (
          <AnimeCard key={anime.mal_id} anime={anime} index={idx} />
        ))}
      </div>
    </div>
  );
}
