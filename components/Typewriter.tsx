import React, { useState, useEffect, useRef } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export const Typewriter: React.FC<TypewriterProps> = ({ text, speed = 15, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const indexRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setDisplayedText('');
    indexRef.current = 0;
    
    // Clear any existing timer
    if (timerRef.current) clearInterval(timerRef.current);

    const intervalId = window.setInterval(() => {
      if (indexRef.current < text.length) {
        // Add logic to type slightly faster for punctuation to simulate rhythm
        setDisplayedText((prev) => prev + text.charAt(indexRef.current));
        indexRef.current++;
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
        if (onComplete) onComplete();
      }
    }, speed);

    timerRef.current = intervalId;

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [text, speed, onComplete]);

  return (
    <span className="whitespace-pre-wrap font-bold leading-relaxed break-words">
      {displayedText}
    </span>
  );
};