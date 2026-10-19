import { enemyCombatProfile } from './enemyCombat';
import { derivedStats } from './playerSystems';
import type { PlayerStats } from './playerSystems';
import { classId, resolveClass } from './classes';
import { itemData } from './loot';
import type { Encounter } from './encounters';

export type BattleAction='attack'|'magic'|'focus'|'guard'|'recover'|'skill'|'potion'|'relic'|'consumable';
export type BattleEffect = { kind: 'poison' | 'burn' | 'weakness'; turns: number; power: number };
export type BattleReward={xp:number;gold:number;items:string[];equippedItems?:number[]};
export type Battle = { reward?:BattleReward; enemy: Encounter; hp: number; turn: number; shield: number; stamina: number; focus: number; effects: BattleEffect[]; log: [string, string][]; ended?: 'win' | 'loss' | 'fled'; relicReadyAt?:number;powerHits?:number;skillReadyAt?:number;rage?:number;runes?:number;chain?:number;marked?:number;classBuff?:{turns:number;power:number};foeEffects?:BattleEffect[] };
export type Fighter = { hp: number; stats: PlayerStats; equipped: string[]; effects: { kind: string; power: number; turns: number; name: string }[];className?:string;inventory?:string[];preparedConsumables?:string[];level?:number };
export function startBattle(enemy: Encounter, stamina = 24): Battle { return { enemy, hp: enemy.hp, turn: 1, shield: 0, stamina, focus: 0, effects: [], log: [] }; }
export function combatConsumables(hero:Pick<Fighter,'preparedConsumables'|'level'>) {
  return [...new Set(hero.preparedConsumables||[])].filter(id=>(id==='Healing herb'||id==='War drum'||Boolean(itemData[id]?.heal))&&(hero.level||1)>=(itemData[id]?.level||1));
}
export function combatPotion(hero:Pick<Fighter,'preparedConsumables'|'level'>) {
  return hero.preparedConsumables?.find(id=>(id==='Healing herb'||itemData[id]?.heal)&& (hero.level||1)>=(itemData[id]?.level||1));
}
export function battleTurn(battle: Battle, hero: Fighter, action: BattleAction, gearAttack: number, vitality: number, selectedItem?:string):{battle:Battle;hp:number;consumedItem?:string} {
  if (battle.ended||hero.hp<=0) return { battle, hp: hero.hp };
  const foe = enemyCombatProfile(battle.enemy);
  const values = derivedStats(hero),id=hero.className?classId(hero.className):null;
  if(action==='skill'&&(!id||battle.turn<(battle.skillReadyAt||0)))return {battle,hp:hero.hp};
  const power=values.itemPowers.strongest;
  if(action==='relic'&&(!power?.skillMultiplier||battle.turn<(battle.relicReadyAt||0)))return {battle,hp:hero.hp};
  const usingItem=action==='potion'||action==='consumable';
  const potion=usingItem?(selectedItem??combatPotion(hero)):undefined;
  if(usingItem&&(!potion||!combatConsumables(hero).includes(potion)))return {battle,hp:hero.hp};
  const cost = action === 'relic' ? 8 : action === 'attack' ? 2 : action === 'magic' ? 4 : action === 'focus'||action==='skill' ? 6 : 0;
  if ((battle.stamina ?? values.maxStamina) < cost) return { battle, hp: hero.hp };
  let stamina = (battle.stamina ?? values.maxStamina) - cost,focus = Math.max(0, (battle.focus || 0) - 1);
  let hp = hero.hp,enemyHp = battle.hp,rage=battle.rage||0,runes=battle.runes||0,chain=battle.chain||0,marked=Math.max(0,(battle.marked||0)-1),skillReadyAt=battle.skillReadyAt||0;
  let powerHits=battle.powerHits||0,relicReadyAt=battle.relicReadyAt||0;
  let classBuff=battle.classBuff?{...battle.classBuff,turns:Math.max(0,battle.classBuff.turns-1)}:undefined;
  let foeEffects=(battle.foeEffects||[]).map(effect=>({...effect,turns:effect.turns-1})).filter(effect=>effect.turns>0);
  const log: [string, string][] = [];
  const guarding=action==='guard'||action==='skill'&&id==='Paladin';
  const cleansing=action==='skill'&&id==='Paladin';
  const snapshot=(ended?:'win'|'loss'):Battle=>({...battle,hp:Math.max(0,enemyHp),turn:battle.turn+1,stamina,focus,powerHits,relicReadyAt,rage,runes,chain,marked,skillReadyAt,classBuff,foeEffects,log:[...log,...battle.log].slice(0,8),...(ended?{ended}:{})});
  for (const effect of cleansing?[]:battle.effects) if (effect.kind !== 'weakness' && !(effect.kind==='burn'&&values.burnImmune)) hp -= Math.max(1, Math.ceil(effect.power * (1 - values.resistance)));
  if (hp <= 0) {log.push(['Padol si následkom efektov.','You fell to ongoing effects.']);return {hp:0,battle:snapshot('loss')};}
  for(const effect of battle.foeEffects||[])if(effect.turns>0) {
    enemyHp-=effect.power;
    log.push(['Efekt na nepriateľovi: −'+effect.power+' HP.','Enemy damage over time: −'+effect.power+' HP.']);
  }
  if(enemyHp<=0)return {hp,battle:snapshot('win')};
  const weakness=(cleansing?[]:battle.effects).filter(effect=>effect.kind==='weakness').reduce((sum,effect)=>sum+effect.power,0);
  const buff=hero.effects.reduce((sum,effect)=>sum+(effect.kind==='buff'?effect.power:-effect.power),0)+(battle.classBuff&&battle.classBuff.turns>0?battle.classBuff.power:0);
  let attack:number|null=null;
  if(action==='attack'||action==='magic') {
    attack=action==='magic'?values.magical:values.physical;
    if(id==='Bojovník'&&action==='attack')rage=Math.min(3,rage+1);
    if(id==='Mág'&&action==='magic')runes=Math.min(3,runes+1);
  } else if(action==='relic'&&power) {
    const base=Math.max(values.physical,values.magical);
    attack=base*power.skillMultiplier;
    relicReadyAt=battle.turn+power.cooldown;
    if(power.rank===3) {
      const existing=foeEffects.find(effect=>effect.kind==='burn');
      foeEffects=[...foeEffects.filter(effect=>effect.kind!=='burn'),{kind:'burn',turns:Math.max(3,existing?.turns||0),power:Math.max(Math.ceil(base*.1),existing?.power||0)}];
    }
    log.push(power.rank===3?['Kataklizma!','Cataclysm!']:['Relikviový úder!','Relic Strike!']);
  } else if(action==='skill') {
    skillReadyAt=battle.turn+3;
    if(id==='Bojovník') {attack=values.physical*(1.4+rage*.3);rage=0;}
    if(id==='Mág') {attack=values.magical*(1.6+runes*.25);runes=0;foeEffects=[...foeEffects.filter(effect=>effect.kind!=='burn'),{kind:'burn',turns:3,power:Math.max(2,Math.floor(values.stats.Intelligence/3))}];}
    if(id==='Alchymista') {hp=Math.min(values.maxHp,hp+Math.ceil((6+values.stats.Intelligence)*values.potionHealing));classBuff={turns:3,power:values.buffPower*2+(values.affinity?2:0)};}
    if(id==='Paladin') {hp=Math.min(values.maxHp,hp+Math.ceil((8+values.stats.Discipline*2+values.stats.Vitality)*values.healingPower));}
    if(id==='Lovec') {attack=values.physical*.8;marked=3;}
    if(id==='Assassín') {attack=values.physical*1.3;foeEffects=[...foeEffects.filter(effect=>effect.kind!=='poison'),{kind:'poison',turns:3,power:Math.ceil((2+Math.floor(values.stats.Discipline/3))*values.poisonPower)}];}
    const name=resolveClass(hero.className).skill;
    log.push([name[0],name[1]]);
  } else if(action==='focus') {focus=3;log.push(['Fokus: +'+values.buffPower+' útok na 3 ťahy.','Focus: +'+values.buffPower+' attack for 3 turns.']);}
  else if(action==='recover') {hp=Math.min(values.maxHp,hp+4+Math.floor(values.stats.Vitality/2));stamina=Math.min(values.maxStamina,stamina+8);log.push(['Oddych obnovil život aj výdrž; nepriateľ stále útočí.','Recovery restored health and stamina; the enemy still attacks.']);}
  else if(usingItem&&potion==='War drum') {classBuff={turns:3,power:Math.ceil(values.buffPower*(id==='Alchymista'?1.5:1))};log.push(['Vojnový rytmus: +'+classBuff.power+' k útoku na 3 ťahy.','War Rhythm: +'+classBuff.power+' attack for 3 turns.']);}
  else if(usingItem) {const heal=Math.ceil((itemData[potion!]?.heal||12)*values.potionHealing);hp=Math.min(values.maxHp,hp+heal);log.push(['Liečivý predmet: +'+heal+' HP.','Healing item: +'+heal+' HP.']);}
  else log.push(['Obrana: o 65 % nižšie poškodenie a ochrana pred novým efektom.','Guard: 65% less damage and protection from new effects.']);
  if(attack!==null) {
    if(id==='Assassín'&&(action==='attack'||action==='skill')) {chain++;if(chain%3===0) {attack*=1.5;log.push(['Kritický zásah!','Critical hit!']);}}
    const damage=Math.max(1,Math.ceil((attack+buff+(battle.focus>0?values.buffPower:0)-weakness-(battle.shield>0?foe.shieldPower:0))*((battle.marked||0)>0?1.25:1)));
    let totalDamage=damage;
    if(power) {
      powerHits++;
      if(powerHits%power.echoEvery===0) {
        const echo=Math.max(1,Math.ceil(damage*power.echoPercent/100));
        totalDamage+=echo;
        log.push(['Ozvena predmetu: +'+echo+' poškodenia.','Item echo: +'+echo+' damage.']);
      }
      const healing=Math.floor(Math.min(enemyHp,totalDamage)*power.leechPercent/100);
      if(healing>0) {
        const restored=Math.min(healing,Math.max(0,values.maxHp-hp));
        hp+=restored;
        log.push(['Vysatie života: +'+restored+' HP.','Life steal: +'+restored+' HP.']);
      }
    }
    enemyHp-=totalDamage;log.push(['Zásah: '+damage+' HP.','Hit: '+damage+' HP.']);
  }
  if(enemyHp<=0)return {hp,battle:snapshot('win'),...(potion?{consumedItem:potion}:{})};
  const special=battle.turn%foe.specialEvery===0,enrage=battle.enemy.kind==='boss'&&enemyHp<=battle.enemy.hp/2;
  const damage=Math.max(1,Math.ceil(Math.max(1,battle.enemy.damage*(special?foe.specialMultiplier:1)*(enrage?foe.enrageMultiplier:1)-values.armor)*(guarding?.35:1)));
  hp=Math.max(0,hp-damage);
  log.push([(special?battle.enemy.special[0]:'Útok nepriateľa')+': −'+damage+' HP.',(special?battle.enemy.special[1]:'Enemy attack')+': −'+damage+' HP.']);
  let effects=(cleansing?[]:battle.effects).map(effect=>({...effect,turns:effect.turns-1})).filter(effect=>effect.turns>0),shield=Math.max(0,battle.shield-1);
  if(special) {
    const mechanic=battle.enemy.mechanic;
    if(mechanic==='shield')shield=2;
    else if(mechanic==='drain')enemyHp=Math.min(battle.enemy.hp,enemyHp+Math.floor(damage*foe.drainRatio));
    else if(!guarding) {const kind=mechanic==='frost'?'weakness':mechanic;effects=[...effects.filter(effect=>effect.kind!==kind),{kind,turns:foe.effectDuration,power:foe.effectPower}];}
  }
  return {hp,battle:{...snapshot(hp<=0?'loss':undefined),effects,shield},...(potion?{consumedItem:potion}:{})};
}
