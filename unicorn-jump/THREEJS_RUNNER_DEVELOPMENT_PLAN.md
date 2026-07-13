# Three.js And Unicorn Runner Development Plan

## Purpose

Turn the new roadmap concepts into an implementable plan for:

- a Three.js Lantern Garden / world-layer track
- an optional Unicorn Runner mode

This plan is intentionally additive. The current React DOM exploration runtime remains the stable gameplay path until a focused prototype proves that a Three.js replacement would create enough value to justify the churn.

## Current Baseline

The project already has:

- a React app shell in `src/App.js`
- the main 2D exploration runtime in `src/Game.js`
- biome identity, palettes, creatures, quests, landing layouts, village rewards, and companion hooks in `src/biomeManager.js`
- sprite lookup and runtime art selection in `src/spriteCatalog.js`
- builder world and builder room modes in `src/BuilderWorld.js` and `src/BuilderRoom.js`
- a roadmap direction centered on Lantern Garden, regional gates, landmarks, village ecology, and friendly non-punishing traversal

The plan should not begin by rewriting the existing jump game. It should create new surfaces that can read the same progression state and route back into the current game.

## Product Principles

- Keep the game understandable for a young player.
- Make the world more physical and memorable without adding precision 3D platforming.
- Prefer short, visible, satisfying prototypes over broad engine rewrites.
- Keep every new mode optional until it has been playtested.
- Reuse existing biome data and reward systems instead of creating disconnected minigames.
- Preserve fast startup, mobile browser compatibility, keyboard controls, pointer controls, and touch controls.

## Track A: Three.js World Layers

### Goal

Create a 3D-feeling world presentation layer that makes Lantern Garden, region gates, builder houses, and room destinations feel like tangible places.

### Non-Goals

- replacing `src/Game.js` in the first pass
- adding free-roaming 3D camera movement
- adding physics-based 3D platforming
- requiring 3D assets for every existing sprite before the prototype works

### Phase A0: Technical Spike

Objective:

- prove Three.js can coexist with the current CRA/react-scripts stack and render reliably in the app shell

Implementation tasks:

- add `three` as a dependency
- create a small `src/three/` folder for isolated Three.js code
- create a reusable `ThreeSceneHost` React component that owns canvas setup, resize handling, animation loop, teardown, and pointer coordinate mapping
- expose a small debug readout through `window.render_game_to_text` or a parallel debug hook when the Three.js scene is active
- verify that the scene mounts and unmounts cleanly when switching modes

Prototype content:

- one camera
- one directional light
- one ambient light
- one ground plane
- five simple gate markers
- one clickable home marker

Exit criteria:

- no WebGL console errors on app startup
- no memory leak or duplicate animation loop after entering and leaving the scene several times
- the current 2D game still starts normally
- the scene is responsive on laptop and phone-sized viewports

### Phase A1: Lantern Garden Hub Diorama

Objective:

- replace or supplement the menu world selector with a small 3D Lantern Garden hub

Implementation tasks:

- create `src/three/LanternGardenScene.js`
- map existing biome progress into five gate states: locked, available, current, completed, and final-ready
- render a calm central garden with:
  - home tree
  - five region gates
  - connecting paths
  - soft lantern lights
  - simple landmark silhouettes per region
- support pointer/tap selection of gates
- keep keyboard navigation available with left/right/enter or tab/enter
- route selected gates back into the current `startGame` / selected-biome flow in `App.js`

Design rules:

- camera is mostly fixed and gently angled, like a toy garden diorama
- the full map should be readable without camera rotation
- gate labels and interaction prompts remain React DOM overlays, not 3D text
- progress should be visible through shape, light, and color, not only text

Exit criteria:

- a player can understand all five regions from the hub
- selecting a gate starts the matching existing biome run
- completed regions visibly change the garden
- locked regions are clear but not punitive

### Phase A2: World-State Reactions

Objective:

- let completed quests and village rewards create visible changes in the Three.js hub

Implementation tasks:

- define a shared world-state adapter that reads current journey, completed biomes, unlocked companions, and builder stars
- add per-biome reaction descriptors:
  - Lantern Bamboo Valley: lanterns awaken and bridge lights turn on
  - Highland Meadow: wind ribbon and stone-circle glow
  - Storybook Forest: pages orbit the gate and plants grow
  - Sun Orchard: mirror beam sweeps across the gate
  - Bluebonnet Prairie: flower bands and windmill motion appear
- keep reactions deterministic from saved state where possible

Exit criteria:

- returning to the hub after progress gives an immediate visual reward
- the hub communicates progression without needing a modal
- all visual effects remain gentle and low-motion

### Phase A3: Builder World Diorama

Objective:

- upgrade the builder world from a flat grid into a readable 3D tile garden while preserving simple placement rules

Implementation tasks:

- create a `BuilderWorld3D` prototype surface that reads the existing builder grid state
- render tiles, paths, and placed houses as simple low-poly markers
- use the current house family data for palette and silhouette selection
- keep placement and selection logic in existing builder state helpers
- keep the inventory, confirmation, and house selection UI in React DOM overlays

Exit criteria:

- empty tiles are easy to identify
- occupied tiles are easy to enter
- house placement is still fast and forgiving
- the 3D view does not make the builder feel like terrain editing

### Phase A4: Room Shell Depth Pass

Objective:

- give builder rooms a stronger destination feel without disrupting the current drag-and-drop grid

Implementation tasks:

- prototype one 3D room shell behind or around the current `BuilderRoom` grid
- start with the most visually distinct room family, likely Future Sky Dome or Korean Garden Court
- keep furniture placement, item inventory, and NPC interactions in the current 2D room system
- use Three.js only for background depth, lighting, window/parallax details, and ambient animated props

Exit criteria:

- the room feels more like a place before furniture is added
- furniture remains easy to see and place
- the Three.js background never blocks grid interaction

## Track B: Unicorn Runner

### Goal

Add a short, optional runner mode that turns the unicorn, companions, collectibles, and biome identity into a fast replayable reward loop.

### Non-Goals

- replacing the main vertical exploration mode
- making runner rewards mandatory for biome progression
- introducing harsh fail states
- building a full 3D physics runner in the first pass

### Phase B0: Runner Design Lock

Objective:

- define the runner as a contained mode with clear controls, reward rules, and progression boundaries

Design decisions:

- camera format: side-view 2D first, with a later Three.js 2.5D option
- session length: 45 to 75 seconds
- controls: jump, glide/hold, optional companion boost
- failure model: slowdowns, combo loss, soft rescue, or early finish; no hard defeat screen
- reward model: small builder-star payout, cosmetic unlock progress, or daily quest credit
- entry points: daily run, region practice, celebration run after a quest, or hub gate activity

Exit criteria:

- one-page runner spec is approved before implementation
- reward output cannot unbalance builder or exploration progression
- the runner can be ignored without blocking the main game

### Phase B1: 2D Runner Prototype

Objective:

- build the smallest playable runner using existing art and React patterns

Implementation tasks:

- create `src/RunnerGame.js`
- reuse existing unicorn sprites and biome background images
- implement deterministic runner state:
  - distance
  - speed
  - lane or ground height
  - jump velocity
  - glide state
  - active collectibles
  - soft obstacles
  - combo count
  - reward estimate
- expose runner state through `window.render_game_to_text`
- add `window.advanceTime(ms)` support for deterministic automated checks
- add a temporary route or menu entry that launches the runner without changing main progression

First slice:

- Lantern Bamboo Valley runner
- lantern-heart collectibles
- bamboo bridge humps or soft cloud obstacles
- rescue leaf recovery
- Glow Fox guide-light pickup path if unlocked

Exit criteria:

- playable from keyboard and pointer/touch
- one run can be completed in under a minute
- score/reward summary appears at the end
- no regression in main exploration mode

### Phase B2: Companion And Biome Hooks

Objective:

- make runner mode feel connected to the Living Garden systems

Implementation tasks:

- let unlocked companions create runner modifiers:
  - Glow Fox: guide-light collectible trail
  - Wind Sheep: longer glide window
  - Butterfly Spirit: combo save
  - Songbird: score chime streak
  - Firefly Friend: nearby collectible pull
- add a runner profile per biome:
  - palette
  - collectible family
  - obstacle family
  - ground/sky treatment
  - one biome-specific micro-mechanic
- keep all modifiers readable in a small pre-run selection panel

Exit criteria:

- each unlocked companion changes runner feel in a small, understandable way
- each biome runner has one recognizable identity
- the mode still works for a first-time player with no companion unlocked

### Phase B3: Three.js 2.5D Runner Experiment

Objective:

- test whether Three.js improves runner feel enough to justify the added rendering complexity

Implementation tasks:

- create a separate runner renderer prototype, not a replacement for the 2D runner state
- keep simulation in plain JS data and render it through either DOM/2D or Three.js
- render terrain depth, gate fly-bys, collectible sparkle lanes, and soft obstacle silhouettes
- keep input and collision 2D

Exit criteria:

- the 3D renderer looks meaningfully better than the 2D runner
- performance stays stable on mobile-sized viewports
- the player never has to judge depth for core collision timing

### Phase B4: Progression Integration

Objective:

- connect runner rewards to the wider game only after the mode is stable

Implementation tasks:

- add a small reward sink:
  - builder stars
  - room decoration sparkle currency
  - daily activity completion
  - cosmetic trail color
- persist runner stats separately from core biome completion
- add safety limits for daily rewards if needed
- show runner completion as a small world reaction in the hub

Exit criteria:

- runner rewards feel useful but not required
- save data migration is simple and backward-compatible
- a failed or skipped runner never blocks region progress

## Shared Architecture Plan

### Suggested New Files

```text
src/
  modes/
    gameModes.js
  three/
    ThreeSceneHost.js
    LanternGardenScene.js
    BuilderWorldScene.js
    roomShellScenes.js
    threeThemeAdapters.js
  runner/
    RunnerGame.js
    runnerState.js
    runnerBiomeProfiles.js
    runnerCompanionEffects.js
    runnerRewards.js
```

Keep these names flexible. Match the existing flat `src/` structure unless the repo is already being moved toward folders.

### Shared Data Adapters

Create thin adapter functions rather than importing all of `App.js` state into every new renderer:

- `getJourneyWorldState(journey, summerState, builderState)`
- `getBiomeGateState(biome, journey)`
- `getRunnerBiomeProfile(biomeId)`
- `getCompanionRunnerEffect(companionId)`
- `getBuilderTileVisual(tile, house)`

### Rendering Boundary

Use this division:

- React owns app modes, menus, overlays, settings, dialogs, rewards, and accessibility labels.
- Existing game systems own progression, quests, companions, and builder state.
- Three.js owns only 3D presentation, picking, camera, lights, and ambient animation.
- Runner simulation owns runner-specific movement and scoring.

### Save Data

Do not overload existing biome completion storage for experiments. If persistence is needed, add narrow keys:

- `threeHubPreferences`
- `runnerStats`
- `runnerDailyRewards`

Save data should be optional during early prototypes.

## Validation Plan

For documentation-only changes:

- no runtime validation is required

For implementation phases:

- run `npm run build`
- run the shared web-game Playwright client for each meaningful gameplay change
- add deterministic text-state coverage for new runner state
- inspect screenshots for menu, hub, gameplay, and completion states
- check console errors after mode switches
- test keyboard, pointer, and touch paths
- test at least one mobile-sized viewport and one laptop-sized viewport

Three.js-specific checks:

- scene is nonblank
- canvas resizes correctly
- pointer selection maps to the right gate/tile
- animation loop stops on unmount
- no WebGL context or texture errors
- low-motion mode can reduce ambient movement if needed

Runner-specific checks:

- jump and glide are responsive
- collectibles can be collected
- soft obstacles create recovery behavior, not a hard fail
- run timer and reward summary are accurate
- `window.render_game_to_text` matches visible state
- `window.advanceTime(ms)` produces deterministic results

## Recommended Sequence

1. Technical Spike: Three.js scene host.
2. Lantern Garden Hub Diorama.
3. Runner Design Lock.
4. 2D Lantern Bamboo Valley Runner.
5. Hub world-state reactions.
6. Runner companion hooks.
7. Builder World Diorama.
8. Room Shell Depth Pass.
9. Three.js 2.5D Runner experiment.
10. Progression and reward integration.

This sequence puts the most useful navigation improvement first, then proves the runner in the cheaper 2D path before spending effort on a 2.5D renderer.

## Open Questions

- Should the Three.js hub replace the existing world selector or sit behind it as an enhanced view?
- Should runner mode be a daily activity, a region practice mode, or a post-quest celebration first?
- Should runner rewards feed the summer-star system, builder furniture unlocks, or a separate cosmetic trail system?
- Which room family should get the first Three.js shell: Future Sky Dome for obvious depth, or Korean Garden Court because it anchors the current builder direction?
- Should a low-motion setting be added before any Three.js hub animation ships?

## First Implementation Ticket

Title:

- Add Three.js Lantern Garden technical spike

Scope:

- add `three`
- add `ThreeSceneHost`
- render a noninteractive hub placeholder with five gate markers
- mount it behind a temporary development flag or hidden route
- verify build, mode switching, screenshot, console state, and unmount cleanup

Out of scope:

- replacing the production menu
- saving new hub state
- implementing runner gameplay
- creating final 3D art
