import { useId } from 'react';
import { reinforcementExtraEnemies, reinforcementEnemies, expansionScenes, expansionEnemies, buildingFrames, enemyFrames, iconFrames, sceneFrames } from '../data/art';

function Atlas({ frame, columns, file, className, label }: { frame: number; columns: number; file: string; className: string; label?: string }) {
  const x=frame%columns, y=Math.floor(frame/columns);
  const clipId = useId();
  return <span className={'game-art '+className} role={label?'img':undefined} aria-label={label} aria-hidden={label?undefined:true}><svg className="game-art-image" viewBox={`${x} ${y} 1 1`} preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false"><defs><clipPath id={clipId}><rect x={x} y={y} width="1" height="1"/></clipPath></defs><image href={`/assets/art-v1/${file}`} x="0" y="0" width={columns} height={columns} clipPath={`url(#${clipId})`}/></svg></span>;
}
export function GameIcon({ name, className='' }: {name:string;className?:string}) { return <Atlas frame={iconFrames[name]??24} columns={5} file="icons-atlas.png" className={'game-icon '+className}/>; }
export function SceneArt({ scene, className='', label }: {scene:string;className?:string;label?:string}) { return <Atlas frame={expansionScenes[scene] ?? buildingFrames[scene] ?? sceneFrames[scene] ?? 0} columns={3} file={scene in expansionScenes ? 'expansion-atlas.jpg' : scene in buildingFrames ? 'buildings-atlas.jpg' : 'world-atlas.jpg'} className={'scene-art '+className} label={label}/>; }
export function EnemyArt({ name, label, className='' }: {name:string;label:string;className?:string}) { return <Atlas frame={reinforcementExtraEnemies[name] ?? reinforcementEnemies[name] ?? expansionEnemies[name] ?? enemyFrames[name] ?? 0} columns={name in reinforcementExtraEnemies ? 2 : name in reinforcementEnemies ? 4 : name in expansionEnemies ? 3 : 6} file={name in reinforcementExtraEnemies ? 'reinforcements-extra-atlas.jpg' : name in reinforcementEnemies ? 'reinforcements-atlas.jpg' : name in expansionEnemies ? 'expansion-atlas.jpg' : 'enemies-atlas.jpg'} className={'enemy-art '+className} label={label}/>; }
