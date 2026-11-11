/**
 * 计数排序执行过程（PPT 算例 A=⟨4,1,3,4,3⟩、n=5、k=4，共 20 步）
 * 完整覆盖四个循环（初始化 C / 逐元素计数 / 前缀累加 / 反向填充）
 * 移植自 assets/demos-deck4.js 的 counting-sort
 */
import type { DemoDef, DemoFrame } from './types';
import { Ln, T } from './primitives';

export interface Frame extends DemoFrame {
  loop: string;
  aHi: number;
  cHi: number;
  bHi: number;
  arrows: { from: number; to: number }[];
  c: (number | null)[];
  b: (number | null)[];
  lines: string[];
  /** 第几步（1 起）——原 render() 里的 idx + 1，画在左下角 */
  step: number;
  /** 总步数 ——原 render() 里的 frames.length */
  total: number;
}

type FrameCore = Omit<Frame, 'step' | 'total'>;

const A = [4, 1, 3, 4, 3]; // PPT 算例：A[1]=4、A[2]=1、A[3]=3、A[4]=4、A[5]=3
const N = A.length; // n = 5
const K = 4; // k = 4，关键字取值范围 1..4

const AX = 78, AW = 66, STEP = 72, RH = 46; // A/B 行的起点、格宽、格距、格高
const CX = 546; // C 行的起点横坐标
const YA = 78, YC = 78, YB = 240; // A、C、B 三行的纵坐标
const W = 900;
const H = 470;

export function build(): Frame[] {
  const C: (number | null)[] = [];
  const B: (number | null)[] = [];
  const fr: FrameCore[] = [];
  for (let i = 0; i < K; ++i) { C.push(null); } // C[1..k] 未初始化时用 null 表示
  for (let i = 0; i < N; ++i) { B.push(null); } // B[1..n] 未写入时用 null 表示

  const fmtC = () => { // 打印 C 当前值
    const t: (number | string)[] = [];
    for (let q = 0; q < K; ++q) { t.push(C[q] === null ? '—' : C[q]!); }
    return 'C = [' + t.join(', ') + ']';
  };
  const fmtB = () => { // 打印 B 当前值
    const t: (number | string)[] = [];
    for (let q = 0; q < N; ++q) { t.push(B[q] === null ? '_' : B[q]!); }
    return 'B = [' + t.join(', ') + ']';
  };

  const snap = (
    loop: string,
    aHi: number,
    cHi: number,
    bHi: number,
    arrows: { from: number; to: number }[],
    lines: string[],
    cap: string,
  ) => {
    fr.push({
      loop, aHi, cHi, bHi, arrows: arrows || [],
      c: C.slice(), b: B.slice(), lines, cap,
    });
  };

  /* ---- 第 1 步：初始画面 ---- */
  snap('准备', 0, 0, 0, [], [
    'A = ⟨4, 1, 3, 4, 3⟩，n = 5，k = 4',
    'C[1..4] 尚未初始化',
    'B[1..5] 尚未写入',
  ], '<b>准备</b>：输入数组 A = ⟨4, 1, 3, 4, 3⟩（n = 5），每个关键字都在 1..k = 4 之内；辅助数组 C 有 k = 4 个计数器，输出数组 B 有 n = 5 个位置。');

  /* ---- 循环1：for i ← 1 to k do C[i] ← 0 ---- */
  for (let i = 1; i <= K; ++i) {
    C[i - 1] = 0;
    snap('循环1 · 初始化 C', 0, i, 0, [], [
      'i = ' + i + '：C[' + i + '] ← 0',
      fmtC() + '（' + i + '/' + K + '）',
    ], '<b>循环1 · 初始化 C</b>：' + (i === K
      ? '循环1 结束：for i ← 1 to k 跑完，i = 4 时执行 C[4] ← 0，于是 C = [0, 0, 0, 0]，k = 4 个计数器全部清零。'
      : 'i = ' + i + '，执行 C[' + i + '] ← 0（第 ' + i + ' / ' + K + ' 个计数器）。'));
  }

  /* ---- 循环2：for j ← 1 to n do C[A[j]] ← C[A[j]] + 1 ---- */
  for (let j = 1; j <= N; ++j) {
    const v = A[j - 1];
    C[v - 1] = C[v - 1]! + 1;
    snap('循环2 · 统计次数', j, v, 0, [], [
      'j = ' + j + '：A[' + j + '] = ' + v,
      'C[' + v + '] ← C[' + v + '] + 1 = ' + C[v - 1],
      fmtC(),
    ], '<b>循环2 · 统计次数</b>：' + (j === N
      ? '循环2 结束：j = 5 时 A[5] = 3，执行 C[3] ← C[3] + 1 = 2，得到 C = [1, 0, 2, 2]，此时 C[i] = |{key = i}| —— 值 1 出现 1 次、值 2 出现 0 次、值 3 出现 2 次、值 4 出现 2 次。'
      : 'j = ' + j + '，A[' + j + '] = ' + v + '，执行 C[' + v + '] ← C[' + v + '] + 1 = ' + C[v - 1] + '；' + fmtC() + '。'));
  }

  /* ---- 循环3：for i ← 2 to k do C[i] ← C[i] + C[i-1] ---- */
  for (let i = 2; i <= K; ++i) {
    C[i - 1] = C[i - 1]! + C[i - 2]!;
    snap('循环3 · 前缀累加', 0, i, 0, [], [
      'i = ' + i + '：C[' + i + '] ← C[' + i + '] + C[' + (i - 1) + '] = ' + C[i - 1],
      fmtC(),
    ], '<b>循环3 · 前缀累加</b>：' + (i === K
      ? '循环3 结束：i = 4 时 C[4] ← C[4] + C[3] = 2 + 3 = 5，得到 C = [1, 1, 3, 5]，含义升级为 C[i] = |{key ≤ i}| —— 不超过 4 的元素共 5 个，正好等于 n。'
      : 'i = ' + i + '，C[' + i + '] ← C[' + i + '] + C[' + (i - 1) + '] = ' + C[i - 1] + '，' + fmtC() + '；含义从"等于 i 的个数"变成"不超过 i 的个数"。'));
  }

  /* ---- 循环4：for j ← n downto 1 do B[C[A[j]]] ← A[j]; C[A[j]] ← C[A[j]] - 1 ---- */
  for (let j = N; j >= 1; --j) {
    const v = A[j - 1];
    const pos = C[v - 1]!; // 本次要写入 B 的下标
    B[pos - 1] = v;
    C[v - 1] = C[v - 1]! - 1;
    snap('循环4 · 反向填充', j, v, pos, [{ from: j, to: pos }], [
      'j = ' + j + '：A[' + j + '] = ' + v + '，C[' + v + '] = ' + pos,
      'B[' + pos + '] ← ' + v + '（写入 B 的第 ' + pos + ' 位）',
      'C[' + v + '] ← ' + pos + ' − 1 = ' + C[v - 1],
      fmtC(), fmtB(),
    ], '<b>循环4 · 反向填充</b>：j = ' + j + '，A[' + j + '] = ' + v + '，C[' + v + '] = ' + pos + '，于是 B[' + pos + '] ← ' + v + '；再执行 C[' + v + '] ← ' + pos + ' − 1 = ' + C[v - 1] + '，' + fmtC() + '，' + fmtB() + '。');
  }

  /* ---- 第 19 步：收尾 ---- */
  snap('完成', 0, 0, 0, [], [
    '四个循环全部结束',
    'B = ⟨1, 3, 3, 4, 4⟩ 已有序',
    'C = [' + C.join(', ') + ']（剩余计数）',
  ], '<b>完成</b>：四个循环全部跑完，输出 B = ⟨1, 3, 3, 4, 4⟩ —— 排序完成；此时 C = [0, 1, 1, 3]，每个计数器恰好被"消耗"回它前面元素的总数。');

  /* ---- 第 20 步：稳定性小结 ---- */
  snap('小结 · 稳定性', 0, 0, 0, [], [
    '反向填充（j 从 5 downto 1）',
    'A[5] = 3 先于 A[3] = 3 入 B[3]',
    'A[4] = 4 先于 A[1] = 4 入 B[5]',
    '相等的项保持原有先后次序',
  ], '<b>小结 · 稳定性</b>：因为循环4 是 j 从 n downto 1 反向填充，A[5] = 3 比 A[3] = 3 先落到 B[3]，A[4] = 4 比 A[1] = 4 先落到 B[5]，两个 3、两个 4 的相对次序都没有被打乱 —— 这就是计数排序的稳定性；代价方面四个循环分别是 Θ(k)、Θ(n)、Θ(k)、Θ(n)，总计 Θ(n + k) = Θ(5 + 4)。');

  return fr.map((f, i) => ({ ...f, step: i + 1, total: fr.length }));
}

/** deck4 的 box()：带边框方框；value 非空时在中心写值，hl 取 hot / ok / key / null */
function box(
  x: number,
  y: number,
  w: number,
  h: number,
  value: string | number | null | undefined,
  hl: 'hot' | 'ok' | 'key' | null,
) {
  let fill = 'var(--c-panel-2)';
  let stroke = 'var(--c-line)';
  let sw = 1.4;
  if (hl === 'hot') { fill = 'var(--c-warn-bg)'; stroke = 'var(--c-hot)'; sw = 2.4; }
  else if (hl === 'ok') { fill = 'var(--c-tip-bg)'; stroke = 'var(--c-ok)'; sw = 2.0; }
  else if (hl === 'key') { fill = 'var(--c-key-bg)'; stroke = 'var(--c-accent)'; sw = 1.6; }
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx={5} fill={fill} stroke={stroke} strokeWidth={sw} className="arr-cell" />
      {value !== null && value !== undefined && value !== '' && (
        <text x={x + w / 2} y={y + h / 2 + 5} textAnchor="middle" className={'tx' + (hl === 'hot' ? ' tx-b' : '')}>
          {String(value)}
        </text>
      )}
    </>
  );
}

/** deck4 的 arrow()：从上方方框底部拉一条带箭头的线到下方方框顶部 */
function arrow(x1: number, y1: number, x2: number, y2: number, color?: string) {
  const c = color || 'var(--c-hot)';
  return (
    <>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={2.2} />
      <polygon points={`${x2 - 6},${y2 - 9} ${x2 + 6},${y2 - 9} ${x2},${y2}`} fill={c} />
    </>
  );
}

function View({ frame: f }: { frame: Frame }) {
  return (
    <>
      <T x={26} y={30} s="计数排序演示（A = ⟨4, 1, 3, 4, 3⟩，n = 5，k = 4）" cls="tx-b" />

      {/* ---- A 行：输入数组 ---- */}
      <T x={26} y={106} s="A:" cls="tx-b" color="var(--c-accent)" />
      {A.map((v, k) => {
        const j = k + 1;
        const x = AX + k * STEP;
        return (
          <g key={'a' + k}>
            <T x={x + AW / 2} y={70} s={j} cls="tx-sm" anchor="middle" />
            {box(x, YA, AW, RH, v, f.aHi === j ? 'hot' : null)}
          </g>
        );
      })}

      {/* ---- C 行：计数 / 累加数组 ---- */}
      <T x={494} y={106} s="C:" cls="tx-b" color="var(--c-accent-2)" />
      {Array.from({ length: K }, (_, k) => {
        const i = k + 1;
        const x = CX + k * STEP;
        return (
          <g key={'c' + k}>
            <T x={x + AW / 2} y={70} s={i} cls="tx-sm" anchor="middle" />
            {box(x, YC, AW, RH, f.c[k] === null ? '—' : f.c[k], f.cHi === i ? 'hot' : null)}
          </g>
        );
      })}

      {/* ---- B 行：输出数组（下标标在方框下方，给搬运箭头让位） ---- */}
      <T x={26} y={268} s="B:" cls="tx-b" color="var(--c-accent)" />
      {Array.from({ length: N }, (_, k) => {
        const j = k + 1;
        const x = AX + k * STEP;
        return (
          <g key={'b' + k}>
            {box(x, YB, AW, RH, f.b[k] === null ? '' : f.b[k], f.bHi === j ? 'hot' : null)}
            <T x={x + AW / 2} y={YB + RH + 18} s={j} cls="tx-sm" anchor="middle" />
          </g>
        );
      })}

      {/* ---- 循环4 的搬运箭头：A[j] → B[C[A[j]]] ---- */}
      {f.arrows.map((a, k) => (
        <g key={'ar' + k}>
          {arrow(
            AX + (a.from - 1) * STEP + AW / 2, YA + RH,
            AX + (a.to - 1) * STEP + AW / 2, YB,
          )}
        </g>
      ))}

      {/* ---- 右侧状态面板 ---- */}
      <rect x={486} y={140} width={386} height={300} rx={9} fill="var(--c-panel-2)" stroke="var(--c-line)" strokeWidth={1.2} />
      <T x={504} y={168} s={f.loop} cls="tx-b" color="var(--c-hot)" />
      <Ln x1={504} y1={180} x2={854} y2={180} style={{ stroke: 'var(--c-line)' }} />
      {f.lines.map((ln, i) => (
        <T key={i} x={504} y={206 + i * 26} s={ln} cls="tx" />
      ))}
      <T x={504} y={414} s="含义：C[i] = |{key ≤ i}|（循环3 之后）" cls="tx-sm" />

      {/* ---- 左下角提示与步数 ---- */}
      <T x={26} y={352} s="循环1 初始化 C ｜ 循环2 统计次数 ｜ 循环3 前缀累加 ｜ 循环4 反向填充" cls="tx-sm" />
      <T x={26} y={376} s="高亮格＝本步读写的单元；箭头＝把 A[j] 搬到 B[C[A[j]]]" cls="tx-sm" />
      <T x={AX + AW / 2 + ((N - 1) * STEP) / 2} y={440} s={`第 ${f.step} / ${f.total} 步`} cls="tx-sm" anchor="middle" />
    </>
  );
}

export const countingSort: DemoDef<Frame> = { build, View, w: W, h: H };
