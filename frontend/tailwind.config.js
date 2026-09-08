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
        anti: {
          bg: '#0e0d0c',
          card: '#161514',
          'card-hover': '#1e1c1a',
          border: '#2a2724',
          'border-hover': '#3d3935',
          amber: '#f59e0b',
          'amber-glow': 'rgba(245, 158, 11, 0.15)',
          sepia: '#d6c8b4',
          muted: '#8e867d',
          darkmuted: '#4a443e',
          dead: '#242120',
          revive: '#10b981',
          danger: '#ef4444'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'Cambria', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(245, 158, 11, 0.2)',
        'tombstone': '0 10px 30px -10px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }
    },
  },
  plugins: [],
}
