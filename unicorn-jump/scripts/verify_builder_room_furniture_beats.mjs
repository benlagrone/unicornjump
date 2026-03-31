import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(
  '/Users/benjaminlagrone/.codex/skills/develop-web-game/scripts/web_game_playwright_client.js'
);
const { chromium } = require('playwright');

const url = process.argv[2] || 'http://127.0.0.1:3017';
const outDir =
  process.argv[3] ||
  path.resolve(
    '/Users/benjaminlagrone/Documents/projects/games/unicornjump/unicorn-jump/output/web-game/p2-room-furniture-beats-direct'
  );

const CASES = [
  {
    themeName: 'Korean Garden Court',
    slug: 'korean-plate',
    trayId: 'persimmon-fruit-plate',
    expectedBeat: 'fruit-orbit',
    expectedBeatLabel: 'persimmon twinkle',
    width: 64,
    height: 64,
  },
  {
    themeName: 'Fantasy Bavarian Castle',
    slug: 'bavarian-chest',
    trayId: 'carved-chest',
    expectedBeat: 'story-chime',
    expectedBeatLabel: 'story chime',
    width: 96,
    height: 64,
  },
  {
    themeName: 'Spanish Palace Suite',
    slug: 'spanish-bench',
    trayId: 'tile-bench',
    expectedBeat: 'bench-thrum',
    expectedBeatLabel: 'courtyard thrum',
    width: 96,
    height: 64,
  },
  {
    themeName: 'MesoAmerican Pyramid',
    slug: 'meso-stool',
    trayId: 'stone-stool',
    expectedBeat: 'stool-hop',
    expectedBeatLabel: 'stone hop',
    width: 64,
    height: 64,
  },
  {
    themeName: 'Future Sky Dome',
    slug: 'future-recliner',
    trayId: 'orbit-recliner',
    expectedBeat: 'orbit-drift',
    expectedBeatLabel: 'orbit drift',
    width: 128,
    height: 64,
  },
];

fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  args: ['--use-gl=angle', '--use-angle=swiftshader'],
});

const readState = async (page) =>
  page.evaluate(() => {
    if (typeof window.render_game_to_text !== 'function') {
      return null;
    }
    const text = window.render_game_to_text();
    return text ? JSON.parse(text) : null;
  });

const advance = async (page, ms) => {
  await page.evaluate((stepMs) => {
    if (typeof window.advanceTime === 'function') {
      return window.advanceTime(stepMs);
    }
    return null;
  }, ms);
  await page.waitForTimeout(120);
};

const summary = [];

for (const testCase of CASES) {
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

  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(900);
  await page.click('#builder-open-btn');
  await page.waitForTimeout(400);

  await page.locator('button').filter({ hasText: testCase.themeName }).first().click({ force: true });
  await page.waitForTimeout(250);

  const firstTile = page.locator('button[id^="builder-world-tile-"]').first();
  await firstTile.click({ force: true });
  await page.waitForTimeout(250);
  await firstTile.click({ force: true });
  await page.waitForTimeout(500);

  let state = await readState(page);
  const guide = state?.npcs?.find((npc) => npc.id === 'npc-guide') || state?.npcs?.[0] || null;
  const roomStage = page.locator('#builder-room-stage');
  const roomBox = await roomStage.boundingBox();

  if (!state || !guide || !roomBox) {
    summary.push({
      themeName: testCase.themeName,
      slug: testCase.slug,
      success: false,
      reason: 'missing-state-or-guide',
      errors,
    });
    await page.close();
    continue;
  }

  const scaleX = roomBox.width / state.house.roomWidth;
  const scaleY = roomBox.height / state.house.roomHeight;
  const guideRoomX = guide.x + guide.width * 0.75;
  const guideRoomY = guide.y + guide.height * 0.7;

  await page.mouse.click(
    roomBox.x + guideRoomX * scaleX,
    roomBox.y + guideRoomY * scaleY
  );
  await advance(page, 900);

  state = await readState(page);

  const trayButton = page.locator(`#builder-tray-${testCase.trayId}`);
  const trayBox = await trayButton.boundingBox();
  if (!trayBox) {
    summary.push({
      themeName: testCase.themeName,
      slug: testCase.slug,
      success: false,
      reason: 'missing-tray-button',
      errors,
    });
    await page.close();
    continue;
  }

  const dropRoomX = Math.min(
    Math.max(guide.x + 24, 20),
    state.house.roomWidth - testCase.width - 20
  );
  const dropRoomY = Math.min(
    Math.max(guide.y + 6, Math.round(state.house.roomHeight * 0.54)),
    state.house.roomHeight - testCase.height - 18
  );
  const dropClientX = roomBox.x + (dropRoomX + testCase.width / 2) * scaleX;
  const dropClientY = roomBox.y + (dropRoomY + testCase.height / 2) * scaleY;

  const startClientX = trayBox.x + trayBox.width / 2;
  const startClientY = trayBox.y + trayBox.height / 2;

  await trayButton.dispatchEvent('pointerdown', {
    pointerId: 1,
    button: 0,
    buttons: 1,
    clientX: startClientX,
    clientY: startClientY,
  });
  await page.waitForTimeout(80);

  for (const step of [0.35, 0.68, 1]) {
    await page.evaluate(
      ({ clientX, clientY }) => {
        window.dispatchEvent(new PointerEvent('pointermove', {
          pointerId: 1,
          bubbles: true,
          clientX,
          clientY,
          buttons: 1,
        }));
      },
      {
        clientX: startClientX + (dropClientX - startClientX) * step,
        clientY: startClientY + (dropClientY - startClientY) * step,
      }
    );
    await page.waitForTimeout(60);
  }

  await page.evaluate(
    ({ clientX, clientY }) => {
      window.dispatchEvent(new PointerEvent('pointerup', {
        pointerId: 1,
        bubbles: true,
        clientX,
        clientY,
        button: 0,
      }));
    },
    { clientX: dropClientX, clientY: dropClientY }
  );
  await advance(page, 900);

  const after = await readState(page);
  const reactiveItem =
    (after?.reactiveFurniture || []).find((item) => item.typeId === testCase.trayId)
    || (after?.reactiveFurniture || [])[0]
    || null;

  fs.writeFileSync(
    path.join(outDir, `${testCase.slug}.json`),
    JSON.stringify(after, null, 2)
  );
  await page.screenshot({
    path: path.join(outDir, `${testCase.slug}.png`),
    fullPage: true,
  });

  summary.push({
    themeName: testCase.themeName,
    slug: testCase.slug,
    expectedBeat: testCase.expectedBeat,
    expectedBeatLabel: testCase.expectedBeatLabel,
    actualBeat: reactiveItem?.beat || null,
    actualBeatLabel: reactiveItem?.beatLabel || null,
    reactingTo: reactiveItem?.speaker || null,
    reactiveFurnitureCount: after?.reactiveFurniture?.length || 0,
    success:
      reactiveItem?.beat === testCase.expectedBeat
      && reactiveItem?.beatLabel === testCase.expectedBeatLabel,
    errors,
  });

  await page.close();
}

fs.writeFileSync(path.join(outDir, 'summary.json'), JSON.stringify(summary, null, 2));

await browser.close();
