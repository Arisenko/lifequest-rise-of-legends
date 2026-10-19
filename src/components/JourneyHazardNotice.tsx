import { useEffect, useRef, useId } from 'react';
import { JourneyHazardArt } from './JourneyHazardArt';
import { acknowledgeJourneyHazard, journeyHazardNames } from '../data/journeyHazards';
import { GameButton } from './GameButton';
import type { Hero } from '../types/hero';

export function JourneyHazardNotice({hero,setHero,lang}:{hero:Hero;setHero:(update:(hero:Hero)=>Hero)=>void;lang:'sk'|'en'}) {
  const dialog=useRef<HTMLDialogElement>(null),title=useId();
  const hazard=hero.journey?.hazard;
  useEffect(()=>{if(hazard&&hazard.kind!=='bandits'&&!dialog.current?.open)dialog.current?.showModal();},[hazard?.id]);
  const tr=(sk:string,en:string)=>lang==='sk'?sk:en;
  if(!hazard||hazard.kind==='bandits')return null;
  return <dialog className="travel-event-dialog" ref={dialog} aria-labelledby={title} onCancel={event=>event.preventDefault()} onClose={()=>{if(dialog.current?.isConnected&&!dialog.current.open)dialog.current.showModal();}}><section className="travel-event-card"><JourneyHazardArt frame={({death:8,rockfall:1,poison:2,ravine:3,bridge:12,current:9,pit:10,stairs:11} as const)[hazard.kind]}/><h3 id={title}>{journeyHazardNames[hazard.kind][lang==='sk'?0:1]}</h3><p>−{hazard.damage} HP</p><p>{hero.hp>0&&!hazard.fatal&&hazard.kind!=='death'?tr('Prežil si nástrahu. Tento krok sa započíta ako náhradná cesta.','You survived the hazard. This step counts as an alternate route.'):tr('Nástraha bola smrteľná. Krok sa nezapočíta. Cesta začína od tábora; navštív liečiteľa.','The hazard was fatal. The step does not count. Return to camp and visit the healer.')}</p><div className="travel-event-actions"><GameButton variant="combat" autoFocus onClick={()=>setHero(current=>acknowledgeJourneyHazard(current))}>{hero.hp>0?tr('Pokračovať','Continue'):tr('Späť do tábora','Back to camp')}</GameButton></div></section></dialog>;
}
