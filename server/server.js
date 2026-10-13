import 'dotenv/config';
import { pathToFileURL } from 'node:url';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';

const app = express();

const allowed = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim().replace(/\/$/, ''));

// Vercel preview deployments, e.g. https://skr-5al726a8r-ram-f097.vercel.app
const previewRegex = /^https:\/\/skr-[a-z0-9-]+-ram-f097\.vercel\.app$/;

app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true); // curl, health checks
      cb(null, allowed.includes(origin) || previewRegex.test(origin));
    },
  })
);
app.use(express.json());

// Connect to MongoDB before any route runs (cached, so it only connects once)
app.use(async (_req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB connection failed:', err.message);
    res.status(500).json({ message: 'Database connection failed' });
  }
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handler must be last
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

export default app;

// Listen only when started directly (npm start / npm run dev / Render),
// not when imported by Vercel's serverless runtime.
const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
    connectDB().catch((e) => console.error('MongoDB connection failed:', e.message));
  });
}