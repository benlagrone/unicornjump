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
  buildCollectDialog,
  buildGoalLockedDialog,
  buildIntroDialog,
  buildQuestCompleteDialog,
  buildReminderDialog,
  buildRescueDialog,
} from './dialogSystem';

const CHARACTER_WIDTH = 100;
const CHARACTER_HEIGHT = 100;
const PLAYER_SIZE = { width: CHARACTER_WIDTH, height: CHARACTER_HEIGHT };
const PLATFORM_WIDTH = 180;
const PLATFORM_HEIGHT = 42;
const GOAL_PLATFORM_WIDTH = 240;
const PLATFORM_MARGIN_RATIO = 0.2;
const MOVE_SPEED = 440;
const GRAVITY = 2100;
const JUMP_VELOCITY = -1080;
const FIXED_STEP_MS = 1000 / 60;
const PLATFORM_GAP_MIN = 92;
const PLATFORM_GAP_MAX = 136;
const BACKGROUND_ASPECT_RATIO = 1298 / 1024;
const CAMERA_TOP_TARGET_RATIO = 0.34;
const CAMERA_BOTTOM_TARGET_RATIO = 0.7;
const LEVEL_MIN_HEIGHT_RATIO = 1.72;
const GOAL_PLATFORM_Y = 120;
const START_PLATFORM_Y_OFFSET = 150;
const RESCUE_LEAF_WIDTH = 176;
const RESCUE_LEAF_HEIGHT = 34;
const FLOAT_DESCENT_SPEED = 140;
const DIALOG_GAP_MS = 1000;
const PLATFORM_X_PATTERN = [0, -78, 54, -36, 68, -52, 42, 0];

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
  },
  normal: {
    minGap: PLATFORM_GAP_MIN,
    maxGap: PLATFORM_GAP_MAX,
    patternScale: 1,
  },
  adventurous: {
    minGap: 108,
    maxGap: 164,
    patternScale: 1.28,
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

const OBSTACLE_SIZE = 112;
const OBSTACLE_SPAWN_DELAY_MIN_MS = 3400;
const OBSTACLE_SPAWN_DELAY_MAX_MS = 6200;
const OBSTACLE_SPEED_MIN = 150;
const OBSTACLE_SPEED_MAX = 225;
const OBSTACLE_SCREEN_Y_MIN_RATIO = 0.18;
const OBSTACLE_SCREEN_Y_MAX_RATIO = 0.62;
const OBSTACLE_BOB_MIN = 12;
const OBSTACLE_BOB_MAX = 28;
const OBSTACLE_COLLISION_PUSH = 74;
const OBSTACLE_COLLISION_COOLDOWN_MS = 1200;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

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

const getViewport = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
});

const getDifficultyProfile = (difficulty = 'normal') =>
  DIFFICULTY_PROFILES[difficulty] || DIFFICULTY_PROFILES.normal;

const getLevelHeight = (viewport) =>
  Math.max(
    Math.round(viewport.width * BACKGROUND_ASPECT_RATIO),
    Math.round(viewport.height * LEVEL_MIN_HEIGHT_RATIO)
  );

const getHorizontalBounds = (viewportWidth) => {
  const margin = viewportWidth * PLATFORM_MARGIN_RATIO;
  return {
    minX: margin,
    maxX: Math.max(margin, viewportWidth - margin - PLATFORM_WIDTH),
  };
};

const pickPatternedPlatformX = (index, viewportWidth, difficultyProfile) => {
  const bounds = getHorizontalBounds(viewportWidth);
  const centerX = viewportWidth / 2 - PLATFORM_WIDTH / 2;
  const offset =
    PLATFORM_X_PATTERN[index % PLATFORM_X_PATTERN.length] * difficultyProfile.patternScale;
  return clamp(centerX + offset, bounds.minX, bounds.maxX);
};

const pickPlatformImage = (index) => PLATFORM_IMAGES[index % PLATFORM_IMAGES.length];
const pickObstacleImage = () =>
  OBSTACLE_IMAGES[Math.floor(Math.random() * OBSTACLE_IMAGES.length)];

const scheduleNextObstacleSpawn = (timeMs) =>
  timeMs +
  OBSTACLE_SPAWN_DELAY_MIN_MS +
  Math.random() * (OBSTACLE_SPAWN_DELAY_MAX_MS - OBSTACLE_SPAWN_DELAY_MIN_MS);

const createLevelPlatforms = (viewport, levelHeight, difficultyProfile) => {
  const centerX = viewport.width / 2 - PLATFORM_WIDTH / 2;
  const platforms = [];
  let currentY = levelHeight - START_PLATFORM_Y_OFFSET;
  let platformIndex = 0;

  platforms.push({
    id: `platform-${platformIndex}`,
    x: centerX,
    y: currentY,
    width: PLATFORM_WIDTH,
    height: PLATFORM_HEIGHT,
    image: pickPlatformImage(platformIndex),
    isGoal: false,
  });
  platformIndex += 1;

  while (currentY > GOAL_PLATFORM_Y + difficultyProfile.maxGap * 1.35) {
    const nextGap =
      difficultyProfile.minGap +
      Math.random() * (difficultyProfile.maxGap - difficultyProfile.minGap);
    currentY -= nextGap;

    platforms.push({
      id: `platform-${platformIndex}`,
      x: pickPatternedPlatformX(platformIndex, viewport.width, difficultyProfile),
      y: currentY,
      width: PLATFORM_WIDTH,
      height: PLATFORM_HEIGHT,
      image: pickPlatformImage(platformIndex),
      isGoal: false,
    });
    platformIndex += 1;
  }

  platforms.push({
    id: 'goal-platform',
    x: viewport.width / 2 - GOAL_PLATFORM_WIDTH / 2,
    y: GOAL_PLATFORM_Y,
    width: GOAL_PLATFORM_WIDTH,
    height: PLATFORM_HEIGHT,
    image: pickPlatformImage(platformIndex),
    isGoal: true,
  });

  return platforms.sort((left, right) => left.y - right.y);
};

const cloneDialog = (dialog) => (dialog ? { ...dialog } : null);

const createSkyObstacle = (gameState) => {
  const fromLeft = Math.random() < 0.5;
  const speed = OBSTACLE_SPEED_MIN + Math.random() * (OBSTACLE_SPEED_MAX - OBSTACLE_SPEED_MIN);
  const baseY =
    gameState.cameraY +
    gameState.viewport.height *
      (OBSTACLE_SCREEN_Y_MIN_RATIO +
        Math.random() * (OBSTACLE_SCREEN_Y_MAX_RATIO - OBSTACLE_SCREEN_Y_MIN_RATIO));

  return {
    id: `sky-obstacle-${Math.round(gameState.timeMs)}-${Math.round(Math.random() * 100000)}`,
    image: pickObstacleImage(),
    x: fromLeft ? -OBSTACLE_SIZE - 36 : gameState.viewport.width + 36,
    y: baseY,
    baseY,
    width: OBSTACLE_SIZE,
    height: OBSTACLE_SIZE,
    vx: fromLeft ? speed : -speed,
    bobAmplitude: OBSTACLE_BOB_MIN + Math.random() * (OBSTACLE_BOB_MAX - OBSTACLE_BOB_MIN),
    bobFrequency: 0.0022 + Math.random() * 0.0016,
    bobPhase: Math.random() * Math.PI * 2,
    facing: fromLeft ? 'right' : 'left',
  };
};

const isPlayerCollidingWithObstacle = (player, obstacle) =>
  player.x + CHARACTER_WIDTH - 14 > obstacle.x &&
  player.x + 14 < obstacle.x + obstacle.width &&
  player.y + CHARACTER_HEIGHT - 14 > obstacle.y &&
  player.y + 14 < obstacle.y + obstacle.height;

const createSnapshot = (gameState) => ({
  viewport: { ...gameState.viewport },
  levelHeight: gameState.levelHeight,
  maxCameraY: gameState.maxCameraY,
  cameraY: gameState.cameraY,
  difficulty: gameState.difficulty,
  biomeId: gameState.biomeId,
  biomeName: gameState.biomeName,
  palette: { ...gameState.palette },
  goalLabel: gameState.goalLabel,
  score: gameState.score,
  stageScore: gameState.stageScore,
  progress: gameState.progress,
  timeMs: gameState.timeMs,
  outcome: gameState.outcome,
  rewardUnlocked: gameState.rewardUnlocked,
  player: { ...gameState.player },
  creature: { ...gameState.creature },
  quest: {
    ...gameState.quest,
    items: gameState.quest.items.map((item) => ({ ...item })),
    guidePlatformIds: [...gameState.quest.guidePlatformIds],
  },
  platforms: gameState.platforms.map((platform) => ({ ...platform })),
  obstacles: gameState.obstacles.map((obstacle) => ({ ...obstacle })),
  companions: gameState.companions.map((companion) => ({ ...companion })),
  rescueLeaf: gameState.rescueLeaf ? { ...gameState.rescueLeaf } : null,
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

  gameState.stageScore = progressScore + collectibleScore + completionScore + rescueScore;
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
  const viewport = getViewport();
  const levelHeight = getLevelHeight(viewport);
  const maxCameraY = levelHeight - viewport.height;
  const platforms = createLevelPlatforms(viewport, levelHeight, runtimeConfig.difficultyProfile);
  const scene = buildBiomeDecorations(runtimeConfig.biome, viewport, levelHeight);
  const startingPlatform = platforms[platforms.length - 1];
  const creature = createCreatureEncounter(runtimeConfig.biome, platforms);
  const quest = createQuestState(runtimeConfig.biome, platforms, creature);

  return {
    viewport,
    levelHeight,
    maxCameraY,
    cameraY: maxCameraY,
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
      x: startingPlatform.x + startingPlatform.width / 2 - CHARACTER_WIDTH / 2,
      y: startingPlatform.y - CHARACTER_HEIGHT,
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
    quest,
    companions: [...runtimeConfig.companions],
    rescueLeaf: null,
    dialog: null,
    lastDialogAt: -DIALOG_GAP_MS,
    scene,
  };
};

const spawnRescueLeaf = (gameState, companionBonuses) => {
  const leafWidth = RESCUE_LEAF_WIDTH * companionBonuses.rescueLeafScale;
  const leafX = clamp(
    gameState.player.x - (leafWidth - CHARACTER_WIDTH) / 2,
    24,
    gameState.viewport.width - leafWidth - 24
  );
  const leafY = gameState.cameraY + gameState.viewport.height - 210;

  gameState.rescueLeaf = {
    id: 'rescue-leaf',
    x: leafX,
    y: leafY,
    width: leafWidth,
    height: RESCUE_LEAF_HEIGHT,
    isRescueLeaf: true,
    used: false,
    expiresAt: null,
  };
  gameState.player.y = leafY - CHARACTER_HEIGHT - 24;
  gameState.player.vy = FLOAT_DESCENT_SPEED;
  gameState.player.animation = 'fall';
  applyDialog(gameState, buildRescueDialog(), true);
};

const updateGameState = (
  gameState,
  deltaMs,
  keysPressed,
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

  if (gameState.timeMs >= gameState.nextObstacleSpawnAt && gameState.obstacles.length < 2) {
    gameState.obstacles.push(createSkyObstacle(gameState));
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
  if (keysPressed.left && !keysPressed.right) {
    player.vx = -MOVE_SPEED;
    player.facing = 'left';
  }
  if (keysPressed.right && !keysPressed.left) {
    player.vx = MOVE_SPEED;
    player.facing = 'right';
  }

  const previousBottom = player.y + CHARACTER_HEIGHT;

  player.x = clamp(
    player.x + player.vx * deltaSeconds,
    0,
    viewport.width - CHARACTER_WIDTH
  );
  player.vy = Math.min(
    player.vy + GRAVITY * deltaSeconds,
    runtimeConfig.companionBonuses.maxFallSpeed
  );
  player.y += player.vy * deltaSeconds;

  let landingPlatform = null;
  const collisionPlatforms = gameState.rescueLeaf
    ? gameState.rescueLeaf.used
      ? platforms
      : [...platforms, gameState.rescueLeaf]
    : platforms;

  if (player.vy > 0) {
    for (const platform of collisionPlatforms) {
      const currentBottom = player.y + CHARACTER_HEIGHT;
      const overlapsHorizontally =
        player.x + CHARACTER_WIDTH - 18 > platform.x &&
        player.x + 18 < platform.x + platform.width;
      const crossedPlatformTop =
        previousBottom <= platform.y + platform.height / 2 &&
        currentBottom >= platform.y &&
        previousBottom <= platform.y + platform.height;

      if (overlapsHorizontally && crossedPlatformTop) {
        player.y = platform.y - CHARACTER_HEIGHT;
        player.vy = JUMP_VELOCITY;
        landingPlatform = platform;

        if (platform.isRescueLeaf) {
          gameState.rescueLeaf = {
            ...platform,
            used: true,
            expiresAt: gameState.timeMs + 700,
          };
          gameState.rescueCount += 1;
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
        player.x + pushDirection * OBSTACLE_COLLISION_PUSH,
        0,
        viewport.width - CHARACTER_WIDTH
      );
      player.vy = Math.min(player.vy, -320);
      player.animation = 'jump';
      gameState.lastObstacleHitAt = gameState.timeMs;
      gameState.obstacles = gameState.obstacles.filter(
        (obstacle) => obstacle.id !== collidingObstacle.id
      );
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

  const isNearCreature = isPlayerNearCreature(player, gameState.creature, PLAYER_SIZE);
  const hasPassedCreature =
    !gameState.quest.started && player.y + CHARACTER_HEIGHT < gameState.creature.y - 24;

  if (!gameState.quest.started && (isNearCreature || hasPassedCreature)) {
    gameState.quest.started = true;
    gameState.creature.met = true;
    gameState.creature.lastInteractionAt = gameState.timeMs;
    applyDialog(gameState, buildIntroDialog(runtimeConfig.biome), true);
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
      PLAYER_SIZE,
      runtimeConfig.companionBonuses.collectibleMagnetRadius
    );

    if (collectionResult.collectedNow > 0) {
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
        applyDialog(
          gameState,
          buildQuestCompleteDialog(runtimeConfig.biome, runtimeConfig.nextBiome),
          true
        );
      }
    }
  }

  player.animation = landingPlatform ? 'jump' : getAnimationForPlayer(player);

  if (landingPlatform && landingPlatform.isGoal) {
    if (gameState.quest.completed) {
      gameState.outcome = 'complete';
      gameState.progress = 1;
      refreshScore(gameState, runtimeConfig.companionBonuses);

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

    applyDialog(gameState, buildGoalLockedDialog(runtimeConfig.biome, gameState.quest), true);
  }

  const updatedPlayerScreenY = player.y - gameState.cameraY;
  if (
    updatedPlayerScreenY > viewport.height + CHARACTER_HEIGHT * 0.15 &&
    !gameState.rescueLeaf
  ) {
    spawnRescueLeaf(gameState, runtimeConfig.companionBonuses);
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
            inset: '12%',
            borderRadius: '40% 60% 60% 40%',
            background: palette.questItem,
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
            left: '38%',
            top: '8%',
            width: '14%',
            height: '60%',
            borderRadius: '999px',
            background: palette.questItem,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '22%',
            top: '44%',
            width: '34%',
            height: '34%',
            borderRadius: '999px',
            background: palette.questItem,
          }}
        />
      </div>
    );
  }

  if (item.type === 'star') {
    return (
      <div
        style={{
          ...wrapperStyle,
          background: palette.questItem,
          clipPath:
            'polygon(50% 0, 61% 36%, 98% 36%, 68% 58%, 79% 96%, 50% 72%, 21% 96%, 32% 58%, 2% 36%, 39% 36%)',
        }}
      />
    );
  }

  if (item.type === 'sun-drop') {
    return (
      <div style={wrapperStyle}>
        <div
          style={{
            position: 'absolute',
            inset: '14%',
            borderRadius: '999px',
            background: palette.questItem,
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
            background: palette.questItemSoft,
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
          left: '30%',
          top: '26%',
          width: '40%',
          height: '40%',
          borderRadius: '999px',
          background: palette.questItem,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '12%',
          top: '26%',
          width: '24%',
          height: '20%',
          borderRadius: '999px',
          background: palette.questItemSoft,
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: '12%',
          top: '26%',
          width: '24%',
          height: '20%',
          borderRadius: '999px',
          background: palette.questItemSoft,
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
  const keysPressedRef = useRef({ left: false, right: false });
  const resetGameRef = useRef(() => {});
  const stepSimulationRef = useRef(() => {});
  const callbacksRef = useRef({
    onBiomeComplete,
    onPause,
    onResume,
  });
  const pauseStateRef = useRef(isPaused);
  const deterministicModeRef = useRef(false);

  const syncRenderState = () => {
    setRenderState(createSnapshot(gameStateRef.current));
  };

  const resetGame = (nextRuntimeConfig = runtimeConfigRef.current) => {
    runtimeConfigRef.current = nextRuntimeConfig;
    gameStateRef.current = buildInitialState(nextRuntimeConfig);
    lastFrameTimeRef.current = null;
    syncRenderState();
  };

  const stepSimulation = (deltaMs) => {
    const didUpdate = updateGameState(
      gameStateRef.current,
      deltaMs,
      keysPressedRef.current,
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
    callbacksRef.current = {
      onBiomeComplete,
      onPause,
      onResume,
    };
  }, [onBiomeComplete, onPause, onResume]);

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

    const handleResize = () => {
      resetGameRef.current(runtimeConfigRef.current);
    };

    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        keysPressedRef.current.left = true;
      }
      if (event.key === 'ArrowRight') {
        keysPressedRef.current.right = true;
      }
      if (event.key === 'Escape') {
        if (pauseStateRef.current) {
          if (callbacksRef.current.onResume) {
            callbacksRef.current.onResume();
          }
        } else if (callbacksRef.current.onPause) {
          callbacksRef.current.onPause();
        }
      }
    };

    const handleKeyUp = (event) => {
      if (event.key === 'ArrowLeft') {
        keysPressedRef.current.left = false;
      }
      if (event.key === 'ArrowRight') {
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
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    if (!deterministicModeRef.current) {
      animationFrameRef.current = window.requestAnimationFrame(runFrame);
    }

    return () => {
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    window.render_game_to_text = () => {
      const state = renderedStateRef.current;
      const guideLightsVisible = getCompanionBonuses(state.companions).revealGuides;

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
        harmony: state.score,
        stageHarmony: state.stageScore,
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
        },
        companions: state.companions.map((companion) => ({
          name: companion.name,
          effect: companion.effect,
        })),
        visiblePlatforms: state.platforms
          .filter((platform) => {
            const screenY = platform.y - state.cameraY;
            return screenY + platform.height >= -60 && screenY <= state.viewport.height + 60;
          })
          .sort((left, right) => left.y - right.y)
          .slice(0, 8)
          .map((platform) => ({
            x: Math.round(platform.x),
            y: Math.round(platform.y - state.cameraY),
            width: platform.width,
            height: platform.height,
            isGoal: platform.isGoal,
            guide: guideLightsVisible && state.quest.guidePlatformIds.includes(platform.id),
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
  const guideLightsVisible = getCompanionBonuses(renderState.companions).revealGuides;
  const dialogStyle = renderState.dialog
    ? getDialogStyle(renderState.dialog.tone, biome.palette)
    : null;

  return (
    <div
      className="game-container"
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#d8efff',
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

      <div
        style={{
          position: 'absolute',
          top: 18,
          left: 18,
          zIndex: 30,
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            background: biome.palette.panel,
            border: `1px solid ${biome.palette.panelBorder}`,
            borderRadius: 24,
            padding: '12px 16px',
            backdropFilter: 'blur(10px)',
            color: biome.palette.heading,
            boxShadow: '0 18px 42px rgba(15, 23, 42, 0.18)',
          }}
        >
          <div style={{ fontSize: 13, letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.72 }}>
            Biome {biomeIndex + 1} / {BIOMES.length}
          </div>
          <div style={{ fontSize: 26, fontWeight: 700 }}>{biome.name}</div>
        </div>

        <div
          style={{
            background: biome.palette.panel,
            border: `1px solid ${biome.palette.panelBorder}`,
            borderRadius: 24,
            padding: '12px 16px',
            backdropFilter: 'blur(10px)',
            color: biome.palette.heading,
            boxShadow: '0 18px 42px rgba(15, 23, 42, 0.18)',
          }}
        >
          <div style={{ fontSize: 13, letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.72 }}>
            Harmony
          </div>
          <div style={{ fontSize: 26, fontWeight: 700 }}>{renderState.score}</div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 18,
          right: 18,
          zIndex: 30,
          width: 'min(360px, calc(100vw - 36px))',
          background: biome.palette.panel,
          border: `1px solid ${biome.palette.panelBorder}`,
          borderRadius: 24,
          padding: '14px 16px',
          backdropFilter: 'blur(10px)',
          color: biome.palette.heading,
          boxShadow: '0 18px 42px rgba(15, 23, 42, 0.18)',
        }}
      >
        <div style={{ fontSize: 13, letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.72 }}>
          Quest
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
          Help {biome.creature.name}
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.4, marginBottom: 10 }}>
          {renderState.quest.started
            ? `${renderState.quest.collectVerb} ${renderState.quest.total} ${renderState.quest.itemPlural}.`
            : `Meet ${biome.creature.name} on the lower platforms to begin.`}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
          <span>
            {renderState.quest.hudLabel}: {renderState.quest.collected}/{renderState.quest.total}
          </span>
          <span>{renderState.quest.completed ? 'Gate open' : 'Gate sleeping'}</span>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 18,
          bottom: 18,
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
        <div style={{ fontWeight: 700, marginBottom: 4 }}>{biome.regionLabel}</div>
        <div>
          Use left and right arrows to drift between platforms. Fall off a ledge to head back
          down. Esc pauses the garden.
        </div>
      </div>

      {renderState.platforms.map((platform) => {
        const screenY = platform.y - renderState.cameraY;
        const isVisible =
          screenY + platform.height >= -80 &&
          screenY <= renderState.viewport.height + 80;

        if (!isVisible) {
          return null;
        }

        const isGuidePlatform =
          renderState.quest.guidePlatformIds.includes(platform.id) && guideLightsVisible;

        return (
          <div
            key={platform.id}
            style={{
              position: 'absolute',
              left: platform.x,
              top: screenY,
              width: platform.width,
              height: platform.height,
              backgroundImage: `url(${platform.image})`,
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              filter: platform.isGoal
                ? renderState.quest.completed
                  ? `drop-shadow(0 0 18px ${biome.palette.platformGlow})`
                  : 'drop-shadow(0 10px 18px rgba(23, 37, 84, 0.18)) grayscale(0.15)'
                : 'drop-shadow(0 12px 18px rgba(23, 37, 84, 0.18))',
              zIndex: platform.isGoal ? 12 : 7,
              opacity: platform.isGoal || !isGuidePlatform ? 1 : 0.92,
            }}
          >
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
                  marginBottom: 12,
                  padding: '8px 14px',
                  borderRadius: 999,
                  background: renderState.quest.completed
                    ? 'rgba(255, 248, 207, 0.92)'
                    : 'rgba(255, 255, 255, 0.82)',
                  color: renderState.quest.completed ? '#734b00' : biome.palette.heading,
                  fontSize: 13,
                  fontWeight: 800,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}
              >
                {renderState.quest.completed
                  ? biome.goalLabel
                  : `Help ${biome.creature.name} first`}
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
              borderRadius: '999px',
              background: renderState.quest.started ? biome.palette.questItemSoft : 'rgba(255,255,255,0.28)',
              boxShadow: renderState.quest.started
                ? `0 0 20px ${biome.palette.questItem}`
                : '0 0 8px rgba(255,255,255,0.24)',
              opacity: renderState.quest.started ? 1 : 0.5,
              zIndex: 16,
            }}
          >
            {renderQuestItemSprite(item, biome.palette)}
          </div>
        );
      })}

      <div
        style={{
          position: 'absolute',
          left: renderState.creature.x,
          top: renderState.creature.y - renderState.cameraY,
          width: renderState.creature.width,
          height: renderState.creature.height,
          zIndex: 18,
          filter: 'drop-shadow(0 10px 16px rgba(15, 23, 42, 0.2))',
        }}
      >
        {renderCreatureSprite(renderState.creature, biome.palette)}
      </div>

      {renderState.rescueLeaf && (
        <div
          style={{
            position: 'absolute',
            left: renderState.rescueLeaf.x,
            top: renderState.rescueLeaf.y - renderState.cameraY,
            width: renderState.rescueLeaf.width,
            height: renderState.rescueLeaf.height,
            borderRadius: '999px 999px 72% 72%',
            background: `linear-gradient(135deg, ${biome.palette.leaf}, rgba(255,255,255,0.85))`,
            boxShadow: `0 14px 26px ${biome.palette.leafShadow}`,
            zIndex: 15,
            opacity: renderState.rescueLeaf.used ? 0.5 : 1,
          }}
        />
      )}

      {renderState.companions.map((companion, index) => {
        const palette = getCompanionPalette(companion);
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
            title={`${companion.name}: ${companion.ability}`}
            style={{
              position: 'absolute',
              left: companionX,
              top: companionY,
              width: 28,
              height: 28,
              borderRadius: '999px',
              background: palette.background,
              border: `3px solid ${palette.border}`,
              color: '#14324d',
              fontSize: 9,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 19,
              boxShadow: '0 10px 18px rgba(15, 23, 42, 0.18)',
            }}
          >
            {companion.badge}
          </div>
        );
      })}

      <Character
        position={{
          ...renderState.player,
          y: renderState.player.y - renderState.cameraY,
        }}
        width={CHARACTER_WIDTH}
        height={CHARACTER_HEIGHT}
      />

      {renderState.dialog && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 26,
            transform: 'translateX(-50%)',
            width: 'min(560px, calc(100vw - 40px))',
            zIndex: 32,
            borderRadius: 28,
            padding: '14px 18px',
            background: dialogStyle.background,
            border: `1px solid ${dialogStyle.borderColor}`,
            boxShadow: '0 18px 42px rgba(15, 23, 42, 0.2)',
            backdropFilter: 'blur(10px)',
            color: dialogStyle.color,
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 1.4,
              textTransform: 'uppercase',
              marginBottom: 4,
              opacity: 0.72,
            }}
          >
            {renderState.dialog.speaker}
          </div>
          {renderState.dialog.lines.map((line) => (
            <div key={line} style={{ fontSize: 16, lineHeight: 1.45 }}>
              {line}
            </div>
          ))}
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
            fontSize: 36,
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          Paused
        </div>
      )}
    </div>
  );
};

export default Game;
