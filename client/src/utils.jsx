// "-$96.6", "-$414", "$332", "$1,234"
export function money(n, { sign = true } = {}) {
  const abs = Math.abs(n);
  const body = abs >= 1000 ? Math.round(abs).toLocaleString('en-US') : String(Number(abs.toPrecision(3)));
  return `${n < 0 && sign ? '-' : ''}$${body}`;
}

export const moneyFixed = (n) =>
  `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Big integer part, small muted fraction: 30.77% -> "30" + ".77%"
export function Pct({ value, decimals = 1, className = 'text-xl' }) {
  const [int, frac] = Number(value).toFixed(decimals).split('.');
  return (
    <span className={`font-medium ${className}`}>
      {int}
      <small className="text-[0.6em] font-medium text-muted">{frac ? `.${frac}` : ''}%</small>
    </span>
  );
}

export function Ring({ value, size = 76, stroke = 4, children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const mid = size / 2;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="absolute inset-0" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={mid} cy={mid} r={r} fill="none" strokeWidth={stroke} className="stroke-track" />
        <circle
          cx={mid}
          cy={mid}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          className="stroke-strong"
          strokeDasharray={`${(c * Math.min(value, 100)) / 100} ${c}`}
          transform={`rotate(-90 ${mid} ${mid})`}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}
