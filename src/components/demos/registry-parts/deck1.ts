/* eslint-disable @typescript-eslint/no-explicit-any */
/** deck1（L1 绪论与算法设计思维）的动画注册片段：content 里的 demo name → DemoDef */
import type { DemoDef } from '../types';
import { euclid } from '../euclid';
import { quickselect } from '../quickselect';

export const deck1Part: Record<string, DemoDef<any>> = {
  'euclid': euclid,
  'quickselect': quickselect,
};
