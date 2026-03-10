import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Play, Plus, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

const FALLBACK_POSTER = 'https://via.placeholder.com/300x450/1a1a2e/e50914?text=No+Poster';

const MovieCard = ({ movie, index, isAiResult = false, aiExplanation = null }) => {
    const [expanded, setExpanded] = useState(false);
    const posterSrc = movie.poster_url && movie.poster_url.startsWith('http')
        ? movie.poster_url
        : FALLBACK_POSTER;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.06 }}
            className="group flex flex-col rounded-2xl overflow-hidden bg-darkCard border border-white/5 hover:border-netflixRed/40 shadow-lg hover:shadow-netflixRed/10 transition-all duration-300"
        >
            {/* Poster */}
            <div className="relative aspect-[2/3] overflow-hidden">
                <img
                    src={posterSrc}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.target.src = FALLBACK_POSTER; }}
                />

                {/* Rating Badge */}
                <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-yellow-400 text-xs font-bold">
                        {typeof movie.rating === 'number' ? movie.rating.toFixed(1) : 'N/A'}
                    </span>
                </div>

                {/* Year Badge */}
                {movie.release_year && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
                        <Calendar className="w-3 h-3 text-gray-300" />
                        <span className="text-gray-300 text-xs">{movie.release_year}</span>
                    </div>
                )}

                {/* Hover Play overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-netflixRed hover:bg-red-700 text-white rounded-full p-4 transition-colors shadow-xl">
                        <Play className="w-5 h-5" fill="currentColor" />
                    </button>
                </div>
            </div>

            {/* Info below the poster — always visible */}
            <div className="flex flex-col flex-1 p-3 gap-2">
                {/* Title */}
                <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2">
                    {movie.title}
                </h3>

                {/* Genres */}
                {movie.genres && movie.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {movie.genres.slice(0, 2).map((g, i) => (
                            <span
                                key={i}
                                className="text-[10px] text-gray-300 bg-white/10 px-2 py-0.5 rounded-full border border-white/5"
                            >
                                {g}
                            </span>
                        ))}
                    </div>
                )}

                {/* AI Explanation (only on top card when it's AI result) */}
                {isAiResult && aiExplanation && index === 0 && (
                    <p className="text-xs text-netflixRed/90 italic line-clamp-2 leading-relaxed">
                        ✨ {aiExplanation}
                    </p>
                )}

                {/* Overview toggle */}
                {movie.overview && (
                    <div className="mt-1">
                        <p className={`text-gray-400 text-xs leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
                            {movie.overview}
                        </p>
                        {movie.overview.length > 100 && (
                            <button
                                onClick={() => setExpanded(!expanded)}
                                className="text-xs text-netflixRed/80 hover:text-netflixRed mt-1 flex items-center gap-0.5 transition-colors"
                            >
                                {expanded ? (
                                    <><ChevronUp className="w-3 h-3" /> Less</>
                                ) : (
                                    <><ChevronDown className="w-3 h-3" /> More</>
                                )}
                            </button>
                        )}
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2 mt-auto pt-2">
                    <button className="flex-1 bg-netflixRed/90 hover:bg-netflixRed text-white rounded-lg py-1.5 text-xs font-medium flex items-center justify-center gap-1 transition-colors">
                        <Play className="w-3 h-3" fill="currentColor" /> Watch
                    </button>
                    <button className="border border-white/20 hover:border-white/40 text-white rounded-lg px-2.5 py-1.5 transition-colors" title="Add to watchlist">
                        <Plus className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default MovieCard;
