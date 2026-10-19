# Spoločné rozhranie predmetov

ItemCard je jednotný náhľad pre batoh, predaj a nákup v meste, korisť nepriateľov, tréningové odmeny a vstupné predmety. Všetky používajú rovnaké rozmery 120 × 166 px, rám rarity, obrázok, názov, text rarity a váhu; pri levelových predmetoch aj úroveň. Dlhý názov sa v náhľade zobrazí na najviac dva riadky, v prístupnom názve tlačidla a v detaile je celý.

ItemArtwork sústreďuje mapovanie obrázkov a mountov, používa sa aj pri aktívnej výbave a v detailoch. Zachováva pomer strán a používa odložené načítanie obrázkov. Nová grafika ani ďalšie závislosti nie sú potrebné.

GameButton je spoločný základ akcií v postave, obchodoch, tréningu, boji a skupinovom obsahu. Zachováva pôvodné atribúty, submit správanie formulárov, disabled a callbacky. Primárna akcia má mosadzný gradient, nebezpečná akcia bordový vzhľad, neprístupná akcia je viditeľne tlmená. Výber oblasti, budovy a aktívneho slotu zostáva samostatnou kartovou navigáciou.

Štýly: src/item-interface.css. Nové obrazovky majú znovu použiť ItemCard, ItemArtwork a GameButton namiesto vlastných kópií.

Batoh naďalej eviduje každý kus samostatne; nasadená výbava je oddelená. Predaj je iba u Niry, v batohu sú nasadenie/použitie a odhodenie. Pravdepodobnosti koristi, ceny, nosnosť, pravidlá požiadaviek a ukladanie sa nemenia. Všetky nové texty sú SK/EN.
