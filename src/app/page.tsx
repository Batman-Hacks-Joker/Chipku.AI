
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
import { LoadingPage } from "@/components/ui/LoadingPage";
import FAQ from "@/components/chatter/FAQ";
import InteractiveEmojis from "@/components/chatter/InteractiveEmojis";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const { setChatData, setFileName } = useChatData();
  const [showFaq, setShowFaq] = React.useState(false);
  const [loadingTitle, setLoadingTitle] = React.useState("Analyzing your chat...");
  const [loadingSubtitle, setLoadingSubtitle] = React.useState("Feeling stuck? Retrying might help! 🙃");

  React.useEffect(() => {
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isProcessing) {
      // Set the initial message
      setLoadingTitle("Analyzing your chat...");
      setLoadingSubtitle("Don't worry your data is safe, processing depends on your browser");
      
      // Set a timer to change the message after 5 seconds
      timer = setTimeout(() => {
        setLoadingTitle("Its your first time, preparing cookies for you 🤤🍪");
        setLoadingSubtitle("Yeah almost done!!!");
      }, 5000);
    }
    
    // Cleanup the timer if processing finishes before 5 seconds
    return () => clearTimeout(timer);
  }, [isProcessing]);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowFaq(true);
      } else {
        setShowFaq(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const handleFileProcessed = async (content: string, name: string) => {
    setIsProcessing(true);
    try {
      const data = await parseChatFile(content);
      if (data.messages.length === 0) {
        toast({
          variant: "destructive",
          title: "Parsing Error",
          description: "Could not find any valid messages in the file. Please check the format.",
        });
        setIsProcessing(false);
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
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <LoadingPage title="Ringing the door bell...🔔🔔🔔" />;
  }

  return (
    <div className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 w-full h-full z-0">
        <InteractiveEmojis />
      </div>
      {isProcessing ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
          <h1 className="text-2xl font-headline font-semibold text-primary">{loadingTitle}</h1>
          <p className="text-muted-foreground">{loadingSubtitle}</p>
        </div>
      ) : (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10 mb-16">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
              Chipku AI💕
            </h1>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              Upload your .txt WhatsApp chat to uncover fascinating insights, analyze your chat's sentiment, and even ask our AI questions about your conversations💯
            </p>
          </div>
          <FileUpload onFileProcessed={handleFileProcessed} />
          <p className="text-xs text-muted-foreground mt-4">Your data is processed on your device and never stored on our servers✌🏻</p>
        </main>
      )}
      
      <div className="flex justify-center px-4 w-full my-8 relative z-10">
        <div
          className={`w-full max-w-4xl transition-all duration-700 ease-in-out ${
            showFaq ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <FAQ />
        </div>
      </div>
      
      <Footer />
      <FloatingActionButton onHomeClick={() => {}} />
    </div>
  );
}
