import { itemById } from '../data/items';
import { quests } from '../data/quests';

export function questReward(questId: string) {
  const quest = quests.find(entry => entry.id === questId);
  return quest?.rewardItemId ? itemById[quest.rewardItemId] : null;
}
