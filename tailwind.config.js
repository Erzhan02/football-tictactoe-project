/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        pitch: {
          900: '#0a1f0d',
          800: '#0d2910',
          700: '#112e14',
          600: '#163a19',
        },
        gold: {
          300: '#fde68a',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
      },
      animation: {
        'bounce-in': 'bounceIn 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
        'shake': 'shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
        'flash-success': 'flashSuccess 0.6s ease-out',
        'flash-error': 'flashError 0.6s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pop': 'pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'winning-glow': 'winningGlow 1s ease-in-out infinite alternate',
      },
      keyframes: {
        bounceIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '60%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-8px)' },
          '40%': { transform: 'translateX(8px)' },
          '60%': { transform: 'translateX(-4px)' },
          '80%': { transform: 'translateX(4px)' },
        },
        flashSuccess: {
          '0%': { backgroundColor: 'rgba(34, 197, 94, 0.8)' },
          '100%': { backgroundColor: 'transparent' },
        },
        flashError: {
          '0%': { backgroundColor: 'rgba(239, 68, 68, 0.8)' },
          '100%': { backgroundColor: 'transparent' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        winningGlow: {
          '0%': { boxShadow: '0 0 10px rgba(251, 191, 36, 0.5)' },
          '100%': { boxShadow: '0 0 30px rgba(251, 191, 36, 0.9), 0 0 60px rgba(251, 191, 36, 0.4)' },
        },
      },
    },
  },
  plugins: [],
}
