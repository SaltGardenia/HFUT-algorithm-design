/**
 * 辗转相除法（欧几里得算法）执行过程：gcd(48, 18) = 6
 * 左侧伪代码逐行高亮，右上 m / n / r 状态面板，底部迭代历程（余数严格递减）。
 * 移植自 assets/demos-deck1.js 的 euclid
 */
import type { ReactNode } from 'react';
import type { DemoDef, DemoFrame } from './types';

export interface Frame extends DemoFrame {
  m: number;
  n: number;
  /** 本步余数；'—' 表示尚未计算 */
  r: number | '—';
  /** 当前执行到 EUC_CODE 的第几行（1 = while 判断 … 5 = return） */
  ln: number;
  hist: string[];
}

const EUC_CODE = [
  'EUCLID(m, n)',
  '1  while n ≠ 0',
  '2      r = m mod n',
  '3      m = n',
  '4      n = r',
  '5  return m',
];

const W = 560;
const H = 360;

type Anchor = 'start' | 'middle' | 'end';

/* 原文件的 tCode / tSans / box helper，用内联 <text> / <rect> 实现 */
function tCode(
  x: number,
  y: number,
  s: string | number,
  fill: string,
  bold = false,
  anchor: Anchor = 'start',
  size = 12.5,
): ReactNode {
  return (
    <text x={x} y={y} fontFamily="var(--font-mono)" fontSize={size} fontWeight={bold ? 700 : 400} fill={fill} textAnchor={anchor}>
      {String(s)}
    </text>
  );
}

function tSans(
  x: number,
  y: number,
  s: string | number,
  fill: string,
  bold = false,
  anchor: Anchor = 'start',
  size = 12,
): ReactNode {
  return (
    <text x={x} y={y} fontFamily="var(--font)" fontSize={size} fontWeight={bold ? 700 : 400} fill={fill} textAnchor={anchor}>
      {String(s)}
    </text>
  );
}

function box(x: number, y: number, w: number, h: number, fill: string, stroke: string, rx = 6, sw = 1): ReactNode {
  return <rect x={x} y={y} width={w} height={h} rx={rx} fill={fill} stroke={stroke} strokeWidth={sw} />;
}

export function build(): Frame[] {
  const steps: Frame[] = [
    { m: 48, n: 18, r: '—', ln: 1, cap: '开始：m = 48，n = 18。判断循环条件 n ≠ 0，18 ≠ 0 成立，进入循环体。', hist: [] },
    { m: 48, n: 18, r: 12, ln: 2, cap: '计算余数：48 ÷ 18 = 2 余 <b>12</b>，所以 r = 12。', hist: ['48 ÷ 18 = 2 … 12'] },
    { m: 18, n: 12, r: 12, ln: 3, cap: '执行 m = n：把原来的除数 18 赋给 m，此时 m = 18。', hist: ['48 ÷ 18 = 2 … 12'] },
    { m: 18, n: 12, r: 12, ln: 4, cap: '执行 n = r：把余数 12 赋给 n，此时 n = 12。问题规模从 (48,18) 缩小到 (18,12)。', hist: ['48 ÷ 18 = 2 … 12'] },
    { m: 18, n: 12, r: '—', ln: 1, cap: '回到 while 判断：n = 12 ≠ 0，继续循环。', hist: ['48 ÷ 18 = 2 … 12'] },
    { m: 18, n: 12, r: 6, ln: 2, cap: '计算余数：18 ÷ 12 = 1 余 <b>6</b>，所以 r = 6。', hist: ['48 ÷ 18 = 2 … 12', '18 ÷ 12 = 1 … 6'] },
    { m: 12, n: 6, r: 6, ln: 3, cap: '执行 m = n：m = 12。', hist: ['48 ÷ 18 = 2 … 12', '18 ÷ 12 = 1 … 6'] },
    { m: 12, n: 6, r: 6, ln: 4, cap: '执行 n = r：n = 6。问题规模缩小到 (12, 6)。', hist: ['48 ÷ 18 = 2 … 12', '18 ÷ 12 = 1 … 6'] },
    { m: 12, n: 6, r: '—', ln: 1, cap: '回到 while 判断：n = 6 ≠ 0，继续循环。', hist: ['48 ÷ 18 = 2 … 12', '18 ÷ 12 = 1 … 6'] },
    { m: 12, n: 6, r: 0, ln: 2, cap: '计算余数：12 ÷ 6 = 2 余 <b>0</b>，所以 r = 0。注意余数已经变成 0。', hist: ['48 ÷ 18 = 2 … 12', '18 ÷ 12 = 1 … 6', '12 ÷ 6 = 2 … 0'] },
    { m: 6, n: 0, r: 0, ln: 3, cap: '执行 m = n：m = 6。', hist: ['48 ÷ 18 = 2 … 12', '18 ÷ 12 = 1 … 6', '12 ÷ 6 = 2 … 0'] },
    { m: 6, n: 0, r: 0, ln: 4, cap: '执行 n = r：n = 0。此时 m = 6、n = 0。', hist: ['48 ÷ 18 = 2 … 12', '18 ÷ 12 = 1 … 6', '12 ÷ 6 = 2 … 0'] },
    { m: 6, n: 0, r: '—', ln: 1, cap: '回到 while 判断：n = 0，条件 <b>不成立</b>，退出循环。', hist: ['48 ÷ 18 = 2 … 12', '18 ÷ 12 = 1 … 6', '12 ÷ 6 = 2 … 0'] },
    { m: 6, n: 0, r: '—', ln: 5, cap: '执行 return m：返回 <b>6</b>。即 gcd(48, 18) = 6，共迭代 3 轮。', hist: ['48 ÷ 18 = 2 … 12', '18 ÷ 12 = 1 … 6', '12 ÷ 6 = 2 … 0'] },
  ];
  return steps;
}

/** 状态面板里的值胶囊（原 valuePill） */
function pill(x: number, label: string, sub: string, value: string, valueColor: string): ReactNode {
  return (
    <g>
      {box(x, 46, 74, 50, 'var(--c-panel)', 'var(--c-line)', 7)}
      {tSans(x + 37, 64, label, 'var(--ink-2)', true, 'middle', 12)}
      {tCode(x + 37, 86, value, valueColor, true, 'middle', 17)}
      {tSans(x + 37, 108, sub, 'var(--ink-2)', false, 'middle', 10)}
    </g>
  );
}

function View({ frame: s }: { frame: Frame }) {
  /* 代码高亮行：ln 即 EUC_CODE[ln] 的行号（含标题行），高亮框对准该行文字 */
  const hlY = s.ln >= 1 && s.ln <= EUC_CODE.length ? 30 + s.ln * 24 : null;

  /* 历史区 */
  const lastHist = s.hist.length ? s.hist[s.hist.length - 1] : '';
  const noteY = 250 + s.hist.length * 30;
  const note =
    s.hist.length === 0
      ? '尚未产生余数'
      : s.ln === 5
        ? '余数最终为 0，while 条件不成立，返回 m = 6'
        : '余数序列：' + s.hist.map((e) => e.split('…')[1].trim()).join(' → ') + ' → 0';

  return (
    <>
      {/* 左侧伪代码面板 */}
      {box(14, 14, 258, 18 + EUC_CODE.length * 24 + 8, 'var(--code-bg)', 'var(--c-line)', 8)}
      <text x={30} y={30} fontFamily="var(--font)" fontSize={11} fontWeight={700} letterSpacing="0.08em" fill="var(--ink-2)">
        伪代码
      </text>
      {hlY != null && box(18, hlY, 250, 22, 'var(--warn-bg)', 'var(--c-warn)', 4)}
      {EUC_CODE.map((line, i) => (
        <g key={i}>{tCode(30, 30 + i * 24 + 15, line, 'var(--code-ink)')}</g>
      ))}

      {/* 右侧状态面板 */}
      {box(286, 14, 260, 178, 'var(--c-panel-2)', 'var(--c-line)', 8)}
      {tSans(300, 34, '当前状态', 'var(--ink-2)', true, 'start', 11.5)}
      {pill(298, 'm', '被除数', String(s.m), 'var(--c-accent)')}
      {pill(386, 'n', '除数', String(s.n), s.m === 6 && s.n === 0 ? 'var(--c-ok)' : 'var(--c-accent)')}
      {pill(474, 'r', '余数', String(s.r), 'var(--c-accent)')}
      {tCode(300, 128, '执行行：' + EUC_CODE[s.ln], 'var(--c-ink)')}
      {tCode(300, 152, lastHist, 'var(--c-hot)')}
      {tSans(300, 178, '已迭代轮数：' + s.hist.length + (s.ln === 5 ? '　（结束，返回 ' + s.m + '）' : ''), 'var(--ink-2)', false, 'start', 11.5)}

      {/* 底部历史区 */}
      {box(14, 202, 532, 144, 'var(--c-panel)', 'var(--c-line)', 8)}
      {tSans(28, 222, '迭代历程（余数严格递减，必收敛到 0）', 'var(--ink-2)', true, 'start', 11.5)}
      {s.hist.map((e, k) => {
        const hy = 250 + k * 30;
        const isLast = k === s.hist.length - 1;
        return (
          <g key={k}>
            {box(28, hy - 16, 504, 24, isLast ? 'var(--key-bg)' : 'var(--c-panel-2)', isLast ? 'var(--c-accent)' : 'var(--hairline-soft)', 5)}
            {tCode(40, hy + 1, '第 ' + (k + 1) + ' 轮：', 'var(--ink-2)', false, 'start', 12)}
            {tCode(106, hy + 1, e, 'var(--c-ink)', true, 'start', 12.5)}
            {isLast && tSans(360, hy + 1, '← 本轮结果', 'var(--c-accent)', false, 'start', 11)}
          </g>
        );
      })}
      {noteY < 336 && tSans(40, noteY, note, 'var(--ink-2)', false, 'start', 11.5)}
    </>
  );
}

export const euclid: DemoDef<Frame> = { build, View, w: W, h: H };
