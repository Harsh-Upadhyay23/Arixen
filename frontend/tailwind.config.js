/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        netflixRed: '#E50914',
        darkBg: '#141414',
        darkCard: '#1f1f1f',
        lightText: '#e5e5e5',
        grayText: '#808080'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
