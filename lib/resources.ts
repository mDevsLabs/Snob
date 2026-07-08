export interface ResourceItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  rarity: "Commun" | "Rare" | "Épique" | "Légendaire";
  type: "daily_reward" | "mystery_box" | "xp_boost" | "sp_boost";
  consumable: boolean;
  duration?: number;
  effectType: "instant" | "temporary";
  rewards: {
    sp?: number;
    xp?: number;
    items?: string[];
  };
}

export const RESOURCES: ResourceItem[] = [
  {
    id: "daily_reward",
    name: "Récompense Quotidienne",
    description: "Récupère 5 SP (Snob Points) gratuitement chaque jour à minuit. Le compteur se réinitialise automatiquement.",
    icon: "🎁",
    price: 0,
    rarity: "Commun",
    type: "daily_reward",
    consumable: false,
    effectType: "instant",
    rewards: {
      sp: 5
    }
  },
  {
    id: "box_mystery",
    name: "Boîte Mystère",
    description: "Une boîte remplie de surprises aléatoires : SP, XP, gadgets, traînées ou skins exclusifs!",
    icon: "🎁",
    price: 150,
    rarity: "Rare",
    type: "mystery_box",
    consumable: true,
    effectType: "instant",
    rewards: {
      sp: 30,
      xp: 50
    }
  },
  {
    id: "box_epic",
    name: "Boîte Mystère Épique",
    description: "Une boîte de haute gamme avec des récompenses encore plus précieuses. Probabilité accrue sur des items légendaires!",
    icon: "🎁✨",
    price: 600,
    rarity: "Épique",
    type: "mystery_box",
    consumable: true,
    effectType: "instant",
    rewards: {
      sp: 500,
      xp: 500
    }
  },
  {
    id: "xp_boost_2x",
    name: "Boost XP 2x",
    description: "Double les points d'expérience gagnés pendant 5 parties de jeu. Idéal pour grimper rapidement dans le Snob Pass!",
    icon: "⚡⚡",
    price: 400,
    rarity: "Rare",
    type: "xp_boost",
    consumable: true,
    duration: 5,
    effectType: "temporary",
    rewards: {
      xp: 2
    }
  },
  {
    id: "xp_boost_3x",
    name: "Boost XP 3x",
    description: "Triple les points d'expérience gagnés pendant 3 parties de jeu. Une vraie vague de progression!",
    icon: "⚡⚡⚡",
    price: 900,
    rarity: "Épique",
    type: "xp_boost",
    consumable: true,
    duration: 3,
    effectType: "temporary",
    rewards: {
      xp: 3
    }
  },
  {
    id: "sp_boost_100",
    name: "Boost SP +100",
    description: "Un bonus immédiat de 100 SP (Snob Points) pour acheter vos items préférés!",
    icon: "💰💰",
    price: 200,
    rarity: "Commun",
    type: "sp_boost",
    consumable: true,
    effectType: "instant",
    rewards: {
      sp: 100
    }
  },
  {
    id: "sp_boost_250",
    name: "Boost SP +250",
    description: "Un important bonus de 250 SP pour vos achats premium dans la boutique.",
    icon: "💰💰💰",
    price: 450,
    rarity: "Rare",
    type: "sp_boost",
    consumable: true,
    effectType: "instant",
    rewards: {
      sp: 250
    }
  },
  {
    id: "double_lines",
    name: "Double Lignes",
    description: "Double les points pour les double lignes pendant 3 parties. Parfait pour les quêtes!",
    icon: "🔗🔗",
    price: 300,
    rarity: "Rare",
    type: "xp_boost",
    consumable: true,
    duration: 3,
    effectType: "temporary",
    rewards: {}
  }
];