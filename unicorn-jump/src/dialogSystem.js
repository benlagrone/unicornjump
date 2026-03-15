export const createDialog = (speaker, lines, tone = 'warm', durationMs = 3600) => ({
  speaker,
  lines,
  tone,
  durationMs,
});

export const buildIntroDialog = (biome) =>
  createDialog(biome.creature.name, [biome.creature.greeting, biome.creature.prompt], 'warm', 4400);

export const buildReminderDialog = (biome, quest) =>
  createDialog(
    biome.creature.name,
    [
      biome.creature.reminder,
      `${quest.collectVerb} ${quest.total} ${quest.itemPlural}. ${quest.collected}/${quest.total} so far.`,
    ],
    'hint',
    3200
  );

export const buildCollectDialog = (biome, quest, collected, total) =>
  createDialog(
    biome.creature.name,
    [`You found a ${quest.itemLabel}!`, `${collected}/${total} gathered for ${biome.shortName}.`],
    'celebrate',
    2200
  );

export const buildQuestCompleteDialog = (biome, nextBiome) =>
  createDialog(
    biome.creature.name,
    [
      biome.creature.thanks,
      nextBiome
        ? `${biome.companion.name} joins you. ${nextBiome.name} is ready ahead.`
        : `${biome.companion.name} joins you. Every garden is glowing now.`,
    ],
    'celebrate',
    4800
  );

export const buildGoalLockedDialog = (biome, quest) =>
  createDialog(
    'Garden Gate',
    [`Help ${biome.creature.name} first.`, `${quest.collectVerb} ${quest.total} ${quest.itemPlural} to open this path.`],
    'hint',
    2600
  );

export const buildRescueDialog = () =>
  createDialog('Leaf Lift', ['A floating leaf catches the unicorn.', 'No bumps, just another gentle try.'], 'hint', 2600);
