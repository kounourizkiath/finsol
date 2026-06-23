/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0a0e27",
        secondary: "#1a1f3a",
        tertiary: "#242d4a",
        border: "#3a4458",
        accent: "#00d4aa",
      },
    },
  },
  plugins: [],
}
