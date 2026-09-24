/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kamao: {
          50: '#FDFBF7',
          100: '#F8F3EA',
          200: '#EFE5D5',
          300: '#E2CEB4',
          400: '#CFAC88',
          500: '#BA895F',
          600: '#A36F49',
          700: '#855639',
          800: '#6C4531',
          900: '#583A2A',
        },
        terracotta: {
          50: '#FDF6F2',
          100: '#FAEAE2',
          200: '#F5D3C2',
          300: '#EDB49A',
          400: '#E38B6B',
          500: '#D9531E', // Signature Accent
          600: '#C23D10',
          700: '#9E2E0B',
          800: '#7E260D',
          900: '#67220F',
        },
        sand: {
          50: '#FBF9F5',
          100: '#F5F0E6',
          200: '#E9E0D0',
          300: '#DACBB4',
          400: '#C8B095',
        },
        warmbg: '#FAF7F2',
        warmcard: '#FFFFFF',
        warmborder: '#E8DFD3',
        warmtext: '#1C1917',
        warmmuted: '#6B625B',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'warm-sm': '0 1px 3px rgba(120, 90, 60, 0.06), 0 1px 2px rgba(120, 90, 60, 0.04)',
        'warm-md': '0 4px 14px rgba(120, 90, 60, 0.08), 0 2px 6px rgba(120, 90, 60, 0.04)',
        'warm-lg': '0 10px 25px -3px rgba(120, 90, 60, 0.1), 0 4px 10px -2px rgba(120, 90, 60, 0.05)',
        'warm-xl': '0 20px 35px -5px rgba(120, 90, 60, 0.12), 0 8px 16px -4px rgba(120, 90, 60, 0.06)',
      }
    },
  },
  plugins: [],
}
