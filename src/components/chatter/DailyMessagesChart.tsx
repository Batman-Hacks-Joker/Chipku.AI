"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format, eachDayOfInterval, startOfDay } from 'date-fns';
import { DateRange } from "react-day-picker";
import { ChartTooltipContent, ChartContainer, ChartConfig } from "@/components/ui/chart";

import type { ChatMessage } from "@/lib/types";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface DailyMessagesChartProps {
  messages: ChatMessage[];
  dateRange?: DateRange;
  users: string[];
}

export function DailyMessagesChart({ messages, dateRange, users }: DailyMessagesChartProps) {
  const data = React.useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return [];

    const days = eachDayOfInterval({ start: dateRange.from, end: dateRange.to });
    const userColors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

    const chartData = days.map(day => {
      const dayData: Record<string, string | number> = {
        date: format(day, "MMM d"),
      };
      users.forEach(user => {
        dayData[user] = 0;
      });
      return dayData;
    });

    const dateMap = new Map(chartData.map((d, i) => [format(days[i], 'yyyy-MM-dd'), d]));

    messages.forEach(msg => {
        const dayKey = format(startOfDay(msg.timestamp), 'yyyy-MM-dd');
        const dayData = dateMap.get(dayKey);
        if (dayData) {
            dayData[msg.author] = (dayData[msg.author] as number) + 1;
        }
    });

    return Array.from(dateMap.values());

  }, [messages, dateRange, users]);

  const chartConfig = React.useMemo(() => {
    const baseConfig: ChartConfig = {
      date: {
        label: "Date",
      },
    };

    users.forEach((user, index) => {
      baseConfig[user] = {
        label: user,
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
      };
    });

    return baseConfig;
  }, [users]);


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
        <CardDescription>Total messages sent each day. Hover over bars for details.</CardDescription>
      </CardHeader>
      <div className="w-full h-[350px]"> {/* Keep this div to manage the overall height and width for ChartContainer */}
        <ChartContainer config={chartConfig} className="w-full h-full"> {/* Make ChartContainer fill the parent div */}
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              {users.map((user, index) => (
                <Bar
                  key={user}
                  dataKey={user}
                  stackId="a"
                  fill={`hsl(var(--chart-${(index % 5) + 1}))`}
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
