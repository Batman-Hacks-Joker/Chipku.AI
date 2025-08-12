"use client";

import React, { useState, useEffect, useRef } from 'react';

const EMOJIS = ["😊", "🥴", "💋", "🤤", "😂", "👍", "🥳", "🥺", "😉", "🥱", "😈", "😍", "🤪", "🥰", "😘", "😎", "👻", "😏", "😡", "👀", "😤", "🤭", "😒"];

interface EmojiType {
    id: number;
    emoji: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
}

const InteractiveEmojis = () => {
    const [emojis, setEmojis] = useState<EmojiType[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const mousePos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            mousePos.current = { x: event.clientX, y: event.clientY };
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        const initEmojis = () => {
            if (!containerRef.current) return;
            const { width, height } = containerRef.current.getBoundingClientRect();
            setEmojis(EMOJIS.map((emoji, i) => ({
                id: i,
                emoji,
                x: Math.random() * width,
                y: Math.random() * height,
                vx: Math.random() * 0.4 - 0.2,
                vy: Math.random() * 0.4 - 0.2,
                size: Math.random() * 24 + 24,
            })));
        };
        initEmojis();
        window.addEventListener('resize', initEmojis);
        return () => window.removeEventListener('resize', initEmojis);
    }, []);

    useEffect(() => {
        let frameId: number;

        const animate = () => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const { width, height } = rect;

            setEmojis(prevEmojis => prevEmojis.map(e => {
                let { x, y, vx, vy } = e;

                const dx = x - (mousePos.current.x - rect.left);
                const dy = y - (mousePos.current.y - rect.top);
                const dist = Math.sqrt(dx * dx + dy * dy);

                const REPEL_RADIUS = 100;
                const REPEL_STRENGTH = 3;

                if (dist < REPEL_RADIUS && dist !== 0) {
                    const force = (REPEL_RADIUS - dist) / REPEL_RADIUS;
                    vx += (dx / dist) * force * REPEL_STRENGTH;
                    vy += (dy / dist) * force * REPEL_STRENGTH;
                }

                vx += (Math.random() - 0.5) * 0.1;
                vy += (Math.random() - 0.5) * 0.1;

                x += vx;
                y += vy;

                if (x < 0) { x = 0; vx *= -1; }
                if (x > width) { x = width; vx *= -1; }
                if (y < 0) { y = 0; vy *= -1; }
                if (y > height) { y = height; vy *= -1; }

                vx *= 0.95;
                vy *= 0.95;

                return { ...e, x, y, vx, vy };
            }));

            frameId = requestAnimationFrame(animate);
        };

        frameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(frameId);
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {emojis.map(e => (
                <div
                    key={e.id}
                    className="absolute"
                    style={{
                        left: e.x,
                        top: e.y,
                        fontSize: `${e.size}px`,
                        transform: 'translate(-50%, -50%)',
                        willChange: 'transform'
                    }}
                >
                    {e.emoji}
                </div>
            ))}
        </div>
    );
};

export default InteractiveEmojis;
