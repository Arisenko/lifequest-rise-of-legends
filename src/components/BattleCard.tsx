import { enemyCombatProfile } from '../data/enemyCombat';
import { CombatActionButton } from './CombatActionButton';
import { BattleRewards } from './BattleRewards';
import { enemySpecialIcon, enemyBasicIcon } from '../data/enemyAttackArt';
import { useState } from 'react';
import type { Hero } from '../types/hero';
import type { Battle, BattleAction } from '../data/battle';
import { combatConsumables } from '../data/battle';
import { derivedStats } from '../data/playerSystems';
import { itemData } from '../data/loot';
import { EnemyArt, GameIcon } from './GameArt';
import { GameButton } from './GameButton';
import { ClassCombatPanel } from './ClassCombatPanel';
import { CombatIcon } from './CombatIcon';
import { StatusEffects } from './StatusEffects';
import { ItemArtwork } from './ItemArtwork';

export function BattleCard({hero,battle,lang,receipt,onAct,onRetreat,onBack,onEquipReward,continueLabel}:{hero:Hero;battle:Battle;lang:'sk'|'en';receipt:string|null;continueLabel?:string;onEquipReward?:(index:number)=>void;onAct:(action:BattleAction,item?:string)=>void;onRetreat:()=>void;onBack:()=>void}) {
  const [suppliesOpen,setSuppliesOpen]=useState(false);
  const tr=(sk:string,en:string)=>lang==='sk'?sk:en;
  const index=lang==='sk'?0:1;
  const values=derivedStats(hero);
  const supplies=[...new Set(hero.preparedConsumables||[])].filter(id=>id==='War drum'||id==='Healing herb'||Boolean(itemData[id]?.heal));
  const usable=combatConsumables(hero);
  const foe = enemyCombatProfile(battle.enemy);
  const specialIcon=enemySpecialIcon(battle.enemy);
  const normalIcon=enemyBasicIcon(battle.enemy);
  const actions:[BattleAction,string,string,string,number][]=[
    ['attack','attack',tr('Útok','Attack'),tr('Fyzický zásah','Physical hit'),2],
    ['guard','guard',tr('Obrana','Guard'),tr('−65 % zásahu · blok nových efektov','−65% incoming hit · blocks new effects'),0],
    ['magic','magic',tr('Magický útok','Magic attack'),tr('Magický zásah','Magic hit'),4],
    ['focus','focus',tr('Fokus','Focus'),'+'+values.buffPower+' '+tr('útok · 3 ťahy','attack · 3 turns'),6],
    ['recover','recover',tr('Zotavenie','Recover'),'+'+(4+Math.floor(values.stats.Vitality/2))+' HP · +8 '+tr('výdrž','stamina'),0],
  ];
  return <section className="battle-card" aria-label={battle.ended?tr('Výsledok súboja','Battle result'):tr('Prebiehajúci súboj','Current battle')}>
    <div className="battle-card-heading"><div><p className="eyebrow">{battle.ended?tr('STRETNUTIE UKONČENÉ','ENCOUNTER COMPLETE'):tr('BOJOVÉ STRETNUTIE','COMBAT ENCOUNTER')}</p><h2>{battle.enemy.names[index]}</h2></div><span className="battle-turn">{tr('Ťah','Turn')} {battle.turn}</span></div>
    {!battle.ended&&<div className="battle-stage"><EnemyArt name={battle.enemy.name} label={battle.enemy.names[index]} className="battle-portrait"/><div className="battle-vitals"><div><strong>{hero.name}</strong><label>{tr('Tvoj život','Your health')} · {hero.hp} / {values.maxHp}<progress max={values.maxHp} value={hero.hp}/></label><label>{tr('Výdrž','Stamina')} · {battle.stamina} / {values.maxStamina}<progress className="battle-stamina" max={values.maxStamina} value={battle.stamina}/></label></div><div><strong><CombatIcon name={normalIcon}/>{battle.enemy.kind==='boss'?tr('Boss','Boss'):battle.enemy.kind==='elite'?tr('Elitný protivník','Elite enemy'):tr('Protivník','Enemy')}</strong><label>{tr('Život nepriateľa','Enemy health')} · {battle.hp} / {battle.enemy.hp}<progress className="enemy-health" max={battle.enemy.hp} value={battle.hp}/></label></div></div></div>}
    {!battle.ended?<>
      <div className={'battle-warning'+(battle.turn%foe.specialEvery===0?' imminent':'')}><CombatIcon name={specialIcon}/><span><strong>{battle.enemy.special[index]}</strong><small>{battle.turn%foe.specialEvery===0?tr('Prichádza tento ťah — zváž obranu!','Incoming this turn — consider guarding!'):tr('Špeciálny útok o ','Special attack in ')+(foe.specialEvery-battle.turn%foe.specialEvery)+tr(' ťahy.',' turns.')}</small></span></div>
      <StatusEffects hero={{...hero,battle}} lang={lang}/>
      <h3 className="battle-section-title">{tr('Vyber svoj ďalší krok','Choose your next move')}</h3><div className="battle-actions">{actions.map(([action,icon,title,detail,cost])=><CombatActionButton key={action} icon={icon} title={title} detail={detail} cost={cost} lang={lang} disabled={battle.stamina<cost} onClick={()=>onAct(action)}/>)}</div>
      <ClassCombatPanel hero={hero} battle={battle} lang={lang} onAct={onAct}/>
      <div className="battle-supplies"><GameButton variant="combat" aria-expanded={suppliesOpen} aria-controls="battle-supply-list" onClick={()=>setSuppliesOpen(value=>!value)}><CombatIcon name="potion"/><span>{tr('Pripravené zásoby','Prepared supplies')} · {supplies.reduce((sum,id)=>sum+(hero.preparedConsumables||[]).filter(entry=>entry===id).length,0)}<small>{tr('Liečenie a posilnenia · použitie stojí 1 ťah','Healing and buffs · using costs 1 turn')}</small></span></GameButton>{suppliesOpen&&<div id="battle-supply-list">{!supplies.length&&<p>{tr('Nemáš pripravené spotrebné predmety. Pred súbojom ich nasaď v karte Postava.','No supplies are prepared. Equip consumables on the Character screen before combat.')}</p>}{supplies.map(id=>{const item=itemData[id];const heal=Math.ceil((item?.heal||12)*values.potionHealing);return <article className="battle-supply" key={id}><ItemArtwork id={id}/><div><strong>{item?.names?.[index]||id}</strong><small>×{(hero.preparedConsumables||[]).filter(entry=>entry===id).length} · {tr('Úroveň','Level')} {item?.level||1}</small><p>{id==='War drum'?tr('Bojové posilnenie útoku na 3 ťahy. Nahradí aktuálne posilnenie z bojového elixíru.','Attack buff for 3 turns. Replaces the current battle-elixir buff.'):'+'+heal+' HP'}</p><GameButton variant="combat" disabled={!usable.includes(id)} onClick={()=>onAct('consumable',id)}>{usable.includes(id)?tr('Použiť · 1 ťah','Use · 1 turn'):tr('Príliš nízka úroveň','Level too low')}</GameButton></div></article>})}</div>}</div>
      <GameButton variant="combat" className="battle-retreat" onClick={onRetreat}><CombatIcon name="flee"/>{tr('Ustúpiť bez odmeny','Retreat without rewards')}</GameButton>
    </>:<div className={'battle-result result-'+battle.ended}>{battle.ended==='win'?<span className="battle-victory-crest"><GameIcon name="arena"/></span>:<CombatIcon name={battle.ended==='loss'?'weakness':'flee'}/>}<h3>{battle.ended==='win'?tr('Víťazstvo!','Victory!'):battle.ended==='loss'?tr('Porážka — navštív liečiteľa.','Defeat — visit the healer.'):tr('Bezpečný ústup','Retreated')}</h3>{battle.ended==='win'&&(battle.reward?<BattleRewards reward={battle.reward} hero={hero} lang={lang} onEquip={onEquipReward}/>:<p>{receipt||tr('Odmeny boli uložené do progresu.','Rewards have been saved to your progress.')}</p>)}<GameButton variant="combat" className="battle-continue" onClick={onBack}>{continueLabel||tr('Pokračovať vo výprave','Continue adventure')} <span aria-hidden="true">→</span></GameButton></div>}
    <details className="battle-journal" open={!battle.ended}><summary>{tr('Bojový denník','Battle journal')}</summary><ol aria-live="polite">{battle.log.length?battle.log.map((message,position)=><li key={position}><CombatIcon name={message[1].startsWith(battle.enemy.special[1]+':')?specialIcon:message[1].startsWith('Enemy attack')?normalIcon:message[1].startsWith('Hit:')?'attack':/Healing|Recovery|Life steal/.test(message[1])?'recover':/Poison|poison/.test(message[1])?'poison':/Relic|Cataclysm|echo/.test(message[1])?'relic':'focus'}/><span>{message[index]}</span></li>):<li>{tr('Protivník čaká na tvoj prvý krok.','Your opponent awaits your first move.')}</li>}</ol></details>
  </section>;
}
