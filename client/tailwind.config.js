/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0B1B2B',
          800: '#0F2742',
          700: '#15365A',
          600: '#1D4573'
        },
        sentinel: {
          blue: '#2563EB',
          sky: '#38BDF8',
          cyan: '#06B6D4',
          bg: '#F7F9FC',
          card: '#FFFFFF',
          border: '#E5EAF0',
          text: '#172033',
          muted: '#667085',
          success: '#16A34A',
          warning: '#D97706',
          danger: '#DC2626',
          critical: '#B91C1C'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      }
    },
  },
  plugins: [],
}
