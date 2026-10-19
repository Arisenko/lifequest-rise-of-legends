# Temporary inventory class illustrations

Six complete transparent illustrations replace the layered body/head rendering in the inventory only.
Mapping: Bojovník → guardian, Paladin → paladin, Mág → rune-student, Alchymista → alchemist, Lovec → ranger, Assassín → assassin.
An unknown future class safely falls back to Warrior until its own artwork is added. The retired novice image is removed from runtime assets.
Files: `public/assets/characters/classes/`. Mapping: `src/data/classPortraits.ts`.
The independent `ClassPortrait` component preserves image proportions using contain; it does not inherit the old face/hair/body positioning rules.
Slot interactions, item requirements, stats and saved appearance selections remain unchanged.
These are deliberately temporary class illustrations, not equipped item overlays or the player's customized face. A localized SK/EN caption states that limitation.
Character creation and chronicle portrait are unchanged; the existing layered assets are retained because those screens still use them.

## Generation specification

Use case: stylized-concept. One integrated full-body adult male character with complete head and feet, stable standing stance, transparent background, safe margins, no scenery/frame/text.
Style reference: `public/assets/art-v1/items-clean-v2.png`, style only.
Match established hand-painted Dark Cartoon Fantasy: bold outlines, slightly caricatured heroic proportions, textured cloth/leather/steel, burgundy/brass/violet palette, warm edge highlights; not realistic or anime.
Each character is generated separately and saved locally at a maximum edge of 900px with preserved alpha.

- `novice.png`: a young adult male novice adventurer, average lean build, humble burgundy tunic, patched charcoal trousers, wrapped boots, small travel satchel, plain belt, hopeful expression, no weapons.
- `guardian.png`: an adult male guardian warrior, broad muscular robust build, worn steel and brass breastplate, burgundy tabard, leather gloves and sturdy boots, short dark hair and neat beard, vigilant expression, two simple swords held low at sides.
- `alchemist.png`: an adult male alchemist, slim wiry build, burgundy leather apron over dark teal cloth tunic, utility belt with small glass potion vials, gloves, soft boots, swept brown hair and short goatee, clever expression, holding one small green flask low.
- `rune-student.png`: an adult male rune student mage, slender tall build, layered deep violet cloth robe with burgundy sash and brass embroidered runes, soft shoes, pale shoulder length hair, clean shaven face, calm expression, holding one oak staff with blue crystal low to side.

Validation: unique mapping/file for every current playable class, safe unknown-class fallback, production build and systems tests.
