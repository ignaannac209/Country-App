const apiKey = process.env.RESTCOUNTRIES_API_KEY;

if (!apiKey) {
  throw new Error('RESTCOUNTRIES_API_KEY must be set in .env to use the local API proxy.');
}

module.exports = {
  '/api/**': {
    target: 'https://api.restcountries.com',
    secure: true,
    changeOrigin: true,
    pathRewrite: {
      '^/api': '',
    },
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Origin: '',
    },
  },
};
