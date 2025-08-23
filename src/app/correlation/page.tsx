
"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { parseChatFile } from "@/lib/chat-parser";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/chatter/FileUpload";
import Footer from "@/components/ui/Footer";
import FloatingActionButton from "@/components/ui/FloatingActionButton";
import { ParsedChatData } from "@/lib/types";
import { useRouter } from "next/navigation";
import CombinedHourlyMessagesChart from "@/components/chatter/CombinedHourlyMessagesChart";
import { LoadingPage } from "@/components/ui/LoadingPage";
import { CombinedMessagesPerUserChart } from "@/components/chatter/CombinedMessagesPerUserChart";
import CombinedWeeklyActivityChart from "@/components/chatter/CombinedWeeklyActivityChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useDarkModeContext } from "@/context/DarkModeContext";
import { CombinedActivityHeatmap } from "@/components/chatter/CombinedActivityHeatmap";
import { Button } from "@/components/ui/button";
import FireAnimation from "@/components/chatter/FireAnimation";
import { CombinedTopEmojis } from "@/components/chatter/CombinedTopEmojis";
import { useUsage } from "@/context/UsageContext";
import { useAuth } from "@/context/AuthContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function CorrelationPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();
  const { incrementCount, hasReachedLimit } = useUsage();
  const correlationLimitReached = hasReachedLimit('correlations');


  const [isLoading, setIsLoading] = React.useState(true);
  const [chatData1, setChatData1] = React.useState<ParsedChatData | null>(null);
  const [fileName1, setFileName1] = React.useState<string | null>(null);
  const [isLoading1, setIsLoading1] = React.useState(false);

  const [chatData2, setChatData2] = React.useState<ParsedChatData | null>(null);
  const [fileName2, setFileName2] = React.useState<string | null>(null);
  const [isLoading2, setIsLoading2] = React.useState(false);
  const [isDarkMode] = useDarkModeContext();
  const [showCorrelation, setShowCorrelation] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [showFireAnimation, setShowFireAnimation] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const stats1 = React.useMemo(() => {
    if (!chatData1) return { totalMessages: 0, totalWords: 0, activeUsers: 0, daysAnalyzed: 0 };
    const daysAnalyzed = chatData1.startDate && chatData1.endDate
      ? Math.round((chatData1.endDate.getTime() - chatData1.startDate.getTime()) / (1000 * 3600 * 24)) + 1
      : 0;
    return {
      totalMessages: chatData1.messages.length,
      totalWords: chatData1.messages.reduce((sum, msg) => sum + msg.wordCount, 0),
      activeUsers: chatData1.users.length,
      daysAnalyzed,
    };
  }, [chatData1]);

  const stats2 = React.useMemo(() => {
    if (!chatData2) return { totalMessages: 0, totalWords: 0, activeUsers: 0, daysAnalyzed: 0 };
    const daysAnalyzed = chatData2.startDate && chatData2.endDate
      ? Math.round((chatData2.endDate.getTime() - chatData2.startDate.getTime()) / (1000 * 3600 * 24)) + 1
      : 0;
    return {
      totalMessages: chatData2.messages.length,
      totalWords: chatData2.messages.reduce((sum, msg) => sum + msg.wordCount, 0),
      activeUsers: chatData2.users.length,
      daysAnalyzed,
    };
  }, [chatData2]);

  const handleFile1Processed = async (content: string, name: string) => {
    setIsLoading1(true);
    try {
      const data = await parseChatFile(content);
      if (data.messages.length === 0) {
        toast({
          variant: "destructive",
          title: "Parsing Error",
          description: "Could not find any valid messages in the file. Please check the format.",
        });
        setIsLoading1(false);
        return;
      }
      setChatData1(data);
      setFileName1(name);
    } catch (error) {
      console.error("Failed to parse chat file:", error);
      toast({
        variant: "destructive",
        title: "File Error",
        description: "There was an error processing your file. Please ensure it's a valid chat log.",
      });
    } finally {
      setIsLoading1(false);
    }
  };

  const handleFile2Processed = async (content: string, name: string) => {
    setIsLoading2(true);
    try {
      const data = await parseChatFile(content);
      if (data.messages.length === 0) {
        toast({
          variant: "destructive",
          title: "Parsing Error",
          description: "Could not find any valid messages in the file. Please check the format.",
        });
        setIsLoading2(false);
        return;
      }
      setChatData2(data);
      setFileName2(name);
    } catch (error) {
      console.error("Failed to parse chat file:", error);
      toast({
        variant: "destructive",
        title: "File Error",
        description: "There was an an error processing your file. Please ensure it's a valid chat log.",
      });
    } finally {
      setIsLoading2(false);
    }
  };

  const handleHomeClick = () => {
    router.push('/');
  }

  const handleStartCorrelation = () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to use the Correlation feature.",
      });
      return;
    }
     if (correlationLimitReached) {
      toast({
        variant: "destructive",
        title: "Usage Limit Reached",
        description: "You have reached your limit for the Correlation feature.",
      });
      return;
    }
    incrementCount('correlations');
    setIsAnimating(true);
    setShowFireAnimation(true);
  }

  const handleAnimationComplete = () => {
    setShowFireAnimation(false);
    setShowCorrelation(true);
    setIsAnimating(false);
  }

  const handleDiscard = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setChatData1(null);
      setFileName1(null);
      setChatData2(null);
      setFileName2(null);
      setShowCorrelation(false);
      setIsAnimating(false);
    }, 1000);
  }

  if (isLoading) {
    return <LoadingPage title="Correlation provides easy decision making" />;
  }
  
  const getChatName = (fileName: string | null) => {
    if (!fileName) return "";
    return fileName.replace('WhatsApp Chat with ', '').replace('.txt', '');
  };

  const startCorrelationButton = (
      <Button 
          onClick={handleStartCorrelation} 
          disabled={isAnimating || !user || correlationLimitReached}
          className="text-5xl bg-transparent hover:bg-transparent border-none p-4"
      >
          🔥
      </Button>
  );


  return (
    <>
    {showFireAnimation && <FireAnimation onComplete={handleAnimationComplete} />}
    <style jsx>{`
      @keyframes spin-twice {
        from { transform: rotate(0deg); }
        to { transform: rotate(720deg); }
      }
      .animate-spin-twice {
        animation: spin-twice 1s ease-in-out;
      }
    `}</style>
    <div className="relative flex flex-col min-h-screen w-full bg-background dark:bg-black">
       {chatData1 && chatData2 && !showCorrelation && (
         <div 
           className="fixed top-1/2 right-4 -translate-y-1/2 z-50 group"
         >
           <button
             onClick={handleDiscard}
             className="flex items-center space-x-2"
           >
             <span className={cn(
               "bg-destructive text-destructive-foreground text-sm font-medium px-2 py-1 rounded-md transition-opacity duration-300 whitespace-nowrap",
               isAnimating ? "opacity-100" : "opacity-0 group-hover:opacity-100"
             )}>
               Discard files
             </span>
             <span
               className={cn(
                "text-4xl transition-transform duration-300 ease-in-out transform",
                isAnimating ? "animate-spin-twice" : "rotate-45 group-hover:rotate-0"
               )}
               role="img"
               aria-label="Discard files"
             >
               ❌
             </span>
           </button>
         </div>
      )}
       {chatData1 && chatData2 && showCorrelation && (
         <div 
           className="fixed top-1/2 right-4 -translate-y-1/2 z-50 group"
         >
           <button
             onClick={handleDiscard}
             className="flex items-center space-x-2"
           >
             <span className={cn(
               "bg-destructive text-destructive-foreground text-sm font-medium px-2 py-1 rounded-md transition-opacity duration-300 whitespace-nowrap",
               isAnimating ? "opacity-100" : "opacity-0 group-hover:opacity-100"
             )}>
               Discard files
             </span>
             <span
               className={cn(
                "text-4xl transition-transform duration-300 ease-in-out transform",
                isAnimating ? "animate-spin-twice" : "rotate-45 group-hover:rotate-0"
               )}
               role="img"
               aria-label="Discard files"
             >
               ❌
             </span>
           </button>
         </div>
      )}
      <div
        className={cn(
          "absolute inset-0 h-full w-full",
          "[background-size:20px_20px]",
          isDarkMode ? "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]" : "[background-image:radial-gradient(white_1px,transparent_1px)]"
        )}
      />
       <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>

      <div className="relative z-10 flex-grow container mx-auto p-4">
        
        {showCorrelation && chatData1 && chatData2 && (
          <div className="space-y-8">
             <Card className="dark:bg-transparent">
              <CardHeader>
                <div className="flex items-baseline justify-between">
                  <CardTitle>Combined Overall Stats</CardTitle>
                  {fileName1 && fileName2 && (
                    <p className="text-sm text-muted-foreground truncate">
                      <span className="text-red-500">{getChatName(fileName1)}</span>
                      <span className="text-muted-foreground"> / </span> 
                      <span className="text-blue-500">{getChatName(fileName2)}</span>
                    </p>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="dark:bg-black/20">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-muted-foreground">Total Messages 💬</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        <span className="text-red-500">{stats1.totalMessages.toLocaleString()}</span>
                        <span className="text-muted-foreground"> / </span> 
                        <span className="text-blue-500">{stats2.totalMessages.toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="dark:bg-black/20">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-muted-foreground">Total Words ✍️</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <div className="text-2xl font-bold">
                        <span className="text-red-500">{stats1.totalWords.toLocaleString()}</span>
                        <span className="text-muted-foreground"> / </span> 
                        <span className="text-blue-500">{stats2.totalWords.toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="dark:bg-black/20">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-muted-foreground">Active Users 🙋‍♂️</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <div className="text-2xl font-bold">
                        <span className="text-red-500">{stats1.activeUsers}</span>
                        <span className="text-muted-foreground"> / </span> 
                        <span className="text-blue-500">{stats2.activeUsers}</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="dark:bg-black/20">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-muted-foreground">Days Analyzed 🧐</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <div className="text-2xl font-bold">
                        <span className="text-red-500">{stats1.daysAnalyzed}</span>
                        <span className="text-muted-foreground"> / </span> 
                        <span className="text-blue-500">{stats2.daysAnalyzed}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-transparent">
              <CombinedMessagesPerUserChart 
                messages1={chatData1.messages}
                users1={chatData1.users}
                fileName1={fileName1}
                messages2={chatData2.messages}
                users2={chatData2.users}
                fileName2={fileName2}
              />
            </Card>

            <Card className="dark:bg-transparent">
              <CombinedWeeklyActivityChart
                messages1={chatData1.messages}
                fileName1={fileName1}
                messages2={chatData2.messages}
                fileName2={fileName2}
              />
            </Card>

            <Card className="dark:bg-transparent">
              <CombinedHourlyMessagesChart 
                messages1={chatData1.messages}
                messages2={chatData2.messages}
                users1={chatData1.users}
                users2={chatData2.users}
                fileName1={fileName1}
                fileName2={fileName2}
              />
            </Card>
            
            <Card className="dark:bg-transparent">
              <CombinedActivityHeatmap
                messages1={chatData1.messages}
                fileName1={fileName1}
                messages2={chatData2.messages}
                fileName2={fileName2}
              />
            </Card>

            <Card className="dark:bg-transparent">
              <CombinedTopEmojis
                messages1={chatData1.messages}
                fileName1={fileName1}
                messages2={chatData2.messages}
                fileName2={fileName2}
              />
            </Card>
          </div>
        )}
        {!showCorrelation && (
          <>
            <div className={cn(showCorrelation && "hidden")}>
                <h1 className="text-4xl font-bold text-center my-8">Correlation Analysis</h1>
                <p className="text-lg text-muted-foreground text-center mb-8">
                Compare two of your chat histories to see how your communication style changes with different people, or compare your chat habits with a friend's.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col items-center">
                <h2 className="text-2xl font-semibold mb-4 text-center">Chat 1</h2>
                {isLoading1 ? (
                  <div className="flex justify-center items-center h-48">
                    <Loader2 className="h-16 w-16 animate-spin text-primary" />
                  </div>
                ) : chatData1 ? (
                  <div className="text-center p-4 border rounded-lg bg-card">
                    <p className="font-bold">{fileName1}</p>
                    <p>{stats1.totalMessages} messages</p>
                  </div>
                ) : (
                    <div className="flex-grow flex items-center justify-center w-full">
                        <FileUpload onFileProcessed={handleFile1Processed} />
                    </div>
                )}
              </div>

              <div className="flex flex-col items-center">
                <h2 className="text-2xl font-semibold mb-4 text-center">Chat 2</h2>
                {isLoading2 ? (
                  <div className="flex justify-center items-center h-48">
                    <Loader2 className="h-16 w-16 animate-spin text-primary" />
                  </div>
                ) : chatData2 ? (
                  <div className="text-center p-4 border rounded-lg bg-card">
                    <p className="font-bold">{fileName2}</p>
                    <p>{stats2.totalMessages} messages</p>
                  </div>
                ) : (
                    <div className="flex-grow flex items-center justify-center w-full">
                        <FileUpload onFileProcessed={handleFile2Processed} />
                    </div>
                )}
              </div>
            </div>
            
            {chatData1 && chatData2 && !showCorrelation && (
              <div className="flex justify-center mt-8">
                {!user ? (
                   <TooltipProvider>
                      <Tooltip>
                          <TooltipTrigger asChild>
                              <div>{startCorrelationButton}</div>
                          </TooltipTrigger>
                          <TooltipContent>
                              <p>Please log in to start Correlation</p>
                          </TooltipContent>
                      </Tooltip>
                   </TooltipProvider>
                ) : correlationLimitReached ? (
                   <TooltipProvider>
                      <Tooltip>
                          <TooltipTrigger asChild>
                              <div>{startCorrelationButton}</div>
                          </TooltipTrigger>
                          <TooltipContent>
                              <p>Correlation limit reached</p>
                          </TooltipContent>
                      </Tooltip>
                   </TooltipProvider>
                ) : (
                    startCorrelationButton
                )}
              </div>
            )}
          </>
        )}
      </div>
      <div className="relative z-10">
        <Footer />
      </div>
      <FloatingActionButton onHomeClick={handleHomeClick} />
    </div>
    </>
  );
}
{/**hi */}