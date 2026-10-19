import { GameIcon, EffectArt } from './GameArt';
import { ItemArtwork } from './ItemArtwork';
import { enemySemanticFrames } from '../data/enemyAttackArt';

export const combatSkillFrames:Record<string,number>={attack:0,warrior:1,mage:2,paladin:3,alchemist:4,ranger:5,assassin:6,relic:7,flee:8,mark:5,echo:7};
const effectFrames:Record<string,number>={drum:0,weakness:1,focus:2,poison:3,burn:4,rage:7,recover:8};
const enemyFrames:Record<string,number>={'enemy-fangs':0,'enemy-blade':1,'enemy-arrow':2,'enemy-poison':3,'enemy-frost':4,'enemy-burn':5,'enemy-drain':6,'enemy-shield':7,'enemy-crush':8};
export function CombatIcon({name}:{name:string}) {
  const frame=enemySemanticFrames[name]??enemyFrames[name]??combatSkillFrames[name];
  const atlas=name in enemySemanticFrames?'enemy-semantic-abilities-v2.webp':name in enemyFrames?'enemy-abilities-v1.webp':'combat-skills-v1.webp';
  return <span className={'combat-icon combat-icon-'+name} aria-hidden="true">{frame!==undefined?<svg viewBox={`${frame%3} ${Math.floor(frame/3)} 1 1`} preserveAspectRatio="xMidYMid meet" focusable="false"><image href={'/assets/art-v1/'+atlas} x="0" y="0" width="3" height="3"/></svg>:name in effectFrames?<EffectArt frame={effectFrames[name]}/>:name==='potion'?<ItemArtwork id="Healing potion 1"/>:<GameIcon name={name==='guard'?'Discipline':'Intelligence'}/>}</span>;
}
