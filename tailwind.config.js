/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { c: Object.fromEntries(['bg','card','borda','texto','sub','fraco','hover','acento','lateral'].map((k) => [k, 'rgb(var(--c-' + k + ') / <alpha-value>)'])) },
      fontFamily: { sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'], mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'], display: ['Sora', 'system-ui', 'sans-serif'], code: ['"JetBrains Mono"', 'ui-monospace', 'monospace'] },
    },
  },
  plugins: [],
}
