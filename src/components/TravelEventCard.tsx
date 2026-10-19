import { CombatIcon } from './CombatIcon';
import { useEffect, useId, useRef, useState } from 'react';
import { GameButton } from './GameButton';
import { GameIcon } from './GameArt';
import { GoldValue } from './GoldValue';
import { localizedStatName } from '../data/localization';
import { resolveTravelEvent, travelEventDetails, travelEventTerms } from '../data/travelEvents';
import type { Hero } from '../types/hero';

export function TravelEventCard({ hero, setHero, lang }: { hero: Hero; setHero: (update: (hero: Hero) => Hero) => void; lang: 'sk' | 'en' }) {
  const event = hero.pendingTravelEvent;
  const index = lang === 'sk' ? 0 : 1;
  const tr = (sk: string, en: string) => lang === 'sk' ? sk : en;
  const last = hero.travelHistory?.[hero.travelHistory.length - 1];
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [resultId, setResultId] = useState<string | null>(null);
  const result = !event && last?.event.id === resultId ? last : null;
  const show = Boolean((event || result) && !(hero.battle && !hero.battle.ended) && hero.hp > 0);
  useEffect(() => {
    if (show && !dialog.current?.open) dialog.current?.showModal();
    if (!show && dialog.current?.open) dialog.current?.close();
  }, [show, event?.id, result?.event.id]);
  useEffect(() => () => dialog.current?.close(), []);
  if (!event) return <>{last && <details className="travel-event-receipt"><summary>{tr('Posledná udalosť','Last event')}: {travelEventDetails[last.event.kind].names[index]}</summary><p>{last.choice === 'safe' ? tr('Pokračoval si bezpečnou cestou. Bez strát a odmien.','You took the safe route. No losses or rewards.') : last.success ? tr('Uspel si.','You succeeded.') : tr('Pokus nevyšiel.','The attempt failed.')} · HP {last.hp >= 0 ? '+' : ''}{last.hp} · {tr('Energia','Energy')} +{last.energy} · +{last.gold} {tr('zlata','gold')} · +{last.xp} XP{last.item ? tr(' · Liečivá bylina je v truhlici odmien.',' · A healing herb is in your reward chest.') : ''}</p></details>}<dialog className="travel-event-dialog" ref={dialog} aria-labelledby={titleId} onCancel={() => setResultId(null)} onClose={() => setResultId(null)}>{result && <section className="travel-event-card travel-event-result"><div className="travel-event-title"><CombatIcon name={result.success ? 'recover' : 'weakness'}/><div><p className="eyebrow">{tr('VÝSLEDOK UDALOSTI','EVENT OUTCOME')}</p><h3 id={titleId}>{result.success ? tr('Výzvu si zvládol','Challenge completed') : tr('Nástraha si vybrala svoju daň','The hazard took its toll')}</h3></div></div><p>{travelEventDetails[result.event.kind].names[index]}</p><div className="travel-event-outcomes">{result.hp !== 0 && <div><CombatIcon name="recover"/><strong>{result.hp > 0 ? '+' : ''}{result.hp} HP</strong></div>}{result.energy !== 0 && <div><CombatIcon name="focus"/><strong>+{result.energy} {tr('energie','energy')}</strong></div>}{result.gold > 0 && <div><GoldValue amount={result.gold} lang={lang}/></div>}{result.xp > 0 && <div><GameIcon name="training"/><strong>+{result.xp} XP</strong></div>}</div>{result.item && <p>{tr('Liečivá bylina je uložená v truhlici odmien.','A healing herb is saved in your reward chest.')}</p>}{!result.hp && !result.energy && !result.gold && !result.xp && !result.item && <p>{tr('Bez zmeny zdrojov. Môžeš pokračovať.','No resource changes. You can continue.')}</p>}<div className="travel-event-actions"><GameButton variant="combat" autoFocus onClick={() => setResultId(null)}>{tr('Pokračovať v ceste','Continue the journey')}</GameButton></div></section>}</dialog></>;
  const data = travelEventDetails[event.kind];
  const terms = travelEventTerms(hero, event);
  const disabled = Boolean(hero.battle && !hero.battle.ended) || hero.hp <= 0;
  return <dialog className="travel-event-dialog" ref={dialog} aria-labelledby={titleId} onCancel={event => event.preventDefault()} onClose={() => { const node = dialog.current; if (node?.isConnected && !node.open && show) node.showModal(); }}><section className="travel-event-card" aria-label={tr('Udalosť na ceste','Travel event')}>
    <div className="travel-event-title"><CombatIcon name={data.icon}/><div><p className="eyebrow">{tr('MEDZI SÚBOJMI · UDALOSŤ','BETWEEN BATTLES · EVENT')}</p><h3 id={titleId}>{data.names[index]}</h3></div></div>
    <p>{data.description[index]}</p>
    <p>{terms.peaceful ? tr('Obnoví až 15 % maximálneho HP a 8 energie. Bez rizika.','Restores up to 15% of maximum HP and 8 energy. No risk.') : `${tr('Šanca na úspech','Success chance')}: ${Math.round(terms.chance * 100)} % · ${localizedStatName(data.stat, lang)}. ${tr('Neúspech','Failure')}: −${terms.damage} HP (${tr('najmenej 1 HP zostane','at least 1 HP remains')}).`}</p>
    {!terms.peaceful && <p>{tr('Pri úspechu','On success')}: {event.kind === 'runes' ? `+${terms.xp} XP` : `+${terms.gold} ${tr('zlata','gold')}`}{event.kind === 'cache' ? tr(' a liečivá bylina do truhlice odmien.',' and a healing herb in the reward chest.') : '.'}</p>}
    <div className="travel-event-actions"><GameButton variant="combat" autoFocus disabled={disabled} onClick={() => { setResultId(event.id); setHero(current => resolveTravelEvent(current, event.id, 'explore')); }}>{data.action[index]}</GameButton></div>
    <small>{tr('Túto výzvu nemožno obísť. Pred ďalším súbojom ju musíš vyriešiť. Udalosť aj výsledný hod zostávajú uložené.','This challenge cannot be bypassed. Resolve it before the next battle. The event and its outcome roll are saved.')}</small>
  </section></dialog>;
}
