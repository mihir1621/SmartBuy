/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {}, // Customize theme here
  },
  darkMode: 'class',
  plugins: [], // Add Tailwind plugins if needed
};
