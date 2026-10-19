import { MAX_LEVEL, xpToNextLevel } from '../data/progression';
import { localizedItemName } from '../data/localization';
import { ItemPowers } from './ItemPowers';
import { ClassInfo } from './ClassInfo';
import { ItemRestrictions } from './ItemRestrictions';
import { meetsRequirements, itemSlots } from '../data/equipment';
import { SetDetails } from './SetDetails';
import { equippedSetBonuses } from '../data/dungeonSets';
import { MountPerks } from './MountPerks';
import { ClassPortrait } from './ClassPortrait';
import { ItemArtwork } from './ItemArtwork';
import { GameButton } from './GameButton';
import { SlotGlyph } from './SlotGlyph';
import { GameIcon } from './GameArt';
import type { EquippedItem } from '../data/equipment';
import { carriedWeight } from '../data/playerSystems';
import { itemData } from '../data/loot';
import { mounts } from '../data/mounts';
import { derivedStats, itemWeight, INVENTORY_LIMIT, canReceive } from '../data/playerSystems';
import { EnemyLoot } from './EnemyLoot';
import { rarities } from '../data/loot';
import { inventoryCategory, isConsumable, supplyLimit } from '../data/consumables';
import { SupplyBelt } from './SupplyBelt';
import { useEffect, useId, useRef, useState } from 'react';

type Props = { onPrepare?:(index:number)=>void;onUnprepare?:(index:number)=>void; hero: any; lang: 'sk'|'en'; onEquip: (index: number, slot?: string) => void; onUnequip: (instanceId:string)=>void; onDiscard: (item: string, index: number) => void; onClaim: (index: number) => void; onUse: (id: string) => void };
const leftSlots = ['Helma', 'Brnenie', 'Shoulders', 'Rukavice', 'Plášť', 'Nohavice', 'Topánky'];
const rightSlots = ['Prsteň 1', 'Prsteň 2', 'Prsteň 3', 'Prsteň 4', 'Náhrdelník', 'Charm', 'Spotrebné predmety'];
const ItemArt = ({id}:{id?:string}) => id ? <ItemArtwork id={id} className="item-art"/> : <span className="item-art empty-art">＋</span>;

export function CharacterScreen({ hero, lang, onEquip, onUnequip, onDiscard, onClaim, onUse, onPrepare, onUnprepare }: Props) {
  const [category,setCategory]=useState('all');
  const categories=[['all','Všetko','All'],['weapons','Zbrane','Weapons'],['armor','Zbroje','Armor'],['consumables','Spotrebné','Consumables'],['other','Ostatné','Other']];
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const equipmentDialog = useRef<HTMLDialogElement>(null);
  const dialogTitle = useId();
  useEffect(() => {
    const dialog = equipmentDialog.current;
    if (!dialog) return;
    if (selectedSlot && !dialog.open) dialog.showModal();
    else if (!selectedSlot && dialog.open) dialog.close();
  }, [selectedSlot]);
  useEffect(() => {
    if (!selectedSlot) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [selectedSlot]);
  const tr = (sk: string, en: string) => lang === 'sk' ? sk : en;
  const itemName = (id:string) => localizedItemName(id,lang);
  const slotLabel = (slot: string) => ({Helma: tr('Helma', 'Helmet'), Brnenie: tr('Brnenie', 'Armor'), Shoulders: tr('Ramená', 'Shoulders'), Rukavice: tr('Rukavice', 'Gloves'), Plášť: tr('Plášť', 'Cloak'), Nohavice: tr('Nohavice', 'Pants'), Topánky: tr('Topánky', 'Boots'), Mount:tr('Mount','Mount'), Zbraň: tr('Zbraň', 'Weapon'), 'Zbraň 1':tr('Hlavná ruka','Main hand'), 'Zbraň 2':tr('Vedľajšia ruka','Off hand'), 'Prsteň 1': tr('Prsteň 1', 'Ring 1'), 'Prsteň 2': tr('Prsteň 2', 'Ring 2'), 'Prsteň 3': tr('Prsteň 3', 'Ring 3'), 'Prsteň 4': tr('Prsteň 4', 'Ring 4'), Náhrdelník: tr('Náhrdelník', 'Necklace'), Charm: tr('Amulet', 'Charm'), 'Spotrebné predmety': tr('Spotrebné predmety', 'Consumables')} as Record<string, string>)[slot] || slot;
  const slotEntry = (slot: string): EquippedItem | undefined => (hero.equipment || []).find((entry: EquippedItem) => entry.slot === slot || slot === 'Zbraň 2' && entry.slot === 'Zbraň 1' && itemData[entry.itemId]?.hands===2);
  const slotItem = (slot: string) => slot==='Spotrebné predmety'?hero.preparedConsumables?.[0]:slotEntry(slot)?.itemId;
  const Slot = ({ slot }: { slot: string }) => {
    const id = slotItem(slot);
    const accent = id ? rarities[itemData[id]?.rarity as keyof typeof rarities]?.color : undefined;
    return <GameButton type="button" aria-haspopup="dialog" aria-expanded={selectedSlot === slot} aria-label={slotLabel(slot)+': '+(id?itemName(id):tr('Prázdny slot','Empty slot'))} onClick={() => setSelectedSlot(selectedSlot === slot ? null : slot)} className={`visual-slot ${id ? 'filled' : ''}`} style={{'--slot-accent':accent||'#a58a70'} as import('react').CSSProperties}>
      <span className="slot-artwork">{id?<ItemArt id={id}/>:<SlotGlyph slot={slot}/>}</span>
      <span className="slot-caption"><small>{slotLabel(slot)}</small><b>{id?itemName(id):tr('Vybrať výbavu','Choose equipment')}</b></span>
      <span className="slot-state" aria-hidden="true">{id?'◆':'›'}</span>
    </GameButton>;
  };

  const statLabel = (stat: string) => ({Strength: tr('Sila', 'Strength'), Intelligence: tr('Inteligencia', 'Intelligence'), Discipline: tr('Disciplína', 'Discipline'), Vitality: tr('Vitalita', 'Vitality')} as Record<string, string>)[stat] || stat;
  const requirements = (id: string) => Object.entries(itemData[id]?.req || {}) as [string, number][];
  const canEquip = (id: string) => Boolean(itemData[id]) && !itemData[id].access && itemData[id].slot !== 'Spotrebné predmety' && meetsRequirements(hero,id) && !((selectedSlot==='Zbraň 2'||itemData[id]?.offhand)&&hero.equipment?.some((entry:EquippedItem)=>entry.slot==='Zbraň 1'&&itemData[entry.itemId]?.hands===2));
  const itemDetails = (id: string) => {
    const data = itemData[id];
    return <div className="equipment-details"><p style={{color:rarities[data?.rarity as keyof typeof rarities]?.color}}>{rarities[data?.rarity as keyof typeof rarities]?.names[lang==='sk'?0:1]}</p><p>{tr('Váha','Weight')}: {itemWeight(id)} kg</p>{data?.level && <p className={hero.level>=data.level?'requirement-met':'requirement-missing'}>{tr('Úroveň','Level')}: {hero.level} / {data.level}</p>}{data?.mountId && <p className="requirement-met">−{(mounts.find(mount=>mount.id===data.mountId)?.discount||0)*100} % {tr('energie pri vstupe do výprav','adventure entry energy')}</p>}{data?.mountId&&<MountPerks id={data.mountId} lang={lang}/ >}{data?.heal && <p>+{data.heal} HP</p>}<ItemRestrictions id={id} lang={lang}/><b>{tr('Bonusy', 'Bonuses')}</b><p>{Object.entries(data?.bonus || {}).map(([stat, value]) => '+' + value + ' ' + statLabel(stat)).concat(data?.attack ? ['+' + data.attack + ' ' + tr('útok', 'attack')] : []).join(' · ') || tr('Bez bonusov', 'No bonuses')}</p><ItemPowers id={id} lang={lang}/><SetDetails setId={data?.setId} lang={lang} equipped={hero.equipped}/><b>{tr('Požiadavky na nasadenie', 'Equip requirements')}</b>{requirements(id).length ? requirements(id).map(([stat, need]) => <p className={hero.stats[stat] >= need ? 'requirement-met' : 'requirement-missing'} key={stat}>{statLabel(stat)}: {hero.stats[stat] || 0} / {need} {hero.stats[stat] >= need ? '✓' : tr('(nesplnené)', '(not met)')}</p>) : <p>{tr('Bez požiadaviek', 'No requirements')}</p>}</div>;
  };
  const compatibleItems = selectedSlot ? hero.inventory.map((id:string,index:number)=>({id,index})).filter(({id}:{id:string}) => itemSlots(id,hero.className).includes(selectedSlot)) : [];
  const playerStats = <section className="inventory-panel player-stats"><h2>{tr('Štatistiky a postup', 'Stats and progress')}</h2><p>{hero.name} · {tr('Úroveň', 'Level')} {hero.level}</p><label>{hero.level>=MAX_LEVEL?tr('Maximálna úroveň 100','Maximum level 100'):`XP: ${hero.xp} / ${xpToNextLevel(hero.level)}`}<progress max={hero.level>=MAX_LEVEL?1:xpToNextLevel(hero.level)} value={hero.level>=MAX_LEVEL?1:hero.xp} /></label><label>HP: {hero.hp} / {derivedStats(hero).maxHp}<progress max={derivedStats(hero).maxHp} value={hero.hp} /></label><div className="stats">{Object.entries(hero.stats as Record<string, number>).map(([stat, base]) => {
    const bonus = derivedStats(hero).stats[stat as 'Strength'|'Intelligence'|'Discipline'|'Vitality']-base;
    const targets = [...new Set<string>(hero.inventory)].flatMap(id => requirements(id).filter(([key, need]) => key === stat && need > base).map(([, need]) => need));
    const target = targets.length ? Math.min(...targets) : null;
    return <article className="stat card" key={stat}><small className="character-stat-title"><GameIcon name={stat}/>{statLabel(stat)}</small><b>{base + bonus}</b><small>{tr('Základ', 'Base')}: {base} · {tr('Výbava', 'Gear')}: +{bonus}</small>{target && <label>{tr('Najbližšia požiadavka', 'Next requirement')}: {base} / {target}<progress value={base} max={target}/></label>}</article>;
  })}</div><p>{tr('Atribúty zvyšuješ plnením reálnych úloh. Požiadavky výbavy sa kontrolujú podľa základných atribútov.', 'Complete real-life quests to raise attributes. Equipment requirements use base attributes.')}</p></section>;
  const slotPicker = <dialog ref={equipmentDialog} className="equipment-modal equipment-picker" aria-labelledby={dialogTitle} onCancel={() => setSelectedSlot(null)} onClose={() => setSelectedSlot(null)} onClick={event => {
    if(event.target!==equipmentDialog.current)return;
    const bounds=event.currentTarget.getBoundingClientRect();
    if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)setSelectedSlot(null);
  }}>{selectedSlot && <><header className="equipment-modal-header"><h2 id={dialogTitle}>{slotLabel(selectedSlot)}</h2><GameButton type="button" autoFocus onClick={() => setSelectedSlot(null)} aria-label={tr('Zavrieť náhľad výbavy','Close equipment preview')}>× {tr('Zavrieť','Close')}</GameButton></header>{selectedSlot==='Zbraň 2'&&hero.equipment?.some((entry:EquippedItem)=>entry.slot==='Zbraň 1'&&itemData[entry.itemId]?.hands===2)&&<p>{tr('Obe ruky zaberá obojručná zbraň. Najprv ju odlož, potom môžeš nasadiť predmet do vedľajšej ruky.','Both hands are occupied by a two-handed weapon. Unequip it before using an off-hand item.')}</p>}{selectedSlot==='Spotrebné predmety'?<SupplyBelt hero={hero} lang={lang} onPrepare={onPrepare} onUnprepare={onUnprepare}/>:<><h3>{tr('Aktuálne nasadené','Currently equipped')}</h3>{slotEntry(selectedSlot) ? <article className="equipped-preview"><div className="equipped-preview-heading"><ItemArt id={slotItem(selectedSlot)}/><strong>{itemName(slotItem(selectedSlot)!)}</strong></div>{itemDetails(slotItem(selectedSlot)!)}<GameButton disabled={hero.inventory.length>=50||Boolean(hero.battle&&!hero.battle.ended)} onClick={() => onUnequip(slotEntry(selectedSlot)!.instanceId)}>{tr('Odložiť do batohu', 'Return to backpack')}</GameButton>{hero.inventory.length>=50 && <p>{tr('Batoh je plný. Najprv uvoľni slot.','Your backpack is full. Free a slot first.')}</p>}</article> : <p>{tr('Tento slot je prázdny.','This slot is empty.')}</p>}<h3>{tr('Dostupné kusy z batohu','Available items in your backpack')} ({compatibleItems.length})</h3>{compatibleItems.length ? compatibleItems.map(({id,index}:{id:string;index:number}) => <article className="equipment-option" key={id+'-'+index}><div className="equipped-preview-heading"><ItemArt id={id}/><strong>{itemName(id)}</strong></div>{itemDetails(id)}<GameButton disabled={!canEquip(id)||Boolean(hero.battle&&!hero.battle.ended)} onClick={() => onEquip(index, selectedSlot)}>{canEquip(id)?tr('Nasadiť tento kus', 'Equip this copy'):tr('Nespĺňaš požiadavky','Requirements not met')}</GameButton></article>) : <p>{tr('V batohu nemáš predmet pre tento slot.', 'No items in your backpack fit this slot.')}</p>}</>}</>}</dialog>;

  return <div className="character-layout"><ClassInfo className={hero.className} lang={lang}/><div className="character-screen"><div className="slot-column left-slots">{leftSlots.map(slot => <Slot key={slot} slot={slot} />)}</div><div className="character-center"><ClassPortrait className={hero.className} lang={lang}/><div className="weapon-row"><Slot slot="Zbraň 1" /><Slot slot="Zbraň 2" /></div><div className="active-summary"><b>{tr('AKTÍVNA VÝBAVA', 'EQUIPPED GEAR')}</b><span>{hero.equipped.length} {tr('nasadených predmetov', 'equipped items')}</span></div><div className="mount-slot-wrapper"><Slot slot="Mount" /></div></div><div className="slot-column right-slots">{rightSlots.map(slot => <Slot key={slot} slot={slot} />)}</div></div>{slotPicker}{playerStats}{equippedSetBonuses(hero.equipped).active.length>0&&<section className="inventory-panel"><h2>{tr('Setové bonusy','Set bonuses')}</h2>{equippedSetBonuses(hero.equipped).active.map(({set})=><SetDetails key={set.id} setId={set.id} lang={lang} equipped={hero.equipped}/>)}</section>}<div className="inventory-panel"><div className="inventory-heading"><div><p className="eyebrow">{tr('ZBIERKA PREDMETOV', 'ITEM COLLECTION')}</p><h2>{tr('Inventár', 'Inventory')}</h2><p>{hero.inventory.length} / {INVENTORY_LIMIT} {tr('slotov', 'slots')} · {carriedWeight(hero)} / {derivedStats(hero).capacity} kg</p></div><small>{tr('Nasaď výbavu alebo použi predmet. Predaj je iba u Niry v meste.', 'Equip or use an item. Sell items only at Nira’s store in town.')}</small></div>{Boolean(hero.rewardChest?.length) && <section className="reward-chest"><h3>{tr('Schránka odmien', 'Reward chest')} ({hero.rewardChest.length})</h3><p>{tr('Tieto predmety sa nezmestili do inventára. Schránka sa nepočíta do nosnosti.', 'These items did not fit in your inventory. The chest does not count toward carried weight.')}</p><div className="inventory-grid">{hero.rewardChest.map((id: string, index: number)=><div key={id+'-'+index}><EnemyLoot drops={[id]} stats={hero.stats} lang={lang} context="inventory"/><GameButton disabled={!canReceive(hero,id)} onClick={()=>onClaim(index)}>{tr('Vyzdvihnúť','Claim')}</GameButton></div>)}</div></section>}<div className="inventory-tabs" role="group" aria-label={tr('Kategórie inventára','Inventory categories')}>{categories.map(([id,sk,en])=><GameButton key={id} aria-pressed={category===id} onClick={()=>setCategory(id)}>{lang==='sk'?sk:en} ({hero.inventory.filter((item:string)=>id==='all'||inventoryCategory(item)===id).length})</GameButton>)}</div>{!hero.inventory.some((id:string)=>category==='all'||inventoryCategory(id)===category)&&<p>{tr('V tejto kategórii nemáš žiadne predmety.','No items in this category.')}</p>}{hero.inventory.length ? <div className="inventory-grid">{hero.inventory.map((id: string, index: number) => (category==='all'||inventoryCategory(id)===category)&&<div className="inventory-card" key={`${id}-${index}`}><EnemyLoot drops={[id]} stats={hero.stats} lang={lang} context="inventory"/>{isConsumable(id)&&<GameButton disabled={(hero.preparedConsumables||[]).length>=supplyLimit(hero.className)||Boolean(hero.battle&&!hero.battle.ended)||hero.level<(itemData[id]?.level||1)} onClick={()=>onPrepare?.(index)}>{tr('Pripraviť na boj','Prepare for combat')}</GameButton>}<GameButton disabled={Boolean(hero.battle&&!hero.battle.ended)||hero.level<(itemData[id]?.level||1)||(!(['Healing herb','War drum'].includes(id)||Boolean(itemData[id]?.heal))&&!canEquip(id))} onClick={() => ['Healing herb','War drum'].includes(id)||itemData[id]?.heal?onUse(id):onEquip(index)}>{['Healing herb','War drum'].includes(id)||itemData[id]?.heal?tr('Použiť','Use'):tr('Nasadiť','Equip')}</GameButton><GameButton className="danger" aria-label={tr('Odhodiť predmet: ','Discard item: ')+itemName(id)} onClick={() => onDiscard(id, index)}>{tr('Odhodiť','Discard')}</GameButton></div>)}</div> : <div className="empty-inventory">{tr('Inventár je prázdny. Predmety získavaš z výprav a nepriateľov.', 'Your inventory is empty. You earn items from quests and enemies.')}</div>}</div></div>;
}
