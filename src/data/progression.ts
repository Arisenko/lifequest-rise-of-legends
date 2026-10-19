export const MAX_LEVEL = 100;
export function xpToNextLevel(level: number) {
  const current = Math.min(MAX_LEVEL, Math.max(1, Math.floor(Number.isFinite(level) ? level : 1)));
  return current === MAX_LEVEL ? 0 : 3000 * current + 200 * current * current;
}

export function awardXp(xp: number, level: number, amount: number) {
  level = Math.min(MAX_LEVEL, Math.max(1, level));
  if (level === MAX_LEVEL) return { level, xp: 0 };
  xp += Math.max(0, amount);
  while (level < MAX_LEVEL && xp >= xpToNextLevel(level)) { xp -= xpToNextLevel(level); level++; }
  return { level, xp: level === MAX_LEVEL ? 0 : xp };
}
