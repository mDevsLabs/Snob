import { useState, useCallback } from 'react';

export const GRID_SIZE = 8;

export interface CellState {
  color: number;
  frozen: boolean;
  cracked: boolean;
  bomb: boolean;
}

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

const getEmptyGrid = (): CellState[][] => 
  Array.from({ length: GRID_SIZE }, () => 
    Array.from({ length: GRID_SIZE }, () => ({ color: 0, frozen: false, cracked: false, bomb: false }))
  );

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

export const useBlockBlastSpecial = () => {
  const [grid, setGrid] = useState<CellState[][]>(getEmptyGrid());
  const [hand, setHand] = useState(getRandomShapes());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [holdShape, setHoldShape] = useState<any | null>(null);
  const [rerollsUsed, setRerollsUsed] = useState(0);
  const [frozenDestroyed, setFrozenDestroyed] = useState(0);
  const [bombsTriggered, setBombsTriggered] = useState(0);

  const checkPlacement = useCallback((shape: number[][], r: number, c: number) => {
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].length; j++) {
        if (shape[i][j]) {
          const rr = r + i;
          const cc = c + j;
          if (rr < 0 || rr >= GRID_SIZE || cc < 0 || cc >= GRID_SIZE || grid[rr][cc].color !== 0) {
            return false;
          }
        }
      }
    }
    return true;
  }, [grid]);

  const checkGameOver = useCallback((currentGrid: CellState[][], currentHand: any[], currentHold: any | null) => {
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
                  if (rr >= GRID_SIZE || cc >= GRID_SIZE || currentGrid[rr][cc].color !== 0) {
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
                  if (rr >= GRID_SIZE || cc >= GRID_SIZE || currentGrid[rr][cc].color !== 0) {
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

    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    let blocksPlaced = 0;
    const colorIdx = isHold ? holdShape.colorIdx : hand[handIndex].colorIdx;
    const colorVal = (colorIdx !== undefined ? colorIdx : 0) + 1;
    
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].length; j++) {
        if (shape[i][j]) {
          const isFrozen = Math.random() < 0.15;
          const isBomb = !isFrozen && Math.random() < 0.10;
          newGrid[r + i][c + j] = { color: colorVal, frozen: isFrozen, cracked: false, bomb: isBomb };
          blocksPlaced++;
        }
      }
    }

    let rowsToClear: number[] = [];
    let colsToClear: number[] = [];

    for (let i = 0; i < GRID_SIZE; i++) {
      if (newGrid[i].every(cell => cell.color !== 0)) rowsToClear.push(i);
    }
    for (let j = 0; j < GRID_SIZE; j++) {
      let colFull = true;
      for (let i = 0; i < GRID_SIZE; i++) {
        if (newGrid[i][j].color === 0) {
          colFull = false;
          break;
        }
      }
      if (colFull) colsToClear.push(j);
    }

    const linesCleared = rowsToClear.length + colsToClear.length;
    let localFrozenDestroyed = 0;
    let localBombsTriggered = 0;
    
    const cellsToHit = new Set<string>();
    
    rowsToClear.forEach(row => {
      for (let j = 0; j < GRID_SIZE; j++) cellsToHit.add(`${row},${j}`);
    });
    colsToClear.forEach(col => {
      for (let i = 0; i < GRID_SIZE; i++) cellsToHit.add(`${i},${col}`);
    });
    
    const processHits = (hits: Set<string>) => {
      let newlyHit = false;
      const arrayHits = Array.from(hits);
      
      for (const hitStr of arrayHits) {
        const [row, col] = hitStr.split(',').map(Number);
        const cell = newGrid[row][col];
        if (cell.color !== 0) {
          if (cell.bomb) {
            localBombsTriggered++;
            cell.color = 0; // Destroy bomb immediately
            cell.bomb = false;
            // Add adjacent cells to hits
            for (let dr = -1; dr <= 1; dr++) {
              for (let dc = -1; dc <= 1; dc++) {
                const nr = row + dr;
                const nc = col + dc;
                if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
                  const nHitStr = `${nr},${nc}`;
                  if (!hits.has(nHitStr) && newGrid[nr][nc].color !== 0) {
                    hits.add(nHitStr);
                    newlyHit = true;
                  }
                }
              }
            }
          }
        }
      }
      
      if (newlyHit) processHits(hits);
    };
    
    if (cellsToHit.size > 0) {
      processHits(cellsToHit);
      
      cellsToHit.forEach(hitStr => {
        const [row, col] = hitStr.split(',').map(Number);
        const cell = newGrid[row][col];
        if (cell.color !== 0 && !cell.bomb) { // Bombs were already destroyed
          if (cell.frozen) {
            if (cell.cracked) {
              cell.color = 0;
              cell.frozen = false;
              cell.cracked = false;
              localFrozenDestroyed++;
            } else {
              cell.cracked = true;
            }
          } else {
            cell.color = 0;
          }
        }
      });
    }

    const comboMultiplier = linesCleared > 1 ? linesCleared : 1;
    let newScore = score + blocksPlaced + (linesCleared * 100 * comboMultiplier);
    newScore += localFrozenDestroyed * 50;
    newScore += localBombsTriggered * 100;
    
    setScore(newScore);
    setGrid(newGrid);
    
    if (localFrozenDestroyed > 0) setFrozenDestroyed(prev => prev + localFrozenDestroyed);
    if (localBombsTriggered > 0) setBombsTriggered(prev => prev + localBombsTriggered);

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

    return { 
      linesCleared, 
      comboMultiplier, 
      newScore, 
      gameOver: checkGameOver(newGrid, finalHand, nextHoldShape),
      frozenDestroyed: localFrozenDestroyed,
      bombsTriggered: localBombsTriggered
    };
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
    
    setHoldShape({
      ...holdShape,
      shape: rotated
    });
    
    if (checkGameOver(grid, hand, { ...holdShape, shape: rotated })) {
      setGameOver(true);
    }
  }, [holdShape, gameOver, grid, hand, checkGameOver]);

  const holdCurrentShape = useCallback((handIndex: number) => {
    if (gameOver || hand[handIndex].used) return;
    const currentShape = hand[handIndex];
    
    const newHand = [...hand];
    if (holdShape && !holdShape.used) {
      newHand[handIndex] = { ...holdShape, used: false };
    } else {
      newHand[handIndex].used = true;
    }
    
    setHoldShape({ ...currentShape, used: false });
    
    if (newHand.every(s => s.used)) {
      setHand(getRandomShapes());
    } else {
      setHand(newHand);
    }
    
    if (checkGameOver(grid, newHand.every(s => s.used) ? getRandomShapes() : newHand, currentShape)) {
      setGameOver(true);
    }
  }, [hand, holdShape, gameOver, grid, checkGameOver]);

  const rerollHand = useCallback(() => {
    if (gameOver) return false;
    const newHand = getRandomShapes();
    setHand(newHand);
    setRerollsUsed(prev => prev + 1);
    
    if (checkGameOver(grid, newHand, holdShape)) {
      setGameOver(true);
    }
    return true;
  }, [gameOver, grid, holdShape, checkGameOver]);

  const destroyCell = useCallback((r: number, c: number) => {
    if (gameOver || r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) return false;
    
    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    newGrid[r][c] = { color: 0, frozen: false, cracked: false, bomb: false };
    
    setGrid(newGrid);
    
    if (checkGameOver(newGrid, hand, holdShape)) {
      setGameOver(true);
    }
    
    return true;
  }, [grid, gameOver, hand, holdShape, checkGameOver]);

  const reset = useCallback(() => {
    setGrid(getEmptyGrid());
    setHand(getRandomShapes());
    setScore(0);
    setGameOver(false);
    setHoldShape(null);
    setRerollsUsed(0);
    setFrozenDestroyed(0);
    setBombsTriggered(0);
  }, []);

  return {
    grid,
    hand,
    score,
    gameOver,
    holdShape,
    rerollsUsed,
    frozenDestroyed,
    bombsTriggered,
    placeShape,
    rotateShape,
    rotateHoldShape,
    holdCurrentShape,
    rerollHand,
    destroyCell,
    checkPlacement,
    reset
  };
};
