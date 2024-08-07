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
        'light-purple': '#e0b3ff',
        'custom-red': '#ff0000',
        'custom-light-blue': '#eb9e52',
        'border-gold': '#FFD700',
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
        computer: ['Computer', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
      borderWidth: {
        '10': '10px',
        '20': '20px',
      },
      boxShadow: {
        'custom-border': '0 0 0 6px #A78BFA, 0 0 0 12px #FFD700',
        'custom-border-2': '0 0 0 6px #A78BFA, 0 0 0 12px #FFD700',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
