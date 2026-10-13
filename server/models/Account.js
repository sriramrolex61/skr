import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    label: { type: String, default: 'Challenge' },
    status: { type: String, enum: ['challenge', 'funded', 'failed', 'passed'], default: 'challenge' },
    startBalance: { type: Number, required: true },
    balance: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Account', accountSchema);
