import type { CSSProperties } from 'react';
import { itemData, rarities } from '../data/loot';
import { itemWeight } from '../data/playerSystems';
import { ItemArtwork } from './ItemArtwork';

export function ItemCard({id,name,lang,onInspect}:{id:string;name:string;lang:'sk'|'en';onInspect:()=>void}) {
  const item=itemData[id],rarity=rarities[item.rarity];
  const index=lang==='sk'?0:1;
  return <button type="button" className="enemy-loot-tile item-preview" style={{'--item-rarity':rarity.color} as CSSProperties} onClick={onInspect} aria-label={(lang==='sk'?'Zobraziť predmet: ':'Inspect item: ')+name} aria-haspopup="dialog">
    <span className="item-preview-art"><ItemArtwork id={id}/></span>
    <span className="item-preview-name">{name}</span>
    <small className="item-preview-rarity">{rarity.names[index]}</small>
    <small className="item-preview-meta">{itemWeight(id).toLocaleString(lang==='sk'?'sk-SK':'en-GB')} kg{item.level?' · '+(lang==='sk'?'Úr. ':'Lv. ')+item.level:''}</small>
  </button>;
}
