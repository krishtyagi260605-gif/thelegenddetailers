'use client';

import { motion } from 'framer-motion';

type Props = {
  items: readonly string[];
};

export default function ServiceMarquee({ items }: Props) {
  const marqueeItems = [...items, ...items];

  return (
    <div className="overflow-hidden rounded-full border border-white/10 bg-white/[0.03] py-3">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        className="flex w-max gap-8 whitespace-nowrap px-6"
      >
        {marqueeItems.map((item, index) => (
          <span key={`${item}-${index}`} className="text-[11px] font-black uppercase tracking-[0.28em] text-zinc-300">
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
