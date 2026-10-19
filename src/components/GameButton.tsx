import type { ButtonHTMLAttributes } from 'react';

export function GameButton({className='',variant,...props}:ButtonHTMLAttributes<HTMLButtonElement>&{variant?:'combat'}) {
  return <button {...props} className={'game-button '+(variant==='combat'?'combat-control ':'')+className}/>;
}
