/**
 * 24 个动画的帧数契约测试：
 * 帧数必须与《使用说明》记录的步数逐一一致（这是内容正确性的硬校验），
 * 并用 renderToStaticMarkup 渲染每个动画的每一帧，确保纯渲染无异常。
 */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { registry, demoNames } from '../components/demos/registry';

/** 文档记录的步数（来自使用说明.md 的 24 个交互动画表） */
const EXPECTED_STEPS: Record<string, number> = {
  euclid: 14,
  quickselect: 29,
  'insertion-sort': 90,
  'selection-sort': 152,
  'quick-partition': 11,
  'count-insertion': 12,
  'substitution-fail': 8,
  'recursion-tree': 7,
  'master-three-cases': 10,
  'decision-tree': 9,
  'counting-sort': 20,
  'radix-sort': 12,
  'randomized-select': 22,
  'median-of-medians': 15,
  'fast-power': 12,
  'hanoi-tower': 12,
  'binary-search': 10,
  'rod-cutting': 15,
  'matrix-chain': 17,
  'lcs-table': 18,
  'assembly-line': 14,
  'prim-mst': 14,
  'activity-select': 15,
  huffman: 16,
};

describe('demo registry', () => {
  it('注册表恰好包含 24 个动画，与内容引用的 name 完全一致', () => {
    expect(demoNames.sort()).toEqual(Object.keys(EXPECTED_STEPS).sort());
  });
});

describe('demo frame contract', () => {
  for (const [name, expected] of Object.entries(EXPECTED_STEPS)) {
    it(`${name}: ${expected} 帧`, () => {
      const def = registry[name];
      expect(def, `registry 缺少 ${name}`).toBeDefined();
      const frames = def.build();
      expect(frames.length).toBe(expected);
      for (const f of frames) {
        expect(typeof f.cap).toBe('string');
        expect(f.cap.length).toBeGreaterThan(0);
        expect(f.cap).not.toMatch(/^第 \d+ \/ \d+ 步/);
      }
    });

    it(`${name}: 每一帧静态渲染无异常`, () => {
      const def = registry[name];
      const frames = def.build();
      const first = renderToStaticMarkup(
        <svg viewBox={`0 0 ${def.w} ${def.h}`}>
          <def.View frame={frames[0]} />
        </svg>,
      );
      const last = renderToStaticMarkup(
        <svg viewBox={`0 0 ${def.w} ${def.h}`}>
          <def.View frame={frames[frames.length - 1]} />
        </svg>,
      );
      expect(first).toContain('<svg');
      expect(last).toContain('<svg');
      expect(first).not.toContain('NaN');
      expect(last).not.toContain('NaN');
      expect(first).not.toContain('undefined');
    });
  }
});
