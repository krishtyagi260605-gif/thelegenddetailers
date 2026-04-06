'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    window.location.replace('http://localhost:3001/admin');
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-center text-white">
      <div className="max-w-xl space-y-4">
        <div className="text-[10px] font-black uppercase tracking-[0.32em] text-[#FFD700]">Legends Detailers</div>
        <h1 className="text-4xl font-black uppercase tracking-tight">Moving to the Legends admin portal</h1>
        <p className="text-sm leading-relaxed text-zinc-400">
          The old Magic Engine branded page is no longer the main experience. Use the Legends website admin route instead.
        </p>
        <a
          href="http://localhost:3001/admin"
          className="inline-flex rounded-full bg-[#FFD700] px-6 py-3 text-[11px] font-black uppercase tracking-[0.24em] text-black"
        >
          Open Legends Admin
        </a>
      </div>
    </main>
  );
}
