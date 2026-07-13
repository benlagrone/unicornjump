# Virtual Pet Unicorn Development Plan

## Purpose

Add a virtual pet unicorn mode to Unicorn Jump: a care-focused home-base feature where the player can feed, groom, play with, rest, decorate for, and bond with the unicorn between exploration, builder, and future runner sessions.

This should feel like a gentle companion app inside the existing game, not a separate mandatory grind.

## Product Fit

The current project already has:

- a friendly non-punishing world tone
- a Little Unicorn player character
- builder rooms and furniture placement
- daily summer quests and star rewards
- companion unlocks
- creature care quests
- localStorage-backed progression

The virtual pet mode can connect these systems into a home routine:

- exploration finds gifts and memories
- runner earns small treats or sparkle currency
- builder rooms become the unicorn's living space
- daily quests can give care items
- care status can change idle animations, room reactions, and hub presence

## Design Principles

- No neglect punishment. The unicorn can get sleepy, bored, hungry, or muddy, but never sick, sad in a harsh way, or lost.
- Short sessions. A child should be able to complete a satisfying care loop in 30 to 90 seconds.
- Visible affection. Care should produce immediate animation, sound, sparkle, and mood feedback.
- Care is optional. The main game should remain playable even if the pet mode is ignored.
- The feature should reuse existing rooms, sprites, rewards, and progression instead of adding a disconnected app.
- Text stays minimal and child-friendly. Use clear labels, icons, and short warmth-focused copy.

## Core Fantasy

The player is not just controlling a unicorn in levels. They are helping care for their unicorn friend at home.

The unicorn has:

- mood
- hunger
- energy
- sparkle
- cleanliness
- bond
- favorite room items
- favorite treats
- small daily wishes

These stats should read as playful meters, not obligations.

## Core Loop

1. Visit the unicorn at home.
2. Notice what it wants through pose, icons, and a small thought bubble.
3. Choose a care action:
   - feed
   - brush
   - play
   - rest
   - dress up
   - decorate nearby
4. Watch the unicorn react.
5. Earn small bond progress, sparkles, or a daily care stamp.
6. Return to exploration, runner, or builder mode with a tiny bonus or visual change.

## Care Stats

Use broad, forgiving ranges instead of precise survival meters.

Suggested stats:

- `hunger`: full, ready for snack, very snacky
- `energy`: bright, cozy, sleepy
- `sparkle`: glowing, soft, needs shine
- `cleanliness`: clean, dusty, muddy
- `mood`: joyful, calm, curious, sleepy, playful
- `bond`: long-term affection level

Rules:

- stats decay slowly, measured in hours or days, not minutes
- stats should never drop below a friendly floor
- high care can unlock animations, room reactions, and cosmetic moments
- low care should invite action without blocking other modes

## Care Actions

### Feed

Actions:

- offer apple slice
- offer star cookie
- offer biome treat
- offer tea picnic snack from Lantern Bamboo Valley

Effects:

- raises hunger
- may raise mood if it is a favorite
- can trigger tiny idle animation

### Groom

Actions:

- brush mane
- polish horn
- rinse muddy hooves
- add sparkle dust

Effects:

- raises cleanliness and sparkle
- can change shine layer on unicorn art
- unlocks pose variants over time

### Play

Actions:

- bounce ball
- ribbon dance
- cloud hop
- hide-and-seek in room
- mini obstacle hop with no failure state

Effects:

- raises mood and bond
- costs a little energy
- can trigger companion cameos

### Rest

Actions:

- nap in room
- listen to lullaby
- cozy blanket
- lantern nightlight

Effects:

- restores energy
- lowers overexcitement if added later
- can create room ambience changes

### Dress Up

Actions:

- mane bow
- horn glow color
- saddle cloth
- trail sparkle
- seasonal accessory

Effects:

- cosmetic only
- can be earned through exploration, runner, or builder rewards

### Decorate For Pet

Actions:

- place food bowl
- place bed
- place mirror
- place toy shelf
- place grooming station

Effects:

- connects directly to builder-room mode
- unlocks passive idle behaviors
- gives practical reason to decorate rooms

## Mode Integration

### App Shell

Add a fourth high-level mode when implementation begins:

```js
setGameMode("exploration" | "world" | "room" | "pet")
```

The pet mode should be reachable from:

- Lantern Garden hub
- builder room
- main world selector
- post-run reward screen

### Builder Room

The builder room is the strongest first home for pet mode.

Integration ideas:

- the unicorn can walk to furniture and interact with it
- pet furniture unlocks care actions
- room theme changes the idle ambience
- NPC friends can react when the unicorn is fed, groomed, or playing
- favorite furniture can create small bond bonuses

### World Hub

In a future Three.js or enhanced hub:

- show the unicorn resting near the home tree
- show care status through pose and light, not warning text
- let a click/tap enter the pet home
- show completed care as a glow around the home area

### Exploration

Exploration should feed pet mode lightly:

- quest completion can unlock treats
- biome completion can unlock grooming styles or room toys
- creature thanks can become pet thought-bubble memories

Possible bonuses from high care:

- cosmetic trail
- one extra guide sparkle
- slightly warmer start animation
- companion greeting

Avoid major mechanical power boosts.

### Runner

Runner mode can feed pet mode:

- collect treats
- earn play tokens
- trigger post-run cuddle / snack scene
- unlock trail cosmetics

Pet mode can feed runner mode:

- high energy gives a happy start pose
- high bond unlocks a start chime
- favorite accessory appears during the run

## Data Model

Suggested storage key:

- `unicornPetState`

Suggested shape:

```js
{
  version: 1,
  lastUpdatedAt: "2026-06-12T00:00:00.000Z",
  hunger: 80,
  energy: 75,
  sparkle: 70,
  cleanliness: 85,
  mood: "playful",
  bondXp: 120,
  bondLevel: 2,
  dailyCareStampDate: "2026-06-12",
  unlockedTreatIds: ["apple-slice"],
  unlockedToyIds: ["ribbon-ball"],
  equippedCosmetics: {
    mane: null,
    horn: "soft-gold",
    trail: null
  },
  favoriteItemIds: [],
  recentCareActions: []
}
```

Implementation rules:

- use a version field from the start
- clamp all stat values from 0 to 100
- calculate passive decay when loading or entering pet mode, not every frame
- make decay gentle and capped
- keep daily rewards date-keyed like the current summer quest system

## Phase P0: Feature Spec And State Helpers

Objective:

- define the virtual pet rules and create safe state helpers before UI work

Implementation tasks:

- create `src/petSystem.js`
- implement:
  - `createInitialPetState()`
  - `normalizePetState(state)`
  - `applyPetTimeDelta(state, now)`
  - `applyCareAction(state, actionId)`
  - `getPetMood(state)`
  - `getPetCareHints(state)`
- add unit-like pure-function checks if the repo has a lightweight test path, or verify through a debug script/manual build if not

Exit criteria:

- pet state can load, normalize, decay gently, and apply care actions
- no UI is required yet
- existing app flow is unchanged

## Phase P1: Pet Room Prototype

Objective:

- add the first visible virtual pet surface with three care actions

Implementation tasks:

- create `src/UnicornPet.js`
- render a full-screen or room-like pet scene
- show the unicorn with existing idle sprite art
- show simple care meters or icon chips
- add three buttons:
  - feed
  - brush
  - play
- save pet state to localStorage
- expose current pet state through `window.render_game_to_text` when pet mode is active

First prototype behavior:

- feed raises hunger and mood
- brush raises cleanliness and sparkle
- play raises mood and bond, lowers energy slightly
- every action triggers a short reaction pose or sparkle burst

Exit criteria:

- user can enter pet mode, perform care actions, leave, and return with state preserved
- no care action can create a negative or stuck state
- build passes

## Phase P2: Room And Furniture Integration

Objective:

- make builder rooms matter to pet care

Implementation tasks:

- add pet furniture types to the builder catalog:
  - food bowl
  - soft bed
  - brush stand
  - toy basket
  - mirror
- let placed furniture unlock or improve matching care actions
- let the unicorn walk or animate toward the relevant furniture before the reaction
- add small room ambience reactions after care actions

Exit criteria:

- a decorated room feels more useful and alive
- care actions still work without perfect furniture placement
- furniture bonuses are clear but not required

## Phase P3: Daily Wishes

Objective:

- add lightweight daily care goals that connect pet mode to the existing daily quest feel

Possible wishes:

- have a snack
- brush mane
- play once
- rest in a cozy room
- wear something shiny
- visit a completed biome memory

Rewards:

- one or two stars
- bond XP
- cosmetic progress
- room sparkle

Rules:

- max one small reward cycle per day
- wishes should be completable quickly
- no streak pressure
- no penalty for missing a day

Exit criteria:

- daily wish gives a reason to visit pet mode
- reward cannot overwhelm exploration or builder economy

## Phase P4: Memory And Biome Treats

Objective:

- connect pet care to biome progress

Implementation tasks:

- unlock a treat, toy, or grooming style per completed biome
- add memory cards or thought bubbles from creature quests
- let favorite treats vary by mood or biome

Examples:

- Lantern Bamboo Valley: lantern cookie, bamboo brush, warm tea blanket
- Highland Meadow: heather biscuit, wool blanket, breeze ribbon
- Storybook Forest: story star snack, page kite, mushroom cushion
- Sun Orchard: citrus cookie, mirror comb, sun scarf
- Bluebonnet Prairie: bluebonnet treat, windmill toy, prairie bandana

Exit criteria:

- completing a biome adds something visible to pet mode
- pet mode makes the world feel more connected and cared for

## Phase P5: Companion And NPC Reactions

Objective:

- let companions and room NPCs participate in the care loop

Implementation tasks:

- companions can appear during matching care actions
- room NPCs can comment or emote after pet care
- high bond can unlock companion group idle moments

Examples:

- Glow Fox lights up during brushing
- Wind Sheep curls near the nap bed
- Firefly Friend orbits during sparkle care
- room friend claps after play

Exit criteria:

- pet mode feels social without becoming noisy
- reactions are short, readable, and non-intrusive

## Phase P6: Cosmetics And Long-Term Bond

Objective:

- give pet care gentle long-term progression

Unlock types:

- mane bows
- horn glow colors
- trail sparkles
- blankets
- room idle poses
- greeting animations

Rules:

- cosmetics should be earned through bond and play, not purchased
- no randomized loot mechanics
- bond levels should unlock delight, not power

Exit criteria:

- repeated care unlocks visible, meaningful cosmetics
- progression remains cozy and non-pressured

## Suggested Files

```text
src/
  UnicornPet.js
  petSystem.js
  petCareCatalog.js
  petCosmetics.js
  petRewards.js
```

If the repo moves toward folders later:

```text
src/pet/
  UnicornPet.js
  petSystem.js
  careActions.js
  careRewards.js
  petVisuals.js
```

## Validation Plan

For implementation phases:

- run `npm run build`
- test entering and leaving pet mode
- test all care actions
- verify localStorage persistence
- verify passive decay does not overrun or punish
- verify care actions clamp stats correctly
- verify keyboard and pointer/touch controls
- verify laptop and mobile layouts
- verify `window.render_game_to_text` reflects pet mode state
- inspect screenshots after feed, brush, play, and rest reactions

## First Implementation Ticket

Title:

- Add virtual pet unicorn state system and pet-room prototype

Scope:

- create `petSystem.js`
- create `UnicornPet.js`
- add a temporary pet-mode entry point from the menu or builder room
- implement feed, brush, and play
- save state to `localStorage`
- expose text-state output for pet mode
- verify build and basic browser interaction

Out of scope:

- daily wishes
- full furniture integration
- companion reactions
- cosmetics shop or unlock tree
- Three.js pet room
