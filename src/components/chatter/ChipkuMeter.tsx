"use client";

import * as React from "react";
import { Heart, Loader2 } from "lucide-react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

import type { ChatMessage } from "@/lib/types";
import { analyzeRelationshipSentiment, type RelationshipSentimentOutput } from "@/ai/flows/relationship-sentiment-analysis";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HeartBalloon } from "@/components/chatter/HeartBalloon";

interface ChipkuMeterProps {
  messages: ChatMessage[];
  dateRange?: DateRange;
}

export function ChipkuMeter({ messages, dateRange }: ChipkuMeterProps) {
  const [result, setResult] = React.useState<RelationshipSentimentOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null)
  const [analysisTriggered, setAnalysisTriggered] = React.useState(false);

  React.useEffect(() => {
    const analyzeSentiment = async () => {
      if (messages.length === 0 || !dateRange?.from || !dateRange?.to) {
        setResult(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const chatData = messages.map(m => `${m.author}: ${m.message}`).join('\n');
        const analysis = await analyzeRelationshipSentiment({
          chatData,
          startDate: format(dateRange.from, "yyyy-MM-dd"),
          endDate: format(dateRange.to, "yyyy-MM-dd"),
        });
        setResult(analysis);
      } catch (e) {
        console.error("Sentiment analysis failed:", e);
        setError("Could not analyze relationship strength. Please try a different date range.");
      } finally {
        setIsLoading(false);
      }
    };

    if (analysisTriggered) {
      analyzeSentiment();
    }
  }, [messages, dateRange, analysisTriggered]);

  const handleAnalyzeClick = () => {
    setAnalysisTriggered(true);
  };

  const staggeredDelay = result && result.balloons > 0 ? 5 / result.balloons : 0;

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-2">
            <Heart className="text-primary" />
            <CardTitle className="font-headline">Chipku Meter</CardTitle>
        </div>
        <CardDescription>
          Relationship strength analysis based on chat sentiment.
        </CardDescription>
      </CardHeader>
      <CardContent className="relative flex-grow flex items-center justify-center min-h-[200px]"> {/* Added min-h */}
        {!analysisTriggered && (
          <button
            onClick={handleAnalyzeClick}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Analyze Relationship Strength
          </button>
        )}

        {analysisTriggered && (
          <>
            {isLoading && (
              <div className="absolute inset-0 bg-card/80 flex flex-col items-center justify-center z-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-muted-foreground">Analyzing sentiments...</p>
              </div>
            )}

            {error && !isLoading && (
              <div className="text-center py-10 text-destructive">{error}</div>
            )}

            {!isLoading && !error && result && (
            <div className="relative flex flex-col items-center justify-center rounded-lg bg-gradient-to-b from-pink-200 via-sky-200 to-sky-300 min-h-[300px] p-4">
                <AnimatePresence>
                  {[...Array(result.balloons)].map((_, i) => (
                    <motion.div
                      className="heart-balloon-large absolute bottom-0"
                      key={i}
                      initial={{ opacity: 0, y: 50, scale: 0.5, left: `${10 + Math.random() * 80}%` }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1.5,
                        transition: { delay: i * staggeredDelay, duration: 0.5, ease: "easeOut" },
                      }}
                      exit={{ opacity: 0, scale: 0.5 }}
                    >
                      <HeartBalloon
                        style={{
                          animation: `float ${4 + Math.random() * 4}s ease-in-out infinite`,
                          animationDelay: `${Math.random() * 3}s`,
                        }}
                      />
                    </motion.div>
                    ))}
                </AnimatePresence>

                <div className="relative z-10 text-center bg-black/20 backdrop-blur-sm p-4 rounded-lg">
                  <p className="text-5xl font-bold text-white drop-shadow-lg">
                    {result.rating}<span className="text-3xl opacity-80">/33</span>
                  </p>
                  <p className="text-2xl font-semibold text-white mt-2 drop-shadow-md font-headline">{result.label}</p>
                </div>
            </div>
            )}

            {!isLoading && !error && !result && (
            <div className="text-center py-10 text-muted-foreground">Not enough data to analyze. Try a different date range.</div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
