/**
 * 哈夫曼编码（课堂练习 C={a..h}，f={83,14,28,38,131,29,20,57}，共 16 步，
 * 末步给出各字符码字与平均码长 2.6925）
 * 移植自 assets/demos-deck8.js 的 huffman
 */
import type { CSSProperties } from 'react';
import type { DemoDef, DemoFrame } from './types';

export interface Frame extends DemoFrame {
  idx: number;
  /** 当前已建到第几步（合并次数） */
  up: number;
  /** 本轮合并的两个孩子（节点 id） */
  hi: string[];
}

interface NodePos {
  f: number;
  x: number;
  y: number;
}

/** 叶子的最终位置（按树的中序：b g d a h c f e）与内部节点位置 */
const LEAF: Record<string, NodePos> = {
  b: { f: 14, x: 75, y: 340 }, g: { f: 20, x: 165, y: 340 },
  d: { f: 38, x: 255, y: 340 }, a: { f: 83, x: 345, y: 340 },
  h: { f: 57, x: 435, y: 340 }, c: { f: 28, x: 525, y: 340 },
  f: { f: 29, x: 615, y: 340 }, e: { f: 131, x: 705, y: 340 },
};
const INNER: Record<string, NodePos> = {            // 内部节点：频率与坐标
  n1: { f: 34, x: 120.0, y: 270 }, n2: { f: 57, x: 570.0, y: 270 },
  n3: { f: 72, x: 187.5, y: 200 }, n4: { f: 114, x: 502.5, y: 200 },
  n5: { f: 155, x: 266.25, y: 130 }, n6: { f: 245, x: 603.75, y: 130 },
  rt: { f: 400, x: 435.0, y: 60 },
};
const LINK: Array<[string, string]> = [             // 父子关系（父, 子）
  ['n1', 'b'], ['n1', 'g'], ['n2', 'c'], ['n2', 'f'], ['n3', 'n1'], ['n3', 'd'],
  ['n4', 'h'], ['n4', 'n2'], ['n5', 'n3'], ['n5', 'a'], ['n6', 'n4'], ['n6', 'e'],
  ['rt', 'n5'], ['rt', 'n6'],
];
const BORN: Record<string, number> = {              // 该节点在第几步出现
  b: 0, g: 0, d: 0, a: 0, h: 0, c: 0, f: 0, e: 0,
  n1: 1, n2: 2, n3: 3, n4: 4, n5: 5, n6: 6, rt: 7,
};
const CODES: Record<string, string> = { a: '01', b: '0000', c: '1010', d: '001', e: '11', f: '1011', g: '0001', h: '100' };
const LEAF_ORDER = ['b', 'g', 'd', 'a', 'h', 'c', 'f', 'e'];
const INNER_ORDER = ['n1', 'n2', 'n3', 'n4', 'n5', 'n6', 'rt'];
const W = 800;
const H = 520;

/** 取任意节点的坐标 */
function xy(id: string): [number, number] {
  if (LEAF[id]) return [LEAF[id].x, LEAF[id].y];
  return [INNER[id].x, INNER[id].y];
}

/** 原 FRAMES 表（d 为解说） */
type RawFrame = Omit<Frame, 'idx' | 'cap'> & { d: string };

const RAW_FRAMES: RawFrame[] = [
  { up: 0, hi: [],
    d: '初始：8 个叶子，频率 a:83、b:14、c:28、d:38、e:131、f:29、g:20、h:57，合计 Σf = 400。目标：造一棵二叉树，使 <b>B(T) = Σ f(c)·d<sub>T</sub>(c)</b> 最小。' },
  { up: 1, hi: ['b', 'g'],
    d: '第 1 次合并：取出频率最小的两个 <b>b(14)</b> 与 <b>g(20)</b>，合并成新节点 <b>34</b>。候选集剩下 {c:28, f:29, d:38, h:57, a:83, e:131, 34}。' },
  { up: 2, hi: ['c', 'f'],
    d: '第 2 次合并：最小的两个是 <b>c(28)</b> 与 <b>f(29)</b>，合并成 <b>57</b>。剩下 {d:38, h:57, a:83, e:131, 34, 57}。' },
  { up: 3, hi: ['n1', 'd'],
    d: '第 3 次合并：<b>34</b> 与 <b>d(38)</b> 最小，合并成 <b>72</b>。剩下 {h:57, a:83, e:131, 57, 72}。' },
  { up: 4, hi: ['h', 'n2'],
    d: '第 4 次合并：<b>h(57)</b> 与 <b>57</b> 相等且最小，合并成 <b>114</b>（两个 57 谁在左谁在右都不影响码长）。剩下 {a:83, e:131, 72, 114}。' },
  { up: 5, hi: ['n3', 'a'],
    d: '第 5 次合并：<b>72</b> 与 <b>a(83)</b> 最小，合并成 <b>155</b>。剩下 {e:131, 114, 155}。' },
  { up: 6, hi: ['n4', 'e'],
    d: '第 6 次合并：<b>114</b> 与 <b>e(131)</b> 最小，合并成 <b>245</b>。剩下 {155, 245}。' },
  { up: 7, hi: ['n5', 'n6'],
    d: '第 7 次合并：<b>155</b> 与 <b>245</b> 合并成根 <b>400</b> = 总频率。共做了 n−1 = 7 次合并，哈夫曼树建成。' },
  { up: 7, hi: [],
    d: '标号：每个内部节点向左孩子的边记 <b>0</b>、向右记 <b>1</b>，根到叶的路径就是该字符的码字。这棵树是 <b>full binary tree</b> —— 每个内部节点恰好 2 个孩子，没有“单叉”。' },
  { up: 7, hi: [],
    d: '读出码字：<b>a=01（2 位）、b=0000（4 位）、c=1010（4 位）、d=001（3 位）、e=11（2 位）、f=1011（4 位）、g=0001（4 位）、h=100（3 位）</b>。频率越高码越短。' },
  { up: 7, hi: [],
    d: '算代价：B(T) = 83×2 + 14×4 + 28×4 + 38×3 + 131×2 + 29×4 + 20×4 + 57×3 = 166+56+112+114+262+116+80+171 = <b>1077 bit</b>（编码 400 个字符）。' },
  { up: 7, hi: [],
    d: '平均码长 = B(T) / Σf = 1077 / 400 = <b>2.6925 ≈ 2.693</b> bit/字符。这就是课堂练习要求的答案。' },
  { up: 7, hi: [],
    d: '对比定长码：8 个字符至少要 ⌈lg 8⌉ = 3 bit，总代价 3×400 = <b>1200 bit</b>（平均 3.000）。哈夫曼省下 1200−1077 = <b>123 bit</b>，约 10.25%。' },
  { up: 7, hi: ['b', 'e', 'd'],
    d: '解码示例：编码 “bed” = 0000 11 001 = 000011001。从根出发逐位走：<b>0000</b> 到 b，<b>11</b> 到 e，<b>001</b> 到 d。前缀码保证每一步不会走岔，解码 O(码长)。' },
  { up: 7, hi: ['b', 'g'],
    d: '贪心选择性质：两个频率最低的字符 x、y 可以放在<b>最深的兄弟叶子</b>上 —— 它们码长相同、码字仅最后一位不同。交换论证：把 x、y 与最深叶子的字符对换，B(T) 不会变大，故存在含这条合并的最优树。' },
  { up: 7, hi: ['b', 'g', 'n1'],
    d: '最优子结构：合并 x、y 为 z（f(z) = f(x)+f(y)）后，T′ = T − {x,y} 必是 C′ = C − {x,y} ∪ {z} 的最优前缀码树；否则把更优的 T″ 的 z 换回 x、y 得 B(T‴) = B(T″)+f(x)+f(y) &lt; B(T)，与 T 最优矛盾。' },
];

export function build(): Frame[] {
  return RAW_FRAMES.map((fr, idx) => ({
    idx,
    up: fr.up,
    hi: fr.hi.slice(),
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

/** 原 seg()：一条线 */
function Seg({
  x1,
  y1,
  x2,
  y2,
  color,
  w,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  w?: number;
}) {
  const style: CSSProperties = { stroke: color, strokeWidth: w || 1.5, strokeLinecap: 'round' };
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
  /* 底部面板：分阶段给出结论 */
  let line1 = '';
  let line2 = '';
  let line3 = '';
  if (f.idx <= 7) {
    let rest: string[] = [];
    if (f.idx < 1) { rest = ['b:14', 'g:20', 'c:28', 'f:29', 'd:38', 'h:57', 'a:83', 'e:131']; }
    else if (f.idx < 2) { rest = ['c:28', 'f:29', 'd:38', 'h:57', 'a:83', 'e:131', '34']; }
    else if (f.idx < 3) { rest = ['d:38', 'h:57', 'a:83', 'e:131', '34', '57']; }
    else if (f.idx < 4) { rest = ['h:57', 'a:83', 'e:131', '57', '72']; }
    else if (f.idx < 5) { rest = ['a:83', 'e:131', '72', '114']; }
    else if (f.idx < 6) { rest = ['e:131', '114', '155']; }
    else if (f.idx < 7) { rest = ['155', '245']; }
    else { rest = ['400（根）']; }
    line1 = '当前优先队列（小根堆）里的节点：' + rest.join('、');
    line2 = '规则：每步取频率最小的两个节点合并，新节点频率 = 两者之和，再插回队列。';
    line3 = '共需 n−1 = 7 次合并；每次 EXTRACT-MIN / INSERT 是 O(lg n) ⇒ 总时间 O(n lg n)。';
  } else if (f.idx === 8) {
    line1 = 'a=01、b=0000、c=1010、d=001、e=11、f=1011、g=0001、h=100';
    line2 = '左孩子记 0、右孩子记 1：根 → 叶路径长度就是码长，且没有任何码字是别人的前缀。';
    line3 = '8 个叶子、7 个内部节点，共 15 个节点；深度分布 {2,2,3,3,4,4,4,4}。';
  } else if (f.idx === 9) {
    line1 = '码长：a=2、e=2、d=3、h=3、b=4、c=4、f=4、g=4';
    line2 = '频率最高的 e(131) 与次高的 a(83) 拿到 2 位码；最低的 b(14)、g(20) 拿 4 位码。';
    line3 = '前缀码校验：没有任何一个码字是另一个的前缀，所以解码不需要分隔符。';
  } else if (f.idx === 10) {
    line1 = 'B(T) = 83×2 + 14×4 + 28×4 + 38×3 + 131×2 + 29×4 + 20×4 + 57×3';
    line2 = '     = 166 + 56 + 112 + 114 + 262 + 116 + 80 + 171 = 1077 bit';
    line3 = 'B(T) 的含义：编码 400 个字符（按给定频率）总共需要的二进制位数。';
  } else if (f.idx === 11) {
    line1 = '平均码长 = B(T) / Σf = 1077 / 400 = 2.6925 bit/字符 ≈ 2.693';
    line2 = 'Σf = 83+14+28+38+131+29+20+57 = 400';
    line3 = '这就是 PPT 第 45 页课堂练习的答案：最优前缀码 + 平均码长 2.6925。';
  } else if (f.idx === 12) {
    line1 = '定长码：3 bit × 400 = 1200 bit，平均 3.000 bit/字符';
    line2 = '哈夫曼变长码：1077 bit，平均 2.6925 bit/字符';
    line3 = '节省 1200 − 1077 = 123 bit，压缩率 123/1200 ≈ 10.25%。';
  } else if (f.idx === 13) {
    line1 = 'bed = 0000 11 001 = 000011001（共 9 bit，定长码要 3×3 = 9 bit，字符少时优势不明显）';
    line2 = '解码：0000→b、11→e、001→d；每到一个叶子就回根重新开始。';
    line3 = '若码字有前缀关系（如 a=0、b=01），0001 就会有歧义 —— 这正是前缀码要排除的。';
  } else if (f.idx === 14) {
    line1 = '贪心选择：x、y 是频率最低的两个字符，则存在一棵最优树让它们成为最深的一对兄弟叶子。';
    line2 = '理由：若最优树里更深的叶子上放着别的字符，与 x（或 y）对换后 B(T) 只减不增。';
    line3 = '所以“合并最小的两个”这一步不会破坏最优性 —— 这就是贪心选择性质。';
  } else {
    line1 = '最优子结构：T 最优 ⇒ T′ = T − {x,y} 是 C′ = C − {x,y} ∪ {z} 的最优前缀码树。';
    line2 = '反证：若 T′ 不最优，取更优的 T″，把 z 展开成 x、y 得 T‴，';
    line3 = '则 B(T‴) = B(T″) + f(x) + f(y) < B(T′) + f(x) + f(y) = B(T)，与 T 最优矛盾。';
  }

  return (
    <>
      {/* 顶部状态条 */}
      <Tx x={20} y={26} s={`第 ${f.idx + 1} / ${RAW_FRAMES.length} 步`} cls="tx-b" anchor="start" fill="var(--c-accent)" />
      <Tx x={122} y={26} s={`已合并 ${Math.min(f.idx, 7)} / 7 次`} cls="tx" anchor="start" />
      <Tx x={300} y={26} s="根频率 = 400（= Σf）" cls="tx-sm" anchor="start" />
      <Tx x={560} y={26} s={`B(T) = ${f.idx >= 10 ? '1077' : '待算'}`} cls="tx-b" anchor="start" fill="var(--c-hot)" />

      {/* 先画边：父节点已出现才画 */}
      {LINK.map(([pa, ch], i) => {
        if (BORN[pa] > Math.min(f.up, 7)) return null;
        const pp = xy(pa);
        const pc = xy(ch);
        const mx = pp[0] + (pc[0] - pp[0]) * 0.45;
        const my = pp[1] + (pc[1] - pp[1]) * 0.45;
        const bit = pc[0] < pp[0] ? '0' : '1';       // 左孩子（x 更小）记 0，右孩子记 1
        return (
          <g key={i}>
            <Seg x1={pp[0]} y1={pp[1] + 18} x2={pc[0]} y2={pc[1] - 16} color="var(--hairline)" w={1.8} />
            {f.idx >= 8 && (                        // 树成形后给每条边标 0 / 1
              <Tx
                x={mx + (bit === '0' ? -9 : 9)}
                y={my}
                s={bit}
                cls="tx-sm tx-b"
                anchor="middle"
                fill="var(--c-accent-2)"
              />
            )}
          </g>
        );
      })}

      {/* 再画节点：叶子（矩形）与内部节点（圆） */}
      {LEAF_ORDER.map((id) => {
        const lf = LEAF[id];
        const hotL = f.hi.indexOf(id) >= 0;
        return (
          <g key={id}>
            <rect
              x={lf.x - 24}
              y={lf.y - 16}
              width={48}
              height={32}
              rx={6}
              fill={hotL ? 'var(--warn-bg)' : 'var(--key-bg)'}
              stroke={hotL ? 'var(--c-hot)' : 'var(--c-accent)'}
              strokeWidth={hotL ? 2.6 : 1.6}
              className="node-rect"
            />
            <Tx x={lf.x} y={lf.y - 2} s={`${id}:${lf.f}`} cls="tx tx-b" anchor="middle" />
            {f.idx >= 9 && (                        // 码字写在叶子下方
              <g>
                <Tx x={lf.x} y={lf.y + 36} s={CODES[id]} cls="tx tx-b" anchor="middle" fill="var(--c-hot)" />
                <Tx x={lf.x} y={lf.y + 52} s={`d=${CODES[id].length}`} cls="tx-sm" anchor="middle" />
              </g>
            )}
          </g>
        );
      })}
      {INNER_ORDER.map((id) => {
        if (BORN[id] > Math.min(f.up, 7)) return null;
        const nd = INNER[id];
        const hotN = f.hi.indexOf(id) >= 0;
        const isNew = f.up === BORN[id] && f.idx === f.up;
        return (
          <g key={id}>
            <circle
              cx={nd.x}
              cy={nd.y}
              r={21}
              fill={hotN || isNew ? 'var(--warn-bg)' : 'var(--c-cell-idle)'}
              stroke={hotN || isNew ? 'var(--c-hot)' : 'var(--c-accent)'}
              strokeWidth={hotN || isNew ? 2.8 : 1.5}
              className="node-circle"
            />
            <Tx x={nd.x} y={nd.y + 5} s={nd.f} cls="tx tx-b" anchor="middle" />
          </g>
        );
      })}

      {/* 底部面板：分阶段给出结论 */}
      <Panel x={20} y={400} w={760} h={104} fill="var(--c-cell-idle)" stroke="var(--hairline)" sw={1.2} />
      <Tx x={36} y={426} s={line1} cls={'tx' + (f.idx >= 10 && f.idx <= 12 ? ' tx-b' : '')} anchor="start" />
      <Tx x={36} y={454} s={line2} cls="tx-sm" anchor="start" />
      <Tx x={36} y={482} s={line3} cls="tx-sm" anchor="start" />
    </>
  );
}

export const huffman: DemoDef<Frame> = { build, View, w: W, h: H };
