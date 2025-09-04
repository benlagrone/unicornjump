import React, { useState, useEffect } from 'react';

const OBSTACLE_TYPES = {
    STATIC: 'static',
    MOVING: 'moving'
};

const ObstacleManager = ({ gameSpeed, onCollision }) => {
    const [obstacles, setObstacles] = useState([]);

    useEffect(() => {
        const generateObstacle = () => {
            const types = Object.values(OBSTACLE_TYPES);
            const type = types[Math.floor(Math.random() * types.length)];
            const width = 30;
            const height = 30;
            const x = Math.random() * (window.innerWidth - width);
            const y = window.innerHeight; // Start from bottom of the screen

            return {
                id: Date.now().toString(),
                type,
                position: { x, y },
                width,
                height,
                direction: Math.random() < 0.5 ? -1 : 1 // For moving obstacles
            };
        };

        const interval = setInterval(() => {
            setObstacles(prevObstacles => {
                const newObstacles = prevObstacles
                    .filter(obstacle => obstacle.position.y > -50) // Remove obstacles that are off-screen
                    .map(obstacle => {
                        let newX = obstacle.position.x;
                        if (obstacle.type === OBSTACLE_TYPES.MOVING) {
                            newX += obstacle.direction * gameSpeed;
                            if (newX <= 0 || newX >= window.innerWidth - obstacle.width) {
                                obstacle.direction *= -1; // Reverse direction if hitting the edge
                            }
                        }
                        return {
                            ...obstacle,
                            position: {
                                x: newX,
                                y: obstacle.position.y - 3 * gameSpeed // Move obstacles upwards faster than platforms
                            }
                        };
                    });

                if (Math.random() < 0.02) { // 2% chance to generate a new obstacle each update
                    newObstacles.push(generateObstacle());
                }

                return newObstacles;
            });
        }, 50); // Update every 50ms

        return () => clearInterval(interval);
    }, [gameSpeed]);

    return (
        <>
            {obstacles.map(obstacle => (
                <div
                    key={obstacle.id}
                    style={{
                        position: 'absolute',
                        left: obstacle.position.x,
                        bottom: obstacle.position.y,
                        width: obstacle.width,
                        height: obstacle.height,
                        backgroundColor: obstacle.type === OBSTACLE_TYPES.STATIC ? 'red' : 'purple',
                        borderRadius: '50%',
                        transition: 'bottom 0.05s linear, left 0.05s linear'
                    }}
                    onMouseEnter={() => onCollision(obstacle)}
                />
            ))}
        </>
    );
};

export { ObstacleManager, OBSTACLE_TYPES };