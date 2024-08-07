module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        'custom-purple': '#6a4c93',
        'custom-pink': '#f06493',
        'custom-green': '#33cc99',
        'custom-yellow': '#ffcc00',
        'custom-blue': '#00ccff',
        'custom-black': '#1a1a1a',
        'custom-white': '#ffffff',
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
