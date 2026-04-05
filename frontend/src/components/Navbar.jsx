import React, { useState, useEffect } from 'react';
import { Film, Search, User, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    // Handle scroll
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu on route change
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Discover", path: "/discover" },
        { name: "Trending", path: "/trending" },
        { name: "My List", path: "/my-list" }
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${
                scrolled ? 'glass-panel py-3 backdrop-blur-md bg-black/60' : 'bg-transparent py-5'
            }`}
        >
            <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <Film className="text-red-600 w-8 h-8 group-hover:scale-110 transition-transform" />
                    <span className="text-2xl font-bold tracking-tight text-white">
                        Cine<span className="text-red-600">AI</span>
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`transition-colors ${
                                isActive(link.path)
                                    ? 'text-red-600'
                                    : 'text-gray-300 hover:text-white'
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Right Icons */}
                <div className="flex items-center gap-4">
                    <button
                        aria-label="Search"
                        className="text-white hover:text-gray-300 transition-colors"
                    >
                        <Search className="w-5 h-5" />
                    </button>

                    <button
                        aria-label="Profile"
                        className="text-white hover:text-gray-300 transition-colors"
                    >
                        <User className="w-5 h-5" />
                    </button>

                    {/* Mobile Menu Button */}
                    <button
                        aria-label="Toggle Menu"
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden text-white"
                    >
                        {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-black/90 backdrop-blur-lg px-6 py-4 space-y-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`block text-sm ${
                                isActive(link.path)
                                    ? 'text-red-600'
                                    : 'text-gray-300 hover:text-white'
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
