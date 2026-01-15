/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary Colors (from existing Humanize design)
        primary: {
          DEFAULT: '#24598c',
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc8fb',
          400: '#36abf6',
          500: '#0c8fe7',
          600: '#0072c5',
          700: '#24598c',
          800: '#1e4a73',
          900: '#1e3f60',
          950: '#152841',
        },
        // Secondary / Accent
        accent: {
          DEFAULT: '#92bbd1',
          light: '#c4dcec',
          dark: '#5a9aba',
        },
        // Background colors
        surface: {
          light: '#ffffff',
          DEFAULT: '#eaebeb',
          dark: '#0d2229',
        },
        // Text colors
        content: {
          DEFAULT: '#0d2229',
          muted: '#5a6c75',
          inverse: '#ffffff',
        },
        // Status colors
        success: {
          DEFAULT: '#0fae4e',
          light: '#e6f7ec',
          dark: '#0a7d38',
        },
        danger: {
          DEFAULT: '#e63f4f',
          light: '#fdedef',
          dark: '#b8303d',
        },
        warning: {
          DEFAULT: '#fba209',
          light: '#fff7e6',
          dark: '#c98107',
        },
        // Dark mode specific
        dark: {
          bg: '#0d2229',
          card: '#13333d',
          border: '#24598c',
          text: '#ffffff',
          muted: '#8ba5b3',
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'IBM Plex Sans Arabic', 'system-ui', 'sans-serif'],
        display: ['DM Sans', 'IBM Plex Sans Arabic', 'system-ui', 'sans-serif'],
        arabic: ['IBM Plex Sans Arabic', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '12px',
        'button': '8px',
        'input': '8px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'modal': '0 8px 32px rgba(0, 0, 0, 0.16)',
      },
      spacing: {
        '4.5': '1.125rem',
        '13': '3.25rem',
        '15': '3.75rem',
        '18': '4.5rem',
        '22': '5.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-rtl'),
  ],
}
