import { useCallback, useEffect, useState } from 'react';
import { api, getToken, setToken } from './api.js';
import Login from './components/Login.jsx';
import Shell from './components/Shell.jsx';
import Dashboard from './components/Dashboard.jsx';

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('fp_theme') || 'dark');
  const [authed, setAuthed] = useState(!!getToken());
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('fp_theme', theme);
  }, [theme]);

  const load = useCallback(async () => {
    try {
      setError('');
      setData(await api.dashboard());
    } catch (err) {
      if (err.status === 401) {
        setToken(null);
        setAuthed(false);
      } else {
        setError(err.message);
      }
    }
  }, []);

  useEffect(() => {
    if (authed) load();
  }, [authed, load]);

  const logout = () => {
    setToken(null);
    setData(null);
    setAuthed(false);
  };

  if (!authed) {
    return (
      <Login
        onSuccess={(token) => {
          setToken(token);
          setAuthed(true);
        }}
      />
    );
  }

  return (
    <Shell
      theme={theme}
      onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      onLogout={logout}
    >
      {error && <div className="rounded-lg border border-red-900 p-3 text-xs text-red-400">{error}</div>}
      {!data && !error && <div className="p-10 text-center text-muted">Loading trader desk…</div>}
      {data && <Dashboard data={data} />}
    </Shell>
  );
}
