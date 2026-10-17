export const DUNGEON_KEY = 'Dungeon key';
export const RAID_TOKEN = 'Dragon raid seal';
export const ACCESS_DROP_CHANCE = .05;
export type DungeonRun = { stage: number; complete: boolean };
type AccessHero = { inventory: string[]; hp: number; restUntil?: number; energyResting?: boolean; battle?: { ended?: string } | null; dungeonRun?: DungeonRun | null };

export function rollAccessDrop(kind: string, mode: 'adventure' | 'dungeon', random = Math.random) {
  if (kind !== 'boss' || random() >= ACCESS_DROP_CHANCE) return null;
  return mode === 'dungeon' ? RAID_TOKEN : DUNGEON_KEY;
}

export function enterDungeon<Hero extends AccessHero>(hero: Hero, now = Date.now()): Hero {
  const index = hero.inventory.indexOf(DUNGEON_KEY);
  if (index < 0 || hero.dungeonRun || hero.hp <= 0 || (hero.restUntil || 0) > now || hero.energyResting || hero.battle && !hero.battle.ended) return hero;
  return { ...hero, inventory: hero.inventory.filter((_, position) => position !== index), battle: null, dungeonRun: { stage: 0, complete: false } };
}

export function advanceDungeon(run: DungeonRun, defeatedStage: number): DungeonRun {
  if (run.complete || run.stage !== defeatedStage) return run;
  const stage = run.stage + 1;
  return { stage, complete: stage >= 3 };
}

export function leaveDungeon<Hero extends AccessHero>(hero: Hero): Hero {
  if (hero.battle && !hero.battle.ended) return hero;
  return { ...hero, dungeonRun: null, battle: null };
}
