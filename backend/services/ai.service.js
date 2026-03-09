import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import Movie from '../models/movie.model.js';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getAIRecommendations = async (userPrompt) => {
    try {
        console.log(`Analyzing Prompt: "${userPrompt}"`);
        
        // 1. Extract intent using Gemini
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            systemInstruction: `You are a movie recommendation assistant. Extract the user's movie preferences from their text. You MUST return ONLY a raw JSON strictly adhering to the following structure, with NO markdown formatting, NO backticks, and NO conversational text.

{
    "genres_include": ["genre1", "genre2"],
    "genres_exclude": ["genre3"],
    "keywords": ["keyword1", "keyword2"],
    "vibe": "a short description of the mood or vibe"
}

If you cannot find specific genres or keywords, leave the arrays empty.`,
            contents: [
                {
                    role: "user",
                    parts: [{ text: userPrompt }]
                }
            ],
            config: {
                temperature: 0.1,
            }
        });

        const rawResponse = response.text.trim();
        
        // Clean up markdown in case the model failed to follow instructions
        const jsonString = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        let extractedData;
        
        try {
            extractedData = JSON.parse(jsonString);
            console.log("Extracted Signals:", extractedData);
        } catch (e) {
            console.error("Failed to parse JSON from Gemini:", jsonString);
            return { error: true, message: "AI failed to extract preferences." };
        }

        // 2. Query MongoDB using extracted signals
        const query = {};
        
        if (extractedData.genres_include && extractedData.genres_include.length > 0) {
            // Capitalize first letter of each genre for TMDB match
            const formattedIntGenres = extractedData.genres_include.map(g => g.charAt(0).toUpperCase() + g.slice(1).toLowerCase());
            query.genres = { $in: formattedIntGenres };
        }
        
        if (extractedData.genres_exclude && extractedData.genres_exclude.length > 0) {
            const formattedExtGenres = extractedData.genres_exclude.map(g => g.charAt(0).toUpperCase() + g.slice(1).toLowerCase());
            if (query.genres) {
                const inQuery = query.genres;
                delete query.genres;
                query.$and = [
                    { genres: inQuery },
                    { genres: { $nin: formattedExtGenres } }
                ];
            } else {
                query.genres = { $nin: formattedExtGenres };
            }
        }

        let similarMovies = [];
        if (extractedData.keywords && extractedData.keywords.length > 0) {
            const searchString = extractedData.keywords.join(' ');
            let textQuery = { ...query, $text: { $search: searchString } };
            
            similarMovies = await Movie.find(textQuery)
                .sort({ score: { $meta: "textScore" }, rating: -1 })
                .limit(5);
        }

        if (similarMovies.length === 0) {
            similarMovies = await Movie.find(query)
                .sort({ rating: -1 })
                .limit(5);
        }

        if (similarMovies.length === 0) {
            similarMovies = await Movie.find().sort({ rating: -1 }).limit(5);
        }

        // 3. Generate "Why this movie" Explanation for the top result
        let topExplanation = null;
        if (similarMovies.length > 0) {
             const expl_response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                systemInstruction: `You are an AI movie expert. The user asked for: "${userPrompt}". We are recommending "${similarMovies[0].title}" (Synopsis: ${similarMovies[0].overview}). In 1-2 short, punchy sentences, explain WHY this movie is a perfect match for their request. Focus on the vibe and elements they asked for. Make it sound like a premium Netflix recommendation.`,
                contents: [
                    {
                        role: "user",
                        parts: [{ text: userPrompt }]
                    }
                ],
                config: {
                    temperature: 0.7,
                }
            });
            topExplanation = expl_response.text.trim();
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
