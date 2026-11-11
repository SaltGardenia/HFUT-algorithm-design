/**
 * demo SVG 绘图原语 —— 移植自原 handbook.js / demos-*.js 的 helper
 * （addText / addRect / addLine / ptrDown / ptrUp / drawCells），改为纯 React 组件。
 * 颜色一律使用 CSS 变量，暗色模式自动适配。
 */
import type { CSSProperties, ReactNode } from 'react';

type Anchor = 'start' | 'middle' | 'end';

/** 文本节点：T(x, y, 文本, class, anchor, color, size) */
export function T({
  x,
  y,
  s,
  cls,
  anchor,
  color,
  size,
}: {
  x: number;
  y: number;
  s: string | number;
  cls?: string;
  anchor?: Anchor;
  color?: string;
  size?: string;
}) {
  const style: CSSProperties = {};
  if (color) style.fill = color;
  if (size) style.fontSize = size;
  return (
    <text x={x} y={y} className={cls || 'tx'} textAnchor={anchor || 'start'} style={style}>
      {String(s)}
    </text>
  );
}

/** 圆角矩形 */
export function Rect({
  x,
  y,
  w,
  h,
  r,
  cls,
  style,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  r?: number;
  cls?: string;
  style?: CSSProperties;
}) {
  return <rect x={x} y={y} width={w} height={h} rx={r} className={cls || 'arr-cell'} style={style} />;
}

/** 直线 */
export function Ln({
  x1,
  y1,
  x2,
  y2,
  style,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  style?: CSSProperties;
}) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} style={style} />;
}

/** 向下箭头（指针在单元格上方） */
export function PtrDown({
  cx,
  tipY,
  label,
  color,
}: {
  cx: number;
  tipY: number;
  label: string;
  color: string;
}) {
  return (
    <>
      <path d={`M ${cx} ${tipY} L ${cx - 5} ${tipY - 10} L ${cx + 5} ${tipY - 10} Z`} style={{ fill: color }} />
      <T x={cx} y={tipY - 14} s={label} cls="tx tx-b" anchor="middle" color={color} />
    </>
  );
}

/** 向上箭头（指针在单元格下方） */
export function PtrUp({
  cx,
  tipY,
  label,
  color,
}: {
  cx: number;
  tipY: number;
  label: string;
  color: string;
}) {
  return (
    <>
      <path d={`M ${cx} ${tipY} L ${cx - 5} ${tipY + 10} L ${cx + 5} ${tipY + 10} Z`} style={{ fill: color }} />
      <T x={cx} y={tipY + 25} s={label} cls="tx tx-b" anchor="middle" color={color} />
    </>
  );
}

/** 数组单元格组：值 + 显示用下标；stOf(k) 返回 st-idle / st-active / st-compare / st-visited / st-pivot */
export function Cells({
  X,
  y,
  A,
  cw,
  ch,
  idxBase,
  stOf,
}: {
  X: (i: number) => number;
  y: number;
  A: number[];
  cw: number;
  ch: number;
  idxBase: number;
  stOf?: (k: number) => string;
}) {
  return (
    <>
      {A.map((v, k) => {
        const st = stOf ? stOf(k) || '' : '';
        const x = X(k);
        const white = st && st !== 'st-idle';
        return (
          <g key={k}>
            <Rect x={x} y={y} w={cw} h={ch} r={4} cls={`arr-cell ${st}`} />
            <T x={x + cw / 2} y={y + ch / 2 - 1} s={v} cls={`tx tx-b${white ? ' tx-white' : ''}`} anchor="middle" />
            <T
              x={x + cw / 2}
              y={y + ch - 5}
              s={idxBase + k}
              cls={`tx-sm${white ? ' tx-white' : ''}`}
              anchor="middle"
              size="9.5px"
            />
          </g>
        );
      })}
    </>
  );
}

/** 组合多个子节点（仅为可读性） */
export function G({ children }: { children: ReactNode }) {
  return <g>{children}</g>;
}
