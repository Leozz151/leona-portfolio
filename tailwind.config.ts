import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        muted: "#5b6783",
        blue: {
          glow: "#39bfff",
          deep: "#1f78ff",
        },
        coral: {
          DEFAULT: "#ff7b68",
          soft: "#ffb09a",
        },
      },
      fontFamily: {
        sans: ["var(--font-space-grotesk)"],
        serif: ["var(--font-noto-serif-tc)"],
      },
      boxShadow: {
        aurora: "0 30px 90px rgba(30, 79, 151, 0.12)",
        panel: "0 24px 60px rgba(60, 43, 21, 0.1)",
      },
      backgroundImage: {
        aurora:
          "radial-gradient(circle at 12% 10%, rgba(57,191,255,0.23), transparent 26%), radial-gradient(circle at 88% 18%, rgba(255,123,104,0.22), transparent 24%), radial-gradient(circle at 52% 0%, rgba(111,211,255,0.18), transparent 24%), linear-gradient(180deg, #f7fbff 0%, #f8fbff 45%, #fff5f0 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
