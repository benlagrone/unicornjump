import React, { useEffect, useRef, useState } from 'react';
import Character from './Character';
import { BIOMES, buildBiomeDecorations, getBiomeConfig, getNextBiomeConfig } from './biomeManager';
import {
  buildUnlockedCompanions,
  getCompanionBonuses,
  getCompanionForBiome,
} from './companionSystem';
import { createCreatureEncounter, isPlayerNearCreature } from './creatureSystem';
import { collectNearbyQuestItems, createQuestState } from './questSystem';
import {
  createDialog,
  buildCollectDialog,
  buildGoalLockedDialog,
  buildIntroDialog,
  buildQuestCompleteDialog,
  buildReminderDialog,
  buildRescueDialog,
} from './dialogSystem';
import {
  getBiomeHudTitle,
  getCompanionTooltipHaiku,
  getControlsHaiku,
  getGateStatusTitle,
  getGoalBannerTitle,
  getPauseHaiku,
  getQuestInstructionHaiku,
  getQuestLabelTitle,
  getQuestTitle,
  getRegionHaiku,
  getScoreHudTitle,
  getTravelNotesTitle,
  toHaikuText,
} from './haikuText';
import {
  getCompanionSpriteAsset,
  getCreatureSpriteAsset,
  getLandingGroundCapAsset,
  getWorldGateSpriteAsset,
  getLandingVillageSpriteAsset,
  getObstacleSpriteAsset,
  getPlatformTrimAsset,
  getQuestItemSpriteAsset,
  getRescueLeafSpriteAsset,
  getWorldLandmarkSpriteAsset,
} from './spriteCatalog';
import useGameAudio from './useGameAudio';

const BASE_CHARACTER_WIDTH = 100;
const BASE_CHARACTER_HEIGHT = 100;
const BASE_PLATFORM_WIDTH = 180;
const BASE_PLATFORM_HEIGHT = 42;
const BASE_GOAL_PLATFORM_WIDTH = 240;
const BASE_PLATFORM_MARGIN_RATIO = 0.2;
const BASE_MOVE_SPEED = 440;
const BASE_GRAVITY = 2100;
const BASE_JUMP_VELOCITY = -1080;
const FIXED_STEP_MS = 1000 / 60;
const BACKGROUND_ASPECT_RATIO = 1298 / 1024;
const CAMERA_TOP_TARGET_RATIO = 0.34;
const CAMERA_BOTTOM_TARGET_RATIO = 0.7;
const LEVEL_MIN_HEIGHT_RATIO = 1.72;
const BASE_GOAL_PLATFORM_Y = 120;
const BASE_START_PLATFORM_Y_OFFSET = 150;
const BASE_RESCUE_LEAF_WIDTH = 176;
const BASE_RESCUE_LEAF_HEIGHT = 34;
const BASE_FLOAT_DESCENT_SPEED = 140;
const DIALOG_GAP_MS = 1000;
const PLATFORM_X_PATTERN = [0, -78, 54, -36, 68, -52, 42, 0];
const BASE_CREATURE_WIDTH = 68;
const BASE_CREATURE_HEIGHT = 54;
const BASE_CREATURE_INTERACTION_RADIUS = 116;
const BASE_QUEST_ITEM_SIZE = 28;
const BASE_WORLD_PLATFORM_HEIGHT = 118;
const BASE_WORLD_GATE_WIDTH = 154;
const BASE_WORLD_GATE_HEIGHT = 104;
const BASE_WORLD_LANDMARK_SIZE = 86;
const BASE_WORLD_INTERACTION_RADIUS = 124;

const PLATFORM_IMAGES = [
  `${process.env.PUBLIC_URL}/assets/images/platform/earth-1.png`,
  `${process.env.PUBLIC_URL}/assets/images/platform/earth-2.png`,
  `${process.env.PUBLIC_URL}/assets/images/platform/earth-3.png`,
  `${process.env.PUBLIC_URL}/assets/images/platform/earth-4.png`,
  `${process.env.PUBLIC_URL}/assets/images/platform/earth-5.png`,
  `${process.env.PUBLIC_URL}/assets/images/platform/earth-6.png`,
  `${process.env.PUBLIC_URL}/assets/images/platform/earth-7.png`,
];

const OBSTACLE_IMAGES = [
  `${process.env.PUBLIC_URL}/assets/images/obstacle/obstacle-1.png`,
  `${process.env.PUBLIC_URL}/assets/images/obstacle/obstacle-2.png`,
  `${process.env.PUBLIC_URL}/assets/images/obstacle/obstacle-3.png`,
  `${process.env.PUBLIC_URL}/assets/images/obstacle/obstacle-4.png`,
  `${process.env.PUBLIC_URL}/assets/images/obstacle/obstacle-5.png`,
  `${process.env.PUBLIC_URL}/assets/images/obstacle/obstacle-6.png`,
  `${process.env.PUBLIC_URL}/assets/images/obstacle/obstacle-7.png`,
];

const DIFFICULTY_PROFILES = {
  gentle: {
    minGap: 84,
    maxGap: 122,
    patternScale: 0.82,
    moveTravelMin: 24,
    moveTravelMax: 52,
    moveSpeedMin: 32,
    moveSpeedMax: 58,
  },
  normal: {
    minGap: 98,
    maxGap: 146,
    patternScale: 1.04,
    moveTravelMin: 36,
    moveTravelMax: 72,
    moveSpeedMin: 48,
    moveSpeedMax: 88,
  },
  adventurous: {
    minGap: 120,
    maxGap: 178,
    patternScale: 1.34,
    moveTravelMin: 52,
    moveTravelMax: 104,
    moveSpeedMin: 72,
    moveSpeedMax: 132,
  },
};

const companionTheme = {
  'guide-lights': { background: '#fbbf24', border: '#fff7d6' },
  'gentle-breeze': { background: '#7dd3ae', border: '#f4fffb' },
  'leaf-bloom': { background: '#c4b5fd', border: '#fff7dd' },
  'joy-chime': { background: '#fdba74', border: '#fff4e2' },
  'firefly-magnet': { background: '#93c5fd', border: '#f2f8ff' },
};

const DECORATION_VISIBLE_TYPES = new Set(['orb', 'sun', 'sparkle-cluster']);

const BASE_OBSTACLE_SIZE = 112;
const OBSTACLE_SPAWN_DELAY_MIN_MS = 3400;
const OBSTACLE_SPAWN_DELAY_MAX_MS = 6200;
const OBSTACLE_SPEED_MIN = 150;
const OBSTACLE_SPEED_MAX = 225;
const OBSTACLE_SCREEN_Y_MIN_RATIO = 0.18;
const OBSTACLE_SCREEN_Y_MAX_RATIO = 0.62;
const BASE_OBSTACLE_BOB_MIN = 12;
const BASE_OBSTACLE_BOB_MAX = 28;
const BASE_OBSTACLE_COLLISION_PUSH = 74;
const OBSTACLE_COLLISION_COOLDOWN_MS = 1200;
const CREATURE_REACTION_DURATION_MS = 900;
const CREATURE_REACTION_HOP_HEIGHT = 18;
const MAX_OBSTACLE_BADGES = 6;
const POINTER_DEAD_ZONE_MIN = 28;
const POINTER_DEAD_ZONE_MAX = 72;
const POINTER_DEAD_ZONE_RATIO = 0.05;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const getPointerDeadZone = (viewportWidth) =>
  clamp(viewportWidth * POINTER_DEAD_ZONE_RATIO, POINTER_DEAD_ZONE_MIN, POINTER_DEAD_ZONE_MAX);

const getLayoutViewport = () => {
  const visualViewport = window.visualViewport;

  return {
    width: Math.round(visualViewport?.width ?? window.innerWidth),
    height: Math.round(visualViewport?.height ?? window.innerHeight),
  };
};

const getGameplayMetrics = (viewport) => {
  const layoutScale = clamp(viewport.width / 480, 0.68, 1);
  const physicsScale = clamp(layoutScale + 0.08, 0.78, 1);
  const smallPhone = viewport.width <= 420;

  return {
    compactHud: viewport.width <= 760,
    layoutScale,
    uiScale: clamp(viewport.width / 390, 0.84, 1),
    platformMarginRatio: smallPhone ? 0.12 : viewport.width <= 640 ? 0.16 : BASE_PLATFORM_MARGIN_RATIO,
    platformWidth: Math.round(BASE_PLATFORM_WIDTH * layoutScale),
    platformHeight: Math.round(BASE_PLATFORM_HEIGHT * clamp(layoutScale, 0.78, 1)),
    goalPlatformWidth: Math.round(BASE_GOAL_PLATFORM_WIDTH * clamp(layoutScale, 0.72, 1)),
    goalPlatformY: Math.round(BASE_GOAL_PLATFORM_Y * clamp(layoutScale + 0.12, 0.82, 1)),
    startPlatformYOffset: Math.round(
      BASE_START_PLATFORM_Y_OFFSET * clamp(layoutScale + 0.08, 0.82, 1)
    ),
    characterWidth: Math.round(BASE_CHARACTER_WIDTH * clamp(layoutScale, 0.72, 1)),
    characterHeight: Math.round(BASE_CHARACTER_HEIGHT * clamp(layoutScale, 0.72, 1)),
    moveSpeed: Math.round(BASE_MOVE_SPEED * physicsScale),
    gravity: Math.round(BASE_GRAVITY * physicsScale),
    jumpVelocity: Math.round(BASE_JUMP_VELOCITY * physicsScale),
    gapScale: clamp(layoutScale + 0.08, 0.78, 1),
    patternScale: clamp(layoutScale + 0.02, 0.72, 1),
    rescueLeafWidth: Math.round(BASE_RESCUE_LEAF_WIDTH * clamp(layoutScale, 0.72, 1)),
    rescueLeafHeight: Math.round(
      BASE_RESCUE_LEAF_HEIGHT * clamp(layoutScale + 0.12, 0.84, 1)
    ),
    floatDescentSpeed: Math.round(
      BASE_FLOAT_DESCENT_SPEED * clamp(layoutScale + 0.1, 0.82, 1)
    ),
    obstacleSize: Math.round(BASE_OBSTACLE_SIZE * clamp(layoutScale + 0.04, 0.72, 1)),
    obstacleBobMin: BASE_OBSTACLE_BOB_MIN * clamp(layoutScale, 0.72, 1),
    obstacleBobMax: BASE_OBSTACLE_BOB_MAX * clamp(layoutScale, 0.72, 1),
    obstaclePush: Math.round(
      BASE_OBSTACLE_COLLISION_PUSH * clamp(layoutScale + 0.08, 0.82, 1)
    ),
    creatureWidth: Math.round(BASE_CREATURE_WIDTH * clamp(layoutScale, 0.72, 1)),
    creatureHeight: Math.round(BASE_CREATURE_HEIGHT * clamp(layoutScale, 0.72, 1)),
    creatureInteractionRadius: Math.round(
      BASE_CREATURE_INTERACTION_RADIUS * clamp(layoutScale + 0.12, 0.84, 1)
    ),
    questItemSize: Math.round(
      BASE_QUEST_ITEM_SIZE * clamp(layoutScale + 0.1, 0.82, 1)
    ),
    worldPlatformHeight: Math.round(
      BASE_WORLD_PLATFORM_HEIGHT * clamp(layoutScale + 0.08, 0.82, 1)
    ),
    worldGateWidth: Math.round(BASE_WORLD_GATE_WIDTH * clamp(layoutScale, 0.76, 1)),
    worldGateHeight: Math.round(BASE_WORLD_GATE_HEIGHT * clamp(layoutScale, 0.76, 1)),
    worldLandmarkSize: Math.round(BASE_WORLD_LANDMARK_SIZE * clamp(layoutScale, 0.78, 1)),
    worldInteractionRadius: Math.round(
      BASE_WORLD_INTERACTION_RADIUS * clamp(layoutScale + 0.08, 0.82, 1)
    ),
  };
};

const getPlayerSize = (player) => ({
  width: player.width,
  height: player.height,
});

const resolveMovementInput = (player, viewportWidth, keyboardInput, pointerInput) => {
  const left = Boolean(keyboardInput.left);
  const right = Boolean(keyboardInput.right);

  if (left || right) {
    return { left, right };
  }

  if (!pointerInput.active || typeof pointerInput.x !== 'number') {
    return { left: false, right: false };
  }

  const playerCenterX = player.x + player.width / 2;
  const deltaX = pointerInput.x - playerCenterX;
  const deadZone = getPointerDeadZone(viewportWidth);

  return {
    left: deltaX < -deadZone,
    right: deltaX > deadZone,
  };
};

const uniqueById = (items) => {
  const seen = new Set();

  return items.filter((item) => {
    if (!item || seen.has(item.id)) {
      return false;
    }

    seen.add(item.id);
    return true;
  });
};

const isCreatureVisibleOnScreen = (creature, cameraY, viewportHeight) => {
  const creatureScreenY = creature.y - cameraY;
  return creatureScreenY + creature.height >= -80 && creatureScreenY <= viewportHeight + 80;
};

const isPlayerNearTarget = (player, target, playerSize, interactionRadius) => {
  const playerCenterX = player.x + playerSize.width / 2;
  const playerCenterY = player.y + playerSize.height / 2;
  const nearestX = clamp(playerCenterX, target.x, target.x + target.width);
  const nearestY = clamp(playerCenterY, target.y, target.y + target.height);

  return (
    Math.hypot(playerCenterX - nearestX, playerCenterY - nearestY) <= interactionRadius
  );
};

const isScreenPointOnTarget = (screenPoint, target, cameraY, padding = {}) => {
  const hitPaddingX = padding.x ?? 20;
  const hitPaddingTop = padding.top ?? 20;
  const hitPaddingBottom = padding.bottom ?? 20;
  const screenY = target.y - cameraY;

  return (
    screenPoint.x >= target.x - hitPaddingX &&
    screenPoint.x <= target.x + target.width + hitPaddingX &&
    screenPoint.y >= screenY - hitPaddingTop &&
    screenPoint.y <= screenY + target.height + hitPaddingBottom
  );
};

const isScreenPointOnCreaturePrompt = (screenPoint, gameState) => {
  const creatureScreenY =
    gameState.creature.y -
    gameState.cameraY -
    getCreatureReactionHopOffset(gameState.creature, gameState.timeMs);
  const hitPaddingX = 28;
  const hitPaddingTop = 112;
  const hitPaddingBottom = 26;

  return (
    screenPoint.x >= gameState.creature.x - hitPaddingX &&
    screenPoint.x <= gameState.creature.x + gameState.creature.width + hitPaddingX &&
    screenPoint.y >= creatureScreenY - hitPaddingTop &&
    screenPoint.y <= creatureScreenY + gameState.creature.height + hitPaddingBottom
  );
};

const canPlayerHelpCreature = (gameState) =>
  !gameState.quest.started &&
  isPlayerNearCreature(gameState.player, gameState.creature, getPlayerSize(gameState.player));

const createWorldScene = (biome, viewport, levelHeight, metrics) => {
  const sideMargin = clamp(viewport.width * 0.06, 20, 52);
  const platformWidth = Math.round(viewport.width - sideMargin * 2);
  const bottomInset = clamp(viewport.height * 0.015, 0, 12);
  const platformY = levelHeight - metrics.worldPlatformHeight - bottomInset;
  const layout = biome.landing?.layout ?? {};
  const gateWidth = metrics.worldGateWidth;
  const gateHeight = metrics.worldGateHeight;
  const landmarkSize = metrics.worldLandmarkSize;
  const villageWidth = Math.round(
    landmarkSize * clamp(biome.landing?.village?.widthScale ?? 0.88, 0.6, 1.2)
  );
  const villageHeight = Math.round(
    landmarkSize * clamp(biome.landing?.village?.heightScale ?? 0.82, 0.56, 1.2)
  );
  const resolveRatio = (value, fallback) => (typeof value === 'number' ? value : fallback);
  const centerToX = (centerRatio, width) =>
    Math.round(
      clamp(
        sideMargin + platformWidth * centerRatio - width / 2,
        sideMargin + 12,
        sideMargin + platformWidth - width - 12
      )
    );
  const creatureX = centerToX(resolveRatio(layout.creatureX, 0.22), metrics.creatureWidth);
  const villageX = centerToX(resolveRatio(layout.villageX, 0.42), villageWidth);
  const landmarkX = centerToX(resolveRatio(layout.landmarkX, 0.62), landmarkSize);
  const gateX = centerToX(resolveRatio(layout.gateX, 0.84), gateWidth);
  const playerStartX = centerToX(resolveRatio(layout.playerX, 0.42), metrics.characterWidth);

  return {
    platform: {
      id: `${biome.id}-landing-platform`,
      x: Math.round(sideMargin),
      y: platformY,
      width: platformWidth,
      height: metrics.worldPlatformHeight,
      name: biome.landing?.platformName ?? `${biome.shortName} Landing`,
    },
    gate: {
      id: `${biome.id}-landing-gate`,
      x: gateX,
      y: Math.round(platformY - gateHeight + 20),
      width: gateWidth,
      height: gateHeight,
      name: biome.landing?.gateName ?? biome.goalLabel,
      interactionRadius: metrics.worldInteractionRadius,
    },
    landmark: {
      id: `${biome.id}-landing-landmark`,
      x: landmarkX,
      y: Math.round(platformY - landmarkSize + 16),
      width: landmarkSize,
      height: landmarkSize,
      name: biome.landing?.landmarkName ?? biome.shortName,
      interactionRadius: metrics.worldInteractionRadius,
      dialogLines:
        biome.landing?.landmarkDialog ??
        [biome.shortName, 'soft little wonders rest here', 'the sky path wakes ahead'],
    },
    village: biome.landing?.village
      ? {
          id: `${biome.id}-landing-village`,
          x: villageX,
          y: Math.round(platformY - villageHeight + 18),
          width: villageWidth,
          height: villageHeight,
          name: biome.landing.village.name,
          type: biome.landing.village.type,
          interactionRadius: metrics.worldInteractionRadius,
          dialogLines: biome.landing.village.dialogLines,
          reward: biome.landing.village.reward
            ? {
                ...biome.landing.village.reward,
                activationLines: [...biome.landing.village.reward.activationLines],
                revisitLines: [...biome.landing.village.reward.revisitLines],
              }
            : null,
          visited: false,
          rewardGranted: false,
          visitCount: 0,
          rewardActivatedAt: null,
        }
      : null,
    creatureHome: {
      x: creatureX,
      y: Math.round(platformY - metrics.creatureHeight - 10),
    },
    playerStartX,
  };
};

const shouldRenderPlatform = (platform, gameState) => {
  if (gameState.sceneMode !== 'landing' || !gameState.worldScene || platform.isGoal) {
    return true;
  }

  return platform.y < gameState.worldScene.platform.y - Math.max(52, gameState.metrics.platformHeight);
};

const getDifficultyProfile = (difficulty = 'normal') =>
  DIFFICULTY_PROFILES[difficulty] || DIFFICULTY_PROFILES.normal;

const getLevelHeight = (viewport) =>
  Math.max(
    Math.round(viewport.width * BACKGROUND_ASPECT_RATIO),
    Math.round(viewport.height * LEVEL_MIN_HEIGHT_RATIO)
  );

const getHorizontalBounds = (viewportWidth, metrics, platformWidth = metrics.platformWidth) => {
  const margin = viewportWidth * metrics.platformMarginRatio;
  return {
    minX: margin,
    maxX: Math.max(margin, viewportWidth - margin - platformWidth),
  };
};

const pickPatternedPlatformX = (index, viewportWidth, difficultyProfile, metrics) => {
  const bounds = getHorizontalBounds(viewportWidth, metrics);
  const centerX = viewportWidth / 2 - metrics.platformWidth / 2;
  const offset =
    PLATFORM_X_PATTERN[index % PLATFORM_X_PATTERN.length] *
    difficultyProfile.patternScale *
    metrics.patternScale;
  return clamp(centerX + offset, bounds.minX, bounds.maxX);
};

const pickPlatformImage = (index) => PLATFORM_IMAGES[index % PLATFORM_IMAGES.length];
const pickObstacleImage = (biomeId) =>
  getObstacleSpriteAsset({ biomeId }) ??
  OBSTACLE_IMAGES[Math.floor(Math.random() * OBSTACLE_IMAGES.length)];

const buildPlatformMotion = (
  baseX,
  viewportWidth,
  difficultyProfile,
  metrics,
  platformWidth = metrics.platformWidth
) => {
  const bounds = getHorizontalBounds(viewportWidth, metrics, platformWidth);
  const maxAmplitude = Math.max(0, Math.min(baseX - bounds.minX, bounds.maxX - baseX));
  const requestedAmplitude =
    difficultyProfile.moveTravelMin * metrics.patternScale +
    Math.random() *
      ((difficultyProfile.moveTravelMax - difficultyProfile.moveTravelMin) * metrics.patternScale);
  const moveAmplitude = Math.min(maxAmplitude, requestedAmplitude);

  if (moveAmplitude < 12) {
    return {
      x: baseX,
      baseX,
      moving: false,
      moveAmplitude: 0,
      moveSpeed: 0,
      moveFrequency: 0,
      movePhase: 0,
      moveMinX: bounds.minX,
      moveMaxX: bounds.maxX,
    };
  }

  const moveSpeed =
    difficultyProfile.moveSpeedMin +
    Math.random() * (difficultyProfile.moveSpeedMax - difficultyProfile.moveSpeedMin);
  const moveFrequency = moveSpeed / moveAmplitude / 1000;
  const movePhase = Math.random() * Math.PI * 2;

  return {
    x: clamp(baseX + Math.sin(movePhase) * moveAmplitude, bounds.minX, bounds.maxX),
    baseX,
    moving: true,
    moveAmplitude,
    moveSpeed,
    moveFrequency,
    movePhase,
    moveMinX: bounds.minX,
    moveMaxX: bounds.maxX,
  };
};

const syncPlatformPositions = (platforms, timeMs) => {
  platforms.forEach((platform) => {
    if (platform.frozenUntil && platform.frozenUntil > timeMs) {
      platform.x = platform.frozenX ?? platform.x;
      return;
    }

    if (platform.frozenUntil && platform.frozenUntil <= timeMs) {
      platform.frozenUntil = null;
      platform.frozenX = null;
    }

    if (!platform.moving || platform.moveAmplitude <= 0 || platform.moveFrequency <= 0) {
      platform.x = platform.baseX ?? platform.x;
      return;
    }

    platform.x = clamp(
      platform.baseX + Math.sin(timeMs * platform.moveFrequency + platform.movePhase) * platform.moveAmplitude,
      platform.moveMinX,
      platform.moveMaxX
    );
  });
};

const syncAnchoredEntities = (gameState) => {
  const platformLookup = new Map(gameState.platforms.map((platform) => [platform.id, platform]));
  const creaturePlatform = platformLookup.get(gameState.creature.platformId);

  if (creaturePlatform && (gameState.sceneMode === 'climb' || gameState.creature.sceneAnchor === 'sky')) {
    gameState.creature.x =
      creaturePlatform.x + creaturePlatform.width / 2 - gameState.creature.width / 2;
    gameState.creature.y = creaturePlatform.y - gameState.creature.height;
  }

  gameState.quest.items.forEach((item) => {
    const itemPlatform = platformLookup.get(item.platformId);

    if (!itemPlatform) {
      return;
    }

    item.x = itemPlatform.x + itemPlatform.width / 2 - item.width / 2;
    item.y = itemPlatform.y - item.height - Math.round(item.height * 0.4);
  });
};

const isCreatureReacting = (creature, timeMs) => creature.reactionUntil > timeMs;

const getCreatureReactionHopOffset = (creature, timeMs) => {
  if (!isCreatureReacting(creature, timeMs)) {
    return 0;
  }

  const progress = clamp(
    (timeMs - creature.reactionStartedAt) / CREATURE_REACTION_DURATION_MS,
    0,
    1
  );

  return Math.sin(progress * Math.PI) * CREATURE_REACTION_HOP_HEIGHT;
};

const triggerCreatureReaction = (gameState) => {
  gameState.creature.lastInteractionAt = gameState.timeMs;
  gameState.creature.reactionStartedAt = gameState.timeMs;
  gameState.creature.reactionUntil = gameState.timeMs + CREATURE_REACTION_DURATION_MS;
};

const addClearedObstacleBadge = (gameState, obstacle) => {
  gameState.clearedObstacleBadges = [
    {
      id: `cleared-${obstacle.id}`,
      image: obstacle.image,
      clearedAt: gameState.timeMs,
    },
    ...gameState.clearedObstacleBadges,
  ].slice(0, MAX_OBSTACLE_BADGES);
};

const scheduleNextObstacleSpawn = (timeMs) =>
  timeMs +
  OBSTACLE_SPAWN_DELAY_MIN_MS +
  Math.random() * (OBSTACLE_SPAWN_DELAY_MAX_MS - OBSTACLE_SPAWN_DELAY_MIN_MS);

const createLevelPlatforms = (viewport, levelHeight, difficultyProfile, metrics) => {
  const centerX = viewport.width / 2 - metrics.platformWidth / 2;
  const platforms = [];
  let currentY = levelHeight - metrics.startPlatformYOffset;
  let platformIndex = 0;
  const startX = centerX;

  platforms.push({
    id: `platform-${platformIndex}`,
    x: startX,
    baseX: startX,
    y: currentY,
    width: metrics.platformWidth,
    height: metrics.platformHeight,
    image: pickPlatformImage(platformIndex),
    isGoal: false,
    moving: false,
    moveAmplitude: 0,
    moveSpeed: 0,
    moveFrequency: 0,
    movePhase: 0,
    moveMinX: startX,
    moveMaxX: startX,
  });
  platformIndex += 1;

  while (currentY > metrics.goalPlatformY + difficultyProfile.maxGap * metrics.gapScale * 1.35) {
    const nextGap =
      (difficultyProfile.minGap +
        Math.random() * (difficultyProfile.maxGap - difficultyProfile.minGap)) *
      metrics.gapScale;
    currentY -= nextGap;
    const baseX = pickPatternedPlatformX(platformIndex, viewport.width, difficultyProfile, metrics);
    const motion = buildPlatformMotion(baseX, viewport.width, difficultyProfile, metrics);

    platforms.push({
      id: `platform-${platformIndex}`,
      ...motion,
      y: currentY,
      width: metrics.platformWidth,
      height: metrics.platformHeight,
      image: pickPlatformImage(platformIndex),
      isGoal: false,
    });
    platformIndex += 1;
  }

  const goalX = viewport.width / 2 - metrics.goalPlatformWidth / 2;
  platforms.push({
    id: 'goal-platform',
    x: goalX,
    baseX: goalX,
    y: metrics.goalPlatformY,
    width: metrics.goalPlatformWidth,
    height: metrics.platformHeight,
    image: pickPlatformImage(platformIndex),
    isGoal: true,
    moving: false,
    moveAmplitude: 0,
    moveSpeed: 0,
    moveFrequency: 0,
    movePhase: 0,
    moveMinX: goalX,
    moveMaxX: goalX,
  });

  return platforms.sort((left, right) => left.y - right.y);
};

const cloneDialog = (dialog) => (dialog ? { ...dialog } : null);
const cloneVillageReward = (reward) =>
  reward
    ? {
        ...reward,
        activationLines: [...reward.activationLines],
        revisitLines: [...reward.revisitLines],
      }
    : null;
const cloneWorldVillage = (village) =>
  village
    ? {
        ...village,
        reward: cloneVillageReward(village.reward),
      }
    : null;
const getVillageVisitScore = (gameState) =>
  gameState.worldScene?.village?.rewardGranted
    ? gameState.worldScene.village.reward?.points ?? 0
    : 0;
const getVillagePromptText = (village) =>
  village?.rewardGranted
    ? village.reward?.activePrompt ?? 'Glow is awake'
    : village?.reward?.prompt ?? 'Tap to visit';
const getVillageBlessing = (gameState) => {
  const reward = gameState.worldScene?.village?.reward;
  if (!gameState.worldScene?.village?.rewardGranted || !reward) {
    return null;
  }

  return {
    type: reward.mechanicType ?? reward.reactionType,
    label: reward.mechanicLabel ?? reward.label,
    hint: reward.mechanicHint ?? '',
  };
};
const getFrozenPlatformCount = (gameState) =>
  gameState.platforms.filter((platform) => platform.frozenUntil > gameState.timeMs).length;
const setBlessingBurst = (gameState, type, platformId = null, durationMs = 480) => {
  gameState.blessingBurst = {
    type,
    platformId,
    until: gameState.timeMs + durationMs,
  };
};

const createSkyObstacle = (gameState, runtimeConfig) => {
  const fromLeft = Math.random() < 0.5;
  const speed = OBSTACLE_SPEED_MIN + Math.random() * (OBSTACLE_SPEED_MAX - OBSTACLE_SPEED_MIN);
  const baseY =
    gameState.cameraY +
    gameState.viewport.height *
      (OBSTACLE_SCREEN_Y_MIN_RATIO +
        Math.random() * (OBSTACLE_SCREEN_Y_MAX_RATIO - OBSTACLE_SCREEN_Y_MIN_RATIO));

  return {
    id: `sky-obstacle-${Math.round(gameState.timeMs)}-${Math.round(Math.random() * 100000)}`,
    image: pickObstacleImage(runtimeConfig.biome.id),
    x: fromLeft ? -gameState.metrics.obstacleSize - 36 : gameState.viewport.width + 36,
    y: baseY,
    baseY,
    width: gameState.metrics.obstacleSize,
    height: gameState.metrics.obstacleSize,
    vx: fromLeft ? speed : -speed,
    bobAmplitude:
      gameState.metrics.obstacleBobMin +
      Math.random() * (gameState.metrics.obstacleBobMax - gameState.metrics.obstacleBobMin),
    bobFrequency: 0.0022 + Math.random() * 0.0016,
    bobPhase: Math.random() * Math.PI * 2,
    facing: fromLeft ? 'right' : 'left',
  };
};

const isPlayerCollidingWithObstacle = (player, obstacle) =>
  player.x + player.width - 14 > obstacle.x &&
  player.x + 14 < obstacle.x + obstacle.width &&
  player.y + player.height - 14 > obstacle.y &&
  player.y + 14 < obstacle.y + obstacle.height;

const createSnapshot = (gameState) => ({
  viewport: { ...gameState.viewport },
  metrics: { ...gameState.metrics },
  levelHeight: gameState.levelHeight,
  maxCameraY: gameState.maxCameraY,
  cameraY: gameState.cameraY,
  sceneMode: gameState.sceneMode,
  difficulty: gameState.difficulty,
  biomeId: gameState.biomeId,
  biomeName: gameState.biomeName,
  palette: { ...gameState.palette },
  goalLabel: gameState.goalLabel,
  score: gameState.score,
  stageScore: gameState.stageScore,
  progress: gameState.progress,
  rescueCount: gameState.rescueCount,
  timeMs: gameState.timeMs,
  outcome: gameState.outcome,
  rewardUnlocked: gameState.rewardUnlocked,
  player: { ...gameState.player },
  creature: { ...gameState.creature },
  worldScene: gameState.worldScene
    ? {
        platform: { ...gameState.worldScene.platform },
        gate: { ...gameState.worldScene.gate },
        landmark: { ...gameState.worldScene.landmark },
        village: cloneWorldVillage(gameState.worldScene.village),
        creatureHome: { ...gameState.worldScene.creatureHome },
        playerStartX: gameState.worldScene.playerStartX,
      }
    : null,
  quest: {
    ...gameState.quest,
    items: gameState.quest.items.map((item) => ({ ...item })),
    guidePlatformIds: [...gameState.quest.guidePlatformIds],
  },
  clearedObstacleBadges: gameState.clearedObstacleBadges.map((badge) => ({ ...badge })),
  platforms: gameState.platforms.map((platform) => ({ ...platform })),
  obstacles: gameState.obstacles.map((obstacle) => ({ ...obstacle })),
  companions: gameState.companions.map((companion) => ({ ...companion })),
  rescueLeaf: gameState.rescueLeaf ? { ...gameState.rescueLeaf } : null,
  blessingBurst: gameState.blessingBurst ? { ...gameState.blessingBurst } : null,
  dialog: cloneDialog(gameState.dialog),
  scene: {
    far: gameState.scene.far.map((entry) => ({ ...entry })),
    mid: gameState.scene.mid.map((entry) => ({ ...entry })),
    fore: gameState.scene.fore.map((entry) => ({ ...entry })),
  },
});

const getAnimationForPlayer = (player) => {
  if (player.vy < -60) {
    return 'jump';
  }
  if (player.vy > 120) {
    return 'fall';
  }
  if (Math.abs(player.vx) > 1) {
    return 'run';
  }
  return 'idle';
};

const applyDialog = (gameState, dialog, force = false) => {
  if (!dialog) {
    return false;
  }

  if (!force && gameState.timeMs - gameState.lastDialogAt < DIALOG_GAP_MS) {
    return false;
  }

  gameState.dialog = {
    ...dialog,
    expiresAt: gameState.timeMs + dialog.durationMs,
  };
  gameState.lastDialogAt = gameState.timeMs;
  return true;
};

const refreshScore = (gameState, companionBonuses) => {
  const progressScore = Math.round(gameState.progress * 60);
  const collectibleScore =
    gameState.quest.collected * (12 + companionBonuses.collectibleBonus);
  const completionScore = gameState.rewardUnlocked ? 32 : 0;
  const rescueScore = gameState.rescueCount * 5;
  const villageScore = getVillageVisitScore(gameState);

  gameState.stageScore =
    progressScore + collectibleScore + completionScore + rescueScore + villageScore;
  gameState.score = gameState.scoreOffset + gameState.stageScore;
};

const buildRuntimeConfig = (biomeIndex, completedBiomeIds, scoreOffset, settings = {}) => {
  const biome = getBiomeConfig(biomeIndex);
  const nextBiome = getNextBiomeConfig(biomeIndex);
  const companions = buildUnlockedCompanions(completedBiomeIds);
  const companionBonuses = getCompanionBonuses(companions);
  const difficulty = settings?.difficulty ?? 'gentle';
  const difficultyProfile = getDifficultyProfile(difficulty);

  return {
    biomeIndex,
    biome,
    nextBiome,
    companions,
    companionBonuses,
    difficulty,
    difficultyProfile,
    scoreOffset,
  };
};

const buildInitialState = (runtimeConfig) => {
  const viewport = getLayoutViewport();
  const metrics = getGameplayMetrics(viewport);
  const levelHeight = getLevelHeight(viewport);
  const maxCameraY = levelHeight - viewport.height;
  const platforms = createLevelPlatforms(
    viewport,
    levelHeight,
    runtimeConfig.difficultyProfile,
    metrics
  );
  const scene = buildBiomeDecorations(runtimeConfig.biome, viewport, levelHeight);
  const startingPlatform = platforms[platforms.length - 1];
  const worldScene = createWorldScene(runtimeConfig.biome, viewport, levelHeight, metrics);
  const creature = createCreatureEncounter(runtimeConfig.biome, platforms, {
    width: metrics.creatureWidth,
    height: metrics.creatureHeight,
    interactionRadius: metrics.creatureInteractionRadius,
  });
  creature.skyPlatformId = creature.platformId;
  creature.skyX = creature.x;
  creature.skyY = creature.y;
  creature.sceneAnchor = 'world';
  creature.x = worldScene.creatureHome.x;
  creature.y = worldScene.creatureHome.y;
  const quest = createQuestState(runtimeConfig.biome, platforms, creature, metrics.questItemSize);

  return {
    viewport,
    metrics,
    levelHeight,
    maxCameraY,
    cameraY: maxCameraY,
    sceneMode: 'landing',
    difficulty: runtimeConfig.difficulty,
    biomeId: runtimeConfig.biome.id,
    biomeName: runtimeConfig.biome.name,
    goalLabel: runtimeConfig.biome.goalLabel,
    palette: runtimeConfig.biome.palette,
    progress: 0,
    scoreOffset: runtimeConfig.scoreOffset,
    score: runtimeConfig.scoreOffset,
    stageScore: 0,
    rescueCount: 0,
    rewardUnlocked: false,
    timeMs: 0,
    outcome: 'playing',
    player: {
      x: worldScene.playerStartX,
      y: worldScene.platform.y - metrics.characterHeight,
      width: metrics.characterWidth,
      height: metrics.characterHeight,
      vx: 0,
      vy: 0,
      facing: 'right',
      animation: 'idle',
    },
    platforms,
    obstacles: [],
    nextObstacleSpawnAt: 1800 + Math.random() * 1200,
    lastObstacleHitAt: -OBSTACLE_COLLISION_COOLDOWN_MS,
    creature,
    worldScene,
    climbStartPlatformId: startingPlatform.id,
    quest,
    clearedObstacleBadges: [],
    companions: [...runtimeConfig.companions],
    rescueLeaf: null,
    blessingBurst: null,
    dialog: null,
    lastDialogAt: -DIALOG_GAP_MS,
    scene,
  };
};

const buildLandingGateDialog = (biome) =>
  createDialog(
    null,
    [`Help ${biome.creature.name}`, 'then the sky gate wakes', 'kind steps open the path'],
    'hint',
    3200
  );

const buildLandingLandmarkDialog = (biome) =>
  createDialog(
    null,
    biome.landing?.landmarkDialog ?? [
      biome.shortName,
      'soft wonder waits here',
      'the sky path hums nearby',
    ],
    'hint',
    3600
  );

const buildLandingVillageDialog = (biome, village) =>
  createDialog(
    null,
    village?.rewardGranted
      ? village.reward?.revisitLines ??
          biome.landing?.village?.dialogLines ?? [
            biome.shortName,
            'small homes rest near the path',
            'kind voices drift nearby',
          ]
      : village?.dialogLines ??
          biome.landing?.village?.dialogLines ?? [
            biome.shortName,
            'small homes rest near the path',
            'kind voices drift nearby',
          ],
    village?.rewardGranted ? 'hint' : 'warm',
    village?.rewardGranted ? 3000 : 3400
  );

const buildLandingVillageRewardDialog = (biome, village) =>
  createDialog(
    null,
    village?.reward?.activationLines ??
      biome.landing?.village?.dialogLines ?? [
      biome.shortName,
      'small homes rest near the path',
      'kind voices drift nearby',
    ],
    'celebrate',
    3200
  );

const visitLandingVillage = (gameState, runtimeConfig, callbacks) => {
  const village = gameState.worldScene?.village;
  if (!village) {
    return false;
  }

  village.visitCount += 1;
  village.visited = true;
  const firstVisit = !village.rewardGranted;

  if (firstVisit) {
    village.rewardGranted = true;
    village.rewardActivatedAt = gameState.timeMs;
  }

  if (callbacks.onAudioEvent) {
    callbacks.onAudioEvent(firstVisit ? 'collect' : 'tap');
  }

  applyDialog(
    gameState,
    firstVisit
      ? buildLandingVillageRewardDialog(runtimeConfig.biome, village)
      : buildLandingVillageDialog(runtimeConfig.biome, village),
    true
  );

  return firstVisit;
};

const applyVillageBlessingToLanding = (gameState, platform, villageBlessing) => {
  if (!platform || !villageBlessing || platform.isGoal || platform.isRescueLeaf) {
    return;
  }

  if (villageBlessing.type === 'stone-steady' && platform.moving) {
    platform.frozenX = platform.x;
    platform.frozenUntil = gameState.timeMs + 2200;
    setBlessingBurst(gameState, villageBlessing.type, platform.id, 560);
    return;
  }

  if (villageBlessing.type === 'wind-lift') {
    gameState.player.vy = Math.round(gameState.metrics.jumpVelocity * 1.08);
    setBlessingBurst(gameState, villageBlessing.type, platform.id, 520);
    return;
  }

  if (villageBlessing.type === 'leaf-bloom') {
    setBlessingBurst(gameState, villageBlessing.type, platform.id, 560);
  }
};

const enterClimbScene = (gameState, callbacks) => {
  const startPlatform =
    gameState.platforms.find((platform) => platform.id === gameState.climbStartPlatformId) ??
    gameState.platforms[gameState.platforms.length - 1];

  gameState.sceneMode = 'climb';
  gameState.cameraY = gameState.maxCameraY;
  gameState.player.x = startPlatform.x + startPlatform.width / 2 - gameState.player.width / 2;
  gameState.player.y = startPlatform.y - gameState.player.height;
  gameState.player.vx = 0;
  gameState.player.vy = 0;
  gameState.player.animation = 'idle';
  gameState.creature.sceneAnchor = 'sky';
  syncAnchoredEntities(gameState);

  if (callbacks.onAudioEvent) {
    callbacks.onAudioEvent('jump');
  }
};

const updateLandingScene = (gameState, deltaMs, inputState, callbacks, runtimeConfig) => {
  const deltaSeconds = deltaMs / 1000;
  const { player, worldScene } = gameState;
  const playerSize = getPlayerSize(player);
  const canHelp = canPlayerHelpCreature(gameState);
  const nearVillage = Boolean(
    worldScene.village &&
      isPlayerNearTarget(
        player,
        worldScene.village,
        playerSize,
        worldScene.village.interactionRadius
      )
  );
  const nearLandmark = isPlayerNearTarget(
    player,
    worldScene.landmark,
    playerSize,
    worldScene.landmark.interactionRadius
  );
  const nearGate = isPlayerNearTarget(
    player,
    worldScene.gate,
    playerSize,
    worldScene.gate.interactionRadius
  );

  player.vx = 0;
  if (inputState.left && !inputState.right) {
    player.vx = -gameState.metrics.moveSpeed;
    player.facing = 'left';
  }
  if (inputState.right && !inputState.left) {
    player.vx = gameState.metrics.moveSpeed;
    player.facing = 'right';
  }

  player.x = clamp(
    player.x + player.vx * deltaSeconds,
    worldScene.platform.x + 12,
    worldScene.platform.x + worldScene.platform.width - player.width - 12
  );
  player.y = worldScene.platform.y - player.height;
  player.vy = 0;
  player.animation = Math.abs(player.vx) > 1 ? 'run' : 'idle';
  gameState.cameraY = gameState.maxCameraY;
  gameState.progress = 0;

  if (
    !gameState.quest.started &&
    (inputState.creatureTap || (inputState.interact && canHelp))
  ) {
    startCreatureQuest(gameState, runtimeConfig, callbacks, {
      playAudio: true,
      animateCreature: true,
    });
  } else if (
    gameState.quest.started &&
    !gameState.quest.completed &&
    (inputState.creatureTap || (inputState.interact && canHelp))
  ) {
    triggerCreatureReaction(gameState);
    applyDialog(gameState, buildReminderDialog(runtimeConfig.biome, gameState.quest), true);
  } else if (worldScene.village && (inputState.villageTap || (inputState.interact && nearVillage))) {
    visitLandingVillage(gameState, runtimeConfig, callbacks);
  } else if (inputState.landmarkTap || (inputState.interact && nearLandmark)) {
    if (callbacks.onAudioEvent) {
      callbacks.onAudioEvent('tap');
    }
    applyDialog(gameState, buildLandingLandmarkDialog(runtimeConfig.biome), true);
  } else if (inputState.worldGateTap || (inputState.interact && nearGate)) {
    if (!gameState.quest.started) {
      if (callbacks.onAudioEvent) {
        callbacks.onAudioEvent('goal-locked');
      }
      applyDialog(gameState, buildLandingGateDialog(runtimeConfig.biome), true);
    } else {
      enterClimbScene(gameState, callbacks);
    }
  }

  refreshScore(gameState, runtimeConfig.companionBonuses);
  return true;
};

const spawnRescueLeaf = (gameState, companionBonuses) => {
  const leafWidth = gameState.metrics.rescueLeafWidth * companionBonuses.rescueLeafScale;
  const leafX = clamp(
    gameState.player.x - (leafWidth - gameState.player.width) / 2,
    24,
    gameState.viewport.width - leafWidth - 24
  );
  const leafY = gameState.cameraY + gameState.viewport.height - 210;

  gameState.rescueLeaf = {
    id: 'rescue-leaf',
    x: leafX,
    y: leafY,
    width: leafWidth,
    height: gameState.metrics.rescueLeafHeight,
    isRescueLeaf: true,
    used: false,
    expiresAt: null,
  };
  gameState.player.y = leafY - gameState.player.height - 24;
  gameState.player.vy = gameState.metrics.floatDescentSpeed;
  gameState.player.animation = 'fall';
  applyDialog(gameState, buildRescueDialog(), true);
};

const startCreatureQuest = (
  gameState,
  runtimeConfig,
  callbacks,
  { playAudio = false, animateCreature = false } = {}
) => {
  if (gameState.quest.started) {
    return false;
  }

  gameState.quest.started = true;
  gameState.creature.met = true;
  gameState.creature.lastInteractionAt = gameState.timeMs;
  if (animateCreature) {
    triggerCreatureReaction(gameState);
  }

  if (playAudio && callbacks.onAudioEvent) {
    callbacks.onAudioEvent('tap');
  }

  applyDialog(gameState, buildIntroDialog(runtimeConfig.biome), true);
  return true;
};

const updateGameState = (
  gameState,
  deltaMs,
  inputState,
  callbacks,
  isPaused,
  runtimeConfig
) => {
  if (gameState.outcome !== 'playing' || isPaused) {
    return false;
  }

  gameState.timeMs += deltaMs;

  if (gameState.dialog && gameState.timeMs > gameState.dialog.expiresAt) {
    gameState.dialog = null;
  }

  if (gameState.blessingBurst && gameState.timeMs >= gameState.blessingBurst.until) {
    gameState.blessingBurst = null;
  }

  syncPlatformPositions(gameState.platforms, gameState.timeMs);
  syncAnchoredEntities(gameState);

  if (gameState.sceneMode === 'landing') {
    return updateLandingScene(gameState, deltaMs, inputState, callbacks, runtimeConfig);
  }

  if (gameState.timeMs >= gameState.nextObstacleSpawnAt && gameState.obstacles.length < 2) {
    gameState.obstacles.push(createSkyObstacle(gameState, runtimeConfig));
    gameState.nextObstacleSpawnAt = scheduleNextObstacleSpawn(gameState.timeMs);
  } else if (gameState.timeMs >= gameState.nextObstacleSpawnAt) {
    gameState.nextObstacleSpawnAt = scheduleNextObstacleSpawn(gameState.timeMs + 600);
  }

  if (
    gameState.rescueLeaf &&
    gameState.rescueLeaf.used &&
    gameState.rescueLeaf.expiresAt != null &&
    gameState.timeMs >= gameState.rescueLeaf.expiresAt
  ) {
    gameState.rescueLeaf = null;
  }

  const deltaSeconds = deltaMs / 1000;
  const { player, platforms, viewport } = gameState;
  const villageBlessing = getVillageBlessing(gameState);

  gameState.obstacles = gameState.obstacles
    .map((obstacle) => ({
      ...obstacle,
      x: obstacle.x + obstacle.vx * deltaSeconds,
      y:
        obstacle.baseY +
        Math.sin(gameState.timeMs * obstacle.bobFrequency + obstacle.bobPhase) *
          obstacle.bobAmplitude,
    }))
    .filter((obstacle) => {
      const screenY = obstacle.y - gameState.cameraY;
      return (
        obstacle.x + obstacle.width >= -140 &&
        obstacle.x <= viewport.width + 140 &&
        screenY + obstacle.height >= -180 &&
        screenY <= viewport.height + 180
      );
    });

  player.vx = 0;
  if (inputState.left && !inputState.right) {
    player.vx = -gameState.metrics.moveSpeed;
    player.facing = 'left';
  }
  if (inputState.right && !inputState.left) {
    player.vx = gameState.metrics.moveSpeed;
    player.facing = 'right';
  }

  const previousBottom = player.y + player.height;

  player.x = clamp(
    player.x + player.vx * deltaSeconds,
    0,
    viewport.width - player.width
  );
  const glideActive =
    villageBlessing?.type === 'wind-glide' &&
    player.vy >= 0 &&
    (inputState.left || inputState.right);
  const activeGravity = glideActive ? gameState.metrics.gravity * 0.62 : gameState.metrics.gravity;
  const activeMaxFallSpeed =
    villageBlessing?.type === 'wind-glide'
      ? Math.min(runtimeConfig.companionBonuses.maxFallSpeed, 640)
      : runtimeConfig.companionBonuses.maxFallSpeed;
  player.vy = Math.min(
    player.vy + activeGravity * deltaSeconds,
    activeMaxFallSpeed
  );
  player.y += player.vy * deltaSeconds;

  let landingPlatform = null;
  const platformCollisionPadding = villageBlessing?.type === 'leaf-bloom' ? 18 : 0;
  const collisionPlatforms = gameState.rescueLeaf
    ? gameState.rescueLeaf.used
      ? platforms
      : [...platforms, gameState.rescueLeaf]
    : platforms;

  if (player.vy > 0) {
    for (const platform of collisionPlatforms) {
      const currentBottom = player.y + player.height;
      const overlapsHorizontally =
        player.x + player.width - 18 > platform.x - platformCollisionPadding &&
        player.x + 18 < platform.x + platform.width + platformCollisionPadding;
      const crossedPlatformTop =
        previousBottom <= platform.y + platform.height / 2 &&
        currentBottom >= platform.y &&
        previousBottom <= platform.y + platform.height;

      if (overlapsHorizontally && crossedPlatformTop) {
        player.y = platform.y - player.height;
        player.vy = gameState.metrics.jumpVelocity;
        landingPlatform = platform;

        if (platform.isRescueLeaf) {
          gameState.rescueLeaf = {
            ...platform,
            used: true,
            expiresAt: gameState.timeMs + 700,
          };
          gameState.rescueCount += 1;
          if (callbacks.onAudioEvent) {
            callbacks.onAudioEvent('rescue-catch');
          }
        }
        break;
      }
    }
  }

  if (gameState.timeMs - gameState.lastObstacleHitAt >= OBSTACLE_COLLISION_COOLDOWN_MS) {
    const collidingObstacle = gameState.obstacles.find((obstacle) =>
      isPlayerCollidingWithObstacle(player, obstacle)
    );

    if (collidingObstacle) {
      const pushDirection = collidingObstacle.vx > 0 ? 1 : -1;
      player.x = clamp(
        player.x + pushDirection * gameState.metrics.obstaclePush,
        0,
        viewport.width - player.width
      );
      player.vy = Math.min(player.vy, -320);
      player.animation = 'jump';
      gameState.lastObstacleHitAt = gameState.timeMs;
      addClearedObstacleBadge(gameState, collidingObstacle);
      gameState.obstacles = gameState.obstacles.filter(
        (obstacle) => obstacle.id !== collidingObstacle.id
      );
      if (callbacks.onAudioEvent) {
        callbacks.onAudioEvent('obstacle-hit');
      }
    }
  }

  const playerScreenY = player.y - gameState.cameraY;
  const upwardCameraY = clamp(
    player.y - viewport.height * CAMERA_TOP_TARGET_RATIO,
    0,
    gameState.maxCameraY
  );
  const downwardCameraY = clamp(
    player.y - viewport.height * CAMERA_BOTTOM_TARGET_RATIO,
    0,
    gameState.maxCameraY
  );

  if (playerScreenY < viewport.height * CAMERA_TOP_TARGET_RATIO) {
    gameState.cameraY = upwardCameraY;
  } else if (playerScreenY > viewport.height * CAMERA_BOTTOM_TARGET_RATIO) {
    gameState.cameraY = downwardCameraY;
  }

  const rawProgress =
    gameState.maxCameraY <= 0
      ? 1
      : clamp((gameState.maxCameraY - gameState.cameraY) / gameState.maxCameraY, 0, 1);
  gameState.progress = Math.min(rawProgress, 0.99);

  const playerSize = getPlayerSize(player);
  const isNearCreature = isPlayerNearCreature(player, gameState.creature, playerSize);
  const canHelpCreature = !gameState.quest.started && isNearCreature;
  const hasPassedCreature =
    !gameState.quest.started && player.y + player.height < gameState.creature.y - 24;

  if (
    !gameState.quest.started &&
    ((inputState.creatureTap &&
      isCreatureVisibleOnScreen(gameState.creature, gameState.cameraY, viewport.height)) ||
      (inputState.interact && canHelpCreature))
  ) {
    startCreatureQuest(gameState, runtimeConfig, callbacks, {
      playAudio: true,
      animateCreature: true,
    });
  } else if (!gameState.quest.started && hasPassedCreature) {
    startCreatureQuest(gameState, runtimeConfig, callbacks);
  } else if (
    gameState.quest.started &&
    !gameState.quest.completed &&
    inputState.interact &&
    isNearCreature
  ) {
    triggerCreatureReaction(gameState);
    applyDialog(gameState, buildReminderDialog(runtimeConfig.biome, gameState.quest), true);
  } else if (
    gameState.quest.started &&
    !gameState.quest.completed &&
    isNearCreature &&
    gameState.timeMs - gameState.creature.lastInteractionAt > 1800
  ) {
    gameState.creature.lastInteractionAt = gameState.timeMs;
    applyDialog(gameState, buildReminderDialog(runtimeConfig.biome, gameState.quest));
  }

  if (gameState.quest.started && !gameState.quest.completed) {
    const collectionResult = collectNearbyQuestItems(
      gameState.quest,
      player,
      playerSize,
      runtimeConfig.companionBonuses.collectibleMagnetRadius
    );

    if (collectionResult.collectedNow > 0) {
      if (callbacks.onAudioEvent) {
        callbacks.onAudioEvent('collect');
      }
      applyDialog(
        gameState,
        buildCollectDialog(
          runtimeConfig.biome,
          gameState.quest,
          gameState.quest.collected,
          gameState.quest.total
        ),
        collectionResult.justCompleted
      );

      if (collectionResult.justCompleted && !gameState.rewardUnlocked) {
        gameState.rewardUnlocked = true;
        gameState.companions = uniqueById([
          ...gameState.companions,
          getCompanionForBiome(runtimeConfig.biome.id),
        ]);
        if (callbacks.onAudioEvent) {
          callbacks.onAudioEvent('quest-complete');
        }
        applyDialog(
          gameState,
          buildQuestCompleteDialog(runtimeConfig.biome, runtimeConfig.nextBiome),
          true
        );
      }
    }
  }

  player.animation = landingPlatform ? 'jump' : getAnimationForPlayer(player);
  if (landingPlatform && !landingPlatform.isGoal && !landingPlatform.isRescueLeaf) {
    applyVillageBlessingToLanding(gameState, landingPlatform, villageBlessing);
    if (callbacks.onAudioEvent) {
      callbacks.onAudioEvent('jump');
    }
  }

  if (landingPlatform && landingPlatform.isGoal) {
    if (gameState.quest.completed) {
      gameState.outcome = 'complete';
      gameState.progress = 1;
      refreshScore(gameState, runtimeConfig.companionBonuses);
      if (callbacks.onAudioEvent) {
        callbacks.onAudioEvent('biome-complete');
      }

      if (callbacks.onBiomeComplete) {
        callbacks.onBiomeComplete({
          biomeId: runtimeConfig.biome.id,
          biomeName: runtimeConfig.biome.name,
          biomeIndex: runtimeConfig.biomeIndex,
          stageHarmony: gameState.stageScore + 18,
          totalHarmony: gameState.score + 18,
          companion: getCompanionForBiome(runtimeConfig.biome.id),
          creatureName: runtimeConfig.biome.creature.name,
          nextBiome: runtimeConfig.nextBiome,
        });
      }
      return true;
    }

    if (callbacks.onAudioEvent) {
      callbacks.onAudioEvent('goal-locked');
    }
    applyDialog(gameState, buildGoalLockedDialog(runtimeConfig.biome, gameState.quest), true);
  }

  const updatedPlayerScreenY = player.y - gameState.cameraY;
  if (
    updatedPlayerScreenY > viewport.height + player.height * 0.15 &&
    !gameState.rescueLeaf
  ) {
    spawnRescueLeaf(gameState, runtimeConfig.companionBonuses);
    if (callbacks.onAudioEvent) {
      callbacks.onAudioEvent('rescue-spawn');
    }
  }

  refreshScore(gameState, runtimeConfig.companionBonuses);
  return true;
};

const getDialogStyle = (tone, palette) => {
  if (tone === 'celebrate') {
    return {
      background: palette.dialog,
      borderColor: palette.accent,
      color: palette.heading,
    };
  }

  if (tone === 'hint') {
    return {
      background: 'rgba(255, 255, 255, 0.86)',
      borderColor: palette.panelBorder,
      color: palette.heading,
    };
  }

  return {
    background: 'rgba(255, 250, 244, 0.92)',
    borderColor: palette.panelBorder,
    color: palette.heading,
  };
};

const getCompanionPalette = (companion) =>
  companionTheme[companion.effect] || {
    background: '#f5d0fe',
    border: '#fff7ff',
  };

const renderDecoration = (decoration) => {
  const containerStyle = {
    position: 'absolute',
    left: decoration.left,
    top: decoration.top,
    width: decoration.pixelWidth,
    height: decoration.pixelHeight,
    pointerEvents: 'none',
  };

  if (decoration.type === 'hill') {
    return (
      <div
        key={decoration.id}
        style={{
          ...containerStyle,
          borderRadius: '999px',
          background: `radial-gradient(circle at 50% 28%, rgba(255,255,255,0.22), transparent 58%), ${decoration.color}`,
          filter: 'blur(2px)',
        }}
      />
    );
  }

  if (decoration.type === 'orb' || decoration.type === 'sun') {
    return (
      <div
        key={decoration.id}
        style={{
          ...containerStyle,
          borderRadius: '999px',
          background: decoration.color,
          boxShadow: `0 0 28px ${decoration.color}`,
          filter: decoration.type === 'sun' ? 'blur(1px)' : 'blur(10px)',
        }}
      />
    );
  }

  if (decoration.type === 'mist-arc') {
    return (
      <div
        key={decoration.id}
        style={{
          ...containerStyle,
          borderRadius: '999px',
          background: `radial-gradient(circle at 30% 50%, rgba(255,255,255,0.34), transparent 42%), ${decoration.color}`,
          filter: 'blur(16px)',
          opacity: 0.78,
        }}
      />
    );
  }

  if (decoration.type === 'ring') {
    return (
      <div key={decoration.id} style={containerStyle}>
        {[
          { left: '4%', top: '42%', size: '22%' },
          { left: '16%', top: '14%', size: '20%' },
          { left: '38%', top: '4%', size: '18%' },
          { left: '62%', top: '8%', size: '18%' },
          { left: '76%', top: '28%', size: '20%' },
          { left: '70%', top: '58%', size: '18%' },
          { left: '44%', top: '66%', size: '18%' },
          { left: '18%', top: '62%', size: '18%' },
        ].map((stone, index) => (
          <div
            key={`${decoration.id}-stone-${index}`}
            style={{
              position: 'absolute',
              left: stone.left,
              top: stone.top,
              width: stone.size,
              height: stone.size,
              borderRadius: '999px',
              background: decoration.color,
              boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.24)',
            }}
          />
        ))}
      </div>
    );
  }

  if (decoration.type === 'grass') {
    return (
      <div key={decoration.id} style={containerStyle}>
        {[0.08, 0.24, 0.38, 0.54, 0.7, 0.84].map((offset, index) => (
          <div
            key={`${decoration.id}-${offset}`}
            style={{
              position: 'absolute',
              left: `${offset * 100}%`,
              bottom: 0,
              width: index % 2 === 0 ? '9%' : '7%',
              height: `${48 + index * 8}%`,
              borderRadius: '999px',
              background: decoration.color,
              transform: `rotate(${index % 2 === 0 ? -12 : 10}deg)`,
              transformOrigin: 'bottom center',
            }}
          />
        ))}
      </div>
    );
  }

  if (decoration.type === 'lantern') {
    return (
      <div key={decoration.id} style={containerStyle}>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            width: '14%',
            height: '20%',
            transform: 'translateX(-50%)',
            borderRadius: '999px',
            background: 'rgba(120, 77, 43, 0.64)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '18%',
            width: decoration.small ? '58%' : '72%',
            height: decoration.small ? '54%' : '64%',
            transform: 'translateX(-50%)',
            borderRadius: 999,
            background: decoration.color,
            boxShadow: `0 0 18px ${decoration.color}`,
          }}
        />
      </div>
    );
  }

  if (decoration.type === 'bamboo') {
    return (
      <div key={decoration.id} style={containerStyle}>
        {[0.12, 0.44, 0.7].map((offset) => (
          <div
            key={`${decoration.id}-${offset}`}
            style={{
              position: 'absolute',
              left: `${offset * 100}%`,
              bottom: 0,
              width: '16%',
              height: '100%',
              borderRadius: '999px',
              background: decoration.color,
            }}
          />
        ))}
      </div>
    );
  }

  if (decoration.type === 'bridge') {
    return (
      <div key={decoration.id} style={containerStyle}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderBottom: `6px solid ${decoration.color}`,
            borderRadius: '0 0 999px 999px',
          }}
        />
      </div>
    );
  }

  if (decoration.type === 'bird') {
    return (
      <div key={decoration.id} style={containerStyle}>
        <div
          style={{
            position: 'absolute',
            left: '16%',
            top: '50%',
            width: '34%',
            height: '14%',
            borderRadius: '999px',
            background: decoration.color,
            transform: 'rotate(-26deg)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '16%',
            top: '50%',
            width: '34%',
            height: '14%',
            borderRadius: '999px',
            background: decoration.color,
            transform: 'rotate(26deg)',
          }}
        />
      </div>
    );
  }

  if (decoration.type === 'sheep-cloud') {
    return (
      <div key={decoration.id} style={containerStyle}>
        {[0.06, 0.22, 0.42, 0.62].map((offset, index) => (
          <div
            key={`${decoration.id}-${offset}`}
            style={{
              position: 'absolute',
              left: `${offset * 100}%`,
              top: index === 1 || index === 2 ? '18%' : '28%',
              width: index === 1 || index === 2 ? '28%' : '24%',
              height: index === 1 || index === 2 ? '42%' : '34%',
              borderRadius: '999px',
              background: decoration.color,
            }}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            right: '12%',
            top: '42%',
            width: '14%',
            height: '18%',
            borderRadius: '999px',
            background: 'rgba(241, 245, 249, 0.82)',
          }}
        />
      </div>
    );
  }

  if (decoration.type === 'mushroom') {
    return (
      <div key={decoration.id} style={containerStyle}>
        <div
          style={{
            position: 'absolute',
            left: '36%',
            bottom: 0,
            width: '24%',
            height: '46%',
            borderRadius: '12px',
            background: 'rgba(250, 243, 226, 0.86)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '14%',
            top: decoration.small ? '24%' : '14%',
            width: '72%',
            height: '44%',
            borderRadius: '999px 999px 58% 58%',
            background: decoration.color,
          }}
        />
      </div>
    );
  }

  if (decoration.type === 'storybook-tree') {
    return (
      <div key={decoration.id} style={containerStyle}>
        <div
          style={{
            position: 'absolute',
            left: '40%',
            bottom: 0,
            width: '18%',
            height: '36%',
            borderRadius: '12px',
            background: 'rgba(120, 84, 47, 0.46)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '10%',
            top: 0,
            width: '80%',
            height: '62%',
            borderRadius: '18px',
            background: decoration.color,
          }}
        />
      </div>
    );
  }

  if (decoration.type === 'sparkle-cluster') {
    return (
      <div key={decoration.id} style={containerStyle}>
        {[0.18, 0.46, 0.72].map((offset, index) => (
          <div
            key={`${decoration.id}-${offset}`}
            style={{
              position: 'absolute',
              left: `${offset * 100}%`,
              top: `${index % 2 === 0 ? 20 : 48}%`,
              width: index === 1 ? '18%' : '12%',
              height: index === 1 ? '32%' : '24%',
              background: decoration.color,
              clipPath:
                'polygon(50% 0, 64% 36%, 100% 50%, 64% 64%, 50% 100%, 36% 64%, 0 50%, 36% 36%)',
            }}
          />
        ))}
      </div>
    );
  }

  if (decoration.type === 'arch') {
    return (
      <div key={decoration.id} style={containerStyle}>
        <div
          style={{
            position: 'absolute',
            inset: '12% 8% 0',
            borderTopLeftRadius: '999px',
            borderTopRightRadius: '999px',
            border: `6px solid ${decoration.color}`,
            borderBottom: 'none',
          }}
        />
      </div>
    );
  }

  if (decoration.type === 'fruit-cluster') {
    return (
      <div key={decoration.id} style={containerStyle}>
        {[0.2, 0.46, 0.68].map((offset, index) => (
          <div
            key={`${decoration.id}-${offset}`}
            style={{
              position: 'absolute',
              left: `${offset * 100}%`,
              top: `${index === 1 ? 28 : 44}%`,
              width: decoration.small ? '22%' : '28%',
              height: decoration.small ? '28%' : '34%',
              borderRadius: '999px',
              background: decoration.color,
            }}
          />
        ))}
      </div>
    );
  }

  if (decoration.type === 'flower-cluster') {
    return (
      <div key={decoration.id} style={containerStyle}>
        {[0.18, 0.48, 0.74].map((offset) => (
          <div
            key={`${decoration.id}-${offset}`}
            style={{
              position: 'absolute',
              left: `${offset * 100}%`,
              bottom: 0,
              width: decoration.small ? '18%' : '24%',
              height: decoration.small ? '58%' : '72%',
            }}
          >
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  left: index % 2 === 0 ? '0%' : '38%',
                  top: index < 2 ? '0%' : '28%',
                  width: '52%',
                  height: '38%',
                  borderRadius: '999px',
                  background: decoration.color,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (decoration.type === 'windmill') {
    return (
      <div key={decoration.id} style={containerStyle}>
        <div
          style={{
            position: 'absolute',
            left: '46%',
            bottom: 0,
            width: '8%',
            height: '72%',
            borderRadius: '999px',
            background: decoration.color,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '44%',
            top: '26%',
            width: '12%',
            height: '12%',
            borderRadius: '999px',
            background: decoration.color,
          }}
        />
        {[0, 45, 90, 135].map((rotation) => (
          <div
            key={rotation}
            style={{
              position: 'absolute',
              left: '26%',
              top: '30%',
              width: '48%',
              height: '6%',
              borderRadius: '999px',
              background: decoration.color,
              transform: `rotate(${rotation}deg)`,
              transformOrigin: 'center center',
            }}
          />
        ))}
      </div>
    );
  }

  return <div key={decoration.id} style={containerStyle} />;
};

const renderQuestItemSprite = (item, palette) => {
  const wrapperStyle = { position: 'absolute', inset: 0 };

  if (item.type === 'seed') {
    return (
      <div style={wrapperStyle}>
        <div
          style={{
            position: 'absolute',
            left: '30%',
            top: '38%',
            width: '24%',
            height: '24%',
            background: `linear-gradient(180deg, ${palette.questItemSoft}, ${palette.questItem})`,
            transform: 'rotate(45deg)',
            borderRadius: '18% 18% 42% 18%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '16%',
            top: '18%',
            width: '30%',
            height: '30%',
            borderRadius: '999px',
            background: `linear-gradient(180deg, #fff8ff, ${palette.questItem})`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '36%',
            top: '18%',
            width: '30%',
            height: '30%',
            borderRadius: '999px',
            background: `linear-gradient(180deg, #fff8ff, ${palette.questItem})`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '18%',
            top: '34%',
            width: '48%',
            height: '16%',
            borderRadius: '999px',
            background:
              'linear-gradient(90deg, #ff92c9 0%, #ffd86c 30%, #8ef2b8 58%, #6ed9ff 82%, #8b8dff 100%)',
            transform: 'rotate(-10deg)',
            boxShadow: `0 0 8px ${palette.questItemSoft}`,
          }}
        />
      </div>
    );
  }

  if (item.type === 'song') {
    return (
      <div style={wrapperStyle}>
        <div
          style={{
            position: 'absolute',
            inset: '14%',
            clipPath: 'polygon(50% 0%, 88% 26%, 76% 88%, 24% 88%, 12% 26%)',
            background:
              'linear-gradient(135deg, #ff9dcf 0%, #ffe06f 28%, #99f0ba 54%, #73ddff 78%, #9197ff 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '42%',
            top: '22%',
            width: '8%',
            height: '28%',
            borderRadius: '999px',
            background: '#fff8ff',
            boxShadow: `0 0 8px ${palette.questItemSoft}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '32%',
            top: '42%',
            width: '20%',
            height: '20%',
            borderRadius: '999px',
            background: '#fff6c9',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '13%',
            top: '24%',
            width: '12%',
            height: '12%',
            background: '#fffdfd',
            transform: 'rotate(45deg)',
            opacity: 0.9,
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '15%',
            top: '20%',
            width: '10%',
            height: '10%',
            background: '#fff7ff',
            transform: 'rotate(45deg)',
            opacity: 0.86,
          }}
        />
      </div>
    );
  }

  if (item.type === 'star') {
    return (
      <div style={wrapperStyle}>
        <div
          style={{
            position: 'absolute',
            inset: '8%',
            clipPath:
              'polygon(50% 0, 61% 34%, 98% 34%, 69% 56%, 79% 95%, 50% 73%, 21% 95%, 31% 56%, 2% 34%, 39% 34%)',
            background:
              'linear-gradient(135deg, #ffd6f4 0%, #ffe26f 34%, #a7f3b7 58%, #81e3ff 82%, #a3a6ff 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '40%',
            top: '20%',
            width: '12%',
            height: '12%',
            background: '#fffdfd',
            transform: 'rotate(45deg)',
            opacity: 0.88,
          }}
        />
      </div>
    );
  }

  if (item.type === 'sun-drop') {
    return (
      <div style={wrapperStyle}>
        <div
          style={{
            position: 'absolute',
            inset: '14%',
            borderRadius: '55% 55% 62% 62% / 48% 48% 72% 72%',
            background:
              'linear-gradient(180deg, #fff2bc 0%, #ffb86d 35%, #ff8ecf 62%, #76dcff 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '48%',
            top: '-2%',
            width: '18%',
            height: '26%',
            borderRadius: '999px',
            background: '#fff6d5',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '30%',
            top: '28%',
            width: '40%',
            height: '12%',
            borderRadius: '999px',
            background:
              'linear-gradient(90deg, #ff95c8 0%, #ffe06f 32%, #95f1b3 62%, #73ddff 84%, #8b8eff 100%)',
            transform: 'rotate(-8deg)',
          }}
        />
      </div>
    );
  }

  return (
    <div style={wrapperStyle}>
      <div
        style={{
          position: 'absolute',
          left: '31%',
          top: '34%',
          width: '22%',
          height: '22%',
          background: `linear-gradient(180deg, ${palette.questItemSoft}, ${palette.questItem})`,
          transform: 'rotate(45deg)',
          borderRadius: '18% 18% 42% 18%',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '18%',
          top: '20%',
          width: '26%',
          height: '22%',
          borderRadius: '999px',
          background: '#fffdfd',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: '18%',
          top: '20%',
          width: '26%',
          height: '22%',
          borderRadius: '999px',
          background: '#fffdfd',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '15%',
          top: '34%',
          width: '50%',
          height: '12%',
          borderRadius: '999px',
          background:
            'linear-gradient(90deg, #ff95ca 0%, #ffe06c 30%, #96f2b5 58%, #73ddff 82%, #9292ff 100%)',
          transform: 'rotate(-10deg)',
        }}
      />
    </div>
  );
};

const renderCreatureSprite = (creature, palette) => {
  const style = { position: 'absolute', inset: 0 };

  if (creature.type === 'fox') {
    return (
      <div style={style}>
        <div
          style={{
            position: 'absolute',
            left: '18%',
            top: '22%',
            width: '64%',
            height: '52%',
            borderRadius: '60% 60% 48% 48%',
            background: palette.creature,
          }}
        />
        {[16, 62].map((left) => (
          <div
            key={left}
            style={{
              position: 'absolute',
              left: `${left}%`,
              top: '2%',
              width: '18%',
              height: '24%',
              background: palette.creature,
              clipPath: 'polygon(50% 0, 0 100%, 100% 100%)',
            }}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            left: '28%',
            top: '32%',
            width: '44%',
            height: '22%',
            borderRadius: '999px',
            background: palette.creatureSecondary,
          }}
        />
      </div>
    );
  }

  if (creature.type === 'sheep') {
    return (
      <div style={style}>
        {[0.12, 0.34, 0.56].map((offset) => (
          <div
            key={offset}
            style={{
              position: 'absolute',
              left: `${offset * 100}%`,
              top: '18%',
              width: '28%',
              height: '38%',
              borderRadius: '999px',
              background: palette.creatureSecondary,
            }}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            left: '38%',
            top: '36%',
            width: '24%',
            height: '24%',
            borderRadius: '999px',
            background: palette.creature,
          }}
        />
      </div>
    );
  }

  if (creature.type === 'gnome') {
    return (
      <div style={style}>
        <div
          style={{
            position: 'absolute',
            left: '26%',
            top: '4%',
            width: '48%',
            height: '34%',
            background: palette.accentSoft,
            clipPath: 'polygon(50% 0, 0 100%, 100% 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '30%',
            top: '26%',
            width: '40%',
            height: '28%',
            borderRadius: '999px',
            background: palette.creature,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '32%',
            top: '42%',
            width: '36%',
            height: '26%',
            borderRadius: '40% 40% 60% 60%',
            background: palette.creatureSecondary,
          }}
        />
      </div>
    );
  }

  if (creature.type === 'bird') {
    return (
      <div style={style}>
        <div
          style={{
            position: 'absolute',
            left: '24%',
            top: '26%',
            width: '52%',
            height: '38%',
            borderRadius: '999px',
            background: palette.creature,
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '12%',
            top: '38%',
            width: '18%',
            height: '14%',
            background: palette.questItemSoft,
            clipPath: 'polygon(0 50%, 100% 0, 100% 100%)',
          }}
        />
      </div>
    );
  }

  return (
    <div style={style}>
      <div
        style={{
          position: 'absolute',
          left: '18%',
          top: '28%',
          width: '64%',
          height: '36%',
          borderRadius: '999px 999px 48% 48%',
          background: palette.creature,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '10%',
          top: '42%',
          width: '18%',
          height: '18%',
          borderRadius: '999px',
          background: palette.creatureSecondary,
        }}
      />
    </div>
  );
};

const renderWorldLandmarkSprite = (biomeId, palette) => {
  if (biomeId === 'lantern-bamboo-valley') {
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <div
          style={{
            position: 'absolute',
            left: '45%',
            top: '10%',
            width: '10%',
            height: '52%',
            borderRadius: 999,
            background: '#7a5b3f',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '24%',
            top: '28%',
            width: '52%',
            height: '30%',
            borderRadius: 18,
            background: palette.questItemSoft,
            boxShadow: `0 0 18px ${palette.questItem}`,
          }}
        />
      </div>
    );
  }

  if (biomeId === 'highland-meadow') {
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        {[10, 34, 58].map((left) => (
          <div
            key={left}
            style={{
              position: 'absolute',
              left: `${left}%`,
              bottom: '10%',
              width: '18%',
              height: '62%',
              borderRadius: 999,
              background: 'rgba(184, 197, 191, 0.92)',
              boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.24)',
            }}
          />
        ))}
      </div>
    );
  }

  if (biomeId === 'storybook-forest') {
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <div
          style={{
            position: 'absolute',
            left: '44%',
            bottom: '8%',
            width: '12%',
            height: '54%',
            borderRadius: 999,
            background: '#8f6a48',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '18%',
            top: '10%',
            width: '64%',
            height: '48%',
            borderRadius: '50% 50% 42% 42%',
            background: 'rgba(135, 182, 118, 0.92)',
          }}
        />
      </div>
    );
  }

  if (biomeId === 'sun-orchard') {
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <div
          style={{
            position: 'absolute',
            left: '18%',
            top: '22%',
            width: '64%',
            height: '54%',
            borderStyle: 'solid',
            borderWidth: '7px 7px 4px',
            borderColor: 'rgba(178, 109, 60, 0.92) rgba(178, 109, 60, 0.92) transparent',
            borderRadius: '999px 999px 24px 24px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '28%',
            top: '18%',
            width: '16%',
            height: '16%',
            borderRadius: 999,
            background: palette.questItem,
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '28%',
            top: '26%',
            width: '16%',
            height: '16%',
            borderRadius: 999,
            background: palette.accent,
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div
        style={{
          position: 'absolute',
          left: '47%',
          top: '12%',
          width: '6%',
          height: '64%',
          borderRadius: 999,
          background: 'rgba(229, 236, 249, 0.96)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '22%',
          top: '32%',
          width: '56%',
          height: '8%',
          borderRadius: 999,
          background: 'rgba(229, 236, 249, 0.96)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '18%',
          width: '5%',
          height: '28%',
          background: 'rgba(229, 236, 249, 0.96)',
          transformOrigin: 'center bottom',
          transform: 'translateX(-50%) rotate(32deg)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '18%',
          width: '5%',
          height: '28%',
          background: 'rgba(229, 236, 249, 0.96)',
          transformOrigin: 'center bottom',
          transform: 'translateX(-50%) rotate(-32deg)',
        }}
      />
    </div>
  );
};

const renderLandingVillageSprite = (village, palette) => {
  if (!village) {
    return null;
  }

  const rewardGlowStyle = village.rewardGranted
    ? {
        position: 'absolute',
        left: '12%',
        right: '12%',
        top: '12%',
        bottom: '10%',
        borderRadius: '50%',
        background: palette.accentSoft,
        opacity: 0.42,
        filter: 'blur(16px)',
      }
    : null;

  if (village.type === 'tea-table') {
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        {rewardGlowStyle && <div style={rewardGlowStyle} />}
        <div
          style={{
            position: 'absolute',
            left: '12%',
            right: '12%',
            bottom: '18%',
            height: '18%',
            borderRadius: 999,
            background: 'rgba(117, 82, 55, 0.86)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '44%',
            bottom: '34%',
            width: '14%',
            height: '18%',
            borderRadius: 999,
            background: palette.questItemSoft,
            border: '2px solid rgba(117, 82, 55, 0.72)',
          }}
        />
      </div>
    );
  }

  if (village.type === 'wool-cart') {
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        {rewardGlowStyle && <div style={rewardGlowStyle} />}
        <div
          style={{
            position: 'absolute',
            left: '16%',
            right: '16%',
            bottom: '22%',
            height: '24%',
            borderRadius: 18,
            background: 'rgba(140, 99, 67, 0.84)',
          }}
        />
        {[22, 72].map((left) => (
          <div
            key={left}
            style={{
              position: 'absolute',
              left: `${left}%`,
              bottom: '8%',
              width: '14%',
              height: '14%',
              borderRadius: 999,
              border: '3px solid rgba(93, 62, 43, 0.9)',
            }}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            left: '36%',
            top: '18%',
            width: '28%',
            height: '28%',
            borderRadius: '999px',
            background: 'rgba(251, 252, 249, 0.92)',
          }}
        />
      </div>
    );
  }

  if (village.type === 'mushroom-house') {
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        {rewardGlowStyle && <div style={rewardGlowStyle} />}
        <div
          style={{
            position: 'absolute',
            left: '34%',
            bottom: '8%',
            width: '32%',
            height: '44%',
            borderRadius: '16px 16px 10px 10px',
            background: 'rgba(248, 239, 222, 0.94)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '12%',
            top: '10%',
            width: '76%',
            height: '38%',
            borderRadius: '999px 999px 58% 58%',
            background: 'rgba(232, 140, 107, 0.9)',
          }}
        />
      </div>
    );
  }

  if (village.type === 'mirror-stand') {
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        {rewardGlowStyle && <div style={rewardGlowStyle} />}
        <div
          style={{
            position: 'absolute',
            left: '46%',
            bottom: '10%',
            width: '8%',
            height: '54%',
            borderRadius: 999,
            background: 'rgba(146, 88, 44, 0.86)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '26%',
            top: '12%',
            width: '48%',
            height: '34%',
            borderRadius: '999px',
            background: 'rgba(255, 247, 237, 0.92)',
            border: `4px solid ${palette.questItem}`,
            boxShadow: `0 0 16px ${palette.accentSoft}`,
          }}
        />
      </div>
    );
  }

  if (village.type === 'windmill-post') {
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        {rewardGlowStyle && <div style={rewardGlowStyle} />}
        <div
          style={{
            position: 'absolute',
            left: '44%',
            bottom: '8%',
            width: '12%',
            height: '58%',
            borderRadius: 999,
            background: 'rgba(230, 237, 248, 0.92)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '22%',
            top: '26%',
            width: '56%',
            height: '6%',
            borderRadius: 999,
            background: 'rgba(230, 237, 248, 0.92)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '47%',
            top: '12%',
            width: '6%',
            height: '28%',
            background: 'rgba(230, 237, 248, 0.92)',
            transformOrigin: 'center bottom',
            transform: 'translateX(-50%) rotate(34deg)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '47%',
            top: '12%',
            width: '6%',
            height: '28%',
            background: 'rgba(230, 237, 248, 0.92)',
            transformOrigin: 'center bottom',
            transform: 'translateX(-50%) rotate(-34deg)',
          }}
        />
      </div>
    );
  }

  return null;
};

const renderLandingVillageReaction = (worldScene, palette, timeMs, cameraY) => {
  const village = worldScene?.village;
  if (!village?.rewardGranted || !village.reward) {
    return null;
  }

  const villageCenterX = village.x + village.width / 2;
  const gateCenterX = worldScene.gate.x + worldScene.gate.width / 2;
  const platformTop = worldScene.platform.y - cameraY;
  const pulse = 0.76 + ((Math.sin(timeMs / 280) + 1) / 2) * 0.24;

  if (village.reward.reactionType === 'lantern-lights') {
    const startX = villageCenterX + village.width * 0.12;
    const startY = village.y + village.height * 0.18 - cameraY;
    const endX = gateCenterX - worldScene.gate.width * 0.12;
    const endY = worldScene.gate.y + worldScene.gate.height * 0.18 - cameraY;
    const dx = endX - startX;
    const dy = endY - startY;
    const ropeWidth = Math.hypot(dx, dy);
    const ropeAngle = (Math.atan2(dy, dx) * 180) / Math.PI;

    return (
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 12 }}>
        <div
          style={{
            position: 'absolute',
            left: startX,
            top: startY,
            width: ropeWidth,
            height: 2,
            background: 'rgba(131, 95, 67, 0.88)',
            transformOrigin: '0 50%',
            transform: `rotate(${ropeAngle}deg)`,
            opacity: 0.86,
          }}
        />
        {Array.from({ length: 5 }).map((_, index) => {
          const ratio = (index + 1) / 6;
          const x = startX + dx * ratio - 6;
          const y =
            startY + dy * ratio + 12 + Math.sin(timeMs / 320 + index * 0.7) * 4;

          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                width: 12,
                height: 16,
                borderRadius: '8px 8px 10px 10px',
                background: palette.questItem,
                boxShadow: `0 0 18px ${palette.accentSoft}`,
                opacity: pulse,
              }}
            />
          );
        })}
      </div>
    );
  }

  if (village.reward.reactionType === 'hill-breeze') {
    return (
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 12 }}>
        {[
          { left: villageCenterX - 18, top: platformTop - 58, width: 118, rotate: -10 },
          { left: villageCenterX + 34, top: platformTop - 86, width: 134, rotate: -4 },
          { left: gateCenterX - 124, top: platformTop - 46, width: 122, rotate: 6 },
        ].map((streak, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: streak.left + Math.sin(timeMs / 420 + index) * 10,
              top: streak.top + Math.cos(timeMs / 520 + index) * 5,
              width: streak.width,
              height: 16 + (index % 2) * 4,
              borderRadius: 999,
              background:
                'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.68), rgba(255,255,255,0))',
              boxShadow: `0 0 14px ${palette.accentSoft}`,
              opacity: 0.7 + index * 0.08,
              transform: `rotate(${streak.rotate}deg)`,
            }}
          />
        ))}
        {[0.18, 0.48, 0.78].map((ratio, index) => (
          <div
            key={ratio}
            style={{
              position: 'absolute',
              left: villageCenterX + (gateCenterX - villageCenterX) * ratio,
              top: platformTop - 74 + Math.sin(timeMs / 360 + index) * 10,
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.82)',
              boxShadow: `0 0 16px ${palette.accentSoft}`,
              opacity: pulse,
            }}
          />
        ))}
      </div>
    );
  }

  if (village.reward.reactionType === 'story-glow') {
    return (
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 12 }}>
        {[0.12, 0.28, 0.46, 0.66, 0.84].map((ratio, index) => {
          const x =
            villageCenterX +
            (gateCenterX - villageCenterX) * ratio +
            Math.sin(timeMs / 430 + index) * 10;
          const y =
            platformTop -
            58 -
            Math.sin(ratio * Math.PI) * 30 +
            Math.cos(timeMs / 390 + index) * 8;

          return (
            <React.Fragment key={ratio}>
              <div
                style={{
                  position: 'absolute',
                  left: x - 8,
                  top: y,
                  width: 16,
                  height: 12,
                  borderRadius: 3,
                  background: 'rgba(255, 248, 225, 0.94)',
                  border: '1px solid rgba(198, 162, 92, 0.68)',
                  boxShadow: `0 0 12px ${palette.accentSoft}`,
                  transform: `rotate(${index % 2 === 0 ? -16 : 14}deg)`,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: x + 8,
                  top: y - 8,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: palette.questItem,
                  boxShadow: `0 0 16px ${palette.questItem}`,
                  opacity: pulse,
                }}
              />
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  if (village.reward.reactionType === 'sun-path') {
    const startX = villageCenterX + village.width * 0.08;
    const startY = village.y + village.height * 0.26 - cameraY;
    const endX = gateCenterX - worldScene.gate.width * 0.08;
    const endY = worldScene.gate.y + worldScene.gate.height * 0.22 - cameraY;
    const dx = endX - startX;
    const dy = endY - startY;
    const beamWidth = Math.hypot(dx, dy);
    const beamAngle = (Math.atan2(dy, dx) * 180) / Math.PI;

    return (
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 12 }}>
        <div
          style={{
            position: 'absolute',
            left: startX,
            top: startY,
            width: beamWidth,
            height: 12,
            borderRadius: 999,
            background: `linear-gradient(90deg, rgba(255,255,255,0), ${palette.questItemSoft}, ${palette.questItem}, rgba(255,255,255,0))`,
            boxShadow: `0 0 16px ${palette.questItem}`,
            opacity: 0.72 + pulse * 0.18,
            transformOrigin: '0 50%',
            transform: `rotate(${beamAngle}deg)`,
          }}
        />
        {[0.24, 0.52, 0.8].map((ratio, index) => (
          <div
            key={ratio}
            style={{
              position: 'absolute',
              left: startX + dx * ratio - 5,
              top: startY + dy * ratio - 8 + Math.sin(timeMs / 310 + index) * 5,
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.92)',
              boxShadow: `0 0 16px ${palette.questItem}`,
            }}
          />
        ))}
      </div>
    );
  }

  if (village.reward.reactionType === 'prairie-spin') {
    const spinCenterX = gateCenterX;
    const spinCenterY = worldScene.gate.y + worldScene.gate.height * 0.28 - cameraY;
    const spinAngle = timeMs / 18;

    return (
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 12 }}>
        {[0, 90, 180, 270].map((angle) => (
          <div
            key={angle}
            style={{
              position: 'absolute',
              left: spinCenterX,
              top: spinCenterY - 3,
              width: 26,
              height: 6,
              borderRadius: 999,
              background: palette.questItemSoft,
              boxShadow: `0 0 12px ${palette.accentSoft}`,
              opacity: pulse,
              transformOrigin: '0 50%',
              transform: `rotate(${spinAngle + angle}deg)`,
            }}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            left: spinCenterX - 6,
            top: spinCenterY - 6,
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: palette.questItem,
            boxShadow: `0 0 16px ${palette.questItem}`,
          }}
        />
        {[0.16, 0.34, 0.58, 0.82].map((ratio, index) => (
          <div
            key={ratio}
            style={{
              position: 'absolute',
              left:
                villageCenterX + (gateCenterX - villageCenterX) * ratio + Math.sin(timeMs / 280 + index) * 10,
              top: platformTop - 48 + Math.cos(timeMs / 340 + index) * 8,
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: 'rgba(191, 219, 254, 0.9)',
              boxShadow: `0 0 16px ${palette.accentSoft}`,
              opacity: 0.78,
            }}
          />
        ))}
      </div>
    );
  }

  return null;
};

const getLandingGroundTheme = (biomeId) => {
  if (biomeId === 'lantern-bamboo-valley') {
    return {
      cliffLight: '#c89a69',
      cliffMid: '#845c43',
      cliffDark: '#4c3529',
      seam: 'rgba(255, 238, 205, 0.16)',
      vine: 'rgba(88, 154, 120, 0.82)',
      rimGlow: 'rgba(255, 224, 160, 0.34)',
    };
  }

  if (biomeId === 'highland-meadow') {
    return {
      cliffLight: '#d8c19f',
      cliffMid: '#8b7257',
      cliffDark: '#564535',
      seam: 'rgba(255, 248, 232, 0.14)',
      vine: 'rgba(116, 160, 126, 0.72)',
      rimGlow: 'rgba(214, 241, 226, 0.24)',
    };
  }

  if (biomeId === 'storybook-forest') {
    return {
      cliffLight: '#ceb28a',
      cliffMid: '#7d6248',
      cliffDark: '#4d3b30',
      seam: 'rgba(255, 243, 220, 0.15)',
      vine: 'rgba(126, 170, 113, 0.78)',
      rimGlow: 'rgba(252, 211, 77, 0.24)',
    };
  }

  if (biomeId === 'sun-orchard') {
    return {
      cliffLight: '#efc39a',
      cliffMid: '#9b6342',
      cliffDark: '#613726',
      seam: 'rgba(255, 239, 220, 0.16)',
      vine: 'rgba(138, 176, 95, 0.72)',
      rimGlow: 'rgba(255, 215, 142, 0.3)',
    };
  }

  return {
    cliffLight: '#d8c0aa',
    cliffMid: '#7c6756',
    cliffDark: '#4c4037',
    seam: 'rgba(255, 248, 240, 0.14)',
    vine: 'rgba(116, 167, 150, 0.72)',
    rimGlow: 'rgba(219, 234, 254, 0.24)',
  };
};

const Game = ({
  backgroundImage,
  biomeIndex = 0,
  completedBiomeIds = [],
  scoreOffset = 0,
  isPaused = false,
  onBiomeComplete,
  onPause,
  onResume,
  settings,
}) => {
  const gameAudio = useGameAudio(settings);
  const runtimeConfigRef = useRef(
    buildRuntimeConfig(biomeIndex, completedBiomeIds, scoreOffset, settings)
  );
  const [renderState, setRenderState] = useState(() =>
    createSnapshot(buildInitialState(runtimeConfigRef.current))
  );
  const gameStateRef = useRef(buildInitialState(runtimeConfigRef.current));
  const renderedStateRef = useRef(renderState);
  const animationFrameRef = useRef(null);
  const lastFrameTimeRef = useRef(null);
  const gameSurfaceRef = useRef(null);
  const keysPressedRef = useRef({ left: false, right: false });
  const pointerInputRef = useRef({ active: false, pointerId: null, x: null });
  const interactionRequestRef = useRef({
    interact: false,
    creatureTap: false,
    worldGateTap: false,
    landmarkTap: false,
    villageTap: false,
  });
  const resetGameRef = useRef(() => {});
  const stepSimulationRef = useRef(() => {});
  const callbacksRef = useRef({
    onBiomeComplete,
    onPause,
    onResume,
    onAudioEvent: gameAudio.play,
  });
  const pauseStateRef = useRef(isPaused);
  const deterministicModeRef = useRef(false);

  callbacksRef.current = {
    onBiomeComplete,
    onPause,
    onResume,
    onAudioEvent: gameAudio.play,
  };

  const syncRenderState = () => {
    setRenderState(createSnapshot(gameStateRef.current));
  };

  const clearKeyboardInput = () => {
    keysPressedRef.current.left = false;
    keysPressedRef.current.right = false;
  };

  const clearPointerInput = () => {
    pointerInputRef.current = { active: false, pointerId: null, x: null };
  };

  const clearInteractionRequest = () => {
    interactionRequestRef.current = {
      interact: false,
      creatureTap: false,
      worldGateTap: false,
      landmarkTap: false,
      villageTap: false,
    };
  };

  const queueInteractionRequest = (source = 'nearby') => {
    interactionRequestRef.current = {
      interact: true,
      creatureTap: source === 'creature-tap',
      worldGateTap: source === 'world-gate',
      landmarkTap: source === 'landmark',
      villageTap: source === 'village',
    };
  };

  const getLocalPointerPosition = (event) => {
    const bounds = gameSurfaceRef.current?.getBoundingClientRect();
    if (!bounds) {
      return null;
    }

    return {
      x: clamp(event.clientX - bounds.left, 0, bounds.width),
      y: clamp(event.clientY - bounds.top, 0, bounds.height),
    };
  };

  const updatePointerInput = (event) => {
    const localPoint = getLocalPointerPosition(event);
    if (!localPoint) {
      return;
    }

    pointerInputRef.current = {
      active: true,
      pointerId: event.pointerId,
      x: localPoint.x,
    };
  };

  const resetGame = (nextRuntimeConfig = runtimeConfigRef.current) => {
    runtimeConfigRef.current = nextRuntimeConfig;
    gameStateRef.current = buildInitialState(nextRuntimeConfig);
    lastFrameTimeRef.current = null;
    clearInteractionRequest();
    syncRenderState();
  };

  const stepSimulation = (deltaMs) => {
    const interactionRequest = interactionRequestRef.current;
    clearInteractionRequest();
    const didUpdate = updateGameState(
      gameStateRef.current,
      deltaMs,
      {
        ...resolveMovementInput(
          gameStateRef.current.player,
          gameStateRef.current.viewport.width,
          keysPressedRef.current,
          pointerInputRef.current
        ),
        interact: interactionRequest.interact,
        creatureTap: interactionRequest.creatureTap,
        worldGateTap: interactionRequest.worldGateTap,
        landmarkTap: interactionRequest.landmarkTap,
        villageTap: interactionRequest.villageTap,
      },
      callbacksRef.current,
      pauseStateRef.current,
      runtimeConfigRef.current
    );

    if (didUpdate) {
      syncRenderState();
    }
  };

  resetGameRef.current = resetGame;
  stepSimulationRef.current = stepSimulation;

  useEffect(() => {
    renderedStateRef.current = renderState;
  }, [renderState]);

  useEffect(() => {
    pauseStateRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    resetGameRef.current(buildRuntimeConfig(biomeIndex, completedBiomeIds, scoreOffset, settings));
  }, [biomeIndex, completedBiomeIds, scoreOffset, settings]);

  useEffect(() => {
    deterministicModeRef.current = window.navigator.webdriver === true;
    const visualViewport = window.visualViewport;

    const handleResize = () => {
      clearPointerInput();
      resetGameRef.current(runtimeConfigRef.current);
    };

    const clearInputs = () => {
      clearKeyboardInput();
      clearPointerInput();
      clearInteractionRequest();
    };

    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        keysPressedRef.current.left = true;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        keysPressedRef.current.right = true;
      }
      if (event.key === 'e' || event.key === 'E' || event.key === 'Enter') {
        event.preventDefault();
        queueInteractionRequest();
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        if (pauseStateRef.current) {
          if (callbacksRef.current.onAudioEvent) {
            callbacksRef.current.onAudioEvent('resume');
          }
          if (callbacksRef.current.onResume) {
            callbacksRef.current.onResume();
          }
        } else if (callbacksRef.current.onPause) {
          if (callbacksRef.current.onAudioEvent) {
            callbacksRef.current.onAudioEvent('pause');
          }
          callbacksRef.current.onPause();
        }
      }
    };

    const handleKeyUp = (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        keysPressedRef.current.left = false;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        keysPressedRef.current.right = false;
      }
    };

    const runFrame = (timestamp) => {
      if (lastFrameTimeRef.current == null) {
        lastFrameTimeRef.current = timestamp;
      }

      const deltaMs = Math.min(32, timestamp - lastFrameTimeRef.current || FIXED_STEP_MS);
      lastFrameTimeRef.current = timestamp;
      stepSimulationRef.current(deltaMs);
      animationFrameRef.current = window.requestAnimationFrame(runFrame);
    };

    window.addEventListener('resize', handleResize);
    if (visualViewport) {
      visualViewport.addEventListener('resize', handleResize);
    }
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', clearInputs);

    if (!deterministicModeRef.current) {
      animationFrameRef.current = window.requestAnimationFrame(runFrame);
    }

    return () => {
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
      if (visualViewport) {
        visualViewport.removeEventListener('resize', handleResize);
      }
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', clearInputs);
    };
  }, []);

  useEffect(() => {
    window.render_game_to_text = () => {
      const state = renderedStateRef.current;
      const companionBonuses = getCompanionBonuses(state.companions);
      const guideLightsVisible = companionBonuses.revealGuides;
      const villageBlessing = getVillageBlessing(state);
      const mirrorGuideActive = villageBlessing?.type === 'mirror-guide';
      const routeGuidesVisible = guideLightsVisible || mirrorGuideActive;
      const glideActive =
        villageBlessing?.type === 'wind-glide' &&
        state.player.vy > 0 &&
        Math.abs(state.player.vx) > 1;
      const villageHarmony = getVillageVisitScore(state);
      const collectibleHarmony =
        state.quest.collected * (12 + companionBonuses.collectibleBonus);

      return JSON.stringify({
        coordinateSystem: {
          origin: 'top-left',
          xDirection: 'right',
          yDirection: 'down',
        },
        difficulty: state.difficulty,
        biome: state.biomeName,
        mode: pauseStateRef.current
          ? 'paused'
          : state.outcome === 'complete'
            ? 'complete'
            : 'playing',
        sceneMode: state.sceneMode,
        harmony: state.score,
        stageHarmony: state.stageScore,
        scoreBreakdown: {
          progress: Math.round(state.progress * 60),
          collectibles: collectibleHarmony,
          questComplete: state.rewardUnlocked ? 32 : 0,
          rescues: state.rescueCount * 5,
          village: villageHarmony,
        },
        quest: {
          started: state.quest.started,
          completed: state.quest.completed,
          collected: state.quest.collected,
          total: state.quest.total,
          label: state.quest.itemPlural,
        },
        cameraY: Math.round(state.cameraY),
        player: {
          screenX: Math.round(state.player.x),
          screenY: Math.round(state.player.y - state.cameraY),
          worldY: Math.round(state.player.y),
          vx: Math.round(state.player.vx),
          vy: Math.round(state.player.vy),
          animation: state.player.animation,
          facing: state.player.facing,
        },
        creature: {
          name: state.creature.name,
          screenX: Math.round(state.creature.x),
          screenY: Math.round(state.creature.y - state.cameraY),
          met: state.creature.met,
          reacting: isCreatureReacting(state.creature, state.timeMs),
          hopOffset: Math.round(getCreatureReactionHopOffset(state.creature, state.timeMs)),
          canHelp: canPlayerHelpCreature(state),
          helpPrompt:
            !state.quest.started &&
            isCreatureVisibleOnScreen(state.creature, state.cameraY, state.viewport.height)
              ? canPlayerHelpCreature(state)
                ? 'Tap friend'
                : 'Move close'
              : null,
        },
        worldPlatform: state.worldScene
          ? {
              name: state.worldScene.platform.name,
              screenX: Math.round(state.worldScene.platform.x),
              screenY: Math.round(state.worldScene.platform.y - state.cameraY),
              width: Math.round(state.worldScene.platform.width),
            }
          : null,
        worldGate:
          state.sceneMode === 'landing' && state.worldScene
            ? {
                name: state.worldScene.gate.name,
                screenX: Math.round(state.worldScene.gate.x),
                screenY: Math.round(state.worldScene.gate.y - state.cameraY),
                canEnter:
                  state.quest.started &&
                  isPlayerNearTarget(
                    state.player,
                    state.worldScene.gate,
                    getPlayerSize(state.player),
                    state.worldScene.gate.interactionRadius
                  ),
                prompt: state.quest.started ? 'Tap gate' : 'Help friend first',
              }
            : null,
        village:
          state.sceneMode === 'landing' && state.worldScene?.village
            ? {
                name: state.worldScene.village.name,
                screenX: Math.round(state.worldScene.village.x),
                screenY: Math.round(state.worldScene.village.y - state.cameraY),
                visited: Boolean(state.worldScene.village.visited),
                rewardGranted: Boolean(state.worldScene.village.rewardGranted),
                rewardLabel: state.worldScene.village.reward?.label ?? null,
                rewardPoints: state.worldScene.village.reward?.points ?? 0,
                canInspect: isPlayerNearTarget(
                  state.player,
                  state.worldScene.village,
                  getPlayerSize(state.player),
                  state.worldScene.village.interactionRadius
                ),
                prompt: getVillagePromptText(state.worldScene.village),
              }
            : null,
        villageReaction:
          state.sceneMode === 'landing' && state.worldScene?.village?.reward
            ? {
                active: Boolean(state.worldScene.village.rewardGranted),
                label: state.worldScene.village.reward.label,
                points: state.worldScene.village.reward.points,
                type: state.worldScene.village.reward.reactionType,
              }
            : null,
        villageBlessing:
          villageBlessing && state.sceneMode === 'climb'
            ? {
                active: true,
                type: villageBlessing.type,
                label: villageBlessing.label,
                hint: villageBlessing.hint,
                glideActive,
                frozenPlatforms: getFrozenPlatformCount(state),
                routeGuidesVisible,
                platformBloom: villageBlessing.type === 'leaf-bloom',
                burst: state.blessingBurst
                  ? {
                      type: state.blessingBurst.type,
                      platformId: state.blessingBurst.platformId,
                    }
                  : null,
              }
            : null,
        landmark:
          state.sceneMode === 'landing' && state.worldScene
            ? {
                name: state.worldScene.landmark.name,
                screenX: Math.round(state.worldScene.landmark.x),
                screenY: Math.round(state.worldScene.landmark.y - state.cameraY),
                canInspect: isPlayerNearTarget(
                  state.player,
                  state.worldScene.landmark,
                  getPlayerSize(state.player),
                  state.worldScene.landmark.interactionRadius
                ),
                prompt: 'Tap to look',
              }
            : null,
        landingSet:
          state.sceneMode === 'landing' && state.worldScene
            ? [
                state.worldScene.village?.name,
                state.worldScene.landmark.name,
                state.worldScene.gate.name,
              ].filter(Boolean)
            : null,
        clearedObstacleBadges: state.clearedObstacleBadges.map((badge) => ({
          id: badge.id,
        })),
        companions: state.companions.map((companion) => ({
          name: companion.name,
          effect: companion.effect,
        })),
        visiblePlatforms: state.platforms
          .filter((platform) => {
            if (!shouldRenderPlatform(platform, state)) {
              return false;
            }
            const screenY = platform.y - state.cameraY;
            return screenY + platform.height >= -60 && screenY <= state.viewport.height + 60;
          })
          .sort((left, right) => left.y - right.y)
          .slice(0, 8)
          .map((platform) => ({
            id: platform.id,
            x: Math.round(platform.x),
            y: Math.round(platform.y - state.cameraY),
            width: platform.width,
            height: platform.height,
            isGoal: platform.isGoal,
            moving: platform.moving,
            frozen: platform.frozenUntil > state.timeMs,
            moveSpeed: Math.round(platform.moveSpeed || 0),
            travelWidth: Math.round((platform.moveAmplitude || 0) * 2),
            guide: routeGuidesVisible && state.quest.guidePlatformIds.includes(platform.id),
          })),
        visibleObstacles: state.obstacles
          .filter((obstacle) => {
            const screenY = obstacle.y - state.cameraY;
            return (
              obstacle.x + obstacle.width >= -60 &&
              obstacle.x <= state.viewport.width + 60 &&
              screenY + obstacle.height >= -60 &&
              screenY <= state.viewport.height + 60
            );
          })
          .slice(0, 4)
          .map((obstacle) => ({
            x: Math.round(obstacle.x),
            y: Math.round(obstacle.y - state.cameraY),
            vx: Math.round(obstacle.vx),
            facing: obstacle.facing,
          })),
        visibleCollectibles: state.quest.items
          .filter((item) => !item.collected)
          .map((item) => ({
            x: Math.round(item.x),
            y: Math.round(item.y - state.cameraY),
            type: item.type,
            guided: mirrorGuideActive,
          })),
        rescueLeaf: state.rescueLeaf
          ? {
              x: Math.round(state.rescueLeaf.x),
              y: Math.round(state.rescueLeaf.y - state.cameraY),
              width: Math.round(state.rescueLeaf.width),
            }
          : null,
        dialog: state.dialog
          ? {
              speaker: state.dialog.speaker,
              lines: state.dialog.lines,
            }
          : null,
      });
    };

    window.advanceTime = async (ms) => {
      const steps = Math.max(1, Math.ceil(ms / FIXED_STEP_MS));
      for (let index = 0; index < steps; index += 1) {
        stepSimulationRef.current(FIXED_STEP_MS);
      }
    };

    return () => {
      delete window.render_game_to_text;
      delete window.advanceTime;
    };
  }, []);

  const biome = getBiomeConfig(biomeIndex);
  const landingMode = renderState.sceneMode === 'landing';
  const worldScene = renderState.worldScene;
  const companionBonuses = getCompanionBonuses(renderState.companions);
  const guideLightsVisible = companionBonuses.revealGuides;
  const activeVillageBlessing = getVillageBlessing(renderState);
  const mirrorGuideActive = activeVillageBlessing?.type === 'mirror-guide';
  const routeGuidesVisible = guideLightsVisible || mirrorGuideActive;
  const glideActive =
    activeVillageBlessing?.type === 'wind-glide' &&
    renderState.player.vy > 0 &&
    Math.abs(renderState.player.vx) > 1;
  const leafBloomActive = activeVillageBlessing?.type === 'leaf-bloom';
  const dialogStyle = renderState.dialog
    ? getDialogStyle(renderState.dialog.tone, biome.palette)
    : null;
  const creatureReactionOffset = getCreatureReactionHopOffset(
    renderState.creature,
    renderState.timeMs
  );
  const creatureIsReacting = isCreatureReacting(renderState.creature, renderState.timeMs);
  const creatureScreenY = renderState.creature.y - renderState.cameraY;
  const creatureVisualTop = creatureScreenY - creatureReactionOffset;
  const creatureVisible = isCreatureVisibleOnScreen(
    renderState.creature,
    renderState.cameraY,
    renderState.viewport.height
  );
  const canHelpCreature = canPlayerHelpCreature(renderState);
  const canInspectLandmark =
    landingMode &&
    worldScene &&
    isPlayerNearTarget(
      renderState.player,
      worldScene.landmark,
      getPlayerSize(renderState.player),
      worldScene.landmark.interactionRadius
    );
  const canInspectVillage =
    landingMode &&
    worldScene?.village &&
    isPlayerNearTarget(
      renderState.player,
      worldScene.village,
      getPlayerSize(renderState.player),
      worldScene.village.interactionRadius
    );
  const canUseWorldGate =
    landingMode &&
    worldScene &&
    isPlayerNearTarget(
      renderState.player,
      worldScene.gate,
      getPlayerSize(renderState.player),
      worldScene.gate.interactionRadius
    );
  const villageRewardActive = Boolean(worldScene?.village?.rewardGranted);
  const showCreatureMarker = !renderState.quest.started && creatureVisible;
  const showCreaturePrompt = showCreatureMarker && canHelpCreature;
  const showWorldGatePrompt = Boolean(
    landingMode &&
      worldScene &&
      (canUseWorldGate || renderState.quest.started || !renderState.quest.started)
  );
  const showVillagePrompt = Boolean(landingMode && worldScene?.village && canInspectVillage);
  const showLandmarkPrompt = Boolean(landingMode && worldScene && canInspectLandmark);
  const creatureSpriteSrc = getCreatureSpriteAsset({
    biomeId: biome.id,
    creature: renderState.creature,
    player: renderState.player,
    quest: renderState.quest,
    dialog: renderState.dialog,
    timeMs: renderState.timeMs,
  });
  const rescueLeafSpriteSrc = getRescueLeafSpriteAsset({
    biomeId: biome.id,
    rescueLeaf: renderState.rescueLeaf,
    timeMs: renderState.timeMs,
  });
  const landingVillageSpriteSrc = getLandingVillageSpriteAsset({
    village: worldScene?.village,
  });
  const worldLandmarkSpriteSrc = getWorldLandmarkSpriteAsset({
    biomeId: biome.id,
  });
  const worldGateSpriteSrc = getWorldGateSpriteAsset({
    biomeId: biome.id,
  });
  const platformTrimSpriteSrc = getPlatformTrimAsset({
    biomeId: biome.id,
  });
  const landingGroundCapSpriteSrc = getLandingGroundCapAsset({
    biomeId: biome.id,
  });
  const landingGroundTheme = getLandingGroundTheme(biome.id);
  const landingGroundImage = pickPlatformImage(biomeIndex * 2 + 1);
  const landingGroundVisualHeight = worldScene
    ? worldScene.platform.height + (renderState.metrics.compactHud ? 26 : 34)
    : 0;
  const landingGroundCapHeight = renderState.metrics.compactHud ? 72 : 88;
  const landingGroundBodyTop = renderState.metrics.compactHud ? 30 : 38;
  const landingGroundTileCount = worldScene
    ? Math.max(
        4,
        Math.ceil(worldScene.platform.width / (renderState.metrics.compactHud ? 188 : 214))
      )
    : 0;
  const landingGroundTileWidth = worldScene
    ? Math.ceil(worldScene.platform.width / landingGroundTileCount) +
      (renderState.metrics.compactHud ? 18 : 24)
    : 0;
  const landingGroundVines = [
    { left: '13%', height: renderState.metrics.compactHud ? 28 : 36, rotate: -8, width: 4 },
    { left: '32%', height: renderState.metrics.compactHud ? 22 : 30, rotate: 5, width: 3 },
    { left: '57%', height: renderState.metrics.compactHud ? 32 : 42, rotate: -6, width: 4 },
    { left: '81%', height: renderState.metrics.compactHud ? 26 : 34, rotate: 7, width: 3 },
  ];
  const landingGroundChunks = [
    { left: '10%', width: '15%', height: renderState.metrics.compactHud ? 28 : 36 },
    { left: '38%', width: '18%', height: renderState.metrics.compactHud ? 34 : 42 },
    { left: '72%', width: '14%', height: renderState.metrics.compactHud ? 30 : 38 },
  ];
  const clearedObstacleBadges = renderState.clearedObstacleBadges || [];
  const compactHud = renderState.metrics.compactHud;
  const villagePromptDetail = worldScene?.village
    ? villageRewardActive
      ? getVillagePromptText(worldScene.village)
      : compactHud
        ? getVillagePromptText(worldScene.village)
        : 'Press E or tap'
    : null;
  const villageRewardChipText =
    villageRewardActive && worldScene?.village?.reward
      ? `${worldScene.village.reward.label} +${worldScene.village.reward.points}`
      : null;
  const villageBlessingHintText =
    villageRewardActive && activeVillageBlessing?.hint ? activeVillageBlessing.hint : null;
  const worldGateActive = renderState.quest.started || canUseWorldGate || villageRewardActive;
  const worldGateGlowColor = renderState.quest.started
    ? biome.palette.questItemSoft
    : biome.palette.accentSoft;
  const compactControlsVisible =
    compactHud &&
    !renderState.dialog &&
    (renderState.timeMs < 6000 || !renderState.quest.started || showCreaturePrompt);
  const compactQuestTitle = renderState.quest.completed
    ? `${biome.goalLabel} open`
    : landingMode
      ? renderState.quest.started
        ? worldScene?.gate.name ?? 'Sky gate'
        : `Meet ${renderState.creature.name}`
      : renderState.quest.started
      ? `${renderState.quest.collected}/${renderState.quest.total} found`
      : `Help ${renderState.creature.name}`;
  const compactQuestHint = renderState.quest.completed
    ? 'Jump to the top'
    : landingMode
      ? renderState.quest.started
        ? canUseWorldGate
          ? 'Tap gate to climb'
          : 'Go right to the gate'
        : showCreaturePrompt
          ? 'Tap friend now'
          : 'Walk to your friend'
      : showCreaturePrompt
        ? 'Tap friend now'
        : renderState.quest.started
          ? 'Keep jumping'
          : 'Move close to start';
  const compactControlText = landingMode
    ? renderState.quest.started
      ? 'Touch gate to climb'
      : showCreaturePrompt
        ? `Tap ${renderState.creature.name}`
        : 'Touch left or right'
    : showCreaturePrompt
      ? `Tap ${renderState.creature.name}`
      : !renderState.quest.started
        ? 'Touch left or right'
        : 'Touch to steer';
  const safeTop = compactHud ? 'max(10px, env(safe-area-inset-top))' : 'max(18px, env(safe-area-inset-top))';
  const safeLeft = compactHud ? 'max(10px, env(safe-area-inset-left))' : 'max(18px, env(safe-area-inset-left))';
  const safeRight = compactHud ? 'max(10px, env(safe-area-inset-right))' : 'max(18px, env(safe-area-inset-right))';
  const safeBottom = compactHud
    ? 'max(10px, env(safe-area-inset-bottom))'
    : 'max(18px, env(safe-area-inset-bottom))';
  const obstacleBadgeSize = compactHud ? 36 : 44;
  const overlayPanelStyle = {
    background: biome.palette.panel,
    border: `1px solid ${biome.palette.panelBorder}`,
    color: biome.palette.heading,
    backdropFilter: 'blur(10px)',
    boxShadow: '0 18px 42px rgba(15, 23, 42, 0.18)',
  };
  const compactChipStyle = {
    ...overlayPanelStyle,
    borderRadius: 18,
    padding: '8px 10px',
  };
  const haikuBlockStyle = {
    whiteSpace: 'pre-line',
    lineHeight: 1.24,
  };
  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return;
    }

    event.preventDefault();

    const localPoint = getLocalPointerPosition(event);
    if (
      localPoint &&
      !renderedStateRef.current.quest.started &&
      isScreenPointOnCreaturePrompt(localPoint, renderedStateRef.current)
    ) {
      clearPointerInput();
      queueInteractionRequest('creature-tap');
      return;
    }

    if (
      localPoint &&
      renderedStateRef.current.sceneMode === 'landing' &&
      renderedStateRef.current.worldScene
    ) {
      if (
        isScreenPointOnTarget(
          localPoint,
          renderedStateRef.current.worldScene.gate,
          renderedStateRef.current.cameraY,
          { x: 24, top: 28, bottom: 18 }
        )
      ) {
        clearPointerInput();
        queueInteractionRequest('world-gate');
        return;
      }

      if (
        renderedStateRef.current.worldScene.village &&
        isScreenPointOnTarget(
          localPoint,
          renderedStateRef.current.worldScene.village,
          renderedStateRef.current.cameraY,
          { x: 18, top: 20, bottom: 12 }
        )
      ) {
        clearPointerInput();
        queueInteractionRequest('village');
        return;
      }

      if (
        isScreenPointOnTarget(
          localPoint,
          renderedStateRef.current.worldScene.landmark,
          renderedStateRef.current.cameraY,
          { x: 20, top: 20, bottom: 12 }
        )
      ) {
        clearPointerInput();
        queueInteractionRequest('landmark');
        return;
      }
    }

    updatePointerInput(event);

    if (gameSurfaceRef.current?.setPointerCapture) {
      try {
        gameSurfaceRef.current.setPointerCapture(event.pointerId);
      } catch (error) {
        // Some browsers reject capture during synthetic runs; steering still works without it.
      }
    }
  };

  const handlePointerMove = (event) => {
    if (!pointerInputRef.current.active || pointerInputRef.current.pointerId !== event.pointerId) {
      return;
    }

    event.preventDefault();
    updatePointerInput(event);
  };

  const releasePointerControl = (event) => {
    if (
      !pointerInputRef.current.active ||
      pointerInputRef.current.pointerId !== event.pointerId
    ) {
      return;
    }

    clearPointerInput();

    if (gameSurfaceRef.current?.releasePointerCapture) {
      try {
        gameSurfaceRef.current.releasePointerCapture(event.pointerId);
      } catch (error) {
        // Capture may already be gone; no recovery needed.
      }
    }
  };

  return (
    <div
      ref={gameSurfaceRef}
      className="game-container"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={releasePointerControl}
      onPointerCancel={releasePointerControl}
      style={{
        width: '100%',
        height: '100dvh',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#d8efff',
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: -renderState.cameraY,
          width: '100%',
          height: renderState.levelHeight,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: biome.palette.skyTint,
        }}
      />

      {[
        { entries: renderState.scene.far, speed: 0.24, opacity: 0.75 },
        { entries: renderState.scene.mid, speed: 0.48, opacity: 0.9 },
        { entries: renderState.scene.fore, speed: 0.7, opacity: 1 },
      ].map((layer, index) => {
        const visibleEntries = layer.entries.filter((entry) =>
          DECORATION_VISIBLE_TYPES.has(entry.type)
        );

        if (visibleEntries.length === 0) {
          return null;
        }

        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: 0,
              top: -renderState.cameraY * layer.speed,
              width: '100%',
              height: renderState.levelHeight,
              opacity: layer.opacity,
            }}
          >
            {visibleEntries.map(renderDecoration)}
          </div>
        );
      })}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(15, 23, 42, 0.18) 100%)',
        }}
      />

      {landingMode && worldScene && (
        <>
          <div
            style={{
              position: 'absolute',
              left: worldScene.platform.x,
              top: worldScene.platform.y - renderState.cameraY,
              width: worldScene.platform.width,
              height: landingGroundVisualHeight,
              overflow: 'visible',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: landingGroundBodyTop,
                bottom: 0,
                borderRadius: compactHud ? '30px 30px 38px 38px' : '38px 38px 48px 48px',
                overflow: 'hidden',
                background: `linear-gradient(180deg, ${landingGroundTheme.cliffLight} 0%, ${landingGroundTheme.cliffMid} 42%, ${landingGroundTheme.cliffDark} 100%)`,
                boxShadow:
                  '0 22px 36px rgba(15, 23, 42, 0.2), inset 0 10px 18px rgba(255,255,255,0.08)',
                clipPath:
                  'polygon(0 0, 100% 0, 100% 82%, 93% 74%, 86% 100%, 71% 80%, 58% 95%, 44% 79%, 30% 100%, 14% 76%, 0 88%)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: '3%',
                  right: '3%',
                  top: 0,
                  height: compactHud ? 18 : 22,
                  background: `linear-gradient(180deg, ${landingGroundTheme.rimGlow}, rgba(255,255,255,0))`,
                }}
              />
              {[
                { left: '8%', top: '24%', width: '18%', rotate: -7 },
                { left: '31%', top: '34%', width: '14%', rotate: 9 },
                { left: '52%', top: '22%', width: '18%', rotate: -5 },
                { left: '74%', top: '38%', width: '13%', rotate: 11 },
              ].map((seam) => (
                <div
                  key={`${seam.left}-${seam.top}`}
                  style={{
                    position: 'absolute',
                    left: seam.left,
                    top: seam.top,
                    width: seam.width,
                    height: 8,
                    borderRadius: 999,
                    background: landingGroundTheme.seam,
                    transform: `rotate(${seam.rotate}deg)`,
                  }}
                />
              ))}
              {[
                { left: '18%', top: '48%', size: 10 },
                { left: '47%', top: '58%', size: 12 },
                { left: '82%', top: '46%', size: 9 },
              ].map((stone) => (
                <div
                  key={`${stone.left}-${stone.top}`}
                  style={{
                    position: 'absolute',
                    left: stone.left,
                    top: stone.top,
                    width: stone.size,
                    height: stone.size,
                    borderRadius: '42% 58% 52% 48%',
                    background: 'rgba(255,255,255,0.08)',
                  }}
                />
              ))}
            </div>

            <div
              style={{
                position: 'absolute',
                left: compactHud ? -10 : -14,
                right: compactHud ? -10 : -14,
                top: compactHud ? -12 : -16,
                height: landingGroundCapHeight,
                display: 'flex',
                alignItems: 'flex-start',
              }}
            >
              {Array.from({ length: landingGroundTileCount }).map((_, index) => (
                <div
                  key={index}
                  style={{
                    flex: `0 0 ${landingGroundTileWidth}px`,
                    height: landingGroundCapHeight,
                    marginLeft: index === 0 ? 0 : compactHud ? -22 : -28,
                    backgroundImage: landingGroundCapSpriteSrc
                      ? `url(${landingGroundCapSpriteSrc}), url(${landingGroundImage})`
                      : `url(${landingGroundImage})`,
                    backgroundSize: landingGroundCapSpriteSrc
                      ? '100% 100%, 100% 100%'
                      : '100% 100%',
                    backgroundRepeat: landingGroundCapSpriteSrc ? 'no-repeat, no-repeat' : 'no-repeat',
                    backgroundPosition: landingGroundCapSpriteSrc ? 'center, center' : 'center',
                    transform:
                      index % 2 === 1
                        ? 'translateY(4px) scaleX(-1)'
                        : index % 3 === 2
                          ? 'translateY(2px)'
                          : 'none',
                    filter: 'drop-shadow(0 10px 14px rgba(15, 23, 42, 0.12))',
                  }}
                />
              ))}
            </div>

            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: landingGroundBodyTop - 6,
                height: compactHud ? 18 : 22,
                background:
                  'linear-gradient(180deg, rgba(34, 23, 15, 0.22) 0%, rgba(34, 23, 15, 0) 100%)',
              }}
            />

            {landingGroundVines.map((vine) => (
              <div
                key={vine.left}
                style={{
                  position: 'absolute',
                  left: vine.left,
                  top: landingGroundCapHeight - (compactHud ? 10 : 12),
                  width: vine.width,
                  height: vine.height,
                  borderRadius: 999,
                  background: `linear-gradient(180deg, ${landingGroundTheme.vine}, rgba(255,255,255,0))`,
                  transform: `rotate(${vine.rotate}deg)`,
                  transformOrigin: 'top center',
                  opacity: 0.9,
                }}
              />
            ))}

            {landingGroundChunks.map((chunk) => (
              <div
                key={chunk.left}
                style={{
                  position: 'absolute',
                  left: chunk.left,
                  bottom: compactHud ? -4 : -6,
                  width: chunk.width,
                  height: chunk.height,
                  background: `linear-gradient(180deg, ${landingGroundTheme.cliffMid} 0%, ${landingGroundTheme.cliffDark} 100%)`,
                  clipPath: 'polygon(20% 0, 80% 0, 100% 22%, 72% 100%, 28% 100%, 0 22%)',
                  boxShadow: 'inset 0 8px 12px rgba(255,255,255,0.06)',
                  opacity: 0.96,
                }}
              />
            ))}

            <div
              style={{
                position: 'absolute',
                left: compactHud ? 12 : 18,
                top: compactHud ? 10 : 14,
                padding: compactHud ? '6px 9px' : '7px 11px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.74)',
                color: biome.palette.heading,
                fontSize: compactHud ? 11 : 12,
                fontWeight: 800,
                letterSpacing: 0.8,
                textTransform: 'uppercase',
                boxShadow: '0 8px 18px rgba(15, 23, 42, 0.12)',
              }}
            >
              {worldScene.platform.name}
            </div>

            {villageRewardChipText && (
              <div
                style={{
                  position: 'absolute',
                  left: compactHud ? 12 : 18,
                  top: compactHud ? 40 : 50,
                  padding: compactHud ? '5px 8px' : '6px 10px',
                  borderRadius: 999,
                  background: 'rgba(255, 248, 240, 0.82)',
                  color: biome.palette.heading,
                  fontSize: compactHud ? 10 : 11,
                  fontWeight: 700,
                  letterSpacing: 0.3,
                  boxShadow: '0 8px 16px rgba(15, 23, 42, 0.12)',
                }}
              >
                {villageRewardChipText}
              </div>
            )}

            {villageBlessingHintText && (
              <div
                style={{
                  position: 'absolute',
                  left: compactHud ? 12 : 18,
                  top: compactHud ? 64 : 78,
                  padding: compactHud ? '4px 8px' : '5px 10px',
                  borderRadius: 999,
                  background: 'rgba(255, 255, 255, 0.74)',
                  color: biome.palette.heading,
                  fontSize: compactHud ? 10 : 11,
                  fontWeight: 600,
                  boxShadow: '0 8px 16px rgba(15, 23, 42, 0.1)',
                }}
              >
                {villageBlessingHintText}
              </div>
            )}
          </div>

          {worldScene.village && (
            <div
              style={{
                position: 'absolute',
                left: worldScene.village.x,
                top: worldScene.village.y - renderState.cameraY,
                width: worldScene.village.width,
                height: worldScene.village.height,
                zIndex: 13,
                filter: 'drop-shadow(0 10px 18px rgba(15, 23, 42, 0.14))',
              }}
            >
              {landingVillageSpriteSrc ? (
                <>
                  {worldScene.village.rewardGranted && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '12%',
                        right: '12%',
                        top: '12%',
                        bottom: '10%',
                        borderRadius: '50%',
                        background: biome.palette.accentSoft,
                        opacity: 0.42,
                        filter: 'blur(16px)',
                      }}
                    />
                  )}
                  <img
                    src={landingVillageSpriteSrc}
                    alt=""
                    draggable={false}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      pointerEvents: 'none',
                    }}
                  />
                </>
              ) : (
                renderLandingVillageSprite(worldScene.village, biome.palette)
              )}
            </div>
          )}

          {renderLandingVillageReaction(
            worldScene,
            biome.palette,
            renderState.timeMs,
            renderState.cameraY
          )}

          <div
            style={{
              position: 'absolute',
              left: worldScene.landmark.x,
              top: worldScene.landmark.y - renderState.cameraY,
              width: worldScene.landmark.width,
              height: worldScene.landmark.height,
              zIndex: 14,
              filter: 'drop-shadow(0 10px 18px rgba(15, 23, 42, 0.16))',
            }}
          >
            {worldLandmarkSpriteSrc ? (
              <img
                src={worldLandmarkSpriteSrc}
                alt=""
                draggable={false}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  pointerEvents: 'none',
                }}
              />
            ) : (
              renderWorldLandmarkSprite(biome.id, biome.palette)
            )}
          </div>

          <div
            style={{
              position: 'absolute',
              left: worldScene.gate.x,
              top: worldScene.gate.y - renderState.cameraY,
              width: worldScene.gate.width,
              height: worldScene.gate.height,
              zIndex: 14,
              filter: worldGateActive
                ? `drop-shadow(0 0 18px ${worldGateGlowColor}) drop-shadow(0 12px 22px rgba(15, 23, 42, 0.18))`
                : 'drop-shadow(0 12px 22px rgba(15, 23, 42, 0.18))',
            }}
          >
            {worldGateActive && (
              <div
                style={{
                  position: 'absolute',
                  left: '18%',
                  right: '18%',
                  top: '18%',
                  bottom: '20%',
                  borderRadius: '50%',
                  background: worldGateGlowColor,
                  opacity: renderState.quest.started ? 0.48 : 0.3,
                  filter: 'blur(18px)',
                }}
              />
            )}
            {worldGateSpriteSrc ? (
              <img
                src={worldGateSpriteSrc}
                alt=""
                draggable={false}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  pointerEvents: 'none',
                }}
              />
            ) : (
              <>
                <div
                  style={{
                    position: 'absolute',
                    left: '8%',
                    right: '8%',
                    bottom: 0,
                    height: '12%',
                    borderRadius: 999,
                    background: 'rgba(112, 86, 63, 0.72)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: '16%',
                    right: '16%',
                    top: '12%',
                    bottom: '10%',
                    borderStyle: 'solid',
                    borderWidth: '8px 8px 5px',
                    borderColor: `${
                      renderState.quest.started
                        ? biome.palette.questItemSoft
                        : 'rgba(255,255,255,0.64)'
                    } ${
                      renderState.quest.started
                        ? biome.palette.questItemSoft
                        : 'rgba(255,255,255,0.64)'
                    } transparent`,
                    borderRadius: '999px 999px 28px 28px',
                    boxShadow: renderState.quest.started
                      ? `0 0 22px ${biome.palette.questItem}`
                      : 'none',
                  }}
                />
              </>
            )}
          </div>

          {showVillagePrompt && worldScene.village && (
            <div
              style={{
                position: 'absolute',
                left: worldScene.village.x + worldScene.village.width / 2,
                top: worldScene.village.y - renderState.cameraY - (compactHud ? 52 : 62),
                transform: 'translateX(-50%)',
                zIndex: 22,
                padding: compactHud ? '7px 9px' : '8px 11px',
                borderRadius: 18,
                background: 'rgba(255, 252, 245, 0.96)',
                border: `1px solid ${biome.palette.panelBorder}`,
                color: biome.palette.heading,
                boxShadow: '0 12px 24px rgba(15, 23, 42, 0.14)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: compactHud ? 11 : 12, fontWeight: 800 }}>
                {worldScene.village.name}
              </div>
              <div style={{ fontSize: compactHud ? 10 : 11, lineHeight: 1.2 }}>
                {villagePromptDetail}
              </div>
            </div>
          )}

          {showLandmarkPrompt && (
            <div
              style={{
                position: 'absolute',
                left: worldScene.landmark.x + worldScene.landmark.width / 2,
                top: worldScene.landmark.y - renderState.cameraY - (compactHud ? 52 : 62),
                transform: 'translateX(-50%)',
                zIndex: 22,
                padding: compactHud ? '7px 9px' : '8px 11px',
                borderRadius: 18,
                background: 'rgba(255, 252, 245, 0.96)',
                border: `1px solid ${biome.palette.panelBorder}`,
                color: biome.palette.heading,
                boxShadow: '0 12px 24px rgba(15, 23, 42, 0.14)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: compactHud ? 11 : 12, fontWeight: 800 }}>
                {worldScene.landmark.name}
              </div>
              <div style={{ fontSize: compactHud ? 10 : 11, lineHeight: 1.2 }}>
                {compactHud ? 'Tap to look' : 'Press E or tap'}
              </div>
            </div>
          )}

          {showWorldGatePrompt && (
            <div
              style={{
                position: 'absolute',
                left: worldScene.gate.x + worldScene.gate.width / 2,
                top: worldScene.gate.y - renderState.cameraY - (compactHud ? 60 : 72),
                transform: 'translateX(-50%)',
                zIndex: 22,
                padding: compactHud ? '8px 10px' : '10px 12px',
                borderRadius: 18,
                background: 'rgba(255, 252, 245, 0.96)',
                border: `1px solid ${biome.palette.panelBorder}`,
                color: biome.palette.heading,
                boxShadow: '0 12px 24px rgba(15, 23, 42, 0.14)',
                textAlign: 'center',
                minWidth: compactHud ? 96 : 132,
              }}
            >
              <div
                style={{
                  fontSize: compactHud ? 11 : 12,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: 0.8,
                  opacity: 0.72,
                  marginBottom: 3,
                }}
              >
                {worldScene.gate.name}
              </div>
              <div style={{ fontSize: compactHud ? 12 : 13, fontWeight: 700, lineHeight: 1.2 }}>
                {renderState.quest.started
                  ? compactHud
                    ? 'Tap to climb'
                    : 'Press E or tap to climb'
                  : compactHud
                    ? 'Help friend first'
                    : `Help ${renderState.creature.name} first`}
              </div>
            </div>
          )}
        </>
      )}

      {compactHud ? (
        <>
          <div
            style={{
              position: 'absolute',
              top: safeTop,
              left: safeLeft,
              right: safeRight,
              zIndex: 30,
              display: 'grid',
              gridTemplateColumns: 'auto auto 1fr',
              gap: 8,
              alignItems: 'start',
            }}
          >
            <div style={compactChipStyle}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: 0.8,
                  textTransform: 'uppercase',
                  opacity: 0.66,
                }}
              >
                World
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.1 }}>
                {biomeIndex + 1}/{BIOMES.length}
              </div>
            </div>

            <div style={compactChipStyle}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: 0.8,
                  textTransform: 'uppercase',
                  opacity: 0.66,
                }}
              >
                {getScoreHudTitle()}
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.1 }}>
                {renderState.score}
              </div>
            </div>

            <div
              style={{
                ...compactChipStyle,
                minWidth: 0,
                padding: '9px 11px',
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: 0.8,
                  textTransform: 'uppercase',
                  opacity: 0.66,
                  marginBottom: 4,
                }}
              >
                {getQuestLabelTitle()}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.15, marginBottom: 4 }}>
                {compactQuestTitle}
              </div>
              <div style={{ fontSize: 12, lineHeight: 1.2, marginBottom: 6 }}>
                {compactQuestHint}
              </div>
              <div
                style={{
                  height: 6,
                  background: 'rgba(255,255,255,0.72)',
                  borderRadius: 999,
                  overflow: 'hidden',
                  marginBottom: 6,
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${(renderState.quest.collected / renderState.quest.total) * 100}%`,
                    background: biome.palette.accent,
                    borderRadius: 999,
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 11 }}>
                <span>{renderState.quest.collected}/{renderState.quest.total}</span>
                <span>{getGateStatusTitle(renderState.quest)}</span>
              </div>
            </div>
          </div>

          {clearedObstacleBadges.length > 0 && (
            <div
              style={{
                position: 'absolute',
                top: `calc(${safeTop} + 82px)`,
                right: safeRight,
                zIndex: 30,
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 6,
                flexWrap: 'wrap',
                maxWidth: 'calc(100vw - 24px)',
              }}
            >
              {clearedObstacleBadges.map((badge) => {
                const isFresh = renderState.timeMs - badge.clearedAt < 700;

                return (
                  <div
                    key={badge.id}
                    style={{
                      width: obstacleBadgeSize,
                      height: obstacleBadgeSize,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(255, 250, 244, 0.92)',
                      border: `2px solid ${biome.palette.accent}`,
                      boxShadow: isFresh
                        ? `0 0 0 3px ${biome.palette.accentSoft}, 0 10px 20px rgba(15, 23, 42, 0.16)`
                        : '0 10px 20px rgba(15, 23, 42, 0.14)',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={badge.image}
                      alt=""
                      draggable={false}
                      style={{
                        width: '76%',
                        height: '76%',
                        objectFit: 'contain',
                        pointerEvents: 'none',
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {compactControlsVisible && (
            <div
              style={{
                position: 'absolute',
                left: '50%',
                bottom: safeBottom,
                transform: 'translateX(-50%)',
                zIndex: 30,
                maxWidth: 'min(250px, calc(100vw - 24px))',
                padding: '9px 12px',
                borderRadius: 18,
                background: 'rgba(255, 250, 244, 0.9)',
                border: `1px solid ${biome.palette.panelBorder}`,
                color: biome.palette.heading,
                boxShadow: '0 12px 28px rgba(15, 23, 42, 0.16)',
                backdropFilter: 'blur(10px)',
                fontSize: 12,
                fontWeight: 700,
                textAlign: 'center',
                lineHeight: 1.2,
              }}
            >
              {compactControlText}
            </div>
          )}
        </>
      ) : (
        <>
          <div
            style={{
              position: 'absolute',
              top: safeTop,
              left: safeLeft,
              zIndex: 30,
              display: 'flex',
              gap: 12,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                ...overlayPanelStyle,
                borderRadius: 24,
                padding: '12px 16px',
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                  opacity: 0.72,
                }}
              >
                {getBiomeHudTitle(biomeIndex, BIOMES.length)}
              </div>
              <div style={{ fontSize: 26, fontWeight: 700 }}>{biome.name}</div>
            </div>

            <div
              style={{
                ...overlayPanelStyle,
                borderRadius: 24,
                padding: '12px 16px',
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                  opacity: 0.72,
                }}
              >
                {getScoreHudTitle()}
              </div>
              <div style={{ fontSize: 26, fontWeight: 700 }}>{renderState.score}</div>
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              top: safeTop,
              right: safeRight,
              zIndex: 30,
              width: 'min(360px, calc(100vw - 36px))',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: 10,
            }}
          >
            {clearedObstacleBadges.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 8,
                  flexWrap: 'wrap',
                  maxWidth: '100%',
                }}
              >
                {clearedObstacleBadges.map((badge) => {
                  const isFresh = renderState.timeMs - badge.clearedAt < 700;

                  return (
                    <div
                      key={badge.id}
                      style={{
                        width: obstacleBadgeSize,
                        height: obstacleBadgeSize,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(255, 250, 244, 0.9)',
                        border: `2px solid ${biome.palette.accent}`,
                        boxShadow: isFresh
                          ? `0 0 0 4px ${biome.palette.accentSoft}, 0 12px 24px rgba(15, 23, 42, 0.18)`
                          : '0 12px 24px rgba(15, 23, 42, 0.14)',
                        transform: isFresh ? 'scale(1.06)' : 'scale(1)',
                        transition: 'transform 180ms ease, box-shadow 180ms ease',
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src={badge.image}
                        alt=""
                        draggable={false}
                        style={{
                          width: '78%',
                          height: '78%',
                          objectFit: 'contain',
                          pointerEvents: 'none',
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            <div
              style={{
                width: '100%',
                ...overlayPanelStyle,
                borderRadius: 24,
                padding: '14px 16px',
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                  opacity: 0.72,
                  marginBottom: 6,
                }}
              >
                {getQuestLabelTitle()}
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  marginBottom: 6,
                }}
              >
                {getQuestTitle(biome)}
              </div>
              <div style={{ ...haikuBlockStyle, fontSize: 15, marginBottom: 10 }}>
                {toHaikuText(
                  getQuestInstructionHaiku(biome, renderState.quest, renderState.sceneMode)
                )}
              </div>
              <div
                style={{
                  height: 10,
                  background: 'rgba(255,255,255,0.72)',
                  borderRadius: 999,
                  overflow: 'hidden',
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${(renderState.quest.collected / renderState.quest.total) * 100}%`,
                    background: biome.palette.accent,
                    borderRadius: 999,
                  }}
                />
              </div>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13 }}
              >
                <span>
                  {renderState.quest.hudLabel}: {renderState.quest.collected}/{renderState.quest.total}
                </span>
                <span>{getGateStatusTitle(renderState.quest)}</span>
              </div>
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              left: safeLeft,
              bottom: safeBottom,
              zIndex: 30,
              maxWidth: 'min(420px, calc(100vw - 36px))',
              background: 'rgba(255, 250, 244, 0.82)',
              border: `1px solid ${biome.palette.panelBorder}`,
              borderRadius: 24,
              padding: '12px 16px',
              color: biome.palette.heading,
              boxShadow: '0 18px 42px rgba(15, 23, 42, 0.18)',
              backdropFilter: 'blur(10px)',
              fontSize: 14,
              lineHeight: 1.45,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: 1.2,
                textTransform: 'uppercase',
                opacity: 0.72,
                marginBottom: 8,
              }}
            >
              {getTravelNotesTitle()}
            </div>
            <div style={{ ...haikuBlockStyle, fontWeight: 700, marginBottom: 8 }}>
              {toHaikuText(getRegionHaiku(biome))}
            </div>
            <div style={haikuBlockStyle}>
              {toHaikuText(getControlsHaiku(renderState.sceneMode, renderState.quest.started))}
            </div>
          </div>
        </>
      )}

      {renderState.platforms.map((platform) => {
        if (!shouldRenderPlatform(platform, renderState)) {
          return null;
        }

        const screenY = platform.y - renderState.cameraY;
        const isVisible =
          screenY + platform.height >= -80 &&
          screenY <= renderState.viewport.height + 80;

        if (!isVisible) {
          return null;
        }

        const isGuidePlatform =
          renderState.quest.guidePlatformIds.includes(platform.id) && routeGuidesVisible;
        const platformFrozen = platform.frozenUntil > renderState.timeMs;
        const platformBloomed = leafBloomActive && !platform.isGoal;
        const blessingBurstActive = renderState.blessingBurst?.platformId === platform.id;

        return (
          <div
            key={platform.id}
            style={{
              position: 'absolute',
              left: platform.x,
              top: screenY,
              width: platform.width,
              height: platform.height,
              backgroundImage: platformTrimSpriteSrc
                ? `url(${platformTrimSpriteSrc}), url(${platform.image})`
                : `url(${platform.image})`,
              backgroundSize: platformTrimSpriteSrc ? '100% 100%, 100% 100%' : '100% 100%',
              backgroundRepeat: platformTrimSpriteSrc ? 'no-repeat, no-repeat' : 'no-repeat',
              backgroundPosition: platformTrimSpriteSrc ? 'center, center' : 'center',
              filter: platform.isGoal
                ? renderState.quest.completed
                  ? `drop-shadow(0 0 18px ${biome.palette.platformGlow})`
                  : 'drop-shadow(0 10px 18px rgba(23, 37, 84, 0.18)) grayscale(0.15)'
                : platformFrozen
                  ? 'drop-shadow(0 0 12px rgba(255,255,255,0.3)) drop-shadow(0 12px 18px rgba(23, 37, 84, 0.18))'
                  : 'drop-shadow(0 12px 18px rgba(23, 37, 84, 0.18))',
              zIndex: platform.isGoal ? 12 : 7,
              opacity: platform.isGoal || !isGuidePlatform ? 1 : 0.92,
            }}
          >
            {platformBloomed && (
              <div
                style={{
                  position: 'absolute',
                  left: -16,
                  right: -16,
                  top: -8,
                  bottom: -6,
                  borderRadius: 999,
                  background: `linear-gradient(90deg, rgba(0,0,0,0), ${biome.palette.leaf}, rgba(255,255,255,0.72), ${biome.palette.leaf}, rgba(0,0,0,0))`,
                  opacity: 0.26,
                  filter: 'blur(8px)',
                }}
              />
            )}
            {platformFrozen && (
              <div
                style={{
                  position: 'absolute',
                  left: '14%',
                  right: '14%',
                  top: 4,
                  height: 8,
                  borderRadius: 999,
                  background: 'rgba(232, 239, 242, 0.84)',
                  boxShadow: '0 0 10px rgba(255,255,255,0.18)',
                }}
              />
            )}
            {blessingBurstActive && renderState.blessingBurst?.type === 'wind-lift' && (
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  bottom: '100%',
                  width: 52,
                  height: 52,
                  transform: 'translateX(-50%)',
                  borderRadius: '50%',
                  border: `3px solid ${biome.palette.accentSoft}`,
                  opacity: 0.7,
                }}
              />
            )}
            {isGuidePlatform && !platform.isGoal && (
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  bottom: '100%',
                  width: 42,
                  height: 18,
                  transform: 'translateX(-50%)',
                  borderRadius: '999px',
                  background: biome.palette.guide,
                  boxShadow: `0 0 18px ${biome.palette.guide}`,
                }}
              />
            )}
            {platform.isGoal && (
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  bottom: '100%',
                  transform: 'translateX(-50%)',
                  marginBottom: compactHud ? 8 : 12,
                  padding: compactHud ? '8px 10px' : '10px 16px',
                  borderRadius: compactHud ? 16 : 20,
                  background: renderState.quest.completed
                    ? 'rgba(255, 248, 207, 0.92)'
                    : 'rgba(255, 255, 255, 0.82)',
                  color: renderState.quest.completed ? '#734b00' : biome.palette.heading,
                  fontSize: compactHud ? 11 : 12,
                  fontWeight: 800,
                  lineHeight: 1.14,
                  whiteSpace: 'pre-line',
                  textAlign: 'center',
                  maxWidth: compactHud ? 170 : 220,
                }}
              >
                {getGoalBannerTitle(biome, renderState.quest.completed)}
              </div>
            )}
          </div>
        );
      })}

      {renderState.obstacles.map((obstacle) => {
        const screenY = obstacle.y - renderState.cameraY;
        const isVisible =
          obstacle.x + obstacle.width >= -120 &&
          obstacle.x <= renderState.viewport.width + 120 &&
          screenY + obstacle.height >= -120 &&
          screenY <= renderState.viewport.height + 120;

        if (!isVisible) {
          return null;
        }

        return (
          <img
            key={obstacle.id}
            src={obstacle.image}
            alt=""
            draggable={false}
            style={{
              position: 'absolute',
              left: obstacle.x,
              top: screenY,
              width: obstacle.width,
              height: obstacle.height,
              objectFit: 'contain',
              zIndex: 19,
              pointerEvents: 'none',
              transform: obstacle.facing === 'left' ? 'scaleX(-1)' : 'none',
              filter: 'drop-shadow(0 12px 20px rgba(15, 23, 42, 0.24))',
            }}
          />
        );
      })}

      {renderState.quest.items.map((item) => {
        if (item.collected) {
          return null;
        }

        const screenY = item.y - renderState.cameraY;
        const questItemSpriteSrc = getQuestItemSpriteAsset({
          biomeId: biome.id,
          item,
          questStarted: renderState.quest.started,
        });
        const isVisible =
          screenY + item.height >= -40 && screenY <= renderState.viewport.height + 40;

        if (!isVisible) {
          return null;
        }

        return (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              left: item.x,
              top: screenY,
              width: item.width,
              height: item.height,
              borderRadius: questItemSpriteSrc ? 0 : '999px',
              background: questItemSpriteSrc
                ? 'transparent'
                : renderState.quest.started || mirrorGuideActive
                  ? biome.palette.questItemSoft
                  : 'rgba(255,255,255,0.28)',
              boxShadow: questItemSpriteSrc
                ? 'none'
                : renderState.quest.started || mirrorGuideActive
                  ? `0 0 20px ${biome.palette.questItem}`
                  : '0 0 8px rgba(255,255,255,0.24)',
              filter: questItemSpriteSrc
                ? `drop-shadow(0 8px 16px ${mirrorGuideActive ? biome.palette.questItem : biome.palette.questItemSoft})`
                : 'none',
              opacity: renderState.quest.started || mirrorGuideActive ? 1 : 0.5,
              zIndex: 16,
            }}
          >
            {mirrorGuideActive && (
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  bottom: '100%',
                  width: 10,
                  height: 30,
                  transform: 'translateX(-50%)',
                  background: `linear-gradient(180deg, rgba(255,255,255,0), ${biome.palette.questItemSoft})`,
                  opacity: 0.68,
                }}
              />
            )}
            {questItemSpriteSrc ? (
              <img
                src={questItemSpriteSrc}
                alt=""
                draggable={false}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  pointerEvents: 'none',
                }}
              />
            ) : (
              renderQuestItemSprite(item, biome.palette)
            )}
          </div>
        );
      })}

      <div
        style={{
          position: 'absolute',
          left: renderState.creature.x,
          top: creatureVisualTop,
          width: renderState.creature.width,
          height: renderState.creature.height,
          zIndex: 18,
          filter: showCreatureMarker
            ? `drop-shadow(0 0 16px ${biome.palette.guide}) drop-shadow(0 10px 16px rgba(15, 23, 42, 0.2))`
            : 'drop-shadow(0 10px 16px rgba(15, 23, 42, 0.2))',
        }}
      >
        {creatureSpriteSrc ? (
          <img
            src={creatureSpriteSrc}
            alt=""
            draggable={false}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              pointerEvents: 'none',
            }}
          />
        ) : (
          renderCreatureSprite(renderState.creature, biome.palette)
        )}
        {!creatureSpriteSrc && creatureIsReacting && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '38%',
              width: '44%',
              height: '22%',
              transform: 'translateX(-50%)',
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '16%',
                top: '8%',
                width: '10%',
                height: '18%',
                borderRadius: '50%',
                background: biome.palette.heading,
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: '16%',
                top: '8%',
                width: '10%',
                height: '18%',
                borderRadius: '50%',
                background: biome.palette.heading,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '50%',
                bottom: 0,
                width: '54%',
                height: '36%',
                borderBottom: `3px solid ${biome.palette.heading}`,
                borderRadius: '0 0 999px 999px',
                transform: 'translateX(-50%)',
              }}
            />
          </div>
        )}
        {showCreatureMarker && (
          <div
            style={{
              position: 'absolute',
              inset: -10,
              borderRadius: 24,
              border: `2px dashed ${biome.palette.accent}`,
              opacity: showCreaturePrompt ? 0.85 : 0.45,
            }}
          />
        )}
      </div>

      {showCreatureMarker && (
        <div
          style={{
            position: 'absolute',
            left: renderState.creature.x + renderState.creature.width / 2,
            top: Math.max(
              compactHud ? 20 : 28,
              creatureVisualTop - (showCreaturePrompt ? (compactHud ? 88 : 118) : 54)
            ),
            transform: 'translateX(-50%)',
            zIndex: 22,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: compactHud ? 6 : 8,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              minWidth: compactHud ? 28 : 34,
              height: compactHud ? 28 : 34,
              padding: compactHud ? '0 8px' : '0 10px',
              borderRadius: 999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: biome.palette.accent,
              color: '#fffdf4',
              fontSize: compactHud ? 15 : 18,
              fontWeight: 800,
              boxShadow: '0 10px 18px rgba(15, 23, 42, 0.18)',
            }}
          >
            !
          </div>

          {showCreaturePrompt && (
            <div
              style={{
                maxWidth: compactHud ? 150 : 220,
                borderRadius: compactHud ? 16 : 20,
                padding: compactHud ? '8px 10px' : '10px 14px',
                background: 'rgba(255, 252, 245, 0.96)',
                border: `1px solid ${biome.palette.panelBorder}`,
                boxShadow: '0 16px 28px rgba(15, 23, 42, 0.16)',
                textAlign: 'center',
                color: biome.palette.heading,
              }}
            >
              <div
                style={{
                  fontSize: compactHud ? 10 : 12,
                  fontWeight: 800,
                  letterSpacing: 1.1,
                  textTransform: 'uppercase',
                  opacity: 0.7,
                  marginBottom: 4,
                }}
              >
                Help friend
              </div>
              <div style={{ fontSize: compactHud ? 13 : 15, fontWeight: 700, lineHeight: 1.2 }}>
                {compactHud ? 'Tap friend' : <>Press <span style={{ color: biome.palette.accent }}>E</span> or tap</>}
              </div>
              <div style={{ fontSize: compactHud ? 11 : 13, lineHeight: 1.25, opacity: 0.82 }}>
                {compactHud ? renderState.creature.name : `to help ${renderState.creature.name}`}
              </div>
            </div>
          )}
        </div>
      )}

      {renderState.rescueLeaf && (
        <div
          style={{
            position: 'absolute',
            left: renderState.rescueLeaf.x,
            top: renderState.rescueLeaf.y - renderState.cameraY,
            width: renderState.rescueLeaf.width,
            height: renderState.rescueLeaf.height,
            borderRadius: rescueLeafSpriteSrc ? 0 : '999px 999px 72% 72%',
            background: rescueLeafSpriteSrc
              ? 'transparent'
              : `linear-gradient(135deg, ${biome.palette.leaf}, rgba(255,255,255,0.85))`,
            boxShadow: rescueLeafSpriteSrc
              ? 'none'
              : `0 14px 26px ${biome.palette.leafShadow}`,
            zIndex: 15,
            opacity: renderState.rescueLeaf.used ? 0.5 : 1,
          }}
        >
          {rescueLeafSpriteSrc && (
            <img
              src={rescueLeafSpriteSrc}
              alt=""
              draggable={false}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                pointerEvents: 'none',
                filter: 'drop-shadow(0 14px 26px rgba(15, 23, 42, 0.18))',
              }}
            />
          )}
        </div>
      )}

      {renderState.companions.map((companion, index) => {
        const palette = getCompanionPalette(companion);
        const companionSpriteSrc = getCompanionSpriteAsset({
          companion,
          player: renderState.player,
          timeMs: renderState.timeMs,
          index,
        });
        const wobble = Math.sin((renderState.timeMs + index * 260) / 280) * 8;
        const companionX =
          renderState.player.x +
          18 -
          index * 28 +
          (renderState.player.facing === 'right' ? -34 : 86);
        const companionY =
          renderState.player.y -
          renderState.cameraY +
          24 +
          index * 18 +
          wobble;

        return (
          <div
            key={companion.id}
            title={toHaikuText(getCompanionTooltipHaiku(companion))}
            style={{
              position: 'absolute',
              left: companionX,
              top: companionY,
              width: 28,
              height: 28,
              borderRadius: companionSpriteSrc ? 0 : '999px',
              background: companionSpriteSrc ? 'transparent' : palette.background,
              border: companionSpriteSrc ? 'none' : `3px solid ${palette.border}`,
              color: '#14324d',
              fontSize: 9,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 19,
              boxShadow: companionSpriteSrc ? 'none' : '0 10px 18px rgba(15, 23, 42, 0.18)',
            }}
          >
            {companionSpriteSrc ? (
              <img
                src={companionSpriteSrc}
                alt=""
                draggable={false}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  pointerEvents: 'none',
                  filter: 'drop-shadow(0 8px 16px rgba(15, 23, 42, 0.18))',
                }}
              />
            ) : (
              companion.badge
            )}
          </div>
        );
      })}

      <Character
        position={{
          ...renderState.player,
          y: renderState.player.y - renderState.cameraY,
        }}
        width={renderState.player.width}
        height={renderState.player.height}
      />

      {glideActive && (
        <div
          style={{
            position: 'absolute',
            left: renderState.player.x - renderState.player.width * 0.32,
            top: renderState.player.y - renderState.cameraY + renderState.player.height * 0.2,
            width: renderState.player.width * 0.64,
            height: renderState.player.height * 0.34,
            pointerEvents: 'none',
            zIndex: 17,
          }}
        >
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                right: `${index * 18}%`,
                top: `${index * 18}%`,
                width: `${44 - index * 8}%`,
                height: 5,
                borderRadius: 999,
                background: biome.palette.accentSoft,
                opacity: 0.72 - index * 0.16,
                transform: `rotate(${-16 + index * 4}deg)`,
              }}
            />
          ))}
        </div>
      )}

      {!landingMode && activeVillageBlessing && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: compactHud ? 'max(56px, env(safe-area-inset-top) + 44px)' : 'max(72px, env(safe-area-inset-top) + 52px)',
            transform: 'translateX(-50%)',
            zIndex: 29,
            padding: compactHud ? '7px 10px' : '9px 12px',
            borderRadius: 18,
            background: 'rgba(255, 252, 245, 0.92)',
            border: `1px solid ${biome.palette.panelBorder}`,
            boxShadow: '0 14px 28px rgba(15, 23, 42, 0.16)',
            color: biome.palette.heading,
            textAlign: 'center',
            minWidth: compactHud ? 132 : 160,
          }}
        >
          <div
            style={{
              fontSize: compactHud ? 10 : 11,
              fontWeight: 800,
              letterSpacing: 1,
              textTransform: 'uppercase',
              opacity: 0.68,
              marginBottom: 2,
            }}
          >
            {activeVillageBlessing.label}
          </div>
          <div style={{ fontSize: compactHud ? 11 : 12, fontWeight: 600 }}>
            {activeVillageBlessing.hint}
          </div>
        </div>
      )}

      {renderState.dialog && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: safeBottom,
            transform: 'translateX(-50%)',
            width: compactHud ? 'min(260px, calc(100vw - 24px))' : 'min(560px, calc(100vw - 40px))',
            zIndex: 32,
            borderRadius: compactHud ? 20 : 28,
            padding: compactHud ? '10px 12px' : '14px 18px',
            background: dialogStyle.background,
            border: `1px solid ${dialogStyle.borderColor}`,
            boxShadow: '0 18px 42px rgba(15, 23, 42, 0.2)',
            backdropFilter: 'blur(10px)',
            color: dialogStyle.color,
          }}
        >
          {renderState.dialog.speaker && (
            <div
              style={{
                fontSize: compactHud ? 10 : 12,
                fontWeight: 800,
                marginBottom: 6,
                opacity: 0.72,
              }}
            >
              {renderState.dialog.speaker}
            </div>
          )}
          <div style={{ ...haikuBlockStyle, fontSize: compactHud ? 14 : 17, lineHeight: 1.35 }}>
            {toHaikuText(renderState.dialog.lines)}
          </div>
        </div>
      )}

      {isPaused && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(7, 10, 20, 0.28)',
            color: '#fffdf4',
            fontSize: compactHud ? 24 : 36,
            fontWeight: 700,
            textAlign: 'center',
            whiteSpace: 'pre-line',
            lineHeight: 1.16,
          }}
        >
          {toHaikuText(getPauseHaiku())}
        </div>
      )}
    </div>
  );
};

export default Game;
