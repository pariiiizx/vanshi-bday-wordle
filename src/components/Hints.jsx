import React from 'react';
import { motion } from 'framer-motion';
import config from '../config';
import { playQuack } from '../utils/audio';
import './Hints.css';

/**
 * HintButton: Cute pill-shaped pastel button with 3D press effect.
 * NO emojis in the button, clean Fredoka typography.
 */
export function HintButton({
  totalHints,
  hintsRevealed,
  onReveal,
  wobble = false,
  nudgeText = '',
}) {
  if (totalHints === 0) return null;

  const allRevealed = hintsRevealed >= totalHints;

  const handleClick = () => {
    if (!allRevealed) {
      playQuack();
      onReveal();
    }
  };

  return (
    <div className="hint-btn-area">
      <motion.button
        className={`hint-btn-pill ${allRevealed ? 'hint-btn-pill-disabled' : 'hint-btn-pill-active'}`}
        onClick={handleClick}
        disabled={allRevealed}
        animate={
          wobble && !allRevealed
            ? { rotate: [0, -3, 3, -2, 2, 0], scale: [1, 1.04, 1] }
            : !allRevealed && hintsRevealed === 0
            ? { y: [0, -2, 0] }
            : {}
        }
        transition={{
          duration: wobble ? 0.6 : 2,
          repeat: wobble ? 0 : Infinity,
          ease: 'easeInOut',
        }}
        whileHover={!allRevealed ? { scale: 1.04 } : {}}
        whileTap={!allRevealed ? { scale: 0.96 } : {}}
        type="button"
        aria-label={`Reveal hint ${hintsRevealed + 1} of ${totalHints}`}
        id="hint-button"
      >
        <span className="hint-pill-text">
          {allRevealed ? 'ALL HINTS UNLOCKED' : 'NEED A HINT?'}
        </span>
        <span className="hint-pill-counter">
          {hintsRevealed}/{totalHints}
        </span>
      </motion.button>

      {nudgeText && !allRevealed && (
        <motion.span
          className="hint-nudge-text"
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {nudgeText}
        </motion.span>
      )}
    </div>
  );
}

/**
 * HintNote: An adorable Postage Stamp / Mini Postcard Clue
 * - Scalloped postage edges / pastel baby blue & butter yellow theme
 * - A cute actual duck cut-out sitting on the corner!
 * - Clean, expressive handwritten text
 */
export function HintNote({ text, index }) {
  const rotations = [-1.5, 1.2, -1];
  const rotation = rotations[index % rotations.length];
  
  // Rotating duck sticker on the clue card
  const ducks = config.elements.ducks;
  const duckImg = ducks ? ducks[(index + 1) % ducks.length] : null;

  return (
    <motion.div
      className="hint-postcard"
      style={{ transform: `rotate(${rotation}deg)` }}
      initial={{ scale: 0.8, opacity: 0, y: -8 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 350, damping: 20 }}
    >
      {/* Decorative corner duck sticker */}
      {duckImg && (
        <img
          src={duckImg}
          alt=""
          className="hint-card-duck"
          draggable="false"
          aria-hidden="true"
        />
      )}

      {/* Header tab */}
      <div className="hint-stamp-header">
        <span className="hint-stamp-tag">CLUE #{index + 1}</span>
      </div>

      {/* Clue text */}
      <p className="hint-postcard-text">"{text}"</p>
    </motion.div>
  );
}
