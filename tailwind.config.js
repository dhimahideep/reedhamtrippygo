/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F5F5F7',
          100: '#E5E5EA',
          500: '#1D1D1F',
          600: '#000000',
          700: '#000000',
          800: '#000000',
          900: '#000000',
        },
        pdf: {
          navy: '#0A131F',
          card: '#0F1C2E',
          gold: '#E5C365',
          goldLight: '#F3E4B2',
          goldDark: '#D4AF37',
          border: 'rgba(229, 195, 101, 0.25)',
        }
      },
      fontFamily: {
        sans: ['"Inter"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"Inter"', '"Helvetica Neue"', 'Menlo', 'Monaco', 'monospace'],
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}
