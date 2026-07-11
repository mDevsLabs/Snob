"use client";
import React, { useState } from "react";
import { useGameStore } from "@/lib/store";
import { X, Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function AuthModal() {
  const { showAuthModal, closeAuthModal, loginWithEmail, registerWithEmail } = useGameStore();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!showAuthModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    if (isRegister && !name.trim()) {
      setError("Veuillez entrer un nom d'utilisateur.");
      return;
    }
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        await registerWithEmail(email, password, name.trim());
      } else {
        await loginWithEmail(email, password);
      }
      closeAuthModal();
      setEmail("");
      setPassword("");
      setName("");
    } catch (err: any) {
      console.error(err);
      // Better-auth / Firebase error messages
      const msg = err?.message || "";
      if (msg.includes("already") || msg.includes("exists") || msg.includes("utilisé")) {
        setError("Cet email est déjà utilisé. Essayez de vous connecter.");
      } else if (msg.includes("password") || msg.includes("credentials") || msg.includes("incorrects")) {
        setError("Identifiants incorrects. Vérifiez votre email et mot de passe.");
      } else if (msg.includes("network") || msg.includes("fetch")) {
        setError("Erreur réseau. Vérifiez votre connexion internet.");
      } else {
        setError(err.message || "Une erreur est survenue lors de l'authentification.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-slate-900/90 border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative"
      >
        {/* Neon glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/10 blur-[100px] pointer-events-none" />

        <div className="p-8 relative flex flex-col">
          {/* Close button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8 mt-2">
            <div className="w-16 h-16 bg-slate-800/80 rounded-2xl flex items-center justify-center mb-4 border border-white/5 shadow-inner">
              <span className="text-3xl">🎩</span>
            </div>
            <h2 className="text-3xl font-black font-mono text-white tracking-tighter uppercase mb-2">
              {isRegister ? "Créer un Compte" : "Connexion Snob"}
            </h2>
            <p className="text-slate-400 font-mono text-xs max-w-xs">
              {isRegister
                ? "Rejoignez la haute société du prestige et sauvegardez votre progression."
                : "Sauvegardez vos Snob Points, votre inventaire et vos progressions."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/25 rounded-2xl text-red-400 text-xs font-mono font-bold leading-relaxed"
                >
                  ⚠️ {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Champ Nom (inscription seulement) */}
            <AnimatePresence>
              {isRegister && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col gap-1.5"
                >
                  <label className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest pl-1">
                    Nom d&apos;utilisateur
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: LeSnobParfait"
                      maxLength={30}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-950/60 border border-white/5 rounded-2xl font-mono text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest pl-1">
                Adresse E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ex: mathias@snob.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-950/60 border border-white/5 rounded-2xl font-mono text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                  required
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest pl-1">
                Mot de Passe
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 caractères"
                  className="w-full pl-11 pr-11 py-3.5 bg-slate-950/60 border border-white/5 rounded-2xl font-mono text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-bold font-mono rounded-2xl transition-all shadow-[0_4px_20px_rgba(6,182,212,0.25)] flex items-center justify-center gap-2 group active:scale-[0.98]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isRegister ? "Créer mon compte" : "Se connecter"}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError(null);
                setName("");
              }}
              className="text-xs font-mono text-slate-400 hover:text-white transition-colors"
            >
              {isRegister ? (
                <>Déjà un compte ? <span className="text-cyan-400 font-bold hover:underline">Se connecter</span></>
              ) : (
                <>Nouveau joueur ? <span className="text-cyan-400 font-bold hover:underline">Créer un compte</span></>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
