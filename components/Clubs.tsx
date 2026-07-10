"use client";
import React, { useState, useEffect } from "react";
import { useGameStore } from "@/lib/store";
import {
  CLUB_LEVELS, CLUB_REWARDS, CLUB_EMOJIS,
  getClubLevelInfo, getClubProgress, formatSP,
  type ClubListItem,
} from "@/lib/clubs";
import {
  Trophy, Users, Shield, Plus, ArrowLeft, Crown, MessageCircle,
  Star, ChevronRight, Lock, Flame, TrendingUp, Send, Search, Globe, Eye
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { sounds } from "@/lib/audio";
import { useConfetti } from "@/components/ConfettiProvider";
import ClubChat from "@/components/ClubChat";
import { db } from "@/lib/firebase";
import {
  collection, getDocs, query, where, orderBy, limit
} from "firebase/firestore";

type ClubView = 'list' | 'create' | 'join_confirm' | 'dashboard' | 'chat';

const RARITY_BADGE: Record<number, { label: string; color: string }> = {
  1: { label: 'Cercle Privé', color: 'text-slate-400' },
  2: { label: 'Salon Distingué', color: 'text-blue-400' },
  3: { label: 'Club Élite', color: 'text-purple-400' },
  4: { label: 'Société Secrète', color: 'text-orange-400' },
  5: { label: 'Ordre Suprême', color: 'text-yellow-400' },
};

// Mock clubs for display when Firestore is empty
const MOCK_CLUBS: ClubListItem[] = [
  { id: 'mock_1', name: 'Les Snobs Alpha', icon: '👑', description: "L'élite de l'élite du prestige absolu.", membersCount: 45, maxMembers: 50, level: 3, totalSP: 26000, isPublic: true },
  { id: 'mock_2', name: 'Puzzle Masters', icon: '🧩', description: 'Les experts du bloc et de la réflexion.', membersCount: 12, maxMembers: 50, level: 1, totalSP: 1200, isPublic: true },
  { id: 'mock_3', name: 'Block Blast Pro', icon: '🔥', description: 'Vitesse, précision et puissance maximale.', membersCount: 50, maxMembers: 50, level: 5, totalSP: 600000, isPublic: false },
  { id: 'mock_4', name: 'Dragon Society', icon: '🐉', description: 'Les seigneurs du feu et de la stratégie.', membersCount: 28, maxMembers: 50, level: 2, totalSP: 8500, isPublic: true },
];

export default function Clubs() {
  const { coins, addCoins, soundEnabled, uid, username, avatar, club, createClub, joinClub, leaveClub, contributeSP, openAuthModal } = useGameStore();
  const { fire } = useConfetti();
  const [view, setView] = useState<ClubView>(club ? 'dashboard' : 'list');
  const [clubName, setClubName] = useState("");
  const [clubIcon, setClubIcon] = useState("🦁");
  const [clubDesc, setClubDesc] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [selectedClub, setSelectedClub] = useState<ClubListItem | null>(null);
  const [publicClubs, setPublicClubs] = useState<ClubListItem[]>(MOCK_CLUBS);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [contributeAmount, setContributeAmount] = useState(100);

  // Sync view when club state changes
  useEffect(() => {
    if (club && view === 'list') setView('dashboard');
    if (!club && (view === 'dashboard' || view === 'chat')) setView('list');
  }, [club]);

  const handleCreate = async () => {
    if (!uid) { openAuthModal(); return; }
    if (coins < 1000 || clubName.trim().length === 0) return;
    setLoading(true);
    try {
      sounds.playClubJoin(soundEnabled);
      createClub(clubName.trim(), clubIcon);
      fire(window.innerWidth / 2, window.innerHeight / 2);
      setView('dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinConfirm = () => {
    if (!uid) { openAuthModal(); return; }
    if (!selectedClub) return;
    sounds.playClubJoin(soundEnabled);
    joinClub(selectedClub);
    fire(window.innerWidth / 2, window.innerHeight / 2);
    setView('dashboard');
  };

  const handleContribute = () => {
    if (coins >= contributeAmount && club) {
      contributeSP(contributeAmount);
      sounds.playClick(soundEnabled);
    }
  };

  const filteredClubs = publicClubs.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentLevelInfo = club ? getClubLevelInfo(club.level || 1) : null;
  const nextLevelInfo = club ? CLUB_LEVELS.find(l => l.level === (club.level || 1) + 1) : null;
  const clubProgress = club ? getClubProgress(club.sp || 0, club.level || 1) : 0;

  // ─── VIEW: CHAT ────────────────────────────────────────────────
  if (view === 'chat' && club) {
    return (
      <div className="w-full max-w-md mx-auto flex flex-col h-[70vh]">
        <div className="flex items-center gap-3 mb-3 px-1">
          <button onClick={() => setView('dashboard')} className="text-slate-400 hover:text-white flex items-center gap-1.5 text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Tableau de bord
          </button>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-lg">{club.icon}</span>
            <span className="font-bold text-sm truncate max-w-[120px]">{club.name}</span>
          </div>
        </div>
        <div className="flex-1 min-h-0">
          <ClubChat clubId={club.id} />
        </div>
      </div>
    );
  }

  // ─── VIEW: CREATE ──────────────────────────────────────────────
  if (view === 'create') {
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md mx-auto p-4 space-y-6">
        <button onClick={() => setView('list')} className="text-slate-400 hover:text-white flex items-center gap-2 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Retour
        </button>
        <h2 className="text-2xl font-bold text-center text-yellow-400">⚔️ Créer un Club</h2>

        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 space-y-5">
          {/* Nom */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nom du Club</label>
            <input
              type="text" maxLength={25} value={clubName}
              onChange={e => setClubName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 outline-none transition-all placeholder-slate-600"
              placeholder="Ex: Les Rois du Puzzle"
            />
            <p className="text-xs text-slate-500 text-right">{clubName.length}/25</p>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</label>
            <textarea
              maxLength={80} value={clubDesc}
              onChange={e => setClubDesc(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-yellow-500/50 outline-none transition-all placeholder-slate-600 resize-none"
              placeholder="Décrivez votre club en quelques mots..."
              rows={2}
            />
          </div>

          {/* Emblème */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Emblème</label>
            <div className="grid grid-cols-5 gap-2">
              {CLUB_EMOJIS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => setClubIcon(emoji)}
                  className={`text-2xl p-2.5 rounded-xl transition-all ${
                    clubIcon === emoji
                      ? 'bg-yellow-500/20 border-2 border-yellow-500 scale-110'
                      : 'bg-slate-950 border border-slate-800 hover:border-slate-600 hover:scale-105'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Visibilité */}
          <div className="flex items-center justify-between bg-slate-950/50 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-400" />
              <div>
                <div className="text-sm font-semibold text-slate-200">Club Public</div>
                <div className="text-xs text-slate-500">Visible dans la liste des clubs</div>
              </div>
            </div>
            <button
              onClick={() => setIsPublic(!isPublic)}
              className={`w-12 h-6 rounded-full transition-all duration-300 relative p-0.5 ${isPublic ? 'bg-yellow-500' : 'bg-slate-700'}`}
            >
              <motion.div layout className={`w-5 h-5 rounded-full shadow-md ${isPublic ? 'bg-slate-950' : 'bg-slate-400'}`}
                animate={{ x: isPublic ? 24 : 0 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
            </button>
          </div>

          {/* Coût + Bouton */}
          <div className="flex items-center justify-between bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3">
            <span className="text-sm text-slate-300">Coût de création</span>
            <span className="font-bold text-yellow-400">1 000 SP</span>
          </div>

          <button
            onClick={handleCreate}
            disabled={coins < 1000 || clubName.trim().length === 0 || loading}
            className="w-full py-4 rounded-xl font-bold text-black bg-gradient-to-r from-yellow-400 to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(234,179,8,0.3)]"
          >
            {loading ? '⏳ Création...' : '✨ Créer le Club (1 000 SP)'}
          </button>
          {coins < 1000 && (
            <p className="text-center text-xs text-red-400">Il vous manque {1000 - coins} SP</p>
          )}
        </div>
      </motion.div>
    );
  }

  // ─── VIEW: JOIN CONFIRM ────────────────────────────────────────
  if (view === 'join_confirm' && selectedClub) {
    const levelBadge = RARITY_BADGE[selectedClub.level] || RARITY_BADGE[1];
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md mx-auto p-4 space-y-6">
        <button onClick={() => setView('list')} className="text-slate-400 hover:text-white flex items-center gap-2 text-sm">
          <ArrowLeft className="w-4 h-4" /> Retour
        </button>

        <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-6 text-center space-y-4">
          <div className="text-6xl">{selectedClub.icon}</div>
          <div>
            <h2 className="text-2xl font-bold">{selectedClub.name}</h2>
            <span className={`text-sm font-semibold ${levelBadge.color}`}>{levelBadge.label}</span>
          </div>
          <p className="text-slate-400 text-sm">{selectedClub.description || "Un club de prestige."}</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="text-slate-500 text-xs mb-1">Membres</div>
              <div className="font-bold">{selectedClub.membersCount} / {selectedClub.maxMembers}</div>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="text-slate-500 text-xs mb-1">SP du Club</div>
              <div className="font-bold text-yellow-400">{formatSP(selectedClub.totalSP)}</div>
            </div>
          </div>

          {selectedClub.membersCount >= selectedClub.maxMembers ? (
            <div className="py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-bold">
              🔒 Club complet
            </div>
          ) : (
            <button
              onClick={handleJoinConfirm}
              className="w-full py-4 rounded-xl font-bold text-black bg-gradient-to-r from-yellow-400 to-yellow-600 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)]"
            >
              🤝 Rejoindre ce Club
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  // ─── VIEW: DASHBOARD ───────────────────────────────────────────
  if (view === 'dashboard' && club) {
    const levelInfo = currentLevelInfo || CLUB_LEVELS[0];
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md mx-auto p-4 space-y-4">

        {/* Header Club */}
        <div className="relative bg-gradient-to-br from-slate-900 to-slate-950 p-5 rounded-2xl border border-yellow-500/20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent pointer-events-none" />
          <div className="flex items-center gap-4">
            <div className="text-5xl bg-slate-800 p-3 rounded-2xl border border-slate-700">{club.icon}</div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-black truncate">{club.name}</h2>
              <div className={`text-sm font-semibold ${levelInfo.color} flex items-center gap-1`}>
                <span>{levelInfo.icon}</span> {levelInfo.name} · Niv. {club.level || 1}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">{formatSP(club.sp || 0)} SP total</div>
            </div>
          </div>

          {/* Barre de progression vers niveau suivant */}
          {nextLevelInfo && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Progression vers {nextLevelInfo.name}</span>
                <span>{formatSP(club.sp || 0)} / {formatSP(nextLevelInfo.spRequired)}</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${clubProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-center">
            <div className="text-slate-400 text-xs mb-1">👥 Membres</div>
            <div className="text-xl font-bold">{club.members || 1} / {club.maxMembers || 50}</div>
          </div>
          <button
            onClick={() => setView('chat')}
            className="bg-slate-900/50 hover:bg-yellow-500/10 border border-slate-800 hover:border-yellow-500/30 p-4 rounded-xl transition-all flex flex-col items-center justify-center gap-1 group"
          >
            <MessageCircle className="w-6 h-6 text-yellow-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-300">Chat du Club</span>
          </button>
        </div>

        {/* Contribuer */}
        <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-yellow-400" />
            <h3 className="font-bold text-slate-200">Contribuer des SP</h3>
          </div>
          <p className="text-xs text-slate-400">Versez vos SP pour faire monter le club de niveau et débloquer des récompenses collectives !</p>
          
          {/* Slider */}
          <div className="space-y-2">
            <div className="flex gap-2">
              {[50, 100, 500, 1000].map(amount => (
                <button
                  key={amount}
                  onClick={() => setContributeAmount(amount)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    contributeAmount === amount
                      ? 'bg-yellow-500/20 border border-yellow-500 text-yellow-400'
                      : 'bg-slate-800 border border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  {amount}
                </button>
              ))}
            </div>
            <button
              onClick={handleContribute}
              disabled={coins < contributeAmount}
              className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 hover:from-yellow-500/40 hover:to-yellow-600/40 border border-yellow-500/40 text-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Contribuer {contributeAmount} SP
            </button>
            {coins < contributeAmount && (
              <p className="text-xs text-red-400 text-center">SP insuffisants ({coins} disponibles)</p>
            )}
          </div>
        </div>

        {/* Récompenses */}
        <div className="space-y-2">
          <h3 className="font-bold text-slate-300 px-1 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-400" /> Récompenses de Niveau
          </h3>
          {CLUB_REWARDS.map(reward => {
            const unlocked = (club.level || 1) >= reward.clubLevelRequired;
            return (
              <motion.div
                key={reward.id}
                className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                  unlocked
                    ? 'bg-yellow-500/5 border-yellow-500/20 text-slate-100'
                    : 'bg-slate-900/30 border-slate-800/50 opacity-50'
                }`}
              >
                <div className="text-2xl">{reward.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm">{reward.name}</div>
                  <div className="text-xs text-slate-400 truncate">{reward.description}</div>
                </div>
                <div className={`text-xs font-bold flex items-center gap-1 ${unlocked ? 'text-yellow-400' : 'text-slate-500'}`}>
                  {unlocked ? '✓' : <Lock className="w-3 h-3" />}
                  <span>Niv.{reward.clubLevelRequired}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <button
          onClick={() => { leaveClub(); setView('list'); }}
          className="w-full py-3 text-red-400/70 hover:text-red-400 text-sm font-bold transition-colors"
        >
          Quitter le Club
        </button>
      </motion.div>
    );
  }

  // ─── VIEW: LIST (default) ──────────────────────────────────────
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md mx-auto p-4 space-y-5">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-600">
          🤝 Clubs Très Privés
        </h2>
        <p className="text-slate-400 text-sm">Rejoignez l&apos;élite, contribuez ensemble et débloquez des récompenses exclusives.</p>
      </div>

      {/* Créer un club */}
      <button
        onClick={() => uid ? setView('create') : openAuthModal()}
        className="w-full py-4 rounded-xl font-bold text-black bg-gradient-to-r from-yellow-400 to-yellow-600 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(234,179,8,0.25)]"
      >
        <Plus className="w-5 h-5" />
        Créer un Club (1 000 SP)
      </button>

      {/* Recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Rechercher un club..."
          className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-600 transition-colors"
        />
      </div>

      {/* Liste clubs */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-400 text-sm px-1">Clubs Disponibles</h3>
        {filteredClubs.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <p className="text-lg mb-1">🔍</p>
            <p className="text-sm">Aucun club trouvé</p>
          </div>
        ) : (
          filteredClubs.map(c => {
            const isFull = c.membersCount >= c.maxMembers;
            const levelInfo = RARITY_BADGE[c.level] || RARITY_BADGE[1];
            return (
              <motion.div
                key={c.id}
                whileHover={{ y: -1 }}
                className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 hover:border-slate-600 transition-all"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="text-3xl bg-slate-800/80 p-2 rounded-xl border border-slate-700 flex-shrink-0">{c.icon}</div>
                    <div className="min-w-0">
                      <div className="font-bold truncate">{c.name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-0.5">
                          <Users className="w-3 h-3" /> {c.membersCount}/{c.maxMembers}
                        </span>
                        <span className={`font-semibold ${levelInfo.color}`}>Niv.{c.level}</span>
                        <span className="text-yellow-500/70">{formatSP(c.totalSP)} SP</span>
                      </div>
                      {c.description && (
                        <div className="text-xs text-slate-500 truncate mt-0.5">{c.description}</div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (uid) { setSelectedClub(c); setView('join_confirm'); }
                      else openAuthModal();
                    }}
                    disabled={isFull}
                    className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      isFull
                        ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
                        : 'bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-400'
                    }`}
                  >
                    {isFull ? '🔒 Complet' : 'Rejoindre'}
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
