import { mounts } from './mounts';
import { migrateEquipment, meetsRequirements, itemSlots } from './equipment';
import type { EquippedItem } from './equipment';
import { MAX_LEVEL } from './progression';
import { itemData } from './loot';

export const INVENTORY_LIMIT = 50;
export const ENERGY_RULES = { normalInterval: 180000, restingInterval: 30000, training: { daily: 2, weekly: 3, monthly: 4 }, combat: { normal: 5, elite: 8, boss: 12 } };
export type PlayerStats = Record<'Strength' | 'Intelligence' | 'Discipline' | 'Vitality', number>;
export type PlayerState = { hp: number; stats: PlayerStats; inventory: string[]; equipped: string[]; equipment?: EquippedItem[]; equipmentSerial?: number; mount?: string|null; ownedMounts?:string[]; mountEquipmentMigrated?:boolean; className?: string; energy?: number; energyUpdatedAt?: number; energyResting?: boolean; rewardChest?: string[] };
const weights: Record<string, number> = { 'Rusty charm': .2, 'Iron helm': 3, 'Guard boots': 2, 'War drum': 2.5, 'Ember cloak': 1.5, 'Runic staff': 3, 'Dawn relic': .5, 'Emberlord blade': 5, 'Healing herb': .1 };
export function itemWeight(id: string) { return itemData[id]?.access ? .1 : id.startsWith('Mount ') ? 0 : id.startsWith('Healing potion ') ? .3 : weights[id] ?? 1; }
export function inventoryWeight(inventory: string[]) { return Math.round(inventory.reduce((sum, id) => sum + itemWeight(id), 0) * 100) / 100; }

export function derivedStats(hero: Pick<PlayerState, 'stats' | 'equipped'>) {
  const stats = { ...hero.stats };
  let weaponAttack = 0;
  for (const id of hero.equipped) {
    const item = itemData[id];
    weaponAttack += item?.attack || 0;
    for (const key of Object.keys(stats) as (keyof PlayerStats)[]) stats[key] += item?.bonus?.[key] || 0;
  }
  return { stats, physical: 5 + stats.Strength * 2 + weaponAttack, magical: 5 + stats.Intelligence * 2 + weaponAttack, capacity: 15 + hero.stats.Strength * 2, armor: Math.min(20, Math.floor(stats.Discipline / 2)), resistance: Math.min(.5, stats.Discipline * .01), maxHp: 30 + stats.Vitality * 3, maxStamina: 20 + stats.Vitality * 2, maxEnergy: 60 + stats.Vitality * 5, buffPower: 2 + Math.floor(stats.Intelligence / 3) };
}

export function refreshEnergy<Hero extends PlayerState>(hero: Hero, now = Date.now()): Hero {
  const max = derivedStats(hero).maxEnergy;
  const interval = hero.energyResting ? ENERGY_RULES.restingInterval : ENERGY_RULES.normalInterval;
  const last = Math.min(now, hero.energyUpdatedAt ?? now);
  const ticks = Math.floor(Math.max(0, now - last) / interval);
  const energy = Math.min(max, Math.max(0, hero.energy ?? max) + ticks);
  const energyUpdatedAt = energy >= max ? now : last + ticks * interval;
  if (energy === hero.energy && energyUpdatedAt === hero.energyUpdatedAt) return hero;
  return { ...hero, energy, energyUpdatedAt };
}

export function spendEnergy<Hero extends PlayerState>(hero: Hero, cost: number, now = Date.now()): Hero | null {
  const current = refreshEnergy(hero, now);
  if (current.energyResting || (current.energy ?? 0) < cost) return null;
  return { ...current, energy: current.energy! - cost };
}

export function normalizePlayer<Hero extends PlayerState>(hero: Hero, now = Date.now()): Hero {
  if (!hero.mountEquipmentMigrated) {
    hero = migrateEquipment(hero);
    const equipment = [...(hero.equipment || [])];
    const inventory = [...hero.inventory];
    let serial = hero.equipmentSerial || 0;
    for (const mount of mounts.filter(mount=>hero.ownedMounts?.includes(mount.id))) {
      const itemId = 'Mount '+mount.id;
      if (inventory.includes(itemId)||equipment.some(entry=>entry.itemId===itemId)) continue;
      if (hero.mount===mount.id) equipment.push({instanceId:'gear-'+ ++serial,itemId,slot:'Mount'});
      else inventory.push(itemId);
    }
    hero = {...hero,inventory,equipment,equipped:equipment.map(entry=>entry.itemId),equipmentSerial:serial,mountEquipmentMigrated:true};
  }
  hero = migrateEquipment(hero);
  const equipment: EquippedItem[] = [];
  const returned: string[] = [];
  for (const entry of hero.equipment || []) {
    if (!entry || !itemData[entry.itemId]) continue;
    if (!meetsRequirements(hero, entry.itemId) || !itemSlots(entry.itemId,hero.className).includes(entry.slot) || equipment.some(other=>other.slot===entry.slot || other.instanceId===entry.instanceId)) { returned.push(entry.itemId); continue; }
    equipment.push(entry);
  }
  const equipped = equipment.map(entry=>entry.itemId);
  const capacity = derivedStats({ ...hero, equipped }).capacity;
  const inventory: string[] = [], overflow: string[] = [];
  let weight = inventoryWeight(equipped);
  for (const id of [...hero.inventory,...returned]) {
    const added = itemWeight(id);
    if (inventory.length < INVENTORY_LIMIT && weight + added <= capacity + .00001) { inventory.push(id); weight += added; }
    else overflow.push(id);
  }
  const result = { ...hero, ...('level' in hero ? {level:Math.min(MAX_LEVEL,Math.max(1,Number(hero.level)||1)),...(Number(hero.level)>=MAX_LEVEL?{xp:0}:{})}:{}), inventory, equipment, equipped, mount: equipment.find(entry=>entry.slot==='Mount') ? itemData[equipment.find(entry=>entry.slot==='Mount')!.itemId]?.mountId || null : null, rewardChest: [...(hero.rewardChest || []), ...overflow], hp: Math.max(0, Math.min(hero.hp, derivedStats({ ...hero, equipped }).maxHp)) };
  return refreshEnergy(result, now);
}

export function carriedWeight(hero: Pick<PlayerState,'inventory'|'equipped'>) { return inventoryWeight([...hero.inventory,...hero.equipped]); }

export function canReceive(hero: PlayerState, id: string) { return hero.inventory.length < INVENTORY_LIMIT && carriedWeight(hero) + itemWeight(id) <= derivedStats(hero).capacity + .00001; }

export function claimReward<Hero extends PlayerState>(hero: Hero, index: number): Hero {
  const id = hero.rewardChest?.[index];
  if (!id || !canReceive(hero, id)) return hero;
  return { ...hero, inventory: [...hero.inventory, id], rewardChest: hero.rewardChest!.filter((_, position) => position !== index) };
}
