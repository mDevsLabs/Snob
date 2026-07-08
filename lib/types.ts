export type View = 'home' | 'game' | 'inventory' | 'store' | 'bp';
export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';
export type ItemType = 'gadget' | 'skin' | 'vfx';
export type GridShape = 'square' | 'donut' | 'diamond';

export interface InventoryItem {
  id: string; 
  itemId: string; 
  type: ItemType;
  rarity: Rarity;
  name: string;
  timestamp: number;
}

export interface StoreItem {
  id: string;
  type: ItemType | 'lootbox' | 'currency';
  itemId?: string;
  rarity: Rarity;
  name: string;
  price: number;
  currency: 'sp' | 'gems';
}

export interface AppState {
  view: View;
  setView: (v: View) => void;
  sp: number;
  gems: number;
  addSp: (amount: number) => void;
  addGems: (amount: number) => void;
  spend: (spAmount: number, gemsAmount: number) => boolean;
  inventory: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'timestamp'>) => void;
  equippedSkin: string;
  setEquippedSkin: (skinId: string) => void;
  gridShape: GridShape;
  setGridShape: (shape: GridShape) => void;
  consumeGadget: (itemId: string) => boolean;
  getGadgetCount: (itemId: string) => number;
  highScore: number;
  setHighScore: (score: number) => void;
  xp: number;
  addXp: (amount: number) => void;
  snobPassUnlocked: boolean;
  claimedSnobPassTiers: number[];
  consumeItem: (itemId: string) => boolean;
  buySnobPass: () => boolean;
  claimSnobPassReward: (tier: number, rewardType: string, rewardId: string, amount: number) => boolean;
}
export type TabType = "classic" | "campaign" | "blitz" | "quests" | "profile" | "inventory" | "shop" | "snob-pass";
