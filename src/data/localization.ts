import { itemData } from './loot';

export type Language='sk'|'en';
export const statNames={
  Strength:['Sila','Strength'],
  Intelligence:['Inteligencia','Intelligence'],
  Discipline:['Disciplína','Discipline'],
  Vitality:['Vitalita','Vitality'],
} as const;
const legacyItemNames:Record<string,[string,string]>={
  'Iron helm':['Železná prilba','Iron Helm'],
  'Rusty charm':['Hrdzavý talizman','Rusty Charm'],
  'Guard boots':['Strážne topánky','Guard Boots'],
  'War drum':['Vojnový bubon','War Drum'],
  'Ember cloak':['Plášť Emberfall','Emberfall Cloak'],
  'Runic staff':['Runová palica','Runic Staff'],
};
export function localizedItemName(id:string,lang:Language) {
  return (itemData[id]?.names||legacyItemNames[id])?.[lang==='sk'?0:1]||id;
}
export function localizedStatName(stat:string,lang:Language) {
  return statNames[stat as keyof typeof statNames]?.[lang==='sk'?0:1]||stat;
}
