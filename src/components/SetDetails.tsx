import { dungeonSets } from '../data/dungeonSets';

export function SetDetails({setId,lang,equipped}:{setId?:string;lang:'sk'|'en';equipped?:string[]}) {
  const set=dungeonSets.find(set=>set.id===setId);
  if(!set)return null;
  const index=lang==='sk'?0:1;
  const count=equipped?set.items.filter(id=>equipped.includes(id)).length:undefined;
  const labels:Record<string,string>=lang==='sk'?{Strength:'Sila',Intelligence:'Inteligencia',Discipline:'Disciplína',Vitality:'Vitalita'}:{Strength:'Strength',Intelligence:'Intelligence',Discipline:'Discipline',Vitality:'Vitality'};
  return <section className="set-details"><h3>{set.names[index]}{count!==undefined?' · '+count+'/7':''}</h3>
    {set.bonuses.map(bonus=><p key={bonus.pieces} className={count!==undefined&&count>=bonus.pieces?'requirement-met':undefined}>{bonus.pieces} {lang==='sk'?(bonus.pieces<5?'kusy':'kusov'):'pieces'}: {Object.entries(bonus.stats).map(([stat,value])=>'+'+value+' '+labels[stat]).join(' · ')}{count!==undefined&&count>=bonus.pieces?' ✓':''}</p>)}
    <small>{lang==='sk'?'Počítajú sa iba rôzne nasadené kusy presne tohto setu. Bonusy za 2/4/7 kusov sa sčítajú.':'Only distinct equipped pieces of this exact set count. The 2/4/7 piece bonuses stack.'}</small>
  </section>;
}
