export type ClassId='Bojovník'|'Paladin'|'Mág'|'Alchymista'|'Lovec'|'Assassín';
export type ArmorType='cloth'|'leather'|'plate';
export type WeaponType='sword'|'staff'|'wand'|'book'|'bow'|'dagger'|'shield'|'focus';
type Stats=Record<'Strength'|'Intelligence'|'Discipline'|'Vitality',number>;
export const classFamilies={
  arcane:{armor:'cloth' as ArmorType,weapons:['staff','wand','book','focus'] as WeaponType[],offhand:['focus'] as WeaponType[],stats:{Strength:2,Intelligence:6,Discipline:4,Vitality:3}},
  martial:{armor:'plate' as ArmorType,weapons:['sword','shield'] as WeaponType[],offhand:['sword','shield'] as WeaponType[],stats:{Strength:6,Intelligence:2,Discipline:3,Vitality:5}},
  scout:{armor:'leather' as ArmorType,weapons:['bow','dagger'] as WeaponType[],offhand:['dagger'] as WeaponType[],stats:{Strength:4,Intelligence:2,Discipline:6,Vitality:3}},
};
export const classes:Record<ClassId,{names:[string,string];family:keyof typeof classFamilies;role:[string,string];skill:[string,string];description:[string,string];portrait:string}> = {
  Bojovník:{names:['Bojovník','Warrior'],family:'martial',role:['Fyzický útočník','Physical damage dealer'],skill:['Drvivý úder','Crushing Strike'],description:['Útoky budujú zúrivosť (max. 3). Drvivý úder ju spotrebuje na silnejší zásah. Dva plátové kusy: +10 % fyzický útok.','Attacks build rage (max 3). Crushing Strike spends it for a stronger hit. Two plate pieces: +10% physical attack.'],portrait:'guardian'},
  Paladin:{names:['Paladin','Paladin'],family:'martial',role:['Ochranca / liečiteľ','Protector / healer'],skill:['Svetlo obnovy','Restoring Light'],description:['Svetlo lieči, očistí škodlivé efekty a chráni v tom istom ťahu. Dva plátové kusy posilnia liečenie o 25 % a pridajú 2 brnenia. Liečenie spojencov čaká na skupinový boj.','Light heals, cleanses harmful effects and guards in the same turn. Two plate pieces improve healing by 25% and add 2 armor. Ally healing awaits group combat.'],portrait:'paladin'},
  Mág:{names:['Mág','Mage'],family:'arcane',role:['Magický útočník','Magic damage dealer'],skill:['Runový výboj','Runic Burst'],description:['Magické útoky nabíjajú runy (max. 3). Výboj ich spotrebuje a zapáli cieľ. Dva látkové kusy: +10 % magický útok.','Magic attacks charge runes (max 3). Burst spends them and burns the target. Two cloth pieces: +10% magic attack.'],portrait:'rune-student'},
  Alchymista:{names:['Alchymista','Alchemist'],family:'arcane',role:['Posilnenia / podpora','Buffs / support'],skill:['Bojový elixír','Battle Elixir'],description:['Bojový elixír lieči a posilní ďalšie tri ťahy. Liečivé predmety sú o 25 % účinnejšie; s dvoma látkovými kusmi o 50 %. Zdieľa výbavu a požiadavky s mágom.','Battle Elixir heals and empowers the next three turns. Healing items are 25% stronger; 50% with two cloth pieces. Shares gear and requirements with Mage.'],portrait:'alchemist'},
  Lovec:{names:['Lovec','Ranger'],family:'scout',role:['Presný lovec','Precision hunter'],skill:['Označenie koristi','Mark Prey'],description:['Označený cieľ dostáva o 25 % viac poškodenia počas troch ďalších ťahov. Dva kožené kusy: +10 % fyzický útok. Používa silu aj disciplínu.','Marked prey takes 25% more damage for the next three turns. Two leather pieces: +10% physical attack. Uses both strength and discipline.'],portrait:'ranger'},
  Assassín:{names:['Assassín','Assassin'],family:'scout',role:['Jed / nárazové poškodenie','Poison / burst damage'],skill:['Otrávená čepeľ','Venom Blade'],description:['Každý tretí fyzický útok je kritický (150 %). Otrávená čepeľ spôsobí jed na tri ťahy. Dva kožené kusy posilnia tento jed o 50 %.','Every third physical attack is critical (150%). Venom Blade poisons for three turns. Two leather pieces strengthen that poison by 50%.'],portrait:'assassin'},
};
export function resolveClass(name?:string) {
  const aliases:Record<string,ClassId>={Novice:'Bojovník',Strážca:'Bojovník','Študent runiek':'Mág'};
  return classes[(name&&name in classes?name:aliases[name||'']||'Bojovník') as ClassId];
}
export function classId(name?:string):ClassId {
  const definition=resolveClass(name);
  return (Object.keys(classes) as ClassId[]).find(id=>classes[id]===definition)!;
}
export function startingStats(name:string):Stats {return {...classFamilies[resolveClass(name).family].stats};}
export function classAllowsItem(name:string|undefined,item:{armorType?:ArmorType;weaponType?:WeaponType}) {
  if(!name)return true;
  const family=classFamilies[resolveClass(name).family];
  return (!item.armorType||item.armorType===family.armor)&&(!item.weaponType||family.weapons.includes(item.weaponType));
}
export function chooseLegacyClass<Hero extends {className:string;classChoicePending?:boolean;stats:Stats;battle?:{ended?:string}|null}>(hero:Hero,id:ClassId):Hero {
  if(!hero.classChoicePending||!classes[id]||hero.battle&&!hero.battle.ended)return hero;
  const old=startingStats(hero.className),next=startingStats(id);
  return {...hero,className:id,classChoicePending:false,stats:Object.fromEntries(Object.entries(hero.stats).map(([stat,value])=>[stat,value-old[stat as keyof Stats]+next[stat as keyof Stats]])) as Stats};
}
