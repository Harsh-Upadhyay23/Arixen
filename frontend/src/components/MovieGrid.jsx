import React from 'react';
import { motion } from 'framer-motion';
import MovieCard from './MovieCard';
import { Sparkles } from 'lucide-react';

const MovieGrid = ({ title, movies, isAiResult = false, aiExplanation = null }) => {
    if (!movies || movies.length === 0) return null;

    return (
        <section className="py-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2">
                {isAiResult && <Sparkles className="text-netflixRed w-6 h-6" />}
                {title}
            </h2>

            {aiExplanation && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 p-4 glass-panel rounded-xl border-l-4 border-l-netflixRed text-lg text-gray-200 leading-relaxed"
                >
                    <p>"{aiExplanation}"</p>
                </motion.div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {movies.map((movie, idx) => (
                    <MovieCard key={movie._id} movie={movie} index={idx} />
                ))}
            </div>
        </section>
    );
};

export default MovieGrid;
