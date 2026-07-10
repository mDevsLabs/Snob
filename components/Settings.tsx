"use client";
import React, { useState } from "react";
import { useGameStore } from "@/lib/store";
import {
  Eye, Zap, Volume2, ShieldAlert, Check,
  HelpCircle, Sparkles, RefreshCw, Accessibility, Layers, Flame,
  User, Mail, LogOut, Key, ChevronRight, Shield
} from "lucide-react";
import { motion } from "motion/react";
import { sounds } from "@/lib/audio";

// Toggle switch component for reuse
const Toggle = ({
  value,
  onChange,
  color = "fuchsia",
}: {
  value: boolean;
  onChange: () => void;
  color?: string;
}) => {
  const bgActive =
    color === "cyan"
      ? "bg-cyan-500"
      : color === "yellow"
      ? "bg-yellow-500"
      : color === "green"
      ? "bg-emerald-500"
      : "bg-fuchsia-500";

  return (
    <button
      onClick={onChange}
      className={`w-14 h-7 rounded-full transition-all duration-300 relative p-1 cursor-pointer flex-shrink-0 ${
        value ? bgActive : "bg-slate-800 border border-white/10"
      }`}
    >
      <motion.div
        layout
        className={`w-5 h-5 rounded-full shadow-md ${value ? "bg-slate-950" : "bg-slate-500"}`}
        animate={{ x: value ? 26 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
};

export default function Settings() {
  const {
    soundEnabled, toggleSound,
    reducedMotion, setReducedMotion,
    colorblindMode, setColorblindMode,
    screenShake, setScreenShake,
    particleDensity, setParticleDensity,
    gridContrast, setGridContrast,
    aimGuide, setAimGuide,
    coins, xp, level,
    username, email, uid, avatar,
    logout, openAuthModal,
  } = useGameStore();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  const playClick = () => sounds.playClick(soundEnabled);

  const handleResetData = () => {
    playClick();
    if (resetConfirm) {
      localStorage.removeItem("tetris_meta_state");
      window.location.reload();
    } else {
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 4000);
    }
  };

  const handleLogout = async () => {
    if (showLogoutConfirm) {
      await logout();
      setShowLogoutConfirm(false);
    } else {
      setShowLogoutConfirm(true);
      setTimeout(() => setShowLogoutConfirm(false), 4000);
    }
  };

  return (
    <div className="min-h-full bg-slate-950 p-6 md:p-10 text-slate-100 flex flex-col items-center">
      <div className="w-full max-w-3xl">

        {/* En-tête */}
        <div className="mb-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 text-xs font-mono mb-4 animate-pulse">
            <Accessibility className="w-3.5 h-3.5" /> PARAMÈTRES PRESTIGE
          </div>
          <h2 className="text-4xl md:text-5xl font-black font-mono tracking-tighter uppercase bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400 text-transparent bg-clip-text">
            PARAMÈTRES
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Personnalisez votre expérience. 💎
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">

          {/* ── SECTION COMPTE ──────────────────────────────────── */}
          <section className="bg-slate-900/60 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden group hover:border-yellow-500/20 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-yellow-500/10 rounded-xl text-yellow-400 border border-yellow-500/20">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-mono">Mon Compte</h3>
                <p className="text-xs text-slate-400">Profil et connexion</p>
              </div>
            </div>

            {uid ? (
              <div className="space-y-4">
                {/* Profil affiché */}
                <div className="flex items-center gap-4 bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-3xl flex-shrink-0">
                    {avatar || '🎩'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-white truncate">{username || 'Snob Anonyme'}</div>
                    {email && (
                      <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3" /> {email}
                      </div>
                    )}
                    <div className="text-xs text-slate-500 mt-0.5">
                      Niv. {level} · {coins} SP
                    </div>
                  </div>
                  <div title="Compte vérifié">
                    <Shield className="w-5 h-5 text-green-400 flex-shrink-0" />
                  </div>
                </div>

                {/* Déconnexion */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
                  <div>
                    <div className="font-semibold text-slate-200 flex items-center gap-2">
                      <LogOut className="w-4 h-4 text-slate-400" /> Déconnexion
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Votre progression reste sauvegardée dans le cloud.
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold font-mono border transition-all ${
                      showLogoutConfirm
                        ? 'bg-red-500/20 border-red-500/50 text-red-300 animate-pulse'
                        : 'bg-slate-800 border-white/5 text-slate-300 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    {showLogoutConfirm ? '⚠️ Confirmer ?' : 'Se déconnecter'}
                  </button>
                </div>
              </div>
            ) : (
              /* Non connecté */
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-slate-200">Connexion / Inscription</div>
                  <div className="text-xs text-slate-400 mt-1 max-w-md">
                    Connectez-vous pour sauvegarder votre progression dans le cloud, accéder aux classements et rejoindre des clubs.
                  </div>
                </div>
                <button
                  onClick={openAuthModal}
                  className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-xs font-mono tracking-wider transition-all hover:scale-105 active:scale-95"
                >
                  🎩 SE CONNECTER
                </button>
              </div>
            )}
          </section>

          {/* ── SECTION ACCESSIBILITÉ ────────────────────────────── */}
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
                  <div className="font-semibold text-slate-200">Mode Daltonien / Symboles</div>
                  <div className="text-xs text-slate-400 mt-1 max-w-md">
                    Affiche des symboles uniques sur chaque couleur pour une distinction sans dépendre des nuances.
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
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

              {/* Contraste grille */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
                <div>
                  <div className="font-semibold text-slate-200">Contraste de la Grille</div>
                  <div className="text-xs text-slate-400 mt-1 max-w-md">
                    Fond plus sombre et contours distincts pour les cases vides.
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

              {/* Aim guide */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-slate-200">Guide de Visée Dynamique</div>
                  <div className="text-xs text-slate-400 mt-1 max-w-md">
                    Repères fins pour visualiser l'impact de vos blocs.
                  </div>
                </div>
                <Toggle value={aimGuide} onChange={() => { playClick(); setAimGuide(!aimGuide); }} color="cyan" />
              </div>
            </div>
          </section>

          {/* ── EFFETS & ANIMATIONS ───────────────────────────────── */}
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
              {/* Reduced motion */}
              <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-5">
                <div>
                  <div className="font-semibold text-slate-200">Mouvements Réduits</div>
                  <div className="text-xs text-slate-400 mt-1 max-w-md">
                    Désactive les animations rapides pour réduire la fatigue visuelle.
                  </div>
                </div>
                <Toggle value={reducedMotion} onChange={() => { playClick(); setReducedMotion(!reducedMotion); }} />
              </div>

              {/* Screen shake */}
              <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-5">
                <div>
                  <div className="font-semibold text-slate-200">Secousses d&apos;Écran</div>
                  <div className="text-xs text-slate-400 mt-1 max-w-md">
                    Tremblement dramatique lors des combos pour un impact maximal.
                  </div>
                </div>
                <Toggle value={screenShake} onChange={() => { playClick(); setScreenShake(!screenShake); }} />
              </div>

              {/* Densité particules */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-slate-200">Densité des Particules</div>
                  <div className="text-xs text-slate-400 mt-1 max-w-md">
                    Étincelles et effets générés par vos blocs en mouvement.
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
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

          {/* ── AUDIO ─────────────────────────────────────────────── */}
          <section className="bg-slate-900/60 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden group hover:border-yellow-500/20 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-yellow-500/10 rounded-xl text-yellow-400 border border-yellow-500/20">
                <Volume2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-mono">Préférences Audio</h3>
                <p className="text-xs text-slate-400">Contrôlez l&apos;ambiance sonore du jeu</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold text-slate-200">Effets Sonores (SFX)</div>
                <div className="text-xs text-slate-400 mt-1 max-w-md">
                  Bruits de placement, destruction de lignes, validation de quêtes.
                </div>
              </div>
              <Toggle value={soundEnabled} onChange={() => { playClick(); toggleSound(); }} color="yellow" />
            </div>
          </section>

          {/* ── ZONE DE DANGER ────────────────────────────────────── */}
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
                  Efface complètement votre progression locale (SP, scores, inventaire, badges).
                </div>
              </div>
              <button
                onClick={handleResetData}
                className={`px-5 py-3 border font-bold rounded-xl text-xs font-mono tracking-wider transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap ${
                  resetConfirm
                    ? 'bg-red-500/40 border-red-400/70 text-red-200 animate-pulse'
                    : 'bg-red-500/10 hover:bg-red-500/20 border-red-500/35 text-red-400'
                }`}
              >
                <RefreshCw className={`w-4 h-4 ${resetConfirm ? 'animate-spin' : ''}`} />
                {resetConfirm ? '⚠️ CLIQUER POUR CONFIRMER' : 'RÉINITIALISER LE JEU'}
              </button>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
