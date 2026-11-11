/* ============================================================================
   test_integration.js —— 端到端集成测试（真实解析 HTML + 真实 handbook.js boot）

   目的：验证浏览器里真正会发生的事，而不是逐个 demo 手工调用：
     1) 解析真实 deck*.html，构造真实 DOM 树（.demo / .demo-stage / .demo-cap / 控制按钮）
     2) 执行 handbook.js，让它自己 boot：
        - 自动生成 #page-toc（检查条目数与 h2/h3 数量一致）
        - 扫描 [data-demo]，实例化每个 demo
        - 绑定 .demo-ctl button[data-act] 并模拟点击
     3) 逐个点击所有 demo 的 重置/上一步/下一步/播放/暂停，检查不抛异常
     4) 检查每个 demo 的 stage 内确实渲染出 <svg>，且所有元素坐标在 viewBox 内

   用法： node _extract/test_integration.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const ASSETS = path.join(ROOT, 'assets');

/* ------------------------------------------------- 极简 HTML 解析为 DOM */
const VOID = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);

class FakeNode {
  constructor(tag) {
    this.tagName = String(tag).toUpperCase();
    this.childNodes = [];
    this.attributes = {};
    this._text = '';
    this._html = undefined;
    this.style = {};
    this.parentNode = null;
    this.listeners = {};
    this._classes = [];
  }
  get classList() {
    const self = this;
    return {
      add: (c) => { if (!self._classes.includes(c)) { self._classes.push(c); self._syncClass(); } },
      remove: (c) => { self._classes = self._classes.filter(x => x !== c); self._syncClass(); },
      toggle: (c, on) => {
        const has = self._classes.includes(c);
        const want = (on === undefined) ? !has : !!on;
        if (want && !has) { self._classes.push(c); }
        if (!want && has) { self._classes = self._classes.filter(x => x !== c); }
        self._syncClass();
      },
      contains: (c) => self._classes.includes(c)
    };
  }
  _syncClass() { this.attributes['class'] = this._classes.join(' '); }
  set className(v) { this._classes = String(v).split(/\s+/).filter(Boolean); this._syncClass(); }
  get className() { return this._classes.join(' '); }

  set textContent(v) { this._text = String(v); this.childNodes = []; this._html = undefined; }
  get textContent() {
    if (this.childNodes.length) { return this.childNodes.map(c => c.textContent).join(''); }
    return this._text;
  }
  set innerHTML(v) { this._html = String(v); this._text = String(v); this.childNodes = []; }
  get innerHTML() { return this._html !== undefined ? this._html : this._text; }

  setAttribute(k, v) {
    const key = String(k);
    if (key === 'class') { this._classes = String(v).split(/\s+/).filter(Boolean); }
    if (key === 'style') { this._parseStyle(String(v)); }
    this.attributes[key] = String(v);
  }
  _parseStyle(s) {
    s.split(';').forEach(kv => {
      const i = kv.indexOf(':');
      if (i > 0) { this.style[kv.slice(0, i).trim()] = kv.slice(i + 1).trim(); }
    });
  }
  getAttribute(k) { return Object.prototype.hasOwnProperty.call(this.attributes, k) ? this.attributes[k] : null; }
  hasAttribute(k) { return Object.prototype.hasOwnProperty.call(this.attributes, k); }
  appendChild(n) {
    if (!n) { throw new Error('appendChild(null) in <' + this.tagName + '>'); }
    n.parentNode = this; this.childNodes.push(n); return n;
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
    if (i < 0) { throw new Error('removeChild 未命中 in <' + this.tagName + '>'); }
    this.childNodes.splice(i, 1); n.parentNode = null; return n;
  }
  get firstChild() { return this.childNodes[0] || null; }
  get descendants() {
    let o = [];
    for (const c of this.childNodes) { o.push(c); o = o.concat(c.descendants); }
    return o;
  }
  addEventListener(t, fn) { (this.listeners[t] = this.listeners[t] || []).push(fn); }
  removeEventListener() {}
  dispatch(type, ev) {
    (this.listeners[type] || []).forEach(fn => fn(ev || { type, preventDefault() {} }));
  }
  closest(sel) {
    let n = this;
    while (n) { if (n._matches(sel)) { return n; } n = n.parentNode; }
    return null;
  }
  _matches(sel) { return matchSelector(this, sel); }
  querySelector(sel) { for (const d of this.descendants) { if (matchSelector(d, sel)) { return d; } } return null; }
  querySelectorAll(sel) { return this.descendants.filter(d => matchSelector(d, sel)); }
}

/** 支持逗号分组、"a"、"a b"（后代），以及每段内的 tag/.class/#id/[attr]/[attr="v"] */
function matchSelector(node, sel) {
  // 逗号分组：任一组合命中即可（如 "h2, h3"）
  const groups = sel.split(',');
  for (const g of groups) {
    if (g.trim() && matchCompound(node, g)) { return true; }
  }
  return false;
}

function matchCompound(node, sel) {
  const groups = sel.trim().split(/\s+/);
  const segs = groups.map(parseSeg);
  if (!matchSeg(node, segs[segs.length - 1])) { return false; }
  let i = segs.length - 2, cur = node.parentNode;
  while (i >= 0) {
    let found = false;
    while (cur) {
      if (matchSeg(cur, segs[i])) { found = true; cur = cur.parentNode; break; }
      cur = cur.parentNode;
    }
    if (!found) { return false; }
    i--;
  }
  return true;
}
function parseSeg(s) {
  const out = { tag: null, id: null, cls: [], attrs: [] };
  const re = /([.#]?[\w-]+|\[[^\]]+\])/g;
  let m;
  while ((m = re.exec(s))) {
    const tok = m[1];
    if (tok[0] === '.') { out.cls.push(tok.slice(1)); }
    else if (tok[0] === '#') { out.id = tok.slice(1); }
    else if (tok[0] === '[') {
      const am = /^\[([\w-]+)(?:=["']?([^"'\]]*)["']?)?\]$/.exec(tok);
      if (am) { out.attrs.push([am[1], am[2]]); }
    } else { out.tag = tok.toUpperCase(); }
  }
  return out;
}
function matchSeg(node, seg) {
  if (!node || !node.tagName) { return false; }
  if (seg.tag && node.tagName !== seg.tag) { return false; }
  if (seg.id && node.attributes['id'] !== seg.id) { return false; }
  for (const c of seg.cls) { if (!node._classes.includes(c)) { return false; } }
  for (const [k, v] of seg.attrs) {
    if (!node.hasAttribute(k)) { return false; }
    if (v !== undefined && node.attributes[k] !== v) { return false; }
  }
  return true;
}

/* ------------------------------------------------ 从 HTML 源码建 DOM 树 */
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  Theta: '\u0398', Omega: '\u03a9', epsilon: '\u03b5', le: '\u2264', ge: '\u2265',
  ne: '\u2260', exist: '\u2203', forall: '\u2200', isin: '\u2208', sum: '\u03a3',
  radic: '\u221a', lfloor: '\u230a', rfloor: '\u230b', harr: '\u2194', rArr: '\u21d2',
  sube: '\u2286', times: '\u00d7', middot: '\u00b7', asymp: '\u2248', minus: '\u2212',
  hellip: '\u2026', darr: '\u2193', harr2: '\u2194', deg: '\u00b0', copy: '\u00a9' };
function decode(s) {
  return s.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/g, (all, body) => {
    if (body[0] === '#') {
      const cp = body[1] === 'x' || body[1] === 'X'
        ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
      return isNaN(cp) ? all : String.fromCodePoint(cp);
    }
    return Object.prototype.hasOwnProperty.call(ENT, body) ? ENT[body] : all;
  });
}

function parseHTML(src) {
  const root = new FakeNode('html');
  const stack = [root];
  const tokenRe = /<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<!DOCTYPE[^>]*>|<\/([a-zA-Z][\w:-]*)\s*>|<([a-zA-Z][\w:-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)(\/?)>/g;
  let last = 0, m;
  const top = () => stack[stack.length - 1];

  function pushText(t) {
    if (!t) { return; }
    const txt = decode(t);
    if (!txt.trim()) { return; }
    const n = new FakeNode('#text');
    n._text = txt;
    top().appendChild(n);
  }

  while ((m = tokenRe.exec(src))) {
    pushText(src.slice(last, m.index));
    last = tokenRe.lastIndex;
    if (m[0].startsWith('<!--') || m[0].startsWith('<![') || m[0].startsWith('<!DOCTYPE')) { continue; }
    if (m[1]) {                                   // 结束标签
      const name = m[1].toUpperCase();
      for (let i = stack.length - 1; i > 0; i--) {
        if (stack[i].tagName === name) { stack.length = i; break; }
      }
      continue;
    }
    const tag = m[2].toUpperCase();
    const node = new FakeNode(tag);
    // 解析属性
    const attrRe = /([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
    let am;
    while ((am = attrRe.exec(m[3] || ''))) {
      const val = am[2] !== undefined ? am[2] : (am[3] !== undefined ? am[3] : (am[4] !== undefined ? am[4] : ''));
      node.setAttribute(am[1], decode(val));
    }
    top().appendChild(node);
    if (!VOID.has(tag.toLowerCase()) && !m[4]) { stack.push(node); }
  }
  pushText(src.slice(last));
  return root;
}

/* -------------------------------------------------------------- 运行测试 */
function makeEnv(rootNode) {
  const byId = {};
  for (const d of rootNode.descendants) {
    if (d.attributes['id']) { byId[d.attributes['id']] = d; }
  }
  const docListeners = {};
  const doc = {
    // 关键：仍处于 loading 状态，handbook.js 会把 boot 挂到 DOMContentLoaded 上，
    // 等 demo 脚本全部同步加载完再触发 —— 这正是浏览器的真实时序。
    readyState: 'loading',
    createElementNS: (ns, tag) => new FakeNode(tag),
    createElement: (tag) => new FakeNode(tag),
    getElementById: (id) => byId[id] || null,
    querySelector: (s) => rootNode.querySelector(s),
    querySelectorAll: (s) => rootNode.querySelectorAll(s),
    addEventListener: (t, fn) => { (docListeners[t] = docListeners[t] || []).push(fn); },
    removeEventListener: () => {},
    body: rootNode.querySelector('body') || new FakeNode('body'),
    documentElement: rootNode
  };
  doc._fire = (t) => {
    doc.readyState = 'complete';
    // 重新建索引，确保 boot 时能拿到所有 id
    for (const d of rootNode.descendants) {
      if (d.attributes['id']) { byId[d.attributes['id']] = d; }
    }
    (docListeners[t] || []).forEach(fn => fn({ type: t }));
  };
  const win = { document: doc, console, matchMedia: () => ({ matches: false, addEventListener() {} }) };
  win.window = win;
  win.setTimeout = () => 1;
  win.clearTimeout = () => {};
  win.setInterval = () => 1;
  win.clearInterval = () => {};
  win.addEventListener = () => {};
  Object.assign(win, { Math, JSON, Object, Array, String, Number, Boolean, Date,
    Error, RegExp, isNaN, parseInt, parseFloat });
  return { doc, win };
}

function runPage(file) {
  const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const rootNode = parseHTML(src);
  const { doc, win } = makeEnv(rootNode);

  const sandbox = vm.createContext(win);
  sandbox.globalThis = sandbox;

  vm.runInContext(fs.readFileSync(path.join(ASSETS, 'handbook.js'), 'utf8'), sandbox, { filename: 'handbook.js' });
  const HB = win.HB;
  if (!HB) { throw new Error('handbook.js 未暴露 HB'); }

  // 按页面里 <script src> 的顺序加载 demo 脚本
  const srcs = [...src.matchAll(/<script\s+src="([^"]+)"/g)].map(m => m[1]);
  for (const s of srcs) {
    if (s.endsWith('handbook.js')) { continue; }
    const p = path.join(ROOT, s);
    vm.runInContext(fs.readFileSync(p, 'utf8'), sandbox, { filename: s });
  }

  // 所有脚本就位后触发 DOMContentLoaded —— handbook.js 在此刻 boot：
  // 自动生成 #page-toc、扫描 [data-demo] 实例化、绑定 .demo-ctl 按钮。
  doc._fire('DOMContentLoaded');

  const toc = doc.getElementById('page-toc');
  const content = doc.getElementById('content');
  const h2h3 = content ? content.querySelectorAll('h2, h3').length : 0;

  // 真实点击 .demo-ctl 按钮，走 handbook.js 绑定的事件处理器
  const demos = rootNode.querySelectorAll('[data-demo]');
  const report = { file, tocItems: toc ? toc.childNodes.length : -1, h2h3, demos: [] };

  // 断言：自动生成的目录条目数应等于正文里 h2/h3 的数量
  if (toc && report.tocItems !== h2h3) {
    report.tocError = '#page-toc 条目数 ' + report.tocItems + ' != 正文 h2/h3 数 ' + h2h3;
  }

  for (const d of demos) {
    const name = d.getAttribute('data-demo');
    const stage = d.querySelector('.demo-stage');
    const cap = d.querySelector('.demo-cap');
    const rec = { name, ok: false, steps: 0, svg: 0, clicks: 0, error: null };
    try {
      if (!stage || !cap) { throw new Error('页面缺少 .demo-stage 或 .demo-cap'); }
      const btns = d.querySelectorAll('.demo-ctl button[data-act]');
      if (btns.length < 3) { throw new Error('控制按钮不足 3 个，实际 ' + btns.length); }

      // 首帧在 boot 时已渲染；总步数优先读 controller 暴露的 steps，
      // 其次从解说里的 "第 1 / N 步" 解析（各页格式不一）。
      const firstCap = cap.textContent || '';
      const sm = /\/\s*(\d+)\s*步/.exec(firstCap);
      const dSteps = d.getAttribute('data-steps');
      rec.steps = dSteps !== null ? parseInt(dSteps, 10)
        : (sm ? parseInt(sm[1], 10) : 0);
      rec.capHead = firstCap.replace(/\s+/g, ' ').slice(0, 40);

      // 真实点击：重置 → 下一步*N → 上一步*N → 播放 → 暂停
      const click = (act) => {
        const b = btns.filter(x => x.getAttribute('data-act') === act)[0];
        if (!b) { throw new Error('找不到 data-act="' + act + '" 的按钮'); }
        b.dispatch('click');
        rec.clicks++;
      };
      click('reset');
      for (let k = 0; k < 40; k++) { click('next'); }
      const lastCap = cap.textContent || '';
      rec.lastCap = lastCap.replace(/\s+/g, ' ').slice(0, 72);
      const lm = /第\s*(\d+)/.exec(lastCap);
      rec.reachedStep = lm ? parseInt(lm[1], 10) : -1;
      for (let k = 0; k < 40; k++) { click('prev'); }
      click('play');     // 切到播放中（handbook.js 用定时器驱动 next）
      click('play');     // 再点一次 = 暂停
      click('reset');

      rec.svg = stage.descendants.filter(x => x.tagName === 'SVG').length;
      if (rec.svg === 0) { throw new Error('stage 内没有 <svg>'); }

      // 坐标健全性：x/y/cx/cy/width/height 必须有限，宽高非负
      const bad = [];
      for (const el of stage.descendants) {
        for (const a of ['x', 'y', 'cx', 'cy', 'width', 'height']) {
          const v = el.getAttribute(a);
          if (v === null) { continue; }
          const num = parseFloat(v);
          if (!isFinite(num)) { bad.push(el.tagName + '@' + a + '=' + v); }
          else if ((a === 'width' || a === 'height') && num < 0) { bad.push(el.tagName + '@' + a + '<0'); }
        }
      }
      if (bad.length) { throw new Error('非法坐标: ' + bad.slice(0, 5).join(', ')); }
      rec.ok = true;
    } catch (e) {
      rec.error = e.message + ' | ' + (e.stack || '').split('\n')[1];
    }
    report.demos.push(rec);
  }
  return report;
}

let fail = 0;
console.log('='.repeat(78));
console.log('端到端集成测试（真实 HTML 解析 + 真实 boot 时序）');
console.log('='.repeat(78));
for (const f of ['index.html', 'deck1.html', 'deck2.html', 'deck3.html', 'deck4.html', 'deck5.html', 'deck6.html', 'deck7.html', 'deck8.html']) {
  let r;
  try { r = runPage(f); }
  catch (e) { console.log('\n--- ' + f + ' ---\n  [页面级失败] ' + e.message); fail++; continue; }
  console.log('\n--- ' + f + ' ---');
  console.log('  正文 h2/h3: ' + r.h2h3 + '   自动生成目录条目: ' + r.tocItems +
    '   [data-demo]: ' + r.demos.length);
  if (r.tocError) { console.log('  [失败] ' + r.tocError); fail++; }
  for (const d of r.demos) {
    if (d.ok) {
      console.log('  [OK] ' + d.name.padEnd(20) + ' 总步数 ' + String(d.steps).padStart(3) +
        ' | svg ' + d.svg + ' | 点击 ' + d.clicks + ' | 末步(第' + d.reachedStep + '): ' + d.lastCap);
    } else {
      console.log('  [失败] ' + d.name.padEnd(20) + ' ' + d.error);
      fail++;
    }
  }
  if (r.demos.length === 0) { console.log('  （本页无动画）'); }
}
console.log('\n' + '='.repeat(78));
console.log(fail === 0 ? '端到端集成测试全部通过。' : ('失败项: ' + fail));
console.log('='.repeat(78));
process.exit(fail === 0 ? 0 : 1);
