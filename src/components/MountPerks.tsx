import { mounts } from '../data/mounts';

export function MountPerks({id,lang}:{id:string;lang:'sk'|'en'}) {
  const perks=mounts.find(mount=>mount.id===id)?.perks;
  if(!perks)return null;
  const tr=(sk:string,en:string)=>lang==='sk'?sk:en;
  return <div className="mount-perks">
    {perks.capacity&&<p>+{perks.capacity} kg {tr('nosnosť','carry capacity')}</p>}
    {perks.stamina&&<p>+{perks.stamina} {tr('maximálna výdrž','maximum stamina')}</p>}
    {perks.energy&&<p>+{perks.energy} {tr('maximálna energia','maximum energy')}</p>}
    {perks.armor&&<p>+{perks.armor} {tr('brnenie','armor')}</p>}
    {perks.regeneration&&<p>×{perks.regeneration.toLocaleString(lang==='sk'?'sk-SK':'en-GB')} {tr('rýchlosť obnovy energie (aj pri oddychu)','energy regeneration speed (including rest)')}</p>}
    {perks.burnImmune&&<p>{tr('Dračia krv: imunita voči priebežnému poškodeniu horením. Neblokuje priamy zásah ani jed.','Dragonblood: immune to burn damage over time. Does not block direct hits or poison.')}</p>}
  </div>;
}
