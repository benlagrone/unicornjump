// Character.js
// Component for the unicorn character in Unicorn Jump

import React, { useState, useEffect } from 'react';

const Character = ({ position, onMove, activePowerUp }) => {
    // Log the position prop every time the component renders
    console.log('Character position prop:', position);
    // State for character properties
    const [jumping, setJumping] = useState(false);

    // Character dimensions
    const WIDTH = 50;
    const HEIGHT = 50;

    // Jump function
    const jump = () => {
        if (!jumping) {
            setJumping(true);
            // Implement jump logic here
            setTimeout(() => setJumping(false), 500); // Simple jump duration
        }
    };

    // Handle device tilt or touch for movement
    useEffect(() => {
        const handleMove = (event) => {
            // Implement movement logic based on device tilt or touch
            // This is a placeholder and should be replaced with actual logic
            // const newX = event.clientX || (event.touches && event.touches[0].clientX);
            console.log('Character handleMove newX:', event);
            // console.log('Character handleMove newX:', newX); // Log the newX inside handleMove
            // if (newX) onMove(newX);
            onMove(event);
        };

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('touchmove', handleMove);

        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('touchmove', handleMove);
        };
    }, [onMove]);

    return (
        <div alt="char"
            className={`absolute ${jumping ? 'animate-jump' : ''} ${activePowerUp ? `power-up-${activePowerUp}` : ''}`}
            style={{
                left: `${position.x}px`, // Position from the left of the game area
                bottom: `${position.y}px`, // Position from the bottom of the game area
                width: `${WIDTH}px`,
                height: `${HEIGHT}px`,
                backgroundColor: 'pink', // Placeholder, replace with unicorn sprite
                borderRadius: '50%',
                position:'absolute',
                // Make sure the transform origin is centered if you have jumping animations
                transform: 'translate(-50%, -50%)'
            }}
            onClick={jump}
        >
            {/* Add unicorn sprite or animation here */}
        </div>
    );
};

export default Character;