/* eslint-disable @typescript-eslint/no-explicit-any */
/** deck8（L7 贪心法）的动画注册片段：content 里的 demo name → DemoDef */
import type { DemoDef } from '../types';
import { primMst } from '../prim-mst';
import { activitySelect } from '../activity-select';
import { huffman } from '../huffman';

export const deck8Part: Record<string, DemoDef<any>> = {
  'prim-mst': primMst,
  'activity-select': activitySelect,
  'huffman': huffman,
};
