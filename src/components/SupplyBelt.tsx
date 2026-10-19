import { isConsumable, supplyLimit } from '../data/consumables';
import { localizedItemName } from '../data/localization';
import { ItemArtwork } from './ItemArtwork';
import { GameButton } from './GameButton';
import { itemData } from '../data/loot';
import type { Hero } from '../types/hero';

export function SupplyBelt({hero,lang,onPrepare,onUnprepare}:{hero:Hero;lang:'sk'|'en';onPrepare?:(index:number)=>void;onUnprepare?:(index:number)=>void}){
  const tr=(sk:string,en:string)=>lang==='sk'?sk:en,supplies=hero.preparedConsumables||[],limit=supplyLimit(hero.className),blocked=Boolean(hero.battle&&!hero.battle.ended);
  return <section className="inventory-panel supply-belt"><h3>{tr('Pripravené spotrebné predmety','Prepared consumables')} · {supplies.length}/{limit}</h3><p>{tr('Každý kus zaberá jedno miesto. Rovnaké predmety môžeš pripraviť viackrát. V boji sú použiteľné iba tieto zásoby; dopĺňať ich môžeš mimo boja.','Each copy takes one space. You may prepare multiple copies of the same item. Only these supplies can be used in battle; refill them outside combat.')}</p><div className="supply-slots">{Array.from({length:limit},(_,index)=>{const id=supplies[index];return <div className="supply-slot" key={index}>{id?<><ItemArtwork id={id}/><strong>{localizedItemName(id,lang)}</strong><GameButton disabled={blocked||hero.inventory.length>=50} onClick={()=>onUnprepare?.(index)}>{tr('Odložiť','Unequip')}</GameButton></>:<span>{tr('Voľné miesto','Empty space')}</span>}</div>})}</div><h4>{tr('Doplniť z batohu','Prepare from backpack')}</h4><div className="supply-options">{hero.inventory.map((id,index)=>isConsumable(id)?<GameButton key={index} disabled={blocked||supplies.length>=limit||hero.level<(itemData[id]?.level||1)} onClick={()=>onPrepare?.(index)}><ItemArtwork id={id}/>{localizedItemName(id,lang)} · {tr('Pripraviť','Prepare')}</GameButton>:null)}</div></section>;
}
