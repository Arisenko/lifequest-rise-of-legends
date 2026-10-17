import type { ReactNode } from 'react';
import { GameIcon, SceneArt } from './GameArt';

export function PageIntro({ scene, icon, eyebrow, title, description, children }: {
  scene: string;
  icon: string;
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return <header className="page-intro">
    <SceneArt scene={scene} label={title}/>
    <div className="page-intro-copy">
      <p className="eyebrow"><GameIcon name={icon}/>{eyebrow}</p>
      <h2>{title}</h2>
      <p className="page-intro-description">{description}</p>
      {children && <div className="page-intro-meta">{children}</div>}
    </div>
  </header>;
}
