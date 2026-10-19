import { classes, classId } from './classes';
export const classPortraits=Object.fromEntries(Object.entries(classes).map(([id,profile])=>[id,{file:profile.portrait,names:profile.names}]));
export function classPortrait(name:string) {return classPortraits[classId(name)];}
