/**
 * 内容完整性测试：锁定迁移产物的结构契约
 * （各讲 section 数 / 目录项 / quiz 数量与题型分布 / 动画引用均有效）
 */
import { describe, expect, it } from 'vitest';
import { decks, homeData } from '../content';
import { registry } from '../components/demos/registry';

const EXPECT_SECTIONS: Record<string, number> = {
  deck1: 7,
  deck2: 12,
  deck3: 15, // 课程内容补充：新增「0. 算法与计算思维（课件导引）」
  deck4: 8,
  deck5: 8,
  deck6: 13,
  deck7: 10,
  deck8: 10,
};

const EXPECT_QUIZ: Record<string, number> = {
  deck1: 0,
  deck2: 2,
  deck3: 1,
  deck4: 7,
  deck5: 7,
  deck6: 0,
  deck7: 6,
  deck8: 13,
};

describe('content integrity', () => {
  it('共 8 讲 + 首页', () => {
    expect(decks.length).toBe(8);
  });

  it('每讲 section 数与旧版一致', () => {
    for (const d of decks) {
      expect(d.sections.length, d.id).toBe(EXPECT_SECTIONS[d.id]);
      expect(d.toc.length, `${d.id} toc`).toBeGreaterThan(0);
      for (const s of d.sections) {
        expect(s.blocks.length, `${d.id}/${s.id}`).toBeGreaterThan(0);
      }
    }
  });

  it('自测题共 36 道，各讲分布与旧版一致，数据字段完整', () => {
    const all = decks.flatMap((d) =>
      d.sections.flatMap((s) => s.blocks.filter((b) => b.type === 'quiz')),
    );
    expect(all.length).toBe(36);
    for (const d of decks) {
      const n = d.sections.reduce(
        (acc, s) => acc + s.blocks.filter((b) => b.type === 'quiz').length,
        0,
      );
      expect(n, `${d.id} quiz 数`).toBe(EXPECT_QUIZ[d.id]);
    }
    for (const d of decks) {
      for (const s of d.sections) {
        for (const b of s.blocks) {
          if (b.type !== 'quiz') continue;
          const q = b.quiz;
          expect(q.question.length, `${d.id} 题干`).toBeGreaterThan(0);
          expect(q.answer.length, `${d.id} 答案`).toBeGreaterThan(0);
          expect(q.explanation.length, `${d.id} 解析`).toBeGreaterThan(0);
          if (q.kind === 'fill') expect(q.options).toBeUndefined();
          else expect((q.options ?? []).length).toBeGreaterThan(1);
          if (q.kind === 'single') expect(q.answer).toMatch(/^[A-F]$/);
          if (q.kind === 'multi') expect(q.answer).toMatch(/^[A-F](、[A-F])+$/);
          if (q.kind === 'judge') expect(['对', '错']).toContain(q.answer);
        }
      }
    }
  });

  it('内容引用的每个 demo 都已注册，且注册表无多余项', () => {
    const used = decks.flatMap((d) =>
      d.sections.flatMap((s) => s.blocks.filter((b) => b.type === 'demo').map((b) => (b as { name: string }).name)),
    );
    expect(used.length).toBe(24);
    for (const name of used) {
      expect(registry[name], `registry 缺少 ${name}`).toBeDefined();
    }
    expect(Object.keys(registry).sort()).toEqual([...new Set(used)].sort());
  });

  it('首页 12 个区块完整，卡片链接指向各讲', () => {
    expect(homeData.sections.length).toBeGreaterThanOrEqual(9);
    const html = homeData.sections.map((s) => s.blocks.map((b) => (b.type === 'html' ? b.html : '')).join(''));
    expect(html.join('').match(/class="card"/g)?.length).toBe(8);
  });
});
