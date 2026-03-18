import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import movieRoutes from './routes/movie.routes.js';
import aiRoutes from './routes/ai.routes.js';

// Load env variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/movies', movieRoutes);
app.use('/api/v1/recommend', aiRoutes);

// Health Check Route
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'MERN AI Movie Platform API is running 🚀'
    });
});

// Env Variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// DB Connection Function (better structure)
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB Connected Successfully');

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1); // stop app if DB fails
    }
};

// Start server
connectDB();