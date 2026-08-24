/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        steel: {
          50: '#f8f9fa',
          100: '#f1f3f5',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#868e96',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
        },
        brand: {
          primary: '#0ea5e9', // Cyber Blue
          secondary: '#10b981', // Emerald Green
          danger: '#ef4444', // Red
          warning: '#f59e0b', // Amber
          info: '#06b6d4', // Cyan
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-hover': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'neon-blue': '0 0 10px rgba(14, 165, 233, 0.5), 0 0 20px rgba(14, 165, 233, 0.3)',
        'neon-red': '0 0 10px rgba(239, 68, 68, 0.5), 0 0 20px rgba(239, 68, 68, 0.3)',
        'neon-green': '0 0 10px rgba(16, 185, 129, 0.5), 0 0 20px rgba(16, 185, 129, 0.3)',
        'neon-amber': '0 0 10px rgba(245, 158, 11, 0.5), 0 0 20px rgba(245, 158, 11, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flow': 'flow 2s linear infinite',
        'warning-flash': 'warning-flash 1s ease-in-out infinite alternate',
      },
      keyframes: {
        flow: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'warning-flash': {
          '0%': { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' },
          '100%': { backgroundColor: 'rgba(239, 68, 68, 0.3)', borderColor: 'rgba(239, 68, 68, 0.8)' },
        }
      }
    },
  },
  plugins: [],
}
