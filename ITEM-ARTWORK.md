# Individual item artwork

Each catalog entry has a unique `art` key in `src/data/loot.ts`.
All contexts use `ItemArtwork`: backpack, equipment, shops, training rewards and enemy drops.
Existing saves retain the same item identifiers; no items, statistics or prices are changed.

New standalone PNGs live in `public/assets/items/`. Each is generated individually on a transparent background, with the complete silhouette and safe margins rather than cropped from a sheet.
Runtime requires no image generation service or paid API.

## Shared generation specification

Use case: stylized-concept. One centered inventory icon, transparent background, 15% padding, no text or frame.
Style reference: `public/assets/art-v1/items-clean-v2.png`.
Match hand-painted Dark Cartoon Fantasy, bold dark outlines, chunky readable silhouette, textured materials, burgundy/brass colors and warm highlights.

## Individual subjects

- `training-sword.png`: a simple blunt wooden practice sword, worn oak blade, leather handle.
- `guard-blade.png`: a steel city guard longsword, silver straight blade and burgundy leather grip, brass crossguard.
- `apprentice-wand.png`: a short crooked apprentice magic wand, dark wood and tiny violet crystal tip.
- `oak-staff.png`: a tall gnarled oak walking staff, carved leaves, small green crystal held by roots.
- `runic-staff.png`: an ornate runic mage staff, blue glowing runes and large cyan crystal, silver fittings.
- `dawn-relic.png`: a sacred sunrise relic, ornate gold disk with sun rays enclosing glowing ivory crystal, ancient gold pedestal.
- `emberlord-blade.png`: a menacing boss greatsword, black volcanic steel with orange magma cracks and ember flame pommel.
- `copper-ring.png`: a modest plain reddish copper finger ring, hammered metal, small amber inset; no leaves or green gems.
- `healing-potion-1.png`: a tiny round red healing vial, cork stopper and twine.
- `healing-potion-2.png`: a slim crimson healing flask, leather neck strap and bronze collar.
- `healing-potion-3.png`: a square ruby healing bottle, reinforced bronze corners.
- `healing-potion-4.png`: a teardrop red healing bottle, brass filigree and wax seal.
- `healing-potion-5.png`: a broad red healing flask with silver wing handles.
- `healing-potion-6.png`: a ruby healing decanter, silver lattice and garnet stopper.
- `healing-potion-7.png`: a faceted scarlet healing bottle, gold claw base and crown stopper.
- `healing-potion-8.png`: a heart shaped red healing crystal bottle, ornate gold frame.
- `healing-potion-9.png`: a large crimson healing crystal bottle, gold phoenix wings and ruby crown.
- `healing-potion-10.png`: a legendary ornate blood-red healing bottle, radiant gold dragon frame and crystal crown.
- `mount-mule.png`: a sturdy friendly grey mule with simple burgundy saddle and brown packs, full body three quarter standing.
- `mount-horse.png`: a proud dark chestnut fantasy horse with burgundy saddle cloth and brass tack, full body three quarter standing.
- `mount-stag.png`: a majestic pale moonlit stag with silver antlers and blue saddle cloth, full body three quarter standing.

The catalog artwork test requires every item to have a unique key and an existing image.
