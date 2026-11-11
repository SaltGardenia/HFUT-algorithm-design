/**
 * 选择排序执行过程（PPT 16 元素实例，cur_min / cur_min_pos，1 起下标）
 * 伪代码：for i = 1 to A.length-1 { cur_min = A[i]; for j = i+1 to A.length if A[j] < cur_min ...; swap }
 * 移植自 assets/demos-deck2.js 的 selection-sort
 */
import type { CSSProperties } from 'react';
import type { DemoDef, DemoFrame } from './types';
import { Cells, Ln, PtrDown, PtrUp, Rect, T } from './primitives';

export interface Frame extends DemoFrame {
  tag: string;
  A: number[];
  i: number | null;
  j: number | null;
  curMin: number | null;
  curMinPos: number | null;
  swapped: [number, number] | null;
  sortedTo: number;
  compares: number;
  code: string;
}

const PPT_ARRAY = [24, 17, 40, 28, 13, 14, 22, 32, 40, 21, 48, 4, 47, 8, 37, 18];
const N = PPT_ARRAY.length;
const CW = 34, CH = 32, GAP = 3, X0 = 26, CY = 58;
const W = X0 * 2 + N * CW + (N - 1) * GAP;
const H = 200;
const X = (i: number) => X0 + (i - 1) * (CW + GAP);

export function build(): Frame[] {
  const steps: Frame[] = [];
  const A = PPT_ARRAY.slice();
  let sortedTo = 0;
  let compares = 0;

  const snap = (
    tag: string,
    cap: string,
    i: number | null,
    j: number | null,
    curMin: number | null,
    curMinPos: number | null,
    swapped: [number, number] | null,
    code: string,
  ) => {
    steps.push({ tag, cap, A: A.slice(), i, j, curMin, curMinPos, swapped, sortedTo, compares, code });
  };

  snap(
    '初始化',
    '输入数组与插入排序相同：&lt;24, 17, 40, 28, 13, 14, 22, 32, 40, 21, 48, 4, 47, 8, 37, 18&gt;。' +
      '已排序区间为空，第 i 次遍历要在未排序区间 A[i..16] 中找出第 i 小的元素，放到 A[i]。',
    null, null, null, null, null, 'SELECTION-SORT(A)',
  );

  for (let i = 1; i <= N - 1; i++) {
    let curMin = A[i - 1];
    let curMinPos = i;
    snap(
      '初始化 cur_min',
      `第 ${i} 次遍历：<b>cur_min = A[${i}] = ${curMin}，cur_min_pos = ${i}</b>；j 从 i + 1 = ${i + 1} 开始扫描未排序区间 A[${i}..${N}]。`,
      i, i + 1, curMin, curMinPos, null, 'cur_min = A[i];  cur_min_pos = i',
    );

    for (let j = i + 1; j <= N; j++) {
      compares++;
      const v = A[j - 1];
      const prevMin = curMin;
      const upd = v < curMin;
      if (upd) {
        curMin = v;
        curMinPos = j;
      }
      snap(
        upd ? '更新 cur_min' : '扫描 j',
        `j = ${j}：比较 A[${j}] = ${v}${upd ? ' &lt; ' : ' &ge; '}cur_min = ${prevMin} → ${
          upd
            ? `<b>更新 cur_min = ${v}，cur_min_pos = ${j}</b>`
            : `不更新，cur_min 仍是 ${curMin}（位置 ${curMinPos}）`
        }。累计比较 ${compares} 次。`,
        i, j, curMin, curMinPos, null, 'if A[j] < cur_min',
      );
    }

    const old = A[i - 1];
    A[i - 1] = A[curMinPos - 1];
    A[curMinPos - 1] = old;
    sortedTo = i;
    snap(
      '交换',
      `本次扫描结束：最小值是 A[${curMinPos}] = ${A[i - 1]}（cur_min_pos = ${curMinPos}），执行 <b>swap A[${i}] &lt;-&gt; A[${curMinPos}]</b>，A[${i}] = ${A[i - 1]} 归位。已排序区间扩大为 A[1..${i}]。`,
      i, null, A[i - 1], i, [i, curMinPos], 'swap A[i], A[cur_min_pos]',
    );
  }

  snap(
    '排序完成',
    'i 枚举到 n − 1 = 15 后循环结束，数组已升序：&lt;4, 8, 13, 14, 17, 18, 21, 22, 24, 28, 32, 37, 40, 40, 47, 48&gt;，' +
      `与 PPT 输出一致。比较次数 = 15 + 14 + … + 1 = n(n − 1)/2 = <b>${compares} 次</b>（与输入实例无关）。`,
    null, null, null, null, null, 'return A',
  );
  return steps;
}

function View({ frame: f }: { frame: Frame }) {
  const dashAccent: CSSProperties = {
    fill: 'none',
    stroke: 'var(--c-accent)',
    strokeWidth: 2.5,
    strokeDasharray: '5 3',
  };
  const dashBoundary: CSSProperties = { stroke: 'var(--c-ok)', strokeWidth: 2, strokeDasharray: '6 4' };
  return (
    <>
      <T x={4} y={16} s={f.tag} cls="tx-sm" color="var(--c-accent)" />
      <T x={W / 2} y={16} s={`元素比较 ${f.compares} 次`} cls="tx-sm" anchor="middle" color="var(--c-hot)" />
      <T
        x={W - 4}
        y={16}
        s={f.sortedTo === 0 ? '已排序区间：空' : `已排序 A[1..${f.sortedTo}]`}
        cls="tx-sm"
        anchor="end"
        color="var(--c-ok)"
      />

      {/* 已排序 / 未排序分界线 */}
      {f.sortedTo >= 1 && f.sortedTo < N && (
        <>
          <Ln x1={X(f.sortedTo + 1) - GAP / 2} y1={CY - 12} x2={X(f.sortedTo + 1) - GAP / 2} y2={CY + CH + 14} style={dashBoundary} />
          <T x={X(f.sortedTo + 1) - GAP / 2 - 6} y={CY + CH + 28} s="已排序" cls="tx-sm" anchor="end" color="var(--c-ok)" />
          <T x={X(f.sortedTo + 1) - GAP / 2 + 6} y={CY + CH + 28} s="未排序" cls="tx-sm" anchor="start" color="var(--ink-2)" />
        </>
      )}

      <Cells X={X} y={CY} A={f.A} cw={CW} ch={CH} idxBase={1} stOf={(k) => (k + 1 <= f.sortedTo ? 'st-visited' : '')} />
      {f.curMinPos != null && (
        <Rect x={X(f.curMinPos) - 2} y={CY - 2} w={CW + 4} h={CH + 4} r={5} style={dashAccent} />
      )}
      {f.swapped ? (
        <Rect
          x={X(f.swapped[0]) - 3}
          y={CY - 3}
          w={CW + 6}
          h={CH + 6}
          r={5}
          style={{ fill: 'none', stroke: 'var(--c-hot)', strokeWidth: 2.5 }}
        />
      ) : (
        f.j != null && (
          <g>
            <Rect x={X(f.j)} y={CY} w={CW} h={CH} r={4} style={{ fill: 'var(--c-warn)' }} />
            <T x={X(f.j) + CW / 2} y={CY + CH / 2 - 1} s={f.A[f.j - 1]} cls="tx tx-b tx-white" anchor="middle" />
            <T x={X(f.j) + CW / 2} y={CY + CH - 5} s={f.j} cls="tx-sm tx-white" anchor="middle" size="9.5px" />
          </g>
        )
      )}

      {f.i != null && <PtrDown cx={X(f.i) + CW / 2} tipY={CY - 4} label={`i=${f.i}`} color="var(--c-hot)" />}
      {f.j != null && <PtrUp cx={X(f.j) + CW / 2} tipY={CY + CH + 44} label={`j=${f.j}`} color="var(--c-warn)" />}

      {f.curMin != null && (
        <g>
          <Rect x={X0} y={146} w={246} h={30} r={6} style={{ fill: 'var(--c-accent)' }} />
          <T
            x={X0 + 123}
            y={166}
            s={`cur_min = ${f.curMin}   cur_min_pos = ${f.curMinPos}`}
            cls="tx tx-b tx-white"
            anchor="middle"
          />
        </g>
      )}
      <T x={W - 4} y={166} s={`当前语句：${f.code}`} cls="tx-sm" anchor="end" color="var(--c-accent-2)" />
      <T
        x={4}
        y={190}
        s="每次遍历只记录最小值及其位置，扫描结束后才做一次交换：共 n − 1 次交换"
        cls="tx-sm"
      />
    </>
  );
}

export const selectionSort: DemoDef<Frame> = { build, View, w: W, h: H };
