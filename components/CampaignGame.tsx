"use client";
import React, { useState, useEffect, useRef } from "react";
import { useBlockBlast, GRID_SIZE } from "@/lib/blockBlast";
import { useGameStore } from "@/lib/store";
import { SKINS } from "@/lib/skins";
import { TRAILS } from "@/lib/trails";
import { RotateCcw, Target, ArrowLeft, RotateCw, RefreshCw, Archive, Lock, Pause, Play, Star, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { sounds } from "@/lib/audio";
import { useConfetti } from "@/components/ConfettiProvider";

interface CampaignGameProps {
  levelId: number;
  type: string;
  target: number;
  objectiveText: string;
  onBack: () => void;
}

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

export default function CampaignGame({ levelId, type, target, objectiveText, onBack }: CampaignGameProps) {
  const { 
    grid, hand, score, gameOver, placeShape, reset, checkPlacement,
    rotateShape, holdShape, holdCurrentShape, rotateHoldShape, rerollHand, rerollsUsed 
  } = useBlockBlast();
  const { 
    coins, addCoins, equippedSkin, equippedTrail, saveCampaignResult, updateQuestProgress, 
    soundEnabled, recordGame, inventory, campaignStars, consumeItem
  } = useGameStore();
  
  const currentStars = campaignStars[levelId] || 0;
  const spGainedDisplay = currentStars === 0 ? 50 : (3 > currentStars ? (3 - currentStars) * 10 : 5);
  
  const gridRef = useRef<HTMLDivElement>(null);
  const [selectedShapeIdx, setSelectedShapeIdx] = useState<number | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number } | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  
  const [progress, setProgress] = useState(0);
  const [turns, setTurns] = useState(0);
  const [levelWon, setLevelWon] = useState(false);
  const [paused, setPaused] = useState(false);
  const hasProcessedWin = useRef(false);
  const hasProcessedGameOver = useRef(false);
  const { fireAtElement, popRewardAtElement } = useConfetti();

  const skin = SKINS.find((s) => s.id === equippedSkin) || SKINS[0];
  const activeTrail = TRAILS.find((t) => t.id === equippedTrail) || TRAILS[0];

  const handleReroll = () => {
    if (coins >= 50 && !gameOver && !levelWon) {
      if (consumeItem('gadget_reroll')) {
        addCoins(-50);
        rerollHand();
        sounds.playClick(soundEnabled);
      }
    }
  };

  useEffect(() => {
    if (type === "score") {
      setTimeout(() => {
        setProgress(score);
      }, 0);
    }
  }, [score, type]);

  useEffect(() => {
    if (progress >= target && !levelWon && !hasProcessedWin.current) {
      hasProcessedWin.current = true;
      setTimeout(() => {
        setLevelWon(true);
        // Give 3 stars for simplicity
        saveCampaignResult(levelId, 3);
        updateQuestProgress("play", 1);
        updateQuestProgress("score", score);
        sounds.playWin(soundEnabled);
        recordGame(score, "campaign");
        fireAtElement(gridRef.current, { count: 80 });
        popRewardAtElement(`+${spGainedDisplay} SP`, "#facc15", gridRef.current, "🌟");
      }, 0);
    } else if (progress < target) {
      hasProcessedWin.current = false;
    }
  }, [progress, target, levelWon, levelId, saveCampaignResult, score, updateQuestProgress, soundEnabled, recordGame, spGainedDisplay, fireAtElement, popRewardAtElement]);

  // Escape to pause / resume
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !gameOver && !levelWon) {
        setPaused((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gameOver, levelWon]);

  // Monitor game over to play sound and record
  useEffect(() => {
    if (gameOver && !hasProcessedGameOver.current) {
      hasProcessedGameOver.current = true;
      sounds.playGameOver(soundEnabled);
      recordGame(score, "campaign");
    } else if (!gameOver) {
      hasProcessedGameOver.current = false;
    }
  }, [gameOver, score, soundEnabled, recordGame]);

  // Reset campaign level state when the level changes or mounts
  useEffect(() => {
    setTimeout(() => {
      reset();
      setProgress(0);
      setTurns(0);
      setLevelWon(false);
      setSelectedShapeIdx(null);
      setHoveredCell(null);
    }, 0);
  }, [levelId, reset]);

  const handleDrag = (e: any, info: any, shapeIdx: number) => {
    if (!gridRef.current || gameOver || levelWon || paused) return;
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
    if (activeTrail && activeTrail.type !== "none" && activeTrail.chars && activeTrail.chars.length > 0) {
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
    if (!gridRef.current || gameOver || levelWon || paused) return;
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
    
    if (res !== false) {
      setSelectedShapeIdx(null);
      if (res.linesCleared > 0) {
        updateQuestProgress("lines", res.linesCleared);
        sounds.playClear(soundEnabled, res.linesCleared);
      } else {
        sounds.playMove(soundEnabled);
      }
      setHoveredCell(null);
      
      if (type === "lines") {
        setProgress(prev => prev + res.linesCleared);
      }
      
      setTurns(prev => {
        const newTurns = prev + 1;
        if (type === "survive") setProgress(newTurns);
        return newTurns;
      });
    } else {
      setHoveredCell(null);
      setSelectedShapeIdx(null);
    }
  };

  const handleCellClick = (r: number, c: number) => {
    if (selectedShapeIdx === null || gameOver || levelWon || paused) return;
    const res = placeShape(selectedShapeIdx, r, c);
    
    if (res !== false) {
      setSelectedShapeIdx(null);
      if (res.linesCleared > 0) {
        updateQuestProgress("lines", res.linesCleared);
        sounds.playClear(soundEnabled, res.linesCleared);
      } else {
        sounds.playMove(soundEnabled);
      }
      setHoveredCell(null);
      
      if (type === "lines") {
        setProgress(prev => prev + res.linesCleared);
      }
      
      setTurns(prev => {
        const newTurns = prev + 1;
        if (type === "survive") setProgress(newTurns);
        return newTurns;
      });
    }
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

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 overflow-y-auto w-full">
      <div className="flex w-full max-w-4xl justify-between items-center mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" /> Retour
        </button>
        <div className="text-center">
          <h2 className="text-3xl font-black font-mono tracking-tighter text-fuchsia-400 bg-gradient-to-r from-yellow-400 to-amber-500 text-transparent bg-clip-text">NIVEAU {levelId}</h2>
          <p className="text-slate-300 font-medium flex items-center gap-2 justify-center mt-1">
            <Target className="w-4 h-4 text-cyan-400" /> {objectiveText}
          </p>
        </div>
        <div className="w-20 flex justify-end">
          {!gameOver && !levelWon && (
            <button
              onClick={() => {
                sounds.playClick(soundEnabled);
                setPaused((p) => !p);
              }}
              className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/20 transition-all hover:scale-105 active:scale-95"
              title="Pause"
            >
              {paused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-center justify-center w-full max-w-5xl">
        {/* Left panel: objective & score */}
        <div className="flex flex-col gap-4 w-64">
          <div className="p-6 rounded-2xl bg-slate-900 border border-white/5 shadow-lg text-center">
            <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">Progression</div>
            <div className="text-4xl font-bold font-mono tabular-nums text-cyan-400">
              {progress} <span className="text-xl text-slate-500">/ {target}</span>
            </div>
            <div className="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 transition-all duration-300"
                style={{ width: `${Math.min(100, (progress / target) * 100)}%` }}
              />
            </div>
          </div>
          
          <div className="p-6 rounded-2xl bg-slate-900 border border-white/5 shadow-lg text-center">
            <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Score</div>
            <div className="text-3xl font-bold font-mono text-white">{score.toLocaleString()}</div>
          </div>
        </div>

        {/* Board & Hold */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          
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
                  drag={!gameOver && !levelWon && !paused}
                  dragSnapToOrigin
                  onDragStart={() => sounds.playClick(soundEnabled)}
                  onDrag={(e, info) => handleDrag(e, info, 999)}
                  onDragEnd={(e, info) => handleDragEnd(e, info, 999)}
                  whileDrag={{ scale: 1.2, zIndex: 50 }}
                  className="drag-shape grid gap-[1px] cursor-grab active:cursor-grabbing relative z-10"
                  style={{ gridTemplateColumns: `repeat(${holdShape.shape[0].length}, minmax(0, 1fr))` }}
                  onClick={() => {
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
                className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono font-bold px-2 py-1.5 rounded-lg border border-white/5 flex items-center gap-1 transition-all active:scale-95 hover:text-white"
              >
                <RotateCw className="w-3 h-3 text-cyan-400" /> Tourner ({inventory.filter(id => id === 'gadget_rotate').length})
              </button>
            )}
          </div>

          {/* Grid Board */}
          <div 
            className="relative bg-slate-950/90 p-4 rounded-3xl border-2 border-slate-800/80 shadow-[0_25px_60px_rgba(0,0,0,0.85)] backdrop-blur-md" 
            onMouseLeave={() => setHoveredCell(null)}
          >
            {/* Subtle elegant inner light reflection ring */}
            <div className="absolute inset-0 rounded-3xl border border-white/5 pointer-events-none" />

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

                  return (
                    <div
                      key={`${r}-${c}`}
                      className={cn(
                        "w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-lg transition-all duration-100 relative flex items-center justify-center overflow-hidden",
                        cellColorClass,
                        isFilled && "shadow-[0_4px_10px_rgba(0,0,0,0.4),inset_0_1.5px_1.5px_rgba(255,255,255,0.35)] active:scale-95",
                        isPreview && isPlacementValid && "opacity-80 scale-95 ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.4)] z-10",
                        isPreview && !isPlacementValid && isFilled && "ring-2 ring-red-500 ring-offset-2 ring-offset-slate-950 z-10 animate-pulse"
                      )}
                      onMouseEnter={() => setHoveredCell({ r, c })}
                      onClick={() => handleCellClick(r, c)}
                    >
                      {isFilled && (
                        <div className="absolute top-0.5 left-0.5 right-0.5 h-[30%] bg-white/15 rounded-t-md pointer-events-none" />
                      )}
                      {isFilled && skin.id === "hacker" && (
                        <span className="flex items-center justify-center w-full h-full text-[9px] font-mono opacity-60 text-green-300">01</span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
            
            {(gameOver || levelWon) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl p-8 text-center z-20"
              >
                <motion.h3
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                  className={cn("text-5xl font-black mb-2 tracking-tight drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]", levelWon ? "text-green-400" : "text-red-500")}
                >
                  {levelWon ? "VICTOIRE !" : "DÉFAITE !"}
                </motion.h3>

                {levelWon && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, staggerChildren: 0.1 }}
                    className="flex gap-2 mb-4"
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.35 + i * 0.15, type: "spring", stiffness: 300, damping: 14 }}
                      >
                        <Star className="w-10 h-10 text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.8)]" fill="currentColor" />
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                <p className="text-slate-300 mb-4 font-mono text-sm">
                  Progression : <span className="font-mono text-white font-bold">{progress} / {target}</span>
                </p>
               
                {levelWon && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mb-6"
                  >
                    <div className="text-yellow-400 font-mono text-sm font-black bg-yellow-500/10 px-4 py-2 border border-yellow-500/30 rounded-xl flex items-center gap-2 shadow-md">
                      <span className="w-5 h-5 rounded-full bg-yellow-500 text-slate-950 flex items-center justify-center font-black text-[9px] leading-none">SP</span>
                      +{spGainedDisplay} SP OBTENUS !
                    </div>
                  </motion.div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      sounds.playClick(soundEnabled);
                      reset();
                      setProgress(0);
                      setTurns(0);
                      setLevelWon(false);
                      setSelectedShapeIdx(null);
                      setHoveredCell(null);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-transform hover:scale-105 active:scale-95"
                  >
                    <RotateCcw className="w-5 h-5" /> REJOUER
                  </button>
                  {levelWon && (
                    <button
                      onClick={() => {
                        sounds.playClick(soundEnabled);
                        onBack();
                      }}
                      className="flex items-center gap-2 px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-xl font-bold transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(217,70,239,0.5)]"
                    >
                      CONTINUER
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {paused && !gameOver && !levelWon && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center rounded-xl p-8 text-center z-30"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-20 h-20 bg-blue-500/10 text-blue-300 border border-blue-500/30 rounded-full flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(59,130,246,0.35)]"
                >
                  <Pause className="w-10 h-10" />
                </motion.div>
                <h3 className="text-4xl font-black text-blue-300 mb-2 tracking-tight">PAUSE</h3>
                <p className="text-slate-400 mb-6 text-sm font-mono">La partie est en pause. Reprenez quand vous voulez.</p>
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
          </div>
        </div>

        {/* Hand panel */}
        <div className="flex flex-col items-center gap-4 bg-slate-900/50 p-6 rounded-2xl border border-white/5 w-64 shadow-lg shrink-0">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">PIÈCES DISPONIBLES</span>
          <div className="flex flex-col gap-6 w-full">
            {hand.map((shapeObj, idx) => (
              <div
                key={shapeObj.id}
                className={cn(
                  "flex flex-col items-center justify-between min-h-[120px] transition-all relative",
                  shapeObj.used ? "opacity-0 pointer-events-none" : "opacity-100"
                )}
              >
                {!shapeObj.used && (
                  <>
                    <div className="flex-1 flex items-center justify-center">
                      <motion.div
                        drag={!gameOver && !levelWon && !paused}
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
                          sounds.playClick(soundEnabled);
                          setSelectedShapeIdx(idx === selectedShapeIdx ? null : idx);
                        }}
                      >
                        {shapeObj.shape.map((row: number[], r: number) =>
                          row.map((cell: number, c: number) => (
                            <div
                              key={`${r}-${c}`}
                              className={cn(
                                "w-4 h-4 sm:w-5 sm:h-5 transition-all duration-150 relative flex items-center justify-center overflow-hidden",
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
                    <div className="flex gap-1.5 mt-2 relative z-20">
                      {inventory.filter(id => id === 'gadget_rotate').length > 0 ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (consumeItem('gadget_rotate')) {
                              sounds.playClick(soundEnabled);
                              rotateShape(idx);
                            }
                          }}
                          className="p-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg border border-cyan-500/20 hover:border-cyan-500/40 transition-all active:scale-90 relative"
                          title="Tourner le bloc"
                        >
                          <div className="absolute -top-1.5 -right-1.5 text-[8px] bg-cyan-500 text-slate-950 font-black px-1 rounded-full scale-75">{inventory.filter(i => i === 'gadget_rotate').length}</div>
                          <RotateCw className="w-3 h-3" />
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            sounds.playClick(soundEnabled);
                            alert("Achetez le gadget 'Rotation Tactique' dans la boutique pour utiliser cette fonction ! 🔓");
                          }}
                          className="p-1 bg-slate-950 text-slate-600 rounded-lg border border-dashed border-slate-800 cursor-not-allowed hover:bg-red-950/20 hover:border-red-900/40 hover:text-red-400 transition-all active:scale-90 relative"
                          title="Rotation Épuisée"
                        >
                          <div className="absolute -top-1.5 -right-1.5 text-[8px] bg-red-500 text-white font-black px-1 rounded-full scale-75">0</div>
                          <Lock className="w-3 h-3" />
                        </button>
                      )}

                      {inventory.filter(id => id === 'gadget_hold').length > 0 ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (consumeItem('gadget_hold')) {
                              sounds.playClick(soundEnabled);
                              holdCurrentShape(idx);
                            }
                          }}
                          className="p-1 bg-slate-800 hover:bg-slate-700 text-fuchsia-400 rounded-lg border border-fuchsia-500/20 hover:border-fuchsia-500/40 transition-all active:scale-90 relative"
                          title="Mettre en réserve"
                        >
                          <div className="absolute -top-1.5 -right-1.5 text-[8px] bg-fuchsia-500 text-white font-black px-1 rounded-full scale-75">{inventory.filter(i => i === 'gadget_hold').length}</div>
                          <Archive className="w-3 h-3" />
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            sounds.playClick(soundEnabled);
                            alert("Achetez le gadget 'Case de Réserve' dans la boutique pour utiliser cette fonction ! 🔓");
                          }}
                          className="p-1 bg-slate-950 text-slate-600 rounded-lg border border-dashed border-slate-800 cursor-not-allowed hover:bg-red-950/20 hover:border-red-900/40 hover:text-red-400 transition-all active:scale-90 relative"
                          title="Réserve Épuisée"
                        >
                          <div className="absolute -top-1.5 -right-1.5 text-[8px] bg-red-500 text-white font-black px-1 rounded-full scale-75">0</div>
                          <Lock className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Reroll prestige button */}
          {inventory.filter(id => id === 'gadget_reroll').length > 0 ? (
            <button
              onClick={handleReroll}
              disabled={coins < 50 || gameOver || levelWon}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-yellow-500/10 to-amber-600/10 hover:from-yellow-500/20 hover:to-amber-600/20 border border-yellow-500/30 text-yellow-500 disabled:opacity-40 disabled:pointer-events-none rounded-xl text-[10px] font-bold font-mono tracking-wide transition-all shadow-[0_4px_10px_rgba(234,179,8,0.05)] active:scale-95 w-full justify-center mt-2"
            >
              <RefreshCw className="w-3 h-3" />
              REROLL ({inventory.filter(i => i === 'gadget_reroll').length}) - 50 SP
            </button>
          ) : (
            <button
              onClick={() => {
                sounds.playClick(soundEnabled);
                alert("Achetez le gadget 'Reroll de Prestige' dans la boutique pour utiliser cette fonction ! 🔓");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 border border-dashed border-slate-850 text-slate-650 rounded-xl text-[10px] font-bold font-mono tracking-wide cursor-not-allowed hover:bg-red-950/20 hover:border-red-900/40 hover:text-red-400 transition-all w-full justify-center mt-2"
            >
              <Lock className="w-3 h-3 text-slate-500" />
              REROLL ÉPUISÉ
            </button>
          )}
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
