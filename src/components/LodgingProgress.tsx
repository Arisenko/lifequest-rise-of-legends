import { derivedStats, refreshEnergy, ENERGY_RULES, LODGING_HP_INTERVAL } from '../data/playerSystems';
import type { Hero } from '../types/hero';

export function LodgingProgress({hero,now,lang}:{hero:Hero;now:number;lang:'sk'|'en'}){
  if(!hero.energyResting||hero.lodgingUpdatedAt===undefined)return null;
  const current=refreshEnergy(hero,now),values=derivedStats(current);
  const interval=ENERGY_RULES.restingInterval/values.energyRegeneration;
  const hpMissing=Math.max(0,values.maxHp-current.hp),energyMissing=Math.max(0,values.maxEnergy-(current.energy??values.maxEnergy));
  const hpRemaining=hpMissing?Math.max(0,Math.ceil(hpMissing/Math.max(1,Math.ceil(values.maxHp*.05)))*LODGING_HP_INTERVAL-(now-(current.lodgingUpdatedAt??now))):0;
  const energyRemaining=energyMissing?Math.max(0,Math.ceil(energyMissing)*interval-(now-(current.energyUpdatedAt??now))):0;
  const tr=(sk:string,en:string)=>lang==='sk'?sk:en;
  const time=(duration:number)=>{const seconds=Math.ceil(duration/1000);return Math.floor(seconds/3600).toString().padStart(2,'0')+':'+Math.floor(seconds%3600/60).toString().padStart(2,'0')+':'+(seconds%60).toString().padStart(2,'0');};
  return <section className="lodging-progress"><h3>{tr('Tvoj zaplatený nocľah','Your paid lodging')}</h3><div><strong>{tr('Život','Health')} · {current.hp}/{values.maxHp}</strong><progress max={values.maxHp} value={current.hp}/><span>{hpMissing?tr('Plné zdravie o ','Full health in ')+time(hpRemaining):tr('Život obnovený','Health restored')}</span></div><div><strong>{tr('Energia','Energy')} · {current.energy}/{values.maxEnergy}</strong><progress max={values.maxEnergy} value={current.energy}/><span>{energyMissing?tr('Plná energia o ','Full energy in ')+time(energyRemaining):tr('Energia obnovená','Energy restored')}</span></div><p>{tr('Život: +5 % maxima každých 30 sekúnd (zaokrúhlené nahor). Obnova pokračuje aj po zatvorení hry.','Health: +5% of maximum every 30 seconds (rounded up). Recovery continues while the game is closed.')}</p></section>;
}
