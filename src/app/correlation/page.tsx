"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { parseChatFile } from "@/lib/chat-parser";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/chatter/FileUpload";
import { AnalysisDashboard } from "@/components/chatter/AnalysisDashboard";
import Footer from "@/components/ui/Footer";
import FloatingActionButton from "@/components/ui/FloatingActionButton";
import { ParsedChatData } from "@/lib/types";
import { useRouter } from "next/navigation";
import CombinedHourlyMessagesChart from "@/components/chatter/CombinedHourlyMessagesChart";
import { LoadingPage } from "@/components/ui/LoadingPage";
import { CombinedMessagesPerUserChart } from "@/components/chatter/CombinedMessagesPerUserChart";
import CombinedWeeklyActivityChart from "@/components/chatter/CombinedWeeklyActivityChart";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useDarkModeContext } from "@/context/DarkModeContext";

export default function CorrelationPage() {
  const { toast } = useToast();
  const router = useRouter();

  const [isLoading, setIsLoading] = React.useState(true);
  const [chatData1, setChatData1] = React.useState<ParsedChatData | null>(null);
  const [fileName1, setFileName1] = React.useState<string | null>(null);
  const [isLoading1, setIsLoading1] = React.useState(false);

  const [chatData2, setChatData2] = React.useState<ParsedChatData | null>(null);
  const [fileName2, setFileName2] = React.useState<string | null>(null);
  const [isLoading2, setIsLoading2] = React.useState(false);
  const [isDarkMode] = useDarkModeContext();


  React.useEffect(() => {
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

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

  const handleNewUpload1 = () => {
    setChatData1(null);
    setFileName1(null);
  }

    const handleNewUpload2 = () => {
    setChatData2(null);
    setFileName2(null);
  }

  if (isLoading) {
    return <LoadingPage title="Correlation provides easy decision making" />;
  }

  return (
    <div className="relative flex flex-col min-h-screen w-full bg-background dark:bg-black">
      <div
        className={cn(
          "absolute inset-0 h-full w-full",
          "[background-size:20px_20px]",
          isDarkMode ? "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]" : "[background-image:radial-gradient(white_1px,transparent_1px)]"
        )}
      />
       <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>

      <div className="relative z-10 flex-grow container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center my-8">Correlation Analysis</h1>
        <p className="text-lg text-muted-foreground text-center mb-8">
          Compare two of your chat histories to see how your communication style changes with different people, or compare your chat habits with a friend's.
        </p>

        {chatData1 && chatData2 && fileName1 && fileName2 && (
          <Card className="mb-8 dark:bg-transparent">
            <CombinedWeeklyActivityChart
              messages1={chatData1.messages}
              fileName1={fileName1}
              messages2={chatData2.messages}
              fileName2={fileName2}
            />
          </Card>
        )}
        
        {chatData1 && chatData2 && fileName1 && fileName2 && (
          <Card className="mb-8 dark:bg-transparent">
            <CombinedMessagesPerUserChart 
              messages1={chatData1.messages}
              users1={chatData1.users}
              fileName1={fileName1}
              messages2={chatData2.messages}
              users2={chatData2.users}
              fileName2={fileName2}
            />
          </Card>
        )}

        {chatData1 && chatData2 && fileName1 && fileName2 && (
          <Card className="mb-8 dark:bg-transparent">
            <CombinedHourlyMessagesChart 
              messages1={chatData1.messages}
              messages2={chatData2.messages}
              users1={chatData1.users}
              users2={chatData2.users}
              fileName1={fileName1}
              fileName2={fileName2}
            />
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-4 flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-4 text-center">Chat 1</h2>
            {isLoading1 ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
              </div>
            ) : chatData1 ? (
              <AnalysisDashboard parsedData={chatData1} fileName={fileName1} onNewUpload={handleNewUpload1} showAskAI={false} />
            ) : (
                <div className="flex-grow flex items-center justify-center w-full">
                    <FileUpload onFileProcessed={handleFile1Processed} />
                </div>
            )}
          </div>

          <div className="p-4 flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-4 text-center">Chat 2</h2>
            {isLoading2 ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
              </div>
            ) : chatData2 ? (
              <AnalysisDashboard parsedData={chatData2} fileName={fileName2} onNewUpload={handleNewUpload2} showAskAI={false} />
            ) : (
                <div className="flex-grow flex items-center justify-center w-full">
                    <FileUpload onFileProcessed={handleFile2Processed} />
                </div>
            )}
          </div>
        </div>
      </div>
      <div className="relative z-10">
        <Footer showEmojiCarousel={false} />
      </div>
      <FloatingActionButton onHomeClick={handleHomeClick} />
    </div>
  );
}