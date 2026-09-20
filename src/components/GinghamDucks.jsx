import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import config from '../config';
import { playQuack } from '../utils/audio';
import './GinghamDucks.css';

const DUCK_QUOTES = config.duckQuotes || [
  'Quack Quack',
  'Don’t You Sleep',
  'Uncle Status: Unlocked',
  'Such An Oldie',
  'One Braincell Left',
  'Stop Being Mean',
  'Big Bitch Energy',
  'Do You Have Heart?',
  'Only 5% Nice',
  'Happiest Birthdayyy!',
  'UR SO OLD NOW',
  'Cone-Faced Baddie',
  'The Best Duck',
];

const GINGHAM_DUCKS = [
  // Left margin ducks
  {
    id: 'gduck-tl',
    side: 'left',
    top: '7%',
    left: '3vw',
    size: 135,
    tilt: -10,
    duckIdx: 0,
    floatDuration: 4.2,
  },
  {
    id: 'gduck-ml',
    side: 'left',
    top: '42%',
    left: '2vw',
    size: 150,
    tilt: 8,
    duckIdx: 2,
    floatDuration: 5.0,
  },
  {
    id: 'gduck-bl',
    side: 'left',
    bottom: '9%',
    left: '4vw',
    size: 130,
    tilt: -7,
    duckIdx: 4,
    floatDuration: 4.5,
  },
  // Right margin ducks
  {
    id: 'gduck-tr',
    side: 'right',
    top: '8%',
    right: '3.5vw',
    size: 140,
    tilt: 9,
    duckIdx: 1,
    floatDuration: 4.8,
  },
  {
    id: 'gduck-mr',
    side: 'right',
    top: '45%',
    right: '1.8vw',
    size: 155,
    tilt: -9,
    duckIdx: 3,
    floatDuration: 5.2,
  },
  {
    id: 'gduck-br',
    side: 'right',
    bottom: '8%',
    right: '3.8vw',
    size: 135,
    tilt: 11,
    duckIdx: 5,
    floatDuration: 4.3,
  },
];

export default function GinghamDucks() {
  const [activeBubble, setActiveBubble] = useState(null);
  const ducks = config.elements.ducks || [];

  if (!ducks.length) return null;

  const handleClick = (id, e) => {
    e.stopPropagation();
    playQuack();
    const randomQuote = DUCK_QUOTES[Math.floor(Math.random() * DUCK_QUOTES.length)];
    setActiveBubble({ id, text: randomQuote });
    setTimeout(() => {
      setActiveBubble((prev) => (prev?.id === id ? null : prev));
    }, 2200);
  };

  return (
    <aside className="gingham-ducks-container" aria-hidden="true">
      {GINGHAM_DUCKS.map((duckCfg) => {
        const duckSrc = ducks[duckCfg.duckIdx % ducks.length];
        const isBubble = activeBubble?.id === duckCfg.id;

        const pos = {};
        if (duckCfg.top) pos.top = duckCfg.top;
        if (duckCfg.bottom) pos.bottom = duckCfg.bottom;
        if (duckCfg.left) pos.left = duckCfg.left;
        if (duckCfg.right) pos.right = duckCfg.right;

        return (
          <motion.div
            key={duckCfg.id}
            className={`gingham-duck-wrapper gduck-${duckCfg.side}`}
            style={{
              ...pos,
              width: duckCfg.size,
              height: duckCfg.size,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              y: [0, -12, 0, 10, 0],
              rotate: [duckCfg.tilt, duckCfg.tilt + 4, duckCfg.tilt, duckCfg.tilt - 4, duckCfg.tilt],
            }}
            transition={{
              scale: { duration: 0.5, delay: 0.1 },
              opacity: { duration: 0.5 },
              y: {
                duration: duckCfg.floatDuration,
                repeat: Infinity,
                ease: 'easeInOut',
              },
              rotate: {
                duration: duckCfg.floatDuration * 1.2,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }}
            whileHover={{ scale: 1.15, rotate: duckCfg.tilt * 1.3 }}
            whileTap={{ scale: 0.92 }}
            onClick={(e) => handleClick(duckCfg.id, e)}
            title="Quack! Click me!"
          >
            <img
              src={duckSrc}
              alt=""
              className="gingham-duck-image"
              draggable="false"
            />

            {/* Speech Bubble */}
            <AnimatePresence>
              {isBubble && (
                <motion.div
                  className={`gingham-duck-bubble bubble-${duckCfg.side}`}
                  initial={{ opacity: 0, scale: 0.5, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  {activeBubble.text}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </aside>
  );
}
