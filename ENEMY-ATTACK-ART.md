# Enemy attack illustrations

Attack art is selected through `src/data/enemyAttackArt.ts`, not inferred directly from shared damage mechanics. All 22 currently authored special-attack names and all 52 enemy identities have explicit assignments; dungeon copies and serialized older encounters use the same resolver. SK/EN switching does not alter art selection.

Examples: Rotting Curse → cursed skull (not fire); Crushing Roar → roaring mouth/shockwave (not ice); Moonbeam/Judgment → moonlight; Rotting Anchor → poisoned anchor; Forbidden Page → spectral book; Crystal Wall → crystal defense; Reef Shell → carapace; Searing Blade → flaming sword. Existing suitable poison, frost, shield, drain and fire graphics are reused. Normal spellcasters no longer inherit a sword icon merely because their names do not match a creature regex.

The same selection is used in encounter details, live special-attack warnings and enemy journal entries. Curse/weakness/defensive status icons also use semantic art; Rotting Curse is labeled as a curse rather than burning. Combat damage, duration, immunities, enemy stats, loot and cooldowns were intentionally left unchanged.

## New artwork
Runtime asset: `public/assets/art-v1/enemy-semantic-abilities-v2.webp`, a shared transparent 768px 3×3 atlas. Generated with the built-in image generator, referencing the existing enemy and effects atlases.

Prompt specification: match existing LifeQuest painted dark-cartoon fantasy, chunky ink outlines, textured shading and burgundy/gold accents; centered complete objects with transparent margins, no labels or frames. Row-major cells: rotting green/violet cursed skull without fire; roaring beast with shockwave without ice; silver moon and light beam; rusty poisonous anchor; forbidden ghostly book; red crystal shield/wall; armored crab shell; flaming steel sword; gray stone barricade/shield.

## Checks
107 unit tests pass, including coverage of every enemy/attack, legacy serialization, semantic regressions and status artwork. SK/EN render checks include nine representative semantic attacks in both languages. An isolated Bog Witch battle fixture verified the curse artwork in the attack warning, status icon and journal, without touching the player save; that fixture was removed afterward.
