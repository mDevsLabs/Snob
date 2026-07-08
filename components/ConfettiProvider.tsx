"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Confetto {
  id: string;
  x: number;
  y: number;
  color: string;
  rotation: number;
  size: number;
  dx: number;
  dy: number;
  delay: number;
  rounded: boolean;
  duration: number;
}

interface FloatText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  icon?: string;
}

interface FireOpts {
  count?: number;
  colors?: string[];
  spread?: number;
}

interface ConfettiCtx {
  fire: (x: number, y: number, opts?: FireOpts) => void;
  fireAtElement: (el: HTMLElement | null, opts?: FireOpts) => void;
  popReward: (text: string, color: string, x: number, y: number, icon?: string) => void;
  popRewardAtElement: (text: string, color: string, el: HTMLElement | null, icon?: string) => void;
}

const Ctx = createContext<ConfettiCtx>({
  fire: () => {},
  fireAtElement: () => {},
  popReward: () => {},
  popRewardAtElement: () => {},
});

export const useConfetti = () => useContext(Ctx);

const PALETTE = ["#facc15", "#d946ef", "#22d3ee", "#34d399", "#f97316", "#a78bfa", "#f43f5e"];

export function ConfettiProvider({ children }: { children: React.ReactNode }) {
  const [pieces, setPieces] = useState<Confetto[]>([]);
  const [floats, setFloats] = useState<FloatText[]>([]);

  const fire = useCallback((x: number, y: number, opts?: FireOpts) => {
    const count = opts?.count ?? 44;
    const colors = opts?.colors ?? PALETTE;
    const spread = opts?.spread ?? 260;

    const newPieces: Confetto[] = Array.from({ length: count }).map(() => {
      const angle = Math.random() * Math.PI * 2;
      const dist = 60 + Math.random() * spread;
      return {
        id: Math.random().toString(36).slice(2),
        x,
        y,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        size: 6 + Math.random() * 9,
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist - 40,
        delay: Math.random() * 0.12,
        rounded: Math.random() > 0.5,
        duration: 1.1 + Math.random() * 0.5,
      };
    });

    setPieces((prev) => [...prev, ...newPieces]);
    window.setTimeout(() => {
      setPieces((prev) => prev.filter((p) => !newPieces.includes(p)));
    }, 1700);
  }, []);

  const fireAtElement = useCallback((el: HTMLElement | null, opts?: FireOpts) => {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    fire(rect.left + rect.width / 2, rect.top + rect.height / 2, opts);
  }, [fire]);

  const popReward = useCallback((text: string, color: string, x: number, y: number, icon?: string) => {
    const id = Math.random().toString(36).slice(2);
    setFloats((prev) => [...prev, { id, x, y, text, color, icon }]);
    window.setTimeout(() => {
      setFloats((prev) => prev.filter((f) => f.id !== id));
    }, 1500);
  }, []);

  const popRewardAtElement = useCallback((text: string, color: string, el: HTMLElement | null, icon?: string) => {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    popReward(text, color, rect.left + rect.width / 2, rect.top, icon);
  }, [popReward]);

  return (
    <Ctx.Provider value={{ fire, fireAtElement, popReward, popRewardAtElement }}>
      {children}

      {/* Confetti layer */}
      <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
        <AnimatePresence>
          {pieces.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: p.x, y: p.y, opacity: 1, scale: 1, rotate: p.rotation }}
              animate={{
                x: p.x + p.dx,
                y: p.y + p.dy + 120,
                opacity: 0,
                scale: 0.3,
                rotate: p.rotation + 360,
              }}
              transition={{ duration: p.duration, ease: "easeOut", delay: p.delay }}
              className="absolute"
              style={{
                width: p.size,
                height: p.size * (p.rounded ? 1 : 1.6),
                background: p.color,
                borderRadius: p.rounded ? "9999px" : "2px",
                boxShadow: `0 0 8px ${p.color}`,
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Floating reward text layer */}
      <div className="fixed inset-0 pointer-events-none z-[101] overflow-hidden">
        <AnimatePresence>
          {floats.map((f) => (
            <motion.div
              key={f.id}
              initial={{ x: f.x, y: f.y, opacity: 0, scale: 0.6 }}
              animate={{ x: f.x, y: f.y - 70, opacity: 1, scale: 1 }}
              exit={{ x: f.x, y: f.y - 110, opacity: 0, scale: 1.1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute -translate-x-1/2 -translate-y-1/2 font-mono font-black text-lg whitespace-nowrap drop-shadow-[0_0_10px_rgba(0,0,0,0.6)]"
              style={{ color: f.color }}
            >
              {f.icon && <span className="mr-1">{f.icon}</span>}
              {f.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}
