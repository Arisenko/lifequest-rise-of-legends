# Kronika a aktívne efekty

Kronika používa vlastné pozadie public/assets/art-v1/hero-chronicle.jpg namiesto mestského obrázka. Pravý panel úrovne, HP, energie a atribútov obsahuje prehľad reálnych aktívnych efektov. Oba panely majú spoločný štýl a na širokej obrazovke zhodnú vonkajšiu výšku.

## Efekty a ich zdroje

- Vojnový rytmus: hero.effects, bonus k fyzickému aj magickému útoku.
- Oslabenie po porážke: hero.effects, postih k obom útokom.
- Fokus: hero.battle.focus, bonus podľa inteligencie.
- Otrava a horenie/kliatba: hero.battle.effects, poškodenie za ťah po odolnosti.
- Oslabený útok: hero.battle.effects, postih k obom útokom.
- Zotavenie po porážke: restUntil, zostávajúce sekundy do možnosti začať boj.
- Oddych: energyResting, rýchlejšia obnova energie a blokovanie tréningu/vstupu.
- Štít a zúrivosť bossa: oddelená skupina nepriateľa. Nezobrazujú sa ako hráčove buffy.

Údaje sa odvodzujú z existujúceho uloženia bez druhého zoznamu efektov. Skončené súboje nezobrazujú staré bojové efekty. Počet ťahov je číselný odznak na ikone; sekundy majú príponu s. Detail funguje prejdením myšou, fokusom klávesnice aj klepnutím na mobile. Escape zatvára detail. Texty sú SK/EN.

Jednorazové liečenie a obrana v jednom ťahu nie sú trvajúce buffy, preto sa po ich skončení neukazujú.

## Grafika

Vstavaný generátor obrázkov. Finálne grafické podklady:

- public/assets/art-v1/hero-chronicle.jpg — denník, mapa, kompas, brko a lampáš, tmavá plocha pre text.
- public/assets/art-v1/effects-atlas.jpg — 3 × 3, vojnový bubon, zlomený meč, fokus; jed, horenie, mrazivé oslabenie; štít, zúrivosť, oddych.

Prompt pre pozadie: Unique LIFEQUEST Hero Chronicle panel background, portrait 4:5. Adventurer's private journal desk: weathered burgundy leather chronicle book, rolled map with no letters, brass compass, quill, warm small lantern, wax seal and oak desk. Objects along outer right and bottom edges only; central and upper left 70 percent dark quiet plum/burgundy for overlaid text and portrait. Dark Cartoon Fantasy, chunky black ink outlines, painterly cel shading, aged brass and amber. No text, people, UI, borders, realism, 3D or pixel art.

Prompt pre ikony: LIFEQUEST production 3x3 square status-effect atlas, all nine cells filled, equal edge-to-edge tiles without gutters or text. Center icons with padding on dark plum. Row one war drum with golden sound waves, cracked sword under purple cloud, violet rune eye. Row two venom droplet with fang, orange flame on dark rune, frozen cracked blade. Row three bronze shield with violet aura, furious beast eye with horns, green healing leaf with crescent. Same original Dark Cartoon Fantasy hand-inked painterly style, aged brass, burgundy shadows, readable at 32px, no realism, 3D, pixel art or emoji.
