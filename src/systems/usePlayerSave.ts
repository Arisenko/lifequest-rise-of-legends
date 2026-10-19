import { useEffect, useRef, useState } from 'react';
import type { Hero } from '../types/hero';
import { freshHero, hydrateHero } from '../data/playerSave';
import { normalizePlayer, refreshEnergy, refreshIdleRecovery } from '../data/playerSystems';
import { decodeSave, replaceSave, saveGame, SAVE_KEY } from './saveService';

export function usePlayerSave() {
  const [initial]=useState(()=>{
    try {
      const raw=localStorage.getItem(SAVE_KEY);
      return {hero:raw?hydrateHero(decodeSave(raw)):normalizePlayer(freshHero()),blocked:false,raw};
    } catch {return {hero:normalizePlayer(freshHero()),blocked:true,raw:null};}
  });
  const [hero,updateHero]=useState(initial.hero);
  const [blocked,setBlocked]=useState(initial.blocked);
  const [saveError,setSaveError]=useState(false);
  const expectedRaw=useRef(initial.raw);
  const [saveConflict,setSaveConflict]=useState(false);
  useEffect(()=>{
    if(blocked)return;
    try {
      if(localStorage.getItem(SAVE_KEY)!==expectedRaw.current){setSaveConflict(true);return;}
      saveGame(localStorage,hero);
      expectedRaw.current=localStorage.getItem(SAVE_KEY);
      setSaveError(false);
    }catch {setSaveError(true);}
  },[hero,blocked]);
  useEffect(()=>{
    if(blocked)return;
    const sync=()=>updateHero(current=>refreshIdleRecovery(current));
    const timer=window.setInterval(sync,15000);
    window.addEventListener('focus',sync);
    return()=>{window.clearInterval(timer);window.removeEventListener('focus',sync);};
  },[blocked]);
  const setHero=(update:Hero|((current:Hero)=>Hero))=>{
    if(!blocked)updateHero(previous=>normalizePlayer(typeof update==='function'?update(refreshEnergy(previous)):update));
  };
  const replaceHero=(next:Hero)=>{
    const normalized=hydrateHero(next);
    replaceSave(localStorage,normalized);
    expectedRaw.current=localStorage.getItem(SAVE_KEY);
    updateHero(normalized);
    setBlocked(false);
    setSaveError(false);
    setSaveConflict(false);
    return normalized;
  };
  return {hero,setHero,replaceHero,blocked,saveError,saveConflict};
}
