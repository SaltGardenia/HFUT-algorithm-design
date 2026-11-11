/**
 * 插入排序伪代码逐行计数 → T(n) = 3n²/2 + 7n/2 − 4
 * 7 行计数：n, n−1, n−1, Σj, Σ(j−1), Σ(j−1), n−1
 * 移植自 assets/demos-deck2.js 的 count-insertion
 */
import type { DemoDef, DemoFrame } from './types';
import { Ln, Rect, T } from './primitives';

export interface Frame extends DemoFrame {
  tag: string;
  upto: number;
  hl: number;
  sum1: boolean;
  sum2: boolean;
  n16: boolean;
  theta: boolean;
}

const W = 700, H = 420, LY = 92, LH = 30;

const CODE = [
  'for j = 2 to A.length',
  '    key = A[j]',
  '    i = j − 1',
  '    while i > 0 and A[i] > key',
  '        A[i + 1] = A[i]',
  '        i = i − 1',
  '    A[i + 1] = key',
];
const CNT = [
  'n 次',
  'n − 1 次',
  'n − 1 次',
  'Σ(j = 2..n) j 次',
  'Σ(j = 2..n) (j − 1) 次',
  'Σ(j = 2..n) (j − 1) 次',
  'n − 1 次',
];

export function build(): Frame[] {
  const steps: Frame[] = [];
  const snap = (tag: string, cap: string, upto: number, hl: number, flags?: Partial<Record<'sum1' | 'sum2' | 'n16' | 'theta', boolean>>) => {
    steps.push({ tag, cap, upto, hl, sum1: !!flags?.sum1, sum2: !!flags?.sum2, n16: !!flags?.n16, theta: !!flags?.theta });
  };

  snap(
    '逐行计数',
    '把插入排序最坏情况下的每一行伪代码都数一遍执行次数，并假定每个基本操作（+ − × ÷ 与 ≔ &gt; &lt; =）的代价都是 1。' +
      '外层循环变量写成 j，第 4 行 while 的判定次数是 Σ(j = 2..n) j。',
    -1, -1,
  );
  snap(
    '第 1 行',
    '第 1 行 <code>for j = 2 to A.length</code>：j 取 2, 3, …, n 共 <b>n − 1</b> 次循环，加上最后一次不成立的条件判定，共执行 <b>n 次</b>。',
    0, 0,
  );
  snap(
    '第 2 行',
    '第 2 行 <code>key = A[j]</code>：每次进入循环体取一次待插入的关键字，共 <b>n − 1 次</b>。注意下标是 j = 2, 3, …, n。',
    1, 1,
  );
  snap(
    '第 3 行',
    '第 3 行 <code>i = j − 1</code>：每次都把 j − 1 赋给 i，共 <b>n − 1 次</b>（一次赋值代价为 1）。',
    2, 2,
  );
  snap(
    '第 4 行',
    '第 4 行 <code>while i &gt; 0 and A[i] &gt; key</code>：第 j 轮要做 j 次判定（含最后一次不成立），总数 = 2 + 3 + … + n = Σ(j = 2..n) j = <b>n(n + 1)/2 − 1 次</b>。',
    3, 3,
  );
  snap(
    '第 5 行',
    '第 5 行 <code>A[i + 1] = A[i]</code>：第 j 轮最多后移 j − 1 个元素，总数 = 1 + 2 + … + (n − 1) = Σ(j = 2..n)(j − 1) = <b>n(n − 1)/2 次</b>，这正是最坏情况的元素比较次数。',
    4, 4,
  );
  snap(
    '第 6 行',
    '第 6 行 <code>i = i − 1</code>：每后移一个元素就左移一次，次数与第 5 行相同，为 <b>n(n − 1)/2 次</b>。',
    5, 5,
  );
  snap(
    '第 7 行',
    '第 7 行 <code>A[i + 1] = key</code>：每轮插入最后落位一次，共 <b>n − 1 次</b>。至此 7 行次数全部标出。',
    6, 6,
  );
  snap(
    '求和',
    '把 7 行次数相加：T(n) = n + (n − 1) + (n − 1) + [n(n + 1)/2 − 1] + n(n − 1)/2 + n(n − 1)/2 + (n − 1)。',
    6, -1, { sum1: true },
  );
  snap(
    '化简',
    '合并同类项：n + 3(n − 1) = 4n − 3，Σ 部分 = n(n + 1)/2 − 1 + n(n − 1) = 3n²/2 − n/2 − 1，所以 <b>T(n) = 3n²/2 + 7n/2 − 4</b>，与 PPT 的结论一致。',
    6, -1, { sum1: true, sum2: true },
  );
  snap(
    '代入 n = 16',
    '拿 PPT 的 16 元素实例验证：n = 16 时 T(16) = 3 × 256/2 + 7 × 16/2 − 4 = 384 + 56 − 4 = <b>436</b> 次基本操作，其中元素比较最坏为 n(n − 1)/2 = <b>120 次</b>（最好情况只要 n − 1 = 15 次）。',
    6, -1, { sum1: true, sum2: true, n16: true },
  );
  snap(
    '结论',
    'T(n) = 3n²/2 + 7n/2 − 4 中最高阶项是 n²，忽略系数与低阶项后 <b>T(n) = Θ(n²)</b>；因此插入排序的时间复杂度为 O(n²)。同理可数出选择排序 T(n) = 2n² + 3n − 4 = Θ(n²)。',
    6, -1, { sum1: true, sum2: true, n16: true, theta: true },
  );
  return steps;
}

function View({ frame: f }: { frame: Frame }) {
  const baseY = LY + CODE.length * LH + 22;
  return (
    <>
      <T x={24} y={30} s="INSERTION-SORT(A) 逐行计数（每个基本操作代价 = 1）" cls="tx tx-b" color="var(--c-accent)" />
      <T x={W - 24} y={30} s={f.tag} cls="tx-sm" anchor="end" color="var(--c-hot)" />

      {CODE.map((line, k) => {
        const y = LY + k * LH;
        return (
          <g key={k}>
            {k === f.hl && <Rect x={40} y={y - 19} w={W - 80} h={LH - 4} r={6} style={{ fill: 'var(--c-accent)', opacity: 0.13 }} />}
            <T x={56} y={y} s={k + 1} cls="tx-sm" anchor="end" color="var(--ink-2)" />
            <T x={68} y={y} s={line} cls="tx" />
            {k <= f.upto ? (
              <T x={W - 56} y={y} s={CNT[k]} cls="tx tx-b" anchor="end" color="var(--c-hot)" />
            ) : (
              <T x={W - 56} y={y} s="?" cls="tx-sm" anchor="end" color="var(--ink-2)" />
            )}
          </g>
        );
      })}

      <Ln x1={40} y1={baseY - 24} x2={W - 40} y2={baseY - 24} style={{ stroke: 'var(--hairline)', strokeDasharray: '5 5' }} />

      {f.sum1 && (
        <T
          x={48}
          y={baseY}
          s="T(n) = n + (n − 1) + (n − 1) + [n(n + 1)/2 − 1] + n(n − 1)/2 + n(n − 1)/2 + (n − 1)"
          cls="tx"
        />
      )}
      {f.sum2 && <T x={48} y={baseY + 32} s="        = 3n²/2 + 7n/2 − 4" cls="tx tx-b" color="var(--c-accent)" />}
      {f.n16 && (
        <T
          x={48}
          y={baseY + 64}
          s="n = 16 时：T(16) = 3 × 256/2 + 7 × 16/2 − 4 = 436 次基本操作（元素比较最坏 120 次）"
          cls="tx-sm"
          color="var(--c-ok)"
        />
      )}
      {f.theta && (
        <T x={48} y={baseY + 96} s="忽略系数与低阶项，只保留最高阶项：T(n) = Θ(n²)" cls="tx tx-b" color="var(--c-hot)" />
      )}
    </>
  );
}

export const countInsertion: DemoDef<Frame> = { build, View, w: W, h: H };
