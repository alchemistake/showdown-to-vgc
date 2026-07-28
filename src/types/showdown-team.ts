import type { PokemonSet } from '@pkmn/sets';

export interface ShowdownTeam {
  team: Array<Partial<PokemonSet<string>>>;
}
