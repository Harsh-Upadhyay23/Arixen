# Arixen: Futuristic AI Movie Platform

![Arixen Banner](https://via.placeholder.com/1200x400?text=Arixen+-+Futuristic+AI+Movie+Platform)

A highly intuitive, futuristic AI-powered movie recommendation system designed to predict user preferences in real-time. Arixen leverages behavioral analysis, real-time emotion detection, and explainable AI to provide a "Future Taste Prediction" engine wrapped in a theme-adaptive, cutting-edge user interface.

## 🌟 Key Features

- **🧠 Future Taste Prediction Engine**: AI-driven recommendation system that predicts what you want to watch before you even know it.
- **👁️ Real-time Emotion Detection**: Analyzes facial expressions via webcam or text sentiment to adapt recommendations to your current mood.
- **📊 Behavioral Analysis**: Intelligently tracks watch history and scrolling patterns to fine-tune suggestions.
- **💡 Explainable AI**: Understand exactly *why* a specific movie is recommended to you.
- **🎨 Theme-Adaptive UI**: A dynamic, premium user interface that seamlessly changes based on context and preferences.

## 🚀 Technology Stack

### Frontend
- **React 19** with **Vite** for lightning-fast performance
- **Tailwind CSS 4** for futuristic and responsive styling
- **Framer Motion** for smooth, dynamic micro-animations
- **React Webcam** for real-time emotion capture
- **Lucide React** for beautiful, consistent iconography

### Backend
- **Node.js** & **Express** for a robust server architecture
- **MongoDB** with **Mongoose** for flexible data modeling
- **Google Gemini AI** (`@google/genai`) for advanced, context-aware AI interactions

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB running locally or a MongoDB Atlas URI
- Google Gemini API Key

### 1. Clone the repository
```bash
git clone https://github.com/Harsh-Upadhyay23/Arixen.git
cd Arixen
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory and add your variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```
Start the frontend development server:
```bash
npm run dev
```

## 🏗️ Project Structure

```text
Arixen/
├── backend/
│   ├── models/         # Database models (User, Movie, etc.)
│   ├── routes/         # Express routes (AI, Auth, etc.)
│   ├── index.js        # Entry point for backend
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/ # Reusable UI components (MovieCard, etc.)
    │   ├── pages/      # Route pages (Home, AiSearch, etc.)
    │   └── App.jsx     # Main React application
    ├── postcss.config.js
    └── package.json
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License

This project is licensed under the ISC License.
