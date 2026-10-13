
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';

const app = express();

const allowedOrigins = [
  'https://skr-eight.vercel.app',
  'http://localhost:5173',
  ...(process.env.CLIENT_URL || '')
    .split(',')
    .map((url) => url.trim().replace(/\/+$/, ''))
    .filter(Boolean),
];

const corsOptions = {
  origin(origin, callback) {
    // Allow requests without an Origin header.
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = origin.replace(/\/+$/, '');

    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    // Allow Vercel preview deployments for this project only.
    const previewRegex =
      /^https:\/\/skr-[a-z0-9-]+-ram-f09[0-9]\.vercel\.app$/i;

    if (previewRegex.test(normalizedOrigin)) {
      return callback(null, true);
    }

    console.warn('CORS blocked origin:', origin);
    return callback(null, false);
  },

  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());



app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Global error handler.
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

export default app;
