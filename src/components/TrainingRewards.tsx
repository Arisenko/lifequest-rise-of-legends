import { GameIcon } from './GameArt';
import { GoldValue } from './GoldValue';
import { EnemyLoot } from './EnemyLoot';
import { localizedStatName } from '../data/localization';
import type { Quest } from '../data/questSchedule';

export function TrainingRewards({ quest, rewards, stats, lang }: { quest: Quest; rewards: { xp: number; gold: number; points: number }; stats: Record<string, number>; lang: 'sk' | 'en' }) {
  const tr = (sk: string, en: string) => lang === 'sk' ? sk : en;
  return <section className="training-rewards" aria-label={tr('Odmeny za dokončenie', 'Completion rewards')}>
    <h3>{tr('Odmeny za dokončenie', 'Completion rewards')}</h3>
    <div className="training-reward-values">
      <div><GameIcon name="training"/><strong>+{rewards.xp.toLocaleString(lang)} XP</strong></div>
      <div><GoldValue amount={rewards.gold} lang={lang}/><small>{tr('Zlato', 'Gold')}</small></div>
      <div><GameIcon name={quest.stat}/><strong>+{rewards.points}</strong><small>{localizedStatName(quest.stat, lang)}</small></div>
    </div>
    {quest.item && <div className="training-item-reward"><p>{tr('Zaručený predmet', 'Guaranteed item')}<small>{tr('Klikni pre bonusy a požiadavky', 'Click for bonuses and requirements')}</small></p><EnemyLoot drops={[quest.item]} stats={stats} lang={lang} context="training"/></div>}
  </section>;
}
