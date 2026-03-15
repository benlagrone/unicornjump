const clampIndex = (index, length) => Math.min(length - 1, Math.max(0, index));

export const createCreatureEncounter = (biome, platforms) => {
  const anchorIndex = clampIndex(platforms.length - 4, platforms.length);
  const platform = platforms[anchorIndex];

  return {
    ...biome.creature,
    platformId: platform.id,
    x: platform.x + platform.width / 2 - 34,
    y: platform.y - 54,
    width: 68,
    height: 54,
    interactionRadius: 116,
    met: false,
    thanked: false,
    lastInteractionAt: -2000,
  };
};

export const isPlayerNearCreature = (player, creature, playerSize) => {
  const playerCenterX = player.x + playerSize.width / 2;
  const playerCenterY = player.y + playerSize.height / 2;
  const creatureCenterX = creature.x + creature.width / 2;
  const creatureCenterY = creature.y + creature.height / 2;

  const dx = playerCenterX - creatureCenterX;
  const dy = playerCenterY - creatureCenterY;

  return Math.hypot(dx, dy) <= creature.interactionRadius;
};
