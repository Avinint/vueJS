const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      ...colors,
    },
    extend: {
      colors: {
        lightBlue: colors.sky,
        warmGray: colors.stone,
        trueGray: colors.gray,
        blueGray: colors.slate,
        faBlue: '#0B83D9',
      },
    },
  },
}
