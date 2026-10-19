# Implementácia auditu — 18. 10. 2026

## Nasadené

### Progres
- Jediná aktívna služba uloženia: saveService; samostatný React hook, hydratácia/migrácia a typ Hero.
- Verziovaný JSON export, import s kontrolou veľkosti, formátu a vnorených dát; podpora doterajšieho priameho formátu.
- Poškodený save sa automaticky neprepíše. Obrazovka obnovy umožní export pôvodných dát, obnovu alebo potvrdenú novú hru.
- Posledná platná automatická záloha a samostatný stabilný bod pred novou hrou/importom. Bod návratu prežije písanie mena aj ďalšie autosave.
- Zlyhanie zálohovania pri plnom/nedostupnom úložisku nezmení hlavné uloženie. Import/obnova/reset majú potvrdenie s predvoleným fokusom na Zrušiť.
- Zmena uloženia iným oknom sa pred ďalším autosave porovná s očakávaným obsahom: pri konflikte sa neprepíše a zobrazí sa upozornenie. Nie je to serverový synchronizačný systém.
- Pevná adresa localhost:5174 a strictPort zostávajú zachované. Žiadny nový herný server ani platená služba.

### Mobil a spoločné rozhranie
- Navigácia je dostupná vyššie a prichytená; kliknutie posúva na obsah, aktívna karta má aria-current.
- Kronika a chat sú na úzkej obrazovke zbaliteľné. HP, energia a štyri atribúty zostávajú viditeľné; podrobné popisy atribútov sú na karte postavy.
- Mobilná postava má samostatné trojstĺpcové rozloženie: výbava vľavo/vpravo, portrét a ruky uprostred.
- Väčšie dotykové ovládanie, rolovateľné modály s limitom výšky, pomenované dialógy a ovládanie Escape.
- Opravené prekrývanie profilového menu prichytenou navigáciou.
- Spoločné farebné tokeny pre základné plochy a texty sú zapojené do existujúcich štýlov; rovnaký základ tlačidiel a PageIntro zostáva naprieč kartami.

### Kód, jazyky a obrázky
- Hráčske akcie oddelené od hlavného komponentu. Odstránených sedem nezapojených starých súborov (paralelné ukladanie, staré loot/quest/stat systémy, katalógy a typy).
- Zdieľané SK/EN názvy predmetov a atribútov; inventár aj náhľad koristi používajú spoločný zdroj. Jazyk prepína aj lang dokumentu.
- Pripravených 89 WebP variantov: 21 581 198 B zdrojov → 4 504 994 B variantov, úspora približne 79 %. Toto NIE JE meranie prvého načítania. Zodpovedajúce aktívne predmety, triedne portréty a logo ich používajú cez manifest.
- Pri všetkých 89 pároch overené rovnaké rozmery a identický alfa kanál. Originály ostali ako zdrojové podklady; celý priečinok preto nezaberá menej miesta.
- Obsah zbalených dungeonových a raidových setových katalógov sa vykresľuje až po otvorení.

## Overenie

- npm test: 85 testov, všetky prešli.
- npm run test:ui: 10 úspešných renderov — tvorba postavy, postava, zálohy, dungeon a raid, každý SK/EN. Tento test neotvára ďalší port.
- npm run build: úspešné; git diff --check bez chýb.
- Produkčný JS približne 396 kB / 131,5 kB gzip, CSS 80 kB / 17,1 kB gzip. Funkcie ochrany progresu mierne zväčšili JS; nejde o deklaráciu zrýchlenia skriptov.
- Živý prehliadač: všetkých šesť hlavných kariet v SK aj EN pri šírke 369 px. Šírka dokumentu 354 px; bez horizontálneho pretekania a bez chýbajúcich dokončene načítaných obrázkov v týchto stavoch.
- Obnovenie stránky zachovalo aktuálnu postavu a zlato; nová hra otvorila potvrdenie a bola zrušená. Žiadny test v živom prehliadači neresetoval ani nenahradil hráčov progres.

## Čo týmto ešte nie je dokončené

- Skutočný vrstvený avatar s výbavou nie je súčasťou tejto úpravy. Triedne portréty ostávajú označené ako pracovné ilustrácie.
- Nie je dokončená manuálna vizuálna matica všetkých desktopových/tabletových rozmerov ani testy na fyzickom iPhone/Androide a v Safari/Chrome. Aktuálny ovládateľný náhľad bol úzky; ovládanie desktopovej aplikácie nebolo dostupné. SSR test nie je náhrada vizuálneho testu.
- Nejde o úplné zlúčenie všetkého historického CSS ani úplný presun každého príbehového textu do jedného slovníka. Existujúce SK/EN varianty ostávajú, spoločné názvy sú už zjednotené.
- Nenahrádza to ekonomický balans, bezpečnostný audit online servera, účet ani cloudovú zálohu. Lokálne uloženie môže používateľ upraviť; import nie je anticheat.

Odporúčaný ďalší krok: vizuálna regresná kontrola pri 360/390/430/768/1024/1440 px, plnom inventári, aktívnom boji a oboch jazykoch. Potom samostatne dokončiť avatar rig a prípadné drobné odchýlky layoutu.
