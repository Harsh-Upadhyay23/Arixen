import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  preferences: {
    favorite_genres: [{ type: String }],
    favorite_movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
  }
});

export default mongoose.model('User', userSchema);
