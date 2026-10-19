import { routeMapItems } from './routeMaps';
import { mounts } from './mounts';
import { classItems } from './classItems';
import type { WeaponType } from './classes';
import { setItems } from './dungeonSets';
import { dungeonItems, raidItems, raidRewardBosses } from './dungeonItems';
import { magicItems } from './magicItems';
import { dungeons } from './dungeons';
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
export type LootItem = { routeTarget?:string; slot: string; weaponType?:WeaponType; hands?:1|2; offhand?:boolean; sources?:('dungeon'|'raid')[]; weight?:number; armorType?:'cloth'|'leather'|'plate'; setId?:string; setArtBase?:string; req?: Partial<Record<Stat, number>>; bonus?: Partial<Record<Stat, number>>; attack?: number; rarity: Rarity; boss?: string; names?: [string, string]; level?: number; heal?: number; art?: string; price?: number; mountId?: string; access?: 'dungeon' | 'raid'; description?: [string, string] };
export const itemData: Record<string, LootItem> = {
  ...routeMapItems,
  'Dungeon key': { names: ['Kľúč do katakomb', 'Catacomb Key'], slot: 'Vstupný predmet', rarity: 'Unique', art: 'dungeon-key', access: 'dungeon', description: ['Padá s nezávislou šancou 5 % z bossov na výpravách. Jeden kľúč otvorí celý dungeon a pri vstupe sa spotrebuje. Nedá sa nasadiť ani predať. Ústup kľúč nevracia.', 'Drops independently at 5% from adventure bosses. One key opens a full dungeon and is consumed on entry. Cannot be equipped or sold. Leaving does not refund the key.'] },
  'Dragon raid seal': { names: ['Pečať dračieho raidu', 'Dragon Raid Seal'], slot: 'Vstupný predmet', rarity: 'Epic', art: 'raid-token', access: 'raid', description: ['Padá s nezávislou šancou 5 % z bossov v dungeonoch. Jeden vstup do raidu bude stáť jednu pečať. Kým online raid nie je dostupný, pečať sa nespotrebúva. Nedá sa nasadiť ani predať.', 'Drops independently at 5% from dungeon bosses. One raid entry will require one seal. Until online raids are available, seals are not consumed. Cannot be equipped or sold.'] },
  'Rusty charm': { slot: 'Charm', bonus: { Discipline: 1 }, rarity: 'Common' },
  'Iron helm': { slot: 'Helma', req: { Strength: 3 }, bonus: { Vitality: 2 }, rarity: 'Common' },
  'Guard boots': { slot: 'Topánky', req: { Vitality: 4 }, bonus: { Vitality: 2 }, rarity: 'Rare' },
  'War drum': { names: ['Vojnový bubon', 'War Drum'], slot: 'Spotrebné predmety', req: { Discipline: 3 }, bonus: { Strength: 1 }, attack: 2, rarity: 'Rare' },
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
Object.assign(itemData,Object.fromEntries(Object.entries({...magicItems,...dungeonItems,...raidItems,...setItems,...classItems}).map(([id,item])=>[id,{...item,bonus:item.bonus?{...item.bonus}:undefined}])));
for(const id of Object.keys(dungeonItems))itemData[id].sources=['dungeon','raid'];
for(const id of Object.keys(raidItems))itemData[id].sources=['raid'];
itemData['Emberlord blade'].sources=['raid'];
itemData['Emberlord blade'].boss='Ashen Tyrant';
const weaponRules:Record<string,WeaponType>={
  'Training sword':'sword','Guard blade':'sword','Emberlord blade':'sword','Crypt cleaver':'sword',
  'Runic staff':'staff','Oak staff':'staff','Star staff':'staff','Apprentice wand':'wand','Catalyst rod':'wand',Moonfang:'dagger',
};
for(const [id,weaponType] of Object.entries(weaponRules)) {itemData[id].weaponType=weaponType;itemData[id].hands=weaponType==='staff'?2:1;}
for(const [id,armorType] of Object.entries({'Iron helm':'plate','Guard boots':'plate','Leather armor':'leather','Linen gloves':'cloth','Scout pants':'leather','Iron shoulders':'plate','Ember cloak':'cloth','Shadow wrap':'leather','Mist gloves':'cloth','Peak crown':'plate','Root armor':'plate','Sky boots':'leather','Ashen crown':'plate'} as const))itemData[id].armorType=armorType;
export const potions = Array.from({ length: 10 }, (_, index) => {
  const id = 'Healing potion ' + (index + 1);
  itemData[id] = { names: ['Liečivý elixír ' + (index + 1), 'Healing Elixir ' + (index + 1)], slot: 'Spotrebné predmety', rarity: 'Common', art: 'herb', level: index === 0 ? 1 : index * 10, heal: [20,35,55,80,110,145,185,230,280,340][index], price: [8,15,26,42,65,95,140,190,255,335][index] };
  return id;
});

for (const mount of mounts) itemData['Mount '+mount.id] = {
  names: mount.names as [string,string], slot:'Mount', rarity:mount.source==='raid'?'Special':mount.source==='dungeon'?'Legendary':'Common',
  level:mount.level, price:mount.price, mountId:mount.id, art:'mount-'+mount.id, boss:mount.boss, bonus:mount.bonus,
  description: mount.source==='raid'
    ? ['Špeciálny mount z pripravovaného prvého raidu Dračia citadela. Zatiaľ nedostupný. Šetrí 70 % vstupnej energie. Všetky bonusy platia iba po nasadení.', 'Special mount reserved for the first planned raid, Dragon Citadel. Not available yet. Saves 70% entry energy. All bonuses apply only while equipped.']
    : mount.source==='dungeon'
    ? ['Legendárny mount z príslušného bossa svojho dungeonu. Legendárna kategória má spoločnú šancu 0,3 %; potom sa vyberie jeden predmet. Nedá sa kúpiť v stajni. Úspora vstupnej energie: '+Math.round(mount.discount*100)+' %.', 'Legendary mount from its designated dungeon boss. The legendary tier has a shared 0.3% chance, then one item is selected. Cannot be purchased at the stable. Entry energy saving: '+Math.round(mount.discount*100)+'%.']
    : ['Mount zo stajne. Úspora vstupnej energie: '+Math.round(mount.discount*100)+' %.', 'Stable mount. Entry energy saving: '+Math.round(mount.discount*100)+'%.'],
};
export const rarityPower:Record<Rarity,number>={Common:1,Rare:1.35,Unique:1.75,Epic:2.5,Legendary:4,Special:6};
for(const item of Object.values(itemData)) {
  if(item.mountId||item.access||item.heal||item.routeTarget)continue;
  const power=rarityPower[item.rarity];
  if(item.bonus)item.bonus=Object.fromEntries(Object.entries(item.bonus).map(([stat,value])=>[stat,Math.ceil(value!*power)]));
  if(item.attack)item.attack=Math.ceil(item.attack*power);
}
const individualArtwork:Record<string,string> = {
  'Rusty charm':'charm','Iron helm':'helmet','Guard boots':'boots','War drum':'drum',
  'Ember cloak':'cloak','Healing herb':'herb',
  'Training sword':'training-sword','Guard blade':'guard-blade','Apprentice wand':'apprentice-wand',
  'Oak staff':'oak-staff','Runic staff':'runic-staff','Dawn relic':'dawn-relic',
  'Emberlord blade':'emberlord-blade','Copper ring':'copper-ring',
};
for (const [id,art] of Object.entries(individualArtwork)) itemData[id].art=art;
for (let index=1;index<=10;index++) itemData['Healing potion '+index].art='healing-potion-'+index;
export type LootSource = { kind: 'quest' | 'normal' | 'elite' | 'boss'; id: string; mode?:'adventure'|'dungeon'|'raid'; dungeonId?:string };
export function mountDrops(source:LootSource) {
  return source.kind==='boss' ? mounts.filter(mount=>mount.source===source.mode&&mount.boss===source.id&&(source.mode!=='dungeon'||dungeons.some(dungeon=>(!source.dungeonId||dungeon.id===source.dungeonId)&&dungeon.mount===mount.id&&dungeon.enemies.some(enemy=>enemy.kind==='boss'&&enemy.name===source.id)))).map(mount=>'Mount '+mount.id) : [];
}

export function lootTable(source:LootSource) {
  const enemy = (source.mode==='dungeon'?dungeons.filter(dungeon=>!source.dungeonId||dungeon.id===source.dungeonId).flatMap(dungeon=>dungeon.enemies):expeditionEnemies).find(entry => entry.name === source.id && entry.kind===source.kind);
  const raidProfile=source.mode==='raid'&&source.kind==='boss'?raidRewardBosses.find(boss=>boss.id===source.id):undefined;
  const raidDrops=raidProfile?dungeons.find(dungeon=>dungeon.id===raidProfile.dungeonId)!.exclusiveDrops:[];
  const pool = source.kind === 'quest' ? Object.keys(itemData).filter(id => !itemData[id].access&&!itemData[id].routeTarget&&!itemData[id].mountId&&!itemData[id].sources) : [...(enemy?.kind === source.kind ? enemy.drops : []),...mountDrops(source),...(raidProfile?['Iron helm','Guard boots','Ember cloak','Runic staff',...raidDrops,...Object.keys(raidItems),'Emberlord blade']:[])];
  const bonus=raidProfile?.25:enemy && 'lootBonus' in enemy ? Number(enemy.lootBonus)||0 : 0;
  return (Object.keys(rarities) as Rarity[]).map(rarity=>{
    const allowed = rarity === 'Epic' ? source.kind === 'elite' || source.kind === 'boss' : rarity === 'Legendary' || rarity === 'Special' ? source.kind === 'boss' && (rarity!=='Special'||source.mode==='raid') : true;
    const candidates = allowed ? [...new Set(pool)].filter(id => itemData[id] && !itemData[id].access && !itemData[id].routeTarget && (!itemData[id].sources||itemData[id].sources!.includes(source.mode as 'dungeon'|'raid')) && itemData[id].rarity === rarity && (!itemData[id].boss || itemData[id].boss === source.id)) : [];
    const chance=candidates.length?rarities[rarity].chance*(rarity==='Legendary'||rarity==='Special'?1:1+bonus)*(source.mode==='raid'&&['Epic','Legendary'].includes(rarity)?2:1):0;
    return {rarity,chance,candidates};
  });
}

export function rollLoot(source: LootSource, random = Math.random): string | null {
  const roll = random();
  let boundary = 0;
  for (const {chance,candidates} of lootTable(source)) {
    boundary += chance;
    if (roll < boundary) return candidates[Math.floor(random() * candidates.length)];
  }
  return null;
}
