# LIFEQUEST – Rise of Legends

## Spustenie na Macu

1. Otvor tento priečinok vo VS Code.
2. Otvor terminál vo VS Code (`Terminal → New Terminal`).
3. Spusť `npm install`.
4. Spusť `npm run dev`.
5. Otvor adresu, ktorú terminál ukáže (zvyčajne `http://localhost:5173`).

Postup sa ukladá automaticky do `localStorage` prehliadača. Tlačidlo „Nová hra“ ho vymaže a začne od začiatku. Prototyp nepoužíva platené API.

## Rozširovanie hry

Herné dáta sú v `src/data/`, spoločné typy v `src/types/` a ukladanie v `src/systems/`. Vývojový server používa pevný port `5174`; ak je obsadený, Vite skončí s chybou namiesto otvorenia ďalšieho portu.

## Lokalizácia
Používateľské rozhranie podporuje slovenčinu a angličtinu cez prepínač `SK / EN`. Voľba jazyka sa ukladá do `localStorage`. Každý nový text v rozhraní musí mať slovenskú aj anglickú verziu; pri nových obrazovkách používaj rovnaký prekladový helper alebo samostatný lokalizačný slovník.
