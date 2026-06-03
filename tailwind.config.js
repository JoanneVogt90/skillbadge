/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0052ff',
        ink: '#221713',
        cream: '#fff8ec',
        honey: '#f6b343',
        ember: '#df6f3f',
      },
      boxShadow: {
        soft: '0 18px 50px rgba(93, 52, 25, 0.12)',
      },
    },
  },
  plugins: [],
};
