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
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
  ${defs}
  ${body}
</svg>
`;

const bambooDefs = `
<defs>
  <linearGradient id="bamboo-wood" x1=".5" y1="0" x2=".5" y2="1">
    <stop offset="0" stop-color="#a77a56"/>
    <stop offset="1" stop-color="#6f4c33"/>
  </linearGradient>
  <linearGradient id="bamboo-lantern" x1=".5" y1="0" x2=".5" y2="1">
    <stop offset="0" stop-color="#fff7d1"/>
    <stop offset=".55" stop-color="#ffd67a"/>
    <stop offset="1" stop-color="#f29f38"/>
  </linearGradient>
  <radialGradient id="bamboo-glow" cx=".5" cy=".46" r=".62">
    <stop offset="0" stop-color="#fff8da"/>
    <stop offset=".58" stop-color="#ffd27c" stop-opacity=".72"/>
    <stop offset="1" stop-color="#ffd27c" stop-opacity="0"/>
  </radialGradient>
</defs>
`;

const meadowDefs = `
<defs>
  <linearGradient id="meadow-wood" x1=".5" y1="0" x2=".5" y2="1">
    <stop offset="0" stop-color="#a27a55"/>
    <stop offset="1" stop-color="#6c4d35"/>
  </linearGradient>
  <linearGradient id="meadow-stone" x1=".22" y1=".08" x2=".88" y2=".92">
    <stop offset="0" stop-color="#f2f5f0"/>
    <stop offset=".52" stop-color="#cfd9d3"/>
    <stop offset="1" stop-color="#8d9b95"/>
  </linearGradient>
  <linearGradient id="meadow-wool" x1=".4" y1="0" x2=".6" y2="1">
    <stop offset="0" stop-color="#ffffff"/>
    <stop offset="1" stop-color="#e9efe9"/>
  </linearGradient>
</defs>
`;

const storyDefs = `
<defs>
  <linearGradient id="story-bark" x1=".5" y1="0" x2=".5" y2="1">
    <stop offset="0" stop-color="#9d734d"/>
    <stop offset="1" stop-color="#6d4f39"/>
  </linearGradient>
  <linearGradient id="story-leaves" x1=".18" y1=".08" x2=".84" y2=".92">
    <stop offset="0" stop-color="#dff4bb"/>
    <stop offset=".48" stop-color="#8dcf7e"/>
    <stop offset="1" stop-color="#4d9a68"/>
  </linearGradient>
  <linearGradient id="story-cap" x1=".28" y1=".06" x2=".8" y2=".92">
    <stop offset="0" stop-color="#ffcfb0"/>
    <stop offset=".55" stop-color="#ef8b6d"/>
    <stop offset="1" stop-color="#d76a59"/>
  </linearGradient>
  <radialGradient id="story-window" cx=".5" cy=".5" r=".62">
    <stop offset="0" stop-color="#fff8d3"/>
    <stop offset="1" stop-color="#ffc864"/>
  </radialGradient>
</defs>
`;

const orchardDefs = `
<defs>
  <linearGradient id="orchard-wood" x1=".5" y1="0" x2=".5" y2="1">
    <stop offset="0" stop-color="#b77b48"/>
    <stop offset="1" stop-color="#825126"/>
  </linearGradient>
  <linearGradient id="orchard-leaf" x1=".24" y1=".1" x2=".8" y2=".9">
    <stop offset="0" stop-color="#e5f7b4"/>
    <stop offset=".5" stop-color="#96d167"/>
    <stop offset="1" stop-color="#4f9d49"/>
  </linearGradient>
  <radialGradient id="orchard-fruit" cx=".45" cy=".34" r=".72">
    <stop offset="0" stop-color="#fff0b0"/>
    <stop offset=".45" stop-color="#ffb54d"/>
    <stop offset="1" stop-color="#f07721"/>
  </radialGradient>
  <radialGradient id="orchard-glass" cx=".4" cy=".3" r=".86">
    <stop offset="0" stop-color="#f8ffff"/>
    <stop offset=".6" stop-color="#d5eff7"/>
    <stop offset="1" stop-color="#8ab9d1"/>
  </radialGradient>
</defs>
`;

const prairieDefs = `
<defs>
  <linearGradient id="prairie-post" x1=".5" y1="0" x2=".5" y2="1">
    <stop offset="0" stop-color="#f4f7ff"/>
    <stop offset="1" stop-color="#b9cce8"/>
  </linearGradient>
  <linearGradient id="prairie-leaf" x1=".3" y1=".1" x2=".78" y2=".94">
    <stop offset="0" stop-color="#d6f6be"/>
    <stop offset=".5" stop-color="#85c86d"/>
    <stop offset="1" stop-color="#4a9758"/>
  </linearGradient>
  <radialGradient id="prairie-petal" cx=".45" cy=".32" r=".72">
    <stop offset="0" stop-color="#f8fbff"/>
    <stop offset=".46" stop-color="#8fb8ff"/>
    <stop offset="1" stop-color="#4966db"/>
  </radialGradient>
  <radialGradient id="prairie-firefly" cx=".5" cy=".45" r=".62">
    <stop offset="0" stop-color="#fff8d8"/>
    <stop offset=".6" stop-color="#bce9ff" stop-opacity=".74"/>
    <stop offset="1" stop-color="#bce9ff" stop-opacity="0"/>
  </radialGradient>
</defs>
`;

const teaTableSvg = wrapSvg(
  bambooDefs,
  `
  <ellipse cx="48" cy="86" rx="24" ry="5" fill="#5a4a3d" opacity=".18"/>
  <ellipse cx="48" cy="62" rx="28" ry="11" fill="#7d5a40"/>
  <ellipse cx="48" cy="58" rx="31" ry="13" fill="url(#bamboo-wood)" stroke="#5b3b27" stroke-width="3"/>
  <rect x="43" y="61" width="10" height="18" rx="4" fill="#6d4a31"/>
  <rect x="25" y="72" width="46" height="7" rx="3.5" fill="#654731" opacity=".92"/>
  <circle cx="34" cy="53" r="7" fill="url(#bamboo-glow)" opacity=".85"/>
  <rect x="30" y="49" width="8" height="7" rx="2" fill="#f5f0e0" stroke="#8d6c4a" stroke-width="2"/>
  <path d="M38 52h4c2.8 0 4.4 1.6 4.4 4 0 1.8-1.1 3.2-2.9 3.7" fill="none" stroke="#8d6c4a" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M57 36h10v18c0 3.8-2.1 6-5 6s-5-2.2-5-6z" fill="url(#bamboo-lantern)" stroke="#7b5736" stroke-width="3" stroke-linejoin="round"/>
  <rect x="60" y="29" width="4" height="8" rx="2" fill="#7a5b3f"/>
  <circle cx="62" cy="47" r="12" fill="url(#bamboo-glow)" opacity=".72"/>
  <path d="M22 45c8-10 16-14 24-14 8 0 17 4 27 14" fill="none" stroke="#8bb56b" stroke-width="4" stroke-linecap="round" opacity=".72"/>
  `
);

const lanternStandSvg = wrapSvg(
  bambooDefs,
  `
  <ellipse cx="48" cy="88" rx="20" ry="4.5" fill="#5a4a3d" opacity=".16"/>
  <rect x="44" y="14" width="8" height="62" rx="4" fill="url(#bamboo-wood)" stroke="#5c3f2b" stroke-width="2.6"/>
  <path d="M28 28h40" fill="none" stroke="#7a573a" stroke-width="4.5" stroke-linecap="round"/>
  <path d="M34 28v12M62 28v14M48 18v10" fill="none" stroke="#6f4c33" stroke-width="3" stroke-linecap="round"/>
  <circle cx="48" cy="44" r="18" fill="url(#bamboo-glow)" opacity=".58"/>
  <path d="M41 36h14v20c0 4.8-3 7.6-7 7.6s-7-2.8-7-7.6z" fill="url(#bamboo-lantern)" stroke="#7a5736" stroke-width="3" stroke-linejoin="round"/>
  <path d="M29 38h12v15c0 4.2-2.5 6.2-6 6.2s-6-2-6-6.2z" fill="url(#bamboo-lantern)" stroke="#7a5736" stroke-width="3" stroke-linejoin="round"/>
  <path d="M55 40h12v16c0 4.2-2.5 6.2-6 6.2s-6-2-6-6.2z" fill="url(#bamboo-lantern)" stroke="#7a5736" stroke-width="3" stroke-linejoin="round"/>
  <rect x="36" y="74" width="24" height="8" rx="4" fill="#6a4a31"/>
  `
);

const woolCartSvg = wrapSvg(
  meadowDefs,
  `
  <ellipse cx="48" cy="86" rx="26" ry="5" fill="#55634b" opacity=".14"/>
  <rect x="18" y="42" width="50" height="22" rx="6" fill="url(#meadow-wood)" stroke="#5b402e" stroke-width="3"/>
  <path d="M20 42l9-11h35l8 11" fill="none" stroke="#7e5b3d" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="30" cy="72" r="9" fill="none" stroke="#5a4639" stroke-width="4"/>
  <circle cx="66" cy="72" r="9" fill="none" stroke="#5a4639" stroke-width="4"/>
  <path d="M30 72l4-4M30 72l-4 4M66 72l4-4M66 72l-4 4" fill="none" stroke="#5a4639" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M29 26c-8 0-13 4.5-13 11 0 7.6 6.6 13 17 13 8.3 0 15.3-3.2 20-8.4-2.2-9.2-10.6-15.6-24-15.6z" fill="url(#meadow-wool)" stroke="#c9d7cf" stroke-width="3"/>
  <path d="M54 26c9 0 15 6 15 14 0 7.4-5.6 12-14 12-5.4 0-10.2-1.7-14.3-4.6 1.8-12.8 10.3-21.4 13.3-21.4z" fill="url(#meadow-wool)" stroke="#c9d7cf" stroke-width="3"/>
  `
);

const stoneCircleSvg = wrapSvg(
  meadowDefs,
  `
  <ellipse cx="48" cy="87" rx="26" ry="5" fill="#536253" opacity=".15"/>
  <path d="M23 71c0-16 9-31 25-31s25 15 25 31" fill="none" stroke="#9aa9a2" stroke-width="5" stroke-linecap="round"/>
  <rect x="16" y="28" width="18" height="44" rx="8" fill="url(#meadow-stone)" stroke="#7e8f88" stroke-width="3"/>
  <rect x="39" y="18" width="18" height="54" rx="8" fill="url(#meadow-stone)" stroke="#7e8f88" stroke-width="3"/>
  <rect x="62" y="28" width="18" height="44" rx="8" fill="url(#meadow-stone)" stroke="#7e8f88" stroke-width="3"/>
  <path d="M24 40h5M24 49h4M45 31h6M45 44h5M69 39h5M67 50h6" fill="none" stroke="#f7faf7" stroke-width="2.4" stroke-linecap="round" opacity=".72"/>
  `
);

const mushroomHouseSvg = wrapSvg(
  storyDefs,
  `
  <ellipse cx="48" cy="87" rx="24" ry="5" fill="#67453e" opacity=".14"/>
  <path d="M34 46h28v28H34z" rx="10" fill="#fff4e3" stroke="#b58b69" stroke-width="3"/>
  <rect x="43" y="56" width="10" height="18" rx="5" fill="#b98b61"/>
  <circle cx="51" cy="65" r="1.3" fill="#fff1de"/>
  <path d="M16 42c0-15.2 14.5-27 32-27s32 11.8 32 27c0 5.7-4.9 9-12.8 9H28.8C20.9 51 16 47.7 16 42z" fill="url(#story-cap)" stroke="#b76057" stroke-width="3"/>
  <circle cx="33" cy="31" r="4.5" fill="#fff1db"/>
  <circle cx="49" cy="25" r="5.2" fill="#fff1db"/>
  <circle cx="63" cy="33" r="4.2" fill="#fff1db"/>
  <circle cx="28" cy="61" r="7" fill="url(#story-window)" opacity=".78"/>
  <path d="M20 64c7 10 16 15 28 15 13 0 23-5 30-15" fill="none" stroke="#7aae66" stroke-width="4" stroke-linecap="round" opacity=".82"/>
  `
);

const storyTreeSvg = wrapSvg(
  storyDefs,
  `
  <ellipse cx="48" cy="88" rx="24" ry="5" fill="#53694f" opacity=".14"/>
  <path d="M43 34c-2-8 0-16 5-22 5 6 7 14 5 22v30H43z" fill="url(#story-bark)" stroke="#5a4031" stroke-width="3" stroke-linejoin="round"/>
  <path d="M32 70c5-10 10-17 16-22 6 5 11 12 16 22" fill="none" stroke="#6f5543" stroke-width="5" stroke-linecap="round"/>
  <path d="M18 39c0-13 12-23 30-23s30 10 30 23c0 8-5 16-12 19H30c-7-3-12-11-12-19z" fill="url(#story-leaves)" stroke="#4b8a5d" stroke-width="3"/>
  <circle cx="34" cy="32" r="6" fill="#fff6d1" opacity=".76"/>
  <circle cx="58" cy="28" r="5" fill="#fff6d1" opacity=".76"/>
  <circle cx="63" cy="45" r="4.2" fill="#f7ffdd" opacity=".72"/>
  <circle cx="27" cy="46" r="3.8" fill="#f7ffdd" opacity=".72"/>
  <path d="M28 61c4 2 9 3 20 3 11 0 17-1 20-3" fill="none" stroke="#8fc080" stroke-width="4" stroke-linecap="round"/>
  `
);

const mirrorStandSvg = wrapSvg(
  orchardDefs,
  `
  <ellipse cx="48" cy="87" rx="22" ry="5" fill="#7b5a3a" opacity=".14"/>
  <rect x="44" y="52" width="8" height="25" rx="4" fill="url(#orchard-wood)" stroke="#6a411e" stroke-width="2.8"/>
  <path d="M37 77h22" fill="none" stroke="#8c5d2a" stroke-width="5" stroke-linecap="round"/>
  <ellipse cx="48" cy="34" rx="20" ry="24" fill="url(#orchard-glass)" stroke="#f7b34a" stroke-width="5"/>
  <path d="M39 27c5-8 11-11 18-9" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity=".6"/>
  <circle cx="27" cy="42" r="6" fill="url(#orchard-fruit)" stroke="#cc711f" stroke-width="2.4"/>
  <circle cx="69" cy="28" r="5.6" fill="url(#orchard-fruit)" stroke="#cc711f" stroke-width="2.4"/>
  <path d="M25 37c2-5 5-8 10-10M62 23c2-5 5-8 10-10" fill="none" stroke="#78af4f" stroke-width="3" stroke-linecap="round"/>
  `
);

const citrusArborSvg = wrapSvg(
  orchardDefs,
  `
  <ellipse cx="48" cy="88" rx="24" ry="5" fill="#72523b" opacity=".14"/>
  <path d="M22 78V50c0-18 10-28 26-28s26 10 26 28v28" fill="none" stroke="#9c6937" stroke-width="7" stroke-linecap="round"/>
  <path d="M22 52c7-6 17-9 26-9 9 0 19 3 26 9" fill="none" stroke="#7e4f24" stroke-width="4" stroke-linecap="round"/>
  <path d="M26 41c5-7 10-11 19-14M54 27c9 3 14 7 17 14" fill="none" stroke="url(#orchard-leaf)" stroke-width="7" stroke-linecap="round"/>
  <circle cx="33" cy="34" r="5.5" fill="url(#orchard-fruit)" stroke="#cc711f" stroke-width="2.4"/>
  <circle cx="48" cy="26" r="6" fill="url(#orchard-fruit)" stroke="#cc711f" stroke-width="2.4"/>
  <circle cx="63" cy="34" r="5.5" fill="url(#orchard-fruit)" stroke="#cc711f" stroke-width="2.4"/>
  <path d="M30 61c10 8 26 8 36 0" fill="none" stroke="#f6d690" stroke-width="3.4" stroke-linecap="round" opacity=".76"/>
  `
);

const windmillPostSvg = wrapSvg(
  prairieDefs,
  `
  <ellipse cx="48" cy="88" rx="22" ry="5" fill="#5570a6" opacity=".14"/>
  <rect x="44" y="26" width="8" height="52" rx="4" fill="url(#prairie-post)" stroke="#8ea2c2" stroke-width="2.8"/>
  <circle cx="48" cy="38" r="8" fill="#f6fbff" stroke="#8ea2c2" stroke-width="2.8"/>
  <path d="M48 23v13M48 40v15M33 38h13M50 38h15" fill="none" stroke="#dce9ff" stroke-width="4" stroke-linecap="round"/>
  <path d="M37 27l9 9M59 27l-9 9M37 49l9-9M59 49l-9-9" fill="none" stroke="#dce9ff" stroke-width="4" stroke-linecap="round"/>
  <path d="M28 78h40" fill="none" stroke="#b9cce8" stroke-width="5" stroke-linecap="round"/>
  <circle cx="67" cy="30" r="11" fill="url(#prairie-firefly)" opacity=".76"/>
  <circle cx="67" cy="30" r="3.3" fill="#fff9d7"/>
  `
);

const bluebonnetPatchSvg = wrapSvg(
  prairieDefs,
  `
  <ellipse cx="48" cy="89" rx="26" ry="5" fill="#4d6f8a" opacity=".14"/>
  <path d="M24 80c8-13 10-22 10-38M40 80c6-12 7-21 7-35M56 80c2-12 2-22 1-36M70 80c-3-12-5-22-8-34" fill="none" stroke="#5ea267" stroke-width="4" stroke-linecap="round"/>
  <g transform="translate(0 -2)">
    <path d="M25 45c3-7 7-9 11-7-2 3-2 6-1 10-4 0-7-1-10-3z" fill="url(#prairie-petal)" stroke="#4d67d8" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M33 40c3-6 6-7 10-5-1 3-1 6 0 9-4 0-7-1-10-4z" fill="url(#prairie-petal)" stroke="#4d67d8" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M41 48c3-7 7-9 11-7-2 3-2 6-1 10-4 0-7-1-10-3z" fill="url(#prairie-petal)" stroke="#4d67d8" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M51 39c3-6 6-7 10-5-1 3-1 6 0 9-4 0-7-1-10-4z" fill="url(#prairie-petal)" stroke="#4d67d8" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M61 47c3-7 7-9 11-7-2 3-2 6-1 10-4 0-7-1-10-3z" fill="url(#prairie-petal)" stroke="#4d67d8" stroke-width="2.2" stroke-linejoin="round"/>
  </g>
  <circle cx="36" cy="37" r="2.2" fill="#fff9d8"/>
  <circle cx="58" cy="33" r="2.2" fill="#fff9d8"/>
  <circle cx="69" cy="38" r="2.2" fill="#fff9d8"/>
  `
);

const entries = [
  ['world/lantern-bamboo-valley/props', 'tea-table.svg', teaTableSvg],
  ['world/lantern-bamboo-valley/landmark', 'lantern-stand.svg', lanternStandSvg],
  ['world/highland-meadow/props', 'wool-cart.svg', woolCartSvg],
  ['world/highland-meadow/landmark', 'stone-circle.svg', stoneCircleSvg],
  ['world/storybook-forest/props', 'mushroom-house.svg', mushroomHouseSvg],
  ['world/storybook-forest/landmark', 'story-tree.svg', storyTreeSvg],
  ['world/sun-orchard/props', 'mirror-stand.svg', mirrorStandSvg],
  ['world/sun-orchard/landmark', 'citrus-arbor.svg', citrusArborSvg],
  ['world/bluebonnet-prairie/props', 'windmill-post.svg', windmillPostSvg],
  ['world/bluebonnet-prairie/landmark', 'bluebonnet-patch.svg', bluebonnetPatchSvg],
];

entries.forEach(([folder, filename, svg]) => writeSprite(folder, filename, svg));

console.log('Generated world scene prop and landmark sprites.');
