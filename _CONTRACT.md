# 算法复习手册 · 协作契约（所有成员必读）

## 目标产物

`F:\计算机学习笔记\算法设计\算法复习手册\` 目录下的**多页面离线 HTML 复习手册**，依据三份课程 PPT 整理核心考点。
纯静态：无外部依赖、无 CDN、无网络请求，双击 `index.html` 即可用。

## 目录结构与文件归属（严格遵循，不要越界写别人的文件）

```
算法复习手册/
  index.html          总目录页            @lead
  deck1.html          绪论与算法设计思维   @lead
  deck2.html          算法基础与分析原则   @deck2
  deck3.html          算法分析基础         @deck3
  assets/
    handbook.css      共享样式（唯一，勿改）  @lead
    handbook.js       共享脚本（唯一，勿改）  @lead
    demos-deck2.js    排序动画             @deck2
    demos-deck3.js    递归/主方法动画       @deck3
```

**禁止**修改他人文件。若发现契约缺失，发消息给 lead，不要自行改共享文件。

## 写入通道（重要，环境限制）

当前工作区禁止 `write` 工具直接落盘（跨卷硬链接失败）。必须走：

1. `write` 工具写到 **`C:\Users\邓力亮\AppData\Local\Temp\dsh_stage\<同名相对路径>`**
   （例如写 `算法复习手册\deck2.html` → 落到 `Temp\dsh_stage\算法复习手册\deck2.html`）
2. 用 `pwsh` 执行拷贝（幂等，可重复执行）：

```powershell
pwsh -NoProfile -File "F:\计算机学习笔记\算法设计\_extract\copy_to_ws.ps1"
```

该脚本把 `Temp\dsh_stage\**` 按相对路径同步到工作区（覆盖同名文件，字节级一致，已验证 SHA256 相同）。

**注意**：`copy_to_ws.ps1` 要写进暂存区才会生效；首次运行前若它还不存在，可临时用：
`Copy-Item -Recurse -Force "C:\Users\邓力亮\AppData\Local\Temp\dsh_stage\*" "F:\计算机学习笔记\算法设计\"`

写入后必须用 `read` 工具或 `pwsh` 复核文件确实落到工作区。

## 每个页面的 HTML 骨架（必须一致，导航样式依赖它）

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>页面标题 · 算法复习手册</title>
<link rel="stylesheet" href="assets/handbook.css">
</head>
<body>
<header class="topbar">
  <button class="nav-toggle" type="button" aria-controls="sidebar" aria-expanded="true">☰ 目录</button>
  <span class="topbar-title">算法复习手册</span>
  <span class="topbar-sub">第X讲 · 页面副标题</span>
</header>

<div class="layout">
  <nav class="sidebar" id="sidebar" aria-label="全站目录">
    <p class="sidebar-h">全站导航</p>
    <ul class="site-nav">
      <li><a href="index.html">总目录</a></li>
      <li><a href="deck1.html">L1 · 绪论与设计思维</a></li>
      <li><a href="deck2.html">L1 · 算法基础与分析</a></li>
      <li><a href="deck3.html">L2 · 算法分析基础</a></li>
    </ul>
    <p class="sidebar-h">本页内容</p>
    <ul class="toc" id="page-toc"><!-- 由 handbook.js 依据 <main> 里的 h2/h3 自动生成，勿手写 --></ul>
  </nav>

  <main class="content" id="content">
    <h1>页面主标题</h1>
    <p class="lede">一句话导语。</p>

    <section id="sec-xxx">
      <h2>二级标题</h2>
      ...
    </section>
  </main>
</div>

<script src="assets/handbook.js"></script>
<script src="assets/demos-deck2.js"></script>  <!-- 按页引入自己的 demo -->
</body>
</html>
```

规则：
- 每个 `<section>` 必须有**唯一** `id`，以 `sec-` 开头；`<h2>` 写在该 section 内。
- 不要在页面里手写目录；`handbook.js` 会自动生成 `#page-toc`。
- 当前页面对应的 `site-nav` 链接加 `class="active"` 和 `aria-current="page"`。
- 页脚统一：`<footer class="pagefoot">内容依据课程 PPT 整理 · 仅供复习</footer>` 放在 `</main>` 前。

## 可用组件（class 名固定，样式已在 handbook.css 中实现）

### 提示块
```html
<div class="callout"><p class="callout-h">标题</p><p>正文</p></div>
<div class="callout key">考点</div>      <!-- 蓝，核心考点 -->
<div class="callout warn">易错</div>     <!-- 橙，易错点 -->
<div class="callout tip">记忆</div>      <!-- 绿，记忆技巧 -->
```

### 公式
```html
<p class="formula">T(n) = aT(n/b) + f(n)</p>   <!-- 居中、等宽衬线、浅底 -->
<span class="m">n<sub>0</sub></span>            <!-- 行内数学符号 -->
```
禁止使用 LaTeX/MathJax（无网络）。用 HTML 实体与 `<sub>/<sup>`：
`Θ`= `&Theta;`，`Ω`= `&Omega;`，`O` 直接写，`≤`= `&le;`，`≥`= `&ge;`，`≠`= `&ne;`，`∃`= `&exist;`，`∀`= `&forall;`，`∈`= `&isin;`，`σ`= `&sum;`，`√`= `&radic;`，`ε`= `&epsilon;`，`⌊⌋`= `&lfloor;&rfloor;`。

### 代码：伪代码 + C++ 双栏（**每个代码块必须逐行中文注释**）
```html
<div class="code-pair">
  <div class="code-col">
    <p class="code-h">伪代码</p>
    <pre class="code"><code>INSERTION-SORT(A)
1  for j = 2 to A.length          // 从第2个元素开始，逐个插入
2      key = A[j]                 // 取出待插入的关键字
...</code></pre>
  </div>
  <div class="code-col">
    <p class="code-h">C++</p>
    <pre class="code cpp"><code>void insertionSort(int A[], int n) {
    for (int j = 1; j &lt; n; ++j) {   // 从第2个元素开始
        int key = A[j];             // 取出待插入的关键字
...</code></pre>
  </div>
</div>
```
- HTML 里 `&`、`<`、`>` 必须转义为 `&amp;` `&lt;` `&gt;`。
- 注释列尽量对齐，便于阅读。
- 单语言代码块用 `<pre class="code"><code>…</code></pre>`。

### 表格
```html
<table class="tbl"><thead><tr><th>…</th></tr></thead><tbody><tr><td>…</td></tr></tbody></table>
```

### 动画演示容器（**所有动画必须放在这个结构里，靠 handbook.js 统一控制**）
```html
<div class="demo" data-demo="insertion-sort">
  <div class="demo-bar">
    <span class="demo-title">插入排序执行过程</span>
    <span class="demo-ctl">
      <button type="button" data-act="reset">重置</button>
      <button type="button" data-act="prev">上一步</button>
      <button type="button" data-act="next">下一步</button>
      <button type="button" data-act="play">播放</button>
    </span>
  </div>
  <div class="demo-stage"></div>          <!-- demo 脚本把 SVG 渲染到这里 -->
  <p class="demo-cap"></p>                <!-- 当前步骤的文字解说 -->
</div>
```
`handbook.js` 会：
- 找到所有 `[data-demo]`，读取 `data-demo` 值，调用 `window.HB.demos[name]`
- 给控制按钮绑定 `data-act`，回调 `demo` 对象的 `reset/prev/next/play`
- 自动为每个 demo 生成 `#demo-N` 并注册到目录

demo 脚本必须这样注册（见 `assets/handbook.js` 顶部注释里的 API 说明）：
```js
HB.register('insertion-sort', function (root) {
  // root: 该 .demo 元素
  const stage = root.querySelector('.demo-stage');
  const cap   = root.querySelector('.demo-cap');
  // ... 自建 SVG / DOM
  return { reset, prev, next, play };  // 四个函数，play 可选
});
```

### 静态矢量图（SVG）
直接内联 `<svg viewBox="…" role="img" aria-label="说明">`，配色用 CSS 变量：
`var(--c-ink)` 文字、`var(--c-line)` 描边、`var(--c-accent)` 强调、`var(--c-accent-2)` 次强调、
`var(--c-hot)` 当前操作、`var(--c-ok)` 已完成、`var(--c-warn)` 警告、`var(--c-panel)` 面板底。
给 `<svg>` 加 `class="fig"`，并配 `<p class="fig-cap">图 x 说明</p>`。

## 内容要求

- **只覆盖核心考点**：算法定义/性质/表示、插入·选择·快速排序、渐近记号 Θ/O/Ω/o/ω、代换法/递归树/主方法、循环不变式、线性时间选择。历史典故与思维陷阱**简略带过**。
- **每个算法**都要有：问题描述 → 伪代码 + C++（逐行注释）→ 动画/矢量图演示执行过程 → 复杂度分析。
- 数字与结论必须与 PPT 一致（例：输入 `<24,17,40,28,13,14,22,32,40,21,48,4,47,8,37,18>`；插入排序最坏 T(n)=3n²/2+7n/2−4 = Θ(n²)；选择排序 T(n)=2n²+3n−4 = Θ(n²)；插入排序最好情况比较 n−1 次、最坏情况比较 n(n−1)/2 次；同时求最大最小 3⌊n/2⌋ 次比较）。
  - 已复算核对：插入排序 7 行计数 `n + (n−1) + (n−1) + Σ_{j=2..n}j + 2·Σ_{j=2..n}(j−1) + (n−1)` = `3n²/2 + 7n/2 − 4` ✔
  - 选择排序 6 行计数（如 `n + (n−1) + Σ_{k=1..n−1}(n−k) + 3·Σ_{k=0..n−2}(n−k)`）= `2n² + 3n − 4` ✔（`(2/3)n²+3n−4` 无法由逐行计数得到，是错误值，勿使用）
- 中文正文；术语首次出现给出英文（如"有穷性 (Finiteness)"）。
- 每节结尾建议加 `<div class="callout key">` 归纳考点。

## 自检清单（提交前必须全部通过）

1. `read` 复核文件已在工作区，且中文无乱码。
2. HTML 标签闭合正确、无 `&` `/` `<` 未转义导致解析错误。
3. 页面用 `file://` 双击即可打开，**不引用任何本页未交付的文件**。
4. 所有 `[data-demo]` 的 `data-demo` 名在对应 `demos-*.js` 里已 `HB.register` 同名注册。
5. 代码块**每一行**都有中文注释（空行除外）。
6. 站内链接（`index.html` / `deck1.html` / `deck2.html` / `deck3.html`）拼写正确。
