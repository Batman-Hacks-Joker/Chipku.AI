"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { addDays, startOfDay, format, isSameDay, endOfDay } from "date-fns";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
  const [isFullTimeline, setIsFullTimeline] = React.useState(false);
  
  const [isExportDialogOpen, setIsExportDialogOpen] = React.useState(false);
  const [selectedComponents, setSelectedComponents] = React.useState<string[]>([]);

  const defaultDateRange = React.useMemo(() => {
    if (!parsedData.startDate) return undefined;
    return {
      from: startOfDay(parsedData.startDate),
      to: addDays(startOfDay(parsedData.startDate), 1),
    }
  },[parsedData.startDate]);

  React.useEffect(() => {
    // Set default date range on initial load
    if (parsedData.startDate && parsedData.endDate) {
      const defaultRange = { from: parsedData.startDate, to: parsedData.endDate };
      setDate(defaultRange);
      filterMessages(parsedData.messages, defaultRange);
      setIsFullTimeline(true);
    }
  }, [parsedData]);


  React.useEffect(() => {
    if (date?.from && date?.to && parsedData.startDate && parsedData.endDate) {
      const isDateRangeFull = isSameDay(date.from, parsedData.startDate) && isSameDay(date.to, parsedData.endDate);
      setIsFullTimeline(isDateRangeFull);
    } else {
      setIsFullTimeline(false);
    }
  }, [date, parsedData.startDate, parsedData.endDate]);

  const filterMessages = (messages: ChatMessage[], dateRange: DateRange) => {
    if (!dateRange.from || !dateRange.to) {
      setFilteredMessages(messages);
      return;
    }
    const from = startOfDay(dateRange.from);
    const to = endOfDay(dateRange.to);

    const filtered = messages.filter((msg) => {
      const msgDate = new Date(msg.timestamp);
      return msgDate >= from && msgDate <= to;
    });
    setFilteredMessages(filtered);
  };

  const handleApplyClick = () => {
    if (parsedData && date) {
      const rangeToFilter = date.from && !date.to ? { from: date.from, to: date.from } : date;
      filterMessages(parsedData.messages, rangeToFilter as DateRange);
      toast({
        title: "Date Range Updated",
        description: `Analysis updated for the new date range.`,
      });
    }
  };

  const handleFullTimelineToggle = (checked: boolean) => {
    setIsFullTimeline(checked);
    if(checked) {
      setDate({ from: parsedData.startDate!, to: parsedData.endDate! });
    } else {
      setDate(defaultDateRange);
    }
  }

  const stats = React.useMemo(() => {
    if (!filteredMessages) return { totalMessages: 0, totalWords: 0 };
    return {
      totalMessages: filteredMessages.length,
      totalWords: filteredMessages.reduce((sum, msg) => sum + msg.wordCount, 0),
    };
  }, [filteredMessages]);

  const componentsToExport = React.useMemo(() => {
    const componentMap = {
      'Messages per User': <MessagesPerUserChart messages={filteredMessages} users={parsedData?.users || []} />,
      'Weekly Activity': <WeeklyMessagesChart messages={filteredMessages} users={parsedData?.users || []} />,
      'Daily Messages': <DailyMessagesChart messages={filteredMessages} users={parsedData?.users || []} />,
      'Hourly Distribution': <HourlyMessagesChart messages={filteredMessages} users={parsedData?.users || []} />,
      'Message Heatmap': <MessageHeatmap messages={filteredMessages} />,
      'Top Emojis Per User': <TopEmojisPerUser messages={filteredMessages} users={parsedData?.users || []} />,
      'Top 5 Longest Messages Per User': <TopLongestMessages messages={filteredMessages} users={parsedData?.users || []} />,
      'Top 15 Most Common Words by User': <TopWordsByUser messages={filteredMessages} users={parsedData?.users || []} />,
    };
    return componentMap;
  }, [stats, parsedData, filteredMessages, date]);

  const handleExportPDF = async () => {
    const pdf = new jsPDF('portrait', 'pt', 'a4');
    const margin = 20;
    let yOffset = margin;

    // Add a title to the PDF
    pdf.setFontSize(22);
    pdf.text(fileName ? fileName.replace(/.txt$/, '') : 'Chat Analysis', pdf.internal.pageSize.getWidth() / 2, yOffset, { align: 'center' });
    yOffset += 40;
    
    // Add date range to the PDF
    pdf.setFontSize(12);
    if(date?.from && date?.to) {
        pdf.text(`Date Range: ${format(date.from, "PPP")} - ${format(date.to, "PPP")}`, margin, yOffset);
        yOffset += 20;
    }

    for (const componentName of selectedComponents) {
      const element = document.getElementById(componentName.replace(/\s+/g, '-').toLowerCase());

      if (element) {
        const canvas = await html2canvas(element, { scale: 1 });
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
    pdf.save(`${baseFileName}_Chipku_AI_fanatiAK❤️🧿.pdf`);

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
                    disabled={(day) => {
                      if (!parsedData.startDate || !parsedData.endDate) return true;
                      return day < startOfDay(parsedData.startDate) || day > endOfDay(parsedData.endDate)
                    }}
                  />
                </PopoverContent>
              </Popover>
              <div className="flex items-center space-x-2 pt-2">
                <Switch 
                  id="full-timeline-toggle" 
                  checked={isFullTimeline}
                  onCheckedChange={handleFullTimelineToggle}
                />
                <Label htmlFor="full-timeline-toggle">Full Timeline</Label>
              </div>
            </div>
            <Button onClick={handleApplyClick} className="w-full bg-accent hover:bg-accent/90">Apply Changes</Button>
            <div className="text-xs text-muted-foreground space-y-1 pt-2">
              {parsedData.startDate && <p><strong>First Message:</strong> {format(new Date(parsedData.startDate), "PPP")}</p>}
              {parsedData.endDate && <p><strong>Last Message:</strong> {format(new Date(parsedData.endDate), "PPP")}</p>}
            </div>
          </Card>
          {showAskAI && <AskAI messages={filteredMessages} dateRange={date} />}
        </aside>
        <main className="xl:col-span-9 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Messages 💬 " value={stats.totalMessages.toLocaleString()} />
            <StatCard title="Total Words ✍️ " value={stats.totalWords.toLocaleString()} />
            <StatCard title="Active Users 🙋‍♂️ " value={parsedData.users.length} />
             <StatCard title="Days Analyzed 🧐 " value={date?.from && date?.to ? (Math.ceil((endOfDay(date.to).getTime() - startOfDay(date.from).getTime()) / (1000 * 3600 * 24))) : date?.from ? 1: 0} />
          </div>

          <ChipkuMeter messages={filteredMessages} dateRange={date} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div id="messages-per-user" className="rounded-lg border bg-card text-card-foreground shadow-sm p-4"><MessagesPerUserChart messages={filteredMessages} users={parsedData.users} /></div>
            <div id="weekly-activity" className="rounded-lg border bg-card text-card-foreground shadow-sm p-4"><WeeklyMessagesChart messages={filteredMessages} users={parsedData.users} /></div>
          </div>
           <Card className="p-4" id="daily-messages"> <DailyMessagesChart messages={filteredMessages} users={parsedData.users} /></Card>
           <Card className="p-4" id="hourly-distribution"><HourlyMessagesChart messages={filteredMessages} users={parsedData.users} /></Card>
           <div id="message-heatmap"><MessageHeatmap messages={filteredMessages} /></div>
           <div id="top-emojis-per-user"><TopEmojisPerUser messages={filteredMessages} users={parsedData.users} /></div>
           <div id="top-5-longest-messages-per-user"><TopLongestMessages messages={filteredMessages} users={parsedData.users} /></div>
           <div id="top-15-most-common-words-by-user"><TopWordsByUser messages={filteredMessages} users={parsedData.users} /></div>
           <div id="random-message-per-user"><RandomMessagePerUser messages={filteredMessages} /></div>
        </main>
      </div>
    </div>
  );
};
