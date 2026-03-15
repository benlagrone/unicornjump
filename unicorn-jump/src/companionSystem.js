import { BIOMES } from './biomeManager';

const companionByBiomeId = new Map(
  BIOMES.map((biome) => [biome.id, { ...biome.companion, sourceBiomeId: biome.id }])
);

export const buildUnlockedCompanions = (completedBiomeIds = []) =>
  completedBiomeIds
    .map((biomeId) => companionByBiomeId.get(biomeId))
    .filter(Boolean);

export const getCompanionForBiome = (biomeId) => companionByBiomeId.get(biomeId) || null;

export const getCompanionBonuses = (companions = []) => {
  const effects = new Set(companions.map((companion) => companion.effect));

  return {
    revealGuides: effects.has('guide-lights'),
    gentleBreeze: effects.has('gentle-breeze'),
    leafBloom: effects.has('leaf-bloom'),
    joyChime: effects.has('joy-chime'),
    fireflyMagnet: effects.has('firefly-magnet'),
    rescueLeafScale: effects.has('leaf-bloom') ? 1.28 : 1,
    maxFallSpeed: effects.has('gentle-breeze') ? 760 : 980,
    collectibleMagnetRadius: effects.has('firefly-magnet') ? 92 : 58,
    collectibleBonus: effects.has('joy-chime') ? 4 : 0,
  };
};
