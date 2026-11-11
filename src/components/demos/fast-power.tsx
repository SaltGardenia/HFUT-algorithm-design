/**
 * 求幂 x^20：20→10→5→2→1 分解 + 自底向上回代，对照 19 次 vs 5 次乘法（12 帧）
 * 移植自 assets/demos-deck6.js 的 fast-power
 */
import type { ReactNode } from 'react';
import type { DemoDef, DemoFrame } from './types';
import { ArrowDown, ArrowUp, Panel, T6 } from './deck6-helpers';

export type EdgeState = 'idle' | 'down' | 'up' | 'warn';

export interface Frame extends DemoFrame {
  title: string;
  /** 当前活动节点下标，-1 表示无 */
  active: number;
  /** 4 条边的状态 */
  edges: EdgeState[];
  /** 已累计的乘法次数 */
  mul: number;
  /** 右栏回代清单 */
  rows: string[];
  /** 对比大字（'' 表示无） */
  big: string;
}

const W = 760, H = 440;
const NODE_X = 26, NODE_W = 118, NODE_H = 44;
const NODE_Y = [64, 134, 204, 274, 344];
const MID = NODE_X + NODE_W / 2;
const RX = 322, RW = 408;

const LABEL = ['x^20', 'x^10', 'x^5', 'x^2', 'x^1'];
const DOWN_TAG = ['÷2', '÷2', '÷2', '÷2'];
const UP_TAG = ['+1', '+1', '+2', '+1'];

const stripPrefix = (s: string) => s.replace(/^第 \d+ \/ \d+ 步：/, '');

export function build(): Frame[] {
  const raw: Array<Omit<Frame, 'cap'> & { cap: string }> = [
    {
      title: '目标：计算 x^20（n = 20）',
      active: -1, edges: ['idle', 'idle', 'idle', 'idle'], mul: 0, rows: [], big: '',
      cap: '目标 x^20。简单算法把 x 自乘 19 次：x^20 = x·x·…·x，共 n−1 = 19 次乘法、Θ(n) 时间。下面看分治怎么做。',
    },
    {
      title: '分解①：20 是偶数 → 先算 x^10',
      active: 0, edges: ['down', 'idle', 'idle', 'idle'], mul: 0, rows: [], big: '',
      cap: '20 是偶数，x^20 = (x^10)^2 —— 只递归求 x^10 这一个子问题，回代时再做 1 次平方。子问题规模从 20 变成 10。',
    },
    {
      title: '分解②：10 是偶数 → 先算 x^5',
      active: 1, edges: ['down', 'down', 'idle', 'idle'], mul: 0, rows: [], big: '',
      cap: '10 也是偶数，x^10 = (x^5)^2，子问题规模 10 → 5；两次分解一共只产生 1 个递归分支（不是 2 个）。',
    },
    {
      title: '分解③：5 是奇数 → x^2 与一个额外的 x',
      active: 2, edges: ['down', 'down', 'down', 'idle'], mul: 0, rows: [], big: '',
      cap: '5 是奇数，x^5 = (x^2)^2 · x，其中 (5−1)/2 = 2，回代时要做 2 次乘法（一次平方 + 一次乘 x）。',
    },
    {
      title: '分解④：2 是偶数 → x^1',
      active: 3, edges: ['down', 'down', 'down', 'down'], mul: 0, rows: [], big: '',
      cap: '2 是偶数，x^2 = (x^1)^2，子问题规模 2 → 1，分解链条是 20 → 10 → 5 → 2 → 1，一共 4 层。',
    },
    {
      title: '边界条件：x^1 = x，0 次乘法',
      active: 4, edges: ['down', 'down', 'down', 'down'], mul: 0, rows: [], big: '',
      cap: '递归到底 —— 边界条件 x^1 = x 直接返回，不做任何乘法（累计 0 次）。递归式 T(n) = T(⌊n/2⌋) + Θ(1)，深度只有 ⌊lg 20⌋ = 4 层。',
    },
    {
      title: '回代①：x^2 = x·x，+1 次',
      active: 3, edges: ['down', 'down', 'down', 'up'], mul: 1,
      rows: ['x^2 = x·x            +1 次 → 累计 1'], big: '',
      cap: '自底向上回代 —— 已知 x^1 = x，平方一次得到 x^2，乘法 +1，累计 1 次。',
    },
    {
      title: '回代②：x^5 = (x^2)^2·x，+2 次',
      active: 2, edges: ['down', 'down', 'up', 'up'], mul: 3,
      rows: ['x^2 = x·x            +1 次 → 累计 1', 'x^5 = (x^2)^2·x       +2 次 → 累计 3'], big: '',
      cap: 'x^5 = (x^2)^2 · x 需要 2 次乘法（平方 1 次 + 乘 x 1 次），累计 1 + 2 = 3 次。奇数这一层是唯一多花一次的地方。',
    },
    {
      title: '回代③：x^10 = (x^5)^2，+1 次',
      active: 1, edges: ['down', 'up', 'up', 'up'], mul: 4,
      rows: ['x^2 = x·x            +1 次 → 累计 1', 'x^5 = (x^2)^2·x       +2 次 → 累计 3', 'x^10 = (x^5)^2        +1 次 → 累计 4'], big: '',
      cap: 'x^10 = (x^5)^2，再做 1 次平方，累计 3 + 1 = 4 次。',
    },
    {
      title: '回代④：x^20 = (x^10)^2，+1 次',
      active: 0, edges: ['up', 'up', 'up', 'up'], mul: 5,
      rows: ['x^2 = x·x            +1 次 → 累计 1', 'x^5 = (x^2)^2·x       +2 次 → 累计 3', 'x^10 = (x^5)^2        +1 次 → 累计 4', 'x^20 = (x^10)^2       +1 次 → 累计 5'], big: '',
      cap: 'x^20 = (x^10)^2，最后 1 次平方，累计 4 + 1 = 5 次 —— 分治法算 x^20 只需 5 次乘法，不是 20 次、也不是 19 次。',
    },
    {
      title: '对照：19 次 vs 5 次',
      active: 0, edges: ['up', 'up', 'up', 'up'], mul: 5,
      rows: ['x^2 = x·x            +1 次 → 累计 1', 'x^5 = (x^2)^2·x       +2 次 → 累计 3', 'x^10 = (x^5)^2        +1 次 → 累计 4', 'x^20 = (x^10)^2       +1 次 → 累计 5'], big: '19 → 5',
      cap: '简单算法 19 次乘法，分治 5 次乘法，省下 14 次（约 3.8 倍）。' +
        '通式：⌊lg n⌋ 次平方 + (n 的二进制中 1 的个数 − 1) 次乘法 = 4 + 1 = 5；T(n) = T(n/2) + Θ(1) ⇒ T(n) = Θ(lg n)。',
    },
    {
      title: '易错：不能写成两次递归调用',
      active: -1, edges: ['warn', 'warn', 'warn', 'warn'], mul: 5,
      rows: ['错误：t * power(x, n/2) 把 x^(n/2) 算了两遍'], big: 'Θ(n) ✗',
      cap: '如果把 (x^(n/2)) 写成两次递归调用 power(x,n/2)*power(x,n/2)，递归式就退化成 T(n) = 2T(n/2) + Θ(1) = Θ(n)，一次也没省；' +
        '必须像本页伪代码那样，先把 x^⌊n/2⌋ 存进变量再平方。',
    },
  ];
  return raw.map(({ cap, ...rest }) => ({ ...rest, cap: stripPrefix(cap) }));
}

function edgeColor(edge: EdgeState): string {
  return edge === 'down'
    ? 'var(--c-hot)'
    : edge === 'up'
      ? 'var(--c-ok)'
      : edge === 'warn'
        ? 'var(--c-warn)'
        : 'var(--c-line)';
}

function edgeTextFill(edge: EdgeState): string {
  return edge === 'idle'
    ? 'var(--c-ink-soft)'
    : edge === 'up'
      ? 'var(--c-ok)'
      : edge === 'warn'
        ? 'var(--c-warn)'
        : 'var(--c-hot)';
}

function View({ frame: fr }: { frame: Frame }) {
  const edges: ReactNode[] = [];
  /* 4 条边（先画线，节点后画可盖住线头） */
  for (let i = 0; i < 4; ++i) {
    const edge = fr.edges[i];
    const color = edgeColor(edge);
    edges.push(
      <g key={`e${i}`}>
        {edge === 'up' ? (
          <ArrowUp x={MID} y1={NODE_Y[i + 1]} y2={NODE_Y[i] + NODE_H} color={color} />
        ) : (
          <ArrowDown x={MID} y1={NODE_Y[i] + NODE_H} y2={NODE_Y[i + 1]} color={color} />
        )}
        <T6
          x={MID + 10}
          y={NODE_Y[i] + NODE_H + 19}
          cls="tx-sm"
          fill={edgeTextFill(edge)}
          s={edge === 'up' || edge === 'warn' ? UP_TAG[i] : DOWN_TAG[i]}
        />
      </g>,
    );
  }

  /* 5 个节点：当前节点红、已回代完的子问题绿、路径上的祖先蓝、未到达灰 */
  const nodes: ReactNode[] = [];
  for (let i = 0; i < 5; ++i) {
    let fill: string, stroke: string;
    if (fr.edges[0] === 'warn') {
      fill = 'var(--c-warn-bg)';
      stroke = 'var(--c-warn)';
    } else if (i === fr.active) {
      fill = 'var(--c-warn-bg)';
      stroke = 'var(--c-hot)';
    } else if (fr.mul > 0 && i > fr.active) {
      fill = 'var(--c-tip-bg)';
      stroke = 'var(--c-ok)';
    } else if (fr.active >= 0 && i < fr.active) {
      fill = 'var(--c-key-bg)';
      stroke = 'var(--c-accent)';
    } else {
      fill = 'var(--c-panel-2)';
      stroke = 'var(--c-line)';
    }
    nodes.push(
      <g key={`n${i}`}>
        <rect x={NODE_X} y={NODE_Y[i]} width={NODE_W} height={NODE_H} rx={8} fill={fill} stroke={stroke} strokeWidth={2} />
        <T6 x={NODE_X + NODE_W / 2} y={NODE_Y[i] + 29} anchor="middle" cls="tx tx-b" s={LABEL[i]} />
      </g>,
    );
  }

  return (
    <>
      <T6 x={26} y={28} s={fr.title} cls="tx-b" />
      {edges}
      {nodes}

      {/* 右栏：回代清单 */}
      <Panel x={RX} y={48} w={RW} h={216} hl="key" />
      <T6 x={RX + 16} y={74} cls="tx-b" s="自底向上回代（右边是乘法次数）" />
      {fr.rows.length === 0 && <T6 x={RX + 16} y={108} cls="tx-sm" s="（还没有开始回代）" />}
      {fr.rows.map((r, i) => (
        <T6 key={i} x={RX + 16} y={108 + i * 32} cls="tx-sm" s={r} />
      ))}

      {/* 对比大字 */}
      {fr.big && (
        <T6
          x={RX + RW / 2}
          y={296}
          anchor="middle"
          cls="tx tx-b"
          fill={fr.big.charAt(0) === 'Θ' ? 'var(--c-warn)' : 'var(--c-ok)'}
          s={fr.big}
        />
      )}

      {/* 乘法计数器 */}
      <Panel x={RX} y={318} w={RW} h={66} hl={fr.mul >= 5 ? 'tip' : null} />
      <T6 x={RX + 16} y={346} cls="tx" s={`分治累计乘法：${fr.mul} 次`} />
      <T6 x={RX + 16} y={372} cls="tx-sm" s="简单算法：n − 1 = 20 − 1 = 19 次" />

      <T6 x={26} y={420} cls="tx-sm" s="T(n) = T(⌊n/2⌋) + Θ(1) ⇒ T(n) = Θ(lg n)；n = 20 时递归深度为 ⌊lg 20⌋ = 4" />
    </>
  );
}

export const fastPower: DemoDef<Frame> = { build, View, w: W, h: H };
