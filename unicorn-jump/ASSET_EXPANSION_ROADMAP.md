# Asset Expansion Roadmap

## Purpose

This is the bridge between inventory and production.

Use it to answer:

- which net-new assets still need to be made
- where they should live in the repo
- when they should enter runtime
- what it takes to move each package from `Good` to `Better` to `Best`

## Advancement Rule

All active asset families must keep moving through the quality matrix.

This includes:

- sprites
- characters
- houses
- furniture
- power-ups
- world props
- map art
- hub art

Production rule:

- every sprint should advance at least one active package toward its next tier
- no active package should remain indefinitely at the same quality tier once it has entered runtime

Use `ASSET_FAMILY_REGISTER.md` when this roadmap's grouped packages are too coarse and you need the explicit by-name list.

## Current Production Truth

The gameplay character layer is mostly covered.

The world-building layer is not.

That means the next wave is not primarily more creature poses. It is:

- faithful SVG unicorn gameplay set
- world map asset package
- hub world asset package
- landmark / gate / prop packages for every biome
- real background stacks for every biome
- deeper obstruction families
- deeper builder house / room / furniture packages

## Net-New Asset Backlog

### Shared Packages

| Package | New files | Target tier | Why it matters first |
| --- | --- | --- | --- |
| Faithful SVG unicorn gameplay set | `11` | `Best` | the player is the permanent hero asset |
| Splash world map package | `8` | `Best` | first impression and world navigation |
| Lantern Garden hub package | `10` | `Best` | future home base for world-building layer |
| Biome platform trim kit | `15` | `Better` | makes each region feel distinct without rewriting gameplay |
| Biome ground kit | `10` | `Better` | landing scenes need real identity |
| Obstruction expansion set | `10` | `Better` | current one-per-biome set is too shallow |
| Builder house package | `9+` | `Better` to `Best` | the builder needs destination-grade exteriors, not utility shells |
| Builder room shell package | `9+` | `Better` to `Best` | themed rooms must become full fantasy destinations |
| Builder furniture package | `28+` | `Better` to `Best` | decor objects need the same toy-premium quality climb as gameplay pickups |

### Per-Biome World Packages

Each biome should get a real environment package, not just a creature set.

Minimum package per biome:

- `5` background layers
- `1` village prop
- `1` landmark asset
- `1` gate / portal asset
- `1` world map thumbnail
- `2` extra obstruction variants

That is `11` net-new files per biome before ambient extras.

Across `5` biomes that is `55` world-layer assets.

## Exact Package List

## 1. Player Unicorn Package

Folder:

- `public/assets/images/character/unicorn/`

Files:

- `idle-front.svg`
- `idle-left.svg`
- `idle-right.svg`
- `run-left.svg`
- `run-right.svg`
- `jump-left.svg`
- `jump-right.svg`
- `fall-left.svg`
- `fall-right.svg`
- `land-front.svg`
- `celebrate-front.svg`

Path to `Best`:

- `Good`: faithful silhouette and readable horn / wing shapes
- `Better`: richer mane layering, cleaner anatomy, stronger face and feather read
- `Best`: matches the charm of the original PNG while becoming the premium master for all future player art

## 2. Splash World Map Package

Folder:

- `public/assets/images/world-map/`

Files:

- `world-map-base.png`
- `lantern-garden-hub.svg`
- `lantern-bamboo-valley-node.svg`
- `highland-meadow-node.svg`
- `storybook-forest-node.svg`
- `sun-orchard-node.svg`
- `bluebonnet-prairie-node.svg`
- `world-map-routes.svg`

Path to `Best`:

- `Good`: readable nodes and clear geography
- `Better`: stronger landmark silhouettes and prettier route logic
- `Best`: storybook map art that feels worth staring at before pressing play

## 3. Lantern Garden Hub Package

Folder:

- `public/assets/images/hub/lantern-garden/`

Files:

- `sky.png`
- `distant-garden.png`
- `village-mid.png`
- `foreground-plants.png`
- `home-treehouse.svg`
- `upgrade-tree.svg`
- `portal-lantern-gate.svg`
- `frog-plaza.svg`
- `wood-bridge.svg`
- `garden-map-thumb.png`

Path to `Best`:

- `Good`: clearly readable safe home area
- `Better`: village charm, clear unlock points, stronger landmark logic
- `Best`: emotional return-home screen that anchors the whole game

## 4. Lantern Bamboo Valley Package

Folder:

- `public/assets/images/world/lantern-bamboo-valley/`

Files:

- `background/sky.png`
- `background/distant-mountains.png`
- `background/bamboo-forest.png`
- `background/lantern-village.png`
- `background/foreground-plants.png`
- `props/tea-table.svg`
- `landmark/lantern-stand.svg`
- `gate/sky-lantern-gate.svg`
- `map/thumbnail.png`
- `obstacle/lantern-fox-swoop.svg`
- `obstacle/lantern-fox-dive.svg`

Path to `Best`:

- `Good`: recognizable bamboo region with matching prop set
- `Better`: stronger lantern warmth, better silhouette layering, fuller world identity
- `Best`: benchmark biome that the rest of the game copies

## 5. Highland Meadow Package

Folder:

- `public/assets/images/world/highland-meadow/`

Files:

- `background/sky.png`
- `background/distant-hills.png`
- `background/meadow-mist.png`
- `background/stone-village.png`
- `background/foreground-grass.png`
- `props/wool-cart.svg`
- `landmark/stone-circle.svg`
- `gate/breeze-arch.svg`
- `map/thumbnail.png`
- `obstacle/meadow-sheep-dash.svg`
- `obstacle/meadow-sheep-leap.svg`

Path to `Best`:

- `Good`: soft hill identity and readable stone-circle world logic
- `Better`: stronger mist layers, cozier props, more memorable sheep energy
- `Best`: dreamy meadow postcard quality

## 6. Storybook Forest Package

Folder:

- `public/assets/images/world/storybook-forest/`

Files:

- `background/sky.png`
- `background/distant-trees.png`
- `background/story-canopy.png`
- `background/book-village.png`
- `background/foreground-mushrooms.png`
- `props/mushroom-house.svg`
- `landmark/story-tree.svg`
- `gate/page-arch.svg`
- `map/thumbnail.png`
- `obstacle/story-gnome-spin.svg`
- `obstacle/story-gnome-charge.svg`

Path to `Best`:

- `Good`: readable storybook silhouettes and clear fantasy identity
- `Better`: stronger page/book motifs and richer forest layering
- `Best`: enchanted picture-book destination

## 7. Sun Orchard Package

Folder:

- `public/assets/images/world/sun-orchard/`

Files:

- `background/sky.png`
- `background/distant-hills.png`
- `background/orchard-grove.png`
- `background/golden-village.png`
- `background/foreground-blossoms.png`
- `props/mirror-stand.svg`
- `landmark/citrus-arbor.svg`
- `gate/golden-arbor.svg`
- `map/thumbnail.png`
- `obstacle/orchard-bird-dive.svg`
- `obstacle/orchard-bird-flare.svg`

Path to `Best`:

- `Good`: clear fruit-and-light identity
- `Better`: better sunlight, sparkle logic, and bird motion silhouettes
- `Best`: glowing golden destination with premium warmth

## 8. Bluebonnet Prairie Package

Folder:

- `public/assets/images/world/bluebonnet-prairie/`

Files:

- `background/sky.png`
- `background/distant-plains.png`
- `background/flower-field.png`
- `background/prairie-village.png`
- `background/foreground-bluebonnets.png`
- `props/windmill-post.svg`
- `landmark/bluebonnet-patch.svg`
- `gate/windmill-gate.svg`
- `map/thumbnail.png`
- `obstacle/prairie-armadillo-burst.svg`
- `obstacle/prairie-armadillo-roll-fast.svg`

Path to `Best`:

- `Good`: recognizable prairie and flower identity
- `Better`: stronger wind language and better prop storytelling
- `Best`: breezy, wide-open region with memorable floral charm

## 9. Biome Platform Trim Kit

Folder:

- `public/assets/images/platform-biome/`

Files:

- `lantern-bamboo-top.png`
- `lantern-bamboo-under.png`
- `lantern-bamboo-detail.svg`
- `highland-meadow-top.png`
- `highland-meadow-under.png`
- `highland-meadow-detail.svg`
- `storybook-forest-top.png`
- `storybook-forest-under.png`
- `storybook-forest-detail.svg`
- `sun-orchard-top.png`
- `sun-orchard-under.png`
- `sun-orchard-detail.svg`
- `bluebonnet-prairie-top.png`
- `bluebonnet-prairie-under.png`
- `bluebonnet-prairie-detail.svg`

Path to `Best`:

- `Good`: platforms no longer feel generic across biomes
- `Better`: edges, undersides, and trims reinforce biome identity
- `Best`: platform kit feels authored as part of each scene rather than pasted on top

## 10. Biome Ground Kit

Folder:

- `public/assets/images/ground-biome/`

Files:

- `lantern-bamboo-ground.png`
- `lantern-bamboo-under.png`
- `highland-meadow-ground.png`
- `highland-meadow-under.png`
- `storybook-forest-ground.png`
- `storybook-forest-under.png`
- `sun-orchard-ground.png`
- `sun-orchard-under.png`
- `bluebonnet-prairie-ground.png`
- `bluebonnet-prairie-under.png`

Path to `Best`:

- `Good`: no flat gradient landing slabs
- `Better`: landing areas feel like a real extension of the biome
- `Best`: landing floors can support hero screenshots

## Integration Roadmap

## Phase A: Shared Hero Assets

Goal:

- fix the permanent front-facing quality gap before adding more regional volume

Bring in:

- faithful SVG unicorn gameplay set
- splash world map package

Definition of done:

- player and map both read above the current biome art
- map nodes use real assets instead of mostly inline composition

## Phase B: Benchmark World Slice

Goal:

- make Lantern Bamboo Valley the first `Best` biome package

Bring in:

- full Lantern Bamboo Valley package
- first biome platform trim set
- first biome ground set

Definition of done:

- the region feels like a place, not a layered prototype
- landmark, prop, gate, pickup, creature, and obstruction all belong to the same world

## Phase C: Shared `Better` Floor Across All Biomes

Goal:

- bring every biome to a stable `Better` baseline before chasing `Best` everywhere

Bring in:

- Highland Meadow package
- Storybook Forest package
- Sun Orchard package
- Bluebonnet Prairie package
- full biome platform trim kit
- full biome ground kit

Definition of done:

- every biome has real background layers
- every biome has a prop, a landmark, a gate, and `3` obstruction variants total
- no landing scene depends on abstract config-only set dressing

## Phase D: Hub World Bring-Up

Goal:

- add the missing home base that ties the larger world-building layer together

Bring in:

- Lantern Garden hub package

Definition of done:

- the game has a true return-home visual anchor
- future unlocks and village systems have a dedicated art home

## Phase E: Move To `Best`

Goal:

- elevate the strongest packages from `Better` to `Best` in a controlled order

Order:

1. player unicorn package
2. splash world map package
3. Lantern Bamboo Valley package
4. Lantern Garden hub package
5. Highland Meadow package
6. Storybook Forest package
7. Sun Orchard package
8. Bluebonnet Prairie package
9. active builder houses, room shells, and furniture packs

Definition of done:

- benchmark packages survive side-by-side comparison with the original unicorn art
- props, landmarks, gates, backgrounds, and characters feel like one authored game
- weak prototype-looking layers are gone from the player path and title flow

## Runtime Bring-In Rules

- add folders before wiring code
- wire one package at a time with fallbacks preserved until verification passes
- do not mark a package `Best` until it is live in the runtime, not just pretty in isolation
- verify each phase in the actual menu and biome scenes, not only by opening asset files

## Immediate Next Asset Sprint

If the goal is the fastest meaningful improvement, the next production sprint should be:

1. faithful SVG unicorn gameplay package
2. Lantern Bamboo Valley landmark / prop / gate package
3. Lantern Bamboo Valley background stack
4. world map node asset package
5. two more Lantern Bamboo obstruction variants

Builder rule:

- in parallel, keep the active builder families climbing too
- every time a new destination room enters runtime, advance its house, room shell, and furniture pack at least one step deeper in the matrix

That is the smallest set that materially moves the project toward `Best` instead of just adding more volume.
