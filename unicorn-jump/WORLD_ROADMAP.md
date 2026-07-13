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

## Future Concept: Three.js World Layers

Objective:

- explore Three.js as an additive world-presentation layer, not as a replacement for the current 2D exploration runtime
- use `THREEJS_RUNNER_DEVELOPMENT_PLAN.md` as the extended implementation plan for this concept and the optional Unicorn Runner mode

Strongest use cases:

- Lantern Garden hub as a small 3D diorama with five visible regional gates
- clickable 3D portal gates that launch the existing biome runs
- builder-world preview as a 3D tile garden with houses, paths, lanterns, trees, and visible unlocks
- room shells as 3D-feeling stage backdrops for the destination themes already planned in the builder roadmap
- biome landmark moments such as gates opening, bridges growing, wind currents appearing, lanterns awakening, and mirror light activating

Integration rules:

- keep `Game.js` as the stable 2D jump/exploration runtime unless a dedicated prototype proves a replacement is worth the churn
- keep physics, collision, quest, creature, and companion logic data-driven and reusable by both 2D and 3D presentation layers
- mount Three.js scenes as separate mode surfaces from `App.js`, especially for `world` and `room` modes
- preserve the child-friendly movement rules: no hostile camera motion, no disorienting depth shifts, and no precision 3D platforming unless it is a separate optional mode

First prototype:

- build a Three.js Lantern Garden hub with simple low-poly forms, five gates, a home tree, visible progress states, and click/tap routing into the existing 2D biome flow

Exit criteria:

- the hub makes navigation clearer than the current menu flow
- the 3D layer loads quickly on laptop and mobile browsers
- the existing 2D biome runs still behave the same
- the prototype creates a reusable bridge between world state and visual state

## Future Concept: Unicorn Runner

Objective:

- capture the unicorn runner idea as a distinct, optional mode that can reuse the existing character, biome, companion, and reward systems

Concept:

- a side-view or 2.5D endless runner where the unicorn runs through unlocked regions, gathers stars or quest echoes, dodges soft obstacles, and triggers companion boosts
- gameplay stays simple: jump, glide, collect, recover
- setbacks remain gentle, using rescue leaves, bounce flowers, soft slowdowns, or lost combo bonuses instead of harsh failure

Possible formats:

- daily short run that earns builder stars
- region practice mode after a biome is unlocked
- celebration run after completing a creature quest
- Three.js 2.5D showcase with 3D terrain depth but 2D controls

Reuse targets:

- existing biome palettes and background identity
- current unicorn sprite states or future 3D/2.5D character art
- companion effects such as guide lights, gentle breeze, leaf bloom, joy chime, and firefly magnet
- existing quest item families as runner collectibles

Integration rules:

- do not let runner mode interrupt the main world roadmap
- keep runner rewards small and additive so builder/exploration progression still matters
- prototype as a separate route or mode before wiring it into core progression

Exit criteria:

- one short Lantern Bamboo Valley runner slice feels fun in under one minute
- controls work with keyboard, touch, and pointer
- the mode produces a clear reward that feeds back into the Living Garden without becoming mandatory

## Future Concept: Virtual Pet Unicorn

Objective:

- add a virtual pet unicorn mode where the player can care for, bond with, decorate for, and gently play with the Little Unicorn between world adventures
- use `UNICORN_PET_DEVELOPMENT_PLAN.md` as the extended implementation plan for this feature

Concept:

- a cozy care app inside the existing game where the unicorn has friendly needs such as snack, sparkle, rest, play, grooming, and affection
- care creates immediate animations, sounds, room reactions, and small bond progress
- no neglect punishment: the unicorn may become sleepy, dusty, or snacky, but the main game remains playable

Core actions:

- feed treats
- brush mane and polish horn
- play with toys
- rest in a cozy room
- dress up with earned cosmetics
- decorate the room with pet furniture

Integration targets:

- builder rooms become the unicorn's home spaces
- biome completions unlock treats, toys, grooming styles, and memory bubbles
- future runner mode can earn small treats or sparkle rewards
- companions and room NPCs can react to care moments
- a future Three.js hub can show the unicorn resting near the home tree

Exit criteria:

- one pet room prototype supports feed, brush, and play
- pet state persists safely without punishing absence
- care loops remain short, optional, and rewarding
- the feature strengthens the home-base fantasy without replacing exploration, builder, or runner modes

## Future Concept: Collectible Coins

Objective:

- add collectible coins as a general-purpose reward layer for exploration, future runner sessions, builder unlocks, and virtual pet treats
- use `COIN_SYSTEM_DEVELOPMENT_PLAN.md` as the extended implementation plan for this feature

Concept:

- coins appear along readable jump routes, safe guide paths, and optional challenge arcs
- collecting coins gives immediate sparkle, sound, and HUD feedback
- coins are separate from biome quest collectibles, which remain objective-specific
- missed coins do not punish the player or block biome completion

Core uses:

- reward movement and route reading during exploration
- support replayability in the future Unicorn Runner mode
- fund gentle unlocks such as cosmetics, room items, hub decorations, and pet treats
- create small visible rewards after landmarks, villages, or completed care moments

Integration targets:

- `Game.js` can spawn and collect coins along platform paths
- the HUD and completion summaries can show run coins and total coins
- `App.js` can own wallet persistence and payout merging
- companion effects can later highlight, attract, or protect coin streaks
- pet mode and builder mode can use coins for low-stakes optional unlocks

Exit criteria:

- one exploration prototype supports visible coins, pickup collision, HUD count, and end-of-run payout
- coin totals persist safely without duplicate awards
- coin placement improves path readability rather than cluttering the jump route
- coins remain optional and never replace world, quest, builder, pet, or runner progression

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
