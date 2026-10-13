import { barFill, barTrack } from '../ui.js';

export default function BehavioralBias({ bias }) {
  const image = bias.longPct >= bias.shortPct ? '/bull.jpg' : '/bear.jpg';

  return (
    <section className="relative h-[250px] overflow-hidden rounded-xl border border-line bg-card">
      {/* artwork (falls back to gradient if the image is missing) */}
      <div
        className="absolute inset-y-0 left-0 w-3/5 bg-cover bg-center opacity-80 dark:opacity-100"
        style={{ backgroundImage: `url(${image}), linear-gradient(135deg,#1b2147,#07080f)` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent from-45% to-card" />

      <div className="absolute inset-y-0 left-1/2 right-6 flex flex-col justify-center">
        <div className="mb-[18px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display text-[62px] leading-none tracking-wide">{bias.longPct}%</span>
            <span className="text-[11.5px] leading-snug">
              Bull
              <br />
              Long Bias
            </span>
          </div>

          <span className="text-[26px] text-faint">/</span>

          <div className="flex items-center gap-3 opacity-20">
            <span className="text-right text-[11.5px] leading-snug">
              Bear
              <br />
              Short Bias
            </span>
            <span className="font-display text-[62px] leading-none tracking-wide">{bias.shortPct}%</span>
          </div>
        </div>

        <div className={`${barTrack} h-2`}>
          <div className={barFill} style={{ width: `${bias.longPct}%` }} />
        </div>
        <div className="mt-3 flex justify-between text-[11.5px]">
          <span>{bias.longs}</span>
          <span>{bias.shorts}</span>
        </div>
      </div>
    </section>
  );
}
