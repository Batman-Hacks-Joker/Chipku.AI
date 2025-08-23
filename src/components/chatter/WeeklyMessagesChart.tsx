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
import { ChartContainer } from "@/components/ui/chart";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface WeeklyMessagesChartProps {
  messages: ChatMessage[];
  users: string[];
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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


export function WeeklyMessagesChart({ messages, users: allUsers }: WeeklyMessagesChartProps) {
  const { data, legendUsers, chartConfig } = React.useMemo(() => {
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
    const others = [];

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

    // 3. Process weekly data for the selected users
    const weeklyData = WEEKDAYS.map(day => {
      const entry: Record<string, string | number> = { name: day };
      usersToShow.forEach(user => {
        entry[user] = 0;
      });
      return entry;
    });
    
    messages.forEach(msg => {
      const dayOfWeek = msg.timestamp.getDay();
      const author = topUsers.includes(msg.author) ? msg.author : "Others";
      if (weeklyData[dayOfWeek] && weeklyData[dayOfWeek].hasOwnProperty(author)) {
        weeklyData[dayOfWeek][author] = (weeklyData[dayOfWeek][author] as number) + 1;
      }
    });

    // 4. Create chartConfig for colors
    const config: Record<string, { label: string; color?: string }> = {
      name: { label: "Day of Week" },
    };
    const legendUsersSorted = [...topUsers, ...(others.length > 0 ? ["Others"] : [])];
    legendUsersSorted.forEach((user, index) => {
      config[user] = {
        label: user,
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
      };
    });
    
    return { data: weeklyData, legendUsers: legendUsersSorted, chartConfig: config };

  }, [messages, allUsers]);

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

      <div className="h-[400px] w-full" id="weekly-activity">
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
              <Tooltip cursor={{fill: 'hsl(var(--muted))'}} content={<CustomTooltip />} />
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

    