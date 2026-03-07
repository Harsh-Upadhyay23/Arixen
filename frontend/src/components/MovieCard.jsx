import React from 'react';
import { motion } from 'framer-motion';
import { Star, Play, Plus } from 'lucide-react';

const MovieCard = ({ movie, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group relative rounded-xl overflow-hidden cursor-pointer aspect-[2/3] bg-darkCard"
        >
            <img 
                src={movie.poster_url} 
                alt={movie.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="text-white font-bold text-lg leading-tight mb-1">{movie.title}</h3>
                
                <div className="flex items-center gap-2 mb-2">
                    <span className="flex items-center text-yellow-400 text-sm font-medium">
                        <Star className="w-4 h-4 mr-1 fill-current" />
                        {movie.rating.toFixed(1)}
                    </span>
                    <span className="text-gray-300 text-xs">| {movie.release_year}</span>
                </div>
                
                <p className="text-gray-400 text-xs line-clamp-2 mb-3">
                    {movie.overview}
                </p>

                <div className="flex gap-2 mt-auto">
                    <button className="bg-white text-black rounded-full p-2 hover:bg-gray-200 transition-colors flex-1 flex justify-center items-center">
                        <Play className="w-4 h-4" fill="currentColor" />
                    </button>
                    <button className="border border-white/40 text-white rounded-full p-2 hover:bg-white/20 transition-colors">
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
                
                <div className="mt-2 flex gap-1 flex-wrap">
                    {movie.genres.slice(0, 2).map((g, i) => (
                        <span key={i} className="text-[10px] text-gray-300 bg-white/10 px-2 py-0.5 rounded border border-white/5">
                            {g}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default MovieCard;
