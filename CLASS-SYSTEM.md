# Six-class system

Novice is removed from character creation and inventory portraits.
Shared definitions: src/data/classes.ts. Adding a future specialization reuses a family instead of copying equip rules.

| Family | Classes | Armor | Shared main attributes | Weapons |
| --- | --- | --- | --- | --- |
| Arcane | Mage, Alchemist | Cloth | Intelligence, Discipline | Staff (two-handed), wand/book (main hand), focus/retort (off hand) |
| Martial | Warrior, Paladin | Plate | Strength, Vitality | Swords in either hand, shield in off hand |
| Scout | Ranger, Assassin | Leather | Discipline, Strength | Bow (two-handed), daggers in either hand |

Jewelry, mounts and consumables remain shared unless they have explicit base-attribute/level requirements.
Every equip action checks class family, level, base attributes and hand constraints. Gear/set bonuses cannot satisfy their own requirements.
Two-handed equipment is stored once, shown in both weapon slots, and counted once in derived stats. Equipping it returns both replaced hand items; replacement is refused if that would overflow the backpack.
Off-hand gear cannot be added while a two-handed weapon is equipped.

## Gameplay

All classes have a skill costing six stamina with a three-turn recharge, persisted in the battle save.
- Warrior: physical attacks build up to three rage. Crushing Strike spends rage (140–230% physical base). Two plate pieces increase physical attack 10%.
- Mage: magic attacks build up to three rune charges. Runic Burst spends charges (160–235% magical base) and burns the target for three turns. Two cloth pieces increase magic attack 10%.
- Alchemist: Battle Elixir heals and buffs the next three turns; healing items are 25% stronger, or 50% with two cloth pieces. Cloth also strengthens the prepared battle-elixir buff. War Drum consumable buffs gain 50% potency. This is prepared alchemy, not a crafting system.
- Paladin: Restoring Light heals, cleanses existing harmful effects before their tick, and guards against that turn's attack/new effect. Two plate pieces improve healing 25% and add two armor. This is currently self-healing in solo combat; ally healing needs group combat.
- Ranger: Mark Prey deals a weaker initial hit and marks the target for 25% more attack damage on the next three turns. Two leather pieces increase physical attack 10%.
- Assassin: every third physical attack (including Venom Blade) critically hits at 150%. Venom Blade applies poison for three turns; two leather pieces boost that poison 50%.

Ranger/Assassin physical damage scales with Strength + Discipline; other classes retain Strength ×2 physical scaling. Intelligence scales magic and buffs. Existing set bonuses and mount perks remain integrated.
Skill cooldowns, charges, combo counts, marks, elixir buffs and enemy damage-over-time effects survive save/reload. Class effects appear in combat and the global effects overview.

## Healing items in combat

The combat button uses one eligible owned healing item (herb or potion), consumes the turn and allows the enemy to attack.
The battle result reports the consumed item; the existing guarded turn transaction removes exactly one copy before adding rewards.
Outside combat, healing items also use the Alchemist multiplier. City healer treatment is a service, not a potion, and remains unchanged.

## Migration

Class rule version 2 migrates old Guardian to Warrior and Rune Student to Mage. Old Novice players get a one-time six-class selection without losing progress or starting a new game.
Earned attribute gains above the former baseline of two are preserved when adding class starting attributes. Migration is versioned and cannot repeatedly grant stats.
The one-time choice adjusts only starting attribute differences; it is blocked during an active fight and cannot be repeated after confirmation.
Incompatible equipped items are returned to backpack or reward overflow, never deleted. Appearance choices, gold, levels, inventory IDs and quest progress remain stored.
Generic legacy domain callers without className retain compatibility; normal game saves always supply a real class.
Numbers are provisional solo-prototype balance, not validated multiplayer/PvP balance.

## Assets and localization

All six classes, roles, skills, descriptions and item restrictions have SK/EN text.
Existing Warrior/Mage/Alchemist illustrations are retained; Paladin/Ranger/Assassin receive new full-body transparent portraits. Retired novice artwork is archived outside the project.
New grimoire, retort, bow, dagger and shield are real shop/loot catalog items with individual artwork. They are not automatically granted.
Final item PNGs: public/assets/items/ (384px maximum edge). New portrait PNGs: public/assets/characters/classes/ (900px maximum edge).
Shared image prompt: stylized-concept, one centered complete subject, transparent background, generous safe padding, no text/frame/scenery. Match items-clean-v2.png's established hand-painted Dark Cartoon Fantasy style, bold outlines, burgundy/brass palette and warm highlights.

- `paladin.png`: one full body adult male paladin healer and protector, strong build in silver plate armor with brass sun insignia, ivory and burgundy tabard, warm holy light on gauntlet, sword held low and shield, friendly resolute face, complete head and feet; portrait composition.
- `ranger.png`: one full body adult male ranger hunter, athletic build, dark brown leather armor with burgundy hood lowered, bow held low, quiver of arrows, keen eyes and short dark hair, forest scout stance, complete head and feet; portrait composition.
- `assassin.png`: one full body adult male assassin, agile lean build in fitted charcoal leather armor with burgundy trim, two daggers held down, hood partly lowered showing face and dark hair, composed stealthy stance, complete head and feet; portrait composition.
- `alchemist-book.png`: one thick alchemy spellbook, burgundy leather cover, brass clasps and embossed emerald alembic symbol, page markers.
- `alchemist-offhand.png`: one handheld alchemical offhand instrument, brass cage holding green glass retort with small tubing and magical catalyst; NOT a necklace or belt charm.
- `hunter-bow.png`: one curved dark oak ranger bow with brass fittings and burgundy wrapped grip, taut bowstring.
- `assassin-dagger.png`: one slim steel assassin dagger, dark leather grip and burgundy tassel, tiny emerald pommel.
- `paladin-shield.png`: one steel heater shield with brass sun crest and burgundy panels, broad sturdy silhouette.

Tests cover paired eligibility, armor restrictions, hand swaps/overflow, safe migration, saved skill cooldowns, individual class mechanics, healing multipliers and material affinity.
