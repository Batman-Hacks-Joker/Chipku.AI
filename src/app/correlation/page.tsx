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

export default function CorrelationPage() {
  const { toast } = useToast();
  const router = useRouter();

  const [chatData1, setChatData1] = React.useState<ParsedChatData | null>(null);
  const [fileName1, setFileName1] = React.useState<string | null>(null);
  const [isLoading1, setIsLoading1] = React.useState(false);

  const [chatData2, setChatData2] = React.useState<ParsedChatData | null>(null);
  const [fileName2, setFileName2] = React.useState<string | null>(null);
  const [isLoading2, setIsLoading2] = React.useState(false);

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

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center my-8">Correlation Analysis</h1>
        
        {chatData1 && chatData2 && (
          <div className="mb-8">
            <CombinedHourlyMessagesChart 
              messages1={chatData1.messages}
              messages2={chatData2.messages}
              users1={chatData1.users}
              users2={chatData2.users}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Chat 1 Section */}
          <div className="border p-4 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-center">Chat 1</h2>
            {isLoading1 ? (
              <div className="flex justify-center items-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
              </div>
            ) : chatData1 ? (
              <AnalysisDashboard parsedData={chatData1} fileName={fileName1} onNewUpload={handleNewUpload1} showAskAI={false} />
            ) : (
              <FileUpload onFileProcessed={handleFile1Processed} />
            )}
          </div>

          {/* Chat 2 Section */}
          <div className="border p-4 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-center">Chat 2</h2>
            {isLoading2 ? (
              <div className="flex justify-center items-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
              </div>
            ) : chatData2 ? (
              <AnalysisDashboard parsedData={chatData2} fileName={fileName2} onNewUpload={handleNewUpload2} showAskAI={false} />
            ) : (
              <FileUpload onFileProcessed={handleFile2Processed} />
            )}
          </div>
        </div>
      </div>
      <Footer />
      <FloatingActionButton onHomeClick={handleHomeClick} />
    </>
  );
}
