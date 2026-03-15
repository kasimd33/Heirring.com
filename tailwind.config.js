/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#1A1A1A",
        foreground: "#FAFAFA",
        card: "#262626",
        "card-foreground": "#FAFAFA",
        primary: "#2DD4BF",
        "primary-foreground": "#1A1A1A",
        secondary: "#333333",
        "secondary-foreground": "#FAFAFA",
        muted: "#333333",
        "muted-foreground": "#A3A3A3",
        border: "#404040",
        input: "#333333",
        ring: "#2DD4BF",
        destructive: "#DC2626",
        sidebar: "#FFFFFF",
        popover: "#212121",
      },
      borderRadius: {
        DEFAULT: "0.75rem",
        lg: "1rem",
      },
      fontFamily: {
        sans: ['"Paytone One"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.3), 0 10px 20px -2px rgba(0, 0, 0, 0.2)",
        "primary-glow": "0 4px 14px 0 rgba(45, 212, 191, 0.25)",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #2DD4BF 0%, #2DD4BF 100%)",
        "gradient-card": "linear-gradient(135deg, rgba(45, 212, 191, 0.1) 0%, rgba(45, 212, 191, 0.05) 100%)",
        "gradient-border": "linear-gradient(135deg, rgba(45, 212, 191, 0.6), rgba(45, 212, 191, 0.2), transparent)",
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        shimmer: "shimmer 1.5s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      transitionDuration: {
        400: "400ms",
      },
    },
  },
  plugins: [],
};
