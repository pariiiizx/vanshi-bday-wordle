import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import config from '../config';
import { playQuack } from '../utils/audio';
import './Decor.css';

/**
 * Interactive Duck Decor with MORE DUCKS in the background!
 * - Clean transparent PNG duck cutouts with soft sticker borders
 * - Placed generously across the margins and edges
 * - Interactive: clicking any duck wobbles it, plays quack sound, and pops a cute quote!
 */

const QUACK_LINES = [
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

// Rich set of duck positions around the scrapbook borders
const DUCK_POSITIONS = [
  { id: 'duck-tl', top: '10px', left: '-22px', size: 66, tilt: -12, srcIdx: 0 },
  { id: 'duck-tr', top: '16px', right: '-20px', size: 64, tilt: 14, srcIdx: 1 },
  { id: 'duck-ml', top: '34%', left: '-26px', size: 62, tilt: 8, srcIdx: 2 },
  { id: 'duck-mr', top: '48%', right: '-24px', size: 68, tilt: -10, srcIdx: 3 },
  { id: 'duck-bl', bottom: '60px', left: '-22px', size: 64, tilt: -8, srcIdx: 4 },
  { id: 'duck-br', bottom: '45px', right: '-22px', size: 66, tilt: 12, srcIdx: 5 },
  // Extra cute ducks for lively pages
  { id: 'duck-topmid', top: '-18px', left: '25%', size: 54, tilt: 6, srcIdx: 1 },
  { id: 'duck-botmid', bottom: '-16px', right: '28%', size: 56, tilt: -6, srcIdx: 4 },
];

export default function Decor({ stageIndex = 0, screen = 'playing' }) {
  const [activeBubble, setActiveBubble] = useState(null);

  const ducks = config.elements.ducks;
  if (!ducks || ducks.length === 0) return null;

  const handleDuckClick = (id, e) => {
    e.stopPropagation();
    playQuack();
    const randomLine = QUACK_LINES[Math.floor(Math.random() * QUACK_LINES.length)];
    setActiveBubble({ id, text: randomLine });
    setTimeout(() => {
      setActiveBubble((prev) => (prev?.id === id ? null : prev));
    }, 1800);
  };

  // Use 6-7 ducks on Splash and Game screen for high visual charm
  const count = screen === 'splash' ? 6 : 7;
  const activeDecorList = DUCK_POSITIONS.slice(0, count).map((cfg, i) => {
    const duckSrc = ducks[(i + stageIndex) % ducks.length];
    return {
      ...cfg,
      src: duckSrc,
    };
  });

  return (
    <div className="decor-layer" aria-hidden="true">
      {activeDecorList.map((item) => {
        const isBubbleActive = activeBubble?.id === item.id;
        const posStyle = {};
        if (item.top) posStyle.top = item.top;
        if (item.bottom) posStyle.bottom = item.bottom;
        if (item.left) posStyle.left = item.left;
        if (item.right) posStyle.right = item.right;

        return (
          <motion.div
            key={item.id}
            className="interactive-decor-duck"
            style={{
              ...posStyle,
              width: item.size,
              height: item.size,
            }}
            initial={{ scale: 0, rotate: item.tilt }}
            animate={{
              scale: 1,
              rotate: item.tilt,
              y: [0, -4, 0, 4, 0],
            }}
            whileHover={{ scale: 1.18, rotate: item.tilt * 1.4 }}
            whileTap={{ scale: 0.88, rotate: 0 }}
            transition={{
              y: {
                duration: 3.5 + (item.srcIdx % 3),
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }}
            onClick={(e) => handleDuckClick(item.id, e)}
            title="Tap to quack!"
          >
            <img
              src={item.src}
              alt=""
              className="decor-duck-img"
              draggable="false"
            />

            {/* Click Speech Bubble */}
            <AnimatePresence>
              {isBubbleActive && (
                <motion.div
                  className="duck-click-bubble"
                  initial={{ opacity: 0, scale: 0.5, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: -8 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                >
                  {activeBubble.text}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
