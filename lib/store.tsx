"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { differenceInDays, isSameDay, startOfDay } from "date-fns";
import { authClient } from "./auth-client";
import dailyQuestsData from "./dailyQuests.json";
import weeklyQuestsData from "./weeklyQuests.json";
import { SKINS } from "./skins";
import { TRAILS } from "./trails";
import { GADGETS } from "./gadgets";

export interface LootResult {
  type: "xp" | "sp" | "gadget" | "trail" | "skin" | "sp_xp";
  amount?: number;
  xpGained?: number; // for box_mystery double loot
  itemId?: string;
  itemRarity?: string;
  itemName?: string;
  itemIcon?: string;
  compensated?: boolean;
  compensationAmount?: number;
}


export interface GameSession {
  id: string;
  date: string;
  score: number;
  type: "classic" | "campaign" | "blitz";
}

const generateInitialHistory = (): GameSession[] => {
  const dates = [
    new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  ];
  return [
    { id: "h1", date: dates[0], score: 2400, type: "classic" },
    { id: "h2", date: dates[1], score: 4100, type: "classic" },
    { id: "h3", date: dates[2], score: 3900, type: "blitz" },
    { id: "h4", date: dates[3], score: 5200, type: "classic" },
    { id: "h5", date: dates[4], score: 6800, type: "classic" },
  ];
};

export type PrestigeRank =
  | "None"
  | "Bronze"
  | "Silver"
  | "Gold"
  | "Platinum"
  | "Diamond"
  | "Master"
  | "Grandmaster"
  | "Plasma"
  | "Dark Matter"
  | "Cosmic";

export const PRESTIGE_RANKS: PrestigeRank[] = [
  "None",
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Diamond",
  "Master",
  "Grandmaster",
  "Plasma",
  "Dark Matter",
  "Cosmic",
];

export interface Quest {
  id: string;
  type: "lines" | "blitz_played" | "score" | "doubles";
  target: number;
  progress: number;
  description: string;
  rewardCoins: number;
  rewardXp: number;
  completed: boolean;
  isWeekly: boolean;
}

interface GameState {
  coins: number;
  sp: number;
  xp: number;
  level: number;
  prestige: number;
  streak: number;
  lastLoginDate: string | null;
  dailyQuests: Quest[];
  weeklyQuests: Quest[];
  campaignStars: Record<number, number>;
  showLoginModal: boolean;
  streakBroken: boolean;
  soundEnabled: boolean;
  classicHighScore: number;
  inventory: string[];
  equippedSkin: string;
  equippedTrail: string;
  username: string;
  avatar: string;
  bio: string;
  uid: string | null;
  email: string | null;
  authResolved: boolean;
  gameHistory: GameSession[];
  levelUpReward: { level: number; spGained: number } | null;
  showAuthModal: boolean;
  snobPassUnlocked: boolean;
  claimedSnobPassTiers: number[];
  dismissLevelUpReward: () => void;
  claimQuestReward: (questId: string) => boolean;
  claimDailyReward: () => boolean;
  dailyRewardClaimed: boolean;
  lastDailyRewardClaim: string | null;
  setProfile: (username: string, avatar: string, bio: string) => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  addCoins: (amount: number) => void;
  addSp: (amount: number) => void;
  addXp: (amount: number) => void;
  doPrestige: () => void;
  claimDaily: () => void;
  closeLoginModal: () => void;
  rerollQuest: (questId: string) => void;
  updateQuestProgress: (type: string, amount: number) => void;
  saveCampaignResult: (levelId: number, stars: number) => void;
  toggleSound: () => void;
  buyItem: (itemId: string, price: number, isConsumable?: boolean) => boolean;
  equipSkin: (itemId: string) => void;
  equipTrail: (itemId: string) => void;
  consumeItem: (itemId: string) => boolean;
  buySnobPass: () => boolean;
  claimSnobPassReward: (tier: number, rewardType: string, rewardId: string, amount: number) => boolean;
  updateClassicHighScore: (score: number) => void;
  recordGame: (score: number, type: "classic" | "campaign" | "blitz") => void;
  buyMysteryBox: (boxType: "mystery" | "epic") => { success: boolean; loot?: LootResult; error?: string };
}

const defaultState: GameState = {
  coins: 0,
  sp: 0,
  xp: 0,
  level: 1,
  prestige: 0,
  streak: 0,
  lastLoginDate: null,
  dailyQuests: [],
  weeklyQuests: [],
  campaignStars: {},
  showLoginModal: false,
  streakBroken: false,
  soundEnabled: true,
  classicHighScore: 0,
  inventory: ["default_skin", "default_trail"],
  equippedSkin: "default_skin",
  equippedTrail: "default_trail",
  username: "Snob Anonyme",
  avatar: "🎩",
  bio: "Je suis un snob mystérieux.",
  uid: null,
  email: null,
  authResolved: false,
  gameHistory: [],
  levelUpReward: null,
  showAuthModal: false,
  snobPassUnlocked: false,
  claimedSnobPassTiers: [],
  dismissLevelUpReward: () => {},
  claimQuestReward: () => false,
  claimDailyReward: () => false,
  dailyRewardClaimed: false,
  lastDailyRewardClaim: null,
  setProfile: () => {},
  openAuthModal: () => {},
  closeAuthModal: () => {},
  loginWithGoogle: async () => {},
  loginWithEmail: async () => {},
  registerWithEmail: async () => {},
  logout: async () => {},
  addCoins: () => {},
  addSp: () => {},
  addXp: () => {},
  doPrestige: () => {},
  claimDaily: () => {},
  closeLoginModal: () => {},
  rerollQuest: () => {},
  updateQuestProgress: () => {},
  saveCampaignResult: () => {},
  toggleSound: () => {},
  buyItem: () => false,
  equipSkin: () => {},
  equipTrail: () => {},
  consumeItem: () => false,
  buySnobPass: () => false,
  claimSnobPassReward: () => false,
  updateClassicHighScore: () => {},
  recordGame: () => {},
  buyMysteryBox: () => ({ success: false, error: "Not implemented" }),
};

const GameContext = createContext<GameState>(defaultState);

const generateDailyQuests = (): Quest[] => {
  const shuffled = [...dailyQuestsData].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3).map((q, idx) => ({
    id: `d-${idx + 1}-${Date.now()}`,
    type: q.type as any,
    target: q.target,
    progress: 0,
    description: q.description,
    rewardCoins: q.rewardCoins,
    rewardXp: q.rewardXp,
    completed: false,
    isWeekly: false,
  }));
};

const generateWeeklyQuests = (): Quest[] => {
  const shuffled = [...weeklyQuestsData].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 2).map((q, idx) => ({
    id: `w-${idx + 1}-${Date.now()}`,
    type: q.type as any,
    target: q.target,
    progress: 0,
    description: q.description,
    rewardCoins: q.rewardCoins,
    rewardXp: q.rewardXp,
    completed: false,
    isWeekly: true,
  }));
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<Partial<GameState>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Better Auth Session listener
  useEffect(() => {
    const handleSessionChange = () => {
      const stored = localStorage.getItem("better_auth_session");
      if (stored) {
        const { user } = JSON.parse(stored);
        setState((s) => ({ 
          ...s, 
          uid: user.id, 
          email: user.email, 
          username: (s.username === "Snob Anonyme" || !s.username) ? user.name : s.username,
          authResolved: true 
        }));
      } else {
        setState((s) => ({ ...s, uid: null, email: null, authResolved: true }));
      }
    };

    handleSessionChange();
    window.addEventListener("better-auth-session-change", handleSessionChange);
    return () => {
      window.removeEventListener("better-auth-session-change", handleSessionChange);
    };
  }, []);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem("tetris_meta_state");
    let parsed = saved ? JSON.parse(saved) : {};
    
    const today = startOfDay(new Date()).toISOString();
    let streak = parsed.streak || 0;
    let lastLogin = parsed.lastLoginDate;
    let streakBroken = false;
    let showModal = false;

    if (lastLogin) {
      const daysDiff = differenceInDays(new Date(today), new Date(lastLogin));
      if (daysDiff === 1) {
        // Logged in yesterday, streak continues, wait for claim
        showModal = true;
      } else if (daysDiff > 1) {
        // Missed a day
        streak = 0;
        streakBroken = true;
        showModal = true;
      } else {
        // Already logged in today
        showModal = false;
      }
    } else {
      // First time playing
      showModal = true;
    }

    // Refresh quests if needed (simplified: just check if empty)
    let dQuests = parsed.dailyQuests?.length ? parsed.dailyQuests : generateDailyQuests();
    let wQuests = parsed.weeklyQuests?.length ? parsed.weeklyQuests : generateWeeklyQuests();
    let history = parsed.gameHistory?.length ? parsed.gameHistory : generateInitialHistory();
    
    // Check for daily reset
    const lastQuestReset = parsed.lastQuestResetDate;
    let shouldResetQuests = false;
    let dailyRewardClaimed = parsed.dailyRewardClaimed ?? false;
    
    if (lastQuestReset && differenceInDays(new Date(today), new Date(lastQuestReset)) > 0) {
      shouldResetQuests = true;
      dailyRewardClaimed = false;
    }
    
    if (shouldResetQuests) {
      dQuests = generateDailyQuests();
    }
    
    // Check if daily reward was already claimed today
    const lastDailyReward = parsed.lastDailyRewardClaim;
    if (lastDailyReward && isSameDay(new Date(lastDailyReward), new Date())) {
      dailyRewardClaimed = true;
    }
    
    // Also check if the item "daily_reward" is in inventory
    if (parsed.inventory?.includes("daily_reward")) {
      dailyRewardClaimed = true;
    }
    
    // Initialize lastDailyRewardClaim if not set
    if (!lastDailyReward) {
      parsed.lastDailyRewardClaim = null;
    }

    setTimeout(() => {
      setState({
        ...parsed,
        streak,
        lastLoginDate: lastLogin,
        streakBroken,
        showLoginModal: showModal,
        dailyQuests: dQuests,
        weeklyQuests: wQuests,
        gameHistory: history,
        coins: parsed.coins || 0,
        xp: parsed.xp || 0,
        level: parsed.level || 1,
        prestige: parsed.prestige || 0,
        campaignStars: parsed.campaignStars || {},
        soundEnabled: parsed.soundEnabled ?? true,
        classicHighScore: parsed.classicHighScore || 0,
        inventory: parsed.inventory || ["default_skin", "default_trail"],
        equippedSkin: parsed.equippedSkin || "default_skin",
        equippedTrail: parsed.equippedTrail || "default_trail",
        username: parsed.username || "Snob Anonyme",
        bio: parsed.bio || "Je suis un snob mystérieux.",
        avatar: parsed.avatar || "🎩",
        snobPassUnlocked: parsed.snobPassUnlocked || false,
        claimedSnobPassTiers: parsed.claimedSnobPassTiers || [],
        dailyRewardClaimed: dailyRewardClaimed,
        lastDailyRewardClaim: parsed.lastDailyRewardClaim || null,
      });
      setIsLoaded(true);
    }, 0);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("tetris_meta_state", JSON.stringify({
        coins: state.coins,
        xp: state.xp,
        level: state.level,
        prestige: state.prestige,
        streak: state.streak,
        lastLoginDate: state.lastLoginDate,
        dailyQuests: state.dailyQuests,
        weeklyQuests: state.weeklyQuests,
        gameHistory: state.gameHistory,
        campaignStars: state.campaignStars,
        soundEnabled: state.soundEnabled,
        classicHighScore: state.classicHighScore,
        inventory: state.inventory,
        equippedSkin: state.equippedSkin,
        equippedTrail: state.equippedTrail,
        username: state.username,
        bio: state.bio,
        avatar: state.avatar,
        snobPassUnlocked: state.snobPassUnlocked,
        claimedSnobPassTiers: state.claimedSnobPassTiers,
        dailyRewardClaimed: state.dailyRewardClaimed,
        lastQuestResetDate: startOfDay(new Date()).toISOString(),
        lastDailyRewardClaim: state.lastDailyRewardClaim
      }));
    }
  }, [state, isLoaded]);

  const addCoins = (amount: number) => {
    setState((s) => ({ ...s, coins: (s.coins || 0) + amount }));
  };

  const addSp = (amount: number) => {
    addCoins(amount);
  };

  const addXp = (amount: number) => {
    setState((s) => {
      const prestigeMult = 1 + (s.prestige || 0) * 0.1;
      const actualXp = amount * prestigeMult;
      let newXp = (s.xp || 0) + actualXp;
      let newLevel = s.level || 1;
      let xpNeeded = newLevel * 1000;
      let spGained = 0;
      let leveledUp = false;

      while (newXp >= xpNeeded && newLevel < 100) {
        newXp -= xpNeeded;
        newLevel++;
        xpNeeded = newLevel * 1000;
        spGained += newLevel * 1000; // E.g. Level 2 gives 2000 SP, Level 3 gives 3000 SP, etc.
        leveledUp = true;
      }
      if (newLevel === 100) newXp = 0; // Maxed

      const currentRewardGained = s.levelUpReward?.spGained || 0;

      return {
        ...s,
        xp: newXp,
        level: newLevel,
        coins: (s.coins || 0) + spGained,
        levelUpReward: leveledUp
          ? { level: newLevel, spGained: currentRewardGained + spGained }
          : s.levelUpReward || null
      };
    });
  };

  const doPrestige = () => {
    setState((s) => {
      if ((s.level || 1) < 100 || (s.prestige || 0) >= 10) return s;
      return {
        ...s,
        level: 1,
        xp: 0,
        prestige: (s.prestige || 0) + 1,
      };
    });
  };

  const claimDaily = () => {
    const today = startOfDay(new Date()).toISOString();
    setState((s) => {
      const newStreak = Math.min((s.streak || 0) + 1, 7);
      const reward = newStreak === 7 ? 500 : newStreak * 50; // Simplified reward
      return {
        ...s,
        streak: newStreak,
        lastLoginDate: today,
        showLoginModal: false,
        streakBroken: false,
        coins: (s.coins || 0) + reward,
      };
    });
  };

  const closeLoginModal = () => setState((s) => ({ ...s, showLoginModal: false }));

  const rerollQuest = (questId: string) => {
    setState((s) => {
      if ((s.coins || 0) < 50) return s;
      const currentDescs = s.dailyQuests?.map((q) => q.description) || [];
      const available = dailyQuestsData.filter((q) => !currentDescs.includes(q.description));
      const chosen = available.length > 0 
        ? available[Math.floor(Math.random() * available.length)]
        : dailyQuestsData[Math.floor(Math.random() * dailyQuestsData.length)];

      const newQuests = s.dailyQuests?.map((q) => {
        if (q.id === questId) {
          return {
            id: `r-${Date.now()}`,
            type: chosen.type as any,
            target: chosen.target,
            progress: 0,
            description: chosen.description,
            rewardCoins: chosen.rewardCoins,
            rewardXp: chosen.rewardXp,
            completed: false,
            isWeekly: false,
          };
        }
        return q;
      }) as Quest[];
      return { ...s, coins: (s.coins || 0) - 50, dailyQuests: newQuests };
    });
  };

  const updateQuestProgress = (type: string, amount: number) => {
    setState((s) => {
      let coinsGained = 0;
      let xpGained = 0;
      
      const updateList = (list: Quest[]) => list.map(q => {
        if (q.type === type && !q.completed) {
          const newProg = Math.min(q.target, q.progress + amount);
          if (newProg >= q.target) {
            coinsGained += q.rewardCoins;
            xpGained += q.rewardXp;
            return { ...q, progress: newProg, completed: true };
          }
          return { ...q, progress: newProg };
        }
        return q;
      });

      const updatedDaily = updateList(s.dailyQuests || []);
      const updatedWeekly = updateList(s.weeklyQuests || []);

      if (coinsGained > 0 || xpGained > 0) {
        // Need to apply XP logic, easier to just trigger it via state merge
        const prestigeMult = 1 + (s.prestige || 0) * 0.1;
        const actualXp = xpGained * prestigeMult;
        let newXp = (s.xp || 0) + actualXp;
        let newLevel = s.level || 1;
        let xpNeeded = newLevel * 1000;

        while (newXp >= xpNeeded && newLevel < 100) {
          newXp -= xpNeeded;
          newLevel++;
          xpNeeded = newLevel * 1000;
        }
        
        return { 
          ...s, 
          dailyQuests: updatedDaily, 
          weeklyQuests: updatedWeekly,
          coins: (s.coins || 0) + coinsGained,
          level: newLevel,
          xp: newXp
        };
      }

      return { ...s, dailyQuests: updatedDaily, weeklyQuests: updatedWeekly };
    });
  };

  const saveCampaignResult = (levelId: number, stars: number) => {
    setState((s) => {
      const currentStars = s.campaignStars?.[levelId] || 0;
      let spGained = 0;
      if (currentStars === 0) {
        // First completion reward: 20 SP base + 10 SP per star (max 50 SP)
        spGained = 20 + (stars * 10);
      } else if (stars > currentStars) {
        // Upgraded stars reward: 10 SP per extra star
        spGained = (stars - currentStars) * 10;
      } else {
        // Already completed replay reward: 5 SP
        spGained = 5;
      }

      const newStars = Math.max(currentStars, stars);
      return {
        ...s,
        coins: (s.coins || 0) + spGained,
        campaignStars: { ...(s.campaignStars || {}), [levelId]: newStars }
      };
    });
  };

  const toggleSound = () => setState(s => ({ ...s, soundEnabled: !s.soundEnabled }));

  const buyItem = (itemId: string, price: number, isConsumable: boolean = false) => {
    let success = false;
    setState((s) => {
      if ((s.coins || 0) >= price && (isConsumable || !s.inventory?.includes(itemId))) {
        success = true;
        return {
          ...s,
          coins: (s.coins || 0) - price,
          inventory: [...(s.inventory || []), itemId]
        };
      }
      return s;
    });
    return success;
  };

  const consumeItem = (itemId: string) => {
    let success = false;
    setState((s) => {
      const idx = s.inventory?.indexOf(itemId);
      if (idx !== undefined && idx > -1) {
        success = true;
        const newInv = [...(s.inventory || [])];
        newInv.splice(idx, 1);
        return { ...s, inventory: newInv };
      }
      return s;
    });
    return success;
  };

  const buySnobPass = () => {
    let success = false;
    setState((s) => {
      if (!s.snobPassUnlocked && (s.coins || 0) >= 1500) {
        success = true;
        return {
          ...s,
          coins: (s.coins || 0) - 1500,
          snobPassUnlocked: true
        };
      }
      return s;
    });
    return success;
  };

  const claimSnobPassReward = (tier: number, rewardType: string, rewardId: string, amount: number) => {
    let success = false;
    setState((s) => {
      if (s.claimedSnobPassTiers?.includes(tier)) return s;
      
      success = true;
      const newS = { 
        ...s, 
        claimedSnobPassTiers: [...(s.claimedSnobPassTiers || []), tier] 
      };

      if (rewardType === "sp") {
        newS.coins = (newS.coins || 0) + amount;
      } else if (rewardType === "xp") {
        // Will be handled via addXp outside, but let's just add it locally if needed
        // Actually, just returning success is easier and caller can call addXp if it was an XP reward
      } else if (rewardType === "item") {
        // Add item `amount` times
        const toAdd = Array(amount).fill(rewardId);
        newS.inventory = [...(newS.inventory || []), ...toAdd];
      }

      return newS;
    });
    return success;
  };

  const equipSkin = (itemId: string) => {
    setState((s) => {
      if (s.inventory?.includes(itemId)) {
        return { ...s, equippedSkin: itemId };
      }
      return s;
    });
  };

  const equipTrail = (itemId: string) => {
    setState((s) => {
      if (s.inventory?.includes(itemId)) {
        return { ...s, equippedTrail: itemId };
      }
      return s;
    });
  };

  const updateClassicHighScore = (score: number) => {
    setState((s) => {
      if (score > (s.classicHighScore || 0)) {
        return { ...s, classicHighScore: score };
      }
      return s;
    });
  };

  const recordGame = (score: number, type: "classic" | "campaign" | "blitz") => {
    setState((s) => {
      const newSession: GameSession = {
        id: `g-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        date: new Date().toISOString(),
        score,
        type,
      };
      return {
        ...s,
        gameHistory: [...(s.gameHistory || []), newSession],
      };
    });
  };

  const claimQuestReward = (questId: string): boolean => {
    let success = false;
    setState((s) => {
      const quest = s.dailyQuests?.find(q => q.id === questId && q.completed);
      if (!quest) return s;
      
      success = true;
      const newQuests = s.dailyQuests?.map(q => {
        if (q.id === questId) {
          return { ...q, completed: false };
        }
        return q;
      }) as Quest[];
      
      return {
        ...s,
        dailyQuests: newQuests,
        coins: (s.coins || 0) + quest.rewardCoins,
        xp: (s.xp || 0) + quest.rewardXp
      };
    });
    return success;
  };

  const claimDailyReward = (): boolean => {
    const today = startOfDay(new Date()).toISOString();
    let success = false;
    setState((s) => {
      if (s.dailyRewardClaimed) return s;
      
      success = true;
      const newInventory = [...(s.inventory || []), "daily_reward"];
      return {
        ...s,
        coins: (s.coins || 0) + 5,
        dailyRewardClaimed: true,
        lastDailyRewardClaim: today,
        inventory: newInventory
      };
    });
    return success;
  };

  const buyMysteryBox = (boxType: "mystery" | "epic") => {
    const price = boxType === "mystery" ? 150 : 600;
    let result: LootResult | null = null;
    let success = false;
    let errorMsg = "";

    setState((s) => {
      if ((s.coins || 0) < price) {
        errorMsg = "SP insuffisants !";
        return s;
      }

      success = true;
      const newCoins = (s.coins || 0) - price;
      let finalCoins = newCoins;
      let finalXp = s.xp || 0;
      let finalLevel = s.level || 1;
      let newInventory = [...(s.inventory || [])];

      if (boxType === "mystery") {
        // Boîte Mystère classique : soit XP (50%), soit SP (50%)
        const roll = Math.random() * 100;
        
        if (roll < 50) {
          // SP (50%) : de 30 à 120 SP
          const spLoot = Math.floor(30 + Math.random() * 91); // 30 à 120 SP
          finalCoins += spLoot;

          result = {
            type: "sp",
            amount: spLoot,
            itemName: `${spLoot} SP`,
            itemIcon: "💰",
            itemRarity: "Commun"
          };

          return {
            ...s,
            coins: finalCoins
          };
        } else {
          // XP (50%) : de 20 à 100 XP
          const xpLoot = Math.floor(20 + Math.random() * 81); // 20 à 100 XP
          
          const prestigeMult = 1 + (s.prestige || 0) * 0.1;
          const actualXp = xpLoot * prestigeMult;
          let newXp = (s.xp || 0) + actualXp;
          let newLevel = s.level || 1;
          let xpNeeded = newLevel * 1000;
          let spGained = 0;
          let leveledUp = false;

          while (newXp >= xpNeeded && newLevel < 100) {
            newXp -= xpNeeded;
            newLevel++;
            xpNeeded = newLevel * 1000;
            spGained += newLevel * 1000;
            leveledUp = true;
          }
          if (newLevel === 100) newXp = 0;

          finalXp = newXp;
          finalLevel = newLevel;
          finalCoins += spGained;

          result = {
            type: "xp",
            amount: xpLoot,
            itemName: `${xpLoot} XP`,
            itemIcon: "⚡",
            itemRarity: "Commun"
          };

          return {
            ...s,
            coins: finalCoins,
            xp: finalXp,
            level: finalLevel,
            levelUpReward: leveledUp
              ? { level: newLevel, spGained: (s.levelUpReward?.spGained || 0) + spGained }
              : s.levelUpReward || null
          };
        }

      } else {
        // Boîte Mystère Épique : XP, SP, gadgets, trainées, skins (très rare)
        // Rareté : XP > SP > gadgets > trainées > skins
        const roll = Math.random() * 100;
        
        if (roll < 40) {
          // XP (40%) : de 300 à 1000 XP
          const xpLoot = Math.floor(300 + Math.random() * 701);
          const prestigeMult = 1 + (s.prestige || 0) * 0.1;
          const actualXp = xpLoot * prestigeMult;
          let newXp = (s.xp || 0) + actualXp;
          let newLevel = s.level || 1;
          let xpNeeded = newLevel * 1000;
          let spGained = 0;
          let leveledUp = false;

          while (newXp >= xpNeeded && newLevel < 100) {
            newXp -= xpNeeded;
            newLevel++;
            xpNeeded = newLevel * 1000;
            spGained += newLevel * 1000;
            leveledUp = true;
          }
          if (newLevel === 100) newXp = 0;

          finalXp = newXp;
          finalLevel = newLevel;
          finalCoins += spGained;

          result = {
            type: "xp",
            amount: xpLoot,
            itemName: `${xpLoot} XP`,
            itemIcon: "⚡",
            itemRarity: "Commun"
          };

          return {
            ...s,
            coins: finalCoins,
            xp: finalXp,
            level: finalLevel,
            levelUpReward: leveledUp
              ? { level: newLevel, spGained: (s.levelUpReward?.spGained || 0) + spGained }
              : s.levelUpReward || null
          };

        } else if (roll < 65) {
          // SP (25%) : de 250 à 750 SP
          const spLoot = Math.floor(250 + Math.random() * 501);
          finalCoins += spLoot;

          result = {
            type: "sp",
            amount: spLoot,
            itemName: `${spLoot} SP`,
            itemIcon: "💰",
            itemRarity: "Rare"
          };

          return {
            ...s,
            coins: finalCoins
          };

        } else if (roll < 83) {
          // Gadgets (18%) : Un gadget aléatoire
          const randomGadget = GADGETS[Math.floor(Math.random() * GADGETS.length)];
          newInventory.push(randomGadget.id);

          result = {
            type: "gadget",
            itemId: randomGadget.id,
            itemName: randomGadget.name,
            itemIcon: randomGadget.icon,
            itemRarity: randomGadget.rarity
          };

          return {
            ...s,
            coins: finalCoins,
            inventory: newInventory
          };

        } else if (roll < 95) {
          // Traînées (12%) : Une traînée aléatoire
          const randomTrail = TRAILS[Math.floor(Math.random() * TRAILS.length)];
          const alreadyOwned = s.inventory?.includes(randomTrail.id);
          
          if (alreadyOwned) {
            // Déjà possédée : compensation de 50% du prix (ou 150 SP par défaut si gratuit)
            const comp = randomTrail.price > 0 ? Math.floor(randomTrail.price * 0.5) : 150;
            finalCoins += comp;

            result = {
              type: "trail",
              itemId: randomTrail.id,
              itemName: randomTrail.name,
              itemIcon: randomTrail.icon,
              itemRarity: randomTrail.rarity,
              compensated: true,
              compensationAmount: comp
            };
          } else {
            newInventory.push(randomTrail.id);
            result = {
              type: "trail",
              itemId: randomTrail.id,
              itemName: randomTrail.name,
              itemIcon: randomTrail.icon,
              itemRarity: randomTrail.rarity,
              compensated: false
            };
          }

          return {
            ...s,
            coins: finalCoins,
            inventory: newInventory
          };

        } else {
          // Skins (5%) : Un skin aléatoire (autre que classique)
          const availableSkins = SKINS.filter(sk => sk.id !== "default_skin");
          const randomSkin = availableSkins[Math.floor(Math.random() * availableSkins.length)];
          const alreadyOwned = s.inventory?.includes(randomSkin.id);

          if (alreadyOwned) {
            // Déjà possédé : compensation de 50% du prix (ou 250 SP par défaut si gratuit)
            const comp = randomSkin.price > 0 ? Math.floor(randomSkin.price * 0.5) : 250;
            finalCoins += comp;

            result = {
              type: "skin",
              itemId: randomSkin.id,
              itemName: randomSkin.name,
              itemIcon: randomSkin.icon,
              itemRarity: randomSkin.rarity,
              compensated: true,
              compensationAmount: comp
            };
          } else {
            newInventory.push(randomSkin.id);
            result = {
              type: "skin",
              itemId: randomSkin.id,
              itemName: randomSkin.name,
              itemIcon: randomSkin.icon,
              itemRarity: randomSkin.rarity,
              compensated: false
            };
          }

          return {
            ...s,
            coins: finalCoins,
            inventory: newInventory
          };
        }
      }
    });

    if (!success || !result) {
      return { success: false, error: errorMsg };
    }
    return { success: true, loot: result };
  };

  const setProfile = (username: string, avatar: string, bio: string) => {
    setState((s) => ({ ...s, username, avatar, bio }));
  };

  const openAuthModal = () => setState(s => ({ ...s, showAuthModal: true }));
  const closeAuthModal = () => setState(s => ({ ...s, showAuthModal: false }));

  const loginWithGoogle = async () => {
    throw new Error("Connexion Google désactivée. Utilisez e-mail et mot de passe.");
  };

  const loginWithEmail = async (email: string, pass: string) => {
    await authClient.signIn.email({ email, password: pass });
  };

  const registerWithEmail = async (email: string, pass: string) => {
    await authClient.signUp.email({ email, password: pass, name: email.split("@")[0] });
  };

  const logout = async () => {
    await authClient.signOut();
  };

  if (!isLoaded) return null;

  return (
    <GameContext.Provider
      value={{
        ...defaultState,
        ...state,
        sp: state.coins || 0,
        addCoins,
        addSp,
        addXp,
        doPrestige,
        claimDaily,
        closeLoginModal,
        rerollQuest,
        updateQuestProgress,
        saveCampaignResult,
        toggleSound,
        buyItem,
        consumeItem,
        buySnobPass,
        claimSnobPassReward,
        equipSkin,
        equipTrail,
        updateClassicHighScore,
        recordGame,
        buyMysteryBox,
        claimQuestReward,
        claimDailyReward,
        dailyRewardClaimed: state.dailyRewardClaimed ?? false,
        lastDailyRewardClaim: state.lastDailyRewardClaim ?? null,
        setProfile,
        openAuthModal,
        closeAuthModal,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        logout,
        dismissLevelUpReward: () => setState((s) => ({ ...s, levelUpReward: null })),
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameStore = () => useContext(GameContext);
