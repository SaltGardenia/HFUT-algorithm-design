/* ============================================================================
   算法复习手册 · Deck2《算法基础与分析原则》动画脚本
   ----------------------------------------------------------------------------
   注册名（必须与 HTML 中 .demo 的 data-demo 完全一致）：
     insertion-sort     插入排序逐步执行（PPT 16 元素实例，下标从 1 开始）
     selection-sort     选择排序逐步执行（PPT 16 元素实例，cur_min / cur_min_pos）
     quick-partition    快速排序 Lomuto 划分（6 10 13 5 8 3 2 11，基准 x = A[p] = 6）
     count-insertion    插入排序伪代码逐行计数 → T(n) = 3n²/2 + 7n/2 − 4
   每个动画只实现 reset / prev / next 三个接口，“播放”由 handbook.js 统一驱动。
   ========================================================================== */
(function () {
  'use strict';

  var HB = window.HB;
  if (!HB || typeof HB.register !== 'function') { return; }

  /* PPT 第 41 / 54 页给出的 16 元素输入数组 */
  var PPT_ARRAY = [24, 17, 40, 28, 13, 14, 22, 32, 40, 21, 48, 4, 47, 8, 37, 18];

  /* ---------------------------------------------------------------- SVG 工具 */
  /** 文本节点：addText(svg, x, y, 内容, class, 锚点, 颜色, 字号) */
  function addText(svg, x, y, s, cls, anchor, color, size) {
    var t = HB.svg('text', {
      x: x, y: y, 'class': cls || 'tx', 'text-anchor': anchor || 'start'
    }, s);
    var st = '';
    if (color) { st += 'fill:' + color + ';'; }
    if (size) { st += 'font-size:' + size + ';'; }
    if (st) { t.setAttribute('style', st); }
    svg.appendChild(t);
    return t;
  }

  /** 圆角矩形：addRect(svg, x, y, w, h, r, class, style) */
  function addRect(svg, x, y, w, h, r, cls, style) {
    var n = HB.svg('rect', { x: x, y: y, width: w, height: h, rx: r, 'class': cls || 'arr-cell' });
    if (style) { n.setAttribute('style', style); }
    svg.appendChild(n);
    return n;
  }

  /** 直线：addLine(svg, x1, y1, x2, y2, style) */
  function addLine(svg, x1, y1, x2, y2, style) {
    var n = HB.svg('line', { x1: x1, y1: y1, x2: x2, y2: y2 });
    n.setAttribute('style', style);
    svg.appendChild(n);
    return n;
  }

  /** 向下箭头（指针在单元格上方）：ptrDown(svg, cx, tipY, label, color) */
  function ptrDown(svg, cx, tipY, label, color) {
    svg.appendChild(HB.svg('path', {
      d: 'M ' + cx + ' ' + tipY + ' L ' + (cx - 5) + ' ' + (tipY - 10) + ' L ' + (cx + 5) + ' ' + (tipY - 10) + ' Z',
      style: 'fill:' + color
    }));
    addText(svg, cx, tipY - 14, label, 'tx tx-b', 'middle', color);
  }

  /** 向上箭头（指针在单元格下方）：ptrUp(svg, cx, tipY, label, color) */
  function ptrUp(svg, cx, tipY, label, color) {
    svg.appendChild(HB.svg('path', {
      d: 'M ' + cx + ' ' + tipY + ' L ' + (cx - 5) + ' ' + (tipY + 10) + ' L ' + (cx + 5) + ' ' + (tipY + 10) + ' Z',
      style: 'fill:' + color
    }));
    addText(svg, cx, tipY + 25, label, 'tx tx-b', 'middle', color);
  }

  /** 数组单元格：值 + 显示用下标；st 取 st-idle / st-active / st-compare / st-visited / st-pivot */
  function drawCells(svg, X, y, A, cw, ch, idxBase, clsOf) {
    for (var k = 0; k < A.length; k++) {
      var st = clsOf ? (clsOf(k) || '') : '';
      var x = X(k);
      var white = (st && st !== 'st-idle') ? ' tx-white' : '';
      addRect(svg, x, y, cw, ch, 4, 'arr-cell ' + st);
      addText(svg, x + cw / 2, y + ch / 2 - 1, String(A[k]), 'tx tx-b' + white, 'middle', null, null);
      addText(svg, x + cw / 2, y + ch - 5, String(idxBase + k), 'tx-sm' + white, 'middle', null, '9.5px');
    }
  }

  /** 把「帧数组」包成 handbook.js 需要的 { reset, prev, next } 控制器 */
  function driver(cap, draw, steps) {
    var cur = 0;
    function show(idx) {
      if (idx < 0) { idx = 0; }
      if (idx > steps.length - 1) { idx = steps.length - 1; }
      cur = idx;
      var f = steps[cur];
      draw(f);
      cap.innerHTML = '<b>第 ' + (cur + 1) + ' / ' + steps.length + ' 步</b> · ' + f.cap;
    }
    return {
      reset: function () { show(0); },
      prev: function () { show(cur - 1); },
      next: function () { show(cur + 1); }
    };
  }

  /* ==========================================================================
     动画 1：插入排序（PPT 16 元素实例）
     伪代码（1 起下标）：
       for j = 2 to A.length
           key = A[j]
           i = j - 1
           while i > 0 and A[i] > key
               A[i + 1] = A[i]
               i = i - 1
           A[i + 1] = key
     ========================================================================== */
  HB.register('insertion-sort', function (root) {
    var stage = root.querySelector('.demo-stage');
    var cap = root.querySelector('.demo-cap');
    var n = PPT_ARRAY.length;
    var CW = 34, CH = 32, GAP = 3, X0 = 26, CY = 58;
    var W = X0 * 2 + n * CW + (n - 1) * GAP;
    var H = 196;

    /** 1 起下标 i 对应的左边界像素 */
    function X(i) { return X0 + (i - 1) * (CW + GAP); }

    var steps = [];
    (function build() {
      var A = PPT_ARRAY.slice();
      var sortedTo = 1, compares = 0;

      function snap(tag, caption, j, i, key, keyPos, placed, code) {
        steps.push({
          tag: tag, cap: caption, A: A.slice(), j: j, i: i, key: key,
          keyPos: keyPos, placed: placed, sortedTo: sortedTo, compares: compares, code: code
        });
      }

      snap('初始化',
        '输入数组为 PPT 的 16 元素实例 &lt;24, 17, 40, 28, 13, 14, 22, 32, 40, 21, 48, 4, 47, 8, 37, 18&gt;。' +
        '先认为 A[1] = 24 单独构成已排序区间，j 从 2 开始，每次都把 A[j] 插入左边合适的位置。',
        null, null, null, null, null, 'INSERTION-SORT(A)');

      for (var j = 2; j <= n; j++) {
        var key = A[j - 1];
        var i = j - 1;
        snap('取出 key',
          '第 ' + (j - 1) + ' 轮：<b>key = A[' + j + '] = ' + key + '</b>；j = ' + j +
          '，已排序区间是 A[1..' + (j - 1) + ']，令 i = j − 1 = ' + i + '，从右往左扫描。',
          j, i, key, j, null, 'key = A[' + j + ']');

        while (i > 0 && A[i - 1] > key) {
          compares++;
          var oldI = i;
          var big = A[oldI - 1];
          A[oldI] = big;                       // 伪代码：A[i + 1] = A[i]
          i = oldI - 1;                        // 伪代码：i = i − 1
          snap('A[i] 后移',
            '比较 A[' + oldI + '] = ' + big + ' &gt; key = ' + key + '：<b>成立</b>，把 A[' + oldI + '] 后移到 A[' +
            (oldI + 1) + ']，i 左移到 ' + i + '。累计元素比较 <b>' + compares + '</b> 次。',
            j, i, key, j, null, 'A[i + 1] = A[i];  i = i − 1');
        }

        var stop;
        if (i > 0) {
          compares++;
          stop = '比较 A[' + i + '] = ' + A[i - 1] + ' &gt; key = ' + key + '：<b>不成立</b>，内层循环结束；';
        } else {
          stop = 'i 已经减到 0，条件 i &gt; 0 <b>不成立</b>，内层循环结束；';
        }
        A[i] = key;                            // 伪代码：A[i + 1] = key
        sortedTo = j;
        snap('写入 key',
          stop + '把 <b>key = ' + key + ' 写入 A[' + (i + 1) + ']</b>。已排序区间扩大到 A[1..' + j + ']。',
          j, (i > 0 ? i : null), key, j, i + 1, 'A[i + 1] = key');
      }

      snap('排序完成',
        '排序结束：&lt;4, 8, 13, 14, 17, 18, 21, 22, 24, 28, 32, 37, 40, 40, 47, 48&gt;，与 PPT 给出的输出完全一致。' +
        '对这份输入，插入排序一共做了 <b>' + compares + ' 次元素比较</b>（n = 16 时最好 15 次、最坏 120 次）。',
        null, null, null, null, null, 'return A');
    })();

    function draw(f) {
      HB.clear(stage);
      var svg = HB.svgRoot(W, H, '插入排序执行过程动画');
      stage.appendChild(svg);

      addText(svg, 4, 16, f.tag, 'tx-sm', 'start', 'var(--c-accent)');
      addText(svg, W / 2, 16, '元素比较 ' + f.compares + ' 次', 'tx-sm', 'middle', 'var(--c-hot)');
      addText(svg, W - 4, 16, '已排序区间 A[1..' + f.sortedTo + ']', 'tx-sm', 'end', 'var(--c-ok)');

      /* 已排序区间下划线 */
      var ux1 = X(1), ux2 = X(f.sortedTo) + CW;
      addLine(svg, ux1, CY + CH + 6, ux2, CY + CH + 6,
        'stroke:var(--c-ok);stroke-width:3;stroke-linecap:round');

      /* 单元格 */
      drawCells(svg, X, CY, f.A, CW, CH, 1, function (k) {
        var pos = k + 1;
        if (pos <= f.sortedTo) { return 'st-idle'; }
        return '';
      });
      /* 逐个叠加高亮（后画的在上层，实心底色需重画白字） */
      if (f.i) {
        addRect(svg, X(f.i), CY, CW, CH, 4, 'arr-cell', 'fill:var(--c-warn)');
        addText(svg, X(f.i) + CW / 2, CY + CH / 2 - 1, String(f.A[f.i - 1]), 'tx tx-b tx-white', 'middle');
        addText(svg, X(f.i) + CW / 2, CY + CH - 5, String(f.i), 'tx-sm tx-white', 'middle', null, '9.5px');
      }
      if (f.placed) {
        addRect(svg, X(f.placed), CY, CW, CH, 4, 'arr-cell', 'fill:var(--c-ok)');
        addText(svg, X(f.placed) + CW / 2, CY + CH / 2 - 1, String(f.A[f.placed - 1]), 'tx tx-b tx-white', 'middle');
        addText(svg, X(f.placed) + CW / 2, CY + CH - 5, String(f.placed), 'tx-sm tx-white', 'middle', null, '9.5px');
      }
      if (f.keyPos) {
        addRect(svg, X(f.keyPos) - 2, CY - 2, CW + 4, CH + 4, 5, 'arr-cell',
          'fill:none;stroke:var(--c-hot);stroke-width:2;stroke-dasharray:5 3');
      }

      /* 指针 */
      if (f.j) { ptrDown(svg, X(f.j) + CW / 2, CY - 4, 'j=' + f.j, 'var(--c-hot)'); }
      if (f.i) { ptrUp(svg, X(f.i) + CW / 2, CY + CH + 8, 'i=' + f.i, 'var(--c-warn)'); }

      /* key 浮框 */
      if (f.key != null) {
        addRect(svg, X0, 136, 168, 30, 6, 'arr-cell', 'fill:var(--c-accent)');
        addText(svg, X0 + 84, 156, 'key = ' + f.key + '（待插入）', 'tx tx-b tx-white', 'middle');
      }

      addText(svg, W - 4, 156, '当前语句：' + f.code, 'tx-sm', 'end', 'var(--c-accent-2)');
      addText(svg, 4, 184,
        '内层循环：while i > 0 and A[i] > key → 后移 A[i] 到 A[i+1] 并让 i 左移；退出后 A[i+1] = key',
        'tx-sm', 'start');
    }

    return driver(cap, draw, steps);
  });

  /* ==========================================================================
     动画 2：选择排序（PPT 16 元素实例）
     伪代码（1 起下标）：
       for i = 1 to A.length - 1
           cur_min = A[i];  cur_min_pos = i
           for j = i + 1 to A.length
               if A[j] < cur_min
                   cur_min = A[j];  cur_min_pos = j
           swap A[i] <-> A[cur_min_pos]
     ========================================================================== */
  HB.register('selection-sort', function (root) {
    var stage = root.querySelector('.demo-stage');
    var cap = root.querySelector('.demo-cap');
    var n = PPT_ARRAY.length;
    var CW = 34, CH = 32, GAP = 3, X0 = 26, CY = 58;
    var W = X0 * 2 + n * CW + (n - 1) * GAP;
    var H = 200;

    function X(i) { return X0 + (i - 1) * (CW + GAP); }

    var steps = [];
    (function build() {
      var A = PPT_ARRAY.slice();
      var sortedTo = 0, compares = 0;

      function snap(tag, caption, i, j, curMin, curMinPos, swapped, code) {
        steps.push({
          tag: tag, cap: caption, A: A.slice(), i: i, j: j, curMin: curMin,
          curMinPos: curMinPos, swapped: swapped || null, sortedTo: sortedTo,
          compares: compares, code: code
        });
      }

      snap('初始化',
        '输入数组与插入排序相同：&lt;24, 17, 40, 28, 13, 14, 22, 32, 40, 21, 48, 4, 47, 8, 37, 18&gt;。' +
        '已排序区间为空，第 i 次遍历要在未排序区间 A[i..16] 中找出第 i 小的元素，放到 A[i]。',
        null, null, null, null, null, 'SELECTION-SORT(A)');

      for (var i = 1; i <= n - 1; i++) {
        var curMin = A[i - 1], curMinPos = i;
        snap('初始化 cur_min',
          '第 ' + i + ' 次遍历：<b>cur_min = A[' + i + '] = ' + curMin + '，cur_min_pos = ' + i +
          '</b>；j 从 i + 1 = ' + (i + 1) + ' 开始扫描未排序区间 A[' + i + '..' + n + ']。',
          i, i + 1, curMin, curMinPos, null, 'cur_min = A[i];  cur_min_pos = i');

        for (var j = i + 1; j <= n; j++) {
          compares++;
          var v = A[j - 1];
          var prevMin = curMin;
          var upd = v < curMin;
          if (upd) { curMin = v; curMinPos = j; }
          snap(upd ? '更新 cur_min' : '扫描 j',
            'j = ' + j + '：比较 A[' + j + '] = ' + v + (upd ? ' &lt; ' : ' &ge; ') + 'cur_min = ' +
            prevMin + ' → ' + (upd
              ? '<b>更新 cur_min = ' + v + '，cur_min_pos = ' + j + '</b>'
              : '不更新，cur_min 仍是 ' + curMin + '（位置 ' + curMinPos + '）') +
            '。累计比较 ' + compares + ' 次。',
            i, j, curMin, curMinPos, null, 'if A[j] < cur_min');
        }

        var old = A[i - 1];
        A[i - 1] = A[curMinPos - 1];
        A[curMinPos - 1] = old;
        sortedTo = i;
        snap('交换',
          '本次扫描结束：最小值是 A[' + curMinPos + '] = ' + A[i - 1] + '（cur_min_pos = ' + curMinPos +
          '），执行 <b>swap A[' + i + '] &lt;-&gt; A[' + curMinPos + ']</b>，A[' + i + '] = ' + A[i - 1] +
          ' 归位。已排序区间扩大为 A[1..' + i + ']。',
          i, null, A[i - 1], i, [i, curMinPos], 'swap A[i], A[cur_min_pos]');
      }

      snap('排序完成',
        'i 枚举到 n − 1 = 15 后循环结束，数组已升序：&lt;4, 8, 13, 14, 17, 18, 21, 22, 24, 28, 32, 37, 40, 40, 47, 48&gt;，' +
        '与 PPT 输出一致。比较次数 = 15 + 14 + … + 1 = n(n − 1)/2 = <b>' + compares + ' 次</b>（与输入实例无关）。',
        null, null, null, null, null, 'return A');
    })();

    function draw(f) {
      HB.clear(stage);
      var svg = HB.svgRoot(W, H, '选择排序执行过程动画');
      stage.appendChild(svg);

      addText(svg, 4, 16, f.tag, 'tx-sm', 'start', 'var(--c-accent)');
      addText(svg, W / 2, 16, '元素比较 ' + f.compares + ' 次', 'tx-sm', 'middle', 'var(--c-hot)');
      addText(svg, W - 4, 16,
        f.sortedTo === 0 ? '已排序区间：空' : '已排序 A[1..' + f.sortedTo + ']',
        'tx-sm', 'end', 'var(--c-ok)');

      /* 已排序 / 未排序分界线 */
      if (f.sortedTo >= 1 && f.sortedTo < n) {
        var bx = X(f.sortedTo + 1) - GAP / 2;
        addLine(svg, bx, CY - 12, bx, CY + CH + 14,
          'stroke:var(--c-ok);stroke-width:2;stroke-dasharray:6 4');
        addText(svg, bx - 6, CY + CH + 28, '已排序', 'tx-sm', 'end', 'var(--c-ok)');
        addText(svg, bx + 6, CY + CH + 28, '未排序', 'tx-sm', 'start', 'var(--c-ink-soft)');
      }

      drawCells(svg, X, CY, f.A, CW, CH, 1, function (k) {
        return (k + 1 <= f.sortedTo) ? 'st-visited' : '';
      });
      if (f.curMinPos) {
        addRect(svg, X(f.curMinPos) - 2, CY - 2, CW + 4, CH + 4, 5, 'arr-cell',
          'fill:none;stroke:var(--c-accent);stroke-width:2.5;stroke-dasharray:5 3');
      }
      if (f.swapped) {
        addRect(svg, X(f.swapped[0]) - 3, CY - 3, CW + 6, CH + 6, 5, 'arr-cell',
          'fill:none;stroke:var(--c-hot);stroke-width:2.5');
      } else if (f.j) {
        addRect(svg, X(f.j), CY, CW, CH, 4, 'arr-cell', 'fill:var(--c-warn)');
        addText(svg, X(f.j) + CW / 2, CY + CH / 2 - 1, String(f.A[f.j - 1]), 'tx tx-b tx-white', 'middle');
        addText(svg, X(f.j) + CW / 2, CY + CH - 5, String(f.j), 'tx-sm tx-white', 'middle', null, '9.5px');
      }

      if (f.i) { ptrDown(svg, X(f.i) + CW / 2, CY - 4, 'i=' + f.i, 'var(--c-hot)'); }
      if (f.j) { ptrUp(svg, X(f.j) + CW / 2, CY + CH + 44, 'j=' + f.j, 'var(--c-warn)'); }

      if (f.curMin != null) {
        addRect(svg, X0, 146, 246, 30, 6, 'arr-cell', 'fill:var(--c-accent)');
        addText(svg, X0 + 123, 166,
          'cur_min = ' + f.curMin + '   cur_min_pos = ' + f.curMinPos,
          'tx tx-b tx-white', 'middle');
      }
      addText(svg, W - 4, 166, '当前语句：' + f.code, 'tx-sm', 'end', 'var(--c-accent-2)');
      addText(svg, 4, 190,
        '每次遍历只记录最小值及其位置，扫描结束后才做一次交换：共 n − 1 次交换',
        'tx-sm', 'start');
    }

    return driver(cap, draw, steps);
  });

  /* ==========================================================================
     动画 3：快速排序的划分（Lomuto 方案）
     PARTITION(A, p, q)：x = A[p];  i = p;
       for j = p + 1 to q
           if A[j] <= x
               i = i + 1;  swap A[i], A[j]
       swap A[p], A[i];  return i
     PPT 例子数组：6 10 13 5 8 3 2 11，p = 0，q = 7，x = A[p] = 6
     ========================================================================== */
  HB.register('quick-partition', function (root) {
    var stage = root.querySelector('.demo-stage');
    var cap = root.querySelector('.demo-cap');
    var ARR = [6, 10, 13, 5, 8, 3, 2, 11];
    var n = ARR.length, P = 0, Q = n - 1;
    var CW = 40, CH = 36, GAP = 5, X0 = 24, CY = 74;
    var W = X0 * 2 + n * CW + (n - 1) * GAP;
    var H = 232;

    /** 0 起下标 i 对应的左边界像素 */
    function X(i) { return X0 + i * (CW + GAP); }

    var steps = [];
    (function build() {
      var A = ARR.slice();
      var x = A[P], i = P, swaps = 0;

      function snap(tag, caption, ii, jj, extra) {
        steps.push({
          tag: tag, cap: caption, A: A.slice(), i: ii, j: jj, x: x,
          swaps: swaps, p: P, q: Q, ret: (extra && extra.ret != null) ? extra.ret : null,
          hi: (extra && extra.hi) || null
        });
      }

      snap('初始化',
        '待划分数组 A = [6, 10, 13, 5, 8, 3, 2, 11]，p = 0，q = 7，取基准 <b>x = A[p] = 6</b>。' +
        '令 i = p = 0，表示「≤ x 区间」当前为空；j 从 p + 1 = 1 开始向右扫描。',
        P, P + 1, null);
      snap('设置 i、j',
        '不变式：A[p+1..i] 都 ≤ x，A[i+1..j−1] 都 &gt; x，A[j..q] 尚未处理。' +
        '此刻 i = 0（≤ x 区间为空）、j = 1（未处理区间是 A[1..7]）。',
        P, P + 1, null);

      for (var j = P + 1; j <= Q; j++) {
        var v = A[j];
        if (v <= x) {
          i = i + 1;
          var tmp = A[i];
          A[i] = A[j];
          A[j] = tmp;
          swaps++;
          snap('i++ 并交换',
            'j = ' + j + '：A[' + j + '] = ' + v + ' &le; x = ' + x + ' → <b>i 自增为 ' + i +
            '，交换 A[' + i + '] &lt;-&gt; A[' + j + ']</b>。交换后 A[p+1..i] = [' +
            A.slice(P + 1, i + 1).join(', ') + '] 都 ≤ x，A[i+1..j] = [' +
            A.slice(i + 1, j + 1).join(', ') + '] 都 &gt; x。',
            i, j, { hi: [i, j] });
        } else {
          snap('不交换',
            'j = ' + j + '：A[' + j + '] = ' + v + ' &gt; x = ' + x + ' → 不交换，j 继续右移。' +
            '≤ x 区间仍是 A[' + (P + 1) + '..' + i + ']，&gt; x 区间扩大到 A[' + (i + 1) + '..' + j + ']。',
            i, j, null);
        }
      }

      var t2 = A[P];
      A[P] = A[i];
      A[i] = t2;
      snap('基准归位',
        'j 扫描完 A[8] 后循环结束（此时 i = ' + i + '）。执行最后一次交换 <b>swap A[p] &lt;-&gt; A[i]，即 A[0] &lt;-&gt; A[' + i +
        ']</b>，把基准 x = ' + x + ' 放到它的最终位置 A[' + i + ']。整个划分共做 ' + swaps + ' 次元素交换。',
        i, null, { hi: [P, i] });

      snap('返回 i',
        '划分结束：A = [' + A.join(', ') + ']，返回 <b>i = ' + i + '</b>。' +
        '左半部分 A[0..' + (i - 1) + '] = [' + A.slice(0, i).join(', ') + '] 全部 ≤ ' + x +
        '，右半部分 A[' + (i + 1) + '..7] = [' + A.slice(i + 1).join(', ') + '] 全部 ≥ ' + x +
        '；基准 A[' + i + '] = ' + x + ' 已在最终位置。',
        i, null, { ret: i });
    })();

    function draw(f) {
      HB.clear(stage);
      var svg = HB.svgRoot(W, H, '快速排序划分过程动画');
      stage.appendChild(svg);

      addText(svg, 4, 16, f.tag, 'tx-sm', 'start', 'var(--c-accent)');
      addText(svg, W - 4, 16, '基准 x = A[' + f.p + '] = ' + f.x, 'tx-sm', 'end', 'var(--c-accent)');
      addText(svg, W / 2, 16, '交换 ' + f.swaps + ' 次', 'tx-sm', 'middle', 'var(--c-hot)');

      /* 不变式区间条：≤ x / > x / 未处理 */
      var barY = CY + CH + 8, barH = 9;
      function strip(a, b, color, label, opacity) {
        if (b < a) { return; }
        addRect(svg, X(a), barY, X(b) + CW - X(a), barH, 4, 'arr-bar',
          'fill:' + color + ';opacity:' + opacity);
        addText(svg, (X(a) + X(b) + CW) / 2, barY + barH + 16, label, 'tx-sm', 'middle', color);
      }
      strip(f.p + 1, f.i, 'var(--c-accent)', '≤ x', '.75');
      strip(f.i + 1, (f.j == null ? f.q : f.j - 1), 'var(--c-warn)', '> x', '.75');
      strip((f.j == null ? f.q + 1 : f.j), f.q, 'var(--c-ink-soft)', '未处理', '.45');

      drawCells(svg, X, CY, f.A, CW, CH, 0, function (k) {
        if (k === f.p) { return 'st-pivot'; }
        if (f.hi && (k === f.hi[0] || k === f.hi[1])) { return 'st-active'; }
        if (k >= f.p + 1 && k <= f.i) { return 'st-idle'; }
        return '';
      });
      if (f.j != null) {
        addRect(svg, X(f.j) - 2, CY - 2, CW + 4, CH + 4, 5, 'arr-cell',
          'fill:none;stroke:var(--c-warn);stroke-width:2.5');
      }

      if (f.i != null) { ptrDown(svg, X(f.i) + CW / 2, CY - 6, 'i=' + f.i, 'var(--c-hot)'); }
      if (f.j != null) { ptrDown(svg, X(f.j) + CW / 2, CY - 6, 'j=' + f.j, 'var(--c-warn)'); }

      addText(svg, 4, 150,
        '划分函数 PARTITION(A, p, q)：x = A[p]; i = p; for j = p+1 to q { if A[j] ≤ x { i++; swap A[i],A[j] } }',
        'tx-sm', 'start');
      addText(svg, 4, 168, '最后 swap A[p], A[i] 并 return i', 'tx-sm', 'start');
      addText(svg, W - 4, 168,
        f.ret != null ? '本次划分返回值 i = ' + f.ret : '扫描区间 A[p+1..q] = A[1..7]',
        'tx-sm', 'end', f.ret != null ? 'var(--c-ok)' : 'var(--c-ink-soft)');
      addText(svg, 4, 200,
        '说明：题给例子用 0 起下标，p = 0、q = 7；划分后基准落在 A[' + (f.ret != null ? f.ret : f.i) + ']',
        'tx-sm', 'start');
    }

    return driver(cap, draw, steps);
  });

  /* ==========================================================================
     动画 4：插入排序伪代码逐行计数 → T(n) = 3n²/2 + 7n/2 − 4
     7 行计数：n, n−1, n−1, Σ(j=2..n) j, Σ(j=2..n)(j−1), Σ(j=2..n)(j−1), n−1
     求和：n + (n−1) + (n−1) + [n(n+1)/2 − 1] + n(n−1)/2 + n(n−1)/2 + (n−1) = 3n²/2 + 7n/2 − 4
     ========================================================================== */
  HB.register('count-insertion', function (root) {
    var stage = root.querySelector('.demo-stage');
    var cap = root.querySelector('.demo-cap');
    var W = 700, H = 420, LY = 92, LH = 30;

    var CODE = [
      'for j = 2 to A.length',
      '    key = A[j]',
      '    i = j − 1',
      '    while i > 0 and A[i] > key',
      '        A[i + 1] = A[i]',
      '        i = i − 1',
      '    A[i + 1] = key'
    ];
    var CNT = [
      'n 次',
      'n − 1 次',
      'n − 1 次',
      'Σ(j = 2..n) j 次',
      'Σ(j = 2..n) (j − 1) 次',
      'Σ(j = 2..n) (j − 1) 次',
      'n − 1 次'
    ];

    var steps = [];
    (function build() {
      function snap(tag, caption, upto, hl, flags) {
        steps.push({
          tag: tag, cap: caption, upto: upto, hl: hl,
          sum1: !!(flags && flags.sum1), sum2: !!(flags && flags.sum2),
          n16: !!(flags && flags.n16), theta: !!(flags && flags.theta)
        });
      }
      snap('逐行计数',
        '把插入排序最坏情况下的每一行伪代码都数一遍执行次数，并假定每个基本操作（+ − × ÷ 与 ≔ &gt; &lt; =）的代价都是 1。' +
        '外层循环变量写成 j，第 4 行 while 的判定次数是 Σ(j = 2..n) j。',
        -1, -1, null);
      snap('第 1 行',
        '第 1 行 <code>for j = 2 to A.length</code>：j 取 2, 3, …, n 共 <b>n − 1</b> 次循环，加上最后一次不成立的条件判定，共执行 <b>n 次</b>。',
        0, 0, null);
      snap('第 2 行',
        '第 2 行 <code>key = A[j]</code>：每次进入循环体取一次待插入的关键字，共 <b>n − 1 次</b>。注意下标是 j = 2, 3, …, n。',
        1, 1, null);
      snap('第 3 行',
        '第 3 行 <code>i = j − 1</code>：每次都把 j − 1 赋给 i，共 <b>n − 1 次</b>（一次赋值代价为 1）。',
        2, 2, null);
      snap('第 4 行',
        '第 4 行 <code>while i &gt; 0 and A[i] &gt; key</code>：第 j 轮要做 j 次判定（含最后一次不成立），' +
        '总数 = 2 + 3 + … + n = Σ(j = 2..n) j = <b>n(n + 1)/2 − 1 次</b>。',
        3, 3, null);
      snap('第 5 行',
        '第 5 行 <code>A[i + 1] = A[i]</code>：第 j 轮最多后移 j − 1 个元素，总数 = 1 + 2 + … + (n − 1) = ' +
        'Σ(j = 2..n)(j − 1) = <b>n(n − 1)/2 次</b>，这正是最坏情况的元素比较次数。',
        4, 4, null);
      snap('第 6 行',
        '第 6 行 <code>i = i − 1</code>：每后移一个元素就左移一次，次数与第 5 行相同，为 <b>n(n − 1)/2 次</b>。',
        5, 5, null);
      snap('第 7 行',
        '第 7 行 <code>A[i + 1] = key</code>：每轮插入最后落位一次，共 <b>n − 1 次</b>。至此 7 行次数全部标出。',
        6, 6, null);
      snap('求和',
        '把 7 行次数相加：T(n) = n + (n − 1) + (n − 1) + [n(n + 1)/2 − 1] + n(n − 1)/2 + n(n − 1)/2 + (n − 1)。',
        6, -1, { sum1: true });
      snap('化简',
        '合并同类项：n + 3(n − 1) = 4n − 3，Σ 部分 = n(n + 1)/2 − 1 + n(n − 1) = 3n²/2 − n/2 − 1，' +
        '所以 <b>T(n) = 3n²/2 + 7n/2 − 4</b>，与 PPT 的结论一致。',
        6, -1, { sum1: true, sum2: true });
      snap('代入 n = 16',
        '拿 PPT 的 16 元素实例验证：n = 16 时 T(16) = 3 × 256/2 + 7 × 16/2 − 4 = 384 + 56 − 4 = <b>436</b> 次基本操作，' +
        '其中元素比较最坏为 n(n − 1)/2 = <b>120 次</b>（最好情况只要 n − 1 = 15 次）。',
        6, -1, { sum1: true, sum2: true, n16: true });
      snap('结论',
        'T(n) = 3n²/2 + 7n/2 − 4 中最高阶项是 n²，忽略系数与低阶项后 <b>T(n) = Θ(n²)</b>；' +
        '因此插入排序的时间复杂度为 O(n²)。同理可数出选择排序 T(n) = 2n² + 3n − 4 = Θ(n²)。',
        6, -1, { sum1: true, sum2: true, n16: true, theta: true });
    })();

    function draw(f) {
      HB.clear(stage);
      var svg = HB.svgRoot(W, H, '插入排序伪代码逐行计数动画');
      stage.appendChild(svg);

      addText(svg, 24, 30, 'INSERTION-SORT(A) 逐行计数（每个基本操作代价 = 1）', 'tx tx-b', 'start', 'var(--c-accent)');
      addText(svg, W - 24, 30, f.tag, 'tx-sm', 'end', 'var(--c-hot)');

      for (var k = 0; k < CODE.length; k++) {
        var y = LY + k * LH;
        if (k === f.hl) {
          addRect(svg, 40, y - 19, W - 80, LH - 4, 6, 'arr-cell',
            'fill:var(--c-accent);opacity:.13');
        }
        addText(svg, 56, y, String(k + 1), 'tx-sm', 'end', 'var(--c-ink-soft)');
        addText(svg, 68, y, CODE[k], 'tx', 'start');
        if (k <= f.upto) {
          addText(svg, W - 56, y, CNT[k], 'tx tx-b', 'end', 'var(--c-hot)');
        } else {
          addText(svg, W - 56, y, '?', 'tx-sm', 'end', 'var(--c-ink-soft)');
        }
      }

      var baseY = LY + CODE.length * LH + 22;
      addLine(svg, 40, baseY - 24, W - 40, baseY - 24, 'stroke:var(--c-line);stroke-dasharray:5 5');

      if (f.sum1) {
        addText(svg, 48, baseY, 'T(n) = n + (n − 1) + (n − 1) + [n(n + 1)/2 − 1] + n(n − 1)/2 + n(n − 1)/2 + (n − 1)',
          'tx', 'start');
      }
      if (f.sum2) {
        addText(svg, 48, baseY + 32, '        = 3n²/2 + 7n/2 − 4', 'tx tx-b', 'start', 'var(--c-accent)');
      }
      if (f.n16) {
        addText(svg, 48, baseY + 64, 'n = 16 时：T(16) = 3 × 256/2 + 7 × 16/2 − 4 = 436 次基本操作（元素比较最坏 120 次）',
          'tx-sm', 'start', 'var(--c-ok)');
      }
      if (f.theta) {
        addText(svg, 48, baseY + 96, '忽略系数与低阶项，只保留最高阶项：T(n) = Θ(n²)', 'tx tx-b', 'start', 'var(--c-hot)');
      }
    }

    return driver(cap, draw, steps);
  });
})();
