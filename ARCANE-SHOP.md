# Orin's Arcane Emporium

New town service: `arcane`, buy-only; unwanted equipment is sold to Nira as before.
Restocking uses the shared six-hour interval, level filtering, purchase receipts and inventory/weight limits.
Rhea now sells martial weapons. Existing apprentice wand, oak staff and runic staff move to Orin without changing saved identifiers.
Nine new items are defined in `src/data/magicItems.ts`: seven cloth pieces, an alchemical charm and a catalyst wand.
Cloth uses existing helmet/armor/shoulder/glove/cloak/pants/boot slots. It has explicit low weights and Intelligence/Discipline/Vitality bonuses.
Base attribute and level requirements are enforced by the existing equipment system; equipment bonuses cannot satisfy their own requirements.
Cloth armor and arcane weapons now enforce the shared Mage/Alchemist family. Both classes use identical equip requirements but different combat mechanics and cloth-affinity benefits. The collection includes a one-handed grimoire and off-hand retort; two-handed staves cannot combine with off-hand gear. Crafting remains future work.
The optional `armorType` and `weight` fields allow future collections without copying shop or equipment logic.
All names, descriptions and town labels have SK/EN versions.

## Artwork

Standalone assets live in `public/assets/items/`; the building illustration is `public/assets/art-v1/arcane-shop.png`.
Each asset is generated separately using `items-clean-v2.png` as a style reference only.
Shared prompt: stylized-concept, hand-painted Dark Cartoon Fantasy, bold dark outlines, textured materials, burgundy/brass/violet palette, warm highlights, no text.
Item icons: centered complete object, transparent background, safe margins, no body or frame.
Building: complete exterior, twilight scene, no text.

- `mage-hood.png`: a soft burgundy mage hood with brass moon clasp, folded cloth, no head.
- `mage-robe.png`: a complete deep violet cloth mage robe with gold embroidery and burgundy sash, no person.
- `mage-gloves.png`: a pair of embroidered violet cloth casting gloves with small blue runes.
- `mage-pants.png`: a pair of charcoal violet cloth trousers with burgundy sash and subtle stitched runes.
- `mage-boots.png`: a pair of soft violet cloth ankle boots with leather soles and brass buckles.
- `mage-mantle.png`: a pair of violet padded cloth shoulder mantles, gold embroidered trim, not metal armor.
- `mage-cloak.png`: a midnight blue wizard cloak with burgundy lining and brass crescent clasp, no person.
- `alchemist-focus.png`: a wearable alchemist belt charm, small emerald glass alembic in a brass cage with leather strap.
- `alchemist-rod.png`: a short alchemist catalyst wand, copper shaft and emerald crystal inside a small glass retort tip.
- `arcane-shop.png`: one exterior building illustration: a charming crooked fantasy magic shop in Emberfall, deep purple tiled pointed roof, burgundy awning, glowing violet window, brass moon sign, alchemist glass bottles visible in window, cobblestone frontage, warm twilight, no text.
