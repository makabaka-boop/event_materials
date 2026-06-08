/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        brand: {
          dark: "#1a1a2e",
          mid: "#16213e",
          accent: "#e8703a",
          "accent-hover": "#d4612e",
          surface: "#f5f5f0",
          card: "#ffffff",
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', '"Noto Sans SC"', 'sans-serif'],
        display: ['"DM Sans"', '"Noto Sans SC"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
