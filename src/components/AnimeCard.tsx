import React from 'react';
import { motion } from 'motion/react';
import { Star, Play, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Anime } from '../types';

interface AnimeCardProps {
  anime: Anime;
  index?: number;
  key?: any;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -10 }}
      className="group relative bg-card-dark rounded-2xl overflow-hidden shadow-xl aspect-[2/3] ring-1 ring-white/5"
    >
      <Link to={`/anime/${anime.mal_id}`} className="block h-full relative cursor-pointer">
        <img
          src={anime.images.webp.large_image_url}
          alt={anime.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-linear-to-t from-bg-dark via-bg-dark/20 to-transparent opacity-80" />
        
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10">
          <Star size={14} className="text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-bold text-white leading-none">{anime.score || 'N/A'}</span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 transform transition-transform duration-300">
          <h3 className="text-sm font-bold text-white line-clamp-2 mb-1 group-hover:text-brand-primary transition-colors">
            {anime.title_english || anime.title}
          </h3>
          
          <div className="flex items-center gap-3 text-slate-400 text-[10px]">
             <div className="flex items-center gap-1">
               <Calendar size={10} />
               <span>{anime.year || 'TBA'}</span>
             </div>
             <div className="flex items-center gap-1 text-slate-400">
               <span>{anime.type}</span>
             </div>
          </div>
        </div>

        {/* Hover Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-brand-primary/20 backdrop-blur-[2px]">
          <div className="w-14 h-14 gradient-button rounded-full flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform">
            <Play size={24} className="text-white fill-white ml-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default AnimeCard;
