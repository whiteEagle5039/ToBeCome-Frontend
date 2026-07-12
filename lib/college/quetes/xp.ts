const BASE_XP = 500;
const GROWTH = 1.2;

export function xpRequiredForLevel(level: number): number {
  if (level <= 1) return 0;
  let total = 0;
  let step = BASE_XP;
  for (let i = 2; i <= level; i++) {
    total += step;
    step = Math.round(step * GROWTH);
  }
  return total;
}

export function levelFromXp(totalXp: number): {
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  progressPercent: number;
} {
  let level = 1;
  while (xpRequiredForLevel(level + 1) <= totalXp) {
    level++;
  }
  const currentFloor = xpRequiredForLevel(level);
  const nextCeiling = xpRequiredForLevel(level + 1);
  const xpIntoLevel = totalXp - currentFloor;
  const xpForNextLevel = nextCeiling - currentFloor;

  return {
    level,
    xpIntoLevel,
    xpForNextLevel,
    progressPercent: Math.round((xpIntoLevel / xpForNextLevel) * 100),
  };
}
