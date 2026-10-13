import { useState } from 'react';
import { api } from '../api.js';
import { btnPrimary, card, eyebrow } from '../ui.js';

const input =
  'h-[38px] rounded-md border border-line bg-bg px-3 text-[13px] text-fg outline-none focus:border-strong';

export default function Login({ onSuccess }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async () => {
    setBusy(true);
    setError('');
    try {
      const res = mode === 'login' ? await api.login(form) : await api.register(form);
      onSuccess(res.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-bg p-5">
      <div className={`${card} flex w-[340px] flex-col gap-3 p-6`}>
        <div className={eyebrow}>Trader Desk</div>
        <h2 className="text-lg font-semibold text-fg">{mode === 'login' ? 'Sign in' : 'Create account'}</h2>
        {mode === 'register' && (
          <input className={input} placeholder="Full name" value={form.name} onChange={set('name')} />
        )}
        <input className={input} placeholder="Email" type="email" value={form.email} onChange={set('email')} />
        <input
          className={input}
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={set('password')}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />
        {error && <div className="text-xs text-red-400">{error}</div>}
        <button className={`${btnPrimary} h-[38px] w-full justify-center`} onClick={submit} disabled={busy}>
          {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Sign up'}
        </button>
        <button
          className="text-xs text-muted hover:text-fg"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        >
          {mode === 'login' ? 'Need an account? Sign up' : 'Have an account? Sign in'}
        </button>
        <div className="text-center text-[11px] text-faint">Demo: demo@fundingpips.dev / demo1234</div>
      </div>
    </div>
  );
}
