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
        sidebar: "#212121",
        popover: "#212121",
      },
      borderRadius: {
        DEFAULT: "0.75rem",
      },
      fontFamily: {
        sans: ['"Paytone One"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}
