/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      colors: {
        brand: {
          500: '#6d28d9',
          600: '#5b21b6'
        }
      }
    }
  },
  plugins: [],
}