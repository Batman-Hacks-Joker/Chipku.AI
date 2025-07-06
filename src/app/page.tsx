"use client";

import * as React from "react";
import { addDays, startOfDay, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";

import type { ParsedChatData, ChatMessage } from "@/lib/types";

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { parseChatFile } from "@/lib/chat-parser";

import { cn, getComponentNames } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

import { FileUpload } from "@/components/chatter/FileUpload";
import { StatCard } from "@/components/chatter/StatCard";
import { ChipkuMeter } from "@/components/chatter/ChipkuMeter";
import { AskAI } from "@/components/chatter/AskAI";
import { MessagesPerUserChart } from "@/components/chatter/MessagesPerUserChart";
import { DailyMessagesChart } from "@/components/chatter/DailyMessagesChart";
import { WeeklyMessagesChart } from "@/components/chatter/WeeklyMessagesChart";
import { HourlyMessagesChart } from "@/components/chatter/HourlyMessagesChart";
import { MessageHeatmap } from "@/components/chatter/MessageHeatmap";
import { RandomMessagePerUser } from "@/components/chatter/RandomMessagePerUser";
import { TopWordsByUser } from "@/components/chatter/TopWordsByUser";
import { TopEmojisPerUser } from "@/components/chatter/TopEmojisPerUser";
import { TopLongestMessages } from "@/components/chatter/TopLongestMessages";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
export default function Home() {
  const { toast } = useToast();
  const [parsedData, setParsedData] = React.useState<ParsedChatData | null>(null);
  const [filteredMessages, setFilteredMessages] = React.useState<ChatMessage[]>([]);
  const [date, setDate] = React.useState<DateRange | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState(false);
  const [fileName, setFileName] = React.useState<string>("");

  const [isExportDialogOpen, setIsExportDialogOpen] = React.useState(false);
  const [selectedComponents, setSelectedComponents] = React.useState<string[]>([]);
  const handleFileProcessed = async (content: string, name: string) => {
    setIsLoading(true);
    setFileName(name);
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
      setParsedData(data);
      const initialDateRange = {
        from: startOfDay(data.startDate!),
        to: addDays(startOfDay(data.startDate!), 1),
      };
      setDate(initialDateRange);
      filterMessages(data.messages, initialDateRange);
    } catch (error) {
      console.error("Failed to parse chat file:", error);
      toast({
        variant: "destructive",
        title: "File Error",
        description: "There was an error processing your file. Please ensure it's a valid chat log.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterMessages = (messages: ChatMessage[], dateRange: DateRange) => {
    if (!dateRange.from || !dateRange.to) {
      setFilteredMessages(messages);
      return;
    }
    const filtered = messages.filter((msg) => {
      const msgDate = msg.timestamp;
      return msgDate >= dateRange.from! && msgDate <= dateRange.to!;
    });
    setFilteredMessages(filtered);
  };

  const handleApplyClick = () => {
    if (parsedData && date) {
      filterMessages(parsedData.messages, date);
       toast({
        title: "Date Range Updated",
        description: `Analysis updated for the new date range.`,
      });
    }
  };

  const stats = React.useMemo(() => {
    if (!filteredMessages) return { totalMessages: 0, totalWords: 0 };
    return {
      totalMessages: filteredMessages.length,
      totalWords: filteredMessages.reduce((sum, msg) => sum + msg.wordCount, 0),
    };
  }, [filteredMessages]);

  const componentsToExport = React.useMemo(() => {
    const componentMap = {
      'Total Messages': <StatCard title="Total Messages" value={stats.totalMessages.toLocaleString()} />,
      'Total Words': <StatCard title="Total Words" value={stats.totalWords.toLocaleString()} />,
      'Active Users': <StatCard title="Active Users" value={parsedData?.users.length} />,
      'Days Analyzed': <StatCard title="Days Analyzed" value={date?.from && date?.to ? (Math.round((date.to.getTime() - date.from.getTime()) / (1000 * 3600 * 24)) + 1) : 0} />,
      'Messages Per User Chart': <MessagesPerUserChart messages={filteredMessages} users={parsedData?.users || []} />,
      'Weekly Messages Chart': <WeeklyMessagesChart messages={filteredMessages} users={parsedData?.users || []} />,
      'Daily Messages Chart': <DailyMessagesChart messages={filteredMessages} dateRange={date} users={parsedData?.users || []} />,
      'Hourly Messages Chart': <HourlyMessagesChart messages={filteredMessages} users={parsedData?.users || []} />,
      'Message Heatmap': <MessageHeatmap messages={filteredMessages} users={parsedData?.users || []} />,
      'Top Emojis Per User': <TopEmojisPerUser messages={filteredMessages} users={parsedData?.users || []} />,
      'Top Longest Messages': <TopLongestMessages messages={filteredMessages} users={parsedData?.users || []} />,
      'Top Words By User': <TopWordsByUser messages={filteredMessages} users={parsedData?.users || []} />,
      'Random Message Per User': <RandomMessagePerUser messages={filteredMessages} users={parsedData?.users || []} />,
    };
    return componentMap;
  }, [stats, parsedData, filteredMessages, date]);

  const handleExportPDF = async () => {
    const pdf = new jsPDF('portrait', 'pt', 'a4');
    const margin = 20;
    let yOffset = margin;

    for (const componentName of selectedComponents) {
      // Find the element corresponding to the component name.
      // You'll need to add IDs or refs to your component elements to easily select them.
      // For now, this is a placeholder and needs to be replaced with actual element selection.
      const element = document.getElementById(componentName.replace(/\s+/g, '-').toLowerCase());

      if (element) {
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL('image/png');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        if (yOffset + pdfHeight > pdf.internal.pageSize.getHeight() - margin) {
          pdf.addPage();
          yOffset = margin;
        }
        pdf.addImage(imgData, 'PNG', margin, yOffset, pdfWidth, pdfHeight);
        yOffset += pdfHeight + margin; // Add some space between components
      }
    }

    pdf.save(`${fileName}_chatter_insights.pdf`);
    setIsExportDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
        <h1 className="text-2xl font-headline font-semibold text-primary">Analyzing your chat...</h1>
        <p className="text-muted-foreground">This might take a moment.</p>
      </div>
    );
  }

  if (!parsedData) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
            Chatter Insights
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Upload your .txt chat log to uncover fascinating insights, analyze trends, and even ask our AI questions about your conversations.
          </p>
        </div>
        <FileUpload onFileProcessed={handleFileProcessed} />
        <p className="text-xs text-muted-foreground mt-4">Your data is processed on your device and never stored on our servers.</p>
      </main>
    );
  }

  return (
    <div className="min-h-screen w-full p-4 md:p-8">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary">{fileName}</h1>
          <div className="flex gap-4">
            <AlertDialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="hover:bg-red-100 hover:text-red-600 transition-colors">
                  Export
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Select Components to Export</AlertDialogTitle>
                  <AlertDialogDescription>
                    Choose which sections of the analysis you want to include in the PDF export.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="grid grid-cols-2 gap-4 max-h-60 overflow-y-auto">
                  {Object.keys(componentsToExport).map((componentName) => (
                    <div key={componentName} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
 id={`export-${componentName.replace(/\s+/g, '-').toLowerCase()}`}
                        checked={selectedComponents.includes(componentName)}
 onChange={(e) => {
                          setSelectedComponents((prev) =>
 e.target.checked
 ? [...prev, componentName]
 : prev.filter(
                                  (name) => name !== componentName
                                )
                          );
                        }}
                        className="form-checkbox h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                      />
                      <label
                        htmlFor={componentName.replace(/\s+/g, '-').toLowerCase()}
 className="text-sm font-medium leading-none cursor-pointer"
                      >
                        {componentName}
                      </label>
                    </div>
                  ))}
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setIsExportDialogOpen(false)}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleExportPDF} >Export Selected</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button variant="outline" onClick={() => setParsedData(null)}>Choose Another File</Button>
          </div>
        </div>
        <p className="text-muted-foreground">Displaying insights for the selected date range.</p>
      </header>
      
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        <aside className="xl:col-span-3 space-y-6">
          <Card className="p-4 space-y-4 sticky top-6">
            <h2 className="font-headline text-lg font-semibold">Controls</h2>
            <div className="grid gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                    disabled={(day) => day < parsedData.startDate! || day > parsedData.endDate!}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button onClick={handleApplyClick} className="w-full bg-accent hover:bg-accent/90">Apply Changes</Button>
            <div className="text-xs text-muted-foreground space-y-1 pt-2">
                <p><strong>First Message:</strong> {format(parsedData.startDate!, "PPP")}</p>
                <p><strong>Last Message:</strong> {format(parsedData.endDate!, "PPP")}</p>
            </div>
          </Card>
          <AskAI messages={filteredMessages} dateRange={date} />
        </aside>

        <main className="xl:col-span-9 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Messages" value={stats.totalMessages.toLocaleString()} />
            <StatCard title="Total Words" value={stats.totalWords.toLocaleString()} />
            <StatCard title="Active Users" value={parsedData.users.length} />
             <StatCard title="Days Analyzed" value={date?.from && date?.to ? (Math.round((date.to.getTime() - date.from.getTime()) / (1000 * 3600 * 24)) + 1) : 0} />
          </div>
          
          <ChipkuMeter messages={filteredMessages} dateRange={date} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-4" id="messages-per-user-chart"><MessagesPerUserChart messages={filteredMessages} users={parsedData.users} /></Card> {/* Added ID */}
            <Card className="p-4" id="weekly-messages-chart"><WeeklyMessagesChart messages={filteredMessages} users={parsedData.users} /></Card> {/* Added ID */}
          </div>
           <Card className="p-4" id="daily-messages-chart"> <DailyMessagesChart messages={filteredMessages} dateRange={date} users={parsedData.users} /></Card> {/* Added ID */}
 <Card className="p-4" id="hourly-messages-chart"><HourlyMessagesChart messages={filteredMessages} users={parsedData.users} /></Card> {/* Added ID */}
           <Card className="p-4" id="message-heatmap"><MessageHeatmap messages={filteredMessages} users={parsedData.users} /></Card> {/* Added ID */}
<Card className="p-4" id="top-emojis-per-user"><TopEmojisPerUser messages={filteredMessages} users={parsedData.users} /></Card> {/* Added ID */}
           <Card className="p-4" id="top-longest-messages"><TopLongestMessages messages={filteredMessages} users={parsedData.users} /></Card> {/* Added ID */}
 <Card className="p-4" id="top-words-by-user"><TopWordsByUser messages={filteredMessages} users={parsedData.users} /></Card> {/* Added ID */}
           <Card className="p-4" id="random-message-per-user"><RandomMessagePerUser messages={filteredMessages} users={parsedData.users} /></Card> {/* Added ID */}
        </main>
      </div>
    </div>
  );
}
