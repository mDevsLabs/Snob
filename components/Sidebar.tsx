"use client";
import React from "react";
import Image from "next/image";
import { useGameStore } from "@/lib/store";
import { Target, Zap, Scroll, UserCircle2, Coins, Grid, ShoppingCart, Package, Crown } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { TabType } from "@/lib/types";

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { coins, level, xp } = useGameStore();

  const navItems = [
    { id: "classic", label: "Classique", icon: Grid },
    { id: "campaign", label: "Campagne", icon: Target },
    { id: "blitz", label: "Mode Blitz", icon: Zap },
    { id: "quests", label: "Quêtes", icon: Scroll },
    { id: "inventory", label: "Inventaire", icon: Package },
    { id: "shop", label: "Boutique", icon: ShoppingCart },
    { id: "snob-pass", label: "Snob Pass", icon: Crown },
    { id: "profile", label: "Profil", icon: UserCircle2 },
  ] as const;

  return (
    <aside className="w-64 bg-slate-900 border-r border-white/10 p-6 flex flex-col z-20">
      <div className="mb-10 flex items-center gap-3">
        <Image 
          src="/logo.png" 
          alt="Snob Logo" 
          width={40}
          height={40}
          className="object-contain rounded-xl border border-yellow-500/20 shadow-lg shadow-yellow-500/5" 
        />
        <div>
          <h1 className="text-2xl font-black font-mono tracking-tighter bg-gradient-to-br from-yellow-400 via-amber-300 to-yellow-600 text-transparent bg-clip-text leading-none">
            SNOB
          </h1>
          <p className="text-[9px] text-yellow-500/80 font-mono uppercase tracking-widest mt-1">ÉDITION PRESTIGE</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-left",
                isActive 
                  ? "bg-fuchsia-500/10 text-fuchsia-400" 
                  : "hover:bg-white/5 text-slate-400 hover:text-slate-200"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "animate-pulse" : "")} />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 w-1 h-8 bg-fuchsia-500 rounded-r-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="bg-slate-950 p-4 rounded-xl border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-mono">NIVEAU {level}</span>
            <span className="text-xs text-slate-500">{Math.floor(xp)} / {level * 1000}</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-cyan-500"
              initial={{ width: 0 }}
              animate={{ width: `${(xp / (level * 1000)) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-yellow-500/10 text-yellow-500 px-4 py-3 rounded-xl border border-yellow-500/20">
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-yellow-500 text-slate-950 font-black text-[10px] font-mono leading-none">
            SP
          </div>
          <span className="font-bold font-mono text-sm leading-none">{coins.toLocaleString()} SP</span>
        </div>
      </div>
    </aside>
  );
}
