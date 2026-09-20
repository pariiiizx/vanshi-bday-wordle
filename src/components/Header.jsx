import React, { useState } from 'react';
import { motion } from 'framer-motion';
import config from '../config';
import PondTracker from './PondTracker';
import Tape from './Tape';
import { playQuack, toggleSound, isSoundEnabled } from '../utils/audio';
import './Header.css';

export default function Header({ currentStage, totalStages = 3 }) {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  const handleSoundToggle = (e) => {
    e.stopPropagation();
    const newState = toggleSound();
    setSoundOn(newState);
    if (newState) playQuack();
  };

  const handleLogoTap = () => {
    playQuack();
  };

  return (
    <header className="game-header">
      {/* Left side: Scrapbook-pinned Birthday Logo with Peeking Duck */}
      <div className="header-brand">
        <motion.div
          className="header-logo-container"
          whileHover={{ scale: 1.04, rotate: -1 }}
          whileTap={{ rotate: [0, -6, 6, -3, 3, 0] }}
          transition={{ duration: 0.4 }}
          onClick={handleLogoTap}
          title="Click to quack!"
        >
          <Tape color="yellow" angle={-4} width={45} className="header-logo-tape" />
          <img
            src={config.logo}
            alt={`${config.friendName}'s Birthday`}
            className="header-logo"
            draggable="false"
          />
        </motion.div>

        {/* Cute little peeking duck next to logo */}
        <motion.img
          src={config.elements.ducks[0]}
          alt=""
          className="header-peeking-duck"
          animate={{ y: [0, -3, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          onClick={handleLogoTap}
          title="Quack!"
          aria-hidden="true"
        />
      </div>

      {/* Right side: Sound toggle + Pond Tracker */}
      <div className="header-controls">
        <button
          className="sound-toggle-btn"
          onClick={handleSoundToggle}
          title={soundOn ? 'Mute quacks' : 'Unmute quacks'}
          aria-label={soundOn ? 'Mute sound' : 'Unmute sound'}
          type="button"
        >
          {soundOn ? '🔊' : '🔇'}
        </button>

        <PondTracker currentStage={currentStage} totalStages={totalStages} />
      </div>
    </header>
  );
}
