# Asset Inventory

## Purpose

This is the literal inventory.

Use this file when you need:

- the actual asset families that exist on disk right now
- the exact file patterns those families use
- the builder themes and furniture that exist only in runtime data
- a concrete list of the major packages that are still missing

This is not the quality matrix and it is not the phased roadmap.

## Snapshot

- on-disk image assets in `public/assets/images/`: `169` files, excluding `.DS_Store`
- gameplay unicorn art on disk: `7` files
- biome creature SVGs on disk: `45`
- biome companion SVGs on disk: `45`
- biome collectible SVGs on disk: `15`
- world prop / landmark SVGs on disk: `10`
- world gate SVGs on disk: `5`
- biome platform trim SVGs on disk: `5`
- biome ground cap SVGs on disk: `5`
- runtime-defined builder house themes: `9`
- runtime-defined builder room shell themes: `9`
- runtime-defined builder furniture definitions: `28`

## On-Disk Inventory

### Background

- Generic background paintings `6`
  - `public/assets/images/background/background-1.png`
  - `public/assets/images/background/background-2.png`
  - `public/assets/images/background/background-3.png`
  - `public/assets/images/background/background-4.png`
  - `public/assets/images/background/background-5.png`
  - `public/assets/images/background/background-6.png`

### Character

- Original gameplay unicorn PNG set `5`
  - `public/assets/images/character/unicorn_idle.png`
  - `public/assets/images/character/unicorn_jump.png`
  - `public/assets/images/character/unicorn_fall.png`
  - `public/assets/images/character/unicorn-side_l.png`
  - `public/assets/images/character/unicorn_side_r.png`
- Menu / reference unicorn SVG set `2`
  - `public/assets/images/character/unicorn_little.svg`
  - `public/assets/images/character/unicorn_little_alt.svg`

### Creature

- `Lantern Fox` quest-giver family `9`
  - `public/assets/images/creature/lantern-fox/{idle,talk,happy}-{front,left,right}.svg`
- `Meadow Sheep` quest-giver family `9`
  - `public/assets/images/creature/meadow-sheep/{idle,talk,happy}-{front,left,right}.svg`
- `Story Gnome` quest-giver family `9`
  - `public/assets/images/creature/story-gnome/{idle,talk,happy}-{front,left,right}.svg`
- `Orchard Bird` quest-giver family `9`
  - `public/assets/images/creature/orchard-bird/{idle,talk,happy}-{front,left,right}.svg`
- `Prairie Armadillo` quest-giver family `9`
  - `public/assets/images/creature/prairie-armadillo/{idle,talk,happy}-{front,left,right}.svg`

### Companion

- `Glow Fox` companion family `9`
  - `public/assets/images/companion/glow-fox/{hover,blink,boost}-{front,left,right}.svg`
- `Wind Sheep` companion family `9`
  - `public/assets/images/companion/wind-sheep/{hover,blink,boost}-{front,left,right}.svg`
- `Butterfly Spirit` companion family `9`
  - `public/assets/images/companion/butterfly-spirit/{hover,blink,boost}-{front,left,right}.svg`
- `Songbird` companion family `9`
  - `public/assets/images/companion/songbird/{hover,blink,boost}-{front,left,right}.svg`
- `Firefly Friend` companion family `9`
  - `public/assets/images/companion/firefly-friend/{hover,blink,boost}-{front,left,right}.svg`

### Collectible

- `Lantern Seed` pickup family `3`
  - `public/assets/images/collectible/lantern-seed-idle.svg`
  - `public/assets/images/collectible/lantern-seed-glow.svg`
  - `public/assets/images/collectible/lantern-seed-collected.svg`
- `Meadow Song` pickup family `3`
  - `public/assets/images/collectible/meadow-song-idle.svg`
  - `public/assets/images/collectible/meadow-song-glow.svg`
  - `public/assets/images/collectible/meadow-song-collected.svg`
- `Story Star` pickup family `3`
  - `public/assets/images/collectible/story-star-idle.svg`
  - `public/assets/images/collectible/story-star-glow.svg`
  - `public/assets/images/collectible/story-star-collected.svg`
- `Sun Drop` pickup family `3`
  - `public/assets/images/collectible/sun-drop-idle.svg`
  - `public/assets/images/collectible/sun-drop-glow.svg`
  - `public/assets/images/collectible/sun-drop-collected.svg`
- `Firefly` pickup family `3`
  - `public/assets/images/collectible/firefly-idle.svg`
  - `public/assets/images/collectible/firefly-glow.svg`
  - `public/assets/images/collectible/firefly-collected.svg`

### Effects

- `Rescue Leaf` effect family `3`
  - `public/assets/images/effects/rescue-leaf-fresh.svg`
  - `public/assets/images/effects/rescue-leaf-catch.svg`
  - `public/assets/images/effects/rescue-leaf-used.svg`

### Obstacle

- Biome obstruction SVG set `5`
  - `public/assets/images/obstacle/lantern-fox-ember.svg`
  - `public/assets/images/obstacle/meadow-sheep-cloud.svg`
  - `public/assets/images/obstacle/story-gnome-whirl.svg`
  - `public/assets/images/obstacle/orchard-bird-burst.svg`
  - `public/assets/images/obstacle/prairie-armadillo-roll.svg`
- Legacy generic obstacle PNG set `7`
  - `public/assets/images/obstacle/obstacle-1.png`
  - `public/assets/images/obstacle/obstacle-2.png`
  - `public/assets/images/obstacle/obstacle-3.png`
  - `public/assets/images/obstacle/obstacle-4.png`
  - `public/assets/images/obstacle/obstacle-5.png`
  - `public/assets/images/obstacle/obstacle-6.png`
  - `public/assets/images/obstacle/obstacle-7.png`

### Platform

- Shared floating-platform base kit `7`
  - `public/assets/images/platform/earth-1.png`
  - `public/assets/images/platform/earth-2.png`
  - `public/assets/images/platform/earth-3.png`
  - `public/assets/images/platform/earth-4.png`
  - `public/assets/images/platform/earth-5.png`
  - `public/assets/images/platform/earth-6.png`
  - `public/assets/images/platform/earth-7.png`
- Biome platform trim overlay set `5`
  - `public/assets/images/world/lantern-bamboo-valley/platform/trim.svg`
  - `public/assets/images/world/highland-meadow/platform/trim.svg`
  - `public/assets/images/world/storybook-forest/platform/trim.svg`
  - `public/assets/images/world/sun-orchard/platform/trim.svg`
  - `public/assets/images/world/bluebonnet-prairie/platform/trim.svg`

### Ground

- Shared landing-ground base kit `2`
  - `public/assets/images/ground/earth-repeat-x-1.png`
  - `public/assets/images/ground/earth-repeat-x-2.png`
- Biome landing-ground cap overlay set `5`
  - `public/assets/images/world/lantern-bamboo-valley/ground/cap.svg`
  - `public/assets/images/world/highland-meadow/ground/cap.svg`
  - `public/assets/images/world/storybook-forest/ground/cap.svg`
  - `public/assets/images/world/sun-orchard/ground/cap.svg`
  - `public/assets/images/world/bluebonnet-prairie/ground/cap.svg`

### Power-Up

- Legacy generic power-up set `2`
  - `public/assets/images/power-up/power-up-1.png`
  - `public/assets/images/power-up/power-up-2.png`

### World

- `Lantern Bamboo Valley` world prop / landmark / gate files `3`
  - `public/assets/images/world/lantern-bamboo-valley/props/tea-table.svg`
  - `public/assets/images/world/lantern-bamboo-valley/landmark/lantern-stand.svg`
  - `public/assets/images/world/lantern-bamboo-valley/gate/sky-lantern-gate.svg`
- `Highland Meadow` world prop / landmark / gate files `3`
  - `public/assets/images/world/highland-meadow/props/wool-cart.svg`
  - `public/assets/images/world/highland-meadow/landmark/stone-circle.svg`
  - `public/assets/images/world/highland-meadow/gate/breeze-arch.svg`
- `Storybook Forest` world prop / landmark / gate files `3`
  - `public/assets/images/world/storybook-forest/props/mushroom-house.svg`
  - `public/assets/images/world/storybook-forest/landmark/story-tree.svg`
  - `public/assets/images/world/storybook-forest/gate/page-arch.svg`
- `Sun Orchard` world prop / landmark / gate files `3`
  - `public/assets/images/world/sun-orchard/props/mirror-stand.svg`
  - `public/assets/images/world/sun-orchard/landmark/citrus-arbor.svg`
  - `public/assets/images/world/sun-orchard/gate/golden-arbor.svg`
- `Bluebonnet Prairie` world prop / landmark / gate files `3`
  - `public/assets/images/world/bluebonnet-prairie/props/windmill-post.svg`
  - `public/assets/images/world/bluebonnet-prairie/landmark/bluebonnet-patch.svg`
  - `public/assets/images/world/bluebonnet-prairie/gate/windmill-gate.svg`

## Runtime-Defined Builder Inventory

These families currently exist in code, not as discrete art files.

Source:

- `src/builderState.js`

### Builder House Themes

- `Korean Garden Court`
- `Fantasy Bavarian Castle`
- `Spanish Palace Suite`
- `MesoAmerican Pyramid`
- `GrecoRoman Circus`
- `Scandinavian Longhouse`
- `Japanese Fortress`
- `Babylonian Hanging Gardens`
- `Future Sky Dome`

### Builder Room Shell Themes

- `Moon Gate Garden`
- `Story Tower Hall`
- `Sun Court Salon`
- `Sun Step Chamber`
- `Arena of Garlands`
- `Northern Hearth Hall`
- `Castle Blossom Room`
- `Terrace of Vines`
- `Nova Dome Lounge`

### Builder Furniture Definitions

- `jade-lantern` / `Jade Lantern`
- `tea-floor-table` / `Tea Floor Table`
- `persimmon-fruit-plate` / `Persimmon Fruit Plate`
- `velvet-recliner` / `Velvet Recliner`
- `banner-torch` / `Banner Torch`
- `carved-chest` / `Carved Chest`
- `citrus-fruit-plate` / `Citrus Fruit Plate`
- `sun-recliner` / `Sun Recliner`
- `tile-bench` / `Tile Bench`
- `sun-torch` / `Sun Torch`
- `gem-pedestal` / `Gem Pedestal`
- `stone-stool` / `Stone Stool`
- `marble-chaise` / `Marble Chaise`
- `laurel-table` / `Laurel Table`
- `grape-fruit-plate` / `Grape Fruit Plate`
- `wooden-stool` / `Wooden Stool`
- `hearth-torch` / `Hearth Torch`
- `timber-bench` / `Timber Bench`
- `paper-lantern` / `Paper Lantern`
- `lacquer-stool` / `Lacquer Stool`
- `blossom-screen` / `Blossom Screen`
- `garden-recliner` / `Garden Recliner`
- `royal-fruit-plate` / `Royal Fruit Plate`
- `hanging-vine-planter` / `Hanging Vine Planter`
- `nova-gem-cluster` / `Nova Gem Cluster`
- `halo-torch` / `Halo Torch`
- `orbit-recliner` / `Orbit Recliner`
- `starlight-console` / `Starlight Console`

## Missing Inventory

These are the biggest packages that still do not exist as discrete assets on disk:

- faithful SVG gameplay unicorn state sheet under `public/assets/images/character/unicorn/`
- per-biome world map thumbnails under `public/assets/images/world/<biome>/map/`
- per-biome background stacks under `public/assets/images/world/<biome>/background/`
- extra biome obstruction variants beyond the current single SVG per biome
- Lantern Garden hub package under `public/assets/images/hub/lantern-garden/`
- splash world map package under `public/assets/images/world-map/`
- discrete builder house art packages
- discrete builder room-shell art packages
- discrete builder furniture art packages

## How To Use This With The Other Docs

- `ASSET_FAMILY_REGISTER.md` is the named quality-governance list
- `SPRITE_PRODUCTION_INVENTORY.md` is the readiness + wiring view
- `SPRITE_REFINEMENT_MATRIX.md` defines `Good`, `Better`, and `Best`
- `ASSET_EXPANSION_ROADMAP.md` decides import order
- this file is the literal inventory reference
