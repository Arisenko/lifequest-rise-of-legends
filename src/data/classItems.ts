import type { LootItem } from './loot';
export const classItems:Record<string,LootItem>={
  'Alchemy grimoire':{names:['Alchymistický grimoár','Alchemy Grimoire'],slot:'Zbraň',weaponType:'book',hands:1,art:'alchemist-book',rarity:'Rare',level:1,req:{Intelligence:4,Discipline:3},bonus:{Intelligence:2},attack:3,price:65,weight:1},
  'Catalyst retort':{names:['Katalytická retorta','Catalyst Retort'],slot:'Zbraň',weaponType:'focus',offhand:true,hands:1,art:'alchemist-offhand',rarity:'Rare',level:1,req:{Intelligence:4,Discipline:3},bonus:{Discipline:2,Intelligence:1},price:48,weight:.5},
  'Hunter bow':{names:['Lovecký luk','Hunter Bow'],slot:'Zbraň',weaponType:'bow',hands:2,art:'hunter-bow',rarity:'Common',level:1,req:{Discipline:4,Strength:3},bonus:{Discipline:1},attack:4,price:28,weight:1.5},
  'Shadow dagger':{names:['Tieňová dýka','Shadow Dagger'],slot:'Zbraň',weaponType:'dagger',hands:1,art:'assassin-dagger',rarity:'Common',level:1,req:{Discipline:4,Strength:3},bonus:{Strength:1},attack:2,price:18,weight:.5},
  'Sun shield':{names:['Slnečný štít','Sun Shield'],slot:'Zbraň',weaponType:'shield',offhand:true,hands:1,art:'paladin-shield',rarity:'Rare',level:1,req:{Strength:4,Vitality:3},bonus:{Discipline:2,Vitality:1},price:45,weight:2.5},
};
