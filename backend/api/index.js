// Vercel serverless function - export the Express app
const app = require('../dist/server').default;
module.exports = app;
