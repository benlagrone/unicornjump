// Character.js
// Component for the unicorn character in Unicorn Jump

import React, { useEffect, useRef, useState } from 'react';

const Character = ({ position, width, height, activePowerUp, onPlatform }) => {
    const characterRef = useRef(null);
    const [characterState, setCharacterState] = useState('idle');
    const prevPosition = useRef(position);
    const [isOnPlatform, setIsOnPlatform] = useState(false);

    useEffect(() => {
        console.log('Character position updated:', position);
        
        // Determine character state based on position change and platform status
        if (!isOnPlatform && position.y < prevPosition.current.y) {
            setCharacterState('jumping');
        } else if (!isOnPlatform && position.y > prevPosition.current.y) {
            setCharacterState('falling');
        } else if (position.x !== prevPosition.current.x) {
            setCharacterState('running');
        } else if (isOnPlatform) {
            setCharacterState('idle');
        }

        prevPosition.current = position;
    }, [position, isOnPlatform]);

    useEffect(() => {
        setIsOnPlatform(onPlatform);
    }, [onPlatform]);

    useEffect(() => {
        if (activePowerUp) {
            console.log('Active power-up:', activePowerUp);
        }
    }, [activePowerUp]);

    const getCharacterImage = () => {
        switch (characterState) {
            case 'jumping':
                return `${process.env.PUBLIC_URL}/assets/images/character/unicorn_jump.png`;
            case 'running':
                return `${process.env.PUBLIC_URL}/assets/images/character/unicorn_run.png`;
            case 'falling':
                return `${process.env.PUBLIC_URL}/assets/images/character/unicorn_fall.png`;
            default:
                return `${process.env.PUBLIC_URL}/assets/images/character/unicorn_idle.png`;
        }
    };

    return (
        <div 
            ref={characterRef}
            className={`absolute transition-all duration-100 ease-in-out ${activePowerUp ? `power-up-${activePowerUp}` : ''} ${characterState}`}
            style={{
                width: `${width}px`,
                height: `${height}px`,
                backgroundImage: `url(${getCharacterImage()})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                position: 'absolute',
                left: `${position.x}px`,
                top: `${position.y}px`,
                willChange: 'transform',
                zIndex: 1000,
                transform: `scaleX(${position.x > prevPosition.current.x ? 1 : -1})` // Flip character based on movement direction
            }}
        >
            {/* Power-up effect */}
            {activePowerUp && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(255, 215, 0, 0.3)',
                        borderRadius: '50%',
                        animation: 'pulse 1s infinite',
                    }}
                />
            )}
        </div>
    );
};

export default Character;