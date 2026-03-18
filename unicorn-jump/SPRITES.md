# Sprite Checklist

This project already has the core backgrounds, platforms, obstacles, and generic power-up art in `public/assets/images/`.

The current cute-art gap is the biome-specific cast and pickups that are still drawn as simple CSS shapes in `src/Game.js` and defined in `src/biomeManager.js`.

Supporting docs:

- `ASSET_INVENTORY.md`
- `ART_DESIGN_GUIDE.md`
- `ART_ROADMAP.md`
- `ASSET_EXPANSION_ROADMAP.md`
- `ASSET_FAMILY_REGISTER.md`
- `MASTER_MODEL_PIPELINE.md`
- `SPRITE_PRODUCTION_INVENTORY.md`
- `SPRITE_REFINEMENT_MATRIX.md`

New planning rule:

- use this file for baseline volume and variant counts
- use `ASSET_INVENTORY.md` for the literal on-disk and runtime-defined asset inventory
- use `ASSET_EXPANSION_ROADMAP.md` for the phased import plan that brings new asset packages into runtime and moves them toward `Best`
- use `ASSET_FAMILY_REGISTER.md` for the explicit named list of every tracked active family
- use `SPRITE_PRODUCTION_INVENTORY.md` for what actually exists, what is wired, and what is missing
- use `SPRITE_REFINEMENT_MATRIX.md` to decide whether each asset family must be merely `Good`, production-safe `Better`, or benchmark `Best`
- once an asset family is active, it must keep moving through the quality matrix instead of staying indefinitely at its first acceptable pass

## Variant Rules

- Generate all sprite variants from a canonical master model. See `MASTER_MODEL_PIPELINE.md`.
- Character sprites need multiple actions and angles. Single idle-only files are not enough.
- Recommended character angles: `front`, `left`, `right`.
- Default sprite format: `SVG`
- Recommended naming: `public/assets/images/<group>/<entity>/<action>-<angle>.svg`
- Non-character pickups and effects should use state variants instead of angles.
- Recommended pickup/effect naming: `public/assets/images/<group>/<entity>-<state>.svg`
- Do not use `GIF` for gameplay sprites. State swaps are better handled by the game with separate files.
- Keep `PNG` or `WebP` for large painted backgrounds, textured terrain, or anything that relies on raster shading.

## Existing Art We Can Reuse

- Background paintings
- Floating platforms and ground tiles
- Obstacle set
- Generic power-up set
- Current unicorn files can seed the player matrix:
  - `unicorn_idle.png`
  - `unicorn_jump.png`
  - `unicorn_fall.png`
  - `unicorn-side_l.png`
  - `unicorn_side_r.png`

## 1. Player Unicorn Upgrade Pass

The unicorn already has partial art, but not a full action-and-angle matrix.

- Unicorn minimum set
  - `public/assets/images/character/unicorn/idle-front.svg`
  - `public/assets/images/character/unicorn/idle-left.svg`
  - `public/assets/images/character/unicorn/idle-right.svg`
  - `public/assets/images/character/unicorn/run-left.svg`
  - `public/assets/images/character/unicorn/run-right.svg`
  - `public/assets/images/character/unicorn/jump-left.svg`
  - `public/assets/images/character/unicorn/jump-right.svg`
  - `public/assets/images/character/unicorn/fall-left.svg`
  - `public/assets/images/character/unicorn/fall-right.svg`
  - `public/assets/images/character/unicorn/land-front.svg`
  - `public/assets/images/character/unicorn/celebrate-front.svg`

## 2. Quest-Giver Creatures

Each biome NPC should have 3 actions across 3 angles: `idle`, `talk`, `happy` x `front`, `left`, `right`.

- Lantern Fox
  - `public/assets/images/creature/lantern-fox/idle-front.svg`
  - `public/assets/images/creature/lantern-fox/idle-left.svg`
  - `public/assets/images/creature/lantern-fox/idle-right.svg`
  - `public/assets/images/creature/lantern-fox/talk-front.svg`
  - `public/assets/images/creature/lantern-fox/talk-left.svg`
  - `public/assets/images/creature/lantern-fox/talk-right.svg`
  - `public/assets/images/creature/lantern-fox/happy-front.svg`
  - `public/assets/images/creature/lantern-fox/happy-left.svg`
  - `public/assets/images/creature/lantern-fox/happy-right.svg`

- Highland Sheep
  - `public/assets/images/creature/highland-sheep/idle-front.svg`
  - `public/assets/images/creature/highland-sheep/idle-left.svg`
  - `public/assets/images/creature/highland-sheep/idle-right.svg`
  - `public/assets/images/creature/highland-sheep/talk-front.svg`
  - `public/assets/images/creature/highland-sheep/talk-left.svg`
  - `public/assets/images/creature/highland-sheep/talk-right.svg`
  - `public/assets/images/creature/highland-sheep/happy-front.svg`
  - `public/assets/images/creature/highland-sheep/happy-left.svg`
  - `public/assets/images/creature/highland-sheep/happy-right.svg`

- Story Gnome
  - `public/assets/images/creature/story-gnome/idle-front.svg`
  - `public/assets/images/creature/story-gnome/idle-left.svg`
  - `public/assets/images/creature/story-gnome/idle-right.svg`
  - `public/assets/images/creature/story-gnome/talk-front.svg`
  - `public/assets/images/creature/story-gnome/talk-left.svg`
  - `public/assets/images/creature/story-gnome/talk-right.svg`
  - `public/assets/images/creature/story-gnome/happy-front.svg`
  - `public/assets/images/creature/story-gnome/happy-left.svg`
  - `public/assets/images/creature/story-gnome/happy-right.svg`

- Orchard Bird
  - `public/assets/images/creature/orchard-bird/idle-front.svg`
  - `public/assets/images/creature/orchard-bird/idle-left.svg`
  - `public/assets/images/creature/orchard-bird/idle-right.svg`
  - `public/assets/images/creature/orchard-bird/talk-front.svg`
  - `public/assets/images/creature/orchard-bird/talk-left.svg`
  - `public/assets/images/creature/orchard-bird/talk-right.svg`
  - `public/assets/images/creature/orchard-bird/happy-front.svg`
  - `public/assets/images/creature/orchard-bird/happy-left.svg`
  - `public/assets/images/creature/orchard-bird/happy-right.svg`

- Prairie Armadillo
  - `public/assets/images/creature/prairie-armadillo/idle-front.svg`
  - `public/assets/images/creature/prairie-armadillo/idle-left.svg`
  - `public/assets/images/creature/prairie-armadillo/idle-right.svg`
  - `public/assets/images/creature/prairie-armadillo/talk-front.svg`
  - `public/assets/images/creature/prairie-armadillo/talk-left.svg`
  - `public/assets/images/creature/prairie-armadillo/talk-right.svg`
  - `public/assets/images/creature/prairie-armadillo/happy-front.svg`
  - `public/assets/images/creature/prairie-armadillo/happy-left.svg`
  - `public/assets/images/creature/prairie-armadillo/happy-right.svg`

## 3. Companion Followers

Companions should have 3 actions across 3 angles: `hover`, `blink`, `boost` x `front`, `left`, `right`.

- Glow Fox companion
  - `public/assets/images/companion/glow-fox/hover-front.svg`
  - `public/assets/images/companion/glow-fox/hover-left.svg`
  - `public/assets/images/companion/glow-fox/hover-right.svg`
  - `public/assets/images/companion/glow-fox/blink-front.svg`
  - `public/assets/images/companion/glow-fox/blink-left.svg`
  - `public/assets/images/companion/glow-fox/blink-right.svg`
  - `public/assets/images/companion/glow-fox/boost-front.svg`
  - `public/assets/images/companion/glow-fox/boost-left.svg`
  - `public/assets/images/companion/glow-fox/boost-right.svg`

- Wind Sheep companion
  - `public/assets/images/companion/wind-sheep/hover-front.svg`
  - `public/assets/images/companion/wind-sheep/hover-left.svg`
  - `public/assets/images/companion/wind-sheep/hover-right.svg`
  - `public/assets/images/companion/wind-sheep/blink-front.svg`
  - `public/assets/images/companion/wind-sheep/blink-left.svg`
  - `public/assets/images/companion/wind-sheep/blink-right.svg`
  - `public/assets/images/companion/wind-sheep/boost-front.svg`
  - `public/assets/images/companion/wind-sheep/boost-left.svg`
  - `public/assets/images/companion/wind-sheep/boost-right.svg`

- Butterfly Spirit companion
  - `public/assets/images/companion/butterfly-spirit/hover-front.svg`
  - `public/assets/images/companion/butterfly-spirit/hover-left.svg`
  - `public/assets/images/companion/butterfly-spirit/hover-right.svg`
  - `public/assets/images/companion/butterfly-spirit/blink-front.svg`
  - `public/assets/images/companion/butterfly-spirit/blink-left.svg`
  - `public/assets/images/companion/butterfly-spirit/blink-right.svg`
  - `public/assets/images/companion/butterfly-spirit/boost-front.svg`
  - `public/assets/images/companion/butterfly-spirit/boost-left.svg`
  - `public/assets/images/companion/butterfly-spirit/boost-right.svg`

- Songbird companion
  - `public/assets/images/companion/songbird/hover-front.svg`
  - `public/assets/images/companion/songbird/hover-left.svg`
  - `public/assets/images/companion/songbird/hover-right.svg`
  - `public/assets/images/companion/songbird/blink-front.svg`
  - `public/assets/images/companion/songbird/blink-left.svg`
  - `public/assets/images/companion/songbird/blink-right.svg`
  - `public/assets/images/companion/songbird/boost-front.svg`
  - `public/assets/images/companion/songbird/boost-left.svg`
  - `public/assets/images/companion/songbird/boost-right.svg`

- Firefly Friend companion
  - `public/assets/images/companion/firefly-friend/hover-front.svg`
  - `public/assets/images/companion/firefly-friend/hover-left.svg`
  - `public/assets/images/companion/firefly-friend/hover-right.svg`
  - `public/assets/images/companion/firefly-friend/blink-front.svg`
  - `public/assets/images/companion/firefly-friend/blink-left.svg`
  - `public/assets/images/companion/firefly-friend/blink-right.svg`
  - `public/assets/images/companion/firefly-friend/boost-front.svg`
  - `public/assets/images/companion/firefly-friend/boost-left.svg`
  - `public/assets/images/companion/firefly-friend/boost-right.svg`

## 4. Quest Collectibles

Collectibles do not need angles. They need state variants: `idle`, `glow`, `collected`.

- Lantern seed
  - `public/assets/images/collectible/lantern-seed-idle.svg`
  - `public/assets/images/collectible/lantern-seed-glow.svg`
  - `public/assets/images/collectible/lantern-seed-collected.svg`

- Meadow song
  - `public/assets/images/collectible/meadow-song-idle.svg`
  - `public/assets/images/collectible/meadow-song-glow.svg`
  - `public/assets/images/collectible/meadow-song-collected.svg`

- Story star
  - `public/assets/images/collectible/story-star-idle.svg`
  - `public/assets/images/collectible/story-star-glow.svg`
  - `public/assets/images/collectible/story-star-collected.svg`

- Sun drop
  - `public/assets/images/collectible/sun-drop-idle.svg`
  - `public/assets/images/collectible/sun-drop-glow.svg`
  - `public/assets/images/collectible/sun-drop-collected.svg`

- Firefly
  - `public/assets/images/collectible/firefly-idle.svg`
  - `public/assets/images/collectible/firefly-glow.svg`
  - `public/assets/images/collectible/firefly-collected.svg`

## 5. Rescue Effect

The rescue leaf does not need angles. It needs state variants.

- Rescue leaf
  - `public/assets/images/effects/rescue-leaf-fresh.svg`
  - `public/assets/images/effects/rescue-leaf-catch.svg`
  - `public/assets/images/effects/rescue-leaf-used.svg`

## Optional Environment Sprite Pass

These are not as urgent as the character pass, but they are also shape-rendered right now:

- Lantern Bamboo Valley: bamboo stalk, hanging lantern, bridge segment, small bird silhouette
- Highland Meadow: stone ring, sheep cloud, mist arc
- Storybook Forest: storybook tree, mushroom, sparkle cluster
- Sun Orchard: citrus arch, fruit cluster, flying bird accent
- Bluebonnet Prairie: windmill, bluebonnet flower cluster, prairie sparkle cluster

## Recommended Production Order

- First pass: approve master models for the unicorn and each creature family
- Second pass: player unicorn upgrade matrix
- Third pass: 5 quest-giver creatures
- Fourth pass: 5 companion follower sets
- Fifth pass: 5 collectible state sets
- Sixth pass: rescue leaf and biome decoration polish

## Minimum Planning Counts

- Player unicorn: 11 target variants
- Quest-giver creatures: 45 target variants
- Companion followers: 45 target variants
- Collectibles: 15 target variants
- Rescue leaf: 3 target variants
- Total target frames: 119

## Scope Option If We Need To Cut Down

- Keep full action-and-angle coverage for the unicorn, quest-givers, and companions
- Keep collectibles and rescue leaf on state-only variants
- Skip environment decorations until the cast art is in
