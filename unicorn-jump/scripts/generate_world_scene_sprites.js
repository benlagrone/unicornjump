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

const wrapStretchSvg = (width, height, defs, body) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
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

const skyLanternGateSvg = wrapSvg(
  bambooDefs,
  `
  <ellipse cx="48" cy="89" rx="24" ry="5" fill="#5a4a3d" opacity=".14"/>
  <path d="M24 82V48c0-20 9-32 24-32s24 12 24 32v34" fill="none" stroke="url(#bamboo-wood)" stroke-width="8" stroke-linecap="round"/>
  <path d="M24 48c8-7 16-10 24-10 8 0 16 3 24 10" fill="none" stroke="#7d5a3f" stroke-width="4.5" stroke-linecap="round"/>
  <path d="M18 82h60" fill="none" stroke="#6b4a31" stroke-width="6" stroke-linecap="round"/>
  <path d="M31 25c5-7 9-10 15-12M50 13c8 2 13 6 16 12" fill="none" stroke="#8ab86d" stroke-width="4" stroke-linecap="round"/>
  <circle cx="48" cy="38" r="18" fill="url(#bamboo-glow)" opacity=".58"/>
  <path d="M41 28h14v18c0 4.4-3 7-7 7s-7-2.6-7-7z" fill="url(#bamboo-lantern)" stroke="#7a5736" stroke-width="3" stroke-linejoin="round"/>
  <path d="M26 37h10v14c0 3.8-2.2 5.8-5 5.8s-5-2-5-5.8z" fill="url(#bamboo-lantern)" stroke="#7a5736" stroke-width="2.8" stroke-linejoin="round"/>
  <path d="M60 37h10v14c0 3.8-2.2 5.8-5 5.8s-5-2-5-5.8z" fill="url(#bamboo-lantern)" stroke="#7a5736" stroke-width="2.8" stroke-linejoin="round"/>
  <path d="M31 29v8M65 29v8M48 21v7" fill="none" stroke="#6e4d34" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M19 60c6-4 10-4 16 0M61 60c6-4 10-4 16 0" fill="none" stroke="#91bc74" stroke-width="3.4" stroke-linecap="round" opacity=".82"/>
  `
);

const breezeArchSvg = wrapSvg(
  meadowDefs,
  `
  <ellipse cx="48" cy="89" rx="24" ry="5" fill="#5d6b58" opacity=".14"/>
  <path d="M24 82V52c0-18 10-30 24-30s24 12 24 30v30" fill="none" stroke="url(#meadow-stone)" stroke-width="8" stroke-linecap="round"/>
  <path d="M24 52c7-7 15-10 24-10 9 0 17 3 24 10" fill="none" stroke="#8d9b95" stroke-width="4.6" stroke-linecap="round"/>
  <path d="M18 82h60" fill="none" stroke="#87968f" stroke-width="6" stroke-linecap="round"/>
  <path d="M24 40c7-8 14-11 24-11 10 0 17 3 24 11" fill="none" stroke="#7fc28e" stroke-width="4" stroke-linecap="round" opacity=".78"/>
  <path d="M34 22c-8 0-14 4.5-14 11 0 6.2 5.6 10.6 14 10.6 7.2 0 12.8-2.5 16.8-7-2.1-8.2-8.1-14.6-16.8-14.6z" fill="url(#meadow-wool)" stroke="#d2ddd5" stroke-width="2.8"/>
  <path d="M62 22c8.4 0 14 5.1 14 12 0 6-5.3 10-13.2 10-7.1 0-12.7-2.6-16.9-7.3 2.4-8.2 8.2-14.7 16.1-14.7z" fill="url(#meadow-wool)" stroke="#d2ddd5" stroke-width="2.8"/>
  <circle cx="37" cy="52" r="3.4" fill="#e7b4ff" stroke="#b47cd9" stroke-width="1.8"/>
  <circle cx="48" cy="45" r="3.4" fill="#f8f4ff" stroke="#b47cd9" stroke-width="1.8"/>
  <circle cx="59" cy="52" r="3.4" fill="#e7b4ff" stroke="#b47cd9" stroke-width="1.8"/>
  <path d="M27 63c5-4 10-4 15 0M54 63c5-4 10-4 15 0" fill="none" stroke="#eef7ef" stroke-width="2.6" stroke-linecap="round" opacity=".82"/>
  `
);

const pageArchSvg = wrapSvg(
  storyDefs,
  `
  <ellipse cx="48" cy="89" rx="24" ry="5" fill="#6d5149" opacity=".14"/>
  <path d="M24 82V52c0-18 10-30 24-30s24 12 24 30v30" fill="none" stroke="#b68b6d" stroke-width="8" stroke-linecap="round"/>
  <path d="M24 52c7-7 15-10 24-10 9 0 17 3 24 10" fill="none" stroke="#8e664f" stroke-width="4.6" stroke-linecap="round"/>
  <path d="M18 82h60" fill="none" stroke="#815f48" stroke-width="6" stroke-linecap="round"/>
  <path d="M28 23c6-5 12-7 20-7s14 2 20 7" fill="none" stroke="#f4eadb" stroke-width="6" stroke-linecap="round"/>
  <path d="M32 18c4 4 10 6 16 6s12-2 16-6" fill="none" stroke="#d9b46d" stroke-width="3.2" stroke-linecap="round"/>
  <path d="M30 23c0 10 8 18 18 18s18-8 18-18" fill="none" stroke="#f4eadb" stroke-width="4.2" stroke-linecap="round"/>
  <circle cx="31" cy="44" r="4.6" fill="url(#story-window)" opacity=".82"/>
  <circle cx="65" cy="44" r="4.6" fill="url(#story-window)" opacity=".82"/>
  <path d="M40 33l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4-3.9-3.8 5.4-.8z" fill="#ffe59a" stroke="#e0b454" stroke-width="1.8" stroke-linejoin="round"/>
  <path d="M56 33l1.8 3.6 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6z" fill="#fff1be" stroke="#e0b454" stroke-width="1.5" stroke-linejoin="round"/>
  `
);

const goldenArborGateSvg = wrapSvg(
  orchardDefs,
  `
  <ellipse cx="48" cy="89" rx="24" ry="5" fill="#72523b" opacity=".14"/>
  <path d="M24 82V50c0-19 10-31 24-31s24 12 24 31v32" fill="none" stroke="url(#orchard-wood)" stroke-width="8" stroke-linecap="round"/>
  <path d="M24 50c8-7 16-10 24-10 8 0 16 3 24 10" fill="none" stroke="#8d582c" stroke-width="4.6" stroke-linecap="round"/>
  <path d="M18 82h60" fill="none" stroke="#8f5e31" stroke-width="6" stroke-linecap="round"/>
  <path d="M27 37c4-9 10-14 21-17M48 20c11 3 17 8 21 17" fill="none" stroke="url(#orchard-leaf)" stroke-width="7" stroke-linecap="round"/>
  <circle cx="35" cy="30" r="5.2" fill="url(#orchard-fruit)" stroke="#cc711f" stroke-width="2.2"/>
  <circle cx="48" cy="24" r="5.6" fill="url(#orchard-fruit)" stroke="#cc711f" stroke-width="2.2"/>
  <circle cx="61" cy="30" r="5.2" fill="url(#orchard-fruit)" stroke="#cc711f" stroke-width="2.2"/>
  <ellipse cx="48" cy="46" rx="8" ry="11" fill="url(#orchard-glass)" stroke="#f7b34a" stroke-width="3"/>
  <path d="M44 43c3-5 6-7 10-6" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" opacity=".62"/>
  <path d="M28 61c6 5 12 5 18 0M50 61c6 5 12 5 18 0" fill="none" stroke="#f4dfad" stroke-width="2.8" stroke-linecap="round" opacity=".78"/>
  `
);

const windmillGateSvg = wrapSvg(
  prairieDefs,
  `
  <ellipse cx="48" cy="89" rx="24" ry="5" fill="#5876a3" opacity=".14"/>
  <path d="M24 82V52c0-18 10-30 24-30s24 12 24 30v30" fill="none" stroke="url(#prairie-post)" stroke-width="8" stroke-linecap="round"/>
  <path d="M24 52c7-7 15-10 24-10 9 0 17 3 24 10" fill="none" stroke="#90a4c4" stroke-width="4.6" stroke-linecap="round"/>
  <path d="M18 82h60" fill="none" stroke="#98acd2" stroke-width="6" stroke-linecap="round"/>
  <circle cx="48" cy="31" r="8.6" fill="#f6fbff" stroke="#8ea2c2" stroke-width="2.8"/>
  <path d="M48 16v13M48 33v13M33 31h13M50 31h13" fill="none" stroke="#dce9ff" stroke-width="4" stroke-linecap="round"/>
  <path d="M37 20l9 9M59 20l-9 9M37 42l9-9M59 42l-9-9" fill="none" stroke="#dce9ff" stroke-width="4" stroke-linecap="round"/>
  <g transform="translate(0 3)">
    <path d="M28 58c3-7 7-9 11-7-2 3-2 6-1 10-4 0-7-1-10-3z" fill="url(#prairie-petal)" stroke="#4d67d8" stroke-width="2"/>
    <path d="M44 63c3-7 7-9 11-7-2 3-2 6-1 10-4 0-7-1-10-3z" fill="url(#prairie-petal)" stroke="#4d67d8" stroke-width="2"/>
    <path d="M58 58c3-7 7-9 11-7-2 3-2 6-1 10-4 0-7-1-10-3z" fill="url(#prairie-petal)" stroke="#4d67d8" stroke-width="2"/>
  </g>
  <circle cx="31" cy="47" r="8.5" fill="url(#prairie-firefly)" opacity=".72"/>
  <circle cx="65" cy="41" r="8.5" fill="url(#prairie-firefly)" opacity=".72"/>
  `
);

const bambooPlatformTrimSvg = wrapStretchSvg(
  240,
  56,
  bambooDefs,
  `
  <path d="M18 16C52 6 188 6 222 16" fill="none" stroke="#9bcf86" stroke-width="8" stroke-linecap="round" opacity=".48"/>
  <path d="M18 21C56 12 184 12 222 21" fill="none" stroke="#ffe09c" stroke-width="3.2" stroke-linecap="round" opacity=".74"/>
  <path d="M32 20v11M76 18v14M120 20v11M164 18v14M208 20v11" fill="none" stroke="#76503a" stroke-width="2.4" stroke-linecap="round" opacity=".82"/>
  <path d="M20 28c34-8 166-8 200 0" fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="3" stroke-linecap="round"/>
  <circle cx="58" cy="29" r="8" fill="url(#bamboo-glow)" opacity=".52"/>
  <circle cx="172" cy="29" r="8" fill="url(#bamboo-glow)" opacity=".52"/>
  <path d="M54 19h8v10c0 2.6-1.7 4.1-4 4.1s-4-1.5-4-4.1z" fill="url(#bamboo-lantern)" stroke="#7a5736" stroke-width="1.8" stroke-linejoin="round" opacity=".9"/>
  <path d="M168 19h8v10c0 2.6-1.7 4.1-4 4.1s-4-1.5-4-4.1z" fill="url(#bamboo-lantern)" stroke="#7a5736" stroke-width="1.8" stroke-linejoin="round" opacity=".9"/>
  <path d="M34 35c10 5 22 5 32 0M96 35c10 5 22 5 32 0M158 35c10 5 22 5 32 0" fill="none" stroke="#8eb973" stroke-width="3.2" stroke-linecap="round" opacity=".76"/>
  `
);

const bambooGroundCapSvg = wrapStretchSvg(
  280,
  92,
  bambooDefs,
  `
  <path d="M16 18C56 6 224 6 264 18" fill="none" stroke="#9fd48a" stroke-width="10" stroke-linecap="round" opacity=".5"/>
  <path d="M16 26C58 14 222 14 264 26" fill="none" stroke="#ffe3a6" stroke-width="4" stroke-linecap="round" opacity=".78"/>
  <path d="M38 28v14M88 24v18M140 28v14M192 24v18M242 28v14" fill="none" stroke="#76503a" stroke-width="3" stroke-linecap="round" opacity=".84"/>
  <circle cx="72" cy="36" r="12" fill="url(#bamboo-glow)" opacity=".56"/>
  <circle cx="208" cy="36" r="12" fill="url(#bamboo-glow)" opacity=".56"/>
  <path d="M66 24h12v14c0 3.2-2.4 5-6 5s-6-1.8-6-5z" fill="url(#bamboo-lantern)" stroke="#7a5736" stroke-width="2" stroke-linejoin="round" opacity=".92"/>
  <path d="M202 24h12v14c0 3.2-2.4 5-6 5s-6-1.8-6-5z" fill="url(#bamboo-lantern)" stroke="#7a5736" stroke-width="2" stroke-linejoin="round" opacity=".92"/>
  <path d="M30 46c18 8 44 8 62 0M108 46c18 8 44 8 62 0M186 46c18 8 44 8 62 0" fill="none" stroke="#90bb74" stroke-width="4" stroke-linecap="round" opacity=".78"/>
  <path d="M52 48c0 10-4 18-8 28M126 48c2 12 0 20-4 30M222 48c-2 12-1 20 4 28" fill="none" stroke="#73a273" stroke-width="4" stroke-linecap="round" opacity=".76"/>
  `
);

const meadowPlatformTrimSvg = wrapStretchSvg(
  240,
  56,
  meadowDefs,
  `
  <path d="M18 18C52 10 188 10 222 18" fill="none" stroke="#d7efe1" stroke-width="8" stroke-linecap="round" opacity=".5"/>
  <path d="M18 24C56 16 184 16 222 24" fill="none" stroke="#ffffff" stroke-width="3.2" stroke-linecap="round" opacity=".84"/>
  <ellipse cx="52" cy="22" rx="12" ry="6.5" fill="url(#meadow-wool)" opacity=".88"/>
  <ellipse cx="122" cy="18" rx="14" ry="7.2" fill="url(#meadow-wool)" opacity=".86"/>
  <ellipse cx="192" cy="22" rx="12" ry="6.5" fill="url(#meadow-wool)" opacity=".88"/>
  <circle cx="40" cy="31" r="3" fill="#e8b9ff" stroke="#b67bd8" stroke-width="1.4"/>
  <circle cx="66" cy="29" r="3" fill="#f7f1ff" stroke="#b67bd8" stroke-width="1.4"/>
  <circle cx="110" cy="29" r="3" fill="#e8b9ff" stroke="#b67bd8" stroke-width="1.4"/>
  <circle cx="136" cy="31" r="3" fill="#f7f1ff" stroke="#b67bd8" stroke-width="1.4"/>
  <circle cx="180" cy="29" r="3" fill="#e8b9ff" stroke="#b67bd8" stroke-width="1.4"/>
  <circle cx="206" cy="31" r="3" fill="#f7f1ff" stroke="#b67bd8" stroke-width="1.4"/>
  <path d="M28 35c14 5 30 5 44 0M96 35c14 5 30 5 44 0M164 35c14 5 30 5 44 0" fill="none" stroke="#84bf8f" stroke-width="3" stroke-linecap="round" opacity=".72"/>
  `
);

const meadowGroundCapSvg = wrapStretchSvg(
  280,
  92,
  meadowDefs,
  `
  <path d="M18 20C56 10 224 10 262 20" fill="none" stroke="#d7efe1" stroke-width="10" stroke-linecap="round" opacity=".54"/>
  <path d="M18 28C58 18 222 18 262 28" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity=".84"/>
  <ellipse cx="58" cy="23" rx="16" ry="8.4" fill="url(#meadow-wool)" opacity=".9"/>
  <ellipse cx="140" cy="18" rx="18" ry="9" fill="url(#meadow-wool)" opacity=".88"/>
  <ellipse cx="222" cy="23" rx="16" ry="8.4" fill="url(#meadow-wool)" opacity=".9"/>
  <circle cx="44" cy="38" r="3.4" fill="#e8b9ff" stroke="#b67bd8" stroke-width="1.5"/>
  <circle cx="70" cy="34" r="3.4" fill="#f7f1ff" stroke="#b67bd8" stroke-width="1.5"/>
  <circle cx="118" cy="35" r="3.4" fill="#e8b9ff" stroke="#b67bd8" stroke-width="1.5"/>
  <circle cx="144" cy="39" r="3.4" fill="#f7f1ff" stroke="#b67bd8" stroke-width="1.5"/>
  <circle cx="192" cy="35" r="3.4" fill="#e8b9ff" stroke="#b67bd8" stroke-width="1.5"/>
  <circle cx="218" cy="39" r="3.4" fill="#f7f1ff" stroke="#b67bd8" stroke-width="1.5"/>
  <path d="M32 48c16 7 36 7 52 0M114 48c16 7 36 7 52 0M196 48c16 7 36 7 52 0" fill="none" stroke="#86c090" stroke-width="4" stroke-linecap="round" opacity=".74"/>
  <path d="M54 50c-6 8-8 14-8 24M136 50c0 10-2 16-6 26M226 50c4 8 6 14 8 22" fill="none" stroke="#93c89b" stroke-width="4" stroke-linecap="round" opacity=".68"/>
  `
);

const storyPlatformTrimSvg = wrapStretchSvg(
  240,
  56,
  storyDefs,
  `
  <path d="M18 17C52 8 188 8 222 17" fill="none" stroke="#cfe6a7" stroke-width="8" stroke-linecap="round" opacity=".48"/>
  <path d="M18 23C56 14 184 14 222 23" fill="none" stroke="#f6ecd8" stroke-width="3.4" stroke-linecap="round" opacity=".82"/>
  <path d="M26 28c10-7 22-7 32 0M82 28c10-7 22-7 32 0M138 28c10-7 22-7 32 0M194 28c10-7 22-7 32 0" fill="none" stroke="#8bc17a" stroke-width="3.2" stroke-linecap="round" opacity=".72"/>
  <path d="M36 16c6 5 12 6 18 3M112 14c7 6 13 7 20 4M188 16c6 5 12 6 18 3" fill="none" stroke="#fff3d4" stroke-width="2.8" stroke-linecap="round" opacity=".7"/>
  <path d="M56 28l2 4 4.4.7-3.2 3 .8 4.4-4-2.1-4 2.1.8-4.4-3.2-3 4.4-.7z" fill="#ffe6a5" stroke="#d7ac55" stroke-width="1.4" stroke-linejoin="round"/>
  <path d="M122 24l1.8 3.4 3.8.6-2.8 2.6.6 3.8-3.4-1.8-3.4 1.8.6-3.8-2.8-2.6 3.8-.6z" fill="#fff0bd" stroke="#d7ac55" stroke-width="1.2" stroke-linejoin="round"/>
  <path d="M188 28l2 4 4.4.7-3.2 3 .8 4.4-4-2.1-4 2.1.8-4.4-3.2-3 4.4-.7z" fill="#ffe6a5" stroke="#d7ac55" stroke-width="1.4" stroke-linejoin="round"/>
  `
);

const storyGroundCapSvg = wrapStretchSvg(
  280,
  92,
  storyDefs,
  `
  <path d="M18 19C56 9 224 9 262 19" fill="none" stroke="#cfe6a7" stroke-width="10" stroke-linecap="round" opacity=".5"/>
  <path d="M18 27C58 17 222 17 262 27" fill="none" stroke="#f7edd8" stroke-width="4" stroke-linecap="round" opacity=".84"/>
  <path d="M26 35c12-8 26-8 38 0M92 35c12-8 26-8 38 0M158 35c12-8 26-8 38 0M224 35c12-8 26-8 38 0" fill="none" stroke="#8bc17a" stroke-width="4" stroke-linecap="round" opacity=".74"/>
  <path d="M44 20c8 6 16 7 24 4M128 18c8 6 16 7 24 4M212 20c8 6 16 7 24 4" fill="none" stroke="#fff3d4" stroke-width="3" stroke-linecap="round" opacity=".7"/>
  <path d="M68 35l2.2 4.6 5 .8-3.6 3.4.8 5-4.4-2.3-4.4 2.3.8-5-3.6-3.4 5-.8z" fill="#ffe6a5" stroke="#d7ac55" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M140 29l1.8 3.6 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6z" fill="#fff0bd" stroke="#d7ac55" stroke-width="1.3" stroke-linejoin="round"/>
  <path d="M212 35l2.2 4.6 5 .8-3.6 3.4.8 5-4.4-2.3-4.4 2.3.8-5-3.6-3.4 5-.8z" fill="#ffe6a5" stroke="#d7ac55" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M52 52c-4 8-6 14-8 22M140 48c0 10-2 16-6 26M226 52c4 8 6 14 8 22" fill="none" stroke="#89b879" stroke-width="4" stroke-linecap="round" opacity=".68"/>
  `
);

const orchardPlatformTrimSvg = wrapStretchSvg(
  240,
  56,
  orchardDefs,
  `
  <path d="M18 16C52 7 188 7 222 16" fill="none" stroke="#b9df86" stroke-width="8" stroke-linecap="round" opacity=".5"/>
  <path d="M18 22C56 13 184 13 222 22" fill="none" stroke="#ffe1a1" stroke-width="3.4" stroke-linecap="round" opacity=".82"/>
  <path d="M26 27c12-9 24-11 40-10M92 22c12 0 22 2 36 10M148 27c12-9 24-11 40-10M214 22c-10 1-18 4-26 10" fill="none" stroke="url(#orchard-leaf)" stroke-width="4" stroke-linecap="round" opacity=".8"/>
  <circle cx="52" cy="27" r="4.2" fill="url(#orchard-fruit)" stroke="#cc711f" stroke-width="1.6"/>
  <circle cx="116" cy="24" r="4.6" fill="url(#orchard-fruit)" stroke="#cc711f" stroke-width="1.6"/>
  <circle cx="180" cy="27" r="4.2" fill="url(#orchard-fruit)" stroke="#cc711f" stroke-width="1.6"/>
  <path d="M34 34c14 5 30 5 44 0M98 34c14 5 30 5 44 0M162 34c14 5 30 5 44 0" fill="none" stroke="#f3d58f" stroke-width="3" stroke-linecap="round" opacity=".74"/>
  `
);

const orchardGroundCapSvg = wrapStretchSvg(
  280,
  92,
  orchardDefs,
  `
  <path d="M18 18C56 8 224 8 262 18" fill="none" stroke="#b9df86" stroke-width="10" stroke-linecap="round" opacity=".52"/>
  <path d="M18 26C58 16 222 16 262 26" fill="none" stroke="#ffe2a6" stroke-width="4" stroke-linecap="round" opacity=".84"/>
  <path d="M28 34c14-10 28-12 46-11M104 22c14 0 26 4 42 12M162 34c14-10 28-12 46-11M252 23c-12 1-22 5-32 11" fill="none" stroke="url(#orchard-leaf)" stroke-width="5" stroke-linecap="round" opacity=".82"/>
  <circle cx="58" cy="34" r="4.8" fill="url(#orchard-fruit)" stroke="#cc711f" stroke-width="1.8"/>
  <circle cx="138" cy="28" r="5.2" fill="url(#orchard-fruit)" stroke="#cc711f" stroke-width="1.8"/>
  <circle cx="216" cy="34" r="4.8" fill="url(#orchard-fruit)" stroke="#cc711f" stroke-width="1.8"/>
  <path d="M36 46c16 6 34 6 50 0M114 46c16 6 34 6 50 0M192 46c16 6 34 6 50 0" fill="none" stroke="#f3d58f" stroke-width="4" stroke-linecap="round" opacity=".74"/>
  <path d="M64 48c-4 8-6 14-8 22M140 48c0 10-2 16-6 26M214 48c4 8 6 14 8 22" fill="none" stroke="#79b05c" stroke-width="4" stroke-linecap="round" opacity=".68"/>
  `
);

const prairiePlatformTrimSvg = wrapStretchSvg(
  240,
  56,
  prairieDefs,
  `
  <path d="M18 17C52 8 188 8 222 17" fill="none" stroke="#cfe9ff" stroke-width="8" stroke-linecap="round" opacity=".48"/>
  <path d="M18 23C56 14 184 14 222 23" fill="none" stroke="#f8fbff" stroke-width="3.2" stroke-linecap="round" opacity=".84"/>
  <path d="M28 31c12-10 24-10 36 0M92 31c12-10 24-10 36 0M156 31c12-10 24-10 36 0" fill="none" stroke="#9bc5ff" stroke-width="3.4" stroke-linecap="round" opacity=".76"/>
  <path d="M44 22c3-7 7-9 11-7-2 3-2 6-1 10-4 0-7-1-10-3z" fill="url(#prairie-petal)" stroke="#4d67d8" stroke-width="1.5"/>
  <path d="M118 18c3-7 7-9 11-7-2 3-2 6-1 10-4 0-7-1-10-3z" fill="url(#prairie-petal)" stroke="#4d67d8" stroke-width="1.5"/>
  <path d="M192 22c3-7 7-9 11-7-2 3-2 6-1 10-4 0-7-1-10-3z" fill="url(#prairie-petal)" stroke="#4d67d8" stroke-width="1.5"/>
  <circle cx="70" cy="28" r="6.5" fill="url(#prairie-firefly)" opacity=".58"/>
  <circle cx="170" cy="28" r="6.5" fill="url(#prairie-firefly)" opacity=".58"/>
  `
);

const prairieGroundCapSvg = wrapStretchSvg(
  280,
  92,
  prairieDefs,
  `
  <path d="M18 19C56 9 224 9 262 19" fill="none" stroke="#cfe9ff" stroke-width="10" stroke-linecap="round" opacity=".52"/>
  <path d="M18 27C58 17 222 17 262 27" fill="none" stroke="#f8fbff" stroke-width="4" stroke-linecap="round" opacity=".84"/>
  <path d="M30 38c14-12 28-12 42 0M104 38c14-12 28-12 42 0M178 38c14-12 28-12 42 0" fill="none" stroke="#9bc5ff" stroke-width="4" stroke-linecap="round" opacity=".76"/>
  <path d="M48 24c3-8 7-10 12-8-2 4-2 7-1 11-4 1-8-1-11-3z" fill="url(#prairie-petal)" stroke="#4d67d8" stroke-width="1.6"/>
  <path d="M136 20c3-8 7-10 12-8-2 4-2 7-1 11-4 1-8-1-11-3z" fill="url(#prairie-petal)" stroke="#4d67d8" stroke-width="1.6"/>
  <path d="M224 24c3-8 7-10 12-8-2 4-2 7-1 11-4 1-8-1-11-3z" fill="url(#prairie-petal)" stroke="#4d67d8" stroke-width="1.6"/>
  <circle cx="84" cy="31" r="9" fill="url(#prairie-firefly)" opacity=".6"/>
  <circle cx="194" cy="31" r="9" fill="url(#prairie-firefly)" opacity=".6"/>
  <path d="M64 48c-4 8-6 14-8 22M140 48c0 10-2 16-6 26M214 48c4 8 6 14 8 22" fill="none" stroke="#7db07a" stroke-width="4" stroke-linecap="round" opacity=".68"/>
  `
);

const entries = [
  ['world/lantern-bamboo-valley/props', 'tea-table.svg', teaTableSvg],
  ['world/lantern-bamboo-valley/landmark', 'lantern-stand.svg', lanternStandSvg],
  ['world/lantern-bamboo-valley/gate', 'sky-lantern-gate.svg', skyLanternGateSvg],
  ['world/lantern-bamboo-valley/platform', 'trim.svg', bambooPlatformTrimSvg],
  ['world/lantern-bamboo-valley/ground', 'cap.svg', bambooGroundCapSvg],
  ['world/highland-meadow/props', 'wool-cart.svg', woolCartSvg],
  ['world/highland-meadow/landmark', 'stone-circle.svg', stoneCircleSvg],
  ['world/highland-meadow/gate', 'breeze-arch.svg', breezeArchSvg],
  ['world/highland-meadow/platform', 'trim.svg', meadowPlatformTrimSvg],
  ['world/highland-meadow/ground', 'cap.svg', meadowGroundCapSvg],
  ['world/storybook-forest/props', 'mushroom-house.svg', mushroomHouseSvg],
  ['world/storybook-forest/landmark', 'story-tree.svg', storyTreeSvg],
  ['world/storybook-forest/gate', 'page-arch.svg', pageArchSvg],
  ['world/storybook-forest/platform', 'trim.svg', storyPlatformTrimSvg],
  ['world/storybook-forest/ground', 'cap.svg', storyGroundCapSvg],
  ['world/sun-orchard/props', 'mirror-stand.svg', mirrorStandSvg],
  ['world/sun-orchard/landmark', 'citrus-arbor.svg', citrusArborSvg],
  ['world/sun-orchard/gate', 'golden-arbor.svg', goldenArborGateSvg],
  ['world/sun-orchard/platform', 'trim.svg', orchardPlatformTrimSvg],
  ['world/sun-orchard/ground', 'cap.svg', orchardGroundCapSvg],
  ['world/bluebonnet-prairie/props', 'windmill-post.svg', windmillPostSvg],
  ['world/bluebonnet-prairie/landmark', 'bluebonnet-patch.svg', bluebonnetPatchSvg],
  ['world/bluebonnet-prairie/gate', 'windmill-gate.svg', windmillGateSvg],
  ['world/bluebonnet-prairie/platform', 'trim.svg', prairiePlatformTrimSvg],
  ['world/bluebonnet-prairie/ground', 'cap.svg', prairieGroundCapSvg],
];

entries.forEach(([folder, filename, svg]) => writeSprite(folder, filename, svg));

console.log('Generated world scene prop, landmark, gate, platform, and ground sprites.');
