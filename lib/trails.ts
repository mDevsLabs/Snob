export interface TrailEffect {
  id: string;
  name: string;
  price: number;
  icon: string;
  description: string;
  rarity: "Commun" | "Rare" | "Épique" | "Légendaire";
  particleColor: string; // Tailwind color class or custom classes
  type: "sparkles" | "fire" | "nebula" | "rainbow" | "binary" | "none";
  chars?: string[];
}

export const TRAILS: TrailEffect[] = [
  {
    id: "default_trail",
    name: "Sans Effet",
    price: 0,
    icon: "🚫",
    description: "Pas d'effet visuel lors du déplacement des pièces.",
    rarity: "Commun",
    particleColor: "",
    type: "none"
  },
  {
    id: "sparkle_gold",
    name: "Étincelles Dorées",
    price: 600,
    icon: "✨",
    description: "Sillage d'étoiles magiques et de paillettes dorées scintillantes.",
    rarity: "Rare",
    particleColor: "text-amber-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]",
    type: "sparkles",
    chars: ["✨", "⭐", "▫️", "✦"]
  },
  {
    id: "binary_flow",
    name: "Flux Binaire",
    price: 1200,
    icon: "💻",
    description: "Flux de chiffres informatiques verts fluorescents qui tombent derrière la pièce.",
    rarity: "Rare",
    particleColor: "text-green-400 font-mono text-xs drop-shadow-[0_0_6px_rgba(74,222,128,0.8)]",
    type: "binary",
    chars: ["0", "1"]
  },
  {
    id: "fire_trail",
    name: "Sillage de Feu",
    price: 1800,
    icon: "🔥",
    description: "Des étincelles de lave chaude et des braises ardentes fument derrière vos blocs.",
    rarity: "Épique",
    particleColor: "text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.9)]",
    type: "fire",
    chars: ["🔥", "💥", "🔸", "•"]
  },
  {
    id: "nebula_glow",
    name: "Halo Cosmique",
    price: 2500,
    icon: "🌌",
    description: "Un sillage mystique de gaz spatiaux et de poussières de nébuleuses violettes.",
    rarity: "Épique",
    particleColor: "text-purple-400 drop-shadow-[0_0_12px_rgba(192,132,252,0.9)]",
    type: "nebula",
    chars: ["💫", "🔮", "▫️", "✨"]
  },
  {
    id: "rainbow_dash",
    name: "Sillage Arc-en-Ciel",
    price: 4500,
    icon: "🌈",
    description: "Une explosion chromatique multicolore qui s'estompe avec grâce.",
    rarity: "Légendaire",
    particleColor: "bg-gradient-to-r from-red-500 via-green-500 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]",
    type: "rainbow",
    chars: ["🌈", "❤️", "💛", "💚", "💙", "💜"]
  },
  {
    id: "trail_matrix",
    name: "Cyber Flux (S1)",
    price: 0,
    icon: "📟",
    description: "Pluie numérique issue du cœur de la matrice.",
    rarity: "Légendaire",
    particleColor: "text-green-500 drop-shadow-[0_0_8px_#22c55e]",
    type: "sparkles",
    chars: ["0", "1", "<", ">", "_"]
  },
  {
    id: "trail_plasma",
    name: "Plasma Synth",
    price: 3200,
    icon: "⚡",
    description: "Traînées de plasma ionisé à haute fréquence.",
    rarity: "Épique",
    particleColor: "text-cyan-400 drop-shadow-[0_0_10px_#22d3ee]",
    type: "sparkles",
    chars: ["⚡", "〰️", "▪️", "💥"]
  }
];
