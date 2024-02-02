/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'primary':'#706e6c'
      }
    },
  },
  plugins: [],
}
