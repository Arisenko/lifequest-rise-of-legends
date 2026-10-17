export const MAX_LEVEL = 100;
export function awardXp(xp: number, level: number, amount: number) {
  level = Math.min(MAX_LEVEL, Math.max(1, level));
  if (level === MAX_LEVEL) return { level, xp: 0 };
  xp += Math.max(0, amount);
  while (level < MAX_LEVEL && xp >= level * 100) { xp -= level * 100; level++; }
  return { level, xp: level === MAX_LEVEL ? 0 : xp };
}
