/**
 * 钢条切割：n = 4，p = [1,5,8,9]，自底向上填 r[0..4] 与 s[1..4]，回溯方案 2+2（15 帧）
 * 移植自 assets/demos-deck7.js 的 rod-cutting
 */
import type { DemoDef, DemoFrame } from './types';
import { T6 } from './deck6-helpers';

export interface Frame extends DemoFrame {
  phase: 'init' | 'fill' | 'plan' | 'done';
  /** 当前轮长度 j（fill 阶段） */
  j: number;
  /** 当前枚举的首段长度 i（fill 阶段） */
  i: number;
  /** r 表快照（null = 未计算） */
  r: Array<number | null>;
  /** s 表快照（null = 未计算） */
  s: Array<number | null>;
  /** 本步的候选值列表 */
  cands: Array<{ i: number; v: number; best: boolean }>;
  /** 已回溯出的方案 */
  plan: string;
}

const N = 4;
const P = [0, 1, 5, 8, 9]; // p[1..4]，下标 0 不用
const W = 900, H = 380;
const CX = 132, CW = 66, CG = 8;
const Y_P = 64, Y_R = 146, Y_S = 216;

/* box 高亮样式（hl 取 hot / ok / key / dep / null），deck7 各动画共用 */
export function boxStyle(hl: string | null): { fill: string; stroke: string; sw: number } {
  switch (hl) {
    case 'hot': return { fill: 'var(--c-warn-bg)', stroke: 'var(--c-hot)', sw: 2.4 };
    case 'ok': return { fill: 'var(--c-tip-bg)', stroke: 'var(--c-ok)', sw: 1.8 };
    case 'key': return { fill: 'var(--c-key-bg)', stroke: 'var(--c-accent)', sw: 2.0 };
    case 'dep': return { fill: 'var(--dep-bg)', stroke: 'var(--c-accent-2)', sw: 1.8 };
    default: return { fill: 'var(--c-panel-2)', stroke: 'var(--c-line)', sw: 1.4 };
  }
}

function Box({
  x, y, w, h, value, hl, small,
}: {
  x: number; y: number; w: number; h: number;
  value: number | string | null;
  hl: string | null;
  small?: string;
}) {
  const st = boxStyle(hl);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={5} fill={st.fill} stroke={st.stroke} strokeWidth={st.sw} className="arr-cell" />
      {value !== null && value !== undefined && value !== '' && (
        <T6 x={x + w / 2} y={y + h / 2 + 5} anchor="middle" cls={`tx${hl === 'hot' ? ' tx-b' : ''}`} s={value} />
      )}
      {small && <T6 x={x + w / 2} y={y + h - 8} anchor="middle" cls="tx-sm" s={small} />}
    </g>
  );
}

export function build(): Frame[] {
  const F: Frame[] = [];
  const R: Array<number | null> = [0, null, null, null, null];
  const S: Array<number | null> = [null, null, null, null, null];

  F.push({
    phase: 'init', j: 0, i: 0, r: R.slice(), s: S.slice(), cands: [], plan: '',
    cap: '初始状态：p = [1, 5, 8, 9]（i = 1..4），r[0] = 0 是唯一已知项，' +
      '其余 r[1..4] 与 s[1..4] 都还空着。接下来按 j = 1 → 4（逆拓扑序）逐格填。',
  });

  for (let j = 1; j <= N; ++j) {
    let q = -Infinity;
    let best = 0;
    const cands: Array<{ i: number; v: number; best: boolean }> = [];
    for (let i = 1; i <= j; ++i) {
      const v = P[i] + (R[j - i] as number);
      cands.push({ i, v, best: v > q });
      if (v > q) {
        q = v;
        best = i;
      }
      F.push({
        phase: 'fill', j, i, r: R.slice(), s: S.slice(), cands: cands.slice(), plan: '',
        cap: `j = ${j}，i = ${i}：候选 = p[${i}] + r[${j - i}] = ${P[i]} + ${R[j - i]} = ${v}；当前最大值 q = ${q}` +
          (v === q ? `（更新最大值，s[${j}] = ${best}）` : '（不更优，保持不变）') + '。',
      });
    }
    R[j] = q;
    S[j] = best;
  }

  F.push({
    phase: 'plan', j: 0, i: 0, r: R.slice(), s: S.slice(), cands: [], plan: '',
    cap: '表已填完：r = [0, 1, 5, 8, 10]、s = [–, 1, 2, 3, 2]。回头核对 8 种方案：' +
      '4 → 9、1+3 → 9、2+2 → 10、3+1 → 9、1+1+2 → 7、1+2+1 → 7、2+1+1 → 7、1+1+1+1 → 4 —— 最大值 10 与 r[4] 一致。',
  });
  F.push({
    phase: 'plan', j: 0, i: 0, r: R.slice(), s: S.slice(), cands: [], plan: '2',
    cap: '表填完：r = [0, 1, 5, 8, 10]、s = [–, 1, 2, 3, 2]。开始回溯：s[4] = 2，说明最优方案的第一段切 2 英寸，剩余 4 − 2 = 2 英寸。',
  });
  F.push({
    phase: 'plan', j: 0, i: 0, r: R.slice(), s: S.slice(), cands: [], plan: '2 + 2',
    cap: '剩余长度 2：s[2] = 2，再切一段 2 英寸，剩余 2 − 2 = 0，回溯结束。方案 = 2 + 2。',
  });
  F.push({
    phase: 'done', j: 0, i: 0, r: R.slice(), s: S.slice(), cands: [], plan: '2 + 2',
    cap: '回溯完成：s[4] = 2 → 2 + 2 = 4，总收益 p[2] + p[2] = 5 + 5 = 10 = r[4]。' +
      '整个算法只做了 10 次加法（Σ j = 1+2+3+4），时间 Θ(n²)、空间 Θ(n)；而朴素递归要展开 2⁴ = 16 个调用结点、8 个叶结点。',
  });
  return F;
}

function View({ frame: f }: { frame: Frame }) {
  return (
    <>
      <T6 x={24} y={26} cls="tx-b" s="钢条切割：n = 4，p = [1, 5, 8, 9]，自底向上求 r[0..4]" />
      <T6 x={24} y={46} cls="tx-sm" s="r[j] = 长度 j 的最大收益；s[j] = 该长度的最优方案里第一段切多长" />

      {/* 第一行：价格表 */}
      <T6 x={24} y={Y_P + 22} cls="tx" s="价格 p[i]" />
      {[1, 2, 3, 4].map((i) => (
        <g key={`p${i}`}>
          <Box x={CX + (i - 1) * (CW + CG)} y={Y_P} w={CW} h={32} value={P[i]} hl={f.phase === 'fill' && f.i === i ? 'hot' : null} />
          <T6 x={CX + (i - 1) * (CW + CG) + CW / 2} y={Y_P - 6} anchor="middle" cls="tx-sm" s={`i=${i}`} />
        </g>
      ))}

      {/* 第二行：r[0..4] */}
      <T6 x={24} y={Y_R + 22} cls="tx" s="r[0..4]" />
      {[0, 1, 2, 3, 4].map((k) => {
        let hl: string | null = null;
        if (f.phase === 'fill') {
          if (k === f.j - f.i) hl = 'dep';
          if (k === f.j) hl = 'hot';
        }
        if (f.phase === 'plan' && (k === 4 || k === 2)) hl = 'ok';
        return (
          <g key={`r${k}`}>
            <Box x={CX + k * (CW + CG)} y={Y_R} w={CW} h={32} value={f.r[k] === null ? '?' : f.r[k]!} hl={hl} />
            <T6 x={CX + k * (CW + CG) + CW / 2} y={Y_R - 6} anchor="middle" cls="tx-sm" s={`j=${k}`} />
          </g>
        );
      })}

      {/* 第三行：s[1..4] */}
      <T6 x={24} y={Y_S + 22} cls="tx" s="s[1..4]" />
      {[1, 2, 3, 4].map((k) => {
        let hl: string | null = f.phase === 'fill' && k === f.j ? 'hot' : null;
        if (f.phase === 'plan' && f.s[k] !== null) hl = 'ok';
        return <Box key={`s${k}`} x={CX + k * (CW + CG)} y={Y_S} w={CW} h={32} value={f.s[k] === null ? '?' : f.s[k]!} hl={hl} />;
      })}

      {/* 右侧面板：本步的候选值 */}
      <rect x={496} y={58} width={380} height={210} rx={8} fill="var(--c-panel)" stroke="var(--c-line)" strokeWidth={1.2} />
      <T6 x={512} y={82} cls="tx tx-b" s={f.phase === 'fill' ? `第 j = ${f.j} 轮：枚举 i = 1..${f.j}` : '表的最终状态'} />
      {f.cands.map((v, k) => {
        const line = `i = ${v.i}：p[${v.i}] + r[${f.j - v.i}] = ${P[v.i]} + ${f.r[f.j - v.i]} = ${v.v}${v.best ? '  ← 目前最大' : ''}`;
        return (
          <T6
            key={k}
            x={512}
            y={106 + k * 22}
            cls={`tx-sm${v.best ? ' tx-b' : ''}`}
            fill={v.best ? 'var(--c-hot)' : 'var(--c-ink-soft)'}
            s={line}
          />
        );
      })}
      {f.phase === 'fill' ? (
        <T6 x={512} y={106 + f.cands.length * 22 + 10} cls="tx-sm" s={`r[${f.j}] 与 s[${f.j}] 要等 i 枚举完才定下来`} />
      ) : (
        <>
          <T6 x={512} y={106} cls="tx-sm" s="r = [0, 1, 5, 8, 10]" />
          <T6 x={512} y={128} cls="tx-sm" s="s = [–, 1, 2, 3, 2]" />
          <T6 x={512} y={150} cls="tx-sm" s="r[4] = 10 = p2 + p2 = 5 + 5" />
          <T6 x={512} y={172} cls="tx-sm" s="回溯：n = 4 → s[4] = 2" />
          <T6 x={512} y={194} cls="tx-sm" s="　　　n = 2 → s[2] = 2 → n = 0" />
        </>
      )}

      {/* 底部：方案与公式 */}
      <line x1={24} y1={282} x2={876} y2={282} stroke="var(--c-line-soft)" />
      <T6 x={24} y={306} cls="tx" s="递推式：r[j] = max{ p[i] + r[j−i] }（1 ≤ i ≤ j），r[0] = 0" />
      <T6
        x={24}
        y={332}
        cls={`tx${f.phase === 'done' ? ' tx-b' : ''}`}
        s={`当前最优方案：${f.plan === '' ? '（尚未回溯）' : f.plan}`}
      />
      <T6
        x={24}
        y={356}
        cls="tx-sm"
        s="复杂度：时间 Θ(n²) = 10 次加法（n = 4），空间 Θ(n)；朴素递归 Θ(2ⁿ) = 16 个调用结点"
      />
    </>
  );
}

export const rodCutting: DemoDef<Frame> = { build, View, w: W, h: H };
