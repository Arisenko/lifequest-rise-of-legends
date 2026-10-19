# Dungeons, armor sets and raid reward preparation

Five playable three-room dungeons: Ravenmoor Catacombs (5), Moonshadow Den (20), Mistpeak Vault (40), Ironroot Depths (55), Fallen Star Spire (70).
Each dungeon has one unique legendary mount and its own epic/legendary non-set equipment.
Every dungeon also has three complete seven-piece armor sets: cloth, leather, plate (15 sets, 105 set pieces).
Slots: head, chest, shoulders, gloves, cloak, trousers, boots. Weapons/jewelry are separate dungeon rewards, not required for the seven-piece armor bonus.
Each set has two Legendary pieces (head/chest) and five Epic pieces. Normal enemies cannot drop them; elites drop Epic, bosses can drop both.
Each dungeon shares the standard Common/Rare/Unique loot alongside its exclusive items.

## Entry and saves

One dungeon key is consumed once on admission. Level requirements are enforced in both UI and admission logic. Defeated rooms advance sequentially, remain completed across reloads, and cannot be rewarded twice within a run.
New runs persist dungeonId. Old runs without dungeonId resolve to Ravenmoor; no progress wipe.
Each dungeon boss retains an independent 5% raid-seal roll.

## Sets and rarity strength

Equipment bonuses scale once from immutable catalog templates: Common ×1, Rare ×1.35, Unique ×1.75, Epic ×2.5, Legendary ×4, Special ×6 (rounding upward).
This affects actual item attack and attribute bonuses, including existing items. IDs, requirements and ownership are preserved. Consumable healing, entry tokens and manually balanced mounts are excluded.
No random rarity promotion is introduced; each item has its own fixed rarity.
The 2/4/7-piece set bonuses stack and affect derived combat stats, HP and energy caps through existing formulas.
Only distinct equipped pieces of the exact same dungeon/family set count. Backpack pieces, duplicate copies and pieces from other sets cannot fake a threshold.
Set bonus breakdowns appear in item details and the character tab. Requirements still use base attributes, not item or set bonuses.

## Raid preparation, not playable online raids

The planned first raid has five reward bosses, each associated with one dungeon's equipment pool.
This prevents pooling every dungeon into one enormous table and accidentally lowering individual-item odds.
Raid Epic tier 2.5% versus dungeon boss 1.25%; raid Legendary 0.6% versus dungeon 0.3%. Tests verify higher individual odds for every shared dungeon item.
Special remains a shared 0.1% category, only on Ashen Tyrant. New crown, ring, existing Emberlord Blade and Special drake belong there; no Special item drops on adventures or in dungeons.
Existing owned Special items remain owned. No raid can currently be entered, no tokens are consumed by previews, and no reward is granted by inspecting.
Dungeon mounts stay exclusive to their designated dungeon. Raid drop preview/rules are ready for later combat implementation.

## Visuals and localization

All names, descriptions, catalogs and bonus explanations are SK/EN.
New standalone PNGs use the existing hand-painted Dark Cartoon Fantasy style. Dungeon location/enemy previews reuse the matching established environment/foe artwork; new locations do not claim new unique scene illustrations.
Set pieces intentionally share a material-family base artwork, composed with one of five dungeon sigils/colors. These are modular set variants, not 105 separately generated paintings.
Cloth uses the seven mage icons; leather uses seven new leather icons; plate uses established armor icons plus new gauntlets/leg armor.
Collapsed family catalogs keep the UI compact. Cards, stats dialogs, equip rules and inventory instances use the existing shared components.

## Generation prompt set

Use case: stylized-concept. One isolated centered inventory object, complete silhouette, 15% safe padding, transparent background, no text/frame/person. Style reference: items-clean-v2.png, style only. Hand-painted Dark Cartoon Fantasy, bold outlines, textured materials, burgundy/brass palette, warm highlights.
Final assets are under public/assets/items/, maximum edge 384px, alpha retained.

- `crypt-cleaver.png`: a spectral steel cleaver sword with brass boar skull guard and burgundy grip.
- `raven-heart.png`: a legendary ancient gold medallion enclosing a glowing violet raven heart gemstone.
- `shadow-wrap.png`: an epic dark teal shadow cloak with silver wolf clasp.
- `moonfang.png`: a legendary crescent moon silver dagger with glowing blue runes and wolf head pommel.
- `mist-gloves.png`: epic embroidered ivory and violet cloth gloves with blue frost runes.
- `peak-crown.png`: a legendary silver mountain crown helmet with ram horn shapes and icy gems.
- `root-armor.png`: epic dark iron breastplate with root engravings and burgundy cloth.
- `ironheart-ring.png`: a legendary heavy gold bear signet ring with warm amber gemstone.
- `star-staff.png`: an epic ornate purple and brass star mage staff with sapphire crystal.
- `sky-boots.png`: legendary gryphon feather trimmed leather boots, golden talon decorations.
- `raid-crown.png`: a unique red special rarity volcanic dragon crown helmet with molten ruby crystals.
- `raid-sigil.png`: a unique red special rarity gold dragon ring with black scales and blazing crimson gem.
- `leather-hood.png`: a leather ranger hood helmet, stitched dark brown hide, burgundy lining, no head.
- `leather-vest.png`: a complete fitted dark brown leather chest armor, brass buckles, burgundy panels, no person.
- `leather-shoulders.png`: a pair of layered brown leather shoulder guards, burgundy lacing, no metal plates.
- `leather-gloves.png`: a pair of supple dark brown leather rogue gloves with brass buckles.
- `leather-cloak.png`: a short dark brown ranger cloak with burgundy lining and hood, no person.
- `leather-pants.png`: a pair of reinforced dark brown leather trousers, brass buckles and burgundy sash.
- `leather-boots.png`: a pair of tall brown leather ranger boots, stitched cuffs and brass buckles.
- `plate-gloves.png`: a pair of heavy steel plate gauntlets over burgundy leather, brass edges.
- `plate-pants.png`: a pair of articulated steel plate leg armor greaves with burgundy cloth waist, brass edges.
