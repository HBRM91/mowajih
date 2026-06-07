/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#EEF1F6",
          100: "#D5DCE8",
          200: "#ABB9D1",
          300: "#8196BA",
          400: "#5773A3",
          500: "#2D508C",
          600: "#1B365D",
          700: "#162C4D",
          800: "#11223D",
          900: "#0C182E",
          950: "#080F1E",
        },
        gold: {
          50: "#FBF8F0",
          100: "#F7F0E1",
          200: "#EFE1C3",
          300: "#E7D2A5",
          400: "#DFC387",
          500: "#D7B469",
          600: "#C9A962",
          700: "#A68B4F",
          800: "#836D3E",
          900: "#604F2D",
          950: "#3D321C",
        },
        cream: "#FAF9F6",
        parchment: "#F5F3EE",
        ink: "#1F2937",
      },
      fontFamily: {
        heading: ["Playfair Display", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        arabic: ["Noto Naskh Arabic", "serif"],
      },
      animation: {
        "float": "float 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "slide-up": "slideUp 0.5s ease-out",
        "fade-in": "fadeIn 0.4s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "shimmer": "shimmer 2.5s linear infinite",
        "twinkle": "twinkle 2s ease-in-out infinite",
        "spin-slow": "spin 60s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(215,180,105,0.3)" },
          "50%": { boxShadow: "0 0 25px rgba(215,180,105,0.6)" },
        },
        slideUp: {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        scaleIn: {
          from: { transform: "scale(0.8)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.2", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.5)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      boxShadow: {
        "gold-sm": "0 2px 8px rgba(215, 180, 105, 0.15)",
        "gold": "0 4px 20px rgba(215, 180, 105, 0.25)",
        "gold-lg": "0 8px 40px rgba(215, 180, 105, 0.35)",
        "navy-sm": "0 2px 8px rgba(12, 24, 46, 0.12)",
        "navy": "0 4px 20px rgba(12, 24, 46, 0.2)",
        "navy-lg": "0 8px 40px rgba(12, 24, 46, 0.3)",
      },
    },
  },
  plugins: [],
};
