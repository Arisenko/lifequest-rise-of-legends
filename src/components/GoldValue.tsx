import { GameIcon } from './GameArt';

export function GoldValue({amount,lang}:{amount:number;lang:'sk'|'en'}) {
  const value=amount.toLocaleString(lang==='sk'?'sk-SK':'en-GB');
  return <span className="gold-value" aria-label={value+(lang==='sk'?' zlata':' gold')}><GameIcon name="gold"/><span>{value}</span></span>;
}
