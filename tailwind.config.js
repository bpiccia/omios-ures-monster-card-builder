/** @type {import('tailwindcss').Config} */
export default {
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
