import React, { useState, useEffect } from 'react';
import Game from './Game';
import Settings from './Settings';

const App = () => {
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'paused', 'gameOver', 'settings'
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [gameSettings, setGameSettings] = useState({
    soundEnabled: true,
    musicEnabled: true,
    difficulty: 'normal'
  });

  // Function to get a random background image
  const getRandomBackgroundImage = () => {
    const numberOfBackgrounds = 6; // Since you have 6 background images
    const randomIndex = Math.floor(Math.random() * numberOfBackgrounds) + 1; // Get a random number between 1 and 6
    return `${process.env.PUBLIC_URL}/assets/images/background/background-${randomIndex}.png`;
  };

  // State to hold the background image URL
  const [backgroundImage, setBackgroundImage] = useState(getRandomBackgroundImage());

  // Effect to set a new background image on each reload
  useEffect(() => {
    setBackgroundImage(getRandomBackgroundImage());
  }, []);


  useEffect(() => {
    const savedHighScore = localStorage.getItem('highScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
  };

  const pauseGame = () => {
    setGameState('paused');
  };

  const resumeGame = () => {
    setGameState('playing');
  };

  const endGame = (finalScore) => {
    setScore(finalScore);
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('highScore', finalScore.toString());
    }
    setGameState('gameOver');
  };

  const openSettings = () => {
    setShowSettings(true);
  };

  const closeSettings = () => {
    setShowSettings(false);
  };

  const saveSettings = (newSettings) => {
    setGameSettings(newSettings);
    setShowSettings(false);
  };

  const renderInstructions = () => (
    <div className="mt-4 text-sm">
      <h3 className="font-bold mb-2">How to Play:</h3>
      <p>Use left and right arrow keys to move</p>
      <p>Press spacebar or click to jump</p>
      <p>Avoid obstacles and collect power-ups</p>
    </div>
  );

  return (
    <div className="foo w-full h-screen flex items-center justify-center bg-gradient-to-b from-purple-400 to-pink-300"
    style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}>
      {gameState === 'menu' && (
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Unicorn Jump</h1>
          <button 
            onClick={startGame}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2"
          >
            Start Game
          </button>
          <br />
          <button 
            onClick={openSettings}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2"
          >
            Settings
          </button>
          <p className="mt-2">High Score: {highScore}</p>
          {renderInstructions()}
        </div>
      )}
      {(gameState === 'playing' || gameState === 'paused') && (
        <Game 
        onGameOver={endGame} 
        settings={gameSettings} 
        isPaused={gameState === 'paused'}
        onPause={pauseGame}
        onResume={resumeGame}
        backgroundImage={backgroundImage} // Pass the backgroundImage state as a prop
      />
      )}
      {gameState === 'gameOver' && (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Game Over</h2>
          <p className="text-xl mb-2">Your Score: {score}</p>
          <p className="text-lg mb-4">High Score: {highScore}</p>
          <button 
            onClick={startGame}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
          >
            Play Again
          </button>
          <button 
            onClick={() => setGameState('menu')}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Main Menu
          </button>
        </div>
      )}
      {showSettings && (
        <Settings
          onClose={closeSettings}
          onSave={saveSettings}
          initialSettings={gameSettings}
        />
      )}
    </div>
  );
};

export default App;