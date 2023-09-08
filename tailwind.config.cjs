const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './node_modules/vue-tailwind-datepicker/**/*.js',
  ],
  plugins: [require('@tailwindcss/forms')],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      faBlue: '#0B83D9',
      'vtd-primary': colors.slate, // Light mode Datepicker color
     // Dark mode Datepicker color
      ...colors,
      fontSize: {
        '2xs': '0.4rem',
      },
      borderWidth: {
        3: '3px',
      },
    },
  },
}
