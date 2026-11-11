/**
 * Hanoi 塔：3 个盘子、7 次移动逐帧演示 + T(n) = 2T(n−1)+1 归纳（12 帧）
 * 移植自 assets/demos-deck6.js 的 hanoi-tower
 */
import type { DemoDef, DemoFrame } from './types';
import { Panel, T6 } from './deck6-helpers';

export interface Frame extends DemoFrame {
  kind: 'board' | 'summary';
  title: string;
  pegs: number[][];
  hot: { peg: number; size: number } | null;
  move: { disk: number; from: number; to: number } | null;
  count: number;
  lines: string[];
}

const W = 760, H = 400;
const PEGX = [140, 380, 620]; // A、B、C 三根柱子的横坐标
const PEG_TOP = 118, BASE_Y = 340;
const DISK_H = 22, DISK_STEP = 26;
const PEG_NAME = ['A', 'B', 'C'];
/** 盘子宽度：盘 1/2/3 → 56 / 84 / 112 */
const diskW = (size: number) => 56 + 28 * (size - 1);

// 7 次移动（搬的是哪号盘、从哪根柱子到哪根柱子）
const MOVES = [
  { disk: 1, from: 0, to: 2 },
  { disk: 2, from: 0, to: 1 },
  { disk: 1, from: 2, to: 1 },
  { disk: 3, from: 0, to: 2 },
  { disk: 1, from: 1, to: 0 },
  { disk: 2, from: 1, to: 2 },
  { disk: 1, from: 0, to: 2 },
];

/** 剥掉原 cap 自带的「第 X / 12 步：」前缀（播放器已有步数 chip） */
const stripPrefix = (s: string) => s.replace(/^第 \d+ \/ \d+ 步：/, '');

export function build(): Frame[] {
  const fr: Frame[] = [];
  const pegs: number[][] = [[3, 2, 1], [], []];

  const snap = (o: Partial<Frame> & { title: string; cap: string }) => {
    fr.push({
      kind: o.kind || 'board',
      title: o.title,
      pegs: [pegs[0].slice(), pegs[1].slice(), pegs[2].slice()],
      hot: o.hot || null,
      move: o.move || null,
      count: o.count || 0,
      lines: o.lines || [],
      cap: stripPrefix(o.cap),
    });
  };

  /* 第 1 步：初始画面 */
  snap({
    title: '初始状态：3 个盘子全部在 A 柱',
    count: 0,
    cap: '初始状态 —— 3 个盘子按“小在上、大在下”叠在 A 柱，B、C 两根柱子空着；' +
      '目标是整摞搬到 C 柱。最少移动次数 T(3) = 2^3 − 1 = 7 次。',
  });

  /* 第 2~8 步：7 次真实移动 */
  for (let k = 0; k < MOVES.length; ++k) {
    const mv = MOVES[k];
    const top = pegs[mv.from].pop()!; // 从源柱顶上取下一个盘子
    pegs[mv.to].push(top); // 压到目标柱顶上
    snap({
      title: `第 ${k + 1} 次移动：盘 ${mv.disk} 从 ${PEG_NAME[mv.from]} 移到 ${PEG_NAME[mv.to]}`,
      hot: { peg: mv.to, size: mv.disk },
      move: mv,
      count: k + 1,
      cap: `第 ${k + 1} 次移动 —— 把最上面的盘 ${mv.disk} 从 ${PEG_NAME[mv.from]} 柱搬到 ${PEG_NAME[mv.to]} 柱，` +
        `累计已移动 ${k + 1} 次，还剩 ${7 - k - 1} 次。` +
        (k === 3 ? '注意这一步：盘 3（最大盘）终于从 A 直接落到 C —— 它全程只动这一次。' : '') +
        (k === 6 ? '第 7 次移动完成，整摞 3 个盘子全部到达 C 柱。' : ''),
    });
  }

  /* 第 9 步：完成，点数 7 = 2^3 − 1 */
  snap({
    kind: 'summary',
    title: '完成：7 次 = 2^3 − 1',
    lines: [
      '3 个盘子搬完，实际移动 7 次',
      'T(1) = 1，T(2) = 3，T(3) = 7，T(4) = 15',
      '规律：T(n) = 2^n − 1',
      '第 1、3、5、7 次搬的都是盘 1（最小的盘），它动了 4 次',
    ],
    cap: '3 个盘子搬完，共移动 7 次；数一数就知道 T(1)=1、T(2)=3、T(3)=7、T(4)=15，' +
      '正好是 2^1−1、2^2−1、2^3−1、2^4−1。其中最小的盘 1 在第 1、3、5、7 次各动一次，共 4 次 = 2^2。',
  });

  /* 第 10 步：递推 T(n) = 2T(n−1) + 1 */
  snap({
    kind: 'summary',
    title: '递推：T(n) = 2·T(n−1) + 1',
    lines: [
      '① 把上面 n−1 个盘 A → B：T(n−1) 次',
      '② 把最大盘 A → C：1 次',
      '③ 把 n−1 个盘 B → C：T(n−1) 次',
      'T(n) = 2T(n−1) + 1，T(1) = 1 ⇒ T(n) = 2^n − 1',
    ],
    cap: '分治三步 —— 先把上面 n−1 个盘整体从 A 挪到 B（T(n−1) 次），' +
      '再把最大盘从 A 挪到 C（1 次），最后把 n−1 个盘从 B 挪到 C（T(n−1) 次），' +
      '于是 T(n) = 2T(n−1) + 1，T(1) = 1；令 U(n) = T(n)+1 得 U(n) = 2U(n−1)，故 T(n) = 2^n − 1。',
  });

  /* 第 11 步：代入具体 n */
  snap({
    kind: 'summary',
    title: 'T(n) = 2^n − 1 的具体值',
    lines: [
      'n = 3  →  7 次',
      'n = 4  →  15 次',
      'n = 10 →  1023 次',
      'n = 64 →  2^64 − 1 = 1.8446744×10^19 次',
    ],
    cap: '把 2^n − 1 代进去 —— n=3 得 7 次、n=4 得 15 次、n=10 得 1023 次、' +
      'n=64 得 2^64−1 = 18446744073709551615 ≈ 1.8446744×10^19 次（约 1844 亿亿次）。',
  });

  /* 第 12 步：64 个盘子要多久 */
  snap({
    kind: 'summary',
    title: 'n = 64：1 秒搬 1 个要多久？',
    lines: [
      '每秒 1 次：1.84×10^19 秒 ≈ 5849 亿年（PPT 记作“5000 亿年”）',
      '每秒 10^15 次（千万亿次）：≈ 18447 秒 ≈ 5.1 小时',
      '结论：指数增长让“多搬 1 个盘”就翻一倍',
      '变种：Reve 难题 —— 柱数增加、允许盘子相等',
    ],
    cap: '假设 1 秒搬 1 个盘子，2^64−1 ≈ 1.84×10^19 次要 1.84×10^19 秒，' +
      '约 5849 亿年（PPT 记作“5000 亿年”）；就算每秒搬 10^15 次（千万亿次），也要约 18447 秒 ≈ 5.1 小时。' +
      '这就是“指数爆炸”：盘子多 1 个，工作量就翻一倍。',
  });

  return fr;
}

function View({ frame: fr }: { frame: Frame }) {
  if (fr.kind === 'summary') {
    return (
      <>
        <T6 x={40} y={34} s={fr.title} cls="tx-b" />
        <Panel x={50} y={60} w={660} h={262} hl="key" />
        {fr.lines.map((line, j) => (
          <T6 key={j} x={76} y={106 + j * 48} s={line} cls={j === fr.lines.length - 1 ? 'tx tx-b' : 'tx'} />
        ))}
        <T6
          x={380}
          y={372}
          anchor="middle"
          cls="tx-sm"
          s="Hanoi 塔：T(n) = 2T(n−1) + 1，T(1) = 1 ⇒ T(n) = 2^n − 1"
        />
      </>
    );
  }

  /* 移动箭头（从源柱顶端指向目标柱顶端） */
  let moveArrow: React.ReactNode = null;
  if (fr.move) {
    const x1 = PEGX[fr.move.from];
    const x2 = PEGX[fr.move.to];
    const ay = 96;
    const dir = x2 > x1 ? 1 : -1;
    moveArrow = (
      <g>
        <line x1={x1} y1={ay} x2={x2 - dir * 12} y2={ay} stroke="var(--c-hot)" strokeWidth={2.4} />
        <polygon
          points={`${x2 - dir * 12},${ay - 6} ${x2 - dir * 12},${ay + 6} ${x2},${ay}`}
          fill="var(--c-hot)"
        />
        <T6
          x={(x1 + x2) / 2}
          y={ay - 10}
          anchor="middle"
          cls="tx-sm"
          s={`盘 ${fr.move.disk}：${PEG_NAME[fr.move.from]} → ${PEG_NAME[fr.move.to]}`}
        />
      </g>
    );
  }

  return (
    <>
      <T6 x={40} y={32} s={fr.title} cls="tx-b" />
      <T6 x={722} y={32} anchor="end" cls="tx" s={`已移动 ${fr.count} / 7 次`} />
      {moveArrow}
      {!fr.move && (
        <T6 x={380} y={96} anchor="middle" cls="tx-sm" s="目标：把 3 个盘子从 A 全部搬到 C，最少 2^3 − 1 = 7 次" />
      )}

      {/* 底座 */}
      <rect x={40} y={BASE_Y} width={680} height={9} rx={4} fill="var(--c-line)" />

      {/* 三根柱子 + 柱名 */}
      {[0, 1, 2].map((p) => (
        <g key={`peg${p}`}>
          <rect
            x={PEGX[p] - 5}
            y={PEG_TOP}
            width={10}
            height={BASE_Y - PEG_TOP}
            rx={4}
            fill="var(--c-panel-2)"
            stroke="var(--c-line)"
            strokeWidth={1.2}
          />
          <T6 x={PEGX[p]} y={BASE_Y + 34} anchor="middle" cls="tx-b" s={PEG_NAME[p]} />
        </g>
      ))}

      {/* 盘子：stack[0] 是最底下的盘 */}
      {[0, 1, 2].map((p) =>
        fr.pegs[p].map((size, k) => {
          const w = diskW(size);
          const y = BASE_Y - DISK_H - k * DISK_STEP;
          const hot = fr.hot != null && fr.hot.peg === p && fr.hot.size === size;
          return (
            <g key={`d${p}-${k}`}>
              <rect
                x={PEGX[p] - w / 2}
                y={y}
                width={w}
                height={DISK_H}
                rx={5}
                fill={hot ? 'var(--c-warn-bg)' : 'var(--c-key-bg)'}
                stroke={hot ? 'var(--c-hot)' : 'var(--c-accent)'}
                strokeWidth={hot ? 2.6 : 1.6}
              />
              <T6 x={PEGX[p]} y={y + 16} anchor="middle" cls={`tx${hot ? ' tx-b' : ''}`} s={`盘 ${size}`} />
            </g>
          );
        }),
      )}

      {/* 底部提示 */}
      <T6 x={40} y={382} cls="tx-sm" s="n = 3 时 T(3) = 2·T(2) + 1 = 2·3 + 1 = 7 = 2^3 − 1" />
    </>
  );
}

export const hanoiTower: DemoDef<Frame> = { build, View, w: W, h: H };
