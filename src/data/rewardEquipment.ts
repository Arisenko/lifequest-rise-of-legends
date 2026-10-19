import { equipItem } from './equipment';
import { isConsumable, prepareSupply } from './consumables';
import type { Hero } from '../types/hero';

export function equipBattleReward(hero:Hero,index:number):Hero{
  const battle=hero.battle,reward=battle?.reward,id=reward?.items[index];
  if(battle?.ended!=='win'||!reward||!id||!Number.isInteger(index)||reward.equippedItems?.includes(index))return hero;
  const bagIndex=hero.inventory.lastIndexOf(id);
  const chestIndex=hero.rewardChest?.lastIndexOf(id)??-1;
  if(bagIndex<0&&chestIndex<0)return hero;
  const source=bagIndex>=0?hero:{...hero,inventory:[...hero.inventory,id],rewardChest:hero.rewardChest!.filter((_,position)=>position!==chestIndex)};
  const position=bagIndex>=0?bagIndex:source.inventory.length-1;
  const next=isConsumable(id)?prepareSupply(source,position):equipItem(source,position);
  if(next===source)return hero;
  return {...next,battle:{...battle,reward:{...reward,equippedItems:[...(reward.equippedItems||[]),index]}}};
}
