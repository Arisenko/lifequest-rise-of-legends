import type { Encounter } from './encounters';

type Biome = { zones: [string,string,string][]; color: string; story: [string,string]; foes: [string,string][]; mechanic: Encounter['mechanic']; special: [string,string] };
const biomes: Biome[] = [
  {
    "zones": [
      [
        "bone-wastes",
        "Kostné pustatiny",
        "Bone Wastes"
      ],
      [
        "sun-tombs",
        "Hrobky zabudnutého slnka",
        "Tombs of the Forgotten Sun"
      ]
    ],
    "color": "#b99562",
    "story": [
      "Piesok odhaľuje rebrá dávnych obrov. Medzi rozbitými obeliskmi sa ozývajú kroky strážcov, ktorých prísaha prežila celé ríše.",
      "Sand uncovers the ribs of ancient giants. Among shattered obelisks walk guardians whose oath outlived entire empires."
    ],
    "foes": [
      [
        "Kostný skarabeus",
        "Bone Scarab"
      ],
      [
        "Púštny šakal",
        "Desert Jackal"
      ],
      [
        "Piesočný nájazdník",
        "Sand Raider"
      ],
      [
        "Jedovatá kobra",
        "Venom Asp"
      ],
      [
        "Hrobový lukostrelec",
        "Tomb Archer"
      ],
      [
        "Mumifikovaný kňaz",
        "Mummy Priest"
      ],
      [
        "Kostný ochranca",
        "Bone Guardian"
      ],
      [
        "Faraón suchých kostí",
        "Pharaoh of Dry Bones"
      ]
    ],
    "mechanic": "poison",
    "special": [
      "Jedovaté tŕne",
      "Venomous Thorns"
    ]
  },
  {
    "zones": [
      [
        "spore-jungle",
        "Džungľa večných spór",
        "Jungle of Eternal Spores"
      ],
      [
        "heartwood-sanctum",
        "Svätyňa živého jadra",
        "Heartwood Sanctum"
      ]
    ],
    "color": "#638c6b",
    "story": [
      "Obrovské huby zakrývajú nebo a korene pohlcujú cestu. Hlboko pod zelenou klenbou sa prebúdza vedomie, ktoré považuje všetkých návštevníkov za potravu.",
      "Giant mushrooms hide the sky and roots devour the path. Beneath the green canopy an ancient mind awakens, seeing every visitor as nourishment."
    ],
    "foes": [
      [
        "Spórový chrobák",
        "Spore Beetle"
      ],
      [
        "Lianový lovec",
        "Vine Prowler"
      ],
      [
        "Hubový škriatok",
        "Fungal Goblin"
      ],
      [
        "Jedovatý kvet",
        "Toxic Bloom"
      ],
      [
        "Džungľový stopár",
        "Jungle Stalker"
      ],
      [
        "Machový šaman",
        "Moss Shaman"
      ],
      [
        "Koreňový šampión",
        "Root Champion"
      ],
      [
        "Vládca podhubia",
        "Mycelium Sovereign"
      ]
    ],
    "mechanic": "poison",
    "special": [
      "Jedovaté tŕne",
      "Venomous Thorns"
    ]
  },
  {
    "zones": [
      [
        "frostbound-pass",
        "Priesmyk večného ľadu",
        "Frostbound Pass"
      ],
      [
        "winter-crown",
        "Citadela zimnej koruny",
        "Winter Crown Citadel"
      ]
    ],
    "color": "#85abc5",
    "story": [
      "Pod modrým ľadom presvitajú zamrznuté zástavy. Vietor prináša zvonenie z citadely, kde sa čas zastavil uprostred posledného obliehania.",
      "Frozen banners glimmer beneath blue ice. The wind carries bells from a citadel where time stopped during the final siege."
    ],
    "foes": [
      [
        "Ľadový havran",
        "Ice Raven"
      ],
      [
        "Mrazivý rys",
        "Frost Lynx"
      ],
      [
        "Ľadovcový nájazdník",
        "Glacier Raider"
      ],
      [
        "Snežný prízrak",
        "Snow Specter"
      ],
      [
        "Zamrznutý strelec",
        "Frozen Archer"
      ],
      [
        "Ľadový čarodejník",
        "Ice Sorcerer"
      ],
      [
        "Ľadovcový rytier",
        "Glacier Knight"
      ],
      [
        "Titán zimnej koruny",
        "Winter Crown Titan"
      ]
    ],
    "mechanic": "frost",
    "special": [
      "Mrazivý úder",
      "Frost Strike"
    ]
  },
  {
    "zones": [
      [
        "ash-forges",
        "Popolavé vyhne",
        "Ashen Forges"
      ],
      [
        "magma-throne",
        "Trón magmatického kráľa",
        "Magma King’s Throne"
      ]
    ],
    "color": "#cb7155",
    "story": [
      "Rieky lávy osvetľujú opustené kováčske mosty. Pece neprestali pracovať a ich nové výtvory už nemajú slúžiť ľuďom.",
      "Lava rivers illuminate abandoned forge bridges. The furnaces never stopped, and their new creations no longer serve humankind."
    ],
    "foes": [
      [
        "Popolavý imp",
        "Ash Imp"
      ],
      [
        "Magmatický pes",
        "Magma Hound"
      ],
      [
        "Troskový škriatok",
        "Slag Goblin"
      ],
      [
        "Žeravý netopier",
        "Ember Bat"
      ],
      [
        "Kultista vyhne",
        "Forge Cultist"
      ],
      [
        "Obsidiánový strážca",
        "Obsidian Sentinel"
      ],
      [
        "Roztavený kat",
        "Molten Executioner"
      ],
      [
        "Magmatický tyran",
        "Magma Tyrant"
      ]
    ],
    "mechanic": "burn",
    "special": [
      "Roztavený dych",
      "Molten Breath"
    ]
  },
  {
    "zones": [
      [
        "storm-isles",
        "Ostrovy roztrhnutej búrky",
        "Shattered Storm Isles"
      ],
      [
        "tempest-palace",
        "Palác večnej víchrice",
        "Palace of the Eternal Tempest"
      ]
    ],
    "color": "#9a86c2",
    "story": [
      "Kamenné ostrovy visia nad nekonečnou priepasťou. Každý most je skúškou odvahy a každý záblesk odhalí ďalšiu siluetu v oblakoch.",
      "Stone islands hang above an endless abyss. Every bridge tests courage, and every flash reveals another silhouette among the clouds."
    ],
    "foes": [
      [
        "Búrková harpya",
        "Storm Harpy"
      ],
      [
        "Nebeský had",
        "Sky Serpent"
      ],
      [
        "Oblačný pirát",
        "Cloud Pirate"
      ],
      [
        "Hromový bludič",
        "Thunder Wisp"
      ],
      [
        "Búrkový strelec",
        "Storm Archer"
      ],
      [
        "Mudrc bleskov",
        "Lightning Sage"
      ],
      [
        "Hromový šampión",
        "Thunder Champion"
      ],
      [
        "Kráľovná víchrice",
        "Tempest Queen"
      ]
    ],
    "mechanic": "frost",
    "special": [
      "Úder hromu",
      "Thunderclap"
    ]
  },
  {
    "zones": [
      [
        "silent-necropolis",
        "Nekropola tichých kráľov",
        "Necropolis of Silent Kings"
      ],
      [
        "soul-court",
        "Dvor ukradnutých duší",
        "Court of Stolen Souls"
      ]
    ],
    "color": "#75a99f",
    "story": [
      "Zelené lampáše osvetľujú rady prázdnych sarkofágov. Mená na nich sa pomaly menia a kroky v tvojom závese sa nikdy nezastavia spolu s tebou.",
      "Green lanterns light rows of empty sarcophagi. Their names slowly change, and the footsteps behind you never stop when you do."
    ],
    "foes": [
      [
        "Hrobová krysa",
        "Grave Rat"
      ],
      [
        "Kryptový netopier",
        "Crypt Bat"
      ],
      [
        "Kostný vojak",
        "Bone Soldier"
      ],
      [
        "Dušový prízrak",
        "Soul Wraith"
      ],
      [
        "Kryptový lukostrelec",
        "Crypt Archer"
      ],
      [
        "Kňaz smrti",
        "Death Priest"
      ],
      [
        "Hrobový kat",
        "Tomb Executioner"
      ],
      [
        "Regent mŕtvych",
        "Death Regent"
      ]
    ],
    "mechanic": "drain",
    "special": [
      "Krádež spomienok",
      "Memory Theft"
    ]
  },
  {
    "zones": [
      [
        "eclipse-steps",
        "Schody zatmenia",
        "Steps of the Eclipse"
      ],
      [
        "black-sun-temple",
        "Chrám čierneho slnka",
        "Temple of the Black Sun"
      ]
    ],
    "color": "#bd9855",
    "story": [
      "Nad vežami visí nehybné zatmenie. Zlaté masky sledujú cestu ku chrámu a každý úder jeho zvona uberá svetu kúsok svetla.",
      "A motionless eclipse hangs above the spires. Golden masks watch the temple road, and every toll of its bell steals another fragment of daylight."
    ],
    "foes": [
      [
        "Skarabeus zatmenia",
        "Eclipse Beetle"
      ],
      [
        "Slnečný lev",
        "Sun Lion"
      ],
      [
        "Chrámový fanatik",
        "Temple Fanatic"
      ],
      [
        "Tieň súmraku",
        "Twilight Shade"
      ],
      [
        "Slnečný lukostrelec",
        "Solar Archer"
      ],
      [
        "Veštkyňa zatmenia",
        "Eclipse Oracle"
      ],
      [
        "Pozlátený strážca",
        "Gilded Sentinel"
      ],
      [
        "Hierofant zatmenia",
        "Eclipse Hierophant"
      ]
    ],
    "mechanic": "burn",
    "special": [
      "Slnečná erupcia",
      "Solar Flare"
    ]
  },
  {
    "zones": [
      [
        "rift-frontier",
        "Hranica roztrhnutého sveta",
        "Rift Frontier"
      ],
      [
        "last-crown",
        "Citadela poslednej koruny",
        "Citadel of the Last Crown"
      ]
    ],
    "color": "#ad79bc",
    "story": [
      "Hviezdy padajú nahor a chodníky sa lámu do prázdna. Na konci roztrhnutého sveta stojí citadela, ktorej koruna čaká na posledného vyzývateľa.",
      "Stars fall upward and paths fracture into the void. At the edge of the broken world stands a citadel whose crown awaits its final challenger."
    ],
    "foes": [
      [
        "Prázdnotový plaz",
        "Void Crawler"
      ],
      [
        "Astrálny vlk",
        "Astral Wolf"
      ],
      [
        "Trhlinový nájazdník",
        "Rift Marauder"
      ],
      [
        "Hviezdny prízrak",
        "Star Wraith"
      ],
      [
        "Prázdnotový strelec",
        "Void Archer"
      ],
      [
        "Čarodejník trhlín",
        "Rift Sorcerer"
      ],
      [
        "Šampión prázdnoty",
        "Void Champion"
      ],
      [
        "Kráľ poslednej koruny",
        "King of the Last Crown"
      ]
    ],
    "mechanic": "drain",
    "special": [
      "Vysatie prázdnoty",
      "Void Siphon"
    ]
  }
];

const innerFoes: [string,string][][] = [[["Bronzový pavúk","Bronze Spider"],["Duch presýpacích hodín","Hourglass Spirit"],["Pozlátená sfinga","Gilded Sphinx"],["Prekliata urna","Cursed Urn"],["Balzamovač v maske","Masked Embalmer"],["Slepý slnečný veštec","Blind Sun Seer"],["Štvorruký kolos","Four-Armed Colossus"],["Okrídlená slnečná cisárovná","Winged Sun Empress"]],[["Jantárový sliz","Amber Ooze"],["Smaragdová modlivka","Emerald Mantis"],["Elementál miazgy","Sap Elemental"],["Drevený šibal","Wooden Trickster"],["Tŕňová lovkyňa","Thorn Huntress"],["Orchideová čarodejnica","Orchid Enchantress"],["Dubový panciernik","Oak Armorlord"],["Kráľovná živého jadra","Heartwood Queen"]],[["Snežná sova","Snow Owl"],["Kryštálová líška","Crystal Fox"],["Cencúľový elementál","Icicle Elemental"],["Zrkadlový dvojník","Mirror Doppelganger"],["Biela čepeľ","White Blade Dancer"],["Kňažka polárnej žiary","Aurora Priestess"],["Medvedí gardista","Polar Bear Guard"],["Cisárovná kryštálových parohov","Crystal Antler Empress"]],[["Pecný salamander","Furnace Salamander"],["Kovová pijavica","Metal Leech"],["Dymový elementál","Smoke Elemental"],["Trpasličí kladivár","Dwarven Hammerer"],["Živá reťaz","Living Chain"],["Plamenná kňažka","Flame Priestess"],["Železný kyklop","Iron Cyclops"],["Prastarý lávový drak","Ancient Lava Dragon"]],[["Hromový orol","Thunder Eagle"],["Bronzová chrlička","Bronze Gargoyle"],["Veterný elementál","Wind Elemental"],["Lietajúca zbroj","Floating Armor"],["Bleskový duelant","Lightning Duelist"],["Búrková siréna","Storm Siren"],["Hromový baran","Thunder Ram"],["Štvorkrídly archón","Four-Winged Archon"]],[["Lebkový lišaj","Skull Moth"],["Prízračný pavúk","Spectral Spider"],["Smútočný závoj","Mourning Veil"],["Posadnutá rakva","Possessed Coffin"],["Bezhlavý halapartník","Headless Halberdier"],["Tkáčka duší","Soul Weaver"],["Dvojtvárny sudca","Twin-Faced Judge"],["Beztvárny kat duší","Faceless Soul Executioner"]],[["Zlatá kobylka","Golden Locust"],["Tieňová levica","Shadow Lioness"],["Oživený slnečný disk","Living Sun Disk"],["Pútnik zlatej masky","Golden Mask Pilgrim"],["Tanečník zatmenia","Eclipse Blade Dancer"],["Slepý astronóm","Blind Astronomer"],["Okrídlený slnečný kolos","Winged Solar Colossus"],["Avatar čierneho slnka","Black Sun Avatar"]],[["Hviezdna medúza","Star Jellyfish"],["Prázdnotová modlivka","Void Mantis"],["Tieňové chápadlá","Shadow Tentacles"],["Rozbitá maska","Broken Mask"],["Kozmický žnec","Cosmic Reaper"],["Tkáčka času","Time Weaver"],["Obsidiánový dračí gardista","Obsidian Dragon Guard"],["Panovník roztrieštenej koruny","Sovereign of the Shattered Crown"]]];
const innerStories: [string,string][] = [["Zlaté lúče prenikajú cez puknutý strop do pohrebných siení. Mechanické stráže ožili a zapečatená komora odpovedá na tvoje kroky údermi obrovského srdca.","Golden rays pierce a cracked roof above the burial halls. Mechanical guardians have awakened, and a sealed chamber answers your steps with a gigantic heartbeat."],["Korene sa stáčajú do živého paláca. Jantárová miazga nesie spomienky celého lesa a každý votrelcov krok prebúdza nového ochrancu.","Roots curl into a living palace. Amber sap carries the memories of the forest, and each intruder’s step awakens another protector."],["Zrkadlové siene odrážajú polárnu žiaru. Ľadové sochy sa pohybujú len v odraze a za poslednou bránou leží neporušená zimná koruna.","Mirrored halls reflect the aurora. Ice statues move only in reflections, and an untouched winter crown lies beyond the final gate."],["Reťaze držia trón nad jazerom lávy. Živý kov tu chytá návštevníkov a steny dýchajú žiarou tvora, ktorého hlas roztápa kameň.","Chains suspend a throne above a lava lake. Living metal traps visitors, and the walls breathe with the heat of a creature whose voice melts stone."],["Palác sa otáča v oku víchrice. Mosadzné veže zbierajú blesky a mosty sa skladajú iba na okamih, keď doznie posledný úder hromu.","The palace turns within the eye of a tempest. Brass towers gather lightning, and bridges form only as the last thunderclap fades."],["Za zrkadlami sú ukryté ukradnuté duše. Súdna sieň nemá živých svedkov a rozsudky tu vyslovujú tváre, ktoré si vzájomne odporujú.","Stolen souls hide behind mirrors. The court has no living witnesses, and its verdicts are spoken by faces that contradict one another."],["Čierne slnko vrhá svetlo dovnútra chrámu. Zlaté automaty odrátavajú posledné lúče dňa a oltár premieňa tiene na živých strážcov.","The black sun casts its light inward. Golden automatons count the last rays of daylight, and the altar turns shadows into living sentries."],["Posledný trón sa vznáša nad prasknutými hviezdami. Čas sa rozpadá na úlomky a každá časť koruny má vlastného ochrancu.","The final throne floats above fractured stars. Time splinters into fragments, and each piece of the crown has its own guardian."]];

const mechanicDescriptions: Record<Encounter['mechanic'],[string,string]> = {
  poison: ['Zvláštny útok otrávi na 3 ťahy. Obrana zabráni novému jedu.','The special poisons for 3 turns. Guard prevents new poison.'],
  frost: ['Zvláštny útok oslabí útok o 4 na 3 ťahy. Obrana zabráni novému oslabeniu.','The special reduces attack by 4 for 3 turns. Guard prevents new weakness.'],
  burn: ['Zvláštny útok spôsobí horenie na 3 ťahy. Obrana zabráni novému horeniu.','The special applies burning for 3 turns. Guard prevents new burning.'],
  drain: ['Zvláštny útok vylieči nepriateľa o polovicu spôsobeného poškodenia.','The special heals the enemy for half the damage dealt.'],
  shield: ['Zvláštny útok vytvorí štít na 2 ťahy a zníži prijaté zásahy o 4.','The special grants a shield for 2 turns, reducing incoming hits by 4.'],
};

const innerAttacks: string[][] = [["enemy-fangs","enemy-drain","enemy-fangs","enemy-curse","enemy-blade","enemy-burn","enemy-crush","enemy-burn"],["enemy-poison","enemy-fangs","enemy-poison","enemy-blade","enemy-arrow","enemy-poison","enemy-crush","enemy-drain"],["enemy-fangs","enemy-fangs","enemy-frost","enemy-blade","enemy-blade","enemy-frost","enemy-fangs","enemy-frost"],["enemy-burn","enemy-drain","enemy-burn","enemy-crush","enemy-blade","enemy-burn","enemy-crush","enemy-burn"],["enemy-fangs","enemy-crush","enemy-roar","enemy-blade","enemy-blade","enemy-roar","enemy-crush","enemy-frost"],["enemy-poison","enemy-poison","enemy-curse","enemy-fangs","enemy-blade","enemy-drain","enemy-crush","enemy-blade"],["enemy-poison","enemy-fangs","enemy-burn","enemy-blade","enemy-blade","enemy-burn","enemy-crush","enemy-burn"],["enemy-poison","enemy-fangs","enemy-drain","enemy-curse","enemy-blade","enemy-drain","enemy-fangs","enemy-drain"]];
export const lateSceneFrames: Record<string,number> = {};
export const lateEnemyFrames: Record<string,number> = {};
export const lateBasicArt: Record<string,string> = {};
export const lateAreas = biomes.flatMap((biome,biomeIndex) => biome.zones.map(([id,sk,en],branch) => {
  const level = 25 + (biomeIndex * 2 + branch) * 5;
  lateSceneFrames[id] = branch * 8 + biomeIndex;
  const enemies: Encounter[] = (branch ? innerFoes[biomeIndex] : biome.foes).map(([foeSk,foeEn],position) => {
    const kind = position === 7 ? 'boss' : position >= 4 ? 'elite' : 'normal';
    const name = id + ':' + foeEn;
    lateEnemyFrames[name] = branch * 64 + biomeIndex * 8 + position;
    const casterArt = biome.mechanic === 'burn' ? 'enemy-burn' : biome.mechanic === 'poison' ? 'enemy-poison' : biome.mechanic === 'frost' ? 'enemy-frost' : 'enemy-drain';
    lateBasicArt[name] = position === 4 ? 'enemy-arrow' : position === 5 ? casterArt : position === 7 ? biomeIndex === 2 ? 'enemy-crush' : casterArt : position === 3 && [2,4,5,6,7].includes(biomeIndex) ? casterArt : [0,1,3].includes(position) ? 'enemy-fangs' : 'enemy-blade';
    if (branch) lateBasicArt[name] = innerAttacks[biomeIndex][position];
    const artwork = lateBasicArt[name];
    const mechanic = position === 6 ? 'shield' : artwork === 'enemy-drain' ? 'drain' : artwork === 'enemy-poison' ? 'poison' : artwork === 'enemy-frost' || artwork === 'enemy-roar' ? 'frost' : artwork === 'enemy-burn' || artwork === 'enemy-curse' ? 'burn' : biome.mechanic;
    const multiplier = kind === 'boss' ? 1.8 : kind === 'elite' ? 1.25 : 1;
    const effectPower = Math.ceil((2 + level * .18) * (kind === 'boss' ? 1.3 : kind === 'elite' ? 1.15 : 1));
    const combat = { effectPower, effectDuration: kind === 'boss' && level >= 60 ? 4 : 3, specialEvery: kind === 'boss' && level >= 75 ? 2 : 3, specialMultiplier: Number((1.6 + level * .004 + (kind === 'boss' ? .2 : 0)).toFixed(2)), shieldPower: Math.ceil(4 + level * .22), enrageMultiplier: Number((1.35 + level * .002).toFixed(2)), drainRatio: Number((.5 + level * .001).toFixed(2)) };
    return { name, names: [foeSk,foeEn], kind, combat,
      hp: Math.round((100 + level * 8 + position * 15) * multiplier),
      damage: Math.round((7 + level * .35 + position) * (kind === 'boss' ? 1.45 : kind === 'elite' ? 1.15 : 1)),
      reward: Math.round((100 + level * 20 + position * 45) * multiplier),
      gold: Math.round((30 + level * 6 + position * 12) * multiplier),
      drops: ['Rusty charm','Guard boots','Ember cloak',...(kind === 'normal' ? [] : ['Runic staff']),...(kind === 'boss' ? ['Dawn relic'] : [])],
      mechanic, special: mechanic === 'shield' ? ['Kamenný kryt','Stone Cover'] : artwork === 'enemy-curse' ? ['Hnilobná kliatba','Rotting Curse'] : mechanic === 'drain' ? ['Krádež spomienok','Memory Theft'] : mechanic === 'poison' ? ['Jedovaté tŕne','Venomous Thorns'] : mechanic === 'frost' ? biomeIndex === 4 ? ['Úder hromu','Thunderclap'] : ['Mrazivý úder','Frost Strike'] : biome.special,
      description: [mechanicDescriptions[mechanic][0].replace('3 ťahy',combat.effectDuration+' ťahy').replace('o polovicu spôsobeného poškodenia','o '+Math.round(combat.drainRatio*100)+' % spôsobeného poškodenia').replace('o 4','o '+(mechanic === 'shield' ? combat.shieldPower : effectPower)) + (kind === 'boss' ? ' Pod 50 % HP sa rozzúri (+'+Math.round((combat.enrageMultiplier-1)*100)+' % poškodenie).' : ''),mechanicDescriptions[mechanic][1].replace('3 turns',combat.effectDuration+' turns').replace('for half the damage dealt','for '+Math.round(combat.drainRatio*100)+'% of damage dealt').replace('by 4','by '+(mechanic === 'shield' ? combat.shieldPower : effectPower)) + (kind === 'boss' ? ' Enrages below 50% HP (+'+Math.round((combat.enrageMultiplier-1)*100)+'% damage).' : '')],
    };
  });
  return {id,names:[sk,en] as [string,string],description:branch ? innerStories[biomeIndex] : biome.story,icon:'⚔️',level,color:biome.color,enemies};
}));
