'use client';

import { useEffect, useState } from 'react';

import { fetchJson } from '@/lib/api';
import AdminPortal from '@/components/AdminPortal';

const STORAGE_KEY = 'legends_admin_token';

function LoginCard({
  onLogin,
  error,
  loading,
}: {
  onLogin: (event: React.FormEvent<HTMLFormElement>) => void;
  error: string | null;
  loading: boolean;
}) {
  return (
    <div className="mx-auto max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 p-10">
      <div className="space-y-4 text-center">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Authentication</div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Admin Access</h1>
        <p className="text-sm text-zinc-500">
          Secure portal for registered staff and management.
        </p>
      </div>

      <form onSubmit={onLogin} className="mt-8 space-y-4">
        <input
          name="username"
          defaultValue="admin"
          placeholder="Username"
          className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-4 text-sm text-white outline-none focus:border-zinc-600 transition-all"
        />
        <input
          name="passcode"
          type="password"
          placeholder="Admin passcode"
          className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-4 text-sm text-white outline-none focus:border-zinc-600 transition-all"
        />
        {error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</div>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-white py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-black transition-all hover:bg-zinc-200"
        >
          {loading ? 'Logging in...' : 'Enter Admin'}
        </button>
      </form>
    </div>
  );
}

export default function AdminScreen() {
  const [token, setToken] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      setChecking(false);
      return;
    }

    fetchJson('/api/legends/admin/session', {
      headers: { Authorization: `Bearer ${saved}` },
    })
      .then(() => setToken(saved))
      .catch(() => {
        window.localStorage.removeItem(STORAGE_KEY);
      })
      .finally(() => setChecking(false));
  }, []);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const username = String(form.get('username') ?? '');
    const passcode = String(form.get('passcode') ?? '');

    try {
      const response = await fetchJson<{ token: string }>('/api/legends/admin/login', {
        method: 'POST',
        body: JSON.stringify({ username, passcode }),
      });
      window.localStorage.setItem(STORAGE_KEY, response.token);
      setToken(response.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setToken(null);
  };

  return (
    <main className="min-h-screen bg-[#050505] px-6 py-20 text-white selection:bg-white/20">
      <div className="mx-auto max-w-7xl space-y-12">
        <div className="space-y-6">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Workshop Management</div>
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl italic uppercase leading-none">Control Center</h1>
          <p className="max-w-3xl text-sm leading-relaxed text-zinc-400">
            Internal interface for feeding client data, updating task status, and monitoring real-time operations.
          </p>
        </div>
        {checking ? (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/20 p-16 text-center text-zinc-500 text-sm italic">Verifying credentials...</div>
        ) : token ? (
          <AdminPortal token={token} onLogout={handleLogout} />
        ) : (
          <LoginCard onLogin={handleLogin} error={error} loading={loading} />
        )}
      </div>
    </main>
  );
}
