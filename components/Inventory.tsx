"use client";
import React, { useState, useMemo } from 'react';
import { useGameStore } from '@/lib/store';
import { SKINS } from '@/lib/skins';
import { THEMES } from '@/lib/themes';
import { AVATARS, AVATAR_FRAMES } from '@/lib/avatars';
import { TRAILS } from '@/lib/trails';
import { GADGETS } from '@/lib/gadgets';
import { motion } from 'motion/react';
import { Package, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useConfetti } from '@/components/ConfettiProvider';
import { sounds } from '@/lib/audio';

export default function Inventory() {
  const { inventory, equippedSkin, equipSkin, equippedTrail, equipTrail, soundEnabled } = useGameStore();
  const confetti = useConfetti();
  const [activeTab, setActiveTab] = useState<'skins' | 'trails' | 'gadgets' | 'themes' | 'avatars'>('skins');

  const getRarityBadgeStyle = (rarity: string) => {
    switch (rarity) {
      case "Légendaire":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/30";
      case "Épique":
        return "bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/30";
      case "Rare":
        return "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border border-slate-500/20";
    }
  };

  const getCardStyle = (rarity: string, equipped: boolean) => {
    if (equipped) {
      switch (rarity) {
        case "Légendaire":
          return "border-amber-400 bg-slate-900/90 shadow-[0_0_30px_rgba(245,158,11,0.25)] ring-2 ring-amber-400/20";
        case "Épique":
          return "border-fuchsia-400 bg-slate-900/90 shadow-[0_0_30px_rgba(217,70,239,0.25)] ring-2 ring-fuchsia-400/20";
        case "Rare":
          return "border-cyan-400 bg-slate-900/90 shadow-[0_0_30px_rgba(6,182,212,0.25)] ring-2 ring-cyan-400/20";
        default:
          return "border-blue-400 bg-slate-900/90 shadow-[0_0_25px_rgba(59,130,246,0.2)] ring-2 ring-blue-400/10";
      }
    }

    switch (rarity) {
      case "Légendaire":
        return "border-amber-500/10 hover:border-amber-500/40 bg-slate-900/40 hover:bg-slate-900/70";
      case "Épique":
        return "border-fuchsia-500/10 hover:border-fuchsia-500/40 bg-slate-900/40 hover:bg-slate-900/70";
      case "Rare":
        return "border-cyan-500/10 hover:border-cyan-500/30 bg-slate-900/40 hover:bg-slate-900/70";
      default:
        return "border-slate-800 hover:border-slate-700 bg-slate-900/30 hover:bg-slate-900/60";
    }
  };

  const handleEquipSkin = (skinId: string) => {
    sounds.playClick(soundEnabled);
    const skin = SKINS.find(s => s.id === skinId);
    equipSkin(skinId);
    if (skin?.rarity === "Légendaire") {
      confetti.fireAtElement(null, { count: 30, colors: ["#eab308", "#f59e0b", "#fcd34d", "#a855f7"] });
    }
  };

  const handleEquipTrail = (trailId: string) => {
    sounds.playClick(soundEnabled);
    const trail = TRAILS.find(t => t.id === trailId);
    equipTrail(trailId);
    if (trail?.rarity === "Légendaire") {
      confetti.fireAtElement(null, { count: 30, colors: ["#a855f7", "#ec4899", "#06b6d4", "#f59e0b"] });
    }
  };

  return (
    <div className="h-full flex flex-col p-6 lg:p-8 overflow-y-auto bg-slate-950">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h2 className="text-4xl font-black font-mono tracking-tighter uppercase mb-1 flex items-center gap-3 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            <Package className="w-8 h-8 text-cyan-400" /> INVENTAIRE
          </h2>
          <p className="text-slate-400 font-mono text-sm">
            Gérez vos gadgets tactiques débloqués et configurez vos éléments de cosmétique.
          </p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-4 mb-8 p-1 bg-slate-900/80 rounded-2xl border border-white/5 w-full md:max-w-xl overflow-x-auto shrink-0">
        <button
          onClick={() => setActiveTab('skins')}
          className={cn(
            "flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold font-mono transition-all uppercase tracking-wider whitespace-nowrap",
            activeTab === 'skins'
              ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-blue-500/20"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          )}
        >
          Skins de Blocs 🎨
        </button>
        <button
          onClick={() => setActiveTab('trails')}
          className={cn(
            "flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold font-mono transition-all uppercase tracking-wider whitespace-nowrap",
            activeTab === 'trails'
              ? "bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white shadow-lg shadow-purple-500/20"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          )}
        >
          Traînées d&apos;Effets ✨
        </button>
        <button
          onClick={() => setActiveTab('themes')}
          className={cn(
            "flex-1 py-4 px-4 rounded-xl text-xs sm:text-sm font-black font-mono transition-all uppercase tracking-wider whitespace-nowrap",
            activeTab === 'themes'
              ? "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)] z-10"
              : "text-slate-400 hover:text-white hover:bg-white/5 opacity-70 hover:opacity-100"
          )}
        >
          Thèmes 🖼️
        </button>
        <button
          onClick={() => setActiveTab('avatars')}
          className={cn(
            "flex-1 py-4 px-4 rounded-xl text-xs sm:text-sm font-black font-mono transition-all uppercase tracking-wider whitespace-nowrap",
            activeTab === 'avatars'
              ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] z-10"
              : "text-slate-400 hover:text-white hover:bg-white/5 opacity-70 hover:opacity-100"
          )}
        >
          Avatars 👤
        </button>
        <button
          onClick={() => setActiveTab('gadgets')}
          className={cn(
            "flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold font-mono transition-all uppercase tracking-wider whitespace-nowrap",
            activeTab === 'gadgets'
              ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-950 shadow-lg shadow-yellow-500/20"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          )}
        >
          Gadgets Tactiques ⚙️
        </button>
      </div>

      {activeTab === 'skins' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {SKINS.map((skin, idx) => {
            const owned = inventory.includes(skin.id);
            const equipped = equippedSkin === skin.id;

            // Hide skins that are not owned yet
            if (!owned) return null;

            return (
              <motion.div
                key={skin.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.04 }}
                className={cn(
                  "p-5 rounded-2xl border-2 flex flex-col cursor-pointer transition-all duration-300 relative overflow-hidden group",
                  getCardStyle(skin.rarity, equipped)
                )}
                onClick={() => handleEquipSkin(skin.id)}
              >
                {/* Badge & Icon row */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col gap-1">
                    <span className={cn(
                      "text-[9px] uppercase font-black px-2 py-0.5 rounded-full font-mono w-max",
                      getRarityBadgeStyle(skin.rarity)
                    )}>
                      {skin.rarity}
                    </span>
                    <h3 className="text-lg font-black font-mono text-white mt-1 group-hover:text-cyan-400 transition-colors">
                      {skin.name}
                    </h3>
                  </div>
                  <div className="text-3xl bg-slate-950/60 p-2 rounded-xl border border-white/5">
                    {skin.icon}
                  </div>
                </div>

                {/* Description */}
                <p className="text-[11px] text-slate-400 leading-relaxed font-mono mb-4 flex-1">
                  {skin.description}
                </p>

                {/* Block colors preview in inventory */}
                <div className="mb-5">
                  <div className="flex gap-1 bg-slate-950/40 p-2 rounded-lg border border-white/5">
                    {skin.colors.map((colorClass, cIdx) => (
                      <div
                        key={cIdx}
                        className={cn("w-5 h-5 rounded shadow-sm", colorClass)}
                      />
                    ))}
                  </div>
                </div>

                {/* Equip button overlay */}
                <div className="w-full">
                  {equipped ? (
                    <div className="py-2.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 rounded-xl font-bold font-mono text-xs flex items-center justify-center gap-1.5 uppercase tracking-wider">
                      <Check className="w-4 h-4 text-cyan-400" /> Équipé
                    </div>
                  ) : (
                    <div className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold font-mono text-xs flex items-center justify-center gap-1.5 transition-all uppercase tracking-wider border border-white/5 group-hover:border-white/10">
                      Équiper
                    </div>
                  )}
                </div>

                {/* Sparkles on legendary active skins */}
                {equipped && skin.rarity === "Légendaire" && (
                  <div className="absolute top-2 right-2 text-yellow-400 animate-pulse">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {activeTab === 'trails' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {TRAILS.map((trail, idx) => {
            const owned = inventory.includes(trail.id);
            const equipped = equippedTrail === trail.id;

            // Hide trails that are not owned yet
            if (!owned) return null;

            return (
              <motion.div
                key={trail.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.04 }}
                className={cn(
                  "p-5 rounded-2xl border-2 flex flex-col cursor-pointer transition-all duration-300 relative overflow-hidden group",
                  getCardStyle(trail.rarity, equipped)
                )}
                onClick={() => handleEquipTrail(trail.id)}
              >
                {/* Badge & Icon row */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col gap-1">
                    <span className={cn(
                      "text-[9px] uppercase font-black px-2 py-0.5 rounded-full font-mono w-max",
                      getRarityBadgeStyle(trail.rarity)
                    )}>
                      {trail.rarity}
                    </span>
                    <h3 className="text-lg font-black font-mono text-white mt-1 group-hover:text-purple-400 transition-colors">
                      {trail.name}
                    </h3>
                  </div>
                  <div className="text-3xl bg-slate-950/60 p-2 rounded-xl border border-white/5">
                    {trail.icon}
                  </div>
                </div>

                {/* Description */}
                <p className="text-[11px] text-slate-400 leading-relaxed font-mono mb-4 flex-1">
                  {trail.description}
                </p>

                {/* Trail preview in inventory */}
                <div className="mb-5">
                  <div className="flex gap-2 bg-slate-950/40 p-2 rounded-lg border border-white/5 justify-center">
                    {trail.chars?.map((char, cIdx) => (
                      <span
                        key={cIdx}
                        className={cn("text-sm font-mono", trail.particleColor)}
                      >
                        {char}
                      </span>
                    )) || <span className="text-[10px] text-slate-500 font-mono italic">Sans effet</span>}
                  </div>
                </div>

                {/* Equip button overlay */}
                <div className="w-full">
                  {equipped ? (
                    <div className="py-2.5 bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded-xl font-bold font-mono text-xs flex items-center justify-center gap-1.5 uppercase tracking-wider">
                      <Check className="w-4 h-4 text-purple-400" /> Équipé
                    </div>
                  ) : (
                    <div className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold font-mono text-xs flex items-center justify-center gap-1.5 transition-all uppercase tracking-wider border border-white/5 group-hover:border-white/10">
                      Équiper
                    </div>
                  )}
                </div>

                {/* Sparkles on legendary active skins */}
                {equipped && trail.rarity === "Légendaire" && (
                  <div className="absolute top-2 right-2 text-yellow-400 animate-pulse">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {activeTab === 'gadgets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {GADGETS.map((gadget, idx) => {
            const count = useMemo(() => inventory.filter(id => id === gadget.id).length, [inventory, gadget.id]);

            // Hide gadgets that are not owned yet
            if (count === 0) return null;

            return (
              <motion.div
                key={gadget.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.04 }}
                className={cn(
                  "p-5 rounded-2xl border-2 flex flex-col transition-all duration-300 relative overflow-hidden group",
                  getCardStyle(gadget.rarity, false)
                )}
              >
                {/* Badge & Icon row */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col gap-1">
                    <span className={cn(
                      "text-[9px] uppercase font-black px-2 py-0.5 rounded-full font-mono w-max",
                      getRarityBadgeStyle(gadget.rarity)
                    )}>
                      {gadget.rarity}
                    </span>
                    <h3 className="text-lg font-black font-mono text-white mt-1">
                      {gadget.name}
                    </h3>
                  </div>
                  <div className="text-3xl bg-slate-950/60 p-2.5 rounded-xl border border-white/5 w-12 h-12 flex items-center justify-center select-none">
                    {gadget.icon}
                  </div>
                </div>

                {/* Description */}
                <p className="text-[11px] text-slate-400 leading-relaxed font-mono mb-5 flex-1">
                  {gadget.description}
                </p>

                {/* Count Status */}
                <div className="w-full">
                  <div className="py-2.5 bg-slate-900 border border-white/10 rounded-xl font-bold font-mono text-sm flex items-center justify-center gap-1.5 uppercase tracking-wider text-slate-300">
                    <Package className="w-4 h-4 text-slate-400" /> Possédé(s) : <span className="text-yellow-400">{count}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Empty State for gadgets */}
      {activeTab === 'gadgets' && GADGETS.filter(g => inventory.includes(g.id)).length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-900/40 rounded-3xl border border-dashed border-white/5 my-6">
          <Package className="w-10 h-10 text-slate-600 mb-3 animate-pulse" />
          <h3 className="text-lg font-bold font-mono text-white mb-1 uppercase">Aucun gadget débloqué</h3>
          <p className="text-xs text-slate-500 font-mono">Visitez la boutique pour débloquer de nouvelles mécaniques tactiques !</p>
        </div>
      )}
    </div>
  );
}
