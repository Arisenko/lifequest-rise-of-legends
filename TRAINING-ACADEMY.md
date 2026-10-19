# Emberfall academy

The introduction text panel now uses `academy-parchment-v3.webp`: subtle matte plum parchment with faded alchemical circles and botanical sketches at the edges. No room, furniture or background scene. It replaces the rejected study background in this panel only; activity-card materials and the separate academy illustration are unchanged. The asset is locally stored and WebP-compressed.

30 bilingual real-life activities: ten each daily, weekly and monthly. Existing activity IDs and rolling reset times are preserved (24 hours, seven days, one clamped calendar month from completion). Unfinished progress survives resets and upgrades.

Each period is a horizontally scrollable, snap-aligned strip, with previous/next buttons, keyboard arrows when the strip is focused, native scrolling and touch swiping. Reduced-motion settings disable animated scrolling.

Rewards are computed by shared `questRewards`: base XP × level; gold × (1 + 0.18 × (level − 1)); attribute points gain one per 25 levels. Levels are clamped 1–100. The displayed values are used at completion at the current level, before XP changes that level. No partial-step rewards. Completed saves record awarded XP for the chronicle. Real-world effort stays accessible rather than increasing physical demands with level. Daily activities grant no item; weekly and monthly activities show guaranteed items. Inventory overflow retains the existing reward-chest handling.

Art: `public/assets/art-v1/academy-desk-v1.webp` (quiet dark plum embossed academy desk texture) and `training-icons-v1.webp` (30 unique painted activity illustrations in a five-column/six-row atlas). Both were generated for this project, downscaled and WebP-compressed locally. The academy illustration is unchanged; its text panel and activity cards use the new texture. Buttons use dark teal/plum styling instead of gold fills. All user-facing text has SK/EN variants.
