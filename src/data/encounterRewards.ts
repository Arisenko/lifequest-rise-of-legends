type RewardEnemy = { name:string; kind:'normal'|'elite'|'boss'; hp:number; damage:number; reward:number; gold:number };
export function balanceEncounterRewards<Enemy extends RewardEnemy>(enemies:Enemy[]) {
  const normal=enemies.filter(enemy=>enemy.kind==='normal');
  const baseline=Math.min(...(normal.length?normal:enemies).map(enemy=>enemy.hp*enemy.damage));
  const balanced=new Map<string,Enemy & {lootBonus:number;rewardBonus:number}>();
  let previousXp=0,previousGold=0;
  for(const kind of ['normal','elite','boss'] as const) {
    for(const enemy of enemies.filter(enemy=>enemy.kind===kind).sort((first,second)=>first.hp*first.damage-second.hp*second.damage)) {
      const tough=enemy.hp*enemy.damage>=baseline*1.5;
      const lootBonus=kind==='boss'?.25:kind==='elite'?.15:tough?.1:0;
      const rewardBonus=kind==='boss'?.5:kind==='elite'?.25:tough?.1:0;
      const reward=Math.max(Math.ceil(enemy.reward*(1+rewardBonus)),previousXp+1);
      const gold=Math.max(Math.ceil(enemy.gold*(1+rewardBonus)),previousGold+1);
      balanced.set(enemy.name,{...enemy,reward,gold,lootBonus,rewardBonus});
      previousXp=reward;
      previousGold=gold;
    }
  }
  return enemies.map(enemy=>balanced.get(enemy.name)!);
}
