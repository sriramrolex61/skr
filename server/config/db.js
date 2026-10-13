import mongoose from 'mongoose';

let cached;

export default async function connectDB() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is not set');

  if (!cached) {
    cached = mongoose
      .connect(process.env.MONGO_URI)
      .then((m) => {
        console.log('MongoDB connected');
        return m;
      })
      .catch((err) => {
        cached = null; // allow a retry on the next request
        throw err;
      });
  }
  return cached;
}