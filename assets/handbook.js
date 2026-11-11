/* ============================================================================
   算法复习手册 · 共享脚本
   职责：
     1) 依据 <main> 内的 h2/h3 自动生成侧边栏目录，并做滚动高亮
     2) 折叠 / 展开侧边栏（窄屏默认折叠）
     3) 统一接管所有 .demo 的动画播放控制，向 demo 脚本暴露 HB.register API
     4) 提供 SVG 绘图小工具，供 demos-*.js 复用
   全局暴露：window.HB
   ========================================================================== */
(function () {
  'use strict';

  var HB = window.HB = window.HB || {};
  HB.demos = HB.demos || {};

  /* ------------------------------------------------------------ 注册动画 */
  /**
   * 注册一个动画演示。
   * @param {string}   name  必须与 HTML 里 <div class="demo" data-demo="NAME"> 完全一致
   * @param {function} init  初始化函数，签名 init(root) -> { reset, prev, next, play? }
   *                         root 为该 .demo 元素
   */
  HB.register = function (name, init) {
    HB.demos[name] = init;
  };

  /* ------------------------------------------------------------ SVG 工具 */
  var NS = 'http://www.w3.org/2000/svg';

  /** 创建 SVG 元素：el('rect', {x:0, y:0, width:10}, '文本') */
  HB.svg = function (tag, attrs, text) {
    var node = document.createElementNS(NS, tag);
    if (attrs) {
      for (var k in attrs) {
        if (Object.prototype.hasOwnProperty.call(attrs, k) && attrs[k] != null) {
          node.setAttribute(k, String(attrs[k]));
        }
      }
    }
    if (text != null) { node.textContent = String(text); }
    return node;
  };

  /** 建一个 svg 根节点：HB.svgRoot(w, h, label) */
  HB.svgRoot = function (w, h, label) {
    var s = HB.svg('svg', {
      viewBox: '0 0 ' + w + ' ' + h,
      width: w, height: h,
      role: 'img',
      'aria-label': label || '算法演示图',
      preserveAspectRatio: 'xMidYMid meet'
    });
    s.style.maxWidth = w + 'px';
    s.style.width = '100%';
    return s;
  };

  /** 清空节点 */
  HB.clear = function (node) {
    while (node && node.firstChild) { node.removeChild(node.firstChild); }
  };

  /** 简易延时队列：HB.ticker(fn, intervalMs) -> {start, stop}，用于“播放” */
  HB.ticker = function (fn, intervalMs) {
    var id = null;
    return {
      start: function () {
        if (id === null) {
          id = window.setInterval(fn, intervalMs || 900);
          fn();
        }
      },
      stop: function () {
        if (id !== null) { window.clearInterval(id); id = null; }
      },
      get running() { return id !== null; }
    };
  };

  /* --------------------------------------------------- 自动生成侧边栏目录 */
  function buildToc() {
    var main = document.getElementById('content');
    var toc = document.getElementById('page-toc');
    if (!main || !toc) { return; }

    HB.clear(toc);
    var heads = main.querySelectorAll('h2, h3');
    var i, h, id, li, a;

    for (i = 0; i < heads.length; i++) {
      h = heads[i];
      // 确保有 id（h3 常无 id，自动补）
      id = h.id;
      if (!id) {
        id = 'sec-auto-' + i;
        h.id = id;
      }
      // 跳过“本页内容”这类无标题
      if (!h.textContent.trim()) { continue; }

      li = document.createElement('li');
      if (h.tagName === 'H3') { li.className = 'toc-lv3'; }
      a = document.createElement('a');
      a.href = '#' + id;
      a.textContent = h.textContent.trim();
      li.appendChild(a);
      toc.appendChild(li);
    }
    return toc;
  }

  /* ---------------------------------------------------- 滚动高亮当前章节 */
  function watchScroll() {
    var main = document.getElementById('content');
    var toc = document.getElementById('page-toc');
    if (!main || !toc || !('IntersectionObserver' in window)) { return; }

    var links = {};
    Array.prototype.forEach.call(toc.querySelectorAll('a'), function (a) {
      links[a.getAttribute('href').slice(1)] = a;
    });

    var visible = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
      // 取当前视口内最靠上的标题
      var best = null;
      var all = main.querySelectorAll('h2, h3');
      for (var i = 0; i < all.length; i++) {
        if (visible[all[i].id]) { best = all[i].id; break; }
      }
      if (best) {
        Array.prototype.forEach.call(toc.querySelectorAll('a'), function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + best);
        });
      }
    }, { rootMargin: '-72px 0px -70% 0px', threshold: 0 });

    Array.prototype.forEach.call(main.querySelectorAll('h2, h3'), function (h) {
      if (links[h.id]) { io.observe(h); }
    });
  }

  /* ------------------------------------------------------- 侧边栏折叠 */
  function initNav() {
    var btn = document.querySelector('.nav-toggle');
    if (!btn) { return; }
    // 窄屏默认折叠
    if (window.matchMedia('(max-width: 980px)').matches) {
      document.body.classList.add('nav-collapsed');
      btn.setAttribute('aria-expanded', 'false');
    }
    btn.addEventListener('click', function () {
      var collapsed = document.body.classList.toggle('nav-collapsed');
      btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    });
  }

  /* -------------------------------------------------------- 动画控制器 */
  function initDemos() {
    var nodes = document.querySelectorAll('[data-demo]');
    var seq = 0;

    Array.prototype.forEach.call(nodes, function (root) {
      var name = root.getAttribute('data-demo');
      var stage = root.querySelector('.demo-stage');
      var cap = root.querySelector('.demo-cap');
      var init = HB.demos[name];

      // 给 demo 一个稳定的锚点，便于深链接
      if (!root.id) { root.id = 'demo-' + (++seq); }

      if (typeof init !== 'function') {
        if (stage) {
          stage.innerHTML = '<p class="demo-cap">（未找到名为 <code>' + name +
            '</code> 的动画脚本，请检查 data-demo 与 HB.register 是否同名）</p>';
        }
        return;
      }
      if (!stage) { return; }

      var api;
      try {
        api = init(root, stage, cap);
      } catch (err) {
        stage.innerHTML = '<p class="demo-cap">动画初始化失败：' + (err && err.message) + '</p>';
        if (window.console) { console.error('[HB] demo "' + name + '" 初始化失败', err); }
        return;
      }
      if (!api || typeof api !== 'object') { return; }

      // 便捷输出：demo 脚本用 api.say('...') 更新解说
      api.say = function (html) { if (cap) { cap.innerHTML = html; } };
      api.stage = stage;
      api.root = root;

      // 若 demo 暴露了 steps 总步数，记录下来便于自检/调试
      if (typeof api.steps === 'number') { root.setAttribute('data-steps', String(api.steps)); }

      // 绑定控制按钮
      var btns = root.querySelectorAll('.demo-ctl button[data-act]');
      var btnPlay = null;

      function guard(fn) {
        return function () { if (typeof fn === 'function') { fn(); } };
      }

      Array.prototype.forEach.call(btns, function (b) {
        var act = b.getAttribute('data-act');
        if (act === 'play') { btnPlay = b; }
        var handler = guard(api[act]);
        b.addEventListener('click', function () {
          if (act === 'play') {
            // 播放 / 暂停切换：由通用定时器循环调用 api.next()，
            // demo 脚本因此只需实现 reset / prev / next 三者。
            if (api.__playing) {
              api.__playing = false;
              if (api.__timer) { api.__timer.stop(); }
              b.classList.remove('is-on');
              b.textContent = '播放';
            } else {
              api.__playing = true;
              b.classList.add('is-on');
              b.textContent = '暂停';
              api.__timer = HB.ticker(function () {
                if (!api.__playing) { return; }
                if (typeof api.next === 'function') { api.next(); }
              }, 950);
            }
          } else {
            // 手动操作时暂停自动播放，避免互相打架
            if (api.__playing) {
              api.__playing = false;
              if (api.__timer) { api.__timer.stop(); }
              if (btnPlay) { btnPlay.classList.remove('is-on'); btnPlay.textContent = '播放'; }
            }
            handler();
          }
        });
      });

      // 重置时同步播放按钮状态
      var origReset = api.reset;
      api.reset = function () {
        if (api.__playing) {
          api.__playing = false;
          if (api.__timer) { api.__timer.stop(); }
          if (btnPlay) { btnPlay.classList.remove('is-on'); btnPlay.textContent = '播放'; }
        }
        if (typeof origReset === 'function') { origReset(); }
      };

      try { api.reset(); } catch (e) { if (window.console) { console.error(e); } }
    });
  }

  /* ------------------------------------------------------------ 启动 */
  function boot() {
    initNav();
    buildToc();
    watchScroll();
    initDemos();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
