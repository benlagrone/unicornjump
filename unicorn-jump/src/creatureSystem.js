const clampIndex = (index, length) => Math.min(length - 1, Math.max(0, index));

const DEFAULT_CREATURE_WIDTH = 68;
const DEFAULT_CREATURE_HEIGHT = 54;
const DEFAULT_INTERACTION_RADIUS = 116;

export const createCreatureEncounter = (biome, platforms, sizeConfig = {}) => {
  const anchorIndex = clampIndex(platforms.length - 4, platforms.length);
  const platform = platforms[anchorIndex];
  const width = sizeConfig.width ?? DEFAULT_CREATURE_WIDTH;
  const height = sizeConfig.height ?? DEFAULT_CREATURE_HEIGHT;
  const interactionRadius = sizeConfig.interactionRadius ?? DEFAULT_INTERACTION_RADIUS;

  return {
    ...biome.creature,
    platformId: platform.id,
    x: platform.x + platform.width / 2 - width / 2,
    y: platform.y - height,
    width,
    height,
    interactionRadius,
    met: false,
    thanked: false,
    lastInteractionAt: -2000,
    reactionStartedAt: -2000,
    reactionUntil: 0,
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
