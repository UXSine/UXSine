/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sky: '#6D9599',
        sage: '#7F7948',
        sandstone: '#F7B85D',
        canyon: '#E47F4D',
        crimson: '#B2442C',
        cream: '#FDF8F2',
        bark: '#1C1209',
        muted: '#8A7A6E',
        border: '#EDE0CC',
        card: '#FFFFFF',
      },
      fontFamily: {
        display: ['Ubuntu', 'sans-serif'],
        body: ['Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 6px rgba(28,18,9,0.07)',
      },
      borderRadius: {
        card: '10px',
      },
    },
  },
  plugins: [],
}
