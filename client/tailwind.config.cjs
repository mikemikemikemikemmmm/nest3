/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        "aside": 165,
        productCard: 220,
        wrapper: 1180
      },
      fontSize: {
        wrapper: 12
      },
      height: {
        productCard: 330,
        carousel:630

      },
      colors: {
        aside: '#4d494a',
        asideHover: '#bb9064',
        wrapper: '#706e6c',
        logo:"#4d3126",
        nav: {
          text: '#b7b7b7',
          hover: "#715644",
          actived_bg: "#f0ede5"
        }
      }
    },
  },
  plugins: [],
}  