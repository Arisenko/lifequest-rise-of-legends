import { adventures } from './adventures';
import { extraAreas } from './extraAdventures';
import { lateAreas } from './lateAdventures';
import type { LootItem } from './loot';

export const MAP_DROP_CHANCE = .2;
export const routeAreas = [...adventures,...extraAreas,...lateAreas];
export const routeMaps = routeAreas.slice(1).map((area,index) => ({id:'Route map: '+area.id,target:area.id,source:routeAreas[index].id,names:[`Mapa: ${area.names[0]}`,`Map: ${area.names[1]}`] as [string,string],seed:(((index*37+11)%243)+.25)/243}));
export function routePathFromSeed(seed: number) {
  const code=Math.floor(seed*243);
  return Array.from({length:5},(_,column)=>(Math.floor(code/3**column)%3+column)%3);
}
export function routeMapFor(areaId: string) { return routeMaps.find(map=>map.target===areaId); }
export function ownsRouteMap(hero: {inventory:string[];rewardChest?:string[]},areaId:string) {
  const map=routeMapFor(areaId);
  return Boolean(map&&(hero.inventory.includes(map.id)||hero.rewardChest?.includes(map.id)));
}
export function rollRouteMap(areaId:string,hero:{inventory:string[];rewardChest?:string[];visitedAreas?:string[]},roll=Math.random()) {
  const map=routeMaps.find(map=>map.source===areaId);
  return map&&!hero.visitedAreas?.includes(map.target)&&!ownsRouteMap(hero,map.target)&&roll<MAP_DROP_CHANCE?map.id:null;
}
export const routeMapItems:Record<string,LootItem> = Object.fromEntries(routeMaps.map(map=>[map.id,{names:map.names,slot:'Mapa',rarity:'Common',routeTarget:map.target,weight:.1,description:['Obsahuje presné poradie piatich úsekov cesty. Padá s nezávislou šancou 20 % z nepriateľov predošlej výpravy, aj pri opakovanom súboji. Mapa sa nevybavuje ani nespotrebuje.','Contains the exact sequence of five travel stages. Drops independently at 20% from enemies in the preceding adventure, including repeat fights. The map is not equipped or consumed.']} satisfies LootItem]));
