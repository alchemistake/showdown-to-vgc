import { test } from 'node:test';
import assert from 'node:assert/strict';

import { getShowdownTeam } from '../utils/showdown-parser';
import { getVGCTeam } from '../utils/vgc-team-parser';
import { calcStatChampions } from '../utils/stat-calc';
import { calcNatureMultiplier } from '../utils/nature-calc';
import { getVGCTeam as packageGetVGCTeam } from '../index';

const sampleTeamGenerations = `
Pikachu @ Light Ball
Ability: Lightning Rod
Level: 50
EVs: 252 Spe / 252 Atk
Timid Nature
- Quick Attack
- Thunderbolt
- Nasty Plot
- Volt Tackle
`;

const sampleTeamChampions = `
Dragonite @ Dragoninite  
Ability: Multiscale  
Level: 50  
EVs: 32 HP / 2 Def / 32 SpA 
Calm Nature  
- Hurricane  
- Protect  
- Thunderbolt  
- Draco Meteor
`;

test('getShowdownTeam parses a valid team into a structured team object', () => {
  const team = getShowdownTeam(sampleTeamGenerations, 9);

  assert.ok(team);
  assert.ok(team?.team);
  assert.equal(team?.team?.length, 1);
  assert.equal(team?.team?.[0]?.species, 'Pikachu');
  assert.equal(team?.team?.[0]?.moves?.length, 4);
});

test('getShowdownTeam returns undefined for invalid input', () => {
  const team = getShowdownTeam('not a real team', 9);

  assert.equal(team, undefined);
});

test('getVGCTeam uses champion stat calculations for champions format', () => {
  const team = getShowdownTeam(sampleTeamChampions, 9);
  assert.ok(team);

  if (!team) throw new Error('team should be defined');
  const vgcTeam = getVGCTeam(team, 9, 'champions');

  assert.ok(vgcTeam);
  assert.equal(vgcTeam?.length, 1);

  const dragonite = vgcTeam?.[0];
  assert.ok(dragonite);
  if (!dragonite) throw new Error('dragonite should be defined');
  assert.equal(dragonite.name, 'Dragonite');
  assert.equal(dragonite.nature, 'Calm');
  assert.equal(dragonite.teraType, undefined);
  assert.equal(dragonite.stats.hp, 198);
  assert.equal(dragonite.stats.atk, 138);
  assert.equal(dragonite.stats.def, 117);
  assert.equal(dragonite.stats.spa, 152);
  assert.equal(dragonite.stats.spd, 132);
  assert.equal(dragonite.stats.spe, 100);
});

test('calcStatChampions applies the expected champion modifiers', () => {
  assert.equal(calcStatChampions('atk', 100, 10, 'Adamant'), 143);
  assert.equal(calcStatChampions('hp', 1, 0, 'Bold'), 1);
  assert.equal(calcStatChampions('hp', 50, 32, 'Calm'), 157);
});

test('nature multipliers reflect the plus and minus stats', () => {
  assert.equal(calcNatureMultiplier('atk', 'Adamant'), 1.1);
  assert.equal(calcNatureMultiplier('atk', 'Modest'), 0.9);
  assert.equal(calcNatureMultiplier('atk', 'Serious'), 1);
});

test('the package root exposes the public API', () => {
  assert.equal(typeof packageGetVGCTeam, 'function');
});
