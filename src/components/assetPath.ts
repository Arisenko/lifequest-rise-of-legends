import assets from '../data/optimizedAssets.json';

export function assetPath(path:string) {
  return (assets as Record<string,string>)[path]||path;
}
