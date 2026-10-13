import { Pct, Ring, money } from '../utils.jsx';
import { barFill, barTrack, card, eyebrow, topRight } from '../ui.js';

export function WeekPerformance({ week }) {
  const MAX_H = 150;
  const max = Math.max(1, ...week.days.flatMap((d) => [d.profit, d.loss]));
  const h = (v) => (v ? Math.max(6, (v / max) * MAX_H) : 0);

  return (
    <section className={card}>
      <div className="flex items-start justify-between">
        <div className={eyebrow}>Trading Week Performance</div>
        <div className={topRight}>
          <span>Total this week</span>
          <b className="text-base font-semibold text-fg">{money(week.total)}</b>
        </div>
      </div>

      <div className="mt-[18px] flex h-[215px] items-end justify-around">
        {week.days.map((d) => (
          <div key={d.label} className="flex h-full w-[60px] flex-col items-center justify-end">
            <div className="flex h-[150px] items-end gap-1">
              <i
                className="block w-1.5 rounded-[3px] bg-strong transition-[height] duration-500"
                style={{ height: h(d.profit) }}
                title={`Profit ${money(d.profit)}`}
              />
              <i
                className="block w-1.5 rounded-[3px] bg-soft transition-[height] duration-500"
                style={{ height: h(d.loss) }}
                title={`Loss ${money(d.loss)}`}
              />
            </div>
            <div className="mt-2.5 text-[11.5px] font-semibold">{money(d.net)}</div>
            <div className="mt-[3px] text-[11.5px] text-muted">{d.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SessionWinRates({ sessions }) {
  return (
    <section className={card}>
      <div className={eyebrow}>Session Win Rates</div>
      <div className="mt-3.5 flex flex-col gap-3.5">
        {sessions.map((s) => (
          <div key={s.name}>
            <div className="mb-1 flex items-baseline justify-between text-[11.5px]">
              <span>{s.name}</span>
              <Pct value={s.winRate} decimals={1} className="text-[15px]" />
            </div>
            <div className={`${barTrack} h-4`}>
              <div className={barFill} style={{ width: `${s.winRate}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Profitability({ p }) {
  return (
    <section className={card}>
      <div className="flex items-start justify-between">
        <div className={eyebrow}>Profitability</div>
        <div className={topRight}>
          <span>Total Trades</span>
          <b className="text-base font-semibold text-fg">{p.total}</b>
        </div>
      </div>

      <div className="mb-2 mt-[26px] flex items-end justify-between">
        <div>
          <span className="mb-0.5 block text-[11px] text-muted">Won</span>
          <Pct value={p.won.pct} decimals={2} className="text-[30px]" />
        </div>
        <div className="text-right">
          <span className="mb-0.5 block text-[11px] text-muted">Lost</span>
          <Pct value={p.lost.pct} decimals={2} className="text-[30px]" />
        </div>
      </div>

      <div className={`${barTrack} h-2`}>
        <div className={barFill} style={{ width: `${p.won.pct}%` }} />
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-muted">
        <span>{p.won.trades} trades</span>
        <span>{p.lost.trades} trades</span>
      </div>
    </section>
  );
}

export function MostTraded({ instruments }) {
  return (
    <section className={card}>
      <div className={eyebrow}>Most Traded Instruments</div>
      <div className="mt-3.5 flex justify-around">
        {instruments.map((i) => (
          <div key={i.symbol} className="flex flex-col items-center gap-1.5">
            <Ring value={i.winRate} size={76} stroke={4}>
              <Pct value={i.winRate} decimals={2} className="text-[15px]" />
            </Ring>
            <b className="mt-1.5 text-xs">{i.symbol}</b>
            <span className="text-[11px] text-muted">{i.trades} trades</span>
          </div>
        ))}
      </div>
    </section>
  );
}
