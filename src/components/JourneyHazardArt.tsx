import { useId } from 'react';
export function JourneyHazardArt({frame,className=''}:{frame:number;className?:string}) {
  const id=useId(),columns=frame>=9?2:3,position=frame>=9?frame-9:frame,column=position%columns,row=Math.floor(position/columns);
  return <svg className={'journey-hazard-art '+className} viewBox={`${column} ${row} 1 1`} aria-hidden="true" focusable="false"><defs><clipPath id={id}><rect x={column+.015} y={row+.015} width=".97" height=".97"/></clipPath></defs><image href={frame>=9?'/assets/art-v1/journey-terrain-hazards-v1.png':'/assets/art-v1/journey-hazards-v1.webp'} width={columns} height={columns} clipPath={`url(#${id})`}/></svg>;
}
