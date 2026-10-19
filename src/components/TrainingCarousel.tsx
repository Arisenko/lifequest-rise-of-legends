import { useRef, useState, type ReactNode } from 'react';

export function TrainingCarousel({ title, lang, children }: { title: string; lang: 'sk' | 'en'; children: ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(1);
  const [atEnd, setAtEnd] = useState(false);
  const tr = (sk: string, en: string) => lang === 'sk' ? sk : en;
  const move = (direction: number) => {
    const container = track.current;
    const card = container?.firstElementChild;
    if (!container || !card) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    container.scrollBy({ left: direction * (card.getBoundingClientRect().width + 16), behavior: reduced ? 'instant' : 'smooth' });
  };
  return <section className="quest-period" aria-label={title}>
    <div className="training-period-heading"><h2>{title}</h2><div className="training-carousel-controls"><span aria-live="polite">{position} / 10</span><button type="button" disabled={position === 1} onClick={() => move(-1)} aria-label={tr('Predošlé tréningy', 'Previous training cards')}>←</button><button type="button" disabled={atEnd} onClick={() => move(1)} aria-label={tr('Ďalšie tréningy', 'Next training cards')}>→</button></div></div>
    <div className="quests training-carousel" ref={track} tabIndex={0} role="region" aria-label={tr('Posúvateľné tréningy', 'Scrollable training cards')} onScroll={() => {
      const container = track.current;
      if (!container) return;
      const width = container.firstElementChild?.getBoundingClientRect().width || 1;
      setPosition(Math.min(10, Math.round(container.scrollLeft / (width + 16)) + 1));
      setAtEnd(container.scrollLeft + container.clientWidth >= container.scrollWidth - 2);
    }} onKeyDown={event => {
      if (event.target !== event.currentTarget || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1);
    }}>{children}</div>
  </section>;
}
