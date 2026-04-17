/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "var(--surface)",
        border: "var(--border)",
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
        },
        secondary: {
          DEFAULT: "var(--secondary-bg)",
          text: "var(--secondary-text)",
        },
        input: "var(--input-bg)",
        success: "var(--success)",
        error: "var(--error)",
        warning: "var(--warning)",
      },
      boxShadow: {
        'saas': '0 2px 8px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  darkMode: 'class',
  plugins: [], // Add Tailwind plugins if needed
};
