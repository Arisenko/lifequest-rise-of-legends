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
const travel = await import(moduleUrl('src/data/travelEvents.ts'));

function travelHero(){return systems.normalizePlayer({hp:36,stats:{Strength:2,Intelligence:2,Discipline:2,Vitality:2},equipped:[],inventory:[],effects:[],xp:0,level:1,gold:25},1800000000000);}
test('travel events use a fixed saved roll and support adventure, dungeon and future raid modes',()=>{
  for(const mode of ['adventure','dungeon','raid']){
    assert.equal(travel.createTravelEvent(mode,'test',0,1,1,.35,.2),null);
    for(let index=0;index<6;index++){
      const event=travel.createTravelEvent(mode,'test',0,1,1,0,(index+.2)/6);
      assert.equal(event.kind,travel.travelEventKinds[index]);
      const hero={...travelHero(),pendingTravelEvent:event};
      const saved=JSON.parse(JSON.stringify(hero));
      assert.deepEqual(travel.resolveTravelEvent(hero,event.id,'explore'),travel.resolveTravelEvent(saved,event.id,'explore'));
      const skipped=travel.resolveTravelEvent(hero,event.id,'safe');
      assert.strictEqual(skipped,hero);
      const resolved=travel.resolveTravelEvent(hero,event.id,'explore');
      assert.equal(resolved.pendingTravelEvent,null);
      assert.strictEqual(travel.resolveTravelEvent(resolved,event.id,'explore'),resolved);
      assert.strictEqual(travel.resolveTravelEvent(hero,'wrong','explore'),hero);
    }
  }
});

test('travel healing is capped, failed traps cannot kill and history stays bounded',()=>{
  const event=travel.createTravelEvent('dungeon','test',0,1,1,0,2.2/6);
  const healed=travel.resolveTravelEvent({...travelHero(),pendingTravelEvent:event},event.id,'explore');
  assert(healed.hp<=systems.derivedStats(healed).maxHp);
  assert(healed.energy<=systems.derivedStats(healed).maxEnergy);
  let seed=0;
  while((seed*9973+.371)%1<.6)seed+=.00001;
  const trap={...event,kind:'trap',seed,level:100};
  const hero={...travelHero(),hp:1,pendingTravelEvent:trap,travelHistory:Array.from({length:20},()=>healed.travelHistory[0])};
  const failed=travel.resolveTravelEvent(hero,trap.id,'explore');
  assert.equal(failed.hp,1);assert.equal(failed.travelHistory.length,20);
  const busy={...hero,battle:{ended:undefined}};
  assert.strictEqual(travel.resolveTravelEvent(busy,trap.id,'explore'),busy);
});
const { startBattle, battleTurn } = await import(moduleUrl('src/data/battle.ts'));
const { encounters, encounterAreas } = await import(moduleUrl('src/data/encounters.ts'));
const { itemData, rollLoot, mountDrops, rarities, lootTable, rarityPower } = await import(moduleUrl('src/data/loot.ts'));
const city = await import(moduleUrl('src/data/city.ts'));

test('city treatment scales by level and cannot be charged twice or bypass combat/funds checks',()=>{
  for(const [level,price] of [[1,100],[2,200],[10,1000],[50,5000],[100,10000]])assert.equal(city.treatmentPrice(level),price);
  const hero={stats:{Strength:2,Intelligence:2,Discipline:2,Vitality:2},inventory:[],equipped:[],level:10,name:'Test',gold:1000,hp:1,effects:[{name:'Oslabenie',kind:'debuff',turns:3,power:2},{name:'Vojnový rytmus',kind:'buff',turns:3,power:2}],restUntil:2000};
  const healed=city.treatPlayer(hero,1000);
  assert.equal(healed.gold,0);
  assert.equal(healed.hp,systems.derivedStats(hero).maxHp);
  assert.equal(healed.restUntil,undefined);
  assert.deepEqual(healed.effects,[hero.effects[1]]);
  assert.equal(city.treatPlayer({...hero,gold:999},1000).gold,999);
  const fighting={...hero,battle:{ended:undefined}};
  assert.equal(city.treatPlayer(fighting,1000),fighting);
  const healthy={...healed,gold:10000};
  assert.equal(city.treatPlayer(healthy,1000),healthy);
  const weak={...hero,hp:systems.derivedStats(hero).maxHp,restUntil:undefined};
  assert.equal(city.treatPlayer(weak,1000).gold,0);
});
const { awardXp } = await import(moduleUrl('src/data/progression.ts'));
const { mountEnergyCost, mounts } = await import(moduleUrl('src/data/mounts.ts'));
const { equipItem, unequipItem } = await import(moduleUrl('src/data/equipment.ts'));
const { enemyFrames, sceneFrames, iconFrames, expansionScenes, expansionEnemies, reinforcementEnemies, reinforcementExtraEnemies } = await import(moduleUrl('src/data/art.ts'));
const {lateAreas,lateSceneFrames,lateEnemyFrames}=await import(moduleUrl('src/data/lateAdventures.ts'));
const now = 1800000000000;
const { chronicleSummary } = await import(moduleUrl('src/data/chronicle.ts'));
const { visibleEffects } = await import(moduleUrl('src/data/statusEffects.ts'));
const { cleanItems, cleanCityIcons } = await import(moduleUrl('src/data/cleanArt.ts'));
const { magicItems, arcaneStock } = await import(moduleUrl('src/data/magicItems.ts'));
const { dungeonSets, setItems, equippedSetBonuses } = await import(moduleUrl('src/data/dungeonSets.ts'));
const { dungeonItems, raidItems, raidRewardBosses } = await import(moduleUrl('src/data/dungeonItems.ts'));
const { classPortraits, classPortrait } = await import(moduleUrl('src/data/classPortraits.ts'));
const access = await import(moduleUrl('src/data/access.ts'));
const { dungeonArea, dungeons } = await import(moduleUrl('src/data/dungeons.ts'));
const fresh = () => systems.normalizePlayer({ hp: 36, stats: { Strength: 2, Intelligence: 2, Discipline: 2, Vitality: 2 }, equipped: [], inventory: [], effects: [], xp: 0, level: 1, gold: 25 }, now);

test('chronicle routes to the next unlocked area, saved battle or dungeon', () => {
  assert.equal(chronicleSummary({}).target.areaId,encounterAreas[0].id);
  assert.equal(chronicleSummary({clearedAreas:[encounterAreas[0].id]}).target.areaId,encounterAreas[1].id);
  assert.equal(chronicleSummary({battle:{}}).battle,true);
  assert.equal(chronicleSummary({battle:{ended:'win'}}).battle,false);
  assert.equal(chronicleSummary({dungeonRun:{complete:false},battle:{}}).target.tab,'dungeons');
  assert.equal(chronicleSummary({dungeonRun:{complete:true}}).target.tab,'dungeons');
  assert.equal(chronicleSummary({clearedAreas:encounterAreas.map(area=>area.id)}).allCleared,true);
});

test('status overview covers player buffs, combat debuffs and enemy-only buffs accurately', () => {
  const enemy = encounters.find(enemy=>enemy.kind==='boss');
  const battle = {...startBattle(enemy),hp:enemy.hp/2,focus:3,shield:2,effects:[
    {kind:'poison',turns:2,power:3},{kind:'burn',turns:1,power:4},{kind:'weakness',turns:3,power:4},
  ]};
  const hero = {...fresh(),battle,effects:[{name:'Vojnový rytmus',kind:'buff',turns:3,power:2},{name:'Oslabenie',kind:'debuff',turns:2,power:2}]};
  const result = visibleEffects(hero,now);
  assert.equal(result.player.length,6);
  assert.equal(result.enemy.length,2);
  assert(!result.player.some(effect=>effect.id.startsWith('enemy-')));
  assert.deepEqual(result.player.map(effect=>effect.icon),[0,1,2,3,4,5]);
  assert.deepEqual(result.enemy.map(effect=>effect.icon),[6,7]);
  for(const effect of [...result.player,...result.enemy]) {
    assert.equal(effect.name.length,2);
    assert.equal(effect.detail.length,2);
    assert(effect.detail.every(text=>text.length>0));
  }
  assert.equal(visibleEffects({...hero,battle:{...battle,ended:'win'}},now).player.length,2);
  assert.equal(visibleEffects({...hero,battle:{...battle,ended:'win'}},now).enemy.length,0);
});

test('expired statuses vanish and resting/recovery display the real remaining duration', () => {
  const hero = {...fresh(),energyResting:true,restUntil:now+1501,effects:[{name:'Vojnový rytmus',kind:'buff',turns:0,power:2}]};
  const result = visibleEffects(hero,now);
  assert.equal(result.player.find(effect=>effect.id==='injury').seconds,2);
  assert.equal(result.player.find(effect=>effect.id==='rest').icon,8);
  assert.equal(result.player.length,2);
  assert(!visibleEffects(hero,now+2000).player.some(effect=>effect.id==='injury'));
  assert.equal(visibleEffects({...fresh(),energyResting:false},now).player.length,0);
  for(const file of ['hero-chronicle.jpg','effects-atlas.jpg']) assert(fs.statSync('public/assets/art-v1/'+file).size>1000);
});

test('chronicle counts actual training rewards today, not all-time or future completions', () => {
  const date = new Date(2026,9,18,12,0);
  const start = new Date(2026,9,18).getTime();
  const questProgress = {
    move:{period:'test',count:1,completedAt:start,awardedXp:60},
    learn:{period:'test',count:1,completedAt:start-1},
    focus:{period:'test',count:1,completedAt:date.getTime()+1},
    'weekly-study':{period:'test',count:3,completedAt:date.getTime(),awardedXp:140},
  };
  const summary = chronicleSummary({questProgress},date);
  assert.equal(summary.completedToday,2);
  assert.equal(summary.trainingXpToday,200);
  assert.equal(chronicleSummary({questProgress},new Date(2026,9,19)).completedToday,0);
  assert.equal(chronicleSummary({}).completedToday,0);
});

test('stylesheet and catalog artwork references exist after asset cleanup', () => {
  for (const file of fs.readdirSync('src').filter(file=>file.endsWith('.css'))) {
    const css = fs.readFileSync('src/'+file,'utf8');
    for (const match of css.matchAll(/url\(['"]?(\/assets\/[^)'"]+)/g)) assert(fs.existsSync('public'+match[1]),file+': '+match[1]);
  }
  for (const item of Object.values(itemData)) if(item.art) assert(fs.existsSync('public/assets/items/'+(item.setArtBase||item.art)+'.png'),item.art);
});

test('each catalog item has a distinct artwork key and a backed base asset', () => {
  const catalog=Object.values(itemData).filter(item=>!item.routeTarget);
  const artwork=catalog.map(item=>item.art);
  assert(artwork.every(Boolean));
  assert.equal(new Set(artwork).size,artwork.length);
  for(const item of catalog) if(!cleanItems[item.art]) {
    const file='public/assets/items/'+(item.setArtBase||item.art)+'.png';
    assert(fs.statSync(file).size>1000,file);
  }
});

test('nine mounts enforce level and gold gates and only the active mount reduces energy', () => {
  assert.equal(mounts.length,9);
  assert.equal(new Set(mounts.map(mount=>mount.id)).size,9);
  for(const mount of mounts) {
    const hero={...fresh(),name:'Arin',level:mount.level,gold:mount.price};
    if(mount.source) {
      assert.strictEqual(city.buyMount(hero,mount.id),hero);
      const looted=equipItem({...hero,inventory:['Mount '+mount.id]},0,'Mount');
      assert.equal(looted.mount,mount.id);
      assert.equal(looted.gold,hero.gold);
      continue;
    }
    assert.equal(city.buyMount({...hero,level:mount.level-1},mount.id).mount,hero.mount);
    assert.equal(city.buyMount({...hero,gold:mount.price-1},mount.id).gold,mount.price-1);
    const bought=city.buyMount(hero,mount.id);
    assert.equal(bought.gold,0);
    assert.equal(bought.mount,mount.id);
    assert.equal(bought.equipment.filter(entry=>entry.itemId==='Mount '+mount.id).length,1);
    assert.equal(mountEnergyCost(100,mount.id),Math.ceil(100*(1-mount.discount)));
    assert(mount.discount>0&&mount.discount<=.4);
    assert.equal(city.buyMount({...bought,gold:mount.price},mount.id).gold,mount.price);
    const removed=unequipItem(bought,bought.equipment.find(entry=>entry.slot==='Mount').instanceId);
    assert.equal(mountEnergyCost(100,removed.mount),100);
  }
});

test('legendary mounts only drop in dungeons; special dragon is reserved for the first raid', () => {
  const source={kind:'boss',id:'Ravenmoor lord',mode:'dungeon'};
  const drops=mountDrops(source);
  assert.equal(drops.length,1);
  assert(drops.every(id=>itemData[id].rarity==='Legendary'));
  assert.equal(mountDrops({...source,mode:'adventure'}).length,0);
  assert.equal(mountDrops({...source,kind:'elite'}).length,0);
  assert.deepEqual(mountDrops({...source,id:'Emberlord'}),['Mount bear']);
  assert.deepEqual(mountDrops({kind:'boss',id:'Ashen Tyrant',mode:'raid'}),['Mount drake']);
  assert.equal(itemData['Mount drake'].rarity,'Special');
  const rolls=[.999999,0];
  assert.equal(rollLoot(source,()=>rolls.shift()??0),null);
  const prior=lootTable(source).filter(tier=>!['Legendary','Special'].includes(tier.rarity)).reduce((sum,tier)=>sum+tier.chance,0);
  const legendaryRolls=[prior+.001,.999];
  assert(drops.includes(rollLoot(source,()=>legendaryRolls.shift()??0)));
});

test('clean item and town artwork regions are valid, separate and backed by files', () => {
  assert.equal(Object.keys(cleanItems).length,16);
  assert.equal(Object.keys(cleanCityIcons).length,9);
  for (const regions of [Object.values(cleanItems),Object.values(cleanCityIcons)]) {
    for (const [left,top,width,height] of regions) {
      assert(left>=0&&top>=0&&width>0&&height>0);
      assert(left+width<=1254&&top+height<=1254);
    }
    for(let first=0;first<regions.length;first++)for(let second=first+1;second<regions.length;second++) {
      const [left,top,width,height]=regions[first];
      const [otherLeft,otherTop,otherWidth,otherHeight]=regions[second];
      assert(left+width<=otherLeft||otherLeft+otherWidth<=left||top+height<=otherTop||otherTop+otherHeight<=top);
    }
  }
  for(const file of ['items-clean-v2.png','city-icons-clean-v2.png','gold-clean-v2.png'])assert(fs.statSync('public/assets/art-v1/'+file).size>1000);
  assert(!fs.readFileSync('src/components/City.tsx','utf8').includes('🪙'));
});

test('arcane shop rotates every six hours, gates levels and separates magical weapons', () => {
  assert.equal(Object.keys(magicItems).length,9);
  const offers=city.stock('arcane',1,now);
  assert.equal(offers.length,3);
  assert(offers.every(id=>arcaneStock.includes(id)&&(itemData[id].level||1)<=1));
  assert.deepEqual(city.stock('arcane',1,now+1),offers);
  assert.notDeepEqual(city.stock('arcane',1,now+city.SHOP_INTERVAL),offers);
  for(let period=0;period<arcaneStock.length;period++) {
    assert(city.stock('weaponsmith',100,period*city.SHOP_INTERVAL).every(id=>!arcaneStock.includes(id)));
  }
  const id=offers[0],hero={...fresh(),name:'Arin',level:1,gold:1000};
  const bought=city.purchase(hero,'arcane',id,now);
  assert.deepEqual(bought.inventory,[id]);
  assert.equal(bought.gold,hero.gold-city.itemPrice(id));
  assert.strictEqual(city.purchase(bought,'arcane',id,now),bought);
  assert.strictEqual(city.purchase(hero,'arcane','Catalyst rod',now),hero);
  assert.strictEqual(city.purchase({...hero,battle:{}},'arcane',id,now).inventory,hero.inventory);
});

test('cloth and alchemical equipment fits existing slots, weighs less and applies real bonuses', () => {
  assert.equal(Object.values(magicItems).filter(item=>item.armorType==='cloth').length,7);
  for(const [id,item] of Object.entries(magicItems)) {
    assert.equal(item.names.length,2);
    assert(item.description.every(text=>text.length>0));
    assert.equal(systems.itemWeight(id),item.weight);
    const hero={...fresh(),level:100,stats:{Strength:2,Intelligence:20,Discipline:20,Vitality:2},inventory:[id]};
    const equipped=equipItem(hero,0);
    assert(equipped.equipped.includes(id),id);
    assert.equal(equipped.inventory.length,0);
    for(const [stat,bonus] of Object.entries(itemData[id].bonus)) assert.equal(systems.derivedStats(equipped).stats[stat],hero.stats[stat]+bonus);
    assert.strictEqual(equipItem({...hero,stats:{Strength:0,Intelligence:0,Discipline:0,Vitality:0}},0).inventory,hero.inventory);
    if(item.level>1)assert.strictEqual(equipItem({...hero,level:1},0).inventory,hero.inventory);
  }
});

test('each playable class has a unique inventory illustration and unknown classes have a safe fallback', () => {
  assert.deepEqual(Object.keys(classPortraits),['Bojovník','Paladin','Mág','Alchymista','Lovec','Assassín']);
  assert.equal(new Set(Object.values(classPortraits).map(portrait=>portrait.file)).size,6);
  for(const [id,portrait] of Object.entries(classPortraits)) {
    assert.equal(classPortrait(id),portrait);
    assert.equal(portrait.names.length,2);
    assert(fs.statSync('public/assets/characters/classes/'+portrait.file+'.png').size>1000);
  }
  assert.equal(classPortrait('future-class'),classPortraits.Bojovník);
  assert(!fs.readFileSync('src/components/CharacterScreen.tsx','utf8').includes('character-head'));
});

test('difficulty bonuses respect rarity caps, exact top-tier rates and no-drop outcomes', () => {
  for(const enemy of [...encounters,...dungeonArea.enemies]) {
    const mode=dungeonArea.enemies.includes(enemy)?'dungeon':'adventure';
    const source={kind:enemy.kind,id:enemy.name,mode};
    const table=lootTable(source);
    assert(table.reduce((sum,tier)=>sum+tier.chance,0)<1);
    let boundary=0;
    for(const tier of table) {
      if(!tier.candidates.length) {assert.equal(tier.chance,0);continue;}
      const top=['Legendary','Special'].includes(tier.rarity);
      assert.equal(tier.chance,rarities[tier.rarity].chance*(top?1:1+enemy.lootBonus));
      if(top)assert.equal(enemy.kind,'boss');
      if(tier.rarity==='Epic')assert.notEqual(enemy.kind,'normal');
      for(const id of tier.candidates) {
        assert.equal(itemData[id].rarity,tier.rarity);
        if(itemData[id].boss)assert.equal(itemData[id].boss,enemy.name);
      }
      const rolls=[boundary+tier.chance/2,0];
      assert.equal(rollLoot(source,()=>rolls.shift()??0),tier.candidates[0]);
      boundary+=tier.chance;
    }
    assert.equal(rollLoot(source,()=>.999999),null);
  }
  assert(lootTable({kind:'boss',id:'unknown'}).every(tier=>tier.chance===0));
});

test('stronger opponents grant increasing XP and gold, and magic gear participates in loot', () => {
  for(const enemies of [...encounterAreas.map(area=>area.enemies),dungeonArea.enemies]) {
    let previousXp=0,previousGold=0;
    for(const kind of ['normal','elite','boss']) {
      for(const enemy of enemies.filter(enemy=>enemy.kind===kind).sort((first,second)=>first.hp*first.damage-second.hp*second.damage)) {
        assert(enemy.reward>previousXp);
        assert(enemy.gold>previousGold);
        if(kind==='elite')assert.equal(enemy.lootBonus,.15);
        if(kind==='boss')assert.equal(enemy.lootBonus,.25);
        if(kind==='normal')assert([0,.1].includes(enemy.lootBonus));
        previousXp=enemy.reward;previousGold=enemy.gold;
      }
    }
  }
  for(const id of Object.keys(magicItems))assert(encounters.some(enemy=>lootTable({kind:enemy.kind,id:enemy.name}).some(tier=>tier.candidates.includes(id))),id);
});

test('legendary and special mount bonuses apply only while equipped and energy rounds correctly', () => {
  const base={...fresh(),level:100};
  const baseline=systems.derivedStats(base);
  for(const mount of mounts.filter(mount=>mount.source)) {
    const id='Mount '+mount.id;
    assert.equal(mount.discount,mount.source==='raid'?.7:.5);
    assert.equal(mountEnergyCost(100,mount.id),mount.source==='raid'?30:50);
    assert.deepEqual(systems.derivedStats({...base,inventory:[id]}),baseline);
    const equipped=equipItem({...base,inventory:[id]},0,'Mount');
    const values=systems.derivedStats(equipped);
    for(const [stat,bonus] of Object.entries(mount.bonus)) assert.equal(values.stats[stat],base.stats[stat]+bonus);
    if(mount.perks.capacity)assert.equal(values.capacity,baseline.capacity+mount.perks.capacity);
    if(mount.perks.stamina)assert.equal(values.maxStamina,20+values.stats.Vitality*2+mount.perks.stamina);
    if(mount.perks.energy)assert.equal(values.maxEnergy,60+values.stats.Vitality*5+mount.perks.energy);
    if(mount.perks.armor)assert.equal(values.armor,Math.min(20,Math.floor(values.stats.Discipline/2))+mount.perks.armor);
    const interval=180000/values.energyRegeneration;
    const recovered=systems.refreshEnergy({...equipped,energy:0,energyUpdatedAt:now},now+interval);
    assert.equal(recovered.energy,1);
    const removed=unequipItem(equipped,equipped.equipment.find(entry=>entry.slot==='Mount').instanceId);
    assert.deepEqual(systems.derivedStats(removed),baseline);
  }
});

test('dragonblood prevents burn damage over time but not poison or direct attacks', () => {
  const hero=equipItem({...fresh(),level:100,inventory:['Mount drake']},0,'Mount');
  assert.equal(systems.derivedStats(hero).burnImmune,true);
  const battle={...startBattle(encounters[0]),turn:1};
  const none=battleTurn(battle,hero,'guard',0,0);
  const burn=battleTurn({...battle,effects:[{kind:'burn',power:5,turns:3}]},hero,'guard',0,0);
  const poison=battleTurn({...battle,effects:[{kind:'poison',power:5,turns:3}]},hero,'guard',0,0);
  assert.equal(burn.hp,none.hp);
  assert(poison.hp<none.hp);
  assert(none.hp<hero.hp);
});

test('five dungeons isolate their own mount, complete armor sets and key-paid saved progression', () => {
  assert.equal(dungeons.length,5);
  const mountIds=[];
  for(const dungeon of dungeons) {
    const boss=dungeon.enemies.at(-1),source={kind:'boss',id:boss.name,mode:'dungeon',dungeonId:dungeon.id};
    const drops=lootTable(source).flatMap(tier=>tier.candidates);
    const mount=mountDrops(source);
    assert.deepEqual(mount,['Mount '+dungeon.mount]);
    mountIds.push(...mount);
    for(const id of dungeon.exclusiveDrops)assert(drops.includes(id),id);
    for(const other of dungeons.filter(other=>other!==dungeon)) for(const id of other.exclusiveDrops)assert(!drops.includes(id),id);
    assert(drops.some(id=>itemData[id].rarity==='Common'));
    const hero={...fresh(),level:dungeon.level,inventory:[access.DUNGEON_KEY]};
    assert.strictEqual(access.enterDungeon({...hero,level:dungeon.level-1},now,dungeon.id).inventory,hero.inventory);
    const entered=access.enterDungeon(hero,now,dungeon.id);
    assert.equal(entered.inventory.length,0);
    assert.strictEqual(access.enterDungeon(entered,now,dungeon.id),entered);
    let run=JSON.parse(JSON.stringify(entered.dungeonRun));
    assert.equal(run.dungeonId||'dungeons',dungeon.id);
    for(let stage=0;stage<3;stage++)run=access.advanceDungeon(run,stage);
    assert(run.complete);
    assert.equal(run.dungeonId||'dungeons',dungeon.id);
  }
  assert.equal(new Set(mountIds).size,5);
  assert.equal(mountDrops({kind:'boss',id:'Ravenmoor lord',mode:'dungeon',dungeonId:'skyspire'}).length,0);
});

test('raid shares dungeon equipment with higher epic/legendary chances, and owns all special loot', () => {
  for(const enemy of encounters) {
    const drops=lootTable({kind:enemy.kind,id:enemy.name,mode:'adventure'}).flatMap(tier=>tier.candidates);
    assert(!drops.some(id=>itemData[id].sources||itemData[id].rarity==='Special'));
  }
  const raid=lootTable({kind:'boss',id:'Ashen Tyrant',mode:'raid'});
  assert.equal(raid.find(tier=>tier.rarity==='Epic').chance,.025);
  assert.equal(raid.find(tier=>tier.rarity==='Legendary').chance,.006);
  assert.equal(raid.find(tier=>tier.rarity==='Special').chance,.001);
  const allRaidDrops=raidRewardBosses.flatMap(boss=>lootTable({kind:'boss',id:boss.id,mode:'raid'}).flatMap(tier=>tier.candidates));
  for(const id of [...Object.keys(dungeonItems),...Object.keys(setItems),...Object.keys(raidItems)])assert(allRaidDrops.includes(id),id);
  for(const dungeon of dungeons) {
    const table=lootTable({kind:'boss',id:dungeon.enemies.at(-1).name,mode:'dungeon',dungeonId:dungeon.id});
    assert.equal(table.find(tier=>tier.rarity==='Epic').chance,.0125);
    assert.equal(table.find(tier=>tier.rarity==='Legendary').chance,.003);
    assert.equal(table.find(tier=>tier.rarity==='Special').chance,0);
    const raidBoss=raidRewardBosses.find(boss=>boss.dungeonId===dungeon.id);
    const raidTable=lootTable({kind:'boss',id:raidBoss.id,mode:'raid'});
    for(const id of dungeon.exclusiveDrops) {
      const tier=table.find(tier=>tier.candidates.includes(id));
      const raidTier=raidTable.find(tier=>tier.candidates.includes(id));
      assert(raidTier.chance/raidTier.candidates.length>tier.chance/tier.candidates.length,id);
    }
  }
});

test('all 15 armor sets cover seven distinct slots and respect normal/elite/boss rarity caps', () => {
  assert.equal(dungeonSets.length,15);
  assert.equal(Object.keys(setItems).length,105);
  for(const dungeon of dungeons) {
    const sets=dungeonSets.filter(set=>set.dungeonId===dungeon.id);
    assert.deepEqual(sets.map(set=>set.family),['cloth','leather','plate']);
    for(const set of sets) {
      assert.equal(set.items.length,7);
      assert.equal(new Set(set.items.map(id=>itemData[id].slot)).size,7);
      assert(set.items.every(id=>itemData[id].armorType===set.family));
    }
    for(const enemy of dungeon.enemies) {
      const table=lootTable({kind:enemy.kind,id:enemy.name,mode:'dungeon',dungeonId:dungeon.id});
      if(enemy.kind==='normal')assert(!table.some(tier=>['Epic','Legendary','Special'].includes(tier.rarity)&&tier.candidates.length));
      if(enemy.kind==='elite')assert(!table.some(tier=>['Legendary','Special'].includes(tier.rarity)&&tier.candidates.length));
    }
  }
});

test('set thresholds use distinct equipped pieces, cannot mix sets, and affect real stats', () => {
  const set=dungeonSets[0],other=dungeonSets[1],hero={...fresh(),level:100,stats:{Strength:100,Intelligence:100,Discipline:100,Vitality:100}};
  for(const count of [0,1,2,3,4,6,7]) {
    const equipped=set.items.slice(0,count);
    const expected={};
    for(const bonus of set.bonuses.filter(bonus=>count>=bonus.pieces))for(const [stat,value] of Object.entries(bonus.stats))expected[stat]=(expected[stat]||0)+value;
    assert.deepEqual(equippedSetBonuses(equipped).stats,expected);
    const values=systems.derivedStats({...hero,equipped});
    for(const stat of Object.keys(hero.stats))assert.equal(values.stats[stat],hero.stats[stat]+equipped.reduce((sum,id)=>sum+(itemData[id].bonus[stat]||0),0)+(expected[stat]||0));
  }
  assert.deepEqual(equippedSetBonuses([set.items[0],set.items[0]]).stats,{});
  assert.deepEqual(equippedSetBonuses([set.items[0],other.items[0]]).stats,{});
  assert.deepEqual(equippedSetBonuses([]).stats,{});
});

test('rarity scaling improves actual items without mutating catalog source definitions', () => {
  const values=Object.values(rarityPower);
  assert(values.every((value,index)=>!index||value>values[index-1]));
  assert.equal(dungeonItems['Crypt cleaver'].attack,5);
  assert.equal(itemData['Crypt cleaver'].attack,Math.ceil(5*rarityPower.Epic));
  assert.equal(itemData.Moonfang.attack,Math.ceil(7*rarityPower.Legendary));
  assert.equal(itemData['Dragon sigil'].bonus.Intelligence,Math.ceil(8*rarityPower.Special));
});

test('all five dungeon runs can finish actual battles and retain their identity across reloads', () => {
  for(const dungeon of dungeons) {
    let hero=access.enterDungeon({...fresh(),level:100,hp:3030,stats:{Strength:1000,Intelligence:1000,Discipline:1000,Vitality:1000},inventory:[access.DUNGEON_KEY]},now,dungeon.id);
    for(const [stage,enemy] of dungeon.enemies.entries()) {
      let battle=startBattle(enemy,systems.derivedStats(hero).maxStamina);
      for(let turn=0;!battle.ended&&turn<100;turn++) {
        const result=battleTurn(battle,hero,'attack',0,hero.stats.Vitality);
        battle=result.battle;hero={...hero,hp:result.hp};
      }
      assert.equal(battle.ended,'win',dungeon.id);
      hero=JSON.parse(JSON.stringify({...hero,dungeonRun:access.advanceDungeon(hero.dungeonRun,stage)}));
      assert.equal(hero.dungeonRun.dungeonId||'dungeons',dungeon.id);
    }
    assert(hero.dungeonRun.complete);
    assert(!hero.inventory.includes(access.DUNGEON_KEY));
  }
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
  assert.equal(derived.stats.Intelligence, 5+itemData['Runic staff'].bonus.Intelligence);
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
test('training catalog has ten distinct illustrated activities per period and valid rewards', () => {
  assert.equal(new Set(training.scheduledQuests.map(quest=>quest.id)).size,30);
  assert.equal(new Set(training.scheduledQuests.map(quest=>quest.icon)).size,30);
  for(const period of ['daily','weekly','monthly'])assert.equal(training.scheduledQuests.filter(quest=>quest.period===period).length,10);
  for(const quest of training.scheduledQuests){assert(quest.title.every(Boolean));assert(quest.step.every(Boolean));if(quest.item)assert(itemData[quest.item]);if(quest.period==='daily')assert(!quest.item);}
});

test('training rewards scale with level and grant the displayed amount once', () => {
  const quest=training.scheduledQuests.find(quest=>quest.id==='move');
  for(const level of [1,10,26,50,100]){
    const hero={...fresh(),level};
    const reward=training.questRewards(quest,level);
    const result=training.advanceQuest(hero,quest.id,new Date(now));
    assert.equal(result.gold,hero.gold+reward.gold);
    assert.equal(result.stats[quest.stat],hero.stats[quest.stat]+reward.points);
    assert.equal(result.questProgress[quest.id].awardedXp,reward.xp);
    assert.strictEqual(training.advanceQuest(result,quest.id,new Date(now)),result);
  }
  assert(training.questRewards(quest,50).xp>training.questRewards(quest,10).xp);
  assert.deepEqual(training.questRewards(quest,1000),training.questRewards(quest,100));
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

test('tavern lodging charges exactly 1000 once and rejects busy or poor players',()=>{
  const owner={...fresh(),name:'Test',gold:1500,level:1};
  const rented=city.rentLodging(owner,now);
  assert.equal(rented.gold,500);
  assert.equal(rented.energyResting,true);
  assert.equal(rented.energyUpdatedAt,now);
  assert.strictEqual(city.rentLodging(rented,now+1),rented);
  const poor={...owner,gold:999};
  assert.strictEqual(city.rentLodging(poor,now),poor);
  const busy={...owner,battle:{ended:undefined}};
  assert.strictEqual(city.rentLodging(busy,now),busy);
});

test('paid lodging restores health offline without double healing and stops with rest',()=>{
  const base={...fresh(),name:'Test',gold:1000,hp:1,energy:0,energyUpdatedAt:now};
  const rented=city.rentLodging(base,now),maximum=systems.derivedStats(rented).maxHp;
  const tick=systems.refreshEnergy(rented,now+30000);
  assert.equal(tick.hp,1+Math.ceil(maximum*.05));
  assert.equal(tick.energy,1);
  assert.equal(systems.refreshEnergy(tick,now+30000).hp,tick.hp);
  const offline=systems.refreshEnergy(JSON.parse(JSON.stringify(rented)),now+3600000);
  assert.equal(offline.hp,maximum);
  assert.equal(offline.energy,systems.derivedStats(offline).maxEnergy);
  const stopped=systems.refreshEnergy({...tick,energyResting:false},now+30000);
  assert.equal(stopped.lodgingUpdatedAt,undefined);
  assert.equal(systems.refreshEnergy({...stopped,energyResting:true},now+90000).hp,stopped.hp);
  const free=systems.refreshEnergy({...base,energyResting:true},now+60000);
  assert.equal(free.hp,1);
});

test('idle recovery skips timestamp-only writes without banking regeneration after spending',()=>{
  const full=fresh();
  assert.strictEqual(systems.refreshIdleRecovery(full,now+60000),full);
  const paid={...full,energyResting:true,lodgingUpdatedAt:now};
  assert.strictEqual(systems.refreshIdleRecovery(paid,now+60000),paid);
  const spent=systems.spendEnergy(full,5,now+60000);
  assert.equal(spent.energy,full.energy-5);
  assert.equal(systems.refreshIdleRecovery(spent,now+60001).energy,spent.energy);
  const damaged={...paid,hp:1};
  assert(systems.refreshIdleRecovery(damaged,now+30000).hp>1);
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
test('progression curve is increasing, preserves remainder and avoids training level bursts', async () => {
  const {xpToNextLevel,awardXp}=await import(moduleUrl('src/data/progression.ts'));
  assert.equal(xpToNextLevel(1),3200);
  assert.equal(xpToNextLevel(10),50000);
  assert.equal(xpToNextLevel(50),650000);
  assert.equal(xpToNextLevel(100),0);
  for(let level=1;level<99;level++)assert(xpToNextLevel(level+1)>xpToNextLevel(level));
  assert.deepEqual(awardXp(3199,1,1),{xp:0,level:2});
  assert.deepEqual(awardXp(3190,1,30),{xp:20,level:2});
  assert.deepEqual(awardXp(0,1,xpToNextLevel(1)+xpToNextLevel(2)+7),{xp:7,level:3});
  const daily=training.scheduledQuests.filter(quest=>quest.period==='daily');
  for(const level of [1,10,50,99])assert(daily.reduce((sum,quest)=>sum+training.questRewards(quest,level).xp,0)<xpToNextLevel(level));
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
  for(const enemy of encounters)assert(Number.isInteger(enemyFrames[enemy.name] ?? expansionEnemies[enemy.name] ?? reinforcementEnemies[enemy.name] ?? reinforcementExtraEnemies[enemy.name] ?? lateEnemyFrames[enemy.name]),enemy.name);
  for(const area of encounterAreas)assert(Number.isInteger(sceneFrames[area.id] ?? expansionScenes[area.id] ?? lateSceneFrames[area.id]),area.id);
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

test('Crimson Canyon portraits use measured middle-row crops without adjacent rows',async()=>{
  const {enemyPortraitRegions}=await import(moduleUrl('src/data/enemyPortraitRegions.ts'));
  for(const name of ['Crimson Scorpion','Canyon Marauder','Crystal Basilisk']){
    const [left,top,width,height]=enemyPortraitRegions[name];
    assert(top>=419);
    assert(top+height<=820);
    assert(left>=0&&left+width<=1254);
    assert(width>400&&height===395);
  }
  const art=fs.readFileSync('src/components/GameArt.tsx','utf8');
  assert(art.includes('region={enemyPortraitRegions[name]}'));
  assert(art.includes('padding={1}'));
  assert(art.includes('padding={1} fill'));
});

test('areas unlock in order only after a real boss completion and persist on reload', async () => {
  const {isAreaUnlocked,completeArea} = await import(moduleUrl('src/data/adventureProgress.ts'));
  let hero = {...fresh()};
  assert(isAreaUnlocked(hero,encounterAreas[0].id));
  assert(!isAreaUnlocked(hero,'invalid'));
  for (const area of encounterAreas.slice(1)) assert(!isAreaUnlocked(hero,area.id));
  assert.strictEqual(completeArea(hero,encounterAreas[0].id,encounterAreas[0].enemies.at(-1).name),hero);
  const later = encounterAreas[2];
  assert.strictEqual(completeArea(hero,later.id,later.enemies.at(-1).name),hero);
  assert(!isAreaUnlocked({clearedAreas:[encounterAreas[1].id]},encounterAreas[2].id));
  for (const [position,area] of encounterAreas.entries()) {
    assert(isAreaUnlocked(hero,area.id));
    for(const enemy of area.enemies)hero=completeArea(hero,area.id,enemy.name);
    assert(hero.clearedAreas.includes(area.id));
    assert.strictEqual(completeArea(hero,area.id,area.enemies.at(-1).name),hero);
    hero = JSON.parse(JSON.stringify(hero));
    if(position+1<encounterAreas.length)assert(isAreaUnlocked(hero,encounterAreas[position+1].id));
  }
  assert.equal(hero.clearedAreas.length,encounterAreas.length);
});

test('late adventures cover every five levels through 100 with eight foes and mapped art', () => {
  assert.deepEqual(lateAreas.map(area=>area.level),Array.from({length:16},(_,index)=>25+index*5));
  assert.equal(new Set(encounterAreas.map(area=>area.id)).size,encounterAreas.length);
  assert.equal(new Set(encounters.map(enemy=>enemy.name)).size,encounters.length);
  for(const area of lateAreas){
    assert.equal(area.enemies.length,8);
    assert.equal(area.enemies.filter(enemy=>enemy.kind==='elite').length,3);
    assert.equal(area.enemies[7].kind,'boss');
    assert(area.names.every(Boolean));assert(area.description.every(Boolean));
    assert(lateSceneFrames[area.id]>=0&&lateSceneFrames[area.id]<16);
    for(const enemy of area.enemies){assert(lateEnemyFrames[enemy.name]>=0&&lateEnemyFrames[enemy.name]<128);assert(enemy.names.every(Boolean));for(const item of enemy.drops)assert(itemData[item]);}
  }
  assert.equal(new Set(Object.values(lateSceneFrames)).size,16);
  assert.equal(new Set(Object.values(lateEnemyFrames)).size,128);
  for(const language of [0,1])assert.equal(new Set(lateAreas.flatMap(area=>area.enemies.map(enemy=>enemy.names[language]))).size,128);
  for(const file of ['late-regions-v1.webp','late-enemies-v1.webp','late-inner-regions-v1.webp','late-inner-enemies-v1.webp'])assert(fs.statSync('public/assets/art-v1/'+file).size>1000);
});

test('higher-level enemy profiles increase real damage and effects while preserving guard counters',async()=>{
  const {enemyCombatProfile}=await import(moduleUrl('src/data/enemyCombat.ts'));
  const first=lateAreas[0].enemies[0],last=lateAreas[15].enemies[0],boss=lateAreas[13].enemies[7];
  assert(last.hp>first.hp);assert(last.damage>first.damage);
  assert(last.combat.effectPower>first.combat.effectPower);
  assert.equal(boss.combat.specialEvery,2);assert.equal(boss.combat.effectDuration,4);
  const hero={...fresh(),hp:10000,stats:{Strength:20,Intelligence:20,Discipline:20,Vitality:20}};
  const incoming={...startBattle(boss),turn:2};
  const hit=battleTurn(incoming,hero,'focus',0,20);
  assert(hit.battle.log.some(entry=>entry[1].startsWith(boss.special[1]+':')));
  assert.equal(hit.battle.effects[0].power,boss.combat.effectPower);
  assert.equal(hit.battle.effects[0].turns,4);
  const guarded=battleTurn(incoming,hero,'guard',0,20);
  assert.equal(guarded.battle.effects.length,0);assert(guarded.hp>hit.hp);
  const shieldEnemy=lateAreas[15].enemies[6];
  const noShield=battleTurn({...startBattle(shieldEnemy),shield:0},hero,'attack',0,20);
  const shield=battleTurn({...startBattle(shieldEnemy),shield:2},hero,'attack',0,20);
  assert(shield.battle.hp>noShield.battle.hp);
  assert.deepEqual(enemyCombatProfile({mechanic:'poison'}),{specialEvery:3,specialMultiplier:1.8,effectPower:3,effectDuration:3,shieldPower:4,enrageMultiplier:1.35,drainRatio:.5});
});

test('journey puzzle persists its route, refuses locked regions and awards first arrival only once',async()=>{
  const journeys=await import(moduleUrl('src/data/journeys.ts'));
  const first=encounterAreas[0],second=encounterAreas[1];
  let hero={...fresh(),clearedAreas:[first.id]};
  assert.strictEqual(journeys.startJourney(hero,encounterAreas[2].id,.31),hero);
  hero=journeys.startJourney(hero,second.id,.31);
  const path=journeys.journeyPath(hero.journey.seed);
  assert.deepEqual(path,journeys.journeyPath(JSON.parse(JSON.stringify(hero)).journey.seed));
  assert.strictEqual(journeys.startJourney(hero,second.id,.9),hero);
  assert.strictEqual(journeys.finishJourney(hero),hero);
  const moved=journeys.advanceJourney(hero,path[0],0);
  assert.strictEqual(journeys.advanceJourney(moved,path[0],0),moved);
  for(const row of path)hero=journeys.advanceJourney(hero,row);
  const arrived=journeys.finishJourney(hero);
  assert(arrived.visitedAreas.includes(second.id));assert.equal(arrived.xp,hero.xp+15);
  assert.strictEqual(journeys.finishJourney(arrived),arrived);
  assert(!journeys.needsJourney(arrived,second.id));
  assert(!journeys.needsJourney({...fresh(),clearedAreas:[first.id,second.id]},second.id));
});

test('three wrong turns reset only the same saved route, without taking resources',async()=>{
  const journeys=await import(moduleUrl('src/data/journeys.ts'));
  let hero=journeys.startJourney({...fresh(),clearedAreas:[encounterAreas[0].id]},encounterAreas[1].id,.3);
  const seed=hero.journey.seed;
  hero={...hero,journey:{...hero.journey,hazardsSeen:Array.from({length:15},(_,index)=>hero.journey.areaId+':'+Math.floor(index/3)+':'+index%3)}};
  const path=journeys.journeyPath(seed);
  for(let attempt=0;attempt<3;attempt++)for(let step=0;step<5;step++)hero=journeys.advanceJourney(hero,(path[step]+1)%3);
  assert.equal(hero.journey.mistakes,3);
  assert.strictEqual(journeys.advanceJourney(hero,0),hero);
  const retried=journeys.retryJourney(hero);
  assert.equal(retried.journey.seed,seed);assert.equal(retried.journey.step,0);assert.equal(retried.journey.mistakes,0);
  assert.equal(retried.hp,hero.hp);assert.equal(retried.energy,hero.energy);assert.equal(retried.xp,hero.xp);
});

test('route maps drop independently at exactly 20 percent only for the next region',async()=>{
  const maps=await import(moduleUrl('src/data/routeMaps.ts'));
  const {itemSlots}=await import(moduleUrl('src/data/equipment.ts'));
  assert(fs.statSync('public/assets/art-v1/journey-landmarks-v1.webp').size>1000);
  assert.equal(maps.routeMaps.length,encounterAreas.length-1);
  assert.equal(new Set(maps.routeMaps.map(map=>maps.routePathFromSeed(map.seed).join(','))).size,maps.routeMaps.length);
  const hero=fresh();
  for(const map of maps.routeMaps){
    assert.equal(maps.rollRouteMap(map.source,hero,.199999),map.id);
    assert.equal(maps.rollRouteMap(map.source,hero,.2),null);
    assert.equal(maps.rollRouteMap(map.source,{...hero,inventory:[map.id]},0),null);
    assert.equal(maps.rollRouteMap(map.source,{...hero,rewardChest:[map.id]},0),null);
    assert(itemData[map.id].routeTarget===map.target);
    assert.equal(itemSlots(map.id).length,0);
    const seller={...hero,name:'Test',inventory:[map.id]};
    assert.strictEqual(city.sellToNira(seller,0),seller);
    assert(!Object.values(lootTable({kind:'quest',id:'test'})).some(tier=>tier.candidates.includes(map.id)));
  }
  assert.equal(maps.rollRouteMap(encounterAreas[encounterAreas.length-1].id,hero,0),null);
});

test('blind route guesses reveal nothing until all five choices and maps match the actual journey',async()=>{
  const journeys=await import(moduleUrl('src/data/journeys.ts'));
  const maps=await import(moduleUrl('src/data/routeMaps.ts'));
  const target=encounterAreas[1].id;
  let hero=journeys.startJourney({...fresh(),clearedAreas:[encounterAreas[0].id]},target,.73);
  hero={...hero,journey:{...hero.journey,hazardsSeen:Array.from({length:15},(_,index)=>target+':'+Math.floor(index/3)+':'+index%3)}};
  const path=journeys.journeyPath(hero.journey.seed);
  assert.deepEqual(path,maps.routePathFromSeed(maps.routeMapFor(target).seed));
  for(let step=0;step<4;step++){
    hero=journeys.advanceJourney(hero,(path[step]+1)%3);
    assert.equal(hero.journey.step,step+1);assert.equal(hero.journey.mistakes,0);
  }
  hero=journeys.advanceJourney(hero,(path[4]+1)%3);
  assert.equal(hero.journey.step,0);assert.equal(hero.journey.mistakes,1);assert.deepEqual(hero.journey.choices,[]);
});

test('surviving a travel injury accepts only that tile while fatal injury never counts',async()=>{
  const journeys=await import(moduleUrl('src/data/journeys.ts'));
  const hazards=await import(moduleUrl('src/data/journeyHazards.ts'));
  let base=journeys.startJourney({...fresh(),clearedAreas:[encounterAreas[0].id]},encounterAreas[1].id,.3);
  let found;
  for(let stage=0;stage<5;stage++)for(let row=0;row<3;row++){
    const journey={...base.journey,step:stage,choices:journeys.journeyPath(base.journey.seed).slice(0,stage)};
    const kind=hazards.hazardAt(journey,row);
    if(kind&&kind!=='bandits'&&kind!=='death')found={journey,row};
  }
  assert(found);
  base={...base,journey:found.journey};
  const injured=journeys.advanceJourney(base,found.row);
  assert(injured.hp>0&&injured.hp<base.hp);
  assert.strictEqual(journeys.advanceJourney(injured,0),injured);
  assert.strictEqual(journeys.finishJourney(injured),injured);
  const survived=hazards.acknowledgeJourneyHazard(injured);
  const token=found.journey.step+':'+found.row;
  assert(survived.journey.acceptedSteps.includes(token));
  assert(!survived.journey.hazard);
  assert.strictEqual(hazards.acknowledgeJourneyHazard(survived),survived);
  const dead=hazards.acknowledgeJourneyHazard(journeys.advanceJourney({...base,hp:1},found.row));
  assert.equal(dead.hp,0);
  assert(!dead.journey.acceptedSteps?.includes(token));
  assert.equal(dead.journey.step,0);
  assert(dead.effects.some(effect=>effect.name==='Oslabenie'));
  assert(dead.restUntil>Date.now());
});

test('road bandits use three real battles and only full victory accepts the alternate step',async()=>{
  const journeys=await import(moduleUrl('src/data/journeys.ts'));
  const hazards=await import(moduleUrl('src/data/journeyHazards.ts'));
  let base=journeys.startJourney({...fresh(),clearedAreas:[encounterAreas[0].id]},encounterAreas[1].id,.3);
  let found;
  for(let stage=0;stage<5;stage++)for(let row=0;row<3;row++){
    const journey={...base.journey,step:stage,choices:journeys.journeyPath(base.journey.seed).slice(0,stage)};
    if(hazards.hazardAt(journey,row)==='bandits')found={journey,row};
  }
  assert(found);
  let hero=journeys.advanceJourney({...base,journey:found.journey,stats:{Strength:1000,Intelligence:1000,Discipline:1000,Vitality:1000},hp:1000},found.row);
  const entered=hero;
  const retreated=hazards.continueJourneyBattle(hazards.retreatJourneyBattle(hero));
  assert(!retreated.journey.acceptedSteps?.length);
  assert.equal(retreated.journey.step,0);
  for(let wave=0;wave<3;wave++){
    assert.equal(hero.journey.hazard.wave,wave);
    assert(hero.battle.enemy.name.startsWith('Road Bandit'));
    hero=hazards.actJourneyBattle(hero,'attack');
    assert.equal(hero.battle.ended,'win');
    assert.strictEqual(hazards.actJourneyBattle(hero,'attack'),hero);
    hero=hazards.continueJourneyBattle(hero);
    if(wave<2)assert(!hero.journey.acceptedSteps?.length);
  }
  assert(hero.journey.acceptedSteps.includes(found.journey.step+':'+found.row));
  assert.equal(hero.battle,null);
  assert.equal(hero.gold,entered.gold+15);
  assert.deepEqual(hero.inventory,entered.inventory);
  assert.deepEqual(hero.clearedAreas,entered.clearedAreas);
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

test('only a victorious final area boss returns the player to region selection',async()=>{
  const {returnToAreaSelection}=await import(moduleUrl('src/data/adventureProgress.ts'));
  for(const area of encounterAreas){
    const boss=area.enemies.at(-1);
    assert(returnToAreaSelection(area.id,{enemy:boss,ended:'win'}));
    for(const ended of ['loss','fled',undefined])assert(!returnToAreaSelection(area.id,{enemy:boss,ended}));
    assert(!returnToAreaSelection(area.id,{enemy:area.enemies[0],ended:'win'}));
  }
  assert(!returnToAreaSelection('missing',null));
});

test('stone bridge can trigger hazards on wrong turns and correct routes remain safe',async()=>{
  const {routeMaps,routePathFromSeed}=await import(moduleUrl('src/data/routeMaps.ts'));
  const {hazardAt}=await import(moduleUrl('src/data/journeyHazards.ts'));
  let dangerousBridges=0,safeBridges=0;
  for(const map of routeMaps)for(let stage=0;stage<5;stage++)for(let row=0;row<3;row++){
    const journey={areaId:map.target,seed:map.seed,step:stage,mistakes:0,level:1,choices:[]};
    if(routePathFromSeed(map.seed)[stage]===row)assert.equal(hazardAt(journey,row),null);
    if((stage+row)%6===0){if(hazardAt(journey,row))dangerousBridges++;else safeBridges++;}
  }
  assert(dangerousBridges>0);
  assert(safeBridges>0);
});

test('instant death occupies exactly 10 percent and can never accept a step after healing',async()=>{
  const {journeyHazardFromRoll,hazardAt,applyJourneyHazard,acknowledgeJourneyHazard}=await import(moduleUrl('src/data/journeyHazards.ts'));
  for(let landmark=0;landmark<6;landmark++){
    const outcomes=Array.from({length:100},(_,roll)=>journeyHazardFromRoll(landmark,roll));
    assert.equal(outcomes.filter(kind=>kind==='death').length,10);
    assert.equal(outcomes.filter(kind=>kind==='bandits').length,45);
    assert.equal(outcomes.filter(kind=>kind!=='death'&&kind!=='bandits').length,45);
  }
  const {routeMaps,routePathFromSeed}=await import(moduleUrl('src/data/routeMaps.ts'));
  let sample;
  for(const map of routeMaps)for(let stage=0;stage<5;stage++)for(let row=0;row<3;row++){
    const journey={areaId:map.target,seed:map.seed,step:stage,mistakes:0,level:1,choices:routePathFromSeed(map.seed).slice(0,stage)};
    if(hazardAt(journey,row)==='death')sample={journey,row};
  }
  assert(sample);
  const died=applyJourneyHazard({...fresh(),journey:{...sample.journey,step:sample.journey.step+1,choices:[...sample.journey.choices,sample.row]}},sample.journey,sample.row);
  assert.equal(died.hp,0);
  assert.equal(died.journey.step,0);
  assert(died.journey.hazard.fatal);
  const healed=acknowledgeJourneyHazard({...died,hp:36});
  assert(!healed.journey.acceptedSteps?.length);
});

test('every new wrong turn triggers bandits or a hazard matching its exact terrain',async()=>{
  const {routeMaps,routePathFromSeed}=await import(moduleUrl('src/data/routeMaps.ts'));
  const {hazardAt}=await import(moduleUrl('src/data/journeyHazards.ts'));
  const {journeyLandmarkAt}=await import(moduleUrl('src/data/journeyLandmarks.ts'));
  const expected=['bridge','poison','rockfall','pit','current','stairs'];
  const kinds=new Set();
  for(const map of routeMaps)for(let stage=0;stage<5;stage++)for(let row=0;row<3;row++){
    const journey={areaId:map.target,seed:map.seed,step:stage,mistakes:0,level:1,choices:[]};
    const kind=hazardAt(journey,row);
    if(routePathFromSeed(map.seed)[stage]===row){assert.equal(kind,null);continue;}
    assert(kind);
    if(kind!=='bandits'&&kind!=='death')assert.equal(kind,expected[journeyLandmarkAt(stage,row)]);
    kinds.add(kind);
  }
  assert.equal(kinds.size,8);
});

test('travel combat consumes one prepared copy without touching backpack copies',async()=>{
  const {actJourneyBattle,roadBandit}=await import(moduleUrl('src/data/journeyHazards.ts'));
  const {startBattle}=await import(moduleUrl('src/data/battle.ts'));
  const hero={...fresh(),hp:10,inventory:['Healing herb'],preparedConsumables:['Healing herb','Healing herb','Healing herb'],journey:{areaId:'ravenmoor',seed:.3,step:1,mistakes:0,level:1,choices:[0],hazard:{id:'test',kind:'bandits',stage:0,row:0,wave:0,damage:0}},battle:startBattle(roadBandit(1,0))};
  const used=actJourneyBattle(hero,'consumable','Healing herb');
  assert.equal(used.preparedConsumables.length,2);
  assert.deepEqual(used.inventory,hero.inventory);
  assert.equal(used.battle.turn,hero.battle.turn+1);
  const empty={...used,preparedConsumables:[]};
  assert.strictEqual(actJourneyBattle(empty,'consumable','Healing herb'),empty);
});

test('final hazard waits for survival before completing an alternate route',async()=>{
  const {settleJourneyRoute,journeyRouteComplete}=await import(moduleUrl('src/data/journeyRoute.ts'));
  const {acknowledgeJourneyHazard}=await import(moduleUrl('src/data/journeyHazards.ts'));
  const {routeMaps,routePathFromSeed}=await import(moduleUrl('src/data/routeMaps.ts'));
  const map=routeMaps[0],choices=routePathFromSeed(map.seed);
  choices[4]=(choices[4]+1)%3;
  const hero={...fresh(),journey:{areaId:map.target,seed:map.seed,step:5,level:1,mistakes:0,choices,rulesVersion:2,hazard:{id:'final',kind:'rockfall',stage:4,row:choices[4],wave:0,damage:5}}};
  assert.strictEqual(settleJourneyRoute(hero),hero);
  assert(!journeyRouteComplete(hero.journey));
  const survived=acknowledgeJourneyHazard(hero);
  assert(journeyRouteComplete(survived.journey));
  assert.equal(survived.journey.step,5);
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
  const hero = {...fresh(),level:5,inventory:[access.DUNGEON_KEY,access.DUNGEON_KEY,access.RAID_TOKEN]};
  const entered = access.enterDungeon(hero,now);
  assert.deepEqual(entered.inventory,[access.DUNGEON_KEY,access.RAID_TOKEN]);
  assert.deepEqual(entered.dungeonRun,{stage:0,complete:false,startedAt:now});
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
  let hero = access.enterDungeon({...fresh(),level:100,inventory:[access.DUNGEON_KEY],hp:500,stats:{Strength:100,Intelligence:100,Discipline:100,Vitality:100}},now);
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
