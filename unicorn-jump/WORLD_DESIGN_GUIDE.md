# World Design Guide

## Purpose

This guide defines the world structure for Unicorn Jump.

Use it with:

- `ART_DESIGN_GUIDE.md` for visual rules
- `ART_ROADMAP.md` for art production sequencing
- `MASTER_MODEL_PIPELINE.md` for creature consistency
- `ART_HANDOFF.md` for Lantern Bamboo Valley tone and frog direction

This document is about world structure, player navigation, biome logic, and child-friendly progression.

## World North Star

The world should feel like:

- a magical playground
- safe and welcoming
- easy to understand
- visually memorable
- full of friendly discovery

The player should not feel lost.

The player should feel invited upward, outward, and back home again.

## Core Structure

Do not generate random scenes first.

Define the world system first, then generate scenes and assets that fit it.

The core structure should be:

- hub world
- small themed regions
- clear paths
- friendly discovery

This is the recommended shape:

```text
            Highland Meadow
                   |
Storybook Forest — Hub Village — Lantern Bamboo Valley
                   |
             Sun Orchard
                   |
            Bluebonnet Prairie
```

The current game already has these five biome destinations.

The long-term world design should connect them through a central hub instead of presenting them only as a linear list.

## Hub World

### Hub Name

Recommended name:

- Lantern Garden

### Hub Purpose

The hub is:

- the safe place
- the orientation anchor
- the creature village
- the region unlock screen made physical

The unicorn should always be able to return here.

That keeps the world understandable for young players.

### Hub Features

- creature village
- upgrade tree
- portal lanterns
- home treehouse
- bridges connecting small hub districts

Portal idea:

- floating lantern gates that open after helping creatures in the world

### Hub Mood

- glowing lantern trees
- small wooden bridges
- friendly frog spirits
- calm music
- soft motion in leaves, lanterns, and water

## Region Design Rules

Each region should introduce one new mechanic.

Young players learn best through repetition and clear contrast.

### Recommended Mechanic Map

- Lantern Bamboo Valley: glide on wind
- Highland Meadow: push stones
- Storybook Forest: grow plants
- Sun Orchard: light mirrors
- Bluebonnet Prairie: ride wind currents

Each biome can still share the core jump-and-climb loop, but one extra regional mechanic should define its identity.

## Region Layout Model

Each region should be readable as:

- entrance
- tutorial beat
- repeated traversal pattern
- creature village or encounter zone
- landmark set piece
- reward area
- exit gate

### Level Rhythm

Keep platform rhythm predictable:

- small jump
- small jump
- big jump
- rest platform
- reward

Predictable rhythm matters more than complexity for this audience.

## Platform Layout Rules

Use a clear three-layer design:

- background
- platform path
- foreground decoration

Platform design rules:

- landing surfaces must be obvious
- foreground art must not hide the safe route
- big jumps should be visually telegraphed
- rest platforms should feel safe and generous
- reward platforms should be visually distinct

## Landmarks

Every region needs large visual landmarks so players navigate by memory instead of UI alone.

### Lantern Bamboo Valley

- giant bamboo stalk
- panda garden
- lantern waterfall

### Highland Meadow

- stone circle
- cloud hill
- giant sheep statue

### Storybook Forest

- story tree
- mushroom glade
- page-lantern arch

### Sun Orchard

- golden arbor
- fruit-light grove
- mirror terrace

### Bluebonnet Prairie

- windmill
- longhorn spirit
- flower canyon

Landmarks should be visible from multiple platform tiers whenever possible.

## Creature Villages

Replace hostile enemy logic with villages of friendly creatures and small care-based quests.

Example Lantern Bamboo Valley village:

- panda gardener
- lantern fox
- frog elder
- crane messenger

Example quest patterns:

- find lost lantern seeds
- water bamboo sprouts
- guide fireflies home
- wake sleeping lanterns

This keeps the world aligned with the no-punishment, child-friendly tone.

## Vertical Exploration

The game is still a jump platformer, so the world structure must remain vertical.

Use consistent height bands:

- ground level
- tree platforms
- cliff platforms
- sky platforms

Every biome should feel like an upward journey, not a flat side-scrolling walk.

## World Progression

Progress should feel magical and visible.

Recommended pattern:

- help panda -> bamboo bridge grows
- help frog -> lantern portal opens
- help fox -> wind current appears

The world should react to kindness and completion.

Visible world change is better than abstract menu progression for this audience.

## Child-Friendly Safety Rules

The world must feel safe.

Avoid:

- death pits
- scary enemies
- harsh punishment
- confusing failure loops

Use instead:

- bounce flowers
- floating leaves
- rescue gusts
- friendly creatures
- gentle repositioning after falls

Fail states should feel like soft correction, not punishment.

## World Animation Rules

The world should always feel alive.

Use small motions such as:

- butterflies flying
- lanterns swaying
- leaves falling
- frogs blinking
- grass moving
- fireflies drifting

These details matter because they make simple levels feel magical.

## Background Layer Rules

Each region should use layered parallax.

Example for Lantern Bamboo Valley:

- layer 1: sky
- layer 2: mist mountains
- layer 3: bamboo forest
- layer 4: platforms and village structures
- layer 5: foreground plants

Layering should increase depth without reducing gameplay readability.

## Asset Taxonomy

World assets should be grouped by system, not dumped together.

Suggested structure:

```text
world/
  biomes/
    bamboo_valley/
    highland_meadow/
    storybook_forest/
    sun_orchard/
    prairie/
  objects/
    lantern/
    bamboo/
    stone_circle/
    windmill/
  platforms/
    bamboo_platform/
    cloud_platform/
    flower_platform/
```

Repo note:

The current project uses `public/assets/images/...`, so this taxonomy should be mapped into that structure during implementation instead of used literally as a new top-level runtime path.

## Scene Prompt Rules

When generating backgrounds or world props, prompts should describe:

- biome identity
- platformer readability
- parallax layering
- landmark visibility
- warm child-friendly tone

Example:

```text
pixel-friendly bamboo lantern valley for a side-scrolling platformer, floating bamboo platforms, misty mountains, warm glowing lanterns, readable parallax layers, cozy magical atmosphere, child-friendly game environment
```

## Map Generation Rules

Level layouts should be generated as structured beats, not as random obstacle soup.

Recommended layout sequence:

- start platform
- jump chain
- rest platform
- creature encounter
- puzzle area
- reward platform
- exit gate

This structure is simple enough for young players and scalable enough for future content.

## Procedural Expansion

Later, the world can expand procedurally.

Suggested systems:

- biome generator
- platform generator
- creature spawner
- quest generator

Example regional variants:

- bamboo island
- lantern canyon
- floating bamboo bridge

Procedural generation should remix approved systems, not invent disconnected scenes.

## Current Game Alignment

Current runtime state:

- five biomes already exist
- progression is primarily biome-by-biome
- each biome already has a named creature and quest loop

Target future state:

- one hub world anchors the five biomes
- biome unlocks are represented physically in the world
- villages, landmarks, and region mechanics become stronger navigation tools

## Definition Of Success

The world design is successful when:

- a young player can always tell where “home” is
- each biome has one memorable mechanic
- landmarks help navigation without heavy UI dependence
- vertical exploration stays central
- progression changes the world visibly
- the game feels alive and safe instead of punishing
