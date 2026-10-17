# Dungeonové kľúče, raidové pečate a mestská grafika

## Pravidlá

- Boss na výprave: nezávislý 5 % hod na Kľúč do katakomb.
- Boss v dungeone: nezávislý 5 % hod na Pečať dračieho raidu.
- Bežní nepriatelia a elity tieto vstupné predmety nedávajú.
- Hod je oddelený od rarity vybavenia. Výhra môže dať jeden kus bežnej koristi a jeden vstupný predmet.
- Predmety majú vlastnú transparentnú grafiku, SK/EN názvy a popisy, váhu 0,1 kg a každý kus obsadzuje jeden slot. Nie sú nasaditeľné ani predajné.
- Preplnený inventár presunie odmenu do existujúcej schránky odmien.
- Jeden kľúč sa odoberie pri otvorení celého dungeonu. Obnova stránky ďalší kľúč neodoberie.
- Katakomby majú tri postupné strety: hliadka, elita, boss. Každý súboj používa existujúcu energiu, bojové efekty a systém odmien.
- Postup sa ukladá v dungeonRun spolu s existujúcim uloženým súbojom. Dokončenú komnatu nemožno v jednom behu farmiť.
- Porážka ponechá otvorený beh a rovnakú komnatu na opakovanie po zotavení. Opustenie beh ukončí, bez vrátenia kľúča.
- Počas otvoreného dungeonového behu sa výpravy nesprístupnia, aby sa nepomiešali typy odmien.
- Raid počíta cenu jednej pečate na vstup. Online raid ešte nie je dostupný, preto je vstup neaktívny a pečať ani energiu nespotrebúva.

## Grafika a rozhranie

Použitý vstavaný generátor obrázkov, bez plateného API v hre.
Referenčný štýl: public/assets/art-v1/world-atlas.jpg.

Finálne súbory v tomto projekte:

- public/assets/art-v1/buildings-atlas.jpg — 3 × 3, 1254 × 1254 px.
- public/assets/items/dungeon-key.png — 256 × 256 px, alfa kanál.
- public/assets/items/raid-token.png — 256 × 256 px, alfa kanál.

Atlas po riadkoch: Nira, zbrojár, zbraniarka; Vela, cech, krčma; hrad, stajňa, aréna.
Každá mestská služba teraz zobrazuje svoju budovu namiesto opakovaného námestia.
SVG výrezy zachovávajú proporcie a nenačítavajú samostatný obrázok pre každú budovu.
Spoločný BackButton používa rovnaký vzhľad v meste, oblastiach a pri návrate z dungeonu.

## Zadania grafiky

Use case: stylized-concept. Shared style: original LIFEQUEST Dark Cartoon Fantasy, chunky hand-inked black contours, painterly cel shading, burgundy/plum shadows, weathered aged brass, warm amber rim light. No realism, 3D, pixel art or text.

Buildings: production 3x3 square atlas, nine equal edge-to-edge cells without gutters. Reference world atlas for style only. Distinct Emberfall exteriors at dusk: general merchant shop with bags, barrels and market awning; armorer workshop with breastplate and shields; weaponsmith forge with swords and glowing furnace; healer alchemist with potion windows and herbs; guild hall with banners and carved doorway; Sleeping Dragon tavern with dragon roof ornament and tankard sign; royal castle gate and towers; Silver Horseshoe stable with mule, horse stalls and hay; arena entrance with crossed-blade relief. Buildings fully contained within their own cells, consistent style, no written signage.

Dungeon key: one centered heavy iron key, transparent background, skull-shaped bow with amber gem eyes, aged brass details, long iron shank and three asymmetric teeth. Entire key visible with generous transparent margins, readable at 60 pixels, no frame or extra objects.

Raid seal: one centered thick hexagonal bronze medallion, dragon-head relief, glowing orange ember, small burgundy ribbon, transparent background, entire token visible with generous margins, readable at 60 pixels, no frame or extra objects.

## Overenie

Testy kontrolujú hranicu 5 %, zdroj predmetu, spotrebu jednej kópie, blokovanie opakovaného vstupu, postup komnatami, uloženie stavu, ochranu pred predajom/nasadením a zachovanie odmeny pri plnom batohu.
