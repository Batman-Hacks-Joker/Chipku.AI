"use client";

import React, { useEffect, useState } from 'react';

interface FireAnimationProps {
  onComplete: () => void;
}

const FireAnimation: React.FC<FireAnimationProps> = ({ onComplete }) => {
  const [emojis, setEmojis] = useState<{ id: number; style: React.CSSProperties }[]>([]);

  useEffect(() => {
    const fireEmojis = [...Array(200)].map((_, i) => {
      const isExtraLarge = Math.random() < 0.10;
      const style: React.CSSProperties = {
        left: `${Math.random() * 100}vw`,
        fontSize: isExtraLarge 
          ? `${Math.random() * 10 + 10}rem`
          : `${Math.random() * 2 + 1}rem`,
        animationDuration: `${Math.random() * 0.4 + 0.4}s`,
        animationDelay: `${Math.random() * 0.5}s`,
      };
      return { id: i, style };
    });

    setEmojis(fireEmojis);

    const maxDuration = 0.5 + 0.5 + 0.2; // delay + duration + buffer
    const timer = setTimeout(onComplete, maxDuration * 1000);
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
            <span aria-hidden="true">🔥</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default FireAnimation;
