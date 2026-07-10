"use client";
import React, { useState } from "react";
import { useGameStore } from "@/lib/store";
import { CLUB_LEVELS, CLUB_REWARDS } from "@/lib/clubs";
import { Trophy, Users, Shield, Plus, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { sounds } from "@/lib/audio";
import { useConfetti } from "@/components/ConfettiProvider";

const EMOJIS = ["🦁", "🐉", "⚔️", "🏰", "👑", "💎", "🔥", "⚡", "🌟", "🎯", "🏆", "🎩"];

const MOCK_CLUBS = [
  { id: '1', name: 'Les Snobs Alpha', icon: '👑', members: 45, maxMembers: 50, level: 3, sp: 26000 },
  { id: '2', name: 'Puzzle Masters', icon: '🧩', members: 12, maxMembers: 50, level: 1, sp: 1200 },
  { id: '3', name: 'Block Blast Pro', icon: '🔥', members: 50, maxMembers: 50, level: 5, sp: 600000 },
];

export default function Clubs() {
  const { coins, addCoins, soundEnabled } = useGameStore();
  const [view, setView] = useState<'list' | 'create' | 'dashboard'>('list');
  const [clubName, setClubName] = useState("");
  const [clubIcon, setClubIcon] = useState("🦁");
  
  const handleCreate = () => {
    if (coins >= 1000 && clubName.trim().length > 0) {
      addCoins(-1000);
      sounds.playClubJoin(soundEnabled);
      setView('dashboard');
    }
  };

  if (view === 'create') {
    return (
      <div className="w-full max-w-md mx-auto p-4 space-y-6">
        <button onClick={() => setView('list')} className="text-slate-400 hover:text-white flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Retour
        </button>
        <h2 className="text-2xl font-bold text-center text-yellow-400">Créer un Club</h2>
        
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Nom du Club</label>
            <input 
              type="text" 
              maxLength={20}
              value={clubName}
              onChange={e => setClubName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-yellow-500 outline-none"
              placeholder="Ex: Les Rois du Puzzle"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Emblème</label>
            <div className="grid grid-cols-4 gap-2">
              {EMOJIS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => setClubIcon(emoji)}
                  className={`text-2xl p-3 rounded-xl transition-all ${clubIcon === emoji ? 'bg-yellow-500/20 border-yellow-500 border' : 'bg-slate-950 border border-slate-800 hover:border-slate-600'}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleCreate}
            disabled={coins < 1000 || clubName.trim().length === 0}
            className="w-full py-4 rounded-xl font-bold text-black bg-gradient-to-r from-yellow-400 to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-transform active:scale-95"
          >
            Créer le Club (1 000 SP)
          </button>
        </div>
      </div>
    );
  }

  if (view === 'dashboard') {
    return (
      <div className="w-full max-w-md mx-auto p-4 space-y-6">
        <div className="flex items-center gap-4 bg-slate-900/80 p-6 rounded-2xl border border-yellow-500/30">
          <div className="text-5xl">{clubIcon}</div>
          <div>
            <h2 className="text-2xl font-bold">{clubName || "Votre Club"}</h2>
            <div className="text-sm text-yellow-400">Niveau 1 • Cercle Privé</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-center">
            <div className="text-slate-400 text-sm mb-1">Membres</div>
            <div className="text-xl font-bold">1 / 50</div>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-center">
            <div className="text-slate-400 text-sm mb-1">SP du Club</div>
            <div className="text-xl font-bold text-yellow-400">0</div>
          </div>
        </div>
        
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 space-y-4 text-center">
          <p className="text-slate-400 text-sm">Contribuez des SP pour monter de niveau et débloquer des récompenses !</p>
          <button className="px-6 py-3 bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 rounded-xl font-bold hover:bg-yellow-500 hover:text-black transition-all">
            Contribuer 100 SP
          </button>
        </div>

        <div className="space-y-3">
          <h3 className="font-bold text-slate-300 px-2">Récompenses de Niveau</h3>
          {CLUB_REWARDS.map(reward => (
            <div key={reward.id} className="flex items-center gap-4 bg-slate-900/30 p-4 rounded-xl border border-slate-800 opacity-50">
              <div className="text-2xl">{reward.icon}</div>
              <div className="flex-1">
                <div className="font-bold">{reward.name}</div>
                <div className="text-xs text-slate-400">{reward.description}</div>
              </div>
              <div className="text-xs font-bold text-slate-500">Niv. {reward.clubLevelRequired}</div>
            </div>
          ))}
        </div>
        
        <button onClick={() => setView('list')} className="w-full py-4 text-red-400 text-sm font-bold opacity-70 hover:opacity-100">
          Quitter le Club
        </button>
      </div>
    );
  }

  // List view
  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-600">
          🤝 Clubs Très Privés
        </h2>
        <p className="text-slate-400">Rejoignez l'élite, contribuez ensemble et débloquez des récompenses exclusives.</p>
      </div>

      <button 
        onClick={() => setView('create')}
        className="w-full py-4 rounded-xl font-bold text-black bg-gradient-to-r from-yellow-400 to-yellow-600 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(234,179,8,0.3)]"
      >
        <Plus className="w-5 h-5" />
        Créer un Club (1 000 SP)
      </button>

      <div className="space-y-4">
        <h3 className="font-bold text-slate-300 px-2">Clubs Disponibles</h3>
        {MOCK_CLUBS.map(club => (
          <div key={club.id} className="flex items-center justify-between bg-slate-900/50 p-4 rounded-xl border border-slate-800 hover:border-slate-600 transition-colors">
            <div className="flex items-center gap-4">
              <div className="text-3xl bg-slate-800 p-2 rounded-lg">{club.icon}</div>
              <div>
                <div className="font-bold">{club.name}</div>
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3"/> {club.members}/{club.maxMembers}</span>
                  <span className="flex items-center gap-1"><Shield className="w-3 h-3"/> Niv. {club.level}</span>
                </div>
              </div>
            </div>
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sm font-bold rounded-lg transition-colors">
              Rejoindre
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
