import { EquipmentComparison } from './EquipmentComparison';
import { CombatIcon } from './CombatIcon';
import { equipBattleReward } from '../data/rewardEquipment';
import { isConsumable } from '../data/consumables';
import { itemSlots } from '../data/equipment';
import { GameButton } from './GameButton';
import type { BattleReward } from '../data/battle';
import type { Hero } from '../types/hero';
import { GameIcon } from './GameArt';
import { GoldValue } from './GoldValue';
import { EnemyLoot } from './EnemyLoot';

export function BattleRewards({reward,hero,lang,onEquip}:{onEquip?:(index:number)=>void;reward:BattleReward;hero:Hero;lang:'sk'|'en'}) {
  const tr=(sk:string,en:string)=>lang==='sk'?sk:en;
  return <section className="battle-rewards" aria-label={tr('Získané odmeny','Rewards earned')}><h4>{tr('Získal si','You earned')}</h4><div className="battle-currency"><div className="battle-xp"><GameIcon name="training"/><span><strong>+{reward.xp.toLocaleString(lang==='sk'?'sk-SK':'en-GB')} XP</strong><small>{tr('Skúsenostné body','Experience points')}</small></span></div><div><GoldValue amount={reward.gold} lang={lang}/><small>{tr('Získané zlato','Gold earned')}</small></div></div><div className="battle-earned-items"><h4>{tr('Získané predmety','Items received')}</h4>{reward.items.length?<>{reward.items.map((id,index)=>{const equippable=onEquip?equipBattleReward(hero,index)!==hero:false;return <div className="battle-reward-item" key={index}><EnemyLoot drops={[id]} stats={hero.stats} lang={lang} context="inventory"/>{onEquip&&(isConsumable(id)||itemSlots(id,hero.className).length>0)&&<>{!reward.equippedItems?.includes(index)&&<EquipmentComparison hero={hero} id={id} lang={lang}/>}<GameButton className="reward-equip-button" variant="combat" disabled={!equippable} onClick={()=>onEquip(index)}><CombatIcon name={isConsumable(id)?'potion':'guard'}/><span>{reward.equippedItems?.includes(index)?tr('Nasadené','Equipped'):isConsumable(id)?tr('Pripraviť na boj','Prepare for combat'):tr('Nasadiť teraz','Equip now')}</span><span className="reward-equip-arrow" aria-hidden="true">→</span></GameButton>{!reward.equippedItems?.includes(index)&&!equippable&&<small>{hero.inventory.includes(id)?tr('Nespĺňaš požiadavky alebo nemáš voľné miesto pre výmenu či zásoby.','Requirements not met or no space for swapping gear or preparing supplies.'):tr('Predmet je v schránke odmien alebo už nie je v batohu.','The item is in your reward chest or no longer in your backpack.')}</small>}</>}</div>;})}<p>{tr('Predmety už máš uložené. Klikni na obrázok pre bonusy a požiadavky.','Your items are already saved. Click an image to view bonuses and requirements.')}</p></>:<p>{tr('Tentoraz nepadol žiadny predmet. XP a zlato sú tvoje.','No items dropped this time. The XP and gold are yours.')}</p>}</div></section>;
}
