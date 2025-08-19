
"use client";

import React, { useEffect, useState } from 'react';

const FireAnimation = ({ onComplete }: { onComplete: () => void }) => {
  const [emojis, setEmojis] = useState<{ id: number; style: React.CSSProperties }[]>([]);

  useEffect(() => {
    const fireEmojis = Array.from({ length: 50 }).map((_, i) => {
      const style: React.CSSProperties = {
        left: `${Math.random() * 100}vw`,
        fontSize: `${Math.random() * 3 + 1}rem`,
        animationDuration: `${Math.random() * 2 + 3}s`,
        animationDelay: `${Math.random() * 3}s`,
      };
      return { id: i, style };
    });
    setEmojis(fireEmojis);

    const timer = setTimeout(onComplete, 5000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <>
      <style jsx>{`
        @keyframes rise {
          from {
            transform: translateY(100vh) rotate(0deg);
            opacity: 1;
          }
          to {
            transform: translateY(-10vh) rotate(360deg);
            opacity: 0;
          }
        }
        .fire-emoji {
          position: fixed;
          bottom: -10vh;
          will-change: transform, opacity;
          animation-name: rise;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
      `}</style>
      <div className="fixed inset-0 w-full h-full z-[100] pointer-events-none overflow-hidden">
        {emojis.map(({ id, style }) => (
          <span key={id} className="fire-emoji" style={style}>
            🔥
          </span>
        ))}
      </div>
    </>
  );
};

export default FireAnimation;
