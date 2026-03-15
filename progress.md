Original prompt: The game is very buggy. It was working initially, but then called code broke it, and I need you to help me put it back together. It's a doodle jump game with sprites like a unicorn and other animals, and there are sprites like the ground that are floating in the air for the unicorn to jump on.

Notes:
- Initial scan found likely regressions from mixed implementations: `Game.js` is active, but there are duplicate platform/obstacle managers and stale HTML/assets.
- Known mismatches include missing sprite references, unused props between `App` and `Game`, and audio paths that do not match stored assets.
- Reproduced a tooling blocker before gameplay: CRA 3 / webpack 4 fails on the current Node runtime without `NODE_OPTIONS=--openssl-legacy-provider`.
- Replaced the brittle active game loop with a smaller stable implementation that uses the unicorn sprites, floating platform art, deterministic stepping hooks, and App callbacks.
- Verified the repaired game in-browser with the Playwright client after each meaningful change. Final pass: no console/page errors, build compiles cleanly, gameplay screenshots and text-state are both emitted.
- Converted the run into a finite vertical level: the camera starts at the bottom of the tall background and scrolls upward as the unicorn climbs.
- Finish behavior now waits for the unicorn to land on the widened goal platform near the top; progress caps at 99% until that landing happens, then the app shows the level-complete overlay.

TODO:
- Decide whether to delete the stale duplicate modules (`Platform.js`, `PlatformManager.js`, `Obstacle.js`, `ObstacleManager.js`, `PowerUp.js`, `AudioManager.js`) now that the active path is stable.
- If audio is brought back, rewire it to the existing `/public/assets/media/*.wav` assets instead of the stale `/assets/audio/*.mp3` paths.
- Optional: tighten Playwright/text-state synchronization further if exact screenshot/state parity becomes important for future automated tests.

2026-03-14:
- Began the Living Garden Adventure expansion on top of the repaired jumper loop instead of replacing it.
- Added new data/system modules: `biomeManager.js`, `creatureSystem.js`, `questSystem.js`, `companionSystem.js`, and `dialogSystem.js`.
- Reworked `Game.js` around biome progression, creature encounters, collectible help quests, companion rewards, dialog, parallax biome decoration, and leaf-rescue fall recovery with no fail state.
- Reworked `App.js` into a biome-by-biome journey flow with persistent garden progress and companion unlock tracking in localStorage.
- Restyled `Settings.js` with inline styles so it still renders coherently without relying on missing Tailwind output.
- Build verification passed with `npm run build`.
- Playwright verification passed against `http://localhost:3001` after escalating out of the sandbox for Chromium:
  - `output/web-game/garden-start-2` confirms the new biome HUD, creature placement, and quest shell render correctly.
  - `output/web-game/garden-passive-long` and `output/web-game/garden-complete` confirm passive climbing can start the Lantern Fox quest, collect all seeds, unlock Glow Fox, and reach the biome completion screen.
  - `output/web-game/garden-rescue-visible` confirms the no-fail leaf rescue path appears with matching text-state output.
- Fixed two issues found during verification:
  - quest items could duplicate onto the same platform in shorter levels; quest placement is now unique and spread through the level.
  - the rescue leaf was being consumed too quickly and hidden under the dialog card; it now persists briefly and spawns higher so the catch is visible.
- Wired `settings.difficulty` into the active `Game.js` runtime config so the Settings modal affects real gameplay again.
- Added spacing profiles for `gentle`, `normal`, and `adventurous`; higher difficulty now uses wider vertical gaps and stronger lateral spread, while the bottom start platform stays centered under the unicorn.
- Verified the difficulty change directly with Playwright on `http://127.0.0.1:3002`:
  - `output/web-game/direct-check-menu.png` confirms the current Living Garden menu is the live build.
  - `output/web-game/direct-check-play.png` shows the default `gentle` run starting on the centered bottom platform.
  - `output/web-game/direct-check-adventurous.png` shows `adventurous` with fewer visible platforms and wider spacing while preserving the same centered start.
- Fixed the “missed creature” flow in `Game.js`:
  - quest intro now auto-starts once the unicorn clearly passes above a creature instead of soft-locking the run until the player finds a way back;
  - the camera now has a downward follow band, so dropping lower platforms can scroll the view back down instead of locking the camera upward forever.
- Cleaned up the most obvious screen artifacts:
  - removed the platform tint blend that was painting translucent rectangular bands around platform sprites;
  - reduced biome decoration overlays to subtle glow/star accents so the detailed background paintings are not covered by flat vector pills, blobs, and blocks.
- Verification after the cleanup:
  - `output/web-game/meadow-fix-check.png` shows Highland Meadow quest state already started after the sheep has fallen well below the viewport, confirming the missed-creature soft-lock is removed.
  - `output/web-game/meadow-start-check-2.png` and `output/web-game/storybook-start-check-2.png` show much cleaner opening screens without the worst translucent overlay artifacts from the previous screenshots.
- Added periodic obstacle flyers to the live `Game.js` loop using the existing `/public/assets/images/obstacle/*.png` art instead of the stale placeholder obstacle components.
- Obstacle behavior now fits the cozy game:
  - one or two flying critters can enter from the left or right every few seconds;
  - they bob across the current camera band and, on contact, bump the unicorn sideways/upward instead of causing a fail state;
  - obstacle positions are included in `render_game_to_text` as `visibleObstacles` for automated checks.
- Verification after the obstacle pass:
  - the required Playwright game client was rerun successfully against `http://127.0.0.1:3002`;
  - `output/web-game/obstacle-flyers-check-5.png` shows an obstacle flyer entering Lantern Bamboo Valley during normal gameplay;
  - the matching deterministic state snapshot reported `visibleObstacles` with an active flyer at the left edge moving rightward.

TODO:
- Expand the same verified loop beyond the first biome if the next pass should cover multi-biome playtesting and balancing.
- Consider whether the settings difficulty should further tune quest/platform pacing or stay as a lightweight flavor control.

2026-03-14:
- Audited the current Living Garden art coverage and confirmed the main unicorn/platform/background sets already exist in `unicorn-jump/public/assets/images`, while biome creatures, quest collectibles, companion followers, and the rescue leaf are still rendered as simple CSS/vector shapes in `unicorn-jump/src/Game.js`.
- Added `unicorn-jump/SPRITES.md` with a concrete production checklist for the cute-sprite pass, including the 5 quest-giver creatures, 5 collectible types, 5 companion followers, the rescue leaf, and an optional biome decoration polish pass.
- Expanded `unicorn-jump/SPRITES.md` from single-image placeholders into an action-and-angle asset matrix: the unicorn now has its own upgrade pass, each quest-giver and companion has front/left/right variants across multiple actions, and pickups/effects are defined as state-based variants.
