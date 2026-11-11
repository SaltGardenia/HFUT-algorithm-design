import type { DemoDef } from '../types';
import { substitutionFail } from '../substitution-fail';
import { recursionTree } from '../recursion-tree';
import { masterThreeCases } from '../master-three-cases';

export const deck3Part: Record<string, DemoDef<any>> = {
  'substitution-fail': substitutionFail,
  'recursion-tree': recursionTree,
  'master-three-cases': masterThreeCases,
};
