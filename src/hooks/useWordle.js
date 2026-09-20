import { useState, useCallback, useEffect } from 'react';

/**
 * NYT Wordle logic hook.
 * Two-pass evaluation for duplicate letters.
 * No dictionary validation — accepts any 5 A-Z letters.
 */
export default function useWordle(answer) {
  const [guesses, setGuesses] = useState([]); // array of { word, result }
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameWon, setGameWon] = useState(false);
  const [gameLost, setGameLost] = useState(false);
  const [shakeRow, setShakeRow] = useState(false);
  const [revealingRow, setRevealingRow] = useState(-1);
  const [bounceRow, setBounceRow] = useState(-1);
  const [toastMessage, setToastMessage] = useState('');
  const [lastEvent, setLastEvent] = useState(null); // 'win', 'wrong', 'notEnough', 'reset'

  const MAX_GUESSES = 6;
  const WORD_LENGTH = 5;

  // Two-pass evaluation (exactly like NYT)
  const evaluate = useCallback((guess, ans) => {
    const result = Array(WORD_LENGTH).fill('absent');
    const ansArr = ans.split('');
    const guessArr = guess.split('');
    const remaining = [...ansArr];

    // Pass 1: exact matches
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (guessArr[i] === ansArr[i]) {
        result[i] = 'correct';
        remaining[i] = null;
      }
    }

    // Pass 2: present (only up to remaining count)
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (result[i] === 'correct') continue;
      const idx = remaining.indexOf(guessArr[i]);
      if (idx !== -1) {
        result[i] = 'present';
        remaining[idx] = null;
      }
    }

    return result;
  }, []);

  // Keyboard state: best known status per letter
  const keyboardState = guesses.reduce((acc, { word, result }) => {
    word.split('').forEach((letter, i) => {
      const status = result[i];
      const current = acc[letter];
      if (!current ||
        (status === 'correct') ||
        (status === 'present' && current !== 'correct')) {
        acc[letter] = status;
      }
    });
    return acc;
  }, {});

  const clearToast = useCallback(() => {
    setTimeout(() => setToastMessage(''), 2000);
  }, []);

  const submitGuess = useCallback(() => {
    if (gameWon || gameLost) return;

    if (currentGuess.length < WORD_LENGTH) {
      setShakeRow(true);
      setLastEvent('notEnough');
      setTimeout(() => setShakeRow(false), 600);
      return;
    }

    const upperGuess = currentGuess.toUpperCase();
    const result = evaluate(upperGuess, answer.toUpperCase());
    const newGuess = { word: upperGuess, result };
    const newGuesses = [...guesses, newGuess];

    setRevealingRow(guesses.length);
    setGuesses(newGuesses);
    setCurrentGuess('');

    // Check win after reveal animation
    const isWin = result.every((s) => s === 'correct');
    const revealDelay = WORD_LENGTH * 300 + 200;

    setTimeout(() => {
      setRevealingRow(-1);
      if (isWin) {
        setBounceRow(newGuesses.length - 1);
        setGameWon(true);
        setLastEvent('win');
        setTimeout(() => setBounceRow(-1), 1000);
      } else if (newGuesses.length >= MAX_GUESSES) {
        setGameLost(true);
        setLastEvent('reset');
      } else {
        setLastEvent('wrong');
      }
    }, revealDelay);
  }, [currentGuess, guesses, answer, evaluate, gameWon, gameLost]);

  const addLetter = useCallback((letter) => {
    if (gameWon || gameLost || revealingRow >= 0) return;
    if (currentGuess.length < WORD_LENGTH) {
      setCurrentGuess((prev) => prev + letter.toUpperCase());
    }
  }, [currentGuess, gameWon, gameLost, revealingRow]);

  const removeLetter = useCallback(() => {
    if (gameWon || gameLost || revealingRow >= 0) return;
    setCurrentGuess((prev) => prev.slice(0, -1));
  }, [gameWon, gameLost, revealingRow]);

  // Physical keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === 'Enter') {
        e.preventDefault();
        submitGuess();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        removeLetter();
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        addLetter(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [submitGuess, addLetter, removeLetter]);

  const resetGame = useCallback(() => {
    setGuesses([]);
    setCurrentGuess('');
    setGameWon(false);
    setGameLost(false);
    setShakeRow(false);
    setRevealingRow(-1);
    setBounceRow(-1);
    setToastMessage('');
    setLastEvent(null);
  }, []);

  // Restore from saved state
  const restoreGuesses = useCallback((savedGuesses) => {
    if (!savedGuesses || !savedGuesses.length) return;
    const restored = savedGuesses.map((word) => ({
      word: word.toUpperCase(),
      result: evaluate(word.toUpperCase(), answer.toUpperCase()),
    }));
    setGuesses(restored);

    const lastResult = restored[restored.length - 1].result;
    if (lastResult.every((s) => s === 'correct')) {
      setGameWon(true);
    }
  }, [answer, evaluate]);

  return {
    guesses,
    currentGuess,
    gameWon,
    gameLost,
    shakeRow,
    revealingRow,
    bounceRow,
    toastMessage,
    lastEvent,
    keyboardState,
    submitGuess,
    addLetter,
    removeLetter,
    resetGame,
    restoreGuesses,
    setLastEvent,
    MAX_GUESSES,
    WORD_LENGTH,
  };
}
