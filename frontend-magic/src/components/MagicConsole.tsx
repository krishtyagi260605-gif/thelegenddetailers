'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Zap, Loader2 } from 'lucide-react';

interface ThoughtNode {
    node: string;
    description: string;
    status: 'pending' | 'processing' | 'done';
}

export default function MagicConsole() {
    const thoughtCount = 3;
    const [messages, setMessages] = useState<string[]>([]);
    const [thoughts, setThoughts] = useState<ThoughtNode[]>([
        { node: 'Researcher', description: 'Querying vector stores...', status: 'pending' },
        { node: 'Analyst', description: 'Assessing architectural patterns...', status: 'pending' },
        { node: 'Generator', description: 'Synthesizing master-grade solutions...', status: 'pending' }
    ]);
    const [input, setInput] = useState('');
    const [ws, setWs] = useState<WebSocket | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const runThinkingChain = async () => {
            setThoughts(prev => prev.map(t => ({ ...t, status: 'pending' })));

            for (let i = 0; i < thoughtCount; i++) {
                setThoughts(prev => {
                    const next = [...prev];
                    next[i].status = 'processing';
                    return next;
                });

                await new Promise(r => setTimeout(r, 1200));

                setThoughts(prev => {
                    const next = [...prev];
                    next[i].status = 'done';
                    return next;
                });
            }
        };

        const socket = new WebSocket('ws://localhost:8000/ws/99');
        socket.onmessage = (event) => {
            const data = event.data;
            if (data.includes('Client #99 says:')) {
                setMessages(prev => [...prev, data]);
                runThinkingChain();
            }
        };
        setWs(socket);
        return () => socket.close();
    }, []);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (ws && input) {
            ws.send(input);
            setInput('');
        }
    };

    return (
        <div className="bg-[#050505] border border-[#FFD700]/20 rounded-xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-[#111] p-3 border-b border-[#FFD700]/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Terminal className="text-[#FFD700] w-3 h-3" />
                    <span className="text-[10px] font-mono text-[#FFD700] uppercase tracking-widest">Magic Agentic Console</span>
                </div>
                <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500/20" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
                    <div className="w-2 h-2 rounded-full bg-green-500/20" />
                </div>
            </div>

            {/* AI Action Graph */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3 bg-black/40 border-b border-[#FFD700]/5">
                {thoughts.map((t, idx) => (
                    <div 
                        key={idx}
                        className={`p-3 rounded-lg border transition-all duration-500 ${
                            t.status === 'processing' ? 'border-[#FFD700] bg-[#FFD700]/5 shadow-[0_0_15px_rgba(255,215,0,0.1)]' : 
                            t.status === 'done' ? 'border-green-500/30 bg-green-500/5' : 'border-white/5 bg-white/5'
                        }`}
                    >
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[9px] font-mono uppercase text-zinc-500">{t.node}</span>
                            {t.status === 'processing' && <Loader2 className="animate-spin text-[#FFD700]" size={10} />}
                            {t.status === 'done' && <Zap className="text-green-500" size={10} />}
                        </div>
                        <p className={`text-[10px] font-medium leading-tight ${t.status === 'pending' ? 'text-zinc-700' : 'text-zinc-300'}`}>
                            {t.description}
                        </p>
                    </div>
                ))}
            </div>

            {/* Terminal Feed */}
            <div ref={scrollRef} className="h-48 overflow-y-auto p-4 space-y-2 font-mono scrollbar-hide text-[11px]">
                {messages.length === 0 && <p className="text-zinc-800 italic">{'>'} System idle... waiting for user prompt.</p>}
                {messages.map((m, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={idx} 
                        className="text-[#00FFFF] flex gap-2"
                    >
                        <span className="text-zinc-700">USER_CMD:</span>
                        {m.split('says:')[1] || m}
                    </motion.div>
                ))}
            </div>

            {/* Input Overlay */}
            <form onSubmit={sendMessage} className="p-3 bg-[#080808] flex items-center gap-3">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask Magic Agent..."
                    className="flex-1 bg-transparent border-none outline-none text-xs text-white p-1 font-mono focus:ring-0 placeholder:text-zinc-800"
                />
                <button type="submit" className="p-1 px-3 bg-[#FFD700] text-black text-[9px] font-black uppercase rounded shadow-lg">Run</button>
            </form>
        </div>
    );
}
