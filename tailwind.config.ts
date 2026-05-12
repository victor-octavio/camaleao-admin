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
        bg: '#FDF6EE',
        ink: '#1F1638',
        paper: '#FFFFFF',
        muted: '#7A6E8A',
        rule: '#EEE4D5',
        accent: {
          DEFAULT: '#E89E5C',
          deep: '#C97D3E',
          soft: '#FBE3CA',
        },
        purple: {
          DEFAULT: '#4B3A9B',
          soft: '#E2DCF3',
        },
        coral: {
          DEFAULT: '#D87560',
          soft: '#F8DCD2',
        },
        emerald: {
          DEFAULT: '#5C8A6E',
          soft: '#DCEBE0',
        },
        rainbow: {
          orange: '#F39237',
          pink: '#E25A8F',
          purple: '#6B4FB5',
          blue: '#4B8CC2',
        },
      },
      fontFamily: {
        display: ['Sora', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'Inter Tight', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
