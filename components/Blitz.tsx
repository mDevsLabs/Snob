"use client";
import React, { useState, useEffect, useRef } from "react";
import { useBlockBlast, GRID_SIZE } from "@/lib/blockBlast";
import { useGameStore } from "@/lib/store";
import { SKINS } from "@/lib/skins";
import { TRAILS } from "@/lib/trails";
import { RotateCcw, Zap, AlertTriangle, Play, Pause, CheckCircle2, RotateCw, RefreshCw, Archive, Lock, Trophy, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { sounds } from "@/lib/audio";
import { useConfetti } from "@/components/ConfettiProvider";

const BLITZ_DURATION = 120; // 2 minutes in seconds

interface Particle {
  id: string;
  x: number;
  y: number;
  char: string;
  color: string;
  scale: number;
  rotation: number;
  driftY: number;
}

function createTrailParticle(
  shapeCenterX: number,
  shapeCenterY: number,
  activeTrail: { particleColor: string; chars?: string[] }
): Particle {
  const chars = activeTrail.chars || ["✨"];
  const randomChar = chars[Math.floor(Math.random() * chars.length)];
  const randomId = Math.random().toString(36).substring(7);
  return {
    id: randomId,
    x: shapeCenterX + (Math.random() * 40 - 20),
    y: shapeCenterY + (Math.random() * 40 - 20),
    char: randomChar,
    color: activeTrail.particleColor,
    scale: Math.random() * 0.4 + 0.8,
    rotation: Math.random() * 360,
    driftY: Math.random() * 20,
  };
}

export default function Blitz() {
  const { 
    grid, hand, score, gameOver, placeShape, reset, checkPlacement,
    rotateShape, holdShape, holdCurrentShape, rotateHoldShape, rerollHand,
    destroyCell
  } = useBlockBlast();
  
  const { 
    coins, addCoins, equippedSkin, equippedTrail, 
    addXp, updateQuestProgress, soundEnabled, recordGame, inventory, consumeItem,
    reducedMotion, colorblindMode, screenShake, particleDensity, gridContrast, aimGuide
  } = useGameStore();

  const [isPlaying, setIsPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(BLITZ_DURATION);
  const [timeExpired, setTimeExpired] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const hasProcessedGameOver = useRef(false);
  const { fireAtElement, popRewardAtElement } = useConfetti();

  const [selectedShapeIdx, setSelectedShapeIdx] = useState<number | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number } | null>(null);
  const [justClearedLines, setJustClearedLines] = useState(0);
  const [currentComboMultiplier, setCurrentComboMultiplier] = useState(1);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [shakeGrid, setShakeGrid] = useState(false);
  const [isBlasterActive, setIsBlasterActive] = useState(false);
  const [isTimeFrozen, setIsTimeFrozen] = useState(false);

  const skin = SKINS.find((s) => s.id === equippedSkin) || SKINS[0];
  const activeTrail = TRAILS.find((t) => t.id === equippedTrail) || TRAILS[0];
  const gridRef = useRef<HTMLDivElement>(null);

  const isActuallyGameOver = gameOver || timeExpired;

  // Initialize Audio Context on first interaction
  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const playAlarm = () => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = "square";
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  };

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isActuallyGameOver && !paused) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (isTimeFrozen) return prev;
          if (prev <= 1) {
            setTimeExpired(true);
            setIsPlaying(false);
            return 0;
          }
          if (prev <= 11) {
            playAlarm();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isActuallyGameOver, paused, isTimeFrozen]);

  // Escape to pause / resume
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isPlaying && !isActuallyGameOver) {
        setPaused((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isPlaying, isActuallyGameOver]);

  // Update quests & rewards on game over
  useEffect(() => {
    if (isActuallyGameOver && !hasProcessedGameOver.current && (score > 0 || isPlaying === false)) {
      hasProcessedGameOver.current = true;
      updateQuestProgress("blitz_played", 1);
      updateQuestProgress("score", score);
      addXp(Math.floor(score / 10));
      addCoins(Math.floor(score / 500));
      sounds.playGameOver(soundEnabled);
      recordGame(score, "blitz");
      fireAtElement(gridRef.current, { count: 70 });
      popRewardAtElement(`+${Math.floor(score / 500)} SP · +${Math.floor(score / 10)} XP`, "#facc15", gridRef.current, "⚡");
    } else if (!isActuallyGameOver) {
      hasProcessedGameOver.current = false;
    }
  }, [isActuallyGameOver, score, updateQuestProgress, addXp, addCoins, soundEnabled, recordGame, isPlaying, fireAtElement, popRewardAtElement]);

  const handleStart = () => {
    sounds.playClick(soundEnabled);
    initAudio();
    reset();
    setTimeLeft(BLITZ_DURATION);
    setTimeExpired(false);
    setIsPlaying(true);
    hasProcessedGameOver.current = false;
  };

  const handleReroll = () => {
    if (coins >= 50 && !gameOver && isPlaying) {
      if (consumeItem('gadget_reroll')) {
        addCoins(-50);
        rerollHand();
        sounds.playClick(soundEnabled);
      }
    }
  };

  const processPlacement = (res: any) => {
    if (res !== false) {
      setSelectedShapeIdx(null);
      setHoveredCell(null);
      setCurrentComboMultiplier(res.comboMultiplier || 1);
      if (res.linesCleared > 0) {
        updateQuestProgress("lines", res.linesCleared);
        if (res.linesCleared >= 2) {
          updateQuestProgress("doubles", 1);
        }
        setJustClearedLines(res.linesCleared);
        sounds.playClear(soundEnabled, res.linesCleared);
        
        // Tremblement d'écran si combos
        if (screenShake && !reducedMotion) {
          setShakeGrid(true);
          setTimeout(() => setShakeGrid(false), 400);
        }
        
        // Add time for lines cleared
        if (isPlaying) {
          setTimeLeft((prev) => Math.min(prev + (res.linesCleared * 2), BLITZ_DURATION));
        }
        
        setTimeout(() => setJustClearedLines(0), 1000);
      } else {
        sounds.playMove(soundEnabled);
      }
    } else {
      setHoveredCell(null);
      setSelectedShapeIdx(null);
    }
  };

  const handleDrag = (e: any, info: any, shapeIdx: number) => {
    if (!gridRef.current || isActuallyGameOver || !isPlaying || paused) return;
    const shapeObj = shapeIdx === 999 ? holdShape : hand[shapeIdx];
    if (!shapeObj || shapeObj.used) return;

    const draggedEl = (e.target as HTMLElement).closest(".drag-shape");
    if (!draggedEl) return;

    const shapeRect = draggedEl.getBoundingClientRect();
    const gridRect = gridRef.current.getBoundingClientRect();
    const cellSize = gridRect.width / GRID_SIZE;

    const shapeCenterX = shapeRect.left + shapeRect.width / 2;
    const shapeCenterY = shapeRect.top + shapeRect.height / 2;

    // Spawn trail particles if active trail is equipped and has chars
    let shouldSpawnParticle = true;
    if (reducedMotion || particleDensity === "none") {
      shouldSpawnParticle = false;
    } else if (particleDensity === "low") {
      shouldSpawnParticle = Math.random() < 0.25;
    } else if (particleDensity === "medium") {
      shouldSpawnParticle = Math.random() < 0.6;
    }

    if (shouldSpawnParticle && activeTrail && activeTrail.type !== "none" && activeTrail.chars && activeTrail.chars.length > 0) {
      const px = info?.point?.x ?? shapeCenterX;
      const py = info?.point?.y ?? shapeCenterY;
      const newParticle = createTrailParticle(px, py, activeTrail);
      setParticles((prev) => [...prev.slice(-25), newParticle]);
    }

    const relativeCenterX = shapeCenterX - gridRect.left;
    const relativeCenterY = shapeCenterY - gridRect.top;

    const shapeRows = shapeObj.shape.length;
    const shapeCols = shapeObj.shape[0].length;

    const exactC = (relativeCenterX / cellSize) - (shapeCols / 2);
    const exactR = (relativeCenterY / cellSize) - (shapeRows / 2);

    const c = Math.round(exactC);
    const r = Math.round(exactR);

    if (r >= -2 && r < GRID_SIZE + 2 && c >= -2 && c < GRID_SIZE + 2) {
      setSelectedShapeIdx(shapeIdx);
      setHoveredCell({ r, c });
    } else {
      setHoveredCell(null);
    }
  };

  const handleDragEnd = (e: any, info: any, shapeIdx: number) => {
    if (!gridRef.current || isActuallyGameOver || !isPlaying || paused) return;
    const shapeObj = shapeIdx === 999 ? holdShape : hand[shapeIdx];
    if (!shapeObj || shapeObj.used) return;

    const draggedEl = (e.target as HTMLElement).closest(".drag-shape");
    if (!draggedEl) return;

    const shapeRect = draggedEl.getBoundingClientRect();
    const gridRect = gridRef.current.getBoundingClientRect();
    const cellSize = gridRect.width / GRID_SIZE;

    const shapeCenterX = shapeRect.left + shapeRect.width / 2;
    const shapeCenterY = shapeRect.top + shapeRect.height / 2;

    const relativeCenterX = shapeCenterX - gridRect.left;
    const relativeCenterY = shapeCenterY - gridRect.top;

    const shapeRows = shapeObj.shape.length;
    const shapeCols = shapeObj.shape[0].length;

    const exactC = (relativeCenterX / cellSize) - (shapeCols / 2);
    const exactR = (relativeCenterY / cellSize) - (shapeRows / 2);

    const c = Math.round(exactC);
    const r = Math.round(exactR);

    const res = placeShape(shapeIdx, r, c);
    processPlacement(res);
  };

  const handleCellClick = (r: number, c: number) => {
    if (isBlasterActive) {
      if (grid[r][c] !== 0) {
        if (destroyCell(r, c)) {
          consumeItem('gadget_neon_blaster');
          setIsBlasterActive(false);
          sounds.playClear(soundEnabled, 1);
          
          // Particules d'explosion
          const gridRect = gridRef.current?.getBoundingClientRect();
          if (gridRect) {
            const cellSize = gridRect.width / GRID_SIZE;
            const px = gridRect.left + (c * cellSize) + (cellSize / 2);
            const py = gridRect.top + (r * cellSize) + (cellSize / 2);
            
            const blastParticles = Array.from({ length: 15 }, () => ({
              id: Math.random().toString(36).substring(7),
              x: px + (Math.random() * 20 - 10),
              y: py + (Math.random() * 20 - 10),
              char: "💥",
              color: "text-red-500 font-bold",
              scale: Math.random() * 0.5 + 0.8,
              rotation: Math.random() * 360,
              driftY: Math.random() * 40 - 20,
            }));
            setParticles((prev) => [...prev, ...blastParticles]);
          }
        }
      }
      return;
    }

    if (selectedShapeIdx === null || isActuallyGameOver || !isPlaying || paused) return;
    const res = placeShape(selectedShapeIdx, r, c);
    processPlacement(res);
  };

  const isPlacementValid = selectedShapeIdx !== null && hoveredCell !== null
    ? checkPlacement(hand[selectedShapeIdx].shape, hoveredCell.r, hoveredCell.c)
    : false;

  const renderShapePreview = (shape: number[][], r: number, c: number) => {
    const previewCells: { r: number; c: number }[] = [];
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].length; j++) {
        if (shape[i][j]) previewCells.push({ r: r + i, c: c + j });
      }
    }
    return previewCells;
  };

  const previewCells = selectedShapeIdx !== null && hoveredCell !== null
    ? renderShapePreview(selectedShapeIdx === 999 ? holdShape.shape : hand[selectedShapeIdx].shape, hoveredCell.r, hoveredCell.c)
    : [];

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const isCritical = timeLeft <= 10 && isPlaying;

  return (
    <div className="h-full flex flex-col lg:flex-row items-center justify-center gap-8 xl:gap-12 p-8 pt-16 lg:pt-8 overflow-y-auto">
      
      {/* Game Stats Panel */}
      <div className="flex flex-col gap-6 w-64 lg:order-1 order-2">
        <div className="mb-4">
          <h2 className="text-4xl font-black font-mono tracking-tighter uppercase text-fuchsia-500 mb-1 flex items-center gap-2">
            <Zap className="w-8 h-8" /> BLITZ
          </h2>
          <p className="text-xs text-slate-400 font-mono">+2 sec par ligne</p>
        </div>

        <div className={cn(
          "p-6 rounded-2xl border-2 transition-colors relative overflow-hidden",
          isCritical ? "bg-red-500/20 border-red-500 animate-flash shadow-[0_0_30px_rgba(239,68,68,0.4)]" : "bg-slate-900 border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
        )}>
          <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1 flex items-center gap-2">
            Temps restant
            {isCritical && <AlertTriangle className="w-4 h-4 text-red-500" />}
          </div>
          <div className={cn(
            "text-5xl font-black font-mono tabular-nums",
            isCritical ? "text-red-500" : "text-white"
          )}>
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border-2 border-white/10 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Score Actuel</div>
          <div className="text-4xl font-bold font-mono tabular-nums text-cyan-400">{score.toLocaleString()}</div>
          
          <AnimatePresence>
            {justClearedLines > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1.2, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="absolute top-4 right-4 flex flex-col items-end"
              >
                <div className="text-fuchsia-400 font-black font-mono text-xl drop-shadow-[0_0_10px_rgba(217,70,239,0.8)]">
                  +{justClearedLines} LIGNES!
                </div>
                {currentComboMultiplier > 1 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-amber-400 font-black font-mono text-sm tracking-widest drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]"
                  >
                    x{currentComboMultiplier} MULTIPLICATEUR
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {!isPlaying && !isActuallyGameOver ? (
            <button
              onClick={handleStart}
              className="flex items-center justify-center gap-3 px-6 py-4 bg-fuchsia-600 hover:bg-fuchsia-500 text-white border border-fuchsia-400 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
              <Play className="w-5 h-5 text-white" /> START BLITZ
            </button>
          ) : isActuallyGameOver ? (
            <button
              onClick={handleStart}
              className="flex items-center justify-center gap-3 px-6 py-4 bg-fuchsia-600 hover:bg-fuchsia-500 text-white border border-fuchsia-400 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
              <RotateCcw className="w-5 h-5" /> REJOUER
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  sounds.playClick(soundEnabled);
                  setPaused((p) => !p);
                }}
                className="flex items-center justify-center gap-3 px-6 py-4 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/20 rounded-xl font-bold transition-all hover:scale-105 active:scale-95"
              >
                {paused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                {paused ? "REPRENDRE" : "PAUSE"}
              </button>
              <button
                onClick={() => {
                  sounds.playClick(soundEnabled);
                  setIsPlaying(false);
                  setTimeExpired(true);
                }}
                className="flex items-center justify-center gap-3 px-6 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl font-bold transition-all hover:scale-105 active:scale-95"
              >
                <RotateCcw className="w-5 h-5" /> ABANDONNER
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Board & Hand & Hold */}
      <div className="flex flex-col items-center gap-6 lg:order-2 order-1 w-full max-w-2xl relative">
        {paused && !isActuallyGameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md rounded-3xl p-8"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-20 h-20 bg-blue-500/10 text-blue-300 border border-blue-500/30 rounded-full flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(59,130,246,0.35)]"
            >
              <Pause className="w-10 h-10" />
            </motion.div>
            <h3 className="text-4xl font-black text-blue-300 mb-2 tracking-tight">PAUSE</h3>
            <p className="text-slate-400 mb-6 text-sm font-mono">Le chrono est en pause. Reprenez quand vous voulez.</p>
            <button
              onClick={() => {
                sounds.playClick(soundEnabled);
                setPaused(false);
              }}
              className="flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-lg transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.5)]"
            >
              <Play className="w-5 h-5" /> REPRENDRE
            </button>
          </motion.div>
        )}

        {!isPlaying && !paused && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm rounded-3xl p-8">
            {isActuallyGameOver ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                  className="w-20 h-20 bg-red-500/10 text-red-400 border border-red-500/30 rounded-full flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(239,68,68,0.35)]"
                >
                  <Trophy className="w-10 h-10" />
                </motion.div>
                <h3 className="text-4xl font-black text-red-400 mb-1 tracking-tight drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                  {timeExpired ? "Temps Écoulé !" : "Plus de coups!"}
                </h3>
                <p className="text-slate-300 mb-2">Score final : <span className="font-mono text-cyan-400 text-2xl font-bold">{score.toLocaleString()}</span></p>
                <div className="flex gap-4 mb-6 text-sm font-mono bg-slate-900 px-5 py-3 rounded-2xl border border-white/10 shadow-inner">
                  <span className="text-yellow-400 font-bold flex items-center gap-1"><span className="w-3.5 h-3.5 rounded-full bg-yellow-500 text-slate-950 flex items-center justify-center font-black text-[8px]">SP</span>+{Math.floor(score / 500)} SP</span>
                  <span className="text-slate-500">|</span>
                  <span className="text-cyan-400 font-bold flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" />+{Math.floor(score / 10)} XP</span>
                </div>
                <button
                  onClick={handleStart}
                  className="flex items-center gap-3 px-8 py-4 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-full font-bold text-lg transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(217,70,239,0.5)]"
                >
                  <RotateCcw className="w-5 h-5" /> REJOUER
                </button>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center">
                <Zap className="w-16 h-16 text-fuchsia-500 mb-4 animate-pulse" />
                <h3 className="text-3xl font-black text-white mb-2 tracking-tight">PRÊT POUR LE BLITZ ?</h3>
                <p className="text-slate-400 mb-8 max-w-sm text-center">Vous avez 2 minutes pour faire un maximum de points. Chaque ligne complétée vous donne +2 secondes !</p>
                <button
                  onClick={handleStart}
                  className="flex items-center gap-3 px-8 py-4 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-full font-bold text-lg transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(217,70,239,0.5)]"
                >
                  <Play className="w-5 h-5" /> JOUER MAINTENANT
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full">
          {/* Reserve (Hold) Panel */}
          <div className="flex flex-col items-center gap-3 p-4 bg-slate-900/60 border border-white/5 rounded-2xl w-36 sm:w-40 backdrop-blur-sm shrink-0 shadow-lg relative overflow-hidden">
            {inventory.filter(id => id === 'gadget_hold').length === 0 && (
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-[2px] flex flex-col items-center justify-center p-3 text-center z-20">
                <Lock className="w-6 h-6 text-red-500 mb-1.5 animate-pulse" />
                <span className="text-[9px] text-slate-400 font-bold font-mono leading-tight">RÉSERVE ÉPUISÉE</span>
                <span className="text-[8px] text-slate-600 font-mono mt-1 leading-tight uppercase">Boutique</span>
              </div>
            )}
            <span className="text-[10px] text-slate-400 font-bold font-mono tracking-widest uppercase flex items-center gap-1.5">
              <Archive className="w-3.5 h-3.5 text-fuchsia-400" /> RÉSERVE
            </span>
            <div 
              className={cn(
                "h-28 w-28 sm:h-32 sm:w-32 flex items-center justify-center border border-dashed rounded-xl relative transition-all duration-300",
                selectedShapeIdx === 999 
                  ? "border-fuchsia-500 bg-fuchsia-500/5 shadow-[inset_0_0_15px_rgba(217,70,239,0.1)]" 
                  : "border-slate-800 hover:border-slate-700 bg-slate-950/40"
              )}
            >
              {holdShape ? (
                <motion.div
                  drag={isPlaying && !paused}
                  dragSnapToOrigin
                  onDragStart={() => sounds.playClick(soundEnabled)}
                  onDrag={(e, info) => handleDrag(e, info, 999)}
                  onDragEnd={(e, info) => handleDragEnd(e, info, 999)}
                  whileDrag={{ scale: 1.2, zIndex: 50 }}
                  className="drag-shape grid gap-[1px] cursor-grab active:cursor-grabbing relative z-10"
                  style={{ gridTemplateColumns: `repeat(${holdShape.shape[0].length}, minmax(0, 1fr))` }}
                  onClick={() => {
                    if (!isPlaying) return;
                    sounds.playClick(soundEnabled);
                    setSelectedShapeIdx(999 === selectedShapeIdx ? null : 999);
                  }}
                >
                  {holdShape.shape.map((row: number[], r: number) =>
                    row.map((cell: number, c: number) => (
                      <div
                        key={`${r}-${c}`}
                        className={cn(
                          "w-4 h-4 sm:w-5 sm:h-5 transition-all duration-150 relative flex items-center justify-center overflow-hidden",
                          cell 
                            ? cn(
                                skin.colors[holdShape.colorIdx] ?? skin.colors[0],
                                "rounded-md shadow-[0_2px_5px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.3)]",
                                colorblindMode === "high-contrast" && "ring-1 ring-white"
                              ) 
                            : "bg-transparent pointer-events-none"
                        )}
                      >
                        {cell === 1 && (
                          <div className="absolute top-0.5 left-0.5 right-0.5 h-[30%] bg-white/15 rounded-t-sm pointer-events-none" />
                        )}
                        {cell === 1 && colorblindMode === "symbols" && (
                          <span className="absolute inset-0 flex items-center justify-center text-[7px] font-black text-slate-950 pointer-events-none select-none drop-shadow-[0_0.5px_0.5px_rgba(255,255,255,0.45)]">
                            {["⭐", "💠", "🔺", "⚪", "🔶", "⬜", "🔸"][holdShape.colorIdx] ?? "●"}
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </motion.div>
              ) : (
                <span className="text-[10px] text-slate-600 font-mono italic select-none">Aucun bloc</span>
              )}
            </div>
            {holdShape && (
              <button
                onClick={() => {
                  if (consumeItem('gadget_rotate')) {
                    sounds.playClick(soundEnabled);
                    rotateHoldShape();
                  }
                }}
                disabled={!isPlaying}
                className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono font-bold px-2 py-1.5 rounded-lg border border-white/5 flex items-center gap-1 transition-all active:scale-95 hover:text-white disabled:opacity-50 disabled:pointer-events-none"
              >
                <RotateCw className="w-3 h-3 text-cyan-400" /> Tourner ({inventory.filter(id => id === 'gadget_rotate').length})
              </button>
            )}
          </div>

          {/* Grid Board */}
          <motion.div 
            animate={shakeGrid ? {
              x: [0, -6, 6, -6, 6, -3, 3, 0],
              y: [0, 4, -4, 4, -4, 2, -2, 0]
            } : {}}
            transition={{ duration: 0.4 }}
            className={cn(
              "relative p-4 rounded-3xl border-2 transition-all duration-300",
              gridContrast === "high"
                ? "bg-slate-950 border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.05)]"
                : "bg-slate-950/90 border-slate-800/80 shadow-[0_25px_60px_rgba(0,0,0,0.85)]",
              isBlasterActive && "ring-2 ring-red-500/40",
              isTimeFrozen && "ring-4 ring-cyan-500/80 shadow-[0_0_25px_rgba(6,182,212,0.6)] border-cyan-400/80"
            )}
            onMouseLeave={() => setHoveredCell(null)}
          >
            {/* Subtle elegant inner light reflection ring */}
            <div className="absolute inset-0 rounded-3xl border border-white/5 pointer-events-none" />

            {isBlasterActive && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-650 border border-red-500 text-white text-[9px] font-black font-mono px-3 py-1 rounded-full animate-bounce shadow-lg z-30 tracking-wider">
                🔫 MODE BLASTER ACTIF : CLIQUEZ SUR UN BLOC À DÉTRUIRE
              </div>
            )}

            {isTimeFrozen && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-cyan-600 border border-cyan-400 text-slate-950 text-[9px] font-black font-mono px-3 py-1 rounded-full animate-pulse shadow-lg z-30 tracking-wider flex items-center gap-1">
                ❄️ TEMPS GELÉ (5S)
              </div>
            )}

            <div 
              ref={gridRef}
              className="grid gap-[4px] bg-slate-900/60 p-[6px] rounded-2xl border border-slate-850 shadow-[inset_0_4px_12px_rgba(0,0,0,0.8)]"
              style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
            >
              {grid.map((row, r) =>
                row.map((cell, c) => {
                  const isPreview = previewCells.some(p => p.r === r && p.c === c);
                  const isFilled = cell > 0;
                  const cellColor = isFilled ? (skin.colors[cell - 1] ?? skin.colors[0]) : "";
                  const selectedColor = selectedShapeIdx !== null && (selectedShapeIdx === 999 ? holdShape : hand[selectedShapeIdx])
                    ? (skin.colors[(selectedShapeIdx === 999 ? holdShape : hand[selectedShapeIdx]).colorIdx] ?? skin.colors[0])
                    : skin.colors[0];
                  
                  const cellColorClass = isPreview
                    ? (isPlacementValid
                        ? selectedColor
                        : (isFilled ? cellColor : "bg-red-500/20 border border-red-500/40 shadow-[inset_0_0_10px_rgba(239,68,68,0.5)]"))
                    : (isFilled ? cellColor : "bg-slate-950/45 border border-white/[0.02] shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)]");

                  const shape = selectedShapeIdx !== null && (selectedShapeIdx === 999 ? holdShape : hand[selectedShapeIdx])
                    ? (selectedShapeIdx === 999 ? holdShape.shape : hand[selectedShapeIdx].shape)
                    : null;
                  const isRowInGuide = aimGuide && hoveredCell && shape && (r >= hoveredCell.r && r < hoveredCell.r + shape.length);
                  const isColInGuide = aimGuide && hoveredCell && shape && (c >= hoveredCell.c && c < hoveredCell.c + shape[0].length);
                  
                  const guideClass = (isRowInGuide || isColInGuide) && !isFilled && !isPreview
                    ? "bg-cyan-500/[0.03] ring-1 ring-cyan-500/10 ring-inset"
                    : "";

                  return (
                    <div
                      key={`${r}-${c}`}
                      className={cn(
                        "w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-lg transition-all duration-100 relative flex items-center justify-center overflow-hidden",
                        cellColorClass,
                        guideClass,
                        isFilled && "shadow-[0_4px_10px_rgba(0,0,0,0.4),inset_0_1.5px_1.5px_rgba(255,255,255,0.35)] active:scale-95",
                        isFilled && colorblindMode === "high-contrast" && "ring-2 ring-white",
                        isPreview && isPlacementValid && "opacity-80 scale-95 ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.4)] z-10",
                        isPreview && !isPlacementValid && isFilled && "ring-2 ring-red-500 ring-offset-2 ring-offset-slate-950 z-10 animate-pulse",
                        isBlasterActive && isFilled && "hover:ring-2 hover:ring-red-500 hover:scale-105 cursor-crosshair z-10"
                      )}
                      onMouseEnter={() => setHoveredCell({ r, c })}
                      onClick={() => handleCellClick(r, c)}
                    >
                      {isFilled && (
                        <div className="absolute top-0.5 left-0.5 right-0.5 h-[30%] bg-white/15 rounded-t-md pointer-events-none" />
                      )}
                      {isFilled && skin.id === "hacker" && colorblindMode !== "symbols" && (
                        <span className="flex items-center justify-center w-full h-full text-[9px] font-mono opacity-60 text-green-300">01</span>
                      )}
                      {isFilled && colorblindMode === "symbols" && (
                        <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-slate-950 pointer-events-none select-none drop-shadow-[0_1px_1px_rgba(255,255,255,0.45)]">
                          {["⭐", "💠", "🔺", "⚪", "🔶", "⬜", "🔸"][cell - 1] ?? "●"}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>

        {/* Hand (Available Shapes) */}
        <div className="flex flex-col items-center gap-4 bg-slate-900/50 p-6 rounded-2xl border border-white/5 w-full max-w-lg shadow-lg">
          <div className="flex justify-center gap-6 w-full">
            {hand.map((shapeObj, idx) => (
              <div
                key={shapeObj.id}
                className={cn(
                  "flex-1 flex flex-col items-center justify-between min-h-[140px] transition-all relative",
                  shapeObj.used ? "opacity-0 pointer-events-none" : "opacity-100"
                )}
              >
                {!shapeObj.used && (
                  <>
                    <div className="flex-1 flex items-center justify-center">
                      <motion.div
                        drag={isPlaying && !paused}
                        dragSnapToOrigin
                        onDragStart={() => sounds.playClick(soundEnabled)}
                        onDrag={(e, info) => handleDrag(e, info, idx)}
                        onDragEnd={(e, info) => handleDragEnd(e, info, idx)}
                        whileDrag={{ scale: 1.2, zIndex: 50 }}
                        className={cn(
                          "drag-shape grid gap-[1px] cursor-grab active:cursor-grabbing relative z-10 transition-shadow",
                          selectedShapeIdx === idx ? "ring-2 ring-cyan-500/50 rounded-lg p-1 bg-cyan-950/20" : ""
                        )}
                        style={{ gridTemplateColumns: `repeat(${shapeObj.shape[0].length}, minmax(0, 1fr))` }}
                        onClick={() => {
                          if (!isPlaying) return;
                          sounds.playClick(soundEnabled);
                          setSelectedShapeIdx(idx === selectedShapeIdx ? null : idx);
                        }}
                      >
                        {shapeObj.shape.map((row: number[], r: number) =>
                          row.map((cell: number, c: number) => (
                            <div
                              key={`${r}-${c}`}
                              className={cn(
                                "w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transition-all duration-150 relative flex items-center justify-center overflow-hidden",
                                cell 
                                  ? cn(
                                      skin.colors[shapeObj.colorIdx] ?? skin.colors[0],
                                      "rounded-md shadow-[0_2px_5px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.3)]"
                                    ) 
                                  : "bg-transparent pointer-events-none"
                              )}
                            >
                              {cell === 1 && (
                                <div className="absolute top-0.5 left-0.5 right-0.5 h-[30%] bg-white/15 rounded-t-sm pointer-events-none" />
                              )}
                            </div>
                          ))
                        )}
                      </motion.div>
                    </div>

                    {/* Shape Actions (Rotate, Hold) */}
                    <div className="flex gap-1.5 mt-3 relative z-20">
                      {inventory.filter(id => id === 'gadget_rotate').length > 0 ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isPlaying) return;
                            if (consumeItem('gadget_rotate')) {
                              sounds.playClick(soundEnabled);
                              rotateShape(idx);
                            }
                          }}
                          disabled={!isPlaying}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg border border-cyan-500/20 hover:border-cyan-500/40 transition-all active:scale-90 disabled:opacity-50 disabled:pointer-events-none relative"
                          title="Tourner le bloc"
                        >
                          <div className="absolute -top-1.5 -right-1.5 text-[8px] bg-cyan-500 text-slate-950 font-black px-1 rounded-full">{inventory.filter(i => i === 'gadget_rotate').length}</div>
                          <RotateCw className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isPlaying) return;
                            sounds.playClick(soundEnabled);
                            alert("Achetez le gadget 'Rotation Tactique' dans la boutique pour utiliser cette fonction ! 🔓");
                          }}
                          disabled={!isPlaying}
                          className="p-1.5 bg-slate-950 text-slate-600 rounded-lg border border-dashed border-slate-800 cursor-not-allowed hover:bg-red-950/20 hover:border-red-900/40 hover:text-red-400 transition-all active:scale-90 disabled:opacity-50 disabled:pointer-events-none relative"
                          title="Rotation Épuisée"
                        >
                          <div className="absolute -top-1.5 -right-1.5 text-[8px] bg-red-500 text-white font-black px-1 rounded-full">0</div>
                          <Lock className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {inventory.filter(id => id === 'gadget_hold').length > 0 ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isPlaying) return;
                            if (consumeItem('gadget_hold')) {
                              sounds.playClick(soundEnabled);
                              holdCurrentShape(idx);
                            }
                          }}
                          disabled={!isPlaying}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-fuchsia-400 rounded-lg border border-fuchsia-500/20 hover:border-fuchsia-500/40 transition-all active:scale-90 disabled:opacity-50 disabled:pointer-events-none relative"
                          title="Mettre en réserve"
                        >
                          <div className="absolute -top-1.5 -right-1.5 text-[8px] bg-fuchsia-500 text-white font-black px-1 rounded-full">{inventory.filter(i => i === 'gadget_hold').length}</div>
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isPlaying) return;
                            sounds.playClick(soundEnabled);
                            alert("Achetez le gadget 'Case de Réserve' dans la boutique pour utiliser cette fonction ! 🔓");
                          }}
                          disabled={!isPlaying}
                          className="p-1.5 bg-slate-950 text-slate-600 rounded-lg border border-dashed border-slate-800 cursor-not-allowed hover:bg-red-950/20 hover:border-red-900/40 hover:text-red-400 transition-all active:scale-90 disabled:opacity-50 disabled:pointer-events-none relative"
                          title="Réserve Épuisée"
                        >
                          <div className="absolute -top-1.5 -right-1.5 text-[8px] bg-red-500 text-white font-black px-1 rounded-full">0</div>
                          <Lock className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Reroll prestige button & Neon Blaster & Time Freeze */}
          <div className="w-full border-t border-white/5 pt-4 flex flex-wrap justify-center gap-3">
            {inventory.filter(id => id === 'gadget_reroll').length > 0 ? (
              <button
                onClick={handleReroll}
                disabled={coins < 50 || gameOver || !isPlaying}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/10 to-amber-600/10 hover:from-yellow-500/20 hover:to-amber-600/20 border border-yellow-500/30 text-yellow-500 disabled:opacity-40 disabled:pointer-events-none rounded-xl text-xs font-bold font-mono tracking-wide transition-all shadow-[0_4px_10px_rgba(234,179,8,0.05)] active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                REROLL ({inventory.filter(i => i === 'gadget_reroll').length}) - 50 SP
              </button>
            ) : (
              <button
                onClick={() => {
                  if (!isPlaying) return;
                  sounds.playClick(soundEnabled);
                  alert("Achetez le gadget 'Reroll de Prestige' dans la boutique pour utiliser cette fonction ! 🔓");
                }}
                disabled={!isPlaying}
                className="flex items-center gap-2 px-4 py-2 bg-slate-950 border border-dashed border-slate-850 text-slate-650 rounded-xl text-xs font-bold font-mono tracking-wide cursor-not-allowed hover:bg-red-950/20 hover:border-red-900/40 hover:text-red-400 transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                REROLL ÉPUISÉ
              </button>
            )}

            {inventory.filter(id => id === 'gadget_neon_blaster').length > 0 ? (
              <button
                onClick={() => {
                  sounds.playClick(soundEnabled);
                  setIsBlasterActive(!isBlasterActive);
                }}
                disabled={gameOver || !isPlaying}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 border rounded-xl text-xs font-bold font-mono tracking-wide transition-all active:scale-95 shadow-md disabled:opacity-50 disabled:pointer-events-none",
                  isBlasterActive
                    ? "bg-red-500 border-red-400 text-slate-950 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                    : "bg-red-500/10 hover:bg-red-500/20 border-red-500/30 text-red-400"
                )}
              >
                <span className="text-sm">🔫</span>
                BLASTER NÉON ({inventory.filter(i => i === 'gadget_neon_blaster').length})
              </button>
            ) : (
              <button
                onClick={() => {
                  if (!isPlaying) return;
                  sounds.playClick(soundEnabled);
                  alert("Débloquez le gadget 'Blaster Néon' via le Snob Pass ou dans la boutique pour détruire des blocs ! 🔓");
                }}
                disabled={!isPlaying}
                className="flex items-center gap-2 px-4 py-2 bg-slate-950 border border-dashed border-slate-850 text-slate-650 rounded-xl text-xs font-bold font-mono tracking-wide cursor-not-allowed hover:bg-red-950/20 hover:border-red-900/40 hover:text-red-400 transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                BLASTER ÉPUISÉ
              </button>
            )}

            {inventory.filter(id => id === 'gadget_time_freeze').length > 0 ? (
              <button
                onClick={() => {
                  if (isPlaying && !isActuallyGameOver && !paused && !isTimeFrozen) {
                    if (consumeItem('gadget_time_freeze')) {
                      sounds.playClick(soundEnabled);
                      setIsTimeFrozen(true);
                      setTimeout(() => setIsTimeFrozen(false), 5000);
                    }
                  }
                }}
                disabled={gameOver || !isPlaying || isTimeFrozen}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 border rounded-xl text-xs font-bold font-mono tracking-wide transition-all active:scale-95 shadow-md disabled:opacity-50 disabled:pointer-events-none",
                  isTimeFrozen
                    ? "bg-cyan-500 border-cyan-400 text-slate-950 animate-pulse shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    : "bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30 text-cyan-450"
                )}
              >
                <span className="text-sm">⏱️</span>
                GEL TEMPOREL ({inventory.filter(i => i === 'gadget_time_freeze').length})
              </button>
            ) : (
              <button
                onClick={() => {
                  if (!isPlaying) return;
                  sounds.playClick(soundEnabled);
                  alert("Débloquez le gadget 'Gel Temporel' via le Snob Pass ou dans la boutique pour figer le chronomètre ! 🔓");
                }}
                disabled={!isPlaying}
                className="flex items-center gap-2 px-4 py-2 bg-slate-950 border border-dashed border-slate-850 text-slate-650 rounded-xl text-xs font-bold font-mono tracking-wide cursor-not-allowed hover:bg-red-950/20 hover:border-red-900/40 hover:text-red-400 transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                GEL ÉPUISÉ
              </button>
            )}
          </div>
        </div>
        
      </div>

      {/* Trailing Particle Effects Container */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, scale: p.scale, rotate: p.rotation, x: p.x, y: p.y }}
            animate={{ opacity: 0, scale: 0.2, y: p.y + 40 + p.driftY }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className={cn("fixed pointer-events-none z-50 text-xl select-none font-black font-mono", p.color)}
            style={{ left: 0, top: 0 }}
          >
            {p.char}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
