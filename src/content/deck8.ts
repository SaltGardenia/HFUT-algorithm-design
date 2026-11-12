/* 由 scripts/migrate.mjs 自动生成 —— 内容事实源，手工修改后请勿重跑迁移覆盖 */
import type { DeckData } from './types';

const deck: DeckData = {
  id: 'deck8',
  no: "",
  title: "L7 · 贪心法",
  subtitle: "第 8 讲 · 贪心法",
  lede: `
  贪心法 (greedy algorithm) 的诱人之处是「每一步都做当前看起来最好的选择，且永不反悔」；危险之处也在这里 —— <b>局部的贪心凭什么等于全局的最优？</b>本讲先用最小生成树（MST）把这个问题彻底讲清：<b>最优子结构</b>（optimal substructure）+ <b>贪心选择特性</b>（greedy-choice property）两个定理加上剪切粘贴（cut &amp; paste）证明，才使 Prim 算法（MST 权值 <span class="m">53</span>）站得住脚。随后用四个案例检验这把刀：Prim、活动选择、哈夫曼编码、分数背包都能切，而<b>顶点覆盖</b>（NP 完全）与 <b>0-1 背包</b>会崩刃 —— 后者恰好是动态规划的战场。
`,
  toc: [
    { id: 'sec-overview', text: "1. 本讲地图：贪心法与它的三个追问", level: 2 },
    { id: 'sec-mst', text: "2. 最小生成树：定义、算例与应用", level: 2 },
    { id: 'sec-mst-h1', text: "2.1 问题定义", level: 3 },
    { id: 'sec-mst-h2', text: "2.2 PPT 的算例：8 个顶点、10 条边", level: 3 },
    { id: 'sec-mst-h3', text: "2.3 暴力求解有多慢？", level: 3 },
    { id: 'sec-mst-theory', text: "3. 两大定理：最优子结构与贪心选择", level: 2 },
    { id: 'sec-mst-theory-h1', text: "3.1 最优子结构（PPT 第 5–6 页）", level: 3 },
    { id: 'sec-mst-theory-h2', text: "3.2 有没有重叠子问题？能不能用 DP？（PPT 第 6 页）", level: 3 },
    { id: 'sec-mst-theory-h3', text: "3.3 贪心选择定理（PPT 第 7 页）", level: 3 },
    { id: 'sec-prim', text: "4. Prim 算法：用优先队列扩张集合 A", level: 2 },
    { id: 'sec-prim-h1', text: "4.1 算法思路", level: 3 },
    { id: 'sec-prim-h2', text: "4.2 伪代码 + C++", level: 3 },
    { id: 'sec-prim-h3', text: "4.3 逐帧动画：跟着 PPT 第 13–25 页走一遍", level: 3 },
    { id: 'sec-prim-h4', text: "4.4 复杂度与正确性", level: 3 },
    { id: 'sec-elements', text: "5. 贪心策略中的要素、与 DP 的对比、以及一次失败", level: 2 },
    { id: 'sec-elements-h1', text: "5.1 两个要素（PPT 第 26 / 29 页）", level: 3 },
    { id: 'sec-elements-h2', text: "5.2 与动态规划的对比", level: 3 },
    { id: 'sec-elements-h3', text: "5.3 反例一：顶点覆盖（PPT 第 28 页）", level: 3 },
    { id: 'sec-activity', text: "6. 活动选择问题：选结束最早的那个", level: 2 },
    { id: 'sec-activity-h1', text: "6.1 问题定义", level: 3 },
    { id: 'sec-activity-h2', text: "6.2 最优子结构与递归解（PPT 第 31–32 页）", level: 3 },
    { id: 'sec-activity-h3', text: "6.3 贪心选择：选结束最早的活动（PPT 第 33–34 页）", level: 3 },
    { id: 'sec-activity-h4', text: "6.4 递归版与迭代版", level: 3 },
    { id: 'sec-activity-h5', text: "6.5 动画与逐步推演", level: 3 },
    { id: 'sec-activity-h6', text: "6.6 复杂度", level: 3 },
    { id: 'sec-huffman', text: "7. 哈夫曼编码：让高频字符拿到短码字", level: 2 },
    { id: 'sec-huffman-h1', text: "7.1 从定长码到变长码（PPT 第 37 页）", level: 3 },
    { id: 'sec-huffman-h2', text: "7.2 前缀码与二叉树", level: 3 },
    { id: 'sec-huffman-h3', text: "7.3 编码费用与设计目标（PPT 第 39 页）", level: 3 },
    { id: 'sec-huffman-h4', text: "7.4 构造过程：每次合并最小的两个（PPT 第 40 页）", level: 3 },
    { id: 'sec-huffman-h5', text: "7.5 HUFFMAN 伪代码 + C++", level: 3 },
    { id: 'sec-huffman-h6', text: "7.6 动画：7 次合并长成一棵树", level: 3 },
    { id: 'sec-huffman-h7', text: "7.7 贪心选择与最优子结构（PPT 第 42–43 页）", level: 3 },
    { id: 'sec-huffman-h8', text: "7.8 课堂练习：求最优前缀码与平均码长", level: 3 },
    { id: 'sec-huffman-h9', text: "7.9 复杂度", level: 3 },
    { id: 'sec-knapsack', text: "8. 分数背包与 0-1 背包：贪心的一成一败", level: 2 },
    { id: 'sec-knapsack-h1', text: "8.1 问题（PPT 第 44 页）", level: 3 },
    { id: 'sec-knapsack-h2', text: "8.2 分数背包：有贪心选择特性", level: 3 },
    { id: 'sec-knapsack-h3', text: "8.3 0-1 背包：没有贪心选择特性", level: 3 },
    { id: 'sec-summary', text: "9. 小结：贪心的适用条件与四个成功案例", level: 2 },
    { id: 'sec-summary-h1', text: "9.1 一张表看全本讲", level: 3 },
    { id: 'sec-summary-h2', text: "9.2 设计一个贪心算法的三步法", level: 3 },
    { id: 'sec-summary-h3', text: "9.3 高频考点清单", level: 3 },
    { id: 'sec-quiz', text: "本节自测（课件配套测验）", level: 2 },
    { id: 'sec-quiz-h1', text: "一、单项选择题", level: 3 },
    { id: 'sec-quiz-h2', text: "二、多项选择题", level: 3 },
    { id: 'sec-quiz-h3', text: "三、填空题 / 计算题", level: 3 },
  ],
  sections: [
    {
      id: 'sec-overview',
      heading: "1. 本讲地图：贪心法与它的三个追问",
      blocks: [
        { type: 'html', html: `
          <p>课程的贪心法分两次讲完（PPT 第 2 页与第 27 页的纲要）：</p>
                <table class="tbl">
                  <thead><tr><th>半场</th><th>纲要内容</th><th>本页对应小节</th></tr></thead>
                  <tbody>
                    <tr><td>贪心算法 I（第 2–26 页）</td><td>最小生成树 → 最优子结构 → 贪婪选择 → Prim 的贪婪 MST 算法 → 贪心策略中的要素</td><td>第 2–5 节</td></tr>
                    <tr><td>贪心算法 II（第 27–45 页）</td><td>活动选择问题 → 背包问题 → 哈夫曼编码</td><td>第 6–8 节</td></tr>
                  </tbody>
                </table>
          
                <p>第 2 页的备注里写着一句提纲挈领的话，也是整讲的追问：</p>
          
                <div class="callout key">
                  <p class="callout-h">本讲的核心问题</p>
                  <p><b>贪心算法如何保证能得到全局最优解？</b></p>
                  <p>答案不是一个技巧，而是两个必须<b>先证明、后使用</b>的性质：</p>
                  <ul>
                    <li><b>最优子结构</b> (optimal substructure)：问题的最优解包含了子问题的最优解；</li>
                    <li><b>贪心选择特性</b> (greedy-choice property)：全局最优解可以通过一系列局部最优（贪婪）选择得到。</li>
                  </ul>
                </div>
          
                <p>这两条一摆，就能回答 PPT 第 3 页对 MST 提出的三个问题：能不能用动态规划？能不能用贪心？两者效率差多少？—— 结论是：MST <b>用 DP 也能做</b>（第 3.2 节给出状态设计），但它有更强的结构，于是贪心能做得更快；而一旦某个问题只有最优子结构、没有贪心选择特性（顶点覆盖、0-1 背包），贪心就会给出错误答案，只能退回 DP 或分支限界。</p>
          
                <p>复习时请把下面这张「路线图」记在脑子里，后面每个算法都按同一节奏展开：</p>
                <p class="formula">定义问题 &rarr; 证明最优子结构 &rarr; 证明贪心选择 &rarr; 写出算法（伪代码 + C++） &rarr; 分析复杂度</p>
          
                <div class="callout tip">
                  <p class="callout-h">记忆技巧</p>
                  <p>贪心算法 = <b>「排序 + 一次扫描」</b>。Prim 排序的是 key，活动选择排序的是结束时间 <span class="m">f<sub>i</sub></span>，哈夫曼排序的是频率 <span class="m">f(c)</span>，分数背包排序的是单位价值 <span class="m">v<sub>i</sub>/w<sub>i</sub></span>。找到那个「该排序的量」，贪心准则就出来了一半。</p>
                </div>
        ` },
      ],
    },
    {
      id: 'sec-mst',
      heading: "2. 最小生成树：定义、算例与应用",
      blocks: [
        { type: 'html', html: `
          <h3 id="sec-mst-h1">2.1 问题定义</h3>
                <p><b>输入</b>（PPT 第 3 页）：一个<b>连通的、无向的</b>图 <span class="m">G = (V, E)</span>，以及加权函数 <span class="m">w : E &rarr; &#8477;</span>。为了简化，<b>假设所有边的权各不相同</b>（CLRS 包括了通用情况）。</p>
                <p><b>输出</b>：一棵<b>生成树</b> (spanning tree) <span class="m">T</span> —— 连接所有顶点的树 —— 且其权最小，其中</p>
                <p class="formula">w(T) = &sum;<sub>(u,v)&isin;T</sub> w(u, v)</p>
                <p>「生成树」三个字包含两件事：① <b>连通</b>（覆盖全部 <span class="m">|V|</span> 个顶点）；② <b>无环</b>（是一棵树）。因此任何生成树都恰好有 <span class="m">|V| &minus; 1</span> 条边 —— 本例 <span class="m">|V| = 8</span>，故 MST 有 <b>7</b> 条边。</p>
          
                <p><b>应用</b>（第 3 页备注）：可通过求网络的最小生成树，达到求解<b>通信线路或总代价最小</b>的最佳方案；另一个经典应用是「在计算机网络中构造广播树」(constructing trees for broadcasting in computer networks) —— 让报文沿树边扩散，总传输代价最小。</p>
          
                <h3 id="sec-mst-h2">2.2 PPT 的算例：8 个顶点、10 条边</h3>
                <p>第 4 页给出一张标好权值的图，答案是下面高亮的 7 条树边，总权 <b>53</b>。PPT 图里的圆圈没有字母，本页为了叙述方便按 SPEC 的边表把 8 个顶点记为 <b>A~H</b>（这是<b>补充标注</b>，图结构与权值完全照 PPT）：</p>
          
                <svg class="fig" viewBox="0 0 760 430" role="img" aria-label="PPT 第 4 页的最小生成树算例：8 个顶点 10 条边，高亮的 7 条树边权值之和为 53">
                  <text x="20" y="22" class="tx-b">MST 算例（边权互异）：树边 7 条，总权 53</text>
                  <!-- 非树边 -->
                  <line x1="300" y1="58" x2="470" y2="175" stroke="var(--c-line)" stroke-width="1.4"></line>
                  <line x1="96" y1="175" x2="96" y2="292" stroke="var(--c-line)" stroke-width="1.4"></line>
                  <line x1="300" y1="392" x2="470" y2="292" stroke="var(--c-line)" stroke-width="1.4"></line>
                  <!-- 树边 -->
                  <line x1="300" y1="58" x2="96" y2="175" stroke="var(--c-hot)" stroke-width="4"></line>
                  <line x1="96" y1="175" x2="470" y2="175" stroke="var(--c-hot)" stroke-width="4"></line>
                  <line x1="470" y1="175" x2="664" y2="175" stroke="var(--c-hot)" stroke-width="4"></line>
                  <line x1="470" y1="175" x2="470" y2="292" stroke="var(--c-hot)" stroke-width="4"></line>
                  <line x1="96" y1="175" x2="300" y2="392" stroke="var(--c-hot)" stroke-width="4"></line>
                  <line x1="96" y1="292" x2="300" y2="392" stroke="var(--c-hot)" stroke-width="4"></line>
                  <line x1="470" y1="292" x2="664" y2="292" stroke="var(--c-hot)" stroke-width="4"></line>
                  <!-- 权值 -->
                  <text x="388" y="104" class="tx-sm" text-anchor="middle" fill="var(--c-ink-soft)">12</text>
                  <text x="58" y="236" class="tx-sm" text-anchor="middle" fill="var(--c-ink-soft)">14</text>
                  <text x="392" y="356" class="tx-sm" text-anchor="middle" fill="var(--c-ink-soft)">10</text>
                  <text x="182" y="102" class="tx-sm tx-b" text-anchor="middle" fill="var(--c-hot)">6</text>
                  <text x="283" y="163" class="tx-sm tx-b" text-anchor="middle" fill="var(--c-hot)">5</text>
                  <text x="572" y="163" class="tx-sm tx-b" text-anchor="middle" fill="var(--c-hot)">9</text>
                  <text x="432" y="238" class="tx-sm tx-b" text-anchor="middle" fill="var(--c-hot)">7</text>
                  <text x="166" y="300" class="tx-sm tx-b" text-anchor="middle" fill="var(--c-hot)">8</text>
                  <text x="170" y="350" class="tx-sm tx-b" text-anchor="middle" fill="var(--c-hot)">3</text>
                  <text x="572" y="280" class="tx-sm tx-b" text-anchor="middle" fill="var(--c-hot)">15</text>
                  <!-- 顶点 -->
                  <circle cx="300" cy="58" r="19" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="1.8"></circle>
                  <text x="300" y="63" class="tx tx-b" text-anchor="middle">A</text>
                  <circle cx="96" cy="175" r="19" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="1.8"></circle>
                  <text x="96" y="180" class="tx tx-b" text-anchor="middle">B</text>
                  <circle cx="470" cy="175" r="19" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="1.8"></circle>
                  <text x="470" y="180" class="tx tx-b" text-anchor="middle">C</text>
                  <circle cx="664" cy="175" r="19" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="1.8"></circle>
                  <text x="664" y="180" class="tx tx-b" text-anchor="middle">D</text>
                  <circle cx="96" cy="292" r="19" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="1.8"></circle>
                  <text x="96" y="297" class="tx tx-b" text-anchor="middle">E</text>
                  <circle cx="300" cy="392" r="19" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="1.8"></circle>
                  <text x="300" y="397" class="tx tx-b" text-anchor="middle">F</text>
                  <circle cx="470" cy="292" r="19" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="1.8"></circle>
                  <text x="470" y="297" class="tx tx-b" text-anchor="middle">G</text>
                  <circle cx="664" cy="292" r="19" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="1.8"></circle>
                  <text x="664" y="297" class="tx tx-b" text-anchor="middle">H</text>
                  <text x="20" y="420" class="tx-sm">粗线 = 树边：3 (E–F) + 5 (B–C) + 6 (A–B) + 7 (C–G) + 8 (B–F) + 9 (C–D) + 15 (G–H) = 53；细线 12 / 14 / 10 是各自环上的最大边，故不入树</text>
                </svg>
                <p class="fig-cap">图 1 &nbsp;MST 算例（对应 PPT 第 4 页）：7 条树边权值之和为 53</p>
          
                <h3 id="sec-mst-h3">2.3 暴力求解有多慢？</h3>
                <p>PPT 第 4 页的思考题是「暴力求解的时间复杂度是多少？」。最朴素的做法：枚举所有含 <span class="m">|V| &minus; 1 = 7</span> 条边的子集，再检验它是否连通且无环，取权值最小者。本例 <span class="m">|E| = 10</span>，候选子集共 <span class="m">C(10, 7) = 120</span> 个；一般图则要面对 <span class="m">C(|E|, |V|&minus;1)</span> 个候选，<b>随规模指数爆炸</b>。作为对照，8 个顶点的完全图 <span class="m">K<sub>8</sub></span> 按 Cayley 公式有 <span class="m">8<sup>6</sup> = 262144</span> 棵生成树 —— 这也解释了为什么必须找到多项式算法。（本段数字为补充推算，PPT 只提问未作答。）</p>
          
                <div class="callout key">
                  <p class="callout-h">本节考点</p>
                  <ul>
                    <li>MST 的输入/输出、<span class="m">w(T) = &sum; w(u,v)</span>、边权互异的简化假设；</li>
                    <li>生成树 = 连通 + 无环 &rArr; 恰有 <span class="m">|V| &minus; 1</span> 条边；</li>
                    <li>算例记住两个数：<b>7 条边、总权 53</b>；</li>
                    <li>暴力法指数级，引出贪心。</li>
                  </ul>
                </div>
        ` },
      ],
    },
    {
      id: 'sec-mst-theory',
      heading: "3. 两大定理：最优子结构与贪心选择",
      blocks: [
        { type: 'html', html: `
          <h3 id="sec-mst-theory-h1">3.1 最优子结构（PPT 第 5–6 页）</h3>
          
                <div class="callout key">
                  <p class="callout-h">定理（MST 的最优子结构）</p>
                  <p>设 <span class="m">T</span> 是 <span class="m">G = (V, E)</span> 的 MST。去掉 <span class="m">T</span> 中的边 <span class="m">(u, v)</span>，把 <span class="m">T</span> 划分成两棵子树 <span class="m">T<sub>1</sub></span> 和 <span class="m">T<sub>2</sub></span>。则 <span class="m">T<sub>1</sub></span> 是 <span class="m">G<sub>1</sub> = (V<sub>1</sub>, E<sub>1</sub>)</span> 的 MST，其中 <span class="m">G<sub>1</sub></span> 是由 <span class="m">T<sub>1</sub></span> 的顶点导出的 <span class="m">G</span> 的子图：</p>
                  <p><span class="m">V<sub>1</sub> = T<sub>1</sub> 的顶点</span>，<span class="m">E<sub>1</sub> = {(x, y) &isin; E : x, y &isin; V<sub>1</sub>}</span>。<span class="m">T<sub>2</sub></span> 同理。</p>
                </div>
          
                <p><b>证明（粘贴拷贝 / 剪切粘贴，cut &amp; paste）</b>：显然有</p>
                <p class="formula">w(T) = w(u, v) + w(T<sub>1</sub>) + w(T<sub>2</sub>)</p>
                <p>反设 <span class="m">T<sub>1</sub></span> 不是 <span class="m">G<sub>1</sub></span> 的 MST，即存在 <span class="m">G<sub>1</sub></span> 中权更小的生成树 <span class="m">T<sub>1</sub>&prime;</span>，满足 <span class="m">w(T<sub>1</sub>&prime;) &lt; w(T<sub>1</sub>)</span>。那么在 <span class="m">G</span> 中把 <span class="m">T<sub>1</sub></span> 换成 <span class="m">T<sub>1</sub>&prime;</span>，得到</p>
                <p class="formula">T&prime; = {(u, v)} &cup; T<sub>1</sub>&prime; &cup; T<sub>2</sub>，且 w(T&prime;) = w(u,v) + w(T<sub>1</sub>&prime;) + w(T<sub>2</sub>) &lt; w(T)</p>
                <p>而 <span class="m">T&prime;</span> 显然仍是 <span class="m">G</span> 的生成树（三块拼起来、无环、连通），这与 <span class="m">T</span> 是 MST 矛盾。故 <span class="m">T<sub>1</sub></span> 必为 <span class="m">G<sub>1</sub></span> 的 MST。&#8718;</p>
          
                <p>这个证明的形状要记住：<b>「假设存在更优的子问题解 &rarr; 把它替换进去 &rarr; 得到比原最优解更优的解 &rarr; 矛盾」</b>。后面贪心选择定理、哈夫曼的最优子结构，全是这同一招。</p>
          
                <h3 id="sec-mst-theory-h2">3.2 有没有重叠子问题？能不能用 DP？（PPT 第 6 页）</h3>
                <p>PPT 接着问：「我们得到了重叠子问题了吗？」给出的构造是：把图中的顶点排序 <span class="m">{v<sub>1</sub>, v<sub>2</sub>, …, v<sub>i</sub>, …, v<sub>n</sub>}</span>，令 <span class="m">w(i)</span> 表示连接 <span class="m">{v<sub>1</sub>, v<sub>2</sub>, …, v<sub>i</sub>}</span> 的最小生成树的权值。</p>
                <ul>
                  <li>结论一：<b>可以</b>设计出 DP —— 于是「很好，那么可以使用动态规划！」</li>
                  <li>结论二：「<b>但是 MST 表现出更强特征，可以使用更加有效的算法</b>」—— 这个更强的特征就是下面这条贪心选择定理。</li>
                </ul>
                <p>换句话说：<b>能 DP &ne; 该 DP</b>。DP 要枚举「哪些顶点已并入」，状态是指数级的子集族；而 MST 的最优解只由一条「最小跨割边」决定，状态被压缩成了一个集合 <span class="m">A</span> 与它的边界，于是有了 Prim。</p>
          
                <h3 id="sec-mst-theory-h3">3.3 贪心选择定理（PPT 第 7 页）</h3>
          
                <div class="callout key">
                  <p class="callout-h">定理（贪心选择性质 / 安全边）</p>
                  <p>令 <span class="m">T</span> 为 <span class="m">G = (V, E)</span> 的 MST，并且令 <span class="m">A &sube; V</span>。假设 <span class="m">(u, v) &isin; E</span> 是连接 <span class="m">A</span> 和 <span class="m">V &minus; A</span> 的<b>最小加权边</b>，那么 <span class="m">(u, v) &isin; T</span>。</p>
                </div>
          
                <p>这条定理说的正是「<b>局部的最优选择，全局范围内也是最优的</b>」—— 这就是「贪婪」算法的特征。证明（PPT 第 8–11 页，四页动画一步步展开）用的是<b>剪切粘贴</b>：</p>
          
                <ol>
                  <li><b>反设</b> <span class="m">(u, v) &notin; T</span>；</li>
                  <li>考虑 <span class="m">T</span> 中从 <span class="m">u</span> 到 <span class="m">v</span> 的<b>唯一的简单路径</b>。因为 <span class="m">u &isin; A</span> 而 <span class="m">v &isin; V &minus; A</span>，这条路径上必有<b>至少一条边</b>跨越 <span class="m">(A, V&minus;A)</span> 这个割；</li>
                  <li>取路径上<b>第一条</b>这样的边，记作 <span class="m">(x, y)</span>（<span class="m">x &isin; A</span>，<span class="m">y &isin; V&minus;A</span>）；</li>
                  <li>把 <span class="m">(u, v)</span> 和 <span class="m">(x, y)</span> <b>交换</b>：<span class="m">T&prime; = T &minus; {(x, y)} &cup; {(u, v)}</span>。交换后仍是一棵生成树（加一条边成环，环上恰有 <span class="m">(x,y)</span>，删之即破环）；</li>
                  <li>由 <span class="m">(u,v)</span> 是<b>最小</b>跨割边，且边权互异，有 <span class="m">w(u, v) &lt; w(x, y)</span>，于是 <span class="m">w(T&prime;) &lt; w(T)</span> —— <b>一个比 T 加权更小的生成树产生了</b>，矛盾。</li>
                </ol>
          
                <svg class="fig" viewBox="0 0 900 380" role="img" aria-label="贪心选择定理的剪切粘贴证明示意：集合 A 与 V 减 A 被割分开，虚线 (u,v) 是连接两半的最小权边，树中 u 到 v 的路径上第一条跨割边 (x,y) 会被它替换掉">
                  <text x="20" y="24" class="tx-b">剪切粘贴：用最小跨割边 (u, v) 换掉路径上第一条跨割边 (x, y)</text>
                  <ellipse cx="250" cy="195" rx="185" ry="135" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="1.4" stroke-dasharray="6 5"></ellipse>
                  <ellipse cx="670" cy="195" rx="185" ry="135" fill="var(--c-tip-bg)" stroke="var(--c-ok)" stroke-width="1.4" stroke-dasharray="6 5"></ellipse>
                  <text x="72" y="92" class="tx-b" fill="var(--c-accent)">A</text>
                  <text x="760" y="92" class="tx-b" fill="var(--c-ok)">V − A</text>
                  <!-- 割的边界 -->
                  <line x1="460" y1="55" x2="460" y2="340" stroke="var(--c-warn)" stroke-width="1.6" stroke-dasharray="4 4"></line>
                  <text x="464" y="52" class="tx-sm" fill="var(--c-warn)">割</text>
                  <!-- 树中的路径 u -> n1 -> n2 -> v -->
                  <line x1="300" y1="255" x2="360" y2="140" stroke="var(--c-line)" stroke-width="2.4"></line>
                  <line x1="560" y1="140" x2="640" y2="255" stroke="var(--c-line)" stroke-width="2.4"></line>
                  <!-- 被替换的跨割边 (x,y) -->
                  <line x1="360" y1="140" x2="560" y2="140" stroke="var(--c-warn)" stroke-width="4"></line>
                  <text x="460" y="128" class="tx-sm tx-b" text-anchor="middle" fill="var(--c-warn)">(x, y)：路径上第一条跨割边</text>
                  <!-- 最小跨割边 (u,v) -->
                  <line x1="300" y1="255" x2="640" y2="255" stroke="var(--c-hot)" stroke-width="2.4" stroke-dasharray="8 6"></line>
                  <text x="470" y="278" class="tx-sm tx-b" text-anchor="middle" fill="var(--c-hot)">(u, v)：w(u,v) 最小的跨割边（不在 T 中）</text>
                  <!-- 顶点 -->
                  <circle cx="300" cy="255" r="16" fill="var(--c-panel)" stroke="var(--c-accent)" stroke-width="2"></circle>
                  <text x="300" y="260" class="tx tx-b" text-anchor="middle">u</text>
                  <circle cx="640" cy="255" r="16" fill="var(--c-panel)" stroke="var(--c-ok)" stroke-width="2"></circle>
                  <text x="640" y="260" class="tx tx-b" text-anchor="middle">v</text>
                  <circle cx="360" cy="140" r="14" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.6"></circle>
                  <text x="360" y="145" class="tx-sm" text-anchor="middle">x</text>
                  <circle cx="560" cy="140" r="14" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.6"></circle>
                  <text x="560" y="145" class="tx-sm" text-anchor="middle">y</text>
                  <text x="20" y="356" class="tx-sm">交换后 T′ = T − {(x,y)} ∪ {(u,v)} 仍是生成树；因 w(u,v) &lt; w(x,y)，有 w(T′) &lt; w(T)，与 T 是 MST 矛盾</text>
                  <text x="20" y="374" class="tx-sm">（实线 = T 中的树边；虚线 (u,v) = 被贪心选中的最小跨割边；橙色 (x,y) = 被换掉的边）</text>
                </svg>
                <p class="fig-cap">图 2 &nbsp;贪心选择定理的证明图（对应 PPT 第 8–11 页的四帧）</p>
          
                <div class="callout warn">
                  <p class="callout-h">易错：这一步凭什么严格变小？</p>
                  <p>关键在「<b>边权互异</b>」这条简化假设。若允许等权，则只能得到 <span class="m">w(T&prime;) &le; w(T)</span>，结论要改成「存在一棵 MST 含 <span class="m">(u,v)</span>」而不是「每棵 MST 都含 <span class="m">(u,v)</span>」。MST 在等权时<b>不唯一</b>，但<b>权值唯一</b> —— 考试爱考这一点。</p>
                </div>
          
                <div class="callout key">
                  <p class="callout-h">本节考点</p>
                  <ul>
                    <li>能默写两条定理与两个证明（都是剪切粘贴）；</li>
                    <li>会解释 MST 为什么「可 DP 但不必 DP」；</li>
                    <li>记住术语：<b>割</b> (cut)、<b>跨割边</b>、<b>安全边</b> (safe edge)。</li>
                  </ul>
                </div>
        ` },
      ],
    },
    {
      id: 'sec-prim',
      heading: "4. Prim 算法：用优先队列扩张集合 A",
      blocks: [
        { type: 'html', html: `
          <h3 id="sec-prim-h1">4.1 算法思路</h3>
                <p>PPT 第 12 页先把上一节的定理重述一遍，然后直接给出思路：</p>
                <div class="callout">
                  <p class="callout-h">思路（第 12 页原文）</p>
                  <p>用<b>优先队列</b> <span class="m">Q</span> 维护 <span class="m">V &minus; A</span>。将 <span class="m">Q</span> 中的每个顶点按照其<b>和 A 中的顶点连接的边的最小权</b>进行排序。</p>
                </div>
                <p>第 12 页备注补充了优先队列的性质：元素被赋予优先级，访问时<b>优先级最高的元素最先删除</b>，即「first in, largest out」（最高级先出）。</p>
                <p>于是 Prim 的三句话：</p>
                <ol>
                  <li>维护集合 <span class="m">A</span>（已并入 MST 的顶点）与每个 <span class="m">v &isin; V&minus;A</span> 的 <span class="m">key[v]</span>（<span class="m">v</span> 到 <span class="m">A</span> 的最小边权）以及 <span class="m">&pi;[v]</span>（提供这条最小边的 <span class="m">A</span> 中顶点）；</li>
                  <li>每次 <span class="m">EXTRACT-MIN(Q)</span> 取出 key 最小的 <span class="m">u</span>，把边 <span class="m">(&pi;[u], u)</span> 并入 MST —— 由贪心选择定理，它正是当前割 <span class="m">(A, V&minus;A)</span> 的最小跨割边，安全；</li>
                  <li>用 <span class="m">u</span> 的邻边<b>松弛</b>（relax）<span class="m">V&minus;A</span> 中顶点的 key。</li>
                </ol>
          
                <h3 id="sec-prim-h2">4.2 伪代码 + C++</h3>
                <p>PPT 只给了思路、没有写伪代码，下面用 CLRS 的标准写法（<b>补充</b>，与第 12 页「优先队列维护 V−A」的思路完全一致）：</p>
          
                <div class="code-pair">
                  <div class="code-col">
                    <p class="code-h">伪代码</p>
                    <pre class="code"><code>MST-PRIM(G, w, r)                    // 输入：图 G、权函数 w、起点 r
          1  for each u ∈ G.V                  // 初始化：每个顶点都要处理
          2      u.key ← ∞                     // key 表示到集合 A 的最小边权，先置无穷
          3      u.π ← NIL                     // π 记录 MST 上的父顶点，先置空
          4  r.key ← 0                         // 任选起点 r，key 置 0 使它第一个被取出
          5  Q ← G.V                           // 优先队列 Q 维护 V − A，初始装入全部顶点
          6  while Q ≠ ∅                       // 只要还有顶点没进 A 就继续
          7      u ← EXTRACT-MIN(Q)            // 取出 key 最小的顶点（割上的最小边）
          8      for each v ∈ G.Adj[u]         // 扫描 u 的每条邻边，做松弛
          9          if v ∈ Q and w(u,v) &lt; v.key   // v 还在 V−A 中且这条边更短
          10             v.π ← u                // 记下父顶点
          11             v.key ← w(u,v)         // 更新 key（DECREASE-KEY）</code></pre>
                  </div>
                  <div class="code-col">
                    <p class="code-h">C++</p>
                    <pre class="code cpp"><code>#include &lt;cstdio&gt;                 // 标准输入输出，用于打印结果
          #include &lt;vector&gt;                 // 邻接表、key 数组用 vector
          #include &lt;queue&gt;                  // 优先队列（小根堆）
          #include &lt;utility&gt;                // pair 存 (key, 顶点)
          #include &lt;functional&gt;             // greater 比较器
          using namespace std;               // 使用标准命名空间，省去 std:: 前缀
          
          const int INF = 1000000000;       // 无穷大：表示该顶点尚未与 A 连通
          int n = 8;                        // 顶点个数
          vector&lt;vector&lt;pair&lt;int, int&gt; &gt; &gt; adj;  // adj[u] = {(v, w)} 邻接表
          vector&lt;int&gt; keyv, par;            // key 值 与 MST 上的父亲
          vector&lt;bool&gt; inA;                 // 顶点是否已经加入集合 A
          
          void prim(int r) {                // r 为起点（PPT 中 key=0 的那个顶点）
              keyv.assign(n, INF);          // 所有顶点 key 初始化为无穷
              par.assign(n, -1);            // 父指针初始化为 -1（NIL）
              inA.assign(n, false);         // 初始时 A 为空集
              keyv[r] = 0;                  // 起点 key 置 0，保证它第一个被取出
              // 小根堆按 (key, 顶点) 排序，取出 key 最小的顶点
              priority_queue&lt;pair&lt;int, int&gt;, vector&lt;pair&lt;int, int&gt; &gt;, greater&lt;pair&lt;int, int&gt; &gt; &gt; Q;  // 候选顶点的小根堆
              Q.push(make_pair(0, r));      // 起点入堆
              int total = 0;                // MST 的累计权值
              while (!Q.empty()) {          // Q 就是 V - A 的候选集
                  pair&lt;int, int&gt; t = Q.top(); Q.pop();   // 取出 key 最小的候选
                  int u = t.second;         // 顶点编号
                  int d = t.first;          // 该顶点当时的 key
                  if (inA[u]) { continue; } // 懒删除：已经入 A 的过期记录直接跳过
                  inA[u] = true;            // u 正式加入 A
                  total += d;               // 把这条树边计入总权
                  for (size_t i = 0; i &lt; adj[u].size(); ++i) {  // 扫描 u 的所有邻边
                      int v = adj[u][i].first;    // 邻接顶点
                      int w = adj[u][i].second;   // 边权
                      if (!inA[v] &amp;&amp; w &lt; keyv[v]) {  // 只对 V-A 中的顶点做松弛
                          keyv[v] = w;      // 更新 key 为更小的边权
                          par[v] = u;       // 记下 MST 上的父亲
                          Q.push(make_pair(w, v));   // 新的 key 入堆
                      }
                  }
              }
              printf("MST 总权值 = %d\\n", total);    // 本例输出 53
              const char *name = "ABCDEFGH";         // 顶点 0..7 依次记为 A..H
              for (int v = 0; v &lt; n; ++v) {          // 逐条打印 MST 的边
                  if (par[v] &gt;= 0) {                 // 有父亲的顶点才对应一条树边
                      printf("%c - %c : %d\\n", name[par[v]], name[v], keyv[v]);  // 打印这条树边
                  }
              }
          }
          
          int main() {                                   // 主函数：建图后调用 prim
              adj.assign(n, vector&lt;pair&lt;int, int&gt; &gt;());  // 初始化 8 个空邻接表
              // 按 PPT 第 4 页 / 第 13~25 页的图录入 10 条边（无向图，两个方向都存）
              int eu[10] = {0, 0, 1, 1, 1, 4, 2, 2, 5, 6};       // 边的一个端点
              int ev[10] = {1, 2, 2, 4, 5, 5, 3, 6, 6, 7};       // 边的另一个端点
              int ew[10] = {6, 12, 5, 14, 8, 3, 9, 7, 10, 15};   // 边权
              for (int i = 0; i &lt; 10; ++i) {                     // 逐条建无向边
                  adj[eu[i]].push_back(make_pair(ev[i], ew[i]));  // 正向存一次
                  adj[ev[i]].push_back(make_pair(eu[i], ew[i]));  // 反向再存一次
              }
              prim(6);                       // 起点为顶点 6，即字母 G（PPT 中 key=0）
              return 0;                      // 正常结束
          }</code></pre>
                  </div>
                </div>
                <p>本机用 <code>g++ -std=c++11</code> 实测编译运行，输出 <code>MST 总权值 = 53</code>，并打印 7 条边 <code>B-A:6 / C-B:5 / G-C:7 / C-D:9 / F-E:3 / B-F:8 / G-H:15</code>。</p>
          
                <h3 id="sec-prim-h3">4.3 逐帧动画：跟着 PPT 第 13–25 页走一遍</h3>
                <p>PPT 用了 13 页幻灯片演示同一张图上的 Prim 过程，圆圈里的数字是<b>当时的 key 值</b>；PPT 图上没有顶点字母，下面动画按同一布局、同一顺序复现，并把顶点记为 A~H。<b>起点是 key=0 的那个顶点，本页记为 G</b>。</p>
        ` },
        { type: 'demo', name: 'prim-mst', title: "Prim 求 MST：A 集合扩张、key 松弛与总权增长（14 步）" },
        { type: 'html', html: `
          <p>把动画的加边顺序抄下来（同时也是 PPT 第 13–25 页 13 帧的顺序）：</p>
                <table class="tbl">
                  <thead><tr><th>序号</th><th>取出的顶点</th><th>key 值</th><th>加入的树边</th><th>累计权值</th><th>本轮被松弛的 key</th></tr></thead>
                  <tbody>
                    <tr><td class="num">1</td><td>G</td><td class="num">0</td><td>—（起点）</td><td class="num">0</td><td>C&larr;7、F&larr;10、H&larr;15</td></tr>
                    <tr><td class="num">2</td><td>C</td><td class="num">7</td><td>G–C : 7</td><td class="num">7</td><td>B&larr;5、A&larr;12、D&larr;9</td></tr>
                    <tr><td class="num">3</td><td>B</td><td class="num">5</td><td>C–B : 5</td><td class="num">12</td><td>A&larr;6（原 12）、E&larr;14、F&larr;8（原 10）</td></tr>
                    <tr><td class="num">4</td><td>A</td><td class="num">6</td><td>B–A : 6</td><td class="num">18</td><td>无（邻居 B、C 都已在 A 中）</td></tr>
                    <tr><td class="num">5</td><td>F</td><td class="num">8</td><td>B–F : 8</td><td class="num">26</td><td>E&larr;3（原 14）</td></tr>
                    <tr><td class="num">6</td><td>E</td><td class="num">3</td><td>F–E : 3</td><td class="num">29</td><td>无（邻居 B、F 都已在 A 中）</td></tr>
                    <tr><td class="num">7</td><td>D</td><td class="num">9</td><td>C–D : 9</td><td class="num">38</td><td>无（邻居 C 已在 A 中）</td></tr>
                    <tr><td class="num">8</td><td>H</td><td class="num">15</td><td>G–H : 15</td><td class="num">53</td><td>无（邻居 G 已在 A 中）</td></tr>
                  </tbody>
                </table>
          
                <div class="callout warn">
                  <p class="callout-h">易错：F 比 D 先入树，E 比 D 先入树</p>
                  <p>按<b>边权从小到大</b>去猜加边顺序会猜成「7, 5, 6, 3, 8, 9, 15」，这是错的。Prim 取的是 <b>key 最小</b>的顶点，而 key 只在「某顶点刚进 A」时才可能被改进：E 的 key 要等到 F 入 A 之后才降到 3，所以<b>第 5 步拿到的是 F（8），不是 D（9）</b>；E（3）直到第 6 步才轮到。这也正是 Prim 与 Kruskal 顺序不同的原因。</p>
                </div>
          
                <h3 id="sec-prim-h4">4.4 复杂度与正确性</h3>
                <table class="tbl">
                  <thead><tr><th>实现</th><th>取最小 key</th><th>总时间</th><th>适用场景</th></tr></thead>
                  <tbody>
                    <tr><td>邻接矩阵 + 线性扫描 <span class="m">key[]</span></td><td class="num">O(V)</td><td class="num">O(V<sup>2</sup>)</td><td>稠密图（<span class="m">E &asymp; V<sup>2</sup></span>）更优</td></tr>
                    <tr><td>邻接表 + 二叉堆（本页代码）</td><td class="num">O(lg V)</td><td class="num">O(E lg V)</td><td>稀疏图</td></tr>
                    <tr><td>邻接表 + 斐波那契堆（补充）</td><td class="num">O(1) 摊还</td><td class="num">O(E + V lg V)</td><td>理论上界更好</td></tr>
                  </tbody>
                </table>
                <p>二叉堆版的时间构成：建堆 <span class="m">O(V)</span>；<span class="m">V</span> 次 EXTRACT-MIN 共 <span class="m">O(V lg V)</span>；每条边最多触发一次 DECREASE-KEY（本页代码用「新 key 直接入堆 + 惰性删除」，等价于 <span class="m">O(E)</span> 次入堆），共 <span class="m">O(E lg V)</span>。合计 <b>O(E lg V)</b>。</p>
                <p><b>正确性</b>（一句话版）：每一步选出的边都是当前割 <span class="m">(A, V&minus;A)</span> 上的最小跨割边，由第 3.3 节的定理它是<b>安全边</b>，可以放心并入；对步数归纳即得最终 <span class="m">A = V</span> 时得到的是一棵 MST。</p>
          
                <div class="callout key">
                  <p class="callout-h">本节考点</p>
                  <ul>
                    <li>Prim 的三件套：集合 <span class="m">A</span>、<span class="m">key[]</span>、优先队列；</li>
                    <li>复杂度 <b>O(E lg V)</b>（堆）或 <b>O(V&sup2;)</b>（矩阵）；</li>
                    <li>能复述本例的 8 步加边与 <b>53</b>；</li>
                    <li>Kruskal 按边权排序 + 并查集，Prim 按顶点扩张，两者都基于同一条贪心选择定理。</li>
                  </ul>
                </div>
        ` },
      ],
    },
    {
      id: 'sec-elements',
      heading: "5. 贪心策略中的要素、与 DP 的对比、以及一次失败",
      blocks: [
        { type: 'html', html: `
          <h3 id="sec-elements-h1">5.1 两个要素（PPT 第 26 / 29 页）</h3>
                <p>什么时候可以使用贪心算法？PPT 的答案只有两行：</p>
                <div class="callout key">
                  <p class="callout-h">要素一：最优子结构</p>
                  <p>问题的最优解包含了其子问题的最优解。PPT 的活动选择版表述：如果 <span class="m">A</span> 是 <span class="m">S</span> 的最优解，那么 <span class="m">A&prime; = A &minus; {1}</span> 是 <span class="m">S&prime; = {i &isin; S : s<sub>i</sub> &ge; f<sub>1</sub>}</span> 的最优解。</p>
                </div>
                <div class="callout key">
                  <p class="callout-h">要素二：贪心选择特性</p>
                  <p><b>全局的最优解可以通过局部的最优（贪婪）选择得到。</b></p>
                </div>
          
                <h3 id="sec-elements-h2">5.2 与动态规划的对比</h3>
                <table class="tbl">
                  <thead><tr><th>对比项</th><th>动态规划</th><th>贪心算法</th></tr></thead>
                  <tbody>
                    <tr><td>相同点</td><td colspan="2">都要求<b>最优子结构</b>：最优解由子问题的最优解组合而成</td></tr>
                    <tr><td>差别</td><td>没有（或未证明）贪心选择特性，必须<b>检查各个子问题的解</b>再取最优</td><td>有<b>贪心选择特性</b>：做一次局部最优选择后<b>不再回头</b>，无需比较子问题</td></tr>
                    <tr><td>求解方式</td><td>自底向上填表 / 自顶向下备忘，通常要存所有子问题的解</td><td>排序 + 一次扫描，通常只需常数或线性辅助空间</td></tr>
                    <tr><td>正确性</td><td>只要状态与转移写对，一般都能得到最优解</td><td><b>不保证最优</b>：贪心（试探）可能失败</td></tr>
                    <tr><td>失败后的补救</td><td>—</td><td>若贪心不是最优，<b>改用 DP</b></td></tr>
                  </tbody>
                </table>
                <p>一句话总结：<b>DP 是「考虑所有选择」，贪心是「只考虑一个选择」</b>；只有当你证明了这一个选择永远不亏，才能把 DP 降级成贪心。</p>
          
                <h3 id="sec-elements-h3">5.3 反例一：顶点覆盖（PPT 第 28 页）</h3>
                <p><b>定义</b>：无向图 <span class="m">G = (V, E)</span> 的一个<b>顶点覆盖</b> (vertex cover) 是一个子集 <span class="m">V&prime; &sube; V</span>，使得若 <span class="m">(u, v) &isin; E</span>，则 <span class="m">u &isin; V&prime;</span> 或 <span class="m">v &isin; V&prime;</span>，或者两者都是。换言之，顶点覆盖的集合<b>覆盖了所有的边</b>；一个顶点覆盖的大小就是这个覆盖里顶点的数目。<b>顶点覆盖问题</b>就是找一个图的最小的顶点覆盖。</p>
                <p><b>贪婪试探</b>：每次覆盖尽量多的边（选度数最大的顶点），然后删除所有被覆盖的边，重复直到没有边。</p>
                <p><b>结论</b>：贪婪试探<b>并不能总是找到最优解</b>！而且<b>顶点覆盖问题是 NP 完全的</b>（PPT 原文），所以既不该指望贪心，也不该指望多项式精确算法。</p>
          
                <svg class="fig" viewBox="0 0 860 330" role="img" aria-label="顶点覆盖的贪婪失效示例：中心顶点连出四条臂、每条臂带一个叶子，共 9 顶点 8 边；贪婪选中心加 4 个叶子共 5 个顶点，最优只选 4 个中间顶点">
                  <text x="20" y="22" class="tx-b">贪婪失效：中心 + 4 条臂（每条臂 2 个顶点），共 9 个顶点、8 条边</text>
                  <!-- 图一：原图 -->
                  <g>
                    <line x1="130" y1="160" x2="130" y2="110" stroke="var(--c-line)" stroke-width="1.8"></line>
                    <line x1="130" y1="160" x2="130" y2="210" stroke="var(--c-line)" stroke-width="1.8"></line>
                    <line x1="130" y1="160" x2="80" y2="160" stroke="var(--c-line)" stroke-width="1.8"></line>
                    <line x1="130" y1="160" x2="180" y2="160" stroke="var(--c-line)" stroke-width="1.8"></line>
                    <line x1="130" y1="110" x2="130" y2="70" stroke="var(--c-line)" stroke-width="1.8"></line>
                    <line x1="130" y1="210" x2="130" y2="250" stroke="var(--c-line)" stroke-width="1.8"></line>
                    <line x1="80" y1="160" x2="40" y2="160" stroke="var(--c-line)" stroke-width="1.8"></line>
                    <line x1="180" y1="160" x2="220" y2="160" stroke="var(--c-line)" stroke-width="1.8"></line>
                    <circle cx="130" cy="160" r="13" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.8"></circle>
                    <circle cx="130" cy="110" r="11" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.6"></circle>
                    <circle cx="130" cy="210" r="11" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.6"></circle>
                    <circle cx="80" cy="160" r="11" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.6"></circle>
                    <circle cx="180" cy="160" r="11" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.6"></circle>
                    <circle cx="130" cy="70" r="11" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.6"></circle>
                    <circle cx="130" cy="250" r="11" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.6"></circle>
                    <circle cx="40" cy="160" r="11" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.6"></circle>
                    <circle cx="220" cy="160" r="11" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.6"></circle>
                    <text x="130" y="300" class="tx-sm" text-anchor="middle">一个图（中心度数 4）</text>
                  </g>
                  <!-- 图二：贪婪 -->
                  <g>
                    <line x1="420" y1="160" x2="420" y2="110" stroke="var(--c-line)" stroke-width="1.8"></line>
                    <line x1="420" y1="160" x2="420" y2="210" stroke="var(--c-line)" stroke-width="1.8"></line>
                    <line x1="420" y1="160" x2="370" y2="160" stroke="var(--c-line)" stroke-width="1.8"></line>
                    <line x1="420" y1="160" x2="470" y2="160" stroke="var(--c-line)" stroke-width="1.8"></line>
                    <line x1="420" y1="110" x2="420" y2="70" stroke="var(--c-line)" stroke-width="1.8"></line>
                    <line x1="420" y1="210" x2="420" y2="250" stroke="var(--c-line)" stroke-width="1.8"></line>
                    <line x1="370" y1="160" x2="330" y2="160" stroke="var(--c-line)" stroke-width="1.8"></line>
                    <line x1="470" y1="160" x2="510" y2="160" stroke="var(--c-line)" stroke-width="1.8"></line>
                    <circle cx="420" cy="160" r="13" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="2.4"></circle>
                    <circle cx="420" cy="110" r="11" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.6"></circle>
                    <circle cx="420" cy="210" r="11" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.6"></circle>
                    <circle cx="370" cy="160" r="11" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.6"></circle>
                    <circle cx="470" cy="160" r="11" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.6"></circle>
                    <circle cx="420" cy="70" r="11" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="2.4"></circle>
                    <circle cx="420" cy="250" r="11" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="2.4"></circle>
                    <circle cx="330" cy="160" r="11" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="2.4"></circle>
                    <circle cx="510" cy="160" r="11" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="2.4"></circle>
                    <text x="420" y="300" class="tx-sm" text-anchor="middle">贪婪得到的大小为 5 的顶点覆盖</text>
                  </g>
                  <!-- 图三：最优 -->
                  <g>
                    <line x1="720" y1="160" x2="720" y2="110" stroke="var(--c-line)" stroke-width="1.8"></line>
                    <line x1="720" y1="160" x2="720" y2="210" stroke="var(--c-line)" stroke-width="1.8"></line>
                    <line x1="720" y1="160" x2="670" y2="160" stroke="var(--c-line)" stroke-width="1.8"></line>
                    <line x1="720" y1="160" x2="770" y2="160" stroke="var(--c-line)" stroke-width="1.8"></line>
                    <line x1="720" y1="110" x2="720" y2="70" stroke="var(--c-line)" stroke-width="1.8"></line>
                    <line x1="720" y1="210" x2="720" y2="250" stroke="var(--c-line)" stroke-width="1.8"></line>
                    <line x1="670" y1="160" x2="630" y2="160" stroke="var(--c-line)" stroke-width="1.8"></line>
                    <line x1="770" y1="160" x2="810" y2="160" stroke="var(--c-line)" stroke-width="1.8"></line>
                    <circle cx="720" cy="160" r="13" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.8"></circle>
                    <circle cx="720" cy="110" r="11" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.6"></circle>
                    <circle cx="720" cy="210" r="11" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.6"></circle>
                    <circle cx="670" cy="160" r="11" fill="var(--c-warn-bg)" stroke="var(--c-warn)" stroke-width="2.4"></circle>
                    <circle cx="770" cy="160" r="11" fill="var(--c-warn-bg)" stroke="var(--c-warn)" stroke-width="2.4"></circle>
                    <circle cx="720" cy="70" r="11" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.6"></circle>
                    <circle cx="720" cy="250" r="11" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.6"></circle>
                    <circle cx="630" cy="160" r="11" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.6"></circle>
                    <circle cx="810" cy="160" r="11" fill="var(--c-panel)" stroke="var(--c-line)" stroke-width="1.6"></circle>
                    <text x="720" y="300" class="tx-sm" text-anchor="middle">一个大小为 4 的最优顶点覆盖</text>
                  </g>
                  <text x="20" y="324" class="tx-sm">贪婪：先选度数最大的中心（覆盖 4 条臂边），剩下 4 条“中间—叶子”边互不相邻，每条都要再选 1 个顶点 ⇒ 共 1+4 = 5 个</text>
                </svg>
                <p class="fig-cap">图 3 &nbsp;顶点覆盖：贪婪得到 5 个，最优只要 4 个（上标数字依 PPT 第 28 页，图按同一结构重绘）</p>
          
                <p>图 3 的最优性可以直接论证：4 条「中间顶点—叶子」边<b>两两不相邻</b>（互不共享端点），构成一个大小 4 的匹配，任何顶点覆盖都必须为每条边至少选 1 个端点，故 <span class="m">|V&prime;| &ge; 4</span>；而选 4 个中间顶点恰好覆盖全部 8 条边，所以最优值就是 4。贪婪却花了 5 个 —— 这就是「<b>局部最优 &ne; 全局最优</b>」的最小反例。</p>
          
                <div class="callout warn">
                  <p class="callout-h">易错</p>
                  <p>「顶点覆盖」不要和「最小生成树」「最大匹配」混：它是 NP 完全的，考试若要求「设计多项式算法」，正确回答是<b>近似算法或指出 NP 完全</b>，而不是硬套贪心。近似比 2 的经典做法是「反复取一条边、把两个端点都放进覆盖」，与本节「取最大度顶点」的贪婪试探<b>不是</b>同一个算法。</p>
                </div>
        ` },
      ],
    },
    {
      id: 'sec-activity',
      heading: "6. 活动选择问题：选结束最早的那个",
      blocks: [
        { type: 'html', html: `
          <h3 id="sec-activity-h1">6.1 问题定义</h3>
                <p>给定集合 <span class="m">S = {1, 2, …, n}</span>，共 <span class="m">n</span> 个计划的活动；对每个活动 <span class="m">i</span>，开始时间为 <span class="m">s<sub>i</sub></span>、结束时间为 <span class="m">f<sub>i</sub></span>。要求选出<b>相互兼容的活动最大集合</b>。</p>
                <ul>
                  <li>如果被选中，活动 <span class="m">i</span> 在半开区间 <span class="m">[s<sub>i</sub>, f<sub>i</sub>)</span> 中进行；</li>
                  <li>活动 <span class="m">i</span> 和 <span class="m">j</span> <b>兼容</b> (compatible)，如果 <span class="m">[s<sub>i</sub>, f<sub>i</sub>)</span> 和 <span class="m">[s<sub>j</sub>, f<sub>j</sub>)</span> 不重叠，即 <span class="m">s<sub>i</sub> &ge; f<sub>j</sub></span> 或 <span class="m">s<sub>j</sub> &ge; f<sub>i</sub></span>。</li>
                </ul>
                <p>PPT 第 30 页先用 4 个活动的小例子说明兼容关系：<span class="m">(s<sub>1</sub>, f<sub>1</sub>) = (1, 4)</span>、<span class="m">(s<sub>2</sub>, f<sub>2</sub>) = (3, 5)</span>、<span class="m">(s<sub>3</sub>, f<sub>3</sub>) = (0, 6)</span>、<span class="m">(s<sub>4</sub>, f<sub>4</sub>) = (5, 7)</span>，图上标出的兼容对有 <b>(1, 4)</b> 与 <b>(2, 4)</b>。第 34 页给出完整的 11 个活动算例（下表），本页的动画与图都用这一组数据。</p>
          
                <table class="tbl">
                  <thead><tr><th>i</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th><th>11</th></tr></thead>
                  <tbody>
                    <tr><td>s<sub>i</sub></td><td class="num">1</td><td class="num">3</td><td class="num">0</td><td class="num">5</td><td class="num">3</td><td class="num">5</td><td class="num">6</td><td class="num">8</td><td class="num">8</td><td class="num">2</td><td class="num">12</td></tr>
                    <tr><td>f<sub>i</sub></td><td class="num">4</td><td class="num">5</td><td class="num">6</td><td class="num">7</td><td class="num">8</td><td class="num">9</td><td class="num">10</td><td class="num">11</td><td class="num">12</td><td class="num">13</td><td class="num">14</td></tr>
                  </tbody>
                </table>
                <p>注意这张表已经按 <span class="m">f<sub>i</sub></span> 升序排列（4,5,6,…,14），这正是贪心算法的前置条件。</p>
          
                <svg class="fig" viewBox="0 0 860 400" role="img" aria-label="11 个活动按结束时间排列的区间图，时间轴 0 到 14，选中的最大兼容子集为 1、4、8、11">
                  <text x="20" y="22" class="tx-b">11 个活动的区间图：最优解 {1, 4, 8, 11}，共 4 个活动</text>
                  <text x="30" y="49" class="tx-sm">i</text>
                  <text x="62" y="49" class="tx-sm">s</text>
                  <text x="96" y="49" class="tx-sm">f</text>
                  <!-- 时间刻度 -->
                  <line x1="200" y1="58" x2="200" y2="366" stroke="var(--c-line)" stroke-width="1"></line>
                  <line x1="660" y1="58" x2="660" y2="366" stroke="var(--c-line-soft)" stroke-width="1" stroke-dasharray="3 5"></line>
                  <!-- 行 -->
                  <text x="30" y="78" class="tx">1</text><text x="62" y="78" class="tx">1</text><text x="96" y="78" class="tx">4</text>
                  <rect x="245" y="64" width="137" height="17" rx="4" fill="var(--c-tip-bg)" stroke="var(--c-ok)" stroke-width="2.2"></rect>
                  <text x="313" y="76" class="tx-sm tx-b" text-anchor="middle">1</text>
                  <text x="30" y="106" class="tx">2</text><text x="62" y="106" class="tx">3</text><text x="96" y="106" class="tx">5</text>
                  <rect x="336" y="92" width="91" height="17" rx="4" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.2"></rect>
                  <text x="380" y="104" class="tx-sm" text-anchor="middle">2</text>
                  <text x="30" y="134" class="tx">3</text><text x="62" y="134" class="tx">0</text><text x="96" y="134" class="tx">6</text>
                  <rect x="200" y="120" width="274" height="17" rx="4" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.2"></rect>
                  <text x="330" y="132" class="tx-sm" text-anchor="middle">3</text>
                  <text x="30" y="162" class="tx">4</text><text x="62" y="162" class="tx">5</text><text x="96" y="162" class="tx">7</text>
                  <rect x="428" y="148" width="91" height="17" rx="4" fill="var(--c-tip-bg)" stroke="var(--c-ok)" stroke-width="2.2"></rect>
                  <text x="470" y="160" class="tx-sm tx-b" text-anchor="middle">4</text>
                  <text x="30" y="190" class="tx">5</text><text x="62" y="190" class="tx">3</text><text x="96" y="190" class="tx">8</text>
                  <rect x="336" y="176" width="228" height="17" rx="4" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.2"></rect>
                  <text x="446" y="188" class="tx-sm" text-anchor="middle">5</text>
                  <text x="30" y="218" class="tx">6</text><text x="62" y="218" class="tx">5</text><text x="96" y="218" class="tx">9</text>
                  <rect x="428" y="204" width="183" height="17" rx="4" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.2"></rect>
                  <text x="515" y="216" class="tx-sm" text-anchor="middle">6</text>
                  <text x="30" y="246" class="tx">7</text><text x="62" y="246" class="tx">6</text><text x="96" y="246" class="tx">10</text>
                  <rect x="474" y="232" width="183" height="17" rx="4" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.2"></rect>
                  <text x="561" y="244" class="tx-sm" text-anchor="middle">7</text>
                  <text x="30" y="274" class="tx">8</text><text x="62" y="274" class="tx">8</text><text x="96" y="274" class="tx">11</text>
                  <rect x="566" y="260" width="137" height="17" rx="4" fill="var(--c-tip-bg)" stroke="var(--c-ok)" stroke-width="2.2"></rect>
                  <text x="630" y="272" class="tx-sm tx-b" text-anchor="middle">8</text>
                  <text x="30" y="302" class="tx">9</text><text x="62" y="302" class="tx">8</text><text x="96" y="302" class="tx">12</text>
                  <rect x="566" y="288" width="183" height="17" rx="4" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.2"></rect>
                  <text x="653" y="300" class="tx-sm" text-anchor="middle">9</text>
                  <text x="30" y="330" class="tx">10</text><text x="62" y="330" class="tx">2</text><text x="96" y="330" class="tx">13</text>
                  <rect x="291" y="316" width="503" height="17" rx="4" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.2"></rect>
                  <text x="530" y="328" class="tx-sm" text-anchor="middle">10</text>
                  <text x="30" y="358" class="tx">11</text><text x="62" y="358" class="tx">12</text><text x="96" y="358" class="tx">14</text>
                  <rect x="749" y="344" width="91" height="17" rx="4" fill="var(--c-tip-bg)" stroke="var(--c-ok)" stroke-width="2.2"></rect>
                  <text x="790" y="356" class="tx-sm tx-b" text-anchor="middle">11</text>
                  <text x="20" y="386" class="tx-sm">时间轴 0 ~ 14；绿色 = 贪心选中的活动，四个区间 [1,4)、[5,7)、[8,11)、[12,14) 两两不重叠 ⇒ 两两兼容</text>
                </svg>
                <p class="fig-cap">图 4 &nbsp;活动选择的区间图（数据取自 PPT 第 34 页）：<span class="m">{1, 4, 8, 11}</span> 是最大兼容子集</p>
          
                <h3 id="sec-activity-h2">6.2 最优子结构与递归解（PPT 第 31–32 页）</h3>
                <p>定义<b>子问题空间</b>：</p>
                <p class="formula">S<sub>ij</sub> = {a<sub>k</sub> &isin; S : f<sub>i</sub> &le; s<sub>k</sub> &lt; f<sub>k</sub> &le; s<sub>j</sub>}　（第 i 个与第 j 个活动之间的活动）</p>
                <p>为避免边界讨论，<b>虚构</b>活动 <span class="m">a<sub>0</sub></span> 与 <span class="m">a<sub>n+1</sub></span>，令 <span class="m">f<sub>0</sub> = 0</span>、<span class="m">f<sub>n+1</sub> = &infin;</span>，于是 <span class="m">S = S<sub>0,n+1</sub></span>。并假设 <span class="m">f<sub>0</sub> &le; f<sub>1</sub> &le; f<sub>2</sub> &le; … &le; f<sub>n</sub> &lt; f<sub>n+1</sub></span>；当 <span class="m">i &ge; j</span> 时 <span class="m">S<sub>ij</sub> = &empty;</span>。</p>
                <p><b>最优子结构</b>：令 <span class="m">S<sub>ij</sub></span> 的最优解为 <span class="m">A<sub>ij</sub></span>，若 <span class="m">A<sub>ij</sub></span> 中包含活动 <span class="m">a<sub>k</sub></span>，则</p>
                <p class="formula">A<sub>ij</sub> = A<sub>ik</sub> &cup; {a<sub>k</sub>} &cup; A<sub>kj</sub></p>
                <p>其中 <span class="m">A<sub>ik</sub></span> 是 <span class="m">S<sub>ik</sub></span> 的最优解、<span class="m">A<sub>kj</sub></span> 是 <span class="m">S<sub>kj</sub></span> 的最优解。于是有<b>递归解</b>（第 32 页）：</p>
                <p class="formula">c[i, j] = 0（若 S<sub>ij</sub> = &empty;）；&nbsp; c[i, j] = max<sub>i&lt;k&lt;j, a<sub>k</sub>&isin;S<sub>ij</sub></sub> { c[i, k] + c[k, j] + 1 }（若 S<sub>ij</sub> &ne; &empty;）</p>
                <p>「由此可以设计一个动态规划求解方法」—— 第 32 页紧接着问：<b>活动选择问题是否可以使用贪心算法求解？</b>下面的定理给出肯定回答，并顺手把 DP 的三层循环降成一次扫描。</p>
          
                <h3 id="sec-activity-h3">6.3 贪心选择：选结束最早的活动（PPT 第 33–34 页）</h3>
                <div class="callout key">
                  <p class="callout-h">基本思想</p>
                  <p>选出活动后，剩下的资源应能被<b>尽量多</b>的其他任务所用 &rArr; <b>选择最早结束的活动</b>。</p>
                </div>
                <div class="callout key">
                  <p class="callout-h">定理（贪心选择性质）</p>
                  <p>对于任意非空子问题 <span class="m">S<sub>ij</sub></span>，设 <span class="m">a<sub>m</sub></span> 是 <span class="m">S<sub>ij</sub></span> 中具有<b>最早结束时间</b>的活动：<span class="m">f<sub>m</sub> = min{f<sub>k</sub> : a<sub>k</sub> &isin; S<sub>ij</sub>}</span>，那么</p>
                  <ul>
                    <li>活动 <span class="m">a<sub>m</sub></span> 在 <span class="m">S<sub>ij</sub></span> 的<b>某个</b>最大兼容活动子集中；</li>
                    <li>子问题 <span class="m">S<sub>im</sub></span> 为空，所以选择 <span class="m">a<sub>m</sub></span> 将使子问题 <span class="m">S<sub>mj</sub></span> 成为<b>唯一可能非空</b>的子问题。</li>
                  </ul>
                </div>
                <p><b>证明</b>（交换论证；PPT 第 34 页只给结论，这里是补充的完整证明）：设 <span class="m">A<sub>ij</sub></span> 是 <span class="m">S<sub>ij</sub></span> 的一个最大兼容子集，把 <span class="m">A<sub>ij</sub></span> 中的活动按结束时间排序，第一个是 <span class="m">a<sub>k</sub></span>（故 <span class="m">f<sub>k</sub> &ge; f<sub>m</sub></span>，因为 <span class="m">a<sub>m</sub></span> 结束最早）。</p>
                <ul>
                  <li>若 <span class="m">k = m</span>，则 <span class="m">a<sub>m</sub></span> 已在该最优解中，结论成立；</li>
                  <li>若 <span class="m">k &ne; m</span>，构造 <span class="m">A&prime; = A<sub>ij</sub> &minus; {a<sub>k</sub>} &cup; {a<sub>m</sub>}</span>。因为 <span class="m">a<sub>m</sub></span> 是 <span class="m">S<sub>ij</sub></span> 中最早结束的，且 <span class="m">f<sub>m</sub> &le; f<sub>k</sub></span>，所以 <span class="m">a<sub>m</sub></span> 与 <span class="m">A<sub>ij</sub></span> 中除 <span class="m">a<sub>k</sub></span> 外的所有活动都兼容（它们的开始时间都 <span class="m">&ge; f<sub>k</sub> &ge; f<sub>m</sub></span>）；于是 <span class="m">A&prime;</span> 也是最大兼容子集，且含 <span class="m">a<sub>m</sub></span>。</li>
                </ul>
                <p>又因为 <span class="m">a<sub>m</sub></span> 结束最早，任何开始时间早于 <span class="m">f<sub>m</sub></span> 的活动都不在 <span class="m">S<sub>ij</sub></span> 内，故 <span class="m">S<sub>im</sub> = &empty;</span>，选完 <span class="m">a<sub>m</sub></span> 只剩一个子问题 <span class="m">S<sub>mj</sub></span> 要解 —— 这就是「每次只做一个选择、不回头」的结构性原因。&#8718;</p>
          
                <h3 id="sec-activity-h4">6.4 递归版与迭代版</h3>
                <p><b>递归贪心算法</b>（PPT 第 35 页，伪代码来自该页的文本框；初始调用 <code>RECURSIVE-ACTIVITY-SELECTOR(s, f, 0, n)</code>）：</p>
          
                <div class="code-pair">
                  <div class="code-col">
                    <p class="code-h">伪代码（递归）</p>
                    <pre class="code"><code>RECURSIVE-ACTIVITY-SELECTOR(s, f, i, n)   // 参数：开始/结束时间数组、当前下标 i、活动数 n
          /* Assume f1 ≤ f2 ≤ … ≤ fn. */        // 前置条件：活动已按结束时间升序
          1  m ← i + 1                          // 从 i 的下一个活动开始找
          2  while m ≤ n and s_m &lt; f_i          // 跳过所有与 i 不兼容的活动
          3      do m ← m + 1                   // 不兼容就往后挪一个
          4  if m ≤ n                           // 找到了第一个兼容的活动
          5      then return {a_m} ∪ RECURSIVE-ACTIVITY-SELECTOR(s, f, m, n)  // 选它并递归
          6      else return ∅                  // 没有兼容活动，递归到底返回空集</code></pre>
                  </div>
                  <div class="code-col">
                    <p class="code-h">C++（递归）</p>
                    <pre class="code cpp"><code>#include &lt;cstdio&gt;                  // 打印结果
          const int N = 11;                  // 活动个数（PPT 第 34 页的 11 个活动）
          int s[N + 1] = {0, 1, 3, 0, 5, 3, 5, 6, 8, 8, 2, 12};     // s[1..11] 开始时间
          int f[N + 1] = {0, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14}; // f[1..11] 结束时间（升序）
          
          int recurActivity(int i) {         // 返回 i 之后还能选出的活动数
              int m = i + 1;                 // 从 i 的下一个活动开始找
              while (m &lt;= N &amp;&amp; s[m] &lt; f[i]) { ++m; }  // 跳过与 i 不兼容的活动
              if (m &lt;= N) { return 1 + recurActivity(m); }  // 选 m 后继续递归
              return 0;                      // 没有可选的，返回 0
          }
          
          int main() {                       // 主函数：从活动 1 开始算
              printf("递归版活动数 = %d\\n", 1 + recurActivity(1)); // 1 也要计入
              return 0;                      // 正常结束
          }</code></pre>
                  </div>
                </div>
          
                <p><b>迭代贪心算法</b>（PPT 第 36 页原样 8 行）：</p>
          
                <div class="code-pair">
                  <div class="code-col">
                    <p class="code-h">伪代码（迭代）</p>
                    <pre class="code"><code>GREEDY-ACTIVITY-SELECTOR(s, f)        // 输入：开始时间数组 s、结束时间数组 f
          /* Assume f1 ≤ f2 ≤ … ≤ fn. */        // 前置条件：f1 ≤ f2 ≤ … ≤ fn
          1  n ← length[s]                      // 活动总数
          2  A ← {1}                            // 贪心第一步：必选结束最早的 1 号
          3  j ← 1                              // j 记录上一次选中的活动
          4  for i ← 2 to n                     // 按结束时间升序扫描其余活动
          5      if s_i ≥ f_j                   // 兼容判定：开始不早于上次的结束
          6          A ← A ∪ {i}                // 选中活动 i
          7          j ← i                      // 更新 j 为 i
          8  return A                           // 返回最大兼容子集</code></pre>
                  </div>
                  <div class="code-col">
                    <p class="code-h">C++（迭代）</p>
                    <pre class="code cpp"><code>#include &lt;cstdio&gt;                  // 打印结果
          #include &lt;vector&gt;                  // 存放活动集合
          using namespace std;               // 使用标准命名空间
          const int N = 11;                  // 活动个数
          int s[N + 1] = {0, 1, 3, 0, 5, 3, 5, 6, 8, 8, 2, 12};     // 开始时间
          int f[N + 1] = {0, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14}; // 结束时间
          
          void greedyActivity() {            // 迭代版：GREEDY-ACTIVITY-SELECTOR
              vector&lt;int&gt; A;                 // 选中的活动集合
              A.push_back(1);                // 贪心第一步：必选结束最早的 1 号活动
              int j = 1;                     // j 记录上一次选中的活动
              for (int i = 2; i &lt;= N; ++i) { // 按结束时间升序扫描其余活动
                  if (s[i] &gt;= f[j]) {        // 兼容判定：s_i ≥ f_j
                      A.push_back(i);        // 选中活动 i
                      j = i;                 // 更新 j 为 i
                  }
              }
              printf("迭代版 A = {");        // 打印结果
              for (size_t k = 0; k &lt; A.size(); ++k) {         // 逐个输出编号
                  printf("%s%d", k ? ", " : "", A[k]);        // 逗号分隔
              }
              printf("}，共 %d 个\\n", (int)A.size());         // 共 4 个
          }
          
          int main() {                       // 主函数：跑一次迭代贪心
              greedyActivity();              // 迭代贪心求最大兼容子集
              return 0;                      // 正常结束
          }</code></pre>
                  </div>
                </div>
                <p>实测输出 <code>迭代版 A = {1, 4, 8, 11}，共 4 个</code>，与下表逐行推演一致。</p>
          
                <h3 id="sec-activity-h5">6.5 动画与逐步推演</h3>
        ` },
        { type: 'demo', name: 'activity-select', title: "活动选择：按 f 升序扫描，判定 s_i ≥ f_j（15 步）" },
        { type: 'html', html: `
          <table class="tbl">
                  <thead><tr><th>i</th><th>s<sub>i</sub></th><th>f<sub>i</sub></th><th>比较的 f<sub>j</sub></th><th>s<sub>i</sub> &ge; f<sub>j</sub> ?</th><th>动作</th><th>A</th><th>j</th></tr></thead>
                  <tbody>
                    <tr><td class="num">1</td><td class="num">1</td><td class="num">4</td><td>—</td><td>—</td><td>贪心初始必选</td><td>{1}</td><td class="num">1</td></tr>
                    <tr><td class="num">2</td><td class="num">3</td><td class="num">5</td><td>f<sub>1</sub>=4</td><td>3 &lt; 4 &nbsp;&#10007;</td><td>跳过</td><td>{1}</td><td class="num">1</td></tr>
                    <tr><td class="num">3</td><td class="num">0</td><td class="num">6</td><td>f<sub>1</sub>=4</td><td>0 &lt; 4 &nbsp;&#10007;</td><td>跳过</td><td>{1}</td><td class="num">1</td></tr>
                    <tr><td class="num">4</td><td class="num">5</td><td class="num">7</td><td>f<sub>1</sub>=4</td><td>5 &ge; 4 &nbsp;&#10003;</td><td><b>选中</b></td><td>{1,4}</td><td class="num">4</td></tr>
                    <tr><td class="num">5</td><td class="num">3</td><td class="num">8</td><td>f<sub>4</sub>=7</td><td>3 &lt; 7 &nbsp;&#10007;</td><td>跳过</td><td>{1,4}</td><td class="num">4</td></tr>
                    <tr><td class="num">6</td><td class="num">5</td><td class="num">9</td><td>f<sub>4</sub>=7</td><td>5 &lt; 7 &nbsp;&#10007;</td><td>跳过</td><td>{1,4}</td><td class="num">4</td></tr>
                    <tr><td class="num">7</td><td class="num">6</td><td class="num">10</td><td>f<sub>4</sub>=7</td><td>6 &lt; 7 &nbsp;&#10007;</td><td>跳过</td><td>{1,4}</td><td class="num">4</td></tr>
                    <tr><td class="num">8</td><td class="num">8</td><td class="num">11</td><td>f<sub>4</sub>=7</td><td>8 &ge; 7 &nbsp;&#10003;</td><td><b>选中</b></td><td>{1,4,8}</td><td class="num">8</td></tr>
                    <tr><td class="num">9</td><td class="num">8</td><td class="num">12</td><td>f<sub>8</sub>=11</td><td>8 &lt; 11 &nbsp;&#10007;</td><td>跳过</td><td>{1,4,8}</td><td class="num">8</td></tr>
                    <tr><td class="num">10</td><td class="num">2</td><td class="num">13</td><td>f<sub>8</sub>=11</td><td>2 &lt; 11 &nbsp;&#10007;</td><td>跳过</td><td>{1,4,8}</td><td class="num">8</td></tr>
                    <tr><td class="num">11</td><td class="num">12</td><td class="num">14</td><td>f<sub>8</sub>=11</td><td>12 &ge; 11 &nbsp;&#10003;</td><td><b>选中</b></td><td>{1,4,8,11}</td><td class="num">11</td></tr>
                  </tbody>
                </table>
                <p>最优性是 4：11 个活动共有 <span class="m">2<sup>11</sup> = 2048</span> 个活动子集，穷举可知最大兼容子集的大小恰为 4（另一组同样大小的解是 <span class="m">{2,4,8,11}</span> 等），贪心解正好达到下界以上所说的最优值。</p>
          
                <div class="callout warn">
                  <p class="callout-h">易错：换个贪心准则就错</p>
                  <p>若按「<b>开始最早</b>」贪心：先选 <span class="m">s</span> 最小的活动 3（<span class="m">[0,6)</span>），接着只能选 7（<span class="m">[6,10)</span>），再选 11（<span class="m">[12,14)</span>），得到 <span class="m">{3,7,11}</span> 只有 <b>3</b> 个，比最优少 1 个。若按「<b>时长最短</b>」贪心，在本例的 4 活动子集上勉强还能得到 2 个（与最优相同），但换一组数据同样会失效。这说明：贪心准则必须<b>证明</b>，不能凭直觉挑。</p>
                </div>
          
                <h3 id="sec-activity-h6">6.6 复杂度</h3>
                <ul>
                  <li><b>不计排序</b>：循环从 <span class="m">i = 2</span> 跑到 <span class="m">n</span>，每次 O(1)，故 <b>O(n)</b>（PPT 第 36 页原文）。</li>
                  <li><b>计入排序</b>：若输入未按 <span class="m">f</span> 升序，排序需 <span class="m">O(n lg n)</span>，总时间 <b>O(n lg n)</b>。</li>
                  <li>空间：迭代版 O(1) 辅助（不计输出集合），递归版栈深最坏 <span class="m">O(n)</span>。</li>
                  <li>对比 DP：递归式 <span class="m">c[i,j]</span> 有 <span class="m">O(n<sup>2</sup>)</span> 个状态、每状态 <span class="m">O(n)</span> 个 <span class="m">k</span>，DP 是 <span class="m">O(n<sup>3</sup>)</span> —— 贪心把它压到 <span class="m">O(n)</span>（不计排序）。</li>
                </ul>
          
                <div class="callout key">
                  <p class="callout-h">本节考点</p>
                  <ul>
                    <li>兼容定义与<b>按 f 升序</b>这个前提；</li>
                    <li>贪心准则 = <b>结束最早</b>，以及它的交换论证；</li>
                    <li><span class="m">S<sub>ij</sub></span> 的定义、<span class="m">A<sub>ij</sub> = A<sub>ik</sub> &cup; {a<sub>k</sub>} &cup; A<sub>kj</sub></span>、<span class="m">c[i,j]</span> 递归式；</li>
                    <li>两个伪代码（递归 / 迭代）与 <b>O(n)</b>、<b>O(n lg n)</b>。</li>
                  </ul>
                </div>
        ` },
      ],
    },
    {
      id: 'sec-huffman',
      heading: "7. 哈夫曼编码：让高频字符拿到短码字",
      blocks: [
        { type: 'html', html: `
          <h3 id="sec-huffman-h1">7.1 从定长码到变长码（PPT 第 37 页）</h3>
                <p>哈夫曼编码用于<b>数据压缩、指令集编码</b>等等。基本设定是<b>二进制串码</b>：每个字符用一个唯一的二进制字符串表示。</p>
                <ul>
                  <li><b>固定长度码</b>（块码）：<code>a: 000, b: 001, …, f: 101</code>，于是 <code>ace &rarr; 000 010 100</code>；</li>
                  <li><b>可变长度码</b>：常用的字符给<b>短的码字</b>，不常用的字符给<b>长的码字</b>，从而降低总位数。</li>
                </ul>
                <p>PPT 第 37 页的表格（6 个字符、按 100 个字符计代价）把收益量化了：</p>
                <table class="tbl">
                  <thead><tr><th></th><th>a</th><th>b</th><th>c</th><th>d</th><th>e</th><th>f</th><th>cost / 100 characters</th></tr></thead>
                  <tbody>
                    <tr><td>Frequency</td><td class="num">45</td><td class="num">13</td><td class="num">12</td><td class="num">16</td><td class="num">9</td><td class="num">5</td><td class="num">—</td></tr>
                    <tr><td>Fixed-length codeword</td><td class="num">000</td><td class="num">001</td><td class="num">010</td><td class="num">011</td><td class="num">100</td><td class="num">101</td><td class="num">300</td></tr>
                    <tr><td>Variable-length codeword</td><td class="num">0</td><td class="num">101</td><td class="num">100</td><td class="num">111</td><td class="num">1101</td><td class="num">1100</td><td class="num"><b>224</b></td></tr>
                  </tbody>
                </table>
                <p>同样 100 个字符，定长码要 <b>300</b> bit，变长码只要 <b>224</b> bit。</p>
          
                <h3 id="sec-huffman-h2">7.2 前缀码与二叉树</h3>
                <div class="callout key">
                  <p class="callout-h">前缀码 (prefix code)</p>
                  <p><b>任何一个字符的编码都不能是其他字符编码的前缀。</b></p>
                </div>
                <p>前缀码与二叉树一一对应：把字符放在<b>叶子</b>上，内部节点向左的边记 0、向右的边记 1，则<b>根到叶的路径</b>就是该字符的码字。因为字符只在叶子上，任何码字都不会是另一个码字的前缀 —— 于是解码时不需要分隔符，<b>每走到一个叶子就回根重新开始</b>即可。</p>
          
                <svg class="fig" viewBox="0 0 860 320" role="img" aria-label="前缀码与二叉树的对应关系：左图把四个码字 000、001、01、1 放在叶子上，右图说明定长码 300 与变长码 224 的代价差别">
                  <text x="20" y="22" class="tx-b">二叉树 &harr; 前缀码：字符只放在叶子上，左 0 右 1</text>
                  <!-- 树 -->
                  <line x1="160" y1="52" x2="110" y2="112" stroke="var(--c-line)" stroke-width="1.8"></line>
                  <line x1="160" y1="52" x2="300" y2="112" stroke="var(--c-line)" stroke-width="1.8"></line>
                  <line x1="110" y1="112" x2="70" y2="172" stroke="var(--c-line)" stroke-width="1.8"></line>
                  <line x1="110" y1="112" x2="175" y2="172" stroke="var(--c-line)" stroke-width="1.8"></line>
                  <line x1="70" y1="172" x2="35" y2="232" stroke="var(--c-line)" stroke-width="1.8"></line>
                  <line x1="70" y1="172" x2="110" y2="232" stroke="var(--c-line)" stroke-width="1.8"></line>
                  <text x="122" y="92" class="tx-sm" text-anchor="middle">0</text>
                  <text x="244" y="92" class="tx-sm" text-anchor="middle">1</text>
                  <text x="76" y="150" class="tx-sm" text-anchor="middle">1</text>
                  <text x="88" y="152" class="tx-sm" text-anchor="middle">0</text>
                  <text x="40" y="210" class="tx-sm" text-anchor="middle">0</text>
                  <text x="104" y="210" class="tx-sm" text-anchor="middle">1</text>
                  <circle cx="160" cy="52" r="13" fill="var(--c-panel-2)" stroke="var(--c-accent)" stroke-width="1.8"></circle>
                  <circle cx="110" cy="112" r="11" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.5"></circle>
                  <circle cx="70" cy="172" r="11" fill="var(--c-panel-2)" stroke="var(--c-line)" stroke-width="1.5"></circle>
                  <rect x="277" y="100" width="46" height="24" rx="4" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="1.6"></rect>
                  <text x="300" y="117" class="tx" text-anchor="middle">1</text>
                  <rect x="152" y="160" width="46" height="24" rx="4" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="1.6"></rect>
                  <text x="175" y="177" class="tx" text-anchor="middle">01</text>
                  <rect x="12" y="220" width="48" height="24" rx="4" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="1.6"></rect>
                  <text x="36" y="237" class="tx" text-anchor="middle">000</text>
                  <rect x="86" y="220" width="48" height="24" rx="4" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="1.6"></rect>
                  <text x="110" y="237" class="tx" text-anchor="middle">001</text>
                  <text x="20" y="286" class="tx-sm">4 个码字 {000, 001, 01, 1} 互不为前缀；解码 1 01 000 001 时，走到叶子就回根</text>
                  <!-- 右侧说明 -->
                  <line x1="360" y1="40" x2="360" y2="300" stroke="var(--c-line-soft)" stroke-width="1.2" stroke-dasharray="4 5"></line>
                  <text x="384" y="60" class="tx-b">定长码（块码）</text>
                  <text x="384" y="84" class="tx-sm">6 个字符至少需要 3 bit（2² &lt; 6 &le; 2³ = 8）</text>
                  <text x="384" y="108" class="tx-sm">编码 100 个字符的代价 = 3 &times; 100 = 300 bit</text>
                  <text x="384" y="146" class="tx-b">变长码</text>
                  <text x="384" y="170" class="tx-sm">a:0、b:101、c:100、d:111、e:1101、f:1100</text>
                  <text x="384" y="194" class="tx-sm">B(T) = 45&times;1 + 13&times;3 + 12&times;3 + 16&times;3 + 9&times;4 + 5&times;4 = 224</text>
                  <text x="384" y="232" class="tx-b">为什么能省？</text>
                  <text x="384" y="256" class="tx-sm">高频的 a 用 1 位，低频的 e、f 用 4 位；</text>
                  <text x="384" y="280" class="tx-sm">只要「没有任何码字是别人的前缀」，就能唯一切分解码</text>
                </svg>
                <p class="fig-cap">图 5 &nbsp;前缀码与二叉树的对应（左），以及定长码 300 vs 变长码 224 的代价对比（右，数据取自 PPT 第 37 页表）</p>
          
                <h3 id="sec-huffman-h3">7.3 编码费用与设计目标（PPT 第 39 页）</h3>
                <p>树 <span class="m">T</span> 的编码费用定义为</p>
                <p class="formula">B(T) = &sum;<sub>c&isin;C</sub> f(c) &middot; d<sub>T</sub>(c)</p>
                <ul>
                  <li><span class="m">c</span>：字符集 <span class="m">C</span> 中的字符；</li>
                  <li><span class="m">f(c)</span>：<span class="m">c</span> 出现的频率；</li>
                  <li><span class="m">d<sub>T</sub>(c)</span>：<span class="m">c</span> 的叶子的深度，也就是码字 <span class="m">c</span> 的长度。</li>
                </ul>
                <p><b>编码设计问题</b>：给定 <span class="m">f(c<sub>1</sub>), f(c<sub>2</sub>), …, f(c<sub>n</sub>)</span>，创建一棵有 <span class="m">n</span> 个叶子的二叉树，使得 <span class="m">B(T)</span> 最小。思路是「<b>常用的字符使用短的深度</b>」。</p>
          
                <h3 id="sec-huffman-h4">7.4 构造过程：每次合并最小的两个（PPT 第 40 页）</h3>
                <div class="callout">
                  <p class="callout-h">一句话规则</p>
                  <p><b>每步将费用（频率）最小的两个节点配对</b>，新节点的频率为二者之和，直到只剩一个根。</p>
                </div>
                <p>用课堂练习的数据 <span class="m">C = {a,b,c,d,e,f,g,h}</span>、<span class="m">f = {83,14,28,38,131,29,20,57}</span> 走一遍，共 <span class="m">n &minus; 1 = 7</span> 次合并：</p>
                <table class="tbl">
                  <thead><tr><th>第几步</th><th>取出的两个最小节点</th><th>合并成</th><th>合并后队列中的节点（频率）</th></tr></thead>
                  <tbody>
                    <tr><td class="num">1</td><td>b(14)、g(20)</td><td class="num">34</td><td>c:28、f:29、d:38、h:57、a:83、e:131、34</td></tr>
                    <tr><td class="num">2</td><td>c(28)、f(29)</td><td class="num">57</td><td>d:38、h:57、a:83、e:131、34、57</td></tr>
                    <tr><td class="num">3</td><td>34、d(38)</td><td class="num">72</td><td>h:57、a:83、e:131、57、72</td></tr>
                    <tr><td class="num">4</td><td>h(57)、57</td><td class="num">114</td><td>a:83、e:131、72、114</td></tr>
                    <tr><td class="num">5</td><td>72、a(83)</td><td class="num">155</td><td>e:131、114、155</td></tr>
                    <tr><td class="num">6</td><td>114、e(131)</td><td class="num">245</td><td>155、245</td></tr>
                    <tr><td class="num">7</td><td>155、245</td><td class="num">400</td><td>400（根，= 总频率）</td></tr>
                  </tbody>
                </table>
                <p>第 4 步两个节点都是 57（原字符 h 与刚合成的 c+f），谁在左谁在右都不影响码长，只影响具体的 0/1 串 —— 所以<b>码字不唯一，但码长与 B(T) 唯一</b>。</p>
          
                <h3 id="sec-huffman-h5">7.5 HUFFMAN 伪代码 + C++</h3>
                <div class="code-pair">
                  <div class="code-col">
                    <p class="code-h">伪代码（PPT 第 41 页）</p>
                    <pre class="code"><code>HUFFMAN(C)                           // 输入：字符集 C（每个字符带频率 f）
          1  n ← |C|                            // 字符个数，也就是叶子的个数
          2  Q ← C                              // 把所有叶子放进优先队列 Q
          3  for i ← 1 to n-1                   // 一共要做 n−1 次合并
          4      z ← Allocate-Node()            // 申请一个新节点 z
          5      x ← left[z] ← Extract-Min(Q)   // 取出频率最小的作为左孩子
          6      y ← right[z] ← Extract-Min(Q)  // 再取出频率次小的作为右孩子
          7      f[z] ← f[x] + f[y]             // 新节点频率 = 两个孩子频率之和
          8      Insert(Q, z)                   // 把 z 重新插回优先队列
          9  return Extract-Min(Q)              // 队列里最后剩下的就是根</code></pre>
                  </div>
                  <div class="code-col">
                    <p class="code-h">C++</p>
                    <pre class="code cpp"><code>#include &lt;cstdio&gt;                  // 打印码字与代价
          #include &lt;queue&gt;                   // 小根堆
          #include &lt;vector&gt;                  // 节点池
          #include &lt;string&gt;                  // 码字用 string 拼接
          using namespace std;               // 使用标准命名空间
          
          struct Node {                      // 哈夫曼树的节点
              int f;                         // 频率
              char ch;                       // 叶子的字符；内部节点记 0
              int l, r;                      // 左右孩子的下标
          };                                 // 节点结构体定义结束
          vector&lt;Node&gt; tr;                   // 节点池，下标即节点编号
          
          struct Cmp {                       // 小根堆比较器
              bool operator()(int a, int b) const {           // a、b 是节点下标
                  if (tr[a].f != tr[b].f) { return tr[a].f &gt; tr[b].f; } // 频率小的优先
                  return a &gt; b;              // 频率相同时编号小的优先（保证稳定）
              }
          };                                 // 比较器定义结束
          priority_queue&lt;int, vector&lt;int&gt;, Cmp&gt; Q;            // 存放节点下标的小根堆
          
          int huffman() {                    // 建树，返回根节点下标
              int n = (int)tr.size();        // 叶子个数
              for (int i = 0; i &lt; n; ++i) { Q.push(i); }      // 全部叶子入堆
              for (int i = 1; i &lt;= n - 1; ++i) {              // 共做 n-1 次合并
                  int x = Q.top(); Q.pop();  // 取出频率最小的节点 x
                  int y = Q.top(); Q.pop();  // 取出频率次小的节点 y
                  Node z;                    // 新内部节点
                  z.f = tr[x].f + tr[y].f;   // 频率为二者之和
                  z.ch = 0;                  // 内部节点没有字符
                  z.l = x;                   // 左孩子 x（编码时记 0）
                  z.r = y;                   // 右孩子 y（编码时记 1）
                  tr.push_back(z);           // 新节点加入节点池
                  Q.push((int)tr.size() - 1);// 新节点入堆
              }
              return Q.top();                // 堆中最后的节点就是根
          }
          
          int totalBits = 0;                 // Σ f(c)·d(c)，也就是 B(T)
          int totalFreq = 0;                 // Σ f(c)，频率之和
          
          void dfs(int u, string code) {     // 从根出发求每个叶子的码字
              if (tr[u].ch != 0) {           // 是叶子：记录码字
                  totalBits += tr[u].f * (int)code.size();    // 累加 f·d
                  totalFreq += tr[u].f;                        // 累加频率
                  printf("  %c  f=%3d  d=%d  code=%s\\n", tr[u].ch, tr[u].f, (int)code.size(), code.c_str());  // 打印该字符的码字
                  return;                    // 叶子结束，回溯
              }
              dfs(tr[u].l, code + "0");      // 左分支追加 0
              dfs(tr[u].r, code + "1");      // 右分支追加 1
          }
          
          int main() {                       // 主函数：建 8 个叶子后建树、输出码字
              char C[8] = {'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'};  // 字符集
              int F[8] = {83, 14, 28, 38, 131, 29, 20, 57};          // 对应频率
              for (int i = 0; i &lt; 8; ++i) {  // 每个字符建一个叶子节点
                  Node t; t.f = F[i]; t.ch = C[i]; t.l = -1; t.r = -1; // 叶子无孩子
                  tr.push_back(t);           // 加入节点池
              }
              int root = huffman();          // 构造哈夫曼树
              printf("码字表：\\n");          // 打印表头
              dfs(root, "");                 // 遍历打印码字
              printf("B(T) = %d，Σf = %d，平均码长 = %.4f\\n", totalBits, totalFreq, (double)totalBits / totalFreq);  // 输出 1077 与 2.6925
              printf("定长码代价 = 3 * %d = %d\\n", totalFreq, 3 * totalFreq);  // 输出定长码总代价 1200
              return 0;                      // 正常结束
          }</code></pre>
                  </div>
                </div>
                <p>实测输出（节选）：<code>b f=14 d=4 code=0000 … e f=131 d=2 code=11</code>，以及 <code>B(T) = 1077，Σf = 400，平均码长 = 2.6925</code>。</p>
          
                <h3 id="sec-huffman-h6">7.6 动画：7 次合并长成一棵树</h3>
        ` },
        { type: 'demo', name: 'huffman', title: "哈夫曼编码：课堂练习的频率逐次合并，末步给出码字与平均码长（16 步）" },
        { type: 'html', html: `
          <h3 id="sec-huffman-h7">7.7 贪心选择与最优子结构（PPT 第 42–43 页）</h3>
                <p><b>贪心选择</b>（第 42 页）：两个频率最低的字符 <span class="m">x</span> 和 <span class="m">y</span>，<b>长度相同而且仅仅是最后一位不同</b>。也就是说存在一棵最优树，让它们成为最深的一对兄弟叶子。PPT 用三次交换来说明（树 <span class="m">T &rarr; T&prime; &rarr; T&Prime;</span> 始终是最优树，每次交换都不增加 <span class="m">B</span>）：</p>
                <ol>
                  <li>把最深的叶子上的字符与 <span class="m">x</span> 交换 &rarr; <span class="m">B(T&prime;) &le; B(T)</span>；</li>
                  <li>再把另一个最深叶子上的字符与 <span class="m">y</span> 交换 &rarr; <span class="m">B(T&Prime;) &le; B(T&prime;)</span>；</li>
                  <li>于是 <span class="m">x</span>、<span class="m">y</span> 位于最深的兄弟叶子，码长相同、仅最后一位不同。</li>
                </ol>
                <p><b>最优子结构</b>（第 43 页）：令 <span class="m">T</span> 为 <span class="m">C</span> 的最优前缀码二叉树，令 <span class="m">z</span> 为两个叶子字符 <span class="m">x</span>、<span class="m">y</span> 的父亲，且 <span class="m">f[z] = f[x] + f[y]</span>；则树 <span class="m">T&prime; = T &minus; {x, y}</span> 表示 <span class="m">C&prime; = C &minus; {x, y} &cup; {z}</span> 的<b>最优</b>前缀码。</p>
                <p><b>证明</b>（PPT 第 43 页图，反证）：若 <span class="m">T&prime;</span> 不是最优，则存在 <span class="m">T&Prime;</span> 使 <span class="m">B(T&Prime;) &lt; B(T&prime;)</span>。在 <span class="m">T&Prime;</span> 中 <span class="m">z</span> 是叶子（因为 <span class="m">z &isin; C&prime;</span>），把 <span class="m">x</span>、<span class="m">y</span> 挂到 <span class="m">z</span> 下面得到 <span class="m">T&Prime;&Prime;</span>，则</p>
                <p class="formula">B(T&Prime;&Prime;) = B(T&Prime;) + f(x) + f(y) &lt; B(T&prime;) + f(x) + f(y) = B(T)</p>
                <p>与 <span class="m">T</span> 最优矛盾。&#8718; 这个式子很值得记：<b>合并一次，代价正好增加 <span class="m">f(x)+f(y)</span></b>，所以 <span class="m">B(T) = B(T&prime;) + f(x) + f(y)</span>。</p>
          
                <h3 id="sec-huffman-h8">7.8 课堂练习：求最优前缀码与平均码长</h3>
                <p>题目（PPT 第 45 页）：给定字符集 <span class="m">C = {a, b, c, d, e, f, g, h}</span>，各字符出现的频率分别为 <span class="m">{83, 14, 28, 38, 131, 29, 20, 57}</span>，求最优前缀码和平均码长。</p>
          
                <svg class="fig" viewBox="0 0 800 430" role="img" aria-label="课堂练习的哈夫曼树：8 个叶子按频率合并 7 次得到根 400，各字符码字为 a=01 b=0000 c=1010 d=001 e=11 f=1011 g=0001 h=100">
                  <text x="20" y="22" class="tx-b">课堂练习的哈夫曼树：根 400 = Σf，加权路径长 B(T) = 1077</text>
                  <!-- 边 -->
                  <line x1="435" y1="60" x2="266" y2="130" stroke="var(--c-line)" stroke-width="1.8"></line>
                  <line x1="435" y1="60" x2="604" y2="130" stroke="var(--c-line)" stroke-width="1.8"></line>
                  <line x1="266" y1="130" x2="188" y2="200" stroke="var(--c-line)" stroke-width="1.8"></line>
                  <line x1="266" y1="130" x2="345" y2="340" stroke="var(--c-line)" stroke-width="1.8"></line>
                  <line x1="188" y1="200" x2="120" y2="270" stroke="var(--c-line)" stroke-width="1.8"></line>
                  <line x1="188" y1="200" x2="255" y2="340" stroke="var(--c-line)" stroke-width="1.8"></line>
                  <line x1="120" y1="270" x2="75" y2="340" stroke="var(--c-line)" stroke-width="1.8"></line>
                  <line x1="120" y1="270" x2="165" y2="340" stroke="var(--c-line)" stroke-width="1.8"></line>
                  <line x1="604" y1="130" x2="502" y2="200" stroke="var(--c-line)" stroke-width="1.8"></line>
                  <line x1="604" y1="130" x2="705" y2="340" stroke="var(--c-line)" stroke-width="1.8"></line>
                  <line x1="502" y1="200" x2="435" y2="340" stroke="var(--c-line)" stroke-width="1.8"></line>
                  <line x1="502" y1="200" x2="570" y2="270" stroke="var(--c-line)" stroke-width="1.8"></line>
                  <line x1="570" y1="270" x2="525" y2="340" stroke="var(--c-line)" stroke-width="1.8"></line>
                  <line x1="570" y1="270" x2="615" y2="340" stroke="var(--c-line)" stroke-width="1.8"></line>
                  <!-- 0/1 标记 -->
                  <text x="340" y="95" class="tx-sm" text-anchor="middle">0</text>
                  <text x="530" y="95" class="tx-sm" text-anchor="middle">1</text>
                  <text x="218" y="168" class="tx-sm" text-anchor="middle">0</text>
                  <text x="316" y="240" class="tx-sm" text-anchor="middle">1</text>
                  <text x="142" y="238" class="tx-sm" text-anchor="middle">0</text>
                  <text x="232" y="310" class="tx-sm" text-anchor="middle">1</text>
                  <text x="88" y="310" class="tx-sm" text-anchor="middle">0</text>
                  <text x="152" y="310" class="tx-sm" text-anchor="middle">1</text>
                  <text x="546" y="168" class="tx-sm" text-anchor="middle">0</text>
                  <text x="668" y="240" class="tx-sm" text-anchor="middle">1</text>
                  <text x="458" y="276" class="tx-sm" text-anchor="middle">0</text>
                  <text x="546" y="306" class="tx-sm" text-anchor="middle">1</text>
                  <text x="538" y="310" class="tx-sm" text-anchor="middle">0</text>
                  <text x="602" y="310" class="tx-sm" text-anchor="middle">1</text>
                  <!-- 内部节点 -->
                  <circle cx="435" cy="60" r="21" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="2.2"></circle>
                  <text x="435" y="65" class="tx tx-b" text-anchor="middle">400</text>
                  <circle cx="266" cy="130" r="21" fill="var(--c-panel-2)" stroke="var(--c-accent)" stroke-width="1.8"></circle>
                  <text x="266" y="135" class="tx tx-b" text-anchor="middle">155</text>
                  <circle cx="604" cy="130" r="21" fill="var(--c-panel-2)" stroke="var(--c-accent)" stroke-width="1.8"></circle>
                  <text x="604" y="135" class="tx tx-b" text-anchor="middle">245</text>
                  <circle cx="188" cy="200" r="21" fill="var(--c-panel-2)" stroke="var(--c-accent)" stroke-width="1.8"></circle>
                  <text x="188" y="205" class="tx tx-b" text-anchor="middle">72</text>
                  <circle cx="502" cy="200" r="21" fill="var(--c-panel-2)" stroke="var(--c-accent)" stroke-width="1.8"></circle>
                  <text x="502" y="205" class="tx tx-b" text-anchor="middle">114</text>
                  <circle cx="120" cy="270" r="20" fill="var(--c-panel-2)" stroke="var(--c-accent)" stroke-width="1.8"></circle>
                  <text x="120" y="275" class="tx tx-b" text-anchor="middle">34</text>
                  <circle cx="570" cy="270" r="20" fill="var(--c-panel-2)" stroke="var(--c-accent)" stroke-width="1.8"></circle>
                  <text x="570" y="275" class="tx tx-b" text-anchor="middle">57</text>
                  <!-- 叶子 -->
                  <rect x="51" y="328" width="48" height="26" rx="5" fill="var(--c-tip-bg)" stroke="var(--c-ok)" stroke-width="1.6"></rect>
                  <text x="75" y="346" class="tx" text-anchor="middle">b:14</text>
                  <rect x="141" y="328" width="48" height="26" rx="5" fill="var(--c-tip-bg)" stroke="var(--c-ok)" stroke-width="1.6"></rect>
                  <text x="165" y="346" class="tx" text-anchor="middle">g:20</text>
                  <rect x="231" y="328" width="48" height="26" rx="5" fill="var(--c-tip-bg)" stroke="var(--c-ok)" stroke-width="1.6"></rect>
                  <text x="255" y="346" class="tx" text-anchor="middle">d:38</text>
                  <rect x="321" y="328" width="48" height="26" rx="5" fill="var(--c-tip-bg)" stroke="var(--c-ok)" stroke-width="1.6"></rect>
                  <text x="345" y="346" class="tx" text-anchor="middle">a:83</text>
                  <rect x="411" y="328" width="48" height="26" rx="5" fill="var(--c-tip-bg)" stroke="var(--c-ok)" stroke-width="1.6"></rect>
                  <text x="435" y="346" class="tx" text-anchor="middle">h:57</text>
                  <rect x="501" y="328" width="48" height="26" rx="5" fill="var(--c-tip-bg)" stroke="var(--c-ok)" stroke-width="1.6"></rect>
                  <text x="525" y="346" class="tx" text-anchor="middle">c:28</text>
                  <rect x="591" y="328" width="48" height="26" rx="5" fill="var(--c-tip-bg)" stroke="var(--c-ok)" stroke-width="1.6"></rect>
                  <text x="615" y="346" class="tx" text-anchor="middle">f:29</text>
                  <rect x="681" y="328" width="48" height="26" rx="5" fill="var(--c-tip-bg)" stroke="var(--c-ok)" stroke-width="1.6"></rect>
                  <text x="705" y="346" class="tx" text-anchor="middle">e:131</text>
                  <!-- 码字 -->
                  <text x="75" y="378" class="tx-sm tx-b" text-anchor="middle" fill="var(--c-hot)">0000</text>
                  <text x="165" y="378" class="tx-sm tx-b" text-anchor="middle" fill="var(--c-hot)">0001</text>
                  <text x="255" y="378" class="tx-sm tx-b" text-anchor="middle" fill="var(--c-hot)">001</text>
                  <text x="345" y="378" class="tx-sm tx-b" text-anchor="middle" fill="var(--c-hot)">01</text>
                  <text x="435" y="378" class="tx-sm tx-b" text-anchor="middle" fill="var(--c-hot)">100</text>
                  <text x="525" y="378" class="tx-sm tx-b" text-anchor="middle" fill="var(--c-hot)">1010</text>
                  <text x="615" y="378" class="tx-sm tx-b" text-anchor="middle" fill="var(--c-hot)">1011</text>
                  <text x="705" y="378" class="tx-sm tx-b" text-anchor="middle" fill="var(--c-hot)">11</text>
                  <text x="20" y="410" class="tx-sm">码长：a=2、e=2、d=3、h=3、b=4、c=4、f=4、g=4；B(T) = 1077，Σf = 400，平均码长 2.6925</text>
                  <text x="20" y="426" class="tx-sm">（左右孩子互换会得到另一组 0/1 串，但码长与 B(T) 不变）</text>
                </svg>
                <p class="fig-cap">图 6 &nbsp;课堂练习的哈夫曼树与各字符码字（B(T) = 1077）</p>
          
                <p><b>答案表</b>（码字用「左 0 右 1」读出，与图 6 一致）：</p>
                <table class="tbl">
                  <thead><tr><th>字符 c</th><th>a</th><th>b</th><th>c</th><th>d</th><th>e</th><th>f</th><th>g</th><th>h</th></tr></thead>
                  <tbody>
                    <tr><td>频率 f(c)</td><td class="num">83</td><td class="num">14</td><td class="num">28</td><td class="num">38</td><td class="num">131</td><td class="num">29</td><td class="num">20</td><td class="num">57</td></tr>
                    <tr><td>码长 d<sub>T</sub>(c)</td><td class="num">2</td><td class="num">4</td><td class="num">4</td><td class="num">3</td><td class="num">2</td><td class="num">4</td><td class="num">4</td><td class="num">3</td></tr>
                    <tr><td><b>码字</b></td><td class="num">01</td><td class="num">0000</td><td class="num">1010</td><td class="num">001</td><td class="num">11</td><td class="num">1011</td><td class="num">0001</td><td class="num">100</td></tr>
                    <tr><td>f(c)&middot;d<sub>T</sub>(c)</td><td class="num">166</td><td class="num">56</td><td class="num">112</td><td class="num">114</td><td class="num">262</td><td class="num">116</td><td class="num">80</td><td class="num">171</td></tr>
                  </tbody>
                </table>
                <p class="formula">B(T) = 166 + 56 + 112 + 114 + 262 + 116 + 80 + 171 = <b>1077</b></p>
                <p class="formula">平均码长 = B(T) / &sum;f = 1077 / 400 = <b>2.6925 &asymp; 2.693</b> bit/字符</p>
                <p>对照：8 个字符的定长码需要 <span class="m">&lceil;lg 8&rceil; = 3</span> bit/字符，总代价 <span class="m">3 &times; 400 = 1200</span> bit；哈夫曼省下 <span class="m">1200 &minus; 1077 = 123</span> bit，约 <b>10.25%</b>。这与 PPT 第 37 页 6 字符例子的 300 &rarr; 224 是同一现象。</p>
          
                <h3 id="sec-huffman-h9">7.9 复杂度</h3>
                <ul>
                  <li><span class="m">n &minus; 1</span> 次合并，每次 2 次 <code>Extract-Min</code> + 1 次 <code>Insert</code>，堆操作各 <span class="m">O(lg n)</span>；</li>
                  <li>建堆（PPT 说「创建二项堆」）需 <span class="m">O(n lg n)</span>，也可以 <span class="m">O(n)</span> 直接建堆；</li>
                  <li>合计 <b>O(n lg n)</b>（PPT 第 41 页原文）。若频率已排序，用两个队列可做到 <span class="m">O(n)</span>（补充）。</li>
                </ul>
          
                <div class="callout key">
                  <p class="callout-h">本节考点</p>
                  <ul>
                    <li>前缀码定义 + 二叉树对应（左 0 右 1，字符在叶子）；</li>
                    <li><span class="m">B(T) = &sum; f(c) d<sub>T</sub>(c)</span>，以及「合并一次代价增加 <span class="m">f(x)+f(y)</span>」；</li>
                    <li><span class="m">HUFFMAN</span> 伪代码 9 行 + <b>O(n lg n)</b>；</li>
                    <li>课堂练习答案：码字表 + <b>B(T) = 1077</b> + 平均码长 <b>2.6925</b>。</li>
                  </ul>
                </div>
        ` },
      ],
    },
    {
      id: 'sec-knapsack',
      heading: "8. 分数背包与 0-1 背包：贪心的一成一败",
      blocks: [
        { type: 'html', html: `
          <h3 id="sec-knapsack-h1">8.1 问题（PPT 第 44 页）</h3>
                <p>给定 <span class="m">n</span> 个物体，第 <span class="m">i</span> 个价值 <span class="m">v<sub>i</sub></span> 元、重量 <span class="m">w<sub>i</sub></span> 磅；一个贼希望带走价值尽量多的东西，但他的背包仅仅可以容纳 <span class="m">W</span> 磅。</p>
                <ul>
                  <li><b>0-1 背包问题</b>：每个物体<b>要么带着，要么放下</b>（0-1 决定）；</li>
                  <li><b>分数背包问题</b>：允许拿走<b>部分</b>物体。</li>
                </ul>
                <p>PPT 第 44 页的课堂练习问了四件事：① 分数背包是否具有贪婪选择特征？请给出证明；② 若用贪心求解分数背包，基本思路是什么？③ 给出伪代码；④ 0-1 背包是否具有贪婪选择特征？</p>
          
                <h3 id="sec-knapsack-h2">8.2 分数背包：有贪心选择特性</h3>
                <p><b>结论：有。</b>贪心准则是按<b>单位重量价值</b> <span class="m">v<sub>i</sub>/w<sub>i</sub></span> <b>降序</b>装，能整件装就整件装，装不下就装剩下的那部分。</p>
                <p><b>证明思路</b>（交换论证）：设物品已按 <span class="m">v<sub>1</sub>/w<sub>1</sub> &ge; v<sub>2</sub>/w<sub>2</sub> &ge; … &ge; v<sub>n</sub>/w<sub>n</sub></span> 排序。考虑任一最优解，若它没有尽可能多地取物品 1（即还剩容量却取了某个单位价值更低的物品 <span class="m">j &gt; 1</span> 的一部分），就把那一份 <span class="m">&delta;</span> 磅从 <span class="m">j</span> 换成物品 1：重量不变，价值增加 <span class="m">&delta;(v<sub>1</sub>/w<sub>1</sub> &minus; v<sub>j</sub>/w<sub>j</sub>) &ge; 0</span>，不会变差。反复替换即得「先装满单位价值最高的」这一贪心解也是最优解 —— 这正是贪心选择特性。因为物品可分割，<b>不会出现「装不下整件、只能空着」的浪费</b>，这是证明成立的关键。</p>
          
                <div class="code-pair">
                  <div class="code-col">
                    <p class="code-h">伪代码</p>
                    <pre class="code"><code>FRACTIONAL-KNAPSACK(v, w, W)          // 输入：价值数组 v、重量数组 w、容量 W
          1  把物品按 v_i / w_i 降序排序            // 贪心准则：单位重量价值高的在前
          2  best ← 0                            // 已装价值
          3  for i ← 1 to n                      // 依次尝试每一件物品
          4      if W ≥ w_i                      // 整件装得下
          5          W ← W − w_i                 // 扣掉重量
          6          best ← best + v_i           // 加上全部价值
          7      else                            // 只能装一部分
          8          best ← best + v_i · (W / w_i)   // 按比例折算价值
          9          W ← 0                       // 背包已满
          10         break                       // 结束
          11 return best                         // 返回最大价值</code></pre>
                  </div>
                  <div class="code-col">
                    <p class="code-h">C++</p>
                    <pre class="code cpp"><code>#include &lt;cstdio&gt;                  // 打印结果
          #include &lt;algorithm&gt;               // sort 排序
          using namespace std;               // 使用标准命名空间
          
          struct Item {                      // 物品结构体
              double v;                      // 价值（元）
              double w;                      // 重量（磅）
              int id;                        // 编号，便于打印
          };                                 // 结构体定义结束
          
          bool cmp(const Item &amp;a, const Item &amp;b) {          // 单位重量价值降序
              return a.v / a.w &gt; b.v / b.w;  // 直接比较 v/w 的大小
          }
          
          double fracKnapsack(Item it[], int n, double W) {   // W 为背包容量
              sort(it, it + n, cmp);         // 贪心第一步：按单位价值排序
              double best = 0.0;             // 已装价值
              for (int i = 0; i &lt; n; ++i) {  // 从单位价值最高的开始装
                  if (W &gt;= it[i].w) {        // 整个装得下
                      W -= it[i].w;          // 扣掉重量
                      best += it[i].v;       // 加上全部价值
                      printf("物品 %d：整件装入，累计价值 %.1f\\n", it[i].id, best);  // 打印整件装入
                  } else {                   // 只能装一部分
                      best += it[i].v * (W / it[i].w);         // 按比例折算价值
                      printf("物品 %d：装入 %.1f/%.1f，累计价值 %.1f\\n", it[i].id, W, it[i].w, best);  // 打印部分装入
                      W = 0;                 // 背包已满
                      break;                 // 结束
                  }
              }
              return best;                   // 返回最大价值
          }
          
          int main() {                       // 主函数：用三个物品的算例验证
              Item a[3] = {{60, 10, 1}, {100, 20, 2}, {120, 30, 3}};  // 三个物品
              printf("分数背包最优值 = %.1f\\n", fracKnapsack(a, 3, 50));  // 容量 50，输出 240.0
              return 0;                      // 正常结束
          }</code></pre>
                  </div>
                </div>
                <p>用 8.3 节的反例数据实测：<code>物品 1：整件装入 60 → 物品 2：整件装入 160 → 物品 3：装入 20.0/30.0，累计价值 240.0</code>，即分数背包最优值 <b>240</b>。</p>
          
                <h3 id="sec-knapsack-h3">8.3 0-1 背包：没有贪心选择特性</h3>
                <p><b>结论：没有。</b>只要举一个反例就够：<span class="m">W = 50</span>，三件物品 <span class="m">(v, w) = (60, 10), (100, 20), (120, 30)</span>，单位价值分别是 <b>6、5、4</b>。</p>
                <ul>
                  <li>贪心按单位价值从高到低：先拿物品 1（60，占 10 磅），再拿物品 2（100，占 20 磅），此时已用 30 磅，<b>物品 3 需要 30 磅却只剩 20 磅</b>，而 0-1 背包不能切一块 ⇒ 总价值 <b>60 + 100 = 160</b>；</li>
                  <li>最优解：拿物品 2 与物品 3（20 + 30 = 50 磅，正好装满）⇒ 总价值 <b>100 + 120 = 220</b>；</li>
                  <li>分数背包：60 + 100 + 20/30&times;120 = <b>240</b>。</li>
                </ul>
          
                <svg class="fig" viewBox="0 0 820 320" role="img" aria-label="0-1 背包的贪心反例：容量 50，物品价值重量比 6 比 5 比 4，贪心得 160，最优 220，分数背包 240">
                  <text x="20" y="24" class="tx-b">同一个算例的三种答案：贪心 160 &lt; 最优 220 &lt; 分数 240（W = 50）</text>
                  <text x="20" y="48" class="tx-sm">物品：① (v=60, w=10, v/w=6)　② (v=100, w=20, v/w=5)　③ (v=120, w=30, v/w=4)</text>
                  <!-- 行1 贪心 -->
                  <text x="20" y="100" class="tx-sm tx-b">0-1 贪心</text>
                  <rect x="150" y="80" width="96" height="30" rx="5" fill="var(--c-warn-bg)" stroke="var(--c-hot)" stroke-width="2"></rect>
                  <text x="198" y="100" class="tx-sm" text-anchor="middle">① 60</text>
                  <rect x="246" y="80" width="160" height="30" rx="5" fill="var(--c-warn-bg)" stroke="var(--c-hot)" stroke-width="2"></rect>
                  <text x="326" y="100" class="tx-sm" text-anchor="middle">② 100</text>
                  <text x="418" y="100" class="tx-sm">= 160，重量 30，剩余 20 磅装不下 ③</text>
                  <!-- 行2 最优 -->
                  <text x="20" y="158" class="tx-sm tx-b">0-1 最优</text>
                  <rect x="150" y="138" width="160" height="30" rx="5" fill="var(--c-tip-bg)" stroke="var(--c-ok)" stroke-width="2"></rect>
                  <text x="230" y="158" class="tx-sm" text-anchor="middle">② 100</text>
                  <rect x="310" y="138" width="192" height="30" rx="5" fill="var(--c-tip-bg)" stroke="var(--c-ok)" stroke-width="2"></rect>
                  <text x="406" y="158" class="tx-sm" text-anchor="middle">③ 120</text>
                  <text x="514" y="158" class="tx-sm">= 220，重量 20 + 30 = 50 正好装满</text>
                  <!-- 行3 分数 -->
                  <text x="20" y="216" class="tx-sm tx-b">分数背包</text>
                  <rect x="150" y="196" width="96" height="30" rx="5" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="2"></rect>
                  <text x="198" y="216" class="tx-sm" text-anchor="middle">① 60</text>
                  <rect x="246" y="196" width="160" height="30" rx="5" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="2"></rect>
                  <text x="326" y="216" class="tx-sm" text-anchor="middle">② 100</text>
                  <rect x="406" y="196" width="128" height="30" rx="5" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="2" stroke-dasharray="5 4"></rect>
                  <text x="470" y="216" class="tx-sm" text-anchor="middle">③ 80</text>
                  <text x="546" y="216" class="tx-sm">= 240，取 ③ 的 20/30</text>
                  <!-- 说明 -->
                  <line x1="20" y1="242" x2="800" y2="242" stroke="var(--c-line-soft)" stroke-width="1"></line>
                  <text x="20" y="266" class="tx-sm">贪心失败的原因：物品 ① 单位价值最高但太轻，拿走它之后背包只剩 20 磅，恰好装不下 ③ 的 30 磅；</text>
                  <text x="20" y="288" class="tx-sm">0-1 背包无法「切一块」来填满剩余容量，于是被局部最优的选择卡住 —— 必须用动态规划（见 L6 · 动态规划）。</text>
                </svg>
                <p class="fig-cap">图 7 &nbsp;0-1 背包的贪心反例：贪心 160、最优 220（分数背包放松约束后可达 240）</p>
          
                <div class="callout warn">
                  <p class="callout-h">易错：单位价值排序不是万能的</p>
                  <p>「按 <span class="m">v<sub>i</sub>/w<sub>i</sub></span> 降序」只对<b>可分割</b>的分数背包成立。0-1 背包的正确解法是动态规划：<span class="m">dp[i][j] = max(dp[i&minus;1][j], dp[i&minus;1][j&minus;w<sub>i</sub>] + v<sub>i</sub>)</span>，时间 <span class="m">O(nW)</span>（伪多项式）。若被人问「0-1 背包能不能贪心」，标准答案是：<b>不能</b>，并给出上面的 160 / 220 反例。</p>
                </div>
          
                <div class="callout key">
                  <p class="callout-h">本节考点</p>
                  <ul>
                    <li>分数背包：<b>有</b>贪心选择特性，按单位价值降序，O(n lg n)（排序主导）；</li>
                    <li>0-1 背包：<b>没有</b>贪心选择特性，反例 <span class="m">W=50, (60,10),(100,20),(120,30)</span> &rarr; 160 vs 220；</li>
                    <li>能说清「可分割」为什么是分数背包贪心成立的关键。</li>
                  </ul>
                </div>
        ` },
      ],
    },
    {
      id: 'sec-summary',
      heading: "9. 小结：贪心的适用条件与四个成功案例",
      blocks: [
        { type: 'html', html: `
          <h3 id="sec-summary-h1">9.1 一张表看全本讲</h3>
                <table class="tbl">
                  <thead><tr><th>问题</th><th>贪心准则（排序的量）</th><th>正确性依据</th><th>时间</th><th>关键数字 / 注意</th></tr></thead>
                  <tbody>
                    <tr><td>最小生成树（Prim）</td><td>取 <span class="m">V&minus;A</span> 中 <span class="m">key</span> 最小的顶点（最小跨割边）</td><td>最优子结构 + 贪心选择定理（安全边）</td><td>O(E lg V) / O(V<sup>2</sup>)</td><td>本例 7 条边、总权 <b>53</b>；起点 G</td></tr>
                    <tr><td>活动选择</td><td>按 <span class="m">f<sub>i</sub></span> 升序，取<b>结束最早</b>且兼容者</td><td>最优子结构 + 交换论证（<span class="m">f<sub>m</sub> &le; f<sub>k</sub></span>）</td><td>O(n)（不计排序）/ O(n lg n)</td><td>11 个活动 &rarr; <b>{1,4,8,11}</b>，|A| = 4</td></tr>
                    <tr><td>哈夫曼编码</td><td>每次合并<b>频率最小</b>的两个节点</td><td>贪心选择（最深兄弟叶）+ 最优子结构（<span class="m">B(T)=B(T&prime;)+f(x)+f(y)</span>）</td><td>O(n lg n)</td><td>课堂练习 <b>B(T)=1077</b>，平均 <b>2.6925</b></td></tr>
                    <tr><td>分数背包</td><td>按 <span class="m">v<sub>i</sub>/w<sub>i</sub></span> 降序装</td><td>交换论证（可分割 &rArr; 无浪费）</td><td>O(n lg n)</td><td>反例算例的最优值为 <b>240</b></td></tr>
                    <tr><td>顶点覆盖</td><td>每次选度数最大的顶点</td><td><b>不成立</b>（NP 完全）</td><td>—</td><td>贪婪 5 个 vs 最优 4 个</td></tr>
                    <tr><td>0-1 背包</td><td>按 <span class="m">v<sub>i</sub>/w<sub>i</sub></span> 降序装</td><td><b>不成立</b></td><td>需 DP <span class="m">O(nW)</span></td><td>贪心 160 vs 最优 220</td></tr>
                  </tbody>
                </table>
          
                <h3 id="sec-summary-h2">9.2 设计一个贪心算法的三步法</h3>
                <ol>
                  <li><b>把问题写成「做一次选择 + 剩下一个子问题」的形式</b>：如 MST 选一条跨割边、活动选择选一个活动、哈夫曼选一次合并；</li>
                  <li><b>证明贪心选择性质</b>：用<b>交换论证</b>（把最优解里的某个选择换成贪心选择，值不变差）；</li>
                  <li><b>证明最优子结构</b>：用<b>剪切粘贴</b>（若子问题解不最优，替换后整体更优，矛盾）。</li>
                </ol>
                <p>两条都证完，才可以把 DP 的「考虑所有选择」砍成「只考虑一个选择」。任何一条证不出来，就应该怀疑贪心 —— 顶点覆盖与 0-1 背包就是反例。</p>
          
                <h3 id="sec-summary-h3">9.3 高频考点清单</h3>
                <div class="callout key">
                  <p class="callout-h">考前 60 秒自检</p>
                  <ul>
                    <li>MST 的两条定理 + 两个剪切粘贴证明（能默写）；</li>
                    <li>Prim 的 8 步加边顺序与总权 <b>53</b>，以及「F 比 D 先入树」的原因；</li>
                    <li>Prim 复杂度 <b>O(E lg V)</b> 与 <b>O(V&sup2;)</b> 的取舍；</li>
                    <li>贪心两要素 + 与 DP 的三条对比；</li>
                    <li>活动选择：贪心准则、<span class="m">c[i,j]</span> 递归式、两个伪代码、<b>O(n)</b>/<b>O(n lg n)</b>；</li>
                    <li>哈夫曼：前缀码、<span class="m">B(T)</span> 公式、<span class="m">HUFFMAN</span> 伪代码、课堂练习 <b>1077 / 2.6925</b>；</li>
                    <li>两个反例：顶点覆盖（5 vs 4，NP 完全）、0-1 背包（160 vs 220）。</li>
                  </ul>
                </div>
          
                <div class="callout tip">
                  <p class="callout-h">一句话记住全讲</p>
                  <p><b>贪心 = 最优子结构 + 贪心选择特性；前者靠剪切粘贴证，后者靠交换论证证；证不出来就退回 DP。</b></p>
                </div>
        ` },
      ],
    },
    {
      id: 'sec-quiz',
      heading: "本节自测（课件配套测验）",
      blocks: [
        { type: 'html', html: `
          <p>下列 13 题取自课程配套测验（贪心法部分），是本次题量最大的一组：单项选择 5 题、多项选择 5 题、填空/计算 3 题。每题给出<b>答案与解析</b>，建议先遮住答案自测一遍，错题回到上文「MST / 活动选择 / 哈夫曼 / 背包」对应小节复看。</p>
          
                <h3 id="sec-quiz-h1">一、单项选择题</h3>
        ` },
        { type: 'quiz', quiz: {
          "kind": "single",
          "question": "1. 最小生成树的优化目标是什么？",
          "tag": "贪心法 · 原卷 1",
          "options": [
            "A. 使所有边权相等",
            "B. 使边数最多",
            "C. 使生成树总权值最小",
            "D. 使最大顶点度最大"
          ],
          "answer": "C",
          "explanation": "生成树必须<b>连接所有顶点</b>且无环，所以 n 个顶点恰好 <b>n−1 条边</b> —— 边数由顶点数决定，不是优化目标（B 错）；边权是输入给定的，不能改变（A 错）；度数也不在目标里（D 错）。真正的目标是\n        <span class=\"m\">min Σ<sub>(u,v)∈T</sub> w(u,v)</span>，这正是 Prim「每次选连接 A 与 V−A 的最小权边」所保证的。"
        } },
        { type: 'quiz', quiz: {
          "kind": "single",
          "question": "2. 哈夫曼算法的时间复杂度是多少？",
          "tag": "贪心法 · 原卷 2",
          "options": [
            "A. O(log n)",
            "B. O(n)",
            "C. O(n² log n)",
            "D. O(n log n)"
          ],
          "answer": "D",
          "explanation": "用二叉堆（优先队列）实现：建堆 <span class=\"m\">O(n)</span>；之后 n−1 轮合并，每轮 2 次 <code>Extract-Min</code> + 1 次 <code>Insert</code>，每次 <span class=\"m\">O(log n)</span>，合计 <b><span class=\"m\">O(n log n)</span></b>。",
          "note": "补充（超出课件）：若输入已按频率有序，改用「两个队列」代替堆，可做到 O(n)；但课件标准答案按堆实现，取 O(n log n)。"
        } },
        { type: 'quiz', quiz: {
          "kind": "single",
          "question": "3. 分数背包问题与 0-1 背包问题的区别是什么？",
          "tag": "贪心法 · 原卷 3",
          "options": [
            "A. 二者没有区别",
            "B. 分数背包不允许装任何物品",
            "C. 分数背包允许拿走部分物品",
            "D. 0-1 背包允许拿走任意比例"
          ],
          "answer": "C",
          "explanation": "<b>分数背包</b>的物品可分割，于是按<b>单位重量价值 <span class=\"m\">v<sub>i</sub>/w<sub>i</sub></span> 降序</b>贪心装到装满为止就是最优；<b>0-1 背包</b>每件要么全拿要么不拿，贪心不保证最优 —— 反例：W=50，(v,w) = (60,10)、(100,20)、(120,30)，单位价值 6、5、4，贪心取 60+100=160，而最优是 100+120=220，所以 0-1 背包必须用动态规划。"
        } },
        { type: 'quiz', quiz: {
          "kind": "single",
          "question": "4. 贪心选择性质指的是什么？",
          "tag": "贪心法 · 原卷 4",
          "options": [
            "A. 只能用于随机算法",
            "B. 必须枚举所有全局解",
            "C. 局部选择总是最差",
            "D. 局部最优选择可导向全局最优"
          ],
          "answer": "D",
          "explanation": "贪心选择性质：<b>全局最优解可以通过一系列局部最优（贪心）选择达到</b>，且做完一次贪心选择后原问题只留下一个子问题。它与「最优子结构」合称贪心法的两个要素。注意它<b>不等于</b>「任何贪心都最优」—— 顶点覆盖、0-1 背包正是反例（PPT 也强调「贪婪试探并不能总是得到最优解」）。"
        } },
        { type: 'quiz', quiz: {
          "kind": "single",
          "question": "5. 活动 i 和 j 在什么条件下相互兼容？",
          "tag": "贪心法 · 原卷 5",
          "options": [
            "A. s<sub>i</sub> = f<sub>i</sub> 且 s<sub>j</sub> = f<sub>j</sub>",
            "B. 两个活动必须有相同持续时间",
            "C. s<sub>i</sub> &lt; f<sub>j</sub> 且 s<sub>j</sub> &lt; f<sub>i</sub>（区间重叠）",
            "D. s<sub>i</sub> ≥ f<sub>j</sub> 或 s<sub>j</sub> ≥ f<sub>i</sub>"
          ],
          "answer": "D",
          "explanation": "活动占用<b>半开区间</b> <span class=\"m\">[s<sub>i</sub>, f<sub>i</sub>)</span>，兼容 ⇔ 两区间不重叠 ⇔ <span class=\"m\">s<sub>i</sub> ≥ f<sub>j</sub></span>（j 先结束）<b>或</b> <span class=\"m\">s<sub>j</sub> ≥ f<sub>i</sub></span>（i 先结束）。用半开区间的好处：一个 3 点结束、另一个 3 点开始，算兼容。C 描述的是<b>重叠</b>，恰好是不兼容。"
        } },
        { type: 'html', html: `
          <h3 id="sec-quiz-h2">二、多项选择题</h3>
        ` },
        { type: 'quiz', quiz: {
          "kind": "multi",
          "question": "6. 贪心策略中需要关注哪些要素或性质？",
          "tag": "贪心法 · 原卷 7",
          "options": [
            "A. 最优子结构",
            "B. 局部最优选择可导向全局最优",
            "C. 任何贪心策略都必然得到最优解",
            "D. 贪心选择特性"
          ],
          "answer": "A、B、D",
          "explanation": "贪心法成立需要两要素：<b>最优子结构</b>（A）与<b>贪心选择特性</b>（D，其含义就是 B「局部最优可导向全局最优」）。<b>C 错</b>：贪心只是试探，可能不是最优（顶点覆盖、0-1 背包），此时应改用动态规划。"
        } },
        { type: 'quiz', quiz: {
          "kind": "multi",
          "question": "7. 关于顶点覆盖问题及其贪心试探，下列说法正确的有哪些？",
          "tag": "贪心法 · 原卷 9",
          "options": [
            "A. 优化目标是使覆盖中的顶点数最少",
            "B. 每次覆盖尽量多边的试探并不总能得到最优解",
            "C. 最大度贪心试探总能得到最小顶点覆盖",
            "D. 每条边至少有一个端点属于顶点覆盖"
          ],
          "answer": "A、B、D",
          "explanation": "顶点覆盖的定义就是 D（每条边至少一个端点在 <span class=\"m\">V′</span> 中），目标是最小化 <span class=\"m\">|V′|</span>（A）。贪婪试探「每次取度数最大的顶点、删去被覆盖的边」只是启发式：PPT 的例子里它给出 <b>5 个</b>顶点，而最优只要 <b>4 个</b>，故 B 对、<b>C 错</b>。（顶点覆盖的判定问题是 NP 完全的。）"
        } },
        { type: 'quiz', quiz: {
          "kind": "multi",
          "question": "8. 关于 Prim 算法及其依据，下列说法正确的有哪些？",
          "tag": "贪心法 · 原卷 10",
          "options": [
            "A. 每一步随机选择任意边且无需考虑权值",
            "B. 优先队列维护尚未加入 A 的 V−A 中顶点",
            "C. 顶点键值与其连接 A 的最小边权有关",
            "D. 连接 A 与 V−A 的最小权边可用于贪心选择"
          ],
          "answer": "B、C、D",
          "explanation": "<b>A 错</b>：Prim 每一步取的正是「连接 A 与 V−A 的<b>最小权边</b>」，绝非随机、更不能不考虑权值。B 对：优先队列 Q 里放的是 <span class=\"m\">V−A</span> 中的顶点；C 对：每个顶点的 key 就是它「连接到 A 中某点的最小边权」；D 对：这正是<b>贪心选择定理</b>（跨割最小边必属于某棵 MST），由剪切粘贴法证明。",
          "note": "易错提醒：这题的 D 容易被漏选 —— 「最小跨割边可贪心选择」是 MST 贪心正确性的核心定理，不是可有可无的表述。"
        } },
        { type: 'quiz', quiz: {
          "kind": "multi",
          "question": "9. 关于活动选择问题，下列说法正确的有哪些？",
          "tag": "贪心法 · 原卷 12",
          "options": [
            "A. 经典贪心策略优先选择最早结束的活动",
            "B. s<sub>i</sub> ≥ f<sub>j</sub> 或 s<sub>j</sub> ≥ f<sub>i</sub> 时活动 i 和 j 兼容",
            "C. 已按结束时间排序时迭代算法时间为 O(n)",
            "D. 优先选择最早开始的活动必然最优"
          ],
          "answer": "A、B、C",
          "explanation": "A 对：贪心准则就是<b>每次选结束时间最早</b>的兼容活动，为后续留出最多时间；B 对（同第 5 题的兼容定义）；C 对：<code>GREEDY-ACTIVITY-SELECTOR</code> 排序之后只扫一遍，<span class=\"m\">O(n)</span>（计入排序则是 <span class=\"m\">O(n log n)</span>）。<b>D 错</b>：「最早开始」会踩坑 —— 一个最早开始但持续很久的活动会把后面全堵死（这正是 PPT 四大陷阱「证明缺失」用的例子）。"
        } },
        { type: 'quiz', quiz: {
          "kind": "multi",
          "question": "10. 关于最小生成树问题，下列说法正确的有哪些？",
          "tag": "贪心法 · 原卷 14",
          "options": [
            "A. 生成树必须连接所有顶点",
            "B. 目标是使生成树总权值最小",
            "C. 计算时可以完全忽略边权",
            "D. 输入可以是连通无向带权图"
          ],
          "answer": "A、B、D",
          "explanation": "生成树的定义要求<b>连通、无环、覆盖全部顶点</b>（A），优化目标是最小化总权值（B），输入是<b>连通无向带权图</b> <span class=\"m\">G=(V,E)</span> 与权函数 <span class=\"m\">w: E→R</span>（D）。<b>C 错</b>：边权就是优化对象，忽略权值就退化成「随便找一棵生成树」。"
        } },
        { type: 'html', html: `
          <h3 id="sec-quiz-h3">三、填空题 / 计算题</h3>
        ` },
        { type: 'quiz', quiz: {
          "kind": "fill",
          "question": "11.（计算题）6 个字符的频率为 4、7、10、14、18、25，执行哈夫曼算法得到的总合并代价为 ______。",
          "tag": "贪心法 · 原卷 15",
          "answer": "188",
          "explanation": "每步合并两个最小频率：\n        <br><span class=\"m\">4+7=11</span> → <span class=\"m\">11+10=21</span> → <span class=\"m\">14+18=32</span> → <span class=\"m\">21+25=46</span> → <span class=\"m\">32+46=78</span>；\n        <br>总合并代价 = <span class=\"m\">11+21+32+46+78 = <b>188</b></span>。\n        <br>核对：树中各字符深度为 —— 4、7 深度 4；10 深度 3；14、18、25 深度 2，于是\n        <span class=\"m\">B(T)=4×4+7×4+10×3+14×2+18×2+25×2=16+28+30+28+36+50=188</span> ✔\n        <br>结论：<b>总合并代价 = 所有内部节点权值之和 = B(T)</b>，两种算法必然一致。"
        } },
        { type: 'quiz', quiz: {
          "kind": "fill",
          "question": "12. Prim 算法用优先队列 Q 维护集合 ______ 中的顶点，并按其连接到已选集合的最小边权排序。",
          "tag": "贪心法 · 原卷 16",
          "answer": "V−A",
          "explanation": "A 是<b>已加入生成树</b>的顶点集合，Q 中是<b>尚未加入 A</b> 的顶点（即 <span class=\"m\">V−A</span>），每个顶点的键值 key = 「它连接到 A 中某点的最小边权」。每轮 <code>Extract-Min</code> 取出 key 最小者加入 A，再用它的邻边松弛其他顶点的 key。注意不是「到 A 的距离之和」，也不是任意一条边权。"
        } },
        { type: 'quiz', quiz: {
          "kind": "fill",
          "question": "13.（计算题）活动区间依次为 A1=[0,3)、A2=[1,4)、A3=[2,5)、A4=[3,6)、A5=[5,8)、A6=[6,9)、A7=[8,10)、A8=[9,12)，按最早结束时间贪心选择，最多能选择 ______ 个活动。",
          "tag": "贪心法 · 原卷 17",
          "answer": "4",
          "explanation": "按结束时间升序扫描（本题恰好已是升序）：选 <b>A1</b>（f=3）→ 下一个 s ≥ 3 的是 <b>A4</b>（s=3）→ 下一个 s ≥ 6 的是 <b>A6</b>（s=6）→ 下一个 s ≥ 9 的是 <b>A8</b>（s=9），得到\n        <b>{A1, A4, A6, A8}</b>，共 <b>4</b> 个。\n        <br>端点相接（如 A1 止于 3、A4 起于 3）算兼容，这是半开区间的约定。",
          "note": "勘误：原题解析举例的「A1、A4、A5、A7」其实并不相容 —— A5 起点 5 &lt; A4 终点 6，A7 起点 8 &lt; A6 终点 9。正确的一组是 {A1, A4, A6, A8}，但<b>答案个数仍是 4</b>（贪心最优性不受影响）。"
        } },
      ],
    },
  ],
};

export default deck;
