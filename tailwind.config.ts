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
        deep: "#07090a",
        forest: {
          950: "#0c1210",
          900: "#121a16",
          800: "#1a2820",
          700: "#2a3f32",
        },
        amber: {
          300: "#f0c14b",
          400: "#e8a317",
          500: "#d4920f",
          600: "#b87a0c",
        },
        moss: {
          400: "#5a9a6e",
          500: "#3d6b4f",
          600: "#2d5240",
        },
        cream: {
          50: "#faf6f0",
          100: "#f4efe6",
          200: "#e8e0d0",
          300: "#d4cbb8",
        },
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(61, 107, 79, 0.35), transparent 55%), radial-gradient(ellipse 50% 40% at 80% 20%, rgba(232, 163, 23, 0.12), transparent 50%), radial-gradient(ellipse 40% 30% at 15% 40%, rgba(61, 107, 79, 0.15), transparent 45%)",
      },
      boxShadow: {
        glow: "0 0 40px rgba(232, 163, 23, 0.25)",
        "glow-lg": "0 0 60px rgba(232, 163, 23, 0.3)",
        deep: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
      },
    },
  },
  plugins: [],
};

export default config;
