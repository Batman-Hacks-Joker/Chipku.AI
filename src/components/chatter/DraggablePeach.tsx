
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

interface DraggablePeachProps {
    fileUploadRef: React.RefObject<HTMLDivElement>;
    onDrop: () => void;
}

const DraggablePeach: React.FC<DraggablePeachProps> = ({ fileUploadRef, onDrop }) => {
    const controls = useDragControls();
    const constraintsRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: any) => {
        setIsDragging(false);
        if (fileUploadRef.current) {
            const dropZone = fileUploadRef.current.getBoundingClientRect();
            const PeachRect = (event.target as HTMLElement).getBoundingClientRect();

            const isOverlapping = !(
                PeachRect.right < dropZone.left ||
                PeachRect.left > dropZone.right ||
                PeachRect.bottom < dropZone.top ||
                PeachRect.top > dropZone.bottom
            );

            if (isOverlapping) {
                onDrop();
            }
        }
    };

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
                animate={{
                    y: [0, -20, 0, 20, 0],
                    x: [0, 15, 0, -15, 0],
                }}
                transition={{
                    duration: 8,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "mirror"
                }}
                className="absolute top-1/4 left-1/4 pointer-events-auto cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => controls.start(e)}
            >
                <TooltipProvider>
                    <Tooltip open={!isDragging}>
                        <TooltipTrigger asChild>
                            <div className="text-7xl relative" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.3)' }}>
                                🍑
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-black/70 text-white border-none">
                           <div className="flex items-center gap-1">
                             <Info size={14} />
                             <p>Drag me for free upload</p>
                           </div>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </motion.div>
        </div>
    );
};

export default DraggablePeach;
{/**hi */}