export type ArtRegion = readonly [number,number,number,number];
export const cleanItems:Record<string,ArtRegion> = {
  helmet:[15,20,300,320],sword:[315,40,305,300],armor:[620,40,320,300],boots:[940,40,310,300],
  gloves:[15,350,305,270],'ring-red':[330,350,280,270],'ring-blue':[635,350,290,270],'ring-green':[945,350,305,270],
  'ring-sun':[20,630,295,285],necklace:[330,620,270,295],cloak:[605,620,340,295],pants:[950,620,295,295],
  shoulders:[15,925,305,300],herb:[325,925,305,300],drum:[635,920,305,305],charm:[945,925,305,300],
};
export const cleanCityIcons:Record<string,ArtRegion> = {
  nira:[25,40,390,375],armorer:[430,40,395,375],weaponsmith:[840,40,395,375],
  vela:[25,430,390,385],guild:[430,430,395,385],tavern:[840,430,395,385],
  castle:[25,820,400,400],stable:[435,825,395,395],arena:[835,825,400,395],
};
