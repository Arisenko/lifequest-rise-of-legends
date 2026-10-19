import { findDungeon, dungeons } from './dungeons';
import type { TravelEvent } from './travelEvents';
export const DUNGEON_KEY = 'Dungeon key';
export const RAID_TOKEN = 'Dragon raid seal';
export const ACCESS_DROP_CHANCE = .05;
export type DungeonRun = { stage: number; complete: boolean; dungeonId?:string;failed?:boolean;startedAt?:number };
type AccessHero = { pendingTravelEvent?: TravelEvent | null; inventory: string[]; hp: number; restUntil?: number; energyResting?: boolean; battle?: { ended?: string } | null; dungeonRun?: DungeonRun | null;dungeonEntries?:Record<string,number>;raidEntries?:Record<string,number> };
export const INSTANCE_COOLDOWNS={dungeon:24*60*60*1000,raid:7*24*60*60*1000};
export function instanceRemaining(hero:Pick<AccessHero,'dungeonEntries'|'raidEntries'>,kind:'dungeon'|'raid',id:string,now=Date.now()) {
  const entered=(kind==='dungeon'?hero.dungeonEntries:hero.raidEntries)?.[id];
  return entered===undefined?0:Math.max(0,entered+INSTANCE_COOLDOWNS[kind]-now);
}
export function isDungeonEnemyUnlocked(run:DungeonRun|null|undefined,index:number) {
  return Boolean(run&&!run.complete&&!run.failed&&run.stage===index);
}
export function isDungeonEnemyRevealed(run:DungeonRun|null|undefined,index:number) {
  return Boolean(run&&Number.isInteger(index)&&index>=0&&index<=run.stage);
}
export function failDungeon(run:DungeonRun):DungeonRun {
  return run.complete||run.failed?run:{...run,failed:true};
}

export function rollAccessDrop(kind: string, mode: 'adventure' | 'dungeon', random = Math.random) {
  if (kind !== 'boss' || random() >= ACCESS_DROP_CHANCE) return null;
  return mode === 'dungeon' ? RAID_TOKEN : DUNGEON_KEY;
}

export function enterDungeon<Hero extends AccessHero>(hero: Hero & {level?:number}, now = Date.now(), dungeonId='dungeons'): Hero {
  const index = hero.inventory.indexOf(DUNGEON_KEY);
  const dungeon=dungeons.find(entry=>entry.id===dungeonId);
  if(!dungeon || (hero.level||1)<dungeon.level)return hero;
  if (index < 0 || hero.pendingTravelEvent || hero.dungeonRun || instanceRemaining(hero,'dungeon',dungeonId,now)>0 || hero.hp <= 0 || (hero.restUntil || 0) > now || hero.energyResting || hero.battle && !hero.battle.ended) return hero;
  return { ...hero, inventory: hero.inventory.filter((_, position) => position !== index),dungeonEntries:{...hero.dungeonEntries,[dungeonId]:now}, battle: null, dungeonRun: { stage: 0, complete: false,startedAt:now, ...(dungeonId!=='dungeons'?{dungeonId}:{}) } };
}

export function advanceDungeon(run: DungeonRun, defeatedStage: number): DungeonRun {
  if (!isDungeonEnemyUnlocked(run,defeatedStage)) return run;
  const stage = run.stage + 1;
  return { ...run, stage, complete: stage >= findDungeon(run.dungeonId).enemies.length };
}

export function leaveDungeon<Hero extends AccessHero>(hero: Hero): Hero {
  if (hero.battle && !hero.battle.ended) return hero;
  return { ...hero, dungeonRun: null, battle: null, ...(hero.pendingTravelEvent?.mode === 'dungeon' ? {pendingTravelEvent:null} : {}) };
}
