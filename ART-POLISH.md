# Zjednotenie grafiky a typografie

- Mena: GoldValue používa rovnaký GameIcon gold ako horná lišta. Emoji mincí nahradené v cenách, predaji, liečení, katalógu elixírov, mountoch a cechovom poplatku. Aj odmeny tréningov a prehľad odmien nepriateľov používajú rovnaký komponent; textové bojové účtenky ostávajú textové.
- Písmo: čitateľný serif Palatino/Georgia pre rozhranie, MedievalSharp pre fantasy nadpisy a názvy predmetov. Bez novej knižnice; odstránené nepoužívané načítanie DM Sans.
- Karty: jemný kožený podklad a tlmené zdobenie, zachované farby rarity a čitateľné mená.
- Predmety: čistá sada šestnástich existujúcich tvarov. Poškodené staré výrezy už spoločný ItemArtwork nepoužíva. Kľúč a raidová pečať zostávajú samostatné čisté PNG.
- Mestské služby: čistá sada deviatich ikon. Rovnaký renderer ich používa v kartách, titulkoch a návratových prvkoch všade, kde je priradená daná mestská ikona.

## Finálne podklady

public/assets/art-v1/items-clean-v2.png
public/assets/art-v1/city-icons-clean-v2.png
public/assets/art-v1/gold-clean-v2.png

Vstavaný generátor obrázkov, skutočná priehľadnosť PNG. Pôvodný hárok predmetov a atlas ikon slúžili ako referencie existujúceho štýlu. Každý objekt má vlastný explicitný výrez v src/data/cleanArt.ts, preto sa nepoužívajú odhadnuté rovnaké bunky pôvodného nepravidelného hárku. SVG pridáva jemný bezpečný okraj a zachováva pomery; neprekrývajúce sa výrezy overuje test.

## Zadania

Predmety: clean production 4x4 transparent grid of the exact reference LIFEQUEST items; preserve painterly Dark Cartoon Fantasy shapes, chunky ink, burgundy cloth, worn metal and brass. Helmet, sword, armor, boots; gloves, red/blue/green rings; sun ring, compass necklace, cloak, pants; shoulders, herbs, war drum with one fully contained mallet, crescent feather charm. No neighbor fragments, clipped tips, labels or backgrounds. Safe padding.

Mestské ikony: transparent 3x3 grid matching reference, satchel, breastplate, crossed weapons/anvil; healer potion, guild hall, tavern tankard; castle gate, horseshoe, arena laurel. Whole isolated icons, padding, no text, frames or stray fragments.

Zlato: single stack of three aged gold coins and one leaning coin embossed with a four-point star. Transparent, centered with safe padding, readable at 24px, chunky hand ink, painterly amber/brass, burgundy shadows, no text, extra objects, realism, 3D or pixel art.
