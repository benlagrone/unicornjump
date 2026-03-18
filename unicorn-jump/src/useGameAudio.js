import { useEffect, useRef } from 'react';
import { Howl, Howler } from 'howler';

const PUBLIC_URL = process.env.PUBLIC_URL || '';
const BACKGROUND_MUSIC_SOURCE = `${PUBLIC_URL}/audio/background_music.mp3`;

const EFFECT_SOURCES = {
  jump: `${PUBLIC_URL}/assets/media/jump.wav`,
  tap: `${PUBLIC_URL}/assets/media/tap.wav`,
  treasure: `${PUBLIC_URL}/assets/media/treasure.wav`,
  unlock: `${PUBLIC_URL}/assets/media/unlock.wav`,
  recharge: `${PUBLIC_URL}/assets/media/recharge.wav`,
  sleep: `${PUBLIC_URL}/assets/media/sleep.wav`,
  win: `${PUBLIC_URL}/assets/media/win.wav`,
};

const EVENT_SOUND_MAP = {
  jump: 'jump',
  collect: 'treasure',
  'quest-complete': 'unlock',
  'rescue-spawn': 'recharge',
  'rescue-catch': 'recharge',
  'obstacle-hit': 'tap',
  'goal-locked': 'tap',
  pause: 'sleep',
  resume: 'tap',
  'biome-complete': 'win',
};

const EVENT_COOLDOWNS_MS = {
  jump: 110,
  collect: 120,
  'quest-complete': 300,
  'rescue-spawn': 300,
  'rescue-catch': 300,
  'obstacle-hit': 140,
  'goal-locked': 180,
  pause: 300,
  resume: 120,
  'biome-complete': 500,
};

const createEffectBank = () => ({
  jump: new Howl({ src: [EFFECT_SOURCES.jump], volume: 0.2 }),
  tap: new Howl({ src: [EFFECT_SOURCES.tap], volume: 0.28 }),
  treasure: new Howl({ src: [EFFECT_SOURCES.treasure], volume: 0.22 }),
  unlock: new Howl({ src: [EFFECT_SOURCES.unlock], volume: 0.24 }),
  recharge: new Howl({ src: [EFFECT_SOURCES.recharge], volume: 0.22 }),
  sleep: new Howl({ src: [EFFECT_SOURCES.sleep], volume: 0.18 }),
  win: new Howl({ src: [EFFECT_SOURCES.win], volume: 0.24 }),
});

const useGameAudio = (settings = {}) => {
  const musicEnabled = settings?.musicEnabled ?? true;
  const effectsEnabledRef = useRef(settings?.soundEnabled ?? true);
  const musicEnabledRef = useRef(musicEnabled);
  const effectsRef = useRef(null);
  const musicRef = useRef(null);
  const lastPlayedAtRef = useRef({});
  const musicUnavailableRef = useRef(false);
  const musicNoticeShownRef = useRef(false);
  const automatedRef = useRef(
    typeof window !== 'undefined' && window.navigator?.webdriver === true
  );
  const apiRef = useRef(null);

  effectsEnabledRef.current = settings?.soundEnabled ?? true;
  musicEnabledRef.current = musicEnabled;

  if (apiRef.current == null) {
    const ensureEffects = () => {
      if (automatedRef.current || effectsRef.current) {
        return effectsRef.current;
      }

      Howler.autoUnlock = true;
      effectsRef.current = createEffectBank();
      return effectsRef.current;
    };

    const releaseMusic = () => {
      if (!musicRef.current) {
        return;
      }

      musicRef.current.stop();
      musicRef.current.unload();
      musicRef.current = null;
    };

    const ensureMusic = () => {
      if (
        automatedRef.current ||
        musicUnavailableRef.current ||
        musicRef.current ||
        !BACKGROUND_MUSIC_SOURCE
      ) {
        return musicRef.current;
      }

      Howler.autoUnlock = true;
      musicRef.current = new Howl({
        src: [BACKGROUND_MUSIC_SOURCE],
        loop: true,
        volume: 0.16,
        preload: true,
        onloaderror: () => {
          if (!musicNoticeShownRef.current) {
            console.info('Background music asset is not ready yet. Add a generated loop to /public/audio/background_music.mp3.');
            musicNoticeShownRef.current = true;
          }

          musicUnavailableRef.current = true;
          releaseMusic();
        },
      });

      return musicRef.current;
    };

    apiRef.current = {
      play(eventName) {
        if (automatedRef.current || !effectsEnabledRef.current) {
          return;
        }

        const soundName = EVENT_SOUND_MAP[eventName];
        if (!soundName) {
          return;
        }

        const cooldown = EVENT_COOLDOWNS_MS[eventName] ?? 0;
        const now = window.performance?.now?.() ?? Date.now();
        const previousPlay = lastPlayedAtRef.current[eventName] ?? -Infinity;
        if (now - previousPlay < cooldown) {
          return;
        }

        lastPlayedAtRef.current[eventName] = now;
        const effectBank = ensureEffects();
        if (effectBank && effectBank[soundName]) {
          effectBank[soundName].play();
        }
      },

      syncMusic() {
        if (automatedRef.current || musicUnavailableRef.current) {
          return;
        }

        if (!musicEnabledRef.current) {
          if (musicRef.current) {
            musicRef.current.stop();
          }
          return;
        }

        const music = ensureMusic();
        if (music && !music.playing()) {
          music.play();
        }
      },

      unload() {
        releaseMusic();

        if (effectsRef.current) {
          Object.values(effectsRef.current).forEach((effect) => effect.unload());
          effectsRef.current = null;
        }
      },
    };
  }

  useEffect(() => {
    apiRef.current.syncMusic();
  }, [musicEnabled]);

  useEffect(() => {
    if (automatedRef.current) {
      return undefined;
    }

    const handleInteraction = () => {
      apiRef.current.syncMusic();
    };

    window.addEventListener('pointerdown', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      window.removeEventListener('pointerdown', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      apiRef.current.unload();
    };
  }, []);

  return apiRef.current;
};

export default useGameAudio;
