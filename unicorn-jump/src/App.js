import React, { useEffect, useState } from 'react';
import Game from './Game';
import Settings from './Settings';
import BuilderRoom from './BuilderRoom';
import BuilderWorld from './BuilderWorld';
import { BIOMES, getBiomeConfig } from './biomeManager';
import { buildUnlockedCompanions } from './companionSystem';
import {
  BUILDER_ROOM_GRID_SIZE,
  BUILDER_WORLD_COLUMNS,
  BUILDER_WORLD_ROWS,
  HOUSE_TYPES,
  createInitialBuilderState,
  getFurnitureCatalogForTheme,
  getHouseById,
  moveFurnitureInHouse,
  placeHouseOnTile,
  placeFurnitureInHouse,
} from './builderState';
import {
  getBestHarmonyTitle,
  getBiomeCompleteBadgeTitle,
  getBiomeCompleteBodyHaiku,
  getBiomeCompleteTitleLines,
  getBrowserTitle,
  getCompanionsTitle,
  getCompanionCardHaiku,
  getFinalHarmonyTitle,
  getFinalWinBadgeTitle,
  getFinalWinBodyHaiku,
  getFinalWinTitleLines,
  getGardenMapButtonTitle,
  getHarmonyCardHaiku,
  getMenuBadgeTitle,
  getMenuIntroHaiku,
  getMenuTitleLines,
  getNextGardenHaiku,
  getNextGardenTitle,
  getPlayAgainTitle,
  getRunningHarmonyTitle,
  getSettingsButtonTitle,
  getTravelButtonTitle,
  getWorldCenterTitleLines,
  getWorldProgressHaiku,
  getWorldProgressTitle,
  getWorldSelectedLandHaiku,
  getWorldSelectedLandTitle,
  toHaikuText,
} from './haikuText';

const HIGH_SCORE_STORAGE_KEY = 'highScore';
const JOURNEY_STORAGE_KEY = 'gardenMessengerJourney';

const getBackgroundImageForBiome = (biomeIndex) => {
  const imageNumber = (biomeIndex % 6) + 1;
  return `${process.env.PUBLIC_URL}/assets/images/background/background-${imageNumber}.png`;
};

const getLayoutViewport = () => {
  const visualViewport = window.visualViewport;

  return {
    width: Math.round(visualViewport?.width ?? window.innerWidth),
    height: Math.round(visualViewport?.height ?? window.innerHeight),
  };
};

const createInitialJourney = () => {
  const fallback = {
    currentBiomeIndex: 0,
    completedBiomeIds: [],
  };

  try {
    const stored = window.localStorage.getItem(JOURNEY_STORAGE_KEY);
    if (!stored) {
      return fallback;
    }

    const parsed = JSON.parse(stored);
    if (
      typeof parsed?.currentBiomeIndex === 'number' &&
      Array.isArray(parsed?.completedBiomeIds)
    ) {
      return {
        currentBiomeIndex: Math.min(BIOMES.length - 1, Math.max(0, parsed.currentBiomeIndex)),
        completedBiomeIds: parsed.completedBiomeIds.filter((entry) =>
          BIOMES.some((biome) => biome.id === entry)
        ),
      };
    }
  } catch (error) {
    return fallback;
  }

  return fallback;
};

const basePanelStyle = {
  background: 'rgba(255, 249, 240, 0.76)',
  border: '1px solid rgba(255, 255, 255, 0.68)',
  borderRadius: 30,
  boxShadow: '0 24px 65px rgba(15, 23, 42, 0.22)',
  backdropFilter: 'blur(12px)',
};

const buttonStyle = (background, color = '#fff') => ({
  border: 0,
  borderRadius: 999,
  padding: '14px 20px',
  fontSize: 14,
  fontWeight: 700,
  lineHeight: 1.1,
  whiteSpace: 'pre-line',
  textAlign: 'center',
  minWidth: 154,
  minHeight: 76,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background,
  color,
  cursor: 'pointer',
});

const haikuBlockStyle = {
  whiteSpace: 'pre-line',
  lineHeight: 1.24,
};

const MENU_POINTER_ASSET = `${process.env.PUBLIC_URL}/assets/images/character/unicorn_little.svg`;
const WORLD_HUB_POSITION = { x: 50, y: 50 };

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const getWorldNodePosition = (index, total, radius = 35, startAngle = -90) => {
  const angle = startAngle + index * (360 / total);
  const radians = (angle * Math.PI) / 180;

  return {
    x: WORLD_HUB_POSITION.x + Math.cos(radians) * radius,
    y: WORLD_HUB_POSITION.y + Math.sin(radians) * radius,
  };
};

const getWorldConnectorPath = (position) => {
  const dx = position.x - WORLD_HUB_POSITION.x;
  const dy = position.y - WORLD_HUB_POSITION.y;
  const controlX = WORLD_HUB_POSITION.x + dx * 0.56 - dy * 0.08;
  const controlY = WORLD_HUB_POSITION.y + dy * 0.54 + dx * 0.06;

  return `M ${WORLD_HUB_POSITION.x} ${WORLD_HUB_POSITION.y} Q ${controlX} ${controlY} ${position.x} ${position.y}`;
};

const getNearestWorldNodeIndex = (x, y, positions) => {
  let bestIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;

  positions.forEach((position, index) => {
    const distance = Math.hypot(position.x - x, position.y - y);

    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  });

  return bestIndex;
};

const getDirectionalWorldNodeIndex = (currentIndex, direction, positions) => {
  const current = positions[currentIndex];
  let bestIndex = currentIndex;
  let bestScore = Number.POSITIVE_INFINITY;

  positions.forEach((candidate, index) => {
    if (index === currentIndex) {
      return;
    }

    const dx = candidate.x - current.x;
    const dy = candidate.y - current.y;
    const primary = direction === 'left' || direction === 'right' ? dx : dy;
    const secondary = direction === 'left' || direction === 'right' ? Math.abs(dy) : Math.abs(dx);
    const axisSign = direction === 'left' || direction === 'up' ? -1 : 1;

    if (primary * axisSign <= 1.5) {
      return;
    }

    const score = secondary * 2.2 + Math.hypot(dx, dy);

    if (score < bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  });

  return bestIndex;
};

const renderWorldMapGlyph = (biome, palette, x, y, scale = 1) => {
  const transform = `translate(${x} ${y}) scale(${scale})`;

  if (biome.id === 'lantern-bamboo-valley') {
    return (
      <g transform={transform}>
        <rect x="-13" y="-18" width="5" height="32" rx="2.5" fill="#5fb284" />
        <rect x="-3" y="-23" width="5" height="38" rx="2.5" fill="#3d936f" />
        <rect x="7" y="-15" width="5" height="30" rx="2.5" fill="#73bf90" />
        <circle cx="0" cy="-5" r="8" fill={palette.questItemSoft} />
        <circle cx="0" cy="-5" r="5.2" fill={palette.questItem} />
        <rect x="-7" y="12" width="14" height="4" rx="2" fill="#896141" />
      </g>
    );
  }

  if (biome.id === 'highland-meadow') {
    return (
      <g transform={transform}>
        <ellipse cx="0" cy="9" rx="18" ry="9" fill="#8dbb9f" />
        <circle cx="-10" cy="6" r="4.2" fill={palette.questItemSoft} />
        <circle cx="-2" cy="2" r="5.2" fill={palette.questItemSoft} />
        <circle cx="8" cy="5" r="4.6" fill={palette.questItemSoft} />
        <circle cx="0" cy="3" r="8" fill="none" stroke="#aab6ae" strokeWidth="3" />
      </g>
    );
  }

  if (biome.id === 'storybook-forest') {
    return (
      <g transform={transform}>
        <rect x="-3" y="-2" width="6" height="18" rx="3" fill="#8f6a48" />
        <path d="M -16 -2 C -10 -18 10 -18 16 -2" fill="#87b676" />
        <path d="M -11 5 C -5 -8 5 -8 11 5" fill="#f09a66" />
        <circle cx="0" cy="-8" r="2.2" fill={palette.questItem} />
        <circle cx="8" cy="-11" r="1.8" fill={palette.questItemSoft} />
      </g>
    );
  }

  if (biome.id === 'sun-orchard') {
    return (
      <g transform={transform}>
        <path d="M -14 12 Q 0 -14 14 12" fill="none" stroke="#b26d3c" strokeWidth="5" strokeLinecap="round" />
        <circle cx="-6" cy="-2" r="4" fill={palette.questItem} />
        <circle cx="6" cy="-4" r="4.5" fill={palette.accent} />
        <circle cx="0" cy="-11" r="3.6" fill={palette.questItemSoft} />
      </g>
    );
  }

  return (
    <g transform={transform}>
      <rect x="-2.4" y="-16" width="4.8" height="28" rx="2.4" fill="#d8e6f6" />
      <path d="M -14 -3 L 0 -11 L 14 -3" fill="none" stroke="#d8e6f6" strokeWidth="4" strokeLinecap="round" />
      <path d="M -11 5 L 0 -2 L 11 5" fill="none" stroke="#c1d7ef" strokeWidth="3.4" strokeLinecap="round" />
      <circle cx="-10" cy="12" r="3.4" fill="#7ca0ff" />
      <circle cx="-2" cy="8" r="3.1" fill="#99b2ff" />
      <circle cx="7" cy="11" r="3.6" fill="#8ea9ff" />
    </g>
  );
};

const renderWorldNodeIllustration = (biome, isSelected, isComplete) => {
  const ringColor = isSelected ? biome.palette.accent : 'rgba(255,255,255,0.76)';
  const glowOpacity = isSelected ? 0.9 : 0.72;

  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 8,
        width: 'calc(100% - 16px)',
        height: 'calc(100% - 16px)',
      }}
    >
      <defs>
        <radialGradient id={`world-node-sky-${biome.id}`} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.98)" />
          <stop offset="62%" stopColor={biome.palette.questItemSoft} />
          <stop offset="100%" stopColor={biome.palette.accentSoft} />
        </radialGradient>
      </defs>

      <path
        d="M 18 62 C 20 36 36 20 58 20 C 78 20 88 38 84 60 C 80 79 60 88 39 84 C 24 82 14 74 18 62 Z"
        fill={`url(#world-node-sky-${biome.id})`}
        stroke={ringColor}
        strokeWidth={isSelected ? 3 : 2}
      />
      <ellipse
        cx="50"
        cy="72"
        rx="28"
        ry="12"
        fill={biome.palette.accent}
        opacity={glowOpacity}
      />
      <ellipse
        cx="50"
        cy="68"
        rx="20"
        ry="8"
        fill={biome.palette.questItemSoft}
        opacity="0.84"
      />
      {renderWorldMapGlyph(biome, biome.palette, 50, 50, isSelected ? 1.06 : 1)}
      {isComplete && (
        <>
          <circle cx="76" cy="23" r="7.5" fill={biome.palette.accent} />
          <path
            d="M 72 23 L 75 26.5 L 81 19.5"
            fill="none"
            stroke="#fff"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );
};

const App = () => {
  const [screen, setScreen] = useState('menu');
  const [highScore, setHighScore] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [gameSettings, setGameSettings] = useState({
    soundEnabled: true,
    musicEnabled: true,
    difficulty: 'gentle',
  });
  const [viewport, setViewport] = useState(getLayoutViewport);
  const [journey, setJourney] = useState(createInitialJourney);
  const [runHarmony, setRunHarmony] = useState(0);
  const [completionInfo, setCompletionInfo] = useState(null);
  const [builderState, setBuilderState] = useState(createInitialBuilderState);
  const [activeBuilderHouseId, setActiveBuilderHouseId] = useState(null);
  const [selectedBuilderHouseTypeId, setSelectedBuilderHouseTypeId] = useState(HOUSE_TYPES[0].id);

  const activeBiome = getBiomeConfig(journey.currentBiomeIndex);
  const companions = buildUnlockedCompanions(journey.completedBiomeIds);
  const activeBuilderHouse = getHouseById(builderState, activeBuilderHouseId);
  const backgroundImage = getBackgroundImageForBiome(journey.currentBiomeIndex);
  const compactLayout = viewport.width <= 760;
  const narrowLayout = viewport.width <= 900;
  const worldNodeSize =
    viewport.width <= 420 ? 72 : compactLayout ? 80 : viewport.width <= 1120 ? 86 : 90;
  const centerWorldButtonSize = viewport.width <= 420 ? 112 : compactLayout ? 122 : 136;
  const worldOrbitRadius = viewport.width <= 420 ? 33 : compactLayout ? 34 : 35;
  const mapPointerSize = viewport.width <= 420 ? 44 : compactLayout ? 54 : 62;
  const mapControlSize = viewport.width <= 420 ? 42 : compactLayout ? 46 : 52;
  const worldNodePositions = BIOMES.map((_, index) =>
    getWorldNodePosition(index, BIOMES.length, worldOrbitRadius)
  );
  const worldNodes = BIOMES.map((biome, index) => ({
    biome,
    index,
    isSelected: index === journey.currentBiomeIndex,
    isComplete: journey.completedBiomeIds.includes(biome.id),
    position: worldNodePositions[index],
  }));
  const selectedWorldNode = worldNodes[journey.currentBiomeIndex] || worldNodes[0];
  const selectedNodeDx = selectedWorldNode.position.x - WORLD_HUB_POSITION.x;
  const selectedNodeDy = selectedWorldNode.position.y - WORLD_HUB_POSITION.y;
  const selectedNodeLength = Math.hypot(selectedNodeDx, selectedNodeDy) || 1;
  const pointerOffset = compactLayout ? 11 : 13;
  const pointerX = clamp(
    selectedWorldNode.position.x + (selectedNodeDx / selectedNodeLength) * pointerOffset,
    8,
    92
  );
  const pointerY = clamp(
    selectedWorldNode.position.y + (selectedNodeDy / selectedNodeLength) * pointerOffset,
    8,
    92
  );

  useEffect(() => {
    const savedHighScore = window.localStorage.getItem(HIGH_SCORE_STORAGE_KEY);
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  useEffect(() => {
    const visualViewport = window.visualViewport;
    const handleResize = () => {
      setViewport(getLayoutViewport());
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
    document.title = getBrowserTitle();
  }, []);

  useEffect(() => {
    window.localStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(journey));
  }, [journey]);

  useEffect(() => {
    let renderState = null;

    if (screen === 'menu') {
      renderState = () =>
        JSON.stringify({
          mode: 'menu',
          selectedBiomeIndex: journey.currentBiomeIndex,
          selectedBiome: activeBiome.name,
          completedBiomeIds: journey.completedBiomeIds,
          worldPointer: {
            x: pointerX,
            y: pointerY,
          },
        });
    } else if (screen === 'builderWorld') {
      const selectedHouseType =
        HOUSE_TYPES.find((houseType) => houseType.id === selectedBuilderHouseTypeId) || HOUSE_TYPES[0];

      renderState = () =>
        JSON.stringify({
          mode: 'builder-world',
          grid: {
            columns: BUILDER_WORLD_COLUMNS,
            rows: BUILDER_WORLD_ROWS,
          },
          selectedHouseType: {
            id: selectedHouseType.id,
            name: selectedHouseType.name,
          },
          houses: builderState.houses.map((house) => ({
            id: house.id,
            name: house.name,
            tileId: house.tileId,
            typeId: house.typeId,
            shortLabel: house.shortLabel,
          })),
          occupiedTiles: builderState.tiles
            .filter((tile) => tile.houseId)
            .map((tile) => tile.id),
        });
    } else if (screen === 'builderRoom' && activeBuilderHouse) {
      const trayItems = getFurnitureCatalogForTheme(activeBuilderHouse.roomTheme?.id);

      renderState = () =>
        JSON.stringify({
          mode: 'builder-room',
          coordinateSystem: {
            origin: 'top-left',
            xDirection: 'right',
            yDirection: 'down',
            units: 'pixels',
          },
          house: {
            id: activeBuilderHouse.id,
            name: activeBuilderHouse.name,
            typeId: activeBuilderHouse.typeId,
            shortLabel: activeBuilderHouse.shortLabel,
            themeName: activeBuilderHouse.roomTheme?.name,
            roomWidth: activeBuilderHouse.room.width,
            roomHeight: activeBuilderHouse.room.height,
            gridSize: BUILDER_ROOM_GRID_SIZE,
          },
          tray: trayItems.map((item) => item.name),
          furniture: activeBuilderHouse.room.items.map((item) => ({
            id: item.id,
            name: item.name,
            typeId: item.typeId,
            x: item.x,
            y: item.y,
            width: item.width,
            height: item.height,
          })),
        });
    }

    if (!renderState) {
      return undefined;
    }

    const advanceTime = () => {};
    window.render_game_to_text = renderState;
    window.advanceTime = advanceTime;

    return () => {
      if (window.render_game_to_text === renderState) {
        window.render_game_to_text = undefined;
      }
      if (window.advanceTime === advanceTime) {
        window.advanceTime = undefined;
      }
    };
  }, [
    screen,
    activeBiome.name,
    journey.currentBiomeIndex,
    journey.completedBiomeIds,
    pointerX,
    pointerY,
    builderState,
    activeBuilderHouse,
    selectedBuilderHouseTypeId,
  ]);

  const commitScore = (finalScore) => {
    if (finalScore > highScore) {
      setHighScore(finalScore);
      window.localStorage.setItem(HIGH_SCORE_STORAGE_KEY, String(finalScore));
    }
  };

  const startAdventure = () => {
    setActiveBuilderHouseId(null);
    setRunHarmony(0);
    setCompletionInfo(null);
    setScreen('playing');
  };

  const continueAdventure = () => {
    setCompletionInfo(null);
    setScreen('playing');
  };

  const selectBiome = (biomeIndex) => {
    setCompletionInfo(null);
    setJourney((currentJourney) => ({
      ...currentJourney,
      currentBiomeIndex: biomeIndex,
    }));
  };

  const moveWorldSelection = (direction) => {
    const nextBiomeIndex = getDirectionalWorldNodeIndex(
      journey.currentBiomeIndex,
      direction,
      worldNodePositions
    );

    if (nextBiomeIndex !== journey.currentBiomeIndex) {
      selectBiome(nextBiomeIndex);
    }
  };

  const selectBiomeFromMapPoint = (clientX, clientY, currentTarget) => {
    const bounds = currentTarget.getBoundingClientRect();
    const relativeX = ((clientX - bounds.left) / bounds.width) * 100;
    const relativeY = ((clientY - bounds.top) / bounds.height) * 100;
    const nextBiomeIndex = getNearestWorldNodeIndex(relativeX, relativeY, worldNodePositions);

    selectBiome(nextBiomeIndex);
  };

  const pauseAdventure = () => {
    setScreen('paused');
  };

  const resumeAdventure = () => {
    setScreen('playing');
  };

  const returnToMenu = () => {
    setActiveBuilderHouseId(null);
    setRunHarmony(0);
    setCompletionInfo(null);
    setScreen('menu');
  };

  const openBuilderWorld = () => {
    setCompletionInfo(null);
    setActiveBuilderHouseId(null);
    setScreen('builderWorld');
  };

  const openBuilderRoom = (houseId) => {
    setActiveBuilderHouseId(houseId);
    setScreen('builderRoom');
  };

  const handleBuilderTilePress = (tileId) => {
    const tile = builderState.tiles.find((entry) => entry.id === tileId);
    if (!tile) {
      return;
    }

    if (tile.houseId) {
      openBuilderRoom(tile.houseId);
      return;
    }

    const result = placeHouseOnTile(builderState, tileId, selectedBuilderHouseTypeId);
    setBuilderState(result.builderState);

    if (result.house?.id) {
      setActiveBuilderHouseId(result.house.id);
    }
  };

  const handleBuilderAddFurniture = (houseId, typeId, position) => {
    setBuilderState((currentState) => placeFurnitureInHouse(currentState, houseId, typeId, position).builderState);
  };

  const handleBuilderMoveFurniture = (houseId, itemId, position) => {
    setBuilderState((currentState) => moveFurnitureInHouse(currentState, houseId, itemId, position));
  };

  const handleBiomeComplete = (payload) => {
    const updatedCompletedBiomeIds = Array.from(
      new Set([...journey.completedBiomeIds, payload.biomeId])
    );
    const isFinalBiome = payload.biomeIndex >= BIOMES.length - 1;
    const nextBiomeIndex = isFinalBiome ? 0 : payload.biomeIndex + 1;

    setJourney({
      currentBiomeIndex: nextBiomeIndex,
      completedBiomeIds: updatedCompletedBiomeIds,
    });
    setRunHarmony(payload.totalHarmony);
    setCompletionInfo({
      ...payload,
      totalHarmony: payload.totalHarmony,
      nextBiome: payload.nextBiome,
    });

    if (isFinalBiome) {
      commitScore(payload.totalHarmony);
      setScreen('won');
      return;
    }

    setScreen('biomeComplete');
  };

  const saveSettings = (newSettings) => {
    setGameSettings(newSettings);
    setShowSettings(false);
  };

  useEffect(() => {
    if (screen !== 'menu' || showSettings) {
      return undefined;
    }

    const selectBiomeIndex = (biomeIndex) => {
      setCompletionInfo(null);
      setJourney((currentJourney) => ({
        ...currentJourney,
        currentBiomeIndex: biomeIndex,
      }));
    };

    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        selectBiomeIndex(
          getDirectionalWorldNodeIndex(journey.currentBiomeIndex, 'left', worldNodePositions)
        );
        return;
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        selectBiomeIndex(
          getDirectionalWorldNodeIndex(journey.currentBiomeIndex, 'right', worldNodePositions)
        );
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        selectBiomeIndex(
          getDirectionalWorldNodeIndex(journey.currentBiomeIndex, 'up', worldNodePositions)
        );
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        selectBiomeIndex(
          getDirectionalWorldNodeIndex(journey.currentBiomeIndex, 'down', worldNodePositions)
        );
        return;
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setRunHarmony(0);
        setCompletionInfo(null);
        setScreen('playing');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [screen, showSettings, journey.currentBiomeIndex, worldNodePositions]);

  const mapControlButtonStyle = {
    width: mapControlSize,
    height: mapControlSize,
    borderRadius: 18,
    border: '1px solid rgba(255,255,255,0.74)',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.62))',
    color: activeBiome.palette.heading,
    fontSize: compactLayout ? 18 : 20,
    fontWeight: 900,
    lineHeight: 1,
    cursor: 'pointer',
    boxShadow: '0 14px 24px rgba(15, 23, 42, 0.14)',
    touchAction: 'manipulation',
  };

  const shellStyle = {
    minHeight: '100dvh',
    minWidth: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: `radial-gradient(circle at top, rgba(255, 240, 210, 0.42), rgba(15, 23, 42, 0.12) 60%), url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: compactLayout ? 12 : 16,
  };

  return (
    <div style={shellStyle}>
      {screen === 'menu' && (
        <div
          style={{
            ...basePanelStyle,
            width: compactLayout ? 'calc(100vw - 24px)' : 'min(1240px, calc(100vw - 32px))',
            maxHeight: compactLayout ? 'calc(100dvh - 24px)' : 'calc(100dvh - 32px)',
            overflowY: 'auto',
            padding: compactLayout ? '18px 16px 20px' : '28px 28px',
            color: activeBiome.palette.heading,
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: narrowLayout
                ? '1fr'
                : 'minmax(0, 0.92fr) minmax(0, 1.28fr)',
              gap: compactLayout ? 16 : 24,
              alignItems: 'start',
            }}
          >
            <div style={{ order: narrowLayout ? 2 : 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: compactLayout ? 13 : 16,
                  fontWeight: 700,
                  letterSpacing: 1.4,
                  textTransform: 'uppercase',
                  opacity: 0.72,
                  marginBottom: compactLayout ? 8 : 12,
                }}
              >
                {getMenuBadgeTitle()}
              </div>
              <h1
                style={{
                  whiteSpace: 'pre-line',
                  fontSize: compactLayout ? 'clamp(28px, 10vw, 40px)' : 'clamp(30px, 4vw, 54px)',
                  lineHeight: 1.08,
                  margin: compactLayout ? '0 0 10px' : '0 0 14px',
                }}
              >
                {toHaikuText(getMenuTitleLines())}
              </h1>
              <p
                style={{
                  ...haikuBlockStyle,
                  fontSize: compactLayout ? 15 : 18,
                  lineHeight: compactLayout ? 1.35 : 1.45,
                  margin: compactLayout ? '0 0 12px' : '0 0 18px',
                  maxWidth: compactLayout ? 420 : 620,
                }}
              >
                {toHaikuText(getMenuIntroHaiku().slice(0, compactLayout ? 2 : 3))}
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: compactLayout
                    ? 'repeat(2, minmax(0, 1fr))'
                    : 'repeat(auto-fit, minmax(190px, 1fr))',
                  gap: 12,
                  marginBottom: compactLayout ? 0 : 18,
                }}
              >
                <div
                  style={{
                    background: 'rgba(255,255,255,0.56)',
                    borderRadius: 24,
                    padding: compactLayout ? '12px 12px' : '16px 18px',
                  }}
                >
                  <div
                    style={{
                      fontSize: compactLayout ? 11 : 13,
                      fontWeight: 800,
                      letterSpacing: 1.2,
                      textTransform: 'uppercase',
                      opacity: 0.68,
                      marginBottom: compactLayout ? 6 : 8,
                    }}
                  >
                    Selected Land
                  </div>
                  <div
                    style={{
                      fontSize: compactLayout ? 18 : 28,
                      fontWeight: 700,
                      marginBottom: compactLayout ? 0 : 8,
                    }}
                  >
                    {getWorldSelectedLandTitle(activeBiome)}
                  </div>
                  {!compactLayout && (
                    <div style={{ ...haikuBlockStyle, fontSize: 16 }}>
                      {toHaikuText(
                        getWorldSelectedLandHaiku(activeBiome, {
                          isComplete: journey.completedBiomeIds.includes(activeBiome.id),
                          isCurrent: true,
                        }).slice(1)
                      )}
                    </div>
                  )}
                </div>

                <div
                  style={{
                    background: 'rgba(255,255,255,0.56)',
                    borderRadius: 24,
                    padding: compactLayout ? '12px 12px' : '16px 18px',
                  }}
                >
                  <div
                    style={{
                      fontSize: compactLayout ? 11 : 13,
                      fontWeight: 800,
                      letterSpacing: 1.2,
                      textTransform: 'uppercase',
                      opacity: 0.68,
                      marginBottom: compactLayout ? 6 : 8,
                    }}
                  >
                    {getWorldProgressTitle()}
                  </div>
                  <div style={{ fontSize: compactLayout ? 18 : 24, fontWeight: 700, margin: compactLayout ? '0' : '8px 0 6px' }}>
                    {journey.completedBiomeIds.length} / {BIOMES.length}
                  </div>
                  {!compactLayout && (
                    <div style={{ ...haikuBlockStyle, fontSize: 15 }}>
                      {toHaikuText(
                        getWorldProgressHaiku(journey.completedBiomeIds.length, BIOMES.length)
                      )}
                    </div>
                  )}
                </div>

                <div
                  style={{
                    background: 'rgba(255,255,255,0.56)',
                    borderRadius: 24,
                    padding: compactLayout ? '12px 12px' : '16px 18px',
                  }}
                >
                  <div
                    style={{
                      fontSize: compactLayout ? 11 : 13,
                      fontWeight: 800,
                      letterSpacing: 1.2,
                      textTransform: 'uppercase',
                      opacity: 0.68,
                      marginBottom: compactLayout ? 6 : 8,
                    }}
                  >
                    {getBestHarmonyTitle()}
                  </div>
                  <div style={{ fontSize: compactLayout ? 18 : 24, fontWeight: 700, margin: compactLayout ? '0' : '8px 0 6px' }}>
                    {highScore}
                  </div>
                  {!compactLayout && (
                    <div style={{ ...haikuBlockStyle, fontSize: 15 }}>
                      {toHaikuText(getHarmonyCardHaiku())}
                    </div>
                  )}
                </div>

                <div
                  style={{
                    background: 'rgba(255,255,255,0.56)',
                    borderRadius: 24,
                    padding: compactLayout ? '12px 12px' : '16px 18px',
                  }}
                >
                  <div
                    style={{
                      fontSize: compactLayout ? 11 : 13,
                      fontWeight: 800,
                      letterSpacing: 1.2,
                      textTransform: 'uppercase',
                      opacity: 0.68,
                      marginBottom: compactLayout ? 6 : 8,
                    }}
                  >
                    {getCompanionsTitle()}
                  </div>
                  <div style={{ fontSize: compactLayout ? 18 : 24, fontWeight: 700, margin: compactLayout ? '0' : '8px 0 6px' }}>
                    {companions.length} / {BIOMES.length}
                  </div>
                  {!compactLayout && (
                    <div style={{ ...haikuBlockStyle, fontSize: 15 }}>
                      {toHaikuText(getCompanionCardHaiku(companions.length))}
                    </div>
                  )}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  flexWrap: 'wrap',
                  marginTop: compactLayout ? 14 : 18,
                }}
              >
                <button
                  id="builder-open-btn"
                  type="button"
                  onClick={openBuilderWorld}
                  style={buttonStyle('#ffffff', activeBiome.palette.heading)}
                >
                  {'Build Garden\nplace first room'}
                </button>
              </div>

            </div>

            <div
              style={{
                order: narrowLayout ? 1 : 2,
                minWidth: 0,
                height: compactLayout ? 400 : 560,
                minHeight: compactLayout ? 400 : 560,
                display: 'grid',
                gridTemplateRows: 'auto minmax(0, 1fr) auto',
                gap: compactLayout ? 10 : 14,
                background: `radial-gradient(circle at 18% 16%, rgba(255,255,255,0.96), rgba(255,255,255,0.28) 34%, rgba(15, 23, 42, 0.08) 100%), linear-gradient(145deg, ${activeBiome.palette.accentSoft}, rgba(255,255,255,0.68))`,
                borderRadius: compactLayout ? 28 : 36,
                padding: compactLayout ? 12 : 18,
                overflow: 'hidden',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.58), 0 24px 54px rgba(15, 23, 42, 0.16)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: compactLayout ? 10 : 14,
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    fontSize: compactLayout ? 12 : 13,
                    fontWeight: 800,
                    letterSpacing: 1.2,
                    textTransform: 'uppercase',
                    opacity: 0.72,
                  }}
                >
                  World Map
                </div>
                <button
                  onClick={() => setShowSettings(true)}
                  style={{
                    ...buttonStyle('#ffffff', activeBiome.palette.heading),
                    position: 'relative',
                    zIndex: 4,
                    marginLeft: 'auto',
                    minWidth: compactLayout ? 98 : 120,
                    minHeight: compactLayout ? 44 : 58,
                    fontSize: compactLayout ? 11 : 12,
                    padding: compactLayout ? '8px 10px' : '10px 14px',
                    flexShrink: 0,
                  }}
                >
                  {getSettingsButtonTitle()}
                </button>
              </div>

              <div
                style={{
                  minHeight: 0,
                  display: 'grid',
                  gridTemplateColumns: compactLayout ? '1fr' : 'minmax(0, 1fr) auto',
                  gap: compactLayout ? 12 : 18,
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    justifySelf: 'center',
                    alignSelf: 'stretch',
                    width: compactLayout ? 'min(100%, 340px)' : 'auto',
                    height: compactLayout ? 'auto' : '100%',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    aspectRatio: '1 / 1',
                    minHeight: compactLayout ? 250 : 0,
                    borderRadius: compactLayout ? 28 : 34,
                    overflow: 'hidden',
                    zIndex: 2,
                    background: `linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,255,255,0.4) 26%, rgba(255,255,255,0.16) 100%), linear-gradient(180deg, ${activeBiome.palette.questItemSoft}, ${activeBiome.palette.accentSoft} 56%, rgba(255,255,255,0.52) 100%)`,
                    boxShadow:
                      'inset 0 1px 0 rgba(255,255,255,0.78), inset 0 -18px 46px rgba(15, 23, 42, 0.08), 0 22px 46px rgba(15, 23, 42, 0.14)',
                  }}
                  id="world-map-surface"
                  onPointerDown={(event) => {
                    if (event.target.closest('button')) {
                      return;
                    }

                    selectBiomeFromMapPoint(event.clientX, event.clientY, event.currentTarget);
                  }}
                >
                  <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="xMidYMid meet"
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    <defs>
                      <linearGradient id="world-map-sky" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.96)" />
                        <stop offset="52%" stopColor={activeBiome.palette.questItemSoft} />
                        <stop offset="100%" stopColor={activeBiome.palette.accentSoft} />
                      </linearGradient>
                      <linearGradient id="world-map-river" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
                      </linearGradient>
                      <radialGradient id="world-map-hub-glow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.96)" />
                        <stop offset="70%" stopColor={activeBiome.palette.questItemSoft} />
                        <stop offset="100%" stopColor={activeBiome.palette.accentSoft} />
                      </radialGradient>
                    </defs>

                    <rect width="100" height="100" fill="url(#world-map-sky)" />
                    <path
                      d="M 4 24 C 18 12 34 12 50 19 C 66 26 82 26 96 16 L 100 0 L 0 0 Z"
                      fill="rgba(255,255,255,0.32)"
                    />
                    <path
                      d="M 0 78 C 18 68 34 66 49 70 C 64 75 82 74 100 62 L 100 100 L 0 100 Z"
                      fill="rgba(108, 164, 128, 0.26)"
                    />
                    <circle
                      cx={WORLD_HUB_POSITION.x}
                      cy={WORLD_HUB_POSITION.y}
                      r={worldOrbitRadius + 8}
                      fill="none"
                      stroke="rgba(255,255,255,0.22)"
                      strokeWidth="1.4"
                    />
                    <circle
                      cx={WORLD_HUB_POSITION.x}
                      cy={WORLD_HUB_POSITION.y}
                      r={worldOrbitRadius}
                      fill="none"
                      stroke="rgba(255,255,255,0.32)"
                      strokeWidth="1.8"
                      strokeDasharray="2.4 4.4"
                    />

                    {worldNodes.map(({ biome, position }, index) => {
                      const path = getWorldConnectorPath(position);

                      return (
                        <g key={`world-path-${biome.id}`}>
                          <path
                            d={path}
                            fill="none"
                            stroke="rgba(255,255,255,0.52)"
                            strokeWidth="2.8"
                            strokeLinecap="round"
                          />
                          <path
                            d={path}
                            fill="none"
                            stroke={biome.palette.accent}
                            strokeWidth={index === journey.currentBiomeIndex ? '1.9' : '1.2'}
                            strokeLinecap="round"
                            opacity={index === journey.currentBiomeIndex ? '0.9' : '0.38'}
                            strokeDasharray={index === journey.currentBiomeIndex ? '0' : '2 6'}
                          />
                          <ellipse
                            cx={position.x}
                            cy={position.y + 1}
                            rx="9.4"
                            ry="5.4"
                            fill={biome.palette.accentSoft}
                            opacity="0.38"
                          />
                          {renderWorldMapGlyph(
                            biome,
                            biome.palette,
                            position.x,
                            position.y - 1.1,
                            0.36
                          )}
                        </g>
                      );
                    })}

                    <ellipse
                      cx={WORLD_HUB_POSITION.x}
                      cy={WORLD_HUB_POSITION.y}
                      rx="17"
                      ry="17"
                      fill="url(#world-map-hub-glow)"
                    />
                    <ellipse
                      cx={WORLD_HUB_POSITION.x}
                      cy={WORLD_HUB_POSITION.y + 1.8}
                      rx="10.5"
                      ry="5.2"
                      fill={activeBiome.palette.accent}
                      opacity="0.88"
                    />
                    <path
                      d="M 46 50 L 46 43 Q 50 38 54 43 L 54 50"
                      fill="none"
                      stroke={activeBiome.palette.heading}
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 47.8 43.2 L 50 40.6 L 52.2 43.2"
                      fill="none"
                      stroke={activeBiome.palette.heading}
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="23" cy="18" r="2.2" fill="rgba(255,255,255,0.78)" />
                    <circle cx="79" cy="20" r="2" fill="rgba(255,255,255,0.62)" />
                    <circle cx="83" cy="78" r="2.4" fill="rgba(255,255,255,0.52)" />
                    <ellipse cx="17" cy="28" rx="5.4" ry="2.2" fill="rgba(255,255,255,0.38)" />
                    <ellipse cx="82" cy="30" rx="4.8" ry="2.1" fill="rgba(255,255,255,0.34)" />
                  </svg>

                  {worldNodes.map(({ biome, index, isSelected, isComplete, position }) => {
                    return (
                      <button
                        key={biome.id}
                        id={`world-node-${index}`}
                        type="button"
                        aria-label={biome.name}
                        onClick={(event) => {
                          event.stopPropagation();
                          selectBiome(index);
                        }}
                        style={{
                          position: 'absolute',
                          left: `calc(${position.x}% - ${worldNodeSize / 2}px)`,
                          top: `calc(${position.y}% - ${worldNodeSize / 2}px)`,
                          width: worldNodeSize,
                          height: worldNodeSize,
                          borderRadius: '50%',
                          border: isSelected
                            ? `3px solid ${biome.palette.accent}`
                            : '1px solid rgba(255,255,255,0.64)',
                          background: isSelected
                            ? `linear-gradient(150deg, rgba(255,255,255,0.98), ${biome.palette.accentSoft})`
                            : 'linear-gradient(155deg, rgba(255,255,255,0.94), rgba(255,255,255,0.56))',
                          boxShadow: isSelected
                            ? `0 18px 34px ${biome.palette.platformGlow}`
                            : '0 14px 28px rgba(15, 23, 42, 0.14)',
                          transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                          transition:
                            'transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease',
                          cursor: 'pointer',
                          overflow: 'hidden',
                          zIndex: isSelected ? 9 : 8,
                          padding: 0,
                        }}
                      >
                        {renderWorldNodeIllustration(biome, isSelected, isComplete)}
                        <div
                          style={{
                            position: 'absolute',
                            left: 8,
                            right: 8,
                            bottom: compactLayout ? 8 : 10,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            color: biome.palette.heading,
                            textAlign: 'center',
                            zIndex: 2,
                          }}
                        >
                          {!compactLayout && (
                            <div
                              style={{
                                fontSize: 8,
                                fontWeight: 800,
                                letterSpacing: 1.1,
                                textTransform: 'uppercase',
                                opacity: 0.66,
                              }}
                            >
                              World {index + 1}
                            </div>
                          )}
                          <div
                            style={{
                              fontSize: compactLayout ? 10 : 11,
                              fontWeight: 800,
                              lineHeight: 1.15,
                            }}
                          >
                            {biome.shortName}
                          </div>
                        </div>
                      </button>
                    );
                  })}

                  <img
                    id="world-map-pointer"
                    src={MENU_POINTER_ASSET}
                    alt=""
                    draggable={false}
                    style={{
                      position: 'absolute',
                      left: `calc(${pointerX}% - ${mapPointerSize / 2}px)`,
                      top: `calc(${pointerY}% - ${mapPointerSize / 2}px)`,
                      width: mapPointerSize,
                      height: mapPointerSize,
                      zIndex: 10,
                      pointerEvents: 'none',
                      filter: `drop-shadow(0 12px 20px rgba(15, 23, 42, 0.22)) drop-shadow(0 0 16px ${activeBiome.palette.guide})`,
                      transition: 'left 220ms ease, top 220ms ease, filter 220ms ease',
                    }}
                  />

                  <button
                    id="start-btn"
                    onClick={(event) => {
                      event.stopPropagation();
                      startAdventure();
                    }}
                    style={{
                      position: 'absolute',
                      left: `calc(${WORLD_HUB_POSITION.x}% - ${centerWorldButtonSize / 2}px)`,
                      top: `calc(${WORLD_HUB_POSITION.y}% - ${centerWorldButtonSize / 2}px)`,
                      width: centerWorldButtonSize,
                      height: centerWorldButtonSize,
                      border: `3px solid ${activeBiome.palette.accent}`,
                      borderRadius: '50%',
                      background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.97), ${activeBiome.palette.questItemSoft} 28%, ${activeBiome.palette.accentSoft} 66%, ${activeBiome.palette.accent} 100%)`,
                      boxShadow: `0 24px 48px ${activeBiome.palette.platformGlow}`,
                      color: activeBiome.palette.heading,
                      padding: compactLayout ? '10px' : '12px',
                      cursor: 'pointer',
                      whiteSpace: 'pre-line',
                      textAlign: 'center',
                      fontSize: compactLayout ? 11 : 12,
                      fontWeight: 800,
                      lineHeight: 1.08,
                      zIndex: 7,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: compactLayout ? 8 : 9,
                        fontWeight: 900,
                        letterSpacing: 1.2,
                        textTransform: 'uppercase',
                        opacity: 0.72,
                        marginBottom: compactLayout ? 3 : 5,
                      }}
                    >
                      {activeBiome.shortName}
                    </span>
                    {toHaikuText(getWorldCenterTitleLines(activeBiome))}
                  </button>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(3, ${mapControlSize}px)`,
                    gap: 8,
                    alignItems: 'center',
                    justifyItems: 'center',
                    justifySelf: 'center',
                    flexShrink: 0,
                  }}
                >
                  <div />
                  <button
                    id="map-control-up"
                    type="button"
                    onClick={() => moveWorldSelection('up')}
                    style={mapControlButtonStyle}
                  >
                    ↑
                  </button>
                  <div />
                  <button
                    id="map-control-left"
                    type="button"
                    onClick={() => moveWorldSelection('left')}
                    style={mapControlButtonStyle}
                  >
                    ←
                  </button>
                  <div
                    style={{
                      width: mapControlSize,
                      height: mapControlSize,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 18,
                      background: 'rgba(255,255,255,0.66)',
                      color: activeBiome.palette.heading,
                      fontSize: compactLayout ? 8 : 9,
                      fontWeight: 800,
                      letterSpacing: 1,
                      textTransform: 'uppercase',
                      boxShadow: '0 10px 18px rgba(15, 23, 42, 0.08)',
                    }}
                  >
                    Tap
                  </div>
                  <button
                    id="map-control-right"
                    type="button"
                    onClick={() => moveWorldSelection('right')}
                    style={mapControlButtonStyle}
                  >
                    →
                  </button>
                  <div />
                  <button
                    id="map-control-down"
                    type="button"
                    onClick={() => moveWorldSelection('down')}
                    style={mapControlButtonStyle}
                  >
                    ↓
                  </button>
                  <div />
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: compactLayout ? 'center' : 'flex-start',
                  gap: compactLayout ? 10 : 14,
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    maxWidth: compactLayout ? 320 : 280,
                    padding: '11px 14px',
                    borderRadius: 22,
                    background: 'rgba(255,255,255,0.7)',
                    border: '1px solid rgba(255,255,255,0.62)',
                    boxShadow: '0 12px 28px rgba(15, 23, 42, 0.12)',
                    ...haikuBlockStyle,
                    fontSize: 13,
                    textAlign: compactLayout ? 'center' : 'left',
                  }}
                >
                  Tap a world, click the map, or use arrow keys and the touch pad.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {(screen === 'playing' || screen === 'paused') && (
        <Game
          backgroundImage={backgroundImage}
          biomeIndex={journey.currentBiomeIndex}
          completedBiomeIds={journey.completedBiomeIds}
          scoreOffset={runHarmony}
          isPaused={screen === 'paused'}
          onBiomeComplete={handleBiomeComplete}
          onPause={pauseAdventure}
          onResume={resumeAdventure}
          settings={gameSettings}
        />
      )}

      {screen === 'builderWorld' && (
        <BuilderWorld
          builderState={builderState}
          houseTypes={HOUSE_TYPES}
          selectedHouseTypeId={selectedBuilderHouseTypeId}
          onSelectHouseType={setSelectedBuilderHouseTypeId}
          onTilePress={handleBuilderTilePress}
          onEnterHouse={openBuilderRoom}
          onBack={returnToMenu}
        />
      )}

      {screen === 'builderRoom' && activeBuilderHouse && (
        <BuilderRoom
          house={activeBuilderHouse}
          onBack={openBuilderWorld}
          onAddFurniture={handleBuilderAddFurniture}
          onMoveFurniture={handleBuilderMoveFurniture}
        />
      )}

      {screen === 'biomeComplete' && completionInfo && (
        <div
          style={{
            ...basePanelStyle,
            width: 'min(560px, calc(100vw - 32px))',
            maxHeight: 'calc(100dvh - 32px)',
            overflowY: 'auto',
            padding: '34px 30px',
            textAlign: 'center',
            color: completionInfo.nextBiome
              ? completionInfo.nextBiome.palette.heading
              : activeBiome.palette.heading,
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 800,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              opacity: 0.72,
            }}
          >
            {getBiomeCompleteBadgeTitle()}
          </div>
          <h2
            style={{
              whiteSpace: 'pre-line',
              fontSize: 44,
              lineHeight: 1.05,
              margin: '14px 0 12px',
            }}
          >
            {toHaikuText(getBiomeCompleteTitleLines(completionInfo))}
          </h2>
          <p
            style={{
              ...haikuBlockStyle,
              fontSize: 19,
              lineHeight: 1.5,
              margin: '0 0 18px',
            }}
          >
            {toHaikuText(getBiomeCompleteBodyHaiku(completionInfo))}
          </p>
          <div style={{ display: 'grid', gap: 14, margin: '0 0 24px' }}>
            <div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                  opacity: 0.72,
                  marginBottom: 6,
                }}
              >
                {getRunningHarmonyTitle()}
              </div>
              <div style={{ fontSize: 30, fontWeight: 700 }}>{completionInfo.totalHarmony}</div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                  opacity: 0.72,
                  marginBottom: 6,
                }}
              >
                {getNextGardenTitle()}
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>
                {completionInfo.nextBiome.name}
              </div>
              <div style={{ ...haikuBlockStyle, fontSize: 16 }}>
                {toHaikuText(getNextGardenHaiku(completionInfo.nextBiome).slice(1))}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={continueAdventure}
              style={buttonStyle(completionInfo.nextBiome.palette.accent)}
            >
              {getTravelButtonTitle()}
            </button>
            <button
              onClick={returnToMenu}
              style={buttonStyle('#ffffff', completionInfo.nextBiome.palette.heading)}
            >
              {getGardenMapButtonTitle()}
            </button>
          </div>
        </div>
      )}

      {screen === 'won' && completionInfo && (
        <div
          style={{
            ...basePanelStyle,
            width: 'min(620px, calc(100vw - 32px))',
            maxHeight: 'calc(100dvh - 32px)',
            overflowY: 'auto',
            padding: '36px 32px',
            textAlign: 'center',
            color: '#17345c',
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 800,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              opacity: 0.72,
            }}
          >
            {getFinalWinBadgeTitle()}
          </div>
          <h2
            style={{
              whiteSpace: 'pre-line',
              fontSize: 48,
              lineHeight: 1.02,
              margin: '14px 0 12px',
            }}
          >
            {toHaikuText(getFinalWinTitleLines())}
          </h2>
          <p
            style={{
              ...haikuBlockStyle,
              fontSize: 19,
              lineHeight: 1.55,
              margin: '0 0 18px',
            }}
          >
            {toHaikuText(getFinalWinBodyHaiku(completionInfo))}
          </p>
          <div style={{ display: 'grid', gap: 14, margin: '0 0 24px' }}>
            <div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                  opacity: 0.72,
                  marginBottom: 6,
                }}
              >
                {getFinalHarmonyTitle()}
              </div>
              <div style={{ fontSize: 30, fontWeight: 700 }}>{completionInfo.totalHarmony}</div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                  opacity: 0.72,
                  marginBottom: 6,
                }}
              >
                {getBestHarmonyTitle()}
              </div>
              <div style={{ fontSize: 26, fontWeight: 700 }}>{highScore}</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={startAdventure} style={buttonStyle('#2f9e44')}>
              {getPlayAgainTitle()}
            </button>
            <button onClick={returnToMenu} style={buttonStyle('#ffffff', '#17345c')}>
              {getGardenMapButtonTitle()}
            </button>
          </div>
        </div>
      )}

      {showSettings && (
        <Settings
          initialSettings={gameSettings}
          onClose={() => setShowSettings(false)}
          onSave={saveSettings}
        />
      )}
    </div>
  );
};

export default App;
