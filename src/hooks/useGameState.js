import { useState, useCallback, useEffect } from 'react';

/**
 * Game state machine:
 * SPLASH -> STAGE_1 (HAPPY) -> POP_1 -> STAGE_2 (BDAYY) -> POP_2 -> VIDEO_BREAK (pss.mp4) -> STAGE_3 (CINDI) -> FINALE -> CARD
 * 
 * Persists to localStorage:
 * - currentStage (0-2)
 * - gamePhase (splash, playing, pop, video_break, finale)
 * - guesses per stage
 * - hints revealed per stage
 */

const STORAGE_KEY = 'cindi-bday-wordle';

export const PHASES = {
  SPLASH: 'splash',
  PLAYING: 'playing',
  POP: 'pop',
  VIDEO_BREAK: 'video_break',
  FINALE: 'finale',
};

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore
  }
  return null;
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export default function useGameState(totalStages = 3) {
  const [initialized, setInitialized] = useState(false);
  const [phase, setPhase] = useState(PHASES.SPLASH);
  const [stageIndex, setStageIndex] = useState(0);
  const [stageGuesses, setStageGuesses] = useState(
    Array.from({ length: totalStages }, () => [])
  );
  const [hintsRevealed, setHintsRevealed] = useState(
    Array.from({ length: totalStages }, () => 0)
  );
  const [wrongGuessCount, setWrongGuessCount] = useState(0);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      setPhase(saved.phase || PHASES.SPLASH);
      setStageIndex(saved.stageIndex || 0);
      if (saved.stageGuesses) setStageGuesses(saved.stageGuesses);
      if (saved.hintsRevealed) setHintsRevealed(saved.hintsRevealed);
      if (saved.wrongGuessCount) setWrongGuessCount(saved.wrongGuessCount);
    }
    setInitialized(true);
  }, []);

  // Save to localStorage on state changes
  useEffect(() => {
    if (!initialized) return;
    saveState({ phase, stageIndex, stageGuesses, hintsRevealed, wrongGuessCount });
  }, [phase, stageIndex, stageGuesses, hintsRevealed, wrongGuessCount, initialized]);

  const startGame = useCallback(() => {
    setPhase(PHASES.PLAYING);
  }, []);

  const recordGuess = useCallback((word) => {
    setStageGuesses((prev) => {
      const updated = [...prev];
      updated[stageIndex] = [...updated[stageIndex], word];
      return updated;
    });
  }, [stageIndex]);

  const incrementWrongGuesses = useCallback(() => {
    setWrongGuessCount((prev) => prev + 1);
  }, []);

  const revealHint = useCallback(() => {
    setHintsRevealed((prev) => {
      const updated = [...prev];
      updated[stageIndex] = updated[stageIndex] + 1;
      return updated;
    });
  }, [stageIndex]);

  const stageWon = useCallback(() => {
    setPhase(PHASES.POP);
  }, []);

  // Moving from POP to next stage or Video Break
  const nextStage = useCallback(() => {
    // If we just finished Stage 1 (second wordle, BDAYY), go to fun Video Break!
    if (stageIndex === 1) {
      setPhase(PHASES.VIDEO_BREAK);
      return;
    }

    const next = stageIndex + 1;
    if (next >= totalStages) {
      setPhase(PHASES.FINALE);
    } else {
      setStageIndex(next);
      setWrongGuessCount(0);
      setPhase(PHASES.PLAYING);
    }
  }, [stageIndex, totalStages]);

  // Finish video break and move to Stage 2 (third wordle, CINDI)
  const finishVideoBreak = useCallback(() => {
    setStageIndex(2);
    setWrongGuessCount(0);
    setPhase(PHASES.PLAYING);
  }, []);

  const resetAll = useCallback(() => {
    setPhase(PHASES.SPLASH);
    setStageIndex(0);
    setStageGuesses(Array.from({ length: totalStages }, () => []));
    setHintsRevealed(Array.from({ length: totalStages }, () => 0));
    setWrongGuessCount(0);
    localStorage.removeItem(STORAGE_KEY);
  }, [totalStages]);

  const resetCurrentStage = useCallback(() => {
    setStageGuesses((prev) => {
      const updated = [...prev];
      updated[stageIndex] = [];
      return updated;
    });
    setWrongGuessCount(0);
  }, [stageIndex]);

  return {
    initialized,
    phase,
    stageIndex,
    stageGuesses,
    hintsRevealed,
    wrongGuessCount,
    currentGuesses: stageGuesses[stageIndex] || [],
    currentHintsRevealed: hintsRevealed[stageIndex] || 0,
    startGame,
    recordGuess,
    incrementWrongGuesses,
    revealHint,
    stageWon,
    nextStage,
    finishVideoBreak,
    resetAll,
    resetCurrentStage,
    setPhase,
    setStageIndex,
    PHASES,
  };
}
