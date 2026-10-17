import { equipItem } from './equipment';
import { itemData, potions } from './loot';
import { canReceive } from './playerSystems';
import type { PlayerState } from './playerSystems';
import { mounts } from './mounts';

export const SHOP_INTERVAL = 6 * 60 * 60 * 1000;
export const GUILD_FEE = 100000;
export type Merchant = 'nira' | 'armorer' | 'weaponsmith' | 'vela';
export type GuildRole = 'master' | 'trustee' | 'moderator' | 'member';
export type GuildMember = { name: string; role: GuildRole };
export type Guild = { name: string; founder: string; members: GuildMember[] };
export type CityPlayer = PlayerState & { name: string; level: number; gold: number; battle?: { ended?: string } | null; purchases?: Record<string, boolean>; ownedMounts?: string[]; mount?: string | null; guild?: Guild | null };
export function itemPrice(id: string) { return itemData[id]?.price || ({ 'Rusty charm': 12, 'Iron helm': 32, 'Runic staff': 120, 'Guard boots': 48, 'War drum': 60, 'Ember cloak': 130, 'Healing herb': 5, 'Dawn relic': 1500, 'Emberlord blade': 3000 } as Record<string, number>)[id] || 10; }
export function salePrice(id: string) { return Math.max(1, Math.floor(itemPrice(id) / 3)); }
export function shopPeriod(now = Date.now()) { return Math.floor(now / SHOP_INTERVAL); }
export function stock(merchant: Merchant, level: number, now = Date.now()) {
  const pools: Record<Merchant, string[]> = { nira: ['Rusty charm','Copper ring','Amber necklace','Sun ring','War drum','Healing herb'], armorer: ['Iron helm','Leather armor','Linen gloves','Scout pants','Iron shoulders','Guard boots','Ember cloak'], weaponsmith: ['Training sword','Guard blade','Apprentice wand','Oak staff','Runic staff'], vela: potions };
  const pool = pools[merchant].filter(id => (itemData[id]?.level || 1) <= level);
  const rotation = shopPeriod(now) % pool.length;
  const offers = Array.from({length: Math.min(3, pool.length)}, (_, index) => pool[(rotation + index) % pool.length]);
  return merchant === 'vela' ? [...new Set([potions[0], ...offers])] : offers;
}
export function purchaseKey(merchant: Merchant, id: string, now = Date.now()) { return `${shopPeriod(now)}:${merchant}:${id}`; }
export function purchase<Hero extends CityPlayer>(hero: Hero, merchant: Merchant, id: string, now = Date.now()): Hero {
  const key = purchaseKey(merchant, id, now), price = itemPrice(id);
  if (hero.battle && !hero.battle.ended || !stock(merchant, hero.level, now).includes(id) || hero.purchases?.[key] || hero.gold < price || !canReceive(hero, id)) return hero;
  const purchases = Object.fromEntries(Object.entries(hero.purchases || {}).filter(([key]) => Number(key.split(':')[0]) >= shopPeriod(now) - 1));
  return { ...hero, gold: hero.gold - price, inventory: [...hero.inventory, id], purchases: { ...purchases, [key]: true } };
}
export function sellToNira<Hero extends CityPlayer>(hero: Hero, index: number): Hero {
  const id = hero.inventory[index];
  if (!id || itemData[id]?.access || hero.battle && !hero.battle.ended) return hero;
  return { ...hero, gold: hero.gold + salePrice(id), inventory: hero.inventory.filter((_, position) => position !== index) };
}
export function ownsMount(hero: CityPlayer, id: string) {
  const itemId = 'Mount '+id;
  return hero.inventory.includes(itemId) || hero.equipment?.some(entry=>entry.itemId===itemId) || hero.rewardChest?.includes(itemId) || !hero.mountEquipmentMigrated && hero.ownedMounts?.includes(id) || false;
}
export function buyMount<Hero extends CityPlayer>(hero: Hero, id: string): Hero {
  const mount = mounts.find(entry => entry.id === id);
  if (!mount || hero.level < mount.level || hero.gold < mount.price || ownsMount(hero,id) || !canReceive(hero,'Mount '+id) || hero.battle && !hero.battle.ended) return hero;
  return equipItem({ ...hero, gold: hero.gold - mount.price, inventory:[...hero.inventory,'Mount '+id], ownedMounts: [...new Set([...(hero.ownedMounts || []), id])] },hero.inventory.length,'Mount');
}
export function createGuild<Hero extends CityPlayer>(hero: Hero, name: string): Hero {
  name = name.trim();
  if (name.length < 3 || name.length > 30 || hero.guild || hero.gold < GUILD_FEE || hero.battle && !hero.battle.ended) return hero;
  return { ...hero, gold: hero.gold - GUILD_FEE, guild: { name, founder: hero.name, members: [{name: hero.name, role: 'master'}] } };
}
export function setGuildRole(guild: Guild, actor: string, target: string, role: Exclude<GuildRole, 'master'>): Guild {
  if (actor !== guild.founder || target === guild.founder || !guild.members.some(member => member.name === target)) return guild;
  if ((role === 'trustee' || role === 'moderator') && guild.members.filter(member => member.name !== target && member.role === role).length >= 3) return guild;
  return { ...guild, members: guild.members.map(member => member.name === target ? {...member, role} : member) };
}

export function removeGuildMember(guild: Guild, actor: string, target: string): Guild {
  const actorRole = guild.members.find(member => member.name === actor)?.role;
  const targetRole = guild.members.find(member => member.name === target)?.role;
  if (!actorRole || !targetRole || target === guild.founder || actor === target) return guild;
  if (actorRole !== 'master' && (!['trustee','moderator'].includes(actorRole) || targetRole !== 'member')) return guild;
  return {...guild,members:guild.members.filter(member=>member.name!==target)};
}

export function canModerateGuild(guild: Guild | null | undefined, actor: string) { return Boolean(guild?.members.some(member=>member.name===actor && ['master','moderator'].includes(member.role))); }
