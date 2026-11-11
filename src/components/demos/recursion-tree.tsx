/**
 * 递归树 T(n) = T(n/4) + T(n/2) + n² 逐层生长（7 帧）
 * 移植自 assets/demos-deck3.js 的 recursion-tree
 */
import type { DemoDef, DemoFrame } from './types';
import { Box, C3, Label, Seg } from './deck3-helpers';

export interface Frame extends DemoFrame {
  /** 当前帧序号 0..6 */
  step: number;
  /** 已展开到第几层 0..4 */
  shown: number;
}

const W = 990, H = 500;

const LY = [46, 126, 206, 286, 358]; // 各层纵坐标
const TN = [1, 2, 4, 8, 16]; // 各层节点数
const CTXT = ['1', '5/16', '25/256', '125/4096', '625/65536'];
const CUM = ['1.0000', '1.3125', '1.4102', '1.4407', '1.4502'];
const TX = 40, TW = 520; // 树的绘制区
const RX = 600; // 右侧表格区

const CAPS = [
  '第 0 步：递归式 <b>T(n) = T(n/4) + T(n/2) + n²</b>。根节点代表规模 n 的问题，"划分 + 合并"的代价是 <b>n²</b>；' +
    '两个子问题规模分别是 n/4 与 n/2，<b>子问题规模不相等</b>，所以本例不能用主方法，只能用递归树 + 代换法。',
  '第 1 步：展开第 1 层，得到 (n/4)² 与 (n/2)² 两个节点。该层代价 = (n/4)² + (n/2)² = (1/16 + 1/4)n² = <b>5n²/16</b>；' +
    '累计和 = n² + 5n²/16 = 1.3125n²。',
  '第 2 步：展开第 2 层，4 个节点的代价 = (n/16)² + (n/8)² + (n/8)² + (n/4)² = <b>25n²/256</b> ≈ 0.0977n²；' +
    '累计和 ≈ 1.4102n²。可见每层代价都是上一层的 <b>5/16</b> 倍。',
  '第 3 步：展开第 3 层，8 个节点的代价 = 25n²/256 × 5/16 = <b>125n²/4096</b> ≈ 0.0305n²；累计和 ≈ 1.4407n²。' +
    '层代价已经衰减到不足 n² 的 3.1%。',
  '第 4 步：展开第 4 层共 16 个节点，该层代价 = <b>625n²/65536</b> ≈ 0.0095n²；累计和 ≈ 1.4502n²，' +
    '与最终的 1.4545n² 只差 0.0043n² —— <b>几何级数基本收敛</b>。',
  '第 5 步：各层代价构成公比 r = 5/16 &lt; 1 的等比数列，故 和 = n²(1 + 5/16 + (5/16)² + (5/16)³ + …) ' +
    '= n² · 1/(1 − 5/16) = <b>16n²/11 ≈ 1.4545n²</b>，即 <b>O(n²)</b>。',
  '第 6 步：结论 <b>T(n) = Θ(n²)</b>。下界 Ω(n²) 由根节点代价直接给出（T(n) ≥ n²）；' +
    '上界 O(n²) 由上面的收敛级数给出。递归树给出的猜想，还要用代换法严格验证。',
];

function popcount(x: number): number {
  let c = 0;
  let v = x;
  while (v > 0) {
    c += v & 1;
    v = v >> 1;
  }
  return c;
}

/** 第 i 层第 j 个节点的子问题分母：4^k · 2^(i−k)，k = j 的二进制中 1 的个数 */
function denom(i: number, j: number): number {
  const k = popcount(j);
  return Math.pow(4, k) * Math.pow(2, i - k);
}

function nodeText(i: number, j: number): string {
  if (i === 0) return 'n²';
  if (i > 3) return ''; // 第 4 层节点太小，只画方块
  return `(n/${denom(i, j)})²`;
}

export function build(): Frame[] {
  return CAPS.map((cap, step) => ({ cap, step, shown: Math.min(step, 4) }));
}

function View({ frame: f }: { frame: Frame }) {
  const shown = f.shown;
  const pos: Array<Array<{ x: number; y: number }>> = [];
  const nodes: React.ReactNode[] = [];

  for (let i = 0; i <= shown; i++) {
    const n = TN[i];
    pos[i] = [];
    const w = Math.min(88, TW / n - 6);
    const h = 30;
    const y = LY[i];
    for (let j = 0; j < n; j++) {
      const x = TX + (j + 0.5) * (TW / n);
      pos[i][j] = { x, y };
      const isNew = i === shown && f.step <= 4;
      nodes.push(
        <g key={`${i}-${j}`}>
          {i >= 1 && (
            <Seg
              x1={pos[i - 1][Math.floor(j / 2)].x}
              y1={pos[i - 1][Math.floor(j / 2)].y + h / 2}
              x2={x}
              y2={y - h / 2}
              o={{ stroke: isNew ? C3.accent : C3.line }}
            />
          )}
          <Box
            x={x - w / 2}
            y={y - h / 2}
            w={w}
            h={h}
            text={nodeText(i, j)}
            o={{
              fill: i === 0 ? C3.keyBg : C3.panel,
              stroke: isNew ? C3.accent : C3.line,
              sw: isNew ? 1.8 : 1.1,
              cls: `node-rect${isNew ? ' hb-in' : ''}`,
              tcls: i >= 3 ? 'tx-sm' : 'tx',
              ink: i === 0 ? C3.accent : undefined,
            }}
          />
        </g>,
      );
    }
  }

  return (
    <>
      {nodes}

      {/* 叶子层标注 */}
      {shown === 4 && (
        <Label x={TX + TW / 2} y={LY[4] + 34} s="第 4 层：16 个节点，继续细分直到 Θ(1)" cls="tx-sm" anchor="middle" fill={C3.soft} />
      )}
      <Label x={TX} y={22} s="T(n) = T(n/4) + T(n/2) + n²" cls="tx-b" anchor="start" fill={C3.ink} />
      <Label x={TX + TW} y={LY[0] + 34} s="根：代价 n²" cls="tx-sm" anchor="end" fill={C3.soft} />

      {/* ---------------- 右侧：层代价与累计和 ---------------- */}
      <rect x={RX - 16} y={22} width={W - RX + 4} height={H - 46} rx={8} fill="none" stroke={C3.lineSoft} />
      <Label x={RX} y={46} s="层代价与累计和（× n²）" cls="tx-b" anchor="start" fill={C3.ink} />
      <Label x={RX} y={74} s="层" cls="tx-sm" anchor="start" fill={C3.soft} />
      <Label x={RX + 50} y={74} s="节点数" cls="tx-sm" anchor="start" fill={C3.soft} />
      <Label x={RX + 130} y={74} s="该层代价" cls="tx-sm" anchor="start" fill={C3.soft} />
      <Label x={RX + 250} y={74} s="累计和" cls="tx-sm" anchor="start" fill={C3.soft} />

      {Array.from({ length: shown + 1 }, (_, i) => {
        const y = 100 + i * 26;
        const strong = i === shown && f.step <= 4;
        const col = strong ? C3.accent : undefined;
        return (
          <g key={i}>
            <Label x={RX} y={y} s={`第 ${i} 层`} cls="tx-sm" anchor="start" fill={col} />
            <Label x={RX + 50} y={y} s={String(TN[i])} cls="tx-sm" anchor="start" fill={col} />
            <Label x={RX + 130} y={y} s={CTXT[i]} cls="tx-sm" anchor="start" fill={col} />
            <Label x={RX + 250} y={y} s={CUM[i]} cls="tx-sm" anchor="start" fill={col} />
          </g>
        );
      })}

      {f.step >= 5 && (
        <>
          <Seg x1={RX} y1={236} x2={W - 24} y2={236} o={{ stroke: C3.line }} />
          <Label x={RX} y={264} s="和 = n²(1 + 5/16 + (5/16)² + (5/16)³ + …)" cls="tx" anchor="start" fill={C3.ink} />
          <Label x={RX} y={292} s="公比 r = 5/16 < 1 ⇒ 几何级数收敛" cls="tx-sm" anchor="start" fill={C3.soft} />
          <Label x={RX} y={320} s="= n² · 1/(1 − 5/16) = 16n²/11 ≈ 1.4545n²" cls="tx" anchor="start" fill={C3.accent2} />
          <Label x={RX} y={356} s="⇒ T(n) = Θ(n²)" cls="tx-b" anchor="start" fill={C3.hot} />
          {f.step === 6 && (
            <>
              <Label x={RX} y={390} s="对照：5/16 < 1 ⇒ 级数收敛，根层主导" cls="tx-sm" anchor="start" fill={C3.soft} />
              <Label x={RX} y={412} s="（主方法要求子问题规模相同，本例不适用）" cls="tx-sm" anchor="start" fill={C3.soft} />
            </>
          )}
        </>
      )}
    </>
  );
}

export const recursionTree: DemoDef<Frame> = { build, View, w: W, h: H };
