const DEFAULT_ITEM_SIZE = 28;

const createQuestItem = (platform, biome, index, itemSize = DEFAULT_ITEM_SIZE) => ({
  id: `${biome.id}-quest-${index}`,
  type: biome.quest.itemType,
  label: biome.quest.itemLabel,
  x: platform.x + platform.width / 2 - itemSize / 2,
  y: platform.y - itemSize - Math.round(itemSize * 0.4),
  width: itemSize,
  height: itemSize,
  collected: false,
  platformId: platform.id,
});

export const createQuestState = (
  biome,
  platforms,
  creature,
  itemSize = DEFAULT_ITEM_SIZE
) => {
  const creaturePlatformIndex = platforms.findIndex(
    (platform) => platform.id === creature.platformId
  );
  const preferredIndexes = [];

  for (let index = 1; index < creaturePlatformIndex; index += 1) {
    preferredIndexes.push(index);
  }

  const fallbackIndexes = [];
  for (let index = 1; index < platforms.length - 1; index += 1) {
    fallbackIndexes.push(index);
  }

  const candidateIndexes =
    preferredIndexes.length >= biome.quest.total ? preferredIndexes : fallbackIndexes;
  const pickedIndexes = [];
  const uniqueIndexes = new Set();

  for (let index = 0; index < biome.quest.total; index += 1) {
    const ratio =
      biome.quest.total <= 1 ? 0 : index / Math.max(1, biome.quest.total - 1);
    const candidatePosition = Math.floor(ratio * Math.max(0, candidateIndexes.length - 1));
    let pickedIndex = candidateIndexes[candidatePosition] ?? candidateIndexes[candidateIndexes.length - 1];

    while (uniqueIndexes.has(pickedIndex) && pickedIndex < platforms.length - 2) {
      pickedIndex += 1;
    }
    while (uniqueIndexes.has(pickedIndex) && pickedIndex > 1) {
      pickedIndex -= 1;
    }

    uniqueIndexes.add(pickedIndex);
    pickedIndexes.push(pickedIndex);
  }

  const itemPlatforms = pickedIndexes.map((pickedIndex, index) =>
    createQuestItem(platforms[pickedIndex], biome, index, itemSize)
  );

  const guidePlatformIds = itemPlatforms.map((item) => item.platformId);

  return {
    ...biome.quest,
    started: false,
    completed: false,
    collected: 0,
    items: itemPlatforms,
    guidePlatformIds: [...guidePlatformIds, creature.platformId],
  };
};

export const getVisibleQuestItems = (quest) => quest.items.filter((item) => !item.collected);

export const collectNearbyQuestItems = (quest, player, playerSize, magnetRadius) => {
  let collectedNow = 0;
  const wasCompleted = quest.completed;

  quest.items.forEach((item) => {
    if (item.collected) {
      return;
    }

    const playerCenterX = player.x + playerSize.width / 2;
    const playerCenterY = player.y + playerSize.height / 2;
    const itemCenterX = item.x + item.width / 2;
    const itemCenterY = item.y + item.height / 2;
    const distance = Math.hypot(playerCenterX - itemCenterX, playerCenterY - itemCenterY);

    if (distance <= magnetRadius) {
      item.collected = true;
      collectedNow += 1;
    }
  });

  if (collectedNow > 0) {
    quest.collected += collectedNow;
    if (quest.collected >= quest.total) {
      quest.completed = true;
    }
  }

  return {
    collectedNow,
    justCompleted: !wasCompleted && quest.completed,
  };
};
