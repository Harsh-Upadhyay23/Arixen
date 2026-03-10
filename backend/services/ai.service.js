import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import Movie from '../models/movie.model.js';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getAIRecommendations = async (userPrompt) => {
    try {
        console.log(`Analyzing Prompt: "${userPrompt}"`);

        // 1. Extract intent using Gemini — strict JSON mode
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            systemInstruction: `You are a movie preference extractor. Return ONLY a valid JSON object with these exact keys. No markdown, no explanation, no other text.

{
  "genres_include": ["Action"],
  "genres_exclude": [],
  "keywords": ["thriller", "twist"],
  "vibe": "dark and intense"
}

Rules:
- genres_include: 1-3 genre strings from: Action, Adventure, Animation, Comedy, Crime, Documentary, Drama, Fantasy, Horror, Mystery, Romance, Science Fiction, Thriller, Western
- genres_exclude: genres to avoid (can be empty)
- keywords: 3-5 important words describing mood, theme, era, or style
- vibe: one short phrase (max 8 words) describing the overall feel`,
            contents: [
                {
                    role: "user",
                    parts: [{ text: userPrompt }]
                }
            ],
            config: {
                temperature: 0.1,
                responseMimeType: "application/json",
            }
        });

        const rawResponse = response.text.trim();
        const jsonString = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        let extractedData;

        try {
            extractedData = JSON.parse(jsonString);
            console.log("Extracted Signals:", extractedData);
        } catch (e) {
            console.error("Failed to parse JSON from Gemini:", jsonString);
            // Fallback: try a simple text search with the raw prompt words
            extractedData = {
                genres_include: [],
                genres_exclude: [],
                keywords: userPrompt.split(' ').slice(0, 5),
                vibe: "based on your description"
            };
        }

        // 2. Query MongoDB using extracted signals
        const query = {};

        if (extractedData.genres_include && extractedData.genres_include.length > 0) {
            const formattedGenres = extractedData.genres_include.map(
                g => g.charAt(0).toUpperCase() + g.slice(1).toLowerCase()
            );
            query.genres = { $in: formattedGenres };
        }

        if (extractedData.genres_exclude && extractedData.genres_exclude.length > 0) {
            const formattedExclude = extractedData.genres_exclude.map(
                g => g.charAt(0).toUpperCase() + g.slice(1).toLowerCase()
            );
            if (query.genres) {
                const inQuery = query.genres;
                delete query.genres;
                query.$and = [
                    { genres: inQuery },
                    { genres: { $nin: formattedExclude } }
                ];
            } else {
                query.genres = { $nin: formattedExclude };
            }
        }

        // Try keyword text search first
        let similarMovies = [];
        if (extractedData.keywords && extractedData.keywords.length > 0) {
            const searchString = extractedData.keywords.join(' ');
            const textQuery = { ...query, $text: { $search: searchString } };

            try {
                similarMovies = await Movie.find(textQuery)
                    .sort({ score: { $meta: "textScore" }, rating: -1 })
                    .limit(6);
            } catch (textSearchErr) {
                console.warn("Text search failed, falling back to genre query:", textSearchErr.message);
            }
        }

        // Fallback to genre-only
        if (similarMovies.length === 0) {
            similarMovies = await Movie.find(query).sort({ rating: -1 }).limit(6);
        }

        // Final fallback — top-rated
        if (similarMovies.length === 0) {
            similarMovies = await Movie.find().sort({ rating: -1 }).limit(6);
        }

        // 3. Generate ONE short explanation sentence for the top result
        let topExplanation = null;
        if (similarMovies.length > 0) {
            try {
                const explResponse = await ai.models.generateContent({
                    model: "gemini-2.0-flash",
                    systemInstruction: `You are a movie recommender. Write ONE sentence (max 15 words) explaining why the movie matches what the user asked for. Be specific and direct. No quotes, no extra words.`,
                    contents: [
                        {
                            role: "user",
                            parts: [{
                                text: `User asked for: "${userPrompt}". Top result: "${similarMovies[0].title}". Why does it match?`
                            }]
                        }
                    ],
                    config: {
                        temperature: 0.5,
                    }
                });

                const rawExpl = explResponse.text.trim();
                // Truncate if still too long (safety net)
                topExplanation = rawExpl.length > 120
                    ? rawExpl.substring(0, rawExpl.lastIndexOf(' ', 120)) + '…'
                    : rawExpl;

            } catch (explErr) {
                console.warn("Explanation generation failed:", explErr.message);
                topExplanation = `Matches your vibe: ${extractedData.vibe || 'your description'}`;
            }
        }

        return {
            signals: extractedData,
            movies: similarMovies,
            top_explanation: topExplanation
        };

    } catch (error) {
        console.error("AI Recommendation Error:", error);
        throw error;
    }
};
