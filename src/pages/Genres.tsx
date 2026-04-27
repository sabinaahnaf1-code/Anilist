import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { animeService } from '../services/animeService.ts';
import { Anime, Genre } from '../types.ts';
import AnimeCard from '../components/AnimeCard.tsx';
import LoadingSpinner from '../components/LoadingSpinner.tsx';
import { motion } from 'motion/react';

export default function Genres() {
  const [searchParams, setSearchParams] = useSearchParams();
  const genreId = searchParams.get('id');
  
  const [genres, setGenres] = useState<Genre[]>([]);
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [animeLoading, setAnimeLoading] = useState(false);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await animeService.getGenres();
        setGenres(res.data.sort((a, b) => b.count - a.count));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchAnimeByGenre = async () => {
      if (genreId) {
        setAnimeLoading(true);
        try {
          const res = await animeService.getAnimeByGenre(Number(genreId));
          setAnimeList(res.data);
        } catch (error) {
          console.error(error);
        } finally {
          setAnimeLoading(false);
        }
      } else {
        setAnimeList([]);
      }
    };
    fetchAnimeByGenre();
  }, [genreId]);

  const activeGenre = genres.find(g => g.mal_id === Number(genreId));

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 min-h-screen pb-20">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h1 className="text-4xl md:text-5xl font-display font-black mb-4">
             Explore <span className="gradient-text">Genres</span>
           </h1>
           <p className="text-slate-400">Discover anime sorted by your favorite categories.</p>
        </div>
        {genreId && (
          <button 
            onClick={() => setSearchParams({})}
            className="text-brand-primary font-bold hover:underline"
          >
            Clear Selection
          </button>
        )}
      </div>

      {/* Genres Grid */}
      {!genreId && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {genres.map((genre, idx) => (
            <motion.button
              key={genre.mal_id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.02 }}
              onClick={() => setSearchParams({ id: genre.mal_id.toString() })}
              className="p-6 bg-card-dark border border-white/5 rounded-2xl hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-all text-center group"
            >
              <h3 className="font-bold text-slate-100 group-hover:text-brand-primary transition-colors">
                {genre.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">{genre.count} Titles</p>
            </motion.button>
          ))}
        </div>
      )}

      {/* Anime Results */}
      {genreId && (
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-4">
             <div className="px-6 py-2 bg-brand-primary rounded-xl font-bold">
               {activeGenre?.name}
             </div>
             <div className="text-slate-500 text-sm font-medium">
               Found {animeList.length} popular titles
             </div>
          </div>

          {animeLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {animeList.map((anime, idx) => (
                <AnimeCard key={anime.mal_id} anime={anime} index={idx} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
