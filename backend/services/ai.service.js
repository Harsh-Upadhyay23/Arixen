import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import Movie from "../models/movie.model.js";
import LRU from "lru-cache";

dotenv.config();

// =============================
// ⚙️ CONFIG (Industry Standard)
// =============================
const CONFIG = {
  MODEL: "gemini-2.0-flash",
  TIMEOUT: 8000,
  MAX_RETRIES: 2,
  CACHE_TTL: 1000 * 60 * 10,
};

// =============================
// 🧠 AI INIT
// =============================
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// =============================
// 🪵 LOGGER (Replace console.log)
// =============================
const logger = {
  info: (...args) => console.log("ℹ️", ...args),
  warn: (...args) => console.warn("⚠️", ...args),
  error: (...args) => console.error("❌", ...args),
};

// =============================
// ⚡ LRU CACHE (Better than Map)
// =============================
const cache = new LRU({
  max: 100,
  ttl: CONFIG.CACHE_TTL,
});

// =============================
// 🔒 SAFE JSON PARSE
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
    logger.warn("JSON Parse Failed:", err.message);
    return null;
  }
};

// =============================
// 🎭 NORMALIZE GENRES
// =============================
const normalizeGenres = (genres = []) =>
  [...new Set(genres)].map(
    (g) => g.charAt(0).toUpperCase() + g.slice(1).toLowerCase()
  );

// =============================
// ⏱️ TIMEOUT WRAPPER
// =============================
const withTimeout = (promise, ms) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("AI Timeout")), ms)
    ),
  ]);

// =============================
// 🔁 RETRY WRAPPER
// =============================
const retry = async (fn, retries = CONFIG.MAX_RETRIES) => {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) throw err;
    logger.warn("Retrying AI call...");
    return retry(fn, retries - 1);
  }
};

// =============================
// 🛡️ INPUT VALIDATION
// =============================
const validatePrompt = (prompt) => {
  if (!prompt || typeof prompt !== "string") {
    throw new Error("Invalid prompt type");
  }
  if (prompt.trim().length < 3) {
    throw new Error("Prompt too short");
  }
  if (prompt.length > 300) {
    throw new Error("Prompt too long");
  }
};

// =============================
// 🎯 MAIN FUNCTION
// =============================
export const getAIRecommendations = async (userPrompt) => {
  try {
    validatePrompt(userPrompt);
    logger.info("Prompt:", userPrompt);

    // =============================
    // ⚡ CACHE CHECK
    // =============================
    const cached = cache.get(userPrompt);
    if (cached) {
      logger.info("Cache hit");
      return cached;
    }

    // =============================
    // 🤖 AI EXTRACTION
    // =============================
    const aiCall = () =>
      ai.models.generateContent({
        model: CONFIG.MODEL,
        systemInstruction: `
Return ONLY JSON:

{
  "genres_include": [],
  "genres_exclude": [],
  "keywords": [],
  "vibe": ""
}
        `,
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        config: {
          temperature: 0.2,
          responseMimeType: "application/json",
        },
      });

    const response = await retry(() =>
      withTimeout(aiCall(), CONFIG.TIMEOUT)
    );

    let extractedData = safeParseJSON(response.text);

    // =============================
    // ⚠️ FALLBACK
    // =============================
    if (!extractedData) {
      logger.warn("Fallback extraction used");

      extractedData = {
        genres_include: [],
        genres_exclude: [],
        keywords: userPrompt.split(" ").slice(0, 6),
        vibe: userPrompt,
      };
    }

    logger.info("Extracted:", extractedData);

    // =============================
    // 🔍 BUILD QUERY
    // =============================
    const query = {};
    const includeGenres = normalizeGenres(extractedData.genres_include);
    const excludeGenres = normalizeGenres(extractedData.genres_exclude);

    if (include
