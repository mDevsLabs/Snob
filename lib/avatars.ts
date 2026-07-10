export interface Avatar {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  rarity: 'Commun' | 'Rare' | 'Épique' | 'Légendaire';
}

export interface AvatarFrame {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  rarity: 'Commun' | 'Rare' | 'Épique' | 'Légendaire';
  borderStyle: string;
  animation?: string;
  prestigeRequired?: number;
}

export const AVATARS: Avatar[] = [
  { id: 'avatar_gentleman', name: 'Gentleman', description: 'Le classique.', icon: '🎩', price: 0, rarity: 'Commun' },
  { id: 'avatar_fox', name: 'Renard Rusé', description: 'Malin et rapide.', icon: '🦊', price: 500, rarity: 'Rare' },
  { id: 'avatar_dragon', name: 'Dragon', description: 'Cracheur de feu.', icon: '🐉', price: 1500, rarity: 'Épique' },
  { id: 'avatar_robot', name: 'Robot', description: 'Précision chirurgicale.', icon: '🤖', price: 2000, rarity: 'Rare' },
  { id: 'avatar_king', name: 'Roi', description: 'Le souverain du jeu.', icon: '👑', price: 3000, rarity: 'Épique' },
  { id: 'avatar_lion', name: 'Lion Royal', description: 'Le roi de la savane.', icon: '🦁', price: 4000, rarity: 'Épique' },
  { id: 'avatar_cosmo', name: 'Cosmonaute', description: 'Vers l\'infini.', icon: '🌌', price: 6000, rarity: 'Légendaire' },
  { id: 'avatar_wizard', name: 'Sorcier', description: 'Maître des arcanes.', icon: '🔮', price: 5000, rarity: 'Épique' },
  { id: 'avatar_pirate', name: 'Pirate', description: 'A l\'abordage !', icon: '☠️', price: 3500, rarity: 'Rare' },
  { id: 'avatar_eagle', name: 'Aigle', description: 'Vision perçante.', icon: '🦅', price: 7000, rarity: 'Légendaire' }
];

export const AVATAR_FRAMES: AvatarFrame[] = [
  { id: 'frame_simple', name: 'Simple', description: 'Une bordure discrète.', icon: '⭕', price: 0, rarity: 'Commun', borderStyle: 'border-2 border-slate-700', prestigeRequired: 0 },
  { id: 'frame_bronze', name: 'Bronze Shine', description: 'Reflets de bronze.', icon: '🥉', price: 0, rarity: 'Rare', borderStyle: 'border-2 border-amber-700 shadow-[0_0_10px_rgba(180,83,9,0.5)]', prestigeRequired: 1 },
  { id: 'frame_silver', name: 'Silver Glow', description: 'Éclat d\'argent.', icon: '🥈', price: 0, rarity: 'Rare', borderStyle: 'border-2 border-slate-300 shadow-[0_0_15px_rgba(203,213,225,0.6)]', prestigeRequired: 2 },
  { id: 'frame_gold', name: 'Gold Pulse', description: 'Aura dorée.', icon: '🥇', price: 0, rarity: 'Épique', borderStyle: 'border-2 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.8)]', prestigeRequired: 3 },
  { id: 'frame_platinum', name: 'Platinum Ring', description: 'L\'anneau de platine.', icon: '💍', price: 0, rarity: 'Épique', borderStyle: 'border-2 border-cyan-200 shadow-[0_0_25px_rgba(165,243,252,0.8)]', prestigeRequired: 4 },
  { id: 'frame_diamond', name: 'Diamond Sparkle', description: 'Brillance pure.', icon: '💎', price: 0, rarity: 'Épique', borderStyle: 'border-2 border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,1)]', prestigeRequired: 5 },
  { id: 'frame_neon', name: 'Neon Ring', description: 'Néon futuriste.', icon: '💡', price: 0, rarity: 'Légendaire', borderStyle: 'border-2 border-fuchsia-500 shadow-[0_0_35px_rgba(217,70,239,1)]', prestigeRequired: 6 },
  { id: 'frame_plasma', name: 'Plasma Arc', description: 'Énergie brute.', icon: '⚡', price: 0, rarity: 'Légendaire', borderStyle: 'border-2 border-violet-500 shadow-[0_0_40px_rgba(139,92,246,1)]', prestigeRequired: 7 },
  { id: 'frame_dark_matter', name: 'Dark Matter Vortex', description: 'Le vide absolu.', icon: '🌌', price: 0, rarity: 'Légendaire', borderStyle: 'border-2 border-zinc-900 shadow-[0_0_50px_rgba(24,24,27,1)]', prestigeRequired: 8 },
  { id: 'frame_cosmic', name: 'Cosmic Aurora', description: 'Beauté stellaire.', icon: '🌠', price: 0, rarity: 'Légendaire', borderStyle: 'border-2 border-indigo-400 shadow-[0_0_50px_rgba(129,140,248,1)]', prestigeRequired: 9 }
];
