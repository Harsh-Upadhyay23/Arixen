import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import Movie from "../models/movie.model.js";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// =============================
// 🔒 Safe JSON Parse (Improved)
// =============================
const safeParseJSON = (text) => {
  try {
    if (!text) return null;

    const cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (err) {
    console.warn("❌ JSON Parse Failed:", err.message);
    return null;
  }
};

// =============================
// 🎭 Normalize Genres
// =============================
const normalizeGenres = (genres = []) =>
  [...new Set(genres)].map(
    (g) => g.charAt(0).toUpperCase() + g.slice(1).toLowerCase()
  );

// =============================
// ⚡ Simple Cache (reduce AI cost)
// =============================
const cache = new Map();
const CACHE_TTL = 1000 * 60 * 10; // 10 min

const getCache = (key) => {
  const data = cache.get(key);
  if (!data) return null;
  if (Date.now() > data.expiry) {
    cache.delete(key);
    return null;
  }
  return data.value;
};

const setCache = (key, value) => {
  cache.set(key, {
    value,
    expiry: Date.now() + CACHE_TTL,
  });
};

// =============================
// 🎯 MAIN FUNCTION
// =============================
export const getAIRecommendations = async (userPrompt) => {
  try {
    if (!userPrompt || userPrompt.trim().length < 3) {
      throw new Error("Prompt too short");
    }

    console.log("🎯 Prompt:", userPrompt);

    // =============================
    // 🧠 Check Cache
    // =============================
    const cached = getCache(userPrompt);
    if (cached) {
      console.log("⚡ Cache hit");
      return cached;
    }

    // =============================
    // 🤖 AI Extraction (Improved Prompt)
    // =============================
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      systemInstruction: `
You are a movie recommendation parser.

Extract structured data strictly in JSON format:

{
  "genres_include": ["Action", "Comedy"],
  "genres_exclude": ["Horror"],
  "keywords": ["revenge", "mafia"],
  "vibe": "dark intense emotional"
}

Rules:
- Genres must be common movie genres
- Keywords = important themes
- vibe = 3-5 descriptive words
- DO NOT explain anything
- ONLY return JSON
      `,
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      config: {
        temperature: 0.2,
        responseMimeType: "application/json",
      },
    });

    let extractedData = safeParseJSON(response.text);

    // =============================
    // ⚠️ Fallback Extraction
    // =============================
    if (!extractedData) {
      console.warn("⚠️ AI JSON failed, fallback used");

      extractedData = {
        genres_include: [],
        genres_exclude: [],
        keywords: userPrompt.split(" ").slice(0, 6),
        vibe: userPrompt,
      };
    }

    console.log("🧠 Extracted:", extractedData);

    // =============================
    // 🔍 Build Query
    // =============================
    const query = {};
    const includeGenres = normalizeGenres(extractedData.genres_include);
    const excludeGenres = normalizeGenres(extractedData.genres_exclude);

    if (includeGenres.length) {
      query.genres = { $in: includeGenres };
    }

    if (excludeGenres.length) {
      query.genres = {
        ...(query.genres || {}),
        $nin: excludeGenres,
      };
    }

    let movies = [];

    // =============================
    // 🔎 TEXT SEARCH (BOOSTED)
    // =============================
    if (extractedData.keywords?.length) {
      const searchString = extractedData.keywords.join(" ");

      try {
        movies = await Movie.find({
          ...query,
          $text: { $search: searchString },
        })
          .select({
            score: { $meta: "textScore" },
            title: 1,
            genres: 1,
            rating: 1,
            overview: 1,
          })
          .sort({
            score: { $meta: "textScore" },
            rating: -1,
          })
          .limit(10);
      } catch (err) {
        console.warn("⚠️ Text search failed:", err.message);
      }
    }

    // =============================
    // 📉 Fallback Strategy (Smarter)
    // =============================
    if (!movies.length) {
      movies = await Movie.find(query)
        .sort({ rating: -1 })
        .limit(10);
    }

    if (!movies.length) {
      movies = await Movie.find()
        .sort({ rating: -1 })
        .limit(10);
    }

    // =============================
    // 🎯 VIBE SCORING (NEW 🔥)
    // =============================
    const vibeWords = extractedData.vibe.split(" ");

    movies = movies.map((movie) => {
      const text =
        (movie.overview || "") + " " + movie.genres.join(" ");

      let score = 0;

      vibeWords.forEach((word) => {
        if (text.toLowerCase().includes(word.toLowerCase())) {
          score += 1;
        }
      });

      return { ...movie.toObject(), vibeScore: score };
    });

    movies.sort((a, b) => b.vibeScore - a.vibeScore || b.rating - a.rating);

    movies = movies.slice(0, 6);

    // =============================
    // 🧠 AI Explanation
    // =============================
    let explanation = null;

    if (movies.length) {
      try {
        const expl = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          systemInstruction:
            "Explain recommendation in 1 short sentence under 12 words.",
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `User: ${userPrompt}, Movie: ${movies[0].title}`,
                },
              ],
            },
          ],
        });

        explanation = expl.text.trim().slice(0, 100);
      } catch {
        explanation = `Perfect match for your vibe: ${extractedData.vibe}`;
      }
    }

    // =============================
    // 📦 Final Response
    // =============================
    const result = {
      success: true,
      signals: extractedData,
      movies,
      top_explanation: explanation,
    };

    // =============================
    // ⚡ Save Cache
    // =============================
    setCache(userPrompt, result);

    return result;
  } catch (error) {
    console.error("❌ AI Error:", error.message);

    return {
      success: false,
      message: "Failed to get recommendations",
    };
  }
};
