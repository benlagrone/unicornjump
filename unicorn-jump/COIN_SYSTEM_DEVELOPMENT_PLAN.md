# Coin System Development Plan

## Purpose

Add collectible coins as a reusable reward and currency system across Unicorn Jump. Coins should make moment-to-moment movement more rewarding, give exploration and runner sessions a clear pickup trail, and create a gentle economy for cosmetics, room items, pet treats, and future optional unlocks.

Coins should not replace biome quest collectibles. Quest items remain objective-specific. Coins are the general-purpose reward layer.

## Product Fit

The current project already has:

- vertical jump exploration
- biome quest collectibles
- score and high score concepts
- builder stars and summer quest rewards
- future runner planning
- future virtual pet planning
- sprite/effect infrastructure for collectibles

Coins can connect these systems without changing the core friendly tone:

- exploration coins reward safe route reading
- optional coin arcs reward skill without punishing misses
- runner coins create a natural replay loop
- coins can buy or unlock low-stakes cosmetics, room props, and pet treats

## Design Principles

- Coins are optional bonuses, not required objective items.
- Coin placement should teach movement paths, not create frustration.
- The first visible coins should sit on safe jumps.
- Challenge coin arcs can exist, but missed coins should not feel like failure.
- Coins should be bright, readable, and collectible at small sizes.
- Coin totals should persist safely and be hard to corrupt.
- Avoid real-money language. This is a playful in-game sparkle currency, not monetization.

## Coin Types

### Standard Coin

Use for most pickups.

Behavior:

- worth 1 coin
- appears along normal routes
- uses a simple sparkle/pop collection effect

### Big Coin

Use sparingly as a visible reward.

Behavior:

- worth 5 coins
- appears near rest platforms, secret paths, or route milestones
- collection effect is larger but still brief

### Biome Coin Variant

Optional art layer for later phases.

Examples:

- Lantern Bamboo Valley: lantern coin
- Highland Meadow: heather coin
- Storybook Forest: page coin
- Sun Orchard: sun coin
- Bluebonnet Prairie: flower coin

Behavior:

- same value as standard or big coins
- visual identity changes by biome

### Streak Coin

Optional runner-specific variant.

Behavior:

- appears in runner lanes or arcs
- supports combo chains
- missing one breaks combo but does not end the run

## Core Loop

1. Player starts a run or enters a world area.
2. Coins appear along readable movement paths.
3. Player collects coins by touching them.
4. Coin count updates immediately.
5. A small collection effect and sound confirm pickup.
6. End-of-run summary shows coins earned.
7. Total coins persist and become available for future unlocks.

## Placement Rules

### Exploration Mode

Place coins in three patterns:

- safe path: coins that sit on or just above expected jump routes
- guide path: coins that subtly point toward the next safe platform or quest area
- challenge arc: optional coins requiring better timing or a wider jump

Rules:

- never place required progression behind coin collection
- never hide a safe platform behind coin effects
- avoid coin clusters that overlap creature prompts, dialog, or quest collectibles
- keep coin pickup radii forgiving on mobile
- avoid placing coins where the player must fall blindly to collect them

### Landing Scenes

Use coins lightly:

- one or two near village props
- small rewards after inspecting a landmark
- optional coins near the gate after a quest starts

Landing coins should not distract from the creature-help loop.

### Runner Mode

Runner coins can be denser:

- lane trails
- jump arcs
- glide trails
- companion-guided paths
- big coin at the end of a clean section

Rules:

- keep the first runner slice generous
- coin trails should make the route more legible
- combo coins can be added after the base pickup loop is stable

## Data Model

Suggested persistent key:

- `unicornCoinWallet`

Suggested shape:

```js
{
  version: 1,
  totalCoins: 0,
  lifetimeCoins: 0,
  spentCoins: 0,
  runHistory: [],
  lastUpdatedAt: "2026-06-12T00:00:00.000Z"
}
```

Suggested run summary shape:

```js
{
  runId: "lantern-bamboo-valley-2026-06-12T00:00:00.000Z",
  mode: "exploration",
  biomeId: "lantern-bamboo-valley",
  coinsCollected: 18,
  bigCoinsCollected: 1,
  missedCoins: 6,
  completedAt: "2026-06-12T00:00:00.000Z"
}
```

Rules:

- clamp coin values to non-negative integers
- never let spending reduce `totalCoins` below zero
- preserve `lifetimeCoins` for achievement/progress uses
- cap stored run history to a small recent list, such as 20 entries
- keep quest collectibles separate from coin data

## Runtime State

Suggested in-run coin item shape:

```js
{
  id: "coin-platform-12-0",
  type: "standard",
  x: 220,
  y: 480,
  width: 28,
  height: 28,
  value: 1,
  collected: false,
  platformId: "platform-12",
  patternId: "safe-path-3"
}
```

Collected coin effect shape:

```js
{
  id: "coin-pop-123",
  x: 220,
  y: 480,
  startedAt: 12000,
  durationMs: 420,
  value: 1
}
```

## Phase C0: Coin Spec And Pure Helpers

Objective:

- add the coin model and helper functions without changing gameplay

Implementation tasks:

- create `src/coinSystem.js`
- implement:
  - `createInitialCoinWallet()`
  - `normalizeCoinWallet(wallet)`
  - `addCoins(wallet, amount, source)`
  - `spendCoins(wallet, amount, sink)`
  - `createCoinRunSummary(params)`
  - `mergeCoinRunSummary(wallet, summary)`
- add simple helper checks through an existing test path or a small development-only script

Exit criteria:

- wallet creation, earning, spending, and normalization are deterministic
- invalid values are clamped safely
- no gameplay UI changes yet

## Phase C1: Exploration Coin Prototype

Objective:

- make coins visible and collectible in the current exploration runtime

Implementation tasks:

- add coin generation to `src/Game.js`
- generate coins after platform layout is created
- place initial coins on safe platform-to-platform paths
- add coin collision checks using forgiving bounds
- add coin collection state to the game loop
- include `visibleCoins`, `coinsCollected`, and `runCoins` in `window.render_game_to_text`
- add simple DOM/SVG or image-based coin rendering
- add collection pop effect
- emit audio event for coin pickup

Initial rules:

- standard coin value: 1
- big coin value: 5
- max visible coin clusters should stay low enough to avoid clutter
- do not spawn coins on the first platform until the player has space to understand them

Exit criteria:

- player can collect coins during a normal biome run
- coin count changes immediately
- collected coins disappear and play feedback
- automated text state reports visible and collected coins
- build passes

## Phase C2: HUD And Summary

Objective:

- make coin rewards understandable without overwhelming the game screen

Implementation tasks:

- add compact coin counter to gameplay HUD
- add coin line to biome-complete / end-of-run summary
- add total wallet display in menu or world hub
- keep labels short and readable on mobile
- avoid covering creature prompts or platform paths

Exit criteria:

- current run coins are visible while playing
- total coins are visible outside the run
- end-of-run summary clearly shows coins earned
- mobile layout remains clean

## Phase C3: Persistence And Wallet

Objective:

- persist coin totals safely across runs

Implementation tasks:

- add localStorage load/save helpers
- merge run coins only once at completion
- avoid double-awarding on replay, refresh, or completion overlay remount
- store recent run summaries for debugging and future reward screens

Risk controls:

- use a run id or completion flag to prevent duplicate payout
- keep wallet writes centralized
- validate wallet shape every load

Exit criteria:

- coins persist after refresh
- repeated completion screen renders do not duplicate rewards
- wallet survives malformed or missing stored data

## Phase C4: Coin Art And Audio Pass

Objective:

- make coins feel like intentional game objects, not placeholder dots

Implementation tasks:

- add coin assets under `public/assets/images/collectible/` or a dedicated `coin/` folder
- create variants:
  - standard idle
  - standard shine
  - big coin idle
  - big coin shine
  - collected pop
- add coin pickup sound or reuse a gentle existing sound temporarily
- add small sparkle trail for collection

Art rules:

- readable at 24px to 32px
- strong silhouette
- warm gold with a unique unicorn/star cut or crescent mark
- do not confuse coins with quest collectibles

Exit criteria:

- coin art reads clearly against all current biome backgrounds
- collection effect is satisfying but brief
- sound is soft and not repetitive or harsh

## Phase C5: Unlock Sinks

Objective:

- give coins gentle uses without making the game economy feel grindy

Possible sinks:

- room furniture color variants
- pet treats
- unicorn trail sparkle colors
- runner celebration effects
- hub lantern decorations
- cosmetic badges

Rules:

- first unlocks should be cheap and visible
- never require coins to finish a biome
- avoid long grind prices
- avoid randomized purchases
- avoid any real-money framing

Exit criteria:

- one small unlock can be purchased and equipped
- spending updates the wallet safely
- the purchased item appears in the relevant mode

## Phase C6: Companion And Power-Up Interactions

Objective:

- connect coins to existing companion effects without destabilizing gameplay

Possible effects:

- Firefly Friend: nearby coin pull
- Glow Fox: highlights safe coin paths
- Wind Sheep: glide coin arcs become easier
- Songbird: coin streak chime
- Butterfly Spirit: saves one missed streak in runner mode

Exit criteria:

- companion effects are understandable and small
- coin collection remains optional
- companion modifiers work in text-state verification

## Phase C7: Runner Coin Integration

Objective:

- make coins a natural reward loop for future Unicorn Runner mode

Implementation tasks:

- define runner coin lanes
- add streak and combo counters
- add big coins at section ends
- add runner end summary with run coins and wallet payout
- feed selected runner rewards into pet/cosmetic sinks

Exit criteria:

- runner mode can use the same wallet
- runner coin density is fun but not visually noisy
- runner rewards do not overwhelm exploration rewards

## Suggested Files

```text
src/
  coinSystem.js
  coinPlacement.js
  coinWallet.js
  coinRewards.js
```

If the repo moves toward folders later:

```text
src/coins/
  coinSystem.js
  coinPlacement.js
  coinWallet.js
  coinRewards.js
  coinVisuals.js
```

## Integration Points

Current likely integration points:

- `src/Game.js` for exploration coin spawning, collision, rendering, text state, and run summary
- `src/App.js` for wallet persistence and summary payout
- `src/useGameAudio.js` for pickup sound
- `src/spriteCatalog.js` if coin art is cataloged with other collectibles
- `src/BuilderRoom.js` for coin-purchased room items later
- `src/UnicornPet.js` after the virtual pet feature exists
- future `RunnerGame.js` for runner coin lanes

## Validation Plan

For implementation:

- run `npm run build`
- use the shared web-game Playwright client after each meaningful gameplay change
- inspect screenshots showing visible coins, collected coins, HUD counter, and summary payout
- verify `window.render_game_to_text` includes coin state
- verify `window.advanceTime(ms)` remains deterministic
- test keyboard and pointer/touch collection paths
- test mobile and laptop viewports
- test wallet persistence after refresh
- test duplicate-payout prevention

Specific scenarios:

- start a run and see safe-path coins
- collect one coin and confirm count increments
- collect a cluster and confirm all collected coins disappear
- miss coins and confirm no penalty
- complete a run and confirm wallet payout
- refresh after completion and confirm payout is not duplicated
- spend coins on a cheap test unlock and confirm wallet cannot go negative

## First Implementation Ticket

Title:

- Add collectible coin prototype to exploration mode

Scope:

- create `coinSystem.js`
- generate standard coins along safe platform paths in `Game.js`
- collect coins on unicorn overlap
- show run coin count in HUD
- include coins in text-state output
- add simple coin pop effect
- add end-of-run coin line

Out of scope:

- coin shop
- runner coins
- biome coin variants
- companion coin effects
- final coin art
