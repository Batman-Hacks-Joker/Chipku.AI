"use client";

import React, { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { format, eachDayOfInterval, startOfDay } from 'date-fns';
import { DateRange } from "react-day-picker";
import { ChartTooltipContent, ChartContainer, ChartConfig } from "@/components/ui/chart";
import { Calendar } from "lucide-react";

import type { ChatMessage } from "@/lib/types";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface DailyMessagesChartProps {
  messages: ChatMessage[];
  users: string[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const filteredPayload = payload.filter((p: any) => p.value > 0);
        if (filteredPayload.length === 0) return null;

        return (
            <div className="p-1.5 bg-background border rounded-md shadow-lg text-xs min-w-[120px]">
                <p className="font-bold mb-1">{label}</p>
                <ul className="space-y-0.5">
                    {filteredPayload.map((entry: any, index: number) => (
                        <li key={`item-${index}`} className="flex items-center justify-between">
                           <div className="flex items-center">
                             <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
                             <span className="text-foreground/80 font-medium">{entry.name}</span>
                           </div>
                           <span className="font-bold text-foreground">{entry.value.toLocaleString()}</span>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
    return null;
};

export function DailyMessagesChart({ messages, users: allUsers }: DailyMessagesChartProps) {
  const { data, legendUsers, chartConfig } = useMemo(() => {
    if (messages.length === 0) return { data: [], legendUsers: [], chartConfig: {} };

    // 1. Calculate total messages per user
    const userMessageCounts = allUsers.reduce((acc, user) => {
      acc[user] = 0;
      return acc;
    }, {} as Record<string, number>);

    messages.forEach((message) => {
      if (userMessageCounts.hasOwnProperty(message.author)) {
        userMessageCounts[message.author]++;
      }
    });

    const sortedUsers = Object.entries(userMessageCounts).filter(([,count]) => count > 0).sort(([, a], [, b]) => b - a);

    // 2. Determine top 10 users and group others
    let topUsers: string[];
    const others: string[] = [];

    if (sortedUsers.length > 10) {
      const tenthValue = sortedUsers[9][1];
      let cutOffIndex = sortedUsers.findIndex(u => u[1] < tenthValue);
      if (cutOffIndex === -1) cutOffIndex = sortedUsers.length;
      if (cutOffIndex < 10) cutOffIndex = 10;
      
      topUsers = sortedUsers.slice(0, cutOffIndex).map(([user]) => user);
      others.push(...sortedUsers.slice(cutOffIndex).map(([user]) => user));
    } else {
      topUsers = sortedUsers.map(([user]) => user);
    }
    
    const usersToShow = [...topUsers];
    if (others.length > 0) {
      usersToShow.push("Others");
    }

    // 3. Process daily data
    const minDate = messages.reduce((min, msg) => (msg.timestamp < min ? msg.timestamp : min), messages[0].timestamp);
    const maxDate = messages.reduce((max, msg) => (msg.timestamp > max ? msg.timestamp : max), messages[0].timestamp);
    const days = eachDayOfInterval({ start: startOfDay(minDate), end: startOfDay(maxDate) });

    const dateMap = new Map(days.map(day => {
        const dayData: Record<string, string | number> = { date: format(day, "MMM d") };
        usersToShow.forEach(user => { dayData[user] = 0; });
        return [format(day, 'yyyy-MM-dd'), dayData];
    }));

    messages.forEach(msg => {
      const dayKey = format(startOfDay(msg.timestamp), 'yyyy-MM-dd');
      const dayData = dateMap.get(dayKey);
      if (dayData) {
        const author = topUsers.includes(msg.author) ? msg.author : "Others";
        dayData[author] = (dayData[author] as number) + 1;
      }
    });

    const finalData = Array.from(dateMap.values());

    // 4. Create chartConfig for colors
    const config: ChartConfig = {
      date: { label: "Date" },
    };
    const legendUsersSorted = [...topUsers, ...(others.length > 0 ? ["Others"] : [])];
    legendUsersSorted.forEach((user, index) => {
      config[user] = {
        label: user,
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
      };
    });
    
    return { data: finalData, legendUsers: legendUsersSorted, chartConfig: config };

  }, [messages, allUsers]);

  const renderLegend = (props: any) => {
    const { payload } = props;
    if (!payload || payload.length === 0) return null;

    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-4 text-xs">
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground truncate">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  if (!data || data.length === 0) {
     return (
        <>
            <CardHeader>
                <CardTitle className="font-headline">Daily Messages</CardTitle>
                <CardDescription>Total messages sent each day.</CardDescription>
            </CardHeader>
            <div className="h-[350px] w-full flex items-center justify-center text-muted-foreground">
                No messages in this date range.
            </div>
        </>
     )
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="font-headline">Daily Messages</CardTitle>
        <CardDescription>Who sent most messages over the Chat timeline 📆 </CardDescription>
      </CardHeader>
      <div className="w-full h-[500px]" id="daily-messages">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                cursor={false}
                content={<CustomTooltip />}
              />
              <Legend content={renderLegend} />
              {legendUsers.map((user) => (
                <Bar
                  key={user}
                  dataKey={user}
                  stackId="a"
                  fill={chartConfig[user]?.color}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </>
  );
}
