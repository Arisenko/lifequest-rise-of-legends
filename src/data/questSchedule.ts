import { awardXp } from './progression';
export type QuestPeriod = 'daily' | 'weekly' | 'monthly';
export type QuestStat = 'Strength' | 'Intelligence' | 'Discipline' | 'Vitality';
export type Quest = { id: string; period: QuestPeriod; title: [string, string]; step: [string, string]; target: number; xp: number; gold: number; stat: QuestStat; points: number; icon: string; item?: string };
export type QuestProgress = Record<string, { period: string; count: number; loot?: string | null; completedAt?: number; awardedXp?: number }>;

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
  { id: 'move', period: 'daily', title: ['Prejdi sa 10 minút', 'Take a 10-minute walk'], step: ['10 minút chôdze', '10 minutes of walking'], target: 1, xp: 60, gold: 20, stat: 'Vitality', points: 1, icon: '0' },
  { id: 'learn', period: 'daily', title: ['Nauč sa jednu novú vec', 'Learn one new thing'], step: ['Jedna nová vedomosť', 'One new thing learned'], target: 1, xp: 75, gold: 25, stat: 'Intelligence', points: 1, icon: '1' },
  { id: 'focus', period: 'daily', title: ['Dokonči dôležitú úlohu', 'Complete an important task'], step: ['Jedna dokončená úloha', 'One completed task'], target: 1, xp: 90, gold: 30, stat: 'Discipline', points: 1, icon: '2' },
  { id: 'weekly-training', item: 'Iron helm', period: 'weekly', title: ['Trikrát si zacvič', 'Exercise three times'], step: ['20 minút cvičenia podľa svojich možností', '20 minutes of exercise at your own pace'], target: 3, xp: 650, gold: 220, stat: 'Strength', points: 2, icon: '10' },
  { id: 'weekly-study', item: 'Rusty charm', period: 'weekly', title: ['Tri sústredené študijné bloky', 'Three focused study sessions'], step: ['30 minút učenia', '30 minutes of learning'], target: 3, xp: 750, gold: 250, stat: 'Intelligence', points: 2, icon: '11' },
  { id: 'weekly-focus', item: 'Guard boots', period: 'weekly', title: ['Dokonči päť dôležitých úloh', 'Complete five important tasks'], step: ['Jedna dokončená úloha', 'One completed task'], target: 5, xp: 850, gold: 300, stat: 'Discipline', points: 2, icon: '12' },
  { id: 'monthly-walk', item: 'Ember cloak', period: 'monthly', title: ['Dvanásť dlhších prechádzok', 'Twelve longer walks'], step: ['30 minút chôdze', '30 minutes of walking'], target: 12, xp: 2800, gold: 950, stat: 'Vitality', points: 4, icon: '20' },
  { id: 'monthly-study', item: 'Runic staff', period: 'monthly', title: ['Dvanásť hodín rozvoja vedomostí', 'Twelve hours of learning'], step: ['Jedna hodina učenia', 'One hour of learning'], target: 12, xp: 3200, gold: 1100, stat: 'Intelligence', points: 4, icon: '21' },
  { id: 'monthly-project', item: 'War drum', period: 'monthly', title: ['Vlastný projekt v ôsmich krokoch', 'A personal project in eight steps'], step: ['Jeden dokončený míľnik (aspoň 45 minút práce)', 'One completed milestone (at least 45 minutes of work)'], target: 8, xp: 3600, gold: 1250, stat: 'Discipline', points: 4, icon: '22' },
  {"id":"daily-strength","period":"daily","title":["Krátky silový tréning","Short strength session"],"step":["10 minút bezpečného cvičenia","10 minutes of safe exercise"],"target":1,"xp":90,"gold":32,"stat":"Strength","points":1,"icon":"3"},
  {"id":"daily-water","period":"daily","title":["Doplň zásoby vody","Refill your water supply"],"step":["Priprav si vodu na deň podľa svojich potrieb","Prepare water for your day according to your needs"],"target":1,"xp":60,"gold":20,"stat":"Vitality","points":1,"icon":"4"},
  {"id":"daily-stretch","period":"daily","title":["Rozhýb stuhnuté telo","Loosen up"],"step":["5 minút jemnej mobility","5 minutes of gentle mobility"],"target":1,"xp":70,"gold":24,"stat":"Vitality","points":1,"icon":"5"},
  {"id":"daily-tidy","period":"daily","title":["Uprac svoj pracovný kút","Tidy your workspace"],"step":["10 minút upratovania","10 minutes of tidying"],"target":1,"xp":80,"gold":28,"stat":"Discipline","points":1,"icon":"6"},
  {"id":"daily-journal","period":"daily","title":["Zápis do denníka","Write a journal entry"],"step":["Napíš krátku reflexiu dňa","Write a short reflection on your day"],"target":1,"xp":90,"gold":32,"stat":"Intelligence","points":1,"icon":"7"},
  {"id":"daily-rest","period":"daily","title":["Oddych bez obrazoviek","Screen-free rest"],"step":["15 minút pokojného oddychu","15 minutes of quiet rest"],"target":1,"xp":60,"gold":20,"stat":"Vitality","points":1,"icon":"8"},
  {"id":"daily-meal","period":"daily","title":["Priprav si vyvážené jedlo","Prepare a balanced meal"],"step":["Jedno jedlo podľa svojich potrieb","One meal suited to your needs"],"target":1,"xp":70,"gold":24,"stat":"Discipline","points":1,"icon":"9"},
  {"id":"weekly-walk","period":"weekly","title":["Objav tri nové chodníky","Discover three trails"],"step":["20 minút chôdze podľa svojich možností","20 minutes of walking at your own pace"],"target":3,"xp":750,"gold":260,"stat":"Vitality","points":2,"icon":"13","item":"Guard boots"},
  {"id":"weekly-cook","period":"weekly","title":["Domáca kuchyňa","Home cooking"],"step":["Priprav jedno domáce jedlo","Prepare one home-cooked meal"],"target":4,"xp":800,"gold":280,"stat":"Vitality","points":2,"icon":"14","item":"Healing herb"},
  {"id":"weekly-repair","period":"weekly","title":["Daj veciam druhý život","Give things a second life"],"step":["20 minút opravy alebo údržby","20 minutes of repairs or maintenance"],"target":3,"xp":750,"gold":260,"stat":"Strength","points":2,"icon":"15","item":"Iron helm"},
  {"id":"weekly-connect","period":"weekly","title":["Upevni priateľstvá","Strengthen friendships"],"step":["Venuj niekomu 20 minút nerušenej pozornosti","Give someone 20 minutes of undivided attention"],"target":3,"xp":750,"gold":260,"stat":"Intelligence","points":2,"icon":"16","item":"Rusty charm"},
  {"id":"weekly-plan","period":"weekly","title":["Týždeň s plánom","A week with a plan"],"step":["Naplánuj a zhodnoť jeden deň","Plan and review one day"],"target":5,"xp":850,"gold":300,"stat":"Discipline","points":2,"icon":"17","item":"Guard boots"},
  {"id":"weekly-garden","period":"weekly","title":["Starostlivosť o okolie","Care for your surroundings"],"step":["15 minút starostlivosti o rastliny alebo okolie","15 minutes caring for plants or your surroundings"],"target":3,"xp":750,"gold":260,"stat":"Strength","points":2,"icon":"18","item":"Healing herb"},
  {"id":"weekly-breathe","period":"weekly","title":["Ostrovy pokoja","Islands of calm"],"step":["10 minút pokojného oddychu bez obrazovky","10 minutes of quiet screen-free rest"],"target":5,"xp":850,"gold":300,"stat":"Vitality","points":2,"icon":"19","item":"Rusty charm"},
  {"id":"monthly-strength","period":"monthly","title":["Základy sily","Foundations of strength"],"step":["20 minút bezpečného cvičenia vo vlastnom tempe","20 minutes of safe exercise at your own pace"],"target":10,"xp":3400,"gold":1200,"stat":"Strength","points":4,"icon":"23","item":"Iron helm"},
  {"id":"monthly-journal","period":"monthly","title":["Kronikár vlastného života","Chronicle your life"],"step":["Jedna premyslená reflexia dňa","One thoughtful daily reflection"],"target":12,"xp":3600,"gold":1280,"stat":"Intelligence","points":4,"icon":"24","item":"Rusty charm"},
  {"id":"monthly-cook","period":"monthly","title":["Majster domácej kuchyne","Master of home cooking"],"step":["Priprav jedno vyvážené jedlo","Prepare one balanced meal"],"target":10,"xp":3400,"gold":1200,"stat":"Vitality","points":4,"icon":"25","item":"Healing herb"},
  {"id":"monthly-craft","period":"monthly","title":["Zručné ruky","Skilled hands"],"step":["30 minút tvorivej práce alebo remesla","30 minutes of creative work or crafting"],"target":8,"xp":3200,"gold":1120,"stat":"Strength","points":4,"icon":"26","item":"Guard boots"},
  {"id":"monthly-tidy","period":"monthly","title":["Poriadok v kráľovstve","Order in your realm"],"step":["20 minút triedenia alebo upratovania","20 minutes of sorting or tidying"],"target":10,"xp":3400,"gold":1200,"stat":"Discipline","points":4,"icon":"27","item":"Ember cloak"},
  {"id":"monthly-routine","period":"monthly","title":["Pokojný rytmus dňa","A calmer daily rhythm"],"step":["Dodrž vlastnú rozumnú večernú rutinu","Follow your own reasonable evening routine"],"target":12,"xp":3600,"gold":1280,"stat":"Discipline","points":4,"icon":"28","item":"War drum"},
  {"id":"monthly-nature","period":"monthly","title":["Spojenie s prírodou","Reconnect with nature"],"step":["20 minút vonku podľa svojich možností","20 minutes outdoors at your own pace"],"target":10,"xp":3400,"gold":1200,"stat":"Vitality","points":4,"icon":"29","item":"Ember cloak"},
];

export function questRewards(quest: Quest, level: number) {
  const safeLevel = Math.min(100, Math.max(1, Math.floor(Number.isFinite(level) ? level : 1)));
  return { xp: Math.round(quest.xp * safeLevel), gold: Math.round(quest.gold * (1 + (safeLevel - 1) * 0.18)), points: quest.points + Math.floor((safeLevel - 1) / 25) };
}

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
  const rewards = questRewards(quest, hero.level);
  const { xp, level } = awardXp(hero.xp, hero.level, finished ? rewards.xp : 0);
  return { ...hero, inventory: finished && quest.item ? [...hero.inventory, quest.item] : hero.inventory, xp, level, gold: hero.gold + (finished ? rewards.gold : 0), stats: finished ? { ...hero.stats, [quest.stat]: hero.stats[quest.stat] + rewards.points } : hero.stats, questProgress: { ...hero.questProgress, [id]: { period: periodKey(quest.period, now), count: count + 1, ...(finished ? { loot: quest.item || null, awardedXp: rewards.xp, completedAt: now.getTime() } : {}) } } };
}
