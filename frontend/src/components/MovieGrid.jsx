import React from 'react';
import MovieCard from './MovieCard';
import { Sparkles, Film } from 'lucide-react';

const MovieGrid = ({ title, movies, isAiResult = false, aiExplanation = null }) => {
    if (!movies || movies.length === 0) return null;

    return (
        <section className="py-8">
            <div className="flex items-center gap-3 mb-6">
                {isAiResult
                    ? <Sparkles className="text-netflixRed w-6 h-6 animate-pulse" />
                    : <Film className="text-gray-400 w-6 h-6" />
                }
                <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
                <span className="ml-auto text-sm text-gray-500">{movies.length} titles</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
                {movies.map((movie, idx) => (
                    <MovieCard
                        key={movie._id || movie.title + idx}
                        movie={movie}
                        index={idx}
                        isAiResult={isAiResult}
                        aiExplanation={aiExplanation}
                    />
                ))}
            </div>
        </section>
    );
};

export default MovieGrid;
