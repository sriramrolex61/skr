import mongoose from 'mongoose';

const tradeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  symbol: { type: String, required: true, uppercase: true },
  side: { type: String, enum: ['buy', 'sell'], required: true },
  pnl: { type: Number, required: true },
  hasStopLoss: { type: Boolean, default: true },
  riskReward: { type: Number, default: 0 },
  openedAt: { type: Date, required: true },
  closedAt: { type: Date, required: true, index: true },
});

export default mongoose.model('Trade', tradeSchema);
