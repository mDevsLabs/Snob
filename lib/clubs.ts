export interface ClubMember {
  uid: string;
  username: string;
  avatar: string;
  role: 'owner' | 'officer' | 'member';
  contributedSP: number;
  joinedAt: string;
}

export interface ClubMessage {
  id: string;
  uid: string;
  username: string;
  avatar: string;
  text: string;
  createdAt: string; // ISO string
}

export interface Club {
  id: string;
  name: string;
  icon: string;
  description: string;
  members: ClubMember[];
  totalSP: number;
  level: number;
  createdAt: string;
  maxMembers: number;
  isPublic: boolean;
  ownerId: string;
}

export interface ClubReward {
  id: string;
  name: string;
  description: string;
  icon: string;
  clubLevelRequired: number;
  reward: { sp?: number; xp?: number; itemId?: string };
}

export interface ClubListItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  membersCount: number;
  maxMembers: number;
  level: number;
  totalSP: number;
  isPublic: boolean;
}

export const CLUB_LEVELS = [
  { level: 1, name: 'Cercle Privé', spRequired: 0, color: 'text-slate-400', icon: '🤝' },
  { level: 2, name: 'Salon Distingué', spRequired: 5000, color: 'text-blue-400', icon: '🏛️' },
  { level: 3, name: 'Club Élite', spRequired: 25000, color: 'text-purple-400', icon: '💎' },
  { level: 4, name: 'Société Secrète', spRequired: 100000, color: 'text-orange-400', icon: '🔐' },
  { level: 5, name: 'Ordre Suprême', spRequired: 500000, color: 'text-yellow-400', icon: '👑' },
];

export const CLUB_REWARDS: ClubReward[] = [
  { id: 'reward_lvl1', name: 'Bienvenue', description: 'Accès au club et au chat', icon: '🤝', clubLevelRequired: 1, reward: { sp: 0 } },
  { id: 'reward_lvl2', name: 'Fonds Communs', description: '+500 SP pour tous les membres', icon: '💰', clubLevelRequired: 2, reward: { sp: 500 } },
  { id: 'reward_lvl3', name: 'Style Élite', description: 'Gadget Reroll de Prestige', icon: '🎲', clubLevelRequired: 3, reward: { itemId: 'gadget_reroll' } },
  { id: 'reward_lvl4', name: 'Aura Secrète', description: 'Gadget Case de Réserve', icon: '📥', clubLevelRequired: 4, reward: { itemId: 'gadget_hold' } },
  { id: 'reward_lvl5', name: 'Couronne Suprême', description: 'Skin Exclusif Or Impérial', icon: '👑', clubLevelRequired: 5, reward: { itemId: 'skin_imperial' } },
];

export const CLUB_EMOJIS = ['🦁', '🐉', '⚔️', '🏰', '👑', '💎', '🔥', '⚡', '🌟', '🎯', '🏆', '🎩', '🌊', '🌸', '⚡', '🦅', '🐺', '🔮', '🎭', '🌌'];

export function getClubLevelInfo(level: number) {
  return CLUB_LEVELS.find(l => l.level === level) || CLUB_LEVELS[0];
}

export function getClubProgress(totalSP: number, level: number): number {
  const currentLevel = CLUB_LEVELS.find(l => l.level === level);
  const nextLevel = CLUB_LEVELS.find(l => l.level === level + 1);
  if (!nextLevel || !currentLevel) return 100;
  const progress = (totalSP - currentLevel.spRequired) / (nextLevel.spRequired - currentLevel.spRequired);
  return Math.min(100, Math.max(0, progress * 100));
}

export function formatSP(sp: number): string {
  if (sp >= 1_000_000) return `${(sp / 1_000_000).toFixed(1)}M`;
  if (sp >= 1_000) return `${(sp / 1_000).toFixed(1)}K`;
  return sp.toString();
}
