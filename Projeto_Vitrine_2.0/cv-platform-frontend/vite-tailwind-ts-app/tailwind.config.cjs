/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./public/**/*.html",
    "./src/**/*.{ts,tsx,js,jsx,css,html}"
  ],
  safelist: [
    "rounded-xl",
    "p-6",
    "p-4",
    "shadow-lg",
    "shadow-md",
    "border",
    "text-white",
    "bg-white/10"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: {
            DEFAULT: "#0b2233",      // principal
            light: "#34495E",        // variação clara
            dark: "#06111a",         // variação escura
          },
          secondary: {
            DEFAULT: "#27b1b3",      // secundária
            light: "#5fd3d5",        // variação clara
            dark: "#1a7c7d",         // variação escura
          },
          tertiary: {
            DEFAULT: "#ffc107",      // terciária
            light: "#ffe082",        // variação clara
            dark: "#c79100",         // variação escura
          },
          surface: "#0f3a54",
          white: "#FFFFFF",
          lightGray: "#ECF0F1",
          mediumGray: "#BDC3C7",
          darkGray: "#34495E",
          accent: "#27b1b3",
          success: "#28a745",
          error: "#dc3545",
          warning: "#ffc107",
        },
      },
      boxShadow: {
        "glass-lg": "0 6px 20px rgba(2,6,23,0.6)"
      },
      maxWidth: {
        card: "360px"
      }
    }
  },
  plugins: []
};
