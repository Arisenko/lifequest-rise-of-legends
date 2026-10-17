# Emberfall – mestské systémy

## Funkčné lokálne služby

- Nira: všeobecné predmety a jediné miesto predaja. Predáva sa jeden konkrétny kus z batohu. Nasadené veci sú samostatne vo výbave s identifikátorom a slotom, Nira ich nemá v ponuke predaja. Rovnakú náhradnú kópiu v batohu možno predať bez zásahu do nasadenej.
- Zbrojár Borin: iba predaj zbrojí, prilieb, rukavíc, nohavíc, náplecníkov, topánok a plášťov hráčovi.
- Zbraniarka Rhea: iba predaj fyzických a magických zbraní hráčovi.
- Maestra Vela: liečenie a desať liečivých elixírov. Elixíry sa používajú v Postave; kontroluje sa požadovaná úroveň.
- Krčma U spiaceho draka: prepínanie existujúceho bezplatného oddychu. Platí aj offline obnova energie.
- Stajňa: kúpa a nasadenie mounta ako samostatného kusu výbavy. Pod aktívnou výbavou je klikateľný slot s rovnakým náhľadovým oknom ako ostatná výbava. Odloženie vráti mounta do batohu (jeden slot); nasadený mount v batohu nie je. Mount má nulovú nosenú hmotnosť, nezvyšuje bojové štatistiky a šetrí energiu iba pri nasadení. Výmena vracia pôvodného mounta do batohu. Starší vlastnení mounti sa prevedú automaticky, bez ďalšieho platenia a bez duplikovania. Predať možno iba odloženého mounta u Niry.
- Hrad: kronika úrovne a odkazy na dungeony/raidy.

## Obnova obchodov

Ponuka sa určuje deterministicky v pevných šesťhodinových intervaloch podľa časovej pečiatky zariadenia. Refresh ju nemení. Každý ponúkaný predmet má jeden kus za interval a obchodníka; kniha nákupov je uložená s hráčom. Pri novom intervale sa tovar obnoví a rotuje. Staršie záznamy sa pri nákupe priebežne odstraňujú, aby úložisko nerástlo.

Vela vždy drží základný elixír, ostatné odomknuté stupne rotuje. Na úrovni 1 existuje iba jediný dostupný stupeň, preto zostáva rovnaký aj po obnove; obnoví sa jeho kus. Pokročilejšie stupne sú viditeľné v katalógu ako uzamknuté alebo čakajúce na ponuku. Nákup preveruje zlato, sklad, úroveň, 50 slotov, váhu aj prebiehajúci boj. Neúspešný nákup nič nestrhne.

| Stupeň | Úroveň | HP | Cena v zlate |
|---|---:|---:|---:|
| 1 | 1 | 20 | 8 |
| 2 | 10 | 35 | 15 |
| 3 | 20 | 55 | 26 |
| 4 | 30 | 80 | 42 |
| 5 | 40 | 110 | 65 |
| 6 | 50 | 145 | 95 |
| 7 | 60 | 185 | 140 |
| 8 | 70 | 230 | 190 |
| 9 | 80 | 280 | 255 |
| 10 | 90 | 340 | 335 |

Strop úrovne 100 platí při tréningu, bojových odmenách aj načítaní starej postavy. Na maxime sa ďalšie XP nehromadia; ostatné odmeny zostávajú.

## Cechy a oprávnenia

Založenie stojí jednorazovo 100 000 zlata. Názov má 3–30 znakov. Zakladateľ je majstrom. Model podporuje 30 členov, najviac 3 poručníkov a najviac 3 moderátorov (adminov). Ide o oddelené roly.

- Majster: riadi vedenie, mení roly a odoberá členov. Sám seba nemožno odstrániť týmto rozhraním.
- Poručník: správa bežných členov, bez práva meniť majstra a vedenie.
- Moderátor: správa bežných členov a moderovanie cechového chatu.
- Člen: bez práv na vedenie a moderovanie.

Aktuálna obrazovka umožňuje zakladateľovi zostaviť lokálny testovací zoznam, prideliť roly a odobrať členov. Žiadne pozvánky sa neposielajú. Pre ostatných používateľov treba budúce účty, serverové členstvo, overenie oprávnení a audit moderátorských akcií. Lokálne funkcie už preverujú limity a práva; nie sú bezpečnostnou náhradou servera.

## Chat, aréna, dungeony a raidy

Pod prehľadom hráča je panel Svetový chat / Cechový chat / Osobné správy. Uchováva najviac 100 správ s limitom 300 znakov; cechové správy sú oddelené názvom cechu, osobné koncepty príjemcom. Cechový kanál vyžaduje založený cech. Majster alebo moderátor môže odstrániť lokálnu cechovú správu. Zobrazenie používa obyčajný React text, nie HTML.

Panel výslovne označuje lokálny režim: správy sa nikam neodosielajú a nie sú skutočne súkromnou serverovou komunikáciou. Budúci server musí pridať identity, autentifikáciu, členstvo, adresovanie a doručovanie, limity, blokovanie používateľov a serverovú moderáciu. Prechádzanie kariet nevymazáva uložené správy.

Aréna má pripravenú obrazovku pravidiel budúceho PvP a uzamknutý vstup bez poplatku. Dungeony majú novú záložku s lokálnym prístupom k existujúcim sólo stretom; samostatná postupová dungeonová inštancia ešte nie je hotová. Raidy majú vlastnú záložku s prípravou skupiny, plánovanými rolami a stavom serverového vstupu. Nie sú predstieranou online hrou a neúčtujú energiu.

## Overenie a výkon

22 automatických kontrol a produkčné zostavenie prešli. Nové kontroly pokrývajú rotáciu, vypredanie, obnovu uloženia, odmietnuté nákupy, predaj jednej kópie, požiadavky elixírov, mountov, strop úrovne a cechové práva. V prehliadači overené námestie, nové záložky, chat a katalóg Vely.

Obchod sa přepočítava z malých katalógov; časovač sa pri opustení mesta ruší. Chat je ohraničený počtom správ, záznamy nákupov sa čistia, obrázky používajú existujúce lokálne súbory. Nie sú nové platené služby ani sieťové balíky. Všetky nové texty majú SK/EN variant.
