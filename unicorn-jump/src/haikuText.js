const haiku = (...lines) => lines;

export const toHaikuText = (lines) => lines.join('\n');
export const toBrowserTitle = (lines) => lines.join(' | ');

const REGION_HAIKUS = {
  'lantern-bamboo-valley': haiku(
    'Lantern mists drift gold',
    'bamboo bridges sway and glow',
    'mountain hushes sing'
  ),
  'highland-meadow': haiku(
    'Misty hills hum low',
    'stone rings listen to the breeze',
    'meadow clouds drift by'
  ),
  'storybook-forest': haiku(
    'Mushroom pages sway',
    'paper trees trade twinkly tales',
    'soft stars turn the leaves'
  ),
  'sun-orchard': haiku(
    'Warm arches hold light',
    'small birds stitch gold through sweet air',
    'fruit songs wake the grove'
  ),
  'bluebonnet-prairie': haiku(
    'Bluebonnets lean bright',
    'fireflies wink through open sky',
    'windmills hum hello'
  ),
};

const COMPANION_TOOLTIP_HAIKUS = {
  'guide-lights': (companion) =>
    haiku(
      companion.name,
      'small stars mark the kind safe leaves',
      'soft guidance floats near'
    ),
  'gentle-breeze': (companion) =>
    haiku(
      companion.name,
      'long falls turn to feather air',
      'soft breezes catch you'
    ),
  'leaf-bloom': (companion) =>
    haiku(
      companion.name,
      'rescue leaves bloom wide below',
      'soft landings grow near'
    ),
  'joy-chime': (companion) =>
    haiku(
      companion.name,
      'gold notes ring on every find',
      'bright joy trails your hops'
    ),
  'firefly-magnet': (companion) =>
    haiku(
      companion.name,
      'tiny lights drift to your hooves',
      'soft sparks gather close'
    ),
};

export const getBrowserTitle = () => 'Unicorn Jump | World Garden';

export const getBrowserTitleHaiku = () =>
  haiku('Unicorn Jump wakes', 'garden songs say hello', 'bright paths bloom above');

export const getMenuBadgeTitle = () => 'World Map';

export const getMenuBadgeHaiku = () =>
  haiku('Round garden world hums', 'bright rings circle sleepy clouds', 'soft hooves choose a path');

export const getMenuTitleLines = () => ['Unicorn Jump', 'World Garden'];

export const getMenuTitleHaiku = () =>
  haiku('Round little world turns', 'five bright lands ring leafy skies', 'pick a land and leap');

export const getMenuIntroHaiku = () =>
  haiku('Pick a world', 'Land and explore', 'Then jump and help');

export const getStartButtonHaiku = ({ activeBiome, allGardensRestored, hasJourneyProgress }) => {
  if (allGardensRestored) {
    return haiku(activeBiome.shortName, 'still glows inside the round world', 'tap here to leap');
  }

  if (hasJourneyProgress) {
    return haiku(activeBiome.shortName, 'waits inside the bright round world', 'tap here to leap');
  }

  return haiku(activeBiome.shortName, 'waits for your very first hops', 'tap here to leap');
};

export const getSettingsButtonTitle = () => 'Settings';

export const getSettingsButtonHaiku = () =>
  haiku('Tune bells now', 'pick breezes and soft gaps', 'make it yours');

export const getWorldSelectedLandTitle = (biome) => biome.name;

export const getWorldProgressTitle = () => 'World Progress';

export const getBestHarmonyTitle = () => 'Best Score';

export const getCompanionsTitle = () => 'Friends';

export const getGardenCardHaiku = (biome) => [biome.name, ...REGION_HAIKUS[biome.id].slice(1)];

export const getCompanionCardHaiku = (companionCount) =>
  companionCount > 0
    ? haiku(`${companionCount} friends`, 'jump with you', 'more can join')
    : haiku('No friends yet', 'help a friend', 'win a friend');

export const getHarmonyCardHaiku = () =>
  haiku('Score goes up', 'when you jump', 'and help friends');

export const getJourneyMapHaiku = () =>
  haiku('Pick a world', 'Tap play', 'Start jumping');

export const getWorldSelectedLandHaiku = (biome, { isComplete, isCurrent }) =>
  haiku(
    biome.name,
    isComplete ? 'soft lights bloom there once again' : REGION_HAIKUS[biome.id][1],
    isCurrent ? 'this bright ring waits for your hooves' : 'tap the ring to wander there'
  );

export const getWorldCenterHaiku = (biome, isComplete) =>
  haiku(
    biome.shortName,
    isComplete ? 'glows and waits for one more leap' : 'waits inside the bright round world',
    'tap here for sky hops'
  );

export const getWorldCenterTitleLines = (biome) => ['Enter', biome.shortName];

export const getWorldProgressHaiku = (completedCount, totalCount) =>
  haiku(`${completedCount} of ${totalCount}`, 'worlds are done', 'more wait ahead');

export const getJourneyStopHaiku = (biome, { isComplete, isCurrent }) => {
  if (isComplete) {
    return haiku(biome.name, `${biome.creature.name} smiles`, 'soft lights bloom again');
  }

  if (isCurrent) {
    return haiku(biome.name, `${biome.creature.name} still waits`, 'your next hop begins');
  }

  return haiku(biome.name, `${biome.creature.name} dreams ahead`, 'soft paths rest in mist');
};

export const getBiomeCompleteBadgeHaiku = () =>
  haiku('Garden mended now', 'kind lights bloom from leaf to leaf', 'soft thanks fill the air');

export const getBiomeCompleteBadgeTitle = () => 'Biome Restored';

export const getBiomeCompleteTitleLines = (completionInfo) => [completionInfo.biomeName, 'Restored'];

export const getBiomeCompleteTitleHaiku = (completionInfo) =>
  haiku(completionInfo.biomeName, 'glows with gentle joy', 'little stars applaud');

export const getBiomeCompleteBodyHaiku = (completionInfo) =>
  haiku(
    `${completionInfo.creatureName} now beams`,
    `${completionInfo.companion.name} floats beside you`,
    'the next path wakes ahead'
  );

export const getRunningHarmonyHaiku = () =>
  haiku('Harmony so far', 'bright notes sparkle in your jar', 'keep the song alive');

export const getRunningHarmonyTitle = () => 'Total Harmony';

export const getNextGardenHaiku = (nextBiome) =>
  haiku(nextBiome.name, 'soft leaves lean ahead', 'new friends wait up high');

export const getNextGardenTitle = () => 'Next Land';

export const getTravelButtonTitle = () => 'Travel On';

export const getTravelButtonHaiku = () =>
  haiku('Travel onward', 'next bright garden waits', 'up we go');

export const getGardenMapButtonTitle = () => 'World Map';

export const getGardenMapButtonHaiku = () =>
  haiku('See map now', 'all soft paths rest here', 'choose a bloom');

export const getFinalWinBadgeHaiku = () =>
  haiku('All gardens now sing', 'five soft biomes glow as one', 'kind clouds clap above');

export const getFinalWinBadgeTitle = () => 'All Gardens Restored';

export const getFinalWinTitleLines = () => ['Harmony', 'Comes Home'];

export const getFinalWinBodyHaiku = (completionInfo) =>
  haiku(
    `${completionInfo.companion.name} joins in`,
    'all the leafy lantern songs',
    'wait for one more ride'
  );

export const getFinalWinTitleHaiku = () =>
  haiku('Every garden glows', 'unicorn hoofbeats brought them home', 'bright peace fills the sky');

export const getFinalHarmonyHaiku = () =>
  haiku('Final harmony', 'gold notes settle into stars', 'soft cheers fill the sky');

export const getFinalHarmonyTitle = () => 'Final Harmony';

export const getBestHarmonyHaiku = () =>
  haiku('Best harmony yet', 'your brightest song still sparkles', 'gold joy waits right here');

export const getPlayAgainTitle = () => 'Play Again';

export const getPlayAgainHaiku = () => haiku('Play again', 'new bright dawn waits', 'up we go');

export const getSettingsTitle = () => 'Settings';

export const getSettingsIntroHaiku = () =>
  haiku('Pick your sound', 'Pick easy or hard', 'Then jump');

export const getSettingsTitleHaiku = () => getSettingsIntroHaiku();

export const getSoundTitle = () => 'Sound Effects';

export const getSoundLabelHaiku = () =>
  haiku('Tiny bells can ring', 'every landing gets a chime', 'if you want bright noise');

export const getMusicTitle = () => 'Background Music';

export const getMusicLabelHaiku = () =>
  haiku('Soft songs drift nearby', 'little breezes hum a tune', 'let the garden sway');

export const getDifficultyTitle = () => 'Difficulty';

export const getDifficultyLabelHaiku = () =>
  haiku('Choose climbing breeze', 'some paths nestle some drift wide', 'pick your hopping day');

export const getDifficultyOptionTitle = (difficulty) => {
  switch (difficulty) {
    case 'gentle':
      return 'Gentle';
    case 'adventurous':
      return 'Adventurous';
    case 'normal':
    default:
      return 'Normal';
  }
};

export const getDifficultyOptionHaiku = (difficulty) => {
  switch (difficulty) {
    case 'gentle':
      return haiku('Gentle cloud steps', 'leaves cuddle close to your hooves', 'easy hops today');
    case 'adventurous':
      return haiku('Brave bright sky leaps', 'leaves drift wider in the wind', 'bold hooves chase the sun');
    case 'normal':
    default:
      return haiku('Steady sky hops', 'paths leave room to dream and land', 'balanced breezes blow');
  }
};

export const getCloseSettingsTitle = () => 'Close';

export const getCloseSettingsHaiku = () =>
  haiku('Close this nook', 'little choices nap', 'back to play');

export const getSaveSettingsTitle = () => 'Save';

export const getSaveSettingsHaiku = () =>
  haiku('Save wishes now', 'bells and breezes learn', 'ready to hop');

export const getBiomeHudTitle = (biomeIndex, totalBiomes) =>
  `World ${biomeIndex + 1} / ${totalBiomes}`;

export const getBiomeHudHaiku = (biomeIndex, totalBiomes) =>
  haiku(
    `Garden ${biomeIndex + 1} of ${totalBiomes}`,
    'soft winds lift this day',
    'bright leaves wait above'
  );

export const getScoreHudTitle = () => 'Score';

export const getScoreHudHaiku = () =>
  haiku('Harmony jar hums', 'gold notes gather with each hop', 'bright joy stacks up high');

export const getQuestLabelTitle = () => 'Quest';

export const getQuestTitle = (biome) => `Help ${biome.creature.name}`;

export const getQuestTitleHaiku = (biome) =>
  haiku(biome.creature.name, 'shares a small sky wish', 'bright help wakes the gate');

export const getQuestInstructionHaiku = (biome, quest, sceneMode = 'climb') => {
  if (sceneMode === 'landing') {
    if (!quest.started) {
      return haiku(`Meet ${biome.creature.name}`, 'Tap friend to help', 'Then tap the gate');
    }

    return haiku('Sky gate is ready', 'Tap the bright arch', 'Then jump up');
  }

  if (quest.completed) {
    return haiku('Gate is open', 'Jump to the top', 'You did it');
  }

  if (!quest.started) {
    return haiku(`Find ${biome.creature.name}`, 'Tap friend to help', 'Then jump up');
  }

  return haiku(`Find ${quest.total} ${quest.itemPlural}`, 'Jump up to get them', 'Then open the gate');
};

export const getQuestProgressHaiku = (quest) => {
  if (quest.completed) {
    return haiku(`${quest.total} of ${quest.total} now glow`, 'the gate stretches into song', 'land high and finish');
  }

  return haiku(
    `${quest.collected} of ${quest.total} now sing`,
    'one more bright light wakes the gate',
    'soft path waits above'
  );
};

export const getGateStatusTitle = (quest) =>
  quest.completed ? 'Gate Open' : 'Gate Closed';

export const getGateStatusHaiku = (quest) =>
  quest.completed
    ? haiku('Gate wakes now', 'soft gold leaves open and sing', 'upward path is yours')
    : haiku('Gate still dreams', 'kind help must bloom first below', 'soft hush holds the arch');

export const getRegionHaiku = (biome) => REGION_HAIKUS[biome.id];

export const getTravelNotesTitle = () => 'Travel Notes';

export const getControlsHaiku = (sceneMode = 'climb', questStarted = false) => {
  if (sceneMode === 'landing') {
    return questStarted
      ? haiku('Touch left or right', 'Tap the sky gate', 'Start jumping')
      : haiku('Touch left or right', 'Tap friend to help', 'Then tap the gate');
  }

  return haiku('Touch left or right', 'Tap friend to help', 'Jump up high');
};

export const getGoalBannerTitle = (biome, questCompleted) =>
  questCompleted ? biome.goalLabel : `Help ${biome.creature.name} First`;

export const getGoalBannerHaiku = (biome, questCompleted) =>
  questCompleted
    ? haiku(biome.goalLabel, 'soft gate wakes at last', 'land here to finish')
    : haiku(`${biome.creature.name} waits`, 'three bright gifts still need your care', 'then this gate can wake');

export const getCompanionTooltipHaiku = (companion) => {
  const tooltipBuilder = COMPANION_TOOLTIP_HAIKUS[companion.effect];

  return tooltipBuilder
    ? tooltipBuilder(companion)
    : haiku(companion.name, 'small helper lights drift near', 'soft magic trails you');
};

export const getPauseHaiku = () =>
  haiku('Game paused', 'Press escape', 'Jump again');

export const getIntroDialogHaiku = (biome) =>
  haiku(`Hi from ${biome.creature.name}`, `Please get ${biome.quest.total} ${biome.quest.itemPlural}`, 'Thank you');

export const getReminderDialogHaiku = (biome, quest) =>
  haiku(`${quest.collected} found`, `${quest.total} to get`, `Help ${biome.creature.name}`);

export const getCollectDialogHaiku = (biome, quest, collected, total) =>
  haiku(`${quest.itemLabel} found`, `${collected} of ${total}`, `${biome.shortName} smiles`);

export const getQuestCompleteDialogHaiku = (biome, nextBiome) =>
  haiku(`${biome.creature.name} is happy`, `${biome.companion.name} joins you`, nextBiome ? `${nextBiome.shortName} is next` : 'All worlds glow');

export const getGoalLockedDialogHaiku = (biome) =>
  haiku('Gate is closed', `Help ${biome.creature.name} first`, 'Then jump up');

export const getRescueDialogHaiku = () =>
  haiku('Soft leaf save', 'Try that jump again', 'You are okay');
