import type { Stat } from '../types/game';
export const quests = [
  { id: 'move', title: 'Prejdi sa 10 minút', rewardXp: 20, rewardStat: 'Vitality' as Stat, rewardItemId: 'guard-boots', icon: '☀️' },
  { id: 'learn', title: 'Nauč sa jednu novú vec', rewardXp: 25, rewardStat: 'Intelligence' as Stat, rewardItemId: 'runic-staff', icon: '📜' },
  { id: 'focus', title: 'Dokonči dôležitú úlohu', rewardXp: 30, rewardStat: 'Discipline' as Stat, rewardItemId: 'war-drum', icon: '🕯️' },
];
