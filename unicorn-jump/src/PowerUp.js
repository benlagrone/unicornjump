// PowerUp.js
// Component for power-ups in Unicorn Jump

import React, { useState, useEffect } from 'react';

const POWERUP_TYPES = {
    SPEED_BOOST: 'speedBoost',
    SHIELD: 'shield',
    EXTRA_LIFE: 'extraLife',
    SCORE_MULTIPLIER: 'scoreMultiplier'
};

const PowerUp = ({ type, position, onCollect }) => {
    const [isVisible, setIsVisible] = useState(true);

    const getPowerUpStyle = () => {
        switch (type) {
            case POWERUP_TYPES.SPEED_BOOST:
                return { backgroundColor: 'yellow', borderRadius: '50%' };
            case POWERUP_TYPES.SHIELD:
                return { backgroundColor: 'blue', borderRadius: '50%' };
            case POWERUP_TYPES.EXTRA_LIFE:
                return { backgroundColor: 'green', borderRadius: '50%' };
            case POWERUP_TYPES.SCORE_MULTIPLIER:
                return { backgroundColor: 'purple', borderRadius: '50%' };
            default:
                return { backgroundColor: 'white', borderRadius: '50%' };
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsVisible(false);
        }, 10000); // Power-up disappears after 10 seconds if not collected

        return () => clearTimeout(timeout);
    }, []);

    if (!isVisible) return null;

    return (
        <div
            style={{
                position: 'absolute',
                left: `${position.x}px`,
                bottom: `${position.y}px`,
                width: '30px',
                height: '30px',
                ...getPowerUpStyle(),
                cursor: 'pointer',
            }}
            onClick={() => {
                setIsVisible(false);
                onCollect(type);
            }}
        />
    );
};

const PowerUpManager = ({ gameSpeed, onPowerUpCollected }) => {
    const [powerUps, setPowerUps] = useState([]);

    const generatePowerUp = () => {
        const types = Object.values(POWERUP_TYPES);
        const newPowerUp = {
            id: Date.now(),
            type: types[Math.floor(Math.random() * types.length)],
            position: {
                x: Math.random() * (window.innerWidth - 30),
                y: window.innerHeight
            }
        };
        setPowerUps(prevPowerUps => [...prevPowerUps, newPowerUp]);
    };

    useEffect(() => {
        const generationInterval = setInterval(generatePowerUp, 10000 / gameSpeed); // Generate power-up every 10 seconds, adjusted for game speed
        return () => clearInterval(generationInterval);
    }, [gameSpeed]);

    useEffect(() => {
        const movePowerUps = () => {
            setPowerUps(prevPowerUps => 
                prevPowerUps
                    .map(powerUp => ({
                        ...powerUp,
                        position: {
                            ...powerUp.position,
                            y: powerUp.position.y - 1 * gameSpeed
                        }
                    }))
                    .filter(powerUp => powerUp.position.y + 30 > 0) // Remove power-ups that are off-screen
            );
        };

        const moveInterval = setInterval(movePowerUps, 16); // 60 FPS
        return () => clearInterval(moveInterval);
    }, [gameSpeed]);

    const handlePowerUpCollect = (type) => {
        onPowerUpCollected(type);
        // You might want to add logic here to remove the collected power-up from the state
    };

    return (
        <>
            {powerUps.map(powerUp => (
                <PowerUp
                    key={powerUp.id}
                    type={powerUp.type}
                    position={powerUp.position}
                    onCollect={handlePowerUpCollect}
                />
            ))}
        </>
    );
};

export { PowerUp, PowerUpManager, POWERUP_TYPES };