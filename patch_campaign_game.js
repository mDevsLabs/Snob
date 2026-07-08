const fs = require('fs');
let code = fs.readFileSync('components/CampaignGame.tsx', 'utf8');

code = code.replace(
  'saveCampaignResult(levelId, 3);',
  'saveCampaignResult(levelId, 3);\n      updateQuestProgress("play", 1);\n      updateQuestProgress("score", score);'
);

code = code.replace(
  'if (type === "lines") {',
  'if (type === "lines") {'
);

fs.writeFileSync('components/CampaignGame.tsx', code);
