# Sprite Checklist

This project already has the core backgrounds, platforms, obstacles, and generic power-up art in `public/assets/images/`.

The current cute-art gap is the biome-specific cast and pickups that are still drawn as simple CSS shapes in `src/Game.js` and defined in `src/biomeManager.js`.

## Variant Rules

- Character sprites need multiple actions and angles. Single idle-only files are not enough.
- Recommended character angles: `front`, `left`, `right`.
- Recommended naming: `public/assets/images/<group>/<entity>/<action>-<angle>.png`
- Non-character pickups and effects should use state variants instead of angles.
- Recommended pickup/effect naming: `public/assets/images/<group>/<entity>-<state>.png`

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
  - `public/assets/images/character/unicorn/idle-front.png`
  - `public/assets/images/character/unicorn/idle-left.png`
  - `public/assets/images/character/unicorn/idle-right.png`
  - `public/assets/images/character/unicorn/run-left.png`
  - `public/assets/images/character/unicorn/run-right.png`
  - `public/assets/images/character/unicorn/jump-left.png`
  - `public/assets/images/character/unicorn/jump-right.png`
  - `public/assets/images/character/unicorn/fall-left.png`
  - `public/assets/images/character/unicorn/fall-right.png`
  - `public/assets/images/character/unicorn/land-front.png`
  - `public/assets/images/character/unicorn/celebrate-front.png`

## 2. Quest-Giver Creatures

Each biome NPC should have 3 actions across 3 angles: `idle`, `talk`, `happy` x `front`, `left`, `right`.

- Lantern Fox
  - `public/assets/images/creature/lantern-fox/idle-front.png`
  - `public/assets/images/creature/lantern-fox/idle-left.png`
  - `public/assets/images/creature/lantern-fox/idle-right.png`
  - `public/assets/images/creature/lantern-fox/talk-front.png`
  - `public/assets/images/creature/lantern-fox/talk-left.png`
  - `public/assets/images/creature/lantern-fox/talk-right.png`
  - `public/assets/images/creature/lantern-fox/happy-front.png`
  - `public/assets/images/creature/lantern-fox/happy-left.png`
  - `public/assets/images/creature/lantern-fox/happy-right.png`

- Highland Sheep
  - `public/assets/images/creature/highland-sheep/idle-front.png`
  - `public/assets/images/creature/highland-sheep/idle-left.png`
  - `public/assets/images/creature/highland-sheep/idle-right.png`
  - `public/assets/images/creature/highland-sheep/talk-front.png`
  - `public/assets/images/creature/highland-sheep/talk-left.png`
  - `public/assets/images/creature/highland-sheep/talk-right.png`
  - `public/assets/images/creature/highland-sheep/happy-front.png`
  - `public/assets/images/creature/highland-sheep/happy-left.png`
  - `public/assets/images/creature/highland-sheep/happy-right.png`

- Story Gnome
  - `public/assets/images/creature/story-gnome/idle-front.png`
  - `public/assets/images/creature/story-gnome/idle-left.png`
  - `public/assets/images/creature/story-gnome/idle-right.png`
  - `public/assets/images/creature/story-gnome/talk-front.png`
  - `public/assets/images/creature/story-gnome/talk-left.png`
  - `public/assets/images/creature/story-gnome/talk-right.png`
  - `public/assets/images/creature/story-gnome/happy-front.png`
  - `public/assets/images/creature/story-gnome/happy-left.png`
  - `public/assets/images/creature/story-gnome/happy-right.png`

- Orchard Bird
  - `public/assets/images/creature/orchard-bird/idle-front.png`
  - `public/assets/images/creature/orchard-bird/idle-left.png`
  - `public/assets/images/creature/orchard-bird/idle-right.png`
  - `public/assets/images/creature/orchard-bird/talk-front.png`
  - `public/assets/images/creature/orchard-bird/talk-left.png`
  - `public/assets/images/creature/orchard-bird/talk-right.png`
  - `public/assets/images/creature/orchard-bird/happy-front.png`
  - `public/assets/images/creature/orchard-bird/happy-left.png`
  - `public/assets/images/creature/orchard-bird/happy-right.png`

- Prairie Armadillo
  - `public/assets/images/creature/prairie-armadillo/idle-front.png`
  - `public/assets/images/creature/prairie-armadillo/idle-left.png`
  - `public/assets/images/creature/prairie-armadillo/idle-right.png`
  - `public/assets/images/creature/prairie-armadillo/talk-front.png`
  - `public/assets/images/creature/prairie-armadillo/talk-left.png`
  - `public/assets/images/creature/prairie-armadillo/talk-right.png`
  - `public/assets/images/creature/prairie-armadillo/happy-front.png`
  - `public/assets/images/creature/prairie-armadillo/happy-left.png`
  - `public/assets/images/creature/prairie-armadillo/happy-right.png`

## 3. Companion Followers

Companions should have 3 actions across 3 angles: `hover`, `blink`, `boost` x `front`, `left`, `right`.

- Glow Fox companion
  - `public/assets/images/companion/glow-fox/hover-front.png`
  - `public/assets/images/companion/glow-fox/hover-left.png`
  - `public/assets/images/companion/glow-fox/hover-right.png`
  - `public/assets/images/companion/glow-fox/blink-front.png`
  - `public/assets/images/companion/glow-fox/blink-left.png`
  - `public/assets/images/companion/glow-fox/blink-right.png`
  - `public/assets/images/companion/glow-fox/boost-front.png`
  - `public/assets/images/companion/glow-fox/boost-left.png`
  - `public/assets/images/companion/glow-fox/boost-right.png`

- Wind Sheep companion
  - `public/assets/images/companion/wind-sheep/hover-front.png`
  - `public/assets/images/companion/wind-sheep/hover-left.png`
  - `public/assets/images/companion/wind-sheep/hover-right.png`
  - `public/assets/images/companion/wind-sheep/blink-front.png`
  - `public/assets/images/companion/wind-sheep/blink-left.png`
  - `public/assets/images/companion/wind-sheep/blink-right.png`
  - `public/assets/images/companion/wind-sheep/boost-front.png`
  - `public/assets/images/companion/wind-sheep/boost-left.png`
  - `public/assets/images/companion/wind-sheep/boost-right.png`

- Butterfly Spirit companion
  - `public/assets/images/companion/butterfly-spirit/hover-front.png`
  - `public/assets/images/companion/butterfly-spirit/hover-left.png`
  - `public/assets/images/companion/butterfly-spirit/hover-right.png`
  - `public/assets/images/companion/butterfly-spirit/blink-front.png`
  - `public/assets/images/companion/butterfly-spirit/blink-left.png`
  - `public/assets/images/companion/butterfly-spirit/blink-right.png`
  - `public/assets/images/companion/butterfly-spirit/boost-front.png`
  - `public/assets/images/companion/butterfly-spirit/boost-left.png`
  - `public/assets/images/companion/butterfly-spirit/boost-right.png`

- Songbird companion
  - `public/assets/images/companion/songbird/hover-front.png`
  - `public/assets/images/companion/songbird/hover-left.png`
  - `public/assets/images/companion/songbird/hover-right.png`
  - `public/assets/images/companion/songbird/blink-front.png`
  - `public/assets/images/companion/songbird/blink-left.png`
  - `public/assets/images/companion/songbird/blink-right.png`
  - `public/assets/images/companion/songbird/boost-front.png`
  - `public/assets/images/companion/songbird/boost-left.png`
  - `public/assets/images/companion/songbird/boost-right.png`

- Firefly Friend companion
  - `public/assets/images/companion/firefly-friend/hover-front.png`
  - `public/assets/images/companion/firefly-friend/hover-left.png`
  - `public/assets/images/companion/firefly-friend/hover-right.png`
  - `public/assets/images/companion/firefly-friend/blink-front.png`
  - `public/assets/images/companion/firefly-friend/blink-left.png`
  - `public/assets/images/companion/firefly-friend/blink-right.png`
  - `public/assets/images/companion/firefly-friend/boost-front.png`
  - `public/assets/images/companion/firefly-friend/boost-left.png`
  - `public/assets/images/companion/firefly-friend/boost-right.png`

## 4. Quest Collectibles

Collectibles do not need angles. They need state variants: `idle`, `glow`, `collected`.

- Lantern seed
  - `public/assets/images/collectible/lantern-seed-idle.png`
  - `public/assets/images/collectible/lantern-seed-glow.png`
  - `public/assets/images/collectible/lantern-seed-collected.png`

- Meadow song
  - `public/assets/images/collectible/meadow-song-idle.png`
  - `public/assets/images/collectible/meadow-song-glow.png`
  - `public/assets/images/collectible/meadow-song-collected.png`

- Story star
  - `public/assets/images/collectible/story-star-idle.png`
  - `public/assets/images/collectible/story-star-glow.png`
  - `public/assets/images/collectible/story-star-collected.png`

- Sun drop
  - `public/assets/images/collectible/sun-drop-idle.png`
  - `public/assets/images/collectible/sun-drop-glow.png`
  - `public/assets/images/collectible/sun-drop-collected.png`

- Firefly
  - `public/assets/images/collectible/firefly-idle.png`
  - `public/assets/images/collectible/firefly-glow.png`
  - `public/assets/images/collectible/firefly-collected.png`

## 5. Rescue Effect

The rescue leaf does not need angles. It needs state variants.

- Rescue leaf
  - `public/assets/images/effects/rescue-leaf-fresh.png`
  - `public/assets/images/effects/rescue-leaf-catch.png`
  - `public/assets/images/effects/rescue-leaf-used.png`

## Optional Environment Sprite Pass

These are not as urgent as the character pass, but they are also shape-rendered right now:

- Lantern Bamboo Valley: bamboo stalk, hanging lantern, bridge segment, small bird silhouette
- Highland Meadow: stone ring, sheep cloud, mist arc
- Storybook Forest: storybook tree, mushroom, sparkle cluster
- Sun Orchard: citrus arch, fruit cluster, flying bird accent
- Bluebonnet Prairie: windmill, bluebonnet flower cluster, prairie sparkle cluster

## Recommended Production Order

- First pass: player unicorn upgrade matrix
- Second pass: 5 quest-giver creatures
- Third pass: 5 companion follower sets
- Fourth pass: 5 collectible state sets
- Fifth pass: rescue leaf and biome decoration polish

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
