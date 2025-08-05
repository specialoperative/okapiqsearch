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
        // Ultra-Minimal Okapi Brown Palette - Pally Style
        'okapi-rich-brown': '#A0522D',
        'okapi-dark-brown': '#4A2C17',
        'okapi-light-brown': '#DEB887',
        'okapi-cream': '#F5E6D3',
        'okapi-black': '#2E1A0E',
        'okapi-white': '#FFF8F0',
        
        // Single Accent Color
        'accent-green': '#00FF88',
        
        // Animal Pattern Colors
        'leopard-gold': '#CD853F',
        'leopard-dark': '#8B4513',
        'leopard-cream': '#F5DEB3',
        
        // Core System Colors
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        chart: {
          '1': 'var(--chart-1)',
          '2': 'var(--chart-2)',
          '3': 'var(--chart-3)',
          '4': 'var(--chart-4)',
          '5': 'var(--chart-5)',
        },
        sidebar: {
          DEFAULT: 'var(--sidebar)',
          foreground: 'var(--sidebar-foreground)',
          primary: 'var(--sidebar-primary)',
          'primary-foreground': 'var(--sidebar-primary-foreground)',
          accent: 'var(--sidebar-accent)',
          'accent-foreground': 'var(--sidebar-accent-foreground)',
          border: 'var(--sidebar-border)',
          ring: 'var(--sidebar-ring)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
      },
      animation: {
        'pally-flow': 'pally-flow 180s infinite ease-in-out',
        'pally-atmosphere': 'pally-atmosphere 120s infinite ease-in-out',
        'pally-particle-drift': 'pally-particle-drift 200s infinite ease-in-out',
        'pally-organic-morph': 'pally-organic-morph 120s infinite ease-in-out',
        'pally-subtle-float': 'pally-subtle-float 80s infinite ease-in-out',
        'pally-gradient-shift': 'pally-gradient-shift 8s ease infinite',
        'pally-divider-flow': 'pally-divider-flow 10s infinite ease-in-out',
        'pally-shimmer-loading': 'pally-shimmer-loading 2s infinite ease-in-out',
        'pally-floating': 'pally-floating 12s ease-in-out infinite',
      },
      transitionTimingFunction: {
        'pally': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
} 