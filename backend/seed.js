import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from './models/movie.model.js';

dotenv.config();

const mockMovies = [
  {
    title: "Interstellar",
    overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    poster_url: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    genres: ["Adventure", "Drama", "Sci-Fi"],
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    release_year: 2014,
    rating: 8.6
  },
  {
    title: "Se7en",
    overview: "Two detectives, a rookie and a veteran, hunt a serial killer who uses the seven deadly sins as his motives.",
    poster_url: "https://image.tmdb.org/t/p/w500/6yoghtyTpznpBik8EngEmJskVPh.jpg",
    genres: ["Crime", "Drama", "Mystery", "Thriller"],
    cast: ["Morgan Freeman", "Brad Pitt", "Kevin Spacey"],
    release_year: 1995,
    rating: 8.6
  },
  {
    title: "The Dark Knight",
    overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    poster_url: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    genres: ["Action", "Crime", "Drama", "Thriller"],
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    release_year: 2008,
    rating: 9.0
  },
  {
    title: "Inception",
    overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    poster_url: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    genres: ["Action", "Adventure", "Sci-Fi", "Thriller"],
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
    release_year: 2010,
    rating: 8.8
  },
  {
    title: "Everything Everywhere All at Once",
    overview: "An aging Chinese immigrant is swept up in an insane adventure, where she alone can save the world by exploring other universes connecting with the lives she could have led.",
    poster_url: "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
    genres: ["Action", "Adventure", "Sci-Fi"],
    cast: ["Michelle Yeoh", "Stephanie Hsu", "Ke Huy Quan"],
    release_year: 2022,
    rating: 8.0
  },
  {
    title: "Parasite",
    overview: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    poster_url: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    genres: ["Comedy", "Drama", "Thriller"],
    cast: ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong"],
    release_year: 2019,
    rating: 8.6
  },
  {
    title: "The Matrix",
    overview: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    poster_url: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    genres: ["Action", "Sci-Fi"],
    cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
    release_year: 1999,
    rating: 8.7
  },
  {
    title: "Spirited Away",
    overview: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.",
    poster_url: "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkBg8tzkO.jpg",
    genres: ["Animation", "Family", "Fantasy"],
    cast: ["Rumi Hiiragi", "Miyu Irino", "Mari Natsuki"],
    release_year: 2001,
    rating: 8.6
  }
];

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/movieDB';

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding');
    
    await Movie.deleteMany({});
    console.log('Cleared existing movies');

    await Movie.insertMany(mockMovies);
    console.log(`Inserted ${mockMovies.length} movies successfully!`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
