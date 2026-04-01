import express from 'express';
import mongoose from 'mongoose';
import Movie from '../models/movie.model.js';

const router = express.Router();

/**
 * @desc    Get all movies (with optional search)
 * @route   GET /api/movies?search=xyz
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        const { search } = req.query;

        const query = search
            ? { $text: { $search: search } }
            : {};

        const movies = await Movie.find(query)
            .sort({ rating: -1 })
            .limit(20)
            .lean(); // ⚡ faster response (no mongoose overhead)

        res.status(200).json({
            success: true,
            count: movies.length,
            data: movies
        });

    } catch (error) {
        console.error('Error fetching movies:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server Error fetching movies'
        });
    }
});


/**
 * @desc    Get trending movies
 * @route   GET /api/movies/lists/trending
 * @access  Public
 */
router.get('/lists/trending', async (req, res) => {
    try {
        const movies = await Movie.find()
            .sort({ rating: -1 })
            .limit(12)
            .lean();

        res.status(200).json({
            success: true,
            count: movies.length,
            data: movies
        });

    } catch (error) {
        console.error('Error fetching trending movies:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server Error fetching trending movies'
        });
    }
});


/**
 * @desc    Get movie by ID
 * @route   GET /api/movies/:id
 * @access  Public
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // ✅ Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid movie ID'
            });
        }

        const movie = await Movie.findById(id).lean();

        if (!movie) {
            return res.status(404).json({
                success: false,
                message: 'Movie not found'
            });
        }

        res.status(200).json({
            success: true,
            data: movie
        });

    } catch (error) {
        console.error('Error fetching movie:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server Error fetching movie'
        });
    }
});

export default router;
