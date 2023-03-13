/** @type {import('tailwindcss').Config} */
// module.exports = {
  // mode: 'jit',
//   content: [
//     "./app/**/*.{js,ts,jsx,tsx}",
//     "./pages/**/*.{js,ts,jsx,tsx}",
//     './components/**/*.{js,ts,jsx,tsx}',
//     // "./node_modules/flowbite/**/*.js",
//     // Or if using `src` directory:
//   ],
//   theme: {
//     colors: {
//       'white': '#ffffff',
//       'grey' : '#e5e5e5',
//       'black': '#000000',
//       'yellow': '#ffd43b'
//     },
//     extend: {
//       maxHeight: {
//         '128': '32rem',
//       },
//       width:{
//         '110': '27rem'
//       }
//     },
//   },
//   plugins: [
//     // require("@tailwindcss/typography"),require('@tailwindcss/forms')
//   ],
// }

module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    borderWidth: {
      '1': '1px',
    },
    extend: {
      colors: {
        'white': '#ffffff',
        'dark-grey' : '#808080',
        'black': '#000000',
        'yellow': '#ffd43b'
      },
      maxHeight: {
        '128': '32rem',
      },
      width:{
        '110': '27rem',
        '200': '35rem'
      },
      height: {
        "50v": "50vh"
      }
    },
   
  },
  variants: {
    extend: {},
  },
  plugins: [],
}