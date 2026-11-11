import type { ComponentType } from 'react';

/** 所有动画帧的公共契约：cap 为当前步骤的解说 HTML */
export interface DemoFrame {
  cap: string;
}

/**
 * 一个动画的定义：
 *  - build(): 生成全部帧（纯数据，一次性预计算）
 *  - View:    帧渲染器（纯函数组件，输出 SVG 子元素）
 *  - w / h:   SVG viewBox 尺寸
 */
export interface DemoDef<F extends DemoFrame = DemoFrame> {
  build: () => F[];
  View: ComponentType<{ frame: F }>;
  w: number;
  h: number;
}

export type AnyDemoDef = DemoDef<never> & { build: () => DemoFrame[] };
