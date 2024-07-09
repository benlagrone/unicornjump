// Platform.js
// Component for platforms in Unicorn Jump

import React, { useState, useEffect } from 'react';

const PLATFORM_TYPES = {
    REGULAR: 'regular',
    MOVING: 'moving',
    BREAKABLE: 'breakable',
    SPECIAL: 'special'
};

const Platform = ({ type, position, width }) => {
    // Platform properties based on type
    const getPlatformProperties = (type) => {
        switch (type) {
            case PLATFORM_TYPES.REGULAR:
                return { color: 'green', height: 20 };
            case PLATFORM_TYPES.MOVING:
                return { color: 'blue', height: 20 };
            case PLATFORM_TYPES.BREAKABLE:
                return { color: 'orange', height: 15 };
            case PLATFORM_TYPES.SPECIAL:
                return { color: 'purple', height: 25 };
            default:
                return { color: 'gray', height: 20 };
        }
    };

    const { color, height } = getPlatformProperties(type);

    // State for moving platforms
    const [currentPosition, setCurrentPosition] = useState(position);

    // Effect for moving platforms
    useEffect(() => {
        if (type === PLATFORM_TYPES.MOVING) {
            const moveInterval = setInterval(() => {
                setCurrentPosition(prevPos => ({
                    x: prevPos.x + (Math.random() > 0.5 ? 1 : -1),
                    y: prevPos.y
                }));
            }, 50);

            return () => clearInterval(moveInterval);
        }
    }, [type]);

    return (
        <div
            className="absolute"
            style={{
                left: `${currentPosition.x}px`,
                bottom: `${currentPosition.y}px`,
                width: `${width}px`,
                height: `${height}px`,
                backgroundColor: color,
                transition: type === PLATFORM_TYPES.MOVING ? 'left 0.05s linear' : 'none'
            }}
        >
            {/* Add platform sprite or additional styling here */}
        </div>
    );
};

const PlatformManager = ({ gameSpeed, onCollision }) => {
    // Function to generate a single platform with a random position
    const createRandomPlatform = (id) => ({
        id: id,
        type: 'regular', // You can randomize this too if you have different types
        position: {
            x: Math.random() * (window.innerWidth - 200), // Random X position within the window width
            y: Math.random() * (window.innerHeight - 200) // Random Y position within the window height
        },
        width: 100 // Or any other logic for random width
    });

    // Initialize with a set of random platforms
    const initialPlatforms = Array.from({ length: 5 }, (_, index) => 
        createRandomPlatform(index + 1)
    );

    const [platforms, setPlatforms] = useState(initialPlatforms);


    // Function to generate new platforms
    const generatePlatform = () => {
        const types = Object.values(PLATFORM_TYPES);
        const newPlatform = {
            id: Date.now(),
            type: types[Math.floor(Math.random() * types.length)],
            position: {
                x: Math.random() * (window.innerWidth - 100),
                y: window.innerHeight // Start off-screen at the bottom
            },
            width: Math.random() * (100 - 50) + 50 // Random width between 50 and 100
        };
        setPlatforms(prevPlatforms => [...prevPlatforms, newPlatform]);
    };

    // Effect to continuously generate platforms
    useEffect(() => {
        const generationInterval = setInterval(generatePlatform, 2000 / gameSpeed);
        return () => clearInterval(generationInterval);
    }, [gameSpeed]);

    // Effect to move platforms upwards and remove off-screen platforms
    useEffect(() => {
        const movePlatforms = () => {
            setPlatforms(prevPlatforms => 
                prevPlatforms
                    .map(platform => ({
                        ...platform,
                        position: {
                            ...platform.position,
                            y: platform.position.y - 1 * gameSpeed
                        }
                    }))
                  );
        };

        const moveInterval = setInterval(movePlatforms, 16); // 60 FPS
        return () => clearInterval(moveInterval);
    }, [gameSpeed]);

    return (
        <>
            {platforms.map(platform => (
                <Platform
                    key={platform.id}
                    type={platform.type}
                    position={platform.position}
                    width={platform.width}
                />
            ))}
        </>
    );
};

export { Platform, PlatformManager, PLATFORM_TYPES };