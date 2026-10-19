import { assetPath } from './assetPath';
import { JourneyArtwork } from './JourneyArtwork';
import { dungeonSets } from '../data/dungeonSets';
import { itemData } from '../data/loot';
import { cleanItems } from '../data/cleanArt';
import { RegionArt } from './GameArt';

const fallback:Record<string,string>={'Healing herb':'herb','Iron helm':'helmet','Rusty charm':'charm','Guard boots':'boots','War drum':'drum','Ember cloak':'cloak','Runic staff':'sword','Dawn relic':'charm','Emberlord blade':'sword'};
export function ItemArtwork({id,className='',alt=''}:{id:string;className?:string;alt?:string}) {
  const item=itemData[id];
  if(item?.routeTarget)return <JourneyArtwork frame={0} className={'item-sprite '+className}/>;
  if(item?.setArtBase) {
    const set=dungeonSets.find(set=>set.id===item.setId)!;
    const base=item.setArtBase;
    const marks=['M4 4L12 12M12 4L4 12','M10 2A6 6 0 1 0 10 14A5 5 0 0 1 10 2','M2 13L8 3L14 13Z','M3 4L8 8L13 4M8 8V14','M8 1L10 6L15 6L11 10L13 15L8 12L3 15L5 10L1 6L6 6Z'];
    return <span className={'item-sprite set-item-sprite '+className} role={alt?'img':undefined} aria-label={alt||undefined}>
      {cleanItems[base]?<RegionArt region={cleanItems[base]} file="items-clean-v2.png" className="set-item-base"/>:<img className="set-item-base" src={assetPath('/assets/items/'+base+'.png')} alt="" loading="lazy" decoding="async"/>}
      <svg className="set-item-sigil" viewBox="0 0 20 20" aria-hidden="true" style={{color:set.color}}><circle cx="10" cy="10" r="9" fill="#19131f" stroke="currentColor"/><path d={marks[set.sigil]} transform="translate(2 2)" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>
    </span>;
  }
  const key=item?.art||fallback[id]||'charm';
  if(cleanItems[key])return <RegionArt region={cleanItems[key]} file="items-clean-v2.png" className={'item-sprite '+className} label={alt||undefined}/>;
  return <img className={'item-sprite '+className} src={assetPath('/assets/items/'+key+'.png')} alt={alt} loading="lazy" decoding="async"/>;
}
