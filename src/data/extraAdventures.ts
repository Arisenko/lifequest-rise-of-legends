import type { Encounter } from './encounters';

const commonDrops = ['Rusty charm','Guard boots','Ember cloak'];
const eliteDrops = [...commonDrops,'Runic staff'];
const bossDrops = [...eliteDrops,'Dawn relic'];
export const extraAreas = [
  {
    id: 'crimson-canyon', names: ['Karmínová roklina','Crimson Canyon'] as [string,string],
    description: ['Červené kryštály spievajú pod nohami a lanové mosty sa trasú bez vetra. Za územím vyhnancov stráži cestu bazilišok, ktorému v žilách prúdi roztavený kremeň.','Red crystals sing underfoot and rope bridges tremble without wind. Beyond the exiles’ territory, a basilisk with molten quartz in its veins guards the path.'] as [string,string],
    icon: '🏜️', level: 15, color: '#b96651',
    enemies: [
      {name:'Crimson Scorpion',names:['Karmínový škorpión','Crimson Scorpion'],kind:'normal',hp:150,damage:12,reward:240,gold:85,drops:commonDrops,mechanic:'poison',special:['Jed kryštálov','Crystal Venom'],description:['Tvor s kryštálovým pancierom. Jeho zvláštny útok otrávi na tri ťahy.','A crystal-armored creature. Its special attack poisons for three turns.']},
      {name:'Canyon Marauder',names:['Roklinový nájazdník','Canyon Marauder'],kind:'elite',hp:230,damage:16,reward:380,gold:140,drops:eliteDrops,mechanic:'shield',special:['Kamenný kryt','Stone Cover'],description:['Vyhnanec stráži visiaci most. Pri zvláštnom útoku sa chráni štítom.','An exile guards the hanging bridge. His special attack grants a shield.']},
      {name:'Canyon Vulture',names:['Roklinový sup','Canyon Vulture'],kind:'normal',hp:155,damage:12,reward:250,gold:90,drops:commonDrops,mechanic:'drain',special:['Krvavé hodovanie','Blood Feast'],description:['Mrchožrút krúži nad mostami. Zvláštnym útokom kradne život.','A scavenger circles the bridges. Its special attack steals life.']},
      {name:'Red Crystal Golem',names:['Golem červeného kryštálu','Red Crystal Golem'],kind:'normal',hp:190,damage:13,reward:270,gold:95,drops:commonDrops,mechanic:'shield',special:['Kryštálová stena','Crystal Wall'],description:['Pomalý tvor chráni mäkké jadro štítom z červeného kremeňa.','A lumbering creature protects its soft core with a red quartz shield.']},
      {name:'Ember Witch',names:['Žeravá čarodejnica','Ember Witch'],kind:'normal',hp:170,damage:14,reward:290,gold:100,drops:commonDrops,mechanic:'burn',special:['Popolavá kliatba','Ash Curse'],description:['Vyhnaná čarodejnica používa kliatbu, ktorá páli tri ťahy.','An exiled witch uses a curse that burns for three turns.']},
      {name:'Canyon Berserker',names:['Roklinový berserker','Canyon Berserker'],kind:'elite',hp:250,damage:17,reward:420,gold:155,drops:eliteDrops,mechanic:'frost',special:['Drvivý rev','Crushing Roar'],description:['Jeho rev oslabí tvoj útok. Bráň sa pred zvláštnym úderom.','Its roar weakens your attack. Guard against its special strike.']},
      {name:'Crystal Knight',names:['Kryštálový rytier','Crystal Knight'],kind:'elite',hp:275,damage:18,reward:460,gold:170,drops:eliteDrops,mechanic:'shield',special:['Brnenie rokliny','Canyon Armor'],description:['Posledný strážca baziliška si pravidelne obnovuje obranný štít.','The basilisk’s final guardian periodically renews a defensive shield.']},
      {name:'Crystal Basilisk',names:['Kryštálový bazilišok','Crystal Basilisk'],kind:'boss',hp:360,damage:21,reward:1200,gold:480,drops:bossDrops,mechanic:'burn',special:['Roztavený dych','Molten Breath'],description:['Pán rokliny páli na tri ťahy. Pod polovicou HP sa rozzúri.','The canyon lord burns for three turns. Enrages below half health.']},
    ] as Encounter[],
  },
  {
    id:'sunken-observatory',names:['Potopené observatórium','Sunken Observatory'] as [string,string],
    description:['Príliv odhalil schody k dávno stratenej hvezdárni. Zrkadlá stále sledujú mesiac, no ich strážcovia už nepatria tomuto svetu. Za bronzovou bránou čaká veštec hlbín.','The tide has revealed stairs to a long-lost observatory. Its mirrors still track the moon, but its guardians no longer belong to this world. Beyond a bronze gate waits the oracle of the deep.'] as [string,string],
    icon:'🌙',level:20,color:'#58a9a3',
    enemies:[
      {name:'Drowned Acolyte',names:['Utopený akolyta','Drowned Acolyte'],kind:'normal',hp:180,damage:14,reward:300,gold:105,drops:commonDrops,mechanic:'drain',special:['Príliv života','Life Tide'],description:['Hviezdny kultista kradne život a časť zásahu si mení na liečenie.','A star cultist steals life, healing for part of the damage dealt.']},
      {name:'Lunar Automaton',names:['Lunárny automat','Lunar Automaton'],kind:'elite',hp:280,damage:18,reward:480,gold:180,drops:eliteDrops,mechanic:'frost',special:['Mesačný lúč','Moonbeam'],description:['Bronzový strážca zameriava mesačný lúč, ktorý oslabuje útok.','A bronze guardian focuses a moonbeam that weakens attacks.']},
      {name:'Reef Crab',names:['Útesový krab','Reef Crab'],kind:'normal',hp:195,damage:14,reward:320,gold:110,drops:commonDrops,mechanic:'shield',special:['Pancier útesu','Reef Shell'],description:['Obrovský krab sa ukrýva pod kamenným pancierom.','A giant crab shelters beneath a stone shell.']},
      {name:'Barnacle Sailor',names:['Námorník obrastený mušľami','Barnacle Sailor'],kind:'normal',hp:210,damage:15,reward:340,gold:120,drops:commonDrops,mechanic:'poison',special:['Hnilobná kotva','Rotting Anchor'],description:['Nemŕtvy námorník roznáša jed hrdzavou kotvou.','An undead sailor spreads poison with a rusty anchor.']},
      {name:'Moon Librarian',names:['Mesačný knihovník','Moon Librarian'],kind:'normal',hp:200,damage:16,reward:360,gold:130,drops:commonDrops,mechanic:'drain',special:['Zakázaná stránka','Forbidden Page'],description:['Prízračný knihovník premieňa ukradnutý život na vlastnú silu.','A spectral librarian turns stolen life into its own strength.']},
      {name:'Tide Serpent',names:['Prílivový had','Tide Serpent'],kind:'elite',hp:310,damage:19,reward:520,gold:195,drops:eliteDrops,mechanic:'poison',special:['Jed hlbín','Deep Venom'],description:['Had z hlbín otrávi nepripraveného hrdinu na tri ťahy.','A serpent of the deep poisons an unprepared hero for three turns.']},
      {name:'Astral Inquisitor',names:['Astrálny inkvizítor','Astral Inquisitor'],kind:'elite',hp:340,damage:21,reward:570,gold:215,drops:eliteDrops,mechanic:'frost',special:['Rozsudok mesiaca','Moon Judgment'],description:['Strážca veštca oslabuje útok sústredeným mesačným svetlom.','The oracle’s guardian weakens attacks with focused moonlight.']},
      {name:'Astral Oracle',names:['Astrálny veštec','Astral Oracle'],kind:'boss',hp:450,damage:25,reward:1600,gold:650,drops:bossDrops,mechanic:'drain',special:['Zatmenie duší','Soul Eclipse'],description:['Chápadlový veštec odčerpáva život. Pod polovicou HP zosilnie jeho zúrivosť.','A tentacled oracle drains life. Below half health its rage empowers its attacks.']},
    ] as Encounter[],
  },
];
