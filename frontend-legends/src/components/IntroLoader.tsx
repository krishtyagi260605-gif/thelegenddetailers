'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function IntroLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 1900);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: 'easeInOut' } }}
          className="pointer-events-none fixed inset-0 z-[100] overflow-hidden bg-[#030303]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.18),transparent_28%),radial-gradient(circle_at_75%_25%,rgba(56,189,248,0.16),transparent_20%)]" />
          <div className="relative flex h-full flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0.85, opacity: 0.2 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="rounded-full border border-[#FFD700]/30 px-5 py-2 text-[10px] font-black uppercase tracking-[0.38em] text-[#FFD700]"
            >
              Legends Detailers
            </motion.div>
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.75 }}
              className="mt-8 text-center text-5xl font-black uppercase tracking-tight text-white md:text-7xl"
            >
              Protection.
              <span className="block bg-gradient-to-r from-[#FFD700] via-white to-sky-300 bg-clip-text text-transparent">
                Gloss. Presence.
              </span>
            </motion.h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 220 }}
              transition={{ delay: 0.45, duration: 0.8 }}
              className="mt-10 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#FFD700] to-transparent"
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
