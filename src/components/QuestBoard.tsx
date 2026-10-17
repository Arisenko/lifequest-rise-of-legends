import { PageIntro } from './PageIntro';
import { GameIcon } from './GameArt';
import { ENERGY_RULES } from '../data/playerSystems';
import { EnemyLoot } from './EnemyLoot';
import { useEffect, useState } from 'react';
import { questResetAt, questCount, scheduledQuests } from '../data/questSchedule';
import type { QuestPeriod, QuestProgress } from '../data/questSchedule';

export function QuestBoard({ progress, lang, onAdvance, stats, energy, blocked }: { progress?: QuestProgress; lang: 'sk' | 'en'; onAdvance: (id: string) => void; stats: Record<string, number>; energy: number; blocked: boolean }) {
  const [now, setNow] = useState(() => new Date());
  const tr = (sk: string, en: string) => lang === 'sk' ? sk : en;
  useEffect(() => {
    const update = () => setNow(new Date());
    const timer = window.setInterval(update, 1000);
    window.addEventListener('focus', update);
    document.addEventListener('visibilitychange', update);
    return () => { window.clearInterval(timer); window.removeEventListener('focus', update); document.removeEventListener('visibilitychange', update); };
  }, []);
  const statNames: Record<string, string> = { Strength: tr('Sila', 'Strength'), Intelligence: tr('Inteligencia', 'Intelligence'), Discipline: tr('Disciplína', 'Discipline'), Vitality: tr('Vitalita', 'Vitality') };
  const periods: [QuestPeriod, string][] = [['daily', tr('Denný tréning', 'Daily training')], ['weekly', tr('Týždenné výzvy', 'Weekly challenges')], ['monthly', tr('Mesačné výzvy', 'Monthly challenges')]];
  return <div className="quest-board"><PageIntro scene="academy" icon="training" eyebrow={tr('AKADÉMIA EMBERFALL','EMBERFALL ACADEMY')} title={tr('Každý deň silnejší','Stronger every day')} description={tr('Tvoje skutočné úsilie buduje tvoju legendu.','Your real effort builds your legend.')}/><p>{tr('Postup potvrdzuj po vykonaní reálnej aktivity. Odmenu dostaneš po splnení celej aktivity, raz za obdobie.', 'Confirm progress after completing the real activity. Rewards are granted on finishing the entire activity, once per period.')}</p><p>{tr('Každý tréning sa obnoví samostatne po dokončení: denný za 24 hodín, týždenný za 7 dní, mesačný o kalendárny mesiac (pri kratšom mesiaci v jeho posledný deň). Rozpracovaný postup zostáva uložený.', 'Each training resets independently after completion: daily after 24 hours, weekly after 7 days, monthly after one calendar month (on its last day if shorter). Unfinished progress is preserved.')}</p>{periods.map(([period, title]) => <section className="quest-period" key={period}><h2>{title}</h2><div className="quests">{scheduledQuests.filter(quest => quest.period === period).map(quest => {
    const count = questCount(progress, quest, now);
    const done = count >= quest.target;
    const resetAt = questResetAt(progress, quest);
    const seconds = resetAt ? Math.max(0, Math.ceil((resetAt.getTime() - now.getTime()) / 1000)) : 0;
    const countdown = `${Math.floor(seconds / 86400)}${tr('d', 'd')} ${String(Math.floor(seconds / 3600) % 24).padStart(2, '0')}:${String(Math.floor(seconds / 60) % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
    return <article className={`quest card ${done ? 'done' : ''}`} key={quest.id}><GameIcon name={quest.stat} className="training-stat-icon"/><div className="quest-copy"><b>{quest.title[lang === 'sk' ? 0 : 1]}</b><small>{tr('Jeden krok', 'One step')}: {quest.step[lang === 'sk' ? 0 : 1]}</small><small>{quest.xp} XP · {quest.gold} {tr('zlata', 'gold')} · +{quest.points} {statNames[quest.stat]}</small>{quest.item && <div className="training-reward-preview"><small>{tr('Zaručená odmena za splnenie','Guaranteed completion reward')}</small><EnemyLoot drops={[quest.item]} stats={stats} lang={lang} context="training"/></div>}<label>{tr('Postup', 'Progress')}: {count} / {quest.target}<progress max={quest.target} value={count}/></label>{done && resetAt && <p className="training-cooldown">{tr('Opäť dostupné', 'Available again')}: {resetAt.toLocaleString(lang === 'sk' ? 'sk-SK' : 'en-GB')}<br/>{tr('Zostáva', 'Remaining')}: {countdown}</p>}<small>{tr('Energia za krok', 'Energy per step')}: {ENERGY_RULES.training[quest.period]}{blocked ? tr(' · Ukonči oddych alebo súboj.', ' · Stop resting or finish your battle.') : energy < ENERGY_RULES.training[quest.period] ? tr(' · Nedostatok energie.', ' · Not enough energy.') : ''}</small><button disabled={done || blocked || energy < ENERGY_RULES.training[quest.period]} onClick={() => { onAdvance(quest.id); setNow(new Date()); }}>{done ? tr('✓ Odmena získaná', '✓ Reward claimed') : tr('Potvrdiť vykonaný krok +1', 'Confirm completed step +1')}</button></div></article>;
  })}</div></section>)}</div>;
}
