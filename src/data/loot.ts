import { mounts } from './mounts';
import { encounters as expeditionEnemies } from './encounters';
export type Rarity = 'Common' | 'Rare' | 'Unique' | 'Epic' | 'Legendary' | 'Special';
export const rarities: Record<Rarity, { names: [string, string]; color: string; chance: number }> = {
  Common: { names: ['Bežné', 'Common'], color: '#ffffff', chance: .20 },
  Rare: { names: ['Vzácne', 'Rare'], color: '#73da82', chance: .10 },
  Unique: { names: ['Unikátne', 'Unique'], color: '#69b5ff', chance: .05 },
  Epic: { names: ['Epické', 'Epic'], color: '#c289ff', chance: .01 },
  Legendary: { names: ['Legendárne', 'Legendary'], color: '#ffac50', chance: .003 },
  Special: { names: ['Špeciálne', 'Special'], color: '#ff6565', chance: .001 },
};
type Stat = 'Strength' | 'Intelligence' | 'Discipline' | 'Vitality';
export type LootItem = { slot: string; req?: Partial<Record<Stat, number>>; bonus?: Partial<Record<Stat, number>>; attack?: number; rarity: Rarity; boss?: string; names?: [string, string]; level?: number; heal?: number; art?: string; price?: number; mountId?: string; access?: 'dungeon' | 'raid'; description?: [string, string] };
export const itemData: Record<string, LootItem> = {
  'Dungeon key': { names: ['Kľúč do katakomb', 'Catacomb Key'], slot: 'Vstupný predmet', rarity: 'Unique', art: 'dungeon-key', access: 'dungeon', description: ['Padá s nezávislou šancou 5 % z bossov na výpravách. Jeden kľúč otvorí celý dungeon a pri vstupe sa spotrebuje. Nedá sa nasadiť ani predať. Ústup kľúč nevracia.', 'Drops independently at 5% from adventure bosses. One key opens a full dungeon and is consumed on entry. Cannot be equipped or sold. Leaving does not refund the key.'] },
  'Dragon raid seal': { names: ['Pečať dračieho raidu', 'Dragon Raid Seal'], slot: 'Vstupný predmet', rarity: 'Epic', art: 'raid-token', access: 'raid', description: ['Padá s nezávislou šancou 5 % z bossov v dungeonoch. Jeden vstup do raidu bude stáť jednu pečať. Kým online raid nie je dostupný, pečať sa nespotrebúva. Nedá sa nasadiť ani predať.', 'Drops independently at 5% from dungeon bosses. One raid entry will require one seal. Until online raids are available, seals are not consumed. Cannot be equipped or sold.'] },
  'Rusty charm': { slot: 'Charm', bonus: { Discipline: 1 }, rarity: 'Common' },
  'Iron helm': { slot: 'Helma', req: { Strength: 3 }, bonus: { Vitality: 2 }, rarity: 'Common' },
  'Guard boots': { slot: 'Topánky', req: { Vitality: 4 }, bonus: { Vitality: 2 }, rarity: 'Rare' },
  'War drum': { slot: 'Spotrebné predmety', req: { Discipline: 3 }, bonus: { Strength: 1 }, attack: 2, rarity: 'Rare' },
  'Ember cloak': { slot: 'Plášť', req: { Discipline: 4 }, bonus: { Vitality: 2, Discipline: 1 }, rarity: 'Unique' },
  'Runic staff': { slot: 'Zbraň', req: { Intelligence: 5 }, bonus: { Intelligence: 3 }, attack: 8, rarity: 'Epic' },
  'Healing herb': { names: ['Liečivá bylina', 'Healing Herb'], slot: 'Spotrebné predmety', rarity: 'Common' },
  'Dawn relic': { names: ['Relikvia úsvitu', 'Dawn Relic'], slot: 'Charm', req: { Discipline: 10 }, bonus: { Discipline: 5, Vitality: 4 }, rarity: 'Legendary' },
  'Emberlord blade': { names: ['Čepeľ pána uhlíkov', 'Emberlord Blade'], slot: 'Zbraň', req: { Strength: 12 }, bonus: { Strength: 6 }, attack: 18, rarity: 'Special', boss: 'Emberlord' },
};

const armorCatalog: [string, [string, string], string, string, number][] = [
  ['Leather armor', ['Kožená zbroj', 'Leather Armor'], 'Brnenie', 'armor', 28],
  ['Linen gloves', ['Ľanové rukavice', 'Linen Gloves'], 'Rukavice', 'gloves', 16],
  ['Scout pants', ['Prieskumnícke nohavice', 'Scout Pants'], 'Nohavice', 'pants', 22],
  ['Iron shoulders', ['Železné náplecníky', 'Iron Shoulders'], 'Shoulders', 'shoulders', 32],
];
for (const [id, names, slot, art, price] of armorCatalog) itemData[id] = { names, slot, art, price, rarity: 'Common', req: { Vitality: 2 }, bonus: { Vitality: 1, Discipline: 1 } };
const weaponCatalog: [string, [string, string], number, boolean][] = [
  ['Training sword', ['Cvičný meč', 'Training Sword'], 20, false],
  ['Guard blade', ['Strážna čepeľ', 'Guard Blade'], 38, false],
  ['Apprentice wand', ['Učňovská palička', 'Apprentice Wand'], 24, true],
  ['Oak staff', ['Dubová palica', 'Oak Staff'], 42, true],
];
for (const [id, names, price, magic] of weaponCatalog) itemData[id] = { names, slot: 'Zbraň', art: 'sword', price, rarity: 'Common', attack: price > 30 ? 4 : 2, req: magic ? { Intelligence: 2 } : { Strength: 2 }, bonus: magic ? { Intelligence: 1 } : { Strength: 1 } };
for (const [id, names, art] of [
  ['Copper ring', ['Medený prsteň', 'Copper Ring'], 'ring-green'],
  ['Amber necklace', ['Jantárový náhrdelník', 'Amber Necklace'], 'necklace'],
  ['Sun ring', ['Slnečný prsteň', 'Sun Ring'], 'ring-sun'],
] as [string, [string, string], string][]) itemData[id] = { names, art, slot: id.includes('ring') ? 'Prsteň' : 'Náhrdelník', rarity: 'Common', bonus: { Discipline: 1 }, price: 18 };
export const potions = Array.from({ length: 10 }, (_, index) => {
  const id = 'Healing potion ' + (index + 1);
  itemData[id] = { names: ['Liečivý elixír ' + (index + 1), 'Healing Elixir ' + (index + 1)], slot: 'Spotrebné predmety', rarity: 'Common', art: 'herb', level: index === 0 ? 1 : index * 10, heal: [20,35,55,80,110,145,185,230,280,340][index], price: [8,15,26,42,65,95,140,190,255,335][index] };
  return id;
});

for (const mount of mounts) itemData['Mount '+mount.id] = { names: mount.names as [string,string], slot:'Mount', rarity:'Common', level:mount.level, price:mount.price, mountId:mount.id };
export type LootSource = { kind: 'quest' | 'normal' | 'elite' | 'boss'; id: string };

export function rollLoot(source: LootSource, random = Math.random): string | null {
  const enemy = expeditionEnemies.find(entry => entry.name === source.id);
  const pool = source.kind === 'quest' ? Object.keys(itemData).filter(id => !itemData[id].access) : enemy?.kind === source.kind ? enemy.drops : [];
  const roll = random();
  let boundary = 0;
  for (const rarity of Object.keys(rarities) as Rarity[]) {
    const allowed = rarity === 'Epic' ? source.kind === 'elite' || source.kind === 'boss' : rarity === 'Legendary' || rarity === 'Special' ? source.kind === 'boss' : true;
    const candidates = pool.filter(id => itemData[id].rarity === rarity && (!itemData[id].boss || itemData[id].boss === source.id));
    if (!allowed || !candidates.length) continue;
    boundary += rarities[rarity].chance;
    if (roll < boundary) return candidates[Math.floor(random() * candidates.length)];
  }
  return null;
}
