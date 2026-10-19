import { compareEquipment } from '../data/equipmentComparison';
import { isConsumable } from '../data/consumables';
import { localizedStatName } from '../data/localization';
import { EnemyLoot } from './EnemyLoot';
import type { Hero } from '../types/hero';

export function EquipmentComparison({hero,id,lang}:{hero:Hero;id:string;lang:'sk'|'en'}){
  const comparison=compareEquipment(hero,id),tr=(sk:string,en:string)=>lang==='sk'?sk:en;
  if(!comparison||isConsumable(id))return null;
  const {before,after,replaced}=comparison;
  const metrics:[string,number,number][]=[
    [tr('Fyzický útok','Physical attack'),before.physical,after.physical],
    [tr('Magický útok','Magic attack'),before.magical,after.magical],
    [tr('Max. život','Max. health'),before.maxHp,after.maxHp],
    [tr('Brnenie','Armor'),before.armor,after.armor],
    ...Object.keys(before.stats).map(stat=>[localizedStatName(stat,lang),before.stats[stat as keyof typeof before.stats],after.stats[stat as keyof typeof after.stats]] as [string,number,number])
  ];
  const changes=metrics.filter(([,previous,next])=>previous!==next);
  return <details className="equipment-comparison"><summary>{tr('Porovnať s aktuálnou výbavou','Compare with equipped gear')}</summary><h5>{tr('Nahradí nasadené predmety','Replaces equipped items')}</h5>{replaced.length?<EnemyLoot drops={replaced.map(entry=>entry.itemId)} stats={hero.stats} lang={lang} context="inventory"/>:<p>{tr('Prázdny slot — nič neodložíš.','Empty slot — nothing will be unequipped.')}</p>}<h5>{tr('Zmena štatistík celej výbavy','Change to total equipment stats')}</h5><dl>{changes.map(([label,previous,next])=><div key={label}><dt>{label}</dt><dd className={next>previous?'comparison-gain':'comparison-loss'}>{previous} → {next} <b>({next>previous?'+':''}{next-previous})</b></dd></div>)}</dl>{!changes.length&&<p>{tr('Bez zmeny týchto štatistík.','These stats are unchanged.')}</p>}<small>{tr('Počíta aj aktívne setové bonusy. Pasívky, schopnosti a požiadavky si pozri v detaile predmetu.','Includes active set bonuses. Inspect item details for passives, abilities and requirements.')}</small></details>;
}
