/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette used across both portals. Keep these as the single
        // source of truth for color -- do not hardcode hex values in components.
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#4f46e5',
          600: '#4338ca',
          700: '#3730a3',
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
