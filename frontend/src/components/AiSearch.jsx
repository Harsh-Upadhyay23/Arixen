import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Loader } from 'lucide-react';

const AiSearch = ({ onSearch, loading }) => {
    const [prompt, setPrompt] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (prompt.trim()) {
            onSearch(prompt);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto mt-8">
            <form onSubmit={handleSubmit} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-netflixRed to-purple-600 rounded-full blur opacity-25 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative glass-panel rounded-full flex items-center p-2 pl-6 shadow-2xl">
                    <Sparkles className="text-netflixRed w-5 h-5 mr-3 animate-pulse" />
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe what you want to watch... (e.g. 'A dark sci-fi movie with a twist')"
                        className="bg-transparent text-white placeholder-gray-400 focus:outline-none flex-grow text-lg"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !prompt.trim()}
                        className="bg-netflixRed hover:bg-red-700 text-white rounded-full p-3 ml-2 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[48px] min-h-[48px]"
                    >
                        {loading ? <Loader className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                    </button>
                </div>
            </form>

            <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {["A mind-bending psychological thriller", "Chill sci-fi with amazing visuals", "Classic 90s action movie"].map((suggestion, idx) => (
                    <button
                        key={idx}
                        onClick={() => setPrompt(suggestion)}
                        className="text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-full px-3 py-1 transition-all"
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AiSearch;
