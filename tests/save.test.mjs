import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { stripTypeScriptTypes } from 'node:module';
const cache=new Map();
function moduleUrl(file) {
  file=path.resolve(file);
  if(cache.has(file))return cache.get(file);
  const source=stripTypeScriptTypes(fs.readFileSync(file,'utf8')).replace(/from '([^']+)'/g,(match,reference)=>reference.startsWith('.')?'from '+JSON.stringify(moduleUrl(path.resolve(path.dirname(file),reference+'.ts'))):match);
  const url='data:text/javascript;base64,'+Buffer.from(source).toString('base64');cache.set(file,url);return url;
}
const saves=await import(moduleUrl('src/systems/saveService.ts'));
const {freshHero,hydrateHero}=await import(moduleUrl('src/data/playerSave.ts'));
const {startBattle}=await import(moduleUrl('src/data/battle.ts'));
const {encounters}=await import(moduleUrl('src/data/encounters.ts'));
test('scaled enemy combat rules survive a saved battle and reject invalid timing',()=>{
  const enemy=encounters[encounters.length-1];
  const hero={...freshHero(),name:'Test',battle:startBattle(enemy)};
  assert.deepEqual(hydrateHero(saves.decodeSave(saves.encodeSave(hero))).battle.enemy.combat,enemy.combat);
  for(const specialEvery of [0,-1,1.5,11])assert.throws(()=>saves.encodeSave({...hero,battle:{...hero.battle,enemy:{...enemy,combat:{...enemy.combat,specialEvery}}}}));
});
const {itemData}=await import(moduleUrl('src/data/loot.ts'));
test('paid lodging timestamp survives saves and rejects invalid time values',()=>{
  const hero={...freshHero(),name:'Test',energyResting:true,lodgingUpdatedAt:1800000000000};
  assert.equal(saves.decodeSave(saves.encodeSave(hero)).lodgingUpdatedAt,hero.lodgingUpdatedAt);
  assert.throws(()=>saves.encodeSave({...hero,lodgingUpdatedAt:-1}));
});
test('prepared consumable stacks survive saves and reject over-capacity or non-consumables',()=>{
  const hero={...freshHero(),name:'Test',preparedConsumables:['Healing herb','Healing herb','War drum']};
  assert.deepEqual(saves.decodeSave(saves.encodeSave(hero)).preparedConsumables,hero.preparedConsumables);
  assert.throws(()=>saves.encodeSave({...hero,preparedConsumables:Array(4).fill('Healing herb')}));
  assert.throws(()=>saves.encodeSave({...hero,preparedConsumables:['Iron helm']}));
  const alchemist={...hero,className:'Alchymista',preparedConsumables:Array(5).fill('Healing herb')};
  assert.equal(saves.decodeSave(saves.encodeSave(alchemist)).preparedConsumables.length,5);
});
test('alternate route tiles and pending hazards round trip without accepting invalid coordinates',async()=>{
  const {startJourney}=await import(moduleUrl('src/data/journeys.ts'));
  const base=startJourney({...freshHero(),name:'Test',clearedAreas:['forbidden-forest']},'ravenmoor',.3);
  const journey={...base.journey,acceptedSteps:['0:1'],hazardsSeen:['ravenmoor:1:2'],hazard:{id:'ravenmoor:1:2',kind:'rockfall',stage:1,row:2,damage:5,wave:0}};
  const hero={...base,journey};
  assert.deepEqual(saves.decodeSave(saves.encodeSave(hero)).journey,journey);
  assert.throws(()=>saves.encodeSave({...hero,journey:{...journey,acceptedSteps:['5:0']}}));
  assert.throws(()=>saves.encodeSave({...hero,journey:{...journey,hazard:{...journey.hazard,row:3}}}));
});
const {createTravelEvent,resolveTravelEvent}=await import(moduleUrl('src/data/travelEvents.ts'));

test('travel event rolls and resolved outcomes survive saves, invalid events are rejected',()=>{
  const event=createTravelEvent('adventure','forbidden-forest',0,1,0,0,.2);
  const hero={...freshHero(),name:'Test',pendingTravelEvent:event};
  const restored=hydrateHero(saves.decodeSave(saves.encodeSave(hero)));
  assert.deepEqual(restored.pendingTravelEvent,event);
  const resolved=resolveTravelEvent(restored,event.id,'explore');
  assert.deepEqual(hydrateHero(saves.decodeSave(saves.encodeSave(resolved))).travelHistory,resolved.travelHistory);
  for(const bad of [{...event,kind:'unknown'},{...event,seed:1},{...event,level:0},{...event,stage:-1}])assert.throws(()=>saves.encodeSave({...hero,pendingTravelEvent:bad}));
});
const {localizedItemName,localizedStatName}=await import(moduleUrl('src/data/localization.ts'));
const storage=()=>{const data=new Map();return {data,getItem:key=>data.get(key)||null,setItem:(key,value)=>data.set(key,value)};};

test('journey saves preserve map progress and reject invalid steps',async()=>{
  const {startJourney,advanceJourney,journeyPath}=await import(moduleUrl('src/data/journeys.ts'));
  const hero=startJourney({...freshHero(),name:'Test',clearedAreas:['forbidden-forest']},'ravenmoor',.31);
  const stepped=advanceJourney(hero,journeyPath(.31)[0]);
  assert.deepEqual(hydrateHero(saves.decodeSave(saves.encodeSave(stepped))).journey,stepped.journey);
  for(const step of [-1,6,.5])assert.throws(()=>saves.encodeSave({...stepped,journey:{...stepped.journey,step}}));
  const restored=hydrateHero(saves.decodeSave(saves.encodeSave({...stepped,inventory:['Route map: ravenmoor']})));
  assert(restored.inventory.includes('Route map: ravenmoor'));
  assert.deepEqual(restored.journey.choices,stepped.journey.choices);
  const legacy=hydrateHero({...hero,journey:{areaId:'ravenmoor',seed:.31,step:3,mistakes:1,level:1}});
  assert.equal(legacy.journey.rulesVersion,2);assert.equal(legacy.journey.step,0);assert.deepEqual(legacy.journey.choices,[]);
});

test('victory reward receipts survive reload and reject invalid reward payloads',()=>{
  const hero={...freshHero(),name:'Test',battle:{...startBattle(encounters[0]),ended:'win',reward:{xp:50,gold:20,items:['Guard boots','Dungeon key']}}};
  const restored=hydrateHero(saves.decodeSave(saves.encodeSave(hero)));
  assert.deepEqual(restored.battle.reward,hero.battle.reward);
  for(const reward of [{xp:-1,gold:20,items:[]},{xp:50,gold:20,items:['not-an-item']},{xp:50,gold:'20',items:[]}])assert.throws(()=>saves.encodeSave({...hero,battle:{...hero.battle,reward}}));
  assert.throws(()=>saves.encodeSave({...hero,battle:{...hero.battle,ended:'loss'}}));
});

test('legacy and versioned save roundtrip preserve progression, class, gear and battle',()=>{
  const hero={...freshHero(),name:'Arin',gold:54321,inventory:['Rusty charm'],battle:{...startBattle(encounters[0]),relicReadyAt:6,powerHits:2},guild:{name:'Test',founder:'Arin',members:[{name:'Arin',role:'master'}]}};
  assert.deepEqual(saves.decodeSave(JSON.stringify(hero)),hero);
  assert.deepEqual(saves.decodeSave(saves.encodeSave(hero)),hero);
  assert.equal(hydrateHero(saves.decodeSave(saves.encodeSave(hero))).gold,54321);
});
test('automatic save rotates previous valid snapshot but skips unchanged saves',()=>{
  const store=storage(),hero=freshHero();
  saves.saveGame(store,hero);
  const first=store.getItem(saves.SAVE_KEY);
  saves.saveGame(store,hero);
  assert.equal(store.getItem(saves.BACKUP_KEY),null);
  saves.saveGame(store,{...hero,gold:500});
  assert.equal(store.getItem(saves.BACKUP_KEY),first);
  assert.equal(saves.decodeSave(store.getItem(saves.SAVE_KEY)).gold,500);
});
test('damaged saves are never overwritten by autosave; explicit replacement archives raw data',()=>{
  const store=storage(),raw='{broken';
  store.setItem(saves.SAVE_KEY,raw);
  assert.throws(()=>saves.saveGame(store,freshHero()));
  assert.equal(store.getItem(saves.SAVE_KEY),raw);
  saves.replaceSave(store,freshHero());
  assert.equal(store.getItem(saves.RECOVERY_KEY),raw);
  assert.equal(saves.decodeSave(store.getItem(saves.SAVE_KEY)).level,1);
});
test('storage failure during backup leaves original progress untouched',()=>{
  const store=storage();saves.saveGame(store,freshHero());
  const original=store.getItem(saves.SAVE_KEY);
  const full={getItem:store.getItem,setItem:()=>{throw Error('quota');}};
  assert.throws(()=>saves.replaceSave(full,{...freshHero(),gold:999}));
  assert.equal(store.getItem(saves.SAVE_KEY),original);
  assert.throws(()=>saves.saveGame(full,{...freshHero(),gold:999}));
  assert.equal(store.getItem(saves.SAVE_KEY),original);
});
test('invalid files and nested data are rejected before replacing current progress',()=>{
  const hero=freshHero(),store=storage();saves.saveGame(store,hero);
  const invalid=[null,[],{}, {...hero,gold:-5},{...hero,hp:'oops'},{...hero,stats:{Strength:1}},{...hero,inventory:['not-an-item']},{...hero,effects:[{}]},{...hero,battle:{}},{...hero,questProgress:{move:null}},{...hero,equipment:[{}]},{...hero,guild:{name:'bad'}},{...hero,chatMessages:[{}]},{format:'lifequest',version:999,hero}];
  for(const candidate of invalid)assert.throws(()=>saves.decodeSave(JSON.stringify(candidate)));
  const original=store.getItem(saves.SAVE_KEY);
  assert.throws(()=>saves.replaceSave(store,{...hero,inventory:['not-an-item']}));
  assert.equal(store.getItem(saves.SAVE_KEY),original);
});
test('restoring a backup preserves the replaced current save as the next rollback',()=>{
  const store=storage(),hero=freshHero();
  saves.saveGame(store,hero);saves.saveGame(store,{...hero,gold:999});
  const backup=saves.decodeSave(store.getItem(saves.BACKUP_KEY));
  saves.replaceSave(store,backup);
  assert.equal(saves.decodeSave(store.getItem(saves.SAVE_KEY)).gold,25);
  assert.equal(saves.decodeSave(store.getItem(saves.BACKUP_KEY)).gold,999);
});

test('item and attribute names are available in both shared locales',()=>{
  const legacy=['Iron helm','Rusty charm','Guard boots','War drum','Ember cloak','Runic staff'];
  for(const [id,item] of Object.entries(itemData)) {
    assert(item.names?.length===2||legacy.includes(id),id);
    for(const lang of ['sk','en'])assert(localizedItemName(id,lang).trim().length>0,id);
  }
  assert.equal(localizedStatName('Strength','sk'),'Sila');
  assert.equal(localizedStatName('Strength','en'),'Strength');
});

test('optimized asset manifest resolves to real, smaller files',()=>{
  const manifest=JSON.parse(fs.readFileSync('src/data/optimizedAssets.json','utf8'));
  assert(Object.keys(manifest).length>80);
  for(const [original,optimized] of Object.entries(manifest)) {
    const before=fs.statSync('public'+original),after=fs.statSync('public'+optimized);
    assert(after.size>0&&after.size<before.size,optimized);
  }
});

test('pre-replacement checkpoint survives typing and later automatic saves',()=>{
  const store=storage(),hero={...freshHero(),name:'Original',gold:888};
  saves.saveGame(store,hero);
  saves.replaceSave(store,freshHero());
  saves.saveGame(store,{...freshHero(),name:'N'});
  saves.saveGame(store,{...freshHero(),name:'New'});
  assert.equal(saves.decodeSave(store.getItem(saves.CHECKPOINT_KEY)).name,'Original');
  assert.equal(saves.decodeSave(store.getItem(saves.CHECKPOINT_KEY)).gold,888);
});
