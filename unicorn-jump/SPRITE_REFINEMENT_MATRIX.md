# Sprite Refinement Matrix

## Why This Exists

`SPRITES.md` answers the baseline production question: what files and variant sets do we need.

This matrix answers the scaling question introduced by the larger world-building push:

- which asset families only need to be `Good`
- which need to reach `Better`
- which must hit `Best` before the world expands

The goal is to stop treating every asset like it needs the same level of finish.

## Tier Definitions

### Good

Readable, cute, consistent, and clearly not a placeholder.

Required traits:

- clean silhouette at gameplay size
- species identity is obvious immediately
- simple shading and material separation
- no blob anatomy or generic fallback feeling

### Better

Adds depth, craft, and stronger personality.

Required traits:

- more intentional shape design
- clearer planes and richer secondary forms
- stronger face acting and pose language
- materials and trim relate to the biome

### Best

Benchmark-quality art that defines the game's visual standard.

Required traits:

- child-delight level appeal
- memorable silhouette and expression
- layered detail that still reads cleanly at small size
- fully integrated with the scene, palette, and world identity

## Planning Rule

Use `SPRITES.md` as the volume checklist.

Use this file to decide the quality target for each asset family before new production starts.

Universal advancement rule:

- every asset family in active production must have a current tier and a next tier
- no family should be allowed to sit indefinitely as "good enough for now"
- this applies to gameplay sprites, world art, builder houses, builder room shells, builder furniture, power-ups, and map / hub packages alike

## Matrix

| Asset family | Scope | Good | Better | Best | Current planning target |
| --- | --- | --- | --- | --- | --- |
| Player unicorn | player states and menu pointer | faithful silhouette, readable horn/wings, clean motion poses | richer feathering, facial structure, better mane layering | flagship character quality, premium over entire cast | `Best` |
| Quest-giver creatures | one signature NPC per biome | real anatomy replaces blob forms, readable actions and angles | stronger species identity, costume/biome details, better face acting | benchmark NPC charm, iconic enough for key art and village scenes | `Better` moving to `Best` for top 2 biomes |
| Companion followers | small follower versions of biome species | no initials-only bubbles, obvious silhouette at tiny size | stronger glow logic, better wing/tail/ear read, clearer boost state | premium miniature mascots with instant read and emotional appeal | `Better` |
| Power-ups and quest pickups | hearts, gems, biome pickups | cute non-placeholder shape, readable color coding | better facets, highlights, magical accents | candy-premium collectible appeal, merch-like read | `Better` |
| Rescue and utility effects | rescue leaf, catch states, helper effects | readable state change and safe/friendly feeling | better motion cues, richer material read | signature magical response moments | `Good` to `Better` |
| Obstructions and flyers | birds of war, dragons, biome hazards | full-body action silhouettes instead of face badges | more aggressive pose language and stronger shape breakup | standout action-creature designs with collectible-card energy | `Better` |
| Builder houses | world-builder house exteriors and house icons | readable destination identity and silhouette | stronger exterior storytelling and architecture cues | collectible-dollhouse quality exteriors children want to enter | `Better` moving to `Best` |
| Builder room shells | themed destination interiors such as gardens, palaces, domes, and halls | room already feels like a place before furniture | stronger structural depth, landmarks, and atmosphere | full destination fantasy that can carry screenshots on its own | `Better` moving to `Best` |
| Builder furniture packs | moveable room objects, props, and decor | period-matched objects replace generic placeholders | richer materials, stronger silhouettes, better theme coherence | premium toy-like decor sets with destination-specific charm | `Better` |
| Platforms | floating jump surfaces | compatible with world palette and readable collision top | richer edge detail, underside structure, biome-specific trim | hand-authored hero platform kit for showcase biomes | `Better` |
| Landing ground | biome floor at start areas | no flat gradient slabs, matches platform language | more sculpted underside, roots, rock, props | splash-scene quality ground compositions per biome | `Better` |
| Landmark sprites | major visual anchors inside levels | recognizable landmark silhouette | stronger shape storytelling and biome-specific detail | iconic region-defining art used in map and marketing | `Best` for biome landmarks |
| Village props and interactables | tea tables, carts, houses, stands | readable object identity and scale | more charm details and local materials | miniature storybook set dressing that feels alive | `Better` |
| Gates and portals | biome entrances, lantern gates, archways | clearly readable as progression markers | stronger magical framing and biome identity | aspirational destination art that sells travel and reward | `Better` to `Best` |
| Ambient life | butterflies, sparkles, hanging plants, drifting leaves | soft world-life accents with clean silhouettes | better motion design and thematic variation | dense magical atmosphere without clutter | `Good` |
| Background parallax layers | sky, distant, mid, foreground painting layers | readable depth separation and calm palette control | stronger composition, lighting, and landmark integration | hero-scene quality backgrounds that can anchor screenshots | `Best` for benchmark biomes |
| Splash world map art | landing page world map and nodes | readable navigation and region identity | richer routes, stronger node illustrations, better hub integration | storybook map art worthy of the first screen impression | `Best` |
| Hub world assets | Lantern Garden / home village set | clear hub identity and safe-play readability | stronger village charm and unlock feedback | emotional home-base quality, feels worth returning to | `Best` |

## Production Order

### Must Reach `Best` Early

- player unicorn
- splash world map art
- Lantern Garden hub art
- first benchmark biome background set
- first benchmark biome landmark set

### Should Reach `Better` Before Broad Scaling

- all quest-giver creatures
- all companions
- all power-ups and pickups
- all obstructions
- active builder houses
- active builder room shells
- active builder furniture packs
- platform and landing-ground kits
- village props and gates

### Can Ship At `Good` Temporarily

- ambient life accents
- rescue and helper effects
- low-priority prop variants outside the benchmark biome

## Biome Rollout Rule

Do not try to bring every biome to `Best` at once.

Instead:

1. one benchmark biome reaches `Best`
2. shared gameplay-critical families across all biomes reach at least `Better`
3. remaining biomes inherit the standard and climb toward `Best` in priority order

## Review Questions

Before approving any asset family, ask:

- does this still read like a placeholder next to the original unicorn
- would a five-year-old pick this as their favorite character or object
- does this asset add world identity, or only fill a slot
- is this the correct tier for this family, or are we overbuilding / underbuilding it
