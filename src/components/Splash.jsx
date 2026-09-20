import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import config from '../config';
import RansomText from './RansomText';
import Tape from './Tape';
import Decor from './Decor';
import { playQuack } from '../utils/audio';
import './Splash.css';

export default function Splash({ onPlay }) {
  const banterLine = useMemo(() => {
    const lines = config.banter.start;
    return lines[Math.floor(Math.random() * lines.length)];
  }, []);

  const ducks = config.elements.ducks;

  const handleStart = () => {
    playQuack();
    onPlay();
  };

  return (
    <div className="splash">
      {/* Decorative Interactive Background Ducks */}
      <Decor stageIndex={0} screen="splash" />

      {/* Large Hero Birthday Logo */}
      <motion.div
        className="splash-logo-wrap"
        initial={{ scale: 0.8, opacity: 0, rotate: -4 }}
        animate={{ scale: 1, opacity: 1, rotate: -1.5 }}
        whileHover={{ scale: 1.04, rotate: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 18 }}
        onClick={playQuack}
        title="Quack!"
      >
        <Tape color="yellow" angle={-5} width={110} className="splash-logo-tape" />
        <img
          src={config.logo}
          alt={`${config.homeName || 'Vanshi'}'s Birthday`}
          className="splash-logo"
          draggable="false"
        />
      </motion.div>

      {/* Title - Structured in 2 clean lines so words never break */}
      <motion.div
        className="splash-title-container"
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <div className="title-row-primary">
          <RansomText text={`${(config.homeName || 'Vanshi').toUpperCase()}'S`} seed={101} size="hero" />
        </div>
        <div className="title-row-secondary">
          <RansomText text="BIRTHDAY WORDLE" seed={202} size="large" />
        </div>
      </motion.div>

      {/* Banter Line - Clean, no ugly dashed box! */}
      <motion.div
        className="splash-banter-wrap"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <p className="splash-banter-text">{banterLine}</p>
      </motion.div>

      {/* Cute Butter Yellow Pill Button (NO emojis, crisp typography) */}
      <motion.button
        className="splash-play-btn"
        onClick={handleStart}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.45, type: 'spring', stiffness: 350, damping: 20 }}
        aria-label="Start game"
        id="play-button"
      >
        <span className="play-btn-text">PLAY GAME</span>
      </motion.button>

      {/* Playful footer annotation */}
      <div className="splash-footer-note">
        <span className="footer-quack" onClick={playQuack}>*quack* (tap any duck to quack)</span>
      </div>
    </div>
  );
}
