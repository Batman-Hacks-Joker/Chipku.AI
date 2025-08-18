"use client";

import * as React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
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

interface CombinedMessagesPerUserChartProps {
  messages1: ChatMessage[];
  users1: string[];
  fileName1: string;
  messages2: ChatMessage[];
  users2: string[];
  fileName2: string;
}

const COLORS = [
  "#C21E56", // Deep magenta
  "#A629D3", // Electric purple
  "#3b82f6", // Blue
  "#f59e0b", // Yellow
];

export function CombinedMessagesPerUserChart({
  messages1,
  users1,
  fileName1,
  messages2,
  users2,
  fileName2,
}: CombinedMessagesPerUserChartProps) {
  const processData = (messages: ChatMessage[], users: string[]) => {
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

    if (sortedUsers.length > 5) {
      const top5 = sortedUsers.slice(0, 5);
      const othersCount = sortedUsers.slice(5).reduce((acc, [, count]) => acc + count, 0);
      const top5Data = top5.map(([name, value]) => ({ name, value }));
      if (othersCount > 0) {
        return [...top5Data, { name: 'Others', value: othersCount }];
      }
      return top5Data;
    }

    return sortedUsers.map(([name, value]) => ({ name, value }));
  };

  const data1 = processData(messages1, users1);
  const data2 = processData(messages2, users2);

  const allUsers = [...new Set([...data1.map(d => d.name), ...data2.map(d => d.name)])];
  const colorMap = allUsers.reduce((acc, user, index) => {
    acc[user] = COLORS[index % COLORS.length];
    return acc;
  }, {} as Record<string, string>);


  const getChatName = (fileName: string) => {
    return fileName
      .replace('WhatsApp Chat with ', '')
      .replace('.txt', '');
  };

  const chatName1 = getChatName(fileName1);
  const chatName2 = getChatName(fileName2);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Message Contribution</CardTitle>
        <CardDescription>
          Comparing message distribution between {chatName1} and {chatName2}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Tooltip
              contentStyle={{
                background: "rgba(20, 20, 20, 0.8)",
                border: "1px solid #555",
                borderRadius: "10px",
                color: "#fff",
                boxShadow: "0 0 10px rgba(0,0,0,0.5)",
              }}
              itemStyle={{ color: "#fff" }}
              cursor={{ fill: 'transparent' }}
            />
            <Legend />
            <Pie
              data={data1}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={50}
              fill="#8884d8"
              paddingAngle={5}
            >
              {data1.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={colorMap[entry.name]} />
              ))}
            </Pie>
            <Pie
              data={data2}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={90}
              outerRadius={120}
              fill="#82ca9d"
              paddingAngle={5}
            >
              {data2.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={colorMap[entry.name]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
