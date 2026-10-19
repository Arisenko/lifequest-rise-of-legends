export type EnemyCombat = { specialEvery: number; specialMultiplier: number; effectPower: number; effectDuration: number; shieldPower: number; enrageMultiplier: number; drainRatio: number };
export function enemyCombatProfile(enemy: { mechanic: string; combat?: Partial<EnemyCombat> }): EnemyCombat {
  return { specialEvery: 3, specialMultiplier: 1.8, effectPower: enemy.mechanic === 'poison' ? 3 : 4, effectDuration: 3, shieldPower: 4, enrageMultiplier: 1.35, drainRatio: .5, ...enemy.combat };
}
