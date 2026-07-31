/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#1D4ED8',
          600: '#1e40af',
          700: '#1e3a8a',
        },
        primary: {
          DEFAULT: '#1D4ED8',
        },
        status: {
          draft: '#94a3b8',
          approved: '#22c55e',
          rejected: '#ef4444',
          published: '#4f46e5',
        },
        sentiment: {
          positive: '#22c55e',
          neutral: '#94a3b8',
          negative: '#ef4444',
        },
      },
      borderRadius: {
        xl: '0.875rem',
      },
    },
  },
  plugins: [],
}
