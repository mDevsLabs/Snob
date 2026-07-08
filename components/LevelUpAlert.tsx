"use client";
import React from "react";
import { useGameStore } from "@/lib/store";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Trophy, Award } from "lucide-react";

export default function LevelUpAlert() {
  const { levelUpReward, dismissLevelUpReward, level } = useGameStore();

  if (!levelUpReward) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4"
      >
        <motion.div
          initial={{ scale: 0.8, y: 50, rotate: -2 }}
          animate={{ scale: 1, y: 0, rotate: 0 }}
          exit={{ scale: 0.8, y: 50, rotate: 2 }}
          className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-yellow-500/30 rounded-3xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(234,179,8,0.25)] relative overflow-hidden text-center"
        >
          {/* Decorative glowing particles or circles */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Animated Sparkles / Icons */}
          <div className="relative flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="p-5 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 relative"
            >
              <Award className="w-16 h-16 animate-pulse" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                className="absolute inset-0 border border-dashed border-yellow-500/20 rounded-2xl"
              />
            </motion.div>
            
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute -top-4 -right-2 text-fuchsia-400"
            >
              <Sparkles className="w-6 h-6" />
            </motion.div>
          </div>

          {/* Text Information */}
          <h2 className="text-4xl font-black font-mono tracking-tighter uppercase mb-2 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
            Niveau Supérieur !
          </h2>
          
          <p className="text-slate-400 font-mono text-sm mb-6">
            Tu as franchi un palier de prestige et pèses encore plus lourd dans le Snob Game !
          </p>

          {/* Level Badge Display */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6 flex items-center justify-between">
            <div className="text-left">
              <span className="text-xs uppercase text-slate-500 font-mono">Niveau Actuel</span>
              <div className="text-2xl font-black text-white font-mono">NIV. {level}</div>
            </div>
            <div className="h-8 w-[1px] bg-slate-800" />
            <div className="text-right">
              <span className="text-xs uppercase text-slate-500 font-mono">Bonus Reçu</span>
              <div className="text-2xl font-black text-yellow-400 font-mono">+{levelUpReward.spGained} SP</div>
            </div>
          </div>

          <p className="text-xs text-slate-500 mb-6 font-mono">
            Les SP (Snob Points) te permettent d&apos;acheter des skins d&apos;exception dans la Boutique. Continues comme ça !
          </p>

          {/* Confirm Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={dismissLevelUpReward}
            className="w-full py-4 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 text-slate-950 font-black font-mono uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/30 border border-yellow-400/20"
          >
            Récupérer et Continuer
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
