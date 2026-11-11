/**
 * 二分查找：在 3 5 7 8 9 12 15 中查找 9，low/mid/high 收窄过程（10 帧）
 * 移植自 assets/demos-deck6.js 的 binary-search
 */
import type { DemoDef, DemoFrame } from './types';
import { T6 } from './deck6-helpers';

export interface Frame extends DemoFrame {
  low: number;
  high: number;
  /** 当前 mid（0 表示无） */
  mid: number;
  /** 找到的下标（0 表示未找到） */
  found: number;
  /** 已比较次数 */
  cmp: number;
  log: string[];
}

const W = 760, H = 340;
const A = [3, 5, 7, 8, 9, 12, 15]; // PPT 例子的有序数组（下标 1..7）
const X0 = 90, CELL_W = 74, GAP = 10, CELL_Y = 88, CELL_H = 54;
/** 第 i 个格子（i 从 1 开始）的左上角 x */
const cellX = (i: number) => X0 + (i - 1) * (CELL_W + GAP);

const stripPrefix = (s: string) => s.replace(/^第 \d+ \/ \d+ 步：/, '');

export function build(): Frame[] {
  const raw: Array<Omit<Frame, 'cap'> & { cap: string }> = [
    {
      low: 1, high: 7, mid: 0, found: 0, cmp: 0,
      log: ['目标 x = 9，当前区间 [1..7]，共 7 个元素'],
      cap: '在有序数组 A[1..7] = 3 5 7 8 9 12 15 中查找 9。初始区间 low = 1、high = 7，还没有比较过任何元素。',
    },
    {
      low: 1, high: 7, mid: 4, found: 0, cmp: 1,
      log: ['mid = ⌊(1+7)/2⌋ = 4，取 A[4] = 8', '8 < 9 ⇒ 答案只可能在右半'],
      cap: 'mid = ⌊(low+high)/2⌋ = ⌊(1+7)/2⌋ = 4，取 A[4] = 8；因为 8 < 9，答案只可能在右半，第 1 次比较结束。',
    },
    {
      low: 5, high: 7, mid: 0, found: 0, cmp: 1,
      log: ['丢弃 A[1..4]（3 5 7 8，共 4 个）', '新区间 [5..7]，剩 3 个元素'],
      cap: '舍弃左半 A[1..4]（3、5、7、8 共 4 个元素，含刚比过的 A[4]），区间收缩为 low = 5、high = 7，只剩 3 个元素 9 12 15。',
    },
    {
      low: 5, high: 7, mid: 6, found: 0, cmp: 2,
      log: ['mid = ⌊(5+7)/2⌋ = 6，取 A[6] = 12', '12 > 9 ⇒ 答案只可能在左半'],
      cap: 'mid = ⌊(5+7)/2⌋ = 6，A[6] = 12；因为 12 > 9，答案只可能在左半，第 2 次比较结束。',
    },
    {
      low: 5, high: 5, mid: 0, found: 0, cmp: 2,
      log: ['丢弃 A[6..7]（12 15）', '新区间 [5..5]，剩 1 个元素'],
      cap: '舍弃右半 A[6..7]（12、15），区间收缩为 low = 5、high = 5，只剩 A[5] = 9 一个元素。',
    },
    {
      low: 5, high: 5, mid: 5, found: 5, cmp: 3,
      log: ['mid = ⌊(5+5)/2⌋ = 5，取 A[5] = 9', '9 = 9 ⇒ 找到，返回下标 5'],
      cap: 'mid = ⌊(5+5)/2⌋ = 5，A[5] = 9 正好等于目标 9 —— 查找成功，返回下标 5，全程只用了 3 次比较。',
    },
    {
      low: 5, high: 5, mid: 5, found: 5, cmp: 3,
      log: ['比较次数 = 3 次', '递归式：T(n) = 1·T(n/2) + Θ(1)'],
      cap: '整个过程只递归了 3 层、比较 3 次；写成递归式是 T(n) = 1·T(n/2) + Θ(1)，其中 1 是子问题个数、n/2 是子问题规模、Θ(1) 是“检查中间元素”的代价。',
    },
    {
      low: 5, high: 5, mid: 5, found: 5, cmp: 3,
      log: ['a = 1，b = 2，f(n) = Θ(1)', 'n^(log_2 1) = n^0 = 1 = Θ(f(n))'],
      cap: '套主方法 —— a = 1、b = 2，于是 n^(log_b a) = n^(log_2 1) = n^0 = 1，它与 f(n) = Θ(1) 同阶，属于第 2 种情况，故 T(n) = Θ(n^0 · lg n) = Θ(lg n)。',
    },
    {
      low: 5, high: 5, mid: 5, found: 5, cmp: 3,
      log: ['最坏比较次数 = ⌊lg n⌋ + 1', 'n = 7：⌊lg 7⌋ + 1 = 2 + 1 = 3 次'],
      cap: '最坏情况下区间每次减半，比较次数不超过 ⌊lg n⌋ + 1；n = 7 时 ⌊lg 7⌋ + 1 = 2 + 1 = 3 次，本例的 3 次就是最坏情况；而顺序查找最坏要 7 次。',
    },
    {
      low: 5, high: 5, mid: 5, found: 5, cmp: 3,
      log: ['前提 1：数组必须有序', '前提 2：能随机访问中间元素（顺序存储）'],
      cap: '二分查找的两个前提 —— ① 数组必须有序（无序要先排序，代价 O(n lg n)）；② 必须能 O(1) 随机访问中间元素，所以只适合数组、不适合链表。',
    },
  ];
  return raw.map(({ cap, ...rest }) => ({ ...rest, cap: stripPrefix(cap) }));
}

function View({ frame: fr }: { frame: Frame }) {
  return (
    <>
      {/* 顶部状态行 */}
      <T6
        x={36}
        y={32}
        cls="tx-b"
        s={`low = ${fr.low}    high = ${fr.high}    mid = ${fr.mid === 0 ? '—' : fr.mid}    已比较 ${fr.cmp} 次`}
      />

      {/* low / high 指针标记 + 当前区间条 */}
      {fr.low <= fr.high && (
        <>
          <T6 x={cellX(fr.low) + CELL_W / 2} y={CELL_Y - 30} anchor="middle" cls="tx-sm" fill="var(--c-accent)" s="low" />
          <T6 x={cellX(fr.high) + CELL_W / 2} y={CELL_Y - 30} anchor="middle" cls="tx-sm" fill="var(--c-accent)" s="high" />
          <rect
            x={cellX(fr.low)}
            y={CELL_Y - 16}
            width={(fr.high - fr.low + 1) * (CELL_W + GAP) - GAP}
            height={8}
            rx={4}
            fill="var(--c-accent)"
          />
        </>
      )}

      {/* 7 个格子 */}
      {[1, 2, 3, 4, 5, 6, 7].map((i) => {
        const x = cellX(i);
        const inRange = i >= fr.low && i <= fr.high;
        const isMid = i === fr.mid;
        const isFound = i === fr.found;
        return (
          <g key={i}>
            <rect
              x={x}
              y={CELL_Y}
              width={CELL_W}
              height={CELL_H}
              rx={6}
              fill={isFound ? 'var(--c-tip-bg)' : isMid ? 'var(--c-warn-bg)' : inRange ? 'var(--c-key-bg)' : 'var(--c-panel-2)'}
              stroke={isFound ? 'var(--c-ok)' : isMid ? 'var(--c-hot)' : inRange ? 'var(--c-accent)' : 'var(--c-line)'}
              strokeWidth={isMid || isFound ? 2.6 : 1.4}
            />
            <T6 x={x + CELL_W / 2} y={CELL_Y + 35} anchor="middle" cls={`tx${isMid || isFound ? ' tx-b' : ''}`} s={A[i - 1]} />
            <T6 x={x + CELL_W / 2} y={CELL_Y + CELL_H + 20} anchor="middle" cls="tx-sm" s={`A[${i}]`} />
          </g>
        );
      })}

      {/* mid 指针 */}
      {fr.mid > 0 && (
        <T6 x={cellX(fr.mid) + CELL_W / 2} y={CELL_Y + CELL_H + 44} anchor="middle" cls="tx-sm" fill="var(--c-hot)" s="mid" />
      )}

      {/* 比较日志 */}
      {fr.log.map((line, i) => (
        <T6 key={i} x={90} y={222 + i * 26} cls="tx-sm" s={`· ${line}`} />
      ))}

      {/* 找到时的结论 / 否则给递归式提示 */}
      {fr.found > 0 ? (
        <T6
          x={90}
          y={306}
          cls="tx tx-b"
          fill="var(--c-ok)"
          s={`查找成功：A[5] = 9 = 目标，返回下标 ${fr.found}，比较 ${fr.cmp} 次`}
        />
      ) : (
        <T6 x={90} y={306} cls="tx-sm" s="T(n) = 1·T(n/2) + Θ(1)，n^(log_2 1) = n^0 = 1 ⇒ T(n) = Θ(lg n)" />
      )}
    </>
  );
}

export const binarySearch: DemoDef<Frame> = { build, View, w: W, h: H };
