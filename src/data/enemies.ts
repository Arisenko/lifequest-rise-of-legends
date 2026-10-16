export type EnemyDefinition = { id: string; name: string; icon: string; hp: number; attack: number; defense: number; rewardXp: number; dropIds: string[] };
export const enemies: EnemyDefinition[] = [
  { id: 'slimy-goblin', name: 'Slizký Škriatok', icon: '👹', hp: 24, attack: 4, defense: 1, rewardXp: 30, dropIds: ['rusty-charm'] },
  { id: 'book-golem', name: 'Knižný Golem', icon: '📚', hp: 32, attack: 5, defense: 3, rewardXp: 40, dropIds: ['iron-helm', 'runic-staff'] },
  { id: 'ember-wolf', name: 'Popolavý vlk', icon: '🐺', hp: 42, attack: 7, defense: 2, rewardXp: 55, dropIds: ['guard-boots'] },
  { id: 'cloak-wraith', name: 'Prízrak plášťa', icon: '👻', hp: 50, attack: 9, defense: 4, rewardXp: 75, dropIds: ['ember-cloak', 'war-drum'] },
];
