"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useChatData } from "@/context/ChatDataContext";
import { AnalysisDashboard } from "@/components/chatter/AnalysisDashboard";
import Footer from "@/components/ui/Footer";
import FloatingActionButton from "@/components/ui/FloatingActionButton";
import { LoadingPage } from "@/components/ui/LoadingPage";

export default function AnalysisPage() {
  const router = useRouter();
  const { chatData, fileName, setChatData, setFileName } = useChatData();

  React.useEffect(() => {
    if (!chatData) {
      router.push('/');
    }
  }, [chatData, router]);

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
    return <LoadingPage title="Ringing the Door Bell...🔔🔔🔔" />;
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
