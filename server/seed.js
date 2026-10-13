// Demo data that mirrors the numbers in the reference dashboard.
//   npm run seed            -> user with 130 trades, no active account (score index 0.00)
//   npm run seed:account    -> same, plus one active challenge account
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import User from './models/User.js';
import Account from './models/Account.js';
import Trade from './models/Trade.js';

const rand = (a, b) => Math.random() * (b - a) + a;
const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

await connectDB();

await User.deleteOne({ email: 'demo@fundingpips.dev' });
const user = await User.create({
  name: 'srikanth r',
  email: 'demo@fundingpips.dev',
  password: await bcrypt.hash('demo1234', 10),
});
await Trade.deleteMany({ user: user._id });
await Account.deleteMany({ user: user._id });

let account = null;
if (process.argv.includes('--account')) {
  account = await Account.create({ user: user._id, label: 'Phase 1', startBalance: 100000, balance: 99628 });
}

// 130 trades: 40 won / 90 lost.  EURUSD 59 (18 won), AUDUSD 51 (20 won), GBPUSD 10 (2 won)
const mk = (symbol, w, l) => [
  ...Array.from({ length: w }, () => ({ symbol, win: true })),
  ...Array.from({ length: l }, () => ({ symbol, win: false })),
];
const specs = shuffle([...mk('EURUSD', 18, 41), ...mk('AUDUSD', 20, 31), ...mk('GBPUSD', 2, 8)]);
const wins = specs.filter((s) => s.win);
const losses = specs.filter((s) => !s.win);

// Current trading week (Mon-Fri): 5 wins + 5 losses with fixed gross profit / loss per day
const weekPlan = [
  { profit: 120, loss: 216.6 }, // Mon  net -96.6
  { profit: 80, loss: 494 },    // Tue  net -414
  { profit: 130, loss: 235 },   // Wed  net -105
  { profit: 450, loss: 118 },   // Thu  net +332
  { profit: 110, loss: 197.9 }, // Fri  net -87.9
];
const weekWins = wins.splice(0, 5);
const weekLosses = losses.splice(0, 5);

const now = new Date();
const monday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
monday.setUTCDate(monday.getUTCDate() - ((monday.getUTCDay() + 6) % 7));

const docs = [];
const at = (base, dayOffset, hour) => {
  const d = new Date(base);
  d.setUTCDate(d.getUTCDate() + dayOffset);
  d.setUTCHours(hour, Math.floor(rand(0, 59)), 0, 0);
  return d;
};

weekPlan.forEach((day, i) => {
  docs.push({ symbol: weekWins[i].symbol, pnl: day.profit, closedAt: at(monday, i, 10) });
  docs.push({ symbol: weekLosses[i].symbol, pnl: -day.loss, closedAt: at(monday, i, 15) });
});

// Older trades spread over the 4 weeks before this one
shuffle([...wins, ...losses]).forEach((s) => {
  docs.push({
    symbol: s.symbol,
    pnl: s.win ? round2(rand(20, 150)) : -round2(rand(15, 120)),
    closedAt: at(monday, -Math.floor(rand(1, 28)), Math.floor(rand(0, 24))),
  });
});

function round2(n) {
  return Math.round(n * 100) / 100;
}

shuffle(docs);
const trades = docs.map((t, i) => ({
  ...t,
  user: user._id,
  account: account?._id,
  side: i < 67 ? 'buy' : 'sell', // 67 long / 63 short -> 52% / 48%
  hasStopLoss: Math.random() > 0.2,
  riskReward: round2(rand(0.8, 3)),
  openedAt: new Date(t.closedAt.getTime() - rand(5, 120) * 60000),
}));

await Trade.insertMany(trades);
console.log(`Seeded ${trades.length} trades. Login: demo@fundingpips.dev / demo1234`);
await mongoose.disconnect();
