import { itemById } from '../data/items';
import type { Item } from '../types/game';

export function rollDrop(dropIds: string[], random = Math.random): Item | null {
  if (!dropIds.length || random() > 0.65) return null;
  const id = dropIds[Math.floor(random() * dropIds.length)];
  return itemById[id] ?? null;
}

export function addUniqueItem(inventory: string[], item: Item) {
  return inventory.includes(item.id) ? inventory : [...inventory, item.id];
}
