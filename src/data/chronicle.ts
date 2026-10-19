import { encounterAreas } from './encounters';
import { isAreaUnlocked } from './adventureProgress';
import { scheduledQuests } from './questSchedule';
import type { QuestProgress } from './questSchedule';

type ChronicleHero = { clearedAreas?: string[]; questProgress?: QuestProgress; battle?: { ended?: string } | null; dungeonRun?: { complete: boolean } | null };
export function chronicleSummary(hero: ChronicleHero, now = new Date()) {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const completed = scheduledQuests.filter(quest => {
    const time = hero.questProgress?.[quest.id]?.completedAt;
    return time !== undefined && time >= start && time <= now.getTime();
  });
  const area = encounterAreas.find(area => isAreaUnlocked(hero,area.id) && !hero.clearedAreas?.includes(area.id)) || encounterAreas[encounterAreas.length-1];
  const battle = Boolean(hero.battle && !hero.battle.ended);
  const dungeon = Boolean(hero.dungeonRun);
  return {
    area,
    allCleared: encounterAreas.every(area => hero.clearedAreas?.includes(area.id)),
    completedToday: completed.length,
    trainingXpToday: completed.reduce((sum,quest) => sum+(hero.questProgress?.[quest.id]?.awardedXp ?? quest.xp),0),
    target: dungeon ? { tab: 'dungeons', areaId: undefined } : { tab: 'combat', areaId: area.id },
    battle,
    dungeon,
  };
}
