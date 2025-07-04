"use client";

import * as React from "react";
import { addDays, startOfDay, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";

import type { ParsedChatData, ChatMessage } from "@/lib/types";
import { parseChatFile } from "@/lib/chat-parser";

import { cn } from "@/lib/utils";
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
import { TopLongestMessages } from "@/components/chatter/TopLongestMessages";

export default function Home() {
  const { toast } = useToast();
  const [parsedData, setParsedData] = React.useState<ParsedChatData | null>(null);
  const [filteredMessages, setFilteredMessages] = React.useState<ChatMessage[]>([]);
  const [date, setDate] = React.useState<DateRange | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState(false);
  const [fileName, setFileName] = React.useState<string>("");

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
          <Button
            variant="outline"
            onClick={() => setParsedData(null)}
          >
            Choose Another File</Button>
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
            <Card className="p-4"><MessagesPerUserChart messages={filteredMessages} users={parsedData.users} /></Card>
            <Card className="p-4"><WeeklyMessagesChart messages={filteredMessages} users={parsedData.users} /></Card>
          </div>
           <Card className="p-4"> <DailyMessagesChart messages={filteredMessages} dateRange={date} users={parsedData.users} /></Card>
           <Card className="p-4"><HourlyMessagesChart messages={filteredMessages} users={parsedData.users} /></Card>
           <Card className="p-4"><MessageHeatmap messages={filteredMessages} users={parsedData.users} /></Card>
           <Card className="p-4"><TopLongestMessages messages={filteredMessages} users={parsedData.users} /></Card>
           <Card className="p-4"><TopWordsByUser messages={filteredMessages} users={parsedData.users} /></Card>
           <Card className="p-4"><RandomMessagePerUser messages={filteredMessages} users={parsedData.users} /></Card>
        </main>
      </div>
    </div>
  );
}
