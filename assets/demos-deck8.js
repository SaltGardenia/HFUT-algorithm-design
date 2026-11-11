/* ============================================================================
   算法复习手册 · L7 贪心法 —— 动画脚本（deck8）
   ----------------------------------------------------------------------------
   本文件注册 3 个动画，由 assets/handbook.js 统一驱动（data-demo 名必须同名）：
     prim-mst          Prim 最小生成树：8 顶点 10 边（PPT 第 13~25 页逐帧图），
                       起点 G（PPT 中 key=0 的顶点），共 14 步，末步总权 53
     activity-select   活动选择：PPT 第 34 页的 11 个活动，按 f 升序贪心扫描，
                       共 15 步，选中的最大兼容子集 {1,4,8,11}
     huffman           哈夫曼编码：课堂练习 C={a..h}，f={83,14,28,38,131,29,20,57}，
                       共 16 步，末步给出各字符码字与平均码长 2.6925
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

  /** 画一条线；dash 非空时画虚线 */
  function seg(parent, x1, y1, x2, y2, color, w, dash) {
    return add(parent, 'line', {
      x1: x1, y1: y1, x2: x2, y2: y2,
      stroke: color, 'stroke-width': w || 1.5,
      'stroke-dasharray': dash || null, 'stroke-linecap': 'round',
      'class': 'edge'
    });
  }

  /** 画一行文字；cls 取 tx / tx-b / tx-sm，anchor 取 middle / start / end */
  function txt(parent, x, y, s, cls, anchor, fill) {
    var a = { x: x, y: y, 'class': cls || 'tx' };
    if (anchor) { a['text-anchor'] = anchor; }
    if (fill) { a.fill = fill; }
    return add(parent, 'text', a, s);
  }

  /** 画一个圆角矩形面板 */
  function panel(parent, x, y, w, h, fill, stroke, sw) {
    return add(parent, 'rect', {
      x: x, y: y, width: w, height: h, rx: 8,
      fill: fill, stroke: stroke, 'stroke-width': sw || 1.2
    });
  }

  /* ==========================================================================
     Demo 1：Prim 最小生成树 prim-mst
     图与 PPT 第 13~25 页完全同构；PPT 圆圈里只写 key 值、没有字母，
     本页为叙述方便把 8 个顶点依次记为 A~H（与 SPEC 给出的边表一致）。
     ========================================================================== */
  HB.register('prim-mst', function (root) {
    var stage = root.querySelector('.demo-stage');     // 动画画布
    var cap = root.querySelector('.demo-cap');         // 底部解说

    var INF = 9999;                                    // 用 9999 代表 ∞（显示时换成符号）
    var NAME = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];   // 顶点字母
    var POS = {                                        // 顶点坐标（照 PPT 的布局摆位）
      A: [300, 72], B: [96, 200], C: [470, 200], D: [664, 200],
      E: [96, 320], F: [300, 424], G: [470, 320], H: [664, 320]
    };
    var EDGES = [                                      // 10 条带权边（无向）
      ['A', 'B', 6], ['A', 'C', 12], ['B', 'C', 5], ['B', 'E', 14], ['B', 'F', 8],
      ['E', 'F', 3], ['C', 'D', 9], ['C', 'G', 7], ['F', 'G', 10], ['G', 'H', 15]
    ];
    var LBL = {                                        // 边权数字的位置（手工避让）
      'A,B': [174, 116], 'A,C': [394, 114], 'B,C': [283, 186], 'B,E': [56, 264],
      'B,F': [158, 318], 'E,F': [156, 392], 'C,D': [572, 186], 'C,G': [428, 262],
      'F,G': [394, 392], 'G,H': [572, 306]
    };
    var R = 21;                                        // 顶点圆半径

    /* 每一步记录：A 集合、par（MST 上的父亲）、key、当前选中的顶点、累计权值 */
    function K(o) {                                    // 把“只写有值的 key”补成全表
      var out = {}, i;
      for (i = 0; i < NAME.length; ++i) { out[NAME[i]] = INF; }
      for (i in o) { if (Object.prototype.hasOwnProperty.call(o, i)) { out[i] = o[i]; } }
      return out;
    }

    var FRAMES = [
      { a: [], par: {}, key: K({}), cur: null, total: 0,
        d: '初始：8 个顶点的 key 全为 ∞，集合 A 为空。Prim 从哪个顶点出发都能得到 MST，本页按 PPT 第 13 页取定的起点是 <b>G</b>（它的圆圈里写着 0）。' },
      { a: [], par: {}, key: K({ G: 0 }), cur: 'G', total: 0,
        d: '第 1 步：<b>G.key ← 0</b>，表示 G 到集合 A 的距离为 0，于是 G 必然成为第一个被 EXTRACT-MIN 取出的顶点。其余 7 个顶点的 key 仍是 ∞。' },
      { a: ['G'], par: { C: 'G', F: 'G', H: 'G' }, key: K({ G: 0, C: 7, F: 10, H: 15 }), cur: 'G', total: 0,
        d: '第 2 步：取出 <b>G（key=0）</b>加入 A，扫描 G 的 3 条邻边做松弛：C.key ← 7（边 G–C=7）、F.key ← 10（G–F=10）、H.key ← 15（G–H=15）。总权仍为 0。' },
      { a: ['G', 'C'], par: { C: 'G', F: 'G', H: 'G', B: 'C', A: 'C', D: 'C' },
        key: K({ G: 0, C: 7, F: 10, H: 15, B: 5, A: 12, D: 9 }), cur: 'C', total: 7,
        d: '第 3 步：V−A 中 key 最小的是 <b>C（7）</b>，把边 <b>G–C(7)</b> 加入 MST。松弛 C 的邻边：B.key ← 5、A.key ← 12、D.key ← 9。累计权值 7。' },
      { a: ['G', 'C', 'B'], par: { C: 'G', F: 'B', H: 'G', B: 'C', A: 'B', D: 'C', E: 'B' },
        key: K({ G: 0, C: 7, F: 8, H: 15, B: 5, A: 6, D: 9, E: 14 }), cur: 'B', total: 12,
        d: '第 4 步：最小 key 是 <b>B（5）</b>，加入边 <b>C–B(5)</b>。松弛 B 的邻边：A.key ← min(12, 6) = <b>6</b>、E.key ← 14、F.key ← min(10, 8) = <b>8</b>（F 的父亲由 G 改成 B）。累计权值 7+5 = 12。' },
      { a: ['G', 'C', 'B', 'A'], par: { C: 'G', F: 'B', H: 'G', B: 'C', A: 'B', D: 'C', E: 'B' },
        key: K({ G: 0, C: 7, F: 8, H: 15, B: 5, A: 6, D: 9, E: 14 }), cur: 'A', total: 18,
        d: '第 5 步：最小 key 是 <b>A（6）</b>，加入边 <b>B–A(6)</b>。A 的两个邻居 B、C 都已在 A 中，所以没有任何 key 被改进。累计权值 12+6 = 18。' },
      { a: ['G', 'C', 'B', 'A', 'F'], par: { C: 'G', F: 'B', H: 'G', B: 'C', A: 'B', D: 'C', E: 'F' },
        key: K({ G: 0, C: 7, F: 8, H: 15, B: 5, A: 6, D: 9, E: 3 }), cur: 'F', total: 26,
        d: '第 6 步：最小 key 是 <b>F（8）</b>（比 D 的 9 还小，所以 D 继续等待），加入边 <b>B–F(8)</b>。松弛 F–E：E.key ← min(14, 3) = <b>3</b>。累计权值 18+8 = 26。' },
      { a: ['G', 'C', 'B', 'A', 'F', 'E'], par: { C: 'G', F: 'B', H: 'G', B: 'C', A: 'B', D: 'C', E: 'F' },
        key: K({ G: 0, C: 7, F: 8, H: 15, B: 5, A: 6, D: 9, E: 3 }), cur: 'E', total: 29,
        d: '第 7 步：最小 key 是 <b>E（3）</b>，加入边 <b>F–E(3)</b>。E 的另一个邻居 B 已在 A 中，无更新。累计权值 26+3 = 29。' },
      { a: ['G', 'C', 'B', 'A', 'F', 'E', 'D'], par: { C: 'G', F: 'B', H: 'G', B: 'C', A: 'B', D: 'C', E: 'F' },
        key: K({ G: 0, C: 7, F: 8, H: 15, B: 5, A: 6, D: 9, E: 3 }), cur: 'D', total: 38,
        d: '第 8 步：最小 key 是 <b>D（9）</b>，加入边 <b>C–D(9)</b>。D 只有 C 一个邻居且已在 A 中。累计权值 29+9 = 38。' },
      { a: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], par: { C: 'G', F: 'B', H: 'G', B: 'C', A: 'B', D: 'C', E: 'F' },
        key: K({ G: 0, C: 7, F: 8, H: 15, B: 5, A: 6, D: 9, E: 3 }), cur: 'H', total: 53,
        d: '第 9 步：只剩 <b>H（key=15）</b>，加入边 <b>G–H(15)</b>。此时 A = V，MST 恰好 |V|−1 = 7 条边，总权 38+15 = <b>53</b>。' },
      { a: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], par: { C: 'G', F: 'B', H: 'G', B: 'C', A: 'B', D: 'C', E: 'F' },
        key: K({ G: 0, C: 7, F: 8, H: 15, B: 5, A: 6, D: 9, E: 3 }), cur: null, total: 53,
        d: '完成：MST = {E–F:3, B–C:5, A–B:6, C–G:7, B–F:8, C–D:9, G–H:15}，总权 3+5+6+7+8+9+15 = <b>53</b>，与 PPT 第 4 页给出的最小生成树完全一致。' },
      { a: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], par: { C: 'G', F: 'B', H: 'G', B: 'C', A: 'B', D: 'C', E: 'F' },
        key: K({ G: 0, C: 7, F: 8, H: 15, B: 5, A: 6, D: 9, E: 3 }), cur: null, total: 53,
        d: '被排除的 3 条边：A–C(12) 在环 A–B–C 上最大（12 &gt; 6、5）；B–E(14) 在环 B–F–E 上最大（14 &gt; 8、3）；F–G(10) 在环 F–B–C–G 上最大（10 &gt; 8、5、7）。环上的最大边一定不在 MST 里。' },
      { a: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], par: { C: 'G', F: 'B', H: 'G', B: 'C', A: 'B', D: 'C', E: 'F' },
        key: K({ G: 0, C: 7, F: 8, H: 15, B: 5, A: 6, D: 9, E: 3 }), cur: null, total: 53,
        d: 'Kruskal 视角对照：把 10 条边按权升序 3,5,6,7,8,9,10,12,14,15 依次考察、用并查集判环，被舍弃的正好是 10、12、14 三条，得到同一棵 MST，权值同为 <b>53</b>。' },
      { a: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], par: { C: 'G', F: 'B', H: 'G', B: 'C', A: 'B', D: 'C', E: 'F' },
        key: K({ G: 0, C: 7, F: 8, H: 15, B: 5, A: 6, D: 9, E: 3 }), cur: null, total: 53,
        d: '复杂度：二叉堆（优先队列）实现 <b>O(E lg V)</b>，本例 E=10、V=8；邻接矩阵 + 线性扫描找最小 key 是 <b>O(V²)</b>，稠密图更划算；斐波那契堆可做到 O(E + V lg V)。' }
    ];

    var idx = 0;                                        // 当前帧下标

    /** 按帧号重绘整个画面 */
    function render() {
      HB.clear(stage);                                  // 清空上一帧
      var fr = FRAMES[idx];
      var svg = HB.svgRoot(760, 520, 'Prim 最小生成树逐步演示：集合 A 扩张、key 值更新、选中的树边与累计权值');
      stage.appendChild(svg);

      var inA = {}, i, u, v, w;
      for (i = 0; i < fr.a.length; ++i) { inA[fr.a[i]] = true; }

      /* 顶部状态条 */
      txt(svg, 20, 24, '第 ' + (idx + 1) + ' / ' + FRAMES.length + ' 步', 'tx-b', 'start', 'var(--c-accent)');
      txt(svg, 120, 24, 'A = {' + (fr.a.length ? fr.a.join(', ') : '∅') + '}', 'tx', 'start');
      txt(svg, 430, 24, 'key 最小的候选：' + (fr.cur ? fr.cur : '—'), 'tx-sm', 'start');
      txt(svg, 610, 24, '总权 = ' + fr.total, 'tx-b', 'start', 'var(--c-hot)');

      /* 先画边（后画点，点会盖住线头） */
      for (i = 0; i < EDGES.length; ++i) {
        u = EDGES[i][0]; v = EDGES[i][1]; w = EDGES[i][2];
        var pu = POS[u], pv = POS[v];
        var isTree = ((fr.par[v] === u && inA[v]) || (fr.par[u] === v && inA[u]));
        var isCand = ((fr.par[v] === u && !inA[v]) || (fr.par[u] === v && !inA[u]));
        if (isTree && w === (fr.par[v] === u ? fr.key[v] : fr.key[u])) {
          seg(svg, pu[0], pu[1], pv[0], pv[1], 'var(--c-hot)', 4.6);      // 已选入 MST 的树边
        } else if (isCand) {
          seg(svg, pu[0], pu[1], pv[0], pv[1], 'var(--c-accent)', 2.2, '6 5'); // 候选边（虚线）
        } else {
          seg(svg, pu[0], pu[1], pv[0], pv[1], 'var(--c-line)', 1.4);     // 普通边
        }
        var lp = LBL[u + ',' + v];
        if (lp) {
          var isTreeW = isTree && w === (fr.par[v] === u ? fr.key[v] : fr.key[u]);
          txt(svg, lp[0], lp[1], String(w), 'tx-sm' + (isTreeW ? ' tx-b' : ''), 'middle',
            isTreeW ? 'var(--c-hot)' : (isCand ? 'var(--c-accent)' : 'var(--c-ink-soft)'));
        }
      }

      /* 再画顶点：圆圈里写 key，圆圈上方写字母 */
      for (i = 0; i < NAME.length; ++i) {
        u = NAME[i];
        var p = POS[u];
        var fill = 'var(--c-panel-2)', stroke = 'var(--c-line)', sw = 1.6;
        if (inA[u]) { fill = 'var(--c-tip-bg)'; stroke = 'var(--c-ok)'; sw = 2.4; }
        if (fr.cur === u) { fill = 'var(--c-warn-bg)'; stroke = 'var(--c-hot)'; sw = 3.0; }
        if (fr.cur === u) {                             // 当前顶点的外圈高亮环
          add(svg, 'circle', { cx: p[0], cy: p[1], r: R + 6, fill: 'none',
            stroke: 'var(--c-hot)', 'stroke-width': 1.6, 'stroke-dasharray': '4 4' });
        }
        add(svg, 'circle', { cx: p[0], cy: p[1], r: R, fill: fill, stroke: stroke,
          'stroke-width': sw, 'class': 'node-circle' });
        txt(svg, p[0], p[1] + 5, fr.key[u] === INF ? '∞' : String(fr.key[u]),
          'tx tx-b', 'middle', fr.key[u] === INF ? 'var(--c-ink-soft)' : 'var(--c-ink)');
        txt(svg, p[0], p[1] - 30, u, 'tx-sm tx-b', 'middle', 'var(--c-accent-2)');
      }

      /* 底部 key 表：一行 8 个小格 */
      txt(svg, 20, 466, 'key 表（V−A 中顶点按“到 A 的最小边权”排序）', 'tx-sm', 'start');
      for (i = 0; i < NAME.length; ++i) {
        u = NAME[i];
        var bx = 22 + i * 90;
        var on = inA[u];
        panel(svg, bx, 474, 82, 28, on ? 'var(--c-tip-bg)' : 'var(--c-panel-2)',
          on ? 'var(--c-ok)' : 'var(--c-line)', on ? 1.8 : 1.0);
        txt(svg, bx + 41, 493, u + '=' + (fr.key[u] === INF ? '∞' : fr.key[u]),
          'tx', 'middle', on ? 'var(--c-ok)' : 'var(--c-ink)');
      }

      cap.innerHTML = '<b>第 ' + (idx + 1) + ' / ' + FRAMES.length + ' 步</b> · ' + fr.d;  // 更新解说（带步号）
    }

    return {
      steps: FRAMES.length,
      reset: function () { idx = 0; render(); },
      next: function () { if (idx < FRAMES.length - 1) { idx += 1; render(); } },
      prev: function () { if (idx > 0) { idx -= 1; render(); } }
    };
  });

  /* ==========================================================================
     Demo 2：活动选择 activity-select
     数据取自 PPT 第 34 页（11 个活动，f 已升序），与第 30 页的 4 活动插图同源
     ========================================================================== */
  HB.register('activity-select', function (root) {
    var stage = root.querySelector('.demo-stage');
    var cap = root.querySelector('.demo-cap');

    var ACT = [                                        // [编号, s_i, f_i]，f 升序
      [1, 1, 4], [2, 3, 5], [3, 0, 6], [4, 5, 7], [5, 3, 8], [6, 5, 9],
      [7, 6, 10], [8, 8, 11], [9, 8, 12], [10, 2, 13], [11, 12, 14]
    ];
    var T0 = 178, T1 = 866, TMAX = 14;                 // 时间轴左/右端点与最大值
    var STEP = (T1 - T0) / TMAX;                       // 每个时间单位对应的像素
    var ROWY = 84, ROWH = 29, BARH = 17;               // 行起点、行高、条形高

    function sx(t) { return T0 + t * STEP; }           // 时间 → 横坐标

    /* 每一步记录：当前考察的活动下标（-1 表示还没开始）、已选集合、j、状态、解说 */
    var FRAMES = [
      { cur: -1, A: [], j: 0, st: 'init',
        d: '输入：<b>11 个活动</b>（PPT 第 34 页算例），活动 i 占用半开区间 [s<sub>i</sub>, f<sub>i</sub>)。表已按结束时间升序排好：f = 4,5,6,7,8,9,10,11,12,13,14，这一步排序本身要 O(n lg n)。' },
      { cur: 1, A: [1], j: 1, st: 'take',
        d: '第 1 步：贪心准则 —— 选<b>结束最早</b>的活动，即 f<sub>1</sub> = 4 的活动 1。A = {1}，j = 1，竖虚线就是当前的 f<sub>j</sub> = 4。' },
      { cur: 2, A: [1], j: 1, st: 'skip',
        d: 'i = 2：s<sub>2</sub> = 3，f<sub>j</sub> = f<sub>1</sub> = 4。因为 3 &lt; 4，[3,5) 与 [1,4) 重叠 → <b>跳过</b>。' },
      { cur: 3, A: [1], j: 1, st: 'skip',
        d: 'i = 3：s<sub>3</sub> = 0 &lt; f<sub>1</sub> = 4，[0,6) 与 [1,4) 重叠 → <b>跳过</b>。活动 3 开始最早，但它太长，选它反而吃亏。' },
      { cur: 4, A: [1, 4], j: 4, st: 'take',
        d: 'i = 4：s<sub>4</sub> = 5 ≥ f<sub>1</sub> = 4 成立，[5,7) 与 [1,4) 不重叠 → <b>选中</b>。A = {1,4}，j = 4，f<sub>j</sub> 变成 7。' },
      { cur: 5, A: [1, 4], j: 4, st: 'skip',
        d: 'i = 5：s<sub>5</sub> = 3 &lt; f<sub>4</sub> = 7 → <b>跳过</b>（[3,8) 横跨了活动 4 的区间）。' },
      { cur: 6, A: [1, 4], j: 4, st: 'skip',
        d: 'i = 6：s<sub>6</sub> = 5 &lt; f<sub>4</sub> = 7 → <b>跳过</b>。' },
      { cur: 7, A: [1, 4], j: 4, st: 'skip',
        d: 'i = 7：s<sub>7</sub> = 6 &lt; f<sub>4</sub> = 7，只差 1 也不兼容 → <b>跳过</b>。贪心的判定是严格的 s<sub>i</sub> ≥ f<sub>j</sub>。' },
      { cur: 8, A: [1, 4, 8], j: 8, st: 'take',
        d: 'i = 8：s<sub>8</sub> = 8 ≥ f<sub>4</sub> = 7 → <b>选中</b>。A = {1,4,8}，j = 8，f<sub>j</sub> = 11。' },
      { cur: 9, A: [1, 4, 8], j: 8, st: 'skip',
        d: 'i = 9：s<sub>9</sub> = 8 &lt; f<sub>8</sub> = 11 → <b>跳过</b>。活动 9 与 8 同时开始却更晚结束，永远不如 8 划算。' },
      { cur: 10, A: [1, 4, 8], j: 8, st: 'skip',
        d: 'i = 10：s<sub>10</sub> = 2 &lt; f<sub>8</sub> = 11 → <b>跳过</b>。' },
      { cur: 11, A: [1, 4, 8, 11], j: 11, st: 'take',
        d: 'i = 11：s<sub>11</sub> = 12 ≥ f<sub>8</sub> = 11 → <b>选中</b>。A = {1,4,8,11}，j = 11，f<sub>j</sub> = 14，扫描结束。' },
      { cur: -1, A: [1, 4, 8, 11], j: 11, st: 'done',
        d: '结果：<b>A = {1,4,8,11}</b>，|A| = 4。11 个活动共 2<sup>11</sup> = 2048 个活动子集，穷举可知最大兼容子集正是 4 个，所以这个贪心解最优。' },
      { cur: -1, A: [3, 7, 11], j: 11, st: 'bad',
        d: '反例（换个准则就错）：若按“<b>开始最早</b>”贪心，先选 s 最小的活动 3（[0,6)），接着只能选 7（[6,10)），再选 11（[12,14)），得到 {3,7,11} 只有 <b>3</b> 个 &lt; 4。准则选错，贪婪就退化。' },
      { cur: -1, A: [1, 4, 8, 11], j: 11, st: 'done',
        d: '复杂度：不计排序时循环只跑 n−1 = 10 次，<b>O(n)</b>；若输入未按 f 排序，排序的 <b>O(n lg n)</b> 成为主导，总时间 O(n lg n)。递归版与迭代版做的事完全一样。' }
    ];

    var idx = 0;

    function render() {
      HB.clear(stage);
      var fr = FRAMES[idx];
      var svg = HB.svgRoot(880, 470, '活动选择贪心过程：11 个活动的区间图、当前活动、已选集合与结束时间 j');
      stage.appendChild(svg);

      txt(svg, 20, 26, '第 ' + (idx + 1) + ' / ' + FRAMES.length + ' 步', 'tx-b', 'start', 'var(--c-accent)');
      txt(svg, 122, 26, 'j = ' + (fr.j === 0 ? '—' : fr.j) +
        (fr.j ? '（f_j = ' + ACT[fr.j - 1][2] + '）' : ''), 'tx', 'start');
      txt(svg, 420, 26, 'A = {' + (fr.A.length ? fr.A.join(', ') : '∅') + '}', 'tx-b', 'start', 'var(--c-ok)');
      txt(svg, 660, 26, '|A| = ' + fr.A.length, 'tx-b', 'start', 'var(--c-hot)');

      /* 左侧表格：i / s_i / f_i */
      txt(svg, 30, 56, 'i', 'tx-sm tx-b', 'start');
      txt(svg, 62, 56, 's', 'tx-sm tx-b', 'start');
      txt(svg, 96, 56, 'f', 'tx-sm tx-b', 'start');
      var i, row, y;
      for (i = 0; i < ACT.length; ++i) {
        row = ACT[i];
        y = ROWY + i * ROWH;
        var sel = fr.A.indexOf(row[0]) >= 0;
        var isCur = (fr.cur === row[0]);
        var color = sel ? 'var(--c-ok)' : (isCur ? 'var(--c-hot)' : 'var(--c-ink-soft)');
        txt(svg, 30, y, String(row[0]), 'tx' + (sel || isCur ? ' tx-b' : ''), 'start', color);
        txt(svg, 62, y, String(row[1]), 'tx', 'start', color);
        txt(svg, 96, y, String(row[2]), 'tx', 'start', color);
      }

      /* 时间轴 */
      for (i = 0; i <= TMAX; ++i) {
        seg(svg, sx(i), 58, sx(i), ROWY + ACT.length * ROWH - 6,
          'var(--c-line-soft)', 1, i === 0 || i === TMAX ? null : '3 5');
        txt(svg, sx(i), ROWY + ACT.length * ROWH + 12, String(i), 'tx-sm', 'middle');
      }

      /* 区间条 */
      for (i = 0; i < ACT.length; ++i) {
        row = ACT[i];
        y = ROWY + i * ROWH;
        var isSel = fr.A.indexOf(row[0]) >= 0;
        var hot = (fr.cur === row[0]);
        var fill = 'var(--c-panel-2)', stroke = 'var(--c-line)', sw = 1.2;
        if (fr.st === 'bad') {                        // 反例帧：用另一套集合着色
          if (isSel) { fill = 'var(--c-warn-bg)'; stroke = 'var(--c-warn)'; sw = 2.2; }
        } else if (isSel) { fill = 'var(--c-tip-bg)'; stroke = 'var(--c-ok)'; sw = 2.2; }
        if (hot) { fill = 'var(--c-warn-bg)'; stroke = 'var(--c-hot)'; sw = 2.6; }
        var x1 = sx(row[1]), x2 = sx(row[2]);
        add(svg, 'rect', { x: x1, y: y - BARH + 4, width: Math.max(10, x2 - x1), height: BARH,
          rx: 4, fill: fill, stroke: stroke, 'stroke-width': sw, 'class': 'arr-bar' });
        txt(svg, (x1 + x2) / 2, y + 2, String(row[0]), 'tx-sm tx-b', 'middle',
          isSel || hot ? 'var(--c-ink)' : 'var(--c-ink-soft)');
      }

      /* 当前 f_j 的竖线 */
      if (fr.j > 0) {
        var fj = ACT[fr.j - 1][2], fx = sx(fj);
        seg(svg, fx, 50, fx, ROWY + ACT.length * ROWH - 4, 'var(--c-hot)', 2, '5 4');
        txt(svg, fx + 4, 50, 'f_' + fr.j + ' = ' + fj, 'tx-sm tx-b', 'start', 'var(--c-hot)');
      }

      /* 底部结论 */
      var by = ROWY + ACT.length * ROWH + 40;
      txt(svg, 20, by, '贪心准则：每次选「与已选集合兼容」且「结束时间最早」的活动；判定式 s_i ≥ f_j。',
        'tx-sm', 'start');
      txt(svg, 20, by + 20, '本轮结论：A = {' + (fr.A.length ? fr.A.join(', ') : '∅') + '}，共 ' +
        fr.A.length + ' 个活动' + (fr.st === 'bad' ? '（这是错误准则的结果，比最优解少 1 个）' : '') +
        '；区间不重叠 ⇒ 两两兼容。', 'tx-sm tx-b', 'start', fr.st === 'bad' ? 'var(--c-warn)' : 'var(--c-accent-2)');

      cap.innerHTML = '<b>第 ' + (idx + 1) + ' / ' + FRAMES.length + ' 步</b> · ' + fr.d;  // 更新解说

    }

    return {
      steps: FRAMES.length,
      reset: function () { idx = 0; render(); },
      next: function () { if (idx < FRAMES.length - 1) { idx += 1; render(); } },
      prev: function () { if (idx > 0) { idx -= 1; render(); } }
    };
  });

  /* ==========================================================================
     Demo 3：哈夫曼编码 huffman
     课堂练习数据：C={a..h}，f={83,14,28,38,131,29,20,57}，Σf = 400
     ========================================================================== */
  HB.register('huffman', function (root) {
    var stage = root.querySelector('.demo-stage');
    var cap = root.querySelector('.demo-cap');

    /* 叶子的最终位置（按树的中序：b g d a h c f e）与内部节点位置 */
    var LEAF = {
      b: { f: 14, x: 75, y: 340 }, g: { f: 20, x: 165, y: 340 },
      d: { f: 38, x: 255, y: 340 }, a: { f: 83, x: 345, y: 340 },
      h: { f: 57, x: 435, y: 340 }, c: { f: 28, x: 525, y: 340 },
      f: { f: 29, x: 615, y: 340 }, e: { f: 131, x: 705, y: 340 }
    };
    var INNER = {                                      // 内部节点：频率与坐标
      n1: { f: 34, x: 120.0, y: 270 }, n2: { f: 57, x: 570.0, y: 270 },
      n3: { f: 72, x: 187.5, y: 200 }, n4: { f: 114, x: 502.5, y: 200 },
      n5: { f: 155, x: 266.25, y: 130 }, n6: { f: 245, x: 603.75, y: 130 },
      rt: { f: 400, x: 435.0, y: 60 }
    };
    var LINK = [                                       // 父子关系（父, 子）
      ['n1', 'b'], ['n1', 'g'], ['n2', 'c'], ['n2', 'f'], ['n3', 'n1'], ['n3', 'd'],
      ['n4', 'h'], ['n4', 'n2'], ['n5', 'n3'], ['n5', 'a'], ['n6', 'n4'], ['n6', 'e'],
      ['rt', 'n5'], ['rt', 'n6']
    ];
    var BORN = {                                       // 该节点在第几步出现
      b: 0, g: 0, d: 0, a: 0, h: 0, c: 0, f: 0, e: 0,
      n1: 1, n2: 2, n3: 3, n4: 4, n5: 5, n6: 6, rt: 7
    };
    var CODES = { a: '01', b: '0000', c: '1010', d: '001', e: '11', f: '1011', g: '0001', h: '100' };

    function xy(id) {                                  // 取任意节点的坐标
      if (LEAF[id]) { return [LEAF[id].x, LEAF[id].y]; }
      return [INNER[id].x, INNER[id].y];
    }
    function isLeaf(id) { return !!LEAF[id]; }

    /* 每一步：当前已建到第几步（born）、本轮合并的两个孩子、解说、面板内容 */
    var FRAMES = [
      { up: 0, hi: [], d: '初始：8 个叶子，频率 a:83、b:14、c:28、d:38、e:131、f:29、g:20、h:57，合计 Σf = 400。目标：造一棵二叉树，使 <b>B(T) = Σ f(c)·d<sub>T</sub>(c)</b> 最小。' },
      { up: 1, hi: ['b', 'g'], d: '第 1 次合并：取出频率最小的两个 <b>b(14)</b> 与 <b>g(20)</b>，合并成新节点 <b>34</b>。候选集剩下 {c:28, f:29, d:38, h:57, a:83, e:131, 34}。' },
      { up: 2, hi: ['c', 'f'], d: '第 2 次合并：最小的两个是 <b>c(28)</b> 与 <b>f(29)</b>，合并成 <b>57</b>。剩下 {d:38, h:57, a:83, e:131, 34, 57}。' },
      { up: 3, hi: ['n1', 'd'], d: '第 3 次合并：<b>34</b> 与 <b>d(38)</b> 最小，合并成 <b>72</b>。剩下 {h:57, a:83, e:131, 57, 72}。' },
      { up: 4, hi: ['h', 'n2'], d: '第 4 次合并：<b>h(57)</b> 与 <b>57</b> 相等且最小，合并成 <b>114</b>（两个 57 谁在左谁在右都不影响码长）。剩下 {a:83, e:131, 72, 114}。' },
      { up: 5, hi: ['n3', 'a'], d: '第 5 次合并：<b>72</b> 与 <b>a(83)</b> 最小，合并成 <b>155</b>。剩下 {e:131, 114, 155}。' },
      { up: 6, hi: ['n4', 'e'], d: '第 6 次合并：<b>114</b> 与 <b>e(131)</b> 最小，合并成 <b>245</b>。剩下 {155, 245}。' },
      { up: 7, hi: ['n5', 'n6'], d: '第 7 次合并：<b>155</b> 与 <b>245</b> 合并成根 <b>400</b> = 总频率。共做了 n−1 = 7 次合并，哈夫曼树建成。' },
      { up: 7, hi: [], d: '标号：每个内部节点向左孩子的边记 <b>0</b>、向右记 <b>1</b>，根到叶的路径就是该字符的码字。这棵树是 <b>full binary tree</b> —— 每个内部节点恰好 2 个孩子，没有“单叉”。' },
      { up: 7, hi: [], d: '读出码字：<b>a=01（2 位）、b=0000（4 位）、c=1010（4 位）、d=001（3 位）、e=11（2 位）、f=1011（4 位）、g=0001（4 位）、h=100（3 位）</b>。频率越高码越短。' },
      { up: 7, hi: [], d: '算代价：B(T) = 83×2 + 14×4 + 28×4 + 38×3 + 131×2 + 29×4 + 20×4 + 57×3 = 166+56+112+114+262+116+80+171 = <b>1077 bit</b>（编码 400 个字符）。' },
      { up: 7, hi: [], d: '平均码长 = B(T) / Σf = 1077 / 400 = <b>2.6925 ≈ 2.693</b> bit/字符。这就是课堂练习要求的答案。' },
      { up: 7, hi: [], d: '对比定长码：8 个字符至少要 ⌈lg 8⌉ = 3 bit，总代价 3×400 = <b>1200 bit</b>（平均 3.000）。哈夫曼省下 1200−1077 = <b>123 bit</b>，约 10.25%。' },
      { up: 7, hi: ['b', 'e', 'd'], d: '解码示例：编码 “bed” = 0000 11 001 = 000011001。从根出发逐位走：<b>0000</b> 到 b，<b>11</b> 到 e，<b>001</b> 到 d。前缀码保证每一步不会走岔，解码 O(码长)。' },
      { up: 7, hi: ['b', 'g'], d: '贪心选择性质：两个频率最低的字符 x、y 可以放在<b>最深的兄弟叶子</b>上 —— 它们码长相同、码字仅最后一位不同。交换论证：把 x、y 与最深叶子的字符对换，B(T) 不会变大，故存在含这条合并的最优树。' },
      { up: 7, hi: ['b', 'g', 'n1'], d: '最优子结构：合并 x、y 为 z（f(z) = f(x)+f(y)）后，T′ = T − {x,y} 必是 C′ = C − {x,y} ∪ {z} 的最优前缀码树；否则把更优的 T″ 的 z 换回 x、y 得 B(T‴) = B(T″)+f(x)+f(y) &lt; B(T)，与 T 最优矛盾。' }
    ];

    var idx = 0;

    function render() {
      HB.clear(stage);
      var fr = FRAMES[idx];
      var svg = HB.svgRoot(800, 520, '哈夫曼编码构造过程：每步合并频率最小的两个节点，最后给出码字与平均码长');
      stage.appendChild(svg);

      txt(svg, 20, 26, '第 ' + (idx + 1) + ' / ' + FRAMES.length + ' 步', 'tx-b', 'start', 'var(--c-accent)');
      txt(svg, 122, 26, '已合并 ' + Math.min(idx, 7) + ' / 7 次', 'tx', 'start');
      txt(svg, 300, 26, '根频率 = 400（= Σf）', 'tx-sm', 'start');
      txt(svg, 560, 26, 'B(T) = ' + (idx >= 10 ? '1077' : '待算'), 'tx-b', 'start', 'var(--c-hot)');

      var i, id;
      /* 先画边：父节点已出现才画 */
      for (i = 0; i < LINK.length; ++i) {
        var pa = LINK[i][0], ch = LINK[i][1];
        if (BORN[pa] > Math.min(fr.up, 7)) { continue; }
        var pp = xy(pa), pc = xy(ch);
        seg(svg, pp[0], pp[1] + 18, pc[0], pc[1] - 16, 'var(--c-line)', 1.8);
        if (idx >= 8) {                                // 树成形后给每条边标 0 / 1
          var mx = pp[0] + (pc[0] - pp[0]) * 0.45;
          var my = pp[1] + (pc[1] - pp[1]) * 0.45;
          var bit = (pc[0] < pp[0]) ? '0' : '1';       // 左孩子（x 更小）记 0，右孩子记 1
          txt(svg, mx + (bit === '0' ? -9 : 9), my, bit, 'tx-sm tx-b', 'middle', 'var(--c-accent-2)');
        }
      }

      /* 再画节点：叶子（矩形）与内部节点（圆） */
      for (i = 0; i < 8; ++i) {
        id = ['b', 'g', 'd', 'a', 'h', 'c', 'f', 'e'][i];
        var lf = LEAF[id];
        var hotL = fr.hi.indexOf(id) >= 0;
        add(svg, 'rect', { x: lf.x - 24, y: lf.y - 16, width: 48, height: 32, rx: 6,
          fill: hotL ? 'var(--c-warn-bg)' : 'var(--c-key-bg)',
          stroke: hotL ? 'var(--c-hot)' : 'var(--c-accent)',
          'stroke-width': hotL ? 2.6 : 1.6, 'class': 'node-rect' });
        txt(svg, lf.x, lf.y - 2, id + ':' + lf.f, 'tx tx-b', 'middle');
        if (idx >= 9) {                                // 码字写在叶子下方
          txt(svg, lf.x, lf.y + 36, CODES[id], 'tx tx-b', 'middle', 'var(--c-hot)');
          txt(svg, lf.x, lf.y + 52, 'd=' + CODES[id].length, 'tx-sm', 'middle');
        }
      }
      for (i = 0; i < 7; ++i) {
        id = ['n1', 'n2', 'n3', 'n4', 'n5', 'n6', 'rt'][i];
        if (BORN[id] > Math.min(fr.up, 7)) { continue; }
        var nd = INNER[id];
        var hotN = fr.hi.indexOf(id) >= 0;
        var isNew = (fr.up === BORN[id] && idx === fr.up);
        add(svg, 'circle', { cx: nd.x, cy: nd.y, r: 21,
          fill: hotN || isNew ? 'var(--c-warn-bg)' : 'var(--c-panel-2)',
          stroke: hotN || isNew ? 'var(--c-hot)' : 'var(--c-accent)',
          'stroke-width': hotN || isNew ? 2.8 : 1.5, 'class': 'node-circle' });
        txt(svg, nd.x, nd.y + 5, String(nd.f), 'tx tx-b', 'middle');
      }

      /* 底部面板：分阶段给出结论 */
      panel(svg, 20, 400, 760, 104, 'var(--c-panel-2)', 'var(--c-line)', 1.2);
      var line1 = '', line2 = '', line3 = '';
      if (idx <= 7) {
        var rest = [];
        if (idx < 1) { rest = ['b:14', 'g:20', 'c:28', 'f:29', 'd:38', 'h:57', 'a:83', 'e:131']; }
        else if (idx < 2) { rest = ['c:28', 'f:29', 'd:38', 'h:57', 'a:83', 'e:131', '34']; }
        else if (idx < 3) { rest = ['d:38', 'h:57', 'a:83', 'e:131', '34', '57']; }
        else if (idx < 4) { rest = ['h:57', 'a:83', 'e:131', '57', '72']; }
        else if (idx < 5) { rest = ['a:83', 'e:131', '72', '114']; }
        else if (idx < 6) { rest = ['e:131', '114', '155']; }
        else if (idx < 7) { rest = ['155', '245']; }
        else { rest = ['400（根）']; }
        line1 = '当前优先队列（小根堆）里的节点：' + rest.join('、');
        line2 = '规则：每步取频率最小的两个节点合并，新节点频率 = 两者之和，再插回队列。';
        line3 = '共需 n−1 = 7 次合并；每次 EXTRACT-MIN / INSERT 是 O(lg n) ⇒ 总时间 O(n lg n)。';
      } else if (idx === 8) {
        line1 = 'a=01、b=0000、c=1010、d=001、e=11、f=1011、g=0001、h=100';
        line2 = '左孩子记 0、右孩子记 1：根 → 叶路径长度就是码长，且没有任何码字是别人的前缀。';
        line3 = '8 个叶子、7 个内部节点，共 15 个节点；深度分布 {2,2,3,3,4,4,4,4}。';
      } else if (idx === 9) {
        line1 = '码长：a=2、e=2、d=3、h=3、b=4、c=4、f=4、g=4';
        line2 = '频率最高的 e(131) 与次高的 a(83) 拿到 2 位码；最低的 b(14)、g(20) 拿 4 位码。';
        line3 = '前缀码校验：没有任何一个码字是另一个的前缀，所以解码不需要分隔符。';
      } else if (idx === 10) {
        line1 = 'B(T) = 83×2 + 14×4 + 28×4 + 38×3 + 131×2 + 29×4 + 20×4 + 57×3';
        line2 = '     = 166 + 56 + 112 + 114 + 262 + 116 + 80 + 171 = 1077 bit';
        line3 = 'B(T) 的含义：编码 400 个字符（按给定频率）总共需要的二进制位数。';
      } else if (idx === 11) {
        line1 = '平均码长 = B(T) / Σf = 1077 / 400 = 2.6925 bit/字符 ≈ 2.693';
        line2 = 'Σf = 83+14+28+38+131+29+20+57 = 400';
        line3 = '这就是 PPT 第 45 页课堂练习的答案：最优前缀码 + 平均码长 2.6925。';
      } else if (idx === 12) {
        line1 = '定长码：3 bit × 400 = 1200 bit，平均 3.000 bit/字符';
        line2 = '哈夫曼变长码：1077 bit，平均 2.6925 bit/字符';
        line3 = '节省 1200 − 1077 = 123 bit，压缩率 123/1200 ≈ 10.25%。';
      } else if (idx === 13) {
        line1 = 'bed = 0000 11 001 = 000011001（共 9 bit，定长码要 3×3 = 9 bit，字符少时优势不明显）';
        line2 = '解码：0000→b、11→e、001→d；每到一个叶子就回根重新开始。';
        line3 = '若码字有前缀关系（如 a=0、b=01），0001 就会有歧义 —— 这正是前缀码要排除的。';
      } else if (idx === 14) {
        line1 = '贪心选择：x、y 是频率最低的两个字符，则存在一棵最优树让它们成为最深的一对兄弟叶子。';
        line2 = '理由：若最优树里更深的叶子上放着别的字符，与 x（或 y）对换后 B(T) 只减不增。';
        line3 = '所以“合并最小的两个”这一步不会破坏最优性 —— 这就是贪心选择性质。';
      } else {
        line1 = '最优子结构：T 最优 ⇒ T′ = T − {x,y} 是 C′ = C − {x,y} ∪ {z} 的最优前缀码树。';
        line2 = '反证：若 T′ 不最优，取更优的 T″，把 z 展开成 x、y 得 T‴，';
        line3 = '则 B(T‴) = B(T″) + f(x) + f(y) < B(T′) + f(x) + f(y) = B(T)，与 T 最优矛盾。';
      }
      txt(svg, 36, 426, line1, 'tx' + (idx >= 10 && idx <= 12 ? ' tx-b' : ''), 'start');
      txt(svg, 36, 454, line2, 'tx-sm', 'start');
      txt(svg, 36, 482, line3, 'tx-sm', 'start');

      cap.innerHTML = '<b>第 ' + (idx + 1) + ' / ' + FRAMES.length + ' 步</b> · ' + fr.d;  // 更新解说
    }

    return {
      steps: FRAMES.length,
      reset: function () { idx = 0; render(); },
      next: function () { if (idx < FRAMES.length - 1) { idx += 1; render(); } },
      prev: function () { if (idx > 0) { idx -= 1; render(); } }
    };
  });
})();
