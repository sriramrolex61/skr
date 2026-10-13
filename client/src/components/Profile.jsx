import { moneyFixed } from '../utils.jsx';
import { card, eyebrow } from '../ui.js';

const TIER_STEPS = { Bronze: 1000, Silver: 5000, Gold: 20000, Platinum: 20000 };

export default function Profile({ profile }) {
  const initials = profile.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // ring = progress to next tier (25% base so the arc is always visible)
  const progress = 0.25 + 0.75 * Math.min(1, profile.rewardsAmount / (TIER_STEPS[profile.tier] || 1));
  const r = 36;
  const c = 2 * Math.PI * r;

  const stats = [
    ['Reward Count', profile.rewardCount],
    ['Rewards Amount', moneyFixed(profile.rewardsAmount)],
    ['Highest Reward', moneyFixed(profile.highestReward)],
  ];

  return (
    <section className={`${card} min-h-[255px] text-center`}>
      <div className={`${eyebrow} text-left`}>Profile</div>

      <div className="relative mx-auto mb-2.5 mt-3.5 h-20 w-20">
        <svg className="absolute inset-0" width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={r} fill="none" strokeWidth="3" className="stroke-track" />
          <circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            className="stroke-[#c08457]"
            strokeDasharray={`${c * progress} ${c}`}
            transform="rotate(-90 40 40)"
          />
        </svg>
        <div className="absolute inset-[7px] grid place-items-center rounded-full bg-hover text-[15px] font-semibold">
          {initials}
        </div>
        <span className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-[3px] border-[#c08457] bg-card" />
      </div>

      <div className="text-base font-medium">{profile.name}</div>
      <div className="mt-1.5 text-[11.5px] text-muted">{profile.tier} Tier</div>

      <div className="mt-6 flex justify-between px-1.5">
        {stats.map(([label, value]) => (
          <div key={label} className="flex flex-1 flex-col items-center gap-2">
            <span className="text-[11px] text-muted">{label}</span>
            <b className="text-sm font-semibold">{value}</b>
          </div>
        ))}
      </div>
    </section>
  );
}
