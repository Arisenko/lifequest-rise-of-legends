import { routePathFromSeed } from './routeMaps';
import type { Journey } from './journeys';

export function journeyRouteComplete(journey:Journey) {
  return journey.choices?.length===5&&journey.choices.every((row,column)=>row===routePathFromSeed(journey.seed)[column]||journey.acceptedSteps?.includes(column+':'+row));
}
export function settleJourneyRoute<Hero extends {journey?:Journey|null}>(hero:Hero):Hero {
  const journey=hero.journey;
  if(!journey||journey.hazard||journey.step!==5||journeyRouteComplete(journey))return hero;
  return {...hero,journey:{...journey,step:0,choices:[],mistakes:Math.min(3,journey.mistakes+1)}};
}
