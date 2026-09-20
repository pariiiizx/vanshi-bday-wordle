import React from 'react';
import { motion } from 'framer-motion';
import './Keyboard.css';

/**
 * On-screen QWERTY keyboard.
 * Keys show the best known state (correct > present > absent).
 */

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK'],
];

export default function Keyboard({ keyboardState = {}, onKey, onEnter, onBackspace }) {
  const handleClick = (key) => {
    if (key === 'ENTER') {
      onEnter();
    } else if (key === 'BACK') {
      onBackspace();
    } else {
      onKey(key);
    }
  };

  return (
    <div className="keyboard" role="group" aria-label="Keyboard">
      {ROWS.map((row, ri) => (
        <div key={ri} className="keyboard-row">
          {row.map((key) => {
            const status = keyboardState[key] || '';
            const isWide = key === 'ENTER' || key === 'BACK';
            const displayText = key === 'BACK' ? '⌫' : key;

            return (
              <motion.button
                key={key}
                className={`key ${isWide ? 'key-wide' : ''} ${status ? `key-${status}` : ''}`}
                onClick={() => handleClick(key)}
                whileTap={{ scale: 0.92 }}
                aria-label={key === 'BACK' ? 'Backspace' : key}
                id={`key-${key.toLowerCase()}`}
                type="button"
              >
                {displayText}
              </motion.button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
