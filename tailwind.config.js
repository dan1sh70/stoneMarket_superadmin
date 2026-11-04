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
          900: '#102B4C',
          800: '#14345D',
          700: '#1D457B',
        },
        primary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          light: '#EFF6FF',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          bg: '#F3F6FB',
          border: '#E1E8F0',
        },
        text: {
          primary: '#14243A',
          secondary: '#718096',
          muted: '#94A3B8',
        },
        status: {
          success: '#16A36A',
          'success-bg': '#E6F8EF',
          warning: '#F59E0B',
          'warning-bg': '#FEF3C7',
          danger: '#DC3545',
          'danger-bg': '#FDF2F2',
          info: '#2563EB',
          'info-bg': '#EFF6FF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
        dropdown: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
