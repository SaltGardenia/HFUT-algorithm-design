import type { DemoDef } from '../types';
import { randomizedSelect } from '../randomized-select';
import { medianOfMedians } from '../median-of-medians';

export const deck5Part: Record<string, DemoDef<any>> = {
  'randomized-select': randomizedSelect,
  'median-of-medians': medianOfMedians,
};
