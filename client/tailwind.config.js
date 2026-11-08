/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        learnos: {
          bg: '#0B0D12',
          card: '#151923',
          cardHover: '#1C2230',
          border: '#232936',
          accent: '#6366F1',
          accentHover: '#4F46E5',
          accentLight: '#818CF8',
          textMain: '#F8FAFC',
          textMuted: '#94A3B8',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          cyan: '#06B6D4'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
