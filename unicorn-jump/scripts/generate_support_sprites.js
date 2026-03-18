const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const imageRoot = path.join(projectRoot, 'public/assets/images');

const writeSprite = (folder, filename, svg) => {
  const outputPath = path.join(imageRoot, folder, filename);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${svg.trim()}\n`);
};

const wrapSvg = (defs, body) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  ${defs}
  ${body}
</svg>
`;

const mirror = (body) => `<g transform="translate(64 0) scale(-1 1)">${body}</g>`;

const butterflyDefs = `
<defs>
  <linearGradient id="butterfly-wing-top" x1=".18" y1=".14" x2=".88" y2=".88">
    <stop offset="0" stop-color="#ffd2f1"/>
    <stop offset=".48" stop-color="#d3a7ff"/>
    <stop offset="1" stop-color="#7c71ff"/>
  </linearGradient>
  <linearGradient id="butterfly-wing-bottom" x1=".22" y1=".18" x2=".86" y2=".92">
    <stop offset="0" stop-color="#fff0a4"/>
    <stop offset=".42" stop-color="#aaf6cb"/>
    <stop offset="1" stop-color="#7cd6ff"/>
  </linearGradient>
  <linearGradient id="butterfly-body" x1=".5" y1="0" x2=".5" y2="1">
    <stop offset="0" stop-color="#5d4b9b"/>
    <stop offset="1" stop-color="#2d245e"/>
  </linearGradient>
  <radialGradient id="butterfly-glow" cx=".5" cy=".36" r=".82">
    <stop offset="0" stop-color="#fffaf6"/>
    <stop offset=".54" stop-color="#ffdbf7" stop-opacity=".72"/>
    <stop offset="1" stop-color="#ffdbf7" stop-opacity="0"/>
  </radialGradient>
</defs>
`;

const butterflyEyes = (action, side = false) => {
  if (action === 'blink') {
    return side
      ? '<path d="M34 31c2-1.7 4-1.7 6 0" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/>'
      : `
        <path d="M25 31c2-1.8 4.2-1.8 6.2 0" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M33 31c2-1.8 4.2-1.8 6.2 0" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/>
      `;
  }

  return side
    ? `
      <ellipse cx="37" cy="31" rx="1.8" ry="2.4" fill="#ffffff"/>
      <circle cx="37.4" cy="30.2" r=".55" fill="#23324d"/>
    `
    : `
      <ellipse cx="27.6" cy="31" rx="1.7" ry="2.4" fill="#ffffff"/>
      <ellipse cx="36.4" cy="31" rx="1.7" ry="2.4" fill="#ffffff"/>
      <circle cx="28" cy="30.2" r=".55" fill="#23324d"/>
      <circle cx="36.8" cy="30.2" r=".55" fill="#23324d"/>
    `;
};

const butterflyFront = (action) => {
  const upperLeft =
    action === 'boost'
      ? 'M29 18c-10-6-20-5-24 3 6 8 17 11 29 11-4-4-6-8-5-14z'
      : 'M28 18c-10-8-20-8-24 1 4 10 16 14 29 15-4-4-6-8-5-16z';
  const upperRight =
    action === 'boost'
      ? 'M35 18c10-6 20-5 24 3-6 8-17 11-29 11 4-4 6-8 5-14z'
      : 'M36 18c10-8 20-8 24 1-4 10-16 14-29 15 4-4 6-8 5-16z';
  const lowerLeft =
    action === 'boost'
      ? 'M27 32c-9 1-15 6-16 13 8 3 16 1 23-5-4-2-6-4-7-8z'
      : 'M27 34c-9 2-14 7-14 13 8 3 15 1 22-5-4-2-6-4-8-8z';
  const lowerRight =
    action === 'boost'
      ? 'M37 32c9 1 15 6 16 13-8 3-16 1-23-5 4-2 6-4 7-8z'
      : 'M37 34c9 2 14 7 14 13-8 3-15 1-22-5 4-2 6-4 8-8z';
  const sparkle =
    action === 'boost'
      ? '<path d="M51 18l1.9 2.8-1.9 2.8-1.9-2.8zM14 22l1.7 2.5-1.7 2.5-1.7-2.5z" fill="#fff9ff" opacity=".88"/>'
      : '<circle cx="48.5" cy="19" r="1.7" fill="#fff9ff" opacity=".82"/>';

  return wrapSvg(
    butterflyDefs,
    `
    <ellipse cx="32" cy="56" rx="12" ry="4" fill="#d4b8ff" opacity=".24"/>
    <circle cx="32" cy="28" r="18" fill="url(#butterfly-glow)" opacity="${action === 'boost' ? '.95' : '.72'}"/>
    <path d="${upperLeft}" fill="url(#butterfly-wing-top)" stroke="#6857a6" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="${upperRight}" fill="url(#butterfly-wing-top)" stroke="#6857a6" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="${lowerLeft}" fill="url(#butterfly-wing-bottom)" stroke="#5caac8" stroke-width="2" stroke-linejoin="round"/>
    <path d="${lowerRight}" fill="url(#butterfly-wing-bottom)" stroke="#5caac8" stroke-width="2" stroke-linejoin="round"/>
    <path d="M32 20c-4 0-6 3-6 8v8c0 6 2.2 10.5 6 13.8 3.8-3.3 6-7.8 6-13.8v-8c0-5-2-8-6-8z" fill="url(#butterfly-body)" stroke="#1b1735" stroke-width="2"/>
    <path d="M29 19c-1.5-4.3-3.8-6.4-7-8.5M35 19c1.5-4.3 3.8-6.4 7-8.5" fill="none" stroke="#4b3d79" stroke-width="2" stroke-linecap="round"/>
    <circle cx="23.2" cy="10.2" r="1.7" fill="#ffd7f3"/>
    <circle cx="40.8" cy="10.2" r="1.7" fill="#ffd7f3"/>
    ${butterflyEyes(action)}
    <path d="M29 36c1.8 1.6 4.2 1.6 6 0" fill="none" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" opacity=".88"/>
    <ellipse cx="32" cy="44" rx="4.6" ry="2" fill="#ffffff" opacity=".16"/>
    ${sparkle}
    `
  );
};

const butterflySideBase = (action) => {
  const backWing =
    action === 'boost'
      ? 'M22 20c-12-6-18 1-16 11 9 3 18 2 26-2-5-2-8-5-10-9z'
      : 'M22 20c-13-8-19 0-17 10 9 5 18 5 26 1-5-2-8-5-9-11z';
  const frontWing =
    action === 'boost'
      ? 'M30 24c-7-4-11 2-10 9 7 2 13 1 18-2-3-1-6-3-8-7z'
      : 'M30 24c-8-5-12 2-11 9 7 3 13 2 19-2-4-1-6-3-8-7z';
  const lowerWing =
    action === 'boost'
      ? 'M25 33c-9 2-13 8-11 14 7 2 13 0 19-5-4-2-6-4-8-9z'
      : 'M25 34c-9 3-12 9-10 14 7 2 13 0 19-5-4-2-6-4-9-9z';
  const sparkle =
    action === 'boost'
      ? '<path d="M50 20l1.8 2.5-1.8 2.5-1.8-2.5z" fill="#fff9ff" opacity=".84"/>'
      : '';

  return `
    <ellipse cx="31" cy="56" rx="12" ry="4" fill="#d4b8ff" opacity=".22"/>
    <circle cx="30" cy="29" r="16" fill="url(#butterfly-glow)" opacity="${action === 'boost' ? '.92' : '.68'}"/>
    <path d="${backWing}" fill="url(#butterfly-wing-top)" stroke="#6857a6" stroke-width="2.1" stroke-linejoin="round"/>
    <path d="${frontWing}" fill="#f9c2f1" stroke="#8d79cf" stroke-width="2" stroke-linejoin="round"/>
    <path d="${lowerWing}" fill="url(#butterfly-wing-bottom)" stroke="#5caac8" stroke-width="2" stroke-linejoin="round"/>
    <path d="M31 21c-4 0-6.2 3.4-6.2 8.8 0 7 2.8 12.6 7.2 17 3.8-3.5 5.8-8.8 5.8-15.5 0-6.7-2.4-10.3-6.8-10.3z" fill="url(#butterfly-body)" stroke="#1b1735" stroke-width="2"/>
    <path d="M31 20c-1.4-4.3-3.2-6.5-6.2-8.9" fill="none" stroke="#4b3d79" stroke-width="2" stroke-linecap="round"/>
    <circle cx="24.6" cy="10.2" r="1.7" fill="#ffd7f3"/>
    ${butterflyEyes(action, true)}
    <path d="M35 36c1.7 1.4 3.3 1.4 5 0" fill="none" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" opacity=".88"/>
    ${sparkle}
  `;
};

const butterflySide = (action, angle) =>
  wrapSvg(butterflyDefs, angle === 'left' ? butterflySideBase(action) : mirror(butterflySideBase(action)));

const birdCompanionDefs = `
<defs>
  <radialGradient id="songbird-body" cx=".34" cy=".24" r=".92">
    <stop offset="0" stop-color="#ffe8bf"/>
    <stop offset=".54" stop-color="#ffb562"/>
    <stop offset="1" stop-color="#ef7f2a"/>
  </radialGradient>
  <linearGradient id="songbird-wing" x1=".18" y1=".12" x2=".86" y2=".88">
    <stop offset="0" stop-color="#fff2b8"/>
    <stop offset=".55" stop-color="#ffc85c"/>
    <stop offset="1" stop-color="#f0872c"/>
  </linearGradient>
  <linearGradient id="songbird-belly" x1=".5" y1="0" x2=".5" y2="1">
    <stop offset="0" stop-color="#fffef8"/>
    <stop offset="1" stop-color="#ffe7b8"/>
  </linearGradient>
  <linearGradient id="songbird-beak" x1=".3" y1="0" x2=".8" y2="1">
    <stop offset="0" stop-color="#fff5a8"/>
    <stop offset=".58" stop-color="#ffc54d"/>
    <stop offset="1" stop-color="#e89018"/>
  </linearGradient>
  <radialGradient id="songbird-glow" cx=".5" cy=".34" r=".8">
    <stop offset="0" stop-color="#fff8db"/>
    <stop offset=".6" stop-color="#ffe29c" stop-opacity=".54"/>
    <stop offset="1" stop-color="#ffe29c" stop-opacity="0"/>
  </radialGradient>
</defs>
`;

const songbirdEyes = (action, side = false) => {
  if (action === 'blink') {
    return side
      ? '<path d="M37 29c1.8-1.6 3.5-1.6 5.2 0" fill="none" stroke="#203046" stroke-width="1.9" stroke-linecap="round"/>'
      : `
        <path d="M27 29c2-1.8 4.1-1.8 6.1 0" fill="none" stroke="#203046" stroke-width="1.9" stroke-linecap="round"/>
        <path d="M35 29c2-1.8 4.1-1.8 6.1 0" fill="none" stroke="#203046" stroke-width="1.9" stroke-linecap="round"/>
      `;
  }

  return side
    ? `
      <ellipse cx="39" cy="29" rx="1.7" ry="2.2" fill="#203046"/>
      <circle cx="39.5" cy="28.2" r=".5" fill="#fff"/>
    `
    : `
      <ellipse cx="29.2" cy="29" rx="1.6" ry="2.2" fill="#203046"/>
      <ellipse cx="38.8" cy="29" rx="1.6" ry="2.2" fill="#203046"/>
      <circle cx="29.6" cy="28.2" r=".5" fill="#fff"/>
      <circle cx="39.2" cy="28.2" r=".5" fill="#fff"/>
    `;
};

const songbirdFront = (action) => {
  const wingLeft =
    action === 'boost'
      ? 'M24 35c-8 3-13 10-13 17 7 0 14-4 20-10 2-2 3-4 5-7-4-2-8-2-12 0z'
      : 'M24 34c-8 4-12 10-12 16 7 1 13-2 19-8 2-2 4-5 5-8-4-2-8-2-12 0z';
  const wingRight =
    action === 'boost'
      ? 'M40 35c8 3 13 10 13 17-7 0-14-4-20-10-2-2-3-4-5-7 4-2 8-2 12 0z'
      : 'M40 34c8 4 12 10 12 16-7 1-13-2-19-8-2-2-4-5-5-8 4-2 8-2 12 0z';
  const tail =
    action === 'boost'
      ? '<path d="M29 45l-3 8 6-3 6 3-3-8" fill="#ffd87a" stroke="#d2771f" stroke-width="2" stroke-linejoin="round"/>'
      : '<path d="M29 45l-2.4 7 5.4-2.6 5.4 2.6-2.4-7" fill="#ffd87a" stroke="#d2771f" stroke-width="2" stroke-linejoin="round"/>';
  const sparkle =
    action === 'boost'
      ? '<path d="M51 20l1.8 2.6-1.8 2.6-1.8-2.6zM13 20l1.8 2.6-1.8 2.6-1.8-2.6z" fill="#fff7d1" opacity=".88"/>'
      : '';

  return wrapSvg(
    birdCompanionDefs,
    `
    <ellipse cx="32" cy="56" rx="12" ry="4.2" fill="#ffcf8d" opacity=".24"/>
    <circle cx="32" cy="30" r="17" fill="url(#songbird-glow)" opacity="${action === 'boost' ? '.94' : '.72'}"/>
    <path d="${wingLeft}" fill="url(#songbird-wing)" stroke="#cb7425" stroke-width="2.1" stroke-linejoin="round"/>
    <path d="${wingRight}" fill="url(#songbird-wing)" stroke="#cb7425" stroke-width="2.1" stroke-linejoin="round"/>
    <ellipse cx="32" cy="33" rx="12.8" ry="12.8" fill="url(#songbird-body)" stroke="#cb7425" stroke-width="2.2"/>
    <ellipse cx="32" cy="38.2" rx="7.2" ry="5.2" fill="url(#songbird-belly)"/>
    ${tail}
    ${songbirdEyes(action)}
    <path d="M32 32 42 28 32 24 22 28z" fill="url(#songbird-beak)" stroke="#cb7425" stroke-width="2" stroke-linejoin="round"/>
    <path d="M29.6 41.8c1.6 1.6 3.2 1.6 4.8 0" fill="none" stroke="#cb7425" stroke-width="1.7" stroke-linecap="round"/>
    <path d="M25 19c2-2.3 4.2-3.4 7-3.4 3 0 5.5 1.1 7.2 3.4" fill="none" stroke="#fff5c4" stroke-width="2" stroke-linecap="round" opacity=".78"/>
    ${sparkle}
    `
  );
};

const songbirdSideBase = (action) => {
  const wing =
    action === 'boost'
      ? 'M25 33c-8 3-13 10-12 17 7 0 13-4 18-9 2-2 4-4 5-7-4-2-7-3-11-1z'
      : 'M25 33c-8 4-12 10-11 16 7 1 12-2 18-8 2-2 3-4 5-8-4-2-7-2-12 0z';
  const tail =
    action === 'boost'
      ? '<path d="M22 43l-8 8 9-2.5 4 4.2 1.5-8.4" fill="#ffd87a" stroke="#d2771f" stroke-width="2" stroke-linejoin="round"/>'
      : '<path d="M23 43l-7 7.2 8-2.4 3.6 4 1.4-7.8" fill="#ffd87a" stroke="#d2771f" stroke-width="2" stroke-linejoin="round"/>';

  return `
    <ellipse cx="31" cy="56" rx="12" ry="4.1" fill="#ffcf8d" opacity=".24"/>
    <circle cx="32" cy="30" r="16" fill="url(#songbird-glow)" opacity="${action === 'boost' ? '.92' : '.68'}"/>
    ${tail}
    <path d="${wing}" fill="url(#songbird-wing)" stroke="#cb7425" stroke-width="2" stroke-linejoin="round"/>
    <ellipse cx="33" cy="33" rx="12.6" ry="12.6" fill="url(#songbird-body)" stroke="#cb7425" stroke-width="2.2"/>
    <ellipse cx="37" cy="38" rx="6.8" ry="5" fill="url(#songbird-belly)"/>
    ${songbirdEyes(action, true)}
    <path d="M36 31 48 27 36 23 31 27z" fill="url(#songbird-beak)" stroke="#cb7425" stroke-width="2" stroke-linejoin="round"/>
    <path d="M36.6 41.6c1.5 1.5 3 1.5 4.5 0" fill="none" stroke="#cb7425" stroke-width="1.7" stroke-linecap="round"/>
  `;
};

const songbirdSide = (action, angle) =>
  wrapSvg(birdCompanionDefs, angle === 'left' ? songbirdSideBase(action) : mirror(songbirdSideBase(action)));

const fireflyDefs = `
<defs>
  <radialGradient id="firefly-glow-core" cx=".5" cy=".42" r=".82">
    <stop offset="0" stop-color="#f8fdff"/>
    <stop offset=".36" stop-color="#bfe7ff"/>
    <stop offset=".68" stop-color="#9ef0d8" stop-opacity=".72"/>
    <stop offset="1" stop-color="#9ef0d8" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="firefly-body" x1=".28" y1=".14" x2=".82" y2=".86">
    <stop offset="0" stop-color="#6fc8ff"/>
    <stop offset=".48" stop-color="#4f8dff"/>
    <stop offset="1" stop-color="#3d54b8"/>
  </linearGradient>
  <linearGradient id="firefly-belly" x1=".5" y1="0" x2=".5" y2="1">
    <stop offset="0" stop-color="#f8ffbe"/>
    <stop offset=".58" stop-color="#aef0a1"/>
    <stop offset="1" stop-color="#5fd2b6"/>
  </linearGradient>
</defs>
`;

const fireflyEyes = (action, side = false) => {
  if (action === 'blink') {
    return side
      ? '<path d="M36 29c1.6-1.4 3.2-1.4 4.8 0" fill="none" stroke="#ffffff" stroke-width="1.7" stroke-linecap="round"/>'
      : `
        <path d="M27 29c1.8-1.6 3.8-1.6 5.6 0" fill="none" stroke="#ffffff" stroke-width="1.7" stroke-linecap="round"/>
        <path d="M34.4 29c1.8-1.6 3.8-1.6 5.6 0" fill="none" stroke="#ffffff" stroke-width="1.7" stroke-linecap="round"/>
      `;
  }

  return side
    ? `
      <ellipse cx="37.8" cy="28.8" rx="1.5" ry="2.1" fill="#ffffff"/>
      <circle cx="38.2" cy="28.1" r=".45" fill="#14324d"/>
    `
    : `
      <ellipse cx="28.4" cy="28.8" rx="1.5" ry="2.1" fill="#ffffff"/>
      <ellipse cx="36.6" cy="28.8" rx="1.5" ry="2.1" fill="#ffffff"/>
      <circle cx="28.8" cy="28.1" r=".45" fill="#14324d"/>
      <circle cx="37" cy="28.1" r=".45" fill="#14324d"/>
    `;
};

const fireflyFront = (action) => {
  const wingLeft =
    action === 'boost'
      ? 'M24 25c-8-5-16 1-14 10 7 1 14-2 20-7-3-1-5-2-6-3z'
      : 'M24 24c-8-7-16-1-15 8 7 3 14 1 20-5-3-1-4-2-5-3z';
  const wingRight =
    action === 'boost'
      ? 'M40 25c8-5 16 1 14 10-7 1-14-2-20-7 3-1 5-2 6-3z'
      : 'M40 24c8-7 16-1 15 8-7 3-14 1-20-5 3-1 4-2 5-3z';
  const trail =
    action === 'boost'
      ? '<path d="M13 34c4 2 7 5 10 9M51 34c-4 2-7 5-10 9" fill="none" stroke="#aef0d8" stroke-width="2.2" stroke-linecap="round" opacity=".88"/>'
      : '';

  return wrapSvg(
    fireflyDefs,
    `
    <ellipse cx="32" cy="56" rx="11.6" ry="4" fill="#8bd4ff" opacity=".24"/>
    <circle cx="32" cy="30" r="18" fill="url(#firefly-glow-core)" opacity="${action === 'boost' ? '.96' : '.74'}"/>
    <path d="${wingLeft}" fill="#f7fcff" stroke="#9cc8ea" stroke-width="2" stroke-linejoin="round" opacity=".86"/>
    <path d="${wingRight}" fill="#f7fcff" stroke="#9cc8ea" stroke-width="2" stroke-linejoin="round" opacity=".86"/>
    <ellipse cx="32" cy="31" rx="9.2" ry="10.4" fill="url(#firefly-body)" stroke="#28438b" stroke-width="2.2"/>
    <ellipse cx="32" cy="39" rx="8.2" ry="6.2" fill="url(#firefly-belly)" stroke="#4ca58e" stroke-width="2"/>
    <path d="M29 21c-1.4-4.2-3.6-6.4-6.8-8.3M35 21c1.4-4.2 3.6-6.4 6.8-8.3" fill="none" stroke="#5f8cff" stroke-width="2" stroke-linecap="round"/>
    <circle cx="21.6" cy="12.4" r="1.4" fill="#c7f6ff"/>
    <circle cx="42.4" cy="12.4" r="1.4" fill="#c7f6ff"/>
    ${fireflyEyes(action)}
    <path d="M29.4 33.8c1.6 1.4 3.6 1.4 5.2 0" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" opacity=".92"/>
    ${trail}
    <circle cx="14" cy="22" r="2.1" fill="#d8fff4" opacity=".84"/>
    <circle cx="49" cy="18" r="1.8" fill="#d8fff4" opacity=".84"/>
    `
  );
};

const fireflySideBase = (action) => {
  const wing =
    action === 'boost'
      ? 'M24 25c-9-6-16 0-15 9 7 2 13 0 19-4-2-1-3-3-4-5z'
      : 'M24 24c-9-7-16-1-15 8 7 3 13 1 19-4-2-1-3-3-4-4z';
  const trail =
    action === 'boost'
      ? '<path d="M12 35c4 2 8 5 11 9" fill="none" stroke="#aef0d8" stroke-width="2.2" stroke-linecap="round" opacity=".88"/>'
      : '';

  return `
    <ellipse cx="31" cy="56" rx="11.6" ry="4" fill="#8bd4ff" opacity=".24"/>
    <circle cx="32" cy="30" r="17" fill="url(#firefly-glow-core)" opacity="${action === 'boost' ? '.94' : '.7'}"/>
    <path d="${wing}" fill="#f7fcff" stroke="#9cc8ea" stroke-width="2" stroke-linejoin="round" opacity=".86"/>
    <ellipse cx="33" cy="31" rx="9" ry="10.2" fill="url(#firefly-body)" stroke="#28438b" stroke-width="2.2"/>
    <ellipse cx="35.5" cy="39" rx="7.2" ry="5.8" fill="url(#firefly-belly)" stroke="#4ca58e" stroke-width="2"/>
    <path d="M31 21c-1.3-4-3.1-6.2-6.1-8.2" fill="none" stroke="#5f8cff" stroke-width="2" stroke-linecap="round"/>
    <circle cx="24.6" cy="12.6" r="1.4" fill="#c7f6ff"/>
    ${fireflyEyes(action, true)}
    <path d="M36 33.6c1.4 1.3 3 1.3 4.4 0" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" opacity=".92"/>
    ${trail}
  `;
};

const fireflySide = (action, angle) =>
  wrapSvg(fireflyDefs, angle === 'left' ? fireflySideBase(action) : mirror(fireflySideBase(action)));

const storyStarCollectible = (state) => {
  const glow = state === 'glow' ? '.96' : state === 'collected' ? '.24' : '.56';
  const bodyOpacity = state === 'collected' ? '.54' : '1';

  return wrapSvg(
    `
    <defs>
      <radialGradient id="story-star-glow" cx=".5" cy=".42" r=".82">
        <stop offset="0" stop-color="#fffefb"/>
        <stop offset=".52" stop-color="#ffe9a6" stop-opacity=".72"/>
        <stop offset="1" stop-color="#ffe9a6" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="story-star-body" x1=".18" y1=".14" x2=".86" y2=".88">
        <stop offset="0" stop-color="#fff6b0"/>
        <stop offset=".44" stop-color="#ffd45f"/>
        <stop offset="1" stop-color="#f59e0b"/>
      </linearGradient>
      <linearGradient id="story-star-ribbon" x1=".2" y1=".18" x2=".82" y2=".88">
        <stop offset="0" stop-color="#ffe0f6"/>
        <stop offset="1" stop-color="#c084fc"/>
      </linearGradient>
    </defs>
    `,
    `
    <ellipse cx="32" cy="56" rx="12.8" ry="4.3" fill="#ffd879" opacity=".22"/>
    <circle cx="32" cy="30" r="18" fill="url(#story-star-glow)" opacity="${glow}"/>
    <path d="M32 12l5.6 11.3 12.4 1.8-9 8.8 2.1 12.3L32 40.4l-11.1 5.8L23 33.9l-9-8.8 12.4-1.8z" fill="url(#story-star-body)" stroke="#ba7b11" stroke-width="2.6" stroke-linejoin="round" opacity="${bodyOpacity}"/>
    <path d="M26 23c4-1.7 8-1.7 12 0M24 30c5-2 10-2 16 0" fill="none" stroke="#fff7d3" stroke-width="1.5" stroke-linecap="round" opacity=".8"/>
    <path d="M29 41c2.2 1.8 3.8 1.8 6 0" fill="none" stroke="#7c3aed" stroke-width="1.8" stroke-linecap="round" opacity="${state === 'collected' ? '.54' : '.9'}"/>
    <path d="M23 38c4.4-4.2 10.6-4.2 18.6 0" fill="none" stroke="url(#story-star-ribbon)" stroke-width="3" stroke-linecap="round" opacity="${state === 'collected' ? '.38' : '.92'}"/>
    ${state === 'collected' ? '<circle cx="47" cy="18" r="3" fill="#d1d5db"/><path d="M45 18l1.5 1.7 3-3" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>' : '<path d="M48 18l1.8 2.6-1.8 2.6-1.8-2.6zM17 20l1.7 2.4-1.7 2.4-1.7-2.4z" fill="#fffdf4" opacity=".88"/>'}
    `
  );
};

const sunDropCollectible = (state) => {
  const glow = state === 'glow' ? '.98' : state === 'collected' ? '.24' : '.52';
  const bodyOpacity = state === 'collected' ? '.56' : '1';

  return wrapSvg(
    `
    <defs>
      <radialGradient id="sun-drop-glow" cx=".5" cy=".34" r=".84">
        <stop offset="0" stop-color="#fff9d8"/>
        <stop offset=".5" stop-color="#ffe18d" stop-opacity=".74"/>
        <stop offset="1" stop-color="#ffe18d" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="sun-drop-body" x1=".22" y1=".12" x2=".82" y2=".88">
        <stop offset="0" stop-color="#fff5ab"/>
        <stop offset=".42" stop-color="#fbbf24"/>
        <stop offset="1" stop-color="#f97316"/>
      </linearGradient>
    </defs>
    `,
    `
    <ellipse cx="32" cy="56" rx="12.8" ry="4.3" fill="#ffd47c" opacity=".22"/>
    <circle cx="32" cy="28" r="19" fill="url(#sun-drop-glow)" opacity="${glow}"/>
    <path d="M32 12c6 8 12 14.4 12 23.4 0 6.8-4.9 12.6-12 12.6s-12-5.8-12-12.6C20 26.4 26 20 32 12z" fill="url(#sun-drop-body)" stroke="#d97706" stroke-width="2.8" stroke-linejoin="round" opacity="${bodyOpacity}"/>
    <path d="M32 18c-4 5.2-7.4 10.2-7.4 16.4 0 5.2 3.5 9.5 7.4 9.5" fill="none" stroke="#fff5d5" stroke-width="2" stroke-linecap="round" opacity=".92"/>
    <circle cx="26.8" cy="31.2" r="1.8" fill="#7c3a00" opacity="${state === 'collected' ? '.52' : '1'}"/>
    <circle cx="37.2" cy="31.2" r="1.8" fill="#7c3a00" opacity="${state === 'collected' ? '.52' : '1'}"/>
    <path d="M29.5 36c1.6 1.7 3.4 1.7 5 0" fill="none" stroke="#7c3a00" stroke-width="1.8" stroke-linecap="round" opacity="${state === 'collected' ? '.52' : '.9'}"/>
    ${state === 'collected' ? '<path d="M47 19l1.8 2.6-1.8 2.6-1.8-2.6z" fill="#d1d5db" opacity=".86"/>' : '<path d="M50 18v4M50 27v4M45 22h4M51 22h4M15 24v3M12.5 27h5" fill="none" stroke="#fff9df" stroke-width="2.1" stroke-linecap="round"/>'}
    `
  );
};

const fireflyCollectible = (state) => {
  const glow = state === 'glow' ? '.98' : state === 'collected' ? '.2' : '.58';
  const bodyOpacity = state === 'collected' ? '.58' : '1';

  return wrapSvg(
    `
    <defs>
      <radialGradient id="firefly-pickup-glow" cx=".5" cy=".38" r=".84">
        <stop offset="0" stop-color="#faffff"/>
        <stop offset=".42" stop-color="#c3f8ee" stop-opacity=".78"/>
        <stop offset="1" stop-color="#c3f8ee" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="firefly-pickup-body" x1=".24" y1=".16" x2=".82" y2=".88">
        <stop offset="0" stop-color="#9ad7ff"/>
        <stop offset=".46" stop-color="#63a7ff"/>
        <stop offset="1" stop-color="#4855c9"/>
      </linearGradient>
      <linearGradient id="firefly-pickup-tail" x1=".5" y1="0" x2=".5" y2="1">
        <stop offset="0" stop-color="#f8ffba"/>
        <stop offset=".56" stop-color="#98f0b8"/>
        <stop offset="1" stop-color="#5fd2b5"/>
      </linearGradient>
    </defs>
    `,
    `
    <ellipse cx="32" cy="56" rx="12.4" ry="4.2" fill="#9ad7ff" opacity=".22"/>
    <circle cx="32" cy="30" r="18" fill="url(#firefly-pickup-glow)" opacity="${glow}"/>
    <path d="M22 25c-7-6-13-1-12 7 6 2 11 0 16-4-2-1-3-2-4-3z" fill="#f8fdff" stroke="#a6cde9" stroke-width="2" stroke-linejoin="round" opacity=".86"/>
    <path d="M42 25c7-6 13-1 12 7-6 2-11 0-16-4 2-1 3-2 4-3z" fill="#f8fdff" stroke="#a6cde9" stroke-width="2" stroke-linejoin="round" opacity=".86"/>
    <ellipse cx="32" cy="30" rx="8.2" ry="8.8" fill="url(#firefly-pickup-body)" stroke="#3753a6" stroke-width="2.2" opacity="${bodyOpacity}"/>
    <ellipse cx="32" cy="39" rx="7.3" ry="5.8" fill="url(#firefly-pickup-tail)" stroke="#4ca58e" stroke-width="2" opacity="${bodyOpacity}"/>
    <path d="M29.2 21c-1.4-3.8-3.2-5.8-6-7.6M34.8 21c1.4-3.8 3.2-5.8 6-7.6" fill="none" stroke="#6f90ff" stroke-width="2" stroke-linecap="round"/>
    <circle cx="23.4" cy="13.8" r="1.3" fill="#d3fbff"/>
    <circle cx="40.6" cy="13.8" r="1.3" fill="#d3fbff"/>
    ${state === 'collected' ? '<path d="M46 18l1.7 2.4-1.7 2.4-1.7-2.4z" fill="#d1d5db"/>' : '<circle cx="48" cy="18" r="1.9" fill="#e6fff8" opacity=".9"/><circle cx="15.5" cy="22.2" r="1.6" fill="#e6fff8" opacity=".82"/>'}
    `
  );
};

const supportCompanions = [
  {
    folder: 'companion/butterfly-spirit',
    render(action, angle) {
      return angle === 'front' ? butterflyFront(action) : butterflySide(action, angle);
    },
  },
  {
    folder: 'companion/songbird',
    render(action, angle) {
      return angle === 'front' ? songbirdFront(action) : songbirdSide(action, angle);
    },
  },
  {
    folder: 'companion/firefly-friend',
    render(action, angle) {
      return angle === 'front' ? fireflyFront(action) : fireflySide(action, angle);
    },
  },
];

const supportCollectibles = [
  { prefix: 'story-star', render: storyStarCollectible },
  { prefix: 'sun-drop', render: sunDropCollectible },
  { prefix: 'firefly', render: fireflyCollectible },
];

['hover', 'blink', 'boost'].forEach((action) => {
  ['front', 'left', 'right'].forEach((angle) => {
    supportCompanions.forEach((companion) => {
      writeSprite(companion.folder, `${action}-${angle}.svg`, companion.render(action, angle));
    });
  });
});

['idle', 'glow', 'collected'].forEach((state) => {
  supportCollectibles.forEach((collectible) => {
    writeSprite('collectible', `${collectible.prefix}-${state}.svg`, collectible.render(state));
  });
});

console.log('Generated support companion and collectible sprites.');
