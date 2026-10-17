export type ExpeditionEnemy = { name: string; names: [string, string]; kind: 'normal' | 'elite' | 'boss'; hp: number; reward: number; gold: number; damage: number; drops: string[] };
export type Adventure = { id: string; names: [string, string]; description: [string, string]; icon: string; level: number; color: string; enemies: ExpeditionEnemy[] };

export const adventures: Adventure[] = [
  { id: 'forbidden-forest', names: ['Zakázaný les', 'Forbidden Forest'], description: ['Za starými hraničnými kameňmi miznú pocestní. Preskúmaj chodníky medzi koreňmi a odhaľ strážcu lesa.', 'Travelers vanish beyond the old boundary stones. Explore root-covered paths and uncover the forest guardian.'], icon: '🌲', level: 1, color: '#426b4c', enemies: [
    { name: 'Slizký Škriatok', names: ['Slizký škriatok', 'Slimy Goblin'], kind: 'normal', hp: 24, reward: 30, gold: 12, damage: 4, drops: ['Rusty charm', 'Guard boots', 'Ember cloak', 'Runic staff'] },
    { name: 'Thorn wolf', names: ['Tŕňový vlk', 'Thorn Wolf'], kind: 'normal', hp: 32, reward: 40, gold: 16, damage: 5, drops: ['Iron helm', 'Guard boots', 'Ember cloak', 'Runic staff'] },
    { name: 'Root keeper', names: ['Koreňový strážca', 'Root Keeper'], kind: 'elite', hp: 60, reward: 90, gold: 32, damage: 6, drops: ['Rusty charm', 'War drum', 'Ember cloak', 'Runic staff', 'Dawn relic'] },
  ] },
  { id: 'ravenmoor', names: ['Zrúcaniny hradu Havranmor', 'Ravenmoor Castle Ruins'], description: ['Pod zrútenými vežami stále pochoduje zabudnutá posádka. Jej veliteľ stráži bránu do starých siení.', 'A forgotten garrison still marches beneath the fallen towers. Its commander guards the ancient halls.'], icon: '🏰', level: 3, color: '#716578', enemies: [
    { name: 'Bone sentry', names: ['Kostený hliadkar', 'Bone Sentry'], kind: 'normal', hp: 42, reward: 55, gold: 22, damage: 6, drops: ['Iron helm', 'Guard boots', 'Ember cloak', 'Runic staff'] },
    { name: 'Knižný Golem', names: ['Knižný golem', 'Book Golem'], kind: 'normal', hp: 48, reward: 65, gold: 26, damage: 6, drops: ['Rusty charm', 'War drum', 'Ember cloak', 'Runic staff'] },
    { name: 'Elite sentinel', names: ['Veliteľ Havranmoru', 'Ravenmoor Commander'], kind: 'elite', hp: 80, reward: 120, gold: 45, damage: 8, drops: ['Iron helm', 'Guard boots', 'Ember cloak', 'Runic staff', 'Dawn relic'] },
  ] },
  { id: 'dark-woods', names: ['Temný hvozd', 'Darkwood'], description: ['Svetlo tu pohltia koruny čiernych stromov. Tiene sledujú každý krok a medzi kmeňmi drieme prastarý duch.', 'Black treetops swallow the light. Shadows watch every step, and an ancient spirit sleeps among the trunks.'], icon: '🌑', level: 5, color: '#594473', enemies: [
    { name: 'Shadow stalker', names: ['Tieňový stopár', 'Shadow Stalker'], kind: 'normal', hp: 58, reward: 80, gold: 30, damage: 7, drops: ['Rusty charm', 'War drum', 'Ember cloak', 'Runic staff'] },
    { name: 'Cloak Wraith', names: ['Prízrak plášťa', 'Cloak Wraith'], kind: 'elite', hp: 95, reward: 145, gold: 52, damage: 9, drops: ['Iron helm', 'Guard boots', 'Ember cloak', 'Runic staff', 'Dawn relic'] },
    { name: 'Ancient shade', names: ['Prastarý tieň', 'Ancient Shade'], kind: 'boss', hp: 130, reward: 230, gold: 85, damage: 10, drops: ['Rusty charm', 'War drum', 'Ember cloak', 'Runic staff', 'Dawn relic'] },
  ] },
  { id: 'dead-marsh', names: ['Močiar mŕtvych', 'Marsh of the Dead'], description: ['Bludičky lákajú pútnikov do čiernej vody. Pod hladinou sa prebúdza dvor utopeného kráľa.', 'Will-o’-wisps lure travelers into black water. Beneath the surface, the drowned king’s court awakens.'], icon: '☠️', level: 7, color: '#5b7550', enemies: [
    { name: 'Drowned wanderer', names: ['Utopený pútnik', 'Drowned Wanderer'], kind: 'normal', hp: 75, reward: 105, gold: 38, damage: 8, drops: ['Rusty charm', 'Guard boots', 'Ember cloak', 'Runic staff'] },
    { name: 'Bog witch', names: ['Močiarna bosorka', 'Bog Witch'], kind: 'elite', hp: 115, reward: 180, gold: 65, damage: 10, drops: ['Iron helm', 'War drum', 'Ember cloak', 'Runic staff', 'Dawn relic'] },
    { name: 'Drowned king', names: ['Utopený kráľ', 'Drowned King'], kind: 'boss', hp: 165, reward: 290, gold: 110, damage: 12, drops: ['Iron helm', 'Guard boots', 'Ember cloak', 'Runic staff', 'Dawn relic'] },
  ] },
  { id: 'misty-mountains', names: ['Mlžné hory', 'Misty Mountains'], description: ['Cesty nad oblakmi strážia kamenné bytosti. V srdci pohoria žiari vyhňa pána uhlíkov.', 'Stone creatures guard the paths above the clouds. Deep within the mountains burns the Emberlord’s forge.'], icon: '🏔️', level: 10, color: '#53758b', enemies: [
    { name: 'Frost wolf', names: ['Mrazivý vlk', 'Frost Wolf'], kind: 'normal', hp: 95, reward: 140, gold: 48, damage: 9, drops: ['Iron helm', 'Guard boots', 'Ember cloak', 'Runic staff'] },
    { name: 'Stone colossus', names: ['Kamenný kolos', 'Stone Colossus'], kind: 'elite', hp: 150, reward: 240, gold: 90, damage: 12, drops: ['Rusty charm', 'War drum', 'Ember cloak', 'Runic staff', 'Dawn relic'] },
    { name: 'Emberlord', names: ['Pán uhlíkov', 'Emberlord'], kind: 'boss', hp: 200, reward: 380, gold: 150, damage: 14, drops: ['Iron helm', 'Guard boots', 'Ember cloak', 'Runic staff', 'Dawn relic', 'Emberlord blade'] },
  ] },
];

export const expeditionEnemies = adventures.flatMap(adventure => adventure.enemies);
