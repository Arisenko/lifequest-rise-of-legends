# Combat interface and rewards — 18 October 2026

## Implemented
- Shared BattleCard for adventure and dungeon encounters: enemy portrait, player HP, enemy HP, stamina, special-attack telegraph, class skills, buffs/debuffs and bounded battle journal.
- Reused existing painted effect, shield, magic, potion, XP/training-book and gold graphics rather than wireframe stand-ins.
- Nine new painted player-ability icons and nine enemy-attack icons, matching the existing dark-cartoon art references. Two shared transparent WebP atlases avoid separate image requests for every ability. SVG only selects the bitmap atlas region; icons are not line drawings.
- Combat supplies show actual backpack quantities, healing after class modifiers and minimum levels. A selected item consumes one copy and one combat turn. Enemy retaliation and ongoing damage still apply. War Drum refreshes a three-turn attack buff without stacking; a death from ongoing effects before use does not consume the item.
- Victory panel with a laureled crest, matched XP/gold tiles, centered inspectable item cards and one primary continue button. No-drop victories say so explicitly. Defeat/retreat do not show earned rewards.
- Structured reward receipts are saved with the completed battle and survive reload. Rendering or inspecting a reward never grants it again. Legacy victories without a receipt retain their safe text fallback rather than inventing loot.
- SK/EN translations for every new interface label.

## Verification
- 98 unit tests, including selected-item validation, level gates, consumable turn cost, nonstacking buff and saved-reward validation.
- 24 SK/EN server-render checks, including an active battle, victory and item rewards.
- Isolated browser fixture (no localStorage): used one potion from a stack of two, verified HP and turn advancement, consumed War Drum and observed its buff, verified a locked level-90 potion, inspected earned boots and checked English reward labels. Desktop screenshot at 1280px; no horizontal overflow. Temporary fixture removed after checks.
- User's actual hero, inventory and progression were not modified by test combat.

## Generated assets and prompts
Built-in image generation, using the existing icons/effects atlases as style references:
- `public/assets/art-v1/combat-skills-v1.webp`: square transparent 3×3 atlas. Prompt layout: physical sword slash; warrior crushing hammer; mage violet rune burst; paladin sun shield; alchemist bubbling flask; ranger bow and marked target; assassin venom daggers; red-gold relic cataclysm; retreating leather boot. Chunky black outlines, textured painted shading, gold/burgundy accents, no text or UI frames, complete centered objects inside cells.
- `public/assets/art-v1/enemy-abilities-v1.webp`: square transparent 3×3 atlas. Prompt layout: fangs/claw slash; curved blade swipe; crossbow bolt; poisonous thorn vine; freezing projectile; cursed fireball; spectral soul drain; shield impact; stone-fist crush. Same existing LifeQuest dark-cartoon style, transparent margins, no text or frames.

The new images are runtime assets inside the repository, not references to temporary generated-image paths. Existing artwork was retained. No multiplayer, paid runtime API or new server port was introduced.
