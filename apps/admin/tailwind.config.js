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
      },
    },
  },
  plugins: [],
};
