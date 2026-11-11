/** deck4（L3 线性时间排序）的动画注册片段：content 里的 demo name → DemoDef */
import type { DemoDef } from '../types';
import { decisionTree } from '../decision-tree';
import { countingSort } from '../counting-sort';
import { radixSort } from '../radix-sort';

export const deck4Part: Record<string, DemoDef<any>> = {
  'decision-tree': decisionTree,
  'counting-sort': countingSort,
  'radix-sort': radixSort,
};
