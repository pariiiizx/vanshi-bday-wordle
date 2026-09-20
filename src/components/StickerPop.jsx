import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { playQuack } from '../utils/audio';
import './StickerPop.css';

/**
 * Overlay that appears after winning a stage.
 * Dimmed board, polaroid with sticker pops in, confetti burst, win banner, and cute pill NEXT WORD button.
 */

const CONFETTI_COLORS = ['#FFF176', '#C5E0F0', '#FFD54F', '#7FAEC5', '#FFFFFF', '#1C3144', '#FF8A50'];

export default function StickerPop({
  sticker,
  winBanner,
  onNext,
  isLastStage = false,
  stageIndex = 0,
}) {
  // Confetti burst on mount
  useEffect(() => {
    playQuack();
    const end = Date.now() + 1500;
    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 60,
        origin: { x: 0.1, y: 0.7 },
        colors: CONFETTI_COLORS,
        shapes: ['square'],
        scalar: 0.9,
        ticks: 120,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 60,
        origin: { x: 0.9, y: 0.7 },
        colors: CONFETTI_COLORS,
        shapes: ['square'],
        scalar: 0.9,
        ticks: 120,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  const handleNext = () => {
    playQuack();
    onNext();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="sticker-pop-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="sticker-pop-content"
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.2 }}
        >
          <motion.div
            className="sticker-display-wrap"
            whileHover={{ scale: 1.06, rotate: 1 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          >
            <img
              src={sticker}
              alt="Stage sticker reward"
              className="transparent-sticker-img"
              draggable="false"
            />
          </motion.div>

          <motion.p
            className="sticker-pop-banner"
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {winBanner}
          </motion.p>

          {/* Cute Butter Yellow Pill Button */}
          <motion.button
            className="sticker-pop-next-pill"
            onClick={handleNext}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            type="button"
            id="next-word-button"
          >
            <span className="next-pill-text">
              {isLastStage
                ? 'SEE FINALE'
                : stageIndex === 1
                ? 'VIDEO BREAK'
                : 'NEXT WORD'}
            </span>
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
