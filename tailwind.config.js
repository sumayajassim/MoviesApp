/** @type {import('tailwindcss').Config} */
module.exports = {
  // mode: 'jit',
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    './components/**/*.{js,ts,jsx,tsx}',
    // "./node_modules/flowbite/**/*.js",
    // Or if using `src` directory:
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'white': '#ffffff',
      'purple': '#3f3cbb',
      'midnight': '#121063',
      'metal': '#565584',
      'tahiti': '#3ab7bf',
      'silver': '#ecebff',
      'bubble-gum': '#ff77e9',
      'bermuda': '#78dcca',
      'black': '#000000',
      'yellow': '#ffd43b'
    },
    extend: {
      maxHeight: {
        '128': '32rem',
      },
      width:{
        '110': '27rem'
      }
    },
  },
  plugins: [
    // require('flowbite/plugin')
  ],
}
