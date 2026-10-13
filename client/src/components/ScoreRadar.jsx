import { card, eyebrow } from '../ui.js';

const AXES = [
  ['consistency', 'Consistency'],
  ['calmar', 'Calmar Ratio'],
  ['trades', 'Trades'],
  ['slUsage', 'SL usage'],
  ['wr', 'WR'],
  ['rr', 'RR'],
  ['dailyReturn', 'Daily Return'],
];

const CX = 200;
const CY = 140;
const R = 85;
const N = AXES.length;
const angle = (i) => -Math.PI / 2 + (i * 2 * Math.PI) / N;

const point = (i, ratio) => [CX + Math.cos(angle(i)) * R * ratio, CY + Math.sin(angle(i)) * R * ratio];
const polygon = (ratioFor) =>
  Array.from({ length: N }, (_, i) => point(i, ratioFor(i)).join(',')).join(' ');

export default function ScoreRadar({ score }) {
  const values = AXES.map(([key]) => (score.metrics[key] || 0) / 100);

  return (
    <section className={card}>
      <div className={eyebrow}>Score Index</div>
      <div className="mt-1.5 text-[26px] font-semibold">
        <span className={score.index === 0 ? 'text-faint' : ''}>{score.index.toFixed(2)}</span>
        <small className="text-[11px] font-normal text-muted"> / 100</small>
      </div>

      <svg className="mx-auto block max-h-[270px] w-full" viewBox="0 0 400 280">
        {[0.25, 0.5, 0.75, 1].map((lvl) => (
          <polygon key={lvl} points={polygon(() => lvl)} className="fill-none stroke-faint/40" />
        ))}
        {AXES.map((_, i) => {
          const [x, y] = point(i, 1);
          return <line key={i} x1={CX} y1={CY} x2={x} y2={y} className="stroke-faint/40" />;
        })}
        <polygon points={polygon((i) => values[i])} className="fill-strong/20 stroke-strong" strokeWidth="1.5" />
        <circle cx={CX} cy={CY} r="3" className="fill-strong" />

        {AXES.map(([, label], i) => {
          const [x, y] = point(i, 1.3);
          const cos = Math.cos(angle(i));
          const anchor = cos > 0.3 ? 'start' : cos < -0.3 ? 'end' : 'middle';
          return (
            <text key={label} x={x} y={y + 4} textAnchor={anchor} className="fill-fg text-[11.5px]">
              {label}
            </text>
          );
        })}
      </svg>
    </section>
  );
}
