/* ============================================================================
   算法复习手册 · L4 线性时间选择 —— 动画脚本（deck5）
   ----------------------------------------------------------------------------
   本文件注册 2 个动画，由 assets/handbook.js 统一驱动（data-demo 名必须同名）：
     randomized-select   RANDOMIZED-SELECT：用 PPT 的划分算例 ⟨6,10,13,5,8,3,2,11⟩
                         求第 3 小，逐帧显示随机主元、划分指针 i/j、q 与 k，
                         以及"只递归划分的一边、另一边整段丢弃"，共 22 步
     median-of-medians   BFPRT：用 PPT 引例「23 个数据找第 8 小」，逐帧演示
                         分组(每 5 个) → 组内排序取中位数 → 中位数的中位数 x
                         → 以 x 划分 → 只递归一边，共 15 步
   只使用 HB.svg / HB.svgRoot / HB.clear 三个工具函数，无任何外部依赖。
   ========================================================================== */
(function () {
  'use strict';

  var HB = window.HB;                       // handbook.js 暴露的全局工具对象
  if (!HB) { return; }                      // 没有 HB 就直接返回（防御性处理）

  /* ------------------------------------------------------------ 绘图小工具 */

  /** 新建一个 SVG 节点并挂到 parent 上 */
  function add(parent, tag, attrs, text) {
    var node = HB.svg(tag, attrs, text);
    parent.appendChild(node);
    return node;
  }

  /** 方框：hl 取 hot / ok / key / dead / null */
  function box(parent, x, y, w, h, value, hl) {
    var fill = 'var(--c-panel-2)', stroke = 'var(--c-line)', sw = 1.4;
    if (hl === 'hot') { fill = 'var(--c-warn-bg)'; stroke = 'var(--c-hot)'; sw = 2.6; }
    else if (hl === 'ok') { fill = 'var(--c-tip-bg)'; stroke = 'var(--c-ok)'; sw = 2.2; }
    else if (hl === 'key') { fill = 'var(--c-key-bg)'; stroke = 'var(--c-accent)'; sw = 1.8; }
    else if (hl === 'dead') { fill = 'var(--c-panel)'; stroke = 'var(--c-line-soft)'; sw = 1.0; }
    add(parent, 'rect', {
      x: x, y: y, width: w, height: h, rx: 6,
      fill: fill, stroke: stroke, 'stroke-width': sw, 'class': 'arr-cell'
    });
    if (value !== null && value !== undefined && value !== '') {
      add(parent, 'text', {
        x: x + w / 2, y: y + h / 2 + 6, 'text-anchor': 'middle',
        'class': 'tx' + (hl === 'hot' ? ' tx-b' : '')
      }, value);
    }
  }

  /** 圆：ring 为描边，fill 为填充 */
  function circle(parent, cx, cy, r, value, fill, stroke, sw, cls) {
    add(parent, 'circle', {
      cx: cx, cy: cy, r: r, fill: fill, stroke: stroke, 'stroke-width': sw,
      'class': cls || 'node-circle'
    });
    if (value !== null && value !== undefined) {
      add(parent, 'text', {
        x: cx, y: cy + 5, 'text-anchor': 'middle', 'class': 'tx'
      }, value);
    }
  }

  /* ==========================================================================
     Demo 1：RANDOMIZED-SELECT —— ⟨6,10,13,5,8,3,2,11⟩ 求第 3 小（共 22 步）
     ========================================================================== */
  HB.register('randomized-select', function (root, stage, cap) {
    var N = 8;                                       // 数组长度 n = 8
    var X0 = 105, STEP = 96, BW = 78, BH = 54, Y0 = 70;   // 方框布局参数

    /* 每一帧记录：arr 当前数组、p/r 区间、tgt 目标名次、xPos 主元位置、
       iPtr 划分指针、jPos 扫描位置、q 返回下标、k 主元名次、res 判定值、
       lo/hi 仍在考虑的区间（区间外=已丢弃）、phase 阶段名、note 图内结论、desc 解说 */
    var F = [
      { arr: [6, 10, 13, 5, 8, 3, 2, 11], p: 1, r: 8, tgt: 3, xPos: 0, iPtr: 0, jPos: 0,
        q: 0, k: 0, res: 0, lo: 1, hi: 8, phase: '① 入口',
        note: 'A = ⟨6,10,13,5,8,3,2,11⟩，p = 1，r = 8，i = 3',
        desc: '输入 A = ⟨6,10,13,5,8,3,2,11⟩，p = 1、r = 8、i = 3：在 8 个数里找<b>第 3 小</b>。RANDOMIZED-SELECT 与快速排序同模型，区别是它每次<b>只递归划分的一边</b>。' },
      { arr: [8, 10, 13, 5, 6, 3, 2, 11], p: 1, r: 8, tgt: 3, xPos: 1, iPtr: 1, jPos: 0,
        q: 0, k: 0, res: 0, lo: 1, hi: 8, phase: '② 随机取主元',
        note: 'RANDOMIZED-PARTITION 选中 A[5] = 8，与 A[1] = 6 交换 ⇒ x = A[1] = 8',
        desc: 'RANDOMIZED-PARTITION 等概率地选中 <b>A[5] = 8</b> 作主元（概率 1/8），先把它与 A[p] = 6 交换，数组变成 ⟨8,10,13,5,6,3,2,11⟩；<b>x = A[1] = 8</b>，划分指针 i = p = 1。' },
      { arr: [8, 10, 13, 5, 6, 3, 2, 11], p: 1, r: 8, tgt: 3, xPos: 1, iPtr: 1, jPos: 2,
        q: 0, k: 0, res: 0, lo: 1, hi: 8, phase: '② 划分（j = 2）',
        note: 'j = 2：A[2] = 10 > 8 ⇒ 跳过，i 仍为 1',
        desc: 'j = 2：A[2] = 10 与 x = 8 比较，<b>10 &gt; 8</b> 不满足 A[j] ≤ x，i 保持 1 —— 10 属于"大于主元"的一段。' },
      { arr: [8, 10, 13, 5, 6, 3, 2, 11], p: 1, r: 8, tgt: 3, xPos: 1, iPtr: 1, jPos: 3,
        q: 0, k: 0, res: 0, lo: 1, hi: 8, phase: '② 划分（j = 3）',
        note: 'j = 3：A[3] = 13 > 8 ⇒ 跳过，i 仍为 1',
        desc: 'j = 3：A[3] = 13 &gt; x = 8，同样跳过，i 仍为 1。前两个元素都进了"≥ x"那一段。' },
      { arr: [8, 5, 13, 10, 6, 3, 2, 11], p: 1, r: 8, tgt: 3, xPos: 1, iPtr: 2, jPos: 4,
        q: 0, k: 0, res: 0, lo: 1, hi: 8, phase: '② 划分（j = 4）',
        note: 'j = 4：A[4] = 5 ≤ 8 ⇒ i = 2，交换 A[2] 与 A[4]',
        desc: 'j = 4：A[4] = 5 ≤ x = 8，i 递增到 <b>2</b>，交换 A[2] 与 A[4] → ⟨8,5,13,10,6,3,2,11⟩；"≤ x" 段现在有 1 个元素。' },
      { arr: [8, 5, 6, 10, 13, 3, 2, 11], p: 1, r: 8, tgt: 3, xPos: 1, iPtr: 3, jPos: 5,
        q: 0, k: 0, res: 0, lo: 1, hi: 8, phase: '② 划分（j = 5）',
        note: 'j = 5：A[5] = 6 ≤ 8 ⇒ i = 3，交换 A[3] 与 A[5]',
        desc: 'j = 5：A[5] = 6 ≤ 8，i = <b>3</b>，交换 A[3] 与 A[5] → ⟨8,5,6,10,13,3,2,11⟩。' },
      { arr: [8, 5, 6, 3, 13, 10, 2, 11], p: 1, r: 8, tgt: 3, xPos: 1, iPtr: 4, jPos: 6,
        q: 0, k: 0, res: 0, lo: 1, hi: 8, phase: '② 划分（j = 6）',
        note: 'j = 6：A[6] = 3 ≤ 8 ⇒ i = 4，交换 A[4] 与 A[6]',
        desc: 'j = 6：A[6] = 3 ≤ 8，i = <b>4</b>，交换 A[4] 与 A[6] → ⟨8,5,6,3,13,10,2,11⟩。' },
      { arr: [8, 5, 6, 3, 2, 10, 13, 11], p: 1, r: 8, tgt: 3, xPos: 1, iPtr: 5, jPos: 7,
        q: 0, k: 0, res: 0, lo: 1, hi: 8, phase: '② 划分（j = 7）',
        note: 'j = 7：A[7] = 2 ≤ 8 ⇒ i = 5，交换 A[5] 与 A[7]',
        desc: 'j = 7：A[7] = 2 ≤ 8，i = <b>5</b>，交换 A[5] 与 A[7] → ⟨8,5,6,3,2,10,13,11⟩；"≤ x" 段已有 4 个元素。' },
      { arr: [8, 5, 6, 3, 2, 10, 13, 11], p: 1, r: 8, tgt: 3, xPos: 1, iPtr: 5, jPos: 8,
        q: 0, k: 0, res: 0, lo: 1, hi: 8, phase: '② 划分（j = 8）',
        note: 'j = 8：A[8] = 11 > 8 ⇒ 跳过；扫描结束，i = 5',
        desc: 'j = 8：A[8] = 11 &gt; 8，跳过。扫描到 r = 8 结束，此时 i = <b>5</b>，A[2..5] 是"≤ x"段，A[6..8] 是"&gt; x"段。' },
      { arr: [2, 5, 6, 3, 8, 10, 13, 11], p: 1, r: 8, tgt: 3, xPos: 5, iPtr: 5, jPos: 0,
        q: 5, k: 0, res: 0, lo: 1, hi: 8, phase: '② 收尾：确定 q',
        note: '交换 A[1] 与 A[5] ⇒ ⟨2,5,6,3,8,10,13,11⟩，q = 5',
        desc: '收尾：交换 A[p] = A[1]（值 8）与 A[i] = A[5]（值 2）→ ⟨2,5,6,3,8,10,13,11⟩，返回 <b>q = 5</b>。左边 4 个都 ≤ 8，右边 3 个都 ≥ 8，主元 8 已经"一步到位"。' },
      { arr: [2, 5, 6, 3, 8, 10, 13, 11], p: 1, r: 8, tgt: 3, xPos: 5, iPtr: 5, jPos: 0,
        q: 5, k: 5, res: 0, lo: 1, hi: 4, phase: '③ 只递归一边',
        note: 'k = 5 − 1 + 1 = 5 > i = 3 ⇒ 递归左半边 A[1..4]，右半边 A[5..8] 丢弃',
        desc: 'k = q − p + 1 = 5 − 1 + 1 = <b>5</b>：主元 8 是第 5 小。目标 i = 3 &lt; k = 5，所以第 3 小一定在左半边 → 递归 RANDOMIZED-SELECT(A, 1, 4, 3)；<b>右半边 A[5..8] 整段丢弃</b>（8、10、13、11 都不可能是第 3 小）。' },
      { arr: [6, 5, 2, 3, 8, 10, 13, 11], p: 1, r: 4, tgt: 3, xPos: 1, iPtr: 1, jPos: 0,
        q: 0, k: 0, res: 0, lo: 1, hi: 4, phase: '② 第二层：取主元',
        note: '第二层 p = 1，r = 4，i = 3；选中 A[3] = 6，与 A[1] = 2 交换',
        desc: '第二层：p = 1、r = 4、i = 3（还是找第 3 小）。随机选中 <b>A[3] = 6</b>，与 A[1] = 2 交换 → ⟨6,5,2,3⟩；x = A[1] = 6，i = 1。' },
      { arr: [6, 5, 2, 3, 8, 10, 13, 11], p: 1, r: 4, tgt: 3, xPos: 1, iPtr: 2, jPos: 2,
        q: 0, k: 0, res: 0, lo: 1, hi: 4, phase: '② 第二层：j = 2',
        note: 'j = 2：A[2] = 5 ≤ 6 ⇒ i = 2',
        desc: 'j = 2：A[2] = 5 ≤ 6，i 递增到 <b>2</b>，交换 A[2] 与 A[2]（数组不变）。' },
      { arr: [6, 5, 2, 3, 8, 10, 13, 11], p: 1, r: 4, tgt: 3, xPos: 1, iPtr: 3, jPos: 3,
        q: 0, k: 0, res: 0, lo: 1, hi: 4, phase: '② 第二层：j = 3',
        note: 'j = 3：A[3] = 2 ≤ 6 ⇒ i = 3',
        desc: 'j = 3：A[3] = 2 ≤ 6，i = <b>3</b>，数组仍为 ⟨6,5,2,3⟩。' },
      { arr: [6, 5, 2, 3, 8, 10, 13, 11], p: 1, r: 4, tgt: 3, xPos: 1, iPtr: 4, jPos: 4,
        q: 0, k: 0, res: 0, lo: 1, hi: 4, phase: '② 第二层：j = 4',
        note: 'j = 4：A[4] = 3 ≤ 6 ⇒ i = 4；扫描结束',
        desc: 'j = 4：A[4] = 3 ≤ 6，i = <b>4</b>，扫描到 r = 4 结束，区间里的 4 个数全都 ≤ 6。' },
      { arr: [3, 5, 2, 6, 8, 10, 13, 11], p: 1, r: 4, tgt: 3, xPos: 4, iPtr: 4, jPos: 0,
        q: 4, k: 4, res: 0, lo: 1, hi: 4, phase: '② 第二层：确定 q',
        note: '交换 A[1] 与 A[4] ⇒ ⟨3,5,2,6⟩，q = 4，k = 4 − 1 + 1 = 4',
        desc: '收尾交换 A[1] 与 A[4] → ⟨3,5,2,6⟩，返回 <b>q = 4</b>，k = 4 − 1 + 1 = <b>4</b>：主元 6 是第 4 小。' },
      { arr: [3, 5, 2, 6, 8, 10, 13, 11], p: 1, r: 4, tgt: 3, xPos: 4, iPtr: 4, jPos: 0,
        q: 4, k: 4, res: 0, lo: 1, hi: 3, phase: '③ 只递归一边',
        note: 'i = 3 < k = 4 ⇒ 递归左半边 A[1..3]，A[4..8] 丢弃',
        desc: '目标 i = 3 &lt; k = 4，第 3 小在左半边 → 递归 RANDOMIZED-SELECT(A, 1, 3, 3)，<b>A[4..8] 丢弃</b>。注意：每一层都只往一边走，走完的区间规模是 8 → 4 → 3。' },
      { arr: [5, 3, 2, 6, 8, 10, 13, 11], p: 1, r: 3, tgt: 3, xPos: 1, iPtr: 1, jPos: 0,
        q: 0, k: 0, res: 0, lo: 1, hi: 3, phase: '② 第三层：取主元',
        note: '第三层 p = 1，r = 3，i = 3；选中 A[2] = 5，与 A[1] = 3 交换',
        desc: '第三层：p = 1、r = 3、i = 3。随机选中 <b>A[2] = 5</b>，与 A[1] = 3 交换 → ⟨5,3,2⟩；x = 5，i = 1。' },
      { arr: [5, 3, 2, 6, 8, 10, 13, 11], p: 1, r: 3, tgt: 3, xPos: 1, iPtr: 2, jPos: 2,
        q: 0, k: 0, res: 0, lo: 1, hi: 3, phase: '② 第三层：j = 2',
        note: 'j = 2：A[2] = 3 ≤ 5 ⇒ i = 2',
        desc: 'j = 2：A[2] = 3 ≤ 5，i = <b>2</b>。' },
      { arr: [5, 3, 2, 6, 8, 10, 13, 11], p: 1, r: 3, tgt: 3, xPos: 1, iPtr: 3, jPos: 3,
        q: 0, k: 0, res: 0, lo: 1, hi: 3, phase: '② 第三层：j = 3',
        note: 'j = 3：A[3] = 2 ≤ 5 ⇒ i = 3；扫描结束',
        desc: 'j = 3：A[3] = 2 ≤ 5，i = <b>3</b>，扫描结束（3 个数全部 ≤ 5）。' },
      { arr: [2, 3, 5, 6, 8, 10, 13, 11], p: 1, r: 3, tgt: 3, xPos: 3, iPtr: 3, jPos: 0,
        q: 3, k: 3, res: 3, lo: 1, hi: 3, phase: '④ 命中答案',
        note: '交换 A[1] 与 A[3] ⇒ ⟨2,3,5⟩，q = 3，k = 3 = i ⇒ 返回 A[3] = 5',
        desc: '收尾交换 A[1] 与 A[3] → ⟨2,3,5⟩，返回 q = 3，k = 3 − 1 + 1 = <b>3 = i</b> ⇒ 主元就是答案，<b>返回 A[3] = 5</b>。' },
      { arr: [2, 3, 5, 6, 8, 10, 13, 11], p: 1, r: 3, tgt: 3, xPos: 3, iPtr: 3, jPos: 0,
        q: 3, k: 3, res: 3, lo: 1, hi: 3, phase: '⑤ 结论',
        note: '答案 5：排序后 2,3,5,6,8,10,11,13 的第 3 个正是 5',
        desc: '答案 <b>5</b>，与"排序后取第 3 个"一致（2,3,<b>5</b>,6,8,10,11,13）。三层划分的规模是 8 → 4 → 3，总代价 ≤ c·8 + c·4 + c·3 = 15c = <b>O(n)</b>；正因为每层只进一边，期望运行时间才是 Θ(n)。' }
    ];

    var idx = 0;                                     // 当前帧下标

    /** 方框左边界（pos 为 1 起下标） */
    function sx(pos) { return X0 + (pos - 1) * STEP; }

    function render() {
      var f = F[idx], i, pos, act, cls;
      HB.clear(stage);
      var svg = HB.svgRoot(960, 380,
        'RANDOMIZED-SELECT 在 8 个元素中找第 3 小的逐帧过程，每一步只递归划分的一边');
      stage.appendChild(svg);

      add(svg, 'text', { x: 26, y: 24, 'class': 'tx-b' },
        'RANDOMIZED-SELECT(A, 1, 8, 3)：随机主元 → 划分 → 只递归一边');
      add(svg, 'text', { x: 26, y: 46, 'class': 'tx-sm' },
        f.phase + '　|　灰色虚框 = 已经丢弃、不再参与递归的元素');

      /* ---- 数组方框 ---- */
      for (pos = 1; pos <= N; ++pos) {
        act = pos >= f.lo && pos <= f.hi;                 // 是否还在当前子问题里
        if (pos === f.xPos) { cls = 'hot'; }             // 主元
        else if (pos === f.q) { cls = 'ok'; }            // 已就位的划分点
        else if (!act) { cls = 'dead'; }                 // 已丢弃
        else { cls = 'key'; }                            // 当前区间
        box(svg, sx(pos), Y0, BW, BH, f.arr[pos - 1], cls);
        add(svg, 'text', {
          x: sx(pos) + BW / 2, y: Y0 + BH + 18, 'text-anchor': 'middle', 'class': 'tx-sm'
        }, String(pos));                                   // 下标
      }

      /* ---- 当前子问题的区间括号 ---- */
      var x1 = sx(f.lo), x2 = sx(f.hi) + BW, yb = Y0 + BH + 26;
      add(svg, 'line', { x1: x1, y1: yb, x2: x2, y2: yb, stroke: 'var(--c-accent)', 'stroke-width': 1.6 });
      add(svg, 'line', { x1: x1, y1: yb - 6, x2: x1, y2: yb + 6, stroke: 'var(--c-accent)', 'stroke-width': 1.6 });
      add(svg, 'line', { x1: x2, y1: yb - 6, x2: x2, y2: yb + 6, stroke: 'var(--c-accent)', 'stroke-width': 1.6 });
      add(svg, 'text', { x: x1, y: yb + 20, 'text-anchor': 'middle', 'class': 'tx-sm', fill: 'var(--c-accent)' }, 'p=' + f.p);
      add(svg, 'text', { x: x2, y: yb + 20, 'text-anchor': 'middle', 'class': 'tx-sm', fill: 'var(--c-accent)' }, 'r=' + f.r);

      /* ---- j / i 指针 ---- */
      if (f.jPos > 0) {
        add(svg, 'text', {
          x: sx(f.jPos) + BW / 2, y: yb + 42, 'text-anchor': 'middle', 'class': 'tx-sm', fill: 'var(--c-accent-2)'
        }, '↑ j=' + f.jPos);
      }
      if (f.iPtr > 0) {
        add(svg, 'text', {
          x: sx(f.iPtr) + BW / 2, y: yb + 60, 'text-anchor': 'middle', 'class': 'tx-sm', fill: 'var(--c-hot)'
        }, '↑ i=' + f.iPtr);
      }

      /* ---- 状态面板 ---- */
      add(svg, 'rect', {
        x: 40, y: 238, width: 880, height: 80, rx: 10,
        fill: 'var(--c-panel)', stroke: 'var(--c-line)', 'stroke-width': 1.2
      });
      add(svg, 'text', { x: 58, y: 264, 'class': 'tx' },
        'p = ' + f.p + '　r = ' + f.r + '　i（目标名次）= ' + f.tgt +
        '　x = ' + (f.xPos ? ('A[' + f.xPos + '] = ' + f.arr[f.xPos - 1]) : '—'));
      add(svg, 'text', { x: 58, y: 288, 'class': 'tx' },
        'q = ' + (f.q ? String(f.q) : '—') + '　k = q−p+1 = ' + (f.k ? String(f.k) : '—') +
        '　i（划分指针）= ' + (f.iPtr ? String(f.iPtr) : '—') + '　j = ' + (f.jPos ? String(f.jPos) : '—'));
      add(svg, 'text', { x: 58, y: 310, 'class': 'tx-sm' },
        f.res ? ('判定 res = ' + f.res + '，与目标 i = ' + f.tgt + ' 比较') :
          '比较规则：i = k 返回 A[q]；i < k 递归左边；i > k 递归右边并令 i ← i − k');

      /* ---- 图内结论 ---- */
      add(svg, 'text', { x: 26, y: 348, 'class': 'tx' }, f.note);

      if (cap) {
        cap.innerHTML = '第 ' + (idx + 1) + ' / ' + F.length + ' 步 · ' + f.desc;
      }
    }

    return {
      steps: F.length,                                  // 总步数 22
      reset: function () { idx = 0; render(); },
      prev: function () { if (idx > 0) { idx -= 1; } render(); },
      next: function () { if (idx < F.length - 1) { idx += 1; } render(); }
    };
  });

  /* ==========================================================================
     Demo 2：median-of-medians —— 23 个数据找第 8 小（共 15 步）
     数据取 PPT 第 49 页引例，5 列分组与图一致：
       第1组 1,39,12,2,45 | 第2组 5,68,16,6,97 | 第3组 3,47,14,4,26
       第4组 9,72,18,10,58 | 第5组 7,8,32
     ========================================================================== */
  HB.register('median-of-medians', function (root, stage, cap) {
    var COLS = 5;                                     // 最多 5 列（每组一列）
    var CX0 = 140, CSTEP = 150, R0 = 100, RSTEP = 58, RAD = 24;   // 列/行布局

    var F = [
      { cols: [[1, 39, 12, 2, 45], [5, 68, 16, 6, 97], [3, 47, 14, 4, 26],
               [9, 72, 18, 10, 58], [7, 8, 32]],
        meds: null, xv: null, lit: -1, ring: false, phase: '① 分组',
        note: 'n = 23，每 5 个一组 ⇒ ⌈23/5⌉ = 5 组，最后一组只有 3 个',
        desc: '23 个数据、k = 8：要在 A 中找<b>第 8 小</b>。第 ① 步把 23 个元素每 5 个一组，共 ⌈23/5⌉ = 5 组（4 个满组 + 1 个 3 元素的尾组），每组占一列。' },
      { cols: [[1, 2, 12, 39, 45], [5, 68, 16, 6, 97], [3, 47, 14, 4, 26],
               [9, 72, 18, 10, 58], [7, 8, 32]],
        meds: [12, null, null, null, null], xv: null, lit: 0, ring: true, phase: '② 组内排序取中位数',
        note: '第 1 组：1,39,12,2,45 → 1,2,12,39,45，中位数取第 3 个 = 12',
        desc: '第 1 组 ⟨1,39,12,2,45⟩ 排序后为 ⟨1,2,12,39,45⟩，取中间第 3 个 → <b>中位数 12</b>（红圈）。5 个元素的组，中位数一定在第 3 行。' },
      { cols: [[1, 2, 12, 39, 45], [5, 6, 16, 68, 97], [3, 47, 14, 4, 26],
               [9, 72, 18, 10, 58], [7, 8, 32]],
        meds: [12, 16, null, null, null], xv: null, lit: 1, ring: true, phase: '② 组内排序取中位数',
        note: '第 2 组：5,68,16,6,97 → 5,6,16,68,97，中位数 = 16',
        desc: '第 2 组 ⟨5,68,16,6,97⟩ 排序后为 ⟨5,6,16,68,97⟩，中位数 <b>16</b>。' },
      { cols: [[1, 2, 12, 39, 45], [5, 6, 16, 68, 97], [3, 4, 14, 26, 47],
               [9, 72, 18, 10, 58], [7, 8, 32]],
        meds: [12, 16, 14, null, null], xv: null, lit: 2, ring: true, phase: '② 组内排序取中位数',
        note: '第 3 组：3,47,14,4,26 → 3,4,14,26,47，中位数 = 14',
        desc: '第 3 组 ⟨3,47,14,4,26⟩ 排序后为 ⟨3,4,14,26,47⟩，中位数 <b>14</b>。' },
      { cols: [[1, 2, 12, 39, 45], [5, 6, 16, 68, 97], [3, 4, 14, 26, 47],
               [9, 10, 18, 58, 72], [7, 8, 32]],
        meds: [12, 16, 14, 18, null], xv: null, lit: 3, ring: true, phase: '② 组内排序取中位数',
        note: '第 4 组：9,72,18,10,58 → 9,10,18,58,72，中位数 = 18',
        desc: '第 4 组 ⟨9,72,18,10,58⟩ 排序后为 ⟨9,10,18,58,72⟩，中位数 <b>18</b>。' },
      { cols: [[1, 2, 12, 39, 45], [5, 6, 16, 68, 97], [3, 4, 14, 26, 47],
               [9, 10, 18, 58, 72], [7, 8, 32]],
        meds: [12, 16, 14, 18, 8], xv: null, lit: 4, ring: true, phase: '② 尾组特殊处理',
        note: '第 5 组只有 3 个：7,8,32 → 中位数取第 ⌈3/2⌉ = 2 个 = 8',
        desc: '第 5 组只有 3 个元素 ⟨7,8,32⟩（不满 5 个）。中位数取第 ⌈3/2⌉ = 2 个 → <b>8</b>，不是第 3 行的 32 —— 组内中位数按"第 ⌈len/2⌉ 个"算。' },
      { cols: [[1, 2, 12, 39, 45], [5, 6, 16, 68, 97], [3, 4, 14, 26, 47],
               [9, 10, 18, 58, 72], [7, 8, 32]],
        meds: [12, 16, 14, 18, 8], xv: null, lit: -1, ring: true, phase: '③ 中位数数组 medians',
        note: 'medians = ⟨12,16,14,18,8⟩，共 g = 5 个，下一步递归求它们的中位数',
        desc: '5 个组内中位数收集成 medians = ⟨12,16,14,18,8⟩（g = 5）。第 ③ 步对这 g 个中位数<b>递归调用 Select</b>，求"中位数的中位数" x。' },
      { cols: [[1, 2, 12, 39, 45], [5, 6, 16, 68, 97], [3, 4, 14, 26, 47],
               [9, 10, 18, 58, 72], [7, 8, 32]],
        meds: [12, 16, 14, 18, 8], xv: 14, lit: -1, ring: true, phase: '③ 求 x',
        note: 'medians 排序 → 8,12,14,16,18，第 ⌈5/2⌉ = 3 个 = 14 ⇒ x = 14',
        desc: 'medians 排好序是 ⟨8,12,14,16,18⟩，取第 ⌈5/2⌉ = 3 个 ⇒ <b>x = 14</b>（橙色圈）。x 是 5 个中位数的中位数，所以有 2 个中位数 ≤ x、2 个 ≥ x。' },
      { cols: [[1, 2, 12, 39, 45], [5, 6, 16, 68, 97], [3, 4, 14, 26, 47],
               [9, 10, 18, 58, 72], [7, 8, 32]],
        meds: [12, 16, 14, 18, 8], xv: 14, lit: -1, ring: true, phase: '④ 以 x 划分',
        note: '< 14 的 11 个：1,2,12,5,6,3,4,9,10,7,8 ｜14 在第 12 位｜> 14 的 11 个',
        desc: '第 ④ 步用 PARTITION-AROUND 以 x = 14 划分：<b>小于 14 的 11 个</b>（1,2,12,5,6,3,4,9,10,7,8）排在左边，14 落在<b>第 12 位</b>，右边是 11 个大于 14 的元素。' },
      { cols: [[1, 2, 12, 39, 45], [5, 6, 16, 68, 97], [3, 4, 14, 26, 47],
               [9, 10, 18, 58, 72], [7, 8, 32]],
        meds: [12, 16, 14, 18, 8], xv: 14, lit: -1, ring: true, phase: '⑤ 判定并只递归一边',
        note: 'res = mid−left+1 = 12−1+1 = 12 > k = 8 ⇒ 左半边递归，右边 11 个丢弃',
        desc: '第 ⑤ 步：res = mid − left + 1 = 12 − 1 + 1 = <b>12</b>，而 k = 8 &lt; 12，所以第 8 小在左半边 → 递归左半边找第 8 小，<b>右边 11 个元素（16,18,26,32,39,45,47,58,68,72,97）整段丢弃</b>。' },
      { cols: [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [12]],
        meds: null, xv: null, lit: -1, ring: false, phase: '② 第二层：再分组',
        note: '左半边剩 11 个：1,2,3,4,5,6,7,8,9,10,12 ⇒ ⌈11/5⌉ = 3 组',
        desc: '第二层：左半边剩 <b>11 个</b>元素（为便于观察按升序列出，Select 只关心集合、不关心顺序），仍要找第 8 小。再每 5 个一组 ⇒ ⌈11/5⌉ = 3 组（5 + 5 + 1）。' },
      { cols: [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [12]],
        meds: [3, 8, 12], xv: null, lit: -1, ring: true, phase: '② 组内中位数',
        note: '三组中位数：3（第 3 个）、8（第 3 个）、12（只有 1 个，就是它自己）',
        desc: '三组各自的中位数：⟨1,2,3,4,5⟩ → <b>3</b>；⟨6,7,8,9,10⟩ → <b>8</b>；⟨12⟩ 只有 1 个，中位数就是 <b>12</b>。' },
      { cols: [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [12]],
        meds: [3, 8, 12], xv: 8, lit: -1, ring: true, phase: '③ 求第二层的 x',
        note: 'medians 排序 → 3,8,12，第 ⌈3/2⌉ = 2 个 = 8 ⇒ x = 8',
        desc: 'medians = ⟨3,8,12⟩ 排序后仍是 ⟨3,8,12⟩，取第 ⌈3/2⌉ = 2 个 ⇒ <b>x = 8</b>。' },
      { cols: [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [12]],
        meds: [3, 8, 12], xv: 8, lit: -1, ring: true, phase: '④ 划分命中',
        note: '以 8 划分：7 个 < 8 ｜8 在第 8 位｜ res = 8−1+1 = 8 = k ⇒ 返回 8',
        desc: '以 x = 8 划分：小于 8 的有 7 个（1..7），8 落在<b>第 8 位</b>，res = 8 − 1 + 1 = <b>8 = k</b> ⇒ 命中，返回 <b>8</b>。' },
      { cols: [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [12]],
        meds: [3, 8, 12], xv: 8, lit: -1, ring: true, phase: '⑥ 结论',
        note: '答案 8：23 个数排序后第 8 个正是 8；两层递归都是 O(n) 规模收缩',
        desc: '答案 <b>8</b>（23 个数排序后 1,2,3,4,5,6,7,<b>8</b>,9,10,12,14,… 的第 8 个）。每次递归子问题规模 ≤ 7n/10，加上求 x 的 n/5，得 T(n) ≤ T(n/5) + T(7n/10) + O(n) = <b>O(n)</b>。' }
    ];

    var idx = 0;

    /** 第 j 列第 r 行的圆心 */
    function cxy(j, r) { return { x: CX0 + j * CSTEP, y: R0 + r * RSTEP }; }

    /** 一列的中位数（列内已升序） */
    function medianOf(col) { return col[Math.floor((col.length - 1) / 2)]; }

    function render() {
      var f = F[idx], j, r, col, p, v, isMed, isX;
      HB.clear(stage);
      var svg = HB.svgRoot(960, 580,
        'BFPRT（中位数之中位数）在 23 个数据中找第 8 小的逐帧过程');
      stage.appendChild(svg);

      add(svg, 'text', { x: 26, y: 24, 'class': 'tx-b' },
        'median of medians（BFPRT）：23 个数据找第 8 小');
      add(svg, 'text', { x: 26, y: 46, 'class': 'tx-sm' },
        f.phase + '　|　红圈 = 组内中位数，橙圈 = 中位数的中位数 x，蓝框 = 本步正在处理的组');

      /* ---- 5 列（每组一列，列内自上而下递增）---- */
      for (j = 0; j < COLS; ++j) {
        col = f.cols[j] || [];
        if (!col.length) { continue; }                    // 本层没有第 j 组就不画
        if (j === f.lit) {
          add(svg, 'rect', {
            x: CX0 + j * CSTEP - 36, y: R0 - 36, width: 72, height: 5 * RSTEP + 12, rx: 12,
            fill: 'var(--c-key-bg)', stroke: 'var(--c-accent)', 'stroke-width': 1.6
          });
        }
        for (r = 0; r < col.length; ++r) {
          p = cxy(j, r);
          v = col[r];
          isMed = f.ring && col.length > 0 && v === medianOf(col);
          isX = f.xv !== null && v === f.xv && isMed;
          if (isX) {
            circle(svg, p.x, p.y, RAD, v, 'var(--c-warn)', 'var(--c-warn)', 2, 'node-circle');
            add(svg, 'text', { x: p.x + RAD + 6, y: p.y + 5, 'class': 'tx-sm', fill: 'var(--c-warn)' }, 'x');
          } else if (isMed) {
            circle(svg, p.x, p.y, RAD, v, 'var(--c-panel)', 'var(--c-hot)', 3, 'node-circle');
          } else {
            circle(svg, p.x, p.y, RAD, v, 'var(--c-panel-2)', 'var(--c-line)', 1.4, 'node-circle');
          }
        }
        add(svg, 'text', {
          x: CX0 + j * CSTEP, y: R0 + 5 * RSTEP + 12, 'text-anchor': 'middle', 'class': 'tx-sm'
        }, '第 ' + (j + 1) + ' 组（' + col.length + ' 个）');
      }

      /* ---- medians 行 ---- */
      add(svg, 'text', { x: 40, y: 448, 'class': 'tx-b', fill: 'var(--c-accent-2)' }, 'medians');
      for (j = 0; j < COLS; ++j) {
        p = { x: CX0 + j * CSTEP, y: 444 };
        if (!f.cols[j] || !f.cols[j].length) { continue; }   // 没有这一组就不占位
        if (f.meds && f.meds[j] !== null && f.meds[j] !== undefined) {
          var mv = f.meds[j];
          if (f.xv !== null && mv === f.xv) {
            circle(svg, p.x, p.y, 21, mv, 'var(--c-warn)', 'var(--c-warn)', 2, 'node-circle');
          } else {
            circle(svg, p.x, p.y, 21, mv, 'var(--c-panel)', 'var(--c-hot)', 2.4, 'node-circle');
          }
        } else {
          add(svg, 'line', {
            x1: p.x - 18, y1: p.y, x2: p.x + 18, y2: p.y,
            stroke: 'var(--c-line)', 'stroke-width': 1.2, 'stroke-dasharray': '4 4'
          });
        }
      }
      if (f.xv !== null) {
        add(svg, 'text', { x: 40, y: 480, 'class': 'tx-sm', fill: 'var(--c-warn)' },
          'x = ' + f.xv + '（中位数的中位数）');
      }

      /* ---- 结论行 ---- */
      add(svg, 'text', { x: 26, y: 516, 'class': 'tx' }, f.note);

      if (cap) {
        cap.innerHTML = '第 ' + (idx + 1) + ' / ' + F.length + ' 步 · ' + f.desc;
      }
    }

    return {
      steps: F.length,                                  // 总步数 15
      reset: function () { idx = 0; render(); },
      prev: function () { if (idx > 0) { idx -= 1; } render(); },
      next: function () { if (idx < F.length - 1) { idx += 1; } render(); }
    };
  });
})();
