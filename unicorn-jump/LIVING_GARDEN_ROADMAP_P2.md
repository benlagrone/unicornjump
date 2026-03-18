# Living Garden Builder Roadmap P2

## Purpose

Record the production handoff for extending Unicorn Jump into a hybrid exploration and builder game without rewriting the existing runtime.

Use this with:

- `WORLD_DESIGN_GUIDE.md`
- `WORLD_ROADMAP.md`
- `ART_DESIGN_GUIDE.md`
- `ART_ROADMAP.md`

Core instruction:

- keep the existing exploration loop
- add builder systems as modular layers on top
- prioritize responsive interaction over visual polish
- treat rooms as themed destinations, not neutral boxes
- move builder houses, room shells, furniture packs, and related power-up / prop art through the same `Good` / `Better` / `Best` quality matrix as the main game

## Current Focus

This roadmap records the full builder/decorator plan, but the immediate implementation target is Phase 2:

- drag and drop furniture
- snap placement to a forgiving grid
- themed house selection
- themed room shells with strong world identity

Do not expand into future-only ideas until the core interaction is stable.

## Mode Model

The game should support three runtime modes:

- `exploration`
- `world`
- `room`

Recommended mode switch entry point:

```js
setGameMode("exploration" | "world" | "room")
```

Integration rule:

- do not replace the current exploration runtime in `src/Game.js`
- wrap or branch the runtime so builder modes can enter and exit cleanly

## Repo Integration Targets

Relative to the current `unicorn-jump/` app:

```text
src/
  systems/
    biomeManager.js      // extend existing biome logic or adapt through a thin wrapper
    worldBuilder.js
    roomBuilder.js
    inventorySystem.js
    saveSystem.js
  models/
    WorldTile.js
    House.js
    Room.js
    Item.js

public/assets/images/
  houses/
  furniture/
  biomes/
```

If moving the current `src/biomeManager.js` would create churn, keep that file as the stable public entry and compose new systems around it.

## System Overview

### Exploration Mode

- existing gameplay
- remains the primary traversal layer
- should be able to open `world` mode from the menu or hub

### World Builder Mode

- player sees a simple tile grid
- empty tiles offer fast house placement
- occupied tiles enter the selected house interior

### Room Decorator Mode

- player decorates one room at a time
- items come from a bottom inventory bar
- placement is snapped, forgiving, and overlap rules stay simple
- every room should already feel like a place before furniture is added

## Destination Themes

The builder should open into fantastic destination rooms, not plain square interiors.

Current thematic targets:

- Korean Gardens
- Fantasy Bavarian Castles
- Spanish Palaces
- MesoAmerican Pyramids
- GrecoRoman Circuses
- Scandinavian Longhouses
- Japanese Fortresses
- Babylonian Hanging Gardens
- Future Sky Domes

Art rule:

- adapt these as child-friendly fantasy inspirations rather than literal historical recreations
- favor wonder, warmth, and play over realism
- every active builder family needs a current tier and a named next pass toward the next tier

## World Builder System

### Grid

```js
const GRID_WIDTH = 10
const GRID_HEIGHT = 10
```

Use a fixed tile grid first. Do not introduce freeform terrain editing in this phase.

### WorldTile Model

```js
class WorldTile {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.type = "empty" // "empty" | "house"
    this.houseId = null
  }
}
```

### World Initialization

```js
function createWorld() {
  const tiles = []
  for (let x = 0; x < GRID_WIDTH; x++) {
    for (let y = 0; y < GRID_HEIGHT; y++) {
      tiles.push(new WorldTile(x, y))
    }
  }
  return tiles
}
```

### House Model

```js
class House {
  constructor(type) {
    this.id = generateId()
    this.type = type
  }
}
```

### Place House

```js
function placeHouse(tile, houseType) {
  if (tile.type !== "empty") return

  const house = createHouse(houseType)

  tile.type = "house"
  tile.houseId = house.id

  saveGame()
}
```

### World Interaction

```js
function onTileClick(tile) {
  if (tile.type === "empty") {
    openHouseSelectionMenu(tile)
  } else {
    enterRoom(tile.houseId)
  }
}
```

World-mode UI minimum:

- visible grid map
- `+` action on empty tiles
- readable house icons on occupied tiles

## Room Builder System

### Room Model

```js
class Room {
  constructor(houseId) {
    this.houseId = houseId
    this.items = []
  }
}
```

### Item Model

```js
class Item {
  constructor(type, x, y) {
    this.id = generateId()
    this.type = type
    this.x = x
    this.y = y
    this.rotation = 0
  }
}
```

### Snapping

```js
const GRID_SIZE = 32

function snapToGrid(x, y) {
  return {
    x: Math.round(x / GRID_SIZE) * GRID_SIZE,
    y: Math.round(y / GRID_SIZE) * GRID_SIZE
  }
}
```

### Drag And Drop

```js
function onItemDrag(item, mouseX, mouseY) {
  const pos = snapToGrid(mouseX, mouseY)
  item.x = pos.x
  item.y = pos.y
}
```

### Add Item

```js
function addItemToRoom(room, itemType, x, y) {
  const pos = snapToGrid(x, y)
  const item = new Item(itemType, pos.x, pos.y)
  room.items.push(item)
  saveGame()
}
```

Room-mode UI minimum:

- bottom inventory bar
- drag items into the room
- snap into place without precision stress

## Inventory System

Starter items:

```js
const STARTER_ITEMS = [
  "gems",
  "torches",
  "fruit_plates",
  "recliners",
  "wooden_stools",
  "period_tables",
  "period_benches",
  "period_screens",
  "period_planters"
]
```

Furniture rule:

- trays should be theme-aware
- each destination room should surface objects that belong in that setting
- avoid generic placeholder furniture once a themed pack exists
- once a themed pack exists, keep advancing it through the quality matrix instead of leaving it at the first acceptable version

Optional progression hooks:

```js
unlockItem("bamboo_table")
unlockHouse("lantern_house")
```

Do not make unlocks a dependency for Phase 2. The room editor should be usable immediately.

## Save System

Target shared state:

```js
const GameState = {
  worldTiles: [],
  houses: {},
  rooms: {}
}
```

Save:

```js
function saveGame() {
  localStorage.setItem("gameState", JSON.stringify(GameState))
}
```

Load:

```js
function loadGame() {
  const data = localStorage.getItem("gameState")
  if (data) {
    Object.assign(GameState, JSON.parse(data))
  }
}
```

Implementation note:

- if the current app already persists exploration progress, merge builder data into the existing save shape instead of creating a competing storage key

## Asset Requirements

House targets:

- `korean_garden_house.*`
- `bavarian_castle_house.*`
- `spanish_palace_house.*`
- `mesoamerican_pyramid_house.*`
- `grecoroman_circus_house.*`
- `scandinavian_longhouse_house.*`
- `japanese_fortress_house.*`
- `babylonian_hanging_gardens_house.*`
- `future_sky_dome_house.*`

Room-shell targets:

- one visual shell per destination theme
- themed walls / structures / floor language
- themed landmark details inside the room shell before any furniture is placed
- room-specific color scripts and decorative motifs

Furniture targets:

- gems
- torches
- fruit plates
- recliners
- wooden stools
- period tables
- period benches
- period screens
- period planters

Style rules:

- pastel colors
- rounded shapes
- thick outlines
- simple shading
- child-friendly proportions
- consistent scale
- every theme should still feel like it belongs to the same game

AI art prompt seed:

```text
cute cartoon furniture
soft pastel colors
rounded shapes
thick outline
toca boca style
game asset
transparent background
```

## Mode Entry And Exit

Entry points:

```js
setGameMode("world") // from menu or hub
setGameMode("room") // from house click
```

Exit paths:

```js
setGameMode("world") // from room
setGameMode("exploration") // from world
```

Rule:

- every mode switch should feel immediate
- no mode should strand the player without a clear way back

## Constraints

Do not add:

- physics collisions for furniture
- complex rotation systems
- strict overlap validation

Do add:

- snapping
- free placement
- forgiving UX

Child-facing rule:

- no action should feel like a failure state

## Phase Plan

### Phase 1

- world grid
- place houses
- enter rooms

### Phase 2

- drag and drop furniture
- snapping system
- themed house selection
- themed room shells

### Phase 3

- save and load builder state

### Phase 4

- unlock items from gameplay
- themed furniture packs that match each destination

## Success Criteria

The system succeeds when:

- a child can place a house in under 2 seconds
- a child can decorate a room without help
- no common action causes confusion or failure
- the interaction feels instant and obvious
- the builder modes layer onto Unicorn Jump without breaking exploration mode

## Not In Scope Yet

Do not build these in this pass:

- creature NPCs inside houses
- animated furniture
- multiplayer sharing
- seasonal themes

## Final Execution Instruction

Implement a modular world builder and room decorator system on top of the existing Unicorn Jump game.

Priorities:

1. preserve the current exploration game
2. make world mode simple and fast
3. make room mode forgiving and tactile
4. favor working interaction over polish
