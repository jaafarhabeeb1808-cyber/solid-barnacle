/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './js/**/*.js'],
  theme: {
    extend: {
      colors: {
        night: {
          950: '#0a0307',
          900: '#120608',
          800: '#1b090c',
        },
        burgundy: {
          950: '#2b0a12',
          900: '#3d0f1a',
          800: '#5c1023',
          700: '#7a1530',
          600: '#9c1c3c',
        },
        gold: {
          200: '#EAE4D8',
          300: '#DDD5C4',
          400: '#CEC5B0',
          500: '#BEB49E',
          600: '#A09082',
          700: '#857870',
        },
        cream: '#f6efe2',
      },
      fontFamily: {
        display: ['Italiana', 'serif'],
        body: ['Cormorant Garamond', 'serif'],
        sans: ['Karla', 'sans-serif'],
        arDisplay: ['Aref Ruqaa', 'serif'],
        arBody: ['Noto Naskh Arabic', 'serif'],
        arSans: ['Noto Sans Arabic', 'sans-serif'],
      },
      backgroundImage: {
        'radial-fade': 'radial-gradient(ellipse at center, rgba(190,180,158,0.12) 0%, rgba(10,3,7,0) 70%)',
        'burgundy-gradient': 'linear-gradient(180deg, #120608 0%, #2b0a12 45%, #1b090c 100%)',
      },
      boxShadow: {
        gold: '0 0 24px rgba(190,180,158,0.35)',
        'gold-sm': '0 0 12px rgba(190,180,158,0.25)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: 0, transform: 'translateY(28px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'scale-in': {
          '0%': { opacity: 0, transform: 'scale(0.85)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        drift: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(12px, -10px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.9s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in': 'fade-in 1.2s ease-out forwards',
        'scale-in': 'scale-in 0.8s cubic-bezier(0.16,1,0.3,1) forwards',
        shimmer: 'shimmer 3s linear infinite',
        drift: 'drift 8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
