# Rozšírenie výprav — 18. 10. 2026

Každá oblasť má aspoň sedem protivníkov a jedného záverečného bossa. Obe nové oblasti majú presne osem: štyroch bežných, tri elity a bossa. Automatický test kontroluje minimum aj jedinečné mená.

Poradie: Zakázaný les → Havranmor → Temný hvozd → Močiar mŕtvych → Mlžné hory → Karmínová roklina → Potopené observatórium.

Porazenie bossa v odomknutej oblasti označí oblasť ako dokončenú a sprístupní ďalšiu. Bežný protivník, ústup, prehra ani dungeonový boss postup neodomykajú. Dokončené oblasti sa dajú opakovať. Úroveň na karte je odporúčaná, nie ďalšia podmienka vstupu.

Postup je súčasťou existujúceho lokálneho uloženia v clearedAreas. Staršie uloženia bez tejto informácie začínajú s prvou odomknutou oblasťou; postava, predmety a ostatný progres sa nemažú.

Karmínová roklina: škorpión, nájazdník, sup, kryštálový golem, čarodejnica, berserker, rytier a bazilišok.

Potopené observatórium: akolyta, lunárny automat, krab, námorník, knihovník, prílivový had, inkvizítor a astrálny veštec.

Každý má SK/EN názov, popis mechaniky, špeciálny útok, HP, poškodenie, XP, zlato a korisť. Zachované obmedzenia rarity: bežní najviac modrá, elity najviac fialová. Bossovia môžu dať dungeonový kľúč s nezávislou šancou 5 %.

## Grafika

Vstavaný generátor obrázkov, bez externého plateného API v hre. Optimalizované JPEG atlasy; spoločný SVG renderer zachováva proporcie a vyberá konkrétne portréty. Nevyužité rezervné políčka sa nikde nezobrazujú.

- public/assets/art-v1/expansion-atlas.jpg — nové lokácie a prvých šesť protivníkov.
- public/assets/art-v1/reinforcements-atlas.jpg — doplnkové portréty.
- public/assets/art-v1/reinforcements-extra-atlas.jpg — prílivový had, inkvizítor, sup a golem.

Použité zadania:

1. Square 3x3 atlas, strict equal tiles: row one crimson crystal canyon with rope bridges, sunken lunar observatory on ocean cliffs, reserve desert necropolis; row two crimson scorpion, masked canyon marauder, horned crystal basilisk boss; row three drowned star acolyte, brass lunar automaton, tentacled astral oracle boss.
2. Square 4x4 portrait atlas: canyon vulture, red crystal golem, ember witch, canyon berserker, crystal knight, reef crab, barnacle sailor, moon librarian, tide serpent, astral inquisitor; unused cells plain plum. Output had eight portraits; missing subjects were replaced by the third atlas, not shown as blank portraits.
3. Square 2x2 atlas, all four cells filled: top left giant teal tide serpent, top right hooded astral inquisitor with bronze crescent mask, bottom left red canyon carrion vulture, bottom right red crystal golem.

Spoločný štýl: original LIFEQUEST Dark Cartoon Fantasy, chunky black hand-inked outlines, painterly cel shading, burgundy/plum shadows, aged brass and warm amber light, centered faces entirely within their tiles, no text, no realism, no 3D or pixel art.
