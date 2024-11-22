import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#9b87f5",
          dark: "#1A1F2C",
          light: "#D6BCFA",
        },
        secondary: {
          DEFAULT: "#7E69AB",
          dark: "#6E59A5",
          light: "#E5DEFF",
        },
        gray: {
          700: "#374151",
          800: "#1f2937",
          200: "#e5e7eb",
          100: "#f3f4f6",
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 15px rgba(0, 0, 0, 0.1)",
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        glow: "0 0 15px rgba(155, 135, 245, 0.5)",
        'inner-glow': 'inset 0 0 15px rgba(155, 135, 245, 0.2)',
      },
      backdropBlur: {
        glass: "blur(4px)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "zoom-in": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.02)" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 15px rgba(155, 135, 245, 0.5)" },
          "50%": { boxShadow: "0 0 25px rgba(155, 135, 245, 0.8)" },
        }
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "zoom-hover": "zoom-in 0.2s ease-out forwards",
        "slide-in": "slide-in 0.3s ease-out",
        "pulse-glow": "pulse-glow 2s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;