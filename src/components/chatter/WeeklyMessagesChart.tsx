"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CalendarClock } from "lucide-react";
import type { ChatMessage } from "@/lib/types";
import { ChartTooltipContent, ChartContainer } from "@/components/ui/chart";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface WeeklyMessagesChartProps {
  messages: ChatMessage[];
  users: string[];
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function WeeklyMessagesChart({ messages, users }: WeeklyMessagesChartProps) {
  const data = React.useMemo(() => {
    const weeklyData = WEEKDAYS.map(day => {
      const entry: Record<string, string | number> = { name: day };
      users.forEach(user => {
        entry[user] = 0;
      });
      return entry;
    });

    messages.forEach(msg => {
      const dayOfWeek = msg.timestamp.getDay(); // 0 (Sun) to 6 (Sat)
      if (weeklyData[dayOfWeek]) {
        weeklyData[dayOfWeek][msg.author] = (weeklyData[dayOfWeek][msg.author] as number) + 1;
      }
    });

    return weeklyData;
  }, [messages, users]);

  const chartConfig = React.useMemo(() => {
    const baseConfig: Record<string, { label: string; color?: string }> = {
      name: {
        label: "Day of Week",
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

  if (!data || messages.length === 0) {
    return (
      <>
        <CardHeader className="flex flex-col items-start">
          <div className="flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-purple-600" />
            <CardTitle className="font-headline">Weekly Activity</CardTitle>
          </div>
          <CardDescription>Messages by day of the week.</CardDescription>
        </CardHeader>
        <div className="h-[250px] w-full flex items-center justify-center text-muted-foreground">
          No messages to analyze.
        </div>
      </>
    );
  }

  return (
    <>
      <CardHeader className="flex flex-col items-start">
        <div className="flex items-center gap-2 mb-1">
          <CalendarClock className="w-5 h-5 text-purple-600" />
          <CardTitle className="font-headline">Weekly Activity</CardTitle>
        </div>
        <CardDescription>Aggregated messages by day of the week.</CardDescription>
      </CardHeader>

      <div className="h-[250px] w-full">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
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
