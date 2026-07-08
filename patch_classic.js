const fs = require('fs');
let code = fs.readFileSync('components/Classic.tsx', 'utf8');

code = code.replace(
  'const { classicHighScore, updateClassicHighScore, equippedSkin, addCoins, addXp } = useGameStore();',
  'const { classicHighScore, updateClassicHighScore, equippedSkin, addCoins, addXp, updateQuestProgress } = useGameStore();'
);

code = code.replace(
  'addXp(Math.floor(score / 10));',
  'addXp(Math.floor(score / 10));\n      updateQuestProgress("play", 1);\n      updateQuestProgress("score", score);'
);

code = code.replace(
  'if (res.linesCleared > 0) {',
  'if (res.linesCleared > 0) {\n        updateQuestProgress("lines", res.linesCleared);'
);

fs.writeFileSync('components/Classic.tsx', code);
