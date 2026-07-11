import { useState, useCallback, useEffect } from 'react';
import { GRID_SIZE, SHAPES } from './blockBlast';

const getDailySeed = (dateStr: string) => {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

export const useDailyChallenge = () => {
  const [dailyDate, setDailyDate] = useState<string>('');
  const [grid, setGrid] = useState<number[][]>([]);
  const [hand, setHand] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [blocksRemaining, setBlocksRemaining] = useState(10);
  const [completed, setCompleted] = useState(false);
  const [bestScore, setBestScore] = useState(0);
  
  const initDaily = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    setDailyDate(today);
    
    let seed = getDailySeed(today);
    
    // Generate grid (30% filled)
    const newGrid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (seededRandom(seed++) < 0.3) {
          newGrid[i][j] = Math.floor(seededRandom(seed++) * 7) + 1;
        }
      }
    }
    
    // Prevent full rows/cols in initial grid
    for (let i = 0; i < GRID_SIZE; i++) {
      if (newGrid[i].every(c => c !== 0)) newGrid[i][Math.floor(seededRandom(seed++) * GRID_SIZE)] = 0;
      let colFull = true;
      for (let j = 0; j < GRID_SIZE; j++) {
        if (newGrid[j][i] === 0) colFull = false;
      }
      if (colFull) newGrid[Math.floor(seededRandom(seed++) * GRID_SIZE)][i] = 0;
    }
    
    setGrid(newGrid);
    
    // Generate initial hand (first 3 of 10)
    const initialHand = [];
    for (let i = 0; i < 3; i++) {
      const shapeIdx = Math.floor(seededRandom(seed++) * SHAPES.length);
      const colorIdx = Math.floor(seededRandom(seed++) * 7);
      initialHand.push({
        shape: SHAPES[shapeIdx],
        used: false,
        id: `daily_${i}`,
        colorIdx,
        seedVal: seed // pass seed to generate next blocks later if needed
      });
    }
    setHand(initialHand);
    setScore(0);
    setGameOver(false);
    setBlocksRemaining(10);
  }, []);

  useEffect(() => {
    initDaily();
  }, [initDaily]);

  const checkPlacement = useCallback((shape: number[][], r: number, c: number) => {
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].length; j++) {
        if (shape[i][j]) {
          const rr = r + i;
          const cc = c + j;
          if (rr < 0 || rr >= GRID_SIZE || cc < 0 || cc >= GRID_SIZE || grid[rr][cc] !== 0) {
            return false;
          }
        }
      }
    }
    return true;
  }, [grid]);

  const getRotations = (shape: number[][]) => {
    const rotations = [shape];
    let current = shape;
    for (let r = 0; r < 3; r++) {
      const n = current.length;
      const m = current[0].length;
      const rotated = Array.from({ length: m }, () => Array(n).fill(0));
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
          rotated[j][n - 1 - i] = current[i][j];
        }
      }
      rotations.push(rotated);
      current = rotated;
    }
    return rotations;
  };

  const checkGameOver = useCallback((currentGrid: number[][], currentHand: any[], currentRemaining: number) => {
    const availableShapes = currentHand.filter(s => !s.used);
    
    if (availableShapes.length === 0 && currentRemaining === 0) return true;
    if (availableShapes.length === 0) return false;

    // Daily Challenge doesn't allow rotations!
    for (const s of availableShapes) {
      const shape = s.shape;
      for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
          let fits = true;
          for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
              if (shape[r][c]) {
                const rr = i + r;
                const cc = j + c;
                if (rr >= GRID_SIZE || cc >= GRID_SIZE || currentGrid[rr][cc] !== 0) {
                  fits = false;
                  break;
                }
              }
            }
            if (!fits) break;
          }
          if (fits) return false; // At least one fit found
        }
      }
    }

    return true; // No fits found
  }, []);

  const placeShape = useCallback((handIndex: number, r: number, c: number) => {
    if (gameOver) return false;
    if (handIndex < 0 || handIndex >= hand.length || hand[handIndex].used) return false;

    const shape = hand[handIndex].shape;
    if (!checkPlacement(shape, r, c)) return false;

    const newGrid = grid.map(row => [...row]);
    let blocksPlaced = 0;
    const colorVal = (hand[handIndex].colorIdx !== undefined ? hand[handIndex].colorIdx : 0) + 1;
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].length; j++) {
        if (shape[i][j]) {
          newGrid[r + i][c + j] = colorVal;
          blocksPlaced++;
        }
      }
    }

    let rowsToClear: number[] = [];
    let colsToClear: number[] = [];

    for (let i = 0; i < GRID_SIZE; i++) {
      if (newGrid[i].every(cell => cell !== 0)) rowsToClear.push(i);
    }
    for (let j = 0; j < GRID_SIZE; j++) {
      let colFull = true;
      for (let i = 0; i < GRID_SIZE; i++) {
        if (newGrid[i][j] === 0) {
          colFull = false;
          break;
        }
      }
      if (colFull) colsToClear.push(j);
    }

    const linesCleared = rowsToClear.length + colsToClear.length;
    rowsToClear.forEach(row => {
      for (let j = 0; j < GRID_SIZE; j++) newGrid[row][j] = 0;
    });
    colsToClear.forEach(col => {
      for (let i = 0; i < GRID_SIZE; i++) newGrid[i][col] = 0;
    });

    const comboMultiplier = linesCleared > 1 ? linesCleared : 1;
    const newScore = score + blocksPlaced + (linesCleared * 100 * comboMultiplier);
    
    setScore(newScore);
    setGrid(newGrid);

    const newHand = [...hand];
    newHand[handIndex].used = true;
    
    let nextRemaining = blocksRemaining - 1;
    setBlocksRemaining(nextRemaining);

    let finalHand = newHand;
    if (newHand.every(s => s.used) && nextRemaining > 0) {
      // Generate next batch of 3 (or less if nextRemaining < 3)
      const shapesToGen = Math.min(3, nextRemaining);
      let currentSeed = newHand[0].seedVal + 1000; // mutate seed
      const nextBatch = [];
      for (let i = 0; i < 3; i++) {
        if (i < shapesToGen) {
          const shapeIdx = Math.floor(seededRandom(currentSeed++) * SHAPES.length);
          const colorIdx = Math.floor(seededRandom(currentSeed++) * 7);
          nextBatch.push({
            shape: SHAPES[shapeIdx],
            used: false,
            id: `daily_next_${currentSeed}`,
            colorIdx,
            seedVal: currentSeed
          });
        } else {
          nextBatch.push({ shape: [[1]], used: true, id: 'dummy', colorIdx: 0, seedVal: 0 }); // pad with used shapes
        }
      }
      finalHand = nextBatch;
    }
    
    setHand(finalHand);

    if (checkGameOver(newGrid, finalHand, nextRemaining)) {
      setGameOver(true);
    }

    return { linesCleared, comboMultiplier, newScore, gameOver: checkGameOver(newGrid, finalHand, nextRemaining) };
  }, [grid, hand, score, gameOver, blocksRemaining, checkPlacement, checkGameOver]);

  const reset = useCallback(() => {
    initDaily();
  }, [initDaily]);

  return {
    grid,
    hand,
    score,
    gameOver,
    blocksRemaining,
    dailyDate,
    completed,
    bestScore,
    placeShape,
    checkPlacement,
    reset
  };
};
