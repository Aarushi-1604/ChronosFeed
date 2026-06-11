import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import worldRoutes from './routes/worlds';
import personaRoutes from './routes/personas';
import postRoutes from './routes/posts';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'chronosfeed-backend',
  });
});

// API routes
app.use('/api/worlds', worldRoutes);
app.use('/api/personas', personaRoutes);
app.use('/api/posts', postRoutes);

// 404 fallback
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler — must be last
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`ChronosFeed backend running on http://localhost:${PORT}`);
  console.log(`Supabase URL: ${process.env.SUPABASE_URL}`);
});

export default app;