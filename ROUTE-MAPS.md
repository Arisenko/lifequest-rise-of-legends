# Route maps

Instant-death rule: a new incorrect tile has 10% instant death, 45% bandits and 45% terrain hazard. The fixed roll survives retries/reloads; correct map steps remain safe. Fatal outcomes never accept an alternate step, even if the player heals before acknowledging the result. This supersedes the earlier 50/50 split below.

Terrain events: each new wrong tile rolls 50% bandits versus 50% local danger. Bridge: collapse (35% max HP); woodland: poisoned spikes (20%); mountain pass: rockfall (15%); old road: hidden pit (15%); ford: swept away (20%); stairs: collapse (15%). Damage is immediate and can be fatal. Correct map steps remain safe. Repeated terrain in the route legend represents consecutive stages, not event markers. Legacy pending ravine events remain readable.

Every transition has a destination-specific map item, dropped independently at exactly 20% from any enemy victory in the preceding adventure, including repeat victories. No rarity or elite/boss modifier. No drop after the final area. Already-owned maps in the bag or reward chest are not duplicated. Maps weigh 0.1 kg, use normal overflow handling, cannot be equipped or sold, never appear in shops/random quest loot, and are not consumed.

Each destination has a distinct fixed five-step route. Owned map previews and the travel panel show its exact landmark sequence; enemy loot previews do not reveal the sequence. The reward chest also counts as ownership. Boss clearance is still required to unlock the destination.

Five choices are checked together. Wrong turns can trigger a three-wave bandit encounter, rockfall, poisonous fumes or a ravine fall. Surviving an injury or defeating all bandits accepts that exact tile as an alternate route. Death or retreat never accepts it. Death resets choices, adds weakness and requires healing. Hazards cannot be farmed repeatedly on the same tile. Failed routes consume an attempt; three failures require returning to camp. First-arrival XP is granted once. Maps are destination-specific: they remain owned, but cannot guide the next transition. Six landmark types share the same deterministic route data.

Twenty percent gives an expected five victories, not a guaranteed five-kill drop. At least one drop within ten eligible victories has approximately 89.3% probability. Old visited/cleared areas remain visited. Old unfinished auto-hint puzzles restart at camp using the new rules; earned progression is retained. Choices and maps persist through saves. All UI is SK/EN.

Assets: `adventure-crossroads-v2.webp` (new overview artwork) and `journey-landmarks-v1.webp` (painted map, bridge, trail, pass). Measured SVG region masks prevent neighboring illustrations leaking into icons. The illustrated route legend uses exactly the same route data as the resolver.

The companion `journey-landmarks-extra-v1.png` contains isolated painted road, river-ford and stone-stair icons with transparency. All six landmark types use the same hazard resolver: the correct route is safe, and some wrong turns are quiet. Bridges are not exempt. Hazard rolls are saved/deterministic, so retrying the same tile does not reroll or farm its encounter.
