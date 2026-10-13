import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API running on port ${PORT}`);
  connectDB().catch((e) => console.error('MongoDB connection failed:', e.message));
});