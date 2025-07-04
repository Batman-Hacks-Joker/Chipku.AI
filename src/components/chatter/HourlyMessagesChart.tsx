"use client";

import * as React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import type { ChatMessage } from "@/lib/types";
import { ChartTooltipContent, ChartContainer } from "@/components/ui/chart";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface HourlyMessagesChartProps {
  messages: ChatMessage[];
  users: string[];
}

export function HourlyMessagesChart({ messages, users }: HourlyMessagesChartProps) {
  const data = React.useMemo(() => {
    const hourlyData = Array.from({ length: 24 }, (_, i) => {
      const entry: Record<string, string | number> = { hour: `${i.toString().padStart(2, '0')}:00` };
      users.forEach(user => {
        entry[user] = 0;
      });
      return entry;
    });

    messages.forEach(msg => {
      const hour = msg.timestamp.getHours();
      if (hourlyData[hour]) {
        hourlyData[hour][msg.author] = (hourlyData[hour][msg.author] as number) + 1;
      }
    });

    return hourlyData;
  }, [messages, users]);

  const chartConfig = React.useMemo(() => {
    const baseConfig: Record<string, { label: string; color?: string }> = {
      hour: {
        label: "Hour of Day",
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
        <CardHeader>
          <CardTitle className="font-headline">Hourly Distribution</CardTitle>
          <CardDescription>How chat activity is spread throughout the day.</CardDescription>
        </CardHeader>
        <div className="h-[350px] w-full flex items-center justify-center text-muted-foreground">
          No messages to analyze.
        </div>
      </>
    );
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="font-headline">Hourly Distribution</CardTitle>
        <CardDescription>How chat activity is spread throughout the day.</CardDescription>
      </CardHeader>

      {/* Applied height class */}
      <ChartContainer config={chartConfig} className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="hour"
              tickLine={false}
              fontSize={12}
              tickFormatter={(value, index) => (index % 3 === 0 ? (value as string) : "")}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Legend />
            {users.map((user, index) => (
              <Line
                key={user}
                type="monotone"
                dataKey={user}
                stroke={`hsl(var(--chart-${(index % 5) + 1}))`}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </>
  );
}
