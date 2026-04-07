import React from "react";
import MovieCard from "./MovieCard";
import { Sparkles, Film } from "lucide-react";

const MovieGrid = ({
  title = "Movies",
  movies = [],
  isAiResult = false,
  aiExplanation = null,
}) => {
  // ✅ Early return
  if (!movies.length) return null;

  // ✅ Icon selection
  const Icon = isAiResult ? Sparkles : Film;

  return (
    <section className="py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Icon
          className={`w-6 h-6 ${
            isAiResult
              ? "text-netflixRed animate-pulse"
              : "text-gray-400"
          }`}
        />

        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          {title}
        </h2>

        <span className="ml-auto text-sm text-gray-500">
          {movies.length} {movies.length === 1 ? "title" : "titles"}
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
        {movies.map((movie) => {
          // ✅ Better unique key strategy
          const uniqueKey =
            movie._id || movie.id || `${movie.title}-${movie.release_date}`;

          return (
            <MovieCard
              key={uniqueKey}
              movie={movie}
              isAiResult={isAiResult}
              aiExplanation={aiExplanation}
            />
          );
        })}
      </div>
    </section>
  );
};

export default React.memo(MovieGrid);
