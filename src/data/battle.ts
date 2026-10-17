import { derivedStats } from './playerSystems';
import type { PlayerStats } from './playerSystems';
import type { Encounter } from './encounters';

export type BattleEffect = { kind: 'poison' | 'burn' | 'weakness'; turns: number; power: number };
export type Battle = { enemy: Encounter; hp: number; turn: number; shield: number; stamina: number; focus: number; effects: BattleEffect[]; log: [string, string][]; ended?: 'win' | 'loss' | 'fled' };
export type Fighter = { hp: number; stats: PlayerStats; equipped: string[]; effects: { kind: string; power: number; turns: number; name: string }[] };
export function startBattle(enemy: Encounter, stamina = 24): Battle { return { enemy, hp: enemy.hp, turn: 1, shield: 0, stamina, focus: 0, effects: [], log: [] }; }

export function battleTurn(battle: Battle, hero: Fighter, action: 'attack' | 'magic' | 'focus' | 'guard' | 'recover', gearAttack: number, vitality: number) {
  if (battle.ended) return { battle, hp: hero.hp };
  const values = derivedStats(hero);
  const maxHp = values.maxHp;
  const cost = action === 'attack' ? 2 : action === 'magic' ? 4 : action === 'focus' ? 6 : 0;
  if ((battle.stamina ?? values.maxStamina) < cost) return { battle, hp: hero.hp };
  let stamina = (battle.stamina ?? values.maxStamina) - cost;
  let focus = Math.max(0, (battle.focus || 0) - 1);
  let hp = hero.hp;
  let enemyHp = battle.hp;
  const log: [string, string][] = [];
  for (const effect of battle.effects) if (effect.kind !== 'weakness') hp -= Math.max(1, Math.ceil(effect.power * (1 - values.resistance)));
  if (hp <= 0) return { hp: 0, battle: { ...battle, ended: 'loss' as const, log: [['Padol si následkom efektov.', 'You fell to ongoing effects.'] as [string, string], ...battle.log].slice(0, 8) } };
  const weakness = battle.effects.filter(effect => effect.kind === 'weakness').reduce((sum, effect) => sum + effect.power, 0);
  const buff = hero.effects.reduce((sum, effect) => sum + (effect.kind === 'buff' ? effect.power : -effect.power), 0);
  if (action === 'attack' || action === 'magic') {
    const damage = Math.max(1, (action === 'magic' ? values.magical : values.physical) + buff + (battle.focus > 0 ? values.buffPower : 0) - weakness - (battle.shield > 0 ? 4 : 0));
    enemyHp -= damage;
    log.push([`Zásah: ${damage} HP.`, `Hit: ${damage} HP.`]);
  } else if (action === 'focus') {
    focus = 3;
    log.push([`Fokus: +${values.buffPower} útok na 3 ťahy.`, `Focus: +${values.buffPower} attack for 3 turns.`]);
  } else if (action === 'recover') {
    hp = Math.min(maxHp, hp + 4 + Math.floor(values.stats.Vitality / 2));
    stamina = Math.min(values.maxStamina, stamina + 8);
    log.push(['Oddych obnovil život aj výdrž; nepriateľ stále útočí.', 'Recovery restored health and stamina; the enemy still attacks.']);
  } else log.push(['Obrana: o 65 % nižšie poškodenie a ochrana pred novým efektom.', 'Guard: 65% less damage and protection from new effects.']);
  if (enemyHp <= 0) return { hp, battle: { ...battle, hp: 0, stamina, focus, ended: 'win' as const, log: [...log, ...battle.log].slice(0, 8) } };
  const special = battle.turn % 3 === 0;
  const enrage = battle.enemy.kind === 'boss' && enemyHp <= battle.enemy.hp / 2;
  const damage = Math.max(1, Math.ceil(Math.max(1, battle.enemy.damage * (special ? 1.8 : 1) * (enrage ? 1.35 : 1) - values.armor) * (action === 'guard' ? .35 : 1)));
  hp = Math.max(0, hp - damage);
  log.push([`${special ? battle.enemy.special[0] : 'Útok nepriateľa'}: −${damage} HP.`, `${special ? battle.enemy.special[1] : 'Enemy attack'}: −${damage} HP.`]);
  let effects = battle.effects.map(effect => ({ ...effect, turns: effect.turns - 1 })).filter(effect => effect.turns > 0);
  let shield = Math.max(0, battle.shield - 1);
  if (special) {
    const mechanic = battle.enemy.mechanic;
    if (mechanic === 'shield') shield = 2;
    else if (mechanic === 'drain') enemyHp = Math.min(battle.enemy.hp, enemyHp + Math.floor(damage / 2));
    else if (action !== 'guard') {
      const kind = mechanic === 'frost' ? 'weakness' : mechanic;
      effects = [...effects.filter(effect => effect.kind !== kind), { kind, turns: 3, power: mechanic === 'poison' ? 3 : 4 }];
    }
  }
  return { hp, battle: { ...battle, hp: enemyHp, turn: battle.turn + 1, shield, stamina, focus, effects, log: [...log, ...battle.log].slice(0, 8), ...(hp <= 0 ? { ended: 'loss' as const } : {}) } };
}
