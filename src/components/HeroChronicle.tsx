import { isEnemyUnlocked } from '../data/adventureProgress';
import { resolveClass } from '../data/classes';
import { useEffect, useState } from 'react';
import { chronicleSummary } from '../data/chronicle';
import { GameIcon } from './GameArt';

export function HeroChronicle({ hero, lang, onContinue }: { hero: any; lang: 'sk' | 'en'; onContinue: (target: { tab: string; areaId?: string }) => void }) {
  const [now,setNow] = useState(() => new Date());
  useEffect(() => {
    const update = () => setNow(new Date());
    const timer = window.setInterval(update,60000);
    window.addEventListener('focus',update);
    return () => { window.clearInterval(timer); window.removeEventListener('focus',update); };
  },[]);
  const tr = (sk:string,en:string) => lang === 'sk' ? sk : en;
  const summary = chronicleSummary(hero,now);
  const boss = summary.area.enemies.find(enemy => enemy.kind === 'boss')!;
  const index = lang === 'sk' ? 0 : 1;
  const nextAreaText = summary.allCleared ? tr('Všetky oblasti si oslobodil. Vráť sa po korisť alebo skús dungeon.','You have cleared every region. Return for loot or try a dungeon.') : !isEnemyUnlocked(hero,summary.area.id,boss.name)?tr('Postupne odhaľ protivníkov v oblasti ','Reveal the opponents of ')+summary.area.names[index]+tr(' a nájdi cestu k jej strážcovi.',' and find your way to its guardian.'):tr('Poraz bossa ','Defeat ') + boss.names[index] + tr(' v oblasti ',' in ') + summary.area.names[index] + tr(' a posuň svoju legendu ďalej.',' and advance your legend.');
  return <div className="hero-chronicle">
    <div className="chronicle-backdrop" aria-hidden="true"/>
    <p className="eyebrow"><GameIcon name="adventures"/>{tr('KRONIKA HRDINU','HERO CHRONICLE')}</p>
    <div className="chronicle-identity">
      <div className={'chronicle-portrait layered-avatar face-'+(hero.face||'1')+' hair-'+(hero.hair||'0')+' beard-'+(hero.beard||'0')+' color-'+(hero.hairColor||'hnedá')} role="img" aria-label={tr('Portrét hrdinu ','Portrait of ') + hero.name}><span className="avatar-composite"/><span className="avatar-face"/><span className="avatar-hair"/><span className="avatar-beard"/></div>
      <div><strong>{hero.name}</strong><small>{resolveClass(hero.className).names[index]}</small></div>
    </div>
    <div className="chronicle-objective"><small>{summary.battle ? tr('ROZBEHNUTÝ SÚBOJ','BATTLE IN PROGRESS') : summary.dungeon ? tr('OTVORENÝ DUNGEON','OPEN DUNGEON') : tr('TVOJ ĎALŠÍ CIEĽ','YOUR NEXT GOAL')}</small><p>{summary.battle ? tr('Tvoj protivník stále čaká. Pokračuj v uloženom súboji.','Your opponent is still waiting. Resume your saved battle.') : summary.dungeon ? tr('Vráť sa do svojho uloženého dungeonového behu.','Return to your saved dungeon run.') : nextAreaText}</p></div>
    <div className="chronicle-today"><GameIcon name="training"/><span>{tr('Dnes dokončené tréningy','Training completed today')}: <b>{summary.completedToday}</b><small>{tr('XP z dnešných tréningov','XP from today’s training')}: +{summary.trainingXpToday}</small></span></div>
    <button className="chronicle-continue" onClick={() => onContinue(summary.target)}><GameIcon name={summary.dungeon?'dungeons':'adventures'}/><span>{summary.battle ? tr('Pokračovať v súboji','Resume battle') : summary.dungeon ? tr('Pokračovať v dungeone','Resume dungeon') : tr('Pokračovať v dobrodružstve','Continue the adventure')}</span></button>
  </div>;
}
