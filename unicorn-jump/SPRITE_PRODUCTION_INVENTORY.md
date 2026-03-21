# Sprite Production Inventory

## Purpose

This is the live inventory.

It is not the abstract quality taxonomy from `SPRITE_REFINEMENT_MATRIX.md`.
It is not the phased import plan from `ASSET_EXPANSION_ROADMAP.md` either.
It is not the explicit all-families register from `ASSET_FAMILY_REGISTER.md` either.

Use this file to answer:

- what assets actually exist on disk right now
- what is wired into the runtime right now
- what is still missing
- what refinement tier each item is currently at and needs next

Use `ASSET_INVENTORY.md` when you need the literal file-by-file and runtime-definition inventory instead of the readiness view.

## Current Asset Count Snapshot

Based on `public/assets/images/` today:

- player unicorn gameplay sprites: `5` PNG files
- menu unicorn SVG variants: `2`
- biome quest-giver creature SVGs: `45` files total (`5` families x `9`)
- biome companion SVGs: `45` files total (`5` families x `9`)
- biome collectible SVGs: `15` files total (`5` families x `3`)
- rescue effect SVGs: `3`
- biome obstruction SVGs: `5`
- generic obstacle PNGs: `7`
- background PNGs: `6`
- platform PNGs: `7`
- ground PNGs: `2`
- world prop / landmark SVGs: `10`
- world gate SVGs: `5`
- biome platform trim SVGs: `5`
- biome ground cap SVGs: `5`
- builder house themes defined in runtime: `9`
- builder room shell themes defined in runtime: `9`
- builder furniture definitions defined in runtime: `28`
- dedicated hub asset files on disk: `0`
- dedicated splash world map asset files on disk: `0`

## Runtime Truth

- Gameplay player still uses the original PNG unicorn set in `src/Character.js`.
- The landing-screen map pointer uses `public/assets/images/character/unicorn_little.svg` in `src/App.js`.
- `src/spriteCatalog.js` currently wires all five biome creature families, all five companion families, all five collectible families, the rescue leaf, and one obstruction family per biome.
- The builder now has runtime-defined themed houses, themed room shells, and theme-filtered furniture trays, but those families still need to move through the same `Good` / `Better` / `Best` quality gates as the core gameplay art.
- World-building props, landmarks, gates, platform trims, and landing-ground caps now exist as discrete biome files on disk, but hub art, splash-map node art, and per-biome background stacks are still mostly missing.

## Global Inventory Matrix

| Item | Files on disk | Wired now | Current tier | Target tier | Next refinement pass |
| --- | --- | --- | --- | --- | --- |
| Gameplay unicorn | `5` PNG states in `character/` | Yes, live player runtime | `Better` reference art, but not SVG-ready | `Best` | build a faithful SVG state sheet from the original unicorn proportions |
| Menu unicorn pointer | `unicorn_little.svg`, `unicorn_little_alt.svg` | Yes, live world map pointer uses `unicorn_little.svg` | `Better` | `Best` | keep refining horn, wing mass, and faithfulness to the original sprite |
| Quest-giver creatures | `45` SVGs total | Yes | `Good` to `Better` depending on biome | `Better` minimum, `Best` for benchmark biomes | push anatomy, facial acting, and biome-specific detail |
| Companions | `45` SVGs total | Yes | `Good` | `Better` | improve tiny-size read, glow logic, and species likeness |
| Collectibles / pickups | `15` SVGs total | Yes | `Good` | `Better` | push the heart/gem language harder and unify naming with in-game copy |
| Rescue leaf | `3` SVGs | Yes | `Good` | `Better` | make rescue states more magical and less utilitarian |
| Obstructions | `5` SVGs total, `1` per biome | Yes | `Good` | `Better` | add `2-3` variants per biome with stronger action silhouette |
| Builder houses | `9` runtime-defined themes | Yes | `Good` to `Better` | `Better` to `Best` | keep pushing exterior identity, thumbnails, and architecture read |
| Builder room shells | `9` runtime-defined themes | Yes | `Good` to `Better` | `Better` to `Best` | increase scene depth, room scale, and destination atmosphere |
| Builder furniture packs | `28` runtime definitions | Yes | `Good` | `Better` to `Best` | deepen each theme pack and push toy-like premium object design |
| Generic obstacles | `7` PNGs | Fallback / legacy | legacy | replace over time | retire once biome-specific obstruction families are deep enough |
| Background paintings | `6` PNGs | Yes | mixed legacy quality | `Best` for benchmark biome, `Better` elsewhere | convert to real biome stacks with landmark integration |
| Platform kit | `7` PNGs | Yes | `Better` base kit | `Better` to `Best` | create biome-specific trim and underside detail |
| Ground kit | `2` PNGs | Yes | `Good` to `Better` | `Better` | give each biome its own landing-floor language |
| Generic power-ups | `2` PNGs | legacy / fallback | legacy | replace over time | supersede with cute hearts, gems, and biome-specific pickups |
| Biome props / landmarks | `10` SVGs total | Yes, landing scenes now load them | `Good` | `Better` to `Best` | deepen each biome package beyond one prop plus one landmark |
| Biome gates | `5` SVGs total | Yes, landing scenes now load them | `Good` | `Better` to `Best` | deepen each biome gate family with more silhouette detail and activation-state polish |
| Biome platform trims | `5` SVGs total | Yes, gameplay platforms now load them | `Good` | `Better` to `Best` | push stronger silhouette cues and more biome-specific surface language |
| Biome ground caps | `5` SVGs total | Yes, landing floors now load them | `Good` | `Better` to `Best` | deepen landing-floor identity and tie it closer to each biome landmark set |
| Hub world art | no dedicated files | No | missing | `Best` | define Lantern Garden asset kit |
| Splash world map art set | no dedicated files, mostly inline composition | Partially | `Good` composition, not a true asset set | `Best` | convert the map into a real reusable art package |

## Biome-By-Biome Inventory

| Biome | Quest giver | Companion | Pickup | Obstruction | Landing props / landmark / gate | Background / platform world layer | Current read |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Lantern Bamboo Valley | `Lantern Fox` `9/9` SVG, wired | `Glow Fox` `9/9` SVG, wired | `Lantern Seed` files `3/3`, wired, but game language now reads more like `lantern heart` | `lantern-fox-ember.svg` `1/1`, wired | `Tea Table`, `Lantern Stand`, and `Sky Lantern Gate` now exist as discrete SVGs | shared raster base now layered with Bamboo trim + ground-cap overlays | character layer present; surface identity is now biome-specific |
| Highland Meadow | `Highland Sheep` `9/9` SVG, wired | `Wind Sheep` `9/9` SVG, wired | `Meadow Song` `3/3`, wired | `meadow-sheep-cloud.svg` `1/1`, wired | `Wool Cart`, `Stone Circle`, and `Breeze Arch` now exist as discrete SVGs | shared raster base now layered with Meadow trim + ground-cap overlays | sprite coverage present; surface identity is now biome-specific |
| Storybook Forest | `Story Gnome` `9/9` SVG, wired | `Butterfly Spirit` `9/9` SVG, wired | `Story Star` `3/3`, wired | `story-gnome-whirl.svg` `1/1`, wired | `Mushroom House`, `Story Tree`, and `Page Arch` now exist as discrete SVGs | shared raster base now layered with Storybook trim + ground-cap overlays | complete gameplay sprite shell, fuller landing package |
| Sun Orchard | `Orchard Bird` `9/9` SVG, wired | `Songbird` `9/9` SVG, wired | `Sun Drop` `3/3`, wired | `orchard-bird-burst.svg` `1/1`, wired | `Mirror Stand`, `Citrus Arbor`, and `Golden Arbor` now exist as discrete SVGs | shared raster base now layered with Orchard trim + ground-cap overlays | full gameplay coverage, fuller landing package |
| Bluebonnet Prairie | `Prairie Armadillo` `9/9` SVG, wired | `Firefly Friend` `9/9` SVG, wired | `Firefly` `3/3`, wired | `prairie-armadillo-roll.svg` `1/1`, wired | `Windmill Post`, `Bluebonnet Patch`, and `Windmill Gate` now exist as discrete SVGs | shared raster base now layered with Prairie trim + ground-cap overlays | gameplay sprite set present, fuller landing package |

## What Is Actually Missing

These are the biggest true inventory gaps:

- faithful SVG gameplay unicorn state sheet
- deeper prop sets for villages and interactables in every biome
- deeper landmark sets for each biome beyond the current single landmark file
- dedicated hub-world asset kit
- dedicated splash-map asset kit
- bespoke multi-layer parallax background stacks per biome
- more than one obstruction variant per biome
- deeper platform-trim families beyond the first overlay pass
- deeper landing-ground cap families beyond the first overlay pass
- deeper `Better` / `Best` builder house exteriors
- deeper `Better` / `Best` builder room shells
- deeper `Better` / `Best` builder furniture packs for every active destination

## Refinement Priorities

### First

- faithful SVG unicorn state set
- benchmark biome landmark + gate + prop art
- benchmark biome background stack
- second and third obstruction variants for the benchmark biome
- active builder house / room / furniture sets must each keep a named next refinement pass

### Second

- prop / landmark / gate asset sets for the remaining four biomes
- companion polish pass across all five species
- pickup polish pass so the cute heart / gem language is consistent everywhere

### Third

- hub world art package
- world map art package
- lower-priority ambient life and flavor props

## Advancement Rule

Every active family must be moving through the quality matrix.

That means each tracked family needs:

- a current tier
- a target tier
- a named next pass

Do not leave houses, furniture, characters, power-ups, or props in a permanent prototype state just because they are functional.

## How To Use This With The Refinement Matrix

- `ASSET_EXPANSION_ROADMAP.md` decides the import order and package rollout
- `ASSET_FAMILY_REGISTER.md` is the explicit by-name enforcement list
- `SPRITE_REFINEMENT_MATRIX.md` decides the quality target
- this file tracks the actual production inventory and current readiness
- `SPRITES.md` remains the baseline variant checklist
