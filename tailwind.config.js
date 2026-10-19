/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './privacy_policy/index.html', './404.html'],
  theme: {
    extend: {
      colors: {
        paper: '#f0ece4',
        'paper-shade': '#e6e0d4',
        charcoal: '#2c2825',
        'charcoal-mid': '#4a4540',
        'charcoal-dim': '#655e56',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
      },
    },
  },
};
