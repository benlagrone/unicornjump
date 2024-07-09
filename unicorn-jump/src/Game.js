// Game.js
// Main game component for Unicorn Jump

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Character from './Character';
import { PlatformManager } from './Platform';
import { ObstacleManager } from './Obstacle';
import { PowerUpManager, POWERUP_TYPES } from './PowerUp';
import { PLATFORM_TYPES } from './Platform';

// ... rest of your Game.js code ...

const WIDTH = 50; 
const Game = ({ onGameOver }) => {
    const gameAreaRef = useRef(null);
    const [score, setScore] = useState(0);
    const [characterPosition, setCharacterPosition] = useState({ x: window.innerWidth / 2, y: 100 });
    const [gameSpeed, setGameSpeed] = useState(1);
    const [activePowerUp, setActivePowerUp] = useState(null);
    const [powerUpTimer, setPowerUpTimer] = useState(null);
    const [platforms, setPlatforms] = useState([]); // Define platforms state
    const [characterVelocity, setCharacterVelocity] = useState(0);
    // Game loop
    useEffect(() => {
        const gameLoop = setInterval(() => {
            setScore(prevScore => prevScore + 1);
            setGameSpeed(prevSpeed => Math.min(prevSpeed + 0.0001, 2));

            if (characterPosition.y <= 0) {
                clearInterval(gameLoop);
                onGameOver(score);
            }
        }, 1000);

        return () => clearInterval(gameLoop);
    }, [characterPosition.y, onGameOver, score]);

    // Handle character movement
    const handleCharacterMove = useCallback((event) => {
        if (gameAreaRef.current) {
            const gameArea = gameAreaRef.current.getBoundingClientRect();
            const clientX = event.clientX || (event.touches && event.touches[0].clientX);
            const newX = clientX - gameArea.left;
            console.log('Mouse X position:', clientX); // Log the mouse X position
            console.log('New X position within game area:', newX); // Log the new X position within the game area
    
            
        setCharacterPosition(prevPos => {
            const updatedPosition = {
                ...prevPos,
                x: Math.max(0, Math.min(newX, gameArea.width - WIDTH)) // Ensure the character stays within the game area
            };
            console.log('Updated character position:', updatedPosition); // Log the updated character position
            return updatedPosition;
        });
        }
    }, [gameAreaRef]);

    // Jump function
    const jump = useCallback(() => {
        if (characterPosition.y === 100) {
            setCharacterPosition(prev => ({ ...prev, y: prev.y + 200 }));
            setTimeout(() => {
                setCharacterPosition(prev => ({ ...prev, y: 100 }));
            }, 500);
        }
    }, [characterPosition.y]);

    // Mouse/trackpad controls
    useEffect(() => {
        const gameArea = gameAreaRef.current;
        if (gameArea) {
            gameArea.addEventListener('mousemove', handleCharacterMove);
            gameArea.addEventListener('click', jump);
        }

        return () => {
            if (gameArea) {
                gameArea.removeEventListener('mousemove', handleCharacterMove);
                gameArea.removeEventListener('click', jump);
            }
        };
    }, [handleCharacterMove, jump]);

    // Keyboard controls
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'ArrowLeft') {
                setCharacterPosition(prev => ({ ...prev, x: Math.max(prev.x - 10, 0) }));
            } else if (e.key === 'ArrowRight') {
                setCharacterPosition(prev => ({ ...prev, x: Math.min(prev.x + 10, window.innerWidth - 50) }));
            } else if (e.key === 'ArrowUp' || e.key === ' ') {
                jump();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [jump]);

    // Gravity effect
    useEffect(() => {
        const gravity = setInterval(() => {
            setCharacterPosition(prev => {
                const newY = Math.max(prev.y - 5, 100);
                return { ...prev, y: newY };
            });
        }, 50);

        return () => clearInterval(gravity);
    }, []);

        
    // Gravity effect
    useEffect(() => {
        const gravityInterval = setInterval(() => {
            setCharacterPosition(prev => {
                let newY = prev.y;
    
                // Check for collision with each platform
                const onPlatform = platforms.some(platform => {
                    const withinXBounds = prev.x >= platform.position.x && prev.x <= platform.position.x + platform.width;
                    const withinYBounds = prev.y >= platform.position.y && prev.y < platform.position.y + platform.height;
                    return withinXBounds && withinYBounds;
                });
    
                if (onPlatform) {
                    // Find the platform the character is currently colliding with
                    const currentPlatform = platforms.find(platform => {
                        const withinXBounds = prev.x >= platform.position.x && prev.x <= platform.position.x + platform.width;
                        const withinYBounds = prev.y >= platform.position.y && prev.y < platform.position.y + platform.height;
                        return withinXBounds && withinYBounds;
                    });
    
                    // Place character on top of the platform
                    newY = currentPlatform.position.y;
                } else {
                    // Apply gravity if not on a platform
                    newY = Math.max(prev.y - 5, 0); // Gravity value and ground level
                }
    
                return { ...prev, y: newY };
            });
        }, 50); // Run the gravity effect at an interval (e.g., 50ms for 20fps)
    
        return () => clearInterval(gravityInterval);
    }, [characterPosition, platforms]); // Include platforms in the dependency array


    // Update the platforms state when the character collides with a breakable platform
    const handlePlatformCollision = (platform) => {
        setPlatforms(prevPlatforms => prevPlatforms.map(p => {
            if (p.id === platform.id) {
                return { ...p, shouldRemove: true };
            }
            return p;
        }));
    };

    // Handle collisions
    const handleCollision = useCallback((type, item) => {
        switch (type) {
            case 'platform':
                if (characterPosition.y > item.position.y) {
                    setCharacterPosition(prevPos => ({
                        ...prevPos,
                        y: item.position.y + item.height
                    }));
                    if (item.type === PLATFORM_TYPES.BREAKABLE) {
                        handlePlatformCollision(item);
                    }
                }
                break;
            case 'obstacle':
                if (!activePowerUp || activePowerUp !== POWERUP_TYPES.SHIELD) {
                    onGameOver(score);
                }
                break;
            case 'powerUp':
                handlePowerUpCollection(item.type);
                break;
            default:
                break;
        }
    }, [activePowerUp, onGameOver, score, characterPosition.y]);

    // Handle power-up collection
    const handlePowerUpCollection = useCallback((type) => {
        setActivePowerUp(type);
        
        if (powerUpTimer) clearTimeout(powerUpTimer);

        const timer = setTimeout(() => {
            setActivePowerUp(null);
            setPowerUpTimer(null);
        }, 10000);

        setPowerUpTimer(timer);

        switch (type) {
            case POWERUP_TYPES.SPEED_BOOST:
                setGameSpeed(prevSpeed => prevSpeed * 1.5);
                break;
            case POWERUP_TYPES.EXTRA_LIFE:
                // Implement extra life logic
                break;
            case POWERUP_TYPES.SCORE_MULTIPLIER:
                setScore(prevScore => prevScore * 2);
                break;
            default:
                break;
        }
    }, [powerUpTimer]);

    return (
        <div 
        ref={gameAreaRef}
        className="relative w-screen h-screen bg-gradient-to-b from-blue-400 to-purple-500 overflow-hidden"
        style={{ cursor: 'none', width: '100vw', height: '100vh',
        border: '3px solid red' // Add a red border for visibility
    }} // Set to full viewport width and height
    >
            <div className="absolute top-0 left-0 p-4 text-white text-2xl font-bold">
                Score: {score}
            </div>
            {activePowerUp && (
                <div className="absolute top-0 right-0 p-4 text-white text-xl">
                    Active Power-up: {activePowerUp}
                </div>
            )}
            <Character
                position={characterPosition}
                onMove={handleCharacterMove} 
                activePowerUp={activePowerUp}
            />
            <PlatformManager
                gameSpeed={gameSpeed}
                onCollision={(platform) => handleCollision('platform', platform)}
            />
            <ObstacleManager
                gameSpeed={gameSpeed}
                onCollision={(obstacle) => handleCollision('obstacle', obstacle)}
            />
            <PowerUpManager
                gameSpeed={gameSpeed}
                onPowerUpCollected={(powerUp) => handleCollision('powerUp', powerUp)}
            />
        </div>
    );
};

export default Game;