import { useId } from 'react';

const regions = [[20,20,440,400],[470,85,415,320],[20,410,440,435],[465,445,420,400]];
export function JourneyArtwork({frame,className=''}:{frame:number;className?:string}) {
  const id=useId();
  if(frame>=4&&frame<=6){const column=frame-4;return <svg className={'journey-art '+className} viewBox={`${column} 0 1 1`} aria-hidden="true" focusable="false"><defs><clipPath id={id}><rect x={column} y="0" width="1" height="1"/></clipPath></defs><image href="/assets/art-v1/journey-landmarks-extra-v1.png" width="3" height="1" clipPath={`url(#${id})`}/></svg>;}
  const [left,top,width,height]=regions[frame]||regions[0];
  const size=Math.max(width,height)*1.06;
  return <svg className={'journey-art '+className} viewBox={`${left+(width-size)/2} ${top+(height-size)/2} ${size} ${size}`} aria-hidden="true" focusable="false"><defs><clipPath id={id}>{frame===0?<path d="M20 20H460V420H300V400H20Z"/>:frame===2?<path d="M20 450L100 410H300V450H460V850H20Z"/>:<rect x={left} y={top} width={width} height={height}/>}</clipPath></defs><image href="/assets/art-v1/journey-landmarks-v1.webp" width="900" height="900" clipPath={`url(#${id})`}/></svg>;
}
