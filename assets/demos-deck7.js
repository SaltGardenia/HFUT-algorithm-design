/* ============================================================================
   算法复习手册 · L6 动态规划 —— 动画脚本（deck7）
   ----------------------------------------------------------------------------
   本文件注册 4 个动画，由 assets/handbook.js 统一驱动（data-demo 名必须同名）：
     rod-cutting     钢条切割：n = 4，p = [1,5,8,9]（PPT 图 15-1 前 4 项），
                     自底向上填 r[0..4] 与 s[1..4]，最后回溯出方案 2+2，共 15 步
     matrix-chain    矩阵链乘法：P = (30,35,15,5,10,20,25)，m 表按链长递增填充，
                     末步给出 m(1,6) = 15125 与括号化方案，共 17 步
     lcs-table       LCS：x = ABCBDAB、y = BDCABA，c 表逐行填充 + b 表回溯，
                     末步给出 BCBA（长度 4），共 18 步
     assembly-line   装配线调度：f1/f2 逐站填充，末步给出 f* = 38 与最快路径，共 14 步
   所有数值均已用独立 Python / C++ 程序按递推式复算，与 PPT 原表一致。
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

  /** 画一个带边框的方框；value 非空时在中心写值，hl 取值 hot / ok / key / dep / null */
  function box(parent, x, y, w, h, value, hl) {
    var fill = 'var(--c-panel-2)', stroke = 'var(--c-line)', sw = 1.4;
    if (hl === 'hot') { fill = 'var(--c-warn-bg)'; stroke = 'var(--c-hot)'; sw = 2.4; }
    else if (hl === 'ok') { fill = 'var(--c-tip-bg)'; stroke = 'var(--c-ok)'; sw = 1.8; }
    else if (hl === 'key') { fill = 'var(--c-key-bg)'; stroke = 'var(--c-accent)'; sw = 2.0; }
    else if (hl === 'dep') { fill = '#eef2ff'; stroke = 'var(--c-accent-2)'; sw = 1.8; }
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

  /* ==========================================================================
     Demo 1：钢条切割 rod-cutting
     n = 4，p[1..4] = 1, 5, 8, 9（PPT 图 15-1 的前 4 项）；
     自底向上求解 r[0..4]，同时记 s[1..4]；末三步回溯出方案 2+2
     ========================================================================== */
  HB.register('rod-cutting', function (root) {
    var stage = root.querySelector('.demo-stage');       // 动画画布
    var cap = root.querySelector('.demo-cap');           // 底部解说

    var N = 4;                                           // 钢条长度 n = 4
    var P = [0, 1, 5, 8, 9];                             // p[1..4]，下标 0 不用
    var R = [], S = [];                                  // r 表与 s 表
    var F = [];                                          // 全部帧
    var idx = 0;                                         // 当前帧下标

    var CX = 132, CW = 66, CG = 8;                       // 单元格起点 / 宽 / 间距
    var Y_P = 64, Y_R = 146, Y_S = 216;                  // 三行的纵坐标

    buildFrames();                                       // 先把 15 帧算好

    /** 生成全部帧：初始化 → 10 次 (j,i) 枚举 → 3 步回溯 → 1 步总结 */
    function buildFrames() {
      var j, i, k, q, best, v, cands;

      R = [0, null, null, null, null];                   // r[0] = 0，其余"未计算"
      S = [null, null, null, null, null];                // s[j] 全部未定
      F.push({
        phase: 'init', j: 0, i: 0, r: R.slice(), s: S.slice(), cands: [], plan: '',
        desc: '初始状态：p = [1, 5, 8, 9]（i = 1..4），r[0] = 0 是唯一已知项，' +
              '其余 r[1..4] 与 s[1..4] 都还空着。接下来按 j = 1 → 4（逆拓扑序）逐格填。'
      });

      for (j = 1; j <= N; ++j) {                         // 按长度 j 递增
        q = -Infinity; best = 0; cands = [];
        for (i = 1; i <= j; ++i) {                       // 枚举第一段长度 i
          v = P[i] + R[j - i];                           // 首段 + 剩余部分（查表）
          cands.push({ i: i, v: v, best: v > q });
          if (v > q) { q = v; best = i; }
          F.push({
            phase: 'fill', j: j, i: i, r: R.slice(), s: S.slice(),
            cands: cands.slice(), plan: '',
            desc: 'j = ' + j + '，i = ' + i + '：候选 = p[' + i + '] + r[' + (j - i) + '] = ' +
                  P[i] + ' + ' + R[j - i] + ' = ' + v + '；当前最大值 q = ' + q +
                  (v === q ? '（更新最大值，s[' + j + '] = ' + best + '）' : '（不更优，保持不变）') + '。'
          });
        }
        R[j] = q; S[j] = best;                           // 定下 r[j] 与 s[j]
      }

      /* ---- 填表结束：先回头核对 8 种方案，确认 r[4] = 10 确实是最大值 ---- */
      F.push({
        phase: 'plan', j: 0, i: 0, r: R.slice(), s: S.slice(), cands: [], plan: '',
        desc: '表已填完：r = [0, 1, 5, 8, 10]、s = [–, 1, 2, 3, 2]。回头核对 8 种方案：' +
              '4 → 9、1+3 → 9、2+2 → 10、3+1 → 9、1+1+2 → 7、1+2+1 → 7、2+1+1 → 7、1+1+1+1 → 4 —— ' +
              '最大值 10 与 r[4] 一致。'
      });

      /* ---- 回溯：s[4] = 2 → 2，s[2] = 2 → 2，结束 ---- */
      F.push({
        phase: 'plan', j: 0, i: 0, r: R.slice(), s: S.slice(), cands: [], plan: '2',
        desc: '表填完：r = [0, 1, 5, 8, 10]、s = [–, 1, 2, 3, 2]。开始回溯：s[4] = 2，' +
              '说明最优方案的第一段切 2 英寸，剩余 4 − 2 = 2 英寸。'
      });
      F.push({
        phase: 'plan', j: 0, i: 0, r: R.slice(), s: S.slice(), cands: [], plan: '2 + 2',
        desc: '剩余长度 2：s[2] = 2，再切一段 2 英寸，剩余 2 − 2 = 0，回溯结束。方案 = 2 + 2。'
      });
      F.push({
        phase: 'done', j: 0, i: 0, r: R.slice(), s: S.slice(), cands: [], plan: '2 + 2',
        desc: '回溯完成：s[4] = 2 → 2 + 2 = 4，总收益 p[2] + p[2] = 5 + 5 = 10 = r[4]。' +
              '整个算法只做了 10 次加法（Σ j = 1+2+3+4），时间 Θ(n²)、空间 Θ(n)；' +
              '而朴素递归要展开 2⁴ = 16 个调用结点、8 个叶结点。'
      });
    }

    /** 画出某一帧 */
    function render() {
      var f = F[idx], k, i, v, candLines = [], line, hl;
      HB.clear(stage);
      var svg = HB.svgRoot(900, 380, '钢条切割 n=4 的自底向上填表演示：r 表与 s 表逐格填充并回溯方案');
      stage.appendChild(svg);

      add(svg, 'text', { x: 24, y: 26, 'class': 'tx-b' },
        '钢条切割：n = 4，p = [1, 5, 8, 9]，自底向上求 r[0..4]（第 ' + (idx + 1) + ' / ' + F.length + ' 步）');
      add(svg, 'text', { x: 24, y: 46, 'class': 'tx-sm' },
        'r[j] = 长度 j 的最大收益；s[j] = 该长度的最优方案里第一段切多长');

      /* ---- 第一行：价格表 ---- */
      add(svg, 'text', { x: 24, y: Y_P + 22, 'class': 'tx' }, '价格 p[i]');
      for (i = 1; i <= N; ++i) {
        hl = (f.phase === 'fill' && f.i === i) ? 'hot' : null;
        box(svg, CX + (i - 1) * (CW + CG), Y_P, CW, 32, P[i], hl);
        add(svg, 'text', { x: CX + (i - 1) * (CW + CG) + CW / 2, y: Y_P - 6, 'class': 'tx-sm', 'text-anchor': 'middle' }, 'i=' + i);
      }

      /* ---- 第二行：r[0..4] ---- */
      add(svg, 'text', { x: 24, y: Y_R + 22, 'class': 'tx' }, 'r[0..4]');
      for (k = 0; k <= N; ++k) {
        hl = null;
        if (f.phase === 'fill') {
          if (k === f.j - f.i) { hl = 'dep'; }                    // 本步要查的 r[j−i]
          if (k === f.j) { hl = 'hot'; }                          // 本步要定的 r[j]
        }
        if (f.phase === 'plan' && (k === 4 || k === 2)) { hl = 'ok'; }
        box(svg, CX + k * (CW + CG), Y_R, CW, 32, f.r[k] === null ? '?' : f.r[k], hl);
        add(svg, 'text', { x: CX + k * (CW + CG) + CW / 2, y: Y_R - 6, 'class': 'tx-sm', 'text-anchor': 'middle' }, 'j=' + k);
      }

      /* ---- 第三行：s[1..4] ---- */
      add(svg, 'text', { x: 24, y: Y_S + 22, 'class': 'tx' }, 's[1..4]');
      for (k = 1; k <= N; ++k) {
        hl = (f.phase === 'fill' && k === f.j) ? 'hot' : null;
        if (f.phase === 'plan' && f.s[k] !== null) { hl = 'ok'; }
        box(svg, CX + k * (CW + CG), Y_S, CW, 32, f.s[k] === null ? '?' : f.s[k], hl);
      }

      /* ---- 右侧面板：本步的候选值 ---- */
      add(svg, 'rect', { x: 496, y: 58, width: 380, height: 210, rx: 8, fill: 'var(--c-panel)', stroke: 'var(--c-line)', 'stroke-width': 1.2 });
      add(svg, 'text', { x: 512, y: 82, 'class': 'tx tx-b' },
        f.phase === 'fill' ? ('第 j = ' + f.j + ' 轮：枚举 i = 1..' + f.j) : '表的最终状态');
      for (k = 0; k < f.cands.length; ++k) {
        v = f.cands[k];
        line = 'i = ' + v.i + '：p[' + v.i + '] + r[' + (f.j - v.i) + '] = ' + P[v.i] + ' + ' +
               f.r[f.j - v.i] + ' = ' + v.v + (v.best ? '  ← 目前最大' : '');
        add(svg, 'text', { x: 512, y: 106 + k * 22, 'class': 'tx-sm' + (v.best ? ' tx-b' : ''), fill: v.best ? 'var(--c-hot)' : 'var(--c-ink-soft)' }, line);
      }
      if (f.phase === 'fill') {
        add(svg, 'text', { x: 512, y: 106 + f.cands.length * 22 + 10, 'class': 'tx-sm' },
          'r[' + f.j + '] 与 s[' + f.j + '] 要等 i 枚举完才定下来');
      } else {
        add(svg, 'text', { x: 512, y: 106, 'class': 'tx-sm' }, 'r = [0, 1, 5, 8, 10]');
        add(svg, 'text', { x: 512, y: 128, 'class': 'tx-sm' }, 's = [–, 1, 2, 3, 2]');
        add(svg, 'text', { x: 512, y: 150, 'class': 'tx-sm' }, 'r[4] = 10 = p2 + p2 = 5 + 5');
        add(svg, 'text', { x: 512, y: 172, 'class': 'tx-sm' }, '回溯：n = 4 → s[4] = 2');
        add(svg, 'text', { x: 512, y: 194, 'class': 'tx-sm' }, '　　　n = 2 → s[2] = 2 → n = 0');
      }

      /* ---- 底部：方案与公式 ---- */
      add(svg, 'line', { x1: 24, y1: 282, x2: 876, y2: 282, stroke: 'var(--c-line-soft)' });
      add(svg, 'text', { x: 24, y: 306, 'class': 'tx' },
        '递推式：r[j] = max{ p[i] + r[j−i] }（1 ≤ i ≤ j），r[0] = 0');
      add(svg, 'text', { x: 24, y: 332, 'class': 'tx' + (f.phase === 'done' ? ' tx-b' : '') },
        '当前最优方案：' + (f.plan === '' ? '（尚未回溯）' : f.plan));
      add(svg, 'text', { x: 24, y: 356, 'class': 'tx-sm' },
        '复杂度：时间 Θ(n²) = 10 次加法（n = 4），空间 Θ(n)；朴素递归 Θ(2ⁿ) = 16 个调用结点');

      if (cap) { cap.innerHTML = '第 ' + (idx + 1) + ' / ' + F.length + ' 步 · ' + f.desc; }
    }

    return {
      steps: F.length,                                  // 总步数 15
      reset: function () { idx = 0; render(); },
      prev: function () { if (idx > 0) { idx -= 1; } render(); },
      next: function () { if (idx < F.length - 1) { idx += 1; } render(); }
    };
  });

  /* ==========================================================================
     Demo 2：矩阵链乘法 matrix-chain
     P = (30,35,15,5,10,20,25)，m 表按链长 L = 2..6 递增填充，同时记 s 表
     ========================================================================== */
  HB.register('matrix-chain', function (root) {
    var stage = root.querySelector('.demo-stage');
    var cap = root.querySelector('.demo-cap');

    var P = [30, 35, 15, 5, 10, 20, 25];                 // p0..p6，n = 6 个矩阵
    var N = 6;
    var M = [], S = [];                                  // m 表与 s 表（下标 1..6）
    var F = [];
    var idx = 0;

    var X0 = 128, Y0 = 92, CW = 84, CH = 44;             // 表格起点与单元格尺寸

    init();                                              // 先算出 m / s 两张表
    buildFrames();                                       // 再展开成 17 帧

    /** 按 PPT 第 28 页的伪代码算出 m 表与 s 表 */
    function init() {
      var i, j, k, L, q;
      for (i = 0; i <= N + 1; ++i) { M.push([]); S.push([]); for (j = 0; j <= N + 1; ++j) { M[i].push(0); S[i].push(0); } }
      for (i = 1; i <= N; ++i) { M[i][i] = 0; }                    // 对角线为 0
      for (L = 2; L <= N; ++L) {
        for (i = 1; i <= N - L + 1; ++i) {
          j = i + L - 1;
          M[i][j] = Infinity;
          for (k = i; k < j; ++k) {
            q = M[i][k] + M[k + 1][j] + P[i - 1] * P[k] * P[j];
            if (q < M[i][j]) { M[i][j] = q; S[i][j] = k; }
          }
        }
      }
    }

    /** 生成 17 帧：对角线 → L=2（5 帧）→ L=3（4 帧）→ L=4（3 帧）→ L=5（2 帧）→ L=6（1 帧）→ 总结 */
    function buildFrames() {
      var L, i, j, k, q, cands, best;
      F.push({
        phase: 'init', i: 0, j: 0, L: 1, cands: [],
        desc: '初始化：m[i][i] = 0（i = 1..6），对角线 6 格全部为 0。之后按链长 L = 2 → 6 逐条反斜线填充。'
      });
      for (L = 2; L <= N; ++L) {
        for (i = 1; i <= N - L + 1; ++i) {
          j = i + L - 1;
          cands = []; best = Infinity;
          for (k = i; k < j; ++k) {
            q = M[i][k] + M[k + 1][j] + P[i - 1] * P[k] * P[j];
            cands.push({ k: k, a: M[i][k], b: M[k + 1][j], mul: P[i - 1] * P[k] * P[j], q: q });
            if (q < best) { best = q; }
          }
          F.push({
            phase: 'fill', i: i, j: j, L: L, cands: cands, best: best,
            desc: 'L = ' + L + '，计算 m[' + i + ',' + j + ']：' +
                  'k = ' + S[i][j] + ' 最优，m[' + i + ',' + j + '] = ' + M[i][j] +
                  '；候选值 ' + cands.map(function (c) { return 'k=' + c.k + '→' + c.q; }).join('、') +
                  '，记 s[' + i + ',' + j + '] = ' + S[i][j] + '。'
          });
        }
      }
      F.push({
        phase: 'done', i: 1, j: N, L: N, cands: [],
        desc: 'm[1,6] = 15125，s[1,6] = 3。沿 s 表递归展开得完全括号化方案 ((A1(A2A3))((A4A5)A6))；时间 Θ(n³) = Θ(6³)，空间 Θ(n²)。'
      });
    }

    /** 画出某一帧 */
    function render() {
      var f = F[idx], i, j, hl, txt, c, dep;
      HB.clear(stage);
      var svg = HB.svgRoot(940, 430, '矩阵链乘法的 m 表按链长递增填充演示，末步给出 m(1,6)=15125');
      stage.appendChild(svg);

      add(svg, 'text', { x: 24, y: 26, 'class': 'tx-b' },
        '矩阵链乘法：P = (30, 35, 15, 5, 10, 20, 25)，m 表按链长 L 递增填充（第 ' + (idx + 1) + ' / ' + F.length + ' 步）');
      add(svg, 'text', { x: 24, y: 46, 'class': 'tx-sm' },
        'm[i,j] = min{ m[i,k] + m[k+1,j] + p(i−1)·p(k)·p(j) }（i ≤ k < j）；单元格里小字是 s[i,j]');

      /* ---- 表头 ---- */
      add(svg, 'text', { x: X0 - 14, y: Y0 - 12, 'class': 'tx-sm', 'text-anchor': 'end' }, 'i \\ j');
      for (j = 1; j <= N; ++j) {
        add(svg, 'text', { x: X0 + (j - 1) * CW + CW / 2, y: Y0 - 12, 'class': 'tx-sm', 'text-anchor': 'middle' }, 'j=' + j);
      }
      for (i = 1; i <= N; ++i) {
        add(svg, 'text', { x: X0 - 8, y: Y0 + (i - 1) * CH + CH / 2 + 5, 'class': 'tx-sm', 'text-anchor': 'end' }, 'i=' + i);
      }

      /* ---- 单元格 ---- */
      for (i = 1; i <= N; ++i) {
        for (j = i; j <= N; ++j) {
          hl = null;
          if (f.phase === 'fill') {
            if (i === f.i && j === f.j) { hl = 'hot'; }
            else if (j < f.j && j - i + 1 < f.L && M[i][j] !== Infinity) { hl = 'ok'; }
            else if (M[i][j] !== 0 && (j - i + 1) < f.L) { hl = 'ok'; }
          }
          if (f.phase === 'done') { hl = (i === 1 && j === N) ? 'hot' : 'ok'; }
          txt = (i === j) ? '0' : String(M[i][j]);
          box(svg, X0 + (j - 1) * CW, Y0 + (i - 1) * CH, CW - 4, CH - 4, txt, hl);
          if (i < j) {
            add(svg, 'text', {
              x: X0 + (j - 1) * CW + (CW - 4) / 2, y: Y0 + (i - 1) * CH + CH - 8,
              'class': 'tx-sm', 'text-anchor': 'middle'
            }, 's=' + S[i][j]);
          }
        }
      }

      /* ---- 依赖关系提示：标出本步用到的两格 ---- */
      if (f.phase === 'fill' && f.cands.length > 0) {
        var kk = S[f.i][f.j];
        add(svg, 'text', { x: 24, y: Y0 + 6 * CH + 16, 'class': 'tx-sm' },
          '本步用到的表项：m[' + f.i + ',' + kk + '] = ' + M[f.i][kk] + '、m[' + (kk + 1) + ',' + f.j + '] = ' + M[kk + 1][f.j] +
          '；乘积项 p' + (f.i - 1) + '·p' + kk + '·p' + f.j + ' = ' + P[f.i - 1] * P[kk] * P[f.j]);
      } else {
        add(svg, 'text', { x: 24, y: Y0 + 6 * CH + 16, 'class': 'tx-sm' },
          '对角线 6 格（m[i][i] = 0）已填好；每条反斜线对应一个链长 L');
      }

      /* ---- 右侧面板：候选值 ---- */
      add(svg, 'rect', { x: 24, y: Y0 + 6 * CH + 28, width: 892, height: 44, rx: 8, fill: 'var(--c-panel)', stroke: 'var(--c-line)', 'stroke-width': 1.2 });
      if (f.phase === 'fill') {
        var parts = [];
        for (c = 0; c < f.cands.length; ++c) {
          dep = f.cands[c];
          parts.push('k=' + dep.k + ': ' + dep.a + '+' + dep.b + '+' + dep.mul + '=' + dep.q);
        }
        add(svg, 'text', { x: 38, y: Y0 + 6 * CH + 52, 'class': 'tx-sm' },
          '候选：' + parts.join('　|　') + '　⇒ 取最小 ' + f.best);
      } else if (f.phase === 'done') {
        add(svg, 'text', { x: 38, y: Y0 + 6 * CH + 52, 'class': 'tx' },
          'm(1,6) = 15125（最优），s(1,6) = 3；方案 ((A1(A2A3))((A4A5)A6))；m(2,5) = 7125、s(2,5) = 3');
      } else {
        add(svg, 'text', { x: 38, y: Y0 + 6 * CH + 52, 'class': 'tx-sm' },
          '提示：m(2,5) 的三个候选是 13000（k=2）、7125（k=3）、11375（k=4），取 7125');
      }

      if (cap) { cap.innerHTML = '第 ' + (idx + 1) + ' / ' + F.length + ' 步 · ' + f.desc; }
    }

    return {
      steps: F.length,                                  // 总步数 17
      reset: function () { idx = 0; render(); },
      prev: function () { if (idx > 0) { idx -= 1; } render(); },
      next: function () { if (idx < F.length - 1) { idx += 1; } render(); }
    };
  });

  /* ==========================================================================
     Demo 3：LCS lcs-table
     x = ABCBDAB（m = 7）、y = BDCABA（n = 6）；c 表逐行填充，b 表回溯出 BCBA
     ========================================================================== */
  HB.register('lcs-table', function (root) {
    var stage = root.querySelector('.demo-stage');
    var cap = root.querySelector('.demo-cap');

    var XS = ' ABCBDAB';                                 // 下标从 1 开始，X[1..7]
    var YS = ' BDCABA';                                  // 下标从 1 开始，Y[1..6]
    var M = 7, N = 6;
    var C = [], B = [];                                  // c 表与 b 表（0 左上 / 1 上 / 2 左）
    var F = [];
    var idx = 0;

    var X0 = 158, Y0 = 100, CW = 74, CH = 34;             // 表格起点与单元格尺寸

    init();                                              // 先算 c / b 两张表
    buildFrames();                                       // 再展开成 18 帧

    /** 按 PPT 第 71 页的 LCS-LENGTH 伪代码填表 */
    function init() {
      var i, j;
      for (i = 0; i <= M; ++i) { C.push([]); B.push([]); for (j = 0; j <= N; ++j) { C[i].push(0); B[i].push(-1); } }
      for (i = 1; i <= M; ++i) {
        for (j = 1; j <= N; ++j) {
          if (XS.charAt(i) === YS.charAt(j)) { C[i][j] = C[i - 1][j - 1] + 1; B[i][j] = 0; }
          else if (C[i - 1][j] >= C[i][j - 1]) { C[i][j] = C[i - 1][j]; B[i][j] = 1; }
          else { C[i][j] = C[i][j - 1]; B[i][j] = 2; }
        }
      }
    }

    /** 生成 18 帧：初始化 + 7 行 + 结论 + 8 步回溯 + 总结 */
    function buildFrames() {
      var i, j, path, cells;
      F.push({
        phase: 'init', rows: 0, cur: null, showArrow: false, path: [], result: '',
        desc: '初始化：c[i,0] = 0（i = 1..7，X 的每个前缀与空串的 LCS 长度为 0）、c[0,j] = 0（j = 0..6）。' +
              'x = ABCBDAB（m = 7），y = BDCABA（n = 6）。'
      });
      for (i = 1; i <= M; ++i) {
        F.push({
          phase: 'row', rows: i, cur: [i, N], showArrow: false, path: [], result: '',
          desc: '填完第 i = ' + i + ' 行（x[' + i + '] = ' + XS.charAt(i) + '）：' +
                'c[' + i + ',1..6] = [' + C[i].slice(1).join(', ') + ']。' +
                (i === 1 ? '只有 y[4] = A 与 x[1] = A 相等，所以 c[1,4] = c[0,3] + 1 = 1。' : '')
        });
      }
      F.push({
        phase: 'row', rows: 7, cur: [7, 6], showArrow: true, path: [], result: '',
        desc: 'c[7,6] = 4 —— 这就是 |LCS(x,y)|。b 表现在也填满了：↖ 表示「末字符相等，取左上 + 1」，' +
              '↑ 表示「上方不小于左方，继承上方」，← 表示「左方更大，继承左方」。'
      });

      /* ---- 回溯：从 (7,6) 走到 (1,0) ---- */
      path = [[7, 6]];
      var ci = 7, cj = 6, out = [];
      var notes = {
        '7,6': 'x[7] = B ≠ y[6] = A，且 c[6,6] = 4 ≥ c[7,5] = 4，所以 b[7,6] = ↑，丢 x[7]，走到 (6,6)。',
        '6,6': 'x[6] = A = y[6] = A，b[6,6] = ↖，把 A 收进 LCS，走到 (5,5)。',
        '5,5': 'x[5] = D ≠ y[5] = B，且 c[4,5] = 3 ≥ c[5,4] = 2，b[5,5] = ↑，走到 (4,5)。',
        '4,5': 'x[4] = B = y[5] = B，b[4,5] = ↖，把 B 收进 LCS，走到 (3,4)。',
        '3,4': 'x[3] = C ≠ y[4] = A，且 c[2,4] = 1 < c[3,3] = 2，b[3,4] = ←，走到 (3,3)。',
        '3,3': 'x[3] = C = y[3] = C，b[3,3] = ↖，把 C 收进 LCS，走到 (2,2)。',
        '2,2': 'x[2] = B ≠ y[2] = D，且 c[1,2] = 0 < c[2,1] = 1，b[2,2] = ←，走到 (2,1)。',
        '2,1': 'x[2] = B = y[1] = B，b[2,1] = ↖，把 B 收进 LCS，走到 (1,0)，回溯结束。'
      };
      while (ci > 0 && cj > 0) {
        var key = ci + ',' + cj;
        if (B[ci][cj] === 0) { out.push(XS.charAt(ci)); ci -= 1; cj -= 1; }
        else if (B[ci][cj] === 1) { ci -= 1; }
        else { cj -= 1; }
        path.push([ci, cj]);
        F.push({
          phase: 'back', rows: 7, cur: [ci, cj], showArrow: true, path: path.slice(),
          result: out.slice().reverse().join(''),
          desc: notes[key] + '当前已收集（逆序）：' + (out.length ? out.join('') : '（空）')
        });
      }
      F.push({
        phase: 'done', rows: 7, cur: null, showArrow: true, path: path.slice(), result: 'BCBA',
        desc: '倒序输出得到 LCS = BCBA，长度 4 = c[7,6]（BDAB 也是长度为 4 的 LCS）。' +
              '回溯 O(m+n) = O(13) 步；填表 Θ(mn) = Θ(42) 个表项，每项常量工作。'
      });
    }

    /** 把 b 表的编码翻译成箭头字符 */
    function arrowOf(v) {
      if (v === 0) { return '↖'; }
      if (v === 1) { return '↑'; }
      if (v === 2) { return '←'; }
      return '';
    }

    /** 判断某格是否在回溯路径上 */
    function onPath(path, i, j) {
      for (var t = 0; t < path.length; ++t) {
        if (path[t][0] === i && path[t][1] === j) { return true; }
      }
      return false;
    }

    /** 画出某一帧 */
    function render() {
      var f = F[idx], i, j, hl, val;
      HB.clear(stage);
      var svg = HB.svgRoot(900, 430, 'LCS 的 c 表逐行填充与 b 表回溯演示，最终 LCS 为 BCBA');
      stage.appendChild(svg);

      add(svg, 'text', { x: 24, y: 24, 'class': 'tx-b' },
        'LCS：x = ABCBDAB（m = 7）、y = BDCABA（n = 6），c 表逐行填充（第 ' + (idx + 1) + ' / ' + F.length + ' 步）');
      add(svg, 'text', { x: 24, y: 44, 'class': 'tx-sm' },
        'c[i,j] = c[i−1,j−1] + 1（x[i] = y[j]）；否则 max{ c[i−1,j], c[i,j−1] }。小字 = b[i,j] 的箭头');

      /* ---- 表头 ---- */
      for (j = 1; j <= N; ++j) {
        add(svg, 'text', { x: X0 - 40 + j * CW, y: Y0 - 24, 'class': 'tx-b', 'text-anchor': 'middle' }, 'j=' + j);
        add(svg, 'text', { x: X0 - 40 + j * CW, y: Y0 - 8, 'class': 'tx-sm', 'text-anchor': 'middle' }, YS.charAt(j));
      }
      add(svg, 'text', { x: X0 - 40, y: Y0 - 8, 'class': 'tx-sm', 'text-anchor': 'middle' }, 'j=0');
      for (i = 1; i <= M; ++i) {
        add(svg, 'text', { x: X0 - 52, y: Y0 + i * CH + CH / 2 + 5, 'class': 'tx-b', 'text-anchor': 'end' }, XS.charAt(i));
        add(svg, 'text', { x: X0 - 14, y: Y0 + i * CH + CH / 2 + 5, 'class': 'tx-sm', 'text-anchor': 'end' }, 'i=' + i);
      }

      /* ---- 单元格 ---- */
      for (i = 0; i <= M; ++i) {
        for (j = 0; j <= N; ++j) {
          hl = null;
          if (i === 0 || j === 0) { hl = null; }
          else if (f.phase === 'row' && f.rows >= i) { hl = (i === f.rows) ? 'key' : 'ok'; }
          if (f.cur && f.cur[0] === i && f.cur[1] === j) { hl = 'hot'; }
          else if (f.path && f.path.length && onPath(f.path, i, j)) { hl = 'ok'; }
          val = (i === 0 || j === 0) ? 0 : ((f.rows >= i) ? C[i][j] : '·');
          box(svg, X0 - 40 + j * CW, Y0 + i * CH, CW - 6, CH - 6, val, hl);
          if (f.showArrow && i >= 1 && j >= 1) {
            add(svg, 'text', {
              x: X0 - 40 + j * CW + CW - 16, y: Y0 + i * CH + 12,
              'class': 'tx-sm', 'text-anchor': 'middle', fill: 'var(--c-accent-2)'
            }, arrowOf(B[i][j]));
          }
        }
      }

      /* ---- 右侧说明 ---- */
      add(svg, 'rect', { x: 700, y: 60, width: 176, height: 150, rx: 8, fill: 'var(--c-panel)', stroke: 'var(--c-line)', 'stroke-width': 1.2 });
      add(svg, 'text', { x: 714, y: 84, 'class': 'tx tx-b' }, '状态');
      add(svg, 'text', { x: 714, y: 110, 'class': 'tx-sm' }, '已填行数：' + f.rows + ' / 7');
      add(svg, 'text', { x: 714, y: 134, 'class': 'tx-sm' }, 'c[7,6] = ' + (f.rows >= 7 ? C[7][6] : '待定'));
      add(svg, 'text', { x: 714, y: 158, 'class': 'tx-sm' }, '已收集：' + (f.result ? f.result : '（空）'));
      add(svg, 'text', { x: 714, y: 182, 'class': 'tx-sm' }, '回溯步数：' + Math.max(0, f.path.length - 1));
      add(svg, 'text', { x: 714, y: 202, 'class': 'tx-sm' }, '↖ = 左上，↑ = 上，← = 左');

      /* ---- 底部结论 ---- */
      add(svg, 'line', { x1: 24, y1: 372, x2: 876, y2: 372, stroke: 'var(--c-line-soft)' });
      add(svg, 'text', { x: 24, y: 396, 'class': 'tx' },
        f.phase === 'done'
          ? 'LCS = BCBA（长度 4）；填表 Θ(mn) = Θ(42)，回溯 O(m+n) = O(13)'
          : '答案在右下角：c[7,6]；回溯时沿 b 表从 (7,6) 走到 (1,0)');
      add(svg, 'text', { x: 24, y: 418, 'class': 'tx-sm' },
        '不同子问题只有 (m+1)(n+1) = 8×7 = 56 个，而朴素递归的树高 m+n = 13、工作量指数');

      if (cap) { cap.innerHTML = '第 ' + (idx + 1) + ' / ' + F.length + ' 步 · ' + f.desc; }
    }

    return {
      steps: F.length,                                  // 总步数 18
      reset: function () { idx = 0; render(); },
      prev: function () { if (idx > 0) { idx -= 1; } render(); },
      next: function () { if (idx < F.length - 1) { idx += 1; } render(); }
    };
  });

  /* ==========================================================================
     Demo 4：装配线调度 assembly-line
     a1/a2、t1/t2、e、x 取值与 PPT 第 82~89 页的 f / l 表自洽
     ========================================================================== */
  HB.register('assembly-line', function (root) {
    var stage = root.querySelector('.demo-stage');
    var cap = root.querySelector('.demo-cap');

    var A1 = [0, 7, 9, 3, 4, 8, 4], A2 = [0, 8, 5, 6, 4, 5, 7];   // 两线的装配时间
    var T1 = [0, 2, 3, 1, 3, 4], T2 = [0, 2, 1, 2, 2, 1];         // 两线的换线传输时间
    var N = 6;                                                     // 6 个工作站
    var F1 = [], F2 = [], L1 = [], L2 = [];                        // f 表与 l 表
    var FR = [];                                                   // 帧数组
    var idx = 0;

    var X0 = 150, YB1 = 78, YB2 = 182, BW = 92, BH = 40, BG = 12;  // 站框的位置与尺寸

    init();                                                        // 先算出 f / l
    buildFrames();                                                 // 再展开成 14 帧

    /** 按 FASTEST-WAY 的递推式算出 f1、f2、l1、l2、f*、l* */
    function init() {
      var j;
      for (j = 0; j <= N; ++j) { F1.push(0); F2.push(0); L1.push(0); L2.push(0); }
      F1[1] = 2 + A1[1];                                           // e1 + a11 = 9
      F2[1] = 4 + A2[1];                                           // e2 + a21 = 12
      for (j = 2; j <= N; ++j) {
        if (F1[j - 1] + A1[j] <= F2[j - 1] + T2[j - 1] + A1[j]) { F1[j] = F1[j - 1] + A1[j]; L1[j] = 1; }
        else { F1[j] = F2[j - 1] + T2[j - 1] + A1[j]; L1[j] = 2; }
        if (F2[j - 1] + A2[j] <= F1[j - 1] + T1[j - 1] + A2[j]) { F2[j] = F2[j - 1] + A2[j]; L2[j] = 2; }
        else { F2[j] = F1[j - 1] + T1[j - 1] + A2[j]; L2[j] = 1; }
      }
    }

    /** 生成 14 帧：初始化 + 10 次逐站递推 + f* + 路径 + 总结 */
    function buildFrames() {
      var j;
      FR.push({
        phase: 'init', j: 1, line: 0, path: [],
        desc: '初始化第 1 站：f1[1] = e1 + a11 = 2 + 7 = 9，f2[1] = e2 + a21 = 4 + 8 = 12。' +
              '之后 j = 2 → 6 逐站递推，每站对两条线各做一次二选一。'
      });
      for (j = 2; j <= N; ++j) {
        FR.push({
          phase: 'fill', j: j, line: 1, path: [],
          desc: 'j = ' + j + '，线 1：min(f1[' + (j - 1) + ']+a1,' + j + ' = ' + F1[j - 1] + '+' + A1[j] + ' = ' + (F1[j - 1] + A1[j]) +
                '，f2[' + (j - 1) + ']+t2,' + (j - 1) + '+a1,' + j + ' = ' + F2[j - 1] + '+' + T2[j - 1] + '+' + A1[j] + ' = ' + (F2[j - 1] + T2[j - 1] + A1[j]) +
                ') → f1[' + j + '] = ' + F1[j] + '，l1[' + j + '] = ' + L1[j] + '。'
        });
        FR.push({
          phase: 'fill', j: j, line: 2, path: [],
          desc: 'j = ' + j + '，线 2：min(f2[' + (j - 1) + ']+a2,' + j + ' = ' + F2[j - 1] + '+' + A2[j] + ' = ' + (F2[j - 1] + A2[j]) +
                '，f1[' + (j - 1) + ']+t1,' + (j - 1) + '+a2,' + j + ' = ' + F1[j - 1] + '+' + T1[j - 1] + '+' + A2[j] + ' = ' + (F1[j - 1] + T1[j - 1] + A2[j]) +
                ') → f2[' + j + '] = ' + F2[j] + '，l2[' + j + '] = ' + L2[j] + '。'
        });
      }
      FR.push({
        phase: 'end', j: N, line: 0, path: [],
        desc: '出口比较：f1[6] + x1 = 35 + 3 = 38，f2[6] + x2 = 37 + 2 = 39，取较小者 → f* = 38，l* = 1。'
      });
      FR.push({
        phase: 'path', j: N, line: 1, path: [[1, 6], [2, 5], [2, 4], [1, 3], [2, 2], [1, 1]],
        desc: '回溯：l1[6] = 2 → 线 2 站 5；l2[5] = 2 → 线 2 站 4；l2[4] = 1 → 线 1 站 3；' +
              'l1[3] = 2 → 线 2 站 2；l2[2] = 1 → 线 1 站 1。'
      });
      FR.push({
        phase: 'done', j: N, line: 1, path: [[1, 6], [2, 5], [2, 4], [1, 3], [2, 2], [1, 1]],
        desc: '最快路径：线1站1 → 线2站2 → 线1站3 → 线2站4 → 线2站5 → 线1站6，总时间 38。' +
              '时间 Θ(n) = Θ(6)、空间 Θ(n)；蛮力法要枚举 Ω(2ⁿ) = Ω(64) 条路线。'
      });
    }

    /** 判断某站是否在最快路径上 */
    function onPath(path, line, j) {
      for (var t = 0; t < path.length; ++t) {
        if (path[t][0] === line && path[t][1] === j) { return true; }
      }
      return false;
    }

    /** 画出某一帧 */
    function render() {
      var f = FR[idx], j, hl1, hl2, y;
      HB.clear(stage);
      var svg = HB.svgRoot(940, 330, '装配线调度的 f1、f2 逐站填充与最快路径回溯演示，f*=38');
      stage.appendChild(svg);

      add(svg, 'text', { x: 24, y: 24, 'class': 'tx-b' },
        '装配线调度：2 条线 × 6 个工作站（第 ' + (idx + 1) + ' / ' + FR.length + ' 步）');
      add(svg, 'text', { x: 24, y: 44, 'class': 'tx-sm' },
        '框内 = 装配时间 a(i,j)；框下粗体 = 最快时间 f(i,j)；小字 = 前驱线号 l(i,j)');

      /* ---- 两条线的站框 ---- */
      add(svg, 'text', { x: 60, y: YB1 + 26, 'class': 'tx' }, '线 1');
      add(svg, 'text', { x: 60, y: YB2 + 26, 'class': 'tx' }, '线 2');
      for (j = 1; j <= N; ++j) {
        hl1 = null; hl2 = null;
        if (f.phase === 'fill' && f.j === j) { hl1 = (f.line === 1) ? 'hot' : null; hl2 = (f.line === 2) ? 'hot' : null; }
        if (f.path && f.path.length) {
          if (onPath(f.path, 1, j)) { hl1 = 'ok'; }
          if (onPath(f.path, 2, j)) { hl2 = 'ok'; }
        }
        if (f.phase === 'end') { hl1 = 'ok'; hl2 = 'ok'; }
        box(svg, X0 + (j - 1) * (BW + BG), YB1, BW, BH, A1[j], hl1);
        box(svg, X0 + (j - 1) * (BW + BG), YB2, BW, BH, A2[j], hl2);
        add(svg, 'text', { x: X0 + (j - 1) * (BW + BG) + BW / 2, y: YB1 - 8, 'class': 'tx-sm', 'text-anchor': 'middle' }, 'S1,' + j);
        add(svg, 'text', { x: X0 + (j - 1) * (BW + BG) + BW / 2, y: YB2 + BH + 22, 'class': 'tx-sm', 'text-anchor': 'middle' }, 'S2,' + j);
        /* f 值与 l 值（只显示已算出的） */
        if (j <= f.j) {
          add(svg, 'text', { x: X0 + (j - 1) * (BW + BG) + BW / 2, y: YB1 + BH + 18, 'class': 'tx tx-b', 'text-anchor': 'middle' }, 'f=' + F1[j]);
          add(svg, 'text', { x: X0 + (j - 1) * (BW + BG) + BW / 2, y: YB1 + BH + 33, 'class': 'tx-sm', 'text-anchor': 'middle' }, j === 1 ? 'l=–' : ('l=' + L1[j]));
          add(svg, 'text', { x: X0 + (j - 1) * (BW + BG) + BW / 2, y: YB2 - 20, 'class': 'tx tx-b', 'text-anchor': 'middle' }, 'f=' + F2[j]);
          add(svg, 'text', { x: X0 + (j - 1) * (BW + BG) + BW / 2, y: YB2 - 6, 'class': 'tx-sm', 'text-anchor': 'middle' }, j === 1 ? 'l=–' : ('l=' + L2[j]));
        } else {
          add(svg, 'text', { x: X0 + (j - 1) * (BW + BG) + BW / 2, y: YB1 + BH + 18, 'class': 'tx-sm', 'text-anchor': 'middle' }, 'f=?');
          add(svg, 'text', { x: X0 + (j - 1) * (BW + BG) + BW / 2, y: YB2 - 20, 'class': 'tx-sm', 'text-anchor': 'middle' }, 'f=?');
        }
      }

      /* ---- 换线传输时间（斜线标注） ---- */
      for (j = 1; j < N; ++j) {
        add(svg, 'line', {
          x1: X0 + (j - 1) * (BW + BG) + BW - 6, y1: YB1 + BH,
          x2: X0 + j * (BW + BG) + 6, y2: YB2,
          stroke: 'var(--c-accent-2)', 'stroke-width': 1.2, 'stroke-dasharray': '4 3'
        });
        add(svg, 'line', {
          x1: X0 + (j - 1) * (BW + BG) + BW - 6, y1: YB2,
          x2: X0 + j * (BW + BG) + 6, y2: YB1 + BH,
          stroke: 'var(--c-accent-2)', 'stroke-width': 1.2, 'stroke-dasharray': '4 3'
        });
        add(svg, 'text', { x: X0 + (j - 1) * (BW + BG) + BW + 4, y: YB1 + BH + 34, 'class': 'tx-sm' }, 't1=' + T1[j]);
        add(svg, 'text', { x: X0 + (j - 1) * (BW + BG) + BW + 4, y: YB2 - 34, 'class': 'tx-sm' }, 't2=' + T2[j]);
      }

      /* ---- 底部汇总 ---- */
      y = 268;
      add(svg, 'line', { x1: 24, y1: y, x2: 916, y2: y, stroke: 'var(--c-line-soft)' });
      add(svg, 'text', { x: 24, y: y + 24, 'class': 'tx' },
        'f1 = [' + F1.slice(1).join(', ') + ']　　f2 = [' + F2.slice(1).join(', ') + ']');
      add(svg, 'text', { x: 24, y: y + 46, 'class': 'tx' + (f.phase === 'end' || f.phase === 'done' || f.phase === 'path' ? ' tx-b' : '') },
        (f.phase === 'end' || f.phase === 'done' || f.phase === 'path')
          ? 'f* = min(35 + 3, 37 + 2) = 38，l* = 1'
          : '出口时间：f1[6] + x1 与 f2[6] + x2 取较小者（x1 = 3、x2 = 2）');
      add(svg, 'text', { x: 560, y: y + 24, 'class': 'tx-sm' },
        '时间 Θ(n)，空间 Θ(n)，蛮力 Ω(2ⁿ)');

      if (cap) { cap.innerHTML = '第 ' + (idx + 1) + ' / ' + FR.length + ' 步 · ' + f.desc; }
    }

    return {
      steps: FR.length,                                 // 总步数 14
      reset: function () { idx = 0; render(); },
      prev: function () { if (idx > 0) { idx -= 1; } render(); },
      next: function () { if (idx < FR.length - 1) { idx += 1; } render(); }
    };
  });
})();
