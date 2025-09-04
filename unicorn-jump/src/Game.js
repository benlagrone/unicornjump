// Game.js
// Main component for Unicorn Jump

import React, { useState, useEffect, useRef } from 'react';
import Character from './Character';

const CHARACTER_WIDTH = 50;
const CHARACTER_HEIGHT = 50;
const GROUND_HEIGHT_PERCENTAGE = 0.15;
const GRAVITY = 0.5;
const JUMP_FORCE = 15;
const MOVE_SPEED = 5;
const SCROLL_THRESHOLD = window.innerHeight * 0.3;
const PLATFORM_COUNT = 5;
const PLATFORM_SPEED = 2;

const PLATFORM_TYPES = {
    STATIC: 'static',
    MOVING: 'moving',
    BREAKABLE: 'breakable'
};

const Game = () => {
    const [characterPosition, setCharacterPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight - CHARACTER_HEIGHT - (window.innerHeight * GROUND_HEIGHT_PERCENTAGE) });
    const [characterVelocity, setCharacterVelocity] = useState({ x: 0, y: 0 });
    const [platforms, setPlatforms] = useState([]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const gameLoopRef = useRef();
    const keysPressed = useRef({});

    useEffect(() => {
        resetGame();
        return () => {
            cancelAnimationFrame(gameLoopRef.current);
        };
    }, []);

    const resetGame = () => {
        setCharacterPosition({ x: window.innerWidth / 2, y: window.innerHeight - CHARACTER_HEIGHT - (window.innerHeight * GROUND_HEIGHT_PERCENTAGE) });
        setCharacterVelocity({ x: 0, y: 0 });
        setScore(0);
        setGameOver(false);
        generateInitialPlatforms();
        
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    const handleKeyDown = (e) => {
        keysPressed.current[e.key] = true;
        if (gameOver && (e.key === 'Enter' || e.key === ' ')) {
            resetGame();
        }
    };

    const handleKeyUp = (e) => {
        keysPressed.current[e.key] = false;
    };

    const generateInitialPlatforms = () => {
        const initialPlatforms = [];
        for (let i = 1; i <= PLATFORM_COUNT; i++) {
            initialPlatforms.push(generatePlatform(window.innerHeight - (i * (window.innerHeight / PLATFORM_COUNT))));
        }
        setPlatforms(initialPlatforms);
    };

    const generatePlatform = (yPosition) => {
        const types = Object.values(PLATFORM_TYPES);
        const type = types[Math.floor(Math.random() * types.length)];
        return {
            x: Math.random() * (window.innerWidth - 100),
            y: yPosition,
            width: 100,
            height: 20,
            type: type,
            direction: Math.random() < 0.5 ? -1 : 1, // For moving platforms
            health: type === PLATFORM_TYPES.BREAKABLE ? 2 : Infinity // For breakable platforms
        };
    };

    const gameLoop = () => {
        if (gameOver) return;

        try {
            setCharacterPosition(prevPos => {
                if (!prevPos) {
                    console.error('prevPos is undefined in gameLoop');
                    return { x: window.innerWidth / 2, y: window.innerHeight - CHARACTER_HEIGHT - (window.innerHeight * GROUND_HEIGHT_PERCENTAGE) };
                }

                let newX = prevPos.x;
                let newY = prevPos.y;

                // Horizontal movement
                if (keysPressed.current['ArrowLeft']) newX -= MOVE_SPEED;
                if (keysPressed.current['ArrowRight']) newX += MOVE_SPEED;

                // Apply gravity and update position
                setCharacterVelocity(prev => {
                    if (!prev) {
                        console.error('prev velocity is undefined in gameLoop');
                        return { x: 0, y: GRAVITY };
                    }
                    return { x: prev.x, y: prev.y + GRAVITY };
                });

                newX += characterVelocity.x;
                newY += characterVelocity.y;

                // Check platform collisions
                let onPlatform = false;
                setPlatforms(prevPlatforms => {
                    if (!prevPlatforms) {
                        console.error('prevPlatforms is undefined in gameLoop');
                        return [];
                    }
                    return prevPlatforms.map(platform => {
                        if (!platform) return null;
                        let updatedPlatform = { ...platform };
                        
                        // Move platforms down
                        updatedPlatform.y += PLATFORM_SPEED;

                        // Move moving platforms horizontally
                        if (updatedPlatform.type === PLATFORM_TYPES.MOVING) {
                            updatedPlatform.x += updatedPlatform.direction * 2;
                            if (updatedPlatform.x <= 0 || updatedPlatform.x + updatedPlatform.width >= window.innerWidth) {
                                updatedPlatform.direction *= -1;
                            }
                        }

                        // Check collision
                        if (
                            newX < updatedPlatform.x + updatedPlatform.width &&
                            newX + CHARACTER_WIDTH > updatedPlatform.x &&
                            newY + CHARACTER_HEIGHT >= updatedPlatform.y &&
                            newY + CHARACTER_HEIGHT <= updatedPlatform.y + updatedPlatform.height &&
                            characterVelocity.y >= 0
                        ) {
                            newY = updatedPlatform.y - CHARACTER_HEIGHT;
                            setCharacterVelocity(prev => ({ ...prev, y: -JUMP_FORCE }));
                            onPlatform = true;

                            // Handle breakable platforms
                            if (updatedPlatform.type === PLATFORM_TYPES.BREAKABLE) {
                                updatedPlatform.health -= 1;
                                if (updatedPlatform.health <= 0) {
                                    return null; // Remove the platform
                                }
                            }
                        }

                        return updatedPlatform;
                    }).filter(platform => platform && platform.y < window.innerHeight);
                });

                // Generate new platforms
                if (platforms[platforms.length - 1]?.y > 0) {
                    setPlatforms(prevPlatforms => [...prevPlatforms, generatePlatform(-100)]);
                }

                // Update score
                setScore(prevScore => Math.max(prevScore, Math.floor((window.innerHeight - newY) / 10)));

                // Boundary checks
                newX = Math.max(0, Math.min(newX, window.innerWidth - CHARACTER_WIDTH));

                // Check for game over condition
                if (newY > window.innerHeight) {
                    setGameOver(true);
                    window.removeEventListener('keydown', handleKeyDown);
                    window.removeEventListener('keyup', handleKeyUp);
                    cancelAnimationFrame(gameLoopRef.current);
                }

                return { x: newX, y: newY };
            });
        } catch (error) {
            console.error('Error in gameLoop:', error);
            setGameOver(true);
            cancelAnimationFrame(gameLoopRef.current);
        }

        gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    const getPlatformColor = (type) => {
        switch(type) {
            case PLATFORM_TYPES.MOVING:
                return 'blue';
            case PLATFORM_TYPES.BREAKABLE:
                return 'red';
            default:
                return 'green';
        }
    };

    return (
        <div className="game-container" style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 10, left: 10, fontSize: 24 }}>Score: {score}</div>
            {!gameOver && (
                <>
                    <Character position={characterPosition} width={CHARACTER_WIDTH} height={CHARACTER_HEIGHT} />
                    {platforms.map((platform, index) => (
                        platform && (
                            <div
                                key={index}
                                style={{
                                    position: 'absolute',
                                    left: platform.x,
                                    top: platform.y,
                                    width: platform.width,
                                    height: platform.height,
                                    backgroundColor: getPlatformColor(platform.type),
                                }}
                            />
                        )
                    ))}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            height: `${window.innerHeight * GROUND_HEIGHT_PERCENTAGE}px`,
                            backgroundColor: 'brown',
                        }}
                    />
                </>
            )}
            {gameOver && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    fontSize: 32,
                    color: 'white'
                }}>
                    <h1>Game Over</h1>
                    <p>Your score: {score}</p>
                    <p>Press Enter or Space to restart</p>
                </div>
            )}
        </div>
    );
};

export default Game;