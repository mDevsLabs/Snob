import { NextResponse } from 'next/server';

export async function GET() {
  const now = new Date();
  const nextMidnight = new Date(now);
  nextMidnight.setUTCHours(24, 0, 0, 0); // Next UTC midnight

  const timeRemainingMs = nextMidnight.getTime() - now.getTime();

  // Deterministic random based on current day string
  const dateStr = now.toISOString().split('T')[0];
  const seed = Array.from(dateStr).reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const generateRandomItem = (index: number) => {
    const random = Math.sin(seed + index) * 10000;
    const value = random - Math.floor(random);
    
    if (value < 0.1) {
      return { id: `item-${index}`, type: 'skin', rarity: 'Legendary', name: 'Neon Void Skin', price: 100, currency: 'gems' };
    } else if (value < 0.3) {
      return { id: `item-${index}`, type: 'laser', rarity: 'Epic', name: 'Laser Beam (+1)', price: 200, currency: 'sp' };
    } else if (value < 0.6) {
      return { id: `item-${index}`, type: 'bomb', rarity: 'Rare', name: 'Bomb (+1)', price: 100, currency: 'sp' };
    } else {
      return { id: `item-${index}`, type: 'reroll', rarity: 'Common', name: 'Rerolls (+3)', price: 50, currency: 'sp' };
    }
  };

  const items = [
    generateRandomItem(1),
    generateRandomItem(2),
    generateRandomItem(3),
    generateRandomItem(4)
  ];

  return NextResponse.json({
    items,
    timeRemainingMs,
    serverTime: now.toISOString(),
    nextMidnight: nextMidnight.toISOString()
  });
}
