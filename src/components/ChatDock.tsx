import { useEffect, useRef, useState } from 'react';
import type { Hero } from '../types/hero';
import { importantNotices, localSystemNotices, incomingNotices, noticeSignature } from '../data/systemNotices';
import type { SystemNotice } from '../data/systemNotices';
import { readPreference, writePreference } from '../systems/saveService';
import { GameIcon } from './GameArt';
import { WorldChat } from './WorldChat';

export function ChatDock({hero,setHero,lang,saveError=false,saveConflict=false,notices=[]}:{hero:Hero;setHero:(update:(hero:Hero)=>Hero)=>void;lang:'sk'|'en';saveError?:boolean;saveConflict?:boolean;notices?:SystemNotice[]}) {
  const [open,setOpen]=useState(false);
  const [folded,setFolded]=useState(()=>readPreference('lifequest-notices-folded','false')==='true');
  const feed=importantNotices([...notices,...localSystemNotices(hero,saveError,saveConflict)]);
  const index=lang==='sk'?0:1;
  const previousNotices=useRef<Set<string>>(new Set());
  const [highlighted,setHighlighted]=useState<string|null>(null);
  const [noticesExpanded,setNoticesExpanded]=useState(false);
  const preview=useRef<HTMLDivElement>(null);
  const feedSignature=JSON.stringify(feed.map(noticeSignature));
  useEffect(()=>{
    const incoming=incomingNotices(feed,previousNotices.current);
    previousNotices.current=new Set(feed.map(noticeSignature));
    if(!incoming.length)return;
    setFolded(false);
    setHighlighted(incoming[0].id);
    setNoticesExpanded(true);
  },[feedSignature]);
  useEffect(()=>{if(highlighted&&preview.current)preview.current.scrollTop=0},[highlighted,feedSignature]);
  const previewFeed=highlighted?[...feed.filter(notice=>notice.id===highlighted),...feed.filter(notice=>notice.id!==highlighted)]:feed;
  useEffect(()=>{writePreference('lifequest-notices-folded',String(folded))},[folded]);
  const dialog=useRef<HTMLDialogElement>(null);
  const launcher=useRef<HTMLButtonElement>(null);
  const tr=(sk:string,en:string)=>lang==='sk'?sk:en;
  useEffect(()=>{
    if(open&&!dialog.current?.open)dialog.current?.showModal();
    if(!open&&dialog.current?.open)dialog.current.close();
    if(!open)return;
    const previous=document.body.style.overflow;
    document.body.style.overflow='hidden';
    return()=>{document.body.style.overflow=previous};
  },[open]);
  const noticeList=(entries:SystemNotice[])=><ul className="monitor-messages">{entries.map(notice=><li key={notice.id} className={'notice-'+notice.severity}><span className="notice-source">{notice.source==='admin'?tr('ADMIN','ADMIN'):notice.source==='server'?tr('SERVER','SERVER'):tr('SYSTÉM','SYSTEM')}</span><div><strong>{notice.title[index]}</strong><p>{notice.message[index]}</p></div></li>)}</ul>;
  return <><aside className={'player-shortcuts chat-monitor'+(highlighted?' has-new-notice':'')} aria-label={tr('Dôležité oznamy','Important notices')}><div className="monitor-header"><button className="monitor-fold" aria-expanded={!folded} aria-controls="monitor-preview" onClick={()=>{setFolded(value=>!value);setHighlighted(null)}}><span className="monitor-indicator" aria-hidden="true"/>{tr('Oznamy','Notices')}<span aria-hidden="true">{folded?'▴':'▾'}</span></button><button ref={launcher} className="monitor-open" aria-haspopup="dialog" aria-expanded={open} aria-controls="player-chat" onClick={()=>setOpen(true)}><GameIcon name="private"/>{tr('Chat','Chat')}</button></div>{!folded&&<div ref={preview} id="monitor-preview" className="monitor-preview" role={previewFeed.some(notice=>notice.severity==='critical')?'alert':'status'}>{noticeList(previewFeed.slice(0,2))}{feed.length>2&&<small>{tr('Ďalšie oznamy v plnom chate','More notices in full chat')}</small>}</div>}</aside><dialog ref={dialog} id="player-chat" className="chat-drawer" aria-labelledby="player-chat-title" onCancel={()=>setOpen(false)} onClose={()=>{setOpen(false);launcher.current?.focus()}} onClick={event=>{if(event.target===event.currentTarget){const bounds=event.currentTarget.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)setOpen(false)}}}><header className="chat-drawer-heading"><div><small>LIFEQUEST · {tr('KOMUNIKÁCIA','COMMUNICATION')}</small><h2 id="player-chat-title">{tr('Tvoje správy','Your messages')}</h2></div><button autoFocus onClick={()=>setOpen(false)} aria-label={tr('Zavrieť chat','Close chat')}>×</button></header><details className="full-chat-notices" open={noticesExpanded} onToggle={event=>setNoticesExpanded(event.currentTarget.open)}><summary>{tr('Dôležité oznamy','Important notices')} · {feed.length}</summary>{noticeList(feed)}</details><WorldChat hero={hero} setHero={setHero} lang={lang}/></dialog></>;
}
