import React from 'react';
import { motion } from 'framer-motion';
import Tile from './Tile';
import Tape from './Tape';
import './Board.css';

/**
 * Wordle board: 6 rows × 5 tiles.
 * Sits on a white paper card, slightly tilted, with tape corners.
 */
export default function Board({
  guesses = [],
  currentGuess = '',
  revealingRow = -1,
  bounceRow = -1,
  shakeRow = false,
  maxGuesses = 6,
  wordLength = 5,
}) {
  const rows = [];

  for (let i = 0; i < maxGuesses; i++) {
    const tiles = [];

    if (i < guesses.length) {
      // Completed guess row
      const { word, result } = guesses[i];
      for (let j = 0; j < wordLength; j++) {
        tiles.push(
          <Tile
            key={j}
            letter={word[j]}
            status={result[j]}
            position={j}
            isRevealing={revealingRow === i}
            isBouncing={bounceRow === i}
          />
        );
      }
    } else if (i === guesses.length) {
      // Current input row
      for (let j = 0; j < wordLength; j++) {
        tiles.push(
          <Tile
            key={j}
            letter={currentGuess[j] || ''}
            status="tbd"
            position={j}
          />
        );
      }
    } else {
      // Empty future row
      for (let j = 0; j < wordLength; j++) {
        tiles.push(<Tile key={j} position={j} />);
      }
    }

    const isCurrentRow = i === guesses.length;

    rows.push(
      <motion.div
        key={i}
        className="board-row"
        animate={
          shakeRow && isCurrentRow
            ? { x: [0, -8, 8, -6, 6, -3, 3, 0] }
            : {}
        }
        transition={{ duration: 0.5 }}
      >
        {tiles}
      </motion.div>
    );
  }

  return (
    <div className="board-wrap">
      <Tape color="denim" angle={-4} width={70} className="board-tape board-tape-tl" />
      <Tape color="yellow" angle={6} width={65} className="board-tape board-tape-br" />
      <div
        className="board-card"
        role="grid"
        aria-label="Wordle board"
      >
        {rows}
      </div>
    </div>
  );
}
