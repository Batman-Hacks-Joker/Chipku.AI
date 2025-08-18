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

  const FileUploadWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="relative p-4 rounded-lg bg-card gradient-border">
      {children}
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <style jsx global>{`
        @keyframes animatedgradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .gradient-border {
          --borderWidth: 3px;
          background: hsl(var(--card));
          position: relative;
          border-radius: var(--borderWidth);
        }
        .gradient-border:after {
          content: '';
          position: absolute;
          top: calc(-1 * var(--borderWidth));
          left: calc(-1 * var(--borderWidth));
          height: calc(100% + var(--borderWidth) * 2);
          width: calc(100% + var(--borderWidth) * 2);
          background: linear-gradient(60deg, #f79533, #f37055, #ef4e7b, #a166ab, #5073b8, #1098ad, #07b39b, #6fba82);
          border-radius: calc(2 * var(--borderWidth));
          z-index: -1;
          animation: animatedgradient 3s ease alternate infinite;
          background-size: 300% 300%;
        }
      `}</style>
      <div className="flex-grow container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center my-8">Correlation Analysis</h1>
        <p className="text-lg text-muted-foreground text-center mb-8">
          Compare two of your chat histories to see how your communication style changes with different people, or compare your chat habits with a friend's.
        </p>

        {chatData1 && chatData2 && fileName1 && fileName2 && (
            <div className="mb-8">
                <CombinedWeeklyActivityChart
                    messages1={chatData1.messages}
                    fileName1={fileName1}
                    messages2={chatData2.messages}
                    fileName2={fileName2}
                />
            </div>
        )}
        
        {chatData1 && chatData2 && fileName1 && fileName2 && (
          <div className="mb-8">
            <CombinedMessagesPerUserChart 
              messages1={chatData1.messages}
              users1={chatData1.users}
              fileName1={fileName1}
              messages2={chatData2.messages}
              users2={chatData2.users}
              fileName2={fileName2}
            />
          </div>
        )}

        {chatData1 && chatData2 && fileName1 && fileName2 && (
          <div className="mb-8">
            <CombinedHourlyMessagesChart 
              messages1={chatData1.messages}
              messages2={chatData2.messages}
              users1={chatData1.users}
              users2={chatData2.users}
              fileName1={fileName1}
              fileName2={fileName2}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border p-4 rounded-lg bg-card/20">
            <h2 className="text-2xl font-semibold mb-4 text-center">Chat 1</h2>
            {isLoading1 ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
              </div>
            ) : chatData1 ? (
              <AnalysisDashboard parsedData={chatData1} fileName={fileName1} onNewUpload={handleNewUpload1} showAskAI={false} />
            ) : (
                <FileUploadWrapper>
                    <FileUpload onFileProcessed={handleFile1Processed} />
                </FileUploadWrapper>
            )}
          </div>

          <div className="border p-4 rounded-lg bg-card/20">
            <h2 className="text-2xl font-semibold mb-4 text-center">Chat 2</h2>
            {isLoading2 ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
              </div>
            ) : chatData2 ? (
              <AnalysisDashboard parsedData={chatData2} fileName={fileName2} onNewUpload={handleNewUpload2} showAskAI={false} />
            ) : (
                <FileUploadWrapper>
                    <FileUpload onFileProcessed={handleFile2Processed} />
                </FileUploadWrapper>
            )}
          </div>
        </div>
      </div>
      <Footer showEmojiCarousel={false} />
      <FloatingActionButton onHomeClick={handleHomeClick} />
    </div>
  );
}
