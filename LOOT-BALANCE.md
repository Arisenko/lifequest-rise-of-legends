# Combat loot and reward balance

Magic cloth and alchemical equipment participates in enemy loot pools, retaining each item's catalog rarity. Availability scales with region level (+2 tolerance); no random item-rarity upgrades are introduced.
Training remains guaranteed quest rewards and is unaffected by combat loot modifiers.

| Enemy | White–purple tier chance multiplier | XP/gold base bonus |
| --- | --- | --- |
| Ordinary normal | 1.00 | 0% |
| Tougher normal | 1.10 | 10% |
| Elite | 1.15 | 25% |
| Boss | 1.25 | 50% |

Tougher normal: HP × damage is at least 1.5 times the weakest normal in that region/dungeon.
Normal enemies remain capped at Unique (blue), elites at Epic (purple).
Legendary remains 0.3% in adventures/dungeons. Planned raids explicitly raise it to 0.6%; Epic raid bosses have a 2.5% tier versus a dungeon boss's 1.25%. Special remains exactly 0.1%, final raid boss only. Specific boss and dungeon/raid mount restrictions remain enforced.
The multipliers are relative, not percentage points: a 20% Common tier becomes 22% on a tougher normal, 23% on an elite, 25% on a boss.
Missing tiers are skipped, never redistributed. One regular loot roll chooses at most one item; no drop remains possible.
Dungeon keys and raid seals keep their separate unchanged 5% roll.

Reward preparation rounds up XP/gold, then applies an increasing floor within each region: normal → elite → boss, and HP × damage within each kind. Stronger encounters never pay less than weaker encounters in the same progression tier. This does not compare unrelated areas or account for encounter duration/energy efficiency.
Balance is applied once when preparing encounter definitions, not repeatedly during render or combat. Saved battles already underway retain their saved XP/gold values; newly started battles use the new values.
Dungeon stage overrides are balanced from their own base XP/gold, rather than multiplying an already-balanced adventure reward.

The shared `lootTable` drives both actual drops and enemy previews. Each enemy detail passes its source/mode to the item dialog, which shows the real tier and per-item chance.
Source definitions: `src/data/encounterRewards.ts`, `encounters.ts`, `dungeons.ts`, `loot.ts`.
Boundary tests validate each eligible tier, no-drop outcomes, rarity caps, exact top-tier probabilities, magic gear eligibility and monotonic XP/gold.
