import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:  '#1A3C6E',
        'primary-hover': '#2557A7',
        accent:   '#E8A020',
        bg:       '#F4F6FA',
        surface:  '#FFFFFF',
        muted:    '#6B7280',
        success:  '#16A34A',
        warning:  '#D97706',
        danger:   '#DC2626',
        border:   '#E2E8F0',
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        body:    ['Source Sans 3', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}

export default config
