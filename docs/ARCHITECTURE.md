# LifeQuest architecture

The game runs locally with Vite. Game data is separated from UI code:

- `src/types/game.ts` contains shared data contracts.
- `src/data/items.ts` contains all item definitions and stat requirements.
- `src/data/enemies.ts` contains enemies, combat values and drop tables.
- `src/data/quests.ts` contains real-life quests and rewards.
- `src/systems/save.ts` contains local save/load behavior.
- `public/assets/` contains visual assets.

To add an item, add one definition to `src/data/items.ts`. To add an enemy, add one definition and its drop IDs to `src/data/enemies.ts`. The browser save remains local and is versioned as `lifequest-save-v1` so future migrations can be added safely.
