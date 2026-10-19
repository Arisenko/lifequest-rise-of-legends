import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { stripTypeScriptTypes } from 'node:module';
const cache=new Map();
function moduleUrl(file) {
  file=path.resolve(file);
  if(cache.has(file))return cache.get(file);
  const source=stripTypeScriptTypes(fs.readFileSync(file,'utf8')).replace(/from '([^']+)'/g,(match,reference)=>reference.startsWith('.')?'from '+JSON.stringify(moduleUrl(path.resolve(path.dirname(file),reference+'.ts'))):match);
  const url='data:text/javascript;base64,'+Buffer.from(source).toString('base64');cache.set(file,url);return url;
}
const progress=await import(moduleUrl('src/data/adventureProgress.ts'));
const access=await import(moduleUrl('src/data/access.ts'));
const {encounterAreas}=await import(moduleUrl('src/data/encounters.ts'));
const {dungeons}=await import(moduleUrl('src/data/dungeons.ts'));
const {freshHero,hydrateHero}=await import(moduleUrl('src/data/playerSave.ts'));
const {encodeSave,decodeSave}=await import(moduleUrl('src/systems/saveService.ts'));
const {dungeonScenes}=await import(moduleUrl('src/data/dungeonArt.ts'));
const now=1800000000000;
test('dungeon visibility reveals previous and current rooms but not future opponents',()=>{
  assert.equal(access.isDungeonEnemyRevealed(null,0),false);
  for(let stage=0;stage<3;stage++)for(let index=0;index<3;index++)assert.equal(access.isDungeonEnemyRevealed({stage,complete:false},index),index<=stage);
  assert.equal(access.isDungeonEnemyRevealed({stage:1,failed:true,complete:false},1),true);
  assert.equal(access.isDungeonEnemyRevealed({stage:1,failed:true,complete:false},2),false);
  assert.equal(access.isDungeonEnemyRevealed({stage:3,complete:true},2),true);
  assert.equal(access.isDungeonEnemyRevealed({stage:0,complete:false},-1),false);
});
const ready=()=>({...freshHero(),level:100,hp:30,inventory:Array(5).fill(access.DUNGEON_KEY)});

test('every adventure requires all preceding opponents before its boss, with repeatable earned encounters',()=>{
  let hero=ready();
  for(const area of encounterAreas) {
    assert(progress.isAreaUnlocked(hero,area.id));
    for(const [index,enemy] of area.enemies.entries()) {
      assert(progress.isEnemyUnlocked(hero,area.id,enemy.name));
      for(const later of area.enemies.slice(index+1))assert(!progress.isEnemyUnlocked(hero,area.id,later.name));
      assert.equal(progress.completeArea(hero,area.id,'invalid'),hero);
      const boss=area.enemies.at(-1);
      if(index<area.enemies.length-1)assert.equal(progress.completeArea(hero,area.id,boss.name),hero);
      hero=progress.completeArea(hero,area.id,enemy.name);
      assert.equal(progress.completeArea(hero,area.id,enemy.name),hero);
      assert(progress.isEnemyUnlocked(hero,area.id,enemy.name));
      hero=decodeSave(encodeSave(hero));
    }
    assert(hero.clearedAreas.includes(area.id));
  }
});

test('already cleared legacy areas preserve earned unlocks without granting later areas',()=>{
  const area=encounterAreas[0],hero={...ready(),clearedAreas:[area.id]};
  for(const enemy of area.enemies)assert(progress.isEnemyUnlocked(hero,area.id,enemy.name));
  assert(progress.isAreaUnlocked(hero,encounterAreas[1].id));
  assert(!progress.isEnemyUnlocked(hero,encounterAreas[1].id,encounterAreas[1].enemies.at(-1).name));
});

test('each dungeon spends one key at entry and is locked for exactly 24 hours after leaving or failure',()=>{
  for(const dungeon of dungeons) {
    let hero=access.enterDungeon(ready(),now,dungeon.id);
    assert.equal(hero.inventory.length,4);
    assert.equal(hero.dungeonEntries[dungeon.id],now);
    for(let stage=0;stage<dungeon.enemies.length;stage++) {
      assert(access.isDungeonEnemyUnlocked(hero.dungeonRun,stage));
      assert(!access.isDungeonEnemyUnlocked(hero.dungeonRun,stage+1));
      hero={...hero,dungeonRun:access.advanceDungeon(hero.dungeonRun,stage)};
      assert(!access.isDungeonEnemyUnlocked(hero.dungeonRun,stage));
    }
    assert(hero.dungeonRun.complete);
    hero=access.leaveDungeon(decodeSave(encodeSave(hero)));
    assert.equal(access.enterDungeon(hero,now+access.INSTANCE_COOLDOWNS.dungeon-1,dungeon.id),hero);
    assert.equal(access.enterDungeon(hero,now+access.INSTANCE_COOLDOWNS.dungeon,dungeon.id).inventory.length,3);
    const failed=access.enterDungeon(ready(),now,dungeon.id);
    const run=access.failDungeon(failed.dungeonRun);
    assert.equal(access.advanceDungeon(run,0),run);
    assert(!access.isDungeonEnemyUnlocked(run,0));
    const left=access.leaveDungeon({...failed,dungeonRun:run});
    assert.equal(left.inventory.length,4);
    assert.equal(access.enterDungeon(left,now+1,dungeon.id),left);
  }
});

test('daily dungeon counters are per dungeon and raid counters use seven days',()=>{
  const left=access.leaveDungeon(access.enterDungeon(ready(),now,dungeons[0].id));
  assert(access.enterDungeon(left,now,dungeons[1].id).dungeonRun);
  const hero={...ready(),raidEntries:{'ashen-citadel':now}};
  assert.equal(access.instanceRemaining(hero,'raid','ashen-citadel',now),7*24*60*60*1000);
  assert.equal(access.instanceRemaining(hero,'raid','ashen-citadel',now+7*24*60*60*1000),0);
});

test('old active dungeon saves receive a stable entry timestamp without consuming another key',()=>{
  const legacy={...ready(),dungeonRun:{stage:1,complete:false}};
  const migrated=hydrateHero(legacy);
  assert.equal(migrated.dungeonRun.stage,1);
  assert.equal(migrated.inventory.length,legacy.inventory.length);
  assert.equal(migrated.dungeonEntries.dungeons,migrated.dungeonRun.startedAt);
  const again=hydrateHero(decodeSave(encodeSave(migrated)));
  assert.equal(again.dungeonRun.startedAt,migrated.dungeonRun.startedAt);
  assert.deepEqual(again.dungeonEntries,migrated.dungeonEntries);
});

test('dungeon preview scenes are unique original files, never adventure atlas aliases',()=>{
  const hashes=new Set();
  for(const dungeon of dungeons) {
    const file=dungeonScenes[dungeon.scene];
    assert(file?.startsWith('dungeon-'),dungeon.id);
    const bytes=fs.readFileSync('public/assets/art-v1/'+file+'.webp');
    assert(bytes.length>1000);
    hashes.add(createHash('sha256').update(bytes).digest('hex'));
  }
  assert.equal(hashes.size,dungeons.length);
  assert(fs.statSync('public/assets/art-v1/orin-shop-icon.webp').size>1000);
});

test('material backgrounds are distinct and shop illustrations are not stretched behind content',()=>{
  const hashes=new Set(['city-masonry','dungeon-stone','raid-obsidian'].map(name=>{
    const bytes=fs.readFileSync('public/assets/art-v1/'+name+'.webp');
    assert(bytes.length>1000);
    return createHash('sha256').update(bytes).digest('hex');
  }));
  assert.equal(hashes.size,3);
  const city=fs.readFileSync('src/components/City.tsx','utf8');
  assert(!city.includes('city-room-backdrop'));
  const styles=fs.readFileSync('src/page-layout.css','utf8');
  assert(!styles.includes('--room-scene'));
  assert(styles.includes('background-repeat: no-repeat,repeat'));
  assert(!dungeonScenes.dungeons);
  assert(fs.readFileSync('src/data/art.ts','utf8').includes('dungeons: 7'));
});

test('town preview decoration is separate from masonry inside opened services',()=>{
  const styles=fs.readFileSync('src/page-layout.css','utf8');
  const preview=styles.match(/\.city-expanded \{([^}]+)\}/)?.[1];
  const interior=styles.match(/\.city-room-interior \{([^}]+)\}/)?.[1];
  assert(preview?.includes('--panel-material: var(--panel-grain)'));
  assert(!preview?.includes('city-masonry.webp'));
  assert(interior?.includes('city-masonry.webp'));
});

test('instance intros use themed illustrations while lower panels retain masonry and adventures use trail maps',()=>{
  const styles=fs.readFileSync('src/page-layout.css','utf8');
  for(const [kind,intro,wall] of [['dungeon','dungeon-intro','dungeon-stone'],['raid','raid-intro','raid-obsidian']]) {
    const root=styles.match(new RegExp('\\.'+kind+'-environment \\{([^}]+)\\}'))?.[1];
    const header=styles.match(new RegExp('\\.'+kind+'-environment \\.page-intro \\{([^}]+)\\}'))?.[1];
    assert(root?.includes(wall+'.webp'));
    assert(header?.includes(intro+'.webp'));
    assert(!header?.includes(wall+'.webp'));
    assert(fs.statSync('public/assets/art-v1/'+intro+'.webp').size>1000);
  }
  const adventure=styles.match(/\.adventure-environment \{([^}]+)\}/)?.[1];
  assert(adventure?.includes('adventure-map.webp'));
  assert(!adventure?.includes('stone'));
  assert(fs.statSync('public/assets/art-v1/adventure-map.webp').size>1000);
  assert(fs.readFileSync('src/components/Expeditions.tsx','utf8').includes("mode==='dungeon'?'dungeon-run':'adventure-environment'"));
});
