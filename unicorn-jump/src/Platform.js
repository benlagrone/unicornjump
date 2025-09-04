// Platform.js
// Component for platforms in Unicorn Jump

import React, { useState, useEffect } from 'react';

const PLATFORM_TYPES = {
    REGULAR: 'regular',
    MOVING: 'moving',
    BREAKABLE: 'breakable',
    SPECIAL: 'special'
};

// Update this array with the correct filenames of your floating platform images
const PLATFORM_IMAGES = [
    '/assets/platform/float/platform-1.png',
    '/assets/platform/float/platform-2.png',
    '/assets/platform/float/platform-3.png',
    '/assets/platform/float/platform-4.png',
    '/assets/platform/float/platform-5.png'
];

const Platform = ({ type, position, width, image }) => {
    const [currentPosition, setCurrentPosition] = useState(position);

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
                height: '60px', // Adjusted height to better match platform images
                backgroundImage: `url(${image})`,
                backgroundColor: '#8B4513', // Fallback color if image fails to load
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                transition: type === PLATFORM_TYPES.MOVING ? 'left 0.05s linear' : 'none'
            }}
        />
    );
};

const PlatformManager = ({ gameSpeed, onCollision, characterPosition, jumpVelocity }) => {
    const createRandomPlatform = (id) => ({
        id: id,
        type: Object.values(PLATFORM_TYPES)[Math.floor(Math.random() * Object.values(PLATFORM_TYPES).length)],
        position: {
            x: Math.random() * (window.innerWidth - 300),
            y: Math.random() * (window.innerHeight - 100)
        },
        width: 300, // Set a consistent width for all platforms
        image: PLATFORM_IMAGES[Math.floor(Math.random() * PLATFORM_IMAGES.length)]
    });

    const initialPlatforms = Array.from({ length: 5 }, (_, index) => 
        createRandomPlatform(index + 1)
    );

    const [platforms, setPlatforms] = useState(initialPlatforms);

    const generatePlatform = () => {
        const newPlatform = createRandomPlatform(Date.now());
        setPlatforms(prevPlatforms => [...prevPlatforms, newPlatform]);
    };

    useEffect(() => {
        const generationInterval = setInterval(generatePlatform, 2000 / gameSpeed);
        return () => clearInterval(generationInterval);
    }, [gameSpeed]);

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
                    .filter(platform => platform.position.y > -100) // Remove platforms that are off-screen
            );
        };

        const moveInterval = setInterval(movePlatforms, 16); // 60 FPS
        return () => clearInterval(moveInterval);
    }, [gameSpeed]);

    // Check for collisions
    useEffect(() => {
        platforms.forEach(platform => {
            if (characterPosition.y + 200 <= platform.position.y + 60 && // 200 is CHARACTER_HEIGHT
                characterPosition.y + 200 + jumpVelocity >= platform.position.y &&
                characterPosition.x + 200 > platform.position.x && // 200 is CHARACTER_WIDTH
                characterPosition.x < platform.position.x + platform.width) {
                onCollision(platform);
            }
        });
    }, [platforms, characterPosition, jumpVelocity, onCollision]);

    return (
        <>
            {platforms.map(platform => (
                <Platform
                    key={platform.id}
                    type={platform.type}
                    position={platform.position}
                    width={platform.width}
                    image={platform.image}
                />
            ))}
        </>
    );
};

export { Platform, PlatformManager, PLATFORM_TYPES };