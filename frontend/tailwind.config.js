module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
    './src/**/*.css'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB', // Blue for buttons and accents
        secondary: '#10B981', // Green for prediction output
      },
    },
  },
  plugins: [],
};