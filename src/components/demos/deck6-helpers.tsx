/**
 * deck6 共用的绘图小工具（移植自 assets/demos-deck6.js 的 panel / arrowDown / arrowUp）
 */
import type { ReactNode } from 'react';

/** 画一个圆角面板：hl 取 'key' / 'tip' / 'warn' / null */
export function Panel({
  x,
  y,
  w,
  h,
  hl,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  hl?: 'key' | 'tip' | 'warn' | null;
}) {
  let fill = 'var(--c-panel-2)';
  let stroke = 'var(--c-line)';
  if (hl === 'key') {
    fill = 'var(--c-key-bg)';
    stroke = 'var(--c-accent)';
  } else if (hl === 'tip') {
    fill = 'var(--c-tip-bg)';
    stroke = 'var(--c-ok)';
  } else if (hl === 'warn') {
    fill = 'var(--c-warn-bg)';
    stroke = 'var(--c-warn)';
  }
  return <rect x={x} y={y} width={w} height={h} rx={8} fill={fill} stroke={stroke} strokeWidth={1.6} />;
}

/** 带箭头的竖线（向下） */
export function ArrowDown({ x, y1, y2, color }: { x: number; y1: number; y2: number; color?: string }) {
  const c = color || 'var(--c-line)';
  return (
    <>
      <line x1={x} y1={y1} x2={x} y2={y2 - 9} stroke={c} strokeWidth={2.2} />
      <polygon points={`${x - 5},${y2 - 9} ${x + 5},${y2 - 9} ${x},${y2}`} fill={c} />
    </>
  );
}

/** 带箭头的竖线（向上） */
export function ArrowUp({ x, y1, y2, color }: { x: number; y1: number; y2: number; color?: string }) {
  const c = color || 'var(--c-line)';
  return (
    <>
      <line x1={x} y1={y1} x2={x} y2={y2 + 9} stroke={c} strokeWidth={2.2} />
      <polygon points={`${x - 5},${y2 + 9} ${x + 5},${y2 + 9} ${x},${y2}`} fill={c} />
    </>
  );
}

/** SVG 文本（deck6 原样：text-anchor / class 直配） */
export function T6({
  x,
  y,
  s,
  anchor,
  cls,
  fill,
}: {
  x: number;
  y: number;
  s: string | number;
  anchor?: 'start' | 'middle' | 'end';
  cls?: string;
  fill?: string;
}) {
  const style = fill ? { fill } : undefined;
  return (
    <text x={x} y={y} textAnchor={anchor} className={cls} style={style}>
      {String(s)}
    </text>
  );
}

export function Frag({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
