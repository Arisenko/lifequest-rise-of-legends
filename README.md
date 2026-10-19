# LIFEQUEST – Rise of Legends

## Spustenie na Macu

1. Otvor tento priečinok vo VS Code.
2. Otvor terminál vo VS Code (`Terminal → New Terminal`).
3. Spusť `npm ci` (nainštaluje presne overené verzie).
4. Spusť `npm run dev`.
5. Otvor `http://localhost:5174/`. Terminál nechaj počas hrania otvorený.

Postup sa ukladá automaticky do `localStorage` prehliadača. Pod ikonou postavy otvor „Uloženie / nová hra“: môžeš exportovať JSON, importovať uloženie alebo obnoviť poslednú platnú zálohu. Nová hra aj import vyžadujú potvrdenie. Poškodené uloženie sa automaticky neprepíše. Prototyp nepoužíva platené API.

## Rozširovanie hry

Herné dáta sú v `src/data/`, spoločné typy v `src/types/` a ukladanie v `src/systems/`. Vývojový server používa pevný port `5174`; ak je obsadený, Vite skončí s chybou namiesto otvorenia ďalšieho portu.

Aktuálne zapojené systémy: `src/data/playerSystems.ts` (atribúty, váha, inventár, energia), `src/data/battle.ts` (boj), `src/data/questSchedule.ts` (tréning), `src/data/encounters.ts` (nepriatelia) a `src/data/loot.ts` (predmety a korisť). Ukladanie a validáciu zabezpečuje `src/systems/saveService.ts`, React stav `src/systems/usePlayerSave.ts` a hráčske akcie `src/systems/playerActions.ts`. Staré nezapojené duplikáty systémov boli odstránené.

Používaj stále `http://localhost:5174/`: `127.0.0.1` má samostatné úložisko. Lokálna záloha je len predchádzajúci stav v tom istom prehliadači; nenahrádza export mimo prehliadača. Pri importe sa kontroluje formát aj vnorené dáta; budúce neznáme verzie sa neprijmú.

„Stav pred novou hrou / importom“ je samostatný bod návratu: bežné automatické ukladanie ho neprepíše. Nahradí sa až pri ďalšej potvrdenej výmene postavy. Ak uloženie medzičasom zmení iné okno, automatické ukladanie upozorní na konflikt namiesto tichého prepísania.

## Mobil a grafika

Na mobile sú kronika a chat predvolene zbalené; atribúty, HP a energia zostávajú viditeľné. Navigácia je prichytená a po výbere posunie na obsah. Detail predmetu je rolovateľný a ovládateľný klávesnicou.

Predmety, portréty a logo používajú optimalizované WebP cez `src/data/optimizedAssets.json`; originály PNG zostávajú ako zdrojové podklady. Regenerovanie: `python3 scripts/optimize_assets.py` (vyžaduje Pillow). Systém nemení pomer strán ani alfa kanál. Zatvorené setové katalógy vykreslia obsah až po otvorení.

## Inventár, atribúty a energia

- Batoh má 50 slotov; každá kópia predmetu zaberá jeden slot. Nasadenie presunie iba vybraný kus z batohu do samostatného slotu výbavy s vlastným identifikátorom. Nasadená výbava nezaberá slot batohu, ale stále sa počíta do celkovej nosnosti.
- Rovnaké predmety v batohu sú samostatné kópie: nasadenie, predaj či odhodenie jednej nemení ostatné. Štyri rovnaké prstene možno nasadiť do štyroch rôznych slotov. Pri výmene sa pôvodný predmet vráti do batohu; odloženie z výbavy vyžaduje voľný slot.
- Nira vidí iba batoh, preto používanú výbavu nemožno predať. Staršie uloženie sa automaticky prevedie bez pridania ďalších kópií.
- Nosnosť je 15 + 2 × základná sila kg. Nezmestené odmeny a prebytočné predmety zo starého uloženia zostávajú v schránke odmien v Postave. Vyzdvihnutie vyžaduje miesto a voľnú nosnosť.
- Sila zvyšuje fyzický útok, inteligencia magický útok a silu fokusu, disciplína brnenie a odolnosť priebežnému poškodeniu, vitalita HP, výdrž aj maximálnu energiu. Bonusy nasadenej výbavy sa uplatnia automaticky.
- Energia sa obnovuje o 1 bod za 3 minúty, pri bezplatnom oddychu o 1 bod za 30 sekúnd, aj pri zatvorenej hre. Pri oddychu nemožno začínať tréning ani boj; najprv ho ukonči.
- Krok denného/týždenného/mesačného tréningu stojí 2/3/4 energie. Vstup do bežného/elitného/boss súboja stojí 5/8/12 energie. Ústup energiu nevracia.
- Výdrž je samostatný zdroj v súboji: fyzický útok stojí 2, mágia 4, fokus 6 bodov. Oddych obnoví 8 výdrže a trochu HP, ale nepriateľ stále útočí.
- Počas rozbehnutého súboja nemožno meniť výbavu, obchodovať, trénovať, vyzdvihovať odmeny či využívať liečiteľa. Súboj je uložený aj po obnovení stránky. Pre pokračovanie otvor Výpravy.
- Liečivá bylina a vojnový bubon majú v inventári tlačidlo Použiť; použitie spotrebuje jednu kópiu.
- Žiadne platby ani platené dopĺňanie energie nie sú zapnuté. Náklady a rýchlosti obnovy sú nastavené na jednom mieste v `ENERGY_RULES` pre ďalšie ladenie.

## Kontrola projektu

Použi Node.js 24 alebo novší pre testovací nástroj. `npm test` spustí kontroly systémov; `npm run build` overí TypeScript a vytvorí zostavenie. Podrobnosti a obmedzenia sú v `AUDIT-2026-10-17.md`.

## Mesto a sociálne systémy

Nové obchody, stajňa, cechy a lokálny chat sú opísané v `CITY-SYSTEMS.md`. Obchody obnovujú sklad každých 6 hodín, predaj je iba u Niry, mount sa vyberá v Postave a maximálna úroveň je 100. Online chat/PvP/raidy vyžadujú budúci herný server; lokálne prípravy sú viditeľne označené.

## Lokalizácia rozhrania
Používateľské rozhranie podporuje slovenčinu a angličtinu cez prepínač `SK / EN`. Voľba jazyka sa ukladá do `localStorage`. Každý nový text v rozhraní musí mať slovenskú aj anglickú verziu; pri nových obrazovkách používaj rovnaký prekladový helper alebo samostatný lokalizačný slovník.
