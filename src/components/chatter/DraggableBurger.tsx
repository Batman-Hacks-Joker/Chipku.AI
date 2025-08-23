
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { Info } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface DraggableBurgerProps {
    fileUploadRef: React.RefObject<HTMLDivElement>;
    onDrop: () => void;
}

const DraggableBurger: React.FC<DraggableBurgerProps> = ({ fileUploadRef, onDrop }) => {
    const controls = useDragControls();
    const constraintsRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [initialPosition, setInitialPosition] = useState<{ x: number, y: number } | null>(null);

    useEffect(() => {
        if (!constraintsRef.current || !fileUploadRef.current) return;
        
        const setPosition = () => {
            if (!constraintsRef.current || !fileUploadRef.current) return;

            const viewport = constraintsRef.current.getBoundingClientRect();
            const dropZone = fileUploadRef.current.getBoundingClientRect();

            // Default position if something goes wrong
            let x = viewport.width * 0.25;
            let y = viewport.height * 0.25;

            // Check for overlap
            const burgerRight = x + 80; // Approximate width of the burger
            const burgerBottom = y + 80; // Approximate height of the burger

            if (
                burgerRight > dropZone.left &&
                x < dropZone.right &&
                burgerBottom > dropZone.top &&
                y < dropZone.bottom
            ) {
                // If it overlaps, move it to the top left corner
                x = 20;
                y = 20;
            }
             setInitialPosition({ x, y });
        };

        const timer = setTimeout(setPosition, 100);
        window.addEventListener('resize', setPosition);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', setPosition);
        };

    }, [fileUploadRef]);


    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: any) => {
        setIsDragging(false);
        if (fileUploadRef.current) {
            const dropZone = fileUploadRef.current.getBoundingClientRect();
            
            const isOverlapping = !(
                info.point.x < dropZone.left ||
                info.point.x > dropZone.right ||
                info.point.y < dropZone.top ||
                info.point.y > dropZone.bottom
            );

            if (isOverlapping) {
                onDrop();
            }
        }
    };
    
    if (!initialPosition) return null;

    return (
        <div ref={constraintsRef} className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-hidden">
            <motion.div
                drag
                dragControls={controls}
                dragListener={false}
                dragConstraints={constraintsRef}
                dragElastic={0.2}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={handleDragEnd}
                initial={{ x: initialPosition.x, y: initialPosition.y }}
                animate={isDragging ? {} : {
                    y: [initialPosition.y, initialPosition.y - 20, initialPosition.y, initialPosition.y + 20, initialPosition.y],
                    x: [initialPosition.x, initialPosition.x + 15, initialPosition.x, initialPosition.x - 15, initialPosition.x],
                }}
                transition={{
                    duration: 8,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "mirror"
                }}
                className="absolute pointer-events-auto cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => controls.start(e)}
            >
                <TooltipProvider>
                    <Tooltip open={!isDragging}>
                        <TooltipTrigger asChild>
                            <div className="text-7xl relative" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.3)' }}>
                                🍔
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-black/70 text-white border-none">
                           <div className="flex items-center gap-1">
                             <Info size={14} />
                             <p>Drag me to analyse for free</p>
                           </div>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </motion.div>
        </div>
    );
};

export default DraggableBurger;
