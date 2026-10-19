import { useId } from 'react';

export function TrainingIcon({ frame }: { frame: string }) {
  const index = Math.max(0, Math.min(29, Math.floor(Number(frame) || 0)));
  const clipId = useId();
  const columns = [0, 201, 401, 600, 800, 1000];
  const rows = [0, 190, 370, 561, 746, 941, 1200];
  const column = index % 5;
  const row = Math.floor(index / 5);
  const left = columns[column] + 2;
  const top = rows[row] + 2;
  const width = columns[column + 1] - left - 2;
  const height = rows[row + 1] - top - 2;
  const size = Math.max(width, height) * 1.06;
  return <svg className="training-activity-icon" viewBox={`${left + (width - size) / 2} ${top + (height - size) / 2} ${size} ${size}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false"><defs><clipPath id={clipId}><rect x={left} y={top} width={width} height={height}/></clipPath></defs><image href="/assets/art-v1/training-icons-v1.webp" width="1000" height="1200" clipPath={`url(#${clipId})`}/></svg>;
}
