/**
 * 插入排序执行过程（PPT 16 元素实例，1 起下标）
 * 伪代码：for j = 2 to A.length { key = A[j]; i = j - 1; while i > 0 and A[i] > key {...}; A[i+1] = key }
 * 移植自 assets/demos-deck2.js 的 insertion-sort
 */
import type { CSSProperties } from 'react';
import type { DemoDef, DemoFrame } from './types';
import { Cells, Ln, PtrDown, PtrUp, Rect, T } from './primitives';

export interface Frame extends DemoFrame {
  tag: string;
  A: number[];
  j: number | null;
  i: number | null;
  key: number | null;
  keyPos: number | null;
  placed: number | null;
  sortedTo: number;
  compares: number;
  code: string;
}

const PPT_ARRAY = [24, 17, 40, 28, 13, 14, 22, 32, 40, 21, 48, 4, 47, 8, 37, 18];
const N = PPT_ARRAY.length;
const CW = 34, CH = 32, GAP = 3, X0 = 26, CY = 58;
const W = X0 * 2 + N * CW + (N - 1) * GAP;
const H = 196;
/** 1 起下标 i 对应的左边界像素 */
const X = (i: number) => X0 + (i - 1) * (CW + GAP);

export function build(): Frame[] {
  const steps: Frame[] = [];
  const A = PPT_ARRAY.slice();
  let sortedTo = 1;
  let compares = 0;

  const snap = (
    tag: string,
    cap: string,
    j: number | null,
    i: number | null,
    key: number | null,
    keyPos: number | null,
    placed: number | null,
    code: string,
  ) => {
    steps.push({ tag, cap, A: A.slice(), j, i, key, keyPos, placed, sortedTo, compares, code });
  };

  snap(
    '初始化',
    '输入数组为 PPT 的 16 元素实例 &lt;24, 17, 40, 28, 13, 14, 22, 32, 40, 21, 48, 4, 47, 8, 37, 18&gt;。' +
      '先认为 A[1] = 24 单独构成已排序区间，j 从 2 开始，每次都把 A[j] 插入左边合适的位置。',
    null, null, null, null, null, 'INSERTION-SORT(A)',
  );

  for (let j = 2; j <= N; j++) {
    const key = A[j - 1];
    let i = j - 1;
    snap(
      '取出 key',
      `第 ${j - 1} 轮：<b>key = A[${j}] = ${key}</b>；j = ${j}，已排序区间是 A[1..${j - 1}]，令 i = j − 1 = ${i}，从右往左扫描。`,
      j, i, key, j, null, `key = A[${j}]`,
    );

    while (i > 0 && A[i - 1] > key) {
      compares++;
      const oldI = i;
      const big = A[oldI - 1];
      A[oldI] = big; // 伪代码：A[i + 1] = A[i]
      i = oldI - 1; // 伪代码：i = i − 1
      snap(
        'A[i] 后移',
        `比较 A[${oldI}] = ${big} &gt; key = ${key}：<b>成立</b>，把 A[${oldI}] 后移到 A[${oldI + 1}]，i 左移到 ${i}。累计元素比较 <b>${compares}</b> 次。`,
        j, i, key, j, null, 'A[i + 1] = A[i];  i = i − 1',
      );
    }

    let stop: string;
    if (i > 0) {
      compares++;
      stop = `比较 A[${i}] = ${A[i - 1]} &gt; key = ${key}：<b>不成立</b>，内层循环结束；`;
    } else {
      stop = 'i 已经减到 0，条件 i &gt; 0 <b>不成立</b>，内层循环结束；';
    }
    A[i] = key; // 伪代码：A[i + 1] = key
    sortedTo = j;
    snap(
      '写入 key',
      `${stop}把 <b>key = ${key} 写入 A[${i + 1}]</b>。已排序区间扩大到 A[1..${j}]。`,
      j, i > 0 ? i : null, key, j, i + 1, 'A[i + 1] = key',
    );
  }

  snap(
    '排序完成',
    '排序结束：&lt;4, 8, 13, 14, 17, 18, 21, 22, 24, 28, 32, 37, 40, 40, 47, 48&gt;，与 PPT 给出的输出完全一致。' +
      `对这份输入，插入排序一共做了 <b>${compares} 次元素比较</b>（n = 16 时最好 15 次、最坏 120 次）。`,
    null, null, null, null, null, 'return A',
  );
  return steps;
}

const dashHot: CSSProperties = {
  fill: 'none',
  stroke: 'var(--c-hot)',
  strokeWidth: 2,
  strokeDasharray: '5 3',
};

function View({ frame: f }: { frame: Frame }) {
  return (
    <>
      <T x={4} y={16} s={f.tag} cls="tx-sm" color="var(--c-accent)" />
      <T x={W / 2} y={16} s={`元素比较 ${f.compares} 次`} cls="tx-sm" anchor="middle" color="var(--c-hot)" />
      <T x={W - 4} y={16} s={`已排序区间 A[1..${f.sortedTo}]`} cls="tx-sm" anchor="end" color="var(--c-ok)" />

      {/* 已排序区间下划线 */}
      <Ln
        x1={X(1)}
        y1={CY + CH + 6}
        x2={X(f.sortedTo) + CW}
        y2={CY + CH + 6}
        style={{ stroke: 'var(--c-ok)', strokeWidth: 3, strokeLinecap: 'round' }}
      />

      {/* 单元格（已排序区间用 st-idle） */}
      <Cells X={X} y={CY} A={f.A} cw={CW} ch={CH} idxBase={1} stOf={(k) => (k + 1 <= f.sortedTo ? 'st-idle' : '')} />

      {/* 高亮叠加（后画在上层，实心底色需重画白字） */}
      {f.i != null && (
        <g>
          <Rect x={X(f.i)} y={CY} w={CW} h={CH} r={4} style={{ fill: 'var(--c-warn)' }} />
          <T x={X(f.i) + CW / 2} y={CY + CH / 2 - 1} s={f.A[f.i - 1]} cls="tx tx-b tx-white" anchor="middle" />
          <T x={X(f.i) + CW / 2} y={CY + CH - 5} s={f.i} cls="tx-sm tx-white" anchor="middle" size="9.5px" />
        </g>
      )}
      {f.placed != null && (
        <g>
          <Rect x={X(f.placed)} y={CY} w={CW} h={CH} r={4} style={{ fill: 'var(--c-ok)' }} />
          <T x={X(f.placed) + CW / 2} y={CY + CH / 2 - 1} s={f.A[f.placed - 1]} cls="tx tx-b tx-white" anchor="middle" />
          <T x={X(f.placed) + CW / 2} y={CY + CH - 5} s={f.placed} cls="tx-sm tx-white" anchor="middle" size="9.5px" />
        </g>
      )}
      {f.keyPos != null && <Rect x={X(f.keyPos) - 2} y={CY - 2} w={CW + 4} h={CH + 4} r={5} style={dashHot} />}

      {/* 指针 */}
      {f.j != null && <PtrDown cx={X(f.j) + CW / 2} tipY={CY - 4} label={`j=${f.j}`} color="var(--c-hot)" />}
      {f.i != null && <PtrUp cx={X(f.i) + CW / 2} tipY={CY + CH + 8} label={`i=${f.i}`} color="var(--c-warn)" />}

      {/* key 浮框 */}
      {f.key != null && (
        <g>
          <Rect x={X0} y={136} w={168} h={30} r={6} style={{ fill: 'var(--c-accent)' }} />
          <T x={X0 + 84} y={156} s={`key = ${f.key}（待插入）`} cls="tx tx-b tx-white" anchor="middle" />
        </g>
      )}

      <T x={W - 4} y={156} s={`当前语句：${f.code}`} cls="tx-sm" anchor="end" color="var(--c-accent-2)" />
      <T
        x={4}
        y={184}
        s="内层循环：while i > 0 and A[i] > key → 后移 A[i] 到 A[i+1] 并让 i 左移；退出后 A[i+1] = key"
        cls="tx-sm"
      />
    </>
  );
}

export const insertionSort: DemoDef<Frame> = { build, View, w: W, h: H };
