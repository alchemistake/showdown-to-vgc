import type { StatID } from '@pkmn/data';
import { calcNatureMultiplier } from './nature-calc';

export function calcStatChampions(
  stat: StatID,
  baseStat: number,
  sp: number,
  nature: string,
): number {
  if (stat === 'hp') {
    if (baseStat === 1) return 1;

    return baseStat + sp + 75;
  } else {
    const natureMultiplierValue = calcNatureMultiplier(stat, nature);

    return Math.floor(natureMultiplierValue * (baseStat + sp + 20));
  }
}
