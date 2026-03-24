/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pale-white': '#fafafd',
        'pale-green': '#f1f4f4',
        'dark-green': '#44605e',
        'light-stroke': '#ebebeb',
        'palerblue': '#f1f6fc',
        'dark-grey-4': '#444',
        'dark-grey-5': '#555',
        'ruby': '#ff5f7c',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

