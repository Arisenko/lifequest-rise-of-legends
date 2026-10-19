import { classes } from '../data/classes';
import type { ClassId } from '../data/classes';
import { GameButton } from './GameButton';

export function LegacyClassChoice({lang,onChoose,blocked}:{lang:'sk'|'en';onChoose:(id:ClassId)=>void;blocked:boolean}) {
  const index=lang==='sk'?0:1;
  return <section className="legacy-class-choice"><h2>{lang==='sk'?'Vyber si nové povolanie':'Choose your class'}</h2>
    <p>{lang==='sk'?'Základné povolanie bolo odstránené. Vyber si jednu zo šiestich ciest. Úroveň, zlato, predmety a získané atribúty zostanú zachované.':'The starter class has been removed. Choose one of six paths. Level, gold, items and earned attributes are preserved.'}</p>
    <div className="class-choice-grid">{Object.entries(classes).map(([id,profile])=><GameButton key={id} disabled={blocked} onClick={()=>onChoose(id as ClassId)}><strong>{profile.names[index]}</strong><small>{profile.role[index]}</small></GameButton>)}</div>
    {blocked&&<p>{lang==='sk'?'Najprv dokonči alebo opusti rozbehnutý súboj.':'Finish or leave the current battle first.'}</p>}
  </section>;
}
