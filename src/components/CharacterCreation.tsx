import { classes, startingStats } from '../data/classes';
import { ClassInfo } from './ClassInfo';
import { StudioCredit } from './StudioCredit';
import { Brand } from './Brand';
import { GameIcon } from './GameArt';

export function CharacterCreation({hero,onChange,onStart,lang,onLanguage}:{hero:any;onChange:(hero:any)=>void;onStart:()=>void;lang:'sk'|'en';onLanguage:()=>void}) {
  const tr=(sk:string,en:string)=>lang==='sk'?sk:en;
  const classNames=Object.fromEntries(Object.entries(classes).map(([id,profile])=>[id,profile.names]));
  return <main className="setup welcome-screen">
    <button className="setup-language-toggle" onClick={onLanguage} aria-label={tr('Zmeniť jazyk','Change language')}>SK / EN</button>
    <div className="welcome-heading"><Brand large/><p className="eyebrow">{tr('TVOJA LEGENDA SA ZAČÍNA TU','YOUR LEGEND STARTS HERE')}</p><h1>{tr('Každý hrdina má svoj príbeh.','Every hero has a story.')}</h1><p className="tagline">{tr('Skutočné úsilie. Fantasy dobrodružstvo. Vytvor si hrdinu a vstúp do Emberfallu.','Real effort. Fantasy adventure. Create your hero and enter Emberfall.')}</p></div>
    <form className="creation-panel card" onSubmit={event=>{event.preventDefault();if(hero.name.trim())onStart()}}>
      <div className="creation-preview">
        <p className="eyebrow">{tr('TVOJ HRDINA','YOUR HERO')}</p>
        <div className={`creation-avatar layered-avatar face-${hero.face||'1'} hair-${hero.hair||'0'} beard-${hero.beard||'0'} color-${hero.hairColor||'hnedá'}`}><span className="avatar-composite"/><span className="avatar-face"/><span className="avatar-hair"/><span className="avatar-mustache"/><span className="avatar-beard"/></div>
        <strong>{hero.name||tr('Nový hrdina','New hero')}</strong><small>{classNames[hero.className]?.[lang==='sk'?0:1]}</small>
        <div className="creation-preview-caption"><GameIcon name="character"/>{tr('Vzhľad sa mení podľa tvojho výberu.','Your appearance follows your choices.')}</div>
      </div>
      <div className="creation-fields">
        <div><p className="eyebrow">{tr('PRVÁ KAPITOLA','CHAPTER ONE')}</p><h2>{tr('Vytvor si postavu','Create your character')}</h2></div>
        <label>{tr('Meno hrdinu','Hero name')}<input required maxLength={30} autoComplete="off" placeholder={tr('Napríklad Arin','For example, Arin')} value={hero.name} onChange={event=>onChange({...hero,name:event.target.value})}/></label>
        <label>{tr('Povolanie','Class')}<select value={hero.className} onChange={event=>onChange({...hero,className:event.target.value,stats:startingStats(event.target.value),hp:30+startingStats(event.target.value).Vitality*3,classRulesVersion:2})}>{Object.entries(classNames).map(([id,names])=><option key={id} value={id}>{names[lang==='sk'?0:1]}</option>)}</select></label>
        <ClassInfo className={hero.className} lang={lang}/>
        <div className="creation-options">
          {(['face','hair','beard'] as const).map(part=><label key={part}>{part==='face'?tr('Tvár','Face'):part==='hair'?tr('Účes','Hair style'):tr('Brada','Beard')}<select value={hero[part]} onChange={event=>onChange({...hero,[part]:event.target.value})}>{part!=='face'&&<option value="0">{part==='hair'?tr('Bez vlasov','No hair'):tr('Bez brady','No beard')}</option>}{['1','2','3','4','5'].map(value=><option key={value} value={value}>{part==='face'?tr('Tvár','Face'):part==='hair'?tr('Účes','Hair style'):tr('Brada','Beard')} {value}</option>)}</select></label>)}
          <label>{tr('Farba vlasov','Hair color')}<select value={hero.hairColor} onChange={event=>onChange({...hero,hairColor:event.target.value})}>{[['hnedá',tr('Hnedá','Brown')],['čierna',tr('Čierna','Black')],['ryšavá',tr('Ryšavá','Ginger')],['blond',tr('Blond','Blonde')]].map(([value,label])=><option value={value} key={value}>{label}</option>)}</select></label>
        </div>
        <p className="creation-note">{tr('Po vstupe sa vzhľad uzamkne. Progres sa automaticky ukladá v tomto prehliadači.','Your appearance locks on entry. Progress saves automatically in this browser.')}</p>
        <button className="welcome-start" disabled={!hero.name.trim()} type="submit"><GameIcon name="adventures"/>{tr('Začať svoju legendu','Begin your legend')}<span aria-hidden="true">→</span></button>
        <small className="welcome-local">{tr('Lokálna hra · bez registrácie a platených API','Local game · no registration or paid APIs')}</small>
      </div>
    </form>
    <StudioCredit lang={lang}/>
  </main>;
}
