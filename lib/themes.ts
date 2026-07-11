import type { Rarity } from './avatars';

export type ThemeCategory = 'Gratuit' | 'Premium' | 'Légendaire';

export interface Theme {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  rarity: Rarity;
  category: ThemeCategory;
  background: string;
  sidebarBg: string;
  cardBg: string;
  accentColor: string;
  textColor: string;
  // CSS variables for dynamic theming
  cssVars?: Record<string, string>;
}

export const THEMES: Theme[] = [
  {
    id: 'theme_classic',
    name: 'Classique Sombre',
    description: 'Le thème original. Sobre, élégant, intemporel.',
    icon: '🏛️',
    price: 0,
    rarity: 'Commun',
    category: 'Gratuit',
    background: 'bg-slate-950',
    sidebarBg: 'bg-slate-900',
    cardBg: 'bg-slate-900/50',
    accentColor: 'hsl(45, 100%, 50%)',
    textColor: 'text-slate-100',
  },
  {
    id: 'theme_cyberpunk',
    name: 'Casino Cyberpunk',
    description: 'Néons scintillants et atmosphère futuriste underground.',
    icon: '🎰',
    price: 2000,
    rarity: 'Rare',
    category: 'Premium',
    background: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900 via-slate-900 to-black',
    sidebarBg: 'bg-purple-950/80',
    cardBg: 'bg-fuchsia-900/20 border-fuchsia-500/30',
    accentColor: 'hsl(300, 100%, 50%)',
    textColor: 'text-fuchsia-50',
  },
  {
    id: 'theme_manor',
    name: 'Manoir Classique',
    description: 'Bois sombre, or vieilli et velours bordeaux aristocratique.',
    icon: '🏰',
    price: 3500,
    rarity: 'Rare',
    category: 'Premium',
    background: 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-950 via-zinc-900 to-black',
    sidebarBg: 'bg-red-950/40',
    cardBg: 'bg-amber-900/10 border-amber-900/30',
    accentColor: 'hsl(45, 100%, 60%)',
    textColor: 'text-amber-50',
  },
  {
    id: 'theme_aqua',
    name: 'Salon VIP Aqua',
    description: "Plongez dans les profondeurs de l'océan VIP.",
    icon: '🌊',
    price: 5000,
    rarity: 'Épique',
    category: 'Premium',
    background: 'bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-cyan-900 via-blue-950 to-slate-950',
    sidebarBg: 'bg-blue-950/50',
    cardBg: 'bg-cyan-900/20 border-cyan-500/20',
    accentColor: 'hsl(190, 100%, 50%)',
    textColor: 'text-cyan-50',
  },
  {
    id: 'theme_zen',
    name: 'Jardin Zen',
    description: 'Sakuras en fleur et sérénité absolue du palais impérial.',
    icon: '🌸',
    price: 4000,
    rarity: 'Épique',
    category: 'Premium',
    background: 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-900 via-slate-900 to-black',
    sidebarBg: 'bg-rose-950/30',
    cardBg: 'bg-pink-900/10 border-pink-500/20',
    accentColor: 'hsl(330, 100%, 70%)',
    textColor: 'text-pink-50',
  },
  {
    id: 'theme_cosmos',
    name: 'Cosmos Infini',
    description: 'Voyagez à travers les nébuleuses et galaxies lointaines.',
    icon: '🌌',
    price: 6500,
    rarity: 'Épique',
    category: 'Premium',
    background: 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900 via-slate-950 to-black',
    sidebarBg: 'bg-indigo-950/50',
    cardBg: 'bg-indigo-900/20 border-indigo-500/20',
    accentColor: 'hsl(250, 100%, 75%)',
    textColor: 'text-indigo-100',
  },
  {
    id: 'theme_forest',
    name: 'Forêt Enchantée',
    description: 'La magie des sous-bois lumineux et des elfes du prestige.',
    icon: '🌲',
    price: 4500,
    rarity: 'Épique',
    category: 'Premium',
    background: 'bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-900 via-green-950 to-slate-950',
    sidebarBg: 'bg-emerald-950/50',
    cardBg: 'bg-green-900/20 border-emerald-500/20',
    accentColor: 'hsl(150, 80%, 45%)',
    textColor: 'text-emerald-50',
  },
  {
    id: 'theme_synthwave',
    name: 'Synthwave Retro',
    description: 'Nostalgie electro des années 80, grilles et palmiers néon.',
    icon: '⚡',
    price: 8000,
    rarity: 'Légendaire',
    category: 'Légendaire',
    background: 'bg-[linear-gradient(to_bottom,_var(--tw-gradient-stops))] from-fuchsia-950 via-purple-950 to-orange-950',
    sidebarBg: 'bg-fuchsia-950/40',
    cardBg: 'bg-purple-900/30 border-orange-500/30',
    accentColor: 'hsl(30, 100%, 50%)',
    textColor: 'text-orange-100',
  },
  {
    id: 'theme_dark_dimension',
    name: 'Dimension Sombre',
    description: "Le vide absolu et son pouvoir mystique obscur.",
    icon: '🔮',
    price: 10000,
    rarity: 'Légendaire',
    category: 'Légendaire',
    background: 'bg-black',
    sidebarBg: 'bg-zinc-950',
    cardBg: 'bg-zinc-900/50 border-purple-500/10',
    accentColor: 'hsl(280, 100%, 40%)',
    textColor: 'text-purple-100',
  },
  {
    id: 'theme_celestial',
    name: 'Cité Céleste',
    description: "Au sommet des nuages dorés, le palais des dieux du jeu.",
    icon: '☁️',
    price: 12000,
    rarity: 'Légendaire',
    category: 'Légendaire',
    background: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-900 via-amber-950 to-orange-950',
    sidebarBg: 'bg-yellow-950/60',
    cardBg: 'bg-yellow-900/20 border-yellow-500/30',
    accentColor: 'hsl(48, 100%, 60%)',
    textColor: 'text-yellow-50',
  },
];

export const THEME_CATEGORY_COLORS: Record<ThemeCategory, string> = {
  'Gratuit': 'text-slate-300 border-slate-500/40 bg-slate-500/10',
  'Premium': 'text-blue-300 border-blue-500/40 bg-blue-500/10',
  'Légendaire': 'text-yellow-300 border-yellow-500/40 bg-yellow-500/10',
};
