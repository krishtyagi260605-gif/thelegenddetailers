'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/dist/Draggable';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Draggable);
}

export default function RevealSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const afterRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !afterRef.current || !handleRef.current) return;

    const container = containerRef.current;
    const after = afterRef.current;
    const handle = handleRef.current;

    // Initial State: 50% split
    const startX = container.offsetWidth / 2;
    gsap.set(handle, { x: startX });
    gsap.set(after, { clipPath: `inset(0 0 0 50%)` });

    const draggable = Draggable.create(handle, {
      type: 'x',
      bounds: container,
      onDrag: function() {
        const percent = (this.x / container.offsetWidth) * 100;
        // Inset from right: (100 - percent)
        gsap.set(after, { clipPath: `inset(0 0 0 ${percent}%)` });
      },
      onDragEnd: function() {
        // Subtle magnetic pull if near ends
        if (this.x < 50) {
            gsap.to(handle, { x: 0, duration: 0.5, ease: 'power2.out', onUpdate: () => updateClip(0) });
        } else if (this.x > container.offsetWidth - 50) {
            gsap.to(handle, { x: container.offsetWidth, duration: 0.5, ease: 'power2.out', onUpdate: () => updateClip(100) });
        }
      }
    });

    const updateClip = (percent: number) => {
        gsap.set(after, { clipPath: `inset(0 0 0 ${percent}%)` });
    };

    return () => {
        if (draggable[0]) draggable[0].kill();
    }
  }, []);

  return (
    <div className="space-y-4">
        <div ref={containerRef} className="relative w-full aspect-video rounded-3xl overflow-hidden cursor-move bg-black shadow-2xl group">
            {/* Before (Dull/Scratched) */}
            <div className="absolute inset-0">
                <div
                    aria-label="Before Treatment"
                    className="w-full h-full bg-cover bg-center saturate-[0.2] brightness-75 contrast-125"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1542362567-b058c02b9ac1?q=80&w=2000&auto=format&fit=crop')",
                    }}
                />
                <div className="absolute bottom-6 left-6 z-20">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] text-white font-black uppercase tracking-widest border border-white/10">Before Treatment</span>
                </div>
            </div>

            {/* After (Glossy/Finished) */}
            <div ref={afterRef} className="absolute inset-0 z-10 transition-none">
                <div
                    aria-label="After Treatment"
                    className="w-full h-full bg-cover bg-center saturate-150 brightness-110"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1542362567-b058c02b9ac1?q=80&w=2000&auto=format&fit=crop')",
                    }}
                />
                <div className="absolute bottom-6 right-6 z-20">
                    <span className="px-3 py-1 bg-[#FFD700] rounded-full text-[10px] text-black font-black uppercase tracking-widest shadow-lg">Legendary Finish</span>
                </div>
            </div>

            {/* The Divider Handle */}
            <div 
                ref={handleRef} 
                className="absolute top-0 bottom-0 w-[2px] bg-white z-30 flex items-center justify-center"
            >
                <div className="w-10 h-10 aspect-square bg-white rounded-full flex items-center justify-center shadow-2xl group-active:scale-90 transition-transform">
                    <div className="flex gap-1">
                        <div className="w-[1.5px] h-3 bg-zinc-300"></div>
                        <div className="w-[1.5px] h-3 bg-zinc-300"></div>
                    </div>
                </div>
            </div>
            
            {/* Floating Hint */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <span className="text-white/20 font-black text-6xl uppercase tracking-[0.5em] select-none">Slide to Shine</span>
            </div>
        </div>
        <p className="text-center text-zinc-500 text-[10px] font-bold uppercase tracking-widest italic animate-pulse">Drag the center handle to reveal the legend</p>
    </div>
  );
}
