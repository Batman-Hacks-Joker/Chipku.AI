"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { parseChatFile } from "@/lib/chat-parser";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/chatter/FileUpload";
import Footer from "@/components/ui/Footer";
import { useChatData } from "@/context/ChatDataContext";
import FloatingActionButton from "@/components/ui/FloatingActionButton";

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const { setChatData, setFileName } = useChatData();

  const handleFileProcessed = async (content: string, name: string) => {
    setIsLoading(true);
    try {
      const data = await parseChatFile(content);
      if (data.messages.length === 0) {
        toast({
          variant: "destructive",
          title: "Parsing Error",
          description: "Could not find any valid messages in the file. Please check the format.",
        });
        setIsLoading(false);
        return;
      }

      setChatData(data);
      setFileName(name);

      router.push('/analysis');

    } catch (error) {
      console.error("Failed to parse chat file:", error);
      toast({
        variant: "destructive",
        title: "File Error",
        description: "There was an error processing your file. Please ensure it's a valid chat log.",
      });
      setIsLoading(false);
    }
  };

  const handleHomeClick = () => {
    // Since this is the home page, this function can be empty
    // or you can add any specific logic you want to happen
    // when the home button on the FAB is clicked from the home page.
  };

  return (
    <>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
          <h1 className="text-2xl font-headline font-semibold text-primary">Analyzing your chat...</h1>
          <p className="text-muted-foreground">Feeling stuck? retry it will work 🙃</p>
        </div>
      ) : (
        <main className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
              Chipku AI💕
            </h1>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              Upload your .txt Whatsapp chat to uncover fascinating insights, analyze your chat Sentiments, and even ask our AI questions about your conversations💯
            </p>
          </div>
          <FileUpload onFileProcessed={handleFileProcessed} />
          <p className="text-xs text-muted-foreground mt-4">Your data is processed on your device and never stored on our servers✌🏻</p>
        </main>
      )}
      <Footer />
      <FloatingActionButton onHomeClick={handleHomeClick} />
    </>
  );
}
