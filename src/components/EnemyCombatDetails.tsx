import { enemyCombatProfile } from '../data/enemyCombat';
import type { Encounter } from '../data/encounters';

export function EnemyCombatDetails({enemy,lang}:{enemy:Encounter;lang:'sk'|'en'}) {
  const profile=enemyCombatProfile(enemy);
  const tr=(sk:string,en:string)=>lang==='sk'?sk:en;
  return <div className="enemy-combat-details"><p>{tr('Špeciálny útok každých','Special attack every')} {profile.specialEvery} {tr('ťahov','turns')} · {Math.round(profile.specialMultiplier*100)} % {tr('základného útoku','base attack')}</p><p>{enemy.mechanic==='shield'?tr('Štít na 2 ťahy: −','Shield for 2 turns: −')+profile.shieldPower+tr(' poškodenia za zásah.',' damage per hit.'):enemy.mechanic==='drain'?tr('Liečenie nepriateľa: ','Enemy healing: ')+Math.round(profile.drainRatio*100)+tr(' % spôsobeného poškodenia.','% of damage dealt.'):tr('Sila efektu: ','Effect power: ')+profile.effectPower+' · '+profile.effectDuration+tr(' ťahy. Odolnosť znižuje jed a horenie; obrana blokuje nové efekty.',' turns. Resistance reduces poison and burn; guarding blocks new effects.')}</p>{enemy.kind==='boss'&&<p>{tr('Pod 50 % HP: +','Below 50% HP: +')+Math.round((profile.enrageMultiplier-1)*100)+tr(' % poškodenie.','% damage.')}</p>}</div>;
}
