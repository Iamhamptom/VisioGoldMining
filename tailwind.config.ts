import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        gold: {
          '50': '#FDF8E8',
          '100': '#F9EDCC',
          '200': '#F3DCA0',
          '300': '#ECCC74',
          '400': '#D4AF37',
          '500': '#B8960E',
          '600': '#967A0B',
          '700': '#745E09',
          '800': '#524306',
          '900': '#302703',
        },
        emerald: '#10B981',
        ruby: '#EF4444',
        sapphire: '#3B82F6',
        amber: '#F59E0B',
        'bg-dark': '#030712',
        'bg-surface': '#0a0f1a',
        'bg-elevated': '#111827',
        'bg-panel': 'rgba(10, 15, 26, 0.6)',
        'border-panel': 'rgba(255, 255, 255, 0.08)',
        'text-main': '#FFFFFF',
        'text-muted-explorer': '#888888',
      },
      boxShadow: {
        'gold-sm': '0 2px 8px rgba(212,175,55,0.15)',
        'gold-md': '0 4px 16px rgba(212,175,55,0.25)',
        'gold-lg': '0 8px 32px rgba(212,175,55,0.35)',
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      fontFamily: {
        sans: ['Rajdhani', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Orbitron', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
