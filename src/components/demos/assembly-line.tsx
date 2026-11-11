/**
 * 装配线调度：f1/f2 逐站填充，f* = 38 与最快路径回溯（14 帧）
 * a1/a2、t1/t2、e、x 取值与 PPT 第 82~89 页的 f / l 表自洽
 * 移植自 assets/demos-deck7.js 的 assembly-line
 */
import type { DemoDef, DemoFrame } from './types';
import { T6 } from './deck6-helpers';
import { boxStyle } from './rod-cutting';

export interface Frame extends DemoFrame {
  phase: 'init' | 'fill' | 'end' | 'path' | 'done';
  /** 已算到的站号 */
  j: number;
  /** fill 阶段正在算的线（0 无 / 1 线1 / 2 线2） */
  line: number;
  /** 最快路径 [line, station]（回溯帧才有） */
  path: Array<[number, number]>;
  /** f1 / f2 / l1 / l2 快照（下标 1..6） */
  f1: number[];
  f2: number[];
  l1: number[];
  l2: number[];
}

const A1 = [0, 7, 9, 3, 4, 8, 4], A2 = [0, 8, 5, 6, 4, 5, 7]; // 两线的装配时间
const T1 = [0, 2, 3, 1, 3, 4], T2 = [0, 2, 1, 2, 2, 1]; // 两线的换线传输时间
const N = 6;
const W = 940, H = 330;
const X0 = 150, YB1 = 78, YB2 = 182, BW = 92, BH = 40, BG = 12;

function onPath(path: Array<[number, number]>, line: number, j: number): boolean {
  return path.some(([pl, pj]) => pl === line && pj === j);
}

export function build(): Frame[] {
  /* 按 FASTEST-WAY 的递推式算出 f1、f2、l1、l2 */
  const F1: number[] = [], F2: number[] = [], L1: number[] = [], L2: number[] = [];
  for (let j = 0; j <= N; ++j) {
    F1.push(0);
    F2.push(0);
    L1.push(0);
    L2.push(0);
  }
  F1[1] = 2 + A1[1]; // e1 + a11 = 9
  F2[1] = 4 + A2[1]; // e2 + a21 = 12
  for (let j = 2; j <= N; ++j) {
    if (F1[j - 1] + A1[j] <= F2[j - 1] + T2[j - 1] + A1[j]) {
      F1[j] = F1[j - 1] + A1[j];
      L1[j] = 1;
    } else {
      F1[j] = F2[j - 1] + T2[j - 1] + A1[j];
      L1[j] = 2;
    }
    if (F2[j - 1] + A2[j] <= F1[j - 1] + T1[j - 1] + A2[j]) {
      F2[j] = F2[j - 1] + A2[j];
      L2[j] = 2;
    } else {
      F2[j] = F1[j - 1] + T1[j - 1] + A2[j];
      L2[j] = 1;
    }
  }
  const snap = () => ({ f1: F1.slice(), f2: F2.slice(), l1: L1.slice(), l2: L2.slice() });

  const FR: Frame[] = [];
  FR.push({
    phase: 'init', j: 1, line: 0, path: [], ...snap(),
    cap: '初始化第 1 站：f1[1] = e1 + a11 = 2 + 7 = 9，f2[1] = e2 + a21 = 4 + 8 = 12。' +
      '之后 j = 2 → 6 逐站递推，每站对两条线各做一次二选一。',
  });
  for (let j = 2; j <= N; ++j) {
    FR.push({
      phase: 'fill', j, line: 1, path: [], ...snap(),
      cap: `j = ${j}，线 1：min(f1[${j - 1}]+a1,${j} = ${F1[j - 1]}+${A1[j]} = ${F1[j - 1] + A1[j]}，` +
        `f2[${j - 1}]+t2,${j - 1}+a1,${j} = ${F2[j - 1]}+${T2[j - 1]}+${A1[j]} = ${F2[j - 1] + T2[j - 1] + A1[j]}` +
        `) → f1[${j}] = ${F1[j]}，l1[${j}] = ${L1[j]}。`,
    });
    FR.push({
      phase: 'fill', j, line: 2, path: [], ...snap(),
      cap: `j = ${j}，线 2：min(f2[${j - 1}]+a2,${j} = ${F2[j - 1]}+${A2[j]} = ${F2[j - 1] + A2[j]}，` +
        `f1[${j - 1}]+t1,${j - 1}+a2,${j} = ${F1[j - 1]}+${T1[j - 1]}+${A2[j]} = ${F1[j - 1] + T1[j - 1] + A2[j]}` +
        `) → f2[${j}] = ${F2[j]}，l2[${j}] = ${L2[j]}。`,
    });
  }
  FR.push({
    phase: 'end', j: N, line: 0, path: [], ...snap(),
    cap: '出口比较：f1[6] + x1 = 35 + 3 = 38，f2[6] + x2 = 37 + 2 = 39，取较小者 → f* = 38，l* = 1。',
  });
  FR.push({
    phase: 'path', j: N, line: 1, path: [[1, 6], [2, 5], [2, 4], [1, 3], [2, 2], [1, 1]], ...snap(),
    cap: '回溯：l1[6] = 2 → 线 2 站 5；l2[5] = 2 → 线 2 站 4；l2[4] = 1 → 线 1 站 3；' +
      'l1[3] = 2 → 线 2 站 2；l2[2] = 1 → 线 1 站 1。',
  });
  FR.push({
    phase: 'done', j: N, line: 1, path: [[1, 6], [2, 5], [2, 4], [1, 3], [2, 2], [1, 1]], ...snap(),
    cap: '最快路径：线1站1 → 线2站2 → 线1站3 → 线2站4 → 线2站5 → 线1站6，总时间 38。' +
      '时间 Θ(n) = Θ(6)、空间 Θ(n)；蛮力法要枚举 Ω(2ⁿ) = Ω(64) 条路线。',
  });
  return FR;
}

function View({ frame: f }: { frame: Frame }) {
  return (
    <>
      <T6 x={24} y={24} cls="tx-b" s="装配线调度：2 条线 × 6 个工作站" />
      <T6 x={24} y={44} cls="tx-sm" s="框内 = 装配时间 a(i,j)；框下粗体 = 最快时间 f(i,j)；小字 = 前驱线号 l(i,j)" />

      <T6 x={60} y={YB1 + 26} cls="tx" s="线 1" />
      <T6 x={60} y={YB2 + 26} cls="tx" s="线 2" />

      {[1, 2, 3, 4, 5, 6].map((j) => {
        let hl1: string | null = null;
        let hl2: string | null = null;
        if (f.phase === 'fill' && f.j === j) {
          hl1 = f.line === 1 ? 'hot' : null;
          hl2 = f.line === 2 ? 'hot' : null;
        }
        if (f.path.length) {
          if (onPath(f.path, 1, j)) hl1 = 'ok';
          if (onPath(f.path, 2, j)) hl2 = 'ok';
        }
        if (f.phase === 'end') {
          hl1 = 'ok';
          hl2 = 'ok';
        }
        const st1 = boxStyle(hl1);
        const st2 = boxStyle(hl2);
        return (
          <g key={j}>
            <rect x={X0 + (j - 1) * (BW + BG)} y={YB1} width={BW} height={BH} rx={5} fill={st1.fill} stroke={st1.stroke} strokeWidth={st1.sw} className="arr-cell" />
            <rect x={X0 + (j - 1) * (BW + BG)} y={YB2} width={BW} height={BH} rx={5} fill={st2.fill} stroke={st2.stroke} strokeWidth={st2.sw} className="arr-cell" />
            <T6 x={X0 + (j - 1) * (BW + BG) + BW / 2} y={YB1 + BH / 2 + 5} anchor="middle" cls={`tx${hl1 === 'hot' ? ' tx-b' : ''}`} s={A1[j]} />
            <T6 x={X0 + (j - 1) * (BW + BG) + BW / 2} y={YB2 + BH / 2 + 5} anchor="middle" cls={`tx${hl2 === 'hot' ? ' tx-b' : ''}`} s={A2[j]} />
            <T6 x={X0 + (j - 1) * (BW + BG) + BW / 2} y={YB1 - 8} anchor="middle" cls="tx-sm" s={`S1,${j}`} />
            <T6 x={X0 + (j - 1) * (BW + BG) + BW / 2} y={YB2 + BH + 22} anchor="middle" cls="tx-sm" s={`S2,${j}`} />
            {/* f 值与 l 值（只显示已算出的） */}
            {j <= f.j ? (
              <>
                <T6 x={X0 + (j - 1) * (BW + BG) + BW / 2} y={YB1 + BH + 18} anchor="middle" cls="tx tx-b" s={`f=${f.f1[j]}`} />
                <T6 x={X0 + (j - 1) * (BW + BG) + BW / 2} y={YB1 + BH + 33} anchor="middle" cls="tx-sm" s={j === 1 ? 'l=–' : `l=${f.l1[j]}`} />
                <T6 x={X0 + (j - 1) * (BW + BG) + BW / 2} y={YB2 - 20} anchor="middle" cls="tx tx-b" s={`f=${f.f2[j]}`} />
                <T6 x={X0 + (j - 1) * (BW + BG) + BW / 2} y={YB2 - 6} anchor="middle" cls="tx-sm" s={j === 1 ? 'l=–' : `l=${f.l2[j]}`} />
              </>
            ) : (
              <>
                <T6 x={X0 + (j - 1) * (BW + BG) + BW / 2} y={YB1 + BH + 18} anchor="middle" cls="tx-sm" s="f=?" />
                <T6 x={X0 + (j - 1) * (BW + BG) + BW / 2} y={YB2 - 20} anchor="middle" cls="tx-sm" s="f=?" />
              </>
            )}
          </g>
        );
      })}

      {/* 换线传输时间（斜线标注） */}
      {[1, 2, 3, 4, 5].map((j) => (
        <g key={`t${j}`}>
          <line
            x1={X0 + (j - 1) * (BW + BG) + BW - 6}
            y1={YB1 + BH}
            x2={X0 + j * (BW + BG) + 6}
            y2={YB2}
            stroke="var(--c-accent-2)"
            strokeWidth={1.2}
            strokeDasharray="4 3"
          />
          <line
            x1={X0 + (j - 1) * (BW + BG) + BW - 6}
            y1={YB2}
            x2={X0 + j * (BW + BG) + 6}
            y2={YB1 + BH}
            stroke="var(--c-accent-2)"
            strokeWidth={1.2}
            strokeDasharray="4 3"
          />
          <T6 x={X0 + (j - 1) * (BW + BG) + BW + 4} y={YB1 + BH + 34} cls="tx-sm" s={`t1=${T1[j]}`} />
          <T6 x={X0 + (j - 1) * (BW + BG) + BW + 4} y={YB2 - 34} cls="tx-sm" s={`t2=${T2[j]}`} />
        </g>
      ))}

      {/* 底部汇总 */}
      <line x1={24} y1={268} x2={916} y2={268} stroke="var(--c-line-soft)" />
      <T6 x={24} y={292} cls="tx" s={`f1 = [${f.f1.slice(1).join(', ')}]　　f2 = [${f.f2.slice(1).join(', ')}]`} />
      <T6
        x={24}
        y={314}
        cls={`tx${f.phase === 'end' || f.phase === 'done' || f.phase === 'path' ? ' tx-b' : ''}`}
        s={
          f.phase === 'end' || f.phase === 'done' || f.phase === 'path'
            ? 'f* = min(35 + 3, 37 + 2) = 38，l* = 1'
            : '出口时间：f1[6] + x1 与 f2[6] + x2 取较小者（x1 = 3、x2 = 2）'
        }
      />
      <T6 x={560} y={292} cls="tx-sm" s="时间 Θ(n)，空间 Θ(n)，蛮力 Ω(2ⁿ)" />
    </>
  );
}

export const assemblyLine: DemoDef<Frame> = { build, View, w: W, h: H };
