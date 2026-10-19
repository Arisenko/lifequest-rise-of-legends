# Enemy discovery

Adventure cards fully render only defeated enemies and the next opponent allowed by the existing sequential-unlock rules. Future encounters keep generic veiled placeholder cards with a lock and ordinal number. Actual future opponents are not rendered: no hidden names, portraits, descriptions, ability details or loot cards in the DOM. The same neutral silhouette is used for all locked cards, so even the real enemy outline and rank remain unknown.

Dungeon runs reveal cleared rooms and the current room, never future rooms. Already discovered rooms remain visible after a failed attempt, but challenge eligibility is unchanged. Completing a room reveals the next one. Boss identity at the dungeon entrance is replaced by a spoiler-free hint.

Detailed area lore, which could disclose future enemies, is withheld until the area's boss becomes available. The area overview and a spoiler-free exploration prompt remain visible. Generic dungeon item/set catalogues are unchanged; this is interface discovery, not a security boundary or removal of client-side game data.

Verification: unit coverage for dungeon revelation and existing adventure unlock rules; eight SK/EN server-render checks for initial/advanced adventure and dungeon states assert exact visible-card counts and absence of locked-enemy names/portrait labels. No player progression reset is needed.
