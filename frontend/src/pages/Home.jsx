import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AiSearch from '../components/AiSearch';
import MovieGrid from '../components/MovieGrid';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

const Home = () => {
    const [trending, setTrending] = useState([]);
    const [aiResults, setAiResults] = useState(null);
    const [loadingAI, setLoadingAI] = useState(false);
    const [error, setError] = useState(null);
    const resultsRef = useRef(null);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/v1/movies/lists/trending');
                setTrending(res.data);
            } catch (err) {
                console.error("Failed to fetch trending:", err);
            }
        };
        fetchTrending();
    }, []);

    const handleAiSearch = async (prompt) => {
        setLoadingAI(true);
        setError(null);
        setAiResults(null);

        try {
            const res = await axios.post('http://localhost:5000/api/v1/recommend/chat', { prompt });
            
            // Safety: ensure movies is an array, not the raw Gemini text
            const data = res.data;
            if (!Array.isArray(data.movies)) {
                setError("Unexpected response from AI. Please try again.");
                return;
            }
            
            setAiResults(data);

            setTimeout(() => {
                resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 200);

        } catch (err) {
            console.error(err);
            const backendError = err.response?.data?.error;
            setError(backendError || "Could not get AI recommendations. Make sure the backend is running and your Gemini API key is set.");
        } finally {
            setLoadingAI(false);
        }
    };

    const clearResults = () => {
        setAiResults(null);
        setError(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="pb-20">
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg"
                        alt="Hero Background"
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-darkBg via-darkBg/80 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-darkBg via-darkBg/50 to-transparent" />
                </div>

                <div className="relative z-10 container mx-auto px-6 md:px-12 text-center mt-16">
                    <Motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4"
                    >
                        Find the <span className="text-netflixRed">Perfect Movie.</span>
                        <br />Instantly.
                    </Motion.h1>
                    <Motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10"
                    >
                        Our AI understands your mood. Describe what you want to watch right now, and let the magic happen.
                    </Motion.p>

                    <Motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <AiSearch onSearch={handleAiSearch} loading={loadingAI} />
                    </Motion.div>
                </div>
            </section>

            {/* Content Section */}
            <div className="container mx-auto px-6 md:px-12 -mt-10 relative z-20">
                <AnimatePresence>
                    {error && (
                        <Motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-red-500/20 border border-red-500/50 text-red-100 p-4 rounded-xl mb-8 flex items-start gap-3"
                        >
                            <span className="flex-1">{error}</span>
                            <button onClick={clearResults} className="text-red-300 hover:text-white transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </Motion.div>
                    )}
                </AnimatePresence>

                {/* AI Results Section */}
                <div ref={resultsRef}>
                    <AnimatePresence>
                        {aiResults && aiResults.movies.length > 0 && (
                            <Motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="mb-16"
                            >
                                {/* Results header banner */}
                                <div className="flex items-center justify-between mb-2 p-4 rounded-xl bg-netflixRed/10 border border-netflixRed/20">
                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                        <Sparkles className="w-4 h-4 text-netflixRed" />
                                        <span>
                                            AI found <strong className="text-white">{aiResults.movies.length} movies</strong>
                                            {aiResults.signals?.vibe && (
                                                <> matching <em className="text-netflixRed">"{aiResults.signals.vibe}"</em></>
                                            )}
                                        </span>
                                    </div>
                                    <button
                                        onClick={clearResults}
                                        className="text-gray-400 hover:text-white text-xs flex items-center gap-1 transition-colors"
                                    >
                                        <X className="w-3 h-3" /> Clear
                                    </button>
                                </div>

                                <MovieGrid
                                    title="AI Selected For You"
                                    movies={aiResults.movies}
                                    isAiResult={true}
                                    aiExplanation={aiResults.top_explanation}
                                />
                            </Motion.div>
                        )}

                        {aiResults && aiResults.movies.length === 0 && (
                            <Motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-16 text-gray-500 mb-16"
                            >
                                <Sparkles className="w-10 h-10 mx-auto mb-3 text-gray-600" />
                                <p className="text-lg">No movies matched your description.</p>
                                <p className="text-sm mt-1">Try different keywords or a broader description.</p>
                            </Motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <MovieGrid title="Trending Now" movies={trending} />
            </div>
        </div>
    );
};

export default Home;
