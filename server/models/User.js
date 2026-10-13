import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    tier: { type: String, enum: ['Bronze', 'Silver', 'Gold', 'Platinum'], default: 'Bronze' },
    status: { type: String, default: 'Active Trader' },
    rewardCount: { type: Number, default: 0 },
    rewardsAmount: { type: Number, default: 0 },
    highestReward: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
