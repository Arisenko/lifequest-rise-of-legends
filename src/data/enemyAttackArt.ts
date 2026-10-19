import type { Encounter } from './encounters';
import { lateBasicArt } from './lateAdventures';

export const enemySpecialArt={
  'Venomous Thorns':'enemy-poison',
  'Fallen Garrison Strike':'enemy-shield',
  'Memory Theft':'enemy-drain',
  'Rotting Curse':'enemy-curse',
  'Frost Strike':'enemy-frost',
  'Searing Blade':'enemy-searing-blade',
  'Crystal Venom':'poison',
  'Stone Cover':'enemy-stone-cover',
  'Blood Feast':'enemy-fangs',
  'Crystal Wall':'enemy-crystal-wall',
  'Ash Curse':'enemy-burn',
  'Crushing Roar':'enemy-roar',
  'Canyon Armor':'enemy-crystal-wall',
  'Molten Breath':'enemy-burn',
  'Life Tide':'enemy-drain',
  Moonbeam:'enemy-moonbeam',
  'Reef Shell':'enemy-shell',
  'Rotting Anchor':'enemy-anchor',
  'Forbidden Page':'enemy-book',
  'Deep Venom':'poison',
  'Moon Judgment':'enemy-moonbeam',
  'Soul Eclipse':'enemy-drain',
  Thunderclap:'enemy-roar',
  'Solar Flare':'enemy-burn',
  'Void Siphon':'enemy-drain',
} as const;

export type EnemyAttackArt=typeof enemySpecialArt[keyof typeof enemySpecialArt]|'enemy-blade'|'enemy-arrow'|'enemy-crush';
export const enemySemanticFrames:Record<string,number>={'enemy-curse':0,'enemy-roar':1,'enemy-moonbeam':2,'enemy-anchor':3,'enemy-book':4,'enemy-crystal-wall':5,'enemy-shell':6,'enemy-searing-blade':7,'enemy-stone-cover':8};
export const enemyBasicArt:Record<string,EnemyAttackArt>=Object.fromEntries([
  ['Road Bandit Scout','enemy-arrow'],['Road Bandit Raider','enemy-blade'],['Road Bandit Captain','enemy-blade'],
  ...Object.entries(lateBasicArt),
  ...['Slizký Škriatok','Forest Outcast','Shrine Guardian','Bone sentry','Elite sentinel','Spectral Knight','Catacomb Executioner','Ravenmoor lord','Drowned wanderer','Drowned Knight','Drowned king','Mountain Bandit','Forge Guardian','Canyon Marauder','Canyon Berserker','Crystal Knight'].map(name=>[name,'enemy-blade']),
  ...['Thorn wolf','Wild Boar','Thorn Spider','Castle Rat','Marsh Crawler','Grave Swarm','Frost wolf','Ice Spider','Crimson Scorpion','Canyon Vulture','Reef Crab','Tide Serpent'].map(name=>[name,'enemy-fangs']),
  ...['Knižný Golem','Stone colossus','Red Crystal Golem','Lunar Automaton'].map(name=>[name,'enemy-crush']),
  ...['Shadow stalker','Cloak Wraith','Wandering Shadow','Black Druid','Memory Devourer','Ancient shade','Drowned Acolyte','Astral Oracle'].map(name=>[name,'enemy-drain']),
  ['Undead Crossbowman','enemy-arrow'],['Root keeper','enemy-poison'],['Night Screecher','enemy-roar'],
  ['Bog witch','enemy-curse'],['Marsh Oracle','enemy-curse'],['Frost Shaman','enemy-frost'],
  ['Emberlord','enemy-searing-blade'],['Ember Witch','enemy-burn'],['Crystal Basilisk','enemy-fangs'],
  ['Barnacle Sailor','enemy-anchor'],['Moon Librarian','enemy-book'],['Astral Inquisitor','enemy-moonbeam'],
] as [string,EnemyAttackArt][]);

type EnemyVisual=Pick<Encounter,'name'|'special'|'mechanic'>;
export function enemySpecialIcon(enemy:EnemyVisual):EnemyAttackArt {
  const explicit=enemySpecialArt[enemy.special[1] as keyof typeof enemySpecialArt];
  if(explicit)return explicit;
  return ({poison:'poison',shield:'enemy-shield',drain:'enemy-drain',frost:'enemy-frost',burn:'enemy-burn'} as const)[enemy.mechanic];
}
export function enemyBasicIcon(enemy:EnemyVisual):EnemyAttackArt {
  return enemyBasicArt[enemy.name]||enemySpecialIcon(enemy);
}
