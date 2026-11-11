/**
 * 矩阵链乘法：P = (30,35,15,5,10,20,25)，m 表按链长递增填充，m(1,6) = 15125（17 帧）
 * 移植自 assets/demos-deck7.js 的 matrix-chain
 */
import type { DemoDef, DemoFrame } from './types';
import { T6 } from './deck6-helpers';
import { boxStyle } from './rod-cutting';

export interface Frame extends DemoFrame {
  phase: 'init' | 'fill' | 'done';
  i: number;
  j: number;
  L: number;
  /** m 表快照（含 0 行/列） */
  m: number[][];
  /** s 表快照 */
  s: number[][];
  cands: Array<{ k: number; a: number; b: number; mul: number; q: number }>;
  best: number;
}

const P = [30, 35, 15, 5, 10, 20, 25]; // p0..p6，n = 6 个矩阵
const N = 6;
const W = 940, H = 430;
const X0 = 128, Y0 = 92, CW = 84, CH = 44;

export function build(): Frame[] {
  /* 按 PPT 第 28 页的伪代码算出 m 表与 s 表 */
  const M: number[][] = [];
  const S: number[][] = [];
  for (let i = 0; i <= N + 1; ++i) {
    M.push([]);
    S.push([]);
    for (let j = 0; j <= N + 1; ++j) {
      M[i].push(0);
      S[i].push(0);
    }
  }
  for (let i = 1; i <= N; ++i) M[i][i] = 0;
  for (let L = 2; L <= N; ++L) {
    for (let i = 1; i <= N - L + 1; ++i) {
      const j = i + L - 1;
      M[i][j] = Infinity;
      for (let k = i; k < j; ++k) {
        const q = M[i][k] + M[k + 1][j] + P[i - 1] * P[k] * P[j];
        if (q < M[i][j]) {
          M[i][j] = q;
          S[i][j] = k;
        }
      }
    }
  }

  const F: Frame[] = [];
  F.push({
    phase: 'init', i: 0, j: 0, L: 1, m: M.map((r) => r.slice()), s: S.map((r) => r.slice()), cands: [], best: Infinity,
    cap: '初始化：m[i][i] = 0（i = 1..6），对角线 6 格全部为 0。之后按链长 L = 2 → 6 逐条反斜线填充。',
  });
  for (let L = 2; L <= N; ++L) {
    for (let i = 1; i <= N - L + 1; ++i) {
      const j = i + L - 1;
      const cands: Array<{ k: number; a: number; b: number; mul: number; q: number }> = [];
      let best = Infinity;
      for (let k = i; k < j; ++k) {
        const q = M[i][k] + M[k + 1][j] + P[i - 1] * P[k] * P[j];
        cands.push({ k, a: M[i][k], b: M[k + 1][j], mul: P[i - 1] * P[k] * P[j], q });
        if (q < best) best = q;
      }
      F.push({
        phase: 'fill', i, j, L, m: M.map((r) => r.slice()), s: S.map((r) => r.slice()), cands, best,
        cap: `L = ${L}，计算 m[${i},${j}]：k = ${S[i][j]} 最优，m[${i},${j}] = ${M[i][j]}；候选值 ${cands
          .map((c) => `k=${c.k}→${c.q}`)
          .join('、')}，记 s[${i},${j}] = ${S[i][j]}。`,
      });
    }
  }
  F.push({
    phase: 'done', i: 1, j: N, L: N, m: M.map((r) => r.slice()), s: S.map((r) => r.slice()), cands: [], best: Infinity,
    cap: 'm[1,6] = 15125，s[1,6] = 3。沿 s 表递归展开得完全括号化方案 ((A1(A2A3))((A4A5)A6))；时间 Θ(n³) = Θ(6³)，空间 Θ(n²)。',
  });
  return F;
}

function View({ frame: f }: { frame: Frame }) {
  const M = f.m;
  const S = f.s;
  return (
    <>
      <T6 x={24} y={26} cls="tx-b" s="矩阵链乘法：P = (30, 35, 15, 5, 10, 20, 25)，m 表按链长 L 递增填充" />
      <T6 x={24} y={46} cls="tx-sm" s="m[i,j] = min{ m[i,k] + m[k+1,j] + p(i−1)·p(k)·p(j) }（i ≤ k < j）；单元格里小字是 s[i,j]" />

      {/* 表头 */}
      <T6 x={X0 - 14} y={Y0 - 12} anchor="end" cls="tx-sm" s="i \\ j" />
      {[1, 2, 3, 4, 5, 6].map((j) => (
        <T6 key={`hj${j}`} x={X0 + (j - 1) * CW + CW / 2} y={Y0 - 12} anchor="middle" cls="tx-sm" s={`j=${j}`} />
      ))}
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <T6 key={`hi${i}`} x={X0 - 8} y={Y0 + (i - 1) * CH + CH / 2 + 5} anchor="end" cls="tx-sm" s={`i=${i}`} />
      ))}

      {/* 单元格 */}
      {[1, 2, 3, 4, 5, 6].map((i) =>
        [1, 2, 3, 4, 5, 6].slice(i - 1).map((j) => {
          let hl: string | null = null;
          if (f.phase === 'fill') {
            if (i === f.i && j === f.j) hl = 'hot';
            else if (j < f.j && j - i + 1 < f.L && M[i][j] !== Infinity) hl = 'ok';
            else if (M[i][j] !== 0 && j - i + 1 < f.L) hl = 'ok';
          }
          if (f.phase === 'done') hl = i === 1 && j === N ? 'hot' : 'ok';
          const txt = i === j ? '0' : String(M[i][j]);
          return (
            <g key={`${i}-${j}`}>
              <rect
                x={X0 + (j - 1) * CW}
                y={Y0 + (i - 1) * CH}
                width={CW - 4}
                height={CH - 4}
                rx={5}
                fill={boxStyle(hl).fill}
                stroke={boxStyle(hl).stroke}
                strokeWidth={boxStyle(hl).sw}
                className="arr-cell"
              />
              <T6 x={X0 + (j - 1) * CW + (CW - 4) / 2} y={Y0 + (i - 1) * CH + (CH - 4) / 2 + 5} anchor="middle" cls={`tx${hl === 'hot' ? ' tx-b' : ''}`} s={txt} />
              {i < j && (
                <T6 x={X0 + (j - 1) * CW + (CW - 4) / 2} y={Y0 + (i - 1) * CH + CH - 8} anchor="middle" cls="tx-sm" s={`s=${S[i][j]}`} />
              )}
            </g>
          );
        }),
      )}

      {/* 依赖关系提示：标出本步用到的两格 */}
      {f.phase === 'fill' && f.cands.length > 0 ? (
        (() => {
          const kk = S[f.i][f.j];
          return (
            <T6
              x={24}
              y={Y0 + 6 * CH + 16}
              cls="tx-sm"
              s={`本步用到的表项：m[${f.i},${kk}] = ${M[f.i][kk]}、m[${kk + 1},${f.j}] = ${M[kk + 1][f.j]}；乘积项 p${f.i - 1}·p${kk}·p${f.j} = ${P[f.i - 1] * P[kk] * P[f.j]}`}
            />
          );
        })()
      ) : (
        <T6 x={24} y={Y0 + 6 * CH + 16} cls="tx-sm" s="对角线 6 格（m[i][i] = 0）已填好；每条反斜线对应一个链长 L" />
      )}

      {/* 右侧面板：候选值 */}
      <rect x={24} y={Y0 + 6 * CH + 28} width={892} height={44} rx={8} fill="var(--c-panel)" stroke="var(--c-line)" strokeWidth={1.2} />
      {f.phase === 'fill' ? (
        <T6
          x={38}
          y={Y0 + 6 * CH + 52}
          cls="tx-sm"
          s={`候选：${f.cands.map((c) => `k=${c.k}: ${c.a}+${c.b}+${c.mul}=${c.q}`).join('　|　')}　⇒ 取最小 ${f.best}`}
        />
      ) : f.phase === 'done' ? (
        <T6 x={38} y={Y0 + 6 * CH + 52} cls="tx" s="m(1,6) = 15125（最优），s(1,6) = 3；方案 ((A1(A2A3))((A4A5)A6))；m(2,5) = 7125、s(2,5) = 3" />
      ) : (
        <T6 x={38} y={Y0 + 6 * CH + 52} cls="tx-sm" s="提示：m(2,5) 的三个候选是 13000（k=2）、7125（k=3）、11375（k=4），取 7125" />
      )}
    </>
  );
}

export const matrixChain: DemoDef<Frame> = { build, View, w: W, h: H };
