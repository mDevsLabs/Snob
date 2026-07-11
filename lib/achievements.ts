export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  hidden: boolean;
  condition: string;
  reward: { sp?: number; xp?: number };
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'ach_early_bird', name: 'Lève-tôt', description: 'Vous avez joué entre 5h et 7h du matin.', icon: '🌅', hidden: true, condition: 'Jouer entre 5h et 7h du matin', reward: { sp: 200 } },
  { id: 'ach_night_owl', name: 'Noctambule', description: 'Vous avez joué entre 1h et 4h du matin.', icon: '🌙', hidden: true, condition: 'Jouer entre 1h et 4h du matin', reward: { sp: 200 } },
  { id: 'ach_combo_5', name: 'Combo Master', description: 'Atteindre un multiplicateur de combo x5.', icon: '🔥', hidden: false, condition: 'Faire un combo x5', reward: { sp: 500 } },
  { id: 'ach_combo_8', name: 'Combo Légendaire', description: 'Atteindre un multiplicateur de combo x8.', icon: '💥', hidden: true, condition: 'Faire un combo x8', reward: { sp: 1000 } },
  { id: 'ach_prestige_1', name: 'Premier Prestige', description: 'Vous avez atteint le rang Prestige 1.', icon: '🏆', hidden: false, condition: 'Atteindre Prestige 1', reward: { sp: 2000 } },
  { id: 'ach_prestige_10', name: 'Prestige Cosmique', description: 'Vous avez atteint le rang Prestige 10.', icon: '🌌', hidden: true, condition: 'Atteindre Prestige 10', reward: { sp: 10000 } },
  { id: 'ach_perfect_level', name: 'Parfait', description: 'Obtenir 3 étoiles sur un niveau campagne.', icon: '🎯', hidden: false, condition: 'Obtenir 3 étoiles sur un niveau campagne', reward: { sp: 300 } },
  { id: 'ach_perfect_campaign', name: 'Étoile Absolue', description: 'Obtenir 3 étoiles sur tous les niveaux.', icon: '⭐', hidden: true, condition: '3 étoiles sur les 100 niveaux', reward: { sp: 20000 } },
  { id: 'ach_collector_10', name: 'Collectionneur', description: 'Posséder 10 skins différents.', icon: '💎', hidden: false, condition: 'Posséder 10 skins', reward: { sp: 1000 } },
  { id: 'ach_collector_all', name: 'Maître Artisan', description: 'Posséder tous les skins du jeu.', icon: '🎨', hidden: true, condition: 'Posséder TOUS les skins', reward: { sp: 5000 } },
  { id: 'ach_streak_7', name: 'Fidèle', description: 'Se connecter 7 jours de suite.', icon: '📅', hidden: false, condition: 'Streak de 7 jours', reward: { sp: 500 } },
  { id: 'ach_streak_30', name: 'Inconditionnel', description: 'Se connecter 30 jours de suite.', icon: '📅', hidden: true, condition: 'Streak de 30 jours', reward: { sp: 3000 } },
  { id: 'ach_ice_breaker', name: 'Brise-Glace', description: 'Détruire 50 blocs gelés.', icon: '🧊', hidden: false, condition: 'Détruire 50 blocs gelés', reward: { sp: 400 } },
  { id: 'ach_bomber', name: 'Artificier', description: 'Déclencher 20 blocs bombes.', icon: '💣', hidden: false, condition: 'Déclencher 20 blocs bombes', reward: { sp: 400 } },
  { id: 'ach_first_game', name: 'Premier Score', description: 'Terminer sa première partie.', icon: '🏅', hidden: false, condition: 'Terminer sa première partie', reward: { sp: 100 } }
];
