"use client";

import * as React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users } from "lucide-react";

import type { ChatMessage } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface MessagesPerUserChartProps {
  messages: ChatMessage[];
  users: string[];
}

const COLORS = [
  "#c155d1",
  "#e64444",
  "#50e991",
  "#e6d800",
  "#9b19f5",
  "#ffa300",
  "#dc0ab4",
  "#b3d4ff",
  "#00bfa0",
  "#4421af",
];
const OTHERS_COLOR = "#ff99c8";

export function MessagesPerUserChart({
  messages,
  users,
}: MessagesPerUserChartProps) {
  const { chartData, legendData } = React.useMemo(() => {
    const userMessageCounts = users.reduce((acc, user) => {
      acc[user] = 0;
      return acc;
    }, {} as Record<string, number>);

    messages.forEach((message) => {
      if (userMessageCounts.hasOwnProperty(message.author)) {
        userMessageCounts[message.author]++;
      }
    });

    const sortedUsers = Object.entries(userMessageCounts)
      .sort(([, a], [, b]) => b - a);

    let topUsers;
    let othersCount = 0;

    if (sortedUsers.length > 10) {
      const tenthValue = sortedUsers[9][1];
      let cutOffIndex = sortedUsers.findIndex(u => u[1] < tenthValue);
      if (cutOffIndex === -1) cutOffIndex = sortedUsers.length; // all have same value
      if (cutOffIndex < 10) cutOffIndex = 10;
      
      topUsers = sortedUsers.slice(0, cutOffIndex);
      const others = sortedUsers.slice(cutOffIndex);
      othersCount = others.reduce((sum, [, count]) => sum + count, 0);
    } else {
      topUsers = sortedUsers;
    }

    const finalChartData = topUsers.map(([name, value]) => ({ name, value }));

    if (othersCount > 0) {
      finalChartData.push({ name: "Others", value: othersCount });
    }
    
    const legendItems = [...finalChartData];
    const othersItem = legendItems.find(item => item.name === 'Others');
    const regularItems = legendItems.filter(item => item.name !== 'Others');

    return {
      chartData: finalChartData,
      legendData: othersItem ? [...regularItems, othersItem] : regularItems
    };

  }, [messages, users]);


  if (!chartData || chartData.every((d) => d.value === 0)) {
    return (
      <div id="messages-per-user">
        <CardHeader className="flex flex-row items-center space-x-2 pb-2">
          <Users className="h-5 w-5 text-purple-600" />
          <CardTitle className="font-headline">Messages Per User</CardTitle>
          <CardDescription>
            Distribution of messages sent by each person.
          </CardDescription>
        </CardHeader>
        <div className="h-[250px] w-full flex items-center justify-center text-muted-foreground">
          No messages in this date range.
        </div>
      </div>
    );
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Users className="h-5 w-5 text-purple-600" />
          Messages per User
        </CardTitle>
        <CardDescription>
          Distribution of messages sent by each person.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                cursor={false}
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
                labelStyle={{
                  color: "hsl(var(--card-foreground))",
                  fontWeight: "600",
                }}
                itemStyle={{
                  color: "hsl(var(--card-foreground))",
                }}
              />
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  percent,
                }) => {
                  if (percent < 0.05) return null;
                  const RADIAN = Math.PI / 180;
                  const radius =
                    innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return (
                    <text
                      x={x}
                      y={y}
                      fill="hsl(var(--card-foreground))"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      {`${(percent * 100).toFixed(0)}%`}
                    </text>
                  );
                }}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.name === 'Others' ? OTHERS_COLOR : COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-4 text-xs">
          {legendData.map((entry, index) => (
            <div
              key={`legend-${index}`}
              className="flex items-center gap-2"
            >
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor: entry.name === 'Others' ? OTHERS_COLOR : COLORS[index % COLORS.length],
                }}
              />
              <span className="text-muted-foreground truncate flex-1">{entry.name}:</span>
              <span className="font-medium text-foreground">
                {entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </>
  );
}
