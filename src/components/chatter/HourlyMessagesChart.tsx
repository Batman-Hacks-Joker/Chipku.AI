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
import { useMemo } from "react";
import type { ChatMessage } from "@/lib/types";
import { ChartContainer } from "@/components/ui/chart";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface HourlyMessagesChartProps {
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


export function HourlyMessagesChart({ messages, users: allUsers }: HourlyMessagesChartProps) {
  const { data, legendUsers, chartConfig } = useMemo(() => {
    if (messages.length === 0) return { data: [], legendUsers: [], chartConfig: {} };

    // 1. Calculate total messages per user to find top 10
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

    // 3. Process hourly data
    const hourlyData = Array.from({ length: 24 }, (_, i) => {
      const entry: Record<string, string | number> = { hour: `${i.toString().padStart(2, '0')}:00` };
       usersToShow.forEach(user => {
        entry[user] = 0;
      });
      return entry;
    });

    messages.forEach(msg => {
      const hour = msg.timestamp.getHours();
      const author = topUsers.includes(msg.author) ? msg.author : "Others";
      if (hourlyData[hour] && hourlyData[hour].hasOwnProperty(author)) {
        hourlyData[hour][author] = (hourlyData[hour][author] as number) + 1;
      }
    });

    // 4. Create chartConfig
    const config: Record<string, { label: string; color?: string }> = {
      hour: { label: "Hour of Day" }
    };
    const legendUsersSorted = [...topUsers, ...(others.length > 0 ? ["Others"] : [])];
    legendUsersSorted.forEach((user, index) => {
        config[user] = {
            label: user,
            color: `hsl(var(--chart-${(index % 5) + 1}))`,
        };
    });

    return { data: hourlyData, legendUsers: legendUsersSorted, chartConfig: config };

  }, [messages, allUsers]);

  if (!data || messages.length === 0) {
    return (
      <>
        <CardHeader>
          <CardTitle className="font-headline">Hourly Distribution</CardTitle>
          <CardDescription>Which person sent the most messages at what time?</CardDescription>
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
        <CardDescription>Which person sent the most messages at what time 🕓⁉️ </CardDescription>
      </CardHeader>
      <ChartContainer config={chartConfig} className="h-[350px] w-full" id="hourly-distribution">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="hour"
              tickLine={false}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value, index) => (index % 3 === 0 ? (value as string) : "")}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip cursor={{fill: 'hsl(var(--muted))'}} content={<CustomTooltip />} />
            {legendUsers.map((user) => (
              <Line
                key={user}
                type="monotone"
                dataKey={user}
                stroke={chartConfig[user]?.color}
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
