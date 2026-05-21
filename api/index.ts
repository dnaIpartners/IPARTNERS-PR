import express from 'express';
import apiRouter from '../src/api';

const app = express();

// Mount the router at /api so it matches the expected paths when hosted on Vercel
// Vercel routes requests to /api/* to this file if configured in vercel.json
app.use('/api', apiRouter);

export default app;
