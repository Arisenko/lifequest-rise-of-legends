import { itemPower } from '../data/itemPowers';
import { itemData } from '../data/loot';

export function ItemPowers({id,lang}:{id:string;lang:'sk'|'en'}) {
  const power=itemPower(itemData[id]);
  if(!power)return null;
  const tr=(sk:string,en:string)=>lang==='sk'?sk:en;
  return <section className="item-powers"><h3>{tr('Bojová sila predmetu','Item combat powers')}</h3>
    <p>+{power.damagePercent} % {tr('fyzické aj magické poškodenie','physical and magical damage')} · +{power.armor} {tr('brnenie','armor')}</p>
    <p>{tr('Ozvena: každý','Echo: every')} {power.echoEvery}. {tr('útočný ťah pridá','attacking turn adds')} {power.echoPercent} % {tr('poškodenia navyše.','extra damage.')}</p>
    {power.leechPercent>0&&<p>{tr('Vysatie života','Life steal')}: {power.leechPercent} % {tr('priameho skutočne udeleného poškodenia.','actual direct damage dealt.')}</p>}
    {power.skillMultiplier>0&&<p>{power.rank===3?tr('Kataklizma','Cataclysm'):tr('Relikviový úder','Relic Strike')}: {power.skillMultiplier*100} % {tr('silnejšieho útoku','of your stronger attack')} · 8 {tr('výdrž','stamina')} · {power.cooldown} {tr('ťahov obnova','turn cooldown')}{power.rank===3?' · '+tr('horenie 3 ťahy, 10 % útoku za ťah','burn for 3 turns, 10% attack per turn'):''}.</p>}
    <small>{tr('Iba pri nasadení. Percentuálne bonusy, ozvena, vysatie a schopnosť sa nesčítavajú: platí najvyššia nasadená rarita. Brnenie sa sčíta do +12. Ozvena nevytvára ďalšiu ozvenu.','Only while equipped. Damage percentage, echo, life steal and ability use only the highest equipped rarity, not multiple copies. Armor stacks up to +12. Echo cannot trigger another echo.')}</small>
  </section>;
}
