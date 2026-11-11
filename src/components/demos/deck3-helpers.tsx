/**
 * deck3 共用的绘图小工具（移植自 assets/demos-deck3.js 的 label / box / seg / bar）
 * 配色全部走 CSS 变量，暗色模式自动适配。
 */
import type { CSSProperties, ReactNode } from 'react';

export const C3 = {
  ink: 'var(--ink)',
  soft: 'var(--ink-2)',
  line: 'var(--hairline)',
  lineSoft: 'var(--hairline-soft)',
  panel: 'var(--c-cell-idle)',
  keyBg: 'var(--key-bg)',
  accent: 'var(--c-accent)',
  accent2: 'var(--c-accent-2)',
  hot: 'var(--c-hot)',
  ok: 'var(--c-ok)',
  warn: 'var(--c-warn)',
};

type Anchor = 'start' | 'middle' | 'end';

/** 文本：anchor 默认居中（与原 label() 一致） */
export function Label({
  x,
  y,
  s,
  cls,
  anchor,
  fill,
}: {
  x: number;
  y: number;
  s: string;
  cls?: string;
  anchor?: Anchor;
  fill?: string;
}) {
  const style: CSSProperties | undefined = fill ? { fill } : undefined;
  return (
    <text x={x} y={y} className={cls || 'tx'} textAnchor={anchor || 'middle'} style={style}>
      {s}
    </text>
  );
}

/** 圆角矩形 + 居中文字 */
export function Box({
  x,
  y,
  w,
  h,
  text,
  o,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  text?: string;
  o?: {
    rx?: number;
    fill?: string;
    stroke?: string;
    sw?: number;
    cls?: string;
    tcls?: string;
    ink?: string;
    dy?: number;
  };
}) {
  const opt = o || {};
  return (
    <>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={opt.rx == null ? 6 : opt.rx}
        fill={opt.fill || C3.panel}
        stroke={opt.stroke || C3.line}
        strokeWidth={opt.sw == null ? 1.2 : opt.sw}
        className={opt.cls || 'node-rect'}
      />
      {text && (
        <Label
          x={x + w / 2}
          y={y + h / 2 + (opt.dy == null ? 4 : opt.dy)}
          s={text}
          cls={opt.tcls || 'tx'}
          anchor="middle"
          fill={opt.ink}
        />
      )}
    </>
  );
}

/** 直线段 */
export function Seg({
  x1,
  y1,
  x2,
  y2,
  o,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  o?: { stroke?: string; sw?: number; dash?: string; cls?: string };
}) {
  const opt = o || {};
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={opt.stroke || C3.line}
      strokeWidth={opt.sw == null ? 1.2 : opt.sw}
      strokeDasharray={opt.dash || undefined}
      className={opt.cls || 'edge'}
    />
  );
}

/** 柱状条 */
export function Bar3({
  x,
  base,
  w,
  h,
  fill,
}: {
  x: number;
  base: number;
  w: number;
  h: number;
  fill: string;
}) {
  return <rect x={x} y={base - h} width={w} height={h} rx={3} fill={fill} stroke="none" className="arr-bar" />;
}

/** 包一层 SVG（demo View 的根内容放这里） */
export function G3({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
