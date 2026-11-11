/**
 * Prim 最小生成树（8 顶点 10 边，PPT 第 13~25 页逐帧图，起点 G，共 14 步，末步总权 53）
 * 图与 PPT 完全同构：PPT 圆圈里只写 key 值，本页把 8 个顶点依次记为 A~H。
 * 移植自 assets/demos-deck8.js 的 prim-mst
 */
import type { CSSProperties } from 'react';
import type { DemoDef, DemoFrame } from './types';

export interface Frame extends DemoFrame {
  idx: number;
  /** 集合 A（顶点字母） */
  a: string[];
  /** MST 上的父亲 */
  par: Record<string, string>;
  /** key 全表（经 K() 规范化，没写的顶点为 INF） */
  key: Record<string, number>;
  /** 当前 key 最小的候选顶点 */
  cur: string | null;
  /** 累计权值 */
  total: number;
}

const INF = 9999;                                    // 用 9999 代表 ∞（显示时换成符号）
const NAME = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];   // 顶点字母
const POS: Record<string, [number, number]> = {      // 顶点坐标（照 PPT 的布局摆位）
  A: [300, 72], B: [96, 200], C: [470, 200], D: [664, 200],
  E: [96, 320], F: [300, 424], G: [470, 320], H: [664, 320],
};
const EDGES: Array<[string, string, number]> = [     // 10 条带权边（无向）
  ['A', 'B', 6], ['A', 'C', 12], ['B', 'C', 5], ['B', 'E', 14], ['B', 'F', 8],
  ['E', 'F', 3], ['C', 'D', 9], ['C', 'G', 7], ['F', 'G', 10], ['G', 'H', 15],
];
const LBL: Record<string, [number, number]> = {      // 边权数字的位置（手工避让）
  'A,B': [174, 116], 'A,C': [394, 114], 'B,C': [283, 186], 'B,E': [56, 264],
  'B,F': [158, 318], 'E,F': [156, 392], 'C,D': [572, 186], 'C,G': [428, 262],
  'F,G': [394, 392], 'G,H': [572, 306],
};
const R = 21;                                        // 顶点圆半径
const W = 760;
const H = 520;

/** 原 K(o)：把「只写有值的 key」补成全表 */
function K(o: Record<string, number>): Record<string, number> {
  const out: Record<string, number> = {};
  for (const n of NAME) out[n] = INF;
  for (const k of Object.keys(o)) out[k] = o[k];
  return out;
}

/** 原 FRAMES 表（d 为解说；key 经 K() 补全） */
type RawFrame = Omit<Frame, 'idx' | 'cap'> & { d: string };

const RAW_FRAMES: RawFrame[] = [
  { a: [], par: {}, key: K({}), cur: null, total: 0,
    d: '初始：8 个顶点的 key 全为 ∞，集合 A 为空。Prim 从哪个顶点出发都能得到 MST，本页按 PPT 第 13 页取定的起点是 <b>G</b>（它的圆圈里写着 0）。' },
  { a: [], par: {}, key: K({ G: 0 }), cur: 'G', total: 0,
    d: '第 1 步：<b>G.key ← 0</b>，表示 G 到集合 A 的距离为 0，于是 G 必然成为第一个被 EXTRACT-MIN 取出的顶点。其余 7 个顶点的 key 仍是 ∞。' },
  { a: ['G'], par: { C: 'G', F: 'G', H: 'G' }, key: K({ G: 0, C: 7, F: 10, H: 15 }), cur: 'G', total: 0,
    d: '第 2 步：取出 <b>G（key=0）</b>加入 A，扫描 G 的 3 条邻边做松弛：C.key ← 7（边 G–C=7）、F.key ← 10（G–F=10）、H.key ← 15（G–H=15）。总权仍为 0。' },
  { a: ['G', 'C'], par: { C: 'G', F: 'G', H: 'G', B: 'C', A: 'C', D: 'C' },
    key: K({ G: 0, C: 7, F: 10, H: 15, B: 5, A: 12, D: 9 }), cur: 'C', total: 7,
    d: '第 3 步：V−A 中 key 最小的是 <b>C（7）</b>，把边 <b>G–C(7)</b> 加入 MST。松弛 C 的邻边：B.key ← 5、A.key ← 12、D.key ← 9。累计权值 7。' },
  { a: ['G', 'C', 'B'], par: { C: 'G', F: 'B', H: 'G', B: 'C', A: 'B', D: 'C', E: 'B' },
    key: K({ G: 0, C: 7, F: 8, H: 15, B: 5, A: 6, D: 9, E: 14 }), cur: 'B', total: 12,
    d: '第 4 步：最小 key 是 <b>B（5）</b>，加入边 <b>C–B(5)</b>。松弛 B 的邻边：A.key ← min(12, 6) = <b>6</b>、E.key ← 14、F.key ← min(10, 8) = <b>8</b>（F 的父亲由 G 改成 B）。累计权值 7+5 = 12。' },
  { a: ['G', 'C', 'B', 'A'], par: { C: 'G', F: 'B', H: 'G', B: 'C', A: 'B', D: 'C', E: 'B' },
    key: K({ G: 0, C: 7, F: 8, H: 15, B: 5, A: 6, D: 9, E: 14 }), cur: 'A', total: 18,
    d: '第 5 步：最小 key 是 <b>A（6）</b>，加入边 <b>B–A(6)</b>。A 的两个邻居 B、C 都已在 A 中，所以没有任何 key 被改进。累计权值 12+6 = 18。' },
  { a: ['G', 'C', 'B', 'A', 'F'], par: { C: 'G', F: 'B', H: 'G', B: 'C', A: 'B', D: 'C', E: 'F' },
    key: K({ G: 0, C: 7, F: 8, H: 15, B: 5, A: 6, D: 9, E: 3 }), cur: 'F', total: 26,
    d: '第 6 步：最小 key 是 <b>F（8）</b>（比 D 的 9 还小，所以 D 继续等待），加入边 <b>B–F(8)</b>。松弛 F–E：E.key ← min(14, 3) = <b>3</b>。累计权值 18+8 = 26。' },
  { a: ['G', 'C', 'B', 'A', 'F', 'E'], par: { C: 'G', F: 'B', H: 'G', B: 'C', A: 'B', D: 'C', E: 'F' },
    key: K({ G: 0, C: 7, F: 8, H: 15, B: 5, A: 6, D: 9, E: 3 }), cur: 'E', total: 29,
    d: '第 7 步：最小 key 是 <b>E（3）</b>，加入边 <b>F–E(3)</b>。E 的另一个邻居 B 已在 A 中，无更新。累计权值 26+3 = 29。' },
  { a: ['G', 'C', 'B', 'A', 'F', 'E', 'D'], par: { C: 'G', F: 'B', H: 'G', B: 'C', A: 'B', D: 'C', E: 'F' },
    key: K({ G: 0, C: 7, F: 8, H: 15, B: 5, A: 6, D: 9, E: 3 }), cur: 'D', total: 38,
    d: '第 8 步：最小 key 是 <b>D（9）</b>，加入边 <b>C–D(9)</b>。D 只有 C 一个邻居且已在 A 中。累计权值 29+9 = 38。' },
  { a: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], par: { C: 'G', F: 'B', H: 'G', B: 'C', A: 'B', D: 'C', E: 'F' },
    key: K({ G: 0, C: 7, F: 8, H: 15, B: 5, A: 6, D: 9, E: 3 }), cur: 'H', total: 53,
    d: '第 9 步：只剩 <b>H（key=15）</b>，加入边 <b>G–H(15)</b>。此时 A = V，MST 恰好 |V|−1 = 7 条边，总权 38+15 = <b>53</b>。' },
  { a: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], par: { C: 'G', F: 'B', H: 'G', B: 'C', A: 'B', D: 'C', E: 'F' },
    key: K({ G: 0, C: 7, F: 8, H: 15, B: 5, A: 6, D: 9, E: 3 }), cur: null, total: 53,
    d: '完成：MST = {E–F:3, B–C:5, A–B:6, C–G:7, B–F:8, C–D:9, G–H:15}，总权 3+5+6+7+8+9+15 = <b>53</b>，与 PPT 第 4 页给出的最小生成树完全一致。' },
  { a: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], par: { C: 'G', F: 'B', H: 'G', B: 'C', A: 'B', D: 'C', E: 'F' },
    key: K({ G: 0, C: 7, F: 8, H: 15, B: 5, A: 6, D: 9, E: 3 }), cur: null, total: 53,
    d: '被排除的 3 条边：A–C(12) 在环 A–B–C 上最大（12 &gt; 6、5）；B–E(14) 在环 B–F–E 上最大（14 &gt; 8、3）；F–G(10) 在环 F–B–C–G 上最大（10 &gt; 8、5、7）。环上的最大边一定不在 MST 里。' },
  { a: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], par: { C: 'G', F: 'B', H: 'G', B: 'C', A: 'B', D: 'C', E: 'F' },
    key: K({ G: 0, C: 7, F: 8, H: 15, B: 5, A: 6, D: 9, E: 3 }), cur: null, total: 53,
    d: 'Kruskal 视角对照：把 10 条边按权升序 3,5,6,7,8,9,10,12,14,15 依次考察、用并查集判环，被舍弃的正好是 10、12、14 三条，得到同一棵 MST，权值同为 <b>53</b>。' },
  { a: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], par: { C: 'G', F: 'B', H: 'G', B: 'C', A: 'B', D: 'C', E: 'F' },
    key: K({ G: 0, C: 7, F: 8, H: 15, B: 5, A: 6, D: 9, E: 3 }), cur: null, total: 53,
    d: '复杂度：二叉堆（优先队列）实现 <b>O(E lg V)</b>，本例 E=10、V=8；邻接矩阵 + 线性扫描找最小 key 是 <b>O(V²)</b>，稠密图更划算；斐波那契堆可做到 O(E + V lg V)。' },
];

export function build(): Frame[] {
  return RAW_FRAMES.map((fr, idx) => ({
    idx,
    a: fr.a.slice(),
    par: { ...fr.par },
    key: { ...fr.key },
    cur: fr.cur,
    total: fr.total,
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

/** 原 panel()：一个圆角矩形面板 */
function Panel({
  x,
  y,
  w,
  h,
  fill,
  stroke,
  sw,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  stroke: string;
  sw?: number;
}) {
  return <rect x={x} y={y} width={w} height={h} rx={8} fill={fill} stroke={stroke} strokeWidth={sw || 1.2} />;
}

function View({ frame: f }: { frame: Frame }) {
  const inA: Record<string, boolean> = {};
  for (const v of f.a) inA[v] = true;

  return (
    <>
      {/* 顶部状态条 */}
      <Tx x={20} y={24} s={`第 ${f.idx + 1} / ${RAW_FRAMES.length} 步`} cls="tx-b" anchor="start" fill="var(--c-accent)" />
      <Tx x={120} y={24} s={`A = {${f.a.length ? f.a.join(', ') : '∅'}}`} cls="tx" anchor="start" />
      <Tx x={430} y={24} s={`key 最小的候选：${f.cur ? f.cur : '—'}`} cls="tx-sm" anchor="start" />
      <Tx x={610} y={24} s={`总权 = ${f.total}`} cls="tx-b" anchor="start" fill="var(--c-hot)" />

      {/* 先画边（后画点，点会盖住线头） */}
      {EDGES.map(([u, v, w], i) => {
        const pu = POS[u];
        const pv = POS[v];
        const isTree = (f.par[v] === u && inA[v]) || (f.par[u] === v && inA[u]);
        const isCand = (f.par[v] === u && !inA[v]) || (f.par[u] === v && !inA[u]);
        const isTreeW = isTree && w === (f.par[v] === u ? f.key[v] : f.key[u]);
        const lp = LBL[u + ',' + v];
        return (
          <g key={i}>
            {isTreeW ? (
              <Seg x1={pu[0]} y1={pu[1]} x2={pv[0]} y2={pv[1]} color="var(--c-hot)" w={4.6} />
            ) : isCand ? (
              <Seg x1={pu[0]} y1={pu[1]} x2={pv[0]} y2={pv[1]} color="var(--c-accent)" w={2.2} dash="6 5" />
            ) : (
              <Seg x1={pu[0]} y1={pu[1]} x2={pv[0]} y2={pv[1]} color="var(--hairline)" w={1.4} />
            )}
            {lp && (
              <Tx
                x={lp[0]}
                y={lp[1]}
                s={w}
                cls={'tx-sm' + (isTreeW ? ' tx-b' : '')}
                anchor="middle"
                fill={isTreeW ? 'var(--c-hot)' : isCand ? 'var(--c-accent)' : 'var(--ink-2)'}
              />
            )}
          </g>
        );
      })}

      {/* 再画顶点：圆圈里写 key，圆圈上方写字母 */}
      {NAME.map((u) => {
        const p = POS[u];
        let fill = 'var(--c-cell-idle)';
        let stroke = 'var(--hairline)';
        let sw = 1.6;
        if (inA[u]) { fill = 'var(--tip-bg)'; stroke = 'var(--c-ok)'; sw = 2.4; }
        if (f.cur === u) { fill = 'var(--warn-bg)'; stroke = 'var(--c-hot)'; sw = 3.0; }
        return (
          <g key={u}>
            {f.cur === u && (
              // 当前顶点的外圈高亮环
              <circle cx={p[0]} cy={p[1]} r={R + 6} fill="none" stroke="var(--c-hot)" strokeWidth={1.6} strokeDasharray="4 4" />
            )}
            <circle cx={p[0]} cy={p[1]} r={R} fill={fill} stroke={stroke} strokeWidth={sw} className="node-circle" />
            <Tx
              x={p[0]}
              y={p[1] + 5}
              s={f.key[u] === INF ? '∞' : f.key[u]}
              cls="tx tx-b"
              anchor="middle"
              fill={f.key[u] === INF ? 'var(--ink-2)' : 'var(--ink)'}
            />
            <Tx x={p[0]} y={p[1] - 30} s={u} cls="tx-sm tx-b" anchor="middle" fill="var(--c-accent-2)" />
          </g>
        );
      })}

      {/* 底部 key 表：一行 8 个小格 */}
      <Tx x={20} y={466} s="key 表（V−A 中顶点按“到 A 的最小边权”排序）" cls="tx-sm" anchor="start" />
      {NAME.map((u, i) => {
        const bx = 22 + i * 90;
        const on = inA[u];
        return (
          <g key={u}>
            <Panel
              x={bx}
              y={474}
              w={82}
              h={28}
              fill={on ? 'var(--tip-bg)' : 'var(--c-cell-idle)'}
              stroke={on ? 'var(--c-ok)' : 'var(--hairline)'}
              sw={on ? 1.8 : 1.0}
            />
            <Tx
              x={bx + 41}
              y={493}
              s={`${u}=${f.key[u] === INF ? '∞' : f.key[u]}`}
              cls="tx"
              anchor="middle"
              fill={on ? 'var(--c-ok)' : 'var(--ink)'}
            />
          </g>
        );
      })}
    </>
  );
}

export const primMst: DemoDef<Frame> = { build, View, w: W, h: H };
