import { Generation, Generations, type PokemonSet } from '@pkmn/data';
import type { Format, GenerationID } from '../types/format';
import type { VGCPokemon, VGCTeam } from '../types/vgc-team';
import { FormRequiredSpecies } from '../data/form-required-species';
import { calcStatChampions } from './stat-calc';
import { Dex as GenerationDex, type StatID } from '@pkmn/dex';
import type { Species } from '@pkmn/dex-types';
import type { ShowdownTeam } from '../types/showdown-team';

export function getVGCTeam(
  showdownTeam: ShowdownTeam,
  genNum: GenerationID,
  format: Format = undefined,
): VGCTeam {
  try {
    if (!showdownTeam) return;

    const team = showdownTeam.team;
    if (!team) throw new Error('Unable to get team');

    const generation = new Generations(GenerationDex).get(genNum);
    if (!generation) throw new Error('Unable to get dex for ${generationNum}');

    const teamDexIds = team.map((set) => set.species);
    if (teamDexIds.length === 0 || teamDexIds.length > 6) return;

    const speciesData = teamDexIds.map((id) => generation.species.get(id!));
    if (speciesData.length === 0) return;

    if (speciesData.length !== team.length) {
      throw new Error('Mismatch between species data and team set list lengths');
    }

    const isChampionsFormat = format === 'champions';
    const vgcTeam: VGCTeam = [];

    team.forEach((set, index) => {
      const species = speciesData[index];

      if (!species) throw new Error(`Unable to find species for ${set.species}`);

      const vgcPokemon = createVGCSheetPokemon(set, species, generation, isChampionsFormat);
      vgcTeam.push(vgcPokemon);
    });

    return vgcTeam;
  } catch (error) {
    console.error(error);
  }
}

function createVGCSheetPokemon(
  set: Partial<PokemonSet<string>>,
  species: Species,
  generation: Generation,
  isChampionsFormat: boolean,
): VGCPokemon {
  const getName = () => {
    if (FormRequiredSpecies.some((formSpecies) => species.name == formSpecies)) {
      return `${species.baseSpecies}-${species.baseForme}`;
    }
    return species.name;
  };

  const nature = set.nature?.length ? set.nature : 'Serious';
  const level = set.level ?? 50;
  const evs = (set.evs ?? {}) as Partial<Record<StatID, number>>;
  const ivs = (set.ivs ?? {}) as Partial<Record<StatID, number>>;
  const teraType = isChampionsFormat ? undefined : set.teraType ?? species.types[0];

  const vgcPokemon: VGCPokemon = {
    name: getName(),
    teraType,
    ability: set.ability,
    item: set.item,
    moves: set.moves ?? [],
    level,
    nature,
    gender: set.gender,
    species: set.species ?? species.name,
    stats: {
      hp: 0,
      atk: 0,
      def: 0,
      spa: 0,
      spd: 0,
      spe: 0,
    },
  };

  for (const statKey of Object.keys(vgcPokemon.stats)) {
    const statId = statKey as StatID;
    if (isChampionsFormat) {
      vgcPokemon.stats[statId] = calcStatChampions(
        statId,
        species.baseStats[statId],
        evs[statId] ?? 0,
        nature,
      );
    } else {
      vgcPokemon.stats[statId] = generation.stats.calc(
        statId,
        species.baseStats[statId],
        ivs[statId],
        evs[statId],
        level,
        generation.natures.get(nature),
      );
    }
  }

  return vgcPokemon;
}
