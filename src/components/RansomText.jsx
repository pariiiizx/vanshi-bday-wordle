import React, { useMemo } from 'react';
import './RansomText.css';

/**
 * Each letter is its own cut-out tile with:
 * - Deterministic seeded rotation (-6 to 6 degrees)
 * - Varied vibrant paper colors and distinct font faces
 * - Slightly jagged clip-path edges
 * - Words are grouped into unbreakable units so words NEVER break in the middle!
 */

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const FONTS = [
  "'Fredoka', sans-serif",
  "'Playfair Display', serif",
  "'Roboto Slab', serif",
  "'Space Mono', monospace",
  "'Permanent Marker', cursive",
  "'Caveat Brush', cursive",
  "'Poppins', sans-serif",
];

const BG_COLORS = [
  '#023047', // navy
  '#D63031', // ransom red
  '#FFB703', // duck gold
  '#219EBC', // pond blue
  '#FB8500', // duck orange
  '#27AE60', // green
  '#6C5CE7', // purple
  '#1E293B', // dark slate
  '#FFD23F', // sunny yellow
];

const CLIP_PATHS = [
  'polygon(2% 4%, 96% 1%, 99% 95%, 3% 98%)',
  'polygon(1% 2%, 98% 3%, 97% 97%, 4% 96%)',
  'polygon(3% 1%, 97% 4%, 96% 98%, 2% 95%)',
  'polygon(0% 3%, 99% 0%, 98% 96%, 1% 99%)',
  'polygon(2% 0%, 95% 3%, 99% 97%, 4% 95%)',
];

export default function RansomText({ text, seed = 42, className = '', size = 'large' }) {
  const words = useMemo(() => {
    const rand = seededRandom(seed);
    const rawWords = text.split(' ');

    return rawWords.map((word) => {
      const letters = word.split('').map((char) => {
        const rotation = (rand() * 12 - 6); // -6 to 6 degrees
        const bgIdx = Math.floor(rand() * BG_COLORS.length);
        const fontIdx = Math.floor(rand() * FONTS.length);
        const clipIdx = Math.floor(rand() * CLIP_PATHS.length);
        const bg = BG_COLORS[bgIdx];
        const isDark = bg === '#023047' || bg === '#D63031' || bg === '#1E293B' || bg === '#6C5CE7' || bg === '#219EBC';

        return {
          char,
          style: {
            transform: `rotate(${rotation.toFixed(1)}deg)`,
            backgroundColor: bg,
            color: isDark ? '#FFFDF4' : '#023047',
            fontFamily: FONTS[fontIdx],
            clipPath: CLIP_PATHS[clipIdx],
          },
        };
      });

      return letters;
    });
  }, [text, seed]);

  return (
    <span className={`ransom-text ransom-${size} ${className}`} aria-label={text}>
      {words.map((letters, wIdx) => (
        <span key={wIdx} className="ransom-word">
          {letters.map((letter, lIdx) => (
            <span
              key={lIdx}
              className="ransom-letter"
              style={letter.style}
              aria-hidden="true"
            >
              {letter.char}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}
