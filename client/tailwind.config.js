/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#0a0a0a",    // Pitch Black background
          gray: "#171717",    // Card background
          primary: "#3b82f6", // Trust Blue (Action buttons)
          accent: "#8b5cf6",  // AI Purple (Highlights)
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}