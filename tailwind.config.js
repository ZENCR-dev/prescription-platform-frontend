/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'medical-primary': '#2563eb',
        'medical-secondary': '#0ea5e9',
        'medical-accent': '#06b6d4',
        'medical-success': '#10b981',
        'medical-warning': '#f59e0b',
        'medical-error': '#ef4444',
        'medical-text': '#1f2937',
        'medical-text-light': '#6b7280',
        'medical-bg': '#ffffff',
        'medical-bg-alt': '#f9fafb',
      },
    },
  },
  plugins: [],
}