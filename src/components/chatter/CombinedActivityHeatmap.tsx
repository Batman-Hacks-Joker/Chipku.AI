"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { ChatMessage } from "@/lib/types";

interface CombinedActivityHeatmapProps {
  messages1: ChatMessage[];
  fileName1: string;
  messages2: ChatMessage[];
  fileName2: string;
}

const HeatmapCell = ({ count1, max1, count2, max2 }: { count1: number, max1: number, count2: number, max2: number }) => {
  const intensity1 = max1 > 0 ? count1 / max1 : 0;
  const intensity2 = max2 > 0 ? count2 / max2 : 0;

  const style1 = {
    backgroundColor: `rgba(255, 0, 0, ${intensity1})`,
    clipPath: 'polygon(0 0, 100% 0, 0 100%)',
  };
  const style2 = {
    backgroundColor: `rgba(148, 0, 211, ${intensity2})`,
    clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
  };

  return (
    <div className="relative h-6 w-6 sm:h-8 sm:w-8 rounded-sm" title={`Chat 1: ${count1} messages\nChat 2: ${count2} messages`}>
      <div className="absolute inset-0" style={style1}></div>
      <div className="absolute inset-0" style={style2}></div>
    </div>
  );
};

export function CombinedActivityHeatmap({
  messages1,
  fileName1,
  messages2,
  fileName2,
}: CombinedActivityHeatmapProps) {
  const processHeatmapData = (messages: ChatMessage[]) => {
    const data = Array.from({ length: 7 }, () => Array(24).fill(0));
    messages.forEach((message) => {
      const date = new Date(message.timestamp);
      const dayOfWeek = date.getDay(); // 0 (Sunday) - 6 (Saturday)
      const hour = date.getHours();    // 0 - 23
      data[dayOfWeek][hour]++;
    });
    return data;
  };

  const heatmapData1 = processHeatmapData(messages1);
  const heatmapData2 = processHeatmapData(messages2);
  const maxMessages1 = Math.max(...heatmapData1.flat(), 1);
  const maxMessages2 = Math.max(...heatmapData2.flat(), 1);

  const getChatName = (name: string) => name.replace('WhatsApp Chat with ', '').replace('.txt', '');
  const chatName1 = getChatName(fileName1);
  const chatName2 = getChatName(fileName2);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Card className="dark:bg-transparent">
      <CardHeader>
        <CardTitle className="font-headline">Combined Activity Heatmap</CardTitle>
        <CardDescription>
          Comparing message activity for every hour of the week.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <div className="mx-auto grid grid-cols-[auto_repeat(24,_minmax(0,_1fr))] gap-px sm:gap-[2px] p-2 min-w-[55rem] text-xs justify-items-center">
            {/* Top-left corner empty cell */}
            <div></div>
            {/* Hour labels */}
            {Array.from({ length: 24 }, (_, i) => (
              <div key={`hour-${i}`} className="text-center font-semibold w-full">
                {i.toString().padStart(2, "0")}
              </div>
            ))}
            {/* Rows for each day */}
            {days.map((day, dayIndex) => (
              <React.Fragment key={day}>
                <div className="pr-2 flex items-center justify-end font-semibold text-right">{day}</div>
                {Array.from({ length: 24 }, (_, hour) => (
                  <HeatmapCell
                    key={`${dayIndex}-${hour}`}
                    count1={heatmapData1[dayIndex][hour]}
                    max1={maxMessages1}
                    count2={heatmapData2[dayIndex][hour]}
                    max2={maxMessages2}
                  />
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="p-4 flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-bold text-red-500">{chatName1}:</span>
            <span>Low</span>
            <div className="flex">
              <span className="w-3 h-3 rounded-sm bg-[rgba(255,0,0,0.1)]"></span>
              <span className="w-3 h-3 rounded-sm bg-[rgba(255,0,0,0.3)]"></span>
              <span className="w-3 h-3 rounded-sm bg-[rgba(255,0,0,0.6)]"></span>
              <span className="w-3 h-3 rounded-sm bg-[rgba(255,0,0,1)]"></span>
            </div>
            <span>High</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-purple-500">{chatName2}:</span>
            <span>Low</span>
            <div className="flex">
               <span className="w-3 h-3 rounded-sm bg-[rgba(148,0,211,0.1)]"></span>
               <span className="w-3 h-3 rounded-sm bg-[rgba(148,0,211,0.3)]"></span>
               <span className="w-3 h-3 rounded-sm bg-[rgba(148,0,211,0.6)]"></span>
               <span className="w-3 h-3 rounded-sm bg-[rgba(148,0,211,1)]"></span>
            </div>
            <span>High</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
