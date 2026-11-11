/* ============================================================================
   算法复习手册 · Deck3 动画（算法分析基础）
   注册名（必须与 deck3.html 里的 data-demo 完全一致）：
     recursion-tree       T(n)=T(n/4)+T(n/2)+n² 递归树逐层生长（7 步）
     master-three-cases   主方法三种情况的权重分布切换（10 步）
     substitution-fail    代换法"错误证明"的失败与加强假设的补救（8 步）
   仅实现 reset / prev / next，播放由 handbook.js 统一驱动。
   所有公式与数值均按 _extract/d3_small、_extract/d3_media 中的 PPT 原图核对。
   ========================================================================== */
(function () {
  'use strict';

  var HB = window.HB;
  if (!HB || typeof HB.register !== 'function') { return; }

  /* 配色统一走 handbook.css 的 CSS 变量 */
  var C = {
    ink: 'var(--c-ink)',
    soft: 'var(--c-ink-soft)',
    line: 'var(--c-line)',
    lineSoft: 'var(--c-line-soft)',
    panel: 'var(--c-panel-2)',
    keyBg: 'var(--c-key-bg)',
    accent: 'var(--c-accent)',
    accent2: 'var(--c-accent-2)',
    hot: 'var(--c-hot)',
    ok: 'var(--c-ok)',
    warn: 'var(--c-warn)'
  };

  /* ------------------------------------------------------------ 绘图小工具 */

  /** 在 parent 下创建 SVG 元素并挂上 */
  function add(parent, tag, attrs, text) {
    var n = HB.svg(tag, attrs, text);
    parent.appendChild(n);
    return n;
  }

  /** 文本：anchor 默认居中，fill 传入则用行内 style 覆盖 */
  function label(parent, x, y, s, cls, anchor, fill) {
    var a = { x: x, y: y, class: cls || 'tx', 'text-anchor': anchor || 'middle' };
    if (fill) { a.style = 'fill:' + fill; }
    return add(parent, 'text', a, s);
  }

  /** 圆角矩形 + 居中文字 */
  function box(parent, x, y, w, h, text, o) {
    o = o || {};
    var r = add(parent, 'rect', {
      x: x, y: y, width: w, height: h,
      rx: (o.rx == null ? 6 : o.rx),
      fill: o.fill || C.panel,
      stroke: o.stroke || C.line,
      'stroke-width': (o.sw == null ? 1.2 : o.sw),
      class: o.cls || 'node-rect'
    });
    if (text) {
      label(parent, x + w / 2, y + h / 2 + (o.dy == null ? 4 : o.dy), text,
        o.tcls || 'tx', 'middle', o.ink);
    }
    return r;
  }

  /** 直线段 */
  function seg(parent, x1, y1, x2, y2, o) {
    o = o || {};
    return add(parent, 'line', {
      x1: x1, y1: y1, x2: x2, y2: y2,
      stroke: o.stroke || C.line,
      'stroke-width': (o.sw == null ? 1.2 : o.sw),
      'stroke-dasharray': o.dash || null,
      class: o.cls || 'edge'
    });
  }

  /** 柱状条 */
  function bar(parent, x, base, w, h, fill) {
    return add(parent, 'rect', {
      x: x, y: base - h, width: w, height: h, rx: 3,
      fill: fill, stroke: 'none', class: 'arr-bar'
    });
  }

  /* ======================================================================== *
   * 动画 1：递归树 T(n) = T(n/4) + T(n/2) + n²  逐层生长
   * ======================================================================== */
  HB.register('recursion-tree', function (root) {
    var stage = root.querySelector('.demo-stage');
    var cap = root.querySelector('.demo-cap');
    var W = 990, H = 500;
    var MAX = 6;

    var LY = [46, 126, 206, 286, 358];                 // 各层纵坐标
    var TN = [1, 2, 4, 8, 16];                         // 各层节点数
    var COST = [1, 5 / 16, 25 / 256, 125 / 4096, 625 / 65536]; // 该层代价（× n²）
    var CTXT = ['1', '5/16', '25/256', '125/4096', '625/65536'];
    var CUM = ['1.0000', '1.3125', '1.4102', '1.4407', '1.4502'];
    var TX = 40, TW = 520;                             // 树的绘制区
    var RX = 600;                                      // 右侧表格区

    var CAPS = [
      '第 0 步：递归式 <b>T(n) = T(n/4) + T(n/2) + n²</b>。根节点代表规模 n 的问题，"划分 + 合并"的代价是 <b>n²</b>；' +
      '两个子问题规模分别是 n/4 与 n/2，<b>子问题规模不相等</b>，所以本例不能用主方法，只能用递归树 + 代换法。',
      '第 1 步：展开第 1 层，得到 (n/4)² 与 (n/2)² 两个节点。该层代价 = (n/4)² + (n/2)² = (1/16 + 1/4)n² = <b>5n²/16</b>；' +
      '累计和 = n² + 5n²/16 = 1.3125n²。',
      '第 2 步：展开第 2 层，4 个节点的代价 = (n/16)² + (n/8)² + (n/8)² + (n/4)² = <b>25n²/256</b> ≈ 0.0977n²；' +
      '累计和 ≈ 1.4102n²。可见每层代价都是上一层的 <b>5/16</b> 倍。',
      '第 3 步：展开第 3 层，8 个节点的代价 = 25n²/256 × 5/16 = <b>125n²/4096</b> ≈ 0.0305n²；累计和 ≈ 1.4407n²。' +
      '层代价已经衰减到不足 n² 的 3.1%。',
      '第 4 步：展开第 4 层共 16 个节点，该层代价 = <b>625n²/65536</b> ≈ 0.0095n²；累计和 ≈ 1.4502n²，' +
      '与最终的 1.4545n² 只差 0.0043n² —— <b>几何级数基本收敛</b>。',
      '第 5 步：各层代价构成公比 r = 5/16 &lt; 1 的等比数列，故 和 = n²(1 + 5/16 + (5/16)² + (5/16)³ + …) ' +
      '= n² · 1/(1 − 5/16) = <b>16n²/11 ≈ 1.4545n²</b>，即 <b>O(n²)</b>。',
      '第 6 步：结论 <b>T(n) = Θ(n²)</b>。下界 Ω(n²) 由根节点代价直接给出（T(n) ≥ n²）；' +
      '上界 O(n²) 由上面的收敛级数给出。递归树给出的猜想，还要用代换法严格验证。'
    ];

    function popcount(x) { var c = 0; while (x > 0) { c += x & 1; x = x >> 1; } return c; }

    /* 第 i 层第 j 个节点的子问题分母：4^k · 2^(i−k)，k = j 的二进制中 1 的个数 */
    function denom(i, j) {
      var k = popcount(j);
      return Math.pow(4, k) * Math.pow(2, i - k);
    }

    function nodeText(i, j) {
      if (i === 0) { return 'n²'; }
      if (i > 3) { return ''; }            // 第 4 层节点太小，只画方块
      return '(n/' + denom(i, j) + ')²';
    }

    var step = 0;

    function render() {
      HB.clear(stage);
      var svg = HB.svgRoot(W, H, 'T(n)=T(n/4)+T(n/2)+n² 的递归树逐层展开与几何级数求和');
      stage.appendChild(svg);

      var shown = Math.min(step, 4);        // 已展开到第几层
      var pos = [], i, j, x, y, w, h, px, py, isNew;

      for (i = 0; i <= shown; i++) {
        var n = TN[i];
        pos[i] = [];
        w = Math.min(88, TW / n - 6);
        h = 30;
        y = LY[i];
        for (j = 0; j < n; j++) {
          x = TX + (j + 0.5) * (TW / n);
          pos[i][j] = { x: x, y: y };
          isNew = (i === shown && step <= 4);
          if (i >= 1) {
            px = pos[i - 1][Math.floor(j / 2)].x;
            py = pos[i - 1][Math.floor(j / 2)].y;
            seg(svg, px, py + h / 2, x, y - h / 2, { stroke: isNew ? C.accent : C.line });
          }
          box(svg, x - w / 2, y - h / 2, w, h, nodeText(i, j), {
            fill: i === 0 ? C.keyBg : C.panel,
            stroke: isNew ? C.accent : C.line,
            sw: isNew ? 1.8 : 1.1,
            cls: 'node-rect' + (isNew ? ' hb-in' : ''),
            tcls: i >= 3 ? 'tx-sm' : 'tx',
            ink: i === 0 ? C.accent : null
          });
        }
      }

      /* 叶子层标注 */
      if (shown === 4) {
        label(svg, TX + TW / 2, LY[4] + 34,
          '第 4 层：16 个节点，继续细分直到 Θ(1)', 'tx-sm', 'middle', C.soft);
      }
      label(svg, TX, 22, 'T(n) = T(n/4) + T(n/2) + n²', 'tx-b', 'start', C.ink);
      label(svg, TX + TW, LY[0] + 34, '根：代价 n²', 'tx-sm', 'end', C.soft);

      /* ---------------- 右侧：层代价与累计和 ---------------- */
      add(svg, 'rect', {
        x: RX - 16, y: 22, width: W - RX + 4, height: H - 46, rx: 8,
        fill: 'none', stroke: C.lineSoft
      });
      label(svg, RX, 46, '层代价与累计和（× n²）', 'tx-b', 'start', C.ink);
      label(svg, RX, 74, '层', 'tx-sm', 'start', C.soft);
      label(svg, RX + 50, 74, '节点数', 'tx-sm', 'start', C.soft);
      label(svg, RX + 130, 74, '该层代价', 'tx-sm', 'start', C.soft);
      label(svg, RX + 250, 74, '累计和', 'tx-sm', 'start', C.soft);

      for (i = 0; i <= shown; i++) {
        y = 100 + i * 26;
        var strong = (i === shown && step <= 4);
        var col = strong ? C.accent : null;
        label(svg, RX, y, '第 ' + i + ' 层', 'tx-sm', 'start', col);
        label(svg, RX + 50, y, String(TN[i]), 'tx-sm', 'start', col);
        label(svg, RX + 130, y, CTXT[i], 'tx-sm', 'start', col);
        label(svg, RX + 250, y, CUM[i], 'tx-sm', 'start', col);
      }

      if (step >= 5) {
        seg(svg, RX, 236, W - 24, 236, { stroke: C.line });
        label(svg, RX, 264, '和 = n²(1 + 5/16 + (5/16)² + (5/16)³ + …)', 'tx', 'start', C.ink);
        label(svg, RX, 292, '公比 r = 5/16 < 1 ⇒ 几何级数收敛', 'tx-sm', 'start', C.soft);
        label(svg, RX, 320, '= n² · 1/(1 − 5/16) = 16n²/11 ≈ 1.4545n²', 'tx', 'start', C.accent2);
        label(svg, RX, 356, '⇒ T(n) = Θ(n²)', 'tx-b', 'start', C.hot);
        if (step === 6) {
          label(svg, RX, 390, '对照：5/16 &lt; 1 ⇒ 级数收敛，根层主导', 'tx-sm', 'start', C.soft);
          label(svg, RX, 412, '（主方法要求子问题规模相同，本例不适用）', 'tx-sm', 'start', C.soft);
        }
      }
    }

    function update() {
      if (cap) { cap.innerHTML = CAPS[step]; }
      render();
    }

    return {
      reset: function () { step = 0; update(); },
      prev: function () { if (step > 0) { step--; } update(); },
      next: function () { if (step < MAX) { step++; } update(); }
    };
  });

  /* ======================================================================== *
   * 动画 2：主方法三种情况的权重分布
   * ======================================================================== */
  HB.register('master-three-cases', function (root) {
    var stage = root.querySelector('.demo-stage');
    var cap = root.querySelector('.demo-cap');
    var W = 990, H = 520;

    var CASE = {
      1: {
        title: '情况 1（CASE 1）',
        cond: 'f(n) = O(n^(log_b a − ε))，常量 ε > 0',
        sub: 'f(n) 比 n^(log_b a) 增长得慢（慢 n^ε 倍）',
        res: 'T(n) = Θ(n^(log_b a))',
        why: '加权从根到叶子几何级数增长，叶子在总权重中占常数比例 ⇒ 叶子层主导',
        ex: '例：T(n) = 4T(n/2) + n，n^(log_b a) = n²，f(n) = n = O(n^(2−ε))（ε = 1）⇒ T(n) = Θ(n²)',
        bars: [8, 18, 40, 86],
        nums: ['1', '3', '9', '27'],
        color: 'accent'
      },
      2: {
        title: '情况 2（CASE 2）',
        cond: 'f(n) = Θ(n^(log_b a))',
        sub: 'f(n) 与 n^(log_b a) 同阶（k = 0 时即 f(n) = Θ(n^(log_b a) lg^0 n)）',
        res: 'T(n) = Θ(n^(log_b a) lg n) = Θ(f(n) lg n)',
        why: '每一层的加权基本相同 ⇒ 共 log_b n 层，每层同阶 ⇒ 总代价 = 每层 × 层数',
        ex: '例：T(n) = 4T(n/2) + n²，n^(log_b a) = n²，f(n) = n² = Θ(n² lg^0 n)（k = 0）⇒ T(n) = Θ(n² lg n)',
        bars: [34, 34, 34, 34],
        nums: ['1', '1', '1', '1'],
        color: 'accent2'
      },
      3: {
        title: '情况 3（CASE 3）',
        cond: 'f(n) = Ω(n^(log_b a + ε))，常量 ε > 0',
        sub: 'f(n) 比 n^(log_b a) 增长得快（快 n^ε 倍），并且满足规定条件 a·f(n/b) ≤ c·f(n)，常量 c < 1',
        res: 'T(n) = Θ(f(n))',
        why: '权重从根到叶子几何级数递减，根在整个权重中仅占常数部分 ⇒ 根层主导',
        ex: '例：T(n) = 4T(n/2) + n³，n^(log_b a) = n²，f(n) = n³ = Ω(n^(2+ε))（ε = 1），且 4(cn/2)³ ≤ cn³ 取 c = 1/2 ⇒ T(n) = Θ(n³)',
        bars: [86, 40, 18, 8],
        nums: ['27', '9', '3', '1'],
        color: 'hot'
      }
    };

    var COLOR = { accent: C.accent, accent2: C.accent2, hot: C.hot };
    var BAR_LBL = ['f(n)', 'a·f(n/b)', 'a²·f(n/b²)', 'n^(log_b a)·T(1)'];

    /* 10 步：0 总览 → 1~2 情况1 → 3~4 情况2 → 5~6 情况3 → 7 对比 → 8 不适用 → 9 小结 */
    var STEPS = [
      { mode: 'tree', k: 0,
        cap: '主方法适用于 <b>T(n) = aT(n/b) + f(n)</b>（a ≥ 1、b &gt; 1 为常数，f(n) 是渐近正函数）：把规模 n 的问题划分为 ' +
             'a 个子问题，每个规模 n/b，划分与合并的代价是 f(n)。这棵递归树共 <b>log<sub>b</sub>n</b> 层，' +
             '叶子数为 a<sup>log<sub>b</sub>n</sup> = <b>n<sup>log<sub>b</sub>a</sup></b>，叶子层总代价 = n<sup>log<sub>b</sub>a</sup>·T(1)。' },
      { mode: 'tree', k: 1, phase: 'cond',
        cap: '情况 1：<b>f(n) = O(n<sup>log<sub>b</sub>a − ε</sup>)</b>（常量 ε &gt; 0），即 f(n) 比 n<sup>log<sub>b</sub>a</sup> 增长得慢 n<sup>ε</sup> 倍。' +
             '看右侧柱高：逐层加权<b>递增</b>（1 → 3 → 9 → 27），叶子层最重。' },
      { mode: 'tree', k: 1, phase: 'sum',
        cap: '情况 1 结论：<b>T(n) = Θ(n<sup>log<sub>b</sub>a</sup>)</b>。例：T(n) = 4T(n/2) + n，a = 4、b = 2 ⇒ n<sup>log<sub>b</sub>a</sup> = n²，' +
             'f(n) = n = O(n<sup>2−ε</sup>) 取 ε = 1，故 T(n) = Θ(n²)。' },
      { mode: 'tree', k: 2, phase: 'cond',
        cap: '情况 2：<b>f(n) = Θ(n<sup>log<sub>b</sub>a</sup>)</b>。看右侧柱高：<b>每层加权基本相同</b>（1 → 1 → 1 → 1）。' },
      { mode: 'tree', k: 2, phase: 'sum',
        cap: '情况 2 结论：<b>T(n) = Θ(n<sup>log<sub>b</sub>a</sup> lg n) = Θ(f(n) lg n)</b>。例：T(n) = 4T(n/2) + n²，' +
             'n<sup>log<sub>b</sub>a</sup> = n²，f(n) = n² = Θ(n² lg<sup>0</sup>n)（k = 0）⇒ T(n) = Θ(n² lg n)。' },
      { mode: 'tree', k: 3, phase: 'cond',
        cap: '情况 3：<b>f(n) = Ω(n<sup>log<sub>b</sub>a + ε</sup>)</b>（常量 ε &gt; 0），即 f(n) 比 n<sup>log<sub>b</sub>a</sup> 增长得快 n<sup>ε</sup> 倍，' +
             '<b>并且 f(n) 满足规定条件 a·f(n/b) ≤ c·f(n)（常量 c &lt; 1）</b>。看右侧柱高：权重<b>递减</b>（27 → 9 → 3 → 1）。' },
      { mode: 'tree', k: 3, phase: 'sum',
        cap: '情况 3 结论：<b>T(n) = Θ(f(n))</b>。例：T(n) = 4T(n/2) + n³，n<sup>log<sub>b</sub>a</sup> = n²，f(n) = n³ = Ω(n<sup>2+ε</sup>)（ε = 1），' +
             '正则条件 4(cn/2)³ ≤ cn³ 取 c = 1/2 时成立 ⇒ T(n) = Θ(n³)。' },
      { mode: 'compare',
        cap: '三种情况的差别只在 f(n) 与 n<sup>log<sub>b</sub>a</sup> 的相对大小：<b>慢 n<sup>ε</sup> 倍 → 叶子主导；同阶 → 每层叠加；快 n<sup>ε</sup> 倍（且满足正则条件）→ 根主导</b>。' },
      { mode: 'unfit',
        cap: '主方法并非万能。例：<b>T(n) = 4T(n/2) + n²/lg n</b>，n<sup>log<sub>b</sub>a</sup> = n²，而 f(n) = n²/lg n：' +
             '它比 n² 只小了 lg n 倍，<b>不是多项式地小</b>（找不到 ε &gt; 0 使 f(n) = O(n<sup>2−ε</sup>)，故情况 1 不成立）；' +
             'f(n) ≠ Θ(n²)，情况 2 不成立；f(n) 也不比 n² 大，情况 3 不成立 —— <b>这时主方法不适用</b>，需改用递归树或代换法。' },
      { mode: 'summary',
        cap: '小结：比较基准是 <b>n<sup>log<sub>b</sub>a</sup></b>（递归树叶子层的总代价量级）。f(n) 多项式地小于它 → Θ(n<sup>log<sub>b</sub>a</sup>)；' +
             '与它同阶 → Θ(n<sup>log<sub>b</sub>a</sup> lg n)；多项式地大于它且满足 a·f(n/b) ≤ c·f(n)（c &lt; 1）→ Θ(f(n))。' }
    ];
    var MAX = STEPS.length - 1;
    var step = 0;

    /* ---------------- 通用递归树 ---------------- */
    function drawTree(svg, k) {
      var col = k ? COLOR[CASE[k].color] : C.line;
      var i, j, px;
      /* 高度标注 */
      seg(svg, 26, 46, 26, 330, { stroke: C.warn, sw: 1.6 });
      label(svg, 22, 60, 'h = log_b n', 'tx-sm', 'middle', C.warn);

      box(svg, 168, 40, 104, 32, 'f(n)', {
        stroke: col, sw: 1.8, fill: C.keyBg, ink: col
      });
      label(svg, 400, 60, '← 根：改造成 a 个子问题的代价', 'tx-sm', 'start', C.soft);

      for (i = 0; i < 3; i++) {
        px = 100 + i * 120;
        seg(svg, 220, 72, px + 42, 130, { stroke: col });
        box(svg, px, 130, 84, 30, 'f(n/b)', { stroke: col, fill: C.panel, ink: col });
      }
      label(svg, 400, 150, '← 第 1 层：a 个节点，该层加权 a·f(n/b)', 'tx-sm', 'start', C.soft);

      for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++) {
          var x = 58 + i * 120 + j * 30;
          seg(svg, 100 + i * 120 + 42, 160, x + 12, 208, { stroke: C.lineSoft });
          box(svg, x, 208, 24, 16, '', { stroke: C.lineSoft, fill: C.panel, rx: 3 });
        }
      }
      label(svg, 400, 220, '← 第 2 层：a² 个节点，该层加权 a²·f(n/b²)', 'tx-sm', 'start', C.soft);
      label(svg, 220, 250, '⋮', 'tx-b', 'middle', C.soft);
      label(svg, 220, 278, '共 log_b n 层', 'tx-sm', 'middle', C.soft);
      box(svg, 120, 296, 200, 30, 'T(1) 叶子 × n^(log_b a)', {
        stroke: col, sw: 1.6, fill: C.panel, tcls: 'tx-sm', ink: col
      });
      label(svg, 400, 316, '← 叶子层总代价 n^(log_b a)·T(1) = 比较基准', 'tx-sm', 'start', C.soft);
    }

    /* ---------------- 右侧柱状权重图 ---------------- */
    function drawBars(svg, k, x0, base, bw, gap, scale) {
      var d = CASE[k];
      var col = COLOR[d.color];
      var i, x;
      label(svg, x0 - 6, base - 108, '该层加权（相对量级）', 'tx-sm', 'start', C.soft);
      for (i = 0; i < 4; i++) {
        x = x0 + i * (bw + gap);
        bar(svg, x, base, bw, d.bars[i] * scale, col);
        label(svg, x + bw / 2, base - d.bars[i] * scale - 8, d.nums[i], 'tx-sm', 'middle', col);
        label(svg, x + bw / 2, base + 16, BAR_LBL[i].replace('^(log_b a)', '^(log_ba)'),
          'tx-sm', 'middle', C.soft);
      }
      seg(svg, x0 - 12, base, x0 + 4 * (bw + gap), base, { stroke: C.line });
    }

    function render() {
      HB.clear(stage);
      var svg = HB.svgRoot(W, H, '主方法三种情况的递归树加权分布对比');
      stage.appendChild(svg);
      var s = STEPS[step];
      var i, x0;

      if (s.mode === 'tree') {
        drawTree(svg, s.k);
        add(svg, 'rect', {
          x: 496, y: 22, width: W - 512, height: H - 46, rx: 8,
          fill: 'none', stroke: C.lineSoft
        });
        if (s.k === 0) {
          label(svg, 516, 56, '主方法的比较基准', 'tx-b', 'start', C.ink);
          label(svg, 516, 92, 'n^(log_b a)：递归树叶子层的总代价量级', 'tx', 'start', C.accent);
          label(svg, 516, 124, '三种情况就是把 f(n) 与它作比较：', 'tx-sm', 'start', C.soft);
          label(svg, 516, 152, '· 多项式地更小 → Θ(n^(log_b a))', 'tx-sm', 'start', C.soft);
          label(svg, 516, 178, '· 同阶 → Θ(n^(log_b a) lg n)', 'tx-sm', 'start', C.soft);
          label(svg, 516, 204, '· 多项式地更大（且满足正则条件）→ Θ(f(n))', 'tx-sm', 'start', C.soft);
          drawBars(svg, 2, 560, 380, 66, 28, 1);
          label(svg, 516, 440, '递归树示意：a = 3、b = 3 画法，实际 a、b 任意', 'tx-sm', 'start', C.soft);
        } else {
          var d = CASE[s.k];
          label(svg, 516, 56, d.title, 'tx-b', 'start', COLOR[d.color]);
          label(svg, 516, 88, '条件：' + d.cond, 'tx', 'start', C.ink);
          label(svg, 516, 114, d.sub, 'tx-sm', 'start', C.soft);
          drawBars(svg, s.k, 536, 400, 74, 26, 1);
          label(svg, 516, 442, (s.phase === 'sum' ? '结论：' : '权重分布：') + (s.phase === 'sum' ? d.res : d.why),
            'tx-b', 'start', s.phase === 'sum' ? C.hot : C.ink);
          if (s.phase === 'sum') {
            label(svg, 516, 468, d.ex, 'tx-sm', 'start', C.soft);
          }
        }
      } else if (s.mode === 'compare') {
        label(svg, 30, 44, '三种情况的递归树加权分布对比（柱高 = 该层加权）', 'tx-b', 'start', C.ink);
        var ks = [1, 2, 3], xx, kk, jj;
        for (i = 0; i < 3; i++) {
          kk = ks[i];
          xx = 40 + i * 320;
          add(svg, 'rect', { x: xx, y: 70, width: 300, height: 400, rx: 8, fill: 'none', stroke: C.lineSoft });
          label(svg, xx + 150, 100, CASE[kk].title, 'tx-b', 'middle', COLOR[CASE[kk].color]);
          label(svg, xx + 150, 124, CASE[kk].cond, 'tx-sm', 'middle', C.soft);
          for (jj = 0; jj < 4; jj++) {
            bar(svg, xx + 30 + jj * 64, 320, 46, CASE[kk].bars[jj], COLOR[CASE[kk].color]);
            label(svg, xx + 53 + jj * 64, 320 - CASE[kk].bars[jj] - 8, CASE[kk].nums[jj], 'tx-sm', 'middle', COLOR[CASE[kk].color]);
            label(svg, xx + 53 + jj * 64, 336, ['f', 'af', 'a²f', 'n^log'][jj], 'tx-sm', 'middle', C.soft);
          }
          seg(svg, xx + 18, 320, xx + 282, 320, { stroke: C.line });
          label(svg, xx + 150, 380, ['逐层递增：叶子主导', '每层相同：叠加 log_b n 层', '逐层递减：根主导'][i], 'tx-sm', 'middle', C.soft);
          label(svg, xx + 150, 412, CASE[kk].res, 'tx', 'middle', C.hot);
        }
        label(svg, 40, 496, '判断顺序：先看 f(n) 是否多项式地小于 / 同阶 / 大于 n^(log_b a)；情况 3 还必须额外验证 a·f(n/b) ≤ c·f(n)（c < 1）。',
          'tx-sm', 'start', C.soft);
      } else if (s.mode === 'unfit') {
        label(svg, 30, 52, '主方法不适用的例子', 'tx-b', 'start', C.ink);
        label(svg, 30, 92, 'T(n) = 4T(n/2) + n² / lg n', 'tx', 'start', C.hot);
        label(svg, 30, 126, 'a = 4，b = 2 ⇒ n^(log_b a) = n²，f(n) = n² / lg n', 'tx', 'start', C.ink);
        label(svg, 30, 168, '情况 1：f(n) 比 n² 只小了 lg n 倍，不是多项式地小', 'tx', 'start', C.ink);
        label(svg, 60, 196, '（不存在 ε > 0 使 f(n) = O(n^(2−ε))）⇒ 不成立', 'tx-sm', 'start', C.soft);
        label(svg, 30, 236, '情况 2：f(n) ≠ Θ(n²)（比值 1/lg n → 0）⇒ 不成立', 'tx', 'start', C.ink);
        label(svg, 30, 276, '情况 3：f(n) 并不比 n² 大 ⇒ 不成立', 'tx', 'start', C.ink);
        seg(svg, 30, 300, 960, 300, { stroke: C.lineSoft });
        label(svg, 30, 336, '∴ 这时主方法不适用。', 'tx-b', 'start', C.hot);
        label(svg, 30, 372, '补充（教材结论，PPT 未给出）：该递归式的解为 T(n) = Θ(n² lg lg n)，', 'tx-sm', 'start', C.soft);
        label(svg, 30, 396, '需用递归树逐层求和或代换法验证，不能用主方法的三种情况硬套。', 'tx-sm', 'start', C.soft);
        label(svg, 30, 440, '另一个典型反例：T(n) = T(n/3) + T(2n/3) + cn —— 两个子问题规模不同，主方法同样不适用。', 'tx-sm', 'start', C.soft);
      } else {
        /* summary：三行总结表 */
        label(svg, 30, 46, '主方法三种情况一览', 'tx-b', 'start', C.ink);
        var cols = [30, 150, 470, 700];
        var rows = [
          ['情况', '条件', '结论', '递归树权重分布'],
          ['情况 1', 'f(n) = O(n^(log_b a − ε))，ε > 0', 'T(n) = Θ(n^(log_b a))', '逐层递增，叶子占常数比例'],
          ['情况 2', 'f(n) = Θ(n^(log_b a))', 'T(n) = Θ(n^(log_b a) lg n) = Θ(f(n) lg n)', '每层基本相同，共 log_b n 层'],
          ['情况 3', 'f(n) = Ω(n^(log_b a + ε))，ε > 0 且', 'T(n) = Θ(f(n))', '逐层递减，根占常数比例'],
          ['', 'a·f(n/b) ≤ c·f(n)，c < 1', '', '']
        ];
        var ry, cx2;
        for (i = 0; i < rows.length; i++) {
          ry = 76 + i * 62;
          seg(svg, 30, ry - 26, 960, ry - 26, { stroke: C.lineSoft });
          for (var c2 = 0; c2 < 4; c2++) {
            label(svg, cols[c2], ry, rows[i][c2],
              i === 0 ? 'tx-b' : 'tx-sm', 'start',
              i === 0 ? C.ink : (i === 3 ? C.hot : null));
          }
        }
        seg(svg, 30, 76 + 4 * 62 + 40, 960, 76 + 4 * 62 + 40, { stroke: C.lineSoft });
        label(svg, 30, 76 + 4 * 62 + 70, '提醒：三种情况都要求递归式形如 T(n) = aT(n/b) + f(n)（a ≥ 1、b > 1、f 渐近正），', 'tx-sm', 'start', C.soft);
        label(svg, 30, 76 + 4 * 62 + 94, '且子问题规模必须相同；否则（如 T(n)=T(n/3)+T(2n/3)+cn、T(n)=4T(n/2)+n²/lg n）只能用递归树或代换法。', 'tx-sm', 'start', C.soft);
      }
    }

    function update() {
      if (cap) { cap.innerHTML = STEPS[step].cap; }
      render();
    }

    return {
      reset: function () { step = 0; update(); },
      prev: function () { if (step > 0) { step--; } update(); },
      next: function () { if (step < MAX) { step++; } update(); }
    };
  });

  /* ======================================================================== *
   * 动画 3：代换法 —— 错误证明的失败与加强假设的补救
   * ======================================================================== */
  HB.register('substitution-fail', function (root) {
    var stage = root.querySelector('.demo-stage');
    var cap = root.querySelector('.demo-cap');
    var W = 990, H = 640;

    var ROWS = [
      { t: '目标：T(n) = 4T(n/2) + n，已知 T(1) = Θ(1)，猜测 T(n) = O(n²)', k: 'goal' },
      { t: '第一步（猜）：归纳假设对所有 k < n 有 T(k) ≤ c·k²（c > 0）', k: 'hyp' },
      { t: '第二步（验）：T(n) = 4T(n/2) + n', k: 'sub' },
      { t: '                ≤ 4c(n/2)² + n = cn² + n', k: 'sub' },
      { t: '                = cn² − (−n)        ← 期望 − 余项，余项 = −n', k: 'rem' },
      { t: '要得到 T(n) ≤ cn²，就必须有余项 −n ≥ 0，即 n ≤ 0', k: 'fail' },
      { t: '但 n ≥ 1 时恒有 −n < 0 ⇒ 没有任何 c > 0 能满足 ⇒ 失败！', k: 'fail' },
      { t: '第三步（补救）：加强假设，减一个低阶项 T(k) ≤ c₁k² − c₂k', k: 'fix' },
      { t: 'T(n) = 4(c₁(n/2)² − c₂(n/2)) + n = c₁n² − 2c₂n + n', k: 'fix' },
      { t: '     = c₁n² − c₂n − (c₂n − n)     ← 期望 − 余项', k: 'fix' },
      { t: '只要 c₂ ≥ 1，余项 c₂n − n ≥ 0 ⇒ T(n) ≤ c₁n² − c₂n ≤ c₁n²  ✔', k: 'ok' },
      { t: '再取足够大的 c₁ 使 1 ≤ n < n₀ 时 Θ(1) ≤ c₁n² − c₂n ⇒ T(n) = O(n²) 得证', k: 'ok' }
    ];
    var REVEAL = [2, 4, 5, 7, 8, 10, 11, 12];
    var MAX = REVEAL.length - 1;

    var CAPS = [
      '第 1 步：代换法三步走 —— <b>① 猜测解的形式 ② 通过推导验证 ③ 解出常数</b>。本例 T(n) = 4T(n/2) + n，假设 T(1) = Θ(1)，' +
      '先猜一个<b>偏松</b>的界 T(n) = O(n³) 可以验证成功（见正文），若直接猜 O(n²)：归纳假设为对所有 k &lt; n 有 T(k) ≤ c·k²。',
      '第 2 步：把假设代入递归式：T(n) = 4T(n/2) + n ≤ 4c(n/2)² + n = <b>cn² + n</b>。注意这里用的是"对所有更小规模成立"的归纳假设。',
      '第 3 步：把结果写成"<b>期望 − 余项</b>"的形式：cn² + n = cn² − (−n)，于是余项 = <b>−n</b>。',
      '第 4 步：要由"期望 − 余项 ≤ 期望"推出 T(n) ≤ cn²，必须 余项 ≥ 0；但 −n &lt; 0 对一切 n ≥ 1 恒成立，' +
      '<b>没有任何 c &gt; 0 能满足</b> ⇒ 这个证明是<b>错的</b>，不能据此断言 T(n) = O(n²)。',
      '第 5 步：补救思想 —— <b>加强推导的假设</b>：减一个低阶项，设对所有 k &lt; n 有 T(k) ≤ c₁k² − c₂k（c₂ 为待定正常数）。',
      '第 6 步：把加强后的假设代入：T(n) = 4(c₁(n/2)² − c₂(n/2)) + n = c₁n² − 2c₂n + n = c₁n² − c₂n − (c₂n − n)，' +
      '余项变成了 <b>c₂n − n</b>。',
      '第 7 步：只要 <b>c₂ ≥ 1</b>，余项 c₂n − n ≥ 0 对所有 n 成立 ⇒ T(n) ≤ c₁n² − c₂n ≤ c₁n²，上界 O(n²) 成立 ✔。',
      '第 8 步：再选<b>足够大的 c₁</b> 使初始条件成立（1 ≤ n &lt; n₀ 时 Θ(1) ≤ c₁n² − c₂n）；下界 Ω(n²) 可由 T(n) ≥ n² 得到，' +
      '故 <b>T(n) = Θ(n²)</b>。这个界比 n³ 紧得多，也说明"猜错不要紧，关键是余项必须非负"。'
    ];

    var step = 0;

    function rowColor(k, active) {
      if (k === 'fail') { return C.hot; }
      if (k === 'ok') { return C.ok; }
      if (k === 'fix') { return C.accent2; }
      if (k === 'goal') { return C.ink; }
      return null;
    }

    function render() {
      HB.clear(stage);
      var svg = HB.svgRoot(W, H, '代换法：T(n)=4T(n/2)+n 猜 O(n²) 的失败与加强假设后的成功');
      stage.appendChild(svg);

      var showed = REVEAL[step];
      var i, y;

      add(svg, 'rect', { x: 18, y: 16, width: 954, height: 452, rx: 8, fill: 'none', stroke: C.lineSoft });
      label(svg, 34, 42, '推导过程（每步都要盯住余项的符号）', 'tx-b', 'start', C.ink);

      for (i = 0; i < ROWS.length; i++) {
        if (i >= showed) { break; }
        y = 76 + i * 32;
        var isCursor = (i === showed - 1);
        var col = rowColor(ROWS[i].k, isCursor);
        if (isCursor) {
          add(svg, 'rect', {
            x: 28, y: y - 19, width: 934, height: 26, rx: 4,
            fill: C.keyBg, stroke: 'none', class: 'step-box hb-in'
          });
        }
        label(svg, 40, y, ROWS[i].t, isCursor ? 'tx-b' : 'tx', 'start', isCursor ? C.accent : col);
      }

      /* ---------------- 下部：余项符号的可视化 ---------------- */
      var failing = (step <= 3);
      seg(svg, 34, 486, 954, 486, { stroke: C.line });
      label(svg, 34, 512, failing ? '当前假设：T(k) ≤ c·k²（余项 = −n，恒为负）'
        : '当前假设：T(k) ≤ c₁k² − c₂k（余项 = c₂n − n ≥ 0，c₂ ≥ 1）',
        'tx-b', 'start', failing ? C.hot : C.ok);

      /* 左：两条曲线的位置关系 */
      seg(svg, 60, 600, 380, 600, { stroke: C.line });          // x 轴
      seg(svg, 60, 540, 60, 600, { stroke: C.line });           // y 轴
      var expY = [578, 556];
      var actY = failing ? [560, 544] : [592, 574];
      seg(svg, 70, expY[0], 370, expY[1], { stroke: C.accent, dash: '6 4', sw: 1.6 });
      seg(svg, 70, actY[0], 370, actY[1], { stroke: failing ? C.hot : C.ok, sw: 2 });
      label(svg, 374, expY[1] + 4, failing ? '期望 cn²' : '期望 c₁n²', 'tx-sm', 'start', C.accent);
      label(svg, 374, actY[1] + 4, failing ? '实际上界 cn² + n' : '实际上界 c₁n² − c₂n',
        'tx-sm', 'start', failing ? C.hot : C.ok);
      seg(svg, 200, expY[0] + (expY[1] - expY[0]) * 0.42, 200, actY[0] + (actY[1] - actY[0]) * 0.42,
        { stroke: failing ? C.hot : C.ok, sw: 1.4, dash: '3 3' });
      label(svg, 60, 618, failing ? '实际上界跑到了期望的上方 ⇒ 不等式不成立'
        : '实际上界压在期望的下方 ⇒ 不等式成立', 'tx-sm', 'start', C.soft);

      /* 右：余项符号徽标 */
      var bx = 640;
      add(svg, 'rect', {
        x: bx, y: 530, width: 314, height: 76, rx: 8,
        fill: failing ? 'var(--c-warn-bg)' : 'var(--c-tip-bg)',
        stroke: failing ? C.hot : C.ok, 'stroke-width': 1.6
      });
      label(svg, bx + 16, 560, failing ? '余项 = −n < 0（n ≥ 1）' : '余项 = c₂n − n ≥ 0（c₂ ≥ 1）',
        'tx-b', 'start', failing ? C.hot : C.ok);
      label(svg, bx + 16, 588, failing ? '找不到任何 c > 0 ⇒ 证明失败' : 'T(n) ≤ c₁n² − c₂n ≤ c₁n² ⇒ 证明成功',
        'tx-sm', 'start', C.soft);
    }

    function update() {
      if (cap) { cap.innerHTML = CAPS[step]; }
      render();
    }

    return {
      reset: function () { step = 0; update(); },
      prev: function () { if (step > 0) { step--; } update(); },
      next: function () { if (step < MAX) { step++; } update(); }
    };
  });
})();
