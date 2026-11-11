/**
 * RANDOMIZED-SELECT：⟨6,10,13,5,8,3,2,11⟩ 求第 3 小，只递归划分的一边（22 帧）
 * 移植自 assets/demos-deck5.js 的 randomized-select
 */
import type { DemoDef, DemoFrame } from './types';
import { T6 } from './deck6-helpers';

export interface Frame extends DemoFrame {
  /** 当前数组（1 起下标的显示顺序） */
  arr: number[];
  p: number;
  r: number;
  /** 目标名次 i */
  tgt: number;
  /** 主元位置 */
  xPos: number;
  /** 划分指针 i */
  iPtr: number;
  /** 扫描位置 j */
  jPos: number;
  /** 划分返回下标 */
  q: number;
  /** 主元名次 k = q − p + 1 */
  k: number;
  /** 判定值 */
  res: number;
  /** 仍在考虑的区间 [lo..hi]（区间外 = 已丢弃） */
  lo: number;
  hi: number;
  /** 阶段名 */
  phase: string;
  /** 图内结论 */
  note: string;
}

const N = 8;
const X0 = 105, STEP = 96, BW = 78, BH = 54, Y0 = 70;
const W = 960, H = 380;
const sx = (pos: number) => X0 + (pos - 1) * STEP;

/* 帧数据（逐字移植原 F 数组的 arr/指针/解说） */
const F: Array<Omit<Frame, 'cap'>> = [
  { arr: [6, 10, 13, 5, 8, 3, 2, 11], p: 1, r: 8, tgt: 3, xPos: 0, iPtr: 0, jPos: 0, q: 0, k: 0, res: 0, lo: 1, hi: 8, phase: '① 入口',
    note: 'A = ⟨6,10,13,5,8,3,2,11⟩，p = 1，r = 8，i = 3' },
  { arr: [8, 10, 13, 5, 6, 3, 2, 11], p: 1, r: 8, tgt: 3, xPos: 1, iPtr: 1, jPos: 0, q: 0, k: 0, res: 0, lo: 1, hi: 8, phase: '② 随机取主元',
    note: 'RANDOMIZED-PARTITION 选中 A[5] = 8，与 A[1] = 6 交换 ⇒ x = A[1] = 8' },
  { arr: [8, 10, 13, 5, 6, 3, 2, 11], p: 1, r: 8, tgt: 3, xPos: 1, iPtr: 1, jPos: 2, q: 0, k: 0, res: 0, lo: 1, hi: 8, phase: '② 划分（j = 2）',
    note: 'j = 2：A[2] = 10 > 8 ⇒ 跳过，i 仍为 1' },
  { arr: [8, 10, 13, 5, 6, 3, 2, 11], p: 1, r: 8, tgt: 3, xPos: 1, iPtr: 1, jPos: 3, q: 0, k: 0, res: 0, lo: 1, hi: 8, phase: '② 划分（j = 3）',
    note: 'j = 3：A[3] = 13 > 8 ⇒ 跳过，i 仍为 1' },
  { arr: [8, 5, 13, 10, 6, 3, 2, 11], p: 1, r: 8, tgt: 3, xPos: 1, iPtr: 2, jPos: 4, q: 0, k: 0, res: 0, lo: 1, hi: 8, phase: '② 划分（j = 4）',
    note: 'j = 4：A[4] = 5 ≤ 8 ⇒ i = 2，交换 A[2] 与 A[4]' },
  { arr: [8, 5, 6, 10, 13, 3, 2, 11], p: 1, r: 8, tgt: 3, xPos: 1, iPtr: 3, jPos: 5, q: 0, k: 0, res: 0, lo: 1, hi: 8, phase: '② 划分（j = 5）',
    note: 'j = 5：A[5] = 6 ≤ 8 ⇒ i = 3，交换 A[3] 与 A[5]' },
  { arr: [8, 5, 6, 3, 13, 10, 2, 11], p: 1, r: 8, tgt: 3, xPos: 1, iPtr: 4, jPos: 6, q: 0, k: 0, res: 0, lo: 1, hi: 8, phase: '② 划分（j = 6）',
    note: 'j = 6：A[6] = 3 ≤ 8 ⇒ i = 4，交换 A[4] 与 A[6]' },
  { arr: [8, 5, 6, 3, 2, 10, 13, 11], p: 1, r: 8, tgt: 3, xPos: 1, iPtr: 5, jPos: 7, q: 0, k: 0, res: 0, lo: 1, hi: 8, phase: '② 划分（j = 7）',
    note: 'j = 7：A[7] = 2 ≤ 8 ⇒ i = 5，交换 A[5] 与 A[7]' },
  { arr: [8, 5, 6, 3, 2, 10, 13, 11], p: 1, r: 8, tgt: 3, xPos: 1, iPtr: 5, jPos: 8, q: 0, k: 0, res: 0, lo: 1, hi: 8, phase: '② 划分（j = 8）',
    note: 'j = 8：A[8] = 11 > 8 ⇒ 跳过；扫描结束，i = 5' },
  { arr: [2, 5, 6, 3, 8, 10, 13, 11], p: 1, r: 8, tgt: 3, xPos: 5, iPtr: 5, jPos: 0, q: 5, k: 0, res: 0, lo: 1, hi: 8, phase: '② 收尾：确定 q',
    note: '交换 A[1] 与 A[5] ⇒ ⟨2,5,6,3,8,10,13,11⟩，q = 5' },
  { arr: [2, 5, 6, 3, 8, 10, 13, 11], p: 1, r: 8, tgt: 3, xPos: 5, iPtr: 5, jPos: 0, q: 5, k: 5, res: 0, lo: 1, hi: 4, phase: '③ 只递归一边',
    note: 'k = 5 − 1 + 1 = 5 > i = 3 ⇒ 递归左半边 A[1..4]，右半边 A[5..8] 丢弃' },
  { arr: [6, 5, 2, 3, 8, 10, 13, 11], p: 1, r: 4, tgt: 3, xPos: 1, iPtr: 1, jPos: 0, q: 0, k: 0, res: 0, lo: 1, hi: 4, phase: '② 第二层：取主元',
    note: '第二层 p = 1，r = 4，i = 3；选中 A[3] = 6，与 A[1] = 2 交换' },
  { arr: [6, 5, 2, 3, 8, 10, 13, 11], p: 1, r: 4, tgt: 3, xPos: 1, iPtr: 2, jPos: 2, q: 0, k: 0, res: 0, lo: 1, hi: 4, phase: '② 第二层：j = 2',
    note: 'j = 2：A[2] = 5 ≤ 6 ⇒ i = 2' },
  { arr: [6, 5, 2, 3, 8, 10, 13, 11], p: 1, r: 4, tgt: 3, xPos: 1, iPtr: 3, jPos: 3, q: 0, k: 0, res: 0, lo: 1, hi: 4, phase: '② 第二层：j = 3',
    note: 'j = 3：A[3] = 2 ≤ 6 ⇒ i = 3' },
  { arr: [6, 5, 2, 3, 8, 10, 13, 11], p: 1, r: 4, tgt: 3, xPos: 1, iPtr: 4, jPos: 4, q: 0, k: 0, res: 0, lo: 1, hi: 4, phase: '② 第二层：j = 4',
    note: 'j = 4：A[4] = 3 ≤ 6 ⇒ i = 4；扫描结束' },
  { arr: [3, 5, 2, 6, 8, 10, 13, 11], p: 1, r: 4, tgt: 3, xPos: 4, iPtr: 4, jPos: 0, q: 4, k: 4, res: 0, lo: 1, hi: 4, phase: '② 第二层：确定 q',
    note: '交换 A[1] 与 A[4] ⇒ ⟨3,5,2,6⟩，q = 4，k = 4 − 1 + 1 = 4' },
  { arr: [3, 5, 2, 6, 8, 10, 13, 11], p: 1, r: 4, tgt: 3, xPos: 4, iPtr: 4, jPos: 0, q: 4, k: 4, res: 0, lo: 1, hi: 3, phase: '③ 只递归一边',
    note: 'i = 3 < k = 4 ⇒ 递归左半边 A[1..3]，A[4..8] 丢弃' },
  { arr: [5, 3, 2, 6, 8, 10, 13, 11], p: 1, r: 3, tgt: 3, xPos: 1, iPtr: 1, jPos: 0, q: 0, k: 0, res: 0, lo: 1, hi: 3, phase: '② 第三层：取主元',
    note: '第三层 p = 1，r = 3，i = 3；选中 A[2] = 5，与 A[1] = 3 交换' },
  { arr: [5, 3, 2, 6, 8, 10, 13, 11], p: 1, r: 3, tgt: 3, xPos: 1, iPtr: 2, jPos: 2, q: 0, k: 0, res: 0, lo: 1, hi: 3, phase: '② 第三层：j = 2',
    note: 'j = 2：A[2] = 3 ≤ 5 ⇒ i = 2' },
  { arr: [5, 3, 2, 6, 8, 10, 13, 11], p: 1, r: 3, tgt: 3, xPos: 1, iPtr: 3, jPos: 3, q: 0, k: 0, res: 0, lo: 1, hi: 3, phase: '② 第三层：j = 3',
    note: 'j = 3：A[3] = 2 ≤ 5 ⇒ i = 3；扫描结束' },
  { arr: [2, 3, 5, 6, 8, 10, 13, 11], p: 1, r: 3, tgt: 3, xPos: 3, iPtr: 3, jPos: 0, q: 3, k: 3, res: 3, lo: 1, hi: 3, phase: '④ 命中答案',
    note: '交换 A[1] 与 A[3] ⇒ ⟨2,3,5⟩，q = 3，k = 3 = i ⇒ 返回 A[3] = 5' },
  { arr: [2, 3, 5, 6, 8, 10, 13, 11], p: 1, r: 3, tgt: 3, xPos: 3, iPtr: 3, jPos: 0, q: 3, k: 3, res: 3, lo: 1, hi: 3, phase: '⑤ 结论',
    note: '答案 5：排序后 2,3,5,6,8,10,11,13 的第 3 个正是 5' },
];

/* 解说（desc，与 F 逐帧对应） */
const DESC = [
  '输入 A = ⟨6,10,13,5,8,3,2,11⟩，p = 1、r = 8、i = 3：在 8 个数里找<b>第 3 小</b>。RANDOMIZED-SELECT 与快速排序同模型，区别是它每次<b>只递归划分的一边</b>。',
  'RANDOMIZED-PARTITION 等概率地选中 <b>A[5] = 8</b> 作主元（概率 1/8），先把它与 A[p] = 6 交换，数组变成 ⟨8,10,13,5,6,3,2,11⟩；<b>x = A[1] = 8</b>，划分指针 i = p = 1。',
  'j = 2：A[2] = 10 与 x = 8 比较，<b>10 &gt; 8</b> 不满足 A[j] ≤ x，i 保持 1 —— 10 属于"大于主元"的一段。',
  'j = 3：A[3] = 13 &gt; x = 8，同样跳过，i 仍为 1。前两个元素都进了"≥ x"那一段。',
  'j = 4：A[4] = 5 ≤ x = 8，i 递增到 <b>2</b>，交换 A[2] 与 A[4] → ⟨8,5,13,10,6,3,2,11⟩；"≤ x" 段现在有 1 个元素。',
  'j = 5：A[5] = 6 ≤ 8，i = <b>3</b>，交换 A[3] 与 A[5] → ⟨8,5,6,10,13,3,2,11⟩。',
  'j = 6：A[6] = 3 ≤ 8，i = <b>4</b>，交换 A[4] 与 A[6] → ⟨8,5,6,3,13,10,2,11⟩。',
  'j = 7：A[7] = 2 ≤ 8，i = <b>5</b>，交换 A[5] 与 A[7] → ⟨8,5,6,3,2,10,13,11⟩；"≤ x" 段已有 4 个元素。',
  'j = 8：A[8] = 11 &gt; 8，跳过。扫描到 r = 8 结束，此时 i = <b>5</b>，A[2..5] 是"≤ x"段，A[6..8] 是"&gt; x"段。',
  '收尾：交换 A[p] = A[1]（值 8）与 A[i] = A[5]（值 2）→ ⟨2,5,6,3,8,10,13,11⟩，返回 <b>q = 5</b>。左边 4 个都 ≤ 8，右边 3 个都 ≥ 8，主元 8 已经"一步到位"。',
  'k = q − p + 1 = 5 − 1 + 1 = <b>5</b>：主元 8 是第 5 小。目标 i = 3 &lt; k = 5，所以第 3 小一定在左半边 → 递归 RANDOMIZED-SELECT(A, 1, 4, 3)；<b>右半边 A[5..8] 整段丢弃</b>（8、10、13、11 都不可能是第 3 小）。',
  '第二层：p = 1、r = 4、i = 3（还是找第 3 小）。随机选中 <b>A[3] = 6</b>，与 A[1] = 2 交换 → ⟨6,5,2,3⟩；x = A[1] = 6，i = 1。',
  'j = 2：A[2] = 5 ≤ 6，i 递增到 <b>2</b>，交换 A[2] 与 A[2]（数组不变）。',
  'j = 3：A[3] = 2 ≤ 6，i = <b>3</b>，数组仍为 ⟨6,5,2,3⟩。',
  'j = 4：A[4] = 3 ≤ 6，i = <b>4</b>，扫描到 r = 4 结束，区间里的 4 个数全都 ≤ 6。',
  '收尾交换 A[1] 与 A[4] → ⟨3,5,2,6⟩，返回 <b>q = 4</b>，k = 4 − 1 + 1 = <b>4</b>：主元 6 是第 4 小。',
  '目标 i = 3 &lt; k = 4，第 3 小在左半边 → 递归 RANDOMIZED-SELECT(A, 1, 3, 3)，<b>A[4..8] 丢弃</b>。注意：每一层都只往一边走，走完的区间规模是 8 → 4 → 3。',
  '第三层：p = 1、r = 3、i = 3。随机选中 <b>A[2] = 5</b>，与 A[1] = 3 交换 → ⟨5,3,2⟩；x = 5，i = 1。',
  'j = 2：A[2] = 3 ≤ 5，i = <b>2</b>。',
  'j = 3：A[3] = 2 ≤ 5，i = <b>3</b>，扫描结束（3 个数全部 ≤ 5）。',
  '收尾交换 A[1] 与 A[3] → ⟨2,3,5⟩，返回 q = 3，k = 3 − 1 + 1 = <b>3 = i</b> ⇒ 主元就是答案，<b>返回 A[3] = 5</b>。',
  '答案 <b>5</b>，与"排序后取第 3 个"一致（2,3,<b>5</b>,6,8,10,11,13）。三层划分的规模是 8 → 4 → 3，总代价 ≤ c·8 + c·4 + c·3 = 15c = <b>O(n)</b>；正因为每层只进一边，期望运行时间才是 Θ(n)。',
];

export function build(): Frame[] {
  return F.map((f, idx) => ({ ...f, cap: DESC[idx] }));
}

function View({ frame: f }: { frame: Frame }) {
  const cells: React.ReactNode[] = [];
  for (let pos = 1; pos <= N; ++pos) {
    const act = pos >= f.lo && pos <= f.hi;
    let hl: string;
    if (pos === f.xPos) hl = 'hot';
    else if (pos === f.q) hl = 'ok';
    else if (!act) hl = 'dead';
    else hl = 'key';
    const styleMap: Record<string, { fill: string; stroke: string; sw: number }> = {
      hot: { fill: 'var(--c-warn-bg)', stroke: 'var(--c-hot)', sw: 2.6 },
      ok: { fill: 'var(--c-tip-bg)', stroke: 'var(--c-ok)', sw: 2.2 },
      key: { fill: 'var(--c-key-bg)', stroke: 'var(--c-accent)', sw: 1.8 },
      dead: { fill: 'var(--c-panel)', stroke: 'var(--c-line-soft)', sw: 1.0 },
    };
    const st = styleMap[hl];
    cells.push(
      <g key={pos}>
        <rect x={sx(pos)} y={Y0} width={BW} height={BH} rx={6} fill={st.fill} stroke={st.stroke} strokeWidth={st.sw} className="arr-cell" />
        <T6 x={sx(pos) + BW / 2} y={Y0 + BH / 2 + 6} anchor="middle" cls={`tx${hl === 'hot' ? ' tx-b' : ''}`} s={f.arr[pos - 1]} />
        <T6 x={sx(pos) + BW / 2} y={Y0 + BH + 18} anchor="middle" cls="tx-sm" s={String(pos)} />
      </g>,
    );
  }

  /* 当前子问题的区间括号 */
  const x1 = sx(f.lo), x2 = sx(f.hi) + BW, yb = Y0 + BH + 26;

  return (
    <>
      <T6 x={26} y={24} cls="tx-b" s="RANDOMIZED-SELECT(A, 1, 8, 3)：随机主元 → 划分 → 只递归一边" />
      <T6 x={26} y={46} cls="tx-sm" s={`${f.phase}　|　灰色虚框 = 已经丢弃、不再参与递归的元素`} />
      {cells}

      <line x1={x1} y1={yb} x2={x2} y2={yb} stroke="var(--c-accent)" strokeWidth={1.6} />
      <line x1={x1} y1={yb - 6} x2={x1} y2={yb + 6} stroke="var(--c-accent)" strokeWidth={1.6} />
      <line x1={x2} y1={yb - 6} x2={x2} y2={yb + 6} stroke="var(--c-accent)" strokeWidth={1.6} />
      <T6 x={x1} y={yb + 20} anchor="middle" cls="tx-sm" fill="var(--c-accent)" s={`p=${f.p}`} />
      <T6 x={x2} y={yb + 20} anchor="middle" cls="tx-sm" fill="var(--c-accent)" s={`r=${f.r}`} />

      {f.jPos > 0 && (
        <T6 x={sx(f.jPos) + BW / 2} y={yb + 42} anchor="middle" cls="tx-sm" fill="var(--c-accent-2)" s={`↑ j=${f.jPos}`} />
      )}
      {f.iPtr > 0 && (
        <T6 x={sx(f.iPtr) + BW / 2} y={yb + 60} anchor="middle" cls="tx-sm" fill="var(--c-hot)" s={`↑ i=${f.iPtr}`} />
      )}

      {/* 状态面板 */}
      <rect x={40} y={238} width={880} height={80} rx={10} fill="var(--c-panel)" stroke="var(--c-line)" strokeWidth={1.2} />
      <T6
        x={58}
        y={264}
        cls="tx"
        s={`p = ${f.p}　r = ${f.r}　i（目标名次）= ${f.tgt}　x = ${f.xPos ? `A[${f.xPos}] = ${f.arr[f.xPos - 1]}` : '—'}`}
      />
      <T6
        x={58}
        y={288}
        cls="tx"
        s={`q = ${f.q || '—'}　k = q−p+1 = ${f.k || '—'}　i（划分指针）= ${f.iPtr || '—'}　j = ${f.jPos || '—'}`}
      />
      <T6
        x={58}
        y={310}
        cls="tx-sm"
        s={f.res ? `判定 res = ${f.res}，与目标 i = ${f.tgt} 比较` : '比较规则：i = k 返回 A[q]；i < k 递归左边；i > k 递归右边并令 i ← i − k'}
      />

      {/* 图内结论 */}
      <T6 x={26} y={348} cls="tx" s={f.note} />
    </>
  );
}

export const randomizedSelect: DemoDef<Frame> = { build, View, w: W, h: H };
