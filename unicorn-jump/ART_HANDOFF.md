# Art Handoff

## Frog Spirits And Lantern Bamboo Valley

Use the provided reference images as tone references for character warmth and environment mood.

Important adaptation note:

- The blue frog reference reads as a recognizable commercial mascot from Korean branding.
- For this game, keep only the broad design language: round, friendly, calm frog spirit.
- Do not reproduce branded details, exact proportions, or any trademark-identifying features.

Use this handoff together with `SPRITES.md`.

- `SPRITES.md` defines the required action and angle matrix.
- `MASTER_MODEL_PIPELINE.md` defines the generation workflow for keeping variants consistent.
- This document defines tone, personality, prompt language, and environment direction.

## Character 1

### Blue Frog Spirit

#### Visual Direction

A large, friendly cartoon frog spirit with a simple rounded silhouette.

Key traits:

- Body shape: round, smooth, plush-like, toy-like
- Eyes: large, shiny, reflective
- Mouth: small and friendly
- Limbs: short and rounded
- Belly: white belly panel
- Pose: seated or calm grounded pose

Color palette:

- Main body: soft blue
- Belly: white
- Eyes: dark with bright highlights

Personality:

- gentle
- calm
- wise
- slightly sleepy
- guardian spirit

Game role:

- Lantern Valley Guide
- Helps the unicorn navigate bamboo platforms

#### Sprite Requirements

Concept action set:

- `frog-idle`
- `frog-blink`
- `frog-talk`
- `frog-happy`
- `frog-jump`

Production note:

- Expand these concepts into the action-and-angle matrix from `SPRITES.md`
- Generate and approve a frog master model before making action variants
- Preferred logical canvas: `64x64`
- Transparent background
- Keep edges clean and readable at small size
- If authored as SVG, keep shapes snapped to a simple grid so the result still reads like a game sprite

#### Prompt Template

```text
cute round frog spirit, soft blue body, white belly, large shiny eyes, friendly smile, simple rounded limbs, calm guardian personality, whimsical storybook fantasy animation feel, game sprite, transparent background, clean readable silhouette, 64x64 sprite canvas
```

## Character 2

### Pink Frog Companion

#### Visual Direction

A smaller frog creature with more energy and curiosity than the blue spirit.

Key traits:

- Body: pastel pink
- Belly: white
- Eyes: large expressive anime-style eyes
- Face: playful, bright, slightly mischievous
- Shape: simple rounded mascot silhouette
- Pose: active, bouncy, companion-like

Personality:

- curious
- energetic
- childlike
- mischievous

Game role:

- Companion creature
- Follows the unicorn and reveals hidden platforms

#### Sprite Requirements

Concept action set:

- `pinkfrog-idle`
- `pinkfrog-bounce`
- `pinkfrog-follow`
- `pinkfrog-cheer`

Production note:

- Expand these concepts into the companion action-and-angle matrix from `SPRITES.md`
- Derive companion variants from the same frog family master so the blue and pink frogs read as related creatures
- Preferred logical canvas: `32x32`
- Transparent background
- Keep the form readable when scaled down next to the unicorn

#### Prompt Template

```text
cute pink frog companion, pastel pink body, white belly, large expressive eyes, playful mascot silhouette, adorable game sprite, transparent background, clean readable silhouette, small companion character, 32x32 sprite canvas
```

## Environment Scene

### Korean Lantern Restaurant Reference

The restaurant reference image is useful as environmental mood and material reference.

Scene direction:

- warm Korean-inspired interior atmosphere
- dark wood beams
- tiled roof details used indoors
- hanging glassware
- lantern lighting
- black stone or marble table surfaces
- wood seating
- gate-like entry framing

Color palette:

- warm amber light
- dark wood browns
- black stone
- green bottle-glass accents
- red lantern accents

Mood:

- cozy
- warm
- welcoming
- slightly magical

## Game Adaptation

Convert that reference into a Lantern Bamboo Valley village and tavern atmosphere.

Scene elements:

- lantern posts
- bamboo beams
- tea tables
- paper lanterns
- hanging plants
- wood bridges

## Background Layers

For parallax scrolling:

- Layer 1: distant mountains
- Layer 2: bamboo forest
- Layer 3: lantern village
- Layer 4: platforms

## Environment Prompt Template

```text
pixel-friendly side-scrolling game background, lantern bamboo village, bamboo forest, warm lantern lighting, small wooden tea houses, glowing hanging lanterns, bamboo bridges, misty mountains in the distance, cozy magical atmosphere, readable parallax layers for platformer level art
```

## Exact Prompt Templates

These prompts are intended for Codex or an AI asset generator. Keep them as starting points, then refine per asset.

### Blue Frog Spirit Prompt

```text
Generate a cute blue frog spirit game sprite with a soft blue body, white belly, large reflective eyes, rounded limbs, and a calm guardian expression. Keep the silhouette simple, friendly, and readable at small size. Use a whimsical storybook fantasy animation feel, transparent background, and a 64x64 sprite canvas. Create action variants for idle, blink, talk, happy, and jump.
```

### Pink Frog Companion Prompt

```text
Generate a cute pink frog companion sprite with a pastel pink body, white belly, large expressive eyes, and a playful energetic personality. Keep the form rounded, adorable, and readable beside the unicorn. Use a transparent background and a 32x32 sprite canvas. Create action variants for idle, bounce, follow, and cheer.
```

### Lantern Bamboo Valley Background Prompt

```text
Generate a platformer background for Lantern Bamboo Valley with misty mountains, layered bamboo forest, glowing lantern village structures, tea-house details, bamboo bridges, and warm amber lighting. The scene should feel cozy, magical, and welcoming, with clear parallax separation for distant mountains, mid bamboo forest, village layer, and gameplay platform layer.
```

## Repo-Aligned Asset Structure

Keep the handoff aligned with the current project layout instead of using a generic `assets/` root.

```text
public/assets/images/
  character/
    unicorn/
  creature/
    blue-frog-spirit/
  companion/
    pink-frog/
  background/
    lantern-bamboo-valley/
  object/
    lantern/
    bamboo-platform/
    tea-table/
```

Suggested generated outputs:

- `public/assets/images/creature/blue-frog-spirit/idle-front.svg`
- `public/assets/images/creature/blue-frog-spirit/talk-front.svg`
- `public/assets/images/companion/pink-frog/hover-left.svg`
- `public/assets/images/background/lantern-bamboo-valley/scene-01.png`
- `public/assets/images/object/lantern/lantern-glow.svg`
- `public/assets/images/object/bamboo-platform/platform-01.svg`

Format guidance:

- Use `SVG` by default for character sprites, collectibles, companions, and small objects
- Use `PNG` or `WebP` for large painted backgrounds or textured scenery
- Do not use `GIF` for gameplay sprites
- Build action variants from approved master models instead of prompting each file independently

## Optional Lore

These frogs can be framed as:

- Lantern Marsh Spirits

Lore direction:

- They protect Lantern Bamboo Valley
- They guide travelers through fog and lantern light
- The pink frog is a younger spirit learning the old paths

## Final Codex Task Summary

Use this summary for the next asset-generation pass:

```text
Extend Unicorn Jump by adding frog spirit characters and a Lantern Bamboo Valley biome.

Generate sprite assets for:
- blue frog spirit guide
- pink frog companion

Generate background scenes for:
- lantern bamboo valley
- bamboo forest platforms
- lantern tavern village

All new assets should stay compatible with the existing unicorn scale and the current sprite matrix requirements. Use SVG for gameplay sprites by default and PNG/WebP for large painted background scenes.
```
