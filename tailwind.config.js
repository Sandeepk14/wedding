/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        burgundy: '#570019',
        maroon: '#35000F',
        gold: '#D4AF37',
        champagne: '#E8D5A3',
        ivory: '#FFF4E3',
        cream: '#F8EBDD',
        night: '#19050D',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        royal: ['Cinzel', 'Georgia', 'serif'],
        script: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['Poppins', 'system-ui', 'sans-serif'],
        deva: ['"Noto Sans Devanagari"', 'sans-serif'],
      },
      boxShadow: {
        gold: '0 0 0 1px rgba(212,175,55,.55), 0 10px 40px -10px rgba(212,175,55,.35)',
        card: '0 18px 50px -18px rgba(53,0,15,.55)',
      },
    },
  },
  plugins: [],
}
