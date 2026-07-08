"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Gift, PackageOpen, Star, HelpCircle, Coins, Zap } from "lucide-react";
import { useGameStore, LootResult } from "@/lib/store";
import { useConfetti } from "@/components/ConfettiProvider";
import { sounds } from "@/lib/audio";
import { cn } from "@/lib/utils";

interface MysteryBoxOpenerProps {
  isOpen: boolean;
  boxType: "mystery" | "epic" | null;
  loot: LootResult | null;
  onClose: () => void;
}

export default function MysteryBoxOpener({ isOpen, boxType, loot, onClose }: MysteryBoxOpenerProps) {
  const { soundEnabled } = useGameStore();
  const { fire, popReward } = useConfetti();
  const [phase, setPhase] = useState<"idle" | "shaking" | "reveal">("idle");
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      const resetTimer = setTimeout(() => {
        setPhase("idle");
        setShowContent(false);
      }, 0);
      return () => clearTimeout(resetTimer);
    }
    
    // Auto-start shaking
    const shakeTimer = setTimeout(() => {
      setPhase("shaking");
      
      // Play shaking sounds at intervals
      let shakeCount = 0;
      const shakeSoundInterval = setInterval(() => {
        if (shakeCount < 8) {
          sounds.playBoxShake(soundEnabled);
          shakeCount++;
        } else {
          clearInterval(shakeSoundInterval);
        }
      }, 180);

      return () => clearInterval(shakeSoundInterval);
    }, 500);

    // Reveal loot after shaking
    const revealTimer = setTimeout(() => {
      setPhase("reveal");
      sounds.playBoxReveal(soundEnabled);
      
      // Trigger confetti explosion
      fire(window.innerWidth / 2, window.innerHeight / 2, {
        count: boxType === "epic" ? 100 : 50,
        spread: boxType === "epic" ? 360 : 200,
        colors: boxType === "epic" 
          ? ["#facc15", "#d946ef", "#a78bfa", "#f43f5e", "#22d3ee"] 
          : ["#34d399", "#22d3ee", "#a78bfa", "#facc15"]
      });

      const contentTimer = setTimeout(() => {
        setShowContent(true);
      }, 300);

      return () => clearTimeout(contentTimer);
    }, 2300);

    return () => {
      clearTimeout(shakeTimer);
      clearTimeout(revealTimer);
    };
  }, [isOpen, boxType, soundEnabled, fire]);

  if (!isOpen || !boxType || !loot) return null;

  const isEpic = boxType === "epic";

  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case "Légendaire":
        return "text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]";
      case "Épique":
        return "text-fuchsia-400 drop-shadow-[0_0_15px_rgba(217,70,239,0.6)]";
      case "Rare":
        return "text-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.5)]";
      default:
        return "text-slate-200";
    }
  };

  const getRarityBg = (rarity?: string) => {
    switch (rarity) {
      case "Légendaire":
        return "from-amber-500/20 to-amber-950/40 border-amber-500/30";
      case "Épique":
        return "from-fuchsia-500/20 to-fuchsia-950/40 border-fuchsia-500/30";
      case "Rare":
        return "from-cyan-500/20 to-cyan-950/40 border-cyan-500/30";
      default:
        return "from-slate-800/30 to-slate-900/40 border-slate-700/30";
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4 overflow-hidden"
      >
        {/* Magic light beams behind box */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
            className={cn(
              "w-[500px] h-[500px] rounded-full opacity-35 blur-[80px]",
              isEpic 
                ? "bg-gradient-to-r from-fuchsia-500 via-purple-600 to-amber-500"
                : "bg-gradient-to-r from-cyan-500 via-emerald-600 to-blue-500"
            )}
          />
        </div>

        <div className="relative max-w-lg w-full flex flex-col items-center text-center">
          
          {/* Animated Header */}
          <motion.h2 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={cn(
              "text-3xl sm:text-4xl font-black font-mono tracking-tighter uppercase mb-2",
              isEpic 
                ? "bg-gradient-to-r from-fuchsia-400 via-purple-400 to-amber-400 bg-clip-text text-transparent"
                : "bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent"
            )}
          >
            {isEpic ? "Ouverture Épique !" : "Ouverture Mystère !"}
          </motion.h2>

          <p className="text-xs text-slate-500 font-mono mb-8 uppercase tracking-widest">
            {phase !== "reveal" ? "Préparation du tirage snob..." : "Tirage complété !"}
          </p>

          {/* BOX ANIMATION ZONE */}
          <div className="h-64 flex items-center justify-center relative w-full mb-8">
            
            {phase === "idle" && (
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 150, damping: 12 }}
                className="relative cursor-pointer"
              >
                <div className={cn(
                  "p-8 rounded-full border-2 bg-slate-900 shadow-2xl relative",
                  isEpic ? "border-fuchsia-500/40 text-fuchsia-400 shadow-fuchsia-500/25" : "border-cyan-500/40 text-cyan-400 shadow-cyan-500/20"
                )}>
                  <Gift className="w-24 h-24 animate-pulse" />
                  <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400 animate-bounce" />
                </div>
              </motion.div>
            )}

            {phase === "shaking" && (
              <motion.div
                animate={{
                  x: [0, -8, 8, -10, 10, -6, 6, -8, 8, 0],
                  y: [0, 4, -4, 5, -5, 3, -3, 4, -4, 0],
                  scale: [1, 1.05, 0.98, 1.08, 0.95, 1.05, 1],
                  rotate: [0, -5, 5, -8, 8, -4, 4, -5, 5, 0]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.4,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                {/* Shake glow aura */}
                <div className={cn(
                  "absolute inset-0 rounded-full blur-xl scale-125 opacity-70 animate-pulse",
                  isEpic ? "bg-fuchsia-500" : "bg-cyan-500"
                )} />
                <div className={cn(
                  "p-8 rounded-full border-2 bg-slate-900 shadow-2xl relative z-10",
                  isEpic ? "border-fuchsia-400 text-fuchsia-400" : "border-cyan-400 text-cyan-400"
                )}>
                  <Gift className="w-24 h-24" />
                  <HelpCircle className="absolute -top-3 -right-3 w-10 h-10 text-yellow-400 animate-spin" />
                </div>
              </motion.div>
            )}

            {phase === "reveal" && (
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Rayons de lumière tournants */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 0.6, rotate: 360 }}
                  transition={{ rotate: { repeat: Infinity, duration: 8, ease: "linear" }, scale: { duration: 0.6 } }}
                  className={cn(
                    "absolute w-64 h-64 rounded-full blur-2xl",
                    isEpic ? "bg-fuchsia-500" : "bg-cyan-500"
                  )}
                />

                {/* Loot Display Card */}
                <AnimatePresence>
                  {showContent && (
                    <motion.div
                      initial={{ scale: 0.3, y: 50, opacity: 0 }}
                      animate={{ scale: 1, y: 0, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 180, damping: 15 }}
                      className={cn(
                        "bg-gradient-to-b border-2 rounded-3xl p-6 w-72 shadow-2xl relative overflow-hidden flex flex-col items-center",
                        getRarityBg(loot.itemRarity)
                      )}
                    >
                      {/* Top star decoration */}
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        {isEpic && <Star className="w-4 h-4 text-fuchsia-400 fill-fuchsia-400" />}
                      </div>

                      {/* Loot Icon */}
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="w-24 h-24 rounded-2xl bg-slate-950/80 border border-white/10 flex items-center justify-center text-5xl shadow-inner mb-4 select-none"
                      >
                        {loot.itemIcon || "🎁"}
                      </motion.div>

                      {/* Loot Info */}
                      <span className="text-[9px] uppercase font-black tracking-widest text-slate-500 font-mono mb-1">
                        {loot.type === "sp_xp" ? "DOUBLE RESSOP" : 
                         loot.type === "skin" ? "SKIN DE BLOC" : 
                         loot.type === "trail" ? "TRAÎNÉE D'EFFET" : 
                         loot.type === "gadget" ? "GADGET TACTIQUE" : 
                         loot.type === "sp" ? "POINTS SNOB (SP)" :
                         loot.type === "xp" ? "POINTS D'EXPÉRIENCE (XP)" :
                         (loot.type as string).toUpperCase()}
                      </span>

                      <h3 className={cn(
                        "text-xl font-black font-mono tracking-tight text-center uppercase mb-2",
                        getRarityColor(loot.itemRarity)
                      )}>
                        {loot.itemName}
                      </h3>

                      {/* Display loot value details */}
                      {loot.type === "sp_xp" && (
                        <div className="flex flex-col gap-1 w-full bg-slate-950/50 p-3 rounded-xl border border-white/5 font-mono text-xs text-left mt-2">
                          <div className="flex justify-between items-center text-yellow-400 font-bold">
                            <span>REÇU :</span>
                            <span>+{loot.amount} SP 🪙</span>
                          </div>
                          <div className="flex justify-between items-center text-cyan-400 font-bold">
                            <span>REÇU :</span>
                            <span>+{loot.xpGained} XP ⚡</span>
                          </div>
                        </div>
                      )}

                      {loot.type === "xp" && (
                        <div className="text-sm font-bold font-mono text-cyan-400 flex items-center gap-1.5 mt-1 bg-cyan-950/30 px-3 py-1 rounded-full border border-cyan-500/20">
                          <Zap className="w-4 h-4 fill-cyan-400 text-cyan-400" />
                          +{loot.amount} XP pour vos quêtes
                        </div>
                      )}

                      {loot.type === "sp" && (
                        <div className="text-sm font-bold font-mono text-yellow-400 flex items-center gap-1.5 mt-1 bg-yellow-950/30 px-3 py-1 rounded-full border border-yellow-500/20">
                          <Coins className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          +{loot.amount} SP ajoutés au solde
                        </div>
                      )}

                      {loot.itemRarity && (
                        <span className={cn(
                          "text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded-full border mt-2",
                          loot.itemRarity === "Légendaire" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                          loot.itemRarity === "Épique" ? "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20" :
                          loot.itemRarity === "Rare" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" :
                          "bg-slate-500/10 text-slate-400 border-slate-500/20"
                        )}>
                          Rareté : {loot.itemRarity}
                        </span>
                      )}

                      {/* Duplicate Item Compensation notification */}
                      {loot.compensated && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 p-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[10px] font-mono font-bold rounded-lg text-center leading-normal"
                        >
                          ⚠️ Déjà possédé !<br/>
                          Converti en <span className="text-white underline">+{loot.compensationAmount} SP</span>
                        </motion.div>
                      )}

                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

          </div>

          {/* Close Button (visible only when loot is revealed) */}
          <AnimatePresence>
            {phase === "reveal" && showContent && (
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className={cn(
                  "px-8 py-3.5 font-black font-mono uppercase tracking-wider rounded-xl transition-all shadow-lg text-slate-950",
                  isEpic 
                    ? "bg-gradient-to-r from-fuchsia-500 via-purple-500 to-amber-500 hover:shadow-fuchsia-500/35 border border-fuchsia-400/30" 
                    : "bg-gradient-to-r from-cyan-400 to-emerald-500 hover:shadow-cyan-500/30 border border-cyan-400/30"
                )}
              >
                Récupérer la Récompense ✨
              </motion.button>
            )}
          </AnimatePresence>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
