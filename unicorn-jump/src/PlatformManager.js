import React, { useState, useEffect, useRef } from 'react';

export const PLATFORM_TYPES = {
    NORMAL: 'normal',
    MOVING: 'moving',
    BREAKABLE: 'breakable',
    SPECIAL: 'special'
};

class PlatformManagerClass {
    constructor() {
        this.platforms = [];
        this.MIN_HORIZONTAL_DISTANCE = 100;
        this.MIN_VERTICAL_DISTANCE = 100;
        this.MAX_VERTICAL_DISTANCE = 200;
        this.PLATFORM_SPEED = 1;
        this.PLATFORM_WIDTH = 200;
        this.PLATFORM_HEIGHT = 40;
        this.idCounter = 0;
    }

    generateUniqueId() {
        this.idCounter += 1;
        return `${Date.now()}-${this.idCounter}`;
    }

    getRandomPlatformImage(type) {
        const platformImages = {
            [PLATFORM_TYPES.NORMAL]: ['float-1.png', 'float-2.png', 'float-3.png'],
            [PLATFORM_TYPES.MOVING]: ['float-4.png', 'float-5.png'],
            [PLATFORM_TYPES.BREAKABLE]: ['float-6.png', 'float-7.png'],
            [PLATFORM_TYPES.SPECIAL]: ['float-8.png', 'float-9.png'],
        };
        const images = platformImages[type] || platformImages[PLATFORM_TYPES.NORMAL];
        const randomIndex = Math.floor(Math.random() * images.length);
        return `${process.env.PUBLIC_URL}/assets/platform/float/${images[randomIndex]}`;
    }

    generateInitialPlatforms() {
        this.platforms = [
            {
                id: this.generateUniqueId(),
                type: PLATFORM_TYPES.NORMAL,
                position: { x: window.innerWidth / 2 - this.PLATFORM_WIDTH / 2, y: window.innerHeight - 100 },
                width: this.PLATFORM_WIDTH,
                height: this.PLATFORM_HEIGHT,
                image: this.getRandomPlatformImage(PLATFORM_TYPES.NORMAL)
            }
        ];
        return this.platforms;
    }

    generatePlatform(lastPlatform) {
        const types = Object.values(PLATFORM_TYPES);
        const type = types[Math.floor(Math.random() * types.length)];

        let x, y;

        if (lastPlatform) {
            const minX = Math.max(0, lastPlatform.position.x - this.MIN_HORIZONTAL_DISTANCE);
            const maxX = Math.min(window.innerWidth - this.PLATFORM_WIDTH, lastPlatform.position.x + this.MIN_HORIZONTAL_DISTANCE);
            x = Math.random() * (maxX - minX) + minX;

            y = lastPlatform.position.y - (Math.random() * (this.MAX_VERTICAL_DISTANCE - this.MIN_VERTICAL_DISTANCE) + this.MIN_VERTICAL_DISTANCE);
        } else {
            x = Math.random() * (window.innerWidth - this.PLATFORM_WIDTH);
            y = -20;
        }

        return {
            id: this.generateUniqueId(),
            type,
            position: { x, y },
            width: this.PLATFORM_WIDTH,
            height: this.PLATFORM_HEIGHT,
            image: this.getRandomPlatformImage(type)
        };
    }

    updatePlatforms(gameSpeed, deltaTime) {
        this.platforms = this.platforms
            .filter(platform => platform.position.y < window.innerHeight)
            .map(platform => ({
                ...platform,
                position: {
                    ...platform.position,
                    y: platform.position.y + (this.PLATFORM_SPEED * gameSpeed * deltaTime) / 16.67
                }
            }));

        if (this.platforms.length < 5 || this.platforms[this.platforms.length - 1].position.y > 0) {
            const lastPlatform = this.platforms[this.platforms.length - 1];
            this.platforms.push(this.generatePlatform(lastPlatform));
        }

        return this.platforms;
    }
}

export const PlatformManager = PlatformManagerClass;

const PlatformManagerComponent = ({ gameSpeed, onCollision, isPaused }) => {
    const [platforms, setPlatforms] = useState([]);
    const lastUpdateTimeRef = useRef(Date.now());
    const platformManagerRef = useRef(new PlatformManagerClass());

    useEffect(() => {
        setPlatforms(platformManagerRef.current.generateInitialPlatforms());
    }, []);

    useEffect(() => {
        const updatePlatforms = () => {
            if (isPaused) {
                requestAnimationFrame(updatePlatforms);
                return;
            }

            const currentTime = Date.now();
            const deltaTime = currentTime - lastUpdateTimeRef.current;
            lastUpdateTimeRef.current = currentTime;

            setPlatforms(platformManagerRef.current.updatePlatforms(gameSpeed, deltaTime));

            requestAnimationFrame(updatePlatforms);
        };

        const animationId = requestAnimationFrame(updatePlatforms);

        return () => cancelAnimationFrame(animationId);
    }, [gameSpeed, isPaused]);

    return (
        <>
            {platforms.map(platform => (
                <div
                    key={platform.id}
                    style={{
                        position: 'absolute',
                        left: platform.position.x,
                        top: platform.position.y,
                        width: platform.width,
                        height: platform.height,
                        backgroundImage: `url(${platform.image})`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        transition: isPaused ? 'none' : 'top 0.05s linear'
                    }}
                    onMouseEnter={() => !isPaused && onCollision(platform)}
                />
            ))}
        </>
    );
};

export default PlatformManagerComponent;