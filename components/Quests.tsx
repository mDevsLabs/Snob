"use client";
import React from "react";
import { useGameStore, Quest } from "@/lib/store";
import { RefreshCw, Star, CheckCircle2, Award, Coins } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useConfetti } from "@/components/ConfettiProvider";
import { sounds } from "@/lib/audio";

export default function Quests() {
  const { dailyQuests, weeklyQuests, rerollQuest, coins, claimQuestReward, soundEnabled } = useGameStore();
  const confetti = useConfetti();

  const handleClaimQuest = (quest: Quest) => {
    if (claimQuestReward(quest.id)) {
      sounds.playReward(soundEnabled);
      confetti.fireAtElement(null, { count: 30, colors: ["#facc15", "#d946ef", "#22d3ee", "#34d399"] });
    }
  };

  const renderQuest = (quest: Quest, isDaily: boolean) => {
    const progress = Math.min(100, (quest.progress / quest.target) * 100);
    const isClaimable = quest.completed && !isDaily;
    
    return (
      <div key={quest.id} className={cn(
        "bg-slate-900 p-6 rounded-2xl border transition-all relative overflow-hidden",
        quest.completed ? "border-green-500/30" : "border-white/5"
      )}>
        {quest.completed && (
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[50px] pointer-events-none" />
        )}
        
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div>
            <h3 className="font-bold text-lg text-white mb-1">{quest.description}</h3>
            <p className="text-xs text-slate-400 font-mono uppercase tracking-widest">
              Progression: {quest.progress} / {quest.target}
            </p>
          </div>
          
          {quest.completed && !isDaily ? (
            <button
              onClick={() => handleClaimQuest(quest)}
              className={cn(
                "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-lg"
              )}
            >
              <Award className="w-4 h-4" /> Récupérer
            </button>
          ) : quest.completed && isDaily ? (
            <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full flex items-center gap-2 text-sm font-bold">
              <CheckCircle2 className="w-4 h-4" /> Terminé
            </div>
          ) : !quest.isWeekly && !isDaily ? (
            <button
              onClick={() => rerollQuest(quest.id)}
              disabled={coins < 50}
              className="text-slate-500 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
              title="Changer de quête (50 SP)"
            >
              <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            </button>
          ) : null}
        </div>

        <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden mb-4 relative z-10">
          <motion.div 
            className={cn("h-full", quest.completed ? "bg-green-500" : "bg-cyan-500")}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="flex gap-4 relative z-10 font-mono text-xs">
          <div className="flex items-center gap-1.5 font-bold text-yellow-400 bg-yellow-500/10 px-3 py-1 rounded-lg border border-yellow-500/10">
            <span className="w-3.5 h-3.5 rounded-full bg-yellow-500 text-slate-950 flex items-center justify-center font-black text-[8px] leading-none">SP</span>
            {quest.rewardCoins} SP
          </div>
          <div className="flex items-center gap-1.5 font-bold text-fuchsia-400 bg-fuchsia-500/10 px-3 py-1 rounded-lg border border-fuchsia-500/10">
            <Star className="w-3.5 h-3.5" /> {quest.rewardXp} XP
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 h-full flex flex-col overflow-y-auto bg-slate-950">
      <div className="mb-12">
        <h2 className="text-4xl font-black font-mono tracking-tighter uppercase mb-1 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          QUÊTES DE PRESTIGE
        </h2>
        <p className="text-slate-400 font-mono text-sm">
          Complétez des objectifs exclusifs pour accumuler des <span className="text-yellow-400 font-bold">SP (Snob Points)</span> et de l&apos;XP de profil.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Daily Quests */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-2 h-8 bg-cyan-500 rounded-full inline-block" />
              Quotidiennes
            </h3>
            <span className="text-xs text-slate-500 uppercase tracking-widest font-mono">Reset à Minuit</span>
          </div>
          
          <div className="space-y-4">
            {dailyQuests?.map(q => renderQuest(q, true))}
          </div>
        </div>

        {/* Weekly Quests */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-2 h-8 bg-fuchsia-500 rounded-full inline-block" />
              Hebdomadaires
            </h3>
            <span className="text-xs text-fuchsia-500 uppercase tracking-widest font-mono font-bold">Quêtes Difficiles</span>
          </div>
          
          <div className="space-y-4">
            {weeklyQuests?.map(q => renderQuest(q, false))}
          </div>
        </div>
      </div>
    </div>
  );
}
