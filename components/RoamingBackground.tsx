import React, { useMemo } from 'react';

interface RoamingBackgroundProps {
  intensity: 'normal' | 'high';
}

export const RoamingBackground: React.FC<RoamingBackgroundProps> = ({ intensity }) => {
  const emojis = ['💢', '😤', '😡', '⁉️', '🖕', '🚫', '⛔'];
  
  // Generate random positions once
  const emojiElements = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 2}rem`, // Random size between 2rem and 4rem
      animationDelay: `${Math.random() * 2}s`,
      opacity: 0.15,
    }));
  }, []);

  const animationClass = intensity === 'high' ? 'animate-jitter-fast' : 'animate-jitter';

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {emojiElements.map((el) => (
        <div
          key={el.id}
          className={`absolute select-none ${animationClass}`}
          style={{
            left: el.left,
            top: el.top,
            fontSize: el.size,
            opacity: el.opacity,
            animationDelay: el.animationDelay,
          }}
        >
          {el.emoji}
        </div>
      ))}
    </div>
  );
};