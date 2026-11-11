/* 由 scripts/migrate.mjs 自动生成 —— 内容事实源，手工修改后请勿重跑迁移覆盖 */
import type { DeckData } from './types';

const deck: DeckData = {
  id: 'deck6',
  no: "",
  title: "L5 · 递归与分治法",
  subtitle: "第 5 讲 · 递归与分治法",
  lede: `
  分治法 (divide and conquer) 只有三个动作 —— <b>分解、求解、合并</b>，却能从求幂一路做到 Strassen 矩阵相乘和 VLSI 布局。本页按课程 PPT 的 43 页顺序整理：先说清递归的两个要素与分治的四个适用条件，再把七个例子（求幂、Hanoi 塔、归并排序、二分查找、硬币问题、整数划分、矩阵相乘）与 VLSI 布局逐个过一遍，每个例子都给<b>递归式 + 解 + 具体数字</b>：<span class="m">x<sup>20</sup></span> 的 19 次乘法压到 <b>5 次</b>、Hanoi 塔 <span class="m">T(n)=2<sup>n</sup>&minus;1</span>（n=3 是 7 次、n=64 约 1.84&times;10<sup>19</sup> 次）、二分查找 <span class="m">&Theta;(lg n)</span>（7 个元素查 3 次）、整数划分 <span class="m">p(6)=11</span>、Strassen 用 <b>7 乘 18 加减</b>换到 <span class="m">&Theta;(n<sup>lg 7</sup>)&asymp;&Theta;(n<sup>2.81</sup>)</span>。
`,
  toc: [
    { id: 'sec-overview', text: "1. 本讲脉络与主方法复习", level: 2 },
    { id: 'sec-overview-h1', text: "1.1 主方法（master theorem）复习", level: 3 },
    { id: 'sec-recursion', text: "2. 递归的概念：两个要素与优缺点", level: 2 },
    { id: 'sec-recursion-h1', text: "2.1 递归函数与递归算法", level: 3 },
    { id: 'sec-recursion-h2', text: "2.2 递归方程举例（补充）", level: 3 },
    { id: 'sec-recursion-h3', text: "2.3 递归的优缺点", level: 3 },
    { id: 'sec-recursion-h4', text: "2.4 阶乘：伪代码 + C++", level: 3 },
    { id: 'sec-divide', text: "3. 分治法：基本思想、四个适用条件、三个步骤", level: 2 },
    { id: 'sec-divide-h1', text: "3.1 基本思想", level: 3 },
    { id: 'sec-divide-h2', text: "3.2 四个适用条件", level: 3 },
    { id: 'sec-divide-h3', text: "3.3 三个步骤与四个要点", level: 3 },
    { id: 'sec-divide-h4', text: "3.4 通用递归式", level: 3 },
    { id: 'sec-power', text: "4. 求幂 xn：19 次乘法怎么变成 5 次", level: 2 },
    { id: 'sec-power-h1', text: "4.1 问题与简单算法", level: 3 },
    { id: 'sec-power-h2', text: "4.2 分治算法：一次递归只用一半规模", level: 3 },
    { id: 'sec-power-h3', text: "4.3 以 n = 20 为例：19 次 vs 5 次", level: 3 },
    { id: 'sec-power-h4', text: "4.4 逐帧动画：x20 的分解与回代", level: 3 },
    { id: 'sec-power-h5', text: "4.5 伪代码 + C++", level: 3 },
    { id: 'sec-hanoi', text: "5. Hanoi 塔：T(n) = 2n &minus; 1", level: 2 },
    { id: 'sec-hanoi-h1', text: "5.1 问题描述", level: 3 },
    { id: 'sec-hanoi-h2', text: "5.2 基本思想与递推", level: 3 },
    { id: 'sec-hanoi-h3', text: "5.3 逐帧动画：7 次移动一步不落", level: 3 },
    { id: 'sec-hanoi-h4', text: "5.4 伪代码 + C++", level: 3 },
    { id: 'sec-hanoi-h5', text: "5.5 64 个盘子要搬多久", level: 3 },
    { id: 'sec-merge', text: "6. 归并排序与\"求解时间复杂度\"", level: 2 },
    { id: 'sec-merge-h1', text: "6.1 三个步骤", level: 3 },
    { id: 'sec-merge-h2', text: "6.2 递归式与复杂度", level: 3 },
    { id: 'sec-merge-h3', text: "6.3 伪代码 + C++", level: 3 },
    { id: 'sec-merge-h4', text: "6.4 例：解 T(n) = 2T(n/2) + 5n2", level: 3 },
    { id: 'sec-bsearch', text: "7. 二分查找：T(n) = T(n/2) + &Theta;(1) &rArr; &Theta;(lg n)", level: 2 },
    { id: 'sec-bsearch-h1', text: "7.1 三个步骤与一个例子", level: 3 },
    { id: 'sec-bsearch-h2', text: "7.2 逐帧动画：low / mid / high 怎么收窄", level: 3 },
    { id: 'sec-bsearch-h3', text: "7.3 递归式与 &Theta;(lg n) 的推导", level: 3 },
    { id: 'sec-bsearch-h4', text: "7.4 伪代码 + C++", level: 3 },
    { id: 'sec-coins', text: "8. 硬币问题：天平有 3 种结果，所以三分最优", level: 2 },
    { id: 'sec-coins-h1', text: "8.1 问题描述", level: 3 },
    { id: 'sec-coins-h2', text: "8.2 三种解法", level: 3 },
    { id: 'sec-coins-h3', text: "8.3 为什么 &lceil;log3 n&rceil; 是最优的", level: 3 },
    { id: 'sec-coins-h4', text: "8.4 伪代码 + C++", level: 3 },
    { id: 'sec-partition', text: "9. 整数划分：p(6) = 11 与 q(n, m)", level: 2 },
    { id: 'sec-partition-h1', text: "9.1 定义", level: 3 },
    { id: 'sec-partition-h2', text: "9.2 以 n = 6 为例：11 种划分", level: 3 },
    { id: 'sec-partition-h3', text: "9.3 增加一个自变量：q(n, m)", level: 3 },
    { id: 'sec-partition-h4', text: "9.4 用 n = 6 验证", level: 3 },
    { id: 'sec-partition-h5', text: "9.5 伪代码 + C++", level: 3 },
    { id: 'sec-matrix', text: "10. 矩阵相乘：从 &Theta;(n3) 到 Strassen 的 &Theta;(n2.81)", level: 2 },
    { id: 'sec-matrix-h1', text: "10.1 问题与标准算法", level: 3 },
    { id: 'sec-matrix-h2', text: "10.2 分治：8 次子矩阵乘法，还是 &Theta;(n3)", level: 3 },
    { id: 'sec-matrix-h3', text: "10.3 Strassen：用 7 个递归乘换掉 1 次乘法", level: 3 },
    { id: 'sec-matrix-h4', text: "10.4 验证 r = P5 + P4 &minus; P2 + P6 = ae + bg", level: 3 },
    { id: 'sec-matrix-h5', text: "10.5 复杂度：&Theta;(nlg 7) &asymp; &Theta;(n2.81)", level: 3 },
    { id: 'sec-matrix-h6', text: "10.6 Strassen 的 2&times;2 核心：伪代码 + C++", level: 3 },
    { id: 'sec-vlsi', text: "11. VLSI 布局：从 &Theta;(n lg n) 到 &Theta;(n)", level: 2 },
    { id: 'sec-vlsi-h1', text: "11.1 问题描述", level: 3 },
    { id: 'sec-vlsi-h2', text: "11.2 朴素布局：宽 &Theta;(n)、高 &Theta;(lg n)", level: 3 },
    { id: 'sec-vlsi-h3', text: "11.3 H-树布局：边长 &Theta;(&radic;n)、面积 &Theta;(n)", level: 3 },
    { id: 'sec-think', text: "12. 课堂思考与结论", level: 2 },
    { id: 'sec-think-h1', text: "12.1 求解四个递归式", level: 3 },
    { id: 'sec-think-h2', text: "12.2 Hanoi 塔问题（问答）", level: 3 },
    { id: 'sec-think-h3', text: "12.3 结论（PPT 第 41 页）", level: 3 },
    { id: 'sec-summary', text: "13. 小结速记", level: 2 },
    { id: 'sec-summary-h1', text: "13.1 全讲对照表", level: 3 },
    { id: 'sec-summary-h2', text: "13.2 三句话背完这一讲", level: 3 },
  ],
  sections: [
    {
      id: 'sec-overview',
      heading: "1. 本讲脉络与主方法复习",
      blocks: [
        { type: 'html', html: `
          <p>PPT 第 3 页的目录把整讲分成两大块：<b>递归</b>（递归的概念、递归方程举例、递归的优缺点）与<b>分治法</b>（基本思想、求解步骤、求解举例）。分治法举例一共七个：求幂、Hanoi 塔、归并排序、二分查找、硬币问题、整数划分、矩阵相乘，最后再加一个 VLSI 布局。</p>
          
                <p>为什么先讲递归？因为分治法的三个步骤里，第二步"求解"就是<b>递归地</b>解决子问题 —— 不会写递归，就写不出分治。反过来，分治又给递归提供了最好的应用场景：子问题规模按固定比例缩小，递归深度只有 <span class="m">O(lg n)</span> 级，递归式可以套主方法直接解出来。</p>
          
                <h3 id="sec-overview-h1">1.1 主方法（master theorem）复习</h3>
          
                <p>主方法适用于递归形式 <span class="m">T(n) = a&middot;T(n/b) + f(n)</span>（<span class="m">a &ge; 1</span>、<span class="m">b &gt; 1</span> 为常数，<span class="m">f(n)</span> 为正的渐进函数）。把 <span class="m">f(n)</span> 与"分水岭" <span class="m">n<sup>log<sub>b</sub>a</sup></span> 比大小，就得到三种情况（PPT 第 2 页）：</p>
          
                <table class="tbl">
                  <thead><tr><th>情况</th><th>条件</th><th>解</th><th>直觉</th></tr></thead>
                  <tbody>
                    <tr><td>1</td><td class="num">f(n) = O(n<sup>log<sub>b</sub>a &minus; &epsilon;</sup>)，&epsilon; &gt; 0</td><td class="num">T(n) = &Theta;(n<sup>log<sub>b</sub>a</sup>)</td><td>叶子层的工作量占主导</td></tr>
                    <tr><td>2</td><td class="num">f(n) = &Theta;(n<sup>log<sub>b</sub>a</sup>)</td><td class="num">T(n) = &Theta;(n<sup>log<sub>b</sub>a</sup> &middot; lg n)</td><td>每层工作量相同，共 lg n 层</td></tr>
                    <tr><td>3</td><td class="num">f(n) = &Omega;(n<sup>log<sub>b</sub>a + &epsilon;</sup>) 且 a&middot;f(n/b) &le; c&middot;f(n)（c &lt; 1）</td><td class="num">T(n) = &Theta;(f(n))</td><td>根节点的工作量占主导</td></tr>
                  </tbody>
                </table>
          
                <p>三种情况在 PPT 里的原话分别是"<span class="m">f(n)</span> 增长比多项式 <span class="m">n<sup>log<sub>b</sub>a</sup></span> 慢""同阶""快（快 <span class="m">n<sup>&epsilon;</sup></span> 倍）并且满足规定条件"。第 3 种情况的附加条件 <span class="m">a&middot;f(n/b) &le; c&middot;f(n)</span>（正则条件）不能漏 —— 它保证工作量确实是一层层往下衰减的。</p>
          
                <div class="callout key">
                  <p class="callout-h">本讲要反复用的两个解</p>
                  <p>① <span class="m">T(n) = 2T(n/2) + &Theta;(n)</span>：<span class="m">n<sup>log<sub>2</sub>2</sup> = n</span>，与 <span class="m">f(n)</span> 同阶 &rArr; 情况 2 &rArr; <b>&Theta;(n lg n)</b>（归并排序）。<br>
                  ② <span class="m">T(n) = T(n/2) + &Theta;(1)</span>：<span class="m">n<sup>log<sub>2</sub>1</sup> = n<sup>0</sup> = 1</span>，与 <span class="m">f(n)=&Theta;(1)</span> 同阶 &rArr; 情况 2 &rArr; <b>&Theta;(lg n)</b>（求幂、二分查找）。<br>
                  整讲后面的每一个递归式，都逃不出这张表的三行。</p>
                </div>
        ` },
      ],
    },
    {
      id: 'sec-recursion',
      heading: "2. 递归的概念：两个要素与优缺点",
      blocks: [
        { type: 'html', html: `
          <h3 id="sec-recursion-h1">2.1 递归函数与递归算法</h3>
          
                <p><b>递归函数</b> (recursive function)：用函数自身给出定义的函数。<b>递归算法</b> (recursive algorithm)：直接或间接调用自身的算法。两者是一回事的两种说法 —— 一个是数学定义，一个是程序实现。</p>
          
                <p>PPT 强调递归函数有<b>两个要素</b>，缺一不可：</p>
          
                <ol>
                  <li><b>边界条件</b> (boundary condition)：最小规模的那几种情况直接给出答案，不再递归；</li>
                  <li><b>递归方程</b> (recursive equation)：把规模 <span class="m">n</span> 的解表示成规模更小的同类问题的解。</li>
                </ol>
          
                <p>以阶乘为例（PPT 第 4 页的提问"阶乘函数的递归方程？"）：</p>
          
                <p class="formula">n! = 1 &nbsp;(n = 0 或 n = 1)；&nbsp;&nbsp; n! = n &middot; (n&minus;1)! &nbsp;(n &gt; 1)</p>
          
                <p>其中 <span class="m">n! = 1</span> 是边界条件，<span class="m">n! = n&middot;(n&minus;1)!</span> 是递归方程。少了边界条件，递归就永远停不下来。</p>
          
                <h3 id="sec-recursion-h2">2.2 递归方程举例（补充）</h3>
          
                <p>PPT 目录里有一项"递归方程举例"，课上以阶乘串讲。下面这张表把课程里前后出现的递归定义汇总在一起，它们的共同点是：<b>都靠"规模变小"收敛，都靠"边界条件"停住</b>（本表为补充整理）。</p>
          
                <table class="tbl">
                  <thead><tr><th>名称</th><th>边界条件</th><th>递归方程</th><th>本讲出现位置</th></tr></thead>
                  <tbody>
                    <tr><td>阶乘 <span class="m">n!</span></td><td class="num">0! = 1! = 1</td><td class="num">n! = n&middot;(n&minus;1)!</td><td>第 4 页，本节</td></tr>
                    <tr><td>Fibonacci 数列</td><td class="num">F(0) = F(1) = 1</td><td class="num">F(n) = F(n&minus;1) + F(n&minus;2)</td><td>递归低效的经典反例</td></tr>
                    <tr><td>Hanoi 塔</td><td class="num">T(1) = 1</td><td class="num">T(n) = 2T(n&minus;1) + 1</td><td>第 9 页</td></tr>
                    <tr><td>整数划分</td><td class="num">q(1,m) = q(n,1) = 1</td><td class="num">q(n,m) = q(n,m&minus;1) + q(n&minus;m,m)</td><td>第 25～30 页</td></tr>
                    <tr><td>Ackermann 函数</td><td class="num">A(1,0)=2；A(0,m)=1；A(n,0)=n+2</td><td class="num">A(n,m) = A(A(n&minus;1,m), m&minus;1)</td><td>递归深度的极端例子</td></tr>
                  </tbody>
                </table>
          
                <h3 id="sec-recursion-h3">2.3 递归的优缺点</h3>
          
                <table class="tbl">
                  <thead><tr><th>优点</th><th>缺点</th></tr></thead>
                  <tbody>
                    <tr><td>算法简明，贴近数学定义</td><td>执行效率不高（函数调用有开销）</td></tr>
                    <tr><td>正确性易证明（结构归纳法）</td><td>堆栈空间耗费（每层都要压栈）</td></tr>
                    <tr><td>是分析、设计算法的有力工具</td><td>可能出现大量重复计算（如朴素 Fibonacci）</td></tr>
                  </tbody>
                </table>
          
                <p>第二列最后一条教材上没写全，但它是后面动态规划一章的入口：朴素递归把同一子问题反复算了多遍，才会指数爆炸。<b>分治法之所以敢用递归，是因为它保证子问题相互独立、不重复</b>（见下一节的四个适用条件）。</p>
          
                <div class="callout warn">
                  <p class="callout-h">易错：递归必须有边界条件</p>
                  <p>写递归只写递归方程、忘了边界条件，程序会一直往更小规模递归，直到栈溢出 (stack overflow)。反过来，边界条件的<b>返回值</b>也要写对：<span class="m">0! = 1</span> 而不是 0，这是最常见的 off-by-one。</p>
                </div>
          
                <h3 id="sec-recursion-h4">2.4 阶乘：伪代码 + C++</h3>
          
                <div class="code-pair">
                  <div class="code-col">
                    <p class="code-h">伪代码（PPT 写法）</p>
                    <pre class="code"><code>FACTORIAL(n)                     // 计算 n!，n 为非负整数
          1  if n = 0 or n = 1             // 边界条件：0! = 1! = 1
          2      then return 1             // 直接返回，不再递归
          3  else                          // 一般情况：规模 n &gt; 1
          4      return n * FACTORIAL(n-1) // 递归方程：n! = n·(n−1)!</code></pre>
                  </div>
                  <div class="code-col">
                    <p class="code-h">C++</p>
                    <pre class="code cpp"><code>long long factorial(int n) {              // 阶乘：递归求 n!
              if (n &lt;= 1) return 1;                    // 边界条件：0! = 1! = 1
              return (long long)n * factorial(n - 1);  // 递归方程：n! = n·(n−1)!
          }
          // 调用 factorial(6) 返回 720，递归深度 6 层</code></pre>
                  </div>
                </div>
          
                <div class="callout key">
                  <p class="callout-h">考点</p>
                  <p>递归的两个要素是<b>边界条件 + 递归方程</b>；递归算法是直接或间接调用自身的算法；优缺点各三条（简明 / 易证 / 有力工具 与 效率低 / 费堆栈）。这一节的名词解释题几乎每年都出。</p>
                </div>
        ` },
      ],
    },
    {
      id: 'sec-divide',
      heading: "3. 分治法：基本思想、四个适用条件、三个步骤",
      blocks: [
        { type: 'html', html: `
          <h3 id="sec-divide-h1">3.1 基本思想</h3>
          
                <p>PPT 第 6 页的原话：<b>"将一个难以直接解决的大问题，分割成规模较小的相同子问题，以便各个击破，分而治之。"</b>八个字的概括就是<b>"大事化小，小事化了"</b> —— 大事化小是分解，小事化了是把小到可以直接求解的问题解掉，再把结果一层层合并回去。</p>
          
                <p>注意"<b>相同</b>子问题"这四个字：子问题必须与原问题<b>同型</b>（同样的输入输出定义、同样的求解方法），只是规模更小。否则分解出来的东西没法用同一个算法处理，也就谈不上"递归求解"。</p>
          
                <h3 id="sec-divide-h2">3.2 四个适用条件</h3>
          
                <p>PPT 第 10 页给出分治法适用的四类条件，考试常以"分治法的适用条件是什么"直接提问，要能逐条背出：</p>
          
                <ol>
                  <li>该问题<b>可以分解</b>为若干个规模较小的相同问题；</li>
                  <li>分解出的各个子问题是<b>相互独立</b>的，子问题之间<b>不包含公共的子问题</b>；</li>
                  <li>问题规模<b>缩小到一定程度容易解决</b>（存在阈值 <span class="m">n<sub>0</sub></span>，规模 &le; <span class="m">n<sub>0</sub></span> 时可直接解）；</li>
                  <li>利用该问题分解出的子问题的解<b>可以合并</b>为原问题的解。</li>
                </ol>
          
                <p>第 4 条是分治与"减治"的分水岭：二分查找其实只用到一个子问题的解（另一半直接丢掉），所以严格说它是<b>减治</b> (decrease and conquer)；而归并排序必须把两半合并起来，才是标准的三步分治。第 2 条则是分治与动态规划的分水岭 —— 子问题一旦有公共部分（重叠子问题），分治就会重复计算，这时应该改用动态规划。</p>
          
                <div class="callout warn">
                  <p class="callout-h">易错：子问题不独立就别用分治</p>
                  <p>第 2 条"子问题相互独立、不包含公共子问题"经常被漏背。矩阵链乘法、LCS 这类子问题重叠的问题，硬套分治会指数爆炸，必须用动态规划（见 <a href="deck7.html">L6 · 动态规划</a>）。</p>
                </div>
          
                <h3 id="sec-divide-h3">3.3 三个步骤与四个要点</h3>
          
                <table class="tbl">
                  <thead><tr><th>步骤</th><th>做什么</th><th>PPT 原话</th></tr></thead>
                  <tbody>
                    <tr><td><b>分解</b> Divide</td><td>把原问题分成若干规模较小、相互独立、与原问题<b>同型</b>的子问题</td><td>"将问题分解成子问题"</td></tr>
                    <tr><td><b>求解</b> Conquer</td><td>递归地解子问题；若子问题规模 &le; <span class="m">n<sub>0</sub></span> 则直接解，否则继续分解</td><td>"递归地解决子问题"</td></tr>
                    <tr><td><b>合并</b> Combine</td><td>把子问题的答案组合成原问题的答案</td><td>"组合子问题的答案"</td></tr>
                  </tbody>
                </table>
          
                <p>PPT 第 8 页还列了设计分治算法时要回答的四个要点：① 分解成几个子问题、子问题规模多大（<b>最好使子问题的规模大致相同</b>）；② 子问题如何求解；③ 如何合并原问题的解；④ 时间复杂度（写出递归式再解）。</p>
          
                <p>"子问题规模大致相同"不是美学要求，而是效率要求：规模均衡时递归树最"矮"，层数是 <span class="m">O(lg n)</span>；若分成 1 个和 <span class="m">n&minus;1</span> 个（比如快排的最坏划分），递归树退化成链，层数变成 <span class="m">O(n)</span>。</p>
          
                <svg class="fig" viewBox="0 0 960 380" role="img" aria-label="分治三步骤示意图：原问题 P(n) 分解为 3 个规模 n/b 的子问题，递归求解后合并，右侧标注通用递归式 T(n)=aT(n/b)+f(n)">
                  <text x="24" y="24" class="tx-b">分治三步骤：分解 → 递归求解 → 合并</text>
          
                  <!-- 阶段标签 -->
                  <text x="16" y="70" class="tx-sm">① 分解</text>
                  <text x="16" y="176" class="tx-sm">② 递归求解</text>
                  <text x="16" y="302" class="tx-sm">③ 合并</text>
          
                  <!-- 原问题 -->
                  <rect x="210" y="34" width="220" height="52" rx="8" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="2"></rect>
                  <text x="320" y="66" class="tx tx-b" text-anchor="middle">原问题 P(n)</text>
          
                  <!-- 三条分解箭头 -->
                  <line x1="320" y1="86" x2="225" y2="134" stroke="var(--c-hot)" stroke-width="2"></line>
                  <polygon points="222,126 231,133 219,138" fill="var(--c-hot)"></polygon>
                  <line x1="320" y1="86" x2="405" y2="134" stroke="var(--c-hot)" stroke-width="2"></line>
                  <polygon points="402,126 410,138 399,133" fill="var(--c-hot)"></polygon>
                  <line x1="320" y1="86" x2="585" y2="134" stroke="var(--c-hot)" stroke-width="2"></line>
                  <polygon points="582,126 591,138 579,133" fill="var(--c-hot)"></polygon>
          
                  <!-- 三个子问题 -->
                  <rect x="150" y="138" width="150" height="48" rx="8" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.6"></rect>
                  <text x="225" y="167" class="tx" text-anchor="middle">子问题 P(n/b)</text>
                  <rect x="330" y="138" width="150" height="48" rx="8" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.6"></rect>
                  <text x="405" y="167" class="tx" text-anchor="middle">子问题 P(n/b)</text>
                  <rect x="510" y="138" width="150" height="48" rx="8" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.6"></rect>
                  <text x="585" y="167" class="tx" text-anchor="middle">子问题 P(n/b)</text>
          
                  <!-- 三条合并箭头 -->
                  <line x1="225" y1="186" x2="225" y2="264" stroke="var(--c-ok)" stroke-width="2"></line>
                  <polygon points="219,258 231,258 225,268" fill="var(--c-ok)"></polygon>
                  <line x1="405" y1="186" x2="405" y2="264" stroke="var(--c-ok)" stroke-width="2"></line>
                  <polygon points="399,258 411,258 405,268" fill="var(--c-ok)"></polygon>
                  <line x1="585" y1="186" x2="585" y2="264" stroke="var(--c-ok)" stroke-width="2"></line>
                  <polygon points="579,258 591,258 585,268" fill="var(--c-ok)"></polygon>
          
                  <!-- 合并 -->
                  <rect x="150" y="268" width="510" height="52" rx="8" fill="var(--c-tip-bg)" stroke="var(--c-ok)" stroke-width="2"></rect>
                  <text x="405" y="300" class="tx tx-b" text-anchor="middle">合并 Combine：代价 f(n)</text>
                  <text x="150" y="348" class="tx-sm">结果就是原问题 P(n) 的解</text>
          
                  <!-- 递归式面板 -->
                  <rect x="690" y="34" width="246" height="286" rx="8" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="1.6"></rect>
                  <text x="708" y="64" class="tx-b">通用递归式</text>
                  <text x="708" y="98" class="tx">T(n) = a·T(n/b) + f(n)</text>
                  <text x="708" y="132" class="tx-sm">a：子问题数目（本例 a = 3）</text>
                  <text x="708" y="160" class="tx-sm">n/b：子问题规模</text>
                  <text x="708" y="188" class="tx-sm">f(n)：分解 + 合并的工作量</text>
                  <text x="708" y="224" class="tx-sm">边界：n ≤ n₀ 时直接解，</text>
                  <text x="708" y="248" class="tx-sm">T(n₀) = Θ(1)</text>
                  <text x="708" y="284" class="tx-sm">子问题同型、规模更小、</text>
                  <text x="708" y="306" class="tx-sm">彼此独立 —— 四个条件</text>
                </svg>
                <p class="fig-cap">图 1 &nbsp;分治三步骤与通用递归式的对应关系：<span class="m">a</span> 管子问题个数，<span class="m">n/b</span> 管子问题规模，<span class="m">f(n)</span> 管分解与合并的代价</p>
          
                <h3 id="sec-divide-h4">3.4 通用递归式</h3>
          
                <p class="formula">T(n) = a &middot; T(n/b) + f(n)</p>
          
                <p>三个位置的物理含义（PPT 第 13 页在归并排序的递归式上做了标注）：<b>a</b> 是子问题的数目，<b>n/b</b> 是每个子问题的规模，<b>f(n)</b> 是"分解和组合的工作量"。写递归式时先确定这三个量，再套主方法，几乎就是分治算法分析的固定套路。</p>
          
                <div class="callout key">
                  <p class="callout-h">考点</p>
                  <p>① 基本思想的原话；② 四个适用条件（尤其第 2 条"子问题相互独立"）；③ 三步骤名称（分解 / 求解 / 合并）与各自的定义；④ 通用递归式三个符号的含义。<b>口诀：可分解、相互独立、规模小到好解、解能合并。</b></p>
                </div>
        ` },
      ],
    },
    {
      id: 'sec-power',
      heading: "4. 求幂 xn：19 次乘法怎么变成 5 次",
      blocks: [
        { type: 'html', html: `
          <h3 id="sec-power-h1">4.1 问题与简单算法</h3>
          
                <p>问题（PPT 第 7 页）：计算 <span class="m">x<sup>n</sup></span>，其中 <span class="m">n</span> 为正整数。</p>
          
                <p>简单算法就是连乘：<span class="m">x<sup>n</sup> = x &middot; x &middot; &hellip; &middot; x</span>（<span class="m">n</span> 个 <span class="m">x</span> 相乘），需要 <b><span class="m">n&minus;1</span> 次乘法</b>，时间复杂度 <span class="m">&Theta;(n)</span>。PPT 在这一处配的公式图就是 <span class="m">&Theta;(n)</span>。</p>
          
                <h3 id="sec-power-h2">4.2 分治算法：一次递归只用一半规模</h3>
          
                <p>利用指数的性质，把规模 <span class="m">n</span> 变成 <span class="m">n/2</span>（PPT 第 7 页的原式）：</p>
          
                <p class="formula">x<sup>n</sup> = (x<sup>n/2</sup>)<sup>2</sup> &nbsp;(n 为偶数)；&nbsp;&nbsp; x<sup>n</sup> = x &middot; (x<sup>(n&minus;1)/2</sup>)<sup>2</sup> &nbsp;(n 为奇数)</p>
          
                <p>两种情况都只<b>递归一次</b>（求 <span class="m">x<sup>&lfloor;n/2&rfloor;</sup></span>），然后在回代时做 1 次或 2 次乘法，于是</p>
          
                <p class="formula">T(n) = T(&lfloor;n/2&rfloor;) + &Theta;(1) &rArr; T(n) = &Theta;(lg n)</p>
          
                <p>套主方法：<span class="m">a = 1</span>、<span class="m">b = 2</span>，<span class="m">n<sup>log<sub>2</sub>1</sup> = n<sup>0</sup> = 1</span>，与 <span class="m">f(n) = &Theta;(1)</span> 同阶 &rArr; 情况 2 &rArr; <span class="m">&Theta;(lg n)</span>。递归深度只有 <span class="m">&lfloor;lg n&rfloor;</span> 层。</p>
          
                <h3 id="sec-power-h3">4.3 以 n = 20 为例：19 次 vs 5 次</h3>
          
                <p>PPT 的课后追问是"以 2 的 20 次方为例，比较简单算法与分治法的乘法次数"。分治法的调用链是 <b>20 &rarr; 10 &rarr; 5 &rarr; 2 &rarr; 1</b>，回代时逐层做乘法：</p>
          
                <table class="tbl">
                  <thead><tr><th>回代步骤</th><th>算式</th><th class="num">本层乘法</th><th class="num">累计</th></tr></thead>
                  <tbody>
                    <tr><td>边界 <span class="m">x<sup>1</sup></span></td><td>直接返回 <span class="m">x</span></td><td class="num">0</td><td class="num">0</td></tr>
                    <tr><td><span class="m">x<sup>2</sup></span></td><td><span class="m">x<sup>1</sup> &middot; x<sup>1</sup></span>（1 次平方）</td><td class="num">1</td><td class="num">1</td></tr>
                    <tr><td><span class="m">x<sup>5</sup></span></td><td><span class="m">(x<sup>2</sup>)<sup>2</sup> &middot; x</span>（1 次平方 + 1 次乘 x）</td><td class="num">2</td><td class="num">3</td></tr>
                    <tr><td><span class="m">x<sup>10</sup></span></td><td><span class="m">(x<sup>5</sup>)<sup>2</sup></span>（1 次平方）</td><td class="num">1</td><td class="num">4</td></tr>
                    <tr><td><span class="m">x<sup>20</sup></span></td><td><span class="m">(x<sup>10</sup>)<sup>2</sup></span>（1 次平方）</td><td class="num">1</td><td class="num">5</td></tr>
                  </tbody>
                </table>
          
                <div class="callout key">
                  <p class="callout-h">n = 20 的确切答案</p>
                  <p>简单算法：<b>19 次乘法</b>（<span class="m">n&minus;1 = 19</span>）；分治法：<b>5 次乘法</b>（<span class="m">1 + 2 + 1 + 1 = 5</span>），省下 14 次，约 3.8 倍。通式：<span class="m">&lfloor;lg n&rfloor;</span> 次平方 + （<span class="m">n</span> 的二进制中 1 的个数 &minus; 1）次乘法 = <span class="m">4 + 1 = 5</span>。以 <span class="m">x = 2</span> 代入，<span class="m">2<sup>20</sup> = 1048576</span>，两种算法结果相同、代价差 14 次乘法。</p>
                </div>
          
                <svg class="fig" viewBox="0 0 960 230" role="img" aria-label="分治求幂 x 的 20 次方的分解链：20 除 2 得 10，10 除 2 得 5，5 减 1 再除 2 得 2，2 除 2 得 1；回代时共用 1+1+2+1 等于 5 次乘法">
                  <text x="24" y="24" class="tx-b">x<sup>20</sup> 的分治分解链与回代乘法次数</text>
          
                  <rect x="30" y="46" width="120" height="46" rx="8" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="2"></rect>
                  <text x="90" y="75" class="tx tx-b" text-anchor="middle">x^20</text>
                  <rect x="200" y="46" width="120" height="46" rx="8" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.6"></rect>
                  <text x="260" y="75" class="tx" text-anchor="middle">x^10</text>
                  <rect x="370" y="46" width="120" height="46" rx="8" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.6"></rect>
                  <text x="430" y="75" class="tx" text-anchor="middle">x^5</text>
                  <rect x="540" y="46" width="120" height="46" rx="8" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.6"></rect>
                  <text x="600" y="75" class="tx" text-anchor="middle">x^2</text>
                  <rect x="710" y="46" width="120" height="46" rx="8" fill="var(--c-tip-bg)" stroke="var(--c-ok)" stroke-width="2"></rect>
                  <text x="770" y="75" class="tx tx-b" text-anchor="middle">x^1</text>
          
                  <line x1="150" y1="69" x2="192" y2="69" stroke="var(--c-hot)" stroke-width="2"></line>
                  <polygon points="186,63 186,75 200,69" fill="var(--c-hot)"></polygon>
                  <line x1="320" y1="69" x2="362" y2="69" stroke="var(--c-hot)" stroke-width="2"></line>
                  <polygon points="356,63 356,75 370,69" fill="var(--c-hot)"></polygon>
                  <line x1="490" y1="69" x2="532" y2="69" stroke="var(--c-hot)" stroke-width="2"></line>
                  <polygon points="526,63 526,75 540,69" fill="var(--c-hot)"></polygon>
                  <line x1="660" y1="69" x2="702" y2="69" stroke="var(--c-hot)" stroke-width="2"></line>
                  <polygon points="696,63 696,75 710,69" fill="var(--c-hot)"></polygon>
          
                  <text x="175" y="112" class="tx-sm" text-anchor="middle">20 偶：÷2</text>
                  <text x="345" y="112" class="tx-sm" text-anchor="middle">10 偶：÷2</text>
                  <text x="515" y="112" class="tx-sm" text-anchor="middle">5 奇：(5−1)÷2</text>
                  <text x="685" y="112" class="tx-sm" text-anchor="middle">2 偶：÷2</text>
          
                  <text x="90" y="134" class="tx-sm" text-anchor="middle">回代 +1 次</text>
                  <text x="260" y="134" class="tx-sm" text-anchor="middle">回代 +1 次</text>
                  <text x="430" y="134" class="tx-sm" text-anchor="middle">回代 +2 次</text>
                  <text x="600" y="134" class="tx-sm" text-anchor="middle">回代 +1 次</text>
                  <text x="770" y="134" class="tx-sm" text-anchor="middle">边界 0 次</text>
          
                  <text x="24" y="176" class="tx">合计 1 + 1 + 2 + 1 = 5 次乘法；简单算法 20 − 1 = 19 次</text>
                  <text x="24" y="204" class="tx-sm">T(n) = T(⌊n/2⌋) + Θ(1) ⇒ T(n) = Θ(lg n)；递归深度 ⌊lg 20⌋ = 4 层</text>
                </svg>
                <p class="fig-cap">图 2 &nbsp;<span class="m">x<sup>20</sup></span> 的分解链（红色箭头，向右）与回代乘法（数字标在节点下方）：凑齐 5 次乘法</p>
          
                <h3 id="sec-power-h4">4.4 逐帧动画：x<sup>20</sup> 的分解与回代</h3>
          
                <p>下面这个动画把 12 步走完：前 6 步向下分解（20 → 10 → 5 → 2 → 1），后 4 步向上回代并累加乘法次数，最后 2 步做对照与易错提醒。每一步的乘法次数都会实时累加。</p>
        ` },
        { type: 'demo', name: 'fast-power', title: "分治求幂 x^20：分解 20→10→5→2→1，回代共 5 次乘法（12 步）" },
        { type: 'html', html: `
          <h3 id="sec-power-h5">4.5 伪代码 + C++</h3>
          
                <div class="code-pair">
                  <div class="code-col">
                    <p class="code-h">伪代码（PPT 写法）</p>
                    <pre class="code"><code>POWER(x, n)                      // 计算 x^n，n 为正整数
          1  if n = 1                      // 边界条件：x^1 = x
          2      then return x              // 直接返回，0 次乘法
          3  m ← ⌊n/2⌋                    // 子问题规模：n 的一半（向下取整）
          4  t ← POWER(x, m)               // 递归求 x^m，只算一次并存进 t
          5  if n 是偶数                   // 偶数分支
          6      then return t * t         // x^n = (x^(n/2))^2，1 次乘法
          7  else                          // 奇数分支
          8      return t * t * x          // x^n = (x^m)^2 · x，2 次乘法</code></pre>
                  </div>
                  <div class="code-col">
                    <p class="code-h">C++</p>
                    <pre class="code cpp"><code>long long fastPow(long long x, int n) {   // 快速幂：分治求 x^n
              if (n == 0) return 1;                    // 边界条件：x^0 = 1
              if (n == 1) return x;                    // 边界条件：x^1 = x
              long long h = fastPow(x, n / 2);         // 子问题 x^⌊n/2⌋ 只算一次并保存
              if (n % 2 == 0) return h * h;            // n 偶数：x^n = (x^(n/2))^2
              return h * h * x;                        // n 奇数：x^n = (x^⌊n/2⌋)^2 · x
          }
          // fastPow(2, 20) 返回 1048576，乘法 5 次（不是 20 次）</code></pre>
                  </div>
                </div>
          
                <div class="callout warn">
                  <p class="callout-h">易错：写成两次递归调用就白干了</p>
                  <p>如果把 <span class="m">(x<sup>n/2</sup>)<sup>2</sup></span> 直接写成 <code>power(x, n/2) * power(x, n/2)</code>，同一个子问题会被算两遍，递归式退化成 <span class="m">T(n) = 2T(n/2) + &Theta;(1) = &Theta;(n)</span> —— 一次乘法都没省。正确写法是<b>先把 <span class="m">x<sup>&lfloor;n/2&rfloor;</sup></span> 存进变量</b>，再平方。</p>
                </div>
          
                <div class="callout key">
                  <p class="callout-h">考点</p>
                  <p>分治求幂的两个式子（n 偶 / n 奇）、递归式 <span class="m">T(n)=T(n/2)+&Theta;(1)=&Theta;(lg n)</span>、以及 <b>n = 20 时 19 次 vs 5 次</b>。这三样是这节的必考内容。</p>
                </div>
        ` },
      ],
    },
    {
      id: 'sec-hanoi',
      heading: "5. Hanoi 塔：T(n) = 2n &minus; 1",
      blocks: [
        { type: 'html', html: `
          <h3 id="sec-hanoi-h1">5.1 问题描述</h3>
          
                <p>三根柱子 A、B、C，<span class="m">n</span> 个大小不同的盘子按"小在上、大在下"叠在 A 柱上。规则两条：① 每次只能移动<b>一个</b>柱子最上面的盘子；② 不能把大盘子放到小盘子上面。目标：把整摞盘子从 A 搬到 C。</p>
          
                <h3 id="sec-hanoi-h2">5.2 基本思想与递推</h3>
          
                <p>分治的思路非常干净 —— 把"搬 <span class="m">n</span> 个"拆成"搬 <span class="m">n&minus;1</span> 个 + 搬 1 个 + 搬 <span class="m">n&minus;1</span> 个"：</p>
          
                <ol>
                  <li>把上面 <span class="m">n&minus;1</span> 个盘子整体从 A 移到 B（C 作辅助），需要 <span class="m">T(n&minus;1)</span> 次；</li>
                  <li>把最大的第 <span class="m">n</span> 号盘从 A 移到 C，<b>1</b> 次；</li>
                  <li>再把 B 上的 <span class="m">n&minus;1</span> 个盘子整体移到 C（A 作辅助），又是 <span class="m">T(n&minus;1)</span> 次。</li>
                </ol>
          
                <p class="formula">T(n) = 2T(n&minus;1) + 1，T(1) = 1 &rArr; T(n) = 2<sup>n</sup> &minus; 1</p>
          
                <p>解法：令 <span class="m">U(n) = T(n) + 1</span>，则 <span class="m">U(n) = 2T(n&minus;1) + 2 = 2U(n&minus;1)</span>，而 <span class="m">U(1) = 2</span>，故 <span class="m">U(n) = 2<sup>n</sup></span>，即 <span class="m">T(n) = 2<sup>n</sup> &minus; 1</span>。这个"加 1 再换元"的技巧在解一阶线性递归时很好用。</p>
          
                <svg class="fig" viewBox="0 0 960 310" role="img" aria-label="Hanoi 塔三个盘子的四个状态：初始全在 A；上面两个移到 B；最大盘移到 C；最后两个移到 C，共 7 次移动">
                  <text x="24" y="24" class="tx-b">Hanoi 塔 n = 3 的四个关键状态：3 + 1 + 3 = 7 次</text>
          
                  <!-- 面板 1 -->
                  <rect x="20" y="38" width="210" height="212" rx="8" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.4"></rect>
                  <text x="125" y="62" class="tx-sm" text-anchor="middle">① 初始：3 个盘都在 A</text>
                  <rect x="35" y="214" width="180" height="6" rx="3" fill="var(--c-line)"></rect>
                  <rect x="52" y="150" width="6" height="64" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.2"></rect>
                  <rect x="102" y="150" width="6" height="64" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.2"></rect>
                  <rect x="152" y="150" width="6" height="64" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.2"></rect>
                  <rect x="96" y="201" width="62" height="13" rx="3" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="1.4"></rect>
                  <rect x="92" y="186" width="48" height="13" rx="3" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="1.4"></rect>
                  <rect x="88" y="171" width="34" height="13" rx="3" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="1.4"></rect>
                  <text x="55" y="238" class="tx-sm" text-anchor="middle">A</text>
                  <text x="105" y="238" class="tx-sm" text-anchor="middle">B</text>
                  <text x="155" y="238" class="tx-sm" text-anchor="middle">C</text>
                  <text x="125" y="270" class="tx-sm" text-anchor="middle">已移动 0 次</text>
          
                  <!-- 面板 2 -->
                  <rect x="250" y="38" width="210" height="212" rx="8" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.4"></rect>
                  <text x="355" y="62" class="tx-sm" text-anchor="middle">② 上面 2 个盘 A→B</text>
                  <rect x="265" y="214" width="180" height="6" rx="3" fill="var(--c-line)"></rect>
                  <rect x="282" y="150" width="6" height="64" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.2"></rect>
                  <rect x="332" y="150" width="6" height="64" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.2"></rect>
                  <rect x="382" y="150" width="6" height="64" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.2"></rect>
                  <rect x="326" y="201" width="62" height="13" rx="3" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="1.4"></rect>
                  <rect x="326" y="186" width="48" height="13" rx="3" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="1.4"></rect>
                  <rect x="326" y="171" width="34" height="13" rx="3" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="1.4"></rect>
                  <text x="285" y="238" class="tx-sm" text-anchor="middle">A</text>
                  <text x="335" y="238" class="tx-sm" text-anchor="middle">B</text>
                  <text x="385" y="238" class="tx-sm" text-anchor="middle">C</text>
                  <text x="355" y="270" class="tx-sm" text-anchor="middle">已移动 3 次 = T(2)</text>
          
                  <!-- 面板 3 -->
                  <rect x="480" y="38" width="210" height="212" rx="8" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.4"></rect>
                  <text x="585" y="62" class="tx-sm" text-anchor="middle">③ 最大盘 A→C（1 次）</text>
                  <rect x="495" y="214" width="180" height="6" rx="3" fill="var(--c-line)"></rect>
                  <rect x="512" y="150" width="6" height="64" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.2"></rect>
                  <rect x="562" y="150" width="6" height="64" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.2"></rect>
                  <rect x="612" y="150" width="6" height="64" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.2"></rect>
                  <rect x="556" y="201" width="62" height="13" rx="3" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="1.4"></rect>
                  <rect x="556" y="186" width="48" height="13" rx="3" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="1.4"></rect>
                  <rect x="606" y="201" width="62" height="13" rx="3" fill="var(--c-warn-bg)" stroke="var(--c-hot)" stroke-width="1.8"></rect>
                  <text x="515" y="238" class="tx-sm" text-anchor="middle">A</text>
                  <text x="565" y="238" class="tx-sm" text-anchor="middle">B</text>
                  <text x="615" y="238" class="tx-sm" text-anchor="middle">C</text>
                  <text x="585" y="270" class="tx-sm" text-anchor="middle">已移动 3 + 1 = 4 次</text>
          
                  <!-- 面板 4 -->
                  <rect x="710" y="38" width="210" height="212" rx="8" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.4"></rect>
                  <text x="815" y="62" class="tx-sm" text-anchor="middle">④ 2 个盘 B→C</text>
                  <rect x="725" y="214" width="180" height="6" rx="3" fill="var(--c-line)"></rect>
                  <rect x="742" y="150" width="6" height="64" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.2"></rect>
                  <rect x="792" y="150" width="6" height="64" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.2"></rect>
                  <rect x="842" y="150" width="6" height="64" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.2"></rect>
                  <rect x="786" y="201" width="62" height="13" rx="3" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="1.4"></rect>
                  <rect x="786" y="186" width="48" height="13" rx="3" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="1.4"></rect>
                  <rect x="786" y="171" width="34" height="13" rx="3" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="1.4"></rect>
                  <text x="745" y="238" class="tx-sm" text-anchor="middle">A</text>
                  <text x="795" y="238" class="tx-sm" text-anchor="middle">B</text>
                  <text x="845" y="238" class="tx-sm" text-anchor="middle">C</text>
                  <text x="815" y="270" class="tx-sm" text-anchor="middle">已移动 4 + 3 = 7 次</text>
          
                  <text x="24" y="298" class="tx-sm">T(n) = 2T(n−1) + 1，T(1) = 1 ⇒ T(n) = 2^n − 1；n = 3 时 2^3 − 1 = 7，四步分别用 3、1、3 次</text>
                </svg>
                <p class="fig-cap">图 3 &nbsp;Hanoi 塔 <span class="m">n=3</span> 的四个关键状态：搬 <span class="m">n&minus;1</span> 个到辅助柱 &rarr; 搬最大盘 &rarr; 再搬 <span class="m">n&minus;1</span> 个到目标柱</p>
          
                <h3 id="sec-hanoi-h3">5.3 逐帧动画：7 次移动一步不落</h3>
        ` },
        { type: 'demo', name: 'hanoi-tower', title: "Hanoi 塔 n = 3：7 次移动逐帧演示 + 2^n − 1 归纳（12 步）" },
        { type: 'html', html: `
          <h3 id="sec-hanoi-h4">5.4 伪代码 + C++</h3>
          
                <div class="code-pair">
                  <div class="code-col">
                    <p class="code-h">伪代码（PPT 写法）</p>
                    <pre class="code"><code>HANOI(n, A, B, C)                // 把 n 个盘从 A 经 B 移到 C
          1  if n = 0                      // 边界条件：0 个盘不用搬
          2      then return                // 直接返回
          3  HANOI(n-1, A, C, B)           // ① 上面 n−1 个：A → B（C 作辅助）
          4  把盘 n 从 A 移到 C             // ② 最大盘：A → C，1 次移动
          5  HANOI(n-1, B, A, C)           // ③ 上面 n−1 个：B → C（A 作辅助）</code></pre>
                  </div>
                  <div class="code-col">
                    <p class="code-h">C++</p>
                    <pre class="code cpp"><code>long long hanoiMoves = 0;                    // 全局计数器：记录总移动次数
          
          void hanoi(int n, char from, char via, char to) {  // 把 n 个盘从 from 经 via 移到 to
              if (n == 0) return;                      // 边界条件：0 个盘不用搬
              hanoi(n - 1, from, to, via);             // ① 上面 n−1 个：from → via
              ++hanoiMoves;                            // ② 最大盘：from → to，计一次
              hanoi(n - 1, via, from, to);             // ③ 上面 n−1 个：via → to
          }
          // hanoi(3, 'A', 'B', 'C') 之后 hanoiMoves = 7；n = 4 时是 15</code></pre>
                  </div>
                </div>
          
                <h3 id="sec-hanoi-h5">5.5 64 个盘子要搬多久</h3>
          
                <p>PPT 第 9 页的追问"1 秒移 1 个，64 个盘子要多少时间？"，答案要背下来：</p>
          
                <table class="tbl">
                  <thead><tr><th class="num">n</th><th class="num">T(n) = 2<sup>n</sup> &minus; 1</th><th>说明</th></tr></thead>
                  <tbody>
                    <tr><td class="num">3</td><td class="num">7</td><td>本页动画的例子</td></tr>
                    <tr><td class="num">10</td><td class="num">1023</td><td>已超过一千次</td></tr>
                    <tr><td class="num">64</td><td class="num">1.8446744&times;10<sup>19</sup></td><td>每秒 1 次 &asymp; 5849 亿年（PPT 记作"5000 亿年"）</td></tr>
                    <tr><td class="num">64</td><td class="num">1.8446744&times;10<sup>19</sup></td><td>每秒 10<sup>15</sup> 次 &asymp; 18447 秒 &asymp; 5.1 小时</td></tr>
                  </tbody>
                </table>
          
                <p>PPT 还留了两个思考：① 是否存在更好的解法？—— 在"每次只能移动一个盘子、大盘不能压小盘"的规则下，<span class="m">2<sup>n</sup>&minus;1</span> 是<b>下界</b>，不可能更好；② <b>Reve 难题</b>：Hanoi 塔的变种，柱子数增加、允许盘子相等，那是另一个问题。</p>
          
                <div class="callout key">
                  <p class="callout-h">考点</p>
                  <p>递推 <span class="m">T(n)=2T(n&minus;1)+1</span>、通解 <span class="m">T(n)=2<sup>n</sup>&minus;1</span>、64 盘 &asymp; 5849 亿年（PPT 写 5000 亿年）、三步骤的移动顺序（n&minus;1 到辅助柱 &rarr; 最大盘到目标柱 &rarr; n&minus;1 到目标柱）。</p>
                </div>
        ` },
      ],
    },
    {
      id: 'sec-merge',
      heading: "6. 归并排序与\"求解时间复杂度\"",
      blocks: [
        { type: 'html', html: `
          <h3 id="sec-merge-h1">6.1 三个步骤</h3>
          
                <p>归并排序 (merge sort) 是分治三步骤最标准的样子（PPT 第 12 页）：</p>
          
                <ul>
                  <li><b>分解</b>：把 <span class="m">n</span> 个元素分成各含 <span class="m">n/2</span> 个元素的两个子序列 —— "显而易见"；</li>
                  <li><b>解决</b>：递归地对两个子数组排序；</li>
                  <li><b>合并</b>：把两段已排序的子数组合并成一段有序数组 —— "线性时间合并"。</li>
                </ul>
          
                <h3 id="sec-merge-h2">6.2 递归式与复杂度</h3>
          
                <p class="formula">T(n) = 2T(n/2) + &Theta;(n) &rArr; T(n) = &Theta;(n lg n)</p>
          
                <p>其中 <span class="m">2</span> 是子问题个数、<span class="m">n/2</span> 是子问题规模、<span class="m">&Theta;(n)</span> 是合并的工作量。套主方法：<span class="m">a=2</span>、<span class="m">b=2</span>，<span class="m">n<sup>log<sub>2</sub>2</sup> = n</span>，与 <span class="m">f(n)=&Theta;(n)</span> 同阶 &rArr; 情况 2 &rArr; <span class="m">&Theta;(n lg n)</span>。</p>
          
                <p>直观理解：递归树有 <span class="m">lg n</span> 层，每层的合并总代价都是 <span class="m">cn</span>，所以总代价 <span class="m">cn&middot;lg n</span>。这也解释了为什么"子问题规模要大致相同"—— 均分才能保证每层刚好铺满 <span class="m">cn</span>。</p>
          
                <svg class="fig" viewBox="0 0 960 260" role="img" aria-label="归并排序的合并步骤：左段 27 38 43 与右段 3 9 10 82 逐个小者取出，合并成 3 9 10 27 38 43 82">
                  <text x="24" y="24" class="tx-b">合并 Merge：两段有序 &rarr; 一段有序，代价 &Theta;(n)</text>
          
                  <text x="24" y="64" class="tx-sm">左段 L</text>
                  <rect x="160" y="44" width="50" height="38" rx="5" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="1.4"></rect>
                  <text x="185" y="69" class="tx" text-anchor="middle">27</text>
                  <rect x="214" y="44" width="50" height="38" rx="5" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="1.4"></rect>
                  <text x="239" y="69" class="tx" text-anchor="middle">38</text>
                  <rect x="268" y="44" width="50" height="38" rx="5" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="1.4"></rect>
                  <text x="293" y="69" class="tx" text-anchor="middle">43</text>
          
                  <text x="24" y="134" class="tx-sm">右段 R</text>
                  <rect x="160" y="114" width="50" height="38" rx="5" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.4"></rect>
                  <text x="185" y="139" class="tx" text-anchor="middle">3</text>
                  <rect x="214" y="114" width="50" height="38" rx="5" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.4"></rect>
                  <text x="239" y="139" class="tx" text-anchor="middle">9</text>
                  <rect x="268" y="114" width="50" height="38" rx="5" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.4"></rect>
                  <text x="293" y="139" class="tx" text-anchor="middle">10</text>
                  <rect x="322" y="114" width="50" height="38" rx="5" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.4"></rect>
                  <text x="347" y="139" class="tx" text-anchor="middle">82</text>
          
                  <line x1="358" y1="156" x2="358" y2="186" stroke="var(--c-hot)" stroke-width="2"></line>
                  <polygon points="352,180 364,180 358,192" fill="var(--c-hot)"></polygon>
                  <text x="370" y="178" class="tx-sm">比较 L[i] 与 R[j]，取小者</text>
          
                  <text x="24" y="222" class="tx-sm">结果 A</text>
                  <rect x="160" y="200" width="50" height="38" rx="5" fill="var(--c-tip-bg)" stroke="var(--c-ok)" stroke-width="1.6"></rect>
                  <text x="185" y="225" class="tx" text-anchor="middle">3</text>
                  <rect x="214" y="200" width="50" height="38" rx="5" fill="var(--c-tip-bg)" stroke="var(--c-ok)" stroke-width="1.6"></rect>
                  <text x="239" y="225" class="tx" text-anchor="middle">9</text>
                  <rect x="268" y="200" width="50" height="38" rx="5" fill="var(--c-tip-bg)" stroke="var(--c-ok)" stroke-width="1.6"></rect>
                  <text x="293" y="225" class="tx" text-anchor="middle">10</text>
                  <rect x="322" y="200" width="50" height="38" rx="5" fill="var(--c-tip-bg)" stroke="var(--c-ok)" stroke-width="1.6"></rect>
                  <text x="347" y="225" class="tx" text-anchor="middle">27</text>
                  <rect x="376" y="200" width="50" height="38" rx="5" fill="var(--c-tip-bg)" stroke="var(--c-ok)" stroke-width="1.6"></rect>
                  <text x="401" y="225" class="tx" text-anchor="middle">38</text>
                  <rect x="430" y="200" width="50" height="38" rx="5" fill="var(--c-tip-bg)" stroke="var(--c-ok)" stroke-width="1.6"></rect>
                  <text x="455" y="225" class="tx" text-anchor="middle">43</text>
                  <rect x="484" y="200" width="50" height="38" rx="5" fill="var(--c-tip-bg)" stroke="var(--c-ok)" stroke-width="1.6"></rect>
                  <text x="509" y="225" class="tx" text-anchor="middle">82</text>
          
                  <text x="560" y="72" class="tx-sm">· 两段各扫描一遍 &rArr; &Theta;(n)</text>
                  <text x="560" y="104" class="tx-sm">· 递归式 2T(n/2) + &Theta;(n)</text>
                  <text x="560" y="136" class="tx-sm">· 主方法情况 2 &rArr; &Theta;(n lg n)</text>
                  <text x="560" y="168" class="tx-sm">· PPT 算例：38 27 43 3 9 82 10</text>
                  <text x="560" y="200" class="tx-sm">&nbsp;&nbsp;排序结果 3 9 10 27 38 43 82</text>
                </svg>
                <p class="fig-cap">图 4 &nbsp;合并步骤：两段各扫描一遍，每次取较小者写入结果，总代价与 <span class="m">n</span> 成正比</p>
          
                <h3 id="sec-merge-h3">6.3 伪代码 + C++</h3>
          
                <div class="code-pair">
                  <div class="code-col">
                    <p class="code-h">伪代码（PPT 写法）</p>
                    <pre class="code"><code>MERGE-SORT(A, p, r)              // 对 A[p..r] 归并排序
          1  if p &lt; r                      // 至少 2 个元素才需要排序
          2      then q ← ⌊(p+r)/2⌋        // 分解点：尽量均分
          3           MERGE-SORT(A, p, q)  // 递归排序左半 A[p..q]
          4           MERGE-SORT(A, q+1, r)// 递归排序右半 A[q+1..r]
          5           MERGE(A, p, q, r)    // 线性时间合并两段
          
          MERGE(A, p, q, r)                // 合并相邻的两段有序区
          1  n1 ← q-p+1; n2 ← r-q         // 两段各自的长度
          2  把 A[p..q] 复制到 L[1..n1]    // 左段复制到临时数组 L
          3  把 A[q+1..r] 复制到 R[1..n2]  // 右段复制到临时数组 R
          4  i ← 1; j ← 1; k ← p          // 三个指针初始化
          5  while i ≤ n1 and j ≤ n2      // 两段都还有元素
          6      do if L[i] ≤ R[j]         // 左段元素不大于右段
          7            then A[k] ← L[i]; i ← i+1   // 取左段元素
          8            else A[k] ← R[j]; j ← j+1   // 取右段元素
          9         k ← k+1                // 写入位置后移一格
          10 while i ≤ n1                  // 左段还有剩余
          11     do A[k] ← L[i]; i ← i+1; k ← k+1   // 把剩下的直接搬完
          12 while j ≤ n2                  // 右段还有剩余
          13     do A[k] ← R[j]; j ← j+1; k ← k+1   // 把剩下的直接搬完</code></pre>
                  </div>
                  <div class="code-col">
                    <p class="code-h">C++</p>
                    <pre class="code cpp"><code>void merge(int A[], int lo, int mid, int hi, int T[]) {  // 合并两段有序区
              int i = lo, j = mid + 1, k = lo;         // i 走左段、j 走右段、k 写临时数组
              while (i &lt;= mid &amp;&amp; j &lt;= hi) {             // 两段都还有元素时逐个取小者
                  if (A[i] &lt;= A[j]) T[k++] = A[i++];   // 左段较小（相等取左段，保证稳定）
                  else T[k++] = A[j++];                // 右段较小
              }
              while (i &lt;= mid) T[k++] = A[i++];        // 左段剩余元素直接搬到末尾
              while (j &lt;= hi) T[k++] = A[j++];         // 右段剩余元素直接搬到末尾
              for (k = lo; k &lt;= hi; ++k) A[k] = T[k];  // 临时数组整体写回原数组
          }
          
          void mergeSort(int A[], int lo, int hi, int T[]) {       // 归并排序入口
              if (lo &gt;= hi) return;                    // 边界条件：不足 2 个元素已有序
              int mid = lo + (hi - lo) / 2;            // 分解点：尽量均分
              mergeSort(A, lo, mid, T);                // 递归排序左半 A[lo..mid]
              mergeSort(A, mid + 1, hi, T);            // 递归排序右半 A[mid+1..hi]
              merge(A, lo, mid, hi, T);                // 线性时间合并两段
          }</code></pre>
                  </div>
                </div>
          
                <h3 id="sec-merge-h4">6.4 例：解 T(n) = 2T(n/2) + 5n<sup>2</sup></h3>
          
                <p>PPT 第 14 页给了一个具体的"求解时间复杂度"练习：设阈值 <span class="m">n<sub>0</sub> = 1</span> 时时间耗费为 7，分解及合并成原问题的时间为 <span class="m">5n<sup>2</sup></span>，于是</p>
          
                <p class="formula">T(n) = 7 &nbsp;(n = 1)；&nbsp;&nbsp; T(n) = 2T(n/2) + 5n<sup>2</sup> &nbsp;(n &gt; 1)</p>
          
                <p>套主方法：<span class="m">a = 2</span>、<span class="m">b = 2</span>，分水岭 <span class="m">n<sup>log<sub>2</sub>2</sup> = n</span>；<span class="m">f(n) = 5n<sup>2</sup> = &Omega;(n<sup>1+&epsilon;</sup>)</span>（取 <span class="m">&epsilon; = 1</span>）满足第 3 种情况的第一个条件；再验证正则条件：<span class="m">a&middot;f(n/b) = 2&middot;5(n/2)<sup>2</sup> = 2.5n<sup>2</sup> &le; c&middot;5n<sup>2</sup></span>，取 <span class="m">c = 1/2 &lt; 1</span> 成立。故 <span class="m">T(n) = &Theta;(f(n)) = &Theta;(n<sup>2</sup>)</span>。</p>
          
                <div class="callout key">
                  <p class="callout-h">考点</p>
                  <p>归并排序三步骤的原话、递归式 <span class="m">T(n)=2T(n/2)+&Theta;(n)=&Theta;(n lg n)</span>、以及"任意 <span class="m">cn<sup>d</sup></span> 形式的 <span class="m">f(n)</span> 只要指数大于 <span class="m">log<sub>b</sub>a</span> 就走情况 3"。本页这个 <span class="m">5n<sup>2</sup></span> 的例子答案是 <span class="m">&Theta;(n<sup>2</sup>)</span>。</p>
                </div>
        ` },
      ],
    },
    {
      id: 'sec-bsearch',
      heading: "7. 二分查找：T(n) = T(n/2) + &Theta;(1) &rArr; &Theta;(lg n)",
      blocks: [
        { type: 'html', html: `
          <h3 id="sec-bsearch-h1">7.1 三个步骤与一个例子</h3>
          
                <p>二分查找 (binary search) 在<b>已排序</b>的数组中查找元素 <span class="m">x</span>（PPT 第 15～20 页）：</p>
          
                <ul>
                  <li><b>分解</b>：检查中间元素 <span class="m">A[mid]</span>；</li>
                  <li><b>解决</b>：若 <span class="m">x</span> 比它小就去左半递归，比它大就去右半递归 —— 只递归<b>一个</b>子数组；</li>
                  <li><b>合并</b>：显而易见（答案就是那个下标，不需要合并）。</li>
                </ul>
          
                <p>PPT 的例子是在 <span class="m">3, 5, 7, 8, 9, 12, 15</span> 中查找 <b>9</b>：第一次取 <span class="m">mid = 4</span>、<span class="m">A[4] = 8 &lt; 9</span>，丢掉左半；第二次在 <span class="m">9, 12, 15</span> 中取 <span class="m">mid = 6</span>、<span class="m">A[6] = 12 &gt; 9</span>，丢掉右半；第三次 <span class="m">mid = 5</span>、<span class="m">A[5] = 9</span> 命中，共 <b>3 次</b>比较。</p>
          
                <h3 id="sec-bsearch-h2">7.2 逐帧动画：low / mid / high 怎么收窄</h3>
        ` },
        { type: 'demo', name: 'binary-search', title: "在 3 5 7 8 9 12 15 中查找 9：区间 [1..7] → [5..7] → [5..5]（10 步）" },
        { type: 'html', html: `
          <h3 id="sec-bsearch-h3">7.3 递归式与 &Theta;(lg n) 的推导</h3>
          
                <p class="formula">T(n) = 1 &middot; T(n/2) + &Theta;(1)</p>
          
                <p>三个位置（PPT 第 21 页在同一行公式上标了"# 子问题数""子问题大小""分解和组合工作"）：子问题数 <span class="m">a = 1</span>（只递归一边！）、子问题大小 <span class="m">n/2</span>、分解与组合工作 <span class="m">f(n) = &Theta;(1)</span>（只检查一个中间元素）。</p>
          
                <p>套主方法，一步一步写：</p>
          
                <ol>
                  <li><span class="m">a = 1</span>，<span class="m">b = 2</span> &rArr; <span class="m">n<sup>log<sub>b</sub>a</sup> = n<sup>log<sub>2</sub>1</sup> = n<sup>0</sup> = 1</span>；</li>
                  <li><span class="m">f(n) = &Theta;(1)</span> 与 <span class="m">1</span> 同阶 &rArr; 落在<b>情况 2</b>；</li>
                  <li>解为 <span class="m">&Theta;(n<sup>log<sub>b</sub>a</sup> &middot; lg n) = &Theta;(1 &middot; lg n) = &Theta;(lg n)</span>。</li>
                </ol>
          
                <p>所以 PPT 第 21 页的结论就是：<span class="m">n<sup>log<sub>b</sub>a</sup> = n<sup>log<sub>2</sub>1</sup> = n<sup>0</sup> = 1 &rArr; T(n) = &Theta;(lg n)</span>。最坏比较次数是 <span class="m">&lfloor;lg n&rfloor; + 1</span>：<span class="m">n = 7</span> 时是 <span class="m">2 + 1 = 3</span> 次，顺序查找最坏要 7 次。</p>
          
                <h3 id="sec-bsearch-h4">7.4 伪代码 + C++</h3>
          
                <div class="code-pair">
                  <div class="code-col">
                    <p class="code-h">伪代码（PPT 写法）</p>
                    <pre class="code"><code>BINARY-SEARCH(A, low, high, x)    // 在有序数组 A[low..high] 中查找 x
          1  if low &gt; high                  // 边界条件：区间为空
          2      then return -1             // 没找到，返回 -1
          3  mid ← ⌊(low+high)/2⌋          // 分解：取中间位置
          4  if A[mid] = x                 // 命中
          5      then return mid            // 返回下标
          6  else if A[mid] &lt; x            // 中间元素太小
          7      then return BINARY-SEARCH(A, mid+1, high, x)  // 只递归右半
          8      else return BINARY-SEARCH(A, low, mid-1, x)  // 只递归左半</code></pre>
                  </div>
                  <div class="code-col">
                    <p class="code-h">C++</p>
                    <pre class="code cpp"><code>int binarySearch(const int A[], int lo, int hi, int x) {  // 有序数组里的二分查找
              if (lo &gt; hi) return -1;                  // 边界条件：区间为空 ⇒ 没找到
              int mid = lo + (hi - lo) / 2;            // 取中点（lo+hi 可能溢出，故这样写）
              if (A[mid] == x) return mid;             // 命中，返回下标
              if (A[mid] &lt; x) return binarySearch(A, mid + 1, hi, x);  // 只递归右半
              return binarySearch(A, lo, mid - 1, x);                  // 只递归左半
          }
          // 在 3 5 7 8 9 12 15 中查 9 返回下标 4（第 3 次比较命中）</code></pre>
                  </div>
                </div>
          
                <div class="callout warn">
                  <p class="callout-h">易错：二分查找的两个前提</p>
                  <p>① 数组必须<b>有序</b>（无序要先花 <span class="m">O(n lg n)</span> 排序，否则二分没有意义）；② 必须能 <span class="m">O(1)</span> <b>随机访问</b>中间元素，所以只适合数组、不适合链表。另外 <code>mid = (low + high) / 2</code> 在 <span class="m">low + high</span> 溢出时会出错，工程上写成 <code>lo + (hi - lo) / 2</code>。</p>
                </div>
          
                <div class="callout key">
                  <p class="callout-h">考点</p>
                  <p>递归式 <span class="m">T(n)=T(n/2)+&Theta;(1)</span> 与主方法三步推导、<span class="m">n<sup>log<sub>2</sub>1</sup>=1</span> 这个"分水岭等于常数"的特殊性、比较次数上界 <span class="m">&lfloor;lg n&rfloor;+1</span>。另外注意：二分查找只递归一边，属于<b>减治</b>。</p>
                </div>
        ` },
      ],
    },
    {
      id: 'sec-coins',
      heading: "8. 硬币问题：天平有 3 种结果，所以三分最优",
      blocks: [
        { type: 'html', html: `
          <h3 id="sec-coins-h1">8.1 问题描述</h3>
          
                <p>PPT 第 22～24 页：水果店老板共有 <span class="m">n</span> 枚硬币，其中<b>一枚是假币</b>，假币重量略轻。目前只有一个天平，请设计算法，使老板用<b>最少的次数</b>找到这枚假币。</p>
          
                <h3 id="sec-coins-h2">8.2 三种解法</h3>
          
                <table class="tbl">
                  <thead><tr><th>解法</th><th>做法</th><th>最坏次数</th><th>时间复杂度</th></tr></thead>
                  <tbody>
                    <tr><td>① 顺序搜索</td><td>一枚一枚拿起来比，直到找到轻的那枚</td><td class="num">n &minus; 1</td><td class="num">O(n)</td></tr>
                    <tr><td>② 二分搜索</td><td>平均分 2 堆放天平两端，留下轻的一堆，重复</td><td class="num">&lceil;log<sub>2</sub> n&rceil;</td><td class="num">O(log<sub>2</sub> n)</td></tr>
                    <tr><td>③ 三分搜索</td><td>平均分 3 堆，拿其中 2 堆上天平：相等留第 3 堆，否则留轻的一堆</td><td class="num">&lceil;log<sub>3</sub> n&rceil;</td><td class="num">O(log<sub>3</sub> n)</td></tr>
                  </tbody>
                </table>
          
                <p>为什么三分比二分好？因为<b>天平一次称量有 3 种结果</b>：左轻、右轻、平衡。二分只用了其中 2 种（平衡几乎用不上，因为假币必在某一堆里），白白浪费了一种结果；三分把 3 种结果全部用上，每称一次把候选范围缩到 <span class="m">n/3</span>。</p>
          
                <h3 id="sec-coins-h3">8.3 为什么 &lceil;log<sub>3</sub> n&rceil; 是最优的</h3>
          
                <p>信息论下界：天平每称一次最多有 3 种结果，称 <span class="m">k</span> 次最多区分 <span class="m">3<sup>k</sup></span> 种情况。假币可能是 <span class="m">n</span> 枚中的任意一枚，共 <span class="m">n</span> 种情况，所以必须</p>
          
                <p class="formula">3<sup>k</sup> &ge; n &nbsp;&rArr;&nbsp; k &ge; &lceil;log<sub>3</sub> n&rceil;</p>
          
                <p>而三分搜索每次恰好把范围缩到 <span class="m">&lceil;n/3&rceil;</span>，正好达到这个下界，所以<b>三分是最优的</b>。几个具体数字：<span class="m">n = 27</span> 时 <span class="m">&lceil;log<sub>3</sub>27&rceil; = 3</span> 次；<span class="m">n = 1000</span> 时二分要 <span class="m">&lceil;log<sub>2</sub>1000&rceil; = 10</span> 次，三分只要 <span class="m">&lceil;log<sub>3</sub>1000&rceil; = 7</span> 次。递归式写作</p>
          
                <p class="formula">T(n) = T(n/3) + &Theta;(1) &rArr; T(n) = &Theta;(log<sub>3</sub> n) = &Theta;(lg n / lg 3)</p>
          
                <h3 id="sec-coins-h4">8.4 伪代码 + C++</h3>
          
                <p>约定 <code>coinW[1..n]</code> 存每枚硬币的重量，假币轻 1 个单位。每次把候选区间按 <span class="m">&lceil;n/3&rceil;</span> 分成三堆，比较前两堆的重量和。</p>
          
                <div class="code-pair">
                  <div class="code-col">
                    <p class="code-h">伪代码（三分搜索）</p>
                    <pre class="code"><code>FIND-FAKE(lo, hi)                // 在 lo..hi 中找较轻的假币
          1  n ← hi-lo+1                   // 当前候选硬币枚数
          2  if n = 1                      // 边界条件：只剩一枚
          3      then return lo             // 它就是假币
          4  k ← ⌈n/3⌉                     // 每堆枚数（向上取整）
          5  把 lo..lo+k-1 放天平左端       // 第一堆
          6  把 lo+k..lo+2k-1 放天平右端    // 第二堆
          7  if 两端重量相等               // 天平平衡
          8      then return FIND-FAKE(lo+2k, hi)    // 假币在第三堆
          9  if 左端轻                     // 左端总重量更小
          10     then return FIND-FAKE(lo, lo+k-1)   // 假币在第一堆
          11 return FIND-FAKE(lo+k, lo+2k-1)         // 假币在第二堆</code></pre>
                  </div>
                  <div class="code-col">
                    <p class="code-h">C++</p>
                    <pre class="code cpp"><code>const int CN = 27;                           // 硬币总数 n = 27
          int coinW[CN + 1];                           // coinW[1..27]：每枚硬币的重量
          int weighCount = 0;                          // 累计称重次数
          
          int rangeSum(int lo, int hi) {               // 求区间 [lo, hi] 的重量和
              int s = 0;                               // 累加器清零
              for (int i = lo; i &lt;= hi; ++i) s += coinW[i];  // 逐枚累加
              return s;                                // 返回这一段的总重量
          }
          
          int findFake(int lo, int hi) {               // 在 lo..hi 中找较轻的假币
              int n = hi - lo + 1;                     // 当前候选枚数
              if (n &lt;= 0) return -1;                   // 防御：区间为空（正常不会发生）
              if (n == 1) return lo;                   // 边界条件：只剩一枚，必是假币
              int k = (n + 2) / 3;                     // 每堆 ⌈n/3⌉ 枚
              int a = lo, b = lo + k, c = lo + 2 * k;  // 三堆的起始下标
              int nb = (c &lt;= hi) ? k : (hi - b + 1);   // 第二堆实际枚数（可能不满）
              int s1 = rangeSum(a, b - 1);             // 第一堆放天平左端
              int s2 = rangeSum(b, b + nb - 1);        // 第二堆放天平右端
              ++weighCount;                            // 称一次，计数器加一
              if (s1 == s2) return findFake(b + nb, hi);   // 平衡 ⇒ 假币在第三堆
              if (s1 &lt; s2) return findFake(a, b - 1);      // 左端轻 ⇒ 假币在第一堆
              return findFake(b, b + nb - 1);              // 右端轻 ⇒ 假币在第二堆
          }
          // 27 枚中任取一枚作伪，本函数恰好称 3 次 = ⌈log3 27⌉</code></pre>
                  </div>
                </div>
          
                <div class="callout key">
                  <p class="callout-h">考点</p>
                  <p>天平有<b>三种结果</b>（左轻 / 右轻 / 平衡）&rArr; 每次最多三分 &rArr; 最少 <span class="m">&lceil;log<sub>3</sub> n&rceil;</span> 次；三种解法的复杂度对比（<span class="m">O(n)</span> / <span class="m">O(log<sub>2</sub> n)</span> / <span class="m">O(log<sub>3</sub> n)</span>）。这题是"用信息论解释算法下界"的经典例子。</p>
                </div>
        ` },
      ],
    },
    {
      id: 'sec-partition',
      heading: "9. 整数划分：p(6) = 11 与 q(n, m)",
      blocks: [
        { type: 'html', html: `
          <h3 id="sec-partition-h1">9.1 定义</h3>
          
                <p>整数划分 (integer partition) 问题（PPT 第 25 页）：将正整数 <span class="m">n</span> 表示成一系列正整数之和</p>
          
                <p class="formula">n = n<sub>1</sub> + n<sub>2</sub> + &hellip; + n<sub>k</sub> &nbsp;(n<sub>1</sub> &ge; n<sub>2</sub> &ge; &hellip; &ge; n<sub>k</sub> &ge; 1)</p>
          
                <p>这种表示称为 <span class="m">n</span> 的一个划分，求 <span class="m">n</span> 的<b>不同划分个数</b> <span class="m">p(n)</span>。<b>加数的顺序不计</b> —— 所以规定 <span class="m">n<sub>1</sub> &ge; n<sub>2</sub> &ge; &hellip;</span>，让每种划分只有一种写法。</p>
          
                <h3 id="sec-partition-h2">9.2 以 n = 6 为例：11 种划分</h3>
          
                <p>PPT 第 27 页说"没有思路？以 n = 6 为例分析"，然后按<b>最大加数</b>从大到小分组，正好排成 6 列：</p>
          
                <table class="tbl">
                  <thead><tr><th class="num">最大加数</th><th>该组的所有划分</th><th class="num">个数</th></tr></thead>
                  <tbody>
                    <tr><td class="num">6</td><td class="num">6</td><td class="num">1</td></tr>
                    <tr><td class="num">5</td><td class="num">5+1</td><td class="num">1</td></tr>
                    <tr><td class="num">4</td><td class="num">4+1+1，4+2</td><td class="num">2</td></tr>
                    <tr><td class="num">3</td><td class="num">3+1+1+1，3+2+1，3+3</td><td class="num">3</td></tr>
                    <tr><td class="num">2</td><td class="num">2+1+1+1+1，2+2+1+1，2+2+2</td><td class="num">3</td></tr>
                    <tr><td class="num">1</td><td class="num">1+1+1+1+1+1</td><td class="num">1</td></tr>
                    <tr><td class="num">合计</td><td class="num">p(6) = 1+1+2+3+3+1</td><td class="num"><b>11</b></td></tr>
                  </tbody>
                </table>
          
                <p>这张表就是递推的雏形：按"最大加数是否等于 <span class="m">m</span>"分成两类，正好对应下面的递归方程。</p>
          
                <h3 id="sec-partition-h3">9.3 增加一个自变量：q(n, m)</h3>
          
                <p>PPT 第 28 页引入第二个参数：<b>最大加数 <span class="m">n<sub>1</sub></span> 不大于 <span class="m">m</span> 的划分个数记为 <span class="m">q(n, m)</span></b>。有了它，就能按 <span class="m">m</span> 从大到小递推：</p>
          
                <p class="formula">
                  q(n, m) = 1 &nbsp;(n = 1, m = 1)<br>
                  q(n, m) = q(n, n) &nbsp;(n &lt; m)<br>
                  q(n, m) = 1 + q(n, n&minus;1) &nbsp;(n = m)<br>
                  q(n, m) = q(n, m&minus;1) + q(n&minus;m, m) &nbsp;(n &gt; m &gt; 1)
                </p>
          
                <p>四条的含义：① <span class="m">n = 1, m = 1</span> 是边界，只有"1"这一种；② <span class="m">n &lt; m</span> 时最大加数不可能超过 <span class="m">n</span>，直接退化成 <span class="m">q(n,n)</span>；③ <span class="m">n = m</span> 时，多出"<span class="m">n</span> 本身"这一种划分，其余是 <span class="m">q(n, n&minus;1)</span>；④ <span class="m">n &gt; m &gt; 1</span> 时分成两类 —— <b>不含 <span class="m">m</span></b> 的划分（<span class="m">q(n, m&minus;1)</span>）与<b>至少含一个 <span class="m">m</span></b> 的划分（去掉这个 <span class="m">m</span> 后，剩下 <span class="m">n&minus;m</span> 且最大加数仍不超过 <span class="m">m</span>，即 <span class="m">q(n&minus;m, m)</span>）。</p>
          
                <p>最后 <span class="m">p(n) = q(n, n)</span>。</p>
          
                <h3 id="sec-partition-h4">9.4 用 n = 6 验证</h3>
          
                <p>PPT 第 29 页把 <span class="m">q(6,4)</span> 的两类划分圈了出来：<b>含 4 的</b>（4+1+1、4+2，去掉 4 后变成 2 的划分，共 <span class="m">q(2,4) = 2</span> 种）与<b>不含 4 的</b>（3 列 + 2 列 + 1 列，共 <span class="m">q(6,3) = 7</span> 种），于是</p>
          
                <p class="formula">q(6, 4) = q(6, 3) + q(2, 4) = 7 + 2 = 9</p>
          
                <p>再往上走一层：<span class="m">p(6) = q(6,6) = 1 + q(6,5) = 1 + q(6,4) = 1 + 9 = 10</span>？不对 —— 注意 <span class="m">n = m</span> 的分支是 <span class="m">1 + q(n, n&minus;1)</span>，而 <span class="m">q(6,5) = q(6,4) + q(1,5) = 9 + 1 = 10</span>，所以 <span class="m">p(6) = 1 + 10 = 11</span>。与 9.2 节数出来的 11 种一致。</p>
          
                <h3 id="sec-partition-h5">9.5 伪代码 + C++</h3>
          
                <div class="code-pair">
                  <div class="code-col">
                    <p class="code-h">伪代码（PPT 写法）</p>
                    <pre class="code"><code>Q(n, m)                          // 最大加数不超过 m 的划分数
          1  if n = 1 or m = 1             // 边界条件：只能全写成 1
          2      then return 1             // 只有一种划分
          3  if n &lt; m                      // 最大加数不会超过 n
          4      then return Q(n, n)       // 退化为 Q(n,n)
          5  if n = m                      // 最大加数恰为 n
          6      then return 1 + Q(n, n-1) // 多出“n 本身”这一种
          7  return Q(n, m-1) + Q(n-m, m)  // 不含 m 的 + 至少含一个 m 的</code></pre>
                  </div>
                  <div class="code-col">
                    <p class="code-h">C++</p>
                    <pre class="code cpp"><code>int q(int n, int m) {                        // 最大加数不超过 m 的划分数
              if (n == 1 || m == 1) return 1;          // 边界条件：只能全写成 1
              if (n &lt; m) return q(n, n);               // n &lt; m：最大加数不可能超过 n
              if (n == m) return 1 + q(n, n - 1);      // n = m：多出“n 本身”这一种
              return q(n, m - 1) + q(n - m, m);        // 不含 m 的 + 至少含一个 m 的
          }
          
          int partitionCount(int n) {                  // 正整数 n 的划分数 p(n)
              return q(n, n);                          // p(n) = q(n, n)，返回划分数
          }
          // partitionCount(6) 返回 11，q(6,4) 返回 9</code></pre>
                  </div>
                </div>
          
                <div class="callout warn">
                  <p class="callout-h">易错：朴素递归会指数爆炸</p>
                  <p><span class="m">q(n,m)</span> 的朴素递归会重复求解大量相同的 <span class="m">(n,m)</span> 状态（<span class="m">q(6,4)</span> 展开里 <span class="m">q(3,3)</span> 出现多次），递归树指数级。不同状态只有 <span class="m">O(nm)</span> 个，加一个备忘录 (memoization) 就能把时间降到 <span class="m">O(nm)</span> —— 这正是下一页动态规划要做的事（补充说明）。</p>
                </div>
          
                <div class="callout key">
                  <p class="callout-h">考点</p>
                  <p><span class="m">q(n,m)</span> 的四条递推（尤其是 <span class="m">n &gt; m &gt; 1</span> 时"含 <span class="m">m</span> / 不含 <span class="m">m</span>"的分类）、<span class="m">p(n)=q(n,n)</span>、以及 <b>n = 6 时 p(6) = 11</b> 的完整枚举。</p>
                </div>
        ` },
      ],
    },
    {
      id: 'sec-matrix',
      heading: "10. 矩阵相乘：从 &Theta;(n3) 到 Strassen 的 &Theta;(n2.81)",
      blocks: [
        { type: 'html', html: `
          <h3 id="sec-matrix-h1">10.1 问题与标准算法</h3>
          
                <p>输入两个 <span class="m">n&times;n</span> 矩阵 <span class="m">A = [a<sub>ij</sub>]</span>、<span class="m">B = [b<sub>ij</sub>]</span>，输出 <span class="m">C = [c<sub>ij</sub>] = A&middot;B</span>，其中</p>
          
                <p class="formula">c<sub>ij</sub> = &sum;<sub>k=1..n</sub> a<sub>ik</sub> &middot; b<sub>kj</sub></p>
          
                <p>标准算法就是三重循环（PPT 第 32 页），运行时间 <span class="m">&Theta;(n<sup>3</sup>)</span>：每个 <span class="m">c<sub>ij</sub></span> 要 <span class="m">n</span> 次乘加，共 <span class="m">n<sup>2</sup></span> 个元素。</p>
          
                <div class="code-pair">
                  <div class="code-col">
                    <p class="code-h">伪代码（PPT 写法）</p>
                    <pre class="code"><code>MATRIX-MULTIPLY(A, B, C, n)      // C = A·B，三个 n×n 矩阵
          1  for i ← 1 to n                // 枚举结果矩阵的行 i
          2      do for j ← 1 to n         // 枚举结果矩阵的列 j
          3          do c_ij ← 0           // 累加器清零
          4              for k ← 1 to n    // 点积的第 k 项
          5                  do c_ij ← c_ij + a_ik·b_kj  // 累加一项
          6  return C                      // 返回结果矩阵
                                           // 运行时间 = Θ(n³)</code></pre>
                  </div>
                  <div class="code-col">
                    <p class="code-h">C++</p>
                    <pre class="code cpp"><code>const int MN = 4;                            // 矩阵阶数（示例取 4）
          
          void matMul(int A[][MN], int B[][MN], int C[][MN]) {     // 标准三重循环 C = A·B
              for (int i = 0; i &lt; MN; ++i)             // 枚举行 i
                  for (int j = 0; j &lt; MN; ++j) {       // 枚举列 j
                      C[i][j] = 0;                     // 累加器清零
                      for (int k = 0; k &lt; MN; ++k)     // 点积：k 从 0 到 MN−1
                          C[i][j] += A[i][k] * B[k][j];// 累加：c_ij += a_ik · b_kj
                  }
          }</code></pre>
                  </div>
                </div>
          
                <h3 id="sec-matrix-h2">10.2 分治：8 次子矩阵乘法，还是 &Theta;(n<sup>3</sup>)</h3>
          
                <p>把每个 <span class="m">n&times;n</span> 矩阵切成 <span class="m">2&times;2</span> 个 <span class="m">(n/2)&times;(n/2)</span> 的子矩阵（PPT 第 33 页）：</p>
          
                <p class="formula">
                  A = [a b; c d]，B = [e f; g h]，C = [r s; t u]<br>
                  r = ae + bg，s = af + bh，t = ce + dg，u = cf + dh
                </p>
          
                <svg class="fig" viewBox="0 0 960 280" role="img" aria-label="矩阵相乘的 2×2 分块：A 切成 a b c d，B 切成 e f g h，结果 C 切成 r s t u，每个子块是 (n/2)×(n/2) 的子矩阵">
                  <text x="24" y="24" class="tx-b">n×n 矩阵 = 2×2 个 (n/2)×(n/2) 子矩阵</text>
          
                  <text x="90" y="44" class="tx-sm" text-anchor="middle">A</text>
                  <rect x="40" y="50" width="140" height="140" rx="6" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.6"></rect>
                  <line x1="110" y1="50" x2="110" y2="190" stroke="var(--c-line)" stroke-width="1.6"></line>
                  <line x1="40" y1="120" x2="180" y2="120" stroke="var(--c-line)" stroke-width="1.6"></line>
                  <text x="75" y="90" class="tx tx-b" text-anchor="middle">a</text>
                  <text x="145" y="90" class="tx tx-b" text-anchor="middle">b</text>
                  <text x="75" y="160" class="tx tx-b" text-anchor="middle">c</text>
                  <text x="145" y="160" class="tx tx-b" text-anchor="middle">d</text>
          
                  <text x="205" y="125" class="tx tx-b" text-anchor="middle">·</text>
          
                  <text x="300" y="44" class="tx-sm" text-anchor="middle">B</text>
                  <rect x="230" y="50" width="140" height="140" rx="6" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.6"></rect>
                  <line x1="300" y1="50" x2="300" y2="190" stroke="var(--c-line)" stroke-width="1.6"></line>
                  <line x1="230" y1="120" x2="370" y2="120" stroke="var(--c-line)" stroke-width="1.6"></line>
                  <text x="265" y="90" class="tx tx-b" text-anchor="middle">e</text>
                  <text x="335" y="90" class="tx tx-b" text-anchor="middle">f</text>
                  <text x="265" y="160" class="tx tx-b" text-anchor="middle">g</text>
                  <text x="335" y="160" class="tx tx-b" text-anchor="middle">h</text>
          
                  <text x="400" y="125" class="tx tx-b" text-anchor="middle">=</text>
          
                  <text x="500" y="44" class="tx-sm" text-anchor="middle">C</text>
                  <rect x="430" y="50" width="140" height="140" rx="6" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="1.8"></rect>
                  <line x1="500" y1="50" x2="500" y2="190" stroke="var(--c-accent)" stroke-width="1.4"></line>
                  <line x1="430" y1="120" x2="570" y2="120" stroke="var(--c-accent)" stroke-width="1.4"></line>
                  <text x="465" y="90" class="tx tx-b" text-anchor="middle">r</text>
                  <text x="535" y="90" class="tx tx-b" text-anchor="middle">s</text>
                  <text x="465" y="160" class="tx tx-b" text-anchor="middle">t</text>
                  <text x="535" y="160" class="tx tx-b" text-anchor="middle">u</text>
          
                  <text x="600" y="76" class="tx-sm">r = ae + bg，s = af + bh</text>
                  <text x="600" y="106" class="tx-sm">t = ce + dg，u = cf + dh</text>
                  <text x="600" y="142" class="tx-sm">8 个 (n/2)×(n/2) 子矩阵相乘</text>
                  <text x="600" y="170" class="tx-sm">4 个 (n/2)×(n/2) 子矩阵相加</text>
                  <text x="600" y="206" class="tx-sm">T(n) = 8T(n/2) + Θ(n²)</text>
                  <text x="600" y="234" class="tx-sm">n^(log₂8) = n³ ⇒ Θ(n³)</text>
          
                  <text x="24" y="232" class="tx-sm">子块大小 n/2，递归 8 次；</text>
                  <text x="24" y="256" class="tx-sm">子矩阵加法共 4 次，代价 Θ(n²)</text>
                </svg>
                <p class="fig-cap">图 5 &nbsp;矩阵的 <span class="m">2&times;2</span> 分块：8 次递归乘法 + 4 次子矩阵加法</p>
          
                <p>递归式 <span class="m">T(n) = 8T(n/2) + &Theta;(n<sup>2</sup>)</span>：<span class="m">a=8</span>、<span class="m">b=2</span>，<span class="m">n<sup>log<sub>2</sub>8</sup> = n<sup>3</sup></span>，而 <span class="m">f(n) = &Theta;(n<sup>2</sup>) = O(n<sup>3&minus;&epsilon;</sup>)</span> &rArr; 情况 1 &rArr; <span class="m">T(n) = &Theta;(n<sup>3</sup>)</span>。<b>比普通算法没有任何改进</b> —— PPT 的原话就是这句。</p>
          
                <h3 id="sec-matrix-h3">10.3 Strassen：用 7 个递归乘换掉 1 次乘法</h3>
          
                <p>Strassen 的关键观察：<span class="m">2&times;2</span> 分块相乘本来要 8 次乘法，但如果允许<b>先做加减再乘</b>，7 次乘法就够了（PPT 第 35 页）：</p>
          
                <p class="formula">
                  P<sub>1</sub> = a&middot;(f&minus;h) &nbsp;&nbsp; P<sub>2</sub> = (a+b)&middot;h &nbsp;&nbsp; P<sub>3</sub> = (c+d)&middot;e &nbsp;&nbsp; P<sub>4</sub> = d&middot;(g&minus;e)<br>
                  P<sub>5</sub> = (a+d)&middot;(e+h) &nbsp;&nbsp; P<sub>6</sub> = (b&minus;d)&middot;(g+h) &nbsp;&nbsp; P<sub>7</sub> = (a&minus;c)&middot;(e+f)<br>
                  r = P<sub>5</sub> + P<sub>4</sub> &minus; P<sub>2</sub> + P<sub>6</sub> &nbsp;&nbsp; s = P<sub>1</sub> + P<sub>2</sub><br>
                  t = P<sub>3</sub> + P<sub>4</sub> &nbsp;&nbsp; u = P<sub>5</sub> + P<sub>1</sub> &minus; P<sub>3</sub> &minus; P<sub>7</sub>
                </p>
          
                <p>合计 <b>7 次乘法、18 次加/减</b>。数一遍加法：7 个 <span class="m">P</span> 里做加减共 10 次（P<sub>1</sub> 的 <span class="m">f&minus;h</span>、P<sub>2</sub> 的 <span class="m">a+b</span>、P<sub>3</sub> 的 <span class="m">c+d</span>、P<sub>4</sub> 的 <span class="m">g&minus;e</span>、P<sub>5</sub> 的 <span class="m">a+d</span> 与 <span class="m">e+h</span>、P<sub>6</sub> 的 <span class="m">b&minus;d</span> 与 <span class="m">g+h</span>、P<sub>7</sub> 的 <span class="m">a&minus;c</span> 与 <span class="m">e+f</span>），拼装 <span class="m">r,s,t,u</span> 再用 8 次（r 用 3 次、s 用 1 次、t 用 1 次、u 用 3 次）。</p>
          
                <p>PPT 特别提醒：这套公式<b>不依赖于乘法的交换性</b> —— 因为子块是矩阵而不是数，矩阵乘法本来就不满足交换律。所以把 <span class="m">a,b,&hellip;,h</span> 换成 <span class="m">(n/2)&times;(n/2)</span> 的子矩阵、把数的加减换成子矩阵的加减，公式依然成立。</p>
          
                <h3 id="sec-matrix-h4">10.4 验证 r = P<sub>5</sub> + P<sub>4</sub> &minus; P<sub>2</sub> + P<sub>6</sub> = ae + bg</h3>
          
                <p>PPT 第 36 页把这四项逐项展开相加，正好把多余项消干净：</p>
          
                <p class="formula">
                  r = (a+d)(e+h) + d(g&minus;e) &minus; (a+b)h + (b&minus;d)(g+h)<br>
                  &nbsp; = [ae + ah + de + dh] + [dg &minus; de] &minus; [ah + bh] + [bg + bh &minus; dg &minus; dh]<br>
                  &nbsp; = ae + bg
                </p>
          
                <p>核对的窍门：<span class="m">ah</span> 一正一负抵消、<span class="m">de</span> 一正一负抵消、<span class="m">dh</span> 一正一负抵消、<span class="m">bh</span> 一正一负抵消、<span class="m">dg</span> 一正一负抵消，最后只剩 <span class="m">ae</span> 和 <span class="m">bg</span>。同理可验证 <span class="m">s = af+bh</span>、<span class="m">t = ce+dg</span>、<span class="m">u = cf+dh</span>。</p>
          
                <h3 id="sec-matrix-h5">10.5 复杂度：&Theta;(n<sup>lg 7</sup>) &asymp; &Theta;(n<sup>2.81</sup>)</h3>
          
                <p>把 8 次递归乘换成 7 次，递归式就变成</p>
          
                <p class="formula">T(n) = 7T(n/2) + &Theta;(n<sup>2</sup>) &rArr; n<sup>log<sub>2</sub>7</sup> &asymp; n<sup>2.81</sup> &rArr; T(n) = &Theta;(n<sup>lg 7</sup>)</p>
          
                <p>套主方法：<span class="m">a=7</span>、<span class="m">b=2</span>，<span class="m">n<sup>log<sub>2</sub>7</sup> &asymp; n<sup>2.81</sup></span>，而 <span class="m">f(n)=&Theta;(n<sup>2</sup>) = O(n<sup>2.81&minus;&epsilon;</sup>)</span> &rArr; 情况 1 &rArr; <span class="m">T(n) = &Theta;(n<sup>lg 7</sup>)</span>。</p>
          
                <p>PPT 的评论值得记住：<b>"2.81 看起来和 3 差别不大，但是因为区别是在指数项，所以对运行时间的影响是很明显的。"</b>实际上 Strassen 算法在今天普通的计算机上运行时，在 <b><span class="m">n &ge; 32</span></b> 时超过普通算法。至今为止最好的（仅仅是理论上）是 <span class="m">&Theta;(n<sup>2.376&hellip;</sup>)</span>。</p>
          
                <h3 id="sec-matrix-h6">10.6 Strassen 的 2&times;2 核心：伪代码 + C++</h3>
          
                <div class="code-pair">
                  <div class="code-col">
                    <p class="code-h">伪代码（PPT 原式）</p>
                    <pre class="code"><code>STRASSEN-2x2(A, B)               // A=[[a,b],[c,d]]，B=[[e,f],[g,h]]
          1  P1 ← a·(f−h)                  // 7 次乘法之一
          2  P2 ← (a+b)·h                  // 7 次乘法之二
          3  P3 ← (c+d)·e                  // 7 次乘法之三
          4  P4 ← d·(g−e)                  // 7 次乘法之四
          5  P5 ← (a+d)·(e+h)              // 7 次乘法之五
          6  P6 ← (b−d)·(g+h)              // 7 次乘法之六
          7  P7 ← (a−c)·(e+f)              // 7 次乘法之七
          8  r ← P5+P4−P2+P6               // 组装 r：结果等于 ae+bg
          9  s ← P1+P2                     // 组装 s：结果等于 af+bh
          10 t ← P3+P4                     // 组装 t：结果等于 ce+dg
          11 u ← P5+P1−P3−P7               // 组装 u：结果等于 cf+dh
          12 return [[r,s],[t,u]]          // 拼回 2×2 结果</code></pre>
                  </div>
                  <div class="code-col">
                    <p class="code-h">C++（2&times;2 核心，递归版把标量换成子块）</p>
                    <pre class="code cpp"><code>void strassen2(int A[2][2], int B[2][2], int C[2][2]) {  // 2×2 分块：7 次乘法
              int a = A[0][0], b = A[0][1], c = A[1][0], d = A[1][1];  // A 的四个子块
              int e = B[0][0], f = B[0][1], g = B[1][0], h = B[1][1];  // B 的四个子块
              int P1 = a * (f - h);                    // 第 1 次乘法：P1 = a·(f−h)
              int P2 = (a + b) * h;                    // 第 2 次乘法：P2 = (a+b)·h
              int P3 = (c + d) * e;                    // 第 3 次乘法：P3 = (c+d)·e
              int P4 = d * (g - e);                    // 第 4 次乘法：P4 = d·(g−e)
              int P5 = (a + d) * (e + h);              // 第 5 次乘法：P5 = (a+d)·(e+h)
              int P6 = (b - d) * (g + h);              // 第 6 次乘法：P6 = (b−d)·(g+h)
              int P7 = (a - c) * (e + f);              // 第 7 次乘法：P7 = (a−c)·(e+f)
              C[0][0] = P5 + P4 - P2 + P6;             // 组装 r = ae+bg（PPT 重点验证的一项）
              C[0][1] = P1 + P2;                       // 组装 s = af+bh
              C[1][0] = P3 + P4;                       // 组装 t = ce+dg
              C[1][1] = P5 + P1 - P3 - P7;             // 组装 u = cf+dh
          }
          // 递归版：a..h 换成 (n/2)×(n/2) 子矩阵，7 个 P 变成 7 次递归调用</code></pre>
                  </div>
                </div>
          
                <div class="callout key">
                  <p class="callout-h">考点</p>
                  <p>① 标准算法 <span class="m">&Theta;(n<sup>3</sup>)</span>；② 分治 <span class="m">8T(n/2)+&Theta;(n<sup>2</sup>)=&Theta;(n<sup>3</sup>)</span>，<b>没有改进</b>；③ Strassen 的 7 个 <span class="m">P</span> 与 4 个结果式、<b>7 乘 18 加减</b>、不依赖交换性；④ <span class="m">7T(n/2)+&Theta;(n<sup>2</sup>)=&Theta;(n<sup>lg7</sup>)&asymp;&Theta;(n<sup>2.81</sup>)</span>；⑤ <span class="m">n &ge; 32</span> 时超过普通算法，理论最好 <span class="m">&Theta;(n<sup>2.376</sup>)</span>。</p>
                </div>
        ` },
      ],
    },
    {
      id: 'sec-vlsi',
      heading: "11. VLSI 布局：从 &Theta;(n lg n) 到 &Theta;(n)",
      blocks: [
        { type: 'html', html: `
          <h3 id="sec-vlsi-h1">11.1 问题描述</h3>
          
                <p>PPT 第 39 页：用<b>最小的面积</b>将一棵有 <span class="m">n</span> 个叶子的<b>完全二叉树</b>嵌入网格 (grid)。VLSI 是 Very Large Scale Integration（超大规模集成电路）的缩写 —— 芯片上布线要占面积，线越短、越紧凑，芯片越小、越快。</p>
          
                <p>规则：树的每个节点占一个格点，每条边走水平或垂直的网格线段，边之间不能交叉。布局的<b>面积</b> = 包围整个布局的矩形面积 = 宽 <span class="m">&times;</span> 高。</p>
          
                <h3 id="sec-vlsi-h2">11.2 朴素布局：宽 &Theta;(n)、高 &Theta;(lg n)</h3>
          
                <p>最直接的做法是递归地摆：把左右两棵子树各摆一份，再把两个根用一条水平线连起来。于是</p>
          
                <p class="formula">W(n) = 2W(n/2) + &Theta;(1) = &Theta;(n)；&nbsp;&nbsp; H(n) = H(n/2) + &Theta;(1) = &Theta;(lg n)</p>
          
                <p>套主方法：<span class="m">W</span> 的 <span class="m">a=2, b=2</span>，<span class="m">n<sup>log<sub>2</sub>2</sup>=n</span> 而 <span class="m">f(n)=&Theta;(1)=O(n<sup>1&minus;&epsilon;</sup>)</span> &rArr; 情况 1 &rArr; <span class="m">&Theta;(n)</span>；<span class="m">H</span> 的 <span class="m">a=1, b=2</span>，<span class="m">n<sup>0</sup>=1=&Theta;(f(n))</span> &rArr; 情况 2 &rArr; <span class="m">&Theta;(lg n)</span>。所以</p>
          
                <p class="formula">面积 = W(n) &times; H(n) = &Theta;(n) &times; &Theta;(lg n) = &Theta;(n lg n)</p>
          
                <h3 id="sec-vlsi-h3">11.3 H-树布局：边长 &Theta;(&radic;n)、面积 &Theta;(n)</h3>
          
                <p>PPT 第 40 页给出更好的方案：把 <span class="m">n</span> 个叶子分成 <b>4 组</b>、每组 <span class="m">n/4</span> 个，放在一个"H"形线段的四个端点外侧；每个端点再递归放一个更小的 H。设 <span class="m">L(n)</span> 为整个布局的边长，则</p>
          
                <p class="formula">L(n) = 2L(n/4) + &Theta;(1) &rArr; L(n) = &Theta;(&radic;n) &rArr; 面积 = L(n)<sup>2</sup> = &Theta;(n)</p>
          
                <p>套主方法：<span class="m">a=2</span>、<span class="m">b=4</span>，<span class="m">n<sup>log<sub>4</sub>2</sup> = n<sup>1/2</sup> = &radic;n</span>，而 <span class="m">f(n)=&Theta;(1)=O(n<sup>1/2&minus;&epsilon;</sup>)</span> &rArr; 情况 1 &rArr; <span class="m">&Theta;(&radic;n)</span>。边长是 <span class="m">&radic;n</span>，面积就是 <span class="m">n</span> —— <b>比朴素布局省了一个 <span class="m">lg n</span> 因子</b>。</p>
          
                <svg class="fig" viewBox="0 0 960 340" role="img" aria-label="VLSI 布局对比：左边朴素布局很宽很矮，面积 Θ(n lg n)；右边 H-树布局是正方形，边长 Θ(根号 n)，面积 Θ(n)">
                  <text x="24" y="24" class="tx-b">同是 n 个叶子：朴素布局 Θ(n lg n)，H-树 Θ(n)</text>
          
                  <!-- 左：朴素 -->
                  <text x="30" y="52" class="tx-sm">朴素布局：宽 Θ(n)、高 Θ(lg n)</text>
                  <rect x="30" y="62" width="470" height="170" rx="6" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.2" stroke-dasharray="6 4"></rect>
                  <text x="265" y="84" class="tx-sm" text-anchor="middle">W(n) = 2W(n/2) + Θ(1) = Θ(n)</text>
                  <line x1="60" y1="120" x2="470" y2="120" stroke="var(--c-ink)" stroke-width="3"></line>
                  <line x1="60" y1="120" x2="60" y2="200" stroke="var(--c-ink)" stroke-width="3"></line>
                  <line x1="111" y1="120" x2="111" y2="200" stroke="var(--c-ink)" stroke-width="3"></line>
                  <line x1="162" y1="120" x2="162" y2="200" stroke="var(--c-ink)" stroke-width="3"></line>
                  <line x1="213" y1="120" x2="213" y2="200" stroke="var(--c-ink)" stroke-width="3"></line>
                  <line x1="264" y1="120" x2="264" y2="200" stroke="var(--c-ink)" stroke-width="3"></line>
                  <line x1="315" y1="120" x2="315" y2="200" stroke="var(--c-ink)" stroke-width="3"></line>
                  <line x1="366" y1="120" x2="366" y2="200" stroke="var(--c-ink)" stroke-width="3"></line>
                  <line x1="417" y1="120" x2="417" y2="200" stroke="var(--c-ink)" stroke-width="3"></line>
                  <line x1="470" y1="120" x2="470" y2="200" stroke="var(--c-ink)" stroke-width="3"></line>
                  <rect x="55" y="196" width="10" height="10" fill="var(--c-hot)"></rect>
                  <rect x="106" y="196" width="10" height="10" fill="var(--c-hot)"></rect>
                  <rect x="157" y="196" width="10" height="10" fill="var(--c-hot)"></rect>
                  <rect x="208" y="196" width="10" height="10" fill="var(--c-hot)"></rect>
                  <rect x="259" y="196" width="10" height="10" fill="var(--c-hot)"></rect>
                  <rect x="310" y="196" width="10" height="10" fill="var(--c-hot)"></rect>
                  <rect x="361" y="196" width="10" height="10" fill="var(--c-hot)"></rect>
                  <rect x="412" y="196" width="10" height="10" fill="var(--c-hot)"></rect>
                  <rect x="465" y="196" width="10" height="10" fill="var(--c-hot)"></rect>
                  <text x="30" y="256" class="tx-sm">高 H(n) = H(n/2) + Θ(1) = Θ(lg n)</text>
                  <text x="30" y="280" class="tx">面积 = Θ(n) · Θ(lg n) = Θ(n lg n)</text>
          
                  <!-- 右：H 树 -->
                  <text x="540" y="52" class="tx-sm">H-树：边长 L(n) = Θ(√n)</text>
                  <rect x="560" y="62" width="230" height="230" rx="6" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.2" stroke-dasharray="6 4"></rect>
                  <line x1="610" y1="177" x2="740" y2="177" stroke="var(--c-ink)" stroke-width="3"></line>
                  <line x1="610" y1="117" x2="610" y2="237" stroke="var(--c-ink)" stroke-width="3"></line>
                  <line x1="740" y1="117" x2="740" y2="237" stroke="var(--c-ink)" stroke-width="3"></line>
                  <line x1="585" y1="117" x2="635" y2="117" stroke="var(--c-ink)" stroke-width="3"></line>
                  <line x1="585" y1="237" x2="635" y2="237" stroke="var(--c-ink)" stroke-width="3"></line>
                  <line x1="715" y1="117" x2="765" y2="117" stroke="var(--c-ink)" stroke-width="3"></line>
                  <line x1="715" y1="237" x2="765" y2="237" stroke="var(--c-ink)" stroke-width="3"></line>
                  <line x1="585" y1="100" x2="585" y2="134" stroke="var(--c-ink)" stroke-width="3"></line>
                  <line x1="765" y1="100" x2="765" y2="134" stroke="var(--c-ink)" stroke-width="3"></line>
                  <line x1="585" y1="220" x2="585" y2="254" stroke="var(--c-ink)" stroke-width="3"></line>
                  <line x1="765" y1="220" x2="765" y2="254" stroke="var(--c-ink)" stroke-width="3"></line>
                  <rect x="580" y="96" width="10" height="10" fill="var(--c-ok)"></rect>
                  <rect x="760" y="96" width="10" height="10" fill="var(--c-ok)"></rect>
                  <rect x="580" y="250" width="10" height="10" fill="var(--c-ok)"></rect>
                  <rect x="760" y="250" width="10" height="10" fill="var(--c-ok)"></rect>
                  <rect x="670" y="172" width="10" height="10" fill="var(--c-accent)"></rect>
                  <text x="675" y="160" class="tx-sm" text-anchor="middle">H</text>
                  <text x="540" y="256" class="tx-sm">L(n) = 2L(n/4) + Θ(1) = Θ(√n)</text>
                  <text x="540" y="280" class="tx">面积 = L(n)² = Θ(n)</text>
          
                  <text x="24" y="322" class="tx-sm">分治把“高度”摊到宽、高两个方向：朴素布局高度只有 lg n 却宽 n；H-树让宽高都变成 √n，面积从 n lg n 降到 n</text>
                </svg>
                <p class="fig-cap">图 6 &nbsp;两种布局的面积对比：朴素 <span class="m">&Theta;(n lg n)</span>，H-树 <span class="m">&Theta;(n)</span></p>
          
                <table class="tbl">
                  <thead><tr><th>布局</th><th>主要递归式</th><th>宽 / 边长</th><th>高</th><th>面积</th></tr></thead>
                  <tbody>
                    <tr><td>朴素布局</td><td class="num">W(n)=2W(n/2)+&Theta;(1)</td><td class="num">&Theta;(n)</td><td class="num">&Theta;(lg n)</td><td class="num">&Theta;(n lg n)</td></tr>
                    <tr><td>H-树嵌入</td><td class="num">L(n)=2L(n/4)+&Theta;(1)</td><td class="num">&Theta;(&radic;n)</td><td class="num">&Theta;(&radic;n)</td><td class="num">&Theta;(n)</td></tr>
                  </tbody>
                </table>
          
                <div class="callout key">
                  <p class="callout-h">考点</p>
                  <p>两个递归式 <span class="m">H(n)=H(n/2)+&Theta;(1)</span> 与 <span class="m">W(n)=2W(n/2)+&Theta;(1)</span> 的解（<span class="m">&Theta;(lg n)</span> 与 <span class="m">&Theta;(n)</span>）、面积 <span class="m">&Theta;(n lg n)</span>；H-树的 <span class="m">L(n)=2L(n/4)+&Theta;(1)=&Theta;(&radic;n)</span>、面积 <span class="m">&Theta;(n)</span>。注意 H-树的关键是 <b>分成 4 组、每组 n/4</b>，所以 <span class="m">b = 4</span> 而不是 2。</p>
                </div>
        ` },
      ],
    },
    {
      id: 'sec-think',
      heading: "12. 课堂思考与结论",
      blocks: [
        { type: 'html', html: `
          <h3 id="sec-think-h1">12.1 求解四个递归式</h3>
          
                <p>PPT 第 42 页的第 1 题给了四个递归式，都用主方法解。先把每个的 <span class="m">a</span>、<span class="m">b</span>、<span class="m">n<sup>log<sub>b</sub>a</sup></span> 与 <span class="m">f(n)</span> 列出来，再判断落在哪种情况：</p>
          
                <table class="tbl">
                  <thead><tr><th>递归式</th><th class="num">a</th><th class="num">b</th><th class="num">n<sup>log<sub>b</sub>a</sup></th><th>f(n) 与分水岭比较</th><th>结论</th></tr></thead>
                  <tbody>
                    <tr><td>a. T(n) = 2T(n/4) + 1</td><td class="num">2</td><td class="num">4</td><td class="num">&radic;n</td><td>f(n) = 1 = O(n<sup>1/2&minus;&epsilon;</sup>) &rArr; 情况 1</td><td><b>&Theta;(&radic;n)</b></td></tr>
                    <tr><td>b. T(n) = 2T(n/4) + n</td><td class="num">2</td><td class="num">4</td><td class="num">&radic;n</td><td>f(n) = n = &Omega;(n<sup>1/2+&epsilon;</sup>)，且 2&middot;(n/4) = n/2 &le; (1/2)n &rArr; 情况 3</td><td><b>&Theta;(n)</b></td></tr>
                    <tr><td>c. T(n) = T(n/2) + &Theta;(1)</td><td class="num">1</td><td class="num">2</td><td class="num">1</td><td>f(n) = &Theta;(1) 与 1 同阶 &rArr; 情况 2</td><td><b>&Theta;(lg n)</b></td></tr>
                    <tr><td>d. T(n) = 2T(n/4) + n<sup>2</sup></td><td class="num">2</td><td class="num">4</td><td class="num">&radic;n</td><td>f(n) = n<sup>2</sup> = &Omega;(n<sup>1/2+&epsilon;</sup>)，且 2&middot;(n/4)<sup>2</sup> = n<sup>2</sup>/8 &le; (1/8)n<sup>2</sup> &rArr; 情况 3</td><td><b>&Theta;(n<sup>2</sup>)</b></td></tr>
                  </tbody>
                </table>
          
                <p>四个式子的 <span class="m">a</span>、<span class="m">b</span> 几乎一样（只有 c 是 <span class="m">a=1</span>），结果却从 <span class="m">&radic;n</span> 一路跳到 <span class="m">n<sup>2</sup></span> —— 差别全在 <span class="m">f(n)</span> 与分水岭 <span class="m">n<sup>log<sub>b</sub>a</sup> = &radic;n</span> 的大小关系上。这正是主方法"比较三个量"的直观体现。</p>
          
                <h3 id="sec-think-h2">12.2 Hanoi 塔问题（问答）</h3>
          
                <p>题目两问：<b>（1）设计算法移动这些碟子，给出算法基本思想和伪代码；（2）假定单位时间内可以移动一片碟子，那么最终移动这些碟子到目的柱子需要多长时间。</b></p>
          
                <p><b>（1）基本思想</b>：分治。<span class="m">n</span> 个盘从 A 搬到 C 分三步 —— ① 把上面 <span class="m">n&minus;1</span> 个盘从 A 搬到 B（C 作辅助）；② 把最大的第 <span class="m">n</span> 个盘从 A 搬到 C；③ 把 B 上的 <span class="m">n&minus;1</span> 个盘搬到 C（A 作辅助）。伪代码即 5.4 节的 <code>HANOI(n, A, B, C)</code>，边界条件是 <span class="m">n = 0</span> 直接返回。</p>
          
                <p><b>（2）需要多长时间</b>：<span class="m">T(n) = 2T(n&minus;1) + 1</span>，<span class="m">T(1) = 1</span>，解得 <span class="m">T(n) = 2<sup>n</sup> &minus; 1</span>。若单位时间搬一个盘子，总时间就是 <span class="m">2<sup>n</sup> &minus; 1</span> 个单位时间。以 <span class="m">n = 64</span> 为例：<span class="m">2<sup>64</sup>&minus;1 &asymp; 1.8446744&times;10<sup>19</sup></span>，按每秒一个算约 <b>5849 亿年</b>（PPT 记作"5000 亿年"）。</p>
          
                <h3 id="sec-think-h3">12.3 结论（PPT 第 41 页）</h3>
          
                <div class="callout key">
                  <p class="callout-h">三句话总结整讲</p>
                  <p>① 分而治之仅仅是算法设计中强大的设计技术<b>之一</b>（还有动态规划、贪心、回溯、分支限界&hellip;）；<br>
                  ② 分而治之算法可以用<b>递归</b>和<b>主方法</b>进行分析；<br>
                  ③ 它能得到<b>更加高效</b>的算法（Strassen 的 <span class="m">n<sup>2.81</sup></span>、H-树的 <span class="m">&Theta;(n)</span> 都是例子）。</p>
                </div>
          
                <div class="callout tip">
                  <p class="callout-h">记忆</p>
                  <p>四个递归式的答案记成"<b>根号、一次、对数、平方</b>"：<span class="m">&radic;n &rarr; n &rarr; lg n &rarr; n<sup>2</sup></span>。判断口诀：<b>谁大听谁的，相等乘个 lg</b> —— <span class="m">f(n)</span> 小就是叶子赢（情况 1），<span class="m">f(n)</span> 大就是根赢（情况 3），一样大就乘 <span class="m">lg n</span>（情况 2）。</p>
                </div>
        ` },
      ],
    },
    {
      id: 'sec-summary',
      heading: "13. 小结速记",
      blocks: [
        { type: 'html', html: `
          <h3 id="sec-summary-h1">13.1 全讲对照表</h3>
          
                <table class="tbl">
                  <thead><tr><th>例子</th><th>递归式</th><th>解</th><th>关键点</th></tr></thead>
                  <tbody>
                    <tr><td>求幂 <span class="m">x<sup>n</sup></span></td><td class="num">T(n) = T(n/2) + &Theta;(1)</td><td class="num">&Theta;(lg n)</td><td>n=20 时 19 次 &rarr; 5 次；中间结果只算一次</td></tr>
                    <tr><td>Hanoi 塔</td><td class="num">T(n) = 2T(n&minus;1) + 1</td><td class="num">2<sup>n</sup> &minus; 1</td><td>n=3 是 7 次；n=64 约 1.84&times;10<sup>19</sup> 次</td></tr>
                    <tr><td>归并排序</td><td class="num">T(n) = 2T(n/2) + &Theta;(n)</td><td class="num">&Theta;(n lg n)</td><td>分解显而易见、合并线性</td></tr>
                    <tr><td>二分查找</td><td class="num">T(n) = T(n/2) + &Theta;(1)</td><td class="num">&Theta;(lg n)</td><td>只递归一边；7 个元素查 3 次</td></tr>
                    <tr><td>硬币问题</td><td class="num">T(n) = T(n/3) + &Theta;(1)</td><td class="num">&lceil;log<sub>3</sub> n&rceil; 次</td><td>天平 3 种结果 &rArr; 三分最优</td></tr>
                    <tr><td>整数划分</td><td class="num">q(n,m)=q(n,m&minus;1)+q(n&minus;m,m)</td><td class="num">p(6) = 11</td><td>两个参数；朴素递归指数，可加备忘录</td></tr>
                    <tr><td>矩阵相乘（标准）</td><td>三重循环</td><td>&Theta;(n<sup>3</sup>)</td><td><span class="m">c<sub>ij</sub> = &sum; a<sub>ik</sub>b<sub>kj</sub></span></td></tr>
                    <tr><td>矩阵相乘（分治）</td><td class="num">T(n) = 8T(n/2) + &Theta;(n<sup>2</sup>)</td><td class="num">&Theta;(n<sup>3</sup>)</td><td>没有改进</td></tr>
                    <tr><td>矩阵相乘（Strassen）</td><td class="num">T(n) = 7T(n/2) + &Theta;(n<sup>2</sup>)</td><td class="num">&Theta;(n<sup>lg7</sup>)&asymp;&Theta;(n<sup>2.81</sup>)</td><td>7 乘 18 加减；n &ge; 32 超过普通算法</td></tr>
                    <tr><td>VLSI（朴素）</td><td class="num">W=2W(n/2)+&Theta;(1)，H=H(n/2)+&Theta;(1)</td><td class="num">面积 &Theta;(n lg n)</td><td>宽 n、高 lg n</td></tr>
                    <tr><td>VLSI（H-树）</td><td class="num">L(n) = 2L(n/4) + &Theta;(1)</td><td class="num">面积 &Theta;(n)</td><td>边长 &radic;n，分成 4 组</td></tr>
                  </tbody>
                </table>
          
                <h3 id="sec-summary-h2">13.2 三句话背完这一讲</h3>
          
                <div class="callout key">
                  <p class="callout-h">必背</p>
                  <p>① <b>递归两要素</b>：边界条件 + 递归方程；<b>优缺点</b>：简明 / 易证 / 有力工具，效率低 / 费堆栈。<br>
                  ② <b>分治四条件</b>：可分解、子问题独立（无公共子问题）、规模小到好解、解可合并；<b>三步骤</b>：分解 Divide &rarr; 求解 Conquer（递归）&rarr; 合并 Combine；<b>通用递归式</b> <span class="m">T(n)=aT(n/b)+f(n)</span>。<br>
                  ③ <b>九个结论</b>：<span class="m">x<sup>20</sup></span> 5 次乘法、Hanoi <span class="m">2<sup>n</sup>&minus;1</span>、归并 <span class="m">&Theta;(n lg n)</span>、二分 <span class="m">&Theta;(lg n)</span>、硬币 <span class="m">&lceil;log<sub>3</sub>n&rceil;</span>、<span class="m">p(6)=11</span>、矩阵 <span class="m">&Theta;(n<sup>3</sup>)</span>、Strassen <span class="m">&Theta;(n<sup>2.81</sup>)</span>、VLSI <span class="m">&Theta;(n lg n)&rarr;&Theta;(n)</span>。</p>
                </div>
          
                <div class="callout tip">
                  <p class="callout-h">与相邻章节的关系</p>
                  <p>本讲的分治是<a href="deck3.html">L2 · 算法分析基础</a>里主方法的应用演练；二分查找与<a href="deck4.html">L3 · 线性时间排序</a>的决策树下界互为印证；而"子问题重叠时不能再用分治"这条界线，就是<a href="deck7.html">L6 · 动态规划</a>的起点（整数划分与矩阵链乘法都会在那里用表格重做一遍）。</p>
                </div>
        ` },
      ],
    },
  ],
};

export default deck;
