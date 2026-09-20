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

function BackspaceIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="backspace-icon"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41l3.59 3.59 1.41-1.41L15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"
      />
    </svg>
  );
}

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
            const isBack = key === 'BACK';
            const isEnter = key === 'ENTER';
            const isWide = isEnter || isBack;

            return (
              <motion.button
                key={key}
                className={`key ${isWide ? 'key-wide' : ''} ${isBack ? 'key-back' : ''} ${status ? `key-${status}` : ''}`}
                onClick={() => handleClick(key)}
                whileTap={{ scale: 0.92 }}
                aria-label={isBack ? 'Backspace' : key}
                id={`key-${key.toLowerCase()}`}
                type="button"
              >
                {isBack ? <BackspaceIcon /> : key}
              </motion.button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
