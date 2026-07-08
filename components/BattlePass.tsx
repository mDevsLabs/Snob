"use client";
import React from 'react';
import { useApp } from '@/lib/context';
import { X, Star, Shield, Lock, Unlock } from 'lucide-react';

export default function BattlePass() {
  const { setView, xp, gems, spend } = useApp();
  
  return (
    <div className="absolute inset-0 z-50 bg-slate-950 flex flex-col pt-safe-top pb-safe-bottom">
       <header className="flex justify-between items-center p-4">
          <h2 className="text-3xl font-black text-white flex items-center gap-2"><Star className="text-purple-500 fill-purple-500"/> Season 1</h2>
          <button onClick={() => setView('home')} className="p-2 bg-white/10 rounded-full text-white"><X size={24} /></button>
       </header>
       <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
          <Shield size={64} className="text-purple-500 mb-4 drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]" />
          <h3 className="text-4xl font-black mb-2 tracking-tight">Neon Genesis Pass</h3>
          <p className="text-slate-400 mb-8 font-medium">Earn XP to unlock exclusive gadgets and skins!</p>
          
          <div className="w-full h-8 bg-slate-900 border border-slate-700 rounded-full overflow-hidden mb-3 relative shadow-inner">
             <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-cyan-500 shadow-[0_0_15px_rgba(168,85,247,0.8)]" style={{width: `${Math.min(100, (xp/1000)*100)}%`}}></div>
          </div>
          <div className="text-sm font-bold text-slate-300 mb-10 tracking-widest">{xp} / 1000 XP</div>
          
          <button onClick={() => spend(0, 500)} className="w-full max-w-sm py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 active:scale-95 text-white font-black rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.6)] flex items-center justify-center gap-2 transition">
             <Unlock size={20} /> Upgrade Premium (500 Gems)
          </button>
       </div>
    </div>
  );
}
