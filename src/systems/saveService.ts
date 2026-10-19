import { isConsumable, supplyLimit } from '../data/consumables';
import type { Hero } from '../types/hero';
import { itemData } from '../data/loot';
import { travelEventKinds } from '../data/travelEvents';

export const SAVE_KEY='lifequest-save';
export const BACKUP_KEY='lifequest-save-backup';
export const RECOVERY_KEY='lifequest-save-damaged';
export const CHECKPOINT_KEY='lifequest-save-checkpoint';
export const SCREEN_KEY='lifequest-tab';
export type SaveStorage=Pick<Storage,'getItem'|'setItem'>;
const object=(value:unknown):value is Record<string,unknown>=>Boolean(value)&&typeof value==='object'&&!Array.isArray(value);
const number=(value:unknown)=>typeof value==='number'&&Number.isFinite(value)&&value>=0&&value<=Number.MAX_SAFE_INTEGER;
const strings=(value:unknown):value is string[]=>Array.isArray(value)&&value.length<=10000&&value.every(entry=>typeof entry==='string'&&entry.length<=300);
const travelEvent=(entry:unknown)=>object(entry)&&typeof entry.id==='string'&&entry.id.length<=300&&typeof entry.areaId==='string'&&entry.areaId.length<=100&&['adventure','dungeon','raid'].includes(String(entry.mode))&&travelEventKinds.includes(entry.kind as typeof travelEventKinds[number])&&number(entry.stage)&&Number.isInteger(entry.stage)&&number(entry.seed)&&Number(entry.seed)<1&&number(entry.level)&&Number(entry.level)>=1&&Number(entry.level)<=100;
export function decodeSave(raw:string):Hero {
  if(raw.length>5_000_000)throw new Error('save-too-large');
  let value:unknown=JSON.parse(raw);
  if(object(value)&&value.format==='lifequest') {
    if(value.version!==2)throw new Error('save-version');
    value=value.hero;
  }
  if(!object(value)||typeof value.name!=='string'||value.name.length>100||typeof value.className!=='string'||!object(value.stats))throw new Error('save-shape');
  for(const key of ['level','xp','gold','hp'])if(!number(value[key]))throw new Error('save-number');
  if(Number(value.level)<1||Number(value.level)>100||!Number.isInteger(value.level))throw new Error('save-level');
  for(const key of ['Strength','Intelligence','Discipline','Vitality'])if(!number(value.stats[key]))throw new Error('save-stat');
  for(const key of ['inventory','equipped','completed'])if(!strings(value[key]))throw new Error('save-list');
  for(const key of ['rewardChest','clearedAreas','ownedMounts','visitedAreas'])if(value[key]!==undefined&&!strings(value[key]))throw new Error('save-list');
  if(value.preparedConsumables!==undefined&&(!strings(value.preparedConsumables)||value.preparedConsumables.length>supplyLimit(value.className)||value.preparedConsumables.some(id=>!isConsumable(id))))throw new Error('save-supplies');
  if(value.journey!==undefined&&value.journey!==null&&(!object(value.journey)||typeof value.journey.areaId!=='string'||!number(value.journey.seed)||Number(value.journey.seed)>=1||!number(value.journey.step)||Number(value.journey.step)>5||!Number.isInteger(value.journey.step)||!number(value.journey.mistakes)||Number(value.journey.mistakes)>3||!Number.isInteger(value.journey.mistakes)||!number(value.journey.level)||Number(value.journey.level)<1||Number(value.journey.level)>100))throw new Error('save-journey');
  if(object(value.journey)&&value.journey.rulesVersion!==undefined&&(value.journey.rulesVersion!==2||!Array.isArray(value.journey.choices)||value.journey.choices.length!==value.journey.step||value.journey.choices.some(row=>!Number.isInteger(row)||Number(row)<0||Number(row)>2)))throw new Error('save-journey-route');
  if(object(value.journey)){
    const journey=value.journey;
    if(journey.acceptedSteps!==undefined&&(!Array.isArray(journey.acceptedSteps)||journey.acceptedSteps.length>15||journey.acceptedSteps.some(step=>typeof step!=='string'||! /^[0-4]:[0-2]$/.test(step))))throw new Error('save-journey-accepted');
    if(journey.hazardsSeen!==undefined&&(!Array.isArray(journey.hazardsSeen)||journey.hazardsSeen.length>15||journey.hazardsSeen.some(key=>typeof key!=='string'||key.length>150)))throw new Error('save-journey-seen');
    if(journey.hazard!==undefined&&journey.hazard!==null){const hazard=journey.hazard;if(!object(hazard)||typeof hazard.id!=='string'||hazard.fatal!==undefined&&typeof hazard.fatal!=='boolean'||!['death','bandits','rockfall','poison','ravine','bridge','current','pit','stairs'].includes(String(hazard.kind))||![hazard.stage,hazard.row,hazard.wave].every(Number.isInteger)||Number(hazard.stage)<0||Number(hazard.stage)>4||Number(hazard.row)<0||Number(hazard.row)>2||Number(hazard.wave)<0||Number(hazard.wave)>2||!number(hazard.damage))throw new Error('save-journey-hazard');}
  }
  if(value.defeatedEnemies!==undefined&&(!object(value.defeatedEnemies)||Object.values(value.defeatedEnemies).some(entries=>!strings(entries))))throw new Error('save-enemy-progress');
  if(value.pendingTravelEvent!==undefined&&value.pendingTravelEvent!==null&&!travelEvent(value.pendingTravelEvent))throw new Error('save-travel-event');
  if(value.travelHistory!==undefined&&(!Array.isArray(value.travelHistory)||value.travelHistory.length>20||value.travelHistory.some(entry=>!object(entry)||!travelEvent(entry.event)||!['safe','explore'].includes(String(entry.choice))||typeof entry.success!=='boolean'||typeof entry.item!=='boolean'||!['hp','energy'].every(key=>typeof entry[key]==='number'&&Number.isFinite(entry[key])&&Math.abs(Number(entry[key]))<=Number.MAX_SAFE_INTEGER)||!['gold','xp'].every(key=>number(entry[key])))))throw new Error('save-travel-history');
  for(const key of ['dungeonEntries','raidEntries'])if(value[key]!==undefined&&(!object(value[key])||Object.values(value[key]).some(entry=>!number(entry))))throw new Error('save-entry-history');
  for(const key of ['inventory','equipped','rewardChest'])if(Array.isArray(value[key])&&(value[key] as string[]).some(id=>!itemData[id]))throw new Error('save-unknown-item');
  for(const key of ['face','hair','beard','hairColor','mount'])if(value[key]!==undefined&&value[key]!==null&&typeof value[key]!=='string')throw new Error('save-appearance');
  if(!Array.isArray(value.effects)||value.effects.length>100||value.effects.some(effect=>!object(effect)||typeof effect.name!=='string'||!['buff','debuff'].includes(String(effect.kind))||!number(effect.turns)||!number(effect.power)))throw new Error('save-effects');
  for(const key of ['energy','energyUpdatedAt','lodgingUpdatedAt','restUntil','equipmentSerial'])if(value[key]!==undefined&&!number(value[key]))throw new Error('save-number');
  for(const key of ['creationComplete','classChoicePending','energyResting','mountEquipmentMigrated'])if(value[key]!==undefined&&typeof value[key]!=='boolean')throw new Error('save-boolean');
  if(value.equipment!==undefined&&(!Array.isArray(value.equipment)||value.equipment.length>100||value.equipment.some(entry=>!object(entry)||!['instanceId','itemId','slot'].every(key=>typeof entry[key]==='string'))))throw new Error('save-equipment');
  if(value.questProgress!==undefined&&(!object(value.questProgress)||Object.values(value.questProgress).some(entry=>!object(entry)||!number(entry.count)||typeof entry.period!=='string'||entry.completedAt!==undefined&&!number(entry.completedAt))))throw new Error('save-quests');
  if(value.chatMessages!==undefined&&(!Array.isArray(value.chatMessages)||value.chatMessages.length>100||value.chatMessages.some(entry=>!object(entry)||!['id','channel','sender','text'].every(key=>typeof entry[key]==='string')||!number(entry.createdAt))))throw new Error('save-chat');
  if(value.purchases!==undefined&&(!object(value.purchases)||Object.values(value.purchases).some(entry=>typeof entry!=='boolean')))throw new Error('save-shop');
  if(value.guild!==undefined&&value.guild!==null&&(!object(value.guild)||typeof value.guild.name!=='string'||typeof value.guild.founder!=='string'||!Array.isArray(value.guild.members)||value.guild.members.some(member=>!object(member)||typeof member.name!=='string'||!['master','trustee','moderator','member'].includes(String(member.role)))))throw new Error('save-guild');
  if(value.dungeonRun!==undefined&&value.dungeonRun!==null&&(!object(value.dungeonRun)||!number(value.dungeonRun.stage)||typeof value.dungeonRun.complete!=='boolean'))throw new Error('save-dungeon');
  if(object(value.dungeonRun)&&(value.dungeonRun.failed!==undefined&&typeof value.dungeonRun.failed!=='boolean'||value.dungeonRun.startedAt!==undefined&&!number(value.dungeonRun.startedAt)))throw new Error('save-dungeon-state');
  if(value.battle!==undefined&&value.battle!==null) {
    const battle=value.battle;
    if(!object(battle)||!object(battle.enemy)||!number(battle.hp)||!number(battle.turn)||!number(battle.stamina)||!number(battle.shield)||!number(battle.focus)||!Array.isArray(battle.effects)||!Array.isArray(battle.log))throw new Error('save-battle');
    const reward=battle.reward;
    if(object(reward)&&reward.equippedItems!==undefined){const items=reward.items;if(!Array.isArray(items)||!Array.isArray(reward.equippedItems)||reward.equippedItems.some(index=>!Number.isInteger(index)||Number(index)<0||Number(index)>=items.length))throw new Error('save-reward-equipped');}
    const enemy=battle.enemy;
    if(enemy.combat!==undefined&&(!object(enemy.combat)||!['specialEvery','specialMultiplier','effectPower','effectDuration','shieldPower','enrageMultiplier','drainRatio'].every(key=>object(enemy.combat)&&number(enemy.combat[key]))||Number(enemy.combat.specialEvery)<1||Number(enemy.combat.specialEvery)>10||!Number.isInteger(enemy.combat.specialEvery)||Number(enemy.combat.effectDuration)<1||Number(enemy.combat.effectDuration)>10||!Number.isInteger(enemy.combat.effectDuration)||Number(enemy.combat.drainRatio)>1))throw new Error('save-enemy-combat');
    if(battle.reward!==undefined&&(!object(battle.reward)||battle.ended!=='win'||!number(battle.reward.xp)||!number(battle.reward.gold)||!strings(battle.reward.items)||battle.reward.items.some(id=>!itemData[id])))throw new Error('save-battle-reward');
    if(typeof enemy.name!=='string'||!number(enemy.hp)||!number(enemy.damage)||!number(enemy.reward)||!number(enemy.gold)||!strings(enemy.drops)||!['normal','elite','boss'].includes(String(enemy.kind))||!strings(enemy.names)||enemy.names.length!==2||!strings(enemy.special)||enemy.special.length!==2||!strings(enemy.description)||!['poison','burn','frost','shield','drain'].includes(String(enemy.mechanic)))throw new Error('save-enemy');
    for(const effects of [battle.effects,battle.foeEffects||[]])if(!Array.isArray(effects)||effects.some(effect=>!object(effect)||!['poison','burn','weakness'].includes(String(effect.kind))||!number(effect.turns)||!number(effect.power)))throw new Error('save-battle-effects');
    if(battle.log.some(entry=>!Array.isArray(entry)||entry.length!==2||!entry.every(text=>typeof text==='string')))throw new Error('save-log');
    for(const key of ['skillReadyAt','relicReadyAt','powerHits','rage','runes','chain','marked'])if(battle[key]!==undefined&&!number(battle[key]))throw new Error('save-battle-number');
    if(battle.classBuff!==undefined&&(!object(battle.classBuff)||!number(battle.classBuff.turns)||!number(battle.classBuff.power)))throw new Error('save-class-buff');
    if(battle.ended!==undefined&&!['win','loss','fled'].includes(String(battle.ended)))throw new Error('save-result');
  }
  return value as unknown as Hero;
}
export function encodeSave(hero:Hero) {
  const raw=JSON.stringify({format:'lifequest',version:2,exportedAt:new Date().toISOString(),hero});
  decodeSave(raw);
  return raw;
}
export function saveGame(storage:SaveStorage,hero:Hero) {
  const next=encodeSave(hero),previous=storage.getItem(SAVE_KEY);
  if(previous) {
    const current=decodeSave(previous);
    if(JSON.stringify(current)===JSON.stringify(hero))return;
    storage.setItem(BACKUP_KEY,previous);
  }
  storage.setItem(SAVE_KEY,next);
}
export function replaceSave(storage:SaveStorage,hero:Hero) {
  const next=encodeSave(hero),previous=storage.getItem(SAVE_KEY);
  if(previous) {
    let valid=true;
    try {decodeSave(previous);}catch {valid=false;}
    storage.setItem(valid?BACKUP_KEY:RECOVERY_KEY,previous);
    if(valid)storage.setItem(CHECKPOINT_KEY,previous);
  }
  storage.setItem(SAVE_KEY,next);
}
export function readPreference(key:string,fallback:string) {
  try{return localStorage.getItem(key)||fallback;}catch{return fallback;}
}
export function writePreference(key:string,value:string) {
  try{localStorage.setItem(key,value);}catch{return false;}
  return true;
}
