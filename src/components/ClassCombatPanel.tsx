import { derivedStats } from '../data/playerSystems';
import { CombatIcon } from './CombatIcon';
import type { Battle, BattleAction, Fighter } from '../data/battle';
import { classId, resolveClass } from '../data/classes';
import { CombatActionButton } from './CombatActionButton';

export function ClassCombatPanel({hero,battle,lang,onAct}:{hero:Fighter;battle:Battle;lang:'sk'|'en';onAct:(action:BattleAction)=>void}) {
  const profile=resolveClass(hero.className),id=classId(hero.className),index=lang==='sk'?0:1;
  const power=derivedStats(hero).itemPowers.strongest;
  const relicRemaining=Math.max(0,(battle.relicReadyAt||0)-battle.turn);
  const remaining=Math.max(0,(battle.skillReadyAt||0)-battle.turn);
  const tr=(sk:string,en:string)=>lang==='sk'?sk:en;
  return <section className="class-combat-panel"><h3>{profile.role[index]}</h3>
    <CombatActionButton icon={({Bojovník:'warrior',Paladin:'paladin',Mág:'mage',Alchymista:'alchemist',Lovec:'ranger',Assassín:'assassin'} as Record<string,string>)[id]} title={profile.skill[index]} detail={tr('Schopnosť povolania','Class ability')} cost={6} cooldown={remaining} lang={lang} disabled={battle.stamina<6||remaining>0||Boolean(battle.ended)} onClick={()=>onAct('skill')}/>
    {Boolean(power?.skillMultiplier)&&<CombatActionButton icon="relic" title={power?.rank===3?tr('Kataklizma','Cataclysm'):tr('Relikviový úder','Relic Strike')} detail={tr('Schopnosť výbavy','Equipment ability')} cost={8} cooldown={relicRemaining} lang={lang} disabled={battle.stamina<8||relicRemaining>0||Boolean(battle.ended)} onClick={()=>onAct('relic')}/>}
    {power&&<p><CombatIcon name="echo"/>{tr('Ozvena: zásahy do aktivácie','Echo: hits until activation')}: {power.echoEvery-(battle.powerHits||0)%power.echoEvery}</p>}
    {id==='Bojovník'&&<p><CombatIcon name="rage"/>{tr('Zúrivosť','Rage')}: {battle.rage||0}/3</p>}
    {id==='Mág'&&<p><CombatIcon name="mage"/>{tr('Runové náboje','Rune charges')}: {battle.runes||0}/3</p>}
    {id==='Assassín'&&<p><CombatIcon name="assassin"/>{tr('Fyzické zásahy do ďalšieho kritického','Physical hits until next critical')}: {3-(battle.chain||0)%3}</p>}
    {(battle.marked||0)>0&&<p><CombatIcon name="mark"/>{tr('Označená korisť: +25 % poškodenia','Marked prey: +25% damage')} · {battle.marked} {tr('ťahy','turns')}</p>}
    {battle.classBuff&&battle.classBuff.turns>0&&<p><CombatIcon name="potion"/>{tr('Bojové posilnenie','Combat Boost')}: +{battle.classBuff.power} · {battle.classBuff.turns} {tr('ťahy','turns')}</p>}
    {battle.foeEffects?.map(effect=><p key={effect.kind}><CombatIcon name={effect.kind}/>{effect.kind==='burn'?tr('Horenie cieľa','Target burn'):tr('Jed na cieli','Target poison')}: −{effect.power} HP · {effect.turns} {tr('ťahy','turns')}</p>)}
  </section>;
}
