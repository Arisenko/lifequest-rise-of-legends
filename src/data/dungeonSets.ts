import type { LootItem } from './loot';

type Stats=Partial<Record<'Strength'|'Intelligence'|'Discipline'|'Vitality',number>>;
const regions=[
  ['dungeons','Havranmor','Ravenmoor','#b793e6',5],
  ['moon-den','Mesačný tieň','Moonshadow','#6eb9de',20],
  ['mistpeak-vault','Mlžné hory','Mistpeak','#a6d7cf',40],
  ['ironroot-depths','Železný koreň','Ironroot','#da8d61',55],
  ['skyspire','Padlá hviezda','Fallen Star','#e1bf61',70],
] as const;
const slots=[
  ['hood','Helma','Kapucňa / prilba','Headpiece'],
  ['armor','Brnenie','Zbroj','Armor'],
  ['shoulders','Shoulders','Náplecníky','Shoulders'],
  ['gloves','Rukavice','Rukavice','Gloves'],
  ['cloak','Plášť','Plášť','Cloak'],
  ['pants','Nohavice','Nohavice','Trousers'],
  ['boots','Topánky','Topánky','Boots'],
] as const;
const families=[
  {id:'cloth' as const,names:['Látkový','Cloth'],primary:'Intelligence' as const,secondary:'Discipline' as const,weight:.5,art:['mage-hood','mage-robe','mage-mantle','mage-gloves','mage-cloak','mage-pants','mage-boots']},
  {id:'leather' as const,names:['Kožený','Leather'],primary:'Discipline' as const,secondary:'Strength' as const,weight:1,art:['leather-hood','leather-vest','leather-shoulders','leather-gloves','leather-cloak','leather-pants','leather-boots']},
  {id:'plate' as const,names:['Plátový','Plate'],primary:'Strength' as const,secondary:'Vitality' as const,weight:2,art:['helmet','armor','shoulders','plate-gloves','cloak','plate-pants','boots']},
];
export const setItems:Record<string,LootItem>={};
export const dungeonSets=regions.flatMap(([dungeonId,sk,en,color,level],regionIndex)=>families.map(family=>{
  const id=dungeonId+'-'+family.id;
  const power=2+regionIndex;
  const bonuses:{pieces:number;stats:Stats}[]=[
    {pieces:2,stats:{[family.primary]:power}},
    {pieces:4,stats:{Vitality:power+1}},
    {pieces:7,stats:{[family.primary]:power*2,[family.secondary]:power+2}},
  ];
  const items=slots.map(([slotKey,slot,slotSk,slotEn],slotIndex)=>{
    const itemId='Set '+id+' '+slotKey;
    const pieceSk=slotKey==='hood'?(family.id==='plate'?'Prilba':'Kapucňa'):slotKey==='armor'&&family.id==='cloth'?'Róba':slotSk;
    const pieceEn=slotKey==='hood'?(family.id==='plate'?'Helmet':'Hood'):slotKey==='armor'&&family.id==='cloth'?'Robe':slotEn;
    setItems[itemId]={
      names:[pieceSk+' · '+family.names[0]+' · '+sk,pieceEn+' · '+family.names[1]+' · '+en],
      slot,rarity:slotIndex<2?'Legendary':'Epic',level,weight:family.weight,
      art:'set-'+id+'-'+slotKey,setId:id,setArtBase:family.art[slotIndex],armorType:family.id,sources:['dungeon','raid'],
      req:{[family.primary]:3+regionIndex*3,[family.secondary]:2+regionIndex*2},bonus:{[family.primary]:power,[family.secondary]:1+regionIndex},
      price:(100+regionIndex*100)*(slotIndex<2?4:2),
      description:['Súčasť setu '+sk+' ('+family.names[0]+'). Setové bonusy sa sčítajú pri 2, 4 a 7 rôznych kusoch rovnakého setu.','Part of the '+family.names[1].toLowerCase()+' set from '+en+'. Set bonuses stack at 2, 4 and 7 distinct pieces of the same set.'],
    };
    return itemId;
  });
  return {id,dungeonId,family:family.id,names:[sk+' · '+family.names[0],en+' · '+family.names[1]] as [string,string],color,sigil:regionIndex,items,bonuses};
}));
export function equippedSetBonuses(equipped:string[]) {
  const unique=new Set(equipped);
  const stats:Stats={};
  const active=dungeonSets.map(set=>({set,count:set.items.filter(id=>unique.has(id)).length})).filter(entry=>entry.count>0);
  for(const {set,count} of active)for(const bonus of set.bonuses.filter(bonus=>count>=bonus.pieces)) {
    for(const [stat,value] of Object.entries(bonus.stats)) stats[stat as keyof Stats]=(stats[stat as keyof Stats]||0)+value!;
  }
  return {stats,active};
}
