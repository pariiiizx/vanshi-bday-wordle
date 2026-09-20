import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import config from '../config';
import pssVideo from '../assets/pss.mp4';
import { playQuack } from '../utils/audio';
import './VideoBreak.css';

/**
 * Fun Video Break after Wordle #2 (BDAYY)
 * Plays pss.mp4 at full volume
 * Once done (or paused), offers "REWATCH" or "CONTINUE"
 * Surrounded by cute ducks around the video frame!
 */
export default function VideoBreak({ onContinue }) {
  const videoRef = useRef(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const ducks = config.elements.ducks || [];

  // Attempt unmuted full volume autoplay on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = 1.0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // Autoplay with sound might be blocked by browser policy until interaction
            setIsPlaying(false);
          });
      }
    }
  }, []);

  const handleEnded = () => {
    setVideoEnded(true);
    setIsPlaying(false);
  };

  const handleRewatch = () => {
    playQuack();
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.volume = 1.0;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      setVideoEnded(false);
    }
  };

  const handleTapToPlay = (e) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.volume = 1.0;
      if (videoRef.current.paused) {
        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.log('Play error:', err));
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleContinue = () => {
    playQuack();
    onContinue();
  };

  return (
    <div className="video-break-screen">
      {/* Header text */}
      <motion.div
        className="video-break-header"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="video-break-title">
          You must be tired already,
        </h2>
        <p className="video-break-subtitle">
          here's a psss psss pssss break
        </p>
      </motion.div>

      {/* Video Container Frame surrounded by cute ducks */}
      <motion.div
        className="video-frame-container"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.2 }}
      >
        {/* Cute ducks surrounding the video frame */}
        {ducks[0] && (
          <motion.img
            src={ducks[0]}
            alt=""
            className="vframe-duck duck-top-left"
            animate={{ y: [0, -4, 0], rotate: [-4, 4, -4] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            onClick={playQuack}
            title="Quack!"
          />
        )}
        {ducks[1] && (
          <motion.img
            src={ducks[1]}
            alt=""
            className="vframe-duck duck-top-right"
            animate={{ y: [0, -3, 0], rotate: [4, -4, 4] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            onClick={playQuack}
            title="Quack!"
          />
        )}
        {ducks[2] && (
          <motion.img
            src={ducks[2]}
            alt=""
            className="vframe-duck duck-bottom-left"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
            onClick={playQuack}
            title="Quack!"
          />
        )}
        {ducks[3] && (
          <motion.img
            src={ducks[3]}
            alt=""
            className="vframe-duck duck-bottom-right"
            animate={{ y: [0, -4, 0], rotate: [-2, 4, -2] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
            onClick={playQuack}
            title="Quack!"
          />
        )}

        {/* The Video Card */}
        <div className="video-card" onClick={handleTapToPlay}>
          <video
            ref={videoRef}
            className="break-video"
            playsInline
            controls
            preload="auto"
            onEnded={handleEnded}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src={pssVideo} type="video/mp4" />
            <source src="/assets/pss.mp4" type="video/mp4" />
            Your browser does not support video playback.
          </video>

          {/* Big Tap to Play Button Overlay if paused */}
          {!isPlaying && !videoEnded && (
            <div className="video-play-overlay">
              <button
                type="button"
                className="video-big-play-btn"
                onClick={handleTapToPlay}
                id="video-play-button"
              >
                <span className="big-play-icon">▶</span>
                <span className="big-play-text">TAP TO PLAY PSSS BREAK</span>
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Action Buttons: Rewatch or Continue */}
      <motion.div
        className="video-break-actions"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <button
          type="button"
          className="vbreak-btn-pill vbreak-btn-rewatch"
          onClick={handleRewatch}
        >
          REWATCH
        </button>

        <button
          type="button"
          className="vbreak-btn-pill vbreak-btn-continue"
          onClick={handleContinue}
          id="continue-after-video-button"
        >
          CONTINUE TO WORD 3
        </button>
      </motion.div>

      {/* Playful hint text */}
      <p className="video-break-hint">
        {videoEnded ? "Ready for the final word? Let's go!" : "Click to play/pause with sound"}
      </p>
    </div>
  );
}
