import React, { useMemo } from "react";
import { useGameStore } from "@/lib/store";
import { Lock, Crown, Coins, Star, Zap, RefreshCw, Sparkles, Palette, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { sounds } from "@/lib/audio";
import { useConfetti } from "@/components/ConfettiProvider";

const SNOB_PASS_TIERS = [
  { tier: 1, xpRequired: 200, rewardType: "sp", rewardAmount: 200, rewardId: "", name: "200 SP", icon: Coins },
  { tier: 2, xpRequired: 400, rewardType: "xp", rewardAmount: 300, rewardId: "", name: "300 XP", icon: Star },
  { tier: 3, xpRequired: 600, rewardType: "item", rewardAmount: 1, rewardId: "gadget_time_freeze", name: "1x Gel Temporel", icon: Zap },
  { tier: 4, xpRequired: 800, rewardType: "sp", rewardAmount: 300, rewardId: "", name: "300 SP", icon: Coins },
  { tier: 5, xpRequired: 1000, rewardType: "item", rewardAmount: 2, rewardId: "gadget_neon_blaster", name: "2x Blaster Néon", icon: RefreshCw },
  { tier: 6, xpRequired: 1200, rewardType: "xp", rewardAmount: 500, rewardId: "", name: "500 XP", icon: Star },
  { tier: 7, xpRequired: 1400, rewardType: "item", rewardAmount: 2, rewardId: "gadget_time_freeze", name: "2x Gel Temporel", icon: Zap },
  { tier: 8, xpRequired: 1600, rewardType: "sp", rewardAmount: 400, rewardId: "", name: "400 SP", icon: Coins },
  { tier: 9, xpRequired: 1800, rewardType: "item", rewardAmount: 1, rewardId: "trail_matrix", name: "Traînée Néon", icon: Sparkles },
  { tier: 10, xpRequired: 2000, rewardType: "xp", rewardAmount: 800, rewardId: "", name: "800 XP", icon: Star },
  { tier: 11, xpRequired: 2200, rewardType: "sp", rewardAmount: 500, rewardId: "", name: "500 SP", icon: Coins },
  { tier: 12, xpRequired: 2400, rewardType: "item", rewardAmount: 2, rewardId: "gadget_time_freeze", name: "2x Gel Temporel", icon: Zap },
  { tier: 13, xpRequired: 2600, rewardType: "xp", rewardAmount: 1000, rewardId: "", name: "1000 XP", icon: Star },
  { tier: 14, xpRequired: 2800, rewardType: "sp", rewardAmount: 600, rewardId: "", name: "600 SP", icon: Coins },
  { tier: 15, xpRequired: 3000, rewardType: "item", rewardAmount: 3, rewardId: "gadget_neon_blaster", name: "3x Blaster Néon", icon: RefreshCw },
  { tier: 16, xpRequired: 3200, rewardType: "xp", rewardAmount: 1200, rewardId: "", name: "1200 XP", icon: Star },
  { tier: 17, xpRequired: 3400, rewardType: "sp", rewardAmount: 700, rewardId: "", name: "700 SP", icon: Coins },
  { tier: 18, xpRequired: 3600, rewardType: "xp", rewardAmount: 1500, rewardId: "", name: "1500 XP", icon: Star },
  { tier: 19, xpRequired: 3800, rewardType: "sp", rewardAmount: 1000, rewardId: "", name: "1000 SP", icon: Coins },
  { tier: 20, xpRequired: 4000, rewardType: "item", rewardAmount: 1, rewardId: "skin_neon_cyber", name: "Skin Néon", icon: Palette },
];

export default function SnobPass() {
  const { 
    coins, 
    level, 
    xp, 
    prestige, 
    snobPassUnlocked, 
    buySnobPass, 
    claimedSnobPassTiers, 
    claimSnobPassReward,
    addXp,
    soundEnabled
  } = useGameStore();

  const { fireAtElement, popRewardAtElement } = useConfetti();
  const confetti = useConfetti();

  const cumulativeXp = useMemo(() => {
    if (prestige && prestige > 0) return 999999;
    // level cumulative calculation: 
    // l1->0, l2->100, l3->300, l4->600 ... 
    // sum is (level - 1) * level / 2 * 100 + current_xp
    return ((level - 1) * level) / 2 * 100 + xp;
  }, [level, xp, prestige]);

  const handleBuyPass = () => {
    sounds.playClick(soundEnabled);
    if (buySnobPass()) {
      sounds.playClear(soundEnabled, 4);
      confetti.fireAtElement(null, { count: 50, colors: ["#a855f7", "#ec4899", "#06b6d4", "#f59e0b", "#8b5cf6"] });
    }
  };

  const handleClaim = (tierObj: typeof SNOB_PASS_TIERS[0], el?: HTMLElement | null) => {
    sounds.playClick(soundEnabled);
    const success = claimSnobPassReward(tierObj.tier, tierObj.rewardType, tierObj.rewardId, tierObj.rewardAmount);
    if (success) {
      if (tierObj.rewardType === "xp") {
        addXp(tierObj.rewardAmount);
      }
      sounds.playReward(soundEnabled);
      fireAtElement(el ?? null, {
        count: 44,
        colors: tierObj.rewardType === "sp" ? ["#facc15", "#fbbf24", "#fcd34d", "#f59e0b"] :
               tierObj.rewardType === "xp" ? ["#22d3ee", "#67e8f9", "#a78bfa", "#22d3ee"] :
               ["#d946ef", "#f0abfc", "#e879f9", "#c026d3"],
      });
      const label = tierObj.rewardType === "sp"
        ? `+${tierObj.rewardAmount} SP`
        : tierObj.rewardType === "xp"
        ? `+${tierObj.rewardAmount} XP`
        : `+${tierObj.rewardAmount} ${tierObj.name}`;
      const color = tierObj.rewardType === "sp" ? "#facc15" : tierObj.rewardType === "xp" ? "#22d3ee" : "#d946ef";
      popRewardAtElement(label, color, el ?? null, tierObj.rewardType === "item" ? "🎁" : undefined);
    }
  };

  return (
    <div className="h-full w-full p-8 overflow-y-auto">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-full text-fuchsia-400 text-xs font-bold font-mono tracking-widest uppercase mb-4">
            <Sparkles className="w-4 h-4" /> Saison 1 : Nuit Cyber
          </div>
          <h2 className="text-4xl md:text-5xl font-black font-mono tracking-tighter uppercase mb-2 bg-gradient-to-r from-fuchsia-400 via-purple-300 to-cyan-400 text-transparent bg-clip-text flex items-center gap-3">
            <Crown className="w-10 h-10 text-fuchsia-400" /> SNOB PASS
          </h2>
          <p className="text-slate-400 max-w-lg">
            Débloquez des récompenses exclusives à chaque palier. Plus vous gagnez d&apos;XP, plus vous avancez dans le Snob Pass !
          </p>
        </div>

        {!snobPassUnlocked ? (
          <div className="flex flex-col items-end gap-2 bg-slate-900/80 p-6 rounded-2xl border border-white/10 shadow-xl backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/20 blur-[50px] pointer-events-none" />
            <div className="text-sm text-slate-400 font-mono mb-1">PRIX DU PASS</div>
            <div className="text-3xl font-black font-mono flex items-center gap-2 text-yellow-500 mb-4 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">
              1500 <span className="text-xs bg-yellow-500 text-slate-950 px-2 py-1 rounded-md">SP</span>
            </div>
            <button
              onClick={handleBuyPass}
              disabled={coins < 1500}
              className="px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-full font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(217,70,239,0.4)] flex items-center gap-2"
            >
              <Crown className="w-5 h-5" />
              DÉBLOQUER
            </button>
            {coins < 1500 && (
              <div className="text-xs text-red-400 mt-2 font-mono">Fonds insuffisants</div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-end gap-2 bg-fuchsia-950/30 p-6 rounded-2xl border border-fuchsia-500/30 shadow-[0_0_30px_rgba(217,70,239,0.15)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/20 blur-[50px] pointer-events-none" />
            <div className="text-sm text-fuchsia-300 font-mono mb-1 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-fuchsia-400" /> PASS ACTIF
            </div>
            <div className="text-2xl font-black font-mono text-white mt-1">
              SAISON 1
            </div>
            <div className="text-xs text-slate-400 mt-2 font-mono uppercase tracking-widest">Toutes les récompenses sont débloquables</div>
          </div>
        )}
      </div>

      {/* Progress Track */}
      <div className="bg-slate-900/60 border border-white/5 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden shadow-2xl">
        <div className="flex flex-col gap-8 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold font-mono tracking-tight flex items-center gap-2">
              <Zap className="w-6 h-6 text-cyan-400" /> VOTRE PROGRESSION
            </h3>
            <div className="text-right">
              <div className="text-sm text-slate-400 font-mono uppercase">XP TOTAL :</div>
              <div className="text-2xl font-black font-mono text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                {cumulativeXp.toLocaleString()} XP
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {SNOB_PASS_TIERS.map((tier) => {
              const isUnlocked = cumulativeXp >= tier.xpRequired;
              const isClaimed = claimedSnobPassTiers.includes(tier.tier);
              const canClaim = isUnlocked && snobPassUnlocked && !isClaimed;
              const Icon = tier.icon;

              return (
                <div 
                  key={tier.tier}
                  className={cn(
                    "p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group",
                    isClaimed ? "bg-slate-900/40 border-green-500/20" :
                    canClaim ? "bg-fuchsia-950/40 border-fuchsia-500/50 shadow-[0_0_20px_rgba(217,70,239,0.15)] hover:border-fuchsia-400" :
                    isUnlocked && !snobPassUnlocked ? "bg-slate-800/80 border-slate-600 shadow-md" :
                    "bg-slate-950/50 border-white/5 opacity-80"
                  )}
                >
                  {/* Background effects */}
                  {canClaim && (
                    <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 to-cyan-500/10 pointer-events-none" />
                  )}

                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-slate-950/80 px-3 py-1 rounded-lg border border-white/10 font-mono text-xs font-bold text-slate-300">
                      PALIER {tier.tier}
                    </div>
                    {isClaimed && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                    {!isClaimed && !isUnlocked && <Lock className="w-4 h-4 text-slate-600" />}
                  </div>

                  <div className="flex flex-col items-center justify-center py-6 gap-3">
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center transform transition-transform duration-300",
                      canClaim && "scale-110 group-hover:rotate-12",
                      tier.rewardType === "sp" ? "bg-yellow-500/20 text-yellow-500" :
                      tier.rewardType === "xp" ? "bg-cyan-500/20 text-cyan-400" :
                      "bg-fuchsia-500/20 text-fuchsia-400"
                    )}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg leading-tight">{tier.name}</div>
                      <div className="text-xs text-slate-500 font-mono mt-1">{tier.xpRequired.toLocaleString()} XP requis</div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-center">
                    {isClaimed ? (
                      <div className="w-full py-2 bg-green-500/10 text-green-500 text-center font-bold text-xs rounded-xl border border-green-500/20 font-mono">
                        RÉCUPÉRÉ
                      </div>
                    ) : canClaim ? (
                      <button
                        onClick={(e) => handleClaim(tier, e.currentTarget)}
                        className="w-full py-2 bg-fuchsia-500 hover:bg-fuchsia-400 text-white text-center font-bold text-xs rounded-xl transition-all shadow-[0_0_15px_rgba(217,70,239,0.3)] hover:scale-[1.02] active:scale-[0.98] font-mono"
                      >
                        RÉCUPÉRER
                      </button>
                    ) : isUnlocked && !snobPassUnlocked ? (
                      <div className="w-full py-2 bg-slate-800 text-slate-400 text-center font-bold text-xs rounded-xl border border-slate-700 font-mono flex items-center justify-center gap-2">
                        <Lock className="w-3 h-3" /> PASS REQUIS
                      </div>
                    ) : (
                      <div className="w-full py-2 bg-slate-950 text-slate-600 text-center font-bold text-xs rounded-xl border border-white/5 font-mono">
                        VERROUILLÉ
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
