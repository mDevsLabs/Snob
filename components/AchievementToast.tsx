"use client";
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

import { useGameStore } from "@/lib/store";

export default function AchievementToast() {
  const { newAchievement: achievement, dismissAchievement: onDismiss } = useGameStore();
  
  useEffect(() => {
    if (achievement) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onDismiss]);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4"
        >
          <div className="relative bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border-2 border-yellow-500/50 shadow-[0_10px_30px_rgba(234,179,8,0.2)] flex gap-4 items-center overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50"></div>
            
            <div className="text-4xl filter drop-shadow-lg">{achievement.icon}</div>
            
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold text-yellow-500 tracking-widest uppercase mb-0.5">🏅 Succès Débloqué</div>
              <div className="font-bold text-white text-sm truncate">{achievement.name}</div>
              <div className="text-xs text-slate-400 mt-0.5 leading-tight">{achievement.description}</div>
              {achievement.reward?.sp && (
                <div className="text-xs font-bold text-yellow-400 mt-1">+{achievement.reward.sp} SP</div>
              )}
            </div>
            
            <button 
              onClick={onDismiss}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
