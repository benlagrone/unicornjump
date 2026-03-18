# Master Model Pipeline

## Core Rule

Do not generate final sprite variants directly as unrelated images.

Generate one canonical master model first.

Everything else comes from that.

This is the difference between:

- a cast that feels designed
- a cast that feels randomly generated

## Why This Matters

Using a single master model per creature family keeps:

- proportions consistent
- colors consistent
- silhouette consistent
- lighting direction consistent
- line treatment consistent

Without a master model, AI-generated sprite sets usually drift in eye size, body shape, pose language, and palette.

## The Professional Trick

### 1. Create The Master Character

Start with one canonical neutral design sheet for each creature family.

Recommended master views:

- `front-neutral`
- `side-neutral`

Optional if needed:

- `three-quarter-neutral`

The master is the source of truth for:

- silhouette
- face construction
- limb proportions
- belly markings
- horn, wing, or tail placement
- palette

Recommended source-sheet setup:

- plain white or transparent background
- neutral pose
- clean silhouette
- front-facing sheet plus side-facing sheet
- one canonical exported file per family, for example `frog-master-sheet.png` or `frog-master-sheet.svg`

For this repo, the master can be created as:

- a clean `SVG` reference sheet for vector-first production
- or a high-resolution `PNG` concept sheet if the design must be painted first and then simplified

The final gameplay assets should still follow the format rules in `SPRITES.md`.

Example master prompt ingredients:

- cute frog spirit character
- simple rounded body
- large glossy eyes
- white belly
- friendly smiling face
- front facing
- neutral pose
- clean silhouette
- plain white background
- game design reference sheet

### 2. Lock The Silhouette

The silhouette must read cleanly at small size.

Priorities:

- big readable shape
- simple limbs
- strong outer contour
- no tiny details that vanish at gameplay scale

If the sprite looks confusing as a flat silhouette, fix the master before making variants.

If a script is part of the workflow, silhouette extraction is a valid intermediate step between concept approval and final variant generation.

### 3. Lock The Palette

Do not let each generated frame invent new colors.

Create a small palette from the master and reuse it across all variants.

Recommended target:

- 8 to 16 colors for pixel-style assets
- slightly broader palette only when needed for painterly background work

If raster processing is used, palette reduction can be applied after generating the master reference.

Example:

```python
img = img.convert("P", palette=Image.ADAPTIVE, colors=16)
```

For SVG delivery:

- keep the same limited swatch list across all exported files
- avoid one-off tints unless they represent a real state change

### 4. Derive Actions From The Same Master

Do not prompt each action as a separate new character.

Derive actions from the master by modifying:

- eyes
- mouth
- arm placement
- body squash and stretch
- jump arc posture
- talk pose
- happy pose

This keeps the creature recognizable across all states.

### 5. Generate Variants By Species, Not By Accident

Once the master body language is locked, create related creatures from the same construction logic.

Examples:

- blue frog spirit
- pink frog companion
- green frog variant
- gold frog elder

The body system stays consistent while:

- color
- accessory
- expression
- status markings

change between characters.

This makes the world feel like it has creature families instead of disconnected mascots.

### 6. Build The Export Set

After the master is approved:

- export per-state files for the runtime
- or build sprite sheets if the pipeline needs them

Example frame layout:

```text
[ idle ][ blink ][ jump ][ land ][ talk ][ happy ]
```

For this repo, the runtime currently prefers individual asset files over animated GIFs.

If sprite sheets are produced, treat them as pipeline artifacts or import helpers, not as a replacement for the per-state runtime asset list in `SPRITES.md`.

## Runtime Optimization Tricks

A neutral front or side master gives the game extra flexibility.

Useful low-cost runtime transforms:

- horizontal flip for left/right symmetry
- slight rotation for bounce or hover
- gentle squash/stretch
- small vertical bobbing

This can reduce how many fully unique drawings are required.

Important caveat:

- only mirror assets when the design is intentionally symmetrical enough to survive the flip
- if a character has asymmetric markings, props, or hair flow, keep explicit left and right variants

## Repo Guidance

This repo already defines a full target sprite matrix in `SPRITES.md`.

Use this pipeline as the generation workflow behind that matrix:

1. Create or approve the master model
2. Freeze silhouette and palette
3. Generate action variants from the master
4. Export the repo-aligned `SVG` or scene `PNG/WebP` deliverables

Do not skip from concept prompt straight to final runtime files.

## Recommended Master Model Inventory

Start with masters for the most important recurring creature families.

Immediate candidates:

- unicorn
- frog spirit
- fox spirit
- panda gardener
- sheep spirit
- songbird
- armadillo
- butterfly spirit
- story gnome, if that character remains part of the biome roster

If the cast expands, add new masters only when they define a real new family.

## Child-Friendly Worldbuilding Note

This approach also works well for collaborative creature design.

A simple generator can vary:

- species
- color
- hat or accessory
- personality

while preserving the same master construction underneath.

That is useful both for future tooling and for a kid-friendly co-design flow.

## Optional Future Tooling

If the art pipeline expands, build a creature generator on top of the master-model system.

Suggested inputs:

- species
- color
- hat or prop
- personality

Example:

```text
species: frog
color: pink
hat: lantern
personality: shy
```

Expected output:

- approved family master reference
- palette-locked state variants
- optional sprite sheet export
- repo-aligned runtime files

## Final Rule

Master first.

Variants second.

Exports last.
