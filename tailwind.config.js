/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './*.js', // or './src/**/*.{js,ts,jsx,tsx}' if you have a src folder
  ],
  darkMode: 'class', // 'media' for system preference, 'class' for manual toggle
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8',
        secondary: '#EA580C',
      },
    },
  },
  plugins: [],
};