import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AiSearch from '../components/AiSearch';
import MovieGrid from '../components/MovieGrid';
import { motion } from 'framer-motion';

const Home = () => {
    const [trending, setTrending] = useState([]);
    const [aiResults, setAiResults] = useState(null);
    const [loadingAI, setLoadingAI] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch trending movies on load
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
            setAiResults(res.data);
            
            // Scroll to results smoothly
            setTimeout(() => {
                document.getElementById('ai-results-section').scrollIntoView({ behavior: 'smooth' });
            }, 300);
            
        } catch (err) {
            console.error(err);
            setError("Failed to get AI recommendations. Make sure backend is running and Gemini API key is set.");
        } finally {
            setLoadingAI(false);
        }
    };

    return (
        <div className="pb-20">
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                {/* Hero Background (Interstellar Poster as default) */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg" 
                        alt="Hero Background" 
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-darkBg via-darkBg/80 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-darkBg via-darkBg/50 to-transparent"></div>
                </div>

                <div className="relative z-10 container mx-auto px-6 md:px-12 text-center mt-16">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4"
                    >
                        Find the <span className="text-netflixRed">Perfect Movie.</span>
                        <br />Instantly.
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10"
                    >
                        Our AI understands your mood. Describe what you want to watch feeling right now, and let the magic happen.
                    </motion.p>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <AiSearch onSearch={handleAiSearch} loading={loadingAI} />
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <div className="container mx-auto px-6 md:px-12 -mt-10 relative z-20">
                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-100 p-4 rounded-lg mb-8 text-center">
                        {error}
                    </div>
                )}

                <div id="ai-results-section">
                    {aiResults && (
                        <div className="mb-16">
                            <MovieGrid 
                                title="AI Selected For You" 
                                movies={aiResults.movies} 
                                isAiResult={true}
                                aiExplanation={aiResults.top_explanation}
                            />
                        </div>
                    )}
                </div>

                <MovieGrid title="Trending Now" movies={trending} />
            </div>
        </div>
    );
};

export default Home;
