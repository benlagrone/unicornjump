# Art Roadmap

## Goal

Replace the current mixed-quality art state with a coherent, production-ready visual set.

Current problem:

- the player unicorn has usable sprite art
- many biome creatures, companions, collectibles, and effects are still procedural placeholders
- environment direction exists, but the world does not yet have one completed visual system

This roadmap sequences the work so the team locks style first and volume second.

Supporting world-structure docs:

- `WORLD_DESIGN_GUIDE.md`
- `WORLD_ROADMAP.md`
- `ASSET_EXPANSION_ROADMAP.md`
- `ASSET_FAMILY_REGISTER.md`
- `SPRITE_PRODUCTION_INVENTORY.md`
- `SPRITE_REFINEMENT_MATRIX.md`

## Success Criteria

By the end of this roadmap:

- every gameplay-critical placeholder has a real asset
- all character sets come from approved master models
- the frog/Lantern Bamboo Valley direction is production-ready
- future biomes can reuse the same pipeline instead of restarting art direction every time
- the art feels intentionally authored rather than acceptably generated
- at least one full biome slice meets a "child delight" quality bar before the rest of the world scales out

Non-goal:

- shipping a large number of mediocre assets quickly

Rule:

- do not multiply art volume until one benchmark slice is genuinely good
- do not assume every asset family needs the same finish level; use `SPRITE_REFINEMENT_MATRIX.md` to assign `Good`, `Better`, or `Best` intentionally
- once an asset family is active in runtime, keep it moving toward the next tier instead of letting it settle permanently at an early pass

## Phase 0: Alignment

Objective:

- lock the art rules before generating asset volume

Deliverables:

- `ART_DESIGN_GUIDE.md`
- `MASTER_MODEL_PIPELINE.md`
- approved folder and naming conventions from `SPRITES.md`
- phased package rollout from `ASSET_EXPANSION_ROADMAP.md`
- live asset status from `SPRITE_PRODUCTION_INVENTORY.md`
- quality-tier planning from `SPRITE_REFINEMENT_MATRIX.md`

Exit criteria:

- team agrees on SVG-first gameplay delivery
- team agrees on master-first workflow
- team agrees on current target sizes and action sets
- team agrees which asset families must hit `Good`, `Better`, and `Best` before world expansion scales further

## Phase 0.5: Quality Reset

Objective:

- reset the project away from "prototype-quality AI art everywhere"
- define what final-quality art actually has to achieve for this game

Deliverables:

- updated `ART_DESIGN_GUIDE.md` quality bar
- explicit rejection criteria for weak characters and generic backgrounds
- one approved benchmark target list for the first final-quality slice

Exit criteria:

- team agrees that current AI-first assets are placeholders, not final deliverables
- team agrees that benchmark quality matters more than asset count
- team agrees that one biome must become genuinely magical before the rest are expanded

## Phase 1: Master Models

Objective:

- establish canonical creature families before generating variants

Priority masters:

- unicorn
- frog spirit
- fox spirit
- panda gardener
- sheep spirit
- songbird
- armadillo
- butterfly spirit
- story gnome

Deliverables per family:

- canonical master sheet on a plain background
- `front-neutral` master
- `side-neutral` master
- extracted silhouette
- locked palette
- silhouette approval

Exit criteria:

- each family reads clearly at gameplay size
- family members feel related
- no major design questions remain before variant generation
- the approved master sheet is strong enough that later states can be derived from it instead of re-prompted from scratch
- the approved master is strong enough to be loved by a child, not merely accepted by the team

## Phase 2: Player Upgrade Pass

Objective:

- bring the player unicorn up to the same standard as the planned cast

Deliverables:

- unicorn state matrix from `SPRITES.md`
- front, left, right readable forms
- jump, fall, land, and celebrate states

Exit criteria:

- player remains the clearest focal point on screen
- movement states are legible in motion
- new unicorn files align with the approved master
- the unicorn feels premium compared with the rest of the cast, not merely functional

## Phase 3: Quest-Giver Creatures

Objective:

- replace blob-like biome NPCs with expressive character sets

Priority order:

1. Lantern Fox
2. Highland Sheep
3. Story Gnome
4. Orchard Bird
5. Prairie Armadillo

Deliverables:

- `idle`, `talk`, `happy`
- `front`, `left`, `right`
- 45 total NPC variant files

Exit criteria:

- each biome NPC has a readable personality
- dialog moments look intentional
- the cast no longer feels like placeholders next to the unicorn

## Phase 4: Companion Followers

Objective:

- replace floating badge bubbles with real companion art

Deliverables:

- glow fox
- wind sheep
- butterfly spirit
- songbird
- firefly friend

Required states:

- `hover`
- `blink`
- `boost`
- `front`, `left`, `right`

Exit criteria:

- companions are readable at small size
- companion identity is obvious without relying on initials
- companions visually relate to their source biome or species family

## Phase 5: Collectibles And Effects

Objective:

- finish the gameplay object layer so pickups and rescue moments feel intentional

Deliverables:

- lantern seed
- meadow song
- story star
- sun drop
- firefly
- rescue leaf

Required states:

- collectibles: `idle`, `glow`, `collected`
- rescue leaf: `fresh`, `catch`, `used`

Exit criteria:

- pickups stand out from backgrounds
- glow states improve readability
- rescue moments are visually clear

## Phase 6: Lantern Bamboo Valley Environment Pass

Objective:

- complete one full biome environment to serve as the benchmark for later biome passes

Deliverables:

- distant mountain background layer
- bamboo forest mid layer
- lantern village scene layer
- platform-compatible foreground set
- object assets such as lanterns, bamboo platform details, bridge pieces, and tea-table props
- final-quality splash/map thumbnail art for the region
- one hero scene composition that can act as the visual reference for all follow-on biome work

Exit criteria:

- Lantern Bamboo Valley feels like a complete destination
- parallax layers read cleanly
- player path remains readable
- environment art matches the frog and lantern handoff
- the biome feels magical enough to set the standard for the whole game
- the biome is good enough that the rest of the world can copy its quality bar instead of merely its file structure

## Phase 6.5: Benchmark Review

Objective:

- decide whether the first full biome is truly final-quality

Review questions:

- would a child want to stay on the title screen and look at the world?
- do the creatures feel lovable and memorable?
- does the biome feel like a place, not just a set of art layers?
- does any major asset still feel obviously AI-made?
- would scaling this level of quality across the game be good enough to ship?

Exit criteria:

- if the answer is "no" to any of the above, stop and improve the benchmark slice before expanding to more biomes

## Phase 7: Remaining Biome Environment Passes

Objective:

- extend the proven visual system across all biomes

Biome order:

1. Highland Meadow
2. Storybook Forest
3. Sun Orchard
4. Bluebonnet Prairie

Deliverables per biome:

- palette pass
- prop kit
- decoration kit
- parallax layer refresh where needed

Exit criteria:

- each biome is distinct
- the world still feels unified
- props do not regress gameplay readability
- each new biome matches the benchmark slice in charm and finish, not just in technical completeness

## Phase 8: Integration And Cleanup

Objective:

- make the assets usable in the runtime and remove obvious placeholder rendering

Integration targets:

- `Character.js`
- `Game.js`
- any new asset lookup helpers if needed

Tasks:

- wire final file paths
- remove blob fallback art where replaced
- verify scale alignment
- verify transparent asset rendering

Exit criteria:

- gameplay scenes are no longer mixing final and placeholder art
- asset naming is consistent
- no missing file references

## Optional Tooling Track

Objective:

- reduce repeated manual prompting by building a constrained generator on top of approved master families

Scope:

- species selector
- color selector
- accessory selector
- personality selector
- automatic variant export using the master-model rules

Exit criteria:

- the tool can generate consistent family members without drifting off-model
- outputs still respect the naming and format rules in `SPRITES.md`

## Production Order Summary

1. approve art rules
2. approve master models
3. ship unicorn upgrade
4. ship quest-giver NPCs
5. ship companions
6. ship collectibles and rescue effect
7. finish Lantern Bamboo Valley
8. extend to the remaining biomes
9. integrate and remove placeholder rendering
10. optionally build the creature generator

## Recommended Milestone Slices

### Milestone A

- guides approved
- frog master approved
- unicorn master approved

### Milestone B

- unicorn matrix shipped
- Lantern Fox shipped
- pink frog companion shipped

### Milestone C

- all quest-givers shipped
- all companions shipped

### Milestone D

- collectibles shipped
- rescue leaf shipped
- Lantern Bamboo Valley shipped

### Milestone E

- remaining biomes polished
- runtime fully integrated

## Risks

- generating variants before master approval will create drift
- too much environment detail can hurt gameplay readability
- companions may become unreadable at target size if over-detailed
- mixing vector gameplay sprites with overly painted scene art can feel disconnected
- trademark-adjacent frog references must stay in adaptation territory, not replication

## Fastest Path To Visible Improvement

If the goal is quick impact rather than full completion, do this first:

1. frog master model
2. unicorn upgrade
3. Lantern Fox quest-giver set
4. pink frog companion set
5. Lantern Bamboo Valley benchmark background

That sequence will make the game feel materially more finished before the full 119-frame target is complete.
