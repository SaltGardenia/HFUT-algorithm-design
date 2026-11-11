# 算法设计与分析 · 复习手册

依据《算法设计与分析》课程八份 PPT 整理的复习手册 —— **React 工程**，包含：

- **8 讲核心考点**：算法定义与性质、插入/选择排序、渐近记号、代换法/递归树/主方法、决策树下界、计数/基数排序、线性时间选择（Randomized-Select 与 BFPRT）、递归与分治（含 Strassen）、动态规划五个经典问题、贪心法（MST / 活动选择 / 哈夫曼 / 背包）
- **24 个交互动画**：全部由 React 组件渲染，支持逐帧步进、播放、进度拖拽与键盘控制
- **36 道自测题**：单选/多选/判断/填空即时判分，附解析与勘误
- **伪代码 + C++ 双栏**：每个算法逐行中文注释，可一键复制
- **⌘K 全局搜索**：章节、动画、题目即输即跳
- **亮 / 暗双主题**、阅读进度、滚动定位记忆、移动端抽屉、打印导出 PDF

## 在线访问

push 到 `main` 后 GitHub Actions 自动构建并部署到 GitHub Pages：

```
https://saltgardenia.github.io/HFUT-algorithm-design/
```

> 首次启用需在仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。

## 本地开发

```bash
npm install
npm run dev        # 开发服务器
npm run build      # 类型检查 + 生产构建（输出 dist/）
npm run preview    # 本地预览构建产物
npm run test       # vitest：24 个动画的帧数契约 + 渲染冒烟测试
```

要求 Node.js ≥ 20。

## 目录结构

```
├── index.html                Vite 入口（首帧前同步主题，防暗色闪白）
├── scripts/
│   └── migrate.mjs           旧静态 HTML → src/content/TS 模块的一次性迁移脚本（可重跑）
├── src/
│   ├── content/              内容事实源（由 migrate.mjs 生成后手工维护）
│   │   ├── deck1~8.ts        每讲 sections：html 块 / demo 标记 / quiz 结构化数据
│   │   ├── home.ts           首页（考点速查表）
│   │   └── types.ts          DeckData / Block / QuizData 契约
│   ├── components/
│   │   ├── TopBar / Sidebar / MobileDrawer / SearchPalette / Footer
│   │   ├── HtmlContent.tsx   HTML 块渲染 + 代码高亮 + 复制按钮 + 链接委托
│   │   ├── DemoPlayer.tsx    动画播放器（步进 / 播放 / 拖拽 / 键盘）
│   │   ├── QuizCard.tsx      自测题交互
│   │   └── demos/            24 个动画组件 + registry 注册表 + SVG 原语
│   ├── pages/                HomePage / DeckPage（scroll-spy + 深链 ?s=sec-id）
│   ├── lib/                  theme（亮暗主题）/ toc（侧栏目录通道）/ scroll
│   └── styles/               tokens.css（设计令牌，亮暗双主题）+ base.css
├── .github/workflows/        ci.yml（PR 检查）+ deploy.yml（Pages 部署）
├── _tools/                   旧版自检脚本与 PPT 文本抽取（仅作参考）
└── PPT/                      课程 PPT 原件（不入库，本地保留）
```

## 架构说明

- **内容**：`src/content/*.ts` 由 `scripts/migrate.mjs` 从旧版 9 个静态页面解析生成并经全量对账（24 动画 / 36 题 / 各讲 section 数）。html 块原样保留（表格、提示块、公式、代码对），动画与自测题拆为结构化数据。**改内容直接编辑这些 TS 文件**；只有从旧 HTML 重新生成时才需要跑 `npm run migrate`。
- **动画**：每个动画 = `build()`（纯函数，一次性生成全部帧数据）+ `View`（纯渲染组件）。帧数契约在 `src/__tests__/demos.test.tsx` 中逐一锁定。
- **路由**：HashRouter（GitHub Pages 免 404 配置），`#/deck/deck2?s=sec-quiz` 可直达任意章节。
- **主题**：`data-theme` + CSS 变量，动画语义色全部走 token，暗色模式自动适配；尊重 `prefers-reduced-motion` / `prefers-reduced-transparency` / `prefers-contrast`。
- **部署路径**：`vite.config.ts` 的 `base` 需与仓库名一致；改名仓库时请同步修改。

## 数据口径

关键数字均与 PPT 原表逐项核对过：插入排序最坏 T(n)=3n²/2+7n/2−4、选择排序 T(n)=2n²+3n−4、计数排序算例 ⟨4,1,3,4,3⟩ 各阶段状态、矩阵链 m(1,6)=15125、LCS c[7,6]=4、装配线 f\*=38、OBST e[1,5]=2.75、哈夫曼合并代价 188 等。旧版的自检脚本保留在 `_tools/` 可复跑。

## 协议

[MIT](LICENSE)
