import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try {
  const {freshHero}=await server.ssrLoadModule('/src/data/playerSave.ts');
  const {startBattle}=await server.ssrLoadModule('/src/data/battle.ts');
  const {encounters}=await server.ssrLoadModule('/src/data/encounters.ts');
  const {encounterAreas}=await server.ssrLoadModule('/src/data/encounters.ts');
  const {dungeons}=await server.ssrLoadModule('/src/data/dungeons.ts');
  const {LodgingProgress}=await server.ssrLoadModule('/src/components/LodgingProgress.tsx');
  for(const lang of ['sk','en']){
    const now=1800000000000;
    const html=renderToStaticMarkup(createElement(LodgingProgress,{hero:{...freshHero(),hp:1,energy:0,energyResting:true,energyUpdatedAt:now,lodgingUpdatedAt:now},now,lang}));
    assert(html.includes(lang==='sk'?'Plné zdravie o':'Full health in'));
    assert(html.includes(lang==='sk'?'Plná energia o':'Full energy in'));
    assert(!html.includes('NaN'));
  }
  const {BattleRewards}=await server.ssrLoadModule('/src/components/BattleRewards.tsx');
  for(const lang of ['sk','en']){
    const reward={xp:30,gold:10,items:['Iron helm','Healing herb']};
    const hero={...freshHero(),inventory:[...reward.items],battle:{...startBattle(encounters[0]),ended:'win',reward}};
    const html=renderToStaticMarkup(createElement(BattleRewards,{hero,reward,lang,onEquip(){}}));
    assert(html.includes(lang==='sk'?'Nasadiť teraz':'Equip now'));
    assert(html.includes(lang==='sk'?'Porovnať s aktuálnou výbavou':'Compare with equipped gear'));
    assert(html.includes('reward-equip-button'));
    assert(html.includes(lang==='sk'?'Pripraviť na boj':'Prepare for combat'));
  }
  const screens=[
    ['JourneyPanel',{area:encounterAreas[1],setHero(){},onBack(){}}],
    ['QuestBoard',{level:25,stats:{Strength:5,Intelligence:5,Discipline:5,Vitality:5},energy:100,blocked:false,onAdvance(){}}],
    ['BattleRewards',{reward:{xp:50,gold:20,items:['Guard boots','Dungeon key']}}],
    ['BattleCard',{battle:{...startBattle(encounters[0]),ended:'win',reward:{xp:50,gold:20,items:['Guard boots','Dungeon key']}},receipt:null,onAct(){},onRetreat(){},onBack(){}}],
    ['BattleCard',{battle:startBattle(encounters[0]),receipt:null,onAct(){},onRetreat(){},onBack(){}}],
    ['WorldChat',{setHero(){}}],
    ['HeroChronicle',{onContinue(){}}],
    ['ChatDock',{setHero(){},onCharacter(){}}],
    ['City',{setHero(){},onNavigate(){}}],
    ['CharacterCreation',{onChange(){},onStart(){},onLanguage(){}}],
    ['CharacterScreen',{onEquip(){},onUnequip(){},onDiscard(){},onClaim(){},onUse(){}}],
    ['SavePanel',{onReplace(){}}],
    ['Expeditions',{initialAreaId:'forbidden-forest',setHero(){}}],
    ['GroupContent',{mode:'dungeons',setHero(){}}],
    ['GroupContent',{mode:'raids',setHero(){}}],
  ];
  for(const lang of ['sk','en'])for(const [name,props] of screens) {
    const module=await server.ssrLoadModule('/src/components/'+name+'.tsx');
    const html=renderToStaticMarkup(createElement(module[name],{hero:{...freshHero(),name:'Test'},lang,...props}));
    assert(html.length>100,name);
    assert(!html.includes('undefined'),name);
    if(name==='QuestBoard'){assert.equal((html.match(/class="quest card /g)||[]).length,30);assert.equal((html.match(/class="quests training-carousel"/g)||[]).length,3);assert.equal((html.match(/class="training-activity-icon"/g)||[]).length,30);assert(html.includes(lang==='sk'?'Ďalšie tréningy':'Next training cards'));}
    if(name==='SavePanel')assert(html.includes(lang==='sk'?'Exportovať uloženie':'Export save'));
    if(name==='HeroChronicle')assert(!html.includes(encounterAreas[0].enemies.at(-1).names[lang==='sk'?0:1]),'Chronicle reveals a locked boss');
    console.log(lang+' · '+name+': render OK');
  }
  const {Expeditions}=await server.ssrLoadModule('/src/components/Expeditions.tsx');
  const {BattleCard}=await server.ssrLoadModule('/src/components/BattleCard.tsx');
  const {enemySpecialIcon}=await server.ssrLoadModule('/src/data/enemyAttackArt.ts');
  const {JourneyPanel}=await server.ssrLoadModule('/src/components/JourneyPanel.tsx');
  const {advanceJourney}=await server.ssrLoadModule('/src/data/journeys.ts');
  const {hazardAt}=await server.ssrLoadModule('/src/data/journeyHazards.ts');
  const {startJourney}=await server.ssrLoadModule('/src/data/journeys.ts');
  for(const lang of ['sk','en']){
    const hero=startJourney({...freshHero(),name:'Test',clearedAreas:[encounterAreas[0].id]},encounterAreas[1].id,.3);
    const {journeyPath}=await server.ssrLoadModule('/src/data/journeys.ts');
    for(const kind of ['death','bandits','rockfall','poison','bridge','current','pit','stairs']){
      let sample;
      for(let stage=0;stage<5;stage++)for(let row=0;row<3;row++){
        const journey={...hero.journey,step:stage,choices:journeyPath(hero.journey.seed).slice(0,stage)};
        if(hazardAt(journey,row)===kind)sample=advanceJourney({...hero,journey},row);
      }
      if(!sample)continue;
      const hazardHtml=renderToStaticMarkup(createElement(Expeditions,{hero:sample,lang,initialAreaId:encounterAreas[1].id,setHero(){}}));
      assert(hazardHtml.includes(kind==='bandits'?'battle-card':'travel-event-dialog'));
      assert(hazardHtml.includes('journey-hazards-v1.webp')||hazardHtml.includes('journey-terrain-hazards-v1.png'));
      assert(!hazardHtml.includes('undefined'));
    }
    const html=renderToStaticMarkup(createElement(JourneyPanel,{hero,area:encounterAreas[1],lang,setHero(){},onBack(){}}));
    assert.equal((html.match(/class="journey-node/g)||[]).length,15);
    assert(html.includes(lang==='sk'?'Zvoľ orientačný bod':'Choose a landmark'));
    assert(!html.includes('route-map-legend'));
    const {routeMapFor}=await server.ssrLoadModule('/src/data/routeMaps.ts');
    const mapped=renderToStaticMarkup(createElement(JourneyPanel,{hero:{...hero,inventory:[routeMapFor(encounterAreas[1].id).id]},area:encounterAreas[1],lang,setHero(){},onBack(){}}));
    assert(mapped.includes('route-map-legend'));
    const route=renderToStaticMarkup(createElement(Expeditions,{hero,lang,initialAreaId:encounterAreas[1].id,setHero(){}}));
    assert(route.includes('journey-panel'));
    assert(!route.includes('class="game-button challenge-button"'));
  }
  const {TravelEventCard}=await server.ssrLoadModule('/src/components/TravelEventCard.tsx');
  const {createTravelEvent}=await server.ssrLoadModule('/src/data/travelEvents.ts');
  for(const lang of ['sk','en'])for(let frame=0;frame<6;frame++){
    const hero={...freshHero(),name:'Test',pendingTravelEvent:createTravelEvent('adventure','forbidden-forest',0,1,0,0,(frame+.2)/6)};
    const html=renderToStaticMarkup(createElement(TravelEventCard,{hero,setHero(){},lang}));
    assert(html.includes(lang==='sk'?'Túto výzvu nemožno obísť.':'This challenge cannot be bypassed.'));
    assert(!html.includes(lang==='sk'?'Obísť · bez rizika':'Bypass · no risk'));
    assert(html.includes('class="travel-event-dialog"'));
    assert(html.includes('aria-labelledby='));
    const route=renderToStaticMarkup(createElement(Expeditions,{hero,lang,initialAreaId:'forbidden-forest',setHero(){}}));
    assert(route.includes('travel-event-card'));
    assert(/class="game-button challenge-button"[^>]*disabled|disabled=""[^>]*class="game-button challenge-button"/.test(route));
    console.log(lang+' · travel event '+frame+': rendered and combat gated');
  }
  for(const lang of ['sk','en'])for(const name of ['Bog witch','Canyon Berserker','Lunar Automaton','Barnacle Sailor','Moon Librarian','Red Crystal Golem','Reef Crab','Emberlord','Canyon Marauder']){
    const enemy=encounters.find(entry=>entry.name===name);
    const kind=enemy.mechanic==='burn'?'burn':enemy.mechanic==='frost'?'weakness':'poison';
    const battle={...startBattle(enemy),turn:3,effects:[{kind,turns:3,power:4}]};
    const html=renderToStaticMarkup(createElement(BattleCard,{hero:{...freshHero(),name:'Test'},battle,lang,receipt:null,onAct(){},onRetreat(){},onBack(){}}));
    assert(html.includes('combat-icon-'+enemySpecialIcon(enemy)),name+' special icon');
    if(name==='Bog witch')assert(!html.includes('combat-icon-enemy-burn'),'Curse incorrectly displays fire');
    console.log(lang+' · '+name+': semantic attack art OK');
  }
  for(const lang of ['sk','en'])for(const mode of ['adventure','dungeon'])for(const stage of [0,1]) {
    const area=mode==='adventure'?encounterAreas[0]:dungeons[0];
    const hero={...freshHero(),name:'Test',...(mode==='adventure'?{defeatedEnemies:{[area.id]:area.enemies.slice(0,stage).map(enemy=>enemy.name)}}:{dungeonRun:{dungeonId:area.id,stage,complete:false}})};
    const html=renderToStaticMarkup(createElement(Expeditions,{hero,lang,mode,initialAreaId:area.id,setHero(){}}));
    const locked=area.enemies.length-stage-1;
    assert.equal((html.match(/class="encounter-card /g)||[]).length,area.enemies.length);
    assert.equal((html.match(/class="encounter-card encounter-locked"/g)||[]).length,locked);
    assert.equal((html.match(/class="locked-encounter-veil"/g)||[]).length,locked);
    for(const enemy of area.enemies.slice(stage+1)) {
      assert(!html.includes('aria-label="'+enemy.names[lang==='sk'?0:1]+'"'),'Hidden enemy portrait leaked');
      assert(!html.includes('<h3>'+enemy.names[lang==='sk'?0:1]+'</h3>'),'Hidden enemy name leaked');
    }
    console.log(lang+' · '+mode+' stage '+stage+': no locked-enemy spoilers');
  }
} finally {
  await server.close();
}
