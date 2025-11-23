/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-outfit)', 'var(--font-inter)', 'sans-serif'],
        display: ['var(--font-outfit)', 'sans-serif'],
      },
      colors: {
        glass: 'rgba(255, 255, 255, 0.65)',
        glassBorder: 'rgba(255, 255, 255, 0.4)',
        primary: '#6366f1', // Indigo 500
        secondary: '#ec4899', // Pink 500
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-hover': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        soft: '0 20px 40px -10px rgba(0,0,0,0.05)',
        input: '0 0 20px -2px rgba(0,0,0,0.06)',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'float-1': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(30px, -30px) scale(1.05)' },
        },
        'float-2': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(-20px, 20px) scale(0.95)' },
        },
        'float-3': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(15px, 15px) scale(1.02)' },
        },
      },
      animation: {
        'cursor-blink': 'blink 1.1s step-end infinite',
        'float-1': 'float-1 20s ease-in-out infinite',
        'float-2': 'float-2 25s ease-in-out infinite',
        'float-3': 'float-3 22s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
