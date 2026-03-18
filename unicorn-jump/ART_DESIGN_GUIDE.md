# Art Design Guide

## Purpose

This guide defines the visual rules for new game art in Unicorn Jump.

Use it with:

- `SPRITES.md` for the required runtime asset list
- `MASTER_MODEL_PIPELINE.md` for the generation workflow
- `ART_HANDOFF.md` for frog and Lantern Bamboo Valley direction

The goal is not just to make assets that are cute.

The goal is to make the whole game feel like one designed world.

## Current Gap

The current art state is acceptable as prototype art.

It is not yet good enough as final art for a five-year-old audience.

Problems in the current prototype pass:

- some character forms still read as assembled shapes instead of designed creatures
- background scenes are serviceable, but not yet magical or memorable
- lighting is present, but not yet rich enough to create wonder
- some assets still feel "AI-made" instead of intentionally illustrated
- the world does not yet deliver the kind of delight a child should feel on first sight

This matters.

The target is not "good for AI."

The target is:

- immediately lovable
- visually comforting
- easy to read
- rich enough to invite imagination
- polished enough that a child wants to linger in the world

## Visual North Star

Unicorn Jump should feel like:

- warm
- whimsical
- readable at a glance
- cozy rather than noisy
- playful without becoming generic mobile-game slop

The visual tone should land somewhere between:

- storybook fantasy
- toy-like creature design
- gentle platformer readability

For a five-year-old, the emotional bar is higher than technical adequacy.

The world should feel like:

- a magical toy box
- a bedtime story you can explore
- a place full of friendly discoveries

If the art feels merely competent, it is below target.

## Core Art Pillars

### 1. Readability First

Every gameplay sprite must read clearly at gameplay size.

Priorities:

- strong silhouette
- simple interior detail
- obvious face direction
- clear limb placement
- strong contrast between body and background

If a sprite only looks good when zoomed in, it is not ready.

### 2. Cute Through Shape, Not Noise

Cuteness should come from:

- rounded shapes
- soft proportions
- large expressive eyes
- small mouths
- gentle poses

Avoid adding too many tiny decorative details just to make assets feel “finished.”

Cute is not enough on its own.

Assets also need:

- tactile volume
- emotional warmth
- intentional posing
- memorable faces
- strong material separation between fur, fabric, wood, leaves, glow, and sky

### 3. Family Resemblance

Creature families should feel related.

Examples:

- frog guide and frog companion should read as the same species family
- companions should look like smaller, lighter cousins of quest-giver creatures when appropriate
- biome residents should feel native to their region without becoming visually disconnected from the rest of the world

Use master models to preserve this consistency.

### 4. World Cohesion

Biomes should feel distinct, but still part of one game.

Keep these shared traits across the whole world:

- rounded, friendly shapes
- clean silhouettes
- warm lighting language
- limited, intentional palettes
- gentle fantasy tone

## Quality Bar

Every asset should pass all of these tests before it is treated as final.

### Character Pass / Fail

A character is not ready if:

- the limbs look like simple pasted ovals or capsules
- the body feels flat instead of layered
- the face only works when zoomed in
- the silhouette is generic
- the pose does not suggest personality
- it looks like a placeholder next to the unicorn

A character is ready when:

- the silhouette reads instantly
- the face is expressive at gameplay size
- the body has clear front, mid, and back planes
- hands, paws, wings, tails, or ears feel designed instead of symbolic
- the character still feels appealing when seen for less than one second

### Background Pass / Fail

A scene is not ready if:

- it feels like generic fantasy wallpaper
- the lighting is flat
- there is no focal landmark
- foreground, play space, and distance all blend together
- the player path is readable but emotionally empty
- it feels more like stock illustration than a place

A scene is ready when:

- it has a strong hero landmark
- depth reads clearly in at least 3 planes
- atmosphere supports the mood without obscuring gameplay
- the color script feels intentional
- a child could point at distinct interesting places in the scene
- it feels like a destination, not just a backdrop

## Prototype Vs Final

Prototype art may:

- establish color
- test layout
- test sprite size
- prove runtime hooks

Prototype art may not be mistaken for final quality.

Final art must:

- survive close inspection
- survive gameplay scale
- feel deliberately authored
- hold up next to children’s book, Nintendo, or premium preschool game references

If an asset is only "fine once it is moving," it is not final.

## Shape Language

### Player Unicorn

The unicorn is the player anchor.

Design rules:

- keep the unicorn slightly more polished than NPCs
- preserve a clear head, horn, wing, and hoof read
- keep jump and fall poses easy to read in motion
- avoid overcomplicating mane and accessory detail

### Quest-Giver Creatures

These need the most personality.

Design rules:

- broad readable silhouettes
- strong face shapes
- clear front and side views
- expressions readable in idle, talk, and happy states
- personality should be readable before dialog appears

### Companion Followers

These must stay readable at very small size.

Design rules:

- simplify harder than quest-givers
- exaggerate eye and body shapes
- avoid thin appendages that disappear at scale
- keep hover and blink states visually distinct with minimal edits

### Collectibles

Collectibles are UI-like gameplay objects.

Design rules:

- simple iconic silhouettes
- bright center of interest
- easy to spot against platforms and backgrounds
- glow state should increase visibility, not complexity

### Environment Objects

Platforms, lanterns, bamboo structures, bridges, and props must support the characters rather than compete with them.

Design rules:

- keep platform tops readable as landing surfaces
- preserve collision clarity
- put texture second and shape first
- avoid busy silhouettes behind the player path

### Background And Scene Art

Environment art needs stronger standards than gameplay props.

Design rules:

- every biome needs one or two landmark shapes that are unmistakably that region
- sky, midground, and foreground must each have a distinct role
- light sources should create mood, not just exposure
- decorative detail must support a sense of place
- no generic clip-art feeling foliage, rocks, clouds, or woodwork

## Proportions And Scale

### Gameplay Scale

Use these as the default logical targets:

- player hero sprites: `64x64`
- major quest-giver creatures: `64x64`
- companion followers: `32x32`
- collectibles: `24x24` to `32x32`
- effect sprites: sized to gameplay function, not concept-art detail

### Relative Presence

Use this hierarchy:

- player unicorn is the clearest and most noticeable moving subject
- quest-givers are secondary focal points
- companions are readable accents
- collectibles are bright signals
- props and decorations should support, not dominate

## Color System

### Global Rules

- keep gameplay sprites on limited palettes
- prefer intentional hue families over photorealistic shading
- reserve the brightest highlights for eyes, glow objects, and important collectibles
- use value contrast to separate sprites from the environment

### Biome Color Identity

Use the existing biome direction as the color map:

- Lantern Bamboo Valley: amber lantern light, bamboo greens, warm mist, soft blue mountain tones
- Highland Meadow: misty greens, pale sky blues, heather softness, airy highlights
- Storybook Forest: moss greens, golden stars, parchment creams, gentle fantasy violets
- Sun Orchard: warm oranges, honey golds, soft wood browns, fruit-light highlights
- Bluebonnet Prairie: sky blues, flower blues, pale grasses, cool evening glow

Do not let every biome drift into the same generic pastel wash.

Palette work should feel emotionally specific.

Examples:

- Lantern Bamboo Valley should feel warm, glowing, and slightly sacred
- Highland Meadow should feel airy and safe, not empty
- Storybook Forest should feel enchanted, not murky
- Sun Orchard should feel edible and sunlit, not dusty
- Bluebonnet Prairie should feel open and breezy, not sparse

## Line, Edge, And Finish

For SVG gameplay assets:

- use clean outer contours
- prefer simple interior shapes over fussy strokes
- keep anchor points and curves disciplined
- avoid accidental wobble or over-smoothed mushy silhouettes

For raster scene art:

- keep edges soft only where atmosphere benefits from it
- maintain clear platform readability
- preserve foreground/background separation

## Lighting And Rendering

The game should feel warmly lit, not dramatically lit.

Preferred rendering:

- soft highlights
- simple shadows
- no harsh top-light realism
- no metallic or glossy over-rendering except for specific accents like eyes or lantern glass

Lantern Bamboo Valley should lean especially into:

- amber glow
- mist diffusion
- warm-cool contrast between lantern light and mountain air

Lighting should create wonder.

If the scene still feels visually flat after lighting is added, the base forms are too weak and should be redesigned rather than over-rendered.

## AI Usage Rules

AI is allowed in the pipeline.

AI is not the quality bar.

Use AI for:

- ideation
- blockouts
- master-sheet exploration
- palette exploration
- composition thumbnails

Do not treat a one-pass AI output as final production art.

Final assets should be the result of:

- selected masters
- cleanup
- redrawing
- simplification
- consistency passes
- gameplay-scale review

If the result still visibly advertises the generation process, it is not approved.

## Animation And State Strategy

Follow the master-model workflow.

- approve the canonical creature first
- derive states from that model
- keep edits small and readable
- only add fully unique redraws when motion cannot be sold with subtle pose changes

Use runtime tricks when appropriate:

- horizontal flip
- bobbing
- squash/stretch
- mild rotation

Do not depend on these tricks to fix bad base drawings.

## Child Audience Standard

This game is for a very young player.

That means:

- charm must be obvious
- safety must be obvious
- goals must feel inviting
- creatures must feel emotionally legible
- scenes must feel like places to explore, not systems to parse

A five-year-old should feel:

- delight
- curiosity
- comfort
- pride when progressing

If the art mainly communicates functionality, it is under target.

## Format And Delivery Rules

- Default gameplay sprite format: `SVG`
- Default large painted background format: `PNG` or `WebP`
- Do not use `GIF` for gameplay sprites
- Use transparent backgrounds for gameplay sprites
- Follow the naming rules in `SPRITES.md`

## Quality Bar Checklist

Before approving any asset set, verify:

- silhouette reads at gameplay size
- expression reads without zooming
- left and right views feel like the same character
- palette is consistent with the master
- glow states are visibly different
- companions do not turn into unreadable blobs next to the unicorn
- backgrounds do not bury the player path
- no reference crosses into direct mascot or trademark copying

## Anti-Patterns

Avoid:

- generic AI fantasy faces
- inconsistent eye placement between frames
- too many gradients in gameplay sprites
- noisy texture on small assets
- over-detailed backgrounds behind jump paths
- each action pose feeling like a different creature
- “cute” assets that lose clarity at real game size

## Definition Of Success

The art pass is successful when:

- the world feels like one coherent place
- the cast feels intentionally designed
- the player can read actions instantly
- the assets still look good when scaled to actual gameplay
- the game no longer mixes polished sprites with placeholder blob characters
