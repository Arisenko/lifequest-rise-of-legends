import { encounters } from './encounters';
import { balanceEncounterRewards } from './encounterRewards';
import { dungeonSets } from './dungeonSets';
import { dungeonLoot } from './dungeonItems';

const definitions = [
  {id:'dungeons',names:['Katakomby Havranmoru','Ravenmoor Catacombs'],level:5,mount:'boar',scene:'dungeon-ravenmoor',foes:['Bone sentry','Elite sentinel','Ravenmoor lord'],story:['Zabudnutá posádka stráži srdce hrobky a Železnokla.','A forgotten garrison guards the tomb heart and Iron-Tusk.']},
  {id:'moon-den',names:['Brloh mesačných tieňov','Moonshadow Den'],level:20,mount:'wolf',scene:'dungeon-moonshadow',foes:['Shadow stalker','Cloak Wraith','Ancient shade'],story:['Prastarý tieň spútal vlka striebornou kliatbou.','An ancient shade has bound the wolf with a silver curse.']},
  {id:'mistpeak-vault',names:['Hrobka Mlžných hôr','Mistpeak Vault'],level:40,mount:'ram',scene:'dungeon-mistpeak',foes:['Frost wolf','Stone colossus','Drowned king'],story:['Pod horským ľadom drieme kráľ a stráži barana z vrcholov.','A king sleeps beneath mountain ice, guarding the mountain ram.']},
  {id:'ironroot-depths',names:['Hlbiny železných koreňov','Ironroot Depths'],level:55,mount:'bear',scene:'dungeon-ironroot',foes:['Drowned wanderer','Bog witch','Emberlord'],story:['Zlom ohnivú kliatbu vyhne a objav Železnú labku.','Break the forge curse and discover Ironpaw.']},
  {id:'skyspire',names:['Veža padlých hviezd','Fallen Star Spire'],level:70,mount:'gryphon',scene:'dungeon-skyspire',foes:['Drowned Acolyte','Astral Inquisitor','Astral Oracle'],story:['Na vrchole hvezdárne väzní veštec gryfa Zlatokrídlo.','Atop the observatory the oracle imprisons Goldwing.']},
];
export const dungeons=definitions.map((definition,index)=>{
  const exclusiveDrops=[...dungeonLoot[index],...dungeonSets.filter(set=>set.dungeonId===definition.id).flatMap(set=>set.items)];
  const epicDrops=exclusiveDrops.filter(id=>!id.startsWith('Set ')||!id.endsWith(' hood')&&!id.endsWith(' armor')).filter(id=>id!==dungeonLoot[index][1]);
  const enemies=definition.foes.map((name,stage)=>{
    const original=encounters.find(enemy=>enemy.name===name)!;
    const kind=stage===2?'boss' as const:stage===1?'elite' as const:'normal' as const;
    return {...original,kind,hp:Math.round([60,110,240][stage]*(1+index*1.6)),damage:[6,9,14][stage]+index*6,
      reward:[80,160,600][stage]*(index+1),gold:[35,70,250][stage]*(index+1),
      drops:[...original.drops.filter(id=>!['Dawn relic','Emberlord blade'].includes(id)),...(stage===0?[]:stage===1?epicDrops:exclusiveDrops)]};
  });
  return {...definition,names:definition.names as [string,string],description:definition.story as [string,string],icon:'🗝️',color:'#88649b',exclusiveDrops,enemies:balanceEncounterRewards(enemies)};
});
export const dungeonArea=dungeons[0];
export function findDungeon(id?:string) { return dungeons.find(dungeon=>dungeon.id===id)||dungeonArea; }
