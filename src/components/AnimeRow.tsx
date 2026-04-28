import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Anime } from '../types';
import AnimeCard from './AnimeCard';

interface AnimeRowProps {
  title: string;
  animeList: Anime[];
  loading?: boolean;
}

export default function AnimeRow({ title, animeList, loading }: AnimeRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (loading) return null;

  return (
    <section className="py-8 group/row">
      <div className="flex items-center justify-between mb-6 px-4 md:px-8">
        <h2 className="text-2xl md:text-3xl font-display font-bold">
          {title}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white/5 hover:text-white transition-all active:scale-90"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white/5 hover:text-white transition-all active:scale-90"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div
        ref={rowRef}
        className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar px-4 md:px-8 pb-4 scroll-smooth"
      >
        {animeList.map((anime, idx) => (
          <div key={`${anime.mal_id}-${idx}`} className="flex-none w-[160px] md:w-[220px]">
            <AnimeCard anime={anime} index={idx} />
          </div>
        ))}
      </div>
    </section>
  );
}
