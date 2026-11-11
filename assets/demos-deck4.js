/* ============================================================================
   算法复习手册 · L3 线性时间排序 —— 动画脚本（deck4）
   ----------------------------------------------------------------------------
   本文件注册 3 个动画，由 assets/handbook.js 统一驱动（data-demo 名必须同名）：
     counting-sort   计数排序：PPT 算例 A=⟨4,1,3,4,3⟩、n=5、k=4，共 20 步，
                     完整覆盖四个循环（初始化 C / 逐元素计数 / 前缀累加 / 反向填充）
     decision-tree   决策树：在 3 元素插入排序的决策树上走 ⟨9,4,6⟩ 的搜索路径，共 9 步
     radix-sort      基数排序：7 个三位数按 个位 → 十位 → 百位 做 LSD 稳定排序，共 12 步
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

  /** 画一个带边框的方框；value 非空时在中心写值，hl 取值 hot / ok / key / null */
  function box(parent, x, y, w, h, value, hl) {
    var fill = 'var(--c-panel-2)', stroke = 'var(--c-line)', sw = 1.4;
    if (hl === 'hot') { fill = 'var(--c-warn-bg)'; stroke = 'var(--c-hot)'; sw = 2.4; }
    else if (hl === 'ok') { fill = 'var(--c-tip-bg)'; stroke = 'var(--c-ok)'; sw = 2.0; }
    else if (hl === 'key') { fill = 'var(--c-key-bg)'; stroke = 'var(--c-accent)'; sw = 1.6; }
    add(parent, 'rect', {
      x: x, y: y, width: w, height: h, rx: 5,
      fill: fill, stroke: stroke, 'stroke-width': sw, 'class': 'arr-cell'
    });
    if (value !== null && value !== undefined && value !== '') {
      add(parent, 'text', {
        x: x + w / 2, y: y + h / 2 + 5, 'text-anchor': 'middle',
        'class': 'tx' + (hl === 'hot' ? ' tx-b' : '')
      }, value);
    }
  }

  /** 从上方方框底部拉一条带箭头的线到下方方框顶部 */
  function arrow(parent, x1, y1, x2, y2, color) {
    var c = color || 'var(--c-hot)';
    add(parent, 'line', { x1: x1, y1: y1, x2: x2, y2: y2, stroke: c, 'stroke-width': 2.2 });
    add(parent, 'polygon', {
      points: (x2 - 6) + ',' + (y2 - 9) + ' ' + (x2 + 6) + ',' + (y2 - 9) + ' ' + x2 + ',' + y2,
      fill: c
    });
  }

  /* ==========================================================================
     Demo 1：计数排序 counting-sort
     A = ⟨4,1,3,4,3⟩（n=5），k=4，各阶段状态与课程 PPT 的 image24~image38 完全一致
     ========================================================================== */
  HB.register('counting-sort', function (root) {
    var stage = root.querySelector('.demo-stage');      // 动画画布
    var cap = root.querySelector('.demo-cap');          // 底部解说

    var A = [4, 1, 3, 4, 3];                            // PPT 算例：A[1]=4、A[2]=1、A[3]=3、A[4]=4、A[5]=3
    var N = A.length;                                   // n = 5
    var K = 4;                                          // k = 4，关键字取值范围 1..4

    var AX = 78, AW = 66, STEP = 72, RH = 46;           // A/B 行的起点、格宽、格距、格高
    var CX = 546;                                       // C 行的起点横坐标
    var YA = 78, YC = 78, YB = 240;                     // A、C、B 三行的纵坐标

    var frames = buildFrames();                         // 预先算好每一步的画面
    var idx = 0;                                        // 当前步号（0 起）

    /** 造出全部 20 帧：每帧记录 C/B 快照、高亮下标、箭头与面板文字 */
    function buildFrames() {
      var C = [], B = [], i, j, v, pos, fr = [];
      for (i = 0; i < K; ++i) { C.push(null); }         // C[1..k] 未初始化时用 null 表示
      for (i = 0; i < N; ++i) { B.push(null); }         // B[1..n] 未写入时用 null 表示

      function fmtC() {                                              // 打印 C 当前值
        var t = [], q;
        for (q = 0; q < K; ++q) { t.push(C[q] === null ? '—' : C[q]); }
        return 'C = [' + t.join(', ') + ']';
      }
      function fmtB() {                                               // 打印 B 当前值
        var t = [], q;
        for (q = 0; q < N; ++q) { t.push(B[q] === null ? '_' : B[q]); }
        return 'B = [' + t.join(', ') + ']';
      }

      function snap(loop, aHi, cHi, bHi, arrows, lines, desc) {
        fr.push({
          loop: loop, aHi: aHi, cHi: cHi, bHi: bHi, arrows: arrows || [],
          c: C.slice(), b: B.slice(), lines: lines, desc: desc
        });
      }

      /* ---- 第 1 步：初始画面 ---- */
      snap('准备', 0, 0, 0, [], [
        'A = ⟨4, 1, 3, 4, 3⟩，n = 5，k = 4',
        'C[1..4] 尚未初始化',
        'B[1..5] 尚未写入'
      ], '输入数组 A = ⟨4, 1, 3, 4, 3⟩（n = 5），每个关键字都在 1..k = 4 之内；辅助数组 C 有 k = 4 个计数器，输出数组 B 有 n = 5 个位置。');

      /* ---- 循环1：for i ← 1 to k do C[i] ← 0 ---- */
      for (i = 1; i <= K; ++i) {
        C[i - 1] = 0;
        snap('循环1 · 初始化 C', 0, i, 0, [], [
          'i = ' + i + '：C[' + i + '] ← 0',
          fmtC() + '（' + i + '/' + K + '）'
        ], i === K
          ? '循环1 结束：for i ← 1 to k 跑完，i = 4 时执行 C[4] ← 0，于是 C = [0, 0, 0, 0]，k = 4 个计数器全部清零。'
          : 'i = ' + i + '，执行 C[' + i + '] ← 0（第 ' + i + ' / ' + K + ' 个计数器）。');
      }

      /* ---- 循环2：for j ← 1 to n do C[A[j]] ← C[A[j]] + 1 ---- */
      for (j = 1; j <= N; ++j) {
        v = A[j - 1];
        C[v - 1] += 1;
        snap('循环2 · 统计次数', j, v, 0, [], [
          'j = ' + j + '：A[' + j + '] = ' + v,
          'C[' + v + '] ← C[' + v + '] + 1 = ' + C[v - 1],
          fmtC()
        ], j === N
          ? '循环2 结束：j = 5 时 A[5] = 3，执行 C[3] ← C[3] + 1 = 2，得到 C = [1, 0, 2, 2]，此时 C[i] = |{key = i}| —— 值 1 出现 1 次、值 2 出现 0 次、值 3 出现 2 次、值 4 出现 2 次。'
          : 'j = ' + j + '，A[' + j + '] = ' + v + '，执行 C[' + v + '] ← C[' + v + '] + 1 = ' + C[v - 1] + '；' + fmtC() + '。');
      }

      /* ---- 循环3：for i ← 2 to k do C[i] ← C[i] + C[i-1] ---- */
      for (i = 2; i <= K; ++i) {
        C[i - 1] += C[i - 2];
        snap('循环3 · 前缀累加', 0, i, 0, [], [
          'i = ' + i + '：C[' + i + '] ← C[' + i + '] + C[' + (i - 1) + '] = ' + C[i - 1],
          fmtC()
        ], i === K
          ? '循环3 结束：i = 4 时 C[4] ← C[4] + C[3] = 2 + 3 = 5，得到 C = [1, 1, 3, 5]，含义升级为 C[i] = |{key ≤ i}| —— 不超过 4 的元素共 5 个，正好等于 n。'
          : 'i = ' + i + '，C[' + i + '] ← C[' + i + '] + C[' + (i - 1) + '] = ' + C[i - 1] + '，' + fmtC() + '；含义从"等于 i 的个数"变成"不超过 i 的个数"。');
      }

      /* ---- 循环4：for j ← n downto 1 do B[C[A[j]]] ← A[j]; C[A[j]] ← C[A[j]] - 1 ---- */
      for (j = N; j >= 1; --j) {
        v = A[j - 1];
        pos = C[v - 1];                                 // 本次要写入 B 的下标
        B[pos - 1] = v;
        C[v - 1] -= 1;
        snap('循环4 · 反向填充', j, v, pos, [{ from: j, to: pos }], [
          'j = ' + j + '：A[' + j + '] = ' + v + '，C[' + v + '] = ' + pos,
          'B[' + pos + '] ← ' + v + '（写入 B 的第 ' + pos + ' 位）',
          'C[' + v + '] ← ' + pos + ' − 1 = ' + C[v - 1],
          fmtC(), fmtB()
        ], 'j = ' + j + '，A[' + j + '] = ' + v + '，C[' + v + '] = ' + pos + '，于是 B[' + pos + '] ← ' + v + '；再执行 C[' + v + '] ← ' + pos + ' − 1 = ' + C[v - 1] + '，' + fmtC() + '，' + fmtB() + '。');
      }

      /* ---- 第 19 步：收尾 ---- */
      snap('完成', 0, 0, 0, [], [
        '四个循环全部结束',
        'B = ⟨1, 3, 3, 4, 4⟩ 已有序',
        'C = [' + C.join(', ') + ']（剩余计数）'
      ], '四个循环全部跑完，输出 B = ⟨1, 3, 3, 4, 4⟩ —— 排序完成；此时 C = [0, 1, 1, 3]，每个计数器恰好被"消耗"回它前面元素的总数。');

      /* ---- 第 20 步：稳定性小结 ---- */
      snap('小结 · 稳定性', 0, 0, 0, [], [
        '反向填充（j 从 5 downto 1）',
        'A[5] = 3 先于 A[3] = 3 入 B[3]',
        'A[4] = 4 先于 A[1] = 4 入 B[5]',
        '相等的项保持原有先后次序'
      ], '因为循环4 是 j 从 n downto 1 反向填充，A[5] = 3 比 A[3] = 3 先落到 B[3]，A[4] = 4 比 A[1] = 4 先落到 B[5]，两个 3、两个 4 的相对次序都没有被打乱 —— 这就是计数排序的稳定性；代价方面四个循环分别是 Θ(k)、Θ(n)、Θ(k)、Θ(n)，总计 Θ(n + k) = Θ(5 + 4)。');

      return fr;
    }

    /** 按第 idx 帧重画整幅图 */
    function render() {
      var f = frames[idx], j, i, x, cx;
      HB.clear(stage);
      var svg = HB.svgRoot(900, 470, '计数排序演示：数组 A、计数数组 C 与输出数组 B 的状态');
      stage.appendChild(svg);                           // 把画好的 svg 挂到演示舞台上

      add(svg, 'text', { x: 26, y: 30, 'class': 'tx-b' },
        '计数排序演示（A = ⟨4, 1, 3, 4, 3⟩，n = 5，k = 4）');

      /* ---- A 行：输入数组 ---- */
      add(svg, 'text', { x: 26, y: 106, 'class': 'tx-b', fill: 'var(--c-accent)' }, 'A:');
      for (j = 1; j <= N; ++j) {
        x = AX + (j - 1) * STEP;
        add(svg, 'text', { x: x + AW / 2, y: 70, 'class': 'tx-sm', 'text-anchor': 'middle' }, j);
        box(svg, x, YA, AW, RH, A[j - 1], f.aHi === j ? 'hot' : null);
      }

      /* ---- C 行：计数 / 累加数组 ---- */
      add(svg, 'text', { x: 494, y: 106, 'class': 'tx-b', fill: 'var(--c-accent-2)' }, 'C:');
      for (i = 1; i <= K; ++i) {
        x = CX + (i - 1) * STEP;
        add(svg, 'text', { x: x + AW / 2, y: 70, 'class': 'tx-sm', 'text-anchor': 'middle' }, i);
        box(svg, x, YC, AW, RH, f.c[i - 1] === null ? '—' : f.c[i - 1], f.cHi === i ? 'hot' : null);
      }

      /* ---- B 行：输出数组（下标标在方框下方，给搬运箭头让位） ---- */
      add(svg, 'text', { x: 26, y: 268, 'class': 'tx-b', fill: 'var(--c-accent)' }, 'B:');
      for (j = 1; j <= N; ++j) {
        x = AX + (j - 1) * STEP;
        box(svg, x, YB, AW, RH,
          f.b[j - 1] === null ? '' : f.b[j - 1], f.bHi === j ? 'hot' : null);
        add(svg, 'text', { x: x + AW / 2, y: YB + RH + 18, 'class': 'tx-sm', 'text-anchor': 'middle' }, j);
      }

      /* ---- 循环4 的搬运箭头：A[j] → B[C[A[j]]] ---- */
      for (i = 0; i < f.arrows.length; ++i) {
        arrow(svg,
          AX + (f.arrows[i].from - 1) * STEP + AW / 2, YA + RH,
          AX + (f.arrows[i].to - 1) * STEP + AW / 2, YB);
      }

      /* ---- 右侧状态面板 ---- */
      add(svg, 'rect', {
        x: 486, y: 140, width: 386, height: 300, rx: 9,
        fill: 'var(--c-panel-2)', stroke: 'var(--c-line)', 'stroke-width': 1.2
      });
      add(svg, 'text', { x: 504, y: 168, 'class': 'tx-b', fill: 'var(--c-hot)' }, f.loop);
      add(svg, 'line', { x1: 504, y1: 180, x2: 854, y2: 180, stroke: 'var(--c-line)' });
      for (i = 0; i < f.lines.length; ++i) {
        add(svg, 'text', { x: 504, y: 206 + i * 26, 'class': 'tx' }, f.lines[i]);
      }
      add(svg, 'text', { x: 504, y: 414, 'class': 'tx-sm' }, '含义：C[i] = |{key ≤ i}|（循环3 之后）');

      /* ---- 左下角提示与步数 ---- */
      add(svg, 'text', { x: 26, y: 352, 'class': 'tx-sm' },
        '循环1 初始化 C ｜ 循环2 统计次数 ｜ 循环3 前缀累加 ｜ 循环4 反向填充');
      add(svg, 'text', { x: 26, y: 376, 'class': 'tx-sm' },
        '高亮格＝本步读写的单元；箭头＝把 A[j] 搬到 B[C[A[j]]]');
      cx = AX + AW / 2 + (N - 1) * STEP / 2;
      add(svg, 'text', { x: cx, y: 440, 'class': 'tx-sm', 'text-anchor': 'middle' },
        '第 ' + (idx + 1) + ' / ' + frames.length + ' 步');

      if (cap) {
        cap.innerHTML = '第 ' + (idx + 1) + ' / ' + frames.length + ' 步 · <b>' + f.loop + '</b>：' + f.desc;
      }
    }

    return {
      steps: frames.length,                             // 总步数 20
      reset: function () { idx = 0; render(); },
      prev: function () { if (idx > 0) { idx -= 1; } render(); },
      next: function () { if (idx < frames.length - 1) { idx += 1; } render(); }
    };
  });

  /* ==========================================================================
     Demo 2：决策树 decision-tree
     3 元素插入排序的决策树，输入 ⟨a1,a2,a3⟩ = ⟨9,4,6⟩，路径 1:2 → 1:3 → 2:3 → 叶子 231
     ========================================================================== */
  HB.register('decision-tree', function (root) {
    var stage = root.querySelector('.demo-stage');
    var cap = root.querySelector('.demo-cap');

    var T = {                                           // 6 个内部节点的圆 + 6 个叶子的方框
      root: { t: '1:2', x: 500, y: 58 },
      n23: { t: '2:3', x: 270, y: 168 },
      n13r: { t: '1:3', x: 740, y: 168 },
      l123: { t: '123', x: 150, y: 278, leaf: true },
      n13l: { t: '1:3', x: 390, y: 278 },
      l213: { t: '213', x: 620, y: 278, leaf: true },
      n23r: { t: '2:3', x: 860, y: 278 },
      l132: { t: '132', x: 320, y: 388, leaf: true },
      l312: { t: '312', x: 465, y: 388, leaf: true },
      l231: { t: '231', x: 790, y: 388, leaf: true },
      l321: { t: '321', x: 935, y: 388, leaf: true }
    };
    var E = [                                           // 10 条边：side 为分支标记，lx/ly 为标记位置
      { a: 'root', b: 'n23', side: '≤', lx: 372, ly: 116, an: 'end' },
      { a: 'root', b: 'n13r', side: '>', lx: 628, ly: 112, an: 'start' },
      { a: 'n23', b: 'l123', side: '≤', lx: 196, ly: 226, an: 'end' },
      { a: 'n23', b: 'n13l', side: '>', lx: 340, ly: 222, an: 'start' },
      { a: 'n13l', b: 'l132', side: '≤', lx: 340, ly: 336, an: 'end' },
      { a: 'n13l', b: 'l312', side: '>', lx: 438, ly: 332, an: 'start' },
      { a: 'n13r', b: 'l213', side: '≤', lx: 666, ly: 226, an: 'end' },
      { a: 'n13r', b: 'n23r', side: '>', lx: 810, ly: 222, an: 'start' },
      { a: 'n23r', b: 'l231', side: '≤', lx: 810, ly: 336, an: 'end' },
      { a: 'n23r', b: 'l321', side: '>', lx: 906, ly: 332, an: 'start' }
    ];

    /* 9 帧：cur 本步焦点节点，done 已走过的节点，edges 已走过的边序号，note 底部结论行 */
    var F = [
      { cur: '', done: [], edges: [], note: '输入 ⟨9, 4, 6⟩：还没有做任何比较',
        desc: '输入 ⟨a1, a2, a3⟩ = ⟨9, 4, 6⟩。作用于 3 个元素的插入排序决策树一共 6 个叶子 —— 123、132、213、231、312、321，正好对应 3! = 6 种可能的排列。' },
      { cur: 'root', done: [], edges: [], note: '比较 1：a1 = 9 与 a2 = 4',
        desc: '从根节点开始。内部节点 1:2 表示"比较 a1 与 a2"这一次比较操作，此时 a1 = 9、a2 = 4。' },
      { cur: 'n13r', done: ['root'], edges: [1], note: '9 ≥ 4 成立 → 走右分支，到达节点 1:3',
        desc: '因为 9 ≥ 4（即 a1 ≥ a2），沿<b>右分支</b>（分支标记为 "&gt;"）走到内部节点 1:3 —— 第一次比较的结果被记进了这条路径。' },
      { cur: 'n13r', done: ['root'], edges: [1], note: '比较 2：a1 = 9 与 a3 = 6',
        desc: '在内部节点 1:3 上做第二次比较：a1 与 a3，此时 a1 = 9、a3 = 6。' },
      { cur: 'n23r', done: ['root', 'n13r'], edges: [1, 7], note: '9 ≥ 6 成立 → 再走右分支，到达节点 2:3',
        desc: '因为 9 ≥ 6（即 a1 ≥ a3），继续沿<b>右分支</b>走到内部节点 2:3；路径这时已经走了 2 次比较。' },
      { cur: 'n23r', done: ['root', 'n13r'], edges: [1, 7], note: '比较 3：a2 = 4 与 a3 = 6',
        desc: '在内部节点 2:3 上做第三次比较：a2 与 a3，此时 a2 = 4、a3 = 6。' },
      { cur: 'l231', done: ['root', 'n13r', 'n23r'], edges: [1, 7, 8], note: '4 ≤ 6 成立 → 走左分支，到达叶子 231',
        desc: '因为 4 ≤ 6（即 a2 ≤ a3），沿<b>左分支</b>（标记 "≤"）到达叶子 231，路径走完，整条路径长度 = 3 次比较。' },
      { cur: 'l231', done: ['root', 'n13r', 'n23r', 'l231'], edges: [1, 7, 8], note: '叶子 231 ⇒ 次序 a2 ≤ a3 ≤ a1 ⇒ 输出 ⟨4, 6, 9⟩',
        desc: '叶子 231 表示最终的排列是 a2 ≤ a3 ≤ a1，代入数值就是 ⟨4, 6, 9⟩ —— 排序结果正确。这条搜索路径共做了 3 次比较。' },
      { cur: '', done: ['root', 'n13r', 'n23r', 'l231'], edges: [1, 7, 8], note: '算法的运行时间 = 路径长度；最坏运行时间 = 树的高度',
        desc: '归纳：决策树可以模拟任何比较排序 —— 每个输入都对应一条从根到叶的路径，<b>算法的运行时间 = 路径的长度</b>（本例 3 次比较），<b>最坏运行时间 = 树的高度</b>。叶子 123 那条路径只比较了 2 次，正说明不同输入的运行时间并不相同。' }
    ];

    var idx = 0;

    function render() {
      var f = F[idx], k, e, n, nd, isCur, isDone, fill, stroke, sw;
      HB.clear(stage);
      var svg = HB.svgRoot(1000, 470, '作用于 3 个元素的插入排序决策树，演示输入 ⟨9,4,6⟩ 的搜索路径');
      stage.appendChild(svg);                           // 把画好的 svg 挂到演示舞台上

      add(svg, 'text', { x: 26, y: 26, 'class': 'tx-b' },
        '作用于 3 个元素的插入排序的决策树（内部节点 i:j = 比较 ai 与 aj；叶子 = 一种排列）');

      /* ---- 先画边，再画节点，让节点盖住线头 ---- */
      for (k = 0; k < E.length; ++k) {
        e = E[k];
        var on = f.edges.indexOf(k) >= 0;                          // 这条边是否落在搜索路径上
        add(svg, 'line', {
          x1: T[e.a].x, y1: T[e.a].y, x2: T[e.b].x, y2: T[e.b].y,
          stroke: on ? 'var(--c-hot)' : 'var(--c-line)',
          'stroke-width': on ? 3.2 : 1.6, 'class': 'edge'
        });
        add(svg, 'text', {
          x: e.lx, y: e.ly, 'text-anchor': e.an,
          'class': 'tx-sm' + (on ? ' tx-b' : ''),
          fill: on ? 'var(--c-hot)' : 'var(--c-ink-soft)'
        }, e.side);
      }

      /* ---- 节点：内部节点画圆，叶子画方框 ---- */
      for (n in T) {
        if (!Object.prototype.hasOwnProperty.call(T, n)) { continue; }
        nd = T[n];
        isCur = (f.cur === n);                                     // 本步焦点
        isDone = f.done.indexOf(n) >= 0;                           // 已经走过
        fill = 'var(--c-panel-2)'; stroke = 'var(--c-line)'; sw = 1.4;
        if (isDone) { fill = 'var(--c-key-bg)'; stroke = 'var(--c-accent)'; sw = 2.0; }
        if (nd.leaf && nd.t === '231' && isDone && !isCur) { fill = 'var(--c-tip-bg)'; stroke = 'var(--c-ok)'; }
        if (isCur) { fill = 'var(--c-warn-bg)'; stroke = 'var(--c-hot)'; sw = 2.8; }
        if (nd.leaf) {
          add(svg, 'rect', {
            x: nd.x - 33, y: nd.y - 16, width: 66, height: 32, rx: 5,
            fill: fill, stroke: stroke, 'stroke-width': sw, 'class': 'node-rect'
          });
        } else {
          add(svg, 'circle', {
            cx: nd.x, cy: nd.y, r: 25,
            fill: fill, stroke: stroke, 'stroke-width': sw, 'class': 'node-circle'
          });
        }
        add(svg, 'text', {
          x: nd.x, y: nd.y + 5, 'text-anchor': 'middle',
          'class': 'tx' + (isCur ? ' tx-b' : '')
        }, nd.t);
      }

      /* ---- 底部的路径信息 ---- */
      var seqNodes = f.done.slice();                              // 已经走过的节点（按先后次序）
      if (f.cur && seqNodes.indexOf(f.cur) < 0) { seqNodes.push(f.cur); }   // 别忘了本步焦点节点
      var pathTxt = [], q;
      for (q = 0; q < seqNodes.length; ++q) { pathTxt.push(T[seqNodes[q]].t); }   // 显示成 1:2 / 2:3 / 231
      add(svg, 'line', { x1: 26, y1: 418, x2: 974, y2: 418, stroke: 'var(--c-line-soft)' });
      add(svg, 'text', { x: 26, y: 445, 'class': 'tx' }, f.note);
      add(svg, 'text', { x: 26, y: 465, 'class': 'tx-sm' },
        '已走路径：' + (pathTxt.length ? pathTxt.join(' → ') : '（尚未出发）') +
        '　｜　比较次数：' + f.edges.length);

      if (cap) { cap.innerHTML = '第 ' + (idx + 1) + ' / ' + F.length + ' 步 · ' + f.desc; }
    }

    return {
      steps: F.length,                                  // 总步数 9
      reset: function () { idx = 0; render(); },
      prev: function () { if (idx > 0) { idx -= 1; } render(); },
      next: function () { if (idx < F.length - 1) { idx += 1; } render(); }
    };
  });

  /* ==========================================================================
     Demo 3：基数排序 radix-sort
     7 个三位数，LSD：个位 → 十位 → 百位，每趟用稳定的计数排序
     ========================================================================== */
  HB.register('radix-sort', function (root) {
    var stage = root.querySelector('.demo-stage');
    var cap = root.querySelector('.demo-cap');

    var DATA = [329, 457, 657, 839, 436, 720, 355];     // PPT slide 52 的算例
    var M = DATA.length;                                // 元素个数 7
    var RX = 176, RW = 84, RSTEP = 94, RH = 44;         // 序列行的起点、格宽、格距、格高
    var YIN = 58, YOUT = 356;                           // 输入行 / 收集结果行的纵坐标
    var BX = 24, BW = 88, BSTEP = 96, BY = 150, BH = 170;   // 10 个桶的位置与尺寸

    var svg = null;                                     // 当前帧的 svg 根节点
    var idx = 0;                                        // 当前步号

    /** 取 v 的第 pos 位数字：pos = 0 百位、1 十位、2 个位 */
    function digitAt(v, pos) {
      var p = [100, 10, 1][pos];
      return Math.floor(v / p) % 10;
    }

    /** 用稳定的计数排序按 pos 位排一遍（与页面上的伪代码完全一致） */
    function stableSortByDigit(seq, pos) {
      var cnt = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], out = [], i, d;
      for (i = 0; i < seq.length; ++i) { cnt[digitAt(seq[i], pos)] += 1; }   // 统计本位数字出现次数
      for (d = 1; d < 10; ++d) { cnt[d] += cnt[d - 1]; }                    // 前缀累加：cnt[d] = |{数字 ≤ d}|
      for (i = seq.length - 1; i >= 0; --i) {                               // 反向填充，保证本趟稳定
        d = digitAt(seq[i], pos);
        cnt[d] -= 1;
        out[cnt[d]] = seq[i];
      }
      return out;
    }

    /** 把 seq 按 pos 位分到 0..9 号桶 */
    function bucketsOf(seq, pos) {
      var b = [], i, d;
      for (d = 0; d < 10; ++d) { b.push([]); }
      for (i = 0; i < seq.length; ++i) { b[digitAt(seq[i], pos)].push(seq[i]); }
      return b;
    }

    /** 把分桶结果写成"桶0:[720]、桶5:[355]"这样的解说文字 */
    function bucketText(b) {
      var t = [], d;
      for (d = 0; d < 10; ++d) {
        if (b[d].length) { t.push('桶' + d + ':[' + b[d].join(', ') + ']'); }
      }
      return t.join('、');
    }

    var P1 = stableSortByDigit(DATA, 2);                // 第 1 趟：按个位（最右一位）
    var P2 = stableSortByDigit(P1, 1);                  // 第 2 趟：按十位（中间一位）
    var P3 = stableSortByDigit(P2, 0);                  // 第 3 趟：按百位（最左一位）
    var B1 = bucketsOf(DATA, 2), B2 = bucketsOf(P1, 1), B3 = bucketsOf(P2, 0);

    var DIGN = ['百位', '十位', '个位'];                 // digitPos 到中文名的映射

    /** 构造 12 帧动画数据 */
    function buildFrames() {
      var fr = [];
      fr.push({
        pass: 0, digitPos: -1, inSeq: DATA, outSeq: null, buckets: null,
        note: '输入：329, 457, 657, 839, 436, 720, 355 —— 还没有排过任何一位',
        desc: '待排序的 7 个三位数：329、457、657、839、436、720、355。先把它们统一成 3 位（不足前面补 0），再从<b>最低位（个位）</b>开始，依次做 3 趟稳定的排序。'
      });
      fr.push({
        pass: 1, digitPos: 2, inSeq: DATA, outSeq: null, buckets: null,
        note: '第 1 趟取位：个位依次是 9、7、7、9、6、0、5',
        desc: '第 1 趟：取出每个数的<b>个位</b>数字 —— 329→9、457→7、657→7、839→9、436→6、720→0、355→5。'
      });
      fr.push({
        pass: 1, digitPos: 2, inSeq: DATA, outSeq: null, buckets: B1,
        note: '第 1 趟分桶：' + bucketText(B1),
        desc: '第 1 趟分桶：按个位数字放进 0~9 号桶 —— ' + bucketText(B1) + '；同一个桶内的元素保持原有先后次序，这是后面正确性的关键。'
      });
      fr.push({
        pass: 1, digitPos: 2, inSeq: DATA, outSeq: P1, buckets: B1,
        note: '第 1 趟收集：' + P1.join(', ') + '（已经按个位有序）',
        desc: '第 1 趟收集：按桶号 0→9 依次把元素收回，得到 ' + P1.join(', ') + ' —— 现在所有数已经按个位有序。'
      });
      fr.push({
        pass: 2, digitPos: 1, inSeq: P1, outSeq: null, buckets: null,
        note: '第 2 趟取位：十位依次是 2、5、3、5、5、2、3',
        desc: '第 2 趟：在上一趟的结果上取出每个数的<b>十位</b> —— 720→2、355→5、436→3、457→5、657→5、329→2、839→3。'
      });
      fr.push({
        pass: 2, digitPos: 1, inSeq: P1, outSeq: null, buckets: B2,
        note: '第 2 趟分桶：' + bucketText(B2),
        desc: '第 2 趟分桶：' + bucketText(B2) + '；注意桶2 里 720 排在 329 前面，正是上一趟（个位 0 &lt; 9）留下的次序 —— 稳定性在这里起作用。'
      });
      fr.push({
        pass: 2, digitPos: 1, inSeq: P1, outSeq: P2, buckets: B2,
        note: '第 2 趟收集：' + P2.join(', ') + '（低两位已经有序）',
        desc: '第 2 趟收集：得到 ' + P2.join(', ') + ' —— 低两位（十位 + 个位）已经有序。'
      });
      fr.push({
        pass: 3, digitPos: 0, inSeq: P2, outSeq: null, buckets: null,
        note: '第 3 趟取位：百位依次是 7、3、4、8、3、4、6',
        desc: '第 3 趟：取出每个数的<b>百位</b> —— 720→7、329→3、436→4、839→8、355→3、457→4、657→6。'
      });
      fr.push({
        pass: 3, digitPos: 0, inSeq: P2, outSeq: null, buckets: B3,
        note: '第 3 趟分桶：' + bucketText(B3),
        desc: '第 3 趟分桶：' + bucketText(B3) + '；桶内次序依旧是上一趟留下的次序。'
      });
      fr.push({
        pass: 3, digitPos: 0, inSeq: P2, outSeq: P3, buckets: B3,
        note: '第 3 趟收集：' + P3.join(', '),
        desc: '第 3 趟收集：得到 ' + P3.join(', ') + ' —— 三位全部排完，整个序列已经有序。'
      });
      fr.push({
        pass: 3, digitPos: -1, inSeq: P2, outSeq: P3, buckets: B3,
        note: '最终结果：' + P3.join(', '),
        desc: '最终结果：' + P3.join(' ') + '。整个过程没有比较过任何两个数的大小，只按"位"分桶与收集，共 3 趟，每趟 Θ(n + 10)。'
      });
      fr.push({
        pass: 3, digitPos: -1, inSeq: P2, outSeq: P3, buckets: B3,
        note: '为什么必须先低位、后高位？因为每一趟排序都是稳定的',
        desc: '为什么必须先低位后高位：每趟排序都是<b>稳定</b>的，所以第 t 趟不会打乱已经排好的低 t−1 位；如果反过来从高位开始，后面的趟就会把高位已经定好的次序重新打乱。'
      });
      return fr;
    }

    var frames = buildFrames();

    /** 画一行三位数；digitPos 指定的那一位会被高亮 */
    function drawSeq(y, seq, digitPos) {
      var i, d, x, cx, s, tx;
      for (i = 0; i < M; ++i) {
        x = RX + i * RSTEP;
        box(svg, x, y, RW, RH, '', seq ? 'key' : null);
        if (!seq) { continue; }
        s = String(seq[i]);
        cx = x + RW / 2;
        for (d = 0; d < 3; ++d) {
          tx = cx + (d - 1) * 13;
          if (d === digitPos) {
            add(svg, 'rect', {
              x: tx - 8, y: y + 7, width: 16, height: RH - 14, rx: 3,
              fill: 'var(--c-warn)', opacity: 0.22
            });
          }
          add(svg, 'text', {
            x: tx, y: y + RH / 2 + 5, 'text-anchor': 'middle',
            'class': 'tx' + (d === digitPos ? ' tx-b' : '')
          }, s.charAt(d));
        }
      }
    }

    function render() {
      var f = frames[idx], i, b, d, bx, bs, cx;
      HB.clear(stage);
      svg = HB.svgRoot(1000, 470, '基数排序演示：7 个三位数逐趟按个位、十位、百位稳定排序');
      stage.appendChild(svg);                           // 把画好的 svg 挂到演示舞台上

      add(svg, 'text', { x: 26, y: 24, 'class': 'tx-b' },
        '基数排序（LSD）：7 个三位数，按 个位 → 十位 → 百位 逐趟稳定排序' +
        (f.pass ? '　【当前：第 ' + f.pass + ' 趟 · 按' + DIGN[f.digitPos] + '】' : '　【准备】'));

      /* ---- 本趟输入行 ---- */
      add(svg, 'text', { x: 30, y: YIN + 28, 'class': 'tx-b', fill: 'var(--c-accent)' }, '本趟输入');
      for (i = 0; i < M; ++i) {
        add(svg, 'text', {
          x: RX + i * RSTEP + RW / 2, y: YIN - 8, 'class': 'tx-sm', 'text-anchor': 'middle'
        }, i + 1);
      }
      drawSeq(YIN, f.inSeq, f.digitPos);

      /* ---- 10 个桶 ---- */
      add(svg, 'text', { x: 30, y: BY - 12, 'class': 'tx-sm' },
        '分桶（桶号 = 当前位的数字，0 ~ 9；桶内保持原有先后次序）');
      for (b = 0; b < 10; ++b) {
        bx = BX + b * BSTEP;
        bs = f.buckets ? f.buckets[b] : null;
        add(svg, 'rect', {
          x: bx, y: BY, width: BW, height: BH, rx: 6,
          fill: bs && bs.length ? 'var(--c-key-bg)' : 'var(--c-panel-2)',
          stroke: bs && bs.length ? 'var(--c-accent)' : 'var(--c-line)',
          'stroke-width': bs && bs.length ? 1.8 : 1.2
        });
        add(svg, 'text', { x: bx + BW / 2, y: BY + 22, 'class': 'tx-b', 'text-anchor': 'middle' }, b);
        add(svg, 'line', { x1: bx + 8, y1: BY + 32, x2: bx + BW - 8, y2: BY + 32, stroke: 'var(--c-line)' });
        if (bs) {
          for (d = 0; d < bs.length; ++d) {
            add(svg, 'text', {
              x: bx + BW / 2, y: BY + 58 + d * 24, 'class': 'tx', 'text-anchor': 'middle'
            }, bs[d]);
          }
        }
      }

      /* ---- 收集结果行 ---- */
      add(svg, 'text', { x: 30, y: YOUT + 28, 'class': 'tx-b', fill: 'var(--c-ok)' }, '收集结果');
      drawSeq(YOUT, f.outSeq, f.outSeq ? f.digitPos : -1);
      if (!f.outSeq) {
        cx = RX + (M * RSTEP - (RSTEP - RW)) / 2;
        add(svg, 'text', { x: cx, y: YOUT + 28, 'class': 'tx-sm', 'text-anchor': 'middle' },
          '（本趟还没有收集：按桶号 0→9 收回后写在这一行）');
      }

      /* ---- 底部说明 ---- */
      add(svg, 'text', { x: 26, y: 434, 'class': 'tx' }, f.note);
      add(svg, 'text', { x: 26, y: 458, 'class': 'tx-sm' },
        '高亮的那一位就是本趟排序依据的数位；同一桶内元素的先后次序始终不变，这正是"稳定排序"的含义。');

      if (cap) {
        cap.innerHTML = '第 ' + (idx + 1) + ' / ' + frames.length + ' 步 · ' + f.desc;
      }
    }

    return {
      steps: frames.length,                             // 总步数 12
      reset: function () { idx = 0; render(); },
      prev: function () { if (idx > 0) { idx -= 1; } render(); },
      next: function () { if (idx < frames.length - 1) { idx += 1; } render(); }
    };
  });
})();
