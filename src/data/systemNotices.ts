import type { Hero } from '../types/hero';

export type SystemNotice={id:string;source:'system'|'server'|'admin';severity:'info'|'warning'|'critical';important:boolean;title:[string,string];message:[string,string]};
export const noticeSignature=(notice:SystemNotice)=>JSON.stringify([notice.id,notice.source,notice.severity,notice.title,notice.message]);
export function incomingNotices(notices:SystemNotice[],previous:ReadonlySet<string>) {
  return importantNotices(notices).filter(notice=>!(notice.source==='system'&&notice.id==='local-mode')&&!previous.has(noticeSignature(notice)));
}
export function importantNotices(notices:SystemNotice[]) {
  const seen=new Set<string>();
  const priority={critical:0,warning:1,info:2};
  return notices.filter(notice=>{
    if(!notice.important||seen.has(notice.id))return false;
    seen.add(notice.id);
    return true;
  }).sort((first,second)=>priority[first.severity]-priority[second.severity]).slice(0,20);
}
export function localSystemNotices(hero:Hero,saveError=false,saveConflict=false):SystemNotice[] {
  const notices:SystemNotice[]=[];
  if(saveError||saveConflict)notices.push({id:'save-warning',source:'system',severity:'critical',important:true,title:['Progres potrebuje pozornosť','Your progress needs attention'],message:saveConflict?['Iné okno zmenilo uloženie. Exportuj svoj stav a obnov stránku.','Another window changed the save. Export your state and reload.']:['Ukladanie zlyhalo. Exportuj progres cez menu postavy.','Saving failed. Export your progress from the character menu.']});
  if(hero.battle?.ended==='win'&&hero.battle.reward)notices.push({id:'battle-reward',source:'system',severity:'info',important:true,title:['Odmeny zo súboja uložené','Battle rewards saved'],message:[hero.battle.reward.xp+' XP · '+hero.battle.reward.gold+' zlata · '+hero.battle.reward.items.length+' predmetov',hero.battle.reward.xp+' XP · '+hero.battle.reward.gold+' gold · '+hero.battle.reward.items.length+' items']});
  notices.push({id:'local-mode',source:'system',severity:'info',important:true,title:['Lokálny režim','Local mode'],message:['Server nie je pripojený. Správy hráčov sa zatiaľ neodosielajú.','No server connected. Player messages are not delivered yet.']});
  return notices;
}
