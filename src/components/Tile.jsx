import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Tile.css';

/**
 * Individual Wordle tile with:
 * - Pop-in when a letter is typed
 * - Row-by-row flip reveal
 * - Bounce on winning row
 * - Color states: correct, present, absent, empty, tbd
 */
export default function Tile({
  letter = '',
  status = 'empty', // 'empty' | 'tbd' | 'correct' | 'present' | 'absent'
  position = 0,
  isRevealing = false,
  isBouncing = false,
}) {
  const hasLetter = letter !== '';
  const isEvaluated = ['correct', 'present', 'absent'].includes(status);

  const flipDelay = position * 0.3;
  const bounceDelay = position * 0.1;

  return (
    <motion.div
      className={`tile ${isEvaluated ? `tile-${status}` : ''} ${hasLetter && !isEvaluated ? 'tile-filled' : ''}`}
      initial={false}
      animate={
        isBouncing
          ? {
              y: [0, -12, 0, -6, 0],
              transition: { duration: 0.5, delay: bounceDelay },
            }
          : isRevealing
          ? {
              rotateX: [0, 90, 90, 0],
              transition: {
                duration: 0.6,
                delay: flipDelay,
                times: [0, 0.45, 0.55, 1],
              },
            }
          : {}
      }
      style={{
        // Apply color after the flip reaches 90deg
        '--reveal-delay': `${flipDelay + 0.3}s`,
      }}
      aria-label={
        letter
          ? `${letter}, ${isEvaluated ? status : 'not evaluated'}`
          : 'empty'
      }
      role="cell"
    >
      <AnimatePresence mode="popLayout">
        {hasLetter && (
          <motion.span
            key={letter + position}
            className="tile-letter"
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            {letter}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
