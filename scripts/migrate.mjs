/* ============================================================================
 * 算法复习手册 · 内容迁移脚本
 * 把根目录的 9 个旧静态页面（index.html + deck1~8.html）解析为
 * src/content/ 下的 TS 内容模块：
 *   - html 块（表格 / 提示块 / 代码对 / 公式 / 矢量图）原样保留为字符串
 *   - 动画容器（.demo）剥出为 { type:'demo' } 标记，由 React DemoPlayer 渲染
 *   - 自测题（.quiz）解析为结构化 QuizData，由 React QuizCard 渲染
 * 迁移后旧 HTML 即可删除，生成的 TS 模块成为内容唯一事实源。
 * 用法：npm run migrate
 * ========================================================================== */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'src', 'content');
mkdirSync(OUT, { recursive: true });

/* ------------------------------------------------------------ 期望值（对账用） */
const EXPECT = {
  deckSections: { deck1: 7, deck2: 12, deck3: 14, deck4: 8, deck5: 8, deck6: 13, deck7: 10, deck8: 10 },
  deckDemos: {
    deck1: ['euclid', 'quickselect'],
    deck2: ['insertion-sort', 'selection-sort', 'quick-partition', 'count-insertion'],
    deck3: ['recursion-tree', 'master-three-cases', 'substitution-fail'],
    deck4: ['counting-sort', 'decision-tree', 'radix-sort'],
    deck5: ['randomized-select', 'median-of-medians'],
    deck6: ['fast-power', 'hanoi-tower', 'binary-search'],
    deck7: ['rod-cutting', 'matrix-chain', 'lcs-table', 'assembly-line'],
    deck8: ['prim-mst', 'activity-select', 'huffman'],
  },
  deckQuizKinds: {
    deck2: { single: 0, multi: 0, judge: 2, fill: 0 },
    deck3: { single: 1, multi: 0, judge: 0, fill: 0 },
    deck4: { single: 5, multi: 0, judge: 2, fill: 0 },
    deck5: { single: 7, multi: 0, judge: 0, fill: 0 },
    deck7: { single: 0, multi: 4, judge: 0, fill: 2 },
    deck8: { single: 5, multi: 5, judge: 0, fill: 3 },
  },
};

/* ------------------------------------------------------------------ 小工具 */
/** 转义为可安全放入 TS 模板字符串的文本（内容已确认无反引号与 ${，双保险） */
const esc = (s) =>
  s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

/** 从 html 起点找到配对的闭合 </tag>，返回 [完整块, 之后剩余文本]（HTML 源自已校验文件，标签闭合可靠） */
function cutBlock(html, startIdx, tag) {
  const openRe = new RegExp(`<${tag}[\\s>]`, 'g');
  const closeRe = new RegExp(`</${tag}>`, 'g');
  openRe.lastIndex = startIdx + 1; // 跳过起始标签本身
  closeRe.lastIndex = startIdx + 1; // 只统计起始标签之后的闭合
  let depth = 1;
  let pos = startIdx;
  let guard = 0;
  while (depth > 0) {
    if (++guard > 100000) throw new Error(`配对扫描失控（起点 ${startIdx}）`);
    const prevClose = closeRe.lastIndex;
    const o = openRe.exec(html);
    const c = closeRe.exec(html);
    if (!c) throw new Error(`未找到配对的 </${tag}>（起点 ${startIdx}）`);
    if (o && o.index < c.index) {
      closeRe.lastIndex = prevClose; // 本次未消费该闭合，回退游标避免跳过
      depth++;
      pos = o.index + o[0].length;
    } else {
      depth--;
      pos = c.index + c[0].length;
      closeRe.lastIndex = pos;
      openRe.lastIndex = pos;
    }
  }
  return [html.slice(startIdx, pos), html.slice(pos)];
}

const stripTags = (s) => s.replace(/<[^>]+>/g, '');
const decodeBasic = (s) =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();

/* ------------------------------------------------------------- 主解析流程 */
function extractMain(html) {
  const m = html.match(/<main class="content" id="content">([\s\S]*)<\/main>/);
  if (!m) throw new Error('未找到 <main id="content">');
  return m[1];
}

function parseQuiz(divHtml) {
  const q = divHtml.match(/<p class="quiz-q">([\s\S]*?)<\/p>/);
  if (!q) throw new Error('quiz 缺少 quiz-q');
  let question = q[1];
  let tag = '';
  const tagM = question.match(/<span class="quiz-tag">([\s\S]*?)<\/span>/);
  if (tagM) {
    tag = decodeBasic(tagM[1]);
    question = question.replace(tagM[0], '');
  }
  question = question.trim();

  const optsM = divHtml.match(/<ul class="quiz-opt">([\s\S]*?)<\/ul>/);
  const options = [];
  if (optsM) {
    const liRe = /<li>([\s\S]*?)<\/li>/g;
    let lm;
    while ((lm = liRe.exec(optsM[1]))) options.push(lm[1].trim());
  }

  const aM = divHtml.match(/<p class="quiz-a"><b>答案：([\s\S]*?)<\/b>([\s\S]*?)<\/p>/);
  if (!aM) throw new Error(`quiz 缺少 quiz-a：${question.slice(0, 30)}…`);
  const answer = decodeBasic(aM[1]);
  const explanation = aM[2].replace(/^[\s　]+/, '').trim();

  const noteM = divHtml.match(/<p class="quiz-note">([\s\S]*?)<\/p>/);
  const note = noteM ? noteM[1].trim() : '';

  let kind;
  if (!options.length) kind = 'fill';
  else if (/^(对|错)$/.test(answer)) kind = 'judge';
  else if (/^[A-D]$/.test(answer)) kind = 'single';
  else if (/^[A-D](、[A-D])+$/.test(answer)) kind = 'multi';
  else throw new Error(`无法判定题型：答案「${answer}」｜题干「${question.slice(0, 40)}…」`);

  const quiz = { kind, question, tag, options, answer, explanation, note: note || undefined };
  if (!options.length) delete quiz.options; // 填空题不带选项字段
  return quiz;
}

/** 处理一段 section 内部 html：剥出 demo / quiz，给 h3 注入 id，返回 blocks + h3 目录项 */
function splitBlocks(innerHtml, sectionId) {
  const blocks = [];
  const h3s = [];
  let rest = innerHtml;
  const counter = { seq: 0 }; // section 级计数器，保证跨 chunk 的 h3 id 不冲突

  while (rest.length) {
    const demoIdx = rest.search(/<div class="demo" data-demo="/);
    const quizIdx = rest.search(/<div class="quiz">/);
    const idxs = [demoIdx, quizIdx].filter((i) => i >= 0);
    if (!idxs.length) {
      // 剩余纯 html：注入 h3 id 后收尾
      const withIds = injectH3Ids(rest, sectionId, counter);
      h3s.push(...withIds.h3s);
      if (withIds.html.trim()) blocks.push({ type: 'html', html: withIds.html.trim() });
      rest = '';
      break;
    }
    const cut = Math.min(...idxs);
    const before = rest.slice(0, cut);
    const withIds = injectH3Ids(before, sectionId, counter);
    h3s.push(...withIds.h3s);
    if (withIds.html.trim()) blocks.push({ type: 'html', html: withIds.html.trim() });

    if (cut === demoIdx) {
      const [demoDiv, after] = cutBlock(rest, cut, 'div');
      const name = demoDiv.match(/data-demo="([^"]+)"/)[1];
      const titleM = demoDiv.match(/<span class="demo-title">([\s\S]*?)<\/span>/);
      blocks.push({ type: 'demo', name, title: titleM ? decodeBasic(titleM[1]) : name });
      rest = after;
    } else {
      const [quizDiv, after] = cutBlock(rest, cut, 'div');
      blocks.push({ type: 'quiz', quiz: parseQuiz(quizDiv) });
      rest = after;
    }
  }
  return { blocks, h3s };
}

/** 给无 id 的 <h3> 注入确定性的 id，并顺带收集目录项 */
function injectH3Ids(html, sectionId, counter) {
  const h3s = [];
  const out = html.replace(/<h3(\s[^>]*)?>([\s\S]*?)<\/h3>/g, (whole, attrs, inner) => {
    if (attrs && /id=/.test(attrs)) return whole; // 已有 id，不注入
    const id = `${sectionId}-h${++counter.seq}`;
    h3s.push({ id, text: stripTags(inner).trim(), level: 3 });
    return `<h3 id="${id}">${inner}</h3>`;
  });
  return { html: out, h3s };
}

function parseDeck(file, id) {
  const html = readFileSync(join(ROOT, file), 'utf8');
  const titleM = html.match(/<title>([\s\S]*?) · 算法复习手册<\/title>/);
  const subM = html.match(/<span class="topbar-sub">([\s\S]*?)<\/span>/);
  const subtitle = subM ? decodeBasic(subM[1]) : '';
  const noM = subtitle.match(/^(第\S*?讲)/);
  const main = extractMain(html);

  const ledeM = main.match(/<p class="lede">([\s\S]*?)<\/p>/);
  const body = main.slice(main.indexOf('</p>', main.indexOf('class="lede"')) + 4);

  const sections = [];
  const toc = [];
  let rest = body;
  const secRe = /<section id="(sec-[\w-]+)">([\s\S]*?)<\/section>\s*/g;
  let m;
  while ((m = secRe.exec(body))) {
    const secId = m[1];
    let inner = m[2];
    const h2M = inner.match(/<h2>([\s\S]*?)<\/h2>/);
    if (!h2M) throw new Error(`${file} section ${secId} 缺少 h2`);
    const heading = stripTags(h2M[1]).trim();
    inner = inner.slice(inner.indexOf('</h2>') + 5);
    const { blocks, h3s } = splitBlocks(inner, secId);
    toc.push({ id: secId, text: heading, level: 2 });
    for (const h of h3s) toc.push({ ...h, level: 3 });
    sections.push({ id: secId, heading, blocks });
  }
  if (!sections.length) throw new Error(`${file} 未解析到任何 section`);

  return {
    id,
    no: noM ? noM[1] : '',
    title: titleM ? titleM[1].trim() : id,
    subtitle,
    lede: ledeM ? ledeM[1].trim() : '',
    toc,
    sections,
  };
}

/* ------------------------------------------------------------- 生成 TS 代码 */
function serializeBlocks(blocks, indent) {
  return blocks
    .map((b) => {
      if (b.type === 'html') return `${indent}{ type: 'html', html: \`\n${indent}  ${esc(b.html).replace(/\n/g, `\n${indent}  `)}\n${indent}\` },`;
      if (b.type === 'demo') return `${indent}{ type: 'demo', name: '${b.name}', title: ${JSON.stringify(b.title)} },`;
      return `${indent}{ type: 'quiz', quiz: ${JSON.stringify(b.quiz, null, 2).replace(/\n/g, `\n${indent}`)} },`;
    })
    .join('\n');
}

function serializeDeck(d, isHome) {
  const sections = d.sections
    .map(
      (s) => `    {
      id: '${s.id}',
      heading: ${JSON.stringify(s.heading)},
      blocks: [
${serializeBlocks(s.blocks, '        ')}
      ],
    },`
    )
    .join('\n');
  const toc = d.toc
    .map((t) => `    { id: '${t.id}', text: ${JSON.stringify(t.text)}, level: ${t.level} },`)
    .join('\n');
  return `/* 由 scripts/migrate.mjs 自动生成 —— 内容事实源，手工修改后请勿重跑迁移覆盖 */
import type { DeckData } from './types';

const deck: DeckData = {
  id: '${d.id}',
  no: ${JSON.stringify(d.no)},
  title: ${JSON.stringify(d.title)},
  subtitle: ${JSON.stringify(d.subtitle)},
  lede: \`\n  ${esc(d.lede).replace(/\n/g, `\n  `)}\n\`,
  toc: [
${toc}
  ],
  sections: [
${sections}
  ],
};

export default deck;
`;
}

/* ------------------------------------------------------------------- 执行 */
const decks = [];
for (let i = 1; i <= 8; i++) {
  const id = `deck${i}`;
  const d = parseDeck(`${id}.html`, id);
  decks.push(d);
}
// 根目录 index.html 已是 Vite 入口；旧版首页取自基线提交的存档
const home = parseDeck(join('scripts', 'legacy-index.html'), 'home');
home.title = '算法设计与分析 · 复习手册';
home.no = '';

/* ------------------------------------------------------------------- 校验 */
const fails = [];
const allDemos = [];
const allQuizzes = [];

for (const d of decks) {
  const want = EXPECT.deckSections[d.id];
  if (d.sections.length !== want) fails.push(`${d.id}: sections ${d.sections.length} ≠ ${want}`);
  const demoNames = [];
  for (const s of d.sections)
    for (const b of s.blocks) {
      if (b.type === 'demo') demoNames.push(b.name);
      if (b.type === 'quiz') allQuizzes.push({ deck: d.id, ...b.quiz });
    }
  allDemos.push(...demoNames);
  const wantDemos = [...EXPECT.deckDemos[d.id]].sort();
  if (JSON.stringify([...demoNames].sort()) !== JSON.stringify(wantDemos))
    fails.push(`${d.id}: demos [${demoNames}] ≠ [${EXPECT.deckDemos[d.id]}]`);
  const kinds = { single: 0, multi: 0, judge: 0, fill: 0 };
  for (const q of allQuizzes.filter((q) => q.deck === d.id)) kinds[q.kind]++;
  const wantKinds = EXPECT.deckQuizKinds[d.id];
  if (wantKinds && JSON.stringify(kinds) !== JSON.stringify(wantKinds))
    fails.push(`${d.id}: quiz kinds ${JSON.stringify(kinds)} ≠ ${JSON.stringify(wantKinds)}`);
}

if (allDemos.length !== 24) fails.push(`demos 总数 ${allDemos.length} ≠ 24`);
if (allQuizzes.length !== 36) fails.push(`quizzes 总数 ${allQuizzes.length} ≠ 36`);
const dup = allDemos.filter((n, i) => allDemos.indexOf(n) !== i);
if (dup.length) fails.push(`demo 名重复: ${dup}`);

console.log('迁移统计:');
console.log(`  demos: ${allDemos.length}  quizzes: ${allQuizzes.length}`);
for (const d of decks)
  console.log(
    `  ${d.id}: ${d.sections.length} sections, ${d.toc.length} toc 项, demos=[${d.sections
      .flatMap((s) => s.blocks.filter((b) => b.type === 'demo').map((b) => b.name))
      .join(',')}]`
  );
console.log(`  home: ${home.sections.length} sections, ${home.toc.length} toc 项`);

/* ------------------------------------------------------------------- 落盘 */
for (const d of decks) writeFileSync(join(OUT, `${d.id}.ts`), serializeDeck(d), 'utf8');
writeFileSync(join(OUT, 'home.ts'), serializeDeck(home, true), 'utf8');

const deckImports = decks.map((d) => `import ${d.id} from './${d.id}';`).join('\n');
writeFileSync(
  join(OUT, 'index.ts'),
  `/* 由 scripts/migrate.mjs 自动生成 */
import type { DeckData } from './types';
import home from './home';
${deckImports}

export const homeData = home;
export const decks: DeckData[] = [${decks.map((d) => d.id).join(', ')}];
`,
  'utf8'
);

if (fails.length) {
  console.error('\n✗ 校验失败:');
  for (const f of fails) console.error('  - ' + f);
  process.exit(1);
}
console.log('\n✓ 全部对账通过，内容已写入 src/content/');
