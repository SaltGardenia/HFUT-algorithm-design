/**
 * 活动选择（PPT 第 34 页的 11 个活动，f 已升序，按 f 升序贪心扫描，共 15 步，
 * 选中的最大兼容子集 {1,4,8,11}）
 * 移植自 assets/demos-deck8.js 的 activity-select
 */
import type { CSSProperties } from 'react';
import type { DemoDef, DemoFrame } from './types';

export interface Frame extends DemoFrame {
  idx: number;
  /** 当前考察的活动编号（-1 表示还没开始 / 已结束） */
  cur: number;
  /** 已选集合 */
  A: number[];
  /** 最后选中的活动 j */
  j: number;
  /** 帧状态：init / take / skip / done / bad */
  st: 'init' | 'take' | 'skip' | 'done' | 'bad';
}

const ACT: Array<[number, number, number]> = [      // [编号, s_i, f_i]，f 升序
  [1, 1, 4], [2, 3, 5], [3, 0, 6], [4, 5, 7], [5, 3, 8], [6, 5, 9],
  [7, 6, 10], [8, 8, 11], [9, 8, 12], [10, 2, 13], [11, 12, 14],
];
const T0 = 178, T1 = 866, TMAX = 14;                // 时间轴左/右端点与最大值
const STEP = (T1 - T0) / TMAX;                      // 每个时间单位对应的像素
const ROWY = 84, ROWH = 29, BARH = 17;              // 行起点、行高、条形高
const W = 880;
const H = 470;

/** 时间 → 横坐标 */
const sx = (t: number) => T0 + t * STEP;

/** 原 FRAMES 表（d 为解说） */
type RawFrame = Omit<Frame, 'idx' | 'cap'> & { d: string };

const RAW_FRAMES: RawFrame[] = [
  { cur: -1, A: [], j: 0, st: 'init',
    d: '输入：<b>11 个活动</b>（PPT 第 34 页算例），活动 i 占用半开区间 [s<sub>i</sub>, f<sub>i</sub>)。表已按结束时间升序排好：f = 4,5,6,7,8,9,10,11,12,13,14，这一步排序本身要 O(n lg n)。' },
  { cur: 1, A: [1], j: 1, st: 'take',
    d: '第 1 步：贪心准则 —— 选<b>结束最早</b>的活动，即 f<sub>1</sub> = 4 的活动 1。A = {1}，j = 1，竖虚线就是当前的 f<sub>j</sub> = 4。' },
  { cur: 2, A: [1], j: 1, st: 'skip',
    d: 'i = 2：s<sub>2</sub> = 3，f<sub>j</sub> = f<sub>1</sub> = 4。因为 3 &lt; 4，[3,5) 与 [1,4) 重叠 → <b>跳过</b>。' },
  { cur: 3, A: [1], j: 1, st: 'skip',
    d: 'i = 3：s<sub>3</sub> = 0 &lt; f<sub>1</sub> = 4，[0,6) 与 [1,4) 重叠 → <b>跳过</b>。活动 3 开始最早，但它太长，选它反而吃亏。' },
  { cur: 4, A: [1, 4], j: 4, st: 'take',
    d: 'i = 4：s<sub>4</sub> = 5 ≥ f<sub>1</sub> = 4 成立，[5,7) 与 [1,4) 不重叠 → <b>选中</b>。A = {1,4}，j = 4，f<sub>j</sub> 变成 7。' },
  { cur: 5, A: [1, 4], j: 4, st: 'skip',
    d: 'i = 5：s<sub>5</sub> = 3 &lt; f<sub>4</sub> = 7 → <b>跳过</b>（[3,8) 横跨了活动 4 的区间）。' },
  { cur: 6, A: [1, 4], j: 4, st: 'skip',
    d: 'i = 6：s<sub>6</sub> = 5 &lt; f<sub>4</sub> = 7 → <b>跳过</b>。' },
  { cur: 7, A: [1, 4], j: 4, st: 'skip',
    d: 'i = 7：s<sub>7</sub> = 6 &lt; f<sub>4</sub> = 7，只差 1 也不兼容 → <b>跳过</b>。贪心的判定是严格的 s<sub>i</sub> ≥ f<sub>j</sub>。' },
  { cur: 8, A: [1, 4, 8], j: 8, st: 'take',
    d: 'i = 8：s<sub>8</sub> = 8 ≥ f<sub>4</sub> = 7 → <b>选中</b>。A = {1,4,8}，j = 8，f<sub>j</sub> = 11。' },
  { cur: 9, A: [1, 4, 8], j: 8, st: 'skip',
    d: 'i = 9：s<sub>9</sub> = 8 &lt; f<sub>8</sub> = 11 → <b>跳过</b>。活动 9 与 8 同时开始却更晚结束，永远不如 8 划算。' },
  { cur: 10, A: [1, 4, 8], j: 8, st: 'skip',
    d: 'i = 10：s<sub>10</sub> = 2 &lt; f<sub>8</sub> = 11 → <b>跳过</b>。' },
  { cur: 11, A: [1, 4, 8, 11], j: 11, st: 'take',
    d: 'i = 11：s<sub>11</sub> = 12 ≥ f<sub>8</sub> = 11 → <b>选中</b>。A = {1,4,8,11}，j = 11，f<sub>j</sub> = 14，扫描结束。' },
  { cur: -1, A: [1, 4, 8, 11], j: 11, st: 'done',
    d: '结果：<b>A = {1,4,8,11}</b>，|A| = 4。11 个活动共 2<sup>11</sup> = 2048 个活动子集，穷举可知最大兼容子集正是 4 个，所以这个贪心解最优。' },
  { cur: -1, A: [3, 7, 11], j: 11, st: 'bad',
    d: '反例（换个准则就错）：若按“<b>开始最早</b>”贪心，先选 s 最小的活动 3（[0,6)），接着只能选 7（[6,10)），再选 11（[12,14)），得到 {3,7,11} 只有 <b>3</b> 个 &lt; 4。准则选错，贪婪就退化。' },
  { cur: -1, A: [1, 4, 8, 11], j: 11, st: 'done',
    d: '复杂度：不计排序时循环只跑 n−1 = 10 次，<b>O(n)</b>；若输入未按 f 排序，排序的 <b>O(n lg n)</b> 成为主导，总时间 O(n lg n)。递归版与迭代版做的事完全一样。' },
];

export function build(): Frame[] {
  return RAW_FRAMES.map((fr, idx) => ({
    idx,
    cur: fr.cur,
    A: fr.A.slice(),
    j: fr.j,
    st: fr.st,
    cap: fr.d,
  }));
}

/* ------------------------------------------------ 原文件自定义 helper 的内联实现 */

type Anchor = 'start' | 'middle' | 'end';

/** 原 txt()：一行文字 */
function Tx({
  x,
  y,
  s,
  cls,
  anchor,
  fill,
}: {
  x: number;
  y: number;
  s: string | number;
  cls?: string;
  anchor?: Anchor;
  fill?: string;
}) {
  const style: CSSProperties | undefined = fill ? { fill } : undefined;
  return (
    <text x={x} y={y} className={cls || 'tx'} textAnchor={anchor} style={style}>
      {String(s)}
    </text>
  );
}

/** 原 seg()：一条线；dash 非空时画虚线 */
function Seg({
  x1,
  y1,
  x2,
  y2,
  color,
  w,
  dash,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  w?: number;
  dash?: string;
}) {
  const style: CSSProperties = { stroke: color, strokeWidth: w || 1.5, strokeLinecap: 'round' };
  if (dash) style.strokeDasharray = dash;
  return <line x1={x1} y1={y1} x2={x2} y2={y2} className="edge" style={style} />;
}

const AX_Y2 = ROWY + ACT.length * ROWH;            // 时间轴网格线的下端基准

function View({ frame: f }: { frame: Frame }) {
  return (
    <>
      {/* 顶部状态条 */}
      <Tx x={20} y={26} s={`第 ${f.idx + 1} / ${RAW_FRAMES.length} 步`} cls="tx-b" anchor="start" fill="var(--c-accent)" />
      <Tx
        x={122}
        y={26}
        s={`j = ${f.j === 0 ? '—' : f.j}${f.j ? `（f_j = ${ACT[f.j - 1][2]}）` : ''}`}
        cls="tx"
        anchor="start"
      />
      <Tx x={420} y={26} s={`A = {${f.A.length ? f.A.join(', ') : '∅'}}`} cls="tx-b" anchor="start" fill="var(--c-ok)" />
      <Tx x={660} y={26} s={`|A| = ${f.A.length}`} cls="tx-b" anchor="start" fill="var(--c-hot)" />

      {/* 左侧表格：i / s_i / f_i */}
      <Tx x={30} y={56} s="i" cls="tx-sm tx-b" anchor="start" />
      <Tx x={62} y={56} s="s" cls="tx-sm tx-b" anchor="start" />
      <Tx x={96} y={56} s="f" cls="tx-sm tx-b" anchor="start" />
      {ACT.map((row, i) => {
        const y = ROWY + i * ROWH;
        const sel = f.A.indexOf(row[0]) >= 0;
        const isCur = f.cur === row[0];
        const color = sel ? 'var(--c-ok)' : isCur ? 'var(--c-hot)' : 'var(--ink-2)';
        return (
          <g key={row[0]}>
            <Tx x={30} y={y} s={row[0]} cls={'tx' + (sel || isCur ? ' tx-b' : '')} anchor="start" fill={color} />
            <Tx x={62} y={y} s={row[1]} cls="tx" anchor="start" fill={color} />
            <Tx x={96} y={y} s={row[2]} cls="tx" anchor="start" fill={color} />
          </g>
        );
      })}

      {/* 时间轴 */}
      {Array.from({ length: TMAX + 1 }, (_, i) => (
        <g key={i}>
          <Seg
            x1={sx(i)}
            y1={58}
            x2={sx(i)}
            y2={AX_Y2 - 6}
            color="var(--hairline-soft)"
            w={1}
            dash={i === 0 || i === TMAX ? undefined : '3 5'}
          />
          <Tx x={sx(i)} y={AX_Y2 + 12} s={i} cls="tx-sm" anchor="middle" />
        </g>
      ))}

      {/* 区间条 */}
      {ACT.map((row, i) => {
        const y = ROWY + i * ROWH;
        const isSel = f.A.indexOf(row[0]) >= 0;
        const hot = f.cur === row[0];
        let fill = 'var(--c-cell-idle)';
        let stroke = 'var(--hairline)';
        let sw = 1.2;
        if (f.st === 'bad') {
          // 反例帧：用另一套集合着色
          if (isSel) { fill = 'var(--warn-bg)'; stroke = 'var(--c-warn)'; sw = 2.2; }
        } else if (isSel) { fill = 'var(--tip-bg)'; stroke = 'var(--c-ok)'; sw = 2.2; }
        if (hot) { fill = 'var(--warn-bg)'; stroke = 'var(--c-hot)'; sw = 2.6; }
        const x1 = sx(row[1]);
        const x2 = sx(row[2]);
        return (
          <g key={row[0]}>
            <rect
              x={x1}
              y={y - BARH + 4}
              width={Math.max(10, x2 - x1)}
              height={BARH}
              rx={4}
              fill={fill}
              stroke={stroke}
              strokeWidth={sw}
              className="arr-bar"
            />
            <Tx x={(x1 + x2) / 2} y={y + 2} s={row[0]} cls="tx-sm tx-b" anchor="middle" fill={isSel || hot ? 'var(--ink)' : 'var(--ink-2)'} />
          </g>
        );
      })}

      {/* 当前 f_j 的竖线 */}
      {f.j > 0 && (() => {
        const fj = ACT[f.j - 1][2];
        const fx = sx(fj);
        return (
          <g>
            <Seg x1={fx} y1={50} x2={fx} y2={AX_Y2 - 4} color="var(--c-hot)" w={2} dash="5 4" />
            <Tx x={fx + 4} y={50} s={`f_${f.j} = ${fj}`} cls="tx-sm tx-b" anchor="start" fill="var(--c-hot)" />
          </g>
        );
      })()}

      {/* 底部结论 */}
      <Tx
        x={20}
        y={AX_Y2 + 40}
        s="贪心准则：每次选「与已选集合兼容」且「结束时间最早」的活动；判定式 s_i ≥ f_j。"
        cls="tx-sm"
        anchor="start"
      />
      <Tx
        x={20}
        y={AX_Y2 + 60}
        s={`本轮结论：A = {${f.A.length ? f.A.join(', ') : '∅'}}，共 ${f.A.length} 个活动${f.st === 'bad' ? '（这是错误准则的结果，比最优解少 1 个）' : ''}；区间不重叠 ⇒ 两两兼容。`}
        cls="tx-sm tx-b"
        anchor="start"
        fill={f.st === 'bad' ? 'var(--c-warn)' : 'var(--c-accent-2)'}
      />
    </>
  );
}

export const activitySelect: DemoDef<Frame> = { build, View, w: W, h: H };
