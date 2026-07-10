export interface Theme {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  rarity: 'Commun' | 'Rare' | 'Épique' | 'Légendaire';
  background: string;
  sidebarBg: string;
  cardBg: string;
  accentColor: string;
  textColor: string;
}

export const THEMES: Theme[] = [
  {
    id: 'theme_classic',
    name: 'Classique Sombre',
    description: 'Le thème original, sobre et élégant.',
    icon: '🏛️',
    price: 0,
    rarity: 'Commun',
    background: 'bg-slate-950',
    sidebarBg: 'bg-slate-900',
    cardBg: 'bg-slate-900/50',
    accentColor: 'hsl(45, 100%, 50%)', // Yellow
    textColor: 'text-slate-100'
  },
  {
    id: 'theme_cyberpunk',
    name: 'Casino Cyberpunk',
    description: 'Néons scintillants et atmosphère futuriste.',
    icon: '🎰',
    price: 2000,
    rarity: 'Rare',
    background: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900 via-slate-900 to-black',
    sidebarBg: 'bg-purple-950/80',
    cardBg: 'bg-fuchsia-900/20 border-fuchsia-500/30',
    accentColor: 'hsl(300, 100%, 50%)', // Fuchsia
    textColor: 'text-fuchsia-50'
  },
  {
    id: 'theme_manor',
    name: 'Manoir Classique',
    description: 'Bois sombre, or et velours bordeaux.',
    icon: '🏰',
    price: 3500,
    rarity: 'Rare',
    background: 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-950 via-zinc-900 to-black',
    sidebarBg: 'bg-red-950/40',
    cardBg: 'bg-amber-900/10 border-amber-900/30',
    accentColor: 'hsl(45, 100%, 60%)', // Gold
    textColor: 'text-amber-50'
  },
  {
    id: 'theme_aqua',
    name: 'Salon VIP Aqua',
    description: 'Plongez dans les profondeurs de l\'océan.',
    icon: '🌊',
    price: 5000,
    rarity: 'Épique',
    background: 'bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-cyan-900 via-blue-950 to-slate-950',
    sidebarBg: 'bg-blue-950/50',
    cardBg: 'bg-cyan-900/20 border-cyan-500/20',
    accentColor: 'hsl(190, 100%, 50%)', // Cyan
    textColor: 'text-cyan-50'
  },
  {
    id: 'theme_zen',
    name: 'Jardin Zen',
    description: 'Sakuras et sérénité absolue.',
    icon: '🌸',
    price: 4000,
    rarity: 'Épique',
    background: 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-900 via-slate-900 to-black',
    sidebarBg: 'bg-rose-950/30',
    cardBg: 'bg-pink-900/10 border-pink-500/20',
    accentColor: 'hsl(330, 100%, 70%)', // Pink
    textColor: 'text-pink-50'
  },
  {
    id: 'theme_cosmos',
    name: 'Cosmos Infini',
    description: 'Voyagez à travers les nébuleuses.',
    icon: '🌌',
    price: 6500,
    rarity: 'Épique',
    background: 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900 via-slate-950 to-black',
    sidebarBg: 'bg-indigo-950/50',
    cardBg: 'bg-indigo-900/20 border-indigo-500/20',
    accentColor: 'hsl(250, 100%, 75%)', // Indigo
    textColor: 'text-indigo-100'
  },
  {
    id: 'theme_synthwave',
    name: 'Synthwave Retro',
    description: 'Nostalgie des années 80.',
    icon: '⚡',
    price: 8000,
    rarity: 'Légendaire',
    background: 'bg-[linear-gradient(to_bottom,_var(--tw-gradient-stops))] from-fuchsia-950 via-purple-950 to-orange-950',
    sidebarBg: 'bg-fuchsia-950/40 border-r border-orange-500/20',
    cardBg: 'bg-purple-900/30 border-orange-500/30',
    accentColor: 'hsl(30, 100%, 50%)', // Orange
    textColor: 'text-orange-100'
  },
  {
    id: 'theme_dark_dimension',
    name: 'Dimension Sombre',
    description: 'Le vide absolu et son pouvoir.',
    icon: '🔮',
    price: 10000,
    rarity: 'Légendaire',
    background: 'bg-black',
    sidebarBg: 'bg-zinc-950',
    cardBg: 'bg-zinc-900/50 border-purple-500/10',
    accentColor: 'hsl(280, 100%, 40%)', // Deep Purple
    textColor: 'text-purple-100'
  }
];
