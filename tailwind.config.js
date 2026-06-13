/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        warning: '#eab308',
        danger: '#ef4444',
      },
      fontSize: {
        '2xl': ['1.5rem', { lineHeight: '1.3' }],
        '3xl': ['1.75rem', { lineHeight: '1.3' }],
        '4xl': ['2rem', { lineHeight: '1.2' }],
      },
    },
  },
  plugins: [],
}
