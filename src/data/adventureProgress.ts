import { encounterAreas } from './encounters';
import type { Battle } from './battle';

export function returnToAreaSelection(areaId:string,battle:Battle|null){
  const area=encounterAreas.find(area=>area.id===areaId);
  return Boolean(area&&battle?.ended==='win'&&battle.enemy.name===area.enemies[area.enemies.length-1]?.name);
}

export type AdventureProgress = { clearedAreas?: string[];defeatedEnemies?:Record<string,string[]> };
export function isAreaUnlocked(hero: AdventureProgress, areaId: string) {
  const index = encounterAreas.findIndex(area => area.id === areaId);
  return index === 0 || index > 0 && encounterAreas.slice(0,index).every(area => hero.clearedAreas?.includes(area.id));
}
export function defeatedInArea(hero:AdventureProgress,areaId:string) {
  const area=encounterAreas.find(entry=>entry.id===areaId);
  return hero.defeatedEnemies?.[areaId]||(hero.clearedAreas?.includes(areaId)?area?.enemies.map(enemy=>enemy.name):[])||[];
}
export function isEnemyUnlocked(hero:AdventureProgress,areaId:string,enemyName:string) {
  const area=encounterAreas.find(entry=>entry.id===areaId);
  const index=area?.enemies.findIndex(enemy=>enemy.name===enemyName)??-1;
  return Boolean(area&&index>=0&&isAreaUnlocked(hero,areaId)&&area.enemies.slice(0,index).every(enemy=>defeatedInArea(hero,areaId).includes(enemy.name)));
}
export function completeArea<Hero extends AdventureProgress>(hero: Hero, areaId: string, enemyName: string): Hero {
  const area = encounterAreas.find(area => area.id === areaId);
  if(!area||!isEnemyUnlocked(hero,areaId,enemyName))return hero;
  const defeated=defeatedInArea(hero,areaId);
  if(defeated.includes(enemyName))return hero;
  const cleared=area.enemies.find(enemy=>enemy.name===enemyName)?.kind==='boss';
  return {...hero,defeatedEnemies:{...hero.defeatedEnemies,[areaId]:[...defeated,enemyName]},...(cleared?{clearedAreas:[...(hero.clearedAreas||[]).filter(id=>id!==areaId),areaId]}:{})};
}
