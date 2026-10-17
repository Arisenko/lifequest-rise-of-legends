import { GameIcon } from './GameArt';

export function BackButton({ onClick, label, icon = 'town', disabled = false }: { onClick: () => void; label: string; icon?: string; disabled?: boolean }) {
  return <button type="button" className="return-button" onClick={onClick} disabled={disabled}><span className="return-arrow" aria-hidden="true">←</span><GameIcon name={icon}/><span>{label}</span></button>;
}
