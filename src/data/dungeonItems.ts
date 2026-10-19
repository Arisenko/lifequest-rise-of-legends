import type { LootItem } from './loot';

export const dungeonItems:Record<string,LootItem> = {
  'Crypt cleaver':{names:['Katakombová čepeľ','Crypt Cleaver'],slot:'Zbraň',art:'crypt-cleaver',rarity:'Epic',level:5,req:{Strength:5},bonus:{Strength:2},attack:5,price:250},
  'Raven heart':{names:['Srdce Havranmoru','Heart of Ravenmoor'],slot:'Náhrdelník',art:'raven-heart',rarity:'Legendary',level:5,req:{Discipline:5},bonus:{Vitality:3,Discipline:2},price:1000},
  'Shadow wrap':{names:['Závoj tieňov','Shadow Wrap'],slot:'Plášť',art:'shadow-wrap',rarity:'Epic',level:20,req:{Discipline:7},bonus:{Discipline:3,Vitality:2},price:400},
  Moonfang:{names:['Mesačný tesák','Moonfang'],slot:'Zbraň',art:'moonfang',rarity:'Legendary',level:20,req:{Strength:8},bonus:{Strength:4},attack:7,price:1500},
  'Mist gloves':{names:['Rukavice hmly','Mist Gloves'],slot:'Rukavice',art:'mist-gloves',rarity:'Epic',level:40,req:{Intelligence:10},bonus:{Intelligence:4,Discipline:2},price:600},
  'Peak crown':{names:['Koruna Mlžných hôr','Mistpeak Crown'],slot:'Helma',art:'peak-crown',rarity:'Legendary',level:40,req:{Vitality:10},bonus:{Vitality:5,Intelligence:3},price:2200},
  'Root armor':{names:['Zbroj železných koreňov','Ironroot Armor'],slot:'Brnenie',art:'root-armor',rarity:'Epic',level:55,req:{Strength:12,Vitality:10},bonus:{Vitality:5,Discipline:3},price:850},
  'Ironheart ring':{names:['Prsteň Železné srdce','Ironheart Ring'],slot:'Prsteň',art:'ironheart-ring',rarity:'Legendary',level:55,req:{Discipline:12},bonus:{Strength:4,Vitality:5},price:3000},
  'Star staff':{names:['Hviezdna palica','Star Staff'],slot:'Zbraň',art:'star-staff',rarity:'Epic',level:70,req:{Intelligence:15},bonus:{Intelligence:6},attack:8,price:1200},
  'Sky boots':{names:['Čižmy Zlatokrídla','Goldwing Boots'],slot:'Topánky',art:'sky-boots',rarity:'Legendary',level:70,req:{Discipline:15},bonus:{Intelligence:5,Vitality:6},price:4000},
};
export const raidItems:Record<string,LootItem> = {
  'Ashen crown':{names:['Koruna popolavého tyrana','Ashen Tyrant Crown'],slot:'Helma',art:'raid-crown',rarity:'Special',level:90,req:{Vitality:20,Discipline:18},bonus:{Vitality:8,Discipline:6},price:8000,boss:'Ashen Tyrant'},
  'Dragon sigil':{names:['Dračia pečať moci','Dragon Sigil'],slot:'Prsteň',art:'raid-sigil',rarity:'Special',level:90,req:{Intelligence:20},bonus:{Strength:6,Intelligence:8},price:10000,boss:'Ashen Tyrant'},
};
for(const item of Object.values(dungeonItems)) item.description=['Exkluzívna korisť dungeonov a budúcich raidov. Nepadá na bežných výpravách ani sa nepredáva v meste.','Exclusive dungeon and future raid loot. Does not drop in adventures and is not sold in town.'];
for(const item of Object.values(raidItems)) item.description=['Špeciálna korisť iba z finálneho bossa prvého raidu. Raid zatiaľ nie je dostupný.','Special loot only from the first raid final boss. The raid is not available yet.'];
export const dungeonLoot = [
  ['Crypt cleaver','Raven heart'],['Shadow wrap','Moonfang'],['Mist gloves','Peak crown'],['Root armor','Ironheart ring'],['Star staff','Sky boots'],
];
export const raidRewardBosses = [
  {id:'Raid Gravewarden',names:['Strážca dračích hrobiek','Dragon Gravewarden'],dungeonId:'dungeons'},
  {id:'Raid Moonreaper',names:['Mesačný žnec','Moonreaper'],dungeonId:'moon-den'},
  {id:'Raid Frostforger',names:['Mrazivý kováč','Frostforger'],dungeonId:'mistpeak-vault'},
  {id:'Raid Ironwarden',names:['Železný dozorca','Ironwarden'],dungeonId:'ironroot-depths'},
  {id:'Ashen Tyrant',names:['Popolavý tyran','Ashen Tyrant'],dungeonId:'skyspire'},
];
