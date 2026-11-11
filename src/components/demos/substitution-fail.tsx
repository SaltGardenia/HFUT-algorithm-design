/**
 * 代换法：猜 O(n²) 失败（余项 −n）→ 加强假设 c₁k² − c₂k 成功（8 帧）
 * 移植自 assets/demos-deck3.js 的 substitution-fail
 */
import type { DemoDef, DemoFrame } from './types';
import { C3, Label, Seg } from './deck3-helpers';

export interface Frame extends DemoFrame {
  /** 当前步号 0..7 */
  step: number;
  /** 推导行显示到第几行（含） */
  showed: number;
  /** 前半段为失败状态（余项 −n < 0） */
  failing: boolean;
}

const W = 990, H = 640;

const ROWS: Array<{ t: string; k: 'goal' | 'hyp' | 'sub' | 'rem' | 'fail' | 'fix' | 'ok' }> = [
  { t: '目标：T(n) = 4T(n/2) + n，已知 T(1) = Θ(1)，猜测 T(n) = O(n²)', k: 'goal' },
  { t: '第一步（猜）：归纳假设对所有 k < n 有 T(k) ≤ c·k²（c > 0）', k: 'hyp' },
  { t: '第二步（验）：T(n) = 4T(n/2) + n', k: 'sub' },
  { t: '                ≤ 4c(n/2)² + n = cn² + n', k: 'sub' },
  { t: '                = cn² − (−n)        ← 期望 − 余项，余项 = −n', k: 'rem' },
  { t: '要得到 T(n) ≤ cn²，就必须有余项 −n ≥ 0，即 n ≤ 0', k: 'fail' },
  { t: '但 n ≥ 1 时恒有 −n < 0 ⇒ 没有任何 c > 0 能满足 ⇒ 失败！', k: 'fail' },
  { t: '第三步（补救）：加强假设，减一个低阶项 T(k) ≤ c₁k² − c₂k', k: 'fix' },
  { t: 'T(n) = 4(c₁(n/2)² − c₂(n/2)) + n = c₁n² − 2c₂n + n', k: 'fix' },
  { t: '     = c₁n² − c₂n − (c₂n − n)     ← 期望 − 余项', k: 'fix' },
  { t: '只要 c₂ ≥ 1，余项 c₂n − n ≥ 0 ⇒ T(n) ≤ c₁n² − c₂n ≤ c₁n²  ✔', k: 'ok' },
  { t: '再取足够大的 c₁ 使 1 ≤ n < n₀ 时 Θ(1) ≤ c₁n² − c₂n ⇒ T(n) = O(n²) 得证', k: 'ok' },
];
const REVEAL = [2, 4, 5, 7, 8, 10, 11, 12];

const CAPS = [
  '第 1 步：代换法三步走 —— <b>① 猜测解的形式 ② 通过推导验证 ③ 解出常数</b>。本例 T(n) = 4T(n/2) + n，假设 T(1) = Θ(1)，' +
    '先猜一个<b>偏松</b>的界 T(n) = O(n³) 可以验证成功（见正文），若直接猜 O(n²)：归纳假设为对所有 k &lt; n 有 T(k) ≤ c·k²。',
  '第 2 步：把假设代入递归式：T(n) = 4T(n/2) + n ≤ 4c(n/2)² + n = <b>cn² + n</b>。注意这里用的是"对所有更小规模成立"的归纳假设。',
  '第 3 步：把结果写成"<b>期望 − 余项</b>"的形式：cn² + n = cn² − (−n)，于是余项 = <b>−n</b>。',
  '第 4 步：要由"期望 − 余项 ≤ 期望"推出 T(n) ≤ cn²，必须 余项 ≥ 0；但 −n &lt; 0 对一切 n ≥ 1 恒成立，' +
    '<b>没有任何 c &gt; 0 能满足</b> ⇒ 这个证明是<b>错的</b>，不能据此断言 T(n) = O(n²)。',
  '第 5 步：补救思想 —— <b>加强推导的假设</b>：减一个低阶项，设对所有 k &lt; n 有 T(k) ≤ c₁k² − c₂k（c₂ 为待定正常数）。',
  '第 6 步：把加强后的假设代入：T(n) = 4(c₁(n/2)² − c₂(n/2)) + n = c₁n² − 2c₂n + n = c₁n² − c₂n − (c₂n − n)，' +
    '余项变成了 <b>c₂n − n</b>。',
  '第 7 步：只要 <b>c₂ ≥ 1</b>，余项 c₂n − n ≥ 0 对所有 n 成立 ⇒ T(n) ≤ c₁n² − c₂n ≤ c₁n²，上界 O(n²) 成立 ✔。',
  '第 8 步：再选<b>足够大的 c₁</b> 使初始条件成立（1 ≤ n &lt; n₀ 时 Θ(1) ≤ c₁n² − c₂n）；下界 Ω(n²) 可由 T(n) ≥ n² 得到，' +
    '故 <b>T(n) = Θ(n²)</b>。这个界比 n³ 紧得多，也说明"猜错不要紧，关键是余项必须非负"。',
];

function rowColor(k: string): string | undefined {
  if (k === 'fail') return C3.hot;
  if (k === 'ok') return C3.ok;
  if (k === 'fix') return C3.accent2;
  if (k === 'goal') return C3.ink;
  return undefined;
}

export function build(): Frame[] {
  return CAPS.map((cap, step) => ({ cap, step, showed: REVEAL[step], failing: step <= 3 }));
}

function View({ frame: f }: { frame: Frame }) {
  const showed = f.showed;
  const failing = f.failing;
  const expY = [578, 556];
  const actY = failing ? [560, 544] : [592, 574];
  const bx = 640;

  return (
    <>
      <rect x={18} y={16} width={954} height={452} rx={8} fill="none" stroke={C3.lineSoft} />
      <Label x={34} y={42} s="推导过程（每步都要盯住余项的符号）" cls="tx-b" anchor="start" fill={C3.ink} />

      {ROWS.slice(0, showed).map((row, i) => {
        const y = 76 + i * 32;
        const isCursor = i === showed - 1;
        const col = isCursor ? C3.accent : rowColor(row.k);
        return (
          <g key={i}>
            {isCursor && (
              <rect x={28} y={y - 19} width={934} height={26} rx={4} fill={C3.keyBg} stroke="none" className="step-box hb-in" />
            )}
            <Label x={40} y={y} s={row.t} cls={isCursor ? 'tx-b' : 'tx'} anchor="start" fill={col} />
          </g>
        );
      })}

      {/* ---------------- 下部：余项符号的可视化 ---------------- */}
      <Seg x1={34} y1={486} x2={954} y2={486} o={{ stroke: C3.line }} />
      <Label
        x={34}
        y={512}
        s={
          failing
            ? '当前假设：T(k) ≤ c·k²（余项 = −n，恒为负）'
            : '当前假设：T(k) ≤ c₁k² − c₂k（余项 = c₂n − n ≥ 0，c₂ ≥ 1）'
        }
        cls="tx-b"
        anchor="start"
        fill={failing ? C3.hot : C3.ok}
      />

      {/* 左：两条曲线的位置关系 */}
      <Seg x1={60} y1={600} x2={380} y2={600} o={{ stroke: C3.line }} />
      <Seg x1={60} y1={540} x2={60} y2={600} o={{ stroke: C3.line }} />
      <Seg x1={70} y1={expY[0]} x2={370} y2={expY[1]} o={{ stroke: C3.accent, dash: '6 4', sw: 1.6 }} />
      <Seg x1={70} y1={actY[0]} x2={370} y2={actY[1]} o={{ stroke: failing ? C3.hot : C3.ok, sw: 2 }} />
      <Label x={374} y={expY[1] + 4} s={failing ? '期望 cn²' : '期望 c₁n²'} cls="tx-sm" anchor="start" fill={C3.accent} />
      <Label
        x={374}
        y={actY[1] + 4}
        s={failing ? '实际上界 cn² + n' : '实际上界 c₁n² − c₂n'}
        cls="tx-sm"
        anchor="start"
        fill={failing ? C3.hot : C3.ok}
      />
      <Seg
        x1={200}
        y1={expY[0] + (expY[1] - expY[0]) * 0.42}
        x2={200}
        y2={actY[0] + (actY[1] - actY[0]) * 0.42}
        o={{ stroke: failing ? C3.hot : C3.ok, sw: 1.4, dash: '3 3' }}
      />
      <Label
        x={60}
        y={618}
        s={failing ? '实际上界跑到了期望的上方 ⇒ 不等式不成立' : '实际上界压在期望的下方 ⇒ 不等式成立'}
        cls="tx-sm"
        anchor="start"
        fill={C3.soft}
      />

      {/* 右：余项符号徽标 */}
      <rect
        x={bx}
        y={530}
        width={314}
        height={76}
        rx={8}
        fill={failing ? 'var(--warn-bg)' : 'var(--tip-bg)'}
        stroke={failing ? C3.hot : C3.ok}
        strokeWidth={1.6}
      />
      <Label
        x={bx + 16}
        y={560}
        s={failing ? '余项 = −n < 0（n ≥ 1）' : '余项 = c₂n − n ≥ 0（c₂ ≥ 1）'}
        cls="tx-b"
        anchor="start"
        fill={failing ? C3.hot : C3.ok}
      />
      <Label
        x={bx + 16}
        y={588}
        s={failing ? '找不到任何 c > 0 ⇒ 证明失败' : 'T(n) ≤ c₁n² − c₂n ≤ c₁n² ⇒ 证明成功'}
        cls="tx-sm"
        anchor="start"
        fill={C3.soft}
      />
    </>
  );
}

export const substitutionFail: DemoDef<Frame> = { build, View, w: W, h: H };
