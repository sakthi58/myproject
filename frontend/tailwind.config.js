/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        blush: {
          50: '#FFF8F6',
          100: '#FFF1F3',
          200: '#FCE0E6',
          300: '#F8C6D2'
        },
        rose: {
          400: '#D4577E',
          500: '#B0264A',
          600: '#8F1D3B',
          700: '#6E152C'
        },
        cream: '#FFFBF7',
        gold: '#C9A15C'
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        script: ['"Dancing Script"', 'cursive'],
        body: ['"Poppins"', 'sans-serif']
      },
      boxShadow: {
        card: '0 20px 45px -15px rgba(176, 38, 74, 0.35)'
      }
    }
  },
  plugins: []
}
