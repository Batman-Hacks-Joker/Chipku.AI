
"use client";

import * as React from "react";
import { Heart, Loader2 } from "lucide-react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

import type { ChatMessage } from "@/lib/types";
import {
  analyzeRelationshipSentiment,
  type RelationshipSentimentOutput,
} from "@/ai/flows/relationship-sentiment-analysis";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HeartBalloon } from "@/components/chatter/HeartBalloon";
import { Cloud } from "@/components/chatter/Cloud";

interface ChipkuMeterProps {
  messages: ChatMessage[];
  dateRange?: DateRange;
}

interface BalloonState {
  id: number;
  popped: boolean;
  style: React.CSSProperties;
}

export function ChipkuMeter({ messages, dateRange }: ChipkuMeterProps) {
  const [result, setResult] = React.useState<RelationshipSentimentOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [analysisTriggered, setAnalysisTriggered] = React.useState(false);
  const [buttonEnabled, setButtonEnabled] = React.useState(true);
  const [lastAnalyzedRange, setLastAnalyzedRange] = React.useState<DateRange | null>(null);
  const initialLoad = React.useRef(true);
  const [balloons, setBalloons] = React.useState<BalloonState[]>([]);
  const [animationState, setAnimationState] = React.useState<"idle" | "clouds" | "score" | "balloons" | "finished">("idle");

  const isSameDateRange = (a?: DateRange, b?: DateRange) => {
    if (!a || !b || !a.from || !a.to || !b.from || !b.to) return false;
    return a.from.getTime() === b.from.getTime() && a.to.getTime() === b.to.getTime();
  };

  const createBalloonStates = (count: number) => {
    return [...Array(count)].map((_, i) => ({
      id: i,
      popped: false,
      style: {
        left: `${10 + Math.random() * 80}%`,
        animation: `float ${4 + Math.random() * 4}s ease-in-out infinite`,
        animationDelay: `${Math.random() * 3}s`,
      },
    }));
  };

  const handlePop = (id: number) => {
    setBalloons(prev => prev.map(b => b.id === id ? { ...b, popped: true } : b));
    setTimeout(() => {
        setBalloons(prev => prev.map(b => b.id === id ? {
            ...b,
            popped: false,
            style: {
                ...b.style,
                left: `${10 + Math.random() * 80}%`,
            }
        } : b));
    }, 3000);
  };


  const analyzeSentiment = async () => {
    if (messages.length === 0 || !dateRange?.from || !dateRange?.to) {
      setResult(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setButtonEnabled(false);
    setAnimationState("idle");

    try {
      const chatData = messages.map((m) => `${m.author}: ${m.message}`).join("\n");
      const analysis = await analyzeRelationshipSentiment({
        chatData,
        startDate: format(dateRange.from, "yyyy-MM-dd"),
        endDate: format(dateRange.to, "yyyy-MM-dd"),
      });

      setResult(analysis);
      setBalloons(createBalloonStates(analysis.balloons));
      setLastAnalyzedRange(dateRange);
      setAnalysisTriggered(false);
      
      setAnimationState("clouds");
      setTimeout(() => setAnimationState("score"), 1000);
      setTimeout(() => setAnimationState("balloons"), 1500);
      setTimeout(() => setAnimationState("finished"), 1500 + (analysis.balloons > 0 ? 5000 : 0));


    } catch (e) {
      console.error("Sentiment analysis failed:", e);
      setError("Could not analyze relationship strength. Please try a different date range.");
      setAnalysisTriggered(false);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (analysisTriggered && !isLoading) {
      analyzeSentiment();
    }
  }, [analysisTriggered, isLoading, messages, dateRange]);

  React.useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }
    if (result && dateRange && lastAnalyzedRange && !isSameDateRange(dateRange, lastAnalyzedRange)) {
      setButtonEnabled(true);
      setResult(null);
      setBalloons([]);
      setAnimationState("idle");
    }
  }, [dateRange, result, lastAnalyzedRange]);

  const handleAnalyzeClick = () => {
    setAnalysisTriggered(true);
  };

  const staggeredDelay = result && result.balloons > 0 ? 5 / result.balloons : 0;

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Heart className="text-purple-600" />
          <CardTitle className="font-headline">Chipku Meter</CardTitle>
        </div>
        <CardDescription>Check your relationship strength using Chipku AI</CardDescription>
      </CardHeader>
      <CardContent className="relative flex-grow flex flex-col items-center justify-center min-h-[350px] w-full p-4">
        {buttonEnabled && (
          <button
            onClick={handleAnalyzeClick}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed z-20"
            disabled={!buttonEnabled || isLoading}
          >
            Analyze Relationship Strength
          </button>
        )}

        {isLoading && (
          <div className="absolute inset-0 bg-card/80 flex flex-col items-center justify-center z-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-muted-foreground">Analyzing sentiments...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="text-center py-10 text-destructive">{error}</div>
        )}

        {!isLoading && !error && result && !buttonEnabled && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-gradient-to-b from-pink-200 via-sky-200 to-sky-300 w-full overflow-hidden">
            <AnimatePresence>
                {animationState !== "idle" && (
                    <>
                        <Cloud style={{ top: '15%', left: '-20%', animation: 'float-horizontal 25s infinite linear' }} />
                        <Cloud style={{ top: '30%', left: '-25%', animation: 'float-horizontal 30s infinite linear reverse' }} />
                        <Cloud style={{ top: '60%', left: '-15%', animation: 'float-horizontal 20s infinite linear' }} />
                    </>
                )}
            </AnimatePresence>
             <AnimatePresence>
              {balloons.map((balloon) => (
                !balloon.popped && animationState === "balloons" && (
                <motion.div
                  key={balloon.id}
                  className="absolute bottom-0 z-10"
                  initial={{ opacity: 0, y: 50, scale: 0.5 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { delay: balloon.id * (5000 / balloons.length) / 1000, duration: 0.5, ease: "easeOut" },
                  }}
                  exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
                  onClick={() => handlePop(balloon.id)}
                  
                >
                  <HeartBalloon style={balloon.style} />
                </motion.div>
                )
              ))}
            </AnimatePresence>

             <AnimatePresence>
              {balloons.map((balloon) => (
                balloon.popped && (
                <motion.div
                  key={`${balloon.id}-popped`}
                  className="absolute z-20 text-3xl"
                  style={{
                    left: balloon.style.left,
                    bottom: '20%',
                  }}
                  initial={{ opacity: 1, scale: 1 }}
                  animate={{ opacity: 0, scale: 2, transition: { duration: 0.3 } }}
                >
                  💔
                </motion.div>
                )
              ))}
            </AnimatePresence>
            
            <AnimatePresence>
            {animationState === "score" || animationState === "balloons" || animationState === "finished" && (
                <motion.div
                  className="relative z-20 text-center bg-black/20 backdrop-blur-sm p-4 rounded-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1, transition: { duration: 0.5, ease: "backOut" } }}
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
                >
                  <p className="text-5xl font-bold text-white drop-shadow-lg">
                    {result.rating}<span className="text-3xl opacity-80">/33</span>
                  </p>
                  <p className="text-2xl font-semibold text-white mt-2 drop-shadow-md font-headline">{result.label}</p>
                </motion.div>
            )}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

