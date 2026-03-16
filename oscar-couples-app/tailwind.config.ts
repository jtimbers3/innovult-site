import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        velvet: "#2f1b3d",
        gold: "#d4af37",
        champagne: "#f7e7ce"
      }
    }
  },
  plugins: []
};

export default config;
