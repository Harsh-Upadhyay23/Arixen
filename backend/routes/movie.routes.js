import express from 'express';
import Movie from '../models/movie.model.js';

const router = express.Router();

// GET all movies (with optional search)
router.get('/', async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        
        if (search) {
            query = { $text: { $search: search } };
        }
        
        const movies = await Movie.find(query).sort({ rating: -1 }).limit(20);
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: 'Server Error fetching movies' });
    }
});

// ⚠️ IMPORTANT: Specific routes MUST come before wildcard param routes
// GET trending movies — must be before /:id to avoid Express treating "lists" as an ID
router.get('/lists/trending', async (req, res) => {
    try {
        const movies = await Movie.find().sort({ rating: -1 }).limit(12);
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: 'Server Error fetching trending movies' });
    }
});

// GET movie by ID
router.get('/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ error: 'Movie not found' });
        res.json(movie);
    } catch (error) {
        res.status(500).json({ error: 'Server Error fetching movie' });
    }
});

export default router;
