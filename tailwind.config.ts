import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#000000",
        panel: "#0a0a0a",
        panel2: "#111111",
        line: "#1e1e1e",
        ink: "#f2f2f2",
        muted: "#6b6b6b",
        gain: "#3ecf8e",
        loss: "#ef5350",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
