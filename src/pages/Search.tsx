import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { animeService } from '../services/animeService.ts';
import { Anime } from '../types.ts';
import AnimeCard from '../components/AnimeCard.tsx';
import LoadingSpinner from '../components/LoadingSpinner.tsx';
import { Search as SearchIcon } from 'lucide-react';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  
  const [results, setResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const performSearch = async () => {
      if (query) {
        setLoading(true);
        try {
          const res = await animeService.searchAnime(query);
          setResults(res.data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    };
    performSearch();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 min-h-screen pb-20">
      <div className="mb-12">
        <h1 className="text-3xl md:text-5xl font-display font-black flex items-center gap-4">
          <SearchIcon size={40} className="text-brand-primary" />
          {query ? (
            <span>Search results for "<span className="gradient-text">{query}</span>"</span>
          ) : (
            <span>Search <span className="gradient-text">Anime</span></span>
          )}
        </h1>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {query && results.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-slate-300">No results found.</h2>
              <p className="text-slate-500 mt-2">Try different keywords or genres.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {results.map((anime, idx) => (
                <AnimeCard key={anime.mal_id} anime={anime} index={idx} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
