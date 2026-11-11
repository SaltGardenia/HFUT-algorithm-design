/**
 * 基数排序演示（LSD）：7 个三位数（PPT slide 52 算例），
 * 按 个位 → 十位 → 百位 逐趟做稳定的计数排序，共 12 步
 * 移植自 assets/demos-deck4.js 的 radix-sort
 */
import type { DemoDef, DemoFrame } from './types';
import { Ln, T } from './primitives';

export interface Frame extends DemoFrame {
  /** 第几趟（0 = 准备帧） */
  pass: number;
  /** 本趟依据的数位：0 百位、1 十位、2 个位、-1 不高亮 */
  digitPos: number;
  inSeq: number[];
  outSeq: number[] | null;
  buckets: number[][] | null;
  /** 底部说明行 */
  note: string;
}

const DATA = [329, 457, 657, 839, 436, 720, 355]; // PPT slide 52 的算例
const M = DATA.length; // 元素个数 7
const RX = 176, RW = 84, RSTEP = 94, RH = 44; // 序列行的起点、格宽、格距、格高
const YIN = 58, YOUT = 356; // 输入行 / 收集结果行的纵坐标
const BX = 24, BW = 88, BSTEP = 96, BY = 150, BH = 170; // 10 个桶的位置与尺寸
const W = 1000;
const H = 470;

const DIGN = ['百位', '十位', '个位']; // digitPos 到中文名的映射

/** 取 v 的第 pos 位数字：pos = 0 百位、1 十位、2 个位 */
function digitAt(v: number, pos: number): number {
  const p = [100, 10, 1][pos];
  return Math.floor(v / p) % 10;
}

/** 用稳定的计数排序按 pos 位排一遍（与页面上的伪代码完全一致） */
function stableSortByDigit(seq: number[], pos: number): number[] {
  const cnt = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const out: number[] = [];
  for (let i = 0; i < seq.length; ++i) { cnt[digitAt(seq[i], pos)] += 1; } // 统计本位数字出现次数
  for (let d = 1; d < 10; ++d) { cnt[d] += cnt[d - 1]; } // 前缀累加：cnt[d] = |{数字 ≤ d}|
  for (let i = seq.length - 1; i >= 0; --i) { // 反向填充，保证本趟稳定
    const d = digitAt(seq[i], pos);
    cnt[d] -= 1;
    out[cnt[d]] = seq[i];
  }
  return out;
}

/** 把 seq 按 pos 位分到 0..9 号桶 */
function bucketsOf(seq: number[], pos: number): number[][] {
  const b: number[][] = [];
  for (let d = 0; d < 10; ++d) { b.push([]); }
  for (let i = 0; i < seq.length; ++i) { b[digitAt(seq[i], pos)].push(seq[i]); }
  return b;
}

/** 把分桶结果写成"桶0:[720]、桶5:[355]"这样的解说文字 */
function bucketText(b: number[][]): string {
  const t: string[] = [];
  for (let d = 0; d < 10; ++d) {
    if (b[d].length) { t.push('桶' + d + ':[' + b[d].join(', ') + ']'); }
  }
  return t.join('、');
}

export function build(): Frame[] {
  const P1 = stableSortByDigit(DATA, 2); // 第 1 趟：按个位（最右一位）
  const P2 = stableSortByDigit(P1, 1); // 第 2 趟：按十位（中间一位）
  const P3 = stableSortByDigit(P2, 0); // 第 3 趟：按百位（最左一位）
  const B1 = bucketsOf(DATA, 2), B2 = bucketsOf(P1, 1), B3 = bucketsOf(P2, 0);

  const fr: Frame[] = [];
  fr.push({
    pass: 0, digitPos: -1, inSeq: DATA, outSeq: null, buckets: null,
    note: '输入：329, 457, 657, 839, 436, 720, 355 —— 还没有排过任何一位',
    cap: '待排序的 7 个三位数：329、457、657、839、436、720、355。先把它们统一成 3 位（不足前面补 0），再从<b>最低位（个位）</b>开始，依次做 3 趟稳定的排序。',
  });
  fr.push({
    pass: 1, digitPos: 2, inSeq: DATA, outSeq: null, buckets: null,
    note: '第 1 趟取位：个位依次是 9、7、7、9、6、0、5',
    cap: '第 1 趟：取出每个数的<b>个位</b>数字 —— 329→9、457→7、657→7、839→9、436→6、720→0、355→5。',
  });
  fr.push({
    pass: 1, digitPos: 2, inSeq: DATA, outSeq: null, buckets: B1,
    note: '第 1 趟分桶：' + bucketText(B1),
    cap: '第 1 趟分桶：按个位数字放进 0~9 号桶 —— ' + bucketText(B1) + '；同一个桶内的元素保持原有先后次序，这是后面正确性的关键。',
  });
  fr.push({
    pass: 1, digitPos: 2, inSeq: DATA, outSeq: P1, buckets: B1,
    note: '第 1 趟收集：' + P1.join(', ') + '（已经按个位有序）',
    cap: '第 1 趟收集：按桶号 0→9 依次把元素收回，得到 ' + P1.join(', ') + ' —— 现在所有数已经按个位有序。',
  });
  fr.push({
    pass: 2, digitPos: 1, inSeq: P1, outSeq: null, buckets: null,
    note: '第 2 趟取位：十位依次是 2、5、3、5、5、2、3',
    cap: '第 2 趟：在上一趟的结果上取出每个数的<b>十位</b> —— 720→2、355→5、436→3、457→5、657→5、329→2、839→3。',
  });
  fr.push({
    pass: 2, digitPos: 1, inSeq: P1, outSeq: null, buckets: B2,
    note: '第 2 趟分桶：' + bucketText(B2),
    cap: '第 2 趟分桶：' + bucketText(B2) + '；注意桶2 里 720 排在 329 前面，正是上一趟（个位 0 &lt; 9）留下的次序 —— 稳定性在这里起作用。',
  });
  fr.push({
    pass: 2, digitPos: 1, inSeq: P1, outSeq: P2, buckets: B2,
    note: '第 2 趟收集：' + P2.join(', ') + '（低两位已经有序）',
    cap: '第 2 趟收集：得到 ' + P2.join(', ') + ' —— 低两位（十位 + 个位）已经有序。',
  });
  fr.push({
    pass: 3, digitPos: 0, inSeq: P2, outSeq: null, buckets: null,
    note: '第 3 趟取位：百位依次是 7、3、4、8、3、4、6',
    cap: '第 3 趟：取出每个数的<b>百位</b> —— 720→7、329→3、436→4、839→8、355→3、457→4、657→6。',
  });
  fr.push({
    pass: 3, digitPos: 0, inSeq: P2, outSeq: null, buckets: B3,
    note: '第 3 趟分桶：' + bucketText(B3),
    cap: '第 3 趟分桶：' + bucketText(B3) + '；桶内次序依旧是上一趟留下的次序。',
  });
  fr.push({
    pass: 3, digitPos: 0, inSeq: P2, outSeq: P3, buckets: B3,
    note: '第 3 趟收集：' + P3.join(', '),
    cap: '第 3 趟收集：得到 ' + P3.join(', ') + ' —— 三位全部排完，整个序列已经有序。',
  });
  fr.push({
    pass: 3, digitPos: -1, inSeq: P2, outSeq: P3, buckets: B3,
    note: '最终结果：' + P3.join(', '),
    cap: '最终结果：' + P3.join(' ') + '。整个过程没有比较过任何两个数的大小，只按"位"分桶与收集，共 3 趟，每趟 Θ(n + 10)。',
  });
  fr.push({
    pass: 3, digitPos: -1, inSeq: P2, outSeq: P3, buckets: B3,
    note: '为什么必须先低位、后高位？因为每一趟排序都是稳定的',
    cap: '为什么必须先低位后高位：每趟排序都是<b>稳定</b>的，所以第 t 趟不会打乱已经排好的低 t−1 位；如果反过来从高位开始，后面的趟就会把高位已经定好的次序重新打乱。',
  });
  return fr;
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

/** 画一行三位数；digitPos 指定的那一位会被高亮 */
function drawSeq(y: number, seq: number[] | null, digitPos: number) {
  return (
    <>
      {Array.from({ length: M }, (_, i) => {
        const x = RX + i * RSTEP;
        const s = seq ? String(seq[i]) : null;
        return (
          <g key={i}>
            {box(x, y, RW, RH, '', seq ? 'key' : null)}
            {s !== null && [0, 1, 2].map((d) => {
              const tx = x + RW / 2 + (d - 1) * 13;
              return (
                <g key={d}>
                  {d === digitPos && (
                    <rect x={tx - 8} y={y + 7} width={16} height={RH - 14} rx={3} fill="var(--c-warn)" opacity={0.22} />
                  )}
                  <T x={tx} y={y + RH / 2 + 5} s={s.charAt(d)} anchor="middle" cls={'tx' + (d === digitPos ? ' tx-b' : '')} />
                </g>
              );
            })}
          </g>
        );
      })}
    </>
  );
}

function View({ frame: f }: { frame: Frame }) {
  const title = '基数排序（LSD）：7 个三位数，按 个位 → 十位 → 百位 逐趟稳定排序' +
    (f.pass ? '　【当前：第 ' + f.pass + ' 趟 · 按' + DIGN[f.digitPos] + '】' : '　【准备】');
  return (
    <>
      <T x={26} y={24} s={title} cls="tx-b" />

      {/* ---- 本趟输入行 ---- */}
      <T x={30} y={YIN + 28} s="本趟输入" cls="tx-b" color="var(--c-accent)" />
      {Array.from({ length: M }, (_, i) => (
        <T key={'in' + i} x={RX + i * RSTEP + RW / 2} y={YIN - 8} s={i + 1} cls="tx-sm" anchor="middle" />
      ))}
      {drawSeq(YIN, f.inSeq, f.digitPos)}

      {/* ---- 10 个桶 ---- */}
      <T x={30} y={BY - 12} s="分桶（桶号 = 当前位的数字，0 ~ 9；桶内保持原有先后次序）" cls="tx-sm" />
      {Array.from({ length: 10 }, (_, b) => {
        const bx = BX + b * BSTEP;
        const bs = f.buckets ? f.buckets[b] : null;
        const has = !!bs && bs.length > 0;
        return (
          <g key={'bk' + b}>
            <rect
              x={bx} y={BY} width={BW} height={BH} rx={6}
              fill={has ? 'var(--c-key-bg)' : 'var(--c-panel-2)'}
              stroke={has ? 'var(--c-accent)' : 'var(--c-line)'}
              strokeWidth={has ? 1.8 : 1.2}
            />
            <T x={bx + BW / 2} y={BY + 22} s={b} cls="tx-b" anchor="middle" />
            <Ln x1={bx + 8} y1={BY + 32} x2={bx + BW - 8} y2={BY + 32} style={{ stroke: 'var(--c-line)' }} />
            {bs && bs.map((v, d) => (
              <T key={d} x={bx + BW / 2} y={BY + 58 + d * 24} s={v} cls="tx" anchor="middle" />
            ))}
          </g>
        );
      })}

      {/* ---- 收集结果行 ---- */}
      <T x={30} y={YOUT + 28} s="收集结果" cls="tx-b" color="var(--c-ok)" />
      {drawSeq(YOUT, f.outSeq, f.outSeq ? f.digitPos : -1)}
      {!f.outSeq && (
        <T
          x={RX + (M * RSTEP - (RSTEP - RW)) / 2} y={YOUT + 28}
          s="（本趟还没有收集：按桶号 0→9 收回后写在这一行）" cls="tx-sm" anchor="middle"
        />
      )}

      {/* ---- 底部说明 ---- */}
      <T x={26} y={434} s={f.note} cls="tx" />
      <T x={26} y={458} s={'高亮的那一位就是本趟排序依据的数位；同一桶内元素的先后次序始终不变，这正是"稳定排序"的含义。'} cls="tx-sm" />
    </>
  );
}

export const radixSort: DemoDef<Frame> = { build, View, w: W, h: H };
