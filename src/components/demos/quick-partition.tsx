/**
 * 快速排序 Lomuto 划分（PPT 例子 6 10 13 5 8 3 2 11，p = 0，q = 7，x = A[p] = 6，0 起下标）
 * PARTITION(A, p, q)：x = A[p]; i = p; for j = p+1 to q { if A[j] <= x { i++; swap } } swap A[p], A[i]
 * 移植自 assets/demos-deck2.js 的 quick-partition
 */
import type { CSSProperties } from 'react';
import type { DemoDef, DemoFrame } from './types';
import { Cells, PtrDown, Rect, T } from './primitives';

export interface Frame extends DemoFrame {
  tag: string;
  A: number[];
  i: number | null;
  j: number | null;
  x: number;
  swaps: number;
  p: number;
  q: number;
  ret: number | null;
  hi: [number, number] | null;
}

const ARR = [6, 10, 13, 5, 8, 3, 2, 11];
const N = ARR.length;
const P = 0, Q = N - 1;
const CW = 40, CH = 36, GAP = 5, X0 = 24, CY = 74;
const W = X0 * 2 + N * CW + (N - 1) * GAP;
const H = 232;
/** 0 起下标 i 对应的左边界像素 */
const X = (i: number) => X0 + i * (CW + GAP);

export function build(): Frame[] {
  const steps: Frame[] = [];
  const A = ARR.slice();
  const x = A[P];
  let i = P;
  let swaps = 0;

  const snap = (
    tag: string,
    cap: string,
    ii: number,
    jj: number | null,
    extra?: { ret?: number; hi?: [number, number] },
  ) => {
    steps.push({
      tag,
      cap,
      A: A.slice(),
      i: ii,
      j: jj,
      x,
      swaps,
      p: P,
      q: Q,
      ret: extra?.ret ?? null,
      hi: extra?.hi ?? null,
    });
  };

  snap(
    '初始化',
    '待划分数组 A = [6, 10, 13, 5, 8, 3, 2, 11]，p = 0，q = 7，取基准 <b>x = A[p] = 6</b>。' +
      '令 i = p = 0，表示「≤ x 区间」当前为空；j 从 p + 1 = 1 开始向右扫描。',
    P, P + 1,
  );
  snap(
    '设置 i、j',
    '不变式：A[p+1..i] 都 ≤ x，A[i+1..j−1] 都 &gt; x，A[j..q] 尚未处理。' +
      '此刻 i = 0（≤ x 区间为空）、j = 1（未处理区间是 A[1..7]）。',
    P, P + 1,
  );

  for (let j = P + 1; j <= Q; j++) {
    const v = A[j];
    if (v <= x) {
      i = i + 1;
      const tmp = A[i];
      A[i] = A[j];
      A[j] = tmp;
      swaps++;
      snap(
        'i++ 并交换',
        `j = ${j}：A[${j}] = ${v} &le; x = ${x} → <b>i 自增为 ${i}，交换 A[${i}] &lt;-&gt; A[${j}]</b>。交换后 A[p+1..i] = [${A.slice(P + 1, i + 1).join(', ')}] 都 ≤ x，A[i+1..j] = [${A.slice(i + 1, j + 1).join(', ')}] 都 &gt; x。`,
        i, j, { hi: [i, j] },
      );
    } else {
      snap(
        '不交换',
        `j = ${j}：A[${j}] = ${v} &gt; x = ${x} → 不交换，j 继续右移。≤ x 区间仍是 A[${P + 1}..${i}]，&gt; x 区间扩大到 A[${i + 1}..${j}]。`,
        i, j,
      );
    }
  }

  const t2 = A[P];
  A[P] = A[i];
  A[i] = t2;
  snap(
    '基准归位',
    `j 扫描完 A[8] 后循环结束（此时 i = ${i}）。执行最后一次交换 <b>swap A[p] &lt;-&gt; A[i]，即 A[0] &lt;-&gt; A[${i}]</b>，把基准 x = ${x} 放到它的最终位置 A[${i}]。整个划分共做 ${swaps} 次元素交换。`,
    i, null, { hi: [P, i] },
  );

  snap(
    '返回 i',
    `划分结束：A = [${A.join(', ')}]，返回 <b>i = ${i}</b>。左半部分 A[0..${i - 1}] = [${A.slice(0, i).join(', ')}] 全部 ≤ ${x}，右半部分 A[${i + 1}..7] = [${A.slice(i + 1).join(', ')}] 全部 ≥ ${x}；基准 A[${i}] = ${x} 已在最终位置。`,
    i, null, { ret: i },
  );
  return steps;
}

function stripRect(a: number, b: number | null, barY: number, barH: number, color: string, opacity: number) {
  if (b == null || b < a) return null;
  return (
    <Rect
      x={X(a)}
      y={barY}
      w={X(b) + 40 - X(a)}
      h={barH}
      r={4}
      cls="arr-bar"
      style={{ fill: color, opacity }}
    />
  );
}

function View({ frame: f }: { frame: Frame }) {
  const barY = CY + CH + 8;
  const barH = 9;
  const jEnd = f.j == null ? f.q : f.j - 1;
  const jStart = f.j == null ? f.q + 1 : f.j;
  const warnBox: CSSProperties = { fill: 'none', stroke: 'var(--c-warn)', strokeWidth: 2.5 };
  return (
    <>
      <T x={4} y={16} s={f.tag} cls="tx-sm" color="var(--c-accent)" />
      <T x={W - 4} y={16} s={`基准 x = A[${f.p}] = ${f.x}`} cls="tx-sm" anchor="end" color="var(--c-accent)" />
      <T x={W / 2} y={16} s={`交换 ${f.swaps} 次`} cls="tx-sm" anchor="middle" color="var(--c-hot)" />

      {/* 不变式区间条：≤ x / > x / 未处理 */}
      {stripRect(f.p + 1, f.i, barY, barH, 'var(--c-accent)', 0.75)}
      {f.i != null && f.i >= f.p + 1 && (
        <T x={(X(f.p + 1) + X(f.i) + CW) / 2} y={barY + barH + 16} s="≤ x" cls="tx-sm" anchor="middle" color="var(--c-accent)" />
      )}
      {stripRect((f.i ?? f.p) + 1, jEnd, barY, barH, 'var(--c-warn)', 0.75)}
      {jEnd >= (f.i ?? f.p) + 1 && (
        <T x={(X((f.i ?? f.p) + 1) + X(jEnd) + CW) / 2} y={barY + barH + 16} s="> x" cls="tx-sm" anchor="middle" color="var(--c-warn)" />
      )}
      {stripRect(jStart, f.q, barY, barH, 'var(--ink-2)', 0.45)}
      {f.q >= jStart && (
        <T x={(X(jStart) + X(f.q) + CW) / 2} y={barY + barH + 16} s="未处理" cls="tx-sm" anchor="middle" color="var(--ink-2)" />
      )}

      <Cells
        X={X}
        y={CY}
        A={f.A}
        cw={CW}
        ch={CH}
        idxBase={0}
        stOf={(k) => {
          if (k === f.p) return 'st-pivot';
          if (f.hi && (k === f.hi[0] || k === f.hi[1])) return 'st-active';
          if (k >= f.p + 1 && k <= (f.i ?? f.p)) return 'st-idle';
          return '';
        }}
      />
      {f.j != null && <Rect x={X(f.j) - 2} y={CY - 2} w={CW + 4} h={CH + 4} r={5} style={warnBox} />}

      {f.i != null && <PtrDown cx={X(f.i) + CW / 2} tipY={CY - 6} label={`i=${f.i}`} color="var(--c-hot)" />}
      {f.j != null && <PtrDown cx={X(f.j) + CW / 2} tipY={CY - 6} label={`j=${f.j}`} color="var(--c-warn)" />}

      <T
        x={4}
        y={150}
        s="划分函数 PARTITION(A, p, q)：x = A[p]; i = p; for j = p+1 to q { if A[j] ≤ x { i++; swap A[i],A[j] } }"
        cls="tx-sm"
      />
      <T x={4} y={168} s="最后 swap A[p], A[i] 并 return i" cls="tx-sm" />
      <T
        x={W - 4}
        y={168}
        s={f.ret != null ? `本次划分返回值 i = ${f.ret}` : '扫描区间 A[p+1..q] = A[1..7]'}
        cls="tx-sm"
        anchor="end"
        color={f.ret != null ? 'var(--c-ok)' : 'var(--ink-2)'}
      />
      <T
        x={4}
        y={200}
        s={`说明：题给例子用 0 起下标，p = 0、q = 7；划分后基准落在 A[${f.ret ?? f.i}]`}
        cls="tx-sm"
      />
    </>
  );
}

export const quickPartition: DemoDef<Frame> = { build, View, w: W, h: H };
