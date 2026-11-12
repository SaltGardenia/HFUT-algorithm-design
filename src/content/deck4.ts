/* 由 scripts/migrate.mjs 自动生成 —— 内容事实源，手工修改后请勿重跑迁移覆盖 */
import type { DeckData } from './types';

const deck: DeckData = {
  id: 'deck4',
  no: "",
  title: "L3 · 线性时间排序",
  subtitle: "第 4 讲 · 线性时间排序",
  lede: `
  本讲回答一个尖锐的问题 —— <b>O(n lg n) 是不是排序能做到的极限？</b>围绕它展开三块内容：① 用<b>决策树模型</b>分析基于比较的排序方法的时间复杂度下界；② <b>计数排序</b>（各项之间不进行比较）；③ <b>基数排序</b>（按位切割、最低位优先）。所有定义、算例与逐帧状态均按课程 PPT 原图核对：比较排序下界 <span class="m">&Omega;(n lg n)</span>、相邻交换下界 <span class="m">&Omega;(N<sup>2</sup>)</span>、计数排序算例 <span class="m">A = &lang;4, 1, 3, 4, 3&rang;</span>（k = 4）、基数排序算例 329 / 457 / 657 / 839 / 436 / 720 / 355。
`,
  toc: [
    { id: 'sec-overview', text: "1. 本讲内容与问题引入", level: 2 },
    { id: 'sec-decision-tree', text: "2. 决策树模型：以 3 元素插入排序为例", level: 2 },
    { id: 'sec-decision-tree-h1', text: "2.1 决策树的定义", level: 3 },
    { id: 'sec-decision-tree-h2', text: "2.2 沿决策树走一遍：排序 &lang;9, 4, 6&rang;", level: 3 },
    { id: 'sec-decision-tree-h3', text: "2.3 归纳的结论：决策树模型", level: 3 },
    { id: 'sec-lower-bound', text: "3. 比较排序的下界：任何决策树的高度是 &Omega;(n lg n)", level: 2 },
    { id: 'sec-lower-bound-h1', text: "3.1 推论与\"证明思路回顾\"", level: 3 },
    { id: 'sec-lower-bound-h2', text: "3.2 下界验证：伪代码 + C++（逐行注释）", level: 3 },
    { id: 'sec-lower-bound-h3', text: "3.3 引申（课后思考）：螺丝螺母问题", level: 3 },
    { id: 'sec-inversion', text: "4. 简单排序算法的时间复杂度下界：逆序数", level: 2 },
    { id: 'sec-inversion-h1', text: "4.1 各排序算法一句话回顾", level: 3 },
    { id: 'sec-counting-sort', text: "5. 计数排序（Counting Sort）", level: 2 },
    { id: 'sec-counting-sort-h1', text: "5.1 基本思想与四个步骤", level: 3 },
    { id: 'sec-counting-sort-h2', text: "5.2 逐帧动画：A = &lang;4, 1, 3, 4, 3&rang;，k = 4", level: 3 },
    { id: 'sec-counting-sort-h3', text: "5.3 伪代码 + C++（逐行注释）", level: 3 },
    { id: 'sec-counting-sort-h4', text: "5.4 运行时间分析", level: 3 },
    { id: 'sec-counting-sort-h5', text: "5.5 稳定性", level: 3 },
    { id: 'sec-radix-sort', text: "6. 基数排序（Radix Sort）", level: 2 },
    { id: 'sec-radix-sort-h1', text: "6.1 逐帧动画：7 个三位数的 LSD 过程", level: 3 },
    { id: 'sec-radix-sort-h2', text: "6.2 伪代码 + C++（逐行注释）", level: 3 },
    { id: 'sec-radix-sort-h3', text: "6.3 正确性证明", level: 3 },
    { id: 'sec-radix-sort-h4', text: "6.4 适用性与缺点", level: 3 },
    { id: 'sec-summary', text: "7. 内容小结与速记清单", level: 2 },
    { id: 'sec-quiz', text: "本节自测（课件配套测验）", level: 2 },
    { id: 'sec-quiz-h1', text: "一、单项选择题", level: 3 },
    { id: 'sec-quiz-h2', text: "二、判断题", level: 3 },
  ],
  sections: [
    {
      id: 'sec-overview',
      heading: "1. 本讲内容与问题引入",
      blocks: [
        { type: 'html', html: `
          <p>本讲三块内容（对应 PPT 第 2 页）：</p>
                <ol>
                  <li><b>基于比较排序方法的时间复杂度下界分析</b> —— 用决策树模型证明任何比较排序至少需要 <span class="m">&Omega;(n lg n)</span> 次比较；</li>
                  <li><b>计数排序</b> (Counting Sort) —— 各项之间<b>不进行比较</b>；</li>
                  <li><b>基数排序</b> (Radix Sort) —— 按位切割，从最低位开始依次排序。</li>
                </ol>
          
                <p>至今为止见过的排序都是<b>比较排序</b> (comparison sort)：<b>仅仅使用比较来确定各项的相对顺序</b>。我们见过的比较排序中，最好的最坏运行时间是 <span class="m">O(n lg n)</span>。于是自然要问：</p>
          
                <div class="callout key">
                  <p class="callout-h">本讲的核心问题</p>
                  <p><b><span class="m">O(n lg n)</span> 是不是我们能做到的极限？</b>前半讲给出否定的"上界论"证明（比较排序确实到此为止），后半讲给出绕过它的两条路（不比较的计数排序、按位排的基数排序）。</p>
                </div>
          
                <p>PPT 第 3 页给出的排序算法对比表（复习时按这张表记复杂度）：</p>
          
                <table class="tbl">
                  <thead><tr><th>算法名称</th><th>最佳时间复杂度</th><th>平均时间复杂度</th><th>最差时间复杂度</th></tr></thead>
                  <tbody>
                    <tr><td>冒泡排序</td><td class="num">O(n)</td><td class="num">O(n<sup>2</sup>)</td><td class="num">O(n<sup>2</sup>)</td></tr>
                    <tr><td>选择排序</td><td class="num">O(n<sup>2</sup>)</td><td class="num">O(n<sup>2</sup>)</td><td class="num">O(n<sup>2</sup>)</td></tr>
                    <tr><td>插入排序</td><td class="num">O(n)</td><td class="num">O(n<sup>2</sup>)</td><td class="num">O(n<sup>2</sup>)</td></tr>
                    <tr><td>归并排序</td><td class="num">O(n log n)</td><td class="num">O(n log n)</td><td class="num">O(n log n)</td></tr>
                    <tr><td>快速排序</td><td class="num">O(n log n)</td><td class="num">O(n log n)</td><td class="num">O(n<sup>2</sup>)</td></tr>
                    <tr><td>堆排序</td><td class="num">O(n log n)</td><td class="num">O(n log n)</td><td class="num">O(n log n)</td></tr>
                    <tr><td>希尔排序</td><td class="num">O(n log n)</td><td class="num">O(n log<sup>2</sup> n)</td><td class="num">O(n<sup>2</sup>)</td></tr>
                  </tbody>
                </table>
          
                <p>表格里最差列最好的也只是 <span class="m">O(n log n)</span>（归并排序、堆排序）。要判断这是不是"极限"，必须先给"比较排序"建立一个可以定量分析的模型 —— 这就是下一节的<b>决策树</b>。</p>
        ` },
      ],
    },
    {
      id: 'sec-decision-tree',
      heading: "2. 决策树模型：以 3 元素插入排序为例",
      blocks: [
        { type: 'html', html: `
          <p>直接对一般的 n 做下界分析不好下手，PPT 的思路是"<b>先分析一个具体的小规模例子 —— 直接插入排序，待排序数组的规模为 3</b>"，把这个例子的结构看清楚，再推广到任意 n。</p>
          
                <h3 id="sec-decision-tree-h1">2.1 决策树的定义</h3>
          
                <div class="callout key">
                  <p class="callout-h">定义（决策树 decision tree）</p>
                  <p>作用于 3 个元素的插入排序的决策树中：</p>
                  <ul>
                    <li><b>内部节点</b>标识为 <span class="m">i:j</span>（<span class="m">i, j &isin; {1, 2, …, n}</span>），对应一次比较操作；</li>
                    <li><b>左子树</b>表示当 <span class="m">a<sub>i</sub> &le; a<sub>j</sub></span> 时的比较序列；<b>右子树</b>表示当 <span class="m">a<sub>i</sub> &ge; a<sub>j</sub></span> 时的比较序列；</li>
                    <li><b>分支</b>对应一次比较的一种情况；</li>
                    <li><b>叶子节点</b>对应一个排列。</li>
                  </ul>
                </div>
          
                <p>也就是说：从根出发，每走一步就做一次比较、分一次叉；走到叶子时，整个排列就被唯一确定了。下面的图就是这棵树的全貌，其中标红的是排序 <span class="m">&lang;a<sub>1</sub>, a<sub>2</sub>, a<sub>3</sub>&rang; = &lang;9, 4, 6&rang;</span> 时走出的那一条路径。</p>
          
                <svg class="fig" viewBox="0 0 1000 470" role="img" aria-label="作用于 3 个元素的插入排序决策树：6 个叶子对应 3 的阶乘种排列，红色高亮的是输入 9 4 6 的搜索路径">
                  <text x="26" y="24" class="tx-b">作用于 3 个元素的插入排序的决策树</text>
                  <text x="26" y="44" class="tx-sm">内部节点 i:j = 一次比较操作；左分支 = ai ≤ aj，右分支 = ai ≥ aj；叶子 = 一种最终排列</text>
                  <!-- 10 条边：先画边，再用节点盖住线头 -->
                  <line x1="500" y1="58" x2="270" y2="168" stroke="var(--c-line)" stroke-width="1.6"></line>
                  <line x1="500" y1="58" x2="740" y2="168" stroke="var(--c-hot)" stroke-width="3.2"></line>
                  <line x1="270" y1="168" x2="150" y2="278" stroke="var(--c-line)" stroke-width="1.6"></line>
                  <line x1="270" y1="168" x2="390" y2="278" stroke="var(--c-line)" stroke-width="1.6"></line>
                  <line x1="390" y1="278" x2="320" y2="388" stroke="var(--c-line)" stroke-width="1.6"></line>
                  <line x1="390" y1="278" x2="465" y2="388" stroke="var(--c-line)" stroke-width="1.6"></line>
                  <line x1="740" y1="168" x2="620" y2="278" stroke="var(--c-line)" stroke-width="1.6"></line>
                  <line x1="740" y1="168" x2="860" y2="278" stroke="var(--c-hot)" stroke-width="3.2"></line>
                  <line x1="860" y1="278" x2="790" y2="388" stroke="var(--c-hot)" stroke-width="3.2"></line>
                  <line x1="860" y1="278" x2="935" y2="388" stroke="var(--c-line)" stroke-width="1.6"></line>
                  <!-- 分支标记 -->
                  <text x="372" y="116" class="tx-sm" text-anchor="end">≤</text>
                  <text x="628" y="112" class="tx-sm tx-b" text-anchor="start" fill="var(--c-hot)">&gt;</text>
                  <text x="196" y="226" class="tx-sm" text-anchor="end">≤</text>
                  <text x="340" y="222" class="tx-sm" text-anchor="start">&gt;</text>
                  <text x="340" y="336" class="tx-sm" text-anchor="end">≤</text>
                  <text x="438" y="332" class="tx-sm" text-anchor="start">&gt;</text>
                  <text x="666" y="226" class="tx-sm" text-anchor="end">≤</text>
                  <text x="810" y="222" class="tx-sm tx-b" text-anchor="start" fill="var(--c-hot)">&gt;</text>
                  <text x="810" y="336" class="tx-sm tx-b" text-anchor="end" fill="var(--c-hot)">≤</text>
                  <text x="906" y="332" class="tx-sm" text-anchor="start">&gt;</text>
                  <!-- 路径上的比较结果 -->
                  <text x="672" y="96" class="tx-sm" fill="var(--c-hot)">9 ≥ 4</text>
                  <text x="868" y="206" class="tx-sm" fill="var(--c-hot)">9 ≥ 6</text>
                  <text x="736" y="356" class="tx-sm" fill="var(--c-hot)" text-anchor="end">4 ≤ 6</text>
                  <!-- 内部节点 -->
                  <circle cx="500" cy="58" r="25" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="2.4"></circle>
                  <text x="500" y="63" class="tx" text-anchor="middle">1:2</text>
                  <circle cx="270" cy="168" r="25" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.4"></circle>
                  <text x="270" y="173" class="tx" text-anchor="middle">2:3</text>
                  <circle cx="740" cy="168" r="25" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="2.4"></circle>
                  <text x="740" y="173" class="tx" text-anchor="middle">1:3</text>
                  <circle cx="390" cy="278" r="25" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.4"></circle>
                  <text x="390" y="283" class="tx" text-anchor="middle">1:3</text>
                  <circle cx="860" cy="278" r="25" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="2.4"></circle>
                  <text x="860" y="283" class="tx" text-anchor="middle">2:3</text>
                  <!-- 叶子 -->
                  <rect x="117" y="262" width="66" height="32" rx="5" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.4"></rect>
                  <text x="150" y="283" class="tx" text-anchor="middle">123</text>
                  <rect x="587" y="262" width="66" height="32" rx="5" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.4"></rect>
                  <text x="620" y="283" class="tx" text-anchor="middle">213</text>
                  <rect x="287" y="372" width="66" height="32" rx="5" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.4"></rect>
                  <text x="320" y="393" class="tx" text-anchor="middle">132</text>
                  <rect x="432" y="372" width="66" height="32" rx="5" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.4"></rect>
                  <text x="465" y="393" class="tx" text-anchor="middle">312</text>
                  <rect x="757" y="372" width="66" height="32" rx="5" fill="var(--c-tip-bg)" stroke="var(--c-ok)" stroke-width="2.2"></rect>
                  <text x="790" y="393" class="tx tx-b" text-anchor="middle">231</text>
                  <rect x="902" y="372" width="66" height="32" rx="5" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.4"></rect>
                  <text x="935" y="393" class="tx" text-anchor="middle">321</text>
                  <!-- 结论 -->
                  <line x1="26" y1="418" x2="974" y2="418" stroke="var(--c-line-soft)"></line>
                  <text x="26" y="443" class="tx">红色路径：1:2 →(9 ≥ 4) 1:3 →(9 ≥ 6) 2:3 →(4 ≤ 6) 叶子 231，共 3 次比较；231 表示 a&#8322; ≤ a&#8323; ≤ a&#8321;，即 4 ≤ 6 ≤ 9</text>
                  <text x="26" y="464" class="tx-sm">6 个叶子 = 3! = 6 种排列；叶子 123 那条路径只比较 2 次，说明不同输入的运行时间并不相同</text>
                </svg>
                <p class="fig-cap">图 1 &nbsp;作用于 3 个元素的插入排序的决策树，以及 <span class="m">&lang;9, 4, 6&rang;</span> 的搜索路径</p>
          
                <h3 id="sec-decision-tree-h2">2.2 沿决策树走一遍：排序 &lang;9, 4, 6&rang;</h3>
          
                <p>把 <span class="m">a<sub>1</sub> = 9</span>、<span class="m">a<sub>2</sub> = 4</span>、<span class="m">a<sub>3</sub> = 6</span> 代进去，每到一个内部节点做一次比较，按比较结果选分支：</p>
                <ol>
                  <li>根节点 <b>1:2</b>：比较 <span class="m">a<sub>1</sub></span> 与 <span class="m">a<sub>2</sub></span>，即 9 与 4。因为 <span class="m">9 &ge; 4</span>，走<b>右分支</b>；</li>
                  <li>节点 <b>1:3</b>：比较 <span class="m">a<sub>1</sub></span> 与 <span class="m">a<sub>3</sub></span>，即 9 与 6。因为 <span class="m">9 &ge; 6</span>，继续走<b>右分支</b>；</li>
                  <li>节点 <b>2:3</b>：比较 <span class="m">a<sub>2</sub></span> 与 <span class="m">a<sub>3</sub></span>，即 4 与 6。因为 <span class="m">4 &le; 6</span>，走<b>左分支</b>；</li>
                  <li>到达叶子 <b>231</b>：表示最终次序是 <span class="m">a<sub>2</sub> &le; a<sub>3</sub> &le; a<sub>1</sub></span>，代入数值就是 <span class="m">&lang;4, 6, 9&rang;</span>，排序完成。</li>
                </ol>
                <p>这条路径一共做了 <b>3 次比较</b>，另外一些路径（如叶子 123）只需 2 次比较 —— 可见同一个算法在不同输入上的比较次数可以不同。</p>
        ` },
        { type: 'demo', name: 'decision-tree', title: "决策树：&lang;9, 4, 6&rang; 的搜索路径逐帧走出（9 步）" },
        { type: 'html', html: `
          <h3 id="sec-decision-tree-h3">2.3 归纳的结论：决策树模型</h3>
          
                <div class="callout key">
                  <p class="callout-h">决策树可以模拟任何的比较排序的执行过程</p>
                  <ul>
                    <li>每个输入大小为 n 的序列都可以用这棵树表示；</li>
                    <li>将算法视为<b>每次两个项相比后就分叉</b>；</li>
                    <li>树包含了所有可能比较的<b>指令路径</b>；</li>
                    <li><b>算法的运行时间 = 路径的长度</b>；</li>
                    <li><b>最坏运行时间 = 树的高度</b>。</li>
                  </ul>
                </div>
          
                <p>这五句话把"排序算法的比较次数"翻译成了"树的路径长度"，于是分析最坏运行时间就变成了求树高 —— 下一节的证明就是把"树高"夹在 <span class="m">n!</span> 与 <span class="m">2<sup>h</sup></span> 之间。</p>
        ` },
      ],
    },
    {
      id: 'sec-lower-bound',
      heading: "3. 比较排序的下界：任何决策树的高度是 &Omega;(n lg n)",
      blocks: [
        { type: 'html', html: `
          <div class="callout key">
                  <p class="callout-h">定理</p>
                  <p>对 n 个项排序的<b>任何决策树</b>的高度是 <span class="m">&Omega;(n lg n)</span>。</p>
                </div>
          
                <p><b>证明</b>：用 <span class="m">L</span> 表示树的叶子节点数，<span class="m">h</span> 表示树高，逐步推导如下。</p>
          
                <p><b>① <span class="m">L &ge; n!</span></b>：因为 n 个元素有 <span class="m">n!</span> 种可能的排列，而一个正确的排序算法必须能把每一种输入都排成正确顺序，所以每一种排列至少对应一个可达的叶子。</p>
                <p><b>② <span class="m">L &le; 2<sup>h</sup></span></b>：高度为 h 的二叉树最多有 <span class="m">2<sup>h</sup></span> 个叶子。</p>
                <p><b>③ 因此 <span class="m">n! &le; 2<sup>h</sup></span></b>：把上面两个不等式接起来（L 正好被夹在中间）。两边取 lg（lg 单调递增，不等号方向不变）得 <span class="m">h &ge; lg(n!)</span>。</p>
                <p><b>④ 用 Stirling 公式放缩</b>：<span class="m">n! &asymp; &radic;(2&pi;n) &middot; (n/e)<sup>n</sup></span>，于是</p>
                <p class="formula">h &ge; lg(n!) &ge; lg((n/e)<sup>n</sup>) = n lg n &minus; n lg e = <b>&Omega;(n lg n)</b> ∎</p>
          
                <svg class="fig" viewBox="0 0 900 470" role="img" aria-label="比较排序下界的推导链：叶子数不少于 n 的阶乘、不超过 2 的 h 次方，因此 n 的阶乘不超过 2 的 h 次方，取对数后用 Stirling 公式放缩得到 Omega(n lg n)">
                  <text x="26" y="22" class="tx-b">下界证明推导链（每一步的依据写在右侧）</text>
                  <!-- 六个方框 -->
                  <rect x="40" y="34" width="300" height="46" rx="8" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.4"></rect>
                  <text x="190" y="63" class="tx" text-anchor="middle">L ≥ n!</text>
                  <rect x="40" y="104" width="300" height="46" rx="8" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.4"></rect>
                  <text x="190" y="133" class="tx" text-anchor="middle">L ≤ 2^h</text>
                  <rect x="40" y="174" width="300" height="46" rx="8" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="2"></rect>
                  <text x="190" y="203" class="tx tx-b" text-anchor="middle">n! ≤ 2^h</text>
                  <rect x="40" y="244" width="300" height="46" rx="8" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.4"></rect>
                  <text x="190" y="273" class="tx" text-anchor="middle">h ≥ lg(n!)</text>
                  <rect x="40" y="314" width="300" height="46" rx="8" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.4"></rect>
                  <text x="190" y="343" class="tx" text-anchor="middle">h ≥ n lg n − n lg e</text>
                  <rect x="40" y="384" width="300" height="46" rx="8" fill="var(--c-tip-bg)" stroke="var(--c-ok)" stroke-width="2.2"></rect>
                  <text x="190" y="413" class="tx tx-b" text-anchor="middle">h = Ω(n lg n)</text>
                  <!-- 箭头 -->
                  <line x1="190" y1="80" x2="190" y2="104" stroke="var(--c-line)" stroke-width="2"></line>
                  <polygon points="184,96 196,96 190,104" fill="var(--c-line)"></polygon>
                  <line x1="190" y1="150" x2="190" y2="174" stroke="var(--c-line)" stroke-width="2"></line>
                  <polygon points="184,166 196,166 190,174" fill="var(--c-line)"></polygon>
                  <line x1="190" y1="220" x2="190" y2="244" stroke="var(--c-line)" stroke-width="2"></line>
                  <polygon points="184,236 196,236 190,244" fill="var(--c-line)"></polygon>
                  <line x1="190" y1="290" x2="190" y2="314" stroke="var(--c-line)" stroke-width="2"></line>
                  <polygon points="184,306 196,306 190,314" fill="var(--c-line)"></polygon>
                  <line x1="190" y1="360" x2="190" y2="384" stroke="var(--c-ok)" stroke-width="2"></line>
                  <polygon points="184,376 196,376 190,384" fill="var(--c-ok)"></polygon>
                  <!-- 右侧依据 -->
                  <text x="368" y="52" class="tx-sm">① n 个元素共有 n! 种排列，每种排列至少对应一个可达叶子</text>
                  <text x="368" y="72" class="tx-sm">⇒ 叶子数 L 不少于 n!</text>
                  <text x="368" y="122" class="tx-sm">② 高度为 h 的二叉树最多只有 2^h 个叶子</text>
                  <text x="368" y="142" class="tx-sm">⇒ 叶子数 L 不超过 2^h</text>
                  <text x="368" y="192" class="tx-sm">③ 把①②接起来：n! ≤ L ≤ 2^h，中间项 L 可以去掉</text>
                  <text x="368" y="212" class="tx-sm">这是证明最关键的一步：把"叶子数"这个桥梁消掉</text>
                  <text x="368" y="262" class="tx-sm">④ 两边取 lg：lg 单调递增，所以不等号方向不变</text>
                  <text x="368" y="282" class="tx-sm">h ≥ lg(n!) = lg(n·(n−1)·…·1)</text>
                  <text x="368" y="332" class="tx-sm">⑤ Stirling 公式 n! ≈ √(2πn)·(n/e)^n 放缩：</text>
                  <text x="368" y="352" class="tx-sm">lg(n!) ≥ lg((n/e)^n) = n lg n − n lg e</text>
                  <text x="368" y="402" class="tx-sm">⑥ 即任何比较排序的决策树高度都是 Ω(n lg n)</text>
                  <text x="368" y="422" class="tx-sm">也就是最坏情况下至少要做 Ω(n lg n) 次比较 ∎</text>
                </svg>
                <p class="fig-cap">图 2 &nbsp;比较排序下界的推导链：L ≥ n! 与 L ≤ 2<sup>h</sup> 相夹，取 lg 后用 Stirling 公式放缩</p>
          
                <div class="callout warn">
                  <p class="callout-h">易错：放缩的方向</p>
                  <p>第 ④ 步是<b>把 lg(n!) 换成更小的量</b>：<span class="m">lg(n!) &ge; lg((n/e)<sup>n</sup>)</span>。因为我们要证的是"h 至少有多大"，所以只有用<b>更小的下界</b>去替代才安全；反过来用 <span class="m">n! &asymp; &radic;(2&pi;n)(n/e)<sup>n</sup></span> 里的 <span class="m">&radic;(2&pi;n)</span> 把结果往大放，结论依然成立，但那就不是"放缩"而是"加强"了。</p>
                </div>
          
                <h3 id="sec-lower-bound-h1">3.1 推论与"证明思路回顾"</h3>
          
                <div class="callout key">
                  <p class="callout-h">推论</p>
                  <p>在最差情况下，任何一种<b>比较排序</b>至少需要 <span class="m">&Omega;(n lg n)</span> 次比较操作。这是<b>比较操作所能获得的信息有限</b>所导致的。从这个意义上讲，<b>堆排序和归并排序是渐进最佳的比较排序算法</b>。</p>
                </div>
          
                <p>PPT 第 13 页把上面的证明思路又整理成 5 条，可以当作答题提纲：</p>
                <ol>
                  <li>任何基于比较的排序都可以用决策树 T 建模；</li>
                  <li>对于一个特定的算法 A <span class="m">&rArr;</span> 一棵特定的树 T：
                    <ul>
                      <li>每一个特定的输入 <span class="m">&rArr;</span> 特定树 T 上的一条路径；</li>
                      <li><span class="m">W(n)</span> 即对应树的高度；</li>
                    </ul>
                  </li>
                  <li>比较排序下界即是<b>所有树的最小高度</b>；</li>
                  <li>而一个正确的算法，其叶子节点的个数设为 L，则 L 满足：<span class="m">n! &le; L &le; 2<sup>h</sup></span> <span class="m">&rArr;</span> <span class="m">h &ge; log n!</span> <span class="m">&isin; &Omega;(n log n)</span>；</li>
                  <li>则比较排序的下界即 <span class="m">n log n</span>。</li>
                </ol>
          
                <p><b>信息论视角</b>（本证明的另一种说法）：n! 种可能的输出至少需要 <span class="m">lg(n!)</span> 位信息才能区分，而每次二值比较最多提供 <b>1 位</b>信息，所以至少需要 <span class="m">lg(n!) = &Omega;(n lg n)</span> 次比较。</p>
          
                <h3 id="sec-lower-bound-h2">3.2 下界验证：伪代码 + C++（逐行注释）</h3>
          
                <p>下面的程序把上面的三步（数叶子、取 lg、用 Stirling 放缩）变成可以运行的代码，用 n = 8、16、32、64 验证 <span class="m">h &ge; lg(n!) &ge; n lg n &minus; n lg e</span> 始终成立。</p>
          
                <div class="code-pair">
                  <div class="code-col">
                    <p class="code-h">伪代码</p>
                    <pre class="code"><code>LOWER-BOUND(n)                        // 验证比较排序的下界 h ≥ lg(n!) ≥ n lg n − n lg e
          1  L ← n!                             // 正确算法至少要有 n! 个叶子（n 个元素的排列数）
          2  h ← 0                              // 树高从 0 开始累加
          3  while 2^h &lt; L do                   // 高度 h 的二叉树最多只有 2^h 个叶子
          4      h ← h + 1                      // 叶子不够就再加一层，直到 2^h ≥ n!
          5  assert h ≥ lg(n!)                  // 由 n! ≤ 2^h 取 lg 得到 h ≥ lg(n!)
          6  h2 ← n·lg n − n·lg e               // 用 Stirling 公式放缩：lg(n!) ≥ lg((n/e)^n)
          7  assert h ≥ h2                      // 合起来得到 h ≥ n lg n − n lg e = Ω(n lg n)
          8  return h                           // 返回决策树高度的下界</code></pre>
                  </div>
                  <div class="code-col">
                    <p class="code-h">C++</p>
                    <pre class="code cpp"><code>#include &lt;cmath&gt;                            // 用到 log2、exp（阶乘与 Stirling 放缩都靠它）
          #include &lt;cstdio&gt;                           // 打印每个规模的下界验证结果
          // 计算 lg(n!)：n! 用 long double 逐项累乘，避免整数溢出
          long double lgFactorial(int n) {            // 返回 log2(n!) 即 lg(n!)
              long double f = 1.0L;                   // 阶乘累乘器，初值为 1
              for (int i = 2; i &lt;= n; ++i) { f *= i; }   // 依次乘上 2、3、…、n，得到 n!
              return std::log2(f);                    // 取以 2 为底的对数，即 lg(n!)
          }                                           // 结束 lgFactorial 函数
          // 用 Stirling 公式给出的下界：n lg n − n lg e
          long double stirlingLower(int n) {          // 返回 n·lg n − n·lg e
              long double x = (long double)n;         // 把规模 n 转成浮点参与运算
              return x * std::log2(x) - x * std::log2(std::exp(1.0L));   // 逐项算出 Stirling 放缩值
          }                                           // 结束 stirlingLower 函数
          // 用"数叶子"的方式求高度下界：最小的 h 使 2^h ≥ n!
          int minHeightByLeaves(int n) {              // 返回满足 2^h ≥ n! 的最小树高 h
              long double f = 1.0L;                   // 阶乘累乘器，初值为 1
              for (int i = 2; i &lt;= n; ++i) { f *= i; }   // 先算出 n!
              int h = 0;                              // 树高从 0 开始累加
              long double cap = 1.0L;                 // cap = 2^h，表示高度 h 时的最多叶子数
              while (cap &lt; f) { cap *= 2.0L; ++h; }   // 叶子不够就再加一层，直到 2^h ≥ n!
              return h;                               // 返回最小树高，即决策树下界
          }                                           // 结束 minHeightByLeaves 函数
          int main() {                                // 主函数：验证 h ≥ lg(n!) ≥ n lg n − n lg e
              bool ok = true;                         // 记录所有规模是否都满足下界
              for (int n = 8; n &lt;= 64; n *= 2) {      // 取 n = 8、16、32、64 四个规模依次验证
                  double h  = (double)minHeightByLeaves(n);   // 数叶子得到的树高下界
                  double lf = (double)lgFactorial(n);         // lg(n!) 的数值
                  double sl = (double)stirlingLower(n);       // Stirling 放缩给出的下界
                  if (h + 1e-6 &lt; lf) { ok = false; }          // 必须满足 h ≥ lg(n!)
                  if (lf + 1e-6 &lt; sl) { ok = false; }         // 必须满足 lg(n!) ≥ n lg n − n lg e
                  printf("n=%2d  h=%.0f  lg(n!)=%.3f  n*lgn-n*lge=%.3f\\n", n, h, lf, sl);   // 打印该规模的三个量
              }                                       // 结束规模循环
              printf("%s\\n", ok ? "PASS: h >= lg(n!) >= n*lgn - n*lge" : "FAIL");   // 汇总验证结论
              return ok ? 0 : 1;                      // 全部满足返回 0，否则返回 1
          }                                           // 结束 main 函数</code></pre>
                  </div>
                </div>
          
                <p>实测输出（n = 8 时 h = 16 ≥ lg(8!) = 15.299 ≥ 12.458；n = 64 时 h = 296 ≥ 295.995 ≥ 291.668）：</p>
                <pre class="code"><code>n= 8  h=16  lg(n!)=15.299  n*lgn-n*lge=12.458      // 8! = 40320，lg(8!) ≈ 15.299
          n=16  h=45  lg(n!)=44.250  n*lgn-n*lge=40.917      // 16! 的 lg 约为 44.250
          n=32  h=118  lg(n!)=117.663  n*lgn-n*lge=113.834   // 32! 的 lg 约为 117.663
          n=64  h=296  lg(n!)=295.995  n*lgn-n*lge=291.668   // 64! 的 lg 约为 295.995
          PASS: h &gt;= lg(n!) &gt;= n*lgn - n*lge                 // 四个规模全部满足下界</code></pre>
          
                <h3 id="sec-lower-bound-h3">3.3 引申（课后思考）：螺丝螺母问题</h3>
          
                <p>有一堆螺丝和一堆螺母，用肉眼无法辨别大小，螺丝只能靠螺母测大小，螺母亦然，请将它们一一配对。此题可以转化为<b>螺丝的排序问题</b>（把螺丝排好序后，螺母也随之有序），但要注意：此题决策树的状态发生了改变，<b>不再是二叉树，而是三叉树</b>，多了一个"<b>=</b>"的 decision。</p>
          
                <p>于是推导变成：</p>
                <ul>
                  <li>由于三叉树的特性，我们有 <span class="m">L &le; 3<sup>h</sup></span>；</li>
                  <li>而输出的排列组合为 n!，于是 <span class="m">n! &le; L &le; 3<sup>h</sup></span> <span class="m">&rArr;</span> <span class="m">h &ge; log n!</span> <span class="m">&rArr;</span> <span class="m">h &isin; &Omega;(n log n)</span>；</li>
                  <li>所以该问题的下界仍然是 <span class="m">n log n</span>（由于 <span class="m">3<sup>h</sup></span> 的底数变了，常数因子随之改变，但量级不变）。</li>
                </ul>
          
                <div class="callout tip">
                  <p class="callout-h">记忆</p>
                  <p>下界证明只有一条主线：<b>叶子数被夹住 <span class="m">n! &le; L &le; b<sup>h</sup></span> &rarr; 取对数 &rarr; <span class="m">h &ge; log<sub>b</sub>(n!)</span></b>。二叉树取 <span class="m">b = 2</span>，三叉树取 <span class="m">b = 3</span>，结论都是 <span class="m">&Omega;(n lg n)</span>。</p>
                </div>
        ` },
      ],
    },
    {
      id: 'sec-inversion',
      heading: "4. 简单排序算法的时间复杂度下界：逆序数",
      blocks: [
        { type: 'html', html: `
          <p><b>问题</b>：简单的排序算法（如冒泡、直接插入、选择排序）的最坏时间复杂度是 <span class="m">O(N<sup>2</sup>)</span>；而作为直接插入排序改进版本的<b>希尔排序能够突破 <span class="m">O(N<sup>2</sup>)</span> 的界，为什么？</b></p>
          
                <div class="callout key">
                  <p class="callout-h">定理（逆序数与相邻交换）</p>
                  <p><b>通过交换相邻元素进行排序的任何算法，平均需要 <span class="m">&Omega;(N<sup>2</sup>)</span> 时间。</b></p>
                  <p><b>逆序数</b> (inversion count)：数组中满足 <span class="m">i &lt; j</span> 但 <span class="m">A[i] &gt; A[j]</span> 的数对 <span class="m">(i, j)</span> 的个数。</p>
                </div>
          
                <p><b>推理链</b>（PPT 备注原文）：<b>排序的本质就是消除逆序数</b>；对于随机数组，逆序数是 <span class="m">O(N<sup>2</sup>)</span> 的；如果采用"交换相邻元素"的办法来消除逆序，<b>每次正好只消除一个</b>，因此必须执行 <span class="m">O(N<sup>2</sup>)</span> 的交换次数 —— 这就是冒泡、插入等算法只能到平方级别的原因。</p>
          
                <p>反过来：基于交换元素的排序要想突破这个下界，<b>必须执行一些比较、交换相隔比较远的元素，使得一次交换能消除一个以上的逆序</b>。<b>希尔、快排、堆排等等算法都是交换比较远的元素</b>。</p>
          
                <svg class="fig" viewBox="0 0 960 366" role="img" aria-label="逆序数示意：左侧相邻交换每次只减少一个逆序，右侧交换相隔较远的元素一次可以消除多个逆序">
                  <text x="26" y="24" class="tx-b">排序的本质就是消除逆序数</text>
                  <line x1="480" y1="34" x2="480" y2="330" stroke="var(--c-line-soft)"></line>
                  <!-- 左panel -->
                  <text x="30" y="56" class="tx-b" fill="var(--c-accent)">相邻交换（冒泡 / 直接插入）</text>
                  <text x="30" y="76" class="tx-sm">每次只能交换相邻的两个元素</text>
                  <text x="40" y="88" class="tx-sm">A：</text>
                  <rect x="76" y="98" width="58" height="44" rx="5" fill="var(--c-warn-bg)" stroke="var(--c-hot)" stroke-width="2.2"></rect>
                  <text x="105" y="127" class="tx tx-b" text-anchor="middle">4</text>
                  <rect x="142" y="98" width="58" height="44" rx="5" fill="var(--c-warn-bg)" stroke="var(--c-hot)" stroke-width="2.2"></rect>
                  <text x="171" y="127" class="tx tx-b" text-anchor="middle">3</text>
                  <rect x="208" y="98" width="58" height="44" rx="5" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.4"></rect>
                  <text x="237" y="127" class="tx" text-anchor="middle">2</text>
                  <rect x="274" y="98" width="58" height="44" rx="5" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.4"></rect>
                  <text x="303" y="127" class="tx" text-anchor="middle">1</text>
                  <text x="348" y="127" class="tx-sm">逆序数 = 6</text>
                  <line x1="140" y1="150" x2="140" y2="180" stroke="var(--c-hot)" stroke-width="2.2"></line>
                  <polygon points="134,172 146,172 140,180" fill="var(--c-hot)"></polygon>
                  <text x="150" y="170" class="tx-sm" fill="var(--c-hot)">交换相邻的 4 与 3</text>
                  <rect x="76" y="190" width="58" height="44" rx="5" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.4"></rect>
                  <text x="105" y="219" class="tx" text-anchor="middle">3</text>
                  <rect x="142" y="190" width="58" height="44" rx="5" fill="var(--c-ok)" opacity="0.12"></rect>
                  <rect x="142" y="190" width="58" height="44" rx="5" fill="none" stroke="var(--c-line)" stroke-width="1.4"></rect>
                  <text x="171" y="219" class="tx" text-anchor="middle">4</text>
                  <rect x="208" y="190" width="58" height="44" rx="5" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.4"></rect>
                  <text x="237" y="219" class="tx" text-anchor="middle">2</text>
                  <rect x="274" y="190" width="58" height="44" rx="5" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.4"></rect>
                  <text x="303" y="219" class="tx" text-anchor="middle">1</text>
                  <text x="348" y="219" class="tx-sm" fill="var(--c-hot)">逆序数 = 5（只减 1）</text>
                  <text x="30" y="270" class="tx-sm">⟨4,3,2,1⟩ 共有 6 个逆序；一次相邻交换只消掉 1 个，</text>
                  <text x="30" y="292" class="tx-sm">所以要把逆序全部消完，至少要 6 次交换 &rArr; O(N²)。</text>
                  <text x="30" y="320" class="tx-b" fill="var(--c-hot)">每次相邻交换：逆序数减少量恰好 = 1</text>
                  <!-- 右panel -->
                  <text x="510" y="56" class="tx-b" fill="var(--c-accent-2)">交换相隔较远的元素（希尔 / 快排 / 堆排）</text>
                  <text x="510" y="76" class="tx-sm">一次交换可以跨过中间的多个元素</text>
                  <text x="520" y="88" class="tx-sm">A：</text>
                  <rect x="556" y="98" width="58" height="44" rx="5" fill="var(--c-warn-bg)" stroke="var(--c-hot)" stroke-width="2.2"></rect>
                  <text x="585" y="127" class="tx tx-b" text-anchor="middle">4</text>
                  <rect x="622" y="98" width="58" height="44" rx="5" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.4"></rect>
                  <text x="651" y="127" class="tx" text-anchor="middle">3</text>
                  <rect x="688" y="98" width="58" height="44" rx="5" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.4"></rect>
                  <text x="717" y="127" class="tx" text-anchor="middle">2</text>
                  <rect x="754" y="98" width="58" height="44" rx="5" fill="var(--c-warn-bg)" stroke="var(--c-hot)" stroke-width="2.2"></rect>
                  <text x="783" y="127" class="tx tx-b" text-anchor="middle">1</text>
                  <text x="828" y="127" class="tx-sm">逆序数 = 6</text>
                  <line x1="585" y1="150" x2="783" y2="180" stroke="var(--c-hot)" stroke-width="2.2" stroke-dasharray="6 4"></line>
                  <polygon points="777,172 789,172 783,180" fill="var(--c-hot)"></polygon>
                  <text x="600" y="170" class="tx-sm" fill="var(--c-hot)">直接交换 4 与 1（跨过 3 与 2）</text>
                  <rect x="556" y="190" width="58" height="44" rx="5" fill="var(--c-tip-bg)" stroke="var(--c-ok)" stroke-width="2"></rect>
                  <text x="585" y="219" class="tx" text-anchor="middle">1</text>
                  <rect x="622" y="190" width="58" height="44" rx="5" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.4"></rect>
                  <text x="651" y="219" class="tx" text-anchor="middle">3</text>
                  <rect x="688" y="190" width="58" height="44" rx="5" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.4"></rect>
                  <text x="717" y="219" class="tx" text-anchor="middle">2</text>
                  <rect x="754" y="190" width="58" height="44" rx="5" fill="var(--c-tip-bg)" stroke="var(--c-ok)" stroke-width="2"></rect>
                  <text x="783" y="219" class="tx" text-anchor="middle">4</text>
                  <text x="828" y="219" class="tx-sm" fill="var(--c-ok)">逆序数 = 1</text>
                  <text x="510" y="270" class="tx-sm">同一次"交换 4 与 1"，一步就消掉了 (4,3)(4,2)(4,1)(3,1)(2,1)</text>
                  <text x="510" y="292" class="tx-sm">五个逆序 —— 这就是希尔 / 快排 / 堆排能突破 O(N²) 的原因。</text>
                  <text x="510" y="320" class="tx-b" fill="var(--c-ok)">远距离交换：一次交换可消除多个逆序</text>
                  <text x="26" y="352" class="tx-sm">平均意义下：随机数组的逆序数是 O(N²) 量级，只交换相邻元素就只能一个一个地消，必须 O(N²) 次；想突破就必须"跳着换"。</text>
                </svg>
                <p class="fig-cap">图 3 &nbsp;逆序数与相邻交换下界：左侧每次只减 1，右侧一次可减多个</p>
          
                <h3 id="sec-inversion-h1">4.1 各排序算法一句话回顾</h3>
          
                <table class="tbl">
                  <thead><tr><th>算法</th><th>一句话要点</th><th>复杂度 / 性质</th></tr></thead>
                  <tbody>
                    <tr>
                      <td><b>冒泡排序</b></td>
                      <td>比较相邻的元素，如果第一个比第二个大就交换；通过无序区<b>相邻元素</b>的比较和位置交换，使最大的元素往上移动，每一轮选出无序区最大的元素加入有序区。</td>
                      <td>用时间换空间；最好 <span class="m">O(n)</span>（数据本来就有序），最差 <span class="m">O(N<sup>2</sup>)</span></td>
                    </tr>
                    <tr>
                      <td><b>插入排序</b></td>
                      <td>通过构建有序序列，对于未排序数据，在已排序序列中<b>从后向前扫描</b>，找到相应位置并插入；需要反复把已排序元素逐步向后挪位，为最新元素提供插入空间。</td>
                      <td>最好 <span class="m">O(n)</span>、最差 <span class="m">O(N<sup>2</sup>)</span>；稳定</td>
                    </tr>
                    <tr>
                      <td><b>希尔排序</b></td>
                      <td>缩小增量排序：是直接插入排序的改进版本，把记录按下标的<b>一定增量分组</b>，对每组使用直接插入排序；随着增量逐渐减少，每组包含的关键词越来越多，当<b>增量减至 1</b> 时整个文件恰被分成一组，算法终止。</td>
                      <td>平均 <span class="m">O(n log<sup>2</sup> n)</span>；能突破 <span class="m">O(N<sup>2</sup>)</span> 的界</td>
                    </tr>
                    <tr>
                      <td><b>选择排序</b></td>
                      <td>首先在未排序序列中找到最小（大）元素，存放到排序序列的起始位置；再从剩余未排序元素中继续寻找最小（大）元素，放到已排序序列的末尾，以此类推。</td>
                      <td><b>最好也是 <span class="m">O(N<sup>2</sup>)</span></b>；不稳定</td>
                    </tr>
                    <tr>
                      <td><b>归并排序</b></td>
                      <td>分治法：先使每个子序列有序，再使子序列段间有序；将已有序的子序列合并，得到完全有序的序列。</td>
                      <td><span class="m">O(n log n)</span>；稳定、效率高但比较占内存</td>
                    </tr>
                    <tr>
                      <td><b>快速排序</b></td>
                      <td>分治：通过一趟排序将待排记录分隔成独立的两部分，其中一部分记录的关键字均比另一部分的关键字小，再分别对这两部分继续排序。</td>
                      <td>平均 <span class="m">O(n log n)</span>、最坏 <span class="m">O(N<sup>2</sup>)</span>；不稳定</td>
                    </tr>
                    <tr>
                      <td><b>堆排序</b></td>
                      <td>利用<b>堆</b>这种数据结构设计的排序算法；堆是一个近似完全二叉树的结构，满足子结点的键值或索引总是小于（或者大于）它的父节点。</td>
                      <td><span class="m">O(n log n)</span>；渐进最佳的比较排序之一</td>
                    </tr>
                  </tbody>
                </table>
          
                <div class="callout warn">
                  <p class="callout-h">易错：是否所有排序算法的最好时间复杂度都是 O(n)？</p>
                  <p><b>不是。</b><b>选择排序的最好时间复杂度也是 <span class="m">O(N<sup>2</sup>)</span></b> —— 因为无论数据是否已经有序，它都必须把无序区完整扫一遍才能确定最小（大）元素，比较次数固定在 <span class="m">&Theta;(N<sup>2</sup>)</span> 量级，与初始次序无关。冒泡、插入在数据已经有序时可以做到 <span class="m">O(n)</span>，选择排序不行。</p>
                </div>
          
                <p><b>延伸问题</b>：<b>求一个数组里面最小的 k 个数？</b>（提示：可以借用堆 —— 维护一个大小为 k 的大顶堆，或借用快速排序的划分思想，本讲不展开。）</p>
        ` },
      ],
    },
    {
      id: 'sec-counting-sort',
      heading: "5. 计数排序（Counting Sort）",
      blocks: [
        { type: 'html', html: `
          <div class="callout key">
                  <p class="callout-h">核心特征</p>
                  <p><b>各项之间不进行比较。</b></p>
                  <ul>
                    <li><b>输入</b>：<span class="m">A[1..n]</span>，且 <span class="m">A[j] &isin; {1, 2, …, k}</span>；</li>
                    <li><b>输出</b>：<span class="m">B[1..n]</span>，有序；</li>
                    <li><b>辅助存储</b>：<span class="m">C[1..k]</span>。</li>
                  </ul>
                  <p>1954 年由 <b>Harold H. Seward</b> 提出。</p>
                </div>
          
                <h3 id="sec-counting-sort-h1">5.1 基本思想与四个步骤</h3>
          
                <p>计数排序假设 n 个输入元素中的每一个都是介于 0 到 k 之间的整数。举例：10 个年龄不同的人，统计出有 8 个人的年龄比 A 小，那 A 的年龄就排在第 9 位；用这个方法可以得到其他每个人的位置，也就排好了序。<b>年龄有重复时需要特殊处理（保证稳定性）</b> —— 这正是算法最后一步的作用。</p>
          
                <p>优势在于：对一定范围内的整数排序时，它的复杂度为 <span class="m">O(n + k)</span>（其中 k 是整数的范围），<b>快于任何比较排序算法</b>。当然这是一种<b>牺牲空间换取时间</b>的做法，而且当 <span class="m">O(k) &gt; O(n &middot; log(n))</span> 的时候，其效率反而不如基于比较的排序。</p>
          
                <p>PPT 给出的<b>算法基本步骤（四步）</b>：</p>
                <ol>
                  <li>找出待排序的数组中最大和最小的元素；</li>
                  <li>统计数组中每个值为 i 的元素出现的次数，存入数组 C 的第 i 项；</li>
                  <li>对所有的计数累加（从 C 中的第一个元素开始，每一项和前一项相加）；</li>
                  <li>反向填充目标数组：将每个元素 i 放在新数组的第 C(i) 项，每放一个元素就将 C(i) 减去 1。</li>
                </ol>
          
                <svg class="fig" viewBox="0 0 900 440" role="img" aria-label="计数排序的三数组状态图：输入数组 A 为 4 1 3 4 3，计数数组 C 先统计次数再前缀累加，输出数组 B 为 1 3 3 4 4">
                  <text x="26" y="26" class="tx-b">计数排序三数组状态图（算例 A = ⟨4, 1, 3, 4, 3⟩，n = 5，k = 4）</text>
                  <!-- A 行 -->
                  <text x="16" y="110" class="tx-sm">A（输入）</text>
                  <text x="211" y="56" class="tx-sm" text-anchor="middle">1</text>
                  <text x="281" y="56" class="tx-sm" text-anchor="middle">2</text>
                  <text x="351" y="56" class="tx-sm" text-anchor="middle">3</text>
                  <text x="421" y="56" class="tx-sm" text-anchor="middle">4</text>
                  <text x="491" y="56" class="tx-sm" text-anchor="middle">5</text>
                  <rect x="180" y="64" width="62" height="44" rx="5" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="1.6"></rect>
                  <text x="211" y="93" class="tx" text-anchor="middle">4</text>
                  <rect x="250" y="64" width="62" height="44" rx="5" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="1.6"></rect>
                  <text x="281" y="93" class="tx" text-anchor="middle">1</text>
                  <rect x="320" y="64" width="62" height="44" rx="5" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="1.6"></rect>
                  <text x="351" y="93" class="tx" text-anchor="middle">3</text>
                  <rect x="390" y="64" width="62" height="44" rx="5" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="1.6"></rect>
                  <text x="421" y="93" class="tx" text-anchor="middle">4</text>
                  <rect x="460" y="64" width="62" height="44" rx="5" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="1.6"></rect>
                  <text x="491" y="93" class="tx" text-anchor="middle">3</text>
                  <text x="560" y="86" class="tx-sm">A = ⟨4, 1, 3, 4, 3⟩</text>
                  <text x="560" y="108" class="tx-sm">n = 5，每个关键字都在 1..k = 4 之内</text>
                  <!-- C 行（计数） -->
                  <text x="16" y="200" class="tx-sm">C（计数 key = i）</text>
                  <text x="211" y="146" class="tx-sm" text-anchor="middle">1</text>
                  <text x="281" y="146" class="tx-sm" text-anchor="middle">2</text>
                  <text x="351" y="146" class="tx-sm" text-anchor="middle">3</text>
                  <text x="421" y="146" class="tx-sm" text-anchor="middle">4</text>
                  <rect x="180" y="154" width="62" height="44" rx="5" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.4"></rect>
                  <text x="211" y="183" class="tx" text-anchor="middle">1</text>
                  <rect x="250" y="154" width="62" height="44" rx="5" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.4"></rect>
                  <text x="281" y="183" class="tx" text-anchor="middle">0</text>
                  <rect x="320" y="154" width="62" height="44" rx="5" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.4"></rect>
                  <text x="351" y="183" class="tx" text-anchor="middle">2</text>
                  <rect x="390" y="154" width="62" height="44" rx="5" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.4"></rect>
                  <text x="421" y="183" class="tx" text-anchor="middle">2</text>
                  <text x="560" y="176" class="tx-sm">循环2 之后：C = [1, 0, 2, 2]</text>
                  <text x="560" y="198" class="tx-sm">值 1 出现 1 次、2 出现 0 次、3 出现 2 次、4 出现 2 次</text>
                  <!-- C 行（累加） -->
                  <text x="16" y="290" class="tx-sm">C（累加 key ≤ i）</text>
                  <text x="211" y="236" class="tx-sm" text-anchor="middle">1</text>
                  <text x="281" y="236" class="tx-sm" text-anchor="middle">2</text>
                  <text x="351" y="236" class="tx-sm" text-anchor="middle">3</text>
                  <text x="421" y="236" class="tx-sm" text-anchor="middle">4</text>
                  <rect x="180" y="244" width="62" height="44" rx="5" fill="var(--c-warn-bg)" stroke="var(--c-hot)" stroke-width="1.8"></rect>
                  <text x="211" y="273" class="tx" text-anchor="middle">1</text>
                  <rect x="250" y="244" width="62" height="44" rx="5" fill="var(--c-warn-bg)" stroke="var(--c-hot)" stroke-width="1.8"></rect>
                  <text x="281" y="273" class="tx" text-anchor="middle">1</text>
                  <rect x="320" y="244" width="62" height="44" rx="5" fill="var(--c-warn-bg)" stroke="var(--c-hot)" stroke-width="1.8"></rect>
                  <text x="351" y="273" class="tx" text-anchor="middle">3</text>
                  <rect x="390" y="244" width="62" height="44" rx="5" fill="var(--c-warn-bg)" stroke="var(--c-hot)" stroke-width="1.8"></rect>
                  <text x="421" y="273" class="tx" text-anchor="middle">5</text>
                  <text x="560" y="266" class="tx-sm">循环3 之后：C = [1, 1, 3, 5]</text>
                  <text x="560" y="288" class="tx-sm">C[i] = |{key ≤ i}|：不超过 i 的元素个数（C[4] = 5 = n）</text>
                  <!-- B 行 -->
                  <text x="16" y="380" class="tx-sm">B（输出）</text>
                  <text x="211" y="326" class="tx-sm" text-anchor="middle">1</text>
                  <text x="281" y="326" class="tx-sm" text-anchor="middle">2</text>
                  <text x="351" y="326" class="tx-sm" text-anchor="middle">3</text>
                  <text x="421" y="326" class="tx-sm" text-anchor="middle">4</text>
                  <text x="491" y="326" class="tx-sm" text-anchor="middle">5</text>
                  <rect x="180" y="334" width="62" height="44" rx="5" fill="var(--c-tip-bg)" stroke="var(--c-ok)" stroke-width="1.8"></rect>
                  <text x="211" y="363" class="tx" text-anchor="middle">1</text>
                  <rect x="250" y="334" width="62" height="44" rx="5" fill="var(--c-tip-bg)" stroke="var(--c-ok)" stroke-width="1.8"></rect>
                  <text x="281" y="363" class="tx" text-anchor="middle">3</text>
                  <rect x="320" y="334" width="62" height="44" rx="5" fill="var(--c-tip-bg)" stroke="var(--c-ok)" stroke-width="1.8"></rect>
                  <text x="351" y="363" class="tx" text-anchor="middle">3</text>
                  <rect x="390" y="334" width="62" height="44" rx="5" fill="var(--c-tip-bg)" stroke="var(--c-ok)" stroke-width="1.8"></rect>
                  <text x="421" y="363" class="tx" text-anchor="middle">4</text>
                  <rect x="460" y="334" width="62" height="44" rx="5" fill="var(--c-tip-bg)" stroke="var(--c-ok)" stroke-width="1.8"></rect>
                  <text x="491" y="363" class="tx" text-anchor="middle">4</text>
                  <text x="560" y="356" class="tx-sm" fill="var(--c-ok)">循环4 之后：B = ⟨1, 3, 3, 4, 4⟩（有序）</text>
                  <text x="560" y="378" class="tx-sm">两个 3、两个 4 的相对次序与原数组一致</text>
                  <text x="26" y="416" class="tx-sm">C 的下标就是关键字本身：C[A[j]] 直接给出"≤ A[j] 的元素个数"；循环4 每次写入后把 C[A[j]] 减 1，就能把相等的元素依次往前放。</text>
                </svg>
                <p class="fig-cap">图 4 &nbsp;计数排序三数组状态图：A（输入）、C（先计数后累加）、B（输出）</p>
          
                <h3 id="sec-counting-sort-h2">5.2 逐帧动画：A = &lang;4, 1, 3, 4, 3&rang;，k = 4</h3>
          
                <p>下面这个动画完整走一遍 PPT 的算例，共 20 步，四个循环（初始化 C、逐元素计数、前缀累加、反向填充）一步不落；每一步都显示 <span class="m">A[j]</span>、<span class="m">C[A[j]]</span>、写入 B 的哪一位以及 C 的减 1。</p>
        ` },
        { type: 'demo', name: 'counting-sort', title: "计数排序执行过程：A = &lang;4, 1, 3, 4, 3&rang;（20 步，覆盖四个循环）" },
        { type: 'html', html: `
          <p>把动画逐帧抄成表格，就是 PPT 第 30～44 页的全部中间状态：</p>
          
                <table class="tbl">
                  <thead><tr><th>阶段</th><th>C 的状态</th><th>B 的状态</th><th>说明</th></tr></thead>
                  <tbody>
                    <tr><td>初始</td><td class="num">— — — —</td><td class="num">_ _ _ _ _</td><td>A = ⟨4, 1, 3, 4, 3⟩，C 尚未初始化</td></tr>
                    <tr><td>循环1 之后</td><td class="num">0 0 0 0</td><td class="num">_ _ _ _ _</td><td>k = 4 个计数器清零</td></tr>
                    <tr><td>循环2：j = 1</td><td class="num">0 0 0 1</td><td class="num">_ _ _ _ _</td><td>A[1] = 4 &rArr; C[4] = 1</td></tr>
                    <tr><td>循环2：j = 2</td><td class="num">1 0 0 1</td><td class="num">_ _ _ _ _</td><td>A[2] = 1 &rArr; C[1] = 1</td></tr>
                    <tr><td>循环2：j = 3</td><td class="num">1 0 1 1</td><td class="num">_ _ _ _ _</td><td>A[3] = 3 &rArr; C[3] = 1</td></tr>
                    <tr><td>循环2：j = 4</td><td class="num">1 0 1 2</td><td class="num">_ _ _ _ _</td><td>A[4] = 4 &rArr; C[4] = 2</td></tr>
                    <tr><td>循环2 之后</td><td class="num">1 0 2 2</td><td class="num">_ _ _ _ _</td><td>A[5] = 3 &rArr; C[3] = 2；此时 C[i] = |{key = i}|</td></tr>
                    <tr><td>循环3：i = 2</td><td class="num">1 1 2 2</td><td class="num">_ _ _ _ _</td><td>C[2] ← C[2] + C[1] = 0 + 1 = 1</td></tr>
                    <tr><td>循环3：i = 3</td><td class="num">1 1 3 2</td><td class="num">_ _ _ _ _</td><td>C[3] ← C[3] + C[2] = 2 + 1 = 3</td></tr>
                    <tr><td>循环3 之后</td><td class="num">1 1 3 5</td><td class="num">_ _ _ _ _</td><td>C[4] ← C[4] + C[3] = 2 + 3 = 5；此时 C[i] = |{key ≤ i}|</td></tr>
                    <tr><td>循环4：j = 5</td><td class="num">1 1 2 5</td><td class="num">_ _ 3 _ _</td><td>A[5] = 3，C[3] = 3 &rArr; B[3] ← 3，C[3] ← 2</td></tr>
                    <tr><td>循环4：j = 4</td><td class="num">1 1 2 4</td><td class="num">_ _ 3 _ 4</td><td>A[4] = 4，C[4] = 5 &rArr; B[5] ← 4，C[4] ← 4</td></tr>
                    <tr><td>循环4：j = 3</td><td class="num">1 1 1 4</td><td class="num">_ 3 3 _ 4</td><td>A[3] = 3，C[3] = 2 &rArr; B[2] ← 3，C[3] ← 1</td></tr>
                    <tr><td>循环4：j = 2</td><td class="num">0 1 1 4</td><td class="num">1 3 3 _ 4</td><td>A[2] = 1，C[1] = 1 &rArr; B[1] ← 1，C[1] ← 0</td></tr>
                    <tr><td>循环4：j = 1</td><td class="num">0 1 1 3</td><td class="num">1 3 3 4 4</td><td>A[1] = 4，C[4] = 4 &rArr; B[4] ← 4，C[4] ← 3</td></tr>
                  </tbody>
                </table>
          
                <h3 id="sec-counting-sort-h3">5.3 伪代码 + C++（逐行注释）</h3>
          
                <p>伪代码忠实还原 PPT 第 45 页的四段循环写法（PPT 原文的 <span class="m">&larr;</span>、<span class="m">⊳</span> 记号一并保留）。</p>
          
                <div class="code-pair">
                  <div class="code-col">
                    <p class="code-h">伪代码（PPT 写法）</p>
                    <pre class="code"><code>COUNTING-SORT(A, B, k)              // 输入 A[1..n]（值域 1..k），输出有序数组 B[1..n]
          1  for i←1 to k                     // 循环1：遍历整个值域 1..k
          2      do C[i] ← 0                  // 把第 i 个计数器清零
          3  for j←1 to n                     // 循环2：顺序扫描输入数组 A
          4      do C[A[j]] ← C[A[j]] + 1     // 统计次数 ⊳ C[i] = |{key = i}|
          5  for i←2 to k                     // 循环3：从第 2 项开始做前缀累加
          6      do C[i] ← C[i] + C[i–1]      // 累加 ⊳ C[i] = |{key ≤ i}|
          7  for j←n downto 1                 // 循环4：从 n 递减到 1，反向填充（保证稳定）
          8      do B[C[A[j]]] ← A[j]         // 把 A[j] 放到它最终的位置上
          9         C[A[j]] ← C[A[j]] – 1     // 该位置已被占用，计数减 1 留给下一个相等的元素
          10 return B                         // 返回排好序的数组 B</code></pre>
                  </div>
                  <div class="code-col">
                    <p class="code-h">C++</p>
                    <pre class="code cpp"><code>#include &lt;cstdio&gt;                           // 打印排序结果
          // 计数排序：A[0..n-1] 的取值都在 1..k 之间，结果写入 B[0..n-1]
          void countingSort(const int A[], int B[], int n, int k) {   // 对应伪代码 COUNTING-SORT(A, B, k)
              int C[16];                              // 计数数组 C[1..k]，这里限定 k 不超过 16
              for (int i = 1; i &lt;= k; ++i) { C[i] = 0; }   // 循环1：把 C[1..k] 全部清零
              for (int j = 0; j &lt; n; ++j) { ++C[A[j]]; }   // 循环2：统计每个关键字的出现次数，C[i]=|{key=i}|
              for (int i = 2; i &lt;= k; ++i) { C[i] += C[i - 1]; }   // 循环3：前缀累加，C[i]=|{key&lt;=i}|
              for (int j = n - 1; j &gt;= 0; --j) {      // 循环4：从后往前反向填充，这一步保证排序稳定
                  B[C[A[j]] - 1] = A[j];              // A[j] 的最终位置是 C[A[j]]（换成 0 起下标要减 1）
                  --C[A[j]];                          // 该位置已被占用，计数减 1 留给下一个相等的元素
              }                                       // 结束循环4：反向填充完毕，B 已经有序
          }                                           // 结束 countingSort 函数
          int main() {                                // 主函数：用 PPT 的算例 A = &lt;4,1,3,4,3&gt; 验证
              int A[5] = {4, 1, 3, 4, 3};             // 课程 PPT 的算例，n = 5
              int B[5] = {0, 0, 0, 0, 0};             // 输出数组 B[1..5]，先全部置 0
              countingSort(A, B, 5, 4);               // k = 4：关键字取值范围 1..4
              for (int i = 0; i &lt; 5; ++i) {           // 逐个打印排序结果，期望 1 3 3 4 4
                  printf("%d%c", B[i], i + 1 == 5 ? '\\n' : ' ');   // 数字之间空格分隔，末尾换行
              }                                       // 结束打印循环
              return 0;                               // 正常结束
          }                                           // 结束 main 函数</code></pre>
                  </div>
                </div>
          
                <p>用 <b>g++ 实测</b>（<code>g++ -std=c++11 -O2 -Wall countingsort.cpp -o countingsort.exe</code>），运行输出：</p>
                <pre class="code"><code>1 3 3 4 4                    // 与 PPT 算例的最终结果 B = ⟨1, 3, 3, 4, 4⟩ 完全一致</code></pre>
          
                <h3 id="sec-counting-sort-h4">5.4 运行时间分析</h3>
          
                <p>PPT 第 47 页给四个循环逐行标注了代价：</p>
          
                <table class="tbl">
                  <thead><tr><th>循环</th><th>代码</th><th>执行次数</th><th>该段代价</th></tr></thead>
                  <tbody>
                    <tr><td>循环1</td><td class="num">for i ← 1 to k do C[i] ← 0</td><td class="num">k</td><td class="num">&Theta;(k)</td></tr>
                    <tr><td>循环2</td><td class="num">for j ← 1 to n do C[A[j]] ← C[A[j]] + 1</td><td class="num">n</td><td class="num">&Theta;(n)</td></tr>
                    <tr><td>循环3</td><td class="num">for i ← 2 to k do C[i] ← C[i] + C[i−1]</td><td class="num">k &minus; 1</td><td class="num">&Theta;(k)</td></tr>
                    <tr><td>循环4</td><td class="num">for j ← n downto 1 do B[C[A[j]]] ← A[j]; C[A[j]] ← C[A[j]] − 1</td><td class="num">n</td><td class="num">&Theta;(n)</td></tr>
                    <tr><td colspan="3"><b>总计</b></td><td class="num"><b>&Theta;(n + k)</b></td></tr>
                  </tbody>
                </table>
          
                <p>如果 <span class="m">k = O(n)</span>，那么计数排序用的时间为 <span class="m">&Theta;(n)</span>。空间复杂度是 <span class="m">O(k)</span>；缺点是 m（值域）比较大时的复杂度很差。</p>
          
                <div class="callout warn">
                  <p class="callout-h">最容易被问倒的一点：排序的时间是 &Omega;(n lg n)，那计数排序怎么能做到 &Theta;(n)？</p>
                  <p><b>比较排序</b>的时间是 <span class="m">&Omega;(n lg n)</span>；<b>计数排序不是比较排序</b>；实际上，<b>各项之间根本没有比较</b>！下界定理的前提是"只允许通过比较来获得顺序信息"，计数排序绕开了这个前提 —— 它直接用一个大小为 k 的计数数组把"值"当成"下标"来用。</p>
                </div>
          
                <h3 id="sec-counting-sort-h5">5.5 稳定性</h3>
          
                <p><b>计数排序是一种稳定排序：它会保持相等的项的相对顺序。</b></p>
                <p>稳定性的来源就是循环4 的 <b>for j ← n downto 1</b>：反向填充时，<b>后</b>出现的相等元素先被放进它所在区间的<b>末尾</b>，于是<b>先</b>出现的相等元素最终落在更靠前的位置，相对次序得以保持。如果改成正向填充（j 从 1 到 n），相等元素的相对次序就会反转，计数排序也就不再稳定。</p>
                <p><b>练习</b>：哪种其他的排序有这种特征？（归并排序、插入排序、冒泡排序都是稳定的。）</p>
          
                <div class="callout key">
                  <p class="callout-h">考点归纳</p>
                  <ol>
                    <li>计数排序<b>不比较</b>元素，靠"值 → 下标"的映射定位；</li>
                    <li>四段循环：清零 <span class="m">&Theta;(k)</span>、计数 <span class="m">&Theta;(n)</span>、累加 <span class="m">&Theta;(k)</span>、反向填充 <span class="m">&Theta;(n)</span>，总计 <span class="m">&Theta;(n + k)</span>；</li>
                    <li>算例 <span class="m">A = &lang;4, 1, 3, 4, 3&rang;</span> 的四步状态：C = [0,0,0,0] &rarr; C = [1,0,2,2] &rarr; C = [1,1,3,5] &rarr; B = ⟨1, 3, 3, 4, 4⟩；</li>
                    <li>稳定：反向填充是稳定性的唯一来源；</li>
                    <li>代价：时间 <span class="m">&Theta;(n + k)</span>、空间 <span class="m">O(k)</span>，<span class="m">k</span> 很大时反而劣于比较排序。</li>
                  </ol>
                </div>
        ` },
      ],
    },
    {
      id: 'sec-radix-sort',
      heading: "6. 基数排序（Radix Sort）",
      blocks: [
        { type: 'html', html: `
          <div class="callout key">
                  <p class="callout-h">基本思想</p>
                  <p>将整数<b>按位数切割</b>成不同的数字，然后按每个位数分别比较（<b>元素级别的分治法</b>）。所谓的<b>基数（radix）</b>，也就是"<b>进制</b>"的意思，所谓的"每一位"是该进制下的位。</p>
                </div>
          
                <p><b>实现方式</b>：</p>
                <ol>
                  <li>将所有待比较数值（正整数）统一为同样的数位长度，数位较短的数前面补零；</li>
                  <li><b>从最低位开始，依次进行一次排序</b>。</li>
                </ol>
                <p>从最低位排序一直到最高位排序完成以后，数列就变成一个有序序列。通俗地讲，之所以先排低位再排高位，是因为<b>越是后排的数位，其对结果次序的影响越大</b>，很显然是高位比低位对数的大小影响大。</p>
          
                <p><b>起源（简）</b>：发源于 <b>Herman Hollerith 为 1890 年美国人口普查设计的卡排序机</b>，思路就是一位一位地排序。Hollerith 最初（不好）的想法是<b>从最高位开始排序</b>；好的想法是<b>使用辅助的稳定排序方法从最低位开始排序</b>。他在 1889 年的最初专利展示的正是<b>最高位优先</b>的基数排序：</p>
                <p class="formula">&ldquo;The most complicated combinations can readily be counted with comparatively few counters or relays by first assorting the cards according to the first items entering into the combinations, then reassorting each group according to the second item entering into the combination, and so on … &rdquo;</p>
                <p>而<b>最低位优先的基数排序好像是由一位机器操作员发明的</b>。</p>
          
                <svg class="fig" viewBox="0 0 900 460" role="img" aria-label="基数排序逐趟示意：7 个三位数依次按个位、十位、百位排序，最终得到 329 355 436 457 657 720 839">
                  <text x="26" y="24" class="tx-b">基数排序逐趟示意（7 个三位数，LSD：个位 → 十位 → 百位）</text>
                  <text x="135" y="46" class="tx-sm" text-anchor="middle">初始序列</text>
                  <text x="345" y="46" class="tx-sm" text-anchor="middle">第 1 趟后（按个位）</text>
                  <text x="555" y="46" class="tx-sm" text-anchor="middle">第 2 趟后（按十位）</text>
                  <text x="765" y="46" class="tx-sm" text-anchor="middle">第 3 趟后（按百位）</text>
                  <!-- 第 1 列：初始序列，高亮个位 -->
                  <rect x="140" y="67" width="16" height="24" rx="3" fill="var(--c-warn)" opacity="0.22"></rect>
                  <text x="122" y="84" class="tx">3</text><text x="135" y="84" class="tx">2</text><text x="148" y="84" class="tx tx-b">9</text>
                  <rect x="140" y="113" width="16" height="24" rx="3" fill="var(--c-warn)" opacity="0.22"></rect>
                  <text x="122" y="130" class="tx">4</text><text x="135" y="130" class="tx">5</text><text x="148" y="130" class="tx tx-b">7</text>
                  <rect x="140" y="159" width="16" height="24" rx="3" fill="var(--c-warn)" opacity="0.22"></rect>
                  <text x="122" y="176" class="tx">6</text><text x="135" y="176" class="tx">5</text><text x="148" y="176" class="tx tx-b">7</text>
                  <rect x="140" y="205" width="16" height="24" rx="3" fill="var(--c-warn)" opacity="0.22"></rect>
                  <text x="122" y="222" class="tx">8</text><text x="135" y="222" class="tx">3</text><text x="148" y="222" class="tx tx-b">9</text>
                  <rect x="140" y="251" width="16" height="24" rx="3" fill="var(--c-warn)" opacity="0.22"></rect>
                  <text x="122" y="268" class="tx">4</text><text x="135" y="268" class="tx">3</text><text x="148" y="268" class="tx tx-b">6</text>
                  <rect x="140" y="297" width="16" height="24" rx="3" fill="var(--c-warn)" opacity="0.22"></rect>
                  <text x="122" y="314" class="tx">7</text><text x="135" y="314" class="tx">2</text><text x="148" y="314" class="tx tx-b">0</text>
                  <rect x="140" y="343" width="16" height="24" rx="3" fill="var(--c-warn)" opacity="0.22"></rect>
                  <text x="122" y="360" class="tx">3</text><text x="135" y="360" class="tx">5</text><text x="148" y="360" class="tx tx-b">5</text>
                  <!-- 第 2 列：按个位排序后，高亮十位 -->
                  <rect x="337" y="67" width="16" height="24" rx="3" fill="var(--c-warn)" opacity="0.22"></rect>
                  <text x="332" y="84" class="tx">7</text><text x="345" y="84" class="tx tx-b">2</text><text x="358" y="84" class="tx">0</text>
                  <rect x="337" y="113" width="16" height="24" rx="3" fill="var(--c-warn)" opacity="0.22"></rect>
                  <text x="332" y="130" class="tx">3</text><text x="345" y="130" class="tx tx-b">5</text><text x="358" y="130" class="tx">5</text>
                  <rect x="337" y="159" width="16" height="24" rx="3" fill="var(--c-warn)" opacity="0.22"></rect>
                  <text x="332" y="176" class="tx">4</text><text x="345" y="176" class="tx tx-b">3</text><text x="358" y="176" class="tx">6</text>
                  <rect x="337" y="205" width="16" height="24" rx="3" fill="var(--c-warn)" opacity="0.22"></rect>
                  <text x="332" y="222" class="tx">4</text><text x="345" y="222" class="tx tx-b">5</text><text x="358" y="222" class="tx">7</text>
                  <rect x="337" y="251" width="16" height="24" rx="3" fill="var(--c-warn)" opacity="0.22"></rect>
                  <text x="332" y="268" class="tx">6</text><text x="345" y="268" class="tx tx-b">5</text><text x="358" y="268" class="tx">7</text>
                  <rect x="337" y="297" width="16" height="24" rx="3" fill="var(--c-warn)" opacity="0.22"></rect>
                  <text x="332" y="314" class="tx">3</text><text x="345" y="314" class="tx tx-b">2</text><text x="358" y="314" class="tx">9</text>
                  <rect x="337" y="343" width="16" height="24" rx="3" fill="var(--c-warn)" opacity="0.22"></rect>
                  <text x="332" y="360" class="tx">8</text><text x="345" y="360" class="tx tx-b">3</text><text x="358" y="360" class="tx">9</text>
                  <!-- 第 3 列：按十位排序后，高亮百位 -->
                  <rect x="534" y="67" width="16" height="24" rx="3" fill="var(--c-warn)" opacity="0.22"></rect>
                  <text x="542" y="84" class="tx tx-b">7</text><text x="555" y="84" class="tx">2</text><text x="568" y="84" class="tx">0</text>
                  <rect x="534" y="113" width="16" height="24" rx="3" fill="var(--c-warn)" opacity="0.22"></rect>
                  <text x="542" y="130" class="tx tx-b">3</text><text x="555" y="130" class="tx">2</text><text x="568" y="130" class="tx">9</text>
                  <rect x="534" y="159" width="16" height="24" rx="3" fill="var(--c-warn)" opacity="0.22"></rect>
                  <text x="542" y="176" class="tx tx-b">4</text><text x="555" y="176" class="tx">3</text><text x="568" y="176" class="tx">6</text>
                  <rect x="534" y="205" width="16" height="24" rx="3" fill="var(--c-warn)" opacity="0.22"></rect>
                  <text x="542" y="222" class="tx tx-b">8</text><text x="555" y="222" class="tx">3</text><text x="568" y="222" class="tx">9</text>
                  <rect x="534" y="251" width="16" height="24" rx="3" fill="var(--c-warn)" opacity="0.22"></rect>
                  <text x="542" y="268" class="tx tx-b">3</text><text x="555" y="268" class="tx">5</text><text x="568" y="268" class="tx">5</text>
                  <rect x="534" y="297" width="16" height="24" rx="3" fill="var(--c-warn)" opacity="0.22"></rect>
                  <text x="542" y="314" class="tx tx-b">4</text><text x="555" y="314" class="tx">5</text><text x="568" y="314" class="tx">7</text>
                  <rect x="534" y="343" width="16" height="24" rx="3" fill="var(--c-warn)" opacity="0.22"></rect>
                  <text x="542" y="360" class="tx tx-b">6</text><text x="555" y="360" class="tx">5</text><text x="568" y="360" class="tx">7</text>
                  <!-- 第 4 列：最终结果 -->
                  <text x="752" y="84" class="tx">3</text><text x="765" y="84" class="tx">2</text><text x="778" y="84" class="tx">9</text>
                  <text x="752" y="130" class="tx">3</text><text x="765" y="130" class="tx">5</text><text x="778" y="130" class="tx">5</text>
                  <text x="752" y="176" class="tx">4</text><text x="765" y="176" class="tx">3</text><text x="778" y="176" class="tx">6</text>
                  <text x="752" y="222" class="tx">4</text><text x="765" y="222" class="tx">5</text><text x="778" y="222" class="tx">7</text>
                  <text x="752" y="268" class="tx">6</text><text x="765" y="268" class="tx">5</text><text x="778" y="268" class="tx">7</text>
                  <text x="752" y="314" class="tx">7</text><text x="765" y="314" class="tx">2</text><text x="778" y="314" class="tx">0</text>
                  <text x="752" y="360" class="tx">8</text><text x="765" y="360" class="tx">3</text><text x="778" y="360" class="tx">9</text>
                  <!-- 列间箭头 -->
                  <line x1="215" y1="300" x2="305" y2="300" stroke="var(--c-line)" stroke-width="1.8"></line>
                  <polygon points="297,294 297,306 305,300" fill="var(--c-line)"></polygon>
                  <line x1="425" y1="300" x2="515" y2="300" stroke="var(--c-line)" stroke-width="1.8"></line>
                  <polygon points="507,294 507,306 515,300" fill="var(--c-line)"></polygon>
                  <line x1="635" y1="300" x2="725" y2="300" stroke="var(--c-line)" stroke-width="1.8"></line>
                  <polygon points="717,294 717,306 725,300" fill="var(--c-line)"></polygon>
                  <text x="260" y="322" class="tx-sm" text-anchor="middle">按个位稳定排序</text>
                  <text x="470" y="322" class="tx-sm" text-anchor="middle">按十位稳定排序</text>
                  <text x="680" y="322" class="tx-sm" text-anchor="middle">按百位稳定排序</text>
                  <!-- 结论 -->
                  <line x1="26" y1="382" x2="874" y2="382" stroke="var(--c-line-soft)"></line>
                  <text x="26" y="406" class="tx">最终序列：329 355 436 457 657 720 839（高亮的那一位就是本趟排序依据的数位）</text>
                  <text x="26" y="430" class="tx-sm">每趟都是"稳定"排序：第 t 趟不会打乱已经排好的低 t−1 位，所以处理完最高位后整个序列有序</text>
                  <text x="26" y="452" class="tx-sm">中间序列与 PPT 第 52 页插图逐列一致：720,355,436,457,657,329,839 → 720,329,436,839,355,457,657 → 329,355,436,457,657,720,839</text>
                </svg>
                <p class="fig-cap">图 5 &nbsp;基数排序逐趟示意：7 个三位数按个位、十位、百位各做一趟稳定排序</p>
          
                <h3 id="sec-radix-sort-h1">6.1 逐帧动画：7 个三位数的 LSD 过程</h3>
        ` },
        { type: 'demo', name: 'radix-sort', title: "基数排序执行过程：329 / 457 / 657 / 839 / 436 / 720 / 355（12 步）" },
        { type: 'html', html: `
          <h3 id="sec-radix-sort-h2">6.2 伪代码 + C++（逐行注释）</h3>
          
                <div class="code-pair">
                  <div class="code-col">
                    <p class="code-h">伪代码（PPT 写法）</p>
                    <pre class="code"><code>RADIX-SORT(A, d)                    // 对 n 个 d 位数做基数排序（最低位优先 LSD）
          1  for i ← 1 to d                   // 依次处理第 1 位到第 d 位（i = 1 表示个位）
          2      do use a stable sort to sort array A on digit i   // PPT 原文：用稳定的排序按第 i 位排序 A
          3  return A                         // 处理完最高位后整个序列有序
          
          RADIX-SORT-DETAIL(A, d)             // 把第 2 行展开成"分桶 + 收集"的写法
          1  for i ← 1 to d                   // 共 d 趟，i 表示当前排序依据的数位
          2      do 把 A 中每个元素按第 i 位数字放进 10 个桶 B[0..9]   // 分桶：桶号 = 该位数字
          3         同一桶内保持元素原来的先后次序      // 这一步依赖稳定排序，不能打乱
          4      按桶号 0 → 9 依次把各桶元素收回 A     // 收集：低桶在前、高桶在后
          5  return A                         // d 趟之后序列有序（见 6.3 的正确性证明）</code></pre>
                  </div>
                  <div class="code-col">
                    <p class="code-h">C++</p>
                    <pre class="code cpp"><code>#include &lt;cstdio&gt;                           // 打印最终排序结果
          // 按第 exp 位（1、10、100）做一趟"稳定"的计数排序，基数为 10
          void countingSortByDigit(int A[], int n, int exp) {   // A 原地排序，exp 是当前位的权值
              int out[16];                            // 本趟排序的输出数组
              int cnt[10] = {0};                      // 计数器：数字 0..9 各出现多少次
              for (int i = 0; i &lt; n; ++i) { ++cnt[(A[i] / exp) % 10]; }   // 统计本位数字的出现次数
              for (int d = 1; d &lt; 10; ++d) { cnt[d] += cnt[d - 1]; }      // 前缀累加：cnt[d] = |{数字&lt;=d}|
              for (int i = n - 1; i &gt;= 0; --i) {      // 反向填充 —— 这一步保证本趟排序是稳定的
                  int d = (A[i] / exp) % 10;          // 取出当前数的本位数字
                  out[--cnt[d]] = A[i];               // 放到该数字区间的最后一个空位
              }                                       // 结束反向填充
              for (int i = 0; i &lt; n; ++i) { A[i] = out[i]; }   // 把本趟结果写回 A，准备下一趟
          }                                           // 结束 countingSortByDigit 函数
          void radixSort(int A[], int n, int d) {     // 最低位优先（LSD）的基数排序，d 为最大位数
              int exp = 1;                            // 当前位的权值：1 = 个位、10 = 十位、100 = 百位
              for (int i = 1; i &lt;= d; ++i) {          // 共 d 趟，从最低位一路排到最高位
                  countingSortByDigit(A, n, exp);     // 用稳定的计数排序处理第 i 位
                  exp *= 10;                          // 权值乘 10，进入更高的一位
              }                                       // 结束 d 趟循环
          }                                           // 结束 radixSort 函数
          int main() {                                // 主函数：用 PPT 的 7 个三位数验证
              int A[7] = {329, 457, 657, 839, 436, 720, 355};   // 课程 PPT slide 52 的算例
              radixSort(A, 7, 3);                     // d = 3：三位数，共 3 趟
              for (int i = 0; i &lt; 7; ++i) {           // 打印排序结果，期望 329 355 436 457 657 720 839
                  printf("%d%c", A[i], i + 1 == 7 ? '\\n' : ' ');   // 数字之间空格分隔，末尾换行
              }                                       // 结束打印循环
              return 0;                               // 正常结束
          }                                           // 结束 main 函数</code></pre>
                  </div>
                </div>
          
                <p>用 <b>g++ 实测</b>（<code>g++ -std=c++11 -O2 -Wall radixsort.cpp -o radixsort.exe</code>），运行输出：</p>
                <pre class="code"><code>329 355 436 457 657 720 839        // 与 PPT 算例的最终序列完全一致</code></pre>
          
                <h3 id="sec-radix-sort-h3">6.3 正确性证明</h3>
          
                <p><b>基本推导思路</b>：<b>假定一组序列低 t−1 位已经排序好了，现在我们按照第 t 位进行排序。只需证明对于任意两个数来说，按照第 t 位排序之后其相对位置正确。</b></p>
          
                <p>任意两个数这时有两种情况：</p>
                <ol>
                  <li>它们<b>第 t 位相同</b>：此时如果我们<b>保持它们位置的稳定性</b>，那么它们最后仍然有序；</li>
                  <li>它们<b>第 t 位不同</b>：按照第 t 位排序之后就有序了。</li>
                </ol>
          
                <div class="callout key">
                  <p class="callout-h">数位推导（归纳法）</p>
                  <ul>
                    <li>假设数字已经按照其低阶 <b>t−1</b> 位排序；</li>
                    <li>按照 <b>t</b> 位排序后：
                      <ul>
                        <li>两个在 <b>t 位不同</b>的数被<b>正确排序</b>（谁的第 t 位大谁就排在后面）；</li>
                        <li>两个 <b>t 位相同</b>的数<b>保持与输入相同的次序</b>（稳定排序的保证）<span class="m">&rArr;</span> 正确的顺序。</li>
                      </ul>
                    </li>
                    <li>由归纳法，处理完最高位后整个序列有序。</li>
                  </ul>
                </div>
          
                <p>把这个论断落到本讲的算例上：第 2 趟按十位排序时，720 与 329 的十位都是 2，它们在桶 2 中"先来先服务"，次序仍是上一趟（个位 0 &lt; 9）留下的 720 在前、329 在后 —— 于是低两位的次序被完整保留，而十位不同的数（如 720 与 436）则按十位 2 &lt; 3 排定。</p>
          
                <h3 id="sec-radix-sort-h4">6.4 适用性与缺点</h3>
          
                <p>基数排序比较适合对<b>取值很大</b>的数进行排序，也可用来对<b>字符串</b>进行排序。</p>
                <p>但基数排序的缺点是<b>不呈现时空局部性</b> —— 因为在按位对每个数进行排序的过程中，一个数的位置可能发生巨大的变化，所以不能充分利用现代机器缓存提供的优势。同时<b>计数排序作为中间稳定排序的话，不具有原地排序的特点</b>，当内存容量比较宝贵的时候，还是有待商榷。</p>
          
                <div class="callout tip">
                  <p class="callout-h">复杂度速记</p>
                  <p>d 趟、每趟一次稳定的计数排序（值域为基数 r = 10），总时间 <span class="m">&Theta;(d(n + r))</span>；空间 <span class="m">O(n + r)</span>。当 d 是常数、r = O(n) 时，线性时间 <span class="m">&Theta;(n)</span>。</p>
                </div>
        ` },
      ],
    },
    {
      id: 'sec-summary',
      heading: "7. 内容小结与速记清单",
      blocks: [
        { type: 'html', html: `
          <p>PPT 第 60 页的小结内容：</p>
                <ol>
                  <li>《数据结构》课程中已学习过的排序算法；</li>
                  <li>基于<b>决策树模型</b>分析比较排序算法的时间复杂度下界；</li>
                  <li><b>计数排序</b>；</li>
                  <li><b>基数排序</b>。</li>
                </ol>
          
                <table class="tbl">
                  <thead><tr><th>算法</th><th>是否比较元素</th><th>时间</th><th>空间</th><th>稳定</th></tr></thead>
                  <tbody>
                    <tr><td>冒泡 / 插入 / 选择 / 归并 / 快排 / 堆排 / 希尔</td><td>是（比较排序）</td><td class="num">&Omega;(n lg n) 是下界</td><td class="num">多为 O(1)～O(n)</td><td>归并、插入、冒泡稳定</td></tr>
                    <tr><td><b>计数排序</b></td><td><b>否</b></td><td class="num">&Theta;(n + k)</td><td class="num">O(k)</td><td><b>稳定</b></td></tr>
                    <tr><td><b>基数排序</b></td><td><b>否</b></td><td class="num">&Theta;(d(n + r))</td><td class="num">O(n + r)</td><td><b>稳定</b>（每趟子过程必须稳定）</td></tr>
                  </tbody>
                </table>
          
                <div class="callout key">
                  <p class="callout-h">考前速记清单</p>
                  <ol>
                    <li><b>决策树</b>：内部节点 <span class="m">i:j</span> 是一次比较，左分支 <span class="m">a<sub>i</sub> &le; a<sub>j</sub></span>、右分支 <span class="m">a<sub>i</sub> &ge; a<sub>j</sub></span>，叶子是一个排列；<b>运行时间 = 路径长度，最坏运行时间 = 树高</b>。</li>
                    <li><b>下界定理</b>：任何比较排序的决策树高度是 <span class="m">&Omega;(n lg n)</span>。证明链：<span class="m">n! &le; L &le; 2<sup>h</sup> &rArr; h &ge; lg(n!) &ge; lg((n/e)<sup>n</sup>) = n lg n &minus; n lg e = &Omega;(n lg n)</span>。</li>
                    <li><b>推论</b>：最差情况下任何比较排序至少 <span class="m">&Omega;(n lg n)</span> 次比较；<b>堆排序与归并排序是渐进最佳的比较排序</b>。</li>
                    <li><b>螺丝螺母</b>：决策树变成<b>三叉树</b>（多一个"="分支），<span class="m">n! &le; L &le; 3<sup>h</sup></span>，下界仍是 <span class="m">n log n</span>。</li>
                    <li><b>相邻交换下界</b>：通过交换相邻元素排序的任何算法平均需要 <span class="m">&Omega;(N<sup>2</sup>)</span>；排序的本质是消除逆序数，相邻交换每次只消 1 个；<b>希尔 / 快排 / 堆排交换较远的元素，一次可消多个逆序</b>。</li>
                    <li><b>选择排序的最好时间复杂度不是 O(n)</b>，而是 <span class="m">O(N<sup>2</sup>)</span>。</li>
                    <li><b>计数排序</b>：不比较；输入 <span class="m">A[1..n]</span>、<span class="m">A[j] &isin; {1..k}</span>，辅助 <span class="m">C[1..k]</span>；四段循环 = 清零 <span class="m">&Theta;(k)</span> + 计数 <span class="m">&Theta;(n)</span> + 累加 <span class="m">&Theta;(k)</span> + 反向填充 <span class="m">&Theta;(n)</span>，总计 <span class="m">&Theta;(n + k)</span>；空间 <span class="m">O(k)</span>。</li>
                    <li><b>计数排序算例</b>：<span class="m">A = &lang;4, 1, 3, 4, 3&rang;</span>、k = 4：C = [0,0,0,0] &rarr; [1,0,2,2] &rarr; [1,1,3,5] &rarr; B = ⟨1, 3, 3, 4, 4⟩，最终 C = [0,1,1,3]。</li>
                    <li><b>稳定性</b>：计数排序稳定，来源是循环4 的 <b>for j ← n downto 1</b> 反向填充。</li>
                    <li><b>基数排序</b>：按位切割、<b>从最低位开始</b>依次用稳定排序处理；正确性靠"t 位不同的数被正确排序 + t 位相同的数保持原次序"归纳；缺点是不呈现时空局部性、非原地。</li>
                  </ol>
                </div>
        ` },
      ],
    },
    {
      id: 'sec-quiz',
      heading: "本节自测（课件配套测验）",
      blocks: [
        { type: 'html', html: `
          <p>下列 7 题取自课程配套测验（线性时间排序部分），按知识点归入本节：决策树模型、计数排序的稳定性、基数排序的稳定子过程。每题给出<b>答案与解析</b>。</p>
          
                <h3 id="sec-quiz-h1">一、单项选择题</h3>
        ` },
        { type: 'quiz', quiz: {
          "kind": "single",
          "question": "1. 在比较排序的决策树中，叶子节点对应什么？",
          "tag": "线性时间排序 · 原卷 5",
          "options": [
            "A. 一个排列",
            "B. 一次赋值",
            "C. 一个辅助数组",
            "D. 一种编程语言"
          ],
          "answer": "A",
          "explanation": "决策树的<b>内部节点</b>标 <span class=\"m\">i:j</span>，对应一次比较；<b>分支</b>对应该次比较的一种结果（左子树 <span class=\"m\">a<sub>i</sub> ≤ a<sub>j</sub></span>，右子树 <span class=\"m\">a<sub>i</sub> ≥ a<sub>j</sub></span>）；<b>叶子</b>对应算法最终确定的一个<b>排列</b>。算法运行时间 = 根到叶路径长度，最坏运行时间 = 树高。"
        } },
        { type: 'quiz', quiz: {
          "kind": "single",
          "question": "2. 对 n 个元素排序的决策树，叶子数 L 至少应满足什么关系？",
          "tag": "线性时间排序 · 原卷 6",
          "options": [
            "A. L ≥ n",
            "B. L ≥ 2n",
            "C. L ≥ n!",
            "D. L ≥ n²"
          ],
          "answer": "C",
          "explanation": "n 个元素共有 <b>n! 种可能的排列</b>，而每个排列都必须有一条可达路径、落在一个叶子上 ⇒ <span class=\"m\">L ≥ n!</span>。再结合「高度 h 的二叉树最多 <span class=\"m\">2<sup>h</sup></span> 个叶子」得 <span class=\"m\">n! ≤ L ≤ 2<sup>h</sup></span>，于是 <span class=\"m\">h ≥ lg(n!) = Ω(n lg n)</span> —— 这就是比较排序下界的完整链条。"
        } },
        { type: 'quiz', quiz: {
          "kind": "single",
          "question": "3. 计数排序具有哪一种重要性质？",
          "tag": "线性时间排序 · 原卷 7",
          "options": [
            "A. 稳定性",
            "B. 原地排序",
            "C. 只使用 O(1) 空间",
            "D. 不需要辅助数组"
          ],
          "answer": "A",
          "explanation": "计数排序是<b>稳定排序</b>：相等元素保持原有相对次序。稳定性的来源是循环 4 的 <b>for j ← n downto 1 反向填充</b>。B/C/D 全错：它需要长度 <span class=\"m\">k</span> 的计数数组 C 和长度 <span class=\"m\">n</span> 的输出数组 B，空间 <span class=\"m\">O(n+k)</span>，<b>不是</b>原地排序。"
        } },
        { type: 'quiz', quiz: {
          "kind": "single",
          "question": "4. 最低位优先的基数排序应使用什么样的辅助排序？",
          "tag": "线性时间排序 · 原卷 8",
          "options": [
            "A. 不稳定的快速排序",
            "B. 稳定的排序方法",
            "C. 只能使用冒泡排序",
            "D. 任何随机排序均可"
          ],
          "answer": "B",
          "explanation": "LSD 基数排序的每一趟都必须<b>稳定</b>：因为低位的排序结果要在高位相同的元素之间被保留下来。若某趟用不稳定排序，相等键的相对次序被打乱，前面几趟的努力就白费了。常用<b>稳定的计数排序</b>（或桶排序）作为子过程，因此总代价为 <span class=\"m\">Θ(d(n+r))</span>。"
        } },
        { type: 'quiz', quiz: {
          "kind": "single",
          "question": "5. 基数排序中，当两个数当前第 t 位相同时，为什么仍能保持正确顺序？",
          "tag": "线性时间排序 · 原卷 9",
          "options": [
            "A. 直接交换两个数",
            "B. 删除其中一个数",
            "C. 稳定排序保持其原有相对次序",
            "D. 重新从最高位开始排序"
          ],
          "answer": "C",
          "explanation": "这正是基数排序正确性证明的核心：假设低 <span class=\"m\">t−1</span> 位已经排好，现在按第 t 位排序。任意两数只有两种情形 —— ① <b>第 t 位不同</b>：按该位排序后自然有序；② <b>第 t 位相同</b>：靠稳定性<b>保持二者原有的相对次序</b>，而该次序恰好是低 <span class=\"m\">t−1</span> 位决定的正确次序。故处理完最高位后整个序列有序。"
        } },
        { type: 'html', html: `
          <h3 id="sec-quiz-h2">二、判断题</h3>
        ` },
        { type: 'quiz', quiz: {
          "kind": "judge",
          "question": "6. 当 k = O(n) 时，计数排序的运行时间为 Θ(n)。",
          "tag": "线性时间排序 · 原卷 19",
          "options": [
            "A. 对",
            "B. 错"
          ],
          "answer": "对",
          "explanation": "计数排序四段循环的代价分别为 <span class=\"m\">Θ(k)、Θ(n)、Θ(k)、Θ(n)</span>，合计 <span class=\"m\">Θ(n+k)</span>。当 <span class=\"m\">k=O(n)</span> 时 <span class=\"m\">Θ(n+k)=Θ(n)</span>，即线性时间。"
        } },
        { type: 'quiz', quiz: {
          "kind": "judge",
          "question": "7. 无论取值范围 k 多大，计数排序都比比较排序更高效。",
          "tag": "线性时间排序 · 原卷 20",
          "options": [
            "A. 对",
            "B. 错"
          ],
          "answer": "错",
          "explanation": "计数排序是<b>牺牲空间换时间</b>：时间 <span class=\"m\">Θ(n+k)</span>、空间 <span class=\"m\">O(k)</span>。当 <span class=\"m\">k</span> 远大于 <span class=\"m\">n</span>（例如只排 10 个数但取值到 10⁹）时，k 项主导，效率反而<b>不如</b> <span class=\"m\">Θ(n log n)</span> 的比较排序，甚至根本开不出那么大的数组。所以「快于任何比较排序」只在 <span class=\"m\">k=O(n)</span> 这类前提下成立。",
          "note": "顺带记个「矛盾」题：计数排序 Θ(n+k) 与排序下界 Ω(n lg n) 不冲突 —— 下界只约束<b>比较排序</b>，而计数排序各项之间根本不比较。"
        } },
      ],
    },
  ],
};

export default deck;
