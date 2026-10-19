import { adventures } from './adventures';
import { balanceEncounterRewards } from './encounterRewards';
import { classItems } from './classItems';
import { magicItems } from './magicItems';
import { extraAreas } from './extraAdventures';
import { lateAreas } from './lateAdventures';
import type { ExpeditionEnemy } from './adventures';
import type { EnemyCombat } from './enemyCombat';

export type Mechanic = 'poison' | 'shield' | 'drain' | 'frost' | 'burn';
export type Encounter = ExpeditionEnemy & { mechanic: Mechanic; special: [string, string]; description: [string, string]; combat?: EnemyCombat };
const profiles: { mechanic: Mechanic; special: [string, string]; description: [string, string]; boss: [string, string, string]; extras: [string, string][] }[] = [
  { mechanic: 'poison', special: ['Jedovaté tŕne', 'Venomous Thorns'], description: ['Lesný lovec používa jed. Jeho zvláštny útok otrávi na 3 ťahy (3 HP za ťah).', 'A woodland hunter uses venom. Its special poisons you for 3 turns (3 HP per turn).'], boss: ['Root keeper', 'Prastarý koreňový kráľ', 'Ancient Root King'], extras: [['Divoký kanec', 'Wild Boar'], ['Tŕňový pavúk', 'Thorn Spider'], ['Lesný vyvrheľ', 'Forest Outcast'], ['Strážca svätyne', 'Shrine Guardian']] },
  { mechanic: 'shield', special: ['Úder padlej posádky', 'Fallen Garrison Strike'], description: ['Obrnený strážca vytvorí štít na 2 ťahy. Štít zníži každý zásah o 4.', 'An armored sentinel gains a shield for 2 turns, reducing each hit by 4.'], boss: ['Ravenmoor lord', 'Prekliaty pán Havranmoru', 'Cursed Lord of Ravenmoor'], extras: [['Hradná krysa', 'Castle Rat'], ['Nemŕtvy kušník', 'Undead Crossbowman'], ['Prízračný rytier', 'Spectral Knight'], ['Kat z katakomb', 'Catacomb Executioner']] },
  { mechanic: 'drain', special: ['Krádež spomienok', 'Memory Theft'], description: ['Prízrak odčerpáva život: zvláštny útok ho vylieči o polovicu spôsobeného poškodenia.', 'A wraith drains life: its special heals it for half the damage dealt.'], boss: ['Ancient shade', 'Prastarý tieň', 'Ancient Shade'], extras: [['Bludný tieň', 'Wandering Shadow'], ['Nočný škriekavec', 'Night Screecher'], ['Čierny druid', 'Black Druid'], ['Požierač spomienok', 'Memory Devourer']] },
  { mechanic: 'burn', special: ['Hnilobná kliatba', 'Rotting Curse'], description: ['Nemŕtvy uvalí kliatbu na 3 ťahy: 4 poškodenia za ťah.', 'An undead creature applies a curse for 3 turns: 4 damage per turn.'], boss: ['Drowned king', 'Utopený kráľ', 'Drowned King'], extras: [['Močiarny plaz', 'Marsh Crawler'], ['Hrobový roj', 'Grave Swarm'], ['Utopený rytier', 'Drowned Knight'], ['Veštkyňa močiarov', 'Marsh Oracle']] },
  { mechanic: 'frost', special: ['Mrazivý úder', 'Frost Strike'], description: ['Horský lovec oslabí tvoj útok o 4 na 3 ťahy.', 'A mountain hunter weakens your attack by 4 for 3 turns.'], boss: ['Emberlord', 'Pán uhlíkov', 'Emberlord'], extras: [['Horský zbojník', 'Mountain Bandit'], ['Ľadový pavúk', 'Ice Spider'], ['Mrazivý šaman', 'Frost Shaman'], ['Kováčsky strážca', 'Forge Guardian']] },
];

export const encounterAreas = adventures.map((area, index) => {
  const profile = profiles[index];
  const bossBase = area.enemies.find(enemy => enemy.kind === 'boss') || area.enemies[area.enemies.length - 1];
  const decorate = (enemy: ExpeditionEnemy): Encounter => ({ ...enemy, drops: enemy.drops.filter(id => (enemy.kind !== 'normal' || id !== 'Runic staff') && (enemy.kind === 'boss' || !['Dawn relic', 'Emberlord blade'].includes(id))), mechanic: profile.mechanic, special: profile.special, description: profile.description });
  const original = area.enemies.filter(enemy => enemy.kind !== 'boss' && enemy.name !== profile.boss[0]).map(decorate);
  const extras = profile.extras.map(([sk, en], position) => decorate({ name: en, names: [sk, en], kind: position >= 2 ? 'elite' : 'normal', hp: 28 + index * 18 + position * 12, reward: 35 + index * 30 + position * 20, gold: 14 + index * 10 + position * 8, damage: 4 + index + position, drops: position >= 2 ? ['Iron helm', 'Guard boots', 'Ember cloak', 'Runic staff', 'Dawn relic'] : ['Rusty charm', 'Guard boots', 'Ember cloak'] }));
  const boss: Encounter = decorate({ ...bossBase, name: profile.boss[0], names: [profile.boss[1], profile.boss[2]], kind: 'boss', hp: 110 + index * 40, damage: 9 + index * 2, reward: 240 + index * 140, gold: 100 + index * 65, drops: ['Iron helm', 'War drum', 'Ember cloak', 'Runic staff', 'Dawn relic', ...(index === 4 ? ['Emberlord blade'] : [])] });
  if (index === 4) { boss.mechanic = 'burn'; boss.special = ['Rozžeravená čepeľ', 'Searing Blade']; boss.description = ['Vládca vyhne ťa podpáli na 3 ťahy (4 HP za ťah). Pri polovici života sa rozzúri.', 'The forge lord burns you for 3 turns (4 HP per turn). At half health he becomes enraged.']; }
  return { ...area, enemies: [...original, ...extras, boss] };
}).concat(extraAreas,lateAreas).map(area=>({
  ...area,
  enemies:balanceEncounterRewards(area.enemies.map(enemy=>({
    ...enemy,
    drops:[...new Set([...enemy.drops,...Object.keys(classItems),'Apprentice wand','Oak staff',...Object.entries(magicItems).filter(([,item])=>(item.level||1)<=area.level+2).map(([id])=>id)])],
  }))),
}));
export const encounters = encounterAreas.flatMap(area => area.enemies);
