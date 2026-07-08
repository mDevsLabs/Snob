import { useState, useCallback } from 'react';

export const GRID_SIZE = 8;

export const SHAPES = [
  // 1x1
  [[1]],
  // 2x1, 1x2
  [[1, 1]], [[1], [1]],
  // 3x1, 1x3
  [[1, 1, 1]], [[1], [1], [1]],
  // 4x1, 1x4
  [[1, 1, 1, 1]], [[1], [1], [1], [1]],
  // 5x1, 1x5
  [[1, 1, 1, 1, 1]], [[1], [1], [1], [1], [1]],
  // 2x2
  [[1, 1], [1, 1]],
  // 3x3
  [[1, 1, 1], [1, 1, 1], [1, 1, 1]],
  // L-shapes
  [[1, 0], [1, 1]], [[0, 1], [1, 1]], [[1, 1], [1, 0]], [[1, 1], [0, 1]],
  // Big L-shapes (3x3)
  [[1, 0, 0], [1, 0, 0], [1, 1, 1]], [[0, 0, 1], [0, 0, 1], [1, 1, 1]], [[1, 1, 1], [1, 0, 0], [1, 0, 0]], [[1, 1, 1], [0, 0, 1], [0, 0, 1]]
];

const getRandomShapes = () => {
  return Array.from({ length: 3 }, () => {
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const colorIdx = Math.floor(Math.random() * 7); // 7 beautiful colors matching the skin theme
    return { shape, used: false, id: Math.random().toString(36).substring(7), colorIdx };
  });
};

const getEmptyGrid = () => Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));

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

export const useBlockBlast = () => {
  const [grid, setGrid] = useState<number[][]>(getEmptyGrid());
  const [hand, setHand] = useState(getRandomShapes());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [holdShape, setHoldShape] = useState<any | null>(null);
  const [rerollsUsed, setRerollsUsed] = useState(0);

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

  const checkGameOver = useCallback((currentGrid: number[][], currentHand: any[], currentHold: any | null) => {
    const availableShapes = currentHand.filter(s => !s.used);
    if (availableShapes.length === 0 && (!currentHold || currentHold.used)) return false;

    // Check hand shapes in all possible rotations
    for (const s of availableShapes) {
      const allRotations = getRotations(s.shape);
      for (const shape of allRotations) {
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
    }

    // Check hold shape in all possible rotations
    if (currentHold && !currentHold.used) {
      const allRotations = getRotations(currentHold.shape);
      for (const shape of allRotations) {
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
            if (fits) return false;
          }
        }
      }
    }

    return true; // No fits found
  }, []);

  const placeShape = useCallback((handIndex: number, r: number, c: number) => {
    if (gameOver) return false;
    const isHold = handIndex === 999;
    if (isHold && (!holdShape || holdShape.used)) return false;
    if (!isHold && (handIndex < 0 || handIndex >= hand.length || hand[handIndex].used)) return false;

    const shape = isHold ? holdShape.shape : hand[handIndex].shape;
    if (!checkPlacement(shape, r, c)) return false;

    const newGrid = grid.map(row => [...row]);
    let blocksPlaced = 0;
    const colorIdx = isHold ? holdShape.colorIdx : hand[handIndex].colorIdx;
    const colorVal = (colorIdx !== undefined ? colorIdx : 0) + 1;
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

    let nextHoldShape = holdShape;
    if (isHold) {
      nextHoldShape = null;
      setHoldShape(null);
    }

    let finalHand = hand;
    if (!isHold) {
      const newHand = [...hand];
      newHand[handIndex].used = true;
      finalHand = newHand;
      if (newHand.every(s => s.used)) {
        finalHand = getRandomShapes();
      }
      setHand(finalHand);
    }

    if (checkGameOver(newGrid, finalHand, nextHoldShape)) {
      setGameOver(true);
    }

    return { linesCleared, comboMultiplier, newScore, gameOver: checkGameOver(newGrid, finalHand, nextHoldShape) };
  }, [grid, hand, score, gameOver, holdShape, checkPlacement, checkGameOver]);

  const rotateShape = useCallback((handIndex: number) => {
    if (gameOver || hand[handIndex].used) return;
    const newHand = [...hand];
    const shape = newHand[handIndex].shape;
    
    const n = shape.length;
    const m = shape[0].length;
    const rotated = Array.from({ length: m }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < m; j++) {
        rotated[j][n - 1 - i] = shape[i][j];
      }
    }
    
    newHand[handIndex] = {
      ...newHand[handIndex],
      shape: rotated
    };
    
    setHand(newHand);
    
    if (checkGameOver(grid, newHand, holdShape)) {
      setGameOver(true);
    }
  }, [hand, grid, holdShape, gameOver, checkGameOver]);

  const rotateHoldShape = useCallback(() => {
    if (gameOver || !holdShape || holdShape.used) return;
    const shape = holdShape.shape;
    
    const n = shape.length;
    const m = shape[0].length;
    const rotated = Array.from({ length: m }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < m; j++) {
        rotated[j][n - 1 - i] = shape[i][j];
      }
    }
    
    const newHold = {
      ...holdShape,
      shape: rotated
    };
    
    setHoldShape(newHold);
    
    if (checkGameOver(grid, hand, newHold)) {
      setGameOver(true);
    }
  }, [holdShape, grid, hand, gameOver, checkGameOver]);

  const holdCurrentShape = useCallback((handIndex: number) => {
    if (gameOver || hand[handIndex].used) return;
    const currentShape = hand[handIndex];
    
    const newHand = [...hand];
    let newHold = null;
    
    if (holdShape) {
      newHand[handIndex] = { ...holdShape, used: false };
      newHold = { ...currentShape, used: false };
    } else {
      newHand[handIndex] = { ...currentShape, used: true };
      newHold = { ...currentShape, used: false };
    }
    
    setHoldShape(newHold);
    
    let finalHand = newHand;
    if (newHand.every(s => s.used)) {
      finalHand = getRandomShapes();
    }
    setHand(finalHand);
    
    if (checkGameOver(grid, finalHand, newHold)) {
      setGameOver(true);
    }
  }, [hand, holdShape, grid, gameOver, checkGameOver]);

  const rerollHand = useCallback(() => {
    if (gameOver) return;
    const newHand = getRandomShapes();
    setHand(newHand);
    setRerollsUsed(prev => prev + 1);
    
    if (checkGameOver(grid, newHand, holdShape)) {
      setGameOver(true);
    }
  }, [grid, holdShape, gameOver, checkGameOver]);

  const reset = useCallback(() => {
    setGrid(getEmptyGrid());
    setHand(getRandomShapes());
    setScore(0);
    setGameOver(false);
    setHoldShape(null);
    setRerollsUsed(0);
  }, []);

  return {
    grid,
    hand,
    score,
    gameOver,
    placeShape,
    reset,
    checkPlacement,
    rotateShape,
    holdShape,
    holdCurrentShape,
    rotateHoldShape,
    rerollHand,
    rerollsUsed
  };
};
