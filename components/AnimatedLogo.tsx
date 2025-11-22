import React, { useState, useEffect, useMemo } from 'react';

type AnimationPhase =
  | 'typing'      // Typing current text
  | 'displaying'  // Holding full text
  | 'deleting'    // Deleting text
  | 'waiting';    // Blinking cursor before next text

export const AnimatedLogo: React.FC = () => {
  // Define text variables (leave empty to skip)
  const FIRST_TEXT = 'GUGUGAGA';
  const SECOND_TEXT = 'MYGO !!!';
  const THIRD_TEXT = '';
  const FOURTH_TEXT = '';
  const FIFTH_TEXT = '';

  // Combine into a sequence for the animation loop
  // Filters out any empty strings so they are skipped in the animation
  const textSequence = useMemo(() => {
    return [
      FIRST_TEXT,
      SECOND_TEXT,
      THIRD_TEXT,
      FOURTH_TEXT,
      FIFTH_TEXT
    ].filter(text => text.trim().length > 0);
  }, []);

  const [displayText, setDisplayText] = useState('');
  const [phase, setPhase] = useState<AnimationPhase>('typing');
  const [textIndex, setTextIndex] = useState(0);

  const TYPING_SPEED = 150; // Typing speed (ms)
  const DELETE_SPEED = 100; // Delete speed (ms)
  const DISPLAY_DURATION = 3000; // Time to show full text (ms)
  const CURSOR_WAIT_DURATION = 1000; // Time to blink before typing next

  useEffect(() => {
    if (textSequence.length === 0) return;

    let timeout: ReturnType<typeof setTimeout>;
    // Use modulo to ensure index is always valid even if sequence length changes
    const currentIndex = textIndex % textSequence.length;
    const currentTargetText = textSequence[currentIndex];

    switch (phase) {
      case 'typing':
        // Type characters from left to right
        if (displayText.length < currentTargetText.length) {
          timeout = setTimeout(() => {
            setDisplayText(currentTargetText.slice(0, displayText.length + 1));
          }, TYPING_SPEED);
        } else {
          // Typing complete, enter display phase
          setPhase('displaying');
        }
        break;

      case 'displaying':
        // Display full text for set duration then start deleting
        timeout = setTimeout(() => {
          setPhase('deleting');
        }, DISPLAY_DURATION);
        break;

      case 'deleting':
        // Delete characters from right to left
        if (displayText.length > 0) {
          timeout = setTimeout(() => {
            setDisplayText(prev => prev.slice(0, -1));
          }, DELETE_SPEED);
        } else {
          // Deletion complete, enter waiting phase
          setPhase('waiting');
        }
        break;

      case 'waiting':
        // Show blinking cursor then move to next text index
        timeout = setTimeout(() => {
          setTextIndex((prevIndex) => (prevIndex + 1) % textSequence.length);
          setPhase('typing');
        }, CURSOR_WAIT_DURATION);
        break;
    }

    return () => clearTimeout(timeout);
  }, [phase, displayText, textIndex, textSequence]);

  // Don't render anything if no texts are configured
  if (textSequence.length === 0) {
    return null;
  }

  return (
    <h1 className="font-display font-bold text-5xl md:text-6xl text-slate-800 dark:text-white tracking-wide mb-2 drop-shadow-sm transition-colors duration-500">
      {displayText}
      <span className="animate-cursor-blink">_</span>
    </h1>
  );
};