import { awardXp } from './progression';
export type QuestPeriod = 'daily' | 'weekly' | 'monthly';
export type QuestStat = 'Strength' | 'Intelligence' | 'Discipline' | 'Vitality';
export type Quest = { id: string; period: QuestPeriod; title: [string, string]; step: [string, string]; target: number; xp: number; gold: number; stat: QuestStat; points: number; icon: string; item?: string };
export type QuestProgress = Record<string, { period: string; count: number; loot?: string | null; completedAt?: number }>;

export function periodStart(period: QuestPeriod, now = new Date()) {
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (period === 'weekly') date.setDate(date.getDate() - (date.getDay() + 6) % 7);
  if (period === 'monthly') date.setDate(1);
  return date;
}

export function periodKey(period: QuestPeriod, now = new Date()) {
  const date = periodStart(period, now);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function nextReset(period: QuestPeriod, completedAt: Date) {
  if (period !== 'monthly') return new Date(completedAt.getTime() + (period === 'daily' ? 1 : 7) * 24 * 60 * 60 * 1000);
  const date = new Date(completedAt);
  const day = date.getDate();
  date.setDate(1);
  date.setMonth(date.getMonth() + 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  date.setDate(Math.min(day, lastDay));
  return date;
}

export function questResetAt(progress: QuestProgress | undefined, quest: Quest): Date | null {
  const timestamp = progress?.[quest.id]?.completedAt;
  return timestamp === undefined ? null : nextReset(quest.period, new Date(timestamp));
}

export const scheduledQuests: Quest[] = [
  { id: 'move', period: 'daily', title: ['Prejdi sa 10 minút', 'Take a 10-minute walk'], step: ['10 minút chôdze', '10 minutes of walking'], target: 1, xp: 20, gold: 8, stat: 'Vitality', points: 1, icon: '☀️' },
  { id: 'learn', period: 'daily', title: ['Nauč sa jednu novú vec', 'Learn one new thing'], step: ['Jedna nová vedomosť', 'One new thing learned'], target: 1, xp: 25, gold: 10, stat: 'Intelligence', points: 1, icon: '📜' },
  { id: 'focus', period: 'daily', title: ['Dokonči dôležitú úlohu', 'Complete an important task'], step: ['Jedna dokončená úloha', 'One completed task'], target: 1, xp: 30, gold: 12, stat: 'Discipline', points: 1, icon: '🕯️' },
  { id: 'weekly-training', item: 'Iron helm', period: 'weekly', title: ['Trikrát si zacvič', 'Exercise three times'], step: ['20 minút cvičenia podľa svojich možností', '20 minutes of exercise at your own pace'], target: 3, xp: 150, gold: 60, stat: 'Strength', points: 2, icon: '⚒️' },
  { id: 'weekly-study', item: 'Rusty charm', period: 'weekly', title: ['Tri sústredené študijné bloky', 'Three focused study sessions'], step: ['30 minút učenia', '30 minutes of learning'], target: 3, xp: 180, gold: 70, stat: 'Intelligence', points: 2, icon: '📚' },
  { id: 'weekly-focus', item: 'Guard boots', period: 'weekly', title: ['Dokonči päť dôležitých úloh', 'Complete five important tasks'], step: ['Jedna dokončená úloha', 'One completed task'], target: 5, xp: 200, gold: 80, stat: 'Discipline', points: 2, icon: '🛡️' },
  { id: 'monthly-walk', item: 'Ember cloak', period: 'monthly', title: ['Dvanásť dlhších prechádzok', 'Twelve longer walks'], step: ['30 minút chôdze', '30 minutes of walking'], target: 12, xp: 700, gold: 250, stat: 'Vitality', points: 4, icon: '🌳' },
  { id: 'monthly-study', item: 'Runic staff', period: 'monthly', title: ['Dvanásť hodín rozvoja vedomostí', 'Twelve hours of learning'], step: ['Jedna hodina učenia', 'One hour of learning'], target: 12, xp: 800, gold: 300, stat: 'Intelligence', points: 4, icon: '🔮' },
  { id: 'monthly-project', item: 'War drum', period: 'monthly', title: ['Vlastný projekt v ôsmich krokoch', 'A personal project in eight steps'], step: ['Jeden dokončený míľnik (aspoň 45 minút práce)', 'One completed milestone (at least 45 minutes of work)'], target: 8, xp: 900, gold: 350, stat: 'Discipline', points: 4, icon: '🏰' },
];

export function questCount(progress: QuestProgress | undefined, quest: Quest, now = new Date()) {
  const entry = progress?.[quest.id];
  if (!entry) return 0;
  const reset = questResetAt(progress, quest);
  if (reset && now.getTime() >= reset.getTime()) return 0;
  return Math.min(quest.target, entry.count);
}

export function migrateQuestProgress(progress: QuestProgress | undefined, completed: string[], now = new Date()): QuestProgress {
  const entries: QuestProgress = progress || Object.fromEntries(scheduledQuests.filter(quest => completed.includes(quest.id)).map(quest => [quest.id, { period: periodKey(quest.period, now), count: quest.target }]));
  return Object.fromEntries(Object.entries(entries).map(([id, entry]) => {
    const quest = scheduledQuests.find(candidate => candidate.id === id);
    if (!quest || entry.completedAt !== undefined || entry.count < quest.target) return [id, entry];
    return [id, entry.period === periodKey(quest.period, now) ? { ...entry, completedAt: now.getTime() } : { ...entry, count: 0 }];
  }));
}

export function advanceQuest<Hero extends { questProgress?: QuestProgress; xp: number; level: number; gold: number; stats: Record<QuestStat, number>; inventory: string[] }>(hero: Hero, id: string, now = new Date()): Hero {
  const quest = scheduledQuests.find(entry => entry.id === id);
  if (!quest) return hero;
  const count = questCount(hero.questProgress, quest, now);
  if (count >= quest.target) return hero;
  const finished = count + 1 === quest.target;
  const { xp, level } = awardXp(hero.xp, hero.level, finished ? quest.xp : 0);
  return { ...hero, inventory: finished && quest.item ? [...hero.inventory, quest.item] : hero.inventory, xp, level, gold: hero.gold + (finished ? quest.gold : 0), stats: finished ? { ...hero.stats, [quest.stat]: hero.stats[quest.stat] + quest.points } : hero.stats, questProgress: { ...hero.questProgress, [id]: { period: periodKey(quest.period, now), count: count + 1, ...(finished ? { loot: quest.item || null, completedAt: now.getTime() } : {}) } } };
}
