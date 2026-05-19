/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  safelist: [
    "bg-primary",
    "bg-secondary-t",
    "bg-secondary-p",
    "bg-secondary-r",
    "bg-secondary-y",
  ],

  theme: {
    extend: {
      colors: {
        primary: "#2D6C8E",
        secondary: "#F59E0B",

        background: "#F8F8F8",

        secondary: {
          t: "#4EACAB",
          p: "#E9B0AE",
          r: "#E5583F",
          y: "#FAC148",
        },
      },

      fontFamily: {
        sans: ["Jost", "Sarabun", "sans-serif"],
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },

      animation: {
        fadeIn: "fadeIn 0.8s ease-out forwards",
      },
    },
  },

  plugins: [],
};
