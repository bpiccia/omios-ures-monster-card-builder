/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'queens-park': ['QueensPark', 'serif'],
        'sudbury': ['Sudbury', 'serif'],
      },
    },
  },
  plugins: [],
}
