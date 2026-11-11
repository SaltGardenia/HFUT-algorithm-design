/* ============================================================================
   test_demos.js —— 无头 DOM 沙箱：实际执行 demos-*.js 的动画逻辑
   目的：在没有浏览器的环境里验证
     1) handbook.js 能加载并暴露 HB.register
     2) 每个 demo 的 init 不抛异常
     3) reset / prev / next 全步走一遍不抛异常，且确实产生了 DOM 操作
   用法： node _extract/test_demos.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..', 'assets');

/* ------------------------------------------------------- 极简 DOM 实现 */
let nodeCount = 0;

class FakeNode {
  constructor(tag) {
    this.tagName = String(tag).toUpperCase();
    this.childNodes = [];
    this.attributes = {};
    this._text = '';
    this.style = {};
    this.parentNode = null;
    nodeCount++;
  }
  set textContent(v) { this._text = String(v); }
  get textContent() {
    if (this.childNodes.length) {
      return this.childNodes.map(c => c.textContent).join('');
    }
    return this._text;
  }
  /* demo 脚本用 innerHTML 写解说文字：记录为文本，同时清空/替换子节点 */
  set innerHTML(v) { this._html = String(v); this._text = String(v); this.childNodes = []; }
  get innerHTML() { return this._html !== undefined ? this._html : this._text; }
  setAttribute(k, v) { this.attributes[k] = String(v); }
  getAttribute(k) { return Object.prototype.hasOwnProperty.call(this.attributes, k) ? this.attributes[k] : null; }
  appendChild(n) {
    if (!n) { throw new Error('appendChild(null) in <' + this.tagName + '>'); }
    n.parentNode = this;
    this.childNodes.push(n);
    return n;
  }
  insertBefore(n, ref) {
    if (!n) { throw new Error('insertBefore(null) in <' + this.tagName + '>'); }
    const i = this.childNodes.indexOf(ref);
    n.parentNode = this;
    if (i < 0) { this.childNodes.push(n); } else { this.childNodes.splice(i, 0, n); }
    return n;
  }
  removeChild(n) {
    const i = this.childNodes.indexOf(n);
    if (i < 0) { throw new Error('removeChild(未找到的子节点) in <' + this.tagName + '>'); }
    this.childNodes.splice(i, 1);
    n.parentNode = null;
    return n;
  }
  get firstChild() { return this.childNodes[0] || null; }
  get descendants() {
    let out = [];
    for (const c of this.childNodes) { out.push(c); out = out.concat(c.descendants); }
    return out;
  }
  /* ---- 极简 CSS 选择器匹配：支持 标签 / .类 / #id / [attr] / [attr="v"] ---- */
  _matches(sel) {
    sel = sel.trim();
    // 依次处理复合选择器（本项目用不到后代组合，简单切分即可）
    const parts = sel.split(/(?=[.#\[])/).filter(Boolean);
    for (const p of parts) {
      if (p.startsWith('.')) {
        const cls = (this.attributes['class'] || '').split(/\s+/);
        if (cls.indexOf(p.slice(1)) < 0) { return false; }
      } else if (p.startsWith('#')) {
        if (this.attributes['id'] !== p.slice(1)) { return false; }
      } else if (p.startsWith('[')) {
        const m = /^\[([\w-]+)(?:=["']?([^"'\]]*)["']?)?\]$/.exec(p);
        if (!m) { return false; }
        const key = m[1];
        if (!(key in this.attributes)) { return false; }
        if (m[2] !== undefined && this.attributes[key] !== m[2]) { return false; }
      } else {
        if (this.tagName !== p.toUpperCase()) { return false; }
      }
    }
    return true;
  }
  matches(sel) { return this._matches(sel); }
  querySelector(sel) {
    for (const d of this.descendants) { if (d._matches(sel)) { return d; } }
    return null;
  }
  querySelectorAll(sel) {
    return this.descendants.filter(d => d._matches(sel));
  }
  addEventListener() {}
  get descendants() {
    let out = [];
    for (const c of this.childNodes) { out.push(c); out = out.concat(c.descendants); }
    return out;
  }
}

function makeDoc() {
  const doc = {
    readyState: 'complete',
    createElementNS: (ns, tag) => new FakeNode(tag),
    createElement: (tag) => new FakeNode(tag),
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {},
    body: new FakeNode('body'),
    documentElement: new FakeNode('html')
  };
  return doc;
}

function makeWindow(doc) {
  const timers = [];
  const win = {
    document: doc,
    console,
    setTimeout: (fn, ms) => { timers.push(fn); return timers.length; },
    clearTimeout: () => {},
    setInterval: (fn, ms) => { timers.push(fn); return timers.length; },
    clearInterval: () => {},
    matchMedia: () => ({ matches: false, addEventListener: () => {} }),
    IntersectionObserver: undefined,
    addEventListener: () => {}
  };
  win.window = win;
  return win;
}

/* ------------------------------------------------------------ 装载脚本 */
function loadScript(file, sandbox) {
  const code = fs.readFileSync(file, 'utf8');
  vm.runInContext(code, sandbox, { filename: file });
}

function main() {
  const doc = makeDoc();
  const win = makeWindow(doc);
  // 浏览器里 window 就是全局对象，所以 HB 既是 window.HB 也是裸的 HB。
  // 这里把 win 自身当作沙箱全局，忠实模拟该行为。
  win.Math = Math; win.JSON = JSON; win.Object = Object; win.Array = Array;
  win.String = String; win.Number = Number; win.Boolean = Boolean;
  win.Date = Date; win.Error = Error; win.RegExp = RegExp;
  win.isNaN = isNaN; win.parseInt = parseInt; win.parseFloat = parseFloat;
  const sandbox = vm.createContext(win);
  sandbox.globalThis = sandbox;

  const all = fs.readdirSync(ROOT).filter(f => f.endsWith('.js')).sort();
  // handbook.js 必须先加载（页面里也是这个顺序）
  const files = all.filter(f => f === 'handbook.js')
    .concat(all.filter(f => f !== 'handbook.js'));
  const loaded = [];
  for (const f of files) {
    try {
      loadScript(path.join(ROOT, f), sandbox);
      loaded.push(f);
    } catch (e) {
      console.log('  [装载失败] ' + f + ': ' + e.message);
      return 1;
    }
  }
  console.log('已装载脚本: ' + loaded.join(', '));

  const HB = sandbox.window.HB;
  if (!HB) { console.log('!! HB 未暴露到 window'); return 1; }
  console.log('HB.register 已注册动画: ' + JSON.stringify(Object.keys(HB.demos).sort()));

  /* 逐个 demo 跑全流程。
     忠实模拟真实页面：构造 .demo > .demo-stage + .demo-cap 结构，
     再把 root / stage / cap 三个参数都传给 init（有的 demo 只用 root 自取）。 */
  let failures = 0;
  for (const name of Object.keys(HB.demos).sort()) {
    const root = new FakeNode('div');
    root.setAttribute('class', 'demo');
    const stage = new FakeNode('div');
    stage.setAttribute('class', 'demo-stage');
    const cap = new FakeNode('p');
    cap.setAttribute('class', 'demo-cap');
    root.appendChild(stage);
    root.appendChild(cap);

    // 自检：root.querySelector 必须能取到 stage / cap
    if (root.querySelector('.demo-stage') !== stage || root.querySelector('.demo-cap') !== cap) {
      console.log('  [测试脚手架错误] root.querySelector 未命中 stage/cap');
      failures++;
      continue;
    }

    let api;
    try {
      api = HB.demos[name](root, stage, cap);
    } catch (e) {
      console.log('  [初始化失败] ' + name + ': ' + e.message);
      failures++;
      continue;
    }
    // 有的 demo 返回 undefined 但自己绑定到 DOM（本项目约定必须返回控制器）
    if (!api || typeof api.reset !== 'function') {
      console.log('  [接口不符] ' + name + ': 未返回 {reset, prev, next}');
      failures++;
      continue;
    }

    const before = nodeCount;
    let steps = 0;
    let stageKids = 0;
    let svgCount = 0;
    try {
      api.reset();
      stageKids = stage.childNodes.length;
      svgCount = stage.descendants.filter(d => d.tagName === 'SVG').length;
      if (svgCount === 0) {
        console.log('  [渲染缺失] ' + name + ': reset 后 stage 内没有 <svg>');
        failures++;
        continue;
      }
      // 一路 next 到底（上限保护）
      for (let k = 0; k < 500; k++) { api.next(); steps++; }
      // 再一路 prev 回到起点
      for (let k = 0; k < 600; k++) { api.prev(); }
      api.reset();
    } catch (e) {
      console.log('  [运行异常] ' + name + ' 在第 ' + steps + ' 步: ' + e.message +
        '\n' + (e.stack || '').split('\n').slice(1, 4).join('\n'));
      failures++;
      continue;
    }

    const created = nodeCount - before;
    const txt = (cap.textContent || '').replace(/\s+/g, ' ').slice(0, 58);
    console.log('  [OK] ' + name.padEnd(18) +
      ' next ' + String(steps).padStart(3) + ' 次 | svg ' + String(svgCount).padStart(2) +
      ' | 新建节点 ' + String(created).padStart(5) +
      ' | 解说: ' + txt);
  }

  console.log('');
  console.log(failures === 0 ? '全部动画通过无头执行测试。' : ('失败动画数: ' + failures));
  return failures === 0 ? 0 : 1;
}

process.exit(main());
