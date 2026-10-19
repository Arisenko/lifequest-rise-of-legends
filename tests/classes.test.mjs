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
const {classes,classFamilies,classId,startingStats,classAllowsItem,chooseLegacyClass}=await import(moduleUrl('src/data/classes.ts'));
const {itemData}=await import(moduleUrl('src/data/loot.ts'));
const {equipItem,unequipItem,meetsRequirements,itemSlots}=await import(moduleUrl('src/data/equipment.ts'));
const {normalizePlayer,derivedStats}=await import(moduleUrl('src/data/playerSystems.ts'));
const {battleTurn,startBattle}=await import(moduleUrl('src/data/battle.ts'));
const {equipBattleReward}=await import(moduleUrl('src/data/rewardEquipment.ts'));
const {prepareSupply,removeSupply,supplyLimit,inventoryCategory}=await import(moduleUrl('src/data/consumables.ts'));
const {carriedWeight}=await import(moduleUrl('src/data/playerSystems.ts'));

const {encounters}=await import(moduleUrl('src/data/encounters.ts'));
const {visibleEffects}=await import(moduleUrl('src/data/statusEffects.ts'));
const hero=(className)=>({className,classRulesVersion:2,level:100,hp:300,stats:{Strength:100,Intelligence:100,Discipline:100,Vitality:100},inventory:[],equipped:[],equipment:[],effects:[],gold:123,xp:45});
const target={...encounters[0],hp:100000,damage:1};
test('loot comparisons match real equipment swaps and empty ring slots',async()=>{
  const {compareEquipment}=await import(moduleUrl('src/data/equipmentComparison.ts'));
  let owner=equipItem({...hero('Bojovník'),inventory:['Iron helm','Iron helm']},0);
  const comparison=compareEquipment(owner,'Iron helm');
  assert.equal(comparison.replaced.length,1);
  assert.deepEqual(comparison.after,derivedStats(equipItem(owner,0)));
  assert.deepEqual(comparison.before,derivedStats(owner));
  const empty=compareEquipment(hero('Bojovník'),'Iron helm');
  assert.equal(empty.replaced.length,0);
  const ring=Object.keys(itemData).find(id=>itemData[id].slot==='Prsteň'&&meetsRequirements(hero('Bojovník'),id));
  owner=equipItem({...hero('Bojovník'),inventory:[ring,ring]},0);
  const free=compareEquipment(owner,ring);
  assert.equal(free.slot,'Prsteň 2');
  assert.equal(free.replaced.length,0);
  assert.deepEqual(free.after,derivedStats(equipItem(owner,0)));
});
test('victory rewards equip individual copies once and preserve the reward receipt',()=>{
  const owner={...hero('Bojovník'),inventory:['Iron helm','Iron helm'],battle:{...startBattle(target),ended:'win',reward:{xp:30,gold:10,items:['Iron helm','Iron helm']}}};
  const first=equipBattleReward(owner,0);
  assert.equal(first.inventory.length,1);
  assert.equal(first.equipment.length,1);
  assert.deepEqual(first.battle.reward.items,owner.battle.reward.items);
  assert.strictEqual(equipBattleReward(first,0),first);
  const second=equipBattleReward(first,1);
  assert.equal(second.inventory.length,1);
  assert.equal(second.equipment.length,1);
  assert.deepEqual(second.battle.reward.equippedItems,[0,1]);
  assert.equal(second.gold,owner.gold);
  assert.equal(second.xp,owner.xp);
  assert.strictEqual(equipBattleReward({...owner,battle:{...owner.battle,ended:undefined}},0).inventory,owner.inventory);
  const mage={...owner,className:'Mág'};
  assert.strictEqual(equipBattleReward(mage,0),mage);
});
test('victory rewards can be equipped from overflow or prepared as consumables',()=>{
  const owner={...hero('Bojovník'),inventory:[],rewardChest:['Iron helm'],battle:{...startBattle(target),ended:'win',reward:{xp:0,gold:0,items:['Iron helm']}}};
  const equipped=equipBattleReward(owner,0);
  assert.equal(equipped.rewardChest.length,0);
  assert.equal(equipped.equipment[0].itemId,'Iron helm');
  const herb={...owner,rewardChest:[],inventory:['Healing herb'],battle:{...owner.battle,reward:{xp:0,gold:0,items:['Healing herb']}}};
  const prepared=equipBattleReward(herb,0);
  assert.deepEqual(prepared.preparedConsumables,['Healing herb']);
  assert.equal(prepared.inventory.length,0);
  const full={...herb,preparedConsumables:Array(3).fill('Healing herb')};
  assert.strictEqual(equipBattleReward(full,0),full);
});

test('combat supplies allow an explicit owned potion and reject unowned or level-locked items',()=>{
  const owner={...hero('Bojovník'),hp:10,level:1,preparedConsumables:['Healing potion 1','Healing potion 2','Healing herb']};
  const battle=startBattle(target,30);
  const used=battleTurn(battle,owner,'consumable',0,0,'Healing herb');
  assert.equal(used.consumedItem,'Healing herb');
  assert.equal(used.battle.turn,2);
  assert.equal(used.hp,21);
  assert.equal(used.battle.stamina,30);
  for(const item of ['Healing potion 2','War drum','Rusty charm'])assert.strictEqual(battleTurn(battle,owner,'consumable',0,0,item).battle,battle);
  const large=battleTurn(battle,{...owner,level:100},'consumable',0,0,'Healing potion 2');
  assert.equal(large.consumedItem,'Healing potion 2');
  assert.equal(large.hp,44);
});

test('war drum consumes one combat turn and grants a bounded nonstacking attack buff',()=>{
  const owner={...hero('Alchymista'),preparedConsumables:['War drum','War drum'],hp:100};
  const first=battleTurn(startBattle(target,30),owner,'consumable',0,0,'War drum');
  assert.equal(first.consumedItem,'War drum');
  assert.equal(first.battle.turn,2);
  assert.equal(first.battle.classBuff.turns,3);
  assert.equal(first.hp,99);
  const saved=JSON.parse(JSON.stringify(first.battle));
  const repeated=battleTurn(saved,owner,'consumable',0,0,'War drum');
  assert.deepEqual(repeated.battle.classBuff,first.battle.classBuff);
  const buffed=battleTurn(saved,owner,'attack',0,0);
  const plain=battleTurn({...saved,classBuff:undefined},owner,'attack',0,0);
  assert(buffed.battle.hp<plain.battle.hp);
  assert.strictEqual(battleTurn({...saved,ended:'loss'},owner,'consumable',0,0,'War drum').consumedItem,undefined);
  const dying={...saved,effects:[{kind:'poison',turns:2,power:10000}]};
  assert.equal(battleTurn(dying,owner,'consumable',0,0,'War drum').consumedItem,undefined);
});

test('rarity combat powers apply only to equipped gear and strongest passive does not stack',()=>{
  const base=hero('Mág');
  const epic={...base,equipped:['Runic staff']};
  const epicValues=derivedStats(epic);
  assert.equal(epicValues.itemPowers.strongest.damagePercent,5);
  assert.equal(derivedStats({...base,inventory:['Runic staff']}).itemPowers.strongest,null);
  const legendary=derivedStats({...base,equipped:['Dawn relic','Dawn relic','Runic staff']});
  assert.equal(legendary.itemPowers.strongest.damagePercent,10);
  assert.equal(legendary.itemPowers.strongest.leechPercent,5);
  assert.equal(legendary.itemPowers.armor,5);
  assert.equal(derivedStats({...base,equipped:Array(20).fill('Dawn relic')}).itemPowers.armor,12);
  for(const [id,item] of Object.entries(itemData)) {
    const power=derivedStats({...base,equipped:[id]}).itemPowers.strongest;
    if(item.mountId||item.access||item.heal||!['Epic','Legendary','Special'].includes(item.rarity))assert.equal(power,null,id);
    else assert(power,id);
  }
});

test('echo triggers only on attacking turns and survives battle serialization',()=>{
  const fighter={...hero('Mág'),equipped:['Runic staff']};
  let battle=startBattle(target,1000);
  battle=battleTurn(battle,fighter,'attack',0,0).battle;
  const guarded=battleTurn(battle,fighter,'guard',0,0).battle;
  assert.equal(guarded.powerHits,1);
  battle=JSON.parse(JSON.stringify(guarded));
  for(let turn=0;turn<3;turn++)battle=battleTurn(battle,fighter,'attack',0,0).battle;
  assert.equal(battle.powerHits,4);
  assert(battle.log.some(line=>line[1].startsWith('Item echo:')));
});

test('relic abilities require gear and stamina, persist cooldown, and special adds burn',()=>{
  const fighter={...hero('Bojovník'),equipped:['Emberlord blade']};
  const initial=startBattle(target,100);
  const result=battleTurn(initial,fighter,'relic',0,0);
  assert.equal(result.battle.stamina,92);
  assert.equal(result.battle.relicReadyAt,6);
  assert(result.battle.foeEffects.some(effect=>effect.kind==='burn'&&effect.turns===3));
  const saved=JSON.parse(JSON.stringify(result.battle));
  assert.equal(battleTurn(saved,fighter,'relic',0,0).battle,saved);
  assert.equal(battleTurn(initial,{...fighter,equipped:[]},'relic',0,0).battle,initial);
  const tired={...initial,stamina:7};
  assert.equal(battleTurn(tired,fighter,'relic',0,0).battle,tired);
  const legendary=battleTurn(initial,{...fighter,equipped:['Dawn relic']},'relic',0,0);
  assert.equal(legendary.battle.relicReadyAt,7);
  assert.equal(legendary.battle.foeEffects.length,0);
  const ended={...saved,ended:'win'};
  assert.equal(battleTurn(ended,fighter,'relic',0,0).battle,ended);
});

test('life steal is capped by actual enemy health and player maximum',()=>{
  const fighter={...hero('Bojovník'),hp:100,equipped:['Dawn relic']};
  const battle=startBattle({...target,hp:10},100);
  const result=battleTurn(battle,fighter,'attack',0,0);
  assert.equal(result.hp,100);
  const wounded=battleTurn(startBattle(target,100),fighter,'attack',0,0);
  assert(wounded.hp>100);
  const full={...fighter,hp:derivedStats(fighter).maxHp};
  const victory=battleTurn(battle,full,'attack',0,0);
  assert.equal(victory.hp,full.hp);
});

test('six classes form three pairs with identical eligibility and starting attributes',()=>{
  assert.equal(Object.keys(classes).length,6);
  assert(!classes.Novice);
  for(const pair of [['Mág','Alchymista'],['Bojovník','Paladin'],['Lovec','Assassín']]) {
    assert.deepEqual(startingStats(pair[0]),startingStats(pair[1]));
    for(const item of Object.values(itemData))assert.equal(classAllowsItem(pair[0],item),classAllowsItem(pair[1],item));
  }
  for(const [id,profile] of Object.entries(classes)) {
    assert.equal(profile.names.length,2);
    assert.equal(profile.description.length,2);
    assert(fs.statSync('public/assets/characters/classes/'+profile.portrait+'.png').size>1000);
    for(const item of Object.values(itemData).filter(item=>item.armorType))assert.equal(classAllowsItem(id,item),item.armorType===classFamilies[profile.family].armor);
  }
});

test('class and material checks are enforced by the actual equip action',()=>{
  for(const id of Object.keys(classes)) {
    for(const item of ['Woven robe','Leather armor','Iron helm','Runic staff','Hunter bow','Guard blade','Alchemy grimoire','Catalyst retort']) {
      const owner={...hero(id),inventory:[item]};
      const allowed=classAllowsItem(id,itemData[item]);
      assert.equal(meetsRequirements(owner,item),allowed,id+': '+item);
      assert.equal(equipItem(owner,0).equipped.includes(item),allowed,id+': '+item);
    }
  }
});

test('books and catalysts combine; staves and bows occupy both hands without duplicating items',()=>{
  let mage=equipItem({...hero('Alchymista'),inventory:['Alchemy grimoire','Catalyst retort','Runic staff']},0);
  mage=equipItem(mage,0);
  assert.equal(mage.equipment.length,2);
  assert.equal(mage.equipment.find(entry=>entry.itemId==='Catalyst retort').slot,'Zbraň 2');
  mage=equipItem(mage,mage.inventory.indexOf('Runic staff'));
  assert.deepEqual(mage.equipped,['Runic staff']);
  assert.deepEqual(mage.inventory.sort(),['Alchemy grimoire','Catalyst retort'].sort());
  assert.strictEqual(equipItem(mage,mage.inventory.indexOf('Catalyst retort'),'Zbraň 2'),mage);
  const returned=unequipItem(mage,mage.equipment[0].instanceId);
  assert.equal(returned.inventory.filter(id=>id==='Runic staff').length,1);
  assert.deepEqual(itemSlots('Hunter bow','Lovec'),['Zbraň 1']);
  assert.deepEqual(itemSlots('Shadow dagger','Assassín'),['Zbraň 1','Zbraň 2']);
});

test('two-handed replacement refuses overflow and incompatible saved equipment is preserved',()=>{
  let scout=equipItem({...hero('Assassín'),inventory:['Shadow dagger','Shadow dagger']},0);
  scout=equipItem(scout,0);
  const full={...scout,inventory:['Hunter bow',...Array(49).fill('Rusty charm')]};
  assert.strictEqual(equipItem(full,0),full);
  const swapped=equipItem({...full,inventory:full.inventory.slice(0,49)},0);
  assert.equal(swapped.inventory.length,50);
  assert.deepEqual(swapped.equipped,['Hunter bow']);
  const mage={...hero('Mág'),mountEquipmentMigrated:true,inventory:Array(50).fill('Rusty charm'),equipped:['Iron helm'],equipment:[{instanceId:'old-helm',itemId:'Iron helm',slot:'Helma'}]};
  const normalized=normalizePlayer(mage);
  assert(!normalized.equipped.includes('Iron helm'));
  assert.equal([...normalized.inventory,...normalized.rewardChest].filter(id=>id==='Iron helm').length,1);
});

test('legacy classes migrate once, preserve earned progress and offer a real class choice',()=>{
  const legacy={...hero('Novice'),level:20,classRulesVersion:undefined,stats:{Strength:10,Intelligence:10,Discipline:10,Vitality:10},face:'3'};
  const migrated=normalizePlayer(legacy);
  assert.equal(migrated.className,'Bojovník');
  assert(migrated.classChoicePending);
  assert.equal(migrated.stats.Strength,14);
  assert.equal(migrated.stats.Vitality,13);
  assert.equal(migrated.gold,123);assert.equal(migrated.xp,45);assert.equal(migrated.face,'3');
  assert.deepEqual(normalizePlayer(migrated).stats,migrated.stats);
  assert.equal(classId('Strážca'),'Bojovník');
  assert.equal(classId('Študent runiek'),'Mág');
  const chosen=chooseLegacyClass(migrated,'Mág');
  assert.equal(chosen.stats.Strength,10);
  assert.equal(chosen.stats.Intelligence,14);
  assert.equal(chosen.classChoicePending,false);
  assert.strictEqual(chooseLegacyClass(chosen,'Paladin'),chosen);
  const fighting={...migrated,battle:{turn:1}};
  assert.strictEqual(chooseLegacyClass(fighting,'Mág'),fighting);
});

test('matching armor grants different class benefits within each shared item family',()=>{
  const robes=['Woven robe','Casting gloves'],plate=['Iron helm','Guard boots'],leather=['Leather armor','Scout pants'];
  const mage=derivedStats({...hero('Mág'),equipped:robes}),alchemist=derivedStats({...hero('Alchymista'),equipped:robes});
  assert(mage.magical>alchemist.magical);assert.equal(alchemist.potionHealing,1.5);
  const warrior=derivedStats({...hero('Bojovník'),equipped:plate}),paladin=derivedStats({...hero('Paladin'),equipped:plate});
  assert(warrior.physical>paladin.physical);assert.equal(paladin.healingPower,1.25);assert.equal(paladin.armor,warrior.armor+2);
  const ranger=derivedStats({...hero('Lovec'),equipped:leather}),assassin=derivedStats({...hero('Assassín'),equipped:leather});
  assert(ranger.physical>assassin.physical);assert.equal(assassin.poisonPower,1.5);
});

test('every class skill spends stamina, persists its state and enforces cooldown',()=>{
  for(const id of Object.keys(classes)) {
    const owner=hero(id),battle=startBattle(target,40),result=battleTurn(battle,owner,'skill',0,0);
    assert.equal(result.battle.stamina,34,id);
    assert.equal(result.battle.skillReadyAt,4,id);
    const saved=JSON.parse(JSON.stringify(result.battle));
    assert.strictEqual(battleTurn(saved,{...owner,hp:result.hp},'skill',0,0).battle,saved,id);
    assert.strictEqual(battleTurn({...battle,stamina:5},owner,'skill',0,0).battle.stamina,5);
  }
});

test('warrior rage and mage runes build and are consumed by their unique attacks',()=>{
  for(const [id,action,resource] of [['Bojovník','attack','rage'],['Mág','magic','runes']]) {
    const owner=hero(id);let battle=startBattle(target,100);
    for(let index=0;index<3;index++)battle=battleTurn(battle,owner,action,0,0).battle;
    assert.equal(battle[resource],3);
    const result=battleTurn(battle,owner,'skill',0,0);
    assert.equal(result.battle[resource],0);
    assert(battle.hp-result.battle.hp>derivedStats(owner)[id==='Mág'?'magical':'physical']);
    if(id==='Mág')assert.equal(result.battle.foeEffects[0].kind,'burn');
  }
});

test('ranger mark boosts subsequent attacks and assassin has critical hits and poison',()=>{
  const ranger=hero('Lovec'),battle=startBattle(target,100);
  const marked=battleTurn(battle,ranger,'skill',0,0).battle;
  const next=battleTurn(marked,ranger,'attack',0,0);
  const unmarked=battleTurn({...marked,marked:0},ranger,'attack',0,0);
  assert(marked.hp-next.battle.hp>marked.hp-unmarked.battle.hp);
  const assassin=hero('Assassín');let chain=startBattle(target,100),damages=[];
  for(let index=0;index<3;index++){const next=battleTurn(chain,assassin,'attack',0,0).battle;damages.push(chain.hp-next.hp);chain=next;}
  assert(damages[2]>damages[1]);
  const poison=battleTurn(battle,assassin,'skill',0,0).battle;
  assert.equal(poison.foeEffects[0].kind,'poison');
  const tick=battleTurn(poison,assassin,'guard',0,0).battle;
  assert.equal(poison.hp-tick.hp,poison.foeEffects[0].power);
});

test('paladin heals, cleanses before ongoing damage and guards against the same enemy turn',()=>{
  const owner={...hero('Paladin'),hp:1},battle={...startBattle(target,100),turn:3,effects:[{kind:'poison',turns:3,power:50}]};
  const result=battleTurn(battle,owner,'skill',0,0);
  assert(result.hp>1);
  assert.equal(result.battle.effects.length,0);
  assert(!result.battle.ended);
});

test('alchemist healing, armor affinity and battle elixir have real measurable effects',()=>{
  const base=hero('Alchymista'),clothed={...base,equipped:['Woven robe','Casting gloves']};
  assert.equal(derivedStats(base).potionHealing,1.25);
  assert.equal(derivedStats(clothed).potionHealing,1.5);
  const owner={...clothed,hp:1,preparedConsumables:['Healing potion 1']},battle=startBattle(target,100);
  const potion=battleTurn(battle,owner,'potion',0,0);
  assert.equal(potion.consumedItem,'Healing potion 1');
  assert.equal(potion.hp,1+30-1);
  assert.equal(potion.battle.turn,2);
  assert.strictEqual(battleTurn(battle,{...owner,preparedConsumables:[]},'potion',0,0).battle,battle);
  const elixir=battleTurn(battle,owner,'skill',0,0).battle;
  assert.equal(elixir.classBuff.turns,3);
  assert(visibleEffects({...owner,battle:elixir}).player.some(effect=>effect.id==='class-elixir'));
  const attack=battleTurn(elixir,owner,'attack',0,0).battle;
  const plain=battleTurn({...elixir,classBuff:undefined},owner,'attack',0,0).battle;
  assert(attack.hp<plain.hp);
});

test('prepared supplies move exact copies, retain weight and enforce class capacity',()=>{
  for(const className of ['Bojovník','Alchymista']){
    let owner={...hero(className),inventory:Array(7).fill('Healing herb')};
    const weight=carriedWeight(owner),limit=className==='Alchymista'?5:3;
    assert.equal(supplyLimit(className),limit);
    for(let index=0;index<limit;index++)owner=prepareSupply(owner,0);
    assert.equal(owner.preparedConsumables.length,limit);
    assert.equal(owner.inventory.length,7-limit);
    assert.equal(carriedWeight(owner),weight);
    assert.strictEqual(prepareSupply(owner,0),owner);
    assert.strictEqual(removeSupply({...owner,battle:startBattle(target)},0).preparedConsumables,owner.preparedConsumables);
    const returned=removeSupply(owner,1);
    assert.equal(returned.preparedConsumables.length,limit-1);
    assert.equal(returned.inventory.length,8-limit);
    assert.equal(carriedWeight(returned),weight);
  }
});
test('unprepared consumables cannot be used in combat or equipped during a battle',()=>{
  const owner={...hero('Bojovník'),hp:10,inventory:['Healing herb']},battle=startBattle(target);
  assert.strictEqual(battleTurn(battle,owner,'consumable',0,0,'Healing herb').battle,battle);
  assert.strictEqual(prepareSupply({...owner,battle},0).inventory,owner.inventory);
  assert.equal(inventoryCategory('Healing herb'),'consumables');
  assert.equal(inventoryCategory('Runic staff'),'weapons');
  assert.equal(inventoryCategory('Iron helm'),'armor');
  assert.equal(inventoryCategory('Rusty charm'),'other');
});
