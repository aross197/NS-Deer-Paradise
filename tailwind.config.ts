import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      colors: {
        deep: "#050708",
        forest: {
          950: "#0a100e",
          900: "#101815",
          800: "#1a2820",
          700: "#2a3f32",
        },
        amber: {
          300: "#f5d078",
          400: "#e8a317",
          500: "#d4920f",
          600: "#b87a0c",
        },
        moss: {
          400: "#6bbf82",
          500: "#3d6b4f",
          600: "#2d5240",
        },
        cream: {
          50: "#fffcf7",
          100: "#f6f1e8",
          200: "#e8e0d0",
          300: "#d4cbb8",
        },
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(ellipse 85% 55% at 50% -15%, rgba(61, 107, 79, 0.42), transparent 52%), radial-gradient(ellipse 55% 45% at 85% 15%, rgba(232, 163, 23, 0.14), transparent 48%), radial-gradient(ellipse 45% 35% at 10% 50%, rgba(61, 107, 79, 0.18), transparent 45%)",
      },
      boxShadow: {
        glow: "0 0 48px rgba(232, 163, 23, 0.28)",
        "glow-lg": "0 0 72px rgba(232, 163, 23, 0.35)",
        deep: "0 25px 50px -12px rgba(0, 0, 0, 0.75)",
      },
    },
  },
  plugins: [],
};

export default config;
