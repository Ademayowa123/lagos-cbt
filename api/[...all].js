import { handleRequest } from '../server/server.js';

/**
  * Vercel Serverless Function entry point (catch-all for /api/*)
  * Dispatches all /api/* subroutes directly to the CBT server router.
  */
export default async function handler(req, res) {
  return handleRequest(req, res);
}
