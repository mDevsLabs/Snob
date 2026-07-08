export interface Gadget {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  rarity: "Rare" | "Épique" | "Légendaire";
}

export const GADGETS: Gadget[] = [
  {
    id: "gadget_rotate",
    name: "Rotation Tactique",
    description: "Permet de faire pivoter vos blocs à 90° d'un simple clic pour trouver l'emplacement idéal.",
    icon: "🔄",
    price: 200,
    rarity: "Rare"
  },
  {
    id: "gadget_hold",
    name: "Case de Réserve",
    description: "Débloque la réserve de blocs (Hold) pour conserver temporairement une pièce et l'utiliser plus tard.",
    icon: "📥",
    price: 400,
    rarity: "Épique"
  },
  {
    id: "gadget_reroll",
    name: "Reroll de Prestige",
    description: "Débloque la capacité à relancer l'intégralité de sa main de blocs en cours de partie contre 50 SP.",
    icon: "🎲",
    price: 300,
    rarity: "Rare"
  },
  {
    id: "gadget_neon_blaster",
    name: "Blaster Néon",
    description: "Détruit un bloc unique sur la grille en un éclair de plasma.",
    icon: "🔫",
    price: 0, // Unlocked via Snob Pass
    rarity: "Épique"
  },
  {
    id: "gadget_time_freeze",
    name: "Gel Temporel",
    description: "Fige le chronomètre pendant 5 secondes dans les modes de jeu chronométrés.",
    icon: "⏱️",
    price: 0, // Unlocked via Snob Pass
    rarity: "Légendaire"
  }
];
