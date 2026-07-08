"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Campaign from "@/components/Campaign";
import Blitz from "@/components/Blitz";
import Quests from "@/components/Quests";
import Profile from "@/components/Profile";
import DailyLogin from "@/components/DailyLogin";
import Classic from "@/components/Classic";
import Store from "@/components/Store";
import Inventory from "@/components/Inventory";
import SnobPass from "@/components/SnobPass";
import LevelUpAlert from "@/components/LevelUpAlert";
import AuthModal from "@/components/AuthModal";
import AuthPrompt from "@/components/AuthPrompt";
import { AppProvider } from "@/lib/context";
import { TabType } from "@/lib/types";
import { GameProvider } from "@/lib/store";
import { ConfettiProvider } from "@/components/ConfettiProvider";



export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("classic");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
        return;
      }
      
      switch (e.key.toLowerCase()) {
        case 'c':
          setActiveTab("classic");
          break;
        case 'q':
          setActiveTab("quests");
          break;
        case 'p':
          setActiveTab("profile");
          break;
        case 'b':
          setActiveTab("blitz");
          break;
        case 's':
          setActiveTab("shop");
          break;
        case 'i':
          setActiveTab("inventory");
          break;
        case 'a':
          setActiveTab("campaign");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <AppProvider>
      <GameProvider>
        <ConfettiProvider>
        <div className="flex h-screen w-full bg-slate-950 text-slate-100 overflow-hidden relative">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <main className="flex-1 relative overflow-y-auto">
            {activeTab === "classic" && <Classic />}
            {activeTab === "campaign" && <Campaign />}
            {activeTab === "blitz" && <Blitz />}
            {activeTab === "quests" && <Quests />}
            {activeTab === "profile" && <Profile />}
            {activeTab === "inventory" && <Inventory />}
            {activeTab === "shop" && <Store />}
            {activeTab === "snob-pass" && <SnobPass />}
          </main>

          <DailyLogin />
          <LevelUpAlert />
          <AuthModal />
          <AuthPrompt />
        </div>
        </ConfettiProvider>
      </GameProvider>
    </AppProvider>
  );
}
