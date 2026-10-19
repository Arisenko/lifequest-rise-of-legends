import type { Hero } from '../types/hero';
import { startingStats } from './classes';
import { normalizePlayer } from './playerSystems';
import { migrateQuestProgress } from './questSchedule';
import { routeMapFor } from './routeMaps';

export function freshHero():Hero {
  return {creationComplete:false,name:'',className:'Bojovník',classRulesVersion:2,level:1,xp:0,gold:25,hp:45,stats:startingStats('Bojovník'),inventory:[],equipped:[],completed:[],effects:[],face:'1',hair:'1',beard:'1',hairColor:'hnedá'};
}
export function hydrateHero(saved:Hero):Hero {
  if(saved.journey&&saved.journey.rulesVersion!==2){const map=routeMapFor(saved.journey.areaId);saved={...saved,journey:map?{...saved.journey,seed:map.seed,step:0,mistakes:0,choices:[],rulesVersion:2}:null};}
  const fresh=freshHero();
  const entered=saved.dungeonRun?.startedAt??Date.now();
  const dungeonId=saved.dungeonRun?.dungeonId||'dungeons';
  return normalizePlayer({...fresh,...saved,...(saved.dungeonRun?{dungeonRun:{...saved.dungeonRun,startedAt:entered,...(['loss','fled'].includes(saved.battle?.ended||'')?{failed:true}:{})},dungeonEntries:{...saved.dungeonEntries,[dungeonId]:saved.dungeonEntries?.[dungeonId]??entered}}:{}),classRulesVersion:saved.classRulesVersion,creationComplete:saved.creationComplete??Boolean(saved.name),stats:{...(saved.classRulesVersion===2?fresh.stats:{Strength:2,Intelligence:2,Discipline:2,Vitality:2}),...saved.stats},questProgress:migrateQuestProgress(saved.questProgress,saved.completed||[])});
}
