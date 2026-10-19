const shapes: Record<string,string> = {
  Helma: 'M6 25v-9a10 10 0 0 1 20 0v9l-7 3v-9h-6v9ZM7 16h18M16 5v10',
  Brnenie: 'm10 5-6 6 5 5v11h14V16l5-5-6-6-6 4ZM12 17h8m-9 5h10',
  Shoulders: 'M3 20v-7l8-5 5 6 5-6 8 5v7l-9 3-4-9-4 9ZM5 16l6-3m10 0 6 3',
  Rukavice: 'M9 27 5 17l3-2 3 4V7l3-1v11-13h3v13V6h3v12-9h3v14l-4 4Z',
  Plášť: 'M11 5h10l7 23H4ZM11 5l5 6 5-6m-5 6v14',
  Nohavice: 'M8 5h16l2 23h-8l-2-14-2 14H6ZM8 10h16',
  Topánky: 'M10 4h12v15l6 4v5H7v-7l3-4ZM10 9h12M8 24h19',
  Prsteň: 'M10 8l6-5 6 5-6 7ZM11 12a9 9 0 1 0 10 0M16 3v12',
  Náhrdelník: 'M5 6c0 13 5 15 11 19C22 21 27 19 27 6M12 23l4-4 4 4-4 6Z',
  Charm: 'm16 3 4 9 9 4-9 4-4 9-4-9-9-4 9-4ZM13 16h6m-3-3v6',
  'Spotrebné predmety': 'M12 3h8v5l5 8v11H7V16l5-8ZM11 3h10M8 18h16m-12 4h8',
  Zbraň: 'm23 3 6 1-1 6-14 14-6-6ZM7 16l10 10M5 22l5 5m-7 2 5-5',
  Mount: 'M8 26C-2 6 9 2 16 2S34 6 24 26h-6l4-12c2-8-14-8-12 0l4 12ZM7 12h4m10 0h4M8 20h4m8 0h4',
};
export function SlotGlyph({slot}:{slot:string}) {
  const category=slot.startsWith('Prsteň')?'Prsteň':slot.startsWith('Zbraň')?'Zbraň':slot;
  return <svg className="slot-glyph" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true"><path d={shapes[category]||shapes.Charm}/></svg>;
}
