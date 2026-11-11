/**
 * LCS：x = ABCBDAB、y = BDCABA，c 表逐行填充 + b 表回溯出 BCBA（18 帧）
 * 移植自 assets/demos-deck7.js 的 lcs-table
 */
import type { DemoDef, DemoFrame } from './types';
import { T6 } from './deck6-helpers';
import { boxStyle } from './rod-cutting';

export interface Frame extends DemoFrame {
  phase: 'init' | 'row' | 'back' | 'done';
  /** 已填行数 */
  rows: number;
  /** 当前光标格 [i,j] 或 null */
  cur: [number, number] | null;
  /** 是否显示 b 表箭头 */
  showArrow: boolean;
  /** 回溯路径 */
  path: Array<[number, number]>;
  /** 已收集的 LCS 字符 */
  result: string;
  /** c 表快照 */
  c: number[][];
  /** b 表快照（0 左上 / 1 上 / 2 左 / -1 未定） */
  b: number[][];
}

const XS = ' ABCBDAB'; // 下标从 1 开始，X[1..7]
const YS = ' BDCABA'; // 下标从 1 开始，Y[1..6]
const M = 7, N = 6;
const W = 900, H = 430;
const X0 = 158, Y0 = 100, CW = 74, CH = 34;

/** 把 b 表的编码翻译成箭头字符 */
function arrowOf(v: number): string {
  if (v === 0) return '↖';
  if (v === 1) return '↑';
  if (v === 2) return '←';
  return '';
}

function onPath(path: Array<[number, number]>, i: number, j: number): boolean {
  return path.some(([pi, pj]) => pi === i && pj === j);
}

export function build(): Frame[] {
  /* 按 PPT 第 71 页的 LCS-LENGTH 伪代码填表 */
  const C: number[][] = [];
  const B: number[][] = [];
  for (let i = 0; i <= M; ++i) {
    C.push([]);
    B.push([]);
    for (let j = 0; j <= N; ++j) {
      C[i].push(0);
      B[i].push(-1);
    }
  }
  for (let i = 1; i <= M; ++i) {
    for (let j = 1; j <= N; ++j) {
      if (XS.charAt(i) === YS.charAt(j)) {
        C[i][j] = C[i - 1][j - 1] + 1;
        B[i][j] = 0;
      } else if (C[i - 1][j] >= C[i][j - 1]) {
        C[i][j] = C[i - 1][j];
        B[i][j] = 1;
      } else {
        C[i][j] = C[i][j - 1];
        B[i][j] = 2;
      }
    }
  }
  const snap = () => ({ c: C.map((r) => r.slice()), b: B.map((r) => r.slice()) });

  const F: Frame[] = [];
  F.push({
    phase: 'init', rows: 0, cur: null, showArrow: false, path: [], result: '', ...snap(),
    cap: '初始化：c[i,0] = 0（i = 1..7，X 的每个前缀与空串的 LCS 长度为 0）、c[0,j] = 0（j = 0..6）。' +
      'x = ABCBDAB（m = 7），y = BDCABA（n = 6）。',
  });
  for (let i = 1; i <= M; ++i) {
    F.push({
      phase: 'row', rows: i, cur: [i, N], showArrow: false, path: [], result: '', ...snap(),
      cap: `填完第 i = ${i} 行（x[${i}] = ${XS.charAt(i)}）：c[${i},1..6] = [${C[i].slice(1).join(', ')}]。` +
        (i === 1 ? '只有 y[4] = A 与 x[1] = A 相等，所以 c[1,4] = c[0,3] + 1 = 1。' : ''),
    });
  }
  F.push({
    phase: 'row', rows: 7, cur: [7, 6], showArrow: true, path: [], result: '', ...snap(),
    cap: 'c[7,6] = 4 —— 这就是 |LCS(x,y)|。b 表现在也填满了：↖ 表示「末字符相等，取左上 + 1」，' +
      '↑ 表示「上方不小于左方，继承上方」，← 表示「左方更大，继承左方」。',
  });

  /* ---- 回溯：从 (7,6) 走到 (1,0) ---- */
  const path: Array<[number, number]> = [[7, 6]];
  let ci = 7, cj = 6;
  const out: string[] = [];
  const notes: Record<string, string> = {
    '7,6': 'x[7] = B ≠ y[6] = A，且 c[6,6] = 4 ≥ c[7,5] = 4，所以 b[7,6] = ↑，丢 x[7]，走到 (6,6)。',
    '6,6': 'x[6] = A = y[6] = A，b[6,6] = ↖，把 A 收进 LCS，走到 (5,5)。',
    '5,5': 'x[5] = D ≠ y[5] = B，且 c[4,5] = 3 ≥ c[5,4] = 2，b[5,5] = ↑，走到 (4,5)。',
    '4,5': 'x[4] = B = y[5] = B，b[4,5] = ↖，把 B 收进 LCS，走到 (3,4)。',
    '3,4': 'x[3] = C ≠ y[4] = A，且 c[2,4] = 1 < c[3,3] = 2，b[3,4] = ←，走到 (3,3)。',
    '3,3': 'x[3] = C = y[3] = C，b[3,3] = ↖，把 C 收进 LCS，走到 (2,2)。',
    '2,2': 'x[2] = B ≠ y[2] = D，且 c[1,2] = 0 < c[2,1] = 1，b[2,2] = ←，走到 (2,1)。',
    '2,1': 'x[2] = B = y[1] = B，b[2,1] = ↖，把 B 收进 LCS，走到 (1,0)，回溯结束。',
  };
  while (ci > 0 && cj > 0) {
    const key = `${ci},${cj}`;
    if (B[ci][cj] === 0) {
      out.push(XS.charAt(ci));
      ci -= 1;
      cj -= 1;
    } else if (B[ci][cj] === 1) {
      ci -= 1;
    } else {
      cj -= 1;
    }
    path.push([ci, cj]);
    F.push({
      phase: 'back', rows: 7, cur: [ci, cj], showArrow: true, path: path.slice(),
      result: out.slice().reverse().join(''), ...snap(),
      cap: notes[key] + '当前已收集（逆序）：' + (out.length ? out.join('') : '（空）'),
    });
  }
  F.push({
    phase: 'done', rows: 7, cur: null, showArrow: true, path: path.slice(), result: 'BCBA', ...snap(),
    cap: '倒序输出得到 LCS = BCBA，长度 4 = c[7,6]（BDAB 也是长度为 4 的 LCS）。' +
      '回溯 O(m+n) = O(13) 步；填表 Θ(mn) = Θ(42) 个表项，每项常量工作。',
  });
  return F;
}

function View({ frame: f }: { frame: Frame }) {
  const C = f.c;
  const B = f.b;
  return (
    <>
      <T6 x={24} y={24} cls="tx-b" s="LCS：x = ABCBDAB（m = 7）、y = BDCABA（n = 6），c 表逐行填充" />
      <T6 x={24} y={44} cls="tx-sm" s="c[i,j] = c[i−1,j−1] + 1（x[i] = y[j]）；否则 max{ c[i−1,j], c[i,j−1] }。小字 = b[i,j] 的箭头" />

      {/* 表头 */}
      {[1, 2, 3, 4, 5, 6].map((j) => (
        <g key={`hj${j}`}>
          <T6 x={X0 - 40 + j * CW} y={Y0 - 24} anchor="middle" cls="tx-b" s={`j=${j}`} />
          <T6 x={X0 - 40 + j * CW} y={Y0 - 8} anchor="middle" cls="tx-sm" s={YS.charAt(j)} />
        </g>
      ))}
      <T6 x={X0 - 40} y={Y0 - 8} anchor="middle" cls="tx-sm" s="j=0" />
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <g key={`hi${i}`}>
          <T6 x={X0 - 52} y={Y0 + i * CH + CH / 2 + 5} anchor="end" cls="tx-b" s={XS.charAt(i)} />
          <T6 x={X0 - 14} y={Y0 + i * CH + CH / 2 + 5} anchor="end" cls="tx-sm" s={`i=${i}`} />
        </g>
      ))}

      {/* 单元格 */}
      {Array.from({ length: M + 1 }, (_, i) =>
        Array.from({ length: N + 1 }, (_, j) => {
          let hl: string | null = null;
          if (i === 0 || j === 0) hl = null;
          else if (f.phase === 'row' && f.rows >= i) hl = i === f.rows ? 'key' : 'ok';
          if (f.cur && f.cur[0] === i && f.cur[1] === j) hl = 'hot';
          else if (f.path.length && onPath(f.path, i, j)) hl = 'ok';
          const val: number | string = i === 0 || j === 0 ? 0 : f.rows >= i ? C[i][j] : '·';
          const st = boxStyle(hl);
          return (
            <g key={`${i}-${j}`}>
              <rect
                x={X0 - 40 + j * CW}
                y={Y0 + i * CH}
                width={CW - 6}
                height={CH - 6}
                rx={5}
                fill={st.fill}
                stroke={st.stroke}
                strokeWidth={st.sw}
                className="arr-cell"
              />
              <T6 x={X0 - 40 + j * CW + (CW - 6) / 2} y={Y0 + i * CH + (CH - 6) / 2 + 5} anchor="middle" cls={`tx${hl === 'hot' ? ' tx-b' : ''}`} s={String(val)} />
              {f.showArrow && i >= 1 && j >= 1 && (
                <T6 x={X0 - 40 + j * CW + CW - 16} y={Y0 + i * CH + 12} anchor="middle" cls="tx-sm" fill="var(--c-accent-2)" s={arrowOf(B[i][j])} />
              )}
            </g>
          );
        }),
      )}

      {/* 右侧说明 */}
      <rect x={700} y={60} width={176} height={150} rx={8} fill="var(--c-panel)" stroke="var(--c-line)" strokeWidth={1.2} />
      <T6 x={714} y={84} cls="tx tx-b" s="状态" />
      <T6 x={714} y={110} cls="tx-sm" s={`已填行数：${f.rows} / 7`} />
      <T6 x={714} y={134} cls="tx-sm" s={`c[7,6] = ${f.rows >= 7 ? C[7][6] : '待定'}`} />
      <T6 x={714} y={158} cls="tx-sm" s={`已收集：${f.result || '（空）'}`} />
      <T6 x={714} y={182} cls="tx-sm" s={`回溯步数：${Math.max(0, f.path.length - 1)}`} />
      <T6 x={714} y={202} cls="tx-sm" s="↖ = 左上，↑ = 上，← = 左" />

      {/* 底部结论 */}
      <line x1={24} y1={372} x2={876} y2={372} stroke="var(--c-line-soft)" />
      <T6
        x={24}
        y={396}
        cls="tx"
        s={f.phase === 'done' ? 'LCS = BCBA（长度 4）；填表 Θ(mn) = Θ(42)，回溯 O(m+n) = O(13)' : '答案在右下角：c[7,6]；回溯时沿 b 表从 (7,6) 走到 (1,0)'}
      />
      <T6 x={24} y={418} cls="tx-sm" s="不同子问题只有 (m+1)(n+1) = 8×7 = 56 个，而朴素递归的树高 m+n = 13、工作量指数" />
    </>
  );
}

export const lcsTable: DemoDef<Frame> = { build, View, w: W, h: H };
