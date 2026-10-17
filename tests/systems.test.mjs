import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { stripTypeScriptTypes } from 'node:module';

const cache = new Map();
function moduleUrl(file) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file);
  const source = stripTypeScriptTypes(fs.readFileSync(file, 'utf8')).replace(/from '([^']+)'/g, (match, reference) => reference.startsWith('.') ? 'from ' + JSON.stringify(moduleUrl(path.resolve(path.dirname(file), reference + '.ts'))) : match);
  const url = 'data:text/javascript;base64,' + Buffer.from(source).toString('base64');
  cache.set(file, url);
  return url;
}
const systems = await import(moduleUrl('src/data/playerSystems.ts'));
const training = await import(moduleUrl('src/data/questSchedule.ts'));
const { startBattle, battleTurn } = await import(moduleUrl('src/data/battle.ts'));
const { encounters, encounterAreas } = await import(moduleUrl('src/data/encounters.ts'));
const { itemData, rollLoot } = await import(moduleUrl('src/data/loot.ts'));
const city = await import(moduleUrl('src/data/city.ts'));
const { awardXp } = await import(moduleUrl('src/data/progression.ts'));
const { mountEnergyCost } = await import(moduleUrl('src/data/mounts.ts'));
const { equipItem, unequipItem } = await import(moduleUrl('src/data/equipment.ts'));
const { enemyFrames, sceneFrames, iconFrames, expansionScenes, expansionEnemies, reinforcementEnemies, reinforcementExtraEnemies } = await import(moduleUrl('src/data/art.ts'));
const now = 1800000000000;
const access = await import(moduleUrl('src/data/access.ts'));
const { dungeonArea } = await import(moduleUrl('src/data/dungeons.ts'));
const fresh = () => systems.normalizePlayer({ hp: 36, stats: { Strength: 2, Intelligence: 2, Discipline: 2, Vitality: 2 }, equipped: [], inventory: [], effects: [], xp: 0, level: 1, gold: 25 }, now);

test('stylesheet and catalog artwork references exist after asset cleanup', () => {
  for (const file of fs.readdirSync('src').filter(file=>file.endsWith('.css'))) {
    const css = fs.readFileSync('src/'+file,'utf8');
    for (const match of css.matchAll(/url\(['"]?(\/assets\/[^)'"]+)/g)) assert(fs.existsSync('public'+match[1]),file+': '+match[1]);
  }
  for (const item of Object.values(itemData)) if(item.art) assert(fs.existsSync('public/assets/items/'+item.art+'.png'),item.art);
});

test('inventory limits, overflow preservation, and safe claims', () => {
  const hero = systems.normalizePlayer({ ...fresh(), inventory: Array(51).fill('Rusty charm') }, now);
  assert.equal(hero.inventory.length, 50);
  assert.equal(hero.rewardChest.length, 1);
  assert.strictEqual(systems.claimReward(hero, 0), hero);
  const claimed = systems.claimReward({ ...hero, inventory: hero.inventory.slice(1) }, 0);
  assert.equal(claimed.inventory.length, 50);
  assert.equal(claimed.rewardChest.length, 0);
  assert.deepEqual(systems.normalizePlayer(hero, now).rewardChest, hero.rewardChest);
});
test('weight cap applies before slot cap and migrated items are not lost', () => {
  const hero = systems.normalizePlayer({ ...fresh(), inventory: Array(20).fill('Iron helm') }, now);
  assert(systems.inventoryWeight(hero.inventory) <= systems.derivedStats(hero).capacity);
  assert.equal(hero.inventory.length + hero.rewardChest.length, 20);
});
test('each attribute has measurable derived effects', () => {
  const hero = fresh(), base = systems.derivedStats(hero);
  const strength = systems.derivedStats({ ...hero, stats: { ...hero.stats, Strength: 10 } });
  const intelligence = systems.derivedStats({ ...hero, stats: { ...hero.stats, Intelligence: 10 } });
  const discipline = systems.derivedStats({ ...hero, stats: { ...hero.stats, Discipline: 10 } });
  const vitality = systems.derivedStats({ ...hero, stats: { ...hero.stats, Vitality: 10 } });
  assert(strength.physical > base.physical && strength.capacity > base.capacity);
  assert(intelligence.magical > base.magical && intelligence.buffPower > base.buffPower);
  assert(discipline.armor > base.armor && discipline.resistance > base.resistance);
  assert(vitality.maxHp > base.maxHp && vitality.maxEnergy > base.maxEnergy && vitality.maxStamina > base.maxStamina);
});
test('gear bonuses apply once and invalid equipment is removed', () => {
  const hero = { ...fresh(), equipment: undefined, stats: { ...fresh().stats, Intelligence: 5 }, inventory: ['Runic staff'], equipped: ['Runic staff', 'Runic staff'] };
  const derived = systems.derivedStats(systems.normalizePlayer(hero, now));
  assert.equal(derived.stats.Intelligence, 8);
  assert.equal(systems.normalizePlayer(hero, now).equipped.length, 1);
  assert.equal(systems.normalizePlayer({ ...hero, stats: fresh().stats }, now).equipped.length, 0);
});
test('energy regeneration, offline elapsed time, full cap, and no time banking', () => {
  const hero = { ...fresh(), energy: 0, energyUpdatedAt: now };
  assert.equal(systems.refreshEnergy(hero, now + 180000).energy, 1);
  assert.equal(systems.refreshEnergy({ ...hero, energyResting: true }, now + 180000).energy, 6);
  const full = systems.refreshEnergy(hero, now + 86400000);
  assert.equal(full.energy, systems.derivedStats(hero).maxEnergy);
  assert.equal(full.energyUpdatedAt, now + 86400000);
  assert.equal(systems.spendEnergy({ ...hero, energy: 1 }, 2, now), null);
  assert.equal(systems.spendEnergy({ ...hero, energy: 10, energyResting: true }, 2, now), null);
  assert.equal(systems.refreshEnergy(hero, now - 1000).energy, 0);
});
test('training consumes energy and rewards only on final step', () => {
  for (const quest of training.scheduledQuests) {
    let hero = fresh();
    for (let count = 0; count < quest.target; count++) {
      const paid = systems.spendEnergy(hero, systems.ENERGY_RULES.training[quest.period], now);
      assert(paid);
      hero = systems.normalizePlayer(training.advanceQuest(paid, quest.id, new Date(now)), now);
      assert.equal(hero.gold, count + 1 === quest.target ? 25 + quest.gold : 25);
    }
    assert.equal(hero.energy, fresh().energy - quest.target * systems.ENERGY_RULES.training[quest.period]);
    assert.strictEqual(training.advanceQuest(hero, quest.id, new Date(now)), hero);
    assert.equal(hero.inventory.length + hero.rewardChest.length, quest.item ? 1 : 0);
  }
});
test('a full bag does not destroy a guaranteed training item', () => {
  const quest = training.scheduledQuests.find(entry => entry.item);
  let hero = systems.normalizePlayer({ ...fresh(), inventory: Array(50).fill('Rusty charm') }, now);
  for (let index = 0; index < quest.target; index++) hero = systems.normalizePlayer(training.advanceQuest(hero, quest.id, new Date(now)), now);
  assert.equal(hero.inventory.length, 50);
  assert.deepEqual(hero.rewardChest, [quest.item]);
});
test('daily, weekly, monthly cooldown boundaries and short months', () => {
  for (const quest of training.scheduledQuests) {
    let hero = fresh();
    for (let index = 0; index < quest.target; index++) hero = training.advanceQuest(hero, quest.id, new Date(now));
    const reset = training.questResetAt(hero.questProgress, quest);
    assert.equal(training.questCount(hero.questProgress, quest, new Date(reset - 1)), quest.target);
    assert.equal(training.questCount(hero.questProgress, quest, reset), 0);
  }
  assert.equal(training.nextReset('monthly', new Date(2026, 0, 31)).getDate(), 28);
});
test('physical and magic attacks scale separately; armor reduces damage', () => {
  const enemy = encounters.find(entry => entry.kind === 'boss');
  const hero = fresh(), battle = startBattle(enemy);
  const strong = { ...hero, stats: { ...hero.stats, Strength: 10 } };
  const smart = { ...hero, stats: { ...hero.stats, Intelligence: 10 } };
  assert(battleTurn(battle, strong, 'attack', 0, 0).battle.hp < battleTurn(battle, hero, 'attack', 0, 0).battle.hp);
  assert(battleTurn(battle, smart, 'magic', 0, 0).battle.hp < battleTurn(battle, hero, 'magic', 0, 0).battle.hp);
  assert(battleTurn(battle, { ...hero, stats: { ...hero.stats, Discipline: 20 } }, 'guard', 0, 0).hp > battleTurn(battle, hero, 'guard', 0, 0).hp);
});
test('stamina gates attacks and recovery restores it; focus grants a buff', () => {
  const hero = fresh(), enemy = encounters[0], battle = { ...startBattle(enemy), stamina: 0 };
  assert.strictEqual(battleTurn(battle, hero, 'magic', 0, 0).battle, battle);
  assert.equal(battleTurn(battle, hero, 'recover', 0, 0).battle.stamina, 8);
  assert.equal(battleTurn(startBattle(enemy), hero, 'focus', 0, 0).battle.focus, 3);
});
test('guard blocks new harmful effects and resistance reduces ongoing damage', () => {
  for (const mechanic of ['poison', 'burn', 'frost']) {
    const enemy = encounters.find(entry => entry.mechanic === mechanic);
    const battle = { ...startBattle(enemy), turn: 3 };
    assert.equal(battleTurn(battle, fresh(), 'guard', 0, 0).battle.effects.length, 0);
    assert.equal(battleTurn(battle, fresh(), 'attack', 0, 0).battle.effects.length, 1);
  }
});
test('enemy rarity caps, valid pools, boss-specific special, and final bosses', () => {
  for (const area of encounterAreas) assert.equal(area.enemies.at(-1).kind, 'boss');
  for (const enemy of encounters) {
    for (let index = 0; index < 10000; index++) {
      let calls = 0;
      const drop = rollLoot({ kind: enemy.kind, id: enemy.name }, () => calls++ === 0 ? (index + .5) / 10000 : 0);
      if (!drop) continue;
      assert(enemy.drops.includes(drop));
      if (enemy.kind === 'normal') assert(!['Epic', 'Legendary', 'Special'].includes(itemData[drop].rarity));
      if (enemy.kind === 'elite') assert(!['Legendary', 'Special'].includes(itemData[drop].rarity));
      if (itemData[drop].rarity === 'Special') assert.equal(enemy.name, itemData[drop].boss);
    }
  }
});
test('save round trip retains energy, overflow, training and battle', () => {
  const hero = { ...fresh(), battle: startBattle(encounters[0]), rewardChest: ['Iron helm'] };
  const restored = systems.normalizePlayer(JSON.parse(JSON.stringify(hero)), now);
  assert.equal(restored.energy, hero.energy);
  assert.deepEqual(restored.battle, hero.battle);
  assert.deepEqual(restored.rewardChest, hero.rewardChest);
});

test('finished battles cannot be advanced again and damage over time can defeat', () => {
  const hero = fresh(), battle = { ...startBattle(encounters[0]), hp: 1 };
  const result = battleTurn(battle, hero, 'attack', 0, 0);
  assert.equal(result.battle.ended, 'win');
  assert.strictEqual(battleTurn(result.battle, hero, 'attack', 0, 0).battle, result.battle);
  const poisoned = { ...battle, hp: 24, effects: [{ kind: 'poison', power: 3, turns: 2 }] };
  assert.equal(battleTurn(poisoned, { ...hero, hp: 1 }, 'recover', 0, 0).battle.ended, 'loss');
});

test('equipped vitality changes the shared HP cap and unknown items have safe weights', () => {
  const hero = { ...fresh(), equipment: undefined, hp: 100, stats: { ...fresh().stats, Strength: 3 }, inventory: ['Iron helm'], equipped: ['Iron helm'] };
  const normalized = systems.normalizePlayer(hero, now);
  assert.equal(normalized.hp, systems.derivedStats(normalized).maxHp);
  assert.equal(normalized.hp, 42);
  const removed = systems.normalizePlayer(unequipItem(normalized, normalized.equipment[0].instanceId), now);
  assert.equal(removed.hp, 36);
  assert.equal(systems.itemWeight('old-unrecognized-item'), 1);
});

test('merchant stock is stable during six hours and rotates afterward', () => {
  const boundary = Math.floor(now / city.SHOP_INTERVAL) * city.SHOP_INTERVAL;
  for (const merchant of ['nira','armorer','weaponsmith','vela']) {
    assert.deepEqual(city.stock(merchant,100,boundary),city.stock(merchant,100,boundary+city.SHOP_INTERVAL-1));
    assert.notDeepEqual(city.stock(merchant,100,boundary),city.stock(merchant,100,boundary+city.SHOP_INTERVAL));
    assert.equal(new Set(city.stock(merchant,100,boundary)).size,city.stock(merchant,100,boundary).length);
  }
});
test('purchases are atomic, sold stock persists, no buying arbitrary or full-bag items', () => {
  const hero = {...fresh(),name:'Tester',gold:10000};
  const id = city.stock('nira',hero.level,now)[0];
  const bought = city.purchase(hero,'nira',id,now);
  assert.equal(bought.gold,hero.gold-city.itemPrice(id));
  assert.deepEqual(bought.inventory,[id]);
  assert.strictEqual(city.purchase(bought,'nira',id,now),bought);
  const restored=JSON.parse(JSON.stringify(bought));
  assert.strictEqual(city.purchase(restored,'nira',id,now),restored);
  assert.strictEqual(city.purchase(hero,'nira','Emberlord blade',now),hero);
  const full={...hero,inventory:Array(50).fill('Rusty charm')};
  assert.strictEqual(city.purchase(full,'nira',id,now),full);
  const poor={...hero,gold:0};assert.strictEqual(city.purchase(poor,'nira',id,now),poor);
});
test('selling one copy at Nira does not sell equipped gear or mint duplicate gold', () => {
  const hero={...fresh(),name:'Tester',inventory:['Iron helm','Iron helm']};
  const sold=city.sellToNira(hero,0);assert.equal(sold.inventory.length,1);assert.equal(sold.gold,hero.gold+city.salePrice('Iron helm'));
  const equipped=systems.normalizePlayer(equipItem({...hero,stats:{...hero.stats,Strength:3}},0),now);
  const soldCopy=city.sellToNira(equipped,0);assert.equal(soldCopy.inventory.length,0);assert.deepEqual(soldCopy.equipment,equipped.equipment);assert.deepEqual(soldCopy.equipped,['Iron helm']);
  assert.strictEqual(city.sellToNira(soldCopy,0),soldCopy);
  assert.strictEqual(city.sellToNira(hero,99),hero);
  assert(city.salePrice('Iron helm')<city.itemPrice('Iron helm'));
});
test('ten potion tiers strictly increase in price/healing and require each tenth level', () => {
  const potions=Object.entries(itemData).filter(([id])=>id.startsWith('Healing potion '));
  assert.equal(potions.length,10);
  for(let index=0;index<potions.length;index++){
    const [id,item]=potions[index];assert.equal(item.level,index===0?1:index*10);
    if(index){assert(item.heal>potions[index-1][1].heal);assert(item.price>potions[index-1][1].price);}
    const hero={...fresh(),name:'Tester',level:Math.max(1,item.level-1),gold:10000};
    if(item.level>1)assert.strictEqual(city.purchase(hero,'vela',id,now),hero);
  }
  assert(city.stock('vela',1,now).includes('Healing potion 1'));
});
test('mounts enforce cost/level/ownership and reduce entry energy only', () => {
  const hero={...fresh(),name:'Tester',gold:10000};
  const bought=city.buyMount(hero,'mule');assert.equal(bought.gold,hero.gold-10000);assert.equal(bought.mount,'mule');
  const poor={...hero,gold:9999};assert.strictEqual(city.buyMount(poor,'mule'),poor);
  assert.strictEqual(city.buyMount(bought,'mule'),bought);
  assert.strictEqual(city.buyMount(hero,'stag'),hero);
  assert(mountEnergyCost(12,'horse')<12);assert.equal(mountEnergyCost(12),12);
});
test('guild creation is paid once; leadership caps and removal rights are enforced', () => {
  const hero={...fresh(),name:'Founder',gold:100000};
  const poor={...hero,gold:99999};assert.strictEqual(city.createGuild(poor,'Dawn Watch'),poor);
  const founded=city.createGuild(hero,'Dawn Watch');assert.equal(founded.gold,hero.gold-city.GUILD_FEE);assert.equal(founded.guild.members[0].role,'master');
  assert.strictEqual(city.createGuild(founded,'Another'),founded);
  let guild={...founded.guild,members:[...founded.guild.members,...Array.from({length:9},(_,index)=>({name:'Member'+index,role:'member'}))]};
  for(let index=0;index<3;index++)guild=city.setGuildRole(guild,'Founder','Member'+index,'trustee');
  assert.strictEqual(city.setGuildRole(guild,'Founder','Member3','trustee'),guild);
  for(let index=3;index<6;index++)guild=city.setGuildRole(guild,'Founder','Member'+index,'moderator');
  assert.strictEqual(city.setGuildRole(guild,'Founder','Member6','moderator'),guild);
  assert.strictEqual(city.setGuildRole(guild,'Member0','Member6','moderator'),guild);
  assert.strictEqual(city.removeGuildMember(guild,'Member0','Founder'),guild);
  assert.equal(city.removeGuildMember(guild,'Member3','Member6').members.length,guild.members.length-1);
  assert(city.canModerateGuild(guild,'Founder'));assert(!city.canModerateGuild(guild,'Member6'));
});
test('max level is 100 in rewards and migration', () => {
  assert.deepEqual(awardXp(0,99,9999999),{level:100,xp:0});
  assert.deepEqual(awardXp(0,100,9999),{level:100,xp:0});
  assert.equal(systems.normalizePlayer({...fresh(),level:150},now).level,100);
});

test('equipping one duplicate moves exactly one copy out of the backpack', () => {
  const hero={...fresh(),inventory:['Rusty charm','Rusty charm','Rusty charm']};
  const equipped=systems.normalizePlayer(equipItem(hero,1),now);
  assert.equal(equipped.inventory.length,2);assert.equal(equipped.equipment.length,1);
  assert.equal(equipped.equipped.length,1);assert.equal(systems.derivedStats(equipped).stats.Discipline,3);
  assert.equal(systems.carriedWeight(equipped),systems.inventoryWeight(hero.inventory));
  assert.equal(new Set(equipped.equipment.map(entry=>entry.instanceId)).size,1);
  const sold=city.sellToNira({...equipped,name:'Tester'},0);
  assert.equal(sold.inventory.length,1);assert.deepEqual(sold.equipment,equipped.equipment);
});
test('replacing and unequipping preserve exact item counts and slot identity', () => {
  let hero={...fresh(),stats:{...fresh().stats,Strength:3},inventory:['Iron helm','Iron helm']};
  hero=equipItem(hero,0,'Helma');const first=hero.equipment[0].instanceId;
  hero=equipItem(hero,0,'Helma');assert.equal(hero.inventory.length,1);assert.equal(hero.equipment.length,1);
  assert.notEqual(hero.equipment[0].instanceId,first);
  const removed=unequipItem(hero,hero.equipment[0].instanceId);
  assert.equal(removed.inventory.length,2);assert.equal(removed.equipment.length,0);
  assert.strictEqual(unequipItem(removed,first),removed);
});
test('identical rings occupy four independent slots and contribute four bonuses', () => {
  let hero={...fresh(),inventory:Array(5).fill('Copper ring')};
  for(let index=1;index<=4;index++)hero=systems.normalizePlayer(equipItem(hero,0,'Prsteň '+index),now);
  assert.equal(hero.inventory.length,1);assert.equal(hero.equipment.length,4);
  assert.equal(new Set(hero.equipment.map(entry=>entry.instanceId)).size,4);
  assert.equal(systems.derivedStats(hero).stats.Discipline,6);
  hero=unequipItem(hero,hero.equipment.find(entry=>entry.slot==='Prsteň 2').instanceId);
  assert.equal(hero.inventory.length,2);assert.equal(hero.equipment.length,3);
  assert(hero.equipment.some(entry=>entry.slot==='Prsteň 4'));
});
test('old saves migrate one copy and never duplicate equipped gear on reload', () => {
  const legacy={...fresh(),equipment:undefined,inventory:['Rusty charm','Rusty charm'],equipped:['Rusty charm']};
  const migrated=systems.normalizePlayer(legacy,now);
  assert.equal(migrated.inventory.length,1);assert.equal(migrated.equipment.length,1);
  const restored=systems.normalizePlayer(JSON.parse(JSON.stringify(migrated)),now);
  assert.deepEqual(restored.equipment,migrated.equipment);assert.deepEqual(restored.inventory,migrated.inventory);
});
test('unequip refuses a full bag and battle blocks equipment transfers', () => {
  const hero=equipItem({...fresh(),inventory:['Rusty charm']},0);
  const full={...hero,inventory:Array(50).fill('Rusty charm')};
  assert.strictEqual(unequipItem(full,hero.equipment[0].instanceId),full);
  const fighting={...hero,battle:startBattle(encounters[0]),inventory:['Rusty charm']};
  assert.strictEqual(equipItem(fighting,0),fighting);
  assert.strictEqual(unequipItem(fighting,hero.equipment[0].instanceId),fighting);
  assert.strictEqual(equipItem({...hero,inventory:['Rusty charm']},0,'Helma').equipment,hero.equipment);
});

test('mount is an equipped item: unequip returns one copy and disables energy discount', () => {
  const hero={...fresh(),name:'Rider',gold:10000};
  const bought=systems.normalizePlayer(city.buyMount(hero,'mule'),now);
  const mount=bought.equipment.find(entry=>entry.slot==='Mount');
  assert(mount);assert.equal(bought.mount,'mule');assert(!bought.inventory.includes('Mount mule'));
  const bag=systems.normalizePlayer(unequipItem(bought,mount.instanceId),now);
  assert.equal(bag.mount,null);assert.deepEqual(bag.inventory,['Mount mule']);
  assert.equal(mountEnergyCost(12,bag.mount),12);assert(mountEnergyCost(12,bought.mount)<12);
  const equipped=systems.normalizePlayer(equipItem(bag,0,'Mount'),now);
  assert.equal(equipped.mount,'mule');assert.equal(equipped.inventory.length,0);
});
test('legacy mounts migrate once, with active mount in gear and inactive mount in bag', () => {
  const legacy={...fresh(),mountEquipmentMigrated:undefined,ownedMounts:['mule','horse'],mount:'mule',level:10};
  const migrated=systems.normalizePlayer(legacy,now);
  assert.equal(migrated.equipment.filter(entry=>entry.slot==='Mount').length,1);
  assert.equal(migrated.mount,'mule');assert(migrated.inventory.includes('Mount horse'));
  const again=systems.normalizePlayer(JSON.parse(JSON.stringify(migrated)),now);
  assert.deepEqual(again.equipment,migrated.equipment);assert.deepEqual(again.inventory,migrated.inventory);
});
test('sold mount no longer grants its bonus and can be purchased again', () => {
  const bought=systems.normalizePlayer(city.buyMount({...fresh(),name:'Rider',gold:20000},'mule'),now);
  const bag=unequipItem(bought,bought.equipment.find(entry=>entry.slot==='Mount').instanceId);
  const sold=city.sellToNira(bag,0);assert.equal(sold.mount,null);assert(!city.ownsMount(sold,'mule'));
  assert.equal(city.buyMount(sold,'mule').mount,'mule');
});

test('art atlas covers every enemy and area without duplicate or invalid frames', () => {
  assert.equal(Object.keys(enemyFrames).length,36);
  assert.equal(new Set(Object.values(enemyFrames)).size,36);
  for(const enemy of encounters)assert(Number.isInteger(enemyFrames[enemy.name] ?? expansionEnemies[enemy.name] ?? reinforcementEnemies[enemy.name] ?? reinforcementExtraEnemies[enemy.name]),enemy.name);
  for(const area of encounterAreas)assert(Number.isInteger(sceneFrames[area.id] ?? expansionScenes[area.id]),area.id);
  for(const value of Object.values(enemyFrames))assert(value>=0&&value<36);
  for(const value of Object.values(sceneFrames))assert(value>=0&&value<9);
  for(const value of Object.values(iconFrames))assert(value>=0&&value<25);
  for(const value of [...Object.values(expansionScenes),...Object.values(expansionEnemies)])assert(value>=0&&value<9);
  assert.equal(new Set([...Object.values(expansionScenes),...Object.values(expansionEnemies)]).size,8);
  assert(fs.statSync('public/assets/art-v1/expansion-atlas.jpg').size>1000);
  assert.equal(Object.keys(reinforcementEnemies).length+Object.keys(reinforcementExtraEnemies).length,10);
  assert.equal(new Set(Object.values(reinforcementEnemies)).size,6);
  for(const value of Object.values(reinforcementEnemies))assert(value>=2&&value<8);
  for(const value of Object.values(reinforcementExtraEnemies))assert(value>=0&&value<4);
  assert(fs.statSync('public/assets/art-v1/reinforcements-atlas.jpg').size>1000);
  assert(fs.statSync('public/assets/art-v1/reinforcements-extra-atlas.jpg').size>1000);
  for(const file of ['world-atlas.jpg','enemies-atlas.jpg','icons-atlas.png'])assert(fs.statSync('public/assets/art-v1/'+file).size>1000);
});

test('areas unlock in order only after a real boss completion and persist on reload', async () => {
  const {isAreaUnlocked,completeArea} = await import(moduleUrl('src/data/adventureProgress.ts'));
  let hero = {...fresh()};
  assert(isAreaUnlocked(hero,encounterAreas[0].id));
  assert(!isAreaUnlocked(hero,'invalid'));
  for (const area of encounterAreas.slice(1)) assert(!isAreaUnlocked(hero,area.id));
  assert.strictEqual(completeArea(hero,encounterAreas[0].id,encounterAreas[0].enemies[0].name),hero);
  const later = encounterAreas[2];
  assert.strictEqual(completeArea(hero,later.id,later.enemies.at(-1).name),hero);
  assert(!isAreaUnlocked({clearedAreas:[encounterAreas[1].id]},encounterAreas[2].id));
  for (const [position,area] of encounterAreas.entries()) {
    assert(isAreaUnlocked(hero,area.id));
    hero = completeArea(hero,area.id,area.enemies.at(-1).name);
    assert(hero.clearedAreas.includes(area.id));
    assert.strictEqual(completeArea(hero,area.id,area.enemies.at(-1).name),hero);
    hero = JSON.parse(JSON.stringify(hero));
    if(position+1<encounterAreas.length)assert(isAreaUnlocked(hero,encounterAreas[position+1].id));
  }
  assert.equal(hero.clearedAreas.length,7);
});

test('every adventure has at least seven unique opponents and a final boss', () => {
  for (const area of encounterAreas) {
    assert(area.enemies.length >= 7,area.id);
    assert.equal(new Set(area.enemies.map(enemy=>enemy.name)).size,area.enemies.length);
    assert.equal(area.enemies.filter(enemy=>enemy.kind==='boss').length,1);
    assert.equal(area.enemies.at(-1).kind,'boss');
  }
  for (const area of encounterAreas.slice(-2)) {
    assert.equal(area.enemies.length,8);
    assert.equal(area.enemies.filter(enemy=>enemy.kind==='elite').length,3);
  }
});

test('access drops use independent exact 5% rolls and the correct boss source', () => {
  for (const kind of ['normal','elite']) {
    assert.equal(access.rollAccessDrop(kind,'adventure',()=>0),null);
    assert.equal(access.rollAccessDrop(kind,'dungeon',()=>0),null);
  }
  assert.equal(access.rollAccessDrop('boss','adventure',()=>.049999),access.DUNGEON_KEY);
  assert.equal(access.rollAccessDrop('boss','dungeon',()=>.049999),access.RAID_TOKEN);
  assert.equal(access.rollAccessDrop('boss','adventure',()=>.05),null);
  assert.equal(access.rollAccessDrop('boss','dungeon',()=>.999),null);
  for (const mode of ['adventure','dungeon']) {
    let drops = 0;
    for (let roll = 0; roll < 10000; roll++) if (access.rollAccessDrop('boss',mode,()=>roll/10000)) drops++;
    assert.equal(drops,500);
  }
});

test('dungeon admission consumes exactly one key and cannot be duplicated', () => {
  const hero = {...fresh(),inventory:[access.DUNGEON_KEY,access.DUNGEON_KEY,access.RAID_TOKEN]};
  const entered = access.enterDungeon(hero,now);
  assert.deepEqual(entered.inventory,[access.DUNGEON_KEY,access.RAID_TOKEN]);
  assert.deepEqual(entered.dungeonRun,{stage:0,complete:false});
  assert.strictEqual(access.enterDungeon(entered,now),entered);
  assert.equal(access.leaveDungeon(entered).inventory.length,2);
  assert.strictEqual(access.enterDungeon(fresh(),now).dungeonRun,undefined);
  for (const patch of [{hp:0},{restUntil:now+1000},{energyResting:true},{battle:{turn:1}}]) {
    const blocked = {...hero,...patch};
    assert.strictEqual(access.enterDungeon(blocked,now),blocked);
  }
});

test('dungeon progression persists, is sequential and cannot reward a room twice', () => {
  let run = {stage:0,complete:false};
  assert.strictEqual(access.advanceDungeon(run,2),run);
  run = access.advanceDungeon(run,0);
  assert.strictEqual(access.advanceDungeon(run,0),run);
  run = JSON.parse(JSON.stringify(run));
  run = access.advanceDungeon(run,1);
  run = access.advanceDungeon(run,2);
  assert.deepEqual(run,{stage:3,complete:true});
  assert.strictEqual(access.advanceDungeon(run,2),run);
  assert.equal(dungeonArea.enemies.length,3);
  assert.equal(dungeonArea.enemies.at(-1).kind,'boss');
  const fighting = {...fresh(),dungeonRun:{stage:0,complete:false},battle:{turn:1}};
  assert.strictEqual(access.leaveDungeon(fighting),fighting);
});

test('entry items cannot be sold or equipped and overflow rewards are preserved', () => {
  for (const id of [access.DUNGEON_KEY,access.RAID_TOKEN]) {
    const hero = {...fresh(),inventory:[id]};
    assert.strictEqual(city.sellToNira(hero,0),hero);
    assert.strictEqual(equipItem(hero,0),hero);
    assert.equal(systems.itemWeight(id),.1);
    const full = systems.normalizePlayer({...fresh(),inventory:[...Array(50).fill('Rusty charm'),id]},now);
    assert(full.rewardChest.includes(id));
    assert.equal(itemData[id].names.length,2);
    assert.equal(itemData[id].description.length,2);
    assert(fs.statSync('public/assets/items/'+itemData[id].art+'.png').size>1000);
  }
});

test('every town room has its own building illustration frame', async () => {
  const { buildingFrames } = await import(moduleUrl('src/data/art.ts'));
  assert.equal(Object.keys(buildingFrames).length,9);
  assert.equal(new Set(Object.values(buildingFrames)).size,9);
  assert(fs.statSync('public/assets/art-v1/buildings-atlas.jpg').size>1000);
});

test('a full dungeon run reaches the boss and awards only a raid seal access roll', () => {
  let hero = access.enterDungeon({...fresh(),inventory:[access.DUNGEON_KEY],hp:500,stats:{Strength:100,Intelligence:100,Discipline:100,Vitality:100}},now);
  for (const [stage,enemy] of dungeonArea.enemies.entries()) {
    let battle = startBattle(enemy,systems.derivedStats(hero).maxStamina);
    for (let turn = 0; !battle.ended && turn < 100; turn++) {
      const result = battleTurn(battle,hero,'attack',0,hero.stats.Vitality);
      battle = result.battle;
      hero = {...hero,hp:result.hp};
    }
    assert.equal(battle.ended,'win');
    hero = {...hero,dungeonRun:access.advanceDungeon(hero.dungeonRun,stage)};
    assert.equal(access.rollAccessDrop(enemy.kind,'dungeon',()=>0),stage===2 ? access.RAID_TOKEN : null);
  }
  assert.equal(hero.dungeonRun.complete,true);
  assert(!hero.inventory.includes(access.DUNGEON_KEY));
});
