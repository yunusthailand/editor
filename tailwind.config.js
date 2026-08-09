import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  // No safelist: these classes existed for getTeamColors/getBlogColors, which
  // build class names dynamically. Both are unused, and every class here also
  // appears literally in JSX, so the content scanner finds them anyway.

  theme: {
    extend: {
      colors: {
        // Object form with DEFAULT so `bg-primary` / `text-primary` keep
        // resolving. There used to be a second `secondary: "#F59E0B"` key here
        // that the object below silently overwrote — it never rendered.
        primary: {
          DEFAULT: "#2D6C8E",
        },

        background: "#F8F8F8",

        secondary: {
          DEFAULT: "#4EACAB",
          t: "#4EACAB",
          p: "#E9B0AE",
          r: "#E5583F",
          y: "#FAC148",
        },

        danger: "#E5583F",
      },

      // Named by role, so the same control reads the same everywhere. The app
      // previously mixed six radius scales across equivalent elements.
      borderRadius: {
        control: "0.5rem",
        card: "1rem",
        pill: "9999px",
      },

      boxShadow: {
        card: "0 1px 3px rgb(0 0 0 / 0.08)",
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

  // tailwindcss-animate supplies the enter/exit utilities
  // (data-[state=open]:animate-in etc.) that the Radix-based dialog and select
  // components use for their open/close transitions.
  plugins: [tailwindcssAnimate],
};
