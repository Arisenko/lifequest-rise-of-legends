import { routeMapFor, routeMaps, routePathFromSeed } from '../data/routeMaps';
import { JourneyArtwork } from './JourneyArtwork';

import { journeyLandmarks, journeyLandmarkAt } from '../data/journeyLandmarks';
export { journeyLandmarks, journeyLandmarkAt } from '../data/journeyLandmarks';
export function RouteMapLegend({areaId,lang}:{areaId:string;lang:'sk'|'en'}) {
  const map=routeMapFor(areaId)||routeMaps.find(map=>map.id===areaId);
  if(!map)return null;
  const index=lang==='sk'?0:1;
  const route=routePathFromSeed(map.seed);
  return <section className="route-map-legend" aria-label={map.names[index]}><div className="route-map-heading"><JourneyArtwork frame={0}/><h3>{map.names[index]}</h3></div><p>{lang==='sk'?'Mapa platí len pre túto oblasť a nespotrebuje sa. Do ďalšej oblasti potrebuješ novú mapu. Čísla označujú poradie úsekov; rovnaký terén sa môže opakovať. Presný postup zľava doprava:':'This reusable map is specific to this region. The next region requires a new map. Numbers show stage order; terrain can repeat. Exact route from left to right:'}</p><ol>{route.map((row,column)=>{const landmark=journeyLandmarkAt(column,row);return <li key={column}><b>{column+1}</b><JourneyArtwork frame={landmark+1}/><span>{journeyLandmarks[landmark][index]}</span></li>})}</ol></section>;
}
