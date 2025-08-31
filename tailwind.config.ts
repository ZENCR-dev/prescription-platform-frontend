import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'sage': {
          DEFAULT: '#7e998a',
          50: '#f6f7f6',
          100: '#e5ebe8',
          200: '#ccd7d1',
          300: '#b2c2b9',
          400: '#98aea2',
          500: '#7e998a',
          600: '#637e6f',
          700: '#4a5e53',
          800: '#313f37',
          900: '#191f1c'
        },
        'cambridge': {
          DEFAULT: '#7fbeab',
          50: '#f0f6f4',
          100: '#e5f2ee',
          200: '#cbe5dd',
          300: '#b2d8cd',
          400: '#98cbbc',
          500: '#7fbeab',
          600: '#55a88f',
          700: '#407e6b',
          800: '#2a5448',
          900: '#152a24'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'system-ui', 'sans-serif'],
      },
      animation: {
        'rotate-slow': 'rotate 20s linear infinite',
        'fade-in': 'fadeIn 0.3s ease-in',
      },
      keyframes: {
        rotate: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' }
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}

export default config