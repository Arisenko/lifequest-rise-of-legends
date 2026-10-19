import { classes, classAllowsItem } from '../data/classes';
import { itemData } from '../data/loot';

export function ItemRestrictions({id,lang}:{id:string;lang:'sk'|'en'}) {
  const item=itemData[id],index=lang==='sk'?0:1;
  if(!item||!item.armorType&&!item.weaponType)return null;
  const allowed=Object.keys(classes).filter(name=>classAllowsItem(name,item)).map(name=>classes[name as keyof typeof classes].names[index]);
  const material=lang==='sk'?{cloth:'Látková výbava',leather:'Kožená výbava',plate:'Plátová výbava'}:{cloth:'Cloth equipment',leather:'Leather equipment',plate:'Plate equipment'};
  return <div className="item-restrictions">{item.armorType&&<p>{material[item.armorType]}</p>}<p>{lang==='sk'?'Povolania':'Classes'}: {allowed.join(' / ')}</p>{item.hands===2&&<p>{lang==='sk'?'Obojručná zbraň — obsadí obe ruky.':'Two-handed weapon — occupies both hands.'}</p>}{item.offhand&&<p>{lang==='sk'?'Iba vedľajšia ruka. Nemožno kombinovať s obojručnou zbraňou.':'Off hand only. Cannot combine with a two-handed weapon.'}</p>}</div>;
}
