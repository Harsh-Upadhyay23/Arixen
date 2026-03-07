import React, { useState, useEffect } from 'react';
import { Film, Search, User, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass-panel py-3' : 'bg-transparent py-5'}`}>
            <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 group">
                    <Film className="text-netflixRed w-8 h-8 group-hover:scale-110 transition-transform" />
                    <span className="text-2xl font-bold tracking-tight">Cine<span className="text-netflixRed">AI</span></span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <Link to="/" className="text-white hover:text-netflixRed transition-colors">Home</Link>
                    <Link to="/" className="text-gray-300 hover:text-white transition-colors">Discover</Link>
                    <Link to="/" className="text-gray-300 hover:text-white transition-colors">Trending</Link>
                    <Link to="/" className="text-gray-300 hover:text-white transition-colors">My List</Link>
                </div>

                <div className="flex items-center gap-4">
                    <button className="text-white hover:text-gray-300 transition-colors">
                        <Search className="w-5 h-5" />
                    </button>
                    <button className="text-white hover:text-gray-300 transition-colors">
                        <User className="w-5 h-5" />
                    </button>
                    <button className="md:hidden text-white">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
