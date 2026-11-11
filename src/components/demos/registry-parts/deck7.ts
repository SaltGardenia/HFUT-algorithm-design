import type { DemoDef } from '../types';
import { rodCutting } from '../rod-cutting';
import { matrixChain } from '../matrix-chain';
import { lcsTable } from '../lcs-table';
import { assemblyLine } from '../assembly-line';

export const deck7Part: Record<string, DemoDef<any>> = {
  'rod-cutting': rodCutting,
  'matrix-chain': matrixChain,
  'lcs-table': lcsTable,
  'assembly-line': assemblyLine,
};
