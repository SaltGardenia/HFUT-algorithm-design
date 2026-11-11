/**
 * BFPRT（中位数的中位数）：23 个数据找第 8 小（15 帧）
 * 数据取 PPT 第 49 页引例，5 列分组与图一致
 * 移植自 assets/demos-deck5.js 的 median-of-medians
 */
import type { DemoDef, DemoFrame } from './types';
import { T6 } from './deck6-helpers';

export interface Frame extends DemoFrame {
  /** 每组一列，列内自上而下（组内升序） */
  cols: number[][];
  /** 各组中位数（null = 尚未求出） */
  meds: Array<number | null> | null;
  /** 中位数的中位数 x */
  xv: number | null;
  /** 本步正在处理的组下标（-1 无） */
  lit: number;
  /** 是否显示中位数红圈 */
  ring: boolean;
  phase: string;
  /** 图内结论 */
  note: string;
}

const W = 960, H = 580;
const COLS = 5;
const CX0 = 140, CSTEP = 150, R0 = 100, RSTEP = 58, RAD = 24;

const COLS_L1: number[][] = [
  [1, 39, 12, 2, 45],
  [5, 68, 16, 6, 97],
  [3, 47, 14, 4, 26],
  [9, 72, 18, 10, 58],
  [7, 8, 32],
];
const COLS_L2: number[][] = [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [12]];

/** 一列的中位数（列内已升序） */
const medianOf = (col: number[]) => col[Math.floor((col.length - 1) / 2)];

export function build(): Frame[] {
  const F: Frame[] = [
    {
      cols: COLS_L1, meds: null, xv: null, lit: -1, ring: false, phase: '① 分组',
      note: 'n = 23，每 5 个一组 ⇒ ⌈23/5⌉ = 5 组，最后一组只有 3 个',
      cap: '23 个数据、k = 8：要在 A 中找<b>第 8 小</b>。第 ① 步把 23 个元素每 5 个一组，共 ⌈23/5⌉ = 5 组（4 个满组 + 1 个 3 元素的尾组），每组占一列。',
    },
    {
      cols: [[1, 2, 12, 39, 45], [5, 68, 16, 6, 97], [3, 47, 14, 4, 26], [9, 72, 18, 10, 58], [7, 8, 32]],
      meds: [12, null, null, null, null], xv: null, lit: 0, ring: true, phase: '② 组内排序取中位数',
      note: '第 1 组：1,39,12,2,45 → 1,2,12,39,45，中位数取第 3 个 = 12',
      cap: '第 1 组 ⟨1,39,12,2,45⟩ 排序后为 ⟨1,2,12,39,45⟩，取中间第 3 个 → <b>中位数 12</b>（红圈）。5 个元素的组，中位数一定在第 3 行。',
    },
    {
      cols: [[1, 2, 12, 39, 45], [5, 6, 16, 68, 97], [3, 47, 14, 4, 26], [9, 72, 18, 10, 58], [7, 8, 32]],
      meds: [12, 16, null, null, null], xv: null, lit: 1, ring: true, phase: '② 组内排序取中位数',
      note: '第 2 组：5,68,16,6,97 → 5,6,16,68,97，中位数 = 16',
      cap: '第 2 组 ⟨5,68,16,6,97⟩ 排序后为 ⟨5,6,16,68,97⟩，中位数 <b>16</b>。',
    },
    {
      cols: [[1, 2, 12, 39, 45], [5, 6, 16, 68, 97], [3, 4, 14, 26, 47], [9, 72, 18, 10, 58], [7, 8, 32]],
      meds: [12, 16, 14, null, null], xv: null, lit: 2, ring: true, phase: '② 组内排序取中位数',
      note: '第 3 组：3,47,14,4,26 → 3,4,14,26,47，中位数 = 14',
      cap: '第 3 组 ⟨3,47,14,4,26⟩ 排序后为 ⟨3,4,14,26,47⟩，中位数 <b>14</b>。',
    },
    {
      cols: [[1, 2, 12, 39, 45], [5, 6, 16, 68, 97], [3, 4, 14, 26, 47], [9, 10, 18, 58, 72], [7, 8, 32]],
      meds: [12, 16, 14, 18, null], xv: null, lit: 3, ring: true, phase: '② 组内排序取中位数',
      note: '第 4 组：9,72,18,10,58 → 9,10,18,58,72，中位数 = 18',
      cap: '第 4 组 ⟨9,72,18,10,58⟩ 排序后为 ⟨9,10,18,58,72⟩，中位数 <b>18</b>。',
    },
    {
      cols: [[1, 2, 12, 39, 45], [5, 6, 16, 68, 97], [3, 4, 14, 26, 47], [9, 10, 18, 58, 72], [7, 8, 32]],
      meds: [12, 16, 14, 18, 8], xv: null, lit: 4, ring: true, phase: '② 尾组特殊处理',
      note: '第 5 组只有 3 个：7,8,32 → 中位数取第 ⌈3/2⌉ = 2 个 = 8',
      cap: '第 5 组只有 3 个元素 ⟨7,8,32⟩（不满 5 个）。中位数取第 ⌈3/2⌉ = 2 个 → <b>8</b>，不是第 3 行的 32 —— 组内中位数按"第 ⌈len/2⌉ 个"算。',
    },
    {
      cols: COLS_L1.map((c) => c.slice()),
      meds: [12, 16, 14, 18, 8], xv: null, lit: -1, ring: true, phase: '③ 中位数数组 medians',
      note: 'medians = ⟨12,16,14,18,8⟩，共 g = 5 个，下一步递归求它们的中位数',
      cap: '5 个组内中位数收集成 medians = ⟨12,16,14,18,8⟩（g = 5）。第 ③ 步对这 g 个中位数<b>递归调用 Select</b>，求"中位数的中位数" x。',
    },
    {
      cols: COLS_L1.map((c) => c.slice()),
      meds: [12, 16, 14, 18, 8], xv: 14, lit: -1, ring: true, phase: '③ 求 x',
      note: 'medians 排序 → 8,12,14,16,18，第 ⌈5/2⌉ = 3 个 = 14 ⇒ x = 14',
      cap: 'medians 排好序是 ⟨8,12,14,16,18⟩，取第 ⌈5/2⌉ = 3 个 ⇒ <b>x = 14</b>（橙色圈）。x 是 5 个中位数的中位数，所以有 2 个中位数 ≤ x、2 个 ≥ x。',
    },
    {
      cols: COLS_L1.map((c) => c.slice()),
      meds: [12, 16, 14, 18, 8], xv: 14, lit: -1, ring: true, phase: '④ 以 x 划分',
      note: '< 14 的 11 个：1,2,12,5,6,3,4,9,10,7,8 ｜14 在第 12 位｜> 14 的 11 个',
      cap: '第 ④ 步用 PARTITION-AROUND 以 x = 14 划分：<b>小于 14 的 11 个</b>（1,2,12,5,6,3,4,9,10,7,8）排在左边，14 落在<b>第 12 位</b>，右边是 11 个大于 14 的元素。',
    },
    {
      cols: COLS_L1.map((c) => c.slice()),
      meds: [12, 16, 14, 18, 8], xv: 14, lit: -1, ring: true, phase: '⑤ 判定并只递归一边',
      note: 'res = mid−left+1 = 12−1+1 = 12 > k = 8 ⇒ 左半边递归，右边 11 个丢弃',
      cap: '第 ⑤ 步：res = mid − left + 1 = 12 − 1 + 1 = <b>12</b>，而 k = 8 &lt; 12，所以第 8 小在左半边 → 递归左半边找第 8 小，<b>右边 11 个元素（16,18,26,32,39,45,47,58,68,72,97）整段丢弃</b>。',
    },
    {
      cols: COLS_L2, meds: null, xv: null, lit: -1, ring: false, phase: '② 第二层：再分组',
      note: '左半边剩 11 个：1,2,3,4,5,6,7,8,9,10,12 ⇒ ⌈11/5⌉ = 3 组',
      cap: '第二层：左半边剩 <b>11 个</b>元素（为便于观察按升序列出，Select 只关心集合、不关心顺序），仍要找第 8 小。再每 5 个一组 ⇒ ⌈11/5⌉ = 3 组（5 + 5 + 1）。',
    },
    {
      cols: COLS_L2, meds: [3, 8, 12], xv: null, lit: -1, ring: true, phase: '② 组内中位数',
      note: '三组中位数：3（第 3 个）、8（第 3 个）、12（只有 1 个，就是它自己）',
      cap: '三组各自的中位数：⟨1,2,3,4,5⟩ → <b>3</b>；⟨6,7,8,9,10⟩ → <b>8</b>；⟨12⟩ 只有 1 个，中位数就是 <b>12</b>。',
    },
    {
      cols: COLS_L2, meds: [3, 8, 12], xv: 8, lit: -1, ring: true, phase: '③ 求第二层的 x',
      note: 'medians 排序 → 3,8,12，第 ⌈3/2⌉ = 2 个 = 8 ⇒ x = 8',
      cap: 'medians = ⟨3,8,12⟩ 排序后仍是 ⟨3,8,12⟩，取第 ⌈3/2⌉ = 2 个 ⇒ <b>x = 8</b>。',
    },
    {
      cols: COLS_L2, meds: [3, 8, 12], xv: 8, lit: -1, ring: true, phase: '④ 划分命中',
      note: '以 8 划分：7 个 < 8 ｜8 在第 8 位｜ res = 8−1+1 = 8 = k ⇒ 返回 8',
      cap: '以 x = 8 划分：小于 8 的有 7 个（1..7），8 落在<b>第 8 位</b>，res = 8 − 1 + 1 = <b>8 = k</b> ⇒ 命中，返回 <b>8</b>。',
    },
    {
      cols: COLS_L2, meds: [3, 8, 12], xv: 8, lit: -1, ring: true, phase: '⑥ 结论',
      note: '答案 8：23 个数排序后第 8 个正是 8；两层递归都是 O(n) 规模收缩',
      cap: '答案 <b>8</b>（23 个数排序后 1,2,3,4,5,6,7,<b>8</b>,9,10,12,14,… 的第 8 个）。每次递归子问题规模 ≤ 7n/10，加上求 x 的 n/5，得 T(n) ≤ T(n/5) + T(7n/10) + O(n) = <b>O(n)</b>。',
    },
  ];
  return F;
}

/** 圆 + 居中文字 */
function Circle({
  cx,
  cy,
  r,
  value,
  fill,
  stroke,
  sw,
}: {
  cx: number;
  cy: number;
  r: number;
  value: number;
  fill: string;
  stroke: string;
  sw: number;
}) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill={fill} stroke={stroke} strokeWidth={sw} className="node-circle" />
      <T6 x={cx} y={cy + 5} anchor="middle" cls="tx" s={value} />
    </>
  );
}

function View({ frame: f }: { frame: Frame }) {
  const columns: React.ReactNode[] = [];
  /* ---- 5 列（每组一列，列内自上而下递增）---- */
  for (let j = 0; j < COLS; ++j) {
    const col = f.cols[j] || [];
    if (!col.length) continue;
    if (j === f.lit) {
      columns.push(
        <rect
          key={`lit${j}`}
          x={CX0 + j * CSTEP - 36}
          y={R0 - 36}
          width={72}
          height={5 * RSTEP + 12}
          rx={12}
          fill="var(--c-key-bg)"
          stroke="var(--c-accent)"
          strokeWidth={1.6}
        />,
      );
    }
    for (let r = 0; r < col.length; ++r) {
      const p = { x: CX0 + j * CSTEP, y: R0 + r * RSTEP };
      const v = col[r];
      const isMed = f.ring && col.length > 0 && v === medianOf(col);
      const isX = f.xv !== null && v === f.xv && isMed;
      if (isX) {
        columns.push(<Circle key={`c${j}-${r}`} cx={p.x} cy={p.y} r={RAD} value={v} fill="var(--c-warn)" stroke="var(--c-warn)" sw={2} />);
        columns.push(<T6 key={`xl${j}-${r}`} x={p.x + RAD + 6} y={p.y + 5} cls="tx-sm" fill="var(--c-warn)" s="x" />);
      } else if (isMed) {
        columns.push(<Circle key={`c${j}-${r}`} cx={p.x} cy={p.y} r={RAD} value={v} fill="var(--c-panel)" stroke="var(--c-hot)" sw={3} />);
      } else {
        columns.push(<Circle key={`c${j}-${r}`} cx={p.x} cy={p.y} r={RAD} value={v} fill="var(--c-panel-2)" stroke="var(--c-line)" sw={1.4} />);
      }
    }
    columns.push(
      <T6
        key={`gt${j}`}
        x={CX0 + j * CSTEP}
        y={R0 + 5 * RSTEP + 12}
        anchor="middle"
        cls="tx-sm"
        s={`第 ${j + 1} 组（${col.length} 个）`}
      />,
    );
  }

  /* ---- medians 行 ---- */
  const medRow: React.ReactNode[] = [];
  for (let j = 0; j < COLS; ++j) {
    const p = { x: CX0 + j * CSTEP, y: 444 };
    if (!f.cols[j] || !f.cols[j].length) continue;
    if (f.meds && f.meds[j] !== null && f.meds[j] !== undefined) {
      const mv = f.meds[j]!;
      if (f.xv !== null && mv === f.xv) {
        medRow.push(<Circle key={`m${j}`} cx={p.x} cy={p.y} r={21} value={mv} fill="var(--c-warn)" stroke="var(--c-warn)" sw={2} />);
      } else {
        medRow.push(<Circle key={`m${j}`} cx={p.x} cy={p.y} r={21} value={mv} fill="var(--c-panel)" stroke="var(--c-hot)" sw={2.4} />);
      }
    } else {
      medRow.push(
        <line
          key={`m${j}`}
          x1={p.x - 18}
          y1={p.y}
          x2={p.x + 18}
          y2={p.y}
          stroke="var(--c-line)"
          strokeWidth={1.2}
          strokeDasharray="4 4"
        />,
      );
    }
  }

  return (
    <>
      <T6 x={26} y={24} cls="tx-b" s="median of medians（BFPRT）：23 个数据找第 8 小" />
      <T6
        x={26}
        y={46}
        cls="tx-sm"
        s={`${f.phase}　|　红圈 = 组内中位数，橙圈 = 中位数的中位数 x，蓝框 = 本步正在处理的组`}
      />
      {columns}

      <T6 x={40} y={448} cls="tx-b" fill="var(--c-accent-2)" s="medians" />
      {medRow}
      {f.xv !== null && (
        <T6 x={40} y={480} cls="tx-sm" fill="var(--c-warn)" s={`x = ${f.xv}（中位数的中位数）`} />
      )}

      {/* 结论行 */}
      <T6 x={26} y={516} cls="tx" s={f.note} />
    </>
  );
}

export const medianOfMedians: DemoDef<Frame> = { build, View, w: W, h: H };
