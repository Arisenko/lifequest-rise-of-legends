import { Children, useState } from 'react';
import type { DetailsHTMLAttributes } from 'react';

export function DeferredDetails({children,...props}:DetailsHTMLAttributes<HTMLDetailsElement>) {
  const [open,setOpen]=useState(false);
  const [summary,...content]=Children.toArray(children);
  return <details {...props} onToggle={event=>setOpen(event.currentTarget.open)}>{summary}{open&&content}</details>;
}
