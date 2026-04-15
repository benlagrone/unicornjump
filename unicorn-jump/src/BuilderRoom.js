import React, { useEffect, useRef, useState } from 'react';
import {
  BUILDER_ROOM_GRID_SIZE,
  getFurnitureCatalogForRoom,
  snapRoomPosition,
} from './builderState';

const panelStyle = {
  background: 'rgba(255, 249, 240, 0.82)',
  border: '1px solid rgba(255, 255, 255, 0.7)',
  borderRadius: 30,
  boxShadow: '0 24px 65px rgba(15, 23, 42, 0.22)',
  backdropFilter: 'blur(12px)',
};

const actionButtonStyle = {
  border: 0,
  borderRadius: 999,
  padding: '12px 18px',
  minHeight: 54,
  fontSize: 15,
  fontWeight: 700,
  background: '#ffffff',
  color: '#17345c',
  cursor: 'pointer',
};

const dragCardStyle = {
  borderRadius: 18,
  padding: '14px 14px',
  background: '#ffffff',
  boxShadow: '0 10px 18px rgba(15, 23, 42, 0.08)',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  cursor: 'grab',
  touchAction: 'none',
  userSelect: 'none',
};

const getRoomLayoutMode = () => {
  if (typeof window === 'undefined') {
    return {
      compact: false,
      stacked: false,
      viewportWidth: 1440,
      viewportHeight: 900,
    };
  }

  const width = Math.round(window.visualViewport?.width ?? window.innerWidth);
  const height = Math.round(window.visualViewport?.height ?? window.innerHeight);
  return {
    compact: width <= 980,
    stacked: width <= 1180,
    viewportWidth: width,
    viewportHeight: height,
  };
};

const getRoomDropState = (roomElement, furniture, pointerOffset, clientX, clientY) => {
  const bounds = roomElement.getBoundingClientRect();
  const scale = bounds.width > 0 && roomElement.clientWidth > 0 ? bounds.width / roomElement.clientWidth : 1;
  const rawX = (clientX - bounds.left) / scale - pointerOffset.x;
  const rawY = (clientY - bounds.top) / scale - pointerOffset.y;

  return {
    insideRoom:
      clientX >= bounds.left &&
      clientX <= bounds.right &&
      clientY >= bounds.top &&
      clientY <= bounds.bottom,
    snapped: snapRoomPosition(
      {
        width: roomElement.clientWidth,
        height: roomElement.clientHeight,
      },
      furniture,
      {
        x: rawX,
        y: rawY,
      }
    ),
  };
};

const isPointerInsideBounds = (element, clientX, clientY) => {
  if (!element) {
    return false;
  }

  const bounds = element.getBoundingClientRect();
  return (
    clientX >= bounds.left &&
    clientX <= bounds.right &&
    clientY >= bounds.top &&
    clientY <= bounds.bottom
  );
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getRoomStageScale = (
  roomWidth,
  roomHeight,
  layoutMode,
  widthBudget = null,
  heightBudget = null
) => {
  const horizontalPadding = layoutMode.compact ? 20 : 30;
  const fallbackWidthBudget = layoutMode.viewportWidth - horizontalPadding * 2;
  const fallbackHeightBudget = layoutMode.viewportHeight - (layoutMode.compact ? 250 : 220);
  const safeWidthBudget = Math.max(
    roomWidth * 0.56,
    (widthBudget ?? fallbackWidthBudget) - (layoutMode.compact ? 8 : 12)
  );
  const safeHeightBudget = Math.max(
    roomHeight * 0.56,
    (heightBudget ?? fallbackHeightBudget) - (layoutMode.compact ? 8 : 12)
  );
  const widthScale = safeWidthBudget / roomWidth;
  const heightScale = safeHeightBudget / roomHeight;
  const maxScale = layoutMode.compact ? 1.58 : layoutMode.stacked ? 2.02 : 2.36;

  return clamp(Math.min(widthScale, heightScale, maxScale), 0.9, maxScale);
};

const ROOM_UNICORN_ASSET = `${process.env.PUBLIC_URL}/assets/images/character/unicorn_little.svg`;
const PLAYER_ACTOR_SIZE = {
  width: 46,
  height: 46,
  speed: 156,
};
const NPC_ACTOR_SIZE = {
  width: 34,
  height: 42,
};
const ROOM_SOCIAL_NEAR_DISTANCE = 92;
const ROOM_SOCIAL_INTERACTION_DISTANCE = 74;
const ROOM_SOCIAL_AUTO_INTERACTION_CHANCE = 0.8;
const ROOM_SOCIAL_CLICK_DURATION_MS = 4400;
const ROOM_SOCIAL_NEAR_DURATION_MS = 2800;
const ROOM_SOCIAL_NEAR_COOLDOWN_MS = 3600;
const ROOM_SOCIAL_MISS_COOLDOWN_MS = 1500;
const ROOM_ITEM_REACTION_DISTANCE = 124;
const ROOM_ITEM_REACTION_TYPES = {
  lantern: 'glow',
  lamp: 'glow',
  torch: 'flare',
  plate: 'twinkle',
  recliner: 'settle',
  cushion: 'settle',
  stool: 'bounce',
  gem: 'sparkle',
  screen: 'flutter',
  planter: 'sway',
  vase: 'sway',
  fountain: 'glow',
  table: 'hum',
  shelf: 'hum',
  bench: 'bounce',
  chest: 'hum',
};

const getRoomWalkBounds = (roomWidth, roomHeight, actorWidth, actorHeight) => ({
  xMin: 12,
  xMax: Math.max(12, roomWidth - actorWidth - 12),
  yMin: Math.round(roomHeight * 0.58),
  yMax: Math.max(Math.round(roomHeight * 0.58), roomHeight - actorHeight - 18),
});

const hashSeed = (value = '') =>
  String(value).split('').reduce((seed, char) => ((seed * 33) ^ char.charCodeAt(0)) >>> 0, 5381);

const rotateList = (items, offset) => {
  if (!Array.isArray(items) || items.length <= 1) {
    return items || [];
  }

  const safeOffset = ((offset % items.length) + items.length) % items.length;
  return [...items.slice(safeOffset), ...items.slice(0, safeOffset)];
};

const ROOM_THEME_CAST_VARIANTS = {
  default: {
    minCount: 3,
    maxCount: 4,
    extraNames: ['Lantern Keeper', 'Little Singer', 'Garden Scout'],
  },
  'korean-garden': {
    minCount: 4,
    maxCount: 5,
    extraNames: ['Lantern Keeper', 'Pond Scout', 'Bamboo Singer'],
  },
  'bavarian-castle': {
    minCount: 3,
    maxCount: 5,
    extraNames: ['Banner Herald', 'Turret Scout', 'Cloud Page'],
  },
  'spanish-palace': {
    minCount: 4,
    maxCount: 5,
    extraNames: ['Tile Dancer', 'Courtyard Host', 'Fountain Cousin'],
  },
  'mesoamerican-pyramid': {
    minCount: 3,
    maxCount: 5,
    extraNames: ['Sun Keeper', 'Glyph Runner', 'Temple Cousin'],
  },
  'grecoroman-circus': {
    minCount: 4,
    maxCount: 5,
    extraNames: ['Ribbon Herald', 'Garden Laureate', 'Arena Twin'],
  },
  'scandinavian-longhouse': {
    minCount: 3,
    maxCount: 5,
    extraNames: ['Hearth Cousin', 'Snow Scout', 'Beam Keeper'],
  },
  'japanese-fortress': {
    minCount: 4,
    maxCount: 5,
    extraNames: ['Lantern Fox', 'Bridge Cousin', 'Blossom Watcher'],
  },
  'babylonian-hanging-gardens': {
    minCount: 4,
    maxCount: 5,
    extraNames: ['Vine Singer', 'Pool Keeper', 'Terrace Cousin'],
  },
  'future-sky-dome': {
    minCount: 3,
    maxCount: 5,
    extraNames: ['Orbit Bot', 'Nova Twin', 'Halo Scout'],
  },
};

const ROOM_CAST_SLOTS = [
  {
    id: 'npc-guide',
    name: 'Guide',
    scriptKey: 'guide',
    anchor: 0.14,
    range: 0.08,
    lane: 0.16,
    phase: 0.15,
    periodMs: 3600,
  },
  {
    id: 'npc-friend',
    name: 'Room Friend',
    scriptKey: 'friend',
    anchor: 0.38,
    range: 0.08,
    lane: 0.08,
    phase: 1.25,
    periodMs: 4200,
  },
  {
    id: 'npc-friend-2',
    name: 'Room Cousin',
    scriptKey: 'friend',
    anchor: 0.58,
    range: 0.07,
    lane: 0.13,
    phase: 2.1,
    periodMs: 3900,
  },
  {
    id: 'npc-friend-3',
    name: 'Room Scout',
    scriptKey: 'friend',
    anchor: 0.76,
    range: 0.06,
    lane: 0.03,
    phase: 2.9,
    periodMs: 4500,
  },
  {
    id: 'npc-friend-4',
    name: 'Room Singer',
    scriptKey: 'friend',
    anchor: 0.9,
    range: 0.05,
    lane: 0.2,
    phase: 3.65,
    periodMs: 4100,
  },
];

const createRoomNpcBlueprints = (theme, roomSeed = 'room') => {
  const castVariant = ROOM_THEME_CAST_VARIANTS[theme?.id] || ROOM_THEME_CAST_VARIANTS.default;
  const countSpan = Math.max(1, castVariant.maxCount - castVariant.minCount + 1);
  const targetCount = Math.min(
    ROOM_CAST_SLOTS.length,
    castVariant.minCount + (hashSeed(`${theme?.id || 'room'}:${roomSeed}:count`) % countSpan)
  );
  const rotatedExtraNames = rotateList(
    castVariant.extraNames,
    hashSeed(`${theme?.id || 'room'}:${roomSeed}:names`) % Math.max(1, castVariant.extraNames.length)
  );
  const rotatedExtraSlots = rotateList(
    ROOM_CAST_SLOTS.slice(2),
    hashSeed(`${theme?.id || 'room'}:${roomSeed}:slots`) % Math.max(1, ROOM_CAST_SLOTS.length - 2)
  );
  const selectedSlots = [ROOM_CAST_SLOTS[0], ROOM_CAST_SLOTS[1], ...rotatedExtraSlots].slice(0, targetCount);

  return selectedSlots.map((slot, index) => {
    const extraName = index >= 2 ? rotatedExtraNames[index - 2] || slot.name : slot.name;
    const accentBlend = index % 2 === 0 ? theme?.accent || '#f4b457' : theme?.frame || '#34435a';
    const bodyColor = index === 0
      ? theme?.accent || '#f4b457'
      : index % 2 === 0
        ? theme?.wallBottom || '#d2dccf'
        : theme?.wallTop || '#ecf0e8';

    return {
      ...slot,
      name: extraName,
      bodyColor,
      accentColor: accentBlend,
      glowColor: index % 2 === 0 ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.12)',
      phase: slot.phase + index * 0.42,
      variantIndex: index,
    };
  });
};

const ROOM_NICE_MOODS = ['calm', 'sunny', 'curious', 'playful', 'mellow', 'chatty', 'welcoming'];
const ROOM_NPC_PERSONALITIES = [
  {
    id: 'gentle',
    label: 'gentle',
    idleExtra: ['Soft little hum', 'Kind watch'],
    nearbyExtra: ['Warm hello', 'Sweet little wave', 'Stay close'],
    clickExtra: ['Hehe, you found me', 'Let us chat', 'You sparkle'],
    approachLines: ['Coming to say hi?', 'Little hello?', 'Hehe, over here'],
    playerNear: ['Hi friend', 'Tiny hello', 'Cozy chat'],
    playerClick: ['Hehe', 'I came to chat', 'You seem sweet'],
    idleEmote: 'hum',
    nearbyEmote: 'hi',
    clickEmote: 'giggle',
    socialEmote: 'chat',
    moods: ['calm', 'mellow'],
    socialMood: 'welcoming',
    clickMood: 'delighted',
  },
  {
    id: 'playful',
    label: 'playful',
    idleExtra: ['Little bounce', 'Bright little wait'],
    nearbyExtra: ['Want to play?', 'Happy hello', 'Hehe, unicorn'],
    clickExtra: ['Giggle time', 'Let us be silly', 'Best timing'],
    approachLines: ['Coming over?', 'Catch me here', 'Hehe, hi'],
    playerNear: ['Play with me', 'Hi hi', 'So cute'],
    playerClick: ['Hehe, okay', 'Let us play', 'Happy chat'],
    idleEmote: 'hum',
    nearbyEmote: 'yay',
    clickEmote: 'giggle',
    socialEmote: 'chat',
    moods: ['playful', 'sunny'],
    socialMood: 'playful',
    clickMood: 'delighted',
  },
  {
    id: 'curious',
    label: 'curious',
    idleExtra: ['Watching softly', 'Tiny wonder'],
    nearbyExtra: ['Hello, traveler', 'What do you think?', 'New friend'],
    clickExtra: ['Tell me everything', 'I like your sparkle', 'This is fun'],
    approachLines: ['Coming to visit?', 'I have room for a chat', 'Hi there'],
    playerNear: ['Hi there', 'Neat friend', 'Cute room pal'],
    playerClick: ['Let us talk', 'Hehe, hi', 'What are you doing?'],
    idleEmote: 'hum',
    nearbyEmote: 'hi',
    clickEmote: 'chat',
    socialEmote: 'chat',
    moods: ['curious', 'calm'],
    socialMood: 'curious',
    clickMood: 'chatty',
  },
  {
    id: 'sunny',
    label: 'sunny',
    idleExtra: ['Bright little pause', 'Warm smile'],
    nearbyExtra: ['Lovely to see you', 'Bright hello', 'You light the room'],
    clickExtra: ['This is the best', 'Hehe, what a hello', 'You made my day'],
    approachLines: ['Come say hi', 'Sunny little chat?', 'Over here, friend'],
    playerNear: ['So bright', 'Nice to see you', 'Sweet hello'],
    playerClick: ['Hi sunshine', 'Hehe', 'This feels nice'],
    idleEmote: 'hum',
    nearbyEmote: 'hi',
    clickEmote: 'giggle',
    socialEmote: 'chat',
    moods: ['sunny', 'welcoming'],
    socialMood: 'welcoming',
    clickMood: 'delighted',
  },
];

const hashString = (value = '') => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const getSeededIndex = (items, seed) => {
  if (!Array.isArray(items) || items.length === 0) {
    return 0;
  }

  return Math.abs(seed) % items.length;
};

const getRoomNpcPersonality = (personalityId) =>
  ROOM_NPC_PERSONALITIES.find((personality) => personality.id === personalityId)
  || ROOM_NPC_PERSONALITIES[0];

const createRoomNpcBehaviorState = (roomTheme, houseId, npcId) => {
  const seed = hashString(`${houseId || 'room'}:${roomTheme?.id || 'theme'}:${npcId}`);
  const personality = ROOM_NPC_PERSONALITIES[getSeededIndex(ROOM_NPC_PERSONALITIES, seed)];
  const moodSeed = hashString(`${seed}:mood`);
  const altMoodSeed = hashString(`${seed}:alt-mood`);
  const niceness = Number((0.62 + (seed % 27) / 100).toFixed(2));

  return {
    seed,
    personalityId: personality.id,
    baseMood: personality.moods[getSeededIndex(personality.moods, moodSeed)] || personality.moods[0],
    altMood: ROOM_NICE_MOODS[getSeededIndex(ROOM_NICE_MOODS, altMoodSeed)],
    niceness,
    proximityAttempts: 0,
    proximityOffset: 1 + (seed % 4),
    wasNearPlayer: false,
    cooldownUntil: 0,
    lastInteractionAt: -99999,
  };
};

const createRoomNpcBehaviorMap = (
  roomTheme,
  houseId,
  roomSeed = houseId || roomTheme?.id || 'room'
) =>
  Object.fromEntries(
    createRoomNpcBlueprints(roomTheme, roomSeed).map((npc) => [
      npc.id,
      createRoomNpcBehaviorState(roomTheme, houseId, npc.id),
    ])
  );

const getRoomNpcGreetingTarget = (npc, player, roomWidth, roomHeight) => {
  const walkBounds = getRoomWalkBounds(roomWidth, roomHeight, player.width, player.height);
  const npcCenter = getActorCenter(npc);
  const playerCenter = getActorCenter(player);
  const side = playerCenter.x <= npcCenter.x ? -1 : 1;

  return {
    x: clamp(
      npcCenter.x - player.width / 2 + side * 38,
      walkBounds.xMin,
      walkBounds.xMax
    ),
    y: clamp(
      npc.y + npc.height - player.height + 6,
      walkBounds.yMin,
      walkBounds.yMax
    ),
  };
};

const createInitialRoomRuntime = (roomWidth, roomHeight, roomTheme = null, houseId = 'room') => {
  const walkBounds = getRoomWalkBounds(
    roomWidth,
    roomHeight,
    PLAYER_ACTOR_SIZE.width,
    PLAYER_ACTOR_SIZE.height
  );
  const x = clamp(Math.round(roomWidth * 0.18), walkBounds.xMin, walkBounds.xMax);
  const y = clamp(
    Math.round(walkBounds.yMin + (walkBounds.yMax - walkBounds.yMin) * 0.38),
    walkBounds.yMin,
    walkBounds.yMax
  );

  return {
    timeMs: 0,
    player: {
      name: 'Little Unicorn',
      x,
      y,
      targetX: x,
      targetY: y,
      width: PLAYER_ACTOR_SIZE.width,
      height: PLAYER_ACTOR_SIZE.height,
      speed: PLAYER_ACTOR_SIZE.speed,
      facing: 1,
      focusNpcId: null,
    },
    npcBehaviorById: createRoomNpcBehaviorMap(roomTheme, houseId, houseId),
    interaction: null,
  };
};

const advanceRoomPlayer = (player, ms, roomWidth, roomHeight) => {
  if (!player) {
    return player;
  }

  const walkBounds = getRoomWalkBounds(roomWidth, roomHeight, player.width, player.height);
  const nextTargetX = clamp(player.targetX, walkBounds.xMin, walkBounds.xMax);
  const nextTargetY = clamp(player.targetY, walkBounds.yMin, walkBounds.yMax);
  const dx = nextTargetX - player.x;
  const dy = nextTargetY - player.y;
  const distance = Math.hypot(dx, dy);

  if (distance < 0.5) {
    return {
      ...player,
      x: nextTargetX,
      y: nextTargetY,
    };
  }

  const stepDistance = (player.speed ?? PLAYER_ACTOR_SIZE.speed) * (ms / 1000);
  if (distance <= stepDistance) {
    return {
      ...player,
      x: nextTargetX,
      y: nextTargetY,
      facing: dx < 0 ? -1 : dx > 0 ? 1 : player.facing,
    };
  }

  return {
    ...player,
    x: player.x + (dx / distance) * stepDistance,
    y: player.y + (dy / distance) * stepDistance,
    facing: dx < -0.5 ? -1 : dx > 0.5 ? 1 : player.facing,
  };
};

const advanceRoomRuntime = (
  runtime,
  ms,
  roomWidth,
  roomHeight,
  roomTheme = null,
  houseId = 'room'
) => {
  const nextTime = runtime.timeMs + ms;
  const roomSeed = houseId || roomTheme?.id || 'room';
  const npcs = getNpcActors(roomTheme, roomWidth, roomHeight, nextTime, roomSeed);
  const npcBehaviorById =
    runtime.npcBehaviorById || createRoomNpcBehaviorMap(roomTheme, roomSeed, roomSeed);
  let nextPlayer = runtime.player ? { ...runtime.player } : null;
  let nextInteraction = runtime.interaction ? { ...runtime.interaction } : null;
  const nextNpcBehaviorById = {};

  const getNpcById = (npcId) => npcs.find((npc) => npc.id === npcId) || null;

  if (nextPlayer && nextInteraction?.npcId && nextInteraction.source === 'click') {
    const focusNpc = getNpcById(nextInteraction.npcId);
    if (focusNpc) {
      const greetingTarget = getRoomNpcGreetingTarget(
        focusNpc,
        nextPlayer,
        roomWidth,
        roomHeight
      );
      nextPlayer = {
        ...nextPlayer,
        focusNpcId: focusNpc.id,
        targetX: greetingTarget.x,
        targetY: greetingTarget.y,
        facing: greetingTarget.x < nextPlayer.x ? -1 : 1,
      };
    }
  }

  nextPlayer = advanceRoomPlayer(nextPlayer, ms, roomWidth, roomHeight);

  if (nextInteraction?.npcId) {
    const focusNpc = getNpcById(nextInteraction.npcId);

    if (!focusNpc || !nextPlayer) {
      nextInteraction = null;
      if (nextPlayer) {
        nextPlayer = {
          ...nextPlayer,
          focusNpcId: null,
        };
      }
    } else {
      const distance = getActorDistance(nextPlayer, focusNpc);

      if (
        nextInteraction.phase === 'approach'
        && distance <= ROOM_SOCIAL_INTERACTION_DISTANCE
      ) {
        nextInteraction = {
          ...nextInteraction,
          phase: 'engaged',
          engagedAt: nextTime,
          endAt:
            nextTime
            + (nextInteraction.source === 'click'
              ? ROOM_SOCIAL_CLICK_DURATION_MS
              : ROOM_SOCIAL_NEAR_DURATION_MS),
        };
      } else if (
        nextInteraction.phase === 'engaged'
        && nextInteraction.endAt
        && nextTime >= nextInteraction.endAt
      ) {
        nextInteraction = null;
        nextPlayer = {
          ...nextPlayer,
          focusNpcId: null,
        };
      }
    }
  }

  let triggeredInteraction = nextInteraction;

  npcs.forEach((npc) => {
    const previousBehavior =
      npcBehaviorById[npc.id] || createRoomNpcBehaviorState(roomTheme, roomSeed, npc.id);
    const nearPlayer = getActorDistance(npc, nextPlayer) < ROOM_SOCIAL_NEAR_DISTANCE;
    const currentInteraction =
      triggeredInteraction && triggeredInteraction.npcId === npc.id ? triggeredInteraction : null;
    let nextBehavior = {
      ...previousBehavior,
      wasNearPlayer: nearPlayer,
    };

    if (currentInteraction) {
      nextBehavior.lastInteractionAt =
        currentInteraction.phase === 'engaged'
          ? currentInteraction.engagedAt ?? nextTime
          : nextBehavior.lastInteractionAt;
      nextBehavior.cooldownUntil = Math.max(
        nextBehavior.cooldownUntil,
        (currentInteraction.endAt || nextTime) + ROOM_SOCIAL_NEAR_COOLDOWN_MS
      );
    } else if (
      nearPlayer
      && !previousBehavior.wasNearPlayer
      && nextTime >= previousBehavior.cooldownUntil
    ) {
      const shouldInteract =
        ((previousBehavior.proximityAttempts + previousBehavior.proximityOffset) % 5) !== 0;
      nextBehavior.proximityAttempts = previousBehavior.proximityAttempts + 1;

      if (!triggeredInteraction && shouldInteract) {
        triggeredInteraction = {
          npcId: npc.id,
          source: 'nearby',
          phase: 'engaged',
          startedAt: nextTime,
          engagedAt: nextTime,
          endAt: nextTime + ROOM_SOCIAL_NEAR_DURATION_MS,
        };
        nextBehavior.lastInteractionAt = nextTime;
        nextBehavior.cooldownUntil =
          nextTime + ROOM_SOCIAL_NEAR_DURATION_MS + ROOM_SOCIAL_NEAR_COOLDOWN_MS;
      } else if (!shouldInteract) {
        nextBehavior.cooldownUntil = nextTime + ROOM_SOCIAL_MISS_COOLDOWN_MS;
      }
    }

    nextNpcBehaviorById[npc.id] = nextBehavior;
  });

  if (triggeredInteraction !== nextInteraction) {
    nextInteraction = triggeredInteraction;
    if (nextInteraction?.source === 'nearby' && nextPlayer) {
      nextPlayer = {
        ...nextPlayer,
        focusNpcId: null,
      };
    }
  }

  if (!nextInteraction && nextPlayer?.focusNpcId) {
    nextPlayer = {
      ...nextPlayer,
      focusNpcId: null,
    };
  }

  return {
    ...runtime,
    timeMs: nextTime,
    player: nextPlayer,
    npcBehaviorById: nextNpcBehaviorById,
    interaction: nextInteraction,
  };
};

const getNpcActors = (roomTheme, roomWidth, roomHeight, timeMs, roomSeed) => {
  const walkBounds = getRoomWalkBounds(
    roomWidth,
    roomHeight,
    NPC_ACTOR_SIZE.width,
    NPC_ACTOR_SIZE.height
  );
  const spanX = Math.max(1, walkBounds.xMax - walkBounds.xMin);
  const spanY = Math.max(1, walkBounds.yMax - walkBounds.yMin);

  return createRoomNpcBlueprints(roomTheme, roomSeed).map((npc) => {
    const angle = (timeMs / npc.periodMs) * Math.PI * 2 + npc.phase;
    const x = clamp(
      walkBounds.xMin + spanX * npc.anchor + Math.sin(angle) * spanX * npc.range,
      walkBounds.xMin,
      walkBounds.xMax
    );
    const y = clamp(
      walkBounds.yMin + spanY * npc.lane + Math.sin(angle * 1.7) * 3.5,
      walkBounds.yMin,
      walkBounds.yMax
    );

    return {
      ...npc,
      x,
      y,
      width: NPC_ACTOR_SIZE.width,
      height: NPC_ACTOR_SIZE.height,
      facing: Math.cos(angle) >= 0 ? 1 : -1,
      bobOffset: Math.sin(angle * 2.1) * 2.4,
    };
  });
};

const ROOM_SOCIAL_SCRIPTS = {
  default: {
    guide: {
      idle: ['Soft corners', 'Try a lamp', 'Sweet little nook'],
      greet: ['Hello, friend', 'Lovely room', 'Cozy choice'],
    },
    friend: {
      idle: ['So cozy', 'Look up high', 'Move that stool'],
      greet: ['Yay, you came', 'Play right here', 'Best corner'],
    },
  },
  'korean-garden': {
    guide: {
      idle: ['Lantern bridge', 'Tea path glow', 'Moon gate hush'],
      greet: ['Welcome, star', 'Bridge first', 'Tea nook ready'],
    },
    friend: {
      idle: ['Lanterns sway', 'Pond light sings', 'Bamboo hush'],
      greet: ['Meet by water', 'Soft bridge stop', 'Tea time corner'],
    },
  },
  'bavarian-castle': {
    guide: {
      idle: ['Tower glow', 'Banner hall', 'Castle nook'],
      greet: ['Welcome inside', 'Try the balcony', 'Window light'],
    },
    friend: {
      idle: ['Clouds drift', 'Velvet chair', 'Warm great hall'],
      greet: ['Castle party', 'Sit right here', 'Royal corner'],
    },
  },
  'spanish-palace': {
    guide: {
      idle: ['Courtyard glow', 'Fountain song', 'Tile shine'],
      greet: ['Palace hello', 'Archway first', 'Fountain path'],
    },
    friend: {
      idle: ['Orange light', 'Cool mosaic', 'Garden breeze'],
      greet: ['Dance this way', 'Bright courtyard', 'Lovely arches'],
    },
  },
  'mesoamerican-pyramid': {
    guide: {
      idle: ['Sun steps', 'Temple glow', 'Golden stairs'],
      greet: ['Climb with care', 'Sun gate waits', 'Torchlight path'],
    },
    friend: {
      idle: ['Warm stones', 'Jungle hush', 'Bright carvings'],
      greet: ['Look up there', 'Play by steps', 'Golden corner'],
    },
  },
  'grecoroman-circus': {
    guide: {
      idle: ['Marble ring', 'Laurel light', 'Circus arch'],
      greet: ['Grand hello', 'Center stage', 'Try the arena'],
    },
    friend: {
      idle: ['Garlands sway', 'Soft applause', 'Rose banners'],
      greet: ['Bravo, friend', 'Best seat here', 'Round and bright'],
    },
  },
  'scandinavian-longhouse': {
    guide: {
      idle: ['Fire circle', 'Snow window', 'Wood beam glow'],
      greet: ['Come get warm', 'Sit by fire', 'Longhouse light'],
    },
    friend: {
      idle: ['Cozy hearth', 'Shield wall', 'Soft fur bench'],
      greet: ['Warm nook here', 'Snow outside', 'Best seat yet'],
    },
  },
  'japanese-fortress': {
    guide: {
      idle: ['Shoji light', 'Bridge hush', 'Lantern bloom'],
      greet: ['Welcome softly', 'Cherry glow', 'Bridge first'],
    },
    friend: {
      idle: ['Blossoms drift', 'Quiet pond', 'Paper light'],
      greet: ['Play by lanterns', 'Softest nook', 'Bloom corner'],
    },
  },
  'babylonian-hanging-gardens': {
    guide: {
      idle: ['Garden tier', 'Water song', 'Vines above'],
      greet: ['Terrace hello', 'Try the pool', 'Flower path'],
    },
    friend: {
      idle: ['Vines shimmer', 'Petals fall', 'Cool terrace'],
      greet: ['Rest right here', 'Garden party', 'Best flower nook'],
    },
  },
  'future-sky-dome': {
    guide: {
      idle: ['Nova lights', 'Orbit bench', 'Dome glow'],
      greet: ['Star room ready', 'Try the console', 'Orbit path'],
    },
    friend: {
      idle: ['Soft starlight', 'City below', 'Halo lights'],
      greet: ['Sky party', 'Sit by stars', 'Best orbit nook'],
    },
  },
};

const getRoomSocialScript = (themeId) =>
  ROOM_SOCIAL_SCRIPTS[themeId] || ROOM_SOCIAL_SCRIPTS.default;

const getActorCenter = (actor) => ({
  x: actor.x + actor.width / 2,
  y: actor.y + actor.height / 2,
});

const getActorDistance = (left, right) => {
  if (!left || !right) {
    return Number.POSITIVE_INFINITY;
  }

  const leftCenter = getActorCenter(left);
  const rightCenter = getActorCenter(right);
  return Math.hypot(leftCenter.x - rightCenter.x, leftCenter.y - rightCenter.y);
};

const getRoomReactionLabel = (reactionType) => {
  switch (reactionType) {
    case 'glow':
      return 'soft glow';
    case 'flare':
      return 'bright flare';
    case 'twinkle':
      return 'table twinkle';
    case 'settle':
      return 'cozy settle';
    case 'bounce':
      return 'happy bounce';
    case 'sparkle':
      return 'bright sparkle';
    case 'flutter':
      return 'light flutter';
    case 'sway':
      return 'gentle sway';
    case 'hum':
    default:
      return 'warm hum';
  }
};

const ROOM_ITEM_REACTION_BEATS = {
  'jade-lantern': { beat: 'lantern-bloom', label: 'lantern bloom' },
  'paper-lantern': { beat: 'lantern-bloom', label: 'lantern bloom' },
  'banner-torch': { beat: 'banner-flare', label: 'banner flare' },
  'sun-torch': { beat: 'sun-flare', label: 'sun flare' },
  'hearth-torch': { beat: 'hearth-fire', label: 'hearth fire' },
  'halo-torch': { beat: 'halo-signal', label: 'halo signal' },
  'tea-floor-table': { beat: 'tea-steam', label: 'tea steam' },
  'starlight-console': { beat: 'console-scan', label: 'console scan' },
  'persimmon-fruit-plate': { beat: 'fruit-orbit', label: 'persimmon twinkle' },
  'citrus-fruit-plate': { beat: 'fruit-orbit', label: 'citrus twinkle' },
  'grape-fruit-plate': { beat: 'fruit-orbit', label: 'grape twinkle' },
  'royal-fruit-plate': { beat: 'fruit-orbit', label: 'royal twinkle' },
  'velvet-recliner': { beat: 'seat-sigh', label: 'velvet sigh' },
  'sun-recliner': { beat: 'seat-sigh', label: 'sun lounge sigh' },
  'marble-chaise': { beat: 'seat-sigh', label: 'marble sigh' },
  'garden-recliner': { beat: 'seat-sigh', label: 'garden sigh' },
  'orbit-recliner': { beat: 'orbit-drift', label: 'orbit drift' },
  'stone-stool': { beat: 'stool-hop', label: 'stone hop' },
  'wooden-stool': { beat: 'stool-hop', label: 'hearth hop' },
  'lacquer-stool': { beat: 'stool-hop', label: 'lacquer hop' },
  'tile-bench': { beat: 'bench-thrum', label: 'courtyard thrum' },
  'timber-bench': { beat: 'bench-thrum', label: 'timber thrum' },
  'carved-chest': { beat: 'story-chime', label: 'story chime' },
  'hanging-vine-planter': { beat: 'vine-song', label: 'vine song' },
};

const ROOM_ITEM_DEFAULT_BEATS = {
  lantern: { beat: 'lantern-sway', label: 'lantern sway' },
  torch: { beat: 'ember-flare', label: 'ember flare' },
  table: { beat: 'table-hum', label: 'table hum' },
  plate: { beat: 'fruit-orbit', label: 'fruit twinkle' },
  recliner: { beat: 'seat-sigh', label: 'cushion sigh' },
  cushion: { beat: 'seat-sigh', label: 'cushion puff' },
  stool: { beat: 'stool-hop', label: 'stool hop' },
  bench: { beat: 'bench-thrum', label: 'bench thrum' },
  chest: { beat: 'lock-glint', label: 'lock glint' },
  planter: { beat: 'vine-song', label: 'vine song' },
  vase: { beat: 'vine-song', label: 'vase sway' },
  fountain: { beat: 'tea-steam', label: 'water shimmer' },
  gem: { beat: 'gem-spark', label: 'gem spark' },
  shelf: { beat: 'table-hum', label: 'shelf glint' },
};

const getRoomItemReactionBeat = (item) =>
  ROOM_ITEM_REACTION_BEATS[item.typeId]
  || ROOM_ITEM_DEFAULT_BEATS[item.type]
  || { beat: 'room-hum', label: 'room hum' };

const getCycleItem = (items, timeMs, periodMs, phase = 0) => {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  const rawIndex = Math.floor(timeMs / periodMs + phase);
  const index = ((rawIndex % items.length) + items.length) % items.length;
  return items[index] ?? items[0] ?? null;
};

const getRoomNpcDisplayMood = (behavior, personality, timeMs, interactionState, nearPlayer, speechWindow) => {
  const driftMood =
    Math.floor((timeMs + behavior.seed) / 7200) % 2 === 0
      ? behavior.baseMood
      : behavior.altMood;

  if (interactionState?.source === 'click') {
    return interactionState.phase === 'approach' ? 'expectant' : personality.clickMood;
  }

  if (interactionState) {
    return personality.socialMood;
  }

  if (nearPlayer) {
    return driftMood;
  }

  if (speechWindow) {
    return personality.socialMood;
  }

  return driftMood;
};

const getRoomNpcSpeechState = (
  personality,
  actorScript,
  interactionState,
  speechWindow,
  timeMs,
  phaseOffset
) => {
  const idleLines = [...actorScript.idle, ...personality.idleExtra];
  const nearbyLines = [...actorScript.greet, ...personality.nearbyExtra];
  const clickLines = [...personality.clickExtra, ...actorScript.greet];

  if (interactionState?.source === 'click') {
    return {
      speechText:
        interactionState.phase === 'approach'
          ? getCycleItem(personality.approachLines, timeMs, 1500, phaseOffset)
          : getCycleItem(clickLines, timeMs, 1380, phaseOffset),
      emote:
        interactionState.phase === 'approach'
          ? personality.nearbyEmote
          : personality.clickEmote,
    };
  }

  if (interactionState) {
    return {
      speechText: getCycleItem(nearbyLines, timeMs, 1620, phaseOffset),
      emote: personality.socialEmote,
    };
  }

  if (speechWindow) {
    return {
      speechText: getCycleItem(idleLines, timeMs, 2200, phaseOffset),
      emote: personality.idleEmote,
    };
  }

  return {
    speechText: null,
    emote: null,
  };
};

const buildRoomSocialState = (
  runtime,
  roomTheme,
  roomWidth,
  roomHeight,
  roomSeed = roomTheme?.id || 'room'
) => {
  const player = runtime.player || null;
  const stableRoomSeed = roomSeed || roomTheme?.id || 'room';
  const npcBehaviorById =
    runtime.npcBehaviorById
    || createRoomNpcBehaviorMap(roomTheme, stableRoomSeed, stableRoomSeed);
  const npcs = getNpcActors(roomTheme, roomWidth, roomHeight, runtime.timeMs, stableRoomSeed);
  const script = getRoomSocialScript(roomTheme?.id);
  const interactionState = runtime.interaction || null;
  const playerIsMoving = player
    ? Math.abs(player.targetX - player.x) > 1 || Math.abs(player.targetY - player.y) > 1
    : false;

  const socialNpcs = npcs.map((npc, index) => {
    const behavior =
      npcBehaviorById[npc.id]
      || createRoomNpcBehaviorState(roomTheme, stableRoomSeed, npc.id);
    const personality = getRoomNpcPersonality(behavior.personalityId);
    const actorScript = npc.id === 'npc-guide' ? script.guide : script.friend;
    const nearPlayer = getActorDistance(npc, player) < ROOM_SOCIAL_NEAR_DISTANCE;
    const activeNpcInteraction =
      interactionState && interactionState.npcId === npc.id ? interactionState : null;
    const speechWindow =
      !interactionState
      && ((runtime.timeMs + index * 1100 + (behavior.seed % 900)) % 6400) < 2300;
    const { speechText, emote } = getRoomNpcSpeechState(
      personality,
      actorScript,
      activeNpcInteraction,
      speechWindow,
      runtime.timeMs,
      index * 0.55 + (behavior.seed % 7) * 0.07
    );
    const mood = getRoomNpcDisplayMood(
      behavior,
      personality,
      runtime.timeMs,
      activeNpcInteraction,
      nearPlayer,
      speechWindow
    );

    return {
      ...npc,
      mood,
      emote,
      speechText,
      bubbleTone: npc.accentColor,
      nearPlayer,
      personality: personality.label,
      personalityId: personality.id,
      niceness: behavior.niceness,
      interactionChance: ROOM_SOCIAL_AUTO_INTERACTION_CHANCE,
      interactionMode: activeNpcInteraction
        ? `${activeNpcInteraction.source}:${activeNpcInteraction.phase}`
        : null,
    };
  });

  const nearestNpc = socialNpcs.reduce(
    (closest, npc) => {
      const distance = getActorDistance(player, npc);
      if (!closest || distance < closest.distance) {
        return { npc, distance };
      }
      return closest;
    },
    null
  );
  const activeNpc = interactionState
    ? socialNpcs.find((npc) => npc.id === interactionState.npcId) || null
    : null;
  const activePersonality = activeNpc
    ? getRoomNpcPersonality(activeNpc.personalityId)
    : null;

  const playerNearNpc = Boolean(nearestNpc && nearestNpc.distance < ROOM_SOCIAL_NEAR_DISTANCE);
  const playerSpeechWindow = !playerNearNpc && ((runtime.timeMs + 900) % 7600) < 2100;
  const playerSpeechText = interactionState?.source === 'click'
    ? interactionState.phase === 'approach'
      ? getCycleItem(['Coming over', 'Tiny hello', 'On my way'], runtime.timeMs, 1500, 0.2)
      : getCycleItem(
          activePersonality?.playerClick || ['Hehe', 'Hi there', 'Let us chat'],
          runtime.timeMs,
          1400,
          0.2
        )
    : interactionState
      ? getCycleItem(
          activePersonality?.playerNear || ['Hi friend', 'Cute room', 'Happy hello'],
          runtime.timeMs,
          1500,
          0.2
        )
      : playerIsMoving
        ? getCycleItem(
            ['This way', 'Tiny steps', 'Nearly there'],
            runtime.timeMs,
            1900,
            0.1
          )
        : playerSpeechWindow
          ? getCycleItem(['So pretty', 'Dreamy room', 'More sparkle'], runtime.timeMs, 2100, 0.15)
          : null;

  const socialPlayer = player
    ? {
        ...player,
        mood: interactionState?.source === 'click'
          ? interactionState.phase === 'approach'
            ? 'curious'
            : 'playful'
          : interactionState
            ? 'visiting'
            : playerNearNpc
              ? 'visiting'
              : playerIsMoving
                ? 'exploring'
                : 'daydreaming',
        emote: interactionState?.source === 'click'
          ? interactionState.phase === 'approach'
            ? 'hi'
            : activePersonality?.clickEmote || 'giggle'
          : interactionState
            ? activePersonality?.socialEmote || 'chat'
            : playerNearNpc
              ? 'hi'
              : playerIsMoving
                ? 'go'
                : playerSpeechWindow
                  ? '...'
                  : null,
        speechText: playerSpeechText,
        bubbleTone: roomTheme?.accent || '#f472b6',
      }
    : null;

  const fallbackNpc = socialNpcs.find((npc) => npc.speechText) || null;
  const activeLine = interactionState && activeNpc?.speechText
    ? (() => {
        const playerTurn =
          interactionState.phase === 'engaged'
          && socialPlayer?.speechText
          && Math.floor(runtime.timeMs / 900) % 2 === 1;

        return playerTurn
          ? {
              speaker: socialPlayer.name,
              text: socialPlayer.speechText,
              mood: socialPlayer.mood,
              source: 'player',
            }
          : {
              speaker: activeNpc.name,
              text: activeNpc.speechText,
              mood: activeNpc.mood,
              source: 'npc',
            };
      })()
    : fallbackNpc
      ? {
          speaker: fallbackNpc.name,
          text: fallbackNpc.speechText,
          mood: fallbackNpc.mood,
          source: 'npc',
        }
      : socialPlayer?.speechText
        ? {
            speaker: socialPlayer.name,
            text: socialPlayer.speechText,
            mood: socialPlayer.mood,
            source: 'player',
          }
        : null;
  const roomResponse = buildRoomPropResponse(
    roomTheme,
    {
      player: socialPlayer,
      npcs: socialNpcs,
      social: {
        activeLine,
      },
    },
    runtime.timeMs
  );

  return {
    timeMs: runtime.timeMs,
    player: socialPlayer,
    npcs: socialNpcs,
    social: {
      activeLine,
      roomResponse,
      interaction: interactionState && activeNpc
        ? {
            npcId: activeNpc.id,
            npcName: activeNpc.name,
            source: interactionState.source,
            phase: interactionState.phase,
            personality: activeNpc.personality,
            niceness: activeNpc.niceness,
            triggerChance:
              interactionState.source === 'nearby'
                ? ROOM_SOCIAL_AUTO_INTERACTION_CHANCE
                : 1,
          }
        : null,
    },
  };
};

const buildRoomReactionState = (roomItems, socialState, roomTheme) => {
  const activeActors = [socialState.player, ...socialState.npcs].filter(
    (actor) => actor && (actor.speechText || actor.emote)
  );

  const reactiveItems = roomItems
    .map((item, index) => {
      const maxDistance =
        ROOM_ITEM_REACTION_DISTANCE + Math.min(18, Math.round((item.width + item.height) / 10));
      const closestActor = activeActors.reduce((closest, actor) => {
        const distance = getActorDistance(actor, item);
        if (!closest || distance < closest.distance) {
          return { actor, distance };
        }
        return closest;
      }, null);

      if (!closestActor || closestActor.distance > maxDistance) {
        return null;
      }

      const intensity = clamp(1 - closestActor.distance / maxDistance, 0.18, 1);
      const reaction = ROOM_ITEM_REACTION_TYPES[item.type] || 'hum';
      const reactionBeat = getRoomItemReactionBeat(item);

      return {
        id: item.id,
        name: item.name,
        typeId: item.typeId,
        type: item.type,
        reaction,
        reactionLabel: getRoomReactionLabel(reaction),
        beat: reactionBeat.beat,
        beatLabel: reactionBeat.label,
        speaker: closestActor.actor.name,
        mood: closestActor.actor.mood || null,
        tone:
          closestActor.actor.bubbleTone
          || closestActor.actor.accentColor
          || roomTheme?.accent
          || '#f472b6',
        intensity: Number(intensity.toFixed(2)),
        distance: Math.round(closestActor.distance),
        phaseSeed: Number((index * 0.63 + item.x * 0.011 + item.y * 0.007).toFixed(2)),
      };
    })
    .filter(Boolean)
    .sort((left, right) => right.intensity - left.intensity || left.distance - right.distance);

  const leadReaction = reactiveItems[0] || null;

  return {
    reactiveItems,
    activeItemIds: reactiveItems.map((item) => item.id),
    activeReaction: leadReaction
      ? {
          speaker: leadReaction.speaker,
          itemId: leadReaction.id,
          itemName: leadReaction.name,
          reaction: leadReaction.reaction,
          reactionLabel: leadReaction.reactionLabel,
          beat: leadReaction.beat,
          beatLabel: leadReaction.beatLabel,
          intensity: leadReaction.intensity,
          count: reactiveItems.length,
        }
      : null,
  };
};

const buildRoomRuntimeSnapshot = (socialState, roomReactionState, roomTheme) => ({
  timeMs: socialState.timeMs,
  player: socialState.player
    ? {
        name: socialState.player.name,
        x: Math.round(socialState.player.x),
        y: Math.round(socialState.player.y),
        targetX: Math.round(socialState.player.targetX),
        targetY: Math.round(socialState.player.targetY),
        width: socialState.player.width,
        height: socialState.player.height,
        facing: socialState.player.facing,
        focusNpcId: socialState.player.focusNpcId || null,
        mood: socialState.player.mood,
        emote: socialState.player.emote,
        speechText: socialState.player.speechText,
      }
    : null,
  npcs: socialState.npcs.map((npc) => {
    const artProfile = getRoomNpcArtProfile(roomTheme?.id, npc);

    return {
      id: npc.id,
      name: npc.name,
      x: Math.round(npc.x),
      y: Math.round(npc.y),
      width: npc.width,
      height: npc.height,
      facing: npc.facing,
      mood: npc.mood,
      emote: npc.emote,
      speechText: npc.speechText,
      nearPlayer: npc.nearPlayer,
      personality: npc.personality,
      niceness: npc.niceness,
      interactionChance: npc.interactionChance,
      interactionMode: npc.interactionMode,
      species: artProfile.species,
      accessory: artProfile.accessory,
    };
  }),
  social: socialState.social,
  reactiveItems: roomReactionState.reactiveItems.map((item) => ({
    id: item.id,
    name: item.name,
    typeId: item.typeId,
    type: item.type,
    reaction: item.reaction,
    reactionLabel: item.reactionLabel,
    beat: item.beat,
    beatLabel: item.beatLabel,
    speaker: item.speaker,
    mood: item.mood,
    intensity: item.intensity,
    distance: item.distance,
  })),
  roomReaction: roomReactionState.activeReaction,
});

const getRoomItemReactionMotion = (reaction, timeMs) => {
  if (!reaction) {
    return {
      translateY: 0,
      rotateDeg: 0,
      scale: 1,
      auraOpacity: 0,
    };
  }

  const phase = timeMs / 240 + reaction.phaseSeed;
  const wave = Math.sin(phase);
  const bounce = Math.abs(Math.sin(phase * 1.2));

  switch (reaction.beat) {
    case 'lantern-bloom':
      return {
        translateY: Number((-2.1 * reaction.intensity * (0.55 + bounce)).toFixed(2)),
        rotateDeg: Number((wave * 1.9 * reaction.intensity).toFixed(2)),
        scale: Number((1 + (wave * 0.5 + 0.5) * reaction.intensity * 0.038).toFixed(3)),
        auraOpacity: Number((0.26 + (wave * 0.5 + 0.5) * 0.24).toFixed(3)),
      };
    case 'hearth-fire':
    case 'sun-flare':
    case 'banner-flare':
    case 'halo-signal':
      return {
        translateY: Number((-1.4 * reaction.intensity * (wave * 0.5 + 0.5)).toFixed(2)),
        rotateDeg: Number((wave * 0.9 * reaction.intensity).toFixed(2)),
        scale: Number((1 + bounce * reaction.intensity * 0.032).toFixed(3)),
        auraOpacity: Number((0.24 + bounce * 0.24).toFixed(3)),
      };
    case 'tea-steam':
      return {
        translateY: Number((-1.8 * reaction.intensity * (wave * 0.5 + 0.5)).toFixed(2)),
        rotateDeg: Number((wave * 0.5 * reaction.intensity).toFixed(2)),
        scale: Number((1 + reaction.intensity * 0.018).toFixed(3)),
        auraOpacity: Number((0.18 + (wave * 0.5 + 0.5) * 0.14).toFixed(3)),
      };
    case 'console-scan':
      return {
        translateY: 0,
        rotateDeg: 0,
        scale: Number((1 + (wave * 0.5 + 0.5) * reaction.intensity * 0.012).toFixed(3)),
        auraOpacity: Number((0.2 + (wave * 0.5 + 0.5) * 0.18).toFixed(3)),
      };
    case 'vine-song':
      return {
        translateY: Number((-2.6 * reaction.intensity * (0.45 + bounce)).toFixed(2)),
        rotateDeg: Number((wave * 3.8 * reaction.intensity).toFixed(2)),
        scale: Number((1 + reaction.intensity * 0.024).toFixed(3)),
        auraOpacity: Number((0.18 + bounce * 0.16).toFixed(3)),
      };
    case 'gem-spark':
      return {
        translateY: Number((-1.3 * reaction.intensity * (wave * 0.5 + 0.5)).toFixed(2)),
        rotateDeg: 0,
        scale: Number((1 + (wave * 0.5 + 0.5) * reaction.intensity * 0.034).toFixed(3)),
        auraOpacity: Number((0.24 + (wave * 0.5 + 0.5) * 0.2).toFixed(3)),
      };
    case 'fruit-orbit':
      return {
        translateY: Number((-1.2 * reaction.intensity * (wave * 0.5 + 0.5)).toFixed(2)),
        rotateDeg: Number((wave * 1.2 * reaction.intensity).toFixed(2)),
        scale: Number((1 + (wave * 0.5 + 0.5) * reaction.intensity * 0.025).toFixed(3)),
        auraOpacity: Number((0.2 + (wave * 0.5 + 0.5) * 0.18).toFixed(3)),
      };
    case 'seat-sigh':
      return {
        translateY: Number((-1.8 * reaction.intensity * (wave * 0.5 + 0.5)).toFixed(2)),
        rotateDeg: Number((wave * 0.7 * reaction.intensity).toFixed(2)),
        scale: Number((1 + reaction.intensity * 0.018 + bounce * reaction.intensity * 0.014).toFixed(3)),
        auraOpacity: Number((0.16 + (wave * 0.5 + 0.5) * 0.14).toFixed(3)),
      };
    case 'orbit-drift':
      return {
        translateY: Number((-2 * reaction.intensity * (wave * 0.5 + 0.5)).toFixed(2)),
        rotateDeg: Number((wave * 1.4 * reaction.intensity).toFixed(2)),
        scale: Number((1 + reaction.intensity * 0.02 + (wave * 0.5 + 0.5) * reaction.intensity * 0.015).toFixed(3)),
        auraOpacity: Number((0.18 + (wave * 0.5 + 0.5) * 0.18).toFixed(3)),
      };
    case 'stool-hop':
    case 'bench-thrum':
      return {
        translateY: Number((-3.2 * reaction.intensity * bounce).toFixed(2)),
        rotateDeg: Number((wave * 1.1 * reaction.intensity).toFixed(2)),
        scale: Number((1 + bounce * reaction.intensity * 0.028).toFixed(3)),
        auraOpacity: Number((0.16 + bounce * 0.16).toFixed(3)),
      };
    case 'story-chime':
    case 'lock-glint':
      return {
        translateY: Number((-1 * reaction.intensity * (wave * 0.5 + 0.5)).toFixed(2)),
        rotateDeg: Number((wave * 0.6 * reaction.intensity).toFixed(2)),
        scale: Number((1 + reaction.intensity * 0.014).toFixed(3)),
        auraOpacity: Number((0.18 + (wave * 0.5 + 0.5) * 0.16).toFixed(3)),
      };
    default:
      break;
  }

  switch (reaction.reaction) {
    case 'sway':
      return {
        translateY: Number((-2.4 * reaction.intensity * (0.35 + bounce)).toFixed(2)),
        rotateDeg: Number((wave * 3.2 * reaction.intensity).toFixed(2)),
        scale: Number((1 + reaction.intensity * 0.028).toFixed(3)),
        auraOpacity: Number((0.18 + bounce * 0.18).toFixed(3)),
      };
    case 'bounce':
      return {
        translateY: Number((-4.4 * reaction.intensity * bounce).toFixed(2)),
        rotateDeg: Number((wave * 1.4 * reaction.intensity).toFixed(2)),
        scale: Number((1 + bounce * reaction.intensity * 0.035).toFixed(3)),
        auraOpacity: Number((0.16 + bounce * 0.14).toFixed(3)),
      };
    case 'flutter':
      return {
        translateY: Number((-1.6 * reaction.intensity * (wave * 0.5 + 0.5)).toFixed(2)),
        rotateDeg: Number((wave * 2.6 * reaction.intensity).toFixed(2)),
        scale: Number((1 + reaction.intensity * 0.02).toFixed(3)),
        auraOpacity: Number((0.18 + (wave * 0.5 + 0.5) * 0.14).toFixed(3)),
      };
    case 'sparkle':
    case 'glow':
    case 'flare':
    case 'twinkle':
      return {
        translateY: Number((-1.2 * reaction.intensity * (wave * 0.5 + 0.5)).toFixed(2)),
        rotateDeg: 0,
        scale: Number((1 + (wave * 0.5 + 0.5) * reaction.intensity * 0.03).toFixed(3)),
        auraOpacity: Number((0.22 + (wave * 0.5 + 0.5) * 0.22).toFixed(3)),
      };
    case 'settle':
    case 'hum':
    default:
      return {
        translateY: Number((-1.4 * reaction.intensity * (wave * 0.5 + 0.5)).toFixed(2)),
        rotateDeg: Number((wave * 0.8 * reaction.intensity).toFixed(2)),
        scale: Number((1 + reaction.intensity * 0.016).toFixed(3)),
        auraOpacity: Number((0.14 + (wave * 0.5 + 0.5) * 0.12).toFixed(3)),
      };
  }
};

const RoomFurnitureReactionLayer = ({ item, reaction, timeMs }) => {
  if (!reaction) {
    return null;
  }

  const phase = timeMs / 220 + reaction.phaseSeed;
  const wave = (Math.sin(phase) + 1) / 2;
  const rise = (Math.sin(phase * 1.35) + 1) / 2;
  const sharedStyle = {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
  };

  if (reaction.beat === 'lantern-bloom' || reaction.beat === 'lantern-sway') {
    return (
      <div style={sharedStyle}>
        {[0, 1].map((index) => (
          <div
            key={`${item.id}-lantern-ring-${index}`}
            style={{
              position: 'absolute',
              left: `${22 - index * 4}%`,
              right: `${22 - index * 4}%`,
              top: `${12 - index * 4}%`,
              bottom: `${28 - index * 2}%`,
              borderRadius: 24 + index * 6,
              border: `2px solid ${reaction.tone}${index === 0 ? '88' : '44'}`,
              opacity: 0.18 + wave * 0.26 - index * 0.08,
              transform: `scale(${1 + wave * 0.08 + index * 0.04})`,
            }}
          />
        ))}
        {[20, 50, 78].map((left, index) => (
          <div
            key={`${item.id}-lantern-dust-${left}`}
            style={{
              position: 'absolute',
              left: `${left}%`,
              top: `${18 + index * 10}%`,
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: index === 1 ? item.color : reaction.tone,
              opacity: 0.26 + rise * 0.34,
              transform: `translate(-50%, ${-6 - rise * 10 - index * 3}px) scale(${0.85 + wave * 0.4})`,
              boxShadow: `0 0 10px ${reaction.tone}88`,
            }}
          />
        ))}
      </div>
    );
  }

  if (
    reaction.beat === 'banner-flare'
    || reaction.beat === 'sun-flare'
    || reaction.beat === 'hearth-fire'
    || reaction.beat === 'halo-signal'
    || reaction.beat === 'ember-flare'
  ) {
    const flareColor = reaction.beat === 'halo-signal' ? '#b7e6ff' : '#fff3b0';

    return (
      <div style={sharedStyle}>
        <div
          style={{
            position: 'absolute',
            left: '26%',
            right: '26%',
            top: '2%',
            height: '34%',
            borderRadius: '50% 50% 42% 42%',
            background: `radial-gradient(circle at 50% 26%, #ffffff 0%, ${flareColor} 44%, ${reaction.tone} 100%)`,
            opacity: 0.24 + wave * 0.34,
            transform: `scale(${0.92 + wave * 0.2}) translateY(${-2 - wave * 2}px)`,
            filter: 'blur(1px)',
          }}
        />
        {[16, 44, 72].map((left, index) => (
          <div
            key={`${item.id}-ember-${left}`}
            style={{
              position: 'absolute',
              left: `${left}%`,
              top: `${10 + index * 8}%`,
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: index === 1 ? '#fff8d8' : reaction.tone,
              opacity: 0.16 + rise * 0.34,
              transform: `translate(-50%, ${-8 - rise * 18 - index * 4}px) scale(${0.8 + wave * 0.35})`,
            }}
          />
        ))}
      </div>
    );
  }

  if (reaction.beat === 'tea-steam') {
    return (
      <div style={sharedStyle}>
        {[24, 44, 64].map((left, index) => (
          <div
            key={`${item.id}-steam-${left}`}
            style={{
              position: 'absolute',
              left: `${left}%`,
              bottom: '42%',
              width: 12,
              height: '34%',
              borderRadius: 999,
              border: `2px solid ${reaction.tone}`,
              borderLeft: 'none',
              borderBottom: 'none',
              opacity: 0.12 + wave * 0.22,
              transform: `translate(-50%, ${-4 - rise * 18 - index * 3}px) rotate(${index === 1 ? 0 : index === 0 ? -16 : 16}deg)`,
            }}
          />
        ))}
      </div>
    );
  }

  if (reaction.beat === 'console-scan') {
    return (
      <div style={sharedStyle}>
        <div
          style={{
            position: 'absolute',
            left: '10%',
            right: '10%',
            top: `${18 + wave * 14}%`,
            height: '16%',
            borderRadius: 10,
            background: `linear-gradient(90deg, transparent 0%, ${reaction.tone}44 26%, ${reaction.tone}aa 50%, ${reaction.tone}44 74%, transparent 100%)`,
            opacity: 0.28 + wave * 0.32,
            boxShadow: `0 0 12px ${reaction.tone}66`,
          }}
        />
        {[18, 40, 62, 80].map((left, index) => (
          <div
            key={`${item.id}-console-node-${left}`}
            style={{
              position: 'absolute',
              left: `${left}%`,
              top: `${56 + (index % 2) * 8}%`,
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: index % 2 === 0 ? item.color : reaction.tone,
              opacity: 0.22 + ((index + Math.round(wave * 4)) % 2 === 0 ? 0.48 : 0.12),
              boxShadow: `0 0 10px ${reaction.tone}88`,
            }}
          />
        ))}
      </div>
    );
  }

  if (reaction.beat === 'vine-song') {
    return (
      <div style={sharedStyle}>
        {[26, 48, 70].map((left, index) => (
          <div
            key={`${item.id}-vine-song-${left}`}
            style={{
              position: 'absolute',
              left: `${left}%`,
              top: `${6 + index * 4}%`,
              width: 12,
              height: '54%',
              borderRadius: 999,
              background: index === 1 ? item.accent : item.color,
              opacity: 0.18 + wave * 0.18,
              transform: `translateX(-50%) rotate(${(index - 1) * 7 + Math.sin(phase + index) * 7}deg)`,
              transformOrigin: 'top center',
            }}
          />
        ))}
        {[18, 52, 78].map((left, index) => (
          <div
            key={`${item.id}-vine-bloom-${left}`}
            style={{
              position: 'absolute',
              left: `${left}%`,
              top: `${20 + index * 12}%`,
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: index === 1 ? '#fff5d8' : reaction.tone,
              opacity: 0.16 + rise * 0.28,
              transform: `translate(-50%, ${-2 - rise * 6}px) scale(${0.8 + wave * 0.35})`,
            }}
          />
        ))}
      </div>
    );
  }

  if (reaction.beat === 'gem-spark') {
    return (
      <div style={sharedStyle}>
        {[0, 1, 2].map((index) => (
          <div
            key={`${item.id}-gem-spark-${index}`}
            style={{
              position: 'absolute',
              left: `${22 + index * 24}%`,
              top: `${14 + index * 10}%`,
              width: 10,
              height: 10,
              borderRadius: 3,
              background: index === 1 ? '#ffffff' : reaction.tone,
              opacity: 0.18 + wave * 0.34,
              transform: `translate(-50%, ${-3 - rise * 8}px) rotate(${45 + index * 12}deg) scale(${0.8 + wave * 0.4})`,
            }}
          />
        ))}
      </div>
    );
  }

  if (reaction.beat === 'fruit-orbit') {
    return (
      <div style={sharedStyle}>
        {[0, 1, 2].map((index) => {
          const angle = phase + index * ((Math.PI * 2) / 3);
          const orbitX = Math.cos(angle) * 16;
          const orbitY = Math.sin(angle) * 7;

          return (
            <div
              key={`${item.id}-fruit-orbit-${index}`}
              style={{
                position: 'absolute',
                left: '50%',
                top: '38%',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: index === 1 ? '#fff7da' : reaction.tone,
                opacity: 0.2 + wave * 0.28,
                boxShadow: `0 0 10px ${reaction.tone}88`,
                transform: `translate(${orbitX}px, ${orbitY - 4}px) scale(${0.8 + wave * 0.28})`,
              }}
            />
          );
        })}
      </div>
    );
  }

  if (reaction.beat === 'seat-sigh' || reaction.beat === 'orbit-drift') {
    return (
      <div style={sharedStyle}>
        <div
          style={{
            position: 'absolute',
            left: '18%',
            right: '18%',
            top: reaction.beat === 'orbit-drift' ? '8%' : '22%',
            height: reaction.beat === 'orbit-drift' ? '62%' : '26%',
            borderRadius: reaction.beat === 'orbit-drift' ? '50%' : 18,
            border: `2px solid ${reaction.tone}66`,
            opacity: 0.16 + wave * 0.2,
            transform:
              reaction.beat === 'orbit-drift'
                ? `rotate(${phase * 12}deg) scale(${0.94 + wave * 0.08})`
                : `scale(${0.96 + wave * 0.04})`,
          }}
        />
        {[0, 1].map((index) => (
          <div
            key={`${item.id}-seat-sigh-${index}`}
            style={{
              position: 'absolute',
              left: `${24 + index * 24}%`,
              top: `${42 + index * 8}%`,
              width: '24%',
              height: '10%',
              borderRadius: 999,
              background: `${reaction.tone}${index === 0 ? '40' : '24'}`,
              opacity: 0.18 + wave * 0.16,
              transform: `translateY(${-2 - rise * 5 - index * 2}px)`,
            }}
          />
        ))}
      </div>
    );
  }

  if (reaction.beat === 'stool-hop' || reaction.beat === 'bench-thrum') {
    return (
      <div style={sharedStyle}>
        {[0, 1].map((index) => (
          <div
            key={`${item.id}-bench-thrum-${index}`}
            style={{
              position: 'absolute',
              left: `${18 + index * 26}%`,
              right: `${18 + (1 - index) * 14}%`,
              bottom: `${8 + index * 10}%`,
              height: 10,
              borderRadius: 999,
              border: `2px solid ${reaction.tone}${index === 0 ? '88' : '55'}`,
              opacity: 0.14 + rise * 0.24 - index * 0.04,
              transform: `scale(${1 + rise * 0.08 + index * 0.04})`,
            }}
          />
        ))}
      </div>
    );
  }

  if (reaction.beat === 'story-chime' || reaction.beat === 'lock-glint') {
    return (
      <div style={sharedStyle}>
        <div
          style={{
            position: 'absolute',
            left: '48%',
            top: '20%',
            width: 6,
            height: '48%',
            borderRadius: 999,
            background: `linear-gradient(180deg, transparent 0%, ${reaction.tone} 50%, transparent 100%)`,
            opacity: 0.18 + wave * 0.32,
            transform: `translateX(-50%) scaleY(${0.8 + wave * 0.28})`,
            boxShadow: `0 0 10px ${reaction.tone}88`,
          }}
        />
        {[22, 50, 78].map((left, index) => (
          <div
            key={`${item.id}-story-chime-${left}`}
            style={{
              position: 'absolute',
              left: `${left}%`,
              top: `${18 + index * 10}%`,
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: index === 1 ? '#fff7d6' : reaction.tone,
              opacity: 0.16 + rise * 0.26,
              transform: `translate(-50%, ${-4 - rise * 10 - index * 2}px) scale(${0.82 + wave * 0.24})`,
            }}
          />
        ))}
      </div>
    );
  }

  return null;
};

const ROOM_REACTION_PRESETS = {
  'korean-garden': {
    activeProps: ['lanterns', 'pond'],
    nodes: [
      {
        kind: 'glow',
        left: '18%',
        top: '19%',
        width: 70,
        height: 70,
        fill:
          'radial-gradient(circle at 50% 50%, rgba(255,244,201,0.98) 0%, rgba(244,180,87,0.48) 48%, rgba(244,180,87,0) 100%)',
      },
      {
        kind: 'glow',
        left: '84%',
        top: '23%',
        width: 70,
        height: 70,
        fill:
          'radial-gradient(circle at 50% 50%, rgba(255,244,201,0.98) 0%, rgba(244,180,87,0.48) 48%, rgba(244,180,87,0) 100%)',
      },
      {
        kind: 'glow',
        left: '78%',
        bottom: '8%',
        width: 220,
        height: 96,
        fill:
          'radial-gradient(circle at 50% 50%, rgba(180,245,255,0.72) 0%, rgba(109,186,202,0.26) 58%, rgba(109,186,202,0) 100%)',
      },
    ],
  },
  'bavarian-castle': {
    activeProps: ['windows', 'banner glow'],
    nodes: [
      {
        kind: 'glow',
        left: '50%',
        top: '28%',
        width: 260,
        height: 130,
        fill:
          'radial-gradient(circle at 50% 50%, rgba(238,244,255,0.92) 0%, rgba(217,203,255,0.32) 56%, rgba(217,203,255,0) 100%)',
      },
      {
        kind: 'beam',
        left: '49%',
        top: '16%',
        width: 200,
        height: 56,
        fill:
          'linear-gradient(90deg, rgba(217,95,132,0) 0%, rgba(217,95,132,0.46) 50%, rgba(217,95,132,0) 100%)',
      },
    ],
  },
  'spanish-palace': {
    activeProps: ['fountain', 'courtyard lamps'],
    nodes: [
      {
        kind: 'glow',
        left: '50%',
        bottom: '14%',
        width: 170,
        height: 170,
        fill:
          'radial-gradient(circle at 50% 42%, rgba(147,232,255,0.82) 0%, rgba(28,154,183,0.24) 60%, rgba(28,154,183,0) 100%)',
      },
      {
        kind: 'beam',
        left: '50%',
        top: '10%',
        width: 320,
        height: 52,
        fill:
          'linear-gradient(90deg, rgba(247,188,98,0) 0%, rgba(247,188,98,0.44) 50%, rgba(247,188,98,0) 100%)',
      },
    ],
  },
  'mesoamerican-pyramid': {
    activeProps: ['torches', 'sun disc'],
    nodes: [
      {
        kind: 'glow',
        left: '18%',
        bottom: '20%',
        width: 96,
        height: 140,
        fill:
          'radial-gradient(circle at 50% 22%, rgba(255,247,204,0.94) 0%, rgba(255,223,107,0.52) 48%, rgba(245,158,11,0) 100%)',
      },
      {
        kind: 'glow',
        left: '82%',
        bottom: '20%',
        width: 96,
        height: 140,
        fill:
          'radial-gradient(circle at 50% 22%, rgba(255,247,204,0.94) 0%, rgba(255,223,107,0.52) 48%, rgba(245,158,11,0) 100%)',
      },
      {
        kind: 'glow',
        left: '50%',
        top: '8%',
        width: 170,
        height: 170,
        fill:
          'radial-gradient(circle at 50% 50%, rgba(255,238,163,0.84) 0%, rgba(255,223,107,0.26) 58%, rgba(255,223,107,0) 100%)',
      },
    ],
  },
  'grecoroman-circus': {
    activeProps: ['arena ring', 'garlands'],
    nodes: [
      {
        kind: 'ring',
        left: '50%',
        bottom: '17%',
        width: '78%',
        height: 116,
        borderColor: 'rgba(214,85,110,0.7)',
      },
      {
        kind: 'beam',
        left: '50%',
        top: '10%',
        width: 360,
        height: 40,
        fill:
          'linear-gradient(90deg, rgba(214,85,110,0) 0%, rgba(214,85,110,0.36) 50%, rgba(214,85,110,0) 100%)',
      },
    ],
  },
  'scandinavian-longhouse': {
    activeProps: ['hearth', 'window glow'],
    nodes: [
      {
        kind: 'glow',
        left: '50%',
        bottom: '13%',
        width: 190,
        height: 190,
        fill:
          'radial-gradient(circle at 50% 50%, rgba(255,231,189,0.88) 0%, rgba(242,153,74,0.28) 60%, rgba(242,153,74,0) 100%)',
      },
      {
        kind: 'beam',
        left: '50%',
        top: '22%',
        width: 280,
        height: 58,
        fill:
          'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(214,232,248,0.38) 50%, rgba(255,255,255,0) 100%)',
      },
    ],
  },
  'japanese-fortress': {
    activeProps: ['lanterns', 'moon bridge bloom'],
    nodes: [
      {
        kind: 'glow',
        left: '14%',
        top: '20%',
        width: 72,
        height: 72,
        fill:
          'radial-gradient(circle at 50% 50%, rgba(255,241,210,0.94) 0%, rgba(245,193,126,0.42) 52%, rgba(245,193,126,0) 100%)',
      },
      {
        kind: 'glow',
        left: '84%',
        top: '20%',
        width: 72,
        height: 72,
        fill:
          'radial-gradient(circle at 50% 50%, rgba(255,241,210,0.94) 0%, rgba(245,193,126,0.42) 52%, rgba(245,193,126,0) 100%)',
      },
      {
        kind: 'glow',
        left: '56%',
        bottom: '10%',
        width: 200,
        height: 86,
        fill:
          'radial-gradient(circle at 50% 50%, rgba(245,138,172,0.58) 0%, rgba(245,138,172,0.18) 58%, rgba(245,138,172,0) 100%)',
      },
    ],
  },
  'babylonian-hanging-gardens': {
    activeProps: ['water channels', 'vine lights'],
    nodes: [
      {
        kind: 'beam',
        left: '50%',
        top: '48%',
        width: 260,
        height: 48,
        fill:
          'linear-gradient(90deg, rgba(132,218,255,0) 0%, rgba(132,218,255,0.42) 50%, rgba(132,218,255,0) 100%)',
      },
      {
        kind: 'glow',
        left: '50%',
        top: '30%',
        width: 320,
        height: 170,
        fill:
          'radial-gradient(circle at 50% 50%, rgba(110,211,154,0.5) 0%, rgba(70,125,109,0.16) 58%, rgba(70,125,109,0) 100%)',
      },
    ],
  },
  'future-sky-dome': {
    activeProps: ['dome arc', 'console lights'],
    nodes: [
      {
        kind: 'ring',
        left: '50%',
        top: '24%',
        width: '74%',
        height: '58%',
        borderColor: 'rgba(133,241,255,0.74)',
      },
      {
        kind: 'beam',
        left: '50%',
        bottom: '25%',
        width: 240,
        height: 56,
        fill:
          'linear-gradient(90deg, rgba(133,241,255,0) 0%, rgba(133,241,255,0.42) 50%, rgba(133,241,255,0) 100%)',
      },
    ],
  },
};

const buildRoomPropResponse = (roomTheme, socialState, timeMs) => {
  const preset = ROOM_REACTION_PRESETS[roomTheme?.id];
  if (!preset) {
    return null;
  }

  const nearbyConversation =
    Boolean(socialState.player?.mood === 'visiting')
    || socialState.npcs.some((npc) => npc.nearPlayer);
  const chatterActive = Boolean(socialState.social?.activeLine);
  const pulse = (Math.sin(timeMs / (nearbyConversation ? 180 : 320)) + 1) / 2;
  const intensity = chatterActive
    ? Number((0.28 + pulse * (nearbyConversation ? 0.54 : 0.22)).toFixed(3))
    : 0;

  return {
    themeId: roomTheme.id,
    nearbyConversation,
    intensity,
    activeProps: preset.activeProps,
  };
};

const RoomThemeReactionLayer = ({ theme, reaction, timeMs }) => {
  const preset = ROOM_REACTION_PRESETS[theme?.id];
  if (!preset || !reaction || reaction.intensity <= 0) {
    return null;
  }

  return (
    <>
      {preset.nodes.map((node, index) => {
        const pulse = 0.92 + ((Math.sin(timeMs / (210 + index * 50)) + 1) / 2) * 0.18;
        const sharedStyle = {
          position: 'absolute',
          left: node.left,
          top: node.top,
          bottom: node.bottom,
          width: node.width,
          height: node.height,
          transform: `translate(-50%, ${node.top ? '-50%' : '50%'}) scale(${pulse})`,
          opacity: reaction.intensity * (node.baseOpacity || 1),
          pointerEvents: 'none',
        };

        if (node.kind === 'ring') {
          return (
            <div
              key={`room-reaction-${theme.id}-${index}`}
              style={{
                ...sharedStyle,
                borderRadius: '50%',
                border: `3px solid ${node.borderColor}`,
                boxShadow: `0 0 24px ${node.borderColor}`,
              }}
            />
          );
        }

        return (
          <div
            key={`room-reaction-${theme.id}-${index}`}
            style={{
              ...sharedStyle,
              borderRadius: '50%',
              background: node.fill,
              filter: node.kind === 'beam' ? 'blur(10px)' : 'blur(8px)',
            }}
          />
        );
      })}
    </>
  );
};

const RoomActorBubble = ({ actor, playerActor = false }) => {
  const showSpeech = Boolean(actor.speechText);
  const tone = actor.bubbleTone || (playerActor ? '#f472b6' : '#7c3aed');
  const bubbleWidth = playerActor ? 88 : 96;

  if (!showSpeech && !actor.emote) {
    return null;
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        bottom: '100%',
        transform: playerActor ? 'translate(-50%, -8px)' : 'translate(-50%, -6px)',
        pointerEvents: 'none',
        display: 'grid',
        gap: 4,
        justifyItems: 'center',
        zIndex: 2,
      }}
    >
      {showSpeech && (
        <div
          style={{
            position: 'relative',
            minWidth: bubbleWidth,
            maxWidth: playerActor ? 110 : 118,
            padding: playerActor ? '6px 9px' : '6px 10px',
            borderRadius: 16,
            background: 'rgba(255, 255, 255, 0.94)',
            border: `2px solid ${tone}`,
            boxShadow: `0 10px 20px ${tone}22`,
            textAlign: 'center',
            fontSize: playerActor ? 10 : 10.5,
            fontWeight: 800,
            lineHeight: 1.1,
            color: '#17345c',
            letterSpacing: 0.1,
          }}
        >
          {actor.speechText}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: -8,
              width: 12,
              height: 12,
              background: 'rgba(255, 255, 255, 0.94)',
              borderLeft: `2px solid ${tone}`,
              borderBottom: `2px solid ${tone}`,
              transform: 'translateX(-50%) rotate(-45deg)',
            }}
          />
        </div>
      )}
      {actor.emote && (
        <div
          style={{
            padding: '3px 8px',
            borderRadius: 999,
            background: `${tone}20`,
            border: `1px solid ${tone}`,
            color: tone,
            fontSize: 9.5,
            fontWeight: 900,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            boxShadow: `0 6px 12px ${tone}1a`,
          }}
        >
          {actor.emote}
        </div>
      )}
    </div>
  );
};

const UnicornActorArt = ({ actor, timeMs }) => {
  const moving =
    Math.abs(actor.targetX - actor.x) > 1 || Math.abs(actor.targetY - actor.y) > 1;
  const bobOffset = Math.sin(timeMs / (moving ? 90 : 180)) * (moving ? 2.8 : 1.6);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '18%',
          right: '18%',
          bottom: '2%',
          height: '16%',
          borderRadius: '50%',
          background: 'rgba(47, 64, 91, 0.16)',
          filter: 'blur(3px)',
        }}
      />
      <img
        src={ROOM_UNICORN_ASSET}
        alt=""
        draggable={false}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          transform: `translateY(${bobOffset}px) scaleX(${actor.facing < 0 ? -1 : 1})`,
          transformOrigin: 'center center',
          filter: 'drop-shadow(0 8px 12px rgba(15, 23, 42, 0.18))',
          userSelect: 'none',
          WebkitUserDrag: 'none',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

const ROOM_NPC_ART_PROFILES = {
  default: {
    guide: {
      species: 'frog',
      primary: '#8ed4a0',
      secondary: '#5f9b75',
      cream: '#f4fbef',
      detail: '#ffd56c',
      accessory: 'lantern',
    },
    friend: {
      species: 'frog',
      primary: '#b3ebc0',
      secondary: '#78b38d',
      cream: '#f6fcf2',
      detail: '#a7f0e5',
      accessory: 'leaf',
    },
  },
  'korean-garden': {
    guide: {
      species: 'frog',
      primary: '#88d39c',
      secondary: '#4e896c',
      cream: '#f4fbef',
      detail: '#ffd56c',
      accessory: 'lantern',
    },
    friend: {
      species: 'frog',
      primary: '#afe9bc',
      secondary: '#74ae87',
      cream: '#f7fcf4',
      detail: '#a7f0e5',
      accessory: 'leaf',
    },
  },
  'bavarian-castle': {
    guide: {
      species: 'owl',
      primary: '#c5cafc',
      secondary: '#7380bf',
      cream: '#fff4ea',
      detail: '#d95f84',
      accessory: 'badge',
    },
    friend: {
      species: 'owl',
      primary: '#ead7f5',
      secondary: '#9b79b2',
      cream: '#fff7ee',
      detail: '#f7d482',
      accessory: 'bow',
    },
  },
  'spanish-palace': {
    guide: {
      species: 'cat',
      primary: '#ffcb92',
      secondary: '#d17a46',
      cream: '#fff2e5',
      detail: '#1c9ab7',
      accessory: 'flower',
    },
    friend: {
      species: 'cat',
      primary: '#ffd7e5',
      secondary: '#d9778d',
      cream: '#fff5ef',
      detail: '#ffb35c',
      accessory: 'fan',
    },
  },
  'mesoamerican-pyramid': {
    guide: {
      species: 'lizard',
      primary: '#78c86d',
      secondary: '#4a8742',
      cream: '#f7efc9',
      detail: '#ffdf6b',
      accessory: 'sun',
    },
    friend: {
      species: 'lizard',
      primary: '#94d8b0',
      secondary: '#4f9a7f',
      cream: '#eef9dd',
      detail: '#f59e0b',
      accessory: 'feather',
    },
  },
  'grecoroman-circus': {
    guide: {
      species: 'lion',
      primary: '#f7ca74',
      secondary: '#ca8c48',
      cream: '#fff0c9',
      detail: '#d6556e',
      accessory: 'laurel',
    },
    friend: {
      species: 'lion',
      primary: '#f3dcff',
      secondary: '#a27ac0',
      cream: '#fff5dd',
      detail: '#ffe0a3',
      accessory: 'ribbon',
    },
  },
  'scandinavian-longhouse': {
    guide: {
      species: 'lamb',
      primary: '#f7efe5',
      secondary: '#c7ae96',
      cream: '#ffffff',
      detail: '#f2994a',
      accessory: 'scarf',
    },
    friend: {
      species: 'lamb',
      primary: '#f3e2d2',
      secondary: '#9d7758',
      cream: '#fff8f2',
      detail: '#d2e8f5',
      accessory: 'bell',
    },
  },
  'japanese-fortress': {
    guide: {
      species: 'fox',
      primary: '#ffe6d7',
      secondary: '#d5845c',
      cream: '#fff8f2',
      detail: '#f58aac',
      accessory: 'ribbon',
    },
    friend: {
      species: 'fox',
      primary: '#fff1e8',
      secondary: '#ba6d55',
      cream: '#fffaf7',
      detail: '#ffd5e3',
      accessory: 'blossom',
    },
  },
  'babylonian-hanging-gardens': {
    guide: {
      species: 'bird',
      primary: '#73d9a2',
      secondary: '#4c836f',
      cream: '#fef7de',
      detail: '#ffd76b',
      accessory: 'vine',
    },
    friend: {
      species: 'bird',
      primary: '#ffdcb4',
      secondary: '#cb8f4c',
      cream: '#fff6e6',
      detail: '#ff9ec0',
      accessory: 'flower',
    },
  },
  'future-sky-dome': {
    guide: {
      species: 'robot',
      primary: '#d9e9ff',
      secondary: '#7095d9',
      cream: '#f7fbff',
      detail: '#85f1ff',
      accessory: 'visor',
    },
    friend: {
      species: 'robot',
      primary: '#c9d5ff',
      secondary: '#5268bd',
      cream: '#f8fcff',
      detail: '#ffffff',
      accessory: 'halo',
    },
  },
};

const ROOM_THEME_EXTRA_ACCESSORIES = {
  default: ['leaf', 'flower', 'badge'],
  'korean-garden': ['lantern', 'leaf', 'flower', 'ribbon'],
  'bavarian-castle': ['badge', 'bow', 'lantern', 'bell'],
  'spanish-palace': ['flower', 'fan', 'ribbon', 'bell'],
  'mesoamerican-pyramid': ['sun', 'feather', 'flower', 'badge'],
  'grecoroman-circus': ['laurel', 'ribbon', 'fan', 'flower'],
  'scandinavian-longhouse': ['scarf', 'bell', 'leaf', 'badge'],
  'japanese-fortress': ['ribbon', 'blossom', 'fan', 'lantern'],
  'babylonian-hanging-gardens': ['vine', 'flower', 'leaf', 'sun'],
  'future-sky-dome': ['visor', 'halo', 'badge', 'halo'],
};

const hexToRgb = (hex) => {
  const normalized = String(hex || '').replace('#', '');
  const full = normalized.length === 3
    ? normalized.split('').map((char) => `${char}${char}`).join('')
    : normalized;

  if (full.length !== 6) {
    return { r: 255, g: 255, b: 255 };
  }

  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
};

const rgbToHex = ({ r, g, b }) =>
  `#${[r, g, b]
    .map((value) => Math.round(clamp(value, 0, 255)).toString(16).padStart(2, '0'))
    .join('')}`;

const blendHexColors = (left, right, mix = 0.5) => {
  const leftRgb = hexToRgb(left);
  const rightRgb = hexToRgb(right);
  const weight = clamp(mix, 0, 1);

  return rgbToHex({
    r: leftRgb.r + (rightRgb.r - leftRgb.r) * weight,
    g: leftRgb.g + (rightRgb.g - leftRgb.g) * weight,
    b: leftRgb.b + (rightRgb.b - leftRgb.b) * weight,
  });
};

const getRoomNpcArtProfile = (roomThemeId, actor) => {
  const themeProfiles = ROOM_NPC_ART_PROFILES[roomThemeId] || ROOM_NPC_ART_PROFILES.default;
  const actorId = actor?.id || 'npc-friend';

  if (actorId === 'npc-guide') {
    return themeProfiles.guide;
  }

  if (actorId === 'npc-friend') {
    return themeProfiles.friend;
  }

  const variantIndex = Math.max(0, actor?.variantIndex ?? 2);
  const baseProfile = variantIndex % 2 === 0 ? themeProfiles.guide : themeProfiles.friend;
  const accentPool =
    ROOM_THEME_EXTRA_ACCESSORIES[roomThemeId] || ROOM_THEME_EXTRA_ACCESSORIES.default;
  const accentColor = accentPool[(variantIndex - 2) % accentPool.length] || baseProfile.accessory;
  const mixStrength = 0.18 + ((variantIndex - 2) % 3) * 0.12;

  return {
    species: baseProfile.species,
    primary: blendHexColors(
      baseProfile.primary,
      themeProfiles.friend.primary,
      variantIndex % 2 === 0 ? 0.24 : 0.12
    ),
    secondary: blendHexColors(
      baseProfile.secondary,
      themeProfiles.guide.secondary,
      variantIndex % 2 === 0 ? 0.1 : 0.22
    ),
    cream: blendHexColors(baseProfile.cream, '#ffffff', 0.18),
    detail: blendHexColors(themeProfiles.guide.detail, themeProfiles.friend.detail, mixStrength),
    accessory: accentColor,
  };
};

const getRoomNpcMotionPose = (profile, actor, timeMs) => {
  const moodBoost =
    actor.mood === 'chatty' ? 1.18 : actor.nearPlayer ? 1.1 : actor.mood === 'wandering' ? 0.92 : 1;
  const phase = timeMs / 260 + actor.phase * 4.4 + (actor.variantIndex || 0) * 0.6;
  const wave = Math.sin(phase);
  const quick = Math.sin(phase * 1.7);
  const bounce = Math.abs(Math.sin(phase * 1.35));

  return {
    bodyScaleX: Number((1 - wave * 0.018 * moodBoost).toFixed(3)),
    bodyScaleY: Number((1 + wave * 0.026 * moodBoost).toFixed(3)),
    tailDeg: Number(
      (
        wave *
        ({
          fox: 16,
          cat: 11,
          lion: 12,
          lizard: 18,
          bird: 10,
        }[profile.species] || 0) *
        moodBoost
      ).toFixed(2)
    ),
    earDeg: Number(
      (
        quick *
        ({
          fox: 8,
          cat: 7,
          owl: 6,
          lamb: 8,
        }[profile.species] || 0) *
        moodBoost
      ).toFixed(2)
    ),
    wingLift: Number(
      (
        bounce *
        ({
          owl: 5.4,
          bird: 6.2,
        }[profile.species] || 0) *
        moodBoost
      ).toFixed(2)
    ),
    accessoryY: Number((quick * 2.4 * moodBoost).toFixed(2)),
    accessoryDeg: Number((wave * 7 * moodBoost).toFixed(2)),
    crestDeg: Number((wave * 10 * moodBoost).toFixed(2)),
    antennaDeg: Number((quick * 12 * moodBoost).toFixed(2)),
    haloScale: Number((1 + bounce * 0.08 * moodBoost).toFixed(3)),
    robotArmY: Number((bounce * 2.4 * moodBoost).toFixed(2)),
  };
};

const getNpcBodyTransform = (motion, centerX = 30, centerY = 44) =>
  `translate(${centerX} ${centerY}) scale(${motion.bodyScaleX} ${motion.bodyScaleY}) translate(${-centerX} ${-centerY})`;

const RoomNpcEyes = ({ blink, outline, leftX, rightX, y = 20, size = 1.8 }) =>
  blink ? (
    <>
      <path d={`M${leftX - 2} ${y} Q${leftX} ${y - 1.1} ${leftX + 2} ${y}`} fill="none" stroke={outline} strokeWidth="1.8" strokeLinecap="round" />
      <path d={`M${rightX - 2} ${y} Q${rightX} ${y - 1.1} ${rightX + 2} ${y}`} fill="none" stroke={outline} strokeWidth="1.8" strokeLinecap="round" />
    </>
  ) : (
    <>
      <circle cx={leftX} cy={y} r={size} fill={outline} />
      <circle cx={rightX} cy={y} r={size} fill={outline} />
    </>
  );

const RoomNpcAccessory = ({ accessory, detail, outline, motion }) => {
  switch (accessory) {
    case 'lantern':
      return (
        <g transform={`rotate(${motion.accessoryDeg} 47 38) translate(0 ${motion.accessoryY})`}>
          <path d="M37 35 Q44 34 48 38" fill="none" stroke={outline} strokeWidth="2.2" strokeLinecap="round" />
          <rect x="46" y="38" width="8" height="10" rx="4" fill={detail} stroke={outline} strokeWidth="2" />
        </g>
      );
    case 'leaf':
      return (
        <g transform={`rotate(${motion.crestDeg} 30 8)`}>
          <path d="M23 8 Q30 2 37 8 Q31 14 23 8 Z" fill={detail} stroke={outline} strokeWidth="2" />
        </g>
      );
    case 'badge':
      return (
        <g transform={`translate(0 ${motion.accessoryY * 0.5})`}>
          <circle cx="30" cy="42" r="5" fill={detail} stroke={outline} strokeWidth="2" />
          <path d="M27 46 L24 53" stroke={outline} strokeWidth="2" strokeLinecap="round" />
          <path d="M33 46 L36 53" stroke={outline} strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    case 'bow':
      return (
        <g transform={`translate(0 ${motion.accessoryY * 0.4}) rotate(${motion.accessoryDeg * 0.45} 30 35)`}>
          <path d="M22 37 Q16 34 18 29 Q24 30 27 35 Z" fill={detail} stroke={outline} strokeWidth="2" />
          <path d="M38 37 Q44 34 42 29 Q36 30 33 35 Z" fill={detail} stroke={outline} strokeWidth="2" />
          <circle cx="30" cy="36" r="3" fill={detail} stroke={outline} strokeWidth="1.8" />
        </g>
      );
    case 'flower':
      return (
        <g transform={`rotate(${motion.crestDeg} 40 12)`}>
          {[0, 72, 144, 216, 288].map((angle) => (
            <ellipse
              key={angle}
              cx="40"
              cy="12"
              rx="3"
              ry="5"
              fill={detail}
              stroke={outline}
              strokeWidth="1.5"
              transform={`rotate(${angle} 40 12)`}
            />
          ))}
          <circle cx="40" cy="12" r="2.3" fill="#fff8d1" stroke={outline} strokeWidth="1.2" />
        </g>
      );
    case 'fan':
      return (
        <g transform={`rotate(${motion.accessoryDeg * 0.9} 40 38) translate(0 ${motion.accessoryY})`}>
          <path d="M39 37 Q51 33 52 45 Q43 47 39 37 Z" fill={detail} stroke={outline} strokeWidth="2" />
        </g>
      );
    case 'sun':
      return (
        <g transform={`rotate(${motion.crestDeg} 30 8)`}>
          <circle cx="30" cy="8" r="4.8" fill={detail} stroke={outline} strokeWidth="2" />
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <path
              key={angle}
              d="M30 1 L30 -4"
              stroke={outline}
              strokeWidth="1.8"
              strokeLinecap="round"
              transform={`rotate(${angle} 30 8)`}
            />
          ))}
        </g>
      );
    case 'feather':
      return (
        <g transform={`rotate(${motion.crestDeg} 30 8)`}>
          <path d="M22 8 Q30 0 38 6 Q32 14 22 8 Z" fill={detail} stroke={outline} strokeWidth="2" />
        </g>
      );
    case 'laurel':
      return (
        <g transform={`translate(0 ${motion.accessoryY * 0.35})`}>
          <path d="M19 14 Q23 7 28 7" fill="none" stroke={detail} strokeWidth="3" strokeLinecap="round" />
          <path d="M41 14 Q37 7 32 7" fill="none" stroke={detail} strokeWidth="3" strokeLinecap="round" />
          <path d="M22 12 L18 9" stroke={detail} strokeWidth="2" strokeLinecap="round" />
          <path d="M38 12 L42 9" stroke={detail} strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    case 'ribbon':
      return (
        <g transform={`translate(0 ${motion.accessoryY * 0.35}) rotate(${motion.accessoryDeg * 0.4} 30 36)`}>
          <path d="M24 36 L19 44" stroke={detail} strokeWidth="4" strokeLinecap="round" />
          <path d="M36 36 L41 44" stroke={detail} strokeWidth="4" strokeLinecap="round" />
          <circle cx="30" cy="35" r="3.4" fill={detail} stroke={outline} strokeWidth="1.7" />
        </g>
      );
    case 'scarf':
      return (
        <g transform={`translate(0 ${motion.accessoryY * 0.45})`}>
          <path d="M21 36 Q30 40 39 36 L37 42 Q30 45 23 42 Z" fill={detail} stroke={outline} strokeWidth="2" />
        </g>
      );
    case 'bell':
      return (
        <g transform={`translate(0 ${motion.accessoryY * 0.4})`}>
          <path d="M21 36 Q30 39 39 36" fill="none" stroke={detail} strokeWidth="3" strokeLinecap="round" />
          <circle cx="30" cy="41" r="3.8" fill={detail} stroke={outline} strokeWidth="1.8" />
        </g>
      );
    case 'blossom':
      return (
        <g transform={`rotate(${motion.crestDeg} 19 14)`}>
          {[0, 90, 180, 270].map((angle) => (
            <ellipse
              key={angle}
              cx="19"
              cy="14"
              rx="2.6"
              ry="4.4"
              fill={detail}
              stroke={outline}
              strokeWidth="1.2"
              transform={`rotate(${angle} 19 14)`}
            />
          ))}
          <circle cx="19" cy="14" r="1.7" fill="#fff7c9" />
        </g>
      );
    case 'vine':
      return (
        <g transform={`translate(0 ${motion.accessoryY * 0.2})`}>
          <path d="M18 12 Q30 5 42 12" fill="none" stroke={detail} strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case 'visor':
      return (
        <g transform={`translate(0 ${motion.accessoryY * 0.15})`}>
          <rect x="19" y="15" width="22" height="8" rx="4" fill={`${detail}bb`} stroke={outline} strokeWidth="2" />
        </g>
      );
    case 'halo':
      return (
        <g transform={`translate(0 ${motion.accessoryY * 0.4}) scale(${motion.haloScale} ${motion.haloScale})`}>
          <ellipse cx="30" cy="7" rx="10" ry="4" fill="none" stroke={detail} strokeWidth="2.5" />
        </g>
      );
    default:
      return null;
  }
};

const renderFrogNpc = ({ profile, outline, blink, motion }) => (
  <>
    <g transform={`translate(30 15) rotate(${motion.crestDeg * 0.2}) translate(-30 -15)`}>
      <circle cx="21" cy="14" r="5.5" fill={profile.primary} stroke={outline} strokeWidth="2.2" />
      <circle cx="39" cy="14" r="5.5" fill={profile.primary} stroke={outline} strokeWidth="2.2" />
    </g>
    <g transform={getNpcBodyTransform(motion)}>
      <ellipse cx="30" cy="24" rx="16" ry="13" fill={profile.primary} stroke={outline} strokeWidth="2.8" />
      <ellipse cx="30" cy="47" rx="17" ry="15" fill={profile.primary} stroke={outline} strokeWidth="2.8" />
      <ellipse cx="30" cy="49" rx="9.5" ry="11" fill={profile.cream} opacity="0.96" />
      <ellipse cx="18" cy="42" rx="5" ry="8.5" fill={profile.secondary} opacity="0.88" />
      <ellipse cx="42" cy="42" rx="5" ry="8.5" fill={profile.secondary} opacity="0.88" />
      <ellipse cx="22" cy="61" rx="4.6" ry="7.2" fill={profile.secondary} />
      <ellipse cx="38" cy="61" rx="4.6" ry="7.2" fill={profile.secondary} />
      <ellipse cx="30" cy="31" rx="7.5" ry="6" fill={profile.secondary} opacity="0.18" />
      <RoomNpcEyes blink={blink} outline={outline} leftX={25.5} rightX={34.5} y={22} size={1.9} />
      <path d="M25 28 Q30 31 35 28" fill="none" stroke={outline} strokeWidth="2.2" strokeLinecap="round" />
    </g>
  </>
);

const renderOwlNpc = ({ profile, outline, blink, motion }) => (
  <>
    <g transform={`rotate(${-motion.earDeg * 0.7} 22 12)`}>
      <path d="M17 15 L23 9 L26 18 Z" fill={profile.secondary} stroke={outline} strokeWidth="2.2" />
    </g>
    <g transform={`rotate(${motion.earDeg * 0.7} 38 12)`}>
      <path d="M43 15 L37 9 L34 18 Z" fill={profile.secondary} stroke={outline} strokeWidth="2.2" />
    </g>
    <g transform={`translate(-${motion.wingLift * 0.35} ${motion.wingLift}) rotate(${-5 - motion.earDeg * 0.2} 20 43)`}>
      <ellipse cx="20" cy="43" rx="5.5" ry="11" fill={profile.secondary} opacity="0.9" />
    </g>
    <g transform={`translate(${motion.wingLift * 0.35} ${motion.wingLift}) rotate(${5 + motion.earDeg * 0.2} 40 43)`}>
      <ellipse cx="40" cy="43" rx="5.5" ry="11" fill={profile.secondary} opacity="0.9" />
    </g>
    <g transform={getNpcBodyTransform(motion)}>
      <circle cx="30" cy="21" r="12.5" fill={profile.primary} stroke={outline} strokeWidth="2.8" />
      <path d="M17 35 Q30 28 43 35 L46 58 Q30 68 14 58 Z" fill={profile.primary} stroke={outline} strokeWidth="2.8" />
      <ellipse cx="30" cy="45" rx="9" ry="12" fill={profile.cream} opacity="0.96" />
      <path d="M27 25 L30 28 L33 25" fill={profile.detail} stroke={outline} strokeWidth="1.8" strokeLinejoin="round" />
      <RoomNpcEyes blink={blink} outline={outline} leftX={25} rightX={35} y={20} size={2.1} />
      <path d="M26 30 Q30 33 34 30" fill="none" stroke={outline} strokeWidth="2" strokeLinecap="round" />
      <rect x="22" y="58" width="5" height="9" rx="2.5" fill={profile.secondary} />
      <rect x="33" y="58" width="5" height="9" rx="2.5" fill={profile.secondary} />
    </g>
  </>
);

const renderCatFoxNpc = ({ profile, outline, blink, motion, fox = false }) => (
  <>
    <g transform={`rotate(${motion.tailDeg} 42 47)`}>
      <path d={fox ? 'M44 39 Q56 37 54 55 Q48 65 36 60 Q44 53 42 45 Z' : 'M44 41 Q55 40 54 53 Q50 63 40 60 Q45 52 44 45 Z'} fill={profile.secondary} stroke={outline} strokeWidth="2.4" />
    </g>
    <g transform={`rotate(${-motion.earDeg} 23 13)`}>
      <path d="M18 16 L24 7 L27 19 Z" fill={profile.secondary} stroke={outline} strokeWidth="2.2" />
    </g>
    <g transform={`rotate(${motion.earDeg} 37 13)`}>
      <path d="M42 16 L36 7 L33 19 Z" fill={profile.secondary} stroke={outline} strokeWidth="2.2" />
    </g>
    <g transform={getNpcBodyTransform(motion)}>
      <circle cx="30" cy="21" r="11.8" fill={profile.primary} stroke={outline} strokeWidth="2.8" />
      <path d="M18 36 Q30 29 42 36 L45 58 Q30 67 15 58 Z" fill={profile.primary} stroke={outline} strokeWidth="2.8" />
      <ellipse cx="30" cy="46" rx="8.5" ry="11" fill={profile.cream} />
      <ellipse cx="30" cy="27" rx="7.2" ry="5.4" fill={profile.cream} />
      <RoomNpcEyes blink={blink} outline={outline} leftX={25.5} rightX={34.5} y={21} size={1.9} />
      <path d="M27 28 Q30 30 33 28" fill="none" stroke={outline} strokeWidth="2" strokeLinecap="round" />
      <path d="M24 26 L20 24" stroke={outline} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M36 26 L40 24" stroke={outline} strokeWidth="1.4" strokeLinecap="round" />
      <rect x="23" y="58" width="5" height="9" rx="2.5" fill={profile.secondary} />
      <rect x="32" y="58" width="5" height="9" rx="2.5" fill={profile.secondary} />
    </g>
  </>
);

const renderLizardNpc = ({ profile, outline, blink, motion }) => (
  <>
    <g transform={`rotate(${motion.tailDeg} 42 44)`}>
      <path d="M44 42 Q57 42 55 57 Q46 61 38 56 Q45 50 44 42 Z" fill={profile.secondary} stroke={outline} strokeWidth="2.2" />
    </g>
    <g transform={`rotate(${motion.crestDeg} 30 10)`}>
      <path d="M19 12 L24 6 L27 16 Z" fill={profile.detail} stroke={outline} strokeWidth="1.8" />
      <path d="M26 10 L30 3 L34 10 Z" fill={profile.detail} stroke={outline} strokeWidth="1.8" />
      <path d="M33 12 L36 6 L41 12 Z" fill={profile.detail} stroke={outline} strokeWidth="1.8" />
    </g>
    <g transform={getNpcBodyTransform(motion)}>
      <ellipse cx="30" cy="20" rx="13" ry="10.5" fill={profile.primary} stroke={outline} strokeWidth="2.6" />
      <ellipse cx="30" cy="43" rx="16" ry="11.5" fill={profile.primary} stroke={outline} strokeWidth="2.6" />
      <ellipse cx="30" cy="44" rx="8.5" ry="9" fill={profile.cream} opacity="0.92" />
      <ellipse cx="19" cy="43" rx="4.5" ry="8.5" fill={profile.secondary} />
      <ellipse cx="41" cy="43" rx="4.5" ry="8.5" fill={profile.secondary} />
      <RoomNpcEyes blink={blink} outline={outline} leftX={25} rightX={35} y={19} size={1.7} />
      <path d="M26 25 Q30 29 34 25" fill="none" stroke={outline} strokeWidth="2" strokeLinecap="round" />
      <rect x="22" y="54" width="5" height="11" rx="2.5" fill={profile.secondary} />
      <rect x="33" y="54" width="5" height="11" rx="2.5" fill={profile.secondary} />
    </g>
  </>
);

const renderLionNpc = ({ profile, outline, blink, motion }) => (
  <>
    <g transform={`rotate(${motion.tailDeg} 42 47)`}>
      <path d="M44 42 Q55 42 54 56 Q49 62 40 59 Q45 52 44 46 Z" fill={profile.secondary} stroke={outline} strokeWidth="2.2" />
    </g>
    <g transform={`translate(30 20) scale(${1 + motion.bodyScaleY * 0.02} ${1 - motion.bodyScaleX * 0.01}) translate(-30 -20)`}>
      <circle cx="30" cy="20" r="14.5" fill={profile.secondary} stroke={outline} strokeWidth="2.4" />
    </g>
    <g transform={getNpcBodyTransform(motion)}>
      <circle cx="30" cy="20" r="9.6" fill={profile.primary} stroke={outline} strokeWidth="2.2" />
      <path d="M17 36 Q30 29 43 36 L45 58 Q30 68 15 58 Z" fill={profile.primary} stroke={outline} strokeWidth="2.8" />
      <ellipse cx="30" cy="46" rx="8.5" ry="10.5" fill={profile.cream} />
      <circle cx="22" cy="12" r="3.8" fill={profile.secondary} stroke={outline} strokeWidth="1.8" />
      <circle cx="38" cy="12" r="3.8" fill={profile.secondary} stroke={outline} strokeWidth="1.8" />
      <RoomNpcEyes blink={blink} outline={outline} leftX={25.5} rightX={34.5} y={20} size={1.9} />
      <path d="M27 27 Q30 30 33 27" fill="none" stroke={outline} strokeWidth="2" strokeLinecap="round" />
      <rect x="23" y="58" width="5" height="9" rx="2.5" fill={profile.secondary} />
      <rect x="32" y="58" width="5" height="9" rx="2.5" fill={profile.secondary} />
    </g>
  </>
);

const renderLambNpc = ({ profile, outline, blink, motion }) => (
  <>
    {[20, 30, 40].map((cx) => (
      <circle key={`head-puff-${cx}`} cx={cx} cy="17" r="7.4" fill={profile.primary} stroke={outline} strokeWidth="1.8" />
    ))}
    <g transform={`rotate(${-motion.earDeg} 19 20)`}>
      <ellipse cx="19" cy="20" rx="3.2" ry="7" fill={profile.secondary} stroke={outline} strokeWidth="1.6" />
    </g>
    <g transform={`rotate(${motion.earDeg} 41 20)`}>
      <ellipse cx="41" cy="20" rx="3.2" ry="7" fill={profile.secondary} stroke={outline} strokeWidth="1.6" />
    </g>
    <g transform={getNpcBodyTransform(motion)}>
      <ellipse cx="30" cy="22" rx="9" ry="8" fill={profile.cream} stroke={outline} strokeWidth="2" />
      {[18, 26, 34, 42].map((cx) => (
        <circle key={`body-puff-${cx}`} cx={cx} cy="45" r="8.5" fill={profile.primary} stroke={outline} strokeWidth="1.8" />
      ))}
      <ellipse cx="30" cy="46" rx="11" ry="10" fill={profile.cream} opacity="0.96" />
      <RoomNpcEyes blink={blink} outline={outline} leftX={26} rightX={34} y={21} size={1.6} />
      <path d="M27 27 Q30 29 33 27" fill="none" stroke={outline} strokeWidth="1.8" strokeLinecap="round" />
      <rect x="22" y="58" width="5" height="9" rx="2.5" fill={profile.secondary} />
      <rect x="33" y="58" width="5" height="9" rx="2.5" fill={profile.secondary} />
    </g>
  </>
);

const renderBirdNpc = ({ profile, outline, blink, motion }) => (
  <>
    <g transform={`rotate(${-motion.crestDeg * 0.5} 22 12)`}>
      <path d="M18 15 L24 8 L27 18 Z" fill={profile.detail} stroke={outline} strokeWidth="1.8" />
    </g>
    <g transform={`rotate(${motion.crestDeg * 0.5} 38 12)`}>
      <path d="M42 15 L36 8 L33 18 Z" fill={profile.detail} stroke={outline} strokeWidth="1.8" />
    </g>
    <g transform={`rotate(${motion.tailDeg} 42 46)`}>
      <path d="M44 40 Q56 39 54 54 Q47 64 36 60 Q44 53 43 46 Z" fill={profile.secondary} stroke={outline} strokeWidth="2.2" />
    </g>
    <g transform={`translate(-${motion.wingLift * 0.42} ${motion.wingLift}) rotate(${-7} 22 42)`}>
      <path d="M18 41 Q24 34 27 52" fill={profile.secondary} opacity="0.9" />
    </g>
    <g transform={`translate(${motion.wingLift * 0.42} ${motion.wingLift}) rotate(${7} 38 42)`}>
      <path d="M42 41 Q36 34 33 52" fill={profile.secondary} opacity="0.9" />
    </g>
    <g transform={getNpcBodyTransform(motion)}>
      <circle cx="30" cy="20" r="11.6" fill={profile.primary} stroke={outline} strokeWidth="2.6" />
      <path d="M17 36 Q30 28 43 36 L46 58 Q30 68 14 58 Z" fill={profile.primary} stroke={outline} strokeWidth="2.8" />
      <ellipse cx="30" cy="45" rx="8.5" ry="11.2" fill={profile.cream} opacity="0.96" />
      <path d="M27 25 L30 28 L33 25" fill={profile.detail} stroke={outline} strokeWidth="1.6" strokeLinejoin="round" />
      <RoomNpcEyes blink={blink} outline={outline} leftX={25.5} rightX={34.5} y={20} size={1.9} />
      <path d="M26 30 Q30 33 34 30" fill="none" stroke={outline} strokeWidth="2" strokeLinecap="round" />
      <rect x="22" y="58" width="5" height="9" rx="2.5" fill={profile.secondary} />
      <rect x="33" y="58" width="5" height="9" rx="2.5" fill={profile.secondary} />
    </g>
  </>
);

const renderRobotNpc = ({ profile, outline, blink, motion }) => (
  <>
    <g transform={`rotate(${motion.antennaDeg} 30 10)`}>
      <path d="M30 4 L30 10" stroke={outline} strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="30" cy="4" r="2.8" fill={profile.detail} stroke={outline} strokeWidth="1.8" />
    </g>
    <g transform={`translate(0 ${motion.robotArmY})`}>
      <circle cx="16" cy="41" r="4" fill={profile.secondary} stroke={outline} strokeWidth="1.8" />
      <circle cx="44" cy="41" r="4" fill={profile.secondary} stroke={outline} strokeWidth="1.8" />
      <path d="M22 30 L18 35" stroke={outline} strokeWidth="2" strokeLinecap="round" />
      <path d="M38 30 L42 35" stroke={outline} strokeWidth="2" strokeLinecap="round" />
    </g>
    <g transform={getNpcBodyTransform(motion)}>
      <rect x="18" y="12" width="24" height="18" rx="8" fill={profile.primary} stroke={outline} strokeWidth="2.6" />
      <rect x="19" y="34" width="22" height="24" rx="10" fill={profile.primary} stroke={outline} strokeWidth="2.6" />
      <rect x="23" y="39" width="14" height="8" rx="4" fill={profile.cream} opacity="0.9" />
      <rect x="22" y="58" width="5" height="9" rx="2.5" fill={profile.secondary} />
      <rect x="33" y="58" width="5" height="9" rx="2.5" fill={profile.secondary} />
      <RoomNpcEyes blink={blink} outline={outline} leftX={25.5} rightX={34.5} y={21} size={1.7} />
      <path d="M27 26 Q30 28 33 26" fill="none" stroke={outline} strokeWidth="1.8" strokeLinecap="round" />
    </g>
  </>
);

const RoomNpcArt = ({ actor, timeMs, roomTheme }) => {
  const blink = Math.sin(timeMs / 420 + actor.phase) > 0.94;
  const profile = getRoomNpcArtProfile(roomTheme?.id, actor);
  const outline = actor.accentColor;
  const motion = getRoomNpcMotionPose(profile, actor, timeMs);

  const renderNpcFigure = () => {
    switch (profile.species) {
      case 'owl':
        return renderOwlNpc({ profile, outline, blink, motion });
      case 'cat':
        return renderCatFoxNpc({ profile, outline, blink, motion });
      case 'lizard':
        return renderLizardNpc({ profile, outline, blink, motion });
      case 'lion':
        return renderLionNpc({ profile, outline, blink, motion });
      case 'lamb':
        return renderLambNpc({ profile, outline, blink, motion });
      case 'fox':
        return renderCatFoxNpc({ profile, outline, blink, motion, fox: true });
      case 'bird':
        return renderBirdNpc({ profile, outline, blink, motion });
      case 'robot':
        return renderRobotNpc({ profile, outline, blink, motion });
      case 'frog':
      default:
        return renderFrogNpc({ profile, outline, blink, motion });
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        transform: `translateY(${actor.bobOffset}px) scaleX(${actor.facing < 0 ? -1 : 1})`,
        transformOrigin: 'center center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '18%',
          right: '18%',
          bottom: '4%',
          height: '12%',
          borderRadius: '50%',
          background: 'rgba(15, 23, 42, 0.12)',
          filter: 'blur(2px)',
        }}
      />
      <svg
        viewBox="0 0 60 72"
        width="100%"
        height="100%"
        style={{
          display: 'block',
          overflow: 'visible',
          filter: 'drop-shadow(0 7px 9px rgba(15, 23, 42, 0.14))',
        }}
      >
        {renderNpcFigure()}
        <RoomNpcAccessory accessory={profile.accessory} detail={profile.detail} outline={outline} motion={motion} />
        <path d="M18 30 Q30 25 42 30" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="45" cy="24" r="4" fill={actor.glowColor} opacity="0.86" />
      </svg>
    </div>
  );
};

const FurnitureArt = ({ item, ghost = false }) => {
  const sharedStyle = {
    position: 'absolute',
    inset: 0,
    opacity: ghost ? 0.82 : 1,
  };

  if (item.type === 'lantern' || item.type === 'lamp') {
    return (
      <div style={sharedStyle}>
        <div
          style={{
            position: 'absolute',
            left: '20%',
            right: '20%',
            top: '12%',
            height: '34%',
            borderRadius: '22px 22px 14px 14px',
            background: `linear-gradient(180deg, ${item.color}, #ffffff)`,
            border: `3px solid ${item.accent}`,
            boxShadow: ghost ? '0 0 24px rgba(96, 165, 250, 0.24)' : '0 10px 18px rgba(96, 165, 250, 0.16)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '46%',
            top: '43%',
            width: '8%',
            height: '33%',
            borderRadius: 999,
            background: item.accent,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '28%',
            right: '28%',
            bottom: '12%',
            height: '12%',
            borderRadius: 999,
            background: '#e2e8f0',
          }}
        />
      </div>
    );
  }

  if (item.type === 'torch') {
    return (
      <div style={sharedStyle}>
        <div
          style={{
            position: 'absolute',
            left: '46%',
            top: '20%',
            width: '8%',
            height: '58%',
            borderRadius: 999,
            background: item.accent,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '28%',
            top: '6%',
            width: '44%',
            height: '26%',
            borderRadius: '50% 50% 45% 45%',
            background: `radial-gradient(circle at 50% 30%, #fff7cc 0%, ${item.color} 50%, ${item.accent} 100%)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '28%',
            bottom: '10%',
            width: '44%',
            height: '10%',
            borderRadius: 999,
            background: '#8b5e3c',
          }}
        />
      </div>
    );
  }

  if (item.type === 'plate') {
    return (
      <div style={sharedStyle}>
        <div
          style={{
            position: 'absolute',
            left: '12%',
            right: '12%',
            bottom: '18%',
            height: '18%',
            borderRadius: 999,
            background: '#8b5e3c',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '14%',
            right: '14%',
            top: '24%',
            height: '34%',
            borderRadius: 999,
            background: '#fff8e8',
            border: `3px solid ${item.accent}`,
          }}
        />
        {['18%', '40%', '62%'].map((left, index) => (
          <div
            key={`${item.id}-fruit-${left}`}
            style={{
              position: 'absolute',
              left,
              top: index === 1 ? '26%' : '30%',
              width: '20%',
              height: '22%',
              borderRadius: '50%',
              background: index === 1 ? item.accent : item.color,
            }}
          />
        ))}
      </div>
    );
  }

  if (item.type === 'cushion') {
    return (
      <div style={sharedStyle}>
        <div
          style={{
            position: 'absolute',
            left: '8%',
            right: '8%',
            bottom: '18%',
            height: '40%',
            borderRadius: 24,
            background: `linear-gradient(180deg, #ffffff, ${item.color} 36%, ${item.accent} 100%)`,
            border: `3px solid ${item.accent}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '22%',
            right: '22%',
            top: '28%',
            height: '18%',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.54)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '46%',
            top: '36%',
            width: '8%',
            height: '10%',
            borderRadius: '50%',
            background: item.accent,
          }}
        />
      </div>
    );
  }

  if (item.type === 'recliner') {
    return (
      <div style={sharedStyle}>
        <div
          style={{
            position: 'absolute',
            left: '10%',
            bottom: '16%',
            width: '70%',
            height: '30%',
            borderRadius: 20,
            background: `linear-gradient(180deg, ${item.color}, ${item.accent})`,
            border: `3px solid ${item.accent}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '8%',
            top: '20%',
            width: '34%',
            height: '46%',
            borderRadius: 18,
            background: `linear-gradient(180deg, ${item.color}, ${item.accent})`,
            border: `3px solid ${item.accent}`,
          }}
        />
        {['16%', '64%'].map((left) => (
          <div
            key={`${item.id}-leg-${left}`}
            style={{
              position: 'absolute',
              left,
              bottom: '8%',
              width: '8%',
              height: '16%',
              borderRadius: 999,
              background: '#8b5e3c',
            }}
          />
        ))}
      </div>
    );
  }

  if (item.type === 'stool') {
    return (
      <div style={sharedStyle}>
        <div
          style={{
            position: 'absolute',
            left: '14%',
            right: '14%',
            top: '18%',
            height: '24%',
            borderRadius: 14,
            background: item.color,
            border: `3px solid ${item.accent}`,
          }}
        />
        {['22%', '66%'].map((left) => (
          <div
            key={`${item.id}-stool-leg-${left}`}
            style={{
              position: 'absolute',
              left,
              top: '38%',
              width: '10%',
              height: '42%',
              borderRadius: 999,
              background: item.accent,
            }}
          />
        ))}
      </div>
    );
  }

  if (item.type === 'gem') {
    return (
      <div style={sharedStyle}>
        <div
          style={{
            position: 'absolute',
            left: '24%',
            right: '24%',
            top: '6%',
            height: '42%',
            clipPath: 'polygon(50% 0%, 90% 24%, 76% 100%, 24% 100%, 10% 24%)',
            background: `linear-gradient(180deg, #ffffff, ${item.color} 45%, ${item.accent} 100%)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '34%',
            right: '34%',
            bottom: '12%',
            height: '28%',
            borderRadius: 10,
            background: '#b58a61',
            border: `3px solid ${item.accent}`,
          }}
        />
      </div>
    );
  }

  if (item.type === 'screen') {
    return (
      <div style={sharedStyle}>
        {[6, 36, 66].map((left) => (
          <div
            key={`${item.id}-panel-${left}`}
            style={{
              position: 'absolute',
              left: `${left}%`,
              top: '10%',
              width: '24%',
              height: '72%',
              borderRadius: 12,
              background: item.color,
              border: `3px solid ${item.accent}`,
            }}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            left: '18%',
            top: '28%',
            width: '14%',
            height: '14%',
            borderRadius: '50%',
            background: '#ffd6ea',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '54%',
            top: '22%',
            width: '16%',
            height: '16%',
            borderRadius: '50%',
            background: '#ffd6ea',
          }}
        />
      </div>
    );
  }

  if (item.type === 'planter') {
    return (
      <div style={sharedStyle}>
        <div
          style={{
            position: 'absolute',
            left: '18%',
            right: '18%',
            bottom: '16%',
            height: '24%',
            borderRadius: '10px 10px 18px 18px',
            background: '#c78d5d',
            border: `3px solid ${item.accent}`,
          }}
        />
        {['26%', '48%', '70%'].map((left, index) => (
          <div
            key={`${item.id}-vine-${left}`}
            style={{
              position: 'absolute',
              left,
              top: index === 1 ? '4%' : '10%',
              width: '10%',
              height: '58%',
              borderRadius: 999,
              background: index === 1 ? item.accent : item.color,
            }}
          />
        ))}
      </div>
    );
  }

  if (item.type === 'vase') {
    return (
      <div style={sharedStyle}>
        <div
          style={{
            position: 'absolute',
            left: '30%',
            right: '30%',
            top: '8%',
            height: '18%',
            borderRadius: 999,
            background: item.accent,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '18%',
            right: '18%',
            top: '18%',
            height: '52%',
            borderRadius: '42% 42% 34% 34% / 20% 20% 60% 60%',
            background: `linear-gradient(180deg, #ffffff, ${item.color} 40%, ${item.accent} 100%)`,
            border: `3px solid ${item.accent}`,
          }}
        />
        {['24%', '46%', '68%'].map((left, index) => (
          <div
            key={`${item.id}-vase-stem-${left}`}
            style={{
              position: 'absolute',
              left,
              top: `${index === 1 ? 0 : 6}%`,
              width: '7%',
              height: '24%',
              borderRadius: 999,
              background: index === 1 ? item.accent : item.color,
            }}
          />
        ))}
      </div>
    );
  }

  if (item.type === 'fountain') {
    return (
      <div style={sharedStyle}>
        <div
          style={{
            position: 'absolute',
            left: '12%',
            right: '12%',
            bottom: '10%',
            height: '18%',
            borderRadius: 18,
            background: item.accent,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '24%',
            right: '24%',
            bottom: '22%',
            height: '18%',
            borderRadius: 18,
            background: item.color,
            border: `3px solid ${item.accent}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '42%',
            top: '16%',
            width: '16%',
            height: '36%',
            borderRadius: 999,
            background: item.accent,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '32%',
            right: '32%',
            top: '10%',
            height: '22%',
            borderRadius: '50% 50% 18px 18px',
            background: `radial-gradient(circle at 50% 40%, #ffffff 0%, ${item.color} 52%, ${item.accent} 100%)`,
          }}
        />
      </div>
    );
  }

  if (item.type === 'table') {
    return (
      <div style={sharedStyle}>
        <div
          style={{
            position: 'absolute',
            left: '8%',
            right: '8%',
            top: '24%',
            height: '22%',
            borderRadius: 14,
            background: item.color,
            border: `3px solid ${item.accent}`,
          }}
        />
        {['18%', '72%'].map((left) => (
          <div
            key={`${item.id}-table-leg-${left}`}
            style={{
              position: 'absolute',
              left,
              top: '42%',
              width: '8%',
              height: '34%',
              borderRadius: 999,
              background: item.accent,
            }}
          />
        ))}
      </div>
    );
  }

  if (item.type === 'shelf') {
    return (
      <div style={sharedStyle}>
        <div
          style={{
            position: 'absolute',
            left: '10%',
            right: '10%',
            top: '10%',
            height: '68%',
            borderRadius: 16,
            background: item.color,
            border: `3px solid ${item.accent}`,
          }}
        />
        {[22, 44, 66].map((top) => (
          <div
            key={`${item.id}-shelf-${top}`}
            style={{
              position: 'absolute',
              left: '14%',
              right: '14%',
              top: `${top}%`,
              height: 6,
              borderRadius: 999,
              background: item.accent,
            }}
          />
        ))}
        {[20, 54].map((left, index) => (
          <div
            key={`${item.id}-shelf-item-${left}`}
            style={{
              position: 'absolute',
              left: `${left}%`,
              top: index === 0 ? '18%' : '48%',
              width: 12,
              height: 18,
              borderRadius: 6,
              background: index === 0 ? '#ffffff' : item.accent,
            }}
          />
        ))}
      </div>
    );
  }

  if (item.type === 'bench') {
    return (
      <div style={sharedStyle}>
        <div
          style={{
            position: 'absolute',
            left: '8%',
            right: '8%',
            top: '24%',
            height: '18%',
            borderRadius: 12,
            background: item.color,
            border: `3px solid ${item.accent}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '10%',
            right: '10%',
            bottom: '18%',
            height: '14%',
            borderRadius: 12,
            background: item.accent,
          }}
        />
        {['16%', '72%'].map((left) => (
          <div
            key={`${item.id}-bench-leg-${left}`}
            style={{
              position: 'absolute',
              left,
              top: '40%',
              width: '8%',
              height: '28%',
              borderRadius: 999,
              background: item.accent,
            }}
          />
        ))}
      </div>
    );
  }

  if (item.type === 'chest') {
    return (
      <div style={sharedStyle}>
        <div
          style={{
            position: 'absolute',
            left: '12%',
            right: '12%',
            top: '18%',
            height: '28%',
            borderRadius: '16px 16px 8px 8px',
            background: item.color,
            border: `3px solid ${item.accent}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '12%',
            right: '12%',
            bottom: '16%',
            height: '30%',
            borderRadius: '8px 8px 16px 16px',
            background: '#bb8b61',
            border: `3px solid ${item.accent}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '46%',
            top: '42%',
            width: '8%',
            height: '12%',
            borderRadius: 999,
            background: '#f7d67a',
          }}
        />
      </div>
    );
  }

  return (
    <div style={sharedStyle}>
      <div
        style={{
          position: 'absolute',
          left: '6%',
          right: '6%',
          bottom: '14%',
          height: '42%',
          borderRadius: 22,
          background: `linear-gradient(180deg, ${item.color}, ${item.accent})`,
          border: `3px solid ${item.accent}`,
          boxShadow: ghost ? '0 0 24px rgba(251, 146, 60, 0.24)' : '0 10px 18px rgba(251, 146, 60, 0.14)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '12%',
          top: '16%',
          width: '22%',
          height: '24%',
          borderRadius: 14,
          background: '#fffdf7',
          border: '2px solid rgba(255,255,255,0.9)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '36%',
          top: '16%',
          width: '22%',
          height: '24%',
          borderRadius: 14,
          background: '#fff7ed',
          border: '2px solid rgba(255,255,255,0.9)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: '8%',
          top: '22%',
          width: '20%',
          height: '14%',
          borderRadius: 999,
          background: '#fde68a',
          opacity: 0.9,
        }}
      />
    </div>
  );
};

const RoomThemeScene = ({ theme }) => {
  if (!theme) {
    return null;
  }

  const shape = (style) => ({
    position: 'absolute',
    pointerEvents: 'none',
    ...style,
  });

  if (theme.id === 'korean-garden') {
    return (
      <>
        {[10, 28, 48, 70].map((left, index) => (
          <div
            key={`mountain-${left}`}
            style={shape({
              left: `${left}%`,
              top: `${12 + (index % 2) * 2}%`,
              width: 148,
              height: 96,
              transform: 'translateX(-50%)',
              clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
              background: index % 2 === 0 ? 'rgba(87, 125, 116, 0.22)' : 'rgba(106, 145, 133, 0.18)',
            })}
          />
        ))}
        <div style={shape({ right: '8%', top: '10%', width: 136, height: 136, borderRadius: '50%', border: `10px solid ${theme.frame}`, background: 'rgba(255,255,255,0.28)', boxShadow: '0 0 0 14px rgba(255,255,255,0.08)' })} />
        <div style={shape({ left: '5%', top: '15%', width: 196, height: 120, borderRadius: '26px 26px 12px 12px', background: 'linear-gradient(180deg, #edf3ed, #c6d3c2)', border: `5px solid ${theme.frame}` })} />
        <div style={shape({ left: '2%', top: '8%', width: 214, height: 42, clipPath: 'polygon(8% 100%, 50% 0%, 92% 100%, 100% 100%, 96% 68%, 4% 68%, 0% 100%)', background: theme.frame })} />
        {[18, 28, 76, 84].map((offset, index) => (
          <div
            key={`bamboo-${offset}`}
            style={shape({
              left: `${offset}%`,
              top: `${18 + (index % 2) * 4}%`,
              width: 14,
              height: 148,
              borderRadius: 999,
              background: index < 2 ? '#6cab81' : '#578f75',
              boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.14)',
            })}
          />
        ))}
        {[16, 26, 74, 86].map((offset, index) => (
          <div
            key={`lantern-${offset}`}
            style={shape({
              left: `${offset}%`,
              top: `${18 + (index % 2) * 5}%`,
              width: 22,
              height: 34,
              borderRadius: '14px 14px 10px 10px',
              background: 'linear-gradient(180deg, #fff5bf, #f4b457)',
              border: `3px solid ${theme.frame}`,
              boxShadow: '0 0 22px rgba(244, 180, 87, 0.28)',
            })}
          />
        ))}
        <div style={shape({ left: '20%', right: '20%', bottom: '24%', height: 10, borderRadius: 999, background: '#84644d' })} />
        {[24, 34, 44, 54, 64, 74].map((left) => (
          <div key={`rail-${left}`} style={shape({ left: `${left}%`, bottom: '20%', width: 8, height: 34, borderRadius: 999, background: '#84644d' })} />
        ))}
        <div style={shape({ right: '8%', bottom: '10%', width: 184, height: 96, borderRadius: '50%', background: 'radial-gradient(circle at 50% 35%, rgba(180, 245, 255, 0.46) 0%, rgba(109, 186, 202, 0.24) 56%, rgba(109, 186, 202, 0.12) 100%)' })} />
        {[0, 1, 2].map((index) => (
          <div
            key={`stone-${index}`}
            style={shape({
              left: `${46 + index * 8}%`,
              bottom: `${12 + (index % 2) * 4}%`,
              width: 42,
              height: 22,
              borderRadius: 999,
              background: 'rgba(255,255,255,0.62)',
            })}
          />
        ))}
      </>
    );
  }

  if (theme.id === 'bavarian-castle') {
    return (
      <>
        {[18, 36, 54, 72].map((left, index) => (
          <div
            key={`alp-${left}`}
            style={shape({
              left: `${left}%`,
              top: `${14 + (index % 2) * 3}%`,
              width: 154,
              height: 102,
              transform: 'translateX(-50%)',
              clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
              background: index % 2 === 0 ? 'rgba(117, 131, 176, 0.2)' : 'rgba(92, 108, 155, 0.16)',
            })}
          />
        ))}
        {[10, 80].map((left) => (
          <div key={`tower-${left}`} style={shape({ left: `${left}%`, top: '10%', width: 82, height: 176, borderRadius: 22, background: 'linear-gradient(180deg, #fbf2ea, #d8c0b0)', border: `5px solid ${theme.frame}` })}>
            <div style={shape({ left: -8, top: -36, width: 96, height: 44, clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)', background: theme.frame })} />
            <div style={shape({ left: 12, top: 24, width: 54, height: 16, borderRadius: 999, background: '#efe3d8' })} />
          </div>
        ))}
        <div style={shape({ left: '16%', right: '16%', top: '18%', height: 146, borderRadius: '26px 26px 12px 12px', background: 'linear-gradient(180deg, rgba(255,255,255,0.42), rgba(255,255,255,0.12))', border: `5px solid ${theme.frame}` })} />
        {[24, 42, 58, 76].map((left) => (
          <div key={`window-${left}`} style={shape({ left: `${left}%`, top: '22%', width: 56, height: 108, borderRadius: '28px 28px 14px 14px', background: 'linear-gradient(180deg, rgba(219, 234, 254, 0.9), rgba(179, 201, 242, 0.68))', border: `5px solid ${theme.frame}` })} />
        ))}
        {[30, 50, 68].map((left) => (
          <div key={`banner-${left}`} style={shape({ left: `${left}%`, top: '14%', width: 30, height: 102, borderRadius: 18, background: `linear-gradient(180deg, ${theme.accent}, #8e3056)`, clipPath: 'polygon(0 0, 100% 0, 100% 82%, 50% 100%, 0 82%)' })} />
        ))}
        <div style={shape({ left: '24%', right: '24%', bottom: '22%', height: 16, borderRadius: 999, background: '#8b6851' })} />
        {[28, 38, 48, 58, 68].map((left) => (
          <div key={`baluster-${left}`} style={shape({ left: `${left}%`, bottom: '18%', width: 10, height: 44, borderRadius: 999, background: '#8b6851' })} />
        ))}
        <div style={shape({ left: '50%', top: '12%', transform: 'translateX(-50%)', width: 84, height: 42, borderRadius: '0 0 28px 28px', background: 'linear-gradient(180deg, #f6d58f, #d9a85c)', boxShadow: '0 0 28px rgba(247, 210, 129, 0.26)' })} />
      </>
    );
  }

  if (theme.id === 'spanish-palace') {
    return (
      <>
        {[18, 40, 62, 84].map((left, index) => (
          <div
            key={`palm-${left}`}
            style={shape({
              left: `${left}%`,
              top: `${16 + (index % 2) * 3}%`,
              width: 8,
              height: 86,
              background: 'rgba(132, 101, 52, 0.2)',
              borderRadius: 999,
              transform: 'translateX(-50%) rotate(8deg)',
            })}
          />
        ))}
        {[8, 32, 56, 80].map((left) => (
          <div key={`arch-${left}`} style={shape({ left: `${left}%`, top: '14%', width: 106, height: 146, borderRadius: '56px 56px 18px 18px', border: `6px solid ${theme.frame}`, background: 'linear-gradient(180deg, rgba(255,255,255,0.32), rgba(255,255,255,0.12))' })} />
        ))}
        {[10, 34, 58, 82].map((left) => (
          <div key={`lamp-${left}`} style={shape({ left: `${left}%`, top: '10%', width: 18, height: 28, borderRadius: '12px 12px 10px 10px', background: 'linear-gradient(180deg, #fff6c3, #f7bc62)', border: `3px solid ${theme.frame}`, boxShadow: '0 0 18px rgba(247, 188, 98, 0.28)' })} />
        ))}
        <div style={shape({ left: '50%', bottom: '16%', transform: 'translateX(-50%)', width: 114, height: 114, borderRadius: '50%', background: 'radial-gradient(circle at 50% 40%, rgba(147, 232, 255, 0.4) 0%, rgba(28,154,183,0.18) 60%, rgba(28,154,183,0.08) 100%)', border: `6px solid ${theme.accent}` })} />
        <div style={shape({ left: '50%', bottom: '40%', transform: 'translateX(-50%)', width: 22, height: 54, borderRadius: 999, background: '#ffffff' })} />
        <div style={shape({ left: '50%', bottom: '51%', transform: 'translateX(-50%)', width: 66, height: 18, borderRadius: 999, background: 'rgba(255,255,255,0.76)' })} />
        <div style={shape({ left: 0, right: 0, bottom: '8%', height: 28, background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.24) 0 18px, rgba(28,154,183,0.28) 18px 36px, rgba(194,104,69,0.22) 36px 54px, rgba(255,255,255,0.24) 54px 72px)' })} />
      </>
    );
  }

  if (theme.id === 'mesoamerican-pyramid') {
    return (
      <>
        {[18, 34, 50, 66, 82].map((left, index) => (
          <div
            key={`canopy-${left}`}
            style={shape({
              left: `${left}%`,
              top: `${14 + (index % 2) * 2}%`,
              width: 96,
              height: 58,
              transform: 'translateX(-50%)',
              clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
              background: index % 2 === 0 ? 'rgba(92, 128, 71, 0.12)' : 'rgba(63, 102, 55, 0.12)',
            })}
          />
        ))}
        <div style={shape({ left: '50%', top: '12%', transform: 'translateX(-50%)', width: 236, height: 182, clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)', background: 'rgba(124, 83, 46, 0.24)' })} />
        <div style={shape({ left: '50%', top: '18%', transform: 'translateX(-50%)', width: 198, height: 160, clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)', background: 'linear-gradient(180deg, #cda16f, #936039)' })} />
        {[0, 1, 2, 3, 4].map((step) => (
          <div
            key={`step-${step}`}
            style={shape({
              left: `${22 + step * 5}%`,
              top: `${46 + step * 7}%`,
              width: `${56 - step * 9}%`,
              height: 22,
              background: step % 2 === 0 ? '#d4a26b' : '#b77c49',
              border: `3px solid ${theme.frame}`,
            })}
          />
        ))}
        <div style={shape({ left: '50%', top: '7%', transform: 'translateX(-50%)', width: 96, height: 96, borderRadius: '50%', background: 'radial-gradient(circle at 50% 50%, rgba(255, 238, 163, 0.95) 0%, rgba(255, 223, 107, 0.78) 56%, rgba(255, 223, 107, 0.18) 100%)' })} />
        <div style={shape({ left: '50%', top: '22%', transform: 'translateX(-50%)', width: 48, height: 24, background: '#6d452b', borderRadius: 8 })} />
        {[18, 76].map((left) => (
          <div key={`torch-${left}`} style={shape({ left: `${left}%`, bottom: '18%', width: 18, height: 86, borderRadius: 999, background: theme.frame })}>
            <div style={shape({ left: -10, top: -22, width: 38, height: 30, borderRadius: '50% 50% 45% 45%', background: 'radial-gradient(circle at 50% 18%, #fff7cc 0%, #ffdf6b 58%, #f59e0b 100%)', boxShadow: '0 0 18px rgba(255, 223, 107, 0.26)' })} />
          </div>
        ))}
        {[18, 34, 50, 66, 82].map((left) => (
          <div key={`glyph-${left}`} style={shape({ left: `${left}%`, bottom: '8%', width: 34, height: 20, borderRadius: 6, background: 'rgba(111, 69, 44, 0.24)', border: `2px solid rgba(111, 69, 44, 0.28)` })} />
        ))}
      </>
    );
  }

  if (theme.id === 'grecoroman-circus') {
    return (
      <>
        <div style={shape({ left: '10%', right: '10%', top: '12%', height: 34, borderRadius: 999, background: 'rgba(255,255,255,0.3)' })} />
        {[10, 26, 42, 58, 74, 90].map((left) => (
          <div key={`column-${left}`} style={shape({ left: `${left}%`, top: '16%', width: 26, height: 148, borderRadius: 999, background: '#f7efe5', border: `3px solid ${theme.frame}` })} />
        ))}
        {[16, 32, 48, 64, 80].map((left) => (
          <div key={`arch-${left}`} style={shape({ left: `${left}%`, top: '14%', width: 74, height: 108, borderRadius: '38px 38px 12px 12px', background: 'rgba(255,255,255,0.18)', border: `4px solid rgba(255,255,255,0.26)` })} />
        ))}
        <div style={shape({ left: '50%', bottom: '18%', transform: 'translateX(-50%)', width: '82%', height: 108, borderRadius: '50%', background: 'radial-gradient(circle at 50% 50%, rgba(214, 85, 110, 0.16) 0%, rgba(214, 85, 110, 0.08) 62%, rgba(255,255,255,0) 100%)', border: `5px solid ${theme.accent}` })} />
        <div style={shape({ left: '50%', bottom: '24%', transform: 'translateX(-50%)', width: '56%', height: 42, borderRadius: 999, background: 'rgba(255,255,255,0.28)' })} />
        {[14, 26, 38, 50, 62, 74, 86].map((left) => (
          <div key={`garland-${left}`} style={shape({ left: `${left}%`, top: '9%', width: 28, height: 38, background: left % 24 === 14 ? theme.accent : theme.frame, clipPath: 'polygon(0 0, 100% 0, 50% 100%)' })} />
        ))}
        {[22, 50, 78].map((left) => (
          <div key={`banner-${left}`} style={shape({ left: `${left}%`, top: '14%', width: 24, height: 86, borderRadius: 16, background: `linear-gradient(180deg, ${theme.accent}, #8f3c4f)`, clipPath: 'polygon(0 0, 100% 0, 100% 78%, 50% 100%, 0 78%)' })} />
        ))}
      </>
    );
  }

  if (theme.id === 'scandinavian-longhouse') {
    return (
      <>
        {[12, 28, 44, 60, 76, 92].map((left) => (
          <div key={`beam-${left}`} style={shape({ left: `${left}%`, top: '8%', width: 20, height: '76%', borderRadius: 999, background: theme.frame, opacity: 0.92 })} />
        ))}
        {[8, 24, 40, 56, 72].map((left) => (
          <div key={`rafter-left-${left}`} style={shape({ left: `${left}%`, top: '5%', width: 102, height: 16, transform: 'rotate(34deg)', transformOrigin: 'left center', background: theme.frame, borderRadius: 999 })} />
        ))}
        {[20, 36, 52, 68, 84].map((left) => (
          <div key={`rafter-right-${left}`} style={shape({ left: `${left}%`, top: '5%', width: 102, height: 16, transform: 'rotate(-34deg)', transformOrigin: 'right center', background: theme.frame, borderRadius: 999 })} />
        ))}
        {[14, 44, 74].map((left) => (
          <div key={`window-${left}`} style={shape({ left: `${left}%`, top: '20%', width: 84, height: 74, borderRadius: 18, background: 'linear-gradient(180deg, rgba(226, 241, 251, 0.82), rgba(186, 209, 230, 0.55))', border: `4px solid #5e4635` })} />
        ))}
        <div style={shape({ left: '50%', bottom: '14%', transform: 'translateX(-50%)', width: 156, height: 156, borderRadius: '50%', background: 'radial-gradient(circle at 50% 50%, rgba(242, 153, 74, 0.24) 0%, rgba(242, 153, 74, 0.08) 62%, rgba(255,255,255,0) 100%)' })} />
        <div style={shape({ left: '50%', bottom: '24%', transform: 'translateX(-50%)', width: 82, height: 82, borderRadius: '50%', background: theme.accent, opacity: 0.55 })} />
        {[24, 68].map((left) => (
          <div key={`shield-${left}`} style={shape({ left: `${left}%`, top: '22%', width: 60, height: 60, borderRadius: '50%', background: '#d8c0a2', border: `4px solid ${theme.frame}` })} />
        ))}
        <div style={shape({ left: '50%', top: '18%', transform: 'translateX(-50%)', width: 78, height: 20, borderRadius: 999, background: '#caa36d' })} />
      </>
    );
  }

  if (theme.id === 'japanese-fortress') {
    return (
      <>
        {[18, 34, 52, 70, 86].map((left, index) => (
          <div
            key={`roof-${left}`}
            style={shape({
              left: `${left}%`,
              top: `${10 + (index % 2) * 5}%`,
              width: 110,
              height: 62,
              transform: 'translateX(-50%)',
              clipPath: 'polygon(14% 100%, 0 54%, 50% 0, 100% 54%, 86% 100%)',
              background: index === 2 ? 'rgba(47, 64, 91, 0.32)' : 'rgba(47, 64, 91, 0.2)',
            })}
          />
        ))}
        <div style={shape({ left: '78%', top: '10%', width: 90, height: 90, borderRadius: '50%', background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.28) 48%, rgba(255,255,255,0) 100%)' })} />
        <div style={shape({ left: 0, right: 0, top: '10%', height: 28, background: theme.frame })} />
        <div style={shape({ left: '6%', right: '6%', top: '18%', height: 144, borderRadius: 18, background: 'linear-gradient(180deg, rgba(255,255,255,0.24), rgba(255,255,255,0.08))', border: `5px solid ${theme.frame}` })} />
        {[12, 30, 48, 66, 84].map((left) => (
          <div key={`shoji-${left}`} style={shape({ left: `${left}%`, top: '20%', width: 2, height: 126, background: theme.frame, opacity: 0.55 })} />
        ))}
        {[28, 46, 64, 82].map((top) => (
          <div key={`shoji-row-${top}`} style={shape({ left: '8%', right: '8%', top: `${top}%`, height: 2, background: theme.frame, opacity: 0.38 })} />
        ))}
        <div style={shape({ left: '12%', bottom: '16%', width: 154, height: 14, borderRadius: 999, background: '#8f7357' })} />
        {[16, 36, 56].map((left) => (
          <div key={`bridge-post-${left}`} style={shape({ left: `${left}%`, bottom: '16%', width: 12, height: 58, borderRadius: 999, background: '#8f7357' })} />
        ))}
        <div style={shape({ left: '46%', bottom: '10%', width: 150, height: 48, borderRadius: '50%', background: 'rgba(245, 138, 172, 0.16)' })} />
        {[62, 68, 74, 80].map((left, index) => (
          <div key={`blossom-${left}`} style={shape({ left: `${left}%`, top: `${24 + (index % 2) * 6}%`, width: 22, height: 22, borderRadius: '50%', background: index % 2 === 0 ? '#ffd5e3' : '#f58aac' })} />
        ))}
        {[14, 84].map((left) => (
          <div key={`lantern-${left}`} style={shape({ left: `${left}%`, top: '18%', width: 20, height: 34, borderRadius: '12px 12px 10px 10px', background: 'linear-gradient(180deg, #fff1d2, #f5c17e)', border: `3px solid ${theme.frame}`, boxShadow: '0 0 18px rgba(245, 193, 126, 0.22)' })} />
        ))}
      </>
    );
  }

  if (theme.id === 'babylonian-hanging-gardens') {
    return (
      <>
        {[10, 36, 62].map((left, index) => (
          <div key={`arch-${left}`} style={shape({ left: `${left}%`, top: `${14 + index * 4}%`, width: 122, height: 148, borderRadius: '28px 28px 14px 14px', background: index === 1 ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.12)', border: `5px solid ${theme.frame}` })} />
        ))}
        {[8, 34, 60].map((left, index) => (
          <div key={`terrace-${left}`} style={shape({ left: `${left}%`, top: `${18 + index * 8}%`, width: 104, height: 118, borderRadius: '18px 18px 12px 12px', background: index === 1 ? '#c6a46e' : '#b88d58', border: `4px solid ${theme.frame}` })} />
        ))}
        {[14, 24, 40, 50, 66, 76].map((left) => (
          <div key={`vine-${left}`} style={shape({ left: `${left}%`, top: '16%', width: 18, height: 170, borderRadius: 999, background: 'linear-gradient(180deg, #6ed39a, #467d6d)' })} />
        ))}
        {[20, 46, 72].map((left) => (
          <div key={`water-${left}`} style={shape({ left: `${left}%`, top: '48%', width: 50, height: 14, borderRadius: 999, background: 'rgba(132, 218, 255, 0.64)' })} />
        ))}
        {[22, 28, 48, 54, 74, 80].map((left, index) => (
          <div key={`flower-${left}`} style={shape({ left: `${left}%`, top: `${24 + (index % 2) * 18}%`, width: 20, height: 20, borderRadius: '50%', background: index % 2 === 0 ? '#ffd76b' : '#ff9ec0' })} />
        ))}
        <div style={shape({ left: '50%', bottom: '18%', transform: 'translateX(-50%)', width: '70%', height: 22, borderRadius: 999, background: 'rgba(84, 136, 113, 0.24)' })} />
      </>
    );
  }

  if (theme.id === 'future-sky-dome') {
    return (
      <>
        <div style={shape({ left: '12%', top: '10%', width: 86, height: 86, borderRadius: '50%', background: 'radial-gradient(circle at 50% 50%, rgba(240, 248, 255, 0.9) 0%, rgba(175, 224, 255, 0.22) 54%, rgba(175,224,255,0) 100%)' })} />
        <div style={shape({ right: '18%', top: '16%', width: 122, height: 44, borderRadius: '50%', border: '4px solid rgba(191,225,255,0.42)', transform: 'rotate(-12deg)' })} />
        <div
          style={shape({
            left: '10%',
            right: '10%',
            top: '6%',
            height: '60%',
            borderRadius: '50% 50% 18px 18px / 68% 68% 18px 18px',
            border: `4px solid ${theme.frame}`,
            background:
              'radial-gradient(circle at 50% 18%, rgba(133, 241, 255, 0.38) 0%, rgba(255,255,255,0.08) 42%, rgba(255,255,255,0.02) 100%)',
          })}
        />
        {[
          { left: '18%', top: '18%', size: 8 },
          { left: '28%', top: '14%', size: 6 },
          { left: '42%', top: '22%', size: 10 },
          { left: '58%', top: '12%', size: 7 },
          { left: '72%', top: '20%', size: 8 },
        ].map((star, index) => (
          <div
            key={`star-${index}`}
            style={shape({
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              borderRadius: '50%',
              background: '#f8fcff',
              boxShadow: `0 0 14px ${theme.accent}`,
            })}
          />
        ))}
        {[20, 36, 52, 68].map((left) => (
          <div
            key={`rib-${left}`}
            style={shape({
              left: `${left}%`,
              top: '8%',
              width: 2,
              height: '56%',
              background: theme.frame,
              opacity: 0.42,
            })}
          />
        ))}
        <div style={shape({ left: '16%', right: '16%', bottom: '28%', height: 10, borderRadius: 999, background: 'rgba(133, 241, 255, 0.18)' })} />
        <div
          style={shape({
            left: '50%',
            bottom: '24%',
            transform: 'translateX(-50%)',
            width: 164,
            height: 26,
            borderRadius: 999,
            background: 'rgba(133, 241, 255, 0.2)',
            border: `3px solid ${theme.accent}`,
          })}
        />
        <div style={shape({ left: '50%', bottom: '14%', transform: 'translateX(-50%)', width: '76%', height: 18, clipPath: 'polygon(8% 0%, 92% 0%, 100% 100%, 0% 100%)', background: 'linear-gradient(180deg, rgba(133,241,255,0.28), rgba(133,241,255,0.08))' })} />
        {[22, 48, 74].map((left, index) => (
          <div
            key={`console-${left}`}
            style={shape({
              left: `${left}%`,
              bottom: `${14 + (index % 2) * 8}%`,
              width: 54,
              height: 36,
              borderRadius: 14,
              background: index === 1 ? '#d7e8ff' : '#b2c7f1',
              border: `3px solid ${theme.frame}`,
            })}
          />
        ))}
        {[16, 28, 40, 60, 72, 84].map((left, index) => (
          <div
            key={`city-${left}`}
            style={shape({
              left: `${left}%`,
              bottom: '30%',
              width: 18 + (index % 3) * 12,
              height: 42 + (index % 2) * 24,
              background: 'rgba(63, 95, 168, 0.34)',
              borderRadius: '8px 8px 0 0',
            })}
          />
        ))}
      </>
    );
  }

  return null;
};

const BuilderRoom = ({ house, onBack, onAddFurniture, onMoveFurniture, onRemoveFurniture }) => {
  const houseId = house?.id ?? null;
  const roomWidth = house?.room?.width ?? BUILDER_ROOM_GRID_SIZE * 10;
  const roomHeight = house?.room?.height ?? BUILDER_ROOM_GRID_SIZE * 7;
  const roomTheme = house?.roomTheme;
  const trayItems = getFurnitureCatalogForRoom(roomTheme?.id, houseId || roomTheme?.id);
  const roomRef = useRef(null);
  const removeZoneRef = useRef(null);
  const [dragState, setDragState] = useState(null);
  const [layoutMode, setLayoutMode] = useState(getRoomLayoutMode);
  const screenInset = layoutMode.compact ? 10 : 14;
  const topOverlayInset = layoutMode.compact ? 12 : 18;
  const contentGap = layoutMode.compact ? 10 : 14;
  const stageTopInset = layoutMode.compact ? 96 : 110;
  const sidebarWidth = layoutMode.compact ? 228 : 280;
  const sidebarRailHeight = layoutMode.stacked ? (layoutMode.compact ? 110 : 120) : 0;
  const dockBottomInset = screenInset;
  const trayDockHeight = layoutMode.compact ? 134 : 126;
  const mainPaneRightInset = layoutMode.stacked
    ? topOverlayInset
    : topOverlayInset + sidebarWidth + contentGap;
  const stageBottomInset =
    dockBottomInset +
    trayDockHeight +
    contentGap +
    (layoutMode.stacked ? sidebarRailHeight + contentGap : 0);
  const roomStageScale = getRoomStageScale(
    roomWidth,
    roomHeight,
    layoutMode,
    layoutMode.viewportWidth - topOverlayInset - mainPaneRightInset,
    layoutMode.viewportHeight - stageTopInset - stageBottomInset
  );
  const roomDisplayWidth = Math.round(roomWidth * roomStageScale);
  const roomDisplayHeight = Math.round(roomHeight * roomStageScale);
  const runtimeIdentity = `${houseId}:${roomWidth}:${roomHeight}:${roomTheme?.id || 'room'}`;
  const roomRuntimeRef = useRef(
    createInitialRoomRuntime(roomWidth, roomHeight, roomTheme, houseId)
  );
  const [roomRuntime, setRoomRuntime] = useState(() =>
    createInitialRoomRuntime(roomWidth, roomHeight, roomTheme, houseId)
  );
  const roomItems = [...(house?.room?.items ?? [])].sort((left, right) => left.y - right.y);
  const roomSocialState = buildRoomSocialState(
    roomRuntime,
    roomTheme,
    roomWidth,
    roomHeight,
    houseId || roomTheme?.id || 'room'
  );
  const roomReactionState = buildRoomReactionState(roomItems, roomSocialState, roomTheme);
  const npcActors = roomSocialState.npcs;
  const roomRuntimeSnapshot = buildRoomRuntimeSnapshot(
    roomSocialState,
    roomReactionState,
    roomTheme
  );
  const roomActors = [
    ...npcActors.map((actor) => ({
      ...actor,
      kind: 'npc',
    })),
    roomSocialState.player
      ? {
          ...roomSocialState.player,
          kind: 'player',
        }
      : null,
  ]
    .filter(Boolean)
    .sort((left, right) => left.y - right.y);
  const reactiveItemMap = new Map(
    roomReactionState.reactiveItems.map((item) => [item.id, item])
  );
  const castActors = [roomSocialState.player, ...npcActors].filter(Boolean);
  const roomVoiceSpeaker = roomSocialState.social?.activeLine?.speaker || 'Room';
  const roomVoiceText =
    roomSocialState.social?.activeLine?.text || 'Waiting for the next hello.';
  const roomVoiceMeta = roomSocialState.social?.interaction
    ? `${roomSocialState.social.interaction.personality} friend / ${Math.round(
        roomSocialState.social.interaction.niceness * 100
      )}% nice / ${roomSocialState.social.interaction.source === 'click' ? 'tap hello' : 'nearby hello'}`
    : null;
  const roomEchoText = roomReactionState.activeReaction
    ? `${roomReactionState.activeReaction.itemName} answers with ${roomReactionState.activeReaction.beatLabel || roomReactionState.activeReaction.reactionLabel}.`
    : roomItems.length === 0
      ? 'Add decor near the cast to wake the room.'
      : 'Move decor near the cast to wake the room.';
  const roomEchoStatus = roomReactionState.activeReaction
    ? `${roomReactionState.activeReaction.count} piece${roomReactionState.activeReaction.count === 1 ? '' : 's'} answering now`
    : 'Nearby voices stir lamps, seats, plants, and treasures.';
  const introPlayer = createInitialRoomRuntime(roomWidth, roomHeight, roomTheme, houseId).player;
  const playerHasStartedMoving = roomRuntime.player
    ? Math.hypot(
        roomRuntime.player.x - introPlayer.x,
        roomRuntime.player.y - introPlayer.y
      ) > 12
      || Math.hypot(
        roomRuntime.player.targetX - introPlayer.x,
        roomRuntime.player.targetY - introPlayer.y
      ) > 12
    : false;
  const showIntroHint =
    roomItems.length === 0
    && !dragState?.insideRoom
    && !playerHasStartedMoving
    && !roomSocialState.social?.activeLine;

  useEffect(() => {
    const visualViewport = window.visualViewport;
    const handleResize = () => {
      setLayoutMode(getRoomLayoutMode());
    };

    window.addEventListener('resize', handleResize);
    if (visualViewport) {
      visualViewport.addEventListener('resize', handleResize);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (visualViewport) {
        visualViewport.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverscroll = document.body.style.overscrollBehavior;
    const previousHtmlOverscroll = document.documentElement.style.overscrollBehavior;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';
    document.documentElement.style.overscrollBehavior = 'none';

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overscrollBehavior = previousBodyOverscroll;
      document.documentElement.style.overscrollBehavior = previousHtmlOverscroll;
    };
  }, []);

  useEffect(() => {
    const initialRuntime = createInitialRoomRuntime(roomWidth, roomHeight, roomTheme, houseId);
    roomRuntimeRef.current = initialRuntime;
    setRoomRuntime(initialRuntime);
    setDragState(null);
  }, [runtimeIdentity, roomWidth, roomHeight, roomTheme, houseId]);

  useEffect(() => {
    roomRuntimeRef.current = roomRuntime;
  }, [roomRuntime]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    window.__builderRoomRuntime = roomRuntimeSnapshot;

    return () => {
      if (window.__builderRoomRuntime === roomRuntimeSnapshot) {
        window.__builderRoomRuntime = undefined;
      }
    };
  }, [roomRuntimeSnapshot]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const advanceRuntime = (ms = 1000 / 60) => {
      setRoomRuntime((current) => {
        const next = advanceRoomRuntime(current, ms, roomWidth, roomHeight, roomTheme, houseId);
        roomRuntimeRef.current = next;
        return next;
      });
    };

    window.__advanceBuilderRoom = advanceRuntime;

    return () => {
      if (window.__advanceBuilderRoom === advanceRuntime) {
        window.__advanceBuilderRoom = undefined;
      }
    };
  }, [runtimeIdentity, roomWidth, roomHeight, roomTheme, houseId]);

  useEffect(() => {
    let animationFrameId = null;
    let lastTimestamp = null;

    const tick = (timestamp) => {
      if (lastTimestamp === null) {
        lastTimestamp = timestamp;
      }

      const deltaMs = Math.min(34, timestamp - lastTimestamp);
      lastTimestamp = timestamp;

      setRoomRuntime((current) => {
        const next = advanceRoomRuntime(
          current,
          deltaMs,
          roomWidth,
          roomHeight,
          roomTheme,
          houseId
        );
        roomRuntimeRef.current = next;
        return next;
      });

      animationFrameId = window.requestAnimationFrame(tick);
    };

    animationFrameId = window.requestAnimationFrame(tick);

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [runtimeIdentity, roomWidth, roomHeight, roomTheme, houseId]);

  useEffect(() => {
    if (!dragState || !roomRef.current) {
      return undefined;
    }

    const handlePointerMove = (event) => {
      if (event.pointerId !== dragState.pointerId || !roomRef.current) {
        return;
      }

      const dropState = getRoomDropState(
        roomRef.current,
        dragState.item,
        dragState.pointerOffset,
        event.clientX,
        event.clientY
      );

      const insideRemoveZone =
        dragState.source === 'room'
          ? isPointerInsideBounds(removeZoneRef.current, event.clientX, event.clientY)
          : false;

      setDragState((current) =>
        current && current.pointerId === event.pointerId
          ? {
              ...current,
              insideRoom: dropState.insideRoom,
              insideRemoveZone,
              previewX: dropState.snapped.x,
              previewY: dropState.snapped.y,
            }
          : current
      );
    };

    const handlePointerUp = (event) => {
      if (event.pointerId !== dragState.pointerId) {
        return;
      }

      if (dragState.source === 'room' && dragState.insideRemoveZone) {
        onRemoveFurniture(houseId, dragState.item.id);
      } else if (dragState.insideRoom) {
        if (dragState.source === 'tray') {
          onAddFurniture(houseId, dragState.item.typeId, {
            x: dragState.previewX,
            y: dragState.previewY,
          });
        } else {
          onMoveFurniture(houseId, dragState.item.id, {
            x: dragState.previewX,
            y: dragState.previewY,
          });
        }
      }

      setDragState(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [dragState, houseId, onAddFurniture, onMoveFurniture, onRemoveFurniture]);

  const beginTrayDrag = (furniture, event) => {
    event.preventDefault();

    setDragState({
      pointerId: event.pointerId,
      source: 'tray',
      item: {
        ...furniture,
        typeId: furniture.id,
      },
      pointerOffset: {
        x: furniture.width / 2,
        y: furniture.height / 2,
      },
      previewX: 0,
      previewY: 0,
      insideRoom: false,
      insideRemoveZone: false,
    });
  };

  const beginPlacedItemDrag = (item, event) => {
    event.preventDefault();

    const bounds = event.currentTarget.getBoundingClientRect();
    const scale = bounds.width > 0 && item.width > 0 ? bounds.width / item.width : 1;
    setDragState({
      pointerId: event.pointerId,
      source: 'room',
      item,
      pointerOffset: {
        x: (event.clientX - bounds.left) / scale,
        y: (event.clientY - bounds.top) / scale,
      },
      previewX: item.x,
      previewY: item.y,
      insideRoom: true,
      insideRemoveZone: false,
    });
  };

  const handleRoomPointerDown = (event) => {
    if (dragState || !roomRef.current || event.button !== 0) {
      return;
    }

    if (
      event.target instanceof Element &&
      event.target.closest('[data-room-item="true"]')
    ) {
      return;
    }

    const bounds = roomRef.current.getBoundingClientRect();
    const scale =
      bounds.width > 0 && roomRef.current.clientWidth > 0
        ? bounds.width / roomRef.current.clientWidth
        : 1;
    const player =
      roomRuntimeRef.current.player
      || createInitialRoomRuntime(roomWidth, roomHeight, roomTheme, houseId).player;
    const walkBounds = getRoomWalkBounds(roomWidth, roomHeight, player.width, player.height);
    const nextTargetX = clamp(
      (event.clientX - bounds.left) / scale - player.width / 2,
      walkBounds.xMin,
      walkBounds.xMax
    );
    const nextTargetY = clamp(
      (event.clientY - bounds.top) / scale - player.height / 2,
      walkBounds.yMin,
      walkBounds.yMax
    );

    setRoomRuntime((current) => {
      const next = {
        ...current,
        player: {
          ...current.player,
          targetX: nextTargetX,
          targetY: nextTargetY,
          focusNpcId: null,
          facing: nextTargetX < current.player.x ? -1 : 1,
        },
        interaction: null,
      };
      roomRuntimeRef.current = next;
      return next;
    });
  };

  const handleNpcPointerDown = (actor, event) => {
    if (dragState || event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    setRoomRuntime((current) => {
      if (!current.player) {
        return current;
      }

      const liveNpc = getNpcActors(
        roomTheme,
        roomWidth,
        roomHeight,
        current.timeMs,
        houseId || roomTheme?.id || 'room'
      ).find(
        (npc) => npc.id === actor.id
      );

      if (!liveNpc) {
        return current;
      }

      const greetingTarget = getRoomNpcGreetingTarget(
        liveNpc,
        current.player,
        roomWidth,
        roomHeight
      );
      const next = {
        ...current,
        player: {
          ...current.player,
          targetX: greetingTarget.x,
          targetY: greetingTarget.y,
          focusNpcId: actor.id,
          facing: greetingTarget.x < current.player.x ? -1 : 1,
        },
        interaction: {
          npcId: actor.id,
          source: 'click',
          phase: 'approach',
          startedAt: current.timeMs,
          engagedAt: null,
          endAt: null,
        },
      };
      roomRuntimeRef.current = next;
      return next;
    });
  };
  const overlayCardStyle = {
    background: 'rgba(255,255,255,0.74)',
    borderRadius: 22,
    border: '1px solid rgba(255,255,255,0.82)',
    boxShadow: '0 18px 34px rgba(15, 23, 42, 0.14)',
    backdropFilter: 'blur(14px)',
  };
  const compactLabelStyle = {
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    opacity: 0.7,
  };
  const sidebarContainerStyle = layoutMode.stacked
    ? {
        position: 'absolute',
        left: topOverlayInset,
        right: topOverlayInset,
        bottom: dockBottomInset + trayDockHeight + contentGap,
        height: sidebarRailHeight,
        display: 'flex',
        alignItems: 'stretch',
        gap: 10,
        zIndex: 24,
        overflowX: 'auto',
        overflowY: 'hidden',
        paddingBottom: 2,
        scrollbarWidth: 'thin',
      }
    : {
        position: 'absolute',
        right: topOverlayInset,
        top: stageTopInset,
        bottom: dockBottomInset,
        width: sidebarWidth,
        display: 'grid',
        alignContent: 'start',
        gap: 10,
        zIndex: 24,
        overflowY: 'auto',
        paddingRight: 2,
        paddingBottom: 2,
        scrollbarWidth: 'thin',
      };
  const sidebarCardStyle = {
    ...overlayCardStyle,
    padding: layoutMode.compact ? '10px 12px' : '12px 14px',
    display: 'grid',
    gap: layoutMode.compact ? 6 : 8,
    minWidth: layoutMode.stacked ? (layoutMode.compact ? 188 : 216) : undefined,
    flexShrink: 0,
  };
  const sidebarStatCardStyle = {
    ...overlayCardStyle,
    padding: layoutMode.compact ? '12px 14px' : '14px 16px',
    display: 'grid',
    gap: 4,
    minWidth: layoutMode.stacked ? 164 : undefined,
    flexShrink: 0,
  };
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100dvh',
        overflow: 'hidden',
        color: '#17345c',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 20% 10%, rgba(255,255,255,0.62) 0%, rgba(255,255,255,0) 36%), linear-gradient(180deg, rgba(255,249,240,0.8), rgba(244,244,238,0.72))',
        }}
      />
      <div
        style={{
          ...panelStyle,
          position: 'absolute',
          inset: screenInset,
          borderRadius: 32,
          overflow: 'hidden',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: topOverlayInset,
          right: topOverlayInset,
          top: topOverlayInset,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 16,
          zIndex: 40,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            ...overlayCardStyle,
            padding: layoutMode.compact ? '12px 14px' : '14px 18px',
            maxWidth: layoutMode.compact ? 'calc(100vw - 142px)' : 520,
            pointerEvents: 'auto',
          }}
        >
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: 1.4,
                textTransform: 'uppercase',
                opacity: 0.72,
                marginBottom: 8,
              }}
            >
              P2 Room Builder
            </div>
            <h2
              style={{
                fontSize: layoutMode.compact ? 'clamp(26px, 6vw, 34px)' : 'clamp(30px, 4vw, 44px)',
                lineHeight: 1.04,
                margin: 0,
                whiteSpace: 'pre-line',
              }}
            >
              {`${roomTheme?.name || house.name}\ninvites soft snaps`}
            </h2>
            <div style={{ marginTop: 8, fontSize: 15, opacity: 0.76 }}>
              {roomTheme?.tagline || 'storybook room shell'}
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
            pointerEvents: 'auto',
          }}
        >
          <div
            style={{
              ...overlayCardStyle,
              padding: '10px 14px',
              display: 'grid',
              gap: 2,
              minWidth: 108,
            }}
          >
            <div style={compactLabelStyle}>Furnished</div>
            <div style={{ fontSize: 24, fontWeight: 800, lineHeight: 1 }}>{roomItems.length}</div>
          </div>
          <button id="builder-room-back-btn" type="button" onClick={onBack} style={actionButtonStyle}>
            Back To World
          </button>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: topOverlayInset,
          right: mainPaneRightInset,
          top: stageTopInset,
          bottom: stageBottomInset,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                id="builder-room-grid"
                style={{
                  position: 'relative',
                  width: roomDisplayWidth + (layoutMode.compact ? 10 : 14),
                  height: roomDisplayHeight + (layoutMode.compact ? 10 : 14),
                  padding: layoutMode.compact ? 5 : 7,
                  borderRadius: 28,
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0.08))',
                  boxShadow: '0 24px 44px rgba(15, 23, 42, 0.16)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                    margin: 'auto',
                    width: roomDisplayWidth,
                    height: roomDisplayHeight,
                  }}
                >
                  <div
                    id="builder-room-stage"
                    ref={roomRef}
                    onPointerDown={handleRoomPointerDown}
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                    width: roomWidth,
                    height: roomHeight,
                    transform: `scale(${roomStageScale})`,
                    transformOrigin: 'top left',
                    borderRadius: 20,
                    overflow: 'hidden',
                    backgroundColor: roomTheme?.wallTop || '#fffdf8',
                    boxShadow: dragState?.insideRoom
                      ? `inset 0 0 0 3px ${roomTheme?.accent || 'rgba(96, 165, 250, 0.34)'}, 0 26px 60px rgba(15, 23, 42, 0.18)`
                      : `inset 0 0 0 2px ${roomTheme?.frame || 'rgba(23, 52, 92, 0.08)'}, 0 22px 52px rgba(15, 23, 42, 0.14)`,
                    touchAction: 'none',
                    cursor: dragState ? 'default' : 'pointer',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: roomTheme?.wallTop || '#fffdf8',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: 0,
                      height: '38%',
                      background: roomTheme?.skyTop || roomTheme?.wallTop || '#f8fafc',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: '24%',
                      height: '46%',
                      background: roomTheme?.wallTop || '#fffdf8',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: '32%',
                      background: roomTheme?.floorTop || '#d8b48a',
                      borderTop: `3px solid ${roomTheme?.frame || 'rgba(23, 52, 92, 0.12)'}`,
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: '32%',
                      height: 14,
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0))',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'radial-gradient(circle at 50% 18%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 62%)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 58%)',
                    }}
                  />
                  <RoomThemeScene theme={roomTheme} />
                  <RoomThemeReactionLayer
                    theme={roomTheme}
                    reaction={roomSocialState.social?.roomResponse}
                    timeMs={roomRuntime.timeMs}
                  />

                  {roomItems.map((item) => {
                    const isDragged = dragState?.source === 'room' && dragState.item.id === item.id;
                    const itemReaction = isDragged ? null : reactiveItemMap.get(item.id) || null;
                    const reactionMotion = getRoomItemReactionMotion(
                      itemReaction,
                      roomRuntime.timeMs
                    );

                    return (
                      <button
                        key={item.id}
                        id={`builder-room-item-${item.id}`}
                        data-room-item="true"
                        type="button"
                        onPointerDown={(event) => beginPlacedItemDrag(item, event)}
                        style={{
                          position: 'absolute',
                          left: item.x,
                          top: item.y,
                          width: item.width,
                          height: item.height,
                          border: 0,
                          padding: 0,
                          background: 'transparent',
                          cursor: 'grab',
                          opacity: isDragged ? 0.18 : 1,
                          transform: `translateY(${reactionMotion.translateY}px) rotate(${reactionMotion.rotateDeg}deg) scale(${reactionMotion.scale})`,
                          transformOrigin: '50% 80%',
                          filter: itemReaction
                            ? `drop-shadow(0 0 ${10 + itemReaction.intensity * 14}px ${itemReaction.tone}55)`
                            : 'none',
                          transition: 'transform 80ms linear, filter 80ms linear, opacity 120ms ease',
                          touchAction: 'none',
                          userSelect: 'none',
                        }}
                        aria-label={`Move ${item.name}`}
                      >
                        {itemReaction && (
                          <div
                            style={{
                              position: 'absolute',
                              inset: -10,
                              borderRadius: 28,
                              background: `radial-gradient(circle at 50% 54%, ${itemReaction.tone}55 0%, ${itemReaction.tone}16 38%, transparent 72%)`,
                              opacity: reactionMotion.auraOpacity,
                              transform: `scale(${1 + itemReaction.intensity * 0.08})`,
                              filter: 'blur(5px)',
                              pointerEvents: 'none',
                            }}
                          />
                        )}
                        <RoomFurnitureReactionLayer
                          item={item}
                          reaction={itemReaction}
                          timeMs={roomRuntime.timeMs}
                        />
                        <FurnitureArt item={item} />
                      </button>
                    );
                  })}

                  {roomActors.map((actor) => {
                    const actorStyle = {
                      position: 'absolute',
                      left: actor.x,
                      top: actor.y,
                      width: actor.width,
                      height: actor.height,
                      zIndex: 12 + Math.round(actor.y),
                    };

                    return actor.kind === 'player' ? (
                      <div
                        key={`${actor.kind}-${actor.id || actor.name}`}
                        style={{
                          ...actorStyle,
                          pointerEvents: 'none',
                        }}
                      >
                        <RoomActorBubble actor={actor} playerActor />
                        <UnicornActorArt actor={actor} timeMs={roomRuntime.timeMs} />
                      </div>
                    ) : (
                      <button
                        key={`${actor.kind}-${actor.id || actor.name}`}
                        id={`builder-room-npc-${actor.id}`}
                        data-room-npc="true"
                        type="button"
                        onPointerDown={(event) => handleNpcPointerDown(actor, event)}
                        style={{
                          ...actorStyle,
                          border: 0,
                          padding: 0,
                          background: 'transparent',
                          cursor: 'pointer',
                          touchAction: 'manipulation',
                        }}
                        aria-label={`Visit ${actor.name}`}
                      >
                        <RoomActorBubble actor={actor} />
                        <RoomNpcArt actor={actor} timeMs={roomRuntime.timeMs} roomTheme={roomTheme} />
                      </button>
                    );
                  })}

                  {dragState?.insideRoom && (
                    <div
                      style={{
                        position: 'absolute',
                        left: dragState.previewX,
                        top: dragState.previewY,
                        width: dragState.item.width,
                        height: dragState.item.height,
                        pointerEvents: 'none',
                        zIndex: 20,
                      }}
                    >
                      <FurnitureArt item={dragState.item} ghost />
                    </div>
                  )}

                  {showIntroHint && (
                    <div
                      style={{
                        position: 'absolute',
                        left: 18,
                        top: 18,
                        maxWidth: 168,
                        padding: '10px 12px',
                        borderRadius: 18,
                        background: 'rgba(255,255,255,0.68)',
                        boxShadow: '0 10px 18px rgba(15, 23, 42, 0.1)',
                        textAlign: 'left',
                        whiteSpace: 'pre-line',
                        fontSize: 12.5,
                        fontWeight: 700,
                        lineHeight: 1.18,
                        color: '#48627f',
                        pointerEvents: 'none',
                      }}
                    >
                      {'Tap floor to move.\nTap a friend.\nDrag decor in.'}
                    </div>
                  )}
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      <div style={sidebarContainerStyle}>
        <div style={sidebarCardStyle}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              opacity: 0.72,
            }}
          >
            Quick Moves
          </div>
          {['Tap floor to move', 'Tap friend to chat', 'Drag decor from dock'].map((tip) => (
            <div key={tip} style={{ fontSize: 13.5, lineHeight: 1.24 }}>
              {tip}
            </div>
          ))}
        </div>

        <div style={sidebarStatCardStyle}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              opacity: 0.72,
            }}
          >
            Furnished
          </div>
          <div style={{ fontSize: layoutMode.compact ? 28 : 34, fontWeight: 800, lineHeight: 1 }}>
            {roomItems.length}
          </div>
          <div style={{ fontSize: 13.5, opacity: 0.8 }}>
            {roomItems.length === 1 ? 'room piece' : 'room pieces'}
          </div>
        </div>

        <div style={sidebarCardStyle}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              opacity: 0.72,
            }}
          >
            Room Voice
          </div>
          <div style={{ fontSize: 12, fontWeight: 800, opacity: 0.72 }}>{roomVoiceSpeaker}</div>
          <div style={{ fontSize: 14, lineHeight: 1.28 }}>{roomVoiceText}</div>
          {roomVoiceMeta && (
            <div style={{ fontSize: 11.5, opacity: 0.68, lineHeight: 1.28 }}>{roomVoiceMeta}</div>
          )}
        </div>

        <div style={sidebarCardStyle}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              opacity: 0.72,
            }}
          >
            Room Echo
          </div>
          <div style={{ fontSize: 13.5, lineHeight: 1.28 }}>{roomEchoText}</div>
          <div style={{ fontSize: 11.5, opacity: 0.68, lineHeight: 1.28 }}>{roomEchoStatus}</div>
        </div>

        <div style={sidebarCardStyle}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              opacity: 0.72,
            }}
          >
            Room Cast
          </div>
          {layoutMode.stacked ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {castActors.map((actor) => (
                <span
                  key={`cast-chip-${actor.id || actor.name}`}
                  style={{
                    padding: '4px 8px',
                    borderRadius: 999,
                    background: 'rgba(255,255,255,0.78)',
                    fontSize: 11.5,
                    fontWeight: 700,
                    lineHeight: 1.1,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {actor.name}
                </span>
              ))}
            </div>
          ) : (
            castActors.map((actor) => (
              <div
                key={`cast-${actor.id || actor.name}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  fontSize: 13.5,
                  fontWeight: 700,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    minWidth: 0,
                  }}
                >
                  <span
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: '50%',
                      background: actor.accentColor || actor.bubbleTone || roomTheme?.accent || '#f4b457',
                      boxShadow: '0 0 0 3px rgba(255,255,255,0.56)',
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {actor.name}
                  </span>
                </div>
                <span
                  style={{
                    padding: '2px 7px',
                    borderRadius: 999,
                    background: 'rgba(255,255,255,0.76)',
                    fontSize: 10.5,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: 0.45,
                    opacity: 0.78,
                    flexShrink: 0,
                  }}
                >
                  {actor.mood || 'calm'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: topOverlayInset,
          right: mainPaneRightInset,
          bottom: dockBottomInset,
          height: trayDockHeight,
          display: 'flex',
          alignItems: 'stretch',
          gap: 12,
          zIndex: 30,
        }}
      >
        <div
          style={{
            ...overlayCardStyle,
            flex: 1,
            minWidth: 0,
            height: '100%',
            padding: layoutMode.compact ? '10px 10px 10px 12px' : '11px 12px 11px 14px',
            display: 'grid',
            gridTemplateRows: 'auto minmax(0, 1fr)',
            gap: 8,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div style={compactLabelStyle}>Inventory Dock</div>
              <div style={{ fontSize: 12.5, lineHeight: 1.2, opacity: 0.8 }}>
                Drag decor into the room.
              </div>
            </div>
            {!layoutMode.compact && (
              <div style={{ fontSize: 12.5, fontWeight: 700, opacity: 0.72 }}>
                {roomTheme?.name || house.name}
              </div>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              gap: 10,
              overflowX: 'auto',
              overflowY: 'hidden',
              paddingBottom: 2,
              scrollbarWidth: 'thin',
            }}
          >
            {trayItems.map((furniture) => (
              <button
                key={furniture.id}
                id={`builder-tray-${furniture.id}`}
                type="button"
                onPointerDown={(event) => beginTrayDrag(furniture, event)}
                style={{
                  ...dragCardStyle,
                  minWidth: layoutMode.compact ? 172 : 188,
                  padding: '10px 12px',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: 'rgba(248, 250, 252, 0.96)',
                    boxShadow: 'inset 0 0 0 1px rgba(23, 52, 92, 0.08)',
                    flexShrink: 0,
                  }}
                >
                  <FurnitureArt
                    item={{
                      ...furniture,
                      typeId: furniture.id,
                    }}
                  />
                </div>
                <div style={{ textAlign: 'left', minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {furniture.name}
                  </div>
                  <div style={{ fontSize: 11.5, opacity: 0.68 }}>drag in</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div
          ref={removeZoneRef}
          id="builder-room-remove-zone"
          style={{
            ...overlayCardStyle,
            width: layoutMode.compact ? 150 : 168,
            flexShrink: 0,
            height: '100%',
            padding: '12px 14px',
            border:
              dragState?.source === 'room'
                ? `2px dashed ${dragState.insideRemoveZone ? '#dc2626' : 'rgba(220, 38, 38, 0.34)'}`
                : '2px dashed rgba(23, 52, 92, 0.12)',
            background: dragState?.source === 'room' && dragState.insideRemoveZone
              ? 'linear-gradient(180deg, rgba(255, 222, 222, 0.98), rgba(255, 196, 196, 0.92))'
              : 'rgba(255,255,255,0.74)',
            boxShadow: dragState?.source === 'room' && dragState.insideRemoveZone
              ? '0 16px 28px rgba(220, 38, 38, 0.14)'
              : overlayCardStyle.boxShadow,
            transition: 'background 120ms ease, border-color 120ms ease, box-shadow 120ms ease',
            display: 'grid',
            alignContent: 'space-between',
            gap: 8,
          }}
        >
          <div style={compactLabelStyle}>Remove Piece</div>
          <div style={{ fontSize: 12.5, lineHeight: 1.26, whiteSpace: 'pre-line' }}>
            {dragState?.source === 'room'
              ? dragState.insideRemoveZone
                ? 'Release to remove.'
                : 'Drop a placed piece here.'
              : 'Drag a placed piece here.'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderRoom;
