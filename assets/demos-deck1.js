/* ============================================================================
   demos-deck1.js —— 第 1 讲（绪论与算法设计思维）专用动画
   依赖 assets/handbook.js 提供的 HB.register / HB.svg / HB.svgRoot / HB.clear
   注册的 demo：euclid（辗转相除法）、quickselect（快速选择）
   ========================================================================== */
(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';

  /* ----------------------------------------------------------- 小工具 */
  function mk(tag, attrs, text) {
    var n = document.createElementNS(NS, tag);
    if (attrs) {
      for (var k in attrs) {
        if (Object.prototype.hasOwnProperty.call(attrs, k) && attrs[k] != null) {
          n.setAttribute(k, String(attrs[k]));
        }
      }
    }
    if (text != null) { n.textContent = String(text); }
    return n;
  }

  /* SVG 里统一用这些字体（与 handbook.css 的 .tx 类一致） */
  function tCode(x, y, s, fill, bold, anchor, size) {
    return mk('text', {
      x: x, y: y,
      'font-family': 'var(--f-mono), monospace',
      'font-size': size || 12.5,
      'font-weight': bold ? 700 : 400,
      fill: fill || 'var(--c-ink)',
      'text-anchor': anchor || 'start',
      'xml:space': 'preserve'
    }, s);
  }
  function tSans(x, y, s, fill, bold, anchor, size) {
    return mk('text', {
      x: x, y: y,
      'font-family': 'var(--f-sans), sans-serif',
      'font-size': size || 12,
      'font-weight': bold ? 700 : 400,
      fill: fill || 'var(--c-ink-soft)',
      'text-anchor': anchor || 'start'
    }, s);
  }
  function box(x, y, w, h, fill, stroke, rx, sw) {
    return mk('rect', {
      x: x, y: y, width: w, height: h,
      rx: rx == null ? 6 : rx,
      fill: fill || 'var(--c-panel-2)',
      stroke: stroke || 'var(--c-line)',
      'stroke-width': sw == null ? 1 : sw
    });
  }

  /* ==========================================================================
     demo 1：辗转相除法
     ========================================================================== */
  var EUC_CODE = [
    'EUCLID(m, n)',
    '1  while n \u2260 0',
    '2      r = m mod n',
    '3      m = n',
    '4      n = r',
    '5  return m'
  ];

  HB.register('euclid', function (root, stage, cap) {
    /* ------------------------------------------------------------------
       预先算好 gcd(48, 18) 的每一步。
       每步记录：m、n、余数 r、当前执行到第几行代码、本步解说。
       行号对应 EUC_CODE：1=while 判断，2=算余数，3=m=n，4=n=r，5=返回
       ------------------------------------------------------------------ */
    var steps = [
      { m: 48, n: 18, r: '\u2014', ln: 1, txt: '开始：m = 48，n = 18。判断循环条件 n \u2260 0，18 \u2260 0 成立，进入循环体。', hist: [] },
      { m: 48, n: 18, r: 12, ln: 2, txt: '计算余数：48 \u00f7 18 = 2 余 <b>12</b>，所以 r = 12。', hist: ['48 \u00f7 18 = 2 \u2026 12'] },
      { m: 18, n: 12, r: 12, ln: 3, txt: '执行 m = n：把原来的除数 18 赋给 m，此时 m = 18。', hist: ['48 \u00f7 18 = 2 \u2026 12'] },
      { m: 18, n: 12, r: 12, ln: 4, txt: '执行 n = r：把余数 12 赋给 n，此时 n = 12。问题规模从 (48,18) 缩小到 (18,12)。', hist: ['48 \u00f7 18 = 2 \u2026 12'] },
      { m: 18, n: 12, r: '\u2014', ln: 1, txt: '回到 while 判断：n = 12 \u2260 0，继续循环。', hist: ['48 \u00f7 18 = 2 \u2026 12'] },
      { m: 18, n: 12, r: 6, ln: 2, txt: '计算余数：18 \u00f7 12 = 1 余 <b>6</b>，所以 r = 6。', hist: ['48 \u00f7 18 = 2 \u2026 12', '18 \u00f7 12 = 1 \u2026 6'] },
      { m: 12, n: 6, r: 6, ln: 3, txt: '执行 m = n：m = 12。', hist: ['48 \u00f7 18 = 2 \u2026 12', '18 \u00f7 12 = 1 \u2026 6'] },
      { m: 12, n: 6, r: 6, ln: 4, txt: '执行 n = r：n = 6。问题规模缩小到 (12, 6)。', hist: ['48 \u00f7 18 = 2 \u2026 12', '18 \u00f7 12 = 1 \u2026 6'] },
      { m: 12, n: 6, r: '\u2014', ln: 1, txt: '回到 while 判断：n = 6 \u2260 0，继续循环。', hist: ['48 \u00f7 18 = 2 \u2026 12', '18 \u00f7 12 = 1 \u2026 6'] },
      { m: 12, n: 6, r: 0, ln: 2, txt: '计算余数：12 \u00f7 6 = 2 余 <b>0</b>，所以 r = 0。注意余数已经变成 0。', hist: ['48 \u00f7 18 = 2 \u2026 12', '18 \u00f7 12 = 1 \u2026 6', '12 \u00f7 6 = 2 \u2026 0'] },
      { m: 6, n: 0, r: 0, ln: 3, txt: '执行 m = n：m = 6。', hist: ['48 \u00f7 18 = 2 \u2026 12', '18 \u00f7 12 = 1 \u2026 6', '12 \u00f7 6 = 2 \u2026 0'] },
      { m: 6, n: 0, r: 0, ln: 4, txt: '执行 n = r：n = 0。此时 m = 6、n = 0。', hist: ['48 \u00f7 18 = 2 \u2026 12', '18 \u00f7 12 = 1 \u2026 6', '12 \u00f7 6 = 2 \u2026 0'] },
      { m: 6, n: 0, r: '\u2014', ln: 1, txt: '回到 while 判断：n = 0，条件 <b>不成立</b>，退出循环。', hist: ['48 \u00f7 18 = 2 \u2026 12', '18 \u00f7 12 = 1 \u2026 6', '12 \u00f7 6 = 2 \u2026 0'] },
      { m: 6, n: 0, r: '\u2014', ln: 5, txt: '执行 return m：返回 <b>6</b>。即 gcd(48, 18) = 6，共迭代 3 轮。', hist: ['48 \u00f7 18 = 2 \u2026 12', '18 \u00f7 12 = 1 \u2026 6', '12 \u00f7 6 = 2 \u2026 0'] }
    ];

    var idx = 0;
    var svg = mk('svg', {
      viewBox: '0 0 560 360', width: 560, height: 360,
      role: 'img', 'aria-label': '辗转相除法执行过程动画'
    });
    svg.style.maxWidth = '560px';
    svg.style.width = '100%';

    /* 静态结构：代码区 + 状态区 + 历史区 */
    var codeG = mk('g');
    var codeHl = mk('rect', {
      x: 18, y: 0, width: 250, height: 22, rx: 4,
      fill: 'var(--c-warn-bg)', stroke: 'var(--c-warn)', 'stroke-width': 1
    });
    var codeRows = [];
    for (var i = 0; i < EUC_CODE.length; i++) {
      var y = 30 + i * 24;
      var t = tCode(30, y + 15, EUC_CODE[i], 'var(--c-code-ink)');
      codeRows.push(t);
      codeG.appendChild(t);
    }
    codeG.appendChild(codeHl);
    // 把高亮块压到文字下面
    codeG.insertBefore(codeHl, codeRows[0]);

    svg.appendChild(box(14, 14, 258, 18 + EUC_CODE.length * 24 + 8, 'var(--c-code-bg)', 'var(--c-line)', 8));
    svg.appendChild(mk('text', {
      x: 30, y: 30, 'font-family': 'var(--f-sans), sans-serif', 'font-size': 11,
      'letter-spacing': '0.08em', fill: 'var(--c-ink-soft)', 'font-weight': 700
    }, '伪代码'));
    svg.appendChild(codeG);

    /* 右侧状态面板 */
    var stateG = mk('g');
    svg.appendChild(box(286, 14, 260, 178, 'var(--c-panel-2)', 'var(--c-line)', 8));
    svg.appendChild(tSans(300, 34, '当前状态', 'var(--c-ink-soft)', true, 'start', 11.5));

    function valuePill(x, y, label, sub) {
      var g = mk('g');
      g.appendChild(box(x, y, 74, 50, 'var(--c-panel)', 'var(--c-line)', 7));
      g.appendChild(tSans(x + 37, y + 18, label, 'var(--c-ink-soft)', true, 'middle', 12));
      var v = tCode(x + 37, y + 40, '\u2014', 'var(--c-accent)', true, 'middle', 17);
      g.appendChild(v);
      var s = tSans(x + 37, y + 62, sub || '', 'var(--c-ink-soft)', false, 'middle', 10);
      g.appendChild(s);
      return { g: g, v: v, s: s };
    }
    var pM = valuePill(298, 46, 'm', '被除数');
    var pN = valuePill(386, 46, 'n', '除数');
    var pR = valuePill(474, 46, 'r', '余数');
    stateG.appendChild(pM.g);
    stateG.appendChild(pN.g);
    stateG.appendChild(pR.g);

    var lineInfo = tCode(300, 128, '', 'var(--c-ink)');
    stateG.appendChild(lineInfo);
    var eqInfo = tCode(300, 152, '', 'var(--c-hot)');
    stateG.appendChild(eqInfo);
    var cntInfo = tSans(300, 178, '', 'var(--c-ink-soft)', false, 'start', 11.5);
    stateG.appendChild(cntInfo);
    svg.appendChild(stateG);

    /* 底部历史区 */
    svg.appendChild(box(14, 202, 532, 144, 'var(--c-panel)', 'var(--c-line)', 8));
    svg.appendChild(tSans(28, 222, '迭代历程（余数严格递减，必收敛到 0）', 'var(--c-ink-soft)', true, 'start', 11.5));
    var histG = mk('g');
    svg.appendChild(histG);

    /* 把画布挂载到 .demo-stage（否则动画不会显示） */
    if (stage) { stage.appendChild(svg); }

    function render() {
      var s = steps[idx];

      /* 代码高亮 */
      if (s.ln >= 1 && s.ln <= EUC_CODE.length) {
        var ly = 30 + (s.ln - 1) * 24;
        codeHl.setAttribute('y', ly);
        codeHl.setAttribute('opacity', '1');
      } else {
        codeHl.setAttribute('opacity', '0');
      }

      /* 状态值 */
      pM.v.textContent = String(s.m);
      pN.v.textContent = String(s.n);
      pR.v.textContent = String(s.r);
      pN.v.setAttribute('fill', s.m === 6 && s.n === 0 ? 'var(--c-ok)' : 'var(--c-accent)');

      lineInfo.textContent = '执行行：' + EUC_CODE[s.ln];
      eqInfo.textContent = s.hist.length ? s.hist[s.hist.length - 1] : '';
      cntInfo.textContent = '已迭代轮数：' + s.hist.length +
        (s.ln === 5 ? '　（结束，返回 ' + s.m + '）' : '');

      /* 历史列表 */
      while (histG.firstChild) { histG.removeChild(histG.firstChild); }
      var cur = s.hist;
      for (var k = 0; k < cur.length; k++) {
        var hy = 250 + k * 30;
        histG.appendChild(box(28, hy - 16, 504, 24, k === cur.length - 1 ? 'var(--c-key-bg)' : 'var(--c-panel-2)',
          k === cur.length - 1 ? 'var(--c-accent)' : 'var(--c-line-soft)', 5));
        histG.appendChild(tCode(40, hy + 1, '第 ' + (k + 1) + ' 轮：', 'var(--c-ink-soft)', false, 'start', 12));
        histG.appendChild(tCode(106, hy + 1, cur[k], 'var(--c-ink)', true, 'start', 12.5));
        if (k === cur.length - 1) {
          histG.appendChild(tSans(360, hy + 1, '\u2190 本轮结果', 'var(--c-accent)', false, 'start', 11));
        }
      }
      /* 收敛说明 */
      var noteY = 250 + cur.length * 30;
      if (noteY < 336) {
        histG.appendChild(tSans(40, noteY,
          cur.length === 0 ? '尚未产生余数' :
            (s.ln === 5 ? '余数最终为 0，while 条件不成立，返回 m = 6' :
              '余数序列：' + cur.map(function (e) { return e.split('\u2026')[1].trim(); }).join(' \u2192 ') + ' \u2192 0'),
          'var(--c-ink-soft)', false, 'start', 11.5));
      }

      if (cap) { cap.innerHTML = '<b>第 ' + (idx + 1) + '/' + steps.length + ' 步</b>　' + s.txt; }
    }

    return {
      reset: function () { idx = 0; render(); },
      prev: function () { if (idx > 0) { idx--; render(); } },
      next: function () { if (idx < steps.length - 1) { idx++; render(); } }
    };
  });

  /* ==========================================================================
     demo 2：快速选择 QuickSelect
     ========================================================================== */
  var QS_CODE = [
    '1  if p == r              return A[p]',
    '2  q = PARTITION(A, p, r)',
    '3  i = q - p + 1',
    '4  if k == i              return A[q]',
    '5  else if k < i          \u21d2 左半段',
    '6  else                   \u21d2 右半段'
  ];

  HB.register('quickselect', function (root, stage, cap) {
    var A0 = [6, 10, 13, 5, 8, 3, 2, 11];
    var K = 3;

    /* ------------------------------------------------------------------
       预先构造每一步的快照（避免运行时状态难以回退）
       字段：arr 当前数组、p/r 当前搜索区间、i/j 扫描指针、
             q 基准下标、pivotVal 基准值、ln 当前执行行、txt 解说
       ------------------------------------------------------------------ */
    var steps = [
      { arr: A0.slice(), p: 0, r: 7, i: -1, j: -1, q: -1, pv: null, ln: 0,
        txt: '目标：在 A[0..7] 中找第 <b>k = 3</b> 小的元素（k 从 1 开始计数）。当前搜索区间为整个数组。' },

      { arr: A0.slice(), p: 0, r: 7, i: 0, j: 1, q: -1, pv: 6, ln: 1,
        txt: '进入 PARTITION：p = 0、r = 7，取 <b>基准 pivot = A[0] = 6</b>；令 i = 0（左区右边界），j = 1 开始扫描。' },

      { arr: [6, 10, 13, 5, 8, 3, 2, 11], p: 0, r: 7, i: 0, j: 1, q: -1, pv: 6, ln: 1,
        txt: 'j = 1：A[1] = 10 &gt; 6，不属于左区，i 不动，j 右移。' },

      { arr: [6, 10, 13, 5, 8, 3, 2, 11], p: 0, r: 7, i: 0, j: 2, q: -1, pv: 6, ln: 1,
        txt: 'j = 2：A[2] = 13 &gt; 6，同样跳过，j 右移。' },

      { arr: [6, 10, 13, 5, 8, 3, 2, 11], p: 0, r: 7, i: 0, j: 3, q: -1, pv: 6, ln: 1,
        txt: 'j = 3：A[3] = 5 &le; 6，命中！执行 i = i + 1 = 1，然后交换 A[1] 与 A[3]。' },

      { arr: [6, 5, 13, 10, 8, 3, 2, 11], p: 0, r: 7, i: 1, j: 4, q: -1, pv: 6, ln: 1,
        txt: '交换完成：<b>5 换到前面</b>，数组变为 6, 5, 13, 10, 8, 3, 2, 11。左区扩展到下标 1。' },

      { arr: [6, 5, 13, 10, 8, 3, 2, 11], p: 0, r: 7, i: 1, j: 4, q: -1, pv: 6, ln: 1,
        txt: 'j = 4：A[4] = 8 &gt; 6，跳过，j 右移。' },

      { arr: [6, 5, 13, 10, 8, 3, 2, 11], p: 0, r: 7, i: 1, j: 5, q: -1, pv: 6, ln: 1,
        txt: 'j = 5：A[5] = 3 &le; 6，命中！i = 2，交换 A[2] 与 A[5]。' },

      { arr: [6, 5, 3, 10, 8, 13, 2, 11], p: 0, r: 7, i: 2, j: 6, q: -1, pv: 6, ln: 1,
        txt: '交换完成：3 换到前面，数组变为 6, 5, 3, 10, 8, 13, 2, 11。左区扩展到下标 2。' },

      { arr: [6, 5, 3, 10, 8, 13, 2, 11], p: 0, r: 7, i: 2, j: 6, q: -1, pv: 6, ln: 1,
        txt: 'j = 6：A[6] = 2 &le; 6，命中！i = 3，交换 A[3] 与 A[6]。' },

      { arr: [6, 5, 3, 2, 8, 13, 10, 11], p: 0, r: 7, i: 3, j: 7, q: -1, pv: 6, ln: 1,
        txt: '交换完成：2 换到前面，数组变为 6, 5, 3, 2, 8, 13, 10, 11。左区扩展到下标 3。' },

      { arr: [6, 5, 3, 2, 8, 13, 10, 11], p: 0, r: 7, i: 3, j: 7, q: -1, pv: 6, ln: 1,
        txt: 'j = 7：A[7] = 11 &gt; 6，跳过。扫描结束（j 已到 r）。' },

      { arr: [6, 5, 3, 2, 8, 13, 10, 11], p: 0, r: 7, i: 3, j: 7, q: 3, pv: 6, ln: 1,
        txt: '扫描结束，最后一步：交换 <b>A[p] 与 A[i]</b>，即 A[0] 与 A[3]，把基准 6 放到左右区交界处。' },

      { arr: [2, 5, 3, 6, 8, 13, 10, 11], p: 0, r: 7, i: 3, j: 7, q: 3, pv: 6, ln: 1,
        txt: '划分完成！数组为 2, 5, 3, 6, 8, 13, 10, 11，基准 6 落在下标 <b>q = 3</b>。PARTITION 返回 3。' },

      { arr: [2, 5, 3, 6, 8, 13, 10, 11], p: 0, r: 7, i: 3, j: 7, q: 3, pv: 6, ln: 2,
        txt: '执行 i = q − p + 1 = 3 − 0 + 1 = <b>4</b>。含义：基准在当前区间内是第 4 小的元素。' },

      { arr: [2, 5, 3, 6, 8, 13, 10, 11], p: 0, r: 7, i: 3, j: 7, q: 3, pv: 6, ln: 3,
        txt: '比较 k 与 i：k = 3，i = 4，所以 <b>k &lt; i</b>，目标在左半段。只需递归左半段，右半段整体丢弃。' },

      { arr: [2, 5, 3, 6, 8, 13, 10, 11], p: 0, r: 2, i: 3, j: 7, q: 3, pv: 6, ln: 4,
        txt: '递归 RANDOMIZED-SELECT(A, 0, 2, 3)：新区间 A[0..2] = [2, 5, 3]，k 仍为 3。' },

      { arr: [2, 5, 3, 6, 8, 13, 10, 11], p: 0, r: 2, i: 0, j: 1, q: -1, pv: 2, ln: 1,
        txt: '第二轮 PARTITION：p = 0、r = 2，基准 <b>pivot = A[0] = 2</b>；i = 0，j = 1。' },

      { arr: [2, 5, 3, 6, 8, 13, 10, 11], p: 0, r: 2, i: 0, j: 1, q: -1, pv: 2, ln: 1,
        txt: 'j = 1：A[1] = 5 &gt; 2，跳过，j 右移。' },

      { arr: [2, 5, 3, 6, 8, 13, 10, 11], p: 0, r: 2, i: 0, j: 2, q: -1, pv: 2, ln: 1,
        txt: 'j = 2：A[2] = 3 &gt; 2，跳过。扫描结束，仍交换 A[0] 与 A[0]（位置不变）。' },

      { arr: [2, 5, 3, 6, 8, 13, 10, 11], p: 0, r: 2, i: 0, j: 2, q: 0, pv: 2, ln: 1,
        txt: '第二轮划分完成，基准 2 落在下标 <b>q = 0</b>。i = q − p + 1 = 1。' },

      { arr: [2, 5, 3, 6, 8, 13, 10, 11], p: 0, r: 2, i: 0, j: 2, q: 0, pv: 2, ln: 3,
        txt: '比较 k 与 i：k = 3，i = 1，仍然 <b>k &gt; i</b>，目标在右半段，进入 else 分支。' },

      { arr: [2, 5, 3, 6, 8, 13, 10, 11], p: 1, r: 2, i: 0, j: 2, q: 0, pv: 2, ln: 5,
        txt: '递归 RANDOMIZED-SELECT(A, 1, 2, 3 − 1 = 2)：新区间 A[1..2] = [5, 3]，注意 <b>k 扣除了左半段长度 1</b>。' },

      { arr: [2, 5, 3, 6, 8, 13, 10, 11], p: 1, r: 2, i: 1, j: 2, q: -1, pv: 5, ln: 1,
        txt: '第三轮 PARTITION：p = 1、r = 2，基准 <b>pivot = A[1] = 5</b>；i = 1，j = 2。' },

      { arr: [2, 5, 3, 6, 8, 13, 10, 11], p: 1, r: 2, i: 1, j: 2, q: -1, pv: 5, ln: 1,
        txt: 'j = 2：A[2] = 3 &le; 5，命中！i = i + 1 = 2，交换 A[2] 与 A[2]（位置不变）。' },

      { arr: [2, 5, 3, 6, 8, 13, 10, 11], p: 1, r: 2, i: 2, j: 2, q: 2, pv: 5, ln: 1,
        txt: '扫描结束，交换 A[p] 与 A[i]，即 A[1] 与 A[2]。' },

      { arr: [2, 3, 5, 6, 8, 13, 10, 11], p: 1, r: 2, i: 2, j: 2, q: 2, pv: 5, ln: 1,
        txt: '划分完成：数组变为 2, 3, 5, 6, 8, 13, 10, 11，基准 5 落在下标 <b>q = 2</b>。i = q − p + 1 = 2。' },

      { arr: [2, 3, 5, 6, 8, 13, 10, 11], p: 1, r: 2, i: 2, j: 2, q: 2, pv: 5, ln: 2,
        txt: '比较 k 与 i：k = 2，i = 2，<b>k = i</b>，命中！直接返回基准 A[q] = A[2]。' },

      { arr: [2, 3, 5, 6, 8, 13, 10, 11], p: 1, r: 2, i: 2, j: 2, q: 2, pv: 5, ln: 3,
        txt: '答案：第 3 小的元素是 <b>5</b>。总共只做了 3 轮划分，远少于完全排序的代价。' }
    ];

    var idx = 0;
    var svg = mk('svg', {
      viewBox: '0 0 620 400', width: 620, height: 400,
      role: 'img', 'aria-label': '快速选择算法执行过程动画'
    });
    svg.style.maxWidth = '620px';
    svg.style.width = '100%';

    /* 顶部代码区 */
    var codeHl = mk('rect', { x: 16, y: 0, width: 588, height: 22, rx: 4, fill: 'var(--c-warn-bg)', stroke: 'var(--c-warn)' });
    var codeTexts = [];
    var codeG = mk('g');
    for (var ci = 0; ci < QS_CODE.length; ci++) {
      var cy = 34 + ci * 22;
      var t = tCode(28, cy + 14, QS_CODE[ci], 'var(--c-code-ink)', false, 'start', 12);
      codeTexts.push(t);
      codeG.appendChild(t);
    }
    svg.appendChild(box(12, 16, 596, 22 + QS_CODE.length * 22 + 8, 'var(--c-code-bg)', 'var(--c-line)', 8));
    svg.appendChild(codeHl);
    svg.appendChild(codeG);
    svg.insertBefore(codeHl, codeG);

    /* 数组区 */
    var ARR_Y = 248;
    var arrG = mk('g');
    svg.appendChild(arrG);
    svg.appendChild(tSans(28, ARR_Y - 30, '数组 A（上排为下标，下排为元素值）', 'var(--c-ink-soft)', true, 'start', 11.5));

    /* 指针 */
    var ptrG = mk('g');
    svg.appendChild(ptrG);

    /* 信息区 */
    var infoG = mk('g');
    svg.appendChild(infoG);

    /* 把画布挂载到 .demo-stage（否则动画不会显示） */
    if (stage) { stage.appendChild(svg); }

    function cellW() { return 66; }
    function cellX(i) { return 30 + i * cellW(); }

    function render() {
      var s = steps[idx];

      /* 代码高亮 */
      if (s.ln >= 0 && s.ln < QS_CODE.length) {
        codeHl.setAttribute('y', 34 + s.ln * 22 - 13);
        codeHl.setAttribute('opacity', '1');
      } else {
        codeHl.setAttribute('opacity', '0');
      }

      /* 数组格子 */
      while (arrG.firstChild) { arrG.removeChild(arrG.firstChild); }
      for (var i = 0; i < s.arr.length; i++) {
        var x = cellX(i);
        var inRange = (i >= s.p && i <= s.r);

        var fill, stroke, sw;
        if (!inRange) { fill = '#f1f5f9'; stroke = 'var(--c-line-soft)'; sw = 1; }
        else if (i === s.q) { fill = 'var(--c-accent)'; stroke = 'var(--c-accent)'; sw = 2; }
        else if (i === s.j) { fill = 'var(--c-warn-bg)'; stroke = 'var(--c-warn)'; sw = 2; }
        else if (i === s.p) { fill = 'var(--c-key-bg)'; stroke = 'var(--c-accent)'; sw = 2; }
        else { fill = 'var(--c-panel-2)'; stroke = 'var(--c-line)'; sw = 1; }

        arrG.appendChild(box(x, ARR_Y, cellW() - 6, 38, fill, stroke, 6, sw));
        // 下标（0 基）
        arrG.appendChild(tSans(x + (cellW() - 6) / 2, ARR_Y - 8, String(i), 'var(--c-ink-soft)', false, 'middle', 10.5));
        // 元素值
        arrG.appendChild(tCode(x + (cellW() - 6) / 2, ARR_Y + 25, String(s.arr[i]),
          (i === s.q) ? '#fff' : 'var(--c-ink)', true, 'middle', 16));
      }
      /* 区间标记 */
      if (s.r >= s.p) {
        var x1 = cellX(s.p), x2 = cellX(s.r) + cellW() - 6;
        arrG.appendChild(mk('rect', {
          x: x1 - 3, y: ARR_Y - 22, width: x2 - x1 + 6, height: 3, rx: 1.5, fill: 'var(--c-accent-2)'
        }));
        arrG.appendChild(tSans((x1 + x2) / 2, ARR_Y - 28, '当前搜索区间 A[' + s.p + '..' + s.r + ']',
          'var(--c-accent-2)', true, 'middle', 10.5));
      }

      /* 指针标注 */
      while (ptrG.firstChild) { ptrG.removeChild(ptrG.firstChild); }
      function ptr(i, label, color) {
        if (i < 0 || i >= s.arr.length) { return; }
        var cx = cellX(i) + (cellW() - 6) / 2;
        ptrG.appendChild(tCode(cx, ARR_Y + 58, label, color, true, 'middle', 12));
        ptrG.appendChild(mk('path', {
          d: 'M' + cx + ' ' + (ARR_Y + 46) + ' l -4 6 l 8 0 z', fill: color
        }));
      }
      ptr(s.p, '\u2191 p', 'var(--c-accent)');
      if (s.r >= 0) { ptr(s.r, '\u2191 r', 'var(--c-accent-2)'); }
      if (s.j >= 0 && s.j !== s.p && s.j !== s.r) { ptr(s.j, '\u2191 j', 'var(--c-warn)'); }
      if (s.q >= 0) { ptr(s.q, '\u2191 q', 'var(--c-accent)'); }

      /* 信息条 */
      while (infoG.firstChild) { infoG.removeChild(infoG.firstChild); }
      var infoY = ARR_Y + 88;
      infoG.appendChild(box(12, infoY, 596, 62, 'var(--c-panel-2)', 'var(--c-line)', 8));
      var pieces = [];
      pieces.push('p = ' + s.p + '　r = ' + s.r);
      if (s.q >= 0) { pieces.push('q = ' + s.q + '　i = q\u2212p+1 = ' + (s.q - s.p + 1)); }
      if (s.pv != null) { pieces.push('pivot = ' + s.pv); }
      pieces.push('k = ' + K);
      infoG.appendChild(tCode(28, infoY + 24, pieces.join('　　'), 'var(--c-ink)', true, 'start', 12.5));
      infoG.appendChild(tSans(28, infoY + 46,
        s.q >= 0 ? (K === s.q - s.p + 1 ? '判定：k = i，命中基准，直接返回' :
          (K < s.q - s.p + 1 ? '判定：k < i，只递归左半段' : '判定：k > i，只递归右半段，k 减去 i')) :
          '判定：划分进行中',
        'var(--c-hot)', true, 'start', 11.5));

      if (cap) { cap.innerHTML = '<b>第 ' + (idx + 1) + '/' + steps.length + ' 步</b>　' + s.txt; }
    }

    return {
      reset: function () { idx = 0; render(); },
      prev: function () { if (idx > 0) { idx--; render(); } },
      next: function () { if (idx < steps.length - 1) { idx++; render(); } }
    };
  });
})();
