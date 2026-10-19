import type { Hero } from '../types/hero';

import { equipItem, unequipItem } from '../data/equipment';

import { spendEnergy, ENERGY_RULES, derivedStats } from '../data/playerSystems';

import { itemData } from '../data/loot';

import { classId } from '../data/classes';

import { advanceQuest, scheduledQuests, questCount } from '../data/questSchedule';

export function playerActions(hero:Hero,setHero:(update:Hero|((hero:Hero)=>Hero))=>void,setNotice:(message:string)=>void,lang:'sk'|'en') {
const tr=(sk:string,en:string)=>lang==='sk'?sk:en;

const maxHp=(hero:Hero)=>derivedStats(hero).maxHp;

const complete=(id:string)=>setHero(h=>{if(h.battle&&!h.battle.ended)return h;
const quest=scheduledQuests.find(q=>q.id===id);
if(!quest||questCount(h.questProgress,quest)>=quest.target)return h;
const paid=spendEnergy(h,ENERGY_RULES.training[quest.period]);
return paid?advanceQuest(paid,id):h});
const toggleEquip=(index:number,slot?:string)=>setHero(h=>equipItem(h,index,slot));
const removeEquipment=(instanceId:string)=>{if(hero.inventory.length>=50){setNotice(tr('Batoh je plný. Najprv uvoľni slot.','The backpack is full. Free a slot first.'));
return}setHero(h=>unequipItem(h,instanceId))};
const consume=(item:string)=>setHero(h=>{if(h.battle&&!h.battle.ended||!h.inventory.includes(item)||!(['Healing herb','War drum'].includes(item)||itemData[item]?.heal))return h;
if(h.level<(itemData[item]?.level||1))return h;
const index=h.inventory.indexOf(item);
return {...h,inventory:h.inventory.filter((_,position)=>position!==index),hp:item==='Healing herb'||itemData[item]?.heal?Math.min(maxHp(h),h.hp+Math.ceil((itemData[item]?.heal||12)*derivedStats(h).potionHealing)):h.hp,effects:item==='War drum'?[...h.effects.filter(effect=>effect.name!=='Vojnový rytmus'),{name:'Vojnový rytmus',kind:'buff',turns:3,power:Math.ceil(derivedStats(h).buffPower*(classId(h.className)==='Alchymista'?1.5:1))}]:h.effects}});

return {complete,toggleEquip,removeEquipment,consume};

}
