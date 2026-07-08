"use client";
import React, { useState } from "react";
import { useGameStore } from "@/lib/store";
import { Star, Lock, Play } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import CampaignGame from "./CampaignGame";

// Generate 100 levels
const CAMPAIGN_LEVELS = Array.from({ length: 100 }, (_, i) => {
  const type = i % 3 === 0 ? "lines" : i % 3 === 1 ? "score" : "survive";
  const target = type === "lines" ? (i + 1) * 5 : type === "score" ? (i + 1) * 1000 : (Math.floor(i / 10) + 1) * 30;
  return {
    id: i + 1,
    type,
    target,
    objective: 
      type === "lines" ? `Détruire ${target} lignes` :
      type === "score" ? `Atteindre ${target} points` :
      `Survivre ${target} tours`,
  };
});

export default function Campaign() {
  const { campaignStars, saveCampaignResult } = useGameStore();
  const [activeLevel, setActiveLevel] = useState<number | null>(null);
  
  // Highest unlocked level is the first level with 0 stars, plus one.
  // campaignStars initially has {} so highestUnlocked is 1
  const completedLevels = Object.keys(campaignStars).map(Number).filter(id => campaignStars[id] > 0);
  const highestUnlocked = completedLevels.length > 0 ? Math.max(...completedLevels) + 1 : 1;

  if (activeLevel !== null) {
    const level = CAMPAIGN_LEVELS.find(l => l.id === activeLevel);
    if (level) {
      return (
        <CampaignGame 
          levelId={level.id}
          type={level.type}
          target={level.target}
          objectiveText={level.objective}
          onBack={() => setActiveLevel(null)}
        />
      );
    }
  }

  return (
    <div className="h-full flex flex-col p-8 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-4xl font-black font-mono tracking-tighter uppercase mb-1">
          CAMPAGNE
        </h2>
        <p className="text-slate-400 font-mono">Complétez des défis pour progresser et gagner des récompenses !</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 max-w-6xl">
        {CAMPAIGN_LEVELS.map((level, idx) => {
          const isUnlocked = level.id <= highestUnlocked;
          const stars = campaignStars[level.id] || 0;
          
          return (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.02 }}
            >
              <div
                className={cn(
                  "relative aspect-square rounded-2xl border-2 flex flex-col items-center justify-center p-4 transition-all duration-300 group",
                  isUnlocked 
                    ? "bg-slate-900 border-fuchsia-500/30 hover:border-fuchsia-400 hover:shadow-[0_0_20px_rgba(217,70,239,0.3)] cursor-pointer" 
                    : "bg-slate-950 border-white/5 opacity-50 cursor-not-allowed"
                )}
                onClick={() => isUnlocked && setActiveLevel(level.id)}
              >
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 to-cyan-500/10 rounded-xl transition-opacity",
                  isUnlocked ? "opacity-100 group-hover:opacity-100" : "opacity-0"
                )} />
                
                <h3 className={cn(
                  "text-3xl font-black font-mono mb-2 z-10",
                  isUnlocked ? "text-white" : "text-slate-600"
                )}>
                  {level.id}
                </h3>
                
                {isUnlocked ? (
                  <div className="flex gap-1 z-10">
                    {[1, 2, 3].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "w-4 h-4 transition-all",
                          star <= stars ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]" : "text-slate-700"
                        )}
                      />
                    ))}
                  </div>
                ) : (
                  <Lock className="w-6 h-6 text-slate-700 z-10" />
                )}

                {/* Level Type Icon */}
                <div className="absolute top-2 right-2 opacity-30 group-hover:opacity-100 transition-opacity">
                  {level.type === 'lines' && <span className="text-xs font-mono font-bold text-fuchsia-400">LIGNES</span>}
                  {level.type === 'score' && <span className="text-xs font-mono font-bold text-cyan-400">SCORE</span>}
                  {level.type === 'survive' && <span className="text-xs font-mono font-bold text-yellow-400">SURVIE</span>}
                </div>

                {isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 rounded-xl backdrop-blur-sm z-20">
                    <Play className="w-10 h-10 text-fuchsia-400 ml-1" />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
