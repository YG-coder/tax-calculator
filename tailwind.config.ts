// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      container: { center: true, padding: '1rem' },
      colors: {
        surface: { DEFAULT: '#f8fafc', card: '#ffffff', muted: '#f1f5f9' },
      },
    },
  },
  plugins: [],
}

export default config
