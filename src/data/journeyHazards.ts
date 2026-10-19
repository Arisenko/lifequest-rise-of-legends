import { journeyLandmarkAt } from './journeyLandmarks';
import { battleTurn, startBattle } from './battle';
import type { BattleAction } from './battle';
import { derivedStats } from './playerSystems';
import { awardXp } from './progression';
import { routePathFromSeed } from './routeMaps';
import type { Journey } from './journeys';
import type { Hero } from '../types/hero';
import type { Encounter } from './encounters';
import { settleJourneyRoute } from './journeyRoute';

export type JourneyHazard = { id:string; fatal?:boolean; kind:'death'|'bandits'|'rockfall'|'poison'|'ravine'|'bridge'|'current'|'pit'|'stairs'; stage:number; row:number; damage:number; wave:number };
export type HazardHero = Pick<Hero,'hp'|'journey'|'stats'|'inventory'|'equipped'|'effects'>;
export const journeyHazardNames = {death:['Okamžitá smrť','Instant death'],bandits:['Prepad banditov','Bandit ambush'],rockfall:['Padajúce skaly','Rockfall'],poison:['Jedovaté ostne','Poison spikes'],bridge:['Prelomený most','Collapsing bridge'],current:['Strhnutie prúdom','Swept away'],pit:['Skrytá jama','Hidden pit'],stairs:['Zrútené schody','Collapsing steps'],ravine:['Pád do rokliny','Ravine fall']} as const;
export function journeyHazardKey(journey:Journey,column:number,row:number){return journey.areaId+':'+column+':'+row;}
export function journeyHazardFromRoll(landmark:number,roll:number){
  if(roll<10)return 'death';
  if(roll<55)return 'bandits';
  return (['bridge','poison','rockfall','pit','current','stairs'] as const)[landmark];
}
export function hazardAt(journey:Journey,row:number) {
  if(routePathFromSeed(journey.seed)[journey.step]===row)return null;
  const roll=(Math.imul(Math.floor(journey.seed*10000000)+journey.step*73+row*139,2654435761)>>>0)%100;
  return journeyHazardFromRoll(journeyLandmarkAt(journey.step,row),roll);
}
export function roadBandit(level:number,wave:number):Encounter {
  const names:[string,string][]=[['Banditský prieskumník','Bandit Scout'],['Banditský nájazdník','Bandit Raider'],['Kapitán banditov','Bandit Captain']];
  return {name:['Road Bandit Scout','Road Bandit Raider','Road Bandit Captain'][wave],names:names[wave],kind:wave===2?'elite':'normal',hp:Math.round((25+level*5)*(1+wave*.25)),damage:Math.ceil(3+level*.25+wave*2),reward:12*level,gold:5*level,drops:[],mechanic:wave===0?'poison':wave===1?'frost':'shield',special:wave===0?['Jedovaté tŕne','Venomous Thorns']:wave===1?['Drvivý rev','Crushing Roar']:['Úder padlej posádky','Fallen Garrison Strike'],description:['Bandita z cestovnej hliadky. Zvláštny útok každé tri ťahy.','A member of a road patrol. Uses a special every three turns.']};
}
export function applyJourneyHazard<HeroState extends HazardHero>(hero:HeroState,original:Journey,row:number):HeroState {
  const kind=hazardAt(original,row),id=journeyHazardKey(original,original.step,row);
  if(!kind||!hero.journey||original.hazardsSeen?.includes(id))return hero;
  const damage=kind==='death'?hero.hp:kind==='bandits'?0:Math.max(1,Math.ceil(derivedStats(hero).maxHp*(kind==='bridge'?.35:kind==='poison'||kind==='current'?.2:.15)));
  const hp=Math.max(0,hero.hp-damage);
  const hazard:JourneyHazard={id,kind,stage:original.step,row,damage:hero.hp-hp,wave:0,fatal:hp===0};
  const journey={...hero.journey,hazard,hazardsSeen:[...(original.hazardsSeen||[]),id],...(hp===0?{step:0,choices:[],mistakes:Math.min(3,original.mistakes+1)}:{})};
  return {...hero,hp,journey,...(kind==='bandits'?{battle:startBattle(roadBandit(original.level,0),derivedStats(hero).maxStamina)}:{}),...(hp===0?{restUntil:Date.now()+30000,effects:[...hero.effects.filter(effect=>effect.name!=='Oslabenie'),{name:'Oslabenie',kind:'debuff',turns:3,power:2}]}:{})};
}
export function acknowledgeJourneyHazard(hero:Hero):Hero {
  const journey=hero.journey,hazard=journey?.hazard;
  return journey&&hazard&&hazard.kind!=='bandits'?settleJourneyRoute({...hero,journey:{...journey,hazard:null,...(hero.hp>0&&!hazard.fatal&&hazard.kind!=='death'?{acceptedSteps:[...(journey.acceptedSteps||[]),hazard.stage+':'+hazard.row]}:{})}}):hero;
}
export function actJourneyBattle(hero:Hero,action:BattleAction,item?:string):Hero {
  if(hero.journey?.hazard?.kind!=='bandits'||!hero.battle||hero.battle.ended||hero.hp<=0)return hero;
  const result=battleTurn(hero.battle,hero,action,0,hero.stats.Vitality,item);
  if(result.battle===hero.battle)return hero;
  const won=result.battle.ended==='win';
  const consumed=result.consumedItem?(hero.preparedConsumables||[]).indexOf(result.consumedItem):-1;
  return {...hero,hp:result.hp,battle:{...result.battle,...(won?{reward:{xp:hero.level>=100?0:hero.battle.enemy.reward,gold:hero.battle.enemy.gold,items:[]}}:{})},...awardXp(hero.xp,hero.level,won?hero.battle.enemy.reward:0),gold:hero.gold+(won?hero.battle.enemy.gold:0),preparedConsumables:(hero.preparedConsumables||[]).filter((_,index)=>index!==consumed),effects:result.battle.ended==='loss'?[{name:'Oslabenie',kind:'debuff',turns:3,power:2}]:hero.effects.map(effect=>({...effect,turns:effect.turns-1})).filter(effect=>effect.turns>0),...(result.battle.ended==='loss'?{restUntil:Date.now()+30000}:{})};
}
export function retreatJourneyBattle(hero:Hero):Hero {
  return hero.journey?.hazard?.kind==='bandits'&&hero.battle&&!hero.battle.ended?{...hero,battle:{...hero.battle,ended:'fled'}}:hero;
}
export function continueJourneyBattle(hero:Hero):Hero {
  const journey=hero.journey,hazard=journey?.hazard;
  if(!journey||hazard?.kind!=='bandits'||!hero.battle?.ended)return hero;
  if(hero.battle.ended==='win'&&hazard.wave<2)return {...hero,journey:{...journey,hazard:{...hazard,wave:hazard.wave+1}},battle:startBattle(roadBandit(journey.level,hazard.wave+1),derivedStats(hero).maxStamina)};
  return settleJourneyRoute({...hero,battle:null,journey:{...journey,hazard:null,...(hero.battle.ended!=='win'?{step:0,choices:[],mistakes:Math.min(3,journey.mistakes+1)}:{acceptedSteps:[...(journey.acceptedSteps||[]),hazard.stage+':'+hazard.row]})}});
}
