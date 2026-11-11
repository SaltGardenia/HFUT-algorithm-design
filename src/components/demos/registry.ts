/** 动画注册表：content 里的 demo name → DemoDef（与原 HB.register 一一对应，共 24 个） */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DemoDef } from './types';
import { insertionSort } from './insertion-sort';
import { selectionSort } from './selection-sort';
import { quickPartition } from './quick-partition';
import { countInsertion } from './count-insertion';
import { deck1Part } from './registry-parts/deck1';
import { deck3Part } from './registry-parts/deck3';
import { deck4Part } from './registry-parts/deck4';
import { deck5Part } from './registry-parts/deck5';
import { deck6Part } from './registry-parts/deck6';
import { deck7Part } from './registry-parts/deck7';
import { deck8Part } from './registry-parts/deck8';

export const registry: Record<string, DemoDef<any>> = {
  // deck2（范例移植）
  'insertion-sort': insertionSort,
  'selection-sort': selectionSort,
  'quick-partition': quickPartition,
  'count-insertion': countInsertion,
  ...deck1Part,
  ...deck3Part,
  ...deck4Part,
  ...deck5Part,
  ...deck6Part,
  ...deck7Part,
  ...deck8Part,
};

export const demoNames = Object.keys(registry);
