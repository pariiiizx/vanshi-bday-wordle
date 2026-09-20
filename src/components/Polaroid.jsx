import React from 'react';
import './Polaroid.css';

export default function Polaroid({
  src,
  alt = '',
  tilt = -2,
  className = '',
  children,
}) {
  return (
    <div
      className={`polaroid ${className}`}
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <div className="polaroid-frame">
        {src ? (
          <img
            src={src}
            alt={alt}
            className="polaroid-img"
            draggable="false"
          />
        ) : (
          children
        )}
      </div>
    </div>
  );
}
