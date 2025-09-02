
"use client";

import * as React from "react";
import { Wand2, Loader2 } from "lucide-react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

import type { ChatMessage } from "@/lib/types";
import { answerChatQuestion } from "@/ai/flows/chat-question-answer";
import { summarizeChat } from "@/ai/flows/chat-summary";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUsage } from "@/context/UsageContext";
import { useAuth } from "@/context/AuthContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface AskAIProps {
  messages: ChatMessage[];
  dateRange?: DateRange;
}

export function AskAI({ messages, dateRange }: AskAIProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const { incrementCount, hasReachedLimit } = useUsage();
  const askAILimitReached = hasReachedLimit('askAI');
  const [prompt, setPrompt] = React.useState("");
  const [result, setResult] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleGenerate = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to use the Ask AI feature.",
      });
      return;
    }
     if (askAILimitReached) {
      toast({
        variant: "destructive",
        title: "Usage Limit Reached",
        description: "You have reached your limit for the Ask AI feature.",
      });
      return;
    }
    if (!prompt.trim()) {
      toast({
        variant: "destructive",
        title: "Prompt is empty",
        description: "Please enter a question or a command.",
      });
      return;
    }
    if (messages.length === 0 || !dateRange?.from || !dateRange?.to) {
       toast({
        variant: "destructive",
        title: "Not enough data",
        description: "There's no chat data in the selected range to analyze.",
      });
      return;
    }
    
    setIsLoading(true);
    setResult("");
    incrementCount('askAI');

    try {
      const chatData = messages.map(m => `${m.author}: ${m.message}`).join('\n');
      const startDate = format(dateRange.from, "yyyy-MM-dd");
      const endDate = format(dateRange.to, "yyyy-MM-dd");
      const lowerCasePrompt = prompt.toLowerCase();

      let aiResponse;

      if (lowerCasePrompt.includes("summary") || lowerCasePrompt.includes("summarize")) {
        aiResponse = await summarizeChat({
          chatData,
          startDate,
          endDate,
          prompt: prompt,
        });
        setResult(aiResponse.summary);
      } else {
        aiResponse = await answerChatQuestion({
          chatData,
          startDate,
          endDate,
          question: prompt,
        });
        setResult(aiResponse.answer);
      }
    } catch (e) {
      console.error("AI generation failed:", e);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Something went wrong while generating the response. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonContent = () => {
    if (isLoading) {
      return <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>;
    }
    if (!user) {
      return <span className="button-marquee-wrapper"><span className="marquee">🚫 Please login to Generate</span></span>;
    }
    if (askAILimitReached) {
      return <span className="button-marquee-wrapper"><span className="marquee">🚫 Limit reached can't Generate</span></span>;
    }
    return "Generate";
  };
  
  const generateButton = (
    <Button 
      onClick={handleGenerate} 
      disabled={isLoading || !user || askAILimitReached} 
      className="w-full bg-accent hover:bg-accent/80"
    >
      {getButtonContent()}
    </Button>
  );

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wand2 className="text-accent" />
          <CardTitle className="font-headline">Ask AI</CardTitle>
        </div>
        <CardDescription>
          Ask questions anything related to facts, personality, emotions, or get summaries about the chat in the selected date range.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="e.g., 'Summarize why did she blocked me on Thursday' or 'Who mentioned Love you the most?'"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
        />
        {!user ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-full">{generateButton}</div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Please log in to use Ask AI</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : askAILimitReached ? (
           <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-full">{generateButton}</div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ask AI limit reached</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          generateButton
        )}
        {result && (
          <Card className="bg-background/50 p-4 max-h-60 overflow-y-auto">
            <p className="text-sm whitespace-pre-wrap">{result}</p>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
