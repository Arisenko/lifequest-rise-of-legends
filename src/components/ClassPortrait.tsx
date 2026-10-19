import { assetPath } from './assetPath';
import { classPortrait } from '../data/classPortraits';

export function ClassPortrait({className,lang}:{className:string;lang:'sk'|'en'}) {
  const portrait=classPortrait(className);
  const name=portrait.names[lang==='sk'?0:1];
  return <figure className="inventory-class-portrait">
    <div className="inventory-class-portrait-art">
      <img src={assetPath('/assets/characters/classes/'+portrait.file+'.png')} alt={name} loading="lazy" decoding="async"/>
    </div>
    <figcaption><strong>{name}</strong><small>{lang==='sk'?'Pracovný vizuál povolania — výbava a vlastný vzhľad sa doň zatiaľ nepremietajú.':'Temporary class illustration — equipped items and custom appearance are not shown yet.'}</small></figcaption>
  </figure>;
}
