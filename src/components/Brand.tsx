import { assetPath } from './assetPath';
export function Brand({ large = false }: {large?:boolean}) {
  return <div className={'lifequest-brand'+(large?' lifequest-brand-large':'')}><img className="lifequest-logo" src={assetPath('/assets/brand/lifequest-logo-growth.png')} alt="LifeQuest — Rise of Legends" width="2172" height="724" fetchPriority="high"/></div>;
}
