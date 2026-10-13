/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: token('bg'),
        card: token('card'),
        line: token('line'),
        fg: token('fg'),
        muted: token('muted'),
        faint: token('faint'),
        track: token('track'),
        strong: token('strong'),
        soft: token('soft'),
        btn: token('btn'),
        hover: token('hover'),
        ok: token('ok'),
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Bebas Neue"', 'Impact', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
