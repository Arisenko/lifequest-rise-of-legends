# Combat controls redesign

Combat actions use a shared `CombatActionButton`: painted icon, readable action name, concise effect text and separate stamina/turn/recharge badges. Physical, magic, defensive and recovery actions have muted color accents instead of gold-filled backgrounds. Buttons use locally available Trebuchet/system sans-serif; existing game headings are unchanged.

`GameButton` has an optional `combat` variant, emitted as `combat-control`. The old global gold button rules explicitly exclude this variant so specificity cannot silently replace the combat design. Other screens and the separate Challenge button are unchanged.

The same component renders basic actions, class abilities and relic abilities. Supplies, item-use buttons, retreat and victory continuation share the dark palette. Mobile action rows stack below 540px; medium layouts use two columns and wide layouts three. Existing disabled conditions, cooldowns, stamina costs and on-click actions remain unchanged.

Verified in an isolated desktop fixture with enabled actions, insufficient-stamina actions and a recharging class ability; all action text fits without horizontal overflow. SK/EN server renders and production build pass. Fixture removed after validation; no player save changes.
