import { CombatIcon } from './CombatIcon';
import { GameButton } from './GameButton';

export function CombatActionButton({icon,title,detail,cost,cooldown=0,lang,disabled,onClick}:{icon:string;title:string;detail?:string;cost:number;cooldown?:number;lang:'sk'|'en';disabled?:boolean;onClick:()=>void}) {
  const tr=(sk:string,en:string)=>lang==='sk'?sk:en;
  return <GameButton variant="combat" className={'combat-action action-'+icon} disabled={disabled} onClick={onClick}><span className="combat-action-art"><CombatIcon name={icon}/></span><span className="combat-action-copy"><strong>{title}</strong>{detail&&<small>{detail}</small>}<span className="combat-action-meta"><em>{cost+' '+tr('výdrž','stamina')}</em><em>{cooldown>0?tr('Obnova: ','Recharge: ')+cooldown+' '+tr('ťahy','turns'):'1 '+tr('ťah','turn')}</em></span></span></GameButton>;
}
