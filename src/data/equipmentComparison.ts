import { itemSlots } from './equipment';
import { itemData } from './loot';
import { derivedStats } from './playerSystems';
import type { Hero } from '../types/hero';

export function compareEquipment(hero:Hero,id:string){
  const slots=itemSlots(id,hero.className);
  if(!slots.length)return null;
  const equipment=hero.equipment||[],slot=slots.find(slot=>!equipment.some(entry=>entry.slot===slot))||slots[0];
  if(slot==='Zbraň 2'&&equipment.some(entry=>entry.slot==='Zbraň 1'&&itemData[entry.itemId]?.hands===2))return null;
  const replaced=equipment.filter(entry=>entry.slot===slot||itemData[id]?.hands===2&&entry.slot==='Zbraň 2'||slot==='Zbraň 2'&&entry.slot==='Zbraň 1'&&itemData[entry.itemId]?.hands===2);
  const before=derivedStats(hero),after=derivedStats({...hero,equipped:[...equipment.filter(entry=>!replaced.includes(entry)).map(entry=>entry.itemId),id]});
  return {slot,replaced,before,after};
}
