import express from 'express';
import { getAIRecommendations } from '../services/ai.service.js';

const router = express.Router();

router.post('/chat', async (req, res) => {
    try {
        const { prompt } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ error: 'Please provide a movie preference prompt.' });
        }

        // For local MVP where user might not have GEMINI_API_KEY set yet, return mock if it fails 
        // to prevent UI crash, but try real first.
        if (!process.env.GEMINI_API_KEY) {
             return res.json({
                signals: { genres_include: ["Sci-Fi"], vibe: "Mock Mode. API Key not found." },
                movies: [],
                top_explanation: "Please add your GEMINI_API_KEY to the backend/.env file to see real AI magic!"
             });
        }

        const result = await getAIRecommendations(prompt);
        res.json(result);
    } catch (error) {
        console.error("Chat Router Error:", error);
        res.status(500).json({ error: 'Internal server error while processing AI Request' });
    }
});

export default router;
