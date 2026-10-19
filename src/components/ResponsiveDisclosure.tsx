import { useId, useState } from 'react';
import type { ReactNode } from 'react';

export function ResponsiveDisclosure({title,children}:{title:string;children:ReactNode}) {
  const [open,setOpen]=useState(false);
  const id=useId();
  return <section className={'responsive-disclosure'+(open?' is-open':'')}><button type="button" className="disclosure-toggle" aria-controls={id} aria-expanded={open} onClick={()=>setOpen(value=>!value)}>{title}<span aria-hidden="true">{open?'−':'+'}</span></button><div id={id} className="disclosure-body">{children}</div></section>;
}
