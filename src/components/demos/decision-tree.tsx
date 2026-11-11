/**
 * 决策树演示：作用于 3 个元素的插入排序决策树，
 * 在树上走输入 ⟨a1,a2,a3⟩ = ⟨9,4,6⟩ 的搜索路径（1:2 → 1:3 → 2:3 → 叶子 231），共 9 步
 * 移植自 assets/demos-deck4.js 的 decision-tree
 */
import type { DemoDef, DemoFrame } from './types';
import { Ln, T } from './primitives';

export interface Frame extends DemoFrame {
  /** 本步焦点节点（'' 表示无） */
  cur: string;
  /** 已经走过的节点（按先后次序） */
  done: string[];
  /** 已经走过的边序号 */
  edges: number[];
  /** 底部结论行 */
  note: string;
}

interface NodeDef {
  t: string;
  x: number;
  y: number;
  leaf?: boolean;
}

interface EdgeDef {
  a: string;
  b: string;
  side: string;
  lx: number;
  ly: number;
  an: 'start' | 'end';
}

/** 6 个内部节点的圆 + 6 个叶子的方框（key 顺序即绘制顺序） */
const NODES: Record<string, NodeDef> = {
  root: { t: '1:2', x: 500, y: 58 },
  n23: { t: '2:3', x: 270, y: 168 },
  n13r: { t: '1:3', x: 740, y: 168 },
  l123: { t: '123', x: 150, y: 278, leaf: true },
  n13l: { t: '1:3', x: 390, y: 278 },
  l213: { t: '213', x: 620, y: 278, leaf: true },
  n23r: { t: '2:3', x: 860, y: 278 },
  l132: { t: '132', x: 320, y: 388, leaf: true },
  l312: { t: '312', x: 465, y: 388, leaf: true },
  l231: { t: '231', x: 790, y: 388, leaf: true },
  l321: { t: '321', x: 935, y: 388, leaf: true },
};
const NODE_ORDER = ['root', 'n23', 'n13r', 'l123', 'n13l', 'l213', 'n23r', 'l132', 'l312', 'l231', 'l321'];

/** 10 条边：side 为分支标记，lx/ly 为标记位置 */
const EDGES: EdgeDef[] = [
  { a: 'root', b: 'n23', side: '≤', lx: 372, ly: 116, an: 'end' },
  { a: 'root', b: 'n13r', side: '>', lx: 628, ly: 112, an: 'start' },
  { a: 'n23', b: 'l123', side: '≤', lx: 196, ly: 226, an: 'end' },
  { a: 'n23', b: 'n13l', side: '>', lx: 340, ly: 222, an: 'start' },
  { a: 'n13l', b: 'l132', side: '≤', lx: 340, ly: 336, an: 'end' },
  { a: 'n13l', b: 'l312', side: '>', lx: 438, ly: 332, an: 'start' },
  { a: 'n13r', b: 'l213', side: '≤', lx: 666, ly: 226, an: 'end' },
  { a: 'n13r', b: 'n23r', side: '>', lx: 810, ly: 222, an: 'start' },
  { a: 'n23r', b: 'l231', side: '≤', lx: 810, ly: 336, an: 'end' },
  { a: 'n23r', b: 'l321', side: '>', lx: 906, ly: 332, an: 'start' },
];

const W = 1000;
const H = 470;

export function build(): Frame[] {
  return [
    { cur: '', done: [], edges: [], note: '输入 ⟨9, 4, 6⟩：还没有做任何比较',
      cap: '输入 ⟨a1, a2, a3⟩ = ⟨9, 4, 6⟩。作用于 3 个元素的插入排序决策树一共 6 个叶子 —— 123、132、213、231、312、321，正好对应 3! = 6 种可能的排列。' },
    { cur: 'root', done: [], edges: [], note: '比较 1：a1 = 9 与 a2 = 4',
      cap: '从根节点开始。内部节点 1:2 表示"比较 a1 与 a2"这一次比较操作，此时 a1 = 9、a2 = 4。' },
    { cur: 'n13r', done: ['root'], edges: [1], note: '9 ≥ 4 成立 → 走右分支，到达节点 1:3',
      cap: '因为 9 ≥ 4（即 a1 ≥ a2），沿<b>右分支</b>（分支标记为 "&gt;"）走到内部节点 1:3 —— 第一次比较的结果被记进了这条路径。' },
    { cur: 'n13r', done: ['root'], edges: [1], note: '比较 2：a1 = 9 与 a3 = 6',
      cap: '在内部节点 1:3 上做第二次比较：a1 与 a3，此时 a1 = 9、a3 = 6。' },
    { cur: 'n23r', done: ['root', 'n13r'], edges: [1, 7], note: '9 ≥ 6 成立 → 再走右分支，到达节点 2:3',
      cap: '因为 9 ≥ 6（即 a1 ≥ a3），继续沿<b>右分支</b>走到内部节点 2:3；路径这时已经走了 2 次比较。' },
    { cur: 'n23r', done: ['root', 'n13r'], edges: [1, 7], note: '比较 3：a2 = 4 与 a3 = 6',
      cap: '在内部节点 2:3 上做第三次比较：a2 与 a3，此时 a2 = 4、a3 = 6。' },
    { cur: 'l231', done: ['root', 'n13r', 'n23r'], edges: [1, 7, 8], note: '4 ≤ 6 成立 → 走左分支，到达叶子 231',
      cap: '因为 4 ≤ 6（即 a2 ≤ a3），沿<b>左分支</b>（标记 "≤"）到达叶子 231，路径走完，整条路径长度 = 3 次比较。' },
    { cur: 'l231', done: ['root', 'n13r', 'n23r', 'l231'], edges: [1, 7, 8], note: '叶子 231 ⇒ 次序 a2 ≤ a3 ≤ a1 ⇒ 输出 ⟨4, 6, 9⟩',
      cap: '叶子 231 表示最终的排列是 a2 ≤ a3 ≤ a1，代入数值就是 ⟨4, 6, 9⟩ —— 排序结果正确。这条搜索路径共做了 3 次比较。' },
    { cur: '', done: ['root', 'n13r', 'n23r', 'l231'], edges: [1, 7, 8], note: '算法的运行时间 = 路径长度；最坏运行时间 = 树的高度',
      cap: '归纳：决策树可以模拟任何比较排序 —— 每个输入都对应一条从根到叶的路径，<b>算法的运行时间 = 路径的长度</b>（本例 3 次比较），<b>最坏运行时间 = 树的高度</b>。叶子 123 那条路径只比较了 2 次，正说明不同输入的运行时间并不相同。' },
  ];
}

function View({ frame: f }: { frame: Frame }) {
  // 已走路径文字：已经走过的节点（按先后次序）+ 本步焦点节点
  const seqNodes = f.done.slice();
  if (f.cur && seqNodes.indexOf(f.cur) < 0) { seqNodes.push(f.cur); }
  const pathTxt = seqNodes.map((name) => NODES[name].t);
  const pathLabel = '已走路径：' + (pathTxt.length ? pathTxt.join(' → ') : '（尚未出发）') +
    '　｜　比较次数：' + f.edges.length;

  return (
    <>
      <T x={26} y={26} s="作用于 3 个元素的插入排序的决策树（内部节点 i:j = 比较 ai 与 aj；叶子 = 一种排列）" cls="tx-b" />

      {/* ---- 先画边，再画节点，让节点盖住线头 ---- */}
      {EDGES.map((e, k) => {
        const on = f.edges.indexOf(k) >= 0; // 这条边是否落在搜索路径上
        return (
          <g key={'e' + k}>
            <line
              x1={NODES[e.a].x} y1={NODES[e.a].y} x2={NODES[e.b].x} y2={NODES[e.b].y}
              className="edge"
              stroke={on ? 'var(--c-hot)' : 'var(--c-line)'}
              strokeWidth={on ? 3.2 : 1.6}
            />
            <T
              x={e.lx} y={e.ly} s={e.side} anchor={e.an}
              cls={'tx-sm' + (on ? ' tx-b' : '')}
              color={on ? 'var(--c-hot)' : 'var(--c-ink-soft)'}
            />
          </g>
        );
      })}

      {/* ---- 节点：内部节点画圆，叶子画方框 ---- */}
      {NODE_ORDER.map((name) => {
        const nd = NODES[name];
        const isCur = f.cur === name; // 本步焦点
        const isDone = f.done.indexOf(name) >= 0; // 已经走过
        let fill = 'var(--c-panel-2)';
        let stroke = 'var(--c-line)';
        let sw = 1.4;
        if (isDone) { fill = 'var(--c-key-bg)'; stroke = 'var(--c-accent)'; sw = 2.0; }
        if (nd.leaf && nd.t === '231' && isDone && !isCur) { fill = 'var(--c-tip-bg)'; stroke = 'var(--c-ok)'; }
        if (isCur) { fill = 'var(--c-warn-bg)'; stroke = 'var(--c-hot)'; sw = 2.8; }
        return (
          <g key={name}>
            {nd.leaf ? (
              <rect x={nd.x - 33} y={nd.y - 16} width={66} height={32} rx={5} fill={fill} stroke={stroke} strokeWidth={sw} className="node-rect" />
            ) : (
              <circle cx={nd.x} cy={nd.y} r={25} fill={fill} stroke={stroke} strokeWidth={sw} className="node-circle" />
            )}
            <T x={nd.x} y={nd.y + 5} s={nd.t} anchor="middle" cls={'tx' + (isCur ? ' tx-b' : '')} />
          </g>
        );
      })}

      {/* ---- 底部的路径信息 ---- */}
      <Ln x1={26} y1={418} x2={974} y2={418} style={{ stroke: 'var(--c-line-soft)' }} />
      <T x={26} y={445} s={f.note} cls="tx" />
      <T x={26} y={465} s={pathLabel} cls="tx-sm" />
    </>
  );
}

export const decisionTree: DemoDef<Frame> = { build, View, w: W, h: H };
