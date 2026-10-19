type PowerItem = { rarity:string;slot:string;mountId?:string;access?:string;heal?:number };
export function itemPower(item?:PowerItem) {
  if(!item||item.mountId||item.access||item.heal||item.slot==='Spotrebné predmety')return null;
  const rank=item.rarity==='Special'?3:item.rarity==='Legendary'?2:item.rarity==='Epic'?1:0;
  if(!rank)return null;
  return {rank,damagePercent:rank*5,armor:rank,echoEvery:rank===1?4:3,echoPercent:rank===1?20:rank===2?35:50,leechPercent:rank===1?0:rank===2?5:8,skillMultiplier:rank===3?2:rank===2?1.6:0,cooldown:rank===3?5:6};
}
export function equippedPowers(items:(PowerItem|undefined)[]) {
  const powers=items.map(itemPower).filter(power=>power!==null);
  const strongest=powers.sort((first,second)=>second.rank-first.rank)[0]||null;
  return {strongest,armor:Math.min(12,powers.reduce((total,power)=>total+power.armor,0))};
}
