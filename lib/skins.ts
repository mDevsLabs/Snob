export interface Skin {
  id: string;
  name: string;
  price: number;
  color: string; // Used as thumbnail main color
  icon: string;
  description: string;
  rarity: "Commun" | "Rare" | "Épique" | "Légendaire";
  colors: string[]; // 7 block colors aligned with the skin theme
}

export const SKINS: Skin[] = [
  {
    id: "default_skin",
    name: "Classique",
    price: 0,
    color: "bg-blue-500",
    icon: "🟦",
    description: "Le style de base indémodable avec des couleurs de blocs éclatantes.",
    rarity: "Commun",
    colors: [
      "bg-red-500 border border-red-400 shadow-sm",
      "bg-orange-500 border border-orange-400 shadow-sm",
      "bg-yellow-500 border border-yellow-400 shadow-sm",
      "bg-emerald-500 border border-emerald-400 shadow-sm",
      "bg-blue-500 border border-blue-400 shadow-sm",
      "bg-purple-500 border border-purple-400 shadow-sm",
      "bg-cyan-500 border border-cyan-400 shadow-sm"
    ]
  },
  {
    id: "neon_pink",
    name: "Néon Rose",
    price: 500,
    color: "bg-pink-500 shadow-[0_0_10px_#ec4899] border border-pink-300",
    icon: "🌸",
    description: "Ambiance Vaporwave et cyberpunk avec néons fluorescents.",
    rarity: "Rare",
    colors: [
      "bg-pink-500 shadow-[0_0_10px_#ec4899] border border-pink-300",
      "bg-fuchsia-500 shadow-[0_0_10px_#d946ef] border border-fuchsia-300",
      "bg-cyan-400 shadow-[0_0_10px_#22d3ee] border border-cyan-200",
      "bg-indigo-500 shadow-[0_0_10px_#6366f1] border border-indigo-300",
      "bg-purple-600 shadow-[0_0_10px_#9333ea] border border-purple-400",
      "bg-amber-400 shadow-[0_0_10px_#fbbf24] border border-amber-200",
      "bg-rose-500 shadow-[0_0_10px_#f43f5e] border border-rose-300"
    ]
  },
  {
    id: "deep_ocean",
    name: "Abysse Marin",
    price: 800,
    color: "bg-teal-500 border border-teal-300 shadow-[0_0_8px_rgba(20,184,166,0.4)]",
    icon: "🌊",
    description: "Plongez dans l'abysse silencieux. Nuances aquatiques et d'écume marine.",
    rarity: "Rare",
    colors: [
      "bg-teal-500 border border-teal-300 shadow-sm",
      "bg-cyan-600 border border-cyan-400 shadow-sm",
      "bg-emerald-500 border border-emerald-300 shadow-sm",
      "bg-blue-600 border border-blue-400 shadow-sm",
      "bg-sky-500 border border-sky-300 shadow-sm",
      "bg-indigo-700 border border-indigo-500 shadow-sm",
      "bg-teal-700 border border-teal-500 shadow-sm"
    ]
  },
  {
    id: "hacker",
    name: "Code Terminal",
    price: 1200,
    color: "bg-green-500 text-black border border-green-300 shadow-[0_0_8px_#22c55e]",
    icon: "💻",
    description: "Infiltration système. Différentes teintes de vert phosphore rétro-éclairé.",
    rarity: "Rare",
    colors: [
      "bg-green-500 text-black border border-green-300 shadow-[0_0_6px_#22c55e]",
      "bg-emerald-600 text-black border border-emerald-400 shadow-sm",
      "bg-green-700 text-black border border-green-500 shadow-sm",
      "bg-teal-500 text-black border border-teal-300 shadow-sm",
      "bg-zinc-900 text-green-500 border border-green-500 shadow-sm",
      "bg-lime-500 text-black border border-lime-300 shadow-sm",
      "bg-emerald-400 text-black border border-emerald-200 shadow-sm"
    ]
  },
  {
    id: "magic_forest",
    name: "Forêt Féérique",
    price: 1800,
    color: "bg-emerald-700 border border-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.3)]",
    icon: "🌲",
    description: "La magie sylvestre mystique. Couleurs naturelles de mousse et de fleurs.",
    rarity: "Épique",
    colors: [
      "bg-emerald-700 border border-emerald-500 shadow-sm",
      "bg-green-600 border border-green-400 shadow-sm",
      "bg-amber-800 border border-amber-600 shadow-sm",
      "bg-yellow-600 border border-yellow-400 shadow-sm",
      "bg-pink-500 border border-pink-300 shadow-sm",
      "bg-purple-700 border border-purple-500 shadow-sm",
      "bg-emerald-900 border border-emerald-600 shadow-sm"
    ]
  },
  {
    id: "gold_lux",
    name: "Or Impérial",
    price: 2500,
    color: "bg-yellow-400 border-2 border-yellow-200 shadow-[0_0_15px_rgba(250,204,21,0.5)]",
    icon: "🏆",
    description: "Pour ceux qui pèsent. Des nuances dorées et cuivrées scintillantes.",
    rarity: "Épique",
    colors: [
      "bg-yellow-400 border border-yellow-200 shadow-[0_0_10px_rgba(250,204,21,0.4)]",
      "bg-amber-500 border border-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.4)]",
      "bg-orange-500 border border-orange-400 shadow-sm",
      "bg-yellow-300 border border-yellow-100 shadow-sm",
      "bg-yellow-600 border border-yellow-400 shadow-sm",
      "bg-amber-200 border border-white shadow-sm",
      "bg-slate-800 border-2 border-yellow-400 shadow-sm"
    ]
  },
  {
    id: "cyberpunk",
    name: "Néon Cyber",
    price: 3200,
    color: "bg-yellow-400 border border-cyan-400 shadow-[0_0_10px_#eab308]",
    icon: "🤖",
    description: "Le futur est maintenant. Couleurs chromatiques à haute tension.",
    rarity: "Épique",
    colors: [
      "bg-yellow-400 border border-cyan-400 shadow-sm",
      "bg-cyan-400 border border-pink-400 shadow-sm",
      "bg-pink-500 border border-yellow-400 shadow-sm",
      "bg-indigo-600 border border-cyan-300 shadow-sm",
      "bg-purple-600 border border-pink-300 shadow-sm",
      "bg-orange-500 border border-yellow-300 shadow-sm",
      "bg-zinc-900 border-2 border-cyan-400 shadow-sm"
    ]
  },
  {
    id: "magma",
    name: "Noyau Magma",
    price: 4000,
    color: "bg-gradient-to-br from-red-600 to-orange-500 border border-orange-300 shadow-[0_0_10px_#ea580c]",
    icon: "🔥",
    description: "Attention c'est chaud. Éruptions de lave volcanique rougeoyante.",
    rarity: "Épique",
    colors: [
      "bg-red-600 border border-red-400 shadow-[0_0_8px_rgba(220,38,38,0.5)]",
      "bg-orange-500 border border-orange-300 shadow-[0_0_8px_rgba(249,115,22,0.5)]",
      "bg-amber-500 border border-amber-300 shadow-sm",
      "bg-rose-700 border border-rose-500 shadow-sm",
      "bg-slate-700 border border-slate-500 shadow-sm",
      "bg-slate-800 border border-red-500 shadow-sm",
      "bg-gradient-to-br from-red-600 to-yellow-500 border border-amber-300 shadow-sm"
    ]
  },
  {
    id: "eternal_ice",
    name: "Glace Éternelle",
    price: 5000,
    color: "bg-cyan-200 border border-white shadow-[0_0_15px_#22d3ee]",
    icon: "❄️",
    description: "Le froid absolu. Blocs gelés incassables à l'éclat cristallin.",
    rarity: "Légendaire",
    colors: [
      "bg-cyan-100 border border-white shadow-[0_0_8px_rgba(255,255,255,0.8)]",
      "bg-cyan-300 border border-cyan-100 shadow-[0_0_8px_#22d3ee]",
      "bg-blue-400 border border-cyan-100 shadow-sm",
      "bg-sky-200 border border-white shadow-sm",
      "bg-indigo-300 border border-blue-100 shadow-sm",
      "bg-slate-900 border border-cyan-300 shadow-sm",
      "bg-white border-2 border-cyan-400 shadow-md"
    ]
  },
  {
    id: "dark_matter",
    name: "Trou Noir",
    price: 6500,
    color: "bg-slate-900 border-2 border-purple-500 shadow-[0_0_15px_#a855f7]",
    icon: "🌌",
    description: "Absorbe la lumière. Nuances cosmiques et d'obsidienne stellaire.",
    rarity: "Légendaire",
    colors: [
      "bg-slate-900 border border-purple-500 shadow-[0_0_10px_#a855f7]",
      "bg-indigo-950 border border-indigo-500 shadow-[0_0_8px_#4f46e5]",
      "bg-purple-950 border border-purple-400 shadow-sm",
      "bg-blue-950 border border-cyan-500 shadow-sm",
      "bg-zinc-900 border border-slate-700 shadow-sm",
      "bg-fuchsia-950 border border-pink-500 shadow-sm",
      "bg-slate-800 border border-indigo-400 shadow-sm"
    ]
  },
  {
    id: "polar_star",
    name: "Aube Cosmique",
    price: 8000,
    color: "bg-indigo-900 border-2 border-yellow-300 shadow-[0_0_15px_#fbbf24]",
    icon: "🌠",
    description: "Le guide céleste suprême. Des blocs cosmiques dorés et stellaires.",
    rarity: "Légendaire",
    colors: [
      "bg-indigo-900 border border-yellow-200 shadow-[0_0_10px_#fbbf24]",
      "bg-violet-800 border border-pink-300 shadow-[0_0_8px_#db2777]",
      "bg-fuchsia-700 border border-cyan-300 shadow-sm",
      "bg-blue-800 border border-indigo-300 shadow-sm",
      "bg-yellow-300 border border-white shadow-[0_0_8px_#fef08a]",
      "bg-pink-500 border border-white shadow-sm",
      "bg-slate-950 border-2 border-yellow-400 shadow-md"
    ]
  },
  {
    id: "aurora_gradient",
    name: "Aurore Boréale",
    price: 7500,
    color: "bg-gradient-to-tr from-emerald-400 via-cyan-500 to-indigo-600 border border-emerald-200 shadow-[0_0_15px_#10b981]",
    icon: "🌌",
    description: "Le souffle cosmique de l'Arctique. Des dégradés de verts, turquoises et violets mystiques.",
    rarity: "Légendaire",
    colors: [
      "bg-gradient-to-br from-emerald-400 to-cyan-500 border border-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.3)]",
      "bg-gradient-to-br from-cyan-400 to-blue-500 border border-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.3)]",
      "bg-gradient-to-br from-blue-500 to-indigo-600 border border-blue-300 shadow-sm",
      "bg-gradient-to-br from-indigo-500 to-purple-600 border border-indigo-300 shadow-sm",
      "bg-gradient-to-br from-purple-500 to-pink-500 border border-purple-300 shadow-sm",
      "bg-gradient-to-br from-pink-500 to-rose-500 border border-pink-300 shadow-sm",
      "bg-gradient-to-br from-rose-500 to-orange-500 border border-rose-300 shadow-sm"
    ]
  },
  {
    id: "rainbow_dream",
    name: "Rêve Arc-en-Ciel",
    price: 9000,
    color: "bg-gradient-to-r from-red-500 via-green-500 to-blue-500 border border-white shadow-[0_0_15px_rgba(255,255,255,0.5)]",
    icon: "🌈",
    description: "Le spectre lumineux complet. Des blocs multicolores vibrants d'énergie céleste.",
    rarity: "Légendaire",
    colors: [
      "bg-gradient-to-r from-red-500 to-orange-500 border border-red-300 shadow-sm",
      "bg-gradient-to-r from-orange-500 to-yellow-500 border border-orange-300 shadow-sm",
      "bg-gradient-to-r from-yellow-500 to-green-500 border border-yellow-300 shadow-sm",
      "bg-gradient-to-r from-green-500 to-teal-500 border border-green-300 shadow-sm",
      "bg-gradient-to-r from-teal-500 to-blue-500 border border-teal-300 shadow-sm",
      "bg-gradient-to-r from-blue-500 to-indigo-500 border border-blue-300 shadow-sm",
      "bg-gradient-to-r from-indigo-500 to-purple-500 border border-indigo-300 shadow-sm"
    ]
  },
  {
    id: "sunset_glow",
    name: "Eclat du Couchant",
    price: 6000,
    color: "bg-gradient-to-tr from-orange-500 via-pink-500 to-rose-600 border border-orange-300 shadow-[0_0_12px_rgba(249,115,22,0.4)]",
    icon: "🌇",
    description: "La douceur d'une fin de journée d'été. Des dégradés chauds d'oranges, corails et roses profonds.",
    rarity: "Épique",
    colors: [
      "bg-gradient-to-br from-amber-400 to-orange-500 border border-amber-300 shadow-sm",
      "bg-gradient-to-br from-orange-400 to-pink-500 border border-orange-300 shadow-sm",
      "bg-gradient-to-br from-pink-400 to-fuchsia-600 border border-pink-300 shadow-sm",
      "bg-gradient-to-br from-rose-400 to-orange-500 border border-rose-300 shadow-sm",
      "bg-gradient-to-br from-amber-500 to-rose-600 border border-amber-300 shadow-sm",
      "bg-gradient-to-br from-orange-500 to-rose-700 border border-orange-400 shadow-sm",
      "bg-gradient-to-br from-rose-500 to-purple-600 border border-rose-300 shadow-sm"
    ]
  },
  {
    id: "cosmic_nebula",
    name: "Nébuleuse Violette",
    price: 8500,
    color: "bg-gradient-to-tr from-purple-600 via-violet-700 to-indigo-800 border border-purple-300 shadow-[0_0_15px_#7c3aed]",
    icon: "🌌",
    description: "Le berceau des étoiles lointaines. Un tourbillon d'indigo, de violet électrique et de pourpre.",
    rarity: "Légendaire",
    colors: [
      "bg-gradient-to-br from-purple-600 to-indigo-600 border border-purple-400 shadow-sm",
      "bg-gradient-to-br from-indigo-500 to-blue-600 border border-indigo-300 shadow-sm",
      "bg-gradient-to-br from-purple-500 to-pink-500 border border-purple-300 shadow-sm",
      "bg-gradient-to-br from-pink-500 to-rose-600 border border-pink-300 shadow-sm",
      "bg-gradient-to-br from-violet-600 to-fuchsia-700 border border-violet-400 shadow-sm",
      "bg-gradient-to-br from-indigo-700 to-purple-800 border border-indigo-500 shadow-sm",
      "bg-gradient-to-br from-slate-900 to-purple-950 border border-purple-500 shadow-sm"
    ]
  },
  {
    id: "skin_neon_cyber",
    name: "Cyber Néon (S1)",
    price: 0, // Unlocked in pass
    color: "bg-cyan-500 border-2 border-pink-500 shadow-[0_0_15px_#ec4899]",
    icon: "🏍️",
    description: "Vitesse et lumière. Les couleurs d'un futur urbain électrique.",
    rarity: "Légendaire",
    colors: [
      "bg-cyan-400 border border-pink-400 shadow-[0_0_10px_#22d3ee]",
      "bg-pink-500 border border-purple-500 shadow-[0_0_10px_#ec4899]",
      "bg-purple-600 border border-cyan-400 shadow-[0_0_10px_#9333ea]",
      "bg-fuchsia-500 border border-white shadow-[0_0_10px_#d946ef]",
      "bg-blue-500 border border-cyan-300 shadow-[0_0_10px_#3b82f6]",
      "bg-yellow-400 border border-pink-500 shadow-[0_0_10px_#facc15]",
      "bg-indigo-600 border border-cyan-400 shadow-[0_0_10px_#4f46e5]"
    ]
  },
  {
    id: "skin_synthwave",
    name: "Synthwave",
    price: 4500,
    color: "bg-purple-800 border-2 border-orange-500 shadow-[0_0_15px_#f97316]",
    icon: "🌇",
    description: "Nostalgie des années 80 dans une matrice numérique.",
    rarity: "Épique",
    colors: [
      "bg-purple-800 border border-orange-500 shadow-[0_0_8px_#6b21a8]",
      "bg-orange-500 border border-yellow-400 shadow-[0_0_8px_#f97316]",
      "bg-pink-600 border border-purple-400 shadow-sm",
      "bg-indigo-900 border border-pink-500 shadow-sm",
      "bg-cyan-500 border border-white shadow-sm",
      "bg-fuchsia-700 border border-orange-400 shadow-sm",
      "bg-rose-500 border border-yellow-300 shadow-sm"
    ]
  }
];
