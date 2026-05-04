/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "ps-primary": "#03f0b5",
        "ps-secondary": "#02c49a",
        "ps-primary-hover": "#01d4a0",
      },
    },
  },
  plugins: [],
};
