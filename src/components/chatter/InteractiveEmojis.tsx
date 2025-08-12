
"use client";

import React, { useState, useEffect, useRef } from 'react';

const EMOJIS = ["😊", "🥴", "💋", "🤤", "😂", "👍", "😳", "😠", "🥳", "🔥", "🥺", "🧡", "😉", "🥱", "🤓", "😈", "😍", "🤪", "🥰", "😘", "😎", "👻", "😏", "😡", "💖", "👀", "😤", "😆", "✨", "🤭", "🧐", "😪"];

const InteractiveEmojis = () => {
    const [emojis, setEmojis] = useState<any[]>([]);
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
                vx: Math.random() * 2 - 1,
                vy: Math.random() * 2 - 1,
                size: Math.random() * 24 + 24, // font size between 24 and 48
            })));
        };
        initEmojis();
        window.addEventListener('resize', initEmojis);
        return () => window.removeEventListener('resize', initEmojis);
    }, []);

    useEffect(() => {
        const animate = () => {
            if (!containerRef.current) return;
            const { width, height } = containerRef.current.getBoundingClientRect();

            setEmojis(prevEmojis => prevEmojis.map(e => {
                let { x, y, vx, vy } = e;

                // Mouse interaction
                const dx = x - mousePos.current.x;
                const dy = y - mousePos.current.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                const REPEL_RADIUS = 100;
                const REPEL_STRENGTH = 5;

                if (dist < REPEL_RADIUS) {
                    const force = (REPEL_RADIUS - dist) / REPEL_RADIUS;
                    vx += (dx / dist) * force * REPEL_STRENGTH;
                    vy += (dy / dist) * force * REPEL_STRENGTH;
                }

                // Update position
                x += vx;
                y += vy;

                // Wall collision
                if (x < 0 || x > width) vx *= -1;
                if (y < 0 || y > height) vy *= -1;

                // Friction/damping
                vx *= 0.95;
                vy *= 0.95;
                
                return { ...e, x, y, vx, vy };
            }));

            requestAnimationFrame(animate);
        };

        const animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
    }, []);


    return (
        <div ref={containerRef} className="fixed inset-0 w-full h-full pointer-events-none z-0">
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
