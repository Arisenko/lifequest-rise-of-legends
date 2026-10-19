import { equippedPowers } from './itemPowers';
import { classId, classFamilies, resolveClass, startingStats } from './classes';
import { equippedSetBonuses } from './dungeonSets';
import { mounts } from './mounts';
import { migrateEquipment, meetsRequirements, itemSlots } from './equipment';
import type { EquippedItem } from './equipment';
import { MAX_LEVEL } from './progression';
import { itemData } from './loot';

export const INVENTORY_LIMIT = 50;
export const LODGING_HP_INTERVAL = 30000;
export const ENERGY_RULES = { normalInterval: 180000, restingInterval: 30000, training: { daily: 2, weekly: 3, monthly: 4 }, combat: { normal: 5, elite: 8, boss: 12 } };
export type PlayerStats = Record<'Strength' | 'Intelligence' | 'Discipline' | 'Vitality', number>;
export type PlayerState = { hp: number; stats: PlayerStats; preparedConsumables?:string[]; inventory: string[]; equipped: string[]; equipment?: EquippedItem[]; equipmentSerial?: number; mount?: string|null; ownedMounts?:string[]; mountEquipmentMigrated?:boolean; className?: string; classRulesVersion?:number;classChoicePending?:boolean; energy?: number; energyUpdatedAt?: number; energyResting?: boolean; lodgingUpdatedAt?:number; rewardChest?: string[] };
const weights: Record<string, number> = { 'Rusty charm': .2, 'Iron helm': 3, 'Guard boots': 2, 'War drum': 2.5, 'Ember cloak': 1.5, 'Runic staff': 3, 'Dawn relic': .5, 'Emberlord blade': 5, 'Healing herb': .1 };
export function itemWeight(id: string) { return itemData[id]?.weight ?? ( itemData[id]?.access ? .1 : id.startsWith('Mount ') ? 0 : id.startsWith('Healing potion ') ? .3 : weights[id] ?? 1); }
export function inventoryWeight(inventory: string[]) { return Math.round(inventory.reduce((sum, id) => sum + itemWeight(id), 0) * 100) / 100; }

export function derivedStats(hero: Pick<PlayerState, 'stats' | 'equipped' | 'className'>) {
  const stats = { ...hero.stats };
  const itemPowers=equippedPowers(hero.equipped.map(id=>itemData[id]));
  const damageMultiplier=1+(itemPowers.strongest?.damagePercent||0)/100;
  const profile=hero.className?resolveClass(hero.className):null;
  const family=profile?classFamilies[profile.family]:null;
  const affinity=family?hero.equipped.filter(id=>itemData[id]?.armorType===family.armor).length>=2:false;
  const perks=mounts.find(mount=>hero.equipped.some(id=>itemData[id]?.mountId===mount.id))?.perks;
  let weaponAttack = 0;
  for (const id of hero.equipped) {
    const item = itemData[id];
    weaponAttack += item?.attack || 0;
    for (const key of Object.keys(stats) as (keyof PlayerStats)[]) stats[key] += item?.bonus?.[key] || 0;
  }
  for(const [stat,bonus] of Object.entries(equippedSetBonuses(hero.equipped).stats)) stats[stat as keyof PlayerStats]+=bonus!;
  const id=profile?classId(hero.className):null;
  const physical=Math.ceil((5+(profile?.family==='scout'?stats.Strength+stats.Discipline:stats.Strength*2)+weaponAttack)*(affinity&&(id==='Bojovník'||id==='Lovec')?1.1:1));
  const magical=Math.ceil((5+stats.Intelligence*2+weaponAttack)*(affinity&&id==='Mág'?1.1:1));
  return { stats, itemPowers, physical:Math.ceil(physical*damageMultiplier), magical:Math.ceil(magical*damageMultiplier), capacity: 15 + hero.stats.Strength * 2+(perks?.capacity||0), armor: itemPowers.armor+Math.min(20, Math.floor(stats.Discipline / 2))+(perks?.armor||0)+(affinity&&id==='Paladin'?2:0)+(hero.equipped.some(id=>itemData[id]?.weaponType==='shield')?3:0), resistance: Math.min(.5, stats.Discipline * .01), maxHp: 30 + stats.Vitality * 3, maxStamina: 20 + stats.Vitality * 2+(perks?.stamina||0), maxEnergy: 60 + stats.Vitality * 5+(perks?.energy||0), buffPower: 2 + Math.floor(stats.Intelligence / 3), energyRegeneration:perks?.regeneration||1, burnImmune:perks?.burnImmune||false, affinity, potionHealing:id==='Alchymista'?(affinity?1.5:1.25):1, healingPower:id==='Paladin'&&affinity?1.25:1, poisonPower:id==='Assassín'&&affinity?1.5:1 };
}

export function refreshEnergy<Hero extends PlayerState>(hero: Hero, now = Date.now()): Hero {
  const values=derivedStats(hero),max=values.maxEnergy;
  const interval = (hero.energyResting ? ENERGY_RULES.restingInterval : ENERGY_RULES.normalInterval)/values.energyRegeneration;
  const last = Math.min(now, hero.energyUpdatedAt ?? now);
  const ticks = Math.floor(Math.max(0, now - last) / interval);
  const energy = Math.min(max, Math.max(0, hero.energy ?? max) + ticks);
  const energyUpdatedAt = energy >= max ? now : last + ticks * interval;
  const paid=hero.energyResting&&hero.lodgingUpdatedAt!==undefined;
  const hpLast=Math.min(now,hero.lodgingUpdatedAt??now);
  const hpTicks=paid?Math.floor(Math.max(0,now-hpLast)/LODGING_HP_INTERVAL):0;
  const maxHp=values.maxHp;
  const hp=paid?Math.min(maxHp,hero.hp+hpTicks*Math.max(1,Math.ceil(maxHp*.05))):hero.hp;
  const lodgingUpdatedAt=paid?(hp>=maxHp?now:hpLast+hpTicks*LODGING_HP_INTERVAL):undefined;
  if (energy === hero.energy && energyUpdatedAt === hero.energyUpdatedAt&&hp===hero.hp&&lodgingUpdatedAt===hero.lodgingUpdatedAt) return hero;
  return { ...hero, energy, energyUpdatedAt,hp,...(paid||hero.lodgingUpdatedAt!==undefined?{lodgingUpdatedAt}:{}) };
}

export function spendEnergy<Hero extends PlayerState>(hero: Hero, cost: number, now = Date.now()): Hero | null {
  const current = refreshEnergy(hero, now);
  if (current.energyResting || (current.energy ?? 0) < cost) return null;
  return { ...current, energy: current.energy! - cost };
}

export function refreshIdleRecovery<Hero extends PlayerState>(hero:Hero,now=Date.now()):Hero{
  const next=refreshEnergy(hero,now);
  return next.energy===hero.energy&&next.hp===hero.hp&&!(hero.lodgingUpdatedAt!==undefined&&!hero.energyResting)?hero:next;
}

export function normalizePlayer<Hero extends PlayerState>(hero: Hero, now = Date.now()): Hero {
  if(hero.className&&hero.classRulesVersion!==2) {
    const target=classId(hero.className),starter=startingStats(target);
    hero={...hero,className:target,classRulesVersion:2,...(hero.className==='Novice'?{classChoicePending:true}:{}),stats:Object.fromEntries(Object.entries(hero.stats).map(([stat,value])=>[stat,value+starter[stat as keyof PlayerStats]-2])) as PlayerStats};
  }
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
  if(equipment.some(entry=>entry.slot==='Zbraň 1'&&itemData[entry.itemId]?.hands===2)) {
    const offhand=equipment.findIndex(entry=>entry.slot==='Zbraň 2');
    if(offhand>=0)returned.push(equipment.splice(offhand,1)[0].itemId);
  }
  const equipped = equipment.map(entry=>entry.itemId);
  const capacity = derivedStats({ ...hero, equipped }).capacity;
  const inventory: string[] = [], overflow: string[] = [];
  let weight = inventoryWeight([...equipped,...(hero.preparedConsumables||[])]);
  for (const id of [...hero.inventory,...returned]) {
    const added = itemWeight(id);
    if (inventory.length < INVENTORY_LIMIT && weight + added <= capacity + .00001) { inventory.push(id); weight += added; }
    else overflow.push(id);
  }
  const result = { ...hero, ...('level' in hero ? {level:Math.min(MAX_LEVEL,Math.max(1,Number(hero.level)||1)),...(Number(hero.level)>=MAX_LEVEL?{xp:0}:{})}:{}), inventory, equipment, equipped, mount: equipment.find(entry=>entry.slot==='Mount') ? itemData[equipment.find(entry=>entry.slot==='Mount')!.itemId]?.mountId || null : null, rewardChest: [...(hero.rewardChest || []), ...overflow], hp: Math.max(0, Math.min(hero.hp, derivedStats({ ...hero, equipped }).maxHp)) };
  return refreshEnergy(result, now);
}

export function carriedWeight(hero: Pick<PlayerState,'inventory'|'equipped'|'preparedConsumables'>) { return inventoryWeight([...hero.inventory,...hero.equipped,...(hero.preparedConsumables||[])]); }

export function canReceive(hero: PlayerState, id: string) { return hero.inventory.length < INVENTORY_LIMIT && carriedWeight(hero) + itemWeight(id) <= derivedStats(hero).capacity + .00001; }

export function claimReward<Hero extends PlayerState>(hero: Hero, index: number): Hero {
  const id = hero.rewardChest?.[index];
  if (!id || !canReceive(hero, id)) return hero;
  return { ...hero, inventory: [...hero.inventory, id], rewardChest: hero.rewardChest!.filter((_, position) => position !== index) };
}
