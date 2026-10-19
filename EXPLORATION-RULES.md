# Postup výprav a pokusy v dungeonoch

## Výpravy
- V každej oblasti je od začiatku dostupný iba prvý protivník. Ďalší vyžaduje prvé víťazstvo nad všetkými predošlými.
- Boss sa odomkne až po všetkých ostatných protivníkoch danej oblasti. Jeho víťazstvo sprístupní nasledujúcu oblasť.
- Už odomknuté protivníky možno opakovať; prvé víťazstvá sa ukladajú podľa oblasti a interného názvu nepriateľa.
- Staršie už dokončené oblasti zachovávajú získané odomknutia. Nedokončená oblasť začína prvým nepreukázaným protivníkom.

## Dungeony
- Limit je samostatný pre každý dungeon: jeden vstup za 24 hodín od predchádzajúceho vstupu, nie kalendárna polnoc.
- Pri vstupe sa spotrebuje presne jeden kľúč a uloží čas pokusu. Pri smrti sa ďalší kľúč už neodpočítava.
- Protivníci idú po poradí; každého možno v danom pokuse poraziť iba raz. Postup aj rozbehnutý boj sa ukladajú.
- Porážka alebo ústup pokus definitívne ukončí. Liečiteľ ho neobnoví. Kľúč sa nevracia.
- Po víťazstve nad bossom je beh dokončený. Na ďalší treba nový kľúč a vypršaný 24-hodinový limit.
- Aktívny starý beh bez časovej pečiatky dostane pečiatku pri prvom načítaní novej verzie bez spotreby ďalšieho kľúča.

## Raidy
- Pripravený limit je jeden pokus za 7 dní od vstupu pre každý raid, s uloženou históriou vstupov.
- Raidy zatiaľ nie sú hrateľné. UI iba vysvetľuje týždenný limit; nespúšťa falošné súboje ani nespotrebúva pečate. Konkrétne pravidlá bojov zostávajú na ďalší návrh.

## Vizuál a overenie
- Spodný obsah má opäť celý horný rám a zaoblenie, nezávisle od presunutého menu.
- Chat má rovnaké vonkajšie rozmery ako hlavný obsah, nie dvojité vnorené odsadenie.
- Nové textúry pod textom, karty budov, obchody, výpravy a dungeonové karty používajú spoločnú matnú kreslenú paletu.
- Päť dungeonov má päť samostatných originálnych náhľadov interiérov. Orin má samostatnú ikonu budovy. Nový wallpaper prepája dedinu, cestu, denník a rast.
- Možná korisť nepriateľov je zbaliteľná, s obmedzenou výškou a rolovaním. Detail predmetu sa naďalej otvára v spoločnom okne.
- Nové texty sú SK/EN; grafika uložená v optimalizovanom WebP, bez závislosti od plateného runtime API.
