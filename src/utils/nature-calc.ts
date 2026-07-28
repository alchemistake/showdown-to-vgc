import type { StatID } from '@pkmn/data';
import { Dex } from '@pkmn/dex';

export function calcNatureMultiplier(stat: StatID, nature: string): number {
  const natureObj = Dex.natures.get(nature);

  if (natureObj) {
    const plus = natureObj.plus;
    const minus = natureObj.minus;

    if (plus === stat) {
      return 1.1;
    } else if (minus === stat) {
      return 0.9;
    }
  }
  return 1.0;
}
