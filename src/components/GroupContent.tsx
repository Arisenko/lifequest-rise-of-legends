import { useEffect, useState } from 'react';
import { DeferredDetails } from './DeferredDetails';
import { GameButton } from './GameButton';
import { PageIntro } from './PageIntro';
import { BackButton } from './BackButton';
import { SceneArt } from './GameArt';
import { EnemyLoot } from './EnemyLoot';
import { raidRewardBosses } from '../data/dungeonItems';
import { dungeonSets } from '../data/dungeonSets';
import { mountDrops, lootTable, itemData } from '../data/loot';
import { dungeons } from '../data/dungeons';
import { Expeditions } from './Expeditions';
import { DUNGEON_KEY, RAID_TOKEN, enterDungeon, leaveDungeon, instanceRemaining } from '../data/access';

export function GroupContent({ mode, hero, setHero, lang }: {mode:'dungeons'|'raids';hero:any;setHero:(update:(hero:any)=>any)=>void;lang:'sk'|'en'}) {
  const [now,setNow]=useState(Date.now);
  useEffect(()=>{const timer=window.setInterval(()=>setNow(Date.now()),1000);return()=>window.clearInterval(timer)},[]);
  const countdown=(remaining:number)=>{const seconds=Math.ceil(remaining/1000);return Math.floor(seconds/3600)+':'+String(Math.floor(seconds/60)%60).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0')};
  const tr = (sk:string,en:string) => lang === 'sk' ? sk : en;
  const index=lang==='sk'?0:1;
  const dungeon = mode === 'dungeons';
  const item = dungeon ? DUNGEON_KEY : RAID_TOKEN;
  const count = hero.inventory.filter((id:string) => id === item).length;
  const busy = Boolean(hero.battle && !hero.battle.ended);
  if (dungeon && hero.dungeonRun) return <div className={'group-board '+(dungeon?'dungeon-environment':'raid-environment')}>
    <BackButton icon="dungeons" disabled={busy} onClick={() => setHero(current => leaveDungeon(current))} label={hero.dungeonRun.complete||hero.dungeonRun.failed ? tr('Späť k vstupu do dungeonov','Back to dungeon entrance') : tr('Opustiť dungeon · kľúč sa nevracia','Leave dungeon · key is not refunded')}/>
    <Expeditions hero={hero} setHero={setHero} lang={lang} mode="dungeon"/>
  </div>;

  return <div className={'group-board '+(dungeon?'dungeon-environment':'raid-environment')}>
    <PageIntro scene={mode} icon={mode} eyebrow={tr('ZA BRÁNAMI EMBERFALLU','BEYOND EMBERFALL')} title={dungeon ? tr('Dungeony','Dungeons') : tr('Raidy','Raids')} description={dungeon ? tr('Päť dungeonov, päť legendárnych mountov. Každý má tri kompletné sedemdielne sety a vlastnú epickú a legendárnu korisť.','Five dungeons, five legendary mounts. Each has three complete seven-piece sets and exclusive epic and legendary loot.') : tr('Citadela popolavého draka: pripravovaný prvý raid a jeho odmeny.','Ashen Dragon Citadel: the planned first raid and its rewards.')}/>
    <section className="city-room access-entrance">
      <p className="instance-cooldown">{dungeon?tr('Každý dungeon: jeden pokus za 24 hodín od vstupu. Výhra, porážka aj ústup spotrebujú pokus aj kľúč.','Each dungeon: one attempt per 24 hours from entry. Victory, defeat and retreat consume the attempt and key.'):tr('Raid: jeden pokus za 7 dní od vstupu. Súboje a pravidlá raidu sa ešte pripravujú.','Raid: one attempt per 7 days from entry. Raid combat and rules are still in preparation.')}</p><EnemyLoot drops={[item]} stats={hero.stats} lang={lang} context="entrance"/>
      <p>{tr('V batohu','In backpack')}: <strong>{count}</strong> · {tr('Cena vstupu','Entry cost')}: 1</p>
      <p>{dungeon ? tr('Každý dungeon má tri komnaty. Jeden kľúč sa spotrebuje pri vstupe, nie pri každom súboji. Boss má nezávislú 5 % šancu zhodiť raidovú pečať. Ústup kľúč nevracia.','Each dungeon has three chambers. One key is consumed on entry, not per fight. Bosses independently drop a raid seal at 5%. Retreat does not refund the key.') : tr('Raid zatiaľ nie je hrateľný. Pečate ani energia sa nespotrebujú. Náhľady ukazujú pripravené pravidlá, nie dostupnú odmenu.','The raid is not playable yet. Seals and energy are not consumed. Previews show prepared rules, not currently obtainable rewards.')}</p>
      {dungeon ? <div className="dungeon-list">{dungeons.map(area=>{
        const boss=area.enemies[area.enemies.length-1];
        const remaining=instanceRemaining(hero,'dungeon',area.id,now);
        return <article className="dungeon-entry" key={area.id}>
          <SceneArt scene={area.scene} label={area.names[index]}/>
          <h3>{area.names[index]}</h3><p>{area.description[index]}</p>
          <p>{tr('Vyžaduje úroveň','Required level')}: {area.level} · {tr('Komnaty','Chambers')}: {area.enemies.length}</p>
          <p>{tr('Identitu bossa odhalíš až po prejdení predošlých komnát.','The boss’s identity is revealed after clearing the preceding chambers.')}</p>
          <EnemyLoot drops={[...area.exclusiveDrops.filter(id=>!itemData[id].setId),...mountDrops({kind:'boss',id:boss.name,mode:'dungeon',dungeonId:area.id})]} stats={hero.stats} lang={lang} context="catalog"/>{dungeonSets.filter(set=>set.dungeonId===area.id).map(set=><DeferredDetails key={set.id} className="dungeon-set-catalog"><summary>{set.names[index]} · 7/7 {tr('kusov v ponuke koristi','pieces in loot pool')}</summary><EnemyLoot drops={set.items} stats={hero.stats} lang={lang} context="catalog"/></DeferredDetails>)}
          <small>{tr('Aj bežná korisť. Epické predmety: elita alebo boss; legendárne a mount: iba boss. Spoločná legendárna šanca 0,3 %.','Also regular loot. Epic items: elite or boss; legendary items and mount: boss only. Shared legendary chance: 0.3%.')}</small>
          {remaining>0&&<p className="instance-cooldown">{tr('Ďalší pokus o','Next attempt in')} {countdown(remaining)}</p>}<GameButton disabled={remaining>0||!count||busy||hero.level<area.level||hero.hp<=0||hero.energyResting||(hero.restUntil||0)>Date.now()} onClick={()=>setHero(current=>enterDungeon(current,Date.now(),area.id))}>{remaining>0?tr('Dnešný pokus bol využitý','Daily attempt already used'):hero.level<area.level?tr('Nedostatočná úroveň','Level too low'):tr('Vstúpiť · 1 kľúč','Enter · 1 key')}</GameButton>
        </article>;
      })}</div> : <>
        <h3>{tr('Korisť prvého raidu','First raid loot')}</h3>
        <p>{tr('Epická kategória 2,5 % (vrátane boss bonusu), legendárna 0,6 %: dvojnásobok šancí dungeonového bossa. Špeciálna kategória 0,1 %, iba finálny raidový boss. Najviac jeden predmet z hlavnej koristi.','Epic tier 2.5% (including boss bonus), legendary 0.6%: twice the dungeon boss chances. Special tier 0.1%, final raid boss only. At most one main loot item.')}</p>
        {raidRewardBosses.map(boss=>{
          const source={kind:'boss' as const,id:boss.id,mode:'raid' as const};
          return <DeferredDetails key={boss.id} className="raid-reward-wing"><summary>{boss.names[index]} · {tr('Pripravované odmeny','Planned rewards')}</summary>
            <EnemyLoot drops={lootTable(source).flatMap(tier=>tier.candidates).filter(id=>!itemData[id].setId)} source={source} stats={hero.stats} lang={lang}/>
            {dungeonSets.filter(set=>set.dungeonId===boss.dungeonId).map(set=><DeferredDetails key={set.id}><summary>{set.names[index]} · 7/7</summary><EnemyLoot drops={set.items} source={source} stats={hero.stats} lang={lang}/></DeferredDetails>)}
          </DeferredDetails>;
        })}
        <p>{tr('Aj medzi raidovými súbojmi sú plánované náhodné pasce, skrýše a oddychové udalosti. Spoločný systém je pripravený; spustí sa až s hrateľným raidom.','Random traps, caches and rest events are also planned between raid encounters. The shared system is ready and will activate when raid combat becomes playable.')}</p>
        <GameButton disabled>{tr('Online raid sa pripravuje','Online raid in preparation')}</GameButton>
      </>}
    </section>
  </div>;
}
