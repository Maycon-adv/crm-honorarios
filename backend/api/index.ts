// Handler for Vercel serverless function
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Import the Express app
const app = require('../src/server').default;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res);
}
