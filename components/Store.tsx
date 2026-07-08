"use client";
import React, { useState } from 'react';
import { useGameStore, LootResult } from '@/lib/store';
import { SKINS } from '@/lib/skins';
import { TRAILS } from '@/lib/trails';
import { GADGETS } from '@/lib/gadgets';
import { RESOURCES } from '@/lib/resources';
import { motion } from 'motion/react';
import { Sparkles, ShoppingBag, Check, Award, Lock, Filter, Sparkle, Cog, Gift, Clock, Coins, Zap, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useConfetti } from '@/components/ConfettiProvider';
import { sounds } from '@/lib/audio';
import MysteryBoxOpener from './MysteryBoxOpener';


type FilterRarity = 'All' | 'Rare' | 'Épique' | 'Légendaire';

export default function Store() {
  const { coins, inventory, buyItem, buyMysteryBox, claimDailyReward, dailyRewardClaimed, soundEnabled } = useGameStore();
  const confetti = useConfetti();
  const [purchaseMsg, setPurchaseMsg] = useState<{ text: string; success: boolean } | null>(null);
  const [selectedRarity, setSelectedRarity] = useState<FilterRarity>('All');
  const [activeTab, setActiveTab] = useState<'skins' | 'trails' | 'gadgets' | 'resources'>('skins');
  const [openerOpen, setOpenerOpen] = useState(false);
  const [openedBoxType, setOpenedBoxType] = useState<'mystery' | 'epic' | null>(null);
  const [lootResult, setLootResult] = useState<LootResult | null>(null);

  const handleOpenBox = (type: 'mystery' | 'epic') => {
    const res = buyMysteryBox(type);
    if (res.success && res.loot) {
      setLootResult(res.loot);
      setOpenedBoxType(type);
      setOpenerOpen(true);
      sounds.playReward(soundEnabled);
      confetti.fireAtElement(null, { count: 40, colors: ["#facc15", "#d946ef", "#22d3ee", "#34d399", "#f97316"] });
    } else {
      setPurchaseMsg({ text: res.error || "Une erreur est survenue.", success: false });
      setTimeout(() => setPurchaseMsg(null), 3000);
    }
  };


  const handleBuy = (id: string, price: number, isConsumable: boolean = false) => {
    if (!isConsumable && inventory.includes(id)) return;
    if (buyItem(id, price, isConsumable)) {
      sounds.playClick(soundEnabled);
      sounds.playReward(soundEnabled);
      confetti.fireAtElement(null, { count: 25, colors: ["#22c55e", "#10b981", "#34d399", "#f59e0b"] });
      setPurchaseMsg({ text: "Achat réussi ! Objet débloqué ✨", success: true });
    } else {
      setPurchaseMsg({ text: "SP insuffisants ! Jouez pour en gagner 🔥", success: false });
    }
    setTimeout(() => setPurchaseMsg(null), 3000);
  };

  const handleClaimDailyReward = () => {
    if (claimDailyReward()) {
      sounds.playReward(soundEnabled);
      confetti.fireAtElement(null, { count: 35, colors: ["#facc15", "#fbbf24", "#fcd34d", "#f59e0b"] });
    }
  };

  const getRarityBadgeStyle = (rarity: string) => {
    switch (rarity) {
      case "Légendaire":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.1)]";
      case "Épique":
        return "bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/30 shadow-[0_0_10px_rgba(217,70,239,0.1)]";
      case "Rare":
        return "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border border-slate-500/20";
    }
  };

  const getCardStyle = (rarity: string) => {
    switch (rarity) {
      case "Légendaire":
        return "border-amber-500/30 hover:border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.03)] hover:shadow-[0_0_35px_rgba(245,158,11,0.12)] bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/20";
      case "Épique":
        return "border-fuchsia-500/30 hover:border-fuchsia-400/60 shadow-[0_0_20px_rgba(217,70,239,0.03)] hover:shadow-[0_0_35px_rgba(217,70,239,0.12)] bg-gradient-to-b from-slate-900 via-slate-900 to-fuchsia-950/20";
      case "Rare":
        return "border-cyan-500/20 hover:border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.01)] hover:shadow-[0_0_25px_rgba(6,182,212,0.08)] bg-gradient-to-b from-slate-900 via-slate-900 to-cyan-950/10";
      default:
        return "border-slate-800 hover:border-slate-700 bg-slate-900";
    }
  };

  const filteredSkins = SKINS.filter(s => s.id !== 'default_skin').filter(s => {
    if (selectedRarity === 'All') return true;
    return s.rarity === selectedRarity;
  });

  const filteredTrails = TRAILS.filter(t => t.id !== 'default_trail').filter(t => {
    if (selectedRarity === 'All') return true;
    return t.rarity === selectedRarity;
  });

  const filteredGadgets = GADGETS.filter(g => {
    if (selectedRarity === 'All') return true;
    return g.rarity === selectedRarity;
  });

  return (
    <div className="h-full flex flex-col p-6 lg:p-8 overflow-y-auto bg-slate-950">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 shrink-0">
        <div>
          <h2 className="text-4xl font-black font-mono tracking-tighter uppercase mb-1 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            BOUTIQUE SNOB
          </h2>
          <p className="text-slate-400 font-mono text-sm">
            Débloquez des gadgets tactiques, skins de blocs et traînées d&apos;effets avec vos <span className="text-yellow-400 font-bold">SP (Snob Points)</span> !
          </p>
        </div>
        <div className="flex items-center gap-3 bg-slate-900/90 px-6 py-3 rounded-2xl border border-white/10 shadow-xl">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-500/40 animate-pulse">
            <span className="text-yellow-400 font-black text-sm font-mono">SP</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 font-bold uppercase font-mono tracking-wider leading-none">Solde de Points</span>
            <span className="text-2xl font-black font-mono text-yellow-400 leading-tight">
              {coins.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-6 p-2 bg-slate-900/80 rounded-2xl border border-white/10 w-full overflow-x-auto shadow-inner shrink-0">
        <button
          onClick={() => {
            setActiveTab('skins');
            setSelectedRarity('All');
          }}
          className={cn(
            "flex-1 py-4 px-4 rounded-xl text-xs sm:text-sm font-black font-mono transition-all uppercase tracking-wider whitespace-nowrap",
            activeTab === 'skins'
              ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] z-10"
              : "text-slate-400 hover:text-white hover:bg-white/5 opacity-70 hover:opacity-100"
          )}
        >
          Skins de Blocs 🎨
        </button>
        <button
          onClick={() => {
            setActiveTab('trails');
            setSelectedRarity('All');
          }}
          className={cn(
            "flex-1 py-4 px-4 rounded-xl text-xs sm:text-sm font-black font-mono transition-all uppercase tracking-wider whitespace-nowrap",
            activeTab === 'trails'
              ? "bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white shadow-[0_0_20px_rgba(217,70,239,0.4)] z-10"
              : "text-slate-400 hover:text-white hover:bg-white/5 opacity-70 hover:opacity-100"
          )}
        >
          Traînées d&apos;Effets ✨
        </button>
        <button
          onClick={() => {
            setActiveTab('gadgets');
            setSelectedRarity('All');
          }}
          className={cn(
            "flex-1 py-4 px-4 rounded-xl text-xs sm:text-sm font-black font-mono transition-all uppercase tracking-wider whitespace-nowrap",
            activeTab === 'gadgets'
              ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-950 shadow-[0_0_20px_rgba(250,204,21,0.4)] z-10"
              : "text-slate-400 hover:text-white hover:bg-white/5 opacity-70 hover:opacity-100"
          )}
        >
          Gadgets Tactiques ⚙️
        </button>
        <button
          onClick={() => {
            setActiveTab('resources');
            setSelectedRarity('All');
          }}
          className={cn(
            "flex-1 py-4 px-4 rounded-xl text-xs sm:text-sm font-black font-mono transition-all uppercase tracking-wider whitespace-nowrap",
            activeTab === 'resources'
              ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] z-10"
              : "text-slate-400 hover:text-white hover:bg-white/5 opacity-70 hover:opacity-100"
          )}
        >
          Ressources 🎁
        </button>
      </div>
      
      <div className="mb-4 shrink-0">
        <h3 className="text-xl font-black font-mono uppercase text-white tracking-widest border-b border-white/10 pb-2">
          {activeTab === 'skins' ? "Skins de Blocs" : activeTab === 'trails' ? "Traînées d'Effets" : activeTab === 'gadgets' ? "Gadgets Tactiques" : "Ressources & Boîtes Mystères"}
        </h3>
      </div>


      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-white/5 pb-6 shrink-0">
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-white/5 w-full sm:w-auto overflow-x-auto">
          {(["All", "Rare", "Épique", "Légendaire"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRarity(r)}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-black font-mono uppercase tracking-wider transition-all whitespace-nowrap",
                selectedRarity === r
                  ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              )}
            >
              {r === "All" ? "Tous" : r}
            </button>
          ))}
        </div>

        {/* Mini stats about unlocked skins */}
        <div className="text-[10px] font-mono uppercase text-slate-500 flex flex-wrap gap-x-4 gap-y-1">
          {activeTab === 'skins' ? (
            <>
              <div>
                Rares : <span className="text-cyan-400 font-bold">{inventory.filter(id => SKINS.find(s => s.id === id)?.rarity === 'Rare').length} / {SKINS.filter(s => s.rarity === 'Rare').length}</span>
              </div>
              <div className="hidden sm:block">|</div>
              <div>
                Épiques : <span className="text-fuchsia-400 font-bold">{inventory.filter(id => SKINS.find(s => s.id === id)?.rarity === 'Épique').length} / {SKINS.filter(s => s.rarity === 'Épique').length}</span>
              </div>
              <div className="hidden sm:block">|</div>
              <div>
                Légendaires : <span className="text-amber-400 font-bold">{inventory.filter(id => SKINS.find(s => s.id === id)?.rarity === 'Légendaire').length} / {SKINS.filter(s => s.rarity === 'Légendaire').length}</span>
              </div>
            </>
          ) : activeTab === 'trails' ? (
            <>
              <div>
                Rares : <span className="text-cyan-400 font-bold">{inventory.filter(id => TRAILS.find(t => t.id === id)?.rarity === 'Rare').length} / {TRAILS.filter(t => t.rarity === 'Rare').length}</span>
              </div>
              <div className="hidden sm:block">|</div>
              <div>
                Épiques : <span className="text-fuchsia-400 font-bold">{inventory.filter(id => TRAILS.find(t => t.id === id)?.rarity === 'Épique').length} / {TRAILS.filter(t => t.rarity === 'Épique').length}</span>
              </div>
              <div className="hidden sm:block">|</div>
              <div>
                Légendaires : <span className="text-amber-400 font-bold">{inventory.filter(id => TRAILS.find(t => t.id === id)?.rarity === 'Légendaire').length} / {TRAILS.filter(t => t.rarity === 'Légendaire').length}</span>
              </div>
            </>
          ) : (
            <>
              <div>
                Rares : <span className="text-cyan-400 font-bold">{inventory.filter(id => GADGETS.find(g => g.id === id)?.rarity === 'Rare').length} / {GADGETS.filter(g => g.rarity === 'Rare').length}</span>
              </div>
              <div className="hidden sm:block">|</div>
              <div>
                Épiques : <span className="text-fuchsia-400 font-bold">{inventory.filter(id => GADGETS.find(g => g.id === id)?.rarity === 'Épique').length} / {GADGETS.filter(g => g.rarity === 'Épique').length}</span>
              </div>
              <div className="hidden sm:block">|</div>
              <div>
                Légendaires : <span className="text-amber-400 font-bold">{inventory.filter(id => GADGETS.find(g => g.id === id)?.rarity === 'Légendaire').length} / {GADGETS.filter(g => g.rarity === 'Légendaire').length}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      {purchaseMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "mb-6 p-4 rounded-xl border text-center font-mono font-bold text-sm shadow-md",
            purchaseMsg.success
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          )}
        >
          {purchaseMsg.text}
        </motion.div>
      )}

      {/* Empty States */}
      {activeTab === 'skins' && filteredSkins.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-900/40 rounded-3xl border border-dashed border-white/5 my-6">
          <Filter className="w-10 h-10 text-slate-600 mb-3" />
          <h3 className="text-lg font-bold font-mono text-white mb-1 uppercase">Aucun skin trouvé</h3>
          <p className="text-xs text-slate-500 font-mono">Aucun skin de cette catégorie ne correspond à vos filtres actuels.</p>
        </div>
      )}

      {activeTab === 'trails' && filteredTrails.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-900/40 rounded-3xl border border-dashed border-white/5 my-6">
          <Filter className="w-10 h-10 text-slate-600 mb-3" />
          <h3 className="text-lg font-bold font-mono text-white mb-1 uppercase">Aucun effet trouvé</h3>
          <p className="text-xs text-slate-500 font-mono">Aucun effet de cette catégorie ne correspond à vos filtres actuels.</p>
        </div>
      )}

      {activeTab === 'gadgets' && filteredGadgets.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-900/40 rounded-3xl border border-dashed border-white/5 my-6">
          <Filter className="w-10 h-10 text-slate-600 mb-3" />
          <h3 className="text-lg font-bold font-mono text-white mb-1 uppercase">Aucun gadget trouvé</h3>
          <p className="text-xs text-slate-500 font-mono">Aucun gadget de cette catégorie ne correspond à vos filtres actuels.</p>
        </div>
      )}

      {/* Skins Grid */}
      {activeTab === 'skins' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkins.map((skin, idx) => {
            const owned = inventory.includes(skin.id);
            const isPassExclusive = skin.price === 0;
            const affordable = !isPassExclusive && coins >= skin.price;

            return (
              <motion.div
                key={skin.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={cn(
                  "p-6 rounded-2xl border-2 flex flex-col relative overflow-hidden transition-all duration-300 group",
                  getCardStyle(skin.rarity)
                )}
              >
                {/* Top info */}
                <div className="flex justify-between items-start mb-4 z-10">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn(
                        "text-[10px] uppercase font-black px-2.5 py-1 rounded-full font-mono",
                        getRarityBadgeStyle(skin.rarity)
                      )}>
                        {skin.rarity}
                      </span>
                      {skin.rarity === "Légendaire" && (
                        <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-bounce" />
                      )}
                    </div>
                    <h3 className="text-2xl font-black font-mono text-white mb-1 tracking-tight group-hover:text-yellow-400 transition-colors">
                      {skin.name}
                    </h3>
                  </div>
                  <div className="text-4xl filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] bg-slate-950/60 p-2.5 rounded-2xl border border-white/5">
                    {skin.icon}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed font-mono mb-5 flex-1 relative z-10">
                  {skin.description}
                </p>
                
                {/* 7 Colors preview row */}
                <div className="mb-6 relative z-10">
                  <span className="text-[10px] uppercase font-black text-slate-500 font-mono tracking-wider mb-2 block">
                    Aperçu des Blocs
                  </span>
                  <div className="flex gap-1.5 p-3 bg-slate-950/40 rounded-xl border border-white/5">
                    {skin.colors.map((colorClass, cIdx) => (
                      <div
                        key={cIdx}
                        className={cn(
                          "w-7 h-7 rounded-md shadow-inner transition-transform duration-300 hover:scale-125 hover:z-20",
                          colorClass
                        )}
                      />
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-auto z-10">
                  <button
                    onClick={() => handleBuy(skin.id, skin.price)}
                    disabled={owned || isPassExclusive || (!affordable && !owned)}
                    className={cn(
                      "w-full py-4 rounded-xl font-bold font-mono text-sm flex items-center justify-center gap-2 transition-all duration-300 uppercase tracking-wider",
                      owned 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-not-allowed" 
                        : isPassExclusive
                          ? "bg-pink-500/10 text-pink-400 border border-pink-500/20 cursor-not-allowed"
                          : affordable
                            ? "bg-white text-slate-950 hover:bg-yellow-400 hover:scale-[1.02] shadow-lg shadow-white/5 active:scale-95"
                            : "bg-slate-950 text-slate-500 border border-white/5 cursor-not-allowed"
                    )}
                  >
                    {owned ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" /> Possédé
                      </>
                    ) : isPassExclusive ? (
                      <>
                        <Sparkles className="w-4 h-4 text-pink-400" /> Pass Exclusif
                      </>
                    ) : affordable ? (
                      <>
                        <ShoppingBag className="w-4 h-4" /> {skin.price} SP
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-slate-600" /> {skin.price} SP
                      </>
                    )}
                  </button>
                </div>

                {/* Ambient radial glow in the background */}
                <div className={cn(
                  "absolute -bottom-24 -right-24 w-48 h-48 rounded-full blur-[80px] pointer-events-none transition-opacity duration-300 opacity-20 group-hover:opacity-40",
                  skin.rarity === "Légendaire" ? "bg-amber-500" :
                  skin.rarity === "Épique" ? "bg-fuchsia-500" :
                  skin.rarity === "Rare" ? "bg-cyan-500" : "bg-slate-500"
                )} />
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Trails Grid */}
      {activeTab === 'trails' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrails.map((trail, idx) => {
            const owned = inventory.includes(trail.id);
            const isPassExclusive = trail.price === 0;
            const affordable = !isPassExclusive && coins >= trail.price;

            return (
              <motion.div
                key={trail.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={cn(
                  "p-6 rounded-2xl border-2 flex flex-col relative overflow-hidden transition-all duration-300 group",
                  getCardStyle(trail.rarity)
                )}
              >
                {/* Top info */}
                <div className="flex justify-between items-start mb-4 z-10">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn(
                        "text-[10px] uppercase font-black px-2.5 py-1 rounded-full font-mono",
                        getRarityBadgeStyle(trail.rarity)
                      )}>
                        {trail.rarity}
                      </span>
                      {trail.rarity === "Légendaire" && (
                        <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-bounce" />
                      )}
                    </div>
                    <h3 className="text-2xl font-black font-mono text-white mb-1 tracking-tight group-hover:text-yellow-400 transition-colors">
                      {trail.name}
                    </h3>
                  </div>
                  <div className="text-4xl filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] bg-slate-950/60 p-2.5 rounded-2xl border border-white/5">
                    {trail.icon}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed font-mono mb-5 flex-1 relative z-10">
                  {trail.description}
                </p>
                
                {/* Particles preview row */}
                <div className="mb-6 relative z-10">
                  <span className="text-[10px] uppercase font-black text-slate-500 font-mono tracking-wider mb-2 block">
                    Aperçu des Particules
                  </span>
                  <div className="flex gap-3 p-3 bg-slate-950/50 rounded-xl border border-white/5 items-center justify-center h-12">
                    {trail.chars?.map((char, cIdx) => (
                      <motion.span
                        key={cIdx}
                        animate={{ y: [0, -6, 0], scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
                        transition={{ repeat: Infinity, duration: 1.2, delay: cIdx * 0.15 }}
                        className={cn("text-lg font-mono", trail.particleColor)}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-auto z-10">
                  <button
                    onClick={() => handleBuy(trail.id, trail.price)}
                    disabled={owned || isPassExclusive || (!affordable && !owned)}
                    className={cn(
                      "w-full py-4 rounded-xl font-bold font-mono text-sm flex items-center justify-center gap-2 transition-all duration-300 uppercase tracking-wider",
                      owned 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-not-allowed" 
                        : isPassExclusive
                          ? "bg-pink-500/10 text-pink-400 border border-pink-500/20 cursor-not-allowed"
                          : affordable
                            ? "bg-white text-slate-950 hover:bg-yellow-400 hover:scale-[1.02] shadow-lg shadow-white/5 active:scale-95"
                            : "bg-slate-950 text-slate-500 border border-white/5 cursor-not-allowed"
                    )}
                  >
                    {owned ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" /> Possédé
                      </>
                    ) : isPassExclusive ? (
                      <>
                        <Sparkles className="w-4 h-4 text-pink-400" /> Pass Exclusif
                      </>
                    ) : affordable ? (
                      <>
                        <ShoppingBag className="w-4 h-4" /> {trail.price} SP
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-slate-600" /> {trail.price} SP
                      </>
                    )}
                  </button>
                </div>

                {/* Ambient radial glow in the background */}
                <div className={cn(
                  "absolute -bottom-24 -right-24 w-48 h-48 rounded-full blur-[80px] pointer-events-none transition-opacity duration-300 opacity-20 group-hover:opacity-40",
                  trail.rarity === "Légendaire" ? "bg-amber-500" :
                  trail.rarity === "Épique" ? "bg-fuchsia-500" :
                  trail.rarity === "Rare" ? "bg-cyan-500" : "bg-slate-500"
                )} />
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Gadgets Grid */}
      {activeTab === 'gadgets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGadgets.map((gadget, idx) => {
            const count = inventory.filter(id => id === gadget.id).length;
            const isPassExclusive = gadget.price === 0;
            const affordable = !isPassExclusive && coins >= gadget.price;

            return (
              <motion.div
                key={gadget.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={cn(
                  "p-6 rounded-2xl border-2 flex flex-col relative overflow-hidden transition-all duration-300 group",
                  getCardStyle(gadget.rarity)
                )}
              >
                {/* Top info */}
                <div className="flex justify-between items-start mb-4 z-10">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn(
                        "text-[10px] uppercase font-black px-2.5 py-1 rounded-full font-mono",
                        getRarityBadgeStyle(gadget.rarity)
                      )}>
                        {gadget.rarity}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black font-mono text-white mb-1 tracking-tight group-hover:text-yellow-400 transition-colors">
                      {gadget.name}
                    </h3>
                  </div>
                  <div className="text-4xl filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] bg-slate-950/60 p-2.5 rounded-2xl border border-white/5 flex items-center justify-center w-14 h-14 select-none">
                    {gadget.icon}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed font-mono mb-6 flex-1 relative z-10">
                  {gadget.description}
                </p>

                <div className="mt-auto z-10">
                  <div className="text-xs text-center text-slate-400 mb-2 font-mono">
                    En stock : <span className="text-yellow-400 font-bold">{count}</span>
                  </div>
                  <button
                    onClick={() => handleBuy(gadget.id, gadget.price, true)}
                    disabled={isPassExclusive || !affordable}
                    className={cn(
                      "w-full py-4 rounded-xl font-bold font-mono text-sm flex items-center justify-center gap-2 transition-all duration-300 uppercase tracking-wider",
                      isPassExclusive
                        ? "bg-pink-500/10 text-pink-400 border border-pink-500/20 cursor-not-allowed"
                        : affordable
                          ? "bg-yellow-500 hover:bg-yellow-400 text-slate-950 hover:scale-[1.02] shadow-lg shadow-yellow-500/20 active:scale-95"
                          : "bg-slate-950 text-slate-500 border border-white/5 cursor-not-allowed"
                    )}
                  >
                    {isPassExclusive ? (
                      <>
                        <Sparkles className="w-4 h-4 text-pink-400" /> Pass Exclusif
                      </>
                    ) : affordable ? (
                      <>
                        <ShoppingBag className="w-4 h-4" /> Acheter ({gadget.price} SP)
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-slate-600" /> {gadget.price} SP
                      </>
                    )}
                  </button>
                </div>

                {/* Ambient radial glow in the background */}
                <div className={cn(
                  "absolute -bottom-24 -right-24 w-48 h-48 rounded-full blur-[80px] pointer-events-none transition-opacity duration-300 opacity-20 group-hover:opacity-40",
                  gadget.rarity === "Légendaire" ? "bg-amber-500" :
                  gadget.rarity === "Épique" ? "bg-fuchsia-500" :
                  gadget.rarity === "Rare" ? "bg-cyan-500" : "bg-slate-500"
                )} />
              </motion.div>
            );
          })}
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto my-4 w-full">
          {/* Récompense Quotidienne */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl border-2 border-yellow-500/30 shadow-[0_0_20px_rgba(250,204,21,0.15)] hover:shadow-[0_0_35px_rgba(250,204,21,0.3)] bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/20 hover:border-amber-400/50 flex flex-col relative overflow-hidden group transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4 z-10">
              <div>
                <span className="text-[10px] uppercase font-black px-2.5 py-1 rounded-full font-mono bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> Ressource
                </span>
                <h3 className="text-2xl font-black font-mono text-white mt-2 mb-1 tracking-tight group-hover:text-yellow-400 transition-colors">
                  Récompense Quotidienne
                </h3>
              </div>
              <div className="text-4xl filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] bg-slate-950/60 p-3 rounded-2xl border border-white/5 w-16 h-16 flex items-center justify-center animate-pulse">
                🎁
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-mono mb-5 flex-1 z-10">
              Récupère <span className="text-yellow-400 font-bold text-lg">5 SP (Snob Points)</span> gratuitement chaque jour à minuit. La récompense se réinitialise automatiquement une fois par jour !
            </p>

            <div className="bg-slate-950/50 p-3.5 rounded-xl border border-white/5 font-mono text-xs mb-6 z-10">
              <span className="text-slate-500 block uppercase text-[10px] mb-2 font-bold">Effets :</span>
              <ul className="space-y-1 text-slate-300">
                <li className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-yellow-400" />
                  Confettis dorés à la récupération
                </li>
                <li className="flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-cyan-400" />
                  Son reward mélodieux
                </li>
              </ul>
            </div>

            <div className="mt-auto z-10">
              {dailyRewardClaimed ? (
                <div className="w-full py-3 bg-emerald-500/10 text-emerald-400 text-center font-bold text-sm rounded-xl border border-emerald-500/20 font-mono flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" /> Récupérée
                </div>
              ) : (
                <button
                  onClick={handleClaimDailyReward}
                  className="w-full py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-950 font-bold font-mono text-sm rounded-xl transition-all duration-300 uppercase tracking-wider hover:scale-[1.02] shadow-lg shadow-yellow-500/20 active:scale-95 flex items-center justify-center gap-2"
                >
                  <Gift className="w-4 h-4" /> Récupérer (5 SP)
                </button>
              )}
            </div>

            <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full blur-[80px] pointer-events-none bg-yellow-500 opacity-15 group-hover:opacity-30 transition-opacity duration-300" />
          </motion.div>

          {/* Boîte Mystère */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl border-2 border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.03)] hover:shadow-[0_0_35px_rgba(6,182,212,0.12)] bg-gradient-to-b from-slate-900 via-slate-900 to-cyan-950/20 hover:border-cyan-400/50 flex flex-col relative overflow-hidden group transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4 z-10">
              <div>
                <span className="text-[10px] uppercase font-black px-2.5 py-1 rounded-full font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  Ressources
                </span>
                <h3 className="text-2xl font-black font-mono text-white mt-2 mb-1 tracking-tight group-hover:text-yellow-400 transition-colors">
                  Boîte Mystère
                </h3>
              </div>
              <div className="text-4xl filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] bg-slate-950/60 p-3 rounded-2xl border border-white/5 w-16 h-16 flex items-center justify-center animate-pulse">
                🎁
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-mono mb-5 flex-1 z-10">
              Une boîte cadeau simple mais remplie de ressources. Contient soit des <span className="text-yellow-400 font-bold">SP</span>, soit des <span className="text-cyan-400 font-bold">XP</span> pour booster votre niveau snob à moindre coût !
            </p>

            <div className="bg-slate-950/50 p-3.5 rounded-xl border border-white/5 font-mono text-xs mb-6 z-10">
              <span className="text-slate-500 block uppercase text-[10px] mb-2 font-bold">Butins Potentiels (un au hasard) :</span>
              <ul className="space-y-1 text-slate-300">
                <li className="flex items-center gap-1.5">🪙 de 30 à 120 SP (50%)</li>
                <li className="flex items-center gap-1.5">⚡ de 20 à 100 XP (50%)</li>
              </ul>
            </div>

            <div className="mt-auto z-10">
              <button
                onClick={() => handleOpenBox('mystery')}
                disabled={coins < 150}
                className={cn(
                  "w-full py-4 rounded-xl font-bold font-mono text-sm flex items-center justify-center gap-2 transition-all duration-300 uppercase tracking-wider",
                  coins >= 150
                    ? "bg-white text-slate-950 hover:bg-yellow-400 hover:scale-[1.02] shadow-lg shadow-white/5 active:scale-95"
                    : "bg-slate-950 text-slate-500 border border-white/5 cursor-not-allowed"
                )}
              >
                {coins >= 150 ? (
                  <>
                    <ShoppingBag className="w-4 h-4 text-slate-950" /> Acheter (150 SP)
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-slate-600" /> 150 SP requis
                  </>
                )}
              </button>
            </div>

            <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full blur-[80px] pointer-events-none bg-cyan-500 opacity-10 group-hover:opacity-20 transition-opacity duration-300" />
          </motion.div>

          {/* Boîte Mystère Épique */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl border-2 border-fuchsia-500/20 shadow-[0_0_20px_rgba(217,70,239,0.03)] hover:shadow-[0_0_35px_rgba(217,70,239,0.12)] bg-gradient-to-b from-slate-900 via-slate-900 to-fuchsia-950/20 hover:border-fuchsia-400/50 flex flex-col relative overflow-hidden group transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4 z-10">
              <div>
                <span className="text-[10px] uppercase font-black px-2.5 py-1 rounded-full font-mono bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/30">
                  Prestige
                </span>
                <h3 className="text-2xl font-black font-mono text-white mt-2 mb-1 tracking-tight group-hover:text-yellow-400 transition-colors">
                  Boîte Épique
                </h3>
              </div>
              <div className="text-4xl filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] bg-slate-950/60 p-3 rounded-2xl border border-white/5 w-16 h-16 flex items-center justify-center shadow-[0_0_15px_rgba(217,70,239,0.2)] animate-pulse">
                🧰
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-mono mb-5 flex-1 z-10">
              Le coffre d&apos;élite par excellence. Tentez votre chance d&apos;obtenir des récompenses légendaires : de grosses sommes d&apos;XP/SP, des gadgets, des traînées d&apos;effets et des skins exclusifs très rares !
            </p>

            <div className="bg-slate-950/50 p-3.5 rounded-xl border border-white/5 font-mono text-xs mb-6 z-10">
              <span className="text-slate-500 block uppercase text-[10px] mb-2 font-bold">Raretés de Butin (décroissant) :</span>
              <ul className="space-y-1.5 text-slate-300">
                <li className="flex items-center justify-between text-[11px]">
                  <span>⚡ 300 - 1000 XP (Le plus commun)</span>
                  <span className="text-cyan-400 font-bold font-mono">40%</span>
                </li>
                <li className="flex items-center justify-between text-[11px]">
                  <span>💰 250 - 750 SP</span>
                  <span className="text-yellow-400 font-bold font-mono">25%</span>
                </li>
                <li className="flex items-center justify-between text-[11px]">
                  <span>⚙️ Gadget Tactique</span>
                  <span className="text-emerald-400 font-bold font-mono">18%</span>
                </li>
                <li className="flex items-center justify-between text-[11px]">
                  <span>✨ Traînée d&apos;Effet</span>
                  <span className="text-purple-400 font-bold font-mono">12%</span>
                </li>
                <li className="flex items-center justify-between text-[11px]">
                  <span className="text-yellow-300">🎨 Skin de Bloc (Très Rare)</span>
                  <span className="text-amber-500 font-bold font-mono">5%</span>
                </li>
              </ul>
            </div>

            <div className="mt-auto z-10">
              <button
                onClick={() => handleOpenBox('epic')}
                disabled={coins < 600}
                className={cn(
                  "w-full py-4 rounded-xl font-bold font-mono text-sm flex items-center justify-center gap-2 transition-all duration-300 uppercase tracking-wider",
                  coins >= 600
                    ? "bg-yellow-500 hover:bg-yellow-400 text-slate-950 hover:scale-[1.02] shadow-lg shadow-yellow-500/20 active:scale-95"
                    : "bg-slate-950 text-slate-500 border border-white/5 cursor-not-allowed"
                )}
              >
                {coins >= 600 ? (
                  <>
                    <ShoppingBag className="w-4 h-4 text-slate-950" /> Ouvrir le Coffre (600 SP)
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-slate-600" /> 600 SP requis
                  </>
                )}
              </button>
            </div>

            <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full blur-[80px] pointer-events-none bg-fuchsia-500 opacity-10 group-hover:opacity-20 transition-opacity duration-300" />
          </motion.div>
        </div>
      )}

      <MysteryBoxOpener
        isOpen={openerOpen}
        boxType={openedBoxType}
        loot={lootResult}
        onClose={() => {
          setOpenerOpen(false);
          setOpenedBoxType(null);
          setLootResult(null);
        }}
      />
    </div>
  );
}
