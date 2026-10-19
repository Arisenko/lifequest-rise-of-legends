import { useEffect, useId, useState } from 'react';
import { CombatIcon } from './CombatIcon';
import { visibleEffects } from '../data/statusEffects';
import type { StatusHero, VisibleEffect } from '../data/statusEffects';

export function StatusEffects({ hero, lang }: {hero:StatusHero;lang:'sk'|'en'}) {
  const [now,setNow]=useState(Date.now);
  const [active,setActive]=useState<string|null>(null);
  const [pinned,setPinned]=useState(false);
  const tooltipId=useId();
  useEffect(()=>{
    if(!hero.restUntil || hero.restUntil<=Date.now())return;
    const timer=window.setInterval(()=>{const time=Date.now();setNow(time);if(time>=hero.restUntil!)window.clearInterval(timer)},1000);
    return()=>window.clearInterval(timer);
  },[hero.restUntil]);
  const tr=(sk:string,en:string)=>lang==='sk'?sk:en;
  const index=lang==='sk'?0:1;
  const effects=visibleEffects(hero,now);
  const selected=[...effects.player,...effects.enemy].find(effect=>effect.id===active);
  const icons=(entries:VisibleEffect[])=>entries.map(effect=><button type="button" className={'status-icon '+effect.kind} key={effect.id} aria-label={effect.name[index]} aria-describedby={active===effect.id?tooltipId:undefined} aria-expanded={active===effect.id} onMouseEnter={()=>{if(!pinned)setActive(effect.id)}} onFocus={()=>setActive(effect.id)} onBlur={()=>{setActive(null);setPinned(false)}} onClick={()=>{setActive(effect.id);setPinned(!pinned)}} onKeyDown={event=>{if(event.key==='Escape'){setActive(null);setPinned(false)}}}><CombatIcon name={effect.art||(effect.id==='rage'?'rage':effect.id==='marked'?'mark':effect.id==='runes'?'mage':(['drum','weakness','focus','poison','burn','weakness','guard','rage','recover'][effect.icon]||'focus'))}/>{(effect.turns||effect.seconds)&&<span className="status-duration">{effect.turns||effect.seconds+'s'}</span>}</button>);
  return <section className="status-panel" aria-label={tr('Aktívne efekty','Active effects')} onMouseLeave={()=>{if(!pinned)setActive(null)}}>
    <h3>{tr('Aktívne efekty','Active effects')}</h3>
    <div className="status-group"><small>{tr('Buffy','Buffs')}</small><div className="status-icons">{icons(effects.player.filter(effect=>effect.kind==='buff'))}{!effects.player.some(effect=>effect.kind==='buff')&&<span className="status-empty">{tr('Bez posilnení','No buffs')}</span>}</div></div>
    <div className="status-group"><small>{tr('Debuffy','Debuffs')}</small><div className="status-icons">{icons(effects.player.filter(effect=>effect.kind==='debuff'))}{!effects.player.some(effect=>effect.kind==='debuff')&&<span className="status-empty">{tr('Bez oslabení','No debuffs')}</span>}</div></div>
    {effects.enemy.length>0&&<div className="status-group enemy-status"><small>{tr('Efekty nepriateľa','Enemy effects')}</small><div className="status-icons">{icons(effects.enemy)}</div></div>}
    {selected&&<div className={'status-tooltip '+selected.kind} role="tooltip" id={tooltipId}><strong>{selected.name[index]}</strong><p>{selected.detail[index]}</p>{selected.turns&&<small>{tr('Zostáva ťahov','Turns remaining')}: {selected.turns}</small>}{selected.seconds&&<small>{tr('Zostáva','Remaining')}: {selected.seconds} s</small>}</div>}<p className="status-hint">{tr('Prejdi myšou na ikonu alebo na ňu klepni pre detail.','Hover over an icon or tap it for details.')}</p>
  </section>;
}
