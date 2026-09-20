import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import config from '../config';
import RansomText from './RansomText';
import Polaroid from './Polaroid';
import Tape from './Tape';
import './Finale.css';

const CONFETTI_COLORS = ['#FFD93B', '#3B6FB6', '#A9D6F5', '#C9CED6', '#FFFFFF', '#14213D'];

/**
 * Finale screen:
 * - "HAPPY BDAYY CINDI" ransom-note banner with letters landing one at a time
 * - Confetti burst
 * - Duck parade walking along the bottom
 * - Sticker3 in taped polaroid
 * - "OPEN YOUR CARD" button
 * - Small "replay" button
 */
export default function Finale({ onOpenCard, onReplay }) {
  // Big confetti burst
  useEffect(() => {
    const end = Date.now() + 3000;
    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60 + Math.random() * 60,
        spread: 70,
        origin: { x: Math.random(), y: 0.5 },
        colors: CONFETTI_COLORS,
        shapes: ['square'],
        scalar: 1,
        ticks: 150,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  const sticker3 = config.stages[2]?.sticker;

  return (
    <div className="finale">
      {/* Ransom-note banner with bounce-in letters */}
      <motion.div
        className="finale-banner"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <RansomText text={config.finaleText} seed={777} size="large" />
      </motion.div>

      {/* Sticker3 in polaroid */}
      {sticker3 && (
        <motion.div
          className="finale-polaroid"
          initial={{ scale: 0.3, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 3 }}
          transition={{ type: 'spring', stiffness: 180, damping: 12, delay: 0.8 }}
        >
          <Polaroid
            src={sticker3}
            alt="Final sticker"
            tilt={3}
          />
        </motion.div>
      )}

      {/* Buttons */}
      <div className="finale-actions">
        <motion.button
          className="finale-card-btn-pill"
          onClick={onOpenCard}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.5, type: 'spring' }}
          type="button"
          id="open-card-button"
        >
          <span className="card-pill-text">OPEN YOUR CARD</span>
        </motion.button>

        <motion.button
          className="finale-replay-btn"
          onClick={onReplay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 2 }}
          whileHover={{ opacity: 1 }}
          type="button"
        >
          replay?
        </motion.button>
      </div>
    </div>
  );
}
