"use client";
import React from 'react';
import { useApp } from '@/lib/context';
import { Package, Store as StoreIcon, Play, Star, Circle, Diamond, Square } from 'lucide-react';
import { GridShape } from '@/lib/types';

export default function MainMenu() {
  const { setView, gridShape, setGridShape, highScore, xp } = useApp();

  return (
    <div className="flex flex-col items-center justify-center h-full pt-safe-top pb-safe-bottom bg-slate-950 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px]"></div>
      
      <div className="flex-1 flex flex-col items-center justify-center z-10 w-full max-w-md px-6">
         <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-500 tracking-tighter mb-2 drop-shadow-2xl">
           SNOB
         </h1>
         <div className="text-amber-400 font-bold mb-12 flex items-center gap-2">
            🏆 High Score: {highScore} <span className="text-slate-500">•</span> 🌟 XP: {xp}
         </div>

         <div className="w-full bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-4 mb-8">
            <h3 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider text-center">Grid Modifier</h3>
            <div className="flex gap-2">
              <button onClick={() => setGridShape('square')} className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${gridShape === 'square' ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                <Square size={16}/> Square
              </button>
              <button onClick={() => setGridShape('donut')} className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${gridShape === 'donut' ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                <Circle size={16}/> Donut
              </button>
              <button onClick={() => setGridShape('diamond')} className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${gridShape === 'diamond' ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                <Diamond size={16}/> Diamond
              </button>
            </div>
         </div>

         <button 
           onClick={() => setView('game')}
           className="w-full py-5 rounded-3xl bg-white text-slate-950 font-black text-2xl mb-6 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-3"
         >
           <Play size={28} className="fill-slate-950" /> PLAY
         </button>
         
         <div className="flex w-full gap-3 mb-3">
            <button onClick={() => setView('inventory')} className="flex-1 py-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center gap-2 hover:bg-slate-800 transition">
              <Package size={24} className="text-cyan-400" />
              <span className="font-bold text-sm">Inventory</span>
            </button>
            <button onClick={() => setView('store')} className="flex-1 py-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center gap-2 hover:bg-slate-800 transition">
              <StoreIcon size={24} className="text-yellow-400" />
              <span className="font-bold text-sm">Store</span>
            </button>
         </div>
         
         <button onClick={() => setView('bp')} className="w-full py-4 bg-gradient-to-tr from-purple-900/50 to-indigo-900/50 border border-purple-500/50 rounded-2xl flex items-center justify-center gap-2 hover:bg-purple-900/80 transition">
            <Star size={20} className="text-purple-400" />
            <span className="font-bold text-sm text-purple-200">Season Pass</span>
         </button>
      </div>
    </div>
  );
}
