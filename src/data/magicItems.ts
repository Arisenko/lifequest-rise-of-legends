import type { LootItem } from './loot';

export const magicItems:Record<string,LootItem> = {
  'Apprentice hood': { names:['Učňovská kapucňa','Apprentice Hood'], slot:'Helma', art:'mage-hood', rarity:'Common', level:1, price:24, weight:.4, armorType:'cloth', req:{Intelligence:2}, bonus:{Intelligence:1} },
  'Woven robe': { names:['Tkaná róba','Woven Robe'], slot:'Brnenie', art:'mage-robe', rarity:'Common', level:1, price:32, weight:1, armorType:'cloth', req:{Intelligence:2}, bonus:{Intelligence:1,Vitality:1} },
  'Casting gloves': { names:['Zaklínačské rukavice','Casting Gloves'], slot:'Rukavice', art:'mage-gloves', rarity:'Common', level:1, price:18, weight:.2, armorType:'cloth', req:{Intelligence:2}, bonus:{Intelligence:1} },
  'Ritual trousers': { names:['Rituálne nohavice','Ritual Trousers'], slot:'Nohavice', art:'mage-pants', rarity:'Common', level:1, price:22, weight:.5, armorType:'cloth', req:{Discipline:2}, bonus:{Discipline:1} },
  'Soft spellboots': { names:['Mäkké runové topánky','Soft Spellboots'], slot:'Topánky', art:'mage-boots', rarity:'Common', level:1, price:20, weight:.4, armorType:'cloth', req:{Intelligence:2}, bonus:{Vitality:1} },
  'Acolyte mantle': { names:['Akolytské náplecníky','Acolyte Mantle'], slot:'Shoulders', art:'mage-mantle', rarity:'Rare', level:5, price:58, weight:.5, armorType:'cloth', req:{Intelligence:4,Discipline:3}, bonus:{Intelligence:2,Discipline:1} },
  'Twilight veil': { names:['Súmračný plášť','Twilight Veil'], slot:'Plášť', art:'mage-cloak', rarity:'Rare', level:5, price:65, weight:.6, armorType:'cloth', req:{Intelligence:4}, bonus:{Intelligence:2,Vitality:1} },
  'Alchemist focus': { names:['Alchymistický katalyzátor','Alchemist Focus'], slot:'Charm', art:'alchemist-focus', rarity:'Rare', level:5, price:72, weight:.3, req:{Intelligence:4,Discipline:3}, bonus:{Intelligence:2,Discipline:1} },
  'Catalyst rod': { names:['Katalytický prútik','Catalyst Rod'], slot:'Zbraň', art:'alchemist-rod', rarity:'Rare', level:5, price:84, weight:.7, attack:5, req:{Intelligence:4,Discipline:3}, bonus:{Intelligence:2} },
};
for(const item of Object.values(magicItems)) item.description = item.armorType==='cloth'
  ? ['Ľahká látková výbava pre magické a podporné zostavy. Nasadenie vyžaduje uvedenú úroveň a základné atribúty, nie konkrétne povolanie.', 'Light cloth equipment for magical and support builds. Equipping requires the listed level and base attributes, not a specific class.']
  : ['Alchymistická pomôcka pre magické a podporné zostavy. Bonus inteligencie posilňuje mágiu a fokus; bonus disciplíny zvyšuje odolnosť.', 'An alchemical implement for magical and support builds. Intelligence improves magic and focus; discipline increases resistance.'];
export const arcaneStock = ['Apprentice wand','Oak staff','Runic staff','Alchemy grimoire','Catalyst retort',...Object.keys(magicItems)];
