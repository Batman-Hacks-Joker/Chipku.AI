
"use client";

import React, { useEffect, useState } from 'react';

const FireAnimation = ({ onComplete }: { onComplete: () => void }) => {
  const [emojis, setEmojis] = useState<{ id: number; style: React.CSSProperties }[]>([]);

  useEffect(() => {
    const fireEmojis = Array.from({ length: 200 }).map((_, i) => {
      const isExtraLarge = Math.random() < 0.1; // 10% chance for a huge emoji
      const style: React.CSSProperties = {
        left: `${Math.random() * 100}vw`,
        fontSize: isExtraLarge 
          ? `${Math.random() * 10 + 10}rem` // 10rem to 20rem
          : `${Math.random() * 2 + 1}rem`,    // 1rem to 3rem
        animationDuration: `${Math.random() * 0.4 + 0.4}s`,
        animationDelay: `${Math.random() * 0.5}s`,
      };
      return { id: i, style };
    });
    setEmojis(fireEmojis);

    const timer = setTimeout(onComplete, 3000); // Animation completes in ~3s
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <>
      <style jsx>{`
        @keyframes rise {
          from {
            transform: translateY(0) scale(0.8);
            opacity: 1;
          }
          to {
            transform: translateY(-110vh) scale(1.2);
            opacity: 0;
          }
        }
        .fire-emoji-container {
            position: fixed;
            top: 100vh;
            will-change: transform, opacity;
            animation-name: rise;
            animation-timing-function: linear;
            animation-fill-mode: forwards;
        }
      `}</style>
      <div className="fixed inset-0 w-full h-full z-[100] pointer-events-none overflow-hidden">
        {emojis.map(({ id, style }) => (
          <div key={id} className="fire-emoji-container" style={style}>
            <span>
                🔥
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

export default FireAnimation;
