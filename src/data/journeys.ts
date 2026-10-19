import { settleJourneyRoute, journeyRouteComplete } from './journeyRoute';
import { routeMapFor, routePathFromSeed } from './routeMaps';
import { applyJourneyHazard } from './journeyHazards';
import type { JourneyHazard, HazardHero } from './journeyHazards';
import { encounterAreas } from './encounters';
import { isAreaUnlocked, defeatedInArea } from './adventureProgress';
import { awardXp } from './progression';

export type Journey = { acceptedSteps?:string[]; hazard?:JourneyHazard|null; hazardsSeen?:string[]; rulesVersion?:2; choices?:number[]; areaId: string; seed: number; step: number; mistakes: number; level: number };
type JourneyHero = HazardHero & { journey?: Journey | null; visitedAreas?: string[]; clearedAreas?: string[]; defeatedEnemies?: Record<string,string[]>; level: number; xp: number; hp: number; dungeonRun?: unknown; pendingTravelEvent?: unknown; battle?: { ended?: string } | null };
export const JOURNEY_STEPS = 5;
export function needsJourney(hero: JourneyHero, areaId: string) {
  return encounterAreas.findIndex(area => area.id === areaId) > 0 && isAreaUnlocked(hero,areaId) && !hero.visitedAreas?.includes(areaId) && !defeatedInArea(hero,areaId).length;
}
export const journeyPath = routePathFromSeed;
export function startJourney<Hero extends JourneyHero>(hero: Hero, areaId: string, seed: number): Hero {
  if (!Number.isFinite(seed) || !needsJourney(hero,areaId) || hero.journey || hero.hp<=0 || hero.dungeonRun || hero.pendingTravelEvent || hero.battle&&!hero.battle.ended) return hero;
  return {...hero,journey:{areaId,seed:routeMapFor(areaId)!.seed,step:0,mistakes:0,level:hero.level,choices:[],rulesVersion:2}};
}
export function advanceJourney<Hero extends JourneyHero>(hero: Hero, row: number, expectedStep = hero.journey?.step): Hero {
  const journey=hero.journey;
  if (!journey || journey.hazard || journey.step!==expectedStep || !needsJourney(hero,journey.areaId) || journey.step>=JOURNEY_STEPS || journey.mistakes>=3 || hero.hp<=0 || hero.pendingTravelEvent || hero.dungeonRun || hero.battle&&!hero.battle.ended || !Number.isInteger(row) || row<0 || row>2) return hero;
  const choices=[...(journey.choices||[]),row];
  return settleJourneyRoute(applyJourneyHazard({...hero,journey:{...journey,choices,step:choices.length}},journey,row));
}
export function retryJourney<Hero extends JourneyHero>(hero: Hero): Hero {
  return hero.journey && !hero.journey.hazard && hero.hp>0 && !hero.battle && hero.journey.mistakes>=3 ? {...hero,journey:{...hero.journey,step:0,mistakes:0,choices:[]}} : hero;
}
export function finishJourney<Hero extends JourneyHero>(hero: Hero): Hero {
  const journey=hero.journey;
  if (!journey || journey.hazard || journey.step!==JOURNEY_STEPS || !journeyRouteComplete(journey) || journey.mistakes>=3 || !needsJourney(hero,journey.areaId) || hero.hp<=0 || hero.pendingTravelEvent || hero.dungeonRun || hero.battle&&!hero.battle.ended) return hero;
  return {...hero,...awardXp(hero.xp,hero.level,journey.level*15),visitedAreas:[...(hero.visitedAreas||[]),journey.areaId],journey:null};
}
