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
        bg: "var(--bg)",
        "text-primary": "var(--text-primary)",
        "text-muted": "var(--text-muted)",
        accent: "#D1D1D1", // Purple accent
        blue: "#3b82f6",
        green: "#10b981",
        card: "rgba(0,0,0, 0.04)",
        border: "rgba(0,0,0, 0.1)",
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      keyframes: {
        reveal: {
          '0%': { transform: 'translateY(40px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.25' },
          '50%': { transform: 'scale(1.08)', opacity: '0.35' },
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(calc(-50% - 0.5rem))' },
        },
      },
      animation: {
        'reveal': 'reveal 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slow-pulse': 'pulse 8s ease-in-out infinite',
        'scroll': 'scroll 40s linear infinite',
      },
    },
  },
  plugins: [],
};
export default config;
