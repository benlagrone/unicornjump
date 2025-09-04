// AudioManager.js
import { useEffect, useRef } from 'react';

const AudioManager = () => {
  const jumpSound = useRef(new Audio('/assets/audio/jump.mp3'));
  const backgroundMusic = useRef(new Audio('/assets/audio/background_music.mp3'));
  const gameOverSound = useRef(new Audio('/assets/audio/game_over.mp3'));

  useEffect(() => {
    backgroundMusic.current.loop = true;
    return () => {
      backgroundMusic.current.pause();
    };
  }, []);

  const playJumpSound = () => {
    jumpSound.current.currentTime = 0;
    jumpSound.current.play();
  };

  const playBackgroundMusic = () => {
    backgroundMusic.current.play();
  };

  const stopBackgroundMusic = () => {
    backgroundMusic.current.pause();
    backgroundMusic.current.currentTime = 0;
  };

  const playGameOverSound = () => {
    gameOverSound.current.play();
  };

  return {
    playJumpSound,
    playBackgroundMusic,
    stopBackgroundMusic,
    playGameOverSound,
  };
};

export default AudioManager;