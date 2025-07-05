New-Item -Path frontend\postcss.config.js -ItemType File -Value @"
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
"@