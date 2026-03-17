import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          900: "#0F1F5C",
          700: "#1A3A8F",
          500: "#2563EB",
          100: "#DBEAFE",
          50: "#EFF6FF",
        },
        amber: {
          500: "#F59E0B",
          100: "#FEF3C7",
        },
        green: {
          500: "#10B981",
          100: "#D1FAE5",
        },
        red: {
          500: "#EF4444",
          100: "#FEE2E2",
        },
        gray: {
          950: "#0C0E14",
          800: "#1E2130",
          600: "#475569",
          400: "#94A3B8",
          200: "#E2E8F0",
          100: "#F1F5F9",
          50: "#F8FAFC",
        },
      },
      fontFamily: {
        serif: ["var(--font-dm-serif)"],
        sans: ["var(--font-dm-sans)"],
        mono: ["var(--font-jetbrains-mono)"],
      },
    },
  },
  plugins: [],
};
export default config;
