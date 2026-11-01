import { handleRequest } from '../server/server.js';

/**
 * Vercel Serverless Function entry point
 * Dispatches all /api/* requests to the CBT server router.
 */
export default async function handler(req, res) {
  return handleRequest(req, res);
}
