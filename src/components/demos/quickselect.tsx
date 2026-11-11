/**
 * 快速选择 QuickSelect：在 A = [6, 10, 13, 5, 8, 3, 2, 11] 中找第 k = 3 小的元素
 * 三轮划分（基准取区间首元素），顶部伪代码逐行高亮，中部数组格子 + p/r/j/q 指针，底部信息条。
 * 移植自 assets/demos-deck1.js 的 quickselect
 */
import type { ReactNode } from 'react';
import type { DemoDef, DemoFrame } from './types';

export interface Frame extends DemoFrame {
  arr: number[];
  /** 当前搜索区间 [p, r]（0 起下标） */
  p: number;
  r: number;
  /** 扫描指针；-1 表示未进入扫描 */
  i: number;
  j: number;
  /** 基准最终下标；-1 表示尚未划分完成 */
  q: number;
  /** 基准值；null 表示尚未选定 */
  pv: number | null;
  /** 当前执行到 QS_CODE 的第几行（0 起） */
  ln: number;
}

const QS_CODE = [
  '1  if p == r              return A[p]',
  '2  q = PARTITION(A, p, r)',
  '3  i = q - p + 1',
  '4  if k == i              return A[q]',
  '5  else if k < i          ⇒ 左半段',
  '6  else                   ⇒ 右半段',
];

const K = 3;
const W = 620;
const H = 400;
const ARR_Y = 248;
/** 原 cellW()：含间距的步进；实际格子宽 60 */
const CELL_W = 66;
const BOX_W = CELL_W - 6;
const CELL_X = (i: number) => 30 + i * CELL_W;

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
    { arr: [6, 10, 13, 5, 8, 3, 2, 11], p: 0, r: 7, i: -1, j: -1, q: -1, pv: null, ln: 0,
      cap: '目标：在 A[0..7] 中找第 <b>k = 3</b> 小的元素（k 从 1 开始计数）。当前搜索区间为整个数组。' },

    { arr: [6, 10, 13, 5, 8, 3, 2, 11], p: 0, r: 7, i: 0, j: 1, q: -1, pv: 6, ln: 1,
      cap: '进入 PARTITION：p = 0、r = 7，取 <b>基准 pivot = A[0] = 6</b>；令 i = 0（左区右边界），j = 1 开始扫描。' },

    { arr: [6, 10, 13, 5, 8, 3, 2, 11], p: 0, r: 7, i: 0, j: 1, q: -1, pv: 6, ln: 1,
      cap: 'j = 1：A[1] = 10 &gt; 6，不属于左区，i 不动，j 右移。' },

    { arr: [6, 10, 13, 5, 8, 3, 2, 11], p: 0, r: 7, i: 0, j: 2, q: -1, pv: 6, ln: 1,
      cap: 'j = 2：A[2] = 13 &gt; 6，同样跳过，j 右移。' },

    { arr: [6, 10, 13, 5, 8, 3, 2, 11], p: 0, r: 7, i: 0, j: 3, q: -1, pv: 6, ln: 1,
      cap: 'j = 3：A[3] = 5 &le; 6，命中！执行 i = i + 1 = 1，然后交换 A[1] 与 A[3]。' },

    { arr: [6, 5, 13, 10, 8, 3, 2, 11], p: 0, r: 7, i: 1, j: 4, q: -1, pv: 6, ln: 1,
      cap: '交换完成：<b>5 换到前面</b>，数组变为 6, 5, 13, 10, 8, 3, 2, 11。左区扩展到下标 1。' },

    { arr: [6, 5, 13, 10, 8, 3, 2, 11], p: 0, r: 7, i: 1, j: 4, q: -1, pv: 6, ln: 1,
      cap: 'j = 4：A[4] = 8 &gt; 6，跳过，j 右移。' },

    { arr: [6, 5, 13, 10, 8, 3, 2, 11], p: 0, r: 7, i: 1, j: 5, q: -1, pv: 6, ln: 1,
      cap: 'j = 5：A[5] = 3 &le; 6，命中！i = 2，交换 A[2] 与 A[5]。' },

    { arr: [6, 5, 3, 10, 8, 13, 2, 11], p: 0, r: 7, i: 2, j: 6, q: -1, pv: 6, ln: 1,
      cap: '交换完成：3 换到前面，数组变为 6, 5, 3, 10, 8, 13, 2, 11。左区扩展到下标 2。' },

    { arr: [6, 5, 3, 10, 8, 13, 2, 11], p: 0, r: 7, i: 2, j: 6, q: -1, pv: 6, ln: 1,
      cap: 'j = 6：A[6] = 2 &le; 6，命中！i = 3，交换 A[3] 与 A[6]。' },

    { arr: [6, 5, 3, 2, 8, 13, 10, 11], p: 0, r: 7, i: 3, j: 7, q: -1, pv: 6, ln: 1,
      cap: '交换完成：2 换到前面，数组变为 6, 5, 3, 2, 8, 13, 10, 11。左区扩展到下标 3。' },

    { arr: [6, 5, 3, 2, 8, 13, 10, 11], p: 0, r: 7, i: 3, j: 7, q: -1, pv: 6, ln: 1,
      cap: 'j = 7：A[7] = 11 &gt; 6，跳过。扫描结束（j 已到 r）。' },

    { arr: [6, 5, 3, 2, 8, 13, 10, 11], p: 0, r: 7, i: 3, j: 7, q: 3, pv: 6, ln: 1,
      cap: '扫描结束，最后一步：交换 <b>A[p] 与 A[i]</b>，即 A[0] 与 A[3]，把基准 6 放到左右区交界处。' },

    { arr: [2, 5, 3, 6, 8, 13, 10, 11], p: 0, r: 7, i: 3, j: 7, q: 3, pv: 6, ln: 1,
      cap: '划分完成！数组为 2, 5, 3, 6, 8, 13, 10, 11，基准 6 落在下标 <b>q = 3</b>。PARTITION 返回 3。' },

    { arr: [2, 5, 3, 6, 8, 13, 10, 11], p: 0, r: 7, i: 3, j: 7, q: 3, pv: 6, ln: 2,
      cap: '执行 i = q − p + 1 = 3 − 0 + 1 = <b>4</b>。含义：基准在当前区间内是第 4 小的元素。' },

    { arr: [2, 5, 3, 6, 8, 13, 10, 11], p: 0, r: 7, i: 3, j: 7, q: 3, pv: 6, ln: 3,
      cap: '比较 k 与 i：k = 3，i = 4，所以 <b>k &lt; i</b>，目标在左半段。只需递归左半段，右半段整体丢弃。' },

    { arr: [2, 5, 3, 6, 8, 13, 10, 11], p: 0, r: 2, i: 3, j: 7, q: 3, pv: 6, ln: 4,
      cap: '递归 RANDOMIZED-SELECT(A, 0, 2, 3)：新区间 A[0..2] = [2, 5, 3]，k 仍为 3。' },

    { arr: [2, 5, 3, 6, 8, 13, 10, 11], p: 0, r: 2, i: 0, j: 1, q: -1, pv: 2, ln: 1,
      cap: '第二轮 PARTITION：p = 0、r = 2，基准 <b>pivot = A[0] = 2</b>；i = 0，j = 1。' },

    { arr: [2, 5, 3, 6, 8, 13, 10, 11], p: 0, r: 2, i: 0, j: 1, q: -1, pv: 2, ln: 1,
      cap: 'j = 1：A[1] = 5 &gt; 2，跳过，j 右移。' },

    { arr: [2, 5, 3, 6, 8, 13, 10, 11], p: 0, r: 2, i: 0, j: 2, q: -1, pv: 2, ln: 1,
      cap: 'j = 2：A[2] = 3 &gt; 2，跳过。扫描结束，仍交换 A[0] 与 A[0]（位置不变）。' },

    { arr: [2, 5, 3, 6, 8, 13, 10, 11], p: 0, r: 2, i: 0, j: 2, q: 0, pv: 2, ln: 1,
      cap: '第二轮划分完成，基准 2 落在下标 <b>q = 0</b>。i = q − p + 1 = 1。' },

    { arr: [2, 5, 3, 6, 8, 13, 10, 11], p: 0, r: 2, i: 0, j: 2, q: 0, pv: 2, ln: 3,
      cap: '比较 k 与 i：k = 3，i = 1，仍然 <b>k &gt; i</b>，目标在右半段，进入 else 分支。' },

    { arr: [2, 5, 3, 6, 8, 13, 10, 11], p: 1, r: 2, i: 0, j: 2, q: 0, pv: 2, ln: 5,
      cap: '递归 RANDOMIZED-SELECT(A, 1, 2, 3 − 1 = 2)：新区间 A[1..2] = [5, 3]，注意 <b>k 扣除了左半段长度 1</b>。' },

    { arr: [2, 5, 3, 6, 8, 13, 10, 11], p: 1, r: 2, i: 1, j: 2, q: -1, pv: 5, ln: 1,
      cap: '第三轮 PARTITION：p = 1、r = 2，基准 <b>pivot = A[1] = 5</b>；i = 1，j = 2。' },

    { arr: [2, 5, 3, 6, 8, 13, 10, 11], p: 1, r: 2, i: 1, j: 2, q: -1, pv: 5, ln: 1,
      cap: 'j = 2：A[2] = 3 &le; 5，命中！i = i + 1 = 2，交换 A[2] 与 A[2]（位置不变）。' },

    { arr: [2, 5, 3, 6, 8, 13, 10, 11], p: 1, r: 2, i: 2, j: 2, q: 2, pv: 5, ln: 1,
      cap: '扫描结束，交换 A[p] 与 A[i]，即 A[1] 与 A[2]。' },

    { arr: [2, 3, 5, 6, 8, 13, 10, 11], p: 1, r: 2, i: 2, j: 2, q: 2, pv: 5, ln: 1,
      cap: '划分完成：数组变为 2, 3, 5, 6, 8, 13, 10, 11，基准 5 落在下标 <b>q = 2</b>。i = q − p + 1 = 2。' },

    { arr: [2, 3, 5, 6, 8, 13, 10, 11], p: 1, r: 2, i: 2, j: 2, q: 2, pv: 5, ln: 2,
      cap: '比较 k 与 i：k = 2，i = 2，<b>k = i</b>，命中！直接返回基准 A[q] = A[2]。' },

    { arr: [2, 3, 5, 6, 8, 13, 10, 11], p: 1, r: 2, i: 2, j: 2, q: 2, pv: 5, ln: 3,
      cap: '答案：第 3 小的元素是 <b>5</b>。总共只做了 3 轮划分，远少于完全排序的代价。' },
  ];
  return steps;
}

function View({ frame: s }: { frame: Frame }) {
  /* 代码高亮行 */
  const hlY = s.ln >= 0 && s.ln < QS_CODE.length ? 34 + s.ln * 22 - 13 : null;

  /* 区间标记（r >= p 时显示） */
  const rangeMark = s.r >= s.p ? { x1: CELL_X(s.p), x2: CELL_X(s.r) + BOX_W } : null;

  /* 指针列表：与原实现的绘制顺序一致（后画的覆盖先画的） */
  const ptrs: { i: number; label: string; color: string }[] = [];
  ptrs.push({ i: s.p, label: '↑ p', color: 'var(--c-accent)' });
  if (s.r >= 0) ptrs.push({ i: s.r, label: '↑ r', color: 'var(--c-accent-2)' });
  if (s.j >= 0 && s.j !== s.p && s.j !== s.r) ptrs.push({ i: s.j, label: '↑ j', color: 'var(--c-warn)' });
  if (s.q >= 0) ptrs.push({ i: s.q, label: '↑ q', color: 'var(--c-accent)' });

  /* 信息条 */
  const infoY = ARR_Y + 88;
  const pieces: string[] = [];
  pieces.push('p = ' + s.p + '　r = ' + s.r);
  if (s.q >= 0) pieces.push('q = ' + s.q + '　i = q−p+1 = ' + (s.q - s.p + 1));
  if (s.pv != null) pieces.push('pivot = ' + s.pv);
  pieces.push('k = ' + K);
  const verdict =
    s.q >= 0
      ? K === s.q - s.p + 1
        ? '判定：k = i，命中基准，直接返回'
        : K < s.q - s.p + 1
          ? '判定：k < i，只递归左半段'
          : '判定：k > i，只递归右半段，k 减去 i'
      : '判定：划分进行中';

  return (
    <>
      {/* 顶部代码区 */}
      {box(12, 16, 596, 22 + QS_CODE.length * 22 + 8, 'var(--code-bg)', 'var(--c-line)', 8)}
      {hlY != null && box(16, hlY, 588, 22, 'var(--warn-bg)', 'var(--c-warn)', 4)}
      {QS_CODE.map((line, ci) => tCode(28, 34 + ci * 22 + 14, line, 'var(--code-ink)', false, 'start', 12))}

      {/* 数组区 */}
      {tSans(28, ARR_Y - 30, '数组 A（上排为下标，下排为元素值）', 'var(--ink-2)', true, 'start', 11.5)}
      {s.arr.map((v, i) => {
        const x = CELL_X(i);
        const inRange = i >= s.p && i <= s.r;
        let fill: string;
        let stroke: string;
        let sw: number;
        if (!inRange) {
          fill = 'var(--c-cell-idle)';
          stroke = 'var(--hairline-soft)';
          sw = 1;
        } else if (i === s.q) {
          fill = 'var(--c-accent)';
          stroke = 'var(--c-accent)';
          sw = 2;
        } else if (i === s.j) {
          fill = 'var(--warn-bg)';
          stroke = 'var(--c-warn)';
          sw = 2;
        } else if (i === s.p) {
          fill = 'var(--key-bg)';
          stroke = 'var(--c-accent)';
          sw = 2;
        } else {
          fill = 'var(--c-panel-2)';
          stroke = 'var(--c-line)';
          sw = 1;
        }
        return (
          <g key={i}>
            {box(x, ARR_Y, BOX_W, 38, fill, stroke, 6, sw)}
            {tSans(x + BOX_W / 2, ARR_Y - 8, String(i), 'var(--ink-2)', false, 'middle', 10.5)}
            {tCode(x + BOX_W / 2, ARR_Y + 25, String(v), i === s.q ? '#fff' : 'var(--c-ink)', true, 'middle', 16)}
          </g>
        );
      })}

      {/* 区间标记条 */}
      {rangeMark && (
        <g>
          <rect x={rangeMark.x1 - 3} y={ARR_Y - 22} width={rangeMark.x2 - rangeMark.x1 + 6} height={3} rx={1.5} fill="var(--c-accent-2)" />
          {tSans((rangeMark.x1 + rangeMark.x2) / 2, ARR_Y - 28, '当前搜索区间 A[' + s.p + '..' + s.r + ']', 'var(--c-accent-2)', true, 'middle', 10.5)}
        </g>
      )}

      {/* 指针标注 */}
      {ptrs
        .filter((pt) => pt.i >= 0 && pt.i < s.arr.length)
        .map((pt, k) => {
          const cx = CELL_X(pt.i) + BOX_W / 2;
          return (
            <g key={k}>
              {tCode(cx, ARR_Y + 58, pt.label, pt.color, true, 'middle', 12)}
              <path d={`M ${cx} ${ARR_Y + 46} l -4 6 l 8 0 z`} fill={pt.color} />
            </g>
          );
        })}

      {/* 信息条 */}
      {box(12, infoY, 596, 62, 'var(--c-panel-2)', 'var(--c-line)', 8)}
      {tCode(28, infoY + 24, pieces.join('　　'), 'var(--c-ink)', true, 'start', 12.5)}
      {tSans(28, infoY + 46, verdict, 'var(--c-hot)', true, 'start', 11.5)}
    </>
  );
}

export const quickselect: DemoDef<Frame> = { build, View, w: W, h: H };
