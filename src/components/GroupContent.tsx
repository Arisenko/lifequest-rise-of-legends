import { PageIntro } from './PageIntro';
import { BackButton } from './BackButton';
import { EnemyLoot } from './EnemyLoot';
import { Expeditions } from './Expeditions';
import { DUNGEON_KEY, RAID_TOKEN, enterDungeon, leaveDungeon } from '../data/access';

export function GroupContent({ mode, hero, setHero, lang }: {mode:'dungeons'|'raids';hero:any;setHero:(update:(hero:any)=>any)=>void;lang:'sk'|'en'}) {
  const tr = (sk:string,en:string) => lang === 'sk' ? sk : en;
  const dungeon = mode === 'dungeons';
  const item = dungeon ? DUNGEON_KEY : RAID_TOKEN;
  const count = hero.inventory.filter((id:string) => id === item).length;
  const busy = Boolean(hero.battle && !hero.battle.ended);
  if (dungeon && hero.dungeonRun) return <div className="group-board">
    <BackButton icon="dungeons" disabled={busy} onClick={() => setHero(current => leaveDungeon(current))} label={hero.dungeonRun.complete ? tr('Späť k vstupu do dungeonov','Back to dungeon entrance') : tr('Opustiť dungeon · kľúč sa nevracia','Leave dungeon · key is not refunded')}/>
    <Expeditions hero={hero} setHero={setHero} lang={lang} mode="dungeon"/>
  </div>;
  return <div className="group-board">
    <PageIntro scene={mode} icon={mode} eyebrow={tr('ZA BRÁNAMI EMBERFALLU','BEYOND EMBERFALL')} title={dungeon ? tr('Dungeony','Dungeons') : tr('Raidy','Raids')} description={dungeon ? tr('Kľúč odomkne tri strážené komnaty katakomb. Na ich konci čaká boss a šanca získať pečať do raidu.','A key unlocks three guarded catacomb chambers. A boss awaits at the end, with a chance to drop a raid seal.') : tr('Dračia citadela vyžaduje spojencov a vstupnú pečať z dungeonového bossa.','The dragon citadel requires allies and an entry seal from a dungeon boss.')}/>
    <section className="city-room access-entrance">
      <h3>{dungeon ? tr('Katakomby Havranmoru','Ravenmoor Catacombs') : tr('Citadela popolavého draka','Ashen Dragon Citadel')}</h3>
      <EnemyLoot drops={[item]} stats={hero.stats} lang={lang} context="entrance"/>
      <p>{tr('V batohu','In backpack')}: <strong>{count}</strong> · {tr('Cena vstupu','Entry cost')}: 1</p>
      <p>{dungeon ? tr('Kľúč má 5 % šancu padnúť z každého bossa na výpravách. Spotrebuje sa pri vstupe. Postup dungeonovým behom sa ukladá; ústup ani porážka kľúč nevrátia. Každý súboj stojí energiu.','A key has a 5% drop chance from every adventure boss. It is consumed on entry. Dungeon run progress is saved; leaving or defeat does not refund it. Each battle costs energy.') : tr('Pečať má 5 % šancu padnúť z bossa v dungeone. Online raid zatiaľ nie je dostupný — pečate aj energia zostávajú nedotknuté.','A seal has a 5% drop chance from a dungeon boss. Online raids are not available yet — seals and energy remain untouched.')}</p>
      {dungeon ? <button disabled={!count || busy || hero.hp <= 0 || hero.energyResting || (hero.restUntil || 0) > Date.now()} onClick={() => setHero(current => enterDungeon(current))}>{tr('Odomknúť dungeon · 1 kľúč','Unlock dungeon · 1 key')}</button> : <button disabled>{tr('Online raid sa pripravuje','Online raid in preparation')}</button>}
    </section>
  </div>;
}
