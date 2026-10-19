import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { stripTypeScriptTypes } from 'node:module';
const cache=new Map();
function moduleUrl(file){
  file=path.resolve(file);
  if(cache.has(file))return cache.get(file);
  const source=stripTypeScriptTypes(fs.readFileSync(file,'utf8')).replace(/from '([^']+)'/g,(match,reference)=>reference.startsWith('.')?'from '+JSON.stringify(moduleUrl(path.resolve(path.dirname(file),reference+'.ts'))):match);
  const url='data:text/javascript;base64,'+Buffer.from(source).toString('base64');cache.set(file,url);return url;
}
const {enemySpecialIcon,enemyBasicIcon,enemySpecialArt,enemyBasicArt,enemySemanticFrames}=await import(moduleUrl('src/data/enemyAttackArt.ts'));
const {encounters}=await import(moduleUrl('src/data/encounters.ts'));
const {dungeons}=await import(moduleUrl('src/data/dungeons.ts'));
const {visibleEffects}=await import(moduleUrl('src/data/statusEffects.ts'));
const {freshHero}=await import(moduleUrl('src/data/playerSave.ts'));
const {startBattle}=await import(moduleUrl('src/data/battle.ts'));
const enemy=name=>encounters.find(entry=>entry.name===name);
test('every adventure and dungeon enemy has an explicit special and basic attack illustration',()=>{
  for(const entry of [...encounters,...dungeons.flatMap(area=>area.enemies)]){
    assert(enemySpecialArt[entry.special[1]],entry.name+' special');
    assert(enemyBasicArt[entry.name],entry.name+' basic');
    assert.equal(enemySpecialIcon(entry),enemySpecialArt[entry.special[1]]);
    assert.equal(enemyBasicIcon(entry),enemyBasicArt[entry.name]);
  }
  assert.equal(new Set(Object.values(enemySemanticFrames)).size,9);
  assert(fs.statSync('public/assets/art-v1/enemy-semantic-abilities-v2.webp').size>1000);
});
test('visuals follow the meaning of attacks rather than their reused combat mechanic',()=>{
  assert.equal(enemySpecialIcon(enemy('Bog witch')),'enemy-curse');
  assert.equal(enemySpecialIcon(enemy('Drowned king')),'enemy-curse');
  assert.equal(enemySpecialIcon(enemy('Canyon Berserker')),'enemy-roar');
  assert.equal(enemySpecialIcon(enemy('Lunar Automaton')),'enemy-moonbeam');
  assert.equal(enemySpecialIcon(enemy('Astral Inquisitor')),'enemy-moonbeam');
  assert.equal(enemySpecialIcon(enemy('Barnacle Sailor')),'enemy-anchor');
  assert.equal(enemySpecialIcon(enemy('Moon Librarian')),'enemy-book');
  assert.equal(enemySpecialIcon(enemy('Red Crystal Golem')),'enemy-crystal-wall');
  assert.equal(enemySpecialIcon(enemy('Reef Crab')),'enemy-shell');
  assert.equal(enemySpecialIcon(enemy('Emberlord')),'enemy-searing-blade');
  assert.equal(enemySpecialIcon(enemy('Ember Witch')),'enemy-burn');
});
test('persisted legacy encounters and localization retain consistent illustrations',()=>{
  const saved=JSON.parse(JSON.stringify(enemy('Bog witch')));
  assert.equal(enemySpecialIcon(saved),'enemy-curse');
  assert.equal(enemySpecialIcon({...saved,names:['Iné meno','Different name']}),'enemy-curse');
  assert.equal(enemySpecialIcon({...saved,special:['Nový útok','New attack'],mechanic:'poison'}),'poison');
});
test('curse, roar, moonlight and defensive debuffs keep their semantic artwork',()=>{
  const hero=freshHero();
  const curse=visibleEffects({...hero,battle:{...startBattle(enemy('Bog witch')),effects:[{kind:'burn',turns:3,power:4}]}}).player.find(entry=>entry.id==='burn');
  assert.equal(curse.art,'enemy-curse');assert.deepEqual(curse.name,['Hnilobná kliatba','Rotting Curse']);
  for(const name of ['Canyon Berserker','Lunar Automaton']){
    const foe=enemy(name);
    const effect=visibleEffects({...hero,battle:{...startBattle(foe),effects:[{kind:'weakness',turns:3,power:4}]}}).player.find(entry=>entry.id==='weakness');
    assert.equal(effect.art,enemySpecialIcon(foe));
  }
  const shield=visibleEffects({...hero,battle:{...startBattle(enemy('Reef Crab')),shield:2}}).enemy.find(entry=>entry.id==='enemy-shield');
  assert.equal(shield.art,'enemy-shell');
});
