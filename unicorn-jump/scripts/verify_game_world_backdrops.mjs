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
    '/Users/benjaminlagrone/Documents/projects/games/unicornjump/unicorn-jump/output/web-game/world-backdrop-pass-direct'
  );

const BIOMES = [
  { name: 'Lantern Bamboo Valley', slug: 'lantern-bamboo' },
  { name: 'Highland Meadow', slug: 'highland-meadow' },
  { name: 'Storybook Forest', slug: 'storybook-forest' },
  { name: 'Sun Orchard', slug: 'sun-orchard' },
  { name: 'Bluebonnet Prairie', slug: 'bluebonnet-prairie' },
];

fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  args: ['--use-gl=angle', '--use-angle=swiftshader'],
});

const summary = [];

for (const biome of BIOMES) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 980 },
  });
  page.setDefaultTimeout(8000);

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

  await page.locator(`button[aria-label="${biome.name}"]`).click({ force: true });
  await page.waitForTimeout(180);
  await page.locator('#start-btn').click({ force: true });
  await page.waitForTimeout(700);

  await page.evaluate(async () => {
    if (typeof window.advanceTime === 'function') {
      await window.advanceTime(1200);
    }
  });
  await page.waitForTimeout(240);

  const state = await page.evaluate(() => {
    if (typeof window.render_game_to_text !== 'function') {
      return null;
    }

    const text = window.render_game_to_text();
    return text ? JSON.parse(text) : null;
  });

  fs.writeFileSync(path.join(outDir, `${biome.slug}.json`), JSON.stringify(state, null, 2));
  await page.locator('#root').screenshot({
    path: path.join(outDir, `${biome.slug}.png`),
  });

  summary.push({
    biome: biome.name,
    slug: biome.slug,
    mode: state?.mode || null,
    sceneMode: state?.sceneMode || null,
    landingSet: state?.landingSet || null,
    landmark: state?.landmark?.name || null,
    village: state?.village?.name || null,
    errors,
  });

  await page.close();
}

fs.writeFileSync(path.join(outDir, 'summary.json'), JSON.stringify(summary, null, 2));

await browser.close();
