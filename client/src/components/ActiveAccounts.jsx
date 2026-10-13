import { ArrowRight } from 'lucide-react';
import { moneyFixed } from '../utils.jsx';
import { btnPrimary, card, eyebrow } from '../ui.js';

export default function ActiveAccounts({ accounts }) {
  if (!accounts.length) {
    return (
      <section className={`${card} px-4 py-9 text-center`}>
        <h4 className="text-[13.5px] font-semibold">Your funded account awaits</h4>
        <p className="mb-3.5 mt-1.5 text-xs text-muted">
          Complete a challenge and trade with up to $200k in capital
        </p>
        <button className={btnPrimary}>
          Start a challenge <ArrowRight size={13} />
        </button>
      </section>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
      {accounts.map((a) => {
        const change = a.balance - a.startBalance;
        return (
          <section className={card} key={a.id}>
            <div className={eyebrow}>
              {a.label} · {a.status}
            </div>
            <div className="mt-2.5 text-[22px] font-semibold">{moneyFixed(a.balance)}</div>
            <div className={`mt-1.5 text-xs ${change >= 0 ? 'text-ok' : 'text-red-400'}`}>
              {change >= 0 ? '+' : '-'}
              {moneyFixed(Math.abs(change))} from {moneyFixed(a.startBalance)}
            </div>
          </section>
        );
      })}
    </div>
  );
}
