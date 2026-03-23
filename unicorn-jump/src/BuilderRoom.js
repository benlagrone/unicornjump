import React, { useEffect, useRef, useState } from 'react';
import {
  BUILDER_ROOM_GRID_SIZE,
  getFurnitureCatalogForTheme,
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

const getRoomPanelWidth = (layoutMode) => {
  const gutter = layoutMode.compact ? 12 : 18;
  return Math.max(320, Math.min(layoutMode.viewportWidth - gutter, 1760));
};

const getRoomStageScale = (roomWidth, roomHeight, layoutMode) => {
  const panelWidth = getRoomPanelWidth(layoutMode);
  const horizontalPadding = layoutMode.compact ? 28 : 56;
  const sideColumnWidth = layoutMode.stacked ? 0 : 272;
  const sideColumnGap = layoutMode.stacked ? 0 : 18;
  const roomColumnWidth = panelWidth - horizontalPadding - sideColumnWidth - sideColumnGap;
  const heightBudget = layoutMode.viewportHeight - (layoutMode.compact ? 360 : 250);
  const widthScale = roomColumnWidth / roomWidth;
  const heightScale = heightBudget / roomHeight;
  const maxScale = layoutMode.compact ? 1.2 : layoutMode.stacked ? 1.52 : 2.08;

  return clamp(Math.min(widthScale, heightScale, maxScale), 0.56, maxScale);
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

const getRoomWalkBounds = (roomWidth, roomHeight, actorWidth, actorHeight) => ({
  xMin: 12,
  xMax: Math.max(12, roomWidth - actorWidth - 12),
  yMin: Math.round(roomHeight * 0.58),
  yMax: Math.max(Math.round(roomHeight * 0.58), roomHeight - actorHeight - 18),
});

const createRoomNpcBlueprints = (theme) => [
  {
    id: 'npc-guide',
    name: 'Guide',
    bodyColor: theme?.accent || '#f4b457',
    accentColor: theme?.frame || '#34435a',
    glowColor: 'rgba(255,255,255,0.18)',
    anchor: 0.28,
    range: 0.16,
    lane: 0.16,
    phase: 0.15,
    periodMs: 3600,
  },
  {
    id: 'npc-friend',
    name: 'Room Friend',
    bodyColor: theme?.wallBottom || '#d2dccf',
    accentColor: theme?.accent || '#85f1ff',
    glowColor: 'rgba(255,255,255,0.12)',
    anchor: 0.72,
    range: 0.14,
    lane: 0.02,
    phase: 1.25,
    periodMs: 4200,
  },
];

const createInitialRoomRuntime = (roomWidth, roomHeight) => {
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
    },
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

const advanceRoomRuntime = (runtime, ms, roomWidth, roomHeight) => ({
  ...runtime,
  timeMs: runtime.timeMs + ms,
  player: advanceRoomPlayer(runtime.player, ms, roomWidth, roomHeight),
});

const getNpcActors = (roomTheme, roomWidth, roomHeight, timeMs) => {
  const walkBounds = getRoomWalkBounds(
    roomWidth,
    roomHeight,
    NPC_ACTOR_SIZE.width,
    NPC_ACTOR_SIZE.height
  );
  const spanX = Math.max(1, walkBounds.xMax - walkBounds.xMin);
  const spanY = Math.max(1, walkBounds.yMax - walkBounds.yMin);

  return createRoomNpcBlueprints(roomTheme).map((npc) => {
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

const getCycleItem = (items, timeMs, periodMs, phase = 0) => {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  const rawIndex = Math.floor(timeMs / periodMs + phase);
  const index = ((rawIndex % items.length) + items.length) % items.length;
  return items[index] ?? items[0] ?? null;
};

const buildRoomSocialState = (runtime, roomTheme, roomWidth, roomHeight) => {
  const player = runtime.player || null;
  const npcs = getNpcActors(roomTheme, roomWidth, roomHeight, runtime.timeMs);
  const script = getRoomSocialScript(roomTheme?.id);
  const playerIsMoving = player
    ? Math.abs(player.targetX - player.x) > 1 || Math.abs(player.targetY - player.y) > 1
    : false;

  const socialNpcs = npcs.map((npc, index) => {
    const actorScript = npc.id === 'npc-guide' ? script.guide : script.friend;
    const nearPlayer = getActorDistance(npc, player) < ROOM_SOCIAL_NEAR_DISTANCE;
    const speechWindow = ((runtime.timeMs + index * 1100) % 6200) < 2550;
    const speechText = nearPlayer
      ? getCycleItem(actorScript.greet, runtime.timeMs, 1700, index * 0.6)
      : speechWindow
        ? getCycleItem(actorScript.idle, runtime.timeMs, 2200, index * 0.4)
        : null;
    const emote = nearPlayer ? (npc.id === 'npc-guide' ? 'hi' : 'yay') : speechWindow ? '...' : null;
    const mood = nearPlayer ? 'welcoming' : speechWindow ? 'chatty' : 'wandering';

    return {
      ...npc,
      mood,
      emote,
      speechText,
      bubbleTone: npc.accentColor,
      nearPlayer,
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

  const playerNearNpc = Boolean(nearestNpc && nearestNpc.distance < ROOM_SOCIAL_NEAR_DISTANCE);
  const playerSpeechWindow = !playerNearNpc && ((runtime.timeMs + 900) % 7600) < 2100;
  const playerSpeechText = playerNearNpc
    ? getCycleItem(['Hi there', 'Cute room', 'Let us play'], runtime.timeMs, 1600, 0.2)
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
        mood: playerNearNpc ? 'visiting' : playerIsMoving ? 'exploring' : 'daydreaming',
        emote: playerNearNpc ? 'hi' : playerIsMoving ? 'go' : playerSpeechWindow ? '...' : null,
        speechText: playerSpeechText,
        bubbleTone: roomTheme?.accent || '#f472b6',
      }
    : null;

  const activeNpc = socialNpcs.find((npc) => npc.nearPlayer && npc.speechText)
    || socialNpcs.find((npc) => Boolean(npc.speechText));

  return {
    timeMs: runtime.timeMs,
    player: socialPlayer,
    npcs: socialNpcs,
    social: {
      activeLine: activeNpc
        ? {
            speaker: activeNpc.name,
            text: activeNpc.speechText,
            mood: activeNpc.mood,
          }
        : socialPlayer?.speechText
          ? {
              speaker: socialPlayer.name,
              text: socialPlayer.speechText,
              mood: socialPlayer.mood,
            }
          : null,
    },
  };
};

const buildRoomRuntimeSnapshot = (socialState) => ({
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
        mood: socialState.player.mood,
        emote: socialState.player.emote,
        speechText: socialState.player.speechText,
      }
    : null,
  npcs: socialState.npcs.map((npc) => ({
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
  })),
  social: socialState.social,
});

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

const RoomNpcArt = ({ actor, timeMs }) => {
  const blink = Math.sin(timeMs / 420 + actor.phase) > 0.94;

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
          filter: 'drop-shadow(0 6px 8px rgba(15, 23, 42, 0.12))',
        }}
      >
        <circle cx="30" cy="18" r="11" fill="#fff7ef" stroke={actor.accentColor} strokeWidth="3" />
        <path d="M18 34 Q30 26 42 34 L46 58 Q30 68 14 58 Z" fill={actor.bodyColor} stroke={actor.accentColor} strokeWidth="3" />
        <path d="M24 12 Q30 4 36 12" fill="none" stroke={actor.accentColor} strokeWidth="3" strokeLinecap="round" />
        <circle cx="26" cy="18" r="1.8" fill={actor.accentColor} opacity={blink ? 0.2 : 1} />
        <circle cx="34" cy="18" r="1.8" fill={actor.accentColor} opacity={blink ? 0.2 : 1} />
        <path d="M25 23 Q30 27 35 23" fill="none" stroke={actor.accentColor} strokeWidth="2.5" strokeLinecap="round" />
        <rect x="23" y="58" width="5" height="10" rx="2.5" fill={actor.accentColor} />
        <rect x="32" y="58" width="5" height="10" rx="2.5" fill={actor.accentColor} />
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
  const trayItems = getFurnitureCatalogForTheme(roomTheme?.id);
  const roomRef = useRef(null);
  const removeZoneRef = useRef(null);
  const [dragState, setDragState] = useState(null);
  const [layoutMode, setLayoutMode] = useState(getRoomLayoutMode);
  const roomStageScale = getRoomStageScale(roomWidth, roomHeight, layoutMode);
  const roomDisplayWidth = Math.round(roomWidth * roomStageScale);
  const roomDisplayHeight = Math.round(roomHeight * roomStageScale);
  const runtimeIdentity = `${houseId}:${roomWidth}:${roomHeight}:${roomTheme?.id || 'room'}`;
  const roomRuntimeRef = useRef(createInitialRoomRuntime(roomWidth, roomHeight));
  const [roomRuntime, setRoomRuntime] = useState(() => createInitialRoomRuntime(roomWidth, roomHeight));
  const roomSocialState = buildRoomSocialState(
    roomRuntime,
    roomTheme,
    roomWidth,
    roomHeight
  );
  const npcActors = roomSocialState.npcs;
  const roomRuntimeSnapshot = buildRoomRuntimeSnapshot(roomSocialState);
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
  const roomItems = [...(house?.room?.items ?? [])].sort((left, right) => left.y - right.y);
  const introPlayer = createInitialRoomRuntime(roomWidth, roomHeight).player;
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
    const initialRuntime = createInitialRoomRuntime(roomWidth, roomHeight);
    roomRuntimeRef.current = initialRuntime;
    setRoomRuntime(initialRuntime);
    setDragState(null);
  }, [runtimeIdentity, roomWidth, roomHeight]);

  useEffect(() => {
    roomRuntimeRef.current = roomRuntime;
  }, [roomRuntime]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const snapshot = buildRoomRuntimeSnapshot(
      buildRoomSocialState(
        roomRuntimeRef.current,
        roomTheme,
        roomWidth,
        roomHeight
      )
    );
    window.__builderRoomRuntime = snapshot;

    return () => {
      if (window.__builderRoomRuntime === snapshot) {
        window.__builderRoomRuntime = undefined;
      }
    };
  }, [roomRuntimeSnapshot, roomTheme, roomWidth, roomHeight]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const advanceRuntime = (ms = 1000 / 60) => {
      setRoomRuntime((current) => {
        const next = advanceRoomRuntime(current, ms, roomWidth, roomHeight);
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
  }, [runtimeIdentity, roomWidth, roomHeight]);

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
        const next = advanceRoomRuntime(current, deltaMs, roomWidth, roomHeight);
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
  }, [runtimeIdentity, roomWidth, roomHeight]);

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
      roomRuntimeRef.current.player || createInitialRoomRuntime(roomWidth, roomHeight).player;
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
          facing: nextTargetX < current.player.x ? -1 : 1,
        },
      };
      roomRuntimeRef.current = next;
      return next;
    });
  };
  return (
    <div
      style={{
        ...panelStyle,
        width: layoutMode.compact
          ? 'calc(100vw - 12px)'
          : 'min(1680px, calc(100vw - 18px))',
        maxHeight: layoutMode.compact ? 'calc(100dvh - 12px)' : 'calc(100dvh - 18px)',
        overflowY: 'auto',
        padding: layoutMode.compact ? '14px' : '20px 22px 24px',
        color: '#17345c',
      }}
    >
      <div
        style={{
          display: 'grid',
          gap: 18,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div
              style={{
                fontSize: 13,
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
                fontSize: 'clamp(30px, 4vw, 46px)',
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
          <button id="builder-room-back-btn" type="button" onClick={onBack} style={actionButtonStyle}>
            Back To World
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: layoutMode.stacked
              ? '1fr'
              : 'minmax(0, 2.12fr) minmax(220px, 268px)',
            gap: 18,
            alignItems: 'start',
          }}
        >
          <div
            style={{
              padding: layoutMode.compact ? 10 : 14,
              borderRadius: 30,
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.46), rgba(255,255,255,0.16) 60%, rgba(255,255,255,0.12) 100%)',
              boxShadow:
                'inset 0 1px 0 rgba(255,255,255,0.82), 0 24px 52px rgba(15, 23, 42, 0.12)',
            }}
          >
            <div
              id="builder-room-grid"
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: roomDisplayWidth + (layoutMode.compact ? 16 : 22),
                minHeight: roomDisplayHeight + (layoutMode.compact ? 16 : 22),
                margin: '0 auto',
                padding: layoutMode.compact ? 8 : 10,
                borderRadius: 26,
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.08))',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: roomDisplayWidth,
                  height: roomDisplayHeight,
                  margin: '0 auto',
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

                  {roomItems.map((item) => {
                    const isDragged = dragState?.source === 'room' && dragState.item.id === item.id;

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
                          touchAction: 'none',
                          userSelect: 'none',
                        }}
                        aria-label={`Move ${item.name}`}
                      >
                        <FurnitureArt item={item} />
                      </button>
                    );
                  })}

                  {roomActors.map((actor) => (
                    <div
                      key={`${actor.kind}-${actor.id || actor.name}`}
                      style={{
                        position: 'absolute',
                        left: actor.x,
                        top: actor.y,
                        width: actor.width,
                        height: actor.height,
                        zIndex: 12 + Math.round(actor.y),
                        pointerEvents: 'none',
                      }}
                    >
                      <RoomActorBubble actor={actor} playerActor={actor.kind === 'player'} />
                      {actor.kind === 'player' ? (
                        <UnicornActorArt actor={actor} timeMs={roomRuntime.timeMs} />
                      ) : (
                        <RoomNpcArt actor={actor} timeMs={roomRuntime.timeMs} />
                      )}
                    </div>
                  ))}

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
                      maxWidth: 180,
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
                      {'Guide the unicorn.\nRoom friends wander and chat.\nDrag decor in when ready.'}
                  </div>
                )}
              </div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gap: 14,
            }}
          >
            <div
              style={{
                background: 'rgba(255,255,255,0.62)',
                borderRadius: 24,
                padding: '18px 18px',
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                  opacity: 0.72,
                  marginBottom: 8,
                }}
              >
              Room Rules
            </div>
            <div style={{ whiteSpace: 'pre-line', lineHeight: 1.34, fontSize: 15 }}>
                {'Click the room to guide the unicorn.\nDrag from the tray.\nRoom friends chat as you decorate.'}
            </div>
          </div>

          <div
            style={{
                background: 'rgba(255,255,255,0.62)',
                borderRadius: 24,
                padding: '18px 18px',
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                  opacity: 0.72,
                  marginBottom: 8,
                }}
              >
              Furnished Tonight
            </div>
            <div style={{ fontSize: 34, fontWeight: 800 }}>{roomItems.length}</div>
            <div style={{ marginTop: 4, fontSize: 15 }}>
              {roomItems.length === 1 ? 'room piece' : 'room pieces'}
            </div>
          </div>

            <div
              style={{
                background: 'rgba(255,255,255,0.62)',
                borderRadius: 24,
                padding: '18px 18px',
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                  opacity: 0.72,
                  marginBottom: 8,
                }}
              >
                Room Theme
              </div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>
                {roomTheme?.name || house.name}
              </div>
              <div style={{ marginTop: 4, fontSize: 14, lineHeight: 1.34, opacity: 0.78 }}>
                {roomTheme?.tagline || 'storybook space'}
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255,255,255,0.62)',
                borderRadius: 24,
                padding: '18px 18px',
                display: 'grid',
                gap: 8,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                  opacity: 0.72,
                }}
              >
                Room Mood
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, opacity: 0.72 }}>
                {roomSocialState.social?.activeLine?.speaker || 'Room'}
              </div>
              <div style={{ fontSize: 15, lineHeight: 1.34 }}>
                {roomSocialState.social?.activeLine?.text || 'The room is settled and waiting for the next hello.'}
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255,255,255,0.62)',
                borderRadius: 24,
                padding: '18px 18px',
                display: 'grid',
                gap: 8,
              }}
            >
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
              {[roomSocialState.player, ...npcActors].filter(Boolean).map((actor) => (
                <div
                  key={`cast-${actor.id || actor.name}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    fontSize: 14,
                    fontWeight: actor.id ? 700 : 800,
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
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: actor.accentColor || actor.bubbleTone || roomTheme?.accent || '#f4b457',
                        boxShadow: '0 0 0 3px rgba(255,255,255,0.56)',
                        flexShrink: 0,
                      }}
                    />
                    <span>{actor.name}</span>
                  </div>
                  <span
                    style={{
                      padding: '3px 7px',
                      borderRadius: 999,
                      background: 'rgba(255,255,255,0.76)',
                      fontSize: 11,
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                      opacity: 0.78,
                      flexShrink: 0,
                    }}
                  >
                    {actor.mood || 'calm'}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                background: 'rgba(255,255,255,0.62)',
                borderRadius: 24,
                padding: '18px 18px',
                display: 'grid',
                gap: 10,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                  opacity: 0.72,
                }}
              >
                Starter Tray
              </div>
              {trayItems.map((furniture) => (
                <button
                  key={furniture.id}
                  id={`builder-tray-${furniture.id}`}
                  type="button"
                  onPointerDown={(event) => beginTrayDrag(furniture, event)}
                  style={dragCardStyle}
                >
                  <div
                    style={{
                      position: 'relative',
                      width: 52,
                      height: 52,
                      borderRadius: 16,
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
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 15, fontWeight: 800 }}>{furniture.name}</div>
                    <div style={{ fontSize: 12, opacity: 0.72 }}>drag into room</div>
                  </div>
                </button>
              ))}
            </div>

            <div
              ref={removeZoneRef}
              id="builder-room-remove-zone"
              style={{
                background: dragState?.source === 'room' && dragState.insideRemoveZone
                  ? 'linear-gradient(180deg, rgba(255, 222, 222, 0.96), rgba(255, 196, 196, 0.9))'
                  : 'rgba(255,255,255,0.62)',
                borderRadius: 24,
                padding: '18px 18px',
                border:
                  dragState?.source === 'room'
                    ? `2px dashed ${dragState.insideRemoveZone ? '#dc2626' : 'rgba(220, 38, 38, 0.34)'}`
                    : '2px dashed rgba(23, 52, 92, 0.12)',
                boxShadow: dragState?.source === 'room' && dragState.insideRemoveZone
                  ? '0 16px 28px rgba(220, 38, 38, 0.14)'
                  : 'none',
                transition: 'background 120ms ease, border-color 120ms ease, box-shadow 120ms ease',
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                  opacity: 0.72,
                  marginBottom: 8,
                }}
              >
                Remove Piece
              </div>
              <div style={{ fontSize: 15, lineHeight: 1.34, whiteSpace: 'pre-line' }}>
                {dragState?.source === 'room'
                  ? dragState.insideRemoveZone
                    ? 'Release now.\nThis room piece goes away.'
                    : 'Drag a placed piece here.\nRelease to send it away.'
                  : 'Need a new look?\nDrag a placed piece here\nand then bring in another.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderRoom;
