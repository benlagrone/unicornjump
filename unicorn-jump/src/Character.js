import React from 'react';

const SPRITES = {
  idle: `${process.env.PUBLIC_URL}/assets/images/character/unicorn_idle.png`,
  jump: `${process.env.PUBLIC_URL}/assets/images/character/unicorn_jump.png`,
  fall: `${process.env.PUBLIC_URL}/assets/images/character/unicorn_fall.png`,
  left: `${process.env.PUBLIC_URL}/assets/images/character/unicorn-side_l.png`,
  right: `${process.env.PUBLIC_URL}/assets/images/character/unicorn_side_r.png`,
};

const Character = ({ position, width, height }) => {
  const sprite =
    position.animation === 'run'
      ? position.facing === 'left'
        ? SPRITES.left
        : SPRITES.right
      : SPRITES[position.animation] || SPRITES.idle;

  return (
    <div
      aria-label="player"
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width,
        height,
        backgroundImage: `url(${sprite})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center bottom',
        zIndex: 10,
        pointerEvents: 'none',
        filter: 'drop-shadow(0 16px 18px rgba(15, 23, 42, 0.16))',
      }}
    />
  );
};

export default Character;
