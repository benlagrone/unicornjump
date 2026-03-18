const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const creatureRoot = path.join(projectRoot, 'public/assets/images/creature');

const writeSprite = (folder, filename, svg) => {
  const outputPath = path.join(creatureRoot, folder, filename);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${svg.trim()}\n`);
};

const wrapSvg = (defs, body) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  ${defs}
  ${body}
</svg>
`;

const mirror = (body) => `<g transform="translate(128 0) scale(-1 1)">${body}</g>`;

const gnomeDefs = `
<defs>
  <linearGradient id="gnome-hat" x1=".35" y1="0" x2=".8" y2="1">
    <stop offset="0" stop-color="#dcc3ff"/>
    <stop offset=".45" stop-color="#9b74ea"/>
    <stop offset="1" stop-color="#6b43be"/>
  </linearGradient>
  <linearGradient id="gnome-brim" x1=".5" y1="0" x2=".5" y2="1">
    <stop offset="0" stop-color="#f5e9ff"/>
    <stop offset="1" stop-color="#b59af1"/>
  </linearGradient>
  <linearGradient id="gnome-coat" x1=".3" y1="0" x2=".7" y2="1">
    <stop offset="0" stop-color="#bce59f"/>
    <stop offset=".45" stop-color="#6faf6b"/>
    <stop offset="1" stop-color="#427f55"/>
  </linearGradient>
  <linearGradient id="gnome-sleeve" x1=".4" y1="0" x2=".6" y2="1">
    <stop offset="0" stop-color="#cbf0b4"/>
    <stop offset="1" stop-color="#5d9a67"/>
  </linearGradient>
  <linearGradient id="gnome-skin" x1=".35" y1="0" x2=".7" y2="1">
    <stop offset="0" stop-color="#ffe7d6"/>
    <stop offset="1" stop-color="#efb899"/>
  </linearGradient>
  <linearGradient id="gnome-beard" x1=".3" y1="0" x2=".75" y2="1">
    <stop offset="0" stop-color="#fffef8"/>
    <stop offset=".7" stop-color="#f2e0c0"/>
    <stop offset="1" stop-color="#d5bd96"/>
  </linearGradient>
  <linearGradient id="gnome-boot" x1=".5" y1="0" x2=".5" y2="1">
    <stop offset="0" stop-color="#9f7d57"/>
    <stop offset="1" stop-color="#6b4f37"/>
  </linearGradient>
  <radialGradient id="gnome-star" cx=".35" cy=".35" r=".7">
    <stop offset="0" stop-color="#fff7bf"/>
    <stop offset=".65" stop-color="#ffd867"/>
    <stop offset="1" stop-color="#f0aa1c"/>
  </radialGradient>
</defs>
`;

const gnomeFace = (state, side = false) => {
  const mouth =
    state === 'talk'
      ? side
        ? '<ellipse cx="43" cy="71" rx="4.6" ry="3.8" fill="#855245" stroke="#6f4e3f" stroke-width="2"/>'
        : '<ellipse cx="64" cy="74" rx="5" ry="4.2" fill="#855245" stroke="#6f4e3f" stroke-width="2"/>'
      : state === 'happy'
        ? side
          ? '<path d="M39 72c4 5 9 6 14 2" fill="none" stroke="#6f4e3f" stroke-width="3" stroke-linecap="round"/>'
          : '<path d="M56 74c5 5 11 5 16 0" fill="none" stroke="#6f4e3f" stroke-width="3.2" stroke-linecap="round"/>'
        : side
          ? '<path d="M40 72c3 2 7 2 10 0" fill="none" stroke="#6f4e3f" stroke-width="2.6" stroke-linecap="round"/>'
          : '<path d="M58 74c4 3 8 3 12 0" fill="none" stroke="#6f4e3f" stroke-width="2.8" stroke-linecap="round"/>';

  const eyes =
    state === 'happy'
      ? side
        ? `
          <path d="M47 59c3-3 6-3 9 0" fill="none" stroke="#1d2639" stroke-width="3.2" stroke-linecap="round"/>
        `
        : `
          <path d="M49 60c4-4 8-4 12 0" fill="none" stroke="#1d2639" stroke-width="3.2" stroke-linecap="round"/>
          <path d="M67 60c4-4 8-4 12 0" fill="none" stroke="#1d2639" stroke-width="3.2" stroke-linecap="round"/>
        `
      : side
        ? `
          <ellipse cx="52" cy="61" rx="4.2" ry="5.8" fill="#1d2639"/>
          <circle cx="53" cy="59.5" r="1.2" fill="#fff"/>
        `
        : `
          <ellipse cx="56" cy="61" rx="4.1" ry="5.8" fill="#1d2639"/>
          <ellipse cx="72" cy="61" rx="4.1" ry="5.8" fill="#1d2639"/>
          <circle cx="57" cy="59.5" r="1.2" fill="#fff"/>
          <circle cx="73" cy="59.5" r="1.2" fill="#fff"/>
        `;

  return `
    ${eyes}
    ${mouth}
  `;
};

const gnomeFront = (state) => {
  const talkArm =
    state === 'talk'
      ? `
        <path d="M89 80c8-9 13-11 18-8" fill="none" stroke="#4f885d" stroke-width="5" stroke-linecap="round"/>
        <rect x="100" y="65" width="10" height="14" rx="2" fill="#f8e7a6" stroke="#8f6c41" stroke-width="2.4"/>
      `
      : '';
  const sparkle =
    state === 'happy'
      ? `
        <path d="M98 28l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="url(#gnome-star)" stroke="#b18217" stroke-width="2" stroke-linejoin="round"/>
      `
      : '';

  return wrapSvg(
    gnomeDefs,
    `
    <ellipse cx="64" cy="112" rx="28" ry="8" fill="#a58d67" opacity=".22"/>
    <ellipse cx="49" cy="103" rx="10" ry="8" fill="url(#gnome-boot)" stroke="#5b4736" stroke-width="3.4"/>
    <ellipse cx="79" cy="103" rx="10" ry="8" fill="url(#gnome-boot)" stroke="#5b4736" stroke-width="3.4"/>
    <path d="M44 80c1-18 11-30 28-30 20 0 31 14 31 35v17H43z" fill="url(#gnome-coat)" stroke="#3f6f4f" stroke-width="4.6" stroke-linejoin="round"/>
    <path d="M50 88c7 6 15 9 24 9 8 0 16-2 24-8v14H50z" fill="#d9f1c9" opacity=".28"/>
    <ellipse cx="39" cy="82" rx="8.4" ry="12" fill="url(#gnome-sleeve)" stroke="#3f6f4f" stroke-width="4"/>
    <ellipse cx="89" cy="82" rx="8.4" ry="12" fill="url(#gnome-sleeve)" stroke="#3f6f4f" stroke-width="4"/>
    <circle cx="34" cy="88" r="5.2" fill="url(#gnome-skin)" stroke="#7c6050" stroke-width="3"/>
    <circle cx="94" cy="88" r="5.2" fill="url(#gnome-skin)" stroke="#7c6050" stroke-width="3"/>
    ${talkArm}
    <path d="M43 49c2-21 10-34 21-39 15 4 24 18 28 39l1 5H42z" fill="url(#gnome-hat)" stroke="#60409b" stroke-width="5" stroke-linejoin="round"/>
    <ellipse cx="64" cy="50" rx="30" ry="8.5" fill="url(#gnome-brim)" stroke="#60409b" stroke-width="4.2"/>
    <path d="M67 13c6 2 11 7 15 15" fill="none" stroke="#ffe291" stroke-width="3" stroke-linecap="round"/>
    <circle cx="83" cy="22" r="4.6" fill="url(#gnome-star)" stroke="#b18217" stroke-width="2.2"/>
    ${sparkle}
    <path d="M64 48c-16 0-27 11-27 28 0 18 10 31 27 39 17-8 27-21 27-39 0-17-11-28-27-28z" fill="url(#gnome-beard)" stroke="#9c8563" stroke-width="4.2"/>
    <path d="M54 77c3 8 6 13 10 16 4-3 7-8 10-16" fill="#fffef8" opacity=".76"/>
    <ellipse cx="64" cy="58" rx="18" ry="15" fill="url(#gnome-skin)" stroke="#7c6050" stroke-width="4.2"/>
    <ellipse cx="64" cy="66" rx="6.2" ry="5.2" fill="#e5a08b" stroke="#7c6050" stroke-width="2.4"/>
    <ellipse cx="50" cy="68" rx="4.4" ry="2.4" fill="#f4a5b0" opacity=".38"/>
    <ellipse cx="78" cy="68" rx="4.4" ry="2.4" fill="#f4a5b0" opacity=".38"/>
    ${gnomeFace(state)}
    <path d="M64 34l4 4-4 5-4-5z" fill="#fff9d2" opacity=".72"/>
    <path d="M64 86l5 6-5 7-5-7z" fill="url(#gnome-star)" stroke="#b18217" stroke-width="2.2" stroke-linejoin="round"/>
    `
  );
};

const gnomeSideBase = (state) => {
  const talkProp =
    state === 'talk'
      ? `
        <path d="M91 80c8-6 13-7 16-3" fill="none" stroke="#538a61" stroke-width="4.6" stroke-linecap="round"/>
        <rect x="101" y="69" width="10" height="13" rx="2" fill="#f8e7a6" stroke="#8f6c41" stroke-width="2.2"/>
      `
      : '';
  const sparkle =
    state === 'happy'
      ? '<path d="M96 34l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="url(#gnome-star)" stroke="#b18217" stroke-width="2" stroke-linejoin="round"/>'
      : '';

  return `
    <ellipse cx="62" cy="112" rx="28" ry="8" fill="#a58d67" opacity=".22"/>
    <ellipse cx="52" cy="104" rx="10" ry="8" fill="url(#gnome-boot)" stroke="#5b4736" stroke-width="3.4"/>
    <ellipse cx="79" cy="105" rx="9.5" ry="7.5" fill="url(#gnome-boot)" stroke="#5b4736" stroke-width="3.2"/>
    <path d="M48 81c1-20 15-31 32-31 16 0 28 8 34 22l-4 30H52z" fill="url(#gnome-coat)" stroke="#3f6f4f" stroke-width="4.6" stroke-linejoin="round"/>
    <path d="M57 88c8 4 16 6 24 5 5-1 11-3 18-8l-1 14H57z" fill="#d9f1c9" opacity=".28"/>
    <ellipse cx="46" cy="84" rx="7.8" ry="11.8" fill="url(#gnome-sleeve)" stroke="#3f6f4f" stroke-width="4"/>
    <circle cx="42" cy="90" r="5" fill="url(#gnome-skin)" stroke="#7c6050" stroke-width="3"/>
    ${talkProp}
    <path d="M48 50c3-18 12-30 26-36 14 3 24 15 30 36l1 4H46z" fill="url(#gnome-hat)" stroke="#60409b" stroke-width="5" stroke-linejoin="round"/>
    <ellipse cx="72" cy="51" rx="30" ry="8.2" fill="url(#gnome-brim)" stroke="#60409b" stroke-width="4.2"/>
    <circle cx="94" cy="23" r="4.5" fill="url(#gnome-star)" stroke="#b18217" stroke-width="2.2"/>
    ${sparkle}
    <path d="M66 50c-16 0-28 10-28 26 0 18 10 32 26 39 10-2 18-10 23-21-11-5-17-15-17-30 0-4 1-9 2-14z" fill="url(#gnome-beard)" stroke="#9c8563" stroke-width="4.2"/>
    <path d="M58 81c4 7 8 11 13 12" fill="#fffef8" opacity=".76"/>
    <ellipse cx="61" cy="59" rx="17" ry="14" fill="url(#gnome-skin)" stroke="#7c6050" stroke-width="4.2"/>
    <ellipse cx="46" cy="63" rx="6.8" ry="5.2" fill="#e5a08b" stroke="#7c6050" stroke-width="2.6"/>
    <ellipse cx="56" cy="70" rx="4.2" ry="2.2" fill="#f4a5b0" opacity=".38"/>
    ${gnomeFace(state, true)}
    <path d="M82 88l5 6-5 7-5-7z" fill="url(#gnome-star)" stroke="#b18217" stroke-width="2.2" stroke-linejoin="round"/>
  `;
};

const gnomeSide = (state, angle) =>
  wrapSvg(gnomeDefs, angle === 'left' ? gnomeSideBase(state) : mirror(gnomeSideBase(state)));

const birdDefs = `
<defs>
  <radialGradient id="bird-body" cx=".32" cy=".2" r=".95">
    <stop offset="0" stop-color="#ffe2bf"/>
    <stop offset=".55" stop-color="#ffb366"/>
    <stop offset="1" stop-color="#ed7a24"/>
  </radialGradient>
  <linearGradient id="bird-wing" x1=".2" y1=".2" x2=".9" y2=".9">
    <stop offset="0" stop-color="#fff1c7"/>
    <stop offset=".55" stop-color="#ffc46d"/>
    <stop offset="1" stop-color="#f08a30"/>
  </linearGradient>
  <linearGradient id="bird-belly" x1=".5" y1="0" x2=".5" y2="1">
    <stop offset="0" stop-color="#fffdf7"/>
    <stop offset="1" stop-color="#ffe0a5"/>
  </linearGradient>
  <linearGradient id="bird-beak" x1=".3" y1="0" x2=".8" y2="1">
    <stop offset="0" stop-color="#fff2a3"/>
    <stop offset=".55" stop-color="#ffc14b"/>
    <stop offset="1" stop-color="#eb8e16"/>
  </linearGradient>
  <linearGradient id="bird-feet" x1=".5" y1="0" x2=".5" y2="1">
    <stop offset="0" stop-color="#f3a563"/>
    <stop offset="1" stop-color="#c96b2c"/>
  </linearGradient>
  <radialGradient id="bird-sparkle" cx=".35" cy=".35" r=".7">
    <stop offset="0" stop-color="#fff8c4"/>
    <stop offset=".6" stop-color="#ffd866"/>
    <stop offset="1" stop-color="#f0a51d"/>
  </radialGradient>
</defs>
`;

const birdFront = (state) => {
  const eyes =
    state === 'happy'
      ? `
        <path d="M49 56c4-4 8-4 12 0" fill="none" stroke="#213046" stroke-width="3.2" stroke-linecap="round"/>
        <path d="M67 56c4-4 8-4 12 0" fill="none" stroke="#213046" stroke-width="3.2" stroke-linecap="round"/>
      `
      : `
        <ellipse cx="55" cy="58" rx="4" ry="5.8" fill="#213046"/>
        <ellipse cx="73" cy="58" rx="4" ry="5.8" fill="#213046"/>
        <circle cx="56" cy="56.3" r="1.2" fill="#fff"/>
        <circle cx="74" cy="56.3" r="1.2" fill="#fff"/>
      `;

  const beak =
    state === 'talk'
      ? `
        <path d="M64 65 76 61 64 58 52 61z" fill="url(#bird-beak)" stroke="#a85f18" stroke-width="3" stroke-linejoin="round"/>
        <path d="M52 61 64 67 76 61" fill="none" stroke="#a85f18" stroke-width="2.4" stroke-linejoin="round"/>
      `
      : '<path d="M64 61 76 57 64 53 52 57z" fill="url(#bird-beak)" stroke="#a85f18" stroke-width="3" stroke-linejoin="round"/>';

  const wingPoseLeft =
    state === 'happy'
      ? 'M40 74c-15 1-24 11-24 23 10 1 22-4 31-13 3-3 6-7 8-12-4-3-9-4-15-2z'
      : state === 'talk'
        ? 'M40 72c-14 2-22 12-21 23 10 0 21-5 29-13 3-3 5-6 7-10-4-3-9-4-15 0z'
        : 'M42 75c-13 3-20 13-19 22 9 1 18-3 26-10 3-3 5-6 7-11-4-3-8-4-14-1z';
  const wingPoseRight =
    state === 'happy'
      ? 'M88 74c15 1 24 11 24 23-10 1-22-4-31-13-3-3-6-7-8-12 4-3 9-4 15-2z'
      : state === 'talk'
        ? 'M88 72c14 2 22 12 21 23-10 0-21-5-29-13-3-3-5-6-7-10 4-3 9-4 15 0z'
        : 'M86 75c13 3 20 13 19 22-9 1-18-3-26-10-3-3-5-6-7-11 4-3 8-4 14-1z';
  const sparkle =
    state === 'happy'
      ? '<path d="M96 27l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="url(#bird-sparkle)" stroke="#b17a1d" stroke-width="2" stroke-linejoin="round"/>'
      : '';

  return wrapSvg(
    birdDefs,
    `
    <ellipse cx="64" cy="112" rx="28" ry="8" fill="#dba66d" opacity=".22"/>
    <path d="M50 104c-1-7 2-12 8-15" fill="none" stroke="#cb742e" stroke-width="3.2" stroke-linecap="round"/>
    <path d="M78 104c1-7-2-12-8-15" fill="none" stroke="#cb742e" stroke-width="3.2" stroke-linecap="round"/>
    <ellipse cx="49" cy="106" rx="6" ry="3.6" fill="url(#bird-feet)"/>
    <ellipse cx="79" cy="106" rx="6" ry="3.6" fill="url(#bird-feet)"/>
    <path d="M53 94c4 3 8 5 11 6 3-1 7-3 11-6l9 8H44z" fill="#d66f28" opacity=".34"/>
    <path d="${wingPoseLeft}" fill="url(#bird-wing)" stroke="#a46020" stroke-width="4.2" stroke-linejoin="round"/>
    <path d="${wingPoseRight}" fill="url(#bird-wing)" stroke="#a46020" stroke-width="4.2" stroke-linejoin="round"/>
    <ellipse cx="64" cy="80" rx="29" ry="24" fill="url(#bird-body)" stroke="#a46020" stroke-width="5"/>
    <ellipse cx="64" cy="54" rx="22" ry="21" fill="url(#bird-body)" stroke="#a46020" stroke-width="5"/>
    <ellipse cx="64" cy="79" rx="18" ry="22" fill="url(#bird-belly)"/>
    <path d="M53 88c3 7 7 12 11 15 4-3 8-8 11-15" fill="#fff4c7" opacity=".58"/>
    <path d="M64 33c3-9 8-13 15-14-2 8-1 14 2 19" fill="none" stroke="#f7d279" stroke-width="4" stroke-linecap="round"/>
    <path d="M60 32c1-9 5-14 11-17 0 8 2 14 6 18" fill="none" stroke="#ff9db0" stroke-width="4" stroke-linecap="round"/>
    <path d="M68 32c6-6 12-8 18-6-4 6-5 12-4 18" fill="none" stroke="#95e2a0" stroke-width="4" stroke-linecap="round"/>
    <path d="M39 72c4-5 8-8 13-10" fill="none" stroke="#ffe8b5" stroke-opacity=".58" stroke-width="2.8" stroke-linecap="round"/>
    <path d="M89 72c-4-5-8-8-13-10" fill="none" stroke="#ffe8b5" stroke-opacity=".58" stroke-width="2.8" stroke-linecap="round"/>
    ${eyes}
    ${beak}
    <ellipse cx="47" cy="66" rx="4.2" ry="2.4" fill="#f5a7b8" opacity=".36"/>
    <ellipse cx="81" cy="66" rx="4.2" ry="2.4" fill="#f5a7b8" opacity=".36"/>
    ${sparkle}
    `
  );
};

const birdSideBase = (state) => {
  const eye =
    state === 'happy'
      ? '<path d="M46 56c4-4 8-4 11 0" fill="none" stroke="#213046" stroke-width="3.2" stroke-linecap="round"/>'
      : `
        <ellipse cx="50" cy="58" rx="4" ry="5.7" fill="#213046"/>
        <circle cx="51" cy="56.5" r="1.2" fill="#fff"/>
      `;
  const beak =
    state === 'talk'
      ? `
        <path d="M31 60 19 54 31 50 45 55z" fill="url(#bird-beak)" stroke="#a85f18" stroke-width="3" stroke-linejoin="round"/>
        <path d="M19 54 31 61 45 55" fill="none" stroke="#a85f18" stroke-width="2.4" stroke-linejoin="round"/>
      `
      : '<path d="M32 58 20 53 32 48 46 53z" fill="url(#bird-beak)" stroke="#a85f18" stroke-width="3" stroke-linejoin="round"/>';
  const wingPath =
    state === 'happy'
      ? 'M67 76c-5 10-5 20 1 28 14-1 24-8 31-20-6-7-16-11-32-8z'
      : state === 'talk'
        ? 'M66 76c-7 8-9 18-4 27 13 0 23-6 30-16-4-8-12-12-26-11z'
        : 'M68 77c-6 7-8 16-5 24 12 0 21-5 28-14-4-7-11-11-23-10z';
  const sparkle =
    state === 'happy'
      ? '<path d="M92 37l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="url(#bird-sparkle)" stroke="#b17a1d" stroke-width="2" stroke-linejoin="round"/>'
      : '';

  return `
    <ellipse cx="65" cy="112" rx="29" ry="8" fill="#dba66d" opacity=".22"/>
    <path d="M52 104c-1-7 1-12 6-15" fill="none" stroke="#cb742e" stroke-width="3.2" stroke-linecap="round"/>
    <ellipse cx="52" cy="106" rx="6" ry="3.6" fill="url(#bird-feet)"/>
    <ellipse cx="74" cy="106" rx="6" ry="3.6" fill="url(#bird-feet)"/>
    <path d="M95 78c10 4 15 10 17 18-10 2-20 0-27-4z" fill="#d66f28" opacity=".34"/>
    <ellipse cx="72" cy="82" rx="30" ry="24" fill="url(#bird-body)" stroke="#a46020" stroke-width="5"/>
    <circle cx="51" cy="56" r="20" fill="url(#bird-body)" stroke="#a46020" stroke-width="5"/>
    <ellipse cx="62" cy="83" rx="16" ry="20" fill="url(#bird-belly)"/>
    <path d="${wingPath}" fill="url(#bird-wing)" stroke="#a46020" stroke-width="4.2" stroke-linejoin="round"/>
    <path d="M62 35c3-8 8-12 14-13-2 7-1 13 1 17" fill="none" stroke="#f7d279" stroke-width="4" stroke-linecap="round"/>
    <path d="M58 34c1-9 5-14 10-16 0 8 2 13 5 17" fill="none" stroke="#ff9db0" stroke-width="4" stroke-linecap="round"/>
    <path d="M66 34c6-5 12-7 16-5-3 6-4 11-3 17" fill="none" stroke="#95e2a0" stroke-width="4" stroke-linecap="round"/>
    ${eye}
    ${beak}
    <ellipse cx="42" cy="66" rx="4" ry="2.3" fill="#f5a7b8" opacity=".36"/>
    ${sparkle}
  `;
};

const birdSide = (state, angle) =>
  wrapSvg(birdDefs, angle === 'left' ? birdSideBase(state) : mirror(birdSideBase(state)));

const armadilloDefs = `
<defs>
  <radialGradient id="arm-shell" cx=".35" cy=".28" r=".95">
    <stop offset="0" stop-color="#dfe8ff"/>
    <stop offset=".52" stop-color="#9cadde"/>
    <stop offset="1" stop-color="#6679b6"/>
  </radialGradient>
  <linearGradient id="arm-shell-band" x1=".5" y1="0" x2=".5" y2="1">
    <stop offset="0" stop-color="#f7fbff"/>
    <stop offset="1" stop-color="#b8c7ef"/>
  </linearGradient>
  <linearGradient id="arm-skin" x1=".3" y1="0" x2=".7" y2="1">
    <stop offset="0" stop-color="#fff2e7"/>
    <stop offset="1" stop-color="#deb8a1"/>
  </linearGradient>
  <linearGradient id="arm-belly" x1=".5" y1="0" x2=".5" y2="1">
    <stop offset="0" stop-color="#fffef9"/>
    <stop offset="1" stop-color="#f5dfce"/>
  </linearGradient>
  <linearGradient id="arm-claw" x1=".5" y1="0" x2=".5" y2="1">
    <stop offset="0" stop-color="#f7b6c4"/>
    <stop offset="1" stop-color="#dc6b96"/>
  </linearGradient>
  <radialGradient id="arm-sparkle" cx=".35" cy=".35" r=".7">
    <stop offset="0" stop-color="#fff8c6"/>
    <stop offset=".6" stop-color="#dce9ff"/>
    <stop offset="1" stop-color="#8fb1ff"/>
  </radialGradient>
</defs>
`;

const armadilloFront = (state) => {
  const eyes =
    state === 'happy'
      ? `
        <path d="M48 57c4-4 8-4 12 0" fill="none" stroke="#27304a" stroke-width="3.2" stroke-linecap="round"/>
        <path d="M68 57c4-4 8-4 12 0" fill="none" stroke="#27304a" stroke-width="3.2" stroke-linecap="round"/>
      `
      : `
        <ellipse cx="54" cy="59" rx="4" ry="5.7" fill="#27304a"/>
        <ellipse cx="74" cy="59" rx="4" ry="5.7" fill="#27304a"/>
        <circle cx="55" cy="57.4" r="1.2" fill="#fff"/>
        <circle cx="75" cy="57.4" r="1.2" fill="#fff"/>
      `;
  const mouth =
    state === 'talk'
      ? '<ellipse cx="64" cy="75" rx="5" ry="4" fill="#8c5960" stroke="#7f6166" stroke-width="2"/>'
      : state === 'happy'
        ? '<path d="M57 74c5 5 11 5 14 0" fill="none" stroke="#7f6166" stroke-width="3" stroke-linecap="round"/>'
        : '<path d="M58 74c4 3 8 3 12 0" fill="none" stroke="#7f6166" stroke-width="2.6" stroke-linecap="round"/>';
  const raisedArms =
    state === 'happy'
      ? `
        <ellipse cx="40" cy="83" rx="8" ry="11" fill="url(#arm-skin)" stroke="#7f6166" stroke-width="3.6"/>
        <ellipse cx="88" cy="83" rx="8" ry="11" fill="url(#arm-skin)" stroke="#7f6166" stroke-width="3.6"/>
      `
      : `
        <ellipse cx="42" cy="91" rx="8" ry="10" fill="url(#arm-skin)" stroke="#7f6166" stroke-width="3.6"/>
        <ellipse cx="86" cy="91" rx="8" ry="10" fill="url(#arm-skin)" stroke="#7f6166" stroke-width="3.6"/>
      `;
  const sparkle =
    state === 'happy'
      ? '<path d="M95 27l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="url(#arm-sparkle)" stroke="#7c95df" stroke-width="2" stroke-linejoin="round"/>'
      : '';

  return wrapSvg(
    armadilloDefs,
    `
    <ellipse cx="64" cy="112" rx="28" ry="8" fill="#a3aed8" opacity=".24"/>
    <path d="M29 93c0-31 16-50 35-50s35 19 35 50v6H29z" fill="url(#arm-shell)" stroke="#6272aa" stroke-width="5" stroke-linejoin="round"/>
    <path d="M40 52c-6 9-10 23-10 39" fill="none" stroke="url(#arm-shell-band)" stroke-width="5" stroke-linecap="round"/>
    <path d="M53 45c-3 11-5 29-4 54" fill="none" stroke="url(#arm-shell-band)" stroke-width="5" stroke-linecap="round"/>
    <path d="M64 43v56" fill="none" stroke="url(#arm-shell-band)" stroke-width="5" stroke-linecap="round"/>
    <path d="M75 45c3 11 5 29 4 54" fill="none" stroke="url(#arm-shell-band)" stroke-width="5" stroke-linecap="round"/>
    <path d="M88 52c6 9 10 23 10 39" fill="none" stroke="url(#arm-shell-band)" stroke-width="5" stroke-linecap="round"/>
    <path d="M43 74c-9 6-15 14-16 25" fill="none" stroke="#93a7e6" stroke-width="3.4" stroke-linecap="round" opacity=".58"/>
    <path d="M85 74c9 6 15 14 16 25" fill="none" stroke="#93a7e6" stroke-width="3.4" stroke-linecap="round" opacity=".58"/>
    <path d="M36 94c-8 6-11 10-10 14" fill="none" stroke="#7f6166" stroke-width="4" stroke-linecap="round"/>
    <ellipse cx="64" cy="84" rx="24" ry="19" fill="url(#arm-belly)" stroke="#7f6166" stroke-width="4.2"/>
    ${raisedArms}
    <ellipse cx="64" cy="60" rx="19" ry="17" fill="url(#arm-skin)" stroke="#7f6166" stroke-width="4.2"/>
    <path d="M49 50 42 39l12 3z" fill="#f6c3d1" stroke="#7f6166" stroke-width="3.2" stroke-linejoin="round"/>
    <path d="M79 50 86 39l-12 3z" fill="#f6c3d1" stroke="#7f6166" stroke-width="3.2" stroke-linejoin="round"/>
    <ellipse cx="64" cy="69" rx="11" ry="9" fill="#f4dbc9" stroke="#7f6166" stroke-width="3"/>
    ${eyes}
    <ellipse cx="49" cy="68" rx="4.2" ry="2.3" fill="#f4a5b0" opacity=".36"/>
    <ellipse cx="79" cy="68" rx="4.2" ry="2.3" fill="#f4a5b0" opacity=".36"/>
    ${mouth}
    <ellipse cx="50" cy="103" rx="8" ry="5.2" fill="url(#arm-claw)"/>
    <ellipse cx="64" cy="106" rx="8.5" ry="5.2" fill="url(#arm-claw)"/>
    <ellipse cx="78" cy="103" rx="8" ry="5.2" fill="url(#arm-claw)"/>
    ${sparkle}
    `
  );
};

const armadilloSideBase = (state) => {
  const eye =
    state === 'happy'
      ? '<path d="M42 57c4-4 8-4 11 0" fill="none" stroke="#27304a" stroke-width="3.2" stroke-linecap="round"/>'
      : `
        <ellipse cx="46" cy="59" rx="4" ry="5.7" fill="#27304a"/>
        <circle cx="47" cy="57.4" r="1.2" fill="#fff"/>
      `;
  const mouth =
    state === 'talk'
      ? '<ellipse cx="39" cy="76" rx="4.6" ry="3.8" fill="#8c5960" stroke="#7f6166" stroke-width="2"/>'
      : state === 'happy'
        ? '<path d="M34 75c5 5 10 5 14 0" fill="none" stroke="#7f6166" stroke-width="3" stroke-linecap="round"/>'
        : '<path d="M35 75c4 3 7 3 11 0" fill="none" stroke="#7f6166" stroke-width="2.6" stroke-linecap="round"/>';
  const arm =
    state === 'happy'
      ? '<ellipse cx="55" cy="82" rx="8" ry="11" fill="url(#arm-skin)" stroke="#7f6166" stroke-width="3.6"/>'
      : '<ellipse cx="56" cy="92" rx="8" ry="10" fill="url(#arm-skin)" stroke="#7f6166" stroke-width="3.6"/>';
  const sparkle =
    state === 'happy'
      ? '<path d="M91 35l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="url(#arm-sparkle)" stroke="#7c95df" stroke-width="2" stroke-linejoin="round"/>'
      : '';

  return `
    <ellipse cx="64" cy="112" rx="29" ry="8" fill="#a3aed8" opacity=".24"/>
    <ellipse cx="75" cy="78" rx="31" ry="24" fill="url(#arm-shell)" stroke="#6272aa" stroke-width="5"/>
    <path d="M56 62c-6 9-10 21-10 34" fill="none" stroke="url(#arm-shell-band)" stroke-width="5" stroke-linecap="round"/>
    <path d="M69 56c-3 11-4 24-4 42" fill="none" stroke="url(#arm-shell-band)" stroke-width="5" stroke-linecap="round"/>
    <path d="M82 57c3 10 5 24 6 41" fill="none" stroke="url(#arm-shell-band)" stroke-width="5" stroke-linecap="round"/>
    <path d="M95 63c6 8 10 19 11 32" fill="none" stroke="url(#arm-shell-band)" stroke-width="5" stroke-linecap="round"/>
    <path d="M100 85c9 4 14 10 16 18-8 2-16 0-23-4" fill="#93a7e6" opacity=".42"/>
    <path d="M104 90c9 6 13 11 13 16" fill="none" stroke="#7f6166" stroke-width="4" stroke-linecap="round"/>
    <ellipse cx="59" cy="84" rx="18" ry="16" fill="url(#arm-belly)" stroke="#7f6166" stroke-width="4.2"/>
    ${arm}
    <ellipse cx="43" cy="61" rx="18" ry="16" fill="url(#arm-skin)" stroke="#7f6166" stroke-width="4.2"/>
    <path d="M36 50 28 41l13 2z" fill="#f6c3d1" stroke="#7f6166" stroke-width="3.2" stroke-linejoin="round"/>
    <ellipse cx="31" cy="71" rx="10" ry="8.5" fill="#f4dbc9" stroke="#7f6166" stroke-width="3"/>
    ${eye}
    ${mouth}
    <ellipse cx="38" cy="69" rx="4" ry="2.2" fill="#f4a5b0" opacity=".36"/>
    <ellipse cx="53" cy="104" rx="8" ry="5.2" fill="url(#arm-claw)"/>
    <ellipse cx="73" cy="106" rx="8.5" ry="5.2" fill="url(#arm-claw)"/>
    ${sparkle}
  `;
};

const armadilloSide = (state, angle) =>
  wrapSvg(
    armadilloDefs,
    angle === 'left' ? armadilloSideBase(state) : mirror(armadilloSideBase(state))
  );

const renderers = {
  'story-gnome': {
    front: gnomeFront,
    side: gnomeSide,
  },
  'orchard-bird': {
    front: birdFront,
    side: birdSide,
  },
  'prairie-armadillo': {
    front: armadilloFront,
    side: armadilloSide,
  },
};

for (const [folder, renderer] of Object.entries(renderers)) {
  for (const state of ['idle', 'talk', 'happy']) {
    writeSprite(folder, `${state}-front.svg`, renderer.front(state));
    writeSprite(folder, `${state}-left.svg`, renderer.side(state, 'left'));
    writeSprite(folder, `${state}-right.svg`, renderer.side(state, 'right'));
  }
}

console.log('Generated missing biome creature sprites.');
