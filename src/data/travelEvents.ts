import { derivedStats } from './playerSystems';
import { awardXp } from './progression';
import type { PlayerState } from './playerSystems';

export type TravelMode = 'adventure' | 'dungeon' | 'raid';
export type TravelEventKind = 'trap' | 'cache' | 'spring' | 'runes' | 'traveler' | 'shrine';
export type TravelEvent = { id: string; mode: TravelMode; areaId: string; stage: number; kind: TravelEventKind; seed: number; level: number };
export type TravelReceipt = { event: TravelEvent; choice: 'safe' | 'explore'; success: boolean; hp: number; energy: number; gold: number; xp: number; item: boolean };
type Traveler = PlayerState & { level: number; xp: number; gold: number; pendingTravelEvent?: TravelEvent | null; travelHistory?: TravelReceipt[]; battle?: { ended?: string } | null };
export const TRAVEL_EVENT_CHANCE = .35;
export const travelEventKinds: TravelEventKind[] = ['trap', 'cache', 'spring', 'runes', 'traveler', 'shrine'];
export const travelEventDetails: Record<TravelEventKind, { names: [string,string]; description: [string,string]; action: [string,string]; stat: 'Strength' | 'Intelligence' | 'Discipline' | 'Vitality'; icon: string }> = {
  trap: { names: ['Drôt v prachu','Wire in the dust'], description: ['Chodník pretína tenký drôt. Za ním sa črtá opustená zásobáreň.','A thin wire crosses the path. An abandoned supply cache lies beyond.'], action: ['Zneškodniť pascu','Disarm the trap'], stat: 'Discipline', icon: 'guard' },
  cache: { names: ['Zasypaná skrýša','Buried cache'], description: ['Pod spadnutým trámom zbadáš zvyšky cestovateľovej skrýše.','Beneath a fallen beam you spot a traveler’s hidden supplies.'], action: ['Odtlačiť trám','Move the beam'], stat: 'Strength', icon: 'warrior' },
  spring: { names: ['Tichý prameň','Quiet spring'], description: ['V závetrí zurčí čistý prameň. Krátka prestávka by ti prospela.','A clear spring flows in a sheltered hollow. A brief break could help.'], action: ['Oddýchnuť si pri prameni','Rest by the spring'], stat: 'Vitality', icon: 'recover' },
  runes: { names: ['Zabudnuté runy','Forgotten runes'], description: ['Na starej doske žiaria útržky dávneho učenia. Niektoré znaky varujú.','Fragments of ancient knowledge glow on an old tablet. Some symbols are warnings.'], action: ['Rozlúštiť nápis','Decipher the inscription'], stat: 'Intelligence', icon: 'mage' },
  traveler: { names: ['Stratený pútnik','Lost traveler'], description: ['Vyčerpaný pútnik potrebuje pomôcť preniesť zásoby cez rozbitú cestu.','An exhausted traveler needs help carrying supplies across a broken path.'], action: ['Pomôcť pútnikovi','Help the traveler'], stat: 'Strength', icon: 'ranger' },
  shrine: { names: ['Svätyňa na rázcestí','Wayside shrine'], description: ['Medzi ruinami stojí pokojná svätyňa. Na chvíľu môžeš zložiť bremeno.','A peaceful shrine stands among the ruins. You can set down your burden for a moment.'], action: ['Načerpať pokoj','Find a moment of peace'], stat: 'Discipline', icon: 'paladin' },
};

export function createTravelEvent(mode: TravelMode, areaId: string, stage: number, level: number, runId = 0, roll = Math.random(), seed = Math.random()): TravelEvent | null {
  if (roll >= TRAVEL_EVENT_CHANCE) return null;
  const value = Math.max(0, Math.min(.999999, seed));
  return { id: `${mode}:${areaId}:${runId}:${stage}`, mode, areaId, stage, level, seed: value, kind: travelEventKinds[Math.floor(value * travelEventKinds.length)] };
}

export function travelEventTerms(hero: Traveler, event: TravelEvent) {
  const peaceful = event.kind === 'spring' || event.kind === 'shrine';
  const stat = travelEventDetails[event.kind].stat;
  const chance = peaceful ? 1 : Math.min(.9, .5 + (hero.stats[stat] || 0) / (event.level * 5 + 30));
  return { peaceful, chance, damage: Math.max(1, Math.ceil(derivedStats(hero).maxHp * .08)), gold: 12 * event.level, xp: 20 * event.level, healing: Math.max(1, Math.ceil(derivedStats(hero).maxHp * .15)), energy: 8 };
}

export function resolveTravelEvent<Hero extends Traveler>(hero: Hero, id: string, choice: 'safe' | 'explore'): Hero {
  const event = hero.pendingTravelEvent;
  if (!event || event.id !== id || hero.battle && !hero.battle.ended || hero.hp <= 0 || choice !== 'explore') return hero;
  const terms = travelEventTerms(hero, event);
  const success = terms.peaceful || ((event.seed * 9973 + .371) % 1) < terms.chance;
  const hp = success ? Math.min(derivedStats(hero).maxHp, hero.hp + (terms.peaceful ? terms.healing : 0)) : Math.max(1, hero.hp - terms.damage);
  const energy = Math.min(derivedStats(hero).maxEnergy, (hero.energy || 0) + (success && terms.peaceful ? terms.energy : 0));
  const gold = success && !terms.peaceful && event.kind !== 'runes' ? terms.gold : 0;
  const xp = success && event.kind === 'runes' ? terms.xp : 0;
  const item = success && event.kind === 'cache';
  const receipt: TravelReceipt = { event, choice, success, hp: hp - hero.hp, energy: energy - (hero.energy || 0), gold, xp: hero.level >= 100 ? 0 : xp, item };
  return { ...hero, hp, energy, gold: hero.gold + gold, ...awardXp(hero.xp, hero.level, xp), ...(item ? { rewardChest: [...(hero.rewardChest || []), 'Healing herb'] } : {}), pendingTravelEvent: null, travelHistory: [...(hero.travelHistory || []), receipt].slice(-20) };
}
