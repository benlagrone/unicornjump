import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(
  '/Users/benjaminlagrone/.codex/skills/develop-web-game/scripts/web_game_playwright_client.js'
);
const { chromium } = require('playwright');

const url = process.argv[2] || 'http://127.0.0.1:3012';
const outDir =
  process.argv[3] ||
  path.resolve(
    '/Users/benjaminlagrone/Documents/projects/games/unicornjump/unicorn-jump/output/web-game/p2-room-npc-social-check'
  );

fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  args: ['--use-gl=angle', '--use-angle=swiftshader'],
});

const page = await browser.newPage({
  viewport: { width: 1440, height: 1180 },
});
page.setDefaultTimeout(7000);

const errors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') {
    errors.push({ type: 'console.error', text: msg.text() });
  }
});
page.on('pageerror', (err) => {
  errors.push({ type: 'pageerror', text: String(err) });
});

await page.addInitScript(() => {
  try {
    window.localStorage.clear();
  } catch (error) {
    // Ignore localStorage failures in automation.
  }
});

const getState = async () =>
  page.evaluate(() => {
    if (typeof window.render_game_to_text !== 'function') {
      return null;
    }
    const text = window.render_game_to_text();
    const parsed = text ? JSON.parse(text) : null;
    const runtime = window.__builderRoomRuntime || null;

    if (parsed?.npcs && runtime?.npcs) {
      parsed.npcs = parsed.npcs.map((npc, index) => ({
        ...npc,
        species: npc.species || runtime.npcs[index]?.species || null,
        accessory: npc.accessory || runtime.npcs[index]?.accessory || null,
      }));
    }

    return parsed;
  });

const capture = async (name) => {
  const state = await getState();
  fs.writeFileSync(path.join(outDir, `${name}.json`), JSON.stringify(state, null, 2));
  await page.screenshot({
    path: path.join(outDir, `${name}.png`),
    fullPage: true,
  });
  return state;
};

await page.goto(url, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(900);

await page.click('#builder-open-btn');
await page.waitForTimeout(400);

const firstTile = page.locator('button[id^="builder-world-tile-"]').first();
await firstTile.click({ force: true });
await page.waitForTimeout(250);
await firstTile.click({ force: true });
await page.waitForTimeout(450);

const initialState = await capture('initial');

await page.evaluate(async () => {
  if (typeof window.advanceTime === 'function') {
    await window.advanceTime(2200);
  }
});
await page.waitForTimeout(250);

let afterNearState = await capture('after-near');

if (afterNearState?.mode === 'builder-room' && afterNearState?.npcs?.length) {
  const guide = afterNearState.npcs[0];
  const stage = await page.locator('#builder-room-stage').boundingBox();

  if (guide && stage && afterNearState.house?.roomWidth && afterNearState.house?.roomHeight) {
    const scaleX = stage.width / afterNearState.house.roomWidth;
    const scaleY = stage.height / afterNearState.house.roomHeight;
    const targetX = stage.x + (guide.x + guide.width / 2) * scaleX;
    const targetY = stage.y + (guide.y + guide.height / 2) * scaleY;

    await page.mouse.click(targetX, targetY);
    await page.waitForTimeout(120);
    await page.evaluate(async () => {
      if (typeof window.advanceTime === 'function') {
        await window.advanceTime(2400);
      }
    });
    await page.waitForTimeout(250);
    afterNearState = await capture('after-near');
  }
}

const summary = {
  initialMode: initialState?.mode || null,
  initialActiveLine: initialState?.social?.activeLine || null,
  initialNpcArt: (initialState?.npcs || []).map((npc) => ({
    id: npc.id,
    species: npc.species || null,
    accessory: npc.accessory || null,
  })),
  afterNearActiveLine: afterNearState?.social?.activeLine || null,
  afterNearNearbyNpcIds: (afterNearState?.npcs || [])
    .filter((npc) => npc.nearPlayer)
    .map((npc) => npc.id),
  afterNearNpcArt: (afterNearState?.npcs || []).map((npc) => ({
    id: npc.id,
    species: npc.species || null,
    accessory: npc.accessory || null,
  })),
  playerMoodAfterNear: afterNearState?.player?.mood || null,
  playerSpeechAfterNear: afterNearState?.player?.speechText || null,
  errors,
};

fs.writeFileSync(path.join(outDir, 'summary.json'), JSON.stringify(summary, null, 2));

if (errors.length) {
  fs.writeFileSync(path.join(outDir, 'errors.json'), JSON.stringify(errors, null, 2));
}

await browser.close();
