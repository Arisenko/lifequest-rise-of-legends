import { enemyCombatProfile } from './enemyCombat';
import { derivedStats } from './playerSystems';
import type { PlayerState } from './playerSystems';
import type { Battle } from './battle';
import { enemySpecialIcon } from './enemyAttackArt';

export type StatusHero = PlayerState & { effects?: { name: string; kind: string; power: number; turns: number }[]; battle?: Battle | null; restUntil?: number };
export type VisibleEffect = { id: string; icon: number; art?:string; kind: 'buff' | 'debuff'; name: [string,string]; detail: [string,string]; turns?: number; seconds?: number };
export function visibleEffects(hero: StatusHero, now = Date.now()) {
  const values = derivedStats(hero);
  const player: VisibleEffect[] = (hero.effects || []).filter(effect => effect.turns > 0).map((effect,index) => ({
    id: 'hero-'+index, icon: effect.kind === 'buff' ? 0 : 1, kind: effect.kind === 'buff' ? 'buff' : 'debuff',
    name: effect.name === 'Vojnový rytmus' ? ['Vojnový rytmus','War Rhythm'] : effect.name === 'Oslabenie' ? ['Oslabenie po porážke','Post-defeat Weakness'] : [effect.kind === 'buff' ? 'Posilnenie útoku' : 'Oslabenie útoku', effect.kind === 'buff' ? 'Attack Boost' : 'Attack Penalty'],
    detail: [`${effect.kind === 'buff' ? '+' : '−'}${effect.power} k fyzickému aj magickému útoku. Trvanie klesá vykonaním bojového ťahu.`,`${effect.kind === 'buff' ? '+' : '−'}${effect.power} physical and magical attack. Duration decreases when taking a battle turn.`], turns: effect.turns,
  }));
  const enemy: VisibleEffect[] = [];
  const battle = hero.battle && !hero.battle.ended ? hero.battle : null;
  if (battle) {
    const foe = enemyCombatProfile(battle.enemy);
    if (battle.focus > 0) player.push({id:'focus',icon:2,kind:'buff',name:['Runový fokus','Runic Focus'],detail:[`+${values.buffPower} k útoku počas trvania fokusu.`,`+${values.buffPower} attack while focus is active.`],turns:battle.focus});
    if(battle.classBuff&&battle.classBuff.turns>0)player.push({id:'class-elixir',icon:0,kind:'buff',name:['Bojové posilnenie','Combat Boost'],detail:['+'+battle.classBuff.power+' k útoku.','+'+battle.classBuff.power+' attack.'],turns:battle.classBuff.turns});
    if((battle.rage||0)>0)player.push({id:'rage',icon:0,kind:'buff',name:['Zúrivosť','Rage'],detail:[battle.rage+'/3 náboje pre Drvivý úder.',battle.rage+'/3 charges for Crushing Strike.']});
    if((battle.runes||0)>0)player.push({id:'runes',icon:2,kind:'buff',name:['Runové náboje','Rune Charges'],detail:[battle.runes+'/3 náboje pre Runový výboj.',battle.runes+'/3 charges for Runic Burst.']});
    if((battle.marked||0)>0)enemy.push({id:'marked',icon:5,kind:'debuff',name:['Označená korisť','Marked Prey'],detail:['Dostáva o 25 % viac poškodenia z útokov.','Takes 25% more damage from attacks.'],turns:battle.marked});
    for(const effect of battle.foeEffects||[])if(effect.turns>0)enemy.push({id:'class-'+effect.kind,icon:effect.kind==='burn'?4:3,kind:'debuff',name:effect.kind==='burn'?['Horenie cieľa','Target Burn']:['Otrava cieľa','Target Poison'],detail:['−'+effect.power+' HP na začiatku hráčovho ťahu.','−'+effect.power+' HP at the start of the player turn.'],turns:effect.turns});
    for (const effect of battle.effects.filter(effect=>effect.turns>0)) {
      const damage = effect.kind==='burn'&&values.burnImmune?0:Math.max(1,Math.ceil(effect.power*(1-values.resistance)));
      const specialArt=enemySpecialIcon(battle.enemy);
      const cursed=effect.kind==='burn'&&specialArt==='enemy-curse';
      player.push({
        id:effect.kind,icon:effect.kind==='poison'?3:effect.kind==='burn'?4:5,kind:'debuff',
        ...(cursed?{art:'enemy-curse'}:effect.kind==='weakness'?{art:specialArt}:{}),
        name:effect.kind==='poison'?['Otrava','Poison']:cursed?['Hnilobná kliatba','Rotting Curse']:effect.kind==='burn'?['Horenie','Burn']:['Oslabený útok','Weakened Attack'],
        detail:effect.kind==='weakness'?[`−${effect.power} k fyzickému aj magickému útoku.`,`−${effect.power} physical and magical attack.`]:[`−${damage} HP na začiatku tvojho ťahu po zohľadnení odolnosti.`,`−${damage} HP at the start of your turn after resistance.`],turns:effect.turns,
      });
    }
    if(battle.shield>0)enemy.push({id:'enemy-shield',icon:6,art:enemySpecialIcon(battle.enemy),kind:'buff',name:['Štít nepriateľa','Enemy Shield'],detail:[`Znižuje každý tvoj zásah o ${foe.shieldPower}. Nepatrí hráčovi.`,`Reduces each of your hits by ${foe.shieldPower}. This is not a player buff.`],turns:battle.shield});
    if(battle.enemy.kind==='boss'&&battle.hp<=battle.enemy.hp/2)enemy.push({id:'enemy-enrage',icon:7,kind:'buff',name:['Zúrivosť bossa','Boss Enrage'],detail:[`Boss spôsobuje o ${Math.round((foe.enrageMultiplier-1)*100)} % vyššie poškodenie, kým má najviac polovicu HP.`,`The boss deals ${Math.round((foe.enrageMultiplier-1)*100)}% more damage while at or below half HP.`]});
  }
  if((hero.restUntil||0)>now)player.push({id:'injury',icon:1,kind:'debuff',name:['Zotavenie po porážke','Defeat Recovery'],detail:['Do konca zotavenia nemožno začať nový súboj.','Cannot start a new battle until recovery ends.'],seconds:Math.ceil((hero.restUntil!-now)/1000)});
  if(hero.energyResting)player.push({id:'rest',icon:8,kind:'buff',name:['Oddych','Resting'],detail:['Obnova +1 energie za '+(30/values.energyRegeneration)+' sekúnd. Tréning a vstup do boja sú počas oddychu blokované.','Restores +1 energy every '+(30/values.energyRegeneration)+' seconds. Training and entering battles are blocked while resting.']});
  return {player,enemy};
}
