/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Incluye JS y JSX por compatibilidad futura
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#7e22ce", // Morado principal DIF moderno
          light: "#a855f7",
          dark: "#581c87",
        },
        accent: "#9333ea",
        background: "#f9fafb",
      },

      // =========================
      // Animaciones personalizadas
      // =========================
      animation: {
        "fade-zoom": "fadeInZoom 0.8s ease-out forwards",
        "fade-in": "fadeIn 1s ease-out forwards",
        "fade-in-delay": "fadeIn 1s ease-out 0.3s forwards",
        "fade-up": "fadeUp 0.8s ease-out forwards",
        "fade-up-delay": "fadeUp 0.8s ease-out 0.4s forwards",
        "slide-left": "slideLeft 0.7s ease-out forwards",
        "slide-right": "slideRight 0.7s ease-out forwards",
      },

      keyframes: {
        fadeInZoom: {
          "0%": { opacity: 0, transform: "scale(0.95)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(15px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        slideLeft: {
          "0%": { opacity: 0, transform: "translateX(40px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        slideRight: {
          "0%": { opacity: 0, transform: "translateX(-40px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
      },

      // =========================
      // Sombras, bordes y tipografía
      // =========================
      boxShadow: {
        soft: "0 8px 24px rgba(0, 0, 0, 0.08)",
        glow: "0 0 15px rgba(126, 34, 206, 0.4)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      fontFamily: {
        sans: ['"Noto Sans"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};