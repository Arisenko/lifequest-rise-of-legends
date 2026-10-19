import { useEffect, useId, useRef, useState } from 'react';
import type { Hero } from '../types/hero';
import { freshHero, hydrateHero } from '../data/playerSave';
import { BACKUP_KEY, CHECKPOINT_KEY, SAVE_KEY, decodeSave, encodeSave } from '../systems/saveService';
import { GameButton } from './GameButton';

export function SavePanel({hero,lang,blocked=false,onReplace}:{hero:Hero;lang:'sk'|'en';blocked?:boolean;onReplace:(next:Hero)=>void}) {
  const tr=(sk:string,en:string)=>lang==='sk'?sk:en;
  const [pending,setPending]=useState<{hero:Hero;label:string}|null>(null);
  const [error,setError]=useState(false);
  const [busy,setBusy]=useState(false);
  const dialogTitle=useId();
  const dialog=useRef<HTMLDialogElement>(null);
  const file=useRef<HTMLInputElement>(null);
  useEffect(()=>{
    if(pending&&!dialog.current?.open)dialog.current?.showModal();
    else if(!pending&&dialog.current?.open)dialog.current.close();
  },[pending]);
  const download=(raw:string,name:string)=>{
    const url=URL.createObjectURL(new Blob([raw],{type:'application/json'}));
    const link=document.createElement('a');
    link.href=url;link.download=name;link.click();
    window.setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  return <section className="save-panel" aria-label={tr('Uloženie a záloha','Saves and backups')}>
    <h2>{tr('Uloženie a záloha','Saves and backups')}</h2>
    <p>{blocked?tr('Uloženie sa nedá bezpečne načítať. Pôvodné dáta zostali zachované; hra ich neprepíše.','Your save could not be loaded safely. Original data is preserved and will not be overwritten.'):tr('Progres sa ukladá automaticky na tomto zariadení. Pred zmenou vzniká aj posledná platná záloha. Export si odlož mimo prehliadača.','Progress saves automatically on this device, with a previous valid backup. Keep an exported copy outside the browser.')}</p>
    <div className="save-actions">
      <GameButton onClick={()=>{try{download(blocked?(localStorage.getItem(SAVE_KEY)||'null'):encodeSave(hero),'lifequest-'+(blocked?'recovery':'backup')+'.json');}catch{setError(true);}}}>{tr('Exportovať uloženie','Export save')}</GameButton>
      <GameButton disabled={busy} onClick={()=>file.current?.click()}>{tr('Importovať uloženie','Import save')}</GameButton>
      <GameButton onClick={()=>{try{const raw=localStorage.getItem(BACKUP_KEY);if(!raw)throw Error('missing');setPending({hero:hydrateHero(decodeSave(raw)),label:tr('Obnoviť poslednú zálohu','Restore previous backup')});setError(false);}catch{setError(true);}}}>{tr('Obnoviť zálohu','Restore backup')}</GameButton>
      <GameButton onClick={()=>{try{const raw=localStorage.getItem(CHECKPOINT_KEY);if(!raw)throw Error('missing');setPending({hero:hydrateHero(decodeSave(raw)),label:tr('Vrátiť stav pred nahradením','Restore pre-replacement save')});setError(false);}catch{setError(true);}}}>{tr('Stav pred novou hrou / importom','Before new game / import')}</GameButton>
      <GameButton className="danger" onClick={()=>setPending({hero:freshHero(),label:tr('Začať novú hru','Start a new game')})}>{tr('Nová hra','New game')}</GameButton>
    </div>
    <input ref={file} type="file" accept=".json,application/json" hidden aria-label={tr('Súbor uloženia','Save file')} onChange={async event=>{
      const selected=event.target.files?.[0];event.target.value='';
      if(!selected)return;
      setBusy(true);setError(false);
      try {if(selected.size>5_000_000)throw Error('size');const next=hydrateHero(decodeSave(await selected.text()));setPending({hero:next,label:tr('Importovať postavu','Import character')});}catch{setError(true);}finally{setBusy(false);}
    }}/>
    {error&&<p role="alert">{tr('Operácia sa nepodarila: súbor alebo záloha nie sú platné, prípadne je úložisko plné alebo nedostupné. Aktuálny progres zostal nezmenený.','Operation failed: invalid file/backup, or storage is full or unavailable. Your current progress has not changed.')}</p>}
    <dialog aria-labelledby={dialogTitle} ref={dialog} className="loot-dialog save-confirm" onCancel={()=>setPending(null)} onClose={()=>setPending(null)}>
      {pending&&<><h2 id={dialogTitle}>{pending.label}?</h2><p>{tr('Nahradí sa aktuálna postava a jej progres. Najprv odporúčame export. Pôvodné uloženie zostane aj v lokálnej zálohe.','This replaces your current character and progress. Export first. The original save will also be kept as a local backup.')}</p><p><strong>{pending.hero.name||tr('Nová postava','New character')}</strong> · {tr('Úroveň','Level')} {pending.hero.level}</p><div className="save-actions"><GameButton autoFocus onClick={()=>setPending(null)}>{tr('Zrušiť','Cancel')}</GameButton><GameButton className="danger" onClick={()=>{try{onReplace(pending.hero);setPending(null);setError(false);}catch{setError(true);setPending(null);}}}>{tr('Potvrdiť nahradenie','Confirm replacement')}</GameButton></div></>}
    </dialog>
  </section>;
}
