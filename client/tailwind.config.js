/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A0A0A',
        surface: '#141414',
        'surface-card': '#191919',
        border: '#2A2A2A',
        'border-light': '#383838',
        'brand-red': '#E50914',
        'brand-red-hover': '#FF1F2D',
        'brand-gold': '#B48A3C',
        'brand-muted': '#B5B5B5',
      },
      fontFamily: {
        oswald: ['Oswald', 'sans-serif'],
        raleway: ['Raleway', 'sans-serif'],
        khand: ['Khand', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        urdu: ['"Noto Nastaliq Urdu"', '"Noto Naskh Arabic"', 'serif'],
        arabic: ['"Noto Naskh Arabic"', 'sans-serif'],
      },
      letterSpacing: {
        cinematic: '0.25em',
        widest: '0.2em',
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
