import {
  getCollectDialogHaiku,
  getGoalLockedDialogHaiku,
  getIntroDialogHaiku,
  getQuestCompleteDialogHaiku,
  getReminderDialogHaiku,
  getRescueDialogHaiku,
} from './haikuText';

export const createDialog = (speaker, lines, tone = 'warm', durationMs = 3600) => ({
  speaker,
  lines,
  tone,
  durationMs,
});

export const buildIntroDialog = (biome) =>
  createDialog(null, getIntroDialogHaiku(biome), 'warm', 4600);

export const buildReminderDialog = (biome, quest) =>
  createDialog(null, getReminderDialogHaiku(biome, quest), 'hint', 3600);

export const buildCollectDialog = (biome, quest, collected, total) =>
  createDialog(null, getCollectDialogHaiku(biome, quest, collected, total), 'celebrate', 2600);

export const buildQuestCompleteDialog = (biome, nextBiome) =>
  createDialog(null, getQuestCompleteDialogHaiku(biome, nextBiome), 'celebrate', 5200);

export const buildGoalLockedDialog = (biome, quest) =>
  createDialog(null, getGoalLockedDialogHaiku(biome, quest), 'hint', 3200);

export const buildRescueDialog = () =>
  createDialog(null, getRescueDialogHaiku(), 'hint', 3000);
