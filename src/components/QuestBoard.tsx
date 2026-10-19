import { TrainingRewards } from './TrainingRewards';
import { GameButton } from './GameButton';
import { PageIntro } from './PageIntro';
import { TrainingCarousel } from './TrainingCarousel';
import { TrainingIcon } from './TrainingIcon';
import { ENERGY_RULES } from '../data/playerSystems';
import { useEffect, useState } from 'react';
import { questResetAt, questCount, scheduledQuests, questRewards } from '../data/questSchedule';
import type { QuestPeriod, QuestProgress } from '../data/questSchedule';

export function QuestBoard({ progress, lang, onAdvance, stats, energy, blocked, level = 1 }: { progress?: QuestProgress; lang: 'sk' | 'en'; onAdvance: (id: string) => void; stats: Record<string, number>; energy: number; blocked: boolean; level?: number }) {
  const [now, setNow] = useState(() => new Date());
  const tr = (sk: string, en: string) => lang === 'sk' ? sk : en;
  useEffect(() => {
    const update = () => setNow(new Date());
    const timer = window.setInterval(update, 1000);
    window.addEventListener('focus', update);
    document.addEventListener('visibilitychange', update);
    return () => { window.clearInterval(timer); window.removeEventListener('focus', update); document.removeEventListener('visibilitychange', update); };
  }, []);
  const periods: [QuestPeriod, string][] = [['daily', tr('Denný tréning', 'Daily training')], ['weekly', tr('Týždenné výzvy', 'Weekly challenges')], ['monthly', tr('Mesačné výzvy', 'Monthly challenges')]];
  return <div className="quest-board"><PageIntro scene="academy" icon="training" eyebrow={tr('AKADÉMIA EMBERFALL','EMBERFALL ACADEMY')} title={tr('Každý deň silnejší','Stronger every day')} description={tr('Tvoje skutočné úsilie buduje tvoju legendu.','Your real effort builds your legend.')}/><p className="training-level-note">{tr('Odmeny pre úroveň', 'Rewards for level')} {level} · {tr('XP a zlato rastú s úrovňou. Každých 25 úrovní získavaš aj viac atribútových bodov.', 'XP and gold scale with your level. Every 25 levels also grants more attribute points.')}</p><p>{tr('Postup potvrdzuj po vykonaní reálnej aktivity. Odmenu dostaneš po splnení celej aktivity, raz za obdobie.', 'Confirm progress after completing the real activity. Rewards are granted on finishing the entire activity, once per period.')}</p><p>{tr('Každý tréning sa obnoví samostatne po dokončení: denný za 24 hodín, týždenný za 7 dní, mesačný o kalendárny mesiac (pri kratšom mesiaci v jeho posledný deň). Rozpracovaný postup zostáva uložený.', 'Each training resets independently after completion: daily after 24 hours, weekly after 7 days, monthly after one calendar month (on its last day if shorter). Unfinished progress is preserved.')}</p>{periods.map(([period, title]) => <TrainingCarousel title={title} lang={lang} key={period}>{scheduledQuests.filter(quest => quest.period === period).map(quest => {
    const count = questCount(progress, quest, now);
    const done = count >= quest.target;
    const rewards = questRewards(quest, level);
    const resetAt = questResetAt(progress, quest);
    const seconds = resetAt ? Math.max(0, Math.ceil((resetAt.getTime() - now.getTime()) / 1000)) : 0;
    const countdown = `${Math.floor(seconds / 86400)}${tr('d', 'd')} ${String(Math.floor(seconds / 3600) % 24).padStart(2, '0')}:${String(Math.floor(seconds / 60) % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
    return <article className={`quest card ${done ? 'done' : ''}`} key={quest.id}><TrainingIcon frame={quest.icon}/><div className="quest-copy"><b>{quest.title[lang === 'sk' ? 0 : 1]}</b><small>{tr('Jeden krok', 'One step')}: {quest.step[lang === 'sk' ? 0 : 1]}</small><TrainingRewards quest={quest} rewards={rewards} stats={stats} lang={lang}/><label>{tr('Postup', 'Progress')}: {count} / {quest.target}<progress max={quest.target} value={count}/></label>{done && resetAt && <p className="training-cooldown">{tr('Opäť dostupné', 'Available again')}: {resetAt.toLocaleString(lang === 'sk' ? 'sk-SK' : 'en-GB')}<br/>{tr('Zostáva', 'Remaining')}: {countdown}</p>}<small>{tr('Energia za krok', 'Energy per step')}: {ENERGY_RULES.training[quest.period]}{blocked ? tr(' · Ukonči oddych alebo súboj.', ' · Stop resting or finish your battle.') : energy < ENERGY_RULES.training[quest.period] ? tr(' · Nedostatok energie.', ' · Not enough energy.') : ''}</small><GameButton variant="combat" className="training-confirm" disabled={done || blocked || energy < ENERGY_RULES.training[quest.period]} onClick={() => { onAdvance(quest.id); setNow(new Date()); }}>{done ? tr('✓ Odmena získaná', '✓ Reward claimed') : tr('Potvrdiť tréning · +1 krok', 'Confirm training · +1 step')}</GameButton></div></article>;
  })}</TrainingCarousel>)}</div>;
}
