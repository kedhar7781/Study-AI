/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#6C63FF",
        secondary: "#00C2FF",
        accent: "#FFB703",
        success: "#22C55E",
        danger: "#EF4444",
        bgDark: "#0F172A",
        cardDark: "rgba(30, 41, 59, 0.7)",
        textDark: "#F8FAFC",
        // Light mode matches
        bgLight: "#F1F5F9",
        cardLight: "rgba(255, 255, 255, 0.7)",
        textLight: "#0F172A"
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-hover': '0 8px 32px 0 rgba(108, 99, 255, 0.45)',
      }
    },
  },
  plugins: [],
}
