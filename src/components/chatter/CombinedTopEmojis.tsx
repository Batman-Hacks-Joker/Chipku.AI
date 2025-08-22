
"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import type { ChatMessage } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface EmojiData {
  emoji: string;
  totalCount: number;
  users: Record<string, number>;
  id: string;
}

interface InteractiveEmoji extends EmojiData {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

interface CombinedTopEmojisProps {
  messages1: ChatMessage[];
  fileName1: string;
  messages2: ChatMessage[];
  fileName2: string;
}

const getChatName = (fileName: string) => {
  return fileName.replace("WhatsApp Chat with ", "").replace(".txt", "");
};

const processEmojiData = (messages: ChatMessage[]): EmojiData[] => {
  const emojiCounts: Record<
    string,
    { totalCount: number; users: Record<string, number> }
  > = {};
  let emojiRegex: RegExp;

  try {
    emojiRegex = new RegExp(
      "\\p{Emoji_Presentation}|\\p{Extended_Pictographic}",
      "gu"
    );
  } catch (e) {
    emojiRegex = /([\u231A-\uD83E\uDDFF])/gu;
  }

  messages.forEach((message) => {
    const emojis = message.message.match(emojiRegex);
    if (emojis) {
      emojis.forEach((emoji) => {
        if (!emojiCounts[emoji]) {
          emojiCounts[emoji] = { totalCount: 0, users: {} };
        }
        emojiCounts[emoji].totalCount++;
        emojiCounts[emoji].users[message.author] =
          (emojiCounts[emoji].users[message.author] || 0) + 1;
      });
    }
  });

  return Object.entries(emojiCounts)
    .sort(([, a], [, b]) => b.totalCount - a.totalCount)
    .slice(0, 10)
    .map(([emoji, data]) => ({
      emoji,
      ...data,
      id: `${emoji}-${Math.random()}`,
    }));
};

const EmojiCanvas = ({
  emojisData,
  chatName,
}: {
  emojisData: EmojiData[];
  chatName: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [emojis, setEmojis] = useState<InteractiveEmoji[]>([]);
  const mousePos = useRef({ x: -1, y: -1 });
  const [isInteracting, setIsInteracting] = useState(false);
  const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startInteraction = () => {
    setIsInteracting(true);
    if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
    }
    interactionTimeoutRef.current = setTimeout(() => {
        setIsInteracting(false);
        mousePos.current = { x: -1, y: -1 };
    }, 3000); // Stop interaction after 3s
  };

  useEffect(() => {
    return () => {
        if (interactionTimeoutRef.current) {
            clearTimeout(interactionTimeoutRef.current);
        }
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mousePos.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      }
    };
    const handleMouseLeave = () => {
        mousePos.current = { x: -1, y: -1 };
    }
    
    const currentContainer = containerRef.current;
    if (currentContainer && isInteracting) {
      currentContainer.addEventListener("mousemove", handleMouseMove);
      currentContainer.addEventListener("mouseleave", handleMouseLeave);
    }
    return () => {
      if (currentContainer) {
        currentContainer.removeEventListener("mousemove", handleMouseMove);
        currentContainer.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [isInteracting]);

  useEffect(() => {
    if (!containerRef.current || emojisData.length === 0) return;

    const { width, height } = containerRef.current.getBoundingClientRect();
    const maxCount = Math.max(...emojisData.map((e) => e.totalCount), 1);

    setEmojis(
      emojisData.map((e, i) => {
        const size = 32 + (e.totalCount / maxCount) * 80; // min 32, max 112
        return {
          ...e,
          x: Math.random() * (width - size) + size / 2,
          y: Math.random() * (height - size) + size / 2,
          vx: Math.random() * 0.4 - 0.2,
          vy: Math.random() * 0.4 - 0.2,
          size,
        };
      })
    );
  }, [emojisData]);

  useEffect(() => {
    if (emojis.length === 0) return;
    let frameId: number;

    const animate = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const { width, height } = rect;

      setEmojis((prevEmojis) =>
        prevEmojis.map((e) => {
          let { x, y, vx, vy, size } = e;

          if (isInteracting && mousePos.current.x > -1) {
            const dx = x - mousePos.current.x;
            const dy = y - mousePos.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const REPEL_RADIUS = 120;
            if (dist < REPEL_RADIUS) {
              const force = (REPEL_RADIUS - dist) / REPEL_RADIUS;
              vx += (dx / dist) * force * 0.6;
              vy += (dy / dist) * force * 0.6;
            }
          }

          x += vx;
          y += vy;

          if (x - size / 2 < 0) { x = size / 2; vx *= -0.9; }
          if (x + size / 2 > width) { x = width - size / 2; vx *= -0.9; }
          if (y - size / 2 < 0) { y = size / 2; vy *= -0.9; }
          if (y + size / 2 > height) { y = height - size / 2; vy *= -0.9; }

          vx *= 0.98;
          vy *= 0.98;
          
          return { ...e, x, y, vx, vy };
        })
      );
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [emojis, isInteracting]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[300px] border rounded-lg bg-card/50 overflow-hidden"
    >
      <h3 className="absolute top-2 left-4 font-bold text-foreground text-center w-full">{chatName}</h3>
      {emojis.map((e) => (
        <TooltipProvider key={e.id} delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="absolute"
                style={{
                  left: e.x,
                  top: e.y,
                  fontSize: `${e.size}px`,
                  transform: "translate(-50%, -50%)",
                  cursor: "pointer",
                  willChange: 'transform',
                }}
                onClick={startInteraction}
              >
                {e.emoji}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="p-2">
                <p className="font-bold text-lg">
                  {e.emoji} (Total: {e.totalCount})
                </p>
                <ul className="list-disc list-inside mt-1">
                  {Object.entries(e.users)
                    .sort(([, a], [, b]) => b - a)
                    .map(([user, count]) => (
                      <li key={user}>
                        {user}: {count}
                      </li>
                    ))}
                </ul>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};

export function CombinedTopEmojis({
  messages1,
  fileName1,
  messages2,
  fileName2,
}: CombinedTopEmojisProps) {
  const topEmojis1 = useMemo(() => processEmojiData(messages1), [messages1]);
  const topEmojis2 = useMemo(() => processEmojiData(messages2), [messages2]);

  const chatName1 = getChatName(fileName1);
  const chatName2 = getChatName(fileName2);

  if (topEmojis1.length === 0 && topEmojis2.length === 0) {
    return null;
  }

  return (
    <Card className="dark:bg-transparent">
      <CardHeader>
        <CardTitle className="font-headline">Top Common Emojis</CardTitle>
        <CardDescription>
          Comparing top 10 most used emojis from each chat.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          {topEmojis1.length > 0 ? (
            <EmojiCanvas emojisData={topEmojis1} chatName={chatName1} />
          ) : (
            <div className="w-full h-[300px] border rounded-lg bg-card/50 flex items-center justify-center text-muted-foreground">
              No emojis found in {chatName1}'s chat.
            </div>
          )}
          <div className="hidden md:block w-px bg-border" />
          {topEmojis2.length > 0 ? (
            <EmojiCanvas emojisData={topEmojis2} chatName={chatName2} />
          ) : (
             <div className="w-full h-[300px] border rounded-lg bg-card/50 flex items-center justify-center text-muted-foreground">
              No emojis found in {chatName2}'s chat.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

    