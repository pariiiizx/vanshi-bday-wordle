import React, { useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import config from '../config';
import { playQuack } from '../utils/audio';
import './DuckBanter.css';

/**
 * A duck cut-out with a torn-paper speech bubble.
 * Shows random banter lines for different game events.
 */

export default function DuckBanter({ event, stageIndex = 0 }) {
  const counterRef = useRef(0);

  const line = useMemo(() => {
    if (!event) return null;
    const pool = config.banter[event];
    if (!pool || pool.length === 0) return null;
    counterRef.current += 1;
    return pool[Math.floor(Math.random() * pool.length)];
  }, [event]);

  const duckSrc = useMemo(() => {
    const ducks = config.elements.ducks;
    if (ducks.length === 0) return null;
    return ducks[(stageIndex + 2) % ducks.length];
  }, [stageIndex]);

  if (!line) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={counterRef.current}
        className="duck-banter"
        initial={{ opacity: 0, y: 8, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -5, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 350, damping: 20 }}
      >
        {duckSrc && (
          <motion.img
            src={duckSrc}
            alt=""
            className="banter-duck"
            draggable="false"
            aria-hidden="true"
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={playQuack}
            title="Quack!"
          />
        )}
        <div className="banter-bubble" onClick={playQuack}>
          <span className="banter-text">{line}</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
