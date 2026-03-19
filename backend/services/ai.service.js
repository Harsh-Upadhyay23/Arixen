import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import Movie from "../models/movie.model.js";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ✅ helper: safe JSON parse
const safeParseJSON = (text) => {
  try {
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (err) {
    return null;
  }
};

// ✅ helper: normalize genres
const normalizeGenres = (genres = []) =>
  genres.map(
    (g) => g.charAt(0).toUpperCase() + g.slice(1).toLowerCase()
  );

export const getAIRecommendations = async (userPrompt) => {
  try {
    if (!userPrompt || userPrompt.trim().length < 3) {
      throw new Error("Prompt too short");
    }

    console.log("🎯 Prompt:", userPrompt);

    // =============================
    // 1. AI Extraction
    // =============================
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      systemInstruction: `
Return ONLY valid JSON:

{
  "genres_include": [],
  "genres_exclude": [],
  "keywords": [],
  "vibe": ""
}
      `,
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      config: {
        temperature: 0.1,
        responseMimeType: "application/json",
      },
    });

    let extractedData = safeParseJSON(response.text);

    // ✅ fallback (IMPORTANT)
    if (!extractedData) {
      console.warn("⚠️ AI JSON failed, fallback used");

      extractedData = {
        genres_include: [],
        genres_exclude: [],
        keywords: userPrompt.split(" ").slice(0, 5),
        vibe: "user preference",
      };
    }

    console.log("🧠 Extracted:", extractedData);

    // =============================
    // 2. Build Query
    // =============================
    const query = {};
    const includeGenres = normalizeGenres(extractedData.genres_include);
    const excludeGenres = normalizeGenres(extractedData.genres_exclude);

    if (includeGenres.length) {
      query.genres = { $in: includeGenres };
    }

    if (excludeGenres.length) {
      if (query.genres) {
        query.$and = [
          { genres: query.genres },
          { genres: { $nin: excludeGenres } },
        ];
        delete query.genres;
      } else {
        query.genres = { $nin: excludeGenres };
      }
    }

    let movies = [];

    // =============================
    // 3. Keyword Search
    // =============================
    if (extractedData.keywords?.length) {
      try {
        const searchString = extractedData.keywords.join(" ");

        movies = await Movie.find({
          ...query,
          $text: { $search: searchString },
        })
          .sort({
            score: { $meta: "textScore" },
            rating: -1,
          })
          .limit(6);
      } catch (err) {
        console.warn("⚠️ Text search failed:", err.message);
      }
    }

    // =============================
    // 4. Fallbacks
    // =============================
    if (!movies.length) {
      movies = await Movie.find(query)
        .sort({ rating: -1 })
        .limit(6);
    }

    if (!movies.length) {
      movies = await Movie.find()
        .sort({ rating: -1 })
        .limit(6);
    }

    // =============================
    // 5. AI Explanation
    // =============================
    let explanation = null;

    if (movies.length) {
      try {
        const expl = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          systemInstruction:
            "Explain in ONE short sentence (max 15 words).",
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

        explanation = expl.text.trim().slice(0, 120);
      } catch (err) {
        explanation = `Matches your vibe: ${extractedData.vibe}`;
      }
    }

    // =============================
    // FINAL RESPONSE
    // =============================
    return {
      success: true,
      signals: extractedData,
      movies,
      top_explanation: explanation,
    };
  } catch (error) {
    console.error("❌ AI Error:", error.message);

    return {
      success: false,
      message: "Failed to get recommendations",
    };
  }
};