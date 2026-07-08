"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState, View, InventoryItem, GridShape } from './types';

export const AppContext = createContext<AppState | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [view, setView] = useState<View>('home');
  const [sp, setSp] = useState(0);
  const [gems, setGems] = useState(0);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [equippedSkin, setEquippedSkin] = useState('default');
  const [gridShape, setGridShape] = useState<GridShape>('square');
  const [highScore, setHighScore] = useState(0);
  const [xp, setXp] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setSp(parseInt(localStorage.getItem('snob_sp') || '100', 10));
      setGems(parseInt(localStorage.getItem('snob_gems') || '50', 10));
      setHighScore(parseInt(localStorage.getItem('snob_highScore') || '0', 10));
      setXp(parseInt(localStorage.getItem('snob_xp') || '0', 10));
      setEquippedSkin(localStorage.getItem('snob_skin') || 'default');
      setGridShape((localStorage.getItem('snob_gridShape') as GridShape) || 'square');
      
      const savedInv = localStorage.getItem('snob_inventory');
      if (savedInv) {
        setInventory(JSON.parse(savedInv));
      } else {
        setInventory([
          { id: '1', itemId: 'bomb', type: 'gadget', rarity: 'Common', name: 'Bomb', timestamp: Date.now() },
          { id: '2', itemId: 'bomb', type: 'gadget', rarity: 'Common', name: 'Bomb', timestamp: Date.now() },
          { id: '3', itemId: 'laser', type: 'gadget', rarity: 'Rare', name: 'Laser', timestamp: Date.now() },
          { id: '4', itemId: 'reroll', type: 'gadget', rarity: 'Common', name: 'Reroll', timestamp: Date.now() },
          { id: '5', itemId: 'hourglass', type: 'gadget', rarity: 'Epic', name: 'Hourglass', timestamp: Date.now() },
          { id: '6', itemId: 'skin-liquid-ice', type: 'skin', rarity: 'Legendary', name: 'Liquid Ice', timestamp: Date.now() },
        ]);
      }
      setLoaded(true);
    }, 0);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem('snob_sp', sp.toString());
    localStorage.setItem('snob_gems', gems.toString());
    localStorage.setItem('snob_highScore', highScore.toString());
    localStorage.setItem('snob_xp', xp.toString());
    localStorage.setItem('snob_skin', equippedSkin);
    localStorage.setItem('snob_gridShape', gridShape);
    localStorage.setItem('snob_inventory', JSON.stringify(inventory));
  }, [sp, gems, highScore, xp, equippedSkin, gridShape, inventory, loaded]);

  const addSp = (a: number) => setSp(s => s + a);
  const addGems = (a: number) => setGems(g => g + a);
  const spend = (s: number, g: number) => {
    if (sp >= s && gems >= g) {
      setSp(prev => prev - s);
      setGems(prev => prev - g);
      return true;
    }
    return false;
  };

  const addInventoryItem = (item: Omit<InventoryItem, 'id' | 'timestamp'>) => {
    setInventory(prev => [{ ...item, id: Math.random().toString(36).substr(2, 9), timestamp: Date.now() }, ...prev]);
  };

  const consumeGadget = (itemId: string) => {
    const index = inventory.findIndex(i => i.itemId === itemId);
    if (index !== -1) {
      const newInv = [...inventory];
      newInv.splice(index, 1);
      setInventory(newInv);
      return true;
    }
    return false;
  };

  const getGadgetCount = (itemId: string) => inventory.filter(i => i.itemId === itemId).length;

  return (
    <AppContext.Provider value={{
      view, setView,
      sp, gems, addSp, addGems, spend,
      inventory, addInventoryItem,
      equippedSkin, setEquippedSkin,
      gridShape, setGridShape,
      consumeGadget, getGadgetCount,
      highScore, setHighScore,
      xp, addXp: (a) => setXp(x => x + a),
      snobPassUnlocked: false,
      claimedSnobPassTiers: [],
      consumeItem: () => false,
      buySnobPass: () => false,
      claimSnobPassReward: () => false
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
