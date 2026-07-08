"use client";
import React from "react";
import { useGameStore } from "@/lib/store";
import { 
  Eye, Zap, Volume2, ShieldAlert, Check, 
  HelpCircle, Sparkles, RefreshCw, Accessibility, Layers, Flame
} from "lucide-react";
import { motion } from "motion/react";
import { sounds } from "@/lib/audio";

export default function Settings() {
  const {
    soundEnabled, toggleSound,
    reducedMotion, setReducedMotion,
    colorblindMode, setColorblindMode,
    screenShake, setScreenShake,
    particleDensity, setParticleDensity,
    gridContrast, setGridContrast,
    aimGuide, setAimGuide,
    coins, xp, level, classicHighScore
  } = useGameStore();

  const playClick = () => {
    sounds.playClick(soundEnabled);
  };

  const handleResetData = () => {
    playClick();
    if (window.confirm("⚠️ Êtes-vous sûr de vouloir réinitialiser TOUTES vos données ? Cela effacera votre score max, vos pièces (SP), votre inventaire et votre niveau ! Cette action est irréversible.")) {
      localStorage.removeItem("tetris_meta_state");
      window.location.reload();
    }
  };

  return (
    <div className="min-h-full bg-slate-950 p-6 md:p-10 text-slate-100 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        {/* En-tête */}
        <div className="mb-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 text-xs font-mono mb-4 animate-pulse">
            <Accessibility className="w-3.5 h-3.5" /> ACCESSIBILITÉ & EFFETS
          </div>
          <h2 className="text-4xl md:text-5xl font-black font-mono tracking-tighter uppercase bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400 text-transparent bg-clip-text">
            PARAMÈTRES PRESTIGE
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Personnalisez votre expérience de jeu, optimisez les performances et activez nos fonctionnalités d'ergonomie inclusives. 💎
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          
          {/* SECTION ACCESSIBILITÉ */}
          <section className="bg-slate-900/60 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden group hover:border-cyan-500/20 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-mono">Accessibilité Visuelle</h3>
                <p className="text-xs text-slate-400">Améliorez le confort visuel et la lisibilité du jeu</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Mode daltonien */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
                <div>
                  <div className="font-semibold text-slate-200 flex items-center gap-2">
                    Mode Daltonien / Symboles
                  </div>
                  <div className="text-xs text-slate-400 mt-1 max-w-md">
                    Affiche des symboles uniques sur chaque couleur de bloc pour une distinction instantanée sans dépendre des nuances.
                  </div>
                </div>
                <div className="flex gap-2">
                  {(["none", "symbols", "high-contrast"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => { playClick(); setColorblindMode(mode); }}
                      className={`px-3 py-2 rounded-xl text-xs font-bold font-mono border transition-all ${
                        colorblindMode === mode
                          ? "bg-cyan-500 border-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                          : "bg-slate-950 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                      }`}
                    >
                      {mode === "none" && "DÉSACTIVÉ"}
                      {mode === "symbols" && "SYMBOLES 🌟"}
                      {mode === "high-contrast" && "CONTRASTE 🎨"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contraste de la grille */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
                <div>
                  <div className="font-semibold text-slate-200">Contraste de la Grille</div>
                  <div className="text-xs text-slate-400 mt-1 max-w-md">
                    Rend le fond de la grille plus sombre et marque davantage le contour des cases vides pour les rendre plus distinctes.
                  </div>
                </div>
                <div className="flex gap-2">
                  {(["normal", "high"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => { playClick(); setGridContrast(mode); }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold font-mono border transition-all ${
                        gridContrast === mode
                          ? "bg-cyan-500 border-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                          : "bg-slate-950 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                      }`}
                    >
                      {mode === "normal" && "NORMAL"}
                      {mode === "high" && "ÉLEVÉ 🖤"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ligne de visée / Aim guide */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-slate-200">Guide de Visée Dynamique</div>
                  <div className="text-xs text-slate-400 mt-1 max-w-md">
                    Affiche des repères fins pour visualiser précisément quelles lignes et colonnes seront impactées par votre bloc.
                  </div>
                </div>
                <button
                  onClick={() => { playClick(); setAimGuide(!aimGuide); }}
                  className={`w-14 h-7 rounded-full transition-all duration-300 relative p-1 cursor-pointer ${
                    aimGuide ? "bg-cyan-500" : "bg-slate-950 border border-white/10"
                  }`}
                >
                  <motion.div 
                    layout
                    className={`w-5 h-5 rounded-full shadow-md ${aimGuide ? "bg-slate-950" : "bg-slate-500"}`}
                    animate={{ x: aimGuide ? 26 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

            </div>
          </section>

          {/* SECTION EFFETS ET ANIMATIONS */}
          <section className="bg-slate-900/60 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden group hover:border-fuchsia-500/20 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-fuchsia-500/10 rounded-xl text-fuchsia-400 border border-fuchsia-500/20">
                <Zap className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-mono">Effets & Animations</h3>
                <p className="text-xs text-slate-400">Réglez la fluidité visuelle et les performances</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Animations réduites (Reduced Motion) */}
              <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-5">
                <div>
                  <div className="font-semibold text-slate-200">Mouvements Réduits (Reduced Motion)</div>
                  <div className="text-xs text-slate-400 mt-1 max-w-md">
                    Désactive ou adoucit les mouvements rapides, les zooms de blocs et les rotations énergiques pour éviter la fatigue visuelle.
                  </div>
                </div>
                <button
                  onClick={() => { playClick(); setReducedMotion(!reducedMotion); }}
                  className={`w-14 h-7 rounded-full transition-all duration-300 relative p-1 cursor-pointer ${
                    reducedMotion ? "bg-fuchsia-500" : "bg-slate-950 border border-white/10"
                  }`}
                >
                  <motion.div 
                    layout
                    className={`w-5 h-5 rounded-full shadow-md ${reducedMotion ? "bg-slate-950" : "bg-slate-500"}`}
                    animate={{ x: reducedMotion ? 26 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              {/* Secousses d'écran (Screen Shake) */}
              <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-5">
                <div>
                  <div className="font-semibold text-slate-200">Secousses d'Écran</div>
                  <div className="text-xs text-slate-400 mt-1 max-w-md">
                    Ajoute un effet de tremblement dramatique de l'écran lors des éliminations multiples (Combos) pour un effet d'impact maximal.
                  </div>
                </div>
                <button
                  onClick={() => { playClick(); setScreenShake(!screenShake); }}
                  className={`w-14 h-7 rounded-full transition-all duration-300 relative p-1 cursor-pointer ${
                    screenShake ? "bg-fuchsia-500" : "bg-slate-950 border border-white/10"
                  }`}
                >
                  <motion.div 
                    layout
                    className={`w-5 h-5 rounded-full shadow-md ${screenShake ? "bg-slate-950" : "bg-slate-500"}`}
                    animate={{ x: screenShake ? 26 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              {/* Densité des particules */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-slate-200">Densité des Particules</div>
                  <div className="text-xs text-slate-400 mt-1 max-w-md">
                    Détermine la quantité d'étincelles ou d'effets magiques de traînées générés par vos blocs en mouvement.
                  </div>
                </div>
                <div className="flex gap-2">
                  {(["none", "low", "medium", "high"] as const).map((density) => (
                    <button
                      key={density}
                      onClick={() => { playClick(); setParticleDensity(density); }}
                      className={`px-3 py-2 rounded-xl text-xs font-bold font-mono border transition-all ${
                        particleDensity === density
                          ? "bg-fuchsia-500 border-fuchsia-400 text-slate-950 shadow-[0_0_15px_rgba(217,70,239,0.3)]"
                          : "bg-slate-950 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                      }`}
                    >
                      {density === "none" && "AUCUNE"}
                      {density === "low" && "FAIBLE"}
                      {density === "medium" && "MOYENNE"}
                      {density === "high" && "ÉLEVÉE 🔥"}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </section>

          {/* AUDIO PREFERENCES */}
          <section className="bg-slate-900/60 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden group hover:border-yellow-500/20 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-yellow-500/10 rounded-xl text-yellow-400 border border-yellow-500/20">
                <Volume2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-mono">Préférences Audio</h3>
                <p className="text-xs text-slate-400">Contrôlez l'ambiance sonore du jeu</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold text-slate-200">Effets Sonores (SFX)</div>
                <div className="text-xs text-slate-400 mt-1 max-w-md">
                  Active les bruits de placement de blocs, de destruction de lignes, et de validation de quêtes.
                </div>
              </div>
              <button
                onClick={() => { playClick(); toggleSound(); }}
                className={`w-14 h-7 rounded-full transition-all duration-300 relative p-1 cursor-pointer ${
                  soundEnabled ? "bg-yellow-500" : "bg-slate-950 border border-white/10"
                }`}
              >
                <motion.div 
                  layout
                  className={`w-5 h-5 rounded-full shadow-md ${soundEnabled ? "bg-slate-950" : "bg-slate-500"}`}
                  animate={{ x: soundEnabled ? 26 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          </section>

          {/* GESTION DE COMPTE ET DONNÉES */}
          <section className="bg-red-950/20 border border-red-500/10 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-500/10 rounded-xl text-red-400 border border-red-500/20">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-mono text-red-400">Zone de Danger</h3>
                <p className="text-xs text-red-500/80">Opérations destructrices irréversibles</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="font-semibold text-slate-200">Réinitialiser le Profil de Prestige</div>
                <div className="text-xs text-slate-400 mt-1 max-w-md">
                  Efface complètement votre progression, y compris vos pièces de prestige (SP), vos records de scores et vos badges débloqués.
                </div>
              </div>
              <button
                onClick={handleResetData}
                className="px-5 py-3 bg-red-650/20 hover:bg-red-500/20 border border-red-500/35 text-red-400 font-bold rounded-xl text-xs font-mono tracking-wider transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4 animate-spin-slow" /> RÉINITIALISER LE JEU
              </button>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
