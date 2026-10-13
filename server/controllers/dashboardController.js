import User from '../models/User.js';
import Account from '../models/Account.js';
import Trade from '../models/Trade.js';

const round = (n, d = 2) => Number((n || 0).toFixed(d));
const pct = (a, b, d = 2) => (b ? round((a / b) * 100, d) : 0);
const clamp = (n, min = 0, max = 100) => Math.min(max, Math.max(min, n));

// Session windows in UTC hours: Asia 22-08, London 08-13, New York 13-22
export const sessionOf = (date) => {
  const h = new Date(date).getUTCHours();
  if (h >= 13 && h < 22) return 'New York';
  if (h >= 8 && h < 13) return 'London';
  return 'Asia';
};

// Monday 00:00 UTC of the current week
const weekStartUTC = (now = new Date()) => {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d;
};

function buildScore(trades, accounts) {
  const metrics = { consistency: 0, calmar: 0, trades: 0, slUsage: 0, wr: 0, rr: 0, dailyReturn: 0 };
  // Score index only counts once the trader has an active account
  if (!accounts.length || !trades.length) return { index: 0, metrics };

  const startBalance = accounts.reduce((s, a) => s + a.startBalance, 0) || 1;
  const byDay = new Map();
  let equity = 0;
  let peak = 0;
  let maxDD = 0;

  for (const t of trades) {
    const key = new Date(t.closedAt).toISOString().slice(0, 10);
    byDay.set(key, (byDay.get(key) || 0) + t.pnl);
    equity += t.pnl;
    peak = Math.max(peak, equity);
    maxDD = Math.max(maxDD, peak - equity);
  }

  const days = [...byDay.values()];
  const profitableDays = days.filter((d) => d > 0).length;
  const avgDaily = days.reduce((s, d) => s + d, 0) / (days.length || 1);
  const rrValues = trades.map((t) => t.riskReward).filter((v) => v > 0);
  const avgRR = rrValues.reduce((s, v) => s + v, 0) / (rrValues.length || 1);
  const calmar = maxDD ? equity / maxDD : equity > 0 ? 3 : 0;

  metrics.consistency = clamp((profitableDays / (days.length || 1)) * 100);
  metrics.calmar = clamp((calmar / 3) * 100);
  metrics.trades = clamp((trades.length / 100) * 100);
  metrics.slUsage = clamp((trades.filter((t) => t.hasStopLoss).length / trades.length) * 100);
  metrics.wr = clamp((trades.filter((t) => t.pnl > 0).length / trades.length) * 100);
  metrics.rr = clamp((avgRR / 3) * 100);
  metrics.dailyReturn = clamp(((avgDaily / startBalance) * 100) * 100); // +1%/day = 100

  Object.keys(metrics).forEach((k) => (metrics[k] = round(metrics[k], 1)));
  const index = round(Object.values(metrics).reduce((s, v) => s + v, 0) / 7);
  return { index, metrics };
}

export async function getDashboard(req, res) {
  const userId = req.user._id;

  const [user, accounts, trades] = await Promise.all([
    User.findById(userId).select('-password').lean(),
    Account.find({ user: userId, status: { $in: ['challenge', 'funded'] } }).sort({ createdAt: -1 }).lean(),
    Trade.find({ user: userId }).sort({ closedAt: 1 }).lean(),
  ]);

  const total = trades.length;
  const wonCount = trades.filter((t) => t.pnl > 0).length;
  const lostCount = total - wonCount;

  // Behavioral bias
  const longs = trades.filter((t) => t.side === 'buy').length;
  const shorts = total - longs;
  const longPct = total ? Math.round((longs / total) * 100) : 0;
  const bias = { longPct, shortPct: total ? 100 - longPct : 0, longs, shorts };

  // Trading week performance (Mon-Fri). Dark bar = gross profit, light bar = gross loss.
  const start = weekStartUTC();
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 7);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((label) => ({ label, profit: 0, loss: 0 }));
  for (const t of trades) {
    const c = new Date(t.closedAt);
    if (c < start || c >= end) continue;
    const idx = (c.getUTCDay() + 6) % 7;
    if (idx > 4) continue;
    if (t.pnl > 0) days[idx].profit += t.pnl;
    else days[idx].loss += Math.abs(t.pnl);
  }
  const weekDays = days.map((d) => ({
    label: d.label,
    profit: round(d.profit),
    loss: round(d.loss),
    net: round(d.profit - d.loss),
  }));
  const weekTotal = round(weekDays.reduce((s, d) => s + d.net, 0));

  // Session win rates
  const sessions = ['New York', 'London', 'Asia'].map((name) => {
    const list = trades.filter((t) => sessionOf(t.closedAt) === name);
    return { name, trades: list.length, winRate: pct(list.filter((t) => t.pnl > 0).length, list.length, 1) };
  });

  // Most traded instruments (ring = win rate on that instrument)
  const bySymbol = new Map();
  for (const t of trades) {
    const s = bySymbol.get(t.symbol) || { symbol: t.symbol, trades: 0, wins: 0 };
    s.trades += 1;
    if (t.pnl > 0) s.wins += 1;
    bySymbol.set(t.symbol, s);
  }
  const instruments = [...bySymbol.values()]
    .sort((a, b) => b.trades - a.trades)
    .slice(0, 3)
    .map((s) => ({ symbol: s.symbol, trades: s.trades, winRate: pct(s.wins, s.trades) }));

  res.json({
    profile: {
      name: user.name,
      tier: user.tier,
      status: user.status,
      rewardCount: user.rewardCount,
      rewardsAmount: user.rewardsAmount,
      highestReward: user.highestReward,
    },
    score: buildScore(trades, accounts),
    accounts: accounts.map((a) => ({
      id: a._id,
      label: a.label,
      status: a.status,
      startBalance: a.startBalance,
      balance: a.balance,
    })),
    bias,
    week: { days: weekDays, total: weekTotal },
    sessions,
    profitability: {
      total,
      won: { trades: wonCount, pct: pct(wonCount, total) },
      lost: { trades: lostCount, pct: pct(lostCount, total) },
    },
    instruments,
  });
}
