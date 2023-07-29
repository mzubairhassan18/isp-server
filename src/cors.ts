import cors from 'cors';
import { RequestHandler } from 'express';

// Define a list of allowed origins for CORS
const allowedOrigins = ['http://localhost:3002', 'https://yourfrontendapp.com'];

// CORS middleware
export const corsMiddleware: RequestHandler = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin as string) || !origin) {
    // Allow the request since it's from an allowed origin or it's not a cross-origin request
    res.setHeader('Access-Control-Allow-Origin', origin as string);
  } else {
    // Block the request if it's from an unallowed origin
    res.status(403).json({ error: 'Not allowed by CORS' });
    return;
  }

  // Set other CORS headers
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Continue to the next middleware
  next();
};
