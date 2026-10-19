import { classFamilies, resolveClass } from '../data/classes';

export function ClassInfo({className,lang}:{className:string;lang:'sk'|'en'}) {
  const profile=resolveClass(className),family=classFamilies[profile.family],index=lang==='sk'?0:1;
  const armor=lang==='sk'?{cloth:'Látková',leather:'Kožená',plate:'Plátová'}:{cloth:'Cloth',leather:'Leather',plate:'Plate'};
  return <section className="class-info"><h3>{profile.names[index]} · {profile.role[index]}</h3>
    <p>{profile.description[index]}</p>
    <small>{lang==='sk'?'Výbava':'Equipment'}: {armor[family.armor]} · {lang==='sk'?'Spoločné hlavné atribúty':'Shared main attributes'}: {profile.family==='arcane'?(lang==='sk'?'inteligencia / disciplína':'intelligence / discipline'):profile.family==='martial'?(lang==='sk'?'sila / vitalita':'strength / vitality'):(lang==='sk'?'disciplína / sila':'discipline / strength')}</small>
  </section>;
}
