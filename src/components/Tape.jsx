import React from 'react';
import './Tape.css';

/**
 * Reusable washi tape strip component.
 * Semi-transparent, ragged ends, varied colors and angles.
 */
const TAPE_COLORS = {
  yellow: 'rgba(255, 217, 59, 0.55)',
  denim: 'rgba(59, 111, 182, 0.45)',
  silver: 'rgba(201, 206, 214, 0.5)',
  checkered: null, // uses background pattern
};

export default function Tape({
  color = 'yellow',
  angle = 0,
  width = 80,
  className = '',
  style = {},
}) {
  const isCheckered = color === 'checkered';
  const tapeColor = TAPE_COLORS[color] || TAPE_COLORS.yellow;

  return (
    <div
      className={`tape ${isCheckered ? 'tape-checkered' : ''} ${className}`}
      style={{
        width: `${width}px`,
        transform: `rotate(${angle}deg)`,
        backgroundColor: isCheckered ? undefined : tapeColor,
        ...style,
      }}
      aria-hidden="true"
    />
  );
}
