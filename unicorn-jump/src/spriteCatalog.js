const asset = (path) => `${process.env.PUBLIC_URL}/assets/images/${path}`;

const lanternFoxSprites = {
  idle: {
    front: asset('creature/lantern-fox/idle-front.svg'),
    left: asset('creature/lantern-fox/idle-left.svg'),
    right: asset('creature/lantern-fox/idle-right.svg'),
  },
  talk: {
    front: asset('creature/lantern-fox/talk-front.svg'),
    left: asset('creature/lantern-fox/talk-left.svg'),
    right: asset('creature/lantern-fox/talk-right.svg'),
  },
  happy: {
    front: asset('creature/lantern-fox/happy-front.svg'),
    left: asset('creature/lantern-fox/happy-left.svg'),
    right: asset('creature/lantern-fox/happy-right.svg'),
  },
};

const meadowSheepSprites = {
  idle: {
    front: asset('creature/meadow-sheep/idle-front.svg'),
    left: asset('creature/meadow-sheep/idle-left.svg'),
    right: asset('creature/meadow-sheep/idle-right.svg'),
  },
  talk: {
    front: asset('creature/meadow-sheep/talk-front.svg'),
    left: asset('creature/meadow-sheep/talk-left.svg'),
    right: asset('creature/meadow-sheep/talk-right.svg'),
  },
  happy: {
    front: asset('creature/meadow-sheep/happy-front.svg'),
    left: asset('creature/meadow-sheep/happy-left.svg'),
    right: asset('creature/meadow-sheep/happy-right.svg'),
  },
};

const storyGnomeSprites = {
  idle: {
    front: asset('creature/story-gnome/idle-front.svg'),
    left: asset('creature/story-gnome/idle-left.svg'),
    right: asset('creature/story-gnome/idle-right.svg'),
  },
  talk: {
    front: asset('creature/story-gnome/talk-front.svg'),
    left: asset('creature/story-gnome/talk-left.svg'),
    right: asset('creature/story-gnome/talk-right.svg'),
  },
  happy: {
    front: asset('creature/story-gnome/happy-front.svg'),
    left: asset('creature/story-gnome/happy-left.svg'),
    right: asset('creature/story-gnome/happy-right.svg'),
  },
};

const orchardBirdSprites = {
  idle: {
    front: asset('creature/orchard-bird/idle-front.svg'),
    left: asset('creature/orchard-bird/idle-left.svg'),
    right: asset('creature/orchard-bird/idle-right.svg'),
  },
  talk: {
    front: asset('creature/orchard-bird/talk-front.svg'),
    left: asset('creature/orchard-bird/talk-left.svg'),
    right: asset('creature/orchard-bird/talk-right.svg'),
  },
  happy: {
    front: asset('creature/orchard-bird/happy-front.svg'),
    left: asset('creature/orchard-bird/happy-left.svg'),
    right: asset('creature/orchard-bird/happy-right.svg'),
  },
};

const prairieArmadilloSprites = {
  idle: {
    front: asset('creature/prairie-armadillo/idle-front.svg'),
    left: asset('creature/prairie-armadillo/idle-left.svg'),
    right: asset('creature/prairie-armadillo/idle-right.svg'),
  },
  talk: {
    front: asset('creature/prairie-armadillo/talk-front.svg'),
    left: asset('creature/prairie-armadillo/talk-left.svg'),
    right: asset('creature/prairie-armadillo/talk-right.svg'),
  },
  happy: {
    front: asset('creature/prairie-armadillo/happy-front.svg'),
    left: asset('creature/prairie-armadillo/happy-left.svg'),
    right: asset('creature/prairie-armadillo/happy-right.svg'),
  },
};

const glowFoxCompanionSprites = {
  hover: {
    front: asset('companion/glow-fox/hover-front.svg'),
    left: asset('companion/glow-fox/hover-left.svg'),
    right: asset('companion/glow-fox/hover-right.svg'),
  },
  blink: {
    front: asset('companion/glow-fox/blink-front.svg'),
    left: asset('companion/glow-fox/blink-left.svg'),
    right: asset('companion/glow-fox/blink-right.svg'),
  },
  boost: {
    front: asset('companion/glow-fox/boost-front.svg'),
    left: asset('companion/glow-fox/boost-left.svg'),
    right: asset('companion/glow-fox/boost-right.svg'),
  },
};

const windSheepCompanionSprites = {
  hover: {
    front: asset('companion/wind-sheep/hover-front.svg'),
    left: asset('companion/wind-sheep/hover-left.svg'),
    right: asset('companion/wind-sheep/hover-right.svg'),
  },
  blink: {
    front: asset('companion/wind-sheep/blink-front.svg'),
    left: asset('companion/wind-sheep/blink-left.svg'),
    right: asset('companion/wind-sheep/blink-right.svg'),
  },
  boost: {
    front: asset('companion/wind-sheep/boost-front.svg'),
    left: asset('companion/wind-sheep/boost-left.svg'),
    right: asset('companion/wind-sheep/boost-right.svg'),
  },
};

const butterflySpiritCompanionSprites = {
  hover: {
    front: asset('companion/butterfly-spirit/hover-front.svg'),
    left: asset('companion/butterfly-spirit/hover-left.svg'),
    right: asset('companion/butterfly-spirit/hover-right.svg'),
  },
  blink: {
    front: asset('companion/butterfly-spirit/blink-front.svg'),
    left: asset('companion/butterfly-spirit/blink-left.svg'),
    right: asset('companion/butterfly-spirit/blink-right.svg'),
  },
  boost: {
    front: asset('companion/butterfly-spirit/boost-front.svg'),
    left: asset('companion/butterfly-spirit/boost-left.svg'),
    right: asset('companion/butterfly-spirit/boost-right.svg'),
  },
};

const songbirdCompanionSprites = {
  hover: {
    front: asset('companion/songbird/hover-front.svg'),
    left: asset('companion/songbird/hover-left.svg'),
    right: asset('companion/songbird/hover-right.svg'),
  },
  blink: {
    front: asset('companion/songbird/blink-front.svg'),
    left: asset('companion/songbird/blink-left.svg'),
    right: asset('companion/songbird/blink-right.svg'),
  },
  boost: {
    front: asset('companion/songbird/boost-front.svg'),
    left: asset('companion/songbird/boost-left.svg'),
    right: asset('companion/songbird/boost-right.svg'),
  },
};

const fireflyFriendCompanionSprites = {
  hover: {
    front: asset('companion/firefly-friend/hover-front.svg'),
    left: asset('companion/firefly-friend/hover-left.svg'),
    right: asset('companion/firefly-friend/hover-right.svg'),
  },
  blink: {
    front: asset('companion/firefly-friend/blink-front.svg'),
    left: asset('companion/firefly-friend/blink-left.svg'),
    right: asset('companion/firefly-friend/blink-right.svg'),
  },
  boost: {
    front: asset('companion/firefly-friend/boost-front.svg'),
    left: asset('companion/firefly-friend/boost-left.svg'),
    right: asset('companion/firefly-friend/boost-right.svg'),
  },
};

const lanternSeedSprites = {
  idle: asset('collectible/lantern-seed-idle.svg'),
  glow: asset('collectible/lantern-seed-glow.svg'),
  collected: asset('collectible/lantern-seed-collected.svg'),
};

const meadowSongSprites = {
  idle: asset('collectible/meadow-song-idle.svg'),
  glow: asset('collectible/meadow-song-glow.svg'),
  collected: asset('collectible/meadow-song-collected.svg'),
};

const storyStarSprites = {
  idle: asset('collectible/story-star-idle.svg'),
  glow: asset('collectible/story-star-glow.svg'),
  collected: asset('collectible/story-star-collected.svg'),
};

const sunDropSprites = {
  idle: asset('collectible/sun-drop-idle.svg'),
  glow: asset('collectible/sun-drop-glow.svg'),
  collected: asset('collectible/sun-drop-collected.svg'),
};

const fireflySprites = {
  idle: asset('collectible/firefly-idle.svg'),
  glow: asset('collectible/firefly-glow.svg'),
  collected: asset('collectible/firefly-collected.svg'),
};

const rescueLeafSprites = {
  fresh: asset('effects/rescue-leaf-fresh.svg'),
  catch: asset('effects/rescue-leaf-catch.svg'),
  used: asset('effects/rescue-leaf-used.svg'),
};

const landingVillageSpritesByType = {
  'tea-table': asset('world/lantern-bamboo-valley/props/tea-table.svg'),
  'wool-cart': asset('world/highland-meadow/props/wool-cart.svg'),
  'mushroom-house': asset('world/storybook-forest/props/mushroom-house.svg'),
  'mirror-stand': asset('world/sun-orchard/props/mirror-stand.svg'),
  'windmill-post': asset('world/bluebonnet-prairie/props/windmill-post.svg'),
};

const worldLandmarkSpritesByBiome = {
  'lantern-bamboo-valley': asset('world/lantern-bamboo-valley/landmark/lantern-stand.svg'),
  'highland-meadow': asset('world/highland-meadow/landmark/stone-circle.svg'),
  'storybook-forest': asset('world/storybook-forest/landmark/story-tree.svg'),
  'sun-orchard': asset('world/sun-orchard/landmark/citrus-arbor.svg'),
  'bluebonnet-prairie': asset('world/bluebonnet-prairie/landmark/bluebonnet-patch.svg'),
};

const worldGateSpritesByBiome = {
  'lantern-bamboo-valley': asset('world/lantern-bamboo-valley/gate/sky-lantern-gate.svg'),
  'highland-meadow': asset('world/highland-meadow/gate/breeze-arch.svg'),
  'storybook-forest': asset('world/storybook-forest/gate/page-arch.svg'),
  'sun-orchard': asset('world/sun-orchard/gate/golden-arbor.svg'),
  'bluebonnet-prairie': asset('world/bluebonnet-prairie/gate/windmill-gate.svg'),
};

const obstacleSpritesByBiome = {
  'lantern-bamboo-valley': [asset('obstacle/lantern-fox-ember.svg')],
  'highland-meadow': [asset('obstacle/meadow-sheep-cloud.svg')],
  'storybook-forest': [asset('obstacle/story-gnome-whirl.svg')],
  'sun-orchard': [asset('obstacle/orchard-bird-burst.svg')],
  'bluebonnet-prairie': [asset('obstacle/prairie-armadillo-roll.svg')],
};

const creatureSpritesByBiome = {
  'lantern-bamboo-valley': {
    creatureType: 'fox',
    sprites: lanternFoxSprites,
  },
  'highland-meadow': {
    creatureType: 'sheep',
    sprites: meadowSheepSprites,
  },
  'storybook-forest': {
    creatureType: 'gnome',
    sprites: storyGnomeSprites,
  },
  'sun-orchard': {
    creatureType: 'bird',
    sprites: orchardBirdSprites,
  },
  'bluebonnet-prairie': {
    creatureType: 'armadillo',
    sprites: prairieArmadilloSprites,
  },
};

const getAngleFromDelta = (deltaX) => {
  if (deltaX < -18) {
    return 'left';
  }
  if (deltaX > 18) {
    return 'right';
  }
  return 'front';
};

export const getCreatureSpriteAsset = ({ biomeId, creature, player, quest, dialog, timeMs }) => {
  const spriteConfig = creatureSpritesByBiome[biomeId];

  if (spriteConfig?.creatureType === creature.type) {
    const action =
      quest.completed || creature.reactionUntil > timeMs ? 'happy' : dialog ? 'talk' : 'idle';
    const playerCenterX = player.x + player.width / 2;
    const creatureCenterX = creature.x + creature.width / 2;
    const angle = quest.completed ? 'front' : getAngleFromDelta(playerCenterX - creatureCenterX);

    return spriteConfig.sprites[action][angle];
  }

  return null;
};

export const getQuestItemSpriteAsset = ({ biomeId, item, questStarted }) => {
  if (biomeId === 'lantern-bamboo-valley' && item.type === 'seed') {
    return lanternSeedSprites[questStarted ? 'glow' : 'idle'];
  }

  if (biomeId === 'highland-meadow' && item.type === 'song') {
    return meadowSongSprites[questStarted ? 'glow' : 'idle'];
  }

  if (biomeId === 'storybook-forest' && item.type === 'star') {
    return storyStarSprites[questStarted ? 'glow' : 'idle'];
  }

  if (biomeId === 'sun-orchard' && item.type === 'sun-drop') {
    return sunDropSprites[questStarted ? 'glow' : 'idle'];
  }

  if (biomeId === 'bluebonnet-prairie' && item.type === 'firefly') {
    return fireflySprites[questStarted ? 'glow' : 'idle'];
  }

  return null;
};

export const getCompanionSpriteAsset = ({ companion, player, timeMs, index }) => {
  const action =
    Math.abs(player.vy) > 480 || Math.abs(player.vx) > 180
      ? 'boost'
      : Math.floor((timeMs + index * 240) / 520) % 5 === 0
        ? 'blink'
        : 'hover';
  const angle = Math.abs(player.vx) < 40 ? 'front' : player.facing === 'left' ? 'left' : 'right';

  if (companion.effect === 'guide-lights') {
    return glowFoxCompanionSprites[action][angle];
  }

  if (companion.effect === 'gentle-breeze') {
    return windSheepCompanionSprites[action][angle];
  }

  if (companion.effect === 'leaf-bloom') {
    return butterflySpiritCompanionSprites[action][angle];
  }

  if (companion.effect === 'joy-chime') {
    return songbirdCompanionSprites[action][angle];
  }

  if (companion.effect === 'firefly-magnet') {
    return fireflyFriendCompanionSprites[action][angle];
  }

  return null;
};

export const getRescueLeafSpriteAsset = ({ biomeId, rescueLeaf, timeMs }) => {
  if (biomeId !== 'lantern-bamboo-valley' || !rescueLeaf) {
    return null;
  }

  if (!rescueLeaf.used) {
    return rescueLeafSprites.fresh;
  }

  if (rescueLeaf.expiresAt != null && rescueLeaf.expiresAt - timeMs > 320) {
    return rescueLeafSprites.catch;
  }

  return rescueLeafSprites.used;
};

export const getLandingVillageSpriteAsset = ({ village }) => {
  if (!village?.type) {
    return null;
  }

  return landingVillageSpritesByType[village.type] || null;
};

export const getWorldLandmarkSpriteAsset = ({ biomeId }) =>
  worldLandmarkSpritesByBiome[biomeId] || null;

export const getWorldGateSpriteAsset = ({ biomeId }) => worldGateSpritesByBiome[biomeId] || null;

export const getObstacleSpriteAsset = ({ biomeId }) => {
  const candidates = obstacleSpritesByBiome[biomeId];

  if (!candidates?.length) {
    return null;
  }

  return candidates[Math.floor(Math.random() * candidates.length)];
};
