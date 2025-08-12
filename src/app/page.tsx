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

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const { setChatData, setFileName } = useChatData();
  const [showFaq, setShowFaq] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // FIX 1: Updated scroll handler to show/hide the FAQ section.
  React.useEffect(() => {
    const handleScroll = () => {
      // Toggle FAQ visibility based on scroll position
      if (window.scrollY > 50) {
        setShowFaq(true);
      } else {
        setShowFaq(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // Empty dependency array ensures this runs only on mount and unmount.


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
    <div className="relative overflow-hidden">
      <InteractiveEmojis />
      {isProcessing ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
          <h1 className="text-2xl font-headline font-semibold text-primary">Analyzing your chat...</h1>
          {/* FIX 2: Improved grammar in UI text */}
          <p className="text-muted-foreground">Feeling stuck? Retrying might help! 🙃</p>
        </div>
      ) : (
        // FIX 3: Replaced the spacer div with a bottom margin (mb-16) for cleaner code.
        <main className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10 mb-16">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
              Chipku AI💕
            </h1>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              {/* FIX 2: Improved grammar in UI text */}
              Upload your .txt WhatsApp chat to uncover fascinating insights, analyze your chat's sentiment, and even ask our AI questions about your conversations💯
            </p>
          </div>
          <FileUpload onFileProcessed={handleFileProcessed} />
          <p className="text-xs text-muted-foreground mt-4">Your data is processed on your device and never stored on our servers✌🏻</p>
        </main>
      )}

      {/* This section now correctly appears and disappears on scroll */}
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
      {/* FIX 4: Replaced verbose handler with a concise inline function. */}
      <FloatingActionButton onHomeClick={() => {}} />
    </div>
  );
}