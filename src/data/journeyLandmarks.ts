export const journeyLandmarks = [['Kamenný most','Stone bridge'],['Lesný chodník','Woodland trail'],['Horský priesmyk','Mountain pass'],['Stará cesta','Old road'],['Riečny brod','River ford'],['Kamenné schody','Stone steps']] as const;
export function journeyLandmarkAt(column:number,row:number){return (column+row)%journeyLandmarks.length;}
