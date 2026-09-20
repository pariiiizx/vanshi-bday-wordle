import React from 'react';
import { motion } from 'framer-motion';
import './PondTracker.css';

/**
 * 3 paper-egg cut-outs in the header.
 * Solved stages show a hatched duckling, current egg wobbles.
 */

function EggSVG({ hatched, wobble, index }) {
  if (hatched) {
    // Hatched cute bright yellow duckling popping out of a white shell
    return (
      <svg
        viewBox="0 0 32 32"
        className="pond-icon"
        aria-label={`Stage ${index + 1} complete`}
      >
        {/* Duckling feather tuft */}
        <path
          d="M16 8 C15 5 18 5 17 8"
          stroke="#1C3144"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />
        {/* Duckling head popping out */}
        <circle cx="16" cy="13.5" r="6.5" fill="#FFD54F" stroke="#1C3144" strokeWidth="1.4" />
        {/* Cute blush */}
        <circle cx="14" cy="16" r="1.4" fill="#FF8A50" opacity="0.45" />
        {/* Eye with white sparkle */}
        <circle cx="18" cy="12.5" r="1.3" fill="#1C3144" />
        <circle cx="18.4" cy="12" r="0.45" fill="#FFFFFF" />
        {/* Beak */}
        <path
          d="M21 13.5 L25.5 14.8 L21 16 Z"
          fill="#FF8A50"
          stroke="#1C3144"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        {/* Broken shell bottom - Clean White */}
        <path
          d="M6 21 C6 17 10 14 16 14 C22 14 26 17 26 21 L26 25 C26 28 23 30 16 30 C9 30 6 28 6 25 Z"
          fill="#FFFFFF"
          stroke="#1C3144"
          strokeWidth="1.5"
        />
        {/* Zigzag crack at top of shell */}
        <path
          d="M6 21 L9 18 L12 21 L15 17 L18 21 L21 18 L24 21 L26 19"
          fill="none"
          stroke="#1C3144"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // Unhatched egg
  return (
    <motion.svg
      viewBox="0 0 28 36"
      className={`pond-icon ${wobble ? 'pond-wobble' : ''}`}
      aria-label={wobble ? `Stage ${index + 1} in progress` : `Stage ${index + 1} not started`}
      animate={wobble ? { rotate: [0, -6, 6, -4, 4, 0] } : {}}
      transition={wobble ? { duration: 1.8, repeat: Infinity, repeatDelay: 1.5 } : {}}
    >
      <ellipse
        cx="14"
        cy="20"
        rx="12"
        ry="14"
        fill="#FFFFFF"
        stroke="#1C3144"
        strokeWidth="1.6"
      />
      {/* Cute Butter Yellow & Baby Blue Speckles */}
      <circle cx="10" cy="16" r="1.3" fill="#C5E0F0" />
      <circle cx="17" cy="22" r="1.5" fill="#FFD54F" />
      <circle cx="12" cy="25" r="1.1" fill="#FFD54F" />
      <circle cx="18" cy="15" r="1" fill="#C5E0F0" />
    </motion.svg>
  );
}

export default function PondTracker({ currentStage, totalStages = 3 }) {
  return (
    <div className="pond-tracker" aria-label="Game progress">
      {Array.from({ length: totalStages }).map((_, i) => (
        <EggSVG
          key={i}
          index={i}
          hatched={i < currentStage}
          wobble={i === currentStage}
        />
      ))}
    </div>
  );
}
