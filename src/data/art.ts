export const sceneFrames: Record<string, number> = { town: 0, academy: 1, 'forbidden-forest': 2, ravenmoor: 3, 'dark-woods': 4, 'dead-marsh': 5, 'misty-mountains': 6, dungeons: 7, raids: 8 };
export const buildingFrames: Record<string, number> = { nira: 0, armorer: 1, weaponsmith: 2, vela: 3, guild: 4, tavern: 5, castle: 6, stable: 7, arena: 8 };
export const expansionScenes: Record<string, number> = { 'crimson-canyon': 0, 'sunken-observatory': 1 };
export const expansionEnemies: Record<string, number> = { 'Crimson Scorpion': 3, 'Canyon Marauder': 4, 'Crystal Basilisk': 5, 'Drowned Acolyte': 6, 'Lunar Automaton': 7, 'Astral Oracle': 8 };
export const reinforcementEnemies: Record<string, number> = { 'Ember Witch': 2, 'Canyon Berserker': 3, 'Crystal Knight': 4, 'Reef Crab': 5, 'Barnacle Sailor': 6, 'Moon Librarian': 7 };
export const reinforcementExtraEnemies: Record<string, number> = { 'Tide Serpent': 0, 'Astral Inquisitor': 1, 'Canyon Vulture': 2, 'Red Crystal Golem': 3 };
export const iconFrames: Record<string, number> = { town:0, character:1, training:2, adventures:3, dungeons:4, raids:5, world:6, guildChat:7, private:8, Strength:9, Intelligence:10, Discipline:11, Vitality:12, energy:13, gold:14, nira:15, armorer:16, weaponsmith:17, vela:18, guild:19, tavern:20, castle:21, stable:22, arena:23, inventory:24 };
export const enemyFrames = Object.fromEntries([
  'Slizký Škriatok','Thorn wolf','Wild Boar','Thorn Spider','Forest Outcast','Shrine Guardian',
  'Root keeper','Bone sentry','Knižný Golem','Elite sentinel','Castle Rat','Undead Crossbowman',
  'Spectral Knight','Catacomb Executioner','Ravenmoor lord','Shadow stalker','Cloak Wraith','Wandering Shadow',
  'Night Screecher','Black Druid','Memory Devourer','Ancient shade','Drowned wanderer','Bog witch',
  'Marsh Crawler','Grave Swarm','Drowned Knight','Marsh Oracle','Drowned king','Frost wolf',
  'Stone colossus','Mountain Bandit','Ice Spider','Frost Shaman','Forge Guardian','Emberlord',
].map((id,index)=>[id,index])) as Record<string,number>;
