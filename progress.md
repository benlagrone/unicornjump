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
- Added a shared `unicorn-jump/src/haikuText.js` copy layer and converted the live menu, settings modal, gameplay HUD, gate banner, pause overlay, dialog cards, browser title, and completion overlays to kid-friendly three-line haiku text blocks.
- Reworked the settings difficulty picker from a plain `<select>` into haiku-styled option cards so the settings screen stays within the “haikus always and only” requirement.
- Tightened the menu/overlay layout for the taller multiline copy:
  - menu buttons now use multiline button styling;
  - menu, settings, and completion panels have `maxHeight` + `overflowY` guards instead of clipping;
  - the menu hero haiku was shortened and resized so it reads cleanly as a three-line block on laptop-height screens.
- Verification after the haiku pass:
  - `npm run build` still compiles successfully after the copy and layout changes;
  - the required Playwright game client was rerun successfully against `http://127.0.0.1:3003` with fresh gameplay captures in `output/web-game/haiku-client-final`;
  - `output/web-game/haiku-menu-final-4/shot-0.png` shows the menu copy, buttons, and journey map all rendered as haiku blocks;
  - `output/web-game/haiku-settings/shot-0.png` shows the settings modal fully converted to haiku copy, including the new difficulty buttons;
  - `output/web-game/haiku-pause/paused.png` and `output/web-game/haiku-pause/state.json` confirm the pause overlay text renders as haiku and the game enters `mode: "paused"` correctly.
- Replaced the old landing-page list with a circular world selector in `unicorn-jump/src/App.js`:
  - the right side is now a glowing world ring with five clickable land nodes around a central enter orb;
  - clicking a land updates the selected biome and background painting immediately;
  - pressing the central orb still enters the same jump-game flow, so biome selection now happens before gameplay instead of through the linear list.
- Added new haiku helpers in `unicorn-jump/src/haikuText.js` for the world selector: the landing hero, selected-land card, center-orb prompt, and world-progress copy now all come from the shared haiku layer.
- Moved the Settings button into the world panel so it stays visible on typical laptop-height screens even with the larger world-map layout.
- Verification after the world-map menu pass:
  - `npm run build` still compiles successfully after the world-menu replacement;
  - the required Playwright game client was rerun successfully against `http://127.0.0.1:3003` with gameplay captures in `output/web-game/world-client-final`;
  - `output/web-game/world-menu-final/shot-0.png` shows the new circular world selector with the center enter orb and visible settings button;
  - `output/web-game/world-select-check/selected-storybook.png` confirms clicking the Storybook node updates the selected land in the menu;
  - `output/web-game/world-select-check/storybook-game.png` and `output/web-game/world-select-check/storybook-state.json` confirm that entering from that selected node opens the Storybook Forest jump game, with the text-state reporting `"biome":"Storybook Forest"`.
- Rebalanced the UI text after seeing the all-haiku pass in context:
  - short titles, buttons, card labels, HUD headings, browser title, and settings labels are plain titles again;
  - descriptive body copy and alert-style text (dialogs, pause overlay, helper descriptions) stay as haikus.
- The main files for that copy rebalance were `unicorn-jump/src/App.js`, `unicorn-jump/src/Game.js`, `unicorn-jump/src/Settings.js`, and `unicorn-jump/src/haikuText.js`.
- Verification after the title/body rebalance:
  - `npm run build` compiled successfully after the copy cleanup;
  - the required Playwright game client was rerun successfully against `http://127.0.0.1:3003`;
  - `output/web-game/title-balance-menu/shot-0.png` shows the world menu with plain titles and haiku descriptions;
  - `output/web-game/title-balance-game/shot-0.png` shows the in-game HUD with plain headings and haiku quest/dialog text;
  - `output/web-game/title-balance-settings/settings.png` shows the Settings modal with plain section titles and haiku helper text.

TODO:
- Expand the same verified loop beyond the first biome if the next pass should cover multi-biome playtesting and balancing.
- Consider whether the settings difficulty should further tune quest/platform pacing or stay as a lightweight flavor control.

2026-03-14:
- Audited the current Living Garden art coverage and confirmed the main unicorn/platform/background sets already exist in `unicorn-jump/public/assets/images`, while biome creatures, quest collectibles, companion followers, and the rescue leaf are still rendered as simple CSS/vector shapes in `unicorn-jump/src/Game.js`.
- Added `unicorn-jump/SPRITES.md` with a concrete production checklist for the cute-sprite pass, including the 5 quest-giver creatures, 5 collectible types, 5 companion followers, the rescue leaf, and an optional biome decoration polish pass.
- Expanded `unicorn-jump/SPRITES.md` from single-image placeholders into an action-and-angle asset matrix: the unicorn now has its own upgrade pass, each quest-giver and companion has front/left/right variants across multiple actions, and pickups/effects are defined as state-based variants.
- Updated `unicorn-jump/SPRITES.md` to make SVG the default sprite format, explicitly avoid GIF for gameplay states, and reserve PNG/WebP for painted backgrounds and textured terrain.
- Added `unicorn-jump/ART_HANDOFF.md` with the frog-spirit and Lantern Bamboo Valley art direction, prompt templates, environment notes, trademark-safe adaptation guidance, and repo-aligned asset structure for the next asset generation pass.
- Added `unicorn-jump/MASTER_MODEL_PIPELINE.md` with the master-character workflow: create one canonical creature model first, lock silhouette and palette, derive all actions from that source, and only then export the runtime files. Cross-linked that pipeline from `SPRITES.md` and `ART_HANDOFF.md`.
- Added `unicorn-jump/ART_DESIGN_GUIDE.md` and `unicorn-jump/ART_ROADMAP.md` to define the visual north star, quality bar, scale and palette rules, roadmap phases, milestone slices, and the fastest path to replacing placeholder art with a coherent final style.
- Expanded the art-planning docs with more explicit master-sheet guidance from the latest handoff: canonical plain-background master outputs, silhouette extraction as a real pipeline step, `panda gardener` as another family candidate, and an optional future creature-generator tooling track.
- Added `unicorn-jump/WORLD_DESIGN_GUIDE.md` and `unicorn-jump/WORLD_ROADMAP.md` to capture the hub-and-regions world structure, child-friendly safety rules, landmark/mechanic system, Lantern Garden hub concept, and a migration path from the current linear biome journey toward a clearer world map.
- Reworked the menu splash map in `unicorn-jump/src/App.js` from the abstract world circle into a real illustrated world-map panel with a Lantern Garden hub, connector paths, biome landmark glyphs, and stronger biome-node presentation.
- Verification:
  - `npm run build` passed after the splash-map update.
  - Playwright capture against the local dev server refreshed `unicorn-jump/output/web-game/shot-0.png`, which now shows the new splash-page world map art in the menu screen.
- Added a live audio hook in `unicorn-jump/src/useGameAudio.js` and wired the active `Game.js` runtime to the existing `/public/assets/media/*.wav` files instead of the stale `AudioManager.js` paths.
- Connected gameplay events to sound cues: platform bounce, collectible pickup, quest completion, rescue leaf spawn/catch, obstacle hit, pause/resume, goal lock, and biome completion now emit audio when `settings.soundEnabled` is on.
- Connected `settings.musicEnabled` to background music startup/shutdown; the hook now fails gracefully because the current `unicorn-jump/public/audio/background_music.mp3` placeholder is empty, logs once, and stops retrying until a real generated loop is added.
- Verification after the audio pass:
  - `npm run build` passes.
  - Playwright verification passed against `http://127.0.0.1:3003` using the required client with artifacts in `output/web-game/audio-check/`.
  - The generated `state-0.json` through `state-2.json` confirm the menu start flow, biome intro, and normal in-game state progression still work after the audio wiring.
- Added pointer-based steering to the active `unicorn-jump/src/Game.js` runtime so the game responds to tablet-style press/hold interaction instead of keyboard-only left/right control.
- Pointer behavior details:
  - the game surface now uses `touchAction: 'none'` and listens for `pointerdown` / `pointermove` / `pointerup` / `pointercancel`;
  - a held pointer steers toward the touched horizontal position with a dead zone around the unicorn, so touch behaves like “guide the jump this way” instead of doing nothing;
  - pointer and keyboard input both release cleanly on blur/reset so movement does not get stuck.
- Updated the in-game controls haiku so it now mentions touch input as well as arrow keys.
- Verification after the tablet-control pass:
  - `npm run build` passes.
  - The required Playwright web-game client was rerun against `http://localhost:3004` with artifacts in `output/web-game/tablet-pointer-check/`; this still verifies start flow and state capture, but its movement choreography does not affect this game because the shared client only sends mouse bursts relative to a `<canvas>` and the active game is DOM-based.
  - Direct Playwright touch-pointer verification on the live build wrote artifacts to `output/web-game/tablet-touch-direct/` and confirmed real horizontal steering on a tablet-sized viewport:
    - `right-hold` ended at `player.screenX = 638`, `vx = 440`, `facing = "right"`;
    - `left-hold` ended at `player.screenX = 286`, `vx = -440`, `facing = "left"`.

TODO:
- Replace `unicorn-jump/public/audio/background_music.mp3` with a real generated loop, or switch the hook to per-biome loop files once the generator pipeline is ready.
- Decide whether obstacle collisions should keep reusing `tap.wav` or get a dedicated softer `bump.wav` asset from the generator.
- If future automated interaction tests need true tablet drag coverage through the shared game client, either add a canvas-backed input surface or extend the shared client so its pointer choreography can target DOM elements instead of only a canvas.

2026-03-15:
- Clarified the first creature-quest interaction in the live `unicorn-jump/src/Game.js` loop so helping a creature is no longer only an implicit proximity/bump action.
- Added explicit interaction support for quests:
  - keyboard help trigger on `E` or `Enter` when the unicorn is close to a visible creature;
  - pointer/tap help trigger when the player taps the creature prompt area instead of steering.
- Added stronger on-screen affordances for unstarted quests:
  - visible `!` marker above the creature;
  - highlight ring around the quest giver;
  - small prompt bubble that says `Help Friend` and `Press E or tap` once the unicorn is close enough.
- Updated the shared helper copy in `unicorn-jump/src/haikuText.js` so the quest instructions and controls text now explain `press E or tap` instead of implying that contact alone is the intended UX.
- Kept a safety fallback in place: if the unicorn clearly passes above a creature without interacting, the quest still auto-starts so a five-year-old player cannot soft-lock the biome by missing the fox.
- Verification after the interaction pass:
  - `npm run build` passes.
  - Playwright verification against `http://localhost:3004` produced `output/web-game/help-prompt/shot-0.png` and matching state text showing the visible quest marker plus `helpPrompt: "Drift close to help"` before interaction.
  - A second Playwright burst with `Enter` produced `output/web-game/help-trigger/shot-0.png` and matching state text showing `quest.started: true` plus the Lantern Fox dialog, confirming the explicit help trigger works.

TODO:
- Decide whether the fallback auto-start on passing a creature should remain as a hidden safety net, or whether every biome should require explicit `E`/tap interaction now that the prompt is visible.

2026-03-15:
- Started the first real sprite implementation pass for `Lantern Bamboo Valley` instead of leaving the biome on blob-style placeholders.
- Added new SVG asset families under `unicorn-jump/public/assets/images/`:
  - `creature/lantern-fox/` with `idle`, `talk`, and `happy` variants in `front`, `left`, and `right` angles;
  - `companion/glow-fox/` with `hover`, `blink`, and `boost` variants in `front`, `left`, and `right` angles;
  - `collectible/lantern-seed-*` for idle/glow/collected states;
  - `effects/rescue-leaf-*` for fresh/catch/used states.
- Added `unicorn-jump/src/spriteCatalog.js` as the first runtime sprite registry:
  - maps Bamboo biome state to concrete SVG file paths;
  - picks creature angle/action from player position, dialog state, and quest completion;
  - picks collectible, companion, and rescue-leaf states with safe fallbacks to `null` for all non-Bamboo cases.
- Updated `unicorn-jump/src/Game.js` to use sprite assets when available and keep the existing procedural renderers as fallbacks elsewhere:
  - quest collectibles now render `<img>` assets for Bamboo seed items;
  - the Lantern Fox creature now renders from the sprite catalog;
  - rescue leaf uses sprite art when present;
  - companions use sprite art when a matching effect-specific asset exists.
- Verification after the first sprite pass:
  - `npm run build` passes.
  - Local dev server ran at `http://localhost:3005`.
  - Required Playwright web-game verification wrote artifacts to `unicorn-jump/output/web-game/`.
  - `unicorn-jump/output/web-game/shot-0.png` and matching `state-0.json` confirm the new Lantern Fox sprite and Lantern Seed collectible render in live gameplay with no captured console errors.

TODO:
- Verify quest-start and quest-complete sprite variants visually once the shared web-game client or a direct DOM Playwright flow can reliably trigger the `E`/tap interaction path in this DOM-based runtime.
- Verify the companion and rescue-leaf sprite states in a seeded progression scenario, since the default fresh run for biome 1 has no unlocked companion and does not naturally show the rescue leaf in the short smoke test.

2026-03-15:
- Refined the `Lantern Fox` sprite family after reviewing the first-pass art in gameplay and finding it too flat.
- Updated all 9 `unicorn-jump/public/assets/images/creature/lantern-fox/*.svg` variants (`idle/talk/happy` x `front/left/right`) with a deeper construction pass:
  - fur gradients instead of flat single-color fills;
  - layered forearms and paw caps instead of single oval limbs;
  - extra head/body shading and softer cheek highlights;
  - slightly richer tail lighting so the silhouette reads with more volume.
- Verification after the fox depth pass:
  - `npm run build` passes.
  - Playwright verification against `http://localhost:3006` produced `unicorn-jump/output/web-game/fox-depth-pass/shot-0.png` plus matching state text.
  - The updated gameplay capture confirms the Lantern Fox now reads with more depth and clearer limb separation at in-game size.

TODO:
- Apply the same depth treatment to the `glow-fox` companion set so the follower art matches the richer Lantern Fox construction.

2026-03-15:
- Added side-to-side moving platforms to the active `unicorn-jump/src/Game.js` loop.
- Difficulty now scales three platform traits together:
  - wider vertical spacing on harder settings;
  - wider horizontal travel on harder settings;
  - faster side-to-side platform movement on harder settings.
- Kept the start platform and goal platform stable so the run still begins centered under the unicorn and the top landing remains fair.
- Moving-platform implementation details:
  - each regular platform now gets its own randomized horizontal travel width, speed, and phase;
  - platform motion is deterministic from `timeMs`, so `window.advanceTime()` and text-state tests stay reliable;
  - creature and quest-item positions are resynced from their `platformId` anchors every frame so they ride along with moving platforms instead of floating out of place.
- Expanded `render_game_to_text` platform output with `id`, `moving`, `moveSpeed`, and `travelWidth` so automated checks can compare motion and spacing directly.
- Verification after the moving-platform pass:
  - `npm run build` passes cleanly.
  - Local dev server ran at `http://localhost:3005`.
  - Required Playwright web-game client rerun wrote final artifacts to `output/web-game/moving-platform-client-final/` with no captured errors.
  - Direct difficulty comparison artifacts are in `output/web-game/moving-platform-compare/`:
    - `gentle-start.png` shows the denser easier opening layout;
    - `adventurous-start.png` shows visibly wider starting gaps;
    - `comparison.json` recorded `spacingAverage: 100` for `gentle` versus `158` for `adventurous`;
    - the same comparison recorded much higher configured motion on harder platforms, with visible `moveSpeed` values around `91-126` in `adventurous` versus about `35-57` in `gentle`.

TODO:
- If moving platforms should feel harsher still, tune `adventurous` speeds upward again after a longer hands-on playtest instead of a 1-second automation sample.

2026-03-16:
- Added a short creature reaction animation to the live game:
  - creatures now enter a timed reaction state when the unicorn explicitly helps or talks to them;
  - that reaction drives a small hop arc and a happier expression/state;
  - Lantern Fox now switches to the happy sprite during that reaction window, while non-sprite creatures get a simple smile overlay during the hop.
- Added cleared-obstacle badges to the HUD:
  - when a flying obstruction bumps the unicorn and disappears, its sprite is added to a circular badge tray in the top-right corner;
  - the newest badge gets a brief glow/pop treatment so the collection is noticeable.
- Expanded the text-state output for testing:
  - creature state now reports `reacting` and `hopOffset`;
  - the HUD badge tray now reports `clearedObstacleBadges`.
- Main files touched for this pass:
  - `unicorn-jump/src/Game.js`
  - `unicorn-jump/src/spriteCatalog.js`
  - `unicorn-jump/src/creatureSystem.js`
- Verification after the creature-reaction and obstacle-badge pass:
  - `npm run build` passes.
  - Local dev server ran at `http://localhost:3008`.
  - Required Playwright client rerun wrote smoke artifacts to `output/web-game/creature-obstacle-client/`.
  - Focused deterministic browser verification wrote artifacts to `output/web-game/creature-obstacle-direct-final/`:
    - `creature-react-state.json` confirms `quest.started: true`, `creature.reacting: true`, and `hopOffset: 8` immediately after helping Lantern Fox in the landing scene;
    - `creature-react.png` captures the creature-reaction moment after the help interaction;
    - `obstacle-badge-state.json` confirms one cleared obstacle badge after a flyer collision in climb mode;
    - `obstacle-badge.png` shows the circular badge in the top-right HUD.

TODO:
- If the creature hop should read more strongly on large monitors, increase `CREATURE_REACTION_HOP_HEIGHT` or extend the happy reaction window slightly.

2026-03-16:
- Rebuilt `unicorn-jump/public/assets/images/character/unicorn_little.svg` as a more faithful front-facing SVG based on the original `unicorn_idle.png` proportions instead of the previous softer reinterpretation.
- Kept the older reinterpretation available in `unicorn-jump/public/assets/images/character/unicorn_little_alt.svg` as the alternate version.
- Faithful rebuild changes focused on the source sprite's actual read:
  - taller, sharper centered horn with explicit banding;
  - chunkier ear and wing silhouettes closer to the PNG;
  - tighter front-facing head/body stack instead of the earlier anime-ish shape drift;
  - pink crown + blue forelock split to match the original sprite's top read more closely;
  - simplified, larger facial masses so the eyes, muzzle, and cheeks stay readable at pointer size.
- Verification after the faithful SVG rebuild:
  - `xmllint --noout` passes for both `unicorn_little.svg` and `unicorn_little_alt.svg`.
  - `npm run build` passes.
  - Local dev server ran at `http://localhost:3011`.
  - Required shared Playwright client artifacts:
    - `unicorn-jump/output/web-game/unicorn-faithful-menu/shot-0.png` and matching `state-0.json` confirm the menu still loads with `mode: "menu"` and the SVG pointer on the selected world node.
    - `unicorn-jump/output/web-game/unicorn-faithful-compare/shot-0.png` provides a large side-by-side of the original PNG and rebuilt SVG for visual comparison.

TODO:
- If the user wants an even closer match, the next pass should trace the original player's exact eye tilt and mane silhouette more literally instead of further stylizing the front sprite.

2026-03-16:
- Finished the missing biome quest-giver sprite pass so all five worlds now resolve to real creature art instead of falling back to the procedural blob renderer.
- Added a reusable generator script at `unicorn-jump/scripts/generate_biome_creature_sprites.js` to output the remaining creature families with the same general stroke/gradient language as the existing fox and sheep sets.
- Generated and added 27 new SVG assets:
  - `unicorn-jump/public/assets/images/creature/story-gnome/`
  - `unicorn-jump/public/assets/images/creature/orchard-bird/`
  - `unicorn-jump/public/assets/images/creature/prairie-armadillo/`
  - each family includes `idle`, `talk`, and `happy` in `front`, `left`, and `right`.
- Updated `unicorn-jump/src/spriteCatalog.js` so creature sprite resolution is now data-driven across every biome:
  - Lantern Bamboo Valley -> Lantern Fox
  - Highland Meadow -> Meadow Sheep
  - Storybook Forest -> Story Gnome
  - Sun Orchard -> Orchard Bird
  - Bluebonnet Prairie -> Prairie Armadillo
- Verification after the all-biome creature pass:
  - `node unicorn-jump/scripts/generate_biome_creature_sprites.js` regenerated the new files successfully.
  - `xmllint --noout` passes on all newly generated creature SVGs.
  - `npm run build` passes.
  - Local dev server ran at `http://localhost:3012`.
  - Required shared Playwright client checks were run for all five world buttons, each starting from the live menu and entering the landing scene:
    - `unicorn-jump/output/web-game/all-biomes-creatures/lantern-bamboo/shot-0.png`
    - `unicorn-jump/output/web-game/all-biomes-creatures/highland-meadow/shot-0.png`
    - `unicorn-jump/output/web-game/all-biomes-creatures/storybook-forest/shot-0.png`
    - `unicorn-jump/output/web-game/all-biomes-creatures/sun-orchard/shot-0.png`
    - `unicorn-jump/output/web-game/all-biomes-creatures/bluebonnet-prairie/shot-0.png`
  - Matching `state-0.json` files confirm the correct biome/landing scene for each run.
  - Additional isolated Orchard Bird preview artifact:
    - `unicorn-jump/output/web-game/orchard-bird-preview/shot-0.png`
    - this confirmed the bird sprite itself is rendering correctly outside the landing HUD composition.

TODO:
- The Sun Orchard bird reads a little softer in the actual landing scene than the Story Gnome and Prairie Armadillo because the left-side UI/panel composition hides more of the sprite; if that still feels weak in play, either shift the landing creature a bit or raise the Orchard Bird artwork within its viewBox.

2026-03-16:
- Refined `unicorn-jump/public/assets/images/character/unicorn_little.svg` again after reviewing the first faithful rebuild against the original sprite and finding the horn and wings still too minimal.
- This second unicorn pass kept the approved body/face proportions but pushed the missing hero details:
  - replaced the horn's faceted crystal read with a taller rounded spiral cone and stronger stripe wrap;
  - widened both wings and added more feather mass, larger inner feathers, and brighter teal tip accents so the silhouette reads more like the original player art;
  - kept the rest of the unicorn stable so the refinement stayed focused instead of drifting the whole design again.
- Verification after the horn/wing refinement:
  - `xmllint --noout` passes for `unicorn-jump/public/assets/images/character/unicorn_little.svg`.
  - `npm run build` passes.
  - Local dev server ran at `http://localhost:3013`.
  - Required shared Playwright client artifacts:
    - `unicorn-jump/output/web-game/unicorn-detail-menu/shot-0.png` confirms the menu still uses the SVG pointer.
    - `unicorn-jump/output/web-game/unicorn-detail-compare/shot-0.png` shows the updated SVG beside the original PNG and was used to verify the horn/wing refinement visually.

TODO:
- If the next pass needs to go even closer to the source sprite, the biggest remaining gaps are the exact wing feather count/stacking and the softer rounded forehead/horn transition from the original PNG.

2026-03-16:
- Refined `unicorn-jump/public/assets/images/character/unicorn_little.svg` again after the user called out that the horn still was not reading as a real cone.
- This horn-focused pass changed the geometry rather than just adding detail:
  - rebuilt the horn with a clearer taper from a wider base to a narrower tip;
  - replaced the previous faceted/crystalline read with a rounded spiral-cone silhouette;
  - adjusted the spiral stripe paths so they wrap around the cone instead of reading like flat bands;
  - kept the widened wings from the prior pass because they were moving in the right direction.
- Verification after the horn-cone refinement:
  - `xmllint --noout` passes for `unicorn-jump/public/assets/images/character/unicorn_little.svg`.
  - `npm run build` passes.
  - Local dev server ran at `http://localhost:3013`.
  - Required shared Playwright client artifacts were refreshed:
    - `unicorn-jump/output/web-game/unicorn-detail-menu/shot-0.png`
    - `unicorn-jump/output/web-game/unicorn-detail-compare/shot-0.png`
  - The comparison artifact was used to verify that the horn now reads as a tapered spiral cone instead of a gem-like spike.

TODO:
- If the user wants another unicorn pass after this one, the next high-value refinement is the horn base/forehead transition and the exact wing feather stack count from the original PNG.

2026-03-16:
- Took another unicorn SVG pass because the previous horn still failed the user's conical-shape requirement.
- This pass changed the horn silhouette again:
  - replaced the rounded top silhouette with a true pointed apex;
  - pushed the sides into a clearer cone taper from tip to base;
  - kept the spiral wrap but let the cone shape drive the read first.
- Verification after the conical-horn pass:
  - `xmllint --noout` passes for `unicorn-jump/public/assets/images/character/unicorn_little.svg`.
  - `npm run build` passes.
  - Local dev server ran at `http://localhost:3014`.
  - Refreshed visual artifacts:
    - `unicorn-jump/output/web-game/unicorn-detail-menu/shot-0.png`
    - `unicorn-jump/output/web-game/unicorn-detail-compare/shot-0.png`
  - The updated comparison artifact shows a visibly pointed, tapered horn silhouette rather than the previous rounded form.

TODO:
- The next likely unicorn refinement, if requested, is smoothing the horn-to-forehead transition and rounding the horn body slightly without losing the cone silhouette.

2026-03-16:
- Reworked the world-map node composition in `unicorn-jump/src/App.js` so the menu reads as a true circular world selector instead of a packed horizontal cluster.
- Layout changes for this pass:
  - removed the hand-packed node positions and switched the five worlds to an even orbit around the center hub;
  - made the center travel button circular as well, so the map reads as a ring around a hub instead of stacked pills;
  - moved the control pad into its own side gutter and let the map surface become a square, which restored breathing room between worlds.
- Visual tuning:
  - reduced world-node sizes slightly so adjacent worlds no longer collide with each other or the hub;
  - kept the footer help text separate from the map so the circle stays visually clean.
- Verification after the circle-spacing pass:
  - `npm run build` passes.
  - Shared Playwright artifacts:
    - `unicorn-jump/output/web-game/world-circle-pass-1/shot-0.png` confirms the first circular orbit layout;
    - `unicorn-jump/output/web-game/world-circle-final/shot-0.png` confirms the final circular layout and spacing polish.

2026-03-16:
- Fixed the world-map menu layout clipping/overlap in `unicorn-jump/src/App.js`.
- Root cause:
  - the right-side world-map card had `minHeight: 520` plus `aspectRatio: 1.42 / 1`, which forced the card to be about `738px` wide;
  - that forced width overflowed the menu grid inside the `1140px` shell, so the settings button and map controls were rendered past the right edge and got clipped.
- Layout fix:
  - removed the width-forcing desktop aspect ratio and gave the world-map card a fixed height instead;
  - widened the outer menu shell slightly on desktop (`1240px` cap instead of `1140px`);
  - kept the map chrome in header/footer rows so the controls no longer sit on top of the interactive map surface.
- Verification after the fix:
  - `npm run build` passes.
  - Shared Playwright client artifacts:
    - `unicorn-jump/output/web-game/layout-overlap-before/shot-0.png` shows the clipped settings button and clipped right-side controls before the fix;
    - `unicorn-jump/output/web-game/layout-overlap-after-v2/shot-0.png` shows the corrected menu with the full settings button and full control pad visible.
  - Direct Playwright DOM checks confirmed the map panel now fits inside the shell at both `1280x720` and `1920x1440` viewports.

2026-03-16:
- Replaced the first-pass character obstruction emblems with full-body action-creature SVGs that read closer to the original bird/dragon obstacle personality:
  - `unicorn-jump/public/assets/images/obstacle/lantern-fox-ember.svg` is now a fox-drake flyer instead of a fox-face badge.
  - `unicorn-jump/public/assets/images/obstacle/meadow-sheep-cloud.svg` is now a winged ram/cloud creature with a real body and airborne pose.
  - `unicorn-jump/public/assets/images/obstacle/story-gnome-whirl.svg` is now a story-drake/page-wing creature instead of a flat icon.
  - `unicorn-jump/public/assets/images/obstacle/orchard-bird-burst.svg` now leans into the “Birds of War” direction with a more explicit armored war-bird silhouette.
  - `unicorn-jump/public/assets/images/obstacle/prairie-armadillo-roll.svg` is now a shell-runner creature with body, claws, and motion instead of a badge treatment.
- No runtime wiring changes were needed for this pass because `unicorn-jump/src/spriteCatalog.js` was already mapping biome obstacles to these SVG files.
- Verification after the obstruction redesign:
  - `xmllint --noout` passes on all five updated obstacle SVGs.
  - `npm run build` passes.
  - Required Playwright client rerun against `http://127.0.0.1:3007` wrote baseline artifacts to `unicorn-jump/output/web-game/obstacle-character-pass-client/`.
  - Focused deterministic browser verification wrote `unicorn-jump/output/web-game/obstacle-character-pass-live/shot-0.png` and matching `state-0.json`, which show the Lantern Bamboo Valley obstruction as a full-body flying creature on screen rather than a face-only badge.
- One pre-existing React style warning still appears during browser automation:
  - a shorthand/non-shorthand `border` warning in `Game.js` is logged during rerender, but it did not block this art verification pass.

2026-03-16:
- Reworked the live collectible art away from neutral seed/token shapes and toward the existing cute power-up direction:
  - `unicorn-jump/public/assets/images/collectible/lantern-seed-idle.svg`
  - `unicorn-jump/public/assets/images/collectible/lantern-seed-glow.svg`
  - `unicorn-jump/public/assets/images/collectible/lantern-seed-collected.svg`
  now render as glossy rainbow-heart pickups instead of brown/gold seed forms.
- Reworked the Highland Meadow collectible set:
  - `unicorn-jump/public/assets/images/collectible/meadow-song-idle.svg`
  - `unicorn-jump/public/assets/images/collectible/meadow-song-glow.svg`
  - `unicorn-jump/public/assets/images/collectible/meadow-song-collected.svg`
  now read as bright candy-crystal / rainbow-gem collectibles with a music-note treatment.
- Updated `unicorn-jump/src/Game.js` fallback quest-item renderer so unwired collectible types also skew cute and glossy instead of plain blobs or basic ovals:
  - `seed` now renders as a heart;
  - `song`, `star`, `sun-drop`, and the default fallback now use brighter gem/candy styling.
- Updated Lantern Bamboo Valley quest copy in `unicorn-jump/src/biomeManager.js` so the text matches the art direction:
  - the fox now asks for `lantern hearts`;
  - the quest label is now `lantern heart` / `lantern hearts`.
- Verification after the collectible art pass:
  - `xmllint --noout` passes on all updated collectible SVGs.
  - `npm run build` passes.
  - Required Playwright client rerun wrote smoke artifacts to `unicorn-jump/output/web-game/collectible-cute-pass-client/`.
  - Focused deterministic browser verification wrote:
    - `unicorn-jump/output/web-game/collectible-cute-pass/lantern-heart.png`
    - `unicorn-jump/output/web-game/collectible-cute-pass/lantern-heart.json`
    - `unicorn-jump/output/web-game/collectible-cute-pass/meadow-gem.png`
    - `unicorn-jump/output/web-game/collectible-cute-pass/meadow-gem.json`
  - These captures confirm the live gameplay now shows a rainbow heart pickup in biome 1 and a brighter gem-style pickup in biome 2.
- The same pre-existing React shorthand/non-shorthand border warning still appears during browser automation; no new runtime errors were introduced by this pass.

2026-03-16:
- Reworked the landing-scene world ground in `unicorn-jump/src/Game.js` so it no longer renders as a flat gradient slab.
- The landing floor now borrows the real platform art language:
  - the top edge is composed from tiled `earth-*.png` platform art instead of a plain CSS fill;
  - the underside is now a shaped painted cliff body with seam highlights, hanging strands, and hanging rock chunks so it reads more like a giant floating-island ledge.
- Added biome-aware ground color themes so the underside sits closer to each biome’s environment palette instead of one generic orange gradient.
- Verification after the landing-ground pass:
  - `npm run build` passes.
  - Required Playwright client rerun wrote a smoke screenshot to `unicorn-jump/output/web-game/landing-ground-pass-client/shot-0.png`.
  - Focused Sun Orchard verification wrote:
    - `unicorn-jump/output/web-game/landing-ground-pass/sun-orchard-landing.png`
  - `unicorn-jump/output/web-game/landing-ground-pass/sun-orchard-landing.json`
  - The updated capture confirms the bottom landing floor now visually matches the floating-platform family much more closely than the old gradient block.

2026-03-16:
- Adjusted world-map menu layering in `unicorn-jump/src/App.js` so biome world nodes render in front of the center start circle instead of sitting behind it.
- The world-node buttons now render at `z-index: 8/9`, while the center start circle renders at `z-index: 5`.
- Verification after the z-index fix:
  - `npm run build` passes.
  - Focused menu verification wrote:
    - `unicorn-jump/output/web-game/world-map-zindex-pass/menu.png`
  - `unicorn-jump/output/web-game/world-map-zindex-pass/state.json`
  - The captured state confirms `nodeZIndex: "8"` and `startZIndex: "5"`, and the screenshot shows the world nodes visually sitting above the center circle.

2026-03-16:
- Refined the SVG unicorn master in `unicorn-jump/public/assets/images/character/unicorn_little.svg` so it reads less like a soft blob and more like a designed vector character.
- Main shape changes:
  - replaced the rounded bubble-like horn with a narrower faceted cone silhouette;
  - added angled horn banding/highlights so the horn reads as a real tapered spiral form at small sizes;
  - reshaped the forelock into more articulated mane planes instead of a single rounded lump;
  - replaced the pill-shaped muzzle block with a more sculpted nose/mouth shape and clearer mouth line.
- Verification after the unicorn SVG refinement:
  - `xmllint --noout` passes on `unicorn_little.svg`.
  - `npm run build` passes.
  - Required Playwright client rerun wrote menu artifacts to `unicorn-jump/output/web-game/unicorn-svg-pass-client/shot-0.png`.
  - Focused large-format SVG verification wrote `unicorn-jump/output/web-game/unicorn-svg-pass/unicorn_little.png`, which clearly shows the horn and face refinements at readable scale.

2026-03-16:
- Reverted the active world-map pointer in `unicorn-jump/src/App.js` back to the original unicorn art direction instead of the alternate SVG reinterpretation.
- `MENU_POINTER_ASSET` now points to `unicorn-jump/public/assets/images/character/unicorn_idle.png`.
- Kept `unicorn-jump/public/assets/images/character/unicorn_little.svg` in the repo as the alternate version rather than deleting it.
- Verification after restoring the original pointer:
  - `npm run build` passes.
  - Required Playwright client rerun wrote `unicorn-jump/output/web-game/unicorn-pointer-original-pass/shot-0.png` and `state-0.json`.
  - The live menu capture confirms the map pointer is now the original unicorn sprite style again.

2026-03-16:
- Raised the art-direction bar after user feedback that the current images are acceptable as AI prototype art but not good enough for a five-year-old audience.
- Updated `unicorn-jump/ART_DESIGN_GUIDE.md` to explicitly treat the current art as prototype quality and add stronger approval criteria for:
  - character depth and tactile form;
  - memorable, child-friendly faces and silhouettes;
  - background scenes that feel magical and place-based instead of generic fantasy wallpaper;
  - AI usage as ideation/blockout support rather than a final-quality standard.
- Updated `unicorn-jump/ART_ROADMAP.md` to add a quality-reset phase and a benchmark-slice review gate:
  - no more scaling art volume until one biome is genuinely strong;
  - Lantern Bamboo Valley must become the benchmark final-quality slice before the rest of the world expands.

TODO:
- Do a full benchmark repaint plan for Lantern Bamboo Valley covering:
  - one final-quality background composition;
  - one final-quality NPC family;
  - one matching companion family;
  - one polished collectible/effects set;
  - one splash/map thumbnail for the biome.

2026-03-16:
- Added a standalone SVG unicorn master at `unicorn-jump/public/assets/images/character/unicorn_little.svg`.
- The new file is intentionally based on the existing player sprite direction in:
  - `unicorn-jump/public/assets/images/character/unicorn_idle.png`

2026-03-16:
- Addressed mobile/Fold usability after user feedback that the layout viewport felt oversized, the text was too intrusive, and gameplay space was too cramped on a Galaxy Fold-sized screen.
- Reworked the live game runtime in `unicorn-jump/src/Game.js` for responsive mobile metrics:
  - gameplay now reads the layout viewport from `window.visualViewport` when available;
  - player/platform/goal/quest-item/creature/obstacle sizes scale down on narrower screens instead of staying desktop-sized;
  - touch-space HUD switches to a compact top ribbon plus a small bottom helper chip instead of large desktop cards covering the playfield;
  - mobile-safe `100dvh` sizing is used for the game shell and overlays.
- Reworked the menu shell in `unicorn-jump/src/App.js` for responsive portrait devices:
  - the world picker now appears first on narrow/Fold-style screens instead of being pushed below a large text block;
  - stats collapse into short cards with far less copy;
  - the same compact treatment now applies to the unfolded portrait-sized Fold viewport as well.
- Simplified the copy in `unicorn-jump/src/haikuText.js` and related dialogs for early readers:
  - shorter menu prompts (`Pick a world`, `Tap play`);
  - simpler gameplay instructions (`Touch left or right`, `Tap friend to help`);
  - less abstract vocabulary (`Score`, `Best Score`, `Friends`, `Gate Closed`).
- Minor mobile polish:
  - `unicorn-jump/src/index.css` now sets `text-size-adjust: 100%` to avoid surprise mobile font inflation;
  - `unicorn-jump/src/Settings.js` uses `100dvh`-aware modal sizing.

Verification:
- `npm run build` passes after the responsive/mobile changes.
- Required Playwright smoke test reran successfully against `http://localhost:3006`:
  - artifacts: `unicorn-jump/output/web-game/fold-responsive-client/shot-0.png`, `shot-1.png`, and matching `state-1.json`.
- Direct mobile Playwright verification reran on two Fold-style viewport sizes:
  - cover-style viewport `344x882`: `unicorn-jump/output/playwright/post-fix-fold/cover-menu.png`, `cover-game.png`, `cover-touch.png`, `cover-state.json`;
  - inner portrait viewport `690x829`: `unicorn-jump/output/playwright/post-fix-fold/inner-menu.png`, `inner-game.png`, `inner-touch.png`, `inner-state.json`.
- The cover-sized state snapshot after the touch pass shows the reduced world scale and active touch-play layout:
  - `visiblePlatforms[0].width` is now `129` instead of the old `180` on the narrow viewport;
  - the helper prompt reports `helpPrompt: "Tap friend"` and the player remains in active play state after touch steering.

TODO:
- If more mobile polish is needed, consider shortening the world-node labels further on the smallest menu view so the side node names read more cleanly at thumbnail size.
  - `unicorn-jump/public/assets/images/character/unicorn_side_r.png`
- Design choices in the SVG master:
  - front-facing chibi proportions;
  - large gradient eyes and rounded snout like the current unicorn;
  - rainbow mane/tail, striped horn, and layered wings;
  - richer vector shading and highlights than the first-pass fox sprites.
- `xmllint --noout` passes on the SVG, so the file is well-formed.

TODO:
- If this unicorn SVG is approved, derive a matching SVG state set (`idle`, `jump`, `fall`, `left`, `right`) and optionally wire `Character.js` to support SVG player art alongside the current PNG sprites.

2026-03-16:
- Added a second global detail pass across the current SVG sprite families to push them closer to a "higher poly count" look without changing the core silhouettes.
- Updated `Lantern Fox` sprites (`unicorn-jump/public/assets/images/creature/lantern-fox/*.svg`) with:
  - forehead sparkle detail;
  - stronger chest separation;
  - paw highlight reads;
  - small surface accents that add more planes without making the forms noisy.
- Updated `glow-fox` companion sprites (`unicorn-jump/public/assets/images/companion/glow-fox/*.svg`) with:
  - forehead sparkle detail;
  - body and chest highlight mass;
  - extra small-form glow accents to make them read less flat.
- Updated collectibles and effects:
  - `unicorn-jump/public/assets/images/collectible/*.svg` now have stronger seed vein/rib detail and shell read;
  - `unicorn-jump/public/assets/images/effects/*.svg` now have fuller leaf-vein structure and more material separation.
- Updated `unicorn-jump/public/assets/images/character/unicorn_little.svg` with extra feather, mane, hoof, and sparkle detail so its refinement level stays above the supporting cast.
- Verification after the full detail pass:
  - `xmllint --noout` passes for all updated SVG files.
  - `npm run build` passes.
  - The required shared web-game client was run against `http://localhost:3007`, but its start-button click was blocked by an iframe intercept on this pass.
  - Direct Playwright fallback verification wrote artifacts to `unicorn-jump/output/web-game/detail-pass-direct/`.
  - `unicorn-jump/output/web-game/detail-pass-direct/shot-0.png` confirms the added fox and seed detail still reads cleanly in live gameplay.

TODO:
- If we keep pushing this direction, the next refinement tier should be scene art and platforms, not more micro-detail on the small sprites.

2026-03-16:
- Added biome-derived SVG obstruction art so flyers/hazards can match the creature families instead of using only the old generic obstacle PNG pool.
- New obstruction assets:
  - `unicorn-jump/public/assets/images/obstacle/lantern-fox-ember.svg`
  - `unicorn-jump/public/assets/images/obstacle/meadow-sheep-cloud.svg`
  - `unicorn-jump/public/assets/images/obstacle/story-gnome-whirl.svg`
  - `unicorn-jump/public/assets/images/obstacle/orchard-bird-burst.svg`
  - `unicorn-jump/public/assets/images/obstacle/prairie-armadillo-roll.svg`
- Added obstacle lookup support in `unicorn-jump/src/spriteCatalog.js` with `getObstacleSpriteAsset({ biomeId })`.
- Wired `unicorn-jump/src/Game.js` obstacle spawning to pass the active biome into the selector:
  - each biome now prefers its own SVG obstruction art;
  - the old `obstacle-*.png` files remain as fallback if a biome-specific SVG is missing.
- Verification after the obstruction pass:
  - `xmllint --noout` passes for the SVG obstruction files.
  - `npm run build` passes.
  - The required shared web-game client was rerun against `http://127.0.0.1:3007` and wrote a fresh screenshot to `unicorn-jump/output/web-game/obstacle-svg-pass/shot-0.png`.
  - Because persisted browser state landed that first capture on a completion overlay, direct Playwright fallback verification was used with localStorage cleared and deterministic stepping.
  - `unicorn-jump/output/web-game/obstacle-svg-direct/state-0.json` confirms an active Lantern Bamboo Valley obstacle in `visibleObstacles`.
  - `unicorn-jump/output/web-game/obstacle-svg-direct-framed/state-0.json` and `unicorn-jump/output/web-game/obstacle-svg-direct-center/state-0.json` confirm the active obstacle remained on screen during gameplay stepping.
  - A DOM inspection pass confirmed the live obstacle `<img>` was loading `/assets/images/obstacle/lantern-fox-ember.svg` with non-zero natural dimensions and visible positioning in gameplay.

TODO:
- The new obstruction art is wired and loading, but it still needs a dedicated visual polish pass so the on-screen read is stronger against the biome backgrounds.
- Add second and third obstruction variants per biome if we want more visual rotation instead of one signature obstruction per land.

2026-03-16:
- Added the first full Highland Meadow sprite family so level 2 no longer falls back to blob-style character rendering.
- New creature assets:
  - `unicorn-jump/public/assets/images/creature/meadow-sheep/idle-front.svg`
  - `unicorn-jump/public/assets/images/creature/meadow-sheep/idle-left.svg`
  - `unicorn-jump/public/assets/images/creature/meadow-sheep/idle-right.svg`
  - `unicorn-jump/public/assets/images/creature/meadow-sheep/talk-front.svg`
  - `unicorn-jump/public/assets/images/creature/meadow-sheep/talk-left.svg`
  - `unicorn-jump/public/assets/images/creature/meadow-sheep/talk-right.svg`
  - `unicorn-jump/public/assets/images/creature/meadow-sheep/happy-front.svg`
  - `unicorn-jump/public/assets/images/creature/meadow-sheep/happy-left.svg`
  - `unicorn-jump/public/assets/images/creature/meadow-sheep/happy-right.svg`
- New companion assets:
  - `unicorn-jump/public/assets/images/companion/wind-sheep/hover-front.svg`
  - `unicorn-jump/public/assets/images/companion/wind-sheep/hover-left.svg`
  - `unicorn-jump/public/assets/images/companion/wind-sheep/hover-right.svg`
  - `unicorn-jump/public/assets/images/companion/wind-sheep/blink-front.svg`
  - `unicorn-jump/public/assets/images/companion/wind-sheep/blink-left.svg`
  - `unicorn-jump/public/assets/images/companion/wind-sheep/blink-right.svg`
  - `unicorn-jump/public/assets/images/companion/wind-sheep/boost-front.svg`
  - `unicorn-jump/public/assets/images/companion/wind-sheep/boost-left.svg`
  - `unicorn-jump/public/assets/images/companion/wind-sheep/boost-right.svg`
- Added matching Highland Meadow quest collectible art:
  - `unicorn-jump/public/assets/images/collectible/meadow-song-idle.svg`
  - `unicorn-jump/public/assets/images/collectible/meadow-song-glow.svg`
  - `unicorn-jump/public/assets/images/collectible/meadow-song-collected.svg`
- Updated `unicorn-jump/src/spriteCatalog.js` so:
  - `Highland Sheep` resolves to the new `meadow-sheep` sprite set;
  - `Wind Sheep` resolves to the new `wind-sheep` companion set;
  - `meadow song` quest items resolve to their new collectible SVGs.
- Verification after the biome-2 sprite pass:
  - `xmllint --noout` passes for the new Meadow creature, companion, and collectible SVG files.
  - `npm run build` passes.
  - The required shared web-game client was rerun against `http://127.0.0.1:3007` with output in `unicorn-jump/output/web-game/meadow-shared-client/`.
  - Targeted Highland Meadow verification with forced journey state wrote artifacts to `unicorn-jump/output/web-game/meadow-sheep-pass/`.
  - `unicorn-jump/output/web-game/meadow-sheep-pass/dom-0.json` confirms the live page loaded:
    - `/assets/images/creature/meadow-sheep/idle-right.svg`
    - `/assets/images/companion/wind-sheep/hover-front.svg`
    - `/assets/images/collectible/meadow-song-idle.svg`
  - `unicorn-jump/output/web-game/meadow-sheep-pass/shot-0.png` shows the Highland Meadow landing scene with the new level 2 art family in play.

TODO:
- Repeat this same sprite-family replacement for Storybook Forest, Sun Orchard, and Bluebonnet Prairie so the remaining later biomes stop using procedural blob characters.

2026-03-16:
- Reworked the landing-screen world map in `unicorn-jump/src/App.js`:
  - the map stage is now landscape/wider instead of a mostly circular selector;
  - world nodes were pulled closer to the hub and tied together with a tighter route network;
  - the map surface got a more refined backdrop with route lines, soft terrain bands, and hub emphasis instead of the older concentric-circle presentation.
- Replaced the abstract selection cue with the SVG unicorn pointer using:
  - `unicorn-jump/public/assets/images/character/unicorn_little.svg`
- Added new menu/map interaction paths:
  - arrow keys move the selected world and the unicorn pointer;
  - tapping/clicking the map surface selects the nearest world;
  - on-screen directional pad buttons (`#map-control-up`, `#map-control-left`, `#map-control-right`, `#map-control-down`) move the pointer for touch-first play;
  - `Enter` or `Space` still starts the selected world from the menu.
- Added menu-state `render_game_to_text` + no-op `advanceTime` wiring in `App.js` so the menu can be exercised deterministically in browser automation as well as gameplay.
- Verification after the world-map control pass:
  - `npm run build` passes cleanly.
  - The required shared web-game client was rerun against `http://127.0.0.1:3007` with output in `unicorn-jump/output/web-game/menu-map-shared/`.
  - Targeted menu interaction verification wrote artifacts to `unicorn-jump/output/web-game/world-map-controls/`.
  - `unicorn-jump/output/web-game/world-map-controls/00-initial.json` confirms the menu starts on `Lantern Bamboo Valley`.
  - `unicorn-jump/output/web-game/world-map-controls/01-arrow-up.json` confirms arrow-key movement changes selection to `Storybook Forest`.
  - `unicorn-jump/output/web-game/world-map-controls/02-mouse-click.json` confirms clicking the map surface changes selection to `Bluebonnet Prairie`.
  - `unicorn-jump/output/web-game/world-map-controls/03-touch-pad.json` confirms the on-screen directional pad changes selection to `Sun Orchard`.
  - End-to-end start verification wrote artifacts to `unicorn-jump/output/web-game/world-map-start-flow/`.
  - `unicorn-jump/output/web-game/world-map-start-flow/menu-state.json` + `game-state.json` confirm selecting `Sun Orchard` on the map still launches `Sun Orchard` gameplay.
  - Final menu capture after the refactor is in `unicorn-jump/output/web-game/world-map-final/shot-0.png`.

TODO:
- If we keep pushing the landing screen, the next refinement should be richer authored map art per biome thumbnail and maybe gentle bob/float animation on the unicorn map pointer.

2026-03-16:
- Expanded the creature-quest loop so each biome now opens in a small explorable landing area before the vertical climb begins.
- Added biome-specific landing metadata in `unicorn-jump/src/biomeManager.js` for all five worlds:
  - landing platform name;
  - sky-gate name;
  - optional landmark name plus short landmark dialog.
- Reworked the live runtime in `unicorn-jump/src/Game.js` around a new scene phase model:
  - `sceneMode: "landing"` on first entry to a world;
  - `sceneMode: "climb"` after the player activates the gate.
- Landing-scene behavior:
  - the unicorn now starts on a large ground-level world platform instead of immediately beginning the bounce loop;
  - each landing area contains three interactables: the quest creature, a small world landmark, and a glowing gate into the jump section;
  - the player can walk left/right across the landing platform, inspect the landmark, start the creature quest there, and then enter the gate to begin the usual platform climb.
- Creature quest flow is now clearer and more world-like:
  - the fox/sheep/etc. can be met on the landing platform first;
  - starting the quest there unlocks the sky gate rather than forcing the first meeting to happen mid-climb;
  - once the gate is used, the existing floating-platform gameplay continues with the quest items and top goal still working as before.
- Added scene-aware UI/copy in `unicorn-jump/src/haikuText.js`:
  - the menu intro now mentions landing/exploring before jumping;
  - quest instructions and controls change when the player is in the landing scene versus the climb scene.
- Added new browser-text state output for the landing scene in `window.render_game_to_text`:
  - `sceneMode`;
  - `worldPlatform`;
  - `worldGate`;
  - `landmark`.
- Added a first-pass biome landmark renderer in `unicorn-jump/src/Game.js` so each landing scene has a simple themed interaction point instead of only text.
- Tuned the opening hierarchy after screenshot review:
  - the landmark was moved farther right so the creature quest reads as the first obvious interaction;
  - the landmark is still explorable, but it no longer steals the first `Enter` press from the fox.
- Verification after the landing-area pass:
  - `npm run build` passes after the scene-mode changes and again after the landmark-position polish.
  - Local dev server ran at `http://localhost:3010`.
  - Required shared Playwright client artifacts:
    - `unicorn-jump/output/web-game/world-platform-start-2/shot-0.png` and matching `state-0.json` confirm the opening `sceneMode: "landing"` state with the world platform, creature, landmark, and gate all exposed in text state.
    - `unicorn-jump/output/web-game/world-platform-help-2/shot-0.png` and matching `state-0.json` confirm the quest now starts on the landing platform after moving to the fox.
    - `unicorn-jump/output/web-game/world-platform-climb-2/shot-0.png` and matching `state-0.json` confirm using the gate switches the runtime into `sceneMode: "climb"` and resumes the old jump-platform gameplay.
    - `unicorn-jump/output/web-game/world-platform-landmark-2/shot-0.png` and matching `state-0.json` confirm the repositioned landmark still supports optional exploration dialog on the landing platform.

TODO:
- Decide whether each biome should eventually get a unique landing-platform geometry/layout instead of the shared left-creature / mid-landmark / right-gate composition.
- Consider adding one more landing-scene interaction per biome (for example a second prop or a home-village resident) if the user wants deeper exploration before the climb.

2026-03-16:
- Added a short creature reaction animation to the live game:
  - creatures now enter a timed reaction state when the unicorn explicitly helps or talks to them;
  - that reaction drives a small hop arc and a happier expression/state;
  - Lantern Fox now switches to the happy sprite during that reaction window, while non-sprite creatures get a simple smile overlay during the hop.
- Added cleared-obstacle badges to the HUD:
  - when a flying obstruction bumps the unicorn and disappears, its sprite is added to a circular badge tray in the top-right corner;
  - the newest badge gets a brief glow/pop treatment so the collection is noticeable.
- Expanded the text-state output for testing:
  - creature state now reports `reacting` and `hopOffset`;
  - the HUD badge tray now reports `clearedObstacleBadges`.
- Main files touched for this pass:
  - `unicorn-jump/src/Game.js`
  - `unicorn-jump/src/spriteCatalog.js`
  - `unicorn-jump/src/creatureSystem.js`
- Verification after the creature-reaction and obstacle-badge pass:
  - `npm run build` passes.
  - Local dev server ran at `http://localhost:3008`.
  - Required Playwright client rerun wrote smoke artifacts to `output/web-game/creature-obstacle-client/`.
  - Focused deterministic browser verification wrote artifacts to `output/web-game/creature-obstacle-direct-final/`:
    - `creature-react-state.json` confirms `quest.started: true`, `creature.reacting: true`, and `hopOffset: 8` immediately after helping Lantern Fox in the landing scene;
    - `creature-react.png` captures the creature-reaction moment after the help interaction;
    - `obstacle-badge-state.json` confirms one cleared obstacle badge after a flyer collision in climb mode;
    - `obstacle-badge.png` shows the circular badge in the top-right HUD.

TODO:
- If the creature hop should read more strongly on large monitors, increase `CREATURE_REACTION_HOP_HEIGHT` or extend the happy reaction window slightly.

2026-03-16:
- Added `unicorn-jump/LIVING_GARDEN_ROADMAP_P2.md` to record the new builder/decorator handoff as a dedicated roadmap for the Living Garden extension.
- Scoped that roadmap around a non-destructive integration plan:
  - keep the current exploration runtime;
  - add `world` and `room` modes as modular layers;
  - align proposed system and asset paths with the current `unicorn-jump/` repo layout instead of the generic handoff layout.
- Captured the immediate execution focus for this roadmap as Phase 2 interaction work:
  - drag and drop furniture;
  - 32px snapping;
  - forgiving room-decorator UX before save/load and unlock expansion.

2026-03-16:
- Started the first real `P2` runtime slice instead of leaving the builder track as docs only.
- Added isolated builder modules so the new work stays out of the exploration runtime:
  - `unicorn-jump/src/builderState.js`
  - `unicorn-jump/src/BuilderWorld.js`
  - `unicorn-jump/src/BuilderRoom.js`
- Wired new `App.js` screens for the `P2` flow:
  - `builderWorld` from a new `Build Garden` menu button;
  - `builderRoom` for entering a placed house interior;
  - builder-specific `window.render_game_to_text` / `window.advanceTime` hooks so the new screens are testable like the existing menu/game screens.
- Implemented the first commit-sized builder behavior:
  - 5x4 world grid;
  - one house type (`Cozy Cottage`);
  - tap empty tile to place a house;
  - tap occupied tile or house list entry to enter that room;
  - room shell with the 32px grid visually established for the next drag-and-snap pass.
- Verification after the `P2` phase-1 shell pass:
  - `npm run build` passes.
  - Local dev server ran at `http://localhost:3011`.
  - Required shared web-game client rerun wrote smoke artifacts to `unicorn-jump/output/web-game/p2-builder-world/`:
    - `shot-0.png` shows the new builder world screen;
    - `state-0.json` confirms `mode: "builder-world"` with a `5 x 4` grid.
  - Focused direct browser verification wrote artifacts to `unicorn-jump/output/web-game/p2-builder-room-flow/`:
    - `world-after-place.json` confirms placing the first house creates `Cozy Cottage 1` on `tile-0-0`;
    - `world-after-place.png` shows the occupied world tile after placement;
    - `room-state.json` confirms entering the room switches text state to `mode: "builder-room"`;
    - `room-shot.png` shows the new room shell with the starter tray and visible 32px layout grid.

TODO:
- Next `P2` commit should make the room tray real: drag `Moon Bed` and `Cloud Lamp` into the room and snap drops to the existing 32px grid.
- Keep builder persistence out of scope until after drag-and-snap feels right; save/load should remain a later `P2` phase.

2026-03-16:
- Committed to the next biome-roadmap gameplay chunk by making landing scenes less interchangeable instead of moving straight to another global system.
- Extended `unicorn-jump/src/biomeManager.js` so each biome landing area can now define:
  - unique creature / village / landmark / gate placement ratios;
  - one extra village-style interaction point with its own name, visual type, and dialog.
- Updated `unicorn-jump/src/Game.js` to use that landing metadata:
  - world-scene creation now positions each biome differently instead of using the same shared composition;
  - the player spawn point on the landing platform is biome-aware;
  - the new village prop is rendered, can be inspected with `E` or tap, and is exposed in `render_game_to_text`;
  - text state now reports `village` plus a `landingSet` list so screenshot checks can confirm the biome-specific set is present.
- First-pass village props added for all five current biomes:
  - Lantern Bamboo Valley: `Tea Table`
  - Highland Meadow: `Wool Cart`
  - Storybook Forest: `Mushroom House`
  - Sun Orchard: `Mirror Stand`
  - Bluebonnet Prairie: `Windmill Post`
- Verification after the biome-landing identity pass:
  - `npm run build` passes.
  - Local dev server ran at `http://127.0.0.1:3011`.
  - Required shared Playwright client verification wrote artifacts to `unicorn-jump/output/web-game/biome-roadmap-default/`:
    - `state-0.json` confirms Lantern Bamboo Valley now exposes `village: "Tea Table"` and `landingSet: ["Tea Table", "Lantern Stand", "Sky Lantern Gate"]`;
    - `shot-0.png` shows the new landing-side Tea Table prompt and dialog.
  - A second biome check wrote artifacts to `unicorn-jump/output/web-game/biome-roadmap-alt/`:
    - `state-0.json` confirms Highland Meadow now exposes `village: "Wool Cart"` and `landingSet: ["Wool Cart", "Stone Circle", "Breeze Arch"]`;
    - `shot-0.png` shows the meadow-specific landing composition instead of the exact same Lantern layout.

TODO:
- Next biome-roadmap chunk should give the new landing-side village props a small mechanic or world reaction, not just dialog, so Phase 2 identity lock starts affecting play as well as presentation.

2026-03-17:
- Completed the next `P2` builder commit by turning the room tray from a placeholder into a real drag-and-drop interaction.
- Extended `unicorn-jump/src/builderState.js` with the first reusable room-builder data helpers:
  - `Moon Bed` and `Cloud Lamp` furniture definitions;
  - snapped room-position calculation on the existing `32px` grid;
  - immutable helpers to place new furniture into a house room and move existing furniture later.
- Reworked `unicorn-jump/src/BuilderRoom.js` from a static shell into the actual `P2` interaction surface:
  - tray items now start pointer-based drags;
  - dropping inside the room creates furniture at snapped coordinates;
  - placed furniture can be grabbed and repositioned on the same grid;
  - the room highlight/ghost preview shows where the current drop will land.
- Updated the `builder-room` text state in `unicorn-jump/src/App.js` so automated/browser checks can verify more than just “room exists”:
  - coordinate-system metadata;
  - room `gridSize`;
  - tray contents;
  - placed furniture ids, names, types, snapped positions, and sizes.
- Verification after the `P2` drag-and-snap pass:
  - `npm run build` passes with no warnings.
  - Local dev server ran at `http://localhost:3012`.
  - Required shared web-game client smoke verification wrote artifacts to `unicorn-jump/output/web-game/p2-drag-smoke/`:
    - `shot-0.png` confirms the builder-world screen still opens cleanly from the menu;
    - `state-0.json` confirms the smoke pass still reports `mode: "builder-world"` with the expected `5 x 4` grid.
  - Focused direct browser verification wrote artifacts to `unicorn-jump/output/web-game/p2-drag-room-flow/`:
    - `after-bed.json` confirms dragging `Moon Bed` into the room lands it snapped at `x: 64`, `y: 96`;
    - `after-bed.png` shows the first placed bed item rendered inside the room;
    - `final-state.json` confirms the full end-to-end loop: `Moon Bed` remains at `64,96` and `Cloud Lamp` is placed then repositioned to `192,96`;
    - `final-shot.png` shows both furniture items visible and readable after the reposition pass.

TODO:
- Next `P2` commit should make furniture removal / replacement possible so kids can change their mind without refreshing the run.
- After that, the next high-value builder pass is simple builder persistence, but only once add/move/remove all feel obvious in one room.

2026-03-17:
- Re-examined sprite planning to account for the heavier world-building layer and the fact that the project now needs a quality ladder, not just a file-count checklist.
- Added `unicorn-jump/SPRITE_REFINEMENT_MATRIX.md` as the new planning overlay for sprite and world-art scope:
  - defines `Good`, `Better`, and `Best` quality tiers;
  - maps those tiers across the major asset families, including characters, companions, pickups, obstructions, platforms, landmarks, hub assets, backgrounds, and splash/map art;
  - clarifies which families must reach benchmark quality early versus which can temporarily ship at a lower tier.
- Updated `unicorn-jump/SPRITES.md` so it now explicitly acts as the baseline volume/variant checklist while the refinement matrix decides the quality target for each family.
- Updated `unicorn-jump/ART_ROADMAP.md` so Phase 0 now includes quality-tier planning and the roadmap rules explicitly use the `Good` / `Better` / `Best` matrix before world expansion scales further.
- No gameplay code changed and no build/test pass was needed, since this was a documentation and production-planning update only.

TODO:
- Turn the refinement matrix into a milestone tracker by biome so each region has a clear `Good` / `Better` / `Best` target for creatures, landmarks, props, platforms, and background layers.

2026-03-17:
- Corrected the sprite-planning follow-up after realizing the first `Good / Better / Best` document was a quality taxonomy, not a true production inventory.
- Added `unicorn-jump/SPRITE_PRODUCTION_INVENTORY.md` as the live asset-status document:
  - counts the real asset files currently on disk;
  - records what is actually wired into runtime today;
  - breaks coverage down biome by biome;
  - calls out the real missing layers, especially props, landmarks, gates, hub art, splash-map art, and bespoke parallax stacks.
- Updated `unicorn-jump/SPRITES.md` so it now points to both the live production inventory and the refinement matrix:
  - `SPRITES.md` = baseline variant checklist
  - `SPRITE_PRODUCTION_INVENTORY.md` = what exists / what is wired / what is missing
  - `SPRITE_REFINEMENT_MATRIX.md` = target quality tier
- Updated `unicorn-jump/ART_ROADMAP.md` so the roadmap now references live inventory status separately from the refinement-tier planning.
- No gameplay code changed and no build/test run was needed, since this was a docs and production-scope correction only.

TODO:
- Use `SPRITE_PRODUCTION_INVENTORY.md` to create the next real production board: one row per biome landmark, prop, gate, background stack, and hub-world package with named owners and finish targets.

2026-03-17:
- Expanded the sprite/world-art planning from static inventory into a concrete production roadmap with net-new asset packages and an import sequence.
- Added `unicorn-jump/ASSET_EXPANSION_ROADMAP.md`:
  - defines the real missing asset packages, not just categories;
  - lists shared packages such as the faithful SVG unicorn gameplay set, splash map package, hub package, biome platform kit, ground kit, and obstruction expansion set;
  - lists exact per-biome world packages with target file paths for backgrounds, props, landmarks, gates, thumbnails, and extra obstruction variants;
  - sequences the rollout through shared hero assets, benchmark biome, shared `Better` floor, hub bring-up, and final `Best` pass.
- Updated `unicorn-jump/SPRITES.md`, `unicorn-jump/SPRITE_PRODUCTION_INVENTORY.md`, and `unicorn-jump/ART_ROADMAP.md` so the planning stack is now clearly separated:
  - `SPRITES.md` = baseline variant checklist
  - `SPRITE_PRODUCTION_INVENTORY.md` = current live asset status
  - `SPRITE_REFINEMENT_MATRIX.md` = `Good` / `Better` / `Best` quality targets
  - `ASSET_EXPANSION_ROADMAP.md` = net-new packages and runtime bring-in order
- No gameplay code changed and no build/test pass was needed, since this was a production-planning update.

TODO:
- Turn the new roadmap into execution tickets starting with the faithful SVG unicorn gameplay sheet and the Lantern Bamboo Valley world package.

2026-03-17:
- Reworked the `P2` builder direction away from a single neutral `Cozy Cottage` and toward themed destination rooms.
- Expanded `unicorn-jump/src/builderState.js` so the builder now supports `8` house / room themes:
  - `Korean Garden Court`
  - `Fantasy Bavarian Castle`
  - `Spanish Palace Suite`
  - `MesoAmerican Pyramid`
  - `GrecoRoman Circus`
  - `Scandinavian Longhouse`
  - `Japanese Fortress`
  - `Babylonian Hanging Gardens`
- Each house type now carries:
  - its own palette;
  - label / short code;
  - themed room name and tagline;
  - per-theme room dimensions;
  - a theme id the room renderer can use for destination-specific shells.
- Updated `unicorn-jump/src/App.js` so builder mode now tracks the selected house type and passes it through placement:
  - builder-world text state now reports the selected house type;
  - builder-room text state now reports the active room theme;
  - placing a house now uses the selected themed type instead of a hardcoded cottage.
- Reworked `unicorn-jump/src/BuilderWorld.js`:
  - added a `House Styles` selector panel for the themed destinations;
  - updated world-builder copy to present house placement as choosing a wonder rather than dropping a generic cottage;
  - placed houses now display their theme abbreviations and the house list reports each room theme by name.
- Reworked `unicorn-jump/src/BuilderRoom.js` so the room shell is no longer a plain generic box:
  - added themed visual shells for Korean garden, Bavarian castle, Spanish palace, MesoAmerican pyramid, GrecoRoman circus, Scandinavian longhouse, Japanese fortress, and Babylonian hanging gardens;
  - room title and metadata now reflect the theme;
  - drag/drop still uses the same forgiving snap grid, but it now sits inside a themed destination scene.
- Updated `unicorn-jump/LIVING_GARDEN_ROADMAP_P2.md` so the builder roadmap now matches the runtime direction:
  - rooms are themed destinations, not neutral interiors;
  - Phase 2 now explicitly includes themed house selection and themed room shells;
  - the handoff now records the target destination list and the need for theme-matched furniture packs later.
- Verification after the themed builder pass:
  - `NODE_OPTIONS=--openssl-legacy-provider npm run build` passes.
  - Local dev server ran at `http://127.0.0.1:3013`.
  - Required shared web-game client smoke verification wrote artifacts to `unicorn-jump/output/web-game/p2-themed-builder-smoke/`:
    - `state-0.json` confirms builder world opens with `selectedHouseType: Korean Garden Court`;
    - `shot-0.png` / `shot-1.png` show the themed builder-world selector UI.
  - Focused direct browser verification wrote artifacts to `unicorn-jump/output/web-game/p2-themed-builder-direct/`:
    - `builder-world-japanese-selected.json` confirms selecting `Japanese Fortress` updates builder state;
    - `builder-world-after-place.json` confirms placing a house creates a `Japanese Fortress` house instead of a generic cottage;
    - `japanese-room.json` confirms entering that room reports `themeName: Castle Blossom Room`;
    - `babylonian-room.json` confirms a second placed house can open `themeName: Terrace of Vines`;
    - `japanese-room.png` and `babylonian-room.png` show the new themed room shells in the live builder.
  - Final targeted console/runtime-error check for the Japanese room flow returned `NO_ERRORS`.

TODO:
- The room shells now have destination identity, but the furniture tray is still generic. The next `P2` art pass should add theme-matched furniture packs or at least a few cross-theme decorative anchors so a Babylonian terrace is not furnished only with `Moon Bed` and `Cloud Lamp`.
- Consider a second pass on the room shells so more themes break the rectangular-room feel harder with terraces, balconies, arches, or layered foregrounds while preserving snap-grid clarity.

2026-03-17:
- Replaced the generic `Moon Bed` / `Cloud Lamp` builder tray with themed destination furniture.
- Expanded `unicorn-jump/src/builderState.js`:
  - added theme-aware furniture packs for all current destination rooms;
  - new movable object types now include gems, torches, fruit plates, recliners, wooden stools, tables, benches, screens, chests, lanterns, and hanging planters;
  - added `getFurnitureCatalogForTheme(themeId)` so each room only shows objects that fit its setting.
- Updated `unicorn-jump/src/App.js` builder-room text state so the reported tray contents are now filtered by the active room theme instead of always exposing the same generic list.
- Reworked `unicorn-jump/src/BuilderRoom.js`:
  - tray contents now switch per room theme;
  - added direct miniature art renderers for the new furniture/object categories so the tray no longer reuses the old bed/lamp silhouettes;
  - Japanese Fortress and Babylonian Hanging Gardens now surface clearly different tray objects in the live room UI.
- Updated `unicorn-jump/LIVING_GARDEN_ROADMAP_P2.md` so the documented starter objects now match the intended direction: gems, torches, fruit plates, recliners, wooden stools, and other period-matched furniture rather than generic placeholder room pieces.
- Verification after the themed furniture pass:
  - `NODE_OPTIONS=--openssl-legacy-provider npm run build` passes.
  - Local dev server ran at `http://127.0.0.1:3013`.
  - Required shared web-game client smoke verification wrote artifacts to `unicorn-jump/output/web-game/p2-themed-furniture-smoke/`.
  - Focused direct browser verification wrote artifacts to `unicorn-jump/output/web-game/p2-themed-furniture-direct/`:
    - `japanese-room.json` reports tray items `Paper Lantern`, `Lacquer Stool`, and `Blossom Screen`;
    - `babylonian-room.json` reports tray items `Garden Recliner`, `Royal Fruit Plate`, and `Hanging Vine Planter`;
    - matching `japanese-room.png` and `babylonian-room.png` show those tray objects visually in the live builder.
  - Final targeted browser error check again returned `NO_ERRORS`.

TODO:
- Add drag-placement verification for at least one new non-generic object type per theme so the new tray contents are tested beyond static room entry.
- Build out the remaining theme packs even further with more objects per destination once add/move/remove flow is complete.

2026-03-17:
- Added `Future Sky Dome` as a new themed destination in the `P2` builder.
- Updated `unicorn-jump/src/builderState.js`:
  - added the `Future Sky Dome` house type with short label `FD`;
  - added the `Nova Dome Lounge` room theme and matching palette / grid / shell colors;
  - added a theme-matched furniture pack for the new room: `Nova Gem Cluster`, `Halo Torch`, `Orbit Recliner`, and `Starlight Console`.
- Updated `unicorn-jump/src/BuilderRoom.js` with a new `future-sky-dome` room shell:
  - dome canopy
  - star lights
  - structural ribs
  - glowing consoles
- Updated `unicorn-jump/LIVING_GARDEN_ROADMAP_P2.md` so `Future Sky Domes` are now part of the destination-theme list and asset targets.
- Verification after the `Future Sky Dome` pass:
  - `NODE_OPTIONS=--openssl-legacy-provider npm run build` passes.
  - Local dev server ran at `http://127.0.0.1:3013`.
  - Required shared web-game client smoke verification wrote artifacts to `unicorn-jump/output/web-game/p2-future-sky-dome-smoke/` and confirmed the builder world still opens cleanly.
  - Focused direct browser verification wrote artifacts to `unicorn-jump/output/web-game/p2-future-sky-dome/`:
    - `future-selected.json` confirms the builder can select `Future Sky Dome`;
    - `future-placed.json` confirms placing a house creates `Future Sky Dome 1`;
    - `future-room.json` confirms entering that room reports `themeName: Nova Dome Lounge` and the themed tray contents `Nova Gem Cluster`, `Halo Torch`, `Orbit Recliner`, and `Starlight Console`;
    - `future-room.png` shows the live dome-themed room and tray.
  - Targeted browser error capture returned `NO_ERRORS`.

2026-03-17:
- Increased the visual priority of `P2` destination rooms so they occupy much more of the builder screen instead of feeling like a small inset panel.
- Updated `unicorn-jump/src/builderState.js` room dimensions across the themed house set:
  - rooms now default much larger, for example `Future Sky Dome` now opens at `512 x 320` and `Japanese Fortress` at `480 x 320`;
  - this increases usable decorating area and makes the room scene dominate the builder UI.
- Updated `unicorn-jump/src/BuilderRoom.js` layout:
  - widened the main panel;
  - reduced sidebar dominance;
  - stacked the sidebar below the room earlier on narrower widths;
  - trimmed wrapper padding so more of the room itself is visible.
- Verification after the larger-room pass:
  - `NODE_OPTIONS=--openssl-legacy-provider npm run build` passes.
  - Local dev server ran at `http://127.0.0.1:3013`.
  - Focused direct browser verification wrote artifacts to `unicorn-jump/output/web-game/p2-room-size-pass/`:
    - `future-room.json` confirms `Future Sky Dome` now reports `roomWidth: 512`, `roomHeight: 320`;
    - `japanese-room.json` confirms `Japanese Fortress` now reports `roomWidth: 480`, `roomHeight: 320`;
    - `future-room.png` and `japanese-room.png` show the room scenes taking up much more of the screen than the previous pass.
  - Targeted browser error capture returned `NO_ERRORS`.

TODO:
- If you want the room to feel even bigger than this, the next pass should move the sidebar into a collapsible drawer or bottom tray so the scene can take nearly the full panel width on desktop.

2026-03-17:
- Tightened the asset-governance rule so every active family must keep advancing through the quality matrix instead of stagnating once it becomes merely functional.
- Updated `unicorn-jump/SPRITE_REFINEMENT_MATRIX.md`:
  - added a universal advancement rule;
  - expanded the matrix to explicitly include builder houses, builder room shells, and builder furniture packs alongside the core gameplay sprite families.
- Updated `unicorn-jump/SPRITE_PRODUCTION_INVENTORY.md`:
  - added builder house-theme and builder furniture-definition counts to the live inventory snapshot;
  - added builder houses, room shells, and furniture packs to the global inventory matrix with current tier, target tier, and next-pass expectations;
  - added an explicit advancement rule section requiring every active family to have a current tier, target tier, and named next pass.
- Updated `unicorn-jump/ASSET_EXPANSION_ROADMAP.md` so the production roadmap now states that sprites, characters, houses, furniture, power-ups, map art, and hub art all need continuous movement through `Good` / `Better` / `Best`.
- Updated `unicorn-jump/LIVING_GARDEN_ROADMAP_P2.md`, `unicorn-jump/SPRITES.md`, and `unicorn-jump/ART_ROADMAP.md` so the same rule now applies to builder houses, room shells, furniture packs, and active gameplay families.
- No gameplay code changed and no build/test pass was needed, since this was a production-planning and governance update only.

2026-03-17:
- Expanded the planning docs again after the grouped matrices still felt too abstract.
- Added `unicorn-jump/ASSET_FAMILY_REGISTER.md` as the explicit all-families enforcement list:
  - one named row per tracked family;
  - covers gameplay unicorn, every quest giver, every companion, every pickup family, every obstruction family, world packages, every builder house, every builder room shell, and every builder furniture pack;
  - each row now has `current tier`, `target tier`, and `next pass`.
- Updated `unicorn-jump/SPRITES.md`, `unicorn-jump/SPRITE_PRODUCTION_INVENTORY.md`, `unicorn-jump/ASSET_EXPANSION_ROADMAP.md`, and `unicorn-jump/ART_ROADMAP.md` so the new register is now the explicit by-name source of truth when grouped package docs are not enough.
- No gameplay code changed and no build/test pass was needed, since this was a documentation and governance clarification only.

2026-03-17:
- Added a new late-biome SVG support batch so the current runtime no longer stops at the first two biomes for companions and quest pickups.
- Created `unicorn-jump/scripts/generate_support_sprites.js` to generate the missing SVG families in the same simplified style as the existing baseline sets:
  - companions:
    - `butterfly-spirit`
    - `songbird`
    - `firefly-friend`
  - collectibles:
    - `story-star`
    - `sun-drop`
    - `firefly`
- Ran the generator to write the new assets into `unicorn-jump/public/assets/images/companion/*` and `unicorn-jump/public/assets/images/collectible/*`.
- Updated `unicorn-jump/src/spriteCatalog.js` so the live game now resolves the new SVG sets for:
  - companion effects:
    - `leaf-bloom` -> `butterfly-spirit`
    - `joy-chime` -> `songbird`
    - `firefly-magnet` -> `firefly-friend`
  - biome quest items:
    - `storybook-forest` + `star` -> `story-star`
    - `sun-orchard` + `sun-drop` -> `sun-drop`
    - `bluebonnet-prairie` + `firefly` -> `firefly`
- Validation after the SVG support pass:
  - `xmllint --noout` passes across all newly generated SVG files.
  - `npm run build` passes.
  - Required shared web-game client smoke verification wrote artifacts to `unicorn-jump/output/web-game/support-sprites-smoke/`:
    - `shot-0.png` confirms the game still boots cleanly into the landing scene;
    - `state-0.json` confirms the normal landing-state text output remains intact after wiring the new sprite families.
  - Focused direct browser verification wrote artifacts to `unicorn-jump/output/web-game/support-sprites-biomes/`:
    - `storybook-forest.png` and `storybook-forest.json` confirm `Butterfly Spirit` plus `story-star` SVGs are live in the climb scene;
    - `sun-orchard.png` and `sun-orchard.json` confirm `Songbird` plus `sun-drop` SVGs are live in the climb scene;
    - `bluebonnet-prairie.png` and `bluebonnet-prairie.json` confirm `Firefly Friend` plus `firefly` SVGs are live in the climb scene;
    - `summary.json` records `matched.collectible: true` and `matched.companion: true` for all three later biomes.
- Browser verification also surfaced an existing React console warning in `Game.js` about mixing `border` shorthand with `borderBottomColor` / `borderBottomWidth` on rerender. This did not block the sprite pass, but it is still worth cleaning up separately.

TODO:
- Next SVG batch should cover later-biome obstacle art and more landing-scene prop/landmark sprite replacements so the support families stay ahead of gameplay rollout.
- Clean up the existing `Game.js` border shorthand warning during a non-art pass so browser verification output stays quieter.

2026-03-17:
- Took the next world-art runtime commit by replacing landing-scene placeholder JSX props/landmarks with real SVG assets.
- Added `unicorn-jump/scripts/generate_world_scene_sprites.js` to generate the current landing-scene world package for all five biomes:
  - village props:
    - `tea-table.svg`
    - `wool-cart.svg`
    - `mushroom-house.svg`
    - `mirror-stand.svg`
    - `windmill-post.svg`
  - landmarks:
    - `lantern-stand.svg`
    - `stone-circle.svg`
    - `story-tree.svg`
    - `citrus-arbor.svg`
    - `bluebonnet-patch.svg`
- Wrote those assets into the roadmap-aligned world folders under `unicorn-jump/public/assets/images/world/<biome>/{props,landmark}/`.
- Extended `unicorn-jump/src/spriteCatalog.js` with new world-scene asset lookups:
  - `getLandingVillageSpriteAsset`
  - `getWorldLandmarkSpriteAsset`
- Updated `unicorn-jump/src/Game.js` so landing scenes now render those new SVG files directly, while keeping the old inline shape renderers as fallbacks.
- Kept the existing reward/interaction behavior unchanged:
  - village prompt + reward glow still work;
  - landmark interaction text still works;
  - no gameplay/state logic changed.
- Validation after the landing-scene sprite pass:
  - `xmllint --noout` passes on all `10` new world-scene SVG files.
  - `npm run build` passes.
  - Required shared web-game client smoke verification wrote artifacts to `unicorn-jump/output/web-game/world-scene-smoke/`:
    - `shot-0.png` shows the live Lantern Bamboo landing with the new `Tea Table` and `Lantern Stand` art in place;
    - `state-0.json` confirms the normal landing scene still boots with the expected `village` / `landmark` text-state fields.
  - Focused direct browser verification wrote artifacts to `unicorn-jump/output/web-game/world-scene-assets/`:
    - one screenshot + JSON payload for each biome landing scene;
    - `summary.json` confirms all `5` biomes matched the expected `/assets/images/world/...` SVG paths for both the village prop and landmark;
    - the direct landing pass returned `errors: []` for every biome.

TODO:
- Next world-art runtime commit should externalize biome gate / portal art so the landing scenes stop mixing real village/landmark sprites with the old generic gate JSX.
- After that, the next clean visual identity pass is biome-specific platform / ground kits so the climb stack also stops feeling shared.

2026-03-17:
- Added `unicorn-jump/ASSET_INVENTORY.md` as the literal asset inventory:
  - exact on-disk asset families under `public/assets/images/`
  - runtime-defined builder house, room-shell, and furniture inventories from `src/builderState.js`
  - explicit missing packages for gates, background stacks, hub art, map art, and builder art packages
- Updated `unicorn-jump/SPRITE_PRODUCTION_INVENTORY.md` so the live inventory view is no longer stale:
  - added the `10` existing biome prop / landmark SVGs
  - corrected the builder runtime snapshot to include `9` room-shell themes
  - corrected the biome rows so props / landmarks are marked as discrete files while gates are still missing
- Updated `unicorn-jump/SPRITES.md` to point at the new literal inventory doc.
