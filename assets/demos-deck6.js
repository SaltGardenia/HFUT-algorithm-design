/* ============================================================================
   算法复习手册 · L5 递归与分治法 —— 动画脚本（deck6）
   ----------------------------------------------------------------------------
   本文件注册 3 个动画，由 assets/handbook.js 统一驱动（data-demo 名必须同名）：
     hanoi-tower    Hanoi 塔：3 个盘子、7 次移动逐帧演示，再由 T(n)=2T(n−1)+1
                    归纳出 T(n)=2^n−1（含 64 个盘子的时间估算），共 12 步
     fast-power     求幂 x^20：分解 20→10→5→2→1，再自底向上回代，
                    对照"简单算法 19 次乘法 vs 分治 5 次乘法"，共 12 步
     binary-search  二分查找：在 3 5 7 8 9 12 15 中查找 9，显示 low/mid/high
                    的收窄过程并给出 Θ(lg n) 的主方法推导，共 10 步
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

  /** 画一个圆角面板：hl 取 'key' / 'tip' / 'warn' / null */
  function panel(parent, x, y, w, h, hl) {
    var fill = 'var(--c-panel-2)', stroke = 'var(--c-line)';
    if (hl === 'key') { fill = 'var(--c-key-bg)'; stroke = 'var(--c-accent)'; }
    else if (hl === 'tip') { fill = 'var(--c-tip-bg)'; stroke = 'var(--c-ok)'; }
    else if (hl === 'warn') { fill = 'var(--c-warn-bg)'; stroke = 'var(--c-warn)'; }
    return add(parent, 'rect', {
      x: x, y: y, width: w, height: h, rx: 8,
      fill: fill, stroke: stroke, 'stroke-width': 1.6
    });
  }

  /** 带箭头的竖线（向下） */
  function arrowDown(parent, x, y1, y2, color) {
    var c = color || 'var(--c-line)';
    add(parent, 'line', { x1: x, y1: y1, x2: x, y2: y2 - 9, stroke: c, 'stroke-width': 2.2 });
    add(parent, 'polygon', {
      points: (x - 5) + ',' + (y2 - 9) + ' ' + (x + 5) + ',' + (y2 - 9) + ' ' + x + ',' + y2,
      fill: c
    });
  }

  /** 带箭头的竖线（向上） */
  function arrowUp(parent, x, y1, y2, color) {
    var c = color || 'var(--c-line)';
    add(parent, 'line', { x1: x, y1: y1, x2: x, y2: y2 + 9, stroke: c, 'stroke-width': 2.2 });
    add(parent, 'polygon', {
      points: (x - 5) + ',' + (y2 + 9) + ' ' + (x + 5) + ',' + (y2 + 9) + ' ' + x + ',' + y2,
      fill: c
    });
  }

  /**
   * 通用控制器：frames 每一步一项（含 cap 解说），draw(svg, frame) 负责画该步画面。
   * 只暴露 reset / prev / next，播放交给 handbook.js 的定时器。
   */
  function controller(stage, cap, W, H, label, frames, draw) {
    var i = 0;
    function render() {
      HB.clear(stage);
      var svg = HB.svgRoot(W, H, label);
      stage.appendChild(svg);
      draw(svg, frames[i]);
      cap.innerHTML = frames[i].cap;
    }
    return {
      steps: frames.length,
      reset: function () { i = 0; render(); },
      prev: function () { if (i > 0) { i -= 1; } render(); },
      next: function () { if (i < frames.length - 1) { i += 1; } render(); }
    };
  }

  /* ==========================================================================
     Demo 1：Hanoi 塔 hanoi-tower
     n = 3：搬动顺序 A→C、A→B、C→B、A→C、B→A、B→C、A→C，共 2^3−1 = 7 次
     ========================================================================== */
  HB.register('hanoi-tower', function (root) {
    var stage = root.querySelector('.demo-stage');     // 动画画布
    var cap = root.querySelector('.demo-cap');         // 底部解说

    var W = 760, H = 400;                              // viewBox 尺寸
    var PEGX = [140, 380, 620];                        // A、B、C 三根柱子的横坐标
    var PEG_TOP = 118, BASE_Y = 340;                   // 柱子顶端、底座纵坐标
    var DISK_H = 22, DISK_STEP = 26;                   // 盘厚、相邻盘的纵向间距
    var PEG_NAME = ['A', 'B', 'C'];                    // 柱子编号 → 名字

    /** 盘子宽度：盘 1/2/3 → 56 / 84 / 112 */
    function diskW(size) { return 56 + 28 * (size - 1); }

    // 7 次移动（搬的是哪号盘、从哪根柱子到哪根柱子）
    var MOVES = [
      { disk: 1, from: 0, to: 2 },
      { disk: 2, from: 0, to: 1 },
      { disk: 1, from: 2, to: 1 },
      { disk: 3, from: 0, to: 2 },
      { disk: 1, from: 1, to: 0 },
      { disk: 2, from: 1, to: 2 },
      { disk: 1, from: 0, to: 2 }
    ];

    var frames = buildFrames();                        // 预先算好 12 步画面

    /** 造出全部 12 帧 */
    function buildFrames() {
      var fr = [], pegs = [[3, 2, 1], [], []], k, mv, top;

      /** 记录一帧：pegs 深拷贝；summary 帧只放文字行 */
      function snap(o) {
        fr.push({
          kind: o.kind || 'board',                     // board = 三柱画面，summary = 文字板
          title: o.title,                              // 画面标题
          pegs: [pegs[0].slice(), pegs[1].slice(), pegs[2].slice()],
          hot: o.hot || null,                          // 本步被搬动的盘子
          move: o.move || null,                        // 本步的移动（画箭头用）
          count: o.count || 0,                         // 已移动次数
          lines: o.lines || [],                        // summary 帧的文字行
          cap: o.cap                                   // 底部解说
        });
      }

      /* 第 1 步：初始画面 */
      snap({
        title: '初始状态：3 个盘子全部在 A 柱',
        count: 0,
        cap: '第 1 / 12 步：初始状态 —— 3 个盘子按“小在上、大在下”叠在 A 柱，B、C 两根柱子空着；' +
             '目标是整摞搬到 C 柱。最少移动次数 T(3) = 2^3 − 1 = 7 次。'
      });

      /* 第 2~8 步：7 次真实移动 */
      for (k = 0; k < MOVES.length; ++k) {
        mv = MOVES[k];
        top = pegs[mv.from].pop();                     // 从源柱顶上取下一个盘子
        pegs[mv.to].push(top);                         // 压到目标柱顶上
        snap({
          title: '第 ' + (k + 1) + ' 次移动：盘 ' + mv.disk + ' 从 ' + PEG_NAME[mv.from] +
                 ' 移到 ' + PEG_NAME[mv.to],
          hot: { peg: mv.to, size: mv.disk },          // 高亮刚落到目标柱的盘子
          move: mv,
          count: k + 1,
          cap: '第 ' + (k + 2) + ' / 12 步：第 ' + (k + 1) + ' 次移动 —— 把最上面的盘 ' + mv.disk +
               ' 从 ' + PEG_NAME[mv.from] + ' 柱搬到 ' + PEG_NAME[mv.to] + ' 柱，' +
               '累计已移动 ' + (k + 1) + ' 次，还剩 ' + (7 - k - 1) + ' 次。' +
               (k === 3 ? '注意这一步：盘 3（最大盘）终于从 A 直接落到 C —— 它全程只动这一次。' : '') +
               (k === 6 ? '第 7 次移动完成，整摞 3 个盘子全部到达 C 柱。' : '')
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
          '第 1、3、5、7 次搬的都是盘 1（最小的盘），它动了 4 次'
        ],
        cap: '第 9 / 12 步：3 个盘子搬完，共移动 7 次；数一数就知道 T(1)=1、T(2)=3、T(3)=7、T(4)=15，' +
             '正好是 2^1−1、2^2−1、2^3−1、2^4−1。其中最小的盘 1 在第 1、3、5、7 次各动一次，共 4 次 = 2^2。'
      });

      /* 第 10 步：递推 T(n) = 2T(n−1) + 1 */
      snap({
        kind: 'summary',
        title: '递推：T(n) = 2·T(n−1) + 1',
        lines: [
          '① 把上面 n−1 个盘 A → B：T(n−1) 次',
          '② 把最大盘 A → C：1 次',
          '③ 把 n−1 个盘 B → C：T(n−1) 次',
          'T(n) = 2T(n−1) + 1，T(1) = 1 ⇒ T(n) = 2^n − 1'
        ],
        cap: '第 10 / 12 步：分治三步 —— 先把上面 n−1 个盘整体从 A 挪到 B（T(n−1) 次），' +
             '再把最大盘从 A 挪到 C（1 次），最后把 n−1 个盘从 B 挪到 C（T(n−1) 次），' +
             '于是 T(n) = 2T(n−1) + 1，T(1) = 1；令 U(n) = T(n)+1 得 U(n) = 2U(n−1)，故 T(n) = 2^n − 1。'
      });

      /* 第 11 步：代入具体 n */
      snap({
        kind: 'summary',
        title: 'T(n) = 2^n − 1 的具体值',
        lines: [
          'n = 3  →  7 次',
          'n = 4  →  15 次',
          'n = 10 →  1023 次',
          'n = 64 →  2^64 − 1 = 1.8446744×10^19 次'
        ],
        cap: '第 11 / 12 步：把 2^n − 1 代进去 —— n=3 得 7 次、n=4 得 15 次、n=10 得 1023 次、' +
             'n=64 得 2^64−1 = 18446744073709551615 ≈ 1.8446744×10^19 次（约 1844 亿亿次）。'
      });

      /* 第 12 步：64 个盘子要多久 */
      snap({
        kind: 'summary',
        title: 'n = 64：1 秒搬 1 个要多久？',
        lines: [
          '每秒 1 次：1.84×10^19 秒 ≈ 5849 亿年（PPT 记作“5000 亿年”）',
          '每秒 10^15 次（千万亿次）：≈ 18447 秒 ≈ 5.1 小时',
          '结论：指数增长让“多搬 1 个盘”就翻一倍',
          '变种：Reve 难题 —— 柱数增加、允许盘子相等'
        ],
        cap: '第 12 / 12 步：假设 1 秒搬 1 个盘子，2^64−1 ≈ 1.84×10^19 次要 1.84×10^19 秒，' +
             '约 5849 亿年（PPT 记作“5000 亿年”）；就算每秒搬 10^15 次（千万亿次），也要约 18447 秒 ≈ 5.1 小时。' +
             '这就是“指数爆炸”：盘子多 1 个，工作量就翻一倍。'
      });

      return fr;
    }

    /** 画一帧 */
    function draw(svg, fr) {
      if (fr.kind === 'summary') {
        add(svg, 'text', { x: 40, y: 34, 'class': 'tx-b' }, fr.title);
        panel(svg, 50, 60, 660, 262, 'key');
        var j;
        for (j = 0; j < fr.lines.length; ++j) {
          add(svg, 'text', {
            x: 76, y: 106 + j * 48,
            'class': j === fr.lines.length - 1 ? 'tx tx-b' : 'tx'
          }, fr.lines[j]);
        }
        add(svg, 'text', { x: 380, y: 372, 'text-anchor': 'middle', 'class': 'tx-sm' },
          'Hanoi 塔：T(n) = 2T(n−1) + 1，T(1) = 1 ⇒ T(n) = 2^n − 1');
        return;
      }

      /* 标题与累计次数 */
      add(svg, 'text', { x: 40, y: 32, 'class': 'tx-b' }, fr.title);
      add(svg, 'text', { x: 722, y: 32, 'text-anchor': 'end', 'class': 'tx' },
        '已移动 ' + fr.count + ' / 7 次');

      /* 移动箭头（从源柱顶端指向目标柱顶端） */
      if (fr.move) {
        var x1 = PEGX[fr.move.from], x2 = PEGX[fr.move.to], ay = 96;
        var dir = x2 > x1 ? 1 : -1;
        add(svg, 'line', {
          x1: x1, y1: ay, x2: x2 - dir * 12, y2: ay,
          stroke: 'var(--c-hot)', 'stroke-width': 2.4
        });
        add(svg, 'polygon', {
          points: (x2 - dir * 12) + ',' + (ay - 6) + ' ' + (x2 - dir * 12) + ',' + (ay + 6) +
                  ' ' + x2 + ',' + ay,
          fill: 'var(--c-hot)'
        });
        add(svg, 'text', {
          x: (x1 + x2) / 2, y: ay - 10, 'text-anchor': 'middle', 'class': 'tx-sm'
        }, '盘 ' + fr.move.disk + '：' + PEG_NAME[fr.move.from] + ' → ' + PEG_NAME[fr.move.to]);
      } else {
        add(svg, 'text', { x: 380, y: 96, 'text-anchor': 'middle', 'class': 'tx-sm' },
          '目标：把 3 个盘子从 A 全部搬到 C，最少 2^3 − 1 = 7 次');
      }

      /* 底座 */
      add(svg, 'rect', { x: 40, y: BASE_Y, width: 680, height: 9, rx: 4, fill: 'var(--c-line)' });

      /* 三根柱子 + 柱名 */
      var p, k, stack, size, w, y;
      for (p = 0; p < 3; ++p) {
        add(svg, 'rect', {
          x: PEGX[p] - 5, y: PEG_TOP, width: 10, height: BASE_Y - PEG_TOP,
          rx: 4, fill: 'var(--c-panel-2)', stroke: 'var(--c-line)', 'stroke-width': 1.2
        });
        add(svg, 'text', { x: PEGX[p], y: BASE_Y + 34, 'text-anchor': 'middle', 'class': 'tx-b' },
          PEG_NAME[p]);
      }

      /* 盘子：stack[0] 是最底下的盘 */
      for (p = 0; p < 3; ++p) {
        stack = fr.pegs[p];
        for (k = 0; k < stack.length; ++k) {
          size = stack[k];
          w = diskW(size);
          y = BASE_Y - DISK_H - k * DISK_STEP;
          var hot = fr.hot && fr.hot.peg === p && fr.hot.size === size;
          add(svg, 'rect', {
            x: PEGX[p] - w / 2, y: y, width: w, height: DISK_H, rx: 5,
            fill: hot ? 'var(--c-warn-bg)' : 'var(--c-key-bg)',
            stroke: hot ? 'var(--c-hot)' : 'var(--c-accent)',
            'stroke-width': hot ? 2.6 : 1.6
          });
          add(svg, 'text', {
            x: PEGX[p], y: y + 16, 'text-anchor': 'middle',
            'class': 'tx' + (hot ? ' tx-b' : '')
          }, '盘 ' + size);
        }
      }

      /* 底部提示：2^n − 1 */
      add(svg, 'text', { x: 40, y: 382, 'class': 'tx-sm' },
        'n = 3 时 T(3) = 2·T(2) + 1 = 2·3 + 1 = 7 = 2^3 − 1');
    }

    return controller(stage, cap, W, H, 'Hanoi 塔 3 个盘子的 7 次移动过程', frames, draw);
  });

  /* ==========================================================================
     Demo 2：求幂 fast-power
     x^20：20→10→5→2→1 分解，回代时共 1+2+1+1 = 5 次乘法；简单算法 19 次
     ========================================================================== */
  HB.register('fast-power', function (root) {
    var stage = root.querySelector('.demo-stage');     // 动画画布
    var cap = root.querySelector('.demo-cap');         // 底部解说

    var W = 760, H = 440;                              // viewBox 尺寸
    var NODE_X = 26, NODE_W = 118, NODE_H = 44;        // 左侧分解链：节点左上角 x、宽、高
    var NODE_Y = [64, 134, 204, 274, 344];             // 5 个节点的纵坐标（20/10/5/2/1）
    var MID = NODE_X + NODE_W / 2;                     // 链条中线 x = 85
    var RX = 322, RW = 408;                            // 右侧面板的左上角 x 与宽度

    var LABEL = ['x^20', 'x^10', 'x^5', 'x^2', 'x^1'];  // 5 个节点的内容
    var DOWN_TAG = ['÷2', '÷2', '÷2', '÷2'];           // 分解：规模每次减半
    var UP_TAG = ['+1', '+1', '+2', '+1'];             // 回代：这条边对应几次乘法

    var frames = [
      {                           // 0
        title: '目标：计算 x^20（n = 20）',
        active: -1, edges: ['idle', 'idle', 'idle', 'idle'], mul: 0, rows: [], big: '',
        cap: '第 1 / 12 步：目标 x^20。简单算法把 x 自乘 19 次：x^20 = x·x·…·x，' +
             '共 n−1 = 19 次乘法、Θ(n) 时间。下面看分治怎么做。'
      },
      {                           // 1
        title: '分解①：20 是偶数 → 先算 x^10',
        active: 0, edges: ['down', 'idle', 'idle', 'idle'], mul: 0, rows: [], big: '',
        cap: '第 2 / 12 步：20 是偶数，x^20 = (x^10)^2 —— 只递归求 x^10 这一个子问题，' +
             '回代时再做 1 次平方。子问题规模从 20 变成 10。'
      },
      {                           // 2
        title: '分解②：10 是偶数 → 先算 x^5',
        active: 1, edges: ['down', 'down', 'idle', 'idle'], mul: 0, rows: [], big: '',
        cap: '第 3 / 12 步：10 也是偶数，x^10 = (x^5)^2，子问题规模 10 → 5；' +
             '两次分解一共只产生 1 个递归分支（不是 2 个）。'
      },
      {                           // 3
        title: '分解③：5 是奇数 → x^2 与一个额外的 x',
        active: 2, edges: ['down', 'down', 'down', 'idle'], mul: 0, rows: [], big: '',
        cap: '第 4 / 12 步：5 是奇数，x^5 = (x^2)^2 · x，其中 (5−1)/2 = 2，' +
             '回代时要做 2 次乘法（一次平方 + 一次乘 x）。'
      },
      {                           // 4
        title: '分解④：2 是偶数 → x^1',
        active: 3, edges: ['down', 'down', 'down', 'down'], mul: 0, rows: [], big: '',
        cap: '第 5 / 12 步：2 是偶数，x^2 = (x^1)^2，子问题规模 2 → 1，' +
             '分解链条是 20 → 10 → 5 → 2 → 1，一共 4 层。'
      },
      {                           // 5
        title: '边界条件：x^1 = x，0 次乘法',
        active: 4, edges: ['down', 'down', 'down', 'down'], mul: 0, rows: [], big: '',
        cap: '第 6 / 12 步：递归到底 —— 边界条件 x^1 = x 直接返回，不做任何乘法（累计 0 次）。' +
             '递归式 T(n) = T(⌊n/2⌋) + Θ(1)，深度只有 ⌊lg 20⌋ = 4 层。'
      },
      {                           // 6
        title: '回代①：x^2 = x·x，+1 次',
        active: 3, edges: ['down', 'down', 'down', 'up'], mul: 1,
        rows: ['x^2 = x·x            +1 次 → 累计 1'], big: '',
        cap: '第 7 / 12 步：自底向上回代 —— 已知 x^1 = x，平方一次得到 x^2，乘法 +1，累计 1 次。'
      },
      {                           // 7
        title: '回代②：x^5 = (x^2)^2·x，+2 次',
        active: 2, edges: ['down', 'down', 'up', 'up'], mul: 3,
        rows: ['x^2 = x·x            +1 次 → 累计 1',
               'x^5 = (x^2)^2·x       +2 次 → 累计 3'], big: '',
        cap: '第 8 / 12 步：x^5 = (x^2)^2 · x 需要 2 次乘法（平方 1 次 + 乘 x 1 次），' +
             '累计 1 + 2 = 3 次。奇数这一层是唯一多花一次的地方。'
      },
      {                           // 8
        title: '回代③：x^10 = (x^5)^2，+1 次',
        active: 1, edges: ['down', 'up', 'up', 'up'], mul: 4,
        rows: ['x^2 = x·x            +1 次 → 累计 1',
               'x^5 = (x^2)^2·x       +2 次 → 累计 3',
               'x^10 = (x^5)^2        +1 次 → 累计 4'], big: '',
        cap: '第 9 / 12 步：x^10 = (x^5)^2，再做 1 次平方，累计 3 + 1 = 4 次。'
      },
      {                           // 9
        title: '回代④：x^20 = (x^10)^2，+1 次',
        active: 0, edges: ['up', 'up', 'up', 'up'], mul: 5,
        rows: ['x^2 = x·x            +1 次 → 累计 1',
               'x^5 = (x^2)^2·x       +2 次 → 累计 3',
               'x^10 = (x^5)^2        +1 次 → 累计 4',
               'x^20 = (x^10)^2       +1 次 → 累计 5'], big: '',
        cap: '第 10 / 12 步：x^20 = (x^10)^2，最后 1 次平方，累计 4 + 1 = 5 次 —— ' +
             '分治法算 x^20 只需 5 次乘法，不是 20 次、也不是 19 次。'
      },
      {                           // 10
        title: '对照：19 次 vs 5 次',
        active: 0, edges: ['up', 'up', 'up', 'up'], mul: 5,
        rows: ['x^2 = x·x            +1 次 → 累计 1',
               'x^5 = (x^2)^2·x       +2 次 → 累计 3',
               'x^10 = (x^5)^2        +1 次 → 累计 4',
               'x^20 = (x^10)^2       +1 次 → 累计 5'], big: '19 → 5',
        cap: '第 11 / 12 步：简单算法 19 次乘法，分治 5 次乘法，省下 14 次（约 3.8 倍）。' +
             '通式：⌊lg n⌋ 次平方 + (n 的二进制中 1 的个数 − 1) 次乘法 = 4 + 1 = 5；' +
             'T(n) = T(n/2) + Θ(1) ⇒ T(n) = Θ(lg n)。'
      },
      {                           // 11
        title: '易错：不能写成两次递归调用',
        active: -1, edges: ['warn', 'warn', 'warn', 'warn'], mul: 5,
        rows: ['错误：t * power(x, n/2) 把 x^(n/2) 算了两遍'], big: 'Θ(n) ✗',
        cap: '第 12 / 12 步：如果把 (x^(n/2)) 写成两次递归调用 power(x,n/2)*power(x,n/2)，' +
             '递归式就退化成 T(n) = 2T(n/2) + Θ(1) = Θ(n)，一次也没省；' +
             '必须像本页伪代码那样，先把 x^⌊n/2⌋ 存进变量再平方。'
      }
    ];

    /** 画一帧：左侧 5 个节点的分解链，右侧回代清单与乘法计数器 */
    function draw(svg, fr) {
      add(svg, 'text', { x: 26, y: 28, 'class': 'tx-b' }, fr.title);

      /* 4 条边（先画线，节点后画可盖住线头） */
      var i, edge, color;
      for (i = 0; i < 4; ++i) {
        edge = fr.edges[i];
        color = edge === 'down' ? 'var(--c-hot)' : (edge === 'up' ? 'var(--c-ok)' :
          (edge === 'warn' ? 'var(--c-warn)' : 'var(--c-line)'));
        if (edge === 'up') {
          arrowUp(svg, MID, NODE_Y[i + 1], NODE_Y[i] + NODE_H, color);
        } else {
          arrowDown(svg, MID, NODE_Y[i] + NODE_H, NODE_Y[i + 1], color);
        }
        add(svg, 'text', {
          x: MID + 10, y: NODE_Y[i] + NODE_H + 19,
          'class': 'tx-sm',
          style: 'fill:' + (edge === 'idle' ? 'var(--c-ink-soft)' :
            (edge === 'up' ? 'var(--c-ok)' : (edge === 'warn' ? 'var(--c-warn)' : 'var(--c-hot)')))
        }, edge === 'up' || edge === 'warn' ? UP_TAG[i] : DOWN_TAG[i]);
      }

      /* 5 个节点：当前节点红、已回代完的子问题绿、路径上的祖先蓝、未到达灰 */
      var fill, stroke;
      for (i = 0; i < 5; ++i) {
        if (fr.edges[0] === 'warn') { fill = 'var(--c-warn-bg)'; stroke = 'var(--c-warn)'; }
        else if (i === fr.active) { fill = 'var(--c-warn-bg)'; stroke = 'var(--c-hot)'; }
        else if (fr.mul > 0 && i > fr.active) { fill = 'var(--c-tip-bg)'; stroke = 'var(--c-ok)'; }
        else if (fr.active >= 0 && i < fr.active) { fill = 'var(--c-key-bg)'; stroke = 'var(--c-accent)'; }
        else { fill = 'var(--c-panel-2)'; stroke = 'var(--c-line)'; }
        add(svg, 'rect', {
          x: NODE_X, y: NODE_Y[i], width: NODE_W, height: NODE_H, rx: 8,
          fill: fill, stroke: stroke, 'stroke-width': 2
        });
        add(svg, 'text', {
          x: NODE_X + NODE_W / 2, y: NODE_Y[i] + 29, 'text-anchor': 'middle', 'class': 'tx tx-b'
        }, LABEL[i]);
      }

      /* 右栏：回代清单 */
      panel(svg, RX, 48, RW, 216, 'key');
      add(svg, 'text', { x: RX + 16, y: 74, 'class': 'tx-b' }, '自底向上回代（右边是乘法次数）');
      var r;
      if (fr.rows.length === 0) {
        add(svg, 'text', { x: RX + 16, y: 108, 'class': 'tx-sm' }, '（还没有开始回代）');
      }
      for (r = 0; r < fr.rows.length; ++r) {
        add(svg, 'text', { x: RX + 16, y: 108 + r * 32, 'class': 'tx-sm' }, fr.rows[r]);
      }

      /* 对比大字 */
      if (fr.big) {
        add(svg, 'text', {
          x: RX + RW / 2, y: 296, 'text-anchor': 'middle', 'class': 'tx tx-b',
          style: 'fill:' + (fr.big.charAt(0) === 'Θ' ? 'var(--c-warn)' : 'var(--c-ok)')
        }, fr.big);
      }

      /* 乘法计数器 */
      panel(svg, RX, 318, RW, 66, fr.mul >= 5 ? 'tip' : null);
      add(svg, 'text', { x: RX + 16, y: 346, 'class': 'tx' },
        '分治累计乘法：' + fr.mul + ' 次');
      add(svg, 'text', { x: RX + 16, y: 372, 'class': 'tx-sm' },
        '简单算法：n − 1 = 20 − 1 = 19 次');

      add(svg, 'text', { x: 26, y: 420, 'class': 'tx-sm' },
        'T(n) = T(⌊n/2⌋) + Θ(1) ⇒ T(n) = Θ(lg n)；n = 20 时递归深度为 ⌊lg 20⌋ = 4');
    }

    return controller(stage, cap, W, H, '分治求幂 x^20 的分解与回代过程', frames, draw);
  });

  /* ==========================================================================
     Demo 3：二分查找 binary-search
     A[1..7] = 3 5 7 8 9 12 15，查找 9：mid = 4 → 6 → 5，共 3 次比较
     ========================================================================== */
  HB.register('binary-search', function (root) {
    var stage = root.querySelector('.demo-stage');     // 动画画布
    var cap = root.querySelector('.demo-cap');         // 底部解说

    var W = 760, H = 340;                              // viewBox 尺寸
    var A = [3, 5, 7, 8, 9, 12, 15];                   // PPT 例子的有序数组（下标 1..7）
    var X0 = 90, CELL_W = 74, GAP = 10, CELL_Y = 88, CELL_H = 54;

    /** 第 i 个格子（i 从 1 开始）的左上角 x */
    function cellX(i) { return X0 + (i - 1) * (CELL_W + GAP); }

    var frames = [
      { low: 1, high: 7, mid: 0, found: 0, cmp: 0,
        log: ['目标 x = 9，当前区间 [1..7]，共 7 个元素'],
        cap: '第 1 / 10 步：在有序数组 A[1..7] = 3 5 7 8 9 12 15 中查找 9。' +
             '初始区间 low = 1、high = 7，还没有比较过任何元素。' },
      { low: 1, high: 7, mid: 4, found: 0, cmp: 1,
        log: ['mid = ⌊(1+7)/2⌋ = 4，取 A[4] = 8', '8 < 9 ⇒ 答案只可能在右半'],
        cap: '第 2 / 10 步：mid = ⌊(low+high)/2⌋ = ⌊(1+7)/2⌋ = 4，取 A[4] = 8；' +
             '因为 8 < 9，答案只可能在右半，第 1 次比较结束。' },
      { low: 5, high: 7, mid: 0, found: 0, cmp: 1,
        log: ['丢弃 A[1..4]（3 5 7 8，共 4 个）', '新区间 [5..7]，剩 3 个元素'],
        cap: '第 3 / 10 步：舍弃左半 A[1..4]（3、5、7、8 共 4 个元素，含刚比过的 A[4]），' +
             '区间收缩为 low = 5、high = 7，只剩 3 个元素 9 12 15。' },
      { low: 5, high: 7, mid: 6, found: 0, cmp: 2,
        log: ['mid = ⌊(5+7)/2⌋ = 6，取 A[6] = 12', '12 > 9 ⇒ 答案只可能在左半'],
        cap: '第 4 / 10 步：mid = ⌊(5+7)/2⌋ = 6，A[6] = 12；因为 12 > 9，答案只可能在左半，' +
             '第 2 次比较结束。' },
      { low: 5, high: 5, mid: 0, found: 0, cmp: 2,
        log: ['丢弃 A[6..7]（12 15）', '新区间 [5..5]，剩 1 个元素'],
        cap: '第 5 / 10 步：舍弃右半 A[6..7]（12、15），区间收缩为 low = 5、high = 5，' +
             '只剩 A[5] = 9 一个元素。' },
      { low: 5, high: 5, mid: 5, found: 5, cmp: 3,
        log: ['mid = ⌊(5+5)/2⌋ = 5，取 A[5] = 9', '9 = 9 ⇒ 找到，返回下标 5'],
        cap: '第 6 / 10 步：mid = ⌊(5+5)/2⌋ = 5，A[5] = 9 正好等于目标 9 —— 查找成功，' +
             '返回下标 5，全程只用了 3 次比较。' },
      { low: 5, high: 5, mid: 5, found: 5, cmp: 3,
        log: ['比较次数 = 3 次', '递归式：T(n) = 1·T(n/2) + Θ(1)'],
        cap: '第 7 / 10 步：整个过程只递归了 3 层、比较 3 次；写成递归式是 ' +
             'T(n) = 1·T(n/2) + Θ(1)，其中 1 是子问题个数、n/2 是子问题规模、Θ(1) 是“检查中间元素”的代价。' },
      { low: 5, high: 5, mid: 5, found: 5, cmp: 3,
        log: ['a = 1，b = 2，f(n) = Θ(1)', 'n^(log_2 1) = n^0 = 1 = Θ(f(n))'],
        cap: '第 8 / 10 步：套主方法 —— a = 1、b = 2，于是 n^(log_b a) = n^(log_2 1) = n^0 = 1，' +
             '它与 f(n) = Θ(1) 同阶，属于第 2 种情况，故 T(n) = Θ(n^0 · lg n) = Θ(lg n)。' },
      { low: 5, high: 5, mid: 5, found: 5, cmp: 3,
        log: ['最坏比较次数 = ⌊lg n⌋ + 1', 'n = 7：⌊lg 7⌋ + 1 = 2 + 1 = 3 次'],
        cap: '第 9 / 10 步：最坏情况下区间每次减半，比较次数不超过 ⌊lg n⌋ + 1；' +
             'n = 7 时 ⌊lg 7⌋ + 1 = 2 + 1 = 3 次，本例的 3 次就是最坏情况；而顺序查找最坏要 7 次。' },
      { low: 5, high: 5, mid: 5, found: 5, cmp: 3,
        log: ['前提 1：数组必须有序', '前提 2：能随机访问中间元素（顺序存储）'],
        cap: '第 10 / 10 步：二分查找的两个前提 —— ① 数组必须有序（无序要先排序，代价 O(n lg n)）；' +
             '② 必须能 O(1) 随机访问中间元素，所以只适合数组、不适合链表。' }
    ];

    /** 画一帧：7 个格子 + 区间条 + low/mid/high 状态 + 比较日志 */
    function draw(svg, fr) {
      var i, x, inRange, isMid, isFound;

      /* 顶部状态行 */
      add(svg, 'text', { x: 36, y: 32, 'class': 'tx-b' },
        'low = ' + fr.low + '    high = ' + fr.high +
        '    mid = ' + (fr.mid === 0 ? '—' : fr.mid) +
        '    已比较 ' + fr.cmp + ' 次');

      /* low / high 指针标记 */
      if (fr.low <= fr.high) {
        add(svg, 'text', { x: cellX(fr.low) + CELL_W / 2, y: CELL_Y - 30, 'text-anchor': 'middle',
          'class': 'tx-sm', style: 'fill:var(--c-accent)' }, 'low');
        add(svg, 'text', { x: cellX(fr.high) + CELL_W / 2, y: CELL_Y - 30, 'text-anchor': 'middle',
          'class': 'tx-sm', style: 'fill:var(--c-accent)' }, 'high');

        /* 当前区间条 */
        add(svg, 'rect', {
          x: cellX(fr.low), y: CELL_Y - 16,
          width: (fr.high - fr.low + 1) * (CELL_W + GAP) - GAP, height: 8, rx: 4,
          fill: 'var(--c-accent)'
        });
      }

      /* 7 个格子 */
      for (i = 1; i <= 7; ++i) {
        x = cellX(i);
        inRange = (i >= fr.low && i <= fr.high);
        isMid = (i === fr.mid);
        isFound = (i === fr.found);
        add(svg, 'rect', {
          x: x, y: CELL_Y, width: CELL_W, height: CELL_H, rx: 6,
          fill: isFound ? 'var(--c-tip-bg)' : (isMid ? 'var(--c-warn-bg)' :
            (inRange ? 'var(--c-key-bg)' : 'var(--c-panel-2)')),
          stroke: isFound ? 'var(--c-ok)' : (isMid ? 'var(--c-hot)' :
            (inRange ? 'var(--c-accent)' : 'var(--c-line)')),
          'stroke-width': (isMid || isFound) ? 2.6 : 1.4
        });
        add(svg, 'text', {
          x: x + CELL_W / 2, y: CELL_Y + 35, 'text-anchor': 'middle',
          'class': 'tx' + ((isMid || isFound) ? ' tx-b' : '')
        }, A[i - 1]);
        add(svg, 'text', {
          x: x + CELL_W / 2, y: CELL_Y + CELL_H + 20, 'text-anchor': 'middle', 'class': 'tx-sm'
        }, 'A[' + i + ']');
      }

      /* mid 指针 */
      if (fr.mid > 0) {
        add(svg, 'text', {
          x: cellX(fr.mid) + CELL_W / 2, y: CELL_Y + CELL_H + 44, 'text-anchor': 'middle',
          'class': 'tx-sm', style: 'fill:var(--c-hot)'
        }, 'mid');
      }

      /* 比较日志 */
      var baseY = 222;
      for (i = 0; i < fr.log.length; ++i) {
        add(svg, 'text', { x: 90, y: baseY + i * 26, 'class': 'tx-sm' }, '· ' + fr.log[i]);
      }

      /* 找到时的结论 / 否则给递归式提示 */
      if (fr.found > 0) {
        add(svg, 'text', { x: 90, y: 306, 'class': 'tx tx-b', style: 'fill:var(--c-ok)' },
          '查找成功：A[5] = 9 = 目标，返回下标 ' + fr.found + '，比较 ' + fr.cmp + ' 次');
      } else {
        add(svg, 'text', { x: 90, y: 306, 'class': 'tx-sm' },
          'T(n) = 1·T(n/2) + Θ(1)，n^(log_2 1) = n^0 = 1 ⇒ T(n) = Θ(lg n)');
      }
    }

    return controller(stage, cap, W, H, '在有序数组中二分查找 9 的区间收窄过程', frames, draw);
  });
})();
