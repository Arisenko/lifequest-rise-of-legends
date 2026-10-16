import type { Item, Stat } from '../types/game';
import { itemById } from '../data/items';

export function calculateStats(base: Record<Stat, number>, equippedIds: string[]) {
  const totals = { ...base };
  let attack = 0;
  for (const id of equippedIds) {
    const item: Item | undefined = itemById[id];
    if (!item) continue;
    for (const [stat, value] of Object.entries(item.bonuses ?? {})) totals[stat as Stat] += value ?? 0;
    attack += item.attack ?? 0;
  }
  return { stats: totals, attack };
}

export function meetsRequirements(base: Record<Stat, number>, item: Item) {
  return Object.entries(item.requirements ?? {}).every(([stat, required]) => base[stat as Stat] >= (required ?? 0));
}
