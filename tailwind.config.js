/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    // Background orb colors and blurs (动态生成，需要safelist)
    'bg-indigo-200/40', 'bg-indigo-900/20',
    'bg-pink-200/40', 'bg-purple-900/20',
    'bg-blue-100/50', 'bg-slate-900/40',
    'bg-cyan-200/40', 'bg-cyan-900/20',
    'bg-teal-200/40', 'bg-teal-900/20',
    'bg-blue-200/50', 'bg-blue-900/30',
    'bg-sky-100/40', 'bg-sky-950/20',
    'bg-orange-200/40', 'bg-orange-900/20',
    'bg-rose-200/40', 'bg-rose-900/20',
    'bg-amber-100/50', 'bg-amber-950/25',
    'bg-emerald-200/40', 'bg-emerald-900/20',
    'bg-lime-200/40', 'bg-lime-950/20',
    'bg-green-100/50', 'bg-green-950/30',
    'bg-teal-100/40', 'bg-teal-950/20',
    'bg-pink-300/40', 'bg-pink-900/20',
    'bg-fuchsia-200/40', 'bg-fuchsia-900/20',
    'bg-purple-200/50', 'bg-purple-950/25',
    'bg-violet-200/40', 'bg-violet-900/20',
    'bg-indigo-300/40', 'bg-indigo-950/25',
    'bg-purple-100/50', 'bg-purple-950/30',
    'bg-blue-200/40', 'bg-blue-950/20',
    'blur-[100px]', 'blur-[110px]', 'blur-[115px]',
    'blur-[120px]', 'blur-[125px]', 'blur-[130px]',
    'animate-float-1', 'animate-float-2', 'animate-float-3',
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
