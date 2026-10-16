export type Stat = 'Strength' | 'Intelligence' | 'Discipline' | 'Vitality';
export type Slot = 'Helma' | 'Zbraň' | 'Brnenie' | 'Topánky' | 'Rukavice' | 'Prsteň' | 'Náhrdelník' | 'Plášť' | 'Nohavice' | 'Shoulders';
export type EffectKind = 'buff' | 'debuff';

export type Item = {
  id: string;
  name: string;
  slot: Slot;
  icon: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  requirements?: Partial<Record<Stat, number>>;
  bonuses?: Partial<Record<Stat, number>>;
  attack?: number;
  description: string;
};

export type GameSave = {
  version: 1;
  hero: { name: string; className: string; level: number; xp: number; gold: number; hp: number; stats: Record<Stat, number>; inventory: string[]; equipped: string[]; completedQuests: string[]; effects: { id: string; kind: EffectKind; turns: number; power: number }[] };
  activeScreen: 'town' | 'quests' | 'combat' | 'inventory';
};
