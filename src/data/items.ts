import type { Item } from '../types/game';

export const items: Item[] = [
  { id: 'rusty-charm', name: 'Rusty charm', slot: 'Prsteň', icon: '🧿', rarity: 'Common', bonuses: { Discipline: 1 }, description: 'Starý talizman, ktorý dodáva odvahu.' },
  { id: 'iron-helm', name: 'Iron helm', slot: 'Helma', icon: '🪖', rarity: 'Common', requirements: { Strength: 3 }, bonuses: { Vitality: 2 }, description: 'Ťažká prilba pre odolných bojovníkov.' },
  { id: 'runic-staff', name: 'Runic staff', slot: 'Zbraň', icon: '🪄', rarity: 'Epic', requirements: { Intelligence: 5 }, bonuses: { Intelligence: 3 }, attack: 8, description: 'Palica naplnená starou runovou energiou.' },
  { id: 'guard-boots', name: 'Guard boots', slot: 'Topánky', icon: '🥾', rarity: 'Rare', requirements: { Vitality: 4 }, bonuses: { Vitality: 2 }, description: 'Pevné topánky strážcu Emberfallu.' },
  { id: 'war-drum', name: 'War drum', slot: 'Náhrdelník', icon: '🥁', rarity: 'Rare', requirements: { Discipline: 3 }, bonuses: { Strength: 1 }, attack: 2, description: 'Rytmus bubna posilňuje bojového ducha.' },
  { id: 'ember-cloak', name: 'Ember cloak', slot: 'Plášť', icon: '🧣', rarity: 'Epic', requirements: { Discipline: 4 }, bonuses: { Vitality: 2, Discipline: 1 }, description: 'Plášť, ktorý udržuje teplo aj v kobkách.' },
];

export const itemById = Object.fromEntries(items.map(item => [item.id, item])) as Record<string, Item>;
