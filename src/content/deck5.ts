/* 由 scripts/migrate.mjs 自动生成 —— 内容事实源，手工修改后请勿重跑迁移覆盖 */
import type { DeckData } from './types';

const deck: DeckData = {
  id: 'deck5',
  no: "",
  title: "L4 · 线性时间选择",
  subtitle: "第 5 讲 · 线性时间选择",
  lede: `
  本讲回答一个尖锐的问题 —— <b>能不能在 O(n) 时间里找出第 k 小的元素？</b>三块内容层层递进：① 特殊情况（k=1、k=n、同时求最大最小）与一般情况的 5 种解法层次；② 以快速排序为模型的 <b>RANDOMIZED-SELECT</b>（期望 <span class="m">&Theta;(n)</span>，最坏 <span class="m">&Theta;(n<sup>2</sup>)</span>）；③ <b>中位数之中位数</b> (median of medians, BFPRT)，最坏也是 <span class="m">&Theta;(n)</span>。所有算例与数字均按课程 PPT 核对：同时求最大最小 <span class="m">3&lfloor;n/2&rfloor;</span> 次比较、划分算例 <span class="m">&lang;6,10,13,5,8,3,2,11&rang;</span>（q = 4）、23 个数据找第 8 小（答案 8）、<span class="m">T(n) &le; T(n/5) + T(7n/10) + O(n)</span>。
`,
  toc: [
    { id: 'sec-problem', text: "1. 问题描述与特殊情况", level: 2 },
    { id: 'sec-problem-h1', text: "1.1 特殊情况一：k = 1 或 k = n", level: 3 },
    { id: 'sec-problem-h2', text: "1.2 特殊情况二：同时找最小值和最大值", level: 3 },
    { id: 'sec-problem-h3', text: "1.3 特殊情况三：输入数据全是整数", level: 3 },
    { id: 'sec-problem-h4', text: "1.4 一般情况：5 种解法层次", level: 3 },
    { id: 'sec-quicksort', text: "2. 快速排序回顾：线性时间的划分是关键", level: 2 },
    { id: 'sec-quicksort-h1', text: "2.1 分治三步", level: 3 },
    { id: 'sec-quicksort-h2', text: "2.2 划分的三段式不变量", level: 3 },
    { id: 'sec-quicksort-h3', text: "2.3 伪代码 + C++", level: 3 },
    { id: 'sec-quicksort-h4', text: "2.4 划分举例（PPT 第 12 页）：x = 6", level: 3 },
    { id: 'sec-qs-analysis', text: "3. 快速排序的复杂度分析：最坏、最好、几乎最好与运气交替", level: 2 },
    { id: 'sec-qs-analysis-h1', text: "3.1 最坏情况：一边总是空的", level: 3 },
    { id: 'sec-qs-analysis-h2', text: "3.2 最好情况：均分", level: 3 },
    { id: 'sec-qs-analysis-h3', text: "3.3 \"几乎最好\"：固定比例划分仍是 &Theta;(n lg n)", level: 3 },
    { id: 'sec-qs-analysis-h4', text: "3.4 运气交替：幸运、不幸、幸运、不幸……", level: 3 },
    { id: 'sec-qs-analysis-h5', text: "3.5 随机快速排序", level: 3 },
    { id: 'sec-randomized-select', text: "4. 期望为线性时间的选择算法 RANDOMIZED-SELECT", level: 2 },
    { id: 'sec-randomized-select-h1', text: "4.1 伪代码（PPT 第 41 页原图逐行）", level: 3 },
    { id: 'sec-randomized-select-h2', text: "4.2 动画：8 个数找第 3 小，只走一边", level: 3 },
    { id: 'sec-randomized-select-h3', text: "4.3 期望运行时间分析（指示器随机变量）", level: 3 },
    { id: 'sec-randomized-select-h4', text: "4.4 代换法证明 E[T(n)] = O(n)", level: 3 },
    { id: 'sec-bfprt', text: "5. 最坏情况为线性时间的选择算法（BFPRT / 中位数之中位数）", level: 2 },
    { id: 'sec-bfprt-h1', text: "5.1 五步算法（PPT 第 54 页）", level: 3 },
    { id: 'sec-bfprt-h2', text: "5.2 引例：23 个数据，找第 8 小（PPT 第 49～53 页）", level: 3 },
    { id: 'sec-bfprt-h3', text: "5.3 伪代码 + C++", level: 3 },
    { id: 'sec-bfprt-h4', text: "5.4 动画：23 个数据找第 8 小", level: 3 },
    { id: 'sec-bfprt-h5', text: "5.5 关键图：为什么划分后最大子问题只有 7n/10", level: 3 },
    { id: 'sec-bfprt-h6', text: "5.6 复杂度推导：T(n) &le; T(n/5) + T(7n/10) + O(n)", level: 3 },
    { id: 'sec-bfprt-h7', text: "5.7 延伸：每 7 个一组还是 O(n) 吗？（PPT 第 59 页）", level: 3 },
    { id: 'sec-practice', text: "6. 实践中的快速排序", level: 2 },
    { id: 'sec-summary', text: "7. 小结：5 种选择算法的对比与速记", level: 2 },
    { id: 'sec-quiz', text: "本节自测（课件配套测验）", level: 2 },
    { id: 'sec-quiz-h1', text: "一、单项选择题", level: 3 },
  ],
  sections: [
    {
      id: 'sec-problem',
      heading: "1. 问题描述与特殊情况",
      blocks: [
        { type: 'html', html: `
          <p><b>问题（PPT 第 2 页）</b>：给定线性序集 (linearly ordered set) 中 <span class="m">n</span> 个元素和一个整数 <span class="m">k</span>，要求找出这 <span class="m">n</span> 个元素中<b>第 k 小</b>的元素。这里"线性序集"指任意两个元素都能比较大小（全序），所以排序后第 <span class="m">k</span> 个位置上的元素就是答案 —— 难点从来不是"第 k 小"是什么，而是"能不能比排序更快地找到它"。</p>
          
                <h3 id="sec-problem-h1">1.1 特殊情况一：k = 1 或 k = n</h3>
          
                <p>找最小值（<span class="m">k = 1</span>）或最大值（<span class="m">k = n</span>）只要<b>一次线性扫描</b>：依次遍历每个元素，记录当前最小/最大元素，比较次数 <span class="m">n &minus; 1</span>，时间 <span class="m">&Theta;(n)</span>。这是后面所有算法都要对标的基线：<b>选择问题的下界就是 &Omega;(n)</b>（每个元素至少要看一眼）。</p>
          
                <h3 id="sec-problem-h2">1.2 特殊情况二：同时找最小值和最大值</h3>
          
                <p>PPT 第 4 页给了两种算法，并给出了比较次数的精确值：</p>
          
                <ol>
                  <li><b>分别独立</b>地找出最小值和最大值：找最小用 <span class="m">n &minus; 1</span> 次比较，找最大再用 <span class="m">n &minus; 1</span> 次，共 <span class="m">2n &minus; 2</span> 次比较。</li>
                  <li><b>成对处理</b>输入元素：先把一对输入元素<b>相互比较</b>（1 次），再把其中<b>较小者</b>与当前最小值比较（1 次）、<b>较大者</b>与当前最大值比较（1 次）—— 即<b>每两个元素共需 3 次比较</b>，共需 <span class="m">3&lfloor;n/2&rfloor;</span> 次。</li>
                </ol>
          
                <table class="tbl">
                  <thead><tr><th>n</th><th>分别独立 2n &minus; 2</th><th>成对处理 3&lfloor;n/2&rfloor;</th><th>省下的比较次数</th></tr></thead>
                  <tbody>
                    <tr><td class="num">8</td><td class="num">14</td><td class="num">12</td><td class="num">2</td></tr>
                    <tr><td class="num">9</td><td class="num">16</td><td class="num">12（+2 处理余下的 1 个 = 14）</td><td class="num">2</td></tr>
                    <tr><td class="num">100</td><td class="num">198</td><td class="num">150</td><td class="num">48</td></tr>
                    <tr><td class="num">n（偶数）</td><td class="num">2n &minus; 2</td><td class="num">3n/2</td><td class="num">n/2 &minus; 2</td></tr>
                  </tbody>
                </table>
          
                <p><b>为什么成对处理更优？</b>关键在于"一次比较同时服务两个目标"。把 <span class="m">a</span> 与 <span class="m">b</span> 比一次，就知道<b>较小者不可能成为最大值、较大者不可能成为最小值</b>：这一次比较同时为 min 和 max 各排除掉一个候选。而分别独立的做法里，"<span class="m">5 &lt; 10</span>"这条信息只被最小值一侧用了一次，<span class="m">10</span> 后来还要再与当前最大值比一次，等于<b>把一个元素同时放进两条独立的擂台</b>，每次只推进一条。用信息量的话说：独立法平均每个元素花 2 次比较，成对法只要 1.5 次 —— 每 2 个元素从 4 次降到 3 次。</p>
          
                <div class="callout tip">
                  <p class="callout-h">补充（非 PPT）：更好的常数</p>
                  <p>如果允许用<b>第一对元素</b>先给 min、max 定初值（这一对只花 1 次比较），则 <span class="m">n</span> 为偶数时总比较次数可做到 <span class="m">3&lfloor;n/2&rfloor; &minus; 2</span>；这也正是该问题的比较次数下界 <span class="m">&lceil;3n/2&rceil; &minus; 2</span>。PPT 给出的 <span class="m">3&lfloor;n/2&rfloor;</span> 是把每一对都按 3 次计的上界，考试按这个写即可。</p>
                </div>
          
                <h3 id="sec-problem-h3">1.3 特殊情况三：输入数据全是整数</h3>
          
                <p>PPT 第 5 页点了一句：当输入数据全是整数时，可以借助<b>线性时间排序</b>（计数排序、基数排序，见 <a href="deck4.html">L3 · 线性时间排序</a>）先把数组排好，再直接取第 <span class="m">k</span> 个，总时间 <span class="m">O(n)</span>。代价是必须假设"整数 + 值域有限"，这正是一般选择算法要摆脱的假设。</p>
          
                <h3 id="sec-problem-h4">1.4 一般情况：5 种解法层次</h3>
          
                <p>PPT 第 6 页把一般情况的解法分成三层（暴力 / 排序 / 选择），本讲再往后补出两层，合起来是一条完整的"优化链"：</p>
          
                <table class="tbl">
                  <thead><tr><th>层次</th><th>做法</th><th>时间复杂度</th><th>瓶颈在哪里</th></tr></thead>
                  <tbody>
                    <tr><td>解法 1</td><td>暴力法：做 k 遍"找最小值"，每遍 O(n)</td><td class="num">O(kn) &le; O(n<sup>2</sup>)</td><td>k 接近 n 时退化为 <span class="m">O(n<sup>2</sup>)</span></td></tr>
                    <tr><td>解法 2</td><td>归并排序后取 A[k]</td><td class="num">O(n lg n)</td><td>把 n 个元素的<b>全部次序</b>都算了出来，而只要第 k 小</td></tr>
                    <tr><td>解法 3</td><td>快速排序后取 A[k]</td><td class="num">平均 O(n lg n)，最坏 O(n<sup>2</sup>)</td><td>划分两边都递归，浪费了"只要一边"的信息</td></tr>
                    <tr><td>解法 4</td><td><b>RANDOMIZED-SELECT</b>（期望线性时间选择）</td><td class="num">期望 &Theta;(n)，最坏 &Theta;(n<sup>2</sup>)</td><td>随机主元可能每次都极不走运</td></tr>
                    <tr><td>解法 5</td><td><b>BFPRT</b> / 中位数之中位数（最坏线性时间选择）</td><td class="num">&Theta;(n)</td><td>常数较大，工程上不如解法 4 常用</td></tr>
                  </tbody>
                </table>
          
                <div class="callout warn">
                  <p class="callout-h">易错：第 k 小 ≠ 下标 k</p>
                  <p>PPT 全程用 <b>1 起下标</b>：第 <span class="m">k</span> 小就是排序后落在 <span class="m">A[k]</span> 的元素。写代码时若用 0 起下标，第 k 小对应 <span class="m">A[k&minus;1]</span>；递归右半边时名次要变成 <span class="m">i &minus; k</span>（减掉左边连同主元一共 <span class="m">k</span> 个），这一步最常写错。</p>
                </div>
          
                <div class="callout key">
                  <p class="callout-h">本节考点</p>
                  <p>① 问题定义：线性序集 + 整数 k，找第 k 小；② k=1 / k=n 时一次扫描 <span class="m">&Theta;(n)</span>；③ <b>分别独立 <span class="m">2n&minus;2</span> 次 vs 成对处理 <span class="m">3&lfloor;n/2&rfloor;</span> 次</b>，会说清"一次比较同时服务两个目标"；④ 5 种解法的时间复杂度阶梯：<span class="m">O(n<sup>2</sup>) &rarr; O(n lg n) &rarr; &Theta;(n)</span>（期望）<span class="m">&rarr; &Theta;(n)</span>（最坏）。</p>
                </div>
        ` },
      ],
    },
    {
      id: 'sec-quicksort',
      heading: "2. 快速排序回顾：线性时间的划分是关键",
      blocks: [
        { type: 'html', html: `
          <p><b>快速排序</b> (quicksort) 由 C.A.R. Hoare 在 <b>1962</b> 年提出，是分而治之算法，是<b>"原地"排序</b>（像插入排序，而不像归并排序），非常实用（需要调优）。本节只保留后面选择算法真正要用的两块：<b>分治三步</b>与<b>划分函数 PARTITION</b>。</p>
          
                <h3 id="sec-quicksort-h1">2.1 分治三步</h3>
          
                <ul>
                  <li><b>分解</b> (divide)：围绕基准 <span class="m">x</span> 将数组划分成两个子数组，使得左边子数组中的项 <span class="m">&le; x</span>，右边子数组中的项 <span class="m">&ge; x</span>；</li>
                  <li><b>解决</b> (conquer)：递归地对两个子数组排序；</li>
                  <li><b>合并</b> (combine)：很简单 —— 什么都不用做，因为排序是原地完成的。</li>
                </ul>
          
                <div class="callout key">
                  <p class="callout-h">一句话抓住重点</p>
                  <p>快速排序的<b>关键就是"线性时间的划分函数"</b>：分解这一步只要 <span class="m">O(n)</span>，快排的全部代价都来自"递归了几层"。而选择算法之所以能到线性，正是因为它<b>把递归层数从"两边"砍成"一边"</b>。</p>
                </div>
          
                <h3 id="sec-quicksort-h2">2.2 划分的三段式不变量</h3>
          
                <p>PPT 第 11 页把 PARTITION 的不变量画成四段：<span class="m">x | &le; x | &ge; x | ?</span>。用 <span class="m">p</span>、<span class="m">i</span>、<span class="m">j</span> 三个指针说清楚就是：</p>
          
                <div class="callout">
                  <p class="callout-h">循环不变式（Lomuto 划分）</p>
                  <p><span class="m">A[p] = x</span>（主元，位置固定）；<span class="m">A[p+1..i] &le; x</span>；<span class="m">A[i+1..j&minus;1] &gt; x</span>；<span class="m">A[j..r]</span> 尚未扫描。每轮把 <span class="m">j</span> 右移一格：若 <span class="m">A[j] &le; x</span>，则 <span class="m">i &larr; i+1</span> 并交换 <span class="m">A[i] &harr; A[j]</span>，"&le; x" 段增大一格；否则 <span class="m">j</span> 单独前进，"&gt; x" 段增大一格。扫描结束后交换 <span class="m">A[p] &harr; A[i]</span>，主元落到 <span class="m">q = i</span>。</p>
                </div>
          
                <svg class="fig" viewBox="0 0 960 330" role="img" aria-label="PARTITION 的三段式不变量：主元 x、小于等于 x 的一段、大于 x 的一段、尚未扫描的一段，以及 p i j r 四个指针">
                  <text x="26" y="26" class="tx-b">图 1　PARTITION 的三段式不变量（数组 ⟨6,10,13,5,8,3,2,11⟩，x = 6，扫描到 j = 7 时的状态）</text>
                  <text x="26" y="46" class="tx-sm">A[p] = x ｜ A[p+1..i] ≤ x ｜ A[i+1..j−1] &gt; x ｜ A[j..r] 尚未扫描</text>
          
                  <!-- 8 个格子：x=6 在第 1 格，≤x 段为 5,3，>x 段为 10,8,13，未扫描为 2,11 -->
                  <rect x="100" y="80" width="76" height="54" rx="6" fill="var(--c-warn-bg)" stroke="var(--c-hot)" stroke-width="2.6"></rect>
                  <text x="138" y="114" class="tx tx-b" text-anchor="middle">6</text>
                  <rect x="188" y="80" width="76" height="54" rx="6" fill="var(--c-tip-bg)" stroke="var(--c-ok)" stroke-width="2"></rect>
                  <text x="226" y="114" class="tx" text-anchor="middle">5</text>
                  <rect x="276" y="80" width="76" height="54" rx="6" fill="var(--c-tip-bg)" stroke="var(--c-ok)" stroke-width="2"></rect>
                  <text x="314" y="114" class="tx" text-anchor="middle">3</text>
                  <rect x="364" y="80" width="76" height="54" rx="6" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.6"></rect>
                  <text x="402" y="114" class="tx" text-anchor="middle">10</text>
                  <rect x="452" y="80" width="76" height="54" rx="6" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.6"></rect>
                  <text x="490" y="114" class="tx" text-anchor="middle">8</text>
                  <rect x="540" y="80" width="76" height="54" rx="6" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.6"></rect>
                  <text x="578" y="114" class="tx" text-anchor="middle">13</text>
                  <rect x="628" y="80" width="76" height="54" rx="6" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.2" stroke-dasharray="6 5"></rect>
                  <text x="666" y="114" class="tx" text-anchor="middle">2</text>
                  <rect x="716" y="80" width="76" height="54" rx="6" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.2" stroke-dasharray="6 5"></rect>
                  <text x="754" y="114" class="tx" text-anchor="middle">11</text>
          
                  <!-- 下标 -->
                  <text x="138" y="154" class="tx-sm" text-anchor="middle">1</text>
                  <text x="226" y="154" class="tx-sm" text-anchor="middle">2</text>
                  <text x="314" y="154" class="tx-sm" text-anchor="middle">3</text>
                  <text x="402" y="154" class="tx-sm" text-anchor="middle">4</text>
                  <text x="490" y="154" class="tx-sm" text-anchor="middle">5</text>
                  <text x="578" y="154" class="tx-sm" text-anchor="middle">6</text>
                  <text x="666" y="154" class="tx-sm" text-anchor="middle">7</text>
                  <text x="754" y="154" class="tx-sm" text-anchor="middle">8</text>
          
                  <!-- 四段括线 -->
                  <line x1="104" y1="176" x2="176" y2="176" stroke="var(--c-hot)" stroke-width="2"></line>
                  <text x="140" y="196" class="tx-sm" text-anchor="middle" fill="var(--c-hot)">x（主元）</text>
                  <line x1="192" y1="176" x2="352" y2="176" stroke="var(--c-ok)" stroke-width="2"></line>
                  <text x="272" y="196" class="tx-sm" text-anchor="middle" fill="var(--c-ok)">≤ x</text>
                  <line x1="368" y1="176" x2="616" y2="176" stroke="var(--c-accent-2)" stroke-width="2"></line>
                  <text x="492" y="196" class="tx-sm" text-anchor="middle" fill="var(--c-accent-2)">&gt; x</text>
                  <line x1="632" y1="176" x2="792" y2="176" stroke="var(--c-line)" stroke-width="2" stroke-dasharray="6 5"></line>
                  <text x="712" y="196" class="tx-sm" text-anchor="middle">尚未扫描 ?</text>
          
                  <!-- 指针 -->
                  <text x="138" y="238" class="tx-sm" text-anchor="middle" fill="var(--c-accent)">↑ p = 1</text>
                  <text x="314" y="238" class="tx-sm" text-anchor="middle" fill="var(--c-hot)">↑ i = 3</text>
                  <text x="666" y="238" class="tx-sm" text-anchor="middle" fill="var(--c-accent-2)">↑ j = 7</text>
                  <text x="754" y="238" class="tx-sm" text-anchor="middle" fill="var(--c-accent)">↑ r = 8</text>
          
                  <text x="26" y="278" class="tx">扫描结束时交换 A[p] 与 A[i]，主元 6 落到 q = i = 3：左段 5,3 都 ≤ 6，右段 10,8,13,2,11 都 ≥ 6。</text>
                  <text x="26" y="304" class="tx-sm">每次都把 j 右移一格：A[j] ≤ x 就换进"≤x 段"（i 跟着 +1），否则 j 单独前进 —— 一个 n 元素的区间正好做 n 次比较，时间 O(n)。</text>
                </svg>
                <p class="fig-cap">图 1 &nbsp;PARTITION 的三段式不变量：≤ x / x / ≥ x 三段随 j 前进而长大，扫描结束把主元换到两段之间</p>
          
                <h3 id="sec-quicksort-h3">2.3 伪代码 + C++</h3>
          
                <p>伪代码忠实还原 PPT 第 10～11 页。<b>注意</b>：PPT 第 11 页把划分函数写成 <span class="m">PARTITION(A, p, q)</span>，第 10 页调用时写的是 <span class="m">PARTITION(A, p, r)</span>，两者指同一个右端点，本文统一用 <span class="m">r</span>，函数返回值（主元位置）统一用 <span class="m">q</span>。</p>
          
                <div class="code-pair">
                  <div class="code-col">
                    <p class="code-h">伪代码（PPT 写法）</p>
                    <pre class="code"><code>QUICKSORT(A, p, r)                  // 对 A[p..r] 原地排序
          1  if p &lt; r                         // 区间里至少两个元素才需要排
          2  then q ← PARTITION(A, p, r)      // 分解：线性时间划分，q 是主元的最终位置
          3       QUICKSORT(A, p, q−1)        // 解决：递归排序左子数组（都 ≤ x）
          4       QUICKSORT(A, q+1, r)        // 解决：递归排序右子数组（都 ≥ x）
                                              // 合并：原地排序，什么也不用做
          PARTITION(A, p, r)                  // 划分 A[p..r]，返回主元下标 q
          1  x ← A[p]                         // 取区间第一个元素作主元 pivot
          2  i ← p                            // i 指向"≤ x 段"的最后一个位置
          3  for j ← p+1 to r                 // j 从左到右扫描整个区间
          4  do if A[j] ≤ x                   // 发现一个不大于主元的元素
          5     then i ← i + 1                // "≤ x 段"向右扩一格
          6          exchange A[i] ↔ A[j]     // 把它换进"≤ x 段"的末尾
          7  exchange A[p] ↔ A[i]             // 主元换到两段之间，一步到位
          8  return i                         // 返回主元下标 q = i
                                              // 不变量：x ｜ ≤ x ｜ ≥ x ｜ 未处理</code></pre>
                  </div>
                  <div class="code-col">
                    <p class="code-h">C++（g++ 6.3 实测通过）</p>
                    <pre class="code cpp"><code>#include &lt;cstdio&gt;                    // 用 printf 打印验证结果
          // 划分：以 A[p] 为主元，把 A[p..r] 分成 ≤x ｜ x ｜ ≥x 三段，返回主元下标
          int partition(int A[], int p, int r) {   // 对应伪代码 PARTITION(A, p, r)
              int x = A[p];                    // 主元 pivot = A[p]
              int i = p;                       // i 指向"≤ x 段"的最后一个位置
              for (int j = p + 1; j &lt;= r; ++j) {   // j 从左到右扫描 p+1 .. r
                  if (A[j] &lt;= x) {             // 发现一个不大于主元的元素
                      ++i;                     // "≤ x 段"向右扩一格
                      int t = A[i]; A[i] = A[j]; A[j] = t;   // 与 A[j] 交换，把它换进该段
                  }                            // 否则跳过：它留在"&gt; x 段"
              }                                // 扫描结束，i 就是主元该去的位置
              int t = A[p]; A[p] = A[i]; A[i] = t;   // 主元换到两段之间
              return i;                        // 返回主元下标 q
          }
          void quickSort(int A[], int p, int r) {   // 对应伪代码 QUICKSORT(A, p, r)
              if (p &lt; r) {                     // 区间长度大于 1 才需要排
                  int q = partition(A, p, r);  // 分解：O(n) 划分
                  quickSort(A, p, q - 1);      // 解决：递归排左半
                  quickSort(A, q + 1, r);      // 解决：递归排右半
              }                                // 合并：无需操作
          }
          int main() {                         // 主函数：先测划分，再测整体排序
              int A[9] = {0, 6, 10, 13, 5, 8, 3, 2, 11};   // PPT 划分算例，A[1..8]
              int q = partition(A, 1, 8);      // 先单独测一次划分
              printf("q=%d ->", q);            // 期望 q = 4
              for (int i = 1; i &lt;= 8; ++i) { printf(" %d", A[i]); }   // 期望 2 5 3 6 8 13 10 11
              printf("\\n");                    // 换行
              quickSort(A, 1, 8);              // 再用快排整体排序
              for (int i = 1; i &lt;= 8; ++i) { printf(" %d", A[i]); }   // 期望 2 3 5 6 8 10 11 13
              printf("\\n");                    // 换行
              return 0;                        // 正常结束
          }</code></pre>
                  </div>
                </div>
          
                <p>实测输出：<code>q=4 -&gt; 2 5 3 6 8 13 10 11</code> 与 <code>2 3 5 6 8 10 11 13</code> —— 与 PPT 第 12～23 页的划分结果完全一致。</p>
          
                <h3 id="sec-quicksort-h4">2.4 划分举例（PPT 第 12 页）：x = 6</h3>
          
                <p>数组 <span class="m">&lang;6,10,13,5,8,3,2,11&rang;</span>，主元 <span class="m">x = A[1] = 6</span>，<span class="m">i</span> 从 1 出发，<span class="m">j</span> 从 2 扫到 8：</p>
          
                <table class="tbl">
                  <thead><tr><th>j</th><th>A[j]</th><th>A[j] ≤ 6 ?</th><th>i</th><th>交换后数组 A[1..8]</th></tr></thead>
                  <tbody>
                    <tr><td class="num">2</td><td class="num">10</td><td>否</td><td class="num">1</td><td class="num">6 10 13 5 8 3 2 11</td></tr>
                    <tr><td class="num">3</td><td class="num">13</td><td>否</td><td class="num">1</td><td class="num">6 10 13 5 8 3 2 11</td></tr>
                    <tr><td class="num">4</td><td class="num">5</td><td>是</td><td class="num">2</td><td class="num">6 5 13 10 8 3 2 11</td></tr>
                    <tr><td class="num">5</td><td class="num">8</td><td>否</td><td class="num">2</td><td class="num">6 5 13 10 8 3 2 11</td></tr>
                    <tr><td class="num">6</td><td class="num">3</td><td>是</td><td class="num">3</td><td class="num">6 5 3 10 8 13 2 11</td></tr>
                    <tr><td class="num">7</td><td class="num">2</td><td>是</td><td class="num">4</td><td class="num">6 5 3 2 8 13 10 11</td></tr>
                    <tr><td class="num">8</td><td class="num">11</td><td>否</td><td class="num">4</td><td class="num">6 5 3 2 8 13 10 11</td></tr>
                    <tr><td>收尾</td><td>—</td><td>交换 A[1] ↔ A[4]</td><td class="num">4</td><td class="num">2 5 3 6 8 13 10 11，q = 4</td></tr>
                  </tbody>
                </table>
          
                <p>划分前 <span class="m">x = 6</span> 在第 1 位，划分后它落在 <span class="m">A[4]</span>：左边 <span class="m">2,5,3</span> 都 <span class="m">&le; 6</span>，右边 <span class="m">8,13,10,11</span> 都 <span class="m">&ge; 6</span>。一次划分只花 <span class="m">n &minus; 1 = 7</span> 次比较，<b>PARTITION 的时间是 O(n)</b>。</p>
          
                <div class="callout key">
                  <p class="callout-h">本节考点</p>
                  <p>① Hoare 1962、分治、原地、实用；② 分治三步里"合并"无事可做，<b>关键在 O(n) 的划分</b>；③ 能默写 PARTITION 并说清 <span class="m">x | &le;x | &ge;x | ?</span> 不变式；④ 会用 <span class="m">6,10,13,5,8,3,2,11</span> 手推划分，得到 <span class="m">q = 4</span>、数组 <span class="m">2 5 3 6 8 13 10 11</span>。</p>
                </div>
        ` },
      ],
    },
    {
      id: 'sec-qs-analysis',
      heading: "3. 快速排序的复杂度分析：最坏、最好、几乎最好与运气交替",
      blocks: [
        { type: 'html', html: `
          <p>PPT 第 24 页先约定两件事：<b>假设所有输入项各不相同</b>（有相同项时存在更好的划分方法）；令 <span class="m">T(n)</span> = 算法在一个 <span class="m">n</span> 项数组上的<b>最坏</b>运行时间。接下来四个情形，构成一条完整的"从最坏到随机化"的推理链。</p>
          
                <h3 id="sec-qs-analysis-h1">3.1 最坏情况：一边总是空的</h3>
          
                <p>什么时候最坏？<b>输入已经有序或者反向有序</b>，并且<b>围绕最大或者最小值划分</b>，于是<b>划分的一边总是为空</b>。递推式与解（PPT 第 25～32 页）：</p>
          
                <p class="formula">T(n) = T(0) + T(n&minus;1) + &Theta;(n) = &Theta;(1) + T(n&minus;1) + &Theta;(n) = T(n&minus;1) + &Theta;(n) = &Theta;(n<sup>2</sup>)</p>
          
                <p>最后一步是<b>算术级数</b> (arithmetic series)：<span class="m">cn + c(n&minus;1) + c(n&minus;2) + &hellip; + c = c&middot;n(n+1)/2 = &Theta;(n<sup>2</sup>)</span>。</p>
          
                <svg class="fig" viewBox="0 0 960 400" role="img" aria-label="最坏情况的递归树：每层只有一个非空子问题，代价依次为 cn、c(n−1)、c(n−2) 直到 c，总和为 Θ(n²)">
                  <text x="26" y="26" class="tx-b">图 2　最坏情况的递归树：T(n) = T(0) + T(n−1) + cn</text>
                  <text x="26" y="46" class="tx-sm">每一层都只产生一个"空子问题"和一个"只少一个元素"的子问题 —— 树退化成一条链</text>
          
                  <rect x="330" y="66" width="110" height="34" rx="6" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="1.6"></rect>
                  <text x="385" y="88" class="tx" text-anchor="middle">T(n)</text>
                  <line x1="360" y1="100" x2="270" y2="146" stroke="var(--c-line)" stroke-width="1.6"></line>
                  <line x1="410" y1="100" x2="500" y2="146" stroke="var(--c-hot)" stroke-width="2.2"></line>
                  <rect x="215" y="146" width="110" height="34" rx="6" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.2"></rect>
                  <text x="270" y="168" class="tx" text-anchor="middle">T(0)</text>
                  <rect x="445" y="146" width="110" height="34" rx="6" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="1.6"></rect>
                  <text x="500" y="168" class="tx" text-anchor="middle">T(n−1)</text>
                  <line x1="470" y1="180" x2="390" y2="226" stroke="var(--c-line)" stroke-width="1.6"></line>
                  <line x1="525" y1="180" x2="610" y2="226" stroke="var(--c-hot)" stroke-width="2.2"></line>
                  <rect x="335" y="226" width="110" height="34" rx="6" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.2"></rect>
                  <text x="390" y="248" class="tx" text-anchor="middle">T(0)</text>
                  <rect x="555" y="226" width="110" height="34" rx="6" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="1.6"></rect>
                  <text x="610" y="248" class="tx" text-anchor="middle">T(n−2)</text>
                  <line x1="585" y1="260" x2="510" y2="306" stroke="var(--c-line)" stroke-width="1.6"></line>
                  <line x1="635" y1="260" x2="712" y2="306" stroke="var(--c-hot)" stroke-width="2.2"></line>
                  <rect x="455" y="306" width="110" height="34" rx="6" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.2"></rect>
                  <text x="510" y="328" class="tx" text-anchor="middle">T(0)</text>
                  <rect x="657" y="306" width="110" height="34" rx="6" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="1.6"></rect>
                  <text x="712" y="328" class="tx" text-anchor="middle">T(1)</text>
          
                  <!-- 每层代价 -->
                  <line x1="620" y1="83" x2="860" y2="83" stroke="var(--c-hot)" stroke-width="1.4" stroke-dasharray="6 4"></line>
                  <text x="872" y="88" class="tx" fill="var(--c-hot)">cn</text>
                  <line x1="620" y1="163" x2="860" y2="163" stroke="var(--c-hot)" stroke-width="1.4" stroke-dasharray="6 4"></line>
                  <text x="872" y="168" class="tx" fill="var(--c-hot)">c(n−1)</text>
                  <line x1="700" y1="243" x2="860" y2="243" stroke="var(--c-hot)" stroke-width="1.4" stroke-dasharray="6 4"></line>
                  <text x="872" y="248" class="tx" fill="var(--c-hot)">c(n−2)</text>
                  <line x1="770" y1="323" x2="860" y2="323" stroke="var(--c-hot)" stroke-width="1.4" stroke-dasharray="6 4"></line>
                  <text x="872" y="328" class="tx" fill="var(--c-hot)">c</text>
                  <text x="150" y="168" class="tx-sm">空子问题</text>
                  <text x="150" y="188" class="tx-sm">每层只有一个</text>
          
                  <text x="26" y="372" class="tx">总代价 = cn + c(n−1) + c(n−2) + … + c = c·n(n+1)/2 = Θ(n²)：树高 n，每层代价线性递减，和是二次的。</text>
                </svg>
                <p class="fig-cap">图 2 &nbsp;最坏情况递归树：每层代价 <span class="m">cn, c(n&minus;1), c(n&minus;2), &hellip;, c</span>，总和 <span class="m">&Theta;(n<sup>2</sup>)</span></p>
          
                <h3 id="sec-qs-analysis-h2">3.2 最好情况：均分</h3>
          
                <p>如果幸运，PARTITION 会将数组均分（PPT 第 33 页，标注"<b>仅供想象!</b>"）：</p>
          
                <p class="formula">T(n) = 2T(n/2) + &Theta;(n) = &Theta;(n lg n)</p>
          
                <p>这与合并排序的递归式相同（见 <a href="deck3.html">L2 · 算法分析基础</a> 的主方法）。但"均分"并不是快排能保证的，它只是理想情形。</p>
          
                <h3 id="sec-qs-analysis-h3">3.3 "几乎最好"：固定比例划分仍是 &Theta;(n lg n)</h3>
          
                <p>PPT 第 34～38 页问了一个更好的问题：如果划分<b>总是</b>按固定比例（例如 <b>1 : 9</b>）分，会怎样？此时</p>
          
                <p class="formula">T(n) = T(n/10) + T(9n/10) + &Theta;(n)</p>
          
                <p>递归树里，<b>每一层的代价之和都是 cn</b>（因为 <span class="m">1/10 + 9/10 = 1</span>，子问题的规模加起来恰好等于父问题）；而树的深度并不均匀：最浅的叶子沿 <span class="m">1/10</span> 那条路走，深度 <span class="m">log<sub>10</sub> n</span>；最深的叶子沿 <span class="m">9/10</span> 那条路走，深度 <span class="m">log<sub>10/9</sub> n</span>。于是</p>
          
                <p class="formula">cn&middot;log<sub>10</sub> n &le; T(n) &le; cn&middot;log<sub>10/9</sub> n + O(n) &rArr; T(n) = &Theta;(n lg n)</p>
          
                <svg class="fig" viewBox="0 0 960 400" role="img" aria-label="几乎最好情况的递归树：1 比 9 划分，每层总代价 cn，最浅叶子深度 log10 n，最深叶子深度 log(10/9) n">
                  <text x="26" y="26" class="tx-b">图 3　"几乎最好"：1 : 9 划分的递归树（每层代价之和都是 cn，深度差一个常数倍）</text>
                  <text x="26" y="46" class="tx-sm">子问题规模 1/10 + 9/10 = 1 —— 层内代价不缩水，但层数只有 O(lg n)，所以总代价仍是 Θ(n lg n)</text>
          
                  <rect x="425" y="66" width="110" height="34" rx="6" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="1.6"></rect>
                  <text x="480" y="88" class="tx" text-anchor="middle">cn</text>
                  <line x1="455" y1="100" x2="330" y2="146" stroke="var(--c-line)" stroke-width="1.6"></line>
                  <line x1="505" y1="100" x2="630" y2="146" stroke="var(--c-line)" stroke-width="1.6"></line>
                  <text x="372" y="122" class="tx-sm" text-anchor="middle">1/10</text>
                  <text x="588" y="122" class="tx-sm" text-anchor="middle">9/10</text>
          
                  <rect x="275" y="146" width="110" height="34" rx="6" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.4"></rect>
                  <text x="330" y="168" class="tx" text-anchor="middle">1/10 cn</text>
                  <rect x="575" y="146" width="110" height="34" rx="6" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.4"></rect>
                  <text x="630" y="168" class="tx" text-anchor="middle">9/10 cn</text>
                  <line x1="305" y1="180" x2="190" y2="226" stroke="var(--c-line)" stroke-width="1.4"></line>
                  <line x1="355" y1="180" x2="350" y2="226" stroke="var(--c-line)" stroke-width="1.4"></line>
                  <line x1="605" y1="180" x2="510" y2="226" stroke="var(--c-line)" stroke-width="1.4"></line>
                  <line x1="655" y1="180" x2="670" y2="226" stroke="var(--c-line)" stroke-width="1.4"></line>
          
                  <rect x="130" y="226" width="120" height="34" rx="6" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.2"></rect>
                  <text x="190" y="248" class="tx" text-anchor="middle">1/100 cn</text>
                  <rect x="290" y="226" width="120" height="34" rx="6" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.2"></rect>
                  <text x="350" y="248" class="tx" text-anchor="middle">9/100 cn</text>
                  <rect x="450" y="226" width="120" height="34" rx="6" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.2"></rect>
                  <text x="510" y="248" class="tx" text-anchor="middle">9/100 cn</text>
                  <rect x="610" y="226" width="120" height="34" rx="6" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.2"></rect>
                  <text x="670" y="248" class="tx" text-anchor="middle">81/100 cn</text>
          
                  <!-- 每层代价 -->
                  <line x1="545" y1="83" x2="860" y2="83" stroke="var(--c-accent-2)" stroke-width="1.4" stroke-dasharray="6 4"></line>
                  <text x="872" y="88" class="tx" fill="var(--c-accent-2)">cn</text>
                  <line x1="660" y1="163" x2="860" y2="163" stroke="var(--c-accent-2)" stroke-width="1.4" stroke-dasharray="6 4"></line>
                  <text x="872" y="168" class="tx" fill="var(--c-accent-2)">cn</text>
                  <line x1="800" y1="243" x2="860" y2="243" stroke="var(--c-accent-2)" stroke-width="1.4" stroke-dasharray="6 4"></line>
                  <text x="872" y="248" class="tx" fill="var(--c-accent-2)">cn</text>
          
                  <text x="26" y="310" class="tx" fill="var(--c-ok)">最浅叶子：深度 log₁₀ n（一直取 1/10 那一边）</text>
                  <text x="26" y="334" class="tx" fill="var(--c-hot)">最深叶子：深度 log₁₀/₉ n（一直取 9/10 那一边）　⇒ 两者只差常数倍 ≈ 21.85</text>
                  <text x="26" y="362" class="tx-sm">补充算例：n = 10⁶ 时 log₁₀ n = 6，而 log₁₀/₉ n = 6 ÷ log₁₀(10/9) ≈ 131 —— 深度差了 20 多倍，但都只是 lg n 的常数倍。</text>
                </svg>
                <p class="fig-cap">图 3 &nbsp;1 : 9 划分的递归树：每层 <span class="m">cn</span>，层数 <span class="m">O(lg n)</span>，所以 <span class="m">&Theta;(n lg n)</span></p>
          
                <h3 id="sec-qs-analysis-h4">3.4 运气交替：幸运、不幸、幸运、不幸……</h3>
          
                <p>PPT 第 39 页"更多的想象"：假设我们的运气<b>交替变化</b> —— 幸运、不幸、幸运、不幸、幸运……令 <span class="m">L(n)</span> 是"幸运"情形的时间、<span class="m">U(n)</span> 是"不幸"情形的时间：</p>
          
                <p class="formula">L(n) = 2U(n/2) + &Theta;(n)　（幸运：均分）　　U(n) = L(n&minus;1) + &Theta;(n)　（不幸：一边为空）</p>
          
                <p>代入消去 <span class="m">U</span>：</p>
          
                <p class="formula">L(n) = 2(L(n/2 &minus; 1) + &Theta;(n/2)) + &Theta;(n) = 2L(n/2 &minus; 1) + &Theta;(n) = &Theta;(n lg n)</p>
          
                <p>结论是"<b>幸运!</b>"：<b>好坏交替也不会退化到 <span class="m">&Theta;(n<sup>2</sup>)</span></b>，因为坏划分只浪费一层 <span class="m">O(n)</span> 的代价，好的划分仍然把规模减半。于是 PPT 顺势提出关键问题：<b>怎样才能保证我们在多数情况下是幸运的？</b>答案就是随机化。</p>
          
                <h3 id="sec-qs-analysis-h5">3.5 随机快速排序</h3>
          
                <p><b>思想：围绕一个随机项进行划分。</b>PPT 第 40 页给出四条性质：</p>
          
                <ul>
                  <li>运行时间和<b>输入顺序无关</b>；</li>
                  <li>不需要对输入数据的分布做任何假设；</li>
                  <li>不存在特定输入会导致最坏情况出现（攻击者无法构造"专杀"输入）；</li>
                  <li>最坏情况仅仅取决于<b>随机数发生器的输出</b>。</li>
                </ul>
          
                <div class="callout key">
                  <p class="callout-h">本节考点（四种情形的结论要能背）</p>
                  <p>① 最坏（有序/逆序，围绕最大或最小划分，一边为空）：<span class="m">T(n) = T(0) + T(n&minus;1) + cn = &Theta;(n<sup>2</sup>)</span>；② 最好（均分）：<span class="m">T(n) = 2T(n/2) + &Theta;(n) = &Theta;(n lg n)</span>；③ 几乎最好（固定 1:9）：<span class="m">T(n) = T(n/10) + T(9n/10) + &Theta;(n) = &Theta;(n lg n)</span>，每层 <span class="m">cn</span>、深度 <span class="m">O(lg n)</span>；④ 运气交替：<span class="m">L(n) = 2U(n/2) + &Theta;(n)</span>、<span class="m">U(n) = L(n&minus;1) + &Theta;(n)</span> &rArr; <span class="m">L(n) = &Theta;(n lg n)</span>。结论：随机化让运行时间与输入顺序无关。</p>
                </div>
        ` },
      ],
    },
    {
      id: 'sec-randomized-select',
      heading: "4. 期望为线性时间的选择算法 RANDOMIZED-SELECT",
      blocks: [
        { type: 'html', html: `
          <p>PPT 第 41 页一句话点破与快速排序的关系：<b>"以快速排序算法为模型，区别是：快速排序会递归处理划分的两边，而选择算法只处理划分的一边。期望运行时间是 &Theta;(n)，最坏运行时间为 &Theta;(n<sup>2</sup>)。"</b>函数返回数组 <span class="m">A[p..r]</span> 中<b>第 i 小</b>的元素；<span class="m">RANDOMIZED-PARTITION</span> 能等概率地返回任何元素作为主元 (pivot)。</p>
          
                <div class="callout key">
                  <p class="callout-h">为什么"只递归一边"就能到线性？</p>
                  <p>快排两边都递归，每层的工作量是 <span class="m">cn</span>、层数 <span class="m">lg n</span>，所以 <span class="m">&Theta;(n lg n)</span>。选择只递归一边：如果每次划分后剩下的那一边规模是 <span class="m">&alpha;n</span>（<span class="m">&alpha; &lt; 1</span>），总代价就是 <span class="m">cn(1 + &alpha; + &alpha;<sup>2</sup> + &hellip;) = cn/(1&minus;&alpha;) = O(n)</span> —— <b>几何级数收敛</b>。平均来看 <span class="m">&alpha; &asymp; 3/4</span>，所以期望线性。</p>
                </div>
          
                <h3 id="sec-randomized-select-h1">4.1 伪代码（PPT 第 41 页原图逐行）</h3>
          
                <p>先补上 RANDOMIZED-PARTITION（第 41 页文字说明"能等概率地返回任何元素作为主元"），再是 RANDOMIZED-SELECT 本体。<b>伪代码 1～9 行的编号、比较符号、注释位置都按原图</b>。</p>
          
                <div class="code-pair">
                  <div class="code-col">
                    <p class="code-h">伪代码（PPT 第 41 页原图）</p>
                    <pre class="code"><code>RANDOMIZED-PARTITION(A, p, r)       // 等概率地选一个元素作主元
          1  i ← RANDOM(p, r)                 // 在 [p, r] 中随机取一个下标
          2  exchange A[p] ↔ A[i]             // 把随机主元换到区间首
          3  return PARTITION(A, p, r)        // 再做普通划分（见第 2 节）
          
          RANDOMIZED-SELECT(A, p, r, i)       // 返回 A[p..r] 中第 i 小的元素
          1  if p == r                        // 区间只剩一个元素
          2      return A[p]                  // 那它就是答案
          3  q = RANDOMIZED-PARTITION(A, p, r)   // 随机划分，q 为主元最终位置
          4  k = q − p + 1                    // 主元是本区间第 k 小
          5  if i == k                        // the pivot value is the answer（主元就是答案）
          6      return A[q]                  // 主元就是答案，直接返回
          7  else if i < k                    // 答案在左半边
          8      return RANDOMIZED-SELECT(A, p, q−1, i)     // 只递归左边，i 不变
          9  else return RANDOMIZED-SELECT(A, q+1, r, i−k)  // 只递归右边，名次减 k</code></pre>
                  </div>
                  <div class="code-col">
                    <p class="code-h">C++（g++ 6.3 实测通过）</p>
                    <pre class="code cpp"><code>#include &lt;cstdio&gt;                     // 打印验证结果
          #include &lt;cstdlib&gt;                    // 随机数函数 rand() 与 srand()
          // partition 见第 2 节代码，这里直接复用
          int randomizedPartition(int A[], int p, int r) {   // 随机划分
              int k = p + rand() % (r - p + 1);    // 在 [p, r] 中等概率取一个下标
              int t = A[p]; A[p] = A[k]; A[k] = t; // 把随机主元换到区间首
              return partition(A, p, r);       // 再调用普通划分（第 2 节）
          }
          int randomizedSelect(int A[], int p, int r, int i) {   // 返回第 i 小
              if (p == r) { return A[p]; }     // 只剩一个元素，它就是答案
              int q = randomizedPartition(A, p, r);   // 随机划分，q 为主元位置
              int k = q - p + 1;               // 主元是本区间第 k 小
              if (i == k) { return A[q]; }     // 主元正好是答案
              else if (i &lt; k) {                // 答案在左半边
                  return randomizedSelect(A, p, q - 1, i);   // 只递归左边
              } else {                         // 答案在右半边
                  return randomizedSelect(A, q + 1, r, i - k);   // 只递归右边，名次减 k
              }
          }
          int main() {                         // 主函数：对 k = 1..8 逐个求第 k 小
              int B[9] = {0, 6, 10, 13, 5, 8, 3, 2, 11};   // PPT 的 8 个数
              srand(20261019);                 // 固定随机种子，结果可复现
              for (int k = 1; k &lt;= 8; ++k) {   // 对每个 k 都求一次
                  int C[9];                    // 工作副本
                  for (int i = 1; i &lt;= 8; ++i) { C[i] = B[i]; }   // 复制原始数据
                  printf("%d ", randomizedSelect(C, 1, 8, k));    // 打印第 k 小
              }
              printf("\\n");                    // 期望 2 3 5 6 8 10 11 13
              return 0;                        // 正常结束
          }</code></pre>
                  </div>
                </div>
          
                <p>实测输出：<code>2 3 5 6 8 10 11 13</code>（第 1 小到第 8 小）。<span class="m">RANDOMIZED-SELECT</span> 的每一次调用只有一个递归分支，所以它就是<b>尾递归</b>，工程上可以直接改成 while 循环，额外空间 <span class="m">O(1)</span>。</p>
          
                <h3 id="sec-randomized-select-h2">4.2 动画：8 个数找第 3 小，只走一边</h3>
          
                <p>下面用 PPT 的划分算例 <span class="m">&lang;6,10,13,5,8,3,2,11&rang;</span> 演示求<b>第 3 小</b>的全过程，共 <b>22 步</b>。为了能看到"随机"的效果，随机主元按固定序列模拟（第 1 层取 A[5]、第 2 层取 A[3]、第 3 层取 A[2]），每一步都显示 <span class="m">p, r, i, x, q, k</span> 与<b>丢弃了哪一侧</b>。</p>
        ` },
        { type: 'demo', name: 'randomized-select', title: "RANDOMIZED-SELECT：⟨6,10,13,5,8,3,2,11⟩ 找第 3 小（22 步，每层只递归一边）" },
        { type: 'html', html: `
          <table class="tbl">
                  <thead><tr><th>层</th><th>区间</th><th>随机主元</th><th>划分后 q</th><th>k = q−p+1</th><th>判定</th><th>丢弃</th></tr></thead>
                  <tbody>
                    <tr><td class="num">1</td><td class="num">p=1, r=8</td><td class="num">8（原 A[5]）</td><td class="num">5</td><td class="num">5</td><td>i=3 &lt; k=5 &rArr; 左</td><td class="num">A[5..8]</td></tr>
                    <tr><td class="num">2</td><td class="num">p=1, r=4</td><td class="num">6（原 A[3]）</td><td class="num">4</td><td class="num">4</td><td>i=3 &lt; k=4 &rArr; 左</td><td class="num">A[4..8]</td></tr>
                    <tr><td class="num">3</td><td class="num">p=1, r=3</td><td class="num">5（原 A[2]）</td><td class="num">3</td><td class="num">3</td><td>i=3 = k &rArr; 返回 5</td><td>—</td></tr>
                  </tbody>
                </table>
          
                <p>三层划分的规模是 <b>8 &rarr; 4 &rarr; 3</b>，总代价不超过 <span class="m">c&middot;8 + c&middot;4 + c&middot;3 = 15c</span>；如果每层都像快排那样两边都进，规模就会变成 <span class="m">8 + 7 + 6 + &hellip;</span>（最坏 <span class="m">&Theta;(n<sup>2</sup>)</span>）或 <span class="m">8 + 8 + 8 &hellip;</span>（<span class="m">&Theta;(n lg n)</span>）。</p>
          
                <h3 id="sec-randomized-select-h3">4.3 期望运行时间分析（指示器随机变量）</h3>
          
                <p>令 <span class="m">T(n)</span> = 含有 <span class="m">n</span> 个元素的输入数组 <span class="m">A[p..r]</span> 上的运行时间。定义<b>指示器随机变量</b> (indicator random variable)：</p>
          
                <p class="formula">X<sub>k</sub> = 1（如果 PARTITION 产生一个 k : n&minus;k&minus;1 分割）；否则 X<sub>k</sub> = 0</p>
          
                <p>假设元素互异：因为所有分割出现概率相同，对每个 <span class="m">k</span>，子数组刚好是 <span class="m">k</span> 个元素全部小于或等于主元的概率是 <span class="m">1/n</span>，所以</p>
          
                <p class="formula">E[X<sub>k</sub>] = Pr{X<sub>k</sub> = 1} = 1/n</p>
          
                <p>当 <span class="m">X<sub>k</sub> = 1</span> 时，可能要递归处理的两个子数组大小分别为 <span class="m">k&minus;1</span> 和 <span class="m">n&minus;k</span>。为了得到上界，我们<b>假定第 i 个元素总是在划分中包含较大元素的一边</b>（因为 <span class="m">T(n)</span> 单调递增），于是</p>
          
                <p class="formula">T(n) &le; &sum;<sub>k=1..n</sub> X<sub>k</sub>&middot;(T(max(k&minus;1, n&minus;k)) + O(n)) = &sum;<sub>k=1..n</sub> X<sub>k</sub>&middot;T(max(k&minus;1, n&minus;k)) + O(n)</p>
          
                <p>两边取期望（<span class="m">X<sub>k</sub></span> 与 <span class="m">T(max(&middot;))</span> 独立）：</p>
          
                <p class="formula">E[T(n)] &le; &sum;<sub>k=1..n</sub> E[X<sub>k</sub>]&middot;E[T(max(k&minus;1, n&minus;k))] + O(n) = (1/n)&sum;<sub>k=1..n</sub> E[T(max(k&minus;1, n&minus;k))] + O(n)</p>
          
                <p>再处理 <span class="m">max(k&minus;1, n&minus;k)</span>：</p>
          
                <p class="formula">max(k&minus;1, n&minus;k) = k&minus;1（若 k &gt; &lceil;n/2&rceil;）；= n&minus;k（若 k &le; &lceil;n/2&rceil;）</p>
          
                <p>如果 <span class="m">n</span> 是偶数，则从 <span class="m">T(&lfloor;n/2&rfloor;)</span> 到 <span class="m">T(n&minus;1)</span> 的每一项在总和中<b>恰好出现两次</b>；如果 <span class="m">n</span> 是奇数，除了 <span class="m">T(&lfloor;n/2&rfloor;)</span> 出现一次以外，其他项也都出现两次。因此</p>
          
                <p class="formula">E[T(n)] &le; (2/n)&sum;<sub>k=&lfloor;n/2&rfloor;..n&minus;1</sub> E[T(k)] + O(n)</p>
          
                <table class="tbl">
                  <thead><tr><th>主元位置 k（n = 7）</th><th>左边 k&minus;1</th><th>右边 n&minus;k</th><th>m = max(k&minus;1, n&minus;k)</th><th>对应 T(m)</th><th>配对情况</th></tr></thead>
                  <tbody>
                    <tr><td class="num">1</td><td class="num">0</td><td class="num">6</td><td class="num">6</td><td class="num">T(6)</td><td>与 k = 7 配对</td></tr>
                    <tr><td class="num">2</td><td class="num">1</td><td class="num">5</td><td class="num">5</td><td class="num">T(5)</td><td>与 k = 6 配对</td></tr>
                    <tr><td class="num">3</td><td class="num">2</td><td class="num">4</td><td class="num">4</td><td class="num">T(4)</td><td>与 k = 5 配对</td></tr>
                    <tr><td class="num">4</td><td class="num">3</td><td class="num">3</td><td class="num">3</td><td class="num">T(3)</td><td>正中间，无配对，仅出现 1 次</td></tr>
                    <tr><td class="num">5</td><td class="num">4</td><td class="num">2</td><td class="num">4</td><td class="num">T(4)</td><td>与 k = 3 配对</td></tr>
                    <tr><td class="num">6</td><td class="num">5</td><td class="num">1</td><td class="num">5</td><td class="num">T(5)</td><td>与 k = 2 配对</td></tr>
                    <tr><td class="num">7</td><td class="num">6</td><td class="num">0</td><td class="num">6</td><td class="num">T(6)</td><td>与 k = 1 配对</td></tr>
                  </tbody>
                </table>
          
                <p>表里可以看得很清楚：<span class="m">k = 1</span> 与 <span class="m">k = 7</span> 的 <span class="m">m</span> 都是 6，<span class="m">k = 2</span> 与 <span class="m">k = 6</span> 的 <span class="m">m</span> 都是 5 …… 只有正中间 <span class="m">k = 4</span> 落单。所以求和里 <span class="m">T(&lfloor;n/2&rfloor;)</span> 到 <span class="m">T(n&minus;1)</span> 的每一项最多出现两次，这就是系数 <span class="m">2/n</span> 的来源。</p>
          
                <h3 id="sec-randomized-select-h4">4.4 代换法证明 E[T(n)] = O(n)</h3>
          
                <p>希望证明 <span class="m">E[T(n)] = O(n)</span>：假设对满足递归式初始条件的某个常数 <span class="m">c</span>，有 <span class="m">E[T(n)] &le; cn</span>，代入并放大：</p>
          
                <p class="formula">E[T(n)] &le; (2/n)&sum;<sub>k=&lfloor;n/2&rfloor;..n&minus;1</sub> ck + an</p>
                <p class="formula">= (2c/n)(&sum;<sub>k=1..n&minus;1</sub> k &minus; &sum;<sub>k=1..&lfloor;n/2&rfloor;&minus;1</sub> k) + an</p>
                <p class="formula">= (2c/n)((n&minus;1)n/2 &minus; (&lfloor;n/2&rfloor;&minus;1)&lfloor;n/2&rfloor;/2) + an</p>
                <p class="formula">&le; (2c/n)((n&minus;1)n/2 &minus; (n/2&minus;2)(n/2&minus;1)/2) + an</p>
                <p class="formula">= (2c/n)((n<sup>2</sup>&minus;n)/2 &minus; (n<sup>2</sup>/4 &minus; 3n/2 + 2)/2) + an</p>
                <p class="formula">= (c/n)(3n<sup>2</sup>/4 + n/2 &minus; 2) + an = c(3n/4 + 1/2 &minus; 2/n) + an</p>
                <p class="formula">&le; 3cn/4 + c/2 + an = cn &minus; (cn/4 &minus; c/2 &minus; an) &le; cn</p>
          
                <p>只要 <span class="m">cn/4 &minus; c/2 &minus; an &ge; 0</span>（即 <span class="m">c</span> 足够大、<span class="m">n</span> 足够大，例如 <span class="m">n &ge; 4a + 2</span>），最后一步就成立；<span class="m">n</span> 小于该常数时属于基本情况，取足够大的 <span class="m">c</span> 也能让 <span class="m">E[T(n)] &le; cn</span> 成立。故 <span class="m">E[T(n)] = O(n)</span>。</p>
          
                <div class="callout tip">
                  <p class="callout-h">关键常数：3/8 与 3/4</p>
                  <p>把求和粗放一点更容易记：区间 <span class="m">[&lfloor;n/2&rfloor;, n&minus;1]</span> 长约 <span class="m">n/2</span>、每项小于 <span class="m">n</span>，所以 <span class="m">&sum; k &lt; (n/2)&middot;n = n<sup>2</sup>/2</span>（这个界太松，只够说明"不超二次"）；教材里更精确的界是 <span class="m">&sum;<sub>k=&lfloor;n/2&rfloor;..n&minus;1</sub> k &le; (3/8)n<sup>2</sup></span>，于是 <span class="m">(2c/n)&middot;(3n<sup>2</sup>/8) = 3cn/4</span> —— 这正是上面推导中"<span class="m">&le; 3cn/4 + c/2 + an</span>"的那一项。看到 <span class="m">3cn/4</span> 就说明<b>剩下 <span class="m">cn/4</span> 的余量可以吸收 <span class="m">O(n)</span> 和低阶项</b>，这就是"线性"成立的机理。</p>
                </div>
          
                <div class="callout warn">
                  <p class="callout-h">易错：期望线性 ≠ 最坏线性</p>
                  <p><span class="m">E[T(n)] = &Theta;(n)</span> 是对随机选择取期望之后的结论。最坏情况下随机数发生器可能连续给出最差主元（每次划分都是 <span class="m">0 : n&minus;1</span>），此时 <span class="m">T(n) = T(n&minus;1) + O(n) = &Theta;(n<sup>2</sup>)</span>。要"保证"最坏线性，必须换成下一节的 BFPRT。</p>
                </div>
          
                <div class="callout key">
                  <p class="callout-h">本节考点</p>
                  <p>① 与快排的唯一区别：<b>只递归划分的一边</b>；② 伪代码 9 行（<span class="m">k = q&minus;p+1</span>、三种分支、右半边名次 <span class="m">i&minus;k</span>）；③ 期望 <span class="m">&Theta;(n)</span>、最坏 <span class="m">&Theta;(n<sup>2</sup>)</span>；④ 期望分析四步：指示器 <span class="m">X<sub>k</sub></span>、<span class="m">E[X<sub>k</sub>]=1/n</span>、成对放大得 <span class="m">(2/n)&sum;</span>、代换法得 <span class="m">cn &minus; cn/4 + &hellip; &le; cn</span>。</p>
                </div>
        ` },
      ],
    },
    {
      id: 'sec-bfprt',
      heading: "5. 最坏情况为线性时间的选择算法（BFPRT / 中位数之中位数）",
      blocks: [
        { type: 'html', html: `
          <p><b>动机</b>：RANDOMIZED-SELECT 的最坏情况是 <span class="m">&Theta;(n<sup>2</sup>)</span> —— 只要随机数发生器不配合（或者输入是攻击者构造的），就会退化成"每次只剥掉一个元素"。要<b>确定性地</b>保证线性，就必须让主元"<b>足够靠中间</b>"，而且这个主元要能在 <span class="m">O(n)</span> 内算出来。BFPRT 算法（Blum、Floyd、Pratt、Rivest、Tarjan，1973）用"<b>中位数之中位数</b>" (median of medians) 做到了这一点。</p>
          
                <h3 id="sec-bfprt-h1">5.1 五步算法（PPT 第 54 页）</h3>
          
                <p>基本思路：<b>随机的得到主元 &rarr; 把划分的主元也作为输入参数</b>。算法步骤：</p>
          
                <ol>
                  <li>将数组分为若干组，<b>每 5 个一组</b>，剩余的 <span class="m">n mod 5</span> 个元素组成单独一个组（最后一组可能会不满 5 个）；</li>
                  <li>对每一组单独进行排序（比较简单的排序方式都可以），<b>取出每一组的中位数</b>；</li>
                  <li>将取出的所有组中位数，<b>递归调用 Select 函数</b>，找出所有中位数的中位数 <span class="m">x</span>；</li>
                  <li>按照这个中位数 <span class="m">x</span>，对当前 <span class="m">[left, right]</span> 范围序列进行<b>划分</b>；</li>
                  <li>定义 <span class="m">res = mid &minus; left + 1</span> 判断是否是当前的第 <span class="m">k</span> 小元素，若是直接返回 <span class="m">a[mid]</span>；否则：若 <span class="m">k &lt; res</span>，在左半部分递归调用，寻找 <span class="m">[left, mid&minus;1]</span> 内的第 <span class="m">k</span> 小元素；若 <span class="m">k &gt; res</span>，在右半部分递归调用，寻找 <span class="m">[mid+1, right]</span> 内的第 <span class="m">k&minus;res</span> 小元素。</li>
                </ol>
          
                <h3 id="sec-bfprt-h2">5.2 引例：23 个数据，找第 8 小（PPT 第 49～53 页）</h3>
          
                <p>PPT 用 5 列（每列 5 个，最后一列 3 个）的图演示了这五步，数据（按列读）是：</p>
          
                <table class="tbl">
                  <thead><tr><th>组</th><th>元素</th><th>组内排序后</th><th>组内中位数</th></tr></thead>
                  <tbody>
                    <tr><td>第 1 组</td><td class="num">1, 39, 12, 2, 45</td><td class="num">1, 2, 12, 39, 45</td><td class="num">12</td></tr>
                    <tr><td>第 2 组</td><td class="num">5, 68, 16, 6, 97</td><td class="num">5, 6, 16, 68, 97</td><td class="num">16</td></tr>
                    <tr><td>第 3 组</td><td class="num">3, 47, 14, 4, 26</td><td class="num">3, 4, 14, 26, 47</td><td class="num">14</td></tr>
                    <tr><td>第 4 组</td><td class="num">9, 72, 18, 10, 58</td><td class="num">9, 10, 18, 58, 72</td><td class="num">18</td></tr>
                    <tr><td>第 5 组（3 个）</td><td class="num">7, 8, 32</td><td class="num">7, 8, 32</td><td class="num">8</td></tr>
                  </tbody>
                </table>
          
                <p><span class="m">medians = &lang;12,16,14,18,8&rang;</span>，<span class="m">g = 5</span>；递归求它们的中位数：排序后 <span class="m">&lang;8,12,14,16,18&rang;</span>，取第 <span class="m">&lceil;5/2&rceil; = 3</span> 个 ⇒ <b><span class="m">x = 14</span></b>。以 14 划分：<b>11 个元素小于 14</b>（1,2,12,5,6,3,4,9,10,7,8），14 落在<b>第 12 位</b>，右边 11 个都大于 14。于是 <span class="m">res = 12 &minus; 1 + 1 = 12 &gt; k = 8</span> ⇒ 只递归左半边找第 8 小。</p>
          
                <div class="callout warn">
                  <p class="callout-h">与 PPT 图的一处不一致（必须说明）</p>
                  <p>PPT 第 51～52 页的图把"<b>第 3 行</b>"当成了中位数行，于是不满 5 个的末组 <span class="m">&lang;7,8,32&rang;</span> 取了排在第三行的 <b>32</b>，得到 <span class="m">x = 16</span>；但按"中位数 = 第 <span class="m">&lceil;len/2&rceil;</span> 个"的定义，3 个元素的中位数是 <b>8</b>，正确的 <span class="m">x = 14</span>（与 5 个元素时"取第 3 个"的规则一致）。两条路径都能得到答案 8：<br>
                  　· 本页（正确取法）：<span class="m">x = 14</span> 是第 12 小 ⇒ <span class="m">k = 8 &lt; 12</span> ⇒ 左半边 11 个 ⇒ 第二层中位数 <span class="m">&lang;3,8,12&rang;</span> ⇒ <span class="m">x = 8</span> ⇒ 8 恰在第 8 位 ⇒ <b>答案 8</b>；<br>
                  　· 按 PPT 图的取法：<span class="m">x = 16</span> 是第 13 小 ⇒ 左半边 12 个 ⇒ 第二层的组内中位数是 <span class="m">&lang;7,8,3&rang;</span>（末组 2 个、取较小者 3）⇒ <span class="m">x = 7</span> ⇒ <span class="m">k = 8 &gt; 7</span> ⇒ 右边找第 1 小 ⇒ <b>答案仍是 8</b>。</p>
                </div>
          
                <h3 id="sec-bfprt-h3">5.3 伪代码 + C++</h3>
          
                <p>先看 <b>PARTITION-AROUND</b>（PPT 第 55 页图）：与普通 PARTITION 的区别是"枢轴值 <span class="m">x</span> 是作为参数传进来的"，所以要先在中点附近找到值等于 <span class="m">x</span> 的那个元素、换到 <span class="m">A[r]</span>，再按 Lomuto 方式划分。</p>
          
                <div class="code-pair">
                  <div class="code-col">
                    <p class="code-h">伪代码 PARTITION-AROUND（PPT 第 55 页）</p>
                    <pre class="code"><code>PARTITION-AROUND(A, p, r, x)          // 以已知值 x 为枢轴划分 A[p..r]
          1  ixl = ⌊(p + r) / 2⌋                // 左探测起点：区间中点
          2  ixr = ⌈(p + r) / 2⌉                // 右探测起点：区间中点
          3  half = ⌊(r − p) / 2⌋               // 最多向两侧各探 half 步
          4  for radius = 0 to half             // 半径从 0 逐渐增大
          5      if (A[ixl − radius] == x)      // 左半边探到值为 x 的元素
          6          exchange A[r] with A[ixl − radius]   // 把 x 换到区间末尾 A[r]
          7          break                       // 找到就停
          8      else if (A[ixr + radius] == x) // 右半边探到值为 x 的元素
          9          exchange A[r] with A[ixr + radius]   // 同样把 x 换到 A[r]
          10         break                       // 找到就停
          11 i = p − 1                          // Lomuto 划分：i 指向"≤ x 段"末尾
          12 for j = p to r − 1                 // 注意扫到 r−1，因为 x 已在 A[r]
          13     if A[j] ≤ x                    // 发现一个不大于 x 的元素
          14         i = i + 1                   // "≤ x 段"扩一格
          15         exchange A[i] with A[j]     // 换进"≤ x 段"的末尾
          16 exchange A[i + 1] with A[r]        // 把 x 放到两段之间
          17 return i + 1                       // 返回 x 的新下标（主元位置 q）</code></pre>
                  </div>
                  <div class="code-col">
                    <p class="code-h">C++（g++ 6.3 实测通过）</p>
                    <pre class="code cpp"><code>// 在 A[p..r] 中从中点向两侧找值为 x 的元素，换到 A[r]，再做 Lomuto 划分
          int partitionAround(int A[], int p, int r, int x) {   // 以指定值 x 为枢轴划分 A[p..r]
              int ixl = (p + r) / 2;           // 左探测起点：区间中点
              int ixr = (p + r) / 2;           // 右探测起点：同一中点
              int half = (r - p) / 2;          // 最多向两侧各探 half 步
              for (int radius = 0; radius &lt;= half; ++radius) {   // 半径逐渐加大
                  if (A[ixl - radius] == x) {  // 左半边探到 x
                      int t = A[r]; A[r] = A[ixl - radius]; A[ixl - radius] = t;   // 换到 A[r]
                      break;                   // 找到就停
                  } else if (A[ixr + radius] == x) {   // 右半边探到 x
                      int t = A[r]; A[r] = A[ixr + radius]; A[ixr + radius] = t;   // 同样换到 A[r]
                      break;                   // 找到就停
                  }                            // 否则继续加大半径
              }                                // 探测结束
              if (A[r] != x) {                 // 兜底：极端边界下没探到（x 必在区间内）
                  for (int t2 = p; t2 &lt;= r; ++t2) {   // 线性扫一遍
                      if (A[t2] == x) { int t3 = A[r]; A[r] = A[t2]; A[t2] = t3; break; }   // 换到 A[r]
                  }                            // 扫描结束
              }                                // 兜底结束
              int i = p - 1;                   // Lomuto：i 指向"≤ x 段"末尾
              for (int j = p; j &lt;= r - 1; ++j) {   // 扫到 r−1，x 已在 A[r]
                  if (A[j] &lt;= x) {             // 发现不大于 x 的元素
                      ++i; int t = A[i]; A[i] = A[j]; A[j] = t;   // 换进"≤ x 段"
                  }                            // 否则留在"&gt; x 段"
              }                                // 扫描结束
              int t = A[i + 1]; A[i + 1] = A[r]; A[r] = t;   // 把 x 放到两段之间
              return i + 1;                    // 返回 x 的新下标
          }</code></pre>
                  </div>
                </div>
          
                <p>再看 <b>SELECT</b>（PPT 第 55 页第二张图）：开头那个 <span class="m">while</span> 循环把元素个数"削"成 5 的倍数，之后 5 个一列原地排序、递归求 <span class="m">x</span>、划分、三选一递归。</p>
          
                <div class="code-pair">
                  <div class="code-col">
                    <p class="code-h">伪代码 SELECT（PPT 第 55 页）</p>
                    <pre class="code"><code>SELECT(A, p, r, i)                    // 最坏 O(n)：返回 A[p..r] 中第 i 小
          1  while (r − p + 1) mod 5 ≠ 0         // 元素个数不是 5 的倍数就先"削"
          2      for j = p+1 to r                // 找出 A[p..r] 的最小值
          3          if A[p] &gt; A[j]              // 发现更小的元素
          4              exchange A[p] with A[j] // 把最小值换到 A[p]
          5      if i == 1                       // 要找的正好是最小值
          6          return A[p]                 // 直接返回
          7      p = p + 1                       // 否则剥掉这个最小值
          8      i = i − 1                       // 名次相应减 1
          9  g = (r − p + 1) / 5                 // 现在正好分成 g 组，每组 5 个
          10 for j = p to p + g − 1             // 逐列（逐组）排序
          11     sort (A[j], A[j+g], A[j+2g], A[j+3g], A[j+4g]) in place   // 5 个元素原地排好
          12 x = SELECT(A, p+2g, p+3g−1, ⌈g/2⌉) // 递归求中位数的中位数（中位数组是连续一段）
          13 q = PARTITION-AROUND(A, p, r, x)   // 以 x 为枢轴划分
          14 k = q − p + 1                      // x 是本区间第 k 小
          15 if i == k                           // x 正好是答案
          16     return A[q]                     // 返回主元值
          17 else if i &lt; k                       // 答案在左半边
          18     return SELECT(A, p, q−1, i)     // 只递归左边
          19 else return SELECT(A, q+1, r, i−k) // 只递归右边，名次减 k</code></pre>
                  </div>
                  <div class="code-col">
                    <p class="code-h">C++（g++ 6.3 实测通过）</p>
                    <pre class="code cpp"><code>// 把步长为 g 的 5 个"同列"元素 A[a],A[a+g],…,A[a+4g] 用插入排序排好
          void sortColumn(int A[], int a, int g) {   // 把步长为 g 的 5 个"同列"元素排好
              for (int d = 1; d &lt; 5; ++d) {    // 插入排序：处理第 2..5 个元素
                  int v = A[a + d * g];        // 取出待插入元素
                  int e = d - 1;               // 从它前一个元素开始比较
                  while (e &gt;= 0 &amp;&amp; A[a + e * g] &gt; v) {   // 比它大的都后移一位
                      A[a + (e + 1) * g] = A[a + e * g];   // 后移
                      --e;                     // 继续往前看
                  }                            // 移位结束
                  A[a + (e + 1) * g] = v;      // 放回空位
              }                                // 5 个元素排好
          }
          int select(int A[], int p, int r, int i) {   // 中位数之中位数
              while ((r - p + 1) % 5 != 0) {   // 元素个数不是 5 的倍数
                  for (int j = p + 1; j &lt;= r; ++j) {   // 找出区间最小值
                      if (A[p] &gt; A[j]) { int t = A[p]; A[p] = A[j]; A[j] = t; }   // 换到 A[p]
                  }                            // 找最小值结束
                  if (i == 1) { return A[p]; } // 要找的就是最小值
                  p = p + 1; i = i - 1;        // 剥掉它，区间右移，名次减 1
              }                                // 补齐结束
              int g = (r - p + 1) / 5;         // 组的个数 g
              for (int j = p; j &lt;= p + g - 1; ++j) { sortColumn(A, j, g); }   // 每组排好
              int x = select(A, p + 2 * g, p + 3 * g - 1, (g + 1) / 2);   // 递归求 x：⌈g/2⌉
              int q = partitionAround(A, p, r, x);   // 以 x 为枢轴划分
              int k = q - p + 1;               // x 是本区间第 k 小
              if (i == k) { return A[q]; }     // x 正好是答案
              else if (i &lt; k) { return select(A, p, q - 1, i); }   // 只递归左边
              else { return select(A, q + 1, r, i - k); }          // 只递归右边，名次减 k
          }</code></pre>
                  </div>
                </div>
          
                <p>实测：对 PPT 的 23 个数据，<code>select(D, 1, 23, 8) = 8</code>；把 <span class="m">k = 1..23</span> 全部跑一遍并与 <code>std::sort</code> 的结果逐个比对，无一处不符。</p>
          
                <div class="callout warn">
                  <p class="callout-h">两处实现细节（与 PPT 略有出入，已在上面的代码里处理）</p>
                  <p>① PPT 第 55 页写的是 <span class="m">x = SELECT(A, p+2g, p+3g&minus;1, g/2)</span>。当 <span class="m">g</span> 为偶数时（例如 23 个元素先削到 20 个，<span class="m">g = 4</span>）<span class="m">g/2</span> 正好是"中间偏左"那个中位数；但 <span class="m">g</span> 为奇数时（本页算例 <span class="m">g = 5</span>）必须用 <span class="m">&lceil;g/2&rceil; = 3</span>，否则会取到第 2 个而不是中间那个。上面 C++ 用 <code>(g + 1) / 2</code> 统一处理。<br>
                  ② 第 5 步的 <span class="m">res = mid &minus; left + 1</span> 与 SELECT 里的 <span class="m">k = q &minus; p + 1</span> 是同一个量，只是 PPT 的两页用了不同的字母。</p>
                </div>
          
                <h3 id="sec-bfprt-h4">5.4 动画：23 个数据找第 8 小</h3>
          
                <p>下面的动画按 PPT 第 49～53 页的 5 列布局逐帧演示，共 <b>15 步</b>：分组 &rarr; 组内排序取中位数 &rarr; 求中位数的中位数 <span class="m">x</span> &rarr; 以 <span class="m">x</span> 划分 &rarr; 只递归一边 &rarr; 第二层重复直到命中。第 1 层 <span class="m">x = 14</span>，第 2 层 <span class="m">x = 8</span>，答案 <b>8</b>。</p>
        ` },
        { type: 'demo', name: 'median-of-medians', title: "BFPRT：23 个数据找第 8 小（15 步，含两层的分组与递归）" },
        { type: 'html', html: `
          <h3 id="sec-bfprt-h5">5.5 关键图：为什么划分后最大子问题只有 7n/10</h3>
          
                <p>PPT 第 56 页的图 9.3（下面按它的结构重画）：所有 <span class="m">n</span> 个元素都由小圈表示，<b>每组 5 个元素在同一列上</b>；每组的中位数用<b>红圈</b>表示；<b>中位数的中位数是 x</b>；箭头从较小的元素指向较大的元素。结论是两句话：<b>在 x 的右边，每个包含 5 个元素的组中有 3 个元素大于 x；在 x 的左边，每个包含 5 个元素的组中有 3 个元素小于 x。</b></p>
          
                <svg class="fig" viewBox="0 0 960 500" role="img" aria-label="BFPRT 的 5 列分组图：每列 5 个元素、红圈为组内中位数、橙色为 x（中位数的中位数），蓝色区域一定不大于 x、黄色区域一定不小于 x">
                  <text x="26" y="24" class="tx-b">图 4　中位数之中位数的分组（5 列 × 5 个，红圈 = 组内中位数，橙圈 = x）</text>
                  <text x="26" y="44" class="tx-sm">列内自上而下递增（箭头方向：小 → 大）；x 左边两列半的元素一定 ≤ x，右边两列半一定 ≥ x</text>
          
                  <!-- 蓝色区域：左 2 列 + 第 3 列上半（到 x 为止）；黄色区域：第 3 列下半 + 右 2 列 -->
                  <rect x="80" y="62" width="344" height="290" rx="12" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="1.6"></rect>
                  <rect x="436" y="62" width="334" height="290" rx="12" fill="var(--c-warn-bg)" stroke="var(--c-warn)" stroke-width="1.6"></rect>
          
                  <!-- 第 1 列 -->
                  <circle cx="150" cy="80" r="13" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.4"></circle>
                  <circle cx="150" cy="138" r="13" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.4"></circle>
                  <circle cx="150" cy="196" r="13" fill="var(--c-panel)" stroke="var(--c-hot)" stroke-width="3"></circle>
                  <circle cx="150" cy="254" r="13" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.4"></circle>
                  <circle cx="150" cy="312" r="13" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.4"></circle>
                  <line x1="150" y1="93" x2="150" y2="121" stroke="var(--c-line)" stroke-width="1.2"></line>
                  <line x1="150" y1="151" x2="150" y2="179" stroke="var(--c-line)" stroke-width="1.2"></line>
                  <line x1="150" y1="209" x2="150" y2="237" stroke="var(--c-line)" stroke-width="1.2"></line>
                  <line x1="150" y1="267" x2="150" y2="295" stroke="var(--c-line)" stroke-width="1.2"></line>
          
                  <!-- 第 2 列 -->
                  <circle cx="290" cy="80" r="13" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.4"></circle>
                  <circle cx="290" cy="138" r="13" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.4"></circle>
                  <circle cx="290" cy="196" r="13" fill="var(--c-panel)" stroke="var(--c-hot)" stroke-width="3"></circle>
                  <circle cx="290" cy="254" r="13" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.4"></circle>
                  <circle cx="290" cy="312" r="13" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.4"></circle>
                  <line x1="290" y1="93" x2="290" y2="121" stroke="var(--c-line)" stroke-width="1.2"></line>
                  <line x1="290" y1="151" x2="290" y2="179" stroke="var(--c-line)" stroke-width="1.2"></line>
                  <line x1="290" y1="209" x2="290" y2="237" stroke="var(--c-line)" stroke-width="1.2"></line>
                  <line x1="290" y1="267" x2="290" y2="295" stroke="var(--c-line)" stroke-width="1.2"></line>
          
                  <!-- 第 3 列：中位数就是 x -->
                  <circle cx="430" cy="80" r="13" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.4"></circle>
                  <circle cx="430" cy="138" r="13" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.4"></circle>
                  <circle cx="430" cy="196" r="16" fill="var(--c-warn)" stroke="var(--c-warn)" stroke-width="2"></circle>
                  <text x="430" y="201" class="tx tx-white" text-anchor="middle">x</text>
                  <circle cx="430" cy="254" r="13" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.4"></circle>
                  <circle cx="430" cy="312" r="13" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.4"></circle>
                  <line x1="430" y1="93" x2="430" y2="121" stroke="var(--c-line)" stroke-width="1.2"></line>
                  <line x1="430" y1="151" x2="430" y2="177" stroke="var(--c-line)" stroke-width="1.2"></line>
                  <line x1="430" y1="215" x2="430" y2="237" stroke="var(--c-line)" stroke-width="1.2"></line>
                  <line x1="430" y1="267" x2="430" y2="295" stroke="var(--c-line)" stroke-width="1.2"></line>
          
                  <!-- 第 4 列 -->
                  <circle cx="570" cy="80" r="13" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.4"></circle>
                  <circle cx="570" cy="138" r="13" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.4"></circle>
                  <circle cx="570" cy="196" r="13" fill="var(--c-panel)" stroke="var(--c-hot)" stroke-width="3"></circle>
                  <circle cx="570" cy="254" r="13" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.4"></circle>
                  <circle cx="570" cy="312" r="13" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.4"></circle>
                  <line x1="570" y1="93" x2="570" y2="121" stroke="var(--c-line)" stroke-width="1.2"></line>
                  <line x1="570" y1="151" x2="570" y2="179" stroke="var(--c-line)" stroke-width="1.2"></line>
                  <line x1="570" y1="209" x2="570" y2="237" stroke="var(--c-line)" stroke-width="1.2"></line>
                  <line x1="570" y1="267" x2="570" y2="295" stroke="var(--c-line)" stroke-width="1.2"></line>
          
                  <!-- 第 5 列 -->
                  <circle cx="710" cy="80" r="13" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.4"></circle>
                  <circle cx="710" cy="138" r="13" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.4"></circle>
                  <circle cx="710" cy="196" r="13" fill="var(--c-panel)" stroke="var(--c-hot)" stroke-width="3"></circle>
                  <circle cx="710" cy="254" r="13" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.4"></circle>
                  <circle cx="710" cy="312" r="13" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.4"></circle>
                  <line x1="710" y1="93" x2="710" y2="121" stroke="var(--c-line)" stroke-width="1.2"></line>
                  <line x1="710" y1="151" x2="710" y2="179" stroke="var(--c-line)" stroke-width="1.2"></line>
                  <line x1="710" y1="209" x2="710" y2="237" stroke="var(--c-line)" stroke-width="1.2"></line>
                  <line x1="710" y1="267" x2="710" y2="295" stroke="var(--c-line)" stroke-width="1.2"></line>
          
                  <!-- 中位数之间的箭头：小 → 大 -->
                  <line x1="163" y1="196" x2="277" y2="196" stroke="var(--c-hot)" stroke-width="1.6"></line>
                  <line x1="303" y1="196" x2="414" y2="196" stroke="var(--c-hot)" stroke-width="1.6"></line>
                  <line x1="446" y1="196" x2="557" y2="196" stroke="var(--c-hot)" stroke-width="1.6"></line>
                  <line x1="583" y1="196" x2="697" y2="196" stroke="var(--c-hot)" stroke-width="1.6"></line>
          
                  <!-- 底部标注 -->
                  <text x="96" y="378" class="tx" fill="var(--c-accent)">蓝色区域：≤ x，绝不会落到"大于 x"一侧</text>
                  <text x="96" y="400" class="tx-sm">有 3⌊g/2⌋ 个元素 ≈ 3g/2（差不超过 3）</text>
                  <text x="426" y="378" class="tx" fill="var(--c-warn)">黄色区域：≥ x，绝不会落到"小于 x"一侧</text>
                  <text x="426" y="400" class="tx-sm">有 3(⌊g/2⌋+1) 个元素 ≈ 3g/2</text>
                  <text x="26" y="440" class="tx">划分后必有一整块不落在"要找的那一侧"，剩下的元素至多 5g − 3g/2 = 7g/2 ≤ 7n/10。</text>
                  <text x="26" y="466" class="tx-sm">g = ⌈n/5⌉ 列；每列 5 个、中位数在第 3 行，所以 x 右（左）边每列至少 3 个元素在 x 的同一侧 —— 这就是 7n/10 的来源。</text>
                  <text x="26" y="488" class="tx-sm">（同图还说明了：不到 5 个的尾列只会让"至少 3 个"的结论更宽松，所以下界仍成立。）</text>
                </svg>
                <p class="fig-cap">图 4 &nbsp;BFPRT 的 5 列分组图：红圈是中位数，橙圈是中位数的中位数 <span class="m">x</span>，箭头表示"小 &rarr; 大"</p>
          
                <h3 id="sec-bfprt-h6">5.6 复杂度推导：T(n) &le; T(n/5) + T(7n/10) + O(n)</h3>
          
                <p><b>第一步：先算递归调用之外的操作（PPT 第 57 页）。</b></p>
          
                <ul>
                  <li>第 1～10 行的 <span class="m">while</span> 循环最多执行 <b>4 次</b>（因为 <span class="m">n mod 5</span> 最多补 4 个），其循环体是 <span class="m">O(1)</span>；但循环体里"找最小值"的 <span class="m">for</span> 在每次迭代中占主导地位，运行时间为 <span class="m">&Theta;(n)</span>，所以第 1～10 行总共 <span class="m">O(1)&middot;&Theta;(n) = O(n)</span>；</li>
                  <li>第 12～13 行把每组 5 个元素排好序，共 <span class="m">&Theta;(n)</span>（<span class="m">g</span> 组、每组常数个元素）；</li>
                  <li>第 17 行 PARTITION-AROUND 运行 <span class="m">&Theta;(n)</span>；其余记录操作 <span class="m">&Theta;(1)</span>。</li>
                </ul>
          
                <p>合计 <span class="m">O(n) + &Theta;(n) + &Theta;(n) + &Theta;(1) = &Theta;(n)</span>。</p>
          
                <p><b>第二步：再算递归调用。</b>因为 <span class="m">g &le; n/5</span>，所以第 16 行"选择枢轴"的递归调用 <span class="m">T(g) &le; T(n/5)</span>；而第 23、24 行的递归调用<b>只会执行其中一个</b>，无论执行哪一个，<b>递归调用的数据规模至多为 7n/10</b>，故至多 <span class="m">T(7n/10)</span>。于是</p>
          
                <p class="formula">T(n) &le; T(n/5) + T(7n/10) + &Theta;(n)　　(9.1)</p>
          
                <p><b>第三步：为什么是 7n/10（PPT 第 58 页）。</b>由上面那张有向图：黄色区域的元素大于或等于 <span class="m">x</span>，蓝色区域的元素小于或等于 <span class="m">x</span>。黄色区域有 <span class="m">3(&lfloor;g/2&rfloor; + 1)</span> 个元素、蓝色区域有 <span class="m">3&lfloor;g/2&rfloor;</span> 个元素，两者都<b>不少于 <span class="m">3g/2 &minus; 3</span></b>（PPT 直接写成 <span class="m">&ge; 3g/2</span>，是把常数项忽略掉的写法）；黄色区域的元素<b>不会落在"小于或等于枢轴"的一侧</b>，蓝色区域的元素<b>不会落在"大于或等于枢轴"的一侧</b>。所以排除其中一种颜色的区域后，剩余至多</p>
          
                <p class="formula">5g &minus; 3g/2 = 7g/2 &le; 7n/10</p>
          
                <p><b>第四步：用代换法解 (9.1)（PPT 第 58 页）。</b>猜测 <span class="m">T(n) = O(n)</span>，即存在 <span class="m">c &gt; 0</span> 使对所有 <span class="m">n &gt; 0</span>、<span class="m">n &ge; 5</span> 有：</p>
          
                <p class="formula">T(n) &le; c(n/5) + c(7n/10) + &Theta;(n) = cn &minus; cn/10 + &Theta;(n) &le; cn</p>
          
                <p>只要 <span class="m">c</span> 足够大，使 <span class="m">&minus;cn/10 + &Theta;(n) &le; 0</span> 即可；<span class="m">n &le; 4</span> 时为基本情况，<span class="m">c</span> 足够大时 <span class="m">T(n) &le; cn</span> 也成立。故 <span class="m">T(n) = O(n)</span>；又第 13 行运行时间为 <span class="m">&Theta;(n)</span>（下界），所以 <b><span class="m">T(n) = &Theta;(n)</span></b>。</p>
          
                <div class="callout tip">
                  <p class="callout-h">几何级数：9/10 是怎么收敛的</p>
                  <p><span class="m">n/5 + 7n/10 = 9n/10 &lt; n</span>：每往下一层，总规模就乘上 <span class="m">0.9</span>。于是总代价 <span class="m">&le; cn(1 + 0.9 + 0.9<sup>2</sup> + &hellip;) = 10cn = O(n)</span>。对比一下：快排两边都递归时系数和是 <span class="m">1 + 1 = 2 &gt; 1</span>（不收敛，所以多出 <span class="m">lg n</span> 因子），选择只递归一边时系数和是 <span class="m">&alpha; &lt; 1</span>（收敛），BFPRT 则用 <span class="m">1/5 + 7/10 = 9/10 &lt; 1</span> 同时"保证"了主元的质量。</p>
                </div>
          
                <h3 id="sec-bfprt-h7">5.7 延伸：每 7 个一组还是 O(n) 吗？（PPT 第 59 页）</h3>
          
                <p><b>是。</b>把每组大小从 5 改成 7（一般地，记组大小为 <span class="m">k</span>、组数 <span class="m">g = n/k</span>）：</p>
          
                <ul>
                  <li>每组 7 个，中位数是<b>第 4 个</b>；大约一半的组（<span class="m">&lceil;g/2&rceil;</span> 组）的中位数 <span class="m">&ge; x</span>，而每个这样的组里至少有 <span class="m">(k+1)/2 = 4</span> 个元素 <span class="m">&ge; x</span>；</li>
                  <li>所以一侧至少有 <span class="m">4&middot;(&lceil;g/2&rceil;) &asymp; 2g = 2n/7 &asymp; 0.286n</span> 个元素，另一侧至多 <span class="m">n &minus; 2n/7 = 5n/7 &asymp; 0.714n</span>；</li>
                  <li>递归式为 <span class="m">T(n) &le; T(n/7) + T(5n/7) + O(n)</span>，而 <span class="m">1/7 + 5/7 = 6/7 &lt; 1</span> &rArr; 几何级数仍然收敛，<b><span class="m">T(n) = O(n)</span></b>，而且收敛更快（<span class="m">6/7 &lt; 9/10</span>，常数更小）。</li>
                </ul>
          
                <div class="callout">
                  <p class="callout-h">补充（非 PPT）：一般的分组大小 k</p>
                  <p>设每组 <span class="m">k</span> 个（<span class="m">k</span> 为奇数）、<span class="m">g = n/k</span>：一侧至少 <span class="m">((k+1)/2)&middot;(g/2) = (k+1)n/(4k)</span> 个元素，另一侧至多 <span class="m">(3k&minus;1)n/(4k)</span>，两系数之和为 <span class="m">1/k + (3k&minus;1)/(4k) = 3(k+1)/(4k)</span>。<b>只要 <span class="m">3(k+1)/(4k) &lt; 1</span>，即 <span class="m">k &gt; 3</span>，就仍是线性</b>。代进去：<span class="m">k=5 &rarr; 0.9</span>（正是 9/10），<span class="m">k=7 &rarr; 6/7 &asymp; 0.857</span>，<span class="m">k=3 &rarr; 1</span>（不收敛，只能得到 <span class="m">O(n lg n)</span>）。这就是"为什么偏偏取 5（或 7）"的定量答案：<b>3 不行，4 以上都行</b>。</p>
                </div>
          
                <div class="callout key">
                  <p class="callout-h">本节考点</p>
                  <p>① 五步口诀：<b>分 5 组 &rarr; 组内排序取中位数 &rarr; 递归求中位数的中位数 x &rarr; 以 x 划分 &rarr; res = mid&minus;left+1 三选一</b>；② <span class="m">T(n) &le; T(n/5) + T(7n/10) + O(n)</span>，因为 <span class="m">5g &minus; 3g/2 = 7g/2 &le; 7n/10</span>；③ 代换法得 <span class="m">cn &minus; cn/10 + &Theta;(n) &le; cn</span>，故 <span class="m">T(n) = &Theta;(n)</span>；④ 每 7 个一组仍 <span class="m">O(n)</span>（<span class="m">1/7 + 5/7 = 6/7 &lt; 1</span>）。</p>
                </div>
        ` },
      ],
    },
    {
      id: 'sec-practice',
      heading: "6. 实践中的快速排序",
      blocks: [
        { type: 'html', html: `
          <p>PPT 第 60 页用四条结论收尾（虽然标题是"实践中的快速排序"，但它同样是"为什么工程上更愿意用随机化快排/随机化选择、而不是 BFPRT"的回答）：</p>
          
                <ul>
                  <li>快速排序是<b>优秀的通用排序算法</b> (general-purpose sorting)；</li>
                  <li>快速排序通常比<b>合并排序快一倍多</b>；</li>
                  <li>快速排序可以通过<b>代码调优</b>大幅度提高性能；</li>
                  <li>快速排序甚至在有<b>缓存和虚拟内存</b>的情况下性能很好。</li>
                </ul>
          
                <p>"快一倍多"的根源在于常数：快排的划分是<b>顺序扫描 + 原地交换</b>，对缓存和虚拟内存友好；而归并排序需要额外的辅助数组与来回拷贝。这也是为什么随机化选择在实践中比 BFPRT 更常用 —— BFPRT 虽然最坏 <span class="m">O(n)</span>，但"分组 + 组内排序 + 递归求 x"的常数相当大。</p>
          
                <div class="callout tip">
                  <p class="callout-h">补充（非 PPT）：工程上的常见调优</p>
                  <p>① 小数组（如 <span class="m">n &lt; 10</span>）改用插入排序，避免递归开销；② 三数取中 (median-of-three) 或随机化选主元，规避有序输入；③ 三路划分 (3-way partition) 处理大量重复键；④ 尾递归改循环，把递归深度压到 <span class="m">O(lg n)</span>。这些做法都不改变渐近界，但能把常数降下来。</p>
                </div>
          
                <div class="callout key">
                  <p class="callout-h">本节考点</p>
                  <p>四句话要能复述：通用、比归并快一倍多、可通过调优大幅提升、缓存/虚拟内存友好。它们共同解释了"为什么实践偏爱随机化版本"。</p>
                </div>
        ` },
      ],
    },
    {
      id: 'sec-summary',
      heading: "7. 小结：5 种选择算法的对比与速记",
      blocks: [
        { type: 'html', html: `
          <p>把整讲的内容压成一张表。注意"空间"一列：只有归并排序需要 <span class="m">&Theta;(n)</span> 辅助空间，选择类算法都是<b>原地</b>的（递归栈 <span class="m">O(lg n)</span>，尾递归可以消掉）。</p>
          
                <table class="tbl">
                  <thead><tr><th>算法</th><th>最好</th><th>平均 / 期望</th><th>最坏</th><th>额外空间</th><th>一句话</th></tr></thead>
                  <tbody>
                    <tr><td>暴力法（做 k 遍找最小）</td><td class="num">O(n)</td><td class="num">O(kn)</td><td class="num">O(n<sup>2</sup>)</td><td class="num">O(1)</td><td>k 很小时够用，k 接近 n 就退化</td></tr>
                    <tr><td>归并排序后取 A[k]</td><td class="num">O(n lg n)</td><td class="num">O(n lg n)</td><td class="num">O(n lg n)</td><td class="num">O(n)</td><td>把全部次序都算了出来，浪费</td></tr>
                    <tr><td>快速排序后取 A[k]</td><td class="num">O(n lg n)</td><td class="num">O(n lg n)</td><td class="num">O(n<sup>2</sup>)</td><td class="num">O(lg n)</td><td>两边都递归，没有利用"只要一边"</td></tr>
                    <tr><td><b>RANDOMIZED-SELECT</b></td><td class="num">&Theta;(n)</td><td class="num">期望 &Theta;(n)</td><td class="num">&Theta;(n<sup>2</sup>)</td><td class="num">O(1)（尾递归）</td><td><b>只递归一边</b>，期望线性</td></tr>
                    <tr><td><b>BFPRT（中位数之中位数）</b></td><td class="num">&Theta;(n)</td><td class="num">&Theta;(n)</td><td class="num">&Theta;(n)</td><td class="num">O(lg n)</td><td>用 <span class="m">9n/10</span> 的几何级数<b>保证</b>线性</td></tr>
                  </tbody>
                </table>
          
                <div class="callout key">
                  <p class="callout-h">三句话记住整讲</p>
                  <p>① <b>选择只递归一边</b> —— 这是线性时间的总钥匙：系数和 <span class="m">&alpha; &lt; 1</span> 时 <span class="m">cn(1 + &alpha; + &alpha;<sup>2</sup> + &hellip;)</span> 收敛到 <span class="m">O(n)</span>；<br>
                  ② <b>BFPRT 的 9/10</b> —— <span class="m">T(n) &le; T(n/5) + T(7n/10) + O(n)</span>，因为 <span class="m">5g &minus; 3g/2 = 7g/2 &le; 7n/10</span>，<span class="m">1/5 + 7/10 = 9/10 &lt; 1</span>；<br>
                  ③ <b>3&lfloor;n/2&rfloor;</b> —— 同时找最大最小用成对处理，每对 3 次比较，比分别独立的 <span class="m">2n&minus;2</span> 更省。</p>
                </div>
          
                <table class="tbl">
                  <thead><tr><th>易混点</th><th>正确说法</th></tr></thead>
                  <tbody>
                    <tr><td>期望线性 = 最坏线性？</td><td>不是。RANDOMIZED-SELECT 期望 <span class="m">&Theta;(n)</span>、最坏 <span class="m">&Theta;(n<sup>2</sup>)</span>；BFPRT 才是三者都 <span class="m">&Theta;(n)</span></td></tr>
                    <tr><td>选择算法要不要排序？</td><td>不要。它只做划分，从不真正把子数组排好（组内 5 个元素的排序除外）</td></tr>
                    <tr><td>快排最坏为什么是 <span class="m">n<sup>2</sup></span>？</td><td>有序/逆序输入 + 取端点为轴 &rArr; 每次划分 <span class="m">0 : n&minus;1</span> &rArr; <span class="m">T(n)=T(n&minus;1)+cn</span>，等差级数</td></tr>
                    <tr><td>BFPRT 里为什么要 <span class="m">5</span> 个一组？</td><td>为了 <span class="m">1/5 + 7/10 = 9/10 &lt; 1</span>；<span class="m">k=3</span> 时系数和正好为 1，不收敛</td></tr>
                    <tr><td>右半边递归的名次</td><td>是 <span class="m">i &minus; k</span>（减掉左边 <span class="m">k&minus;1</span> 个 + 主元本身 1 个），不是 <span class="m">i &minus; q</span></td></tr>
                  </tbody>
                </table>
          
                <p>复习顺序建议：先默写 PARTITION 并手推 <span class="m">&lang;6,10,13,5,8,3,2,11&rang;</span>（图 1 与 2.4 节的分步表）；再背快排四种情形的结论（图 2、图 3）；然后默写 RANDOMIZED-SELECT 九行伪代码并复述"指示器 &rarr; 成对放大 &rarr; 3cn/4"的三步期望分析；最后用 23 个数据的例子把 BFPRT 的五步与 <span class="m">7n/10</span> 的几何级数讲一遍（图 4）。</p>
        ` },
      ],
    },
    {
      id: 'sec-quiz',
      heading: "本节自测（课件配套测验）",
      blocks: [
        { type: 'html', html: `
          <p>下列 7 题取自课程配套测验（线性时间选择部分），覆盖：选择问题的目标、成对求最大最小、快速排序的划分与最坏情况、随机快速选择与快排的关键区别。</p>
          
                <h3 id="sec-quiz-h1">一、单项选择题</h3>
        ` },
        { type: 'quiz', quiz: {
          "kind": "single",
          "question": "1. 线性时间选择问题的目标是什么？",
          "tag": "线性时间选择 · 原卷 10",
          "options": [
            "A. 找出第 k 小的元素",
            "B. 找出所有元素的平均值",
            "C. 将数组完全排序",
            "D. 只统计不同元素个数"
          ],
          "answer": "A",
          "explanation": "问题定义：给定线性序集中 n 个元素和整数 k，找出这 n 个元素中<b>第 k 小</b>的元素。C 是排序问题的目标 —— 而选择问题的全部意义就在于<b>不做完全排序</b>也能答出第 k 小，从而把 <span class=\"m\">Θ(n log n)</span> 降到 <span class=\"m\">Θ(n)</span>。"
        } },
        { type: 'quiz', quiz: {
          "kind": "single",
          "question": "2. 按课件中的成对处理方法，同时寻找最小值和最大值约需多少次比较？",
          "tag": "线性时间选择 · 原卷 11",
          "options": [
            "A. n²",
            "B. 2n − 2",
            "C. n log n",
            "D. 3⌊n/2⌋"
          ],
          "answer": "D",
          "explanation": "成对处理：先把一对元素<b>相互比较</b>（1 次），再把较小者与当前最小值比、较大者与当前最大值比（2 次），即<b>每两个元素 3 次比较</b>，共 <span class=\"m\">3⌊n/2⌋</span> 次。B 是「分别独立地找最小和最大」的代价 <span class=\"m\">2n−2</span>，本题问的是成对法，故不选 B。",
          "note": "对比记忆：独立找 = 2n−2；成对找 = 3⌊n/2⌋ <b>&lt;</b> 2n−2（n ≥ 2），省下的正是「每对中较大者不必再和最小值比」。若允许用首对元素初始化，还可再省 2 次（做到 3⌊n/2⌋−2）。"
        } },
        { type: 'quiz', quiz: {
          "kind": "single",
          "question": "3. 快速排序划分函数对 n 个项的运行时间是多少？",
          "tag": "线性时间选择 · 原卷 12",
          "options": [
            "A. O(1)",
            "B. O(n)",
            "C. O(n log n)",
            "D. O(n²)"
          ],
          "answer": "B",
          "explanation": "<code>PARTITION</code> 只用指针 j 从左到右<b>单次线性扫描</b>，遇到 ≤ 基准的元素就交换一次，扫描完把基准换到分界处，全程 <span class=\"m\">O(n)</span>。<b>「划分」是线性的，「排序」才是 O(n log n) 或最坏 O(n²)</b> —— 正因为划分线性，快速选择每层只花 O(n)。"
        } },
        { type: 'quiz', quiz: {
          "kind": "single",
          "question": "4. 使用固定端点主元时，下列哪种输入容易触发快速排序的最坏情况？",
          "tag": "线性时间选择 · 原卷 13",
          "options": [
            "A. 主元总是中位数的输入",
            "B. 每次均分的输入",
            "C. 已经有序或反向有序的输入",
            "D. 所有划分都均衡的输入"
          ],
          "answer": "C",
          "explanation": "若固定取端点为主元，则<b>已排好序</b>（或完全逆序）的输入每次都围绕当前<b>最大/最小值</b>划分，划出来一侧为空、另一侧 n−1 个元素，退化成 <span class=\"m\">T(n)=T(0)+T(n−1)+cn=Θ(n²)</span>。A/B/D 恰恰是最好情况（均分 ⇒ <span class=\"m\">Θ(n log n)</span>）。这也是为什么要「随机化选主元」——让最坏情况不再由输入顺序决定。"
        } },
        { type: 'quiz', quiz: {
          "kind": "single",
          "question": "5. 快速排序最坏情况下的递归式是哪一个？",
          "tag": "线性时间选择 · 原卷 14",
          "options": [
            "A. T(n) = 2T(n/2) + Θ(n)",
            "B. T(n) = T(n/2) + Θ(1)",
            "C. T(n) = 4T(n/2) + n",
            "D. T(n) = T(0) + T(n−1) + cn"
          ],
          "answer": "D",
          "explanation": "最坏划分产生规模 <b>0</b> 和 <b>n−1</b> 的两个子问题，加上线性划分代价 <span class=\"m\">cn</span>，故 <span class=\"m\">T(n)=T(0)+T(n−1)+cn</span>，展开为 <span class=\"m\">cn+c(n−1)+…+c = Θ(n²)</span>。A 是<b>最好</b>情况（均分）；B 是二分查找的递归式。"
        } },
        { type: 'quiz', quiz: {
          "kind": "single",
          "question": "6. 随机快速选择与快速排序在递归处理上的主要区别是什么？",
          "tag": "线性时间选择 · 原卷 15",
          "options": [
            "A. 选择算法不划分数组",
            "B. 选择算法递归处理两边",
            "C. 选择算法只处理划分的一边",
            "D. 快速排序只处理一边"
          ],
          "answer": "C",
          "explanation": "两者<b>都用</b> <code>RANDOMIZED-PARTITION</code>，区别只在递归：快速排序递归<b>左右两边</b>；<b>RANDOMIZED-SELECT 只递归包含目标的那一边</b>。正是这个「只走一边」把递归式从 <span class=\"m\">T(n)=T(k)+T(n−k−1)+O(n)</span> 变成 <span class=\"m\">T(n)=T(max(k,n−k−1))+O(n)</span>，期望降到 <span class=\"m\">Θ(n)</span>。"
        } },
        { type: 'quiz', quiz: {
          "kind": "single",
          "question": "7. 随机快速选择的期望运行时间是多少？",
          "tag": "线性时间选择 · 原卷 16",
          "options": [
            "A. Θ(log n)",
            "B. Θ(n log n)",
            "C. Θ(n²)",
            "D. Θ(n)"
          ],
          "answer": "D",
          "explanation": "<b>期望 <span class=\"m\">Θ(n)</span></b>，最坏 <span class=\"m\">Θ(n²)</span>（主元总取到极端时）。推导要点：划分产生 <span class=\"m\">k:n−k−1</span> 的概率为 <span class=\"m\">1/n</span>，用指示器随机变量写出\n        <span class=\"m\">E[T(n)] ≤ (2/n)Σ<sub>k=⌊n/2⌋</sub><sup>n−1</sup>E[T(k)] + O(n)</span>，再用代换法令 <span class=\"m\">E[T(n)] ≤ cn</span>，利用 <span class=\"m\">Σ<sub>k=⌊n/2⌋</sub><sup>n−1</sup>k ≤ (3/8)n²</span> 配出 <span class=\"m\">3cn/4</span> 的余量即得证。"
        } },
      ],
    },
  ],
};

export default deck;
