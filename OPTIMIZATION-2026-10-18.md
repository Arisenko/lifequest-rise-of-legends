# Optimalizácia a záloha — 18. 10. 2026

- Desať starých grafických podkladov bez referencií v aplikácii bolo presunutých mimo repozitára do /Users/jakubruzicka/Documents/Codex/Lifequest-unused-assets-2026-10-18. Aktívna grafika postavy, itemov a prostredí zostala nedotknutá.
- public/assets sa zmenšilo z 22 500 KiB na 13 732 KiB, približne o 39 %. Archív je vratný; pôvodné súbory sú aj v predchádzajúcej histórii Gitu.
- Verzie všetkých priamych závislostí sú zafixované na už používané, overené verzie. package.json a package-lock.json sa zhodujú. Na obnovenie projektu používaj npm ci.
- Vyžaduje sa Node.js 24 alebo novší. Vývojový port zostáva 5174 a strictPort zabraňuje samovoľnému prechodu na iný port.
- Ignorované zostávajú node_modules, dist, lokálne nastavenia .env, pracovné výstupy; pribudlo ignorovanie logov a coverage.
- Kontrola nenašla v zdrojových súboroch známe vzory prístupových tokenov či privátnych kľúčov. Nejde o záruku úplného bezpečnostného auditu.
- Testy navyše overujú existenciu obrázkov referencovaných v štýloch a katalógu predmetov.

## Rozsah zálohy

GitHub ukladá zdrojový kód, aktívnu grafiku, dáta herných pravidiel, dokumentáciu, testy a uzamknuté verzie závislostí. Neobsahuje node_modules, zostavené dist ani postup postavy z localStorage prehliadača. Herné uloženie ostáva na tomto počítači a v danom prehliadači.

Repozitár: https://github.com/Arisenko/lifequest-rise-of-legends
