import type { DemoDef } from '../types';
import { hanoiTower } from '../hanoi-tower';
import { fastPower } from '../fast-power';
import { binarySearch } from '../binary-search';

export const deck6Part: Record<string, DemoDef<any>> = {
  'hanoi-tower': hanoiTower,
  'fast-power': fastPower,
  'binary-search': binarySearch,
};
