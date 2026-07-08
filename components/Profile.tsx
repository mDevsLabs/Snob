"use client";
import React from "react";
import { useGameStore, PRESTIGE_RANKS } from "@/lib/store";
import { Shield, Sparkles, Zap, Trophy, Award, Lock, CheckCircle, LogIn, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useConfetti } from "@/components/ConfettiProvider";
import { sounds } from "@/lib/audio";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "Commun" | "Rare" | "Épique" | "Légendaire";
  conditionText: string;
  check: (coins: number, inventoryCount: number, level: number, prestige: number, highScore: number) => boolean;
}

const SNOB_BADGES: Badge[] = [
  {
    id: "snob_beginner",
    name: "Snob en Herbe",
    description: "Vos premiers pas dans la haute société du prestige.",
    icon: "🌱",
    rarity: "Commun",
    conditionText: "Posséder 500 SP",
    check: (coins) => coins >= 500,
  },
  {
    id: "art_lover",
    name: "Amateur d'Art",
    description: "Votre sens de l'esthétique commence à se faire remarquer.",
    icon: "🎨",
    rarity: "Commun",
    conditionText: "Posséder 3 skins",
    check: (_, inv) => inv >= 3,
  },
  {
    id: "bourgeois",
    name: "Grand Bourgeois",
    description: "La richesse s'accumule. Vos blocs sont d'un raffinement rare.",
    icon: "🎩",
    rarity: "Rare",
    conditionText: "Posséder 2 500 SP",
    check: (coins) => coins >= 2500,
  },
  {
    id: "collector",
    name: "Dandy Chic",
    description: "Une garde-robe digne de ce nom pour briller en société.",
    icon: "💼",
    rarity: "Rare",
    conditionText: "Posséder 5 skins",
    check: (_, inv) => inv >= 5,
  },
  {
    id: "aristocrat",
    name: "Aristocrate",
    description: "Votre réputation vous précède dans les salons prestigieux.",
    icon: "🏰",
    rarity: "Épique",
    conditionText: "Posséder 6 000 SP",
    check: (coins) => coins >= 6000,
  },
  {
    id: "legendary_patron",
    name: "Mécène Royal",
    description: "Soutien inconditionnel des plus beaux designs du royaume.",
    icon: "🏺",
    rarity: "Épique",
    conditionText: "Posséder 8 skins",
    check: (_, inv) => inv >= 8,
  },
  {
    id: "monarch",
    name: "Monarque Absolu",
    description: "Le trône vous revient de droit. La richesse absolue.",
    icon: "👑",
    rarity: "Légendaire",
    conditionText: "Posséder 10 000 SP",
    check: (coins) => coins >= 10000,
  },
  {
    id: "snob_master",
    name: "Maître de Collection",
    description: "Posséder l'intégralité des skins légendaires et de prestige.",
    icon: "🌌",
    rarity: "Légendaire",
    conditionText: "Posséder 11 skins",
    check: (_, inv) => inv >= 11,
  },
  {
    id: "cosmic_legend",
    name: "Légende Cosmique",
    description: "Élevé au panthéon du prestige cosmique absolu.",
    icon: "☄️",
    rarity: "Légendaire",
    conditionText: "Avoir fait 1 Prestige ou +",
    check: (_, __, ___, prestige) => prestige >= 1,
  },
  {
    id: "high_dignitary",
    name: "Haut Dignitaire",
    description: "Reconnu parmi les plus grands sages du royaume.",
    icon: "📜",
    rarity: "Épique",
    conditionText: "Atteindre le niveau 20",
    check: (_, __, level) => level >= 20,
  },
  {
    id: "score_emperor",
    name: "Empereur du Score",
    description: "Un esprit tactique hors-norme, craint de tous.",
    icon: "🔮",
    rarity: "Légendaire",
    conditionText: "Highscore classique de 10k+",
    check: (_, __, ___, ____, highScore) => highScore >= 10000,
  },
  {
    id: "celestial_collector",
    name: "Collectionneur Céleste",
    description: "Votre dressing brille de mille feux à travers la galaxie.",
    icon: "✨",
    rarity: "Épique",
    conditionText: "Posséder 9 skins ou +",
    check: (_, inv) => inv >= 9,
  }
];

export default function Profile() {
  const { level, xp, prestige, doPrestige, coins, inventory, username, avatar, bio, uid, setProfile, openAuthModal, logout, soundEnabled, toggleSound, gameHistory, classicHighScore } = useGameStore();

  const xpNeeded = level * 1000;
  const progress = Math.min(100, (xp / xpNeeded) * 100);
  const canPrestige = level >= 100 && prestige < 10;

  const currentBadge = PRESTIGE_RANKS[prestige];
  const nextBadge = prestige < 10 ? PRESTIGE_RANKS[prestige + 1] : "Max";

  const invCount = inventory?.length || 0;

  // Calculate unlocked badges count
  const unlockedBadgesCount = SNOB_BADGES.filter((b) => b.check(coins, invCount, level, prestige, classicHighScore)).length;

  const [isEditingProfile, setIsEditingProfile] = React.useState(false);
  const [editUsername, setEditUsername] = React.useState("");
  const [editAvatar, setEditAvatar] = React.useState("");
  const [editBio, setEditBio] = React.useState("");

  const handleEditProfile = () => {
    setEditUsername(username);
    setEditAvatar(avatar);
    setEditBio(bio || "");
    setIsEditingProfile(true);
  };

  const handleSaveProfile = () => {
    setProfile(editUsername || "Snob Anonyme", editAvatar || "🎩", editBio || "Je suis un snob mystérieux.");
    setIsEditingProfile(false);
  };

  const AVATARS = ["🎩", "👑", "💎", "🦁", "🐉", "🚀", "🪐", "🥂", "💸", "😎"];

  const { fire, popReward, fireAtElement } = useConfetti();
  const [celebrate, setCelebrate] = React.useState(false);

  // Ambient floating sparkles
  const [ambientSparkles, setAmbientSparkles] = React.useState<{
    id: number;
    left: number;
    top: number;
    size: number;
    delay: number;
    duration: number;
    char: string;
  }[]>([]);

  React.useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setAmbientSparkles(
        Array.from({ length: 14 }).map((_, i) => ({
          id: i,
          left: Math.random() * 100,
          top: Math.random() * 100,
          size: 4 + Math.random() * 8,
          delay: Math.random() * 6,
          duration: 6 + Math.random() * 6,
          char: ["✨", "⭐", "💫", "🌟"][i % 4],
        }))
      );
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  const handlePrestige = () => {
    if (!canPrestige) return;
    sounds.playPrestige(soundEnabled);
    fire(window.innerWidth / 2, window.innerHeight / 2, { count: 90, spread: 400 });
    popReward(`PRESTIGE ${currentBadge} → ${nextBadge} !`, "#facc15", window.innerWidth / 2, window.innerHeight / 2, "👑");
    setCelebrate(true);
    setTimeout(() => setCelebrate(false), 2200);
    doPrestige();
  };

  const getBadgeColor = (rank: string) => {
    switch (rank) {
      case "Bronze": return "text-orange-700 border-orange-700";
      case "Silver": return "text-slate-400 border-slate-400";
      case "Gold": return "text-yellow-400 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]";
      case "Platinum": return "text-cyan-200 border-cyan-200 shadow-[0_0_20px_rgba(165,243,252,0.6)]";
      case "Diamond": return "text-cyan-400 border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.8)]";
      case "Master": return "text-red-500 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.8)]";
      case "Grandmaster": return "text-fuchsia-500 border-fuchsia-500 shadow-[0_0_30px_rgba(217,70,239,0.8)]";
      case "Plasma": return "text-purple-500 border-purple-500 shadow-[0_0_40px_rgba(168,85,247,1)]";
      case "Dark Matter": return "text-slate-900 border-purple-900 bg-slate-900 shadow-[0_0_50px_rgba(0,0,0,1)] ring-2 ring-purple-500";
      case "Cosmic": return "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-yellow-500 border-transparent shadow-[0_0_60px_rgba(217,70,239,1)]";
      default: return "text-slate-600 border-slate-600";
    }
  };

  const getRarityBadgeStyle = (rarity: string) => {
    switch (rarity) {
      case "Légendaire":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.15)]";
      case "Épique":
        return "bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/30";
      case "Rare":
        return "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border border-slate-500/20";
    }
  };

  const getBadgeCardStyle = (rarity: string, unlocked: boolean) => {
    if (!unlocked) return "border-slate-800 bg-slate-950/40 opacity-50 grayscale";

    switch (rarity) {
      case "Légendaire":
        return "border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.05)] hover:shadow-[0_0_35px_rgba(245,158,11,0.15)] bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/20 hover:border-amber-400/50";
      case "Épique":
        return "border-fuchsia-500/30 shadow-[0_0_20px_rgba(217,70,239,0.05)] hover:shadow-[0_0_35px_rgba(217,70,239,0.15)] bg-gradient-to-b from-slate-900 via-slate-900 to-fuchsia-950/20 hover:border-fuchsia-400/50";
      case "Rare":
        return "border-cyan-500/25 shadow-[0_0_15px_rgba(6,182,212,0.03)] hover:shadow-[0_0_25px_rgba(6,182,212,0.1)] bg-gradient-to-b from-slate-900 via-slate-900 to-cyan-950/15 hover:border-cyan-400/50";
      default:
        return "border-slate-800 bg-slate-900 hover:border-slate-700";
    }
  };

  const chartData = (gameHistory || [])
    .slice(-10)
    .map((game) => {
      const date = new Date(game.date);
      return {
        name: `${date.getDate()}/${date.getMonth() + 1}`,
        score: game.score,
        type: game.type === "classic" ? "Classique" : game.type === "blitz" ? "Blitz" : "Campagne",
      };
    });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto h-full flex flex-col overflow-y-auto bg-slate-950 relative">
      {/* Ambient floating sparkles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
        {ambientSparkles.map((s) => (
          <motion.span
            key={s.id}
            className="absolute text-slate-400/30 select-none"
            style={{ left: `${s.left}%`, top: `${s.top}%`, fontSize: s.size }}
            initial={{ opacity: 0, y: 0, scale: 0.6 }}
            animate={{ opacity: [0, 0.6, 0], y: [0, -40, -80], scale: [0.6, 1, 0.6] }}
            transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
          >
            {s.char}
          </motion.span>
        ))}
      </div>
      {/* Header section */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <div>
          <h2 className="text-4xl font-black font-mono tracking-tighter uppercase mb-1 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            PROFIL & PRESTIGE SNOB
          </h2>
          <p className="text-slate-400 font-mono text-sm">
            Suivez votre ascension sociale, débloquez des badges prestigieux de fortune et hissez-vous au sommet.
          </p>
        </div>
        <div>
          {uid ? (
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold font-mono rounded-xl border border-slate-700 transition-colors uppercase text-sm"
            >
              <LogOut className="w-4 h-4" /> Se déconnecter
            </button>
          ) : (
            <button
              onClick={openAuthModal}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 font-bold font-mono rounded-xl border border-yellow-500/30 transition-colors uppercase text-sm"
            >
              <LogIn className="w-4 h-4" /> Connexion
            </button>
          )}
        </div>
      </div>

      {/* Grid: Stats Overview & Prestige Control */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Left Card: Main Stats (Level & XP) */}
        <div className="lg:col-span-8 bg-slate-900 border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start">
          
          <div className="flex flex-col items-center gap-4">
            {/* Circular Avatar / Level Display */}
            <div className="relative flex-shrink-0 group cursor-pointer" onClick={handleEditProfile}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className={cn(
                  "absolute inset-[-12px] rounded-full border-2 border-dashed opacity-40 transition-opacity group-hover:opacity-80",
                  getBadgeColor(currentBadge)
                )}
              />
              <div className={cn(
                "w-36 h-36 rounded-full bg-slate-950 border-2 flex items-center justify-center flex-col relative z-10 shadow-inner overflow-hidden",
                getBadgeColor(currentBadge)
              )}>
                <span className="text-5xl">{avatar}</span>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-2 font-bold bg-slate-950 px-2 rounded-full border border-slate-800 group-hover:bg-slate-800 transition-colors">LVL {level}</span>
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-900 px-4 py-1.5 rounded-full border border-white/10 z-20 whitespace-nowrap text-xs font-black font-mono uppercase flex items-center gap-1.5 text-white tracking-wider">
                <Shield className="w-3.5 h-3.5 text-yellow-400" />
                {currentBadge === "None" ? "SNOB DÉBUTANT" : `PRESTIGE : ${currentBadge}`}
              </div>
            </div>
            
            <div className="text-center mt-4 w-full cursor-pointer group" onClick={handleEditProfile}>
              <h3 className="text-xl font-bold font-mono text-white flex items-center gap-2 justify-center group-hover:text-yellow-400 transition-colors">
                {username}
              </h3>
              <p className="text-sm text-slate-400 font-mono mt-2 italic px-4 w-full break-words">
                &quot;{bio || "Je suis un snob mystérieux."}&quot;
              </p>
              <p className="text-xs text-slate-500 font-mono flex items-center gap-1 justify-center mt-2">Modifier le profil <span className="text-[10px]">✏️</span></p>
            </div>
          </div>

          {/* XP Bar & Overview Stats */}
          <div className="flex-1 w-full flex flex-col justify-between h-full py-2">
            <div>
              <h3 className="text-lg font-black font-mono text-white mb-2 uppercase tracking-tight">Expérience de Prestige</h3>
              <div className="flex justify-between text-xs mb-2 text-slate-500 font-mono">
                <span>XP ACTUEL: {Math.floor(xp).toLocaleString()}</span>
                <span>REQUIS: {xpNeeded.toLocaleString()}</span>
              </div>
              <div className="h-4.5 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5 relative p-0.5 shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
              {prestige > 0 && (
                <p className="mt-3 text-xs text-yellow-400/90 font-mono flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 animate-pulse" /> Multiplicateur d&apos;XP Permanent : <strong className="text-white">+{prestige * 10}%</strong>
                </p>
              )}
            </div>

            {/* Quick stats row */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-black font-mono block">Fortune SP</span>
                <span className="text-xl font-black font-mono text-yellow-400">{coins.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-black font-mono block">Garde-Robe</span>
                <span className="text-xl font-black font-mono text-white">{invCount} / 11 Skins</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-black font-mono block">Insignes</span>
                <span className="text-xl font-black font-mono text-cyan-400">{unlockedBadgesCount} / {SNOB_BADGES.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Prestige Action */}
        <div className="lg:col-span-4 bg-slate-900 border border-white/5 rounded-2xl p-6 md:p-8 text-center flex flex-col justify-between">
          <div>
            <div className="flex justify-center mb-4 text-yellow-500/30">
              <Trophy className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-black font-mono text-white mb-2 uppercase tracking-tight">Hisser de Rang</h3>
            <p className="text-xs text-slate-400 font-mono leading-relaxed max-w-sm mx-auto mb-6">
              Une fois au niveau 100, vous pouvez réinitialiser votre progression pour débloquer le badge prestige supérieur <strong className="text-white">{nextBadge}</strong> et augmenter votre gain d&apos;XP de 10% !
            </p>
          </div>

          <button
            onClick={handlePrestige}
            disabled={!canPrestige}
            className={cn(
              "w-full py-4 rounded-xl font-black font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all",
              canPrestige
                ? "bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 text-slate-950 hover:scale-[1.02] active:scale-98 shadow-[0_0_20px_rgba(234,179,8,0.25)] hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] border border-yellow-400/20"
                : "bg-slate-950 text-slate-600 border border-white/5 cursor-not-allowed"
            )}
          >
            <Sparkles className="w-4 h-4" />
            {canPrestige ? "Passer le Prestige" : "Requis : Niveau 100"}
          </button>
        </div>
      </div>

      {/* Recharts Progress Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        <div className="lg:col-span-8 bg-slate-900 border border-white/5 rounded-2xl p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-black font-mono text-white uppercase tracking-tight flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" /> HISTORIQUE & TENDANCE DES SCORES
              </h3>
              <p className="text-xs text-slate-400 font-mono">Visualisation en temps réel de vos 10 dernières parties.</p>
            </div>
            
            {/* Audio Toggle switch inside Settings */}
            <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-white/5">
              <span className="text-xs font-bold font-mono text-slate-400 uppercase">Effets Audio</span>
              <button
                onClick={toggleSound}
                className={cn(
                  "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                  soundEnabled ? "bg-fuchsia-600" : "bg-slate-800"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                    soundEnabled ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d946ef" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#d946ef" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} fontFamily="monospace" />
                  <YAxis stroke="#94a3b8" fontSize={11} fontFamily="monospace" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "12px", fontFamily: "monospace" }}
                    labelStyle={{ color: "#94a3b8", fontWeight: "bold" }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#d946ef" strokeWidth={3} fillOpacity={1} fill="url(#scoreColor)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 font-mono text-sm uppercase">
                Aucune partie jouée pour l&apos;instant
              </div>
            )}
          </div>
        </div>

        {/* Analytics Summary List */}
        <div className="lg:col-span-4 bg-slate-900 border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-black font-mono text-white uppercase tracking-tight mb-4">Statistiques Détaillées</h3>
            <div className="space-y-4 font-mono">
              <div className="flex justify-between items-center py-2 border-b border-white/5 text-xs">
                <span className="text-slate-400">PARTIES TOTALES</span>
                <span className="text-white font-bold">{(gameHistory || []).length}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5 text-xs">
                <span className="text-slate-400">SCORE MAXIMAL</span>
                <span className="text-emerald-400 font-bold">{Math.max(...(gameHistory || []).map(g => g.score), 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5 text-xs">
                <span className="text-slate-400">SCORE MOYEN</span>
                <span className="text-cyan-400 font-bold">
                  {Math.round((gameHistory || []).reduce((acc, g) => acc + g.score, 0) / ((gameHistory || []).length || 1)).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5 text-xs">
                <span className="text-slate-400">CLASSIQUE PLAYS</span>
                <span className="text-fuchsia-400 font-bold">{(gameHistory || []).filter(g => g.type === "classic").length}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5 text-xs">
                <span className="text-slate-400">BLITZ PLAYS</span>
                <span className="text-indigo-400 font-bold">{(gameHistory || []).filter(g => g.type === "blitz").length}</span>
              </div>
              <div className="flex justify-between items-center py-2 text-xs">
                <span className="text-slate-400">CAMPAGNE PLAYS</span>
                <span className="text-amber-400 font-bold">{(gameHistory || []).filter(g => g.type === "campaign").length}</span>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider text-center mt-4">
            Mise à jour automatique
          </div>
        </div>
      </div>

      {/* Badges & Trophies Section */}
      <div className="mb-8">
        <h3 className="text-2xl font-black font-mono tracking-tighter uppercase mb-1 flex items-center gap-2">
          <Award className="w-6 h-6 text-yellow-500" /> TROPHÉES DE PRESTIGE SNOB
        </h3>
        <p className="text-xs text-slate-400 font-mono">
          Exposez vos exploits financiers et esthétiques. Obtenez des SP ou achetez des skins pour débloquer ces marques d&apos;élite.
        </p>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SNOB_BADGES.map((badge, bIdx) => {
          const isUnlocked = badge.check(coins, invCount, level, prestige, classicHighScore);

          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: bIdx * 0.04 }}
              className={cn(
                "p-6 rounded-2xl border-2 flex flex-col relative overflow-hidden transition-all duration-300 group",
                getBadgeCardStyle(badge.rarity, isUnlocked)
              )}
            >
              {/* Badge Header Row */}
              <div className="flex justify-between items-start mb-4 relative z-10">
                <span className={cn(
                  "text-[9px] uppercase font-black px-2 py-0.5 rounded-full font-mono",
                  getRarityBadgeStyle(badge.rarity)
                )}>
                  {badge.rarity}
                </span>

                {isUnlocked ? (
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-600" />
                )}
              </div>

              {/* Big Icon */}
              <div className="flex justify-center mb-4 relative z-10">
                <div className={cn(
                  "text-5xl p-4 rounded-full transition-transform duration-500 group-hover:scale-110 flex items-center justify-center bg-slate-950/60 w-20 h-20 border border-white/5 relative",
                  isUnlocked ? "filter drop-shadow-[0_4px_12px_rgba(234,179,8,0.15)]" : "opacity-30"
                )}>
                  {badge.icon}
                  {isUnlocked && (
                    <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity group-hover:animate-pulse" />
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="text-center flex-1 flex flex-col justify-between mt-2 relative z-10">
                <div>
                  <h4 className="text-md font-black font-mono text-white mb-1 uppercase tracking-tight group-hover:text-yellow-400 transition-colors">
                    {badge.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-mono mb-4 px-1">
                    {badge.description}
                  </p>
                </div>

                {/* Condition Requirement Footer */}
                <div className={cn(
                  "mt-3 pt-3 border-t border-white/5 text-[10px] font-mono font-bold uppercase tracking-wider",
                  isUnlocked ? "text-emerald-400" : "text-slate-500"
                )}>
                  {isUnlocked ? "Insigned Acquis !" : `Requis : ${badge.conditionText}`}
                </div>
              </div>

              {/* Backglow for unlocked cards */}
              {isUnlocked && (
                <div className={cn(
                  "absolute -bottom-16 -right-16 w-32 h-32 rounded-full blur-3xl pointer-events-none transition-opacity opacity-20 group-hover:opacity-30",
                  badge.rarity === "Légendaire" ? "bg-amber-500" :
                  badge.rarity === "Épique" ? "bg-fuchsia-500" :
                  badge.rarity === "Rare" ? "bg-cyan-500" : "bg-slate-500"
                )} />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Prestige celebration overlay */}
      <AnimatePresence>
        {celebrate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex flex-col items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0, rotate: -40 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 14 }}
              className="flex flex-col items-center"
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className={cn(
                  "w-32 h-32 rounded-full flex items-center justify-center text-7xl shadow-[0_0_60px_rgba(250,204,21,0.6)] border-2",
                  getBadgeColor(nextBadge)
                )}
              >
                {avatar}
              </motion.div>
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-4xl md:text-5xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-600 uppercase tracking-tighter drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]"
              >
                PRESTIGE !
              </motion.h2>
              <p className="text-slate-300 font-mono text-sm mt-2">{currentBadge} → {nextBadge}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isEditingProfile && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl"
          >
            <h3 className="text-2xl font-black font-mono uppercase text-white mb-6">Modifier le profil</h3>
            
            <div className="mb-6">
              <label className="text-xs font-bold font-mono text-slate-400 mb-2 block uppercase">Avatar</label>
              <div className="flex flex-wrap gap-2">
                {AVATARS.map(a => (
                  <button
                    key={a}
                    onClick={() => setEditAvatar(a)}
                    className={cn(
                      "w-12 h-12 rounded-xl text-2xl flex items-center justify-center border-2 transition-all",
                      editAvatar === a ? "bg-slate-800 border-yellow-500 scale-110 shadow-lg" : "bg-slate-950 border-transparent hover:border-slate-700"
                    )}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="text-xs font-bold font-mono text-slate-400 mb-2 block uppercase">Nom de Snob</label>
              <input
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value.substring(0, 50))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white font-mono focus:border-yellow-500 focus:outline-none transition-colors"
                placeholder="Ex: Elon Musk"
              />
            </div>

            <div className="mb-8">
              <label className="text-xs font-bold font-mono text-slate-400 mb-2 block uppercase">Biographie</label>
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value.substring(0, 500))}
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white font-mono focus:border-yellow-500 focus:outline-none transition-colors resize-none"
                placeholder="Décrivez votre prestance..."
              />
              <div className="text-right text-[10px] text-slate-500 mt-1 font-mono">{editBio.length}/500</div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setIsEditingProfile(false)}
                className="flex-1 py-3 rounded-xl font-bold font-mono text-slate-400 bg-slate-800 hover:bg-slate-700 transition-colors uppercase"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex-1 py-3 rounded-xl font-bold font-mono text-slate-950 bg-yellow-400 hover:bg-yellow-300 transition-colors uppercase"
              >
                Sauvegarder
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
