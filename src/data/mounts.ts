type Mount = { id:string; names:string[]; icon:string; price:number; level:number; discount:number; source?:'dungeon'|'raid'; boss?:string; bonus?:Partial<Record<'Strength'|'Intelligence'|'Discipline'|'Vitality',number>>; perks?:{capacity?:number;stamina?:number;energy?:number;armor?:number;regeneration?:number;burnImmune?:boolean} };
export const mounts:Mount[] = [
  { id: 'mule', names: ['Húževnatá mulica', 'Sturdy Mule'], icon: '🫏', price: 10000, level: 1, discount: .1 },
  { id: 'horse', names: ['Emberfallský tátoš', 'Emberfall Steed'], icon: '🐎', price: 37500, level: 10, discount: .2 },
  { id: 'stag', names: ['Mesačný jeleň', 'Moonlit Stag'], icon: '🦌', price: 100000, level: 30, discount: .3 },
  { id: 'boar', names: ['Železnokel', 'Iron-Tusk Boar'], icon: '🐗', price: 20000, level: 5, discount: .5, source:'dungeon', boss:'Ravenmoor lord', bonus:{Strength:8,Vitality:4}, perks:{capacity:25} },
  { id: 'wolf', names: ['Tieňový vlk', 'Shadow Wolf'], icon: '🐺', price: 60000, level: 20, discount: .5, source:'dungeon', boss:'Ancient shade', bonus:{Strength:4,Discipline:8}, perks:{stamina:20} },
  { id: 'ram', names: ['Baran Mlžných hôr', 'Mistpeak Ram'], icon: '🐏', price: 150000, level: 40, discount: .5, source:'dungeon', boss:'Drowned king', bonus:{Vitality:8,Discipline:4}, perks:{energy:30} },
  { id: 'bear', names: ['Medveď Železná labka', 'Ironpaw Bear'], icon: '🐻', price: 300000, level: 55, discount: .5, source:'dungeon', boss:'Emberlord', bonus:{Vitality:10,Strength:4}, perks:{armor:4} },
  { id: 'gryphon', names: ['Gryf Zlatokrídlo', 'Goldwing Gryphon'], icon: '🦅', price: 600000, level: 70, discount: .5, source:'dungeon', boss:'Astral Oracle', bonus:{Intelligence:8,Discipline:4}, perks:{regeneration:1.5} },
  { id: 'drake', names: ['Popolavý drak', 'Ashen Drake'], icon: '🐉', price: 1000000, level: 90, discount: .7, source:'raid', boss:'Ashen Tyrant', bonus:{Strength:10,Intelligence:10,Discipline:8,Vitality:12}, perks:{capacity:40,stamina:30,energy:40,regeneration:2,burnImmune:true} },
];
export function mountEnergyCost(base: number, id?: string | null) { const mount = mounts.find(entry => entry.id === id); return Math.max(1, Math.ceil(base * (100-Math.round((mount?.discount||0)*100))/100)); }
