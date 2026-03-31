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
    '/Users/benjaminlagrone/Documents/projects/games/unicornjump/unicorn-jump/output/web-game/p2-room-npc-art-direct'
  );

const THEMES = [
  { name: 'Korean Garden Court', slug: 'korean-garden' },
  { name: 'Fantasy Bavarian Castle', slug: 'bavarian-castle' },
  { name: 'Spanish Palace Suite', slug: 'spanish-palace' },
  { name: 'MesoAmerican Pyramid', slug: 'mesoamerican-pyramid' },
  { name: 'GrecoRoman Circus', slug: 'grecoroman-circus' },
  { name: 'Scandinavian Longhouse', slug: 'scandinavian-longhouse' },
  { name: 'Japanese Fortress', slug: 'japanese-fortress' },
  { name: 'Babylonian Hanging Gardens', slug: 'babylonian-hanging-gardens' },
  { name: 'Future Sky Dome', slug: 'future-sky-dome' },
];

fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  args: ['--use-gl=angle', '--use-angle=swiftshader'],
});

const summary = [];

for (const theme of THEMES) {
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

  await page.locator('button').filter({ hasText: theme.name }).first().click({ force: true });
  await page.waitForTimeout(250);

  const firstTile = page.locator('button[id^="builder-world-tile-"]').first();
  await firstTile.click({ force: true });
  await page.waitForTimeout(250);
  await firstTile.click({ force: true });
  await page.waitForTimeout(450);

  const state = await page.evaluate(() => {
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

  fs.writeFileSync(path.join(outDir, `${theme.slug}.json`), JSON.stringify(state, null, 2));
  await page.screenshot({
    path: path.join(outDir, `${theme.slug}.png`),
    fullPage: true,
  });

  summary.push({
    theme: theme.name,
    slug: theme.slug,
    roomTheme: state?.house?.themeName || null,
    playerMood: state?.player?.mood || null,
    trayCount: state?.tray?.length || 0,
    traySample: (state?.tray || []).slice(0, 6),
    npcCount: state?.npcs?.length || 0,
    npcArt: (state?.npcs || []).map((npc) => ({
      id: npc.id,
      species: npc.species || null,
      accessory: npc.accessory || null,
    })),
    npcSpeech: (state?.npcs || []).map((npc) => ({
      id: npc.id,
      speechText: npc.speechText,
    })),
    uniqueSpeciesCount: new Set((state?.npcs || []).map((npc) => npc.species).filter(Boolean)).size,
    errors,
  });

  await page.close();
}

fs.writeFileSync(path.join(outDir, 'summary.json'), JSON.stringify(summary, null, 2));

await browser.close();
