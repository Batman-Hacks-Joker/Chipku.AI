"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useChatData } from "@/context/ChatDataContext";
import { AnalysisDashboard } from "@/components/chatter/AnalysisDashboard";
import Footer from "@/components/ui/Footer";
import FloatingActionButton from "@/components/ui/FloatingActionButton";

export default function AnalysisPage() {
  const router = useRouter();
  const { chatData, fileName, setChatData, setFileName } = useChatData();

  const handleNewUpload = () => {
    setChatData(null);
    setFileName(null);
    router.push('/');
  };

  const resetParsedData = () => {
    setChatData(null);
    setFileName(null);
    router.push('/');
  };

  if (!chatData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
        <h1 className="text-2xl font-headline font-semibold text-primary">hmmm... Tastyyy 🤤 </h1>
      </div>
    );
  }

  return (
    <>
      <AnalysisDashboard 
        parsedData={chatData} 
        fileName={fileName}
        onNewUpload={handleNewUpload} 
      />
      <Footer />
      <FloatingActionButton onHomeClick={resetParsedData} />
    </>
  );
}
