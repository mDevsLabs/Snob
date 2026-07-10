export interface ClubMember {
  uid: string;
  username: string;
  avatar: string;
  role: 'owner' | 'officer' | 'member';
  contributedSP: number;
  joinedAt: string;
}

export interface Club {
  id: string;
  name: string;
  icon: string;
  members: ClubMember[];
  totalSP: number;
  level: number;
  createdAt: string;
  maxMembers: number;
}

export interface ClubReward {
  id: string;
  name: string;
  description: string;
  icon: string;
  clubLevelRequired: number;
  reward: { sp?: number; xp?: number; itemId?: string };
}

export const CLUB_LEVELS = [
  { level: 1, name: 'Cercle Privé', spRequired: 0 },
  { level: 2, name: 'Salon Distingué', spRequired: 5000 },
  { level: 3, name: 'Club Élite', spRequired: 25000 },
  { level: 4, name: 'Société Secrète', spRequired: 100000 },
  { level: 5, name: 'Ordre Suprême', spRequired: 500000 },
];

export const CLUB_REWARDS: ClubReward[] = [
  { id: 'reward_lvl1', name: 'Bienvenue', description: 'Accès au club', icon: '🤝', clubLevelRequired: 1, reward: { sp: 0 } },
  { id: 'reward_lvl2', name: 'Fonds Communs', description: '+500 SP pour tous les membres', icon: '💰', clubLevelRequired: 2, reward: { sp: 500 } },
  { id: 'reward_lvl3', name: 'Style Élite', description: 'Gadget Reroll de Prestige', icon: '🎲', clubLevelRequired: 3, reward: { itemId: 'gadget_reroll' } },
  { id: 'reward_lvl4', name: 'Aura Secrète', description: 'Gadget Case de Réserve', icon: '📥', clubLevelRequired: 4, reward: { itemId: 'gadget_hold' } },
  { id: 'reward_lvl5', name: 'Couronne Suprême', description: 'Skin Exclusif Or Impérial', icon: '👑', clubLevelRequired: 5, reward: { itemId: 'skin_imperial' } }
];
