import { encounters } from './encounters';
import type { Encounter } from './encounters';

const stages = [
  { name: 'Bone sentry', hp: 60, damage: 6, reward: 80, gold: 35 },
  { name: 'Elite sentinel', hp: 110, damage: 9, reward: 160, gold: 70 },
  { name: 'Ravenmoor lord', hp: 240, damage: 14, reward: 600, gold: 250 },
];
export const dungeonArea = {
  id: 'dungeons',
  names: ['Katakomby Havranmoru', 'Ravenmoor Catacombs'] as [string, string],
  description: ['Tri strážené komnaty vedú k pánovi katakomb. Poraz ich postupne; kľúč sa spotrebúva pri vstupe, nie pri každom súboji.', 'Three guarded chambers lead to the catacomb lord. Defeat them in order; a key is consumed on entry, not for each battle.'] as [string, string],
  icon: '🗝️', level: 5, color: '#88649b',
  enemies: stages.map(stage => ({ ...encounters.find(enemy => enemy.name === stage.name)!, ...stage })) as Encounter[],
};
