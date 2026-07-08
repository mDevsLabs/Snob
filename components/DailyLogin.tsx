"use client";
import React from "react";
import { useGameStore } from "@/lib/store";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, CheckCircle2, Flame, Gift, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useConfetti } from "@/components/ConfettiProvider";
import { sounds } from "@/lib/audio";

export default function DailyLogin() {
  const { showLoginModal, streak, claimDaily, streakBroken, soundEnabled } = useGameStore();
  const { fireAtElement, popRewardAtElement } = useConfetti();
  const claimBtnRef = React.useRef<HTMLButtonElement>(null);

  if (!showLoginModal) return null;

  const handleClaim = () => {
    const newStreak = Math.min(streak + 1, 7);
    const reward = newStreak === 7 ? 500 : newStreak * 50;
    sounds.playReward(soundEnabled);
    fireAtElement(claimBtnRef.current, { count: 50, colors: ["#facc15", "#fbbf24", "#fcd34d", "#f59e0b", "#22c55e", "#d946ef", "#22d3ee"] });
    popRewardAtElement(`+${reward} SP`, "#facc15", claimBtnRef.current, "🪙");
    claimDaily();
  };

  const days = [1, 2, 3, 4, 5, 6, 7];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-3xl w-full shadow-2xl relative overflow-hidden"
        >
          {/* Ambient background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-cyan-500/10 blur-[100px] pointer-events-none" />

          <div className="text-center mb-8 relative z-10">
            <h2 className="text-3xl font-bold font-mono text-white mb-2">Bonus de Connexion</h2>
            {streakBroken ? (
              <p className="text-red-400 flex items-center justify-center gap-2">
                <XCircle className="w-5 h-5" />
                Tu as raté un jour ! Ton streak retombe à zéro.
              </p>
            ) : (
              <p className="text-slate-400">
                Yo, ton coffre t&apos;attend, perds pas ton streak ! 🔥
              </p>
            )}
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-7 gap-4 mb-10 relative z-10">
            {days.map((day) => {
              const isPast = day <= streak && !streakBroken;
              const isToday = day === (streakBroken ? 1 : streak + 1);
              const isFuture = day > (streakBroken ? 1 : streak + 1);
              const isEpic = day === 7;

              return (
                <div
                  key={day}
                  className={cn(
                    "flex flex-col items-center p-4 rounded-2xl border-2 transition-all relative",
                    isPast ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400" :
                    isToday ? "bg-fuchsia-500/20 border-fuchsia-500 text-fuchsia-400 scale-110 shadow-[0_0_30px_rgba(217,70,239,0.3)]" :
                    "bg-slate-950 border-white/5 text-slate-600",
                    isEpic && isFuture && "border-yellow-500/30 text-yellow-500/50"
                  )}
                >
                  <span className="text-xs font-bold uppercase mb-2">Jour {day}</span>
                  
                  {isEpic ? (
                    <Gift className={cn("w-8 h-8 mb-2", isPast || isToday ? "text-yellow-400" : "")} />
                  ) : (
                    <div className="text-xl font-bold mb-2 font-mono">
                      {isPast ? <CheckCircle2 className="w-8 h-8" /> : (day * 50)}
                    </div>
                  )}

                  {!isEpic && !isPast && <span className="text-[10px] uppercase tracking-wider text-slate-500">Coins</span>}
                  {isEpic && <span className="text-[10px] uppercase tracking-wider font-bold">Coffre Épique</span>}

                  {streakBroken && isPast && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="w-full h-1 bg-red-500 rotate-45 animate-break shadow-[0_0_10px_red]" />
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-center relative z-10">
            <button
              ref={claimBtnRef}
              onClick={handleClaim}
              className="px-8 py-4 bg-gradient-to-r from-fuchsia-600 to-cyan-600 hover:from-fuchsia-500 hover:to-cyan-500 text-white font-bold rounded-xl text-lg uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-xl shadow-fuchsia-500/20"
            >
              Récupérer ma récompense
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
