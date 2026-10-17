export const mounts = [
  { id: 'mule', names: ['Húževnatá mulica', 'Sturdy Mule'], icon: '🫏', price: 10000, level: 1, discount: .1 },
  { id: 'horse', names: ['Emberfallský tátoš', 'Emberfall Steed'], icon: '🐎', price: 37500, level: 10, discount: .2 },
  { id: 'stag', names: ['Mesačný jeleň', 'Moonlit Stag'], icon: '🦌', price: 100000, level: 30, discount: .3 },
];
export function mountEnergyCost(base: number, id?: string | null) { const mount = mounts.find(entry => entry.id === id); return Math.max(1, Math.ceil(base * (1 - (mount?.discount || 0)))); }
