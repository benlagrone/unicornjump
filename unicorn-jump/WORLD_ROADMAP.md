# World Roadmap

## Goal

Evolve the current biome-by-biome journey into a clearer world structure built around:

- one central hub
- five themed regions
- visible unlocks
- child-friendly traversal
- reusable layout and generation systems

## Current State

The current game already has:

- five biomes
- creature encounters
- biome quests
- completion progression

The current game does not yet fully have:

- a navigable hub world
- physical regional gateways
- landmark-driven navigation
- region-specific village hubs
- a reusable structured world-generation layer

## Phase 0: World Rules

Objective:

- lock the world structure before adding more content

Deliverables:

- `WORLD_DESIGN_GUIDE.md`
- agreed hub name and purpose
- agreed mechanic-per-region rule
- agreed safety rules for child-friendly play

Exit criteria:

- team agrees the world is hub-centered
- team agrees each biome has one primary mechanic
- team agrees the game remains friendly and non-punishing

## Phase 1: Hub World Concept

Objective:

- define Lantern Garden as the center of the game

Deliverables:

- hub layout sketch
- portal lantern gate concept
- upgrade tree concept
- home treehouse concept
- creature village zone plan

Exit criteria:

- the hub clearly explains where all regions connect
- the hub can serve as both menu and narrative home
- the hub is visually calmer than the regions

## Phase 2: Region Identity Lock

Objective:

- give every biome one clear mechanical identity and landmark set

Deliverables per biome:

- one signature mechanic
- three memorable landmarks
- one village concept
- one reward/unlock reaction

Mechanic targets:

- Lantern Bamboo Valley: glide on wind
- Highland Meadow: push stones
- Storybook Forest: grow plants
- Sun Orchard: light mirrors
- Bluebonnet Prairie: ride wind currents

Exit criteria:

- regions no longer feel interchangeable
- the player can explain what is special about each biome in one sentence

## Phase 3: Landmark And Navigation Pass

Objective:

- make navigation visual instead of menu-heavy

Deliverables:

- landmark list per biome
- visibility rules for each landmark
- camera composition notes for showing major landmarks
- path-signaling rules for safe routes

Exit criteria:

- players can navigate by memory and sight
- major destination points are visible from multiple elevations

## Phase 4: Village And Quest Ecology

Objective:

- turn regions into living places instead of obstacle fields

Deliverables per biome:

- creature village roster
- quest list
- help-based progression triggers
- world reaction list

Example triggers:

- bridge grows
- portal opens
- wind current appears
- lanterns awaken

Exit criteria:

- progression feels like helping a place, not just beating a level
- creature villages reinforce biome identity

## Phase 5: Vertical Layout Template

Objective:

- define a reusable level grammar for jump-based exploration

Deliverables:

- height band rules
- jump rhythm template
- rest platform rules
- reward platform rules
- encounter placement rules

Core height bands:

- ground level
- tree platforms
- cliff platforms
- sky platforms

Core beat sequence:

- start platform
- jump chain
- rest platform
- creature encounter
- puzzle area
- reward platform
- exit gate

Exit criteria:

- layouts stay readable
- traversal difficulty stays predictable for young players
- the jump mechanic remains central

## Phase 6: Lantern Bamboo Valley Benchmark

Objective:

- complete one region as the benchmark world slice

Deliverables:

- hub connection to Lantern Bamboo Valley
- panda garden landmark
- lantern waterfall landmark
- bamboo village zone
- platform path with clear vertical layers
- visible world-change reaction after quest completion

Exit criteria:

- one region proves the hub-and-petals model works
- the benchmark can be reused to guide the other biomes

## Phase 7: Remaining Region Conversion

Objective:

- apply the benchmark pattern to the other four biomes

Order:

1. Highland Meadow
2. Storybook Forest
3. Sun Orchard
4. Bluebonnet Prairie

Deliverables per region:

- hub connection
- mechanic tutorial beat
- landmark trio
- village zone
- reward reaction

Exit criteria:

- all regions fit the same world logic
- no biome feels like a disconnected minigame

## Phase 8: Safe-Fall And Friendly-World Pass

Objective:

- reinforce child-friendly world behavior across the entire game

Deliverables:

- bounce flower rules
- rescue leaf placement rules
- soft fall recovery rules
- no-hostility interaction rules
- comfort-motion set for world ambience

Exit criteria:

- the whole world feels safe
- setbacks never feel punishing
- ambience supports delight rather than tension

## Phase 9: Procedural Expansion Layer

Objective:

- support future endless or remixed world slices without losing structure

Systems:

- biome generator
- platform generator
- creature spawner
- quest generator

Allowed procedural variants:

- bamboo island
- lantern canyon
- floating bamboo bridge

Exit criteria:

- generated layouts still follow the approved beat structure
- generated scenes still look like part of the same world

## Phase 10: Runtime Integration

Objective:

- translate the world-system docs into runtime architecture

Likely integration targets:

- `App.js` for hub and region navigation flow
- `biomeManager.js` for region identity and landmark data
- `Game.js` for layout beats, village encounters, and visible world-state changes

Exit criteria:

- the hub flow is represented in code
- biome progression can be reflected physically, not only in overlays
- world-state changes have stable data hooks

## Fastest Path To Meaningful Progress

If the goal is fast visible improvement:

1. lock Lantern Garden hub concept
2. lock mechanic map for all five regions
3. build Lantern Bamboo Valley as the benchmark region
4. connect that region to the hub
5. reuse the pattern across the other biomes

## Risks

- generating isolated backgrounds without a hub plan will create a disconnected world
- adding too many mechanics at once will confuse young players
- landmarks that are too subtle will fail as navigation anchors
- foreground detail can hide safe jump paths
- procedural generation without structure will break the cozy tone

## Success Definition

The roadmap succeeds when:

- the world feels like one magical place
- the player always knows where home is
- each region has one memorable mechanic
- the hub makes the world easier to understand
- progression changes the world in visible, friendly ways
