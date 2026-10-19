import { classId } from './classes';
import { itemData } from './loot';

export const isConsumable=(id:string)=>id==='Healing herb'||id==='War drum'||Boolean(itemData[id]?.heal);
export const supplyLimit=(className?:string)=>classId(className||'Bojovník')==='Alchymista'?5:3;
type Owner={inventory:string[];preparedConsumables?:string[];className?:string;level?:number;battle?:{ended?:string}|null};
export function prepareSupply<Hero extends Owner>(hero:Hero,index:number):Hero{
  const id=hero.inventory[index],supplies=hero.preparedConsumables||[];
  if(hero.battle&&!hero.battle.ended||!id||!isConsumable(id)||supplies.length>=supplyLimit(hero.className)||(hero.level||1)<(itemData[id]?.level||1))return hero;
  return {...hero,inventory:hero.inventory.filter((_,position)=>position!==index),preparedConsumables:[...supplies,id]};
}
export function removeSupply<Hero extends Owner>(hero:Hero,index:number):Hero{
  const id=hero.preparedConsumables?.[index];
  if(!id||hero.inventory.length>=50||hero.battle&&!hero.battle.ended)return hero;
  return {...hero,inventory:[...hero.inventory,id],preparedConsumables:hero.preparedConsumables!.filter((_,position)=>position!==index)};
}
export function inventoryCategory(id:string){
  if(isConsumable(id))return 'consumables';
  if(itemData[id]?.slot==='Zbraň')return 'weapons';
  if(['Helma','Brnenie','Shoulders','Rukavice','Plášť','Nohavice','Topánky'].includes(itemData[id]?.slot))return 'armor';
  return 'other';
}
