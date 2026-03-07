import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  overview: { type: String, required: true },
  poster_url: { type: String, required: true },
  genres: [{ type: String }],
  cast: [{ type: String }],
  release_year: { type: Number },
  rating: { type: Number, default: 0 },
});

// Create text index for basic search
movieSchema.index({ title: 'text', overview: 'text', genres: 'text' });

export default mongoose.model('Movie', movieSchema);
