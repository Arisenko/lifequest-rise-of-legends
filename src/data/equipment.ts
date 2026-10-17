import { itemData } from './loot';

export type EquippedItem = { instanceId: string; itemId: string; slot: string };
export type EquipmentOwner = { inventory: string[]; equipped: string[]; equipment?: EquippedItem[]; equipmentSerial?: number; stats: Record<string, number>; level?: number; className?: string; mount?: string|null; battle?: { ended?: string } | null };
const ordinarySlots = ['Helma','Brnenie','Shoulders','Rukavice','Plášť','Nohavice','Topánky','Náhrdelník','Charm','Mount'];
export function itemSlots(id: string, className?: string) {
  const slot = itemData[id]?.slot;
  if (slot === 'Prsteň') return ['Prsteň 1','Prsteň 2','Prsteň 3','Prsteň 4'];
  if (slot === 'Zbraň') return className === 'Strážca' ? ['Zbraň 1','Zbraň 2'] : ['Zbraň 1'];
  return ordinarySlots.includes(slot) ? [slot] : [];
}
export function meetsRequirements(hero: EquipmentOwner, id: string) {
  const item = itemData[id];
  return Boolean(item) && (hero.level || 1) >= (item.level || 1) && Object.entries(item.req || {}).every(([stat, need]) => (hero.stats[stat] || 0) >= need!);
}
export function migrateEquipment<Hero extends EquipmentOwner>(hero: Hero): Hero {
  if (Array.isArray(hero.equipment)) return hero;
  const inventory = [...hero.inventory];
  const equipment: EquippedItem[] = [];
  let serial = hero.equipmentSerial || 0;
  for (const id of new Set(hero.equipped)) {
    const index = inventory.indexOf(id);
    const slot = itemSlots(id, hero.className).find(slot => !equipment.some(entry => entry.slot === slot));
    if (index < 0 || !slot || !meetsRequirements(hero, id)) continue;
    inventory.splice(index, 1);
    equipment.push({ instanceId: 'gear-' + ++serial, itemId: id, slot });
  }
  return { ...hero, inventory, equipment, equipmentSerial: serial, equipped: equipment.map(entry => entry.itemId), mount: equipment.find(entry=>entry.slot==='Mount') ? itemData[equipment.find(entry=>entry.slot==='Mount')!.itemId]?.mountId || null : null };
}
export function equipItem<Hero extends EquipmentOwner>(hero: Hero, index: number, requestedSlot?: string): Hero {
  if (hero.battle && !hero.battle.ended) return hero;
  const id = hero.inventory[index];
  if (!id || !meetsRequirements(hero, id)) return hero;
  const equipment = hero.equipment || [];
  const slots = itemSlots(id, hero.className);
  const slot = requestedSlot || slots.find(slot => !equipment.some(entry => entry.slot === slot)) || slots[0];
  if (!slot || !slots.includes(slot)) return hero;
  const replaced = equipment.find(entry => entry.slot === slot);
  const inventory = hero.inventory.filter((_, position) => position !== index);
  if (replaced) inventory.push(replaced.itemId);
  const serial = (hero.equipmentSerial || 0) + 1;
  const next = [...equipment.filter(entry => entry.slot !== slot), { instanceId: 'gear-' + serial, itemId: id, slot }];
  return { ...hero, inventory, equipment: next, equipmentSerial: serial, equipped: next.map(entry => entry.itemId), mount: next.find(entry=>entry.slot==='Mount') ? itemData[next.find(entry=>entry.slot==='Mount')!.itemId]?.mountId || null : null };
}
export function unequipItem<Hero extends EquipmentOwner>(hero: Hero, instanceId: string): Hero {
  const entry = hero.equipment?.find(entry => entry.instanceId === instanceId);
  if (!entry || hero.inventory.length >= 50 || hero.battle && !hero.battle.ended) return hero;
  const equipment = hero.equipment!.filter(entry => entry.instanceId !== instanceId);
  return { ...hero, inventory: [...hero.inventory, entry.itemId], equipment, equipped: equipment.map(entry => entry.itemId), mount: equipment.find(entry=>entry.slot==='Mount') ? itemData[equipment.find(entry=>entry.slot==='Mount')!.itemId]?.mountId || null : null };
}
