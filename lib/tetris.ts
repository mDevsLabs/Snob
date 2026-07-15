import { useState, useCallback, useEffect, useMemo } from 'react';

// Simplified Tetris-like hook for the Blitz/Campaign modes
export type Grid = (number | string)[][];

const COLS = 10;
const ROWS = 20;

const SHAPES = [
  [], // 0 = empty
  [[1, 1, 1, 1]], // I - cyan
  [[1, 1], [1, 1]], // O - yellow
  [[0, 1, 0], [1, 1, 1]], // T - purple
  [[1, 0, 0], [1, 1, 1]], // L - orange
  [[0, 0, 1], [1, 1, 1]], // J - blue
  [[0, 1, 1], [1, 1, 0]], // S - green
  [[1, 1, 0], [0, 1, 1]], // Z - red
];

const COLORS = [
  'transparent',
  'bg-cyan-500',
  'bg-yellow-400',
  'bg-fuchsia-500',
  'bg-orange-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-red-500',
];

const createEmptyGrid = () => Array.from({ length: ROWS }, () => Array(COLS).fill(0));

export const useTetris = () => {
  const [grid, setGrid] = useState<Grid>(createEmptyGrid());
  const [piece, setPiece] = useState<any>(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Expose an event when lines are cleared for Blitz mode
  const [lastClearedLines, setLastClearedLines] = useState(0);

  const spawnPiece = useCallback(() => {
    const typeId = Math.floor(Math.random() * 7) + 1;
    const shape = SHAPES[typeId];
    setPiece({
      shape,
      typeId,
      x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2),
      y: 0,
    });
  }, []);

  const startGame = useCallback(() => {
    setGrid(createEmptyGrid());
    setScore(0);
    setLines(0);
    setGameOver(false);
    setIsPlaying(true);
    setLastClearedLines(0);
    spawnPiece();
  }, [spawnPiece]);

  const stopGame = useCallback(() => {
    setIsPlaying(false);
    setGameOver(true);
  }, []);

  const checkCollision = useCallback((p = piece, g = grid, moveX = 0, moveY = 0) => {
    if (!p) return false;
    for (let y = 0; y < p.shape.length; y++) {
      for (let x = 0; x < p.shape[y].length; x++) {
        if (p.shape[y][x]) {
          const nextX = p.x + x + moveX;
          const nextY = p.y + y + moveY;
          if (nextX < 0 || nextX >= COLS || nextY >= ROWS || (nextY >= 0 && g[nextY][nextX] !== 0)) {
            return true;
          }
        }
      }
    }
    return false;
  }, [piece, grid]);

  const mergePiece = useCallback(() => {
    if (!piece) return;
    const newGrid = grid.map(row => [...row]);
    let gameO = false;
    piece.shape.forEach((row: number[], y: number) => {
      row.forEach((val, x) => {
        if (val) {
          if (piece.y + y < 0) {
            gameO = true;
          } else {
            newGrid[piece.y + y][piece.x + x] = piece.typeId;
          }
        }
      });
    });

    if (gameO) {
      setGameOver(true);
      setIsPlaying(false);
      return;
    }

    // Clear lines
    let linesCleared = 0;
    const finalGrid = newGrid.filter(row => {
      if (row.every(cell => cell !== 0)) {
        linesCleared++;
        return false;
      }
      return true;
    });

    while (finalGrid.length < ROWS) {
      finalGrid.unshift(Array(COLS).fill(0));
    }

    if (linesCleared > 0) {
      setScore(s => s + [0, 100, 300, 500, 800][linesCleared] * (Math.floor(lines / 10) + 1));
      setLines(l => l + linesCleared);
      setLastClearedLines(linesCleared);
    } else {
      setLastClearedLines(0);
    }

    setGrid(finalGrid);
    spawnPiece();
  }, [piece, grid, spawnPiece, lines]);

  const moveDown = useCallback(() => {
    if (!isPlaying || gameOver || !piece) return;
    if (!checkCollision(piece, grid, 0, 1)) {
      setPiece((p: any) => ({ ...p, y: p.y + 1 }));
    } else {
      mergePiece();
    }
  }, [isPlaying, gameOver, piece, grid, checkCollision, mergePiece]);

  const moveLeft = useCallback(() => {
    if (!isPlaying || gameOver || !piece) return;
    if (!checkCollision(piece, grid, -1, 0)) {
      setPiece((p: any) => ({ ...p, x: p.x - 1 }));
    }
  }, [isPlaying, gameOver, piece, grid, checkCollision]);

  const moveRight = useCallback(() => {
    if (!isPlaying || gameOver || !piece) return;
    if (!checkCollision(piece, grid, 1, 0)) {
      setPiece((p: any) => ({ ...p, x: p.x + 1 }));
    }
  }, [isPlaying, gameOver, piece, grid, checkCollision]);

  const rotate = useCallback(() => {
    if (!isPlaying || gameOver || !piece) return;
    const rotatedShape = piece.shape[0].map((_: any, i: number) =>
      piece.shape.map((row: any) => row[i]).reverse()
    );
    const newPiece = { ...piece, shape: rotatedShape };
    if (!checkCollision(newPiece, grid, 0, 0)) {
      setPiece(newPiece);
    }
  }, [isPlaying, gameOver, piece, grid, checkCollision]);

  const hardDrop = useCallback(() => {
    if (!isPlaying || gameOver || !piece) return;
    let y = piece.y;
    while (!checkCollision(piece, grid, 0, (y - piece.y) + 1)) {
      y++;
    }
    const newPiece = { ...piece, y };
    // Temporarily set it so merge piece uses the bottom Y
    setPiece(newPiece);
    // Timeout needed to let state settle before merging, but in a custom hook we can just calculate inline
    // For simplicity, we just merge immediately using the new coordinates
    const newGrid = grid.map(row => [...row]);
    newPiece.shape.forEach((row: number[], py: number) => {
      row.forEach((val, px) => {
        if (val && newPiece.y + py >= 0) {
          newGrid[newPiece.y + py][newPiece.x + px] = newPiece.typeId;
        }
      });
    });
    
    let linesCleared = 0;
    const finalGrid = newGrid.filter(row => {
      if (row.every(cell => cell !== 0)) {
        linesCleared++;
        return false;
      }
      return true;
    });

    while (finalGrid.length < ROWS) {
      finalGrid.unshift(Array(COLS).fill(0));
    }

    if (linesCleared > 0) {
      setScore(s => s + [0, 100, 300, 500, 800][linesCleared] * (Math.floor(lines / 10) + 1));
      setLines(l => l + linesCleared);
      setLastClearedLines(linesCleared);
    } else {
      setLastClearedLines(0);
    }

    setGrid(finalGrid);
    spawnPiece();

  }, [isPlaying, gameOver, piece, grid, checkCollision, spawnPiece, lines]);

  // Handle keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
        e.preventDefault();
      }
      switch (e.key) {
        case 'ArrowLeft': moveLeft(); break;
        case 'ArrowRight': moveRight(); break;
        case 'ArrowDown': moveDown(); break;
        case 'ArrowUp': rotate(); break;
        case ' ': hardDrop(); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, moveLeft, moveRight, moveDown, rotate, hardDrop]);

  // Game loop
  useEffect(() => {
    if (!isPlaying) return;
    const speed = Math.max(100, 1000 - Math.floor(lines / 10) * 100);
    const dropInterval = setInterval(() => {
      moveDown();
    }, speed);
    return () => clearInterval(dropInterval);
  }, [isPlaying, moveDown, lines]);

  const displayGrid = useMemo(() => {
    const gridCopy = grid.map(row => [...row]);
    if (piece) {
      piece.shape.forEach((row: number[], y: number) => {
        row.forEach((val, x) => {
          if (val && piece.y + y >= 0 && piece.y + y < ROWS) {
            gridCopy[piece.y + y][piece.x + x] = piece.typeId;
          }
        });
      });
    }
    return gridCopy;
  }, [grid, piece]);

  return {
    grid: displayGrid,
    score,
    lines,
    gameOver,
    isPlaying,
    startGame,
    stopGame,
    lastClearedLines,
    COLORS
  };
};
