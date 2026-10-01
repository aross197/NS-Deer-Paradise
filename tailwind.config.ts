import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: "#0f1a0f",
          900: "#1a2f1a",
          800: "#2d4a2d",
        },
        amber: {
          500: "#d97706",
          600: "#b45309",
        },
      },
    },
  },
  plugins: [],
};

export default config;
