// Obstacle.js
// Component for obstacles in Unicorn Jump

import React, { useState, useEffect } from 'react';

const OBSTACLE_TYPES = {
    STATIC: 'static',
    MOVING: 'moving',
    DISAPPEARING: 'disappearing'
};

const Obstacle = ({ type, position, size, gameSpeed }) => {
    const [currentPosition, setCurrentPosition] = useState(position);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        let moveInterval;
        if (type === OBSTACLE_TYPES.MOVING) {
            moveInterval = setInterval(() => {
                setCurrentPosition(prevPos => ({
                    x: prevPos.x + Math.sin(Date.now() / 1000) * 2, // Horizontal movement
                    y: prevPos.y
                }));
            }, 16);
        }

        return () => {
            if (moveInterval) clearInterval(moveInterval);
        };
    }, [type]);

    useEffect(() => {
        if (type === OBSTACLE_TYPES.DISAPPEARING) {
            const disappearInterval = setInterval(() => {
                setIsVisible(prev => !prev);
            }, 1000); // Toggle visibility every second

            return () => clearInterval(disappearInterval);
        }
    }, [type]);

    if (!isVisible) return null;

    const getObstacleStyle = () => {
        switch (type) {
            case OBSTACLE_TYPES.STATIC:
                return { backgroundColor: 'red' };
            case OBSTACLE_TYPES.MOVING:
                return { backgroundColor: 'orange' };
            case OBSTACLE_TYPES.DISAPPEARING:
                return { backgroundColor: 'purple' };
            default:
                return { backgroundColor: 'gray' };
        }
    };

    return (
        <div
            style={{
                position: 'absolute',
                left: `${currentPosition.x}px`,
                bottom: `${currentPosition.y}px`,
                width: `${size.width}px`,
                height: `${size.height}px`,
                ...getObstacleStyle(),
                transition: 'left 0.1s ease-out'
            }}
        />
    );
};

const ObstacleManager = ({ gameSpeed, onCollision }) => {
    const [obstacles, setObstacles] = useState([]);

    const generateObstacle = () => {
        const types = Object.values(OBSTACLE_TYPES);
        const newObstacle = {
            id: Date.now(),
            type: types[Math.floor(Math.random() * types.length)],
            position: {
                x: Math.random() * (window.innerWidth - 50),
                y: window.innerHeight
            },
            size: {
                width: Math.random() * (60 - 30) + 30,
                height: Math.random() * (60 - 30) + 30
            }
        };
        setObstacles(prevObstacles => [...prevObstacles, newObstacle]);
    };

    useEffect(() => {
        const generationInterval = setInterval(generateObstacle, 3000 / gameSpeed);
        return () => clearInterval(generationInterval);
    }, [gameSpeed]);

    useEffect(() => {
        const moveObstacles = () => {
            setObstacles(prevObstacles => 
                prevObstacles
                    .map(obstacle => ({
                        ...obstacle,
                        position: {
                            ...obstacle.position,
                            y: obstacle.position.y - 2 * gameSpeed
                        }
                    }))
                    .filter(obstacle => obstacle.position.y + obstacle.size.height > 0)
            );
        };

        const moveInterval = setInterval(moveObstacles, 16); // 60 FPS
        return () => clearInterval(moveInterval);
    }, [gameSpeed]);

    return (
        <>
            {obstacles.map(obstacle => (
                <Obstacle
                    key={obstacle.id}
                    type={obstacle.type}
                    position={obstacle.position}
                    size={obstacle.size}
                    gameSpeed={gameSpeed}
                />
            ))}
        </>
    );
};

export { Obstacle, ObstacleManager };