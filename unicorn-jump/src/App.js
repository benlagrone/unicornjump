import React, { useEffect, useState } from 'react';
import Game from './Game';
import Settings from './Settings';
import { BIOMES, getBiomeConfig } from './biomeManager';
import { buildUnlockedCompanions } from './companionSystem';

const HIGH_SCORE_STORAGE_KEY = 'highScore';
const JOURNEY_STORAGE_KEY = 'gardenMessengerJourney';

const getBackgroundImageForBiome = (biomeIndex) => {
  const imageNumber = (biomeIndex % 6) + 1;
  return `${process.env.PUBLIC_URL}/assets/images/background/background-${imageNumber}.png`;
};

const createInitialJourney = () => {
  const fallback = {
    currentBiomeIndex: 0,
    completedBiomeIds: [],
  };

  try {
    const stored = window.localStorage.getItem(JOURNEY_STORAGE_KEY);
    if (!stored) {
      return fallback;
    }

    const parsed = JSON.parse(stored);
    if (
      typeof parsed?.currentBiomeIndex === 'number' &&
      Array.isArray(parsed?.completedBiomeIds)
    ) {
      return {
        currentBiomeIndex: Math.min(BIOMES.length - 1, Math.max(0, parsed.currentBiomeIndex)),
        completedBiomeIds: parsed.completedBiomeIds.filter((entry) =>
          BIOMES.some((biome) => biome.id === entry)
        ),
      };
    }
  } catch (error) {
    return fallback;
  }

  return fallback;
};

const basePanelStyle = {
  background: 'rgba(255, 249, 240, 0.76)',
  border: '1px solid rgba(255, 255, 255, 0.68)',
  borderRadius: 30,
  boxShadow: '0 24px 65px rgba(15, 23, 42, 0.22)',
  backdropFilter: 'blur(12px)',
};

const buttonStyle = (background, color = '#fff') => ({
  border: 0,
  borderRadius: 999,
  padding: '14px 24px',
  fontSize: 18,
  fontWeight: 700,
  background,
  color,
  cursor: 'pointer',
});

const App = () => {
  const [screen, setScreen] = useState('menu');
  const [highScore, setHighScore] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [gameSettings, setGameSettings] = useState({
    soundEnabled: true,
    musicEnabled: true,
    difficulty: 'gentle',
  });
  const [journey, setJourney] = useState(createInitialJourney);
  const [runHarmony, setRunHarmony] = useState(0);
  const [completionInfo, setCompletionInfo] = useState(null);

  const activeBiome = getBiomeConfig(journey.currentBiomeIndex);
  const companions = buildUnlockedCompanions(journey.completedBiomeIds);
  const backgroundImage = getBackgroundImageForBiome(journey.currentBiomeIndex);

  useEffect(() => {
    const savedHighScore = window.localStorage.getItem(HIGH_SCORE_STORAGE_KEY);
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(journey));
  }, [journey]);

  const commitScore = (finalScore) => {
    if (finalScore > highScore) {
      setHighScore(finalScore);
      window.localStorage.setItem(HIGH_SCORE_STORAGE_KEY, String(finalScore));
    }
  };

  const startAdventure = () => {
    setRunHarmony(0);
    setCompletionInfo(null);
    setScreen('playing');
  };

  const continueAdventure = () => {
    setCompletionInfo(null);
    setScreen('playing');
  };

  const pauseAdventure = () => {
    setScreen('paused');
  };

  const resumeAdventure = () => {
    setScreen('playing');
  };

  const returnToMenu = () => {
    setRunHarmony(0);
    setCompletionInfo(null);
    setScreen('menu');
  };

  const handleBiomeComplete = (payload) => {
    const updatedCompletedBiomeIds = Array.from(
      new Set([...journey.completedBiomeIds, payload.biomeId])
    );
    const isFinalBiome = payload.biomeIndex >= BIOMES.length - 1;
    const nextBiomeIndex = isFinalBiome ? 0 : payload.biomeIndex + 1;

    setJourney({
      currentBiomeIndex: nextBiomeIndex,
      completedBiomeIds: updatedCompletedBiomeIds,
    });
    setRunHarmony(payload.totalHarmony);
    setCompletionInfo({
      ...payload,
      totalHarmony: payload.totalHarmony,
      nextBiome: payload.nextBiome,
    });

    if (isFinalBiome) {
      commitScore(payload.totalHarmony);
      setScreen('won');
      return;
    }

    setScreen('biomeComplete');
  };

  const saveSettings = (newSettings) => {
    setGameSettings(newSettings);
    setShowSettings(false);
  };

  const shellStyle = {
    minHeight: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: `radial-gradient(circle at top, rgba(255, 240, 210, 0.42), rgba(15, 23, 42, 0.12) 60%), url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: 16,
  };

  return (
    <div style={shellStyle}>
      {screen === 'menu' && (
        <div
          style={{
            ...basePanelStyle,
            width: 'min(980px, calc(100vw - 32px))',
            padding: '34px 32px',
            color: activeBiome.palette.heading,
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.3fr) minmax(280px, 0.9fr)',
              gap: 24,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 16,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  opacity: 0.72,
                  marginBottom: 12,
                }}
              >
                Cozy Exploration Platformer
              </div>
              <h1 style={{ fontSize: 'clamp(42px, 6vw, 68px)', lineHeight: 0.96, margin: '0 0 18px' }}>
                Unicorn Jump
                <br />
                Living Garden Adventure
              </h1>
              <p style={{ fontSize: 19, lineHeight: 1.55, margin: '0 0 22px', maxWidth: 620 }}>
                The unicorn is now a Garden Messenger. Bounce through floating ecosystems,
                meet kind creatures, collect glowing treasures, and restore each garden in
                turn. There are no enemies and no hard fail states.
              </p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
                <button
                  id="start-btn"
                  onClick={startAdventure}
                  style={buttonStyle(activeBiome.palette.accent)}
                >
                  {journey.completedBiomeIds.length === BIOMES.length
                    ? 'Begin Again'
                    : journey.currentBiomeIndex > 0
                      ? `Continue to ${activeBiome.shortName}`
                      : 'Start Journey'}
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  style={buttonStyle('#ffffff', activeBiome.palette.heading)}
                >
                  Settings
                </button>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    background: 'rgba(255,255,255,0.56)',
                    borderRadius: 24,
                    padding: '16px 18px',
                  }}
                >
                  <div style={{ fontSize: 13, letterSpacing: 1.4, textTransform: 'uppercase', opacity: 0.72 }}>
                    Next Garden
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 700, margin: '8px 0 6px' }}>
                    {activeBiome.name}
                  </div>
                  <div style={{ fontSize: 15, lineHeight: 1.45 }}>{activeBiome.regionLabel}</div>
                </div>

                <div
                  style={{
                    background: 'rgba(255,255,255,0.56)',
                    borderRadius: 24,
                    padding: '16px 18px',
                  }}
                >
                  <div style={{ fontSize: 13, letterSpacing: 1.4, textTransform: 'uppercase', opacity: 0.72 }}>
                    Companions
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 700, margin: '8px 0 6px' }}>
                    {companions.length} / {BIOMES.length}
                  </div>
                  <div style={{ fontSize: 15, lineHeight: 1.45 }}>
                    {companions.length > 0
                      ? companions.map((companion) => companion.name).join(', ')
                      : 'Meet creatures and help them to earn companions.'}
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(255,255,255,0.56)',
                    borderRadius: 24,
                    padding: '16px 18px',
                  }}
                >
                  <div style={{ fontSize: 13, letterSpacing: 1.4, textTransform: 'uppercase', opacity: 0.72 }}>
                    Best Harmony
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 700, margin: '8px 0 6px' }}>
                    {highScore}
                  </div>
                  <div style={{ fontSize: 15, lineHeight: 1.45 }}>
                    Harmony grows as you climb, collect treasures, and restore each biome.
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255,255,255,0.54)',
                borderRadius: 28,
                padding: '20px 18px',
              }}
            >
              <div style={{ fontSize: 13, letterSpacing: 1.4, textTransform: 'uppercase', opacity: 0.72 }}>
                Journey Map
              </div>
              <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
                {BIOMES.map((biome, index) => {
                  const isComplete = journey.completedBiomeIds.includes(biome.id);
                  const isCurrent = index === journey.currentBiomeIndex;

                  return (
                    <div
                      key={biome.id}
                      style={{
                        display: 'flex',
                        gap: 12,
                        alignItems: 'flex-start',
                        padding: '12px 14px',
                        borderRadius: 20,
                        background: isCurrent
                          ? 'rgba(255,255,255,0.9)'
                          : isComplete
                            ? 'rgba(255,255,255,0.66)'
                            : 'rgba(255,255,255,0.38)',
                        border: isCurrent
                          ? `1px solid ${biome.palette.accent}`
                          : '1px solid rgba(255,255,255,0.45)',
                      }}
                    >
                      <div
                        style={{
                          flex: '0 0 34px',
                          height: 34,
                          borderRadius: '999px',
                          background: biome.palette.accent,
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                        }}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>{biome.name}</div>
                        <div style={{ fontSize: 14, lineHeight: 1.4 }}>{biome.creature.name}</div>
                        <div style={{ fontSize: 13, lineHeight: 1.4, opacity: 0.72 }}>
                          {isComplete
                            ? 'Restored'
                            : isCurrent
                              ? 'Next stop'
                              : 'Ahead on the path'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {(screen === 'playing' || screen === 'paused') && (
        <Game
          backgroundImage={backgroundImage}
          biomeIndex={journey.currentBiomeIndex}
          completedBiomeIds={journey.completedBiomeIds}
          scoreOffset={runHarmony}
          isPaused={screen === 'paused'}
          onBiomeComplete={handleBiomeComplete}
          onPause={pauseAdventure}
          onResume={resumeAdventure}
          settings={gameSettings}
        />
      )}

      {screen === 'biomeComplete' && completionInfo && (
        <div
          style={{
            ...basePanelStyle,
            width: 'min(560px, calc(100vw - 32px))',
            padding: '34px 30px',
            textAlign: 'center',
            color: completionInfo.nextBiome
              ? completionInfo.nextBiome.palette.heading
              : activeBiome.palette.heading,
          }}
        >
          <div style={{ fontSize: 17, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.72 }}>
            Biome Restored
          </div>
          <h2 style={{ fontSize: 44, lineHeight: 1.05, margin: '14px 0 12px' }}>
            {completionInfo.biomeName} is glowing again
          </h2>
          <p style={{ fontSize: 19, lineHeight: 1.55, margin: '0 0 14px' }}>
            {completionInfo.creatureName} joined the unicorn as <strong>{completionInfo.companion.name}</strong>.
          </p>
          <p style={{ fontSize: 18, margin: '0 0 8px' }}>Total Harmony: {completionInfo.totalHarmony}</p>
          <p style={{ fontSize: 17, margin: '0 0 24px' }}>
            Next garden: {completionInfo.nextBiome.name}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={continueAdventure}
              style={buttonStyle(completionInfo.nextBiome.palette.accent)}
            >
              Travel On
            </button>
            <button
              onClick={returnToMenu}
              style={buttonStyle('#ffffff', completionInfo.nextBiome.palette.heading)}
            >
              Garden Map
            </button>
          </div>
        </div>
      )}

      {screen === 'won' && completionInfo && (
        <div
          style={{
            ...basePanelStyle,
            width: 'min(620px, calc(100vw - 32px))',
            padding: '36px 32px',
            textAlign: 'center',
            color: '#17345c',
          }}
        >
          <div style={{ fontSize: 17, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.72 }}>
            Every Garden Restored
          </div>
          <h2 style={{ fontSize: 48, lineHeight: 1.02, margin: '14px 0 12px' }}>
            The unicorn brought harmony home
          </h2>
          <p style={{ fontSize: 19, lineHeight: 1.6, margin: '0 0 18px' }}>
            All five biomes are glowing, and {completionInfo.companion.name} joined the final
            celebration. The adventure stays gentle, colorful, and ready for another ride.
          </p>
          <p style={{ fontSize: 20, margin: '0 0 8px' }}>Final Harmony: {completionInfo.totalHarmony}</p>
          <p style={{ fontSize: 18, margin: '0 0 24px' }}>Best Harmony: {highScore}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={startAdventure} style={buttonStyle('#2f9e44')}>
              Play Again
            </button>
            <button onClick={returnToMenu} style={buttonStyle('#ffffff', '#17345c')}>
              Garden Map
            </button>
          </div>
        </div>
      )}

      {showSettings && (
        <Settings
          initialSettings={gameSettings}
          onClose={() => setShowSettings(false)}
          onSave={saveSettings}
        />
      )}
    </div>
  );
};

export default App;
