"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { addDays, startOfDay, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { Clock } from "lucide-react";
import type { ParsedChatData, ChatMessage } from "@/lib/types";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

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
import { useChatData } from "@/context/ChatDataContext";

interface AnalysisDashboardProps {
  parsedData: ParsedChatData;
  fileName: string | null;
  onNewUpload: () => void;
  showAskAI?: boolean;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ parsedData, fileName, onNewUpload, showAskAI = true }) => {
  const { toast } = useToast();
  
  const [filteredMessages, setFilteredMessages] = React.useState<ChatMessage[]>([]);
  const [date, setDate] = React.useState<DateRange | undefined>(undefined);
  
  const [isExportDialogOpen, setIsExportDialogOpen] = React.useState(false);
  const [selectedComponents, setSelectedComponents] = React.useState<string[]>([]);

  React.useEffect(() => {
    const initialDateRange = {
      from: startOfDay(parsedData.startDate!),
      to: addDays(startOfDay(parsedData.startDate!), 1),
    };
    setDate(initialDateRange);
    filterMessages(parsedData.messages, initialDateRange);
  }, [parsedData]);


  const filterMessages = (messages: ChatMessage[], dateRange: DateRange) => {
    if (!dateRange.from || !dateRange.to) {
      setFilteredMessages(messages);
      return;
    }
    const filtered = messages.filter((msg) => {
      const msgDate = new Date(msg.timestamp);
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
      const element = document.getElementById(componentName.replace(/\s+/g, '-').toLowerCase());

      if (element) {
        const canvas = await html2canvas(element, { scale: 0.8 });
        const imgData = canvas.toDataURL('image/png');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        if (yOffset + pdfHeight > pdf.internal.pageSize.getHeight() - margin) {
          pdf.addPage();
          yOffset = margin;
        }
        pdf.addImage(imgData, 'PNG', margin, yOffset, pdfWidth, pdfHeight);
        yOffset += pdfHeight + margin;
      }
    }

    const baseFileName = fileName ? fileName.replace(/.txt$/, '') : 'chat_analysis';
    pdf.save(`${baseFileName}_chipku_AI_fanatiAK💖🧿.pdf`);

    setIsExportDialogOpen(false);
  };
  
  return (
    <div className="flex flex-col min-h-screen w-full p-4 md:p-8">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary">{fileName}</h1>
          <div className="flex gap-4">
            <AlertDialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button className="bg-red-500 text-white hover:bg-red-600"> 
                  Export 🏹 
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Select Components to Export 📩</AlertDialogTitle>
                  <AlertDialogDescription>
                    Exporting takes <span style = {{color: 'white', backgroundColor: 'red', fontWeight: 'bold'}}> 10-15 seconds</span> as your file is being Compressed, {' '}
                    <span style={{ color: 'white', backgroundColor: 'red', fontWeight: 'bold' }}>more selections take a little longer, Please be patient</span> ❗❗❗
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
            <Button variant="outline" onClick={onNewUpload}>Upload 📂</Button>
          </div>
        </div>
        <p className="text-muted-foreground">so do you like, what you see 👀⁉️ </p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        <aside className="xl:col-span-3 space-y-6">
          <Card className="p-4 space-y-4 sticky top-6">
            <h2 className="font-headline text-xl font-semibold flex items-center gap-2">
<Clock className="w-5 h-5 text-purple-600" /> Timeline
</h2>
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
                <p><strong>First Message:</strong> {format(new Date(parsedData.startDate!), "PPP")}</p>
                <p><strong>Last Message:</strong> {format(new Date(parsedData.endDate!), "PPP")}</p>
            </div>
          </Card>
          {showAskAI && <AskAI messages={filteredMessages} dateRange={date} />}
        </aside>

        <main className="xl:col-span-9 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Messages 💬 " value={stats.totalMessages.toLocaleString()} />
            <StatCard title="Total Words ✍️ " value={stats.totalWords.toLocaleString()} />
            <StatCard title="Active Users 🙋‍♂️ " value={parsedData.users.length} />
             <StatCard title="Days Analyzed 🧐 " value={date?.from && date?.to ? (Math.round((date.to.getTime() - date.from.getTime()) / (1000 * 3600 * 24)) + 1) : 0} />
          </div>

          <ChipkuMeter messages={filteredMessages} dateRange={date} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-4" id="messages-per-user-chart"><MessagesPerUserChart messages={filteredMessages} users={parsedData.users} /></Card>
            <Card className="p-4" id="weekly-messages-chart"><WeeklyMessagesChart messages={filteredMessages} users={parsedData.users} /></Card>
          </div>
           <Card className="p-4" id="daily-messages-chart"> <DailyMessagesChart messages={filteredMessages} dateRange={date} users={parsedData.users} /></Card>
 <Card className="p-4" id="hourly-messages-chart"><HourlyMessagesChart messages={filteredMessages} users={parsedData.users} /></Card>
           <Card className="p-4" id="message-heatmap"><MessageHeatmap messages={filteredMessages} users={parsedData.users} /></Card>
<Card className="p-4" id="top-emojis-per-user"><TopEmojisPerUser messages={filteredMessages} users={parsedData.users} /></Card>
           <Card className="p-4" id="top-longest-messages"><TopLongestMessages messages={filteredMessages} users={parsedData.users} /></Card>
 <Card className="p-4" id="top-words-by-user"><TopWordsByUser messages={filteredMessages} users={parsedData.users} /></Card>
           <Card className="p-4" id="random-message-per-user"><RandomMessagePerUser messages={filteredMessages} users={parsedData.users} /></Card>
        </main>
      </div>
    </div>
  );
};
