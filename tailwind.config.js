/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vp-bg': '#0B132B',
        'vp-card': 'rgba(255,255,255,0.04)',
        'vp-border': 'rgba(255,255,255,0.08)',
        'vp-cyan': '#6ECCDB',
        'vp-amber': '#FFB84C',
        'vp-red': '#FF4C4C',
        'vp-muted': '#A0AABF',
      },
      fontFamily: {
        inter: ['Inter', 'system-ui', 'sans-serif'],
        cairo: ['Cairo', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        glass: '20px',
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(110,204,219,0.25)',
        'glow-amber': '0 0 20px rgba(255,184,76,0.25)',
        'glow-red': '0 0 20px rgba(255,76,76,0.25)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out forwards',
      }
    },
  },
  plugins: [],
}

