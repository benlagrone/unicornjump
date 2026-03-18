export const BUILDER_WORLD_COLUMNS = 5;
export const BUILDER_WORLD_ROWS = 4;
export const BUILDER_ROOM_GRID_SIZE = 32;

export const HOUSE_TYPES = [
  {
    id: 'korean-garden-court',
    name: 'Korean Garden Court',
    shortLabel: 'KG',
    wallColor: '#f7f1e7',
    roofColor: '#34435a',
    trimColor: '#7c593e',
    glowColor: 'rgba(244, 180, 87, 0.22)',
    roomColumns: 16,
    roomRows: 10,
    roomTheme: {
      id: 'korean-garden',
      name: 'Moon Gate Garden',
      tagline: 'pond lanterns and bamboo eaves',
      skyTop: '#d7edf7',
      skyBottom: '#fff1d9',
      wallTop: '#ecf0e8',
      wallBottom: '#d2dccf',
      floorTop: '#b98c65',
      floorBottom: '#79583c',
      grid: 'rgba(52, 67, 90, 0.12)',
      frame: '#34435a',
      accent: '#f4b457',
    },
  },
  {
    id: 'fantasy-bavarian-castle',
    name: 'Fantasy Bavarian Castle',
    shortLabel: 'BC',
    wallColor: '#f7efe9',
    roofColor: '#43507f',
    trimColor: '#7b4e46',
    glowColor: 'rgba(135, 112, 255, 0.2)',
    roomColumns: 15,
    roomRows: 10,
    roomTheme: {
      id: 'bavarian-castle',
      name: 'Story Tower Hall',
      tagline: 'banner windows and turret light',
      skyTop: '#d7defa',
      skyBottom: '#fff0de',
      wallTop: '#f0e3d8',
      wallBottom: '#d3b7a2',
      floorTop: '#c28a63',
      floorBottom: '#7f523c',
      grid: 'rgba(67, 80, 127, 0.12)',
      frame: '#43507f',
      accent: '#d95f84',
    },
  },
  {
    id: 'spanish-palace-suite',
    name: 'Spanish Palace Suite',
    shortLabel: 'SP',
    wallColor: '#fff4ea',
    roofColor: '#c26845',
    trimColor: '#8a4f2d',
    glowColor: 'rgba(255, 159, 64, 0.2)',
    roomColumns: 15,
    roomRows: 10,
    roomTheme: {
      id: 'spanish-palace',
      name: 'Sun Court Salon',
      tagline: 'tile arches and fountain light',
      skyTop: '#ffe0c9',
      skyBottom: '#fff6e8',
      wallTop: '#f7dcc5',
      wallBottom: '#efc49b',
      floorTop: '#cf8f5f',
      floorBottom: '#9a5d39',
      grid: 'rgba(194, 104, 69, 0.12)',
      frame: '#a14f32',
      accent: '#1c9ab7',
    },
  },
  {
    id: 'mesoamerican-pyramid-room',
    name: 'MesoAmerican Pyramid',
    shortLabel: 'MP',
    wallColor: '#efe0bf',
    roofColor: '#bf7b34',
    trimColor: '#7c532e',
    glowColor: 'rgba(245, 158, 11, 0.2)',
    roomColumns: 14,
    roomRows: 10,
    roomTheme: {
      id: 'mesoamerican-pyramid',
      name: 'Sun Step Chamber',
      tagline: 'stone terraces and temple fire',
      skyTop: '#ffd49c',
      skyBottom: '#fff1d6',
      wallTop: '#dfc896',
      wallBottom: '#ba8a54',
      floorTop: '#aa6d3f',
      floorBottom: '#6d452b',
      grid: 'rgba(124, 83, 46, 0.14)',
      frame: '#7c532e',
      accent: '#ffdf6b',
    },
  },
  {
    id: 'grecoroman-circus-hall',
    name: 'GrecoRoman Circus',
    shortLabel: 'GC',
    wallColor: '#f7f4ef',
    roofColor: '#6b7ca7',
    trimColor: '#8f6544',
    glowColor: 'rgba(99, 102, 241, 0.2)',
    roomColumns: 16,
    roomRows: 10,
    roomTheme: {
      id: 'grecoroman-circus',
      name: 'Arena of Garlands',
      tagline: 'columns ribbons and marble light',
      skyTop: '#dbe8fb',
      skyBottom: '#fff5e6',
      wallTop: '#efe9df',
      wallBottom: '#dcccb8',
      floorTop: '#d2b487',
      floorBottom: '#96754f',
      grid: 'rgba(107, 124, 167, 0.12)',
      frame: '#6b7ca7',
      accent: '#d6556e',
    },
  },
  {
    id: 'scandinavian-longhouse',
    name: 'Scandinavian Longhouse',
    shortLabel: 'SL',
    wallColor: '#f0e7dc',
    roofColor: '#70503a',
    trimColor: '#4a3426',
    glowColor: 'rgba(251, 146, 60, 0.2)',
    roomColumns: 17,
    roomRows: 9,
    roomTheme: {
      id: 'scandinavian-longhouse',
      name: 'Northern Hearth Hall',
      tagline: 'timber beams and fire glow',
      skyTop: '#d8e4ef',
      skyBottom: '#fef3db',
      wallTop: '#cab29a',
      wallBottom: '#8a6246',
      floorTop: '#6d4a34',
      floorBottom: '#493124',
      grid: 'rgba(74, 52, 38, 0.12)',
      frame: '#4a3426',
      accent: '#f2994a',
    },
  },
  {
    id: 'japanese-fortress',
    name: 'Japanese Fortress',
    shortLabel: 'JF',
    wallColor: '#f8f3ed',
    roofColor: '#2f405b',
    trimColor: '#5b4235',
    glowColor: 'rgba(96, 165, 250, 0.18)',
    roomColumns: 15,
    roomRows: 10,
    roomTheme: {
      id: 'japanese-fortress',
      name: 'Castle Blossom Room',
      tagline: 'shoji light and moon bridge calm',
      skyTop: '#dce9f7',
      skyBottom: '#fff3ea',
      wallTop: '#f0ece6',
      wallBottom: '#ddd3c8',
      floorTop: '#b3875f',
      floorBottom: '#755239',
      grid: 'rgba(47, 64, 91, 0.12)',
      frame: '#2f405b',
      accent: '#f58aac',
    },
  },
  {
    id: 'babylonian-hanging-gardens',
    name: 'Babylonian Hanging Gardens',
    shortLabel: 'HG',
    wallColor: '#efe4c8',
    roofColor: '#467d6d',
    trimColor: '#7d5f3f',
    glowColor: 'rgba(52, 211, 153, 0.2)',
    roomColumns: 16,
    roomRows: 10,
    roomTheme: {
      id: 'babylonian-hanging-gardens',
      name: 'Terrace of Vines',
      tagline: 'arched stone and cascading green',
      skyTop: '#d8f0e1',
      skyBottom: '#fff6dc',
      wallTop: '#d8c495',
      wallBottom: '#a88253',
      floorTop: '#9b6e44',
      floorBottom: '#6e4b31',
      grid: 'rgba(70, 125, 109, 0.12)',
      frame: '#467d6d',
      accent: '#6ed39a',
    },
  },
  {
    id: 'future-sky-dome',
    name: 'Future Sky Dome',
    shortLabel: 'FD',
    wallColor: '#e7f1ff',
    roofColor: '#3f5fa8',
    trimColor: '#2a3768',
    glowColor: 'rgba(96, 165, 250, 0.22)',
    roomColumns: 16,
    roomRows: 10,
    roomTheme: {
      id: 'future-sky-dome',
      name: 'Nova Dome Lounge',
      tagline: 'star glass and moonlit circuits',
      skyTop: '#09162f',
      skyBottom: '#1d2f61',
      wallTop: '#d8e9ff',
      wallBottom: '#8db3e8',
      floorTop: '#6a7fb0',
      floorBottom: '#30446f',
      grid: 'rgba(191, 225, 255, 0.18)',
      frame: '#3f5fa8',
      accent: '#85f1ff',
    },
  },
];

const createFurniture = ({
  id,
  name,
  width,
  height,
  color,
  accent,
  type,
  themeIds,
}) => ({
  id,
  name,
  width,
  height,
  color,
  accent,
  type,
  themeIds,
});

export const FURNITURE_CATALOG = [
  createFurniture({
    id: 'jade-lantern',
    name: 'Jade Lantern',
    width: BUILDER_ROOM_GRID_SIZE * 2,
    height: BUILDER_ROOM_GRID_SIZE * 3,
    color: '#a7f3d0',
    accent: '#2f7d68',
    type: 'lantern',
    themeIds: ['korean-garden'],
  }),
  createFurniture({
    id: 'tea-floor-table',
    name: 'Tea Floor Table',
    width: BUILDER_ROOM_GRID_SIZE * 3,
    height: BUILDER_ROOM_GRID_SIZE * 2,
    color: '#d4b08a',
    accent: '#7c593e',
    type: 'table',
    themeIds: ['korean-garden'],
  }),
  createFurniture({
    id: 'persimmon-fruit-plate',
    name: 'Persimmon Fruit Plate',
    width: BUILDER_ROOM_GRID_SIZE * 2,
    height: BUILDER_ROOM_GRID_SIZE * 2,
    color: '#ffe3b3',
    accent: '#f59e0b',
    type: 'plate',
    themeIds: ['korean-garden'],
  }),
  createFurniture({
    id: 'velvet-recliner',
    name: 'Velvet Recliner',
    width: BUILDER_ROOM_GRID_SIZE * 4,
    height: BUILDER_ROOM_GRID_SIZE * 2,
    color: '#d8c4ff',
    accent: '#7b4e46',
    type: 'recliner',
    themeIds: ['bavarian-castle'],
  }),
  createFurniture({
    id: 'banner-torch',
    name: 'Banner Torch',
    width: BUILDER_ROOM_GRID_SIZE * 2,
    height: BUILDER_ROOM_GRID_SIZE * 3,
    color: '#ffe08a',
    accent: '#d95f84',
    type: 'torch',
    themeIds: ['bavarian-castle'],
  }),
  createFurniture({
    id: 'carved-chest',
    name: 'Carved Chest',
    width: BUILDER_ROOM_GRID_SIZE * 3,
    height: BUILDER_ROOM_GRID_SIZE * 2,
    color: '#d2a679',
    accent: '#6f4e37',
    type: 'chest',
    themeIds: ['bavarian-castle'],
  }),
  createFurniture({
    id: 'citrus-fruit-plate',
    name: 'Citrus Fruit Plate',
    width: BUILDER_ROOM_GRID_SIZE * 2,
    height: BUILDER_ROOM_GRID_SIZE * 2,
    color: '#ffe7bd',
    accent: '#f28c38',
    type: 'plate',
    themeIds: ['spanish-palace'],
  }),
  createFurniture({
    id: 'sun-recliner',
    name: 'Sun Recliner',
    width: BUILDER_ROOM_GRID_SIZE * 4,
    height: BUILDER_ROOM_GRID_SIZE * 2,
    color: '#f8c996',
    accent: '#1c9ab7',
    type: 'recliner',
    themeIds: ['spanish-palace'],
  }),
  createFurniture({
    id: 'tile-bench',
    name: 'Tile Bench',
    width: BUILDER_ROOM_GRID_SIZE * 3,
    height: BUILDER_ROOM_GRID_SIZE * 2,
    color: '#ffd7bc',
    accent: '#a14f32',
    type: 'bench',
    themeIds: ['spanish-palace'],
  }),
  createFurniture({
    id: 'sun-torch',
    name: 'Sun Torch',
    width: BUILDER_ROOM_GRID_SIZE * 2,
    height: BUILDER_ROOM_GRID_SIZE * 3,
    color: '#ffe082',
    accent: '#bf7b34',
    type: 'torch',
    themeIds: ['mesoamerican-pyramid'],
  }),
  createFurniture({
    id: 'gem-pedestal',
    name: 'Gem Pedestal',
    width: BUILDER_ROOM_GRID_SIZE * 2,
    height: BUILDER_ROOM_GRID_SIZE * 3,
    color: '#8ec5ff',
    accent: '#7c532e',
    type: 'gem',
    themeIds: ['mesoamerican-pyramid'],
  }),
  createFurniture({
    id: 'stone-stool',
    name: 'Stone Stool',
    width: BUILDER_ROOM_GRID_SIZE * 2,
    height: BUILDER_ROOM_GRID_SIZE * 2,
    color: '#d8c49f',
    accent: '#8f6b48',
    type: 'stool',
    themeIds: ['mesoamerican-pyramid'],
  }),
  createFurniture({
    id: 'marble-chaise',
    name: 'Marble Chaise',
    width: BUILDER_ROOM_GRID_SIZE * 4,
    height: BUILDER_ROOM_GRID_SIZE * 2,
    color: '#eef2f7',
    accent: '#6b7ca7',
    type: 'recliner',
    themeIds: ['grecoroman-circus'],
  }),
  createFurniture({
    id: 'laurel-table',
    name: 'Laurel Table',
    width: BUILDER_ROOM_GRID_SIZE * 3,
    height: BUILDER_ROOM_GRID_SIZE * 2,
    color: '#e8d3ad',
    accent: '#d6556e',
    type: 'table',
    themeIds: ['grecoroman-circus'],
  }),
  createFurniture({
    id: 'grape-fruit-plate',
    name: 'Grape Fruit Plate',
    width: BUILDER_ROOM_GRID_SIZE * 2,
    height: BUILDER_ROOM_GRID_SIZE * 2,
    color: '#f0e7d7',
    accent: '#7c5ba8',
    type: 'plate',
    themeIds: ['grecoroman-circus'],
  }),
  createFurniture({
    id: 'wooden-stool',
    name: 'Wooden Stool',
    width: BUILDER_ROOM_GRID_SIZE * 2,
    height: BUILDER_ROOM_GRID_SIZE * 2,
    color: '#c9996d',
    accent: '#4a3426',
    type: 'stool',
    themeIds: ['scandinavian-longhouse'],
  }),
  createFurniture({
    id: 'hearth-torch',
    name: 'Hearth Torch',
    width: BUILDER_ROOM_GRID_SIZE * 2,
    height: BUILDER_ROOM_GRID_SIZE * 3,
    color: '#ffd699',
    accent: '#f2994a',
    type: 'torch',
    themeIds: ['scandinavian-longhouse'],
  }),
  createFurniture({
    id: 'timber-bench',
    name: 'Timber Bench',
    width: BUILDER_ROOM_GRID_SIZE * 3,
    height: BUILDER_ROOM_GRID_SIZE * 2,
    color: '#b88257',
    accent: '#4a3426',
    type: 'bench',
    themeIds: ['scandinavian-longhouse'],
  }),
  createFurniture({
    id: 'paper-lantern',
    name: 'Paper Lantern',
    width: BUILDER_ROOM_GRID_SIZE * 2,
    height: BUILDER_ROOM_GRID_SIZE * 3,
    color: '#fff3d6',
    accent: '#2f405b',
    type: 'lantern',
    themeIds: ['japanese-fortress'],
  }),
  createFurniture({
    id: 'lacquer-stool',
    name: 'Lacquer Stool',
    width: BUILDER_ROOM_GRID_SIZE * 2,
    height: BUILDER_ROOM_GRID_SIZE * 2,
    color: '#f5d5dd',
    accent: '#5b4235',
    type: 'stool',
    themeIds: ['japanese-fortress'],
  }),
  createFurniture({
    id: 'blossom-screen',
    name: 'Blossom Screen',
    width: BUILDER_ROOM_GRID_SIZE * 3,
    height: BUILDER_ROOM_GRID_SIZE * 3,
    color: '#f8ede6',
    accent: '#f58aac',
    type: 'screen',
    themeIds: ['japanese-fortress'],
  }),
  createFurniture({
    id: 'garden-recliner',
    name: 'Garden Recliner',
    width: BUILDER_ROOM_GRID_SIZE * 4,
    height: BUILDER_ROOM_GRID_SIZE * 2,
    color: '#d8c495',
    accent: '#467d6d',
    type: 'recliner',
    themeIds: ['babylonian-hanging-gardens'],
  }),
  createFurniture({
    id: 'royal-fruit-plate',
    name: 'Royal Fruit Plate',
    width: BUILDER_ROOM_GRID_SIZE * 2,
    height: BUILDER_ROOM_GRID_SIZE * 2,
    color: '#ffe4ab',
    accent: '#f18f4f',
    type: 'plate',
    themeIds: ['babylonian-hanging-gardens'],
  }),
  createFurniture({
    id: 'hanging-vine-planter',
    name: 'Hanging Vine Planter',
    width: BUILDER_ROOM_GRID_SIZE * 2,
    height: BUILDER_ROOM_GRID_SIZE * 3,
    color: '#a7e6bf',
    accent: '#467d6d',
    type: 'planter',
    themeIds: ['babylonian-hanging-gardens'],
  }),
  createFurniture({
    id: 'nova-gem-cluster',
    name: 'Nova Gem Cluster',
    width: BUILDER_ROOM_GRID_SIZE * 2,
    height: BUILDER_ROOM_GRID_SIZE * 3,
    color: '#c4f4ff',
    accent: '#4ed8ff',
    type: 'gem',
    themeIds: ['future-sky-dome'],
  }),
  createFurniture({
    id: 'halo-torch',
    name: 'Halo Torch',
    width: BUILDER_ROOM_GRID_SIZE * 2,
    height: BUILDER_ROOM_GRID_SIZE * 3,
    color: '#e4f8ff',
    accent: '#7b8dff',
    type: 'torch',
    themeIds: ['future-sky-dome'],
  }),
  createFurniture({
    id: 'orbit-recliner',
    name: 'Orbit Recliner',
    width: BUILDER_ROOM_GRID_SIZE * 4,
    height: BUILDER_ROOM_GRID_SIZE * 2,
    color: '#d7e8ff',
    accent: '#4f7bff',
    type: 'recliner',
    themeIds: ['future-sky-dome'],
  }),
  createFurniture({
    id: 'starlight-console',
    name: 'Starlight Console',
    width: BUILDER_ROOM_GRID_SIZE * 3,
    height: BUILDER_ROOM_GRID_SIZE * 2,
    color: '#b2c7f1',
    accent: '#2a3768',
    type: 'table',
    themeIds: ['future-sky-dome'],
  }),
];

const createWorldTile = (x, y) => ({
  id: `tile-${x}-${y}`,
  x,
  y,
  houseId: null,
});

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const createWorldTiles = () => {
  const tiles = [];

  for (let y = 0; y < BUILDER_WORLD_ROWS; y += 1) {
    for (let x = 0; x < BUILDER_WORLD_COLUMNS; x += 1) {
      tiles.push(createWorldTile(x, y));
    }
  }

  return tiles;
};

export const createInitialBuilderState = () => ({
  tiles: createWorldTiles(),
  houses: [],
  nextHouseNumber: 1,
  nextRoomItemNumber: 1,
});

export const getTileById = (builderState, tileId) =>
  builderState.tiles.find((tile) => tile.id === tileId) || null;

export const getHouseById = (builderState, houseId) =>
  builderState.houses.find((house) => house.id === houseId) || null;

export const getHouseTypeDefinition = (typeId) =>
  HOUSE_TYPES.find((entry) => entry.id === typeId) || HOUSE_TYPES[0];

export const getFurnitureDefinition = (typeId) =>
  FURNITURE_CATALOG.find((item) => item.id === typeId) || null;

export const getFurnitureCatalogForTheme = (themeId) =>
  FURNITURE_CATALOG.filter((item) => item.themeIds?.includes(themeId));

export const snapRoomPosition = (room, furniture, rawPosition) => {
  const maxX = Math.max(0, room.width - furniture.width);
  const maxY = Math.max(0, room.height - furniture.height);

  return {
    x: clamp(
      Math.round((rawPosition.x ?? 0) / BUILDER_ROOM_GRID_SIZE) * BUILDER_ROOM_GRID_SIZE,
      0,
      maxX
    ),
    y: clamp(
      Math.round((rawPosition.y ?? 0) / BUILDER_ROOM_GRID_SIZE) * BUILDER_ROOM_GRID_SIZE,
      0,
      maxY
    ),
  };
};

const mapHouse = (builderState, houseId, updateHouse) =>
  builderState.houses.map((house) => (house.id === houseId ? updateHouse(house) : house));

export const placeHouseOnTile = (builderState, tileId, houseTypeId = HOUSE_TYPES[0].id) => {
  const existingTile = getTileById(builderState, tileId);
  if (!existingTile) {
    return {
      builderState,
      house: null,
      placed: false,
    };
  }

  if (existingTile.houseId) {
    return {
      builderState,
      house: getHouseById(builderState, existingTile.houseId),
      placed: false,
    };
  }

  const houseType = getHouseTypeDefinition(houseTypeId);
  const houseId = `house-${builderState.nextHouseNumber}`;
  const house = {
    id: houseId,
    tileId,
    typeId: houseType.id,
    name: `${houseType.name} ${builderState.nextHouseNumber}`,
    shortLabel: houseType.shortLabel,
    palette: {
      wallColor: houseType.wallColor,
      roofColor: houseType.roofColor,
      trimColor: houseType.trimColor,
      glowColor: houseType.glowColor,
    },
    roomTheme: {
      ...houseType.roomTheme,
    },
    room: {
      width: BUILDER_ROOM_GRID_SIZE * houseType.roomColumns,
      height: BUILDER_ROOM_GRID_SIZE * houseType.roomRows,
      items: [],
    },
  };

  return {
    builderState: {
      ...builderState,
      tiles: builderState.tiles.map((tile) =>
        tile.id === tileId ? { ...tile, houseId } : tile
      ),
      houses: [...builderState.houses, house],
      nextHouseNumber: builderState.nextHouseNumber + 1,
    },
    house,
    placed: true,
  };
};

export const placeFurnitureInHouse = (builderState, houseId, typeId, rawPosition) => {
  const house = getHouseById(builderState, houseId);
  const furniture = getFurnitureDefinition(typeId);

  if (!house || !furniture) {
    return {
      builderState,
      item: null,
      placed: false,
    };
  }

  const snappedPosition = snapRoomPosition(house.room, furniture, rawPosition);
  const item = {
    id: `room-item-${builderState.nextRoomItemNumber}`,
    typeId: furniture.id,
    name: furniture.name,
    type: furniture.type,
    color: furniture.color,
    accent: furniture.accent,
    width: furniture.width,
    height: furniture.height,
    x: snappedPosition.x,
    y: snappedPosition.y,
  };

  return {
    builderState: {
      ...builderState,
      houses: mapHouse(builderState, houseId, (currentHouse) => ({
        ...currentHouse,
        room: {
          ...currentHouse.room,
          items: [...currentHouse.room.items, item],
        },
      })),
      nextRoomItemNumber: builderState.nextRoomItemNumber + 1,
    },
    item,
    placed: true,
  };
};

export const moveFurnitureInHouse = (builderState, houseId, itemId, rawPosition) => {
  const house = getHouseById(builderState, houseId);
  if (!house) {
    return builderState;
  }

  const existingItem = house.room.items.find((item) => item.id === itemId);
  if (!existingItem) {
    return builderState;
  }

  const snappedPosition = snapRoomPosition(house.room, existingItem, rawPosition);

  return {
    ...builderState,
    houses: mapHouse(builderState, houseId, (currentHouse) => ({
      ...currentHouse,
      room: {
        ...currentHouse.room,
        items: currentHouse.room.items.map((item) =>
          item.id === itemId
            ? {
                ...item,
                x: snappedPosition.x,
                y: snappedPosition.y,
              }
            : item
        ),
      },
    })),
  };
};
