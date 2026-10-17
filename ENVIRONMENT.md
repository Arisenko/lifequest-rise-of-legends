# Prostredie LifeQuest

Zachovaná burgundská/slivková paleta, teplé mosadzné akcenty a existujúca grafika. Pridané statické pozadie s kresleným lesom a Emberfallom po bokoch. Stred ostáva tmavý, aby obsah nebol rušený.

Finálny súbor: public/assets/art-v1/emberfall-wallpaper.jpg, približne 266 KiB. Vygenerované vstavaným generátorom obrázkov, optimalizované do JPEG. Hra nepoužíva generovanie ani platené API pri spustení.

Vzhľad rozhrania je v src/environment.css, samostatne od herných mechaník. Obsahové plochy majú tmavý podklad a jemné mosadzné rámy, navigácia výraznejšie tlačidlá a aktívny stav. Mobilná navigácia má dva riadky po troch kartách. Pozadie je jedna statická vrstva, bez animácií, častíc, filtrov rozmazania alebo ďalších knižníc.

## Zadanie obrázka

Use case: stylized-concept. Wide desktop wallpaper background for original LIFEQUEST Dark Cartoon Fantasy interface. Hand-painted cel shading with chunky black ink outlines, burgundy plum twilight, aged brass and warm amber lanterns, soft teal magical accents. Central 65 percent very dark quiet low contrast plum fog, no buildings, people or focal details. Left outer edge gnarled forest silhouettes, crooked burgundy roof corner and small amber lantern. Right outer edge distant gothic Emberfall towers and rocky cliff, tiny amber windows. Bottom corners faint roots and worn stone. Upper edges subtle mist and a few tiny ember particles. Welcoming mysterious playful dark fantasy, not horror. No characters, text, letters, UI, frames or logos. Low brightness, no bright sky or big light sources, no realism, 3D or pixel art. Landscape 16:9 composition.

Vygenerované častice sú len súčasť statického obrázka, nie animácia.
