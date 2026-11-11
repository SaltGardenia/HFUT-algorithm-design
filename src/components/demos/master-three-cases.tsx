/**
 * 主方法三种情况：递归树权重分布切换（10 帧）
 * 移植自 assets/demos-deck3.js 的 master-three-cases
 */
import type { ReactNode } from 'react';
import type { DemoDef, DemoFrame } from './types';
import { Bar3, Box, C3, Label, Seg } from './deck3-helpers';

export interface Frame extends DemoFrame {
  mode: 'tree' | 'compare' | 'unfit' | 'summary';
  /** tree 模式：当前情况编号 0..3（其他模式为 -1） */
  k: number;
  /** tree 模式：'cond' | 'sum' | undefined */
  phase?: 'cond' | 'sum';
}

const W = 990, H = 520;

const CASE: Record<number, { title: string; cond: string; sub: string; res: string; why: string; ex: string; bars: number[]; nums: string[]; color: 'accent' | 'accent2' | 'hot' }> = {
  1: {
    title: '情况 1（CASE 1）',
    cond: 'f(n) = O(n^(log_b a − ε))，常量 ε > 0',
    sub: 'f(n) 比 n^(log_b a) 增长得慢（慢 n^ε 倍）',
    res: 'T(n) = Θ(n^(log_b a))',
    why: '加权从根到叶子几何级数增长，叶子在总权重中占常数比例 ⇒ 叶子层主导',
    ex: '例：T(n) = 4T(n/2) + n，n^(log_b a) = n²，f(n) = n = O(n^(2−ε))（ε = 1）⇒ T(n) = Θ(n²)',
    bars: [8, 18, 40, 86],
    nums: ['1', '3', '9', '27'],
    color: 'accent',
  },
  2: {
    title: '情况 2（CASE 2）',
    cond: 'f(n) = Θ(n^(log_b a))',
    sub: 'f(n) 与 n^(log_b a) 同阶（k = 0 时即 f(n) = Θ(n^(log_b a) lg^0 n)）',
    res: 'T(n) = Θ(n^(log_b a) lg n) = Θ(f(n) lg n)',
    why: '每一层的加权基本相同 ⇒ 共 log_b n 层，每层同阶 ⇒ 总代价 = 每层 × 层数',
    ex: '例：T(n) = 4T(n/2) + n²，n^(log_b a) = n²，f(n) = n² = Θ(n² lg^0 n)（k = 0）⇒ T(n) = Θ(n² lg n)',
    bars: [34, 34, 34, 34],
    nums: ['1', '1', '1', '1'],
    color: 'accent2',
  },
  3: {
    title: '情况 3（CASE 3）',
    cond: 'f(n) = Ω(n^(log_b a + ε))，常量 ε > 0',
    sub: 'f(n) 比 n^(log_b a) 增长得快（快 n^ε 倍），并且满足规定条件 a·f(n/b) ≤ c·f(n)，常量 c < 1',
    res: 'T(n) = Θ(f(n))',
    why: '权重从根到叶子几何级数递减，根在整个权重中仅占常数部分 ⇒ 根层主导',
    ex: '例：T(n) = 4T(n/2) + n³，n^(log_b a) = n²，f(n) = n³ = Ω(n^(2+ε))（ε = 1），且 4(cn/2)³ ≤ cn³ 取 c = 1/2 ⇒ T(n) = Θ(n³)',
    bars: [86, 40, 18, 8],
    nums: ['27', '9', '3', '1'],
    color: 'hot',
  },
};

const COLOR: Record<'accent' | 'accent2' | 'hot', string> = {
  accent: C3.accent,
  accent2: C3.accent2,
  hot: C3.hot,
};
const BAR_LBL = ['f(n)', 'a·f(n/b)', 'a²·f(n/b²)', 'n^(log_b a)·T(1)'];

/* 10 步：0 总览 → 1~2 情况1 → 3~4 情况2 → 5~6 情况3 → 7 对比 → 8 不适用 → 9 小结 */
const STEPS: Array<{ mode: Frame['mode']; k: number; phase?: 'cond' | 'sum'; cap: string }> = [
  {
    mode: 'tree', k: 0,
    cap: '主方法适用于 <b>T(n) = aT(n/b) + f(n)</b>（a ≥ 1、b &gt; 1 为常数，f(n) 是渐近正函数）：把规模 n 的问题划分为 ' +
      'a 个子问题，每个规模 n/b，划分与合并的代价是 f(n)。这棵递归树共 <b>log<sub>b</sub>n</b> 层，' +
      '叶子数为 a<sup>log<sub>b</sub>n</sup> = <b>n<sup>log<sub>b</sub>a</sup></b>，叶子层总代价 = n<sup>log<sub>b</sub>a</sup>·T(1)。',
  },
  {
    mode: 'tree', k: 1, phase: 'cond',
    cap: '情况 1：<b>f(n) = O(n<sup>log<sub>b</sub>a − ε</sup>)</b>（常量 ε &gt; 0），即 f(n) 比 n<sup>log<sub>b</sub>a</sup> 增长得慢 n<sup>ε</sup> 倍。' +
      '看右侧柱高：逐层加权<b>递增</b>（1 → 3 → 9 → 27），叶子层最重。',
  },
  {
    mode: 'tree', k: 1, phase: 'sum',
    cap: '情况 1 结论：<b>T(n) = Θ(n<sup>log<sub>b</sub>a</sup>)</b>。例：T(n) = 4T(n/2) + n，a = 4、b = 2 ⇒ n<sup>log<sub>b</sub>a</sup> = n²，' +
      'f(n) = n = O(n<sup>2−ε</sup>) 取 ε = 1，故 T(n) = Θ(n²)。',
  },
  {
    mode: 'tree', k: 2, phase: 'cond',
    cap: '情况 2：<b>f(n) = Θ(n<sup>log<sub>b</sub>a</sup>)</b>。看右侧柱高：<b>每层加权基本相同</b>（1 → 1 → 1 → 1）。',
  },
  {
    mode: 'tree', k: 2, phase: 'sum',
    cap: '情况 2 结论：<b>T(n) = Θ(n<sup>log<sub>b</sub>a</sup> lg n) = Θ(f(n) lg n)</b>。例：T(n) = 4T(n/2) + n²，' +
      'n<sup>log<sub>b</sub>a</sup> = n²，f(n) = n² = Θ(n² lg<sup>0</sup>n)（k = 0）⇒ T(n) = Θ(n² lg n)。',
  },
  {
    mode: 'tree', k: 3, phase: 'cond',
    cap: '情况 3：<b>f(n) = Ω(n<sup>log<sub>b</sub>a + ε</sup>)</b>（常量 ε &gt; 0），即 f(n) 比 n<sup>log<sub>b</sub>a</sup> 增长得快 n<sup>ε</sup> 倍，' +
      '<b>并且 f(n) 满足规定条件 a·f(n/b) ≤ c·f(n)（常量 c &lt; 1）</b>。看右侧柱高：权重<b>递减</b>（27 → 9 → 3 → 1）。',
  },
  {
    mode: 'tree', k: 3, phase: 'sum',
    cap: '情况 3 结论：<b>T(n) = Θ(f(n))</b>。例：T(n) = 4T(n/2) + n³，n<sup>log<sub>b</sub>a</sup> = n²，f(n) = n³ = Ω(n<sup>2+ε</sup>)（ε = 1），' +
      '正则条件 4(cn/2)³ ≤ cn³ 取 c = 1/2 时成立 ⇒ T(n) = Θ(n³)。',
  },
      {
    mode: 'compare', k: -1,
    cap: '三种情况的差别只在 f(n) 与 n<sup>log<sub>b</sub>a</sup> 的相对大小：<b>慢 n<sup>ε</sup> 倍 → 叶子主导；同阶 → 每层叠加；快 n<sup>ε</sup> 倍（且满足正则条件）→ 根主导</b>',
  },
  {
    mode: 'unfit', k: -1,
    cap: '主方法并非万能。例：<b>T(n) = 4T(n/2) + n²/lg n</b>，n<sup>log<sub>b</sub>a</sup> = n²，而 f(n) = n²/lg n：' +
      '它比 n² 只小了 lg n 倍，<b>不是多项式地小</b>（找不到 ε &gt; 0 使 f(n) = O(n<sup>2−ε</sup>)，故情况 1 不成立）；' +
      'f(n) ≠ Θ(n²)，情况 2 不成立；f(n) 也不比 n² 大，情况 3 不成立 —— <b>这时主方法不适用</b>，需改用递归树或代换法。',
  },
  {
    mode: 'summary', k: -1,
    cap: '小结：比较基准是 <b>n<sup>log<sub>b</sub>a</sup></b>（递归树叶子层的总代价量级）。f(n) 多项式地小于它 → Θ(n<sup>log<sub>b</sub>a</sup>)；' +
      '与它同阶 → Θ(n<sup>log<sub>b</sub>a</sup> lg n)；多项式地大于它且满足 a·f(n/b) ≤ c·f(n)（c &lt; 1）→ Θ(f(n))。',
  },
];

export function build(): Frame[] {
  return STEPS.map(({ cap, mode, k, phase }) => ({ cap, mode, k, phase }));
}

/* ---------------- 通用递归树 ---------------- */
function drawTree(k: number): ReactNode {
  const col = k ? COLOR[CASE[k].color] : C3.line;
  const nodes: ReactNode[] = [];
  /* 高度标注 */
  nodes.push(<Seg key="h" x1={26} y1={46} x2={26} y2={330} o={{ stroke: C3.warn, sw: 1.6 }} />);
  nodes.push(<Label key="hl" x={22} y={60} s="h = log_b n" cls="tx-sm" anchor="middle" fill={C3.warn} />);

  nodes.push(
    <g key="root">
      <Box x={168} y={40} w={104} h={32} text="f(n)" o={{ stroke: col, sw: 1.8, fill: C3.keyBg, ink: col }} />
      <Label x={400} y={60} s="← 根：改造成 a 个子问题的代价" cls="tx-sm" anchor="start" fill={C3.soft} />
    </g>,
  );

  for (let i = 0; i < 3; i++) {
    const px = 100 + i * 120;
    nodes.push(
      <g key={`l1-${i}`}>
        <Seg x1={220} y1={72} x2={px + 42} y2={130} o={{ stroke: col }} />
        <Box x={px} y={130} w={84} h={30} text="f(n/b)" o={{ stroke: col, fill: C3.panel, ink: col }} />
      </g>,
    );
  }
  nodes.push(<Label key="l1t" x={400} y={150} s="← 第 1 层：a 个节点，该层加权 a·f(n/b)" cls="tx-sm" anchor="start" fill={C3.soft} />);

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const x = 58 + i * 120 + j * 30;
      nodes.push(
        <g key={`l2-${i}-${j}`}>
          <Seg x1={100 + i * 120 + 42} y1={160} x2={x + 12} y2={208} o={{ stroke: C3.lineSoft }} />
          <Box x={x} y={208} w={24} h={16} o={{ stroke: C3.lineSoft, fill: C3.panel, rx: 3 }} />
        </g>,
      );
    }
  }
  nodes.push(<Label key="l2t" x={400} y={220} s="← 第 2 层：a² 个节点，该层加权 a²·f(n/b²)" cls="tx-sm" anchor="start" fill={C3.soft} />);
  nodes.push(<Label key="vd" x={220} y={250} s="⋮" cls="tx-b" anchor="middle" fill={C3.soft} />);
  nodes.push(<Label key="lh" x={220} y={278} s="共 log_b n 层" cls="tx-sm" anchor="middle" fill={C3.soft} />);
  nodes.push(
    <g key="leaf">
      <Box x={120} y={296} w={200} h={30} text="T(1) 叶子 × n^(log_b a)" o={{ stroke: col, sw: 1.6, fill: C3.panel, tcls: 'tx-sm', ink: col }} />
      <Label x={400} y={316} s="← 叶子层总代价 n^(log_b a)·T(1) = 比较基准" cls="tx-sm" anchor="start" fill={C3.soft} />
    </g>,
  );
  return <>{nodes}</>;
}

/* ---------------- 右侧柱状权重图 ---------------- */
function drawBars(k: number, x0: number, base: number, bw: number, gap: number, scale: number): ReactNode {
  const d = CASE[k];
  const col = COLOR[d.color];
  const items: ReactNode[] = [];
  items.push(<Label key="t" x={x0 - 6} y={base - 108} s="该层加权（相对量级）" cls="tx-sm" anchor="start" fill={C3.soft} />);
  for (let i = 0; i < 4; i++) {
    const x = x0 + i * (bw + gap);
    items.push(
      <g key={i}>
        <Bar3 x={x} base={base} w={bw} h={d.bars[i] * scale} fill={col} />
        <Label x={x + bw / 2} y={base - d.bars[i] * scale - 8} s={d.nums[i]} cls="tx-sm" anchor="middle" fill={col} />
        <Label
          x={x + bw / 2}
          y={base + 16}
          s={BAR_LBL[i].replace('^(log_b a)', '^(log_ba)')}
          cls="tx-sm"
          anchor="middle"
          fill={C3.soft}
        />
      </g>,
    );
  }
  items.push(<Seg key="ax" x1={x0 - 12} y1={base} x2={x0 + 4 * (bw + gap)} y2={base} o={{ stroke: C3.line }} />);
  return <>{items}</>;
}

function View({ frame: f }: { frame: Frame }) {
  if (f.mode === 'tree') {
    const k = f.k;
    if (k === 0) {
      return (
        <>
          {drawTree(k)}
          <rect x={496} y={22} width={W - 512} height={H - 46} rx={8} fill="none" stroke={C3.lineSoft} />
          <Label x={516} y={56} s="主方法的比较基准" cls="tx-b" anchor="start" fill={C3.ink} />
          <Label x={516} y={92} s="n^(log_b a)：递归树叶子层的总代价量级" cls="tx" anchor="start" fill={C3.accent} />
          <Label x={516} y={124} s="三种情况就是把 f(n) 与它作比较：" cls="tx-sm" anchor="start" fill={C3.soft} />
          <Label x={516} y={152} s="· 多项式地更小 → Θ(n^(log_b a))" cls="tx-sm" anchor="start" fill={C3.soft} />
          <Label x={516} y={178} s="· 同阶 → Θ(n^(log_b a) lg n)" cls="tx-sm" anchor="start" fill={C3.soft} />
          <Label x={516} y={204} s="· 多项式地更大（且满足正则条件）→ Θ(f(n))" cls="tx-sm" anchor="start" fill={C3.soft} />
          {drawBars(2, 560, 380, 66, 28, 1)}
          <Label x={516} y={440} s="递归树示意：a = 3、b = 3 画法，实际 a、b 任意" cls="tx-sm" anchor="start" fill={C3.soft} />
        </>
      );
    }
    const d = CASE[k];
    return (
      <>
        {drawTree(k)}
        <rect x={496} y={22} width={W - 512} height={H - 46} rx={8} fill="none" stroke={C3.lineSoft} />
        <Label x={516} y={56} s={d.title} cls="tx-b" anchor="start" fill={COLOR[d.color]} />
        <Label x={516} y={88} s={`条件：${d.cond}`} cls="tx" anchor="start" fill={C3.ink} />
        <Label x={516} y={114} s={d.sub} cls="tx-sm" anchor="start" fill={C3.soft} />
        {drawBars(k, 536, 400, 74, 26, 1)}
        <Label
          x={516}
          y={442}
          s={`${f.phase === 'sum' ? '结论：' : '权重分布：'}${f.phase === 'sum' ? d.res : d.why}`}
          cls="tx-b"
          anchor="start"
          fill={f.phase === 'sum' ? C3.hot : C3.ink}
        />
        {f.phase === 'sum' && <Label x={516} y={468} s={d.ex} cls="tx-sm" anchor="start" fill={C3.soft} />}
      </>
    );
  }

  if (f.mode === 'compare') {
    return (
      <>
        <Label x={30} y={44} s="三种情况的递归树加权分布对比（柱高 = 该层加权）" cls="tx-b" anchor="start" fill={C3.ink} />
        {[1, 2, 3].map((kk, i) => {
          const xx = 40 + i * 320;
          return (
            <g key={kk}>
              <rect x={xx} y={70} width={300} height={400} rx={8} fill="none" stroke={C3.lineSoft} />
              <Label x={xx + 150} y={100} s={CASE[kk].title} cls="tx-b" anchor="middle" fill={COLOR[CASE[kk].color]} />
              <Label x={xx + 150} y={124} s={CASE[kk].cond} cls="tx-sm" anchor="middle" fill={C3.soft} />
              {CASE[kk].bars.map((b, jj) => (
                <g key={jj}>
                  <Bar3 x={xx + 30 + jj * 64} base={320} w={46} h={b} fill={COLOR[CASE[kk].color]} />
                  <Label x={xx + 53 + jj * 64} y={320 - b - 8} s={CASE[kk].nums[jj]} cls="tx-sm" anchor="middle" fill={COLOR[CASE[kk].color]} />
                  <Label x={xx + 53 + jj * 64} y={336} s={['f', 'af', 'a²f', 'n^log'][jj]} cls="tx-sm" anchor="middle" fill={C3.soft} />
                </g>
              ))}
              <Seg x1={xx + 18} y1={320} x2={xx + 282} y2={320} o={{ stroke: C3.line }} />
              <Label
                x={xx + 150}
                y={380}
                s={['逐层递增：叶子主导', '每层相同：叠加 log_b n 层', '逐层递减：根主导'][i]}
                cls="tx-sm"
                anchor="middle"
                fill={C3.soft}
              />
              <Label x={xx + 150} y={412} s={CASE[kk].res} cls="tx" anchor="middle" fill={C3.hot} />
            </g>
          );
        })}
        <Label
          x={40}
          y={496}
          s="判断顺序：先看 f(n) 是否多项式地小于 / 同阶 / 大于 n^(log_b a)；情况 3 还必须额外验证 a·f(n/b) ≤ c·f(n)（c < 1）。"
          cls="tx-sm"
          anchor="start"
          fill={C3.soft}
        />
      </>
    );
  }

  if (f.mode === 'unfit') {
    return (
      <>
        <Label x={30} y={52} s="主方法不适用的例子" cls="tx-b" anchor="start" fill={C3.ink} />
        <Label x={30} y={92} s="T(n) = 4T(n/2) + n² / lg n" cls="tx" anchor="start" fill={C3.hot} />
        <Label x={30} y={126} s="a = 4，b = 2 ⇒ n^(log_b a) = n²，f(n) = n² / lg n" cls="tx" anchor="start" fill={C3.ink} />
        <Label x={30} y={168} s="情况 1：f(n) 比 n² 只小了 lg n 倍，不是多项式地小" cls="tx" anchor="start" fill={C3.ink} />
        <Label x={60} y={196} s="（不存在 ε > 0 使 f(n) = O(n^(2−ε))）⇒ 不成立" cls="tx-sm" anchor="start" fill={C3.soft} />
        <Label x={30} y={236} s="情况 2：f(n) ≠ Θ(n²)（比值 1/lg n → 0）⇒ 不成立" cls="tx" anchor="start" fill={C3.ink} />
        <Label x={30} y={276} s="情况 3：f(n) 并不比 n² 大 ⇒ 不成立" cls="tx" anchor="start" fill={C3.ink} />
        <Seg x1={30} y1={300} x2={960} y2={300} o={{ stroke: C3.lineSoft }} />
        <Label x={30} y={336} s="∴ 这时主方法不适用。" cls="tx-b" anchor="start" fill={C3.hot} />
        <Label x={30} y={372} s="补充（教材结论，PPT 未给出）：该递归式的解为 T(n) = Θ(n² lg lg n)。" cls="tx-sm" anchor="start" fill={C3.soft} />
        <Label x={30} y={396} s="需用递归树逐层求和或代换法验证，不能用主方法的三种情况硬套。" cls="tx-sm" anchor="start" fill={C3.soft} />
        <Label x={30} y={440} s="另一个典型反例：T(n) = T(n/3) + T(2n/3) + cn —— 两个子问题规模不同，主方法同样不适用。" cls="tx-sm" anchor="start" fill={C3.soft} />
      </>
    );
  }

  /* summary：三行总结表 */
  const cols = [30, 150, 470, 700];
  const rows = [
    ['情况', '条件', '结论', '递归树权重分布'],
    ['情况 1', 'f(n) = O(n^(log_b a − ε))，ε > 0', 'T(n) = Θ(n^(log_b a))', '逐层递增，叶子占常数比例'],
    ['情况 2', 'f(n) = Θ(n^(log_b a))', 'T(n) = Θ(n^(log_b a) lg n) = Θ(f(n) lg n)', '每层基本相同，共 log_b n 层'],
    ['情况 3', 'f(n) = Ω(n^(log_b a + ε))，ε > 0 且', 'T(n) = Θ(f(n))', '逐层递减，根占常数比例'],
    ['', 'a·f(n/b) ≤ c·f(n)，c < 1', '', ''],
  ];
  return (
    <>
      <Label x={30} y={46} s="主方法三种情况一览" cls="tx-b" anchor="start" fill={C3.ink} />
      {rows.map((row, i) => {
        const ry = 76 + i * 62;
        return (
          <g key={i}>
            <Seg x1={30} y1={ry - 26} x2={960} y2={ry - 26} o={{ stroke: C3.lineSoft }} />
            {row.map((cell, c2) => (
              <Label
                key={c2}
                x={cols[c2]}
                y={ry}
                s={cell}
                cls={i === 0 ? 'tx-b' : 'tx-sm'}
                anchor="start"
                fill={i === 0 ? C3.ink : i === 3 ? C3.hot : undefined}
              />
            ))}
          </g>
        );
      })}
      <Seg x1={30} y1={76 + 4 * 62 + 40} x2={960} y2={76 + 4 * 62 + 40} o={{ stroke: C3.lineSoft }} />
      <Label x={30} y={76 + 4 * 62 + 70} s="提醒：三种情况都要求递归式形如 T(n) = aT(n/b) + f(n)（a ≥ 1、b > 1、f 渐近正）：" cls="tx-sm" anchor="start" fill={C3.soft} />
      <Label x={30} y={76 + 4 * 62 + 94} s="且子问题规模必须相同；否则（如 T(n)=T(n/3)+T(2n/3)+cn、T(n)=4T(n/2)+n²/lg n）只能用递归树或代换法。" cls="tx-sm" anchor="start" fill={C3.soft} />
    </>
  );
}

export const masterThreeCases: DemoDef<Frame> = { build, View, w: W, h: H };
