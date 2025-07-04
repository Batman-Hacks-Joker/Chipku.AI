import { cn } from "@/lib/utils";
import * as React from "react";

interface HeartBalloonProps {
  style: React.CSSProperties;
  className?: string;
}

export function HeartBalloon({ style, className }: HeartBalloonProps) {
  return (
    <div
      className={cn("absolute bottom-0 will-change-transform", className)}
      style={style}
    >
      <div className="relative">
        <svg
          viewBox="0 0 200 200"
          className="w-12 h-12 text-primary drop-shadow-lg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            d="M100,60 C100,60 140,0 180,40 C220,80 180,140 100,190 C20,140 -20,80 20,40 C60,0 100,60 100,60 Z"
          />
        </svg>
        <div className="absolute top-full left-1/2 mt-[-2px] h-24 w-px bg-muted-foreground/30" />
      </div>
    </div>
  );
}
