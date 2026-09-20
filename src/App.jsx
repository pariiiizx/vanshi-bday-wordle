import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import config from './config';
import useGameState from './hooks/useGameState';
import useWordle from './hooks/useWordle';
import Splash from './components/Splash';
import Header from './components/Header';
import Board from './components/Board';
import Keyboard from './components/Keyboard';
import DuckBanter from './components/DuckBanter';
import { HintButton, HintNote } from './components/Hints';
import StickerPop from './components/StickerPop';
import VideoBreak from './components/VideoBreak';
import Finale from './components/Finale';
import Decor from './components/Decor';
import GinghamDucks from './components/GinghamDucks';
import { playCelebrationSound } from './utils/audio';
import './App.css';

export default function App() {
  const gameState = useGameState(config.stages.length);
  const {
    initialized,
    phase,
    stageIndex,
    currentGuesses,
    currentHintsRevealed,
    wrongGuessCount,
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
  } = gameState;

  const currentStageConfig = config.stages[stageIndex] || config.stages[0];
  const answer = currentStageConfig.word;
  const hints = currentStageConfig.hints;

  const wordle = useWordle(answer);
  const {
    guesses,
    currentGuess,
    gameWon,
    gameLost,
    shakeRow,
    revealingRow,
    bounceRow,
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
  } = wordle;

  // Toast state
  const [toastMsg, setToastMsg] = useState('');

  // Preload sticker images so they appear instantaneously on stage win
  useEffect(() => {
    config.stages.forEach((s) => {
      if (s.sticker) {
        const img = new Image();
        img.src = s.sticker;
      }
    });
  }, []);

  // Restore guesses from localStorage on init
  useEffect(() => {
    if (initialized && phase === PHASES.PLAYING && currentGuesses.length > 0) {
      restoreGuesses(currentGuesses);
    }
  }, [initialized]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset wordle state when stage changes
  useEffect(() => {
    if (phase === PHASES.PLAYING) {
      resetGame();
      if (currentGuesses.length > 0) {
        restoreGuesses(currentGuesses);
      }
    }
  }, [stageIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  // Record guess to game state when a new guess is made
  useEffect(() => {
    if (guesses.length > 0 && guesses.length > currentGuesses.length) {
      const latestWord = guesses[guesses.length - 1].word;
      recordGuess(latestWord);
    }
  }, [guesses.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle game events
  useEffect(() => {
    if (!lastEvent) return;

    if (lastEvent === 'win') {
      playCelebrationSound();
      stageWon();
    } else if (lastEvent === 'wrong') {
      incrementWrongGuesses();
    } else if (lastEvent === 'reset') {
      // Lost after 6 guesses — show toast then reset
      setToastMsg(config.banter.reset[Math.floor(Math.random() * config.banter.reset.length)]);
      setTimeout(() => {
        setToastMsg('');
        resetGame();
        resetCurrentStage();
      }, 2500);
    } else if (lastEvent === 'notEnough') {
      setToastMsg(config.banter.notEnoughLetters[Math.floor(Math.random() * config.banter.notEnoughLetters.length)]);
      setTimeout(() => setToastMsg(''), 1800);
    }

    // Clear event
    const t = setTimeout(() => setLastEvent(null), 100);
    return () => clearTimeout(t);
  }, [lastEvent]); // eslint-disable-line react-hooks/exhaustive-deps

  // Banter event mapping
  const banterEvent = useMemo(() => {
    if (!lastEvent) return null;
    if (lastEvent === 'win') return 'win';
    if (lastEvent === 'wrong') return 'wrongGuess';
    if (lastEvent === 'notEnough') return 'notEnoughLetters';
    if (lastEvent === 'reset') return 'reset';
    return 'start';
  }, [lastEvent]);

  // Stage 2: after 3 wrong guesses, show hint nudge
  const showHintNudge = stageIndex === 1 && wrongGuessCount >= 3;

  const handleHintReveal = useCallback(() => {
    if (currentHintsRevealed < hints.length) {
      revealHint();
    }
  }, [currentHintsRevealed, hints.length, revealHint]);

  const handleNextStage = useCallback(() => {
    nextStage();
  }, [nextStage]);

  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleOpenCard = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      window.location.href = config.cardUrl;
    }, 800);
  }, []);

  const handleReplay = useCallback(() => {
    resetAll();
    resetGame();
  }, [resetAll, resetGame]);

  // Developer / Testing console helpers
  useEffect(() => {
    window.__cindiWordle = {
      resetAll,
      goToVideoBreak: () => {
        setStageIndex(1);
        setPhase(PHASES.VIDEO_BREAK);
      },
      goToStage: (idx) => {
        setStageIndex(idx);
        setPhase(PHASES.PLAYING);
      },
      goToFinale: () => {
        setPhase(PHASES.FINALE);
      },
    };
  }, [resetAll, setPhase, setStageIndex, PHASES]);

  // Wait for localStorage init
  if (!initialized) return null;

  return (
    <>
      {/* Big Cute Floating Ducks on Desktop Gingham Background */}
      <GinghamDucks />

      <div className="app-container page-container">
      <AnimatePresence mode="wait">
        {/* SPLASH */}
        {phase === PHASES.SPLASH && (
          <motion.div
            key="splash"
            className="splash-screen-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Splash onPlay={startGame} />
          </motion.div>
        )}

        {/* PLAYING */}
        {phase === PHASES.PLAYING && (
          <motion.div
            key={`playing-${stageIndex}`}
            className="game-screen"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <Header
              currentStage={stageIndex}
              totalStages={config.stages.length}
            />

            <div className="game-area">
              {/* Wordle Board */}
              <Board
                guesses={guesses}
                currentGuess={currentGuess}
                revealingRow={revealingRow}
                bounceRow={bounceRow}
                shakeRow={shakeRow}
                maxGuesses={MAX_GUESSES}
                wordLength={WORD_LENGTH}
              />

              {/* Duck banter */}
              <DuckBanter event={banterEvent} stageIndex={stageIndex} />

              {/* Revealed hints sticky notes - placed right above keyboard */}
              {hints.length > 0 && currentHintsRevealed > 0 && (
                <div className="hints-area">
                  {hints.slice(0, currentHintsRevealed).map((hint, i) => (
                    <HintNote key={i} text={hint} index={i} />
                  ))}
                </div>
              )}

              {/* Hint button - under board / above keyboard */}
              <HintButton
                totalHints={hints.length}
                hintsRevealed={currentHintsRevealed}
                onReveal={handleHintReveal}
                wobble={showHintNudge}
                nudgeText={showHintNudge ? config.banter.hintNudge : ''}
              />

              {/* QWERTY Keyboard */}
              <Keyboard
                keyboardState={keyboardState}
                onKey={addLetter}
                onEnter={submitGuess}
                onBackspace={removeLetter}
              />
            </div>
          </motion.div>
        )}

        {/* POP (sticker reveal) */}
        {phase === PHASES.POP && (
          <motion.div
            key={`pop-${stageIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <StickerPop
              sticker={currentStageConfig.sticker}
              winBanner={currentStageConfig.winBanner}
              onNext={handleNextStage}
              isLastStage={stageIndex >= config.stages.length - 1}
              stageIndex={stageIndex}
            />
          </motion.div>
        )}

        {/* VIDEO BREAK (after second wordle) */}
        {phase === PHASES.VIDEO_BREAK && (
          <motion.div
            key="video-break"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <VideoBreak onContinue={finishVideoBreak} />
          </motion.div>
        )}

        {/* FINALE */}
        {phase === PHASES.FINALE && (
          <motion.div
            key="finale"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Finale onOpenCard={handleOpenCard} onReplay={handleReplay} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast messages */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            className="toast"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>

      {/* Page transition overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="page-transition-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.75, ease: 'easeInOut' }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
