
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

interface ChipkuMeterProps {
  messages: ChatMessage[];
  dateRange?: DateRange;
}

export function ChipkuMeter({ messages, dateRange }: ChipkuMeterProps) {
  const [result, setResult] = React.useState<RelationshipSentimentOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [analysisTriggered, setAnalysisTriggered] = React.useState(false);
  const [buttonEnabled, setButtonEnabled] = React.useState(true);
  const [lastAnalyzedRange, setLastAnalyzedRange] = React.useState<DateRange | null>(null);
  const initialLoad = React.useRef(true);
  const [balloons, setBalloons] = React.useState<number>(0);

  const isSameDateRange = (a?: DateRange | null, b?: DateRange | null) => {
    if (!a || !b || !a.from || !a.to || !b.from || !b.to) return false;
    return a.from.getTime() === b.from.getTime() && a.to.getTime() === b.to.getTime();
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

    try {
      const chatData = messages.map((m) => `${m.author}: ${m.message}`).join("\n");
      const analysis = await analyzeRelationshipSentiment({
        chatData,
        startDate: format(dateRange.from, "yyyy-MM-dd"),
        endDate: format(dateRange.to, "yyyy-MM-dd"),
      });

      setResult(analysis);
      setBalloons(analysis.balloons);
      setLastAnalyzedRange(dateRange);
      setAnalysisTriggered(false);
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
    }
  }, [dateRange, result, lastAnalyzedRange]);

  const handleAnalyzeClick = () => {
    setAnalysisTriggered(true);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Heart className="text-purple-600" />
          <CardTitle className="font-headline">Chipku Meter</CardTitle>
        </div>
        <CardDescription>Check your relationship strength using Chipku AI</CardDescription>
      </CardHeader>
      <CardContent className="relative flex flex-col items-center justify-center min-h-[250px] p-4">
        {buttonEnabled && (
          <button
            onClick={handleAnalyzeClick}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!buttonEnabled || isLoading}
          >
            Analyze Relationship Strength
          </button>
        )}

        {isLoading && (
          <div className="absolute inset-0 bg-card/80 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-muted-foreground">Analyzing sentiments...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="text-center py-10 text-destructive">{error}</div>
        )}

        <AnimatePresence>
          {!isLoading && !error && result && !buttonEnabled && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="relative">
                {[...Array(balloons)].map((_, i) => (
                  <HeartBalloon
                    key={i}
                    style={{
                      left: `${10 + (i * 80) / (balloons - 1 || 1)}%`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                    className={balloons > 20 ? 'heart-balloon-large' : ''}
                  />
                ))}
              </div>
              <p className="text-5xl font-bold text-primary mt-12">
                {result.rating}/33
              </p>
              <p className="text-2xl font-semibold text-muted-foreground mt-2 font-headline">{result.label}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
