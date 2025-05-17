/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './public/**/*.html'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0A3C1F',
        accent: '#FFD700',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} 