import { encounterAreas } from './encounters';

export type AdventureProgress = { clearedAreas?: string[] };
export function isAreaUnlocked(hero: AdventureProgress, areaId: string) {
  const index = encounterAreas.findIndex(area => area.id === areaId);
  return index === 0 || index > 0 && encounterAreas.slice(0,index).every(area => hero.clearedAreas?.includes(area.id));
}
export function completeArea<Hero extends AdventureProgress>(hero: Hero, areaId: string, enemyName: string): Hero {
  const area = encounterAreas.find(area => area.id === areaId);
  if (!area || !isAreaUnlocked(hero,areaId) || !area.enemies.some(enemy => enemy.name === enemyName && enemy.kind === 'boss') || hero.clearedAreas?.includes(areaId)) return hero;
  return { ...hero, clearedAreas: [...(hero.clearedAreas || []),areaId] };
}
