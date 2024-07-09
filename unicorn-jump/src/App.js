import React, { useState } from 'react';
import Game from './Game';

const App = () => {
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'gameOver'
  const [score, setScore] = useState(0);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
  };

  const endGame = (finalScore) => {
    setScore(finalScore);
    setGameState('gameOver');
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-purple-400 to-pink-300">
      {gameState === 'menu' && (
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Unicorn Jump</h1>
          <button 
            onClick={startGame}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Start Game
          </button>
        </div>
      )}
      {gameState === 'playing' && <Game onGameOver={endGame} />}
      {gameState === 'gameOver' && (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Game Over</h2>
          <p className="text-xl mb-4">Your Score: {score}</p>
          <button 
            onClick={startGame}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default App;