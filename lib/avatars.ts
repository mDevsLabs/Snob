export type Rarity = 'Commun' | 'Rare' | 'Épique' | 'Légendaire';
export type AvatarCategory = 'Animal' | 'Personnage' | 'Cosmique' | 'Mythique' | 'Élite';

export interface Avatar {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  rarity: Rarity;
  category: AvatarCategory;
  prestigeRequired?: number; // Déblocable seulement par prestige
}

export interface AvatarFrame {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  rarity: Rarity;
  borderStyle: string;
  animation?: string;
  prestigeRequired?: number;
}

export const AVATARS: Avatar[] = [
  // ─── Gratuits / Commun ────────────────────────────────────────
  { id: 'avatar_gentleman', name: 'Gentleman', description: 'Le classique intemporel.', icon: '🎩', price: 0, rarity: 'Commun', category: 'Personnage' },
  { id: 'avatar_cat', name: 'Chat Distingué', description: 'Mystérieux et raffiné.', icon: '🐱', price: 0, rarity: 'Commun', category: 'Animal' },

  // ─── Rare / Animal ───────────────────────────────────────────
  { id: 'avatar_fox', name: 'Renard Rusé', description: 'Malin, rapide et élégant.', icon: '🦊', price: 500, rarity: 'Rare', category: 'Animal' },
  { id: 'avatar_rabbit', name: 'Lapin Chic', description: 'Agile comme la pensée.', icon: '🐰', price: 600, rarity: 'Rare', category: 'Animal' },
  { id: 'avatar_bear', name: 'Ours Stoïque', description: 'Force tranquille et puissante.', icon: '🐻', price: 700, rarity: 'Rare', category: 'Animal' },
  { id: 'avatar_penguin', name: 'Pingouin Élégant', description: 'Toujours en tenue de soirée.', icon: '🐧', price: 750, rarity: 'Rare', category: 'Animal' },

  // ─── Rare / Personnage ───────────────────────────────────────
  { id: 'avatar_robot', name: 'Robot Prestige', description: 'Précision chirurgicale.', icon: '🤖', price: 800, rarity: 'Rare', category: 'Personnage' },
  { id: 'avatar_pirate', name: 'Pirate des Mers', description: "À l'abordage du prestige !", icon: '☠️', price: 900, rarity: 'Rare', category: 'Personnage' },
  { id: 'avatar_ninja', name: 'Ninja Silencieux', description: 'Discret, mais redoutable.', icon: '🥷', price: 850, rarity: 'Rare', category: 'Personnage' },

  // ─── Épique / Animal ─────────────────────────────────────────
  { id: 'avatar_lion', name: 'Lion Royal', description: 'Le souverain de la savane.', icon: '🦁', price: 2000, rarity: 'Épique', category: 'Animal' },
  { id: 'avatar_tiger', name: 'Tigre de Bengale', description: 'Puissance et noblesse absolue.', icon: '🐯', price: 2200, rarity: 'Épique', category: 'Animal' },
  { id: 'avatar_eagle', name: 'Aigle Impérial', description: 'Vision perçante, vol souverain.', icon: '🦅', price: 2500, rarity: 'Épique', category: 'Animal' },
  { id: 'avatar_wolf', name: 'Loup des Montagnes', description: 'Chef de meute incontesté.', icon: '🐺', price: 2300, rarity: 'Épique', category: 'Animal' },

  // ─── Épique / Personnage ─────────────────────────────────────
  { id: 'avatar_king', name: 'Roi Absolu', description: 'Le souverain du jeu.', icon: '👑', price: 3000, rarity: 'Épique', category: 'Personnage' },
  { id: 'avatar_wizard', name: 'Archimage', description: 'Maître des arcanes anciens.', icon: '🔮', price: 2800, rarity: 'Épique', category: 'Personnage' },
  { id: 'avatar_knight', name: 'Chevalier Noir', description: "Gardien de l'ordre prestige.", icon: '⚔️', price: 2600, rarity: 'Épique', category: 'Personnage' },

  // ─── Épique / Cosmique ───────────────────────────────────────
  { id: 'avatar_cosmo', name: 'Cosmonaute', description: "Vers l'infini et au-delà.", icon: '🌌', price: 3500, rarity: 'Épique', category: 'Cosmique' },
  { id: 'avatar_alien', name: 'Alien Galactique', description: 'Venu des confins du cosmos.', icon: '👽', price: 3200, rarity: 'Épique', category: 'Cosmique' },

  // ─── Légendaire / Mythique ───────────────────────────────────
  { id: 'avatar_dragon', name: 'Dragon Légendaire', description: 'Cracheur de feu, maître des âges.', icon: '🐉', price: 6000, rarity: 'Légendaire', category: 'Mythique' },
  { id: 'avatar_phoenix', name: 'Phénix Éternel', description: 'Renaît de ses cendres, toujours plus fort.', icon: '🦄', price: 7000, rarity: 'Légendaire', category: 'Mythique' },
  { id: 'avatar_demon', name: 'Démon du Gouffre', description: 'Puissance obscure et incontrôlable.', icon: '😈', price: 6500, rarity: 'Légendaire', category: 'Mythique' },

  // ─── Légendaire / Élite (prestige requis) ────────────────────
  { id: 'avatar_prestige_king', name: 'Roi du Prestige', description: 'Réservé aux vrais légendes.', icon: '🏆', price: 0, rarity: 'Légendaire', category: 'Élite', prestigeRequired: 3 },
  { id: 'avatar_cosmic_god', name: 'Dieu Cosmique', description: "L'omnipotent des galaxies.", icon: '🌠', price: 0, rarity: 'Légendaire', category: 'Élite', prestigeRequired: 5 },
  { id: 'avatar_void', name: 'Être du Néant', description: 'Au-delà du temps et de l\'espace.', icon: '🕳️', price: 0, rarity: 'Légendaire', category: 'Élite', prestigeRequired: 8 },
];

export const AVATAR_FRAMES: AvatarFrame[] = [
  { id: 'frame_simple', name: 'Simple', description: 'Une bordure discrète et élégante.', icon: '⭕', price: 0, rarity: 'Commun', borderStyle: 'border-2 border-slate-700' },
  { id: 'frame_bronze', name: 'Bronze Shine', description: 'Reflets chaleureux de bronze.', icon: '🥉', price: 0, rarity: 'Rare', borderStyle: 'border-2 border-amber-700 shadow-[0_0_10px_rgba(180,83,9,0.5)]', prestigeRequired: 1 },
  { id: 'frame_silver', name: 'Silver Glow', description: "Éclat d'argent pur.", icon: '🥈', price: 0, rarity: 'Rare', borderStyle: 'border-2 border-slate-300 shadow-[0_0_15px_rgba(203,213,225,0.6)]', prestigeRequired: 2 },
  { id: 'frame_gold', name: 'Gold Pulse', description: 'Aura dorée pulsante.', icon: '🥇', price: 0, rarity: 'Épique', borderStyle: 'border-2 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.8)]', prestigeRequired: 3 },
  { id: 'frame_platinum', name: 'Platinum Ring', description: "L'anneau de platine lumineux.", icon: '💍', price: 0, rarity: 'Épique', borderStyle: 'border-2 border-cyan-200 shadow-[0_0_25px_rgba(165,243,252,0.8)]', prestigeRequired: 4 },
  { id: 'frame_diamond', name: 'Diamond Sparkle', description: 'Brillance cristalline pure.', icon: '💎', price: 0, rarity: 'Épique', borderStyle: 'border-2 border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,1)]', prestigeRequired: 5 },
  { id: 'frame_neon', name: 'Neon Ring', description: 'Néon futuriste vibrant.', icon: '💡', price: 0, rarity: 'Légendaire', borderStyle: 'border-2 border-fuchsia-500 shadow-[0_0_35px_rgba(217,70,239,1)]', prestigeRequired: 6 },
  { id: 'frame_plasma', name: 'Plasma Arc', description: 'Énergie plasma brute.', icon: '⚡', price: 0, rarity: 'Légendaire', borderStyle: 'border-2 border-violet-500 shadow-[0_0_40px_rgba(139,92,246,1)]', prestigeRequired: 7 },
  { id: 'frame_dark_matter', name: 'Dark Matter Vortex', description: 'Le vide absolu encerclé.', icon: '🌌', price: 0, rarity: 'Légendaire', borderStyle: 'border-2 border-zinc-900 shadow-[0_0_50px_rgba(24,24,27,1)]', prestigeRequired: 8 },
  { id: 'frame_cosmic', name: 'Cosmic Aurora', description: 'Beauté stellaire infinie.', icon: '🌠', price: 0, rarity: 'Légendaire', borderStyle: 'border-2 border-indigo-400 shadow-[0_0_50px_rgba(129,140,248,1)]', prestigeRequired: 9 },
];

export const RARITY_COLORS: Record<Rarity, string> = {
  'Commun': 'text-slate-300 border-slate-500/50 bg-slate-500/10',
  'Rare': 'text-blue-300 border-blue-500/50 bg-blue-500/10',
  'Épique': 'text-purple-300 border-purple-500/50 bg-purple-500/10',
  'Légendaire': 'text-yellow-300 border-yellow-500/50 bg-yellow-500/10',
};

export const RARITY_GLOW: Record<Rarity, string> = {
  'Commun': '',
  'Rare': 'shadow-[0_0_15px_rgba(59,130,246,0.3)]',
  'Épique': 'shadow-[0_0_20px_rgba(168,85,247,0.4)]',
  'Légendaire': 'shadow-[0_0_25px_rgba(234,179,8,0.5)]',
};
