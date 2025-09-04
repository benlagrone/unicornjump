# Unicorn Jump Game Documentation

## Game Overview

Unicorn Jump is a vertical platformer game where players control a unicorn character that jumps upwards through a series of descending platforms. The goal is to achieve the highest score possible by reaching new heights and avoiding falls.

## Game Mechanics

1. Character Movement:
   - The unicorn character starts at the bottom of the screen.
   - Players can move the unicorn left and right using arrow keys or on-screen controls.
   - The player can make th character jump up to a platform

2. Platforms:
   - Platforms continuously descend from the top of the screen.
   - There are three types of platforms:
     - Static: Regular platforms that don't move horizontally.
     - Moving: Platforms that move left and right while descending.
     - Breakable: Platforms that disappear after the unicorn jumps on them once or twice.

3. Scoring:
   - The score increases based on the height reached by the unicorn.
   - Collecting power-ups or performing special actions may provide bonus points.

4. Game Over:
   - the game ends if the chracter falls from 75% or above the screen height

## Technical Implementation

### Core Components

1. Game Loop:
   - Handles continuous updating of game state and rendering.
   - Manages platform generation and movement.
   - Updates character position and checks for collisions.

2. Character Controller:
   - Manages character movement and jumping mechanics.
   - Handles user input for horizontal movement.

3. Platform Manager:
   - Generates and manages different types of platforms.
   - Handles platform movement and removal when off-screen.

4. Collision Detection:
   - Checks for collisions between the character and platforms.
   - Triggers appropriate actions based on collision type.

5. Score Manager:
   - Tracks and updates the player's score.
   - Manages high score persistence.

### Art and Audio Assets

[This section remains unchanged]

## Next Steps

1. Implement sound effects and background music. sound effects are in ./public/assets/media/ and are multiple wav files. attribute the file name to the action.
2. implement using different chracter files for perspective
   unicorn_fall.png - when chracter falls
   unicorn_idle. png when chracter resting on ground or platform
   unicorn_jump.png when chracter jumping
   unicorn_side-_r.png when unicorn moving in right direction
   unicorn_side_l.png when unicorn moving in left direction
3. Add power-ups and special abilities for the unicorn character.
4. Implement a difficulty progression system.
5. add obstacles that can bump the character off a platform if there is collision
   the chracters are in ./public/assets/images/obstacle/, where there are 7 obstacle images
8. Prepare for deployment on web and mobile platforms.

This documentation will be updated as development progresses and new features are implemented.

Feedback - must be implemented first
the platforms moove to quickly, reduce speed 200%
the platforms must continue to descend indefinitely until the game ends
the platforms should stay closer together, with margins right and left at 20% of the screen
the chracter needs to be 100 px wide
the chracter is broken, it disappears when the player first tries to move it
the splash screen is too short, the background only clears the text, it needs to extend the whole vertical space of the screen